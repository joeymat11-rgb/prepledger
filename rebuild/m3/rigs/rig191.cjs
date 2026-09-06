"use strict";
const fs = require("node:fs"), os = require("node:os"), path = require("node:path"), crypto = require("node:crypto");
const { laws, runMapped } = require("./sheet-a-async.cjs");
const authorityRoot = path.resolve(__dirname, "../../authority");
const publicCryptoPath = path.resolve(__dirname, "../w5/crypto.cjs");
const law = prefix => {
  const found = laws.filter(item => item.id.startsWith(prefix));
  if (found.length !== 1) throw new Error("Mutation law selector is ambiguous: " + prefix);
  return found[0].id;
};
const breaks = [
  { name: "replay-append", file: "admit.cjs", law: law("A1-replay-same-op-id"),
    before: 'if (known && known.commitment === op.canonical_content_commitment && known.disposition.status !== "WAITING") return known.disposition;',
    after: 'if (known && known.commitment === op.canonical_content_commitment && known.disposition.status !== "WAITING") { const again = store.transaction(athlete, tx => { const state = tx.get("metadata", "state"), seq = state.seq + 1; tx.insert("log", String(seq), { seq, op, accepted_at: now() }); tx.put("metadata", "state", { ...state, seq }); return { ...known.disposition, athlete_log_seq: seq }; }); return again.ok ? again.value : { status: "UNAVAILABLE", retry: true }; }' },
  { name: "identity-collision", file: "admit.cjs", law: law("A1-same-op-id-different"),
    before: 'if (known.commitment !== op.canonical_content_commitment) return signed(op, "REJECTED", { rejection_code: "IDENTITY_COLLISION" });',
    after: 'if (known.commitment !== op.canonical_content_commitment) return signed(op, "ACCEPTED", { athlete_log_seq: known.disposition.athlete_log_seq });' },
  { name: "sequence-reuse", file: "admit.cjs", law: law("A2-device-seq-reuse"),
    before: 'if (occupied && occupied.op_id !== op.op_id) return reject(tx, op, "DEVICE_SEQ_REUSE");',
    after: 'if (false && occupied && occupied.op_id !== op.op_id) return reject(tx, op, "DEVICE_SEQ_REUSE");' },
  { name: "foreign-reference", file: "admit.cjs", law: law("A2-a-KNOWN-cross-athlete"),
    before: 'if (!parent && tx.owners(ref).some(owner => owner !== athlete)) return reject(tx, op, "CROSS_ATHLETE_REFERENCE");',
    after: 'if (!parent && tx.owners(ref).some(owner => owner !== athlete)) continue;' },
  { name: "rejected-parent-waiting", file: "admit.cjs", law: law("A2-child-of-a-terminally"),
    before: 'if (parent && ["REJECTED", "REJECTED_DEPENDENCY"].includes(parent.disposition.status)) return reject(tx, op, "REJECTED_DEPENDENCY", "REJECTED_DEPENDENCY");',
    after: 'if (parent && ["REJECTED", "REJECTED_DEPENDENCY"].includes(parent.disposition.status)) { pending = true; continue; }' },
  { name: "lineage-ordering", file: "plan.cjs", law: law("A-state-4-lineage-key-ordering"),
    before: 'function compareKeys(left, right) {',
    after: 'function compareKeys(left, right) { return String(left) < String(right) ? -1 : String(left) > String(right) ? 1 : 0;' },
  { name: "stale-basis", file: "plan.cjs", law: law("A-state-4-a-STALE"),
    before: 'if (op.seen_conflict_basis !== basis(detail.domain, domain.maxima)) return {',
    after: 'if (false && op.seen_conflict_basis !== basis(detail.domain, domain.maxima)) return {' },
  { name: "unsigned-disposition", file: "public-crypto.cjs", law: law("A-every-disposition"),
    before: 'api["sign" + suffix] = (record, key) => ({ ...record, [field]: signatureOver(record, key, domain, field) });',
    after: 'api["sign" + suffix] = (record, key) => ({ ...record, [field]: kind === "disposition" ? "" : signatureOver(record, key, domain, field) });' },
  { name: "unpinned-export", file: "reduce.cjs", law: law("A-state-16-export"),
    before: 'const W = frontier(tx), pending = options.outboxPending || 0;',
    after: 'const W = 0, pending = options.outboxPending || 0;' },
  { name: "ignored-lease-expiry", file: "committer.cjs", law: law("A2-lease-TIME-expiry"),
    before: 'if (highWater > end) return refused("expired");',
    after: 'if (false && highWater > end) return refused("expired");' },
];
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
async function runRig191({ makeHarness, quiet = false }) {
  if (typeof makeHarness !== "function") throw new TypeError("A real local D1 harness factory is required");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "earned-w5-rig191-"));
  const original = new Map([...fs.readdirSync(authorityRoot).filter(name => name.endsWith(".cjs")).map(name => [path.join(authorityRoot, name), sha(fs.readFileSync(path.join(authorityRoot, name)))]), [publicCryptoPath, sha(fs.readFileSync(publicCryptoPath))]]);
  const rows = [];
  for (const item of breaks) {
    const root = path.join(directory, item.name), copy = path.join(root, "authority");
    fs.cpSync(authorityRoot, copy, { recursive: true });
    const cryptoPath = path.join(root, "public-crypto.cjs");
    // The boundary's canonical dependency stays the same frozen product bytes.
    const boundary = fs.readFileSync(publicCryptoPath, "utf8").replace('require("../../authority/canonical.cjs")', 'require(' + JSON.stringify(path.join(copy, "canonical.cjs")) + ')');
    fs.writeFileSync(cryptoPath, boundary);
    const target = item.file === "public-crypto.cjs" ? cryptoPath : path.join(copy, item.file);
    const before = fs.readFileSync(target, "utf8");
    if (before.split(item.before).length !== 2) throw new Error("Mutation anchor must match once: " + item.name);
    const after = before.replace(item.before, item.after);
    async function runCopy() {
      let harness;
      try {
        // Fresh loader and isolated D1 for both control and mutation. The
        // control exercises the exact same disposable paths and fixture setup.
        harness = await makeHarness({ authorityRoot: copy, cryptoPath });
        const result = await runMapped(harness.bundle, { ids: [item.law], quiet: true });
        return result.total === 1 && result.rows[0].id === item.law ? result.rows[0] : null;
      } finally { if (harness) await harness.close(); }
    }
    const baseline = await runCopy();
    const baselineGreen = !!baseline && baseline.kind === "assert" && baseline.ok;
    if (!quiet) console.log(`RIG191 BASELINE ${baselineGreen ? "GREEN" : "FAIL"} ${item.name}`);
    let witness = null;
    if (baselineGreen) {
      fs.writeFileSync(target, after);
      witness = await runCopy();
    }
    // A failed control, inert mutation, exception or missing assertion earns
    // nothing. A point requires the same copied layout to change GREEN -> RED.
    const effective = baselineGreen && sha(before) !== sha(after) && !!witness && witness.kind === "assert" && !witness.ok;
    rows.push({ name: item.name, effective, law: item.law, baseline: baselineGreen ? "GREEN" : "FAIL",
      verdict: !baselineGreen ? "BASELINE_FAIL" : witness && (witness.kind === "exception" ? "HARNESS_ERROR" : witness.ok ? "GREEN" : "RED"),
      detail: !baselineGreen ? baseline && baseline.detail : witness && witness.detail });
    const row = rows[rows.length - 1];
    if (!quiet) console.log(`RIG191 ${row.effective ? "EFFECTIVE" : "FAIL"} ${row.name} ${row.verdict}`);
  }
  for (const [filename, expected] of original) if (sha(fs.readFileSync(filename)) !== expected) throw new Error("Rig191 changed a product source outside its disposable copy");
  const effective = rows.filter(row => row.effective).length;
  if (!quiet) console.log(`RIG191 ${effective === 10 ? "PASS" : "FAIL"} ${effective}/10 EFFECTIVE breaks`);
  return { ok: effective === 10, effective, total: 10, rows };
}
module.exports = { runRig191, breaks };
if (require.main === module) require("./run.cjs").main(["--case", "AUTH-D1", "--env", "local"]).catch(error => { console.error("AUTH-D1 FAIL " + error.message); process.exitCode = 1; });
