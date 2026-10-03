/* S11 FC09 - THE NATIVE-LOAD YES AND THE IMPORT, ON A REAL INSTALLATION (PM ruling DECISIONS:878).

   THE DEFECT (cell P3-EN3, diagnosis s11-t4-en3-scratch/EN3-DIAG.md). A "Yes" to
   a new weight on Today writes ONE plan/proposal-response operation through the
   guarded native path (today-entry.mjs -> createNativeLoadHost().respond ->
   local-client respondNativeLoad -> t2-stage.cjs nativeRespond). Local source
   admission had no family for it and refused LOCAL_SOURCE_EFFECT_UNMAPPED at its
   unknown-plan catch, so a person who tapped Yes and then used "Import my
   history" was refused. NATIVE-LOAD-SPEC R9.13 :175-:177 and :228 (FC09) name the
   fix: a shared native-load family dispatched BEFORE that catch, which invokes
   FC03 and folds at the source cut. rebuild/m4/import/native-load-replay.cjs is
   that family, F9.

   THE CELLS. FC09-T1 is the defect itself, and also measures which collections a
   real Yes writes (the diagnosis's INFERRED claim). FC09-T2 runs both delivery
   orders and the repeat replays (spec :177). FC09-T5 reads the shipped
   native-load host over the admitted basis afterwards: the yes is applied, or held
   with its Undo offered, and the Undo retires it, exactly as spec :156-:158 rule,
   and its spend is never counted twice (I4).

   RED FIRST: at 84f8421 FC09-T1, FC09-T2 and FC09-T5 refuse at the import with
   LOCAL_SOURCE_EFFECT_UNMAPPED. NOT RUN on a builder seat: support.mjs seals the
   bundle through port.cjs and admission loads a protected engine file, so these
   cells run where the protected suites run.

   THE YES IS OBTAINED THE WAY A PERSON OBTAINS IT: one whole session on the gym
   card with one lift lifted above its card (an observed load), Finish, then the
   shipped native-load host's check and its respond - the very host today-entry.mjs
   :245 answers through. Nothing is stubbed and no operation is hand-built.

   SYNTHETIC ONLY: the bundle is invented in the OS temp folder through the
   accepted clean-init constructor and sealed by the real port.cjs. No private
   fixture, no ledger, no owner file. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { IDBFactory, sealInventedBundle, eraFor, firstRun, admit, SETUP, IMPORTED_LOADS,
  liveAt, firstRunWith, carry, material, producerRegistryFor } from '../../../m3/w7-preview/import/test/support.mjs';
import { createLocalSourceController, localSourceCommitCapability } from '../../../m3/w6/local/source-admission.mjs';
import { sealed, sealNamed, variant, PHONE, AT, SETUP_DAY, phoneState, CTRL_DAYS } from '../p3-real-shape/real-shape-support.mjs';
import { createWorkoutEntry, createTodayModel } from '../../../m3/w7-preview/today/today-entry.mjs';
import { createGymModel } from '../../../m3/w7-preview/today/gym-model.mjs';
import { createCleanInitState } from '../../../m3/w7-preview/today/setup-model.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';

const NativeLoadEffects = createRequire(import.meta.url)('../../../m4/workout/native-load-effects.cjs');
const SEALED = sealInventedBundle();
/* The day and the pinned installation clock writer-order.test.mjs stands on, for
   its reasons: a day the first run's split trains on, inside the harness's own
   execution calendar, and an EST day so the per-op context check is met honestly. */
const DAY = '2026-11-20';
const CLOCK = { today: () => DAY, now: () => DAY + 'T13:00:00.000Z', tz: '-05:00', monotonicMs: () => 0 };
const EFFORT = { tag: 'exact', value: 2, unit: 'rep' };
/* The six plan-lane collections admission refuses when non-empty
   (source-admission.mjs validateGeneration). */
const PLAN_COLLECTIONS = ['plan', 'planTransactions', 'planTxns', 'planHistory', 'suspensions', 'issuances'];
const ok = (what, r) => assert.equal(r.ok, true, what + ' refused: ' + (r.code || r.copy));
const scopeFor = tag => ({ databaseName: 'p3-fc09-' + tag, namespace: 'joe/p3-fc09-' + tag,
  athleteId: 'ath-p3-fc09', deviceId: 'dev-p3-fc09' });

/* The engine state the gym card stands on before any import, as writer-order.test.mjs
   builds it: the first run's own athlete with a working load per lift. */
function nativeState() {
  const state = JSON.parse(JSON.stringify(createCleanInitState({ setup: SETUP })));
  for (const ex of state.exercises) ex.w = typeof ex.steps?.[0] === 'number' ? ex.steps[0] : 20;
  return state;
}
const open = async (t, tag) => {
  const scope = scopeFor(tag);
  const era = await eraFor({ indexedDB: new IDBFactory(), clock: CLOCK, ...scope });
  t.after(() => era.close());
  await firstRun(era, DAY);
  return { era, scope };
};
const generationOf = async era => (await era.generation()).generation;
const importedState = async (era, scope) => admittedLocalSourceBasis(await generationOf(era), { namespace: scope.namespace });
const responsesOf = async era => Object.values((await generationOf(era)).collections.ops || {})
  .filter(op => op.kind === 'proposal-response').sort((a, b) => a.device_seq - b.device_seq);

/* ONE YES, the way a person gets one. Every slot of the day is logged at its card
   load, except the FIRST lift the card shows, which is logged 5 lb above it; after
   Finish the shipped host offers to adopt that observed load, and the Yes goes
   through host.respond, which is today-entry.mjs:245's call. */
async function yesOnTheCard(era, engineState, day = DAY) {
  const openGym = d => era.createGymHost({ day: d, engineState, plannedSplitSlotId: 'earned-today-preview/' + d });
  const gymHost = await openGym(day);
  const gym = createGymModel({ gymHost, sessionTitle: null, hostForDay: openGym });
  const ready = await gym.read();
  assert.equal(ready.phase, 'ready', 'the gym card would not prepare: ' + (ready.code || ready.phase));
  ok('the start', await gym.start());
  let view = await gym.read();
  const startId = view.startId, total = view.total;
  let lift = null;
  for (let n = 0; n <= total; n += 1) {
    if (view.phase === 'saved' && view.complete !== true) { gym.forget(); view = await gym.read(); }
    if (view.phase !== 'active') break;
    if (lift === null) lift = view.set.lift;
    const load = view.set.lift === lift ? String(Number(view.entry.load) + 5) : view.entry.load;
    ok('the set', await gym.logSet({ startId, slot: view.set.slot, lift: view.set.lift, load, reps: view.entry.reps, effort: EFFORT }));
    view = await gym.read();
  }
  assert.equal(view.complete === true || view.phase === 'complete', true,
    'the card did not reach a complete session: ' + view.phase + ' ' + view.done + '/' + view.total);
  ok('the close', await gym.finish({ startId }));
  gymHost.close();
  const host = await era.createNativeLoadHost({ day, engineState });
  const p = await host.project();
  assert.equal(p.ok, true, 'the native-load host would not project: ' + p.code);
  const done = p.lifts.find(l => l.lift_lineage_id === lift);
  assert.ok(done, 'no completion for ' + lift + ': ' + JSON.stringify(p.lifts));
  const check = await host.check({ lift_lineage_id: lift, completion_op_id: done.completion_op_id });
  assert.equal(check.status, 'offer', 'no offer after an observed load: ' + JSON.stringify(check.refusal));
  const offer = check.offers.find(o => o.lift === lift && o.kind === 'adopt-observed');
  assert.ok(offer, 'no adopt-observed offer: ' + JSON.stringify(check.offers.map(o => [o.lift, o.kind])));
  const yes = await host.respond({ handle: offer.handle, proposal_id: offer.proposalId, answer: 'accept' });
  assert.equal(yes.acknowledged, true, 'the Yes was not saved: ' + (yes.code || JSON.stringify(yes)));
  host.close();
  return { lift, offer, opId: yes.op_id };
}
const f9 = (view, opId) => view.families.filter(r => r.family === 'F9' && r.op_id === opId);
const digests = view => ['operation_digest', 'interpretation_digest', 'programme_digest', 'order_map_digest', 'engine_digest']
  .map(k => [k, view.basis[k]]);

