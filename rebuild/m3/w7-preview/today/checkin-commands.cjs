"use strict";

/* checkin-commands.cjs — the CLOSED command that turns a finished check-in into ONE
   operation of rebuild/client's own A3 envelope. It is the shape the accepted client
   already knows: kind "fact", class "event" — both members of the accepted
   rebuild/client/ops.cjs KINDS and CLASSES lists, so nothing here is a new law, a new
   kind, or an edit to the client.

   THE SEAM THIS SITS IN, SAID PLAINLY (A3 report §seams). The accepted client has ONE
   named action per fact it can write, and none of them is a check-in: `weighIn`
   (class reading), `logSet`/`logSession`/`finishSession` (class session), the plan
   verbs. The accepted stage's command set (rebuild/m3/w6/t2-stage.cjs) is exactly
   {weighIn, logSet, logSession, finishSession, workout}. Of those, `workout` is the
   only PRODUCER-INJECTED one: the client does not author its class, kind or payload —
   a `workoutCommands` provider does, and createT2Stage takes that provider as an
   argument. So this file IS that provider for the check-in lane, and it is the only
   way a dated non-workout fact can be written without editing rebuild/client or
   rebuild/m3/w6/t2-stage.cjs, neither of which this slice owns.

   What that costs, disclosed rather than hidden: the verb the client and the stage
   spell is still "workout" (the check-in lane's own database, namespace and lease are
   separate from the gym's, so no workout is touched and no workout can touch this),
   and the operation carries schema_version 2 because the client stamps every
   producer-injected command with 2 and refuses a lease of any other schema. The
   RIGHT fix is a non-workout fact command in rebuild/client — exactly the "missing
   non-workout command/projection contracts" the approved handoff's RECOVERY-NUTRITION-01
   assessment already found. Recorded as seam S1.

   NOTHING HERE INTERPRETS AN ANSWER. There is no score, no weight, no numeric
   derivation: the payload is the athlete's own choices, verbatim, plus the units the
   envelope law requires on a quantity. An answer that was not given is ABSENT — never
   null, never zero, never "none". */

const PROFILE = "earned/recovery-checkin/v1";

/* Every field a check-in may carry, and what it may be. A field not listed is
   refused; a field listed but absent from the request stays absent from the payload.
   `choice` fields carry the approved design's own words (stable wording is a stated
   principle of the approved notes), `text` fields carry the athlete's own prose, and
   `quantity` fields become {value, unit} exactly as the A3 envelope requires. */
const CHOICES = Object.freeze({
  sleep_quality: ["Poor", "Okay", "Good"],
  energy: ["Low", "Moderate", "High"],
  soreness: ["None", "Mild", "Significant"],
  stress: ["Low", "Moderate", "High"],
  soreness_impact: ["No", "A little", "Quite a lot", "Not sure"],
  pain_change: ["New", "Worse than before", "Ongoing, unchanged", "Improving", "Not sure"],
  pain_impact: ["No noticeable effect", "I change how I move", "I cannot do the movement", "Not sure"],
});
const QUANTITIES = Object.freeze({ sleep_hours: "h", away_days: "day" });
const TEXTS = Object.freeze(["soreness_location", "pain_location", "illness_note", "away_reason", "note"]);
const ISSUES = Object.freeze(["pain", "illness", "away"]);
/* Where a sleep-hours answer came from. "entered" = the athlete typed it here;
   "existing-record" = the athlete CONFIRMED a dated night the record already held,
   and the date of that night travels with it. There is no third value, and an
   unconfirmed record is never a source. */
const SLEEP_SOURCES = Object.freeze(["entered", "existing-record"]);
const FIELDS = Object.freeze([...Object.keys(CHOICES), ...Object.keys(QUANTITIES), ...TEXTS,
  "issues", "sleep_hours_source", "sleep_hours_record_date"]);

const TEXT_MAX = 400;
const isMap = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const bad = () => { throw new TypeError("CHECKIN_INPUT_INVALID"); };

/* The answers, validated field by field. Returns a fresh plain object holding ONLY
   the fields that were actually answered. */
