"use strict";

/* pwa.cjs — everything the PWA shell IS, as pure functions over bytes.

   Nothing here reads the network, spawns anything, or needs a bundler; it depends on
   node:crypto, node:fs and node:path only, so its tests run under the repository's own
   lockfile (the same reason design.cjs is shaped this way). The build step
   (build-pwa.mjs) is the only file that touches the filesystem's output side.

   THE ONE RULE THIS FILE EXISTS TO ENFORCE
   The frozen app's APP_V bug class was a version string a human had to remember to bump:
   the code changed, the version did not, and the browser kept the old bytes. Here the
   cache name is DERIVED FROM THE BUILT BYTES — cacheName() is a hash over every
   precached file's own sha256 — so a rebuilt asset cannot leave the cache name behind.
   There is no constant to forget. */

const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const SOURCE = __dirname;
const ROOT = path.resolve(__dirname, "../../..");
const icons = require("./icons.cjs");

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

// The app's identity, as the approved design names it.
const APP_NAME = "Earned";
const APP_SHORT_NAME = "Earned";
const APP_DESCRIPTION = "Your plan for today. Synthetic athlete; nothing here is an account.";

/* Colours. Both are the approved design's OWN custom properties, and assertApprovedColours
   below proves they are still spelled that way upstream before a build may use them.
     theme_color      --ground #E7E1D4 : what the phone's chrome sits against (body).
     background_color --paper  #F4F0E8 : the page surface, so the launch splash is the page. */
const THEME_COLOR = "#E7E1D4";
const BACKGROUND_COLOR = "#F4F0E8";
const APPROVED_REFERENCE = "rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html";

// The three assets A1's build emits, and the names they take in the deployable folder.
// A1's own names are stable, so styles.css/app.js get a content hash here: a hashed name
// is what makes "cache-first" safe (a given URL's bytes never change) and lets one build
// and the next coexist in a browser without ever mixing.
const A1_ASSETS = Object.freeze(["index.html", "styles.css", "app.js"]);
const SERVICE_WORKER = "sw.js";
const MANIFEST_FILE = "manifest.webmanifest";
const HEADERS_FILE = "_headers";
const ICON_FILES = Object.freeze([
  { name: "icon-180.png", size: 180, purpose: "any" },
  { name: "icon-192.png", size: 192, purpose: "any" },
  { name: "icon-512.png", size: 512, purpose: "any" },
  { name: "icon-512-maskable.png", size: 512, purpose: "maskable" },
]);
const ICON_SVG = "icon.svg";

/* ---------------------------------------------------------------- the private guard --
   Nothing private is ever in this folder. The folder serves PUBLIC source with a
   SYNTHETIC athlete, and the guard is executed on the staged bytes — it is not a promise
   in a comment. It refuses on three grounds: a file that came from a private path, a
   shipped byte that NAMES a private path, and a shipped byte shaped like a credential. */
