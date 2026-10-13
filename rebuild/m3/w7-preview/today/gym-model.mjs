// gym-model.mjs — the gym card's adapter over the accepted capture layer.
//
// It computes NO target and NO plan number of its own. Every figure it hands the
// view is one of exactly three things:
//   1. a cell of the v2 prescription capture the accepted engine adapter produced
//      and the durable Start operation stored (load / reps / effort / reason / setup),
//   2. a value read back out of a stored operation through the client's own
//      projection (a recorded set's load, reps and effort),
//   3. a value the ACCEPTED engine reader returns for the SAME input the capture
//      was prepared from (the previous-performance context: card.prev, which the
//      engine returns as null whenever no comparison is qualified).
// There is no arithmetic here, no rounding, no default and no fallback figure.
//
// Refusals are never reworded and never swallowed: the capture layer's own code
// and its own copy are carried to the screen exactly as returned, and a refusal
// changes nothing, on screen or on disk.

import EditValues from '../../../m4/workout/edit-values.cjs';

/* THE EFFORT DOMAIN IS THE ACCEPTED ONE. rebuild/m4/workout/edit-values.cjs
   reserve() is the only definition of a recordable effort, and it admits exactly
   exact 0 / 1 / 2, at_least 3, and the three non-numeric tags. The five choices
   below are the approved design's own choice set; each is checked against that
   predicate at load time, so a choice this app offers can never be one the
   accepted layer would refuse, and the unknown choice stores the tag "unknown" —
   never a number, never an omission. NOTHING is preselected. */
export const EFFORT_CHOICES = Object.freeze([
  { label: '0', reserve: Object.freeze({ tag: 'exact', value: 0, unit: 'rep' }) },
  { label: '1', reserve: Object.freeze({ tag: 'exact', value: 1, unit: 'rep' }) },
  { label: '2', reserve: Object.freeze({ tag: 'exact', value: 2, unit: 'rep' }) },
  { label: '3+', reserve: Object.freeze({ tag: 'at_least', value: 3, unit: 'rep' }) },
  { label: 'Unsure', reserve: Object.freeze({ tag: 'unknown' }) },
]);
for (const choice of EFFORT_CHOICES) {
  if (!EditValues.reserve(choice.reserve)) throw new Error('GYM_EFFORT_CHOICE_NOT_IN_ACCEPTED_DOMAIN');
}

export const CHOOSE_EFFORT = 'Choose clean reps left, or Unsure.';
export const ENTER_PERFORMED = 'Enter the weight and reps you actually completed.';
/* S15 ROUND 5 POLISH, item 3 (PM UI pass, shot 14). A weight or reps the accepted layer can only refuse ("BW",
   "0", a word) used to reach it and come back as its own reason and code. The screen says it in plain words
   instead, before anything is sent, and keeps what he typed. Anything that IS a number still goes to the layer,
   which stays the judge of every other rule. */
export const LOAD_NOT_A_NUMBER = 'That weight cannot be saved. Enter it as a number above zero, like 25.';
export const REPS_NOT_A_NUMBER = 'Enter the reps as a whole number, like 10.';
export const UNDO_REASON = 'Undone on this device from the saved-set screen before the next set.';
/* S18: the reason recorded on the removal of an opened, empty workout when a routine change starts today. */
export const OPENED_EMPTY_REASON = 'Opened on this device with nothing recorded, and removed when the routine changed for today.';
/* P0-B r2/r3 (review findings 3, N5) - Start's own refusal while an enrolled
   installation's adoption is pending or never swapped the host. Exported at
   module level, exactly as the three copy constants above are, so a copy
   cell can assert it directly rather than duplicating the literal. r4
   (review, MINOR residual on N1): reworded true on every path that reaches
   it, including the one that never clears (a rejected or absent
   athleteState()) - the old wording promised something that path would
   never make true. */
export const ADOPTION_PENDING = 'Start is not available until this device can read your setup. Reload to try again.';

const clone = value => JSON.parse(JSON.stringify(value));
const cell = value => (value && typeof value.display === 'string' ? value : null);
const specified = value => (value && value.state === 'specified' && typeof value.source_json === 'string'
  ? JSON.parse(value.source_json) : null);

/* The saved effort, in the approved design's own plain words. Every branch is a
   tag the accepted domain defines; an unrecorded effort is never printed as a
   number and never silently dropped. */
export function effortWords(reserve) {
  if (!reserve || typeof reserve.tag !== 'string') return 'Effort unknown';
  // S15 polish item 9: one clean rep is singular.
  if (reserve.tag === 'exact') return reserve.value + (reserve.value === 1 ? ' clean rep left' : ' clean reps left');
  if (reserve.tag === 'at_least') return reserve.value + '+ clean reps left';
  return 'Effort unknown';
}

/* The prescription line, from the capture's own cells. A cell the engine did not
   specify prints the cell's OWN words ("Find a working load"), never a figure. */
export function prescriptionLine(slot) {
  if (!slot) return null;
  const load = cell(slot.load), reps = cell(slot.reps);
  if (!load || !reps) return null;
  /* A cell the engine did not specify prints the cell's OWN words ("Find a working
     load", "Record the reps performed"); a specified reps cell takes the approved
     unit after it. The load cell already carries its unit. */
  const repsText = reps.state === 'specified' ? reps.display + ' reps' : reps.display;
  return load.display + ' × ' + repsText;
}

/* The effort instruction, in the approved design's plain language, carrying the
   ENGINE's own number (capture effort target) and nothing else. */
export function effortInstruction(slot) {
  const effort = specified(slot && slot.effort);
  if (!effort || !Number.isSafeInteger(effort.target)) return null;
  return 'Aim to finish with ' + effort.target + (effort.target === 1 ? ' clean rep left.' : ' clean reps left.');
}

