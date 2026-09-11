// Copies the frontend's shared sources into the functions package so the
// interceptor builds against the same content + schema code the site uses.
//   src/data/*.json  -> functions/src/data/
//   shared/*.ts      -> functions/src/shared/
// Runs automatically via the functions prebuild, or manually:
//   node scripts/sync-content.mjs
import { cpSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dataSrc = join(root, "src", "data");
const dataDest = join(root, "functions", "src", "data");
const sharedSrc = join(root, "shared");
const sharedDest = join(root, "functions", "src", "shared");

if (!existsSync(dataSrc)) {
  // The functions package can be built without the frontend tree (e.g. in a
  // container that only ships `functions/`). In that case the already-synced
  // copies in functions/src are authoritative — skip rather than fail.
  console.warn(
    "[sync-content] src/data not found — skipping sync (using committed functions/src copies)."
  );
  process.exit(0);
}

mkdirSync(dataDest, { recursive: true });
cpSync(dataSrc, dataDest, { recursive: true });

if (existsSync(sharedSrc)) {
  mkdirSync(sharedDest, { recursive: true });
  cpSync(sharedSrc, sharedDest, { recursive: true });
}

const files = readdirSync(dataDest).filter((f) => f.endsWith(".json"));
console.log(
  `[sync-content] ${files.length} data files + shared/ → functions/src`
);
