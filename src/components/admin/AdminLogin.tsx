import React from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface AdminLoginProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loginError: string;
  loginLoading: boolean;
  handleLogin: (e: React.FormEvent) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  loginError,
  loginLoading,
  handleLogin,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden"
      >
        {/* Glow Effect */}
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-xl flex items-center justify-center text-brand-orange mb-4">
            <Lock size={22} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Security Clearance
          </h2>
          <p className="text-slate-500 text-xs mt-1 uppercase font-mono tracking-wider">
            [VICTOR_ATELIER.CORE_ROOT]
          </p>
        </div>

        {loginError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg mb-6 leading-relaxed">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Admin Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange transition-colors"
              placeholder="admin@portfolio.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Security Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full font-bold py-3.5 rounded-lg bg-brand-orange hover:bg-orange-600 text-white transition-all transform hover:scale-[1.01] flex items-center justify-center"
          >
            {loginLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Authorize Connection"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
