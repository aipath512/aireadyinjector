# /specs/SITE-PAGES.md — Page Map & Audit Screen
Repo: aipath512/aireadyinjector · Session: 0001C · v1.0 · 2026-09-04

What `aireadyinjector.com` actually contains, and how the main screen behaves.

---

## 1. PAGE MAP

| Path | Purpose | Priority |
|---|---|---|
| `/` | the question, the three webs, the URL field | P0 |
| `/audit/` | result: 167-row checklist, three columns | P0 |
| `/plan/` | injection plan derived from the audit | P0 |
| `/how-it-works/` | the loop, edge vs CMS, what we never claim | P1 |
| `/levels/` | L1→L6, what each level publishes and proves | P1 |
| `/proof/` | public registry of injected domains + certificates | P1 |
| `/pricing/` | rendered from `pricing.json`, one currency | P1 |
| `/book/` | *Can AI Find Your Business?* — the companion book | P2 |
| `/partners/` | ECBTax and other partners, mirrored both ways | P2 |
| `/contact/` | form + phone `40737123540` + email | P1 |
| `/legal/`, `/privacy/`, `/cookies/` | GDPR set | P1 |

Every page carries: dark/light toggle, language dropdown, GMT clock, GitHub
version, session number `0001C`, footer with quick links + contact + GDPR +
registry link.

## 2. HOME — ABOVE THE FOLD

Headline: **Can AI find your business?**
Sub: Discovered, trusted and chosen across Google, AI search, and the
agent-to-agent web. No website rebuild.
One field. One button. Nothing else competing with it.

Below: the three webs as three cards — Human / AI / Machine — with the honest
line "you can rank on Google and be absent from the other two."

Never put a price above the fold. The audit is free; that is the offer.

## 3. THE AUDIT SCREEN

Same table shape as `3webobs.com`, so audit and injection feel like one system.

```
Signal | HUMAN → WEB | WEB → AI | A2A (MACHINE) | Injectable | Status
```

- Default filter after a run: **injectable + failing**. That is the plan.
- Filters: family, web, status, injectable-only, level.
- `na` rows visible but greyed, with the reason on hover.
- Score header shows score + coverage + confidence per dimension, plus the GMT
  timestamp of the run and the auditor's name (`3webobs`) — visibly external.
- Mobile: the table must stay readable at 380px. Collapse to one card per signal
  with three status chips rather than horizontal scroll.

**RUN AGAIN** button: re-calls the independent auditor and shows the delta,
per column, against the previous run. History is kept and dated.

## 4. THE PLAN SCREEN

Three groups, in this order, never merged:

1. **Automatic** — will be injected on confirm.
2. **Needs your input** — organization data, prices, policies, sign-offs.
3. **Monitored only** — reviews, backlinks, rankings, AI citations. Shown with
   the line: *not ours to install; we watch these and tell you when they move.*

Each row shows the level it unlocks and the endpoint it lands on.
Footer of the plan: the current level, the level after injection, and what is
still missing for the next one.

## 5. VISUAL SYSTEM

- Reference: `3webobs.com` for the audit table, `ecbtax.com` for the nav
  pattern (file-style nav, section comments, trust and proof layer, public
  registry in the footer).
- Dark default. Toggle fixed top-left, 68px from top, 34×34px rounded, ☀/☾.
- Light mode: `body.light-mode * { color:#0a0a0a !important }`. No rgba on body
  text. Watch inverted-background buttons — the dark rule once forced white text
  onto white buttons on 3webobs.
- Language: one compact dropdown, EN default, RO available. Not a row of pills.

## 6. WHAT DOES NOT GO ON THIS SITE

Batch/index reports (that is a route on `3webobs.com`), chatbot, CRM, content
services, and any claim from the banned list in `CLAUDE.md` §4.
