// FA03 RED-FIRST CELLS: route B (owner answer YES, route B; DECISIONS:784-785)
// with its A recovery button, at the DOM over the REAL durable stack.
// NATIVE-LOAD-SPEC R7 (6ddf7af, sha256 98c0cf7a...) section E rows A01, A02,
// B01, B02 and D1 fixture N02c [Y]. Real here, exactly as gym.test.mjs: the
// encrypted repository over fake-indexeddb, the local era, the T2 stage, the
// accepted durable public client, the capture adapter and the host runtime.
// Synthetic and labelled: the athlete is rebuild/m3/w7-preview/fixtures.cjs's
// invented one with its legacy log removed (native facts only, the
// nativeOnlyState pattern). Every rep and date below is INVENTED.
// Needs rebuild/m3/w6's own dependencies (fake-indexeddb, jsdom) through the
// existing junction, exactly as gym.test.mjs does.
import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { openTodayInstallation } from '../../../w6/local/today-bindings.mjs';
import { createWorkoutEntry } from '../today-entry.mjs';
import * as TodayEntry from '../today-entry.mjs';
import TodayModel from '../today-model.cjs';
import design from '../design.cjs';
import { prescriptionLine } from '../gym-model.mjs';

const require = createRequire(import.meta.url);
const F = require('../../fixtures.cjs');
const { createTodayModel } = TodayModel;
// Monday and Thursday are U days in the fixture split; the next Monday is the debut day.
const D1 = '2030-02-04', D2 = '2030-02-07', D3 = '2030-02-11';
const PRODUCER = 'earned/native-load/v1';
const basisFor = day => { const s = F.createSyntheticState(day); s.sessionLog = {}; return s; };
const shell = () => new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
  { url: 'http://127.0.0.1:4178/' }).window.document;
const opsOf = async era => Object.values((await era.generation()).generation.collections.ops || {});
const responsesOf = async era => (await opsOf(era)).filter(op => op.kind === 'proposal-response');

// PRECISE RED GATES.
function hostGate(era) {
  assert.equal(typeof era.createNativeLoadHost, 'function',
    'RED NATIVE_LOAD_HOST_ABSENT: the local era exposes no createNativeLoadHost (FC08; spec B Functions)');
}
function entryGate(entry) {
  assert.ok(entry.nativeLoad && typeof entry.nativeLoad.check === 'function' && typeof entry.nativeLoad.view === 'function',
    'RED NATIVE_LOAD_ENTRY_ABSENT: createWorkoutEntry carries no native-load controller (FA02; spec E)');
}

async function dayEntry(era, day, extra = {}) {
  const model = createTodayModel({ today: day, basisState: basisFor(day) });
  return { model, entry: await createWorkoutEntry(model, { hosts: extra.hosts || era }) };
}
// One whole U-day session through the gym model: every set logged at `reps`
// with effort `effort` (a label of the approved choice set), then a normal Finish.
// Round 4 options: start:false continues a Start already made; load fills a set whose card has no load (baseline).
// Round 5 option: loadFor {lift: load} logs that lift at a load other than the card's (an observed load).
// Round 16 option: loadSeqFor {lift: [l1, l2, ...]} logs that lift's sets at those loads in order (unequal loads).
async function train(entry, reps = 12, effort = '1', { start = true, load: entered = null, loadFor = {}, loadSeqFor = {} } = {}) {
  const gym = entry.gym, seen = {};
  const reserve = gym.effortChoices().find(c => c.label === effort).reserve;
  if (start) { const started = await gym.start(); assert.equal(started.ok, true, 'start ' + started.code); }
  for (let guard = 0; guard < 20; guard++) {
    const view = await gym.read();
    if (view.phase === 'saved') { if (view.complete) break; gym.forget(); continue; }
    if (view.phase !== 'active') break;
    const lift = view.set.lift, k = seen[lift] = (seen[lift] || 0) + 1;
    const load = Object.hasOwn(loadSeqFor, lift) ? loadSeqFor[lift][k - 1] : Object.hasOwn(loadFor, lift) ? loadFor[lift] : view.entry.load === null && entered !== null ? entered : view.entry.load;
    const logged = await gym.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
      load: String(load), reps: String(reps), effort: reserve });
    assert.equal(logged.ok, true, 'set ' + logged.code);
    gym.forget();
  }
  const last = await gym.read();
  return { last, finished: await gym.finish({ startId: last.startId }) };
}
async function twoTops(era) {
  const one = await dayEntry(era, D1);
  const a = await train(one.entry);
  assert.equal(a.finished.ok, true);
  one.entry.gymHost.close();
  const two = await dayEntry(era, D2);
  return two;
}
const q = (doc, sel) => doc.querySelector(sel);
const qa = (doc, sel) => [...doc.querySelectorAll(sel)];

test('A01 FIND-AND-USE [Y]: visible Check next weight after Saved -> offer lists 105/105/105-shaped loads -> yes -> kill/reopen -> the debut-day card carries the new load', async () => {
  const fault = faultDatabase();
  const era = await openTodayInstallation({ indexedDB: fault.indexedDB, crypto: webcrypto, day: D1 });
  const { entry } = await twoTops(era);
  const b = await train(entry);
  assert.equal(b.finished.ok, true, 'Finish is saved first');
  hostGate(era);
  entryGate(entry);
  const doc = shell(), phone = doc.getElementById('phone');
  await entry.open({ doc, phone, back: () => {} });
  const button = q(doc, '[data-native-load="check"]');
  assert.ok(button, 'a visible Check next weight action beside the workout');
  assert.equal(button.textContent.trim(), 'Check next weight');
  button.click();
  await entry.nativeLoad.settled();
  const offers = qa(doc, '[data-native-load="offer"]');
  assert.ok(offers.length >= 1, 'an offer is listed');
  const press = offers.find(o => o.getAttribute('data-lift') === 'demo-press');
  assert.ok(press, 'the checked lift is offered');
  assert.deepEqual(qa(press, '[data-native-load="set-load"]').map(x => x.textContent.trim()), ['45 lb', '45 lb'],
    'every offered set load is listed');
  assert.equal((await responsesOf(era)).length, 0, 'showing an offer writes nothing');
  q(press, '[data-native-load="yes"]').click();
  await entry.nativeLoad.settled();
  const saved = await responsesOf(era);
  assert.equal(saved.length, 1, 'exactly one durable yes');
  assert.equal(saved[0].payload.answer, 'accept');
  assert.equal(saved[0].payload.issuance.producer, PRODUCER);
  entry.gymHost.close(); era.close();
  const again = await openTodayInstallation({ indexedDB: fault.indexedDB, crypto: webcrypto, day: D3 });
  const three = await dayEntry(again, D3);
  const view = await three.entry.gym.read();
  assert.equal(view.phase, 'ready', view.code || '');
  assert.equal(view.lift.id, 'demo-press');
  assert.match(view.prescription.line, /^45 lb/, 'the debut-day card carries the agreed load');
  three.entry.gymHost.close(); again.close();
});

test('A02 REQUEST-REPEAT [Y]: repeated check writes nothing; an intervening edit makes the old offer STALE_OFFER', async () => {
  const fault = faultDatabase();
  const era = await openTodayInstallation({ indexedDB: fault.indexedDB, crypto: webcrypto, day: D1 });
  const { entry } = await twoTops(era);
  const b = await train(entry);
  assert.equal(b.finished.ok, true);
  hostGate(era);
  entryGate(entry);
  const before = (await opsOf(era)).length;
  await entry.nativeLoad.check(); await entry.nativeLoad.check();
  const view = entry.nativeLoad.view();
  assert.equal(view.phase, 'offers');
  assert.equal((await opsOf(era)).length, before, 'two checks wrote zero operations');
  const offer = view.offers.find(o => o.lift === 'demo-press');
  // An intervening edit: the last set of the session is removed through the accepted edit path.
  const history = await entry.gymHost.host.client.readWorkoutHistory();
  const session = history.history.sessions.find(s => s.projection.close_records.length && s.projection.start_record.current.effective.local_date === D2);
  const target = session.projection.facts.filter(f => f.included === true).at(-1).source_op_id;
  const edit = await entry.gymHost.host.client.prepareWorkoutEdit({ target_op_id: target });
  assert.equal(edit.prepared, true, edit.code);
  const removed = await entry.gymHost.host.client.commitWorkoutEdit({ editId: edit.editId, action: 'remove', change: 'SYNTHETIC edit' });
  assert.equal(removed.acknowledged, true, removed.code);
  const result = await entry.nativeLoad.accept(offer.proposalId);
  assert.equal(result.acknowledged, false);
  assert.equal(result.code, 'NATIVE_LOAD_STALE_OFFER');
  assert.equal((await responsesOf(era)).length, 0, 'a stale yes writes nothing');
  assert.equal(entry.nativeLoad.view().phase, 'refused');
  entry.gymHost.close(); era.close();
});

test('B01 CLOSE-RECOVERY [Y]: killed after the committed Close and before paint, a reopen offers the same issuance digest through the button', async () => {
  const fault = faultDatabase();
  const era = await openTodayInstallation({ indexedDB: fault.indexedDB, crypto: webcrypto, day: D1 });
  const { entry } = await twoTops(era);
  const b = await train(entry);
  assert.equal(b.finished.ok, true);
  hostGate(era);
  entryGate(entry);
  // Route B: the acknowledged Close notified the controller, which checked on its own.
  await entry.nativeLoad.settled();
  const shown = entry.nativeLoad.view();
  assert.equal(shown.phase, 'offers', 'route B shows the offer after the acknowledged Close with no tap');
  const digest = shown.offers.find(o => o.lift === 'demo-press').proposalId;
  assert.match(digest, /^prop-[0-9a-f]{16}$/);
  entry.gymHost.close(); era.close();   // the process is gone before anything else painted
  const again = await openTodayInstallation({ indexedDB: fault.indexedDB, crypto: webcrypto, day: D2 });
  const reopened = await dayEntry(again, D2);
  const doc = shell(), phone = doc.getElementById('phone');
  await reopened.entry.open({ doc, phone, back: () => {} });
  q(doc, '[data-native-load="check"]').click();
  await reopened.entry.nativeLoad.settled();
  const offer = qa(doc, '[data-native-load="offer"]').find(o => o.getAttribute('data-lift') === 'demo-press');
  assert.equal(offer.getAttribute('data-proposal'), digest, 'the recovered offer is the same issuance');
  assert.equal((await responsesOf(again)).length, 0);
  reopened.entry.gymHost.close(); again.close();
});

test('B02 SAVED-IS-SAVED [Y]: an evaluator failure after Finish leaves the workout acknowledged and Saved with separate offer-failure copy; a double Finish stores one Close', async () => {
  const fault = faultDatabase();
  const era = await openTodayInstallation({ indexedDB: fault.indexedDB, crypto: webcrypto, day: D1 });
  // Test-side decorator over the installation (no product hook): its native host's check throws.
  const hosts = { ...era, createNativeLoadHost: async (...args) => {
    const real = await era.createNativeLoadHost(...args);
    return { ...real, check: async () => { throw new Error('SYNTHETIC_EVALUATOR_FAULT'); } };
  } };
  const one = await dayEntry(era, D1);
  assert.equal((await train(one.entry)).finished.ok, true);
  one.entry.gymHost.close();
  const { entry } = await dayEntry(era, D2, { hosts });
  const b = await train(entry);
  assert.equal(b.finished.ok, true, 'Finish acknowledged whatever the check does');
  hostGate(era);
  entryGate(entry);
  await entry.nativeLoad.settled();
  const view = entry.nativeLoad.view();
  assert.equal(view.phase, 'failed');
  assert.equal(view.copy, 'Your workout is saved. The next weight could not be checked.');
  assert.equal((await entry.gym.read()).phase, 'finished', 'Saved stands');
  const twice = await entry.gym.finish({ startId: b.last.startId });
  assert.notEqual(twice.ok, true, 'a second Finish is refused by the accepted layer');
  assert.equal((await opsOf(era)).filter(op => op.kind === 'session-close').length, 2, 'one Close per day, never a duplicate');
  entry.gymHost.close(); era.close();
});

// ROUND 3 actual-host rows (Astra NATIVE-LOAD-BUILD-REVIEW-L1 B1, B2, B3/B4, B5): the
// real durable stack as above, every value invented.
async function yesTo(era, lift) {
  const { entry } = await twoTops(era);
  assert.equal((await train(entry)).finished.ok, true);
  await entry.nativeLoad.settled();
  await entry.nativeLoad.check();
  const offer = entry.nativeLoad.view().offers.find(o => o.lift === lift);
  assert.ok(offer, 'an offer for ' + lift);
  assert.equal((await entry.nativeLoad.accept(offer.proposalId)).acknowledged, true);
  return entry;
}
const reopenAt = async (fault, day) => openTodayInstallation({ indexedDB: fault.indexedDB, crypto: webcrypto, day });
const nativeQueue = (state, lift) => state.queue.filter(x => x.exId === lift && typeof x.native_load_spend === 'string');

test('R3-B1 ACTUAL LANDING [Y] (Astra B1, spec :151-152): yes to 45, reopen, train the prescribed 45 and Finish -> the host projects w 45, ESTABLISH, and Today agrees', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  entry.gymHost.close(); era.close();
  const again = await reopenAt(fault, D3), three = await dayEntry(again, D3);
  assert.match((await three.entry.gym.read()).prescription.line, /^45 lb/);
  assert.equal((await train(three.entry)).finished.ok, true);
  await three.entry.nativeLoad.settled();
  const host = await again.createNativeLoadHost({ day: D3, engineState: basisFor(D3) }), p = await host.project();
  assert.equal(p.state.exercises.find(e => e.id === 'demo-press').w, 45, 'the consented, captured and performed debut becomes the working weight');
  assert.ok(p.effects.some(x => x.kind === 'landed'));
  assert.deepEqual(nativeQueue(p.state, 'demo-press').map(q => [q.done, q.state]), [[true, 'ESTABLISH']]);
  await three.entry.refresh();
  assert.equal(three.model.stateFromOps().exercises.find(e => e.id === 'demo-press').w, 45, 'Today reads the landed weight');
  host.close(); three.entry.gymHost.close(); again.close();
});

test('R3-B2 DISPUTED CARD [Y] (Astra B2, spec :157; round 4 D-B2-1 :156): a set of the accepted basis removed after the yes -> the reopened card is not 45 advice (demo-press is left off it); the compensating yes resolves it', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  const history = await entry.gymHost.host.client.readWorkoutHistory();
  const session = history.history.sessions.find(s => s.projection.close_records.length && s.projection.start_record.current.effective.local_date === D2);
  const target = session.projection.facts.filter(f => f.included === true)[0].source_op_id;
  const edit = await entry.gymHost.host.client.prepareWorkoutEdit({ target_op_id: target });
  assert.equal(edit.prepared, true, edit.code);
  assert.equal((await entry.gymHost.host.client.commitWorkoutEdit({ editId: edit.editId, action: 'remove', change: 'SYNTHETIC correction' })).acknowledged, true);
  entry.gymHost.close(); era.close();
  const again = await reopenAt(fault, D3), three = await dayEntry(again, D3), card = await three.entry.gym.read();
  // Round 4 (Claude l2 D-B2-1, spec :156): only the disputed lift's slot is unavailable, not the whole day.
  // Round 13 (spec R9.2 :158 TRAINABLE WHILE HELD): the held lift is no longer left off the
  // card; its w/wSets project null, so its slots are the baseline ask (load not_prescribed).
  assert.equal(card.phase, 'ready', card.code || '');
  // Round 5 (Claude l3 D-B3-2): the WHOLE prepared session, not only its first lift.
  const whole = await three.entry.gymHost.host.client.prepareWorkout({ planned_split_slot_id: 'earned-today-preview/' + D3 });
  assert.equal(whole.prepared, true, whole.code);
  assert.deepEqual([...new Set(whole.view.slots.map(s => s.lift_lineage_id))].sort(), ['demo-press', 'demo-row'], 'the held lift stays trainable');
  assert.ok(whole.view.slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load && s.load.state === 'not_prescribed'), 'demo-press: the baseline ask');
  assert.ok(!whole.view.slots.some(s => /^45 lb/.test(s.load && s.load.display || '')), 'no 45 anywhere on the card');
  const host = await again.createNativeLoadHost({ day: D3, engineState: basisFor(D3) });
  const body = (await responsesOf(again))[0].payload.issuance.body;
  const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: body.evidence.at(-1).close.op_id, intent: { compensate: body.spend_id } });
  assert.equal(undo.status, 'offer', JSON.stringify(undo.refusal));
  assert.equal((await host.respond({ handle: undo.offers[0].handle, proposal_id: undo.offers[0].proposalId, answer: 'accept' })).acknowledged, true);
  host.close(); three.entry.gymHost.close(); again.close();
  const later = await reopenAt(fault, D3), four = await dayEntry(later, D3), view = await four.entry.gym.read();
  assert.equal(view.phase, 'ready', view.code || '');
  assert.match(view.prescription.line, /^40 lb/, 'the compensated card carries the prior weight');
  four.entry.gymHost.close(); later.close();
});

test('R3-B4 SECOND LIFT [Y] (Astra B4 and B3): yes to demo-row, nothing edited -> no BASIS_REPAIR_REQUIRED for it, and its compensation is offered while its target is queued', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-row');
  const host = await era.createNativeLoadHost({ day: D2, engineState: basisFor(D2) }), p = await host.project();
  assert.deepEqual(p.issues.filter(i => i.code === 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED'), []);
  const body = (await responsesOf(era))[0].payload.issuance.body;
  const undo = await host.check({ lift_lineage_id: 'demo-row', completion_op_id: body.evidence.at(-1).close.op_id, intent: { compensate: body.spend_id } });
  assert.equal(undo.status, 'offer', JSON.stringify(undo.refusal));
  host.close(); entry.gymHost.close(); era.close();
});

test('R3-B5 REOPEN RECONCILES [Y] (Astra B5, spec :164-165): after yes 45, a cold reopen on D3 and the entry refresh give Today the programme the gym prescribes', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  entry.gymHost.close(); era.close();
  const again = await reopenAt(fault, D3), next = await dayEntry(again, D3);
  await next.entry.refresh();
  assert.match((await next.entry.gym.read()).prescription.line, /^45 lb/);
  const state = next.model.stateFromOps();
  assert.deepEqual(nativeQueue(state, 'demo-press').map(q => [q.done, q.newW]), [[false, 45]], 'Today holds the accepted target the gym prescribes');
  assert.equal(state.exercises.find(e => e.id === 'demo-press').w, 40, 'w unchanged until landing');
  next.entry.gymHost.close(); again.close();
});

// ROUND 4 actual-host rows (spec R8 b849508; Astra L2 B7, B9, B10; Claude l2 D-B2-1; D9).
async function dayEntryWith(era, day, basis) {
  const model = createTodayModel({ today: day, basisState: basis });
  return { model, entry: await createWorkoutEntry(model, { hosts: era }) };
}
const withPress = (day, patch) => { const s = basisFor(day); Object.assign(s.exercises.find(e => e.id === 'demo-press'), patch); return s; };
const PROPOSED = () => TodayEntry.NATIVE_LOAD_PROPOSED_COPY || {};
async function disputedAtD3(fault) {
  const era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  const history = await entry.gymHost.host.client.readWorkoutHistory();
  const session = history.history.sessions.find(s => s.projection.close_records.length && s.projection.start_record.current.effective.local_date === D2);
  const target = session.projection.facts.filter(f => f.included === true)[0].source_op_id;
  const edit = await entry.gymHost.host.client.prepareWorkoutEdit({ target_op_id: target });
  assert.equal(edit.prepared, true, edit.code);
  assert.equal((await entry.gymHost.host.client.commitWorkoutEdit({ editId: edit.editId, action: 'remove', change: 'SYNTHETIC correction' })).acknowledged, true);
  entry.gymHost.close(); era.close();
  const again = await reopenAt(fault, D3);
  return { again, three: await dayEntry(again, D3) };
}

test('R4-N23 HOLD ON THE CARD [Y] (Astra B7; spec R8 :92, :135, D1 N23): two workouts whose one-set demo-press opener is exactly 0 -> the next card carries the canonical governor effort, 2 reps in reserve', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const b = day => withPress(day, { sets: 1 });
  for (const day of [D1, D2]) {
    const one = await dayEntryWith(era, day, b(day));
    assert.equal((await train(one.entry, 12, '0')).finished.ok, true);
    if (one.entry.nativeLoad) await one.entry.nativeLoad.settled();
    one.entry.gymHost.close();
  }
  era.close();
  const again = await reopenAt(fault, D3), three = await dayEntryWith(again, D3, b(D3)), card = await three.entry.gym.read();
  assert.equal(card.lift.id, 'demo-press');
  assert.equal(card.prescription.effortCell, '2 reps in reserve', 'the held one-set opener is prescribed as the canonical governor says');
  const host = await again.createNativeLoadHost({ day: D3, engineState: b(D3) }), p = await host.project();
  const press = p.state.exercises.find(e => e.id === 'demo-press'), seed = b(D3).exercises.find(e => e.id === 'demo-press');
  assert.equal(press.holdFlag, true);
  assert.deepEqual(press.rirHist, seed.rirHist, 'no rirHist leaves the governor');
  host.close(); three.entry.gymHost.close(); again.close();
});

test('R4-B9 CAPTURED DEBUT CANNOT BE UNDONE [Y] (Astra L2 B9; spec :153 "only if no later Start captured the accepted effect"): yes 45, the D3 Start captures 45, compensation refuses COMPENSATION_DESCENDANTS, and the finished debut lands 45', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  entry.gymHost.close(); era.close();
  const again = await reopenAt(fault, D3), three = await dayEntry(again, D3);
  const started = await three.entry.gym.start();
  assert.equal(started.ok, true, started.code);
  const host = await again.createNativeLoadHost({ day: D3, engineState: basisFor(D3) });
  const body = (await responsesOf(again))[0].payload.issuance.body;
  const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: body.evidence.at(-1).close.op_id, intent: { compensate: body.spend_id } });
  assert.equal(undo.status, 'refused', 'no undo once a Start captured the agreed weight');
  assert.equal(undo.refusal.code, 'NATIVE_LOAD_COMPENSATION_DESCENDANTS');
  assert.equal((await train(three.entry, 12, '1', { start: false })).finished.ok, true);
  await three.entry.nativeLoad.settled();
  assert.equal((await host.project()).state.exercises.find(e => e.id === 'demo-press').w, 45, 'the captured debut lands');
  host.close(); three.entry.gymHost.close(); again.close();
});

test('R4-B10 BASELINE UNDO [Y] (Astra L2 B10; spec :110 "Only compensation may restore original null/unprescribed positions", :153): yes to a 60 baseline; its compensation offers the null prior image and its yes restores no working weight', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const b = day => withPress(day, { w: null });
  const one = await dayEntryWith(era, D1, b(D1));
  assert.equal((await train(one.entry, 12, '1', { load: '60' })).finished.ok, true);
  await one.entry.nativeLoad.settled();
  await one.entry.nativeLoad.check();
  const offer = one.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.equal(offer && offer.kind, 'adopt-baseline');
  assert.equal((await one.entry.nativeLoad.accept(offer.proposalId)).acknowledged, true);
  const host = await era.createNativeLoadHost({ day: D1, engineState: b(D1) });
  const body = (await responsesOf(era))[0].payload.issuance.body;
  const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: body.evidence.at(-1).close.op_id, intent: { compensate: body.spend_id } });
  assert.equal(undo.status, 'offer', JSON.stringify(undo.refusal));
  assert.deepEqual(undo.offers[0].loads, [null, null], 'the prior image had no working weight');
  assert.equal((await host.respond({ handle: undo.offers[0].handle, proposal_id: undo.offers[0].proposalId, answer: 'accept' })).acknowledged, true);
  assert.equal((await host.project()).state.exercises.find(e => e.id === 'demo-press').w, null);
  host.close(); one.entry.gymHost.close(); era.close();
});

test('R4-DB21 ONE SLOT, NOT THE DAY [Y] (Claude l2 D-B2-1; spec :156 "mark affected new prescription unavailable", :157 "labeled disputed"): the disputed demo-press is left off D3, demo-row is prescribed, and the panel labels demo-press disputed', async () => {
  const fault = faultDatabase(), { again, three } = await disputedAtD3(fault), card = await three.entry.gym.read();
  assert.equal(card.phase, 'ready', card.code || '');
  // Round 13 (spec R9.2 :158): the day is never refused and the held lift is the baseline ask;
  // the rest of the day is prescribed as usual.
  const whole = await three.entry.gymHost.host.client.prepareWorkout({ planned_split_slot_id: 'earned-today-preview/' + D3 });
  assert.equal(whole.prepared, true, whole.code);
  assert.ok(whole.view.slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load && s.load.display || '')), 'the rest of the day is prescribed');
  assert.ok(whole.view.slots.some(s => s.lift_lineage_id === 'demo-press') && whole.view.slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load && s.load.state === 'not_prescribed'), 'demo-press asks for a working load');
  await three.entry.refresh();
  const doc = shell(), phone = doc.getElementById('phone');
  await three.entry.open({ doc, phone, back: () => {} });
  const notice = q(doc, '[data-native-load="notice"][data-lift="demo-press"]');
  assert.ok(notice, 'demo-press is labeled, not silently missing');
  assert.ok(PROPOSED().disputed && notice.textContent.includes(PROPOSED().disputed), notice && notice.textContent);
  three.entry.gymHost.close(); again.close();
});

test('R4-D9 UNDO CONTROL [Y] (D9; spec :153; PROPOSED copy): after yes 45 the Check next weight panel lists an undo choice for demo-press at the prior 40/40; its Yes retires the agreed weight and the next card is 40', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  const doc = shell(), phone = doc.getElementById('phone');
  await entry.open({ doc, phone, back: () => {} });
  q(doc, '[data-native-load="check"]').click();
  await entry.nativeLoad.settled();
  const undo = qa(doc, '[data-native-load="offer"]').find(o => o.getAttribute('data-lift') === 'demo-press' && o.getAttribute('data-kind') === 'compensate');
  assert.ok(undo, 'an undo choice is listed');
  assert.deepEqual(qa(undo, '[data-native-load="set-load"]').map(x => x.textContent.trim()), ['40 lb', '40 lb']);
  assert.ok(q(undo, 'h3').textContent.endsWith(PROPOSED().undoHeading));
  q(undo, '[data-native-load="yes"]').click();
  await entry.nativeLoad.settled();
  assert.equal((await responsesOf(era)).length, 2, 'the undo is its own durable yes');
  assert.equal(entry.nativeLoad.view().copy, PROPOSED().undone);
  entry.gymHost.close(); era.close();
  const again = await reopenAt(fault, D3), three = await dayEntry(again, D3);
  assert.match((await three.entry.gym.read()).prescription.line, /^40 lb/, 'the retired weight never reaches the card');
  three.entry.gymHost.close(); again.close();
});

