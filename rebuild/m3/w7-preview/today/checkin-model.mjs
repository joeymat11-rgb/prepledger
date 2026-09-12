// checkin-model.mjs — the recovery check-in's answer model and its adapter.
//
// It holds the sheet the athlete fills in and turns it into ONE dated operation
// through checkin-host.mjs. It computes NOTHING else: no score, no readiness, no
// penalty, no weighting, no summary of what the answers "mean". The only things
// derived here are dates and provenance, and both come from the preview clock the
// rest of the page already runs on.
//
// THE FOUR LAWS OF THIS SHEET, from rebuild/m1/approved-2026-09-08/
// RECOVERY-CHECKIN-C-NOTES.md and ADDITIONS-C-APPROVED-HANDOFF.md item 3/4:
//   1. Every answer starts UNSELECTED, and tapping a selected answer again clears it.
//   2. Blank means blank. None, zero and normal are NEVER inferred from absence —
//      an unanswered field is absent from the stored operation, not null and not "".
//   3. A cleared issue's hidden detail is not an active fact: deselecting Pain (or
//      clearing soreness, or answering None) drops that branch's detail here, so it
//      cannot be submitted, and checkin-commands.cjs refuses it again at the door.
//   4. A dated record that already exists is REUSED with its provenance visible and
//      confirmed, not asked for twice — and yesterday's answers are never today's.

import CheckInCommands from './checkin-commands.cjs';

const { CHOICES, ISSUES } = CheckInCommands;

/* Copy this preview owns. The approved prototype stores nothing, confirms nothing and
   refuses nothing, so it has no words for any of this; each line is checked to be
   ABSENT from the approved references by design.cjs, so this list can never be used
   to smuggle approved-looking words in. */
export const NOTHING_YET =
  'Nothing is recorded yet. Every answer is blank, and blank means unknown: never none, never zero.';
export const ALREADY_RECORDED =
  'Today’s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet.';
export const NOTHING_ANSWERED =
  'Answer at least one question, or leave the check-in for today. Nothing was recorded.';
export const NO_STORE =
  'This device could not open its encrypted local store, so no check-in can be recorded here.';
export const SLEEP_KNOWN_LEAD = 'Your sleep record already has last night.';
export const SLEEP_RECORD_PREFIX = 'From your sleep record for ';
export const RECORDED_AT_PREFIX = 'Recorded today at ';
export const PLAN_UNCHANGED =
  'Your plan is unchanged: nothing in this check-in reaches a training rule yet.';
export const HOURS_OUT_OF_RANGE =
  'An approximate sleep length is recorded between 0 and 24 hours. Nothing was recorded.';
export const DAYS_INVALID =
  'Days away from training is recorded as a whole number of days. Nothing was recorded.';
export const SAVE_REFUSED =
  'This check-in could not be recorded on this device, and no part of it was recorded.';

/* The approved design's own question wording, composed beside a stored value when the
   screen reads a recorded check-in back. Each is checked against the approved
   references AND against this source by design.cjs, exactly as A1's four runtime
   strings and A2's are. */
const LABELS = Object.freeze({
  sleep_hours: 'Last night’s sleep',
  sleep_quality: 'How was the quality?',
  energy: 'Energy right now',
  soreness: 'Muscle soreness right now',
  soreness_location: 'Which muscles?',
  soreness_impact: 'Does it affect your usual movement?',
  stress: 'Stress right now',
  issues: 'Anything else affecting today?',
  pain_location: 'Where, and during which movement?',
  pain_change: 'Is this new or changed?',
  pain_impact: 'How does it affect movement?',
  illness_note: 'What symptoms, and when did they start?',
  away_days: 'About how many days away from training?',
  away_reason: 'What was the reason?',
  note: 'Anything the answers missed?',
});
/* The approved design's own words for each issue, kept in ONE place so the button,
   the stored value and the read-back can never drift apart. */
