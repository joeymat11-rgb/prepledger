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
  const gym = createGymModel({ gymHost, sessionTitle: view.workout ? view.workout.title : null });
  let summary = null;
  let onRefresh = null;
  /* THE PREPARABILITY PROBE (review B1). gym.read() prepares today's workout through
     the accepted host WITHOUT storing anything, so Today knows — before it offers
     anything — whether the layer will prepare, is mid-session, has a closed session,
     or refuses, and with which code. */
  async function refresh() {
    const read = await gym.read();
    summary = { phase: read.phase, sets: read.done || 0, code: read.code || null,
      copy: read.copy || null };
    if (onRefresh) onRefresh();
    return summary;
  }
  await refresh();
  return {
    summary: () => summary,
    refresh,
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

  const model = options.model || createTodayModel({ ...(day ? { today: day } : {}), ...(readings ? { readings } : {}) });

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
