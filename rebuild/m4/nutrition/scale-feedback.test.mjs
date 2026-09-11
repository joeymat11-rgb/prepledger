import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire, Module } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { webcrypto } from 'node:crypto';
import { projectScaleFeedback } from './scale-feedback.mjs';
import { Client, config } from '../../m3/w6/test/support.mjs';
import { openTodayInstallation } from '../../m3/w6/local/today-bindings.mjs';
import { createLocalCalendar } from '../../m3/w6/local/calendar.mjs';
import { createGymModel, EFFORT_CHOICES } from '../../m3/w7-preview/today/gym-model.mjs';
import Athlete from '../workout/athlete-state.cjs';
import Engine from '../../engine/index.cjs';
import Source from '../../m3/w5/source/codec.cjs';
const require = createRequire(import.meta.url), { IDBFactory } = require('fake-indexeddb');
const cfg = config(), base = 'ca57649b3cc9189dca8d006ceb6bac17c842bea6';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const effective = (day = '2026-09-11', time = '08:00', offset = '+00:00') => ({ local_date: day, local_time: time, utc_offset: offset });
let serial = 0;
function reading({ day, time, offset, value = 170, kind = 'fact', target, parents = [], predecessor = null, device = 'dev-A', seq, payload } = {}) {
  const n = ++serial;
  return Client.ops.build({ op_id: `scale-${n}`, athlete_id: 'ath-1', device_id: device, device_seq: seq ?? n,
    predecessor, parents, kind, class: 'reading', target, lease_id: cfg.lease.lease_id, effective: effective(day, time, offset),
    payload: payload ?? (kind === 'fact' ? { lb: { value, unit: 'lb' } } : kind === 'tombstone' ? { reason: 'synthetic removal' } : { replacement_fields: { lb: { value, unit: 'lb' } } }),
  }, cfg.identityKey);
}
function generation(accepted = [], local = [], unresolved = [], rejected = []) {
  const operations = [...accepted, ...local, ...unresolved, ...rejected], receipts = accepted.map((op, i) => ({ seq: i + 1, op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment }));
  return { collections: { ops: Object.fromEntries(operations.map(op => [op.op_id, op])),
    receipts: Object.fromEntries(receipts.map(row => [row.seq, row])),
    dispositions: Object.fromEntries([...receipts.map(row => [row.op_id, { op_id: row.op_id, canonical_content_commitment: row.canonical_content_commitment, status: 'ACCEPTED', athlete_log_seq: row.seq }]),
      ...rejected.map(op => [op.op_id, { op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment, status: 'REJECTED' }])]),
    outbox: Object.fromEntries(local.map(op => [op.op_id, { op_id: op.op_id }])), rejected: Object.fromEntries(rejected.map(op => [op.op_id, { op_id: op.op_id, commitment: op.canonical_content_commitment, status: 'REJECTED' }])), sync: { frontier: { W: accepted.length } },
  }, metadata: { wireProofs: { pull: { fixture: { receipts: receipts.map((row, i) => ({ ...row, op: accepted[i] })) } } } } };
}
const project = (g, asOf = effective('2026-12-31', '23:59')) => projectScaleFeedback({ generation: g, athleteId: 'ath-1', deviceId: 'dev-A', asOf });
const reasons = layer => layer.exclusions.map(row => row.reason);
test('actual T2 envelopes: empty, first eligible, first late then eligible; no model or numeric prior', () => {
  assert.equal(project(generation()).local.baseline, null);
  const a = reading({ value: 171 }), late = reading({ day: '2026-09-10', time: '12:00', value: 190 });
  const view = project(generation([], [late, a]));
  assert.equal(view.local.baseline.value, 171); assert.equal(view.local.smoothedWeight.value, 171);
  assert.equal(view.local.scaleRate, null); assert.equal(view.local.fatRate, null);
  assert.deepEqual(reasons(view.local), ['AFTER_NOON']); assert.equal(view.accepted.baseline, null);
  assert.equal(view.readingHistory.records[0].original.payload.lb.value, 190);
});
test('existing damped update and threshold: a spike is clamped, one reading never proves rate', () => {
  const a = reading({ value: 170 }), b = reading({ day: '2026-09-12', value: 180 });
  const v = project(generation([], [a, b])).local;
  assert.equal(v.smoothedWeight.value, 170.4); assert.equal(v.scaleRate, null);
});
test('accepted and local correction, rejected correction, conflict and unsupported time reclassification', () => {
  const a = reading(), b = reading({ kind: 'correction', target: a.op_id, parents: [a.op_id], value: 172 });
  const c = reading({ kind: 'correction', target: a.op_id, parents: [a.op_id, b.op_id], value: 173 });
  let v = project(generation([a, b], [c])); assert.equal(v.accepted.baseline.value, 172); assert.equal(v.local.baseline.value, 173);
  assert.deepEqual(v.local.observations[0].effective, a.effective);
  v = project(generation([a, b], [], [], [c])); assert.equal(v.local.baseline.value, 172);
  const concurrent = reading({ kind: 'correction', target: a.op_id, parents: [a.op_id], value: 174 });
  v = project(generation([a, b], [concurrent])); assert.equal(v.local.baseline, null); assert(v.readingHistory.records[0].local.issues.includes('READING_CONCURRENT_EDITS'));
  const reclass = reading({ kind: 'reclassification', target: a.op_id, parents: [a.op_id], payload: { effective: effective('2026-09-11', '13:00') } });
  v = project(generation([a], [reclass])); assert.equal(v.local.baseline, null); assert(v.readingHistory.records[0].local.issues.includes('READING_EFFECT_UNSUPPORTED'));
});
test('removing first, later, and all observations refolds from surviving facts', () => {
  const a = reading({ value: 170 }), b = reading({ day: '2026-09-12', value: 172 });
  const remove = target => reading({ kind: 'tombstone', target: target.op_id, parents: [target.op_id] });
  const ra = remove(a), rb = remove(b);
  assert.equal(project(generation([a, b], [ra])).local.baseline.value, 172);
  assert.equal(project(generation([a, b], [rb])).local.smoothedWeight.value, 170);
  const v = project(generation([a, b], [ra, rb])); assert.equal(v.local.baseline, null); assert.equal(v.accepted.baseline.value, 170);
});
test('repeats have no invented winning reading; unaffected next day still seeds', () => {
  const a = reading(), b = reading({ time: '09:00' }), c = reading({ day: '2026-09-12', value: 175 });
  const v = project(generation([], [a, b, c])).local;
  assert.equal(v.baseline.value, 175); assert.deepEqual(reasons(v), ['DAILY_READING_RESOLUTION_REQUIRED', 'DAILY_READING_RESOLUTION_REQUIRED']);
});
test('unresolved and rejected originals cannot seed; invalid effective context remains visible', () => {
  const a = reading(), b = reading({ day: '2026-09-12' }), c = reading({ day: '2026-09-13', time: 'missing' });
  const v = project(generation([], [c], [a], [b]));
  assert.equal(v.local.baseline, null); assert.deepEqual(new Set(reasons(v.local)), new Set(['READING_RESOLUTION_REQUIRED', 'READING_REJECTED', 'SCALE_EFFECTIVE_CONTEXT_REQUIRED']));
  assert.equal(v.readingHistory.records.length, 3);
});
test('as-of uses retained offset and time, including DST fold and noon boundary', () => {
  const a = reading({ day: '2026-11-01', time: '01:30', offset: '-04:00' });
  assert.equal(project(generation([], [a]), effective('2026-11-01', '01:15', '-05:00')).local.baseline.value, 170);
  assert.equal(project(generation([], [a]), effective('2026-11-01', '01:15', '-04:00')).local.baseline, null);
  const b = reading({ day: '2026-09-12', time: '11:59:59', offset: '+14:00' });
  assert.equal(project(generation([], [b]), effective('2026-09-11', '22:00', '+00:00')).local.baseline.value, 170);
  const c = reading({ day: '2026-09-12', time: '12:00', offset: '+14:00' });
  assert.deepEqual(reasons(project(generation([], [c])).local), ['AFTER_NOON']);
});
test('source-import intent remains an explicit blackout mapping gap, never a fabricated seal', () => {
  const a = reading();
  const expected = Source.frontier(() => undefined, 0);
  const material = Source.prepareMaterial('synthetic-source', { source_json: '{}', candidate_json: '{}', local_json: null,
    checkpoint_json: JSON.stringify({ revision: 1, token: 'synthetic-checkpoint', generation: { collections: { sync: { frontier: { W: 0, authorityW: 0 } } }, metadata: {} } }),
    engine_context_json: '{}' }, expected);
  const intent = Client.ops.build({ op_id: 'import-intent', athlete_id: 'ath-1', device_id: 'dev-A', device_seq: 100, kind: 'fact', class: 'event', lease_id: cfg.lease.lease_id,
    effective: effective(), payload: { type: 'source-import-intent', interval: { start: '2026-01-01', end: '2026-09-11' }, source_id: 'synthetic-source', material_digest: material.manifest.material_digest } }, cfg.identityKey);
  Source.intent(intent, 'activate', material.manifest.source_id, material.manifest.material_digest);
  const v = project(generation([], [a, intent])); assert.equal(v.local.baseline, null); assert.deepEqual(reasons(v.local), ['SCALE_SOURCE_BLACKOUT_MAPPING_REQUIRED']);
});
test('a later same-day observation is actually excluded as-of, not counted as a present repeat', () => {
  const a = reading(), b = reading({ time: '09:00' });
  const v = project(generation([], [a, b]), effective('2026-09-11', '08:30')).local;
  assert.equal(v.baseline.sourceOpId, a.op_id); assert.deepEqual(reasons(v), ['READING_AFTER_AS_OF']);
});
test('ten eligible actual readings yield scale-only regression and uncertainty with no lean model', () => {
  const rows = Array.from({ length: 10 }, (_, i) => reading({ day: `2026-09-${String(i + 1).padStart(2, '0')}`, value: 180 - i }));
  const v = project(generation([], rows)).local;
  assert.equal(v.scaleRate.scale, 7); assert.equal(v.scaleRate.method, 'regression'); assert.equal(v.scaleRate.n, 10); assert.equal(v.scaleRate.ci, 0); assert.equal(v.fatRate, null);
  assert.equal(project(generation([], rows.slice(0, 9))).local.scaleRate, null);
});
test('native regression retains the exact legacy midnight calendar through DST', () => {
  const rows = Array.from({ length: 10 }, (_, i) => {
    const day = new Date(Date.UTC(2026, 9, 26 + i)).toISOString().slice(0, 10);
    return reading({ day, offset: day < '2026-11-01' ? '-04:00' : '-05:00', value: 180 - i / 3 + Math.cos(i) });
  });
  const v = project(generation([], rows)).local, current = Engine.createEngine({ clock });
  const { unit, direction, ...nativeRate } = v.scaleRate;
  const { fat, ...legacyRate } = current.currentRate({ reads: rows.map(op => ({ d: op.effective.local_date, w: op.payload.lb.value })), model: { drip: 0 } });
  assert.deepEqual(nativeRate, legacyRate);
  assert.deepEqual(v.calculationCalendar.coordinates.map(row => row.midnightMs), rows.map(op => current.mk(op.effective.local_date).getTime()));
});
test('as-of is an observation cutoff with current edits, not an invented historical knowledge snapshot', () => {
  const a = reading(), correction = reading({ day: '2026-10-01', kind: 'correction', target: a.op_id, parents: [a.op_id], value: 175 });
  const v = project(generation([a, correction]), effective('2026-09-12')).accepted;
  assert.equal(v.baseline.value, 175); assert.deepEqual(v.observations[0].effective, a.effective);
  assert.deepEqual(v.observations[0].effectIds, [correction.op_id]);
});

