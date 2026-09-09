'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const path = require('node:path'), {pathToFileURL} = require('node:url');
const {createImportPreparation} = require(process.env.IMPORT_PREPARATION_MODULE || '../prepare.cjs');
// LOCAL TEST ONLY: the installed engine includes private seed dependencies.
// Inputs below are invented fixtures; no seed value is used or printed.
const {createEngine} = require('../../../engine/index.cjs');
const F = require('../../../m3/w7-preview/fixtures.cjs');
const w6 = process.env.PERFORMED_W6_DIR;
if (!w6) throw Error('Provide retained PERFORMED_W6_DIR');
const parser = import(pathToFileURL(path.join(w6, 'rebuild/m3/w6/strict-json.mjs')));
const bytes = state => Buffer.from(JSON.stringify(state, null, 2) + '\r\n');
function engine() {
  let id = 0;
  return createEngine({clock: {today: () => F.SYNTHETIC_DAY, hour: () => 12,
    nowISO: () => F.SYNTHETIC_DAY + 'T12:00:00.000Z'}, ids: {fresh: p => p + 'synthetic-' + ++id}});
}
async function adapter(E = engine()) {
  return createImportPreparation({engine: E, parseStrictJson: (await parser).parseStrictJson});
}

test('actual current-schema migration mutates input; preparation preserves exact original bytes and history', async () => {
  const state = F.createSyntheticState(), before = structuredClone(state);
  const direct = engine().migrate(state);
  assert.equal(direct, state);
  assert.notDeepEqual(state, before, 'Reached source mutation witness');
  const raw = bytes(before), rawBefore = Buffer.from(raw), out = (await adapter()).prepare(raw);
  assert.deepEqual(out.sourceBytes(), rawBefore);
  assert.deepEqual(raw, rawBefore);
  assert.deepEqual(out.sourceState(), before);
  assert.deepEqual(out.candidateState(), direct);
  assert.equal(out.summary.activation, 'pending');
  assert.notEqual(out.summary.source_sha256, out.summary.candidate_sha256);
  assert.equal(out.summary.source_byte_length, raw.length);
});

test('actual migrate/merge/settle protects BOTH pre-call source and local snapshots', async () => {
  const remote = F.createSyntheticState(), local = F.createSyntheticState();
  remote.reads.push({d: '2029-12-01', w: 180, note: 'SYNTHETIC remote-only'});
  local.reads.push({d: '2029-12-02', w: 181, note: 'SYNTHETIC local-only'});
  const rb = bytes(remote), lb = bytes(local), E = engine(), cuts = [];
  const wrapped = {...E,
    migrate(s) { cuts.push('migrate'); return E.migrate(s); },
    mergeState(a, b) { cuts.push('merge'); return E.mergeState(a, b); },
    dataLossGuard(a, b) { cuts.push(structuredClone(a)); return E.dataLossGuard(a, b); }};
  const out = (await adapter(wrapped)).prepare(rb, {localBytes: lb});
  assert.deepEqual(cuts.slice(0, 3), ['migrate', 'merge', 'migrate']);
  assert.deepEqual(cuts.slice(3), [remote, local], 'Independent original preimages');
  assert.deepEqual(out.sourceBytes(), rb); assert.deepEqual(out.localBytes(), lb);
  assert.deepEqual(out.sourceState(), remote); assert.deepEqual(out.localState(), local);
  for (const date of ['2029-12-01', '2029-12-02']) assert(out.candidateState().reads.some(r => r.d === date));
  const reverse = (await adapter()).prepare(lb, {localBytes: rb});
  assert.deepEqual(reverse.candidateState(), out.candidateState());
  const repeat = (await adapter()).prepare(rb, {localBytes: out.candidateBytes()});
  assert.deepEqual(repeat.candidateState(), out.candidateState(), 'Repeated delivery does not duplicate facts');
});

