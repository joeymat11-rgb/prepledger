"use strict";
/* today-lanes.cjs - THE WRITERS OF THE TODAY PAGE, SEALED (spec B.1 to B.8;
 * DECISIONS:550 S-R1 and S-R17, :562 S-R19 to S-R25, :574, :584).
 *
 * Every function on this page that can put a row of the athlete's FOOD, SLEEP or
 * CHECK-IN log on disk lives in this file, together with the state it closes over. They
 * were CUT OUT of today-app.cjs by rebuild/lanes/c/today-split-spike/cut.cjs, region by
 * region, byte for byte: 34 move regions, 679 lines. Their bytes were compared against a
 * sha256 recorded at TWO named refs BEFORE anything was written (S-R19), and the only
 * substitutions are the forty-one declared rows of D.1's W1, W2, W3, W4, W9 and W10
 * families, every one of them a paint-handle rewrite; thirty-nine of the forty-one
 * rewrote a line here and the other two were already covered by a wider row.
 *
 * THE ONLY AUTHORED LINES ARE THIS BANNER, THE THREE REQUIRES, THE FACTORY LINE BELOW,
 * THE FOUR DECLARATIONS AFTER IT AND THE RETURN BLOCK AT THE END, and all of them are
 * declared in regions.json's product block, not invented by the instrument.
 *
 * WHAT CROSSES BACK, and it is the whole interface: a FACADE of thirty-seven read-only
 * getters, a callback table of twenty-nine, and nothing else. After the cut NO released
 * line assigns a binding declared in here, which census.cjs prints as a class count of
 * ZERO over this build's own output (spec B.5's acceptance test, H.2 STOP 11).
 *
 * WHAT IS NOT IN HERE, said plainly, because a reader will look for it.
 *  - SPEC B.6's OUTCOME TYPE IS NOT BUILT. recordSleep still composes its eleven
 *    sentences and recordIntake its two, from constants this factory is HANDED rather
 *    than holding: twelve copy constants arrive by name in the signature below, so this
 *    file carries zero string literals of its own and every copy byte stayed in the
 *    released view where C-UI-7 edits it. Turning them into outcomes is a statement
 *    rewrite inside three moved regions that D.1 does not declare, which DECISIONS:584
 *    rules a STOP; it is reported in the build report and it is its own ticket.
 *  - THE ONE-HANDOFF RULE IS NOT BUILT. The released today-app.cjs still names `model`.
 *  - THE RUNTIME GESTURE GUARD OF E.6 IS BUILT AND IT IS IN THIS FILE, in the block
 *    headed `E.6, THE RUNTIME GESTURE GUARD` below the three declarations above,
 *    and it is a TRIPWIRE and not a proof (S-R26). It admits the two guarded writers
 *    only while a listener installed through hooks.listen is running, and it is checked
 *    at the CALL, not at the commit: a save that has already been admitted settles
 *    afterwards. It covers TWO of E.6's nine subjects; the other seven are named in the
 *    build report and five of them are the gym card's file, which this part never opens.
 */
