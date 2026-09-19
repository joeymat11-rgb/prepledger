/* EW2 ROUND 7 CELL B1 - throwaway, and RED AT THE HEAD IT WAS WRITTEN AT (f6fd29ac).
   Astra's re-check B1, reproduced with my own cell before a word of spec was written:
   a machine note saved before the first admission disappears from the prescribed
   editor afterwards, because 13.9 translates the QUERY key while the immutable note
   keeps the key it was saved under.

   It drives the REAL `machine-settings-host.mjs` over the REAL durable client and the
   coach's own producer. It rewrites nothing: the admitted state is installed with the
   PE16-style fixture, exactly as every other ew2r6/ew2r7 cell does, and the stored
   operation is compared byte for byte before and after.

   EXIT 1 IS THE POINT. The three assertions at the end are what the corrected rule
   owes; at this head the first one fails. The build turns this cell green. */
import assert from 'node:assert/strict';
import { createMachineSettingsHost } from '../../../m3/w7-preview/today/machine-settings-host.mjs';
import { draftFrom } from '../../../m3/w7-preview/today/machine-settings-view.mjs';
import { noteScaffold, admitState, importedWithFilePress, MAP } from './ew2r7-support.mjs';

const line = (k, v) => console.log(k.padEnd(58) + ' ' + v);
const s = await noteScaffold({ tag: 'r7-b1' });
let host = null, failure = null;
try {
  host = await createMachineSettingsHost({ day: s.day, era: s.era, namespace: s.options.namespace });

  const input = { exercise_id: 'press-old', settings: [{ name: 'Seat', value: '4' }], cues: 'Pause' };
  const saved = await host.save(input);
  line('save({exercise_id:press-old, Seat=4, cues:Pause}).ok', String(saved.ok));
  assert.equal(saved.ok, true, saved.code);
  const storedBefore = JSON.stringify((await s.generation()).collections.ops[saved.op_id]);
  line('the key the immutable note was SAVED under', JSON.stringify(input.exercise_id));

  const beforeDraft = draftFrom(await host.latest('press-old'));
  line('BEFORE the import, draftFrom(latest("press-old"))', JSON.stringify(beforeDraft));

  /* The first admission. The same named lift arrives under a FILE id and admission
     records the correspondence E-R30 reads. Nothing touches the note. */
  const imported = importedWithFilePress(s.basisState);
  await s.tamper(g => {
    admitState(g, imported, { namespace: s.options.namespace });
    g.collections.derived.localSource.view.lift_correspondence = { ...MAP };
  });
  line('recorded lift_correspondence', JSON.stringify(MAP));

  /* 13.9 AS IT STANDS: "after an import the read key is the translated id". */
  const translated = MAP[input.exercise_id];
  const after = await host.latest(translated);
  line('13.9/M1 read: latest("' + translated + '")', JSON.stringify(after));
  const afterDraft = draftFrom(after);
  line('AFTER the import, draftFrom(that)', JSON.stringify(afterDraft));

  /* The two controls Astra names: the note is not gone, and nothing was rewritten. */
  const control = await host.latest('press-old');
  line('CONTROL latest("press-old") still finds the note', String(!!control));
  const storedAfter = JSON.stringify((await s.generation()).collections.ops[saved.op_id]);
  line('CONTROL the stored operation is byte-unchanged', String(storedBefore === storedAfter));
  line('rows the host holds in this generation', String((await host.all()).length));

  console.log('');
  console.log('WHAT THE CORRECTED RULE OWES, asserted below:');
  console.log('  1. the saved note answers for the lift it was saved on, after the import');
  console.log('  2. the draft the editor opens still carries Seat=4 and the cue');
  console.log('  3. nothing on disk was rewritten to achieve either');
  try {
    assert.notEqual(after, null,
      'B1: latest(translated id) is null, so the editor opens blank over a saved note');
    assert.deepEqual(afterDraft, beforeDraft, 'B1: the draft changed across an import');
    assert.equal(storedBefore, storedAfter, 'the stored operation must never be rewritten');
    console.log('ALL THREE HOLD');
  } catch (error) { failure = error; }
} finally { host && host.close(); s.close(); }

if (failure) {
  console.log('RED, as written: ' + failure.message);
  process.exitCode = 1;
}
