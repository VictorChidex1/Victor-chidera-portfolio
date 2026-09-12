// Deploy-time snapshot of published blog posts + projects from Firestore.
//
// Reads the `blogs` and `projects` collections via a service account (so the
// build-time prerender can emit SEO HTML for every article and case study) and
// caches them to build-only files. These are gitignored and never ship to the
// client.
//
// Gracefully no-ops when the service account or network is unavailable —
// the prerender then falls back to the committed JSON.
//
// Run:  node scripts/fetch-live.ts   (Node 22+ runs TypeScript natively)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CACHE_DIR = join(__dirname, ".cache");
const CACHE_BLOGS = join(CACHE_DIR, "blogs.json");
const CACHE_PROJECTS = join(CACHE_DIR, "projects.json");

const KEY_CANDIDATES = [
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  join(ROOT, "secrets", "firebase-adminsdk.json"),
].filter((p): p is string => Boolean(p));

function findKey(): string | null {
  for (const p of KEY_CANDIDATES) {
    if (p && existsSync(p)) return p;
  }
  return null;
}

function normalizeTimestamp(v: any): { seconds: number } | undefined {
  if (!v) return undefined;
  if (typeof v.toDate === "function") {
    return { seconds: Math.floor(v.toDate().getTime() / 1000) };
  }
  if (typeof v.seconds === "number") {
    return { seconds: v.seconds };
  }
  if (typeof v === "string") {
    const ms = Date.parse(v);
    return Number.isNaN(ms) ? undefined : { seconds: Math.floor(ms / 1000) };
  }
  return undefined;
}

async function main(): Promise<void> {
  const key = findKey();
  if (!key) {
    console.warn(
      "[fetch-live] no service-account key found — using committed fallback JSON"
    );
    return;
  }

  // firebase-admin exposes `cert`/`initializeApp` as named exports (v13 ESM).
  const adminMod: any = await import("firebase-admin");
  const { initializeApp, cert } = adminMod;
  const fsMod: any = await import("firebase-admin/firestore");
  const getFirestore = fsMod.getFirestore;

  const certJson = JSON.parse(readFileSync(key, "utf8"));
  const app = initializeApp({
    credential: cert(certJson),
    projectId: certJson.project_id,
  });
  const db = getFirestore(app);

  const snap = await db.collection("blogs").get();
  const blogs = snap.docs
    .map((d: any) => ({ id: d.id, ...(d.data() ?? {}) }))
    .filter((b: any) => b.status === undefined || b.status !== "draft");

  const cleanBlogs = blogs
    .map((b: any) => ({
      slug: b.slug || "",
      title: b.title || "",
      excerpt: b.excerpt || b.seoDescription || "",
      content: b.content || "",
      coverImage: b.coverImage || b.image || "",
      date: b.date || "",
      readTime: b.readTime || "",
      link: b.link || "",
      tags: Array.isArray(b.tags) ? b.tags : [],
      seoTitle: b.seoTitle || "",
      seoDescription: b.seoDescription || "",
      createdAt: normalizeTimestamp(b.createdAt),
      updatedAt: normalizeTimestamp(b.updatedAt ?? b.createdAt),
      publishedAt: normalizeTimestamp(b.publishedAt ?? b.createdAt),
    }))
    .filter((b) => b.slug);

  const projSnap = await db.collection("projects").get();
  const projects = projSnap.docs
    .map((d: any) => ({ id: d.id, ...(d.data() ?? {}) }))
    .filter((p: any) => p.status === undefined || p.status !== "draft");

  const cleanProjects = projects.map((p: any) => ({
    slug: p.slug || "",
    title: p.title || "",
    category: p.category || "",
    description: p.description || "",
    tech: Array.isArray(p.tech) ? p.tech : [],
    link: p.link || "",
    image: p.image || "",
    role: p.role || "",
    year: p.year || "",
    client: p.client || "",
    order: typeof p.order === "number" ? p.order : Number(p.order) || 99999,
    seoTitle: p.seoTitle || "",
    seoDescription: p.seoDescription || "",
    overview: p.overview || "",
    problem: p.problem || "",
    solution: p.solution || "",
    technology: p.technology || "",
    architecture: p.architecture || "",
    keyFeatures: p.keyFeatures || "",
    challenges: p.challenges || "",
    resultsNarrative: p.resultsNarrative || "",
    results: Array.isArray(p.results) ? p.results : [],
    screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
    createdAt: normalizeTimestamp(p.createdAt),
    updatedAt: normalizeTimestamp(p.updatedAt ?? p.createdAt),
    publishedAt: normalizeTimestamp(p.publishedAt ?? p.createdAt),
  }));

  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_BLOGS, JSON.stringify(cleanBlogs, null, 2));
  writeFileSync(CACHE_PROJECTS, JSON.stringify(cleanProjects, null, 2));
  console.log(
    `[fetch-live] cached ${cleanBlogs.length} published blog(s) + ${cleanProjects.length} published project(s)`
  );

  await app.delete();
}

main().catch((err: any) => {
  console.warn("[fetch-live] failed (using fallback):", err?.message ?? err);
});
