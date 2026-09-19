#!/usr/bin/env node
/* gen-lanes.cjs - the SIXTH generator: the PRODUCT block of today-lanes.cjs and the
 * COMPOSE block of today-app.cjs (part 2, the big cut).
 *
 * Every line this writes is an AUTHORED line of a product file, and every one of them ends
 * up in regions.json's `product` and `compose` blocks, where R2 F4's declared-text witness
 * hashes it and the build report lists it by physical line. It is a generator only in the
 * sense that the thirty-seven facade getters are mechanical: the FACADE list, the HOOK
 * list and the hook BODIES are written out below, by hand, in the one place a reviewer can
 * read them together.
 *
 * WHAT CROSSES, and it is the whole interface (measured by census.cjs on the cut's own
 * output, not designed and then checked):
 *   RELEASED -> SEALED   0 after the 111 declared replace rows. Everything the released
 *                        half used to reach goes through `facade` (read-only) or `hooks`.
 *   SEALED -> RELEASED   27 names. Five are carried by the frozen `painter` handle through
 *                        D.1's pre-ruled W families; three are re-`require`d by the sealed
 *                        module (FoodModel, SleepModel, plainOrDrop); one is bound after
 *                        the fact (sleepDraft, which does not exist yet when the factory is
 *                        called); and the remaining EIGHTEEN are INJECTED by name in the
 *                        factory signature, so every moved byte keeps its own spelling and
 *                        nothing inside a moved region is rewritten for them at all.
 *
 * Usage: node gen-lanes.cjs [--regions regions.json] [--write]
 */
"use strict";
const fs = require("fs");
const path = require("path");

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : d; };
const REGIONS = opt("regions", path.join(__dirname, "regions.json"));
const WRITE = argv.includes("--write");
const table = JSON.parse(fs.readFileSync(REGIONS, "utf8"));

/* ---- THE EIGHTEEN INJECTED NAMES, in the order the factory signature lists them -------
 * Six are the page's own released machinery and twelve are COPY CONSTANTS. The twelve are
 * injected rather than re-declared for S-R13's reason: a sealed lane module must hold zero
 * athlete-facing string literals, and injection is how a moved byte can go on naming a
 * sentence it does not own. */
const INJECTED = [
  "phone", "status", "tell", "athleteStateFailureCopy", "reasonOf", "sleepTyped",
  "FOOD_REASON", "FOOD_REFUSAL_COPY", "FOOD_REFUSED", "FOOD_REFUSED_ACTION",
  "SLEEP_CHECKIN_CHANGED", "SLEEP_KEPT", "SLEEP_NIGHT_CHANGED", "SLEEP_NOTHING_RECORDED",
  "SLEEP_NOT_SAVED", "SLEEP_REFUSAL_COPY", "SLEEP_ROLLOVER", "SLEEP_UNCERTAIN",
];

/* ---- THE FACADE: read-only, and every entry returns sealed state -----------------------
 * The list is the RELEASED -> SEALED read rows of the census, and nothing else is on it.
 * `call` marks the four names spec B.3 calls PURE READS: they are calls in the census and
 * they change nothing, so they are getters here rather than callbacks. */
const FACADE = [
  ["adoptionSettled"], ["checkInKit"], ["checkInKitLoading"], ["checkInLive"], ["checkin"],
  ["checkinSummary", "call"], ["firstRun", "call"], ["foodLane"], ["foodLaneFailure"],
  ["foodOpening"], ["foodReadBack"], ["foodSaving"], ["importAdmitted"], ["importScreen"],
  ["measureScreen"], ["ready"], ["session", "call"], ["setup"], ["setupFirst"],
  ["sleepAck"], ["sleepBusy"], ["sleepCheckInDay"], ["sleepCheckInFailed"],
  ["sleepCheckInPending"], ["sleepCheckInRow"], ["sleepCheckInViewPending"],
  ["sleepCorrecting"], ["sleepErrorText"], ["sleepLane"], ["sleepLaneFailure"],
  ["sleepNightDate", "call"], ["sleepOpening"], ["sleepReadBack"], ["sleepSaving"],
  ["sleepUnknown"], ["workout"], ["workoutRebinding"],
];

/* ---- THE CALLBACK TABLE: the only way released code changes anything in here -----------
 * Three kinds of entry, and the kind is written beside each so a reviewer can tell them
 * apart without reading the body:
 *   PASS    a moved function, called with the same arguments it takes today
 *   BOOT    one of S-R21's five boot statements, moved into the seal as a call
 *   WRITE   one of B.5's RELEASED-ASSIGNS-A-SEALED-BINDING rows: the seal mints the value
 *           and assigns it, which is the whole point of the class
 */
