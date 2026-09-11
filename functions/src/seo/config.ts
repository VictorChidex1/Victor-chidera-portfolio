// Server-side SEO configuration — constants + JSON-LD come from the single
// shared source (`shared/seo.ts`, synced to `functions/src/shared/seo.ts`).
// Route metadata comes from the shared `routes.json` (also synced).
import { SITE_TITLE, SITE_DESCRIPTION } from "../shared/seo";
import routesData from "../data/routes.json";

export * from "../shared/seo";

export type SeoSchemaType =
  | "home"
  | "works"
  | "services"
  | "collection"
  | "contact";

export interface RouteMeta {
  title: string;
  description: string;
  schema: SeoSchemaType;
  image?: string;
}

export const routes = routesData as Record<string, RouteMeta>;

export function getRouteMeta(path: string): RouteMeta {
  return (
    routes[path] || {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      schema: "collection",
    }
  );
}
