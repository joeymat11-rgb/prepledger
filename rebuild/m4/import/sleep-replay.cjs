'use strict';
/* sleep-replay.cjs - THE REPLAY FAMILY FOR THE N2 SLEEP OPERATIONS (F8).
   Lane D, ticket P3-REPLAY-ALL-FAMILIES; the defect is open item 2 of
   rebuild/lanes/d/P3-REPLAY-MEASURE-FAMILY-AUTHOR-REPORT.md and finding RV-S1
   of that ticket's review.

   WHAT WENT WRONG, REPRODUCED BEFORE ANYTHING WAS BUILT.
   rebuild/m3/w7-preview/today/sleep-host.mjs opens the SAME installation Today
   opens, so recording ONE night writes a `sleep` operation into the very
   generation admission replays. Admission had a family for readings (F1), food
   (F2), workouts (F3), the setup and machine-settings documents (F4), the
   check-in (F5), the source state's own historical decisions (F6) and the
   measure records (F7), and NONE for this class, so source-admission.mjs's
   replay fell to its catch-all and raised LOCAL_SOURCE_CONTEXT_UNRESOLVED: an
   athlete who had logged a night could not import his own history. Joe logs
   nights daily, so his real port refused for this reason alone.

   WHAT THESE RECORDS ARE. One accepted class, `sleep`, kind `fact`, under one
   profile, `earned/sleep-night/v1`, written by the ONE producer
   rebuild/m3/w7-preview/today/sleep-commands.cjs (not a byte of it is touched
   here). The payload is the athlete's own answer for ONE completed night, in
   exactly one of two shapes - a duration, or a bed/wake pair with optional
   awake minutes - and nothing in it is derived: there is no score, no debt and
   no target, and the hours a pair of clock times comes to is the ENGINE's
   number, asked for by the projector, never by this module.

   THE RULES THIS FAMILY STATES, in the shape F7 states its own:

   (1) MEMBERSHIP. Every operation of class `sleep` belongs to this family and
       to no other. It is a fact under the profile above and validates under the
       N2 producer's own validate(), or it is refused BY NAME as
       LOCAL_SOURCE_SLEEP_UNRESOLVED. Nothing of this class may be silently
       dropped, and nothing of this class may fall to the catch-all again.
   (2) EVIDENCE ROLE: NONE. A night is an ATHLETE RECORD, not session evidence
       and not programme evidence. It is not a weigh-in, not a workout and not a
       plan: it enters no reading projection, no daily projection, no workout
       projection and no programme proof, it is never applied to the replayed
       state (nothing is written into `state.sleep.nights`), and no engine call
       is made for it - in particular sleepSpanH is NOT invoked here, so this
       module cannot invent an hours figure the athlete never gave. The family
       is 'retained', never 'projected'.
   (3) ORDERING is by the night's OWN date, `payload.night.date`, then
       device_seq. That orders the family's ACCOUNT of the nights. It does NOT
       re-order the store: operations are retained verbatim, and N2's own
       readers (sleepNightsIn, winningNights) keep their device_seq order and
       their own latest-op-wins rule, unchanged.
   (4) NEITHER CONTRADICTED NOR ABSORBED. A night dated BEFORE the import's last
       day says nothing about the imported history and the imported history says
       nothing about it: the family neither answers the import with it nor lets
       it refuse the import, and because nothing is projected, an imported night
       for the same date is neither overwritten nor duplicated. Both records
       stand, each in its own store, and which one the screen shows stays N2's
       own rule rather than becoming this lane's.

   NO ENGINE, NO CLOCK, NO PLATFORM. This module reads operations and returns
   rows; the caller injects the N2 producer and the day it is standing on. */

const OP_CLASS = 'sleep';
const OP_KIND = 'fact';
const FAMILY = 'F8';
const CODE = 'LOCAL_SOURCE_SLEEP_UNRESOLVED';
const DATED_MEMBER = 'payload.night.date';
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function createSleepReplayFamily({commands, profile} = {}) {
  if (typeof commands?.validate !== 'function')
    throw new TypeError('The actual N2 sleep producer is required');
  if (typeof profile !== 'string' || !profile)
    throw new TypeError('The N2 sleep profile is required');

  /* (1) MEMBERSHIP, by class. A correction or tombstone of this class, or a
     fact under a profile this family has never been taught, is still OWNED -
     it is simply refused by name below rather than ignored. */
  function owns(op) { return !!op && op.class === OP_CLASS; }

  /* One record, read. Returns a retained family row, or a refusal carrying THIS
     family's code. `asOf` is the day admission is standing on: a night recorded
     after it cannot be placed, and is refused by name rather than borrowed into
     the future. The producer already refuses a night that has not finished
     (sleep-commands.cjs: `night.date >= effective.local_date`), so this asks
     only what admission itself must ask. */
  function read(op, {readOperation, asOf} = {}) {
    if (typeof readOperation !== 'function' || typeof asOf !== 'string' || !DAY_RE.test(asOf))
      throw new TypeError('A generation reader and the day admission stands on are required');
    if (!owns(op)) return null;
    const refuse = () => ({ok: false, code: CODE, op_id: op.op_id});
    if (op.kind !== OP_KIND || op.payload?.profile !== profile) return refuse();
    if (!commands.validate(op, readOperation)) return refuse();
    const recorded = op.effective.local_date, dated = op.payload.night.date;
    if (typeof dated !== 'string' || !DAY_RE.test(dated)) return refuse();
    if (recorded > asOf || dated > asOf) return refuse();
    return {ok: true, family: FAMILY, state: 'retained', op_id: op.op_id,
      dated, dated_member: DATED_MEMBER, device_seq: op.device_seq};
  }

  /* (3) The family's own order over the rows it accepted. */
  function order(rows) {
    return rows.slice().sort((a, b) => (a.dated < b.dated ? -1 : a.dated > b.dated ? 1
      : (a.device_seq || 0) - (b.device_seq || 0)));
  }

  /* The whole family, over every operation admission holds. EVERY owned
     operation leaves here either as a retained row or as a named refusal; the
     count is asserted so a future edit cannot drop one quietly. */
  function replay(operations, {readOperation, asOf} = {}) {
    const owned = (operations || []).filter(owns);
    const accepted = [], issues = [];
    for (const op of owned) {
      const row = read(op, {readOperation, asOf});
      if (row.ok) accepted.push(row); else issues.push({code: row.code, op_id: row.op_id});
    }
    if (accepted.length + issues.length !== owned.length)
      throw new Error('SLEEP_REPLAY_ACCOUNTING');
    const families = order(accepted).map(row => ({family: row.family, state: row.state,
      op_id: row.op_id, dated: row.dated, dated_member: row.dated_member}));
    return {families, issues, owned: owned.length};
  }

  return Object.freeze({owns, read, order, replay, PROFILE: profile,
    OP_CLASS, OP_KIND, FAMILY, CODE, DATED_MEMBER});
}

module.exports = {createSleepReplayFamily, OP_CLASS, OP_KIND, FAMILY, CODE, DATED_MEMBER};
