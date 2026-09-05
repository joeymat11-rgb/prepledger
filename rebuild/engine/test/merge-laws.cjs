"use strict";
/* Run from the repository root:
     MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York ENGINE_MAIN=<verified bundle>
     node rebuild/engine/test/merge-laws.cjs

   This imports the EXACT tools/sync-laws.mjs entry point, through its existing
   PL_ENGINE seam. It runs the normal committed-seed gate, never LIB / --only /
   --explore / --mutations. All original operations, laws, applicability guards,
   carve-outs, checks and failure behavior remain unchanged. The original SHAPE
   checks still inspect frozen src/app.jsx and the original harness itself; they
   do not establish the extraction's source equivalence (a separate check).

   A frozen-reference child and two candidate-only children run independently.
   The law generator freezes Date before loading PL_ENGINE. In the native child
   only, our adapter restores the genuine Date saved at process startup BEFORE
   requiring the candidate. The injected candidate clock remains fixed. The law
   source's own Date uses all have explicit arguments. No candidate function is
   wrapped or supplied by the reference. This runner uses only public synthetic
   law worlds; it neither opens private fixtures nor forwards raw failure dumps.
*/
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const { spawnSync, execFileSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");
const REPO = path.resolve(__dirname, "../../.."), SOURCE = path.join(REPO, "tools/sync-laws.mjs");
const CANDIDATE = path.join(REPO, "rebuild/engine/oracle-shim.cjs");
const ADAPTER = path.join(__dirname, "merge-laws-adapter.mjs");
const CONTEXT = Symbol.for("measured.m2.merge-laws.test-context");
const SOURCE_BLOB = "f4166764c6fc2978f6de75dbbc70ca8c09380a0d";
const APP_BLOB = "f98671d823f0d8cd83e730cdd930afe5f5e7b628";
// All direct T function references plus every AIM.requires entry in the pinned
// law source. Requiring this whole surface prevents its optional-helper skips.
const CALLABLE = ["_fileCorr", "_replayCorrections", "_stampCorr", "buildRirSets", "deriveLastMeta",
  "deriveSighting", "exActive", "loadRungs", "mergeState", "migrate"];
const requireTrue = value => { if (!value) throw Error("merge-laws precondition or verdict failed"); };
const nativeDate = DateClass => /\[native code\]/.test(Function.prototype.toString.call(DateClass));
const dateSnapshot = () => ({ Date: globalThis.Date, now: Date.now, parse: Date.parse, UTC: Date.UTC });
const sameDate = snapshot => globalThis.Date === snapshot.Date && Date.now === snapshot.now && Date.parse === snapshot.parse && Date.UTC === snapshot.UTC;

function loadCandidate() {
  const context = globalThis[CONTEXT];
  requireTrue(context && context.side === "candidate" && nativeDate(context.NativeDate));
  requireTrue(globalThis.Date !== context.NativeDate); // original harness froze it
  if (context.mode === "native") globalThis.Date = context.NativeDate;
  const selected = dateSnapshot();
  requireTrue(context.mode === "native" ? selected.Date === context.NativeDate : selected.Date !== context.NativeDate);
  const T = require(CANDIDATE).__test;
  requireTrue(sameDate(selected));
  requireTrue(T && CALLABLE.every(name => typeof T[name] === "function"));
  requireTrue(T.SEED && typeof T.SCHEMA_V === "number" && !("records" in T));
  // Reject any reference module loaded into the candidate process, even though
  // it has no callable path here. The reference runs in a different process.
  requireTrue(!require.cache[path.resolve(process.env.ENGINE_MAIN)]);
  context.selected = selected;
  context.capabilities = true;
  return T;
}
module.exports.loadCandidate = loadCandidate;

async function child(side, mode) {
  requireTrue(side === "reference" || side === "candidate");
  requireTrue(mode === "frozen" || (side === "candidate" && mode === "native"));
  requireTrue(nativeDate(globalThis.Date) && !process.env.PL_LAWS_LIB);
  const context = { side, mode, NativeDate: globalThis.Date };
  globalThis[CONTEXT] = context;
  process.env.PL_ENGINE = side === "reference" ? path.resolve(process.env.ENGINE_MAIN) : ADAPTER;
  const laws = await import(pathToFileURL(SOURCE).href);
  requireTrue(Array.isArray(laws.LAWS) && laws.LAWS.length > 0);
  const names = laws.LAWS.map(law => law.name);
  requireTrue(names.every(name => typeof name === "string") && new Set(names).size === names.length);
  if (side === "candidate") requireTrue(context.capabilities && sameDate(context.selected));
  else requireTrue(!require.cache[CANDIDATE]);
  process.stdout.write("M2_MERGE_LAWS_PROOF " + JSON.stringify({ side, mode, names,
    capabilitySkips: 0, candidateLoadAndExecutionDateUnchanged: side === "candidate" ? sameDate(context.selected) : null,
    nativeDate: side === "candidate" ? globalThis.Date === context.NativeDate : null }) + "\n");
}

function run(side, mode, env) {
  const result = spawnSync(process.execPath, [__filename, "--child", side, mode], {
    cwd: REPO, env, encoding: "utf8", windowsHide: true, timeout: 300000, maxBuffer: 16 * 1024 * 1024,
  });
  const output = result.stdout || "";
  if (result.status !== 0 || result.error) {
    const broken = output.split(/\r?\n/).find(line => /^BROKEN-LAWS: [a-z0-9_, -]+$/.test(line));
    const verdict = output.split(/\r?\n/).find(line => /^SYNC-LAWS: \d+ violation\(s\) /.test(line));
    console.error("FAILED " + side + " " + mode);
    if (broken) console.error(broken);
    if (verdict) console.error(verdict);
    throw Error("merge-laws child failed; raw diagnostics withheld");
  }
  requireTrue(!result.stderr && !/skipped \(capability\)|^SKIP|SHAPE-DRIFT|VIOLATED/im.test(output));
  requireTrue(output.split(/\r?\n/).filter(line => line === "BROKEN-LAWS: none").length === 1);
  const summaries = [...output.matchAll(/^SYNC-LAWS: (\d+) laws hold across (\d+) committed seeds · superset exemption taken (\d+)× \(([^)]*)\) — .+$/gm)];
  const proofs = [...output.matchAll(/^M2_MERGE_LAWS_PROOF (.+)$/gm)];
  requireTrue(summaries.length === 1 && proofs.length === 1);
  const match = summaries[0], proof = JSON.parse(proofs[0][1]);
  requireTrue(proof.side === side && proof.mode === mode && proof.capabilitySkips === 0);
  requireTrue(Number(match[1]) === proof.names.length && Number(match[2]) > 0);
  if (side === "candidate") requireTrue(proof.candidateLoadAndExecutionDateUnchanged && proof.nativeDate === (mode === "native"));
  return { laws: Number(match[1]), seeds: Number(match[2]), carveFirings: Number(match[3]), carveSeeds: match[4], names: proof.names, summary: match[0] };
}

