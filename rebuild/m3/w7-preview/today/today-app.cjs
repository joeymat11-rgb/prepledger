"use strict";

/* today-app.cjs — the view. It clones the approved-design templates and binds every
   slot from the model's view DTO. It contains NO number and NO target of its own: a slot
   with no engine value or no stored operation is filled with an explicit
   not-available sentence, never a placeholder figure.

   Today follows Additions C, the authoritative reference, structure for structure. That
   is what keeps the single primary action inside one 390x844 viewport (review F2);
   `browser-check.mjs` asserts it in a real browser, in both states.

   Screens beyond Today (gym card A2, recovery check-in A3, Dad's first run A4) are
   entry points only: they carry the approved visuals and a plain "not wired yet" state.
   They fabricate nothing. */

const { createTodayModel } = require("./today-model.cjs");
/* THE RENDER BOUNDARY for the owner's no-dashes rule (DECISIONS:114 (1)). Every string
   this file writes into the DOM goes through the normaliser on the way, because most of
   them are the engine's words and rebuild/engine is frozen for this brief. A dash it
   cannot rewrite is REFUSED: that one slot renders nothing and the refusal goes to the
   console, while the rest of the screen paints normally (P1 review, Finding 3). The
   character never reaches the athlete, and one unrewritable sentence never costs them
   the whole of Today. */
const { plainOrDrop } = require("./plain-copy.cjs");
/* REPORT A PROBLEM (DECISIONS:140 (3)). The diagnostic block's shape lives in ONE
   module and this file only gathers what the page can honestly observe and hands it
   over. Nothing here reads a store, and the control writes nothing at all. */
const ProblemReport = require("./problem-report.cjs");
/* N1 (DECISIONS:143) - the nutrition entry's own words, its refusals and the projector
   the adapter replays a stored food day with. Pure: no DOM, no store. */
const FoodModel = require("./food-model.cjs");
/* N2 (DECISIONS:167) - the sleep entry's refusal rules and the projector seam S2 needs,
   because the engine has no writer that appends a night. Pure: no DOM, no store. */
const SleepModel = require("./sleep-model.cjs");

const NUMBER = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const ARROW = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
const NOT_AVAILABLE = "Not available yet";

const amount = (v) => (Number.isFinite(v) ? NUMBER.format(v) : null);
const pounds = (v) => (Number.isFinite(v) ? v.toFixed(1) : null);
const localDate = (day) => { const [y, m, d] = day.split("-").map(Number); return new Date(y, m - 1, d, 12); };
const dayLabel = (day) => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(localDate(day));

/* "Eat about N kcal" — N is the engine's own midpoint, shown to the nearest 100 exactly
   as the reviewed w7-preview presents it; the engine's actual band is printed underneath,
   so the rounding hides nothing. No tolerance or allowance is invented (Refinement A
   handoff, calorie-target presentation clarification). */
function calorieHeadline(calorieTarget) {
  if (!calorieTarget || calorieTarget.gated || !Number.isFinite(calorieTarget.mid)) return null;
  return amount(Math.round(calorieTarget.mid / 100) * 100);
}
function calorieBand(calorieTarget) {
  if (!calorieTarget || calorieTarget.gated) return "A calorie range is not available yet.";
  if (!Number.isFinite(calorieTarget.lo) || !Number.isFinite(calorieTarget.hi)) return NOT_AVAILABLE;
  return "Today's target " + amount(calorieTarget.lo) + " to " + amount(calorieTarget.hi) + " kcal";
}

/* The morning line. When the accepted writer attached a note to the reading — "spike —
   damped in trend", "inside your noise — not information" — that note is the engine's
   own reconciliation of a reading with the trend beside it, and it is SHOWN (review F1).
   The app never writes a note of its own and never suppresses one; it does take the
   engine's dash out of it on the way to the screen (DECISIONS:114 (1)), which is what
   plainOrDrop() at every slot below does. */
function morningLine(view) {
  if (!view.morningRead) return "This morning: not logged yet";
  const line = "This morning ✓ " + pounds(view.morningRead.lb) + " lb";
  const note = (view.morningRead.note || "").trim();
  return note ? line + " · " + note : line;
}
function trendLine(view) {
  const weight = view.nowModel && view.nowModel.headed ? view.nowModel.headed.weight : null;
  return "Weight trend " + (Number.isFinite(weight) ? pounds(weight) + " lb" : NOT_AVAILABLE) + " · Why this plan?";
}

/* The honesty rule (review D-2): an entry point this slice has not wired says so on
   Today's face, in the approved design's own secondary text, so the athlete never taps to
   discover it. The screen behind it repeats the same words in full. */
const NOT_WIRED = "Not wired yet";

/* REPORT A PROBLEM (DECISIONS:140 (3)) - the three sentences the control can put on
   the screen. The approved 2026-09-08 design has no such control, so all three are
   preview-owned and declared in design.cjs PREVIEW_RUNTIME_COPY, which asserts each is
   ABSENT from the approved references and PRESENT here.

   THE WORDING NAMES THE OWNER, ON BOTH PHONES. The brief's own sentence was "Copied.
   Paste it to Joe.", written for Joe's phone; on Dad's phone he is not pasting into a
   PM chat, he is sending it to his son. "Send it to Joe" is true on both, so there is
   ONE sentence rather than a phone-dependent one this page has no way to choose
   between - it cannot know whose phone it is until the first run has named him, and
   the control has to work before that. Recorded as a REQUESTS line for the PM. */
/* N1 (DECISIONS:143) - every word the nutrition entry can put on the screen. They are
   HERE, in a view source, because design.cjs's copy binding reads VIEW_SOURCES and
   test/design.test.cjs pins that list; food-model.cjs owns the RULE and names each
   refusal by code, this file owns the wording. All of them are preview-owned: the
   approved 2026-09-08 nutrition screen shows targets and has no entry on it, so the
   prototype has no words for recording an intake, refusing one, reading one back, or
   having no target to show at all. */
const FOOD_HEAD = "Today's intake";
const FOOD_LEAD = "Enter what you actually ate today. Either figure on its own is enough.";
const FOOD_CAL_LABEL = "Calories eaten";
const FOOD_PRO_LABEL = "Protein eaten";
const FOOD_SAVE = "Record today's intake";
const FOOD_SAVED = "Recorded today";
const FOOD_CORRECTION = "Recording it again replaces today's figures.";
const FOOD_REFUSED = "This intake could not be recorded on this device, and no part of it was recorded.";
const FOOD_NO_TARGETS = "Earned has no calorie band or protein target for you yet: it needs a starting estimate of your body composition, which this device has not recorded. Your intake is still yours to record, and it is kept.";
const FOOD_NOT_PRESCRIBED = "Not prescribed. The engine issues no carbohydrate or fat target.";
/* D2 ROUND 1 - A REFUSAL THE ATHLETE CAN ACT ON (finding 3), AND A DAY THE ENGINE
   CANNOT READ BACK (finding 1). Every refusal this screen shows now says three things:
   WHAT was refused, WHY in the words of whatever refused it, and WHAT TO DO next. The
   why is never reworded here: a client refusal arrives with its own copy, and where
   there is no copy the code it named is shown as the code it named. */
const FOOD_REFUSED_ACTION = "Your figures are still in the boxes above. Record them again, and if it keeps failing, report a problem from Today.";
const FOOD_REASON = "The store's own reason: ";
const FOOD_NO_STORE = "Your intake cannot be recorded on this device yet. Earned could not open its encrypted store here, so there is nowhere to keep what you enter and nothing you type is kept. Open Earned again on this device, or use one that allows local storage, and this entry starts working.";
const FOOD_OPENING = "Opening this device's encrypted store.";
/* The sentence this screen has always carried about the PLAN behind it, which N1 did
   not build and which Today's NOT_WIRED marker describes the same way. Byte identical
   to the literal it replaces: view.test.mjs is pinned on disk by B-NTC and asserts it. */
const FOOD_PLAN_UNWIRED = "The full nutrition screen is not wired yet. Energy and protein above are today's engine targets; nothing else on this screen is a value.";
/* D2 ROUND 2, R2-1 - A COMMIT AND A READ ARE TWO OUTCOMES, AND SO ARE THEIR SENTENCES.
   An acknowledged intake is recorded whatever the read that follows it does; an intake
   whose save threw before it answered is genuinely UNKNOWN, and this screen says which
   of the two happened rather than asserting that nothing was stored. */
const FOOD_SAVED_UNREAD = "Earned could not read today's record back just now, so what is shown here may not be the whole day.";
const FOOD_UNKNOWN = "Earned could not tell whether this intake was recorded on this device. It may have been kept and it may not.";
const FOOD_READ_ACTION = "Nothing you entered is lost. Read today's record again below, or open Earned again on this device.";
const FOOD_READ_RETRY = "Read today's record again";
const FOOD_KEPT_UNREADABLE = "Recorded and kept on this device. Earned cannot show today's figures back through its own ledger yet: it has no starting estimate of your body composition, and that ledger will not open without one. Nothing is lost, and they appear here as soon as that estimate exists.";
/* One sentence per refusal code, and no code without one. */
const FOOD_REFUSAL_COPY = Object.freeze({
  NOTHING: "Enter calories, protein, or both. Nothing was recorded.",
  CAL_RANGE: "Calories are recorded as a whole number between 0 and 20000. Nothing was recorded.",
  PRO_RANGE: "Protein is recorded as a whole number of grams between 0 and 1000. Nothing was recorded.",
});

/* N2 (DECISIONS:167) - every word the SLEEP entry can put on the screen. The approved
   2026-09-08 design has no sleep screen at all, so all of it is preview-owned and
   declared in design.cjs PREVIEW_RUNTIME_COPY; each sentence is the accepted brief's
   own (rebuild/lanes/d2/BRIEF-N2-SLEEP-ENTRY.md v1.0, "Exact copy and states to
   draw"), which marks every one of them INVENTED. sleep-model.cjs owns the RULE and
   names each refusal by code; this file owns the wording. */
const SLEEP_TITLE = "Sleep";
const SLEEP_NIGHT_PREFIX = "Night of ";
const SLEEP_NONE = "No sleep recorded for this night.";
const SLEEP_MODE_LABEL = "How do you want to record it?";
const SLEEP_MODE_TIMES = "Bed and wake times";
const SLEEP_MODE_HOURS = "Hours asleep";
const SLEEP_BED_LABEL = "Bed time";
const SLEEP_WAKE_LABEL = "Wake time";
const SLEEP_AWAKE_TOGGLE = "Time awake";
const SLEEP_AWAKE_LABEL = "Minutes awake";
const SLEEP_ESTIMATE_PREFIX = "Estimate from clock times: ";
const SLEEP_AWAKE_NONE = "Time awake was not recorded.";
const SLEEP_CLOCK_CHANGE = "For a clock-change night, enter hours asleep.";
const SLEEP_HOURS_ASK = "About how many hours did you sleep?";
const SLEEP_HOURS_LABEL = "Hours";
const SLEEP_HOURS_NOTE = "Entered as an approximate duration.";
const SLEEP_FROM_TIMES = "From bed and wake times.";
const SLEEP_CHECKIN_PREFIX = "From your check-in on ";
const SLEEP_CONFIRMED_PREFIX = "Confirmed from your check-in on ";
const SLEEP_USE_CHECKIN = "Use these hours";
const SLEEP_SAVE = "Save sleep";
const SLEEP_SAVED = "Sleep saved on this device.";
const SLEEP_RECORDED_PREFIX = "Recorded ";
const SLEEP_NO_SAVE_TIME = "Save time not recorded.";
const SLEEP_NOT_SAVED = "Sleep could not be saved on this device.";
const SLEEP_READ_FAILED = "Sleep was saved. The screen could not refresh. Open it again.";
const SLEEP_NO_STORE = "Sleep cannot be recorded on this device yet. Earned could not open its encrypted store here, so there is nowhere to keep it. Open Earned again on this device, or use one that allows local storage.";
const SLEEP_NOTHING_RECORDED = "Nothing was recorded.";
/* D2 ROUND 1, FINDINGS 5 AND 6 - the states the accepted brief's copy table names and
   the first build left undrawn: the night's own DATE (chosen, never guessed), the
   quality the check-in already holds (asked once, there), the correction flow, the
   rollover confirmation, and the two honest outcomes of a save whose read-back did not
   land. Every sentence below is the brief's own ("Exact copy and states to draw"),
   which marks it INVENTED and declared in design.cjs PREVIEW_RUNTIME_COPY. */
