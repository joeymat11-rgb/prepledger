"use strict";

/* today-model.cjs — the REAL adapter: the durable reading log of rebuild/client
   under the accepted engine.

     athlete action  ->  reading-host.weighIn()   ONE durable transaction inside the
                                                  accepted encrypted repository:
                                                  the operation and its outbox entry,
                                                  or neither (review B2)
     durable op log  ->  client.face().layer1.reads   the client's OWN projection of its
                                                  reading operations (corrections and
                                                  tombstones included)
     op log          ->  E.applyRead(...) replay  the ACCEPTED writer computes the trend
                                                  and the read note; the adapter computes
                                                  no number of its own
     engine          ->  view                     every value on screen is an engine
                                                  result or a stored operation

   REVIEW B2. A1 kept the reading log in localStorage. A real `taskkill /F /T` loses
   recent localStorage writes (Chromium buffers them in the renderer), which is
   exactly what an iOS tab termination does — so a reading the screen called saved
   could vanish. The store of record is now the same encrypted IndexedDB repository
   the gym card uses, through the same accepted durable public client; this module
   holds no client, no backend, no storage and no lease of its own. localStorage is
   gone from the product, not demoted to a cache.

   WHAT IS SYNTHETIC AND SAID SO. The athlete BASIS — exercises, split, sleep, food log,
   and the reads before the first day this device owns — is
   rebuild/m3/w7-preview/fixtures.cjs, the invented synthetic athlete. That is now the
   ONLY synthetic thing left: C4b moved the device enrolment onto this phone's own
   local era (rebuild/m3/w6/local/), whose identity key, authority key and lease are
   generated on the device and sealed inside the generation they authorize. There is
   no transport, so the client is created offline and never claims a sync.

   WHAT IS REAL. The operation envelope and its commitment, the all-or-nothing durable
   transaction, the integrity checkpoint, the outbox accounting, the face's governing
   state, and every engine number. A refusal (invalid value, storage failure, expired
   lease, evicted store) is reported with the CLIENT'S OWN copy and changes nothing on
   screen. No number is ever invented to fill a gap. */

const { createTodayEngine } = require("./today-engine.cjs");
const { SYNTHETIC_DAY, createSyntheticState } = require("../fixtures.cjs");
/* N1 - the food-day projector and the words the nutrition screen owns. Pure: no DOM,
   no store, nothing from rebuild/engine (it is HANDED the engine it must write with). */
const FoodModel = require("./food-model.cjs");
/* N2 - the sleep-night projector, which is seam S2's own half: the engine has no
   writer that appends a night, so that module builds the row in the shape
   rebuild/engine/sleep.cjs already reads. Pure, and HANDED the engine it must use. */
const SleepModel = require("./sleep-model.cjs");

/* C4b: the three synthetic enrolment labels that used to live here
   (SYNTHETIC_DEVICE_ID, SYNTHETIC_ATHLETE_ID, SYNTHETIC_IDENTITY_KEY) are gone.
   Nothing read them once gym-host.mjs stopped minting an enrolment; the device
   id is this installation's own (local-keys.mjs) and the identity key is the
   era's, sealed in the generation and never named in source. */

const clone = (v) => JSON.parse(JSON.stringify(v));

/* The preview runs on ONE fixed synthetic day so that a stored weigh-in is still today's
   weigh-in after a reload, a browser restart or a machine reboot. A real athlete day
   comes from the device clock; this screen is explicit that it does not. */
function previewClock(day) {
  const [y, m, d] = day.split("-").map(Number);
  return {
    today: () => day,
    hour: () => 8,
    now: () => day + "T13:00:00.000Z",
    stamp: () => day + "T13:00:00.000Z",
    tz: "-05:00",
    monotonicMs: () => 0,
    /* Engine readers want a Date for Intl work; the client wants ISO strings. Both are
       pinned to the same synthetic instant. */
    date: () => new Date(y, m - 1, d, 8),
  };
}

/* An engine clock (today/hour/now->Date/stamp) over the same synthetic instant. */
function engineClockFor(day) {
  const base = previewClock(day);
  return { today: base.today, hour: base.hour, now: base.date, stamp: base.stamp };
}

/* The basis the durable operations are replayed ONTO: the synthetic athlete with every
   read from the day this device starts owning removed, so a stored operation is the only
   source of a reading on or after that day. */
function createBasisState(day) {
  const state = createSyntheticState(day);
  state.reads = state.reads.filter((r) => r.d < day);
  return state;
}

