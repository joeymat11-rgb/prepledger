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
export const UNDO_REASON = 'Undone on this device from the saved-set screen before the next set.';

const clone = value => JSON.parse(JSON.stringify(value));
const cell = value => (value && typeof value.display === 'string' ? value : null);
const specified = value => (value && value.state === 'specified' && typeof value.source_json === 'string'
  ? JSON.parse(value.source_json) : null);

/* The saved effort, in the approved design's own plain words. Every branch is a
   tag the accepted domain defines; an unrecorded effort is never printed as a
   number and never silently dropped. */
export function effortWords(reserve) {
  if (!reserve || typeof reserve.tag !== 'string') return 'Effort unknown';
  if (reserve.tag === 'exact') return reserve.value + ' clean reps left';
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
  return 'Aim to finish with ' + effort.target + ' clean reps left.';
}

const sameSlot = (a, b) => a && b && a.logical_set_slot === b.logical_set_slot && a.lift_lineage_id === b.lift_lineage_id;

/* hostForDay(date) builds a host for a day that is NOT today, over the same device
   storage. It is needed for exactly one thing: closing a session the athlete
   abandoned on an earlier day. The accepted continuation prepares the CURRENT
   capture for the host's own day and refuses a slot mapping that does not match
   (WORKOUT_RESUME_SLOT_MAPPING_REQUIRED, executed), so the only host that can
   retire that session is one standing on the day it belongs to. When no factory is
   supplied the recovery is simply unavailable and says so; nothing is guessed. */
export function createGymModel({ gymHost, sessionTitle, hostForDay } = {}) {
  if (!gymHost || !gymHost.host) throw new TypeError('createGymModel requires a composed gym host');
  const { host, engine, day, plannedSplitSlotId } = gymHost;
  const client = host.client;

  let message = null;          // the last refusal, in the layer's own words
  let saved = null;            // the set just recorded, for the saved/rest screen
  let preparedId = null;       // a live preparation handle, held only until Start
  let previousByLift = new Map();

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

  function previousLine(liftId, position) {
    const prev = previousByLift.get(liftId);
    if (!prev || typeof prev.w !== 'number' || !Array.isArray(prev.reps)) return null;
    const reps = prev.reps[position - 1];
    if (!Number.isFinite(reps)) return null;
    return 'Last time: ' + prev.w + ' lb × ' + reps;
  }

  /* The host's pre-write order guard, in the shape every other refusal here
     takes. It never invents a reason: the host derives both the code and the
     sentence from the durable log. */
  async function orderRefusal() {
    if (typeof gymHost.startOrderRefusal !== 'function') return null;
    const refusal = await gymHost.startOrderRefusal();
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
  function unfinishedBefore(list) {
    for (const session of list.sessions || []) {
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
        setup: setup && setup.state === 'specified' ? setup.display : null },
      entry: { load: load && Number.isFinite(load.value) ? load.value : null,
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

  async function read() {
    const told = message; message = null;
    const base = { day, title: sessionTitle || null, message: told, saved: null };
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
      readPrevious();
      const shape = slotsView(prepared.view.slots.map(slot => ({ ...slot, completion: null })), prepared.view);
      return { ...base, phase: 'ready', session: prepared.view.session, ...activeView(shape),
        total: prepared.view.slots.length, done: 0 };
    }

    const startId = open[0].start.operation.op_id;
    const resumed = await client.prepareWorkoutContinuation({ session_start_op_id: startId });
    if (!resumed.prepared) return { ...base, phase: 'blocked', ...refusalOf(resumed) };
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

  /* ---------------- the actions ---------------- */

  async function start() {
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
    if (!effort) { message = { code: null, copy: CHOOSE_EFFORT }; return { ok: false, code: null, copy: CHOOSE_EFFORT }; }
    const handle = await client.prepareWorkoutContinuation({ session_start_op_id: startId });
    if (!handle.prepared) return remember(handle);
    const result = await client.executeResumedWorkout({ resumeId: handle.resumeId, action: 'set', input: {
      session_start_op_id: startId, logical_set_slot: slot, lift_lineage_id: lift,
      load: { value: Number(load), unit: 'lb' }, reps: { value: Number(reps), unit: 'rep' },
      reserve: clone(effort) } });
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
    const handle = await client.prepareWorkoutContinuation({ session_start_op_id: startId });
    if (!handle.prepared) return remember(handle);
    const parents = [startId, ...handle.view.slots.filter(s => s.completion).map(s => s.completion.op_id)];
    const result = await client.executeResumedWorkout({ resumeId: handle.resumeId, action: 'close', input: {
      session_start_op_id: startId, completion_kind: 'normal', causal_parents: [...new Set(parents)] } });
    if (result.acknowledged !== true) return remember(result);
    saved = null;
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

  return Object.freeze({ read, start, logSet, undo, finish, forget, closeUnfinished,
    effortChoices: () => EFFORT_CHOICES.map(choice => ({ label: choice.label, reserve: choice.reserve })),
    previous: () => previousByLift, day });
}