const SLEEP_DATE_LABEL = "Night";
const SLEEP_SAVING = "Saving sleep...";
const SLEEP_QUALITY_PREFIX = "Quality: ";
const SLEEP_QUALITY_NONE = "Quality not recorded.";
const SLEEP_OPEN_CHECKIN = "Open recovery check-in";
const SLEEP_CHANGE = "Change sleep";
const SLEEP_SAVE_CORRECTION = "Save correction";
const SLEEP_CANCEL = "Cancel";
const SLEEP_ROLLOVER = "The date changed. Check which night this is for.";
const SLEEP_KEEP_NIGHT = "Keep this night";
const SLEEP_NIGHT_CHANGED = "This night changed while you were editing. Review the saved record before trying again.";
const SLEEP_CHECKIN_CHANGED = "The check-in changed. Review its hours again.";
const SLEEP_UNCERTAIN = "Checking whether sleep was saved.";
/* The acknowledgment that survives a failed read-back: the op committed, so the figure
   below is a FACT about the record and not a hope about the screen. */
const SLEEP_CONFIRMED_PLAIN = "Confirmed from your check-in.";
const SLEEP_CORRECTED_PREFIX = "Corrected ";
const SLEEP_READ_RETRY = "Try reading it again";
const SLEEP_KEPT = "What you typed is still here.";
/* One sentence per refusal code, and no code without one. Each is followed on screen
   by SLEEP_NOTHING_RECORDED, exactly as the brief's table spells it. */
const SLEEP_REFUSAL_COPY = Object.freeze({
  NOTHING: "Choose times or hours asleep.",
  BOTH_TIMES: "Enter both times.",
  TIME_FORM: "Enter valid times.",
  SAME_TIME: "For matching times, enter hours asleep instead.",
  AWAKE: "Enter whole minutes awake within the time in bed.",
  HOURS: "Enter hours from 0 to 24, with up to two decimal places.",
  NIGHT_DATE: "Choose a completed night.",
});

const PROBLEM_ENTRY = "Report a problem";
const PROBLEM_COPIED = "Copied. Send it to Joe.";
const PROBLEM_SELECT = "Select all and copy, then send it to Joe.";

/* A2 — what Today says about today's workout. The three states come from the
   DURABLE workout log (rebuild/m3/w7-preview/today/gym-model.mjs over the accepted
   W6 host), never from a flag this page sets: no session today, one in progress,
   or one closed. "Workout in progress" and "Resume " are the approved design's own
   words; the two that describe a finished workout are this preview's own, declared
   in design.cjs, because the approved prototype has no finished-workout state. */
const WORKOUT_IN_PROGRESS = "Workout in progress";
const WORKOUT_RECORDED_TODAY = "Workout recorded";
const REVIEW_WORKOUT = "Review today’s workout";
const WORKOUT_CANNOT_OPEN = "Today’s workout cannot open";
const WHY_WORKOUT_CANNOT_OPEN = "Why today’s workout cannot open";
const UNFINISHED_WORKOUT = "An earlier workout was never finished";
const CLOSE_UNFINISHED_WORKOUT = "Close the unfinished workout";
/* The ONE sentence that is about this device. It is used only when the page has no
   workout host at all — never for a refusal that came from the accepted layer. */
const NO_LOCAL_STORE = "Your workout could not be opened on this device, and nothing was recorded.";

/* A3 — what Today says about the recovery check-in. The check-in is WIRED now, so
   the "not wired yet" sentence is gone from that entry; what stands in its place is
   the DURABLE fact of whether today's check-in is recorded, read from the same
   client lane the screen writes to. Nothing is said when nothing is recorded: a
   blank check-in is blank, never "none" and never "normal". */
const CHECKIN_RECORDED_TODAY = "Recorded today";
const CHECKIN_NO_STORE_SHORT = "Not available on this device";
const CHECKIN_NO_STORE = "This device could not open its encrypted local store, so no check-in can be recorded here.";

/* A4 — Dad's first run. The route and the landing tile exist ONLY while this
   installation carries no first-run operation, and "carries no first-run
   operation" is read from the durable generation by the setup entry, never from
   a flag this page sets. A store that has been set up, a store that refused
   RESTORE_REQUIRED and a device with no store at all all give the same answer
   here: the setup screens are not offered (BUILD-BRIEF 2.3, S13/S14).
   This module is CommonJS and the setup screens are ESM, so the tile's one word
   is a literal here, declared in design.cjs beside the rest of the preview's own
   runtime copy; setup-app.mjs carries the same string in its own COPY and
   test/setup.test.mjs asserts the two agree. */
const SETUP_ENTRY = "Set up your week";
/* A4 / C1 (review round 1) - THE ONE SENTENCE THE LANDING TODAY OWES HIM.
   A man who has just typed his real week taps "Start using Earned" and arrives
   here. His answers ARE durably recorded; what he is looking at is not yet built
   from them, because the accepted engine cannot read a clean-init athlete
   (register item H3, rebuild/engine/energy.cjs:370 and :84). Showing him the
   preview's sample athlete in silence is S19's named silent failure verbatim,
   "a fake dashboard greets a brand-new athlete", so the page says which it is.
   Same string as setup-model.mjs COPY.notHisNumbersYet, which is where the six
   screens' words live and what design.cjs harvests; the suite asserts the two
   agree, and this module is a SETUP_SOURCE so the harvest sees it here. */
const SETUP_NOT_HIS_NUMBERS = "Your week is saved on this device. The numbers on this screen are still the preview’s sample athlete, not you. Nothing here was measured from anything you did.";

/* WHEN THE SENTENCE IS OWED, as a predicate rather than a flag, so that it clears
   ITSELF the day H3 closes and boot() paints his own state: the moment Today is
   standing on the athlete whose week the record holds, the two labels agree and
   this returns false with no edit anywhere. Exported so the suite can assert both
   directions without needing an engine that can paint a clean-init athlete. */
function setupNoteNeeded(enrolled, athleteLabel, state) {
  if (enrolled !== true) return false;
  if (!state || typeof state.athlete_label !== "string" || !athleteLabel) return true;
  return state.athlete_label !== athleteLabel;
}

/* THE HEADLINE FIT (review D-1). Four of the engine's own instruction titles run to three
   lines and push the primary action out of a 390x844 viewport. This steps the headline
   down from C's 47px, one pixel at a time, ONLY until the primary action is back inside
   the viewport, and never below the 33px floor. A two-line title never moves; engine text
   is never truncated. It is a no-op wherever there is no layout to measure (a jsdom test),
   which is why the browser check is what proves it. */
const HEADLINE_BASE = 47, HEADLINE_FLOOR = 33, HEADLINE_GUARD = 8;
function fitHeadline(view, root) {
  const headline = root.querySelector("h1");
  const primary = root.querySelector('[data-slot="primary"]');
  if (!headline || !primary || !view || !view.clientHeight) return null;
  root.style.removeProperty("--headline");
  const room = () => view.clientHeight - HEADLINE_GUARD
    - (primary.getBoundingClientRect().bottom - view.getBoundingClientRect().top);
  let size = HEADLINE_BASE;
  while (room() < 0 && size > HEADLINE_FLOOR) {
    size -= 1;
    root.style.setProperty("--headline", size + "px");
  }
  return size;
}

/* options.workout (A2) — the durable gym card, injected so this module keeps no
   import of the workout data layer:
     summary()                  -> { phase, sets } read from the durable log, or null
     open({ phone, doc, back })  -> mounts the gym card into the phone element
   With no workout host at all (a browser that will not give this page an encrypted
   local store, which is exactly what a jsdom test is), the entry point says so in
   the capture layer's own terms and records nothing. */
