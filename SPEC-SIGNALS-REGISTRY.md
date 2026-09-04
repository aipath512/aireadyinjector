# /specs/SIGNALS-REGISTRY.md — signals.json Contract
Repo: aipath512/aireadyinjector · Session: 0001C · v1.0 · 2026-09-04

`signals.json` at repo root is the only place a signal count or a signal name
may come from. Copy, UI, reports and API all read from it. Nothing is typed.

---

## 1. SOURCE OF TRUTH

The registry lives in the **3webobs engine**. `signals.json` here is a generated
mirror, never hand-edited, refreshed on deploy and cached at the edge.

One registry, one meaning per ID. The frontend renders exactly what the engine
sends. It must not keep a local copy — two registries with the same IDs and
different meanings is the bug that broke the audit table on 3webobs and forced a
name-mapping hack at render time.

## 2. CANONICAL NUMBERS (frozen 2 Sep 2026)

```
167 criteria, six families:
  AI Signals  19
  AEO         34
  GEO         28
  AIO         31
  SEO         42
  A2A         13
```

- **167** audited
- **140** directly testable · 27 depend on external observation (citations at
  providers, backlinks, Search Console, Google Business) and return `na`
- **injectable** is a much smaller subset — see §4

Public phrasing, approved: *"167 criteria, of which 140 directly testable."*
Never "167 signals injected". Never a range like "150–400".

## 3. RECORD SHAPE

```json
{
  "id": "ai22",
  "family": "AI Signals",
  "name": "Capability Contract Valid",
  "web": "machine",
  "weight": 10,
  "publicly_testable": true,
  "injectable": true,
  "control": "auto",
  "level": 4,
  "endpoint": "/.well-known/agent.json",
  "evidence": "parsed capability contract, safe_to_invoke present",
  "na_reason": null
}
```

| Field | Values | Meaning |
|---|---|---|
| `web` | `human` \| `ai` \| `machine` | which column of the checklist |
| `publicly_testable` | bool | can the auditor verify it from outside |
| `injectable` | bool | can the injector create or fix it at the edge |
| `control` | `auto` \| `approval` \| `monitor` | who authorises the change |
| `level` | 1–6 | which maturity level it belongs to |
| `endpoint` | path or `null` | which artifact carries it |
| `na_reason` | string \| null | why it is `na` when it is |

## 4. THE THREE CONTROL CLASSES

**`auto`** — injected without asking: metadata, JSON-LD, discovery files,
entity graph, intent maps, agent card, headers, allow-lane, sitemap hints.

**`approval`** — injected only after the client signs off: commercial copy,
prices, policies, compliance declarations, `sameAs` links, organization schema
(needs legal name, address, founding date).

**`monitor`** — never injected, only watched: reviews, backlinks, press,
Wikipedia, Crunchbase, rankings, AI citations, author authority, topical depth.

A signal with `injectable: false` must never appear in an injection plan, not
even greyed out as "coming soon". It appears in the report as monitored.

## 5. STATUS VALUES

```
pass    verified present and valid
fail    verified absent or invalid
na      cannot be tested from outside, or does not apply to this site type
```

Rules:
- Never `fail 0` for something untestable. That is a lie that inflates our
  apparent value.
- Never `partial` combined with a score of 100.
- Article/Speakable and similar type-specific signals return `na` when the page
  type does not apply.
- The displayed score always carries **coverage** and **confidence** alongside
  it, per dimension. A score without coverage is meaningless.

## 6. SCORE DISPLAY CONTRACT

```
score      = weighted pass / weighted (pass + fail)      [na excluded]
coverage   = testable / total                             per dimension
confidence = evidence-backed / testable                   per dimension
```

`na` rows stay visible, greyed. Hiding them inflates the perceived score and
the client will eventually notice.

## 7. THE GUARD

Any generated verdict, summary or synthesis text is built deterministically from
the signal results. It is never produced by asking a model with only the URL and
the scores — that produced narratives claiming absences the table contradicted.

A guard blocks rendering if the verdict text negates a signal marked `pass`.

## 8. REGENERATION

```
engine registry  →  signals.json (root)  →  edge cache  →  UI + API + reports
```

If someone edits `signals.json` by hand, the next deploy overwrites it. That is
intentional.
