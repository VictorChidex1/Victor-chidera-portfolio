// Firestore data access + full semantic body renderers for the interceptor.
// Static content is shared with the frontend via `src/data` (synced in).

import * as logger from "firebase-functions/logger";

import { db } from "../firebase";
import { escapeHtml } from "./html";
import { SITE_URL, SITE_NAME, CONTACT_EMAIL, SOCIALS } from "./config";

import aboutData from "../data/about.json";
import servicesData from "../data/services.json";
import testimonialsData from "../data/testimonials.json";
import processData from "../data/process.json";
import faqsData from "../data/faqs.json";
import projectsFallback from "../data/projects-fallback.json";
import blogPostsFallback from "../data/blog-posts-fallback.json";

// ── Types ────────────────────────────────────────────────────────────────

export interface Project {
  id?: string | number;
  title: string;
  category: string;
  description: string;
  tech?: string[];
  link?: string;
  image?: string;
  order?: number | string;
  createdAt?: { seconds: number };
}

export interface BlogPost {
  id?: string | number;
  slug?: string;
  title: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  date?: string;
  readTime?: string;
  link?: string;
  status?: string;
  createdAt?: { seconds: number };
  updatedAt?: { seconds: number };
}

// ── Data access ──────────────────────────────────────────────────────────

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const orderA =
      a.order !== undefined && a.order !== "" ? Number(a.order) : 99999;
    const orderB =
      b.order !== undefined && b.order !== "" ? Number(b.order) : 99999;
    if (orderA !== orderB) return orderA - orderB;
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
}

export async function getProjects(): Promise<Project[]> {
  try {
    const snap = await db.collection("projects").get();
    const projects = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Project);
    if (projects.length > 0) return sortProjects(projects);
  } catch (err) {
    logger.warn("getProjects failed, using fallback", err);
  }
  return projectsFallback as Project[];
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  try {
    const snap = await db.collection("blogs").get();
    const blogs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost);
    const published = blogs.filter(
      (b) => b.status === undefined || b.status !== "draft"
    );
    if (published.length > 0) {
      return published.sort((a, b) => {
        const ta = a.createdAt?.seconds || 0;
        const tb = b.createdAt?.seconds || 0;
        return tb - ta;
      });
    }
  } catch (err) {
    logger.warn("getPublishedBlogs failed, using fallback", err);
  }
  return blogPostsFallback as BlogPost[];
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const snap = await db
      .collection("blogs")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as BlogPost;
    }
  } catch (err) {
    logger.warn("getBlogBySlug failed", err);
  }
  return null;
}

// ── HTML helpers ─────────────────────────────────────────────────────────

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
  return tech
    .map((t) => `<li>${escapeHtml(t)}</li>`)
    .join("");
}

// ── Route body renderers ─────────────────────────────────────────────────

function renderHome(): string {
  const servicesList = servicesData
    .map(
      (s) =>
        `<li><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.description)}</p></li>`
    )
    .join("");
  const processList = processData
    .map(
      (p) =>
        `<li><h3>${escapeHtml(p.phase)}: ${escapeHtml(p.title)}</h3><p>${escapeHtml(p.description)}</p></li>`
    )
    .join("");
  const faqList = faqsData
    .map(
      (f) =>
        `<li><h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p></li>`
    )
    .join("");

  return `
    <header>${navHtml("/")}</header>
    <main>
      <h1>${escapeHtml(aboutData.heading)}</h1>
      ${aboutData.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n      ")}
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
    <footer>${escapeHtml(SITE_NAME)} — ${escapeHtml(CONTACT_EMAIL)}</footer>`;
}

function renderWorks(projects: Project[]): string {
  const list = projects
    .map(
      (p) => `
      <li>
        <h2>${escapeHtml(p.title)}</h2>
        <p>${escapeHtml(p.category)}</p>
        <p>${escapeHtml(p.description)}</p>
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

function renderServices(): string {
  const list = servicesData
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

function renderTestimonials(): string {
  const list = testimonialsData
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

function renderBlogList(blogs: BlogPost[]): string {
  const list = blogs
    .map((b) => {
      const href = b.slug ? `/blog/${b.slug}` : b.link || "#";
      const external = b.slug ? "" : ' rel="noopener"';
      return `
      <li>
        <h2><a href="${escapeHtml(href)}"${external}>${escapeHtml(b.title)}</a></h2>
        <p>${escapeHtml(b.excerpt || "")}</p>
        ${b.date ? `<p><time>${escapeHtml(b.date)}</time> · ${escapeHtml(b.readTime || "")}</p>` : ""}
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

function renderArticle(post: BlogPost): string {
  if (post.content) {
    return `
      <header>${navHtml(`/blog/${post.slug}`)}</header>
      <main>
        <article>
          <h1>${escapeHtml(post.title)}</h1>
          ${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ""}
          ${stripUnsafe(post.content)}
        </article>
      </main>`;
  }

  // Link-only post (no authored body yet): render a read-external card.
  return `
    <header>${navHtml("/blog")}</header>
    <main>
      <article>
        <h1>${escapeHtml(post.title)}</h1>
        <p>${escapeHtml(post.excerpt || "")}</p>
        <p><a href="${escapeHtml(post.link || "#")}" rel="noopener">Read the full article</a></p>
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

export interface RenderedRoute {
  body: string;
  notFound?: boolean;
}

export async function renderRoute(path: string): Promise<RenderedRoute> {
  if (path === "/") return { body: renderHome() };
  if (path === "/works") return { body: renderWorks(await getProjects()) };
  if (path === "/services") return { body: renderServices() };
  if (path === "/testimonials") return { body: renderTestimonials() };
  if (path === "/blog") return { body: renderBlogList(await getPublishedBlogs()) };
  if (path === "/contact") return { body: renderContact() };

  if (path.startsWith("/blog/")) {
    const slug = path.slice("/blog/".length);
    const post = await getBlogBySlug(slug);
    if (post && (post.status === undefined || post.status !== "draft")) {
      return { body: renderArticle(post) };
    }
    return { body: renderNotFound(), notFound: true };
  }

  return { body: renderNotFound(), notFound: true };
}

function renderNotFound(): string {
  return `
    <header>${navHtml("/")}</header>
    <main><h1>Page not found</h1><p><a href="${SITE_URL}/">Back to home</a></p></main>`;
}

export function projectsToCollectionItems(projects: Project[]) {
  return projects
    .filter((p) => p.link)
    .map((p) => ({ name: p.title, url: p.link as string }));
}
