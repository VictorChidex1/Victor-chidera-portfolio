// Turn CMS rich-text (Tiptap) HTML into a short plain-text summary.
// Used to auto-fill Excerpt / Short Description fields.
export function excerptFromHtml(html: string, max = 160): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}