"use strict";

/* tool-kernel.cjs - the coach tools' shared kernel (Coach v1, S19 amend): the tag helpers, the turn-scoped
   traceability check, the charter lint, the tier-3 table, the envelopes and the leak guard. Moved byte for byte out
   of tools.cjs, which re-exports every name, so the page can carry the coach's READ tools (read-tools.cjs) without
   tools.cjs's FACT and PROPOSAL tools: the page laws (page-bundle P3-B4, writer-enumeration P3-EN3) keep the
   consent path and the engine revision off the Today boot graph. It requires nothing. */

// Diagnostics are data, and formatting them must never throw from a catch.
function provenance(value) {
  try {
    const message = value && value.message;
    const diagnostic = message === undefined ? value : message;
    return typeof diagnostic === "string" ? diagnostic : String(diagnostic);
  }
  catch { return "(unprintable)"; }
}
const UNKNOWN_TOOL_COPY = "I cannot use that tool here, so I did nothing.";

// Only these catch-all codes suppress renderer tails regardless of their copy:
// an arbitrary tool throw cannot justify any assertion about earlier writes.
const COMPLETE_REFUSALS = new Set([
  "WAVE1_TOOL_THREW", "ONBOARDING_TOOL_THREW", "COACH_MEMORY_TOOL_THREW",
]);
const refusalHasOwnEnding = (code) => COMPLETE_REFUSALS.has(code);

const TIER = Object.freeze({ READ: 0, FACT: 1, PROPOSAL: 2, REFUSED: 3 });

/* ---------------------------------------------------------------- tagging -- */

/* A number the coach is allowed to say, and the proof of where it came from.
   `display` is the EXACT string that may appear in a spoken answer; the
   traceability check reads its numeric tokens and nothing else. */
function tagged(turn_id, source, value, unit, display) {
  if (typeof turn_id !== "string" || !turn_id) throw new TypeError("tagged: turn_id required");
  if (typeof source !== "string" || !source) throw new TypeError("tagged: source required");
  const shown = display === undefined ? (value === null || value === undefined ? "" : String(value)) : String(display);
  return Object.freeze({ value: value === undefined ? null : value, unit, source, turn_id, display: shown });
}

/* A value the engine did not produce. Blank means unknown — never zero, never
   normal, never a filled-in default (approved handoff, point 4). */
function blank(turn_id, source, unit, why) {
  return Object.freeze({ value: null, unit, source, turn_id, display: "", blank: true, why: why || null });
}

const isNum = (n) => typeof n === "number" && Number.isFinite(n);
const num = (turn_id, source, n, unit, display) =>
  (isNum(n) ? tagged(turn_id, source, n, unit, display) : blank(turn_id, source, unit, "the engine did not produce this value"));
const text = (turn_id, source, s) =>
  (typeof s === "string" && s.trim() ? tagged(turn_id, source, s, "text", s) : blank(turn_id, source, "text", "the engine produced no sentence here"));

/* ------------------------------------------------------- traceability ------ */

/* UNIT-KEYED. Binding a number to the TURN is not enough: a protein gram count
   must not be able to travel into a calorie slot just because both were computed
   in the same breath (C5 review round 1, C2). So the allowed set is keyed on
   `unit + ":" + token`, every interpolation in coach-text.cjs DECLARES the unit
   it is speaking into, and the checker below reads each spoken number TOGETHER
   WITH the unit/field words around it. "Eat 155 calories" asks for `kcal:155`;
   a `g:155` tag does not license it.
   A date is not a quantity: a `date` tag licenses its components only where the
   sentence itself reads as a date, never as a bare number. */

/* Numeric tokens, comma-normalised. Sign is deliberately not part of a token:
   the risk this check exists to catch is an INVENTED QUANTITY, not a dropped
   minus sign, and "2030-01-07" must tokenise as three ordinary numbers. */
const TOKEN = /\d[\d,]*(?:\.\d+)?/g;
function numericTokens(s) {
  const out = [];
  const src = String(s === null || s === undefined ? "" : s);
  let m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(src)) !== null) out.push(m[0].replace(/,/g, ""));
  return out;
}

/* Every tagged value reachable in a tool result, however deeply nested. */
function collectTagged(node, out) {
  out = out || [];
  if (!node || typeof node !== "object") return out;
  if (typeof node.source === "string" && typeof node.turn_id === "string" && "display" in node) { out.push(node); return out; }
  if (Array.isArray(node)) { for (const v of node) collectTagged(v, out); return out; }
  for (const v of Object.values(node)) collectTagged(v, out);
  return out;
}

