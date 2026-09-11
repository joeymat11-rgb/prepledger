// build.mjs — the LOCAL-ERA browser bundle.
//
// buildBrowser() from ../build-browser.mjs is IMPORTED, not copied: this bundle
// is held to exactly the same esbuild configuration, Node-import allowlist,
// authority exclusion, cipher pins and typography pins as the existing one, and
// nothing in build-browser.mjs changes — so its own output bytes cannot move.
//
// The default output sits under the already-gitignored .tmp/ tree, beside where
// the existing bundle is written; pass `outfile` for anywhere else.
import { buildBrowser } from "../build-browser.mjs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const normalize = path => resolve(path).replaceAll("\\", "/");
export const LOCAL_ENTRY = resolve(here, "browser-entry.mjs");
export const LOCAL_OUTFILE = resolve(here, "../.tmp/local/local.js");

export function buildLocalBrowser({ outfile = LOCAL_OUTFILE } = {}) {
  return buildBrowser({ outfile, entryPoints: [LOCAL_ENTRY] });
}

if (process.argv[1] && normalize(process.argv[1]) === normalize(fileURLToPath(import.meta.url))) {
  const result = await buildLocalBrowser();
  console.log(`W6 LOCAL BROWSER BUILD PASS — ${result.inventory.length} pinned local inputs; ${normalize(result.outfile)}`);
}
