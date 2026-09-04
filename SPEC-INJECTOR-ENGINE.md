# /specs/INJECTOR-ENGINE.md — Technical Contract
Repo: aipath512/aireadyinjector · Session: 0001C · v1.0 · 2026-09-04
Status: DRAFT — freeze after the first real injection on 3webobs.com

---

## 1. THE THREE SSOTs

| SSOT | Holds | Changes by |
|---|---|---|
| GitHub | the aireadyinjector.com site itself | git push → Pages build |
| KV | injected signals, per client domain | API write → live instantly |
| Worker | execution logic | wrangler deploy |

Content, signals and execution are three separate things and never leak into
each other. A signal change must never require a site deploy. A site deploy must
never change a client's signals.

## 2. KV KEY MODEL

```
client:<domain>:manifest       → full injection manifest (JSON)
client:<domain>:ai.json        → rendered artifact
client:<domain>:ai.txt         → rendered artifact
client:<domain>:llms.txt       → rendered artifact
client:<domain>:robots.txt     → rendered artifact (merged with origin's)
client:<domain>:intents.json   → L3
client:<domain>:actions.json   → L4
client:<domain>:state          → level, last audit, last injection, drift flags
```

Rendered artifacts are written by the plan executor, never hand-edited.
`manifest` is the truth; artifacts are derived and can always be regenerated.

## 3. WORKER BEHAVIOUR

On every request to a managed hostname:

1. Is the path one of the managed endpoints?
   → serve from KV. `no-store`. Correct content-type. No redirect. No challenge.
   → set `x-ai-ready-level: <n>` and `x-ai-ready-source: kv`.
2. Is the user-agent an AI crawler on a policy path?
   → allow-lane: never challenge, never rate-limit.
3. Everything else → pass through to origin, untouched.

Pass-through is the default. The Worker must be invisible for human traffic.
It must not inject scripts or tags into the origin HTML — that broke the proof
manifest on 3webobs (served HTML stopped matching GitHub).

## 4. THE AUDIT → PLAN → INJECT PIPELINE

```
POST /api/audit      { url }
   → calls the 3webobs engine
   → returns { score, coverage, confidence, signals[167] }
   → each signal: { id, family, web: human|ai|machine, status: pass|fail|na }

POST /api/plan       { url, auditId }
   → filters: status = fail AND injectable = true AND controllable = true
   → groups: auto | needs_approval | monitor_only
   → returns an ordered plan with expected delta per item
   → NEVER includes reviews, backlinks, rankings, AI citations

POST /api/inject     { url, planId, approvedItems[] }
   → renders artifacts → writes KV → returns a receipt with SHA-256 per artifact

POST /api/verify     { url }
   → calls 3webobs again, independently
   → returns before/after, per web column
   → this is "RUN AGAIN"
```

Rule: `/api/verify` MUST call the external auditor. It must never compute a
score from our own manifest. If 3webobs is unreachable, verification fails —
it does not fall back to self-assessment.

## 5. THE CHECKLIST UI (3 columns)

One table, 167 rows, three columns — the same shape as 3webobs so the client
sees continuity between audit and injection:

| Signal | HUMAN → WEB | WEB → AI | A2A (MACHINE) | Injectable | Status |
|---|---|---|---|---|---|

Filters: family, web, status, injectable-only.
Default view after an audit: **injectable + failing**, because that is the plan.
`na` rows are visible but greyed — hiding them would inflate the perceived score.

## 6. ONBOARDING PATHS (the platform-agnostic question, honestly)

The injector is platform-agnostic about the *CMS*. It is not agnostic about the
*network path* — signals are served at our Edge, so traffic must reach it.
Three supported paths, ranked:

**Path A — full delegation (best).**
Client moves nameservers to our Cloudflare account, or we join theirs as a
member. Worker routes bind to `client.com/*`. Full L1–L4 available.
Client cost: a DNS change. Site untouched.

**Path B — client keeps their own Cloudflare.**
We ship a Worker + KV namespace into their account, or they add our route.
Same capability as A. Requires them to grant access or run one wrangler command.

**Path C — no Cloudflare, no DNS change (fallback).**
We serve the manifest on a delegated subdomain (`ai.client.com` via one CNAME)
and the client adds four redirect/proxy rules or a one-line snippet so the root
endpoints resolve. Weaker: some header-level signals are not achievable.
Declare the level honestly as L1/L2-partial. Never sell C as A.

Write the chosen path into `client:<domain>:state`. The certificate must name it.

## 7. PERMANENCE (hourly)

Cloudflare **Pages does not support cron**. `wrangler.toml` cron in a Pages
project is a no-op — this cost days on 3webobs.

Correct pattern, already proven: a real Worker holds the Cron Trigger and calls
a protected endpoint here.

```
Cron Worker (hourly) → POST /cron-tick   header: x-cron-secret: <CRON_SECRET>
   → for each active client: re-audit → diff vs manifest → re-inject drift
   → log to client:<domain>:state
```

`CRON_SECRET` is an env var on both projects. Never in the repo.

## 8. PROOF LAYER

Every injection produces a public, loginless proof:

- SHA-256 of each artifact, stored in the receipt
- `x-ai-ready-level` + `x-ai-ready-source: kv` on the live response
- the four endpoints cross-referencing each other
- the declared money page returning 200
- before/after scores from the independent auditor, both timestamped GMT

That set is the client certificate. Anyone can verify it in 60 seconds with
DevTools and no access to our account.

## 9. FAILURE MODES TO DESIGN AGAINST

- Two unsynchronised signal registries (frontend vs worker) — happened on
  3webobs, IDs matched but meanings differed. Here: **one registry, the worker's.
  The frontend renders what the worker sends. No local copy.**
- A second Worker route on the same zone injecting duplicate tags.
- Cached artifacts served after a KV update → always `no-store` on policy paths.
- Origin robots.txt fighting the injected one → merge, log the conflict, show it.
- Client changes their site and drops a signal → drift detection catches it hourly.
