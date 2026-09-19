#!/usr/bin/env node
/* gen-regions.cjs - a ONE-SHOT generator that turns the line ranges the spec's B.2, B.8,
   B.9 and F.1 give at the chain tip into the CONTENT-ANCHORED regions.json the spike uses.
   It is kept beside the table so a later round can re-derive the table rather than hand-edit
   it. It is not part of the measurement: cut.cjs reads regions.json and never this file.

   Usage: node gen-regions.cjs <worktree root> > regions.json                              */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = process.argv[2];
if (!ROOT) { console.error("usage: gen-regions.cjs <worktree root>"); process.exit(2); }
const TODAY = "rebuild/m3/w7-preview/today";

/* dest: the module the region lands in. kind:
     move  - the region leaves the released file whole and lands in the sealed module
     seam  - a region a draw and a write SHARE. The spike does NOT move it: it leaves it
             released so the crossing census names it mechanically (S-R17 (c), (g)).      */
const TABLE = {
  "today-app.cjs": [
    ["TA-S01", 362, 365, "move", "B.2 r36 + R2 NOTE-4: workout state and session()"],
    ["TA-S02", 370, 384, "move", "B.2 r36 + R2 NOTE-4: checkin, setup, installation, firstRun(). Starts at the declaration, not at its comment block :366-:369, so no anchor in this table carries a U+2013 or U+2014"],
    ["TA-S03", 392, 392, "move", "B.2 r38: setupFirst (one-handoff rule)"],
    ["TA-S04", 410, 421, "move", "B.2 r36: the food lane state"],
    ["TA-S05", 422, 422, "move", "B.2 r1: model.setFoodDays(foodLane)"],
    ["TA-S06", 432, 441, "move", "B.2 r36: the sleep lane state"],
    ["TA-S07", 454, 454, "move", "B.2 r36: sleepBusy"],
    ["TA-S08", 459, 464, "move", "B.2 r36: night choice, rollover guard, error text"],
    ["TA-S09", 465, 474, "move", "B.2 r36: sleepUnknown and the check-in read cache"],
    ["TA-S10", 482, 482, "move", "B.2 r2: model.setSleepNights(sleepLane)"],
    ["TA-S11", 484, 503, "move", "B.2 r3: sleepEntryFor"],
    ["TA-S12", 505, 508, "move", "B.2 r4: sleepRowsMatter"],
    ["TA-S13", 510, 541, "move", "B.2 r5: openSleepLane"],
    ["TA-S14", 543, 555, "move", "B.2 r6: checkInKit, checkInKitLoading, checkInLive"],
    ["TA-S15", 556, 566, "move", "B.2 r7: loadCheckInKit"],
    ["TA-S16", 567, 567, "move", "B.2 r8: loadCheckInKit() boot statement"],
    ["TA-S17", 569, 591, "move", "B.2 r9: foodEntryFor (before openFoodLane; R2 NOTE-6)"],
    ["TA-S18", 593, 618, "move", "B.2 r10: openFoodLane"],
    ["TA-S19", 628, 643, "move", "B.2 r11: measureScreen, measureState, measureDeps"],
    ["TA-S20", 688, 701, "move", "B.2 r13: importScreen, importAdmitted, importDeps"],
    ["TA-S21", 767, 767, "move", "B.5: adoptionSettled"],
    ["TA-S22", 775, 790, "move", "B.5: settleAdoption"],
    ["TA-S23", 1278, 1319, "move", "B.2 r17 / SEAM 2: recordIntake moves whole; its paint lines are seam rows"],
    ["TA-S24", 1324, 1334, "move", "B.2 r18: retryFoodRead"],
    ["TA-S25", 1373, 1376, "move", "B.2 r20: sleepToday, sleepNightDate"],
    ["TA-S26", 1384, 1393, "move", "B.2 r21: sleepClockCheck (R2 BLOCKING-6 candidate)"],
    ["TA-S27", 1410, 1427, "move", "B.2 r19: readSleepCheckIn"],
    ["TA-S28", 1450, 1453, "move", "B.2 r22: sleepOpsFor"],
    ["TA-S29", 1727, 1756, "move", "B.2 r23: retrySleepRead"],
    ["TA-S30", 1807, 1930, "move", "B.2 r24 / SEAM 3: recordSleep"],
    ["TA-S31", 1935, 1948, "move", "B.2 r25: sameNight, committedSleepAttempt"],
    ["TA-S32", 1964, 2011, "move", "B.2 r26: reboundCheckIn"],
    ["TA-S33", 2018, 2036, "move", "B.2 r27: carryCheckInDraft"],
    ["TA-S34", 2048, 2092, "move", "B.2 r28: workoutRebindQueued, rebindWorkout"],
    ["TA-S35", 2430, 2441, "move", "B.2 r32: canAdoptAthleteState, armAdoptionGate, willAdopt"],
    ["TA-S36", 2482, 2489, "move", "B.2 r33: athleteBasisState"],
    ["TA-S37", 2490, 2546, "move", "B.2 r34: adoptAthleteState"],
    ["TA-S38", 2550, 2550, "move", "B.2 r35: ready = settleAdoption(...)"],

    ["TA-M01", 650, 652, "seam", "B.2 r12: renderMeasure's dynamic import and cache write"],
    ["TA-M02", 709, 711, "seam", "B.2 r14: renderImport's dynamic import and cache write"],
    ["TA-M03", 718, 719, "seam", "R2 BLOCKING-8: renderImport drives the sealed import screen"],
    ["TA-M04", 954, 954, "seam", "SEAM 4: workout.recover() in the primary handler"],
    ["TA-M05", 1071, 1073, "seam", "SEAM 1: the weigh-in submit's write half"],
    ["TA-M06", 1406, 1407, "seam", "SEAM 8: sleepCheckInFor reaches the injected check-in entry"],
    ["TA-M07", 1435, 1435, "seam", "SEAM 11 (R2 BLOCKING-1): renderSleepCheckIn mints the read handle"],
    ["TA-M08", 1539, 1542, "seam", "SEAM 9a: the sleep date handler's eight assignments"],
    ["TA-M09", 1560, 1562, "seam", "SEAM 9b: the keep-night handler's four assignments"],
    ["TA-M10", 2297, 2297, "seam", "SEAM 10: the check-in cache clear in the mount-invalidation block"],
    ["TA-M11", 2300, 2336, "seam", "SEAM 5: the router's setup branch body"],
    ["TA-M12", 2349, 2351, "seam", "SEAM 6, range corrected by R2 BLOCKING-5 (branch is :2343-:2354)"],
    ["TA-M13", 2364, 2365, "seam", "SEAM 7, range corrected by R2 BLOCKING-5 (branch is :2359-:2374)"],
    ["TA-M14", 2552, 2595, "seam", "B.2 r37 / B.7: the returned api literal"],
  ],
  "gym-app.mjs": [
    ["GA-S01", 123, 125, "move", "B.9: settingsLane, settingsOpening, settingsSaving"],
    ["GA-S02", 131, 140, "move", "B.9: the read cache comment, settingsRead, settingsInFlight, settingsReading"],
    ["GA-S03", 142, 156, "move", "B.9: startSettingsRead"],
    ["GA-S04", 158, 170, "move", "B.9: openSettingsLane"],
    ["GA-M01", 286, 318, "seam", "SEAM G1: recordSettings"],
    ["GA-M02", 419, 419, "seam", "B.9: model.logSet in a released control handler"],
    ["GA-M03", 444, 444, "seam", "B.9: model.finish"],
    ["GA-M04", 498, 498, "seam", "B.9: model.forget"],
    ["GA-M05", 505, 505, "seam", "B.9: model.undo"],
    ["GA-M06", 546, 546, "seam", "B.9 / R2 BLOCKING-3: model.start(), reached from paint()"],
  ],
  "today-model.cjs": [
    ["TM-S01", 365, 374, "move", "F.1: ALREADY_RECORDED, FORM_MIN, FORM_MAX, OUT_OF_RANGE"],
    ["TM-S02", 378, 398, "move", "F.1: weighIn"],
    ["TM-S03", 401, 405, "move", "F.1: reopen"],
  ],
};