// ROUND 5 actual-host rows (Astra L3 B12, D10).
for (const baseline of [false, true]) test('R5-B12' + (baseline ? 'b' : 'a') + ' HELD ADOPTION UNDO [Y] (Astra L3 B12; spec R8 :156, :196): ' + (baseline ? 'a 60 baseline (no working weight)' : 'an observed 45 over a 40 card') + ' is agreed, the next admitted base moves demo-press without an ordering op; the held adoption offers a retire-only undo whose yes keeps the new base and clears the conflict', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const first = baseline ? withPress(D1, { w: null }) : basisFor(D1), now = baseline ? 45 : 42.5, moved = withPress(D1, { w: now });
  const one = await dayEntryWith(era, D1, first);
  assert.equal((await train(one.entry, 12, '1', baseline ? { load: '60' } : { loadFor: { 'demo-press': '45' } })).finished.ok, true);
  await one.entry.nativeLoad.settled();
  await one.entry.nativeLoad.check();
  const offer = one.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.equal(offer && offer.kind, baseline ? 'adopt-baseline' : 'adopt-observed');
  assert.equal((await one.entry.nativeLoad.accept(offer.proposalId)).acknowledged, true);
  one.entry.gymHost.close();
  const host = await era.createNativeLoadHost({ day: D1, engineState: moved }), held = await host.project();
  assert.deepEqual(held.issues.map(i => [i.code, i.field, i.lift]), [['NATIVE_LOAD_EFFECT_CONFLICT', 'load_basis', 'demo-press']]);
  // Round 13 (spec R9.2 :158 TRAINABLE WHILE HELD): the registered projection of a held lift is
  // w null (the baseline ask); the plan's own weight (now) returns once the hold resolves.
  assert.equal(held.state.exercises.find(e => e.id === 'demo-press').w, null);
  const body = (await responsesOf(era))[0].payload.issuance.body;
  const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: body.evidence.at(-1).close.op_id, intent: { compensate: body.spend_id } });
  assert.equal(undo.status, 'offer', 'nothing captured it, so the undo is reachable: ' + JSON.stringify(undo.refusal));
  assert.deepEqual(undo.offers[0].loads, [now, now], 'retire-only: the current base stands');
  assert.equal((await host.respond({ handle: undo.offers[0].handle, proposal_id: undo.offers[0].proposalId, answer: 'accept' })).acknowledged, true);
  const after = await host.project();
  assert.equal(after.state.exercises.find(e => e.id === 'demo-press').w, now, 'no w write');
  assert.deepEqual(after.issues.filter(i => i.code === 'NATIVE_LOAD_EFFECT_CONFLICT'), [], 'conflict cleared');
  host.close(); era.close();
});

test('R5-D10 TODAY COUNT AGREES WITH THE CARD [Y] (Astra L3 D10; spec :164 "Both new captures and Today read that same projection"): on the disputed two-lift D3 Today counts 1 exercise, as the card captures', async () => {
  const fault = faultDatabase(), { again, three } = await disputedAtD3(fault);
  await three.entry.refresh();
  // Round 13 (spec R9.2 :158): the held lift stays on the card as the baseline ask, and Today counts it.
  assert.equal(three.model.read().workout.exerciseCount, 2, 'Today counts the card the gym prescribes, the held lift included');
  three.entry.gymHost.close(); again.close();
});

// ROUND 6 actual-host rows (Astra L4 B14, B15, B16, B17).
async function heldBaselineUndone(fault) {
  const era = await reopenAt(fault, D1);
  hostGate(era);
  const one = await dayEntryWith(era, D1, withPress(D1, { w: null }));
  assert.equal((await train(one.entry, 12, '1', { load: '60' })).finished.ok, true);
  await one.entry.nativeLoad.settled();
  await one.entry.nativeLoad.check();
  const offer = one.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.equal((await one.entry.nativeLoad.accept(offer.proposalId)).acknowledged, true);
  one.entry.gymHost.close();
  const host = await era.createNativeLoadHost({ day: D1, engineState: withPress(D1, { w: 45 }) });
  const body = (await responsesOf(era))[0].payload.issuance.body;
  const ask = { lift_lineage_id: 'demo-press', completion_op_id: body.evidence.at(-1).close.op_id, intent: { compensate: body.spend_id } };
  const undo = await host.check(ask);
  assert.equal(undo.status, 'offer', JSON.stringify(undo.refusal));
  assert.equal((await host.respond({ handle: undo.offers[0].handle, proposal_id: undo.offers[0].proposalId, answer: 'accept' })).acknowledged, true);
  return { era, host, ask };
}
const pressOf = p => p.state.exercises.find(e => e.id === 'demo-press');
const badIssues = p => p.issues.filter(i => ['NATIVE_LOAD_EFFECT_CONFLICT', 'NATIVE_LOAD_RECORD_INVALID'].includes(i.code)).map(i => i.code);

test('R6-B14 HELD UNDO ONCE [Y] (Astra L4 B14; spec R8 :121, :153, :156): after the retire-only undo of a held baseline, checking the same undo again offers nothing and nothing re-conflicts', async () => {
  const fault = faultDatabase(), { era, host, ask } = await heldBaselineUndone(fault);
  const again = await host.check(ask);
  assert.equal(again.status, 'refused', 'no second undo for a cancelled spend');
  assert.deepEqual(again.offers, []);
  const p = await host.project();
  assert.deepEqual(badIssues(p), []);
  assert.equal(pressOf(p).quarantined, undefined, 'never re-quarantined');
  host.close(); era.close();
});

test('R6-B15 UNDO SURVIVES REOPEN AND A LATER BASE [Y] (Astra L4 B15; spec R8 :153-156): the retire-only undo of a held baseline stays COMPENSATED after close/reopen with an immutable base of 50', async () => {
  const fault = faultDatabase(), first = await heldBaselineUndone(fault);
  first.host.close(); first.era.close();
  const again = await reopenAt(fault, D1), host = await again.createNativeLoadHost({ day: D1, engineState: withPress(D1, { w: 50 }) });
  const p = await host.project();
  assert.deepEqual(badIssues(p), [], 'no conflict and no RECORD_INVALID after the base moved again');
  assert.equal(pressOf(p).w, 50, 'the later base stands');
  assert.equal(pressOf(p).quarantined, undefined);
  assert.ok(p.effects.every(x => x.kind !== 'adopted'));
  host.close(); again.close();
});

test('R6-B16 CAPTURED HELD ADOPTION [Y] (Astra L4 B16; spec R8 :153): a 60 baseline is agreed and a later Start captures 60; with a moved base the undo is refused COMPENSATION_DESCENDANTS before any write', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const one = await dayEntryWith(era, D1, withPress(D1, { w: null }));
  assert.equal((await train(one.entry, 12, '1', { load: '60' })).finished.ok, true);
  await one.entry.nativeLoad.settled();
  await one.entry.nativeLoad.check();
  const offer = one.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.equal((await one.entry.nativeLoad.accept(offer.proposalId)).acknowledged, true);
  one.entry.gymHost.close();
  const two = await dayEntryWith(era, D2, withPress(D2, { w: null }));
  assert.match((await two.entry.gym.read()).prescription.line, /^60 lb/, 'the adopted 60 is on the D2 card');
  assert.equal((await two.entry.gym.start()).ok, true, 'the D2 Start captures 60 and stays active');
  const host = await era.createNativeLoadHost({ day: D2, engineState: withPress(D2, { w: 45 }) });
  const body = (await responsesOf(era))[0].payload.issuance.body;
  const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: body.evidence.at(-1).close.op_id, intent: { compensate: body.spend_id } });
  assert.equal(undo.status, 'refused', 'no undo once a Start captured the adopted weight');
  assert.equal(undo.refusal.code, 'NATIVE_LOAD_COMPENSATION_DESCENDANTS');
  assert.equal((await responsesOf(era)).length, 1, 'nothing written');
  host.close(); two.entry.gymHost.close(); era.close();
});

test('R6-B17 FULL ISSUANCE AT THE HOST [Y] (Astra L4 B17/M14; spec :60, :148): through the real respond path, a fresh offer whose body was substituted under a colliding digest (test seam) is STALE_OFFER and writes nothing', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const { entry } = await twoTops(era);
  assert.equal((await train(entry)).finished.ok, true);
  await entry.nativeLoad.settled();
  await entry.nativeLoad.check();
  const offer = entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  // TEST SEAM (no product hook): the shared FC03 module object today-bindings imports. The
  // re-evaluation at yes returns a substituted body, and the exported digest is made to
  // collide with the held proposal id, so only a FULL comparison can refuse it.
  const NLE = require('../../../../m4/workout/native-load-effects.cjs');
  const realCheck = NLE.checkNativeLoad, realDigest = NLE.proposalDigest;
  const forged = body => JSON.stringify(body).includes('"SYNTHETIC-SUBSTITUTED"');
  NLE.checkNativeLoad = args => {
    const out = realCheck(args);
    if (out.evaluation.status === 'offer') out.evaluation.offers = out.evaluation.offers.map(o => ({ ...o, body: { ...o.body, reason_key: o.body.reason_key, basis: { ...o.body.basis, source: { ...o.body.basis.source, selection_id: 'SYNTHETIC-SUBSTITUTED' } } } }));
    return out;
  };
  NLE.proposalDigest = (producer, body, reason) => (forged(body) ? offer.proposalId : realDigest(producer, body, reason));
  let result;
  try { result = await entry.nativeLoad.accept(offer.proposalId); }
  finally { NLE.checkNativeLoad = realCheck; NLE.proposalDigest = realDigest; }
  assert.equal(result.acknowledged, false, 'a substituted body is never the issued one');
  assert.equal(result.code, 'NATIVE_LOAD_STALE_OFFER');
  assert.equal((await responsesOf(era)).length, 0, 'nothing written');
  entry.gymHost.close(); era.close();
});

// ROUND 7 actual-host rows (Astra L5 B18, B20, B21, B22).
test('R7-B18 UNDO SURVIVES THE ORIGINAL BASE [Y] (Astra L5 B18; spec R8 :121, :153-156): the retire-only undo of a held 60 baseline stays in force when a reopen brings back the original base with no working weight', async () => {
  const fault = faultDatabase(), first = await heldBaselineUndone(fault);
  first.host.close(); first.era.close();
  const again = await reopenAt(fault, D1), host = await again.createNativeLoadHost({ day: D1, engineState: withPress(D1, { w: null }) });
  const p = await host.project();
  assert.deepEqual(badIssues(p), [], 'no conflict and no RECORD_INVALID');
  assert.equal(pressOf(p).w, null, 'the undone 60 never returns');
  assert.equal(pressOf(p).quarantined, undefined);
  host.close(); again.close();
});

test('R7-B20 RENAME KEEPS THE AGREED 45 [Y] (Astra L5 B20; spec :103, :120, :154, N19c): yes 45, then a reopen where only the lift name changed keeps the agreed target and the card debuts 45', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  entry.gymHost.close(); era.close();
  const renamed = day => withPress(day, { n: 'Renamed synthetic press' });
  const again = await reopenAt(fault, D3), host = await again.createNativeLoadHost({ day: D3, engineState: renamed(D3) }), p = await host.project();
  assert.deepEqual(badIssues(p), []);
  assert.deepEqual(nativeQueue(p.state, 'demo-press').map(q => [q.done, q.newW]), [[false, 45]], 'the consented target survives the rename');
  assert.equal(pressOf(p).quarantined, undefined);
  const three = await dayEntryWith(again, D3, renamed(D3));
  assert.match((await three.entry.gym.read()).prescription.line, /^45 lb/);
  host.close(); three.entry.gymHost.close(); again.close();
});

test('R7-B21 ADOPTED PLAN MAKES THE OLD OFFER STALE [Y] (Astra L5 B21; spec :148 "Stale means STALE_OFFER", :165, N07): offer 45, the page adopts a basis with demo-press at 42.5 and refreshes; the old offer yes is STALE_OFFER with zero writes', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const { entry, model } = await twoTops(era);
  assert.equal((await train(entry)).finished.ok, true);
  await entry.nativeLoad.settled();
  await entry.nativeLoad.check();
  const offer = entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.ok(offer, 'an offer for demo-press');
  model.adoptBasis(withPress(D2, { w: 42.5 }));
  await entry.refresh();
  const result = await entry.nativeLoad.accept(offer.proposalId);
  assert.equal(result.acknowledged, false, 'the old offer was issued on the old plan');
  assert.equal(result.code, 'NATIVE_LOAD_STALE_OFFER');
  assert.equal((await responsesOf(era)).length, 0, 'zero writes');
  entry.gymHost.close(); era.close();
});

test('R7-B22 A NEW HOST REFUSES A PRE-EDIT CAPTURE [Y] (Astra L5 B22; spec :127, :148, step 2): two workouts captured 40/40, then a fresh host on a plan of 42.5 refuses the old completion PLAN_CHANGED and writes nothing', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const { entry } = await twoTops(era);
  assert.equal((await train(entry)).finished.ok, true);
  await entry.nativeLoad.settled();
  entry.gymHost.close();
  const host = await era.createNativeLoadHost({ day: D2, engineState: withPress(D2, { w: 42.5 }) }), p = await host.project();
  const press = p.lifts.find(l => l.lift_lineage_id === 'demo-press');
  const checked = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: press.completion_op_id });
  assert.equal(checked.status, 'refused', 'no offer over the newer plan');
  assert.equal(checked.refusal.code, 'NATIVE_LOAD_PLAN_CHANGED');
  // D-B6-2 (spec :176): refs = [Close Ref] of the checked completion, never [].
  assert.deepEqual(checked.refusal.refs.map(r => r.op_id), [press.completion_op_id], 'refs = [Close Ref]');
  assert.ok(checked.refusal.refs.every(r => typeof r.commitment === 'string' && r.commitment.length > 0), 'the Close Ref carries its commitment');
  assert.equal((await responsesOf(era)).length, 0);
  host.close(); era.close();
});

// ROUND 9: Astra L6's three failing host callbacks (native-load-astra-l6-4b83f4c/panel-l6.mjs),
// bodies verbatim; DECISIONS:793 (re-validation at the original cut only) and :126/:184.
test('R9-B23 ASTRA L6 colon-rich display name preserves the accepted target on rename',async()=>{
 const fault=faultDatabase(),era=await reopenAt(fault,D1),oldName=Array(12).fill('A').join(': ');
 for(const day of [D1,D2]){
  const {entry}=await dayEntryWith(era,day,withPress(day,{n:oldName}));
  assert.equal((await train(entry)).finished.ok,true);await entry.nativeLoad.settled();
  if(day===D2){await entry.nativeLoad.check();const o=entry.nativeLoad.view().offers.find(o=>o.lift==='demo-press');assert.ok(o);assert.equal((await entry.nativeLoad.accept(o.proposalId)).acknowledged,true);}
  entry.gymHost.close();
 }
 era.close();const again=await reopenAt(fault,D3),host=await again.createNativeLoadHost({day:D3,engineState:withPress(D3,{n:'Renamed'})}),p=await host.project();
 const output={name:oldName,length:oldName.length,w:pressOf(p).w,quarantined:pressOf(p).quarantined,queue:nativeQueue(p.state,'demo-press').map(q=>[q.done,q.newW]),issues:p.issues.map(i=>i.code),responses:(await responsesOf(again)).length,closes:(await opsOf(again)).filter(o=>o.kind==='session-close').length};
 console.log('L6_NAME '+JSON.stringify(output));host.close();again.close();assert.deepEqual(output.queue,[[false,45]],'consented 45 survives a display-only rename');
});
test('R9-B25 ASTRA L6 completed work cannot be newly priced under an edited rep window',async()=>{
 const fault=faultDatabase(),era=await reopenAt(fault,D1),{entry}=await twoTops(era);assert.equal((await train(entry)).finished.ok,true);await entry.nativeLoad.settled();
 const host=await era.createNativeLoadHost({day:D2,engineState:withPress(D2,{hi:10})}),p=await host.project(),lift=p.lifts.find(l=>l.lift_lineage_id==='demo-press'),ev=await host.check(lift);
 const start=(await opsOf(era)).filter(o=>o.kind==='session-start').at(-1),cap=start.prescription_capture.slots.filter(s=>s.lift_lineage_id==='demo-press').map(s=>JSON.parse(s.reps.source_json));
 console.log('L6_WINDOW_CHECK '+JSON.stringify({oldHi:12,newHi:10,capturedReps:cap,status:ev.status,offers:ev.offers.map(o=>({kind:o.kind,loads:o.loads})),refusal:ev.refusal,responses:(await responsesOf(era)).length}));
 host.close();entry.gymHost.close();era.close();assert.equal(ev.refusal?.code,'NATIVE_LOAD_PLAN_CHANGED','governing rep window changed since completion');
});
test('R9-B24 ASTRA L6 saved yes survives a later rep-window change as held authority',async()=>{
 const fault=faultDatabase(),era=await reopenAt(fault,D1),entry=await yesTo(era,'demo-press');entry.gymHost.close();era.close();
 const again=await reopenAt(fault,D3),host=await again.createNativeLoadHost({day:D3,engineState:withPress(D3,{hi:15})}),p=await host.project();
 console.log('L6_WINDOW_REPLAY '+JSON.stringify({oldHi:12,newHi:15,w:pressOf(p).w,quarantined:pressOf(p).quarantined,queue:nativeQueue(p.state,'demo-press').map(q=>[q.done,q.newW]),effects:p.effects.map(e=>e.kind),issues:p.issues.map(i=>i.code),responses:(await responsesOf(again)).length}));
 host.close();again.close();assert.ok(p.effects.length,'the consented target is not discarded by a changed current rep window');
});

// ROUND 10: Astra L7 B27 (native-load-astra-l7-0e4fc74/panel-l7.mjs), body verbatim. Round
// 10's STOP witness; round 11 closes it with FC16 (window_hi in the capture, spec R9 :127).
test('R10-B27 ASTRA L7 raised window with overperformed sets cannot reprice old work',async()=>{
 const fault=faultDatabase(),era=await reopenAt(fault,D1);
 for(const day of [D1,D2]){const {entry}=await dayEntry(era,day);assert.equal((await train(entry,day===D1?12:15)).finished.ok,true);await entry.nativeLoad.settled();entry.gymHost.close();}
 const host=await era.createNativeLoadHost({day:D2,engineState:withPress(D2,{hi:14})}),p=await host.project();
 const lift=p.lifts.find(l=>l.lift_lineage_id==='demo-press'),ev=await host.check(lift);
 const start=(await opsOf(era)).filter(o=>o.kind==='session-start').at(-1);
 const captured=start.prescription_capture.slots.filter(s=>s.lift_lineage_id==='demo-press').map(s=>JSON.parse(s.reps.source_json).value);
 console.log('L7_RAISED_WINDOW '+JSON.stringify({oldHi:12,newHi:14,actualReps:15,captured,status:ev.status,offers:ev.offers.map(o=>({kind:o.kind,loads:o.loads})),refusal:ev.refusal,responses:(await responsesOf(era)).length}));
 host.close();era.close();assert.equal(ev.status,'refused','a window raise must not make an old completion eligible under a different governing window');
});