const HOOKS = [
  ["PASS", "armAdoptionGate:      () => armAdoptionGate(),"],
  ["PASS", "canAdoptAthleteState: () => canAdoptAthleteState(),"],
  ["PASS", "openFoodLane:         () => openFoodLane(),"],
  ["PASS", "openSleepLane:        () => openSleepLane(),"],
  ["PASS", "readSleepCheckIn:     (date, force) => readSleepCheckIn(date, force),"],
  ["PASS", "reboundCheckIn:       (origin) => reboundCheckIn(origin),"],
  ["PASS", "sleepClockCheck:      () => sleepClockCheck(),"],
  ["PASS", "sleepOpsFor:          (date) => sleepOpsFor(date),"],
  ["PASS", "sleepToday:           () => sleepToday(),"],
  ["BOOT", "/* S-R21's five boot statements. Each keeps the position it occupies today"],
  ["BOOT", "   (spec B.3's boot order), because everything inside this factory runs at the"],
  ["BOOT", "   ONE point the factory is called and three of these run before the first"],
  ["BOOT", "   paint and two after it. */"],
  ["BOOT", "bootFoodDays:    () => { if (foodLane && typeof model.setFoodDays === \"function\") model.setFoodDays(foodLane); },"],
  ["BOOT", "bootSleepNights: () => { if (sleepLane && typeof model.setSleepNights === \"function\") model.setSleepNights(sleepLane); },"],
  ["BOOT", "bootCheckInKit:  () => { if (sleepLane) loadCheckInKit(); },"],
  ["BOOT", "bootAdoptionGate: () => { willAdopt = canAdoptAthleteState(); if (willAdopt) armAdoptionGate(); },"],
  ["BOOT", "bootSettleAdoption: () => { ready = settleAdoption(willAdopt ? adoptAthleteState() : Promise.resolve(), willAdopt); return ready; },"],
  ["WRITE", "/* B.5's assignment class. The seal mints the promise or sets the flag; the"],
  ["WRITE", "   released half keeps its listener, its guard and its repaint and loses the"],
  ["WRITE", "   assignment, so no released line can name a binding declared in here. */"],
  ["WRITE", "mintMeasureScreen: (Screen) => { if (!measureScreen) measureScreen = Screen.createMeasureScreen(measureDeps()); return measureScreen; },"],
  ["WRITE", "mintImportScreen:  (Screen) => { if (!importScreen) importScreen = Screen.createImportScreen(importDeps()); return importScreen; },"],
  ["WRITE", "retryFoodRead:     () => { foodSaving = retryFoodRead(); return foodSaving; },"],
  ["WRITE", "recordIntake:      (save, cal, pro, error) => { foodSaving = recordIntake(save, cal, pro, error); return foodSaving; },"],
  ["WRITE", "retrySleepRead:    () => { sleepSaving = retrySleepRead(); return sleepSaving; },"],
  ["WRITE", "recordSleep:       (map) => { sleepSaving = recordSleep(map); return sleepSaving; },"],
  ["WRITE", "sleepCorrect:      (on) => { sleepCorrecting = on; },"],
  ["WRITE", "forgetCheckInRead: () => { sleepCheckInDay = null; sleepCheckInPending = null; },"],
  ["WRITE", "settleAdoption:    (adopting) => { ready = settleAdoption(adopting ? adoptAthleteState() : Promise.resolve(), adopting); return ready; },"],
  ["WRITE", "/* SEAM 9a: eight assignments in one gesture, and the raw field value is all"],
  ["WRITE", "   that crosses. SEAM 9b is the same four with no argument at all. */"],
  ["WRITE", "sleepNightChosen:  (raw) => {"],
  ["WRITE", "  sleepNightChoice = raw;"],
  ["WRITE", "  sleepRollover = null;"],
  ["WRITE", "  sleepOpenedDay = sleepToday(); sleepOpenedNight = sleepNightDate();"],
  ["WRITE", "  sleepAck = null; sleepReadBack = null; sleepCorrecting = false; sleepErrorText = \"\";"],
  ["WRITE", "},"],
  ["WRITE", "keepNight:         () => {"],
  ["WRITE", "  sleepNightChoice = sleepRollover || sleepNightDate();"],
  ["WRITE", "  sleepRollover = null;"],
  ["WRITE", "  sleepOpenedDay = sleepToday(); sleepOpenedNight = sleepNightDate();"],
  ["WRITE", "},"],
  ["WRITE", "/* R2 BLOCKING-1: the seal mints the read handle and assigns it; the paint that"],
  ["WRITE", "   follows it is the RELEASED half's own closure, handed in and not moved. */"],
  ["WRITE", "readSleepCheckInView: (date, paint) => {"],
  ["WRITE", "  sleepCheckInViewPending = Promise.all([loadCheckInKit(), readSleepCheckIn(date, true)]).then(paint);"],
  ["WRITE", "  return sleepCheckInViewPending;"],
  ["WRITE", "},"],
  ["WRITE", "/* The screen's own transient draft is a released object this file mutates in"],
  ["WRITE", "   place and never reassigns, so the seal holds the SAME object and sees every"],
  ["WRITE", "   keystroke. It is handed over after it exists, because the factory is composed"],
  ["WRITE", "   above it: the boot statement at :422 must run where it runs today. */"],
  ["WRITE", "bindSleepDraft:    (draft) => { sleepDraft = draft; },"],
];

