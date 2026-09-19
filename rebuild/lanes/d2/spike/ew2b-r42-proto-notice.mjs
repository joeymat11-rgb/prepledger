/* EW2 BUILD BRIEF - E-R42's PROTOTYPE. NEW CODE ONLY, ZERO PRODUCT BYTES.

   DECISIONS:621 (5) AMENDS spec 14.2 rather than enforcing its sentence:
   NEVER SILENT AND NEVER BLOCKING.

     ARM 1, a resolved note EXISTS for the requested lift and other stored
     notes cannot be matched: the card SHOWS the resolved note AND says, in
     one plain sentence, that some saved notes could not be matched after
     the import. One orphan note must not take every lift's note away.

     ARM 2, NO resolved note exists and any stored note is unmatched: the
     read REFUSES BY NAME, MACHINE_NOTE_TARGET_UNTRANSLATED, as 14.2 says,
     because a blank draft there would be a lie.

   THIS IS NOT AN EDIT OF `ew2r7-proto-note.mjs`. That module is round 7's and
   is left exactly as it ran. This one is written from scratch so that a
   reviewer can diff the two rules rather than a patch.

   D11 IS FOLDED IN, not left for later: round 7's `latestNoteOn` loads a
   generation for the context and then `lane.all()` loads ANOTHER for the rows.
   Here ONE `repository.load()` is taken and BOTH the rows and the context come
   off that single snapshot, through the coach's own `machineSettingsIn`, which
   is the exact route Astra's L2 line 100 names. No host byte and no coach byte.

   Nothing here imports a copy of a sealed module: `latestFor` and
   `machineSettingsIn` are the coach's own, required from their own file.    */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { latestFor, machineSettingsIn } = require('../../../coach/machine-settings-commands.cjs');

export const UNTRANSLATED = 'MACHINE_NOTE_TARGET_UNTRANSLATED';

/* PROPOSED COPY FOR THE OWNER, E-R42's one sentence. 2.3's copy laws: plain
   words, no jargon, no code, no blame, and nothing that asks him to understand
   an id space. It is a hypothesis he may overrule. */
export const UNMATCHED_NOTICE =
  'Some notes you saved could not be matched to a machine after your import.';

/* The authenticated derived record, read exactly where E-R30's fold reads it.
   A base that was never admitted has no view at all: the first-run case. */
export function contextOf(generation) {
  const derived = generation && generation.collections && generation.collections.derived
    ? generation.collections.derived.localSource : null;
  const view = derived ? derived.view : null;
  if (!view || view.ready !== true) return { admitted: null, correspondence: null };
  return { admitted: view.state || null,
    correspondence: Object.hasOwn(view, 'lift_correspondence') ? view.lift_correspondence : null };
}

/* THE ONE NAMED BOUNDARY, unchanged in rule from 14.2: the STORED key is
   translated forward into the space the reader asks in, through the ONE
   recorded correspondence, with E-R30's four branches. The query is never
   translated and nothing is rewritten. */
export function noteIdentityOf({ admitted, correspondence }, storedId) {
  if (typeof storedId !== 'string' || storedId.trim() === '') return { id: null, space: 'none' };
  const id = storedId.trim();
  if (!admitted) return { id, space: 'first-run' };
  if (correspondence && Object.hasOwn(correspondence, id)) return { id: correspondence[id], space: 'document' };
  const rows = Array.isArray(admitted.exercises) ? admitted.exercises : [];
  if (rows.some(row => row && row.id === id)) return { id, space: 'native' };
  return { id: null, space: 'untranslated' };
}

/* Each stored note relabelled, as a COPY, into the identity it answers for,
   plus the saved keys this admission cannot join at all. */
export function notesFor(rows, requestedId, context) {
  const resolved = [], untranslated = [];
  for (const row of rows || []) {
    const saved = row && row.machine ? row.machine.exercise_id : null;
    const answer = noteIdentityOf(context, saved);
    if (answer.space === 'untranslated') { untranslated.push(saved); continue; }
    if (answer.id !== requestedId) continue;
    resolved.push({ ...row, saved_as: saved, saved_in: answer.space,
      machine: { ...row.machine, exercise_id: answer.id } });
  }
  return { resolved, untranslated };
}

/* THE AMENDED READ. Three outcomes and no fourth:

     a RESOLVED record with NOTHING unmatched   ok, record, no notice
     a RESOLVED record with notes unmatched     ok, record, THE NOTICE  (arm 1)
     NO record with notes unmatched             REFUSED BY NAME         (arm 2)
     NO record with nothing unmatched           ok, null: a CONFIRMED absence

   The notice is carried on the ANSWER, never invented by the card, so a card
   that forgets to draw it is a defect a row can fail for. */
export function latestNoteFor(rows, requestedId, context) {
  const { resolved, untranslated } = notesFor(rows, requestedId, context);
  const record = latestFor(resolved, requestedId);
  if (record) {
    return { ok: true, record, code: null, untranslated,
      notice: untranslated.length ? UNMATCHED_NOTICE : null };
  }
  if (untranslated.length) {
    return { ok: false, record: null, code: UNTRANSLATED, untranslated, notice: null };
  }
  return { ok: true, record: null, code: null, untranslated, notice: null };
}

/* THE ONE CALL THE CARD MAKES. It returns the ANSWER and not a bare record,
   which is what makes arm 1 reachable at all: round 7's version returned
   `answer.record` and dropped the unmatched keys on the floor, so a card built
   on it could not have said the sentence even if it wanted to. That is the
   defect E-R42 names as SILENT.

   D11: ONE authenticated load. The rows and the context come off the SAME
   generation object, so no admission can land between them. */
export async function latestNoteOn(lane, liftId) {
  const generation = (await lane.repository.load()).generation;
  const answer = latestNoteFor(machineSettingsIn(generation), liftId, contextOf(generation));
  if (answer.ok) return answer;
  const error = new Error(answer.code);
  error.code = answer.code;
  error.untranslated = answer.untranslated;
  throw error;
}