const clock = { today: () => '2026-09-11', hour: () => 8, nowMs: () => 0, now: () => new Date('2026-09-11T08:00:00Z') };
function oldFactory(name) {
  const filename = fileURLToPath(new URL(`../../engine/${name}.cjs`, import.meta.url));
  const source = execFileSync('git', ['show', `${base}:rebuild/engine/${name}.cjs`], { cwd: root, encoding: 'utf8' });
  const mod = new Module(filename); mod.filename = filename; mod.paths = Module._nodeModulePaths(root); mod._compile(source, filename); return mod.exports;
}
test('legacy currentRate exact configured-state parity, including 28 cap, weekly fallback, prior and missing-model failure', () => {
  const current = Engine.createEngine({ clock }), old = oldFactory('energy')(current, { clock });
  for (const n of [0, 1, 9, 10, 28, 35]) for (const drip of [0, 0.25, -0.1]) for (const weekly of [[], [{ wk: '2026-08-01', trend: 180 }, { wk: '2026-08-08', trend: 178 }, { wk: '2026-08-15', trend: 177 }]]) {
    const reads = Array.from({ length: n }, (_, i) => ({ d: new Date(Date.UTC(2026, 9, 10 + i)).toISOString().slice(0, 10), w: 180 - i / 5 + Math.sin(i), ...(i === 5 ? { sealed: true } : {}), ...(i === 7 ? { offWindow: true } : {}) }));
    const state = { reads, weekly, model: { drip } };
    assert.equal(JSON.stringify(current.currentRate(state)), JSON.stringify(old.currentRate(state)));
  }
  const state = { reads: Array.from({ length: 10 }, (_, i) => ({ d: `2026-09-${String(i + 1).padStart(2, '0')}`, w: 180 - i })) };
  assert.throws(() => old.currentRate(state), TypeError, 'executed pre-change missing model failure');
  assert.throws(() => current.currentRate(state), TypeError, 'legacy fat-rate API remains unchanged; scale-only caller uses shared calculation');
});
test('legacy applyRead complete public output parity across sealed/late/duplicate/spike/trained cases', () => {
  const current = Engine.createEngine({ clock }), old = oldFactory('writers')(current, { clock });
  for (const trend of [170, 170.05]) for (const weight of [169, 170, 171.5, 190]) for (const sealed of [false, true]) for (const hour of [8, 12]) for (const trained of [false, true]) {
    const state = { trend, blackout: { until: sealed ? '2026-09-12' : '2026-09-10' }, reads: [], feed: [], dailyLogs: {}, sessionLog: trained ? { '2026-09-11': { entries: [] } } : {} };
    const before = JSON.stringify(state);
    assert.deepEqual(current.applyRead(state, '2026-09-11', weight, { hour }), old.applyRead(state, '2026-09-11', weight, { hour }));
    assert.equal(JSON.stringify(state), before);
    state.reads.push({ d: '2026-09-11', w: 160 }); assert.deepEqual(current.applyRead(state, '2026-09-11', weight), state);
  }
});