const DEST = {
  "today-app.cjs": "today-lanes.cjs",
  "gym-app.mjs": "gym-settings-lane.mjs",
  "today-model.cjs": "today-readings.cjs",
};

function anchorFor(lines, n) {
  const text = lines[n - 1];
  let nth = 0;
  for (let i = 0; i < n; i += 1) if (lines[i] === text) nth += 1;
  let total = 0;
  for (const l of lines) if (l === text) total += 1;
  return { text, nth, total };
}
/* The LAST line is anchored by its occurrence counted FORWARD FROM THE FIRST LINE, which
   is what makes "  }" usable as an anchor. */
function lastAnchorFrom(lines, a, b) {
  const text = lines[b - 1];
  let nthFrom = 0;
  for (let i = a - 1; i < b; i += 1) if (lines[i] === text) nthFrom += 1;
  return { text, nthFrom };
}

const out = { generatedFrom: "chain tip", today: TODAY, dest: DEST, files: {} };
for (const [file, rows] of Object.entries(TABLE)) {
  const src = fs.readFileSync(path.join(ROOT, TODAY, file), "utf8");
  const lines = src.split("\n");
  out.files[file] = rows.map(([id, a, b, kind, note]) => {
    const first = anchorFor(lines, a);
    const last = lastAnchorFrom(lines, a, b);
    if (first.total !== 1) throw new Error("ambiguous first anchor for " + id);
    return {
      id, kind, dest: kind === "move" ? DEST[file] : null, note,
      tipLines: [a, b],
      first: { text: first.text, nth: first.nth },
      last: { text: last.text, nthFrom: last.nthFrom },
    };
  });
}
process.stdout.write(JSON.stringify(out, null, 1) + "\n");
