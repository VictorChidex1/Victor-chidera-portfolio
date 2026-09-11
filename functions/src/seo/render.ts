// SEO document rendering — shared by the gateway and the ISR snapshot trigger.

import { getRouteMeta, SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "./config";
import { renderDocument, SeoMeta } from "./html";
import {
  personSchema,
  websiteSchema,
  faqSchema,
  collectionPageSchema,
  articleSchema,
  breadcrumbSchema,
  contactPageSchema,
} from "./schemas";
import {
  renderRoute,
  getProjects,
  getBlogBySlug,
  projectsToCollectionItems,
} from "./content";

import faqsData from "../data/faqs.json";
import servicesData from "../data/services.json";

function toIso(timestamp?: { seconds: number }): string | undefined {
  if (!timestamp || !timestamp.seconds) return undefined;
  return new Date(timestamp.seconds * 1000).toISOString();
}

export interface SeoResult {
  meta: SeoMeta;
  jsonLd: object[];
  status: number;
}

export async function buildSeo(path: string): Promise<SeoResult> {
  // CMS / admin: never index.
  if (path === "/admin" || path.startsWith("/admin/")) {
    return {
      meta: {
        title: "Admin | Victor Chidera",
        description: "Admin",
        path,
        robots: "noindex, nofollow",
      },
      jsonLd: [],
      status: 200,
    };
  }

  const route = getRouteMeta(path);
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
        personSchema(),
        websiteSchema(),
        faqSchema(faqsData as { question: string; answer: string }[]),
      ];
      break;

    case path === "/works": {
      const projects = await getProjects();
      jsonLd = [
        collectionPageSchema(
          "Selected Works",
          "/works",
          route.description,
          projectsToCollectionItems(projects)
        ),
      ];
      break;
    }

    case path === "/services":
      jsonLd = [
        collectionPageSchema(
          "Services",
          "/services",
          route.description,
          (servicesData as { title: string }[]).map((s) => ({
            name: s.title,
            url: `${SITE_URL}/services`,
          }))
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
      const post = await getBlogBySlug(slug);
      if (post && (post.status === undefined || post.status !== "draft")) {
        meta.title = `${post.title} | Victor Chidera`;
        meta.description = post.excerpt || route.description;
        meta.image = post.coverImage;
        meta.type = "article";
        meta.publishedTime = toIso(post.createdAt);
        meta.modifiedTime = toIso(post.updatedAt);
        meta.section = "Blog";
        jsonLd = [
          articleSchema({
            title: post.title,
            description: post.excerpt || "",
            slug,
            coverImage: post.coverImage,
            publishedTime: toIso(post.createdAt),
            modifiedTime: toIso(post.updatedAt),
            section: "Blog",
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

    default:
      meta.title = "Page Not Found | Victor Chidera";
      meta.description = "The page you're looking for does not exist.";
      meta.robots = "noindex, nofollow";
      status = 404;
  }

  return { meta, jsonLd, status };
}

// Renders a full HTML document for a single article slug (used by ISR).
export async function renderArticleDocument(slug: string): Promise<string | null> {
  const path = `/blog/${slug}`;
  const { meta, jsonLd, status } = await buildSeo(path);
  if (status === 404) return null;
  const { body } = await renderRoute(path);
  return renderDocument(meta, body, jsonLd);
}

export { SITE_TITLE, SITE_DESCRIPTION };