function answersOf(input) {
  if (!isMap(input)) bad();
  const out = {};
  for (const key of Object.keys(input)) if (!FIELDS.includes(key)) bad();
  for (const [key, allowed] of Object.entries(CHOICES)) {
    if (!Object.hasOwn(input, key)) continue;
    if (typeof input[key] !== "string" || !allowed.includes(input[key])) bad();
    out[key] = input[key];
  }
  for (const [key, unit] of Object.entries(QUANTITIES)) {
    if (!Object.hasOwn(input, key)) continue;
    const value = input[key];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) bad();
    out[key] = { value, unit };
  }
  for (const key of TEXTS) {
    if (!Object.hasOwn(input, key)) continue;
    const value = input[key];
    if (typeof value !== "string" || value.trim() === "" || value.length > TEXT_MAX) bad();
    out[key] = value;
  }
  if (Object.hasOwn(input, "issues")) {
    const list = input.issues;
    if (!Array.isArray(list) || list.length === 0 || list.length > ISSUES.length) bad();
    if (list.some((x) => typeof x !== "string" || !ISSUES.includes(x))) bad();
    if (new Set(list).size !== list.length) bad();
    out.issues = ISSUES.filter((x) => list.includes(x));   // stable order, never the caller's
  }
  if (Object.hasOwn(input, "sleep_hours_source")) {
    if (!Object.hasOwn(out, "sleep_hours")) bad();          // a source with no value is not a fact
    if (!SLEEP_SOURCES.includes(input.sleep_hours_source)) bad();
    out.sleep_hours_source = input.sleep_hours_source;
  } else if (Object.hasOwn(out, "sleep_hours")) bad();      // a value with no source is not traceable
  if (Object.hasOwn(input, "sleep_hours_record_date")) {
    if (out.sleep_hours_source !== "existing-record") bad();
    if (typeof input.sleep_hours_record_date !== "string"
      || !/^\d{4}-\d{2}-\d{2}$/.test(input.sleep_hours_record_date)) bad();
    out.sleep_hours_record_date = input.sleep_hours_record_date;
  } else if (out.sleep_hours_source === "existing-record") bad();
  /* A check-in with no answer at all is not a fact about anything and is refused
     BEFORE anything is written. Blank stays blank; it never becomes a record. */
  if (Object.keys(out).length === 0) bad();
  /* Detail that belongs to an issue the athlete did not select cannot travel: a
     cleared issue's hidden detail is not an active fact (approved handoff item 4). */
  const issues = out.issues || [];
  if (!issues.includes("pain") && ["pain_location", "pain_change", "pain_impact"].some((k) => Object.hasOwn(out, k))) bad();
  if (!issues.includes("illness") && Object.hasOwn(out, "illness_note")) bad();
  if (!issues.includes("away") && ["away_days", "away_reason"].some((k) => Object.hasOwn(out, k))) bad();
  /* Soreness detail belongs to a soreness answer that HAS detail to give. "None" is
     an answer, not a level, and carries no location or impact. */
  if (out.soreness !== "Mild" && out.soreness !== "Significant"
    && ["soreness_location", "soreness_impact"].some((k) => Object.hasOwn(out, k))) bad();
  return out;
}

/* The inverse of the quantity rule, for re-checking a payload that has already been
   built: a stored quantity is exactly {value, unit} with THIS field's unit and nothing
   else. Turning it back into the number lets one validator judge both the request and
   the envelope, so the two can never drift apart. */
function unquantify(answers) {
  if (!isMap(answers)) bad();
  const out = {};
  for (const [key, value] of Object.entries(answers)) {
    if (!Object.hasOwn(QUANTITIES, key)) { out[key] = value; continue; }
    if (!isMap(value) || Object.keys(value).length !== 2 || value.unit !== QUANTITIES[key]) bad();
    out[key] = value.value;
  }
  return out;
}

function prepare(request) {
  if (!isMap(request) || Object.keys(request).length !== 2
    || request.action !== "checkin" || !isMap(request.input)) bad();
  const input = request.input;
  for (const key of Object.keys(input)) if (key !== "answers" && key !== "effective") bad();
  const action = { class: "event", kind: "fact",
    payload: { profile: PROFILE, answers: answersOf(input.answers) },
    parents: [] };
  if (Object.hasOwn(input, "effective")) {
    const e = input.effective;
    if (!isMap(e) || Object.keys(e).length !== 3
      || !["local_date", "local_time", "utc_offset"].every((k) => typeof e[k] === "string")) bad();
    action.effective = { local_date: e.local_date, local_time: e.local_time, utc_offset: e.utc_offset };
  }
  return action;
}

/* The shape the client re-checks on the envelope it actually built, after its own
   Ops.build. It re-derives nothing: it asserts that what is about to be written is a
   check-in fact, carries a validated answer map, and names no parent the log does not
   already hold. */
function validate(op, readOperation) {
  if (!op || op.kind !== "fact" || op.class !== "event") return false;
  if (!op.effective || !/^\d{4}-\d{2}-\d{2}$/.test(op.effective.local_date)) return false;
  if (!isMap(op.payload) || op.payload.profile !== PROFILE || !isMap(op.payload.answers)) return false;
  if (Object.keys(op.payload).length !== 2) return false;
  try { answersOf(unquantify(JSON.parse(JSON.stringify(op.payload.answers)))); } catch { return false; }
  if (!Array.isArray(op.causal_parents)) return false;
  for (const id of op.causal_parents) {
    const parent = readOperation(id);
    if (!parent || parent.athlete_id !== op.athlete_id) return false;
  }
  return true;
}

function createCheckInCommands() {
  /* schemaVersion 2 is the accepted client's requirement for a producer-injected
     command, not a claim that a check-in is a workout. See the seam note above. */
  return Object.freeze({ schemaVersion: 2, prepare, validate });
}

module.exports = { createCheckInCommands, prepare, validate, PROFILE, CHOICES, QUANTITIES, TEXTS, ISSUES,
  SLEEP_SOURCES, FIELDS, TEXT_MAX, answersOf, unquantify };
