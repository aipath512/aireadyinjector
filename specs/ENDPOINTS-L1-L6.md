# /specs/ENDPOINTS-L1-L6.md — Canonical File & Endpoint Set
Repo: aipath512/aireadyinjector · Session: 0001C · v1.0 · 2026-09-04
Status: CANONICAL. This file overrides any level definition written elsewhere.

What the injector publishes on a client hostname, per level. If an endpoint is
not in this table, it does not get injected.

---

## 0. RULES THAT APPLY TO EVERY ENDPOINT

- Served from **KV** by the Worker. Never from the client's origin, never from
  a build step.
- `200` only. No redirect, no challenge, no 403/429 for AI user-agents.
- `Cache-Control: no-store` on policy paths, so a KV write is live instantly.
- `Access-Control-Allow-Origin: *` on all `.json` endpoints.
- Response headers on every managed path:
  `x-ai-ready-level: <n>` · `x-ai-ready-source: kv` · `x-ai-ready-version: <ver>`
- Cross-reference discipline: every endpoint that lists other endpoints must
  list them all, identically. One contradiction = the level fails.
- `ai.json` is the SSOT. Every other artifact is derived from it. If a fact
  appears in two files with two values, `ai.json` wins and the other is a bug.

---

## 1. THE SET, BY LEVEL

| L | Endpoint | Req. | Content-type | Web served | Purpose |
|---|---|---|---|---|---|
| **L1** | `/robots.txt` | REQUIRED | `text/plain; charset=utf-8` | HUMAN + AI | crawl policy, sitemap pointer, explicit AI allow-lane |
| **L1** | `/sitemap.xml` | REQUIRED | `application/xml` | HUMAN + AI | structure discovery (or sitemap index) |
| **L2** | `/llms.txt` | REQUIRED | `text/plain; charset=utf-8` | AI | identity, offer, money pages, endpoint map |
| **L2** | `/ai.txt` | RECOMMENDED | `text/plain; charset=utf-8` | AI | human-readable AI policy summary, declares the level |
| **L3** | `/ai.json` | REQUIRED | `application/json` | AI | SSOT: identity, contacts, solutions, endpoints, policy |
| **L3** | `/entities.json` | REQUIRED | `application/json` | AI | named entity graph (people, org, products, locations) |
| **L3** | `/entity-graph.public.jsonld` | RECOMMENDED | `application/ld+json` | AI | linked-data form of the same graph, schema.org typed |
| **L4** | `/intents.json` | REQUIRED | `application/json` | AI | intent → best landing URL → next action |
| **L4** | `/actions.json` | REQUIRED for A2A | `application/json` | MACHINE | what an agent may *do*: contact, quote, book, audit |
| **L4** | `/.well-known/agent.json` | REQUIRED for A2A | `application/json` | MACHINE | A2A agent card: skills, invocation, terms |
| **L4** | `/allow-lane-matrix.json` | RECOMMENDED | `application/json` | AI + MACHINE | per-crawler permission matrix, machine-readable |
| **L5** | `/ai-ready-proof.json` | REQUIRED | `application/json` | AI + MACHINE | proof bundle: expected endpoints, SHA-256, version, level |
| **L5** | `/healthz` | REQUIRED | `application/json` | MACHINE | worker alive, KV bound, safe-mode state, version |
| **L5** | `/__edge/metrics.json` | OPTIONAL | `application/json` | MACHINE | latency, cache status, counts — non-sensitive only |
| **L6** | `/governance.json` | REQUIRED | `application/json` | AI + MACHINE | governance hub, principles, canonical SSOT pointer |
| **L6** | `/policy.json` | OPTIONAL | `application/json` | AI | only if policy is split out of `ai.json` |
| **L6** | `/changelog.json` | RECOMMENDED | `application/json` | AI + MACHINE | versions and rollbacks of the signal layer |
| **L6** | `/aliases.json` | OPTIONAL | `application/json` | AI | canonical alias map for legacy paths |
| **L6** | `/compliance.json` | REQUIRED in EU | `application/json` | AI + MACHINE | EU AI Act transparency declaration — client-signed |

A level is only claimed when **every REQUIRED endpoint of that level and all
levels below it** passes the DoD in §4. Partial = declare the lower level.

## 2. L6 ON-PAGE SEMANTIC LAYER (not files — still required)

L6 is the first level that touches what a human sees. Two deliverables:

1. **`<head>` injection**: canonical, hreflang, OpenGraph/Twitter, plus JSON-LD —
   Organization, WebSite, WebPage/Service, BreadcrumbList on inner pages.