function indent(n, s) { return " ".repeat(n) + s; }

const head = [
  '"use strict";',
  "/* today-lanes.cjs - THE WRITERS OF THE TODAY PAGE, SEALED (spec B.1 to B.8;",
  " * DECISIONS:550 S-R1 and S-R17, :562 S-R19 to S-R25, :574, :584).",
  " *",
  " * Every function on this page that can put a row of the athlete's FOOD, SLEEP or",
  " * CHECK-IN log on disk lives in this file, together with the state it closes over. They",
  " * were CUT OUT of today-app.cjs by rebuild/lanes/c/today-split-spike/cut.cjs, region by",
  " * region, byte for byte: 34 move regions, 679 lines. Their bytes were compared against a",
  " * sha256 recorded at TWO named refs BEFORE anything was written (S-R19), and the only",
  " * substitutions are the forty declared rows of D.1's W1, W2, W3, W4 and W9 families,",
  " * every one of them a paint-handle rewrite.",
  " *",
  " * THE ONLY AUTHORED LINES ARE THIS BANNER, THE THREE REQUIRES, THE FACTORY LINE BELOW,",
  " * THE FOUR DECLARATIONS AFTER IT AND THE RETURN BLOCK AT THE END, and all of them are",
  " * declared in regions.json's product block, not invented by the instrument.",
  " *",
  " * WHAT CROSSES BACK, and it is the whole interface: a FACADE of thirty-seven read-only",
  " * getters, a callback table of twenty-eight, and nothing else. After the cut NO released",
  " * line assigns a binding declared in here, which census.cjs prints as a class count of",
  " * ZERO over this build's own output (spec B.5's acceptance test, H.2 STOP 11).",
  " *",
  " * WHAT IS NOT IN HERE, said plainly, because a reader will look for it.",
  " *  - SPEC B.6's OUTCOME TYPE IS NOT BUILT. recordSleep still composes its eleven",
  " *    sentences and recordIntake its two, from constants this factory is HANDED rather",
  " *    than holding: twelve copy constants arrive by name in the signature below, so this",
  " *    file carries zero string literals of its own and every copy byte stayed in the",
  " *    released view where C-UI-7 edits it. Turning them into outcomes is a statement",
  " *    rewrite inside three moved regions that D.1 does not declare, which DECISIONS:584",
  " *    rules a STOP; it is reported in the build report and it is its own ticket.",
  " *  - THE ONE-HANDOFF RULE IS NOT BUILT. The released today-app.cjs still names `model`.",
  " *  - The runtime gesture guard of E.6 is not in this round.",
  " */",
  'const FoodModel = require("./food-model.cjs");',
  'const SleepModel = require("./sleep-model.cjs");',
  'const { plainOrDrop } = require("./plain-copy.cjs");',
];

const open = [
  "function createTodayLanes({ doc, model, options, painter,",
  "    " + INJECTED.slice(0, 6).join(", ") + ",",
  "    " + INJECTED.slice(6, 12).join(", ") + ",",
  "    " + INJECTED.slice(12).join(", ") + " }) {",
  "  /* Three bindings that are NOT moved bytes. `sleepDraft` is bound after the fact",
  "     (hooks.bindSleepDraft) because the released object does not exist yet when this",
  "     factory is called; `willAdopt` and `ready` move to factory scope because the two",
  "     statements that used to declare them are now calls (spec B.3 consequences 2 and 3,",
  "     which is why S-R21 gave the boot statements a kind of their own). */",
  "  let sleepDraft = null;",
  "  let willAdopt = null;",
  "  let ready = null;",
];

