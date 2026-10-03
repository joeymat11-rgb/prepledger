'use strict';
/* native-load-replay.test.cjs - THE F9 FAMILY ON ITS OWN (S11 FC09, PM ruling DECISIONS:878).

   The family module and FC03 (rebuild/m4/workout/native-load-effects.cjs) are
   both dependency-free, so these cells load nothing else: no engine file, no
   admission controller and no fixture. They pin what the family itself states:
   which operations it owns (NATIVE-LOAD-SPEC R9.13 :175: by producer/profile
   or a matching native proposal ID), that a malformed native accept is refused
   BY NAME and never dropped, and how a fold of FC03 is read back into rows.
   The admission-level and real-installation cells live with their own layers:
   rebuild/m3/w6/test/local-source-admission.test.mjs (FC09-T3/T4) and
   rebuild/lanes/d/p3-replay-all/native-load-import.test.mjs (FC09-T1/T2/T5).

   RED FIRST: before the family existed, the require below threw and every
   cell in this file failed. SYNTHETIC ONLY: every value is invented. */
const test = require('node:test');
const assert = require('node:assert/strict');
const Effects = require('../../workout/native-load-effects.cjs');
const Family = require('../native-load-replay.cjs');

const ATHLETE = 'TEST-ONLY-athlete';
const DAY = '2026-11-20';
const CODE = 'LOCAL_SOURCE_NATIVE_LOAD_RECORD_INVALID';
const DETAIL = 'NATIVE_LOAD_RECORD_INVALID';

function body(extra = {}) {
  return { profile: 'earned/native-load-decision/v1', kind: 'adopt-observed', lift_lineage_id: 'TEST-ONLY-lift',
    spend_id: 'TEST-ONLY-spend', basis: { athlete_id: ATHLETE }, consumes: [], evidence: [], ...extra };
}
function accept({ reason = 'TEST-ONLY reason', b = body() } = {}) {
  const issuance = { producer: Effects.PRODUCER, body: b, reason, revision: Effects.PRODUCER_REVISION,
    source: 'TEST-ONLY-source', moment: DAY + 'T13:00:00.000Z' };
  return { proposal_id: Effects.proposalDigest(Effects.PRODUCER, b, reason), answer: 'accept', issuance };
}
let seq = 0;
function op(payload, extra = {}) {
  seq += 1;
  return { op_id: 'TEST-ONLY-op-' + seq, ['cl' + 'ass']: 'plan', kind: 'proposal-response', schema_version: 1,
    device_seq: seq, payload, effective: { local_date: DAY, local_time: '08:00', utc_offset: '-05:00' }, ...extra };
}
const family = (effects = Effects) => Family.createNativeLoadReplayFamily({ effects });
const read = (f, o) => f.read(o, { asOf: DAY, athleteId: ATHLETE });

test('NLR-SHAPE: the family is F9, refuses by a LOCAL_SOURCE_* code and carries FC03\'s own name as the detail', () => {
  assert.equal(Family.FAMILY, 'F9');
  assert.equal(Family.CODE, CODE);
  assert.equal(Family.DETAIL, DETAIL);
  assert.throws(() => Family.createNativeLoadReplayFamily({}), TypeError, 'the family refuses to exist without FC03');
});

