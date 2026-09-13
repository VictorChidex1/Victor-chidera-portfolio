import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { ReactNode } from "react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  ImageIcon,
  Undo2,
  Redo2,
  Heading2,
  Heading3,
} from "lucide-react";

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const EDITOR_STYLES = `
.tiptap-editor { min-height: 220px; padding: 0.75rem 1rem; outline: none; font-size: 0.875rem; line-height: 1.7; color: #111; }
.tiptap-editor p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; height: 0; pointer-events: none; color: #9ca3af; }
.tiptap-editor h2 { font-size: 1.5rem; font-weight: 700; margin: 1.25rem 0 0.5rem; letter-spacing: -0.02em; }
.tiptap-editor h3 { font-size: 1.15rem; font-weight: 700; margin: 1rem 0 0.4rem; }
.tiptap-editor p { margin: 0.5rem 0; }
.tiptap-editor ul { list-style: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
.tiptap-editor ol { list-style: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
.tiptap-editor blockquote { border-left: 3px solid #e7e5e4; padding-left: 1rem; margin: 0.75rem 0; color: #666; }
.tiptap-editor pre { background: #f7f7f5; border: 1px solid #e7e5e4; border-radius: 0.5rem; padding: 0.75rem 1rem; overflow-x: auto; font-family: ui-monospace, monospace; font-size: 0.8rem; }
.tiptap-editor code { background: #f7f7f5; padding: 0.1rem 0.3rem; border-radius: 0.25rem; font-family: ui-monospace, monospace; font-size: 0.8rem; }
.tiptap-editor pre code { background: transparent; padding: 0; }
.tiptap-editor a { color: #f97316; text-decoration: underline; }
.tiptap-editor img { max-width: 100%; height: auto; border-radius: 0.5rem; }
.tiptap-editor img.ProseMirror-selectednode { outline: 2px solid #f97316; }
`;

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: ReactNode;
}

const ToolbarButton = ({ onClick, active, disabled, label, children }: ToolbarButtonProps) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    title={label}
    className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors disabled:opacity-30 ${
      active ? "bg-brand-ink text-white" : "text-brand-muted hover:bg-brand-surface hover:text-brand-ink"
    }`}
  >
    {children}
  </button>
);

const RichTextEditor = ({ content, onChange, placeholder, minHeight = "220px" }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || "Write something…" }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "tiptap-editor",
        style: `min-height: ${minHeight};`,
      },
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("Link URL");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-brand-line rounded-lg bg-white overflow-hidden">
      <style>{EDITOR_STYLES}</style>
      <div className="max-h-[65vh] overflow-y-auto">
        <div className="sticky top-0 z-20 flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-brand-line bg-brand-surface">
          <ToolbarButton label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold size={15} /></ToolbarButton>
          <ToolbarButton label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic size={15} /></ToolbarButton>
          <ToolbarButton label="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 size={15} /></ToolbarButton>
          <ToolbarButton label="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 size={15} /></ToolbarButton>
          <div className="w-px h-5 bg-brand-line mx-1" />
          <ToolbarButton label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><List size={15} /></ToolbarButton>
          <ToolbarButton label="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered size={15} /></ToolbarButton>
          <ToolbarButton label="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quote size={15} /></ToolbarButton>
          <ToolbarButton label="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}><Code size={15} /></ToolbarButton>
          <div className="w-px h-5 bg-brand-line mx-1" />
          <ToolbarButton label="Link" onClick={setLink} active={editor.isActive("link")}><Link2 size={15} /></ToolbarButton>
          <ToolbarButton label="Image" onClick={addImage}><ImageIcon size={15} /></ToolbarButton>
          <div className="w-px h-5 bg-brand-line mx-1" />
          <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo2 size={15} /></ToolbarButton>
          <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo2 size={15} /></ToolbarButton>
        </div>
        <EditorContent editor={editor} />
      </div>

      {editor && (
        <BubbleMenu
          editor={editor}
          className="flex items-center gap-0.5 p-1.5 bg-white border border-brand-line rounded-xl shadow-lg z-50"
        >
          <ToolbarButton label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold size={15} /></ToolbarButton>
          <ToolbarButton label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic size={15} /></ToolbarButton>
          <ToolbarButton label="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}><Strikethrough size={15} /></ToolbarButton>
          <div className="w-px h-5 bg-brand-line mx-1" />
          <ToolbarButton label="Link" onClick={setLink} active={editor.isActive("link")}><Link2 size={15} /></ToolbarButton>
        </BubbleMenu>
      )}
    </div>
  );
};

export default RichTextEditor;
