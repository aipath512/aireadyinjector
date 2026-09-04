# /specs/COMPLIANCE-RRVI.md — AI Act, GDPR, and the RRVI Layer
Repo: aipath512/aireadyinjector · Session: 0001C · v1.0 · 2026-09-04

Three new routes, one architectural rule: **do not build a second registry.**
RRVI already exists and holds AiVenture's governance corpus. This site consumes
it, it does not clone it.

---

## 1. WHY THIS BELONGS ON THE PRODUCT SITE, NOT JUST ON EU-AI-ACT.RO

Four signals in the registry are compliance signals, and they are injectable:

| ID | Signal | Weight | What satisfies it |
|---|---|---|---|
| `ai16` | EU AI Act Transparency Declaration | 7 | `/ai-act/` + `compliance.json` |
| `ai17` | AI Governance Declaration | 8 | `governance.json` |
| `ai6` | SHA-256 Integrity Manifest | 8 | `ai-proof.json` with per-artifact hashes |
| `ai32` | Claim-to-Evidence Traceability | **10** | every public claim resolves to a verifiable document |
| `geo25` | Integrity Manifest Presence and Validity | 7 | same manifest, GEO dimension |
| `ai7` | Independent Timestamp or Signature Evidence | 8 | OpenTimestamps anchor |

`ai32` carries weight 10 — the maximum. It is the signal that says: a claim on
your site can be followed to a document that proves it. RRVI is exactly that
mechanism. So compliance is not a legal sidebar here; it is six injectable
signals and the heaviest one in the AI Signals dimension.

We sell "your claims are traceable". We must be the first domain where that is
true.

## 2. THE THREE ROUTES

| Route | Purpose | Priority |
|---|---|---|
| `/ai-act/` | Where AI is used on this site and where it is not (Art. 50) | P1 |
| `/gdpr/` | What data is processed, why, retention, rights | P1 |
| `/governance/` | The RRVI registry view: AiVenture's governance corpus, each document with its ID, hash and verification link | P1 |

`/cookies/` and `/legal/` stay as already listed in `SITE-PAGES.md`.

## 3. `/ai-act/` — WHAT IT MUST SAY

Follow the pattern already live on `3webobs.com/ai-act`: a plain statement of
where AI is and is not in the loop.

Truthful statements for this product:

- The audit score is deterministic. No language model produces a verdict.
- The injection plan is derived by rules from the signal registry, not generated.
- Rendered artifacts come from the client's own declared data plus templates.
- Where a model is used at all (copy drafting, translation), say so and say the
  output is human-reviewed before publication.
- We are a **deployer**, not a provider of a high-risk system. State it, and
  state that this is our own classification, not a certification.
- No automated decision produces a legal or similarly significant effect on
  anyone.

And the boundary sentence: this is a technical declaration, not a legal opinion
and not a conformity certificate. For a formal classification under Regulation
(EU) 2024/1689, independent legal analysis is required.

## 4. `/gdpr/` — WHAT IT MUST SAY

- Data collected: the audited URL, the email a report is sent to, timestamps.
- No tracking code is added to the audited site. No authentication is attempted.
  No private area is accessed. The audit reads only publicly served resources.
- Retention: run store 90 days, matching the report retention already promised.
- Client dossiers: kept for the duration of the contract plus statutory period.
- Processor relationships: Cloudflare (edge, storage), Resend (email delivery).
- Rights, and the address to exercise them.
- The GDPR/cookie consent worker (`aiventure-gdpr`) is loaded here as on the
  rest of the network.

## 5. `/governance/` — THE RRVI VIEW

AiVenture's governance corpus (~80 documents) is already registered. This page
is a **reader**, not a second store.

**Where the truth lives (unchanged):**
- Table `rrvi_documents` in D1 `eu-ai-act-db`
- Generator worker on the eu-ai-act.ro side
- Public endpoint: `GET /verify?doc=<ID>` or `?hash=<sha256>`
- Deterministic ID: `<CODE>-<COMPANY_SLUG>-<8 hex of sha256>`
  e.g. `PROC-001-AIVENTURE-SRL-00A96748`
- The fingerprint is always computed on the **Markdown**, whatever format is
  delivered — otherwise one document would have two fingerprints.

**What this page renders:** for each document, its code, title, category,
version, date, SHA-256, and a verification link. Nothing else.

**Hard privacy rule, already set:** `/verify` is public and unauthenticated, so
it must never return the name of the responsible person. That rule extends
here — no personal names in the rendered list either.

**No per-company enumeration.** Search by ID or by hash only. Listing clients
by company name would turn a verification tool into a customer list.

## 6. HOW THE TWO DOMAINS CONNECT

```
aireadyinjector.com/governance/   →  reads  →  eu-ai-act.ro /verify
        (view)                                    (registry, D1)
```

Two options, pick one and record it:

- **A. Link out.** The verify link points at `eu-ai-act.ro/verify?doc=…`.
  Simplest, zero new infrastructure, and the visitor sees the registry lives
  somewhere independent — which is arguably better evidence.
- **B. Proxy.** `aireadyinjector.com/verify` proxies to the same endpoint, so
  the URL stays on this domain. Better for `ai32`, one more moving part.

Recommendation: **A now, B later**, once the registry workers are renamed off
their `-test` suffix.

## 7. THE RRVI OFFER — WHAT MAY AND MAY NOT APPEAR HERE

RRVI has its own commercial structure, and it is **not decided**. Until it is,
this site may describe RRVI as infrastructure we operate and demonstrate on our
own corpus. It may not publish RRVI prices, tiers, or partner terms.

The positioning line that survives regardless, and is worth using:
> The AI Act says what must be complied with. RRVI shows whether an
> organisation can demonstrate that it complies.

## 8. RISK: THE SAFE BROWSING PRECEDENT

`eu-ai-act.ro` was flagged by Google Safe Browsing shortly after a `.well-known/`
directory with unfamiliar JSON was published on a young domain. The flag was
lifted, but the cause was never confirmed and `.well-known/` was removed.

`aireadyinjector.com` is a brand-new domain and the endpoint spec calls for
`/.well-known/agent-card.json` at L4. So:

- Ship the human pages and the root-level files first.
- Add `.well-known/` only after the domain has a few weeks of normal traffic.
- If a warning appears, remove `.well-known/` immediately and open a Search
  Console review — the endpoint underneath keeps working, it is only
  undiscoverable without the card.
- Record this in `REVIEW.md` section E as a deploy-order rule, not a preference.

## 9. DEFINITION OF DONE

- [ ] `/ai-act/`, `/gdpr/`, `/governance/` return 200 and are linked in the footer
- [ ] `compliance.json` and `governance.json` served from KV, consistent with the pages
- [ ] Every claim on `/ai-act/` resolves to a document ID in the registry (`ai32`)
- [ ] `ai-proof.json` lists a SHA-256 for every published artifact (`ai6`, `geo25`)
- [ ] An OpenTimestamps anchor exists for the manifest (`ai7`)
- [ ] `/verify` returns no personal names
- [ ] No company-name enumeration anywhere
- [ ] A stranger can pick any claim on the site and verify it in under 60 seconds
