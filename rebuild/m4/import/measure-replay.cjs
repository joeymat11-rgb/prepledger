'use strict';
/* measure-replay.cjs - THE REPLAY FAMILY FOR THE S5 MEASURE OPERATIONS (F7).
   Lane D, ticket P3-REPLAY-MEASURE-FAMILY; the defect is open item 1 of
   rebuild/lanes/c/P3-IMPORT-UI-2-AUTHOR-REPORT.md, pinned by that branch's
   cell P3-X9 and found by its real-Edge run.

   WHAT WENT WRONG. rebuild/m3/w7-preview/measure/measure-host.mjs opens the
   SAME installation Today opens, so opening the Measure screen writes its
   trial-start operation (and, as the athlete uses the screen, a waist entry
   and the markers pick) into the very generation admission replays. Admission
   had a family for readings (F1), food (F2), workouts (F3), the setup and
   machine-settings documents (F4), the check-in (F5) and the source state's
   own historical decisions (F6), and none for these, so source-admission.mjs's
   replay fell to its catch-all and raised LOCAL_SOURCE_CONTEXT_UNRESOLVED:
   an installation that had opened Measure could not import its own history.

   WHAT THESE RECORDS ARE. All three are ONE accepted class,
   body-composition-source, kind fact, written by the ONE producer
   measure-commands.cjs (S5-sealed; not a byte of it is touched here):

     earned/waist/v1              a dated waist reading, payload.entry{date,in}
     earned/measure-markers/v1    a once-only pick of 3-4 lift names
     earned/measure-trial-start/v1  the trial's day one, payload.start

   They are athlete-local records that carry NO engine context of their own.
   THE RULES THIS FAMILY STATES, which is exactly what admission needs:

   (1) MEMBERSHIP. Every operation of class body-composition-source belongs to
       this family and to no other. It is a fact of one of the three profiles
       above and validates under the S5 producer's own validate(), or it is
       refused BY NAME as LOCAL_SOURCE_MEASURE_UNRESOLVED. Nothing of this
       class may be silently dropped, and nothing of this class may fall
       through to the catch-all again.
   (2) NOT SESSION OR PROGRAMME EVIDENCE. A waist reading is not a weigh-in,
       a marker pick is not a workout and a trial start is not a plan. None of
       them enters the reading projection, the daily projection, the workout
       projection or the programme proof, and none of them is applied to the
       replayed state: the family is 'retained', never 'projected', so the
       imported history's own numbers are what the state carries.
   (3) ORDERING is by the record's OWN dated field, then device_seq: the
       entry's date for a waist reading, the start for a trial start, and the
       recording day for the markers pick, which carries no date of its own.
       This orders the family's account of the records. It does NOT re-order
       the store: the operations are retained verbatim, and S5's own readers
       (waistRowsIn, measureMarkersIn, trialStartIn) keep reading them in
       their own device_seq order, unchanged.
   (4) NEITHER CONFIRM NOR CONTRADICT. These records say nothing about the
       imported history's programme, so the family neither answers the
       programme proof with them nor lets them refuse it. The baseline window
       stays the one derived from the import, and the trial start stays the
       first ENROLLED record's date as S5 defines it - an import writes no
       operation at all, so day one cannot move.

   NO ENGINE, NO CLOCK, NO PLATFORM. This module reads operations and returns
   rows; the caller injects the S5 producer and the day it is standing on. */

const OP_CLASS = 'body-composition-source';
const OP_KIND = 'fact';
const FAMILY = 'F7';
const CODE = 'LOCAL_SOURCE_MEASURE_UNRESOLVED';
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const WAIST = 'waist', MARKERS = 'markers', TRIAL_START = 'trial-start';

