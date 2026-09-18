// Cloud Functions entry point.
//
// sendContactEmail   — contact form handler.
// onBlogChange       — fires on blog writes and dispatches a GitHub Actions
//                      "seo-refresh" so the build-time SEO prerender (see
//                      scripts/prerender.ts) is regenerated and redeployed.
//                      SEO HTML stays static on Firebase Hosting — no
//                      per-request Cloud Function invocations.
export { sendContactEmail } from "./contact";
export { onBlogChange } from "./deployTrigger";
