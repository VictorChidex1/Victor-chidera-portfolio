// Copies the frontend's content JSON (src/data) into the functions package
// (functions/src/data) so the interceptor renders the same content it serves.
// Run automatically via `functions` prebuild, or manually: node scripts/sync-content.mjs
import { cpSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "src", "data");
const dest = join(root, "functions", "src", "data");

if (!existsSync(src)) {
  // The functions package can be built without the frontend tree (e.g. in a
  // container that only ships `functions/`). In that case the already-synced
  // JSON in functions/src/data is authoritative — skip rather than fail.
  console.warn("[sync-content] src/data not found — skipping sync (using committed functions/src/data).");
  process.exit(0);
}

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });

const files = readdirSync(dest).filter((f) => f.endsWith(".json"));
console.log(`[sync-content] ${files.length} files → functions/src/data`);
