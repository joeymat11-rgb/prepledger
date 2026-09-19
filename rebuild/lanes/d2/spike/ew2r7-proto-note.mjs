/* EW2 ROUND 7 PROTOTYPE 4 - throwaway, and the SMALLEST composition that turns the
   B1 cell green. ZERO PRODUCT BYTES: nothing here is a copy of a sealed module and
   nothing here is a second validator or a second latest-wins rule. It is a pure
   selection over the rows `machine-settings-host.all()` already returns, and the
   winner is chosen by the coach's OWN `latestFor`, imported and called.

   THE ONE BOUNDARY, and it is the correction B1 asks for. Round 6 translated the
   QUERY key; an immutable note keeps the key it was SAVED under, so translating the
   query cannot change that index. `noteIdentityOf` translates the STORED key FORWARD
   into the space the reader is asking in - the same direction, the same rule and the
   SAME recorded map as `E-R30`'s `targetIdOf`
   (`collections.derived.localSource.view.lift_correspondence`). There is no second map.

   NOTHING IS REWRITTEN. The rows this module resolves are frozen copies the host
   already made; a resolved row is a NEW object carrying `saved_as` and `saved_in`, and
   the stored operation on disk is never touched. The B1 cell asserts that. */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { latestFor } = require('../../../coach/machine-settings-commands.cjs');

export const UNTRANSLATED = 'MACHINE_NOTE_TARGET_UNTRANSLATED';

/* The authenticated derived record, read exactly where E-R30's fold reads it. A base
   that was never admitted has no view at all, which is the first-run case. */
export function contextOf(generation) {
  const view = generation && generation.collections && generation.collections.derived
    && generation.collections.derived.localSource
    ? generation.collections.derived.localSource.view : null;
  if (!view || view.ready !== true) return { admitted: null, correspondence: null };
  return { admitted: view.state || null,
    correspondence: Object.hasOwn(view, 'lift_correspondence') ? view.lift_correspondence : null };
}

/* THE ONE NAMED BOUNDARY. Given the id a stored note was minted under, which lift in
   the space the reader is asking in does it answer for? The four branches are
   E-R30's, word for word, with the DOCUMENT-to-FILE direction applied to the stored
   key instead of to the query. */
export function noteIdentityOf({ admitted, correspondence }, storedId) {
  if (typeof storedId !== 'string' || storedId.trim() === '') return { id: null, space: 'none' };
  const id = storedId.trim();
  if (!admitted) return { id, space: 'first-run' };
  if (correspondence && Object.hasOwn(correspondence, id)) return { id: correspondence[id], space: 'document' };
  const rows = Array.isArray(admitted.exercises) ? admitted.exercises : [];
  if (rows.some(row => row && row.id === id)) return { id, space: 'native' };
  return { id: null, space: 'untranslated' };
}

/* Every stored note that answers for ONE lift, in the store's own order, each one a
   copy relabelled into the requested identity, plus the notes whose saved identity
   this admission cannot join at all. */
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

/* THE READ THE EDITOR TAKES. `ok:true` with a null record is a CONFIRMED absence and
   is the only shape allowed to open a blank draft. A null record while an
   untranslatable note exists is NOT a confirmed absence and refuses BY NAME. */
export function latestNoteFor(rows, requestedId, context) {
  const { resolved, untranslated } = notesFor(rows, requestedId, context);
  const record = latestFor(resolved, requestedId);
  if (record) return { ok: true, record, code: null, untranslated };
  if (untranslated.length) return { ok: false, record: null, code: UNTRANSLATED, untranslated };
  return { ok: true, record: null, code: null, untranslated };
}

/* THE ONE CALL THE CARD MAKES, and the shape it already handles. `gym-app.mjs:147`
   calls `settingsLane.latest(liftId)` and its rejection handler at `:149-:152` is the
   one that says A REFUSAL IS NOT AN ABSENCE. So the named refusal reaches the athlete
   through the state the card ALREADY paints, and a resolved note reaches
   `draftFrom` once, as `E-R38` requires. `lane` is the real host handle: `all()` and
   `repository` are both already on it (`machine-settings-host.mjs:79`, `:85`). */
export async function latestNoteOn(lane, liftId) {
  const generation = (await lane.repository.load()).generation;
  const answer = latestNoteFor(await lane.all(), liftId, contextOf(generation));
  if (answer.ok) return answer.record;
  const error = new Error(answer.code);
  error.code = answer.code;
  error.untranslated = answer.untranslated;
  throw error;
}
