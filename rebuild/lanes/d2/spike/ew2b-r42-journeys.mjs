/* EW2 BUILD BRIEF - E-R42's TWO ARMS, D11 AND D14, IN ONE PROTOTYPE JOURNEY.

   DECISIONS:621 (5) orders both arms a journey that can FAIL. (6) makes D11
   and D14 build orders. All three land here, against the REAL
   machine-settings host over the REAL durable client, through
   `ew2b-r42-proto-notice.mjs`, which is NEW CODE and costs ZERO product bytes.

   EVERY CLAUSE IS KILLED ONE AT A TIME. Each mutant below changes EXACTLY ONE
   clause of the amended rule and the cell asserts that the journey then FAILS.
   A clause no mutant can kill is a clause no row is holding.

   D14, and it is why the assertions below spell things out: the literal
   `MACHINE_NOTE_TARGET_UNTRANSLATED`, the literal `document` and the unmatched
   keys are asserted as LITERALS, never as the prototype's own exports, so a
   prototype that renames its constant cannot carry the row with it.

   Runs in the farm scratch AND on the PC: it seals nothing and opens no
   browser. Everything is synthetic.
   Run it as:  node rebuild/lanes/d/plan-edit/ew2b-r42-journeys.mjs          */
import assert from 'node:assert/strict';
import { createMachineSettingsHost } from '../../../m3/w7-preview/today/machine-settings-host.mjs';
import { draftFrom } from '../../../m3/w7-preview/today/machine-settings-view.mjs';
import { noteScaffold, admitState } from './ew2r7-support.mjs';
import { contextOf, latestNoteFor, latestNoteOn, UNMATCHED_NOTICE }
  from './ew2b-r42-proto-notice.mjs';

const line = (k, v) => console.log(String(k).padEnd(58) + ' ' + v);

/* THE FIVE MUTANTS, each exactly one clause of the amended rule removed or
   changed, each built by wrapping the rule's own answer so that nothing but
   that clause differs. */
const MUTANTS = [
  ['M1 the one-sentence notice removed', (r, i, c) => ({ ...latestNoteFor(r, i, c), notice: null })],
  ['M2 arm 2\'s refusal removed', (r, i, c) => { const a = latestNoteFor(r, i, c);
    return a.ok ? a : { ok: true, record: null, code: null, untranslated: a.untranslated, notice: null }; }],
  ['M3 the refusal literal changed', (r, i, c) => { const a = latestNoteFor(r, i, c);
    return a.ok ? a : { ...a, code: 'WRONG_CODE' }; }],
  ['M4 document provenance relabelled native', (r, i, c) => { const a = latestNoteFor(r, i, c);
    return a.record ? { ...a, record: { ...a.record, saved_in: 'native' } } : a; }],
  ['M5 the unmatched keys dropped', (r, i, c) => ({ ...latestNoteFor(r, i, c), untranslated: [] })],
];

/* ARM 1. A resolved note for the requested lift AND another stored note that
   this admission cannot match. NEVER SILENT: the record is shown and the
   sentence comes with it. NEVER BLOCKING: one orphan note does not take this
   lift's note away. */
function arm1(answer, beforeDraft) {
  assert.equal(answer.ok, true, 'ARM 1: an orphan note took this lift\'s note away');
  assert.ok(answer.record, 'ARM 1: the resolved note was not returned');
  assert.deepEqual(draftFrom(answer.record), beforeDraft,
    'ARM 1: the draft the editor opens is not the note he saved');
  assert.equal(answer.record.saved_in, 'document',
    'ARM 1 (D14): the resolved note is not reported as a pre-import document note');
  assert.deepEqual(answer.untranslated, ['row-old'],
    'ARM 1 (D14): the keys it could not match are not reported');
  assert.equal(typeof answer.notice === 'string' && answer.notice.length > 0, true,
    'ARM 1 (E-R42): the read is SILENT about the notes it could not match');
}

/* ARM 2. No resolved note for the requested lift while a stored note is
   unmatched: a blank draft here would be a lie, so the read refuses BY NAME. */
function arm2(answer) {
  assert.equal(answer.ok, false, 'ARM 2: a blank draft was offered over an unmatched note');
  assert.equal(answer.record, null, 'ARM 2: a record came back on a refusal');
  assert.equal(answer.code, 'MACHINE_NOTE_TARGET_UNTRANSLATED',
    'ARM 2 (D14): the refusal does not carry its own literal code');
  assert.deepEqual(answer.untranslated, ['row-old'],
    'ARM 2 (D14): the refusal does not name the keys it could not join');
}

