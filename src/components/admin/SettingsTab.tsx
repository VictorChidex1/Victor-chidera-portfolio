import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Check, User, RefreshCw, Sparkles } from "lucide-react";
import { doc, setDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import ImageUploadField from "./ImageUploadField";

interface SettingsTabProps {
  settings: any;
  blogsList: any[];
  fetchAllData: () => Promise<void>;
}

const inputClass =
  "w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink";
const labelClass = "block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2";

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  blogsList,
  fetchAllData,
}) => {
  const [name, setName] = useState(settings?.name || "");
  const [editorialTitle, setEditorialTitle] = useState(settings?.editorialTitle || "");
  const [avatar, setAvatar] = useState(settings?.avatar || "");
  const [avatarPath, setAvatarPath] = useState(settings?.avatarPath || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [backfilled, setBackfilled] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Sync form whenever settings are (re)loaded.
  useEffect(() => {
    setName(settings?.name || "");
    setEditorialTitle(settings?.editorialTitle || "");
    setAvatar(settings?.avatar || "");
    setAvatarPath(settings?.avatarPath || "");
  }, [settings]);

  const dirty =
    name !== (settings?.name || "") ||
    editorialTitle !== (settings?.editorialTitle || "") ||
    avatar !== (settings?.avatar || "") ||
    avatarPath !== (settings?.avatarPath || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    if (!name.trim()) {
      setError("Display name is required.");
      return;
    }

    setSaving(true);
    try {
      await setDoc(
        doc(db, "settings", "site"),
        {
          name: name.trim(),
          editorialTitle: editorialTitle.trim(),
          avatar: avatar || "",
          avatarPath: avatarPath || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Backfill the author onto any existing posts that don't carry one yet.
      const batch = writeBatch(db);
      let count = 0;
      for (const b of blogsList) {
        if (!b.author) {
          batch.update(doc(db, "blogs", b.id), { author: name.trim() });
          count += 1;
        }
      }
      if (count > 0) {
        await batch.commit();
      }

      setBackfilled(count);
      setSaved(true);
      await fetchAllData();
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const bylineInitial = (name.trim() || "V").charAt(0).toUpperCase();

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="bg-white border border-brand-line p-6 rounded-2xl">
        <span className="text-brand-muted font-mono text-xs uppercase tracking-widest">
          [CONFIG.AUTHOR_PROFILE]
        </span>
        <h3 className="text-lg font-bold font-display text-brand-ink mt-1 flex items-center gap-2">
          <User size={18} /> Site Settings
        </h3>
        <p className="text-brand-muted text-xs mt-2">
          Your author identity — name, editorial title, and avatar — is stamped onto every
          blog post byline and feeds the site-wide structured data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Editor form ─────────────────────────────────────────────── */}
        <div className="bg-white border border-brand-line p-6 rounded-2xl">
          <h4 className="text-sm font-bold font-display text-brand-ink mb-5 uppercase tracking-wider">
            Author Identity
          </h4>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-5">
              <div className="shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name || "Avatar"}
                    className="w-20 h-20 rounded-full object-cover border border-brand-line bg-brand-surface"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = "0.3";
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-brand-ink text-white flex items-center justify-center font-display text-2xl font-bold">
                    {bylineInitial}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <ImageUploadField
                  label="Avatar Photo"
                  value={avatar}
                  valuePath={avatarPath || undefined}
                  storageFolder="settings"
                  onChange={(url, path) => {
                    setAvatar(url);
                    setAvatarPath(path || "");
                  }}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Victor Chidera"
              />
              <p className="text-brand-muted text-[10px] mt-1">
                Shown on every blog post and card as the author.
              </p>
            </div>

            <div>
              <label className={labelClass}>Editorial Title</label>
              <input
                type="text"
                value={editorialTitle}
                onChange={(e) => setEditorialTitle(e.target.value)}
                className={inputClass}
                placeholder="Full Stack Developer"
              />
              <p className="text-brand-muted text-[10px] mt-1">
                The role shown beside your name in the byline.
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-semibold">{error}</p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving || !dirty}
                className="px-5 py-3 font-semibold rounded-lg bg-brand-ink hover:bg-neutral-800 text-white transition-all text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Settings
                  </>
                )}
              </button>

              {saved && (
                <span className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
                  <Check size={14} /> Saved
                  {backfilled !== null && backfilled > 0
                    ? ` · backfilled author on ${backfilled} post${backfilled === 1 ? "" : "s"}`
                    : ""}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* ── Live preview ────────────────────────────────────────────── */}
        <div className="space-y-8">
          <div className="bg-white border border-brand-line p-6 rounded-2xl">
            <h4 className="text-sm font-bold font-display text-brand-ink mb-4 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={15} /> Live Byline Preview
            </h4>

            <div className="border border-brand-line rounded-xl overflow-hidden">
              <div className="h-28 bg-brand-surface border-b border-brand-line" />
              <div className="p-5">
                <div className="flex items-center gap-2 text-brand-accent font-mono text-[10px] uppercase tracking-widest font-bold mb-3">
                  <span>Sep 12, 2026</span>
                  <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                  <span>5 min read</span>
                </div>
                <p className="text-lg font-bold font-display text-brand-ink leading-snug mb-4">
                  A sample article heading that carries your byline.
                </p>

                <div className="flex items-center gap-3">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border border-brand-line"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = "0.3";
                      }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-brand-ink text-white flex items-center justify-center font-display text-sm font-bold">
                      {bylineInitial}
                    </div>
                  )}
                  <div className="text-xs leading-tight">
                    <p className="font-bold text-brand-ink">
                      {name.trim() || "Your Name"}
                    </p>
                    <p className="text-brand-muted">
                      {editorialTitle.trim() || "Your Editorial Title"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-surface border border-brand-line p-6 rounded-2xl">
            <h4 className="text-xs font-bold font-display text-brand-ink uppercase tracking-wider mb-3">
              What this controls
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li className="flex gap-2">
                <span className="text-brand-accent">•</span> Author byline on every blog post
                and blog card.
              </li>
              <li className="flex gap-2">
                <span className="text-brand-accent">•</span> <code className="font-mono">article:author</code>{" "}
                meta + JSON-LD Person/author on articles and the homepage.
              </li>
              <li className="flex gap-2">
                <span className="text-brand-accent">•</span> Avatar is uploaded to Storage and
                converted to WebP automatically.
              </li>
              <li className="flex gap-2">
                <span className="text-brand-accent">•</span> Saving backfills{" "}
                <code className="font-mono">author</code> onto posts that don't have one yet.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;