// Build-time SEO prerender (replaces the runtime `seogateway` Cloud Function).
//
// Reads the built SPA shell (dist/index.html) and writes SEO-complete static
// HTML for every route + every published blog article, plus a static sitemap.
// Firebase Hosting serves these files straight from the CDN — zero Cloud
// Function invocations.
//
//   dist/index.html                    → patched in place (home)
//   dist/{works,services,...}.html     → generated per route
//   dist/blog/{slug}.html              → generated per published article
//   dist/sitemap.xml                   → static sitemap
//
// Run:  node scripts/prerender.ts   (Node 22+ runs TypeScript natively)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  LOCALE,
  CONTACT_EMAIL,
  SOCIALS,
  AUTHOR_NAME,
  AUTHOR_JOB_TITLE,
  COMPANY_NAME,
  COMPANY_TITLE,
  COMPANY_LOGO,
  personSchema,
  websiteSchema,
  collectionPageSchema,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  contactPageSchema,
  organizationSchema,
} from "../shared/seo.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const DIST_HTML = join(DIST, "index.html");

const CACHE_BLOGS = join(__dirname, ".cache", "blogs.json");
const CACHE_PROJECTS = join(__dirname, ".cache", "projects.json");
const CACHE_SETTINGS = join(__dirname, ".cache", "settings.json");

// ── Types ────────────────────────────────────────────────────────────────
interface RouteMeta {
  title: string;
  description: string;
  heading: string;
  schema: "home" | "works" | "services" | "collection" | "contact";
  image?: string;
}

interface Project {
  id?: string | number;
  title: string;
  category?: string;
  description?: string;
  tech?: string[];
  link?: string;
  image?: string;
  slug?: string;
  role?: string;
  year?: string;
  client?: string;
  order?: number | string;
  seoTitle?: string;
  seoDescription?: string;
  overview?: string;
  problem?: string;
  solution?: string;
  technology?: string;
  architecture?: string;
  keyFeatures?: string;
  challenges?: string;
  resultsNarrative?: string;
  results?: { label: string; value: string }[];
  screenshots?: { url: string; path?: string; alt?: string }[];
  status?: string;
  createdAt?: { seconds: number };
  updatedAt?: { seconds: number };
  publishedAt?: { seconds: number };
}

interface BlogPost {
  id?: string | number;
  slug?: string;
  title: string;
  author?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  image?: string;
  date?: string;
  readTime?: string;
  link?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  status?: string;
  createdAt?: { seconds: number };
  updatedAt?: { seconds: number };
  publishedAt?: { seconds: number };
}

interface Faq {
  question: string;
  answer: string;
}

interface Service {
  title: string;
  description: string;
  tags?: string[];
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
}

interface SeoMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  robots?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  authorName?: string;
}

// ── Data loading ─────────────────────────────────────────────────────────
function readJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(join(ROOT, relPath), "utf-8")) as T;
}

function loadBlogs(): BlogPost[] {
  if (existsSync(CACHE_BLOGS)) {
    try {
      const cached = JSON.parse(readFileSync(CACHE_BLOGS, "utf-8")) as BlogPost[];
      if (cached.length > 0) return cached;
    } catch {
      // fall through to committed JSON
    }
  }
  return readJson<BlogPost[]>("src/data/blog-posts-fallback.json");
}

function loadProjects(): Project[] {
  if (existsSync(CACHE_PROJECTS)) {
    try {
      const cached = JSON.parse(readFileSync(CACHE_PROJECTS, "utf-8")) as Project[];
      if (cached.length > 0) return cached;
    } catch {
      // fall through to committed JSON
    }
  }
  return readJson<Project[]>("src/data/projects-fallback.json");
}

interface SiteSettings {
  name?: string;
  editorialTitle?: string;
  avatar?: string;
  avatarPath?: string;
}

function loadSettings(): SiteSettings {
  if (existsSync(CACHE_SETTINGS)) {
    try {
      const cached = JSON.parse(readFileSync(CACHE_SETTINGS, "utf-8")) as SiteSettings;
      if (cached && typeof cached === "object") return cached;
    } catch {
      // fall through to defaults
    }
  }
  return {};
}

