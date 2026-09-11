// Page entry for the Today screen. It opens this device's durable store, mounts
// the approved-design view over the real adapter and, if anything at all goes
// wrong, says so — naming the cause — without painting a number.
//
// ONE STORE, ONE DEVICE (C4b/C4c, DECISIONS:106). The morning weigh-in, the
// workout and the recovery check-in are THREE WRITE PATHS into ONE sealed
// generation of this device's local era (rebuild/m3/w6/local/): the reading
// through the local client's execute(), the workout through composeWorkoutHost
// over the same client's hostBindings(), the check-in through a durable public
// client over its own bindings with the page's own command producer.
// They were three generations because one generation carries one lease with one
// schema_version — but rebuild/client gates only a workout on that schema
// (index.cjs:206), so the reading rides the era's lease into the same
// generation, and the era's lease IS schema 2, which is what the check-in's
// producer-injected command is stamped. There is a test:
// rebuild/m3/w6/test/local-schema-probe.mjs. Nothing of record lives in
// localStorage, and nothing here mints a key, signs a lease or asserts an
// enrolment.
import app from "./today-app.cjs";
import TodayModel from "./today-model.cjs";
import { createGymHost, openTodayHosts, RESTORE_REQUIRED } from "./gym-host.mjs";
import { createReadingHost } from "./reading-host.mjs";
import { createGymModel } from "./gym-model.mjs";
import { mountGym, newGymDraft } from "./gym-app.mjs";
import { createCheckInHost, PROFILE as CHECKIN_PROFILE } from "./checkin-host.mjs";
import CheckInCommands from "./checkin-commands.cjs";
import { createCheckInModel } from "./checkin-model.mjs";
import { mountCheckIn } from "./checkin-app.mjs";
// The render boundary for the owner's no-dashes rule (DECISIONS:114 (1)).
import PlainCopy from "./plain-copy.cjs";

const { plainCopy, plainOrDrop } = PlainCopy;
const { createCheckInCommands } = CheckInCommands;

const { mountToday, createTodayModel } = app;

/* A3 — the recovery check-in entry, assembled exactly as the workout entry is: the
   durable lane, the answer model over it, and an open() that mounts the screen. The
   summary Today reads is the DURABLE fact, refreshed from disk, never a flag. */
export async function createCheckInEntry(model, options = {}) {
  const day = model.today;
  let host = null;
  /* ONE STORE (C4c). `hosts` is the same injection point the workout entry
     takes: a page that supplies an installation puts the check-in in the SAME
     sealed generation as the weigh-in and the sets; a page that supplies none
     gets that store anyway, through checkin-host.mjs, which opens this device's
     installation itself. The producer and the profile are the page's own —
     `era.createCheckInHost` takes them as arguments, because w6 does not depend
     on this page. `onFailure` is not a store option and never reaches one. */
  const { hosts, onFailure, ...lane } = options;
  try {
    host = hosts && hosts.createCheckInHost
      ? await hosts.createCheckInHost({ day, commands: createCheckInCommands(), profile: CHECKIN_PROFILE })
      : await createCheckInHost({ day, ...lane });
  }
  catch (error) { host = null; if (onFailure) onFailure(error); }
  const checkin = createCheckInModel({ host, day, engineState: model.stateFromOps() });
  let summary = { durable: !!host, recorded: false, date: null };
  let onRefresh = null;
  async function refresh() {
    const row = await checkin.refresh();
    summary = { durable: !!host, recorded: !!row, date: row ? row.date : null };
    if (onRefresh) onRefresh();
    return summary;
  }
  await refresh();
  return {
    summary: () => summary,
    refresh,
    setOnRefresh(fn) { onRefresh = fn; },
    open({ doc, phone, back }) {
      return mountCheckIn(doc, phone, { model: checkin, onBack: back, onChanged: refresh });
    },
    checkin, host,
  };
}

