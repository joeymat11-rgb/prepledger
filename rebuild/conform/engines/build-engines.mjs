/* rebuild/conform/engines/build-engines.mjs — build the OLD ENGINE artifacts the port oracle (run.cjs steps 2–3, rig185)
   needs, from the repo's own history. Nothing here is committed: engines/ is gitignored (each artifact is ~800 KB of
   bundled app code).   usage:  node engines/build-engines.mjs <repo root> [main=<commit>] [fix4b=<commit>]
   defaults: main = a0009c3 (v7.55.9, deployed main — the PROVISIONAL golden's engine) · fix4b = 66bc7c3 (FIX-4b tip).
   Method (same as tools/rigs/rig174-build-engines.mjs): a detached git worktree per commit under $TMPDIR/earned-engine-wt/ (outside the repo),
   esbuild bundles tools/_fixed-now.mjs + src/app.jsx's __test export to engines/engine-<name>.cjs (platform node, cjs).
   Then:  export ENGINE_MAIN=$PWD/engines/engine-main.cjs ENGINE_FIX4B=$PWD/engines/engine-fix4b.cjs
   NOTE: the byte-level sha256 of an esbuild bundle depends on the esbuild version and the entry path, so it will NOT
   equal oracle/manifest.json's engineSha256 from the cowork build; the CENSUS the engine produces must (that is the
   golden — byte-identical, see the handoff cover). */
import fs from "node:fs"; import path from "node:path"; import { execFileSync } from "node:child_process";
const [root, ...rest] = process.argv.slice(2);
if (!root) { console.log("usage: node engines/build-engines.mjs <repo root> [main=<commit>] [fix4b=<commit>]"); process.exit(2); }
const commits = { main: "a0009c3", fix4b: "66bc7c3" }; for (const a of rest) { const [k, v] = a.split("="); if (k in commits && v) commits[k] = v; }
const here = path.dirname(new URL(import.meta.url).pathname); const esbuild = (await import(path.join(root, "node_modules/esbuild/lib/main.js"))).default;
const wtBase = path.join((await import("node:os")).default.tmpdir(), "earned-engine-wt"); fs.mkdirSync(wtBase, { recursive: true });   /* outside the repo: nothing to ignore */
for (const [name, commit] of Object.entries(commits)) {
  const wt = path.join(wtBase, name);
  if (!fs.existsSync(path.join(wt, "src", "app.jsx"))) { try { execFileSync("git", ["-C", root, "worktree", "remove", "--force", wt], { stdio: "ignore" }); } catch (_) {} execFileSync("git", ["-C", root, "worktree", "add", "--detach", wt, commit], { stdio: "inherit" }); }
  const head = execFileSync("git", ["-C", wt, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
  const entry = path.join(wt, "tools", "_engine-entry.mjs");
  fs.writeFileSync(entry, `import "./_fixed-now.mjs";\nimport { __test } from "../src/app.jsx";\nexport { __test };\n`);
  const outfile = path.join(here, `engine-${name}.cjs`);
  await esbuild.build({ entryPoints: [entry], bundle: true, platform: "node", format: "cjs", jsx: "automatic", loader: { ".jsx": "jsx" }, outfile, absWorkingDir: wt, nodePaths: [path.join(root, "node_modules")], logLevel: "error" });
  fs.unlinkSync(entry);
  const sha = (await import("node:crypto")).createHash("sha256").update(fs.readFileSync(outfile)).digest("hex");
  console.log(`built ${name} @ ${head} → ${path.relative(root, outfile)}  sha256=${sha}  (${fs.statSync(outfile).size} bytes)`);
}
console.log("export ENGINE_MAIN=" + path.join(here, "engine-main.cjs") + " ENGINE_FIX4B=" + path.join(here, "engine-fix4b.cjs"));