/* The unit each spoken word asks for. The canon on the right is exactly the set
   of units the tags in this file declare. */
const UNIT_WORDS = Object.freeze({
  kcal: "kcal", kcals: "kcal", cal: "kcal", cals: "kcal", calorie: "kcal", calories: "kcal",
  "kcal/day": "kcal", "kcal/d": "kcal", "kcals/day": "kcal",
  g: "g", gram: "g", grams: "g",
  lb: "lb", lbs: "lb", pound: "lb", pounds: "lb",
  "lb/wk": "lb/wk", "lbs/wk": "lb/wk", "lb/week": "lb/wk",
  set: "set", sets: "set",
  rep: "rep", reps: "rep",
  lift: "lift", lifts: "lift",
  reading: "reading", readings: "reading",
  day: "day", days: "day",
  h: "h", hr: "h", hrs: "h", hour: "h", hours: "h",
  min: "min", mins: "min", minute: "min", minutes: "min",
  week: "wk", weeks: "wk", wk: "wk",
  percent: "pct", pct: "pct", pp: "pct",
});

/* Nouns that name a FIELD rather than a unit. They are read LEFTWARD, because
   that is where a label and a subject sit: "Protein: 2262", "Your calorie floor
   is 155", "You weigh 2262". Without this the checker read only rightward and a
   sentence with the unit word deleted went straight through (review round 2, C8). */
const FIELD_WORDS = Object.freeze(Object.assign({}, UNIT_WORDS, {
  protein: "g",
  maintenance: "kcal", tdee: "kcal", ate: "kcal", eat: "kcal", eating: "kcal",
  weight: "lb", weigh: "lb", weighs: "lb", weighed: "lb", bodyweight: "lb", trend: "lb",
  rest: "min", sleep: "h", slept: "h",
}));

/* Words a number may travel over on its way to its unit or its field. They carry
   no field of their own — "between 2262 and 2360 calories" is a calorie band,
   "2030 weekly sets" is a set count, and "your calorie band today is 2262" is
   still a calorie band. Anything NOT on this list ends the scan. */
const UNIT_FILLER = new Set(["a", "an", "the", "and", "or", "to", "of", "at", "about", "around",
  "roughly", "approximately", "between", "somewhere", "least", "most", "more", "up", "over",
  "under", "per", "weekly", "daily", "this", "that", "your", "my", "total", "plus", "minus",
  "extra", "additional", "another", "some", "is", "are", "was", "were", "than", "add", "adding",
  "target", "targets", "floor", "ceiling", "band", "level", "range", "limit", "goal", "cap",
  "count", "average", "figure", "number", "today", "now", "currently", "still", "only", "just"]);

