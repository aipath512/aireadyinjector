# /routines/DEPLOY.md — Ship It
Repo: aipath512/aireadyinjector · Session: 0001C · v1.0 · 2026-09-04

Two deploys exist and they are unrelated. Never confuse them.

- **Site deploy** — GitHub push → Cloudflare Pages build. Changes what visitors see.
- **Signal write** — KV write. Changes what a client's AI layer serves. No build.

A site deploy must never change a client's signals. A signal write must never
require a site deploy.

---

## A. SITE DEPLOY

1. WHERE: local repo → run through `REVIEW.md` top to bottom. Any "no" stops here.
2. WHERE: github.com → `aipath512/aireadyinjector` → commit to `main`.
3. WHERE: Cloudflare → Workers & Pages → `aireadyinjector` → Deployments.
   WHAT I SEE: build running, then Success.
4. Verify the served HTML matches GitHub byte for byte. If a Worker route on
   this zone is injecting anything into the HTML, remove the route — that is
   what broke the proof manifest on 3webobs.
5. Bump the version shown in the header. Confirm session number renders.
6. Re-run the audit on `3webobs.com` and file the result in `/demos`.
   If the score dropped: revert first, investigate second.

## B. WORKER DEPLOY (the engine)

1. `wrangler deploy` from `/app`.
2. Confirm KV bindings resolve — hit `/healthz`, expect `status: ok`,
   `safeMode` and version echoed.
3. Confirm one managed endpoint on a test hostname returns the right headers:
   `x-ai-ready-level`, `x-ai-ready-source: kv`, `x-ai-ready-version`.
4. Confirm pass-through: a normal page on the test hostname is untouched.

**Cron does not live here.** Cloudflare Pages has no cron; a `wrangler.toml`
cron block in a Pages project silently does nothing. The hourly tick comes from
the real Worker (`aiventure-gdpr`) calling `/cron-tick` with the shared
`CRON_SECRET`. Both projects need the env var set.

## C. SIGNAL WRITE (a client's layer)

1. Render artifacts from `client:<domain>:manifest`.
2. Write KV. Record SHA-256 per artifact into the receipt.
3. Verify live: each endpoint returns 200, correct content-type, `no-store`,
   no redirect, no challenge for AI user-agents.
4. Trigger an independent re-audit on `3webobs`. Never self-score.
5. Append to `changelog.json` and to the client dossier history.

## D. ROLLBACK

- Signals: write the previous manifest version. Live immediately, no build.
- Site: Cloudflare Pages → Deployments → previous deployment → Rollback.
- HTML-level injection on a client zone: flip the KV flag off. Site returns to
  its original state instantly.

Rollback is never a decision to debate under pressure. Roll back, then debug.

## E. SECRETS

`CRON_SECRET`, `PAGESPEED_API_KEY`, auditor API key, Resend key — all as
environment variables on the Cloudflare project. Never in the repo, never in a
committed file, never in a screenshot pasted into chat.