// ROUND 11 (spec R9 N26 WINDOW-CAPTURE on the actual durable host; FC16 capture).
for (const hi of [12, 14]) test('N26 WINDOW-CAPTURE [Y] (spec R9 :127, FC16): D1 [12,12], D2 captured with window_hi 12 and performed [15,15]; ' + (hi === 12 ? 'hi left at 12 -> no window refusal, FC01 offers 45 on the Close' : 'hi raised to 14 -> PLAN_CHANGED [D2 Close Ref], no offer, no response'), async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  for (const day of [D1, D2]) { const { entry } = await dayEntry(era, day); assert.equal((await train(entry, day === D1 ? 12 : 15)).finished.ok, true); await entry.nativeLoad.settled(); entry.gymHost.close(); }
  const start = (await opsOf(era)).filter(o => o.kind === 'session-start').at(-1);
  const cells = start.prescription_capture.slots.filter(s => s.lift_lineage_id === 'demo-press').map(s => JSON.parse(s.reps.source_json));
  assert.deepEqual(cells.map(c => c.window_hi), [12, 12], 'FC16: every specified reps cell carries the governing window');
  const host = await era.createNativeLoadHost({ day: D2, engineState: withPress(D2, { hi }) }), p = await host.project();
  const lift = p.lifts.find(l => l.lift_lineage_id === 'demo-press'), ev = await host.check(lift);
  const close = (await opsOf(era)).filter(o => o.kind === 'session-close').at(-1);
  if (hi === 12) { assert.equal(ev.status, 'offer', JSON.stringify(ev.refusal)); assert.deepEqual(ev.offers.find(o => o.lift === 'demo-press').loads, [45, 45]); }
  else { assert.equal(ev.status, 'refused'); assert.equal(ev.refusal.code, 'NATIVE_LOAD_PLAN_CHANGED'); assert.deepEqual(ev.refusal.refs.map(r => r.op_id), [close.op_id]); assert.equal(ev.refusal.field, null); }
  assert.equal((await responsesOf(era)).length, 0);
  host.close(); era.close();
});
// ROUND 13 (spec R9.2 :158 NO TRAP, D1 :311 N27) on the actual durable host.
const D4 = '2030-02-14';
const NativeLoadEffects = require('../../../../m4/workout/native-load-effects.cjs');
const slotsOf = async (entry, day) => {
  const whole = await entry.gymHost.host.client.prepareWorkout({ planned_split_slot_id: 'earned-today-preview/' + day });
  assert.equal(whole.prepared, true, whole.code);
  return whole.view.slots;
};
// A record claiming an earlier cut, as a foreign or buggy writer would leave it in the local
// log: the guarded host never issues one (tickets), so it is written straight through the
// durable repository, after the genuine yes.
async function forgeEarlyCut(entry) {
  const repo = entry.gymHost.repository, snap = await repo.load(), gen = structuredClone(snap.generation), ops = gen.collections.ops;
  const yes = Object.values(ops).find(o => o.kind === 'proposal-response');
  const starts = Object.values(ops).filter(o => o.kind === 'session-start').sort((a, b) => a.device_seq - b.device_seq);
  const body = structuredClone(yes.payload.issuance.body), root = JSON.stringify(['fx-start-absent', body.lift_lineage_id, 'fx-close-absent']), d = JSON.parse(body.spend_id);
  body.consumes = [root]; d[4] = [root]; body.spend_id = JSON.stringify(d); body.evidence = [];
  body.basis.order = { ...body.basis.order, start_ids: [starts[0].op_id], frontier: 1 };
  const issuance = { ...structuredClone(yes.payload.issuance), body };
  const op = { ...structuredClone(yes), op_id: yes.op_id + '-early-cut', device_seq: Math.max(...Object.values(ops).map(o => o.device_seq)) + 1,
    payload: { ...structuredClone(yes.payload), proposal_id: NativeLoadEffects.proposalDigest(issuance.producer, body, issuance.reason), issuance } };
  ops[op.op_id] = op;
  await repo.commit({ revision: snap.revision, token: snap.token }, gen);
  return { op, yes };
}
test('N27 (a) NO-TRAP [Y] (spec R9.2 :158, :157 gate, D1 :311 (a)): a record claiming an earlier cut cannot enter the installation\'s log (the T2 stage refuses the tampered generation on reopen); the same hold class reached through the host (yes 45, then the plan moved to 42.5: the unprovable-order hold) refuses the earn by that hold, offers Undo (retires Q45, no w write), prescribes demo-press as the baseline ask while demo-row is normal, and after D3 trained at 42.5 offers adopt-baseline 42.5 whose yes supersedes the hold; the D4 card is 42.5', async () => {
  {
    const fault = faultDatabase(), era = await reopenAt(fault, D1);
    hostGate(era);
    const entry = await yesTo(era, 'demo-press');
    await forgeEarlyCut(entry);
    entry.gymHost.close(); era.close();
    let refused = null;
    try { const again = await reopenAt(fault, D3); const h = await again.createNativeLoadHost({ day: D3, engineState: basisFor(D3) }); const p = await h.project(); refused = p.ok ? null : p.code; h.close(); again.close(); }
    catch (error) { refused = error && (error.code || error.message); }
    assert.equal(refused, 'T2_INTEGRITY_UNPROVEN', 'the admission path refuses a record the installation did not write');
  }
  const moved = day => withPress(day, { w: 42.5 });
  for (const exit of ['undo', 'adopt']) {
    const fault = faultDatabase(), era = await reopenAt(fault, D1);
    hostGate(era);
    const entry = await yesTo(era, 'demo-press');
    entry.gymHost.close(); era.close();
    const again = await reopenAt(fault, D3), host = await again.createNativeLoadHost({ day: D3, engineState: moved(D3) });
    const yes = (await responsesOf(again))[0], body = yes.payload.issuance.body, c2 = body.evidence.at(-1).close.op_id;
    const earn = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: c2 });
    assert.equal(earn.status, 'refused', exit);
    // Round 14 (spec R9.3 :162, G3): D2 closed before the hold on its numeric 40 card, so its
    // check refuses PLAN_CHANGED [its Close Ref]; the hold stays named on the projection.
    assert.deepEqual([earn.refusal.code, earn.refusal.refs.map(r => r.op_id)], ['NATIVE_LOAD_PLAN_CHANGED', [c2]], exit);
    assert.ok((await host.project()).issues.some(i => i.code === 'NATIVE_LOAD_EFFECT_CONFLICT' && i.refs.some(r => r.op_id === yes.op_id)), 'the hold is named');
    const p0 = await host.project();
    assert.deepEqual(nativeQueue(p0.state, 'demo-press'), [], 'the held projection prescribes no held native entry');
    assert.equal(pressOf(p0).w, null, 'held: w projects null');
    if (exit === 'undo') {
      const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: c2, intent: { compensate: body.spend_id } });
      assert.equal(undo.status, 'offer', JSON.stringify(undo.refusal));
      assert.equal((await host.respond({ handle: undo.offers[0].handle, proposal_id: undo.offers[0].proposalId, answer: 'accept' })).acknowledged, true);
      const p = await host.project();
      assert.equal(pressOf(p).w, 42.5, 'retire-only: the plan weight, no w write');
      host.close(); again.close();
      continue;
    }
    host.close();
    const three = await dayEntryWith(again, D3, moved(D3)), slots = await slotsOf(three.entry, D3);
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), 'every other lift normal');
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), 'demo-press: the baseline ask');
    assert.equal((await train(three.entry, 12, '1', { load: '42.5' })).finished.ok, true);
    await three.entry.nativeLoad.settled();
    await three.entry.nativeLoad.check();
    const offer = three.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
    assert.ok(offer, 'exit (b): an adoption is offered on the held lift ' + JSON.stringify(three.entry.nativeLoad.view().refusals));
    assert.deepEqual([offer.kind, offer.loads], ['adopt-baseline', [42.5, 42.5]]);
    assert.equal((await three.entry.nativeLoad.accept(offer.proposalId)).acknowledged, true);
    three.entry.gymHost.close(); again.close();
    const later = await reopenAt(fault, D4), four = await dayEntryWith(later, D4, moved(D4)), view = await four.entry.gym.read();
    assert.equal(view.phase, 'ready', view.code || '');
    assert.equal(view.lift.id, 'demo-press'); assert.match(view.prescription.line, /^42\.5 lb/, 'the adopted 42.5 is the working weight');
    const h = await later.createNativeLoadHost({ day: D4, engineState: moved(D4) }), p = await h.project();
    assert.ok(p.issues.filter(i => i.code === 'NATIVE_LOAD_EFFECT_CONFLICT').every(i => i.superseded_by), 'the holding record stays recorded, superseded');
    h.close(); four.entry.gymHost.close(); later.close();
  }
});
test('N27 (b) NO-TRAP descendant variant [Y] (spec R9.2 :158, D1 :311 (b)): D1 at 45 adopted (w 45), D2 trained on the 45 card, D1 set removed -> BASIS_REPAIR_REQUIRED; Undo refuses COMPENSATION_DESCENDANTS; the D3 card asks for demo-press; D3 at 45 offers adopt-baseline 45; its yes -> the D4 card is 45', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const one = await dayEntry(era, D1);
  assert.equal((await train(one.entry, 12, '1', { loadFor: { 'demo-press': 45 } })).finished.ok, true);
  await one.entry.nativeLoad.settled(); await one.entry.nativeLoad.check();
  const adopt = one.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.equal(adopt && adopt.kind, 'adopt-observed', JSON.stringify(one.entry.nativeLoad.view()));
  assert.equal((await one.entry.nativeLoad.accept(adopt.proposalId)).acknowledged, true);
  one.entry.gymHost.close();
  const two = await dayEntry(era, D2);
  assert.match((await two.entry.gym.read()).prescription.line, /^45 lb/, 'control: D2 carries the adopted 45');
  assert.equal((await train(two.entry)).finished.ok, true);
  await two.entry.nativeLoad.settled();
  const history = await two.entry.gymHost.host.client.readWorkoutHistory();
  const s1 = history.history.sessions.find(s => s.projection.close_records.length && s.projection.start_record.current.effective.local_date === D1);
  const target = s1.projection.facts.filter(f => f.included === true && f.lift_lineage_id === 'demo-press')[0].source_op_id;
  const edit = await two.entry.gymHost.host.client.prepareWorkoutEdit({ target_op_id: target });
  assert.equal(edit.prepared, true, edit.code);
  assert.equal((await two.entry.gymHost.host.client.commitWorkoutEdit({ editId: edit.editId, action: 'remove', change: 'SYNTHETIC correction' })).acknowledged, true);
  two.entry.gymHost.close(); era.close();
  const again = await reopenAt(fault, D3), host = await again.createNativeLoadHost({ day: D3, engineState: basisFor(D3) });
  const body = (await responsesOf(again))[0].payload.issuance.body;
  const p = await host.project();
  assert.ok(p.issues.some(i => i.code === 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED' && i.lift === 'demo-press'), JSON.stringify(p.issues));
  const last = p.lifts.find(l => l.lift_lineage_id === 'demo-press');
  const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: last.completion_op_id, intent: { compensate: body.spend_id } });
  assert.equal(undo.status, 'refused'); assert.equal(undo.refusal.code, 'NATIVE_LOAD_COMPENSATION_DESCENDANTS', 'the guard is unchanged');
  host.close();
  const three = await dayEntry(again, D3), slots = await slotsOf(three.entry, D3);
  assert.ok(slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), 'demo-press: the baseline ask');
  assert.equal((await train(three.entry, 12, '1', { load: '45' })).finished.ok, true);
  await three.entry.nativeLoad.settled(); await three.entry.nativeLoad.check();
  const offer = three.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.ok(offer, 'exit (b) ' + JSON.stringify(three.entry.nativeLoad.view().refusals));
  assert.deepEqual([offer.kind, offer.loads], ['adopt-baseline', [45, 45]]);
  assert.equal((await three.entry.nativeLoad.accept(offer.proposalId)).acknowledged, true);
  three.entry.gymHost.close(); again.close();
  const later = await reopenAt(fault, D4), four = await dayEntry(later, D4), view = await four.entry.gym.read();
  assert.equal(view.phase, 'ready', view.code || '');
  assert.equal(view.lift.id, 'demo-press'); assert.match(view.prescription.line, /^45 lb/, 'the adopted 45, the dispute superseded');
  // Mutant R13-fa02-superseded: a superseded hold is history, so the panel no longer labels
  // demo-press disputed (R4-DB21 is the control: an active hold is labeled).
  await four.entry.refresh();
  const doc = shell(), phone = doc.getElementById('phone');
  await four.entry.open({ doc, phone, back: () => {} });
  assert.equal(q(doc, '[data-native-load="notice"][data-lift="demo-press"]'), null, 'no disputed label after the exit');
  four.entry.gymHost.close(); later.close();
});
// Round 14 (spec R9.3 :158-163, D1 :316 (c)-(e)): the same cases on the real host.
async function removeSetOf(client, day, lift) {
  const history = await client.readWorkoutHistory();
  const session = history.history.sessions.find(s => s.projection.close_records.length && s.projection.start_record.current.effective.local_date === day);
  const target = session.projection.facts.filter(f => f.included === true && f.lift_lineage_id === lift)[0].source_op_id;
  const edit = await client.prepareWorkoutEdit({ target_op_id: target });
  assert.equal(edit.prepared, true, edit.code);
  assert.equal((await client.commitWorkoutEdit({ editId: edit.editId, action: 'remove', change: 'SYNTHETIC correction' })).acknowledged, true);
}
test('N27 (c) B-R9-6 [Y] (spec R9.3 :159-161, D1 :316 (c)): yes Q45; D3 captured 45 but demo-press was performed at 40 (no landing); a D2 set removed -> BASIS_REPAIR_REQUIRED; Undo refuses COMPENSATION_DESCENDANTS; the D4 capture: demo-row 40, demo-press the baseline ask, Q hidden, prepared (no ENGINE_CAPTURE_BASELINE_UNPROVEN); a cold reopen projects the same; D4 at 40 offers adopt-baseline 40; its yes -> w 40, Q done/SUPERSEDED, spend kept', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  entry.gymHost.close(); era.close();
  const again = await reopenAt(fault, D3), three = await dayEntry(again, D3);
  assert.match((await three.entry.gym.read()).prescription.line, /^45 lb/, 'control: the D3 card captures Q45');
  assert.equal((await train(three.entry, 12, '1', { loadFor: { 'demo-press': 40 } })).finished.ok, true);
  await three.entry.nativeLoad.settled();
  await removeSetOf(three.entry.gymHost.host.client, D2, 'demo-press');
  three.entry.gymHost.close(); again.close();
  const cold = async () => {
    const e = await reopenAt(fault, D4), h = await e.createNativeLoadHost({ day: D4, engineState: basisFor(D4) }), p = await h.project();
    const out = JSON.stringify([p.state, p.issues]); h.close(); e.close(); return out;
  };
  const first = await cold();
  assert.equal(await cold(), first, 'cold replay identical');
  const four = await reopenAt(fault, D4), host = await four.createNativeLoadHost({ day: D4, engineState: basisFor(D4) }), p = await host.project();
  const yes = (await responsesOf(four))[0], body = yes.payload.issuance.body;
  assert.ok(p.issues.some(i => i.code === 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED' && i.lift === 'demo-press'), JSON.stringify(p.issues));
  assert.deepEqual(nativeQueue(p.state, 'demo-press'), [], 'Q hidden from the projection');
  const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: body.evidence.at(-1).close.op_id, intent: { compensate: body.spend_id } });
  assert.deepEqual([undo.status, undo.refusal && undo.refusal.code], ['refused', 'NATIVE_LOAD_COMPENSATION_DESCENDANTS']);
  host.close();
  const day4 = await dayEntry(four, D4), slots = await slotsOf(day4.entry, D4);
  assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), 'demo-row normal');
  assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), 'demo-press: the baseline ask');
  assert.equal((await train(day4.entry, 12, '1', { load: '40' })).finished.ok, true);
  await day4.entry.nativeLoad.settled(); await day4.entry.nativeLoad.check();
  const offer = day4.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.ok(offer, 'exit (b) ' + JSON.stringify(day4.entry.nativeLoad.view().refusals));
  assert.deepEqual([offer.kind, offer.loads], ['adopt-baseline', [40, 40]]);
  assert.equal((await day4.entry.nativeLoad.accept(offer.proposalId)).acknowledged, true);
  const h2 = await four.createNativeLoadHost({ day: D4, engineState: basisFor(D4) }), p2 = await h2.project();
  assert.equal(p2.state.exercises.find(e => e.id === 'demo-press').w, 40, 'w = the adopted 40');
  assert.deepEqual(p2.state.queue.filter(q => q.native_load_spend === body.spend_id).map(q => [q.done, q.state]), [[true, 'SUPERSEDED']]);
  assert.ok(p2.spent.some(x => x.spend_id === body.spend_id && !x.cancelled), 'spend kept');
  h2.close(); day4.entry.gymHost.close(); four.close();
});
test('N27 (d) G2 APPLIED BASE [Y] (spec R9.3 :160, D1 :316 (d)): yes to a 60 baseline (applied w 60, prior null); a D1 set removed -> held, no descendants; the Undo is issued on the applied state (base 60, target null: RESTORE) and its yes leaves no working weight', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const b = day => withPress(day, { w: null });
  const one = await dayEntryWith(era, D1, b(D1));
  assert.equal((await train(one.entry, 12, '1', { load: '60' })).finished.ok, true);
  await one.entry.nativeLoad.settled(); await one.entry.nativeLoad.check();
  const offer = one.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.equal(offer && offer.kind, 'adopt-baseline');
  assert.equal((await one.entry.nativeLoad.accept(offer.proposalId)).acknowledged, true);
  await removeSetOf(one.entry.gymHost.host.client, D1, 'demo-press');
  const host = await era.createNativeLoadHost({ day: D1, engineState: b(D1) }), p = await host.project();
  assert.ok(p.issues.some(i => i.code === 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED' && i.lift === 'demo-press'), JSON.stringify(p.issues));
  const body = (await responsesOf(era))[0].payload.issuance.body;
  const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: body.evidence.at(-1).close.op_id, intent: { compensate: body.spend_id } });
  assert.equal(undo.status, 'offer', JSON.stringify(undo.refusal));
  assert.deepEqual(undo.offers[0].loads, [null, null], 'the prior image: no working weight');
  assert.equal((await host.respond({ handle: undo.offers[0].handle, proposal_id: undo.offers[0].proposalId, answer: 'accept' })).acknowledged, true);
  const u = (await responsesOf(era)).find(o => o.payload.issuance.body.kind === 'compensate').payload.issuance.body;
  assert.deepEqual([u.base_load.scalar && u.base_load.scalar.value, u.target_load.scalar], [60, null], 'issued on the applied state: RESTORE-shaped');
  const after = await host.project();
  assert.equal(after.state.exercises.find(e => e.id === 'demo-press').w, null, 'restored: no working weight, not the 60 left applied');
  assert.ok(!after.issues.some(i => i.code === 'NATIVE_LOAD_RECORD_INVALID'), JSON.stringify(after.issues));
  host.close(); one.entry.gymHost.close(); era.close();
});
test('N27 (e) G3 [Y] (spec R9.3 :162, D1 :316 (e)): yes Q45 then the plan moved to 42.5 (the hold): the D2 completion, closed before the hold on its numeric 40 card, refuses PLAN_CHANGED [its Close Ref] with no adoption (the device-B case needs a second device, which this single-installation host cannot produce: FC12 N27 (e) carries it)', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  entry.gymHost.close(); era.close();
  const moved = day => withPress(day, { w: 42.5 });
  const again = await reopenAt(fault, D3), host = await again.createNativeLoadHost({ day: D3, engineState: moved(D3) });
  const yes = (await responsesOf(again))[0], c2 = yes.payload.issuance.body.evidence.at(-1).close.op_id;
  const r = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: c2 });
  assert.deepEqual([r.status, r.refusal && r.refusal.code, r.refusal && r.refusal.refs.map(x => x.op_id), r.offers || []], ['refused', 'NATIVE_LOAD_PLAN_CHANGED', [c2], []]);
  host.close(); again.close();
});
// Round 15 (spec R9.4 :159, D1 :316 (f)). The host never writes a legacy entry; a legacy
// (non-native) queue entry reaches it only through the page's basis state, as migrated or
// imported legacy programmes carry one. That is the path exercised here.
test('N27 (f) D-R9-LEGACY-ENTRY [Y] (spec R9.4 :159, D1 :316 (f)): yes Q45, then a basis whose plan moved to 42.5 (the hold) and which carries an unfinished legacy DEBUT 50 for demo-press: the D3 capture prepares (no ENGINE_CAPTURE_BASELINE_UNPROVEN), demo-row 40, demo-press the baseline ask; the projection hides the legacy entry; a cold reopen projects the same', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  entry.gymHost.close(); era.close();
  const legacy = day => { const s = withPress(day, { w: 42.5 }); s.queue.push({ exId: 'demo-press', kind: 'debut', done: false, state: 'DEBUT', newW: 50, t: 'SYNTHETIC legacy debut' }); return s; };
  const cold = async () => {
    const e = await reopenAt(fault, D3), h = await e.createNativeLoadHost({ day: D3, engineState: legacy(D3) }), p = await h.project();
    const out = { text: JSON.stringify([p.state, p.issues]), p }; h.close(); e.close(); return out;
  };
  const first = await cold();
  assert.ok(first.p.issues.some(i => i.code === 'NATIVE_LOAD_EFFECT_CONFLICT' && i.lift === 'demo-press' && !i.superseded_by), 'demo-press is held ' + JSON.stringify(first.p.issues));
  assert.deepEqual(first.p.state.queue.filter(q => q.exId === 'demo-press' && !q.done && ['debut', 'unlock'].includes(q.kind)), [], 'every unfinished debut/unlock entry of the held lift is hidden');
  assert.equal((await cold()).text, first.text, 'cold replay identical');
  const again = await reopenAt(fault, D3), three = await dayEntryWith(again, D3, legacy(D3)), slots = await slotsOf(three.entry, D3);
  assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), 'demo-row normal');
  assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), 'demo-press: the baseline ask, never the legacy 50');
  three.entry.gymHost.close(); again.close();
});
// Round 16 (spec R9.6 b739c2f8; Astra L8 B28-B30; fresh Fable l1 D-FRESH-1, D-FRESH-2).
test('R16-B28 RESTORE ON REPLAY [Y] (Astra L8 B28; spec R9.4 :156): D1 lifted at 45 on the 40 card, adopt 45, then Undo shown [40, 40] and accepted; a reopen whose admitted basis moved to 42.5 with no ordering op keeps the consented 40 (both responses kept, no open issue), never 42.5', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const one = await dayEntry(era, D1);
  assert.equal((await train(one.entry, 12, '1', { loadFor: { 'demo-press': 45 } })).finished.ok, true);
  await one.entry.nativeLoad.settled(); await one.entry.nativeLoad.check();
  const adopt = one.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.equal(adopt && adopt.kind, 'adopt-observed');
  assert.equal((await one.entry.nativeLoad.accept(adopt.proposalId)).acknowledged, true);
  const host = await era.createNativeLoadHost({ day: D1, engineState: basisFor(D1) });
  const body = (await responsesOf(era))[0].payload.issuance.body;
  const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: body.evidence.at(-1).close.op_id, intent: { compensate: body.spend_id } });
  assert.equal(undo.status, 'offer', JSON.stringify(undo.refusal));
  assert.deepEqual(undo.offers[0].loads, [40, 40]);
  assert.equal((await host.respond({ handle: undo.offers[0].handle, proposal_id: undo.offers[0].proposalId, answer: 'accept' })).acknowledged, true);
  host.close(); one.entry.gymHost.close(); era.close();
  const moved = day => withPress(day, { w: 42.5 });
  const again = await reopenAt(fault, D2), h = await again.createNativeLoadHost({ day: D2, engineState: moved(D2) }), p = await h.project();
  assert.equal((await responsesOf(again)).length, 2, 'both responses kept');
  assert.equal(pressOf(p).w, 40, 'the RESTORE applies: the consented 40, not the admitted 42.5');
  assert.ok(!p.issues.some(i => i.lift === 'demo-press' && !i.superseded_by && ['NATIVE_LOAD_EFFECT_CONFLICT', 'NATIVE_LOAD_RECORD_INVALID'].includes(i.code)), JSON.stringify(p.issues));
  h.close();
  const two = await dayEntryWith(again, D2, moved(D2)), view = await two.entry.gym.read();
  assert.equal(view.phase, 'ready', view.code || '');
  assert.equal(view.lift.id, 'demo-press'); assert.match(view.prescription.line, /^40 lb/, 'the card carries the consented 40');
  two.entry.gymHost.close(); again.close();
});
// Round 18 (spec R9.9 679567a :152, :155, J (a)/(b); DECISIONS:796 (c), H11 option 1): the R9.6-R9.8
// expectations of this row (hold, baseline-ask D4 capture, adopt-baseline exit, SUPERSEDED) are retired.
test('N29 MISSED-DEBUT R9.9 [Y] (spec R9.9 :152, :155, J (a)/(b), D1 N29; DECISIONS:796 (c)): yes Q45; D3 captures the 45 debut card and demo-press is lifted at 35, below the working 40 -> Q45 consumed MISSED, no hold, w 40; the D4 capture is the numeric 40 card (never 45); the D3 check offers adopt-observed [35, 35] whose record claims the D3 Close; Undo of Q45 refuses COMPENSATION_DESCENDANTS; the yes puts 35 on the next card. Variant lifted AT 40: the D3 check refuses PLAN_CHANGED and the next card stays 40', async () => {
  for (const [load, variant] of [[35, 'below'], [40, 'at']]) {
    const fault = faultDatabase(), era = await reopenAt(fault, D1);
    hostGate(era);
    const entry = await yesTo(era, 'demo-press');
    entry.gymHost.close(); era.close();
    const again = await reopenAt(fault, D3), three = await dayEntry(again, D3);
    assert.match((await three.entry.gym.read()).prescription.line, /^45 lb/, 'control: the debut card');
    assert.equal((await train(three.entry, 12, '1', { loadFor: { 'demo-press': load } })).finished.ok, true);
    await three.entry.nativeLoad.settled();
    const host = await again.createNativeLoadHost({ day: D3, engineState: basisFor(D3) }), p = await host.project();
    const yes = (await responsesOf(again))[0].payload.issuance.body;
    assert.deepEqual(nativeQueue(p.state, 'demo-press').map(x => [x.done, x.state]), [[true, 'MISSED']], variant + ' ' + JSON.stringify(p.issues));
    assert.ok(!p.issues.some(i => i.lift === 'demo-press' && (NativeLoadEffects.isHold(i) || i.code === 'NATIVE_LOAD_DEBUT_BASIS_UNPROVEN')), variant + ' ' + JSON.stringify(p.issues));
    assert.equal(pressOf(p).w, 40, variant + ': nothing written');
    const d3 = p.lifts.find(l => l.lift_lineage_id === 'demo-press').completion_op_id;
    const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: d3, intent: { compensate: yes.spend_id } });
    assert.deepEqual([undo.status, undo.refusal && undo.refusal.code], ['refused', 'NATIVE_LOAD_COMPENSATION_DESCENDANTS'], variant);
    host.close();
    const four = await dayEntry(again, D4), slots = await slotsOf(four.entry, D4);
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => /^40 lb/.test(s.load.display)), variant + ': D4 is the numeric 40 card, never 45');
    four.entry.gymHost.close();
    await three.entry.nativeLoad.check();
    const view = three.entry.nativeLoad.view();
    if (variant === 'at') {
      assert.deepEqual(view.offers.filter(o => o.lift === 'demo-press'), [], 'nothing offered at the working weight');
      assert.deepEqual(view.refusals.filter(r => r.lift === 'demo-press').map(r => r.code), ['NATIVE_LOAD_PLAN_CHANGED']);
      three.entry.gymHost.close(); again.close();
      continue;
    }
    const offer = view.offers.find(o => o.lift === 'demo-press');
    assert.ok(offer, 'the missed Close is offered the lifted load ' + JSON.stringify(view.refusals));
    assert.deepEqual([offer.kind, offer.loads], ['adopt-observed', [35, 35]]);
    assert.equal((await three.entry.nativeLoad.accept(offer.proposalId)).acknowledged, true);
    const body = (await responsesOf(again)).map(r => r.payload.issuance.body).find(b => b.kind === 'adopt-observed');
    assert.deepEqual(body.basis.load_basis.authority_refs.map(r => r.op_id), [d3], 'the record claims the missed D3 Close');
    three.entry.gymHost.close(); again.close();
    const later = await reopenAt(fault, D4), five = await dayEntry(later, D4), v = await five.entry.gym.read();
    assert.equal(v.phase, 'ready', v.code || '');
    assert.equal(v.lift.id, 'demo-press'); assert.match(v.prescription.line, /^35 lb/, 'the adopted 35 is the next card');
    five.entry.gymHost.close(); later.close();
  }
});
test('N30 HELD-UNEQUAL [Y] (spec R9.6 :163, Astra L8 B30): D1 at 45 adopted, D2 trained on the 45 card, a D1 set removed -> held; D3 on the baseline ask lifted at [45, 40] -> the check refuses VECTOR_ADOPTION_UNDEFINED, not BASIS_REPAIR_REQUIRED, and offers nothing for demo-press', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const one = await dayEntry(era, D1);
  assert.equal((await train(one.entry, 12, '1', { loadFor: { 'demo-press': 45 } })).finished.ok, true);
  await one.entry.nativeLoad.settled(); await one.entry.nativeLoad.check();
  const adopt = one.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.equal((await one.entry.nativeLoad.accept(adopt.proposalId)).acknowledged, true);
  one.entry.gymHost.close();
  const two = await dayEntry(era, D2);
  assert.equal((await train(two.entry)).finished.ok, true);
  await two.entry.nativeLoad.settled();
  await removeSetOf(two.entry.gymHost.host.client, D1, 'demo-press');
  two.entry.gymHost.close(); era.close();
  const again = await reopenAt(fault, D3), three = await dayEntry(again, D3);
  assert.equal((await train(three.entry, 12, '1', { loadSeqFor: { 'demo-press': [45, 40] } })).finished.ok, true);
  await three.entry.nativeLoad.settled(); await three.entry.nativeLoad.check();
  const view = three.entry.nativeLoad.view();
  assert.deepEqual(view.offers.filter(o => o.lift === 'demo-press'), [], 'no scalar invented');
  assert.deepEqual(view.refusals.filter(r => r.lift === 'demo-press').map(r => r.code), ['NATIVE_LOAD_VECTOR_ADOPTION_UNDEFINED']);
  three.entry.gymHost.close(); again.close();
});
test('D-FRESH-2 REGISTRAR SOURCE [Y] (spec R9.6 :164, :155 S7; fresh l1 D-FRESH-2): the guarded host cannot carry a recorded yes with a forged basis.source (a record rewritten straight through the durable repository is refused LOCAL_HISTORY_IDENTITY_UNPROVEN), and the capture registrar folds with the SAME admitted source as project() and check(), so both read one projection (FC12 R16-D-FRESH-2 shows the fold difference)', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  const repo = entry.gymHost.repository, snap = await repo.load(), gen = structuredClone(snap.generation), ops = gen.collections.ops;
  const yes = Object.values(ops).find(o => o.kind === 'proposal-response');
  const body = structuredClone(yes.payload.issuance.body);
  body.basis.source = { W: 7, log_digest: 'fx-forged-source', selection_id: null };
  const issuance = { ...structuredClone(yes.payload.issuance), body, revision: 'earned/native-load/v1+sha256:fx-absent-revision' };
  ops[yes.op_id] = { ...yes, payload: { ...yes.payload, proposal_id: NativeLoadEffects.proposalDigest(issuance.producer, body, issuance.reason), issuance } };
  await repo.commit({ revision: snap.revision, token: snap.token }, gen);
  entry.gymHost.close();
  const host = await era.createNativeLoadHost({ day: D3, engineState: basisFor(D3) }), p = await host.project();
  assert.deepEqual([p.ok, p.code], [false, 'LOCAL_HISTORY_IDENTITY_UNPROVEN'], 'the guarded host refuses the rewritten record');
  host.close(); era.close();
  // The registrar (capture path) and project()/check() fold with one admitted source basis.
  const fs = require('node:fs'), src = fs.readFileSync(require.resolve('../../../w6/local/today-bindings.mjs'), 'utf8');
  const reg = src.slice(src.indexOf('const nativeLoadRegistrar'), src.indexOf('/* THE CAUSAL FRONTIER, DERIVED'));
  assert.match(reg, /foldNativeLoad\(\{[^}]*source: nativeNullSource[^}]*\}\)/, 'the registrar fold passes the admitted source');
  const same = /const nativeNullSource = Source\.basis\(\{ W: 0, log_digest: Source\.createPrefixHasher\(\)\.digest\(\), selection_id: null \}\);/.test(src)
    && /const nullSource = Source\.basis\(\{ W: 0, log_digest: Source\.createPrefixHasher\(\)\.digest\(\), selection_id: null \}\);/.test(src);
  assert.ok(same, 'the registrar and project()/check() build the same null-lane source basis');
});
test('R16-B29 SPEND-SUFFIX [Y] (Astra L8 B29, M14; spec :154 spend once): D1, D2 tops, yes Q45, then Undo of Q45 before any further training; D3 tops at 40 -> the check is PROVISIONAL [D3 Close Ref] (the spent D1/D2 sightings are never counted again); D4 tops -> the earn offer 45 returns on the two unspent sightings', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  entry.gymHost.close();
  const host = await era.createNativeLoadHost({ day: D2, engineState: basisFor(D2) });
  const body = (await responsesOf(era))[0].payload.issuance.body;
  const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: body.evidence.at(-1).close.op_id, intent: { compensate: body.spend_id } });
  assert.equal(undo.status, 'offer', JSON.stringify(undo.refusal));
  assert.equal((await host.respond({ handle: undo.offers[0].handle, proposal_id: undo.offers[0].proposalId, answer: 'accept' })).acknowledged, true);
  host.close(); era.close();
  const again = await reopenAt(fault, D3), three = await dayEntry(again, D3);
  assert.match((await three.entry.gym.read()).prescription.line, /^40 lb/, 'the undone 45 never reaches the card');
  assert.equal((await train(three.entry)).finished.ok, true);
  await three.entry.nativeLoad.settled();
  three.entry.gymHost.close();
  const h3 = await again.createNativeLoadHost({ day: D3, engineState: basisFor(D3) }), p3 = await h3.project();
  const d3 = p3.lifts.find(l => l.lift_lineage_id === 'demo-press').completion_op_id;
  const c3 = await h3.check({ lift_lineage_id: 'demo-press', completion_op_id: d3 });
  assert.deepEqual([c3.status, c3.refusal && c3.refusal.code, c3.refusal && c3.refusal.refs.map(r => r.op_id)], ['refused', 'NATIVE_LOAD_PROVISIONAL', [d3]], 'one unspent sighting: provisional, never an earn on spent work');
  h3.close(); again.close();
  const later = await reopenAt(fault, D4), four = await dayEntry(later, D4);
  assert.equal((await train(four.entry)).finished.ok, true);
  await four.entry.nativeLoad.settled();
  four.entry.gymHost.close();
  const h4 = await later.createNativeLoadHost({ day: D4, engineState: basisFor(D4) }), p4 = await h4.project();
  const d4 = p4.lifts.find(l => l.lift_lineage_id === 'demo-press').completion_op_id;
  const c4 = await h4.check({ lift_lineage_id: 'demo-press', completion_op_id: d4 });
  assert.equal(c4.status, 'offer', JSON.stringify(c4.refusal));
  assert.deepEqual(c4.offers.filter(o => o.kind === 'earn').map(o => o.loads), [[45, 45]], 'the earn returns on D3 and D4');
  h4.close(); later.close();
});
// Round 17b (Astra L9 B31; PM ruling, spec R9.8 :156 D-L8F-1): the athlete's own Undo of an APPLIED
// lower adoption restores the weight they had accepted before it, never more.
test('R17b-B31 LOWER ADOPTION UNDONE ON THE HOST [Y] (Astra L9 host witness; spec R9.8 :156): train 35 on the 40 card and adopt 35; reopen with an unordered base 37.5 (the adoption held) and accept the displayed Undo [37.5, 37.5] (RETIRE-shaped); reopen at the original base 40 -> the adoption applies again and the Undo restores its prior image 40 (never above it), no issue, the card reads 40', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1), one = await dayEntry(era, D1);
  assert.equal((await train(one.entry, 12, '1', { loadFor: { 'demo-press': 35 } })).finished.ok, true);
  await one.entry.nativeLoad.settled(); await one.entry.nativeLoad.check();
  const adopt = one.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.equal(adopt && adopt.kind, 'adopt-observed');
  assert.equal((await one.entry.nativeLoad.accept(adopt.proposalId)).acknowledged, true);
  const body = (await responsesOf(era))[0].payload.issuance.body;
  one.entry.gymHost.close(); era.close();
  const middle = await reopenAt(fault, D2), h = await middle.createNativeLoadHost({ day: D2, engineState: withPress(D2, { w: 37.5 }) });
  const undo = await h.check({ lift_lineage_id: 'demo-press', completion_op_id: body.evidence.at(-1).close.op_id, intent: { compensate: body.spend_id } });
  assert.equal(undo.status, 'offer', JSON.stringify(undo.refusal)); assert.deepEqual(undo.offers[0].loads, [37.5, 37.5]);
  assert.equal((await h.respond({ handle: undo.offers[0].handle, proposal_id: undo.offers[0].proposalId, answer: 'accept' })).acknowledged, true);
  h.close(); middle.close();
  const again = await reopenAt(fault, D3), host = await again.createNativeLoadHost({ day: D3, engineState: basisFor(D3) }), p = await host.project();
  assert.equal((await responsesOf(again)).length, 2, 'both responses kept');
  const prior = 40;
  assert.equal(pressOf(p).w, prior, 'the prior image the athlete had accepted before adopting 35');
  assert.ok(pressOf(p).w <= prior, 'never above the prior accepted image');
  assert.deepEqual(p.issues.filter(i => i.lift === 'demo-press' && !i.superseded_by && ['NATIVE_LOAD_EFFECT_CONFLICT', 'NATIVE_LOAD_RECORD_INVALID'].includes(i.code)), []);
  host.close();
  const three = await dayEntry(again, D3), view = await three.entry.gym.read();
  assert.equal(view.phase, 'ready', view.code || ''); assert.match(view.prescription.line, /^40 lb/);
  three.entry.gymHost.close(); again.close();
});
// Round 17b (Astra L9 B33): completed Starts captured by the PUBLIC capture factory before FC16
// (only the additive reps-cell window_hi missing), saved and closed, then read by today's host.
test('R17b-B33 PRE-FC16 STARTS AFTER RESTART [Y] (Astra L9 B33; spec R9.7/R9.8 :127 window binding, legacy capture never earns): two tops captured by the capture factory with window_hi omitted, saved and closed; the reopened current host checks the lift -> refused PLAN_CHANGED, no offer, no response written (mutant R11-window-legacy-host offers [45, 45])', async () => {
  const Module = require('node:module'), nodeFs = require('node:fs'), nodePath = require('node:path');
  const capPath = require.resolve('../../../../m4/workout/engine-capture.cjs'), Capture = require(capPath), current = Capture.createEngineWorkoutCapture;
  const clause = '...(Number.isSafeInteger(original.hi)&&original.hi>0?{window_hi:original.hi}:{})';
  const src = nodeFs.readFileSync(capPath, 'utf8');
  assert.equal(src.split(clause).length, 2, 'the FC16 window_hi clause is where this row expects it');
  const old = new Module(capPath, null); old.filename = capPath; old.paths = Module._nodeModulePaths(nodePath.dirname(capPath));
  old._compile(src.replace(clause, ''), capPath);
  const fault = faultDatabase();
  try {
    Capture.createEngineWorkoutCapture = old.exports.createEngineWorkoutCapture;
    const era = await reopenAt(fault, D1), { entry } = await twoTops(era);
    assert.equal((await train(entry)).finished.ok, true); await entry.nativeLoad.settled();
    const starts = (await opsOf(era)).filter(o => o.kind === 'session-start');
    assert.equal(starts.length, 2);
    assert.ok(starts.every(st => st.prescription_capture && st.prescription_capture.slots.every(x => !(x.reps && x.reps.source_json && x.reps.source_json.includes('window_hi')))), 'pre-FC16 captures');
    entry.gymHost.close(); entry.nativeLoad.close(); era.close();
  } finally { Capture.createEngineWorkoutCapture = current; }
  const again = await reopenAt(fault, D3), h = await again.createNativeLoadHost({ day: D3, engineState: basisFor(D3) }), p = await h.project();
  assert.equal(p.ok, true, p.code);
  const lift = p.lifts.find(l => l.lift_lineage_id === 'demo-press');
  const checked = await h.check(lift);
  assert.deepEqual([checked.status, checked.refusal && checked.refusal.code, checked.offers.length], ['refused', 'NATIVE_LOAD_PLAN_CHANGED', 0]);
  assert.equal((await responsesOf(again)).length, 0);
  h.close(); again.close();
});
// Round 19 (spec R9.10 L FIT-PANEL; DECISIONS:803 (e)): the phone shows exactly the capture's load cells
// (gym-model.mjs prescriptionLine), so a fitted card shows the repeated last weight on every added set.
test('FIT-PANEL R9.10 [Y] (spec R9.10 L FIT-PANEL, T/gym-model.mjs:68-76; DECISIONS:803 (e)): demo-press with w 100 and wSets [100, 95] at sets 3 (a set-count increase over a two-entry vector) -> the day prepares and the gym prescription lines of demo-press begin 100 lb, 95 lb and 95 lb (the repeated last weight); at sets 1 the one line begins 100 lb', async () => {
  for (const [sets, want] of [[3, ['100 lb', '95 lb', '95 lb']], [1, ['100 lb']]]) {
    const fault = faultDatabase(), era = await reopenAt(fault, D1);
    const one = await dayEntryWith(era, D1, withPress(D1, { w: 100, wSets: [100, 95], sets }));
    const slots = (await slotsOf(one.entry, D1)).filter(s => s.lift_lineage_id === 'demo-press');
    assert.deepEqual(slots.map(s => prescriptionLine(s).split(' ').slice(0, 2).join(' ')), want, 'sets ' + sets);
    const view = await one.entry.gym.read();
    assert.equal(view.phase, 'ready', view.code || '');
    assert.equal(view.lift.id, 'demo-press'); assert.match(view.prescription.line, /^100 lb/);
    one.entry.gymHost.close(); era.close();
  }
});
// Round 20 part B2 (spec R9.11 M (q) N27-B39-HOST; spec R9.12 revision 3 N28-HOST-NO-NEVER-HELD, RESIDUAL (iv) :157). The
// durable host, as N27 (a) and R16-B28 use it: the admitted basis is the page's engineState (withPress moves the base), the
// check and the yes run through createNativeLoadHost, and each issued body is read back from the installation's own log.
const D5 = '2030-02-18';
const closesOf = async era => (await opsOf(era)).filter(o => o.kind === 'session-close').sort((a, b) => a.device_seq - b.device_seq).map(o => o.op_id);
const bodyOfResponse = async (era, proposalId) => (await responsesOf(era)).find(o => o.payload.proposal_id === proposalId).payload.issuance.body;
test('N27-B39-HOST R9.11 [Y] (spec R9.11 M (q), Astra\'s host reduction; red on dfc4445, 189d076 and the part-B1 product: gym.read blocked ENGINE_CAPTURE_BASELINE_UNPROVEN with Q45 pending): yes Q45 over 40; a reopen admits base 42.5 (no ordering op); D3 on the baseline ask at 60 and its exit yes [adopt-baseline 60, 60]; the exit\'s Undo accepted; a reopen at base 40 -> gym.read is ready, demo-press is the baseline ask (not_prescribed) and demo-row normal; D4 at 45 offers [adopt-baseline 45]; after its yes and a reopen the card reads 45 lb', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  entry.gymHost.close(); era.close();
  const moved = day => withPress(day, { w: 42.5 });
  const again = await reopenAt(fault, D3), three = await dayEntryWith(again, D3, moved(D3));
  assert.equal((await train(three.entry, 12, '1', { load: '60' })).finished.ok, true);
  await three.entry.nativeLoad.settled(); await three.entry.nativeLoad.check();
  const offer = three.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.ok(offer, 'the exit on D3 ' + JSON.stringify(three.entry.nativeLoad.view().refusals));
  assert.deepEqual([offer.kind, offer.loads], ['adopt-baseline', [60, 60]]);
  assert.equal((await three.entry.nativeLoad.accept(offer.proposalId)).acknowledged, true);
  three.entry.gymHost.close();
  const exit = await bodyOfResponse(again, offer.proposalId), q45 = (await responsesOf(again))[0].op_id;
  assert.deepEqual(exit.basis.load_basis.authority_refs.map(r => r.op_id), [q45], 'the exit names the Q45 yes');
  const host = await again.createNativeLoadHost({ day: D3, engineState: moved(D3) });
  const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: exit.evidence.at(-1).close.op_id, intent: { compensate: exit.spend_id } });
  assert.equal(undo.status, 'offer', JSON.stringify(undo.refusal));
  assert.equal((await host.respond({ handle: undo.offers[0].handle, proposal_id: undo.offers[0].proposalId, answer: 'accept' })).acknowledged, true);
  host.close(); again.close();
  const later = await reopenAt(fault, D4), four = await dayEntry(later, D4), view = await four.entry.gym.read();
  assert.equal((await responsesOf(later)).length, 3, 'three responses kept');
  assert.equal(view.phase, 'ready', 'gym.read ' + (view.code || '') + ' ' + JSON.stringify(view.issues || view.error || null));
  const slots = await slotsOf(four.entry, D4);
  assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), 'demo-press: the baseline ask');
  assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), 'demo-row normal');
  const h4 = await later.createNativeLoadHost({ day: D4, engineState: basisFor(D4) }), p4 = await h4.project();
  assert.deepEqual([pressOf(p4).w, nativeQueue(p4.state, 'demo-press').filter(x => !x.done), p4.issues.filter(i => i.lift === 'demo-press' && !i.superseded_by).map(i => i.code)], [null, [], []], 'w null, no pending native entry, no active issue');
  h4.close();
  assert.equal((await train(four.entry, 12, '1', { load: '45' })).finished.ok, true);
  await four.entry.nativeLoad.settled(); await four.entry.nativeLoad.check();
  const a45 = four.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.ok(a45, 'D4 ' + JSON.stringify(four.entry.nativeLoad.view().refusals));
  assert.deepEqual([a45.kind, a45.loads], ['adopt-baseline', [45, 45]]);
  assert.equal((await four.entry.nativeLoad.accept(a45.proposalId)).acknowledged, true);
  four.entry.gymHost.close(); later.close();
  const last = await reopenAt(fault, D5), five = await dayEntry(last, D5), v5 = await five.entry.gym.read();
  assert.equal(v5.phase, 'ready', v5.code || '');
  assert.equal(v5.lift.id, 'demo-press'); assert.match(v5.prescription.line, /^45 lb/, 'the card reads 45 lb');
  five.entry.gymHost.close(); last.close();
});
test('N28-HOST-NO-NEVER-HELD R9.12 [Y] (spec M R9.12 revision 3 NEW ROWS, the host side of RESIDUAL (iv) :157; green-kept, killed by mutant (xii)): through the durable host\'s check and a reopen, every issued body (read back from the log after its yes) obeys: an adopt-baseline carries authority_refs [] unless an active hold of the lift names each ref, and then exactly that hold\'s holding-record Refs; the only other non-empty fill is the MISSED-DEBUT claim, on an adopt-observed, naming exactly its latest consumed Close. (a) a never-held lift with w null and a baseline-ask completion: [] ; (b) the L12-B5 host input (D1 45 on the 40 card adopted, D2 trained on the 45 card) at an admitted base 42.5 (y1 held), the check on D2: exactly [y1]; (d) after that exit and its Undo (no return), D3 on the baseline ask: []; (c) the same input after the return (base 40; after the fix y1 and the exit apply and nothing holds), D3 lifted at 50 on its card: the offer obeys the rule (after the fix an adopt-observed 50 with []); and (D-R20L1-4) the same input after the return with the exit\'s Undo accepted (w null, no active hold), D3 on the baseline ask at 50: the offer is an adopt-baseline and it carries [], so the rule\'s adopt-baseline clause is exercised after the return; (e) N28-NEVER-HELD-NULL\'s input on the host (w null, D1 at 60 adopted, D2 lifted 65 on the 60 card): []. Host v1 slots at the host\'s own revision (typed v2 and R2 are FC12 cells: walk I17)', async () => {
  const moved = day => withPress(day, { w: 42.5 });
  const HOLDS = ['NATIVE_LOAD_EFFECT_CONFLICT', 'NATIVE_LOAD_RECORD_INVALID', 'NATIVE_LOAD_BASIS_REPAIR_REQUIRED', 'NATIVE_LOAD_SOURCE_OVERLAP'];
  const holdRefs = p => p.issues.filter(i => i.lift === 'demo-press' && !i.superseded_by && HOLDS.includes(i.code)).flatMap(i => i.refs.map(r => r.op_id)).sort();
  const rule = (body, held, label) => {
    const ar = (body.basis.load_basis.authority_refs || []).map(r => r.op_id);
    if (!ar.length) return ar;
    if (body.kind === 'adopt-baseline') assert.deepEqual(ar, held, label + ': an adopt-baseline names exactly the active hold\'s refs');
    else { assert.equal(body.kind, 'adopt-observed', label + ': only an adopt-observed carries the claim'); assert.deepEqual(ar, [body.evidence.at(-1).close.op_id], label + ': the claim names exactly its latest consumed Close'); }
    return ar;
  };
  const yesOn = async (host, era, offer, label) => {
    const held = holdRefs(await host.project());
    assert.equal((await host.respond({ handle: offer.handle, proposal_id: offer.proposalId, answer: 'accept' })).acknowledged, true, label);
    const body = await bodyOfResponse(era, offer.proposalId);
    return { body, refs: rule(body, held, label) };
  };
  const trainOn = async (era, day, basis, opts) => { const d = await dayEntryWith(era, day, basis); assert.equal((await train(d.entry, 12, '1', opts)).finished.ok, true, day); await d.entry.nativeLoad.settled(); d.entry.gymHost.close(); };
  { // (a) and (e)
    const fault = faultDatabase(), era = await reopenAt(fault, D1);
    hostGate(era);
    const b = day => withPress(day, { w: null });
    await trainOn(era, D1, b(D1), { load: '60' });
    const host = await era.createNativeLoadHost({ day: D1, engineState: b(D1) }), c1 = (await closesOf(era))[0];
    const r = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: c1 }), off = r.offers.find(o => o.kind === 'adopt-baseline');
    assert.ok(off, '(a) ' + JSON.stringify(r.refusal));
    assert.deepEqual((await yesOn(host, era, off, '(a)')).refs, [], '(a) a never-held lift: []');
    host.close();
    await trainOn(era, D2, b(D2), { loadFor: { 'demo-press': 65 } });
    const h2 = await era.createNativeLoadHost({ day: D2, engineState: b(D2) }), c2 = (await closesOf(era))[1];
    const r2 = await h2.check({ lift_lineage_id: 'demo-press', completion_op_id: c2 });
    assert.ok(r2.offers.some(o => o.kind === 'adopt-observed'), '(e) the adoption of 65 ' + JSON.stringify(r2.refusal));
    assert.deepEqual((await yesOn(h2, era, r2.offers.find(o => o.kind === 'adopt-observed'), '(e)')).refs, [], '(e) nc-y1 applied, never held: []');
    h2.close(); era.close();
  }
  for (const variant of ['held', 'return', 'return-undo']) { // (b), then (d), (c) or (c) with the Undo (D-R20L1-4)
    const fault = faultDatabase(), era = await reopenAt(fault, D1);
    hostGate(era);
    const one = await dayEntry(era, D1);
    assert.equal((await train(one.entry, 12, '1', { loadFor: { 'demo-press': 45 } })).finished.ok, true);
    await one.entry.nativeLoad.settled(); await one.entry.nativeLoad.check();
    const adopt = one.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
    assert.equal(adopt && adopt.kind, 'adopt-observed');
    assert.equal((await one.entry.nativeLoad.accept(adopt.proposalId)).acknowledged, true);
    one.entry.gymHost.close();
    const two = await dayEntry(era, D2);
    assert.match((await two.entry.gym.read()).prescription.line, /^45 lb/, 'y1 applied: the D2 card is 45');
    assert.equal((await train(two.entry)).finished.ok, true);
    await two.entry.nativeLoad.settled(); two.entry.gymHost.close(); era.close();
    const again = await reopenAt(fault, D3), host = await again.createNativeLoadHost({ day: D3, engineState: moved(D3) });
    const y1 = (await responsesOf(again))[0].op_id, c2 = (await closesOf(again))[1];
    assert.deepEqual(holdRefs(await host.project()), [y1], '(b) the admitted base 42.5 holds y1');
    const ex = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: c2 }), off = ex.offers.find(o => o.kind === 'adopt-baseline');
    assert.ok(off, '(b) the exit ' + JSON.stringify(ex.refusal));
    const y2 = await yesOn(host, again, off, '(b)');
    assert.deepEqual(y2.refs, [y1], '(b) exactly [y1 response Ref]');
    if (variant === 'held') {
      const u = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: c2, intent: { compensate: y2.body.spend_id } });
      assert.equal(u.status, 'offer', '(d) the Undo ' + JSON.stringify(u.refusal));
      assert.equal((await host.respond({ handle: u.offers[0].handle, proposal_id: u.offers[0].proposalId, answer: 'accept' })).acknowledged, true);
      host.close();
      const three = await dayEntryWith(again, D3, moved(D3)), slots = await slotsOf(three.entry, D3);
      assert.ok(slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), '(d) the baseline ask after the exit and its Undo');
      three.entry.gymHost.close();
      await trainOn(again, D3, moved(D3), { load: '50' });
      const h3 = await again.createNativeLoadHost({ day: D3, engineState: moved(D3) }), c3 = (await closesOf(again))[2];
      assert.deepEqual(holdRefs(await h3.project()), [], '(d) no active hold: y1\'s hold is superseded');
      const r3 = await h3.check({ lift_lineage_id: 'demo-press', completion_op_id: c3 }), o3 = r3.offers.find(o => o.kind === 'adopt-baseline');
      assert.ok(o3, '(d) ' + JSON.stringify(r3.refusal));
      assert.deepEqual((await yesOn(h3, again, o3, '(d)')).refs, [], '(d) a baseline ask after a superseded hold: []');
      h3.close(); again.close();
    } else if (variant === 'return-undo') {
      // D-R20L1-4 (Fable R20-l1 F6): after the return the (c) card is 45, so its later completion is an adopt-observed and the
      // adopt-baseline clause of the rule held vacuously there. Here the exit's Undo is accepted after the return (w null: the
      // held projection's image, as N28-B5-ASTRA order (B)); D3 on the baseline ask at 50 is then offered an adopt-baseline.
      host.close(); again.close();
      const back = await reopenAt(fault, D3), hb = await back.createNativeLoadHost({ day: D3, engineState: basisFor(D3) });
      const u = await hb.check({ lift_lineage_id: 'demo-press', completion_op_id: c2, intent: { compensate: y2.body.spend_id } });
      assert.equal(u.status, 'offer', '(c) the exit\'s Undo after the return ' + JSON.stringify(u.refusal));
      assert.equal((await hb.respond({ handle: u.offers[0].handle, proposal_id: u.offers[0].proposalId, answer: 'accept' })).acknowledged, true);
      const pu = await hb.project(); hb.close();
      assert.deepEqual([pressOf(pu).w, holdRefs(pu)], [null, []], '(c) after the return and the exit\'s Undo: w null, no active hold');
      const three = await dayEntryWith(back, D3, basisFor(D3)), slots = await slotsOf(three.entry, D3);
      assert.ok(slots.filter(x => x.lift_lineage_id === 'demo-press').every(x => x.load.state === 'not_prescribed'), '(c) the baseline ask after the Undo');
      three.entry.gymHost.close();
      await trainOn(back, D3, basisFor(D3), { load: '50' });
      const h3 = await back.createNativeLoadHost({ day: D3, engineState: basisFor(D3) }), c3 = (await closesOf(back))[2];
      const r3 = await h3.check({ lift_lineage_id: 'demo-press', completion_op_id: c3 }), o3 = r3.offers.find(o => o.kind === 'adopt-baseline');
      assert.ok(o3, '(c) an adopt-baseline on the baseline-ask completion ' + JSON.stringify(r3.refusal) + ' ' + JSON.stringify(r3.offers.map(o => o.kind)));
      assert.deepEqual((await yesOn(h3, back, o3, '(c) adopt-baseline after the return')).refs, [], '(c) the adopt-baseline after the return and the Undo: []');
      h3.close(); back.close();
    } else {
      host.close(); again.close();
      const back = await reopenAt(fault, D3), hb = await back.createNativeLoadHost({ day: D3, engineState: basisFor(D3) });
      hb.close();
      await trainOn(back, D3, basisFor(D3), { loadFor: { 'demo-press': 50 } });
      const h3 = await back.createNativeLoadHost({ day: D3, engineState: basisFor(D3) }), c3 = (await closesOf(back))[2];
      const r3 = await h3.check({ lift_lineage_id: 'demo-press', completion_op_id: c3 });
      const o3 = r3.offers.find(x => x.lift === 'demo-press');
      assert.ok(o3, '(c) an offer on the later completion ' + JSON.stringify(r3.refusal));
      await yesOn(h3, back, o3, '(c) ' + o3.kind);
      const p = await h3.project(); h3.close(); back.close();
      const cold = await reopenAt(fault, D3), hc = await cold.createNativeLoadHost({ day: D3, engineState: basisFor(D3) }), pc = await hc.project();
      assert.equal(JSON.stringify([pc.state, pc.issues]), JSON.stringify([p.state, p.issues]), '(c) a cold reopen projects the same');
      hc.close(); cold.close();
    }
  }
});

