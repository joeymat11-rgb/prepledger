"use strict";

/* design.cjs - the binding to the owner-approved 2026-09-18 design of record.

   Three things live here and nowhere else:
     THE PINS      — the sha256 of each approved reference, and the byte-for-byte copy of
                     its stylesheet into the page.
     THE BINDING   — every class the page can render must be a selector in those
                     stylesheets, and every static sentence it shows must occur verbatim
                     in that approved HTML, except short, named preview-owned lists.
     THE TYPEFACES - the two pinned local fonts, inlined, so the page needs no
                     network at all (review F9: a phone build must launch offline).
   A design change upstream, or a builder quietly inventing a class or a phrase or
   copying one of the prototype's fictional figures, fails this file.

   It deliberately depends on nothing but node:fs, node:crypto and this page's own
   ./plain-copy.cjs (which depends on nothing at all), so the tests that use it run under
   the repository's own lockfile with no browser-build dependency. */

const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { plainCopy } = require("./plain-copy.cjs");

const ROOT = path.resolve(__dirname, "../../../..");

/* ORDER MATTERS. Refinement A is laid down FIRST and Additions C SECOND, so the
   authoritative reference wins every rule the two share — its page, food, training and
   bottom proportions included. That ordering is what keeps Today's single primary action
   inside one 390x844 viewport (review F2). Refinement A still supplies the direct-entry
   control the weigh-in sheet uses, which C has no screen for.

   The authority for that ordering is:
     rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md LINE 9 — "Local
       authoritative implementation reference is `dist/index.html` in this directory,
       SHA256 caf9c2dc…" (the bytes pinned second below), and
     rebuild/m1/MOCK.md LINE 20 — a builder must not "improve" the design, and where an
       approved layout conflicts with an accepted requirement the concrete issue is
       resolved while preserving the visual intent.
   NOT MOCK.md line 14: that line is about the B-stage PNGs losing to the C HTML, which
   says nothing about Refinement A (review D-3). */
const APPROVED = Object.freeze([
  { file: "rebuild/m1/approved-2026-09-18/app/app.css",
    sha256: "bf4924e74fc4edc5cebf7fba6519613d9eec7f44397db990396fe402c124edc2" },
  { file: "rebuild/m1/approved-2026-09-18/app/states.css",
    sha256: "eae53de1838338a76a416052a381494602c5fc9545c330afce2438a19a2ca219" },
  { file: "rebuild/m1/approved-2026-09-18/app/states-workout.css",
    sha256: "5d6e4082c88e9129979f764dc992e4cbb0439c3a9b2e0d625535c524d47a4f0a" },
  { file: "rebuild/m1/approved-2026-09-18/app/states-coach.css",
    sha256: "d33f62e0c54004063b5fe40720f220350d9311213bf80f13d49d260061ca0686" },
]);

/* The two typefaces the approved design names, already pinned by sha256 for the phone
   host in rebuild/m4/workout/fonts/SOURCES.json. They are inlined into the stylesheet so
   the page fetches nothing. */
const FONT_DIR = "rebuild/m1/approved-2026-09-18/app/fonts";
const FONTS = Object.freeze([
  { family: "DM Sans", cssFamily: "Earned Sans", name: "earned-sans.woff2", weight: "100 1000", style: "normal",
    sha256: "c04be0b43dc3911dd36a7cb7203c5ff6daa4f42522e2bc2e6fa3325a61c43d8b" },
  { family: "Liberation Serif", cssFamily: "Earned Serif", name: "earned-serif.woff2", weight: "400", style: "normal",
    sha256: "ff90213df9f50596c71ada04c34d2dee9327fe86526e713a9d49a7064b1db660" },
]);

const SCENE_ASSETS = Object.freeze([
  { file: "rebuild/m1/approved-2026-09-18/app/assets/plate-ink-tall.jpg",
    sha256: "e4a05e29f4e12cd763897428da63466aa7ddaa1ddf7d84264c3d6d3f04dda93e", mime: "image/jpeg", key: "plateInk" },
  { file: "rebuild/m1/approved-2026-09-18/app/assets/plate-dawn-tall.jpg",
    sha256: "3192f9b2d7dea8d1efda6bd37ab4c438b939c510a6c2d496fa269e5a4479bfb4", mime: "image/jpeg", key: "plateDawn" },
  { file: "rebuild/m1/approved-2026-09-18/app/assets/mist.png",
    sha256: "72de840ebed8524916c8ff28bf246bbcee4ffac9ab8c0e8ec53cf40ef7325bbd", mime: "image/png", key: "mist" },
  { file: "rebuild/m1/approved-2026-09-18/app/assets/grain.png",
    sha256: "878b291b3454fca2ec07ac2d9e2bc22fb1d06604c8209a03f066e9f9a17fb57e", mime: "image/png", key: "grain" },
]);

/* The new pack is authoritative where it speaks. Its own README keeps the
   2026-09-08 references as the copy authority where the new pack is silent. */
const COPY_SOURCES = Object.freeze([
  { file: "rebuild/m1/approved-2026-09-18/app/app.html", sha256: "4c6fc3c69aabb7fcdf34ce6b2f276141f1b649ae9284b15655747ed6d6073c84" },
  { file: "rebuild/m1/approved-2026-09-18/app/states-today.js", sha256: "6f03c468f2bc62108f622f127ec0b5c81589522dea61261e94592151ddd28cbe" },
  { file: "rebuild/m1/approved-2026-09-18/app/states-workout.js", sha256: "20b597eef4d48ab1011490f99549b38672472d71144c9d179fa2c840dfe2a5be" },
  { file: "rebuild/m1/approved-2026-09-18/app/states-coach.js", sha256: "6aafa06d080f7fdceaeb4f011a9dd07ea84c012802cabf53ef4dea43a5762e8b" },
  { file: "rebuild/m1/approved-2026-09-08/Earned-refinement-A.html", sha256: "fddfe0542c4a578653a11941d96fbf6727dc2d9f83c500449c694339e89ab031" },
  { file: "rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html", sha256: "caf9c2dc683e220112bc8bf85ed8dbe670428c8015b1ae8ec7d68a35720b2a45" },
]);

/* C-UI-1. The live Today templates move screen by screen in later tickets. Until
   then their existing class vocabulary keeps its pinned 2026-09-08 structure,
   laid down before the new pack so every 2026-09-18 rule wins on overlap. */
const LEGACY_STRUCTURE = Object.freeze([
  { file: "rebuild/m1/approved-2026-09-08/Earned-refinement-A.html",
    sha256: "fddfe0542c4a578653a11941d96fbf6727dc2d9f83c500449c694339e89ab031" },
  { file: "rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html",
    sha256: "caf9c2dc683e220112bc8bf85ed8dbe670428c8015b1ae8ec7d68a35720b2a45" },
]);