function main() {
  requireTrue(process.argv.length === 2); // no scope-reducing arguments
  requireTrue(process.env.MEASURED_TEST_NOW === "2026-09-03" && process.env.TZ === "America/New_York");
  requireTrue(process.env.ENGINE_MAIN);
  // Git's canonical text bytes: allow checkout CRLF only, no law source edits.
  const canonicalBytes = text => Buffer.from(text.replace(/\r\n/g, "\n"));
  const gitBlob = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
  requireTrue(gitBlob(canonicalBytes(fs.readFileSync(SOURCE, "utf8"))) === SOURCE_BLOB);
  requireTrue(gitBlob(canonicalBytes(fs.readFileSync(path.join(REPO, "src/app.jsx"), "utf8"))) === APP_BLOB);
  const frozen = execFileSync("git", ["show", "fe516c1:src/app.jsx"], { cwd: REPO, windowsHide: true,
    encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 8 * 1024 * 1024 });
  requireTrue(gitBlob(Buffer.from(frozen)) === APP_BLOB);
  // AGENTS' preparation builds ENGINE_MAIN from that pinned frozen source. A
  // compiled bundle's bytes also depend on entry paths and esbuild version, so
  // identify the actual PUBLIC artifact, never compare it to a machine-specific
  // package hash. migrate-full separately verifies its entire pinned required
  // census on all three raw blobs; that remains a required cumulative gate.
  const referenceSha = crypto.createHash("sha256").update(fs.readFileSync(process.env.ENGINE_MAIN)).digest("hex");
  console.log("PUBLIC REFERENCE SHA256: " + referenceSha + " (artifact identity; source pin " + APP_BLOB + ")");
  const env = { ...process.env };
  // These belong to the caller, not this test. Each child receives its one exact
  // engine; no preload/loader can silently narrow or replace the original gate.
  delete env.PL_LAWS_LIB; delete env.PL_ENGINE; delete env.NODE_OPTIONS;
  const reference = run("reference", "frozen", env);
  console.log("PASS frozen reference: " + reference.laws + " laws / " + reference.seeds + " committed seeds / 0 capability skips / " + reference.carveFirings + " superset exemptions (" + reference.carveSeeds + ")");
  console.log(reference.summary);
  for (const mode of ["frozen", "native"]) {
    const candidate = run("candidate", mode, env);
    requireTrue(JSON.stringify(candidate) === JSON.stringify(reference));
    console.log("PASS candidate " + mode + ": " + candidate.laws + " laws / " + candidate.seeds + " committed seeds / 0 capability skips; unchanged Date during load and execution; identical reference law inventory and carve-outs");
    console.log(candidate.summary);
  }
  console.log("PASS exact sync-laws source: tools/sync-laws.mjs:37 via PL_ENGINE; " + reference.laws + " named laws GREEN in both candidate Date modes");
  console.log("LAW IDS: " + reference.names.join(", "));
}

if (require.main === module) {
  (async () => {
    try {
      if (process.argv[2] === "--child") {
        requireTrue(process.argv.length === 5);
        await child(process.argv[3], process.argv[4]);
      } else main();
    } catch (_) {
      console.error("FAIL merge-laws: exact public law gate or precondition failed; raw diagnostics withheld");
      process.exitCode = 1;
    }
  })();
}
