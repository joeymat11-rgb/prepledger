#!/usr/bin/env node
'use strict';
// Earned — portable, pinned wrangler launcher for the M3 SETUP steps (integrator tooling only).
//
//   node rebuild/m3/setup/wrangler.cjs whoami
//   node rebuild/m3/setup/wrangler.cjs d1 list --json
//   node rebuild/m3/setup/wrangler.cjs --launcher-check        (resolve + verify only; spawns nothing)
//
// Why this exists (W4-READY-PACKET §1 "Portable invocation"): `node …/node_modules/.bin/wrangler` is not
// portable — the .bin entry is a symlink on Linux and a .cmd/.ps1 shim on Windows. This launcher resolves
// the installed package's own `bin.wrangler` file and runs it through the SAME node binary that runs the
// launcher (process.execPath), with an argument ARRAY and shell:false, so nothing is re-parsed by a shell.
//
// What it never does: install or fetch packages, log in (interactive OAuth), read or print credentials,
// touch environment policy, or pick an account. It only forwards the arguments you typed. wrangler's own
// telemetry is disabled for the child (WRANGLER_SEND_METRICS=false). Exit codes are forwarded unchanged.
//
// A direct version pin in rebuild/m3/tooling/package.json is NOT a transitive dependency lock: the
// launcher checks the wrangler package identity and exact version, nothing deeper (tooling/.npmrc keeps
// package-lock=false on purpose so the frozen root lockfile is never touched).

const path = require('node:path');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

const REQUIRED_VERSION = '4.129.0';
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const DEFAULT_TOOLING_DIR = path.join(REPO_ROOT, 'rebuild', 'm3', 'tooling');
// Interactive OAuth flows are never driven from this launcher (SETUP-TOKEN §4: the token arrives from the
// environment; we do not use `wrangler login`, so no ~/.wrangler token file is ever created by us).
const REFUSED_SUBCOMMANDS = new Set(['login', 'logout']);

// exit codes: 0 ok · 2 usage · 3 not installed / malformed package · 4 wrong version · 5 refused subcommand
const EXIT = { OK: 0, USAGE: 2, NOT_INSTALLED: 3, WRONG_VERSION: 4, REFUSED: 5 };

class LauncherError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

function readJson(file) {
  let text;
  try { text = fs.readFileSync(file, 'utf8'); }
  catch { throw new LauncherError(EXIT.NOT_INSTALLED, `cannot read ${file}`); }
  try { return JSON.parse(text); }
  catch { throw new LauncherError(EXIT.NOT_INSTALLED, `${file} is not valid JSON`); }
}

/**
 * Resolve the pinned wrangler executable under a tooling directory. Pure with respect to the process:
 * no spawn, no network, no environment reads. Throws LauncherError with an exit code on any miss.
 * @param {string} toolingDir  directory holding package.json + node_modules/wrangler
 * @param {string} required    exact version required (default 4.129.0)
 * @returns {{ bin: string, version: string, packageDir: string }}
 */
function resolveWrangler(toolingDir = DEFAULT_TOOLING_DIR, required = REQUIRED_VERSION) {
  const packageDir = path.join(toolingDir, 'node_modules', 'wrangler');
  const pkgFile = path.join(packageDir, 'package.json');
  if (!fs.existsSync(pkgFile)) {
    throw new LauncherError(EXIT.NOT_INSTALLED,
      `wrangler is not installed under ${path.relative(REPO_ROOT, packageDir) || packageDir}. ` +
      `Install it once from the pinned manifest: npm install --prefix rebuild/m3/tooling --no-package-lock --include=dev ` +
      `(this launcher never installs anything itself).`);
  }
  const pkg = readJson(pkgFile);
  if (pkg.name !== 'wrangler') {
    throw new LauncherError(EXIT.NOT_INSTALLED, `package at ${packageDir} is "${pkg.name}", not wrangler`);
  }
  if (typeof pkg.version !== 'string' || pkg.version !== required) {
    throw new LauncherError(EXIT.WRONG_VERSION,
      `installed wrangler is ${pkg.version}; exactly ${required} is required. Reinstall from rebuild/m3/tooling/package.json.`);
  }
  const binRel = typeof pkg.bin === 'string' ? pkg.bin : (pkg.bin && pkg.bin.wrangler);
  if (typeof binRel !== 'string' || !binRel) {
    throw new LauncherError(EXIT.NOT_INSTALLED, 'wrangler/package.json has no "bin.wrangler" entry');
  }
  const bin = path.resolve(packageDir, binRel);
  const rel = path.relative(packageDir, bin);
  if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new LauncherError(EXIT.NOT_INSTALLED, 'wrangler bin entry escapes the package directory');
  }
  if (!fs.existsSync(bin)) {
    throw new LauncherError(EXIT.NOT_INSTALLED, `wrangler bin file is missing: ${bin}`);
  }
  return { bin, version: pkg.version, packageDir };
}

/** First non-flag argument decides the subcommand; refuse the interactive OAuth ones. */
function checkArgs(args) {
  if (!Array.isArray(args) || args.length === 0) {
    throw new LauncherError(EXIT.USAGE,
      'usage: node rebuild/m3/setup/wrangler.cjs <wrangler arguments…> | --launcher-check');
  }
  const sub = args.find((a) => !a.startsWith('-'));
  if (sub && REFUSED_SUBCOMMANDS.has(sub)) {
    throw new LauncherError(EXIT.REFUSED,
      `"wrangler ${sub}" is refused from this launcher: the token comes from the CLOUDFLARE_API_TOKEN ` +
      `environment variable (SETUP-TOKEN.md §3), never from an interactive login.`);
  }
}

/** Build the exact spawn call without running it (used by the tests to check the argument array). */
function planSpawn(args, resolved, env = process.env) {
  return {
    file: process.execPath,
    args: [resolved.bin, ...args],
    options: {
      stdio: 'inherit',
      shell: false,
      windowsHide: false,
      env: { ...env, WRANGLER_SEND_METRICS: 'false' },
    },
  };
}

function main(argv) {
  try {
    if (argv.length === 1 && argv[0] === '--launcher-check') {
      const r = resolveWrangler();
      process.stdout.write(`wrangler-launcher OK ${r.version} ${path.relative(REPO_ROOT, r.bin).split(path.sep).join('/')}\n`);
      return EXIT.OK;
    }
    checkArgs(argv);
    const resolved = resolveWrangler();
    const plan = planSpawn(argv, resolved);
    const child = spawnSync(plan.file, plan.args, plan.options);
    if (child.error) {
      process.stderr.write(`wrangler-launcher: failed to start wrangler: ${child.error.message}\n`);
      return 1;
    }
    if (child.signal) {
      process.stderr.write(`wrangler-launcher: wrangler terminated by signal ${child.signal}\n`);
      return 1;
    }
    return child.status == null ? 1 : child.status;
  } catch (e) {
    if (e instanceof LauncherError) { process.stderr.write(`wrangler-launcher: ${e.message}\n`); return e.code; }
    process.stderr.write(`wrangler-launcher: ${e && e.message ? e.message : e}\n`);
    return 1;
  }
}

module.exports = { REQUIRED_VERSION, DEFAULT_TOOLING_DIR, REFUSED_SUBCOMMANDS, EXIT, LauncherError, resolveWrangler, checkArgs, planSpawn, main };

if (require.main === module) process.exit(main(process.argv.slice(2)));
