// Static route SEO map — reads the single shared source (src/data/routes.json),
// which is also consumed by the gateway (synced) and the prerender script.
import routesData from "../data/routes.json";

export type SeoSchemaType =
  | "home"
  | "works"
  | "services"
  | "collection"
  | "contact";

export interface RouteSeo {
  title: string;
  description: string;
  schema: SeoSchemaType;
  image?: string;
}

export const routes = routesData as Record<string, RouteSeo>;

export function getRouteMeta(path: string): RouteSeo {
  return routes[path];
}
