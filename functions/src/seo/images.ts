// Image optimization proxy: resize/reformat any public asset on the fly.
// /img?src=/assets/images/foo.webp&w=800&q=80&f=webp

import { onRequest } from "firebase-functions/v2/https";
import sharp from "sharp";
import * as logger from "firebase-functions/logger";

import { SITE_URL } from "./config";

const MAX_WIDTH = 2000;

export const imageResize = onRequest(
  { region: "us-central1", memory: "512MiB", timeoutSeconds: 30 },
  async (req, res) => {
    try {
      const params = new URLSearchParams((req.url || "").split("?")[1] || "");
      const src = params.get("src");
      if (!src) {
        res.status(400).send("missing src");
        return;
      }

      const width = Math.min(parseInt(params.get("w") || "0", 10) || 0, MAX_WIDTH);
      const quality = Math.max(1, Math.min(100, parseInt(params.get("q") || "80", 10) || 80));
      const format = params.get("f") || "webp";
      if (!["webp", "avif", "jpeg", "png"].includes(format)) {
        res.status(400).send("unsupported format");
        return;
      }

      const sourceUrl = src.startsWith("http")
        ? src
        : `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;

      const imgResp = await fetch(sourceUrl);
      if (!imgResp.ok) {
        res.status(404).send("source not found");
        return;
      }
      const input = Buffer.from(await imgResp.arrayBuffer());

      let pipeline = sharp(input).rotate();
      if (width > 0) pipeline = pipeline.resize({ width });

      let output: Buffer;
      switch (format) {
        case "avif":
          output = await pipeline.avif({ quality }).toBuffer();
          break;
        case "jpeg":
          output = await pipeline.jpeg({ quality }).toBuffer();
          break;
        case "png":
          output = await pipeline.png().toBuffer();
          break;
        default:
          output = await pipeline.webp({ quality }).toBuffer();
      }

      res.setHeader(
        "Cache-Control",
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800"
      );
      res.setHeader("Content-Type", `image/${format}`);
      res.status(200).send(output);
    } catch (err) {
      logger.error("imageResize error", err);
      res.status(500).send("image resize failed");
    }
  }
);
