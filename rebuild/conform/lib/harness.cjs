/* EARNED CONFORMANCE SUITE — harness v2.
   A LAW is { id, cite, expect: "GREEN"|"RED", run(bundle) → {ok, detail}, mutants: [{ name, make(bundle) → bundle }] }.
   The runner executes every law in THREE MODES:
     adapters  — against the product adapters (absent → NOT_IMPLEMENTED → RED(as specified); present → must be GREEN)
     reference — against the reference models (must be GREEN: the law is satisfiable and the reference conforms)
     mutants   — against each TARGETED mutant of the reference (must FAIL by ASSERTION — the law discriminates)
   VERDICTS: GREEN · FAIL · RED(as specified) · DEFECT(red law passed) · HARNESS_ERROR (an unexpected exception —
   never a pass, never a bite; Sol suite-pass-1: "Unexpected exceptions must be HARNESS_ERROR").
   INVENTORY: the observed law ids must equal the exported inventory exactly (no missing, no duplicate). */
const fs = require("node:fs");
const JP = JSON.stringify;
class NotImplemented extends Error { constructor(what) { super("NOT_IMPLEMENTED: " + what); this.notImplemented = true; } }
function canon(x) { return JSON.stringify(sortKeys(x)); }
function sortKeys(x) { if (Array.isArray(x)) return x.map(sortKeys); if (x && typeof x === "object") { const o = {}; for (const k of Object.keys(x).sort()) o[k] = sortKeys(x[k]); return o; } return x; }
function diffPaths(a, b, path = "", out = []) {   /* O(n): recurse structurally; canonicalize only at leaves */
  const isObj = (x) => x && typeof x === "object" && !Array.isArray(x);
  if (isObj(a) && isObj(b)) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diffPaths(a[k], b[k], path + "/" + k, out); return out; }
  if (Array.isArray(a) && Array.isArray(b)) { if (a.length !== b.length) { out.push({ path, golden: "[" + a.length + "]", candidate: "[" + b.length + "]" }); return out; } for (let i = 0; i < a.length; i++) diffPaths(a[i], b[i], path + "/" + i, out); return out; }
  if (canon(a) !== canon(b)) out.push({ path, golden: a, candidate: b }); return out;
}
function exec(law, bundle) {
  try { const r = law.run(bundle) || { ok: true }; return { ok: !!r.ok, detail: r.detail, kind: "assert" }; }
  catch (e) { if (e && e.notImplemented) return { ok: false, detail: String(e.message), kind: "not_implemented" }; return { ok: false, detail: "HARNESS_ERROR: " + String(e && e.stack || e).split("\n").slice(0, 2).join(" | "), kind: "exception" }; }
}
function runLaws(title, laws, opts = {}) {
  const lines = [], rows = []; const log = (s) => { lines.push(s); if (!opts.quiet) console.log(s); };
  log("== " + title);
  let green = 0, red = 0, fail = 0, defects = 0, errors = 0;
  for (const law of laws) {
    const res = exec(law, opts.bundle);
    let verdict;
    if (res.kind === "exception") verdict = "HARNESS_ERROR";
    else if (law.expect === "RED") verdict = res.ok ? "DEFECT(red law passed)" : (res.kind === "not_implemented" ? "RED(as specified)" : "RED(failing, not by NOT_IMPLEMENTED)");
    else verdict = res.ok ? "GREEN" : "FAIL";
    if (verdict === "GREEN") green++; else if (verdict === "RED(as specified)") red++; else if (verdict === "FAIL") fail++; else if (verdict === "HARNESS_ERROR") errors++; else defects++;
    rows.push({ id: law.id, verdict, cite: law.cite, detail: res.detail });
    log(`${verdict.padEnd(22)} ${law.id}  [${law.cite}]` + (res.detail ? "  — " + String(res.detail).slice(0, 300) : ""));
  }
  log(`   ${green} GREEN · ${red} RED-as-specified · ${fail} FAIL · ${defects} DEFECT · ${errors} HARNESS_ERROR`);
  if (opts.logPath) fs.appendFileSync(opts.logPath, lines.join("\n") + "\n");
  return { green, red, fail, defects, errors, rows, lines };
}
/* MUTANT DISCRIMINATION: for every law, the reference must pass and each targeted mutant must FAIL BY ASSERTION.
   A mutant that passes → WEAK. A mutant that throws → HARNESS_ERROR (the law or the mutant is broken, not a bite). */
function runMutants(title, laws, referenceBundle, opts = {}) {
  const lines = [], rows = []; const log = (s) => { lines.push(s); if (!opts.quiet) console.log(s); };
  log("== MUTANTS " + title);
  let strong = 0, weak = 0, errors = 0, refFail = 0, none = 0;
  for (const law of laws) {
    const ref = exec(law, referenceBundle);
    if (ref.kind === "exception") { errors++; rows.push({ id: law.id, verdict: "HARNESS_ERROR", detail: ref.detail }); log(`HARNESS_ERROR         ${law.id} — reference threw: ${String(ref.detail).slice(0, 200)}`); continue; }
    if (!ref.ok) { refFail++; rows.push({ id: law.id, verdict: "REFERENCE_FAIL", detail: ref.detail }); log(`REFERENCE_FAIL        ${law.id} — ${String(ref.detail).slice(0, 200)}`); continue; }
    const muts = law.mutants || []; if (!muts.length) { none++; rows.push({ id: law.id, verdict: "NO_MUTANT" }); log(`NO_MUTANT             ${law.id}`); continue; }
    const results = muts.map((m) => { let b; try { b = m.make(referenceBundle); } catch (e) { return { name: m.name, kind: "exception", detail: "mutant build threw: " + e.message }; } const r = exec(law, b); return { name: m.name, ...r }; });
    const bad = results.filter((r) => r.kind === "exception"); const passed = results.filter((r) => r.kind === "assert" && r.ok);
    let verdict; if (bad.length) { verdict = "HARNESS_ERROR"; errors++; } else if (passed.length) { verdict = "WEAK"; weak++; } else { verdict = "STRONG"; strong++; }
    rows.push({ id: law.id, verdict, mutants: results.map((r) => ({ name: r.name, caught: r.kind === "assert" && !r.ok, detail: r.detail })) });
    log(`${verdict.padEnd(22)} ${law.id}  ` + results.map((r) => `${r.kind === "exception" ? "ERR" : (r.ok ? "PASSED(weak)" : "caught")}:${r.name}`).join(" · "));
  }
  log(`   ${strong} STRONG · ${weak} WEAK · ${none} NO_MUTANT · ${refFail} REFERENCE_FAIL · ${errors} HARNESS_ERROR`);
  if (opts.logPath) fs.appendFileSync(opts.logPath, lines.join("\n") + "\n");
  return { strong, weak, errors, refFail, none, rows, lines };
}
function checkInventory(laws, expectedIds) {
  const ids = laws.map((l) => l.id); const dup = ids.filter((x, i) => ids.indexOf(x) !== i); const missing = expectedIds.filter((x) => !ids.includes(x)); const extra = ids.filter((x) => !expectedIds.includes(x));
  return { ok: !dup.length && !missing.length && !extra.length, dup, missing, extra, count: ids.length };
}
module.exports = { NotImplemented, canon, sortKeys, diffPaths, runLaws, runMutants, checkInventory, exec, JP };