test('FC09-T1 YES-THEN-IMPORT (the defect, EN3-DIAG section 3): a real Yes on Today writes exactly one '
  + 'plan/proposal-response and nothing in any plan collection, and the import that follows ADMITS, with F9 '
  + 'answering for that Yes', async t => {
  const { era, scope } = await open(t, 't1');
  const yes = await yesOnTheCard(era, nativeState());
  const g = await generationOf(era), c = g.collections;
  /* WHAT A YES WRITES, measured (EN3-DIAG section 1 marked this INFERRED). */
  const plans = Object.values(c.ops).filter(op => op.class === 'plan');
  assert.deepEqual(plans.map(op => [op.op_id, op.kind, op.schema_version]), [[yes.opId, 'proposal-response', 1]]);
  assert.deepEqual(Object.keys(plans[0].payload).sort(), ['answer', 'issuance', 'proposal_id']);
  assert.equal(plans[0].payload.answer, 'accept');
  assert.equal(plans[0].payload.proposal_id, yes.offer.proposalId);
  assert.equal(plans[0].payload.issuance.producer, NativeLoadEffects.PRODUCER);
  for (const k of PLAN_COLLECTIONS) assert.deepEqual(Object.keys(c[k] || {}), [],
    'a Yes wrote the ' + k + ' collection, so admission refuses it at validateGeneration before any family');
  const nonEmpty = Object.keys(c).filter(k => c[k] && typeof c[k] === 'object' && Object.keys(c[k]).length).sort();
  t.diagnostic('collections non-empty after the Yes: ' + nonEmpty.join(', '));
  assert.deepEqual(nonEmpty.filter(k => PLAN_COLLECTIONS.includes(k)), []);
  assert.ok(nonEmpty.includes('ops') && nonEmpty.includes('outbox'));

  const result = await admit(era, SEALED, { day: DAY, ...scope });
  assert.equal(result.admitted, true, 'THE DEFECT: a Yes on Today refuses the import: '
    + JSON.stringify(result.codes || result.code || result.stage));
  const rows = f9(result.view, yes.opId);
  assert.equal(rows.length, 1, 'F9 did not answer for the Yes exactly once: ' + JSON.stringify(result.view.families));
  assert.equal(rows[0].state, 'folded', 'FOLDED, not retained (PM ruling)');
  assert.ok(['applied', 'held'].includes(rows[0].outcome), 'outcome ' + rows[0].outcome);
  /* The admitted state is the IMMUTABLE BASE the page folds from (spec B :96), never
     a state the yes was already applied to: the gym card stands on the imported loads. */
  const state = await importedState(era, scope);
  assert.deepEqual(state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS);
  assert.ok(Object.values((await generationOf(era)).collections.ops).some(op => op.op_id === yes.opId), 'the Yes is kept');
});

test('FC09-T2 BOTH ORDERS AND THE REPEATS (spec :177): yes-then-import and import-then-yes each admit the Yes '
  + 'under F9 with the same named outcome, and every repeat replay of one order (reopen, a fresh preparation) '
  + 'reproduces the same basis byte for byte', async t => {
  /* ORDER A: the Yes, then the import. */
  const a = await open(t, 't2a');
  const yesA = await yesOnTheCard(a.era, nativeState());
  const first = await admit(a.era, SEALED, { day: DAY, ...a.scope });
  assert.equal(first.admitted, true, JSON.stringify(first.codes || first.code || first.stage));
  /* REOPEN, twice: the replay capability.reconcile() runs after every publish. */
  for (let n = 0; n < 2; n += 1) {
    const view = await first.controller.view(await first.controller.reopen(first.name));
    assert.equal(JSON.stringify(view.basis), JSON.stringify(first.view.basis), 'reopen ' + n + ' moved the basis');
    assert.deepEqual(view.families, first.view.families, 'reopen ' + n + ' moved the families');
  }
  /* A FRESH PREPARATION of the same source, twice, without publishing: the same fold. */
  const fresh = [];
  for (let n = 0; n < 2; n += 1) {
    const prepared = await first.controller.prepareSource(await first.controller.reviewSource(first.name),
      { identityConfirmed: true, prefixAnswer: true });
    assert.equal(prepared.profile, 'earned/local-source-qualification/v1', JSON.stringify(prepared.issues));
    fresh.push(await first.controller.view(prepared));
  }
  assert.deepEqual(digests(fresh[1]), digests(fresh[0]), 'a repeat preparation is not byte-identical');
  assert.deepEqual(fresh[1].families, fresh[0].families);
  assert.deepEqual(f9(fresh[0], yesA.opId), f9(first.view, yesA.opId), 'a fresh preparation folded the Yes differently');

  /* ORDER B: the import, then the Yes. A workout after an import whose selection
     carries no order map cannot be REOPENED (B-LOM, LOCAL_SOURCE_ORDER_MAP_REQUIRED,
     unchanged here), so the repeat for this order is the fresh preparation the
     screen makes when the question is asked again. */
  const b = await open(t, 't2b');
  const before = await admit(b.era, SEALED, { day: DAY, ...b.scope });
  assert.equal(before.admitted, true, JSON.stringify(before.codes || before.code || before.stage));
  assert.equal(before.view.families.some(r => r.family === 'F9'), false, 'no Yes exists yet');
  const yesB = await yesOnTheCard(b.era, nativeState());
  const again = [];
  for (let n = 0; n < 2; n += 1) {
    const prepared = await before.controller.prepareSource(await before.controller.reviewSource(before.name),
      { identityConfirmed: true, prefixAnswer: true });
    assert.equal(prepared.profile, 'earned/local-source-qualification/v1',
      'import-then-yes: the Yes refuses the repeat import: ' + JSON.stringify(prepared.issues));
    again.push(await before.controller.view(prepared));
  }
  assert.deepEqual(digests(again[1]), digests(again[0]), 'import-then-yes: a repeat preparation is not byte-identical');
  const rowB = f9(again[0], yesB.opId), rowA = f9(first.view, yesA.opId);
  assert.equal(rowB.length, 1, JSON.stringify(again[0].families));
  /* The two orders are two different logs (different op ids, different days of
     record), so their bytes differ; what spec :177 asks of them is the same fold
     or the same named conflict, which is the outcome and its codes. */
  assert.deepEqual([rowB[0].outcome, rowB[0].codes], [rowA[0].outcome, rowA[0].codes],
    'the two delivery orders folded the Yes differently');
});

test('FC09-T5 AFTER ADMISSION (spec :156-:158, I4): the shipped native-load host projects ok over the admitted '
  + 'basis; the Yes is applied, or held with its Undo offered exactly as F9 recorded it; the Undo retires it; '
  + 'and its spend is counted once, through a repeat replay', async t => {
  const { era, scope } = await open(t, 't5');
  const yes = await yesOnTheCard(era, nativeState());
  const result = await admit(era, SEALED, { day: DAY, ...scope });
  assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
  const row = f9(result.view, yes.opId)[0];
  assert.ok(row, 'F9 did not answer for the Yes');
  const imported = await importedState(era, scope);
  const body = (await responsesOf(era))[0].payload.issuance.body;
  const host = await era.createNativeLoadHost({ day: DAY, engineState: imported });
  t.after(() => host.close());
  const p = await host.project();
  assert.equal(p.ok, true, 'the native-load host refuses the admitted basis: ' + p.code);
  assert.equal(p.status, 'ready');
  assert.deepEqual(p.spent.filter(x => x.spend_id === body.spend_id), [{ spend_id: body.spend_id, cancelled: false }],
    'the Yes is not spent exactly once');
  const holds = p.issues.filter(i => i.lift === yes.lift && NativeLoadEffects.HOLD_CODES.includes(i.code) && !i.superseded_by);
  const ex = p.state.exercises.find(e => e.id === yes.lift);
  t.diagnostic('F9 outcome ' + row.outcome + ' ' + JSON.stringify(row.codes) + '; host issues '
    + JSON.stringify(p.issues.map(i => [i.code, i.field, i.lift])));
  if (row.outcome === 'applied') {
    assert.deepEqual(holds, [], 'F9 recorded applied but the page holds the lift');
    assert.equal(ex.w, body.target_load.scalar.value, 'applied: the adopted load is the working weight');
    return;
  }
  /* HELD (spec :158 NO TRAP): the base the Yes was issued on moved under the import,
     so the lift is held by name, its card is the baseline ask, and nothing is lost. */
  assert.equal(row.outcome, 'held', 'F9 outcome ' + row.outcome);
  assert.deepEqual([...new Set(holds.map(i => i.code))].sort(), [...row.codes].filter(c => NativeLoadEffects.HOLD_CODES.includes(c)).sort(),
    'the page holds the lift by a different name than admission folded');
  assert.ok(holds.length, 'F9 recorded held but the page does not hold the lift');
  assert.equal(ex.w, null, 'held: the registered projection is the baseline ask');
  const undo = await host.check({ lift_lineage_id: yes.lift, completion_op_id: body.evidence.at(-1).close.op_id,
    intent: { compensate: body.spend_id } });
  assert.equal(undo.status, 'offer', 'held without its Undo: ' + JSON.stringify(undo.refusal));
  const done = await host.respond({ handle: undo.offers[0].handle, proposal_id: undo.offers[0].proposalId, answer: 'accept' });
  assert.equal(done.acknowledged, true, 'the Undo was not saved: ' + (done.code || JSON.stringify(done)));
  const after = await host.project();
  assert.equal(after.ok, true, after.code);
  assert.deepEqual(after.spent.filter(x => x.spend_id === body.spend_id), [{ spend_id: body.spend_id, cancelled: true }]);
  assert.deepEqual(after.issues.filter(i => i.lift === yes.lift && NativeLoadEffects.HOLD_CODES.includes(i.code) && !i.superseded_by), [],
    'the Undo did not clear the hold');
  /* THE REPEAT REPLAY sees both answers: the Yes retired and its Undo, each once. */
  const reopened = await result.controller.view(await result.controller.reopen(result.name));
  const undoOp = (await responsesOf(era)).find(op => op.op_id !== yes.opId);
  assert.deepEqual([f9(reopened, yes.opId).map(r => r.outcome), f9(reopened, undoOp.op_id).map(r => r.outcome)],
    [['retired'], ['compensation']]);
  const later = await host.project();
  assert.equal(later.spent.filter(x => x.spend_id === body.spend_id).length, 1, 'a repeat replay counted the spend twice');
});