// ROUND 21b (spec R9.13 (v) LEGACY-OVER-NULL; PM ruling (v), DECISIONS:819). An admitted basis whose demo-press has w null and a
// pending legacy DEBUT 60 (never held): the durable host's registered projection hides the entry, so the card is the baseline ask.
test('R913-LEGACY-OVER-NULL-HOST [Y] (spec R9.13 (v); red on 40eb702: gym.read blocked ENGINE_CAPTURE_BASELINE_UNPROVEN): a never-held demo-press with w null and a pending legacy DEBUT 60 in the admitted basis -> through the durable host, and again after a cold reopen on the next U day, gym.read is ready, demo-press is the baseline ask (load not_prescribed on every slot) and demo-row is unaffected; the host projection has w null, no visible unfinished demo-press debut and no active issue', async () => {
  const legacyBasis = day => { const s = withPress(day, { w: null }); s.queue.push({ exId: 'demo-press', kind: 'debut', done: false, state: 'DEBUT', newW: 60, t: 'SYNTHETIC legacy debut' }); return s; };
  const fault = faultDatabase();
  for (const day of [D1, D3]) {
    const era = await reopenAt(fault, day);
    hostGate(era);
    const one = await dayEntryWith(era, day, legacyBasis(day)), view = await one.entry.gym.read();
    assert.equal(view.phase, 'ready', day + ' gym.read ' + (view.code || '') + ' ' + JSON.stringify(view.issues || view.error || null));
    const slots = await slotsOf(one.entry, day);
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), day + ' demo-press: the baseline ask');
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), day + ' demo-row normal');
    one.entry.gymHost.close();
    const h = await era.createNativeLoadHost({ day, engineState: legacyBasis(day) }), p = await h.project();
    assert.deepEqual([pressOf(p).w, p.state.queue.filter(q => q && q.exId === 'demo-press' && !q.done && ['debut', 'unlock'].includes(q.kind)).length, p.issues.filter(i => i.lift === 'demo-press' && !i.superseded_by).map(i => i.code)], [null, 0, []], day + ' the host projection');
    h.close(); era.close();
  }
});

// ROUND 22 (Astra L14 B1; spec R9.13 (v) LEGACY-OVER-NULL, "null or ABSENT"): mutant L14-M01 (FC03 heldProjection
// "x.w == null -> x.w === null") survived all 47 host cells, which use a PRESENT null w. The same admitted basis as
// R913-LEGACY-OVER-NULL-HOST with demo-press's w field DELETED (ABSENT), beside that present-null row.
test('L14-B1-ABSENT-W-HOST [Y] (spec R9.13 (v), "null or ABSENT"; Astra L14 B1, mutant L14-M01): a never-held demo-press with NO w field and a pending legacy DEBUT 60 in the admitted basis -> through the durable host, and again after a cold reopen on the next U day, gym.read is ready, demo-press is the baseline ask (load not_prescribed on every slot) and demo-row is unaffected; the host projection has no numeric w, no visible unfinished demo-press debut and no active issue', async () => {
  const legacyBasis = day => { const s = basisFor(day); delete s.exercises.find(e => e.id === 'demo-press').w; s.queue.push({ exId: 'demo-press', kind: 'debut', done: false, state: 'DEBUT', newW: 60, t: 'SYNTHETIC legacy debut' }); return s; };
  const fault = faultDatabase();
  for (const day of [D1, D3]) {
    assert.equal(Object.hasOwn(legacyBasis(day).exercises.find(e => e.id === 'demo-press'), 'w'), false, day + ' the basis has no w field (ABSENT, not a present null)');
    const era = await reopenAt(fault, day);
    hostGate(era);
    const one = await dayEntryWith(era, day, legacyBasis(day)), view = await one.entry.gym.read();
    assert.equal(view.phase, 'ready', day + ' gym.read ' + (view.code || '') + ' ' + JSON.stringify(view.issues || view.error || null));
    const slots = await slotsOf(one.entry, day);
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), day + ' demo-press: the baseline ask');
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), day + ' demo-row normal');
    one.entry.gymHost.close();
    const h = await era.createNativeLoadHost({ day, engineState: legacyBasis(day) }), p = await h.project();
    assert.deepEqual([pressOf(p).w == null, p.state.queue.filter(q => q && q.exId === 'demo-press' && !q.done && ['debut', 'unlock'].includes(q.kind)).length, p.issues.filter(i => i.lift === 'demo-press' && !i.superseded_by).map(i => i.code)], [true, 0, []], day + ' the host projection');
    h.close(); era.close();
  }
});