const STOP_PUNCT = /^[.!?;]$/;
const ATOM = /(\d[\d,]*(?:\.\d+)?)|([A-Za-z][A-Za-z/'-]*)|(\S)/g;
const ISO_DATE = /\d{4}-\d{2}-\d{2}/g;
const UNKNOWN_UNIT = "?";
/* An unrecognised noun beside a number is NOT "no unit" — that was the hole. It
   is a unit this file does not know, and it licenses nothing but itself: "155
   seconds" is not "155 minutes", and "155 kilograms" is not "155 lb". */
const unknownNoun = (word) => "!" + word;

/* WHICH UNITS MAY BE SPOKEN BARE, and only these. Counts are unitless in
   ordinary speech ("set 1 of 3", "28 readings" → "28"), and a figure the ENGINE
   ITSELF stated with no unit may be repeated with no unit. Everything else must
   be spoken with its unit: a calorie band, a protein floor, a bodyweight, a
   rate, a duration — and A DATE. `date` is deliberately absent: the components
   of "2030-02-04" are not a quantity in any field. */
const BARE_SPEAKABLE = Object.freeze(new Set(["set", "rep", "lift", "reading", "pct", UNKNOWN_UNIT]));

/* `4 sets a week` and `1.19 pounds a week` are rates, and the engine tags them
   as such (`lb/wk`). The rate words are read here so the spoken form matches the
   tag rather than fighting it. */
function perWeek(unit, atoms, from) {
  if (unit === "wk" || unit.indexOf("/") >= 0) return unit;
  const a = atoms[from], b = atoms[from + 1];
  if (a && a.kind === "word" && a.v === "weekly") return unit + "/wk";
  if (a && a.kind === "word" && (a.v === "a" || a.v === "per" || a.v === "each")
    && b && b.kind === "word" && (b.v === "week" || b.v === "wk")) return unit + "/wk";
  return unit;
}

/* RIGHTWARD: the first unit word after the number, crossing only other numbers,
   punctuation and the filler above, and never crossing the end of the clause.
   A recognised unit word gives that unit; an unrecognised noun gives `!noun`;
   reaching the end of the clause gives `null`, and the leftward scan gets its
   turn. */
function unitAfter(atoms, from) {
  for (let i = from; i < atoms.length; i++) {
    const a = atoms[i];
    if (a.kind === "num") continue;
    if (a.kind === "punct") { if (STOP_PUNCT.test(a.v)) return null; continue; }
    const unit = UNIT_WORDS[a.v];
    if (unit) return perWeek(unit, atoms, i + 1);
    if (UNIT_FILLER.has(a.v)) continue;
    return unknownNoun(a.v);
  }
  return null;
}

/* LEFTWARD: the field this number is being spoken INTO — the label form
   ("Protein: 2262") and the subject form ("your calorie floor is 155"). It binds
   only on a word this file knows; an unrecognised word ends the scan with no
   unit rather than inventing one, so the number falls to the bare rule. */
function unitBefore(atoms, from) {
  for (let i = from; i >= 0; i--) {
    const a = atoms[i];
    if (a.kind === "num") continue;
    if (a.kind === "punct") { if (STOP_PUNCT.test(a.v)) return null; continue; }
    const unit = FIELD_WORDS[a.v];
    if (unit) return unit;
    if (UNIT_FILLER.has(a.v)) continue;
    return null;
  }
  return null;
}

/* Every number in a string, with the unit its own words ask for. */
function parseUnits(s) {
  const src = String(s === null || s === undefined ? "" : s);
  const dates = [];
  ISO_DATE.lastIndex = 0;
  let dm;
  while ((dm = ISO_DATE.exec(src)) !== null) dates.push([dm.index, dm.index + dm[0].length]);
  const inDate = (i) => dates.some(([lo, hi]) => i >= lo && i < hi);

  const atoms = [];
  ATOM.lastIndex = 0;
  let m;
  while ((m = ATOM.exec(src)) !== null) {
    if (m[1] !== undefined) atoms.push({ kind: "num", v: m[1].replace(/,/g, ""), at: m.index });
    else if (m[2] !== undefined) atoms.push({ kind: "word", v: m[2].toLowerCase().replace(/[-']+$/, ""), at: m.index });
    else atoms.push({ kind: "punct", v: m[3], at: m.index });
  }
  const out = [];
  for (let i = 0; i < atoms.length; i++) {
    if (atoms[i].kind !== "num") continue;
    let unit;
    if (inDate(atoms[i].at)) unit = "date";
    else {
      unit = unitAfter(atoms, i + 1);                 /* the unit it is spoken in */
      if (unit === null) unit = unitBefore(atoms, i - 1);   /* else the field it is spoken into */
    }
    out.push({ token: atoms[i].v, unit });
  }
  return out;
}

/* The numbers a turn is allowed to say, KEYED ON UNIT: a map from token to the
   set of units the tools licensed it in, drawn from the tagged values the tools
   returned IN THAT TURN and nothing else. A tag that declares a real unit
   licenses its tokens in that unit; engine PROSE (unit `text`) is read with the
   same parser a spoken sentence is read with, so the prose's own unit words —
   "2300 kcal on 8,500 steps" — are what it licenses. */
function allowedTokens(results, turn_id) {
  const allowed = new Map();
  const add = (token, unit) => {
    if (!allowed.has(token)) allowed.set(token, new Set());
    allowed.get(token).add(unit || UNKNOWN_UNIT);
  };
  for (const r of results || []) {
    if (turn_id && r && r.turn_id !== turn_id) continue;
    for (const t of collectTagged(r)) {
      if (turn_id && t.turn_id !== turn_id) continue;
      const declared = typeof t.unit === "string" && t.unit ? t.unit : null;
      const spoken = parseUnits(t.display);
      if (declared === null || declared === "text") for (const p of spoken) add(p.token, p.unit);
      else for (const p of spoken) add(p.token, p.unit === "date" ? "date" : declared);
    }
  }
  return allowed;
}

/* FAIL-CLOSED. Returns every numeric token in `answer` that no tool result from
   the same turn accounts for IN THE UNIT THE SENTENCE ASKS FOR. An empty array
   is the only passing answer. */
function untraceable(answer, results, turn_id) {
  const allowed = allowedTokens(results, turn_id);
  const bad = [];
  for (const spoken of parseUnits(answer)) {
    const units = allowed.get(spoken.token);
    if (!units) { bad.push(spoken.token); continue; }
    if (spoken.unit === null) {
      /* A bare number: no unit word after it and no field word before it, inside
         its own clause. Only a BARE_SPEAKABLE licensing unit saves it — a count,
         or a figure the engine itself stated bare. A calorie band, a protein
         floor, a bodyweight, a rate, a duration and a DATE all refuse. */
      let licensed = false;
      for (const u of units) if (BARE_SPEAKABLE.has(u)) { licensed = true; break; }
      if (!licensed) bad.push(spoken.token);
      continue;
    }
    if (!units.has(spoken.unit)) bad.push(spoken.token);
  }
  return bad;
}
const traceable = (answer, results, turn_id) => untraceable(answer, results, turn_id).length === 0;

/* ------------------------------------------------------- charter lint ------ */

/* "No urgency, streaks, gamification, nudging or dark patterns in the coach's
   voice; misses are stated plainly, never softened or dramatized." The list is
   literal and it is tested against every transcript the prototype renders.
   Words already spent on a tracked quantity are NOT in here — that is the
   RESERVED list's job in the app's own suite; this is the charter's. */
const CHARTER_BANNED = Object.freeze([
  "streak", "don't break", "keep it going", "keep the chain", "hurry", "now or never",
  "last chance", "running out of time", "only a few left", "you're on fire", "on fire",
  "crushing it", "smashed it", "level up", "levelled up", "badge", "points", "xp",
  "bonus", "unlock", "achievement", "leaderboard", "combo", "don't lose your",
  "miss out", "today only", "act fast", "urgent", "hurry up", "beast mode",
  "no excuses", "let's go!", "you got this", "proud of you", "amazing work",
  "keep the momentum", "streaks", "daily goal met",
]);
/* Word-boundary matching, not substring: "explain" contains "xp" and a lint that
   fires on that is a lint nobody keeps. */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const charterRe = (phrase) => {
  const body = escapeRe(phrase).replace(/\s+/g, "\\s+");
  return new RegExp((/^\w/.test(phrase) ? "\\b" : "") + body + (/\w$/.test(phrase) ? "\\b" : ""), "i");
};
const CHARTER_PATTERNS = Object.freeze(CHARTER_BANNED.map((w) => ({ word: w, re: charterRe(w) })));
function charterViolations(transcriptText) {
  const hay = String(transcriptText || "");
  return CHARTER_PATTERNS.filter((p) => p.re.test(hay)).map((p) => p.word);
}

/* ------------------------------------------------- tier 3: never via coach -- */

const NEVER_VIA_COACH = Object.freeze({
  phase: "Phase changes require review in settings. A detected pattern does not establish the right goal for you, and this conversation cannot change your phase.",
  calorie_floor: "The calorie floor is a modeled estimate using the available lean-mass input and energy-availability formula, not a proved personal safety boundary. I can read the available number and reasoning; I cannot move it.",
  protein_floor: "The protein target is provisional, using the available lean-mass input, not a measured personal minimum. I can read it out and explain it; changing it is an owner decision in settings.",
  progression_rules: "How the next target is worked out is a rule in the engine, not a setting in this conversation. I can explain what it did and why; I cannot rewrite it.",
  consent_policy: "What needs your explicit yes, and how that yes is recorded, is not something a conversation can loosen. I can explain it.",
});
const TIER3_TOPICS = Object.freeze(Object.keys(NEVER_VIA_COACH));

/* ------------------------------------------------------------- envelopes -- */

const ok = (tool, tier, turn_id, values, extra) =>
  Object.freeze({ tool, tier, turn_id, ok: true, values: values || {}, ...(extra || {}) });

/* A tool that cannot answer says so with a CODE. Where the engine or the client
   already owns a code, that code is carried verbatim (`source_code`); where the
   slice simply has no seam, the code is in the COACH_ namespace and
   TOOL-CONTRACT.md names the file:line that proves it. */
const unavailable = (tool, tier, turn_id, code, reason, source) =>
  assertNoLeak(Object.freeze({ tool, tier, turn_id, ok: false,
    unavailable: Object.freeze({ code, reason, source: source || null }),
    /* The refusal's own words are a TOOL RESULT too. Carrying them as tagged
       values is what lets the coach read a client or engine refusal out loud —
       numbers inside it included — without inventing anything. */
    values: Object.freeze({
      code: tagged(turn_id, "coach.refusal.code", code, "code", ""),
      reason: text(turn_id, "coach.refusal." + code, reason),
    }),
    state_unchanged: true }));

const CODES = Object.freeze({
  CONFIRMATION_REQUIRED: "COACH_CONFIRMATION_REQUIRED",
  CHECKIN_SURFACE_ABSENT: "COACH_CHECKIN_SURFACE_ABSENT",
  CHECKIN_INPUT_INVALID: "CHECKIN_INPUT_INVALID",
  GYM_SESSION_ABSENT: "COACH_GYM_SESSION_ABSENT",
  NO_QUALIFIED_COMPARISON: "COACH_NO_QUALIFIED_COMPARISON",
  FACT_COMMAND_ABSENT: "COACH_FACT_COMMAND_ABSENT",
  REPLAN_ENTRY_ABSENT: "COACH_REPLAN_ENTRY_ABSENT",
  ENGINE_ISSUED_NO_PROPOSAL: "COACH_ENGINE_ISSUED_NO_PROPOSAL",
  CONSENT_SURFACE_ABSENT: "COACH_CONSENT_SURFACE_ABSENT",
  PROPOSAL_NOT_ENGINE_ISSUED: "COACH_PROPOSAL_NOT_ENGINE_ISSUED",
  /* P6-COACH-WIRE-2 (DECISIONS:456): recordIssuance() ran but reported
     stored:false, so respond() is never called. */
  CONSENT_ISSUANCE_NOT_STORED: "CONSENT_ISSUANCE_NOT_STORED",
  /* P4b-1 (the residual DECISIONS:458 ticketed for the next coach touch): the
     compensating accepted:false write ran and reported stored:false, so the
     durable issuances row still claims a yes the store does not hold. */
  CONSENT_ISSUANCE_NOT_COMPENSATED: "CONSENT_ISSUANCE_NOT_COMPENSATED",
  COST_CAP_ABSENT: "COACH_COST_CAP_ABSENT",
  COST_CAP_INVALID: "COACH_COST_CAP_INVALID",
});

/* Keys that must never leave the engine through this window. The coach sends
   "only what the question needs", never the ledger. */
const FORBIDDEN_KEYS = Object.freeze([
  "reads", "dailyLogs", "sessionLog", "sleep", "nights", "exercises", "feed", "queue",
  "state", "seed", "token", "GH_TOKEN", "identityKey", "storeKey", "signingKey", "lease", "authorityKey",
]);
function assertNoLeak(result) {
  const seen = [];
  (function walk(node, depth) {
    if (!node || typeof node !== "object" || depth > 8) return;
    if (Array.isArray(node)) { for (const v of node) walk(v, depth + 1); return; }
    for (const [k, v] of Object.entries(node)) {
      if (FORBIDDEN_KEYS.includes(k)) seen.push(k);
      walk(v, depth + 1);
    }
  })(result, 0);
  if (seen.length) throw new Error("COACH_TOOL_LEAK:" + [...new Set(seen)].join(","));
  return result;
}

/* Does an argument payload carry a number ANYWHERE — top level, nested in an
   object, or inside an array? (C5 review round 1, C6(i): the old guard read only
   the top level, so `{note:{sets:7}}` walked straight past it.) Numeric strings
   are deliberately NOT caught here: they are still just free text the engine
   never reads as a quantity, and the proposal's numbers come out of an engine
   producer either way. */
function carriesNumber(node, depth) {
  if (typeof node === "number") return true;
  if (!node || typeof node !== "object" || depth > 8) return false;
  if (Array.isArray(node)) return node.some((v) => carriesNumber(v, depth + 1));
  return Object.values(node).some((v) => carriesNumber(v, depth + 1));
}

module.exports = {
  provenance, UNKNOWN_TOOL_COPY, COMPLETE_REFUSALS, refusalHasOwnEnding, TIER, tagged, blank, isNum, num, text,
  TOKEN, numericTokens, collectTagged, UNIT_WORDS, FIELD_WORDS, UNIT_FILLER, STOP_PUNCT, ATOM, ISO_DATE,
  UNKNOWN_UNIT, unknownNoun, BARE_SPEAKABLE, perWeek, unitAfter, unitBefore, parseUnits, allowedTokens,
  untraceable, traceable, CHARTER_BANNED, escapeRe, charterRe, CHARTER_PATTERNS, charterViolations,
  NEVER_VIA_COACH, TIER3_TOPICS, ok, unavailable, CODES, FORBIDDEN_KEYS, assertNoLeak, carriesNumber,
};
