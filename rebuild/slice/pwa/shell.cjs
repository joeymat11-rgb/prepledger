"use strict";

/* shell.cjs — the deployable folder, as pure functions: the response headers, the two
   edits that turn A1's built page into an installable one, and the service worker source
   with its precache manifest filled in.

   A1's own build is not touched and not re-implemented. This file only ever receives the
   bytes A1 emitted and returns new bytes. node:fs and node:path only. */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const pwa = require("./pwa.cjs");

const SOURCE = __dirname;

/* ------------------------------------------------------------------ the policies --
   The page's policy is A1's own (rebuild/m3/w7-preview/today/serve.mjs), with exactly
   three necessary differences, each of which the frozen app's lockdown would also have
   needed and none of which opens an origin:
     manifest-src 'self'  — with default-src 'none' the browser refuses to read the web
                            app manifest at all, so "Add to Home Screen" offers nothing;
     worker-src 'self'    — A1's page forbids workers outright (worker-src 'none'); the
                            launch worker is the whole point of this folder;
     connect-src 'self'   — ON THE WORKER SCRIPT ONLY. The worker's fetch() is what
                            precaches and what answers a navigation; the PAGE keeps
                            connect-src 'none', so the athlete's device still cannot be
                            made to talk to anything by the page itself.
   No external origin is named by any policy here — the same proof A1 relies on that an
   offline launch has nothing left to fetch. */
const PAGE_CSP = "default-src 'none'; script-src 'self'; style-src 'self'; font-src data:; "
  + "img-src 'self' data:; connect-src 'none'; manifest-src 'self'; worker-src 'self'; "
  + "object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
const WORKER_CSP = "default-src 'none'; script-src 'self'; connect-src 'self'";
const ASSET_CSP = "default-src 'none'; base-uri 'none'; frame-ancestors 'none'";

const COMMON = Object.freeze({
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cross-Origin-Resource-Policy": "same-origin",
});
const IMMUTABLE = "public, max-age=31536000, immutable";

/* Netlify applies EVERY matching rule, so two rules that both set
   Content-Security-Policy for one path would be sent as two policies and intersected —
   which is how a "more specific" override silently becomes a stricter one. Every rule
   below therefore names an exact path and no two rules match the same request;
   assertHeaderRules proves it, and the tests plant an overlap to watch it fail. */
function headerRules(names) {
  assert(names.index === "index.html", "HEADERS FAIL: the shell must stay index.html");
  const rules = [];
  const page = { ...COMMON, "Content-Security-Policy": PAGE_CSP, "Cache-Control": "no-cache" };
  // "/" and "/index.html" are two requests for the same document.
  rules.push({ path: "/", headers: page });
  rules.push({ path: "/index.html", headers: page });
  // THE SERVICE WORKER IS NEVER STORED. It is the one file whose staleness would pin
  // every other file, so the browser must re-read it on every update check.
  rules.push({ path: "/" + pwa.SERVICE_WORKER,
    headers: { ...COMMON, "Content-Security-Policy": WORKER_CSP, "Cache-Control": "no-store",
      "Service-Worker-Allowed": "/" } });
  rules.push({ path: "/" + pwa.MANIFEST_FILE,
    headers: { ...COMMON, "Content-Security-Policy": ASSET_CSP, "Cache-Control": "no-cache" } });
  // Content-hashed URLs: the bytes at one of these URLs can never change, so they may be
  // stored for ever. That is also what makes the worker's cache-first policy safe.
  for (const name of [names.styles, names.app, names.preflightCss, names.preflightJs]) {
    rules.push({ path: "/" + name,
      headers: { ...COMMON, "Content-Security-Policy": ASSET_CSP, "Cache-Control": IMMUTABLE } });
  }
  for (const icon of [...pwa.ICON_FILES.map((i) => i.name), pwa.ICON_SVG]) {
    rules.push({ path: "/" + icon,
      headers: { ...COMMON, "Content-Security-Policy": ASSET_CSP, "Cache-Control": "public, max-age=604800" } });
  }
  return rules;
}

function assertHeaderRules(rules, served) {
  const seen = new Set();
  for (const rule of rules) {
    assert(rule.path.startsWith("/") && !/[*:]/.test(rule.path),
      `HEADERS FAIL: ${rule.path} is not an exact path — a wildcard would stack policies`);
    assert(!seen.has(rule.path), `HEADERS FAIL: two rules match ${rule.path}`);
    seen.add(rule.path);
    assert(rule.headers["Content-Security-Policy"], `HEADERS FAIL: ${rule.path} carries no policy`);
    assert(!/https?:/.test(rule.headers["Content-Security-Policy"]),
      `HEADERS FAIL: ${rule.path}'s policy names a remote origin`);
    assert(rule.headers["X-Content-Type-Options"] === "nosniff", `HEADERS FAIL: ${rule.path}`);
  }
  for (const name of served) {
    assert(seen.has("/" + name), `HEADERS FAIL: ${name} is served with no rule of its own`);
  }
  const worker = rules.find((r) => r.path === "/" + pwa.SERVICE_WORKER);
  assert.equal(worker.headers["Cache-Control"], "no-store", "HEADERS FAIL: the worker is storable");
  assert.match(worker.headers["Content-Security-Policy"], /connect-src 'self'/);
  const page = rules.find((r) => r.path === "/index.html");
  assert.match(page.headers["Content-Security-Policy"], /connect-src 'none'/);
  assert.match(page.headers["Content-Security-Policy"], /worker-src 'self'/);
  assert.match(page.headers["Content-Security-Policy"], /manifest-src 'self'/);
  return rules.length;
}

