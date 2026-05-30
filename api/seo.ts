import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_URL = "https://victor-chidera-25.vercel.app";

// ── SEO Configurations Map ──────────────────────────────────────────────
const defaults = {
  title: "Victor Chidera | Full Stack Developer",
  description:
    "Portfolio of a Full Stack Developer specializing in React, Node.js, and modern UI design.",
  image: `${BASE_URL}/og-image.webp`,
};

interface RouteMeta {
  title: string;
  description: string;
  image: string;
}

const routes: Record<string, RouteMeta> = {
  "/": defaults,
  "/works": {
    title: "Selected Works | Victor Chidera",
    description:
      "Explore my latest full-stack projects, SaaS applications, and frontend implementations.",
    image: defaults.image,
  },
  "/services": {
    title: "Services | Victor Chidera",
    description:
      "Professional web development, performance optimization, and scalable serverless architecture services.",
    image: defaults.image,
  },
  "/testimonials": {
    title: "Testimonials | Victor Chidera",
    description:
      "See what clients and partners say about my software engineering and development process.",
    image: defaults.image,
  },
  "/blog": {
    title: "Blog & Insights | Victor Chidera",
    description:
      "Insights, tutorials, and articles on full-stack development, React, and serverless engineering.",
    image: defaults.image,
  },
  "/contact": {
    title: "Contact Me | Victor Chidera",
    description:
      "Get in touch to discuss your next project, collaboration, or software development needs.",
    image: defaults.image,
  },
};

// ── JSON-LD Structured Data Generators ──────────────────────────────────
function getStructuredData(path: string, fullUrl: string): object[] {
  // Base Person schema — always included
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Victor Chidera",
    url: BASE_URL,
    jobTitle: "Full Stack Developer",
    description:
      "Full Stack Developer specializing in React, Node.js, TypeScript, and modern UI/UX design.",
    image: `${BASE_URL}/og-image.webp`,
    sameAs: [
      "https://github.com/VictorChidex1",
      "https://www.linkedin.com/in/victor-chidera-255526b9",
      "https://x.com/Iamkingchidex",
    ],
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Victor Chidera Portfolio",
    url: BASE_URL,
    description: defaults.description,
    author: { "@type": "Person", name: "Victor Chidera" },
  };

  switch (path) {
    case "/":
      return [personSchema, websiteSchema];

    case "/works":
      return [
        personSchema,
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Selected Works",
          url: fullUrl,
          description: routes["/works"].description,
          author: { "@type": "Person", name: "Victor Chidera" },
          mainEntity: {
            "@type": "ItemList",
            name: "Portfolio Projects",
            numberOfItems: 11,
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "KudiFlow: The Offline-First App for Smart Vendors",
                url: "https://kudiflow.vercel.app/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Oxygen Health Systems: Premium Landing Page",
                url: "https://oxygen-health.vercel.app/",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "House of Anna: Digital Atelier & Luxury Fashion Portfolio",
                url: "https://house-of-anna.vercel.app/",
              },
              {
                "@type": "ListItem",
                position: 4,
                name: "Novluma AI: Content Orchestration SaaS",
                url: "https://novluma-saas.vercel.app/",
              },
              {
                "@type": "ListItem",
                position: 5,
                name: "VeraVox AI: Automated Reputation Engine",
                url: "https://vevavox-ai.vercel.app/",
              },
            ],
          },
        },
      ];

    case "/services":
      return [
        personSchema,
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Services",
          url: fullUrl,
          description: routes["/services"].description,
          mainEntity: {
            "@type": "ItemList",
            name: "Development Services",
            itemListElement: [
              {
                "@type": "Service",
                name: "Web Development",
                description:
                  "Building fast, responsive, and scalable websites using modern technologies.",
                provider: { "@type": "Person", name: "Victor Chidera" },
              },
              {
                "@type": "Service",
                name: "Performance Optimization",
                description:
                  "Optimizing existing applications for speed, accessibility, and search engine visibility.",
                provider: { "@type": "Person", name: "Victor Chidera" },
              },
              {
                "@type": "Service",
                name: "Serverless Architecture",
                description:
                  "Designing and implementing scalable serverless solutions using Firebase and Vercel.",
                provider: { "@type": "Person", name: "Victor Chidera" },
              },
            ],
          },
        },
      ];

    case "/testimonials":
      return [
        personSchema,
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Testimonials",
          url: fullUrl,
          description: routes["/testimonials"].description,
        },
      ];

    case "/blog":
      return [
        personSchema,
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Victor Chidera's Blog",
          url: fullUrl,
          description: routes["/blog"].description,
          author: { "@type": "Person", name: "Victor Chidera" },
        },
      ];

    case "/contact":
      return [
        personSchema,
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Victor Chidera",
          url: fullUrl,
          description: routes["/contact"].description,
        },
      ];

    default:
      return [personSchema, websiteSchema];
  }
}

