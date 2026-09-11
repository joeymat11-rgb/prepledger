// expected-strings.test.mjs — the pin that stops C3-HAND-PROOF.md rotting.
//
// Every string the iPhone script tells the owner to EXPECT ON SCREEN is quoted
// from a source file with a file:line citation. A screen-copy change that landed
// without the script being re-written would leave the owner comparing his phone
// against words the tree no longer contains — and a hand proof whose expected
// output is wrong is worse than none, because a FAIL would be filed against the
// phone instead of against the edit.
//
// So each row below asserts, on the tip:
//   * the quoted text is present in the named file, AND
//   * it is present ON the named line (1-based), so a citation cannot drift.
//
// It reads only public source, prints no athlete data, and writes nothing.
// Run: node --test rebuild/lanes/c/hand-proof/expected-strings.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");

// row = the hand-proof row that quotes it; id = the C3 proof-matrix witness the
// row discharges; file:line = where the words are written on the tip.
export const EXPECTED = Object.freeze([
  // ---- row 0 / row 1: the phone host, and the install ----------------------
  { row: "0", id: "W-IOS-SAFARI", file: ".github/workflows/slice-host.yml", line: 124,
    text: "SLICE HOST NO-OP" },
  { row: "1", id: "W-IOS-SAFARI", file: "rebuild/slice/pwa/pwa.cjs", line: 29,
    text: 'const APP_NAME = "Earned";' },
  { row: "1", id: "W-IOS-SAFARI", file: "rebuild/slice/pwa/pwa.cjs", line: 152,
    text: 'display: "standalone"' },
  { row: "1", id: "W-IOS-SAFARI", file: "rebuild/slice/pwa/preflight.html", line: 13,
    text: "On iPhone: in Safari, tap Share, then Add to Home Screen." },

  // ---- row 2: the weigh-in, and what "Saved" is allowed to mean -----------
  { row: "2", id: "W-KILL-AFTER-ACK", file: "rebuild/m3/w7-preview/today/today-app.cjs", line: 46,
    text: 'return "This morning — not logged yet"' },
  { row: "2", id: "W-KILL-AFTER-ACK", file: "rebuild/m3/w7-preview/today/today-app.cjs", line: 47,
    text: 'const line = "This morning ✓ "' },
  { row: "2", id: "W-KILL-AFTER-ACK", file: "rebuild/m3/w7-preview/today/today-model.cjs", line: 103,
    text: "Saved in this device's encrypted local store. It survives a reload, a restart, a reboot and a crash." },

  // ---- row 3: two sets, swipe-kill, relaunch, resume ----------------------
  { row: "3", id: "W-KILL-IDLE", file: "rebuild/m3/w7-preview/today/today-app.cjs", line: 67,
    text: 'const WORKOUT_IN_PROGRESS = "Workout in progress";' },
  { row: "3", id: "W-KILL-IDLE", file: "rebuild/m3/w7-preview/today/today-app.cjs", line: 250,
    text: 'resuming ? "Resume " + view.workout.title' },
  { row: "3", id: "W-KILL-IDLE", file: "rebuild/m3/w7-preview/today/gym-app.mjs", line: 28,
    text: "export const FINISH_WORKOUT = 'Finish this workout';" },
  { row: "3", id: "W-KILL-IDLE", file: "rebuild/m3/w7-preview/today/today-app.cjs", line: 68,
    text: 'const WORKOUT_RECORDED_TODAY = "Workout recorded";' },

  // ---- row 4: the recovery check-in ---------------------------------------
  { row: "4", id: "W-KILL-IDLE", file: "rebuild/m3/w7-preview/today/checkin-model.mjs", line: 38,
    text: "export const RECORDED_AT_PREFIX = 'Recorded today at ';" },
  { row: "4", id: "W-KILL-IDLE", file: "rebuild/m3/w7-preview/today/today-app.cjs", line: 83,
    text: 'const CHECKIN_RECORDED_TODAY = "— recorded today";' },

  // ---- row 5: the offline launch ------------------------------------------
  { row: "5", id: "W-NO-NETWORK", file: "rebuild/slice/pwa/preflight.js", line: 57,
    text: "say(true, 'offline-ready ✓'," },
  { row: "5", id: "W-NO-NETWORK", file: "rebuild/slice/pwa/preflight.js", line: 58,
    text: "files of this build are stored on this device — everything the launch needs is here." },
  { row: "5", id: "W-NO-NETWORK", file: "rebuild/slice/pwa/preflight.js", line: 63,
    text: "'Storing this build on this device: '" },
  { row: "5", id: "W-NO-NETWORK", file: "rebuild/slice/pwa/preflight.js", line: 66,
    text: "This page is not being served by its offline copy yet. Reload once, with a connection, to finish." },

  // ---- row 6: the EXPECTED day-2 refusal, until B-NTC merges ---------------
  { row: "6", id: "W-DAY-GAP", file: "rebuild/m3/w7-preview/today/today-app.cjs", line: 70,
    text: 'const WORKOUT_CANNOT_OPEN = "Today’s workout cannot open";' },
  { row: "6", id: "W-DAY-GAP", file: "rebuild/m3/w7-preview/today/today-app.cjs", line: 71,
    text: 'const WHY_WORKOUT_CANNOT_OPEN = "Why today’s workout cannot open";' },
  { row: "6", id: "W-DAY-GAP", file: "rebuild/m3/w7-preview/today/gym-app.mjs", line: 26,
    text: "Earned could not prepare today’s workout, and nothing was recorded." },
  { row: "6", id: "W-DAY-GAP", file: "rebuild/engine/performed.cjs", line: 193,
    text: "'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'" },

  // ---- row 7: erasure — first-run vs restore-required ----------------------
  { row: "7", id: "W-ERASE-ALL", file: "rebuild/m3/w6/local/local-client.mjs", line: 152,
    text: 'state: "first-run", code: "LOCAL_FIRST_RUN"' },
  { row: "7", id: "W-ERASE-PARTIAL", file: "rebuild/m3/w6/local/local-client.mjs", line: 153,
    text: 'state: "restore-required", code: "STORE_MISSING"' },
  { row: "7", id: "W-ERASE-PARTIAL", file: "rebuild/m3/w6/local/local-client.mjs", line: 154,
    text: 'state: "restore-required", code: "KEY_MISSING"' },
  { row: "7", id: "W-ERASE-PARTIAL", file: "rebuild/m3/w6/local/local-client.mjs", line: 155,
    text: 'state: "restore-required", code: "ENROLLMENT_MARKER_MISSING"' },
  { row: "7", id: "W-ERASE-PARTIAL", file: "rebuild/client/copy.cjs", line: 44,
    text: 'RESTORE_REQUIRED: "Restore required — sign in",' },
  { row: "7", id: "W-ERASE-PARTIAL", file: "rebuild/m3/w7-preview/today/today-entry.mjs", line: 199,
    text: 'status.textContent = RESTORE_REQUIRED + " (" + restoreRequired + ")"' },
  { row: "7", id: "W-ERASE-PARTIAL", file: "rebuild/m3/w6/local/today-bindings.mjs", line: 517,
    text: "export const RESTORE_REQUIRED = Client.copy.RESTORE_REQUIRED;" },
  { row: "7", id: "W-ERASE-ALL", file: "rebuild/m3/w7-preview/today/today-model.cjs", line: 101,
    text: "This device could not open its encrypted local store, so nothing can be recorded here." },

  // ---- row 8 has no screen copy of its own: it is one line per row back. ---
]);