// ROUND 22c (Fable R22 l2 B-R22L2-1 and D-R22L2-2; spec R9.13 (v) LEGACY-OVER-NULL): mutant X6 (FC03 heldProjection's hide
// predicate "HIDDEN_LEGACY_KINDS.has(q.kind) -> q.kind === 'debut'") and mutant E1 ("!q.done -> q.done === false") survived all
// 48 host cells, whose every legacy entry over a null or ABSENT w is a kind 'debut' with done:false. The UNLOCK twin of
// R913-LEGACY-OVER-NULL-HOST (w null) and the no-done-key twin of L14-B1-ABSENT-W-HOST (w ABSENT); each changes one key only.
test('R22L2-UNLOCK-OVER-NULL-HOST [Y] (spec R9.13 (v) RULE "every unfinished LEGACY debut/unlock entry ... of EVERY lift whose projected w is null or ABSENT" and INVARIANT; Fable R22 l2 B-R22L2-1, mutant X6): the UNLOCK twin of R913-LEGACY-OVER-NULL-HOST: a never-held demo-press with w null and a pending legacy UNLOCK 60 in the admitted basis -> through the durable host, and again after a cold reopen on the next U day, gym.read is ready, demo-press is the baseline ask (load not_prescribed on every slot) and demo-row is unaffected; the host projection has w null, no visible unfinished demo-press debut/unlock and no active issue. Under X6 the unlock is shown and gym.read is blocked ENGINE_CAPTURE_BASELINE_UNPROVEN', async () => {
  const legacyBasis = day => { const s = withPress(day, { w: null }); s.queue.push({ exId: 'demo-press', kind: 'unlock', done: false, state: 'DEBUT', newW: 60, t: 'SYNTHETIC legacy unlock' }); return s; };
  const fault = faultDatabase();
  for (const day of [D1, D3]) {
    const era = await reopenAt(fault, day);
    hostGate(era);
    const one = await dayEntryWith(era, day, legacyBasis(day)), view = await one.entry.gym.read();
    assert.equal(view.phase, 'ready', day + ' gym.read ' + (view.code || '') + ' ' + JSON.stringify(view.issues || view.error || null));
    const slots = await slotsOf(one.entry, day);
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), day + ' demo-press: the baseline ask');
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), day + ' demo-row normal');
    one.entry.gymHost.close();
    const h = await era.createNativeLoadHost({ day, engineState: legacyBasis(day) }), p = await h.project();
    assert.deepEqual([pressOf(p).w, p.state.queue.filter(q => q && q.exId === 'demo-press' && !q.done && ['debut', 'unlock'].includes(q.kind)).length, p.issues.filter(i => i.lift === 'demo-press' && !i.superseded_by).map(i => i.code)], [null, 0, []], day + ' the host projection');
    h.close(); era.close();
  }
});
test('R22L2-ABSENT-DONE-HOST [Y] (spec R9.13 (v) RULE "hides every unfinished LEGACY debut/unlock entry (... not done ...)": an entry with NO done key is unfinished; "null or ABSENT"; Fable R22 l2 D-R22L2-2, mutant E1 "!q.done -> q.done === false"): the no-done-key twin of L14-B1-ABSENT-W-HOST: a never-held demo-press with NO w field and a pending legacy DEBUT 60 that carries NO done key in the admitted basis -> through the durable host, and again after a cold reopen on the next U day, gym.read is ready, demo-press is the baseline ask (load not_prescribed on every slot) and demo-row is unaffected; the host projection has no numeric w, no visible unfinished demo-press debut/unlock and no active issue. Under E1 the entry is shown and gym.read is blocked ENGINE_CAPTURE_BASELINE_UNPROVEN', async () => {
  const legacyBasis = day => { const s = basisFor(day); delete s.exercises.find(e => e.id === 'demo-press').w; s.queue.push({ exId: 'demo-press', kind: 'debut', state: 'DEBUT', newW: 60, t: 'SYNTHETIC legacy debut' }); return s; };
  const fault = faultDatabase();
  for (const day of [D1, D3]) {
    const b = legacyBasis(day), q = b.queue.find(x => x && x.t === 'SYNTHETIC legacy debut');
    assert.deepEqual([Object.hasOwn(b.exercises.find(e => e.id === 'demo-press'), 'w'), Object.hasOwn(q, 'done')], [false, false], day + ' the basis has no w field and the entry no done key (both ABSENT)');
    const era = await reopenAt(fault, day);
    hostGate(era);
    const one = await dayEntryWith(era, day, legacyBasis(day)), view = await one.entry.gym.read();
    assert.equal(view.phase, 'ready', day + ' gym.read ' + (view.code || '') + ' ' + JSON.stringify(view.issues || view.error || null));
    const slots = await slotsOf(one.entry, day);
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), day + ' demo-press: the baseline ask');
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), day + ' demo-row normal');
    one.entry.gymHost.close();
    const h = await era.createNativeLoadHost({ day, engineState: legacyBasis(day) }), p = await h.project();
    assert.deepEqual([pressOf(p).w == null, p.state.queue.filter(q => q && q.exId === 'demo-press' && !q.done && ['debut', 'unlock'].includes(q.kind)).length, p.issues.filter(i => i.lift === 'demo-press' && !i.superseded_by).map(i => i.code)], [true, 0, []], day + ' the host projection');
    h.close(); era.close();
  }
});

// ROUND 22d (Fable R22 l3 B-R22L3-1; spec R9.13 (v) LEGACY-OVER-NULL RULE "of EVERY lift" and INVARIANT): mutant z09 (FC03
// heldProjection hides only the FIRST hideable entry) survived all 50 host cells, each of which carries one hideable entry at a
// time. The two-lift form of R913-LEGACY-OVER-NULL-HOST: demo-press AND demo-row never held at w null, each with its own entry.
test('R22L3-EVERY-LIFT-OVER-NULL-HOST [Y] (spec R9.13 (v) RULE "hides every unfinished LEGACY debut/unlock entry ... of EVERY lift whose projected w is null or ABSENT" and INVARIANT "no registered projection carries an unfinished debut/unlock entry, native or legacy, of a lift whose w is null or ABSENT"; Fable R22 l3 B-R22L3-1, mutant z09): the two-lift form of R913-LEGACY-OVER-NULL-HOST: demo-press and demo-row both never held at w null, each with its own pending legacy DEBUT 60 in the admitted basis -> through the durable host, and again after a cold reopen on the next U day, gym.read is ready and demo-press and demo-row are both the baseline ask (load not_prescribed on every slot); the host projection has w null for both, no visible unfinished debut/unlock of either and no active issue on either. Under z09 demo-row\'s debut is shown and gym.read is blocked ENGINE_CAPTURE_BASELINE_UNPROVEN', async () => {
  const legacyBasis = day => { const s = withPress(day, { w: null }); s.exercises.find(e => e.id === 'demo-row').w = null; s.queue.push({ exId: 'demo-press', kind: 'debut', done: false, state: 'DEBUT', newW: 60, t: 'SYNTHETIC legacy debut press' }, { exId: 'demo-row', kind: 'debut', done: false, state: 'DEBUT', newW: 60, t: 'SYNTHETIC legacy debut row' }); return s; };
  const fault = faultDatabase();
  for (const day of [D1, D3]) {
    const era = await reopenAt(fault, day);
    hostGate(era);
    const one = await dayEntryWith(era, day, legacyBasis(day)), view = await one.entry.gym.read();
    assert.equal(view.phase, 'ready', day + ' gym.read ' + (view.code || '') + ' ' + JSON.stringify(view.issues || view.error || null));
    const slots = await slotsOf(one.entry, day);
    for (const lift of ['demo-press', 'demo-row']) assert.ok(slots.some(s => s.lift_lineage_id === lift) && slots.filter(s => s.lift_lineage_id === lift).every(s => s.load.state === 'not_prescribed'), day + ' ' + lift + ': the baseline ask');
    one.entry.gymHost.close();
    const h = await era.createNativeLoadHost({ day, engineState: legacyBasis(day) }), p = await h.project();
    const liftOf = id => p.state.exercises.find(e => e.id === id), shown = id => p.state.queue.filter(q => q && q.exId === id && !q.done && ['debut', 'unlock'].includes(q.kind)).length, active = id => p.issues.filter(i => i.lift === id && !i.superseded_by).map(i => i.code);
    assert.deepEqual([liftOf('demo-press').w, liftOf('demo-row').w, shown('demo-press'), shown('demo-row'), active('demo-press'), active('demo-row')], [null, null, 0, 0, [], []], day + ' the host projection');
    h.close(); era.close();
  }
});

// ROUND 22e (Fable R22 l4 D-R22L4-3; spec R9.13 (v) LEGACY-OVER-NULL): the FC03 mutants z04 (a falsy w hides like a null w),
// z06 (the hide set widened to FC01's STRUCTURAL), w04 (only a lift's FIRST unfinished entry hidden) and w05 (hidden only when the
// lift has ONE unfinished entry) survived all 51 host cells, whose every legacy entry sits alone on a null or ABSENT w lift and is
// a debut or an unlock. Three cells beside R913-LEGACY-OVER-NULL-HOST: a w 0 lift, an other-kind entry, two entries on one lift.
test('R22L4-ZERO-W-HOST [Y] (spec R9.13 (v) RULE "of EVERY lift whose projected w is null or ABSENT": w 0 is neither; R913-LEGACY-OVER-NULL-CONTROL "the same entry on a lift with numeric w ... stays visible, and the card prescribes ... as today (E/today.cjs:98)"; Fable R22 l4 D-R22L4-3, mutant z04 "x && x.w == null -> x && !x.w"): the host form of FC12 R22L3-ZERO-W-VISIBLE: demo-press at w 0 with a pending legacy DEBUT newW 5 in the admitted basis -> through the durable host, and again after a cold reopen on the next U day, gym.read is ready, demo-press is prescribed 5 lb on every slot and demo-row is unaffected; the host projection keeps w 0 and the entry visible ([debut, DEBUT, 5]) with no active issue. Under z04 the entry is hidden and the card falls back to the w 0 scalar', async () => {
  const legacyBasis = day => { const s = withPress(day, { w: 0 }); s.queue.push({ exId: 'demo-press', kind: 'debut', done: false, state: 'DEBUT', newW: 5, t: 'SYNTHETIC legacy debut' }); return s; };
  const fault = faultDatabase();
  for (const day of [D1, D3]) {
    const era = await reopenAt(fault, day);
    hostGate(era);
    const one = await dayEntryWith(era, day, legacyBasis(day)), view = await one.entry.gym.read();
    assert.equal(view.phase, 'ready', day + ' gym.read ' + (view.code || '') + ' ' + JSON.stringify(view.issues || view.error || null));
    const slots = await slotsOf(one.entry, day), press = slots.filter(s => s.lift_lineage_id === 'demo-press');
    assert.ok(press.length > 0 && press.every(s => s.load.state === 'specified' && /^5 lb/.test(s.load.display)), day + ' demo-press: the card prescribes the entry\'s 5 on every slot ' + JSON.stringify(press.map(s => s.load.display)));
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), day + ' demo-row normal');
    one.entry.gymHost.close();
    const h = await era.createNativeLoadHost({ day, engineState: legacyBasis(day) }), p = await h.project();
    assert.deepEqual([pressOf(p).w, p.state.queue.filter(q => q && q.exId === 'demo-press' && !q.done).map(q => [q.kind, q.state, q.newW]), p.issues.filter(i => i.lift === 'demo-press' && !i.superseded_by).map(i => i.code)], [0, [['debut', 'DEBUT', 5]], []], day + ' the host projection');
    h.close(); era.close();
  }
});
test('R22L4-OTHER-KINDS-HOST [Y] (spec R9.13 (v) RULE "kind in HIDDEN_LEGACY_KINDS, :250" (debut and unlock only) and "Only the registered projection changes"; Fable R22 l4 D-R22L4-3, mutant z06 "new Set([\'debut\', \'unlock\']) -> new Set([\'debut\', \'unlock\', \'own\', \'reclaim\', \'ladder\'])"): the host form of FC12 R22L3-OTHER-KINDS-KEPT: a never-held demo-press with w null, a pending legacy entry of kind own (and, the same, reclaim and ladder; state DEBUT, newW 60) and a pending legacy DEBUT 60 in the admitted basis -> through the durable host, and again after a cold reopen on the next U day, gym.read is ready, demo-press is the baseline ask (load not_prescribed on every slot) and demo-row is unaffected; the host projection has w null, hides the debut only and keeps the own/reclaim/ladder entry, with no active issue. Under z06 that entry is hidden too', async () => {
  for (const kind of ['own', 'reclaim', 'ladder']) {
    const legacyBasis = day => { const s = withPress(day, { w: null }); s.queue.push({ exId: 'demo-press', kind, done: false, state: 'DEBUT', newW: 60, t: 'SYNTHETIC legacy ' + kind }, { exId: 'demo-press', kind: 'debut', done: false, state: 'DEBUT', newW: 60, t: 'SYNTHETIC legacy debut' }); return s; };
    const fault = faultDatabase();
    for (const day of [D1, D3]) {
      const era = await reopenAt(fault, day);
      hostGate(era);
      const one = await dayEntryWith(era, day, legacyBasis(day)), view = await one.entry.gym.read();
      assert.equal(view.phase, 'ready', kind + ' ' + day + ' gym.read ' + (view.code || '') + ' ' + JSON.stringify(view.issues || view.error || null));
      const slots = await slotsOf(one.entry, day);
      assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), kind + ' ' + day + ' demo-press: the baseline ask');
      assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), kind + ' ' + day + ' demo-row normal');
      one.entry.gymHost.close();
      const h = await era.createNativeLoadHost({ day, engineState: legacyBasis(day) }), p = await h.project();
      assert.deepEqual([pressOf(p).w, p.state.queue.filter(q => q && q.exId === 'demo-press' && !q.done).map(q => [q.kind, q.state, q.newW]), p.issues.filter(i => i.lift === 'demo-press' && !i.superseded_by).map(i => i.code)], [null, [[kind, 'DEBUT', 60]], []], kind + ' ' + day + ' the host projection');
      h.close(); era.close();
    }
  }
});
test('R22L4-EVERY-ENTRY-HOST [Y] (spec R9.13 (v) RULE "hides every unfinished LEGACY debut/unlock entry ... of EVERY lift whose projected w is null or ABSENT" and INVARIANT "no registered projection carries an unfinished debut/unlock entry, native or legacy, of a lift whose w is null or ABSENT"; Fable R22 l4 D-R22L4-3, mutants w04 (only the lift\'s FIRST unfinished entry hidden) and w05 (hidden only when the lift has ONE unfinished entry)): the host form of FC12 R22L3-EVERY-ENTRY-OVER-NULL: a never-held demo-press with w null carrying a pending legacy DEBUT 60 AND a pending legacy UNLOCK 65 in the admitted basis -> through the durable host, and again after a cold reopen on the next U day, gym.read is ready, demo-press is the baseline ask (load not_prescribed on every slot) and demo-row is unaffected; the host projection has w null, no visible unfinished demo-press debut/unlock and no active issue. Under w04 the unlock is shown, under w05 both are, and gym.read is blocked ENGINE_CAPTURE_BASELINE_UNPROVEN', async () => {
  const legacyBasis = day => { const s = withPress(day, { w: null }); s.queue.push({ exId: 'demo-press', kind: 'debut', done: false, state: 'DEBUT', newW: 60, t: 'SYNTHETIC legacy debut' }, { exId: 'demo-press', kind: 'unlock', done: false, state: 'DEBUT', newW: 65, t: 'SYNTHETIC legacy unlock' }); return s; };
  const fault = faultDatabase();
  for (const day of [D1, D3]) {
    const era = await reopenAt(fault, day);
    hostGate(era);
    const one = await dayEntryWith(era, day, legacyBasis(day)), view = await one.entry.gym.read();
    assert.equal(view.phase, 'ready', day + ' gym.read ' + (view.code || '') + ' ' + JSON.stringify(view.issues || view.error || null));
    const slots = await slotsOf(one.entry, day);
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), day + ' demo-press: the baseline ask');
    assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), day + ' demo-row normal');
    one.entry.gymHost.close();
    const h = await era.createNativeLoadHost({ day, engineState: legacyBasis(day) }), p = await h.project();
    assert.deepEqual([pressOf(p).w, p.state.queue.filter(q => q && q.exId === 'demo-press' && !q.done && ['debut', 'unlock'].includes(q.kind)).length, p.issues.filter(i => i.lift === 'demo-press' && !i.superseded_by).map(i => i.code)], [null, 0, []], day + ' the host projection');
    h.close(); era.close();
  }
});

// ROUND 23 (Astra L15 B5 and B6; spec R9.13 (v) LEGACY-OVER-NULL): the FC03 mutants N13 (a legacy entry must carry NO
// native_load_spend key) and N14 (an entry is hidden unless its done is exactly true) survived all 51 host cells Astra ran (and all
// 54 of round 22e), whose every legacy entry carries no marker and a boolean done. Two cells beside R913-LEGACY-OVER-NULL-HOST: a
// present non-string marker, and a finished entry whose done is a truthy non-boolean.
test('L15-B5-NONSTRING-MARKER-HOST [Y] (spec R9.13 (v) RULE "hides every unfinished LEGACY debut/unlock entry (typeof native_load_spend !== \'string\', not done, kind in HIDDEN_LEGACY_KINDS) of EVERY lift whose projected w is null or ABSENT": a present non-string marker is legacy; Astra L15 B5, mutant N13 "typeof q.native_load_spend !== \'string\' -> q.native_load_spend === undefined"): the host form of FC12 L15-B5-NONSTRING-MARKER-HIDDEN: a never-held demo-press with w null and a pending legacy DEBUT 60 whose native_load_spend is PRESENT and null (and, the same, 0 and false) in the admitted basis -> through the durable host, and again after a cold reopen on the next U day, gym.read is ready, demo-press is the baseline ask (load not_prescribed on every slot) and demo-row is unaffected; the host projection has w null, no visible unfinished demo-press debut/unlock and no active issue. Under N13 the entry is shown and gym.read is blocked ENGINE_CAPTURE_BASELINE_UNPROVEN', async () => {
  for (const marker of [null, 0, false]) {
    const M = 'native_load_spend ' + JSON.stringify(marker) + ' ';
    const legacyBasis = day => { const s = withPress(day, { w: null }); s.queue.push({ exId: 'demo-press', kind: 'debut', done: false, state: 'DEBUT', newW: 60, native_load_spend: marker, t: 'SYNTHETIC legacy debut' }); return s; };
    const fault = faultDatabase();
    for (const day of [D1, D3]) {
      const era = await reopenAt(fault, day);
      hostGate(era);
      const one = await dayEntryWith(era, day, legacyBasis(day)), view = await one.entry.gym.read();
      assert.equal(view.phase, 'ready', M + day + ' gym.read ' + (view.code || '') + ' ' + JSON.stringify(view.issues || view.error || null));
      const slots = await slotsOf(one.entry, day);
      assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), M + day + ' demo-press: the baseline ask');
      assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), M + day + ' demo-row normal');
      one.entry.gymHost.close();
      const h = await era.createNativeLoadHost({ day, engineState: legacyBasis(day) }), p = await h.project();
      assert.deepEqual([pressOf(p).w, p.state.queue.filter(q => q && q.exId === 'demo-press' && !q.done && ['debut', 'unlock'].includes(q.kind)).length, p.issues.filter(i => i.lift === 'demo-press' && !i.superseded_by).map(i => i.code)], [null, 0, []], M + day + ' the host projection');
      h.close(); era.close();
    }
  }
});
test('L15-B6-FINISHED-ENTRY-HOST [Y] (spec R9.13 (v) RULE "hides every unfinished LEGACY debut/unlock entry (... not done ...)": a finished entry is not hidden; "Only the registered projection changes"; (iv) DEFINITIONS "q.done falsy": a truthy done is done; Astra L15 B6, mutant N14 "!q.done -> q.done !== true"): the host form of FC12 L15-B6-FINISHED-ENTRY-SHOWN: a never-held demo-press with w null and a FINISHED legacy DEBUT 60, state ESTABLISH, done 1 (and, the same, the string \'yes\') in the admitted basis -> through the durable host, and again after a cold reopen on the next U day, gym.read is ready, demo-press is the baseline ask (no unfinished entry) and demo-row is unaffected; the host projection has w null, KEEPS the finished entry ([debut, 1, ESTABLISH, 60]) and has no active issue. Under N14 the finished entry is missing from the host projection', async () => {
  for (const done of [1, 'yes']) {
    const M = 'done ' + JSON.stringify(done) + ' ';
    const legacyBasis = day => { const s = withPress(day, { w: null }); s.queue.push({ exId: 'demo-press', kind: 'debut', done, state: 'ESTABLISH', newW: 60, t: 'SYNTHETIC finished legacy' }); return s; };
    const fault = faultDatabase();
    for (const day of [D1, D3]) {
      const era = await reopenAt(fault, day);
      hostGate(era);
      const one = await dayEntryWith(era, day, legacyBasis(day)), view = await one.entry.gym.read();
      assert.equal(view.phase, 'ready', M + day + ' gym.read ' + (view.code || '') + ' ' + JSON.stringify(view.issues || view.error || null));
      const slots = await slotsOf(one.entry, day);
      assert.ok(slots.some(s => s.lift_lineage_id === 'demo-press') && slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), M + day + ' demo-press: the baseline ask');
      assert.ok(slots.some(s => s.lift_lineage_id === 'demo-row') && slots.filter(s => s.lift_lineage_id === 'demo-row').every(s => /^40 lb/.test(s.load.display)), M + day + ' demo-row normal');
      one.entry.gymHost.close();
      const h = await era.createNativeLoadHost({ day, engineState: legacyBasis(day) }), p = await h.project();
      assert.deepEqual([pressOf(p).w, p.state.queue.filter(q => q && q.t === 'SYNTHETIC finished legacy').map(q => [q.kind, q.done, q.state, q.newW]), p.issues.filter(i => i.lift === 'demo-press' && !i.superseded_by).map(i => i.code)], [null, [['debut', done, 'ESTABLISH', 60]], []], M + day + ' the host projection keeps the finished entry');
      h.close(); era.close();
    }
  }
});

// ROUND 24 (Astra L16 B6; FC08 L/today-bindings.mjs:623-626 and spec :164-165): the host's default projection reads the CURRENT
// basis. Every earlier cell opened its host on one immutable basis, so a project() that kept the basis captured when the host opened
// (Astra's mutant: `first` for baseNow() at :674) agreed with every cell. FA02 passes a function and calls project() with no base.
test('L16-B6-HOST-CURRENT-BASIS [Y] (FC08 L/today-bindings.mjs:623-626 "engineState is the page\'s immutable basis, or a function returning the CURRENT one ...: check, project and the pre-commit re-evaluation all read it anew"; spec :164 "No new persisted topRun, effect receipt collection or plan cache is authoritative" and :165; Astra L16 B6, mutant "project(base === undefined ? baseNow() : base) -> project(base === undefined ? first : base)" at :674, which survived 267/267 and 56/56): the durable host opened with engineState a function returning the page\'s current immutable basis (demo-press w 40) -> project() gives w 40; the page then replaces that basis with a new immutable one (w 55) and project() with no base gives w 55 and the same registered state as a host opened on the w-55 basis; after a cold reopen on the next U day, a host opened while the basis was w 40 and projected after the page moved it to w 55 gives w 55. Under the mutant the later projections still give 40', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  let current = withPress(D1, { w: 40 });
  const host = await era.createNativeLoadHost({ day: D1, engineState: () => current });
  const p1 = await host.project();
  assert.deepEqual([p1.ok, pressOf(p1).w], [true, 40], 'D1 the first projection reads the basis current at that call');
  current = withPress(D1, { w: 55 });
  const p2 = await host.project();
  assert.deepEqual([p2.ok, pressOf(p2).w], [true, 55], 'D1 project() after the page adopted a new basis reads the CURRENT basis');
  const fresh = await era.createNativeLoadHost({ day: D1, engineState: withPress(D1, { w: 55 }) }), pf = await fresh.project();
  assert.deepEqual(p2.state, pf.state, 'D1 the same registered state as a host opened on the current basis');
  fresh.close(); host.close(); era.close();
  const again = await reopenAt(fault, D3);
  let cold = withPress(D3, { w: 40 });
  const h3 = await again.createNativeLoadHost({ day: D3, engineState: () => cold });
  cold = withPress(D3, { w: 55 });
  const p3 = await h3.project();
  assert.deepEqual([p3.ok, pressOf(p3).w], [true, 55], 'D3 after a cold reopen the host reads the current basis');
  h3.close(); again.close();
});

// ROUND 24 SWEEP CELLS (report, Round 24, section 2): the host projection and check (L/today-bindings.mjs :640-:690). Each cell cites
// its clause and asserts the specified outcome through the real durable host; every value is invented.
test('R24S-HOST-SPENT-AND-RETRY [Y] (spec :97 "project() -> authenticated Fold" with :96 Fold {status,state,effects,spent,issues,coverage}; :172 "If the acknowledgement is lost, read the authenticated operation log for that exact issuance/spend; report already-saved only if found and folded. Do not mint another response"; :298 N06 "retry of the same issuance reports already-saved and still 1 response"; round-24 sweep, mutants S24-H17 "status: null", S24-H22 "spent first-only", S24-H06 "only rejected responses count", S24-H10 "spent.every" and S24-H11 "spend_id !==" at L/today-bindings.mjs:666-681): D1 and D2 sessions, then the durable host on D2: yes to demo-press through host.respond -> acknowledged; the SAME handle answered again -> acknowledged, alreadySaved, the first op_id, still exactly 1 response; then yes to demo-row -> acknowledged, and its retry -> alreadySaved, still 2 responses; project() -> status ready and spent lists BOTH accepted spends, neither cancelled. Under the mutants the status is null, a spend is missing, or a retry is refused as stale', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const { entry } = await twoTops(era);
  assert.equal((await train(entry)).finished.ok, true);
  entry.gymHost.close();
  const host = await era.createNativeLoadHost({ day: D2, engineState: basisFor(D2) }), p0 = await host.project();
  const yes = async lift => {
    const done = p0.lifts.find(l => l.lift_lineage_id === lift);
    const c = await host.check({ lift_lineage_id: lift, completion_op_id: done.completion_op_id });
    assert.equal(c.status, 'offer', lift + ' ' + JSON.stringify(c.refusal));
    const o = c.offers.find(x => x.lift === lift), r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
    assert.equal(r.acknowledged, true, lift + ' ' + JSON.stringify(r));
    return { o, r };
  };
  const press = await yes('demo-press');
  const again = await host.respond({ handle: press.o.handle, proposal_id: press.o.proposalId, answer: 'accept' });
  assert.deepEqual([again.acknowledged, again.alreadySaved, again.op_id, (await responsesOf(era)).length], [true, true, press.r.op_id, 1], 'the retry of the same issuance reports already-saved and mints no response');
  const row = await yes('demo-row');
  const again2 = await host.respond({ handle: row.o.handle, proposal_id: row.o.proposalId, answer: 'accept' });
  assert.deepEqual([again2.acknowledged, again2.alreadySaved, again2.op_id, (await responsesOf(era)).length], [true, true, row.r.op_id, 2], 'with two spends folded the retry still reports already-saved');
  const p = await host.project(), ids = (await responsesOf(era)).map(op => op.payload.issuance.body.spend_id).sort();
  assert.deepEqual([p.ok, p.status, p.spent.map(x => x.spend_id).sort(), p.spent.map(x => x.cancelled)], [true, 'ready', ids, [false, false]], 'the host projection: status ready and every accepted spend, none cancelled');
  host.close(); era.close();
});
test('R24S-HOST-IMPORTED-SOURCE-REFUSAL [Y] (spec R9.1 :157 ADMISSION GATE (1): "an imported generation refuses SOURCE_FRONTIER_UNPROVEN before folding (the local host refuses a nonempty imported-source collection ...)"; :97 check -> "refusal"; round-24 sweep, mutant S24-H25 "check()\'s refusal code null" at L/today-bindings.mjs:686): the durable installation\'s generation carries a nonempty sourceImports collection (committed through the repository as D-FRESH-2 commits a rewritten record) -> project() refuses with ok false and code NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN, and check() is refused with that same code and no offer. Under the mutant the check\'s refusal code is null', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const one = await dayEntry(era, D1);
  assert.equal((await train(one.entry)).finished.ok, true);
  const repo = one.entry.gymHost.repository, snap = await repo.load(), gen = structuredClone(snap.generation);
  gen.collections.sourceImports = { 'fx-import-1': { profile: 'earned/source-import/v1' } };
  await repo.commit({ revision: snap.revision, token: snap.token }, gen);
  one.entry.gymHost.close();
  const host = await era.createNativeLoadHost({ day: D1, engineState: basisFor(D1) });
  const p = await host.project();
  assert.deepEqual([p.ok, p.code], [false, 'NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN'], 'project() refuses the imported generation');
  const c = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: 'fx-any-close' });
  assert.deepEqual([c.status, c.offers, c.refusal && c.refusal.code], ['refused', [], 'NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN'], 'check() is refused with the same code');
  host.close(); era.close();
});
test('R24S-HOST-CHECK-CURRENT-BASIS [Y] (FC08 L/today-bindings.mjs:623-626 "engineState is the page\'s immutable basis, or a function returning the CURRENT one ...: check, project and the pre-commit re-evaluation all read it anew"; spec :127 step 2 "Resolve the current authorised plan ... If deliberate load ... changed since that completion, refuse the applicable code"; round-24 sweep, mutant S24-H29 "check() folds the basis captured at open (first)" at L/today-bindings.mjs:685, the check() form of Astra L16 B6): one D1 session trained on the cards; the durable host opened with engineState a function returning the page\'s current immutable basis (demo-press w 40) -> the check on demo-press\'s completion is not PLAN_CHANGED; the page then adopts a new immutable basis with demo-press w 55 -> the same check refuses NATIVE_LOAD_PLAN_CHANGED and equals the check of a host opened on the w-55 basis. Under the mutant the second check still answers from the w-40 basis', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const one = await dayEntry(era, D1);
  assert.equal((await train(one.entry)).finished.ok, true);
  one.entry.gymHost.close();
  let current = withPress(D1, { w: 40 });
  const host = await era.createNativeLoadHost({ day: D1, engineState: () => current }), p = await host.project();
  const req = { lift_lineage_id: 'demo-press', completion_op_id: p.lifts.find(l => l.lift_lineage_id === 'demo-press').completion_op_id };
  const brief = c => [c.status, c.refusal && c.refusal.code, c.refusal && (c.refusal.refs || []).map(r => r.op_id), c.offers.map(o => [o.kind, o.loads])];
  const c1 = brief(await host.check(req));
  current = withPress(D1, { w: 55 });
  const c2 = brief(await host.check(req));
  const fresh = await era.createNativeLoadHost({ day: D1, engineState: withPress(D1, { w: 55 }) }), cf = brief(await fresh.check(req));
  assert.notEqual(c1[1], 'NATIVE_LOAD_PLAN_CHANGED', 'control: on the basis current at the completion the plan has not moved ' + JSON.stringify(c1));
  assert.deepEqual(c2, cf, 'the check reads the CURRENT basis: the same answer as a host opened on it');
  assert.equal(c2[1], 'NATIVE_LOAD_PLAN_CHANGED', 'the plan moved since that completion (step 2) ' + JSON.stringify(c2));
  fresh.close(); host.close(); era.close();
});