const sameSlot = (a, b) => a && b && a.logical_set_slot === b.logical_set_slot && a.lift_lineage_id === b.lift_lineage_id;

/* hostForDay(date) builds a host for a day that is NOT today, over the same device
   storage. It is needed for exactly one thing: closing a session the athlete
   abandoned on an earlier day. The accepted continuation prepares the CURRENT
   capture for the host's own day and refuses a slot mapping that does not match
   (WORKOUT_RESUME_SLOT_MAPPING_REQUIRED, executed), so the only host that can
   retire that session is one standing on the day it belongs to. When no factory is
   supplied the recovery is simply unavailable and says so; nothing is guessed. */
export function createGymModel({ gymHost, sessionTitle, hostForDay, onClosed } = {}) {
  if (!gymHost || !gymHost.host) throw new TypeError('createGymModel requires a composed gym host');
  /* P0 HIS NUMBERS - `current` is the LIVE handle this model reads and writes
     through. `gymHost` is composed by today-entry.mjs createWorkoutEntry BEFORE
     today-app.cjs mountToday adopts an enrolled installation's own athlete state
     onto the Today model (today-model.cjs adoptBasis), so it can still stand on
     whatever basis was current at boot time. rebase() below swaps it, at most
     once, for a fresh handle hostForDay(day) opens over the SAME device storage
     - hostForDay rereads model.stateFromOps() at CALL time, so calling it after
     adoption is what puts the athlete's own exercises on the card. `host`,
     `engine`, `day` and `plannedSplitSlotId` are `let` so every closure below
     that already reads them sees the rebased values with no other edit. */
  let current = gymHost;
  let host = current.host, engine = current.engine, day = current.day,
    plannedSplitSlotId = current.plannedSplitSlotId;
  let client = host.client;

  let message = null;          // the last refusal, in the layer's own words
  let saved = null;            // the set just recorded, for the saved/rest screen
  let preparedId = null;       // a live preparation handle, held only until Start
  let previousByLift = new Map();

  /* P0-B r2 (review finding 3) - SETTABLE, exactly as today-model.cjs's
     pendingAdoption is. today-app.cjs mountToday sets this true, on an
     enrolled installation only, BEFORE the synchronous first paint - before
     Start could ever be live over the fixture host - and releases it once
     adoption has resolved one way or another (adopted, refused, or no state at
     all). While it is true, start() refuses rather than committing a Start
     operation the OLD (fixture) host would durably record; nothing here
     invents a screen state, it only refuses in the layer's own words, exactly
     as every other refusal on this model already does. */
  let awaitingAdoption = false;
  /* P0-B r3 (review finding N1) - today-app.cjs now releases `awaitingAdoption`
     on EVERY path out of adoption, including a REJECTED athleteState(), so
     Start is never left dark behind a message that promises it will clear.
     That release must never, by itself, hand Start the still-fixture host
     back: `everHeld` latches the first time this installation was ever held
     for adoption (enrolled-only - a fresh install never calls this at all)
     and, once latched, start() below refuses until `rebase` has actually
     swapped the host - not merely until the temporary hold is lifted. So a
     rejection (or the null-state path, review N2) still refuses Start, on
     the SAME code and copy, for as long as no rebase ever happens; only a
     successful rebase() ever opens it. */
  let everHeld = false;
  function holdForAdoption(flag) { awaitingAdoption = !!flag; if (awaitingAdoption) everHeld = true; }
  /* ADOPTION_PENDING is the module-level export above (r3 N5). */

  /* P0 HIS NUMBERS - the rebase seam. today-app.cjs mountToday calls this once,
     after it adopts the athlete's own state, and only when it did; nothing here
     calls it on its own, so a fresh or a no-store installation opens exactly the
     one host it always has. `preparedId` set by an earlier READ-ONLY probe (the
     constructor's own preparability check, review B1 - `client.prepareWorkout`
     with nothing stored) belongs to the OLD client and is invalidated by the
     swap, not a reason to refuse it: the next read() re-prepares fresh, against
     the rebased host. A genuinely SAVED set (`saved !== null`, a committed,
     durable action) still refuses - swapping the client under a screen the
     athlete has already acted on is not this seam's job. A no-op with no
     hostForDay at all. holdForAdoption(true) on an enrolled installation keeps
     Start dark until this runs, so in the shipped page `saved` can never be
     non-null here from a set the fixture host recorded (review finding 3).
     Every exit clears `awaitingAdoption`: the caller's own `finally` also
     clears it, so a Start held by an install that never even reaches this
     seam (no workout lane) is not left dark for ever. */
  let rebased = false;
  async function rebase() {
    if (rebased || typeof hostForDay !== 'function') { awaitingAdoption = false; return false; }
    if (saved !== null) { awaitingAdoption = false; return false; }
    const fresh = await hostForDay(day);
    current = fresh; host = fresh.host; engine = fresh.engine;
    day = fresh.day; plannedSplitSlotId = fresh.plannedSplitSlotId; client = host.client;
    preparedId = null;
    /* P0-B r2 (review finding 4) - carry-overs from the OLD (fixture) host
       cleared with it: a previous-performance comparison and a stale refusal
       both belong to the host that is gone. The next read() re-derives
       previousByLift against the rebased host; nothing here invents one. */
    previousByLift = new Map();
    message = null;
    rebased = true;
    awaitingAdoption = false;
    return true;
  }

  /* A refusal, in the LAYER'S own words. The durable client contains whatever the
     producer threw and answers with its own WORKOUT_PREPARATION_INVALID, so when
     that is the answer the host's recorded producer refusal is reported beside it —
     its code and its own reason string, unedited. Nothing here writes a sentence of
     its own about why something was refused. */
  const refusalOf = result => {
    const code = (result && result.code) || 'WORKOUT_UNAVAILABLE';
    const copy = (result && typeof result.copy === 'string' && result.copy) || null;
    const produced = typeof host.lastProducerRefusal === 'function' ? host.lastProducerRefusal() : null;
    if (code === 'WORKOUT_PREPARATION_INVALID' && produced && produced.code) {
      /* Most of these refusals are thrown as `new Error(CODE)` with no `reason`, so
         the Error's message IS the code. Repeating it as prose produced the
         "CODE · CODE" line review B1 found: a refusal has a reason only when the
         layer supplied one, and this never manufactures one. */
      const reason = typeof produced.reason === 'string' && produced.reason.trim() ? produced.reason : null;
      const message = typeof produced.message === 'string' && produced.message !== produced.code
        ? produced.message : null;
      return { code: produced.code, copy: reason || message, clientCode: code };
    }
    return { code, copy: copy === code ? null : copy };
  };
  function remember(result) { message = refusalOf(result); return { ok: false, ...message }; }

  /* THE PREVIOUS-PERFORMANCE CONTEXT. The accepted engine adapter prepares the
     capture from a state it builds as `{...registered state, workoutFacts}`; the
     registered projection is the host's own lastProjection(). Re-running the
     accepted reader over exactly that input is the only way to read the engine's
     own governing-last metadata (card.prev) — it is not carried in the capture —
     and it is the same engine, the same input and the same evaluation that
     produced the prescription. When the engine returns no qualified comparison,
     this returns nothing; it never invents one. */
  function readPrevious() {
    previousByLift = new Map();
    const projection = host.lastProjection();
    if (!projection || !projection.accepted_state) return previousByLift;
    const state = clone(projection.accepted_state);
    delete state.workoutFacts;
    if (projection.workout_history) state.workoutFacts = clone(projection.workout_history);
    let session;
    try { session = engine.genSession(state, day, undefined); } catch (_) { return previousByLift; }
    if (!session || !Array.isArray(session.ex)) return previousByLift;
    for (const card of session.ex) previousByLift.set(card.id, card.prev || null);
    return previousByLift;
  }

  /* THE "LAST TIME" LINE, and the TWO shapes `card.prev` arrives in — because the
     engine keeps two histories and hands back whichever one GOVERNS the lift
     (`governingMeta`, rebuild/engine/progression.cjs:126-134):

       * LEGACY — progression.cjs:134 builds `{ d, w, reps: [...], rir, rirSets, debt }`;
       * NATIVE — progression.cjs:132, `if (row.native) return row.en;` — the whole
         `earned/performed-lift/v1` entry the app itself recorded, whose per-position
         load and reps sit at `slots[i].fact.current.{load,reps}.value`.

     Until a qualified `nativeTrendContext` existed the native shape could not reach
     this reader at all: a native athlete's second day on a trained lift refused
     PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED before any card existed. With lane B's
     provider wired the record DOES arrive, and this line printed nothing, because it
     read the legacy shape only (B-NTC §9.1 G7 / O10, routed here by DECISIONS:109).

     WHICH POSITIONS COUNT is not a choice made here. The engine's own governing line
     is `_lineOf` (progression.cjs:76-79), which for a native row is
     `performedLine(en).reps` — "the contiguous performed prefix of the ORIGINAL
     positions" (performed.cjs:218-238): an ADDED position never enters it, and a
     skipped, unlogged, removed or unresolved ORIGINAL position ENDS it, with no hole
     filled and nothing compacted. For a legacy row `prev.reps` IS that same line. So
     the prefix is walked here in exactly those terms and indexed by `position - 1` —
     the same key with the same meaning in both shapes, which is what keeps this a
     reader and not a second opinion.

     It re-runs no engine and opens no second reader of the athlete's state: it reads
     the entry `readPrevious()` already took off the same `genSession` call. It cannot
     delegate to `performedLine` itself, because `rebuild/m4/workout/engine-runtime.cjs:11`
     exposes `genSession` and `rirPlan` and deliberately nothing else.

     A load with no numeric magnitude (`{ kind: 'configuration' }`, which only the v2
     profile may carry — `performedEntry` requires `unit === 'lb'` for v1) prints
     NOTHING rather than a guess: the same refusal `performedNumericEntry`
     (performed.cjs:124-130) makes. Neither shape is reformatted, nothing is averaged
     across positions, and neither falls back to the other. */
  function previousAt(prev, position) {
    if (!prev || typeof prev !== 'object') return null;
    if (!Number.isSafeInteger(position) || position < 1) return null;
    if (typeof prev.w === 'number' && Array.isArray(prev.reps)) {
      const reps = prev.reps[position - 1];
      return Number.isFinite(reps) ? { load: prev.w, reps } : null;
    }
    if (typeof prev.profile !== 'string' || !prev.profile.startsWith('earned/performed-lift/')
      || !Array.isArray(prev.slots)) return null;
    let seen = 0;
    for (const slot of prev.slots) {
      if (!slot || slot.origin === 'added') continue;   // an added set never enters the line
      if (slot.state !== 'performed') return null;      // the first hole ENDS the line
      seen += 1;
      if (seen !== position) continue;
      const current = slot.fact && slot.fact.current;
      const load = current && current.load, reps = current && current.reps;
      if (!load || load.unit !== 'lb' || !Number.isFinite(load.value) || load.value <= 0) return null;
      if (!reps || reps.unit !== 'rep' || !Number.isSafeInteger(reps.value) || reps.value < 0) return null;
      return { load: load.value, reps: reps.value };
    }
    return null;
  }

  /* COACH V1 BATCH 2 ("What did I do last time?", every lift of today's workout). The "Last time" sets of EVERY lift
     the engine composes today, read off the same genSession call readPrevious() makes (card.prev), position by position
     through previousAt above: original sets only, pounds only, the first hole ends the line. A lift with no qualified
     comparison has no sets; nothing is invented, averaged or reformatted. It reads and writes nothing else. */
  function lastTimes() {
    readPrevious();
    const out = [];
    for (const [lift, prev] of previousByLift) {
      const sets = [];
      for (let position = 1; position <= 50; position += 1) {
        const at = previousAt(prev, position);
        if (!at) break;
        sets.push({ load: at.load, reps: at.reps });
      }
      out.push({ lift, sets });
    }
    return out;
  }

  function previousLine(liftId, position) {
    const at = previousAt(previousByLift.get(liftId), position);
    return at ? 'Last time: ' + at.load + ' lb × ' + at.reps : null;
  }

  /* S14 R1 (brief S13-HOLD-BW-BRIEF.md section 3 R1, PQ-1, PQ-1b): A HOLD CARD SHOWS THE LAST REAL LOAD. When the active
     set's prescribed load is a text working load (a configuration) that is not a bodyweight marker, the box is pre-filled
     with the load the "Last time" line shows for that position (previousAt above: the governing last completed workout,
     original sets only, pounds only, the first hole ends the line), so the plan line hides once both boxes are filled, as
     on every numeric card (gym-app.mjs). No previous real load leaves the box empty. A bodyweight marker (the CLOSED list
     of spec R9.14-A, the same list as native-load.cjs isBodyweightKey: "BW" or "bodyweight", trimmed, any case) is never
     pre-filled. This is not a write: Log saves whatever is in the box when it is tapped. */
  const BODYWEIGHT_KEYS = Object.freeze(['bw', 'bodyweight']);
  function lastRealLoad(load, liftId, position) {
    const key = load && load.kind === 'configuration' && typeof load.configuration_key === 'string' ? load.configuration_key.trim().toLowerCase() : '';
    if (!key || BODYWEIGHT_KEYS.includes(key)) return null;
    const at = previousAt(previousByLift.get(liftId), position);
    return at ? at.load : null;
  }

  /* S15 ROUND 5 POLISH, item 2 (PM UI pass, shot 17): THE NEXT SET OPENS AT THE LOAD JUST LOGGED. When the
     engine prescribes no load for this set (a debut: "Find a working load") the box opens at the load of the
     most recent set of the SAME lift already performed in THIS session, so set 2 is not typed again. It is a
     pre-fill and not a write: it stays editable and Log still records only what is in the box. A prescribed
     load still wins (the plan is the plan), and S14's hold rules are untouched: a configuration load (a hold
     or a bodyweight marker) never takes this path. Reps are never pre-filled from a logged set. */
  function loggedThisSession(load, activeLift, active) {
    if (load && load.kind === 'configuration') return null;
    if (!activeLift) return null;
    let found = null;
    for (const slot of activeLift.slots) {
      if (slot === active) break;
      const values = slot.completion && slot.completion.kind === 'performed' && slot.completion.values;
      const value = values && values.load && values.load.unit === 'lb' ? values.load.value : null;
      if (Number.isFinite(value) && value > 0) found = value;
    }
    return found;
  }

  /* The host's pre-write order guard, in the shape every other refusal here
     takes. It never invents a reason: the host derives both the code and the
     sentence from the durable log. */
  async function orderRefusal() {
    if (typeof current.startOrderRefusal !== 'function') return null;
    const refusal = await current.startOrderRefusal();
    return refusal ? { code: refusal.code, copy: refusal.reason || null } : null;
  }

  async function history() {
    const read = await client.readWorkoutHistory();
    if (!read.read) return { ok: false, ...refusalOf(read) };
    return { ok: true, history: read.history };
  }

  /* A session from an EARLIER day that was never closed. The accepted client
     refuses to prepare a new workout while one is open (its own
     WORKOUT_HISTORY_RECONCILIATION_REQUIRED), so without this the athlete is
     stuck: today's card can neither start nor see the thing that is blocking it. */
  /* S18 (PM ruling): a session whose Start was removed AND which holds no set, skip or close (in any status) is no session
     of the athlete's: it is neither today's workout, nor one to recover. Its Start and its removal stay on the record.
     Fable l1 D1 (a): a removed Start that holds any record is NOT skipped, so it still surfaces (the client refuses it
     WORKOUT_HISTORY_RECONCILIATION_REQUIRED, the same narrow shape). */
  const removedAndEmpty = session => !!(session && session.projection && session.projection.start_record
    && session.projection.start_record.included === false
    && !(session.records || []).some(row => row && row.operation
      && ['session-set', 'session-skip', 'session-close'].includes(row.operation.kind)));
  function unfinishedBefore(list) {
    for (const session of list.sessions || []) {
      if (removedAndEmpty(session)) continue;
      if (session.projection.close_records.length) continue;
      const record = session.projection.start_record;
      const date = record && record.current && record.current.effective && record.current.effective.local_date;
      if (!date || date === day) continue;
      return { startId: session.start.operation.op_id, day: date,
        sets: session.projection.facts.filter(f => f.included === true).length };
    }
    return null;
  }

  function sessionsToday(list) {
    const open = [], closed = [];
    for (const session of list.sessions || []) {
      if (removedAndEmpty(session)) continue;
      const record = session.projection && session.projection.start_record;
      const date = record && record.current && record.current.effective && record.current.effective.local_date;
      if (date !== day) continue;
      (session.projection.close_records.length ? closed : open).push(session);
    }
    return { open, closed };
  }

  /* ---------------- the view ---------------- */

  function slotsView(slots, original) {
    const lifts = [];
    for (const slot of slots) {
      let lift = lifts.find(l => l.id === slot.lift_lineage_id);
      if (!lift) { lift = { id: slot.lift_lineage_id, label: slot.label, slots: [] }; lifts.push(lift); }
      lift.slots.push(slot);
    }
    const active = slots.find(slot => !slot.completion) || null;
    const activeLift = active ? lifts.find(l => l.id === active.lift_lineage_id) : null;
    const position = active && activeLift ? activeLift.slots.indexOf(active) + 1 : null;
    return { lifts, active, activeLift, position, original };
  }

  function activeView(shape) {
    const { lifts, active, activeLift, position } = shape;
    const load = specified(active.load), reps = specified(active.reps);
    const reason = cell(active.reason);
    const setup = cell(active.setup);
    return {
      lift: { id: activeLift.id, label: activeLift.label,
        index: lifts.indexOf(activeLift) + 1, count: lifts.length },
      set: { position, count: activeLift.slots.length,
        slot: active.logical_set_slot, lift: active.lift_lineage_id },
      strip: activeLift.slots.map((slot, index) => ({
        label: 'Set ' + (index + 1),
        text: slot.completion && slot.completion.kind === 'performed'
          ? slot.completion.values.reps.value + ' logged'
          : slot.completion ? 'skipped'
          : cell(slot.reps).state === 'specified' ? cell(slot.reps).display + ' reps' : cell(slot.reps).display,
        done: !!slot.completion, current: slot === active,
      })),
      prescription: { line: prescriptionLine(active), effort: effortInstruction(active),
        effortCell: cell(active.effort) ? cell(active.effort).display : null,
        reason: reason && reason.state === 'specified' ? reason.display.split('\n').filter(Boolean) : [],
        setup: setup && setup.state === 'specified' ? setup.display : null,
        /* POLISH 5 D1 (Fable, f2427b73): true only when the engine specified this set's load as a number. The entry
           below can hold a load nobody planned (the S14 R1 last real load, the S15 prefill), and the set screen
           (gym-app.mjs plainSetLine/plainSetWhy) must not say such a load as planned. */
        loadSpecified: !!(load && Number.isFinite(load.value)),
        /* POLISH 6 (PM, item 5): true when the engine leaves the load to be found (the load cell is not specified at
           all: a debut's "Find a working load"); a configuration (a hold, a bodyweight marker) is specified and is not. */
        loadOpen: !!(cell(active.load) && cell(active.load).state !== 'specified') },
      entry: { load: load && Number.isFinite(load.value) ? load.value
        : (lastRealLoad(load, active.lift_lineage_id, position) ?? loggedThisSession(load, activeLift, active)),
        reps: reps && Number.isSafeInteger(reps.value) ? reps.value : null,
        step: stepFor(active.lift_lineage_id) },
      previous: previousLine(active.lift_lineage_id, position),
      upNext: nextAfter(shape, active),
    };
  }

  /* The load step is the athlete's OWN equipment increment out of the engine
     state (exercise.inc) — a real per-athlete fact, not a prescription and not a
     preview constant. With no increment on file the box takes typed entry only. */
  function stepFor(liftId) {
    const projection = host.lastProjection();
    const state = projection && projection.accepted_state;
    const exercise = state && Array.isArray(state.exercises) ? state.exercises.find(e => e.id === liftId) : null;
    return exercise && Number.isFinite(exercise.inc) && exercise.inc > 0 ? exercise.inc : null;
  }

  function nextAfter(shape, current) {
    const all = shape.lifts.flatMap(l => l.slots);
    const index = all.findIndex(slot => sameSlot(slot, current));
    const next = all.slice(index + 1).find(slot => !slot.completion) || null;
    if (!next) return null;
    const lift = shape.lifts.find(l => l.id === next.lift_lineage_id);
    return { label: lift.label, line: prescriptionLine(next), effort: effortInstruction(next),
      position: lift.slots.indexOf(next) + 1, count: lift.slots.length,
      sameLift: next.lift_lineage_id === current.lift_lineage_id };
  }

  /* UI-PASS13 (item 2; shot 04: the coach said "3 sets of 8 reps at 95 lb" for every lift while the set screen said
     95 x 10). Today's prescription for every lift, EXACTLY as the set screen reads it: the cells of the slots this card's
     own last read() prepared (the capture of client.prepareWorkout, or the open session's continuation), lift by lift
     in the session's order, set by set. The coach used to read the Today model's own genSession instead, which stands
     on a state with no native workout history and no native-load spend, so its targets were not the card's. It prepares
     nothing of its own and writes nothing; after a read with no prepared session (finished, blocked) it holds nothing. */
  let lastSlots = null;
  function prescriptions() {
    if (!Array.isArray(lastSlots)) return null;
    const lifts = [];
    for (const slot of lastSlots) {
      let lift = lifts.find(l => l.lift === slot.lift_lineage_id);
      if (!lift) { lift = { lift: slot.lift_lineage_id, label: slot.label, sets: [] }; lifts.push(lift); }
      const load = specified(slot.load), reps = specified(slot.reps);
      lift.sets.push({
        load: load && Number.isFinite(load.value) ? load.value : null,
        setting: load && load.kind === 'configuration' && typeof load.configuration_key === 'string' ? load.configuration_key : null,
        reps: reps && Number.isSafeInteger(reps.value) ? reps.value : null,
        line: prescriptionLine(slot) });
    }
    return lifts;
  }

  async function read() {
    const told = message; message = null;
    lastSlots = null;
    /* S15 polish item 1: the title is read when the card reads (a function of the Today view), not frozen at
       boot, so a card rebased onto the athlete's own week names his session and not the preview's. */
    const base = { day, title: (typeof sessionTitle === 'function' ? sessionTitle() : sessionTitle) || null,
      message: told, saved: null };
    const listed = await history();
    if (!listed.ok) return { ...base, phase: 'blocked', code: listed.code, copy: listed.copy };
    const { open, closed } = sessionsToday(listed.history);

    if (!open.length) {
      if (closed.length) {
        const facts = closed[0].projection.facts.filter(f => f.included === true);
        return { ...base, phase: 'finished', sets: facts.length,
          lifts: [...new Set(facts.map(f => f.lift_lineage_id))].length };
      }
      const prepared = await client.prepareWorkout({ planned_split_slot_id: plannedSplitSlotId });
      if (!prepared.prepared) {
        preparedId = null;
        /* If an earlier day's session is what is holding this shut, say so and
           offer the accepted close rather than printing a code the athlete can do
           nothing with. */
        const stale = unfinishedBefore(listed.history);
        if (stale) return { ...base, phase: 'unfinished', unfinished: stale, ...refusalOf(prepared) };
        return { ...base, phase: 'blocked', ...refusalOf(prepared) };
      }
      /* The probe and Start run the SAME check over the SAME generation, so a
         screen that says "ready" cannot be followed by a Start that writes and
         then blocks (review round 2). */
      const unorderable = await orderRefusal();
      if (unorderable) { preparedId = null; return { ...base, phase: 'blocked', ...unorderable }; }
      preparedId = prepared.preparedId;
      lastSlots = prepared.view.slots;
      readPrevious();
      const shape = slotsView(prepared.view.slots.map(slot => ({ ...slot, completion: null })), prepared.view);
      return { ...base, phase: 'ready', session: prepared.view.session, ...activeView(shape),
        total: prepared.view.slots.length, done: 0 };
    }

    const startId = open[0].start.operation.op_id;
    const resumed = await client.prepareWorkoutContinuation({ session_start_op_id: startId });
    if (!resumed.prepared) return { ...base, phase: 'blocked', ...refusalOf(resumed) };
    lastSlots = resumed.view.slots;
    readPrevious();
    const shape = slotsView(resumed.view.slots, resumed.view.original);
    const done = resumed.view.slots.filter(slot => slot.completion).length;
    const common = { ...base, startId, session: resumed.view.original.session,
      reason: resumed.view.current_reason, total: resumed.view.slots.length, done,
      allowed: resumed.view.allowed_actions.slice() };

    /* The saved-set screen shows the set THIS device just recorded. Coming back to
       a session whose slots are all recorded shows the last recorded one instead,
       so Undo and the finish action are still reachable after a relaunch — never a
       screen with a saved fact nobody can act on. */
    let savedSlot = null;
    if (saved && saved.startId === startId) {
      savedSlot = resumed.view.slots.find(slot => slot.completion && slot.completion.op_id === saved.opId) || null;
      if (!savedSlot) saved = null;
    }
    if (!savedSlot && !shape.active) {
      const performed = resumed.view.slots.filter(slot => slot.completion && slot.completion.kind === 'performed');
      savedSlot = performed.length ? performed[performed.length - 1] : null;
    }
    if (savedSlot) {
      const lift = shape.lifts.find(l => l.id === savedSlot.lift_lineage_id);
      return { ...common, phase: 'saved',
        saved: { opId: savedSlot.completion.op_id, liftLabel: lift.label,
          position: lift.slots.indexOf(savedSlot) + 1,
          facts: savedSlot.completion.values.load.value + ' lb × ' + savedSlot.completion.values.reps.value
            + ' reps · ' + effortWords(savedSlot.completion.values.reserve) },
        reasonLines: cell(savedSlot.reason) && cell(savedSlot.reason).state === 'specified'
          ? cell(savedSlot.reason).display.split('\n').filter(Boolean) : [],
        lift: { id: lift.id, label: lift.label, index: shape.lifts.indexOf(lift) + 1, count: shape.lifts.length },
        next: nextAfter(shape, savedSlot),
        complete: !shape.active };
    }
    if (!shape.active) return { ...common, phase: 'complete' };
    return { ...common, phase: 'active', ...activeView(shape) };
  }

  /* S12b R14 (PM ruling R13, redesigned to keep every GSS guarantee). The accepted client's continuation is
     single-use: preparing one retires the one before it (public-client.mjs prepareWorkoutContinuation),
     and a retired one is refused WORKOUT_RESUME_REQUIRED before the writer is reached (public-client.mjs
     executeResumedWorkout: the entry check precedes every write). After a set the card repaints and THEN
     the workout entry re-reads the session (today-entry.mjs refresh(), unawaited), so a Finish or a Log
     tapped inside that re-read had its continuation retired between its prepare and its execute, and the
     athlete read "Earned could not prepare today's workout" for nothing but timing, on the live tree too.
     R13 made every read and action take turns, which also held REPAINTS behind a held set write and broke
     the GSS annex (G4, G6, G7). Now reads wait for nothing, exactly as before; only the two continuation
     commits change: (1) a set or a Finish first waits for the reads already in flight (the post-set
     re-read) and then prepares, so it does not prepare into a read that is about to retire it; and (2) if a
     read that started later still retired it, the client refused it BEFORE any write, so it prepares once
     more (at most two more times) and executes. The writer is reached exactly once per tap, as before; a
     real refusal (any other code, or the same code a third time) is returned in the layer's own words. */
  const readsInFlight = new Set();
  function readTracked(...args) {
    const run = read(...args);
    readsInFlight.add(run);
    const drop = () => { readsInFlight.delete(run); };
    run.then(drop, drop);
    return run;
  }
  async function afterReads() {
    for (let round = 0; round < 3 && readsInFlight.size; round += 1) await Promise.allSettled([...readsInFlight]);
  }
  const CONTINUATION_RETIRED = 'WORKOUT_RESUME_REQUIRED';
  async function commitContinued(startId, command) {
    let handle = null, result = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await afterReads();
      handle = await client.prepareWorkoutContinuation({ session_start_op_id: startId });
      if (!handle.prepared) return { handle, result: null };
      result = await client.executeResumedWorkout(command(handle));
      if (!(result && result.acknowledged !== true && result.code === CONTINUATION_RETIRED)) break;
    }
    return { handle, result };
  }

  /* ---------------- the actions ---------------- */

  async function start() {
    /* P0-B r2/r3 (review findings 3, N1, N2) - refuse rather than commit a
       Start against a host adoption is about to replace (`awaitingAdoption`,
       the temporary window) OR already tried and did not swap
       (`everHeld && !rebased`, the permanent one - a rejection, a falsy
       state, or no workout lane at all on an enrolled installation). */
    if (awaitingAdoption || (everHeld && !rebased)) {
      message = { code: 'WORKOUT_ADOPTION_PENDING', copy: ADOPTION_PENDING };
      return { ok: false, code: 'WORKOUT_ADOPTION_PENDING', copy: ADOPTION_PENDING };
    }
    if (!preparedId) { const view = await read(); if (view.phase !== 'ready') return { ok: false, code: view.code || 'WORKOUT_NOT_READY', copy: view.copy || null }; }
    /* Re-run the guard immediately before the write, against the generation the
       write will land on. A Start that cannot be ordered is refused here and
       NOTHING is stored — there is no accepted path that could retire it
       afterwards, so it must never reach the log. */
    const unorderable = await orderRefusal();
    if (unorderable) { preparedId = null; message = unorderable; return { ok: false, ...unorderable }; }
    const result = await client.startPreparedWorkout({ preparedId });
    preparedId = null;
    if (result.acknowledged !== true) return remember(result);
    saved = null;
    return { ok: true, opId: result.op_id };
  }

  /* One recorded set. The two FORM bounds this screen applies — both refuse in
     words and record nothing — are the approved design's own: the performed
     boxes must carry an entry, and an effort answer must be chosen (the approved
     direction forbids a preselected one, so the athlete states it, including
     "Unsure", which stores the accepted tag "unknown"). Everything else is the
     accepted layer's to accept or refuse, in its own words. */
  async function logSet({ startId, slot, lift, load, reps, effort } = {}) {
    if (load === '' || load === null || load === undefined || reps === '' || reps === null || reps === undefined) {
      message = { code: null, copy: ENTER_PERFORMED };
      return { ok: false, code: null, copy: ENTER_PERFORMED };
    }
    /* S15 polish item 3: an entry that is not a number at all ("BW", a word) is said plainly here and
       nothing is sent. A NUMBER the layer refuses (0, a negative, a fraction of a rep) still goes to the
       layer, which answers in its own code (gym.test.mjs A2 step 7); the card says that one plainly. */
    const loadText = String(load).trim(), repsText = String(reps).trim();
    const numeric = text => /^-?\d+(\.\d+)?$/.test(text);
    if (!numeric(loadText)) {
      message = { code: null, copy: LOAD_NOT_A_NUMBER };
      return { ok: false, code: null, copy: LOAD_NOT_A_NUMBER };
    }
    if (!numeric(repsText)) {
      message = { code: null, copy: REPS_NOT_A_NUMBER };
      return { ok: false, code: null, copy: REPS_NOT_A_NUMBER };
    }
    if (!effort) { message = { code: null, copy: CHOOSE_EFFORT }; return { ok: false, code: null, copy: CHOOSE_EFFORT }; }
    const { handle, result } = await commitContinued(startId, (prepared) => ({ resumeId: prepared.resumeId, action: 'set', input: {
      session_start_op_id: startId, logical_set_slot: slot, lift_lineage_id: lift,
      load: { value: Number(load), unit: 'lb' }, reps: { value: Number(reps), unit: 'rep' },
      reserve: clone(effort) } }));
    if (!handle.prepared) return remember(handle);
    if (result.acknowledged !== true) return remember(result);
    saved = { startId, opId: result.op_id };
    return { ok: true, opId: result.op_id };
  }

  /* UNDO. There is no delete in an append-only log, and this does not pretend
     there is one: it commits the accepted layer's OWN removal edit against the
     set operation. After it, the client's projection reports that fact
     included:false, the resumed view has no completion in that slot, and the
     engine's next reading of this session does not see it. The set operation
     itself and the removal that retired it both stay on disk, which is what an
     honest history is. */
  async function undo({ startId, opId } = {}) {
    const prepared = await client.prepareWorkoutEdit({ target_op_id: opId });
    if (!prepared.prepared) return remember(prepared);
    const result = await client.commitWorkoutEdit({ editId: prepared.editId, action: 'remove', change: UNDO_REASON });
    if (result.acknowledged !== true) return remember(result);
    if (saved && saved.opId === opId) saved = null;
    void startId;
    return { ok: true, opId: result.op_id };
  }

  function forget() { saved = null; }

  async function finish({ startId } = {}) {
    const { handle, result } = await commitContinued(startId, (prepared) => {
      const parents = [startId, ...prepared.view.slots.filter(s => s.completion).map(s => s.completion.op_id)];
      return { resumeId: prepared.resumeId, action: 'close', input: {
        session_start_op_id: startId, completion_kind: 'normal', causal_parents: [...new Set(parents)] } };
    });
    if (!handle.prepared) return remember(handle);
    if (result.acknowledged !== true) return remember(result);
    saved = null;
    /* NATIVE-LOAD FB01 (NATIVE-LOAD-SPEC R7 route B; DECISIONS:784-785). AFTER the
       normal Close is acknowledged, and only then, the entry is told which Close it was
       so it can check the completed lifts. The notification can neither reject nor
       delay this Finish: whatever it throws or rejects is contained here, and the
       saved workout is reported as saved. */
    if (typeof onClosed === 'function') {
      try {
        const told = onClosed({ startId, closeOpId: result.op_id });
        if (told && typeof told.then === 'function') told.then(undefined, () => {});
      } catch (_) { /* a failed check is its own result, never the Finish's */ }
    }
    return { ok: true, opId: result.op_id };
  }

  /* THE ACCEPTED RECOVERY for a session abandoned on an earlier day (review round
     2, point 3). It closes it with the layer's own `early` completion kind — the
     kind the accepted commands already carry for a session that did not finish —
     on a host standing on that session's own day, because that is the only host
     whose current capture maps to its slots. Everything about it is the accepted
     layer's: the continuation, the close command, the causal parents taken from
     the slots that were actually recorded. Nothing is deleted, and the sets that
     were done stay exactly as they were logged. */
  async function closeUnfinished({ startId, day: sessionDay } = {}) {
    if (typeof startId !== 'string' || !startId.trim() || typeof sessionDay !== 'string' || !sessionDay.trim())
      return { ok: false, code: 'WORKOUT_RECOVERY_TARGET_REQUIRED', copy: null };
    if (typeof hostForDay !== 'function') {
      message = { code: 'WORKOUT_RECOVERY_UNAVAILABLE', copy: null };
      return { ok: false, ...message };
    }
    const other = await hostForDay(sessionDay);
    try {
      const handle = await other.host.client.prepareWorkoutContinuation({ session_start_op_id: startId });
      if (!handle.prepared) return remember(handle);
      const parents = [startId, ...handle.view.slots.filter(s => s.completion).map(s => s.completion.op_id)];
      const result = await other.host.client.executeResumedWorkout({ resumeId: handle.resumeId, action: 'close',
        input: { session_start_op_id: startId, completion_kind: 'early',
          causal_parents: [...new Set(parents)] } });
      if (result.acknowledged !== true) return remember(result);
      return { ok: true, opId: result.op_id };
    } finally {
      if (typeof other.close === 'function') other.close();
    }
  }

  /* S18 (PM ruling): TODAY'S OPENED, EMPTY WORKOUT GIVES WAY TO A ROUTINE CHANGE THAT STARTS TODAY. A session of this
     host's day whose Start is on record and which holds NO set, skip or close (in any status) is removed with the
     layer's own removal of its Start (action remove, the writer's existing tombstone): the Start stays on the record
     byte for byte, the engine skips it, the client treats exactly that shape as resolved, and Start then opens a fresh
     session. A session that recorded anything is refused by name (PLAN_EDIT_TODAY_STARTED) and nothing is written; a
     Start this layer cannot interpret is refused as the client refuses it. Called by routine-host.mjs BEFORE the plan
     change is saved, so a stop between the two leaves today's workout ready to start on the old plan. */
  async function discardOpenedEmpty() {
    const listed = await history();
    if (!listed.ok) return { ok: false, code: listed.code, copy: listed.copy || null };
    const removed = [];
    for (const session of listed.history.sessions || []) {
      if (removedAndEmpty(session)) continue;
      const record = session.projection && session.projection.start_record;
      const date = record && record.current && record.current.effective && record.current.effective.local_date;
      if (date !== day) continue;
      if (record.included !== true || record.issues.length)
        return { ok: false, code: 'WORKOUT_HISTORY_RECONCILIATION_REQUIRED', copy: null };
      if ((session.records || []).some(row => row && row.operation
        && ['session-set', 'session-skip', 'session-close'].includes(row.operation.kind)))
        return { ok: false, code: 'PLAN_EDIT_TODAY_STARTED', copy: null };
      const startId = session.start.operation.op_id;
      /* Fable l1 D1 (PM ruling): through the layer's PREPARED edit, so the removal is bound to the snapshot the client
         judged empty (its causal parents name the Start and every record of the session read there); a set, skip or close
         landing before the commit - another tab, another device - makes it stale (WORKOUT_EDIT_STALE) and nothing is
         removed. */
      const prepared = await client.prepareWorkoutEdit({ target_op_id: startId });
      if (!prepared || prepared.prepared !== true) return remember(prepared);
      const result = await client.commitWorkoutEdit({ editId: prepared.editId, action: 'remove', change: OPENED_EMPTY_REASON });
      if (!result || result.acknowledged !== true) return remember(result);
      removed.push(startId);
    }
    preparedId = null;
    return { ok: true, removed };
  }

  /* WEEKLY REVIEW (S19 amend, Coach v1 piece 2, PM ruling: the smallest read-only seam). The workouts this device
     holds as DONE between two dates, inclusive: a session whose Start is dated in the window and which carries a
     close record (the card's own test for a closed session, sessionsToday above), skipping a removed, empty Start
     exactly as every other reader here does. It reads the client's history and writes nothing; a history the
     client will not read is answered with its own code. */
  async function weekSessions(from, to) {
    const list = await history();
    if (!list.ok) return { ok: false, code: list.code || null };
    const dates = [];
    for (const session of list.history.sessions || []) {
      if (removedAndEmpty(session) || !session.projection || !session.projection.close_records.length) continue;
      const record = session.projection.start_record;
      const date = record && record.current && record.current.effective && record.current.effective.local_date;
      if (typeof date === 'string' && date >= from && date <= to) dates.push(date);
    }
    return { ok: true, done: dates.length, dates: dates.sort() };
  }

  return Object.freeze({ read: readTracked, start, logSet, undo, finish, forget, closeUnfinished, rebase, holdForAdoption,
    discardOpenedEmpty, weekSessions, lastTimes, prescriptions,
    effortChoices: () => EFFORT_CHOICES.map(choice => ({ label: choice.label, reserve: choice.reserve })),
    previous: () => previousByLift,
    /* P0-B r2 (review finding 4) - a LIVE getter, not a value captured at
       construction time: `day` is reassigned by rebase() above, and a plain
       property here would freeze in the pre-rebase day for the object's whole
       lifetime regardless. */
    get day() { return day; } });
}
