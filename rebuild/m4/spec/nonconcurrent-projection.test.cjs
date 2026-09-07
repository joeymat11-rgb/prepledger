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
const checks = []; let permutations = 0, freshProcesses = 0;
function check(id, body) { body(); checks.push(id); }
function alter(i, edit, count = 5) {
  const x = input(count), op = JSON.parse(x.records[i].operationBytes); edit(op);
  x.records[i].operationBytes = JSON.stringify(op); return x;
}
function refusal(id, x, code) {
  check(id, () => {
    const before = JSON.stringify(x);
    assert.throws(() => M.project(x), error => error instanceof M.Refusal && error.code === code);
    assert.equal(JSON.stringify(x), before);
  });
}
function* orders(a) {
  if (!a.length) { yield []; return; }
  for (let i = 0; i < a.length; i++) for (const rest of orders([...a.slice(0, i), ...a.slice(i + 1)])) yield [a[i], ...rest];
}
function load(text) { const context = {module: {exports: {}}}; vm.runInNewContext(text, context, {filename, timeout: 1000}); return context.module.exports; }
const observations = model => copy(model.project(input(5)));
function fresh(x, wanted) {
  const child = spawnSync(process.execPath, ['-e', 'const fs=require("node:fs"),m=require(process.argv[1]);process.stdout.write(JSON.stringify(m.project(JSON.parse(fs.readFileSync(0,"utf8")))));', filename],
    {input: JSON.stringify(x), encoding: 'utf8', windowsHide: true});
  assert.equal(child.status, 0); assert.equal(child.stderr, ''); assert.deepEqual(JSON.parse(child.stdout), wanted); freshProcesses++;
}
// Every original and resulting observation below is written independently of the
// overlay implementation. Only the common expected DTO scaffolding is shared.
const baseObservation = {load: {value: 37, unit: 'lb'}, reps: {value: 6, unit: 'rep'}};
const boundObservation = {...baseObservation, reserve: {tag: 'at_least', value: 3, unit: 'rep'}};
const unknownObservation = {...baseObservation, reserve: {tag: 'unknown'}};
const effortTypes = [
  ['exact-zero', {tag: 'exact', value: 0, unit: 'rep'}], ['exact-one', {tag: 'exact', value: 1, unit: 'rep'}],
  ['exact-two', {tag: 'exact', value: 2, unit: 'rep'}], ['bounded-three', {tag: 'at_least', value: 3, unit: 'rep'}],
  ['unknown', {tag: 'unknown'}], ['skipped-question', {tag: 'skipped'}], ['not-asked', {tag: 'not_asked'}]
];
const overlays = [
  ['load-keeps-bound', boundObservation, {load: {value: 41, unit: 'lb'}},
    {load: {value: 41, unit: 'lb'}, reps: {value: 6, unit: 'rep'}, reserve: {tag: 'at_least', value: 3, unit: 'rep'}}],
  ['reps-keeps-unknown', unknownObservation, {reps: {value: 7, unit: 'rep'}},
    {load: {value: 37, unit: 'lb'}, reps: {value: 7, unit: 'rep'}, reserve: {tag: 'unknown'}}],
  ['load-reps-keeps-unknown', unknownObservation, {load: {value: 41, unit: 'lb'}, reps: {value: 7, unit: 'rep'}},
    {load: {value: 41, unit: 'lb'}, reps: {value: 7, unit: 'rep'}, reserve: {tag: 'unknown'}}],
  ['load-reserve', {...baseObservation, reserve: {tag: 'exact', value: 1, unit: 'rep'}},
    {load: {value: 41, unit: 'lb'}, reserve: {tag: 'at_least', value: 3, unit: 'rep'}},
    {load: {value: 41, unit: 'lb'}, reps: {value: 6, unit: 'rep'}, reserve: {tag: 'at_least', value: 3, unit: 'rep'}}],
  ['reps-reserve', boundObservation, {reps: {value: 7, unit: 'rep'}, reserve: {tag: 'unknown'}},
    {load: {value: 37, unit: 'lb'}, reps: {value: 7, unit: 'rep'}, reserve: {tag: 'unknown'}}],
  ['all-three', unknownObservation, {load: {value: 41, unit: 'lb'}, reps: {value: 7, unit: 'rep'}, reserve: {tag: 'exact', value: 0, unit: 'rep'}},
    {load: {value: 41, unit: 'lb'}, reps: {value: 7, unit: 'rep'}, reserve: {tag: 'exact', value: 0, unit: 'rep'}}],
  ['reserve-exact-zero', baseObservation, {reserve: {tag: 'exact', value: 0, unit: 'rep'}},
    {load: {value: 37, unit: 'lb'}, reps: {value: 6, unit: 'rep'}, reserve: {tag: 'exact', value: 0, unit: 'rep'}}],
  ['reserve-exact-one', baseObservation, {reserve: {tag: 'exact', value: 1, unit: 'rep'}},
    {load: {value: 37, unit: 'lb'}, reps: {value: 6, unit: 'rep'}, reserve: {tag: 'exact', value: 1, unit: 'rep'}}],
  ['reserve-exact-two', baseObservation, {reserve: {tag: 'exact', value: 2, unit: 'rep'}},
    {load: {value: 37, unit: 'lb'}, reps: {value: 6, unit: 'rep'}, reserve: {tag: 'exact', value: 2, unit: 'rep'}}],
  ['reserve-bounded-three', baseObservation, {reserve: {tag: 'at_least', value: 3, unit: 'rep'}},
    {load: {value: 37, unit: 'lb'}, reps: {value: 6, unit: 'rep'}, reserve: {tag: 'at_least', value: 3, unit: 'rep'}}],
  ['reserve-unknown', baseObservation, {reserve: {tag: 'unknown'}},
    {load: {value: 37, unit: 'lb'}, reps: {value: 6, unit: 'rep'}, reserve: {tag: 'unknown'}}],
  ['reserve-skipped-question', baseObservation, {reserve: {tag: 'skipped'}},
    {load: {value: 37, unit: 'lb'}, reps: {value: 6, unit: 'rep'}, reserve: {tag: 'skipped'}}],
  ['reserve-not-asked', baseObservation, {reserve: {tag: 'not_asked'}},
    {load: {value: 37, unit: 'lb'}, reps: {value: 6, unit: 'rep'}, reserve: {tag: 'not_asked'}}]
];
function overlayInput(original, replacement, count) {
  const x = input(count), a = JSON.parse(x.records[1].operationBytes); a.payload = copy(original);
  x.records[1].operationBytes = JSON.stringify(a);
  if (count >= 4) { const c = JSON.parse(x.records[3].operationBytes); c.payload.replacement_fields = copy(replacement); x.records[3].operationBytes = JSON.stringify(c); }
  return x;
}
function overlayExpected(x, original, observed, count) {
  return {model: 'REVIEW_MODEL_ONLY', watermark: count, planBytes, retained: copy(x.records),
    facts: [{...originalA, original: copy(original), observations: copy(observed), included: count < 5,
      provenance: {...originalA.provenance, correction_op_ids: count >= 4 ? ['correction-A'] : [], tombstone_op_ids: count >= 5 ? ['removal-A'] : []}}, originalB]};
}
const start = performance.now();
try {
  check('COMPLETE-OBSERVATION-SUBSET-INVENTORY', () => assert.deepEqual(
    [...new Set(overlays.map(row => Object.keys(row[2]).sort().join('+')))].sort(),
    ['load', 'reps', 'reserve', 'load+reps', 'load+reserve', 'reps+reserve', 'load+reps+reserve'].sort()));
  for (const count of [3, 4, 5]) {
    check('EXACT-PREFIX-' + count, () => assert.deepEqual(M.project(input(count)), expected.get(count)));
    check('FRESH-PROCESS-' + count, () => fresh(input(count), expected.get(count)));
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
  for (const [id, reserve] of effortTypes) check('ORIGINAL-EFFORT-' + id, () => {
    const original = {...baseObservation, reserve}, x = overlayInput(original, {}, 3);
    assert.deepEqual(M.project(x), overlayExpected(x, original, original, 3));
  });
  for (const [id, original, replacement, observed] of overlays) check('OBSERVATION-OVERLAY-' + id, () => {
    for (const count of [4, 5]) {
      const x = overlayInput(original, replacement, count), wanted = overlayExpected(x, original, observed, count), before = JSON.stringify(x);
      assert.deepEqual(M.project(x), wanted); assert.equal(JSON.stringify(x), before);
      x.records.push(...copy(x.records), ...copy(x.records)); assert.deepEqual(M.project(x), wanted);
    }
  });
  for (const id of ['reps-keeps-unknown', 'reserve-bounded-three', 'all-three']) check('OVERLAY-FRESH-PROCESS-' + id, () => {
    const [, original, replacement, observed] = overlays.find(row => row[0] === id), x = overlayInput(original, replacement, 5);
    fresh(x, overlayExpected(x, original, observed, 5));
  });
  check('RICH-OVERLAY-COMPLETE-PERMUTATIONS', () => {
    const [, original, replacement, observed] = overlays.find(row => row[0] === 'all-three'), x = overlayInput(original, replacement, 5);
    const wanted = overlayExpected(x, original, observed, 5);
    for (const order of orders(x.records)) { assert.deepEqual(M.project({...x, records: order}), wanted); permutations++; }
    assert.equal(permutations, 240);
  });
  check('OVERLAY-ALIASES-DETACHED', () => {
    const x = overlayInput(boundObservation, {reps: {value: 7, unit: 'rep'}}, 4), before = JSON.stringify(x);
    const observed = {load: {value: 37, unit: 'lb'}, reps: {value: 7, unit: 'rep'}, reserve: {tag: 'at_least', value: 3, unit: 'rep'}};
    const wanted = overlayExpected(x, boundObservation, observed, 4), y = M.project(x);
    y.facts[0].observations.load.value = 999; y.facts[0].observations.reps.value = 999; y.facts[0].observations.reserve.value = 999;
    y.facts[0].provenance.correction_op_ids.push('MODEL-OUTPUT-ONLY');
    assert.deepEqual(y.facts[0].original, boundObservation); assert.deepEqual(y.facts[1], originalB);
    assert.equal(JSON.stringify(x), before); assert.deepEqual(M.project(x), wanted);
    const z = M.project(x); z.facts[0].original.reserve.tag = 'unknown'; assert.deepEqual(z.facts[0].observations, observed);
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
  refusal('UNKNOWN-CORRECTION-FIELD', alter(3, op => op.payload.replacement_fields.unknown = true), 'UNSUPPORTED_REPLACEMENT');
  refusal('EFFECTIVE-TIME-UNSUPPORTED', alter(3, op => op.payload.replacement_fields.effective = {local_date: '2042-01-04', local_time: '09:00', utc_offset: '+00:00'}), 'UNSUPPORTED_REPLACEMENT');
  refusal('REPS-UNIT-CHANGE', alter(3, op => op.payload.replacement_fields = {reps: {value: 7, unit: 'lb'}}), 'UNSUPPORTED_REPLACEMENT');
  refusal('REPS-NUMERIC-STRING', alter(3, op => op.payload.replacement_fields = {reps: {value: '7', unit: 'rep'}}), 'UNSUPPORTED_REPLACEMENT');
  refusal('LOAD-ZERO', alter(3, op => op.payload.replacement_fields.load.value = 0), 'UNSUPPORTED_REPLACEMENT');
  refusal('LOAD-MISSING-UNIT', alter(3, op => delete op.payload.replacement_fields.load.unit), 'UNSUPPORTED_REPLACEMENT');
  for (const [id, reserve] of [
    ['exact-three', {tag: 'exact', value: 3, unit: 'rep'}], ['wrong-bound', {tag: 'at_least', value: 2, unit: 'rep'}],
    ['bound-string', {tag: 'at_least', value: '3', unit: 'rep'}], ['bound-no-unit', {tag: 'at_least', value: 3}],
    ['exact-wrong-unit', {tag: 'exact', value: 0, unit: 'lb'}], ['unknown-with-number', {tag: 'unknown', value: 0}],
    ['skipped-with-unit', {tag: 'skipped', unit: 'rep'}], ['not-asked-with-number', {tag: 'not_asked', value: 0}],
    ['legacy-numeric-not-rewritten', 3], ['null-not-clearing', null], ['unknown-tag', {tag: 'guessed'}]
  ]) {
    refusal('BAD-ORIGINAL-RESERVE-' + id, alter(1, op => op.payload.reserve = reserve), 'UNSUPPORTED_SET_FIELDS');
    refusal('BAD-REPLACEMENT-RESERVE-' + id, alter(3, op => op.payload.replacement_fields = {reserve}), 'UNSUPPORTED_REPLACEMENT');
  }
  const nonfinite = alter(3, op => op.payload.replacement_fields = {reps: {value: 7, unit: 'rep'}});
  assert.equal(nonfinite.records[3].operationBytes.split('"value":7').length, 2);
  nonfinite.records[3].operationBytes = nonfinite.records[3].operationBytes.replace('"value":7', '"value":1e999');
  refusal('REPS-NONFINITE-JSON-NUMBER', nonfinite, 'UNSUPPORTED_REPLACEMENT');
  refusal('CAUSAL-SECOND-CORRECTION-UNSUPPORTED', alter(4, op => { op.kind = 'correction'; op.payload = {replacement_fields: {reps: {value: 7, unit: 'rep'}}}; }), 'UNSUPPORTED_CONFLICT');
  refusal('SET-COLLISION', alter(2, op => { op.logical_set_slot = 'slot-A'; op.lift_lineage_id = 'lineage-A'; }), 'UNSUPPORTED_CONFLICT');
  refusal('EDIT-OF-EDIT', alter(4, op => op.target_op_id = 'correction-A'), 'UNSUPPORTED_TARGET');
  const changes = [
    ['ignore-correction', 'Object.assign(fact.observations, clone(op.payload.replacement_fields));', 'void op.payload.replacement_fields;', x => assert.equal(x.facts[0].observations.load.value, 37)],
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
  const result = {status: 'REVIEW_PREPARATION_PASS', modelOnly: true, productAcceptance: false, checks, permutations, freshProcesses,
    observationOverlays: overlays.length, originalEffortVariants: effortTypes.length, replacementFieldSubsets: 7,
    effectiveFaults: faults, sourceSha256: hash(source), testSha256: hash(fs.readFileSync(__filename)), node: process.version, elapsedMs: performance.now() - start,
    limitations: ['Authentication and complete accepted input are assumptions, not verified.', 'Identifiers, commitments, receipts, lease and schema are model-only placeholders.',
      'Only one observation correction per original set followed by causal tombstone is covered; unsupported cases refuse.',
      'Reps integer/range domain and reserve prompt eligibility remain OPEN; these checks validate the explicitly proposed structure only.',
      'No legacy numeric effort conversion, clearing, effective-time/generation policy or concurrent/chained edit policy is implemented.',
      'Fresh Node reconstruction is not IndexedDB, crash durability or a phone test.', 'No training engine, plan writer, authority, transport or canonical implementation runs.']};
  const args = process.argv.slice(2);
  if (args.length) { assert.equal(args.length, 2); assert.equal(args[0], '--evidence'); fs.writeFileSync(path.resolve(args[1]), JSON.stringify(result, null, 2) + '\n', {flag: 'wx'}); }
  console.log(`NONCONCURRENT-OBSERVATION OVERLAYS: ${overlays.length}/${overlays.length} exact cases; 7/7 nonempty field subsets; ${effortTypes.length}/7 original effort variants; alias detachment PASS`);
  console.log(`NONCONCURRENT-PROJECTION PREPARATION: ${checks.length}/${checks.length} checks PASS; ${permutations} delivery permutations; ${freshProcesses} fresh processes; 3/3 effective model faults; MODEL ONLY`);
} catch (error) { console.error('NONCONCURRENT-PROJECTION PREPARATION FAIL — ' + (error.code || error.name)); process.exitCode = 1; }