const s = await noteScaffold({ tag: 'r42' });
let host = null;
/* LOOP ROUND 1 FIX (Astra's N5, and ND1's first clause). Round 1 counted
   `repository.load` on a lane object the cell built, while `all()` reached the
   host's OWN repository OUTSIDE that counter: a build that reintroduced
   `lane.all()` could have passed. The counter now sits at the SHARED DURABLE
   BOUNDARY - the era client's `hostBindings` - so EVERY load the host takes,
   direct or through `all()`, is counted once. */
const durable = { loads: 0 };
const countedEra = { ...s.era, client: { hostBindings: async (options) => {
  const bindings = await s.era.client.hostBindings(options);
  return { ...bindings, repository: { ...bindings.repository,
    async load(...args) { durable.loads += 1; return bindings.repository.load(...args); } } };
} } };
try {
  host = await createMachineSettingsHost({ day: s.day, era: countedEra, namespace: s.options.namespace });

  /* TWO notes saved through the REAL host, before any import, both in the
     DOCUMENT space the first run minted. */
  const savedPress = await host.save({ exercise_id: 'press-old',
    settings: [{ name: 'Seat', value: '4' }], cues: 'Pause' });
  assert.equal(savedPress.ok, true, savedPress.code);
  const savedRow = await host.save({ exercise_id: 'row-old',
    settings: [{ name: 'Pad', value: '2' }], cues: 'Slow' });
  assert.equal(savedRow.ok, true, savedRow.code);
  const beforeDraft = draftFrom(await host.latest('press-old'));
  line('BEFORE the import, draftFrom(latest("press-old"))', JSON.stringify(beforeDraft));
  const storedBefore = JSON.stringify((await s.generation()).collections.ops[savedRow.op_id]);

  /* THE ADMITTED STATE. `press-old` is re-identified as `file-press` and is in
     the correspondence. `row-old` is in NEITHER the correspondence NOR the
     admitted base, so the note saved on it is the orphan both arms turn on. */
  const imported = structuredClone(s.basisState);
  imported.exercises = imported.exercises.filter(e => e.id !== 'row-old');
  imported.exercises[0].id = 'file-press';
  imported.exOrder.U = imported.exOrder.U.filter(id => id !== 'row-old').map(id => id === 'press-old' ? 'file-press' : id);
  await s.tamper(g => {
    admitState(g, imported, { namespace: s.options.namespace });
    g.collections.derived.localSource.view.lift_correspondence = { 'press-old': 'file-press' };
  });

  const generation = await s.generation();
  const ctx = contextOf(generation);
  const rows = await host.all();
  line('notes this installation holds', rows.length);
  line('the correspondence it recorded', JSON.stringify(ctx.correspondence));
  line('lifts the admitted base carries', JSON.stringify(imported.exercises.map(e => e.id)));
  console.log('');

  /* ---------------- ARM 1 ---------------- */
  const a1 = latestNoteFor(rows, 'file-press', ctx);
  line('ARM 1 latestNoteFor("file-press").ok', String(a1.ok));
  line('  the record it returns, saved as / in', a1.record.saved_as + ' / ' + a1.record.saved_in);
  line('  the draft the editor opens', JSON.stringify(draftFrom(a1.record)));
  line('  the notes it could not match', JSON.stringify(a1.untranslated));
  line('  the sentence it carries with the note', JSON.stringify(a1.notice));
  arm1(a1, beforeDraft);
  console.log('');

  /* ---------------- ARM 2 ---------------- */
  const a2 = latestNoteFor(rows, 'squat-old', ctx);
  line('ARM 2 latestNoteFor("squat-old").ok', String(a2.ok));
  line('  the code it refuses with', String(a2.code));
  line('  the notes it could not join', JSON.stringify(a2.untranslated));
  arm2(a2);
  console.log('');

  /* ------- THE CONFIRMED ABSENCE, so arm 2 is not a guard that refuses
     everything: with the orphan matched, the same lift opens BLANK. ------- */
  await s.tamper(g => {
    g.collections.derived.localSource.view.lift_correspondence =
      { 'press-old': 'file-press', 'row-old': 'squat-old' };
  });
  const ctx2 = contextOf(await s.generation());
  const absent = latestNoteFor(await host.all(), 'file-press', ctx2);
  line('CONTROL with nothing unmatched, ok / notice', String(absent.ok) + ' / ' + JSON.stringify(absent.notice));
  assert.equal(absent.ok, true);
  assert.equal(absent.notice, null, 'the sentence is shown when nothing is unmatched');
  assert.deepEqual(absent.untranslated, []);
  await s.tamper(g => {
    g.collections.derived.localSource.view.lift_correspondence = { 'press-old': 'file-press' };
  });
  console.log('');

  /* ---------------- EVERY CLAUSE, KILLED ONE AT A TIME ---------------- */
  console.log('EACH MUTANT CHANGES EXACTLY ONE CLAUSE. IT MUST BREAK A JOURNEY:');
  const ctx3 = contextOf(await s.generation());
  const rows3 = await host.all();
  for (const [name, mutant] of MUTANTS) {
    let killedBy = null;
    try { arm1(mutant(rows3, 'file-press', ctx3), beforeDraft); } catch { killedBy = 'ARM 1'; }
    if (!killedBy) { try { arm2(mutant(rows3, 'squat-old', ctx3)); } catch { killedBy = 'ARM 2'; } }
    line('  ' + name, killedBy ? 'KILLED by ' + killedBy : 'SURVIVED');
    assert.ok(killedBy, 'no journey fails when this clause is removed: ' + name);
  }
  console.log('');

  /* ---------------- D11: ONE AUTHENTICATED GENERATION ---------------- */
  /* Counted at the shared durable boundary, so `all()`'s own load counts too. */
  durable.loads = 0;
  const answer = await latestNoteOn(host, 'file-press');
  line('D11 durable loads taken by ONE read, at the boundary', durable.loads);
  line('  and the read still answers', 'saved as ' + answer.record.saved_as + ' / ' + answer.record.saved_in);
  assert.equal(durable.loads, 1, 'D11: the read took more than one authenticated generation');
  assert.equal(answer.record.saved_in, 'document');
  /* LOOP ROUND 1 FIX (Astra's N5): `typeof === 'string'` accepted an EMPTY
     notice, so a silent card answer could have passed this row. The sentence is
     asserted as a LITERAL, D14's way, and the export is checked against that
     same literal so a prototype that renames or empties its constant cannot
     carry the row with it. */
  assert.equal(answer.notice,
    'Some notes you saved could not be matched to a machine after your import.',
    'the card call drops the sentence on the floor or answers with an empty one');
  assert.equal(UNMATCHED_NOTICE, answer.notice, 'the exported constant is not the sentence');

  /* ND1's second clause: a TWO-GENERATION read must FAIL this row. The mutant
     takes the context off one load and the ROWS off `lane.all()`, which is
     round 7's own shape and exactly what D11 forbids. */
  durable.loads = 0;
  const twoGeneration = async (lane, liftId) => latestNoteFor(await lane.all(), liftId,
    contextOf((await lane.repository.load()).generation));
  const mutantAnswer = await twoGeneration(host, 'file-press');
  line('M6 a TWO-GENERATION read, durable loads', durable.loads);
  line('  it still answers, which is why the COUNT is the row', String(mutantAnswer.ok));
  assert.equal(durable.loads, 2, 'the two-generation mutant did not take two loads');
  assert.notEqual(durable.loads, 1,
    'ND1: a two-generation read passes the one-load assertion, so the row is not holding it');
  durable.loads = 0;

  /* THE CARD CONTRACT on arm 2: it REJECTS, and the rejection carries the
     literal code and the keys, which is what the card's existing
     A REFUSAL IS NOT AN ABSENCE state paints. */
  let thrown = null;
  try { await latestNoteOn(host, 'squat-old'); } catch (error) { thrown = error; }
  line('D14 the card call on arm 2 rejects with', thrown ? thrown.code : 'NOTHING');
  line('  and names the keys', thrown ? JSON.stringify(thrown.untranslated) : 'none');
  assert.ok(thrown, 'the card call resolved over an unmatched note');
  assert.equal(thrown.code, 'MACHINE_NOTE_TARGET_UNTRANSLATED');
  assert.deepEqual(thrown.untranslated, ['row-old']);
  console.log('');

  /* CONTROL: nothing on disk was rewritten by any read above. */
  assert.equal(JSON.stringify((await s.generation()).collections.ops[savedRow.op_id]), storedBefore,
    'a read rewrote the stored note');
  line('CONTROL the orphan note is byte-unchanged on disk', 'true');
  line('PROPOSED copy, E-R42\'s one sentence', JSON.stringify(UNMATCHED_NOTICE));
  line('product bytes this prototype required', 0);
  console.log('');
  console.log('ALL ASSERTIONS HELD');
} finally {
  if (host) host.close();
  s.close();
}