2. **Visible FAQ in `<body>`** that matches the FAQPage JSON-LD exactly.

Constraint from CLAUDE.md §2: the Worker does not rewrite origin HTML on our own
zones, because that breaks byte-identity with GitHub. On a **client** zone, HTML
rewriting is allowed but must be: additive only, deduplicated against what the
theme already emits, and reversible with one KV flag.

**Safe Mode is mandatory when rewriting HTML.** Themes and SEO plugins already
inject schema and meta. Injecting a second copy creates duplicates, and
duplicates confuse engines rather than help them. Order of operations:
detect → dedupe → normalize → inject. Never inject blind.

**Rollout on client HTML:** canary 10% → measure → 100%, with 1-click rollback.

## 3. THREE-WEB MAPPING (how this feeds the checklist UI)

Each endpoint carries a `web` tag so the audit table's three columns are
populated from one registry:

- **HUMAN → WEB**: sitemap, robots, on-page head, visible FAQ, breadcrumbs
- **WEB → AI**: llms.txt, ai.txt, ai.json, entities.json, entity-graph, intents,
  allow-lane, proof, policy, governance
- **A2A (MACHINE)**: agent card, actions.json, healthz, metrics, invocable
  capability contracts

The A2A column is the one competitors do not have. It stays a first-class
dimension, never folded into "AI".

## 4. DEFINITION OF DONE (per endpoint, run by the auditor, not by us)

```
1. HTTP 200, correct content-type, no redirect chain
2. valid parse (JSON / XML / plain)
3. no contradiction with ai.json
4. every URL it references returns 200
5. crawler user-agent test: GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
   OAI-SearchBot, DeepSeekBot → no 403 / 503 / challenge
6. headers present: x-ai-ready-level, x-ai-ready-source: kv, x-ai-ready-version
7. SHA-256 of the served body matches the receipt in ai-ready-proof.json
```

Verification is always run by `3webobs.com`, independently. Never self-scored.

## 5. ALIASES & DEPRECATIONS

| Legacy path | Canonical | Action |
|---|---|---|
| `/proof.json` | `/ai-ready-proof.json` | 301 |
| `/ssot.json` | `/ai.json` | 301 |
| `/intents` | `/intents.json` | 301 |
| `/governance` | `/governance.json` | 301 |
| `/policy` | `/policy.json` | 301 |

Note: `5thelement.ai` currently serves `ai-proof.json` (v1.1, OTS-anchored).
Client injections use `ai-ready-proof.json`. **These two names must be unified —
see §7 D.**

## 6. PROOF ANCHORING

Every published set produces:
- SHA-256 per artifact, listed in `ai-ready-proof.json`
- an OpenTimestamps anchor for the manifest hash
- a `changelog.json` entry with version, date, and what changed

That triple is the client certificate: publicly verifiable in 60 seconds with
DevTools, no account access.

## 7. CONFLICTS FOUND — RESOLVE BEFORE FREEZING

**A. Level model.** `/context/PRODUCT.md` §6 describes a 4-level model
(L2 = ai.json from KV, L3 = intents, L4 = actions). This spec is the real one.
Replace PRODUCT.md §6 with: *L1 crawl access · L2 AI policy files · L3 SSOT +
entities · L4 intents + actions + agent card · L5 proof + health · L6 governance
+ on-page semantic layer.* Paid floor moves from "L2" to **L3** — that is where
the machine-readable SSOT starts.

**B. Score families.** A recent launch text says "3webobs audits 7 scores: AEO,
GEO, AIO, AI-SEO, AI, ON-SITE, ON-PAGE" — no A2A. The frozen registry is
**6 families / 167 signals with A2A included**. One of the two is wrong in
public copy. Recommendation: keep 6 + A2A; on-site and on-page are *views* of
the same signals, not separate scores.

**C. Signal count.** Another text says "150–400 signals injected progressively".
That contradicts the frozen rule: 167 audited, 140 testable, and far fewer
actually injectable. Do not publish a range.

**D. Proof file name.** `ai-proof.json` (5thelement.ai) vs `ai-ready-proof.json`
(this spec). Pick one for the whole network. Default here: `ai-ready-proof.json`,
with `ai-proof.json` aliased 301 — override if the OTS anchors make that costly.

**E. Currency.** Audit price appears as both 19 € and 19 USD. `pricing.json` is
the single source; the site must render whatever it says, in one currency.
