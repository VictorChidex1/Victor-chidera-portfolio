import React from "react";
import { Layout, PlusCircle, FileText, Mail } from "lucide-react";

interface AdminSidebarProps {
  activeTab: "overview" | "projects" | "blogs" | "leads";
  setActiveTab: (tab: "overview" | "projects" | "blogs" | "leads") => void;
  leadsCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  leadsCount,
}) => {
  return (
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
        className={`w-full p-4 rounded-xl flex justify-between items-center text-sm font-semibold transition-all border ${
          activeTab === "leads"
            ? "bg-brand-orange/10 border-brand-orange/30 text-brand-orange"
            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
        }`}
      >
        <span className="flex items-center gap-3">
          <Mail size={18} /> Inquiries Inbox
        </span>
        {leadsCount > 0 && (
          <span className="px-2 py-0.5 rounded bg-brand-orange text-white text-xs font-mono">
            {leadsCount}
          </span>
        )}
      </button>
    </div>
  );
};
