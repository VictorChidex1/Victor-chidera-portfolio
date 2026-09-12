import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

interface ServicesTabProps {
  servicesList: any[];
  fetchAllData: () => Promise<void>;
}

const emptyForm = {
  title: "",
  description: "",
  tagsInput: "",
  tags: [] as string[],
  order: "",
  status: "published",
};

export const ServicesTab: React.FC<ServicesTabProps> = ({ servicesList, fetchAllData }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const addTag = () => {
    if (form.tagsInput.trim()) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, prev.tagsInput.trim()], tagsInput: "" }));
    }
  };

  const removeTag = (t: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    const payload = {
      title: form.title,
      description: form.description,
      tags: form.tags,
      order: form.order !== "" ? Number(form.order) : 99999,
      status: form.status,
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "services", editingId), { ...payload, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "services"), { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
      resetForm();
      await fetchAllData();
    } catch (err) {
      console.error("Failed to save service:", err);
    }
  };

  const startEdit = (service: any) => {
    setEditingId(service.id);
    setForm({
      title: service.title || "",
      description: service.description || "",
      tagsInput: "",
      tags: service.tags || [],
      order: service.order !== undefined && service.order !== 99999 ? String(service.order) : "",
      status: service.status || "published",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this service?")) {
      try {
        await deleteDoc(doc(db, "services", id));
        await fetchAllData();
      } catch (err) {
        console.error("Failed to delete service:", err);
      }
    }
  };

  return (
    <motion.div key="services" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
      <div className="bg-white border border-brand-line p-6 rounded-2xl">
        <h3 className="text-lg font-bold font-display text-brand-ink mb-6 flex justify-between items-center">
          <span>{editingId ? "Edit Service" : "Add New Service"}</span>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-3 py-1 bg-brand-surface text-brand-muted hover:text-brand-ink rounded text-xs font-mono border border-brand-line">
              Cancel Edit
            </button>
          )}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Service Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
              placeholder="Web Development"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
              placeholder="Describe what this service covers..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Tags</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={form.tagsInput}
                onChange={(e) => setForm((p) => ({ ...p, tagsInput: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1 bg-white border border-brand-line rounded-lg px-4 py-2 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
                placeholder="e.g. React"
              />
              <button type="button" onClick={addTag} className="px-4 bg-brand-ink/5 border border-brand-line text-brand-ink rounded-lg text-sm font-semibold hover:bg-brand-ink hover:text-white transition-all">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-8 p-3 bg-brand-surface border border-brand-line rounded-xl">
              {form.tags.length === 0 ? (
                <span className="text-brand-muted text-xs italic">No tags added.</span>
              ) : (
                form.tags.map((t, i) => (
                  <span key={i} onClick={() => removeTag(t)} className="px-3 py-1 bg-white hover:bg-red-500/10 hover:text-red-500 text-brand-muted text-xs rounded-full border border-brand-line cursor-pointer transition-colors">
                    {t} ×
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Order (e.g. 1 for first)</label>
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
            {editingId ? <><Edit2 size={16} /> Update Service</> : <><Plus size={16} /> Add Service</>}
          </button>
        </form>
      </div>

      <div className="bg-white border border-brand-line p-6 rounded-2xl">
        <h3 className="text-lg font-bold font-display text-brand-ink mb-6">Existing Services ({servicesList.length})</h3>
        {servicesList.length === 0 ? (
          <p className="text-brand-muted text-sm italic">No services yet. Fallback cards are shown on the Services page.</p>
        ) : (
          <div className="divide-y divide-brand-line">
            {servicesList.map((s) => (
              <div key={s.id} className="py-4 flex justify-between items-center gap-4">
                <div>
                  <h5 className="font-bold text-brand-ink text-sm flex items-center gap-2">
                    {s.order !== undefined && s.order !== "" && (
                      <span className="px-2 py-0.5 bg-brand-ink/5 border border-brand-line text-brand-ink text-xs rounded font-mono">#{s.order}</span>
                    )}
                    {s.title}
                    {s.status === "draft" && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-mono">draft</span>}
                  </h5>
                  <p className="text-brand-muted text-xs mt-1">{s.description?.slice(0, 80)}…</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(s)} className="w-9 h-9 flex items-center justify-center bg-brand-ink/5 border border-brand-line text-brand-ink rounded-lg hover:bg-brand-ink hover:text-white transition-all" title="Edit">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="w-9 h-9 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Delete">
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
