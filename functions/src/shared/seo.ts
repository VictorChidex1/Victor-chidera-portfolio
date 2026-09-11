// ─────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for site constants + JSON-LD structured data.
//
// Consumed by three environments (do not add runtime imports here):
//   1. Client   → src/seo/site.ts + src/seo/schemas.ts re-export this
//   2. Functions → functions/src/shared/seo.ts (synced copy) re-exported
//   3. Prerender → scripts/prerender-hubs.ts imports this directly (Node TS)
//
// Keep this file dependency-free and use only erasable TypeScript syntax.
// ─────────────────────────────────────────────────────────────────────────

export const SITE_URL = "https://victorchidera.com";
export const SITE_NAME = "Victor Chidera";
export const SITE_TITLE = "Victor Chidera | Full Stack Developer";
export const SITE_DESCRIPTION =
  "Portfolio of Victor Chidera, a Full Stack Developer specializing in React, Node.js, TypeScript, Firebase, and modern UI/UX design.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`;

export const AUTHOR_NAME = "Victor Chidera";
export const AUTHOR_JOB_TITLE = "Full Stack Developer";
export const LOCALE = "en_NG";

export const SOCIALS = {
  github: "https://github.com/VictorChidex1",
  linkedin: "https://www.linkedin.com/in/victor-chidera-255526b9",
  twitter: "https://x.com/Iamkingchidex",
};

export const CONTACT_EMAIL = "donchid.online@gmail.com";

// ── Types ────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ListItem {
  name: string;
  url: string;
}

export interface ArticlePost {
  title: string;
  description: string;
  slug: string;
  coverImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────

export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function absoluteImage(image?: string): string {
  if (!image) return DEFAULT_OG_IMAGE;
  return image.startsWith("http") ? image : absoluteUrl(image);
}

// ── JSON-LD builders ─────────────────────────────────────────────────────

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    url: SITE_URL,
    jobTitle: AUTHOR_JOB_TITLE,
    description: SITE_DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    sameAs: [SOCIALS.github, SOCIALS.linkedin, SOCIALS.twitter],
    knowsAbout: [
      "React",
      "Node.js",
      "TypeScript",
      "Next.js",
      "Firebase",
      "Tailwind CSS",
      "Framer Motion",
      "Vite",
      "Serverless Architecture",
      "Full Stack Development",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    author: { "@type": "Person", name: AUTHOR_NAME },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function collectionPageSchema(
  name: string,
  path: string,
  description: string,
  items?: ListItem[]
) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: absoluteUrl(path),
    description,
    author: { "@type": "Person", name: AUTHOR_NAME },
  };

  if (items && items.length > 0) {
    schema.mainEntity = {
      "@type": "ItemList",
      name,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: item.url,
      })),
    };
  }

  return schema;
}

export function webPageSchema(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url: absoluteUrl(path),
    description,
    inLanguage: "en",
    author: { "@type": "Person", name: AUTHOR_NAME },
  };
}

export function articleSchema(post: ArticlePost) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage
      ? absoluteImage(post.coverImage)
      : `${SITE_URL}/api/og?slug=${encodeURIComponent(post.slug)}`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: AUTHOR_NAME },
    publisher: { "@type": "Person", name: AUTHOR_NAME },
    ...(post.publishedTime ? { datePublished: post.publishedTime } : {}),
    ...(post.modifiedTime ? { dateModified: post.modifiedTime } : {}),
    ...(post.section ? { articleSection: post.section } : {}),
  };
}

export function faqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Victor Chidera",
    url: `${SITE_URL}/contact`,
    description: SITE_TITLE,
    inLanguage: "en",
  };
}
