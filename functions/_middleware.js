
/**
 * AiVenture 0006H
 * AI Ready Injector — Cloudflare Pages
 *
 * File: functions/_middleware.js
 * KV binding: SCHEMA_KV
 * KV key: schema:0006H:aireadyinjector:homepage
 */

const KV_KEY = "schema:0006H:aireadyinjector:homepage";

const SITE = "https://aireadyinjector.com";

class SchemaInjector {
  constructor(schema) {
    this.schema = schema;
  }

  element(element) {
    const json = JSON.stringify(this.schema)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026");

    element.append(
      `<script type="application/ld+json" data-aiventure-0006h="1">${json}</script>`,
      { html: true }
    );
  }
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Homepage only.
  if (
    request.method !== "GET" ||
    url.hostname !== "aireadyinjector.com" ||
    url.pathname !== "/"
  ) {
    return next();
  }

  // Fail open if KV is unavailable.
  if (!env.SCHEMA_KV) {
    return next();
  }

  let schema;

  try {
    const raw = await env.SCHEMA_KV.get(KV_KEY);

    if (!raw) return next();

    schema = JSON.parse(raw);

    if (
      schema?.["@context"] !== "https://schema.org" ||
      !Array.isArray(schema?.["@graph"]) ||
      schema["@graph"].length !== 3
    ) {
      return next();
    }

    const required = [
      "https://aiventure.ro/#organization",
      `${SITE}/#website`,
      `${SITE}/#webpage`
    ];

    const ids = schema["@graph"].map(
      (node) => node?.["@id"]
    );

    if (
      new Set(ids).size !== 3 ||
      !required.every((id) => ids.includes(id))
    ) {
      return next();
    }
  } catch (error) {
    console.error(
      "AiVenture 0006H KV error:",
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
      .includes("text/html")
  ) {
    return response;
  }

  // Do not bypass existing CSP.
  if (response.headers.has("content-security-policy")) {
    return response;
  }

  let html;

  try {
    html = await response.clone().text();
  } catch {
    return response;
  }

  // Avoid duplicate injection.
  if (
    html.includes("data-aiventure-0006h=") ||
    html.includes(`${SITE}/#website`) ||
    html.includes(`${SITE}/#webpage`)
  ) {
    return response;
  }

  const headers = new Headers(response.headers);

  headers.delete("content-length");
  headers.delete("etag");
  headers.delete("content-encoding");

  return new HTMLRewriter()
    .on("head", new SchemaInjector(schema))
    .transform(
      new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      })
    );
}