/* FC09-Q1 CONTROLS (PM question on FC09-T5, which refused the Undo's check after the import with the host's issues
   [NATIVE_LOAD_EFFECT_CONFLICT db-bench, PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED governor]). Both cells take F9 OUT of the
   picture: no Yes is ever given, so the log holds no plan operation, admission runs no F9 row, and the native-load host reads
   only what the import and the gym card wrote. The path is the genuine one: support.mjs admit() is the Import screen's own
   sequence (review, the identity Yes with the prefix answer, publish, reconcile), and the host is handed the admitted state,
   which is what today-entry.mjs hostBase() hands it once Today has adopted the import (local-source-basis.mjs).
   Q1-A is T5 WITHOUT THE YES: the same observed workout before the import, then the host's check over the admitted basis.
   The host must project with no performed-order issue; if it refuses PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED, the refusal is
   the import plus a native workout alone, not F9. Its check of that pre-import completion then refuses PLAN_CHANGED [Close]:
   the import changed the working load (SPEC:127/:185; report 11.1, accepted at DECISIONS:880 (1)).
   Q1-B is the import with NO native workout: the engine has no native Start to order against the imported log, so the host
   projects with no performed-order issue. Together they locate the cause at the native-load host over a basis carrying an
   imported log AND a native Start. */
const performedIssues = p => p.issues.filter(i => /^PERFORMED_/.test(i.code)).map(i => [i.code, i.field, i.lift]);
test('FC09-Q1-A CONTROL, T5 WITHOUT THE YES: the same observed workout before the import, no Yes, the genuine import; the '
  + 'native-load host over the admitted basis projects with no performed-order issue, and its check of that completion '
  + 'refuses PLAN_CHANGED [Close] (spec :127, :185, :156-:158)', async t => {
  const { era, scope } = await open(t, 'q1a');
  const engineState = nativeState();
  const openGym = d => era.createGymHost({ day: d, engineState, plannedSplitSlotId: 'earned-today-preview/' + d });
  const gymHost = await openGym(DAY);
  const gym = createGymModel({ gymHost, sessionTitle: null, hostForDay: openGym });
  assert.equal((await gym.read()).phase, 'ready');
  ok('the start', await gym.start());
  let view = await gym.read();
  const startId = view.startId, total = view.total;
  let lift = null;
  for (let n = 0; n <= total; n += 1) {
    if (view.phase === 'saved' && view.complete !== true) { gym.forget(); view = await gym.read(); }
    if (view.phase !== 'active') break;
    if (lift === null) lift = view.set.lift;
    ok('the set', await gym.logSet({ startId, slot: view.set.slot, lift: view.set.lift,
      load: view.set.lift === lift ? String(Number(view.entry.load) + 5) : view.entry.load, reps: view.entry.reps, effort: EFFORT }));
    view = await gym.read();
  }
  ok('the close', await gym.finish({ startId }));
  gymHost.close();
  /* Before the import the same host offers (this is the Yes T5 took). */
  const before = await era.createNativeLoadHost({ day: DAY, engineState });
  const p0 = await before.project();
  const done = p0.lifts.find(l => l.lift_lineage_id === lift);
  const c0 = await before.check({ lift_lineage_id: lift, completion_op_id: done.completion_op_id });
  before.close();
  assert.equal(c0.status, 'offer', 'control precondition: no offer even before the import: ' + JSON.stringify(c0.refusal));
  const result = await admit(era, SEALED, { day: DAY, ...scope });
  assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
  assert.equal((await responsesOf(era)).length, 0, 'no Yes was given, so the log holds no proposal-response');
  assert.equal(result.view.families.some(r => r.family === 'F9'), false, 'F9 answered for nothing');
  const host = await era.createNativeLoadHost({ day: DAY, engineState: await importedState(era, scope) });
  t.after(() => host.close());
  const p = await host.project();
  t.diagnostic('Q1-A host after import: ok ' + p.ok + ' status ' + p.status + ' issues ' + JSON.stringify((p.issues || []).map(i => [i.code, i.field, i.lift])));
  assert.equal(p.ok, true, p.code);
  const c = await host.check({ lift_lineage_id: lift, completion_op_id: done.completion_op_id });
  t.diagnostic('Q1-A check after import: ' + c.status + ' ' + JSON.stringify(c.refusal));
  assert.deepEqual(performedIssues(p), [], 'the host over the admitted basis raises a performed-order issue with NO Yes in the log');
  /* ASSERTION CHANGED IN ROUND 4 (PM request after the round-3 PM run; the reviewers are asked to judge this change). The
     round-2 cell asserted an OFFER here. That was wrong against the spec. The completion checked is the PRE-import one; its
     Start captured the first-run card load, and the import replaced the lift's working weight with the file's. SPEC:127
     (evaluation step 2): "Resolve the current authorised plan and the completed Start's capture. If deliberate load,
     set-count, technique or governing plan identity changed since that completion, refuse the applicable code below; an
     older completion cannot silently replace a newer athlete choice." The named code is PLAN_CHANGED, and SPEC:185 gives
     its refs: "[Close Ref, superseding plan op Ref], or [Close Ref] alone when no authenticated plan op carries the change".
     An import is not a plan op, so the refs are the checked completion's Close Ref alone, field null, and no offer. The
     precondition below makes the cell measure exactly that case: the imported working weight differs from the captured card.
     The performed-order assertion above, which is what Q1-A was written to catch, is unchanged. */
  const captured = engineState.exercises.find(e => e.id === lift).w;
  const importedW = (await importedState(era, scope)).exercises.find(e => e.id === lift).w;
  assert.notEqual(importedW, captured, 'precondition: the import moved ' + lift + '\'s working weight off the captured card');
  assert.equal(c.status, 'refused', 'a pre-import completion was offered over a programme the import changed: ' + JSON.stringify(c.offers));
  assert.deepEqual(c.offers, []);
  assert.equal(c.refusal && c.refusal.code, 'NATIVE_LOAD_PLAN_CHANGED', 'SPEC:127 step 2 names PLAN_CHANGED: ' + JSON.stringify(c.refusal));
  assert.deepEqual(c.refusal.refs.map(r => r.op_id), [done.completion_op_id], 'SPEC:185: [Close Ref] alone, no plan op carries an import');
  assert.equal(c.refusal.field, null);
});

test('FC09-Q1-B CONTROL, THE IMPORT ALONE: no native workout and no Yes; the native-load host over the admitted basis '
  + 'projects with no performed-order issue', async t => {
  const { era, scope } = await open(t, 'q1b');
  const result = await admit(era, SEALED, { day: DAY, ...scope });
  assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
  const host = await era.createNativeLoadHost({ day: DAY, engineState: await importedState(era, scope) });
  t.after(() => host.close());
  const p = await host.project();
  t.diagnostic('Q1-B host after import: ok ' + p.ok + ' status ' + p.status + ' issues ' + JSON.stringify((p.issues || []).map(i => [i.code, i.field, i.lift])));
  assert.equal(p.ok, true, p.code);
  assert.equal(p.status, 'ready');
  assert.deepEqual(performedIssues(p), []);
});

/* ROUND 3 (PM ruling DECISIONS:879: build options (i) and (iii) of s11-fc09-scratch/Q1-SEAM-DESIGN.md). RED FIRST at the
   round-2 tree. The native-load engine read an imported log without the legacy-order baseline the gym card's own reads carry
   (today-bindings.mjs composed()), and the engine's governor copied the state so that no caller could supply one. These cells
   state what genuine use needs once that seam is closed; Q1-A and T5 above keep their assertions unchanged. */
const LiftCorrespondence = createRequire(import.meta.url)('../../../m4/workout/lift-correspondence.cjs');
const activeCodes = issues => [...new Set((issues || []).filter(i => i && !i.superseded_by).map(i => i.code))].sort();
/* One whole session with ONE chosen lift lifted 5 lb above its card (the first card lift `pick` accepts), then Finish.
   ROUND 6 (PM request, diagnosis (1); FC09-Q3-D measured "the set refused: Enter the weight and reps you actually
   completed."). That sentence is gym-model.mjs:39 ENTER_PERFORMED, returned at :502-506 and ONLY there: a FORM bound,
   checked before any write, on an EMPTY load or reps box. This fixture used to send the card's prefilled box back
   verbatim, and a card prefills nothing where it asks for a baseline (no working weight on file). A person types a
   number into that box, so the fixture now does the same - 20 lb, and the window's 8 reps - and RECORDS every empty box
   in `blank`, so a cell can prove the box was empty for a lift that genuinely has no working weight, not for one that
   has (a defect in core logging, which a cell must report rather than type past). */
