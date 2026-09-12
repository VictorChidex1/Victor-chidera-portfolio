import { useState } from "react";
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
import ScreenshotsUploader, { Screenshot } from "./ScreenshotsUploader";
import { slugify } from "../../lib/slug";
import { excerptFromHtml } from "../../lib/excerpt";
import { toDatetimeLocal, fromDatetimeLocal } from "../../lib/datetime";

interface ProjectsTabProps {
  projectsList: any[];
  fetchAllData: () => Promise<void>;
}

type SubTab = "details" | "sections" | "seo";

interface ResultMetric {
  label: string;
  value: string;
}

const emptyProject = {
  title: "",
  slug: "",
  category: "",
  description: "",
  status: "published",
  order: "",
  role: "",
  year: "",
  client: "",
  link: "",
  image: "",
  imagePath: "",
  techInput: "",
  tech: [] as string[],
  publishedAtInput: "",
  seoTitle: "",
  seoDescription: "",
  overview: "",
  problem: "",
  solution: "",
  technology: "",
  architecture: "",
  keyFeatures: "",
  challenges: "",
  resultsNarrative: "",
  results: [] as ResultMetric[],
  screenshots: [] as Screenshot[],
};

const SECTION_FIELDS: { key: keyof typeof emptyProject; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "problem", label: "The Problem" },
  { key: "solution", label: "The Solution" },
  { key: "technology", label: "Technology" },
  { key: "architecture", label: "Architecture" },
  { key: "keyFeatures", label: "Key Features" },
  { key: "challenges", label: "Challenges" },
  { key: "resultsNarrative", label: "Results" },
];

