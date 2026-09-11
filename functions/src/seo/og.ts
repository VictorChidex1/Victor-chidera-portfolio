// Dynamic Open Graph / social card generation (sharp + SVG, no browser canvas).

import { onRequest } from "firebase-functions/v2/https";
import sharp from "sharp";
import * as logger from "firebase-functions/logger";

import { getBlogBySlug } from "./content";
import { SITE_URL, SITE_NAME, AUTHOR_NAME } from "./config";

const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
    if (lines.length >= maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines) {
    lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, maxChars - 1)}…`;
  }
  return lines;
}

function buildSvg(title: string): string {
  const lines = wrapText(title, 30, 3);
  const titleTspans = lines
    .map(
      (line, i) =>
        `<tspan x="80" y="${330 + i * 70}" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="#ffffff">${escapeXml(line)}</tspan>`
    )
    .join("");

  return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#111111"/>
  <rect x="0" y="0" width="${WIDTH}" height="8" fill="#F97316"/>
  <circle cx="1080" cy="110" r="220" fill="#F97316" opacity="0.08"/>
  <text x="80" y="120" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" letter-spacing="4" fill="#F97316">${escapeXml(AUTHOR_NAME.toUpperCase())}</text>
  ${titleTspans}
  <text x="80" y="560" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#9ca3af">${escapeXml(SITE_NAME)} · ${escapeXml(SITE_URL.replace("https://", ""))}</text>
</svg>`;
}

export const ogImage = onRequest(
  { region: "us-central1", memory: "512MiB", timeoutSeconds: 30 },
  async (req, res) => {
    try {
      const params = new URLSearchParams((req.url || "").split("?")[1] || "");
      let title = params.get("title") || "";

      if (!title) {
        const slug = params.get("slug");
        if (slug) {
          const post = await getBlogBySlug(slug);
          title = post?.title || "";
        }
      }

      title = title || "Victor Chidera | Full Stack Developer";

      const png = await sharp(Buffer.from(buildSvg(title))).png().toBuffer();

      res.setHeader(
        "Cache-Control",
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800"
      );
      res.setHeader("Content-Type", "image/png");
      res.status(200).send(png);
    } catch (err) {
      logger.error("ogImage error", err);
      res.status(500).send("OG generation failed");
    }
  }
);
