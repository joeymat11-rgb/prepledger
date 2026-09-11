// Page entry for the Today screen. It mounts the approved-design view over the real
// adapter and, if anything at all goes wrong, says so without painting a number.
//
// A2 adds the gym card. Its data layer is a DIFFERENT durable store from Today's
// weigh-in log — the encrypted IndexedDB repository the accepted W6 host uses — so
// it is composed here, once, and injected. A device that cannot open that store
// still gets the whole of Today; only the workout entry point says it could not
// open, in the layer's own terms.
import app from "./today-app.cjs";
import { createGymHost } from "./gym-host.mjs";
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
  async function refresh() {
    const read = await gym.read();
    summary = { phase: read.phase, sets: read.done || 0, code: read.code || null };
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
  const model = options.model || createTodayModel();
  let workout = null;
  try { workout = await createWorkoutEntry(model, options.gym || {}); } catch (_) { workout = null; }
  const api = mountToday(options.document || document, model, workout ? { workout } : {});
  if (workout) workout.setOnRefresh(() => { if (api.screen() === "today") api.render("today"); });
  return { api, workout, model };
}

if (typeof document !== "undefined" && document.getElementById("phone")) {
  boot().catch(() => {
    const host = document.getElementById("phone");
    if (host) host.textContent = "Today could not open on this device. Nothing was changed or recorded.";
    const status = document.getElementById("today-status");
    if (status) status.textContent = "Today did not open. Nothing was recorded.";
  });
}

export { mountToday, createTodayModel };