// Classes the preview owns because the approved design covers no screen for them.
const PREVIEW_CLASSES = Object.freeze(["sheet-panel"]);
// Classes the view creates at runtime; they are not in the template file.
const RUNTIME_CLASSES = Object.freeze(["macro-row", "row", "number", "unit", "arrow"]);
// Sentences the preview owns. Each says something the approved prototype cannot, because
// the approved prototype saves nothing and refuses nothing.
const PREVIEW_COPY = Object.freeze([
  "Not now",
  /* A3 — the two controls that CONFIRM an existing dated sleep record instead of
     asking for it twice. The approved handoff item 4 requires that reuse; the
     approved prototype stores nothing, so it can never have a record to reuse and
     has no words for confirming one. */
  "Yes, that’s right",
  /* P1 review, optional item 5, taken: a comma reads better here than a colon, and
     DECISIONS:114 allows "a colon, comma, full stop or a new sentence". */
  "No, answer it here",
]);
// Static copy that MUST come from the approved references.
const APPROVED_COPY = Object.freeze([
  "Earned", "Your plan for today", "Eat about", "Your full nutrition plan",
  "How are you feeling today?",
  "Ask your coach", "Your plan, progress and the reasons behind it.", "Weight (lb)",
  /* C-UI-2 round 3, DECISIONS:820 (2): the approved board's words win on Today where the
     app named the same thing differently. Each is on the board (app/app.html) and in the
     shipped template: the Recovery row (board #recovery, state T-26), the Talk row (board
     #talk-today, T-31), the header pill (board .pill, shown only over the sample athlete,
     T-02/T-04) and the weigh-in field (board #weigh-form label and placeholder, T-42). */
  "Recovery check in", "Optional. How are you feeling?", "Talk through today’s plan",
  "example", "Example numbers, not your data", "Your weight in pounds", "Your weight",
  "Back to my plan", "Today", "Your food plan.",
  "Your agreed daily targets, together in one place.",
  "Targets guide your day. Any suggested change comes with a reason and your choice to accept it.",
  "A quick check-in.", "Energy right now", "Muscle soreness right now", "Stress right now",
  "Low", "Moderate", "High", "None", "Mild", "Significant",
  /* C-UI-6: "Ask your coach." and its lead left this list with the coach stub they
     were the template's words for. The stub is now the drawn state C-02, built by
     coach-app.mjs, and its words are bound there (assertCoachBinding below). */
  /* A3 — every word of the approved recovery screen (?screen=recovery), question by
     question, choice by choice, including the conditional detail the approved notes
     enumerate. Each is asserted to occur verbatim in the approved references AND in
     this page's template, so the screen can neither drift from the design nor lose a
     branch of it silently. */
  "A few details to help put today’s training in context. Answer what you can; leave the rest blank.",
  "Last night’s sleep", "hours asleep, approximately", "How was the quality?",
  "Poor", "Okay", "Good",
  "Which muscles?", "Does it affect your usual movement?",
  "Leave unanswered", "A little", "Quite a lot", "Not sure",
  "Anything else affecting today?", "Pain", "Feeling ill", "Time away",
  "Keep pain separate from ordinary muscle soreness.",
  "Where, and during which movement?", "Is this new or changed?",
  "New", "Worse than before", "Ongoing, unchanged", "Improving",
  "How does it affect movement?",
  "No noticeable effect", "I change how I move", "I cannot do the movement",
  "What symptoms, and when did they start?",
  "About how many days away from training?", "What was the reason?",
  "Add a note, if useful", "Anything the answers missed?",
  "Add today’s context", "Your answers belong alongside your training data.",
]);
/* Approved copy the VIEW composes at runtime rather than carrying in the template,
   because it sits beside a bound value ("Weight trend 180.1 lb"). Each string is checked
   against the approved HTML AND against today-app.cjs, so it is bound just as tightly as
   the template's. */
const RUNTIME_COPY = Object.freeze([
  "This morning", "Weight trend", "Why this plan?", "Your set targets are ready",
  /* A2 — the gym card composes these beside bound values, exactly as A1's four are
     composed. Each occurs verbatim in Refinement A, the reviewed workout/rest
     prototype, and each is checked against the view sources as well. */
  "Exercise ", " of ", "What you did · Set ", "Last time: ", "Log set ", " logged",
  " reps", "Aim to finish with ", " clean reps left", "Effort unknown",
  "Ready for set ", "Next · Set ", "Next · ", "Resume ", "Workout in progress", " complete",
  " recorded",
  /* C-UI-2 round 3, DECISIONS:820 (1): Today's status line, the prototype's own words per
     state (app/states-today.js T-32 the owner's pattern, T-02, T-19, T-14, T-15, T-16, T-17,
     T-12, T-13, T-11, T-06), composed beside the engine's session name. */
  " today. Nothing to decide.", " today. Sample data.", " today. Your calorie range is not available yet.",
  " is under way.", " logged. Nothing to decide.", "Today’s workout cannot open.",
  "An earlier workout is still open.", "Nothing scheduled today, so there is nothing to start.",
  "Today’s exercises are not available, so there is nothing to start.", "Nothing to decide. Next: ",
  "This device’s record did not verify. Nothing on this screen is a value.",
  /* DECISIONS:820 (2): the weigh-in submits with the board's word (board #save-weight, T-42). */
  "Save",
  /* C-UI-3 (pack README C-UI-3, DECISIONS:817, :820 (2)): the proposal card's words, each
     the prototype's own (app/states-today.js proposal() and T-40 to T-40g): the eyebrows,
     the recorded lines, "Change my answer", the decision and change words of the three
     kinds the prototype draws (a one-set add T-40, a diet break T-40f, a machine ladder
     T-40g), the two status lines T-40 and T-40b beside the engine's session name, and the
     inline weigh-in's in-flight word (T-44). */
  "One call needs you", "Your call", "Applied", "Withdrawn", "Nothing changes until you say yes.",
  "You said yes.", "It applies when your plan is next built.", "You said no.", "Nothing changes.",
  "Withdrawn.", "Your plan was rebuilt and this proposal no longer applies.", "Change my answer",
  "Yes, add it", "No, keep it as is", "Add one set this week", "Yes, take the break", "No, keep cutting",
  "Yes, use them", "No, keep the plan’s steps", "Use the machine’s own steps",
  " today. One change to review.", " today. One answer recorded.", "Saving",
]);
/* A3 — the approved question wording the CHECK-IN composes at runtime, beside a
   stored answer, when it reads today's recorded check-in back. Same rule as A1's and
   A2's: verbatim in the approved references, and present in a view source. */
const CHECKIN_RUNTIME_COPY = Object.freeze([
  "Last night’s sleep", "How was the quality?", "Energy right now",
  "Muscle soreness right now", "Which muscles?", "Does it affect your usual movement?",
  "Stress right now", "Anything else affecting today?",
  "Where, and during which movement?", "Is this new or changed?", "How does it affect movement?",
  "What symptoms, and when did they start?", "About how many days away from training?",
  "What was the reason?", "Anything the answers missed?",
  "Pain", "Feeling ill", "Time away",
]);
/* Copy the existing runtime owns, exactly as PREVIEW_COPY is owned in the
   template. The newer design adopts some of these sentences while operational
   wording outside its screens remains preview-owned. Every entry must still be
   present in a real view source.
     * the rest length — the prototype counts down a fictional 2:30; the accepted
       engine prescribes no rest at all, so the screen says that instead;
     * the finished workout — the prototype never completes one, so it has no
       words for Today's "recorded" state, for reviewing it, or for the action
       that closes the session;
     * the unopenable store — the prototype saves nothing, so it can never fail
       to save. */
