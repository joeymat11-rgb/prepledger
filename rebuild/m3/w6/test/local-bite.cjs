"use strict";
// local-bite.cjs — proves the LOCAL-ERA tests are not vacuous.
//
// Two guards are removed one at a time from a DISPOSABLE variant of
// local/local-client.mjs and the matching case must go RED. The original bytes
// are copied aside before the first mutation and restored in a finally, with the
// sha256 printed before and after so the restoration is checkable (the same
// contract as test/workout-bite.cjs).
//
//   bite 1 — the durability gate: execute() returns the T2 stage's OWN result
//            instead of the bridge's post-commit result. That is exactly the
//            defect the bridge exists to prevent (the real T2 acknowledges
//            before the transaction completes), so the mid-transaction case
//            must stop being able to see the abort.
//   bite 2 — the commit validator's sidecar check, so a derived cache claiming
//            operations the candidate does not have would reach disk.
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");

const w6 = path.resolve(__dirname, "..");
const root = path.resolve(w6, "../../..");
const target = path.join(w6, "local/local-client.mjs");
const scratch = path.join(w6, ".tmp/local-bite");
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const original = fs.readFileSync(target);
const before = sha(original);
fs.mkdirSync(scratch, { recursive: true });
// The disposable copy: if this process dies mid-bite the original is still here.
fs.writeFileSync(path.join(scratch, "local-client.mjs.orig"), original);
console.log("LOCAL BITE SOURCE — " + before);

const text = original.toString("utf8");
const BITES = [
  { name: "durability-gate", pattern: "kill mid-transaction",
    needle: "      return bridge.execute(command, args).then(result => {\n" +
      "        if (result?.state === 18) status = { state: \"restore-required\", code: result.code || \"RESTORE_UNPROVEN\" };\n" +
      "        return result;\n" +
      "      });",
    replacement: "      const running = bridge.execute(command, args); running.catch(() => {});\n" +
      "      return repository.load().then(snapshot => stage(snapshot.generation, command, args).result);" },
  { name: "sidecar-validator", pattern: "derived sidecar rides the same commit",
    needle: "    return sidecarFailure(staged.sidecar, staged.basis);",
    replacement: "    return null;" },
];
for (const bite of BITES) {
  if (text.split(bite.needle).length !== 2) throw Error("Unique bite target absent: " + bite.name);
}

function run(name, args) {
  const result = spawnSync(process.execPath, args, { cwd: root, windowsHide: true, encoding: "utf8", maxBuffer: 8e6 });
  fs.writeFileSync(path.join(scratch, name + ".log"), (result.stdout || "") + (result.stderr || ""));
  return result;
}
const failed = output => /^ℹ fail (?!0$)\d+$/m.test(output);
const outcomes = [];
try {
  for (const bite of BITES) {
    fs.writeFileSync(target, text.replace(bite.needle, bite.replacement));
    const red = run("local-bite-" + bite.name, ["--test", "--test-timeout=60000",
      "--test-name-pattern=" + bite.pattern, "rebuild/m3/w6/test/local-client.test.mjs"]);
    if (red.status !== 1 || !failed(red.stdout) || !red.stdout.includes(bite.pattern))
      throw Error("Bite did not turn the guarded case red: " + bite.name);
    outcomes.push({ bite: bite.name, pattern: bite.pattern, status: red.status });
    console.log("LOCAL BITE DETECTED — " + bite.name + " removed; \"" + bite.pattern + "\" fails as designed");
  }
} finally {
  fs.writeFileSync(target, original);
  if (!fs.readFileSync(target).equals(original)) throw Error("Byte restoration failed");
}
const after = sha(fs.readFileSync(target));
const restored = run("local-bite-restored", ["--test", "--test-timeout=60000", "rebuild/m3/w6/test/local-client.test.mjs"]);
fs.writeFileSync(path.join(scratch, "local-bite.json"),
  JSON.stringify({ sourceSha256Before: before, sourceSha256After: after, bites: outcomes, restored: restored.status }, null, 2));
if (before !== after) throw Error("Restored source sha256 differs");
if (restored.status !== 0) throw Error("Restored local client cases failed");
console.log("LOCAL BITE RESTORED PASS — " + after + "; full local client cases exit " + restored.status);
