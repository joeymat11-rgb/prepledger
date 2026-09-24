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
test('N29 MISSED-DEBUT [Y] (spec R9.6 :152, D1 N29): yes Q45; D3 captures the 45 debut card and demo-press is lifted at 40 -> no landing, demo-press held, the D4 capture is the baseline ask (never 45 again); the D3 check offers adopt-baseline [40, 40]; Undo of Q45 refuses COMPENSATION_DESCENDANTS; the yes -> the next card is 40', async () => {
  const fault = faultDatabase(), era = await reopenAt(fault, D1);
  hostGate(era);
  const entry = await yesTo(era, 'demo-press');
  entry.gymHost.close(); era.close();
  const again = await reopenAt(fault, D3), three = await dayEntry(again, D3);
  assert.match((await three.entry.gym.read()).prescription.line, /^45 lb/, 'control: the debut card');
  assert.equal((await train(three.entry, 12, '1', { loadFor: { 'demo-press': 40 } })).finished.ok, true);
  await three.entry.nativeLoad.settled();
  const host = await again.createNativeLoadHost({ day: D3, engineState: basisFor(D3) }), p = await host.project();
  assert.ok(p.issues.some(i => i.code === 'NATIVE_LOAD_DEBUT_BASIS_UNPROVEN' && i.reason === 'missed_target' && i.lift === 'demo-press' && !i.superseded_by), JSON.stringify(p.issues));
  assert.equal(pressOf(p).w, null, 'held: the baseline ask');
  assert.deepEqual(nativeQueue(p.state, 'demo-press'), [], 'the 45 target is hidden');
  const yes = (await responsesOf(again))[0].payload.issuance.body;
  const d3 = p.lifts.find(l => l.lift_lineage_id === 'demo-press').completion_op_id;
  const undo = await host.check({ lift_lineage_id: 'demo-press', completion_op_id: d3, intent: { compensate: yes.spend_id } });
  assert.deepEqual([undo.status, undo.refusal && undo.refusal.code], ['refused', 'NATIVE_LOAD_COMPENSATION_DESCENDANTS']);
  host.close();
  const four = await dayEntry(again, D4), slots = await slotsOf(four.entry, D4);
  assert.ok(slots.filter(s => s.lift_lineage_id === 'demo-press').every(s => s.load.state === 'not_prescribed'), 'D4: the baseline ask, never 45');
  four.entry.gymHost.close();
  await three.entry.nativeLoad.check();
  const offer = three.entry.nativeLoad.view().offers.find(o => o.lift === 'demo-press');
  assert.ok(offer, 'the missed completion is exit-eligible ' + JSON.stringify(three.entry.nativeLoad.view().refusals));
  assert.deepEqual([offer.kind, offer.loads], ['adopt-baseline', [40, 40]]);
  assert.equal((await three.entry.nativeLoad.accept(offer.proposalId)).acknowledged, true);
  three.entry.gymHost.close(); again.close();
  const later = await reopenAt(fault, D4), five = await dayEntry(later, D4), view = await five.entry.gym.read();
  assert.equal(view.phase, 'ready', view.code || '');
  assert.equal(view.lift.id, 'demo-press'); assert.match(view.prescription.line, /^40 lb/, 'the adopted 40');
  five.entry.gymHost.close(); later.close();
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