// ── HTML helpers ─────────────────────────────────────────────────────────
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripUnsafe(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

function navHtml(currentPath: string): string {
  const links = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/works" },
    { name: "Services", path: "/services" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];
  const items = links
    .map(
      (l) =>
        `<li><a href="${l.path}"${
          l.path === currentPath ? ' aria-current="page"' : ""
        }>${l.name}</a></li>`
    )
    .join("");
  return `<nav aria-label="Primary"><ul>${items}</ul></nav>`;
}

function techTags(tech?: string[]): string {
  if (!tech || tech.length === 0) return "";
  return tech.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
}

function toAbsoluteImage(image?: string): string {
  if (!image) return DEFAULT_OG_IMAGE;
  if (image.startsWith("http")) return image;
  return `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

function toIso(timestamp?: { seconds: number }): string | undefined {
  if (!timestamp || !timestamp.seconds) return undefined;
  return new Date(timestamp.seconds * 1000).toISOString();
}

// ── Route body renderers ─────────────────────────────────────────────────
function renderHome(
  about: { heading: string; paragraphs: string[] },
  services: Service[],
  process: { phase: string; title: string; description: string }[],
  faqs: Faq[]
): string {
  const servicesList = services
    .map(
      (s) => `<li><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.description)}</p></li>`
    )
    .join("");
  const processList = process
    .map(
      (p) =>
        `<li><h3>${escapeHtml(p.phase)}: ${escapeHtml(p.title)}</h3><p>${escapeHtml(p.description)}</p></li>`
    )
    .join("");
  const faqList = faqs
    .map(
      (f) =>
        `<li><h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p></li>`
    )
    .join("");

  return `
    <header>${navHtml("/")}</header>
    <main>
      <h1>${escapeHtml(about.heading)}</h1>
      ${about.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n      ")}
      <section aria-labelledby="services-heading">
        <h2 id="services-heading">Services</h2>
        <ul>${servicesList}</ul>
      </section>
      <section aria-labelledby="process-heading">
        <h2 id="process-heading">My Process</h2>
        <ol>${processList}</ol>
      </section>
      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading">Frequently Asked Questions</h2>
        <ul>${faqList}</ul>
      </section>
    </main>
    <footer>${escapeHtml(SITE_NAME)} · ${escapeHtml(COMPANY_TITLE)} of ${escapeHtml(COMPANY_NAME)} — ${escapeHtml(CONTACT_EMAIL)}</footer>`;
}

function renderWorks(projects: Project[]): string {
  const sorted = [...projects].sort((a, b) => {
    const orderA = a.order !== undefined && a.order !== "" ? Number(a.order) : 99999;
    const orderB = b.order !== undefined && b.order !== "" ? Number(b.order) : 99999;
    if (orderA !== orderB) return orderA - orderB;
    return String(a.title || "").localeCompare(String(b.title || ""));
  });
  const list = sorted
    .map(
      (p) => `
      <li>
        <h2>${escapeHtml(p.title)}</h2>
        <p>${escapeHtml(p.category || "")}</p>
        <p>${escapeHtml(p.description || "")}</p>
        ${p.tech && p.tech.length ? `<ul>${techTags(p.tech)}</ul>` : ""}
        ${p.link ? `<p><a href="${escapeHtml(p.link)}" rel="noopener">View project</a></p>` : ""}
      </li>`
    )
    .join("");

  return `
    <header>${navHtml("/works")}</header>
    <main>
      <h1>Selected Works</h1>
      <p>An architectural breakdown of production-grade platforms, immersive interfaces, and scalable applications.</p>
      <ul>${list}</ul>
    </main>`;
}

function renderServices(services: Service[]): string {
  const list = services
    .map(
      (s) => `
      <li>
        <h2>${escapeHtml(s.title)}</h2>
        <p>${escapeHtml(s.description)}</p>
        <ul>${techTags(s.tags)}</ul>
      </li>`
    )
    .join("");
  return `
    <header>${navHtml("/services")}</header>
    <main>
      <h1>Services</h1>
      <ul>${list}</ul>
    </main>`;
}

function renderTestimonials(testimonials: Testimonial[]): string {
  const list = testimonials
    .map(
      (t) => `
      <li>
        <blockquote>${escapeHtml(t.content)}</blockquote>
        <p>${escapeHtml(t.name)} — ${escapeHtml(t.role)}</p>
      </li>`
    )
    .join("");
  return `
    <header>${navHtml("/testimonials")}</header>
    <main>
      <h1>Testimonials</h1>
      <ul>${list}</ul>
    </main>`;
}

function renderBlogList(blogs: BlogPost[], settings: SiteSettings): string {
  const list = blogs
    .map((b) => {
      const href = b.slug ? `/blog/${b.slug}` : b.link || "#";
      const external = b.slug ? "" : ' rel="noopener"';
      const authorName = b.author || settings.name || AUTHOR_NAME;
      return `
      <li>
        <h2><a href="${escapeHtml(href)}"${external}>${escapeHtml(b.title)}</a></h2>
        <p>${escapeHtml(b.excerpt || "")}</p>
        <p class="post-meta">by ${escapeHtml(authorName)}${
          b.date
            ? ` · <time>${escapeHtml(b.date)}</time>${b.readTime ? ` · ${escapeHtml(b.readTime)}` : ""}`
            : ""
        }</p>
      </li>`;
    })
    .join("");
  return `
    <header>${navHtml("/blog")}</header>
    <main>
      <h1>Blog &amp; Insights</h1>
      <ul>${list}</ul>
    </main>`;
}

function renderArticle(post: BlogPost, settings: SiteSettings): string {
  const authorName = post.author || settings.name || AUTHOR_NAME;
  const byline = `
      <address class="post-author">
        ${
          settings.avatar
            ? `<img src="${escapeHtml(settings.avatar)}" alt="" width="40" height="40" loading="lazy" />`
            : `<span class="post-author-avatar">${escapeHtml((authorName || "V").charAt(0).toUpperCase())}</span>`
        }
        <span><strong>${escapeHtml(authorName)}</strong>${
          settings.editorialTitle
            ? `<br /><span>${escapeHtml(settings.editorialTitle)}</span>`
            : ""
        }</span>
      </address>`;
  if (post.content) {
    return `
      <header>${navHtml(`/blog/${post.slug}`)}</header>
      <main>
        <article>
          <h1>${escapeHtml(post.title)}</h1>
          ${byline}
          ${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ""}
          ${stripUnsafe(post.content)}
        </article>
      </main>`;
  }

  return `
    <header>${navHtml("/blog")}</header>
    <main>
      <article>
        <h1>${escapeHtml(post.title)}</h1>
        ${byline}
        <p>${escapeHtml(post.excerpt || "")}</p>
        <p><a href="${escapeHtml(post.link || "#")}" rel="noopener">Read the full article</a></p>
      </article>
    </main>`;
}

function renderCaseStudy(project: Project): string {
  const sections = [
    { key: "overview", label: "Overview" },
    { key: "problem", label: "The Problem" },
    { key: "solution", label: "The Solution" },
    { key: "technology", label: "Technology" },
    { key: "architecture", label: "Architecture" },
    { key: "keyFeatures", label: "Key Features" },
    { key: "challenges", label: "Challenges" },
    { key: "resultsNarrative", label: "Results" },
  ] as const;

  const sectionHtml = sections
    .map((s) => {
      const html = (project as any)[s.key];
      if (!html) return "";
      return `<section><h2>${escapeHtml(s.label)}</h2>${stripUnsafe(html)}</section>`;
    })
    .join("");

  const metaBits = [project.role, project.year, project.client]
    .filter(Boolean)
    .map((m) => escapeHtml(m as string))
    .join(" · ");

  const resultsHtml =
    project.results && project.results.length > 0
      ? `<section aria-label="Results"><ul>${project.results
          .map(
            (r) =>
              `<li><strong>${escapeHtml(r.value)}</strong> — ${escapeHtml(r.label)}</li>`
          )
          .join("")}</ul></section>`
      : "";

  const screenshotsHtml =
    project.screenshots && project.screenshots.length > 0
      ? `<section aria-label="Screenshots"><ul>${project.screenshots
          .map(
            (s) =>
              `<li><img src="${escapeHtml(s.url)}" alt="${escapeHtml(
                s.alt || project.title
              )}" loading="lazy" /></li>`
          )
          .join("")}</ul></section>`
      : "";

  return `
    <header>${navHtml("/works")}</header>
    <main>
      <article>
        <p>${escapeHtml(project.category || "")}${
    metaBits ? ` · ${metaBits}` : ""
  }</p>
        <h1>${escapeHtml(project.title)}</h1>
        <p>${escapeHtml(project.description || "")}</p>
        ${
          project.image
            ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" />`
            : ""
        }
        ${resultsHtml}
        ${sectionHtml}
        ${screenshotsHtml}
        ${
          project.link
            ? `<p><a href="${escapeHtml(project.link)}" rel="noopener">Visit project</a></p>`
            : ""
        }
      </article>
    </main>`;
}

function renderContact(): string {
  return `
    <header>${navHtml("/contact")}</header>
    <main>
      <h1>Contact Me</h1>
      <p>Whether you're looking to architect a scalable platform, redesign a flagship product, or simply explore what's possible, I'm ready to help.</p>
      <ul>
        <li>Email: <a href="mailto:${escapeHtml(CONTACT_EMAIL)}">${escapeHtml(CONTACT_EMAIL)}</a></li>
        <li>GitHub: <a href="${escapeHtml(SOCIALS.github)}" rel="noopener">${escapeHtml(SOCIALS.github)}</a></li>
        <li>LinkedIn: <a href="${escapeHtml(SOCIALS.linkedin)}" rel="noopener">${escapeHtml(SOCIALS.linkedin)}</a></li>
        <li>Twitter/X: <a href="${escapeHtml(SOCIALS.twitter)}" rel="noopener">${escapeHtml(SOCIALS.twitter)}</a></li>
      </ul>
    </main>`;
}

function renderNotFound(): string {
  return `
    <header>${navHtml("/")}</header>
    <main><h1>Page not found</h1><p><a href="${SITE_URL}/">Back to home</a></p></main>`;
}

// ── SEO (meta + JSON-LD) ─────────────────────────────────────────────────
interface SeoResult {
  meta: SeoMeta;
  jsonLd: object[];
  status: number;
}

function buildSeo(
  path: string,
  ctx: {
    routes: Record<string, RouteMeta>;
    projects: Project[];
    services: Service[];
    faqs: Faq[];
    blogs: BlogPost[];
    settings: SiteSettings;
  }
): SeoResult {
  const route: RouteMeta = ctx.routes[path] || {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    heading: "",
    schema: "collection",
  };

  const meta: SeoMeta = {
    title: route.title,
    description: route.description,
    path,
    image: route.image,
  };
  let jsonLd: object[] = [];
  let status = 200;

  switch (true) {
    case path === "/":
      jsonLd = [
        personSchema({
          name: ctx.settings.name,
          jobTitle: ctx.settings.editorialTitle,
          image: ctx.settings.avatar,
        }),
        websiteSchema(),
        organizationSchema({
          name: COMPANY_NAME,
          logo: COMPANY_LOGO,
        }),
        faqSchema(ctx.faqs as Faq[]),
      ];
      break;

    case path === "/works":
      jsonLd = [
        collectionPageSchema(
          "Selected Works",
          "/works",
          route.description,
          ctx.projects
            .filter((p) => p.link)
            .map((p) => ({ name: p.title, url: p.link as string }))
        ),
      ];
      break;

    case path === "/services":
      jsonLd = [
        collectionPageSchema(
          "Services",
          "/services",
          route.description,
          ctx.services.map((s) => ({ name: s.title, url: `${SITE_URL}/services` }))
        ),
      ];
      break;

    case path === "/testimonials":
      jsonLd = [collectionPageSchema("Testimonials", "/testimonials", route.description)];
      break;

    case path === "/blog":
      jsonLd = [collectionPageSchema("Blog & Insights", "/blog", route.description)];
      break;

    case path === "/contact":
      jsonLd = [contactPageSchema()];
      break;

    case path.startsWith("/blog/"): {
      const slug = path.slice("/blog/".length);
      const post = ctx.blogs.find((b) => b.slug === slug);
      if (post && (post.status === undefined || post.status !== "draft")) {
        meta.title = post.seoTitle || `${post.title} | ${post.author || ctx.settings.name || AUTHOR_NAME}`;
        meta.description = post.seoDescription || post.excerpt || route.description;
        meta.image = post.coverImage || post.image;
        meta.type = "article";
        meta.publishedTime = toIso(post.publishedAt || post.createdAt);
        meta.modifiedTime = toIso(post.updatedAt || post.publishedAt || post.createdAt);
        meta.section = "Blog";
        meta.authorName = post.author || ctx.settings.name || AUTHOR_NAME;
        jsonLd = [
          articleSchema({
            title: post.title,
            description: post.excerpt || "",
            slug,
            coverImage: post.coverImage || post.image,
            publishedTime: toIso(post.publishedAt || post.createdAt),
            modifiedTime: toIso(post.updatedAt || post.publishedAt || post.createdAt),
            section: "Blog",
            author: meta.authorName,
            authorImage: ctx.settings.avatar,
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${slug}` },
          ]),
        ];
      } else {
        meta.title = "Page Not Found | Victor Chidera";
        meta.description = "The page you're looking for does not exist.";
        meta.robots = "noindex, nofollow";
        status = 404;
      }
      break;
    }

    case path.startsWith("/works/"): {
      const slug = path.slice("/works/".length);
      const project = ctx.projects.find((p) => p.slug === slug);
      if (project && (project.status === undefined || project.status !== "draft")) {
        meta.title = project.seoTitle || `${project.title} | Victor Chidera`;
        meta.description = project.seoDescription || project.description || route.description;
        meta.image = project.image;
        meta.type = "article";
        meta.publishedTime = toIso(project.publishedAt || project.createdAt);
        meta.modifiedTime = toIso(project.updatedAt || project.publishedAt || project.createdAt);
        meta.section = "Case Study";
        jsonLd = [
          articleSchema({
            title: project.title,
            description: project.seoDescription || project.description || "",
            slug,
            path: `/works/${slug}`,
            type: "Article",
            coverImage: project.image,
            images: (project.screenshots || []).map((s) => s.url).filter(Boolean),
            publishedTime: toIso(project.publishedAt || project.createdAt),
            modifiedTime: toIso(project.updatedAt || project.publishedAt || project.createdAt),
            section: "Case Study",
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Work", url: "/works" },
            { name: project.title, url: `/works/${slug}` },
          ]),
        ];
      } else {
        meta.title = "Page Not Found | Victor Chidera";
        meta.description = "The page you're looking for does not exist.";
        meta.robots = "noindex, nofollow";
        status = 404;
      }
      break;
    }

    default:
      meta.title = "Page Not Found | Victor Chidera";
      meta.description = "The page you're looking for does not exist.";
      meta.robots = "noindex, nofollow";
      status = 404;
  }

  return { meta, jsonLd, status };
}

