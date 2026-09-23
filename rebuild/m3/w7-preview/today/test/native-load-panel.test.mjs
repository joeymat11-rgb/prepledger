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
async function train(entry, reps = 12, effort = '1', { start = true, load: entered = null } = {}) {
  const gym = entry.gym;
  const reserve = gym.effortChoices().find(c => c.label === effort).reserve;
  if (start) { const started = await gym.start(); assert.equal(started.ok, true, 'start ' + started.code); }
  for (let guard = 0; guard < 20; guard++) {
    const view = await gym.read();
    if (view.phase === 'saved') { if (view.complete) break; gym.forget(); continue; }
    if (view.phase !== 'active') break;
    const logged = await gym.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
      load: String(view.entry.load === null && entered !== null ? entered : view.entry.load), reps: String(reps), effort: reserve });
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
  assert.equal(card.phase, 'ready', card.code || '');
  assert.notEqual(card.lift.id, 'demo-press', 'disputed 45 is never current advice: demo-press is left off the card');
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
  assert.equal(card.lift.id, 'demo-row', 'the rest of the day is prescribed');
  assert.match(card.prescription.line, /^40 lb/);
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
