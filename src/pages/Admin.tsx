import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  LogOut,
  FileText,
  Mail,
  Layout,
  Lock,
  PlusCircle,
  CheckCircle,
} from "lucide-react";
import { auth, db } from "../firebase";
import { STATIC_PROJECTS, STATIC_BLOGS } from "../hooks/useFirebaseData";

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "blogs" | "leads">("overview");
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [leadsList, setLeadsList] = useState<any[]>([]);

  // Forms State
  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    description: "",
    techInput: "",
    tech: [] as string[],
    link: "",
    image: "",
  });

  const [newBlog, setNewBlog] = useState({
    title: "",
    excerpt: "",
    readTime: "",
    link: "",
    image: "",
  });

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Firestore Data
  const fetchAllData = async () => {
    try {
      // 1. Projects
      const projSnap = await getDocs(
        query(collection(db, "projects"), orderBy("createdAt", "desc"))
      );
      const projs = projSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjectsList(projs);

      // 2. Blogs
      const blogSnap = await getDocs(
        query(collection(db, "blogs"), orderBy("createdAt", "desc"))
      );
      const blogs = blogSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogsList(blogs);

      // 3. Leads (Contacts)
      const leadSnap = await getDocs(
        query(collection(db, "contacts"), orderBy("createdAt", "desc"))
      );
      const leads = leadSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLeadsList(leads);
    } catch (err) {
      console.error("Error loading admin data: ", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  // Handle Login Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setLoginError(err.message || "Failed to log in. Please check credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = () => {
    signOut(auth);
  };

  // Add Tech Pill to New Project
  const addTechPill = () => {
    if (newProject.techInput.trim()) {
      setNewProject((prev) => ({
        ...prev,
        tech: [...prev.tech, prev.techInput.trim()],
        techInput: "",
      }));
    }
  };

  // Remove Tech Pill
  const removeTechPill = (techToRemove: string) => {
    setNewProject((prev) => ({
      ...prev,
      tech: prev.tech.filter((t) => t !== techToRemove),
    }));
  };

  // Create Project Submission
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.category || !newProject.description) return;

    try {
      await addDoc(collection(db, "projects"), {
        title: newProject.title,
        category: newProject.category,
        description: newProject.description,
        tech: newProject.tech,
        link: newProject.link || "#",
        image: newProject.image || "https://placehold.co/600x400/1e293b/cbd5e1?text=No+Image",
        createdAt: serverTimestamp(),
      });
      // Reset Form
      setNewProject({
        title: "",
        category: "",
        description: "",
        techInput: "",
        tech: [],
        link: "",
        image: "",
      });
      fetchAllData();
    } catch (err) {
      console.error("Failed to add project:", err);
    }
  };

  // Delete Project
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "projects", projectId));
        fetchAllData();
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    }
  };

  // Create Blog Submission
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.excerpt) return;

    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    try {
      await addDoc(collection(db, "blogs"), {
        title: newBlog.title,
        excerpt: newBlog.excerpt,
        date: formattedDate,
        readTime: newBlog.readTime || "3 min read",
        link: newBlog.link || "#",
        image: newBlog.image || "https://placehold.co/600x400/1e293b/cbd5e1?text=No+Image",
        createdAt: serverTimestamp(),
      });
      // Reset Form
      setNewBlog({
        title: "",
        excerpt: "",
        readTime: "",
        link: "",
        image: "",
      });
      fetchAllData();
    } catch (err) {
      console.error("Failed to add blog:", err);
    }
  };

  // Delete Blog
  const handleDeleteBlog = async (blogId: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteDoc(doc(db, "blogs", blogId));
        fetchAllData();
      } catch (err) {
        console.error("Failed to delete blog:", err);
      }
    }
  };

  // Delete Lead submission
  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteDoc(doc(db, "contacts", leadId));
        fetchAllData();
      } catch (err) {
        console.error("Failed to delete inquiry:", err);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // --- LOGIN VIEW ---
  if (!user) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 relative overflow-hidden">
        {/* Abstract Tech Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(249,115,22,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10"
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-xl flex items-center justify-center text-brand-orange mb-4">
              <Lock size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Control Panel
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Log in to manage your portfolio backend.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg mb-6 leading-relaxed">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Admin Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange transition-colors"
                placeholder="admin@portfolio.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Security Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full font-bold py-3.5 rounded-lg bg-brand-orange hover:bg-orange-600 text-white transition-all transform hover:scale-[1.01] flex items-center justify-center"
            >
              {loginLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Authorize Connection"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- ADMIN PORTAL MAIN VIEW ---
  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 py-24 pt-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 shadow-xl gap-4">
          <div>
            <span className="text-brand-orange font-mono text-xs uppercase tracking-widest">
              [SECURE_SHELL.LOGGED_IN]
            </span>
            <h1 className="text-2xl font-bold text-white mt-1">
              Backend Systems Portal
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Connected account: {user.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 border border-slate-800 bg-slate-950 text-slate-400 rounded-lg hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-2 text-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Dynamic Workspace Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT COLUMN: Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-3">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full p-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all border ${
                activeTab === "overview"
                  ? "bg-brand-orange/10 border-brand-orange/30 text-brand-orange"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              <Layout size={18} /> Overview Desk
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full p-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all border ${
                activeTab === "projects"
                  ? "bg-brand-orange/10 border-brand-orange/30 text-brand-orange"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              <PlusCircle size={18} /> Manage Projects
            </button>
            <button
              onClick={() => setActiveTab("blogs")}
              className={`w-full p-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all border ${
                activeTab === "blogs"
                  ? "bg-brand-orange/10 border-brand-orange/30 text-brand-orange"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              <FileText size={18} /> Manage Blogs
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`w-full p-4 rounded-xl flex items-center justify-between text-sm font-semibold transition-all border ${
                activeTab === "leads"
                  ? "bg-brand-orange/10 border-brand-orange/30 text-brand-orange"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              <span className="flex items-center gap-3">
                <Mail size={18} /> Inquiries Inbox
              </span>
              {leadsList.length > 0 && (
                <span className="px-2 py-0.5 rounded bg-brand-orange text-white text-xs font-mono">
                  {leadsList.length}
                </span>
              )}
            </button>
          </div>

          {/* RIGHT COLUMN: Tab Contents */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: OVERVIEW TAB */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stats Box 1 */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-lg group">
                      <div className="absolute right-4 top-4 text-brand-orange/10 group-hover:text-brand-orange/20 transition-colors">
                        <PlusCircle size={54} />
                      </div>
                      <span className="text-slate-400 text-xs font-mono uppercase">[DATABASE.PROJECTS]</span>
                      <h4 className="text-3xl font-bold text-white mt-4 font-mono">
                        {projectsList.length || STATIC_PROJECTS.length}
                      </h4>
                      <p className="text-slate-500 text-xs mt-2">
                        {projectsList.length > 0 ? "Serving live from Firestore" : "Serving offline static fallbacks"}
                      </p>
                    </div>

                    {/* Stats Box 2 */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-lg group">
                      <div className="absolute right-4 top-4 text-brand-orange/10 group-hover:text-brand-orange/20 transition-colors">
                        <FileText size={54} />
                      </div>
                      <span className="text-slate-400 text-xs font-mono uppercase">[DATABASE.BLOGS]</span>
                      <h4 className="text-3xl font-bold text-white mt-4 font-mono">
                        {blogsList.length || STATIC_BLOGS.length}
                      </h4>
                      <p className="text-slate-500 text-xs mt-2">
                        {blogsList.length > 0 ? "Serving live from Firestore" : "Serving offline static fallbacks"}
                      </p>
                    </div>

                    {/* Stats Box 3 */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-lg group">
                      <div className="absolute right-4 top-4 text-brand-orange/10 group-hover:text-brand-orange/20 transition-colors">
                        <Mail size={54} />
                      </div>
                      <span className="text-slate-400 text-xs font-mono uppercase">[LEADS.CONTACT_FORM]</span>
                      <h4 className="text-3xl font-bold text-white mt-4 font-mono">
                        {leadsList.length}
                      </h4>
                      <p className="text-slate-500 text-xs mt-2">
                        Total contact responses recorded
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Systems Health & Database Configuration
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                        <span className="text-slate-400">Environment Credentials</span>
                        <span className="text-green-400 flex items-center gap-1.5 font-semibold">
                          <CheckCircle size={14} /> ACTIVE (Vite Env Hooks Connected)
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                        <span className="text-slate-400">Firestore Sync Status</span>
                        <span className="text-brand-orange flex items-center gap-1.5 font-semibold">
                          <CheckCircle size={14} /> ONLINE & DYNAMIC
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: PROJECTS TAB */}
              {activeTab === "projects" && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  {/* Create Project Card */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">
                      Add New Portfolio Project
                    </h3>
                    <form onSubmit={handleCreateProject} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={newProject.title}
                            onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                            required
                            className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
                            placeholder="KudiFlow Dashboard"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Category Classification
                          </label>
                          <input
                            type="text"
                            value={newProject.category}
                            onChange={(e) => setNewProject((prev) => ({ ...prev, category: e.target.value }))}
                            required
                            className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
                            placeholder="Fintech & SaaS Platform"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Project Description (High Impact overview)
                        </label>
                        <textarea
                          rows={3}
                          value={newProject.description}
                          onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                          required
                          className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
                          placeholder="Provide a comprehensive high-impact description..."
                        ></textarea>
                      </div>

                      {/* Tech Pills Builder */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Technologies Utilized
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newProject.techInput}
                            onChange={(e) => setNewProject((prev) => ({ ...prev, techInput: e.target.value }))}
                            className="bg-brand-dark border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-orange flex-1"
                            placeholder="e.g. Firebase"
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTechPill())}
                          />
                          <button
                            type="button"
                            onClick={addTechPill}
                            className="px-4 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange rounded-lg text-sm font-semibold hover:bg-brand-orange hover:text-white transition-all"
                          >
                            Add Pill
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 min-h-8 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                          {newProject.tech.length === 0 ? (
                            <span className="text-slate-500 text-xs italic">No tags added yet. Type a technology and click Add Pill.</span>
                          ) : (
                            newProject.tech.map((t, idx) => (
                              <span
                                key={idx}
                                onClick={() => removeTechPill(t)}
                                className="px-3 py-1 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 text-xs rounded-full border border-slate-700 cursor-pointer transition-colors"
                              >
                                {t} ×
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Deployment / Target Link (Optional)
                          </label>
                          <input
                            type="text"
                            value={newProject.link}
                            onChange={(e) => setNewProject((prev) => ({ ...prev, link: e.target.value }))}
                            className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
                            placeholder="https://example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Cover Image / Asset Path (Optional)
                          </label>
                          <input
                            type="text"
                            value={newProject.image}
                            onChange={(e) => setNewProject((prev) => ({ ...prev, image: e.target.value }))}
                            className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
                            placeholder="/assets/images/proj.webp"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-3 font-semibold rounded-lg bg-brand-orange hover:bg-orange-600 text-white transition-all text-sm flex items-center gap-2"
                      >
                        <Plus size={16} /> Deploy Project Document
                      </button>
                    </form>
                  </div>

                  {/* Existing Projects List */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">
                      Existing Uploaded Projects ({projectsList.length})
                    </h3>
                    
                    {projectsList.length === 0 ? (
                      <p className="text-slate-500 text-sm italic">No dynamic projects found in database. Currently fallback cards are displayed on the Works page.</p>
                    ) : (
                      <div className="divide-y divide-slate-800">
                        {projectsList.map((proj) => (
                          <div key={proj.id} className="py-4 flex justify-between items-center gap-4">
                            <div>
                              <h5 className="font-bold text-white text-sm">{proj.title}</h5>
                              <p className="text-slate-400 text-xs mt-1">{proj.category}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="w-9 h-9 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tab 3: BLOGS TAB */}
              {activeTab === "blogs" && (
                <motion.div
                  key="blogs"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  {/* Create Blog Card */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">
                      Write New Blog Post / Article Hook
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
                          placeholder="The Art of It Works on My Machine"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Excerpt Summary
                        </label>
                        <textarea
                          rows={3}
                          value={newBlog.excerpt}
                          onChange={(e) => setNewBlog((prev) => ({ ...prev, excerpt: e.target.value }))}
                          required
                          className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
                          placeholder="Surviving the beautiful chaos of modern web development..."
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Estimated Read Time
                          </label>
                          <input
                            type="text"
                            value={newBlog.readTime}
                            onChange={(e) => setNewBlog((prev) => ({ ...prev, readTime: e.target.value }))}
                            className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
                            placeholder="3 min read"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Medium / Hashnode URL Link
                          </label>
                          <input
                            type="text"
                            value={newBlog.link}
                            onChange={(e) => setNewBlog((prev) => ({ ...prev, link: e.target.value }))}
                            className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
                            placeholder="https://medium.com/@username/blog-post"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Banner Image Path (Optional)
                          </label>
                          <input
                            type="text"
                            value={newBlog.image}
                            onChange={(e) => setNewBlog((prev) => ({ ...prev, image: e.target.value }))}
                            className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
                            placeholder="/assets/images/blog1.webp"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-3 font-semibold rounded-lg bg-brand-orange hover:bg-orange-600 text-white transition-all text-sm flex items-center gap-2"
                      >
                        <Plus size={16} /> Deploy Article Document
                      </button>
                    </form>
                  </div>

                  {/* Existing Blogs List */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">
                      Existing Uploaded Articles ({blogsList.length})
                    </h3>
                    
                    {blogsList.length === 0 ? (
                      <p className="text-slate-500 text-sm italic">No dynamic articles found in database. Currently fallback cards are displayed on the Blog page.</p>
                    ) : (
                      <div className="divide-y divide-slate-800">
                        {blogsList.map((blog) => (
                          <div key={blog.id} className="py-4 flex justify-between items-center gap-4">
                            <div>
                              <h5 className="font-bold text-white text-sm">{blog.title}</h5>
                              <p className="text-slate-400 text-xs mt-1">{blog.date} • {blog.readTime}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="w-9 h-9 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tab 4: LEADS TAB */}
              {activeTab === "leads" && (
                <motion.div
                  key="leads"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <Mail size={20} className="text-brand-orange" /> Inbound leads inbox ({leadsList.length})
                    </h3>

                    {leadsList.length === 0 ? (
                      <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl">
                        <span className="text-slate-500 text-sm italic">No inquiries received yet. Submit forms on the Contact page to test!</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {leadsList.map((lead) => (
                          <div
                            key={lead.id}
                            className="bg-slate-950 border border-slate-800/80 p-5 rounded-xl hover:border-brand-orange/30 transition-all duration-300 relative group"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-white text-base">
                                  {lead.name}
                                </h4>
                                <span className="text-slate-400 text-xs font-mono">
                                  {lead.email}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <p className="text-slate-300 text-sm bg-slate-900/40 p-4 border border-slate-800/50 rounded-lg leading-relaxed whitespace-pre-line font-light">
                              {lead.message}
                            </p>
                            <div className="mt-3 text-right">
                              <span className="text-slate-500 font-mono text-[10px]">
                                Submitted on: {lead.createdAt?.seconds ? new Date(lead.createdAt.seconds * 1000).toLocaleString() : "Real-time sync"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Admin;
