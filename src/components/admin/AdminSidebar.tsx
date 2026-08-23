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
            ? "bg-brand-ink border-brand-ink text-white"
            : "bg-white border-brand-line text-brand-muted hover:text-brand-ink hover:border-brand-ink"
        }`}
      >
        <Layout size={18} /> Overview Desk
      </button>
      <button
        onClick={() => setActiveTab("projects")}
        className={`w-full p-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all border ${
          activeTab === "projects"
            ? "bg-brand-ink border-brand-ink text-white"
            : "bg-white border-brand-line text-brand-muted hover:text-brand-ink hover:border-brand-ink"
        }`}
      >
        <PlusCircle size={18} /> Manage Projects
      </button>
      <button
        onClick={() => setActiveTab("blogs")}
        className={`w-full p-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all border ${
          activeTab === "blogs"
            ? "bg-brand-ink border-brand-ink text-white"
            : "bg-white border-brand-line text-brand-muted hover:text-brand-ink hover:border-brand-ink"
        }`}
      >
        <FileText size={18} /> Manage Blogs
      </button>
      <button
        onClick={() => setActiveTab("leads")}
        className={`w-full p-4 rounded-xl flex justify-between items-center text-sm font-semibold transition-all border ${
          activeTab === "leads"
            ? "bg-brand-ink border-brand-ink text-white"
            : "bg-white border-brand-line text-brand-muted hover:text-brand-ink hover:border-brand-ink"
        }`}
      >
        <span className="flex items-center gap-3">
          <Mail size={18} /> Inquiries Inbox
        </span>
        {leadsCount > 0 && (
          <span className="px-2 py-0.5 rounded bg-brand-ink text-white text-xs font-mono">
            {leadsCount}
          </span>
        )}
      </button>
    </div>
  );
};
