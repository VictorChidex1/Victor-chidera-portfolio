// Server-side JSON-LD builders. Mirrors `src/seo/schemas.ts`.

import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  AUTHOR_NAME,
  AUTHOR_JOB_TITLE,
  SOCIALS,
} from "./config";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

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
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function collectionPageSchema(
  name: string,
  path: string,
  description: string,
  items?: { name: string; url: string }[]
) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: `${SITE_URL}${path}`,
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

export interface ArticlePost {
  title: string;
  description: string;
  slug: string;
  coverImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
}

export function articleSchema(post: ArticlePost) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage
      ? post.coverImage.startsWith("http")
        ? post.coverImage
        : `${SITE_URL}${post.coverImage}`
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

export interface FaqItem {
  question: string;
  answer: string;
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
    description: SITE_NAME,
  };
}