async function observedWorkout(era, day, engineState, pick = () => true, { effort = EFFORT, top = null } = {}) {
  const openGym = d => era.createGymHost({ day: d, engineState, plannedSplitSlotId: 'earned-today-preview/' + d });
  const gymHost = await openGym(day);
  const gym = createGymModel({ gymHost, sessionTitle: null, hostForDay: openGym });
  const ready = await gym.read();
  assert.equal(ready.phase, 'ready', 'the gym card would not prepare: ' + (ready.code || ready.phase));
  ok('the start', await gym.start());
  let view = await gym.read();
  const startId = view.startId, total = view.total, seen = [], lifted = [], blank = [];
  let lift = null, card = null;
  for (let n = 0; n <= total; n += 1) {
    if (view.phase === 'saved' && view.complete !== true) { gym.forget(); view = await gym.read(); }
    if (view.phase !== 'active') break;
    if (!seen.includes(view.set.lift)) seen.push(view.set.lift);
    const empty = x => x === '' || x === null || x === undefined;
    if (empty(view.entry.load) || empty(view.entry.reps))
      blank.push({ lift: view.set.lift, slot: view.set.slot, load: empty(view.entry.load), reps: empty(view.entry.reps) });
    if (lift === null && pick(view.set.lift)) { lift = view.set.lift; card = empty(view.entry.load) ? null : Number(view.entry.load); }
    const shown = empty(view.entry.load) ? null : Number(view.entry.load);
    /* Round 9: `top` logs the chosen lift at its card's own load and `top` reps (a session at the top of the window), not 5 lb over. */
    const load = view.set.lift === lift ? String(shown === null ? 20 : top === null ? shown + 5 : shown) : shown === null ? '20' : view.entry.load;
    const reps = view.set.lift === lift && top !== null ? top : empty(view.entry.reps) ? '8' : view.entry.reps;
    if (view.set.lift === lift) lifted.push(Number(load));
    ok('the set', await gym.logSet({ startId, slot: view.set.slot, lift: view.set.lift, load, reps,
      effort: view.set.lift === lift ? effort : EFFORT }));
    view = await gym.read();
  }
  ok('the close', await gym.finish({ startId }));
  gymHost.close();
  return { lift, seen, card, lifted, blank };
}
/* The shipped host's check for that lift's completion, and (when `yes`) the Yes through host.respond. */
async function checkAndAnswer(era, day, engineState, lift, { yes = true } = {}) {
  const host = await era.createNativeLoadHost({ day, engineState });
  const p = await host.project();
  assert.equal(p.ok, true, 'the native-load host would not project: ' + p.code);
  const done = p.lifts.find(l => l.lift_lineage_id === lift);
  assert.ok(done, 'no completion for ' + lift + ': ' + JSON.stringify(p.lifts));
  const check = await host.check({ lift_lineage_id: lift, completion_op_id: done.completion_op_id });
  let saved = null;
  if (yes) {
    assert.equal(check.status, 'offer', 'no offer: ' + JSON.stringify(check.refusal));
    const offer = check.offers.find(o => o.lift === lift && o.kind === 'adopt-observed');
    assert.ok(offer, 'no adopt-observed offer: ' + JSON.stringify(check.offers.map(o => [o.lift, o.kind])));
    saved = await host.respond({ handle: offer.handle, proposal_id: offer.proposalId, answer: 'accept' });
    assert.equal(saved.acknowledged, true, 'the Yes was not saved: ' + (saved.code || JSON.stringify(saved)));
  }
  host.close();
  return { p, check, opId: saved && saved.op_id };
}

test('FC09-Q1-C GYM CARD AND NATIVE-LOAD AGREE ON ONE IMPORTED BASIS (spec :155, :164 "both new captures and Today read that '
  + 'same projection"): after a workout before the import and the genuine import, the next day\'s gym card prescribes, for '
  + 'every lift on it, the working weight the native-load host projects, and neither projection meets a performed-order refusal', async t => {
  const { era, scope } = await open(t, 'q1c');
  await observedWorkout(era, DAY, nativeState());
  const result = await admit(era, SEALED, { day: DAY, ...scope });
  assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
  const NEXT = '2026-11-21';   // the first run's split trains L on Saturday; a day the harness calendar names
  const imported = await importedState(era, scope);
  const host = await era.createNativeLoadHost({ day: NEXT, engineState: imported });
  t.after(() => host.close());
  const p = await host.project();
  t.diagnostic('Q1-C host issues ' + JSON.stringify((p.issues || []).map(i => [i.code, i.field, i.lift])));
  assert.equal(p.ok, true, p.code);
  assert.deepEqual(activeCodes(p.issues).filter(c => /^PERFORMED_/.test(c)), [], 'the native-load projection refuses the imported order');
  const gymHost = await era.createGymHost({ day: NEXT, engineState: imported, plannedSplitSlotId: 'earned-today-preview/' + NEXT });
  t.after(() => gymHost.close());
  const card = await gymHost.host.client.prepareWorkout({ planned_split_slot_id: 'earned-today-preview/' + NEXT });
  assert.equal(card.prepared, true, 'the gym card would not prepare on the imported basis: ' + card.code);
  const slots = card.view.slots.filter(s => s.load && typeof s.load.display === 'string');
  assert.ok(slots.length > 0, 'the card prescribes no load, so this cell measures nothing');
  for (const s of slots) {
    const ex = p.state.exercises.find(e => e.id === s.lift_lineage_id);
    assert.ok(ex && typeof ex.w === 'number', 'the native projection has no working weight for ' + s.lift_lineage_id);
    assert.match(s.load.display, new RegExp('^' + ex.w + ' lb'), s.lift_lineage_id + ': the card says ' + s.load.display
      + ', the native-load projection says ' + ex.w);
  }
});

test('FC09-Q1-D IMPORT, THEN TRAIN ON THE ADOPTED BASIS, THEN CHECK (spec :155 check on every projection; the genuine '
  + 'import-then-train order): a workout recorded on the imported basis Today adopts is offered by the shipped host, and the '
  + 'host\'s projection meets no performed-order refusal', async t => {
  const { era, scope } = await open(t, 'q1d');
  const result = await admit(era, SEALED, { day: DAY, ...scope });
  assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
  const imported = await importedState(era, scope);
  const { lift, card, lifted } = await observedWorkout(era, DAY, imported);
  const { p, check } = await checkAndAnswer(era, DAY, imported, lift, { yes: false });
  t.diagnostic('Q1-D host issues ' + JSON.stringify((p.issues || []).map(i => [i.code, i.field, i.lift])) + '; check '
    + check.status + ' ' + JSON.stringify(check.refusal) + ' offers ' + JSON.stringify((check.offers || []).map(o => [o.lift, o.kind, o.loads, o.current])));
  assert.deepEqual(activeCodes(p.issues).filter(c => /^PERFORMED_/.test(c)), [], 'the projection refuses the imported order');
  /* WHAT A PERSON SEES (round 4, made exact): the workout was captured on the CURRENT, imported card, so SPEC:127 step 2
     passes; every original set was lifted at one load other than the card's, so SPEC:128 step 3 makes it "an ADOPTION
     choice": exactly one offer for that lift, adopt-observed, of the loads he lifted, over the card he was given. */
  assert.equal(check.status, 'offer', 'a workout on the imported basis is not offered: ' + JSON.stringify(check.refusal));
  assert.equal(check.refusal, null);
  const offers = check.offers.filter(o => o.lift === lift);
  assert.deepEqual(offers.map(o => o.kind), ['adopt-observed'], JSON.stringify(check.offers));
  assert.ok(lifted.length > 0 && lifted.every(x => x === card + 5), 'precondition: every set of ' + lift + ' lifted at card + 5');
  assert.deepEqual(offers[0].loads, lifted, 'the offer is not the loads he lifted');
  assert.ok(offers[0].current.every(x => x === card), 'the offer is not over the card he was given: ' + JSON.stringify(offers[0].current));
});

test('FC09-Q1-E ADMISSION AND PAGE FOLD THE SAME (spec :176-:177; I7): after a Yes and the genuine import, the codes of every '
  + 'issue F9\'s admission fold met equal those of the shipped host\'s fold over the admitted basis, and neither holds a '
  + 'performed-order refusal', async t => {
  const { era, scope } = await open(t, 'q1e');
  const yes = await yesOnTheCard(era, nativeState());
  const result = await admit(era, SEALED, { day: DAY, ...scope });
  assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
  const row = f9(result.view, yes.opId)[0];
  assert.ok(row, 'F9 did not answer for the Yes');
  const host = await era.createNativeLoadHost({ day: DAY, engineState: await importedState(era, scope) });
  t.after(() => host.close());
  const p = await host.project();
  assert.equal(p.ok, true, p.code);
  t.diagnostic('Q1-E admission ' + JSON.stringify(row.fold_codes) + '; page ' + JSON.stringify(activeCodes(p.issues)));
  assert.ok(Array.isArray(row.fold_codes), 'F9 rows carry no fold_codes');
  assert.deepEqual(row.fold_codes, activeCodes(p.issues), 'admission and the page folded the Yes differently');
  assert.deepEqual(row.fold_codes.filter(c => /^PERFORMED_/.test(c)), [], 'the fold meets a performed-order refusal');
});

