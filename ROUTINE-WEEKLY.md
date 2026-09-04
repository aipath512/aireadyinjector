# /routines/WEEKLY.md — Monday Reset
Repo: aipath512/aireadyinjector · Session: 0001C · v1.0 · 2026-09-04

Thirty minutes, every Monday. The point is to throw things out, not to add them.

---

## 1. CLOSE LAST WEEK

- Move finished items out of `ROADMAP.md` → one line each in the changelog.
- Anything not finished: it either moves to This Week again, or it dies. No
  item survives three weeks in the roadmap. Three weeks means it is not real.
- File any before/after run from last week in `/demos`.

## 2. REWRITE "THIS WEEK"

- Maximum eight items. If there are more, the week is already lost.
- Every item needs a "done when" that someone else could verify.
- Anything without a "done when" goes to NEXT, not to THIS WEEK.

## 3. REFRESH "OUT OF SCOPE"

Add whatever tempted you last week. Written down, it stops coming back.
Standing entries: billing before the API gate, batch reports, content services,
new signals on 3webobs, anything that makes the injector audit itself.

## 4. OPEN DECISIONS

List only decisions that block work. For each: the options, the recommendation,
and what happens if it stays undecided another week.

## 5. HEALTH CHECK (5 minutes)

- `/healthz` on the engine → `ok`
- Hourly tick fired in the last hour → check the log
- Self-audit of `aireadyinjector.com` → score not lower than last week
- `signals.json` version matches the engine registry
- `pricing.json` matches what the site renders

## 6. CLIENT SWEEP

- Any drift event unresolved for more than 48 hours → escalate.
- Any client on Path C who could move to A or B → offer the upgrade.
- Any approval-class item pending more than a week → chase or drop it.

## 7. THE HONESTY PASS

Read one page of the live site as a stranger. Does anything on it promise
something we cannot deliver — citations, rankings, compliance, guarantees?
Fix it the same day. This is the cheapest possible time to catch it.