test('actual guard refuses a reached remote loss even if the migration argument has already lost it', async () => {
  const E = engine(), raw = bytes(F.createSyntheticState());
  const bad = {...E, migrate(s) { s.reads.shift(); return E.migrate(s); }};
  assert.throws(() => createImportPreparation({engine: bad, parseStrictJson: JSON.parse}).prepare(raw),
    {code: 'IMPORT_MIGRATION_DATA_LOSS'});
});

test('actual guard refuses local-only loss after merge despite remote preservation', async () => {
  const remote = F.createSyntheticState(), local = F.createSyntheticState(), E = engine();
  local.reads.push({d: '2029-12-02', w: 181, note: 'SYNTHETIC local-only'});
  const bad = {...E, mergeState(a, b) { b.reads = b.reads.filter(r => r.d !== '2029-12-02'); return E.mergeState(a, b); }};
  const A = await adapter(bad);
  assert.throws(() => A.prepare(bytes(remote), {localBytes: bytes(local)}), {code: 'IMPORT_MIGRATION_DATA_LOSS'});
});

test('actual D33 identity guard detects a replaced date without a record-count decrease', async () => {
  const E = engine(), bad = {...E, migrate(s) { const out = E.migrate(s); out.reads[0].d = '2029-11-01'; return out; }};
  const A = await adapter(bad);
  assert.throws(() => A.prepare(bytes(F.createSyntheticState())), {code: 'IMPORT_MIGRATION_DATA_LOSS'});
});

test('guard success does not promise equality of every migrated measurement value', async () => {
  const E = engine(), original = F.createSyntheticState(), changed = structuredClone(original);
  changed.reads[0].w += 1;
  assert.equal(E.dataLossGuard(original, changed).safe, true, 'Existing guard scope, not a new equality law');
  const A = await adapter({...E, migrate: () => changed});
  const out = A.prepare(bytes(original));
  assert.deepEqual(out.sourceState(), original);
  assert.notDeepEqual(out.candidateState(), original);
  assert.equal(out.summary.activation, 'pending', 'Candidate still requires full parity/qualification');
});

test('a supported earlier schema consumes the actual returned migration and retains its original version', async () => {
  const source = {...F.createSyntheticState(), v: 59}, working = structuredClone(source), E = engine();
  const expected = E.migrate(working);
  assert.notEqual(expected, working, 'Actual older-schema exit returns a new object');
  const A = await adapter(); let out;
  assert.doesNotThrow(() => { out = A.prepare(bytes(source)); }, 'Supported prior schema must prepare');
  assert.equal(out.sourceState().v, 59); assert.equal(out.candidateState().v, E.SCHEMA_V);
  assert.deepEqual(out.candidateState(), expected);
});

test('all exposed copies and caller buffers are isolated from the held source/candidate', async () => {
  const raw = bytes(F.createSyntheticState()), local = bytes(F.createSyntheticState());
  const out = (await adapter()).prepare(raw, {localBytes: local});
  const sourceBefore = out.sourceBytes(), localBefore = out.localBytes(), candidateBefore = out.candidateBytes();
  raw.fill(0); local.fill(0); out.sourceBytes().fill(0); out.localBytes().fill(0); out.candidateBytes().fill(0);
  out.sourceState().reads.length = 0; out.localState().reads.length = 0; out.candidateState().reads.length = 0;
  assert.deepEqual(out.sourceBytes(), sourceBefore); assert.deepEqual(out.localBytes(), localBefore);
  assert.deepEqual(out.candidateBytes(), candidateBefore);
  assert.throws(() => { out.summary.activation = 'active'; }, TypeError);
});

test('guard mutation cannot rewrite the retained originals or candidate', async () => {
  const E = engine(), badGuard = {...E, dataLossGuard(a, b) {
    const result = E.dataLossGuard(a, b); a.reads.length = 0; b.reads.length = 0; return result;
  }};
  const raw = bytes(F.createSyntheticState()), out = (await adapter(badGuard)).prepare(raw);
  assert.equal(out.sourceState().reads.length, 28); assert.equal(out.candidateState().reads.length, 28);
});

