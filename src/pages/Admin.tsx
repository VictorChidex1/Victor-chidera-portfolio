import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { auth, db } from "../firebase";
import { STATIC_PROJECTS, STATIC_BLOGS, sortProjects } from "../hooks/useFirebaseData";

// Modular Subcomponents
import { AdminLogin } from "../components/admin/AdminLogin";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { OverviewTab } from "../components/admin/OverviewTab";
import { ProjectsTab } from "../components/admin/ProjectsTab";
import { BlogsTab } from "../components/admin/BlogsTab";
import { InquiriesTab } from "../components/admin/InquiriesTab";

const Admin: React.FC = () => {
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

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email !== "donchid.online@gmail.com") {
        try {
          await signOut(auth);
        } catch (signOutErr) {
          console.error("Error signing out unverified admin:", signOutErr);
        }
        setUser(null);
        setLoginError("Access Denied: You do not have administrator clearance.");
      } else {
        setUser(currentUser);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Firestore Data
  const fetchAllData = async () => {
    try {
      // 1. Projects
      const projSnap = await getDocs(collection(db, "projects"));
      const projs = projSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjectsList(sortProjects(projs));

      // 2. Blogs
      const blogSnap = await getDocs(collection(db, "blogs"));
      const blogs = blogSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Sort blogs by createdAt or fallback
      blogs.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setBlogsList(blogs);

      // 3. Leads (Contacts)
      const leadSnap = await getDocs(collection(db, "contacts"));
      const leads = leadSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      leads.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
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

  // Seed Database Handler
  const [seedLoading, setSeedLoading] = useState(false);
  const handleSeedDatabase = async () => {
    if (!window.confirm("This will copy all 11 static projects and 3 blog articles from staging directly into your live Firestore collections. Proceed?")) return;

    setSeedLoading(true);
    try {
      // 1. Seed Projects
      for (const proj of STATIC_PROJECTS) {
        await addDoc(collection(db, "projects"), {
          title: proj.title,
          category: proj.category,
          description: proj.description,
          tech: proj.tech,
          link: proj.link,
          image: proj.image,
          order: proj.order,
          createdAt: serverTimestamp(),
        });
      }

      // 2. Seed Blogs
      for (const blog of STATIC_BLOGS) {
        await addDoc(collection(db, "blogs"), {
          title: blog.title,
          excerpt: blog.excerpt,
          date: blog.date,
          readTime: blog.readTime,
          link: blog.link,
          image: blog.image,
          createdAt: serverTimestamp(),
        });
      }

      alert("Staging database successfully seeded! All 11 projects and 3 articles are now live in Firestore.");
      await fetchAllData();
    } catch (err) {
      console.error("Seeding failed:", err);
      alert("Failed to seed database. Verify your connection and security rules.");
    } finally {
      setSeedLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Render Login Panel if Unauthenticated
  if (!user) {
    return (
      <AdminLogin
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loginError={loginError}
        loginLoading={loginLoading}
        handleLogin={handleLogin}
      />
    );
  }

  // Render Main Logged In Workspace
  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 py-24 pt-32 px-4 md:px-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <AdminHeader email={user.email} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            leadsCount={leadsList.length}
          />

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <OverviewTab
                  projectsList={projectsList}
                  blogsList={blogsList}
                  leadsList={leadsList}
                  setActiveTab={setActiveTab}
                  handleSeedDatabase={handleSeedDatabase}
                  seedLoading={seedLoading}
                />
              )}

              {activeTab === "projects" && (
                <ProjectsTab
                  projectsList={projectsList}
                  fetchAllData={fetchAllData}
                />
              )}

              {activeTab === "blogs" && (
                <BlogsTab
                  blogsList={blogsList}
                  fetchAllData={fetchAllData}
                />
              )}

              {activeTab === "leads" && (
                <InquiriesTab
                  leadsList={leadsList}
                  fetchAllData={fetchAllData}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