const read = file => {
  const at = path.join(ROOT, file);
  assert.ok(fs.existsSync(at), `MISSING SOURCE: ${file} — C3-HAND-PROOF.md cites it`);
  return fs.readFileSync(at, "utf8").split(/\r?\n/);
};

const cache = new Map();
const lines = file => { if (!cache.has(file)) cache.set(file, read(file)); return cache.get(file); };

test("every expected string in C3-HAND-PROOF.md is still in the source it cites", () => {
  for (const row of EXPECTED) {
    const body = lines(row.file);
    const where = `${row.file}:${row.line} (hand-proof row ${row.row}, ${row.id})`;
    // 1. still in the file at all — the copy has not simply gone.
    assert.ok(body.some(line => line.includes(row.text)),
      `EXPECTED-STRING GONE: ${where}\n  ${JSON.stringify(row.text)}\n  The screen copy changed; re-write that row of C3-HAND-PROOF.md.`);
    // 2. still on the cited line — the citation has not drifted.
    const actual = body[row.line - 1];
    assert.ok(actual !== undefined && actual.includes(row.text),
      `EXPECTED-STRING MOVED: ${where}\n  ${JSON.stringify(row.text)}\n  found elsewhere in the file but not on that line; re-take the file:line in C3-HAND-PROOF.md.`);
  }
});

test("the hand-proof document quotes every string this test pins, and cites it", () => {
  const doc = fs.readFileSync(path.join(ROOT, "rebuild/lanes/c/C3-HAND-PROOF.md"), "utf8");
  for (const row of EXPECTED) {
    assert.ok(doc.includes(row.text),
      `UNQUOTED: ${JSON.stringify(row.text)} is pinned here but does not appear in C3-HAND-PROOF.md`);
    assert.ok(doc.includes(`${row.file}:${row.line}`),
      `UNCITED: C3-HAND-PROOF.md does not carry the citation ${row.file}:${row.line}`);
  }
});

test("every row of the script is represented, and every witness id is a real one", () => {
  const witnesses = fs.readFileSync(path.join(ROOT, "rebuild/m3/w6/test/local-witnesses.mjs"), "utf8");
  for (const row of EXPECTED)
    assert.ok(witnesses.includes(`"${row.id}"`),
      `UNKNOWN WITNESS: ${row.id} is not an id in rebuild/m3/w6/test/local-witnesses.mjs`);
  const rows = new Set(EXPECTED.map(row => row.row));
  for (const n of ["0", "1", "2", "3", "4", "5", "6", "7"])
    assert.ok(rows.has(n), `ROW ${n} of the hand proof pins no expected string`);
  console.log(`C3 HAND-PROOF EXPECTED STRINGS: ${EXPECTED.length} pinned across ${cache.size} source files, ${rows.size} rows`);
});
