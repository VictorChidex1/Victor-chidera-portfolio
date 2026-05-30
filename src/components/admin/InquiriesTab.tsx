import React from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

interface InquiriesTabProps {
  leadsList: any[];
  fetchAllData: () => Promise<void>;
}

export const InquiriesTab: React.FC<InquiriesTabProps> = ({ leadsList, fetchAllData }) => {
  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteDoc(doc(db, "contacts", leadId));
        await fetchAllData();
      } catch (err) {
        console.error("Failed to delete inquiry:", err);
      }
    }
  };

  return (
    <motion.div
      key="leads"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
    >
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6">
          Inquiries Inbox ({leadsList.length})
        </h3>

        {leadsList.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No contact submissions found in database.</p>
        ) : (
          <div className="space-y-6">
            {leadsList.map((lead) => (
              <div
                key={lead.id}
                className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-xl relative hover:border-slate-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-bold text-white text-sm">{lead.name}</h5>
                    <p className="text-brand-orange text-xs mt-0.5">{lead.email}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    className="w-8 h-8 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    title="Delete Message"
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
  );
};
