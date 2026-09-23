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
async function train(entry, reps = 12, effort = '1') {
  const gym = entry.gym;
  const reserve = gym.effortChoices().find(c => c.label === effort).reserve;
  const started = await gym.start();
  assert.equal(started.ok, true, 'start ' + started.code);
  for (let guard = 0; guard < 20; guard++) {
    const view = await gym.read();
    if (view.phase === 'saved') { if (view.complete) break; gym.forget(); continue; }
    if (view.phase !== 'active') break;
    const logged = await gym.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
      load: String(view.entry.load), reps: String(reps), effort: reserve });
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