function projectionOf(E, state) {
  return {
    nowModel: E.nowModel(state),
    statusFace: E.statusFace(state),
    currentRate: E.currentRate(state),
    calorieTarget: E.calorieTarget(state),
    proteinTarget: E.proteinTarget(state),
    marchingOrder: E.marchingOrder(state),
    readRecency: E.readRecency(state),
  };
}

/* The sentence for a device that could not open its encrypted local store. It is
   NOT a fallback store: A2 review B2 showed a localStorage store of record loses a
   recorded reading under a hard process kill, so there is no second place to put
   one. Nothing is recorded, and the screen says so. */
const NO_STORE = "This device could not open its encrypted local store, so nothing can be recorded here.";
const NO_STORE_NOTE = "Nothing can be recorded on this device: its encrypted local store did not open.";
const STORE_NOTE = "Saved in this device's encrypted local store. It survives a reload, a restart, a reboot and a crash.";

function createTodayModel(options = {}) {
  const day = options.today || SYNTHETIC_DAY;
  const engineFactory = options.engineFactory || createTodayEngine;
  const basis = options.basisState ? clone(options.basisState) : createBasisState(day);

  /* THE STORE OF RECORD (review B2). `readings` is the durable reading lane —
     rebuild/m3/w7-preview/today/reading-host.mjs, the accepted encrypted
     repository under the accepted durable public client over rebuild/client. This
     module holds no client, no backend and no lease of its own: it asks that lane
     for the client's own projection and hands it the athlete's entry. With no lane
     at all the plan still renders from the engine, and a weigh-in is refused in
     words rather than written somewhere that can lose it. */
  const readings = options.readings || null;
  const durable = !!readings;
  const storageNote = durable ? STORE_NOTE : NO_STORE_NOTE;

  /* N1 - THE FOOD LANE, injected exactly as `readings` is, and for the same reason:
     this module holds no client and no store of its own. It is a reader only. The
     rows it yields are what rebuild/m3/w7-preview/today/food-host.mjs read back out
     of the durable generation; with no lane at all the plan still renders and an
     intake is refused in words rather than written somewhere that can lose it. It is
     SETTABLE after construction because the page opens this lane lazily (the four
     other lanes are opened by boot(), which is pinned on disk by B-NTC and cannot
     gain a fifth). */
  let foodDays = options.foodDays || null;
  /* N2 - THE SLEEP LANE, injected exactly as `readings` and `foodDays` are, and
     settable after construction for exactly the same reason: the page opens it lazily
     because today-entry.mjs boot() is pinned on disk by B-NTC (DECISIONS:144) and its
     pin-class transition is lane B's round after H3 (:154 (5)). */
  let sleepNights = options.sleepNights || null;

  const E = engineFactory({ clock: engineClockFor(day) });

  let lastMessage = null;

  /* The durable reading operations, as the CLIENT projects them. The adapter does not
     parse the operation log itself; it asks the client. */
  function storedReads() {
    return readings ? readings.reads() : [];
  }

  /* N1 - the durable food-day operations, as THIS page's food lane read them back.
     Rows only; nothing is interpreted here. */
  function storedFoodDays() {
    return foodDays && typeof foodDays.rows === "function" ? foodDays.rows() : [];
  }

  /* op log -> engine state, through the ACCEPTED writers, and nothing else.

     N1 adds the second replay beside A1's. The readings go first because the engine's
     own order is a reading then the day it belongs to, and because `writeDaily` writes
     into `dailyLogs` which no reading touches: the two replays do not interact. Both
     go through an ENGINE writer (`applyRead`, `writeDaily`); the adapter computes
     nothing of its own in either. */
  function stateFromOps() {
    return foodProjectionOf().state;
  }

  /* D2 round 1, finding 1 - the same replay, with the days the ENGINE would not take
     named rather than thrown. A food day it refuses (no body-composition estimate, so
     no owed ledger to consult) is still recorded and still the athlete's; it simply
     has no engine figure to read back, and the screen is told which days those are. */
  function foodProjectionOf() {
    let state = clone(basis);
    /* N2 - THE SLEEP REPLAY GOES FIRST. The workout preparation, the recovery
       check-in and B-NTC's day facts all read `sleep.nights`, so a night has to be in
       the state BEFORE anything that consumes it is computed from that state. It
       touches only `sleep.nights` and no reading or food day touches that, so the
       three replays do not interact. */
    state = SleepModel.projectSleepNights(state, storedSleepNights(), E);
    for (const r of storedReads()) state = E.applyRead(state, r.date, r.lb, { hour: 8 });
    return FoodModel.foodProjection(state, storedFoodDays(), E);
  }

  /* N2 - the durable sleep-night operations, as THIS page's sleep lane read them back.
     Rows only; nothing is interpreted here. */
  function storedSleepNights() {
    return sleepNights && typeof sleepNights.rows === "function" ? sleepNights.rows() : [];
  }

  function sessionFor(state) {
    try {
      const session = E.genSession(state, day, null);
      if (!session || !Array.isArray(session.ex)) return { available: false, reason: null, count: null, name: null };
      return { available: true, reason: null, count: session.ex.length, name: session.name || null };
    } catch (error) {
      return { available: false, reason: error && error.code ? error.code : "WORKOUT_PREPARATION_UNAVAILABLE", count: null, name: null };
    }
  }

  /* The reading the ENGINE adopted for a day, not merely the newest operation. The
     accepted writer keeps the FIRST reading it is given for a date and ignores a later
     one; showing the later one beside a trend computed from the earlier one would be a
     lie. weighIn() below refuses rather than writing an operation the engine would
     ignore, so the two can never disagree — and if they ever did, `unadopted` says so. */
  function adoptedRead(state, date) {
    const hit = (state.reads || []).filter((r) => r && r.d === date);
    return hit.length ? { date: hit[0].d, lb: hit[0].w, note: hit[0].note || "" } : null;
  }

  function whySections(view) {
    const rate = view.currentRate;
    const latest = view.latestRead;
    const out = [
      { heading: "Your calories", body: view.calorieTarget.why || view.nowModel.eat.sub || null },
      { heading: "Your protein", body: view.proteinTarget.why || null },
      { heading: "What supports “" + view.statusFace.word.toLowerCase() + "”",
        body: [view.statusFace.cause, view.nowModel.move.body].filter(Boolean).join(" ") || null },
      { heading: "The readings behind it",
        body: latest
          ? "Newest reading: " + latest.date + "." + (rate.measured
            ? " " + rate.n + " readings support the rate, " + rate.from + " to " + rate.to + "."
            : " The rate is not measured yet.")
          : "No reading is stored on this device yet." },
      { heading: "The rate itself",
        body: rate.measured && Number.isFinite(rate.lo) && Number.isFinite(rate.hi)
          ? "The estimated loss rate is " + rate.scale.toFixed(2) + " lb/week; its range is "
            + rate.lo.toFixed(2) + " to " + rate.hi.toFixed(2) + " lb/week."
          : "The stored history does not establish a measured weekly rate yet." },
    ];
    return out.map((s) => ({ heading: s.heading, body: s.body || "No supporting estimate is available." }));
  }

  function read() {
    const paint = readings ? readings.paint() : "TRUTHFUL";
    const reads = storedReads();
    /* A face that is not TRUTHFUL means the client itself will not stand behind what it
       holds. Paint no number in that case. */
    if (readings && paint !== "TRUTHFUL") {
      return {
        today: day, paint, faceState: (readings.face() || {}).state || null, blocked: true,
        blockedCopy: readings.blockedCopy(),
        durable, storageNote, message: lastMessage,
        hasReadToday: false, latestRead: null, morningRead: null, storedReadCount: reads.length, unadopted: 0,
      };
    }
    const state = stateFromOps();
    const morningRead = adoptedRead(state, day);
    const adoptedDates = new Set((state.reads || []).map((r) => r && r.d));
    const unadopted = reads.filter((r) => !adoptedDates.has(r.date)).length;
    const adopted = (state.reads || []).filter((r) => r && typeof r.w === "number");
    const latestRead = adopted.length ? { date: adopted[adopted.length - 1].d, lb: adopted[adopted.length - 1].w } : null;
    const projection = projectionOf(E, state);
    const session = sessionFor(state);
    const view = {
      today: day, paint, faceState: readings ? ((readings.face() || {}).state || null) : null,
      blocked: false, blockedCopy: null,
      durable, storageNote, message: lastMessage,
      hasReadToday: !!morningRead, latestRead, morningRead, storedReadCount: reads.length, unadopted,
      saveLabel: readings ? readings.label() : "",
      outbox: readings ? readings.outboxRetained() : null,
      workout: { title: projection.nowModel.workout.title, sub: projection.nowModel.workout.sub,
        today: projection.nowModel.workout.today, exerciseCount: session.count,
        available: session.available, unavailableReason: session.reason },
      ...projection,
    };
    view.why = whySections(view);
    return clone(view);
  }

  /* The one wired athlete action. The value is handed to the client unchanged; the
     client decides whether it is recorded, and its answer is reported verbatim. */
  const ALREADY_RECORDED = "Today's weigh-in is already recorded on this device. Changing a recorded reading needs the correction path, which is not wired yet.";
  /* The entry-form bound. rebuild/client accepts any finite number as a reading, so
     without this a slip of the thumb (10000, 0, -5) is recorded as a fact and the
     engine damps it into the trend for ever. This is a FORM bound, not an engine
     admission rule and not a new client law — the same posture, and the same numbers,
     as the reviewed w7-preview's weigh-in form. It refuses in words; it never refuses
     silently and never rounds an entry into range (review F8). */
  const FORM_MIN = 60, FORM_MAX = 400;
  const OUT_OF_RANGE = "A morning weight is recorded between " + FORM_MIN + " and " + FORM_MAX
    + " lb, to one decimal place. Nothing was recorded.";
  /* ASYNC since review B2: an entry is acknowledged only after the encrypted
     repository transaction completes, so this cannot resolve before the reading is
     genuinely on disk. A screen that wants to say "Saved" must await it. */
  async function weighIn(lb) {
    /* Refuse rather than write an operation the accepted writer would ignore. The engine
       keeps the FIRST reading for a date; a second stored operation would leave the log
       and the screen disagreeing. The correction path is named, not faked. */
    if (adoptedRead(stateFromOps(), day)) {
      lastMessage = { ok: false, state: null, copy: ALREADY_RECORDED };
      return { ok: false, state: null, copy: ALREADY_RECORDED, op_id: null };
    }
    if (typeof lb === "number" && Number.isFinite(lb)
      && (lb < FORM_MIN || lb > FORM_MAX || Number(lb.toFixed(1)) !== lb)) {
      lastMessage = { ok: false, state: null, copy: OUT_OF_RANGE };
      return { ok: false, state: null, copy: OUT_OF_RANGE, op_id: null };
    }
    if (!readings) {
      lastMessage = { ok: false, state: null, copy: NO_STORE };
      return { ok: false, state: null, copy: NO_STORE, op_id: null };
    }
    const result = await readings.weighIn({ date: day, lb });
    lastMessage = { ok: result.ok, state: result.state, copy: result.copy };
    return { ok: result.ok, state: result.state, copy: result.copy, op_id: result.op_id };
  }

  /* Re-open the durable lane from disk: the page-reload path, without a page reload. */
  async function reopen() {
    lastMessage = null;
    if (readings) await readings.restart();
    return read();
  }

  return {
    read, weighIn, reopen,
    today: day,
    engine: E,
    readings,
    /* N1 - the lane the page opens lazily, and what the engine holds for a day once
       it is replayed. `loggedFood` reads the PROJECTED state, never the screen's
       memory, so what the athlete is shown is what the engine would be asked. */
    foodDays: () => foodDays,
    setFoodDays(lane) { foodDays = lane || null; return foodDays; },
    storedFoodDays,
    loggedFood: (date) => FoodModel.loggedDay(stateFromOps(), date || day),
    /* The op the log holds for a date, with its effective stamp: provenance, and the
       athlete's own figures for a day the engine could not take. */
    recordedFood: (date) => FoodModel.recordedDay(storedFoodDays(), date || day),
    /* True when a day IS recorded and the engine refused to replay it. */
    foodUnavailable: (date) => foodProjectionOf().unavailable.includes(date || day),
    /* N2 - the sleep lane, and what the ENGINE holds for a night once it is replayed.
       `loggedSleep` reads the PROJECTED state, never the screen's memory, so what the
       athlete is shown is what the workout preparation and the check-in would be
       asked; `recordedSleep` is the winning OPERATION, with its save stamp. */
    sleepNights: () => sleepNights,
    setSleepNights(lane) { sleepNights = lane || null; return sleepNights; },
    storedSleepNights,
    loggedSleep: (date) => SleepModel.loggedNight(stateFromOps(), date),
    recordedSleep: (date) => SleepModel.recordedNight(storedSleepNights(), date),
    basisState: () => clone(basis),
    stateFromOps,
    storedReads,
    adoptedRead: (date) => adoptedRead(stateFromOps(), date || day),
    ALREADY_RECORDED, OUT_OF_RANGE, NO_STORE, FORM_MIN, FORM_MAX,
  };
}

module.exports = {
  createTodayModel, createBasisState, previewClock, engineClockFor, projectionOf,
  NO_STORE, NO_STORE_NOTE, STORE_NOTE,
  SYNTHETIC_DAY,
};