const ISSUE_WORDS = Object.freeze({ pain: 'Pain', illness: 'Feeling ill', away: 'Time away' });

const HOURS_MIN = 0, HOURS_MAX = 24;
const TEXT_FIELDS = Object.freeze(['soreness_location', 'pain_location', 'illness_note', 'away_reason', 'note']);
const SORE_DETAIL = Object.freeze(['soreness_location', 'soreness_impact']);
const ISSUE_DETAIL = Object.freeze({ pain: ['pain_location', 'pain_change', 'pain_impact'],
  illness: ['illness_note'], away: ['away_days', 'away_reason'] });

export const dayBefore = iso => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
};

/* THE EXISTING DATED RECORD (approved handoff item 4). The engine's sleep record is
   `state.sleep.nights`, whose shape is `{ d, h, bed, wake, … }` — rebuild/engine/sleep.cjs
   is the authority and it reads `n.h` as hours and `n.d` as the date of the night.
   "Last night" for a check-in on `day` is the night dated the day before it. There is
   no quality field anywhere in that shape, which is why sleep QUALITY is check-in data
   and never a sleep night (seam S2). */
export function sleepNightFor(engineState, day) {
  const nights = engineState && engineState.sleep && Array.isArray(engineState.sleep.nights)
    ? engineState.sleep.nights : [];
  const date = dayBefore(day);
  const night = nights.find(n => n && n.d === date && typeof n.h === 'number' && Number.isFinite(n.h));
  return night ? Object.freeze({ date, hours: night.h }) : null;
}

/* ---------------------------------------------------------------------------
   THE SHEET. Pure: no DOM, no storage, no clock. Every answer starts unselected.
   --------------------------------------------------------------------------- */