const setup = { athlete_label: 'synthetic-scale', split: { from: '2026-09-11', map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'REST', 5: 'U', 6: 'REST' } }, exercises: [{ id: 'synthetic-press', n: 'Synthetic press', mg: 'chest', day: 'U', sets: 1, hi: 10, inc: 5, steps: [20, 25, 30, 35, 40, 45] }], priority_muscles: [] };
async function journey({ readingFirst = false, dropCache = false, sameTimestamp = false } = {}) {
  const indexedDB = new IDBFactory(), state = Athlete.createCleanInitState({ setup });
  let now = '2026-09-11T08:00:00Z';
  const calendar = createLocalCalendar({ now: () => new Date(now), offsetMinutes: () => 0 });
  const open = () => openTodayInstallation({ indexedDB, crypto: webcrypto, day: '2026-09-11', calendar, cleanInit: state });
  let era = await open(), h = await era.createGymHost({ day: '2026-09-11', engineState: state, plannedSplitSlotId: 'synthetic/2026-09-11' });
  let r = await era.createReadingHost({ day: '2026-09-11' });
  const m = createGymModel({ gymHost: h, sessionTitle: 'Synthetic' });
  const save = async () => { const result = await r.weighIn({ date: '2026-09-11', lb: 170 }); assert.equal(result.ok, true); };
  if (readingFirst) { await save(); if (!sameTimestamp) now = '2026-09-11T09:00:00Z'; }
  assert.equal((await m.start()).ok, true); let v = await m.read();
  assert.equal((await m.logSet({ startId: v.startId, slot: v.set.slot, lift: v.set.lift, load: '40', reps: '10', effort: EFFORT_CHOICES.find(x => x.label === '2').reserve })).ok, true);
  assert.equal((await m.finish({ startId: v.startId })).ok, true);
  if (!readingFirst) { if (!sameTimestamp) now = '2026-09-11T09:00:00Z'; await save(); }
  const loaded = await r.repository.load(), initial = structuredClone(loaded.generation);
  if (dropCache) { const g = structuredClone(initial); delete g.collections.derived; await r.repository.commit(loaded, g, null); }
  const sample = Object.values(initial.collections.ops).find(op => op.class === 'reading');
  const args = { athleteId: sample.athlete_id, deviceId: sample.device_id, asOf: effective('2026-09-11', '10:00') };
  const before = projectScaleFeedback({ ...args, generation: initial });
  r.close(); h.close(); era.close(); era = await open(); r = await era.createReadingHost({ day: '2026-09-11' });
  const after = projectScaleFeedback({ ...args, generation: (await r.repository.load()).generation });
  assert.deepEqual(after, before); r.close(); era.close();
  return { view: after, generation: initial, args };
}
test('real C4 producers: prior completion excludes reading; earlier reading survives later close; reopen/cache loss stable', async () => {
  for (const dropCache of [false, true]) for (const readingFirst of [false, true]) {
    const { view } = await journey({ readingFirst, dropCache });
    assert.equal(view.local.baseline?.value ?? null, readingFirst ? 170 : null);
    assert.deepEqual(reasons(view.local), readingFirst ? [] : ['AFTER_COMPLETED_TRAINING']);
  }
});
test('real C4 same timestamp uses authenticated device predecessor order in both directions', async () => {
  for (const readingFirst of [false, true]) {
    const { view } = await journey({ readingFirst, sameTimestamp: true });
    assert.equal(view.local.baseline?.value ?? null, readingFirst ? 170 : null);
    assert.deepEqual(reasons(view.local), readingFirst ? [] : ['AFTER_COMPLETED_TRAINING']);
  }
});
test('real C4 empty and first-late-then-eligible path creates no body model or legacy receipts', async () => {
  const indexedDB = new IDBFactory(), state = Athlete.createCleanInitState({ setup });
  let now = '2026-09-11T13:00:00Z';
  const calendar = createLocalCalendar({ now: () => new Date(now), offsetMinutes: () => 0 });
  const era = await openTodayInstallation({ indexedDB, crypto: webcrypto, calendar, day: '2026-09-11', cleanInit: state });
  let r = await era.createReadingHost({ day: '2026-09-11' });
  const first = await r.repository.load();
  const lease = first.generation.metadata.authorityLease;
  const args = { athleteId: lease.athlete_id, deviceId: lease.device_id, asOf: effective('2026-09-12', '10:00') };
  assert.equal(projectScaleFeedback({ ...args, generation: first.generation }).local.baseline, null);
  assert.equal((await r.weighIn({ date: '2026-09-11', lb: 180 })).ok, true);
  r.close(); now = '2026-09-12T08:00:00Z'; r = await era.createReadingHost({ day: '2026-09-12' });
  assert.equal((await r.weighIn({ date: '2026-09-12', lb: 170 })).ok, true);
  const g = (await r.repository.load()).generation, original = structuredClone(g);
  const v = projectScaleFeedback({ ...args, generation: g }); assert.equal(v.local.baseline.value, 170); assert.equal(v.local.smoothedWeight.value, 170);
  assert.deepEqual(reasons(v.local), ['AFTER_NOON']); assert.deepEqual(g, original); assert.equal(state.model, undefined);
  assert.equal(Object.values(g.collections.ops).filter(op => op.class === 'reading').length, 2);
  assert(Object.isFrozen(v.local.observations)); assert.throws(() => { v.local.baseline.value = 0; }, TypeError);
  r.close(); era.close();
});
test('actual workout output plus actual T2 envelope controls: missing, contradictory and cross-device chronology', async () => {
  const { generation: original, args } = await journey();
  const operations = Object.values(original.collections.ops).sort((a, b) => a.device_seq - b.device_seq);
  const weight = operations.find(op => op.class === 'reading'), close = operations.find(op => op.kind === 'session-close');
  assert.deepEqual(weight.causal_parents, []); assert.equal(weight.device_predecessor_op_id, close.op_id);
  const missing = structuredClone(original); delete missing.collections.outbox[close.op_id];
  assert.deepEqual(reasons(projectScaleFeedback({ ...args, generation: missing }).local), ['SCALE_TRAINING_INTERPRETATION_REQUIRED']);
  const disconnected = Client.ops.build({ op_id: 'disconnected-reading', athlete_id: args.athleteId, device_id: args.deviceId,
    device_seq: weight.device_seq + 1, predecessor: 'unavailable-predecessor', parents: [], kind: 'fact', class: 'reading',
    lease_id: weight.lease_id, effective: weight.effective, payload: weight.payload }, cfg.identityKey);
  assert.deepEqual(reasons(projectScaleFeedback({ ...args, generation: generation([], [...operations.filter(op => op !== weight), disconnected]) }).local), ['SCALE_TRAINING_CHRONOLOGY_REQUIRED']);
  const remote = Client.ops.build({ op_id: 'remote-reading', athlete_id: args.athleteId, device_id: 'remote-device', device_seq: 1,
    parents: [], kind: 'fact', class: 'reading', lease_id: weight.lease_id, effective: weight.effective, payload: weight.payload }, cfg.identityKey);
  const accepted = generation([...operations.filter(op => op !== weight), remote]);
  assert.deepEqual(reasons(projectScaleFeedback({ ...args, generation: accepted }).accepted), ['SCALE_TRAINING_CHRONOLOGY_REQUIRED']);
  const backdated = Client.ops.build({ op_id: 'backdated-reading', athlete_id: args.athleteId, device_id: args.deviceId, device_seq: weight.device_seq,
    predecessor: close.op_id, parents: [], kind: 'fact', class: 'reading', lease_id: weight.lease_id, effective: effective('2026-09-11', '07:00'), payload: weight.payload }, cfg.identityKey);
  assert.deepEqual(reasons(projectScaleFeedback({ ...args, generation: generation([], [...operations.filter(op => op !== weight), backdated]) }).local), ['SCALE_TRAINING_CHRONOLOGY_REQUIRED']);
});
test('shared native close correction/removal semantics keep accepted and local chronology separate', async () => {
  const { generation: original, args } = await journey();
  const operations = Object.values(original.collections.ops).sort((a, b) => a.device_seq - b.device_seq);
  const close = operations.find(op => op.kind === 'session-close'), last = operations.at(-1);
  const edit = (kind, payload) => Client.ops.build({ op_id: `scale-close-${kind}`, athlete_id: args.athleteId, device_id: args.deviceId,
    device_seq: last.device_seq + 1, predecessor: last.op_id, parents: [close.op_id], target: close.op_id, kind, class: 'session', schema_version: 2,
    lease_id: close.lease_id, effective: effective('2026-09-11', '10:00'), payload }, cfg.identityKey);
  const removal = edit('tombstone', { reason: 'synthetic close removed' });
  let v = projectScaleFeedback({ ...args, generation: generation(operations, [removal]) });
  assert.equal(v.local.baseline.value, 170); assert.equal(v.accepted.baseline, null); assert.deepEqual(reasons(v.accepted), ['AFTER_COMPLETED_TRAINING']);
  const correction = edit('correction', { replacement_fields: { completion_kind: 'early' } });
  v = projectScaleFeedback({ ...args, generation: generation(operations, [correction]) });
  assert.deepEqual(reasons(v.local), ['AFTER_COMPLETED_TRAINING']);
  const post = projectScaleFeedback({ ...args, asOf: effective('2026-09-11', '07:59'), generation: original });
  assert.deepEqual(reasons(post.local), ['READING_AFTER_AS_OF']);
});