const FoodModel = require("./food-model.cjs");
const SleepModel = require("./sleep-model.cjs");
const { plainOrDrop } = require("./plain-copy.cjs");
function createTodayLanes({ doc, model, options, painter,
    phone, status, tell, athleteStateFailureCopy, reasonOf, sleepTyped,
    FOOD_REASON, FOOD_REFUSAL_COPY, FOOD_REFUSED, FOOD_REFUSED_ACTION, SLEEP_CHECKIN_CHANGED, SLEEP_KEPT,
    SLEEP_NIGHT_CHANGED, SLEEP_NOTHING_RECORDED, SLEEP_NOT_SAVED, SLEEP_REFUSAL_COPY, SLEEP_ROLLOVER, SLEEP_UNCERTAIN }) {
  /* Three bindings that are NOT moved bytes. `sleepDraftHeld` is bound after the fact
     (hooks.bindSleepDraft) because the released object does not exist yet when this
     factory is called; `willAdopt` and `ready` move to factory scope because the two
     statements that used to declare them are now calls (spec B.3 consequences 2 and 3,
     which is why S-R21 gave the boot statements a kind of their own). */
  let sleepDraftHeld = null;
  let willAdopt = null;
  let ready = null;

  /* E.6, THE RUNTIME GESTURE GUARD. A callback the seal hands the view is, to any static
     reader, just a function: nothing in the text tells hooks.recordSleep(map) called from
     a click listener apart from the same call made at the top of a render. A token scan
     cannot see it and a parser cannot see it, so the guard is a RUNTIME one. The released
     view installs EVERY listener through hooks.listen, so `gestures` is non-zero for the
     synchronous part of a dispatch and zero everywhere else, and a guarded writer called
     outside a gesture throws instead of writing.

     removeEventListener goes with it: with a shim in place the handler actually
     registered is the WRAPPER, so the dispose site must remove the same object it added.
     The wrapper is kept in a WeakMap keyed by the function, which is a WeakMap and not a
     Map so that a listener bound to a discarded element is collected exactly as it is
     today. The happy path is unchanged: a writer called from a gesture runs its own
     first statement with nothing added in front of it. */
  let gestures = 0;
  const wrapped = new WeakMap();
  const wrapFor = (type, fn) => {
    let byType = wrapped.get(fn);
    if (!byType) { byType = new Map(); wrapped.set(fn, byType); }
    if (!byType.has(type)) {
      byType.set(type, (ev) => { gestures += 1; try { return fn(ev); } finally { gestures -= 1; } });
    }
    return byType.get(type);
  };
  const gesture = (name, fn) => (...a) => {
    if (!gestures) throw new Error("WRITER-OUTSIDE-GESTURE: " + name);
    return fn(...a);
  };
  /* TA-S01  today-app.cjs:362-365 */
  let workout = options.workout || null;
  let workoutRebinding = null;   // the rebind in flight, so a check can await it
  let rebindInFlight = false;    // ... and only ever one of them at a time
  const session = () => (workout && typeof workout.summary === "function" ? workout.summary() : null) || null;

  /* TA-S02  today-app.cjs:370-384 */
  const checkin = options.checkin || null;
  const checkinSummary = () => (checkin && typeof checkin.summary === "function" ? checkin.summary() : null) || null;
  /* A4 — the first-run entry, injected exactly as the other two are:
       firstRun()                  -> true only while the DURABLE record holds no
                                      first-run operation for this installation
       open({ doc, phone, back, done }) -> mounts the six screens into #phone */
  const setup = options.setup || null;
  /* P3-IMPORT-UI-2 - THE INSTALLATION ITSELF, for the one route that needs the
     local durable client rather than a lane over it: importBundle, listImports
     and retractImport are the client's own methods (browser-entry.mjs), and the
     admission controller wants its OWN hostBindings so it never shares staging
     state with the setup or gym handles. today-entry.mjs hands over the era it
     already opened; with none, the Import route says so and offers nothing. */
  const installation = options.installation || null;
  const firstRun = () => !!(setup && typeof setup.firstRun === "function" && setup.firstRun() === true);

  /* TA-S03  today-app.cjs:392-392 */
  const setupFirst = options.setupFirst === true;

  /* TA-S04  today-app.cjs:410-421 */
  let foodLane = options.food || null;
  let foodOpening = null;
  let foodSaving = null;
  /* D2 round 1, finding 3 - the CAUSE of a lane that would not open, kept rather than
     swallowed, so the screen can say why instead of claiming the feature is unbuilt. */
  let foodLaneFailure = null;
  /* D2 round 2, R2-1 - what is known about the LAST write whose read-back did not
     land: `{state: "unavailable"|"unknown", day, code}`. "unavailable" means the client
     acknowledged the op and only the read failed, so the day below is a FACT. "unknown"
     means the save itself threw before it answered, so nothing may be claimed about it
     either way. Cleared the moment a read succeeds. */
  let foodReadBack = null;

  /* TA-S06  today-app.cjs:432-441 */
  let sleepLane = options.sleep || null;
  let sleepOpening = null;
  let sleepSaving = null;
  let sleepLaneFailure = null;
  let sleepReadBack = null;      // an acknowledged night whose read-back did not land
  /* D2 ROUND 1, FINDING 6 - THE COMMITTED OP, KEPT. A save that the client acknowledged
     is durable whatever the read-back afterwards does, so the figure it carries stays on
     the screen instead of vanishing with the draft: {date, hours, savedDate, savedTime}.
     Cleared the moment a read succeeds and the projected record can speak for itself. */
  let sleepAck = null;

  /* TA-S07  today-app.cjs:454-454 */
  let sleepBusy = false;         // a save is in flight: the screen says so and refuses a second

  /* TA-S08  today-app.cjs:459-464 */
  let sleepNightChoice = null;
  let sleepRollover = null;
  let sleepCorrecting = false;   // the recorded night is being corrected deliberately
  let sleepOpenedNight = null;   // the night an open draft was begun against
  let sleepOpenedDay = null;
  let sleepErrorText = "";       // the refusal or outcome sentence the next paint draws

  /* TA-S09  today-app.cjs:465-474 */
  /* D2 ROUND 2, FINDING 5 - AN OUTCOME NOBODY KNOWS. The command did not answer and
     the read that would settle it also failed, so whether the night was written is
     UNKNOWN. It is neither claimed nor denied: the screen says it is still finding
     out, the save is fenced so a second press cannot duplicate a write that may have
     landed, and the read is offered again. `{date, night}` - the night that was
     attempted, so a later read can recognise it. */
  let sleepUnknown = null;
  let sleepCheckInDay = null, sleepCheckInRow = null, sleepCheckInPending = null;
  let sleepCheckInFailed = false;
  let sleepCheckInViewPending = null;

  /* TA-S11  today-app.cjs:484-503 */
  function sleepEntryFor(host, rows) {
    let cache = rows;
    return {
      host,
      rows: () => cache,
      async refresh() { cache = await host.all(); return cache; },
      /* The COMMIT and the READ-BACK are two outcomes, exactly as N1's lane learned
         from D2 round 2: an acknowledged night is durable whatever the read does. */
      async save(night, precondition) {
        const result = await host.save(night, precondition);
        if (!result || result.ok !== true) return result;
        try { await this.refresh(); return { ...result, readBack: true, readCode: null }; }
        catch (error) {
          return { ...result, readBack: false,
            readCode: (error && (error.code || error.message)) || "SLEEP_READ_BACK_FAILED" };
        }
      },
      close() { host.close(); },
    };
  }

  /* TA-S12  today-app.cjs:505-508 */
  /* Does this lane hold anything the gym host's captured state would not already
     have? Only then is a rebuild worth the store it opens. */
  const sleepRowsMatter = (lane) =>
    !!(lane && typeof lane.rows === "function" && lane.rows().length > 0);

  /* TA-S13  today-app.cjs:510-541 */
  function openSleepLane() {
    if (sleepLane || sleepOpening) return sleepOpening;
    const view = doc.defaultView || null;
    const idb = (view && view.indexedDB) || (typeof globalThis !== "undefined" ? globalThis.indexedDB : undefined);
    const web = (view && view.crypto) || (typeof globalThis !== "undefined" ? globalThis.crypto : undefined);
    if (!idb || !web || !web.subtle) { sleepLaneFailure = "NO_LOCAL_STORE"; return null; }
    sleepOpening = Promise.resolve()
      .then(() => import("./sleep-host.mjs"))
      .then((module) => module.createSleepHost({ day: model.today, indexedDB: idb, crypto: web }))
      .then(async (host) => {
        const lane = sleepEntryFor(host, await host.all());
        sleepLane = lane;
        if (typeof model.setSleepNights === "function") model.setSleepNights(lane);
        loadCheckInKit();
        /* D2 ROUND 2, FINDING 2 - THE LANE OPENS AFTER THE GYM HOST WAS BUILT. boot()
           captures `model.stateFromOps()` for the workout before this lane exists, so
           on a device that already HOLDS a night the gym is prepared without it - no
           save required, just an ordinary start. The moment the replay is attached the
           workout entry is rebuilt over the same era, so the first workout of the day
           is prepared against the nights the athlete actually has. */
        if (sleepRowsMatter(lane)) workoutRebinding = rebindWorkout();
        if (painter.screenNow() === "today" || painter.screenNow() === "sleep") painter.repaint(painter.screenNow(), false);
        return lane;
      })
      .catch((error) => {
        sleepLane = null;
        sleepLaneFailure = (error && (error.code || error.message)) || "SLEEP_LANE_UNAVAILABLE";
        if (painter.screenNow() === "sleep") painter.repaint(painter.screenNow(), false);
        return null;
      });
    return sleepOpening;
  }

  /* TA-S14  today-app.cjs:543-555 */
  /* D2's correction 1 - THE SAME-PAGE JOURNEY. `createCheckInEntry` captures
     `model.stateFromOps()` ONCE, at boot, and `createCheckInModel` freezes the night
     it found at construction. Reopening the page is not a substitute, and neither
     today-entry.mjs nor checkin-model.mjs may be edited (the first is pinned on disk,
     the second must stay byte-identical so N2 proves the reuse path without changing
     A3 at all). So when a night has been saved since the check-in was built, the
     route builds a FRESH check-in model over the SAME host and mounts it with the
     SAME screen: one rebind, no second store, no second producer, nothing durable. */
  let checkInKit = null;
  let checkInKitLoading = null;
  /* D2 round 2, finding 3 - the check-in model this page is CURRENTLY using. Null
     until the first rebind, so a page that never rebinds is the page that shipped. */
  let checkInLive = null;

  /* TA-S15  today-app.cjs:556-566 */
  function loadCheckInKit() {
    if (checkInKit || checkInKitLoading) return checkInKitLoading;
    checkInKitLoading = Promise.all([import("./checkin-model.mjs"), import("./checkin-app.mjs")])
      .then(([model_, app]) => {
        checkInKit = { createCheckInModel: model_.createCheckInModel,
          recordedLines: model_.recordedLines, mountCheckIn: app.mountCheckIn };
        return checkInKit;
      })
      .catch(() => { checkInKit = null; return null; });
    return checkInKitLoading;
  }

  /* TA-S17  today-app.cjs:569-591 */
  function foodEntryFor(host, rows) {
    let cache = rows;
    return {
      host,
      rows: () => cache,
      async refresh() { cache = await host.all(); return cache; },
      /* D2 ROUND 2, R2-1 - THE COMMIT AND THE READ-BACK ARE TWO OUTCOMES. The op is
         durable the moment the client acknowledges it. A read that fails afterwards
         changes nothing about that, and used to reject out of here and take the
         acknowledgment, the screen and the event promise with it. It is reported
         instead, so the caller can keep what it knows and offer the read again. */
      async save(day) {
        const result = await host.save(day);
        if (!result || result.ok !== true) return result;
        try { await this.refresh(); return { ...result, readBack: true, readCode: null }; }
        catch (error) {
          return { ...result, readBack: false,
            readCode: (error && (error.code || error.message)) || "FOOD_READ_BACK_FAILED" };
        }
      },
      close() { host.close(); },
    };
  }

  /* TA-S18  today-app.cjs:593-618 */
  function openFoodLane() {
    if (foodLane || foodOpening) return foodOpening;
    const view = doc.defaultView || null;
    const idb = (view && view.indexedDB) || (typeof globalThis !== "undefined" ? globalThis.indexedDB : undefined);
    const web = (view && view.crypto) || (typeof globalThis !== "undefined" ? globalThis.crypto : undefined);
    if (!idb || !web || !web.subtle) { foodLaneFailure = "NO_LOCAL_STORE"; return null; }
    foodOpening = Promise.resolve()
      .then(() => import("./food-host.mjs"))
      .then((module) => module.createFoodHost({ day: model.today, indexedDB: idb, crypto: web }))
      .then(async (host) => {
        const lane = foodEntryFor(host, await host.all());
        foodLane = lane;
        if (typeof model.setFoodDays === "function") model.setFoodDays(lane);
        if (painter.screenNow() === "today" || painter.screenNow() === "nutrition") painter.repaint(painter.screenNow(), false);
        return lane;
      })
      .catch((error) => {
        /* `foodOpening` is deliberately LEFT SET: one attempt per mount. A cleared
           handle would let every repaint reopen a store that has already refused. */
        foodLane = null;
        foodLaneFailure = (error && (error.code || error.message)) || "FOOD_LANE_UNAVAILABLE";
        if (painter.screenNow() === "nutrition") painter.repaint(painter.screenNow(), false);
        return null;
      });
    return foodOpening;
  }

  /* TA-S19  today-app.cjs:628-643 */
  let measureScreen = null;
  const measureState = { error: "", markersError: "", exportOpen: false };

  function measureDeps() {
    const view2 = doc.defaultView || null;
    return {
      doc, state: measureState, setup, engine: model.engine,
      today: () => model.today,
      trialState: () => { try { return model.stateFromOps(); } catch (_) { return null; } },
      indexedDB: (view2 && view2.indexedDB) || (typeof globalThis !== "undefined" ? globalThis.indexedDB : undefined),
      crypto: (view2 && view2.crypto) || (typeof globalThis !== "undefined" ? globalThis.crypto : undefined),
      injected: options.measure || null,
      repaint: () => { if (painter.screenNow() === "measure") painter.repaint("measure", false); },
      back: () => painter.repaint("today", true),
    };
  }

  /* TA-S20  today-app.cjs:688-701 */
  let importScreen = null;
  let importAdmitted = false;

  function importDeps() {
    const view2 = doc.defaultView || null;
    return { doc, installation, day: () => model.today,
      crypto: (view2 && view2.crypto) || (typeof globalThis !== "undefined" ? globalThis.crypto : undefined),
      admitted: () => importAdmitted,
      repaint: () => { if (painter.screenNow() === "import") painter.repaint("import", false); },
      back: () => painter.repaint("today", true),
      /* The SAME adoption chain boot() runs. An admitted import is this
         athlete's own basis, and local-source-basis.mjs is what says so. */
      onAdmitted: () => adoptAthleteState() };
  }

  /* TA-S21  today-app.cjs:767-767 */
  let adoptionSettled = false;

  /* TA-S22  today-app.cjs:775-790 */
  function settleAdoption(chain, adopting) {
    /* WITH NO ADOPTION CHAIN RUNNING there is nothing to wait for and the frame
       must not be made to wait: importAdmitted is set by athleteBasisState()
       inside the chain, so when no chain runs the flag is already final (false)
       and the link can be painted in the same frame as everything else. Making
       every mount wait would change what a Today frame CONTAINS between one
       paint and the next on pages that never adopt at all, which is a real
       change to a screen for no gain. */
    adoptionSettled = !adopting;
    if (!adopting) return chain;
    const answered = () => { adoptionSettled = true; painter.paintTodayEntry(); };
    /* The chain itself is handed back UNCHANGED, so api.ready is the same
       promise, with the same settlement, that it was before this hook. */
    chain.then(answered, answered);
    return chain;
  }

  /* TA-S23  today-app.cjs:1279-1320 */
  async function recordIntake(save, cal, pro, error) {
    {
      const entry = { cal: cal.value, pro: pro.value };
      const refusal = FoodModel.refusalFor(entry);
      if (refusal) {
        error.textContent = plainOrDrop(FOOD_REFUSAL_COPY[refusal] || FOOD_REFUSED, "food-error");
        return;
      }
      const dayValues = FoodModel.dayFromEntry(entry);
      save.disabled = true;
      let result = null;
      /* D2 ROUND 2, R2-1 - THIS PROMISE NEVER REJECTS. A lane that throws out of save
         has told us nothing about whether the op landed, so the outcome is UNKNOWN and
         the screen says unknown; it is never reported as "no part of it was recorded",
         and it never becomes a rejected event promise with a blank screen behind it. */
      try { result = await foodLane.save(dayValues); }
      catch (thrown) {
        foodReadBack = { state: "unknown", day: dayValues, entry,
          code: (thrown && (thrown.code || thrown.message)) || "FOOD_WRITE_UNKNOWN" };
        save.disabled = false;
        painter.repaint("nutrition", false);
        return;
      }
      finally { save.disabled = false; }
      if (!result || result.ok !== true) {
        /* D2 round 1, finding 3 - the refusal the CLIENT made, not a shrug. What was
           refused, its own reason, and what to do; the boxes are deliberately not
           re-rendered, so everything he typed is still there to record again. */
        error.textContent = plainOrDrop(
          FOOD_REFUSED + " " + reasonOf(result) + " " + FOOD_REFUSED_ACTION, "food-error");
        return;
      }
      /* ACKNOWLEDGED. The op is durable; the read that follows it is a separate
         outcome and `readBack === false` says it did not land. The committed day is
         kept here so the screen can show the acknowledgment from the OPERATION rather
         than from a log it could not read. */
      foodReadBack = result.readBack === false
        ? { state: "unavailable", day: dayValues, entry, code: result.readCode || null }
        : null;
      painter.repaint("nutrition", false);
    }
  }

  /* TA-S24  today-app.cjs:1325-1335 */
  async function retryFoodRead() {
    if (!foodLane || typeof foodLane.refresh !== "function") return;
    try {
      await foodLane.refresh();
      foodReadBack = null;
    } catch (error) {
      foodReadBack = Object.assign({}, foodReadBack,
        { code: (error && (error.code || error.message)) || "FOOD_READ_BACK_FAILED" });
    }
    painter.repaint("nutrition", false);
  }

  /* TA-S25  today-app.cjs:1374-1377 */
  const sleepToday = () => sleepLane && sleepLane.host && typeof sleepLane.host.today === "function"
    ? sleepLane.host.today() : model.today;
  const sleepNightDate = () => sleepNightChoice || sleepRollover
    || SleepModel.nightDateFor(sleepToday());

  /* TA-S26  today-app.cjs:1385-1394 */
  function sleepClockCheck() {
    const now = sleepToday();
    if (!sleepTyped()) {
      sleepRollover = null; sleepOpenedDay = now; sleepOpenedNight = sleepNightDate(); return null;
    }
    if (!sleepOpenedDay) { sleepOpenedDay = now; sleepOpenedNight = sleepNightDate(); return null; }
    if (sleepOpenedDay === now) return sleepRollover;
    sleepRollover = sleepOpenedNight;
    return sleepRollover;
  }

  /* TA-S27  today-app.cjs:1411-1428 */
  function readSleepCheckIn(date, force = false) {
    const day = SleepModel.dayAfter(date);
    if (!checkin || !checkin.host || typeof checkin.host.forDate !== "function") return null;
    if (sleepCheckInDay === day && !force) return sleepCheckInPending;
    sleepCheckInDay = day; sleepCheckInRow = null; sleepCheckInFailed = false;
    const token = painter.token();
    const pending = Promise.resolve().then(() => checkin.host.forDate(day)).then((rows) => {
      if (sleepCheckInPending === pending) sleepCheckInRow = rows.length ? rows[rows.length - 1] : null;
    }).catch(() => {
      if (sleepCheckInPending === pending) sleepCheckInFailed = true;
    }).then(() => {
      if (sleepCheckInPending !== pending) return;
      sleepCheckInPending = null;
      if (token === painter.token() && painter.screenNow() === "sleep" && sleepNightDate() === date) painter.repaint("sleep", false);
    });
    sleepCheckInPending = pending;
    return pending;
  }

  /* TA-S28  today-app.cjs:1451-1454 */
  function sleepOpsFor(date) {
    const rows = sleepLane && typeof sleepLane.rows === "function" ? sleepLane.rows() : null;
    return Array.isArray(rows) ? rows.filter((row) => row && row.night && row.night.date === date) : [];
  }

  /* TA-S29  today-app.cjs:1728-1757 */
  async function retrySleepRead() {
    if (sleepCheckInFailed) await readSleepCheckIn(sleepNightDate(), true);
    if (!sleepLane || (!sleepReadBack && !sleepUnknown)) return;
    const owed = sleepUnknown;
    const token = painter.token();
    try { await sleepLane.refresh(); }
    catch (_) { if (token === painter.token()) painter.repaint("sleep", false); return; }
    /* D2 ROUND 2, FINDING 5 - THE READ IS WHAT SETTLES AN UNKNOWN OUTCOME. If the
       night that was attempted is in the log, the write landed after all and the
       screen says so; if the log can be read and it is not there, nothing was
       recorded - and now that is a statement the log supports. Either way the fence
       comes down, because the question has an answer. */
    if (owed) {
      const present = committedSleepAttempt(owed);
      sleepUnknown = null;
      sleepErrorText = present ? "" : SLEEP_NOT_SAVED + " " + SLEEP_NOTHING_RECORDED + " " + SLEEP_KEPT;
      if (present) { painter.clearDraft(); sleepCorrecting = false; sleepRollover = null; }
      workoutRebinding = rebindWorkout();
      if (token === painter.token()) painter.repaint("sleep", false);
      return;
    }
    sleepReadBack = null;
    sleepAck = null;
    sleepCorrecting = false;
    sleepErrorText = "";
    painter.clearDraft();
    workoutRebinding = rebindWorkout();
    if (token !== painter.token()) return;      // the record is settled; the screen is his
    painter.repaint("sleep", false);
  }

  /* TA-S30  today-app.cjs:1808-1931 */
  async function recordSleep(map) {
    if (sleepBusy || sleepUnknown || sleepReadBack) return;
    /* D2 ROUND 1, FINDING 6 - the sentence is STATE, not a node. A save that outlives
       its paint cannot write into the element it started with: `render` replaces the
       whole screen, so every message below is held here and drawn by the next paint. */
    const say = (sentence) => { sleepErrorText = sentence; painter.repaint("sleep", false); };
    sleepClockCheck();
    const date = sleepNightDate();
    sleepErrorText = "";
    /* D2 ROUND 1, FINDING 5 - a rollover that has not been answered blocks the write.
       The athlete confirms which night this is for; the page never decides for him. */
    if (sleepRollover) {
      say(SLEEP_ROLLOVER + " " + SLEEP_NOTHING_RECORDED);
      return;
    }
    const entry = { ...sleepDraftHeld, date };
    const refusal = SleepModel.refusalFor(entry, sleepToday());
    if (refusal) {
      say((SLEEP_REFUSAL_COPY[refusal] || SLEEP_NOT_SAVED) + " " + SLEEP_NOTHING_RECORDED);
      return;
    }
    const night = SleepModel.nightFromEntry(entry, sleepToday());
    /* D2 ROUND 1, FINDING 1 - A CORRECTION NAMES WHAT IT CORRECTS. The op this screen
       is looking at travels with the write, and the host refuses if it is no longer the
       current one: a stale editor and a double submit both stop here, with nothing
       written, rather than quietly replacing a night the athlete never saw. */
    const held = sleepOpsFor(date);
    const supersedes = held.length === 0 ? null : held[held.length - 1].op_id;
    const attempt = { date, night, supersedes, before: held.map((row) => row.op_id),
      deviceId: sleepLane && sleepLane.host && sleepLane.host.deviceId };
    /* D2 ROUND 1, FINDING 6 - MOUNT OWNERSHIP. The token this save was begun under; if
       the athlete has navigated by the time it resolves, nothing at all is applied. */
    const token = painter.token();
    sleepBusy = true;
    painter.repaint("sleep", false);
    let result = null;
    try { result = await sleepLane.save(night, { supersedes }); }
    catch (thrown) {
      /* D2 ROUND 1, FINDING 6 - AN UNCERTAIN OUTCOME IS RECONCILED, NOT GUESSED. The
         command threw without answering, so whether it committed is unknown. The screen
         says it is finding out, then READS the log: if the night is there the write
         landed and is treated as a save; if it is not, the reason is shown and the
         athlete may try again. Nothing is resubmitted before that question is settled,
         so an acknowledged write cannot be duplicated by a second press. */
      sleepErrorText = SLEEP_UNCERTAIN;
      if (token === painter.token()) painter.repaint("sleep", false);
      /* D2 ROUND 2, FINDING 5 - RECONCILE AGAINST THE OPERATION THAT WAS ATTEMPTED.
         "Some new last op" is not proof that THIS write landed: another correction may
         have arrived, and a night that merely differs from `supersedes` proves nothing
         about the one being saved. The log is asked for an op that is not the one this
         write expected to replace AND carries exactly the night that was written. */
      let landed = null;
      let read = true;
      try {
        await sleepLane.refresh();
        landed = committedSleepAttempt(attempt);
      } catch (_) { read = false; landed = null; }
      sleepBusy = false;
      if (landed) {
        /* It did land. Everything a successful save settles is settled, including the
           shared consumer state - whether or not this screen is still on top. */
        sleepAck = null; sleepReadBack = null; sleepUnknown = null; sleepCorrecting = false;
        sleepRollover = null;
        painter.clearDraft();
        workoutRebinding = rebindWorkout();
        if (token === painter.token()) say("");
        return;
      }
      if (!read) {
        /* THE READ FAILED TOO. Nobody knows. Saying "nothing was recorded" here would
           be a claim about the log that the log never made, so the screen keeps the
           question open, fences the save against a duplicate, and offers the read. */
        sleepUnknown = attempt;
        if (token === painter.token()) say(SLEEP_UNCERTAIN);
        return;
      }
      /* The read succeeded and the night is NOT there: the log itself says nothing
         was written, which is the one case in which that may be said. */
      sleepUnknown = null;
      if (token !== painter.token()) return;
      say(SLEEP_NOT_SAVED + " "
        + FOOD_REASON + ((thrown && (thrown.code || thrown.message)) || "SLEEP_WRITE_UNKNOWN") + ". "
        + SLEEP_NOTHING_RECORDED + " " + SLEEP_KEPT);
      return;
    }
    sleepBusy = false;
    if (!result || result.ok !== true) {
      /* THE LATE REFUSAL NEVER STEALS THE SCREEN either: nothing was written, so
         there is nothing for another screen to be told. */
      if (token !== painter.token()) return;
      const code = result && result.code;
      if (code === "SLEEP_STALE_NIGHT") {
        try { await sleepLane.refresh(); } catch (_) { /* keep the refusal and the typed correction */ }
      }
      const sentence = code === "SLEEP_STALE_NIGHT" ? SLEEP_NIGHT_CHANGED
        : (code && code.indexOf("SLEEP_SOURCE_") === 0) ? SLEEP_CHECKIN_CHANGED
          : [SLEEP_NOT_SAVED, reasonOf(result)].filter(Boolean).join(" ");
      say(sentence + " " + SLEEP_NOTHING_RECORDED);
      return;
    }
    /* THE COMMIT IS A FACT. Its figure is held here so a failed read-back cannot make
       a durable night disappear from the screen, and the typed value is KEPT in that
       case so nothing the athlete wrote is lost with it. */
    sleepUnknown = null;
    if (result.readBack === false) {
      sleepAck = { date: night.date, hours: SleepModel.rowFor(night, model.engine).h };
      sleepReadBack = { date: night.date, code: result.readCode || null };
    } else {
      sleepAck = null;
      sleepReadBack = null;
      sleepCorrecting = false;
      sleepRollover = null;
      painter.clearDraft();
    }
    /* D2 ROUND 1, FINDING 2, CORRECTED IN ROUND 2 - THE CONSUMERS ARE UPDATED EVEN
       WHEN THIS SCREEN IS NO LONGER ON TOP. A night that committed is a fact about
       the device, not about the sleep screen: the gym host still holds an engine
       state captured before it existed, and leaving it stale because the athlete
       walked away is exactly the defect. Ownership governs PAINTING and NAVIGATION,
       which stay with the mount that has the screen; it never governs the record. */
    workoutRebinding = rebindWorkout();
    if (token !== painter.token()) return;
    painter.repaint("sleep", false);
  }

  /* TA-S31  today-app.cjs:1936-1949 */
  function sameNight(one, two) {
    if (!one || !two || typeof one !== "object" || typeof two !== "object") return false;
    const keys = [...new Set([...Object.keys(one), ...Object.keys(two)])];
    return keys.every((key) => one[key] === two[key]);
  }
  // Equality alone can find a years-old observation. Only a new operation bound to
  // this attempted revision on this device can settle an uncertain correction.
  function committedSleepAttempt(attempt) {
    return sleepOpsFor(attempt.date).find((row) => !attempt.before.includes(row.op_id)
      && Object.hasOwn(row, "supersedes") && row.supersedes === attempt.supersedes
      && (!attempt.deviceId || row.device_id === attempt.deviceId)
      && sameNight(row.night, attempt.night)) || null;
  }


  /* TA-S32  today-app.cjs:1965-2012 */
  function reboundCheckIn(origin) {
    if (!checkInKit || !checkin || !checkin.host || typeof model.loggedSleep !== "function") return null;
    /* D2 ROUND 2, FINDING 3 - THE CURRENT SHEET IS THE ONE THE ATHLETE IS FILLING IN.
       A rebind replaces the model, so the replacement - not the entry's original - is
       what the next visit must reopen. Keeping only the entry's model meant the carry
       was repeated from the ORIGINAL draft every time, and everything typed into the
       replacement was thrown away on the second visit. The active model is retained,
       every later carry starts from it, and the carry happens ONCE per rebind. */
    const active = checkInLive || checkin.checkin || null;
    if (!active) return null;
    const captured = active.sleepRecord || null;
    const current = model.loggedSleep(SleepModel.nightDateFor(model.today));
    const same = (!captured && !current)
      || (captured && current && captured.hours === current.h && captured.date === current.d);
    /* Nothing has moved since this model was built: reopen THE SAME sheet, with
       everything on it. Only when this page has never rebound does the untouched
       original path run, so every existing mount behaves exactly as it did. */
    if (same && !checkInLive) return null;
    const token = painter.token();
    if (same) {
      return Promise.resolve(active.refresh()).then(() => {
        if (token !== painter.token()) return null;
        return checkInKit.mountCheckIn(doc, phone, { model: active,
          onBack: () => painter.repaint(origin, true), onChanged: () => checkin.refresh() });
      });
    }
    const fresh = checkInKit.createCheckInModel({ host: checkin.host, day: model.today,
      engineState: model.stateFromOps() });
    /* D2 ROUND 1, FINDING 3 - A REBIND IS NOT A RESET. The only thing that changed is
       the night this check-in reads back; every OTHER answer the athlete has already
       typed - his soreness detail, his note, the issues he ticked - is his and is
       carried across to the replacement. Only the sleep confirmation is left behind,
       because that is precisely the answer the new night invalidates. */
    carryCheckInDraft(active, fresh);
    checkInLive = fresh;
    return Promise.resolve(fresh.refresh()).then(() => {
      /* ... and the mount itself is deferred, so it takes the same ownership guard as
         every other deferred paint on this page: if the athlete has moved on while the
         read was in flight, his destination stands. */
      if (token !== painter.token()) return null;
      return checkInKit.mountCheckIn(doc, phone, {
        model: fresh,
        onBack: () => painter.repaint(origin, true),
        /* Today's own marker still comes from the ENTRY's durable summary. */
        onChanged: () => checkin.refresh(),
      });
    });
  }

  /* TA-S33  today-app.cjs:2019-2037 */
  function carryCheckInDraft(previous, next) {
    const from = previous && typeof previous.draft === "function" ? previous.draft() : null;
    const to = next && typeof next.draft === "function" ? next.draft() : null;
    if (!from || !to || typeof from.state !== "function") return false;
    const was = from.state();
    const now = typeof to.state === "function" ? to.state() : null;
    for (const [group, label] of Object.entries(was.choices || {})) {
      if (label && typeof to.choose === "function") to.choose(group, label);
    }
    for (const [name, on] of Object.entries(was.issues || {})) {
      if (on && typeof to.toggleIssue === "function") to.toggleIssue(name);
    }
    for (const [field, value] of Object.entries(was.fields || {})) {
      if (value === "" || typeof to.set !== "function") continue;
      if (field === "sleep_hours" && !(now && now.askHours)) continue;
      to.set(field, value);
    }
    return true;
  }

  /* TA-S34  today-app.cjs:2049-2093 */
  let workoutRebindQueued = false;
  function rebindWorkout() {
    if (!workout || typeof workout.gymDraft !== "function") return null;
    const view = doc.defaultView || null;
    const idb = (view && view.indexedDB) || (typeof globalThis !== "undefined" ? globalThis.indexedDB : undefined);
    const web = (view && view.crypto) || (typeof globalThis !== "undefined" ? globalThis.crypto : undefined);
    if (!idb || !web || !web.subtle) return null;
    const previous = workout;
    if (rebindInFlight) { workoutRebindQueued = true; return workoutRebinding; }
    rebindInFlight = true;
    return import("./today-entry.mjs")
      .then((entry) => entry.createWorkoutEntry(model, { indexedDB: idb, crypto: web }))
      .then((next) => {
        /* D2 ROUND 2, FINDING 2 - THE REBUILD MUST BE THE SAME INSTALLATION. The page
           rebuilds over the store THIS window can reach; a page that was handed an
           entry on some other installation (a test harness, a second device's handle)
           must keep the one it was given rather than silently moving the athlete's
           workout to a different generation. Identity is the era's own: athlete,
           namespace, database and the lease the host is standing on. */
        const before = previous.gymHost || {};
        const after = next.gymHost || {};
        const same = ["athleteId", "namespace", "databaseName", "lease"]
          .every((key) => before[key] === undefined || before[key] === after[key]);
        if (!same) {
          try { if (typeof after.close === "function") after.close(); } catch (_) { /* nothing held */ }
          return previous;
        }
        const kept = previous.gymDraft();
        if (kept && typeof next.gymDraft === "function") Object.assign(next.gymDraft(), kept);
        /* The same refresh binding today-entry.mjs boot() gives the first entry, so
           Today keeps repainting itself from the durable log after every set. */
        if (typeof next.setOnRefresh === "function") {
          next.setOnRefresh(() => { if (painter.screenNow() === "today") painter.repaint("today", false); });
        }
        workout = next;
        if (painter.screenNow() === "today") painter.repaint("today", false);
        return next;
      })
      .catch(() => null)        // a rebind that cannot happen leaves the entry it has
      .then((value) => {
        rebindInFlight = false;
        if (workoutRebindQueued) { workoutRebindQueued = false; return rebindWorkout(); }
        return value;
      });
  }

  /* TA-S35  today-app.cjs:2431-2440 */
  function canAdoptAthleteState() {
    return !!(setup && typeof setup.summary === "function" && setup.summary().enrolled === true
      && typeof setup.athleteState === "function" && typeof model.adoptBasis === "function");
  }
  function armAdoptionGate() {
    if (typeof model.setPendingAdoption === "function") model.setPendingAdoption(true);
    if (workout && workout.gym && typeof workout.gym.holdForAdoption === "function") {
      workout.gym.holdForAdoption(true);
    }
  }

  /* TA-S36  today-app.cjs:2483-2490 */
  function athleteBasisState() {
    return import("./local-source-basis.mjs")
      .then((module) => module.admittedLocalSourceState(setup))
      .catch(() => null)
      /* P3-IMPORT-UI-2 - the SAME read is what the two entry links ask, so the
         page never has a second opinion about whether a history is admitted. */
      .then((imported) => { importAdmitted = !!imported; return imported || setup.athleteState(); });
  }

  /* TA-S37  today-app.cjs:2491-2547 */
  function adoptAthleteState() {
    return athleteBasisState().then(async (state) => {
      {
        if (!state) return;
        model.adoptBasis(state);
        /* The gym card: rebase its host through hostForDay(day), which rereads
           model.stateFromOps() at call time and so picks up the athlete just
           adopted above. Then refresh the cached summary Today reads off the
           workout entry, so the durable state the card next opens on agrees with
           the one line Today already shows about it. */
        if (workout && workout.gym && typeof workout.gym.rebase === "function") {
          try { await workout.gym.rebase(); } catch (_) { /* the card keeps whatever host it already had */ }
          if (typeof workout.refresh === "function") { try { await workout.refresh(); } catch (_) { /* reported on its own next read */ } }
        }
        /* P0-B r2 (review finding 1) - through the MODEL the entry actually
           carries. `checkin` here is the ENTRY today-entry.mjs:83 returns
           ({summary, refresh, setOnRefresh, open, checkin, host}); the entry
           itself has no adoptEngineState, only entry.checkin (the model) does,
           so this guard used to be permanently false and the fixture's sleep
           night stood on his check-in sheet on every frame, unreached. */
        if (checkin && checkin.checkin && typeof checkin.checkin.adoptEngineState === "function") {
          checkin.checkin.adoptEngineState(state);
        }
        /* No render call of this module's own here (review, this ticket): the
           repaint that shows the adopted state comes from workout.refresh()
           above, through the SAME onRefresh -> api.render("today") wiring
           boot() already gives every other durable change on this page. A
           render here, unconditional on whatever screen or in-page control the
           athlete already has open (the "Report a problem" box included), would
           tear that down out from under them for no reason of its own; letting
           the existing cascade own it is what every other lane on this page
           already does. With no workout lane (a device with no workout store,
           or a caller that mounts this module directly with none, as several
           tests here do), Today's adopted state still paints correctly the next
           time anything else repaints it - `read()` and `stateFromOps()` always
           read the CURRENT (adopted) basis; only the automatic repaint waits. */
      }
    }).catch((error) => {
      if (status) tell(athleteStateFailureCopy(error));
    }).finally(() => {
      /* P0-B r3 (review finding N1) - moved OUT of the `.then` (where it sat
         inside a `try/finally` that a REJECTED athleteState() never reached,
         so a corrupt or undecryptable first-run record left Start dark for
         the whole page load behind a message that promised it would clear).
         `.finally()` on the WHOLE chain runs after `.then` OR `.catch`, so
         EVERY path - adopted, a falsy state, no workout lane, or a genuine
         rejection - releases it. This alone does not hand the athlete the
         fixture host back: gym-model.mjs's own `everHeld` guard (below)
         keeps Start refused on an enrolled installation until a rebase has
         actually happened, so releasing this flag only clears the ONE
         early, worded refusal - it never becomes "Start over the fixture
         host". */
      if (workout && workout.gym && typeof workout.gym.holdForAdoption === "function") {
        workout.gym.holdForAdoption(false);
      }
    });
  }

  /* THE INTERFACE, frozen. `facade` is READ-ONLY: every entry returns sealed state
     and none of them changes it. `hooks` is the only way released code changes
     anything in here. The two objects are separate on purpose, so that a later
     ticket adding a getter cannot quietly add a setter beside it.

     A RECORDED LAXITY, in the words S-R29 uses of the gym card's twin: several of
     these getters hand back LIVE objects (the lanes, the read-backs, the two
     screens), so released code can still change sealed read state without a hook.
     That adds no power today, because before the cut the released half held those
     same objects directly; it is closed by detached frozen copies in the ticket
     that seals the writers' own decisions, and until then this comment says what
     is true rather than what is wished. */
  return Object.freeze({
    facade: Object.freeze({
      adoptionSettled: () => adoptionSettled,
      checkInKit: () => checkInKit,
      checkInKitLoading: () => checkInKitLoading,
      checkInLive: () => checkInLive,
      checkin: () => checkin,
      checkinSummary: () => checkinSummary(),
      firstRun: () => firstRun(),
      foodLane: () => foodLane,
      foodLaneFailure: () => foodLaneFailure,
      foodOpening: () => foodOpening,
      foodReadBack: () => foodReadBack,
      foodSaving: () => foodSaving,
      importAdmitted: () => importAdmitted,
      importScreen: () => importScreen,
      measureScreen: () => measureScreen,
      ready: () => ready,
      session: () => session(),
      setup: () => setup,
      setupFirst: () => setupFirst,
      sleepAck: () => sleepAck,
      sleepBusy: () => sleepBusy,
      sleepCheckInDay: () => sleepCheckInDay,
      sleepCheckInFailed: () => sleepCheckInFailed,
      sleepCheckInPending: () => sleepCheckInPending,
      sleepCheckInRow: () => sleepCheckInRow,
      sleepCheckInViewPending: () => sleepCheckInViewPending,
      sleepCorrecting: () => sleepCorrecting,
      sleepErrorText: () => sleepErrorText,
      sleepLane: () => sleepLane,
      sleepLaneFailure: () => sleepLaneFailure,
      sleepNightDate: () => sleepNightDate(),
      sleepOpening: () => sleepOpening,
      sleepReadBack: () => sleepReadBack,
      sleepSaving: () => sleepSaving,
      sleepUnknown: () => sleepUnknown,
      workout: () => workout,
      workoutRebinding: () => workoutRebinding,
    }),
    hooks: Object.freeze({
      armAdoptionGate:      () => armAdoptionGate(),
      canAdoptAthleteState: () => canAdoptAthleteState(),
      openFoodLane:         () => openFoodLane(),
      openSleepLane:        () => openSleepLane(),
      readSleepCheckIn:     (date, force) => readSleepCheckIn(date, force),
      reboundCheckIn:       (origin) => reboundCheckIn(origin),
      sleepClockCheck:      () => sleepClockCheck(),
      sleepOpsFor:          (date) => sleepOpsFor(date),
      sleepToday:           () => sleepToday(),
      /* S-R21's five boot statements. Each keeps the position it occupies today
         (spec B.3's boot order), because everything inside this factory runs at the
         ONE point the factory is called and three of these run before the first
         paint and two after it. */
      bootFoodDays:    () => { if (foodLane && typeof model.setFoodDays === "function") model.setFoodDays(foodLane); },
      bootSleepNights: () => { if (sleepLane && typeof model.setSleepNights === "function") model.setSleepNights(sleepLane); },
      bootCheckInKit:  () => { if (sleepLane) loadCheckInKit(); },
      bootAdoptionGate: () => { willAdopt = canAdoptAthleteState(); if (willAdopt) armAdoptionGate(); },
      bootSettleAdoption: () => { ready = settleAdoption(willAdopt ? adoptAthleteState() : Promise.resolve(), willAdopt); return ready; },
      /* B.5's assignment class. The seal mints the promise or sets the flag; the
         released half keeps its listener, its guard and its repaint and loses the
         assignment, so no released line can name a binding declared in here. */
      mintMeasureScreen: (Screen) => { if (!measureScreen) measureScreen = Screen.createMeasureScreen(measureDeps()); return measureScreen; },
      mintImportScreen:  (Screen) => { if (!importScreen) importScreen = Screen.createImportScreen(importDeps()); return importScreen; },
      retryFoodRead:     () => { foodSaving = retryFoodRead(); return foodSaving; },
      /* THE TWO GUARDED ENTRIES (spec E.6). The subject list is REACH.md's rule -
         guarded if and only if it reaches a durable PUT and no paint root reaches it -
         and in THIS file that is exactly two: recordIntake reaches foodLane.save and
         recordSleep reaches sleepLane.save. E.6's other seven subjects are not this
         round's: five are gym-app.mjs's, and submitWeighIn and recoverWorkout are
         released seams that no sealed guard can reach. The build report says so. */
      recordIntake:      gesture("recordIntake", (save, cal, pro, error) => { foodSaving = recordIntake(save, cal, pro, error); return foodSaving; }),
      retrySleepRead:    () => { sleepSaving = retrySleepRead(); return sleepSaving; },
      recordSleep:       gesture("recordSleep", (map) => { sleepSaving = recordSleep(map); return sleepSaving; }),
      sleepCorrect:      (on) => { sleepCorrecting = on; },
      forgetCheckInRead: () => { sleepCheckInDay = null; sleepCheckInPending = null; },
      settleAdoption:    (adopting) => { ready = settleAdoption(adopting ? adoptAthleteState() : Promise.resolve(), adopting); return ready; },
      /* SEAM 9a: eight assignments in one gesture, and the raw field value is all
         that crosses. SEAM 9b is the same four with no argument at all. */
      sleepNightChosen:  (raw) => {
        sleepNightChoice = raw;
        sleepRollover = null;
        sleepOpenedDay = sleepToday(); sleepOpenedNight = sleepNightDate();
        sleepAck = null; sleepReadBack = null; sleepCorrecting = false; sleepErrorText = "";
      },
      keepNight:         () => {
        sleepNightChoice = sleepRollover || sleepNightDate();
        sleepRollover = null;
        sleepOpenedDay = sleepToday(); sleepOpenedNight = sleepNightDate();
      },
      /* R2 BLOCKING-1: the seal mints the read handle and assigns it; the paint that
         follows it is the RELEASED half's own closure, handed in and not moved. */
      readSleepCheckInView: (date, paint) => {
        sleepCheckInViewPending = Promise.all([loadCheckInKit(), readSleepCheckIn(date, true)]).then(paint);
        return sleepCheckInViewPending;
      },
      /* The screen's own transient draft is a released object this file mutates in
         place and never reassigns, so the seal holds the SAME object and sees every
         keystroke. It is handed over after it exists, because the factory is composed
         above it: the boot statement at :422 must run where it runs today. */
      bindSleepDraft:    (draft) => { sleepDraftHeld = draft; },
      /* E.6's shim. Every listener the released view installs comes through here, so
         the two entries above can tell a gesture from a paint. The fence asserts that
         the released file holds ZERO remaining addEventListener, which is what makes a
         listener this build missed a RED ROW rather than a silent hole. */
      listen:   (el, type, fn) => el.addEventListener(type, wrapFor(type, fn)),
      unlisten: (el, type, fn) => el.removeEventListener(type, wrapFor(type, fn)),
    }),
  });
}

module.exports = { createTodayLanes };