function mountToday(doc, model, options = {}) {
  const phone = doc.getElementById("phone");
  const status = doc.getElementById("today-status");
  const chrome = doc.getElementById("today-storage");
  if (!phone) throw new Error("Today preview: no #phone host element");
  /* D2 ROUND 1, FINDING 2 - the workout entry is REPLACEABLE. `createWorkoutEntry`
     captures `model.stateFromOps()` once, at creation, and neither it nor the gym host
     it opens has a rebind seam (both files are pinned on disk). So when a night is
     recorded, the page builds a NEW entry over the SAME memoized era - one store, one
     lease - and carries the half-typed set across. See rebindWorkout. */
  let workout = options.workout || null;
  let workoutRebinding = null;   // the rebind in flight, so a check can await it
  const session = () => (workout && typeof workout.summary === "function" ? workout.summary() : null) || null;
  /* A3 — the check-in entry, injected exactly as the workout entry is, so this
     module keeps no import of the check-in's data layer:
       summary()                  -> { recorded: boolean } read from the durable lane
       open({ phone, doc, back })  -> mounts the check-in into the phone element */
  const checkin = options.checkin || null;
  const checkinSummary = () => (checkin && typeof checkin.summary === "function" ? checkin.summary() : null) || null;
  /* A4 — the first-run entry, injected exactly as the other two are:
       firstRun()                  -> true only while the DURABLE record holds no
                                      first-run operation for this installation
       open({ doc, phone, back, done }) -> mounts the six screens into #phone */
  const setup = options.setup || null;
  const firstRun = () => !!(setup && typeof setup.firstRun === "function" && setup.firstRun() === true);

  /* N1 - THE FOOD LANE, and why this module opens it rather than boot().

     The four other lanes are opened by today-entry.mjs boot() and injected here. That
     file is PINNED ON DISK by the merged B-NTC artifact through
     rebuild/m3/w6/test/local-today-journey.test.mjs PAGE_PINS, so it cannot gain a
     fifth lane until DECISIONS:154 (5) unpins it. N1 therefore takes the same
     injection point for its tests (`options.food`) and, when the page was given none,
     opens its own lane from here - once, asynchronously, and failing CLOSED: a device
     that will not give this page an encrypted store offers no entry and records
     nothing, and (D2 round 1, finding 3) says so in words the athlete can act on
     rather than claiming the feature was never built. That is why every jsdom mount in
     this repository is unchanged by N1: jsdom has no indexedDB.

     The lane object is a READER plus a writer, never a store: `rows()` is synchronous
     because the adapter's projector is, and it is refreshed from the durable log after
     every write rather than from the screen's own memory. */
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
  if (foodLane && typeof model.setFoodDays === "function") model.setFoodDays(foodLane);

  /* ---------------- N2, THE SLEEP LANE (DECISIONS:167) ----------------
     Opened here for exactly N1's reason, one seam further on: today-entry.mjs boot()
     AND rebuild/m3/w6/local/today-bindings.mjs are both PINNED ON DISK by the merged
     B-NTC artifact, and their pin-class transition is lane B's round after H3
     (DECISIONS:154 (5)), so neither can gain a sixth lane. N2 opens its own through
     `era.client.hostBindings({workoutCommands})` - the point local-client.mjs:395
     exposes and D2's N2-SOURCE-ERRATUM.md confirms - lazily and FAILING CLOSED, so
     every jsdom mount in this repository is unchanged: jsdom has no indexedDB. */
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
  /* D2 ROUND 1, FINDING 6 - MOUNT OWNERSHIP, as the gym card's settings learned it.
     Every paint takes the CURRENT token; a save that resolves after the athlete has
     navigated holds a stale one and applies nothing - no render, no navigation. */
  let mountToken = 0;
  let sleepBusy = false;         // a save is in flight: the screen says so and refuses a second
  /* D2 ROUND 1, FINDING 5 - the night's date is CHOSEN, never guessed. Null means "the
     page's own default, the day before today"; a string is the athlete's own choice and
     survives a rollover. `sleepRollover` holds the date the screen was opened against
     when today moves under an open draft, so the athlete confirms before saving. */
  let sleepNightChoice = null;
  let sleepRollover = null;
  let sleepCorrecting = false;   // the recorded night is being corrected deliberately
  let sleepOpenedNight = null;   // the night an open draft was begun against
  let sleepErrorText = "";       // the refusal or outcome sentence the next paint draws
  /* The screen's own transient state. Nothing durable lives here. TIMES first. */
  const sleepDraft = { mode: "times", bed: "", wake: "", awake_min: "", hours: "",
    awakeOpen: false, from_checkin_op_id: "" };
  const clearSleepDraft = () => {
    sleepDraft.bed = ""; sleepDraft.wake = ""; sleepDraft.awake_min = "";
    sleepDraft.hours = ""; sleepDraft.from_checkin_op_id = ""; sleepDraft.awakeOpen = false;
  };
  if (sleepLane && typeof model.setSleepNights === "function") model.setSleepNights(sleepLane);

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
        if (screen === "today" || screen === "sleep") render(screen, false);
        return lane;
      })
      .catch((error) => {
        sleepLane = null;
        sleepLaneFailure = (error && (error.code || error.message)) || "SLEEP_LANE_UNAVAILABLE";
        if (screen === "sleep") render(screen, false);
        return null;
      });
    return sleepOpening;
  }

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
  function loadCheckInKit() {
    if (checkInKit || checkInKitLoading) return checkInKitLoading;
    checkInKitLoading = Promise.all([import("./checkin-model.mjs"), import("./checkin-app.mjs")])
      .then(([model_, app]) => {
        checkInKit = { createCheckInModel: model_.createCheckInModel, mountCheckIn: app.mountCheckIn };
        return checkInKit;
      })
      .catch(() => { checkInKit = null; return null; });
    return checkInKitLoading;
  }
  if (sleepLane) loadCheckInKit();

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
        if (screen === "today" || screen === "nutrition") render(screen, false);
        return lane;
      })
      .catch((error) => {
        /* `foodOpening` is deliberately LEFT SET: one attempt per mount. A cleared
           handle would let every repaint reopen a store that has already refused. */
        foodLane = null;
        foodLaneFailure = (error && (error.code || error.message)) || "FOOD_LANE_UNAVAILABLE";
        if (screen === "nutrition") render(screen, false);
        return null;
      });
    return foodOpening;
  }

  let screen = "today";
  /* A3 review F7 — BACK RETURNS WHERE THE ATHLETE CAME FROM. The check-in is reachable
     from two places, and "back" from it must not silently move the athlete: entered
     from Today it returns to Today, entered mid-workout it returns to the workout,
     which is still in progress and comes back at the same set with what was typed into
     it still there. The origin is recorded when the route is taken and cleared the
     moment it is used, so a later entry from Today can never inherit it. */
  let checkinOrigin = null;

  /* The engine's own words are never reworded; only the first letter of the marching
     order's verb phrase is capitalised so it can head a button. */
  const capitalise = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  const template = (id) => {
    const node = doc.getElementById(id);
    if (!node) throw new Error("Today preview: missing approved template " + id);
    return node.content.firstElementChild.cloneNode(true);
  };
  const slots = (root) => {
    const map = new Map();
    for (const el of root.querySelectorAll("[data-slot]")) if (!map.has(el.dataset.slot)) map.set(el.dataset.slot, el);
    return map;
  };
  function put(map, name, text) {
    const el = map.get(name);
    if (!el) throw new Error("Today preview: template slot missing: " + name);
    el.textContent = plainOrDrop(text === null || text === undefined || text === "" ? NOT_AVAILABLE : String(text), name);
    return el;
  }
  function arrows(root) {
    for (const el of root.querySelectorAll("[data-arrow]")) el.innerHTML = ARROW;
  }
  function wire(root) {
    arrows(root);
    for (const el of root.querySelectorAll("[data-go]")) el.addEventListener("click", () => render(el.dataset.go, true));
  }
  function show(root, focus) {
    phone.replaceChildren(root);
    if (focus) {
      const target = root.querySelector("h1") || root;
      target.tabIndex = -1;
      target.focus();
    }
  }
  function tell(text) { if (status) status.textContent = plainOrDrop(text, "today-status"); }

  /* ---------------- Today ---------------- */
  function renderToday(focus) {
    const view = model.read();
    if (chrome) chrome.textContent = plainOrDrop(view.storageNote, "today-storage");
    const root = template("t-today");
    const map = slots(root);
    put(map, "date", dayLabel(view.today));

    if (view.blocked) {
      put(map, "instruction", "Earned cannot show today's plan.");
      put(map, "instruction-why", view.blockedCopy || "This device's local record could not be trusted, so nothing is shown.");
      for (const name of ["kcal", "kcal-unit", "protein", "protein-unit", "kcal-note",
        "workout-title", "workout-count", "morning", "trend", "primary-label"]) put(map, name, null);
      for (const name of ["nutrition-state", "coach-state"]) put(map, name, NOT_WIRED);
      put(map, "recovery-state", null);
      map.get("primary").disabled = true;
      /* A blocked Today is exactly when a problem is worth reporting, so the control
         is wired here too. It reads nothing from the record it could not trust. */
      problemControl(map);
      wire(root);
      show(root, focus);
      return;
    }

    put(map, "instruction", view.nowModel.move.title);
    const owed = !view.hasReadToday;
    /* Before a weigh-in the sentence under the instruction is the engine's reason for
       asking; after it, the engine's reading of where the plan stands. Both are the
       engine's own strings. */
    put(map, "instruction-why", owed
      ? (view.marchingOrder.why || view.statusFace.cause)
      : (view.statusFace.cause || view.nowModel.move.body));

    const kcal = calorieHeadline(view.calorieTarget);
    put(map, "kcal", kcal);
    put(map, "kcal-unit", kcal === null ? "" : "kcal");
    put(map, "protein", Number.isFinite(view.proteinTarget.g) ? amount(view.proteinTarget.g) : null);
    put(map, "protein-unit", Number.isFinite(view.proteinTarget.g) ? "g protein" : "");
    put(map, "kcal-note", calorieBand(view.calorieTarget));

    put(map, "workout-title", view.workout.title);
    /* The workout line carries the durable state of today's session — in progress,
       recorded, or refused — beside the engine's own exercise count. A2.
       REVIEW B1: the state comes from a DRY PREPARATION through the accepted host
       (gym-model.read() prepares without storing anything), so Today never offers
       "ready" and "Start" for a workout the layer will refuse to prepare. A refusal
       is shown in plain words with the layer's own code, exactly once, and is never
       described as a fault of this device. */
    const today = session();
    const refused = today && today.phase === "blocked" ? (today.code || null) : null;
    /* A session abandoned on an EARLIER day blocks every later day in the accepted
       client. It is not a dead end: the layer's own `early` close retires it, so
       Today names it and offers that close rather than printing a code the athlete
       can do nothing about (review round 2, point 3). */
    const stranded = today && today.phase === "unfinished" ? today.unfinished : null;
    const sessionState = today && today.phase === "active" ? WORKOUT_IN_PROGRESS
      : today && today.phase === "finished" ? WORKOUT_RECORDED_TODAY
      : stranded ? UNFINISHED_WORKOUT + " · " + stranded.day
      : refused ? WORKOUT_CANNOT_OPEN + " · " + refused : null;
    put(map, "workout-count", view.workout.exerciseCount === null
      ? (view.workout.unavailableReason ? "Today's exercises are not available: " + view.workout.unavailableReason : "No session is scheduled today.")
      : view.workout.exerciseCount + (view.workout.exerciseCount === 1 ? " exercise" : " exercises")
        + " · " + (sessionState || "Your set targets are ready"));

    /* N1 - the nutrition entry says what the DURABLE record says once this device has
       a food lane, and keeps A1's unwired marker until it does. With no lane there is
       nothing to record and nothing to report, which is the state the marker has
       always described. Written straight, like the check-in's, so a day with nothing
       recorded says NOTHING rather than a placeholder the athlete never entered. */
    map.get("nutrition-state").textContent = plainOrDrop(nutritionState(), "nutrition-state");
    put(map, "coach-state", NOT_WIRED);
    /* Written straight, not through put(): when nothing is recorded this slot says
       NOTHING. An empty check-in is empty, and a placeholder sentence would be the
       page inventing a state the athlete never entered. */
    map.get("recovery-state").textContent = plainOrDrop(recoveryState(), "recovery-state");
    /* N2 - Today's sleep entry and its one line. Written straight, like the other two:
       a night this device holds nothing for says NOTHING rather than a placeholder. */
    put(map, "sleep-entry-label", SLEEP_TITLE);
    map.get("sleep-state").textContent = plainOrDrop(sleepState(), "sleep-state");
    setupTile(map);
    setupNote(map);
    problemControl(map);
    put(map, "morning", morningLine(view));
    put(map, "trend", trendLine(view));

    const primary = map.get("primary");
    /* The resume action the approved direction requires: while a workout is in
       progress the single primary action resumes it, in the approved design's own
       word. A recorded workout is reviewable, not restartable. */
    const resuming = !!(today && today.phase === "active");
    const action = resuming ? "Resume " + view.workout.title
      : stranded ? CLOSE_UNFINISHED_WORKOUT
      : owed ? capitalise(view.marchingOrder.thenText || "Log this morning's weight")
      : today && today.phase === "finished" ? REVIEW_WORKOUT
      : refused ? WHY_WORKOUT_CANNOT_OPEN
      : "Start " + view.workout.title;
    put(map, "primary-label", action);
    primary.addEventListener("click", async () => {
      if (stranded) {
        /* One durable write, through the same client as everything else, and the
           screen repaints from what the layer answers — never from optimism. */
        primary.disabled = true;
        try { await workout.recover(); } finally { primary.disabled = false; }
        render("today", false);
        return;
      }
      return owed && !resuming ? openWeighIn() : render("workout", true);
    });
    if (!owed && view.workout.exerciseCount === null) primary.disabled = true;

    wire(root);
    show(root, focus);
    fitHeadline(phone, root);
    /* A change to the headline's text re-runs the fit. No test hook: the page simply
       keeps itself correct, and the browser check exercises the engine's whole title
       vocabulary through exactly this path. */
    if (typeof doc.defaultView !== "undefined" && doc.defaultView && doc.defaultView.MutationObserver) {
      const headline = root.querySelector("h1");
      if (headline) new doc.defaultView.MutationObserver(() => fitHeadline(phone, root))
        .observe(headline, { characterData: true, childList: true, subtree: true });
    }
    if (view.message) tell(view.message.copy);
    else if (view.unadopted > 0) tell("This device holds " + view.unadopted + " stored reading(s) the plan did not use.");
  }

  /* ---------------- the weigh-in sheet ---------------- */
  function openWeighIn() {
    if (phone.querySelector('[role="dialog"]')) return;
    const returnFocus = doc.activeElement;
    const sheet = template("t-weigh");
    const map = slots(sheet);
    put(map, "weigh-submit", "Record this weight");
    arrows(sheet);
    const input = sheet.querySelector("#morning-weight");
    const error = sheet.querySelector("#weigh-error");
    const page = phone.firstElementChild;
    if (page) page.inert = true;
    phone.append(sheet);
    input.focus();

    function close() {
      sheet.remove();
      if (page) page.inert = false;
      if (returnFocus && returnFocus.isConnected) returnFocus.focus();
    }
    for (const step of sheet.querySelectorAll("[data-step]")) {
      step.addEventListener("click", () => {
        const current = Number(input.value);
        const next = (Number.isFinite(current) ? current : 0) + Number(step.dataset.step);
        input.value = String(Math.max(0, Math.round(next * 10) / 10));
      });
    }
    sheet.querySelector('[data-action="cancel"]').addEventListener("click", close);
    sheet.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); }
    });
    const submit = sheet.querySelector('button[type="submit"]');
    sheet.addEventListener("submit", async (event) => {
      event.preventDefault();
      /* Hand the raw entry to the model. Everything that can refuse it — the form bound,
         then the client itself — answers in words, and those words are shown. An empty
         box becomes a non-number so the client's own "A weight is required." is what the
         athlete reads; nothing is ever refused silently (review F8).
         AWAITED since review B2: the reading is durable in the encrypted repository
         before this screen says anything, so the sheet cannot close on a save that did
         not happen. The button is disabled while the transaction is in flight. */
      if (submit.disabled) return;
      submit.disabled = true;
      const raw = input.value.trim();
      let result;
      try { result = await model.weighIn(raw === "" ? raw : Number(raw)); }
      catch (error_) { result = { ok: false, copy: "This weight could not be recorded, and nothing was recorded. " + (error_ && error_.message ? error_.message : "") }; }
      submit.disabled = false;
      if (!result.ok) {
        error.textContent = plainOrDrop(result.copy || "This weight could not be recorded, and nothing was recorded.", "weigh-error");
        input.focus();
        return;
      }
      close();
      render("today", true);
    });
  }

  /* ---------------- Why this plan ---------------- */
  function renderWhy(focus) {
    const view = model.read();
    const root = template("t-why");
    const map = slots(root);
    if (view.blocked) {
      put(map, "why-lead", view.blockedCopy || "Nothing can be explained while the local record is not trusted.");
    } else {
      put(map, "why-lead", view.nowModel.move.body);
      const host = map.get("why-sections");
      for (const section of view.why) {
        const block = doc.createElement("div");
        block.className = "macro-row";
        const head = doc.createElement("strong");
        head.textContent = plainOrDrop(section.heading, "why-heading");
        head.setAttribute("role", "heading");
        head.setAttribute("aria-level", "2");
        const body = doc.createElement("p");
        body.textContent = plainOrDrop(section.body, "why-body");
        block.append(head, body);
        host.append(block);
      }
    }
    wire(root);
    show(root, focus);
  }

  /* ---------------- entry points that are NOT wired ---------------- */
  /* H3 HONESTY, AT THE ONE SCREEN THAT ONLY PAINTS TARGETS (DECISIONS:124 / :142).
     The engine cannot produce a calorie band or a protein target for a clean-init
     athlete yet: energyBalanceTarget and proteinTarget do not return a blocked view,
     they THROW on his state. This screen therefore reads defensively - an unreadable
     view is NO FIGURE and the reason, never a zero and never a stack trace - so that
     his intake entry below is still usable on the day he finishes setup. When H3
     lands this branch simply stops being taken. */
  function readOrNoTargets() {
    try { return model.read(); }
    catch (_) { return { blocked: true, blockedCopy: null }; }
  }
  function renderNutrition(focus) {
    const view = readOrNoTargets();
    const root = template("t-nutrition");
    const map = slots(root);
    const host = map.get("macros");
    const rows = view.blocked ? [] : [
      ["Energy", calorieHeadline(view.calorieTarget), "kcal", calorieBand(view.calorieTarget)],
      ["Protein", Number.isFinite(view.proteinTarget.g) ? amount(view.proteinTarget.g) : null, "g",
        "Your daily protein target."],
      ["Carbohydrate", null, "g", "Not prescribed. The engine issues no carbohydrate target."],
      ["Fat", null, "g", "Not prescribed. The engine issues no fat target."],
    ];
    for (const [label, value, unit, copy] of rows) {
      const row = doc.createElement("div");
      row.className = "macro-row";
      const top = doc.createElement("div");
      top.className = "row";
      const name = doc.createElement("strong");
      name.textContent = plainOrDrop(label, "macro-label");
      const figure = doc.createElement("span");
      if (value === null) { figure.className = "unit"; figure.textContent = "Not prescribed"; }
      else {
        const big = doc.createElement("span");
        big.className = "number";
        big.textContent = plainOrDrop(value, "macro-value");
        const u = doc.createElement("span");
        u.className = "unit";
        u.textContent = " " + unit;
        figure.append(big, u);
      }
      top.append(name, figure);
      const note = doc.createElement("p");
      note.textContent = plainOrDrop(copy, "macro-note");
      row.append(top, note);
      host.append(row);
    }
    /* N1 - the entry, and the one sentence under it.

       WITHOUT A FOOD LANE there is nothing to record into, and the screen says which
       of the two true things happened: the store is still opening, or it refused and
       here is its reason. With the lane open the screen records. */
    if (!foodLane) {
      /* D2 round 1, finding 3 - WHAT cannot happen, WHY, and WHAT TO DO, FIRST. The
         only sentence here used to be the unwired-screen one, which answered none of
         the three: what is actually true of a device with no entry is that THIS DEVICE
         would not open a store, and that is now what it says and what it tells him to
         do about it. The attempt is made BEFORE the sentence is chosen, so a store
         that is still opening says it is opening rather than that it failed.

         THE UNWIRED SENTENCE STAYS, LAST, AND IT IS STILL TRUE: the full nutrition
         PLAN behind this tile is genuinely unbuilt, which is what Today's own
         NOT_WIRED marker says about it too. It is also load bearing under custody -
         rebuild/m3/w7-preview/today/test/view.test.mjs is pinned ON DISK by the merged
         B-NTC artifact (DECISIONS:144) and asserts it here, so this build cannot
         remove it and does not try; it demotes it below the sentence the athlete can
         act on instead. */
      const opening = openFoodLane();
      const why = opening && !foodLaneFailure ? FOOD_OPENING
        : foodLaneFailure ? FOOD_NO_STORE + " " + FOOD_REASON + foodLaneFailure + "."
          : FOOD_NO_STORE;
      put(map, "stub-note", why + " " + FOOD_PLAN_UNWIRED);
    } else {
      /* H3 HONESTY (N1.11, DECISIONS:124 / :142). Before H3 lands, the engine has no
         calorie band and no protein target for a clean-init athlete: proteinTarget and
         energyBalanceTarget both throw on his state, so this screen paints NO FIGURE
         and says why. The entry below still records - his intake is his fact, and the
         target is the engine's. This branch flips to the figures the moment the
         engine can produce them; nothing here has to change for it. */
      put(map, "stub-note", view.blocked ? FOOD_NO_TARGETS : FOOD_NOT_PRESCRIBED);
      foodEntry(map);
    }
    wire(root);
    show(root, focus);
  }

  /* N1 - TODAY'S INTAKE. Two optional boxes, one primary action, and a read-back that
     comes from the PROJECTED engine state rather than from what was typed. Every
     refusal is the page's own sentence and is decided before anything is written; no
     value is ever clamped into range. A second save for the same day is a CORRECTION:
     it writes a NEW operation and the projector takes the latest for that date. */
  function foodEntry(map) {
    const section = map.get("food-entry");
    if (!section) return null;
    section.hidden = false;
    put(map, "food-head", FOOD_HEAD);
    put(map, "food-lead", FOOD_LEAD);
    put(map, "food-cal-label", FOOD_CAL_LABEL);
    put(map, "food-pro-label", FOOD_PRO_LABEL);
    put(map, "food-save-label", FOOD_SAVE);
    const error = map.get("food-error");
    const recorded = map.get("food-recorded");
    const cal = map.get("food-cal");
    const pro = map.get("food-pro");
    /* D2 round 1, finding 3 - a lane that opened INTO a refusal (a lost lease, a
       restore the athlete has not done) says so before he types, in the client's own
       words, with the action attached. */
    const opened = foodLane && foodLane.host ? foodLane.host.openedRefusal : null;
    error.textContent = opened
      ? plainOrDrop(FOOD_REFUSED + " " + reasonOf(opened) + " " + FOOD_REFUSED_ACTION, "food-error")
      : "";
    /* What the ENGINE holds for today, after the replay. A day with nothing recorded
       says nothing at all - it is never a zero (writers.cjs's own rule, N1 1.2). */
    const logged = typeof model.loggedFood === "function" ? model.loggedFood(model.today) : null;
    const row = typeof model.recordedFood === "function" ? model.recordedFood(model.today) : null;
    const has = logged && (logged.cal !== null || logged.pro !== null);
    /* D2 round 1, finding 1 - the day IS recorded and the engine would not take it.
       The athlete sees his own figures, out of the operation the log holds, and the
       reason his ledger has nothing to read back. Nothing is dropped and no engine
       figure is invented. */
    const unreadable = !has && !!row
      && typeof model.foodUnavailable === "function" && model.foodUnavailable(model.today);
    if (unreadable) {
      recorded.textContent = plainOrDrop(
        provenanceLine(row) + " · " + intakeLine(dayOf(row)) + " " + FOOD_KEPT_UNREADABLE, "food-recorded");
    } else {
      recorded.textContent = has
        ? plainOrDrop(provenanceLine(row) + " · " + intakeLine(logged) + " " + FOOD_CORRECTION, "food-recorded")
        : "";
    }
    recorded.hidden = !has && !unreadable;
    /* D2 ROUND 2, R2-1 - AN ACKNOWLEDGED INTAKE STAYS ON THE SCREEN even when the read
       that should have confirmed it failed. The acknowledgment is built from the
       COMMITTED operation, not from a log this device could not read; the read failure
       is named beside it with its own reason and the read is offered again. An UNKNOWN
       outcome claims neither that it was stored nor that it was not. */
    const retry = map.get("food-retry");
    /* HIS DRAFT SURVIVES. The repaint that carries the read failure rebuilds the two
       boxes from the template, so what he typed is put back into them. */
    if (foodReadBack && foodReadBack.entry) {
      cal.value = foodReadBack.entry.cal === undefined ? "" : String(foodReadBack.entry.cal);
      pro.value = foodReadBack.entry.pro === undefined ? "" : String(foodReadBack.entry.pro);
    }
    if (foodReadBack && foodReadBack.state === "unavailable") {
      recorded.textContent = plainOrDrop(
        FOOD_SAVED + " · " + intakeLine(foodReadBack.day) + " " + FOOD_SAVED_UNREAD, "food-recorded");
      recorded.hidden = false;
    }
    if (foodReadBack) {
      const said = foodReadBack.code ? FOOD_REASON + foodReadBack.code + "." : "";
      const head = foodReadBack.state === "unknown" ? FOOD_UNKNOWN : FOOD_SAVED_UNREAD;
      error.textContent = plainOrDrop([head, said, FOOD_READ_ACTION].filter(Boolean).join(" "), "food-error");
    }
    if (retry) {
      retry.hidden = !foodReadBack;
      retry.textContent = foodReadBack ? plainOrDrop(FOOD_READ_RETRY, "food-retry") : "";
      if (foodReadBack) retry.addEventListener("click", () => { foodSaving = retryFoodRead(); });
    }
    const save = map.get("food-save");
    save.addEventListener("click", () => { foodSaving = recordIntake(save, cal, pro, error); });
    return section;
  }
  /* The write itself, kept as a named async function so the click handler can hand the
     in-flight promise to `foodPending()`: a durable write is several turns of the
     event loop and a check that polls the log needs to know when it has settled. */
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
        render("nutrition", false);
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
      render("nutrition", false);
    }
  }

  /* D2 round 2, R2-1 - THE READ, ON ITS OWN. It submits no intake: it asks the lane to
     read the durable log again and, when that answers, the screen goes back to saying
     what the record says. A read that fails again updates only the reason. */
  async function retryFoodRead() {
    if (!foodLane || typeof foodLane.refresh !== "function") return;
    try {
      await foodLane.refresh();
      foodReadBack = null;
    } catch (error) {
      foodReadBack = Object.assign({}, foodReadBack,
        { code: (error && (error.code || error.message)) || "FOOD_READ_BACK_FAILED" });
    }
    render("nutrition", false);
  }
  /* WHY, IN THE WORDS OF WHATEVER REFUSED. A client refusal carries its own copy; a
     refusal with no copy carries the code it named, and the code is shown as the code.
     Neither is reworded here, and a refusal with neither says nothing extra rather
     than inventing a cause. */
  function reasonOf(refusal) {
    const copy = refusal && typeof refusal.copy === "string" ? refusal.copy.trim() : "";
    if (copy) return copy;
    const code = refusal && refusal.code ? String(refusal.code).trim() : "";
    return code ? FOOD_REASON + code + "." : "";
  }
  /* The recorded figures, in the engine's own units, and only the ones it holds. */
  function intakeLine(logged) {
    const parts = [];
    if (logged.cal !== null && logged.cal !== undefined) parts.push(amount(logged.cal) + " kcal");
    if (logged.pro !== null && logged.pro !== undefined) parts.push(amount(logged.pro) + " g protein");
    return parts.join(" · ");
  }
  /* The operation's own day, shaped like a projected one so one line renders both. */
  function dayOf(row) {
    const day = (row && row.day) || {};
    return { cal: day.cal === undefined ? null : day.cal, pro: day.pro === undefined ? null : day.pro };
  }
  /* D2 round 1, finding 4 - PROVENANCE. The stored effective stamp, as the operation
     carries it: the local time it was recorded at and the offset that time was in.
     Neither is computed here, and a stamp the log does not hold is not invented. */
  function provenanceLine(row) {
    let line = FOOD_SAVED;
    if (row && typeof row.time === "string" && row.time) line += " at " + row.time;
    if (row && typeof row.offset === "string" && row.offset) line += " (local offset " + row.offset + ")";
    return line;
  }

  /* ======================= N2, THE SLEEP ENTRY (DECISIONS:167) =======================
     The night this screen is about: the day BEFORE today, which is exactly what
     checkin-model.mjs dayBefore computes for the check-in that reads it back. */
  /* D2 ROUND 1, FINDING 5 - the DEFAULT is the day before today; the athlete may choose
     any completed night through the same label, and his choice is what the screen and
     the write both use. Nothing about the night's date is inferred from a save time. */
  const sleepNightDate = () => sleepNightChoice || sleepRollover
    || SleepModel.nightDateFor(model.today);
  /* Is anything typed? A rollover may only disturb a draft that exists. */
  const sleepTyped = () => !!(sleepDraft.bed || sleepDraft.wake || sleepDraft.hours
    || sleepDraft.awake_min);
  /* MIDNIGHT UNDER AN OPEN DRAFT. While nothing is typed and nothing is chosen, the
     screen simply follows the clock. Once there is a draft, the night it was begun
     against is PINNED (sleepRollover) and the athlete confirms it before saving; the
     date never moves under him, and the page never silently moves it for him. */
  function sleepClockCheck() {
    const now = SleepModel.nightDateFor(model.today);
    if (sleepNightChoice) return null;
    if (!sleepTyped()) { sleepRollover = null; sleepOpenedNight = now; return null; }
    if (!sleepOpenedNight) { sleepOpenedNight = now; return null; }
    if (sleepOpenedNight === now) return null;
    sleepRollover = sleepOpenedNight;
    return sleepOpenedNight;
  }
  /* The check-in for the morning AFTER a night, which is where its quality already
     lives. A3 asked the question once; this lane never asks it again. */
  function sleepQualityFor(date) {
    if (!checkin || !checkin.checkin || typeof checkin.checkin.recorded !== "function") return null;
    const row = checkin.checkin.recorded();
    if (!row || !row.answers || row.date !== SleepModel.dayAfter(date)) return null;
    const choice = row.answers.sleep_quality;
    return typeof choice === "string" && choice ? { choice, date: row.date } : null;
  }
  /* Every operation this device holds for one night, in the log's own order. Two of
     them mean the record has been CORRECTED, which the screen says in the brief's
     own word rather than presenting a correction as a first entry. */
  function sleepOpsFor(date) {
    const rows = sleepLane && typeof sleepLane.rows === "function" ? sleepLane.rows() : null;
    return Array.isArray(rows) ? rows.filter((row) => row && row.night && row.night.date === date) : [];
  }

  /* The check-in's own answer for the morning AFTER this night, offered as a dated
     SUGGESTION and never promoted silently. Read out of the check-in lane the page was
     given; with no lane there is nothing to offer and the screen says nothing. */
  function sleepCheckInOffer() {
    if (!checkin || !checkin.checkin || typeof checkin.checkin.recorded !== "function") return null;
    const row = checkin.checkin.recorded();
    if (!row || !row.answers) return null;
    const hours = row.answers.sleep_hours;
    if (typeof hours !== "number" || !Number.isFinite(hours)) return null;
    return { date: row.date, hours, op_id: row.op_id || null };
  }

  function renderSleep(focus) {
    const root = template("t-sleep");
    const map = slots(root);
    const date = sleepNightDate();
    put(map, "sleep-title", SLEEP_TITLE);
    put(map, "sleep-night", SLEEP_NIGHT_PREFIX + (date || ""));
    const opening = sleepLane ? null : openSleepLane();
    if (!sleepLane) {
      /* WHAT CANNOT HAPPEN, WHY, AND WHAT TO DO - N1's D2 round-1 lesson, applied
         here from the first line rather than after a review. */
      put(map, "sleep-note", sleepLaneFailure
        ? SLEEP_NO_STORE + " " + FOOD_REASON + sleepLaneFailure + "."
        : (opening ? FOOD_OPENING : SLEEP_NO_STORE));
      map.get("sleep-entry-form").hidden = true;
    } else {
      sleepEntry(map, root, date);
    }
    wire(root);
    show(root, focus);
  }

  /* The entry itself. Two modes, TIMES first (:167 (3)); one primary action; the
     recorded night read back from the PROJECTED engine state, with its provenance. */
  function sleepEntry(map, root, date) {
    const section = map.get("sleep-entry-form");
    section.hidden = false;
    const logged = typeof model.loggedSleep === "function" ? model.loggedSleep(date) : null;
    const record = typeof model.recordedSleep === "function" ? model.recordedSleep(date) : null;
    /* D2 ROUND 1, FINDING 6 - AN ACKNOWLEDGED NIGHT IS A NIGHT. When the read-back did
       not land there is no projected row to read, but the op committed, so the figure
       the athlete just saved stays on the screen from the acknowledgment itself. */
    const ack = sleepAck && sleepAck.date === date ? sleepAck : null;
    const known = logged || (ack ? { h: ack.hours, d: ack.date } : null);
    put(map, "sleep-note", known ? "" : SLEEP_NONE);
    map.get("sleep-note").hidden = !!known;

    /* D2 ROUND 1, FINDING 5 - THE NIGHT'S OWN DATE, chosen rather than assumed. The
       default is yesterday; any completed night may be selected, and the label above
       always names the night the write will carry. */
    put(map, "sleep-date-label", SLEEP_DATE_LABEL);
    const dateBox = map.get("sleep-date");
    if (dateBox) {
      dateBox.value = date || "";
      const latest = SleepModel.nightDateFor(model.today);
      if (latest) dateBox.max = latest;
      dateBox.addEventListener("change", () => {
        sleepNightChoice = dateBox.value || null;
        sleepRollover = null;
        sleepAck = null; sleepReadBack = null; sleepCorrecting = false; sleepErrorText = "";
        render("sleep", false);
      });
    }
    /* The rollover confirmation. Shown only when the clock has crossed midnight under
       an open draft; until it is answered the save refuses, so a night cannot be
       recorded against a date the athlete never saw. */
    const rolled = sleepClockCheck();
    const rolloverLine = map.get("sleep-rollover");
    const keepNight = map.get("sleep-keep-night");
    if (rolloverLine) {
      rolloverLine.hidden = !rolled;
      rolloverLine.textContent = rolled ? plainOrDrop(SLEEP_ROLLOVER, "sleep-rollover") : "";
    }
    if (keepNight) {
      keepNight.hidden = !rolled;
      keepNight.textContent = rolled ? plainOrDrop(SLEEP_KEEP_NIGHT, "sleep-keep-night") : "";
      keepNight.addEventListener("click", () => {
        sleepNightChoice = sleepRollover || sleepNightDate();
        sleepRollover = null;
        render("sleep", false);
      });
    }

    put(map, "sleep-mode-label", SLEEP_MODE_LABEL);
    const times = map.get("sleep-mode-times");
    const hoursMode = map.get("sleep-mode-hours");
    times.textContent = plainOrDrop(SLEEP_MODE_TIMES, "sleep-mode-times");
    hoursMode.textContent = plainOrDrop(SLEEP_MODE_HOURS, "sleep-mode-hours");
    times.setAttribute("aria-pressed", String(sleepDraft.mode === "times"));
    hoursMode.setAttribute("aria-pressed", String(sleepDraft.mode === "hours"));
    /* A MODE IS NOT A FACT. Switching keeps what is typed in the other mode locally
       and submits only the visible one. */
    times.addEventListener("click", () => { sleepDraft.mode = "times"; render("sleep", false); });
    hoursMode.addEventListener("click", () => { sleepDraft.mode = "hours"; render("sleep", false); });

    const timesBlock = map.get("sleep-times");
    const hoursBlock = map.get("sleep-hours-mode");
    timesBlock.hidden = sleepDraft.mode !== "times";
    hoursBlock.hidden = sleepDraft.mode !== "hours";

    put(map, "sleep-bed-label", SLEEP_BED_LABEL);
    put(map, "sleep-wake-label", SLEEP_WAKE_LABEL);
    put(map, "sleep-awake-label", SLEEP_AWAKE_LABEL);
    put(map, "sleep-hours-label", SLEEP_HOURS_ASK);
    put(map, "sleep-hours-note", SLEEP_HOURS_NOTE);
    put(map, "sleep-save-label", SLEEP_SAVE);
    const bed = map.get("sleep-bed");
    const wake = map.get("sleep-wake");
    const awake = map.get("sleep-awake");
    const hoursBox = map.get("sleep-hours");
    bed.value = sleepDraft.bed;
    wake.value = sleepDraft.wake;
    awake.value = sleepDraft.awake_min;
    hoursBox.value = sleepDraft.hours;
    bed.addEventListener("input", () => { sleepDraft.bed = bed.value; sleepEstimate(map); });
    wake.addEventListener("input", () => { sleepDraft.wake = wake.value; sleepEstimate(map); });
    awake.addEventListener("input", () => { sleepDraft.awake_min = awake.value; sleepEstimate(map); });
    hoursBox.addEventListener("input", () => { sleepDraft.hours = hoursBox.value; });

    const toggle = map.get("sleep-awake-toggle");
    toggle.textContent = plainOrDrop(SLEEP_AWAKE_TOGGLE, "sleep-awake-toggle");
    map.get("sleep-awake-field").hidden = !sleepDraft.awakeOpen;
    toggle.addEventListener("click", () => { sleepDraft.awakeOpen = !sleepDraft.awakeOpen; render("sleep", false); });
    sleepEstimate(map);

    /* THE CHECK-IN'S OWN ANSWER, dated, as a suggestion. Taking it fills the hours
       box and carries the source op id; it writes nothing by itself. */
    const offer = sleepCheckInOffer();
    const offerLine = map.get("sleep-checkin");
    const use = map.get("sleep-use-checkin");
    if (offer && !known) {
      offerLine.hidden = false;
      offerLine.textContent = plainOrDrop(
        SLEEP_CHECKIN_PREFIX + offer.date + ": " + offer.hours + " h", "sleep-checkin");
      use.hidden = false;
      use.textContent = plainOrDrop(SLEEP_USE_CHECKIN, "sleep-use-checkin");
      use.addEventListener("click", () => {
        sleepDraft.mode = "hours";
        sleepDraft.hours = String(offer.hours);
        sleepDraft.from_checkin_op_id = offer.op_id || "";
        render("sleep", false);
      });
    } else { offerLine.hidden = true; offerLine.textContent = ""; use.hidden = true; use.textContent = ""; }

    /* D2 ROUND 1, FINDING 5 - QUALITY IS ASKED ONCE, IN THE CHECK-IN. This lane
       DISPLAYS what A3 already holds for the morning after this night and never asks a
       second time; with no answer it says so and offers the way to give one. */
    const quality = sleepQualityFor(date);
    const qualityLine = map.get("sleep-quality");
    const openCheckIn = map.get("sleep-open-checkin");
    if (qualityLine) {
      qualityLine.hidden = false;
      qualityLine.textContent = plainOrDrop(quality
        ? SLEEP_QUALITY_PREFIX + quality.choice : SLEEP_QUALITY_NONE, "sleep-quality");
    }
    if (openCheckIn) {
      openCheckIn.hidden = !!quality;
      openCheckIn.textContent = quality ? "" : plainOrDrop(SLEEP_OPEN_CHECKIN, "sleep-open-checkin");
      openCheckIn.addEventListener("click", () => render("recovery", true));
    }

    const error = map.get("sleep-error");
    error.textContent = sleepErrorText
      ? plainOrDrop(sleepErrorText, "sleep-error")
      : (sleepReadBack ? plainOrDrop(SLEEP_READ_FAILED + " " + SLEEP_KEPT, "sleep-error") : "");
    /* D2 ROUND 1, FINDING 6 - the read that failed is OFFERED AGAIN rather than left
       for the athlete to discover by reopening the page. */
    const retry = map.get("sleep-read-retry");
    if (retry) {
      retry.hidden = !sleepReadBack;
      retry.textContent = sleepReadBack ? plainOrDrop(SLEEP_READ_RETRY, "sleep-read-retry") : "";
      retry.addEventListener("click", () => { sleepSaving = retrySleepRead(); });
    }
    const recorded = map.get("sleep-recorded");
    recorded.hidden = !known;
    /* A night the ENGINE holds with NO operation behind it is the athlete's imported
       basis, not something this device recorded: it shows the figure and claims no
       provenance at all, because there is none to claim. An acknowledged night whose
       read-back failed shows its committed figure and says the save time is not known,
       because from the acknowledgment alone it is not.
       D2 ROUND 1, FINDING 5 - a second op for one night is a CORRECTION, and the
       screen says which of the two it is looking at. */
    const corrected = sleepOpsFor(date).length > 1;
    recorded.textContent = known
      ? plainOrDrop([known.h + " h", sleepSourceLine(record),
        record ? sleepStamp(record, corrected) : (ack ? SLEEP_NO_SAVE_TIME : "")]
        .filter(Boolean).join(" "), "sleep-recorded")
      : "";

    /* D2 ROUND 1, FINDING 5 - THE CORRECTION FLOW. A recorded night owns the display:
       the form is put away until the athlete deliberately asks to change it, and the
       saved value stays visible the whole time, exactly as the brief requires. */
    const change = map.get("sleep-change");
    const cancel = map.get("sleep-cancel");
    const editing = !known || sleepCorrecting;
    if (map.get("sleep-modes")) map.get("sleep-modes").hidden = !editing;
    timesBlock.hidden = !editing || sleepDraft.mode !== "times";
    hoursBlock.hidden = !editing || sleepDraft.mode !== "hours";
    if (map.get("sleep-date-field")) map.get("sleep-date-field").hidden = false;
    if (change) {
      change.hidden = !known || sleepCorrecting;
      change.textContent = change.hidden ? "" : plainOrDrop(SLEEP_CHANGE, "sleep-change");
      change.addEventListener("click", () => { sleepCorrecting = true; render("sleep", false); });
    }
    if (cancel) {
      cancel.hidden = !sleepCorrecting;
      cancel.textContent = sleepCorrecting ? plainOrDrop(SLEEP_CANCEL, "sleep-cancel") : "";
      cancel.addEventListener("click", () => {
        sleepCorrecting = false; clearSleepDraft(); render("sleep", false);
      });
    }
    const save = map.get("sleep-save");
    save.hidden = !editing;
    put(map, "sleep-save-label", sleepBusy ? SLEEP_SAVING
      : (known ? SLEEP_SAVE_CORRECTION : SLEEP_SAVE));
    save.disabled = sleepBusy;
    save.addEventListener("click", () => { sleepSaving = recordSleep(map); });
    return section;
  }

  /* D2 ROUND 1, FINDING 6 - the read that failed, asked again. The op is already
     durable; this only tries to see it. Nothing is written and nothing navigates. */
  async function retrySleepRead() {
    if (!sleepLane || !sleepReadBack) return;
    const token = mountToken;
    try { await sleepLane.refresh(); }
    catch (_) { if (token === mountToken) render("sleep", false); return; }
    if (token !== mountToken) return;      // the athlete left; his destination is his
    sleepReadBack = null;
    sleepAck = null;
    sleepErrorText = "";
    clearSleepDraft();
    workoutRebinding = rebindWorkout();
    render("sleep", false);
  }

  /* The hours a pair of clock times comes to, asked of the ENGINE and never computed
     here. Shown only when the pair is recordable, so the clamp can never be displayed
     as a figure the athlete did not mean. */
  function sleepEstimate(map) {
    const line = map.get("sleep-estimate");
    if (!line) return;
    const entry = { ...sleepDraft, mode: "times", date: sleepNightDate() };
    const refusal = SleepModel.timesRefusal(entry, model.today);
    if (refusal === SleepModel.REFUSALS.SAME_TIME) {
      line.textContent = plainOrDrop(SLEEP_CLOCK_CHANGE, "sleep-estimate");
      return;
    }
    if (refusal && refusal !== SleepModel.REFUSALS.NIGHT_DATE) { line.textContent = ""; return; }
    const minutes = String(sleepDraft.awake_min).trim();
    const hours = model.engine.sleepSpanH(sleepDraft.bed, sleepDraft.wake,
      minutes === "" ? 0 : Number(minutes));
    line.textContent = plainOrDrop(SLEEP_ESTIMATE_PREFIX + hours + " h"
      + (minutes === "" ? " " + SLEEP_AWAKE_NONE : ""), "sleep-estimate");
  }

  /* Which of the two shapes the WINNING operation used, in the brief's own words. */
  function sleepSourceLine(record) {
    const night = record && record.night ? record.night : null;
    if (!night) return "";
    if (Object.hasOwn(night, "hours")) {
      if (!night.from_checkin_op_id) return SLEEP_HOURS_NOTE;
      /* D2 ROUND 1, FINDING 5 - NEVER TODAY'S DATE FOR A MISSING ONE. The cited
         check-in's date is shown when this screen can actually see that check-in;
         when it cannot, the sentence drops the date rather than substituting one the
         record does not hold. A guessed date is not provenance. */
      const cited = checkinDateFor(night.from_checkin_op_id);
      return cited ? SLEEP_CONFIRMED_PREFIX + cited + "." : SLEEP_CONFIRMED_PLAIN;
    }
    return SLEEP_FROM_TIMES;
  }
  const checkinDateFor = (opId) => {
    const offer = sleepCheckInOffer();
    return offer && offer.op_id === opId ? offer.date : null;
  };
  /* ONLY the stamp the operation actually carries - and, when this night has more than
     one operation behind it, the brief's own word for what the athlete is looking at. */
  function sleepStamp(record, corrected) {
    if (!record || !record.savedDate || !record.savedTime) return SLEEP_NO_SAVE_TIME;
    return (corrected ? SLEEP_CORRECTED_PREFIX : SLEEP_RECORDED_PREFIX)
      + record.savedDate + " at " + record.savedTime + ".";
  }

  /* The write. Kept as a named async function so a check can await it, and it NEVER
     rejects: a commit and the read-back that follows it are two outcomes. */
  async function recordSleep(map) {
    /* D2 ROUND 1, FINDING 6 - the sentence is STATE, not a node. A save that outlives
       its paint cannot write into the element it started with: `render` replaces the
       whole screen, so every message below is held here and drawn by the next paint. */
    const say = (sentence) => { sleepErrorText = sentence; render("sleep", false); };
    const date = sleepNightDate();
    sleepErrorText = "";
    /* D2 ROUND 1, FINDING 5 - a rollover that has not been answered blocks the write.
       The athlete confirms which night this is for; the page never decides for him. */
    if (sleepRollover && !sleepNightChoice) {
      say(SLEEP_ROLLOVER + " " + SLEEP_NOTHING_RECORDED);
      return;
    }
    const entry = { ...sleepDraft, date };
    const refusal = SleepModel.refusalFor(entry, model.today);
    if (refusal) {
      say((SLEEP_REFUSAL_COPY[refusal] || SLEEP_NOT_SAVED) + " " + SLEEP_NOTHING_RECORDED);
      return;
    }
    const night = SleepModel.nightFromEntry(entry, model.today);
    /* D2 ROUND 1, FINDING 1 - A CORRECTION NAMES WHAT IT CORRECTS. The op this screen
       is looking at travels with the write, and the host refuses if it is no longer the
       current one: a stale editor and a double submit both stop here, with nothing
       written, rather than quietly replacing a night the athlete never saw. */
    const held = sleepOpsFor(date);
    const supersedes = held.length === 0 ? null : held[held.length - 1].op_id;
    /* D2 ROUND 1, FINDING 6 - MOUNT OWNERSHIP. The token this save was begun under; if
       the athlete has navigated by the time it resolves, nothing at all is applied. */
    const token = mountToken;
    sleepBusy = true;
    render("sleep", false);
    let result = null;
    try { result = await sleepLane.save(night, { supersedes }); }
    catch (thrown) {
      /* D2 ROUND 1, FINDING 6 - AN UNCERTAIN OUTCOME IS RECONCILED, NOT GUESSED. The
         command threw without answering, so whether it committed is unknown. The screen
         says it is finding out, then READS the log: if the night is there the write
         landed and is treated as a save; if it is not, the reason is shown and the
         athlete may try again. Nothing is resubmitted before that question is settled,
         so an acknowledged write cannot be duplicated by a second press. */
      if (token !== mountToken) { sleepBusy = false; return; }
      say(SLEEP_UNCERTAIN);
      let landed = null;
      try {
        await sleepLane.refresh();
        const after = sleepOpsFor(night.date);
        const last = after.length ? after[after.length - 1] : null;
        landed = last && last.op_id !== supersedes ? last : null;
      } catch (_) { landed = null; }
      sleepBusy = false;
      if (token !== mountToken) return;
      if (landed) {
        sleepAck = null; sleepReadBack = null; sleepCorrecting = false;
        sleepNightChoice = null; sleepRollover = null;
        clearSleepDraft();
        workoutRebinding = rebindWorkout();
        say("");
        return;
      }
      say(SLEEP_NOT_SAVED + " "
        + FOOD_REASON + ((thrown && (thrown.code || thrown.message)) || "SLEEP_WRITE_UNKNOWN") + ". "
        + SLEEP_NOTHING_RECORDED + " " + SLEEP_KEPT);
      return;
    }
    sleepBusy = false;
    /* THE LATE SAVE NEVER STEALS THE SCREEN. Whatever the outcome, a save whose token
       is stale paints nothing: the athlete is somewhere else and that place is his. */
    if (token !== mountToken) return;
    if (!result || result.ok !== true) {
      const code = result && result.code;
      const sentence = code === "SLEEP_STALE_NIGHT" ? SLEEP_NIGHT_CHANGED
        : (code && code.indexOf("SLEEP_SOURCE_") === 0) ? SLEEP_CHECKIN_CHANGED
          : [SLEEP_NOT_SAVED, reasonOf(result)].filter(Boolean).join(" ");
      say(sentence + " " + SLEEP_NOTHING_RECORDED);
      return;
    }
    /* THE COMMIT IS A FACT. Its figure is held here so a failed read-back cannot make
       a durable night disappear from the screen, and the typed value is KEPT in that
       case so nothing the athlete wrote is lost with it. */
    if (result.readBack === false) {
      sleepAck = { date: night.date, hours: SleepModel.rowFor(night, model.engine).h };
      sleepReadBack = { date: night.date, code: result.readCode || null };
    } else {
      sleepAck = null;
      sleepReadBack = null;
      sleepCorrecting = false;
      sleepNightChoice = null;
      sleepRollover = null;
      clearSleepDraft();
      /* D2 ROUND 1, FINDING 2 - the gym host captured its engine state before this
         night existed. It is rebuilt over the SAME era so the workout the athlete
         opens next is prepared against the record he just made. */
      workoutRebinding = rebindWorkout();
    }
    render("sleep", false);
  }

  /* Today's one line about sleep: the DURABLE record, never a flag this page sets. */
  function sleepState() {
    if (!sleepLane) { openSleepLane(); return ""; }
    const logged = typeof model.loggedSleep === "function" ? model.loggedSleep(sleepNightDate()) : null;
    return logged && Number.isFinite(logged.h) ? logged.h + " h" : "";
  }

  /* D2 correction 1, executed. The check-in the page was given captured the engine
     state ONCE; if a night has been recorded since, the answer it would offer is out
     of date. This builds a FRESH check-in model over the SAME host and the CURRENT
     projected state and mounts the SAME screen. Returns null - and the untouched
     original path runs - whenever there is nothing to rebind, so every existing mount
     in this repository behaves exactly as it did. Nothing durable is written, no
     second store or producer is opened, and neither checkin-model.mjs nor the pinned
     today-entry.mjs is edited. */
  function reboundCheckIn(origin) {
    if (!checkInKit || !checkin || !checkin.host || typeof model.loggedSleep !== "function") return null;
    const captured = checkin.checkin ? checkin.checkin.sleepRecord : null;
    const current = model.loggedSleep(sleepNightDate());
    const same = (!captured && !current)
      || (captured && current && captured.hours === current.h && captured.date === current.d);
    if (same) return null;
    const fresh = checkInKit.createCheckInModel({ host: checkin.host, day: model.today,
      engineState: model.stateFromOps() });
    /* D2 ROUND 1, FINDING 3 - A REBIND IS NOT A RESET. The only thing that changed is
       the night this check-in reads back; every OTHER answer the athlete has already
       typed - his soreness detail, his note, the issues he ticked - is his and is
       carried across to the replacement. Only the sleep confirmation is left behind,
       because that is precisely the answer the new night invalidates. */
    carryCheckInDraft(checkin.checkin, fresh);
    const token = mountToken;
    return Promise.resolve(fresh.refresh()).then(() => {
      /* ... and the mount itself is deferred, so it takes the same ownership guard as
         every other deferred paint on this page: if the athlete has moved on while the
         read was in flight, his destination stands. */
      if (token !== mountToken) return null;
      return checkInKit.mountCheckIn(doc, phone, {
        model: fresh,
        onBack: () => render(origin, true),
        /* Today's own marker still comes from the ENTRY's durable summary. */
        onChanged: () => checkin.refresh(),
      });
    });
  }

  /* The half-answered sheet, moved from one model to the next through the draft's own
     public verbs. Nothing is reached into: `choose`, `toggleIssue` and `set` are the
     same three the screen itself uses, so a carried answer is indistinguishable from
     one the athlete has just given. Sleep hours travel only while the replacement is
     still asking for them. */
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

  /* D2 ROUND 1, FINDING 2 - THE GYM HOST SEES THE NIGHT. `createWorkoutEntry` captures
     `model.stateFromOps()` once and `createGymHost` holds it for the life of the host;
     neither file may be edited (both are pinned on disk), and neither offers a rebind.
     So the page builds a NEW entry through the SAME exported factory, over the SAME
     memoized era for this device - `openTodayHosts` is keyed by (indexedDB, database,
     namespace), so there is no second store, no second lease and no second producer -
     and carries the half-typed set across, exactly as the check-in rebind carries its
     draft. Durable Start/set bytes need no carrying: they are in the log. A device with
     no store rebinds nothing and keeps the entry it has, which is what every jsdom
     mount in this repository does. */
  function rebindWorkout() {
    if (!workout || typeof workout.gymDraft !== "function") return null;
    const view = doc.defaultView || null;
    const idb = (view && view.indexedDB) || (typeof globalThis !== "undefined" ? globalThis.indexedDB : undefined);
    const web = (view && view.crypto) || (typeof globalThis !== "undefined" ? globalThis.crypto : undefined);
    if (!idb || !web || !web.subtle) return null;
    const previous = workout;
    return import("./today-entry.mjs")
      .then((entry) => entry.createWorkoutEntry(model, { indexedDB: idb, crypto: web }))
      .then((next) => {
        const kept = previous.gymDraft();
        if (kept && typeof next.gymDraft === "function") Object.assign(next.gymDraft(), kept);
        /* The same refresh binding today-entry.mjs boot() gives the first entry, so
           Today keeps repainting itself from the durable log after every set. */
        if (typeof next.setOnRefresh === "function") {
          next.setOnRefresh(() => { if (screen === "today") render("today", false); });
        }
        workout = next;
        if (screen === "today") render("today", false);
        return next;
      })
      .catch(() => null);       // a rebind that cannot happen leaves the entry it has
  }

  function renderStub(id, focus, note, extra, noteSlot = "stub-note") {
    const root = template(id);
    const map = slots(root);
    if (map.has("workout-title")) {
      const view = model.read();
      put(map, "workout-title", view.blocked ? NOT_AVAILABLE : view.workout.title);
    }
    put(map, noteSlot, note);
    if (extra && map.has("workout-detail")) put(map, "workout-detail", extra);
    wire(root);
    show(root, focus);
    return root;
  }

  /* A4 — the landing tile. It is shown ONLY while this installation is fresh, so a
     device that has been set up never sees an invitation to be set up again, and a
     device whose store did not open is not invited to enrol into nothing. */
  function setupTile(map) {
    const tile = map.get("setup-entry");
    if (!tile) return null;
    const offer = firstRun();
    tile.hidden = !offer;
    if (offer) put(map, "setup-entry-label", SETUP_ENTRY);
    return offer;
  }

  /* A4 / C1 - the sentence, bound exactly as the tile is. `state` is the engine
     state Today is actually painting from, so the comparison is with what is on
     the screen and not with what the page hoped was on it. */
  function setupNote(map) {
    const note = map.get("setup-note");
    if (!note) return false;
    const summary = (setup && typeof setup.summary === "function" ? setup.summary() : null) || null;
    const label = setup && typeof setup.athleteLabel === "function" ? setup.athleteLabel() : null;
    let state = null;
    try { state = typeof model.stateFromOps === "function" ? model.stateFromOps() : null; }
    catch (_) { state = null; }
    const owed = setupNoteNeeded(!!summary && summary.enrolled === true, label, state);
    /* Through the render boundary like every other slot on this screen (P1,
       DECISIONS:121): fail-closed per slot, never a page that will not open. */
    note.textContent = owed ? plainOrDrop(SETUP_NOT_HIS_NUMBERS, "setup-note") : "";
    note.hidden = !owed;
    return owed;
  }

  /* REPORT A PROBLEM (DECISIONS:140 (3)).

     WHAT THE PAGE CAN HONESTLY OBSERVE. Every member below is read from something
     this view already holds: its own router variable, the three injected lanes, the
     page's own status line, the installation's authority lease, and the platform.
     No store is opened, nothing is read back out of the log, and no operation is
     made - tapping this control leaves the generation exactly as it found it.

     THE DEVICE ID comes from the LEASE the era sealed for this installation, which
     every open lane carries (today-bindings.mjs hands the handle its
     `generation.metadata.authorityLease`). It is there from the first launch, before
     any operation exists, which an op's `device_id` would not be; problem-report.cjs
     truncates it to eight hex and refuses anything that is not hex.

     RESTORE-REQUIRED is read from the page's OWN status line, because that is the
     only place a state-18 refusal reaches this view: boot() writes rebuild/client's
     sentence there and hands mountToday no lanes at all, so a damaged installation
     and a device with no store are otherwise indistinguishable from here. */
  const laneHandles = () => ({ workout: !!workout, checkin: !!checkin, setup: !!setup });
  function installationDevice() {
    const holders = [setup && setup.host, workout && workout.gymHost];
    for (const handle of holders) {
      if (!handle) continue;
      if (handle.lease && typeof handle.lease.device_id === "string") return handle.lease.device_id;
      if (typeof handle.deviceId === "string") return handle.deviceId;
    }
    return null;
  }
  function problemState() {
    const view = doc.defaultView || null;
    return {
      screen,
      lanes: laneHandles(),
      enrolment: ProblemReport.enrolmentOf({
        restoreNote: status ? status.textContent : "",
        setup: setup && typeof setup.summary === "function" ? setup.summary() : null,
      }),
      offlineReady: ProblemReport.offlineReadinessOf(view),
      device: installationDevice(),
      userAgent: view && view.navigator ? view.navigator.userAgent : null,
      at: new Date(),
    };
  }

  /* The control. The clipboard is tried and the box is opened REGARDLESS (brief
     section 3): whether navigator.clipboard.writeText succeeds inside an installed
     iOS Home Screen app is not verifiable from this repository, so nothing here
     depends on the answer. Both paths show the SAME block - the string handed to the
     clipboard is the string put in the box. */
  function problemControl(map) {
    const button = map.get("problem-entry");
    if (!button) return null;
    put(map, "problem-label", PROBLEM_ENTRY);
    const said = map.get("problem-said");
    const box = map.get("problem-box");
    const area = map.get("problem-text");
    said.hidden = true;
    box.hidden = true;
    button.addEventListener("click", async () => {
      const report = ProblemReport.buildProblemReport(problemState());
      area.value = report;
      let copied = false;
      const view = doc.defaultView || null;
      const clipboard = view && view.navigator ? view.navigator.clipboard : null;
      if (clipboard && typeof clipboard.writeText === "function") {
        try { await clipboard.writeText(report); copied = true; } catch (_) { copied = false; }
      }
      box.hidden = false;
      try { area.focus(); area.select(); } catch (_) { /* selection is a convenience */ }
      said.textContent = plainOrDrop(copied ? PROBLEM_COPIED : PROBLEM_SELECT, "problem-said");
      said.hidden = false;
    });
    return button;
  }

  /* A3 — Today's one-line report on the check-in. It reads the DURABLE lane, never a
     flag this page sets, and says nothing at all when nothing is recorded. */
  /* N1 - Today's one word about the nutrition entry. It reads the PROJECTED engine
     state, never a flag this page sets: with no lane it is A1's unwired marker, with a
     lane and nothing recorded it is silent, and with a recorded day it says so. */
  function nutritionState() {
    if (!foodLane) { openFoodLane(); return NOT_WIRED; }
    const logged = typeof model.loggedFood === "function" ? model.loggedFood(model.today) : null;
    return logged && (logged.cal !== null || logged.pro !== null) ? FOOD_SAVED : "";
  }

  function recoveryState() {
    const summary = checkinSummary();
    if (!summary || summary.durable !== true) return CHECKIN_NO_STORE_SHORT;
    return summary.recorded ? CHECKIN_RECORDED_TODAY : "";
  }

  /* The check-in with no durable lane on this device. The approved questions are
     still shown — they are the design — but every control is inert and the screen
     says, in the capture layer's own terms, that nothing here can be recorded. It is
     NOT a "not wired yet" screen: the check-in is wired; this device has no store. */
  function renderCheckInWithoutStore(focus, origin = "today") {
    const root = renderStub("t-recovery", focus, CHECKIN_NO_STORE, null, "fine");
    for (const el of root.querySelectorAll("button.option, input, select, textarea, [data-slot='primary']")) el.disabled = true;
    for (const el of root.querySelectorAll("[data-follow], [data-slot='sleep-known'], [data-slot='recorded']")) el.hidden = true;
    /* Back still returns where the athlete came from, store or no store (review F7). */
    for (const el of root.querySelectorAll('[data-go="today"]')) {
      const back = el.cloneNode(true);
      el.replaceWith(back);
      back.addEventListener("click", (event) => { event.preventDefault(); render(origin, true); });
    }
  }

  function render(next, focus = false) {
    /* A4 — the first-run route. It is REFUSED, not merely hidden, once the record
       says this installation has been set up: an installation that is no longer
       fresh falls straight back to Today, so no URL, no stale link and no second
       tab can reach the setup screens a second time (S13). The same fallback
       covers RESTORE_REQUIRED and a device with no store, because in both cases
       the page was given no setup entry at all (S14). */
    if (next === "setup" && !firstRun()) next = "today";
    /* D2 ROUND 1, FINDING 6 - MOUNT OWNERSHIP, exactly as the gym card's settings lane
       holds it. Leaving a screen INVALIDATES the mount that was on it: any deferred
       work begun there - a save still in flight, a read being retried - finds its token
       stale when it resolves and applies nothing, so the destination the athlete chose
       is never repainted from under him. A repaint of the SAME screen is the same
       mount and keeps the token. */
    if (next !== screen) mountToken += 1;
    screen = next;
    if (next === "setup") {
      return setup.open({ doc, phone,
        back: () => render("today", true),
        done: () => render("today", true) });
    }
    if (next === "today") return renderToday(focus);
    if (next === "why") return renderWhy(focus);
    if (next === "nutrition") return renderNutrition(focus);
    if (next === "sleep") return renderSleep(focus);
    if (next === "recovery") {
      const origin = checkinOrigin === "workout" && workout ? "workout" : "today";
      checkinOrigin = null;
      if (checkin && typeof checkin.open === "function") {
        /* N2 / D2 correction 1 - the SAME-PAGE journey. */
        const rebound = reboundCheckIn(origin);
        if (rebound) return rebound;
        return checkin.open({ doc, phone, back: () => render(origin, true) });
      }
      return renderCheckInWithoutStore(focus, origin);
    }
    if (next === "coach") return renderStub("t-coach", focus,
      "The coach is not wired yet. There is no conversation here, and nothing on this screen comes from your records.");
    if (next === "workout") {
      if (workout && typeof workout.open === "function") {
        /* A3 — the check-in is reachable from the workout flow too, in the approved
           design's own sentence. The gym card is handed the route, not the screen:
           it never learns what a check-in is. */
        return workout.open({ doc, phone, back: () => render("today", true),
          ...(checkin ? { checkIn: () => { checkinOrigin = "workout"; render("recovery", true); } } : {}) });
      }
      /* No encrypted local workout store on this device: say exactly that, show no
         prescription, and record nothing. This is not a "not wired yet" screen — the
         gym card is wired; this device cannot open its store. It is also NOT the
         sentence used for a refusal that came from the accepted layer (review B1):
         an engine refusal is never described as a fault of the device. */
      return renderStub("t-workout", focus, NO_LOCAL_STORE,
        "This browser did not give the page an encrypted local store to keep a workout in.");
    }
    return renderToday(focus);
  }

  phone.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !phone.querySelector('[role="dialog"]') && screen !== "today") render("today", true);
  });

  /* THE SCREEN THIS PAGE LOAD OPENS ON. Today, as it always has, with the
     first-run tile on it while this installation is fresh. `?screen=` names a
     screen for the checks and for the owner's look, and it can only reach a
     screen this page would otherwise offer: the setup route above refuses when
     the installation is not fresh, so ?screen=setup on a set-up device lands on
     Today rather than on a second enrolment.
     A4 does NOT make the setup screens the landing screen. It cannot honestly:
     Today's engine basis on this page is still the synthetic fixture
     (today-model.cjs createBasisState), so a fresh installation that has not run
     setup is exactly the A1 page that already ships, and making setup the landing
     screen would change what every merged suite and check boots into. Wiring the
     first-run op's clean-init state in as Today's basis is a today-model.cjs
     change, which A4 does not own; boot() does it for the enrolled case, which is
     the case the first run creates. Recorded in A4-REPORT.md as a residual. */
  function requestedScreen() {
    const view = doc.defaultView;
    const search = view && view.location && typeof view.location.search === "string" ? view.location.search : "";
    const found = /[?&]screen=([a-z-]+)/.exec(search);
    return found ? found[1] : null;
  }
  render(requestedScreen() || "today");
  return { render, read: () => model.read(), openWeighIn, screen: () => screen,
    foodPending: () => foodSaving, foodReady: () => foodOpening,
    /* N2 - the in-flight sleep write, the lane's own opening, and the check-in
       rebind's module load, so a check and a test can wait for each honestly. */
    sleepPending: () => sleepSaving, sleepReady: () => sleepOpening,
    checkInKitReady: () => checkInKitLoading, sleepLane: () => sleepLane,
    /* D2 round 1 - what the fixed screen now holds, so a cell can assert the
       acknowledgment, the mount that owns the screen and the rebuilt workout entry
       without reaching into the module's closure through the DOM. */
    sleepAck: () => (sleepAck ? { ...sleepAck } : null),
    sleepMount: () => mountToken,
    workoutEntry: () => workout,
    workoutRebound: () => workoutRebinding };
}