/* Q3 (FC09-REPORT 7 Q3; Q1-SEAM-DESIGN 2): THE FILE NAMES A LIFT BY ITS OWN ID. The owner's real-shape file carries short
   handles; admission corresponds each phone lift to a file lift BY NAME (P3-REAL-SHAPE 2.5) and the admitted state carries
   the FILE's id. A Yes given before the import names the PHONE's slug. Spec :158 NO TRAP and :154: after the import the
   Yes is applied or held ON THAT LIFT (by its admitted id) with its Undo offered, and admission and the page agree. */
test('FC09-Q3 A YES ON A LIFT THE FILE NAMES BY ANOTHER ID (spec :154, :158; P3-REAL-SHAPE 2.5): the Yes on a corresponded '
  + 'lift is admitted, held or applied on the file\'s lift and never on no lift, and admission and the page agree', async t => {
  const WORKOUT = '2026-09-18', IMPORT = '2026-09-19';
  const fileLifts = variant(1).exercises, fileIds = new Set(fileLifts.map(e => e.id));
  const scope = { databaseName: 'p3-fc09-q3', namespace: 'joe/p3-fc09-q3', athleteId: 'ath-p3-fc09', deviceId: 'dev-p3-fc09' };
  const era = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(AT(WORKOUT)), ...scope });
  t.after(() => era.close());
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  const engineState = phoneState();
  const { lift, seen } = await observedWorkout(era, WORKOUT, engineState, id => !fileIds.has(id));
  assert.ok(lift, 'precondition: no lift on the card is named differently by the file: ' + JSON.stringify(seen));
  const phoneName = PHONE.setup.exercises.find(e => e.id === lift).n;
  const fileLift = fileLifts.filter(e => LiftCorrespondence.normaliseName(e.n) === LiftCorrespondence.normaliseName(phoneName));
  assert.equal(fileLift.length, 1, 'precondition: ' + lift + ' corresponds to exactly one file lift');
  const { opId } = await checkAndAnswer(era, WORKOUT, engineState, lift);
  const { carried, platform } = await carry(era, sealed(1));
  assert.equal(carried.imported, true, 'custody refused: ' + carried.code);
  const held = await material(era, platform, carried.name);
  const controller = createLocalSourceController({ repository: held.repository, ...scope,
    producerRegistry: producerRegistryFor({ platform, context: held.context, materialDigest: held.materialDigest }, { days: CTRL_DAYS }),
    asOf: () => IMPORT, platform });
  const prepared = await controller.prepareSource(await controller.reviewSource(carried.name), { identityConfirmed: true, prefixAnswer: true });
  assert.equal(prepared.profile, 'earned/local-source-qualification/v1', 'the import refused: ' + JSON.stringify(prepared.issues));
  const view = await controller.view(prepared);
  const capability = localSourceCommitCapability(prepared);
  await capability.publish(); await capability.reconcile();
  const row = f9(view, opId)[0];
  assert.ok(row, 'F9 did not answer for the Yes');
  const host = await era.createNativeLoadHost({ day: IMPORT, engineState: await importedState(era, scope) });
  t.after(() => host.close());
  const p = await host.project();
  assert.equal(p.ok, true, p.code);
  const naming = (p.issues || []).filter(i => !i.superseded_by && (i.refs || []).some(r => r && r.op_id === opId));
  t.diagnostic('Q3 ' + lift + ' -> ' + fileLift[0].id + '; F9 ' + row.outcome + ' ' + JSON.stringify(row.codes) + '; page '
    + JSON.stringify(naming.map(i => [i.code, i.field, i.lift])));
  assert.deepEqual(activeCodes(naming), row.codes, 'admission and the page judged the Yes differently');
  assert.deepEqual(naming.filter(i => i.lift !== fileLift[0].id).map(i => [i.code, i.field, i.lift]), [],
    'the Yes is held on no lift, or on a lift the admitted state does not carry, instead of on ' + fileLift[0].id);
});

/* Q3-B..Q3-E (round 5, PM ruling DECISIONS:880 (3)): RED FIRST, and written as the SPEC's required behaviour, independent of
   how the seam is closed. The real-shape path of FC09-Q3 (unchanged above): the phone slug corresponds by name to a file lift
   with another id; a Yes on it before the import; the import. A native record follows its lift to the file's id
   (P3-REAL-SHAPE option A, DECISIONS:520-521: a change of address, not content), so after the import the page must judge it
   on the FILE's lift, keep every other lift's checks free, and offer on that lift again after the next saved workout. */
async function realShapeYes(t, tag) {
  const WORKOUT = '2026-09-18', IMPORT = '2026-09-19';
  const fileLifts = variant(1).exercises, fileIds = new Set(fileLifts.map(e => e.id));
  const scope = { databaseName: 'p3-fc09-' + tag, namespace: 'joe/p3-fc09-' + tag, athleteId: 'ath-p3-fc09', deviceId: 'dev-p3-fc09' };
  const era = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(AT(WORKOUT)), ...scope });
  t.after(() => era.close());
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  const engineState = phoneState();
  const { lift, seen } = await observedWorkout(era, WORKOUT, engineState, id => !fileIds.has(id));
  assert.ok(lift, 'precondition: no lift on the card is named differently by the file: ' + JSON.stringify(seen));
  const phoneName = PHONE.setup.exercises.find(e => e.id === lift).n;
  const fileLift = fileLifts.filter(e => LiftCorrespondence.normaliseName(e.n) === LiftCorrespondence.normaliseName(phoneName));
  assert.equal(fileLift.length, 1, 'precondition: ' + lift + ' corresponds to exactly one file lift');
  const other = seen.find(id => id !== lift);
  const { opId } = await checkAndAnswer(era, WORKOUT, engineState, lift);
  const { carried, platform } = await carry(era, sealed(1));
  assert.equal(carried.imported, true, 'custody refused: ' + carried.code);
  const held = await material(era, platform, carried.name);
  const controller = createLocalSourceController({ repository: held.repository, ...scope,
    producerRegistry: producerRegistryFor({ platform, context: held.context, materialDigest: held.materialDigest }, { days: CTRL_DAYS }),
    asOf: () => IMPORT, platform });
  const prepared = await controller.prepareSource(await controller.reviewSource(carried.name), { identityConfirmed: true, prefixAnswer: true });
  assert.equal(prepared.profile, 'earned/local-source-qualification/v1', 'the import refused: ' + JSON.stringify(prepared.issues));
  const view = await controller.view(prepared);
  const capability = localSourceCommitCapability(prepared);
  await capability.publish(); await capability.reconcile();
  const body = (await responsesOf(era)).find(op => op.op_id === opId).payload.issuance.body;
  return { era, scope, lift, fileLift: fileLift[0].id, other, opId, body, view, IMPORT, imported: await importedState(era, scope) };
}

test('FC09-Q3-B THE HELD YES\'S UNDO IS OFFERED ON THE FILE\'S LIFT (spec :154, :158): over the admitted basis the Undo of the '
  + 'pre-import Yes is offered for the file\'s lift, its yes is saved, and the spend is retired, counted once', async t => {
  const r = await realShapeYes(t, 'q3b');
  const host = await r.era.createNativeLoadHost({ day: r.IMPORT, engineState: r.imported });
  t.after(() => host.close());
  const p = await host.project();
  assert.equal(p.ok, true, p.code);
  const undo = await host.check({ lift_lineage_id: r.fileLift, completion_op_id: r.body.evidence.at(-1).close.op_id,
    intent: { compensate: r.body.spend_id } });
  t.diagnostic('Q3-B undo ' + undo.status + ' ' + JSON.stringify(undo.refusal));
  assert.equal(undo.status, 'offer', 'the held Yes has no Undo on ' + r.fileLift + ': ' + JSON.stringify(undo.refusal));
  /* Round 6: the Undo's RECORD keeps the Yes's own id (the round-6 ruling); the page shows it on the file's lift. */
  assert.equal(undo.offers[0].lift, r.fileLift, 'the page shows the Undo on the file\'s lift');
  const done = await host.respond({ handle: undo.offers[0].handle, proposal_id: undo.offers[0].proposalId, answer: 'accept' });
  assert.equal(done.acknowledged, true, done.code);
  const after = await host.project();
  assert.deepEqual(after.spent.filter(x => x.spend_id === r.body.spend_id), [{ spend_id: r.body.spend_id, cancelled: true }]);
});

