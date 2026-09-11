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
// C1b. The same build, over the entry that adds the host composition to the
// local era. build-browser.mjs is still untouched, so this bundle is held to
// the same Node-import allowlist, authority exclusion and cipher/typography
// pins as every other one.
export const LOCAL_HOST_ENTRY = resolve(here, "host-browser-entry.mjs");
export const LOCAL_HOST_OUTFILE = resolve(here, "../.tmp/local-host/host.js");

// C4. The same build again, over the entry that adds the ONE STORE drop-in and
// the page's own adapters. Additive: neither build-browser.mjs nor either
// existing entry changes, so their output bytes cannot move.
export const TODAY_ENTRY = resolve(here, "today-browser-entry.mjs");
export const TODAY_OUTFILE = resolve(here, "../.tmp/local-today/today.js");
export function buildTodayBrowser({ outfile = TODAY_OUTFILE } = {}) {
  return buildBrowser({ outfile, entryPoints: [TODAY_ENTRY] });
}

export function buildLocalBrowser({ outfile = LOCAL_OUTFILE } = {}) {
  return buildBrowser({ outfile, entryPoints: [LOCAL_ENTRY] });
}
export function buildLocalHostBrowser({ outfile = LOCAL_HOST_OUTFILE } = {}) {
  return buildBrowser({ outfile, entryPoints: [LOCAL_HOST_ENTRY] });
}

if (process.argv[1] && normalize(process.argv[1]) === normalize(fileURLToPath(import.meta.url))) {
  const result = await buildLocalBrowser();
  console.log(`W6 LOCAL BROWSER BUILD PASS — ${result.inventory.length} pinned local inputs; ${normalize(result.outfile)}`);
  const host = await buildLocalHostBrowser();
  console.log(`W6 LOCAL-HOST BROWSER BUILD PASS — ${host.inventory.length} pinned local inputs; ${normalize(host.outfile)}`);
}