export async function createWorkoutEntry(model, options = {}) {
  const view = model.read();
  const day = model.today;
  /* ONE STORE. `hosts` is the only injection point: a page that supplies one
     (rebuild/m3/w6/local/today-bindings.mjs openTodayOverLocalEra) puts the
     weigh-in and the workout in ONE sealed generation; a page that supplies
     none gets the SAME store through gym-host.mjs, which opens this device's
     installation itself. There is no second behaviour left to fall back to. */
  const { hosts, ...lane } = options;
  const openGym = (hosts && hosts.createGymHost) || createGymHost;
  const gymHost = await openGym({ day, engineState: model.stateFromOps(),
    plannedSplitSlotId: "earned-today-preview/" + day, ...lane });
  /* A host standing on some OTHER day, over the same device storage. Used only to
     close a session abandoned on an earlier day (gym-model.closeUnfinished). */
  const hostForDay = (other) => openGym({ day: other, engineState: model.stateFromOps(),
    plannedSplitSlotId: "earned-today-preview/" + other, ...lane });
  const gym = createGymModel({ gymHost, hostForDay,
    sessionTitle: view.workout ? view.workout.title : null });
  let summary = null;
  let onRefresh = null;
  const gymDraft = newGymDraft();
  /* THE PREPARABILITY PROBE (review B1). gym.read() prepares today's workout through
     the accepted host WITHOUT storing anything, so Today knows — before it offers
     anything — whether the layer will prepare, is mid-session, has a closed session,
     or refuses, and with which code. */
  async function refresh() {
    const read = await gym.read();
    summary = { phase: read.phase, sets: read.done || 0, code: read.code || null,
      copy: read.copy || null, unfinished: read.unfinished || null };
    if (onRefresh) onRefresh();
    return summary;
  }
  /* The accepted close for a session abandoned on an earlier day. It writes through
     the same client as everything else and then re-probes, so the screen reports
     the layer's answer and never its own. */
  async function recover() {
    if (!summary || !summary.unfinished) return { ok: false, code: "WORKOUT_RECOVERY_TARGET_REQUIRED" };
    const result = await gym.closeUnfinished(summary.unfinished);
    await refresh();
    return result;
  }
  await refresh();
  return {
    summary: () => summary,
    refresh,
    recover,
    setOnRefresh(fn) { onRefresh = fn; },
    /* A3 review F7: the card's half-entered set is held BY THE ENTRY, not by the
       mount, so stepping out to the check-in and straight back does not discard it.
       It is transient only — a logged set clears it, and nothing here is of record. */
    open({ doc, phone, back, checkIn }) {
      return mountGym(doc, phone, { model: gym, onBack: back, onChanged: refresh,
        onCheckIn: checkIn, draft: gymDraft });
    },
    gymDraft: () => gymDraft,
    gym, gymHost,
  };
}