test('FC09-Q3-C NO LIFT-LESS HOLD (spec :158 "a record ... makes ONLY its own lift\'s new native prescription unavailable"): '
  + 'after the import no issue holds no lift, and a check on ANOTHER lift is answered by that lift\'s own rules', async t => {
  const r = await realShapeYes(t, 'q3c');
  const host = await r.era.createNativeLoadHost({ day: r.IMPORT, engineState: r.imported });
  t.after(() => host.close());
  const p = await host.project();
  assert.equal(p.ok, true, p.code);
  t.diagnostic('Q3-C issues ' + JSON.stringify(p.issues.map(i => [i.code, i.field, i.lift])));
  assert.deepEqual(p.issues.filter(i => !i.superseded_by && NativeLoadEffects.HOLD_CODES.includes(i.code) && i.lift === null)
    .map(i => [i.code, i.field]), [], 'a hold on NO lift holds back every check');
  assert.ok(r.other, 'precondition: the card carried a second lift');
  const otherFile = (p.lifts || []).find(l => l.lift_lineage_id === r.other)
    || (p.lifts || []).find(l => l.lift_lineage_id !== r.lift && l.lift_lineage_id !== r.fileLift);
  assert.ok(otherFile, 'precondition: a completion of another lift: ' + JSON.stringify(p.lifts));
  const c = await host.check({ lift_lineage_id: otherFile.lift_lineage_id, completion_op_id: otherFile.completion_op_id });
  t.diagnostic('Q3-C other-lift check ' + c.status + ' ' + JSON.stringify(c.refusal));
  assert.ok(c.status === 'offer' || !(c.refusal && c.refusal.code === 'NATIVE_LOAD_RECORD_INVALID'),
    'another lift is refused by the corresponded lift\'s hold: ' + JSON.stringify(c.refusal));
});

test('FC09-Q3-D IMPORT, THEN TRAIN THE CORRESPONDED LIFT, THEN CHECK (spec :127-:128; :156, :158 TRAINABLE WHILE HELD and '
  + 'exit (b)): a workout on the adopted basis is offered on the file\'s lift: adopt-observed of the loads lifted over the card '
  + 'given, or, while the pre-import Yes holds that lift, its adoption exit', async t => {
  const r = await realShapeYes(t, 'q3d');
  const NEXT = '2026-09-25';   // the phone's split trains the same day again a week later
  const { lift, card, lifted, blank } = await observedWorkout(r.era, NEXT, r.imported, id => id === r.fileLift);
  t.diagnostic('Q3-D card ' + lift + ' ' + card + ' lifted ' + JSON.stringify(lifted) + ' empty boxes ' + JSON.stringify(blank));
  assert.equal(lift, r.fileLift, 'precondition: the adopted card prescribes ' + r.fileLift);
  /* Diagnosis (1), proved either way on the real page path: an empty LOAD box on a set the admitted state DOES prescribe a
     NUMERIC load for is a defect in core logging, not this fixture. ROUND 6 (PM section K, K16): corrected to read what the box
     is filled from. gym-model.mjs:366 fills it only with a finite load.value from the captured load cell (:53 specified); a
     configuration working load (the old app's 'hold' or 'BW', kept as written at variant(1); engine-capture.cjs:27/:75 caps it
     {kind:'configuration'}) and a baseline ask (w null) both leave it empty BY THAT RULE, at 84f8421 too (gym-model.mjs,
     engine-capture.cjs and progression.cjs are unchanged since; documented at gym-model.mjs:253-256). The planned load of a set
     is planVector's (E/progression.cjs:80-82): wSets at its position, else w. */
  const planned = (ex, position) => (Array.isArray(ex.wSets) && ex.wSets.length
    ? ex.wSets[Math.min(position, ex.wSets.length) - 1] ?? ex.w : ex.w);
  for (const b of blank.filter(x => x.load && x.lift !== r.fileLift)) {
    const ex = r.imported.exercises.find(e => e.id === b.lift) || {}, at = planned(ex, JSON.parse(b.slot)[1]);
    assert.ok(!(typeof at === 'number' && Number.isFinite(at)),
      'REAL DEFECT, NOT THE FIXTURE: the card showed an empty load box on ' + b.slot + ', which the admitted state prescribes ' + at + ' lb');
  }
  const host = await r.era.createNativeLoadHost({ day: NEXT, engineState: r.imported });
  t.after(() => host.close());
  const p = await host.project();
  assert.equal(p.ok, true, p.code);
  const done = (p.lifts || []).find(l => l.lift_lineage_id === r.fileLift);
  assert.ok(done, 'the page has no completion of ' + r.fileLift + ': ' + JSON.stringify(p.lifts));
  const check = await host.check({ lift_lineage_id: r.fileLift, completion_op_id: done.completion_op_id });
  t.diagnostic('Q3-D check ' + check.status + ' ' + JSON.stringify(check.refusal) + ' offers '
    + JSON.stringify((check.offers || []).map(o => [o.lift, o.kind, o.loads, o.current])));
  assert.equal(check.status, 'offer', JSON.stringify(check.refusal));
  const offers = check.offers.filter(o => o.lift === r.fileLift);
  /* ASSERTION CHANGED IN ROUND 6 (before any green; the reviewers are asked to judge it by name). The round-5 draft asserted
     adopt-observed over the card unconditionally. When the import moved this lift's base off the one the Yes was issued on,
     SPEC :156 UNPROVABLE ORDER holds the lift EFFECT_CONFLICT (field load_basis) on the file's lift, with the spend kept;
     :158 TRAINABLE WHILE HELD then projects its working weight null, so the card asks for a baseline, and exit (b) is the
     adoption a check offers: adopt-baseline, every current position null. The unheld case keeps the round-5 assertion
     exactly. Which case the fixture is in is read from the page's own fold, named, and printed. */
  const heldByYes = (p.issues || []).some(i => !i.superseded_by && i.lift === r.fileLift && i.code === 'NATIVE_LOAD_EFFECT_CONFLICT'
    && i.field === 'load_basis' && (i.refs || []).some(x => x && x.op_id === r.opId));
  t.diagnostic('Q3-D held by the pre-import Yes: ' + heldByYes);
  if (heldByYes) {
    assert.equal(card, null, 'SPEC :158: a held lift\'s card asks for a baseline');
    assert.deepEqual(offers.map(o => o.kind), ['adopt-baseline']);
    assert.deepEqual(offers[0].loads, lifted);
    assert.ok(offers[0].current.every(x => x === null));
  } else {
    assert.deepEqual(offers.map(o => o.kind), ['adopt-observed']);
    assert.deepEqual(offers[0].loads, lifted);
    assert.ok(offers[0].current.every(x => x === card));
  }
});

test('FC09-Q3-E ADMISSION AND PAGE FOLD THE SAME ON THE REAL SHAPE (spec :176-:177; I7): F9\'s fold codes equal the page\'s, '
  + 'and the Yes is judged on the file\'s lift on both sides', async t => {
  const r = await realShapeYes(t, 'q3e');
  const row = f9(r.view, r.opId)[0];
  assert.ok(row, 'F9 did not answer for the Yes');
  const host = await r.era.createNativeLoadHost({ day: r.IMPORT, engineState: r.imported });
  t.after(() => host.close());
  const p = await host.project();
  assert.equal(p.ok, true, p.code);
  t.diagnostic('Q3-E admission ' + JSON.stringify(row.fold_codes) + '; page ' + JSON.stringify(activeCodes(p.issues)));
  assert.deepEqual(row.fold_codes, activeCodes(p.issues), 'admission and the page folded the Yes differently');
  assert.deepEqual(p.issues.filter(i => !i.superseded_by && (i.refs || []).some(x => x && x.op_id === r.opId) && i.lift !== r.fileLift)
    .map(i => [i.code, i.lift]), [], 'the Yes is judged on no lift, or not on ' + r.fileLift);
});

/* ROUND 7 (PM ruling DECISIONS:882, B1 and B2 BLOCKING; Astra S11-FC09-REVIEW-L1). The REAL-PAGE AND ADMISSION FORMS of the
   seam FC12's FC09-LINEAGE-B1A/B1B/B2 rows pin over FC03 directly: the person trains the phone's lift BEFORE the import, the
   file names it by another id, and every native-load judgement after the import must read those workouts as the file lift's
   own (the page projects them under the phone's id and never re-keys; admission's F9 folds the same projection). RED at the
   round-6 FC03 (19ae7efc). */
