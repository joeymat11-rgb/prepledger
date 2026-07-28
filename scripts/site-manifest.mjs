#!/usr/bin/env node
// EXACTLY which files go to the CDN.
//
//   node scripts/site-manifest.mjs      # one path per line
//
// The pipeline used to zip the whole working directory and exclude a few
// patterns. Two problems with that: exclude patterns are matched against
// archive member names and silently miss when the form does not line up, and
// anything sitting untracked in the runner's working directory (node_modules,
// scratch files) rides along.
//
// So the manifest is built from `git ls-files` — only committed files can ship
// — and then filtered down to the site itself. scripts/check.mjs asserts the
// result both contains what the app needs and excludes everything private, so
// a mistake here fails the build instead of leaking onto the open web.

import { execFileSync } from "node:child_process";
import { ROOT, isMain } from "./lib.mjs";

/** Directories and files that must never reach the CDN. */
const PRIVATE = [
  /^ledger\//,     // her health data — the whole point
  /^src\//,        // sources
  /^tools\//,      // test + maintenance scripts
  /^scripts\//,    // build + ship scripts
  /^\.github\//,   // CI
  /\.md$/,         // CLAUDE.md, HANDOFF.md, BLUEPRINT.md
  /^DEPLOY\.txt$/,
  /^setup\.sh$/,
  /^package(-lock)?\.json$/,
  /^\.gitattributes$/,
  /^\.gitignore$/,
];

/** The files Netlify serves. Anything committed and not private ships, so a
 *  new icon or asset deploys automatically — no allowlist to forget. */
export function siteFiles({ includeUntracked = false } = {}) {
  // The deploy uses committed files only — that is literally what CI checks out
  // and what ships. The gate additionally looks at untracked-but-not-ignored
  // files, so a newly added private file is caught on the run that introduces
  // it rather than the run after it is committed.
  const args = includeUntracked
    ? ["ls-files", "--cached", "--others", "--exclude-standard"]
    : ["ls-files", "--cached"];
  const tracked = execFileSync("git", args, { cwd: ROOT, encoding: "utf8" })
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return tracked.filter((f) => !PRIVATE.some((rx) => rx.test(f)));
}

/** What the app cannot boot without. */
export const REQUIRED = [
  "index.html", "app.js", "sw.js", "fonts.css",
  "manifest.webmanifest", "_redirects", "_headers", "404.html",
];

if (isMain(import.meta.url)) {
  process.stdout.write(siteFiles().join("\n") + "\n");
}
