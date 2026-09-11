// static-modules.mjs — the origin the W6 browser harnesses load from.
//
// THE DEFECT THIS FIXES (DECISIONS:98, "retained Chromium harness fails to
// fetch repository.mjs — Track C/host follow-on").
//
// browser-check.mjs served exactly two paths: "/" and "/repository.mjs", and
// answered everything else with a bare 404. That was complete when
// repository.mjs was a single self-contained module. It no longer is — since the
// K1 recovery work it opens with
//     import { createRecoveryStage } from './recovery-stage.mjs';
//     import { createImportCustody } from './import-custody.mjs';
// so the page's `await import("/repository.mjs")` makes the browser fetch two
// more modules, both of which the harness 404s. ES module resolution fails as a
// whole, and what the operator sees is "cannot fetch repository.mjs" — which
// points at the wrong file. Nothing is wrong with repository.mjs, the allowlist
// in the harness was simply one commit behind its own dependency graph.
//
// The fix is to serve the DIRECTORY the module lives in rather than a hand-kept
// list of filenames, so a new relative import can never silently break the
// harness again. Two rules keep that safe:
//   * containment — the REAL path, after symlinks are resolved, must stay inside
//     `root`, so no "..", absolute path or symlink escape reaches anything else
//     on the machine. This is what keeps `node_modules` out: it is a junction
//     whose realpath resolves outside the W6 directory, so it 404s; and
//   * an extension allowlist — only module and asset types are served, so an
//     extensionless file, a dotfile, a key file or a `.pem`/`.log` under the
//     same tree cannot be fetched.
// Both are properties of this file; no caller can widen them.
//
// C1b review F4. Be exact about what the extension allowlist is NOT: `.json` IS
// served, because a module graph and a build metafile need it. So the allowlist
// is not a defence against a JSON file that holds something private — CONTAINMENT
// is, and `root` is the W6 directory, which holds no athlete data and is nowhere
// near `ledger/`. Point this at a tree that does hold data and the extension
// list will not save you; the earlier wording here claimed it would.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const TYPES = Object.freeze({ ".mjs": "text/javascript", ".cjs": "text/javascript", ".js": "text/javascript",
  ".map": "application/json", ".json": "application/json", ".html": "text/html",
  ".css": "text/css", ".woff2": "font/woff2", ".txt": "text/plain" });
const DEFAULT_INDEX = "<!doctype html><meta charset=\"utf-8\"><title>W6 harness</title><main id=\"root\"></main>";

function send(response, name, body) {
  response.writeHead(200, { "Content-Type": TYPES[path.extname(name)] || "application/octet-stream",
    "Cache-Control": "no-store" });
  response.end(body);
}

// `files` are served before the tree, so a harness can inject a built bundle
// that does not live under `root` (e.g. one written into .tmp).
export async function startModuleServer({ root, files = {}, index = DEFAULT_INDEX } = {}) {
  const base = path.resolve(root), realBase = fs.realpathSync(base);
  const server = http.createServer((request, response) => {
    let name;
    try { name = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname); }
    catch { response.writeHead(400); response.end(); return; }
    if (name === "/" || name === "/index.html") { send(response, "/index.html", index); return; }
    if (Object.hasOwn(files, name)) { send(response, name, files[name]); return; }
    if (!Object.hasOwn(TYPES, path.extname(name))) { response.writeHead(404); response.end(); return; }
    let body;
    try {
      // Containment is asserted on the REAL path, after symlinks are resolved:
      // a lexical check alone would follow a link out of the tree.
      const real = fs.realpathSync(path.resolve(base, "." + name));
      if (real !== realBase && !real.startsWith(realBase + path.sep)) { response.writeHead(404); response.end(); return; }
      body = fs.readFileSync(real);
    } catch { response.writeHead(404); response.end(); return; }
    send(response, name, body);
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  return { server, origin: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise(resolve => server.close(resolve)) };
}