// ROUND 25 (test bytes only; PM ruling DECISIONS:847 on Claude R24 l1 B-R24-O-4 and Astra L17 B4-B6): three host cells through the
// real durable host (L/today-bindings.mjs, product unchanged 91aa980f). Each cites its clause and asserts the specified outcome with
// the reviewer's own input; every value is invented.
// L17-B4 / B-R24-O-4: R24S-HOST-SPENT-AND-RETRY never undoes a spend, so a project() that reports every spend cancelled false
// (Claude's C07 = Astra's L17-M11) agreed with every cell.
test('R25-HOST-CANCELLED-SPEND [Y] (spec :97 "project() -> authenticated Fold", :96 Fold carries spent, :123 "context.spent is the derived array of {spend_id,consumes,response_refs,close_ref,cancelled_by}, with nullable ... cancelled_by", :154 "On its own yes, restore that image ..., retire only the targeted native queue entry and keep its spend tombstone", :158 NO TRAP "every accepted spend ... and whether it is cancelled"; Claude R24 l1 B-R24-O-4, mutant C07, = Astra L17 B4, mutant L17-M11 "cancelled: !!x.cancelled_by -> cancelled: false" at L/today-bindings.mjs:681, which survived 286/286 and 60/60): D1 and D2 sessions, then the durable host on D2: yes to demo-press (acknowledged), then its offered Undo (check intent {compensate: that spend}) accepted -> project() is ok, its spent still names the yes\'s spend (the tombstone is kept) with cancelled true, and every other listed spend (the Undo\'s own) cancelled false. Under the mutant the undone spend is reported live (cancelled false)', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const { entry } = await twoTops(era);
  assert.equal((await train(entry)).finished.ok, true);
  entry.gymHost.close();
  const host = await era.createNativeLoadHost({ day: D2, engineState: basisFor(D2) }), p0 = await host.project();
  const req = { lift_lineage_id: 'demo-press', completion_op_id: p0.lifts.find(l => l.lift_lineage_id === 'demo-press').completion_op_id };
  const c = await host.check(req);
  assert.equal(c.status, 'offer', JSON.stringify(c.refusal));
  const o = c.offers.find(x => x.lift === 'demo-press'), r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
  assert.equal(r.acknowledged, true, JSON.stringify(r));
  const spend = (await responsesOf(era)).find(op => op.op_id === r.op_id).payload.issuance.body.spend_id;
  const before = await host.project();
  assert.deepEqual(before.spent.filter(x => x.spend_id === spend).map(x => x.cancelled), [false], 'control: before the Undo the yes\'s spend is live');
  const u = await host.check({ ...req, intent: { compensate: spend } });
  assert.equal(u.status, 'offer', 'the Undo is offered: ' + JSON.stringify(u.refusal));
  const undo = await host.respond({ handle: u.offers[0].handle, proposal_id: u.offers[0].proposalId, answer: 'accept' });
  assert.equal(undo.acknowledged, true, JSON.stringify(undo));
  const p = await host.project();
  assert.equal(p.ok, true);
  assert.deepEqual(p.spent.filter(x => x.spend_id === spend).map(x => x.cancelled), [true], 'the undone spend is kept (its tombstone) and reported cancelled ' + JSON.stringify(p.spent));
  assert.deepEqual(p.spent.filter(x => x.spend_id !== spend).map(x => x.cancelled).filter(x => x !== false), [], 'no other spend is cancelled ' + JSON.stringify(p.spent));
  host.close(); era.close();
});
// L17-B5: every earlier closed-handle cell closed the host only, with the installation open, where savedResponse can still read; a
// held-handle lookup that ignores `alive` (Astra's L17-M12) then reaches the same refusal. With the installation closed too, the
// lookup must refuse before any read.
test('R25-HOST-CLOSED-HANDLE [Y] (spec :97 "close() invalidates held handles"; :169 "Refuse detached host, wrong athlete/source, cloned handle or wrong proposal ID before staging"; :170 "Without that capability, \'respond\' refuses NATIVE_LOAD_CAPABILITY_REQUIRED"; :188 "Unowned handle ... CAPABILITY_REQUIRED"; Astra L17 B5, mutant L17-M12 "alive && dropped from the held-handle lookup" at L/today-bindings.mjs:708, which survived 286/286 and 60/60): D1 and D2 sessions, the durable host on D2 offers demo-press a yes (a genuine held handle); then host.close() AND the installation closed -> respond({accept}) with that handle resolves (no exception) to acknowledged false, code NATIVE_LOAD_CAPABILITY_REQUIRED; after a reopen no response was written. The weaker input (only the host closed) gives the same refusal. Under the mutant the closed installation is read and respond throws', async () => {
  for (const both of [false, true]) {
    const M = both ? 'host and installation closed: ' : 'host closed: ';
    const fault = faultDatabase(), era = await reopenAt(fault, D1);
    hostGate(era);
    const { entry } = await twoTops(era);
    assert.equal((await train(entry)).finished.ok, true);
    entry.gymHost.close();
    const host = await era.createNativeLoadHost({ day: D2, engineState: basisFor(D2) }), p = await host.project();
    const c = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: p.lifts.find(l => l.lift_lineage_id === 'demo-press').completion_op_id });
    assert.equal(c.status, 'offer', M + JSON.stringify(c.refusal));
    const o = c.offers.find(x => x.lift === 'demo-press');
    host.close(); if (both) era.close();
    let got;
    try { got = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' }); }
    catch (error) { got = { threw: String(error && (error.code || error.message) || error) }; }
    assert.deepEqual([got.threw, got.acknowledged, got.code], [undefined, false, 'NATIVE_LOAD_CAPABILITY_REQUIRED'], M + 'a closed host refuses the held handle before any read ' + JSON.stringify(got));
    if (!both) era.close();
    const again = await reopenAt(fault, D2);
    assert.equal((await responsesOf(again)).length, 0, M + 'nothing written');
    again.close();
  }
});
// L17-B6 (S24-H08, moved from SPEC-SILENT to a blocker by the PM, DECISIONS:847): the host's early already-saved lookup must match
// the ENTIRE held issuance, not its shortened digest. R6-B17 pins the full comparison at re-evaluation; no cell reached
// savedResponse's early return with a digest-equal but different issuance, so dropping its issuance equality (the round-24 sweep's
// H08) agreed with every cell. TEST SEAM (no product hook), as R6-B17: the shared FC03 module object today-bindings imports; only
// the SECOND check's proposal_id is made to collide with the first; bodies, spends and durable commits are the product's own.
test('R25-HOST-SAVED-NEEDS-EXACT-ISSUANCE [Y] (spec :149 "At accept, the host re-evaluates ..., checks the ENTIRE issued body/reason/producer and semantic source basis ... Stale means STALE_OFFER; even a newly valid larger/smaller number requires another displayed offer and yes"; :172 "read the authenticated operation log for that exact issuance/spend; report already-saved only if found and folded. Do not mint another response"; :60; Astra L17 B6, mutant S24-H08 "savedResponse matches proposal_id only (the issuance equality dropped)" at L/today-bindings.mjs:667, which survived 286/286 and 60/60): D1 and D2 sessions; the durable host on D2 with engineState a function returning the current basis; a check at inc 5 offers demo-press 45; the page moves demo-press to inc 10 and a second check offers 50 (a different offer for the same completion, the same spend), its proposal_id forced equal to the first (test seam); back at inc 5 the 45 yes is accepted; at inc 10 the held 50 offer is answered yes -> refused NATIVE_LOAD_STALE_OFFER, not acknowledged, not already-saved; still exactly 1 response (the 45 issuance) and the pending demo-press target is 45. Under the mutant the 50 yes is reported acknowledged and alreadySaved', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const { entry } = await twoTops(era);
  assert.equal((await train(entry)).finished.ok, true);
  entry.gymHost.close();
  let current = withPress(D2, { inc: 5 });
  const host = await era.createNativeLoadHost({ day: D2, engineState: () => current }), p = await host.project();
  const req = { lift_lineage_id: 'demo-press', completion_op_id: p.lifts.find(l => l.lift_lineage_id === 'demo-press').completion_op_id };
  const a = await host.check(req);
  assert.equal(a.status, 'offer', JSON.stringify(a.refusal));
  const oa = a.offers.find(x => x.lift === 'demo-press');
  current = withPress(D2, { inc: 10 });
  const NLE = require('../../../../m4/workout/native-load-effects.cjs'), realIssuance = NLE.issuanceFor;
  let secondSpend;
  NLE.issuanceFor = (offer, args) => { const got = realIssuance(offer, args); secondSpend = got.issuance.body.spend_id; return { ...got, proposal_id: oa.proposalId }; };
  let b;
  try { b = await host.check(req); } finally { NLE.issuanceFor = realIssuance; }
  assert.equal(b.status, 'offer', JSON.stringify(b.refusal));
  const ob = b.offers.find(x => x.lift === 'demo-press');
  assert.equal(ob.proposalId, oa.proposalId, 'test seam: the two held offers share one proposal_id');
  assert.notDeepEqual(ob.loads, oa.loads, 'two genuine different offers before either yes ' + JSON.stringify([oa.loads, ob.loads]));
  current = withPress(D2, { inc: 5 });
  const first = await host.respond({ handle: oa.handle, proposal_id: oa.proposalId, answer: 'accept' });
  assert.equal(first.acknowledged, true, JSON.stringify(first));
  const stored = (await responsesOf(era)).find(op => op.op_id === first.op_id);
  assert.equal(stored.payload.issuance.body.spend_id, secondSpend, 'the same spend under two different issuances');
  current = withPress(D2, { inc: 10 });
  const second = await host.respond({ handle: ob.handle, proposal_id: ob.proposalId, answer: 'accept' }), after = await host.project();
  assert.deepEqual([second.acknowledged, !!second.alreadySaved, second.code], [false, false, 'NATIVE_LOAD_STALE_OFFER'], 'the held 50 is not the saved 45: STALE_OFFER, never already-saved ' + JSON.stringify(second));
  assert.deepEqual([(await responsesOf(era)).length, after.state.queue.filter(x => x && x.exId === 'demo-press' && !x.done).map(x => x.newW)], [1, [45]], 'nothing minted: one response, the pending target 45');
  host.close(); era.close();
});
// ROUND 26 (test bytes only; PM ruling DECISIONS:848 on Claude R25 l1 B-R25C-1/-2 and Astra L18 B3, B4, B5, B7, B8, B9, B10): host
// cells through the real durable host (L/today-bindings.mjs, product unchanged 91aa980f). Each cites its clause and asserts the
// specified outcome with the reviewers' own inputs; every value is invented.
// B-R25C-1 = L18-B8: no cell answered respond() with anything but 'accept', 'decline' or 'cancel', so dropping the accept-only guard
// (Claude's H03) or letting an absent answer through (Astra's L18-M16) agreed with every cell.
const r26Offer = async (fault, kind) => {
  const era = await reopenAt(fault, D1);
  hostGate(era);
  let day = D2;
  if (kind === 'earn') { const { entry } = await twoTops(era); assert.equal((await train(entry)).finished.ok, true); entry.gymHost.close(); }
  else { day = D1; const one = await dayEntry(era, D1); assert.equal((await train(one.entry, 12, '1', { loadFor: { 'demo-press': 45 } })).finished.ok, true); one.entry.gymHost.close(); }
  const host = await era.createNativeLoadHost({ day, engineState: basisFor(day) }), p = await host.project();
  const c = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: p.lifts.find(l => l.lift_lineage_id === 'demo-press').completion_op_id });
  assert.equal(c.status, 'offer', kind + ' ' + JSON.stringify(c.refusal));
  return { era, host, o: c.offers.find(x => x.lift === 'demo-press') };
};
const r26Nothing = async (era, host, M) => {
  const after = await host.project(), press = after.state.exercises.find(e => e.id === 'demo-press');
  assert.deepEqual([(await responsesOf(era)).length, press.w, nativeQueue(after.state, 'demo-press').length], [0, 40, 0], M + ' nothing staged: 0 responses, w 40, no native entry');
};
test('R26-HOST-ACCEPT-ONLY [Y] (spec :97 "respond({handle,proposal_id,answer}) -> durable result; answer=\'accept\'|\'decline\'"; :101 "Accept payload is exactly {proposal_id,answer:\'accept\',issuance}"; :170 "only accept reaches this command. Host decline returns {acknowledged:false,dismissed:true} without staging"; :188 "invalid record -> RECORD_INVALID"; Claude R25 l1 B-R25C-1, mutant H03 "the accept-only guard dropped" at L/today-bindings.mjs:707, and Astra L18 B8, mutant L18-M16 "if (answer && answer !== \'accept\')", both of which survived 294/294 and 63/63): the genuine held handle and its own proposal_id with answer \'yes\', \'ACCEPT\' or undefined (Claude: D1 and D2 sessions, the host on D2 offers demo-press an earn) and with the answer key ABSENT (Astra: D1 at 45 over the working 40, an adopt-observed offer [45,45]) -> each resolves acknowledged false, code NATIVE_LOAD_RECORD_INVALID, not dismissed; 0 responses, w 40 and no native entry after. Under H03 each is acknowledged and one response is written; under L18-M16 the undefined and absent answers are', async () => {
  const cases = [['earn', 'yes'], ['earn', 'ACCEPT'], ['earn', undefined], ['observed', 'ABSENT']];
  for (const [kind, answer] of cases) {
    const M = kind + ' answer ' + JSON.stringify(answer) + ': ', fault = faultDatabase(), { era, host, o } = await r26Offer(fault, kind);
    if (kind === 'observed') assert.deepEqual([o.kind, o.loads, o.current], ['adopt-observed', [45, 45], [40, 40]], M + 'fixture: the genuine adopt-observed offer');
    const args = { handle: o.handle, proposal_id: o.proposalId };
    if (answer !== 'ABSENT') args.answer = answer;
    const r = await host.respond(args);
    assert.deepEqual([r.acknowledged, r.code, !!r.dismissed], [false, 'NATIVE_LOAD_RECORD_INVALID', false], M + 'not consent: RECORD_INVALID before staging ' + JSON.stringify(r));
    await r26Nothing(era, host, M);
    host.close(); era.close();
  }
});
// B-R25C-2 = L18-B5: every earlier refused-handle cell used a closed, cloned or foreign handle; none passed a genuine live handle with
// a wrong proposal_id, so dropping the scope test (Claude's H02) or making it `if (false)` (Astra's L18-M12) agreed with every cell.
test('R26-HOST-WRONG-PROPOSAL-ID [Y] (spec :169 "Refuse detached host, wrong athlete/source, cloned handle or wrong proposal ID before staging"; :188 "Unowned handle, wrong athlete/source or caller issuance -> CAPABILITY_REQUIRED or SCOPE_MISMATCH"; Claude R25 l1 B-R25C-2, mutant H02 "the proposal-ID scope refusal dropped" at L/today-bindings.mjs:710, and Astra L18 B5, mutant L18-M12 "if (proposal_id !== held.proposal_id) -> if (false)", both of which survived 294/294 and 63/63; one row pays both): the genuine live held handle with answer accept and a WRONG proposal_id: \'prop-0000000000000000\' (Claude: D1 and D2 sessions, the host on D2 offers demo-press an earn) and \'synthetic-wrong-proposal\' (Astra: D1 at 45 over the working 40, the adopt-observed offer [45,45]) -> resolves acknowledged false, code NATIVE_LOAD_SCOPE_MISMATCH; 0 responses, w 40 and no native entry after. Under either mutant the answer is acknowledged and one response is written (the adoption sets w 45)', async () => {
  for (const [kind, wrong] of [['earn', 'prop-0000000000000000'], ['observed', 'synthetic-wrong-proposal']]) {
    const M = kind + ' proposal_id ' + wrong + ': ', fault = faultDatabase(), { era, host, o } = await r26Offer(fault, kind);
    assert.notEqual(o.proposalId, wrong, M + 'fixture: the proposal_id differs from the held one');
    const r = await host.respond({ handle: o.handle, proposal_id: wrong, answer: 'accept' });
    assert.deepEqual([r.acknowledged, r.code], [false, 'NATIVE_LOAD_SCOPE_MISMATCH'], M + 'a wrong proposal ID refuses before staging ' + JSON.stringify(r));
    await r26Nothing(era, host, M);
    host.close(); era.close();
  }
});
// L18-B3, -B4, -B7, -B9, -B10: the host maps each issued offer to the display the athlete consents to (L/today-bindings.mjs:700-701).
// No cell displayed a zero load, a nonuniform vector or compared the displayed reason with the saved one, so mapping 0 to null
// (L18-M08, -M09), erasing the reason (L18-M15) or reversing a vector (L18-M17, -M18) agreed with every cell.
const r26Issued = async (era, opId) => (await responsesOf(era)).find(op => op.op_id === opId).payload.issuance;
const r26Values = vector => vector.map(v => (v ? v.value : null));
test('R26-HOST-ZERO-LOAD-DISPLAY [Y] (spec :97 "check(...) -> immutable display offer"; :110 base_load "Load is existing {value,unit:\'lb\'} ... never an inferred magnitude; vector null positions mean not prescribed" (a numeric 0 is a Load, not an unprescribed position); :111 target_load "Only compensation may restore original null/unprescribed positions, with the target effect\'s prior FieldImage"; :139 "The displayed reason and vector are part of the issuance checked at yes"; :154 "restore that image"; Astra L18 B3, mutant L18-M08 "loads: v.value || null" and L18 B4, mutant L18-M09 "current: v.value || null" at L/today-bindings.mjs:700, both of which survived 294/294 and 63/63): demo-press working weight 0, D1 completed at 5, the host on D1: (B4) the check offers adopt-observed with current [0,0] and loads [5,5]; its yes is acknowledged and stores w 5; (B3) then the offered Undo (intent {compensate: that spend}) displays kind compensate with loads [0,0] and current [5,5]; its yes is acknowledged and stores w 0 (the prior image). Each displayed vector equals the vector of the issuance saved with that yes. Under L18-M09 the adoption displays current [null,null]; under L18-M08 the Undo displays loads [null,null]', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const base = withPress(D1, { w: 0 }), one = await dayEntryWith(era, D1, base);
  assert.equal((await train(one.entry, 12, '1', { loadFor: { 'demo-press': 5 } })).finished.ok, true);
  one.entry.gymHost.close();
  const host = await era.createNativeLoadHost({ day: D1, engineState: base }), p = await host.project();
  const req = { lift_lineage_id: 'demo-press', completion_op_id: p.lifts.find(l => l.lift_lineage_id === 'demo-press').completion_op_id };
  const c = await host.check(req);
  assert.equal(c.status, 'offer', JSON.stringify(c.refusal));
  const o = c.offers.find(x => x.lift === 'demo-press');
  assert.deepEqual([o.kind, o.current, o.loads], ['adopt-observed', [0, 0], [5, 5]], '(B4) the numeric zero base is displayed as 0, never as not prescribed ' + JSON.stringify(o));
  const yes = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
  assert.equal(yes.acknowledged, true, JSON.stringify(yes));
  const issued = await r26Issued(era, yes.op_id);
  assert.deepEqual([r26Values(issued.body.base_load.vector), r26Values(issued.body.target_load.vector)], [o.current, o.loads], '(B4) the displayed vectors are the issued ones (:139)');
  assert.equal((await host.project()).state.exercises.find(e => e.id === 'demo-press').w, 5, '(B4) the yes stores 5');
  const u = await host.check({ ...req, intent: { compensate: issued.body.spend_id } });
  assert.equal(u.status, 'offer', 'the Undo is offered: ' + JSON.stringify(u.refusal));
  const ou = u.offers[0];
  assert.deepEqual([ou.kind, ou.loads, ou.current], ['compensate', [0, 0], [5, 5]], '(B3) the Undo displays the prior image 0, never not prescribed ' + JSON.stringify(ou));
  const undo = await host.respond({ handle: ou.handle, proposal_id: ou.proposalId, answer: 'accept' });
  assert.equal(undo.acknowledged, true, JSON.stringify(undo));
  const undone = await r26Issued(era, undo.op_id);
  assert.deepEqual([r26Values(undone.body.base_load.vector), r26Values(undone.body.target_load.vector)], [ou.current, ou.loads], '(B3) the displayed vectors are the issued ones (:139)');
  assert.equal((await host.project()).state.exercises.find(e => e.id === 'demo-press').w, 0, '(B3) the Undo restores w 0 (:154)');
  host.close(); era.close();
});
test('R26-HOST-DISPLAYED-REASON [Y] (spec :97 "check(...) -> immutable display offer"; :102 "reason is the engine-produced native explanation"; :139 "Native explanation is produced in FC01 ... It names baseline/adoption or earning, source workouts, current/target load per set and the canonical reason ... The displayed reason and vector are part of the issuance checked at yes"; :149 "checks the ENTIRE issued body/reason/producer"; Astra L18 B7, mutant L18-M15 "reason: offer.reason -> reason: null" at L/today-bindings.mjs:701, which survived 294/294 and 63/63): demo-press working weight 40, D1 completed at 45, the host on D1 offers adopt-observed [45,45]; accept -> acknowledged, and the displayed explanation is a nonempty string equal to the issuance.reason saved with that yes. Under the mutant the display shows reason null while the saved explanation is the full sentence', async () => {
  const fault = faultDatabase(), { era, host, o } = await r26Offer(fault, 'observed');
  assert.deepEqual([o.kind, o.loads, o.current], ['adopt-observed', [45, 45], [40, 40]], 'fixture: the genuine adopt-observed offer');
  const r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
  assert.equal(r.acknowledged, true, JSON.stringify(r));
  const saved = (await r26Issued(era, r.op_id)).reason;
  assert.equal(typeof saved, 'string');
  assert.ok(saved.length > 0, 'the saved explanation is a sentence');
  assert.equal(o.reason, saved, 'the displayed explanation is exactly the explanation saved with the yes (:139) ' + JSON.stringify([o.reason, saved]));
  host.close(); era.close();
});
test('R26-HOST-VECTOR-ORDER-DISPLAY [Y] (spec :110 base_load vector, :111 target_load vector "complete for captured set count" (per set, in set order); :139 "current/target load per set ... The displayed reason and vector are part of the issuance checked at yes"; :149 ENTIRE issued body; :151 "newW/newWSets equal the selected candidate"; Astra L18 B9, mutant L18-M17 "current vector .reverse()" and L18 B10, mutant L18-M18 "loads vector .reverse()" at L/today-bindings.mjs:700, both of which survived 294/294 and 63/63): demo-press w 40 with wSets [40,35]; D1 and D2 completed on that card; the host on D2 offers an earn -> displayed current [40,35] and loads [45,40], each equal to the issued base/target vector in set order; accept -> acknowledged and the queued native entry carries newWSets [45,40], the displayed loads. Under L18-M17 current displays [35,40]; under L18-M18 loads display [40,45] while [45,40] is queued', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const base = day => withPress(day, { w: 40, wSets: [40, 35] });
  for (const day of [D1, D2]) { const one = await dayEntryWith(era, day, base(day)); assert.equal((await train(one.entry)).finished.ok, true); one.entry.gymHost.close(); }
  const host = await era.createNativeLoadHost({ day: D2, engineState: base(D2) }), p = await host.project();
  const c = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: p.lifts.find(l => l.lift_lineage_id === 'demo-press').completion_op_id });
  assert.equal(c.status, 'offer', JSON.stringify(c.refusal));
  const o = c.offers.find(x => x.lift === 'demo-press');
  assert.deepEqual([o.kind, o.current, o.loads], ['earn', [40, 35], [45, 40]], 'the per-set vectors are displayed in set order ' + JSON.stringify(o));
  const r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
  assert.equal(r.acknowledged, true, JSON.stringify(r));
  const issued = await r26Issued(era, r.op_id);
  assert.deepEqual([r26Values(issued.body.base_load.vector), r26Values(issued.body.target_load.vector)], [o.current, o.loads], 'the displayed vectors are the issued ones (:139)');
  const after = await host.project();
  assert.deepEqual(nativeQueue(after.state, 'demo-press').filter(q => !q.done).map(q => q.newWSets), [o.loads], 'the queued target is the displayed one (:151) ' + JSON.stringify(o.loads));
  host.close(); era.close();
});
// Round 27 (PM ruling DECISIONS:850): Claude R26 l1 B-R26C-2 and B-R26C-3, Astra L19-B1..B5. Every value is invented.
const r27Req = p => ({ lift_lineage_id: 'demo-press', completion_op_id: p.lifts.find(l => l.lift_lineage_id === 'demo-press').completion_op_id });
// B-R26C-2: every earlier host cell accepted the first (or only) displayed offer, so a pre-commit re-evaluation that compares the held
// issuance with the FIRST fresh offer only (Claude's N-H1) agreed with every cell.
test('R27-C2-HOST-SECOND-OFFER [Y] (spec :149 "At accept, the host re-evaluates against the freshly loaded generation, checks the ENTIRE issued body/reason/producer ... Stale means STALE_OFFER"; :97 "check(...) -> immutable display offer plus opaque handle"; :151 "newW/newWSets equal the selected candidate"; Claude R26 l1 B-R26C-2, mutant N-H1 "sameIssued tested against the first fresh offer only" at L/today-bindings.mjs:718, which survived 299/299 and 68/68): demo-press on the rung ladder steps [40,45,50,55,60]; D1 and D2 trained with effort 3+; the durable host on D2 displays two genuine earn offers, PROPOSED [50,50] and DEBUT [45,45]; on a fresh installation each is answered accept with its own handle and proposal ID -> each is acknowledged, exactly 1 response, and the pending native entry is the answered candidate (50, then 45). Under N-H1 the yes to the second displayed offer is refused NATIVE_LOAD_STALE_OFFER and nothing is saved', async () => {
  for (const pick of [0, 1]) {
    const fault = faultDatabase(), era = await reopenAt(fault, D1);
    hostGate(era);
    const base = day => withPress(day, { steps: [40, 45, 50, 55, 60] });
    for (const day of [D1, D2]) { const one = await dayEntryWith(era, day, base(day)); assert.equal((await train(one.entry, 12, '3+')).finished.ok, true); one.entry.gymHost.close(); }
    const host = await era.createNativeLoadHost({ day: D2, engineState: base(D2) }), p = await host.project();
    const c = await host.check(r27Req(p));
    assert.equal(c.status, 'offer', JSON.stringify(c.refusal));
    const shown = c.offers.filter(x => x.lift === 'demo-press');
    assert.deepEqual(shown.map(x => [x.kind, x.state, x.loads]), [['earn', 'PROPOSED', [50, 50]], ['earn', 'DEBUT', [45, 45]]], 'fixture: two genuine displayed offers');
    const o = shown[pick], M = 'offer ' + pick + ' (' + o.loads[0] + '): ';
    const r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
    assert.deepEqual([r.acknowledged, r.code === undefined ? null : r.code], [true, null], M + 'a yes to a displayed, current offer is saved ' + JSON.stringify(r));
    assert.equal((await responsesOf(era)).length, 1, M + 'exactly one response');
    const after = await host.project();
    assert.deepEqual(nativeQueue(after.state, 'demo-press').filter(q => !q.done).map(q => q.newW), [o.loads[0]], M + 'the pending target is the answered candidate');
    host.close(); era.close();
  }
});
// B-R26C-3: R26-HOST-ACCEPT-ONLY pins the invalid answers; no cell asserted the DECLINE result, so a decline that returns
// {acknowledged:false} without dismissed (Claude's N-H3) agreed with every cell. The cancel answer is NOT pinned here (D-R26C-3, held).
test('R27-C3-HOST-DECLINE-DISMISSED [Y] (spec :170 "only accept reaches this command. Host decline returns {acknowledged:false,dismissed:true} without staging"; :101 "Native decline/Not now and cancel only dismiss the view, writing NO operation and spending nothing ... A later manual check can offer again, with a new yes required"; :97 answer=\'accept\'|\'decline\'; Claude R26 l1 B-R26C-3, mutant N-H3 "decline returns {acknowledged:false} without dismissed" at L/today-bindings.mjs:706, which survived 299/299 and 68/68): D1 at 45 over the working 40, the host on D1 displays the genuine adopt-observed offer [45,45]; answered decline with its own handle and proposal ID -> exactly {acknowledged:false, dismissed:true}; 0 responses, w 40, no native entry; a later check offers the same adoption again. Under N-H3 the result lacks dismissed', async () => {
  const fault = faultDatabase(), { era, host, o } = await r26Offer(fault, 'observed');
  assert.deepEqual([o.kind, o.loads, o.current], ['adopt-observed', [45, 45], [40, 40]], 'fixture: the genuine adopt-observed offer');
  const r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'decline' });
  assert.deepEqual(r, { acknowledged: false, dismissed: true }, 'decline dismisses without staging ' + JSON.stringify(r));
  await r26Nothing(era, host, 'decline: ');
  const again = await host.check(r27Req(await host.project()));
  assert.deepEqual([again.status, again.offers.filter(x => x.lift === 'demo-press').map(x => [x.kind, x.loads])], ['offer', [['adopt-observed', [45, 45]]]], 'a later manual check can offer again');
  host.close(); era.close();
});
// L19-B1, -B5: R26-HOST-ZERO-LOAD-DISPLAY and -VECTOR-ORDER-DISPLAY compare integer, non-null displayed vectors with the issued ones;
// no cell displayed a fractional base or a baseline (null) base, so rounding the displayed current (L19-N02) or dropping its null
// positions (L19-N12) agreed with every cell.
test('R27-L19B1-HOST-FRACTIONAL-BASE-DISPLAY [Y] (spec :97 "check(...) -> immutable display offer"; :110 base_load "Load is existing {value,unit:\'lb\'} ... never an inferred magnitude"; :139 "It names ... current/target load per set ... The displayed reason and vector are part of the issuance checked at yes"; Astra L19-B1, mutant L19-N02 "Math.round on the displayed current loads" at L/today-bindings.mjs:700, which survived 299/299 and 68/68): demo-press working weight 40.25, D1 completed at 45.75 on every set, the host on D1 offers adopt-observed -> displayed current [40.25,40.25] and loads [45.75,45.75]; accept -> acknowledged, the saved issuance\'s base and target vectors are exactly the displayed ones, and w 45.75. Under the mutant current displays [40,40] while [40.25,40.25] is saved', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const base = withPress(D1, { w: 40.25 }), one = await dayEntryWith(era, D1, base);
  assert.equal((await train(one.entry, 12, '1', { loadFor: { 'demo-press': 45.75 } })).finished.ok, true);
  one.entry.gymHost.close();
  const host = await era.createNativeLoadHost({ day: D1, engineState: base }), p = await host.project(), c = await host.check(r27Req(p));
  assert.equal(c.status, 'offer', JSON.stringify(c.refusal));
  const o = c.offers.find(x => x.lift === 'demo-press');
  assert.deepEqual([o.kind, o.current, o.loads], ['adopt-observed', [40.25, 40.25], [45.75, 45.75]], 'the fractional base and target are displayed as they are ' + JSON.stringify(o));
  const yes = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
  assert.equal(yes.acknowledged, true, JSON.stringify(yes));
  const issued = await r26Issued(era, yes.op_id);
  assert.deepEqual([r26Values(issued.body.base_load.vector), r26Values(issued.body.target_load.vector)], [o.current, o.loads], 'the displayed vectors are the issued ones (:139)');
  assert.equal((await host.project()).state.exercises.find(e => e.id === 'demo-press').w, 45.75, 'the yes stores 45.75');
  host.close(); era.close();
});
test('R27-L19B5-HOST-BASELINE-NULL-DISPLAY [Y] (spec :97 "check(...) -> immutable display offer"; :60 and :110 base_load "vector:[LoadOrNull] ... vector null positions mean not prescribed"; :139 "current/target load per set ... The displayed reason and vector are part of the issuance checked at yes"; Astra L19-B5, mutant L19-N12 "null base positions filtered out of the displayed current vector" at L/today-bindings.mjs:700, which survived 299/299 and 68/68): demo-press with no working weight (w null), D1 completed at 45 on every set, the host on D1 offers adopt-baseline -> displayed current [null,null] (one position per set, each not prescribed) and loads [45,45]; accept -> acknowledged, the saved issuance\'s base and target vectors are exactly the displayed ones, and w 45. Under the mutant current displays [] while [null,null] is saved', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const base = withPress(D1, { w: null }), one = await dayEntryWith(era, D1, base);
  assert.equal((await train(one.entry, 12, '1', { loadFor: { 'demo-press': 45 } })).finished.ok, true);
  one.entry.gymHost.close();
  const host = await era.createNativeLoadHost({ day: D1, engineState: base }), p = await host.project(), c = await host.check(r27Req(p));
  assert.equal(c.status, 'offer', JSON.stringify(c.refusal));
  const o = c.offers.find(x => x.lift === 'demo-press');
  assert.deepEqual([o.kind, o.current, o.loads], ['adopt-baseline', [null, null], [45, 45]], 'every base position is displayed, each not prescribed ' + JSON.stringify(o));
  const yes = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
  assert.equal(yes.acknowledged, true, JSON.stringify(yes));
  const issued = await r26Issued(era, yes.op_id);
  assert.deepEqual([r26Values(issued.body.base_load.vector), r26Values(issued.body.target_load.vector)], [o.current, o.loads], 'the displayed vectors are the issued ones (:139)');
  assert.equal((await host.project()).state.exercises.find(e => e.id === 'demo-press').w, 45, 'the yes stores 45');
  host.close(); era.close();
});
// L19-B2: R26-HOST-DISPLAYED-REASON compares the displayed and saved explanation of an ADOPTION only, so a display that omits the reason
// of a compensation only (L19-N06) agreed with every cell.
test('R27-L19B2-HOST-UNDO-REASON [Y] (spec :97 "check(...) -> immutable display offer"; :102 "reason is the engine-produced native explanation"; :139 "The displayed reason and vector are part of the issuance checked at yes"; :149 "checks the ENTIRE issued body/reason/producer"; :154 compensation; Astra L19-B2, mutant L19-N06 "the reason omitted for a compensation only" at L/today-bindings.mjs:701, which survived 299/299 and 68/68): demo-press working weight 40, D1 completed at 45, the host on D1: the adopt-observed [45,45] is accepted, then its offered Undo (intent {compensate: that spend}) -> the Undo displays kind compensate, loads [40,40], current [45,45] and a nonempty explanation equal to the issuance.reason saved with its yes; the Undo is acknowledged and restores w 40. Under the mutant the Undo displays reason null while the saved explanation is the full sentence', async () => {
  const fault = faultDatabase(), { era, host, o } = await r26Offer(fault, 'observed');
  const r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
  assert.equal(r.acknowledged, true, JSON.stringify(r));
  const adopted = await r26Issued(era, r.op_id), p = await host.project();
  const u = await host.check({ ...r27Req(p), intent: { compensate: adopted.body.spend_id } });
  assert.equal(u.status, 'offer', 'the Undo is offered: ' + JSON.stringify(u.refusal));
  const ou = u.offers[0];
  assert.deepEqual([ou.kind, ou.loads, ou.current], ['compensate', [40, 40], [45, 45]], 'fixture: the genuine Undo offer ' + JSON.stringify(ou));
  const yes = await host.respond({ handle: ou.handle, proposal_id: ou.proposalId, answer: 'accept' });
  assert.equal(yes.acknowledged, true, JSON.stringify(yes));
  const saved = (await r26Issued(era, yes.op_id)).reason;
  assert.equal(typeof saved, 'string');
  assert.ok(saved.length > 0, 'the saved explanation is a sentence');
  assert.equal(ou.reason, saved, 'the displayed Undo explanation is exactly the explanation saved with its yes (:139) ' + JSON.stringify([ou.reason, saved]));
  assert.equal((await host.project()).state.exercises.find(e => e.id === 'demo-press').w, 40, 'the Undo restores w 40 (:154)');
  host.close(); era.close();
});
// L19-B3, -B4: R26-HOST-ACCEPT-ONLY and -WRONG-PROPOSAL-ID pin string answers and non-empty wrong IDs; no cell answered boolean true or
// omitted the proposal ID, so accepting true as consent (L19-N09) or checking the scope only for a truthy ID (L19-N10) agreed with every cell.
test('R27-L19B3-HOST-BOOLEAN-ANSWER [Y] (spec :97 "respond({handle,proposal_id,answer}) -> durable result; answer=\'accept\'|\'decline\'"; :101 "Accept payload is exactly {proposal_id,answer:\'accept\',issuance}"; :60; :170 "only accept reaches this command"; :188 "invalid record -> RECORD_INVALID"; Astra L19-B3, mutant L19-N09 "boolean true accepted as consent" at L/today-bindings.mjs:707, which survived 299/299 and 68/68): D1 at 45 over the working 40, the genuine adopt-observed offer [45,45], its genuine handle and correct proposal ID with answer true -> acknowledged false, code NATIVE_LOAD_RECORD_INVALID, not dismissed; 0 responses, w 40, no native entry. Under the mutant it is acknowledged, one response is written and w becomes 45', async () => {
  const fault = faultDatabase(), { era, host, o } = await r26Offer(fault, 'observed');
  assert.deepEqual([o.kind, o.loads, o.current], ['adopt-observed', [45, 45], [40, 40]], 'fixture: the genuine adopt-observed offer');
  const r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: true });
  assert.deepEqual([r.acknowledged, r.code, !!r.dismissed], [false, 'NATIVE_LOAD_RECORD_INVALID', false], 'boolean true is not consent ' + JSON.stringify(r));
  await r26Nothing(era, host, 'answer true: ');
  host.close(); era.close();
});
test('R27-L19B4-HOST-MISSING-PROPOSAL-ID [Y] (spec :169 "Refuse detached host, wrong athlete/source, cloned handle or wrong proposal ID before staging"; :188 "Unowned handle, wrong athlete/source or caller issuance -> CAPABILITY_REQUIRED or SCOPE_MISMATCH"; :101 "Accept payload is exactly {proposal_id,answer:\'accept\',issuance}"; Astra L19-B4, mutant L19-N10 "the proposal scope checked only for a truthy proposal_id" at L/today-bindings.mjs:710, which survived 299/299 and 68/68): D1 at 45 over the working 40, the genuine adopt-observed offer [45,45], its genuine live handle and answer accept with the proposal_id key ABSENT, and again with proposal_id the empty string -> each resolves acknowledged false, code NATIVE_LOAD_SCOPE_MISMATCH; 0 responses, w 40, no native entry. Under the mutant each is acknowledged, one response is written and w becomes 45', async () => {
  for (const id of ['ABSENT', '']) {
    const M = 'proposal_id ' + JSON.stringify(id) + ': ', fault = faultDatabase(), { era, host, o } = await r26Offer(fault, 'observed');
    const args = { handle: o.handle, answer: 'accept' };
    if (id !== 'ABSENT') args.proposal_id = id;
    const r = await host.respond(args);
    assert.deepEqual([r.acknowledged, r.code], [false, 'NATIVE_LOAD_SCOPE_MISMATCH'], M + 'no matching proposal ID refuses before staging ' + JSON.stringify(r));
    await r26Nothing(era, host, M);
    host.close(); era.close();
  }
});
// Round 27 BROAD SWEEP host cells (PM ruling DECISIONS:850; Part B). Each names the sweep mutant(s) it kills and asserts only the
// outcome the cited clause states, through the genuine durable host. Every value is invented.
test('R27S-H186-H190-HOST-FRESH-YES-AND-WRITE-FAILURE [Y] (spec :172 "Return acknowledged:true only after the existing durable commit. If the acknowledgement is lost, read the authenticated operation log for that exact issuance/spend; report already-saved only if found and folded. Do not mint another response"; :185 "host write failure leaves acknowledged:false"; :212 "Decline/cancel/failed put | No native authorisation, no spend"; :261 N06 ABORT seam; sweep S27-H186 "the committed-result test negated" and S27-H190 "the committed-result return removed" at L/today-bindings.mjs:725, which survived 299/299 and 75/75): D1 at 45 over the working 40, the genuine adopt-observed offer [45,45]: (a) accepted on a healthy store -> {acknowledged:true, op_id, durableRevision} with no alreadySaved, exactly one response; (b) on a fresh installation, the store armed to fail the write (faultDatabase quota, spec :261) and the same offer accepted -> acknowledged false, not already-saved, 0 responses. Under H190 (a) reports alreadySaved; under H186 (a) reports alreadySaved and (b) reports acknowledged true with nothing saved', async () => {
  { const fault = faultDatabase(), { era, host, o } = await r26Offer(fault, 'observed');
    const r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
    assert.deepEqual([r.acknowledged, Object.hasOwn(r, 'alreadySaved'), typeof r.op_id, typeof r.durableRevision], [true, false, 'string', 'number'], '(a) a first commit is acknowledged, never already-saved ' + JSON.stringify(r));
    assert.equal((await responsesOf(era)).length, 1, '(a) exactly one response');
    host.close(); era.close(); }
  { const fault = faultDatabase(), { era, host, o } = await r26Offer(fault, 'observed');
    fault.state.armed = true; fault.state.mode = 'quota';
    const r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
    fault.state.armed = false; fault.state.mode = null;
    assert.deepEqual([r.acknowledged, !!r.alreadySaved], [false, false], '(b) a failed put is not acknowledged ' + JSON.stringify(r));
    assert.equal((await responsesOf(era)).length, 0, '(b) nothing saved');
    host.close(); era.close(); }
});
test('R27S-H194-HOST-WRITE-FAILURE-NOT-SAVED [Y] (spec :172 "report already-saved only if found and folded"; :185 "host write failure leaves acknowledged:false"; sweep S27-H194 "the late already-saved test negated" at L/today-bindings.mjs:728, which survived 299/299 and 75/75): D1 at 45 over the working 40, the genuine adopt-observed offer [45,45], the store armed to fail the write (faultDatabase quota, spec :261) -> respond resolves (no exception) to acknowledged false with a refusal code, 0 responses. Under the mutant respond throws reading the op_id of the absent saved response', async () => {
  const fault = faultDatabase(), { era, host, o } = await r26Offer(fault, 'observed');
  fault.state.armed = true; fault.state.mode = 'quota';
  let r = null, thrown = null;
  try { r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' }); } catch (err) { thrown = err; }
  fault.state.armed = false; fault.state.mode = null;
  assert.equal(thrown, null, 'respond resolves: ' + (thrown && thrown.message));
  assert.deepEqual([r.acknowledged, typeof r.code], [false, 'string'], 'a failed put is refused by name ' + JSON.stringify(r));
  assert.equal((await responsesOf(era)).length, 0, 'nothing saved');
  host.close(); era.close();
});
test('R27S-H049-HOST-INVALID-BASIS [Y] (spec :97 "project() -> authenticated Fold plus source basis"; :188 "invalid record -> RECORD_INVALID"; FC08 L/today-bindings.mjs:638-640 the page basis option; sweep S27-H049 "project(): the invalid-basis refusal removed" at L/today-bindings.mjs:642, which survived 299/299 and 75/75): the durable host after one saved workout; project({base}) with a basis whose exercises is not an array -> {ok:false, code NATIVE_LOAD_RECORD_INVALID}, never a fold. Under the mutant project() reports ok true with a refused fold', async () => {
  const fault = faultDatabase(), { era, host } = await r26Offer(fault, 'observed');
  const p = await host.project({ base: { exercises: 'none' } });
  assert.deepEqual([p.ok, p.code, Object.hasOwn(p, 'status')], [false, 'NATIVE_LOAD_RECORD_INVALID', false], JSON.stringify(p));
  host.close(); era.close();
});
test('R27S-H111-HOST-RETRY-NEEDS-A-FOLD [Y] (spec :172 "report already-saved only if found and folded"; :157 ADMISSION GATE (1) "an imported generation refuses SOURCE_FRONTIER_UNPROVEN before folding"; sweep S27-H111 "savedResponse: the found-and-folded test removed" at L/today-bindings.mjs:668, which survived 299/299 and 75/75): D1 at 45 over the working 40, the genuine adopt-observed offer accepted (acknowledged, 1 response); the installation\'s generation then gains a nonempty sourceImports collection; the SAME handle answered accept again -> not acknowledged and not already-saved (nothing is folded, the refusal is NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN); still exactly 1 response. Under the mutant the retry reports already-saved from an unfolded generation', async () => {
  const fault = faultDatabase(), { era, host, o } = await r26Offer(fault, 'observed');
  const r1 = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
  assert.equal(r1.acknowledged, true, JSON.stringify(r1));
  const one = await dayEntry(era, D1), repo = one.entry.gymHost.repository, snap = await repo.load(), gen = structuredClone(snap.generation);
  gen.collections.sourceImports = { 'fx-import-1': { profile: 'earned/source-import/v1' } };
  await repo.commit({ revision: snap.revision, token: snap.token }, gen);
  one.entry.gymHost.close();
  const r2 = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
  assert.deepEqual([r2.acknowledged, !!r2.alreadySaved, r2.code], [false, false, 'NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN'], 'already-saved needs a fold ' + JSON.stringify(r2));
  assert.equal((await responsesOf(era)).length, 1, 'still exactly one response');
  host.close(); era.close();
});

// ---- FA03 (rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs), appended after the round-27 cells ----
// Two IDB-API seams, outside product code (as faultDatabase): LOST ACKNOWLEDGEMENT (the armed readwrite 'generations' transaction
// that puts 'active' really commits, but the product's completion handler is replaced by its own abort handler: Claude D-R25C-2's
// seam) and INTERLEAVED WRITE (the armed readonly 'generations' transaction completes, an external commit lands, and only then does
// the product's own completion handler run: Claude D-R24-O-3's seam).
const r28Wrap = (fault, onTx) => {
  const open = fault.indexedDB.open.bind(fault.indexedDB);
  fault.indexedDB.open = (...a) => { const req = open(...a);
    req.addEventListener('success', () => { const db = req.result, orig = db.transaction.bind(db);
      db.transaction = (...t) => { const tx = orig(...t); onTx(tx, t); return tx; }; });
    return req; };
};
const r28LostAck = fault => { const flag = { armed: false, fired: 0 };
  r28Wrap(fault, (tx, t) => {
    if (t[0] !== 'generations' || t[1] !== 'readwrite' || !flag.armed) return;
    let wrote = false, h = null, decided = null; const os = tx.objectStore.bind(tx);
    tx.objectStore = n => { const s = os(n); if (n === 'generations' && !s.r28) { const put = s.put.bind(s); s.put = (v, k) => { if (k === 'active') wrote = true; return put(v, k); }; s.r28 = true; } return s; };
    Object.defineProperty(tx, 'oncomplete', { configurable: true, set(v) { h = v; }, get() { if (!h) return null;
      if (decided === null) { decided = wrote && flag.armed; if (decided) { flag.armed = false; flag.fired++; } }
      return decided ? (e => { const ab = tx.onabort; if (ab) ab.call(tx, e); }) : h; } });
  });
  return flag; };
const r28Interleave = fault => { const flag = { armed: false, fired: 0, inject: null };
  r28Wrap(fault, (tx, t) => {
    if (t[0] !== 'generations' || (t[1] !== undefined && t[1] !== 'readonly') || !flag.armed) return;
    flag.armed = false; let h = null;
    Object.defineProperty(tx, 'oncomplete', { configurable: true, set(v) { h = v; }, get() { if (!h) return null;
      return e => { flag.fired++; Promise.resolve().then(() => flag.inject()).then(() => h.call(tx, e)); }; } });
  });
  return flag; };
const r28ImportCommit = async (era, day, imports) => { const one = await dayEntry(era, day), repo = one.entry.gymHost.repository, snap = await repo.load(), gen = structuredClone(snap.generation);
  gen.collections.sourceImports = imports;
  return { run: () => repo.commit({ revision: snap.revision, token: snap.token }, gen), close: () => one.entry.gymHost.close(), repo }; };
test('R28-HOST-LOST-ACK-ALREADY-SAVED [Y] (spec :172 "Return acknowledged:true only after the existing durable commit. If the acknowledgement is lost, read the authenticated operation log for that exact issuance/spend; report already-saved only if found and folded. Do not mint another response"; Claude D-R25C-2 seam; sweep S27-H198 "the late already-saved return removed", H197 "returns null", H195 "acknowledged false", H196 "alreadySaved false", H199/H200/H201 "acknowledged / alreadySaved / op_id dropped" at L/today-bindings.mjs:728): D1 at 45 over the working 40, the genuine adopt-observed offer [45,45]; the one commit of the yes is durable but its acknowledgement is lost -> respond resolves exactly {acknowledged:true, alreadySaved:true, op_id: the saved response}; exactly 1 response; w 45. Under H198 it is {acknowledged:false, state:3, code:TRANSACTION_ABORTED, copy:null} with the response on disk', async () => {
  const fault = faultDatabase(), flag = r28LostAck(fault), { era, host, o } = await r26Offer(fault, 'observed');
  flag.armed = true;
  const r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
  flag.armed = false;
  assert.equal(flag.fired, 1, 'fixture: exactly one acknowledgement was lost');
  const saved = await responsesOf(era);
  assert.equal(saved.length, 1, 'the response is durable and no second one is minted');
  assert.deepEqual(r, { acknowledged: true, alreadySaved: true, op_id: saved[0].op_id }, 'found and folded: already saved ' + JSON.stringify(r));
  assert.equal((await host.project()).state.exercises.find(e => e.id === 'demo-press').w, 45, 'the saved yes is folded');
  host.close(); era.close();
});
test('R28-HOST-INTERLEAVED-WRITE [Y] (spec :169 "It loads/authenticates through the same host bindings used for workout history; constructs the fold and evaluation from that generation"; :157 ADMISSION GATE (1) "an imported generation refuses SOURCE_FRONTIER_UNPROVEN before folding"; :149 "Stale means STALE_OFFER"; Claude D-R24-O-3 seam; sweep S27-H076 "the history-revision guard removed", H074 "ok true", H075 "returns null", H078 "code dropped" at L/today-bindings.mjs:648): D1 at 45 over the working 40 (the durable host on D1); a commit that adds a nonempty sourceImports collection lands between project()\'s generation load and its history read -> project() resolves {ok:false, code NATIVE_LOAD_STALE_OFFER}, never a fold of the older generation; the next project() refuses SOURCE_FRONTIER_UNPROVEN. Under H076 project() reports ok true, status ready, revision 8 while the durable revision is 9 and imported; under H074/H075 it throws; under H078 its code is absent', async () => {
  const fault = faultDatabase(), flag = r28Interleave(fault), { era, host } = await r26Offer(fault, 'observed');
  const w = await r28ImportCommit(era, D1, { 'fx-import-1': { profile: 'earned/source-import/v1' } });
  flag.inject = w.run; flag.armed = true;
  const p = await host.project();
  flag.armed = false;
  assert.equal(flag.fired, 1, 'fixture: the write landed between the two loads');
  assert.deepEqual([p.ok, p.code], [false, 'NATIVE_LOAD_STALE_OFFER'], 'a projection is of one generation: the interleaved write refuses it ' + JSON.stringify({ ok: p.ok, code: p.code, revision: p.revision }));
  const next = await host.project();
  assert.deepEqual([next.ok, next.code], [false, 'NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN'], 'the durable generation is imported');
  w.close(); host.close(); era.close();
});
test('R28-HOST-RETRY-OVER-AN-UNFOLDED-BASIS [Y] (spec :172 "report already-saved only if found and folded"; :188 "invalid record -> RECORD_INVALID"; FC08 L/today-bindings.mjs:623-626 engineState "a function returning the CURRENT one"; sweep S27-H107 "savedResponse: || -> && before the spent test" at L/today-bindings.mjs:668): D1 at 45 over the working 40, the durable host on D1 with engineState a function; the adopt-observed [45,45] is accepted (acknowledged, 1 response); the page then adopts a basis with no queue array, so the fold refuses RECORD_INVALID field base and folds nothing (spent []); the SAME handle answered accept again -> not acknowledged, not already-saved, code NATIVE_LOAD_STALE_OFFER; still 1 response. Under H107 the retry reports {acknowledged:true, alreadySaved:true} with nothing folded', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const one = await dayEntry(era, D1);
  assert.equal((await train(one.entry, 12, '1', { loadFor: { 'demo-press': 45 } })).finished.ok, true);
  one.entry.gymHost.close();
  let current = basisFor(D1);
  const host = await era.createNativeLoadHost({ day: D1, engineState: () => current }), c = await host.check(r27Req(await host.project()));
  const o = c.offers.find(x => x.lift === 'demo-press');
  assert.equal((await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' })).acknowledged, true);
  const noQueue = basisFor(D1); delete noQueue.queue; current = noQueue;
  const p = await host.project();
  assert.deepEqual([p.ok, p.status, p.issues.map(i => [i.code, i.field]), p.spent], [true, 'refused', [['NATIVE_LOAD_RECORD_INVALID', 'base']], []], 'fixture: nothing is folded');
  const r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
  assert.deepEqual([r.acknowledged, !!r.alreadySaved, r.code], [false, false, 'NATIVE_LOAD_STALE_OFFER'], 'found but not folded: never already-saved ' + JSON.stringify(r));
  assert.equal((await responsesOf(era)).length, 1, 'still exactly one response');
  host.close(); era.close();
});
test('R28-HOST-EMPTY-IMPORT-COLLECTION [Y] (spec R9.1 :157 ADMISSION GATE (1) "an imported generation refuses SOURCE_FRONTIER_UNPROVEN before folding (the local host refuses a nonempty imported-source collection ...)"; :97 project() -> authenticated Fold; sweep S27-H052 "imported && typeof ... && keys.length -> imported || ..." at L/today-bindings.mjs:645): D1 at 45 over the working 40; the installation\'s generation gains an EMPTY sourceImports collection ({}) -> project() is ok with status ready and the check still offers adopt-observed [45,45]. Under H052 project() refuses NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN and nothing is offered', async () => {
  const fault = faultDatabase(), { era, host } = await r26Offer(fault, 'observed');
  const w = await r28ImportCommit(era, D1, {}); await w.run(); w.close();
  const p = await host.project();
  assert.deepEqual([p.ok, p.code, p.status], [true, undefined, 'ready'], 'an empty collection imports nothing ' + JSON.stringify([p.ok, p.code]));
  const c = await host.check(r27Req(p));
  assert.deepEqual([c.status, c.offers.map(x => [x.kind, x.loads])], ['offer', [['adopt-observed', [45, 45]]]], 'the offer stands');
  host.close(); era.close();
});
test('R28-HOST-STORAGE-CODE-KEPT [Y] (spec :185 "host write failure leaves acknowledged:false. Existing storage/lease/source-reader codes retain their original names and copy"; :261 N06 fault seam; sweep S27-H203 "(result && result.code) || NOT_SAVED -> (result && result.code) && NOT_SAVED" at L/today-bindings.mjs:729): D1 at 45 over the working 40, the genuine adopt-observed offer [45,45], the store armed to fail the write (faultDatabase quota) -> respond resolves acknowledged false with the storage failure\'s own code TRANSACTION_WRITE_FAILED, 0 responses. Under H203 the code is replaced by NATIVE_LOAD_NOT_SAVED', async () => {
  const fault = faultDatabase(), { era, host, o } = await r26Offer(fault, 'observed');
  fault.state.armed = true; fault.state.mode = 'quota';
  const r = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
  fault.state.armed = false; fault.state.mode = null;
  assert.deepEqual([r.acknowledged, r.code], [false, 'TRANSACTION_WRITE_FAILED'], 'the storage code keeps its name ' + JSON.stringify(r));
  assert.equal((await responsesOf(era)).length, 0, 'nothing saved');
  host.close(); era.close();
});
test('R28-HOST-CHECK-REFUSAL-SHAPE [Y] (spec :185 "Refusal is exactly {code,refs,field}. refs are authenticated operation/source references or [], field is the implicated input field or null"; :97 "check(...) -> immutable display offer plus opaque handle or refusal"; R9.1 :157 ADMISSION GATE (1); sweep S27-H131 "refs: [] dropped" and S27-H132 "field: null dropped" from check()\'s host-refusal return at L/today-bindings.mjs:686): D1 at 45 over the working 40; the installation\'s generation then gains a nonempty sourceImports collection -> check() resolves exactly {status:\'refused\', offers:[], refusal:{code:NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN, refs:[], field:null}}. Under H131 the refusal has no refs; under H132 it has no field', async () => {
  const fault = faultDatabase(), { era, host } = await r26Offer(fault, 'observed'), req = r27Req(await host.project());
  const one = await dayEntry(era, D1), repo = one.entry.gymHost.repository, snap = await repo.load(), gen = structuredClone(snap.generation);
  gen.collections.sourceImports = { 'fx-import-1': { profile: 'earned/source-import/v1' } };
  await repo.commit({ revision: snap.revision, token: snap.token }, gen);
  one.entry.gymHost.close();
  const c = await host.check(req);
  assert.deepEqual(c, { status: 'refused', offers: [], refusal: { code: 'NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN', refs: [], field: null } }, 'a refusal is exactly {code,refs,field} ' + JSON.stringify(c));
  host.close(); era.close();
});
test('R28-HOST-CLOSED-CHECK-IS-A-REFUSAL [Y] (spec :97 "check({lift_lineage_id,completion_op_id,intent}) -> immutable display offer plus opaque handle or refusal ... close() invalidates held handles"; :185 "Refusal is exactly {code,refs,field}. refs are authenticated operation/source references or [], field is the implicated input field or null"; the refusal CODE after close is NOT pinned here (Claude D-R25C-1, carried); sweep S27-H041 "the closed-host return -> null" and S27-H044 "its code dropped" at L/today-bindings.mjs:641): D1 at 45 over the working 40, the durable host on D1, host.close() -> check() on demo-press\'s completion resolves (no exception) to status refused, no offer, and a refusal that is exactly {code: a string, refs: an array, field: a string or null}. Under H041 check() throws; under H044 the refusal has no code', async () => {
  const fault = faultDatabase(), { era, host } = await r26Offer(fault, 'observed'), req = r27Req(await host.project());
  host.close();
  let c = null, thrown = null;
  try { c = await host.check(req); } catch (err) { thrown = err; }
  assert.equal(thrown, null, 'check() after close resolves: ' + (thrown && thrown.message));
  assert.deepEqual([c.status, c.offers], ['refused', []], 'no offer from a closed host ' + JSON.stringify(c));
  assert.deepEqual(Object.keys(c.refusal).sort(), ['code', 'field', 'refs'], 'a refusal is exactly {code,refs,field} ' + JSON.stringify(c.refusal));
  assert.deepEqual([typeof c.refusal.code, Array.isArray(c.refusal.refs), c.refusal.field === null || typeof c.refusal.field === 'string'], ['string', true, true], JSON.stringify(c.refusal));
  era.close();
});

// ---- Round 28 builder: H011/H016 and H018 pinned from classifier C's inputs (CLASSIFY-HOST-ALV.md section 4, probes T2/T4) by PM ruling DECISIONS:852 (1), citing the w6 host contract ----
test('R28C-GYM-DETACHED-HANDLE-REFUSES-A-WRITE [Y] (w6 host contract, L/today-bindings.mjs:566-:569 "A detached handle is no longer the current session, so a write that outlives it is refused by the public client rather than reaching a live repository" and :595 "Detaches THIS handle only"; PM ruling DECISIONS:852 (1); classifier C input "detached-gym"; sweep S27-H011 "isCurrentSession: alive === true && ... -> alive === true || ..." at L/today-bindings.mjs:571 and S27-H016 "close() { alive = false; } -> alive = true" at :596): a gym entry on D1, its gymHost closed, then gym.start() -> {ok:false, code SESSION_CHANGED} and no op written. Under H011 and H016 the start is accepted (ok true) and one op is written through the detached handle', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1), one = await dayEntry(era, D1);
  const before = (await opsOf(era)).length;
  one.entry.gymHost.close();
  const s = await one.entry.gym.start();
  assert.deepEqual([s.ok, s.code], [false, 'SESSION_CHANGED'], 'a detached handle is no longer the current session ' + JSON.stringify({ ok: s.ok, code: s.code }));
  assert.equal((await opsOf(era)).length, before, 'no write reaches the repository through the detached handle');
  era.close();
});
test('R28C-HOST-RECONCILE-MISMATCH-REFUSED [Y] (w6 host contract, L/today-bindings.mjs:302-:322 reconcile "A MISMATCH is refused by name" and C4b-D1 "A host\'s day comes from its day argument and from nowhere else, so a second, possibly disagreeing clock is refused BY NAME"; createNativeLoadHost applies the installation\'s reconcile at :620; PM ruling DECISIONS:852 (1); classifier C input "reconcile" (probe T4); sweep S27-H018 "reconcile(where, options) -> reconcile(options, where)" at L/today-bindings.mjs:620): createNativeLoadHost({day D1, engineState}) with a clock, or a namespace, databaseName or indexedDB other than the installation\'s -> throws StorageFailure LOCAL_ERA_CLOCK_MISMATCH / LOCAL_ERA_NAMESPACE_MISMATCH / LOCAL_ERA_DATABASE_MISMATCH / LOCAL_ERA_STORE_MISMATCH and no host opens. Under H018 every one of the four opens', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  for (const [extra, code] of [[{ clock: { today: () => D1 } }, 'LOCAL_ERA_CLOCK_MISMATCH'], [{ namespace: 'fx-other-namespace' }, 'LOCAL_ERA_NAMESPACE_MISMATCH'], [{ databaseName: 'fx-other-db' }, 'LOCAL_ERA_DATABASE_MISMATCH'], [{ indexedDB: {} }, 'LOCAL_ERA_STORE_MISMATCH']]) {
    const k = Object.keys(extra)[0];
    let h = null, thrown = null;
    try { h = await era.createNativeLoadHost({ day: D1, engineState: basisFor(D1), ...extra }); } catch (err) { thrown = err; }
    if (h) h.close();
    assert.equal(h, null, k + ': no host opens over a mismatched option');
    assert.deepEqual([thrown && thrown.name, thrown && thrown.code], ['StorageFailure', code], k + ': refused by name ' + String(thrown && (thrown.code || thrown.message)));
  }
  era.close();
});

