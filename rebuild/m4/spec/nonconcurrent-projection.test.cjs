'use strict';
// Standalone synthetic executable specification; NO product imports or keys.
// Default execution writes nothing. Optional: --evidence <new-output-json-path>.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const crypto = require('node:crypto'), vm = require('node:vm'), {spawnSync} = require('node:child_process');
const filename = path.join(__dirname, 'nonconcurrent-projection.cjs');
const source = fs.readFileSync(filename, 'utf8'), hash = s => crypto.createHash('sha256').update(s).digest('hex');
const M = require(filename), copy = x => JSON.parse(JSON.stringify(x));
const scope = 'MODEL-ATHLETE', planBytes = ' {"model":"UNCHANGED-ACCEPTED-PLAN","basis":"MODEL-PLAN"}\n';
const records = [];
function record(id, kind, payload, fields, device, seq, predecessor, parents) {
  const op = {op_id: id, canonical_content_commitment: 'MODEL-ONLY-COMMITMENT-' + id, athlete_id: scope,
    device_id: device, device_seq: seq, device_predecessor_op_id: predecessor, causal_parents: parents,
    class: 'session', kind, effective: {local_date: '2042-01-03', local_time: '09:00', utc_offset: '+00:00'},
    schema_version: 1, lease_id: 'MODEL-NOT-A-REAL-LEASE', ...fields, payload};
  const receipt = {op_id: id, canonical_content_commitment: op.canonical_content_commitment,
    athlete_log_seq: records.length + 1, accepted_at: 'MODEL-NOT-A-SIGNED-TIME'};
  const r = {operationBytes: ' \n' + JSON.stringify(op, null, 1) + '\n', receiptBytes: JSON.stringify(receipt)};
  records.push(r); return r;
}
const S = record('start', 'session-start', {}, {planned_split_slot_id: 'MODEL-SLOT', plan_basis: 'MODEL-PLAN'}, 'device-A', 1, null, []);
const A = record('set-A', 'session-set', {load: {value: 37, unit: 'lb'}, reps: {value: 6, unit: 'rep'}},
  {session_start_op_id: 'start', logical_set_slot: 'slot-A', lift_lineage_id: 'lineage-A'}, 'device-A', 2, 'start', ['start']);
const B = record('set-B', 'session-set', {load: {value: 23, unit: 'lb'}, reps: {value: 9, unit: 'rep'}},
  {session_start_op_id: 'start', logical_set_slot: 'slot-B', lift_lineage_id: 'lineage-B'}, 'device-B', 1, null, ['start']);
const C = record('correction-A', 'correction', {replacement_fields: {load: {value: 41, unit: 'lb'}}},
  {target_op_id: 'set-A', lift_lineage_id: 'lineage-A'}, 'device-B', 2, 'set-B', ['set-A']);
const T = record('removal-A', 'tombstone', {reason: 'Synthetic mistaken set'},
  {target_op_id: 'set-A', lift_lineage_id: 'lineage-A'}, 'device-A', 3, 'set-A', ['set-A', 'correction-A']);
const input = count => ({assumption: M.ASSUMPTION, athlete_id: scope, watermark: count, planBytes, records: copy(records.slice(0, count))});
// Handwritten expected DTOs. They do not call the reducer or inspect its output.
const originalA = {source_op_id: 'set-A', session_start_op_id: 'start', logical_set_slot: 'slot-A', lift_lineage_id: 'lineage-A',
  plan_basis: 'MODEL-PLAN', original: {load: {value: 37, unit: 'lb'}, reps: {value: 6, unit: 'rep'}},
  observations: {load: {value: 37, unit: 'lb'}, reps: {value: 6, unit: 'rep'}}, included: true,
  provenance: {source_commitment: 'MODEL-ONLY-COMMITMENT-set-A', source_log_seq: 2, correction_op_ids: [], tombstone_op_ids: []}};
const originalB = {source_op_id: 'set-B', session_start_op_id: 'start', logical_set_slot: 'slot-B', lift_lineage_id: 'lineage-B',
  plan_basis: 'MODEL-PLAN', original: {load: {value: 23, unit: 'lb'}, reps: {value: 9, unit: 'rep'}},
  observations: {load: {value: 23, unit: 'lb'}, reps: {value: 9, unit: 'rep'}}, included: true,
  provenance: {source_commitment: 'MODEL-ONLY-COMMITMENT-set-B', source_log_seq: 3, correction_op_ids: [], tombstone_op_ids: []}};