function createMeasureReplayFamily({commands, profiles} = {}) {
  if (typeof commands?.validate !== 'function')
    throw new TypeError('The actual S5 measure producer is required');
  const {waist, markers, trialStart} = profiles || {};
  if ([waist, markers, trialStart].some(p => typeof p !== 'string' || !p))
    throw new TypeError('The three S5 measure profiles are required');
  if (new Set([waist, markers, trialStart]).size !== 3)
    throw new TypeError('The three S5 measure profiles must be distinct');
  const measureOf = profile => profile === waist ? WAIST
    : profile === markers ? MARKERS : profile === trialStart ? TRIAL_START : null;

  /* (1) MEMBERSHIP, by class alone. A correction or tombstone of this class,
     or a fact under a profile this family has never been taught, is still
     OWNED - it is simply refused by name below rather than ignored. */
  function owns(op) { return !!op && op.class === OP_CLASS; }

  /* (3) The record's OWN dated field. The markers pick has none: it is a
     choice, not an observation, so the day it was recorded on stands for it
     and is labelled as such by `dated_member`. */
  function datedOf(op, measure) {
    if (measure === WAIST) return op.payload.entry.date;
    if (measure === TRIAL_START) return op.payload.start;
    return op.effective.local_date;
  }
  const datedMemberOf = measure => measure === WAIST ? 'payload.entry.date'
    : measure === TRIAL_START ? 'payload.start' : 'effective.local_date';

  /* One record, read. Returns a retained family row, or a refusal carrying
     THIS family's code. `asOf` is the day admission is standing on: a record
     dated after it cannot be placed, and is refused by name rather than
     borrowed into the future. */
  function read(op, {readOperation, asOf} = {}) {
    if (typeof readOperation !== 'function' || typeof asOf !== 'string' || !DAY_RE.test(asOf))
      throw new TypeError('A generation reader and the day admission stands on are required');
    if (!owns(op)) return null;
    const refuse = () => ({ok: false, code: CODE, op_id: op.op_id});
    const measure = op.kind === OP_KIND ? measureOf(op.payload && op.payload.profile) : null;
    if (!measure) return refuse();
    if (!commands.validate(op, readOperation)) return refuse();
    const recorded = op.effective.local_date, dated = datedOf(op, measure);
    if (typeof dated !== 'string' || !DAY_RE.test(dated)) return refuse();
    if (recorded > asOf || dated > asOf) return refuse();
    return {ok: true, family: FAMILY, state: 'retained', op_id: op.op_id,
      measure, dated, dated_member: datedMemberOf(measure), device_seq: op.device_seq};
  }

  /* (3) The family's own order over the rows it accepted. */
  function order(rows) {
    return rows.slice().sort((a, b) => (a.dated < b.dated ? -1 : a.dated > b.dated ? 1
      : (a.device_seq || 0) - (b.device_seq || 0)));
  }

  /* The whole family, over every operation admission holds. EVERY owned
     operation leaves here either as a retained row or as a named refusal;
     the count is asserted so a future edit cannot drop one quietly. */
  function replay(operations, {readOperation, asOf} = {}) {
    const owned = (operations || []).filter(owns);
    const accepted = [], issues = [];
    for (const op of owned) {
      const row = read(op, {readOperation, asOf});
      if (row.ok) accepted.push(row); else issues.push({code: row.code, op_id: row.op_id});
    }
    if (accepted.length + issues.length !== owned.length)
      throw new Error('MEASURE_REPLAY_ACCOUNTING');
    const families = order(accepted).map(row => ({family: row.family, state: row.state,
      op_id: row.op_id, measure: row.measure, dated: row.dated, dated_member: row.dated_member}));
    return {families, issues, owned: owned.length};
  }

  return Object.freeze({owns, read, order, replay,
    OP_CLASS, OP_KIND, FAMILY, CODE, WAIST, MARKERS, TRIAL_START});
}

module.exports = {createMeasureReplayFamily, OP_CLASS, OP_KIND, FAMILY, CODE,
  WAIST, MARKERS, TRIAL_START};
