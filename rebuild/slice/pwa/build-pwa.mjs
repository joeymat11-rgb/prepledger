// Build the deployable Earned slice folder: A1's Today page, made installable.
//
// It CONSUMES rebuild/m3/w7-preview/today/build.mjs — it does not re-implement it and does
// not change it. A1 still emits its own three assets into its own folder and its 58 tests
// still describe that folder; this step reads those three files and writes a SECOND,
// separate folder that adds a manifest, a launch service worker, icons, the preflight and
// the response headers.
//
// Nothing private is ever in the output: the guard in pwa.cjs is executed on the staged
// bytes before a single file is written, and it refuses on a private source path, on a
// shipped byte that names a private artefact, and on anything shaped like a credential.
//
//   node rebuild/slice/pwa/build-pwa.mjs
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { buildToday, DIST as A1_DIST, ROOT } from "../../m3/w7-preview/today/build.mjs";

const require = createRequire(import.meta.url);
const pwa = require("./pwa.cjs");
const shell = require("./shell.cjs");
const icons = require("./icons.cjs");

export const SOURCE = path.dirname(fileURLToPath(import.meta.url));
export const DIST = path.join(ROOT, ".tmp/slice-pwa-dist");
export { ROOT };

async function realDirectory(directory) {
  await fs.mkdir(directory, { recursive: true });
  const stat = await fs.lstat(directory);
  assert(stat.isDirectory() && !stat.isSymbolicLink(), "OUTPUT-DIRECTORY FAIL: a real directory is required");
  const root = await fs.realpath(ROOT);
  assert.equal(await fs.realpath(directory), path.join(root, path.relative(ROOT, directory)),
    "OUTPUT-DIRECTORY FAIL: path escaped workspace");
  return directory;
}

/* The whole folder, as bytes, with nothing written yet. Separated from the writing so the
   tests can build the folder in memory, plant something in it, and watch the guard fire
   without ever touching a disk. */
export async function composeSite({ a1 } = {}) {
  const colours = pwa.assertApprovedColours(ROOT);
  const today = a1 || await buildToday();
  const sources = {};
  const read = async (name) => {
    sources[name] = path.relative(ROOT, path.join(today.dist, name)).replace(/\\/g, "/");
    return fs.readFile(path.join(today.dist, name));
  };
  const indexSource = await read("index.html");
  const styles = await read("styles.css");
  const app = await read("app.js");

  const names = {
    index: "index.html",
    styles: pwa.hashedName("styles.css", styles),
    app: pwa.hashedName("app.js", app),
    preflightCss: pwa.hashedName("preflight.css", Buffer.from(shell.preflightCss())),
    preflightJs: pwa.hashedName("preflight.js", Buffer.from(shell.preflightJs())),
  };

  const files = new Map();
  files.set(names.styles, styles);
  files.set(names.app, app);
  files.set(names.preflightCss, Buffer.from(shell.preflightCss()));
  files.set(names.preflightJs, Buffer.from(shell.preflightJs()));
  files.set("index.html", Buffer.from(shell.installableHtml(indexSource.toString("utf8"), names)));
  files.set(pwa.MANIFEST_FILE, Buffer.from(pwa.webManifest()));
  for (const icon of pwa.ICON_FILES) files.set(icon.name, icons.png(icon.size, { purpose: icon.purpose }));
  files.set(pwa.ICON_SVG, Buffer.from(icons.svg()));

  // THE PRECACHE MANIFEST: every file the launch needs, each pinned by its own sha256.
  // The worker itself is not in it (it is never stored), and neither is _headers (which
  // Netlify reads as configuration and never serves).
  const precache = [...files.keys()].sort()
    .map((name) => ({ path: name, sha256: pwa.sha256(files.get(name)) }));
  const cache = pwa.cacheName(precache);
  files.set(pwa.SERVICE_WORKER, Buffer.from(shell.serviceWorker(precache, cache)));

  const served = [...files.keys()];
  const rules = shell.headerRules(names);
  shell.assertHeaderRules(rules, served);
  const headers = shell.headersFile(rules);

  const entries = [...files.entries()];
  shell.assertNoNetworkReference(entries);
  const guard = pwa.assertNothingPrivate([...entries, [pwa.HEADERS_FILE, headers]], sources);

  files.set(pwa.HEADERS_FILE, Buffer.from(headers));
  return { files, names, precache, cache, rules, guard, colours, today, sources };
}

export async function buildSite() {
  const site = await composeSite();
  await realDirectory(path.join(ROOT, ".tmp"));
  await realDirectory(DIST);
  const keep = new Set(site.files.keys());
  for (const entry of await fs.readdir(DIST, { withFileTypes: true })) {
    assert(entry.isFile() && !entry.isSymbolicLink(), "OUTPUT-CLEAN FAIL: unexpected directory or link");
    if (!keep.has(entry.name)) await fs.unlink(path.join(DIST, entry.name));
  }
  for (const [name, bytes] of site.files) await fs.writeFile(path.join(DIST, name), bytes);
  assert.deepEqual((await fs.readdir(DIST)).sort(), [...keep].sort(), "PACKAGE-ALLOWLIST FAIL");
  return { ...site, dist: DIST,
    sha256: Object.fromEntries([...site.files].map(([n, b]) => [n, pwa.sha256(b)])) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const site = await buildSite();
    for (const [name, hash] of Object.entries(site.sha256)) console.log(`  ${hash}  ${name}`);
    console.log(`A5 PWA BUILD PASS: ${site.files.size} files in ${path.relative(ROOT, site.dist)}; `
      + `${site.precache.length} precached and pinned by sha256; cache name ${site.cache} `
      + `derived from those bytes (no version constant); ${site.rules.length} exact header rules, `
      + `no-store on ${pwa.SERVICE_WORKER}; ${site.guard.shapes} credential shapes and `
      + `${site.guard.roots} private roots refused across ${site.guard.files} files; `
      + `theme ${site.colours.theme} / background ${site.colours.background} read back from the approved design; `
      + `no network reference in any shipped byte`);
  } catch (error) {
    console.error(`A5 PWA BUILD FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}