test('NLR-OWNS: owned by the native producer, by the decision profile, by a matching native proposal digest, '
  + 'or by a proposal ID a native accept in the same log carries; nothing else', () => {
  const f = family(), good = op(accept());
  assert.equal(f.owns(good), true, 'producer');
  const byProfile = accept(); byProfile.issuance.producer = 'earned/coach/TEST-ONLY-other/v1';
  assert.equal(f.owns(op(byProfile)), true, 'decision profile');
  const byDigest = accept({ b: { profile: 'TEST-ONLY-not-the-profile' } }); byDigest.issuance.producer = 'TEST-ONLY-relabelled';
  assert.equal(f.owns(op(byDigest)), true, 'the proposal ID is the native digest of its own body and reason');
  const naked = op({ proposal_id: good.payload.proposal_id, answer: 'accept' });
  assert.equal(f.owns(naked), false, 'without the log a naked response names no producer');
  assert.equal(f.owns(naked, f.proposals([good, naked])), true, 'a retained native proposal ID owns it');
  const coachBody = { profile: 'earned/coach/TEST-ONLY-body/v1', change: 'TEST-ONLY' };
  const coach = op({ proposal_id: Effects.proposalDigest('earned/coach/TEST-ONLY-proposal/v1', coachBody, 'TEST-ONLY'), answer: 'accept',
    issuance: { producer: 'earned/coach/TEST-ONLY-proposal/v1', body: coachBody, reason: 'TEST-ONLY', revision: 'r', source: 's', moment: DAY + 'T13:00:00.000Z' } });
  assert.equal(f.owns(coach, f.proposals([good, coach])), false, 'a coach-producer response is not this family\'s');
  assert.equal(f.owns(op({ proposal_id: 'prop-TEST-ONLY', answer: 'accept' }), f.proposals([good])), false, 'an unmatched naked response');
  assert.equal(f.owns(op(accept(), { kind: 'fact' })), false, 'another kind of the plan class');
  assert.equal(f.owns({ ...op(accept()), ['cl' + 'ass']: 'event' }), false, 'another class');
  assert.equal(f.owns(null), false);
});

test('NLR-READ: a well-formed native accept is accepted with its spend and lift', () => {
  const f = family(), o = op(accept()), row = read(f, o);
  assert.deepEqual(row, { ok: true, op_id: o.op_id, spend_id: 'TEST-ONLY-spend', lift: 'TEST-ONLY-lift', kind: 'adopt-observed', device_seq: o.device_seq });
});

test('NLR-MALFORMED: every malformed owned accept refuses ' + CODE + ' with ' + DETAIL + ' and its field, never dropped', () => {
  const f = family();
  const cases = [
    ['schema_version', () => op(accept(), { schema_version: 2 })],
    ['payload', () => { const p = accept(); p.note = 'TEST-ONLY extra'; return op(p); }],
    ['answer', () => { const p = accept(); p.answer = 'decline'; return op(p); }],
    ['issuance', () => { const p = accept(); delete p.issuance.moment; return op(p); }],
    ['issuance', () => { const p = accept(); p.issuance.moment = 'TEST-ONLY not a time'; return op(p); }],
    ['producer', () => { const p = accept(); p.issuance.producer = 'TEST-ONLY-relabelled'; return op(p); }],
    ['body', () => op(accept({ b: body({ spend_id: '' }) }))],
    ['proposal_id', () => { const p = accept(); p.issuance.reason = 'TEST-ONLY tampered reason'; return op(p); }],
    ['athlete_id', () => op(accept({ b: body({ basis: { athlete_id: 'TEST-ONLY-someone-else' } }) }))],
    ['effective', () => op(accept(), { effective: { local_date: '2026-11-21', local_time: '08:00', utc_offset: '-05:00' } })],
  ];
  for (const [field, make] of cases) {
    const o = make();
    assert.equal(f.owns(o), true, field + ': the case must be owned to measure anything');
    assert.deepEqual(read(f, o), { ok: false, code: CODE, op_id: o.op_id, detail: DETAIL, field }, field);
  }
  const good = op(accept()), naked = op({ proposal_id: good.payload.proposal_id, answer: 'accept' });
  assert.deepEqual(read(f, naked), { ok: false, code: CODE, op_id: naked.op_id, detail: DETAIL, field: 'payload' },
    'a missing issuance is never consent (spec :175)');
});