const RUNTIME_COPY_CANDIDATES = Object.freeze([
  "Your plan does not set a rest length.",
  "Workout recorded",
  "Review today’s workout",
  "Finish this workout",
  "Your workout could not be opened on this device, and nothing was recorded.",
  "Today’s workout is recorded on this device.",
  /* Review B1: the layer can refuse to PREPARE a workout, which the prototype (which
     prepares nothing) has no words for. The lead is neutral — it never says the
     device is at fault — and the layer's own code follows it, once. */
  "Today’s workout cannot open",
  "Why today’s workout cannot open",
  "Earned could not prepare today’s workout, and nothing was recorded.",
  /* Review B2: the weigh-in's store of record is this device's encrypted local
     store, and a device that cannot open one records nothing. The prototype saves
     nothing, so it can never fail to save. */
  "This device could not open its encrypted local store, so nothing can be recorded here.",
  "Saved in this device's encrypted local store. It survives a reload, a restart, a reboot and a crash.",
  /* Review round 2: a session abandoned on an earlier day blocks every later day in
     the accepted client, and the layer's own `early` close retires it. The
     prototype has no unfinished session and so no words for either. */
  "An earlier workout was never finished",
  "Close the unfinished workout",
  /* A3 — the check-in. The approved prototype records nothing, reuses nothing and
     refuses nothing, so it has no words for: a recorded check-in and its provenance,
     an existing dated sleep record offered for confirmation, a blank sheet that has
     recorded nothing yet, a form bound, a device with no store, or the plain
     statement that these answers reach no training rule. */
  "Nothing is recorded yet. Every answer is blank, and blank means unknown: never none, never zero.",
  "Today’s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet.",
  "Answer at least one question, or leave the check-in for today. Nothing was recorded.",
  "This device could not open its encrypted local store, so no check-in can be recorded here.",
  "Your sleep record already has last night.",
  "From your sleep record for ",
  "Recorded today at ",
  "Your plan is unchanged: nothing in this check-in reaches a training rule yet.",
  "An approximate sleep length is recorded between 0 and 24 hours. Nothing was recorded.",
  "Days away from training is recorded as a whole number of days. Nothing was recorded.",
  "This check-in could not be recorded on this device, and no part of it was recorded.",
  "Recorded today",
  "Not available on this device",
  /* REPORT A PROBLEM (DECISIONS:140 (3)). The approved prototype has no control for
     reporting a fault and no clipboard, so all three sentences are preview-owned:
     the control itself, the confirmation when the clipboard took the block, and the
     instruction when it did not or could not. Each is checked ABSENT from the
     approved references and PRESENT in a view source, exactly as every other
     preview-owned sentence on this page is. */
  "Report a problem",
  "Copied. Send it to Joe.",
  "Select all and copy, then send it to Joe.",
  /* N1 (DECISIONS:143). The approved 2026-09-08 nutrition screen shows TARGETS and
     has no entry on it: the prototype records nothing, so it has no words for
     recording an intake, for refusing one, for reading one back, or for having no
     target to show at all. Every sentence below is therefore preview-owned, checked
     ABSENT from the approved references and PRESENT in a view source: they live in
     today-app.cjs, which is one, because VIEW_SOURCES is pinned by name in
     test/design.test.cjs and this build does not own that file. food-model.cjs owns
     the RULE and names each refusal by code; the wording is the view's. */
  "Today's intake",
  "Enter what you actually ate today. Either figure on its own is enough.",
  "Calories eaten",
  "Protein eaten",
  "Record today's intake",
  "Recording it again replaces today's figures.",
  "Enter calories, protein, or both. Nothing was recorded.",
  "Calories are recorded as a whole number between 0 and 20000. Nothing was recorded.",
  "Protein is recorded as a whole number of grams between 0 and 1000. Nothing was recorded.",
  "This intake could not be recorded on this device, and no part of it was recorded.",
  "Earned has no calorie band or protein target for you yet: it needs a starting estimate of your body composition, which this device has not recorded. Your intake is still yours to record, and it is kept.",
  "Not prescribed. The engine issues no carbohydrate or fat target.",
  /* D2 round 1 - the refusals the nutrition entry can now act on, and the day the
     engine could not read back. Preview-owned for the same reason as the rest. */
  "Your figures are still in the boxes above. Record them again, and if it keeps failing, report a problem from Today.",
  "Your intake cannot be recorded on this device yet. Earned could not open its encrypted store here, so there is nowhere to keep what you enter and nothing you type is kept. Open Earned again on this device, or use one that allows local storage, and this entry starts working.",
  "Opening this device's encrypted store.",
  "Recorded and kept on this device. Earned cannot show today's figures back through its own ledger yet: it has no starting estimate of your body composition, and that ledger will not open without one. Nothing is lost, and they appear here as soon as that estimate exists.",
  /* D2 round 2 - a commit and the read that follows it are two outcomes. */
  "Earned could not read today's record back just now, so what is shown here may not be the whole day.",
  "Earned could not tell whether this intake was recorded on this device. It may have been kept and it may not.",
  "Nothing you entered is lost. Read today's record again below, or open Earned again on this device.",
  "Read today's record again",
  /* MACHINE SETTINGS ON THE ACTIVE SET (DECISIONS:154 (2), :140 wave one). The
     approved prototype has no per-machine memory at all: no block under the
     prescription, no capture, no empty state for a lift this device holds nothing
     for. Every sentence below is therefore preview-owned by construction, lives in
     gym-app.mjs (a VIEW_SOURCE), and is checked ABSENT from the approved references
     exactly as the rest of this list is. The recalled settings themselves are never
     in here: they are the athlete's own words, shown back verbatim. */
  "Your settings for this machine",
  "No settings saved yet.",
  /* D2 round 1, finding 2 - the two states that are NOT an empty record. */
  "Reading your saved settings for this machine.",
  "Settings could not be read.",
  "Nothing was lost and nothing was changed. Log your set as usual, and open Earned again on this device to see them.",
  "Machine settings",
  "Save the settings for this machine",
  "Anything to remember",
  "To remember:",
  "Add another setting",
  "Remove this setting",
  "Save these settings",
  "Close without saving",
  "Add a setting or a cue before saving. Nothing was recorded.",
  "Each setting needs a short name and a short value, and each name only once. Nothing was recorded.",
  "These settings could not be recorded on this device, and no part of them was recorded.",
  /* N2 (DECISIONS:167). The approved 2026-09-08 design has NO sleep screen at all, so
     every sentence the entry shows is preview-owned by construction and INVENTED, as
     the accepted brief itself declares. They live in today-app.cjs, a VIEW_SOURCE. */
  "Sleep",
  "No sleep recorded for this night.",
  "How do you want to record it?",
  "Bed and wake times",
  "Hours asleep",
  "Bed time",
  "Wake time",
  "Time awake",
  "Minutes awake",
  "Time awake was not recorded.",
  "For a clock-change night, enter hours asleep.",
  "About how many hours did you sleep?",
  "Hours",
  "Entered as an approximate duration.",
  "From bed and wake times.",
  "Use these hours",
  "Save sleep",
  "Sleep saved on this device.",
  "Save time not recorded.",
  "Sleep could not be saved on this device.",
  "Sleep was saved. The screen could not refresh. Open it again.",
  "Sleep cannot be recorded on this device yet. Earned could not open its encrypted store here, so there is nowhere to keep it. Open Earned again on this device, or use one that allows local storage.",
  "Nothing was recorded.",
  "Choose times or hours asleep.",
  "Enter both times.",
  "Enter valid times.",
  "For matching times, enter hours asleep instead.",
  "Enter whole minutes awake within the time in bed.",
  "Enter hours from 0 to 24, with up to two decimal places.",
  "Choose a completed night.",
  /* D2 round 1, findings 5 and 6 - the dated, quality, correction, rollover and
     save-lifecycle states the accepted brief's copy table names. Every one of these is
     that table's own sentence, and INVENTED for exactly the same reason as the rest of
     the sleep screen: the approved design has no sleep screen to take them from. */
  "Night",
  "Saving sleep...",
  "Quality: ",
  "Quality not recorded.",
  "The check-in could not be read on this device.",
  "Recovery check-in on ",
  "No check-in was recorded for this date.",
  "Earlier check-ins are shown as recorded.",
  "Open recovery check-in",
  "Change sleep",
  "Save correction",
  "Cancel",
  "The date changed. Check which night this is for.",
  "Keep this night",
  "This night changed while you were editing. Review the saved record before trying again.",
  "The check-in changed. Review its hours again.",
  "Checking whether sleep was saved.",
  "Confirmed from your check-in.",
  "Corrected ",
  "Try reading it again",
  "What you typed is still here.",
]);
/* These exact runtime sentences were adopted by the named pinned 2026-09-18
   source. Every other candidate remains preview-owned and must stay absent upstream. */