export async function boot(options = {}) {
  const doc = options.document || document;
  const failures = [];
  const day = options.today || undefined;
  const idb = options.indexedDB || (typeof globalThis !== "undefined" ? globalThis.indexedDB : undefined);
  const web = options.crypto || (typeof globalThis !== "undefined" ? globalThis.crypto : undefined);
  /* `hosts` IS THE DEFAULT. An injected installation is used as given; with none,
     this page opens its OWN — one local era, opened ONCE here and handed to both
     hosts, so the weigh-in and the workout hold the same client rather than two
     over one repository. No key is minted here and none is passed down;
     `hosts.ignored()` is empty when that is honoured. There is no second
     behaviour to fall back to: both branches are the same store. */
  let hosts = options.hosts || null;
  /* RESTORE-REQUIRED, NEVER A RE-ENROLMENT. C1 refuses an installation that is
     no longer whole — a missing key database, a missing enrolment marker, a
     generation that will not authenticate — with state 18 and its own code, and
     it does NOT offer to start a second life over the record it could not read.
     The page says what rebuild/client says (RESTORE_REQUIRED) and names the
     code; it invents no sentence and re-opens nothing. First run is the other
     side of the same call: C1 enrols only when it observed all three signals
     absent, so a fresh phone opens silently and a damaged one never does. */
  let restoreRequired = null;
  if (!hosts) {
    try { hosts = await openTodayHosts({ indexedDB: idb, crypto: web, day: day || TodayModel.SYNTHETIC_DAY }); }
    catch (error) {
      if (error && error.state === 18) restoreRequired = error.code || "RESTORE_UNPROVEN";
      failures.push("device store: " + (error && error.message ? error.message : String(error)));
    }
  }
  const lane = hosts ? { hosts } : { indexedDB: idb, crypto: web };

  let readings = null;
  const openReading = (hosts && hosts.createReadingHost) || createReadingHost;
  try { readings = await openReading({ day: day || TodayModel.SYNTHETIC_DAY,
    ...(hosts ? {} : { indexedDB: idb, crypto: web }) }); }
  catch (error) { failures.push("weigh-in store: " + (error && error.message ? error.message : String(error))); }

  /* basisState joins today / model / indexedDB / crypto as an injection point.
     Nothing in the page supplies one — boot() is called with no arguments — so
     the shipped screen always runs the fixture's own athlete. It exists because
     the checks need to run the athlete DECISIONS:100 names (FRESH at S2) beside
     the fixture's, over the same real stores. */
  const model = options.model || createTodayModel({ ...(day ? { today: day } : {}),
    ...(options.basisState ? { basisState: options.basisState } : {}),
    ...(readings ? { readings } : {}) });

  let workout = null;
  try { workout = await createWorkoutEntry(model, lane); }
  catch (error) { failures.push("workout store: " + (error && error.message ? error.message : String(error))); }

  /* A3 — the check-in lane. It never prevents the page opening: a device that cannot
     give it a store gets the screen with its controls inert and the reason on it. */
  let checkin = null;
  try {
    checkin = await createCheckInEntry(model, { ...lane,
      onFailure: (error) => failures.push("check-in store: " + (error && error.message ? error.message : String(error))) });
  } catch (error) { failures.push("check-in store: " + (error && error.message ? error.message : String(error))); }

  const api = mountToday(doc, model, { ...(workout ? { workout } : {}), ...(checkin ? { checkin } : {}) });
  if (workout) workout.setOnRefresh(() => { if (api.screen() === "today") api.render("today"); });
  if (checkin) checkin.setOnRefresh(() => { if (api.screen() === "today") api.render("today"); });

  /* Every cause is surfaced, not swallowed (review, non-blocking). The page still
     renders whatever it honestly can. */
  const status = doc.getElementById("today-status");
  if (restoreRequired && status) status.textContent = plainOrDrop(RESTORE_REQUIRED + " (" + restoreRequired + ")", "today-status");
  else if (failures.length && status) status.textContent = plainOrDrop("Not everything opened: " + failures.join("; ")
    + ". Nothing was recorded.", "today-status");
  return { api, workout, checkin, model, readings, hosts, restoreRequired, failures };
}

/* The two sentences of the last-chance screen, as functions of the cause, so the three
   cases (a plain cause, a cause the normaliser rewrote, a cause it refused) can be
   asserted without staging a boot failure. The cause is a machine's sentence and does not
   punctuate itself, so this puts the full stop after it: "Today did not open:
   IDB_OPEN_FAILED. Nothing was recorded." A refused cause is dropped and the sentences
   still read (P1 review, Finding 2). */
export const bootFailureCopy = Object.freeze({
  host: (cause) => "Today could not open on this device. Nothing was changed or recorded."
    + (cause ? " " + cause + (/[.!?]$/.test(cause) ? "" : ".") : ""),
  status: (cause) => (cause
    ? "Today did not open: " + cause + (/[.!?]$/.test(cause) ? " " : ". ")
    : "Today did not open. ") + "Nothing was recorded.",
});

if (typeof document !== "undefined" && document.getElementById("phone")) {
  boot().catch((error) => {
    const host = document.getElementById("phone");
    /* The last-chance screen. The cause is a machine's sentence, so it can carry a dash
       the normaliser has no rule for; the owner's rule (DECISIONS:114 (1)) still holds
       here, and a blank page would be worse than a nameless failure, so a cause that
       cannot be made plain is dropped from the screen and left to the console. */
    const raw = error && error.message ? error.message : String(error);
    let cause = "";
    try { cause = plainCopy(raw, "boot-failure"); } catch (_) { console.error(raw); }
    if (host) host.textContent = bootFailureCopy.host(cause);
    const status = document.getElementById("today-status");
    if (status) status.textContent = bootFailureCopy.status(cause);
  });
}

export { mountToday, createTodayModel };
