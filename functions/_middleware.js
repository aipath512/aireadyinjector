
/**
 * AiVenture 0006H — Schema.org + META FAMILY
 * Cloudflare Pages Functions
 *
 * NETWORK → SITE → SECTION → PAGE
 *
 * KV binding: SCHEMA_KV
 * Original Schema.org key is preserved.
 */

const KV_KEY = "schema:0006H:aireadyinjector:homepage";

const SITE = "https://aireadyinjector.com";

const HEAD_KEYS = [
  "head:v1:network:common",
  "head:v1:site:aireadyinjector",
  "head:v1:page:aireadyinjector:home"
];

const escapeAttr = v =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const safeJson = value =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

const validGraph = x =>
  x?.["@context"] === "https://schema.org" &&
  Array.isArray(x?.["@graph"]);

const metaTags = (html, cfg) => {
  const tags = [];

  const has = re => re.test(html);

  const add = (attr, name, value) => {
    if (typeof value !== "string" || !value.trim()) return;

    const re = new RegExp(
      '<meta\\b(?=[^>]*\\b' +
      attr +
      '\\s*=\\s*["\\x27]' +
      name.replace(
        /[.*+?^$\{\}()|[\]\\]/g,
        "\\$&"
      ) +
      '["\\x27])[^>]*>',
      "i"
    );

    if (!has(re)) {
      tags.push(
        '<meta ' +
        attr +
        '="' +
        escapeAttr(name) +
        '" content="' +
        escapeAttr(value) +
        '">'
      );
    }
  };

  const m = cfg.meta_family || {};

  if (
    !has(/<meta\b[^>]*charset\s*=/i) &&
    m.html_core?.charset
  ) {
    tags.push(
      '<meta charset="' +
      escapeAttr(m.html_core.charset) +
      '">'
    );
  }

  add("name", "viewport", m.html_core?.viewport);

  add("name", "robots", m.seo?.robots_default);

  add("name", "description", m.seo?.description);

  add("name", "author", m.identity?.author);

  for (const [k, v] of Object.entries(m.open_graph || {})) {
    add("property", k, v);
  }

  for (const [k, v] of Object.entries(m.twitter_x || {})) {
    add("name", k, v);
  }

  if (
    !has(
      /<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/i
    ) &&
    m.seo?.canonical === SITE + "/"
  ) {
    tags.push(
      '<link rel="canonical" href="' + SITE + '/">'
    );
  }

  if (
    !has(/<title\b/i) &&
    typeof m.html_core?.title === "string"
  ) {
    tags.push(
      "<title>" +
      escapeAttr(m.html_core.title) +
      "</title>"
    );
  }

  return tags;
};

const mergeMeta = configs => {
  const out = {};

  for (const c of configs) {
    for (
      const [k, v] of Object.entries(
        c?.meta_family || {}
      )
    ) {
      if (
        v &&
        typeof v === "object" &&
        !Array.isArray(v)
      ) {
        out[k] = {
          ...(out[k] || {}),
          ...v
        };
      }
    }
  }

  return { meta_family: out };
};

class HeadInjector {
  constructor(schema, tags) {
    this.schema = schema;
    this.tags = tags;
  }

  element(element) {
    if (this.schema) {
      element.append(
        '<script type="application/ld+json" ' +
        'data-aiventure-0006h="1">' +
        safeJson(this.schema) +
        "</script>",
        { html: true }
      );
    }

    for (const tag of this.tags) {
      element.append(tag, { html: true });
    }
  }
}

