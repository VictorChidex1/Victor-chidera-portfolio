// Dynamic XML sitemap: static routes + every published blog article.

import { onRequest } from "firebase-functions/v2/https";

import { getPublishedBlogs } from "./content";
import { SITE_URL } from "./config";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

const STATIC_ROUTES: SitemapEntry[] = [
  { path: "/", changefreq: "monthly", priority: "1.0" },
  { path: "/works", changefreq: "monthly", priority: "0.9" },
  { path: "/services", changefreq: "monthly", priority: "0.8" },
  { path: "/testimonials", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
];

function toDate(timestamp?: { seconds: number }): string | undefined {
  if (!timestamp || !timestamp.seconds) return undefined;
  return new Date(timestamp.seconds * 1000).toISOString().split("T")[0];
}

function buildXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${SITE_URL}${e.path}</loc>
    ${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export const seoSitemap = onRequest({ region: "us-central1" }, async (_req, res) => {
  const blogs = await getPublishedBlogs();
  const blogEntries: SitemapEntry[] = blogs
    .filter((b) => b.slug)
    .map((b) => ({
      path: `/blog/${b.slug}`,
      lastmod: toDate(b.updatedAt) || toDate(b.createdAt),
      changefreq: "monthly",
      priority: "0.7",
    }));

  const xml = buildXml([...STATIC_ROUTES, ...blogEntries]);

  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.status(200).send(xml);
});
