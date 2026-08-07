// R15 — THE ENGINE IS FROZEN. Bundles tools/_engine-surface.jsx (the canonical engine
// output roster on the frozen snapshots) and byte-compares it against the committed
// baseline. Exit 0 = identical; exit 1 = an engine output moved, with the first
// diverging lines named.
//
//   node tools/engine-diff.mjs            compare (what the gate runs)
//   node tools/engine-diff.mjs --write    regenerate the baseline — ONLY when an engine
//                                         change is intended, reviewed, and shipping in
//                                         the same commit. A UI slice never writes it.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import esbuild from "esbuild";
import { ROOT, at, tmp } from "../scripts/lib.mjs";

const BASE = at("tools", "engine-baseline.json");
const outFile = tmp("engine-surface.cjs");

await esbuild.build({
  entryPoints: [at("tools", "_engine-surface.jsx")],
  bundle: true, platform: "node", jsx: "automatic",
  loader: { ".jsx": "jsx" }, outfile: outFile, absWorkingDir: ROOT, logLevel: "silent",
});
const now = execFileSync(process.execPath, [outFile], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 }).toString();

if (process.argv.includes("--write")) {
  writeFileSync(BASE, now);
  console.log("engine-baseline.json written (" + now.length + " bytes) — commit it WITH the engine change it blesses");
  process.exit(0);
}
if (!existsSync(BASE)) {
  console.error("ENGINE-DIFF — no baseline at tools/engine-baseline.json. Generate one deliberately with --write.");
  process.exit(1);
}
const base = readFileSync(BASE, "utf8");
if (now === base) {
  console.log("engine-diff: byte-identical to the frozen baseline (" + now.length + " bytes)");
  process.exit(0);
}
const a = base.split("\n"), b = now.split("\n");
let shown = 0;
console.error("ENGINE-DIFF — engine outputs MOVED. The engine is frozen through R15; a UI slice may not change what any engine function computes. First divergences:");
for (let i = 0; i < Math.max(a.length, b.length) && shown < 8; i++) {
  if (a[i] !== b[i]) { console.error("  line " + (i + 1) + "\n    baseline: " + (a[i] || "<absent>").slice(0, 160) + "\n    current:  " + (b[i] || "<absent>").slice(0, 160)); shown++; }
}
console.error("If this change is INTENDED engine work: it does not belong in a UI slice — file it separately, and regenerate with --write in that commit.");
process.exit(1);
