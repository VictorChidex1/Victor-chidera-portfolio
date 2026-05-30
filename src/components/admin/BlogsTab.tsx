import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

interface BlogsTabProps {
  blogsList: any[];
  fetchAllData: () => Promise<void>;
}

export const BlogsTab: React.FC<BlogsTabProps> = ({ blogsList, fetchAllData }) => {
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [adminBlogsPage, setAdminBlogsPage] = useState(1);
  const blogsPerPage = 10;

  const [newBlog, setNewBlog] = useState({
    title: "",
    excerpt: "",
    readTime: "",
    link: "",
    image: "",
  });

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.excerpt) return;

    try {
      if (editingBlogId) {
        // Edit Mode
        await updateDoc(doc(db, "blogs", editingBlogId), {
          title: newBlog.title,
          excerpt: newBlog.excerpt,
          readTime: newBlog.readTime || "3 min read",
          link: newBlog.link || "#",
          image: newBlog.image || "https://placehold.co/600x400/1e293b/cbd5e1?text=No+Image",
        });
        setEditingBlogId(null);
      } else {
        // Create Mode
        const formattedDate = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        await addDoc(collection(db, "blogs"), {
          title: newBlog.title,
          excerpt: newBlog.excerpt,
          date: formattedDate,
          readTime: newBlog.readTime || "3 min read",
          link: newBlog.link || "#",
          image: newBlog.image || "https://placehold.co/600x400/1e293b/cbd5e1?text=No+Image",
          createdAt: serverTimestamp(),
        });
      }

      // Reset Form
      setNewBlog({
        title: "",
        excerpt: "",
        readTime: "",
        link: "",
        image: "",
      });
      await fetchAllData();
    } catch (err) {
      console.error("Failed to save blog:", err);
    }
  };

  const handleStartEdit = (blog: any) => {
    setEditingBlogId(blog.id);
    setNewBlog({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      readTime: blog.readTime || "",
      link: blog.link || "",
      image: blog.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingBlogId(null);
    setNewBlog({
      title: "",
      excerpt: "",
      readTime: "",
      link: "",
      image: "",
    });
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteDoc(doc(db, "blogs", blogId));
        await fetchAllData();
      } catch (err) {
        console.error("Failed to delete blog:", err);
      }
    }
  };

  const totalAdminPages = Math.ceil(blogsList.length / blogsPerPage);
  const currentAdminBlogs = blogsList.slice(
    (adminBlogsPage - 1) * blogsPerPage,
    adminBlogsPage * blogsPerPage
  );

  return (
    <motion.div
      key="blogs"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
    >
      {/* Create/Edit Blog Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6 flex justify-between items-center">
          <span>{editingBlogId ? "Edit Blog Post" : "Write New Blog Post / Article Hook"}</span>
          {editingBlogId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1 bg-slate-800 text-slate-400 hover:text-white rounded text-xs font-mono border border-slate-700"
            >
              Cancel Edit
            </button>
          )}
        </h3>
        <form onSubmit={handleCreateBlog} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Article Title
            </label>
            <input
              type="text"
              value={newBlog.title}
              onChange={(e) => setNewBlog((prev) => ({ ...prev, title: e.target.value }))}
              required
              className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
              placeholder="Blueprint Before Code: Scalable Schema Structures"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Brief Hook Excerpt (Summary)
            </label>
            <textarea
              rows={3}
              value={newBlog.excerpt}
              onChange={(e) => setNewBlog((prev) => ({ ...prev, excerpt: e.target.value }))}
              required
              className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
              placeholder="Why spending hours structuring your schema structure saves your backend in production..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Estimated Reading Time
              </label>
              <input
                type="text"
                value={newBlog.readTime}
                onChange={(e) => setNewBlog((prev) => ({ ...prev, readTime: e.target.value }))}
                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
                placeholder="e.g. 5 min read"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Medium / Hashnode Link (Optional)
              </label>
              <input
                type="text"
                value={newBlog.link}
                onChange={(e) => setNewBlog((prev) => ({ ...prev, link: e.target.value }))}
                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
                placeholder="https://medium.com/@yourusername"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Featured Cover Image Path (Optional)
              </label>
              <input
                type="text"
                value={newBlog.image}
                onChange={(e) => setNewBlog((prev) => ({ ...prev, image: e.target.value }))}
                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
                placeholder="/assets/images/blog.webp"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-3 font-semibold rounded-lg bg-brand-orange hover:bg-orange-600 text-white transition-all text-sm flex items-center gap-2"
          >
            {editingBlogId ? (
              <>
                <Edit2 size={16} /> Update Article Document
              </>
            ) : (
              <>
                <Plus size={16} /> Deploy Article Hook
              </>
            )}
          </button>
        </form>
      </div>

      {/* Existing Blogs List */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6">
          Existing Dynamic Articles ({blogsList.length})
        </h3>

        {blogsList.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No dynamic articles found in database. Currently fallback cards are displayed on the Blog page.</p>
        ) : (
          <>
            <div className="divide-y divide-slate-800">
              {currentAdminBlogs.map((blog) => (
                <div key={blog.id} className="py-4 flex justify-between items-center gap-4">
                  <div>
                    <h5 className="font-bold text-white text-sm">{blog.title}</h5>
                    <p className="text-slate-500 text-xs mt-1">Published: {blog.date} | {blog.readTime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(blog)}
                      className="w-9 h-9 flex items-center justify-center bg-brand-orange/10 border border-brand-orange/20 text-brand-orange rounded-lg hover:bg-brand-orange hover:text-white transition-all"
                      title="Edit Article"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="w-9 h-9 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      title="Delete Article"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginator */}
            {totalAdminPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 pt-6 border-t border-slate-800">
                <button
                  disabled={adminBlogsPage === 1}
                  onClick={() => setAdminBlogsPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 transition-all"
                >
                  Prev
                </button>
                {Array.from({ length: totalAdminPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setAdminBlogsPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold font-mono border transition-all ${
                      adminBlogsPage === i + 1
                        ? "bg-brand-orange/10 border-brand-orange/30 text-brand-orange font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={adminBlogsPage === totalAdminPages}
                  onClick={() => setAdminBlogsPage((p) => Math.min(p + 1, totalAdminPages))}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
