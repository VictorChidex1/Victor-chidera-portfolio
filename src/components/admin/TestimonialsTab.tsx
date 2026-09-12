import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase";
import ImageUploadField from "./ImageUploadField";

interface TestimonialsTabProps {
  testimonialsList: any[];
  fetchAllData: () => Promise<void>;
}

const emptyForm = {
  name: "",
  role: "",
  content: "",
  image: "",
  imagePath: "",
  order: "",
  status: "published",
};

export const TestimonialsTab: React.FC<TestimonialsTabProps> = ({ testimonialsList, fetchAllData }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.content) return;

    const payload = {
      name: form.name,
      role: form.role,
      content: form.content,
      image: form.image || "",
      imagePath: form.imagePath || null,
      order: form.order !== "" ? Number(form.order) : 99999,
      status: form.status,
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "testimonials", editingId), { ...payload, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "testimonials"), { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
      resetForm();
      await fetchAllData();
    } catch (err) {
      console.error("Failed to save testimonial:", err);
    }
  };

  const startEdit = (t: any) => {
    setEditingId(t.id);
    setForm({
      name: t.name || "",
      role: t.role || "",
      content: t.content || "",
      image: t.image || "",
      imagePath: t.imagePath || "",
      order: t.order !== undefined && t.order !== 99999 ? String(t.order) : "",
      status: t.status || "published",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (t: any) => {
    if (window.confirm("Delete this testimonial?")) {
      try {
        if (t.imagePath) deleteObject(ref(storage, t.imagePath)).catch(() => {});
        await deleteDoc(doc(db, "testimonials", t.id));
        await fetchAllData();
      } catch (err) {
        console.error("Failed to delete testimonial:", err);
      }
    }
  };

  return (
    <motion.div key="testimonials" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
      <div className="bg-white border border-brand-line p-6 rounded-2xl">
        <h3 className="text-lg font-bold font-display text-brand-ink mb-6 flex justify-between items-center">
          <span>{editingId ? "Edit Testimonial" : "Add New Testimonial"}</span>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-3 py-1 bg-brand-surface text-brand-muted hover:text-brand-ink rounded text-xs font-mono border border-brand-line">
              Cancel Edit
            </button>
          )}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Client Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
                placeholder="Esther Onyinye"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Role / Company</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
                placeholder="CEO, TechStart"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Testimonial</label>
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              required
              className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
              placeholder="What did the client say?"
            />
          </div>

          <ImageUploadField
            label="Avatar Photo (Upload to Storage)"
            value={form.image}
            valuePath={form.imagePath || undefined}
            storageFolder="testimonials"
            onChange={(url, path) => setForm((p) => ({ ...p, image: url, imagePath: path || "" }))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
                className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
                placeholder="1"
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <button type="submit" className="px-5 py-3 font-semibold rounded-lg bg-brand-ink hover:bg-neutral-800 text-white transition-all text-sm flex items-center gap-2">
            {editingId ? <><Edit2 size={16} /> Update Testimonial</> : <><Plus size={16} /> Add Testimonial</>}
          </button>
        </form>
      </div>

      <div className="bg-white border border-brand-line p-6 rounded-2xl">
        <h3 className="text-lg font-bold font-display text-brand-ink mb-6">Existing Testimonials ({testimonialsList.length})</h3>
        {testimonialsList.length === 0 ? (
          <p className="text-brand-muted text-sm italic">No testimonials yet. Fallback cards are shown on the Testimonials page.</p>
        ) : (
          <div className="divide-y divide-brand-line">
            {testimonialsList.map((t) => (
              <div key={t.id} className="py-4 flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  {t.image && <img src={t.image} alt="" className="w-10 h-10 rounded-full object-cover border border-brand-line" />}
                  <div>
                    <h5 className="font-bold text-brand-ink text-sm flex items-center gap-2">
                      {t.name}
                      {t.status === "draft" && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-mono">draft</span>}
                    </h5>
                    <p className="text-brand-muted text-xs mt-1">{t.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(t)} className="w-9 h-9 flex items-center justify-center bg-brand-ink/5 border border-brand-line text-brand-ink rounded-lg hover:bg-brand-ink hover:text-white transition-all" title="Edit">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(t)} className="w-9 h-9 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
