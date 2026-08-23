import React from "react";
import { motion } from "framer-motion";
import { PlusCircle, FileText, Mail, CheckCircle } from "lucide-react";

interface OverviewTabProps {
  projectsList: any[];
  blogsList: any[];
  leadsList: any[];
  setActiveTab: (tab: "overview" | "projects" | "blogs" | "leads") => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  projectsList,
  blogsList,
  leadsList,
  setActiveTab,
}) => {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Box 1 */}
        <div
          onClick={() => setActiveTab("projects")}
          className="bg-white border border-brand-line p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-brand-ink transform hover:scale-[1.01] transition-all"
        >
          <div className="absolute right-4 top-4 text-brand-ink/10 group-hover:text-brand-ink/20 transition-colors">
            <PlusCircle size={54} />
          </div>
          <span className="text-brand-muted text-xs font-mono uppercase">[DATABASE.PROJECTS]</span>
          <h4 className="text-3xl font-bold text-brand-ink mt-4 font-mono">
            {projectsList.length}
          </h4>
          <p className="text-brand-muted text-xs mt-2">
            Projects fetched from Firestore
          </p>
        </div>

        {/* Stats Box 2 */}
        <div
          onClick={() => setActiveTab("blogs")}
          className="bg-white border border-brand-line p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-brand-ink transform hover:scale-[1.01] transition-all"
        >
          <div className="absolute right-4 top-4 text-brand-ink/10 group-hover:text-brand-ink/20 transition-colors">
            <FileText size={54} />
          </div>
          <span className="text-brand-muted text-xs font-mono uppercase">[DATABASE.BLOGS]</span>
          <h4 className="text-3xl font-bold text-brand-ink mt-4 font-mono">
            {blogsList.length}
          </h4>
          <p className="text-brand-muted text-xs mt-2">
            Blogs fetched from Firestore
          </p>
        </div>

        {/* Stats Box 3 */}
        <div
          onClick={() => setActiveTab("leads")}
          className="bg-white border border-brand-line p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-brand-ink transform hover:scale-[1.01] transition-all"
        >
          <div className="absolute right-4 top-4 text-brand-ink/10 group-hover:text-brand-ink/20 transition-colors">
            <Mail size={54} />
          </div>
          <span className="text-brand-muted text-xs font-mono uppercase">[LEADS.CONTACT_FORM]</span>
          <h4 className="text-3xl font-bold text-brand-ink mt-4 font-mono">
            {leadsList.length}
          </h4>
          <p className="text-brand-muted text-xs mt-2">
            Total contact responses recorded
          </p>
        </div>
      </div>

      <div className="bg-white border border-brand-line rounded-2xl p-6">
        <h3 className="text-lg font-bold font-display text-brand-ink mb-4">
          Systems Health & Database Configuration
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-brand-surface rounded-xl border border-brand-line text-xs">
            <span className="text-brand-muted">Environment Credentials</span>
            <span className="text-green-600 flex items-center gap-1.5 font-semibold">
              <CheckCircle size={14} /> ACTIVE (Vite Env Hooks Connected)
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-brand-surface rounded-xl border border-brand-line text-xs">
            <span className="text-brand-muted">Firestore Sync Status</span>
            <span className="text-brand-ink flex items-center gap-1.5 font-semibold">
              <CheckCircle size={14} /> ONLINE & DYNAMIC
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
