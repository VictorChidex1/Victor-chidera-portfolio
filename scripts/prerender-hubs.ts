// Phase E — static hub prerender.
//
// Runs at build time (after `vite build`). Reads the built SPA shell and writes
// SEO-complete static HTML for every stable route, so Firebase Hosting can serve
// them from the CDN with no Cloud Function invocation.
//
//   dist/index.html                  → patched in place (home)
//   dist/{works,services,...}.html   → generated per route
//
// Single .html files (not folder/index.html) keep URLs clean: `/works` is served
// with a 200 and no trailing-slash redirect, matching the canonical `/works`.
//
// Run:  node scripts/prerender-hubs.ts   (Node 22+ runs TypeScript natively)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  LOCALE,
  personSchema,
  websiteSchema,
  collectionPageSchema,
  faqSchema,
  contactPageSchema,
} from "../shared/seo.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const DIST_HTML = join(DIST, "index.html");

interface RouteMeta {
  title: string;
  description: string;
  heading: string;
  schema: "home" | "works" | "services" | "collection" | "contact";
}

interface Project {
  title: string;
  link: string;
}

interface Service {
  title: string;
}

interface Faq {
  question: string;
  answer: string;
}

function readJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(join(ROOT, relPath), "utf-8")) as T;
}

const ROUTES = readJson<Record<string, RouteMeta>>("src/data/routes.json");
const FAQS = readJson<Faq[]>("src/data/faqs.json");
const SERVICES = readJson<Service[]>("src/data/services.json");
const PROJECTS = readJson<Project[]>("src/data/projects-fallback.json");

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildJsonLd(path: string, meta: RouteMeta): object[] {
  switch (meta.schema) {
    case "home":
      return [personSchema(), websiteSchema(), faqSchema(FAQS)];
    case "works":
      return [
        collectionPageSchema(
          "Selected Works",
          "/works",
          meta.description,
          PROJECTS.map((p) => ({ name: p.title, url: p.link }))
        ),
      ];
    case "services":
      return [
        collectionPageSchema(
          "Services",
          "/services",
          meta.description,
          SERVICES.map((s) => ({ name: s.title, url: "/services" }))
        ),
      ];
    case "contact":
      return [contactPageSchema()];
    case "collection":
    default:
      return [collectionPageSchema(meta.heading, path, meta.description)];
  }
}

function buildSeoBlock(path: string, meta: RouteMeta): string {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);

  const jsonLd = buildJsonLd(path, meta)
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join("\n    ");

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${DEFAULT_OG_IMAGE}" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:locale" content="${LOCALE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />
    ${jsonLd}
  `;
}

function stripExistingSeo(html: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, "")
    .replace(/<meta\s+[^>]*name=["']description["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+[^>]*property=["']og:[^"']*["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+[^>]*property=["']twitter:[^"']*["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+[^>]*name=["']twitter:[^"']*["'][^>]*>\s*/gi, "")
    .replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>\s*/gi, "")
    .replace(
      /<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
      ""
    );
}

function buildSkeleton(meta: RouteMeta): string {
  const h1 = escapeHtml(meta.heading);
  const p = escapeHtml(meta.description);
  return (
    `<div id="root"><main style="max-width:1100px;margin:0 auto;padding:7rem 1.5rem;` +
    `font-family:Inter,ui-sans-serif,system-ui,sans-serif">` +
    `<h1 style="font-size:clamp(2rem,6vw,4rem);line-height:1.05;font-weight:700;` +
    `letter-spacing:-0.02em;color:#111;margin:0 0 1rem">${h1}</h1>` +
    `<p style="font-size:1.125rem;line-height:1.6;color:#666;max-width:42rem">${p}</p>` +
    `</main></div>`
  );
}

function transform(original: string, path: string, meta: RouteMeta): string {
  let html = stripExistingSeo(original);
  html = html.replace("</head>", `${buildSeoBlock(path, meta)}\n  </head>`);
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, buildSkeleton(meta));
  return html;
}

function main(): void {
  if (!existsSync(DIST_HTML)) {
    console.error(
      "[prerender] dist/index.html not found — run the Vite build first."
    );
    process.exit(1);
  }

  const original = readFileSync(DIST_HTML, "utf-8");
  let count = 0;

  for (const [path, meta] of Object.entries(ROUTES)) {
    const html = transform(original, path, meta);

    if (path === "/") {
      writeFileSync(DIST_HTML, html);
    } else {
      // Single file per route (dist/works.html) so `/works` is served with a
      // 200 and no trailing-slash 301, matching the canonical URL.
      const file = join(DIST, `${path.replace(/^\//, "")}.html`);
      writeFileSync(file, html);
    }

    count += 1;
    console.log(`  ✅ ${path}`);
  }

  console.log(`\n[prerender] ${count} routes pre-rendered (home patched in place).`);
}

main();