/* Mounting is the page entry's job (today-entry.mjs), so this module can be required by
   tests without touching a document. */
module.exports = { mountToday, createTodayModel, calorieHeadline, calorieBand, morningLine, trendLine, dayLabel,
  ARROW, NOT_AVAILABLE, NOT_WIRED, HEADLINE_BASE, HEADLINE_FLOOR, HEADLINE_GUARD,
  WORKOUT_IN_PROGRESS, WORKOUT_RECORDED_TODAY, REVIEW_WORKOUT,
  WORKOUT_CANNOT_OPEN, WHY_WORKOUT_CANNOT_OPEN, NO_LOCAL_STORE,
  UNFINISHED_WORKOUT, CLOSE_UNFINISHED_WORKOUT,
  CHECKIN_RECORDED_TODAY, CHECKIN_NO_STORE_SHORT, CHECKIN_NO_STORE,
  SETUP_ENTRY, SETUP_NOT_HIS_NUMBERS, setupNoteNeeded,
  PROBLEM_ENTRY, PROBLEM_COPIED, PROBLEM_SELECT,
  FOOD_HEAD, FOOD_LEAD, FOOD_CAL_LABEL, FOOD_PRO_LABEL, FOOD_SAVE, FOOD_SAVED,
  FOOD_CORRECTION, FOOD_REFUSED, FOOD_NO_TARGETS, FOOD_NOT_PRESCRIBED, FOOD_REFUSAL_COPY,
  FOOD_REFUSED_ACTION, FOOD_REASON, FOOD_NO_STORE, FOOD_OPENING, FOOD_KEPT_UNREADABLE,
  FOOD_PLAN_UNWIRED, FOOD_SAVED_UNREAD, FOOD_UNKNOWN, FOOD_READ_ACTION, FOOD_READ_RETRY,
  SLEEP_TITLE, SLEEP_NIGHT_PREFIX, SLEEP_NONE, SLEEP_MODE_LABEL, SLEEP_MODE_TIMES,
  SLEEP_MODE_HOURS, SLEEP_BED_LABEL, SLEEP_WAKE_LABEL, SLEEP_AWAKE_TOGGLE, SLEEP_AWAKE_LABEL,
  SLEEP_ESTIMATE_PREFIX, SLEEP_AWAKE_NONE, SLEEP_CLOCK_CHANGE, SLEEP_HOURS_ASK,
  SLEEP_HOURS_LABEL, SLEEP_HOURS_NOTE, SLEEP_FROM_TIMES, SLEEP_CHECKIN_PREFIX,
  SLEEP_CONFIRMED_PREFIX, SLEEP_USE_CHECKIN, SLEEP_SAVE, SLEEP_SAVED, SLEEP_RECORDED_PREFIX,
  SLEEP_NO_SAVE_TIME, SLEEP_NOT_SAVED, SLEEP_READ_FAILED, SLEEP_NO_STORE,
  SLEEP_NOTHING_RECORDED, SLEEP_REFUSAL_COPY,
  SLEEP_DATE_LABEL, SLEEP_SAVING, SLEEP_QUALITY_PREFIX, SLEEP_QUALITY_NONE,
  SLEEP_OPEN_CHECKIN, SLEEP_CHANGE, SLEEP_SAVE_CORRECTION, SLEEP_CANCEL,
  SLEEP_ROLLOVER, SLEEP_KEEP_NIGHT, SLEEP_NIGHT_CHANGED, SLEEP_CHECKIN_CHANGED,
  SLEEP_UNCERTAIN, SLEEP_CONFIRMED_PLAIN, SLEEP_CORRECTED_PREFIX, SLEEP_READ_RETRY,
  SLEEP_KEPT };