const PRIVATE_ROOTS = Object.freeze([
  "rebuild/conform/private",
  "rebuild/conform/engines",
  "ledger",
]);
const PRIVATE_FILES = Object.freeze(["src/history.js"]);
// Every string here is a real, published credential prefix. Generic "long random string"
// rules are deliberately absent: this folder legitimately ships a base64 typeface and a
// SHA-256 implementation full of hex constants, and a guard that cries wolf gets muted.
const TOKEN_SHAPES = Object.freeze([
  ["GitHub personal access token", /\bghp_[A-Za-z0-9]{36}\b/],
  ["GitHub fine-grained token", /\bgithub_pat_[A-Za-z0-9_]{22,}/],
  ["GitHub OAuth/app/refresh token", /\b(?:gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b/],
  ["Netlify personal access token", /\bnfp_[A-Za-z0-9]{36,}\b/],
  ["Slack token", /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ["AWS access key id", /\bAKIA[0-9A-Z]{16}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["PEM private key", /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/],
  ["JSON Web Token", /\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/],
  ["a secret assigned in source",
    /\b(?:api[_-]?key|secret[_-]?key|client[_-]?secret|auth[_-]?token|access[_-]?token|private[_-]?key)\b\s*[:=]\s*["'][^"'\s]{16,}["']/i],
]);

// data: payloads are collapsed before scanning, exactly as A1's network-reference check
// does: a base64 typeface is bytes, not a sentence, and matching inside it is noise.
const scannable = (bytes) =>
  (typeof bytes === "string" ? bytes : bytes.toString("latin1")).replace(/data:[^"')\s]+/g, "data:");

function assertNothingPrivate(files, sources = {}) {
  const isPrivate = (p) => {
    const posix = String(p).replace(/\\/g, "/").replace(/^\.\//, "");
    return PRIVATE_ROOTS.some((root) => posix === root || posix.startsWith(root + "/"))
      || PRIVATE_FILES.includes(posix);
  };
  for (const [name, from] of Object.entries(sources)) {
    assert(!isPrivate(from), `PRIVATE-GUARD FAIL: ${name} was copied from ${from}`);
  }
  for (const [name] of files) {
    assert(!isPrivate(name), `PRIVATE-GUARD FAIL: the output contains a private path: ${name}`);
  }
  for (const [name, bytes] of files) {
    const text = scannable(bytes);
    for (const root of [...PRIVATE_ROOTS.map((r) => r + "/"), ...PRIVATE_FILES]) {
      // "ledger/" alone is a common English word followed by a slash nowhere in this
      // page; the named private artefacts are what must never be reachable from it.
      const needle = root === "ledger/" ? "ledger/state.json" : root;
      const at = text.indexOf(needle);
      assert.equal(at, -1, `PRIVATE-GUARD FAIL: ${name} names ${needle} at byte ${at}`);
    }
    for (const [label, shape] of TOKEN_SHAPES) {
      const hit = text.match(shape);
      assert.equal(hit, null, `PRIVATE-GUARD FAIL: ${name} carries what looks like a ${label}`);
    }
  }
  return { files: files.length, shapes: TOKEN_SHAPES.length, roots: PRIVATE_ROOTS.length + PRIVATE_FILES.length };
}

/* ------------------------------------------------------------------ the cache name --
   A hash over the precache manifest itself: every file's name AND its own sha256. Change
   one byte of one asset and this changes. There is no hand-maintained version. */
function cacheName(manifest) {
  assert(Array.isArray(manifest) && manifest.length > 0, "CACHE-NAME FAIL: an empty precache list");
  const lines = manifest.map((entry) => {
    assert(entry && typeof entry.path === "string" && /^[a-z0-9][a-z0-9.-]*$/.test(entry.path),
      `CACHE-NAME FAIL: bad precache path ${entry && entry.path}`);
    assert(/^[0-9a-f]{64}$/.test(entry.sha256), `CACHE-NAME FAIL: bad sha256 for ${entry.path}`);
    return `${entry.path} ${entry.sha256}`;
  });
  const sorted = [...lines].sort();
  assert.deepEqual(sorted, [...new Set(sorted)], "CACHE-NAME FAIL: a precache path appears twice");
  return "earned-slice-" + sha256(sorted.join("\n")).slice(0, 32);
}

const CACHE_PREFIX = "earned-slice-";

function hashedName(name, bytes) {
  const dot = name.lastIndexOf(".");
  assert(dot > 0, `HASHED-NAME FAIL: ${name}`);
  return `${name.slice(0, dot)}.${sha256(bytes).slice(0, 16)}${name.slice(dot)}`;
}

/* ------------------------------------------------------------------- the manifest -- */
function webManifest() {
  return JSON.stringify({
    id: "./",
    name: APP_NAME,
    short_name: APP_SHORT_NAME,
    description: APP_DESCRIPTION,
    start_url: "./index.html",
    scope: "./",
    display: "standalone",
    orientation: "portrait",
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      { src: "./icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "./icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "./icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }, null, 2) + "\n";
}

// The design of record is the only authority for these two colours; a design change
// upstream must not leave the icon and the splash quietly wrong.
function assertApprovedColours(root = ROOT) {
  const html = fs.readFileSync(path.join(root, APPROVED_REFERENCE), "utf8");
  for (const [token, value] of [["--ground", THEME_COLOR], ["--paper", BACKGROUND_COLOR],
    ["--green", icons.GREEN_HEX]]) {
    const declared = new RegExp(token + ":\\s*" + value + "\\b", "i");
    assert(declared.test(html), `APPROVED-COLOUR FAIL: ${token} is no longer ${value} in ${APPROVED_REFERENCE}`);
  }
  return { theme: THEME_COLOR, background: BACKGROUND_COLOR, field: icons.GREEN_HEX };
}

module.exports = {
  SOURCE, ROOT, sha256, APP_NAME, APP_SHORT_NAME, APP_DESCRIPTION, THEME_COLOR, BACKGROUND_COLOR,
  APPROVED_REFERENCE, A1_ASSETS, SERVICE_WORKER, MANIFEST_FILE, HEADERS_FILE, ICON_FILES, ICON_SVG,
  PRIVATE_ROOTS, PRIVATE_FILES, TOKEN_SHAPES, CACHE_PREFIX,
  assertNothingPrivate, cacheName, hashedName, webManifest, assertApprovedColours, scannable,
};
