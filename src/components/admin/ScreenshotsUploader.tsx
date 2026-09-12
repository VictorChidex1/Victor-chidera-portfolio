import { useRef, useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Plus, X, Loader2, ImageIcon } from "lucide-react";
import { storage } from "../../firebase";
import { compressToWebp, ALLOWED_TYPES, MAX_INPUT_BYTES } from "../../lib/image";

export interface Screenshot {
  url: string;
  path: string;
  alt: string;
}

interface ScreenshotsUploaderProps {
  value: Screenshot[];
  onChange: (screenshots: Screenshot[]) => void;
}

// Multi-image gallery uploader. Uploads to the flat `projects/` folder
// (covered by the existing storage rule); alt text is editable per image.
const ScreenshotsUploader = ({ value, onChange }: ScreenshotsUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");

    const batch = Array.from(files);
    setUploading(true);
    try {
      const uploaded: Screenshot[] = [];
      for (const file of batch) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          setError("Skipped non-image file: " + file.name);
          continue;
        }
        if (file.size > MAX_INPUT_BYTES) {
          setError("Skipped oversized file: " + file.name);
          continue;
        }
        const isGif = file.type === "image/gif";
        const blob = isGif ? file : await compressToWebp(file);
        const ext = isGif ? "gif" : "webp";
        const contentType = isGif ? "image/gif" : "image/webp";
        const objectPath = `projects/shot-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`;
        const storageRef = ref(storage, objectPath);
        await uploadBytesResumable(storageRef, blob, { contentType });
        const url = await getDownloadURL(storageRef);
        uploaded.push({ url, path: objectPath, alt: "" });
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      console.error("Screenshot upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const updateAlt = (index: number, alt: string) => {
    const next = [...value];
    next[index] = { ...next[index], alt };
    onChange(next);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index: number) => {
    const item = value[index];
    if (item.path) deleteObject(ref(storage, item.path)).catch(() => {});
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {value.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 py-8 border border-dashed border-brand-line rounded-xl bg-brand-surface text-brand-muted hover:text-brand-ink transition-colors disabled:opacity-50"
        >
          <ImageIcon size={26} />
          <span className="text-xs font-medium">Add screenshots</span>
          <span className="text-[10px] text-brand-muted/70">
            JPG, PNG, WebP, AVIF or GIF · up to 10MB each
          </span>
        </button>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((shot, i) => (
            <div key={shot.path + i} className="border border-brand-line rounded-xl overflow-hidden bg-white">
              <div className="relative aspect-video bg-brand-surface">
                <img src={shot.url} alt={shot.alt} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-md hover:bg-red-600"
                  title="Remove"
                >
                  <X size={13} />
                </button>
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="w-6 h-6 flex items-center justify-center bg-white/90 text-brand-ink rounded-md disabled:opacity-30" title="Move left">←</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="w-6 h-6 flex items-center justify-center bg-white/90 text-brand-ink rounded-md disabled:opacity-30" title="Move right">→</button>
                </div>
              </div>
              <div className="p-2">
                <input
                  type="text"
                  value={shot.alt}
                  onChange={(e) => updateAlt(i, e.target.value)}
                  placeholder="Alt text (for SEO)"
                  className="w-full text-xs bg-white border border-brand-line rounded-md px-2 py-1.5 text-brand-ink focus:outline-none focus:border-brand-ink"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-video border border-dashed border-brand-line rounded-xl flex flex-col items-center justify-center gap-1 text-brand-muted hover:text-brand-ink transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
            <span className="text-[11px] font-medium">{uploading ? "Uploading…" : "Add more"}</span>
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
    </div>
  );
};

export default ScreenshotsUploader;
