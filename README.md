# AI-READY INJECTOR — Repo as Desk
Repo: aipath512/aireadyinjector · Session: 0001C · v1.0 · 2026-09-04

The repo is the desk. The files are the operating manual.
`aireadyinjector.com` = product site + execution engine for AI-READY INJECTOR™.

---

## START HERE, EVERY SESSION

1. `CLAUDE.md` — how to work. Non-negotiable rules. Read first.
2. `ROADMAP.md` — what is being built this week. Nothing else gets built.
3. `REVIEW.md` — the checklist before any push to `main`.

## MAP

```
/                       CLAUDE.md  ROADMAP.md  REVIEW.md  README.md
                        signals.json  pricing.json        <- single sources, generated
/app                    index.html, _worker.js, assets    <- the shipped site + engine
/context   PRODUCT.md   what we sell, the three webs, the boundary
           MARKET.md    who buys, why, where, in what order
           OBJECTIONS.md what they say back, and the honest answer
/specs     ENDPOINTS-L1-L6.md   canonical file/endpoint set per level
           INJECTOR-ENGINE.md   KV model, worker behaviour, pipeline
           SIGNALS-REGISTRY.md  signals.json contract, injectable flag
           SITE-PAGES.md        page map + audit screen UI
/customers _TEMPLATE.md  one file per client: state, path, level, history
/demos     _TEMPLATE.md  one file per proof: before/after, timestamped
/routines  DEPLOY.md  ONBOARD-CLIENT.md  WEEKLY.md
```

## THE PRODUCT IN ONE PARAGRAPH

A business gives a URL. `3webobs.com` audits it independently across 167
criteria in three webs — Human, AI, Machine (A2A). The injector takes only the
missing, technical, controllable signals and publishes them at the Cloudflare
Edge from KV, on the client's own hostname, without touching their site, CMS or
theme. `3webobs.com` re-audits. The delta is shown. An hourly loop detects drift
and re-injects. The client buys the loop staying on, not a report.

## THE FIVE RULES YOU WILL BREAK IF YOU SKIM

1. 167 audited criteria ≠ 167 injectable signals. 140 testable. Far fewer injectable.
2. The injector never verifies its own work. `3webobs` does, always.
3. Untestable signals return `na`, never `fail 0`.
4. Never promise citations, rankings, ChatGPT visibility, or legal compliance.
5. Numbers come from `signals.json` and `pricing.json`. Never typed into copy.

## STATUS

Site: not deployed. Engine: not built. First target: `3webobs.com` as the
demo injection, because it is our own domain and the before/after is verifiable
by a stranger.
