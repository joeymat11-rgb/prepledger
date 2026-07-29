// Shared plumbing for every script in this repo.
//
// Rule: nothing in scripts/ or tools/ may hardcode an absolute path, a /tmp,
// or a port number. Everything derives from ROOT, which is computed from this
// file's own location — so a bare clone works from any directory, any drive,
// on Windows, macOS or Linux.

import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn, execFileSync } from "node:child_process";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Absolute path to something inside the repo. */
export const at = (...parts) => path.join(ROOT, ...parts);

/** Scratch space, inside the repo and gitignored. Never /tmp — on Windows,
 *  Node resolves "/tmp" to C:\tmp, which does not exist. That bug is what
 *  made tools/render-smoke.mjs unrunnable on this machine. */
export function tmp(name) {
  const dir = at(".tmp");
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, name);
}

/** True when this module's importer was run directly (Windows-safe). */
export const isMain = (metaUrl) =>
  !!process.argv[1] && metaUrl === pathToFileURL(process.argv[1]).href;

// ---------------------------------------------------------------- output --
const colour = !process.env.NO_COLOR && !process.env.CI;
const w = (n) => (s) => (colour ? `\u001b[${n}m${s}\u001b[0m` : String(s));
export const bold = w(1), dim = w(2), red = w(31), green = w(32), yellow = w(33);

export const head = (m) => console.log(`\n${bold(m)}`);
export const pass = (m) => console.log(`  ${green("PASS")}  ${m}`);
export const fail = (m) => console.log(`  ${red("FAIL")}  ${m}`);
export const warn = (m) => console.log(`  ${yellow("WARN")}  ${m}`);
export const note = (m) => console.log(`  ${dim("·")}     ${dim(m)}`);

// -------------------------------------------------------------- children --
const IS_WIN = process.platform === "win32";

const quote = (a) => (/[\s"^&|<>()]/.test(a) ? `"${String(a).replace(/"/g, '\\"')}"` : a);

/** Run a child process. Never throws; always resolves {code, out}. */
export function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    // .cmd/.bat shims (npm) cannot be spawned directly on modern Node, so they
    // need a shell. Passing an args *array* alongside shell:true is deprecated
    // (Node warns about unescaped concatenation), so build one quoted string.
    const needsShell = opts.shell ?? (IS_WIN && /\.(cmd|bat)$/i.test(cmd));
    const file = needsShell ? [cmd, ...args.map(quote)].join(" ") : cmd;
    const argv = needsShell ? [] : args;

    let child;
    try {
      child = spawn(file, argv, {
        cwd: opts.cwd || ROOT,
        env: { ...process.env, ...(opts.env || {}) },
        shell: needsShell,
        windowsHide: true,
      });
    } catch (e) {
      return resolve({ code: 1, out: String(e && e.message) });
    }
    let out = "";
    const take = (stream, sink) => stream?.on("data", (d) => {
      out += d;
      if (opts.echo) sink.write(d);
    });
    take(child.stdout, process.stdout);
    take(child.stderr, process.stderr);
    child.on("error", (e) => resolve({ code: 1, out: out + String(e && e.message) }));
    child.on("close", (code) => resolve({ code: code ?? 1, out }));
  });
}

export const NPM = IS_WIN ? "npm.cmd" : "npm";
export const node = (args, opts) => run(process.execPath, args, opts);

// ------------------------------------------------------------------ ports --
/** Ask the OS for a port nobody is using. Fixed ports collide with whatever
 *  the developer already has running; port 0 never does. */
export function freePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.unref();
    s.on("error", reject);
    s.listen(0, "127.0.0.1", () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });
}

// ----------------------------------------------------------------- token --
/** The GitHub token, from the environment.
 *
 *  On Windows it is stored as a *user* environment variable, which a shell
 *  spawned before it was set will not have inherited — so fall back to asking
 *  Windows directly. The value is returned but must never be printed, logged,
 *  or written to a file. Pass it to git via a credential helper (see ship.mjs),
 *  never on a command line. */
export function ghToken() {
  const fromEnv = (process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "").trim();
  if (fromEnv) return fromEnv;
  if (!IS_WIN) return null;
  try {
    const v = execFileSync(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-Command",
       "[System.Environment]::GetEnvironmentVariable('GH_TOKEN','User')"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], windowsHide: true }
    ).trim();
    return v || null;
  } catch {
    return null;
  }
}

/** Remove a secret from anything about to be shown to a human or a log. */
export function scrub(text, secret) {
  let s = String(text ?? "");
  if (secret && secret.length > 8) s = s.split(secret).join("<redacted>");
  return s.replace(/(gh[pousr]_|github_pat_)[A-Za-z0-9_]{10,}/g, "<redacted>");
}

// --------------------------------------------------------------- versions --
export const REPO = "joeymat11-rgb/prepledger";
export const PROD = "https://fitnessledger2.netlify.app";

/** APP_V from src/app.jsx — the source of truth for the app's version. */
export function appVersion() {
  const m = fs.readFileSync(at("src", "app.jsx"), "utf8").match(/APP_V\s*=\s*"([0-9.]+)"/);
  return m ? m[1] : null;
}

/** The version baked into the service worker cache name. Must equal appVersion()
 *  or installed phones keep serving the old bundle forever. */
export function swVersion() {
  const m = fs.readFileSync(at("sw.js"), "utf8").match(/CACHE\s*=\s*"measured-v([0-9.]+)"/);
  return m ? m[1] : null;
}
