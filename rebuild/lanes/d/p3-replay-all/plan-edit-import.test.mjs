/* S15 F10 - THE ROUTINE CHANGE AND THE IMPORT, on a real installation.

   PM RULING, option B (the F4 precedent): AN IMPORT REPLACES THE ROUTINE. A
   change the athlete saved on "Change my routine" BEFORE the import is admitted,
   kept on record (never deleted) and no longer used; a change saved AFTER the
   import is used as normal. RED before F10: admission refused the first one
   LOCAL_SOURCE_EFFECT_UNMAPPED at its unknown-plan catch and the import could
   not happen at all.

   ONE store, ONE installation, the REAL routine host (routine-host.mjs over
   plan-edit-host.mjs), the REAL admission controller and a real sealed bundle
   from the real port.cjs, exactly as writer-order.test.mjs stands them up. The
   routine is then read the two ways the page reads it: the editor's view (the
   routine as it stands from tomorrow) and Today's adoption hook.

   SYNTHETIC ONLY: the bundle is invented in the OS temp folder and sealed with
   --out outside every git working tree. No private fixture, no ledger, no owner
   file. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, eraFor, firstRun, admit,
  IMPORTED_LOADS } from '../../../m3/w7-preview/import/test/support.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';
import { createRoutineEntry } from '../../../m3/w7-preview/today/routine-host.mjs';
import Routine from '../../../m3/w7-preview/today/routine-model.mjs';

const SEALED = sealInventedBundle();
const DAY = '2026-11-20', NEXT = '2026-11-21';
const CLOCK = { today: () => DAY, now: () => DAY + 'T13:00:00.000Z', tz: '-05:00', monotonicMs: () => 0 };
const copy = value => JSON.parse(JSON.stringify(value));
const scopeFor = tag => ({ databaseName: 'p3-f10-' + tag, namespace: 'joe/p3-f10-' + tag,
  athleteId: 'ath-p3-f10', deviceId: 'dev-p3-f10' });

async function open(t, tag) {
  const scope = scopeFor(tag);
  const era = await eraFor({ indexedDB: new IDBFactory(), clock: CLOCK, ...scope });
  t.after(() => era.close());
  await firstRun(era, DAY);
  return { era, scope };
}
/* One more set on the first Upper lift the editor shows, saved through the shipped lane. */
async function oneMoreSet(era) {
  const session = await createRoutineEntry({ installation: era, day: DAY }).session();
  assert.equal(session.ok, true, 'the routine would not open: ' + session.code);
  try {
    const view = await session.view();
    assert.equal(view.ok, true, 'the routine would not read: ' + view.code);
    assert.equal(view.starts_on, NEXT);
    const row = Routine.rowsOf(view.state).U[0];
    const saved = await session.save(Routine.updateEdit(row, { ...row, sets: row.sets + 1 }).edit, view.starts_on);
    assert.equal(saved.ok, true, 'the routine change was refused: ' + saved.code);
    return { id: row.id, sets: row.sets + 1, op_id: saved.op_id };
  } finally { session.close(); }
}
const planOps = async era => Object.fromEntries(Object.entries((await era.generation()).generation.collections.ops || {})
  .filter(([, op]) => op.kind === 'plan-mutation'));
const imported = async (era, scope) => admittedLocalSourceBasis((await era.generation()).generation,
  { namespace: scope.namespace });
async function editorView(era) {
  const session = await createRoutineEntry({ installation: era, day: DAY }).session();
  assert.equal(session.ok, true, 'the routine would not open after the import: ' + session.code);
  try {
    assert.equal(session.source, 'local-source', 'the editor is not on the imported routine');
    const view = await session.view();
    assert.equal(view.ok, true, 'the routine would not read after the import: ' + view.code);
    return view;
  } finally { session.close(); }
}

test('PE-I1 - a routine change saved BEFORE the import: the import is ADMITTED, F10 answers for the change as '
  + 'superseded, the change is still on the record byte for byte, and the routine is the imported one', async t => {
  const { era, scope } = await open(t, 'before');
  const change = await oneMoreSet(era);
  const before = await planOps(era);
  assert.deepEqual(Object.keys(before), [change.op_id]);

  const result = await admit(era, SEALED, { day: DAY, ...scope });
  assert.equal(result.admitted, true, 'THE DEFECT: ' + JSON.stringify(result.codes || result.code || result.stage));
  const rows = result.view.families.filter(row => row.family === 'F10');
  assert.deepEqual(rows, [{ family: 'F10', state: 'superseded', op_id: change.op_id }],
    'F10 did not answer for the change exactly once, as superseded: ' + JSON.stringify(result.view.families));

  /* KEPT ON RECORD: the operation is still in this installation's log, unchanged. */
  assert.deepEqual(await planOps(era), before, 'the import moved or deleted the routine change');
  /* NO LONGER USED: Today stands on the imported routine and the editor shows it too. */
  const state = await imported(era, scope);
  assert.ok(state, 'the admitted import is not visible to Today');
  assert.deepEqual(state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS);
  const adopted = await createRoutineEntry({ installation: era, day: NEXT }).adopt(copy(state));
  assert.deepEqual(adopted, state, 'Today adopted a change the import superseded');
  const view = await editorView(era);
  assert.deepEqual(view.state, state, 'the editor shows a change the import superseded');
});

test('PE-I2 - a routine change saved AFTER the import is used as normal: the editor shows it from its start '
  + 'date, Today adopts it from that day and not before, and the imported history is untouched', async t => {
  const { era, scope } = await open(t, 'after');
  const result = await admit(era, SEALED, { day: DAY, ...scope });
  assert.equal(result.admitted, true, JSON.stringify(result.codes || result.code || result.stage));
  assert.equal(result.view.families.some(row => row.family === 'F10'), false, 'no routine change exists yet');
  const state = await imported(era, scope);
  assert.ok(state, 'the admitted import is not visible to Today');

  const change = await oneMoreSet(era);
  assert.deepEqual(Object.keys(await planOps(era)), [change.op_id]);
  const view = await editorView(era);
  assert.equal(view.state.exercises.find(e => e.id === change.id).sets, change.sets,
    'the change made after the import is not in the routine');
  /* Today: not on the day it was saved, and from the next day on. */
  assert.deepEqual(await createRoutineEntry({ installation: era, day: DAY }).adopt(copy(state)), state,
    'the change was used before its start date');
  const adopted = await createRoutineEntry({ installation: era, day: NEXT }).adopt(copy(state));
  assert.equal(adopted.exercises.find(e => e.id === change.id).sets, change.sets, 'Today did not adopt the change');
  for (const kept of state.exercises.filter(e => e.id !== change.id))
    assert.deepEqual(adopted.exercises.find(e => e.id === kept.id), kept, kept.id + ' kept every field');
  assert.deepEqual(adopted.sessionLog, state.sessionLog, 'the imported history was rewritten');
  assert.deepEqual(await imported(era, scope), state, 'the admitted import itself moved');
});
