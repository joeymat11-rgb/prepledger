#!/usr/bin/env node
// npm run ship -- "what changed"
//
// Tests are a wall, not a suggestion. Nothing red gets past this script, and
// a stale app.js cannot slip through either: ship always rebuilds before it
// commits, so the artifact in the commit is the artifact the source produces.
//
// Order matters and is deliberate:
//   fetch + MERGE origin/main -> sync sw version -> rebuild -> full gate ->
//   commit -> push -> wait for the deploy beacon to confirm it is actually live.
//
// The remote is integrated FIRST, before the gate, and never after it. There was
// a `pull --rebase` between the gate and the push; it meant the gate proved a
// different tree than the one that got pushed, and a conflict left the repo
// mid-rebase with a half-applied release. Both fired on 2026-08-04. See step 0.
//
// The token is read from GH_TOKEN (or, on Windows, from the user environment)
// and handed to git through a credential helper. It never appears on a command
// line, in a config file, or in this script's output.

import fs from "node:fs";
import {
  at, isMain, head, pass, fail, warn, note, run, ghToken, scrub,
  appVersion, swVersion, REPO, bold, red, green, dim,
} from "./lib.mjs";
import { check } from "./check.mjs";
import { buildApp } from "./build.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------- git --
const HELPER = '!f() { echo username=x-access-token; echo "password=$GH_TOKEN"; }; f';

function gitRunner(token) {
  return (args, opts = {}) =>
    run("git", ["-c", "credential.helper=", "-c", `credential.helper=${HELPER}`, ...args],
        { env: { GH_TOKEN: token, GIT_TERMINAL_PROMPT: "0" }, ...opts });
}

// ---------------------------------------------------------------- beacon --
async function waitForBeacon(sha, token) {
  const base = `https://api.github.com/repos/${REPO}/contents/ledger/deploy.json?ref=main&t=`;
  for (let i = 0; i < 24; i++) {
    await sleep(8000);
    try {
      const r = await fetch(base + Date.now(), {
        headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github.raw" },
      });
      if (!r.ok) continue;
      const b = await r.json();
      if (b.sha !== sha) continue;
      if (b.state === "published") return { state: "published", version: b.version, secs: (i + 1) * 8 };
      return { state: "error", log: b.log || [] };
    } catch { /* transient — keep polling */ }
  }
  return { state: "timeout" };
}

