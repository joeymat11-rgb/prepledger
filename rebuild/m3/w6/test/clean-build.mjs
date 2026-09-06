import { cpSync, mkdtempSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const here = resolve(dirname(fileURLToPath(import.meta.url)), ".."), root = resolve(here, "../../..");
const command = process.env.W6_PNPM_JS ? process.execPath : (process.env.W6_PNPM_BIN || "pnpm");
mkdirSync(join(here, ".tmp"), { recursive: true });
const isolated = mkdtempSync(join(here, ".tmp/clean-browser-"));
const child = (...parts) => join(isolated, ...parts);
function copy(relative) { const destination = child(relative); mkdirSync(dirname(destination), { recursive: true }); cpSync(join(root, relative), destination); }
try {
  for (const name of readdirSync(join(root, "rebuild/client"))) if (name.endsWith(".cjs")) copy(`rebuild/client/${name}`);
  copy("rebuild/authority/canonical.cjs"); copy("rebuild/m3/w5/public-client.cjs");
  for (const name of readdirSync(here)) if (/\.(?:mjs|cjs)$/.test(name) || ["package.json", "pnpm-lock.yaml", "cipher-imports.json", ".npmrc"].includes(name)) copy(`rebuild/m3/w6/${name}`);
  const destination = child("rebuild/m3/w6");
  if (existsSync(child("node_modules")) || existsSync(join(destination, "node_modules"))) throw new Error("Clean dependency premise violated");
  // The caller explicitly selects a local package-manager executable. No account or live data is involved.
  const install = spawnSync(command, [...(process.env.W6_PNPM_JS ? [process.env.W6_PNPM_JS] : []), "install", "--ignore-workspace", "--frozen-lockfile", "--ignore-scripts", "--offline"], {
    cwd: destination, windowsHide: true, encoding: "utf8", timeout: 120000 });
  if (install.status !== 0) { console.error(install.stdout, install.stderr); throw new Error("Pinned offline clean install failed"); }
  const run = spawnSync(process.execPath, [join(destination, "build-browser.mjs")], { cwd: isolated, encoding: "utf8", windowsHide: true, timeout: 120000 });
  if (run.status !== 0) { console.error(run.stdout, run.stderr); throw new Error("Isolated browser build failed"); }
  console.log("W6 CLEAN BUILD PASS — frozen W6 lockfile, fresh dependency directory, no copied root node_modules, offline install and actual browser graph");
} finally { rmSync(isolated, { recursive: true, force: true }); }