const close = [];
close.push("  /* THE INTERFACE, frozen. `facade` is READ-ONLY: every entry returns sealed state");
close.push("     and none of them changes it. `hooks` is the only way released code changes");
close.push("     anything in here. The two objects are separate on purpose, so that a later");
close.push("     ticket adding a getter cannot quietly add a setter beside it.");
close.push("");
close.push("     A RECORDED LAXITY, in the words S-R29 uses of the gym card's twin: several of");
close.push("     these getters hand back LIVE objects (the lanes, the read-backs, the two");
close.push("     screens), so released code can still change sealed read state without a hook.");
close.push("     That adds no power today, because before the cut the released half held those");
close.push("     same objects directly; it is closed by detached frozen copies in the ticket");
close.push("     that seals the writers' own decisions, and until then this comment says what");
close.push("     is true rather than what is wished. */");
close.push("  return Object.freeze({");
close.push("    facade: Object.freeze({");
for (const [name, kind] of FACADE) {
  close.push(indent(6, name + ": () => " + name + (kind === "call" ? "()" : "") + ","));
}
close.push("    }),");
close.push("    hooks: Object.freeze({");
for (const [, line] of HOOKS) close.push(indent(6, line));
close.push("    }),");
close.push("  });");
close.push("}");
close.push("");
close.push("module.exports = { createTodayLanes };");

/* ---- the released half's own composition lines ---------------------------------------- */
const compose = {
  why: "spec B.3's composition. The three interface names were chosen by measurement " +
    "(S-R23) and capture.cjs measures them at zero occurrences in code position on this " +
    "build's own output.",
  after: 'const SleepModel = require("./sleep-model.cjs");',
  afterLines: [
    "/* THE SPLIT (spec B.1 to B.8, DECISIONS:550 S-R1). Every function that can put a row",
    "   of the athlete's food, sleep or check-in log on disk is sealed in today-lanes.cjs;",
    "   what comes back is two frozen objects. The require is at module level, once, and",
    "   not inside the mount. */",
    'const { createTodayLanes } = require("./today-lanes.cjs");',
  ],
  at: "TA-S01",
  insert: [
    "  /* THE SPLIT (spec B.3 and B.4). What crosses is three frozen objects and nothing",
    "     else: `painter`, the paint handle, which is the ONLY thing the seal can reach back",
    "     through and which can do nothing but paint; `facade`, the read-only view of the",
    "     sealed state; and `hooks`, the callback table, which is the only way this file",
    "     changes anything in there. The paint handle's five entries are the five names the",
    "     census found crossing SEALED -> RELEASED that D.1 declares a rewrite for; the",
    "     eighteen names handed in below are the ones it does not, and they are injected so",
    "     that every moved byte keeps its own spelling. `sleepTyped` goes in wrapped because",
    "     it is a const declared further down this file and would be in its temporal dead",
    "     zone here; the wrapper resolves it when it is called, which is after a gesture. */",
    "  const painter = Object.freeze({",
    "    repaint: (name, focus) => render(name, focus),",
    "    screenNow: () => screen,",
    "    token: () => mountToken,",
    "    clearDraft: () => clearSleepDraft(),",
    "    paintTodayEntry: () => paintTodayEntry(),",
    "  });",
    "  const { facade, hooks } = createTodayLanes({ doc, model, options, painter,",
    "    phone, status, tell, athleteStateFailureCopy, reasonOf,",
    "    sleepTyped: (...a) => sleepTyped(...a),",
    "    " + INJECTED.slice(6, 12).join(", ") + ",",
    "    " + INJECTED.slice(12).join(", ") + " });",
  ],
};

table.product = table.product || {};
table.product["today-lanes.cjs"] = {
  why: "spec B.1 to B.8. Every line here is AUTHORED and is listed in the build report by " +
    "file and physical line; everything between them is moved bytes.",
  head, open, close,
};
table.compose = table.compose || {};
table.compose["today-app.cjs"] = compose;

console.log("PRODUCT today-lanes.cjs: head " + head.length + " + open " + open.length +
  " + close " + close.length + " = " + (head.length + open.length + close.length) +
  " authored lines");
console.log("  facade getters: " + FACADE.length + "  hooks entries: " +
  HOOKS.filter(([, l]) => /^[A-Za-z]/.test(l)).length +
  " (" + HOOKS.filter(([k]) => k === "PASS").length + " pass, " +
  HOOKS.filter(([k, l]) => k === "BOOT" && /^[A-Za-z]/.test(l)).length + " boot, " +
  HOOKS.filter(([k, l]) => k === "WRITE" && /^[A-Za-z]/.test(l)).length + " write)");
console.log("  injected names in the factory signature: " + INJECTED.length);
console.log("COMPOSE today-app.cjs: after " + compose.afterLines.length + " + insert " +
  compose.insert.length + " = " + (compose.afterLines.length + compose.insert.length) + " authored lines");
if (WRITE) {
  fs.writeFileSync(REGIONS, JSON.stringify(table, null, 1) + "\n");
  console.log("  written into " + REGIONS + ". Re-take the declared witness: gen-witness.cjs --declared --write.");
} else {
  console.log("  (dry run: pass --write)");
}