const SUBTABS: { key: SubTab; label: string }[] = [
  { key: "details", label: "Details" },
  { key: "sections", label: "Sections" },
  { key: "seo", label: "SEO" },
];

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projectsList, fetchAllData }) => {
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [adminProjectsPage, setAdminProjectsPage] = useState(1);
  const [subTab, setSubTab] = useState<SubTab>("details");
  const [slugTouched, setSlugTouched] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState(emptyProject);
  const projectsPerPage = 10;

  const set = (key: keyof typeof emptyProject, value: any) =>
    setProject((prev) => ({ ...prev, [key]: value }));

  const addTechPill = () => {
    if (project.techInput.trim()) {
      setProject((prev) => ({ ...prev, tech: [...prev.tech, prev.techInput.trim()], techInput: "" }));
    }
  };
  const removeTechPill = (t: string) =>
    setProject((prev) => ({ ...prev, tech: prev.tech.filter((x) => x !== t) }));

  const addResult = () => setProject((prev) => ({ ...prev, results: [...prev.results, { label: "", value: "" }] }));
  const updateResult = (i: number, patch: Partial<ResultMetric>) =>
    setProject((prev) => ({
      ...prev,
      results: prev.results.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    }));
  const removeResult = (i: number) =>
    setProject((prev) => ({ ...prev, results: prev.results.filter((_, idx) => idx !== i) }));

  const resetForm = () => {
    setProject(emptyProject);
    setEditingProjectId(null);
    setSlugTouched(false);
    setDescriptionTouched(false);
    setSubTab("details");
  };

  const slugExists = async (slug: string, excludeId?: string) => {
    if (!slug) return false;
    const q = query(collection(db, "projects"), where("slug", "==", slug));
    const snap = await getDocs(q);
    return snap.docs.some((d) => d.id !== excludeId);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.title || !project.category) return;

    const slug = (project.slug || slugify(project.title)).trim();
    if (!slug) {
      alert("Could not derive a slug from the title.");
      return;
    }
    if (await slugExists(slug, editingProjectId ?? undefined)) {
      alert(`The slug "${slug}" is already in use. Please choose a different one.`);
      return;
    }

    setSaving(true);
    try {
      const scheduledDate = fromDatetimeLocal(project.publishedAtInput);
      const publishAt = scheduledDate ? Timestamp.fromDate(scheduledDate) : null;

      const payload = {
        title: project.title,
        slug,
        category: project.category,
        description: project.description,
        status: project.status,
        order: project.order !== "" ? Number(project.order) : 99999,
        role: project.role,
        year: project.year || (scheduledDate ? String(scheduledDate.getFullYear()) : ""),
        client: project.client,
        link: project.link || "",
        image: project.image || "",
        imagePath: project.imagePath || null,
        tech: project.tech,
        seoTitle: project.seoTitle,
        seoDescription: project.seoDescription,
        overview: project.overview,
        problem: project.problem,
        solution: project.solution,
        technology: project.technology,
        architecture: project.architecture,
        keyFeatures: project.keyFeatures,
        challenges: project.challenges,
        resultsNarrative: project.resultsNarrative,
        results: project.results,
        screenshots: project.screenshots,
        updatedAt: serverTimestamp(),
      };

      if (editingProjectId) {
        await updateDoc(doc(db, "projects", editingProjectId), {
          ...payload,
          ...(publishAt ? { publishedAt: publishAt } : {}),
        });
      } else {
        await addDoc(collection(db, "projects"), {
          ...payload,
          createdAt: serverTimestamp(),
          publishedAt: publishAt ?? serverTimestamp(),
        });
      }

      resetForm();
      await fetchAllData();
    } catch (err) {
      console.error("Failed to save project:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (proj: any) => {
    setEditingProjectId(proj.id);
    setSlugTouched(true);
    setDescriptionTouched(Boolean(proj.description));
    setSubTab("details");
    setProject({
      title: proj.title || "",
      slug: proj.slug || "",
      category: proj.category || "",
      description: proj.description || "",
      status: proj.status || "published",
      order: proj.order !== undefined && proj.order !== 99999 ? String(proj.order) : "",
      role: proj.role || "",
      year: proj.year || "",
      client: proj.client || "",
      link: proj.link || "",
      image: proj.image || "",
      imagePath: proj.imagePath || "",
      techInput: "",
      tech: proj.tech || [],
      publishedAtInput: toDatetimeLocal(proj.publishedAt),
      seoTitle: proj.seoTitle || "",
      seoDescription: proj.seoDescription || "",
      overview: proj.overview || "",
      problem: proj.problem || "",
      solution: proj.solution || "",
      technology: proj.technology || "",
      architecture: proj.architecture || "",
      keyFeatures: proj.keyFeatures || "",
      challenges: proj.challenges || "",
      resultsNarrative: proj.resultsNarrative || "",
      results: proj.results || [],
      screenshots: proj.screenshots || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const proj = projectsList.find((p) => p.id === projectId);
        if (proj?.imagePath) deleteObject(ref(storage, proj.imagePath)).catch(() => {});
        (proj?.screenshots || []).forEach((s: Screenshot) => {
          if (s.path) deleteObject(ref(storage, s.path)).catch(() => {});
        });
        await deleteDoc(doc(db, "projects", projectId));
        await fetchAllData();
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    }
  };

  const totalAdminPages = Math.ceil(projectsList.length / projectsPerPage);
  const currentAdminProjects = projectsList.slice(
    (adminProjectsPage - 1) * projectsPerPage,
    adminProjectsPage * projectsPerPage
  );

  const inputClass =
    "w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink";
  const labelClass = "block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2";

  return (
    <motion.div key="projects" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
      {/* Create/Edit Project Card */}
      <div className="bg-white border border-brand-line p-6 rounded-2xl">
        <h3 className="text-lg font-bold font-display text-brand-ink mb-4 flex justify-between items-center">
          <span>{editingProjectId ? "Edit Portfolio Project" : "Add New Portfolio Project"}</span>
          {editingProjectId && (
            <button type="button" onClick={resetForm} className="px-3 py-1 bg-brand-surface text-brand-muted hover:text-brand-ink rounded text-xs font-mono border border-brand-line">
              Cancel Edit
            </button>
          )}
        </h3>

        {/* Sub-tabs */}
        <div className="flex gap-2 mb-6 border-b border-brand-line pb-3">
          {SUBTABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setSubTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                subTab === t.key ? "bg-brand-ink text-white" : "text-brand-muted hover:text-brand-ink hover:bg-brand-surface"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleCreateProject} className="space-y-5">
          {subTab === "details" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Project Title</label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setProject((prev) => ({
                        ...prev,
                        title,
                        slug: slugTouched ? prev.slug : slugify(title),
                      }));
                    }}
                    required
                    className={inputClass}
                    placeholder="KudiFlow Dashboard"
                  />
                </div>
                <div>
                  <label className={labelClass}>Slug (URL)</label>
                  <input
                    type="text"
                    value={project.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", e.target.value);
                    }}
                    className={inputClass}
                    placeholder="kudiflow-dashboard"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Category</label>
                  <input type="text" value={project.category} onChange={(e) => set("category", e.target.value)} required className={inputClass} placeholder="Fintech & SaaS" />
                </div>
                <div>
                  <label className={labelClass}>Role</label>
                  <input type="text" value={project.role} onChange={(e) => set("role", e.target.value)} className={inputClass} placeholder="Full-Stack Engineer" />
                </div>
                <div>
                  <label className={labelClass}>Year</label>
                  <input type="text" value={project.year} onChange={(e) => set("year", e.target.value)} className={inputClass} placeholder="2026" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Client (Optional)</label>
                  <input type="text" value={project.client} onChange={(e) => set("client", e.target.value)} className={inputClass} placeholder="Company name" />
                </div>
                <div>
                  <label className={labelClass}>Deployment / Target Link</label>
                  <input type="text" value={project.link} onChange={(e) => set("link", e.target.value)} className={inputClass} placeholder="https://example.com" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Short Description (listing card)</label>
                <textarea
                  rows={3}
                  value={project.description}
                  onChange={(e) => {
                    set("description", e.target.value);
                    setDescriptionTouched(true);
                  }}
                  className={inputClass}
                  placeholder="Auto-filled from the Overview section (or type your own)."
                />
              </div>

              {/* Tech pills */}
              <div>
                <label className={labelClass}>Technologies</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={project.techInput}
                    onChange={(e) => set("techInput", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTechPill())}
                    className="flex-1 bg-white border border-brand-line rounded-lg px-4 py-2 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
                    placeholder="e.g. React"
                  />
                  <button type="button" onClick={addTechPill} className="px-4 bg-brand-ink/5 border border-brand-line text-brand-ink rounded-lg text-sm font-semibold hover:bg-brand-ink hover:text-white transition-all">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-8 p-3 bg-brand-surface border border-brand-line rounded-xl">
                  {project.tech.length === 0 ? (
                    <span className="text-brand-muted text-xs italic">No technologies added.</span>
                  ) : (
                    project.tech.map((t, i) => (
                      <span key={i} onClick={() => removeTechPill(t)} className="px-3 py-1 bg-white hover:bg-red-500/10 hover:text-red-500 text-brand-muted text-xs rounded-full border border-brand-line cursor-pointer transition-colors">
                        {t} ×
                      </span>
                    ))
                  )}
                </div>
              </div>

              <ImageUploadField
                label="Cover Image (Upload to Storage)"
                value={project.image}
                valuePath={project.imagePath || undefined}
                storageFolder="projects"
                onChange={(url, path) => setProject((prev) => ({ ...prev, image: url, imagePath: path || "" }))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <div>
                  <label className={labelClass}>Order Priority</label>
                  <input type="number" value={project.order} onChange={(e) => set("order", e.target.value)} className={inputClass} placeholder="1" min="1" />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select value={project.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Publish Date &amp; Time</label>
                  <input type="datetime-local" value={project.publishedAtInput} onChange={(e) => set("publishedAtInput", e.target.value)} className={inputClass} />
                  <p className="text-brand-muted text-[10px] mt-1">Empty = now · Past = backdate · Future = schedule</p>
                </div>
              </div>
            </>
          )}

          {subTab === "sections" && (
            <>
              <div className="space-y-5">
                {SECTION_FIELDS.map((f) => (
                  <div key={f.key}>
                    <label className={labelClass}>{f.label}</label>
                    <RichTextEditor
                      content={project[f.key] as string}
                      onChange={(html) => {
                        set(f.key, html);
                        if (f.key === "overview" && !descriptionTouched) {
                          set("description", excerptFromHtml(html));
                        }
                      }}
                      placeholder={`Write the ${f.label} section…`}
                    />
                  </div>
                ))}
              </div>

              {/* Results metrics */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass}>Results (metric cards)</label>
                  <button type="button" onClick={addResult} className="px-3 py-1 bg-brand-ink/5 border border-brand-line text-brand-ink rounded-lg text-xs font-semibold hover:bg-brand-ink hover:text-white transition-all flex items-center gap-1">
                    <Plus size={13} /> Add metric
                  </button>
                </div>
                {project.results.length === 0 ? (
                  <p className="text-brand-muted text-xs italic">No metrics. Add "label → value" pairs (e.g. "Load time" → "-40%").</p>
                ) : (
                  <div className="space-y-2">
                    {project.results.map((r, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="text" value={r.label} onChange={(e) => updateResult(i, { label: e.target.value })} className={inputClass} placeholder="Metric label" />
                        <input type="text" value={r.value} onChange={(e) => updateResult(i, { value: e.target.value })} className={inputClass} placeholder="Value" />
                        <button type="button" onClick={() => removeResult(i)} className="shrink-0 w-9 h-9 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Remove">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Screenshots */}
              <div>
                <label className={labelClass}>Screenshots</label>
                <ScreenshotsUploader value={project.screenshots} onChange={(screenshots) => set("screenshots", screenshots)} />
              </div>
            </>
          )}

          {subTab === "seo" && (
            <>
              <div>
                <label className={labelClass}>SEO Title</label>
                <input type="text" value={project.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className={inputClass} placeholder="My Project | Victor Chidera" />
                <p className="text-brand-muted text-xs mt-1">Defaults to the project title if left blank.</p>
              </div>
              <div>
                <label className={labelClass}>SEO Description</label>
                <textarea rows={3} value={project.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} className={inputClass} placeholder="Meta description for search results and social previews." />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 font-semibold rounded-lg bg-brand-ink hover:bg-neutral-800 text-white transition-all text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? "Saving…" : editingProjectId ? <><Edit2 size={16} /> Update Project</> : <><Plus size={16} /> Deploy Project</>}
          </button>
        </form>
      </div>

      {/* Existing Projects List */}
      <div className="bg-white border border-brand-line p-6 rounded-2xl">
        <h3 className="text-lg font-bold font-display text-brand-ink mb-6">Existing Projects ({projectsList.length})</h3>
        {projectsList.length === 0 ? (
          <p className="text-brand-muted text-sm italic">No dynamic projects found. Fallback cards are shown on the Works page.</p>
        ) : (
          <>
            <div className="divide-y divide-brand-line">
              {currentAdminProjects.map((proj) => (
                <div key={proj.id} className="py-4 flex justify-between items-center gap-4">
                  <div>
                    <h5 className="font-bold text-brand-ink text-sm flex items-center gap-2">
                      {proj.order !== undefined && proj.order !== "" && (
                        <span className="px-2 py-0.5 bg-brand-ink/5 border border-brand-line text-brand-ink text-xs rounded font-mono">#{proj.order}</span>
                      )}
                      {proj.title}
                      {proj.status === "draft" && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-mono">draft</span>}
                      {proj.status !== "draft" && proj.publishedAt?.seconds * 1000 > Date.now() && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-mono">scheduled</span>
                      )}
                    </h5>
                    <p className="text-brand-muted text-xs mt-1">
                      {proj.slug ? <span className="font-mono">/works/{proj.slug}</span> : <span>{proj.category}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleStartEdit(proj)} className="w-9 h-9 flex items-center justify-center bg-brand-ink/5 border border-brand-line text-brand-ink rounded-lg hover:bg-brand-ink hover:text-white transition-all" title="Edit">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDeleteProject(proj.id)} className="w-9 h-9 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalAdminPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 pt-6 border-t border-brand-line">
                <button disabled={adminProjectsPage === 1} onClick={() => setAdminProjectsPage((p) => Math.max(p - 1, 1))} className="px-3 py-1.5 bg-white border border-brand-line rounded-lg text-xs font-semibold text-brand-muted hover:text-brand-ink disabled:opacity-40 transition-all">
                  Prev
                </button>
                {Array.from({ length: totalAdminPages }).map((_, i) => (
                  <button key={i} onClick={() => setAdminProjectsPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-semibold font-mono border transition-all ${adminProjectsPage === i + 1 ? "bg-brand-ink border-brand-ink text-white font-bold" : "bg-white border-brand-line text-brand-muted hover:text-brand-ink"}`}>
                    {i + 1}
                  </button>
                ))}
                <button disabled={adminProjectsPage === totalAdminPages} onClick={() => setAdminProjectsPage((p) => Math.min(p + 1, totalAdminPages))} className="px-3 py-1.5 bg-white border border-brand-line rounded-lg text-xs font-semibold text-brand-muted hover:text-brand-ink disabled:opacity-40 transition-all">
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
