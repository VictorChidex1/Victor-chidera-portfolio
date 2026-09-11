// ISR: on every blog write/update/delete, render the article HTML and store it
// as a static snapshot in Cloud Storage. The gateway serves fresh snapshots
// first, falling back to a live render.

import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { getStorage } from "firebase-admin/storage";
import * as logger from "firebase-functions/logger";

import { renderArticleDocument } from "./render";

const PREFIX = "seo-snapshots";
const bucket = getStorage().bucket();

interface BlogDoc {
  slug?: string;
  status?: string;
}

async function writeSnapshot(slug: string, html: string): Promise<void> {
  await bucket
    .file(`${PREFIX}/${slug}.html`)
    .save(html, { contentType: "text/html; charset=utf-8" });
}

async function deleteSnapshot(slug: string): Promise<void> {
  try {
    await bucket.file(`${PREFIX}/${slug}.html`).delete();
  } catch {
    // ignore missing snapshot
  }
}

export async function readSnapshot(slug: string): Promise<string | null> {
  try {
    const [buf] = await bucket.file(`${PREFIX}/${slug}.html`).download();
    return buf.toString("utf8");
  } catch {
    return null;
  }
}

export const articleSnapshot = onDocumentWritten(
  { document: "blogs/{blogId}", region: "us-central1" },
  async (event) => {
    const before = event.data?.before?.data() as BlogDoc | undefined;
    const after = event.data?.after?.data() as BlogDoc | undefined;

    // Deleted document.
    if (!after) {
      if (before?.slug) await deleteSnapshot(before.slug);
      return;
    }

    // Draft or slug removed: ensure no stale public snapshot remains.
    if (!after.slug || after.status === "draft") {
      if (after.slug) await deleteSnapshot(after.slug);
      if (before?.slug && before.slug !== after.slug) await deleteSnapshot(before.slug);
      return;
    }

    const html = await renderArticleDocument(after.slug);
    if (html) {
      await writeSnapshot(after.slug, html);
      logger.info("article snapshot written", { slug: after.slug });
    }
  }
);
