/* rebuild/conform/engines/build-engines.mjs — build the OLD ENGINE artifacts the port oracle (run.cjs steps 2–3, rig185)
   needs, from the repo's own history. Nothing here is committed: engines/ is gitignored (each artifact is ~800 KB of
   bundled app code).   usage:  node engines/build-engines.mjs <repo root> [main=<commit>] [old=<commit>]
   defaults: main = fe516c1 (v7.56.0, frozen main — the FINAL golden's engine) · old = a0009c3 (v7.55.9, the last pre-PROGRESSION-1 main — the sensitivity probe's engine).
   Method: fresh detached worktrees per invocation under the supplied repo's canonical .tmp; preserve them as evidence.
   esbuild bundles tools/_fixed-now.mjs + src/app.jsx's __test export to engines/engine-<name>.cjs (platform node, cjs).
   Then:  export ENGINE_MAIN=$PWD/engines/engine-main.cjs ENGINE_OLD=$PWD/engines/engine-old.cjs
   NOTE: the byte-level sha256 of an esbuild bundle depends on the esbuild version and the entry path, so it will NOT
   equal oracle/manifest.json's engineSha256 from the cowork build; the CENSUS the engine produces must (that is the
   golden — byte-identical, see the handoff cover). */
import fs from "node:fs"; import path from "node:path"; import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
const [suppliedRoot, ...rest] = process.argv.slice(2);
if (!suppliedRoot) { console.log("usage: node engines/build-engines.mjs <repo root> [main=<commit>] [old=<commit>]"); process.exit(2); }
const commits = { main: "fe516c1", old: "a0009c3" }; for (const a of rest) { const [k, v] = a.split("="); if (k in commits && v) commits[k] = v; }
function noLinks(value) {
  const absolute = path.resolve(value), parsed = path.parse(absolute); let current = parsed.root;
  for (const part of absolute.slice(parsed.root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error('Linked path refused: ' + current);
  }
  return fs.realpathSync(absolute);
}
const root = noLinks(suppliedRoot), script = fileURLToPath(import.meta.url), here = path.dirname(script);
const git = args => execFileSync('git', ['-C', root, ...args], {encoding:'utf8'}).trim();
if (path.relative(root, noLinks(git(['rev-parse','--show-toplevel']))) !== '' ||
    path.relative(path.join(root,'rebuild','conform','engines','build-engines.mjs'), noLinks(script)) !== '')
  throw new Error('The supplied root must own this builder and be the Git worktree root');
function checked(value, optional = false) {
  const target = path.resolve(value), relative = path.relative(root, target);
  if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) throw new Error('Path escapes builder root');
  const stat = fs.lstatSync(target, {throwIfNoEntry:false});
  if (!stat && optional) { noLinks(path.dirname(target)); return null; }
  if (!stat) throw new Error('Required path missing: ' + target);
  const actual = noLinks(target), actualRelative = path.relative(root, actual);
  if (actualRelative === '..' || actualRelative.startsWith('..' + path.sep) || path.isAbsolute(actualRelative) ||
      stat.isFile() && stat.nlink !== 1) throw new Error('Unowned or linked path refused: ' + target);
  return stat;
}
checked(script); checked(here);
for (const name of Object.keys(commits)) {
  checked(path.join(here, `engine-${name}.cjs`), true);
  const full = git(['rev-parse','--verify','--end-of-options', commits[name] + '^{commit}']);
  if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(full)) throw new Error('Full commit identity required');
  commits[name] = full;
}
const esbuildPath = path.join(root, 'node_modules/esbuild/lib/main.js'); checked(esbuildPath);
const esbuild = (await import(pathToFileURL(esbuildPath).href)).default;
const temporary = path.join(root, '.tmp');
if (!checked(temporary, true)) {
  try { fs.mkdirSync(temporary); } catch (error) { if (error.code !== 'EEXIST') throw error; }
}
if (!checked(temporary).isDirectory()) throw new Error('Scratch parent is not a directory');
const wtBase = fs.mkdtempSync(path.join(temporary, 'earned-engine-build-')); checked(wtBase);
const outputs = path.join(wtBase, 'outputs'); fs.mkdirSync(outputs); checked(outputs);
const built = [];
for (const [name, commit] of Object.entries(commits)) {
  const wt = path.join(wtBase, `${name}-${commit}`);
  checked(wtBase); if (checked(wt, true)) throw new Error('Invocation worktree already exists');
  execFileSync("git", ["-C", root, "worktree", "add", "--detach", wt, commit], { stdio: "inherit" });
  checked(wt);
  const head = execFileSync("git", ["-C", wt, "rev-parse", "--verify", "HEAD^{commit}"], { encoding: "utf8" }).trim();
  if (head !== commit) throw new Error('Created worktree has a different commit');
  for (const file of ['tools/_fixed-now.mjs','src/app.jsx']) if (!checked(path.join(wt,file)).isFile()) throw new Error('Build input is not a file');
  const entry = path.join(wt, "tools", "_engine-entry.mjs");
  checked(entry, true);
  fs.writeFileSync(entry, `import "./_fixed-now.mjs";\nimport { __test } from "../src/app.jsx";\nexport { __test };\n`, {flag:'wx'});
  const outfile = path.join(outputs, `engine-${name}.cjs`); checked(outputs);
  await esbuild.build({ entryPoints: [entry], bundle: true, platform: "node", format: "cjs", jsx: "automatic", loader: { ".jsx": "jsx" }, outfile, absWorkingDir: wt, nodePaths: [path.join(root, "node_modules")], logLevel: "error" });
  checked(outfile);
  const sha = (await import("node:crypto")).createHash("sha256").update(fs.readFileSync(outfile)).digest("hex");
  built.push({name,head,outfile,sha,size:fs.statSync(outfile).size});
}
// Build both first. A failing build neither publishes old files as new results nor
// deletes previous outputs. Per-invocation sources/entries/bundles remain intact.
for (const item of built) {
  const outfile = path.join(here, `engine-${item.name}.cjs`); checked(here); checked(outfile, true);
  const pending = path.join(here, `.${path.basename(wtBase)}-${item.name}.cjs`); checked(pending, true);
  fs.copyFileSync(item.outfile, pending, fs.constants.COPYFILE_EXCL);
  checked(pending); checked(outfile, true); fs.renameSync(pending, outfile);
}
for (const {name,head,sha,size} of built) console.log(`built ${name} @ ${head} → ${path.relative(root, path.join(here, `engine-${name}.cjs`))}  sha256=${sha}  (${size} bytes)`);
console.log("export ENGINE_MAIN=" + path.join(here, "engine-main.cjs") + " ENGINE_OLD=" + path.join(here, "engine-old.cjs"));
