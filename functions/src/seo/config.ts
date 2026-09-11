// Server-side SEO configuration. Mirrors `src/seo/site.ts` + `src/seo/routes.ts`.
// Single source of truth for the interceptor; keep in sync with the client.

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

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  image?: string;
}

export const routes: Record<string, RouteMeta> = {
  "/": {
    path: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  "/works": {
    path: "/works",
    title: "Selected Works | Victor Chidera",
    description:
      "Explore Victor Chidera's latest full-stack projects, SaaS applications, and frontend implementations.",
  },
  "/services": {
    path: "/services",
    title: "Services | Victor Chidera",
    description:
      "Professional web development, performance optimization, and scalable serverless architecture services.",
  },
  "/testimonials": {
    path: "/testimonials",
    title: "Testimonials | Victor Chidera",
    description:
      "See what clients and partners say about Victor Chidera's software engineering and development process.",
  },
  "/blog": {
    path: "/blog",
    title: "Blog & Insights | Victor Chidera",
    description:
      "Insights, tutorials, and articles on full-stack development, React, and serverless engineering.",
  },
  "/contact": {
    path: "/contact",
    title: "Contact Me | Victor Chidera",
    description:
      "Get in touch to discuss your next project, collaboration, or software development needs.",
  },
};

export function getRouteMeta(path: string): RouteMeta {
  return (
    routes[path] || {
      path,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
    }
  );
}
