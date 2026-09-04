"use strict";
/* copy.cjs — every exact face string in one place (sheet §B copy law, state copy, D7 boards, states 3/4/11/13/17/18/19/20).
   Nothing here is computed from athlete data except the parameters named in each function. */
const plural = (n, one, many) => (n === 1 ? one : many);
const COPY = {
  /* the four facts of the copy law (sheet 321–323) */
  SAVED: "Saved on this phone · not yet synced",
  SENT: "Changes sent · receiving updates",
  SYNCED: (time) => "Synced" + (time ? " " + time : ""),
  APPLIED: (at) => "Applied " + (at || "just now"),
  REJECTED: "Rejected — not included in Today's numbers",
  ANSWER_SAVED: "Answer saved on this phone · takes effect after sync",
  UNDO_SAVED: "Undo saved on this phone · takes effect after sync",
  RESOLUTION_SAVED: "Resolution saved",
  /* Today */
  FIRST_USE: "first use, no accepted plan",
  NO_PLAN: "no accepted plan",
  PLAN_IN_EFFECT: "Accepted plan in effect",
  LAST_SYNCED: (time) => "last synced " + (time || ""),
  AS_OF: (time) => "as of " + time,
  /* state 3 — save failed (loud, blocking for that action) */
  SAVE_FAILED: "This couldn't be saved on your phone. Nothing was recorded. Try again.",
  SAVE_FAILED_INVALID: (why) => "This couldn't be saved on your phone. Nothing was recorded. " + why,
  /* state 6 / 7 */
  SYNC_TO_UPDATE: "Sync to update Today.",
  UPDATE_EARNED: "Update Earned to keep Today current.",
  /* D7 boards (sheet 342–345, 695–696) */
  NO_WEIGH_IN_TODAY: "No weigh-in today.",
  KEEP_FOR_NOW: "Keep for now",
  RE_ENTRY: "Re-entry — weigh in to bring Today back",
  /* state 11 */
  SIGN_IN_TO_SYNC: "Sign in to sync",
  /* state 13 */
  LAST_SAVED_SET: (n, lift) => "Last saved: Set " + n + " of " + lift + ".",
  NO_SETS_SAVED: "No sets saved yet.",
  UNFINISHED_SET: (n) => "An unfinished Set " + n + " entry was not saved.",
  /* state 17 */
  SIGN_IN_TO_KEEP_SAVING: "Sign in to keep saving",
  DEVICE_REMOVED: "This phone was removed from your account — sign in to re-enrol it",
  RETAINED_NO_SYNC: "Saved on this phone · will not sync — sign in to re-enrol this phone",
  /* state 18 */
  RESTORE_REQUIRED: "Restore required — sign in",
  RESTORE_SEQUENCE: ["restore required", "sign in", "restoring", "restored | failed <reason>"],
  UNSYNCED_LOST: (n) => n + " unsynced " + plural(n, "entry was", "entries were") + " lost on this phone",
  UNSYNCED_UNKNOWABLE: "Earned can't tell whether unsynced entries were lost on this phone",
  /* state 19 */
  REJECTED_LINE: (n) => n + " rejected " + plural(n, "entry", "entries") + " on this phone",
  REJECTED_BLOCKED: "truth paint BLOCKED behind idempotent recovery",
  /* state 20 */
  LEASE_EXPIRED: (date) => "Connect once to keep saving — Earned can't promise this phone's entries will be accepted after " + (date || "the lease cutoff") + " without checking in.",
  LEASE_MISSING: "Connect once to keep saving — this phone has no valid offline-write lease.",
  /* state 5 */
  SUSPENDED_HISTORY: (w1, w2) => "Applied at W" + w1 + " · conflict-suspended at W" + w2,
  /* state 14 */
  SETS_COMBINED: "Sets from two devices were combined.",
  /* state 4 (sheet 379–384): parameterized, devices named by their real type, never "arrived first" */
  DEVICE_NAME: (d) => (d === "phone" ? "this phone" : d === "ipad" ? "your iPad" : d === "watch" ? "your watch" : d === "web" ? "the web app" : String(d)),
  CONFLICT: (N, lift, using) => "Earned found " + N + " current versions of " + lift + "'s plan. It is using " + using + " for now. " + (N - 1) + " alternative" + (N - 1 === 1 ? " is" : "s are") + " in History.",
  CONFLICT_ACTION_TWO: (alt) => "Use " + alt + " instead",
  CONFLICT_ACTION_MANY: (n) => "Review " + n + " alternatives",
};
module.exports = COPY;
