// Canonical production domain. Override locally via VITE_SITE_URL when needed
// (e.g. preview deploys), but never index those hosts (see PageSeo staging guard).
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://victorchidera.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Victor Chidera";
export const SITE_TITLE = "Victor Chidera | Full Stack Developer";
export const SITE_DESCRIPTION =
  "Portfolio of Victor Chidera, a Full Stack Developer specializing in React, Node.js, TypeScript, Firebase, and modern UI/UX design.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/victor-chidera-logo.webp`;

export const AUTHOR_NAME = "Victor Chidera";
export const AUTHOR_JOB_TITLE = "Full Stack Developer";
export const LOCALE = "en_NG";

export const SOCIALS = {
  github: "https://github.com/VictorChidex1",
  linkedin: "https://www.linkedin.com/in/victor-chidera-255526b9",
  twitter: "https://x.com/Iamkingchidex",
};

export const CONTACT_EMAIL = "donchid.online@gmail.com";