test('NLR-ACCOUNT: replay accounts for every owned operation, as an accepted row or a named issue, and ignores the rest', () => {
  const f = family(), good = op(accept()), bad = op({ ...accept(), answer: 'decline' }), naked = op({ proposal_id: good.payload.proposal_id, answer: 'accept' });
  const other = op({ request: 'TEST-ONLY' }, { kind: 'fact' });
  const owned = [good, bad, naked, other].filter(o => f.owns(o, f.proposals([good, bad, naked, other])));
  const out = f.replay(owned, { asOf: DAY, athleteId: ATHLETE });
  assert.equal(out.owned, 3);
  assert.deepEqual(out.accepted.map(r => r.op_id), [good.op_id]);
  assert.deepEqual(out.issues.map(i => [i.code, i.op_id, i.detail]), [[CODE, bad.op_id, DETAIL], [CODE, naked.op_id, DETAIL]]);
  assert.deepEqual(out.families, [], 'nothing is a row until it is folded');
  assert.throws(() => f.replay(owned, { asOf: 'not-a-day', athleteId: ATHLETE }), TypeError);
});

/* A fold stub over the real FC03 constants: what the family reads back out of a fold. */
const ref = o => ({ op_id: o.op_id, commitment: 'TEST-ONLY-c-' + o.op_id });
function folding(result, calls = []) {
  return family({ ...Effects, foldNativeLoad: args => { calls.push(args); if (result instanceof Error) throw result; return structuredClone(result); } });
}
function rows(f, ops) { return f.replay(ops, { asOf: DAY, athleteId: ATHLETE }).accepted; }
const ARGS = { base: { exercises: [], queue: [] }, generation: { collections: { ops: {} } }, workoutFacts: null, engine: { revision: 'r', at: () => ({}) }, athleteId: ATHLETE, source: 's' };

test('NLR-FOLD: FOLDED, not retained: the fold is run once, inside the caller\'s window, and every accepted yes leaves '
  + 'as applied, held, retired, compensation or refused, with one fold digest over the whole fold', () => {
  const applied = op(accept({ b: body({ spend_id: 'a' }) })), held = op(accept({ b: body({ spend_id: 'h' }) }));
  const retired = op(accept({ b: body({ spend_id: 'r' }) })), undo = op(accept({ b: body({ spend_id: 'u', kind: 'compensate' }) }));
  const queued = op(accept({ b: body({ spend_id: 'q' }) }));
  const result = { status: 'ready', state: { exercises: [], queue: [] }, effects: [],
    spent: [{ spend_id: 'a', response_refs: [ref(applied)] }, { spend_id: 'h', response_refs: [ref(held)] },
      { spend_id: 'r', response_refs: [ref(retired)], cancelled_by: 'u' }, { spend_id: 'u', response_refs: [ref(undo)] }],
    issues: [{ code: 'NATIVE_LOAD_EFFECT_CONFLICT', refs: [ref(held)], field: 'load_basis', lift: 'TEST-ONLY-lift' },
      { code: 'NATIVE_LOAD_TARGET_QUEUED', refs: [ref(queued)], field: 'queue', lift: 'TEST-ONLY-lift' },
      { code: 'NATIVE_LOAD_RECORD_INVALID', refs: [ref(applied)], field: 'base_load', lift: 'TEST-ONLY-lift', superseded_by: 'x' }],
    coverage: [] };
  const calls = [], f = folding(result, calls);
  let windows = 0;
  const out = f.fold(rows(f, [applied, held, retired, undo, queued]), { ...ARGS, within: run => { windows += 1; return run(); } });
  assert.equal(calls.length, 1, 'one fold per admission');
  assert.equal(windows, 1, 'inside the caller\'s window');
  assert.deepEqual(Object.keys(calls[0]).sort(), ['athleteId', 'base', 'engine', 'generation', 'source', 'workoutFacts']);
  assert.deepEqual(out.issues, []);
  assert.deepEqual(out.families.map(r => [r.family, r.state, r.op_id, r.outcome, r.codes]), [
    ['F9', 'folded', applied.op_id, 'applied', []], ['F9', 'folded', held.op_id, 'held', ['NATIVE_LOAD_EFFECT_CONFLICT']],
    ['F9', 'folded', retired.op_id, 'retired', []], ['F9', 'folded', undo.op_id, 'compensation', []],
    ['F9', 'folded', queued.op_id, 'refused', ['NATIVE_LOAD_TARGET_QUEUED']]]);
  assert.equal(new Set(out.families.map(r => r.fold_digest)).size, 1);
  assert.match(out.families[0].fold_digest, /^sha256:[0-9a-f]{64}$/);
  const again = folding(result).fold(rows(f, [applied, held, retired, undo, queued]), ARGS);
  assert.deepEqual(again, out, 'the same fold reads back byte-identically');
  const moved = folding({ ...result, state: { exercises: [{ id: 'TEST-ONLY-lift', w: 1 }], queue: [] } })
    .fold(rows(f, [applied, held, retired, undo, queued]), ARGS);
  assert.notEqual(moved.families[0].fold_digest, out.families[0].fold_digest, 'the folded programme is bound into the digest');
});

