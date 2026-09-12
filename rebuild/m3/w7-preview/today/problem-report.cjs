"use strict";

/* problem-report.cjs - the diagnostic the "Report a problem" control copies.

   DECISIONS:140 (3), REPORT-A-PROBLEM-BRIEF.md section 2. One pure function over a
   plain description of what the page is doing right now. It reads no store, opens no
   lane, writes nothing, and it is the ONLY place the block's shape is decided, so a
   field added, renamed or reordered is a change here and nowhere else.

   WHAT IT WILL NEVER CARRY, and why that is a property of the code rather than a
   promise: this function is given a `state` with eight named members and can print
   nothing else. There is no reading, no set, no check-in answer, no exercise name, no
   athlete label, no operation id and no payload in its argument, so none of them can
   reach the block however the caller is wired. test/problem.test.mjs builds one over a
   REAL local-era store holding a weigh-in, a workout and a first run, and asserts every
   stored value is absent from the text.

   THE DEVICE ID IS TRUNCATED TO 8 HEX and the full 32 are refused (brief section 2).
   Eight are not health data, carry no name and no value, and are what tells two devices
   in the same pair of hands apart - the one thing a bug report has to do. The other 24
   are this installation's enrolment identity and buy a bug report nothing. */

const { plainOrDrop } = require("./plain-copy.cjs");

/* THE BUILD ID, INJECTED AT BUILD TIME. build.mjs computes sha256 over the pinned input
   inventory (each input's path and its own sha256, in a fixed order) and replaces this
   one literal in the bundle it is about to write, refusing the build if it is not there
   exactly once. The precedent is A5's cache name over its precache manifest
   (DECISIONS:101); the 12-hex truncation is this brief's own. Unbuilt - a Node test, a
   module loaded straight off disk - it reads as what it is. */
const BUILD_PLACEHOLDER = "earned-notinjected";
const BUILD = BUILD_PLACEHOLDER;

/* The eight fields of brief section 2, in the order the block prints them. */
const FIELDS = Object.freeze(["screen", "lane open", "enrolment", "offline-ready",
  "build", "device", "user agent", "at"]);
/* The four enrolment answers. Anything else is a state this page cannot observe, and
   an unobserved state is reported as unknown rather than guessed at. */
const ENROLMENT = Object.freeze(["first-run", "enrolled", "restore-required", "no-store"]);
/* The three lanes boot() can hand the view, in the order boot opens them. */
const LANES = Object.freeze(["workout", "checkin", "setup"]);
const OFFLINE = Object.freeze(["ready", "not-ready", "unknown"]);
const NONE = "none";
const UNKNOWN = "unknown";

/* rebuild/client's own state-18 sentence begins with these two words
   (rebuild/client/copy.cjs RESTORE_REQUIRED, carried to the page by
   gym-host.mjs). The page cannot import it here - today-app.cjs is CommonJS and
   the carrier is an ES module - so the words are declared, and
   test/problem.test.mjs requires rebuild/client/copy.cjs and asserts the real
   sentence still starts with them. A change upstream fails that test rather than
   drifting past it. */
const RESTORE_MARK = "Restore required";

const HEX = /^[0-9a-f]+$/;
const text = (value, where) => plainOrDrop(value === null || value === undefined ? "" : String(value),
  where, "");

/* The first 8 hex of an installation's device id, or `none`.

   This device's id is minted once at random and kept beside the store key
   (local-keys.mjs, DECISIONS:111); it is spelled `device-` followed by 32 hex
   (adapter.test.mjs asserts that shape), and a lease names the same string. Either
   spelling is accepted here and only the hex is read.

   A value that is not hex, or carries fewer than 8 of them, is NOT truncated into
   something that looks like an id: it is reported as none. A fabricated device prefix
   would be worse than an absent one, because the whole point of the field is telling
   two real devices apart. */
function devicePrefix(id) {
  if (typeof id !== "string") return NONE;
  const clean = id.trim().toLowerCase().replace(/^device-/, "");
  if (clean.length < 8 || !HEX.test(clean)) return NONE;
  return "device-" + clean.slice(0, 8);
}

/* Which lanes the page actually holds, in boot's own order, or `none`. */
function lanesOpen(lanes) {
  const held = LANES.filter((name) => !!(lanes && lanes[name]));
  return held.length ? held.join(", ") : NONE;
}

/* The four answers of brief section 2, decided from what the PAGE can observe and
   nothing else:
     restore-required  rebuild/client refused this installation with state 18, which
                       the page has already said on its own status line;
     no-store          there is no first-run lane at all, or it has no durable host;
     first-run         the lane is open and the record holds no first-run operation;
     enrolled          the lane is open and it does.
   Order matters: a state-18 device has no lane either, so the refusal is read first
   or it would be reported as a device without a store. */
function enrolmentOf({ restoreNote, setup } = {}) {
  if (typeof restoreNote === "string" && restoreNote.trim().startsWith(RESTORE_MARK)) {
    return "restore-required";
  }
  if (!setup || setup.durable !== true) return "no-store";
  return setup.enrolled === true ? "enrolled" : "first-run";
}

/* The A5 preflight's own answer where there is one to have. This page is not the PWA
   shell: it registers no service worker, so on the preview it is `unknown`, which is
   the truth rather than a `no` the page has not earned. */
function offlineReadinessOf(view) {
  const workers = view && view.navigator ? view.navigator.serviceWorker : null;
  if (!workers) return UNKNOWN;
  return workers.controller ? "ready" : "not-ready";
}

/* The same triple an operation carries - local_date, local_time, utc_offset - written
   as one field. Not the op's: this is when the report was made, and no operation is
   read to make it. */
const two = (n) => String(n).padStart(2, "0");
function stampOf(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return UNKNOWN;
  const day = date.getFullYear() + "-" + two(date.getMonth() + 1) + "-" + two(date.getDate());
  const time = two(date.getHours()) + ":" + two(date.getMinutes()) + ":" + two(date.getSeconds());
  const minutes = -date.getTimezoneOffset();
  const size = Math.abs(minutes);
  const offset = (minutes < 0 ? "-" : "+") + two(Math.floor(size / 60)) + ":" + two(size % 60);
  return day + " " + time + " " + offset;
}

/* THE BLOCK. Eight lines, `field: value`, in FIELDS order, and nothing else. Every
   value goes through the page's render boundary (DECISIONS:114 (1) / :121) on the way,
   so a user agent string carrying an em dash is normalised like any other text the
   athlete can see - the block is shown in a text box on the screen as well as copied. */
function buildProblemReport(state = {}) {
  const values = {
    "screen": text(state.screen, "problem-screen") || UNKNOWN,
    "lane open": lanesOpen(state.lanes),
    "enrolment": ENROLMENT.includes(state.enrolment) ? state.enrolment : UNKNOWN,
    "offline-ready": OFFLINE.includes(state.offlineReady) ? state.offlineReady : UNKNOWN,
    "build": BUILD,
    "device": devicePrefix(state.device),
    "user agent": text(state.userAgent, "problem-user-agent") || UNKNOWN,
    "at": state.at instanceof Date ? stampOf(state.at) : (text(state.at, "problem-at") || UNKNOWN),
  };
  return FIELDS.map((field) => field + ": " + values[field]).join("\n");
}

module.exports = { buildProblemReport, devicePrefix, lanesOpen, enrolmentOf,
  offlineReadinessOf, stampOf, FIELDS, ENROLMENT, LANES, OFFLINE,
  BUILD, BUILD_PLACEHOLDER, RESTORE_MARK, NONE, UNKNOWN };
