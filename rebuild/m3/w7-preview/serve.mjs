import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ASSETS, DIST, ROOT } from "./build.mjs";

export const CSP = "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; worker-src 'none'";
const TYPES = { "index.html": "text/html; charset=utf-8", "styles.css": "text/css; charset=utf-8", "app.js": "text/javascript; charset=utf-8" };

async function loadAssets() {
  const root = await fs.realpath(ROOT);
  for (const directory of [path.join(ROOT, ".tmp"), DIST]) {
    const stat = await fs.lstat(directory);
    assert(stat.isDirectory() && !stat.isSymbolicLink(), "Build directory must be a real directory");
    assert.equal(await fs.realpath(directory), path.join(root, path.relative(ROOT, directory)), "Build directory escaped workspace");
  }
  assert.deepEqual((await fs.readdir(DIST)).sort(), [...ASSETS].sort(), "Build contains unapproved assets; rebuild first");
  const assets = new Map();
  for (const name of ASSETS) {
    const filename = path.join(DIST, name);
    const stat = await fs.lstat(filename);
    assert(stat.isFile() && !stat.isSymbolicLink(), "Build assets must be real files");
    assets.set(`/${name}`, { bytes: await fs.readFile(filename), type: TYPES[name] });
  }
  assets.set("/", assets.get("/index.html"));
  return assets;
}

export async function startServer({ port = 4177 } = {}) {
  assert(Number.isInteger(port) && port >= 0 && port <= 65535, "Invalid local port");
  const assets = await loadAssets();
  const server = http.createServer((request, response) => {
    const headers = {
      "Cache-Control": "no-store, max-age=0",
      "Content-Security-Policy": CSP,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Cross-Origin-Resource-Policy": "same-origin",
    };
    const send = (status, bytes, type = "text/plain; charset=utf-8", extra = {}) => {
      const body = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
      response.writeHead(status, { ...headers, ...extra, "Content-Type": type, "Content-Length": body.length });
      response.end(request.method === "HEAD" ? undefined : body);
    };
    if (!["GET", "HEAD"].includes(request.method)) return send(405, "Method not allowed", undefined, { Allow: "GET, HEAD" });
    const target = request.url || "/";
    if (target.length > 2048) return send(414, "Request target too long");
    let pathname;
    try {
      assert(target.startsWith("/") && !target.startsWith("//"));
      pathname = decodeURIComponent(target.split("?")[0]);
      assert(!/[\\\u0000-\u001f#]/.test(pathname));
      assert(!pathname.split("/").some((part) => part === "." || part === ".."));
    } catch {
      return send(400, "Invalid request path");
    }
    const asset = assets.get(pathname);
    if (!asset) return send(404, "Not found");
    return send(200, asset.bytes, asset.type);
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
    const server = await startServer({ port: args.length ? Number(args[1]) : 4177 });
    console.log(`W7-PREVIEW at http://127.0.0.1:${server.address().port}/ — temporary synthetic preview; no storage or sync`);
  } catch {
    console.error("W7-PREVIEW SERVER FAIL: run the build first and check the local port and real build directory");
    process.exitCode = 1;
  }
}
