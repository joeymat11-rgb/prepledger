/* EW2 ROUND 7 PROTOTYPE CELL 4 - throwaway. The same journey the RED cell
   `ew2r7-b1-note-read.mjs` measures, driven through `ew2r7-proto-note.mjs`, plus
   BOTH controls Astra requires (a pre-import DOCUMENT note and a native FILE note),
   the date-and-order rule, the same-label re-add, and the named refusal where the
   correspondence is null. Zero product bytes: the only product code called is the
   REAL host, the REAL durable client and the coach's OWN `latestFor`.
   GREEN is the whole point; every line below is an assertion or its measurement. */
import assert from 'node:assert/strict';
import { createMachineSettingsHost } from '../../../m3/w7-preview/today/machine-settings-host.mjs';
import { draftFrom } from '../../../m3/w7-preview/today/machine-settings-view.mjs';
import { noteScaffold, admitState, importedWithFilePress, MAP } from './ew2r7-support.mjs';
import { contextOf, latestNoteFor, latestNoteOn, noteIdentityOf, UNTRANSLATED } from './ew2r7-proto-note.mjs';

const line = (k, v) => console.log(k.padEnd(58) + ' ' + v);
const s = await noteScaffold({ tag: 'r7-p4' });
let host = null;
try {
  host = await createMachineSettingsHost({ day: s.day, era: s.era, namespace: s.options.namespace });
  const doc = { exercise_id: 'press-old', settings: [{ name: 'Seat', value: '4' }], cues: 'Pause' };
  const savedDoc = await host.save(doc);
  assert.equal(savedDoc.ok, true, savedDoc.code);
  const storedBefore = JSON.stringify((await s.generation()).collections.ops[savedDoc.op_id]);
  const beforeDraft = draftFrom(await host.latest('press-old'));
  line('BEFORE the import, draftFrom(latest("press-old"))', JSON.stringify(beforeDraft));

  const imported = importedWithFilePress(s.basisState);
  const admit = map => s.tamper(g => {
    admitState(g, imported, { namespace: s.options.namespace });
    if (map) g.collections.derived.localSource.view.lift_correspondence = { ...map };
  });
  await admit(MAP);

  /* THE CORRECTION. The STORED key is translated forward; the query is not. */
  const ctx = contextOf(await s.generation());
  line('noteIdentityOf(stored "press-old")', JSON.stringify(noteIdentityOf(ctx, 'press-old')));
  const read = latestNoteFor(await host.all(), 'file-press', ctx);
  line('latestNoteFor("file-press").ok', String(read.ok));
  line('  its record was saved as / saved in', read.record.saved_as + ' / ' + read.record.saved_in);
  const afterDraft = draftFrom(read.record);
  line('AFTER the import, the draft the editor opens', JSON.stringify(afterDraft));
  assert.equal(read.ok, true);
  assert.deepEqual(afterDraft, beforeDraft, 'CONTROL 1: the pre-import DOCUMENT note survives the import');
  assert.equal(JSON.stringify((await s.generation()).collections.ops[savedDoc.op_id]), storedBefore,
    'nothing on disk was rewritten');

  /* THE CALL THE CARD MAKES, through the real host handle and nothing else. */
  const throughLane = await latestNoteOn(host, 'file-press');
  line('latestNoteOn(host,"file-press") saved as / in', throughLane.saved_as + ' / ' + throughLane.saved_in);
  assert.deepEqual(draftFrom(throughLane), beforeDraft);

  /* THE NAMED REFUSAL. Admission recorded no correspondence at all: the saved note
     cannot be joined to any lift, and a blank draft would be a lie about a
     CONFIRMED absence. */
  await admit(null);
  const noMap = latestNoteFor(await host.all(), 'file-press', contextOf(await s.generation()));
  line('no correspondence recorded: ok / code', String(noMap.ok) + ' / ' + noMap.code);
  line('  the notes it could not join', JSON.stringify(noMap.untranslated));
  assert.equal(noMap.ok, false);
  assert.equal(noMap.code, UNTRANSLATED);
  assert.deepEqual(noMap.untranslated, ['press-old']);
  const rejected = await latestNoteOn(host, 'file-press').then(() => null, error => error);
  line('  and through the lane call it REJECTS with', String(rejected && rejected.code));
  assert.equal(rejected.code, UNTRANSLATED);
  await admit(MAP);

  /* CONTROL 2: a NATIVE file note, saved after the import under the FILE id. It is
     never translated, and latest-wins stays the coach's own rule: same date, so the
     later entry in the store's own order answers. */
  const native = { exercise_id: 'file-press', settings: [{ name: 'Seat', value: '5' }], cues: 'Squeeze' };
  const savedNative = await host.save(native);
  assert.equal(savedNative.ok, true, savedNative.code);
  const both = latestNoteFor(await host.all(), 'file-press', contextOf(await s.generation()));
  line('with both notes, the winner was saved as / in', both.record.saved_as + ' / ' + both.record.saved_in);
  line('  the draft it opens', JSON.stringify(draftFrom(both.record)));
  line('  both notes are still on disk, rows =', String((await host.all()).length));
  assert.equal(both.record.saved_in, 'native');
  assert.deepEqual(draftFrom(both.record), { rows: [{ name: 'Seat', value: '5' }], cues: 'Squeeze' });
  assert.equal((await host.all()).length, 2);

  /* THE DATE AND ORDER RULE, permuted. Pure rows in the shape `all()` returns, so
     the two spaces can carry different dates without a second durable era. */
  const rowsOf = (docDate, fileDate) => ([
    { op_id: 'a', date: docDate, time: null, machine: { exercise_id: 'press-old', settings: [{ name: 'Seat', value: '4' }] } },
    { op_id: 'b', date: fileDate, time: null, machine: { exercise_id: 'file-press', settings: [{ name: 'Seat', value: '5' }] } },
  ]);
  const older = latestNoteFor(rowsOf('2026-09-14', '2026-09-15'), 'file-press', ctx);
  const newer = latestNoteFor(rowsOf('2026-09-16', '2026-09-15'), 'file-press', ctx);
  line('document 09-14 versus file 09-15, winner', older.record.saved_as + ' (' + older.record.date + ')');
  line('document 09-16 versus file 09-15, winner', newer.record.saved_as + ' (' + newer.record.date + ')');
  assert.equal(older.record.saved_as, 'file-press');
  assert.equal(newer.record.saved_as, 'press-old');

  /* THE SAME-LABEL RE-ADD. `Lateral` was created in the document space, admission
     appended its retired row under its own id (13.2's fourth row), it was removed,
     and a re-add minted `lateral-2`. The retired lift's note must answer for the
     retired lift and for NOTHING else, and the new lift must open blank as a
     CONFIRMED absence, not as a refusal. */
  const readd = { admitted: { exercises: [{ id: 'file-press' }, { id: 'lateral', retired: true }, { id: 'lateral-2' }] },
    correspondence: { ...MAP } };
  const noteRows = [{ op_id: 'c', date: '2026-09-14', time: null,
    machine: { exercise_id: 'lateral', settings: [{ name: 'Pad', value: '2' }] } }];
  const onNew = latestNoteFor(noteRows, 'lateral-2', readd);
  const onOld = latestNoteFor(noteRows, 'lateral', readd);
  line('re-add: latestNoteFor("lateral-2") ok / record', String(onNew.ok) + ' / ' + JSON.stringify(onNew.record));
  line('re-add: latestNoteFor("lateral") saved as / in', onOld.record.saved_as + ' / ' + onOld.record.saved_in);
  assert.equal(onNew.ok, true);
  assert.equal(onNew.record, null);
  assert.deepEqual(onNew.untranslated, []);
  assert.equal(onOld.record.saved_as, 'lateral');

  /* THE FIRST-RUN CONTROL: before any admission nothing is translated at all. */
  const first = latestNoteFor(noteRows, 'lateral', { admitted: null, correspondence: null });
  line('first-run (no admission), saved as / in', first.record.saved_as + ' / ' + first.record.saved_in);
  assert.equal(first.record.saved_in, 'first-run');

  line('product bytes this prototype required', '0');
  console.log('ALL ASSERTIONS HELD');
} finally { host && host.close(); s.close(); }
