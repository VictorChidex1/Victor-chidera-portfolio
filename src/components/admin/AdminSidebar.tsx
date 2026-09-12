import { Layout, PlusCircle, FileText, Mail, Wrench, Quote } from "lucide-react";

interface AdminSidebarProps {
  activeTab: "overview" | "projects" | "blogs" | "services" | "testimonials" | "leads";
  setActiveTab: (tab: "overview" | "projects" | "blogs" | "services" | "testimonials" | "leads") => void;
  leadsCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, leadsCount }) => {
  const btn = (tab: AdminSidebarProps["activeTab"], icon: React.ReactNode, label: string, badge?: number) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full p-4 rounded-xl flex justify-between items-center text-sm font-semibold transition-all border ${
        activeTab === tab
          ? "bg-brand-ink border-brand-ink text-white"
          : "bg-white border-brand-line text-brand-muted hover:text-brand-ink hover:border-brand-ink"
      }`}
    >
      <span className="flex items-center gap-3">
        {icon} {label}
      </span>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-0.5 rounded bg-brand-ink text-white text-xs font-mono">{badge}</span>
      )}
    </button>
  );

  return (
    <div className="lg:col-span-1 space-y-3">
      {btn("overview", <Layout size={18} />, "Overview Desk")}
      {btn("projects", <PlusCircle size={18} />, "Manage Projects")}
      {btn("blogs", <FileText size={18} />, "Manage Blogs")}
      {btn("services", <Wrench size={18} />, "Manage Services")}
      {btn("testimonials", <Quote size={18} />, "Manage Testimonials")}
      {btn("leads", <Mail size={18} />, "Inquiries Inbox", leadsCount)}
    </div>
  );
};
