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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-brand-line p-6 rounded-2xl mb-8 gap-4">
      <div>
        <span className="text-brand-muted font-mono text-xs uppercase tracking-widest">
          [SECURE_SHELL.LOGGED_IN]
        </span>
        <h1 className="text-2xl font-bold font-display text-brand-ink mt-1">
          Backend Systems Portal
        </h1>
        <p className="text-brand-muted text-xs mt-1">
          Connected account: {email}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="px-4 py-2 border border-brand-line bg-white text-brand-muted rounded-lg hover:text-brand-ink hover:border-brand-ink transition-colors flex items-center gap-2 text-sm font-semibold"
        >
          Back to Home
        </Link>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 border border-brand-line bg-white text-brand-muted rounded-lg hover:text-brand-ink hover:border-brand-ink transition-colors flex items-center gap-2 text-sm"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
};
