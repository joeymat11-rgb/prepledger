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
import { createLocalCalendar, DAY_CHANGED_COPY } from '../../w6/local/calendar.mjs';
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
import { mountSetup } from './setup/setup-view.mjs';

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
    if (onRefresh) await onRefresh();
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
  const { hosts, draft, ...lane } = options;
  const openGym = (hosts && hosts.createGymHost) || createGymHost;
  const gymHost = await openGym({ day, engineState: model.stateFromOps(),
    plannedSplitSlotId: "earned-today-preview/" + day, ...lane });
  /* A host standing on some OTHER day, over the same device storage. Used only to
     close a session abandoned on an earlier day (gym-model.closeUnfinished). */
  const hostForDay = (other) => openGym({ day: other, engineState: model.stateFromOps(),
    plannedSplitSlotId: "earned-today-preview/" + other, historicalClose: true, ...lane });
  const gym = createGymModel({ gymHost, hostForDay,
    sessionTitle: view.workout ? view.workout.title : null });
  let summary = null;
  let onRefresh = null;
  const gymDraft = draft || newGymDraft();
  /* THE PREPARABILITY PROBE (review B1). gym.read() prepares today's workout through
     the accepted host WITHOUT storing anything, so Today knows — before it offers
     anything — whether the layer will prepare, is mid-session, has a closed session,
     or refuses, and with which code. */
  async function refresh() {
    const read = await gym.read();
    summary = { phase: read.phase, sets: read.done || 0, code: read.code || null,
      copy: read.copy || null, unfinished: read.unfinished || null };
    if (onRefresh) await onRefresh();
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

async function bootControlled(options = {}) {
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
    try { hosts = await openTodayHosts({ indexedDB: idb, crypto: web, databaseName: options.databaseName, namespace: options.namespace, clock: options.clock, day: day || TodayModel.SYNTHETIC_DAY }); }
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

  // Explicit test/demo composition. Owner boot reads authoritative setup below.
  const model = options.model || createTodayModel({ ...(day ? { today: day } : {}),
    ...(options.basisState ? { basisState: options.basisState } : {}),
    mode: options.mode, ...(readings ? { readings } : {}) });

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
  if (restoreRequired && status) status.textContent = RESTORE_REQUIRED + " (" + restoreRequired + ")";
  else if (failures.length && status) status.textContent = "Not everything opened: " + failures.join("; ")
    + ". Nothing was recorded.";
  return { api, workout, checkin, model, readings, hosts, restoreRequired, failures };
}

export const DEMO_DATABASE = 'earned-today-explicit-demo';
export const DEMO_NAMESPACE = 'earned-today/demo';
const pages = new WeakMap();
const openings = new WeakMap();

// Injected day/model/basis remain explicit test controls. A shipped boot has none.
export async function boot(options = {}) {
  const doc = options.document || document;
  const pending = openings.get(doc);
  if (pending) { await pending.catch(() => {}); return boot(options); }
  const opening = bootMode(options);
  openings.set(doc, opening);
  try { return await opening; }
  finally { if (openings.get(doc) === opening) openings.delete(doc); }
}

async function bootMode(options = {}) {
  const doc = options.document || document;
  const mode = options.mode || (options.today || options.model || options.basisState || options.hosts ? 'test'
    : new URLSearchParams(doc.location?.search || '').get('mode') === 'demo' ? 'demo' : 'owner');
  if (!['owner', 'demo', 'test'].includes(mode)) throw new TypeError('TODAY_MODE_INVALID');
  if (mode === 'test') return bootControlled(options);
  pages.get(doc)?.close();
  const identity = doc.getElementById('today-identity');
  if (identity) identity.textContent = mode === 'demo' ? 'Earned · Demo · fictional athlete' : 'Earned · Today';
  if (mode === 'demo') {
    const result = await bootControlled({ ...options, mode, databaseName: DEMO_DATABASE, namespace: DEMO_NAMESPACE });
    result.close = () => { result.api?.destroy(); result.readings?.close(); result.workout?.gymHost?.close(); result.checkin?.host?.close(); result.hosts?.close(); };
    pages.set(doc, result);
    return result;
  }
  if (options.today || options.basisState || options.model) throw new TypeError('OWNER_TODAY_USES_AUTHORITATIVE_SETUP');
  if (options.clock) throw new TypeError('OWNER_TODAY_REQUIRES_COORDINATED_CALENDAR');
  const calendar = options.calendar || createLocalCalendar();
  let hosts = options.hosts, setup, restoreRequired = null, setupRequired = false, firstRun = false;
  const failures = [];
  try {
    hosts ||= await openTodayHosts({ indexedDB: options.indexedDB, crypto: options.crypto, calendar, enroll: false });
    if (hosts.calendar !== calendar) throw new TypeError('LOCAL_ERA_CLOCK_MISMATCH');
    setup = await hosts.initialSetup();
    setupRequired = !setup.configured;
  } catch (error) {
    if (error.code === 'LOCAL_FIRST_RUN') { setupRequired = true; firstRun = true; }
    else { restoreRequired = error.code || error.message; failures.push(restoreRequired); }
  }
  const phone = doc.getElementById('phone'), status = doc.getElementById('today-status');
  if (firstRun) {
    hosts?.close();
    if (status) status.textContent = 'Set up your current routine to begin.';
    const storage = doc.getElementById('today-storage'); if (storage) storage.textContent = 'Your routine is not saved yet.';
    const view = mountSetup(doc, { indexedDB: options.indexedDB, crypto: options.crypto, calendar,
      async onSaved() {
        try {
          const next = await boot({ ...options, calendar });
          if (next.restoreRequired || next.setupRequired) throw new Error(next.restoreRequired || 'LOCAL_SETUP_REOPEN_FAILED');
          if (status) status.textContent = 'Your routine is saved. Today is ready.';
        } catch (error) {
          const panel = doc.createElement('section'); panel.className = 'page';
          const heading = doc.createElement('h1'); heading.textContent = 'Routine saved.';
          const note = doc.createElement('p'); note.textContent = 'Today could not reopen. Reopen or restore this device before continuing. (' + (error.code || error.message) + ')';
          panel.append(heading, note); phone.replaceChildren(panel);
          if (status) status.textContent = note.textContent;
          throw error;
        }
      } });
    const result = { mode, setupRequired: true, restoreRequired: null, failures, model: null, hosts: null, close: () => view.close() };
    pages.set(doc, result);
    return result;
  }
  if (setupRequired || restoreRequired) {
    const panel = doc.createElement('section'); panel.className = 'screen';
    const title = doc.createElement('h1'), note = doc.createElement('p');
    title.textContent = setupRequired ? 'Setup required' : 'Restore required';
    note.textContent = setupRequired ? 'No programme is configured on this device. Initial setup is required before you can record here.'
      : RESTORE_REQUIRED + ' (' + restoreRequired + ')';
    panel.append(title, note); phone.replaceChildren(panel);
    if (status) status.textContent = note.textContent;
    const storage = doc.getElementById('today-storage'); if (storage) storage.textContent = 'Nothing can be recorded here yet.';
    hosts?.close();
    return { mode, setupRequired, restoreRequired, failures, model: null, hosts: null, close() {} };
  }
  if (identity) identity.textContent = 'Earned · ' + setup.setup.athlete_label;
  const days = new Map(); let current = null, closed = false, refreshing = null;
  const notice = doc.createElement('div'); notice.id = 'today-calendar'; notice.setAttribute('role', 'status');
  phone.parentNode.insertBefore(notice, phone);
  function paintNotice() {
    notice.replaceChildren();
    if (!current) return;
    if (current.model.today !== calendar.sample().day) {
      const text = doc.createElement('p'); text.textContent = DAY_CHANGED_COPY; notice.append(text);
      const draft = current.workout.gymDraft();
      if (draft.entry.load !== null || draft.entry.reps !== null) {
        const retained = doc.createElement('p');
        retained.textContent = 'Retained workout entry · ' + current.model.today + ' · Load: '
          + (draft.entry.load ?? 'blank') + ' · Reps: ' + (draft.entry.reps ?? 'blank');
        notice.append(retained);
      }
      const move = doc.createElement('button'); move.textContent = 'Return to Today'; move.addEventListener('click', () => { void refresh({ move: true }).catch(() => {}); }); notice.append(move);
    }
    for (const item of days.values()) if (item !== current && item.retained) {
      const button = doc.createElement('button'); button.textContent = 'View retained draft · ' + item.model.today;
      button.addEventListener('click', () => showRetained(item)); notice.append(button);
    }
  }
  function park() {
    if (!current) return;
    current.retained = current.api.screen() !== 'today' || !!phone.querySelector('[role="dialog"]');
    current.dom = [...phone.childNodes];
    current.api.destroy();
  }
  function showRetained(item) {
    park(); current = item; phone.replaceChildren(...item.dom); paintNotice();
  }
  async function makeDay(day) {
    const readings = await hosts.createReadingHost({ day });
    const model = createTodayModel({ mode: 'owner', today: day, basisState: setup.basisState,
      readings, engineClock: calendar.engineClock(day) });
    const workout = await createWorkoutEntry(model, { hosts });
    const checkin = await createCheckInEntry(model, { hosts });
    const item = { model, readings, workout, checkin, readSignature: JSON.stringify(model.storedReads()), api: null, retained: false };
    return item;
  }
  function mount(item) {
    current = item;
    item.api = mountToday(doc, item.model, { workout: item.workout, checkin: item.checkin,
      async onRecorded() { await refresh(); },
      beforeNavigate(next) {
        if (next === 'today' && calendar.sample().day !== item.model.today) { void refresh({ move: true }).catch(() => {}); return false; }
      } });
    const redraw = async () => {
      await item.readings.refreshScale();
      if (!closed && current === item && item.api.screen() === 'today' && !phone.querySelector('[role="dialog"]')) item.api.render('today');
    };
    item.workout.setOnRefresh(redraw); item.checkin.setOnRefresh(redraw);
    paintNotice();
  }
  async function update({ move = false } = {}) {
    if (closed) return;
    const day = calendar.sample().day;
    if (current && day !== current.model.today) {
      paintNotice();
      // Never replace an active editor. Its DOM and entry-owned draft stay on
      // their original day, and the local write guard refuses a stale save.
      if (!move && (current.api.screen() !== 'today' || phone.querySelector('[role="dialog"]'))) return;
      park();
    }
    if (!current || day !== current.model.today) {
      let item = days.get(day);
      if (!item) {
        item = await makeDay(day);
        if (closed) { item.readings.close(); item.workout.gymHost.close(); item.checkin.host?.close(); return; }
        days.set(day, item);
      }
      mount(item);
    } else {
      const reopened = await current.readings.restart();
      if (reopened.ready !== true) throw Object.assign(new Error(reopened.code || 'LOCAL_REOPEN_FAILED'), { code: reopened.code });
      const signature = JSON.stringify(current.model.storedReads());
      if (signature !== current.readSignature && current.api.screen() === 'today' && !phone.querySelector('[role="dialog"]')) {
        const previous = current.workout;
        current.workout = await createWorkoutEntry(current.model, { hosts, draft: previous.gymDraft() });
        current.readSignature = signature; previous.gymHost.close(); current.api.destroy(); mount(current);
      }
      await current.workout.refresh(); await current.checkin.refresh();
      paintNotice();
    }
  }
  function refresh(options) {
    if (!refreshing) refreshing = update(options).catch(error => {
      if (closed) return;
      restoreRequired = error.code || error.message;
      failures.push(restoreRequired);
      if (status) status.textContent = RESTORE_REQUIRED + ' (' + restoreRequired + ')';
      phone.textContent = RESTORE_REQUIRED + ' (' + restoreRequired + ')';
      throw error;
    }).finally(() => { refreshing = null; });
    return refreshing;
  }
  try { await refresh(); } catch (error) { hosts.close(); notice.remove(); throw error; }
  const onVisible = () => { if (doc.visibilityState !== 'hidden') void refresh().catch(() => {}); };
  const onFocus = () => { void refresh().catch(() => {}); };
  doc.addEventListener('visibilitychange', onVisible); doc.defaultView?.addEventListener('focus', onFocus);
  const timer = doc.defaultView?.setInterval(onFocus, 15000);
  const result = { mode, calendar, setupRequired: false, get restoreRequired() { return restoreRequired; }, failures, hosts,
    get model() { return current.model; }, get api() { return current.api; },
    get readings() { return current.readings; }, get workout() { return current.workout; }, get checkin() { return current.checkin; },
    refresh, retainedDays: () => [...days.values()].filter(d => d.retained).map(d => d.model.today),
    close() {
      if (closed) return; closed = true;
      doc.removeEventListener('visibilitychange', onVisible); doc.defaultView?.removeEventListener('focus', onFocus);
      doc.defaultView?.clearInterval(timer); notice.remove();
      for (const item of days.values()) { item.api?.destroy(); item.readings.close(); item.workout.gymHost.close(); item.checkin.host?.close(); }
      hosts.close(); if (pages.get(doc) === result) pages.delete(doc);
    } };
  pages.set(doc, result);
  return result;
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
