// User-Agent detection for search engines and social crawlers.
// We serve full, pre-rendered HTML to these agents (dynamic rendering),
// and the SPA shell to regular browsers.

const BOT_PATTERNS: string[] = [
  "googlebot",
  "bingbot",
  "yandex",
  "baiduspider",
  "duckduckbot",
  "slurp", // Yahoo
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "whatsapp",
  "telegrambot",
  "linkedinbot",
  "slackbot",
  "discordbot",
  "applebot",
  "pinterest",
  "semrushbot",
  "ahrefsbot",
  "mj12bot",
  "bytespider",
  "petalbot", // Huawei
  "yeti", // Naver
  "sogou",
  "ia_archiver",
  "ccbot",
  "gptbot",
  "claudebot",
  "perplexitybot",
  "amazonbot",
  "google-inspectiontool",
];

export function isBot(userAgent: string | undefined | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((pattern) => ua.includes(pattern));
}

// Explicit testing/override switch: ?__prerender=1 forces bot rendering.
export function wantsPrerender(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    const params = new URLSearchParams(url.split("?")[1] || "");
    return params.get("__prerender") === "1";
  } catch {
    return false;
  }
}
