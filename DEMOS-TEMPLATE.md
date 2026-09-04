# /demos/_TEMPLATE.md — Proof Record
Copy to `/demos/<domain>-<YYYY-MM-DD>.md`. One file per before/after proof.
Session: 0001C · v1.0 · 2026-09-04

A proof is only a proof if a stranger can reproduce it without our account.

---

## SUBJECT

- Domain:
- Network path (A / B / C):
- Level before → level after:
- Injection version / receipt hash:

## BEFORE

- Auditor: 3webobs.com (independent)
- Run at (GMT):
- Score / coverage / confidence, per dimension:
- Failing injectable signals (count and IDs):
- Screenshot / raw JSON: `demos/assets/...`

## THE INJECTION

- Signals injected (IDs, control class):
- Endpoints published:
- Items requiring approval, and who approved them:
- Items deliberately left alone, and why:

## AFTER

- Auditor: 3webobs.com (independent, same registry version)
- Run at (GMT):
- Score / coverage / confidence, per dimension:
- Delta, per web column (Human / AI / Machine):
- Screenshot / raw JSON:

## PUBLIC VERIFICATION STEPS (what we hand the client)

1. Open `https://<domain>/ai.json` — check `level` and the declared money page.
2. Open `/ai.txt`, `/llms.txt`, `/robots.txt` — check they reference each other.
3. Right-click → Inspect → Network → refresh → click `ai.json` → Response
   Headers → `x-ai-ready-level` and `x-ai-ready-source: kv`.
4. Compare the SHA-256 in `/ai-ready-proof.json` with the served body.

No login. No DevTools required for steps 1–2.

## HONESTY CHECK BEFORE PUBLISHING

- [ ] Both runs used the same registry version
- [ ] Nothing was hand-edited between the runs
- [ ] `na` rows were not converted to passes
- [ ] The delta is not attributed to signals we only monitor
- [ ] Client consented to being named publicly
