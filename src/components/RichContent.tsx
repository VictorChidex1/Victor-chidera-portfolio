import DOMPurify from "dompurify";

interface RichContentProps {
  html: string;
  className?: string;
}

// Renders CMS-authored Tiptap HTML after sanitizing it with DOMPurify.
const RichContent = ({ html, className = "prose-cms" }: RichContentProps) => {
  const clean = DOMPurify.sanitize(html || "");
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default RichContent;
