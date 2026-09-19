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
/* The weigh-in writer, sealed, cut out of this file by the split (spec F.1, S-R10).
   read() and the whole projection stay here and stay free; the two functions that can
   put a reading on disk do not. The require is at module level, once, and not inside
   the factory. */
const { createReadingsWriter } = require("./today-readings.cjs");

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

/* S1 (DECISIONS:534 (a); P3-TODAY-COPY-DIAG section S1). rebuild/engine/today.cjs:568-582
   makes nowModel().move the FIRST UNRESOLVED PROPOSAL'S CARD TITLE whenever the state
   carries one, on purpose: the frozen app had a decisions surface behind that headline.
   This page has no proposal card at all (state inventory T-40; the card is C-UI-3), and
   today-app.cjs:863 binds move.title into the slot the approved design labels "Your plan
   for today". So a per-muscle volume proposal, which reaches Today only through the
   admitted import's replayed state and therefore through no fixture, read as the day's
   session on the owner's own phone.

   Until Today has a card of its own, the headline is the engine's OWN next-best move:
   the SAME function, over the SAME state with its proposals set aside, so every word on
   screen is still an engine result and this adapter invents nothing. The WHOLE move
   object is taken from that second projection (kind, title, body, n, lever: the body
   reaches today-app.cjs and the "What supports" section too), and nothing else is: the
   status face, the workout, the figures and `decisionsN` stay the real state's. The
   count therefore survives in the projection, but no product code reads it yet, so an
   open proposal is invisible on Today until C-UI-3 gives it its card. That is the
   ruling's intent (DECISIONS:534 (a)), stated here so C-UI-3 inherits it on the record.
   (Comment corrected by the integrator on review R1 MAJOR 1; no code moved.)

   With no open proposal the second projection is never computed and `nowModel` is
   returned by IDENTITY, so the fixture render is byte-identical and the engine's own
   memoisation is not defeated. */
function hasOpenProposal(state) {
  return ((state && state.proposals) || []).some((p) => p && !p.resolved)
    || ((state && state.agentProposals) || []).length > 0;
}

function planMove(E, state, nowModel) {
  if (!hasOpenProposal(state)) return nowModel.move;
  const bare = clone(state);
  bare.proposals = [];
  bare.agentProposals = [];
  return E.nowModel(bare).move;
}

/* S2 (DECISIONS:534 (b); P3-TODAY-COPY-DIAG section S2). rebuild/engine/today.cjs's
   marchingOrder writes FOUR parts meant to be read together: a cue (`ifText`), the action
   it belongs under (`thenText`), the reason (`why`) and the day's target line. The why is
   a SUBORDINATE CLAUSE - it starts lower case and never names what is being asked - so
   today-app.cjs, which bound the why ALONE into the slot the approved design labels "Your
   plan for today", printed a sentence that starts in its middle. On the owner's own phone,
   with an imported history that carries no last night, that was the sleep rung's clause:
   "bed, wake, and how long you took to drop off: the body-composition read leans on this
   harder than anything else you enter".

   This puts the cue and the action back in front of the why, in the engine's own order,
   and invents no word: the comma and the colon are the punctuation the engine's own
   if-then already implies. The target line is deliberately NOT appended - its two figures
   are already bound to the kcal and protein slots, and repeating them would say the same
   thing twice.

   A missing part returns null rather than a half sentence, so the caller falls back to the
   status face's own whole sentence. Pure: it reads only the object the engine returned. */
function marchingOrderSentence(order) {
  if (!order) return null;
  const cue = typeof order.ifText === "string" ? order.ifText.trim() : "";
  const action = typeof order.thenText === "string" ? order.thenText.trim() : "";
  const why = typeof order.why === "string" ? order.why.trim() : "";
  if (!cue || !action || !why) return null;
  return cue + ", " + action + ": " + why;
}

