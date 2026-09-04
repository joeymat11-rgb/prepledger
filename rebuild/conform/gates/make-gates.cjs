/* gates/make-gates.cjs — writes MACHINE-READABLE GATE ARTIFACTS for every SEPARATELY_GATED obligation (Sol suite-pass-2
   finding 3): {gate, result, inputs[{path, sha256}], impl{path, sha256}, clock, tz, generated_at}. The runner verifies
   each artifact against the files in gates/inputs (hashes) and parses the result; a mismatch or a non-passing result
   fails the run. Re-run this only when a rig or its input text changes (the artifact then changes too). */
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const IN = path.join(__dirname, "inputs"); const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const rel = (p) => path.relative(path.join(__dirname, ".."), p);
const gates = [];
const RIGS = { 175: "appendix v1.27 (frontier, receipts, collision components, D14_INPUT_STATE_CHANGED precedence, least-id answer)", 176: "appendix v1.28 (Sol pass 27)", 177: "appendix v1.30 (Sol pass 29: replay split, component_scope_current, count-neutral copy)", 178: "appendix v1.31 (Sol pass 30: stranded group, route stamp, selector population)", 179: "appendix v1.32 (Sol pass 31: content replay behind the door, historical principal vs disclosure)", 180: "appendix v1.33 / Protocol (Sol pass 32: replay partition, oracle, contract alias)", 181: "appendix v1.33 (Sol pass 32: new_submission_authorized, linearization, axes, envelope)", 182: "appendix v1.34 (Sol pass 33: stub before the door, incarnations, presence defect, release vs revocation)", 183: "appendix v1.35 (Sol pass 34: producer_key, fixed deadline, three-stage validation, emission identity)", 184: "appendix v1.37 A1 + PROTOCOL v1.1 B1–B3 (Sol pass 35: instance-id reuse defect, response attempts, leakage by path, clause coverage)" };
for (const [n, desc] of Object.entries(RIGS)) {
  const cjs = path.join(IN, `rig${n}.cjs`), log = path.join(IN, `rig${n}.log`); if (!fs.existsSync(cjs) || !fs.existsSync(log)) continue;
  const text = fs.readFileSync(log, "utf8"); const m = /(\d+) passed, (\d+) failed/.exec(text) || /rig\d+: (\d+)\/(\d+)/.exec(text); const passed = m ? +m[1] : null; const total = m ? (/passed/.test(m[0]) ? +m[1] + +m[2] : +m[2]) : null;
  const inputs = [{ path: rel(log), sha256: sha(log) }]; if (n === "184") { for (const f of ["EARNED-SOURCE-INGESTION-PROTOCOL-v1.1.txt", "EARNED-RUNTIME-SHEET-v1.7.38.txt"]) inputs.push({ path: rel(path.join(IN, f)), sha256: sha(path.join(IN, f)) }); }
  gates.push({ gate: `rig${n}`, covers: desc, result: { passed, total, pass: passed != null && passed === total }, inputs, impl: { path: rel(cjs), sha256: sha(cjs) }, clock: "2026-09-03", tz: "America/New_York", generated_at: new Date().toISOString() });
}
fs.writeFileSync(path.join(__dirname, "gates.json"), JSON.stringify({ gatesVersion: 1, gates }, null, 1));
console.log("gates written:", gates.map((g) => g.gate + " " + g.result.passed + "/" + g.result.total).join(" · "));
