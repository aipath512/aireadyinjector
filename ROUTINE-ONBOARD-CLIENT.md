# /routines/ONBOARD-CLIENT.md — From URL To Live Layer
Repo: aipath512/aireadyinjector · Session: 0001C · v1.0 · 2026-09-04

Target: first injection live within 24 hours of signature.

---

## STEP 1 — FREE AUDIT (no commitment, no access)

- Client gives a URL. `3webobs` audits it. Nothing is installed.
- Output: the 167-row checklist, three columns, score with coverage and
  confidence, GMT timestamp.
- Send it whether or not they buy. It is the best sales asset we have.

## STEP 2 — PLAN

- Filter to injectable + failing. Group into auto / approval / monitor.
- State the current level and the level after injection.
- State plainly what stays impossible: reviews, backlinks, press, rankings,
  AI citations.

## STEP 3 — CHOOSE THE NETWORK PATH (the only real dependency)

- **A** — client moves nameservers to our Cloudflare, or adds us to theirs.
  Full L1–L6. Cost to them: a DNS change. Site untouched.
- **B** — client keeps their own Cloudflare; we deploy Worker + KV into it.
  Same capability as A. Needs access or one command from them.
- **C** — no Cloudflare, no nameserver change. One CNAME on a subdomain plus a
  few rules. Some header-level signals are unreachable. Declare L1/L2-partial
  honestly and price accordingly. Never sell C as A.

Record the choice and its ceiling in the client dossier. The certificate names it.

## STEP 4 — COLLECT THE APPROVAL-CLASS DATA

Legal name · registered address · founding date · `sameAs` links · contact ·
money page · prices to publish (or none) · EU AI Act transparency sign-off.

Nothing in the approval class is injected without a row in the dossier.

## STEP 5 — INJECT

- Build the manifest, render artifacts, write KV, record hashes.
- Levels up to L5 touch no HTML at all.
- L6 HTML injection only with Safe Mode on: detect existing schema → dedupe →
  normalize → inject. Canary 10% first, then 100%. Rollback is one flag.

## STEP 6 — INDEPENDENT RE-AUDIT

`3webobs` runs again. Record before/after in `/demos`. If the delta is smaller
than promised, say so and fix it — do not re-score it ourselves.

## STEP 7 — HAND OVER THE PROOF

The certificate contains: level, endpoints, money page, verification steps a
non-technical person can follow, the DevTools header check, SHA-256 hashes, and
the two timestamped scores. Publicly checkable without our account.

## STEP 8 — TURN ON THE LOOP

- Hourly tick: re-check, detect drift, re-inject what regressed.
- Monthly: send the delta report and the changelog.
- When their site changes and a signal disappears, they hear it from us first.
  That is the subscription.

## THINGS THAT GO WRONG, AND WHAT THEY LOOK LIKE

| Symptom | Cause | Fix |
|---|---|---|
| Endpoint returns a challenge page | WAF / Bot Fight Mode on the client zone | allow-lane exception on policy paths |
| Old content after a KV write | missing `no-store` | fix cache header, purge |
| robots.txt contradicts the origin's | origin still serving its own | merge, log the conflict, show it to the client |
| Duplicate schema on the page | theme/plugin already injects | Safe Mode dedupe; if unresolved, do not inject |
| Score drops after the client edits their site | drift | hourly tick catches it; report, do not hide |
