#!/usr/bin/env node
// Preview the site exactly as Netlify serves it.
//
//   npm run serve
//
// Binds to port 0 and lets the OS pick — a hardcoded port collides with
// whatever else the developer already has running, and that collision is
// exactly the kind of thing that makes a repo feel unportable.
//
// The _redirects 404 rules are applied here too, so if a change ever exposes
// /ledger/* you find out locally instead of on the public internet.

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { ROOT, at, isMain, freePort, bold, dim, green } from "./lib.mjs";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json", ".png": "image/png",
  ".woff2": "font/woff2", ".svg": "image/svg+xml", ".md": "text/markdown; charset=utf-8",
};

/** Prefixes the live site 404s, read from _redirects so the two cannot drift. */
export function blockedPrefixes() {
  if (!fs.existsSync(at("_redirects"))) return [];
  return fs.readFileSync(at("_redirects"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && /404!\s*$/.test(l))
    .map((l) => l.split(/\s+/)[0]);
}

function isBlocked(pathname, rules) {
  return rules.some((r) =>
    r.endsWith("*") ? pathname.startsWith(r.slice(0, -1)) : pathname === r);
}

export function createServer() {
  const rules = blockedPrefixes();
  return http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    let pathname = decodeURIComponent(url.pathname);

    if (isBlocked(pathname, rules)) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      const notFound = at("404.html");
      return res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : "Not Found");
    }

    if (pathname.endsWith("/")) pathname += "index.html";
    const file = path.join(ROOT, path.normalize(pathname).replace(/^([/\\])+/, ""));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404).end("Not Found");
      return;
    }
    const headers = { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" };
    if (isBlocked(pathname, rules)) headers["Cache-Control"] = "no-store";
    res.writeHead(200, headers);
    fs.createReadStream(file).pipe(res);
  });
}

if (isMain(import.meta.url)) {
  const port = Number(process.env.PORT) || (await freePort());
  createServer().listen(port, "127.0.0.1", () => {
    console.log(`\n${bold("Prep Ledger")} → ${green(`http://127.0.0.1:${port}`)}`);
    console.log(dim(`  serving ${ROOT}`));
    console.log(dim(`  404'ing ${blockedPrefixes().join(" ") || "(nothing — check _redirects!)"}\n`));
  });
}
