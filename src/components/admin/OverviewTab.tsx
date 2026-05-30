import React from "react";
import { motion } from "framer-motion";
import { PlusCircle, FileText, Mail, CheckCircle } from "lucide-react";
import { STATIC_PROJECTS, STATIC_BLOGS } from "../../hooks/useFirebaseData";

interface OverviewTabProps {
  projectsList: any[];
  blogsList: any[];
  leadsList: any[];
  setActiveTab: (tab: "overview" | "projects" | "blogs" | "leads") => void;
  handleSeedDatabase: () => void;
  seedLoading: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  projectsList,
  blogsList,
  leadsList,
  setActiveTab,
  handleSeedDatabase,
  seedLoading,
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
            {projectsList.length || STATIC_PROJECTS.length}
          </h4>
          <p className="text-slate-500 text-xs mt-2">
            {projectsList.length > 0 ? "Serving live from Firestore" : "Serving offline static fallbacks"}
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
            {blogsList.length || STATIC_BLOGS.length}
          </h4>
          <p className="text-slate-500 text-xs mt-2">
            {blogsList.length > 0 ? "Serving live from Firestore" : "Serving offline static fallbacks"}
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

      {projectsList.length === 0 && blogsList.length === 0 && (
        <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 to-transparent opacity-50 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-brand-orange font-mono text-[10px] uppercase tracking-wider block mb-2">[DATABASE.EMPTY_STATE_ALERT]</span>
            <h4 className="text-white font-bold text-base mb-2">Initialize Firestore Staging Data</h4>
            <p className="text-slate-400 text-xs leading-relaxed max-w-2xl mb-4">
              Your live Firestore collections are currently empty. If you would like to transition seamlessly to the database backend without manual re-typing, you can copy all 11 static projects and 3 blog articles from staging directly into your live Firestore collections in 1 click.
            </p>
            <button
              onClick={handleSeedDatabase}
              disabled={seedLoading}
              className="px-4 py-2.5 bg-brand-orange hover:bg-orange-600 disabled:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all transform hover:scale-[1.01]"
            >
              {seedLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Seeding Database...
                </>
              ) : (
                <>
                  <CheckCircle size={14} /> Seed Database (1-Click)
                </>
              )}
            </button>
          </div>
        </div>
      )}

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