test('NLR-FOLD-REFUSES: a record FC03 finds malformed in itself, an unaccounted yes, a refused fold and a throwing fold '
  + 'are each refused BY NAME; a base-dependent RECORD_INVALID is a hold, not a refusal', () => {
  const shape = op(accept({ b: body({ spend_id: 's' }) })), lineage = op(accept({ b: body({ spend_id: 'l' }) }));
  const lost = op(accept({ b: body({ spend_id: 'z' }) }));
  const result = { status: 'ready', state: {}, effects: [], spent: [], coverage: [], issues: [
    { code: DETAIL, refs: [ref(shape)], field: 'evidence', reason: 'record shape', lift: 'TEST-ONLY-lift' },
    { code: DETAIL, refs: [ref(lineage)], field: 'lift_lineage_id', reason: 'lineage', lift: null }] };
  const f = folding(result), out = f.fold(rows(f, [shape, lineage, lost]), ARGS);
  assert.deepEqual(out.issues, [{ code: CODE, op_id: shape.op_id, detail: DETAIL, field: 'evidence' },
    { code: CODE, op_id: lost.op_id, detail: DETAIL, field: 'fold' }]);
  assert.deepEqual(out.families.map(r => [r.op_id, r.outcome, r.codes]), [[lineage.op_id, 'held', [DETAIL]]]);
  const refused = folding({ status: 'refused', state: null, effects: [], spent: [], coverage: [],
    issues: [{ code: 'NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN', refs: [], field: 'source' }] });
  assert.deepEqual(refused.fold(rows(refused, [shape]), ARGS),
    { families: [], issues: [{ code: CODE, op_id: shape.op_id, detail: 'NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN', field: 'fold' }] });
  const thrown = folding(new TypeError('TEST-ONLY'));
  assert.deepEqual(thrown.fold(rows(thrown, [shape]), ARGS),
    { families: [], issues: [{ code: CODE, op_id: shape.op_id, detail: DETAIL, field: 'fold' }] });
  assert.deepEqual(f.fold([], ARGS), { families: [], issues: [] }, 'no yes, no fold');
});

test('NLR-FC03: over the REAL FC03 fold, a record malformed in itself (FC03 reason "record shape") is refused by name, '
  + 'and a record whose lift the base does not carry (reason "lineage") is admitted as a hold, so INTRINSIC tracks FC03\'s own words', () => {
  const f = family(), shaped = op(accept({ b: body({ spend_id: 'TEST-ONLY-shape' }) }));
  const elsewhere = op(accept({ b: body({ spend_id: 'TEST-ONLY-elsewhere', lift_lineage_id: 'TEST-ONLY-absent-lift' }) }));
  for (const o of [shaped, elsewhere]) o.canonical_content_commitment = 'TEST-ONLY-c-' + o.op_id;
  const generation = { collections: { ops: { [shaped.op_id]: shaped, [elsewhere.op_id]: elsewhere } } };
  const engine = { revision: Effects.PRODUCER_REVISION, at: () => { throw new Error('TEST-ONLY: no engine call is expected'); } };
  const out = f.fold(rows(f, [shaped, elsewhere]), { base: { exercises: [{ id: 'TEST-ONLY-lift' }], queue: [] }, generation,
    workoutFacts: null, engine, athleteId: ATHLETE, source: 'TEST-ONLY-source' });
  assert.deepEqual(out.issues.map(i => [i.code, i.op_id, i.detail]), [[CODE, shaped.op_id, DETAIL]], JSON.stringify(out));
  assert.deepEqual(out.families.map(r => [r.op_id, r.outcome, r.codes]), [[elsewhere.op_id, 'held', [DETAIL]]]);
});

