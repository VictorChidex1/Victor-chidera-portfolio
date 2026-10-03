import {
  loadHome,
  loadWorks,
  loadCaseStudy,
  loadServices,
  loadTestimonials,
  loadBlog,
  loadBlogPost,
  loadContact,
} from "./lazyRoutes";

type Loader = () => Promise<unknown>;

const loaders: Record<string, Loader> = {
  "/": loadHome,
  "/works": loadWorks,
  "/works/:slug": loadCaseStudy,
  "/services": loadServices,
  "/testimonials": loadTestimonials,
  "/blog": loadBlog,
  "/blog/:slug": loadBlogPost,
  "/contact": loadContact,
};

const inflight = new Map<string, Promise<unknown>>();

function matchRoute(path: string): string | undefined {
  const segments = path.replace(/^\/+/, "").split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  if (segments.length === 1) return `/${segments[0]}`;
  if (segments.length === 2) return `/${segments[0]}/:slug`;
  return undefined;
}

export function prefetchRoute(path: string): void {
  const key = matchRoute(path);
  if (!key) return;
  const loader = loaders[key];
  if (!loader) return;
  if (!inflight.has(key)) {
    inflight.set(
      key,
      loader().catch(() => undefined)
    );
  }
}
