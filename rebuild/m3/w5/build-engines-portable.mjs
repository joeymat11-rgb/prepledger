// Windows counterpart to the frozen build-engines.mjs. Original command first:
// it fails with ERR_UNSUPPORTED_ESM_URL_SCHEME (absolute C: import) on Windows.
// Identical frozen source blobs, entry and compiler settings; portable URL/path
// handling. Export only public src/ + fixed clock blobs, with no ledger checkout
// and no removal/reuse of somebody else's temporary worktree.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const [rootArgument, ...rest] = process.argv.slice(2);
if (!rootArgument || rest.some(value => !value.startsWith("dependencies="))) {
  console.error("usage: node rebuild/m3/w5/build-engines-portable.mjs <repo root> [dependencies=<root with node_modules>]");
  process.exit(2);
}
const root = path.resolve(rootArgument);
const dependencies = path.resolve(rest.find(value => value.startsWith("dependencies="))?.slice("dependencies=".length) || root);
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const esbuildManifest = JSON.parse(fs.readFileSync(path.join(dependencies, "node_modules/esbuild/package.json"), "utf8"));
if (esbuildManifest.version !== packageJson.devDependencies.esbuild) throw new Error("esbuild version differs from the repository pin");
const esbuild = (await import(pathToFileURL(path.join(dependencies, "node_modules/esbuild/lib/main.js")).href)).default;
const outputRoot = path.join(root, "rebuild/conform/engines");
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "earned-w5-engine-blobs-"));
const git = args => execFileSync("git", ["-C", root, ...args], { maxBuffer: 8 * 1024 * 1024 });
fs.mkdirSync(outputRoot, { recursive: true });
for (const [name, commit] of Object.entries({ main: "fe516c1", old: "a0009c3" })) {
  const head = git(["rev-parse", "--short", commit + "^{commit}"]).toString("utf8").trim();
  const checkout = path.join(temporaryRoot, name);
  fs.mkdirSync(checkout);
  const files = git(["ls-tree", "-r", "--name-only", commit, "--", "src/", "tools/_fixed-now.mjs"]).toString("utf8").trim().split(/\r?\n/);
  for (const file of files) {
    const destination = path.resolve(checkout, file), relative = path.relative(checkout, destination);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Source path escapes the disposable build directory");
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, git(["show", commit + ":" + file]));
  }
  const entry = path.join(checkout, "tools/_engine-entry.mjs");
  fs.writeFileSync(entry, 'import "./_fixed-now.mjs";\nimport { __test } from "../src/app.jsx";\nexport { __test };\n');
  const outfile = path.join(outputRoot, `engine-${name}.cjs`);
  await esbuild.build({ entryPoints: [entry], bundle: true, platform: "node", format: "cjs", jsx: "automatic", loader: { ".jsx": "jsx" },
    outfile, absWorkingDir: checkout, nodePaths: [path.join(dependencies, "node_modules")], logLevel: "error" });
  const bytes = fs.readFileSync(outfile), hash = createHash("sha256").update(bytes).digest("hex");
  console.log(`built ${name} @ ${head} → ${path.relative(root, outfile)}  sha256=${hash}  (${bytes.length} bytes)`);
}
console.log("export ENGINE_MAIN=" + path.join(outputRoot, "engine-main.cjs") + " ENGINE_OLD=" + path.join(outputRoot, "engine-old.cjs"));
