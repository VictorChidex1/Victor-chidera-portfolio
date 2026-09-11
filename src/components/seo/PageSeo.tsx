import { Helmet } from "react-helmet-async";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  LOCALE,
} from "../../seo/site";

interface PageSeoProps {
  title?: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: object | object[];
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  section?: string;
}

const STAGING_HOST_PATTERNS = [
  "vercel.app",
  "web.app",
  "firebaseapp.com",
  "localhost",
  "127.0.0.1",
];

function isStagingHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return STAGING_HOST_PATTERNS.some((p) => host.includes(p));
}

function toAbsoluteImage(image?: string): string {
  if (!image) return DEFAULT_OG_IMAGE;
  if (image.startsWith("http")) return image;
  return `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

const PageSeo = ({
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  path,
  image,
  type = "website",
  noindex = false,
  jsonLd,
  publishedTime,
  modifiedTime,
  authorName,
  section,
}: PageSeoProps) => {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${SITE_URL}${canonicalPath}`;
  const ogImage = toAbsoluteImage(image);
  const robots = noindex || isStagingHost() ? "noindex, nofollow" : "index, follow";
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={LOCALE} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article-specific */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && authorName && (
        <meta property="article:author" content={authorName} />
      )}
      {type === "article" && section && (
        <meta property="article:section" content={section} />
      )}

      {/* Structured data */}
      {jsonLdList.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default PageSeo;