// ── Document (head + body injection into the SPA shell) ──────────────────
function buildHeadBlock(meta: SeoMeta, jsonLd: object[]): string {
  const canonical = `${SITE_URL}${meta.path}`;
  const ogImage = toAbsoluteImage(meta.image);
  const robots = meta.robots || "index, follow";
  const type = meta.type || "website";

  const jsonLdTags = jsonLd
    .map(
      (schema) =>
        `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    )
    .join("\n    ");

  const articleTags = [
    type === "article" && meta.publishedTime
      ? `<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}" />`
      : "",
    type === "article" && meta.modifiedTime
      ? `<meta property="article:modified_time" content="${escapeHtml(meta.modifiedTime)}" />`
      : "",
    type === "article" && meta.authorName
      ? `<meta property="article:author" content="${escapeHtml(meta.authorName)}" />`
      : "",
    type === "article" && meta.section
      ? `<meta property="article:section" content="${escapeHtml(meta.section)}" />`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  return `
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonical}" />

    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:image" content="${escapeHtml(ogImage)}" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:locale" content="${LOCALE}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />

    ${articleTags}
    ${jsonLdTags}`;
}

function stripExistingSeo(html: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, "")
    .replace(/<meta\s+[^>]*name=["']description["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+[^>]*name=["']robots["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+[^>]*property=["']og:[^"']*["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+[^>]*property=["']twitter:[^"']*["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+[^>]*name=["']twitter:[^"']*["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+[^>]*property=["']article:[^"']*["'][^>]*>\s*/gi, "")
    .replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>\s*/gi, "")
    .replace(
      /<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
      ""
    );
}

function transform(
  original: string,
  meta: SeoMeta,
  jsonLd: object[],
  bodyHtml: string
): string {
  let html = stripExistingSeo(original);
  // FOUC guard: hide the prerendered body until React hydrates. The inline
  // script runs during parsing (adds .prerender before first paint); React
  // removes the class on mount (see src/App.tsx). Crawlers/no-JS never add the
  // class, so the semantic content stays visible and indexable.
  const foucGuard =
    `<style>.prerender #root{visibility:hidden}</style>` +
    `<script>document.documentElement.classList.add('prerender');</script>`;
  html = html.replace(
    "</head>",
    `${buildHeadBlock(meta, jsonLd)}\n    ${foucGuard}\n  </head>`
  );
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${bodyHtml}</div>`
  );
  return html;
}

// ── Sitemap ──────────────────────────────────────────────────────────────
function buildSitemap(
  routes: Record<string, RouteMeta>,
  blogs: BlogPost[],
  projects: Project[]
): string {
  const staticEntries = Object.entries(routes)
    .filter(([path]) => path !== "/")
    .map(([path]) => ({
      path,
      changefreq: path === "/blog" ? "weekly" : "monthly",
      priority: path === "/works" ? "0.9" : path === "/contact" ? "0.6" : "0.8",
    }));

  const blogEntries = blogs
    .filter((b) => b.slug)
    .map((b) => ({
      path: `/blog/${b.slug}`,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: toIso(b.updatedAt || b.createdAt),
    }));

  const caseStudyEntries = projects
    .filter((p) => p.slug)
    .map((p) => ({
      path: `/works/${p.slug}`,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: toIso(p.updatedAt || p.createdAt),
    }));

  const all = [
    { path: "/", changefreq: "monthly", priority: "1.0" },
    ...staticEntries,
    ...blogEntries,
    ...caseStudyEntries,
  ];

  const urls = all
    .map((e) => {
      const entry = e as { path: string; changefreq: string; priority: string; lastmod?: string };
      return `  <url>
    <loc>${SITE_URL}${entry.path}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// ── Main ─────────────────────────────────────────────────────────────────
function main(): void {
  if (!existsSync(DIST_HTML)) {
    console.error(
      "[prerender] dist/index.html not found — run the Vite build first."
    );
    process.exit(1);
  }

  const routes = readJson<Record<string, RouteMeta>>("src/data/routes.json");
  const about = readJson<{ heading: string; paragraphs: string[] }>("src/data/about.json");
  const services = readJson<Service[]>("src/data/services.json");
  const testimonials = readJson<Testimonial[]>("src/data/testimonials.json");
  const process = readJson<{ phase: string; title: string; description: string }[]>(
    "src/data/process.json"
  );
  const faqs = readJson<Faq[]>("src/data/faqs.json");
  const projects = loadProjects();
  const blogs = loadBlogs();
  const settings = loadSettings();

  const ctx = { routes, projects, services, faqs, blogs, settings };
  const original = readFileSync(DIST_HTML, "utf-8");
  let count = 0;

  const writeRoute = (path: string, bodyHtml: string) => {
    const { meta, jsonLd } = buildSeo(path, ctx);
    const html = transform(original, meta, jsonLd, bodyHtml);

    if (path === "/") {
      writeFileSync(DIST_HTML, html);
    } else {
      const file = join(DIST, `${path.replace(/^\//, "")}.html`);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, html);
    }
    count += 1;
    console.log(`  ✅ ${path}`);
  };

  // Hub routes.
  writeRoute("/", renderHome(about, services, process, faqs));
  writeRoute("/works", renderWorks(projects));
  writeRoute("/services", renderServices(services));
  writeRoute("/testimonials", renderTestimonials(testimonials));
  writeRoute("/blog", renderBlogList(blogs, settings));
  writeRoute("/contact", renderContact());

  // Blog articles (only those with a slug — live Firestore snapshots).
  for (const post of blogs) {
    if (!post.slug) continue;
    writeRoute(`/blog/${post.slug}`, renderArticle(post, settings));
  }

  // Case studies (only projects with a slug — live Firestore snapshots).
  for (const project of projects) {
    if (!project.slug) continue;
    writeRoute(`/works/${project.slug}`, renderCaseStudy(project));
  }

  // Static sitemap.
  const sitemap = buildSitemap(routes, blogs, projects);
  writeFileSync(join(DIST, "sitemap.xml"), sitemap);
  console.log("  ✅ /sitemap.xml");

  console.log(`\n[prerender] ${count} page(s) + sitemap written.`);
}

main();
