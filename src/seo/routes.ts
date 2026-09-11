// Static route SEO map — single source of truth for the client-side head.
// Mirrors `functions/src/seo/config.ts` (the server-side interceptor config);
// keep both in sync via the predeploy content sync + manual review.

export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  image?: string;
}

export const routes: Record<string, RouteSeo> = {
  "/": {
    path: "/",
    title: "Victor Chidera | Full Stack Developer",
    description:
      "Portfolio of Victor Chidera, a Full Stack Developer specializing in React, Node.js, TypeScript, Firebase, and modern UI/UX design.",
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
