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
/* THE SPLIT (spec B.1 to B.8, DECISIONS:550 S-R1). Every function that can put a row
   of the athlete's food, sleep or check-in log on disk is sealed in today-lanes.cjs;
   what comes back is two frozen objects. The require is at module level, once, and
   not inside the mount. */
const { createTodayLanes } = require("./today-lanes.cjs");

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

/* P0-B r2/r3 (review findings F5, N5) - the status-line sentence a rejected
   setup.athleteState() prints, as a function of the cause, exactly the shape
   today-entry.mjs's own bootFailureCopy already uses for a boot refusal.
   Exported so a copy cell can assert it directly (no U+2013/U+2014, ends in
   punctuation) without needing to force the rejection through a full mount. */
function athleteStateFailureCopy(error) {
  return "Not everything opened: athlete state: "
    + (error && error.message ? error.message : String(error)) + ". Nothing was recorded.";
}

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
const SLEEP_CHECKIN_UNREADABLE = "The check-in could not be read on this device.";
const SLEEP_CHECKIN_TITLE = "Recovery check-in on ";
const SLEEP_CHECKIN_EMPTY = "No check-in was recorded for this date.";
const SLEEP_CHECKIN_HISTORY = "Earlier check-ins are shown as recorded.";
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

/* S6 item 2 (DECISIONS:463 "Related daily-use item", :468 (c)). THE PREVIEW PATH
   SAYS IT IS A PREVIEW. Before the first run this page paints the fixture athlete's
   own figures (today-model.cjs createBasisState over fixtures.cjs) with no mark on
   them, which reads as measured data. P0B.12 covers only the ENROLLED first frame,
   so it never caught this. Setup-first (item 1) takes the preview off the shipped
   page's landing screen, but the preview is still reachable by name (`?screen=today`)
   and is what every declared-day caller sees, so wherever those figures can render
   before enrolment this line sits above the first of them. It is a statement about
   the SCREEN, not a figure, and it carries no dash. */
const SAMPLE_DATA_NOTE = "Sample data. Set up your week to start your own.";

/* S6 item 3 - THE RESUME LABEL (DECISIONS:452, :468 (d)).

   `view.workout` is the engine's NEXT SCHEDULED SESSION and its title carries a
   RELATIVE DAY STAMP ("UPPER BODY · TODAY" / "· TOMORROW" / "· MON 9/21",
   rebuild/engine/today.cjs:591-597), which answers "when is the next session", not
   "what am I logging now". A session is "active" for as long as THIS device holds it
   open, and the page does not always stand on the day the session was opened on: a
   tab carried through local midnight re-boots on the new day (today-entry.mjs
   rollover) still holding it, which is how the CTA came to read "Resume UPPER BODY ·
   TOMORROW" over a workout in hand - cell S6C.6e stands exactly that page. On the
   REFEED day itself nothing is logged at all (gym.read() is `blocked`, gym.start()
   refuses ENGINE_CAPTURE_NO_WORKOUT); what carried the wrong day there was the
   REFUSAL card's heading, cell S6C.6d.

   Where the stamp truly describes today, the engine's own words are kept unchanged;
   where it does not, the button names what the tap opens and claims no day of its
   own. The engine is not touched and no lift name is invented. Exported so a cell
   can assert both branches directly, and S6C.6e pins that renderToday calls it. */
