// Builds complete, self-contained HTML documents for crawlers.

import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, LOCALE } from "./config";

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  robots?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  authorName?: string;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toAbsoluteImage(image?: string): string {
  if (!image) return DEFAULT_OG_IMAGE;
  if (image.startsWith("http")) return image;
  return `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

function buildHead(meta: SeoMeta, jsonLd: object[]): string {
  const canonical = `${SITE_URL}${meta.path}`;
  const ogImage = toAbsoluteImage(meta.image);
  const robots = meta.robots || "index, follow";
  const type = meta.type || "website";

  const jsonLdTags = jsonLd
    .map(
      (schema) =>
        `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    )
    .join("\n    ");

  const articleTags = [
    type === "article" && meta.publishedTime
      ? `<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}" />`
      : "",
    type === "article" && meta.modifiedTime
      ? `<meta property="article:modified_time" content="${escapeHtml(meta.modifiedTime)}" />`
      : "",
    type === "article" && meta.authorName
      ? `<meta property="article:author" content="${escapeHtml(meta.authorName)}" />`
      : "",
    type === "article" && meta.section
      ? `<meta property="article:section" content="${escapeHtml(meta.section)}" />`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonical}" />

    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="${LOCALE}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${ogImage}" />

    ${articleTags}
    ${jsonLdTags}`;
}

export function renderDocument(
  meta: SeoMeta,
  bodyHtml: string,
  jsonLd: object[]
): string {
  return `<!doctype html>
<html lang="en">
  <head>${buildHead(meta, jsonLd)}
  </head>
  <body>
    ${bodyHtml}
  </body>
</html>`;
}
