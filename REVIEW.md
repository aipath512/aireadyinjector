# REVIEW.md — What To Check Before Shipping
Repo: aipath512/aireadyinjector · Session: 0001C · v1.0 · 2026-09-04

Run this list before every push to `main`. A "no" anywhere = do not deploy.

---

## A. TRUTH

- [ ] Every number on screen comes from `signals.json` or `pricing.json`, not from code or copy.
- [ ] The signal count shown is 167, families are the six canonical ones.
- [ ] Untestable signals return `na`, never `fail 0` or a silent pass.
- [ ] No synthesis text contradicts the signal table (guard active).
- [ ] Nothing on the page says the injector re-audits itself.
- [ ] Nothing promises citations, ChatGPT visibility, rankings, or legal compliance.
- [ ] Before/after demo numbers are real, timestamped, and reproducible by a stranger.

## B. DECOUPLING

- [ ] The site build does not read from KV at build time. KV is runtime only.
- [ ] The signals served for a client domain contain nothing hardcoded to that client's platform.
- [ ] Removing the Worker leaves the client site fully intact (no origin edits, ever).
- [ ] Rollback is one KV write, no redeploy.

## C. EDGE PROOF (public, no login)

Open the injected domain and verify, in the browser Network tab:

- [ ] `/ai.json` → 200, `content-type: application/json`, no redirect, no challenge
- [ ] `x-ai-ready-level` header present and correct
- [ ] `x-ai-ready-source: kv`
- [ ] `/ai.txt`, `/llms.txt`, `/robots.txt` → 200, `text/plain; charset=utf-8`
- [ ] The four endpoints cross-reference each other, no contradiction
- [ ] The declared money page in `ai.json` actually exists and returns 200
- [ ] A crawler user-agent (GPTBot, ClaudeBot, PerplexityBot) gets no 403 / 503 / challenge

## D. UI STANDARDS

- [ ] Dark/light toggle: top-left, 68px, 34×34, ☀/☾, dark default
- [ ] Light mode: no unreadable text, no rgba on body copy
- [ ] Language dropdown present (single compact select)
- [ ] Header shows GMT time, GitHub version, session number `0001C`
- [ ] Footer: quick links, contact, GDPR, public registry
- [ ] Phone rendered as `40737123540`
- [ ] Mobile: audit table readable at 380px, no horizontal scroll on the checklist

## E. DEPLOY HYGIENE

- [ ] The HTML served is byte-identical to the HTML in GitHub (no Worker route
      injecting extra tags on this zone — this broke the proof manifest on 3webobs)
- [ ] No second Worker route bound to `aireadyinjector.com/*`
- [ ] Secrets set as environment variables, never in the repo
- [ ] `wrangler.toml` cron is a no-op on Pages — cron must live on a real Worker
- [ ] Version bumped in the header, filename of any delivered doc carries version + date

## F. AFTER DEPLOY

- [ ] Re-run the audit on `3webobs.com` and record the new score in `/demos`
- [ ] If the score dropped, revert first, investigate second