async function realShapeHistory(t, tag, { workouts, importDay, prepare = null, file = null }) {
  const fileLifts = variant(1).exercises, fileIds = new Set(fileLifts.map(e => e.id));
  const scope = { databaseName: 'p3-fc09-' + tag, namespace: 'joe/p3-fc09-' + tag, athleteId: 'ath-p3-fc09', deviceId: 'dev-p3-fc09' };
  const era = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(AT(workouts[0].day)), ...scope });
  t.after(() => era.close());
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  const engineState = phoneState();
  if (prepare) prepare(engineState);
  let lift = null;
  const done = [];
  for (const w of workouts) {
    const r = await observedWorkout(era, w.day, engineState, id => (lift === null ? !fileIds.has(id) : id === lift), { effort: w.effort, top: w.top || null });
    assert.ok(r.lift, 'precondition: no lift on the ' + w.day + ' card is named differently by the file: ' + JSON.stringify(r.seen));
    lift = r.lift;
    const host = await era.createNativeLoadHost({ day: w.day, engineState });
    const p = await host.project();
    const completion = p.lifts.find(l => l.lift_lineage_id === lift);
    let opId = null;
    if (w.yes) {
      const check = await host.check({ lift_lineage_id: lift, completion_op_id: completion.completion_op_id });
      assert.equal(check.status, 'offer', 'no offer before the import: ' + JSON.stringify(check.refusal));
      const kind = w.yes === 'earn' ? 'earn' : 'adopt-observed';
      const offer = check.offers.find(o => o.lift === lift && o.kind === kind);
      assert.ok(offer, 'no ' + kind + ' offer: ' + JSON.stringify(check.offers.map(o => [o.lift, o.kind])));
      const saved = await host.respond({ handle: offer.handle, proposal_id: offer.proposalId, answer: 'accept' });
      assert.equal(saved.acknowledged, true, 'the Yes was not saved: ' + (saved.code || JSON.stringify(saved)));
      opId = saved.op_id;
    }
    host.close();
    done.push({ ...r, close: completion.completion_op_id, opId });
  }
  const phoneName = PHONE.setup.exercises.find(e => e.id === lift).n;
  const fileLift = fileLifts.filter(e => LiftCorrespondence.normaliseName(e.n) === LiftCorrespondence.normaliseName(phoneName));
  assert.equal(fileLift.length, 1, 'precondition: ' + lift + ' corresponds to exactly one file lift');
  const phoneEx = JSON.parse(JSON.stringify(engineState.exercises.find(e => e.id === lift)));
  const { carried, platform } = await carry(era, file ? file(lift, phoneEx) : sealed(1));
  assert.equal(carried.imported, true, 'custody refused: ' + carried.code);
  const held = await material(era, platform, carried.name);
  const controller = createLocalSourceController({ repository: held.repository, ...scope,
    producerRegistry: producerRegistryFor({ platform, context: held.context, materialDigest: held.materialDigest }, { days: CTRL_DAYS }),
    asOf: () => importDay, platform });
  const prepared = await controller.prepareSource(await controller.reviewSource(carried.name), { identityConfirmed: true, prefixAnswer: true });
  assert.equal(prepared.profile, 'earned/local-source-qualification/v1', 'the import refused: ' + JSON.stringify(prepared.issues));
  const view = await controller.view(prepared);
  const capability = localSourceCommitCapability(prepared);
  await capability.publish(); await capability.reconcile();
  const imported = await importedState(era, scope);
  const host = await era.createNativeLoadHost({ day: importDay, engineState: imported });
  t.after(() => host.close());
  const p = await host.project();
  assert.equal(p.ok, true, p.code);
  /* Round 9b: the lift the ADMITTED state carries for that name (the file actually imported, which a cell may build itself: the
     one-id twin's file names it by the phone's own id), never the id variant(1) gives it. */
  const admitted = imported.exercises.filter(e => LiftCorrespondence.normaliseName(e.n) === LiftCorrespondence.normaliseName(phoneName));
  assert.equal(admitted.length, 1, 'precondition: the admitted state carries exactly one lift named as ' + lift);
  return { era, lift, fileLift: admitted[0].id, done, view, imported, host, p, phoneEx };
}
const HOT = { tag: 'exact', value: 0, unit: 'rep' };

test('FC09-Q3-F A PRE-IMPORT WORKOUT IS CHECKED ON THE FILE\'S LIFT, NEVER LOST (DECISIONS:882 B1a; spec :127-:128): the '
  + 'check of the saved pre-import completion answers by the file lift\'s own plan: adopt-observed when the import kept the '
  + 'card, PLAN_CHANGED [Close] when it moved it; never COMPLETION_REQUIRED', async t => {
  const r = await realShapeHistory(t, 'q3f', { workouts: [{ day: '2026-09-18' }], importDay: '2026-09-19' });
  const pre = r.done[0], listed = r.p.lifts.find(l => l.lift_lineage_id === r.fileLift);
  assert.equal(listed && listed.completion_op_id, pre.close, 'the page lists the pre-import completion under the file\'s lift');
  const c = await r.host.check({ lift_lineage_id: r.fileLift, completion_op_id: pre.close });
  const w = r.imported.exercises.find(e => e.id === r.fileLift).w;
  t.diagnostic('Q3-F ' + r.lift + ' -> ' + r.fileLift + ' card ' + pre.card + ' file w ' + JSON.stringify(w) + ': ' + c.status + ' '
    + JSON.stringify(c.refusal) + ' ' + JSON.stringify((c.offers || []).map(o => [o.lift, o.kind, o.loads])));
  assert.notEqual(c.refusal && c.refusal.code, 'NATIVE_LOAD_COMPLETION_REQUIRED', 'THE B1a SEAM: the pre-import completion is lost');
  if (w === pre.card) {
    assert.deepEqual(c.offers.map(o => [o.lift, o.kind]), [[r.fileLift, 'adopt-observed']]);
    assert.deepEqual(c.offers[0].loads, pre.lifted);
  } else {
    assert.equal(c.refusal && c.refusal.code, 'NATIVE_LOAD_PLAN_CHANGED', JSON.stringify(c.refusal));
    assert.deepEqual(c.refusal.refs.map(x => x.op_id), [pre.close]);
    assert.equal(c.refusal.field, null);
  }
});

test('FC09-Q3-G NO TRAP AFTER MORE PRE-IMPORT TRAINING (DECISIONS:882 B1b; spec :158 exit (b), :153): a Yes, a second '
  + 'workout on its new card, then the import: the Undo is barred by that workout and the adoption exit IS offered on the '
  + 'file\'s lift', async t => {
  const r = await realShapeHistory(t, 'q3g', { workouts: [{ day: '2026-09-18', yes: true }, { day: '2026-09-25' }], importDay: '2026-09-26' });
  const yes = r.done[0], later = r.done[1];
  const held = r.p.issues.some(i => !i.superseded_by && i.lift === r.fileLift && i.code === 'NATIVE_LOAD_EFFECT_CONFLICT'
    && (i.refs || []).some(x => x && x.op_id === yes.opId));
  t.diagnostic('Q3-G held by the Yes: ' + held + '; issues ' + JSON.stringify(r.p.issues.map(i => [i.code, i.field, i.lift])));
  assert.ok(held, 'precondition: the import moved the base, so the pre-import Yes holds the file\'s lift (spec :156)');
  const body = (await responsesOf(r.era)).find(op => op.op_id === yes.opId).payload.issuance.body;
  const undo = await r.host.check({ lift_lineage_id: r.fileLift, completion_op_id: yes.close, intent: { compensate: body.spend_id } });
  t.diagnostic('Q3-G undo ' + undo.status + ' ' + JSON.stringify(undo.refusal));
  assert.equal(undo.refusal && undo.refusal.code, 'NATIVE_LOAD_COMPENSATION_DESCENDANTS', 'the later workout captured the Yes');
  const exit = await r.host.check({ lift_lineage_id: r.fileLift, completion_op_id: later.close });
  t.diagnostic('Q3-G exit ' + exit.status + ' ' + JSON.stringify(exit.refusal) + ' ' + JSON.stringify((exit.offers || []).map(o => [o.lift, o.kind, o.loads, o.current])));
  assert.notEqual(exit.refusal && exit.refusal.code, 'NATIVE_LOAD_COMPLETION_REQUIRED', 'THE B1b SEAM: the pre-import completion is lost');
  /* ROUND 8 (PM section N, M9 15/16), ASSERTION CHANGED BY NAME. The round-7 draft expected this pre-import completion's exit
     unconditionally. The real file's lift has its own set count (legacy-fixture.cjs: abs sets 2; the phone's first run
     shippedSetup sets 3), so the completion is no longer the plan under ANY id: FC01 step 2 (E/native-load.cjs:253) refuses
     PLAN_CHANGED inside exit (b), and FC03 shows the hold's own refusal, the Yes (spec :162). The one-id twin answers the
     same (FC12 FC09-LINEAGE-B1B-COUNT). When the file keeps the count the round-7 assertion stands exactly; either way the
     next workout on the held card is the way out (spec :158 TRAINABLE WHILE HELD), asserted below. */
  const fileSets = r.imported.exercises.find(e => e.id === r.fileLift).sets;
  t.diagnostic('Q3-G file sets ' + fileSets + ', the pre-import completion ' + later.lifted.length);
  if (fileSets === later.lifted.length) {
    assert.equal(exit.status, 'offer', 'THE B1b SEAM, neither way out: ' + JSON.stringify(exit.refusal));
    assert.deepEqual(exit.offers.map(o => [o.lift, o.kind]), [[r.fileLift, 'adopt-baseline']]);
    assert.deepEqual(exit.offers[0].loads, later.lifted);
    assert.ok(exit.offers[0].current.every(x => x === null), 'the exit is judged on the held projection');
  } else {
    assert.equal(exit.refusal && exit.refusal.code, 'NATIVE_LOAD_EFFECT_CONFLICT', JSON.stringify(exit.refusal));
    assert.ok(exit.refusal.refs.some(x => x && x.op_id === yes.opId), 'the hold\'s own refusal names the Yes');
  }
  const NEXT = '2026-10-02';   // the same weekday a week after the second workout
  const next = await observedWorkout(r.era, NEXT, r.imported, id => id === r.fileLift);
  assert.equal(next.lift, r.fileLift, 'precondition: the card after the import prescribes ' + r.fileLift);
  assert.equal(next.card, null, 'SPEC :158: a held lift\'s card asks for a baseline');
  const host = await r.era.createNativeLoadHost({ day: NEXT, engineState: r.imported });
  t.after(() => host.close());
  const p = await host.project();
  assert.equal(p.ok, true, p.code);
  const done = p.lifts.find(l => l.lift_lineage_id === r.fileLift);
  const way = await host.check({ lift_lineage_id: r.fileLift, completion_op_id: done.completion_op_id });
  t.diagnostic('Q3-G next ' + way.status + ' ' + JSON.stringify(way.refusal) + ' ' + JSON.stringify((way.offers || []).map(o => [o.lift, o.kind, o.loads, o.current])));
  assert.equal(way.status, 'offer', 'NO TRAP: the next workout on the held card is not the way out: ' + JSON.stringify(way.refusal));
  assert.deepEqual(way.offers.filter(o => o.lift === r.fileLift).map(o => o.kind), ['adopt-baseline']);
  assert.deepEqual(way.offers.find(o => o.lift === r.fileLift).loads, next.lifted);
});

