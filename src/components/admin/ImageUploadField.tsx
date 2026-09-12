import { useRef, useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Upload, X, Link2, Loader2, ImageIcon } from "lucide-react";
import { storage } from "../../firebase";
import { compressToWebp, ALLOWED_TYPES, MAX_INPUT_BYTES } from "../../lib/image";

interface ImageUploadFieldProps {
  label: string;
  /** Current image URL (Storage download URL, legacy asset path, or external URL). */
  value: string;
  /** Storage object path of `value`, when it lives in Storage (for cleanup). */
  valuePath?: string;
  /** Storage folder, e.g. "projects" or "blog-covers". */
  storageFolder: string;
  onChange: (url: string, path?: string) => void;
}

const ImageUploadField = ({
  label,
  value,
  valuePath,
  storageFolder,
  onChange,
}: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const busy = progress !== null;

  const removeOldObject = (path?: string) => {
    if (path) deleteObject(ref(storage, path)).catch(() => {});
  };

  const handleFile = async (file: File) => {
    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG, WebP, AVIF, or GIF image.");
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError("Image must be under 10MB.");
      return;
    }

    try {
      setProgress(0);

      const isGif = file.type === "image/gif";
      const blob = isGif ? file : await compressToWebp(file);
      const ext = isGif ? "gif" : "webp";
      const contentType = isGif ? "image/gif" : "image/webp";
      const objectPath = `${storageFolder}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const storageRef = ref(storage, objectPath);
      const task = uploadBytesResumable(storageRef, blob, { contentType });

      task.on("state_changed", (snap) => {
        setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      });

      await task;
      const url = await getDownloadURL(storageRef);

      removeOldObject(valuePath);
      onChange(url, objectPath);
      setProgress(null);
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Upload failed. Please try again.");
      setProgress(null);
    }
  };

  const handleRemove = () => {
    removeOldObject(valuePath);
    onChange("", undefined);
    if (inputRef.current) inputRef.current.value = "";
  };

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    removeOldObject(valuePath);
    onChange(trimmed, undefined);
    setShowUrl(false);
    setUrlInput("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrl((s) => !s)}
          className="text-[11px] font-medium text-brand-muted hover:text-brand-ink flex items-center gap-1"
        >
          <Link2 size={12} /> {showUrl ? "Upload instead" : "Use URL"}
        </button>
      </div>

      {showUrl ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.webp"
            className="flex-1 bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink text-sm focus:outline-none focus:border-brand-ink"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="px-4 bg-brand-ink text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-all"
          >
            Set
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className="relative border border-dashed border-brand-line rounded-xl bg-brand-surface p-4"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {value ? (
            <div className="flex items-center gap-4">
              <img
                src={value}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-brand-line bg-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "0.3";
                }}
              />
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-brand-line rounded-lg text-xs font-semibold text-brand-ink hover:border-brand-ink transition-all disabled:opacity-50"
                >
                  <Upload size={14} /> Replace
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleRemove}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                >
                  <X size={14} /> Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 py-6 text-brand-muted hover:text-brand-ink transition-colors disabled:opacity-50"
            >
              <ImageIcon size={26} />
              <span className="text-xs font-medium">
                Click or drop an image to upload
              </span>
              <span className="text-[10px] text-brand-muted/70">
                JPG, PNG, WebP, AVIF or GIF · up to 10MB
              </span>
            </button>
          )}

          {busy && (
            <div className="absolute inset-0 bg-white/85 rounded-xl flex flex-col items-center justify-center gap-2">
              <Loader2 size={22} className="animate-spin text-brand-ink" />
              <span className="text-xs font-semibold text-brand-ink">
                Uploading… {progress}%
              </span>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
      )}
    </div>
  );
};

export default ImageUploadField;
