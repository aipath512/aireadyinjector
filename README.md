# aireadyinjector.com

Product site for **AI-READY INJECTOR™**, a product of AiVenture S.R.L.
(5thelement.ai). Static site, deployed from this repo to Cloudflare Pages.

## Deploy

Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git →
this repo. Framework preset: **None**. Build command: empty.
Build output directory: `/` (root). Then Custom domains → add
`aireadyinjector.com` and `www.aireadyinjector.com`.

## Files

| Path | What it is |
|---|---|
| `index.html` | The site, English. Romanian is available through the header toggle. |
| `ro/index.html` | Romanian route, generated from `index.html`. Regenerate, don't hand-edit. |
| `pricing.json` | **Single source of price.** Both pages render from it. No price in HTML. |
| `robots.txt` | Explicit Allow for GPTBot, ClaudeBot, PerplexityBot, Google-Extended. |
| `sitemap.xml` | Both language routes with hreflang. |
| `llms.txt` | Plain-language summary for LLM context windows. |
| `ai.json` | Entity manifest, capabilities, boundaries, registry counts. |
| `entities.json` | Declared entity graph and relationships. |
| `intents.json` | Question to answer mapping for agents and assistants. |
| `.well-known/agent.json` | A2A agent card. Skills declared, marked not yet operational. |

## Rules

- Signal count is **156** (27 · 33 · 28 · 26 · 42). Never 167.
- ADI levels are **L0–L5**. Never L1–L6.
- Prices live only in `pricing.json`. The published Product offer and the
  approved entry price in `pricing.json` must always match.
- Scoring belongs to 3webobs. This site never scores anything.
- "Readiness", never "compliant" or "certified".
- Skills in the agent card are `declared_not_operational` until the secured API
  ships. Do not flip that flag before the endpoint exists.

## SEO and structured-data rules

- Exactly one H1 per HTML page. H2 and H3 reflect real section nesting.
- Breadcrumbs belong on internal pages only, never on `/` or `/ro/`.
- FAQ text in JSON-LD must also be visible in the page.
- Do not add reviews or aggregate ratings until genuine reviews are visible.
- Cloudflare Pages uses `404.html` to prevent SPA-style soft 404 responses.
- Cookie consent is required before adding non-essential analytics.
