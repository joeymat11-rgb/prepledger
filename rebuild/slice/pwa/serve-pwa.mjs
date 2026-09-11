// Serve the built deployable folder from 127.0.0.1, with the SAME response headers the
// host will send — by PARSING the emitted _headers file rather than restating it, so what
// the browser check exercises is what Netlify will apply.
//
// 127.0.0.1 is a secure context, so a service worker registers here exactly as it does on
// https. The server reads only the build folder, answers only GET/HEAD, and never writes.
//
//   node rebuild/slice/pwa/build-pwa.mjs
//   node rebuild/slice/pwa/serve-pwa.mjs [--port 4179]
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DIST, ROOT } from "./build-pwa.mjs";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

export function parseHeaders(text) {
  const rules = new Map();
  let current = null;
  for (const raw of text.split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith("#")) { continue; }
    if (!/^\s/.test(raw)) {
      assert(raw.startsWith("/"), `HEADERS PARSE FAIL: ${raw}`);
      current = raw.trim();
      assert(!rules.has(current), `HEADERS PARSE FAIL: duplicate rule ${current}`);
      rules.set(current, {});
      continue;
    }
    assert(current, `HEADERS PARSE FAIL: a header before any path: ${raw}`);
    const at = raw.indexOf(":");
    assert(at > 0, `HEADERS PARSE FAIL: ${raw}`);
    rules.get(current)[raw.slice(0, at).trim()] = raw.slice(at + 1).trim();
  }
  return rules;
}

export async function startServer({ port = 4179, dist = DIST } = {}) {
  assert(Number.isInteger(port) && port >= 0 && port <= 65535, "Invalid local port");
  const root = await fs.realpath(ROOT);
  assert.equal(await fs.realpath(dist), path.join(root, path.relative(ROOT, dist)),
    "Build directory escaped workspace");
  const rules = parseHeaders(await fs.readFile(path.join(dist, "_headers"), "utf8"));
  const files = new Map();
  for (const entry of await fs.readdir(dist, { withFileTypes: true })) {
    assert(entry.isFile() && !entry.isSymbolicLink(), "Build assets must be real files");
    if (entry.name === "_headers") continue;   // configuration, never served
    files.set("/" + entry.name, await fs.readFile(path.join(dist, entry.name)));
  }
  files.set("/", files.get("/index.html"));

  const server = http.createServer((request, response) => {
    const send = (status, bytes, type = "text/plain; charset=utf-8", extra = {}) => {
      const body = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
      response.writeHead(status, { ...extra, "Content-Type": type, "Content-Length": body.length });
      response.end(request.method === "HEAD" ? undefined : body);
    };
    if (!["GET", "HEAD"].includes(request.method)) return send(405, "Method not allowed", undefined, { Allow: "GET, HEAD" });
    const target = request.url || "/";
    let pathname;
    try {
      assert(target.startsWith("/") && !target.startsWith("//"));
      pathname = decodeURIComponent(target.split("?")[0]);
      assert(!/[\\#]/.test(pathname) && !/[\u0000-\u001f]/.test(pathname));
      assert(!pathname.split("/").some((part) => part === "." || part === ".."));
    } catch {
      return send(400, "Invalid request path");
    }
    const bytes = files.get(pathname);
    if (!bytes) return send(404, "Not found");
    const extension = pathname === "/" ? ".html" : path.extname(pathname);
    return send(200, bytes, TYPES[extension] || "application/octet-stream", rules.get(pathname) || {});
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    assert(args.length === 0 || (args.length === 2 && args[0] === "--port"), "Use --port NUMBER or no arguments");
    const server = await startServer({ port: args.length ? Number(args[1]) : 4179 });
    console.log(`A5 SLICE HOST at http://127.0.0.1:${server.address().port}/ — the deployable folder, `
      + `with the host's own response headers. Synthetic athlete; no account and no network.`);
  } catch (error) {
    console.error(`A5 SLICE HOST FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}
