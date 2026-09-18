import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions/v2";

const GH_PAT = defineSecret("GH_PAT");
const GITHUB_REPO = "VictorChidex1/Victor-chidera-portfolio";
const DISPATCH_EVENT = "seo-refresh";

export const onBlogChange = onDocumentWritten(
  {
    document: "blogs/{blogId}",
    secrets: [GH_PAT],
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async () => {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${GH_PAT.value()}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "victor-chidera-portfolio",
        },
        body: JSON.stringify({ event_type: DISPATCH_EVENT }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      logger.error(`GitHub dispatch failed (${res.status}): ${body}`);
      throw new Error(`GitHub dispatch failed with status ${res.status}`);
    }

    logger.info(`Dispatched ${DISPATCH_EVENT} to ${GITHUB_REPO}`);
  }
);