export function createCheckInDraft({ sleepRecord = null } = {}) {
  const choices = { sleep_quality: null, energy: null, soreness: null, stress: null };
  const issues = { pain: false, illness: false, away: false };
  const fields = { sleep_hours: '', soreness_location: '', soreness_impact: '',
    pain_location: '', pain_change: '', pain_impact: '', illness_note: '',
    away_days: '', away_reason: '', note: '' };
  /* null = the athlete has said nothing about the existing record yet. */
  let sleepConfirm = null;

  const clear = names => { for (const name of names) fields[name] = ''; };

  function choose(group, label) {
    if (!Object.hasOwn(choices, group)) throw new TypeError('unknown question ' + group);
    if (!CHOICES[group].includes(label)) throw new TypeError('unknown answer ' + label);
    /* LAW 1 — tapping the selected answer again clears it. */
    choices[group] = choices[group] === label ? null : label;
    /* LAW 3 — soreness detail exists only while there is soreness to detail. */
    if (group === 'soreness' && choices.soreness !== 'Mild' && choices.soreness !== 'Significant') clear(SORE_DETAIL);
    return choices[group];
  }
  function toggleIssue(name) {
    if (!Object.hasOwn(issues, name)) throw new TypeError('unknown issue ' + name);
    issues[name] = !issues[name];
    if (!issues[name]) clear(ISSUE_DETAIL[name]);         // LAW 3
    return issues[name];
  }
  function set(field, raw) {
    if (!Object.hasOwn(fields, field)) throw new TypeError('unknown field ' + field);
    fields[field] = raw === null || raw === undefined ? '' : String(raw);
    return fields[field];
  }
  /* The confirmation of an existing dated night, and its undo. Confirming is an
     answer, so tapping it again clears it back to "nothing said" — LAW 1 again. */
  function confirmSleep() { sleepConfirm = sleepConfirm === 'confirmed' ? null : 'confirmed'; return sleepConfirm; }
  function answerSleepHere() {
    sleepConfirm = sleepConfirm === 'rejected' ? null : 'rejected';
    if (sleepConfirm !== 'rejected') fields.sleep_hours = '';
    return sleepConfirm;
  }

  const askHours = () => !sleepRecord || sleepConfirm === 'rejected';
  function state() {
    return {
      choices: { ...choices }, issues: { ...issues }, fields: { ...fields },
      sleepRecord, sleepConfirm, askHours: askHours(),
      followups: { soreness: choices.soreness === 'Mild' || choices.soreness === 'Significant',
        pain: issues.pain, illness: issues.illness, away: issues.away },
    };
  }

  /* The answers, as the closed command takes them. Only what was actually answered;
     everything else is ABSENT (law 2). Refuses in words rather than storing a
     guessed number. */
  function answers() {
    const out = {};
    for (const [group, value] of Object.entries(choices)) if (value !== null) out[group] = value;
    if (sleepRecord && sleepConfirm === 'confirmed') {
      out.sleep_hours = sleepRecord.hours;
      out.sleep_hours_source = 'existing-record';
      out.sleep_hours_record_date = sleepRecord.date;
    } else if (askHours() && fields.sleep_hours.trim() !== '') {
      const hours = Number(fields.sleep_hours.trim());
      if (!Number.isFinite(hours) || hours < HOURS_MIN || hours > HOURS_MAX) {
        return { ok: false, copy: HOURS_OUT_OF_RANGE };
      }
      out.sleep_hours = hours;
      out.sleep_hours_source = 'entered';
    }
    const chosen = ISSUES.filter(name => issues[name]);
    if (chosen.length) out.issues = chosen;
    if (choices.soreness === 'Mild' || choices.soreness === 'Significant') {
      if (fields.soreness_location.trim() !== '') out.soreness_location = fields.soreness_location.trim();
      if (fields.soreness_impact !== '') out.soreness_impact = fields.soreness_impact;
    }
    if (issues.pain) {
      if (fields.pain_location.trim() !== '') out.pain_location = fields.pain_location.trim();
      if (fields.pain_change !== '') out.pain_change = fields.pain_change;
      if (fields.pain_impact !== '') out.pain_impact = fields.pain_impact;
    }
    if (issues.illness && fields.illness_note.trim() !== '') out.illness_note = fields.illness_note.trim();
    if (issues.away) {
      if (fields.away_days.trim() !== '') {
        const days = Number(fields.away_days.trim());
        if (!Number.isInteger(days) || days < 0) return { ok: false, copy: DAYS_INVALID };
        out.away_days = days;
      }
      if (fields.away_reason.trim() !== '') out.away_reason = fields.away_reason.trim();
    }
    if (fields.note.trim() !== '') out.note = fields.note.trim();
    if (Object.keys(out).length === 0) return { ok: false, copy: NOTHING_ANSWERED };
    return { ok: true, answers: out };
  }

  return { choose, toggleIssue, set, confirmSleep, answerSleepHere, state, answers,
    TEXT_FIELDS, HOURS_MIN, HOURS_MAX };
}

/* ---------------------------------------------------------------------------
   THE READ-BACK. A stored check-in, in the approved design's own question wording
   beside the athlete's own answer. It adds no adjective and no judgement.
   --------------------------------------------------------------------------- */
export function recordedLines(row) {
  const a = row.answers || {};
  const out = [];
  const quantity = value => (value && typeof value === 'object' && Number.isFinite(value.value)
    ? value.value + ' ' + value.unit : null);
  if (a.sleep_hours) {
    const hours = quantity(a.sleep_hours);
    out.push(LABELS.sleep_hours + ': ' + hours
      + (a.sleep_hours_source === 'existing-record' && a.sleep_hours_record_date
        ? ' · ' + SLEEP_RECORD_PREFIX + a.sleep_hours_record_date : ''));
  }
  for (const key of ['sleep_quality', 'energy', 'soreness', 'soreness_location', 'soreness_impact', 'stress']) {
    if (a[key] !== undefined) out.push(LABELS[key] + ': ' + a[key]);
  }
  if (Array.isArray(a.issues) && a.issues.length) {
    out.push(LABELS.issues + ': ' + a.issues.map(name => ISSUE_WORDS[name]).join(', '));
  }
  for (const key of ['pain_location', 'pain_change', 'pain_impact', 'illness_note']) {
    if (a[key] !== undefined) out.push(LABELS[key] + ': ' + a[key]);
  }
  if (a.away_days) out.push(LABELS.away_days + ': ' + quantity(a.away_days));
  if (a.away_reason !== undefined) out.push(LABELS.away_reason + ': ' + a.away_reason);
  if (a.note !== undefined) out.push(LABELS.note + ': ' + a.note);
  return out;
}

