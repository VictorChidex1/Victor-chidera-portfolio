// Cloud Functions entry point.
//
// Only the contact handler is deployed. All SEO rendering now happens at
// build time (see scripts/prerender.ts) and is served as static files from
// Firebase Hosting — zero per-request Cloud Function invocations.
export { sendContactEmail } from "./contact";
