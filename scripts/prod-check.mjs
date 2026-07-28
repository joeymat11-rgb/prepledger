#!/usr/bin/env node
// DAILY PRODUCTION CHECK — is the live site still right, today?
//
//   npm run prodcheck
//
// The suite proves the code is correct. This proves the thing on the internet
// is the code, still serving, still locked down. Those drift apart quietly:
// a deploy that half-failed, a redirect rule someone tidied, an upstream that
// changed. Nobody notices until she opens the app and it is wrong.
//
// What it asserts:
//   1. the app loads and is the version this repo says it should be
//   2. every asset the app needs is actually on the CDN
//   3. /ledger/* and the source are STILL not readable by the public
//   4. the two services the app depends on — GitHub and Anthropic — answer
//
// Check 3 is the one that matters most. Her body-composition history is behind
// a redirect rule; if that rule ever stops working, this is what tells us.

import { isMain, head, pass, fail, warn, note, appVersion, PROD, REPO, bold, red, green, dim, ghToken } from "./lib.mjs";

const results = [];
const record = (ok, label, detail) => {
  results.push({ ok, label, detail });
  (ok ? pass : fail)(detail ? `${label} — ${detail}` : label);
};

const bust = (u) => u + (u.includes("?") ? "&" : "?") + "t=" + Date.now();

async function get(path, opts = {}) {
  const url = path.startsWith("http") ? path : PROD + path;
  const ctl = AbortSignal.timeout(20000);
  try {
    const r = await fetch(bust(url), { redirect: "follow", signal: ctl, ...opts });
    const body = opts.head ? "" : await r.text();
    return { status: r.status, body, ok: r.ok };
  } catch (e) {
    return { status: 0, body: "", ok: false, err: String((e && e.message) || e) };
  }
}

// ------------------------------------------------------------ 1. the app --
async function appLoads(want) {
  const root = await get("/");
  record(root.status === 200 && root.body.includes("Prep Ledger"),
    "app loads", root.status === 200 ? `${PROD} serves the shell` : `HTTP ${root.status} ${root.err || ""}`);

  const app = await get("/app.js");
  record(app.status === 200 && app.body.length > 300000,
    "bundle served", `HTTP ${app.status}, ${(app.body.length / 1024).toFixed(0)} KB`);

  const sw = await get("/sw.js");
  const m = sw.body.match(/prep-ledger-v([0-9.]+)/);
  const live = m ? m[1] : null;
  record(live === want,
    "live version matches this repo",
    live ? `site serves ${live}, repo says ${want}` : `could not read a version from /sw.js (HTTP ${sw.status})`);

  if (live && live !== want) {
    note("a deploy did not land, or landed without bumping the service worker");
  }
}

// --------------------------------------------------------------- 2. assets --
const ASSETS = [
  "/index.html", "/fonts.css", "/manifest.webmanifest",
  "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png", "/404.html",
];

async function assets() {
  const bad = [];
  for (const a of ASSETS) {
    const r = await get(a);
    if (r.status !== 200) bad.push(`${a} -> ${r.status}`);
  }
  record(bad.length === 0, "every asset the app needs is on the CDN",
    bad.length ? bad.join(", ") : `${ASSETS.length} checked, all 200`);
}

// ------------------------------------------------------------- 3. lockdown --
// If any of these ever returns 200, private health data is on the open web.
const MUST_404 = [
  "/ledger/state.json",
  "/ledger/analyst-constitution.md",
  "/ledger/suggestions.json",
  "/ledger/errors.json",
  "/src/app.jsx",
  "/tools/engine-test.jsx",
  "/scripts/ship.mjs",
  "/CLAUDE.md",
  "/setup.sh",
];

async function lockdown() {
  const exposed = [];
  for (const p of MUST_404) {
    const r = await get(p);
    // 404 is the intended answer; anything 2xx means it is readable.
    if (r.status >= 200 && r.status < 300) exposed.push(`${p} is PUBLIC (HTTP ${r.status})`);
  }
  record(exposed.length === 0, "private paths are still private",
    exposed.length ? exposed.join("; ") : `${MUST_404.length} paths checked, none readable`);
}

// ------------------------------------------------------------ 4. upstreams --
async function upstreams() {
  // GitHub: the app files every weigh-in through this API. Unauthenticated is
  // fine — we are testing reachability, not permissions.
  const gh = await get("https://api.github.com/rate_limit");
  record(gh.status === 200, "GitHub API reachable", `HTTP ${gh.status}`);

  // Anthropic: powers Ask the Ledger. No key here on purpose — a 401 still
  // proves DNS, TLS and the endpoint are all alive.
  const an = await get("https://api.anthropic.com/v1/messages", { method: "POST", head: false });
  record(an.status > 0 && an.status < 500, "Anthropic API reachable",
    `HTTP ${an.status}${an.status === 401 ? " (expected — no key sent)" : ""}`);

  // The deploy beacon: did the last pipeline run actually publish?
  const tok = ghToken();
  if (!tok) { warn("deploy beacon not checked — no GH_TOKEN available"); return; }
  const r = await fetch(bust(`https://api.github.com/repos/${REPO}/contents/ledger/deploy.json?ref=main`), {
    headers: { Authorization: "Bearer " + tok, Accept: "application/vnd.github.raw" },
  }).catch(() => null);
  if (!r || !r.ok) { warn(`deploy beacon unreadable (HTTP ${r ? r.status : "network"})`); return; }
  const b = await r.json().catch(() => null);
  record(!!b && b.state === "published", "last deploy reported success",
    b ? `${b.state} — ${b.version || "?"} at ${b.at || "?"}` : "beacon unparseable");
}

// ------------------------------------------------------------------- main --
export async function prodCheck() {
  const want = appVersion();
  head(`Production check — ${PROD}`);
  note(`this repo is at APP_V ${want}`);

  await appLoads(want);
  await assets();
  await lockdown();
  await upstreams();

  const failed = results.filter((r) => !r.ok);
  return { ok: failed.length === 0, failed, results };
}

if (isMain(import.meta.url)) {
  const { ok, failed } = await prodCheck();
  if (ok) {
    console.log(`\n${green(bold("Production is healthy."))}\n`);
  } else {
    console.log(`\n${red(bold(`Production check FAILED — ${failed.length} problem(s):`))}`);
    for (const f of failed) console.log(`  - ${f.label}: ${f.detail}`);
    console.log("");
  }
  process.exit(ok ? 0 : 1);
}
