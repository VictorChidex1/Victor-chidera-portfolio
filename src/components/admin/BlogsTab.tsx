import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase";
import ImageUploadField from "./ImageUploadField";
import RichTextEditor from "./RichTextEditor";
import { slugify } from "../../lib/slug";
import { excerptFromHtml } from "../../lib/excerpt";
import { toDatetimeLocal, fromDatetimeLocal, formatDisplayDate } from "../../lib/datetime";

interface BlogsTabProps {
  blogsList: any[];
  settings?: any;
  fetchAllData: () => Promise<void>;
}

type SubTab = "details" | "content" | "seo";

const emptyBlog = {
  title: "",
  slug: "",
  author: "",
  excerpt: "",
  content: "",
  coverImage: "",
  coverImagePath: "",
  readTime: "",
  tagsInput: "",
  tags: [] as string[],
  link: "",
  status: "published",
  publishedAtInput: "",
  seoTitle: "",
  seoDescription: "",
};

const SUBTABS: { key: SubTab; label: string }[] = [
  { key: "details", label: "Details" },
  { key: "content", label: "Content" },
  { key: "seo", label: "SEO" },
];

function computeReadTime(html: string): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export const BlogsTab: React.FC<BlogsTabProps> = ({ blogsList, settings, fetchAllData }) => {
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [adminBlogsPage, setAdminBlogsPage] = useState(1);
  const [subTab, setSubTab] = useState<SubTab>("details");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerptTouched, setExcerptTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [blog, setBlog] = useState(emptyBlog);
  const blogsPerPage = 10;

  const set = (key: keyof typeof emptyBlog, value: any) =>
    setBlog((prev) => ({ ...prev, [key]: value }));

  // Auto-fill the author from site settings on brand-new posts.
  useEffect(() => {
    if (!editingBlogId && settings?.name && !blog.author) {
      setBlog((prev) => ({ ...prev, author: settings.name }));
    }
  }, [settings?.name, editingBlogId]);

  const addTag = () => {
    if (blog.tagsInput.trim()) {
      setBlog((prev) => ({ ...prev, tags: [...prev.tags, prev.tagsInput.trim()], tagsInput: "" }));
    }
  };
  const removeTag = (t: string) => setBlog((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));

  const resetForm = () => {
    setBlog(emptyBlog);
    setEditingBlogId(null);
    setSlugTouched(false);
    setExcerptTouched(false);
    setSubTab("details");
  };

  const slugExists = async (slug: string, excludeId?: string) => {
    if (!slug) return false;
    const snap = await getDocs(query(collection(db, "blogs"), where("slug", "==", slug)));
    return snap.docs.some((d) => d.id !== excludeId);
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog.title || !blog.excerpt) return;

    const slug = (blog.slug || slugify(blog.title)).trim();
    if (!slug) {
      alert("Could not derive a slug from the title.");
      return;
    }
    if (await slugExists(slug, editingBlogId ?? undefined)) {
      alert(`The slug "${slug}" is already in use. Please choose a different one.`);
      return;
    }

    setSaving(true);
    try {
      const scheduledDate = fromDatetimeLocal(blog.publishedAtInput);
      const publishAt = scheduledDate ? Timestamp.fromDate(scheduledDate) : null;

      const payload = {
        title: blog.title,
        slug,
        author: blog.author || settings?.name || "",
        excerpt: blog.excerpt,
        content: blog.content,
        coverImage: blog.coverImage || "",
        coverImagePath: blog.coverImagePath || null,
        readTime: blog.readTime || computeReadTime(blog.content),
        tags: blog.tags,
        link: blog.link || "",
        status: blog.status,
        seoTitle: blog.seoTitle,
        seoDescription: blog.seoDescription,
        updatedAt: serverTimestamp(),
      };

      if (editingBlogId) {
        await updateDoc(doc(db, "blogs", editingBlogId), {
          ...payload,
          ...(publishAt
            ? { publishedAt: publishAt, date: formatDisplayDate(scheduledDate!) }
            : {}),
        });
      } else {
        const formattedDate = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        await addDoc(collection(db, "blogs"), {
          ...payload,
          date: publishAt ? formatDisplayDate(scheduledDate!) : formattedDate,
          createdAt: serverTimestamp(),
          publishedAt: publishAt ?? serverTimestamp(),
        });
      }

      resetForm();
      await fetchAllData();
    } catch (err) {
      console.error("Failed to save blog:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (b: any) => {
    setEditingBlogId(b.id);
    setSlugTouched(true);
    setExcerptTouched(Boolean(b.excerpt));
    setSubTab("details");
    setBlog({
      title: b.title || "",
      slug: b.slug || "",
      author: b.author || "",
      excerpt: b.excerpt || "",
      content: b.content || "",
      coverImage: b.coverImage || b.image || "",
      coverImagePath: b.coverImagePath || b.imagePath || "",
      readTime: b.readTime || "",
      tagsInput: "",
      tags: b.tags || [],
      link: b.link || "",
      status: b.status || "published",
      publishedAtInput: toDatetimeLocal(b.publishedAt),
      seoTitle: b.seoTitle || "",
      seoDescription: b.seoDescription || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteBlog = async (b: any) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        const path = b.coverImagePath || b.imagePath;
        if (path) deleteObject(ref(storage, path)).catch(() => {});
        await deleteDoc(doc(db, "blogs", b.id));
        await fetchAllData();
      } catch (err) {
        console.error("Failed to delete blog:", err);
      }
    }
  };

  const totalAdminPages = Math.ceil(blogsList.length / blogsPerPage);
  const currentAdminBlogs = blogsList.slice((adminBlogsPage - 1) * blogsPerPage, adminBlogsPage * blogsPerPage);

  const inputClass =
    "w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink";
  const labelClass = "block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2";

  return (
    <motion.div key="blogs" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
      <div className="bg-white border border-brand-line p-6 rounded-2xl">
        <h3 className="text-lg font-bold font-display text-brand-ink mb-4 flex justify-between items-center">
          <span>{editingBlogId ? "Edit Blog Post" : "Write New Blog Post"}</span>
          {editingBlogId && (
            <button type="button" onClick={resetForm} className="px-3 py-1 bg-brand-surface text-brand-muted hover:text-brand-ink rounded text-xs font-mono border border-brand-line">
              Cancel Edit
            </button>
          )}
        </h3>

        <div className="flex gap-2 mb-6 border-b border-brand-line pb-3">
          {SUBTABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setSubTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${subTab === t.key ? "bg-brand-ink text-white" : "text-brand-muted hover:text-brand-ink hover:bg-brand-surface"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleCreateBlog} className="space-y-5">
          {subTab === "details" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Article Title</label>
                  <input
                    type="text"
                    value={blog.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setBlog((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }));
                    }}
                    required
                    className={inputClass}
                    placeholder="Blueprint Before Code…"
                  />
                </div>
                <div>
                  <label className={labelClass}>Slug (URL)</label>
                  <input
                    type="text"
                    value={blog.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", e.target.value);
                    }}
                    className={inputClass}
                    placeholder="blueprint-before-code"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Author</label>
                <input
                  type="text"
                  value={blog.author}
                  onChange={(e) => set("author", e.target.value)}
                  className={inputClass}
                  placeholder="Victor Chidera"
                />
                <p className="text-brand-muted text-[10px] mt-1">
                  Auto-filled from Site Settings. Edit per-post if needed.
                </p>
              </div>

              <div>
                <label className={labelClass}>Excerpt (Summary)</label>
                <textarea
                  rows={3}
                  value={blog.excerpt}
                  onChange={(e) => {
                    set("excerpt", e.target.value);
                    setExcerptTouched(true);
                  }}
                  required
                  className={inputClass}
                  placeholder="Auto-filled from the article content (or type your own)."
                />
              </div>

              {/* Tags */}
              <div>
                <label className={labelClass}>Tags</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={blog.tagsInput}
                    onChange={(e) => set("tagsInput", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 bg-white border border-brand-line rounded-lg px-4 py-2 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
                    placeholder="e.g. React"
                  />
                  <button type="button" onClick={addTag} className="px-4 bg-brand-ink/5 border border-brand-line text-brand-ink rounded-lg text-sm font-semibold hover:bg-brand-ink hover:text-white transition-all">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-8 p-3 bg-brand-surface border border-brand-line rounded-xl">
                  {blog.tags.length === 0 ? (
                    <span className="text-brand-muted text-xs italic">No tags added.</span>
                  ) : (
                    blog.tags.map((t, i) => (
                      <span key={i} onClick={() => removeTag(t)} className="px-3 py-1 bg-white hover:bg-red-500/10 hover:text-red-500 text-brand-muted text-xs rounded-full border border-brand-line cursor-pointer transition-colors">
                        {t} ×
                      </span>
                    ))
                  )}
                </div>
              </div>

              <ImageUploadField
                label="Featured Cover Image (Upload to Storage)"
                value={blog.coverImage}
                valuePath={blog.coverImagePath || undefined}
                storageFolder="blog-covers"
                onChange={(url, path) => setBlog((prev) => ({ ...prev, coverImage: url, coverImagePath: path || "" }))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <div>
                  <label className={labelClass}>Read Time</label>
                  <input type="text" value={blog.readTime} onChange={(e) => set("readTime", e.target.value)} className={inputClass} placeholder="Auto from content" />
                </div>
                <div>
                  <label className={labelClass}>Legacy External Link (Optional)</label>
                  <input type="text" value={blog.link} onChange={(e) => set("link", e.target.value)} className={inputClass} placeholder="https://medium.com/…" />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select value={blog.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Publish Date &amp; Time</label>
                  <input type="datetime-local" value={blog.publishedAtInput} onChange={(e) => set("publishedAtInput", e.target.value)} className={inputClass} />
                  <p className="text-brand-muted text-[10px] mt-1">Empty = now · Past = backdate · Future = schedule</p>
                </div>
              </div>
            </>
          )}

          {subTab === "content" && (
            <div>
              <label className={labelClass}>Article Content</label>
              <RichTextEditor
                content={blog.content}
                onChange={(html) => {
                  set("content", html);
                  if (!excerptTouched) set("excerpt", excerptFromHtml(html));
                }}
                placeholder="Write your article…"
                minHeight="420px"
              />
            </div>
          )}

          {subTab === "seo" && (
            <>
              <div>
                <label className={labelClass}>SEO Title</label>
                <input type="text" value={blog.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className={inputClass} placeholder="My Post | Victor Chidera" />
              </div>
              <div>
                <label className={labelClass}>SEO Description</label>
                <textarea rows={3} value={blog.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} className={inputClass} placeholder="Meta description for search results and social previews." />
              </div>
            </>
          )}

          <button type="submit" disabled={saving} className="px-5 py-3 font-semibold rounded-lg bg-brand-ink hover:bg-neutral-800 text-white transition-all text-sm flex items-center gap-2 disabled:opacity-50">
            {saving ? "Saving…" : editingBlogId ? <><Edit2 size={16} /> Update Article</> : <><Plus size={16} /> Publish Article</>}
          </button>
        </form>
      </div>

      <div className="bg-white border border-brand-line p-6 rounded-2xl">
        <h3 className="text-lg font-bold font-display text-brand-ink mb-6">Existing Articles ({blogsList.length})</h3>
        {blogsList.length === 0 ? (
          <p className="text-brand-muted text-sm italic">No dynamic articles found. Fallback cards are shown on the Blog page.</p>
        ) : (
          <>
            <div className="divide-y divide-brand-line">
              {currentAdminBlogs.map((b) => (
                <div key={b.id} className="py-4 flex justify-between items-center gap-4">
                  <div>
                    <h5 className="font-bold text-brand-ink text-sm flex items-center gap-2">
                      {b.title}
                      {b.status === "draft" && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-mono">draft</span>}
                      {b.status !== "draft" && b.publishedAt?.seconds * 1000 > Date.now() && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-mono">scheduled</span>
                      )}
                    </h5>
                    <p className="text-brand-muted text-xs mt-1">
                      {b.slug ? <span className="font-mono">/blog/{b.slug}</span> : <span>External link · {b.readTime}</span>}
                      {b.author && <span className="text-brand-accent font-medium"> · by {b.author}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleStartEdit(b)} className="w-9 h-9 flex items-center justify-center bg-brand-ink/5 border border-brand-line text-brand-ink rounded-lg hover:bg-brand-ink hover:text-white transition-all" title="Edit">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDeleteBlog(b)} className="w-9 h-9 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalAdminPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 pt-6 border-t border-brand-line">
                <button disabled={adminBlogsPage === 1} onClick={() => setAdminBlogsPage((p) => Math.max(p - 1, 1))} className="px-3 py-1.5 bg-white border border-brand-line rounded-lg text-xs font-semibold text-brand-muted hover:text-brand-ink disabled:opacity-40 transition-all">Prev</button>
                {Array.from({ length: totalAdminPages }).map((_, i) => (
                  <button key={i} onClick={() => setAdminBlogsPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-semibold font-mono border transition-all ${adminBlogsPage === i + 1 ? "bg-brand-ink border-brand-ink text-white font-bold" : "bg-white border-brand-line text-brand-muted hover:text-brand-ink"}`}>{i + 1}</button>
                ))}
                <button disabled={adminBlogsPage === totalAdminPages} onClick={() => setAdminBlogsPage((p) => Math.min(p + 1, totalAdminPages))} className="px-3 py-1.5 bg-white border border-brand-line rounded-lg text-xs font-semibold text-brand-muted hover:text-brand-ink disabled:opacity-40 transition-all">Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
