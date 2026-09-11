import React from "react";
import { SITE_URL } from "../seo/site";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  className?: string;
  lazy?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const PROD_HOST = "victorchidera.com";

// Responsive image with the /img resize endpoint (srcset). Uses the CDN only on
// production (where the Firebase Hosting rewrite exists); otherwise falls back
// to the plain src so local dev keeps working.
const OptimizedImage = ({
  src,
  alt,
  width,
  className,
  lazy = true,
  fetchPriority,
  sizes,
  onError,
}: OptimizedImageProps) => {
  const onProduction =
    typeof window !== "undefined" && window.location.hostname === PROD_HOST;
  const base = src.startsWith("http")
    ? src
    : `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;

  const cdn = (w: number) =>
    `/img?src=${encodeURIComponent(base)}&w=${w}&f=webp`;

  const srcSet =
    onProduction && width
      ? `${cdn(Math.round(width * 0.5))} 480w, ${cdn(width)} 960w, ${cdn(Math.round(width * 2))} 1920w`
      : undefined;

  return (
    <img
      src={onProduction && width ? cdn(width) : src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
      onError={onError}
    />
  );
};

export default OptimizedImage;