const ADOPTED_RUNTIME_COPY = Object.freeze([
  {
    "line": "Your plan does not set a rest length.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Workout recorded",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Finish this workout",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Your workout could not be opened on this device, and nothing was recorded.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Today’s workout is recorded on this device.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Today’s workout cannot open",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Earned could not prepare today’s workout, and nothing was recorded.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "This device could not open its encrypted local store, so nothing can be recorded here.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "An earlier workout was never finished",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Today’s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-coach.js"
  },
  {
    "line": "Recorded today at ",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Recorded today",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Not available on this device",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Report a problem",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Copied. Send it to Joe.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Select all and copy, then send it to Joe.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Enter what you actually ate today. Either figure on its own is enough.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Calories eaten",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Protein eaten",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "This intake could not be recorded on this device, and no part of it was recorded.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Earned has no calorie band or protein target for you yet: it needs a starting estimate of your body composition, which this device has not recorded. Your intake is still yours to record, and it is kept.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Your figures are still in the boxes above. Record them again, and if it keeps failing, report a problem from Today.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Your intake cannot be recorded on this device yet. Earned could not open its encrypted store here, so there is nowhere to keep what you enter and nothing you type is kept. Open Earned again on this device, or use one that allows local storage, and this entry starts working.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Earned could not tell whether this intake was recorded on this device. It may have been kept and it may not.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Your settings for this machine",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "No settings saved yet.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Reading your saved settings for this machine.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Settings could not be read.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Nothing was lost and nothing was changed. Log your set as usual, and open Earned again on this device to see them.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Machine settings",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Save the settings for this machine",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Anything to remember",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "To remember:",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Add another setting",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Remove this setting",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Save these settings",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Close without saving",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Add a setting or a cue before saving. Nothing was recorded.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Each setting needs a short name and a short value, and each name only once. Nothing was recorded.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "These settings could not be recorded on this device, and no part of them was recorded.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-workout.js"
  },
  {
    "line": "Sleep",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "No sleep recorded for this night.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "How do you want to record it?",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Bed and wake times",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Hours asleep",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Bed time",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Wake time",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Time awake",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Time awake was not recorded.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "For a clock-change night, enter hours asleep.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "About how many hours did you sleep?",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Hours",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Entered as an approximate duration.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "From bed and wake times.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Use these hours",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Save sleep",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Sleep could not be saved on this device.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Sleep cannot be recorded on this device yet. Earned could not open its encrypted store here, so there is nowhere to keep it. Open Earned again on this device, or use one that allows local storage.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Nothing was recorded.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Choose times or hours asleep.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Enter both times.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Enter valid times.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "For matching times, enter hours asleep instead.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Enter whole minutes awake within the time in bed.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Enter hours from 0 to 24, with up to two decimal places.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Choose a completed night.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Night",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Change sleep",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Save correction",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Cancel",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "The date changed. Check which night this is for.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Keep this night",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "This night changed while you were editing. Review the saved record before trying again.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "The check-in changed. Review its hours again.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Checking whether sleep was saved.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Corrected ",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "Try reading it again",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  },
  {
    "line": "What you typed is still here.",
    "source": "rebuild/m1/approved-2026-09-18/app/states-today.js"
  }
]);
const ADOPTED_RUNTIME_LINES = new Set(ADOPTED_RUNTIME_COPY.map((entry) => entry.line));
const PREVIEW_RUNTIME_COPY = Object.freeze(RUNTIME_COPY_CANDIDATES.filter((line) => !ADOPTED_RUNTIME_LINES.has(line)));

/* A4 — Dad's first run. The approved 2026-09-08 design has NO first-run screen at
   all, so every sentence the six screens show is preview-owned and named here,
   exactly as PREVIEW_RUNTIME_COPY is. Each entry is checked to be PRESENT in a
   view source, so a sentence cannot be
   declared and then quietly dropped. The words themselves are in ONE place,
   setup-model.mjs COPY, which is a view source; the list below is read out of
   that module at check time rather than retyped, so a copy edit there fails this
   check instead of drifting past it.
   THE OWNER'S RULE (DECISIONS:114 (1)) applies to every one of them: no U+2014
   and no U+2013. Since P1 merged (DECISIONS:121) that refusal is ./plain-copy.cjs's
   for the whole page, at build time over the shipped bytes and at render time per
   slot; A4 keeps the behaviour in its own suite and no longer restates the
   mechanism here (see assertSetupBinding). */
const SETUP_MODEL_SOURCE = "setup-model.mjs";

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const classTokens = (html) =>
  [...html.matchAll(/\sclass="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean);
// The text NODES of the markup: tags and comments become separators, so every entry is a
// complete visible string, never a fragment of one.
const MARK = String.fromCharCode(0);
const textOf = (html) =>
  html.replace(/<!--[\s\S]*?-->/g, MARK).replace(/<[^>]*>/g, MARK).split(MARK)
    .map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);

/* `root` is a parameter ONLY so a test can point the same pin check at a tampered copy
   and watch it refuse. Production callers pass nothing. */
function readApproved(root = ROOT) {
  return APPROVED.map((pin) => {
    const bytes = fs.readFileSync(path.join(root, pin.file));
    assert.equal(sha256(bytes), pin.sha256, `APPROVED-PIN FAIL: ${pin.file}`);
    const styles = bytes.toString("utf8");
    assert(styles.length > 1000, `APPROVED-STYLES FAIL: ${pin.file}`);
    return { ...pin, bytes, styles };
  });
}

function readCopyReferences(root = ROOT) {
  return COPY_SOURCES.map((pin) => {
    const bytes = fs.readFileSync(path.join(root, pin.file));
    assert.equal(sha256(bytes), pin.sha256, `COPY-SOURCE-PIN FAIL: ${pin.file}`);
    return { ...pin, text: bytes.toString("utf8") };
  });
}

function readLegacyStructure(root = ROOT) {
  return LEGACY_STRUCTURE.map((pin) => {
    const bytes = fs.readFileSync(path.join(root, pin.file));
    assert.equal(sha256(bytes), pin.sha256, `LEGACY-STRUCTURE-PIN FAIL: ${pin.file}`);
    const html = bytes.toString("utf8");
    const style = html.match(/<style>([\s\S]*?)<\/style>/);
    assert(style, `LEGACY-STRUCTURE-STYLES FAIL: ${pin.file}`);
    return { ...pin, styles: style[1] };
  });
}

/* The pinned local typefaces, as @font-face rules with the font bytes inlined. Same
   files, same hashes the phone host's build already enforces. */
function readFonts(root = ROOT) {
  return FONTS.map((font) => {
    const bytes = fs.readFileSync(path.join(root, FONT_DIR, font.name));
    assert.equal(sha256(bytes), font.sha256, `TYPOGRAPHY-PIN FAIL: ${font.name}`);
    assert.equal(bytes.subarray(0, 4).toString("latin1"), "wOF2", `TYPOGRAPHY-FORMAT FAIL: ${font.name}`);
    return { ...font, bytes };
  });
}
function fontFaceCss(fonts) {
  return fonts.map((font) =>
    `@font-face{font-family:'${font.cssFamily || font.family}';font-style:${font.style};font-weight:${font.weight};`
    + `font-display:swap;src:url(data:font/woff2;base64,${font.bytes.toString("base64")}) format('woff2')}`
  ).join("\n");
}

function readSceneAssets(root = ROOT) {
  return SCENE_ASSETS.map((pin) => {
    const bytes = fs.readFileSync(path.join(root, pin.file));
    assert.equal(sha256(bytes), pin.sha256, `SCENE-ASSET-PIN FAIL: ${pin.file}`);
    return { ...pin, bytes, url: `data:${pin.mime};base64,${bytes.toString("base64")}` };
  });
}

function sceneAssetCss(assets) {
  const by = Object.fromEntries(assets.map((asset) => [asset.key, asset.url]));
  for (const key of ["plateInk", "plateDawn", "mist", "grain"]) {
    assert(by[key], `SCENE-ASSET-MISSING FAIL: ${key}`);
  }
  return `:root{--scene-plate-ink:url("${by.plateInk}");--scene-plate-dawn:url("${by.plateDawn}");`
    + `--scene-mist:url("${by.mist}");--scene-grain:url("${by.grain}")}`;
}

/* ---------------------------------------------------------------------------
   THE RECOVERY SCREEN, DERIVED FROM THE APPROVED BYTES (A3 review F1).
   ---------------------------------------------------------------------------
   A hand-maintained list of approved strings can only catch what somebody
   remembered to list, and the first build of this screen shipped six of the
   approved placeholders missing because a placeholder is an ATTRIBUTE and the
   copy binding only reads text NODES. So the recovery screen's vocabulary is not
   listed at all: it is HARVESTED out of the pinned approved reference at check
   time — every placeholder, every <option>, every <label>, every <legend> and
   every choice array the approved screen builds its buttons from — and the
   shipped template must carry every single one of them, verbatim.

   A word added to the approved design upstream, or one quietly dropped here,
   fails this without anyone updating a list. */
const RECOVERY_START = "recovery:()=>";
const RECOVERY_END = "coach:()=>";
function recoverySection(approved) {
  const reference = readCopyReferences().find((a) => /additions-C-approved/i.test(a.file));
  assert(reference, "APPROVED-RECOVERY FAIL: the authoritative Additions C reference is not pinned");
  const start = reference.text.indexOf(RECOVERY_START);
  const end = reference.text.indexOf(RECOVERY_END, start);
  assert(start > 0 && end > start, "APPROVED-RECOVERY FAIL: the recovery screen could not be located");
  return reference.text.slice(start, end);
}
function recoveryVocabulary(approved) {
  const section = recoverySection(approved);
  const grab = (pattern) => [...section.matchAll(pattern)].map((m) => m[1].replace(/\s+/g, " ").trim()).filter(Boolean);
  const placeholders = grab(/placeholder="([^"]+)"/g);
  const options = grab(/<option[^>]*>([^<]+)<\/option>/g);
  const labels = grab(/<label[^>]*>([^<]+)<\/label>/g);
  const legends = grab(/<legend[^>]*>([^<]+)<\/legend>/g);
  // The approved screen builds its answer buttons from inline arrays:
  //   ${['Poor','Okay','Good'].map(x=>`<button …>${x}</button>`).join('')}
  const choices = [...section.matchAll(/\[((?:'[^']*',?)+)\]\.map\(/g)]
    .flatMap((m) => [...m[1].matchAll(/'([^']*)'/g)].map((x) => x[1]))
    .filter(Boolean);
  const unique = (list) => [...new Set(list)];
  return { placeholders: unique(placeholders), options: unique(options), labels: unique(labels),
    legends: unique(legends), choices: unique(choices) };
}
/* Every harvested string must be in the shipped template. Placeholders are matched as
   the attribute they are, so a placeholder demoted to visible text would not satisfy
   this, and the rest as their own element's text.

   DASH-NORMALISED (DECISIONS:114 (1), the owner verbatim: "no ai dashes are allowed in
   the ui"): where the pinned approved reference itself spells a word with an em or en
   dash, the shipped screen may not, so the comparison is made after ./plain-copy.cjs has
   taken the dash out of BOTH sides. The owner's rule beats the pinned design where the
   two disagree, and only there: every other harvested word is still compared byte for
   byte, so this can never be used to let a different word through. The report lists each
   term the normalisation moved. */
const dashNormalisedTerms = (vocabulary) => {
  const moved = [];
  for (const [kind, list] of Object.entries(vocabulary)) {
    for (const value of list) {
      const plain = plainCopy(value);
      if (plain !== value) moved.push({ kind, approved: value, shipped: plain });
    }
  }
  return moved;
};
function assertRecoveryBinding(approved, templateHtml) {
  const vocabulary = recoveryVocabulary(approved);
  assert(vocabulary.placeholders.length >= 7,
    `APPROVED-RECOVERY FAIL: only ${vocabulary.placeholders.length} placeholders harvested`);
  assert(vocabulary.choices.length >= 9,
    `APPROVED-RECOVERY FAIL: only ${vocabulary.choices.length} answer choices harvested`);
  for (const value of vocabulary.placeholders) {
    assert(templateHtml.includes(`placeholder="${plainCopy(value)}"`),
      `APPROVED-RECOVERY FAIL: the approved placeholder "${value}" is missing from the shipped screen`);
  }
  for (const [kind, list] of [["option", vocabulary.options], ["label", vocabulary.labels],
    ["legend", vocabulary.legends], ["choice", vocabulary.choices]]) {
    for (const value of list) {
      assert(templateHtml.includes(">" + plainCopy(value) + "<"),
        `APPROVED-RECOVERY FAIL: the approved ${kind} "${value}" is missing from the shipped screen`);
    }
  }
  return { placeholders: vocabulary.placeholders.length, options: vocabulary.options.length,
    labels: vocabulary.labels.length, legends: vocabulary.legends.length, choices: vocabulary.choices.length,
    dashNormalised: dashNormalisedTerms(vocabulary) };
}

/* ---------------------------------------------------------------------------
   A4 — THE FIRST-RUN VOCABULARY, HARVESTED FROM THE MODULE THAT OWNS IT.
   ---------------------------------------------------------------------------
   Same lesson as the recovery harvest above, applied the other way round: the
   approved design has no first-run screen, so there is nothing upstream to
   harvest FROM. What there is instead is exactly one module that owns every
   word of these six screens (setup-model.mjs COPY / VALIDATION / MISSING), and
   the check harvests that, so a sentence added, edited or removed there is
   covered without anyone updating a list. */
function setupVocabulary(root = ROOT) {
  const text = fs.readFileSync(path.join(root, "rebuild/m3/w7-preview/today", SETUP_MODEL_SOURCE), "utf8");
  const block = (name) => {
    const start = text.indexOf("export const " + name + " = Object.freeze({");
    assert(start > 0, `SETUP-VOCABULARY FAIL: ${name} could not be located in ${SETUP_MODEL_SOURCE}`);
    const end = text.indexOf("\n});", start);
    assert(end > start, `SETUP-VOCABULARY FAIL: ${name} is not closed`);
    return text.slice(start, end);
  };
  const grab = (name) => [...block(name).matchAll(/:\s*'((?:[^'\\]|\\.)*)'/g)]
    .map((m) => m[1].replace(/\\(.)/g, "$1")).filter((s) => s.trim() !== "");
  const copy = grab("COPY");
  const validation = grab("VALIDATION");
  const refusals = grab("REFUSAL_SENTENCES");
  assert(copy.length >= 30, `SETUP-VOCABULARY FAIL: only ${copy.length} first-run sentences harvested`);
  assert(refusals.length >= 5, `SETUP-VOCABULARY FAIL: only ${refusals.length} refusal sentences harvested`);
  return { copy, validation, refusals, source: text };
}
/* Every module that can put a first-run word on the screen, joined. */
const setupSource = (root = ROOT) => SETUP_SOURCES
  .map((name) => fs.readFileSync(path.join(root, "rebuild/m3/w7-preview/today", name), "utf8")).join("\n");
/* Every harvested sentence must be PRESENT IN A VIEW SOURCE, so a sentence cannot be
   declared here and then quietly dropped from the screens, and the first-run screen
   must be in the shipped template at all.

   A4 NO LONGER SCANS FOR DASHES HERE. It did, before P1 merged: three loops over
   ./plain-copy.cjs's two characters, one on the harvested sentences, one on A4's own
   source files and one on the `t-setup` section. P1 (DECISIONS:121) now owns that
   refusal for the WHOLE page and owns it better: `assertNoAiDashesInAssets` scans the
   BUILT bytes - every byte of the HTML and CSS outside a comment, and every JS string
   literal whose esbuild banner attributes it to `rebuild/m3/w7-preview/today/`, which
   is exactly where A4's five setup modules live - and `build.mjs` refuses
   AI_DASH_IN_BUILD, plus AI_DASH_GUARD_BLIND if the banners it attributes by are
   missing. A second, narrower, source-level scan beside it would be a second
   mechanism to keep in step for no added coverage (PM to C 20:46: A4 verifies, it
   does not re-author). A4's own suite still asserts the BEHAVIOUR - no dash in its
   sentences, its sources or its rendered DOM, and the build refusing when one is put
   back - which is what proves P1's mechanism really covers these screens.

   There is deliberately NO "absent from the approved references" clause. It has
   nothing to bite on here:
   the approved 2026-09-08 design has no first-run screen at all, so every one of
   these sentences is preview-owned by construction, and the words that do overlap
   with the approved design are the ones that SHOULD ("Earned", "Next", "Back"). */
function assertSetupBinding(approved, templateHtml, root = ROOT) {
  const vocabulary = setupVocabulary(root);
  const source = setupSource(root);
  /* A harvested sentence is UNESCAPED (grab undoes the JS escapes), so a sentence
     that legitimately contains an apostrophe - A4b's DECISIONS:125 (2) F1
     sentence quotes the ledger verbatim, apostrophe and all - appears in the
     source only in its escaped form. Re-escape before looking, so the check
     still bites on a genuinely missing sentence without failing on a quote. */
  const asWritten = (line) => line.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  for (const line of [...vocabulary.copy, ...vocabulary.validation, ...vocabulary.refusals]) {
    assert(source.includes(line) || source.includes(asWritten(line)),
      `SETUP-BINDING FAIL: declared first-run copy missing from the view: "${line}"`);
  }
  const start = templateHtml.indexOf('<template id="t-setup">');
  assert(start > 0, "SETUP-BINDING FAIL: the first-run screen is not in the shipped template");
  return { copy: vocabulary.copy.length, validation: vocabulary.validation.length,
    refusals: vocabulary.refusals.length };
}

/* ---------------------------------------------------------------------------
   ==== C-UI-6 COACH (begin) ====
   The coach screen's words and runtime classes, bound as tightly as Today's.
   ---------------------------------------------------------------------------
   Every quoted string between the two COACH-COPY markers of coach-app.mjs (the live
   screen's words, the pack's 65 coach states and their review metadata) must occur
   VERBATIM in the pinned approved references and carry no dash. The references are the
   pinned COPY_SOURCES plus the pack's own app.js and states.js, pinned here by sha256:
   the pack README names app.js with app.html as the implementation reference whose
   "classes and copy ... the port binds to" (it alone says "Tap to stop"), and states.js
   is the state driver whose panel words the coach's panels share. Every class the view
   writes at runtime (coach-app.mjs COACH_CLASSES, read out of the source here) must be a
   selector in the approved stylesheets. And the shipped template must carry the coach
   screen's two gate font identities as the real elements the pack draws: the serif
   headline h1.coach-title and the sans line p.coach-line (gate.py KNOWN_FACE coach). */
const COACH_SOURCE = "coach-app.mjs";
const COACH_EXTRA_REFERENCES = Object.freeze([
  { file: "rebuild/m1/approved-2026-09-18/app/app.js", sha256: "0f12d829d4bcd5fd207dbd51b64d7f822ffd8034c1c0d9616fa5e9ff2daefb2b" },
  { file: "rebuild/m1/approved-2026-09-18/app/states.js", sha256: "e299d044b5fbb3a20ca1eb8e8c808585dd92e3880b76530553e4be17a40441c9" },
]);
const COACH_TEMPLATE_IDENTITIES = Object.freeze([
  '<h1 class="coach-title">Coach.</h1>',
  '<p class="coach-line">Talk through today’s plan.</p>',
  '<div class="prompts" id="prompts">',
  '<button class="mic-button" type="button" id="mic"',
  '<div class="body">',
  '<div class="stack">',
]);
function coachVocabulary(root = ROOT) {
  const source = fs.readFileSync(path.join(root, "rebuild/m3/w7-preview/today", COACH_SOURCE), "utf8");
  const start = source.indexOf("/* COACH-COPY-START */");
  const end = source.indexOf("/* COACH-COPY-END */");
  assert(start > 0 && end > start, `COACH-BINDING FAIL: the copy region of ${COACH_SOURCE} could not be located`);
  const region = source.slice(start, end);
  const lines = [...new Set([...region.matchAll(/'((?:[^'\\\n]|\\.)*)'/g)]
    .map((m) => m[1].replace(/\\(.)/g, "$1")).filter((s) => s !== ""))];
  assert(lines.length >= 150, `COACH-BINDING FAIL: only ${lines.length} coach strings harvested`);
  const block = source.match(/export const COACH_CLASSES = Object\.freeze\(\[([\s\S]*?)\]\);/);
  assert(block, `COACH-BINDING FAIL: COACH_CLASSES could not be located in ${COACH_SOURCE}`);
  const classes = [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  assert(classes.length >= 20, `COACH-BINDING FAIL: only ${classes.length} coach classes harvested`);
  return { lines, classes, source };
}
function assertCoachBinding(approved, templateHtml, root = ROOT) {
  const extra = COACH_EXTRA_REFERENCES.map((pin) => {
    const bytes = fs.readFileSync(path.join(root, pin.file));
    assert.equal(sha256(bytes), pin.sha256, `COACH-SOURCE-PIN FAIL: ${pin.file}`);
    return bytes.toString("utf8");
  });
  const approvedText = [...readCopyReferences(root).map((entry) => entry.text), ...extra].join("\n");
  const { lines, classes } = coachVocabulary(root);
  for (const line of lines) {
    assert(approvedText.includes(line), `COACH-BINDING FAIL: "${line}" is not in the approved references`);
    assert.equal(plainCopy(line), line, `COACH-BINDING FAIL: "${line}" carries a dash`);
  }
  const css = approved.map((entry) => entry.styles).join("\n");
  for (const token of classes) {
    const selector = new RegExp("\\." + token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\w-])");
    assert(selector.test(css), `COACH-BINDING FAIL: .${token} is not in the approved stylesheets`);
  }
  const at = templateHtml.indexOf('<template id="t-coach">');
  assert(at >= 0, "COACH-BINDING FAIL: the coach screen is not in the shipped template");
  const section = templateHtml.slice(at, templateHtml.indexOf("</template>", at));
  for (const needle of COACH_TEMPLATE_IDENTITIES) {
    assert(section.includes(needle), `COACH-BINDING FAIL: the coach template lacks ${needle}`);
  }
  return { copy: lines.length, classes: classes.length };
}
/* ==== C-UI-6 COACH (end) ==== */

function assertRuntimeCopyBinding(appSource, references = readCopyReferences(),
  preview = PREVIEW_RUNTIME_COPY, adopted = ADOPTED_RUNTIME_COPY) {
  const byFile = new Map(references.map((entry) => [entry.file, entry.text]));
  for (const entry of adopted) {
    const source = byFile.get(entry.source);
    assert(source && source.includes(entry.line),
      `COPY-BINDING FAIL: adopted runtime copy missing from ${entry.source}: "${entry.line}"`);
    assert(appSource.includes(entry.line),
      `COPY-BINDING FAIL: adopted runtime copy missing from the view: "${entry.line}"`);
  }
  const approvedText = references.map((entry) => entry.text).join("\n");
  for (const line of preview) {
    assert(!approvedText.includes(line),
      `COPY-BINDING FAIL: preview runtime copy is already approved: "${line}"`);
    assert(appSource.includes(line),
      `COPY-BINDING FAIL: declared preview runtime copy missing from the view: "${line}"`);
  }
}

function assertDesignBinding(approved, templateHtml, appSource) {
  const css = [...readLegacyStructure(), ...approved].map((a) => a.styles).join("\n");
  const allowed = new Set(PREVIEW_CLASSES);
  const used = new Set([...classTokens(templateHtml), ...RUNTIME_CLASSES]);
  for (const token of used) {
    if (allowed.has(token)) continue;
    const selector = new RegExp("\\." + token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\w-])");
    assert(selector.test(css), `CLASS-BINDING FAIL: .${token} is not in the approved stylesheets`);
  }
  const approvedText = readCopyReferences().map((a) => a.text).join("\n");
  const preview = new Set(PREVIEW_COPY);
  for (const line of textOf(templateHtml)) {
    if (preview.has(line)) continue;
    assert(approvedText.includes(line), `COPY-BINDING FAIL: "${line}" is not in the approved references`);
  }
  for (const line of APPROVED_COPY) {
    assert(approvedText.includes(line), `COPY-BINDING FAIL: declared approved copy missing upstream: "${line}"`);
    assert(templateHtml.includes(line), `COPY-BINDING FAIL: declared approved copy missing from the template: "${line}"`);
  }
  if (appSource !== undefined) {
    for (const line of [...RUNTIME_COPY, ...CHECKIN_RUNTIME_COPY]) {
      assert(approvedText.includes(line), `COPY-BINDING FAIL: declared runtime copy missing upstream: "${line}"`);
      assert(appSource.includes(line), `COPY-BINDING FAIL: declared runtime copy missing from the view: "${line}"`);
    }
    assertRuntimeCopyBinding(appSource);
  }
  // The design of record's numbers are fictional. None of them may be copied.
  for (const line of textOf(templateHtml)) {
    assert(!/\d/.test(line), `NO-NUMBERS FAIL: the template carries a literal figure: "${line}"`);
  }
  /* A3 review F1: the recovery screen's whole vocabulary, harvested from the approved
     bytes rather than listed — placeholders included, which the text-node checks above
     cannot see. */
  const recovery = assertRecoveryBinding(approved, templateHtml);
  /* A4 — the first-run screens' own vocabulary, harvested from the one module
     that owns it, and the owner's no-dash rule applied to every sentence of it. */
  const setup = assertSetupBinding(approved, templateHtml);
  /* C-UI-6 - the coach screen's own vocabulary and runtime classes. */
  const coach = assertCoachBinding(approved, templateHtml);
  return { classes: used.size, recovery, setup, coach, copy: PREVIEW_COPY.length + APPROVED_COPY.length
    + (appSource === undefined ? 0 : RUNTIME_COPY.length + CHECKIN_RUNTIME_COPY.length
      + ADOPTED_RUNTIME_COPY.length + PREVIEW_RUNTIME_COPY.length) };
}

// The shipped stylesheet: the inlined pinned typefaces, then the approved bytes in order,
// then the preview's own chrome.
function composeStyles(approved, chrome, fonts, sceneAssets = readSceneAssets()) {
  const pinned = approved.map((a) => a.styles).join("\n")
    /* The source stylesheets are pinned above. At the offline build boundary their
       file URLs become the four pinned data URLs and the two pinned font faces. */
    .replace(/^@font-face[^\n]*\n?/gm, "")
    .replace(/url\(["']?assets\/plate-ink(?:-tall)?\.jpg["']?\)/g, "var(--scene-plate-ink)")
    .replace(/url\(["']?assets\/plate-dawn(?:-tall)?\.jpg["']?\)/g, "var(--scene-plate-dawn)")
    .replace(/url\(["']?assets\/grain\.png["']?\)/g, "var(--scene-grain)");
  assert(!/url\(["']?(?:fonts|assets)\//.test(pinned), "OFFLINE-ASSET-REWRITE FAIL");
  const legacy = readLegacyStructure().map((a) => a.styles).join("\n");
  return fontFaceCss(fonts) + "\n" + sceneAssetCss(sceneAssets) + "\n" + legacy + "\n" + pinned + "\n" + chrome;
}

/* THE HEADLINE VOCABULARY. Today's headline slot is driven by the engine's own
   nowModel().move.title, which the engine renders in upper case. Every one of those
   strings is a `title:` literal in rebuild/engine/*.cjs, so they are read straight out of
   the engine source at test time and the layout is measured against ALL of them — a title
   added to the engine tomorrow is covered without anyone remembering to list it here.

   This is deliberately a SUPERSET of the title-producing public modules, not only the
   ones theOneFix and policy.cjs can put on this slot. The exact directory census is
   checked before any source is opened. That refuses an unknown producer instead of
   silently omitting its title, while files outside the title closure remain unread.

   S9-TODAY-CARRY (DECISIONS:534 (b)) corrects two things the note above got wrong. A title
   is not always a quoted `title:` literal: the engine also writes template literals, and a
   decision card's title is propose()'s second positional argument - which is where the
   owner's own screen got a volume proposal's card title as its plan headline, a 45-character
   all-caps headline that had been through neither the copy gate nor the fluid-floor layout
   check (DECISIONS:533; the owner's figures are deliberately not quoted here). Captured verbatim from the source, so a template's ${...} rides along as written;
   that is the superset doing its job, not a headline anyone will read. */
const ENGINE_DIR = "rebuild/engine";
const ENGINE_TITLE_SOURCES = Object.freeze(["dates.cjs", "constants.cjs", "plan.cjs", "performed.cjs",
  "progression.cjs", "sleep.cjs", "energy.cjs", "policy.cjs", "today.cjs", "volume.cjs",
  "earn.cjs", "writers.cjs", "entered-load.cjs"]);
const ENGINE_NON_TITLE_SOURCES = Object.freeze([
  "seed.cjs", "migrate.cjs", "merge.cjs", "index.cjs", "oracle-shim.cjs",
]);
function headlineVocabulary(root = ROOT) {
  const dir = path.join(root, ENGINE_DIR);
  const expected = [...ENGINE_TITLE_SOURCES, ...ENGINE_NON_TITLE_SOURCES];
  const names = fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".cjs"))
    .map((entry) => entry.name);
  const unknown = names.filter((name) => !expected.includes(name)).sort();
  const missing = expected.filter((name) => !names.includes(name));
  assert.equal(unknown.length, 0, "HEADLINE-SOURCE-CENSUS FAIL: unknown " + unknown.join(", "));
  assert.equal(missing.length, 0, "HEADLINE-SOURCE-CENSUS FAIL: missing " + missing.join(", "));
  const out = new Set();
  for (const name of ENGINE_TITLE_SOURCES) {
    const text = fs.readFileSync(path.join(dir, name), "utf8");
    for (const pattern of [/(?:^|[\s,{(])title\s*:\s*"((?:[^"\\\n]|\\.){3,140})"/g,
      /(?:^|[\s,{(])title\s*:\s*'((?:[^'\\\n]|\\.){3,140})'/g,
      /* S9-TODAY-CARRY (DECISIONS:534 (b); P3-TODAY-COPY-DIAG section S1). A TEMPLATE
         literal is a title too, and the two patterns above could not see one. */
      /(?:^|[\s,{(])title\s*:\s*`((?:[^`\\]|\\.){3,140})`/g,
      /* And a card's title reaches this slot as propose()'s SECOND POSITIONAL ARGUMENT,
         which is where the owner's own "EARNED VOLUME" headline is written. It was
         measured by neither the copy gate nor the layout gate until this line. */
      /propose\(\s*(?:`(?:[^`\\]|\\.)*`|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')\s*,\s*`((?:[^`\\]|\\.){3,140})`/g,
      /propose\(\s*(?:`(?:[^`\\]|\\.)*`|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')\s*,\s*"((?:[^"\\\n]|\\.){3,140})"/g]) {
      for (const match of text.matchAll(pattern)) out.add(match[1].replace(/\\(.)/g, "$1").toUpperCase());
    }
  }
  assert(out.size >= 10, "HEADLINE-VOCABULARY FAIL: the engine's title literals could not be read");
  return [...out].sort((a, b) => b.length - a.length || (a < b ? -1 : 1));
}

const SOURCE = __dirname;
/* Every module that can put a word on the screen. A2 adds the gym card's view and
   its adapter, so the copy binding covers the gym screens exactly as it covers
   Today's. */
const VIEW_SOURCES = Object.freeze(["today-app.cjs", "gym-app.mjs", "gym-model.mjs", "today-model.cjs",
  /* A3 — the check-in's view and its answer model, so every word the check-in can put
     on screen is bound exactly as Today's and the gym card's are. */
  "checkin-app.mjs", "checkin-model.mjs"]);
/* A4 — Dad's first run: the six screens' view and the module that owns every word
   on them. They are their OWN list rather than two more VIEW_SOURCES entries
   because VIEW_SOURCES is pinned by name in test/design.test.cjs, which A4 does
   not own; assertSetupBinding reads these two itself and binds them just as
   tightly. today-app.cjs, which carries the landing tile's one word, is already
   a VIEW_SOURCE. */
const SETUP_SOURCES = Object.freeze(["setup-app.mjs", "setup-model.mjs", "today-app.cjs"]);
const templateHtml = () => fs.readFileSync(path.join(SOURCE, "screens.template.html"), "utf8");
const appSource = () => VIEW_SOURCES.map((name) => fs.readFileSync(path.join(SOURCE, name), "utf8")).join("\n");
const chromeCss = () => fs.readFileSync(path.join(SOURCE, "preview.css"), "utf8");
const shellHtml = () => fs.readFileSync(path.join(SOURCE, "index.shell.html"), "utf8");

module.exports = {
  ROOT, SOURCE, APPROVED, FONTS, FONT_DIR, SCENE_ASSETS, COPY_SOURCES, LEGACY_STRUCTURE,
  PREVIEW_CLASSES, RUNTIME_CLASSES, PREVIEW_COPY, APPROVED_COPY, RUNTIME_COPY,
  CHECKIN_RUNTIME_COPY, ADOPTED_RUNTIME_COPY, PREVIEW_RUNTIME_COPY, VIEW_SOURCES,
  readApproved, readCopyReferences, readLegacyStructure, readFonts, fontFaceCss, readSceneAssets, sceneAssetCss,
  assertDesignBinding, composeStyles, textOf, classTokens, sha256,
  recoverySection, recoveryVocabulary, assertRecoveryBinding, assertRuntimeCopyBinding,
  setupVocabulary, assertSetupBinding, setupSource,
  /* C-UI-6 COACH */
  COACH_SOURCE, COACH_EXTRA_REFERENCES, COACH_TEMPLATE_IDENTITIES, coachVocabulary, assertCoachBinding,
  SETUP_MODEL_SOURCE, SETUP_SOURCES,
  headlineVocabulary, ENGINE_DIR, ENGINE_TITLE_SOURCES, ENGINE_NON_TITLE_SOURCES,
  templateHtml, appSource, chromeCss, shellHtml,
};
