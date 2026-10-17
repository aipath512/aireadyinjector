#!/usr/bin/env python3
"""C3: audit live COMMON Schema.org across internal HTML pages; standard library only."""
import argparse
import datetime
import html
from html.parser import HTMLParser
import json
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = "https://aireadyinjector.com"
ORG = "https://aiventure.ro/#organization"
SITE = BASE + "/#website"
MAX_PAGES = 150

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.scripts, self.current, self.canonical = [], [], None, None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])
        if tag == "link" and "canonical" in a.get("rel", "").lower().split():
            self.canonical = a.get("href")
        if tag == "script" and a.get("type", "").lower() == "application/ld+json":
            self.current = {"marker": a.get("data-aiventure-0006h"), "data": ""}
    def handle_data(self, data):
        if self.current is not None:
            self.current["data"] += data
    def handle_endtag(self, tag):
        if tag == "script" and self.current is not None:
            self.scripts.append(self.current)
            self.current = None

def normalize(link, source=BASE + "/"):
    url = urllib.parse.urljoin(source, html.unescape(link))
    p = urllib.parse.urlsplit(url)
    if p.scheme != "https" or p.netloc != "aireadyinjector.com":
        return None
    if p.query:
        return None
    path = p.path or "/"
    if path.endswith((".json", ".xml", ".pdf", ".jpg", ".png", ".svg", ".js", ".css", ".txt", ".webp")):
        return None
    return BASE + path

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "AiVenture-C3-Schema-Audit/1.0", "Accept": "text/html"})
    with urllib.request.urlopen(req, timeout=18) as resp:
        content_type = resp.headers.get("Content-Type", "")
        if "text/html" not in content_type.lower():
            return None, resp.status, content_type
        return resp.read(2_000_000).decode("utf-8", "replace"), resp.status, content_type

def verify(url, parser):
    errors, notes = [], []
    marked = [s for s in parser.scripts if s["marker"] == "1"]
    if len(marked) != 1:
        errors.append("Expected exactly one 0006H JSON-LD script; found " + str(len(marked)))
    for s in parser.scripts:
        try:
            s["parsed"] = json.loads(s["data"])
        except json.JSONDecodeError:
            errors.append("Invalid JSON-LD script")
    if len(marked) == 1 and "parsed" in marked[0]:
        graph = marked[0]["parsed"].get("@graph", [])
        nodes = {n.get("@id"): n for n in graph if isinstance(n, dict)}
        expected = {ORG, SITE, url + "#webpage"}
        if marked[0]["parsed"].get("@context") != "https://schema.org":
            errors.append("Incorrect @context")
        if set(nodes) != expected or len(graph) != 3:
            errors.append("Expected three unique COMMON nodes with page-specific WebPage @id")
        page = nodes.get(url + "#webpage", {})
        site = nodes.get(SITE, {})
        if page.get("url") != url:
            errors.append("WebPage.url mismatch")
        if page.get("isPartOf", {}).get("@id") != SITE:
            errors.append("WebPage.isPartOf mismatch")
        if page.get("publisher", {}).get("@id") != ORG:
            errors.append("WebPage.publisher mismatch")
        if site.get("publisher", {}).get("@id") != ORG:
            errors.append("WebSite.publisher mismatch")
    if len(parser.scripts) > 1:
        notes.append("Additional JSON-LD scripts present; check duplicate @ids manually")
    if parser.canonical:
        canon = normalize(parser.canonical, url)
        if canon != url:
            notes.append("Canonical differs from tested URL: " + str(canon))
    return errors, notes

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--output", default="c3-schema-audit.json")
    ap.add_argument("--max-pages", type=int, default=MAX_PAGES)
    args = ap.parse_args()
    queue, seen, results = [BASE + "/", BASE + "/contact/"], set(), []
    while queue and len(seen) < args.max_pages:
        url = queue.pop(0)
        if url in seen:
            continue
        seen.add(url)
        try:
            body, status, content_type = fetch(url)
            if body is None:
                results.append({"url": url, "status": "SKIP", "reason": "Non-HTML", "http": status})
                continue
            parser = PageParser()
            parser.feed(body)
            errors, notes = verify(url, parser)
            results.append({"url": url, "status": "FAIL" if errors else "PASS", "http": status, "errors": errors, "notes": notes})
            for link in parser.links:
                dest = normalize(link, url)
                if dest and dest not in seen and dest not in queue:
                    queue.append(dest)
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            results.append({"url": url, "status": "FAIL", "errors": [str(exc)]})
    summary = {state: sum(x["status"] == state for x in results) for state in ("PASS", "FAIL", "SKIP")}
    report = {"audit": "AiVenture C3 Schema.org COMMON", "site": BASE, "timestamp_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(), "pages_checked": len(results), "summary": summary, "results": results, "limit_reached": bool(queue)}
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(json.dumps({"summary": summary, "report": args.output, "limit_reached": bool(queue)}, ensure_ascii=False))
    return 1 if summary["FAIL"] or not summary["PASS"] else 0

if __name__ == "__main__":
    sys.exit(main())