const RESUME_TODAYS_WORKOUT = "Resume today’s workout";
function resumeLabel(workout) {
  return workout && workout.today === true && typeof workout.title === "string" && workout.title
    ? "Resume " + workout.title
    : RESUME_TODAYS_WORKOUT;
}

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
  /* THE SPLIT (spec B.3 and B.4). What crosses is three frozen objects and nothing
     else: `painter`, the paint handle, which is the ONLY thing the seal can reach back
     through and which can do nothing but paint; `facade`, the read-only view of the
     sealed state; and `hooks`, the callback table, which is the only way this file
     changes anything in there. The paint handle's five entries are the five names the
     census found crossing SEALED -> RELEASED that D.1 declares a rewrite for; the
     eighteen names handed in below are the ones it does not, and they are injected so
     that every moved byte keeps its own spelling. `sleepTyped` goes in wrapped because
     it is a const declared further down this file and would be in its temporal dead
     zone here; the wrapper resolves it when it is called, which is after a gesture. */
  const painter = Object.freeze({
    repaint: (name, focus) => render(name, focus),
    screenNow: () => screen,
    token: () => mountToken,
    clearDraft: () => clearSleepDraft(),
    paintTodayEntry: () => paintTodayEntry(),
  });
  const { facade, hooks } = createTodayLanes({ doc, model, options, painter,
    phone, status, tell, athleteStateFailureCopy, reasonOf,
    sleepTyped: (...a) => sleepTyped(...a),
    FOOD_REASON, FOOD_REFUSAL_COPY, FOOD_REFUSED, FOOD_REFUSED_ACTION, SLEEP_CHECKIN_CHANGED, SLEEP_KEPT,
    SLEEP_NIGHT_CHANGED, SLEEP_NOTHING_RECORDED, SLEEP_NOT_SAVED, SLEEP_REFUSAL_COPY, SLEEP_ROLLOVER, SLEEP_UNCERTAIN });
  /* A3 — the check-in entry, injected exactly as the workout entry is, so this
     module keeps no import of the check-in's data layer:
       summary()                  -> { recorded: boolean } read from the durable lane
       open({ phone, doc, back })  -> mounts the check-in into the phone element */
  /* S6 item 1 (owner ruling DECISIONS:463). Whether THIS mount lands on the setup
     screens when the durable record says the installation is fresh. today-entry.mjs
     boot() sets it true for the shipped page (the caller that declares no day) and
     false for every declared-day caller, which is what keeps the pre-setup Today
     preview reachable for the fixtures and checks that were built on it. A caller
     that mounts this module directly and says nothing gets the landing it has always
     had. */

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
  hooks.bootFoodDays();

  /* ---------------- N2, THE SLEEP LANE (DECISIONS:167) ----------------
     Opened here for exactly N1's reason, one seam further on: today-entry.mjs boot()
     AND rebuild/m3/w6/local/today-bindings.mjs are both PINNED ON DISK by the merged
     B-NTC artifact, and their pin-class transition is lane B's round after H3
     (DECISIONS:154 (5)), so neither can gain a sixth lane. N2 opens its own through
     `era.client.hostBindings({workoutCommands})` - the point local-client.mjs:395
     exposes and D2's N2-SOURCE-ERRATUM.md confirms - lazily and FAILING CLOSED, so
     every jsdom mount in this repository is unchanged: jsdom has no indexedDB. */
  /* D2 ROUND 1, FINDING 6 - MOUNT OWNERSHIP, as the gym card's settings learned it.
     Every paint takes the CURRENT token; a save that resolves after the athlete has
     navigated holds a stale one and applies nothing - no render, no navigation. */
  let mountToken = 0;
  /* S4 REAL DAY r3 (review round 2, finding 1) - THIS MOUNT'S OWN LIFE. Set by
     dispose() at the bottom of this function, which today-entry.mjs's midnight
     re-boot calls BEFORE the new mount paints. A disposed mount is inert: its
     #phone listener is off, its screen guard refuses to paint, and every
     deferred paint it still holds finds a stale token. Nothing in this module
     ever sets it on its own, and a caller that declared its day never re-boots,
     so the page that ships and every suite that mounts it are unchanged. */
  let disposed = false;
  /* D2 ROUND 1, FINDING 5 - the night's date is CHOSEN, never guessed. Null means "the
     page's own default, the day before today"; a string is the athlete's own choice and
     survives a rollover. `sleepRollover` holds the date the screen was opened against
     when today moves under an open draft, so the athlete confirms before saving. */
  /* The screen's own transient state. Nothing durable lives here. TIMES first. */
  const sleepDraft = { mode: "times", bed: "", wake: "", awake_min: "", hours: "",
    awakeOpen: false, from_checkin_op_id: "" };
  /* THE SPLIT (spec B.5). The sealed writer reads this object once, in recordSleep;
     it is the SAME object, not a copy, so it sees every keystroke. */
  hooks.bindSleepDraft(sleepDraft);
  const clearSleepDraft = () => {
    sleepDraft.bed = ""; sleepDraft.wake = ""; sleepDraft.awake_min = "";
    sleepDraft.hours = ""; sleepDraft.from_checkin_op_id = ""; sleepDraft.awakeOpen = false;
  };
  hooks.bootSleepNights();




  hooks.bootCheckInKit();



  /* ---------------- P-MEASURE v1 - THE MEASURE ROUTE ----------------
     ROUND 3 (DECISIONS:455): ROUTE, TILE AND WIRING ONLY. Sealed-byte drift on
     this branch is this file and nothing else, so every line the athlete sees -
     the lane, the markers pick, the waist entry, both windows and the export -
     lives in rebuild/m3/w7-preview/measure/, which package S4 does not pin.
     What stays here is what only this file can supply: the route, the tile, and
     the handles this page already holds (the replayed state Today itself stands
     on, its engine, and the setup entry local-source-basis.mjs takes). */

  async function renderMeasure(focus) {
    const root = doc.createElement("section");
    root.id = "measure-screen";
    const token = mountToken;
    show(root, focus);
    const Screen = await import("../measure/measure-screen.mjs");
    if (token !== mountToken) return root;
    hooks.mintMeasureScreen(Screen);
    await facade.measureScreen().paint(root, () => token === mountToken);
    /* P3-IMPORT-UI-2 entry link 1 of 2 (DECISIONS:470, :475 (4)). The measure
       view always renders its own baseline note slot (hidden once a baseline
       exists), so the route that OWNS the Import screen puts its own link on
       that line rather than moving a byte of rebuild/m3/w7-preview/measure/.

       THE LINK WAITS FOR THE ADOPTION, and the real-Edge run is what found
       that it had to: whether a history is admitted is read by the SAME
       asynchronous chain Today adopts through, so on a fresh page load opened
       straight onto Measure the link painted "Import my history" over an
       installation that already had one, and nothing repainted it. Awaiting
       the chain here costs the athlete nothing else - the measure screen above
       has already painted - and it keeps the two words honest on the first
       frame. A rejected chain reports itself on the status line, as it always
       did, and the link falls back to offering the import. */
    try { await facade.ready(); } catch (_) { /* reported by adoptAthleteState's own catch */ }
    if (token !== mountToken) return root;
    /* AND ONLY ON AN ENROLLED INSTALLATION (round 4, DECISIONS:480 RULING 1 as
       amended, and review r3 MAJOR 1). Before the first run is saved this
       installation holds no setup document, so source-admission.mjs programme()
       can only answer LOCAL_SOURCE_PROGRAMME_UNRESOLVED - after the walk has
       taken custody, which costs the athlete a permanent retraction record for
       a route that never could have worked. An entry that can only refuse is
       not an entry, so it is not painted. Both entries ask the same question,
       in the same words, of the same lane. */
    if (!facade.firstRun()) importLink(root, root.querySelector('[data-slot="measure-baseline-note"]'));
    return root;
  }

  /* ---------------- Import (P3-IMPORT-UI-2, DECISIONS:475 (1) and (4)) --------
     THE ONE DYNAMIC IMPORT IN THIS FILE THAT THE PAGE'S INPUT LAW TREATS AS A
     DOOR. build.mjs assertImportRouteIsolation walks today-entry.mjs's graph
     without crossing this edge and refuses if migrate.cjs, merge.cjs or the
     m4/import lane is reachable, so the Today boot path carries none of the
     admission stack until the athlete opens this screen. */

  async function renderImport(focus) {
    const root = doc.createElement("section");
    root.id = "import-screen";
    root.dataset.slot = "import-screen";
    const token = mountToken;
    show(root, focus);
    const Screen = await import("../import/import-screen.mjs");
    if (token !== mountToken) return root;
    hooks.mintImportScreen(Screen);
    /* Round 2, review r1 finding 7. The screen is cached for the page session,
       so "Imported. Today and your gym card now use it." - which belongs to the
       import the athlete just confirmed - would greet him again every time he
       re-entered the route. `focus` is true only when a LINK brought him here
       (a repaint passes false), and on that tap the route hands back the
       read-only summary DECISIONS:470 asks for. */
    if (focus) facade.importScreen().reopen();
    await facade.importScreen().paint(root, () => token === mountToken);
    return root;
  }

  /* The link itself, painted twice: once on Today and once on Measure. It is
     deliberately NOT a lazy load - the two words it shows come from this file,
     so no screen can pull the admission stack onto the boot path just by
     painting one. import-screen.mjs owns the same two words for its own title
     and summary; P3-U1 and P3-U5 assert the painted text against Screen.COPY,
     which is what keeps the two copies honest (review r1 finding 5). */
  const IMPORT_LINK_NEW = "Import my history";
  const IMPORT_LINK_DONE = "History imported";
  function importLink(root, after) {
    if (!root) return null;
    const link = doc.createElement("button");
    link.type = "button";
    link.className = "option";
    link.dataset.slot = "import-entry";
    link.textContent = plainOrDrop(facade.importAdmitted() ? IMPORT_LINK_DONE : IMPORT_LINK_NEW, "import-entry");
    link.addEventListener("click", () => render("import", true));
    /* The "No baseline yet" line, when the measure screen has painted one - the
       athlete is reading the sentence that says his history is missing, and the
       way to fix it belongs on that line. The measure screen has three earlier
       states (no store, opening, and the markers pick) with no such line at
       all, and on those the link goes at the end of the screen rather than
       being silently dropped. */
    if (after && after.parentNode) after.parentNode.insertBefore(link, after.nextSibling);
    else root.append(link);
    return link;
  }

  /* TODAY'S ENTRY, PAINTED ON A SETTLED FRAME (round 4: review r2 MINOR 4, and
     the gate review r3 MAJOR 1 asks for).

     WHICH two words this link carries is decided by importAdmitted, and that
     flag is set by the ASYNCHRONOUS adoption chain. renderMeasure awaits that
     chain inline because it is async; renderToday is synchronous - every screen
     this page shows off it, and every cell that reads it, depends on that - so
     it cannot await anything. The old code painted the link anyway, and on a
     reopen of a device that HAD imported, Today's first frame said "Import my
     history" until the workout cascade happened to repaint it.

     So the frame carries NO entry until the chain has answered, and the answer
     paints it onto the Today frame that is still mounted. No frame ever carries
     the wrong two words, and no reader has to await something renderToday does
     not return. A chain that rejects still settles: adoptAthleteState reports
     its own cause on the status line and the link then offers the import, which
     is what it offered before this ticket existed. */
  let todayEntry = null;         // { root, token } the settle should paint into
  function paintTodayEntry() {
    if (!facade.adoptionSettled() || !todayEntry) return null;
    if (todayEntry.token !== mountToken || screen !== "today") return null;
    if (todayEntry.root.querySelector('[data-slot="import-entry"]')) return null;
    return importLink(todayEntry.root, null);
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
    const token = mountToken;
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
    /* Before a weigh-in the sentence under the instruction is the engine's whole marching
       order (S2: the cue, the action and the reason, composed in today-model.cjs); after
       it, the engine's reading of where the plan stands. Both are the engine's own
       strings. */
    put(map, "instruction-why", owed
      ? (view.orderSentence || view.statusFace.cause)
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
    const today = facade.session();
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
    sampleNote(map, root);
    problemControl(map);
    put(map, "morning", morningLine(view));
    put(map, "trend", trendLine(view));

    const primary = map.get("primary");
    /* The resume action the approved direction requires: while a workout is in
       progress the single primary action resumes it, in the approved design's own
       word. A recorded workout is reviewable, not restartable. */
    const resuming = !!(today && today.phase === "active");
    const action = resuming ? resumeLabel(view.workout)
      : stranded ? CLOSE_UNFINISHED_WORKOUT
      /* P0-C item (b) - the primary label must name the sheet the click below
         actually opens. Before a weigh-in this click ALWAYS opens WEIGHT
         ("close the books first" - the weigh-in comes before everything else
         by design; sleep keeps its own row). The engine's marchingOrder is a
         general "what's owed" hint and its head is not always the weigh-in
         (kind "weight") - on a clean-init athlete it read kind "night"
         ("log last night"), a real sentence, but for a sheet this click does
         not open. `kind` (rebuild/engine/today.cjs marchingOrder, o0.k) names
         which owed item thenText describes; only echo the engine's own words
         when they truly describe THIS click, and say what it opens otherwise. */
      : owed ? (view.marchingOrder.kind === "weight" && view.marchingOrder.thenText
        ? capitalise(view.marchingOrder.thenText)
        : "Log this morning's weight")
      : today && today.phase === "finished" ? REVIEW_WORKOUT
      : refused ? WHY_WORKOUT_CANNOT_OPEN
      : "Start " + view.workout.title;
    put(map, "primary-label", action);
    primary.addEventListener("click", async () => {
      if (stranded) {
        /* One durable write, through the same client as everything else, and the
           screen repaints from what the layer answers — never from optimism. */
        primary.disabled = true;
        try { await facade.workout().recover(); } finally { primary.disabled = false; }
        render("today", false);
        return;
      }
      return owed && !resuming ? openWeighIn() : render("workout", true);
    });
    if (!owed && view.workout.exerciseCount === null) primary.disabled = true;

    /* P-MEASURE (round 2, closing finding 2 - "nothing renders"): the ONE way
       Today reaches the comparison view. No approved tile exists for this
       screen yet, so it is a plain button, built and wired the same way
       wire(root)'s own [data-go] loop wires every other route off this page. */
    const measureTile = doc.createElement("button");
    measureTile.type = "button";
    measureTile.dataset.slot = "measure-tile";
    measureTile.dataset.go = "measure";
    measureTile.textContent = "Measure";
    root.append(measureTile);

    /* P3-IMPORT-UI-2 - THE ENTRY, ON THE SCREEN SETUP ENDS ON. DECISIONS:480
       RULING 1 as the PM amended it in round 4: the Import entry lives on the
       Measure screen's "No baseline yet" line and here on Today, BOTH gated on
       an ENROLLED installation, and there is no entry at setup's end.

       ROUND 4, REVIEW R3 MAJOR 1, SAID WHERE THE OLD RULE STOOD: round 2 painted
       this link unconditionally, and on an installation whose first run is not
       yet saved the whole walk from it can only take custody and then refuse
       LOCAL_SOURCE_PROGRAMME_UNRESOLVED, leaving a permanent "Files you took
       back" entry. That is the trap round 2 removed from setup's last screen,
       re-created on the screen setup's Back lands on. So the gate: no first run
       saved, no entry. P3-U5 executes both sides of it on the unenrolled Today
       frame, and P3-U6 walks it from here on an enrolled one.

       WHEN it is painted is paintTodayEntry's business: the two words depend on
       the adoption chain, so the link goes on once that chain has answered and
       never before (review r2 MINOR 4). Nothing here is lazy-loaded, so painting
       it pulls no admission stack onto the boot path. */
    todayEntry = facade.firstRun() ? null : { root, token };
    paintTodayEntry();

    /* S6 MERGE NOTE: the Import entry above and the build footer below both append
       to this root. The footer's own contract is that it is the LAST thing on the
       screen, below every control, so the entry - which IS a control - is appended
       first and the footer keeps its stated place. Neither hunk is dropped. */
    /* S6 item 4 - THE BUILD FOOTER (DECISIONS:468 (b)). The served page names the
       commit it was built from, in visible text, so a verifier can tie what is on
       the phone to a tip without going through GitHub Actions and the service
       worker's cache name. It is built here, not added to the approved template,
       for the Measure tile's reason directly above; it is the LAST thing on the
       screen, below every control, because it is for the person checking the
       build and not for the athlete. The value is problem-report.cjs's own
       build-time literal, and unbuilt it reads "Build unknown" rather than
       leaking a placeholder. */
    const buildFooter = doc.createElement("p");
    buildFooter.dataset.slot = "build-id";
    buildFooter.textContent = plainOrDrop(ProblemReport.buildFooterLine(ProblemReport.COMMIT), "build-id");
    root.append(buildFooter);

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
    if (!facade.foodLane()) {
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
      const opening = hooks.openFoodLane();
      const why = opening && !facade.foodLaneFailure() ? FOOD_OPENING
        : facade.foodLaneFailure() ? FOOD_NO_STORE + " " + FOOD_REASON + facade.foodLaneFailure() + "."
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
    const opened = facade.foodLane() && facade.foodLane().host ? facade.foodLane().host.openedRefusal : null;
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
    if (facade.foodReadBack() && facade.foodReadBack().entry) {
      cal.value = facade.foodReadBack().entry.cal === undefined ? "" : String(facade.foodReadBack().entry.cal);
      pro.value = facade.foodReadBack().entry.pro === undefined ? "" : String(facade.foodReadBack().entry.pro);
    }
    if (facade.foodReadBack() && facade.foodReadBack().state === "unavailable") {
      recorded.textContent = plainOrDrop(
        FOOD_SAVED + " · " + intakeLine(facade.foodReadBack().day) + " " + FOOD_SAVED_UNREAD, "food-recorded");
      recorded.hidden = false;
    }
    if (facade.foodReadBack()) {
      const said = facade.foodReadBack().code ? FOOD_REASON + facade.foodReadBack().code + "." : "";
      const head = facade.foodReadBack().state === "unknown" ? FOOD_UNKNOWN : FOOD_SAVED_UNREAD;
      error.textContent = plainOrDrop([head, said, FOOD_READ_ACTION].filter(Boolean).join(" "), "food-error");
    }
    if (retry) {
      retry.hidden = !facade.foodReadBack();
      retry.textContent = facade.foodReadBack() ? plainOrDrop(FOOD_READ_RETRY, "food-retry") : "";
      if (facade.foodReadBack()) retry.addEventListener("click", () => { hooks.retryFoodRead(); });
    }
    const save = map.get("food-save");
    save.addEventListener("click", () => { hooks.recordIntake(save, cal, pro, error); });
    return section;
  }
  /* The write itself, kept as a named async function so the click handler can hand the
     in-flight promise to `foodPending()`: a durable write is several turns of the
     event loop and a check that polls the log needs to know when it has settled. */

  /* D2 round 2, R2-1 - THE READ, ON ITS OWN. It submits no intake: it asks the lane to
     read the durable log again and, when that answers, the screen goes back to saying
     what the record says. A read that fails again updates only the reason. */
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
  /* Is anything typed? A rollover may only disturb a draft that exists. */
  const sleepTyped = () => !!(sleepDraft.bed || sleepDraft.wake || sleepDraft.hours
    || sleepDraft.awake_min);
  /* MIDNIGHT UNDER AN OPEN DRAFT. While nothing is typed and nothing is chosen, the
     screen simply follows the clock. Once there is a draft, the night it was begun
     against is PINNED (sleepRollover) and the athlete confirms it before saving; the
     date never moves under him, and the page never silently moves it for him. */
  /* The check-in for the morning AFTER a night, which is where its quality already
     lives. A3 asked the question once; this lane never asks it again. */
  function sleepQualityFor(date) {
    const row = sleepCheckInFor(date);
    if (!row || !row.answers || row.date !== SleepModel.dayAfter(date)) return null;
    const choice = row.answers.sleep_quality;
    return typeof choice === "string" && choice ? { choice, date: row.date } : null;
  }
  function sleepCheckInFor(date) {
    const day = SleepModel.dayAfter(date);
    if (facade.sleepCheckInDay() === day && (facade.sleepCheckInPending() || facade.sleepCheckInFailed())) return null;
    if (facade.sleepCheckInDay() === day) return facade.sleepCheckInRow();
    const active = facade.checkInLive() || (facade.checkin() && facade.checkin().checkin);
    const row = active && typeof active.recorded === "function" ? active.recorded() : null;
    return row && row.date === day ? row : null;
  }
  function renderSleepCheckIn(focus) {
    const date = facade.sleepNightDate(), day = SleepModel.dayAfter(date), token = mountToken;
    const root = template("t-sleep-checkin"), map = slots(root);
    put(map, "sleep-back-label", SLEEP_TITLE);
    put(map, "sleep-checkin-title", SLEEP_CHECKIN_TITLE + day);
    put(map, "sleep-checkin-history", SLEEP_CHECKIN_HISTORY);
    wire(root); show(root, focus);
    hooks.readSleepCheckInView(date, () => {
      if (token !== mountToken || screen !== "sleep-checkin") return;
      const row = sleepCheckInFor(date), body = map.get("sleep-checkin-record");
      const lines = facade.sleepCheckInFailed() || !facade.checkInKit() ? [SLEEP_CHECKIN_UNREADABLE]
        : row ? [SLEEP_CHECKIN_PREFIX + row.date + ".", ...facade.checkInKit().recordedLines(row)] : [SLEEP_CHECKIN_EMPTY];
      for (const line of lines) {
        const text = doc.createElement("p");
        text.className = "fine"; text.textContent = plainOrDrop(line, "sleep-checkin-record"); body.append(text);
      }
    });
    return facade.sleepCheckInViewPending();
  }
  /* Every operation this device holds for one night, in the log's own order. Two of
     them mean the record has been CORRECTED, which the screen says in the brief's
     own word rather than presenting a correction as a first entry. */

  /* The check-in's own answer for the morning AFTER this night, offered as a dated
     SUGGESTION and never promoted silently. Read out of the check-in lane the page was
     given; with no lane there is nothing to offer and the screen says nothing. */
  /* D2 ROUND 2, FINDING 4 - READ THE SHAPE A3 REALLY STORES. `checkin-commands.cjs`
     turns every quantity into `{value, unit}` (its QUANTITIES table), so a real
     recorded check-in holds `sleep_hours: {value: 7, unit: "h"}` and never a bare
     number. Requiring a number meant the reuse control was hidden for every check-in
     the athlete had actually answered - the one case it exists for. Both shapes are
     read now, and the offer is restricted to the check-in for the morning AFTER this
     night and to an answer the athlete ENTERED: a confirmation of an existing record
     is not a duration to reuse, and the host would refuse it as a source anyway. */
  function checkInHoursOf(answers) {
    const held = answers && answers.sleep_hours;
    if (typeof held === "number") return Number.isFinite(held) ? held : null;
    if (held && typeof held === "object" && typeof held.value === "number"
      && Number.isFinite(held.value)) return held.value;
    return null;
  }
  function sleepCheckInOffer(date) {
    const row = sleepCheckInFor(date || facade.sleepNightDate());
    if (!row || !row.answers) return null;
    const night = date || facade.sleepNightDate();
    if (night && row.date && row.date !== SleepModel.dayAfter(night)) return null;
    const hours = checkInHoursOf(row.answers);
    if (hours === null) return null;
    const source = row.answers.sleep_hours_source;
    if (source !== undefined && source !== "entered") return null;
    return { date: row.date, hours, op_id: row.op_id || null };
  }

  function renderSleep(focus) {
    const root = template("t-sleep");
    const map = slots(root);
    const date = facade.sleepNightDate();
    hooks.readSleepCheckIn(date);
    put(map, "sleep-title", SLEEP_TITLE);
    put(map, "sleep-night", SLEEP_NIGHT_PREFIX + (date || ""));
    const opening = facade.sleepLane() ? null : hooks.openSleepLane();
    if (!facade.sleepLane()) {
      /* WHAT CANNOT HAPPEN, WHY, AND WHAT TO DO - N1's D2 round-1 lesson, applied
         here from the first line rather than after a review. */
      put(map, "sleep-note", facade.sleepLaneFailure()
        ? SLEEP_NO_STORE + " " + FOOD_REASON + facade.sleepLaneFailure() + "."
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
    const ack = facade.sleepAck() && facade.sleepAck().date === date ? facade.sleepAck() : null;
    /* D2 ROUND 2, FINDING 5 - THE ACKNOWLEDGMENT OUTRANKS THE STALE CACHE. When a
       correction commits and only the read-back fails, the projected row still holds
       the OLD night: showing it would tell the athlete his correction did not happen
       when the log says it did. What the client acknowledged is the newer fact, so it
       is what the screen shows; the projected row speaks again as soon as a read
       succeeds and the acknowledgment is released. */
    const known = ack ? { h: ack.hours, d: ack.date } : logged;
    put(map, "sleep-note", known ? "" : SLEEP_NONE);
    map.get("sleep-note").hidden = !!known;

    /* D2 ROUND 1, FINDING 5 - THE NIGHT'S OWN DATE, chosen rather than assumed. The
       default is yesterday; any completed night may be selected, and the label above
       always names the night the write will carry. */
    put(map, "sleep-date-label", SLEEP_DATE_LABEL);
    const dateBox = map.get("sleep-date");
    if (dateBox) {
      dateBox.value = date || "";
      dateBox.disabled = facade.sleepBusy() || !!facade.sleepUnknown() || !!facade.sleepReadBack();
      const latest = SleepModel.nightDateFor(hooks.sleepToday());
      if (latest) dateBox.max = latest;
      dateBox.addEventListener("change", () => {
        hooks.sleepNightChosen(dateBox.value || null);
        render("sleep", false);
      });
    }
    /* The rollover confirmation. Shown only when the clock has crossed midnight under
       an open draft; until it is answered the save refuses, so a night cannot be
       recorded against a date the athlete never saw. */
    const rolled = hooks.sleepClockCheck();
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
        hooks.keepNight();
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
    times.disabled = hoursMode.disabled = facade.sleepBusy() || !!facade.sleepUnknown() || !!facade.sleepReadBack();
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
    for (const box of [bed, wake, awake, hoursBox]) box.disabled = facade.sleepBusy() || !!facade.sleepUnknown() || !!facade.sleepReadBack();
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
    const offer = sleepCheckInOffer(date);
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
      qualityLine.textContent = facade.sleepCheckInPending() ? "" : plainOrDrop(facade.sleepCheckInFailed()
        ? SLEEP_CHECKIN_UNREADABLE : quality ? SLEEP_QUALITY_PREFIX + quality.choice : SLEEP_QUALITY_NONE, "sleep-quality");
    }
    const qualitySource = map.get("sleep-quality-source");
    if (qualitySource) {
      qualitySource.hidden = !quality;
      qualitySource.textContent = quality ? plainOrDrop(SLEEP_CHECKIN_PREFIX + quality.date + ".", "sleep-quality-source") : "";
    }
    if (openCheckIn) {
      openCheckIn.hidden = !!quality || !!facade.sleepCheckInPending();
      openCheckIn.textContent = openCheckIn.hidden ? "" : plainOrDrop(SLEEP_OPEN_CHECKIN, "sleep-open-checkin");
      openCheckIn.addEventListener("click", () => {
        if (SleepModel.dayAfter(date) === model.today) {
          checkinOrigin = "sleep"; render("recovery", true);
        } else render("sleep-checkin", true);
      });
    }

    const error = map.get("sleep-error");
    error.textContent = facade.sleepErrorText()
      ? plainOrDrop(facade.sleepErrorText(), "sleep-error")
      : (facade.sleepReadBack() ? plainOrDrop(SLEEP_READ_FAILED + " " + SLEEP_KEPT, "sleep-error") : "");
    /* D2 ROUND 1, FINDING 6 - the read that failed is OFFERED AGAIN rather than left
       for the athlete to discover by reopening the page. */
    const retry = map.get("sleep-read-retry");
    const owed = !!facade.sleepReadBack() || !!facade.sleepUnknown() || facade.sleepCheckInFailed();
    if (retry) {
      retry.hidden = !owed;
      retry.textContent = owed ? plainOrDrop(SLEEP_READ_RETRY, "sleep-read-retry") : "";
      retry.addEventListener("click", () => { hooks.retrySleepRead(); });
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
    const corrected = hooks.sleepOpsFor(date).length > 1;
    /* While an acknowledgment is standing, the projected OPERATION is the one it
       replaced: its shape and its stamp describe a night that is no longer the
       record, so neither is claimed. The figure is the acknowledged one and the save
       time is honestly unknown until a read succeeds. */
    const shown = ack ? null : record;
    recorded.textContent = known
      ? plainOrDrop([known.h + " h", sleepSourceLine(shown),
        shown ? sleepStamp(shown, corrected) : (ack ? SLEEP_NO_SAVE_TIME : "")]
        .filter(Boolean).join(" "), "sleep-recorded")
      : "";

    /* D2 ROUND 1, FINDING 5 - THE CORRECTION FLOW. A recorded night owns the display:
       the form is put away until the athlete deliberately asks to change it, and the
       saved value stays visible the whole time, exactly as the brief requires. */
    const change = map.get("sleep-change");
    const cancel = map.get("sleep-cancel");
    const editing = !known || facade.sleepCorrecting();
    if (map.get("sleep-modes")) map.get("sleep-modes").hidden = !editing;
    timesBlock.hidden = !editing || sleepDraft.mode !== "times";
    hoursBlock.hidden = !editing || sleepDraft.mode !== "hours";
    if (map.get("sleep-date-field")) map.get("sleep-date-field").hidden = false;
    if (change) {
      change.hidden = !known || facade.sleepCorrecting();
      change.textContent = change.hidden ? "" : plainOrDrop(SLEEP_CHANGE, "sleep-change");
      change.addEventListener("click", () => { hooks.sleepCorrect(true); render("sleep", false); });
    }
    if (cancel) {
      cancel.disabled = facade.sleepBusy() || !!facade.sleepUnknown() || !!facade.sleepReadBack();
      cancel.hidden = !facade.sleepCorrecting();
      cancel.textContent = facade.sleepCorrecting() ? plainOrDrop(SLEEP_CANCEL, "sleep-cancel") : "";
      cancel.addEventListener("click", () => {
        hooks.sleepCorrect(false); clearSleepDraft(); render("sleep", false);
      });
    }
    const save = map.get("sleep-save");
    save.hidden = !editing;
    put(map, "sleep-save-label", facade.sleepBusy() ? SLEEP_SAVING
      : (known ? SLEEP_SAVE_CORRECTION : SLEEP_SAVE));
    /* D2 ROUND 2, FINDING 5 - THE FENCE. While the outcome of a write is unknown a
       second press could duplicate a night that did land, so saving waits until the
       read settles the question. The read is the way forward, and it is on screen. */
    save.disabled = facade.sleepBusy() || !!facade.sleepUnknown() || !!facade.sleepReadBack();
    save.addEventListener("click", () => { hooks.recordSleep(map); });
    return section;
  }

  /* D2 ROUND 1, FINDING 6 - the read that failed, asked again. The op is already
     durable; this only tries to see it. Nothing is written and nothing navigates. */

  /* The hours a pair of clock times comes to, asked of the ENGINE and never computed
     here. Shown only when the pair is recordable, so the clamp can never be displayed
     as a figure the athlete did not mean. */
  function sleepEstimate(map) {
    const line = map.get("sleep-estimate");
    if (!line) return;
    const entry = { ...sleepDraft, mode: "times", date: facade.sleepNightDate() };
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

  /* Two nights are the same fact when they carry the same members with the same
     values. Used to recognise a write in the log after an uncertain outcome, so
     "something new is there" is never mistaken for "mine is there". */
  /* Today's one line about sleep: the DURABLE record, never a flag this page sets. */
  function sleepState() {
    if (!facade.sleepLane()) { hooks.openSleepLane(); return ""; }
    const logged = typeof model.loggedSleep === "function" ? model.loggedSleep(SleepModel.nightDateFor(model.today)) : null;
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

  /* The half-answered sheet, moved from one model to the next through the draft's own
     public verbs. Nothing is reached into: `choose`, `toggleIssue` and `set` are the
     same three the screen itself uses, so a carried answer is indistinguishable from
     one the athlete has just given. Sleep hours travel only while the replacement is
     still asking for them. */

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
    const offer = facade.firstRun();
    tile.hidden = !offer;
    if (offer) put(map, "setup-entry-label", SETUP_ENTRY);
    return offer;
  }

  /* S6 item 2 - THE SAMPLE MARK, bound to the SAME durable answer the tile is bound
     to. It is shown exactly while firstRun() is true: the record says this
     installation has never been set up, so every figure on the frame is the
     fixture's. On an ENROLLED frame firstRun() is false and the line is not built at
     all - which is the assertion the cell makes in both directions. With no setup
     entry (a device whose store did not open, a RESTORE_REQUIRED device, a caller
     that mounts this module with no lane) the page cannot know, and it does not
     guess: nothing is claimed either way, exactly as setupTile already behaves.

     WHERE IT SITS. renderToday builds a fresh root from the approved template on
     every paint, so this inserts rather than toggles, and it inserts BEFORE the
     root-level block that carries the first figure (the calorie headline), which is
     what "above the first figure" means on this screen. The template is untouched:
     the element is built here, the same way the Measure tile below already is. */
  function sampleNote(map, root) {
    if (!facade.firstRun()) return false;
    const line = doc.createElement("p");
    line.dataset.slot = "sample-note";
    line.textContent = plainOrDrop(SAMPLE_DATA_NOTE, "sample-note");
    let anchor = map.get("kcal") || null;
    while (anchor && anchor.parentNode !== root) anchor = anchor.parentNode;
    if (anchor) root.insertBefore(line, anchor); else root.prepend(line);
    return true;
  }

  /* A4 / C1 - the sentence, bound exactly as the tile is. `state` is the engine
     state Today is actually painting from, so the comparison is with what is on
     the screen and not with what the page hoped was on it. */
  function setupNote(map) {
    const note = map.get("setup-note");
    if (!note) return false;
    const summary = (facade.setup() && typeof facade.setup().summary === "function" ? facade.setup().summary() : null) || null;
    const label = facade.setup() && typeof facade.setup().athleteLabel === "function" ? facade.setup().athleteLabel() : null;
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
  const laneHandles = () => ({ workout: !!facade.workout(), checkin: !!facade.checkin(), setup: !!facade.setup() });
  function installationDevice() {
    const holders = [facade.setup() && facade.setup().host, facade.workout() && facade.workout().gymHost];
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
        setup: facade.setup() && typeof facade.setup().summary === "function" ? facade.setup().summary() : null,
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
    if (!facade.foodLane()) { hooks.openFoodLane(); return NOT_WIRED; }
    const logged = typeof model.loggedFood === "function" ? model.loggedFood(model.today) : null;
    return logged && (logged.cal !== null || logged.pro !== null) ? FOOD_SAVED : "";
  }

  function recoveryState() {
    const summary = facade.checkinSummary();
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
    /* S4 REAL DAY r3 (review round 2, finding 1) - A DISPOSED MOUNT PAINTS
       NOTHING. #phone is the ONE node every mount of this page shares, so the
       keydown bound to it below outlived its own mount, and after the midnight
       re-boot its closure still held the PREVIOUS day's screen, model and
       hosts. dispose() takes the listener off; this is the same guard said
       again for everything the old mount had already handed out - a lane that
       opens late, a rebind that settles, a refresh callback boot() wired - so
       none of it can put yesterday's Today back over the new page. */
    if (disposed) return null;
    /* A4 — the first-run route. It is REFUSED, not merely hidden, once the record
       says this installation has been set up: an installation that is no longer
       fresh falls straight back to Today, so no URL, no stale link and no second
       tab can reach the setup screens a second time (S13). The same fallback
       covers RESTORE_REQUIRED and a device with no store, because in both cases
       the page was given no setup entry at all (S14). */
    if (next === "setup" && !facade.firstRun()) next = "today";
    /* D2 ROUND 1, FINDING 6 - MOUNT OWNERSHIP, exactly as the gym card's settings lane
       holds it. Leaving a screen INVALIDATES the mount that was on it: any deferred
       work begun there - a save still in flight, a read being retried - finds its token
       stale when it resolves and applies nothing, so the destination the athlete chose
       is never repainted from under him. A repaint of the SAME screen is the same
       mount and keeps the token. */
    if (next !== screen) {
      mountToken += 1;
      if (next === "sleep") hooks.forgetCheckInRead();
    }
    screen = next;
    if (next === "setup") {
      return facade.setup().open({ doc, phone,
        back: () => render("today", true),
        /* P3-IMPORT-UI-2 round 2, review r1 finding 1. THE SETUP SCREENS CARRY
           NO IMPORT LINK, and the reason is written here rather than left as a
           deletion: on setup's LAST screen the installation has not yet written
           its first-run operation, so source-admission.mjs programme() finds no
           setup document and the whole walk refuses
           LOCAL_SOURCE_PROGRAMME_UNRESOLVED - executed, both sides, by P3-U5.
           "From setup's end" (DECISIONS:470) is therefore served on the screen
           setup ENDS on, which is Today: renderToday() below offers the link
           the moment the first run is saved. setup-app.mjs is byte-identical to
           the shipped file again. */
        /* P0-C item (a) - the in-page transition off "Start using Earned" must
           adopt his own state the same way a fresh enrolled mount does: arm
           the same gates BEFORE this first Today paint, then run the same
           adoption chain (canAdoptAthleteState/armAdoptionGate/
           adoptAthleteState below). Returning the chain lets today-entry.mjs's
           own `await done()` (pinned, unedited) wait for it; reassigning
           `ready` lets a caller await api.ready and see exactly this settle,
           with no reload. */
        done: () => {
          const adopting = hooks.canAdoptAthleteState();
          if (adopting) hooks.armAdoptionGate();
          /* ROUND 4: the chain is armed BEFORE this first Today paint, exactly
             as boot() below arms it before ITS first paint. It was started one
             statement later until now, which was invisible while nothing on the
             Today frame depended on the chain's answer, and is not invisible
             now that the Import entry does: painting first would have put the
             link on this frame with the PREVIOUS chain's answer behind it. The
             gates are still armed before the paint, and the chain still does
             its own first work asynchronously, so the athlete sees the same
             Today he saw before. */
          hooks.settleAdoption(adopting);
          render("today", true);
          return facade.ready();
        } });
    }
    if (next === "today") return renderToday(focus);
    if (next === "why") return renderWhy(focus);
    if (next === "nutrition") return renderNutrition(focus);
    if (next === "sleep") return renderSleep(focus);
    if (next === "sleep-checkin") return renderSleepCheckIn(focus);
    if (next === "recovery") {
      const origin = checkinOrigin === "workout" && facade.workout() ? "workout"
        : checkinOrigin === "sleep" ? "sleep" : "today";
      checkinOrigin = null;
      if (facade.checkin() && typeof facade.checkin().open === "function") {
        /* N2 / D2 correction 1 - the SAME-PAGE journey. */
        const rebound = hooks.reboundCheckIn(origin);
        if (rebound) return rebound;
        return facade.checkin().open({ doc, phone, back: () => render(origin, true) });
      }
      return renderCheckInWithoutStore(focus, origin);
    }
    if (next === "measure") return renderMeasure(focus);
    if (next === "import") return renderImport(focus);
    if (next === "coach") return renderStub("t-coach", focus,
      "The coach is not wired yet. There is no conversation here, and nothing on this screen comes from your records.");
    if (next === "workout") {
      if (facade.workout() && typeof facade.workout().open === "function") {
        /* A3 — the check-in is reachable from the workout flow too, in the approved
           design's own sentence. The gym card is handed the route, not the screen:
           it never learns what a check-in is. */
        return facade.workout().open({ doc, phone, back: () => render("today", true),
          ...(facade.checkin() ? { checkIn: () => { checkinOrigin = "workout"; render("recovery", true); } } : {}) });
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

  /* S4 REAL DAY r3 (review round 2, finding 1) - NAMED, SO IT CAN BE TAKEN OFF.
     This listener is bound to the #phone ELEMENT, and render() only does
     phone.replaceChildren(root), so the element - and this listener with it -
     survives every re-mount of the page over it. Measured on the shipped path:
     with the tab off Today at local midnight, one Escape ran the PREVIOUS
     mount's render, with the previous day's model and hosts, over the page the
     rollover had just booted, and one tap of the primary button on that
     repainted screen wrote a weigh-in stamped with YESTERDAY's local_date.
     dispose() below removes it. */
  const onPhoneKeydown = (event) => {
    if (event.key === "Escape" && !phone.querySelector('[role="dialog"]') && screen !== "today") render("today", true);
  };
  phone.addEventListener("keydown", onPhoneKeydown);

  /* THE SCREEN THIS PAGE LOAD OPENS ON. Today, as it always has, with the
     first-run tile on it while this installation is fresh. `?screen=` names a
     screen for the checks and for the owner's look, and it can only reach a
     screen this page would otherwise offer: the setup route above refuses when
     the installation is not fresh, so ?screen=setup on a set-up device lands on
     Today rather than on a second enrolment.
     A4's RESIDUAL IS CLOSED (review R1 minor 7). A4 recorded that it could not
     make setup the landing screen, because Today's engine basis on this page is
     still the synthetic fixture (today-model.cjs createBasisState) and moving the
     landing would change what every merged suite and check boots into. S6 item 1
     (owner ruling DECISIONS:463) moves it for the LIVE page only: `setupFirst` is
     off unless boot() turns it on, and boot() turns it on for exactly the caller
     that declares no day - the shipped page. Nearly every fixture, suite and check
     declares its day, keeps the pre-setup Today preview, and boots into what it
     always did; the live-clock cells that declare none say which landing they mean
     (`setupFirst`), as local-real-day.test.mjs S4/8 now does. See the landing-screen
     note at render() below. */
  function requestedScreen() {
    const view = doc.defaultView;
    const search = view && view.location && typeof view.location.search === "string" ? view.location.search : "";
    const found = /[?&]screen=([a-z-]+)/.exec(search);
    return found ? found[1] : null;
  }
  /* P0-B r2 (review findings 2, 3) - BEFORE the synchronous first paint, on an
     ENROLLED installation only: hold Today's fixture-derived figures off this
     frame (today-model.cjs setPendingAdoption - adoptBasis below clears it the
     moment his own state actually lands, and it touches no basis, so S19 stays
     exactly as it was) and hold the gym card's Start off until the SAME
     adoption has settled (gym-model.mjs holdForAdoption), so a tap that wins
     the race against setup.athleteState() can never commit a fixture exercise
     id into his real store. `willAdopt` gates both the holds and the block
     below that must release them, so neither is ever left set with nothing
     left to release it. */
  /* P0-C item (a) - factored out of the boot-only inline check so the SAME
     gate (fresh each call, never cached) also arms the in-page transition off
     "Start using Earned" (the "done" callback above). At THIS mount, before
     setup finishes, setup.summary().enrolled is false, so this is false here
     and the first paint is the untouched fixture, exactly as P0B.3 requires. */
  hooks.bootAdoptionGate();
  /* S6 item 1 - THE LANDING SCREEN (owner ruling DECISIONS:463). A device whose
     durable record holds no first-run operation opens on the setup screens; an
     enrolled device, a device whose store did not open, and a RESTORE_REQUIRED
     device are all unchanged, because firstRun() is false in every one of those
     cases. `?screen=` still wins, which is what keeps the pre-setup Today preview
     reachable by name on the live path, and the render() guard above still refuses
     the setup route on an installation that is no longer fresh. Nothing here
     changes what setup WRITES or how it hands over: the "done" callback below is
     the same setup-to-Today transition P0-C already owns. */
  render(requestedScreen() || (facade.setupFirst() && facade.firstRun() ? "setup" : "today"));

  /* P0 HIS NUMBERS (CRITICAL-PATH-2026-09-15 section 4, Route B) - ON AN ENROLLED
     INSTALLATION, TODAY AND THE GYM CARD STAND ON THE ATHLETE'S OWN STATE.
     today-entry.mjs is pinned on disk (H3) and is not the file that can read
     setup.athleteState() and hand it to createTodayModel as the basis (the
     Route A shape recorded in rebuild/lanes/c/P0-HIS-NUMBERS-AUTHOR-REPORT.md
     section 2) without a lane-B re-pin no author here has. This module reads
     the SAME state through the SAME accepted constructor, off the SAME
     `options.setup` boot() already hands it, and adopts it here instead - once,
     asynchronously, AFTER the synchronous first paint above. That paint is what
     keeps S19's pinned assertion true (taken synchronously, before this promise
     can possibly have settled: `setup.athleteState()` is a real read of this
     installation's durable record, and nothing in today-entry.mjs awaits
     mountToday). `ready` lets a caller that wants the ADOPTED state wait for
     exactly this work; the shipped page never awaits it and is unchanged by its
     existence. A constructor refusal is surfaced on the status line, exactly as
     every other boot() cause is, and Today keeps the basis it already painted. */
  /* P0-C item (a) - factored so the "done" callback above can rerun the exact
     same chain after "Start using Earned", not merely at boot. */
  /* P2 S3 IMPORT JOIN (GATE-AUDIT-SPEC-P2 finding 1) - WHICH state this
     installation's own basis is. An ADMITTED import is already this athlete's
     own record: source-admission.mjs replayed it from his own file, proved its
     programme against the very setup document `athleteState()` is built from,
     and committed it into the SAME generation the setup host authenticates.
     When one is there, it IS the basis, and the clean-init state built from the
     setup document is what stands when it is not. local-source-basis.mjs
     refuses on any doubt (not admitted, not this installation, not this
     athlete's label) and never throws, so this is the P0-B chain with one extra
     read in front of it and no other change: the same adoptBasis, the same gym
     rebase, the same check-in adoption, the same pending gate and release. */
  /* `let`, not `const`: the "done" callback above reassigns this on the
     in-page transition, so a caller awaiting api.ready sees that settle too,
     with no reload. */
  hooks.bootSettleAdoption();

  return { render, read: () => model.read(), openWeighIn, screen: () => screen,
    /* P3-IMPORT-UI-2 - the Import route's own handle and the one flag the two
       entry links read, so a cell can drive the real screen and assert what the
       links say without reaching into this closure through the DOM. */
    importScreen: () => facade.importScreen(), importAdmitted: () => facade.importAdmitted(),
    foodPending: () => facade.foodSaving(), foodReady: () => facade.foodOpening(),
    /* N2 - the in-flight sleep write, the lane's own opening, and the check-in
       rebind's module load, so a check and a test can wait for each honestly. */
    sleepPending: () => facade.sleepSaving(), sleepReady: () => facade.sleepOpening(),
    sleepCheckInReady: () => screen === "sleep-checkin" ? facade.sleepCheckInViewPending() : facade.sleepCheckInPending(),
    checkInKitReady: () => facade.checkInKitLoading(), sleepLane: () => facade.sleepLane(),
    /* D2 round 1 - what the fixed screen now holds, so a cell can assert the
       acknowledgment, the mount that owns the screen and the rebuilt workout entry
       without reaching into the module's closure through the DOM. */
    sleepAck: () => (facade.sleepAck() ? { ...facade.sleepAck() } : null),
    sleepMount: () => mountToken,
    workoutEntry: () => facade.workout(),
    workoutRebound: () => facade.workoutRebinding(),
    /* P0-B - the boot chain's own settle promise, so a caller can await the
       athleteState() adoption (or its refusal) without polling. P0-C item (a) -
       a GETTER, not a snapshot: the "done" callback above reassigns `ready` on
       the in-page transition off "Start using Earned", and a caller reading
       this property after that point must see that later settle, not the
       already-resolved promise this function returned at boot. */
    get ready() { return facade.ready(); },
    /* S4 REAL DAY r3 (review round 2, finding 1) - THE TEARDOWN, AND ITS ONE
       CALLER. today-entry.mjs's midnight re-boot calls this before boot() paints
       the new day, and nothing else in this repository calls it at all: a caller
       that DECLARED its day is never given a watcher, so it never reaches this.
       It takes this mount's #phone listener off the shared element, invalidates
       the screen guard so no late lane, rebind or refresh callback of this
       mount's can paint again, and stales every deferred paint through the same
       mountToken the settings lane already uses. It owns no timer and no
       visibilitychange listener: this module takes neither (the midnight
       watcher's are today-entry.mjs's own, and watchDayRollover.stop() detaches
       both). Idempotent, and it records nothing. */
    dispose() {
      if (disposed) return false;
      disposed = true;
      mountToken += 1;
      if (typeof phone.removeEventListener === "function") phone.removeEventListener("keydown", onPhoneKeydown);
      return true;
    },
    disposed: () => disposed };
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
  SAMPLE_DATA_NOTE, RESUME_TODAYS_WORKOUT, resumeLabel,
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
  SLEEP_KEPT,
  athleteStateFailureCopy };
