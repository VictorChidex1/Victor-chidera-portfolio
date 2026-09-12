// Helpers for the CMS "Publish Date & Time" scheduler (datetime-local <-> Date).
// Values are stored in Firestore as UTC Timestamps; the picker shows local time.

interface TimestampLike {
  seconds: number;
}

/** Convert a Firestore Timestamp / Date into a local `YYYY-MM-DDTHH:mm` string for the datetime-local input. */
export function toDatetimeLocal(value: TimestampLike | Date | null | undefined): string {
  const d =
    value && typeof (value as TimestampLike).seconds === "number"
      ? new Date((value as TimestampLike).seconds * 1000)
      : value instanceof Date
        ? value
        : null;
  if (!d || Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Parse a `datetime-local` value into a Date (or null when empty/invalid). */
export function fromDatetimeLocal(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Format a Date as the display string used by blogs (e.g. "Nov 26, 2025"). */
export function formatDisplayDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}