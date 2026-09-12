// Shared client-side image helpers (upload validation + WebP compression).

export const MAX_INPUT_BYTES = 10 * 1024 * 1024; // reject absurd files before decoding
export const MAX_DIMENSION = 1920;
export const WEBP_QUALITY = 0.85;
export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

// Downscale + re-encode to WebP in the browser so uploads stay small.
export async function compressToWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/webp", WEBP_QUALITY)
  );
  if (!blob) throw new Error("Compression failed");
  return blob;
}
