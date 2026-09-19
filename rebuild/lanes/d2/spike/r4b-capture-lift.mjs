/* EW2 SPEC REVIEW R4 - MY OWN CELL. Throwaway, never pushed, synthetic only.

   WHAT IT ATTACKS: E-R16 / 4.3 ruling 1's capture_lift row, which rules that
   source-admission.mjs:614's membership test is REPLACED by "the same one-of
   test asked of FOLDED's exercises INSTEAD of state.exercises", while :613's
   correspondence resolution "STAYS EXACTLY AS IT IS".

   THE QUESTION: :613 resolves a capture's lineage id into the FILE's id space
   (lift_correspondence maps a DOCUMENT lift id to the FILE lift id it answers
   for). FOLDED is built from createCleanInitState({setup: op.payload.setup}),
   which is the DOCUMENT's id space. Are those the same ids? */
import { createRequire } from 'node:module';
import { createCleanInitState } from '../../../m3/w7-preview/today/setup-model.mjs';
import { PHONE, PHONE_ID, variant, Fixture } from './real-shape-support.mjs';

const require = createRequire(import.meta.url);
const Corr = require('../../../m4/workout/lift-correspondence.cjs');

const documentState = createCleanInitState({ setup: PHONE.setup });
const documentLifts = PHONE.setup.exercises;

/* The admitted state as source-admission.mjs builds it: the FILE's own lifts,
   plus (:477-:484) every document lift that neither corresponds nor is already
   held, appended as a retired lift. */
function admittedExercises(file, corr) {
  const held = new Set(file.exercises.map((e) => e.id));
  const out = file.exercises.map((e) => ({ id: e.id }));
  for (const row of documentState.exercises) {
    if (corr[row.id] || held.has(row.id)) continue;
    out.push({ id: row.id });
  }
  return out;
}

function measure(level, extraFoldedLift) {
  const file = variant(level);
  const corr = Corr.correspondence(file.exercises, documentLifts);
  const state = admittedExercises(file, corr);
  const folded = documentState.exercises.map((e) => ({ id: e.id }));
  if (extraFoldedLift) folded.push({ id: extraFoldedLift });

  const one = (list, id) => list.filter((e) => e.id === id).length === 1;
  const rows = [];
  /* Every slot a pre-import session can carry names a DOCUMENT lift by its own
     id (the comment at :600-:611), so the document's lifts ARE the slot ids. */
  const slots = documentState.exercises.map((e) => e.id);
  if (extraFoldedLift) slots.push(extraFoldedLift);
  for (const slotId of slots) {
    const target = corr[slotId] ?? slotId;
    rows.push({ slotId, target, today: one(state, target), underER16: one(folded, target) });
  }
  return {
    'variant (the FILE)': level === 0 ? "0, the old app's own shape (handles)"
      : level + ", the bracket's id remap has run (file ids ARE the phone's slugs)",
    'document lifts': documentState.exercises.length,
    'slot ids whose target differs from the slot id': rows.filter((r) => r.target !== r.slotId).length,
    'PASS today (:614 over the ADMITTED state)': rows.filter((r) => r.today).length + '/' + rows.length,
    'PASS under E-R16 (:614 over FOLDED)': rows.filter((r) => r.underER16).length + '/' + rows.length,
    'REFUSED by E-R16 that pass today': rows.filter((r) => r.today && !r.underER16).map((r) => r.slotId + ' -> ' + r.target),
    'ADMITTED by E-R16 that refuse today (the add/replace case the ruling exists for)':
      rows.filter((r) => !r.today && r.underER16).map((r) => r.slotId),
  };
}

const out = {
  'PHONE_ID.lateral (the document slug for the file lift `lateral`)': PHONE_ID.lateral,
  'correspondence(variant(0), document)[lateral-machine]':
    Corr.correspondence(variant(0).exercises, documentLifts)['lateral-machine'],
  'the file at variant(0) carries an id `lateral-machine`':
    variant(0).exercises.some((e) => e.id === 'lateral-machine'),
  A_real_old_app_file: measure(0, 'ew2-added-lift'),
  B_the_spike_M4_fixture_shape: measure(7, 'ew2-added-lift'),
  'file lift ids at variant(0), first five': variant(0).exercises.slice(0, 5).map((e) => e.id),
  'document lift ids, first five': documentState.exercises.slice(0, 5).map((e) => e.id),
  'Fixture.LIFTS count': Fixture.LIFTS.length,
};
console.log(JSON.stringify(out, null, 1));
