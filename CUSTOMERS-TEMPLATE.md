# /customers/_TEMPLATE.md — Client Dossier
Copy to `/customers/<domain>.md` at onboarding. One file per client domain.
Session: 0001C · v1.0 · 2026-09-04

---

## IDENTITY

- Domain:
- Legal name:
- Registered address:
- Founding date:
- Contact (name / role / email / phone):
- Language(s) of the site:
- Market(s):
- Money page (the URL AI should send buyers to):
- `sameAs` links (LinkedIn, Crunchbase, socials):

## NETWORK PATH

- Path: A (nameservers with us) / B (their Cloudflare) / C (CNAME fallback)
- Chosen on:
- Consequence declared to client: which levels are reachable on this path
- Origin platform (WordPress / static / Webflow / other) — informational only
- Existing SEO/schema plugins detected (dedupe risk):

## STATE

- Current level:
- Level ceiling on this path:
- First audit: score / coverage / confidence / date (GMT)
- Last audit: score / coverage / confidence / date (GMT)
- Last injection: date / version / receipt hash
- Monitoring: on/off · frequency · since
- Drift events (date, signal, action taken):

## APPROVALS ON FILE

| Item | Approved by | Date | Evidence |
|---|---|---|---|
| Organization data (name, address, founding) | | | |
| Prices published in signals | | | |
| Policies / terms | | | |
| EU AI Act transparency declaration | | | |
| HTML-level injection (L6) + canary | | | |

Nothing in the `approval` control class is injected without a row here.

## COMMERCIAL

- Offer sold:
- Price / currency (must match `pricing.json`):
- Billing start:
- Reseller / partner (if any):
- Renewal date:

## HISTORY

```
YYYY-MM-DD  what happened, who did it, what changed
```

## OPEN ITEMS

- [ ]