test('future schemas and seed-dependent inputs refuse BEFORE any engine call, including local input', async () => {
  const E = engine(), calls = [], A = await adapter({...E, migrate(s) { calls.push(s); return E.migrate(s); }});
  const future = {...F.createSyntheticState(), v: E.SCHEMA_V + 1, sleep: null};
  assert.equal(E.migrate(future), future, 'Actual engine preserves unknown schema identity');
  for (const version of [-1, 0, 1, 2]) assert.throws(() => A.prepare(bytes({v: version})), {code: 'IMPORT_SOURCE_SEED_PROFILE_REQUIRED'});
  assert.throws(() => A.prepare(bytes(future)), {code: 'IMPORT_SOURCE_FUTURE_SCHEMA'});
  assert.throws(() => A.prepare(bytes(F.createSyntheticState()), {localBytes: bytes(future)}), {code: 'IMPORT_SOURCE_FUTURE_SCHEMA'});
  assert.deepEqual(calls, []);
});

test('strict source parser refuses duplicate keys, invalid UTF8, nonfinite JSON and missing schema', async () => {
  const A = await adapter();
  for (const raw of [Buffer.from('{"v":60,"v":59}'), Buffer.from([0xff]), Buffer.from('{"v":60,"x":1e999}'), Buffer.from('{')])
    assert.throws(() => A.prepare(raw), {code: 'IMPORT_SOURCE_JSON_INVALID'});
  for (const source of [null, [], {}, {v: '60'}, {v: 60.5}])
    assert.throws(() => A.prepare(bytes(source)), {code: 'IMPORT_SOURCE_SCHEMA_REQUIRED'});
  assert.throws(() => A.prepare('{}'), {code: 'IMPORT_SOURCE_BYTES_REQUIRED'});
});

test('migration result must retain current schema and survive JSON without silent conversion', async () => {
  const E = engine(), raw = bytes(F.createSyntheticState());
  for (const value of [NaN, Infinity, undefined, -0, new Array(1)]) {
    const A = await adapter({...E, migrate(s) { return {...s, nonJson: value}; }});
    assert.throws(() => A.prepare(raw), {code: 'IMPORT_MIGRATION_NOT_LOSSLESS_JSON'});
  }
  const A = await adapter({...E, migrate: () => ({v: 61})});
  assert.throws(() => A.prepare(raw), {code: 'IMPORT_MIGRATION_SCHEMA_INVALID'});
});

test('private engine error prose and guard details never escape in preparation errors', async () => {
  const E = engine(), raw = bytes(F.createSyntheticState());
  const A = await adapter({...E, migrate() { throw Error('SYNTHETIC private detail'); }});
  assert.throws(() => A.prepare(raw), error => error.message === 'IMPORT_MIGRATION_FAILED' && !error.cause);
  const B = await adapter({...E, dataLossGuard: () => ({safe: false, lost: ['SYNTHETIC private detail']})});
  assert.throws(() => B.prepare(raw), error => error.message === 'IMPORT_MIGRATION_DATA_LOSS' && !error.cause);
});

test('historical plan decisions stay in preserved source and confer no activation authority', async () => {
  const state = F.createSyntheticState();
  state.accepted = [{id: 'SYNTHETIC imported acceptance', amount: 5}];
  state.targets = {cal: 2300};
  const out = (await adapter()).prepare(bytes(state));
  assert.deepEqual(out.sourceState().accepted, state.accepted);
  assert.deepEqual(out.sourceState().targets, state.targets);
  assert.equal(out.summary.activation, 'pending');
  assert.equal(out.activation_op_id, undefined); assert.equal(out.source_generation_id, undefined);
  assert.equal(out.commit, undefined); assert.equal(out.activate, undefined);
});
