import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import { isBot, wantsPrerender } from "./seo/bots";
import { renderDocument } from "./seo/html";
import { buildSeo } from "./seo/render";
import { renderRoute } from "./seo/content";
import { readSnapshot } from "./seo/snapshot";

export { articleSnapshot } from "./seo/snapshot";
export { ogImage } from "./seo/og";
export { imageResize } from "./seo/images";
export { seoSitemap } from "./seo/sitemap";
export { sendContactEmail, RESEND_API_KEY } from "./contact";

const REGION = "us-central1";
const PROD_HOST = "victorchidera.com";

function applyCommonHeaders(
  res: { setHeader: (k: string, v: string) => void },
  host: string
): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Staging / preview guard: never let a non-production host get indexed.
  if (!host.includes(PROD_HOST)) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
  }
}

function normalizePath(url: string): string {
  const clean = url.split("?")[0].replace(/\/+$/, "");
  return clean === "" ? "/" : clean;
}

async function fetchShell(host: string): Promise<string | null> {
  const proto = "https";
  const url = `${proto}://${host}/index.html`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (res.ok) return await res.text();
    logger.warn("shell fetch returned non-ok", { status: res.status });
  } catch (err) {
    logger.warn("shell fetch failed", err);
  }
  return null;
}

function hostFromRequest(req: {
  headers: Record<string, string | string[] | undefined>;
}): string {
  const fwd = req.headers["x-forwarded-host"];
  const host = req.headers["host"];
  const value = Array.isArray(fwd) ? fwd[0] : fwd || (Array.isArray(host) ? host[0] : host);
  return value || "victorchidera.com";
}

export const seoGateway = onRequest(
  { region: REGION, timeoutSeconds: 30, memory: "256MiB" },
  async (req, res) => {
    const rawPath = normalizePath(req.path || "/");
    const host = hostFromRequest(req);
    const userAgent = req.headers["user-agent"] as string | undefined;
    const renderForBot = isBot(userAgent) || wantsPrerender(req.url);
    applyCommonHeaders(res, host);

    // Humans: serve the SPA shell (cached at the CDN).
    if (!renderForBot) {
      try {
        const shell = await fetchShell(host);
        if (shell) {
          res.setHeader(
            "Cache-Control",
            "public, max-age=0, s-maxage=300, stale-while-revalidate=86400"
          );
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.status(200).send(shell);
          return;
        }
      } catch (err) {
        logger.error("human shell error", err);
      }
      res.redirect(302, "/index.html");
      return;
    }

    // Crawlers: serve a pre-rendered article snapshot if one exists.
    if (rawPath.startsWith("/blog/")) {
      const slug = rawPath.slice("/blog/".length);
      const snapshot = await readSnapshot(slug);
      if (snapshot) {
        res.setHeader(
          "Cache-Control",
          "public, max-age=0, s-maxage=300, stale-while-revalidate=604800"
        );
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.status(200).send(snapshot);
        return;
      }
    }

    // Crawlers: render full semantic HTML.
    try {
      const { meta, jsonLd, status } = await buildSeo(rawPath);
      const { body } = await renderRoute(rawPath);
      const html = renderDocument(meta, body, jsonLd);

      res.setHeader(
        "Cache-Control",
        "public, max-age=0, s-maxage=300, stale-while-revalidate=604800"
      );
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.status(status).send(html);
      return;
    } catch (err) {
      logger.error("seoGateway error", err);
      res.redirect(302, "/index.html");
      return;
    }
  }
);
