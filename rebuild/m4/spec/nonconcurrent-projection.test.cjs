'use strict';
// Synthetic executable specification; only the unchanged, pinned candidateEdge
// relation is imported from product code. No keys, decoder or product writes.
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
function startClassifierCases() {
  const relationFile = path.resolve(__dirname, '../../client/session.cjs');
  const relationSha = 'dcc1c0c77fa42fbd6a8751b9d118164e2b24ff54560802bf10315983fb8b43c3';
  // Pin before import. A changed product helper must not silently bless a new
  // relation. The old diagnostic manifest and its execution remain untouched.
  assert.equal(hash(fs.readFileSync(relationFile)), relationSha);
  const candidateEdge = require(relationFile).candidateEdge;
  const classify = M.createStartClassifier(candidateEdge), ids = [], faults = [];
  let permutations = 0, freshProcesses = 0;
  const test = (id, fn) => { fn(); ids.push(id); };
  const startView = (id, date, time, slot = 'AD_HOC') => ({id, athlete: scope, device: 'MODEL-DEVICE-' + id,
    live: true, eligible: true, relation: {slot, date, time},
    source: {opId: id, commitment: 'MODEL-ONLY-COMMITMENT-' + id, schemaVersion: 1,
      operationBytes: ' \n{"modelOriginalStart":"' + id + '"}\n', receiptBytes: '{"modelReceipt":"' + id + '"}', planBasis: planBytes}});
  const snapshot = starts => ({complete: true, supported: true, ruleVersion: 'MODEL-RULE-1', normalizerVersion: 'MODEL-NORMALIZER-1', starts: copy(starts)});
  const transition = (before, after, cause = 'START_TRANSITION') => ({assumption: M.START_ASSUMPTION, athlete: scope, cause,
    before: snapshot(before), after: snapshot(after)});
  const a = startView('A', '2042-01-03', '23:30'), b = startView('B', '2042-01-04', '00:30');
  const c = startView('C', '2042-01-04', '00:45'), d = startView('D', '2042-01-10', '09:00', 'MODEL-UNRELATED');
  const changedC = copy(c); changedC.relation.time = '02:00';
  const edgeInput = transition([a, b, c, d], [a, b, changedC, d]);
  // Expected components/edges/reasons are handwritten, never computed by the
  // classifier or candidateEdge. This helper formats those explicit vectors.
  const view = (groups, edges, ruleVersion = 'MODEL-RULE-1', normalizerVersion = 'MODEL-NORMALIZER-1') =>
    ({ruleVersion, normalizerVersion, components: groups.map(members => ({key: JSON.stringify(members), members})), edges});
  const wanted = (before, after, affectedLineages, unchanged) => ({model: 'REVIEW_CLASSIFIER_ONLY', inputQualification: 'ASSUMPTION_ONLY',
    before, after, affectedLineages, unchangedComponents: unchanged.map(members => ({key: JSON.stringify(members), members}))});
  const full = view([['A', 'B', 'C'], ['D']], [['A', 'B'], ['A', 'C'], ['B', 'C']]);
  const fewerEdges = view([['A', 'B', 'C'], ['D']], [['A', 'B'], ['B', 'C']]);
  const edgeExpected = wanted(full, fewerEdges, [{members: ['A', 'B', 'C'], before: [['A', 'B', 'C']],
    after: [['A', 'B', 'C']], reasons: ['EDGE_REMOVED', 'RELATION_INPUT']}], [['D']]);
  const exact = (id, x, expected) => test(id, () => {
    const original = JSON.stringify(x); assert.deepEqual(classify(x), expected); assert.equal(JSON.stringify(x), original);
  });
  const refuse = (id, x, code) => test(id, () => {
    const original = JSON.stringify(x);
    assert.throws(() => classify(x), error => error instanceof M.Refusal && error.code === code);
    assert.equal(JSON.stringify(x), original);
  });
  exact('C1-SAME-MEMBERS-DIFFERENT-COMPLETE-EDGES', edgeInput, edgeExpected);
  exact('C1-EXACT-REPLAY-NO-TRANSITION', transition([a, b, c, d], [a, b, c, d]), wanted(full, full, [], [['A', 'B', 'C'], ['D']]));
  exact('C1-UNRELATED-READING-DOES-NOT-ADVANCE-STARTS', transition([a, b, c, d], [a, b, c, d], 'UNRELATED'),
    wanted(full, full, [], [['A', 'B', 'C'], ['D']]));
  exact('C1-SET-DISPLAY-DOES-NOT-REMAP-START', transition([a, b, c, d], [a, b, c, d], 'SET_DISPLAY_ONLY'),
    wanted(full, full, [], [['A', 'B', 'C'], ['D']]));
  refuse('C1-SET-DISPLAY-CANNOT-SMUGGLE-START-CHANGE', {...edgeInput, cause: 'SET_DISPLAY_ONLY'}, 'UNRELATED_START_CHANGE');
  refuse('C1-UNRELATED-CANNOT-SMUGGLE-START-CHANGE', {...edgeInput, cause: 'UNRELATED'}, 'UNRELATED_START_CHANGE');
  const ineligibleC = copy(c); ineligibleC.eligible = false;
  exact('C1-ELIGIBILITY-CHANGES-BUT-LIVE-VERTEX-REMAINS', transition([a, b, c, d], [a, b, ineligibleC, d]),
    wanted(full, full, [{members: ['A', 'B', 'C'], before: [['A', 'B', 'C']], after: [['A', 'B', 'C']], reasons: ['ELIGIBILITY']}], [['D']]));
  const removedC = copy(c); removedC.live = false;
  const split = view([['A', 'B'], ['D']], [['A', 'B']]);
  exact('C1-REMOVAL-SPLIT-RETAINS-ORIGINAL', transition([a, b, c, d], [a, b, removedC, d]),
    wanted(full, split, [{members: ['A', 'B', 'C'], before: [['A', 'B', 'C']], after: [['A', 'B']], reasons: ['EDGE_REMOVED', 'LIVENESS']}], [['D']]));
  exact('C1-REJOIN-IS-A-RELEVANT-TRANSITION-NOT-OLD-ANSWER', transition([a, b, removedC, d], [a, b, c, d]),
    wanted(split, full, [{members: ['A', 'B', 'C'], before: [['A', 'B']], after: [['A', 'B', 'C']], reasons: ['EDGE_ADDED', 'LIVENESS']}], [['D']]));
  const pairBefore = [a, b, c, d].map((x, i) => ({...copy(x), relation: {slot: i < 2 ? 'X' : 'Y', date: '2042-01-03', time: '09:00'}}));
  const pairAfter = copy(pairBefore); pairAfter[1].relation.slot = 'Y'; pairAfter[2].relation.slot = 'X';
  exact('C1-BEFORE-AFTER-TRANSITIVE-LINEAGE-UNION', transition(pairBefore, pairAfter),
    wanted(view([['A', 'B'], ['C', 'D']], [['A', 'B'], ['C', 'D']]), view([['A', 'C'], ['B', 'D']], [['A', 'C'], ['B', 'D']]),
      [{members: ['A', 'B', 'C', 'D'], before: [['A', 'B'], ['C', 'D']], after: [['A', 'C'], ['B', 'D']],
        reasons: ['EDGE_ADDED', 'EDGE_REMOVED', 'RELATION_INPUT']}], []));
  exact('C1-LATE-COMPATIBLE-START', transition([a, b, d], [a, b, c, d]),
    wanted(split, full, [{members: ['A', 'B', 'C'], before: [['A', 'B']], after: [['A', 'B', 'C']], reasons: ['EDGE_ADDED', 'START_ADDED']}], [['D']]));
  for (const field of ['ruleVersion', 'normalizerVersion']) {
    const x = transition([a, b, c, d], [a, b, c, d], 'VERSION_ACTIVATION'); x.after[field] += '-NEXT';
    const afterView = copy(full); afterView[field] += '-NEXT';
    exact('C1-VERSION-CHANGE-' + field, x, wanted(full, afterView,
      [{members: ['A', 'B', 'C'], before: [['A', 'B', 'C']], after: [['A', 'B', 'C']], reasons: ['VERSION']},
        {members: ['D'], before: [['D']], after: [['D']], reasons: ['VERSION']}], []));
    refuse('C1-VERSION-NEEDS-EXPLICIT-ACTIVATION-' + field, {...x, cause: 'START_TRANSITION'}, 'VERSION_ACTIVATION_REQUIRED');
  }
  test('C1-PROPERTY-ORDER-IS-NOT-A-TRANSITION', () => {
    const x = transition([a, b, c, d], [a, b, c, d]);
    for (const row of x.after.starts) {
      row.relation = Object.fromEntries(Object.entries(row.relation).reverse());
      row.source = Object.fromEntries(Object.entries(row.source).reverse());
    }
    assert.deepEqual(classify(x), wanted(full, full, [], [['A', 'B', 'C'], ['D']]));
  });
  test('C1-DELIVERY-ORDER-INDEPENDENT', () => {
    for (const oldOrder of orders(edgeInput.before.starts)) for (const newOrder of orders(edgeInput.after.starts)) {
      const x = {...edgeInput, before: {...edgeInput.before, starts: oldOrder}, after: {...edgeInput.after, starts: newOrder}};
      assert.deepEqual(classify(x), edgeExpected); permutations++;
    }
  });
  test('C1-FRESH-PROCESS-RECONSTRUCTION', () => {
    const code = 'const fs=require("node:fs"),c=require("node:crypto");if(c.createHash("sha256").update(fs.readFileSync(process.argv[2])).digest("hex")!==process.argv[3])throw Error("RELATION_PIN");const m=require(process.argv[1]),r=require(process.argv[2]).candidateEdge;process.stdout.write(JSON.stringify(m.createStartClassifier(r)(JSON.parse(fs.readFileSync(0,"utf8")))));';
    const child = spawnSync(process.execPath, ['-e', code, filename, relationFile, relationSha],
      {input: JSON.stringify(edgeInput), encoding: 'utf8', windowsHide: true});
    assert.equal(child.status, 0); assert.equal(child.stderr, ''); assert.deepEqual(JSON.parse(child.stdout), edgeExpected); freshProcesses++;
  });
  test('C1-RESULT-ALIASES-DETACHED', () => {
    const before = JSON.stringify(edgeInput), y = classify(edgeInput);
    y.affectedLineages[0].members[0] = 'MODEL-OUTPUT-ONLY'; y.before.edges[0][0] = 'MODEL-OUTPUT-ONLY';
    assert.equal(JSON.stringify(edgeInput), before); assert.deepEqual(classify(edgeInput), edgeExpected);
  });
  const delimited = [startView('a|b', '2042-01-03', '09:00', 'X'), startView('c', '2042-01-03', '09:00', 'X'),
    startView('a', '2042-01-03', '09:00', 'Y'), startView('b|c', '2042-01-03', '09:00', 'Y')];
  const distinct = view([['a', 'b|c'], ['a|b', 'c']], [['a', 'b|c'], ['a|b', 'c']]);
  exact('C1-FULL-ARRAY-IDENTITY-NO-DELIMITER-COLLISION', transition(delimited, delimited), wanted(distinct, distinct, [], [['a', 'b|c'], ['a|b', 'c']]));
  for (const [id, mutate, code] of [
    ['MISSING-PROVENANCE', x => { delete x.after.starts[0].source.receiptBytes; }, 'NORMALIZATION_BLOCKED'],
    ['CHANGED-ORIGINAL-BYTES', x => { x.after.starts[0].source.operationBytes += ' '; }, 'START_PROVENANCE_CHANGED'],
    ['CHANGED-RECEIPT-BYTES', x => { x.after.starts[0].source.receiptBytes += ' '; }, 'START_PROVENANCE_CHANGED'],
    ['CHANGED-ACCEPTED-PLAN-BASIS', x => { x.after.starts[0].source.planBasis += ' '; }, 'START_PROVENANCE_CHANGED'],
    ['MISSING-RETAINED-START', x => { x.after.starts.pop(); }, 'MISSING_RETAINED_START'],
    ['DUPLICATE-IDENTITY', x => { x.after.starts.push(copy(x.after.starts[0])); }, 'START_IDENTITY_CONFLICT'],
    ['FOREIGN-ATHLETE', x => { x.after.starts[0].athlete = 'MODEL-OTHER'; }, 'NORMALIZATION_BLOCKED'],
    ['PARTIAL-INPUT', x => { x.after.complete = false; }, 'NORMALIZATION_BLOCKED'],
    ['UNSUPPORTED-NORMALIZER', x => { x.after.supported = false; }, 'NORMALIZATION_BLOCKED'],
    ['MISSING-VERSION', x => { delete x.after.normalizerVersion; }, 'NORMALIZATION_BLOCKED'],
    ['MISSING-TIME-NO-CLOCK-DEFAULT', x => { delete x.after.starts[0].relation.time; }, 'NORMALIZATION_BLOCKED'],
    ['MALFORMED-DATE', x => { x.after.starts[0].relation.date = '2042-02-30'; }, 'NORMALIZATION_BLOCKED'],
    ['CALLER-EDGE-SUBSET-NOT-ALLOWED', x => { x.after.edges = [['A', 'B']]; }, 'NORMALIZATION_BLOCKED']
  ]) { const x = copy(edgeInput); mutate(x); refuse('C1-' + id, x, code); }
  {
    const before = 'const affected = ids.some(id => changed.has(id));';
    const after = 'const affected = JSON.stringify(old) !== JSON.stringify(next);';
    assert.equal(source.split(before).length, 2, 'unique member-only mutation site');
    const observed = text => copy(load(text).createStartClassifier(candidateEdge)(edgeInput));
    assert.deepEqual(observed(source), edgeExpected);
    let disposable = source.replace(before, after), wrong = observed(disposable);
    assert.deepEqual(wrong.affectedLineages, []); // Named escaped behavior, no import/throw credit.
    assert.deepEqual(wrong.before.edges, edgeExpected.before.edges); assert.deepEqual(wrong.after.edges, edgeExpected.after.edges);
    assert.throws(() => assert.deepEqual(wrong, edgeExpected), {name: 'AssertionError'});
    disposable = disposable.replace(after, before); assert.equal(disposable, source); assert.equal(hash(disposable), hash(source));
    assert.deepEqual(observed(disposable), edgeExpected); faults.push('membership-only-classifier');
    console.log('CLASSIFIER-FAULT membership-only-classifier: ORIGINAL PASS / BEHAVIORAL RED / RESTORED PASS');
  }
  assert.equal(hash(fs.readFileSync(relationFile)), relationSha);
  return {checks: ids, permutations, freshProcesses, effectiveFaults: faults, relationSha256: relationSha,
    limitation: 'Only candidateEdge runs in product; normalized provenance/history, version support and eligibility are explicit input assumptions. One relation proves version-label invalidation, not different-algorithm compatibility. Assumed live-view rejoin does not authorize tombstone resurrection. No generation assignment, answer applicability, decoder or schema adoption.'};
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
// Each edit still targets the ORIGINAL set. Later edits cite the immediately
// preceding edit, so closure (not receipt order alone) supplies older ancestry.
function chainInput(replacement, third = false) {
  const x = input(4);
  function append(id, kind, payload, seq, predecessor, parents) {
    const op = {...JSON.parse(C.operationBytes), op_id: id, canonical_content_commitment: 'MODEL-ONLY-COMMITMENT-' + id,
      device_id: 'device-B', device_seq: seq, device_predecessor_op_id: predecessor, causal_parents: parents, kind, payload};
    x.records.push({operationBytes: ' \n' + JSON.stringify(op, null, 1) + '\n', receiptBytes: JSON.stringify({op_id: id,
      canonical_content_commitment: op.canonical_content_commitment, athlete_log_seq: x.records.length + 1,
      accepted_at: 'MODEL-NOT-A-SIGNED-TIME'})});
  }
  append('correction-B', 'correction', {replacement_fields: copy(replacement)}, 3, 'correction-A', ['set-A', 'correction-A']);
  if (third) append('correction-C', 'correction', {replacement_fields: {load: {value: 43, unit: 'lb'}}}, 4,
    'correction-B', ['set-A', 'correction-B']);
  const last = third ? 'correction-C' : 'correction-B';
  append('removal-chain', 'tombstone', {reason: 'Synthetic mistaken set'}, third ? 5 : 4, last, ['set-A', last]);
  x.watermark = x.records.length; return x;
}
const chainReplacements = {reps: {value: 7, unit: 'rep'}, reserve: {tag: 'at_least', value: 3, unit: 'rep'}};
const chains = [
  ['disjoint-fields', chainInput(chainReplacements),
    {load: {value: 41, unit: 'lb'}, reps: {value: 7, unit: 'rep'}, reserve: {tag: 'at_least', value: 3, unit: 'rep'}},
    ['correction-A', 'correction-B']],
  ['same-field-later-edit', chainInput({load: {value: 43, unit: 'lb'}}),
    {load: {value: 43, unit: 'lb'}, reps: {value: 6, unit: 'rep'}}, ['correction-A', 'correction-B']],
  ['transitive-correction-and-removal', chainInput(chainReplacements, true),
    {load: {value: 43, unit: 'lb'}, reps: {value: 7, unit: 'rep'}, reserve: {tag: 'at_least', value: 3, unit: 'rep'}},
    ['correction-A', 'correction-B', 'correction-C']]
];
function chainExpected(x, observed, ids, removed = true) {
  return {model: 'REVIEW_MODEL_ONLY', watermark: x.watermark, planBytes, retained: copy(x.records),
    facts: [{...originalA, observations: copy(observed), included: !removed,
      provenance: {...originalA.provenance, correction_op_ids: ids.slice(), tombstone_op_ids: removed ? ['removal-chain'] : []}}, originalB]};
}
function changeChain(x, index, change) {
  const next = copy(x), op = JSON.parse(next.records[index].operationBytes); change(op);
  next.records[index].operationBytes = JSON.stringify(op); return next;
}
const concurrentChain = changeChain(chains[1][1], 4, op => { op.causal_parents = ['set-A']; });
let chainPermutations = 0;
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
  for (const [id, x, observed, ids] of chains) {
    const wanted = chainExpected(x, observed, ids);
    check('CAUSAL-CHAIN-EXACT-' + id, () => {
      const before = JSON.stringify(x);
      const active = {...copy(x), watermark: x.watermark - 1, records: copy(x.records.slice(0, -1))};
      assert.deepEqual(M.project(active), chainExpected(active, observed, ids, false));
      assert.deepEqual(M.project(x), wanted); assert.equal(JSON.stringify(x), before);
      // Complete DTO comparison includes original bytes/receipts, unchanged plan,
      // unrelated set, untouched fields, identities and full correction lineage.
    });
    check('CAUSAL-CHAIN-REPLAY-' + id, () => {
      const replay = copy(x); replay.records.push(...copy(x.records), ...copy(x.records));
      assert.deepEqual(M.project(replay), wanted);
    });
    check('CAUSAL-CHAIN-FRESH-PROCESS-' + id, () => fresh(x, wanted));
    check('CAUSAL-CHAIN-PERMUTATIONS-' + id, () => {
      for (const order of orders(x.records)) {
        assert.deepEqual(M.project({...x, records: order}), wanted); permutations++; chainPermutations++;
      }
    });
  }
  check('CAUSAL-CHAIN-ALIASES-DETACHED', () => {
    const [, x, observed, ids] = chains[2], wanted = chainExpected(x, observed, ids), before = JSON.stringify(x);
    const y = M.project(x); y.facts[0].observations.reserve.value = 999;
    y.facts[0].provenance.correction_op_ids.push('MODEL-OUTPUT-ONLY');
    assert.deepEqual(y.facts[0].original, originalA.original); assert.deepEqual(y.facts[1], originalB);
    assert.equal(JSON.stringify(x), before); assert.deepEqual(M.project(x), wanted);
  });
  refusal('CHAIN-CONCURRENT-EDIT-NOT-LOG-ORDER', concurrentChain, 'UNSUPPORTED_CONFLICT');
  // These siblings have separate valid transport chains and no semantic edge
  // between them. Changing receipt positions is different from delivery order.
  const siblings = changeChain(chains[1][1], 4, op => {
    op.device_id = 'device-A'; op.device_seq = 3; op.device_predecessor_op_id = 'set-A'; op.causal_parents = ['set-A'];
  });
  siblings.records.pop(); siblings.watermark = 5;
  const reversedSiblings = copy(siblings);
  for (const [index, position] of [[3, 5], [4, 4]]) {
    const receipt = JSON.parse(reversedSiblings.records[index].receiptBytes); receipt.athlete_log_seq = position;
    reversedSiblings.records[index].receiptBytes = JSON.stringify(receipt);
  }
  check('CONCURRENT-SIBLINGS-VALID-DISTINCT-CHAINS', () => {
    for (const x of [siblings, reversedSiblings]) {
      const rows = x.records.map(row => ({op: JSON.parse(row.operationBytes), receipt: JSON.parse(row.receiptBytes)}));
      assert.notEqual(rows[3].op.device_id, rows[4].op.device_id);
      for (const row of rows.slice(3)) {
        const parent = rows.find(p => p.op.op_id === row.op.device_predecessor_op_id);
        assert.equal(parent.op.device_id, row.op.device_id); assert.equal(parent.op.device_seq + 1, row.op.device_seq);
        assert.ok(parent.receipt.athlete_log_seq < row.receipt.athlete_log_seq);
        assert.deepEqual(row.op.causal_parents, ['set-A']);
      }
    }
  });
  refusal('CONCURRENT-SIBLINGS-ACCEPTED-LOG-A-THEN-B', siblings, 'UNSUPPORTED_CONFLICT');
  refusal('CONCURRENT-SIBLINGS-ACCEPTED-LOG-B-THEN-A', reversedSiblings, 'UNSUPPORTED_CONFLICT');
  refusal('CHAIN-TRANSPORT-PREDECESSOR-NOT-CAUSALITY', changeChain(chains[2][1], 5,
    op => { op.causal_parents = ['set-A', 'correction-A']; }), 'UNSUPPORTED_CONFLICT');
  refusal('CHAIN-TOMBSTONE-MISSING-LATEST-EDIT', changeChain(chains[2][1], 6,
    op => { op.causal_parents = ['set-A', 'correction-B']; }), 'UNSUPPORTED_CONFLICT');
  refusal('CHAIN-MISSING-ANCESTOR', changeChain(chains[2][1], 5,
    op => { op.causal_parents = ['set-A', 'missing']; }), 'MISSING_DEPENDENCY');
  refusal('CHAIN-CYCLE-NOT-A-VALID-ORDER', changeChain(chains[2][1], 3,
    op => { op.causal_parents = ['set-A', 'correction-C']; }), 'INVALID_CAUSAL_GRAPH');
  const afterRemoval = changeChain(chains[2][1], 6, op => {
    op.kind = 'correction'; op.payload = {replacement_fields: {load: {value: 47, unit: 'lb'}}};
  });
  const removedBefore = JSON.parse(afterRemoval.records[5].operationBytes);
  removedBefore.kind = 'tombstone'; removedBefore.payload = {reason: 'Synthetic removal before edit'};
  afterRemoval.records[5].operationBytes = JSON.stringify(removedBefore);
  refusal('CHAIN-CORRECTION-CANNOT-REVIVE-REMOVAL', afterRemoval, 'UNSUPPORTED_CONFLICT');
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
  {
    const id = 'ignore-causal-edit-coverage';
    const before = 'const coversEdits = (op, fact) => fact.provenance.correction_op_ids.every(id => ancestry.get(op.op_id).has(id));';
    const after = 'const coversEdits = (op, fact) => true;';
    const mustRefuseConcurrent = model => assert.throws(() => model.project(concurrentChain), error => error.code === 'UNSUPPORTED_CONFLICT');
    assert.equal(source.split(before).length, 2, 'unique causal coverage mutation site');
    mustRefuseConcurrent(load(source));
    let disposable = source.replace(before, after); const mutated = load(disposable);
    // The mutation must admit a concrete concurrent same-field replacement and
    // return its unproved receipt-order winner, not merely throw or fail to load.
    assert.deepEqual(copy(mutated.project(concurrentChain)), chainExpected(concurrentChain,
      {load: {value: 43, unit: 'lb'}, reps: {value: 6, unit: 'rep'}}, ['correction-A', 'correction-B']));
    assert.throws(() => mustRefuseConcurrent(mutated), {name: 'AssertionError'});
    disposable = disposable.replace(after, before); assert.equal(disposable, source); assert.equal(hash(disposable), hash(source));
    mustRefuseConcurrent(load(disposable));
    faults.push(id); console.log('MODEL-FAULT ' + id + ': ORIGINAL PASS / BEHAVIORAL RED / RESTORED PASS');
  }
  const startClassifier = startClassifierCases();
  assert.equal(fs.readFileSync(filename, 'utf8'), source);
  const result = {status: 'REVIEW_PREPARATION_PASS', modelOnly: true, productAcceptance: false, checks, permutations, freshProcesses,
    observationOverlays: overlays.length, originalEffortVariants: effortTypes.length, replacementFieldSubsets: 7,
    causalChains: chains.length, chainPermutations, startClassifier,
    effectiveFaults: faults, sourceSha256: hash(source), testSha256: hash(fs.readFileSync(__filename)), node: process.version, elapsedMs: performance.now() - start,
    limitations: ['Authentication and complete accepted input are assumptions, not verified.', 'Identifiers, commitments, receipts, lease and schema are model-only placeholders.',
      'Observation corrections target an original set and must cover all prior edits in causal ancestry; removal must cover the full edit lineage.',
      'Reps integer/range domain and reserve prompt eligibility remain OPEN; these checks validate the explicitly proposed structure only.',
      'No legacy numeric effort conversion, clearing, effective-time/generation policy or concurrent winner policy is implemented.',
      'Fresh Node reconstruction is not IndexedDB, crash durability or a phone test.', 'Only the pinned candidateEdge relation runs in product; no training engine, plan writer, authority, transport or canonical implementation runs.']};
  const args = process.argv.slice(2);
  if (args.length) { assert.equal(args.length, 2); assert.equal(args[0], '--evidence'); fs.writeFileSync(path.resolve(args[1]), JSON.stringify(result, null, 2) + '\n', {flag: 'wx'}); }
  console.log(`NONCONCURRENT-OBSERVATION OVERLAYS: ${overlays.length}/${overlays.length} exact cases; 7/7 nonempty field subsets; ${effortTypes.length}/7 original effort variants; alias detachment PASS`);
  console.log(`NONCONCURRENT-CAUSAL CHAINS: ${chains.length}/${chains.length} exact cases; ${chainPermutations} delivery permutations; transitive edit/removal coverage PASS; concurrent refusal PASS`);
  console.log(`START-RELEVANCE CLASSIFIER PREPARATION: ${startClassifier.checks.length}/${startClassifier.checks.length} checks PASS; ${startClassifier.permutations} input permutations; ${startClassifier.freshProcesses} fresh process; ${startClassifier.effectiveFaults.length}/1 effective classifier fault; PINNED RELATION / NORMALIZATION ASSUMED`);
  console.log(`NONCONCURRENT-PROJECTION PREPARATION: ${checks.length}/${checks.length} checks PASS; ${permutations} delivery permutations; ${freshProcesses} fresh processes; ${faults.length}/${faults.length} effective model faults; MODEL ONLY`);
} catch (error) { console.error('NONCONCURRENT-PROJECTION PREPARATION FAIL — ' + (error.code || error.name)); process.exitCode = 1; }