// ------------------------------------------------------------------ main --
async function ship() {
  const message = process.argv.slice(2).filter((a) => !a.startsWith("--")).join(" ").trim();
  if (!message) {
    console.error(`\n${red("A release note is required.")}\n\n  npm run ship -- "raised the analyst read above the fold"\n`);
    return 1;
  }

  const token = ghToken();
  if (!token) {
    console.error(`\n${red("No GitHub token.")}\n\n  Set GH_TOKEN in your environment, then try again.\n  See CLAUDE.md, "Working from scratch".\n`);
    return 1;
  }
  const git = gitRunner(token);

  // 0. Integrate the remote BEFORE the gate runs, never after.
  //
  //    This used to be a `git pull --rebase` sitting between the gate and the
  //    push (step 5). That ordering had two independent faults, and both fired:
  //
  //    a) THE GATE PROVED THE WRONG TREE. The gate ran against the local tree,
  //       and the rebase then replayed that commit on top of whatever main had
  //       gained. If another session had touched `src/`, the pushed `app.js`
  //       was stale against the pushed `src/` -- and "app.js is not stale" is
  //       the gate's central promise, because Netlify serves this repo as-is.
  //       CI catches it on main, but only after a red deploy.
  //
  //    b) A STOPPED REBASE IS A HALF-APPLIED RELEASE. `ledger/state.json` moves
  //       every time the phone syncs, so a conflict here is the common case,
  //       not the rare one. A rebase that stops leaves the repo mid-rebase with
  //       part of the work applied. On 2026-08-04 that put a PARTIAL v7.6.0 on
  //       main with APP_V still reading 7.5.0, and it deployed.
  //
  //    Fetch and MERGE first, then gate, then push. A merge is atomic: it either
  //    completes or aborts back to a clean tree -- there is no half state to
  //    push by accident. And because it happens before the gate, whatever the
  //    gate proves is exactly what leaves the machine.
  head("Sync");
  const fetched = await git(["fetch", "-q", "origin", "main"]);
  if (fetched.code !== 0) {
    fail("could not reach origin — nothing was built or pushed");
    console.error(dim(scrub(fetched.out, token)));
    return 1;
  }
  const behindN = Number(((await git(["rev-list", "--count", "HEAD..FETCH_HEAD"])).out || "0").trim()) || 0;
  if (behindN > 0) {
    const merged = await git(["merge", "--no-edit", "-q", "FETCH_HEAD"]);
    if (merged.code !== 0) {
      await git(["merge", "--abort"]);
      fail(`origin/main has ${behindN} commit(s) that do not merge cleanly`);
      console.error(dim(scrub(merged.out, token)));
      console.error(`\n  The merge was aborted, so your tree is clean and nothing was built or\n  pushed. Resolve by hand, then run ship again.\n`);
      return 1;
    }
    pass(`merged ${behindN} commit(s) from origin/main — the gate will see the tree that gets pushed`);
  } else {
    pass("already up to date with origin/main");
  }

  // 1. Keep the service worker's cache name in step with APP_V. If these drift,
  //    every installed phone keeps serving the old bundle and the ship is a
  //    no-op that looks like a success.
  head("Version");
  const app = appVersion();
  const sw = swVersion();
  if (!app) { fail("could not read APP_V from src/app.jsx"); return 1; }
  if (app !== sw) {
    const text = fs.readFileSync(at("sw.js"), "utf8")
      .replace(/CACHE\s*=\s*"measured-v[0-9.]+"/, `CACHE = "measured-v${app}"`);
    fs.writeFileSync(at("sw.js"), text);
    pass(`sw.js cache bumped ${sw} -> ${app} (phones will pick up the new bundle)`);
  } else {
    pass(`APP_V ${app} already matches the sw cache`);
  }

  // 2. Rebuild before anything else looks at app.js, so the gate and the commit
  //    are both talking about the same bytes.
  head("Build");
  const before = fs.existsSync(at("app.js")) ? fs.readFileSync(at("app.js")) : Buffer.alloc(0);
  await buildApp(at("app.js"));
  const after = fs.readFileSync(at("app.js"));
  if (!before.equals(after)) {
    pass(`app.js rebuilt (${(after.length / 1024).toFixed(0)} KB)`);
    if (before.length) note("the committed app.js was stale — the fresh build goes into this commit");
  } else {
    pass("app.js already matched a fresh build");
  }

  // 3. The wall.
  const gate = await check({ strict: false });
  if (!gate.ok) {
    console.error(`\n${red(bold("PUSH BLOCKED — the gate is red. Nothing was committed."))}\n`);
    return 1;
  }

  // 4. Commit.
  head("Commit");
  await git(["add", "-A"]);
  const staged = await git(["diff", "--cached", "--name-only"]);
  if (!staged.out.trim()) {
    pass("nothing to commit — the tree already matches what is live");
    return 0;
  }
  note(staged.out.trim().split("\n").length + " file(s): " + staged.out.trim().split("\n").slice(0, 8).join(", "));
  const commit = await git(["commit", "-q", "-m", message]);
  if (commit.code !== 0) { fail(scrub(commit.out, token)); return 1; }
  pass(`committed — ${message}`);

  // 5. Push.
  head("Push");
  // The remote was integrated at step 0, before the gate. Do NOT reintroduce a
  // pull here: anything fetched after the gate is, by definition, ungated.
  // A rejected push is the wall holding, not a problem to route around.
  const push = await git(["push", "-q", "origin", "HEAD:main"]);
  if (push.code !== 0) {
    fail("push rejected — main moved while the gate was running");
    console.error(dim(scrub(push.out, token)));
    console.error(`\n  ${bold("Do not rebase and retry.")} Just run ship again: step 0 will merge the new\n  commits and re-gate, so what gets pushed is what was proved.\n`);
    return 1;
  }
  const sha = (await git(["rev-parse", "HEAD"])).out.trim();
  pass(`pushed ${sha.slice(0, 7)} to main`);

  // 6. Do not claim success until the robot says it is live.
  head("Live");
  note("waiting for the deploy beacon (CI runs the suite again before publishing)…");
  const beacon = await waitForBeacon(sha, token);
  if (beacon.state === "published") {
    pass(`confirmed live — ${beacon.version} after ${beacon.secs}s`);
    if (beacon.version && beacon.version.replace(/^v/, "") !== app) {
      warn(`site reports ${beacon.version} but source is ${app} — check sw.js`);
    }
    return 0;
  }
  if (beacon.state === "error") {
    fail("the deploy failed after the push — tail of the runner log:");
    for (const l of beacon.log.slice(-12)) console.error(dim("      " + l));
    return 1;
  }
  warn("no beacon confirmation in ~3 min — the Actions queue may be slow");
  note(`check https://github.com/${REPO}/actions`);
  return 0;
}

if (isMain(import.meta.url)) process.exit(await ship());