export async function onRequest(context) {
  const { request, env, next } = context;

  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    url.hostname !== "aireadyinjector.com" ||
    !env.SCHEMA_KV
  ) {
    return next();
  }

  const isHomepage = url.pathname === "/";

  let original;

  try {
    original = JSON.parse(
      await env.SCHEMA_KV.get(KV_KEY)
    );

    const ids =
      original?.["@graph"]?.map(
        n => n?.["@id"]
      ) || [];

    if (
      !validGraph(original) ||
      ids.length !== 3 ||
      new Set(ids).size !== 3 ||
      ![
        "https://aiventure.ro/#organization",
        SITE + "/#website",
        SITE + "/#webpage"
      ].every(id => ids.includes(id))
    ) {
      return next();
    }
  } catch (error) {
    console.error(
      "AiVenture KV error:",
      error?.message
    );

    return next();
  }

  const response = await next();

  if (
    !response.ok ||
    !response.headers
      .get("content-type")
      ?.toLowerCase()
      .includes("text/html") ||
    response.headers.has(
      "content-security-policy"
    )
  ) {
    return response;
  }

  let html;

  try {
    html = await response.clone().text();
  } catch {
    return response;
  }

  const existingSchema =
    html.includes("data-aiventure-0006h=") ||
    html.includes(SITE + "/#website") ||
    html.includes(SITE + "/#webpage");

  let schema = existingSchema
    ? null
    : original;

  if (!isHomepage && schema) {
    if (
      /<script\b[^>]*type\s*=\s*["']application\/ld\+json["']/i
        .test(html) ||
      url.search
    ) {
      schema = null;
    } else {
      const canonicalTag = html.match(
        /<link\b[^>]*rel=["']canonical["'][^>]*>/i
      )?.[0];

      const canonicalHref = canonicalTag?.match(
        /href=["']([^"']+)["']/i
      )?.[1];

      let canonical;

      try {
        canonical = canonicalHref
          ? new URL(canonicalHref, SITE)
          : null;
      } catch {}

      const title = html.match(
        /<title[^>]*>([^<]*)<\/title>/i
      )?.[1]?.trim();

      if (
        !canonical ||
        canonical.origin !== SITE ||
        canonical.search ||
        !title
      ) {
        schema = null;
      } else {
        const pageUrl =
          canonical.origin +
          canonical.pathname;

        schema = {
          "@context": "https://schema.org",
          "@graph": [
            original["@graph"].find(
              n =>
                n["@id"] ===
                "https://aiventure.ro/#organization"
            ),
            original["@graph"].find(
              n =>
                n["@id"] ===
                SITE + "/#website"
            ),
            {
              "@type": "WebPage",
              "@id": pageUrl + "#webpage",
              "url": pageUrl,
              "name": title,
              "isPartOf": {
                "@id": SITE + "/#website"
              },
              "publisher": {
                "@id":
                  "https://aiventure.ro/#organization"
              }
            }
          ]
        };
      }
    }
  }

  let tags = [];

  if (isHomepage && !url.search) {
    try {
      const values = await Promise.all(
        HEAD_KEYS.map(
          key => env.SCHEMA_KV.get(key)
        )
      );

      const cfg = values.map(
        raw => raw ? JSON.parse(raw) : null
      );

      if (
        cfg.every(Boolean) &&
        cfg[0].level === "NETWORK" &&
        cfg[1].level === "SITE" &&
        cfg[2].level === "PAGE" &&
        cfg[1].domain ===
          "aireadyinjector.com" &&
        cfg[2].path === "/" &&
        cfg.every(
          x => validGraph(x.schema_org)
        )
      ) {
        const graph = cfg.flatMap(
          x => x.schema_org["@graph"]
        );

        const ids = graph.map(
          n => n?.["@id"]
        );

        if (
          graph.length === 3 &&
          new Set(ids).size === 3 &&
          [
            "https://aiventure.ro/#organization",
            SITE + "/#website",
            SITE + "/#webpage"
          ].every(
            id => ids.includes(id)
          )
        ) {
          if (schema) {
            schema = {
              "@context":
                "https://schema.org",
              "@graph": graph
            };
          }

          tags = metaTags(
            html,
            mergeMeta(cfg)
          );
        }
      }
    } catch (error) {
      console.error(
        "AiVenture head KV error:",
        error?.message
      );
    }
  }

  if (!schema && !tags.length) {
    return response;
  }

  const headers = new Headers(
    response.headers
  );

  for (
    const name of [
      "content-length",
      "etag",
      "content-encoding"
    ]
  ) {
    headers.delete(name);
  }

  return new HTMLRewriter()
    .on(
      "head",
      new HeadInjector(
        schema,
        tags
      )
    )
    .transform(
      new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      })
    );
}
