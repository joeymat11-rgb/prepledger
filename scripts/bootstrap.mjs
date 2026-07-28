#!/usr/bin/env node
// Fresh clone -> green, in one command.
//
//   git clone https://github.com/joeymat11-rgb/prepledger.git
//   cd prepledger
//   node scripts/bootstrap.mjs
//
// Deliberately runnable with plain `node`, with no npm script and no arguments,
// because at that moment nothing is installed yet and the person running it may
// know nothing about this project.
//
// This project's tests run in jsdom, so there is no browser and no Python to
// install — the whole toolchain is Node plus the pinned dependencies.

import fs from "node:fs";
import { at, isMain, head, pass, fail, note, warn, run, NPM, bold, red, green, dim, ghToken } from "./lib.mjs";

// scripts/check.mjs is NOT imported here. Node resolves every static import
// before running a single line, and check.mjs pulls in esbuild, jsdom and yaml
// — none of which exist yet on a fresh clone. A static import would crash this
// script with ERR_MODULE_NOT_FOUND before it could install anything, which is
// precisely the situation bootstrap exists to fix. It is imported dynamically
// below, after the install. scripts/lib.mjs is safe: node builtins only.

const MIN_NODE = 20;

async function bootstrap() {
  head("Prerequisites");

  const major = Number(process.versions.node.split(".")[0]);
  if (major < MIN_NODE) {
    fail(`Node ${process.versions.node} — this repo needs ${MIN_NODE} or newer`);
    return 1;
  }
  pass(`node v${process.versions.node}`);

  const git = await run("git", ["--version"]);
  if (git.code !== 0) { fail("git not found on PATH"); return 1; }
  pass(git.out.trim().toLowerCase());

  // The token is only needed to ship, not to build or test. Say so plainly
  // rather than failing, so a read-only clone can still prove itself green.
  if (ghToken()) pass("GH_TOKEN found — this clone can ship");
  else note("no GH_TOKEN — you can build and test, but not ship (see CLAUDE.md)");

  head("Dependencies");
  const clean = fs.existsSync(at("package-lock.json"));
  // --include=dev is not redundant. If NODE_ENV=production is set anywhere in
  // the environment — as it is on the dev machine this project was built on —
  // npm silently omits devDependencies, and esbuild and jsdom never arrive.
  // The install "succeeds", then every test fails with a confusing import error.
  const FLAGS = ["--no-audit", "--no-fund", "--include=dev"];
  const args = clean ? ["ci", ...FLAGS] : ["install", ...FLAGS];
  note(`npm ${args[0]} …`);
  let r = await run(NPM, args);
  if (r.code !== 0 && clean) {
    // A lockfile that has drifted from package.json makes `npm ci` refuse.
    // Say why, then fall back rather than dead-ending a fresh clone.
    warn("npm ci refused (lockfile out of step with package.json) — falling back to npm install");
    r = await run(NPM, ["install", ...FLAGS]);
  }
  if (r.code !== 0) {
    fail("dependency install failed");
    console.error(dim(r.out.slice(-2000)));
    return 1;
  }
  pass("dependencies installed");

  // Only now is it safe to load the gate.
  const { check } = await import("./check.mjs");
  const { ok } = await check({ strict: false });

  if (ok) {
    console.log(`\n${green(bold("Green from a bare clone."))}`);
    console.log(`${dim("  npm run serve   preview it locally")}`);
    console.log(`${dim('  npm run ship -- "note"   test, build, commit, push, confirm live')}\n`);
    return 0;
  }
  console.log(`\n${red(bold("Bootstrap finished, but the gate is red — see above."))}\n`);
  return 1;
}

if (isMain(import.meta.url)) process.exit(await bootstrap());
