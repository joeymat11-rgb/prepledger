/* P3-LAYOUT-V2 - THE PROJECTOR CELLS. DECISIONS:522 says the v2 layout gets
   "byte-for-byte the same checks v1 gets (producer, basis, slots, day pool and
   order)". These two cells are that claim, driven rather than asserted: the
   SAME five tampers are applied to a real v1 layout and to a real v2 layout,
   through the ACCEPTED projector, and the refusal each one earns must be the
   same name in the same place.

   Nothing is stubbed. The capture is written by the page's own gym card on the
   real gym model; the layout resolver is the page's own
   (`gymHost.adapter.readLayout`, exactly what workout-host.mjs installs); the
   projector is rebuild/m4/workout/engine-history.cjs itself. Only the wrapper
   that corrupts the resolved layout belongs to this cell, and it corrupts the
   LAYOUT the resolver returned, never the stored capture.

   SYNTHETIC ONLY. Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { phone, reopen, phoneState, recordAWorkout } from '../p3-real-shape/real-shape-support.mjs';
import { PRODUCER } from '../../../m3/w6/local/today-bindings.mjs';
import { parseStrictJson } from '../../../m3/w6/strict-json.mjs';
import { projectWorkoutRecords } from '../../../m4/workout/project-history.mjs';

const require = createRequire(import.meta.url);
const Adapter = require('../../../m4/workout/engine-capture.cjs');
const Capture = require('../../../m4/workout/capture.cjs');
const Source = require('../../../m3/w5/source/codec.cjs');
const History = require('../../../m4/workout/engine-history.cjs');

const V1 = Object.freeze({ ...PRODUCER, rule_profile: Adapter.PROFILE });
const V2 = Object.freeze({ ...PRODUCER, rule_profile: Adapter.CONFIGURATION_PROFILE });
const WORKOUT_DAY = '2026-09-18';

/* The page's own capture reader, composed exactly as today-bindings.mjs
   composes it. */
const prescriptionCapture = Capture.createPrescriptionCapture({ parseStrictJson,
  profile: Capture.SOURCE_PROFILE, sourceCodec: Source });

/* THE FIVE TAMPERS, one per thing the law proves about a resolved layout. */
const TAMPERS = [
  ['profile', layout => { layout.profile = 'earned/captured-lift-layout/v3'; }],
  ['producer', layout => { layout.producer = { ...layout.producer, app_build: 'not-this-phone' }; }],
  ['basis', layout => { layout.basis = { ...layout.basis,
    source_revision: layout.basis.source_revision + 1 }; }],
  ['slot key', layout => { layout.slots[0].logical_set_slot = 'foreign-slot'; }],
  ['slot count', layout => { layout.slots.pop(); }],
];
const EXPECTED = TAMPERS.map(([name]) => [name, 'WORKOUT_CAPTURE_LAYOUT_UNPROVEN']);

async function measure(tag, producerIdentity) {
  const kit = await phone(tag, { at: WORKOUT_DAY, producerIdentity });
  const total = await recordAWorkout(kit.era, WORKOUT_DAY, phoneState());
  kit.close();
  const next = await reopen(kit.indexedDB, kit.scope, WORKOUT_DAY, { producerIdentity });
  const host = next.booted.workout.gymHost.host;
  const read = await host.client.readWorkoutHistory();
  assert.equal(read.read, true, read.code);
  const loaded = await next.era.generation();
  const resolve = ({ start }) => host.adapter.readLayout(start.prescription_capture);
  const run = tamper => History.createEngineHistoryProjector({
    athleteId: kit.scope.athleteId, deviceId: kit.scope.deviceId,
    projectWorkoutRecords, parseStrictJson, prescriptionCapture,
    resolveCapturedLayout: args => {
      const layout = resolve(args);
      if (tamper) tamper(layout);
      return layout;
    } }).project(read.history, loaded.generation, { sourceRevision: read.source_revision });
  const control = run(null);
  const codes = TAMPERS.map(([name, tamper]) => {
    let code = null;
    try { run(tamper); } catch (error) { code = (error && error.code) || String(error); }
    return [name, code];
  });
  const layout = resolve({ start: read.history.sessions[0].start.operation });
  next.close();
  return { total, codes, layout,
    sessions: control.sessions.length,
    slots: control.sessions.reduce((n, session) =>
      n + session.record.entries.reduce((m, entry) => m + entry.slots.length, 0), 0),
    performed: control.sessions.every(session => session.record.entries
      .every(entry => entry.slots.every(slot => slot.state === 'performed'))) };
}

/* (d) THE CONTROL, which was green before this ticket and must stay green: a v1
   layout is read by the v1 adapter and every tamper still refuses by name. */
test('D-L2-d (v1) - a v1 capture projects, and a tampered profile, producer, '
  + 'basis, slot key or slot count each refuses WORKOUT_CAPTURE_LAYOUT_UNPROVEN',
  async () => {
  const measured = await measure('l2d', V1);
  assert.equal(measured.layout.profile, 'earned/captured-lift-layout/v1');
  assert.equal(measured.layout.correspondence_profile, Adapter.PROFILE);
  assert.equal(measured.sessions, 1);
  assert.equal(measured.slots, measured.total);
  assert.equal(measured.performed, true);
  assert.deepEqual(measured.codes, EXPECTED);
});

/* (e) THE SAME FIVE TAMPERS UNDER v2, and the same five names in the same
   order. EXPECTED is one shared constant read by both cells, so "byte-for-byte
   the same checks" is a comparison this file cannot fudge: if the v2 branch
   ever grew a check of its own, or lost one, this deepEqual moves. */
test('D-L2-e (v2) - a v2 capture projects under the SAME law, and the SAME '
  + 'five tampers each refuse WORKOUT_CAPTURE_LAYOUT_UNPROVEN by the same name',
  async () => {
  const measured = await measure('l2e', V2);
  assert.equal(measured.layout.profile, 'earned/captured-lift-layout/v2');
  assert.equal(measured.layout.correspondence_profile, Adapter.CONFIGURATION_PROFILE);
  /* The v2 layout carries a prescribed_load per slot; the v1 one does not. The
     law reads neither, and that is the whole of the difference between them. */
  assert.equal(measured.layout.slots.every(slot => Object.hasOwn(slot, 'prescribed_load')), true);
  assert.equal(measured.sessions, 1);
  assert.equal(measured.slots, measured.total);
  assert.equal(measured.performed, true);
  assert.deepEqual(measured.codes, EXPECTED);
});
