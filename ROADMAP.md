# ROADMAP.md — What Matters Now
Repo: aipath512/aireadyinjector · Session: 0001C · v1.0 · 2026-09-04

Rewritten every Monday. Nothing outside "This Week" gets built.

---

## THIS WEEK (4–10 Sep 2026)

**Goal: one URL in, one checklist out, one injection live on a real domain.**

| # | Item | Done when |
|---|---|---|
| 1 | Repo + Pages project + custom domain | `aireadyinjector.com` serves index.html from GitHub, SSL active |
| 2 | `signals.json` v1 aligned to 167 / 6 families | file at repo root, generated from the engine registry, not typed |
| 3 | Intake screen (URL field, one button) | user types a URL, sees a 3-column checklist: HUMAN / AI / MACHINE |
| 4 | Audit call to 3webobs | injector calls the 3webobs engine, does not audit by itself |
| 5 | Injection plan generator | missing + injectable signals only, grouped auto / approval / monitor-only |
| 6 | Worker: KV-served signal endpoints | `/ai.json` `/ai.txt` `/llms.txt` `/robots.txt` served from KV with `x-ai-ready-level` + `x-ai-ready-source: kv` headers |
| 7 | First real injection | `3webobs.com` used as the demo target: before score → inject → independent re-audit → after score, both timestamped |
| 8 | "Run again" loop in UI | button re-runs the audit against 3webobs and shows the delta |

**Reference target for the demo:** 3webobs.com. It is our own domain, so the
before/after is honest and reproducible, and it is already the auditor.

## NEXT (after this week, not now)

- Hourly permanence: cron re-check + auto re-injection of drifted signals
- Onboarding for a non-Cloudflare client (see `/specs/INJECTOR-ENGINE.md` §6)
- Client dossier format in `/customers`
- RO language pass on the site
- Public proof registry page + certificate PDF per client

## OUT OF SCOPE (say no)

- Billing / Stripe — waits for 3webobs v3.2 gate (keys, rate limiting, SSRF, prepaid credit)
- Batch / index reports — that is a route on 3webobs.com, not a product here
- Content layer (FAQ copy, rewriting, author pages) — separate engagement, separate price
- Anything that makes the injector audit itself
- Chatbot, CRM, automations — different maturity level, different product
- New signals or new files on 3webobs (frozen since 1 Sep)

## OPEN DECISIONS (need Eli, blocking)

1. Repo name: `aipath512/aireadyinjector` — confirm or change.
2. Does the injector call the 3webobs public API, or does it embed a read-only
   copy of the registry? (API = one truth, slower; copy = faster, drift risk.)
   Recommendation: API, with `signals.json` cached at the edge.
3. Price of injection itself — `pricing.json` here is empty until decided.
   3webobs pricing (19 €/report, 29/49/99 €/mo monitoring) is *audit* pricing,
   not injection pricing.