// ── Main Handler ────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const urlPath = req.url || "";

  // Clean the path (remove query params for matching)
  const cleanPath = urlPath.split("?")[0].replace(/\/+$/, "") || "/";
  const meta = routes[cleanPath] || defaults;

  try {
    // 1. Fetch the raw index.html payload
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;

    // We explicitly fetch /index.html to trigger the vercel.json static asset rewrite
    const response = await fetch(`${protocol}://${host}/index.html`);

    if (!response.ok) {
      throw new Error(`Failed to fetch index.html: ${response.statusText}`);
    }

    let html = await response.text();

    // 2. Build the full canonical URL
    const fullUrl = `${BASE_URL}${cleanPath}`;

    // 3. Inject Meta Tags using regex string replacement
    html = html.replace(
      /<title>.*?<\/title>/gi,
      `<title>${meta.title}</title>`
    );
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/gi,
      `<meta name="description" content="${meta.description}" />`
    );

    // Open Graph
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/gi,
      `<meta property="og:title" content="${meta.title}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/gi,
      `<meta property="og:description" content="${meta.description}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:image["']\s+content=["'].*?["']\s*\/?>/gi,
      `<meta property="og:image" content="${meta.image}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/gi,
      `<meta property="og:url" content="${fullUrl}" />`
    );

    // Twitter
    html = html.replace(
      /<meta\s+property=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/gi,
      `<meta property="twitter:title" content="${meta.title}" />`
    );
    html = html.replace(
      /<meta\s+property=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/gi,
      `<meta property="twitter:description" content="${meta.description}" />`
    );
    html = html.replace(
      /<meta\s+property=["']twitter:image["']\s+content=["'].*?["']\s*\/?>/gi,
      `<meta property="twitter:image" content="${meta.image}" />`
    );
    html = html.replace(
      /<meta\s+property=["']twitter:url["']\s+content=["'].*?["']\s*\/?>/gi,
      `<meta property="twitter:url" content="${fullUrl}" />`
    );

    // 4. Inject Canonical URL (insert before </head>)
    const canonicalTag = `<link rel="canonical" href="${fullUrl}" />`;

    // 5. Inject JSON-LD Structured Data
    const structuredData = getStructuredData(cleanPath, fullUrl);
    const jsonLdTags = structuredData
      .map(
        (schema) =>
          `<script type="application/ld+json">${JSON.stringify(
            schema
          )}</script>`
      )
      .join("\n    ");

    // Inject canonical + JSON-LD right before </head>
    html = html.replace(
      "</head>",
      `    ${canonicalTag}\n    ${jsonLdTags}\n  </head>`
    );

    // 6. Return the modified HTML with enhanced cache headers
    res.setHeader("Content-Type", "text/html");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800"
    );
    return res.status(200).send(html);
  } catch (error) {
    console.error("SEO Interceptor Error: ", error);
    // Fallback: If it fails, redirect to actual root file to bypass function and load SPA directly
    return res.redirect(302, "/index.html");
  }
}