function headersFile(rules) {
  const lines = ["# Emitted by rebuild/slice/pwa/build-pwa.mjs. One exact path per rule: Netlify",
    "# applies every matching rule, so overlapping rules would send two policies.", ""];
  for (const rule of rules) {
    lines.push(rule.path);
    for (const [name, value] of Object.entries(rule.headers)) lines.push(`  ${name}: ${value}`);
    lines.push("");
  }
  return lines.join("\n");
}

/* ------------------------------------------------------- the two edits to the page --
   A1's index.html is taken as bytes and changed in exactly the places named here. Each
   replacement asserts it matched once, so an upstream change to A1's shell fails this
   build instead of quietly producing a page with no manifest and no worker. */
function once(text, find, replace, label) {
  const parts = text.split(find);
  assert.equal(parts.length, 2, `SHELL-EDIT FAIL: ${label} matched ${parts.length - 1} times`);
  return parts.join(replace);
}

const preflightHtml = () => fs.readFileSync(path.join(SOURCE, "preflight.html"), "utf8");
const preflightCss = () => fs.readFileSync(path.join(SOURCE, "preflight.css"), "utf8");
const preflightJs = () => fs.readFileSync(path.join(SOURCE, "preflight.js"), "utf8");
const workerSource = () => fs.readFileSync(path.join(SOURCE, "sw-source.js"), "utf8");

function installableHtml(indexHtml, names) {
  let html = once(indexHtml, '<link rel="stylesheet" href="styles.css">',
    [`<link rel="stylesheet" href="${names.styles}">`,
      `  <link rel="stylesheet" href="${names.preflightCss}">`,
      `  <link rel="manifest" href="${pwa.MANIFEST_FILE}">`,
      `  <meta name="theme-color" content="${pwa.THEME_COLOR}">`,
      `  <link rel="icon" href="${pwa.ICON_SVG}" type="image/svg+xml">`,
      `  <link rel="apple-touch-icon" href="icon-180.png">`,
      `  <meta name="apple-mobile-web-app-capable" content="yes">`,
      `  <meta name="mobile-web-app-capable" content="yes">`,
      `  <meta name="apple-mobile-web-app-title" content="${pwa.APP_SHORT_NAME}">`,
    ].join("\n"), "the stylesheet link");
  html = once(html, '<script type="module" src="app.js"></script>',
    `<script type="module" src="${names.app}"></script>\n`
    + `  <script src="${names.preflightJs}" defer></script>`, "the bundle script");
  html = once(html, "</main>", preflightHtml().replace(/^<!--[\s\S]*?-->\n/, "") + "</main>",
    "the end of the stage");
  assert(!/href="styles\.css"/.test(html) && !/src="app\.js"/.test(html),
    "SHELL-EDIT FAIL: an unhashed asset name survived");
  return html;
}

function serviceWorker(manifest, cache) {
  const source = workerSource();
  let out = once(source, '"__EARNED_CACHE_NAME__"', JSON.stringify(cache), "the cache name placeholder");
  out = once(out, "__EARNED_PRECACHE__", JSON.stringify(manifest, null, 2), "the precache placeholder");
  assert(!/__EARNED_/.test(out), "SERVICE-WORKER FAIL: a placeholder survived");
  assert(out.includes(cache), "SERVICE-WORKER FAIL: the cache name is not in the emitted worker");
  return out;
}

/* The same claim A1 executes — no shipped byte names an address the browser could act on
   — re-executed over the WHOLE folder. The one permitted string is the SVG namespace,
   which is an XML identifier and is never fetched; it is allowed by exact value, in one
   named file, so any other URL in that file still fails. */
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const ALLOWED = Object.freeze({ [pwa.ICON_SVG]: Object.freeze([SVG_NAMESPACE]) });

function assertNoNetworkReference(files, allowed = ALLOWED) {
  for (const [name, bytes] of files) {
    if (/\.png$/.test(name)) continue;  // a raster is bytes, not text
    const text = (typeof bytes === "string" ? bytes : bytes.toString("utf8"))
      .replace(/data:[^"')\s]+/g, "data:");
    const permitted = allowed[name] || [];
    const hits = [
      ...text.matchAll(/https?:\/\/[^\s"'`)<>]+/gi),
      ...text.matchAll(/(?:^|[\s"'(=,;:])\/\/[a-z0-9][a-z0-9.-]*\.[a-z]{2,}[^\s"'`)<>]*/gi),
    ].map((m) => m[0].trim())
      // The protocol-relative pattern keeps the separator it matched on, so a permitted
      // absolute URL is recognised by its tail as well as whole.
      .filter((hit) => !permitted.some((ok) => ok === hit || ok.endsWith(hit)));
    assert.equal(hits.length, 0,
      `NETWORK-REFERENCE FAIL: ${name} names ${[...new Set(hits)].slice(0, 3).join(", ")}`);
  }
  return files.length;
}

module.exports = {
  SOURCE, PAGE_CSP, WORKER_CSP, ASSET_CSP, COMMON, IMMUTABLE, SVG_NAMESPACE, ALLOWED,
  headerRules, assertHeaderRules, headersFile, installableHtml, serviceWorker,
  preflightHtml, preflightCss, preflightJs, workerSource, assertNoNetworkReference, once,
};
