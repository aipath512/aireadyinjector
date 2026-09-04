# CLAUDE.md — Operating Manual
Repo: aipath512/aireadyinjector · Session: 0001C · v1.0 · 2026-09-04

This file tells Claude how to work in this repo. Read it first, every session.

---

## 1. WHO

- Company: AiVenture S.R.L., București (CUI 51415878)
- Owner / only developer: Dan Ionescu ("Eli"), solo founder
- Canonical hierarchy:
  `AiVenture S.R.L.` → flagship `5thelement.ai` → product `AI-READY INJECTOR™`
  → product site `aireadyinjector.com` → audit engine `3webobs.com`
- Language: **EN is primary** for all shipped content. RO is secondary (UI toggle only).

## 2. WHAT THIS REPO IS

`aireadyinjector.com` = the site **and** the execution engine of the product.
It runs on its own Cloudflare Worker + Pages project, NOT on `edge.5thelement.ai`.
Reason: the product must stay separable and licensable.

Two things live here and must never be confused:

| Layer | What it is | Where it lives |
|---|---|---|
| SITE | marketing + intake + report UI | Cloudflare Pages (GitHub = SSOT) |
| SIGNALS | the injected AI signals for *client* domains | Cloudflare KV (KV = SSOT) |

**Decoupling rule (non-negotiable):** the signals layer never depends on the
client's platform. WordPress, Webflow, Shopify, static, custom — irrelevant.
Signals are served at the Edge, from KV, on the client's own hostname.

## 3. THE CUSTOMER

The buyer is a business owner or agency that already has a website and does not
want to touch it. They are not buying an audit. They are buying **permanent
presence in the three webs**:

- Human Web — people, browsers, Google
- AI Web — ChatGPT, Claude, Perplexity, Gemini, AI Overviews
- Machine Web (A2A) — agents talking to agents

Score 80–90 is a technical indicator only. Value is measured in non-branded
appearances, AI citations, leads, and A2A transactions.

## 4. QUALITY BAR

Hard rules. Breaking one is a bug, not a style choice.

1. **167 is the canonical number of audited criteria**, across six families:
   AI Signals 19 · AEO 34 · GEO 28 · AIO 31 · SEO 42 · A2A 13.
   `aireadyinjector.com` aligns to 167. Never publish 156.
2. **167 audited ≠ 167 injectable.** Public wording: 167 criteria, of which 140
   directly testable. The injector adds only the missing *technical, controllable*
   signals. Reviews, backlinks, rankings and AI recommendations belong to other
   platforms and can only be monitored.
3. **The injector never re-audits its own work.** `3webobs.com` re-audits,
   independently. The phrase "the injector re-audits" is banned in all copy.
4. **No invented data.** No fake scores, no placeholder metrics presented as real,
   no synthesis that contradicts the signal table. If a signal cannot be tested,
   it returns `na`, never `fail 0`.
5. **Never claim:** "AI will cite you", "you will appear in ChatGPT Browse",
   "this replaces content strategy". Citations are earned, not installed.
6. **Never claim legal certification.** Technical readiness only.
7. Numbers are never typed by hand. `signals.json` and `pricing.json` at repo
   root are the single sources. Copy reads from them.
8. Every page carries the session number (`0001C` until changed) and a GMT clock.

## 5. HOUSE STYLE (UI)

- Visual reference: `3webobs.com` (same engine family, same audit table feel),
  nav pattern borrowed from `ecbtax.com` (file-style nav, section comments).
- Dark/light toggle: fixed top-left, 68px from top, 34×34px rounded, ☀/☾, dark default.
- Light-mode rule: `body.light-mode * { color:#0a0a0a !important }` — never rgba
  for readable text.
- Language selector: single compact dropdown, not a row of pills.
- Header: login + language + date/time (GMT) + GitHub version + session number.
- Footer: quick links, contact, GDPR/legal, public registry link.
- Phone format everywhere: `40737123540`.
- Email sender: `contact@5thelement.ai` via Resend (account `aipath512`).

## 6. HOW TO ANSWER ME

- Breadcrumb format for every action, no exceptions:
  **WHERE I am → WHAT I click → WHAT I see → WHAT I do next.** Never skip a step.
- Before showing any generated file, show a header first:
  file number · exact GitHub upload path · resulting live URL · one-line description.
- Every delivered filename contains version and date (they go to Drive).
- One file at a time. Full file content, never diffs, unless I ask for a patch.
- If something I ask contradicts section 4, say so before writing code.

## 7. FOLDERS

```
/app        production site + worker source
/context    what the product is, positioning, market  (read before writing copy)
/customers  per-client dossiers and injection state
/specs      frozen technical contracts
/demos      before/after proofs, screenshots, recordings
/routines   repeatable procedures (deploy, audit, onboard, monthly)
```

Root: `CLAUDE.md` (this file), `ROADMAP.md`, `REVIEW.md`,
`signals.json`, `pricing.json`.