function projectionOf(E, state) {
  const nowModel = E.nowModel(state);
  const move = planMove(E, state, nowModel);
  return {
    nowModel: move === nowModel.move ? nowModel : { ...nowModel, move },
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
  /* P0 HIS NUMBERS - SETTABLE after construction, exactly as N1's foodDays is
     (see setFoodDays below): today-app.cjs mountToday opens this page's setup
     lane lazily and reads setup.athleteState() asynchronously, so the basis it
     hands back cannot be known at createTodayModel() time. `basis` starts as
     whatever the caller supplied (or the fixture, unchanged), and adoptBasis()
     below REPLACES it, once the athlete's own record has actually been read. */
  let basis = options.basisState ? clone(options.basisState) : createBasisState(day);

  /* P0-B r2 (review finding 2) - SETTABLE, exactly as `basis` is. today-app.cjs
     mountToday sets this true, on an enrolled installation only, BEFORE the
     synchronous first paint (so S19's note-visible assertion, which reads the
     UNCHANGED fixture basis, is untouched) and adoptBasis below clears it the
     moment his own state actually lands. While it is true, read() gates the
     fixture's own calorie, protein and weight-trend figures - never a number
     this device has not actually measured, and never the fixture's. */
  let pendingAdoption = false;

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
    /* P0-B r2/r3 (review findings 2, N3) - gate the fixture's own figures off
       this view while adoption is pending. This is never a fabricated
       placeholder: calorieTarget/proteinTarget/the weight trend use the SAME
       "gated" / non-finite shape the engine already returns for an athlete
       with no qualifying data, so calorieHeadline/calorieBand/trendLine in
       today-app.cjs already render them as "Not available yet" through the
       normal, honest path. `workout.exerciseCount` (r3 N3) is the fixture's
       OWN session count otherwise - null falls through to today-app.cjs's
       own existing "No session is scheduled today." sentence, the same words
       an athlete with no session at all already sees; nothing new is taught
       to that layer here either. `marchingOrder` (r3 N3) is the fixture's own
       next-best-action, feeding the instruction-why text and the primary
       button's label when a weigh-in is owed; emptied, its own reader falls
       back to "Log this morning's weight". `statusFace` (r4, review finding
       N3b) is ALSO the fixture's: emptying `marchingOrder` alone left the
       instruction line falling through to `view.statusFace.cause`, which is
       the fixture's rich 28-day history talking - "ON COURSE ... The cut is
       working", the exact opposite of what an enrolled athlete's own,
       genuinely unread state would say. Recomputed here instead of emptied
       or hardcoded: off a NEUTRAL variant of the SAME valid engine state
       (`basis`, with no reads) - the shape a device with nothing measured
       yet already has, and what the engine ITSELF answers for it, never a
       word this module invents. Nothing else on view (workout.title/sub/
       available, the instruction heading, the setup note) is touched: none
       of it paints a fixture-specific figure or verdict in the first
       place. */
    if (pendingAdoption) {
      view.calorieTarget = { gated: true };
      view.proteinTarget = { g: NaN };
      if (view.nowModel && view.nowModel.headed) {
        view.nowModel = { ...view.nowModel, headed: { ...view.nowModel.headed, weight: NaN } };
      }
      view.workout = { ...view.workout, exerciseCount: null };
      view.marchingOrder = {};
      const neutral = clone(basis);
      neutral.reads = [];
      view.statusFace = E.statusFace(neutral);
    }
    /* S2. The whole sentence for the slot under "Your plan for today", composed from the
       engine's own marching order. Set AFTER the adoption gate above on purpose: an
       emptied marchingOrder yields null and today-app.cjs falls back to the status face's
       own sentence, exactly as it already did. */
    view.orderSentence = marchingOrderSentence(view.marchingOrder);
    view.why = whySections(view);
    return clone(view);
  }

  /* The one wired athlete action. The value is handed to the client unchanged; the
     client decides whether it is recorded, and its answer is reported verbatim. */
  /* The sealed sibling, composed with the SEVEN bindings the machine census says weighIn
     and reopen reach outside themselves. F.1 (c) names five of them and leaves out read(),
     which reopen calls, and without it the build does not go green. NO_STORE is passed in
     SHORTHAND: the sibling destructures NO_STORE, so F.1 prose's `noStore: NO_STORE` would
     hand it undefined and its no-store refusal would be the word undefined in front of the
     athlete (R3 NOTE-6). setMessage is a released closure the seal calls, which is what
     keeps lastMessage released; the effect is identical to the five assignments it
     replaces, and the census's zero sealed-assigns-released rows is a property of the
     instrument and not a safety property, which this comment says so nobody reads it as
     one (R3 PART 2 (e)). */
  const { weighIn, reopen, ALREADY_RECORDED, OUT_OF_RANGE, FORM_MIN, FORM_MAX } =
    createReadingsWriter({ day, readings, adoptedRead, stateFromOps,
      read: () => read(), NO_STORE, setMessage: (m) => { lastMessage = m; } });
  /* ASYNC since review B2: an entry is acknowledged only after the encrypted
     repository transaction completes, so this cannot resolve before the reading is
     genuinely on disk. A screen that wants to say "Saved" must await it. */

  /* Re-open the durable lane from disk: the page-reload path, without a page reload. */

  /* P0 HIS NUMBERS - replaces the basis operations are replayed onto. A falsy
     `state` is a no-op: nothing here invents a basis, so a constructor refusal
     or a not-yet-enrolled installation leaves the fixture exactly as it was.
     Called at most once per adoption by today-app.cjs mountToday, never by this
     module itself - it holds no setup lane and reads no record of its own. */
  function adoptBasis(state) {
    if (!state) return clone(basis);
    basis = clone(state);
    /* His own state, however sparse, is never fabricated the way a held figure
       is: the gate lifts here, unconditionally, the moment there IS a real
       basis to read figures off. */
    pendingAdoption = false;
    return clone(basis);
  }

  /* P0-B r2 (review finding 2) - see `pendingAdoption` above. */
  function setPendingAdoption(flag) { pendingAdoption = !!flag; }

  return {
    read, weighIn, reopen, adoptBasis, setPendingAdoption,
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
  marchingOrderSentence,
  NO_STORE, NO_STORE_NOTE, STORE_NOTE,
  SYNTHETIC_DAY,
};
