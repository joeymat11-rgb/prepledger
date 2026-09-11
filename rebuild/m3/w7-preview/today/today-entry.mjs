// Page entry for the Today screen. It opens this device's durable stores, mounts
// the approved-design view over the real adapter and, if anything at all goes
// wrong, says so — naming the cause — without painting a number.
//
// TWO DURABLE LANES, ONE DEVICE (review B2). Both are the accepted encrypted
// IndexedDB repository under the accepted durable public client over
// rebuild/client, under the same on-device key store:
//   * reading-host.mjs  — the morning weigh-in, schema 1;
//   * gym-host.mjs      — the workout, schema 2.
// They are two generations because one generation carries one lease with one
// schema_version and the accepted client refuses an operation whose schema differs
// (OPERATION_SCHEMA_MISMATCH; there is a test). Nothing of record lives in
// localStorage.
import app from "./today-app.cjs";
import TodayModel from "./today-model.cjs";
import { createGymHost, openDeviceKeys } from "./gym-host.mjs";
import { createReadingHost } from "./reading-host.mjs";
import { createGymModel } from "./gym-model.mjs";
import { mountGym } from "./gym-app.mjs";

const { mountToday, createTodayModel } = app;

export async function createWorkoutEntry(model, options = {}) {
  const view = model.read();
  const day = model.today;
  const gymHost = await createGymHost({ day, engineState: model.stateFromOps(),
    plannedSplitSlotId: "earned-today-preview/" + day, ...options });
  /* A host standing on some OTHER day, over the same device storage. Used only to
     close a session abandoned on an earlier day (gym-model.closeUnfinished). */
  const hostForDay = (other) => createGymHost({ day: other, engineState: model.stateFromOps(),
    plannedSplitSlotId: "earned-today-preview/" + other, ...options });
  const gym = createGymModel({ gymHost, hostForDay,
    sessionTitle: view.workout ? view.workout.title : null });
  let summary = null;
  let onRefresh = null;
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
    open({ doc, phone, back }) {
      return mountGym(doc, phone, { model: gym, onBack: back, onChanged: refresh });
    },
    gym, gymHost,
  };
}

export async function boot(options = {}) {
  const doc = options.document || document;
  const failures = [];
  const day = options.today || undefined;
  let device = options.deviceKeys;
  const idb = options.indexedDB || (typeof globalThis !== "undefined" ? globalThis.indexedDB : undefined);
  const web = options.crypto || (typeof globalThis !== "undefined" ? globalThis.crypto : undefined);
  if (!device && idb && web) {
    try { device = await openDeviceKeys({ indexedDB: idb, crypto: web }); }
    catch (error) { failures.push("device keys: " + (error && error.message ? error.message : String(error))); }
  }
  const lane = { indexedDB: idb, crypto: web, ...(device ? { deviceKeys: device } : {}) };

  let readings = null;
  try { readings = await createReadingHost({ day: day || TodayModel.SYNTHETIC_DAY, ...lane }); }
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

  const api = mountToday(doc, model, workout ? { workout } : {});
  if (workout) workout.setOnRefresh(() => { if (api.screen() === "today") api.render("today"); });

  /* Every cause is surfaced, not swallowed (review, non-blocking). The page still
     renders whatever it honestly can. */
  const status = doc.getElementById("today-status");
  if (failures.length && status) status.textContent = "Not everything opened: " + failures.join("; ")
    + ". Nothing was recorded.";
  return { api, workout, model, readings, failures };
}

if (typeof document !== "undefined" && document.getElementById("phone")) {
  boot().catch((error) => {
    const host = document.getElementById("phone");
    const cause = error && error.message ? error.message : String(error);
    if (host) host.textContent = "Today could not open on this device. Nothing was changed or recorded. " + cause;
    const status = document.getElementById("today-status");
    if (status) status.textContent = "Today did not open: " + cause + ". Nothing was recorded.";
  });
}

export { mountToday, createTodayModel };
