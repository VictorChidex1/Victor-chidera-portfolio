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
          className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-lg group cursor-pointer hover:border-brand-orange/30 transform hover:scale-[1.01] transition-all"
        >
          <div className="absolute right-4 top-4 text-brand-orange/10 group-hover:text-brand-orange/20 transition-colors">
            <PlusCircle size={54} />
          </div>
          <span className="text-slate-400 text-xs font-mono uppercase">[DATABASE.PROJECTS]</span>
          <h4 className="text-3xl font-bold text-white mt-4 font-mono">
            {projectsList.length}
          </h4>
          <p className="text-slate-500 text-xs mt-2">
            Projects fetched from Firestore
          </p>
        </div>

        {/* Stats Box 2 */}
        <div
          onClick={() => setActiveTab("blogs")}
          className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-lg group cursor-pointer hover:border-brand-orange/30 transform hover:scale-[1.01] transition-all"
        >
          <div className="absolute right-4 top-4 text-brand-orange/10 group-hover:text-brand-orange/20 transition-colors">
            <FileText size={54} />
          </div>
          <span className="text-slate-400 text-xs font-mono uppercase">[DATABASE.BLOGS]</span>
          <h4 className="text-3xl font-bold text-white mt-4 font-mono">
            {blogsList.length}
          </h4>
          <p className="text-slate-500 text-xs mt-2">
            Blogs fetched from Firestore
          </p>
        </div>

        {/* Stats Box 3 */}
        <div
          onClick={() => setActiveTab("leads")}
          className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-lg group cursor-pointer hover:border-brand-orange/30 transform hover:scale-[1.01] transition-all"
        >
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
  );
};