/* ---------------------------------------------------------------------------
   THE ADAPTER over the durable lane.
   --------------------------------------------------------------------------- */
export function createCheckInModel({ host = null, day, engineState = null } = {}) {
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new TypeError('createCheckInModel requires day');
  const sleepRecord = sleepNightFor(engineState, day);
  let draft = createCheckInDraft({ sleepRecord });
  let recorded = null;              // today's stored check-in, or null
  let message = null;

  /* THE DATE LAW (law 4). Only operations effective for THIS day are read back. A
     check-in recorded yesterday — including one in which the athlete denied a
     symptom — is never shown as today's and never pre-fills today's sheet. */
  async function refresh() {
    if (!host) { recorded = null; return recorded; }
    const rows = await host.forDate(day);
    recorded = rows.length ? rows[rows.length - 1] : null;
    return recorded;
  }

  function read() {
    return {
      day, durable: !!host, sleepRecord, message,
      recorded: recorded
        ? { date: recorded.date, time: recorded.time, op_id: recorded.op_id,
            answers: JSON.parse(JSON.stringify(recorded.answers)), lines: recordedLines(recorded),
            provenance: recorded.time ? RECORDED_AT_PREFIX + recorded.time : null }
        : null,
      draft: draft.state(),
      note: recorded ? PLAN_UNCHANGED : NOTHING_YET,
    };
  }

  async function save() {
    if (recorded) { message = { ok: false, copy: ALREADY_RECORDED }; return { ok: false, copy: ALREADY_RECORDED }; }
    const built = draft.answers();
    if (!built.ok) { message = { ok: false, copy: built.copy }; return { ok: false, copy: built.copy }; }
    if (!host) { message = { ok: false, copy: NO_STORE }; return { ok: false, copy: NO_STORE }; }
    let result;
    try { result = await host.save(built.answers); }
    catch (error) { result = { ok: false, copy: SAVE_REFUSED, code: error && error.message ? error.message : null }; }
    await refresh();
    if (!result.ok) {
      /* The layer's own words when it gave any, and this preview's neutral sentence
         otherwise. Nothing partial can survive: the operation and its outbox entry
         are one repository transaction. */
      const copy = [result.copy, result.code].filter(x => typeof x === 'string' && x.trim()).join(' · ') || SAVE_REFUSED;
      message = { ok: false, state: result.state, copy };
      return { ok: false, state: result.state, copy };
    }
    message = { ok: true, copy: PLAN_UNCHANGED };
    return { ok: true, op_id: result.op_id, copy: PLAN_UNCHANGED };
  }

  /* Re-open the durable lane from disk: the page-reload path, without a page reload. */
  async function reopen() {
    message = null;
    draft = createCheckInDraft({ sleepRecord });
    if (host) await host.restart();
    await refresh();
    return read();
  }

  return { read, save, refresh, reopen, day, host, sleepRecord,
    draft: () => draft, recorded: () => recorded };
}

export default { createCheckInModel, createCheckInDraft, sleepNightFor, recordedLines, dayBefore,
  NOTHING_YET, ALREADY_RECORDED, NOTHING_ANSWERED, NO_STORE, SLEEP_KNOWN_LEAD, SLEEP_RECORD_PREFIX,
  RECORDED_AT_PREFIX, PLAN_UNCHANGED, HOURS_OUT_OF_RANGE, DAYS_INVALID, SAVE_REFUSED, LABELS, ISSUE_WORDS };
