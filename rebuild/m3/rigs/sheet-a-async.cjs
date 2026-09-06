"use strict";
// The frozen laws remain the oracle. These tracked wrappers await each D1
// crossing, including reads inside assertions and sequential array callbacks.
// Signature/local-capability checks remain on the public verification side.
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const filename = path.resolve(__dirname, "../../conform/laws/sheet-A-authority.cjs");
const source = fs.readFileSync(filename, "utf8").replace(/\r\n/g, "\n");
const frozenSha256 = "6a3452fd560624f07e7eb6f95439f8d28b8191c6c41f94a406da27ee301846af";
if (crypto.createHash("sha256").update(source).digest("hex") !== frozenSha256)
  throw new Error("Frozen authority law source changed; re-audit the async mapping");
const frozen = require(filename);
const { JP, canon } = require("../../conform/lib/harness.cjs");
const O = require("../../conform/lib/ops.cjs");
const ATH = () => ({ athletes: { "ath-1": { devices: { "dev-A": { lease: O.lease("dev-A") }, "dev-B": { lease: O.lease("dev-B") } } }, "ath-2": { devices: { "dev-C": { lease: O.lease("dev-C") } } } } });
const mk = (B, cfg) => B.authority(cfg || ATH());
const W = (n, extra) => O.build({ op_id: "op-w" + n, device_id: "dev-A", device_seq: n, pred: n > 1 ? "op-w" + (n - 1) : null, payload: { lb: { value: 160 - n * 0.2, unit: "lb" }, source: "athlete" }, effective: { local_date: "2026-09-0" + n, local_time: "07:05", utc_offset: "-04:00" }, ...(extra || {}) });
const PE = (id, seq, dev, plan, extra) => O.build({ op_id: id, device_id: dev || "dev-A", device_seq: seq, kind: "plan-mutation", class: "plan", payload: null, plan: plan || {}, ...(extra || {}) });
async function serialMap(values, fn) { const out = []; for (let i = 0; i < values.length; i++) out.push(await fn(values[i], i)); return out; }

// Balanced call spans, rather than a replacement that can move await outside a
// member access such as a.log(...)[0]. The source hash makes this finite mapping
// fail closed if the frozen sheet acquires a new callback shape.
function closingParen(text, open) {
  let depth = 0, quote = null;
  for (let i = open; i < text.length; i++) {
    const ch = text[i];
    if (quote) { if (ch === "\\") i++; else if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    if (ch === "(" ) depth++;
    if (ch === ")" && --depth === 0) return i;
  }
  throw new Error("Unbalanced call in async law mapping");
}
function mappedSource(fn) {
  let text = fn.toString();
  text = "async " + text;
  text = text.replace('[1, 2, 3].map((i) => a.admit("ath-1", W(i)))', 'await serialMap([1, 2, 3], async (i) => a.admit("ath-1", W(i)))');
  text = text.replace('cases.map(([n, op]) => [n, a.admit("ath-1", op)])', 'await serialMap(cases, async ([n, op]) => [n, a.admit("ath-1", op)])');
  if (text.includes('].map((op) => a.admit("ath-1", op))')) {
    text = text.replace('const good = [', 'const good = await serialMap([');
    text = text.replace('].map((op) => a.admit("ath-1", op))', '], async (op) => a.admit("ath-1", op))');
  }
  text = text.replace('const iss = (id, extra) =>', 'const iss = async (id, extra) =>');
  text = text.replace('const run = (order) =>', 'const run = async (order) =>');
  const calls = /\b(?:a|af)\.([A-Za-z]+)\s*\(|\b(mk|iss|run)\s*\(/g;
  const inserts = [];
  for (const match of text.matchAll(calls)) {
    if (match[1] === "verifyDisposition") continue;
    const open = match.index + match[0].lastIndexOf("(");
    inserts.push({ at: match.index, value: "(await " }, { at: closingParen(text, open) + 1, value: ")" });
  }
  inserts.sort((a, b) => b.at - a.at);
  for (const edit of inserts) text = text.slice(0, edit.at) + edit.value + text.slice(edit.at);
  return text;
}
const laws = frozen.laws.map(law => {
  const mapped = mappedSource(law.run);
  const run = new Function("mk", "ATH", "W", "PE", "O", "JP", "canon", "serialMap", "return (" + mapped + ");")(mk, ATH, W, PE, O, JP, canon, serialMap);
  return { id: law.id, cite: law.cite, run, mappedSource: mapped };
});
if (laws.length !== 34 || JSON.stringify(laws.map(l => l.id)) !== JSON.stringify(frozen.INVENTORY))
  throw new Error("Authority mapping inventory mismatch");

async function runMapped(bundle, options = {}) {
  const rows = [];
  for (const law of laws.filter(l => !options.ids || options.ids.includes(l.id))) {
    let row;
    try { const result = await law.run(bundle); row = { id: law.id, ok: result.ok === true, kind: "assert", detail: result.detail }; }
    catch (error) { row = { id: law.id, ok: false, kind: "exception", detail: error.message }; }
    if (bundle.afterLaw) await bundle.afterLaw();
    rows.push(row);
    if (!options.quiet) console.log(`AUTH-LAW ${row.ok ? "GREEN" : row.kind === "exception" ? "HARNESS_ERROR" : "RED"} ${row.id}`);
  }
  return { rows, green: rows.filter(r => r.ok).length, errors: rows.filter(r => r.kind === "exception").length, total: rows.length };
}
module.exports = { laws, INVENTORY: frozen.INVENTORY, runMapped, frozenSha256, ATH, W, PE, O };