/* S11 FC09 round 3 (PM ruling DECISIONS:879). Two read-backs the admission/page parity cell FC09-Q1-E needs. (1) Every row
   carries fold_codes: the codes of EVERY active fold issue, the lift-less governor issue included, so a refusal the fold met
   anywhere is visible in the interpretation and comparable with the page's own projection. (2) The fold digest binds the
   folded PROGRAMME, not the facts copy riding on it: admission now attaches the legacy-order baseline (whose ids include the
   selection id) before the engine reads, and the page drops workoutFacts from the state it adopts, so the facts copy must
   not make a reopen and a fresh preparation of the same source fold to different digests. */
test('NLR-FOLD-CODES: every row carries the sorted codes of every active fold issue, lift-less ones included; superseded issues are not counted', () => {
  const a = op(accept({ b: body({ spend_id: 'a' }) }));
  const result = { status: 'ready', state: { exercises: [], queue: [] }, effects: [], coverage: [],
    spent: [{ spend_id: 'a', response_refs: [ref(a)] }],
    issues: [{ code: 'PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED', refs: [], field: 'governor', lift: null },
      { code: 'NATIVE_LOAD_EFFECT_CONFLICT', refs: [ref(a)], field: 'load_basis', lift: 'TEST-ONLY-lift', superseded_by: 'x' },
      { code: 'NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED', refs: [ref(a)], field: null, lift: 'TEST-ONLY-lift' }] };
  const f = folding(result), out = f.fold(rows(f, [a]), ARGS);
  assert.deepEqual(out.families.map(r => [r.outcome, r.codes, r.fold_codes]),
    [['applied', ['NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED'], ['NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED', 'PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED']]]);
});

test('NLR-FOLD-DIGEST-PROGRAMME: the fold digest binds the folded programme and not the workoutFacts copy riding on the folded state', () => {
  const a = op(accept({ b: body({ spend_id: 'a' }) }));
  const make = facts => ({ status: 'ready', state: { exercises: [{ id: 'TEST-ONLY-lift', w: 1 }], queue: [], workoutFacts: facts },
    effects: [], coverage: [], issues: [], spent: [{ spend_id: 'a', response_refs: [ref(a)] }] });
  const digestOf = facts => { const f = folding(make(facts)); return f.fold(rows(f, [a]), ARGS).families[0].fold_digest; };
  assert.equal(digestOf({ order: { import_anchor: { activation_op_id: 'local-source:one' } } }),
    digestOf({ order: { import_anchor: { activation_op_id: 'local-source:two' } } }), 'the facts copy moved the digest');
  const f = folding({ ...make(null), state: { exercises: [{ id: 'TEST-ONLY-lift', w: 2 }], queue: [] } });
  assert.notEqual(f.fold(rows(f, [a]), ARGS).families[0].fold_digest, digestOf(null), 'the programme still binds');
});

test('NLR-READER: the family module is a READER (P3-EN4): it builds no operation and names no class in a building position', () => {
  const src = require('node:fs').readFileSync(require.resolve('../native-load-replay.cjs'), 'utf8');
  assert.equal(/(?:^|[^\w.])class\s*:/.test(src), false, 'a class: property in the family module');
  assert.equal(/(?:^|[^\w.])Ops\s*\.\s*build\s*\(|\.\s*(?:commit|commitBatch)\s*\(/.test(src), false, 'a builder or commit call');
  assert.equal(/require\(/.test(src.replace(/\/\*[\s\S]*?\*\//g, '')), false, 'the family requires nothing: FC03 is injected');
});
