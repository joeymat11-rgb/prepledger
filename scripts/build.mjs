#!/usr/bin/env node
// The single definition of "build the app".
//
// Everything that needs app.js — the freshness gate, the DOM smoke, ship, CI —
// calls through here. There is deliberately no second esbuild invocation
// anywhere in the repo that could drift out of sync with this one, because a
// build that differs from the gate's build makes the gate meaningless.
//
// esbuild is a pinned dependency (not `npx --yes esbuild`) so the output is
// byte-identical on this laptop and on a CI runner. That reproducibility is
// what lets check.mjs prove the committed app.js is not stale.

import fs from "node:fs";
import esbuild from "esbuild";
import { ROOT, at, tmp, isMain, head, pass, note, appVersion } from "./lib.mjs";

/** Read fresh each time: APP_V lives in src/app.jsx and can change mid-session. */
export function buildOptions() {
  return {
    entryPoints: [at("src", "main.jsx")],
    bundle: true,
    minify: true,
    format: "iife",
    jsx: "automatic",
    loader: { ".jsx": "jsx" },
    define: {
      "process.env.NODE_ENV": '"production"',
      // Lets src/beacon.js stamp faults with the app version without importing
      // app.jsx — which keeps a 5,000-line file that is edited by string
      // surgery entirely out of the beacon's blast radius.
      __APP_V__: JSON.stringify(appVersion() || "unknown"),
    },
    absWorkingDir: ROOT,
    logLevel: "silent",
  };
}

/** Build the production bundle to `outfile`. */
export async function buildApp(outfile) {
  await esbuild.build({ ...buildOptions(), outfile });
  return outfile;
}

/** Build to scratch and hand back the bytes, leaving the committed file alone. */
export async function buildCandidate() {
  const out = tmp("app.candidate.js");
  await buildApp(out);
  return fs.readFileSync(out);
}

/** An unminified bundle, for tests that need readable stack traces. */
export async function buildForTests() {
  const out = tmp("app.test-bundle.js");
  await esbuild.build({ ...buildOptions(), minify: false, outfile: out });
  return out;
}

if (isMain(import.meta.url)) {
  head("Build");
  const dest = at("app.js");
  await buildApp(dest);
  const kb = (fs.statSync(dest).size / 1024).toFixed(0);
  pass(`app.js written — ${kb} KB`);
  note("committed on purpose: Netlify serves this repo as-is, with no build step");
}
