import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

interface ProjectsTabProps {
  projectsList: any[];
  fetchAllData: () => Promise<void>;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projectsList, fetchAllData }) => {
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [adminProjectsPage, setAdminProjectsPage] = useState(1);
  const projectsPerPage = 10;

  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    description: "",
    techInput: "",
    tech: [] as string[],
    link: "",
    image: "",
    order: "",
  });

  const addTechPill = () => {
    if (newProject.techInput.trim()) {
      setNewProject((prev) => ({
        ...prev,
        tech: [...prev.tech, prev.techInput.trim()],
        techInput: "",
      }));
    }
  };

  const removeTechPill = (techToRemove: string) => {
    setNewProject((prev) => ({
      ...prev,
      tech: prev.tech.filter((t) => t !== techToRemove),
    }));
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.category || !newProject.description) return;

    try {
      if (editingProjectId) {
        // Edit Mode
        await updateDoc(doc(db, "projects", editingProjectId), {
          title: newProject.title,
          category: newProject.category,
          description: newProject.description,
          tech: newProject.tech,
          link: newProject.link || "#",
          image: newProject.image || "https://placehold.co/600x400/1e293b/cbd5e1?text=No+Image",
          order: newProject.order !== "" ? Number(newProject.order) : 99999,
        });
        setEditingProjectId(null);
      } else {
        // Create Mode
        await addDoc(collection(db, "projects"), {
          title: newProject.title,
          category: newProject.category,
          description: newProject.description,
          tech: newProject.tech,
          link: newProject.link || "#",
          image: newProject.image || "https://placehold.co/600x400/1e293b/cbd5e1?text=No+Image",
          order: newProject.order !== "" ? Number(newProject.order) : 99999,
          createdAt: serverTimestamp(),
        });
      }

      // Reset Form
      setNewProject({
        title: "",
        category: "",
        description: "",
        techInput: "",
        tech: [],
        link: "",
        image: "",
        order: "",
      });
      await fetchAllData();
    } catch (err) {
      console.error("Failed to save project:", err);
    }
  };

  const handleStartEdit = (proj: any) => {
    setEditingProjectId(proj.id);
    setNewProject({
      title: proj.title || "",
      category: proj.category || "",
      description: proj.description || "",
      techInput: "",
      tech: proj.tech || [],
      link: proj.link || "",
      image: proj.image || "",
      order: proj.order !== undefined && proj.order !== 99999 ? String(proj.order) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setNewProject({
      title: "",
      category: "",
      description: "",
      techInput: "",
      tech: [],
      link: "",
      image: "",
      order: "",
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
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

  return (
    <motion.div
      key="projects"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
    >
      {/* Create/Edit Project Card */}
      <div className="bg-white border border-brand-line p-6 rounded-2xl">
        <h3 className="text-lg font-bold font-display text-brand-ink mb-6 flex justify-between items-center">
          <span>{editingProjectId ? "Edit Portfolio Project" : "Add New Portfolio Project"}</span>
          {editingProjectId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1 bg-brand-surface text-brand-muted hover:text-brand-ink rounded text-xs font-mono border border-brand-line"
            >
              Cancel Edit
            </button>
          )}
        </h3>
        <form onSubmit={handleCreateProject} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                required
                className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
                placeholder="KudiFlow Dashboard"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Category Classification
              </label>
              <input
                type="text"
                value={newProject.category}
                onChange={(e) => setNewProject((prev) => ({ ...prev, category: e.target.value }))}
                required
                className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
                placeholder="Fintech & SaaS Platform"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
              Project Description (High Impact overview)
            </label>
            <textarea
              rows={3}
              value={newProject.description}
              onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
              required
              className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
              placeholder="Provide a comprehensive high-impact description..."
            ></textarea>
          </div>

          {/* Tech Pills Builder */}
          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
              Technologies Utilized
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newProject.techInput}
                onChange={(e) => setNewProject((prev) => ({ ...prev, techInput: e.target.value }))}
                className="bg-white border border-brand-line rounded-lg px-4 py-2 text-brand-ink text-sm focus:outline-none focus:border-brand-ink flex-1"
                placeholder="e.g. Firebase"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTechPill())}
              />
              <button
                type="button"
                onClick={addTechPill}
                className="px-4 bg-brand-ink/5 border border-brand-line text-brand-ink rounded-lg text-sm font-semibold hover:bg-brand-ink hover:text-white transition-all"
              >
                Add Pill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-8 p-3 bg-brand-surface border border-brand-line rounded-xl">
              {newProject.tech.length === 0 ? (
                <span className="text-brand-muted text-xs italic">No tags added yet. Type a technology and click Add Pill.</span>
              ) : (
                newProject.tech.map((t, idx) => (
                  <span
                    key={idx}
                    onClick={() => removeTechPill(t)}
                    className="px-3 py-1 bg-white hover:bg-red-500/10 hover:text-red-500 text-brand-muted text-xs rounded-full border border-brand-line cursor-pointer transition-colors"
                  >
                    {t} ×
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Deployment / Target Link (Optional)
              </label>
              <input
                type="text"
                value={newProject.link}
                onChange={(e) => setNewProject((prev) => ({ ...prev, link: e.target.value }))}
                className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Cover Image / Asset Path (Optional)
              </label>
              <input
                type="text"
                value={newProject.image}
                onChange={(e) => setNewProject((prev) => ({ ...prev, image: e.target.value }))}
                className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
                placeholder="/assets/images/proj.webp"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Order Priority (e.g. 1 for first)
              </label>
              <input
                type="number"
                value={newProject.order}
                onChange={(e) => setNewProject((prev) => ({ ...prev, order: e.target.value }))}
                className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
                placeholder="1"
                min="1"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-3 font-semibold rounded-lg bg-brand-ink hover:bg-neutral-800 text-white transition-all text-sm flex items-center gap-2"
          >
            {editingProjectId ? (
              <>
                <Edit2 size={16} /> Update Project Document
              </>
            ) : (
              <>
                <Plus size={16} /> Deploy Project Document
              </>
            )}
          </button>
        </form>
      </div>

      {/* Existing Projects List */}
      <div className="bg-white border border-brand-line p-6 rounded-2xl">
        <h3 className="text-lg font-bold font-display text-brand-ink mb-6">
          Existing Uploaded Projects ({projectsList.length})
        </h3>

        {projectsList.length === 0 ? (
          <p className="text-brand-muted text-sm italic">No dynamic projects found in database. Currently fallback cards are displayed on the Works page.</p>
        ) : (
          <>
            <div className="divide-y divide-brand-line">
              {currentAdminProjects.map((proj) => (
                <div key={proj.id} className="py-4 flex justify-between items-center gap-4">
                  <div>
                    <h5 className="font-bold text-brand-ink text-sm flex items-center gap-2">
                      {proj.order !== undefined && proj.order !== "" && (
                        <span className="px-2 py-0.5 bg-brand-ink/5 border border-brand-line text-brand-ink text-xs rounded font-mono">
                          Priority: {proj.order}
                        </span>
                      )}
                      {proj.title}
                    </h5>
                    <p className="text-brand-muted text-xs mt-1">{proj.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(proj)}
                      className="w-9 h-9 flex items-center justify-center bg-brand-ink/5 border border-brand-line text-brand-ink rounded-lg hover:bg-brand-ink hover:text-white transition-all"
                      title="Edit Project"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="w-9 h-9 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      title="Delete Project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginator */}
            {totalAdminPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 pt-6 border-t border-brand-line">
                <button
                  disabled={adminProjectsPage === 1}
                  onClick={() => setAdminProjectsPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 bg-white border border-brand-line rounded-lg text-xs font-semibold text-brand-muted hover:text-brand-ink disabled:opacity-40 transition-all"
                >
                  Prev
                </button>
                {Array.from({ length: totalAdminPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setAdminProjectsPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold font-mono border transition-all ${
                      adminProjectsPage === i + 1
                        ? "bg-brand-ink border-brand-ink text-white font-bold"
                        : "bg-white border-brand-line text-brand-muted hover:text-brand-ink"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={adminProjectsPage === totalAdminPages}
                  onClick={() => setAdminProjectsPage((p) => Math.min(p + 1, totalAdminPages))}
                  className="px-3 py-1.5 bg-white border border-brand-line rounded-lg text-xs font-semibold text-brand-muted hover:text-brand-ink disabled:opacity-40 transition-all"
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