const correctedA = {...originalA, observations: {load: {value: 41, unit: 'lb'}, reps: {value: 6, unit: 'rep'}},
  provenance: {...originalA.provenance, correction_op_ids: ['correction-A']}};
const removedA = {...correctedA, included: false,
  provenance: {...correctedA.provenance, tombstone_op_ids: ['removal-A']}};
const expected = new Map([
  [3, {model: 'REVIEW_MODEL_ONLY', watermark: 3, planBytes, retained: [S, A, B], facts: [originalA, originalB]}],
  [4, {model: 'REVIEW_MODEL_ONLY', watermark: 4, planBytes, retained: [S, A, B, C], facts: [correctedA, originalB]}],
  [5, {model: 'REVIEW_MODEL_ONLY', watermark: 5, planBytes, retained: [S, A, B, C, T], facts: [removedA, originalB]}]
]);
const checks = []; let permutations = 0;
function check(id, body) { body(); checks.push(id); }
function alter(i, edit, count = 5) {
  const x = input(count), op = JSON.parse(x.records[i].operationBytes); edit(op);
  x.records[i].operationBytes = JSON.stringify(op); return x;
}
function refusal(id, x, code) {
  check(id, () => assert.throws(() => M.project(x), error => error instanceof M.Refusal && error.code === code));
}
function* orders(a) {
  if (!a.length) { yield []; return; }
  for (let i = 0; i < a.length; i++) for (const rest of orders([...a.slice(0, i), ...a.slice(i + 1)])) yield [a[i], ...rest];
}
function load(text) { const context = {module: {exports: {}}}; vm.runInNewContext(text, context, {filename, timeout: 1000}); return context.module.exports; }
const observations = model => copy(model.project(input(5)));
const start = performance.now();
try {
  for (const count of [3, 4, 5]) {
    check('EXACT-PREFIX-' + count, () => assert.deepEqual(M.project(input(count)), expected.get(count)));
    check('FRESH-PROCESS-' + count, () => {
      const child = spawnSync(process.execPath, ['-e', 'const fs=require("node:fs"),m=require(process.argv[1]);process.stdout.write(JSON.stringify(m.project(JSON.parse(fs.readFileSync(0,"utf8")))));', filename],
        {input: JSON.stringify(input(count)), encoding: 'utf8', windowsHide: true});
      assert.equal(child.status, 0); assert.equal(child.stderr, ''); assert.deepEqual(JSON.parse(child.stdout), expected.get(count));
    });
  }
  check('COMPLETE-GRAPH-PERMUTATIONS', () => {
    for (const order of orders(input(5).records)) { assert.deepEqual(M.project({...input(5), records: order}), expected.get(5)); permutations++; }
    assert.equal(permutations, 120);
  });
  check('EXACT-REPLAY-TWICE', () => { const x = input(5); x.records.push(...copy(x.records), ...copy(x.records)); assert.deepEqual(M.project(x), expected.get(5)); });
  check('INPUT-BYTES-AND-ABSENCE', () => {
    const x = input(5), before = JSON.stringify(x); const y = M.project(x);
    assert.equal(JSON.stringify(x), before); assert.equal(y.planBytes, planBytes);
    assert.equal(Object.hasOwn(y.facts[0].observations, 'reserve'), false);
    for (let i = 0; i < 5; i++) { assert.equal(y.retained[i].operationBytes, records[i].operationBytes); assert.equal(y.retained[i].receiptBytes, records[i].receiptBytes); }
  });
  refusal('ASSUMPTION-NOT-AUTH', {...input(5), assumption: 'VERIFIED-BY-NOTHING'}, 'ASSUMPTION_REQUIRED');
  refusal('MISSING-IDENTITY', alter(1, op => delete op.op_id), 'UNSUPPORTED_FIELDS');
  const different = input(5); different.records.push({...A, operationBytes: A.operationBytes + ' '});
  refusal('DUPLICATE-DIFFERENT-BYTES', different, 'IDENTITY_CONFLICT');
  refusal('FOREIGN-ATHLETE', alter(3, op => op.athlete_id = 'MODEL-OTHER-ATHLETE'), 'FOREIGN');
  refusal('PARTIAL-GRAPH', {...input(5), records: [S, A, C, T]}, 'PARTIAL_GRAPH');
  refusal('MISSING-TARGET', alter(3, op => op.target_op_id = 'missing'), 'MISSING_DEPENDENCY');
  refusal('MISSING-CAUSAL-PARENT', alter(3, op => op.causal_parents = ['missing']), 'MISSING_DEPENDENCY');
  refusal('TRANSPORT-IS-NOT-CAUSALITY', alter(3, op => { op.device_predecessor_op_id = 'set-A'; op.causal_parents = []; }), 'MISSING_CAUSAL_EDGE');
  refusal('CONCURRENT-CORRECTION-REMOVAL', alter(4, op => op.causal_parents = ['set-A']), 'UNSUPPORTED_CONFLICT');
  refusal('OPTIONAL-CLEARING-UNSPECIFIED', alter(3, op => op.payload.replacement_fields = {reserve: null}), 'UNSUPPORTED_REPLACEMENT');
  refusal('UNIT-CHANGE', alter(3, op => op.payload.replacement_fields.load.unit = 'kg'), 'UNSUPPORTED_REPLACEMENT');
  refusal('EMPTY-CORRECTION', alter(3, op => op.payload.replacement_fields = {}), 'UNSUPPORTED_REPLACEMENT');
  refusal('EMPTY-REASON', alter(4, op => op.payload.reason = ''), 'MALFORMED');
  refusal('UNKNOWN-CORRECTION-FIELD', alter(3, op => op.payload.replacement_fields.reps = {value: 7, unit: 'rep'}), 'UNSUPPORTED_REPLACEMENT');
  refusal('SET-COLLISION', alter(2, op => { op.logical_set_slot = 'slot-A'; op.lift_lineage_id = 'lineage-A'; }), 'UNSUPPORTED_CONFLICT');
  refusal('EDIT-OF-EDIT', alter(4, op => op.target_op_id = 'correction-A'), 'UNSUPPORTED_TARGET');
  const changes = [
    ['ignore-correction', 'fact.observations.load = clone(op.payload.replacement_fields.load);', 'void op.payload.replacement_fields.load;', x => assert.equal(x.facts[0].observations.load.value, 37)],
    ['delete-original', 'retained: ordered.map(row =>', 'retained: ordered.filter(row => row.op.op_id !== "set-A").map(row =>', x => assert.equal(x.retained.length, 4)],
    ['change-plan', 'planBytes: input.planBytes,', 'planBytes: "MODEL-HIDDEN-PLAN-CHANGE",', x => assert.equal(x.planBytes, 'MODEL-HIDDEN-PLAN-CHANGE')]
  ];
  const faults = [];
  for (const [id, before, after, wrong] of changes) {
    assert.equal(source.split(before).length, 2, 'unique mutation site');
    assert.deepEqual(observations(load(source)), expected.get(5));
    let disposable = source.replace(before, after); const changed = observations(load(disposable));
    wrong(changed); // The mutant MUST return the named incorrect value; throws/import errors earn nothing.
    assert.throws(() => assert.deepEqual(changed, expected.get(5)), {name: 'AssertionError'});
    disposable = disposable.replace(after, before); assert.equal(disposable, source); assert.equal(hash(disposable), hash(source));
    assert.deepEqual(observations(load(disposable)), expected.get(5));
    faults.push(id); console.log('MODEL-FAULT ' + id + ': ORIGINAL PASS / BEHAVIORAL RED / RESTORED PASS');
  }
  assert.equal(fs.readFileSync(filename, 'utf8'), source);
  const result = {status: 'REVIEW_PREPARATION_PASS', modelOnly: true, productAcceptance: false, checks, permutations, freshProcesses: 3,
    effectiveFaults: faults, sourceSha256: hash(source), testSha256: hash(fs.readFileSync(__filename)), node: process.version, elapsedMs: performance.now() - start,
    limitations: ['Authentication and complete accepted input are assumptions, not verified.', 'Identifiers, commitments, receipts, lease and schema are model-only placeholders.',
      'Only load-only correction followed by causal tombstone is covered; unsupported cases refuse.', 'Fresh Node reconstruction is not IndexedDB, crash durability or a phone test.', 'No training engine, plan writer, authority, transport or canonical implementation runs.']};
  const args = process.argv.slice(2);
  if (args.length) { assert.equal(args.length, 2); assert.equal(args[0], '--evidence'); fs.writeFileSync(path.resolve(args[1]), JSON.stringify(result, null, 2) + '\n', {flag: 'wx'}); }
  console.log(`NONCONCURRENT-PROJECTION PREPARATION: ${checks.length}/${checks.length} checks PASS; ${permutations} delivery permutations; 3 fresh processes; 3/3 effective model faults; MODEL ONLY`);
} catch (error) { console.error('NONCONCURRENT-PROJECTION PREPARATION FAIL — ' + (error.code || error.name)); process.exitCode = 1; }