test('FC09-Q3-H THE GOVERNOR READS THE PRE-IMPORT OPENERS, ON THE PAGE AND IN ADMISSION (DECISIONS:882 B2; spec R8 :135): two '
  + 'pre-import workouts with a hot opener (reserve 0) on the corresponded lift, a Yes on the second, the import: the page\'s '
  + 'projection holds the file\'s lift, and admission\'s F9 folds the same history to the page\'s codes', async t => {
  const r = await realShapeHistory(t, 'q3h', { workouts: [{ day: '2026-09-18', effort: HOT }, { day: '2026-09-25', effort: HOT, yes: true }],
    importDay: '2026-09-26' });
  const ex = r.p.state.exercises.find(e => e.id === r.fileLift);
  t.diagnostic('Q3-H ' + r.fileLift + ' holdFlag ' + ex.holdFlag + '; page issues ' + JSON.stringify(r.p.issues.map(i => [i.code, i.field, i.lift])));
  assert.equal(ex.holdFlag, true, 'THE B2 SEAM: the governor never read the two hot pre-import openers');
  const row = f9(r.view, r.done[1].opId)[0];
  assert.ok(row, 'F9 did not answer for the Yes');
  t.diagnostic('Q3-H admission ' + JSON.stringify(row.fold_codes) + ' ' + row.outcome + '; page ' + JSON.stringify(activeCodes(r.p.issues)));
  assert.deepEqual(row.fold_codes, activeCodes(r.p.issues), 'admission and the page folded the history differently');
});


/* ROUND 9 (PM ruling DECISIONS:884 (1), BLOCKING; Claude Opus l2 B1). THE UNDO TODAY LISTS. A Yes on the phone, then an import
   whose file names that lift by ANOTHER id and KEEPS its working weight: FC03 folds the Yes as applied (an adoption) or queued (an
   earn), not held, and its Undo is offered on the file's lift. The page's "Check next weight" must LIST that Undo (spec :153, D9),
   on the file's lift, exactly as it lists it when the file names the lift by the phone's own id (the one-id twin). RED at 22ac52b:
   today-entry.mjs takes the Undo's lift from the spend id (the phone's), while the page keys its completions by the file's lift, so
   the listing skips it. The file is variant(1) with the corresponded lift's working weight made the phone's own (w and wSets, the
   members spec :156 compares), so the import keeps the base the Yes was issued on; in the twin that lift also keeps the phone's id. */
const KEPT = ['w', 'wSets'];
function keptFile(key, twin) {
  return (lift, phoneEx) => sealNamed('fc09-q3i-' + key + (twin ? '-twin' : ''), () => {
    const state = variant(1);
    const x = state.exercises.find(e => LiftCorrespondence.normaliseName(e.n) === LiftCorrespondence.normaliseName(phoneEx.n));
    for (const k of KEPT) { if (Object.hasOwn(phoneEx, k)) x[k] = JSON.parse(JSON.stringify(phoneEx[k])); else delete x[k]; }
    if (twin) {
      const was = x.id;
      x.id = lift;
      for (const day of Object.keys(state.exOrder)) state.exOrder[day] = state.exOrder[day].map(id => (id === was ? lift : id));
      for (const day of Object.values(state.sessionLog)) for (const entry of day.entries) if (entry.id === was) entry.id = lift;
      for (const q of state.queue) if (q.exId === was) q.exId = lift;
      for (const book of ['insertions', 'retirements']) if (state[book] && Object.hasOwn(state[book], was)) { state[book][lift] = state[book][was]; delete state[book][was]; }
    }
    return state;
  });
}
/* The page's own listing: the Today workout entry over the admitted basis, its "Check next weight", every Undo it lists. */
async function undoListing(t, r, day) {
  const model = createTodayModel({ today: day, basisState: r.imported });
  const entry = await createWorkoutEntry(model, { hosts: r.era });
  t.after(() => { entry.nativeLoad.close(); entry.gymHost.close(); });
  await entry.nativeLoad.check();
  await entry.nativeLoad.settled();
  const view = entry.nativeLoad.view();
  return view.offers.filter(o => o.kind === 'compensate').map(o => ({ lift: o.lift, loads: o.loads, current: o.current }));
}
for (const [label, key, workouts, prepare] of [
  ['an applied adoption', 'adopted', [{ day: '2026-09-18', yes: true }], null],
  /* An earn needs a next load on file: the phone's lifts are given a rung ladder over their first load (the test's own basis). */
  ['a queued earn', 'queued', [{ day: '2026-09-18', top: '12' }, { day: '2026-09-25', top: '12', yes: 'earn' }],
    s => { for (const e of s.exercises) e.steps = [e.w, e.w + 5, e.w + 10]; }],
]) test('FC09-Q3-I TODAY LISTS THE UNDO OF ' + label.toUpperCase() + ' ON THE FILE\'S LIFT (DECISIONS:884 (1); spec :153 D9, :154): '
  + 'a Yes on the phone, an import that renames the lift and keeps its working weight; "Check next weight" lists the Undo on '
  + 'the file\'s lift, as the one-id twin lists it on its own', async t => {
  const IMPORT = '2026-09-26';
  const r = await realShapeHistory(t, 'q3i-' + key, { workouts, importDay: IMPORT, prepare, file: keptFile(key, false) });
  const twin = await realShapeHistory(t, 'q3i-' + key + '-twin', { workouts, importDay: IMPORT, prepare, file: keptFile(key, true) });
  const yes = r.done.at(-1).opId, twinYes = twin.done.at(-1).opId;
  t.diagnostic('Q3-I ' + key + ' ' + r.lift + ' -> ' + r.fileLift + '; issues ' + JSON.stringify(r.p.issues.map(i => [i.code, i.field, i.lift]))
    + '; effects ' + JSON.stringify(r.p.effects.map(e => e.kind)) + '; twin effects ' + JSON.stringify(twin.p.effects.map(e => e.kind)));
  assert.notEqual(r.fileLift, r.lift, 'precondition: the file names the lift by another id');
  assert.equal(twin.fileLift, twin.lift, 'precondition: the twin\'s file names it by the phone\'s own id');
  for (const [name, x, op] of [['correspondence', r, yes], ['twin', twin, twinYes]]) {
    assert.deepEqual(x.p.issues.filter(i => !i.superseded_by && (i.refs || []).some(z => z && z.op_id === op)).map(i => i.code), [],
      'precondition (' + name + '): the import kept the base, so the Yes is not held');
    assert.deepEqual(x.p.effects.map(e => e.kind), [key], 'precondition (' + name + '): the Yes is ' + key);
  }
  const listed = await undoListing(t, r, IMPORT), twinListed = await undoListing(t, twin, IMPORT);
  t.diagnostic('Q3-I ' + key + ' listed ' + JSON.stringify(listed) + '; twin ' + JSON.stringify(twinListed));
  assert.deepEqual(twinListed.map(o => o.lift), [twin.lift], 'control: one id lists the Undo');
  assert.deepEqual(listed.map(o => o.lift), [r.fileLift], 'THE UNDO LISTING SEAM: Today does not list the Undo on the file\'s lift');
  assert.deepEqual(listed.map(o => ({ loads: o.loads, current: o.current })), twinListed.map(o => ({ loads: o.loads, current: o.current })),
    'the listed Undo is the one-id twin\'s');
});