// ---- Round 30 builder U (PM ruling DECISIONS:856 (1)): Astra L20-B3..B7 and -B10 pinned at the REAL rendered panel over the genuine
// durable host, and L20-B1 at the durable host. Every value is invented. The display rows before this block compare the host's offer
// OBJECT with the saved issuance; no cell compared the TEXT the panel renders (today-entry.mjs:283-:284) with the saved issuance, or
// clicked the actual Not now button (today-entry.mjs:288), so L20-M01..M06 agreed with every cell.
const r30Open = async entry => { const doc = shell(), phone = doc.getElementById('phone'); await entry.open({ doc, phone, back: () => {} }); return doc; };
const r30Check = async (entry, doc) => { const b = q(doc, '[data-native-load="check"]'); assert.ok(b, 'the visible Check next weight action'); b.click(); await entry.nativeLoad.settled(); };
const r30Card = (doc, lift, kind) => { const cards = qa(doc, '[data-native-load="offer"]').filter(c => c.getAttribute('data-lift') === lift && c.getAttribute('data-kind') === kind); assert.equal(cards.length, 1, 'exactly one rendered ' + kind + ' card for ' + lift); return cards[0]; };
const r30Shown = card => ({ proposal: card.getAttribute('data-proposal'), loads: qa(card, '[data-native-load="set-load"]').map(x => x.textContent.trim()), reason: q(card, '[data-native-load="reason"]').textContent });
const r30Text = vector => vector.map(v => (v === null ? PROPOSED().noWeight : v.value + ' ' + v.unit));
// Click the card's real Yes, then compare what the card RENDERED (captured before the click) with the issuance saved by that click.
const r30Agree = async (era, entry, card, M) => {
  const shown = r30Shown(card), before = (await responsesOf(era)).length;
  q(card, '[data-native-load="yes"]').click();
  await entry.nativeLoad.settled();
  const all = await responsesOf(era), mine = all.filter(op => op.payload.proposal_id === shown.proposal);
  assert.deepEqual([all.length - before, mine.length, mine.length && mine[0].payload.answer], [1, 1, 'accept'], M + 'the Yes click saves exactly one accept for the rendered proposal');
  const issuance = mine[0].payload.issuance;
  assert.deepEqual(shown.loads, r30Text(issuance.body.target_load.vector), M + 'the rendered set loads are the saved issuance target vector, every position in set order (:138, :139) ' + JSON.stringify(shown.loads));
  assert.equal(typeof issuance.reason, 'string');
  assert.ok(issuance.reason.length > 0, M + 'the saved explanation is a sentence');
  assert.equal(shown.reason, issuance.reason, M + 'the rendered explanation is the saved issuance reason (:102, :139) ' + JSON.stringify(shown.reason));
  return { shown, issuance };
};
const r30Press = async (era, day, basis) => { const host = await era.createNativeLoadHost({ day, engineState: basis }), p = await host.project(); host.close(); return { press: p.state.exercises.find(e => e.id === 'demo-press'), queue: nativeQueue(p.state, 'demo-press'), issues: p.issues }; };
test('R30-L20B3-DOM-FRACTIONAL-TARGET [Y] (spec :138 "Display the chosen full vector and native yes-required explanation"; :139 "It names ... current/target load per set ... The displayed reason and vector are part of the issuance checked at yes"; :111 target_load "exactly observed/canonical"; Astra L20-B3, mutant L20-M01 "Math.round(load)" in the rendered set load at today-entry.mjs:283, which survived 393/393 and 88/88): demo-press working weight 40.25, D1 completed at 45.75 on both sets; the real panel (Check next weight clicked) renders the adopt-observed card with set loads ["45.75 lb","45.75 lb"]; its Yes click saves exactly one accept whose issuance target vector renders to exactly that text and whose reason is the rendered one; the next projection has w 45.75. Under the mutant the card renders ["46 lb","46 lb"] while 45.75 is saved', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const base = withPress(D1, { w: 40.25 }), { entry } = await dayEntryWith(era, D1, base);
  assert.equal((await train(entry, 12, '1', { loadFor: { 'demo-press': 45.75 } })).finished.ok, true);
  const doc = await r30Open(entry);
  await r30Check(entry, doc);
  const card = r30Card(doc, 'demo-press', 'adopt-observed');
  assert.deepEqual(r30Shown(card).loads, ['45.75 lb', '45.75 lb'], 'the fractional target is rendered as it is ' + JSON.stringify(r30Shown(card).loads));
  const { issuance } = await r30Agree(era, entry, card, 'fractional: ');
  assert.deepEqual(r26Values(issuance.body.target_load.vector), [45.75, 45.75]);
  assert.equal((await r30Press(era, D1, base)).press.w, 45.75, 'the yes stores 45.75');
  entry.gymHost.close(); era.close();
});
test('R30-L20B4-DOM-VECTOR-ORDER [Y] (spec :138 "Candidate vector is earnWalk.newWSets verbatim ... Display the chosen full vector"; :139 "current/target load per set ... The displayed reason and vector are part of the issuance checked at yes"; :111 target_load vector; :151 "newW/newWSets equal the selected candidate"; Astra L20-B4, mutant L20-M02 "offer.loads.slice().reverse()" in the rendered set loads at today-entry.mjs:283, which survived 393/393 and 88/88): demo-press w 40 with wSets [40,35]; D1 and D2 completed on that card; on D2 the real panel renders the earn card with set loads ["45 lb","40 lb"] (Set 1, Set 2); its Yes click saves exactly one accept whose issuance target vector renders to exactly that text in that order and whose reason is the rendered one; the queued native entry carries newWSets [45,40]. Under the mutant the card renders ["40 lb","45 lb"] while [45,40] is saved', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const base = day => withPress(day, { w: 40, wSets: [40, 35] });
  const first = await dayEntryWith(era, D1, base(D1));
  assert.equal((await train(first.entry)).finished.ok, true);
  first.entry.gymHost.close();
  const { entry } = await dayEntryWith(era, D2, base(D2));
  assert.equal((await train(entry)).finished.ok, true);
  const doc = await r30Open(entry);
  await r30Check(entry, doc);
  const card = r30Card(doc, 'demo-press', 'earn');
  assert.deepEqual(r30Shown(card).loads, ['45 lb', '40 lb'], 'the per-set vector is rendered in set order ' + JSON.stringify(r30Shown(card).loads));
  assert.deepEqual(qa(card, 'li').map(x => x.textContent.trim()), ['Set 1: 45 lb', 'Set 2: 40 lb'], 'each set is labelled with its own load');
  const { issuance } = await r30Agree(era, entry, card, 'vector: ');
  assert.deepEqual(r26Values(issuance.body.target_load.vector), [45, 40]);
  assert.deepEqual((await r30Press(era, D2, base(D2))).queue.filter(x => !x.done).map(x => x.newWSets), [[45, 40]], 'the queued target is the rendered one (:151)');
  entry.gymHost.close(); era.close();
});
// L20-B5, -B6, -B7: an adoption agreed on the real panel, then its Undo rendered by the same panel (Check next weight clicked again).
const r30Undo = async (patch, done, M) => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const base = withPress(D1, patch), { entry } = await dayEntryWith(era, D1, base);
  assert.equal((await train(entry, 12, '1', { loadFor: { 'demo-press': done } })).finished.ok, true);
  const doc = await r30Open(entry);
  await r30Check(entry, doc);
  const adoption = await r30Agree(era, entry, r30Card(doc, 'demo-press', patch.w === null ? 'adopt-baseline' : 'adopt-observed'), M + 'adoption: ');
  await r30Check(entry, doc);
  const card = r30Card(doc, 'demo-press', 'compensate'), shown = r30Shown(card);
  const undo = await r30Agree(era, entry, card, M + 'Undo: ');
  const after = await r30Press(era, D1, base);
  entry.gymHost.close(); era.close();
  return { adoption, shown, undo, after };
};
test('R30-L20B5-DOM-UNDO-REASON [Y] (spec :102 "reason is the engine-produced native explanation"; :139 "Native explanation is produced in FC01 ... The displayed reason and vector are part of the issuance checked at yes"; :149 "checks the ENTIRE issued body/reason/producer"; :153 compensation; Astra L20-B5, mutant L20-M03 "offer.kind === \'compensate\' ? \'\' : offer.reason" in the rendered reason at today-entry.mjs:284, which survived 393/393 and 88/88): demo-press working weight 40, D1 completed at 45; on the real panel the adopt-observed Yes, then the rendered Undo card: its rendered explanation is exactly the nonempty issuance.reason saved by its Yes click, its set loads render ["40 lb","40 lb"], and the Undo restores w 40. Under the mutant the Undo card renders an empty explanation while the full sentence is saved', async () => {
  const r = await r30Undo({ w: 40 }, 45, 'undo reason: ');
  assert.ok(r.shown.reason.length > 0, 'the Undo card renders its explanation ' + JSON.stringify(r.shown.reason));
  assert.equal(r.shown.reason, r.undo.issuance.reason, 'the rendered Undo explanation is the saved one (:139)');
  assert.deepEqual(r.shown.loads, ['40 lb', '40 lb']);
  assert.equal(r.after.press.w, 40, 'the Undo restores w 40');
});
test('R30-L20B6-DOM-ZERO-IS-A-LOAD [Y] (spec :110 base_load "Load is existing {value,unit:\'lb\'} ... vector null positions mean not prescribed" (a numeric 0 is a Load); :111 target_load "Only compensation may restore original null/unprescribed positions, with the target effect\'s prior FieldImage"; :139 "The displayed reason and vector are part of the issuance checked at yes"; Astra L20-B6, mutant L20-M04 "!load ? NATIVE_LOAD_PROPOSED_COPY.noWeight" at today-entry.mjs:283, which survived 393/393 and 88/88): demo-press working weight 0, D1 completed at 5; on the real panel the adopt-observed card renders ["5 lb","5 lb"] and its Yes stores 5; the rendered Undo card shows ["0 lb","0 lb"] (0 is a load, never "No working weight"), equal to the target vector [0,0] saved by its Yes click, and the Undo restores w 0. Under the mutant the Undo card renders "No working weight" twice while [0,0] is saved', async () => {
  const r = await r30Undo({ w: 0 }, 5, 'zero restore: ');
  assert.deepEqual(r.adoption.shown.loads, ['5 lb', '5 lb']);
  assert.deepEqual(r.shown.loads, ['0 lb', '0 lb'], 'zero is rendered as 0 ' + JSON.stringify(r.shown.loads));
  assert.deepEqual(r26Values(r.undo.issuance.body.target_load.vector), [0, 0]);
  assert.equal(r.after.press.w, 0, 'the Undo restores w 0');
});
test('R30-L20B7-DOM-NULL-POSITIONS-KEPT [Y] (spec :110 base_load "vector:[LoadOrNull] ... vector null positions mean not prescribed"; :111 "Only compensation may restore original null/unprescribed positions"; :138 "Display the chosen full vector"; :139 "current/target load per set ... The displayed reason and vector are part of the issuance checked at yes"; Astra L20-B7, mutant L20-M05 "offer.loads.filter(load => load !== null)" at today-entry.mjs:283, which survived 393/393 and 88/88): demo-press with no working weight (w null), D1 completed at 45; on the real panel the adopt-baseline card renders ["45 lb","45 lb"] and its Yes stores 45; the rendered Undo card shows one "No working weight" position per set (two), equal to the target vector [null,null] saved by its Yes click, and the Undo restores w null. Under the mutant the Undo card renders no set at all while [null,null] is saved', async () => {
  const r = await r30Undo({ w: null }, 45, 'null restore: ');
  assert.deepEqual(r.adoption.shown.loads, ['45 lb', '45 lb']);
  assert.deepEqual(r.shown.loads, [PROPOSED().noWeight, PROPOSED().noWeight], 'every null position is rendered ' + JSON.stringify(r.shown.loads));
  assert.deepEqual(r26Values(r.undo.issuance.body.target_load.vector), [null, null]);
  assert.equal(r.after.press.w, null, 'the Undo restores w null');
});
test('R30-L20B10-DOM-NOT-NOW-WRITES-NOTHING [Y] (spec :60 "No ... automatic acceptance of an offer"; :97 "answer=\'accept\'|\'decline\'"; :101 "Native decline/Not now and cancel only dismiss the view, writing NO operation and spending nothing ... A later manual check can offer again, with a new yes required"; Astra L20-B10, mutant L20-M06 "api.decline(offer.proposalId) -> api.accept(offer.proposalId)" on the Not now click at today-entry.mjs:288, which survived 393/393 and 88/88): demo-press working weight 40, D1 completed at 45 on both sets; the real panel renders the adopt-observed card ["45 lb","45 lb"]; a click on its actual Not now button writes ZERO responses and ZERO operations, the next projection keeps w 40 with no native entry, and a later Check next weight renders the same adoption again. Under the mutant the click saves one accept and w becomes 45', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const base = withPress(D1, { w: 40 }), { entry } = await dayEntryWith(era, D1, base);
  assert.equal((await train(entry, 12, '1', { loadFor: { 'demo-press': 45 } })).finished.ok, true);
  const doc = await r30Open(entry);
  await r30Check(entry, doc);
  const card = r30Card(doc, 'demo-press', 'adopt-observed'), no = q(card, '[data-native-load="decline"]');
  assert.deepEqual(r30Shown(card).loads, ['45 lb', '45 lb']);
  assert.equal(no.textContent.trim(), TodayEntry.NATIVE_LOAD_COPY.decline, 'the actual Not now button');
  const ops = (await opsOf(era)).length;
  no.click();
  await entry.nativeLoad.settled();
  const written = [(await responsesOf(era)).length, (await opsOf(era)).length - ops];
  await r30Check(entry, doc);
  const again = qa(doc, '[data-native-load="offer"]').filter(c => c.getAttribute('data-lift') === 'demo-press').map(c => [c.getAttribute('data-kind'), r30Shown(c).loads]);
  const after = await r30Press(era, D1, base);
  assert.deepEqual([...written, after.press.w, after.queue.length], [0, 0, 40, 0], 'Not now writes nothing: 0 responses, 0 operations, w 40, no native entry');
  assert.deepEqual(again, [['adopt-observed', ['45 lb', '45 lb']]], 'a later manual check offers the same adoption again (:101)');
  entry.gymHost.close(); era.close();
});
// L20-B1 (product; the FIX is builder P's, round 30): RED on the round 29b bytes (bd7654a plus FC03 b7d90a15). The row pins the
// specified outcome only: no adoption is minted over a configuration working weight, and any offer that IS returned and acknowledged
// must survive into the next projection. R28B-CONFIGURATION-CAPTURE (FC12) is not edited here.
test('R30-L20B1-HOST-CONFIGURATION-NO-ADOPTION [Y] (spec :156 (c3) "By kind: \'earn\' and \'adopt-observed\' need a numeric w (a configuration or null w is underivable for them); \'adopt-baseline\' needs w null or ABSENT"; :110 base_load "Load is existing {value,unit:\'lb\'} or typed configuration, never an inferred magnitude"; :139 "The displayed reason and vector are part of the issuance checked at yes"; :172 "Return acknowledged:true only after the existing durable commit"; Astra L20-B1 at E/native-load.cjs:254-264 versus :499-502 and L/today-bindings.mjs:725; PM ruling DECISIONS:856 (1)): demo-press working weight the configuration \'BW\', D1 completed at 45 on both sets, the durable host on D1: check() on demo-press shows NO offer (c3), and any offer it does show whose yes is acknowledged survives into the next projection (w is the acknowledged target, no NATIVE_LOAD_RECORD_INVALID). On the round 29b bytes the check offers adopt-observed [45,45] with no current load on either set, its yes is acknowledged, and the next projection has w null and RECORD_INVALID base_load', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const base = withPress(D1, { w: 'BW' }), one = await dayEntryWith(era, D1, base);
  const card = await one.entry.gym.read();
  assert.deepEqual([card.phase, card.lift.id, card.entry.load], ['ready', 'demo-press', null], 'fixture: the BW card opens with no numeric load');
  assert.equal((await train(one.entry, 12, '1', { loadFor: { 'demo-press': 45 } })).finished.ok, true);
  one.entry.gymHost.close();
  const host = await era.createNativeLoadHost({ day: D1, engineState: base }), c = await host.check(r27Req(await host.project()));
  const shown = c.offers.filter(o => o.lift === 'demo-press'), lost = [];
  if (shown.length) {
    const o = shown[0], yes = await host.respond({ handle: o.handle, proposal_id: o.proposalId, answer: 'accept' });
    if (yes.acknowledged === true) {
      const t = (await r26Issued(era, yes.op_id)).body.target_load.scalar, target = t && typeof t === 'object' && 'value' in t ? t.value : t;
      const after = await host.project(), w = after.state.exercises.find(e => e.id === 'demo-press').w;
      const invalid = after.issues.filter(i => i.code === 'NATIVE_LOAD_RECORD_INVALID').map(i => [i.code, i.field]);
      if (w !== target || invalid.length) lost.push({ acknowledged: true, target, status: after.status, w, invalid, spent: Array.isArray(after.spent) ? after.spent.length : after.spent });
    }
  }
  host.close(); era.close();
  assert.deepEqual({ offers: shown.map(o => [o.kind, o.current, o.loads]), lost }, { offers: [], lost: [] }, 'c3: no adoption over a configuration w, and no acknowledged yes is lost ' + JSON.stringify({ status: c.status, refusal: c.refusal }));
});
