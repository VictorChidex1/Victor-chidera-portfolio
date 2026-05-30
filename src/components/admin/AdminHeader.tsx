import React from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

interface AdminHeaderProps {
  email: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ email }) => {
  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 shadow-xl gap-4">
      <div>
        <span className="text-brand-orange font-mono text-xs uppercase tracking-widest">
          [SECURE_SHELL.LOGGED_IN]
        </span>
        <h1 className="text-2xl font-bold text-white mt-1">
          Backend Systems Portal
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Connected account: {email}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="px-4 py-2 border border-slate-800 bg-slate-950 text-slate-400 rounded-lg hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-2 text-sm font-semibold"
        >
          Back to Home
        </Link>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 border border-slate-800 bg-slate-950 text-slate-400 rounded-lg hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-2 text-sm"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
};
