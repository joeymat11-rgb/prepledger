/* gym-settings-lane.mjs - the sealed machine-settings writer and gym dispatch lane.
 *
 * Released drawing receives frozen data and typed outcomes. Only sealed control bindings
 * can enter the four durable subjects or the transient advance. Refusal depth exists only
 * for a synchronous callback frame; pending reservations remain held until their named
 * asynchronous settlement completes.
 *
 * THE STORE HANDLE'S LIFETIME (Coach v1 seat read; Fable c88a3fe9 D1). The machine-settings store is opened once per
 * device store (IndexedDB factory) and per day, by openSharedHost below, and that one handle is shared by every lane
 * mounted on the page and by readSavedSettings. It lives as long as the page: neither the lane nor the read closes it
 * (the lane never closed its own handle before either). A different day gets its own handle (a card rebased to another
 * day, or the page past local midnight before its reboot), and the earlier day's handle stays open, unused, until the
 * page goes. An open that fails is forgotten, so the next ask opens again.
 */
import MachineSettings from '../../../coach/machine-settings-commands.cjs';

const { machineOf } = MachineSettings;

const freezeDeep = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezeDeep(child);
  return Object.freeze(value);
};
const clone = (value) => {
  if (value === undefined) return undefined;
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};
const detached = (value) => freezeDeep(clone(value));

/* The draft as the producer's `machine`, with empty rows dropped rather than sent as
   blanks. Returns null when the draft says nothing at all, which is the one refusal
   the page can name before the producer is asked. */
export function machineFromDraft(draft, exerciseId) {
  const out = { exercise_id: typeof exerciseId === 'string' ? exerciseId : '' };
  const rows = (draft && Array.isArray(draft.rows) ? draft.rows : [])
    .map((row) => ({ name: String(row.name || '').trim(), value: String(row.value || '').trim() }))
    .filter((row) => row.name !== '' || row.value !== '');
  if (rows.length) out.settings = rows;
  const cues = String((draft && draft.cues) || '').trim();
  if (cues) out.cues = cues;
  if (!Object.hasOwn(out, 'settings') && !Object.hasOwn(out, 'cues')) return null;
  return out;
}

/* THE ONE GATE, which is the producer's. `machineOf` either returns the canonical
   object or throws its named code; nothing here re-implements what it checks. */
export function acceptable(machine) {
  if (!machine) return false;
  try { machineOf(JSON.parse(JSON.stringify(machine))); return true; }
  catch (_) { return false; }
}

/* COACH V1 SEAT READ (S19 brief, "Coach v1, the seat read", PM ruling option A). ONE machine-settings store handle per
   device store and day: every lane mounted on this page opens the store through openSharedHost, and so does the one
   read below, so the store is never opened a second time. The handle is opened lazily, by whichever asks first; an
   open that fails is forgotten, so a later ask may try again. Nothing here writes. */
const sharedHosts = new WeakMap();
function openSharedHost(view, day) {
  const idb = (view && view.indexedDB) || (typeof globalThis !== 'undefined' ? globalThis.indexedDB : undefined);
  const web = (view && view.crypto) || (typeof globalThis !== 'undefined' ? globalThis.crypto : undefined);
  if (!idb || !web || !web.subtle || typeof day !== 'string' || !day) return null;
  let byDay = sharedHosts.get(idb);
  if (!byDay) { byDay = new Map(); sharedHosts.set(idb, byDay); }
  if (!byDay.has(day)) {
    const opening = Promise.resolve()
      .then(() => import('./machine-settings-host.mjs'))
      .then((module) => module.createMachineSettingsHost({ day, indexedDB: idb, crypto: web }))
      .catch((error) => { if (byDay.get(day) === opening) byDay.delete(day); throw error; });
    byDay.set(day, opening);
  }
  return byDay.get(day);
}

/* THE SEAT READ, the one read the writer fence admits out of this seal (today-entry.mjs is its only importer). The
   settings saved for each lift id, read through the shared handle by the host's own read, latest(), and nothing else:
   the handle never leaves this module and nothing is written. Frozen detached rows, or { ok: false } when this device
   has no store to read. */
export async function readSavedSettings(view, day, liftIds) {
  const opening = openSharedHost(view, day);
  if (!opening) return freezeDeep({ ok: false, rows: [] });
  let reader;
  try { reader = await opening; } catch (_) { return freezeDeep({ ok: false, rows: [] }); }
  const rows = [];
  for (const lift of Array.isArray(liftIds) ? liftIds : []) {
    if (typeof lift !== 'string' || !lift) continue;
    let latest;
    try { latest = await reader.latest(lift); } catch (_) { return freezeDeep({ ok: false, rows: [] }); }
    rows.push({ lift, latest: latest ? clone(latest) : null });
  }
  return freezeDeep({ ok: true, rows });
}

export function createGymSettingsLane(doc, phone, model, settings, painter) {
  let settingsLane = settings || null;
  let settingsOpening = null;
  let settingsReading = null;
  let settingsPending = null;
  let mountLive = true;
  let activeView = null;
  let readSequence = 0;
  let activeEditor = null;
  let refusalDepth = 0;
  let workoutBusy = false;
  const subjectBusy = Object.seal({ recordSettings: false, logSet: false,
    finish: false, forget: false, undo: false });
  const settingsRead = new Map();
  const settingsInFlight = new Map();
  const consumedEvents = new WeakSet();
  const controlBindings = new Map();
  const listenerBindings = new WeakMap();

  const underRefusal = (fn) => {
    refusalDepth += 1;
    try { return fn(); }
    finally { refusalDepth -= 1; }
  };
  const repaint = () => underRefusal(() => painter.repaint());
  const liftOf = (view) => view && view.lift && typeof view.lift.id === 'string' ? view.lift.id : null;
  const contextOf = (view) => view ? JSON.stringify({ phase: view.phase || null,
    startId: view.startId || null, lift: liftOf(view), slot: view.set ? view.set.slot : null,
    opId: view.saved ? view.saved.opId : null, next: !!view.next }) : '';
  const sameContext = (binding) => mountLive && binding.context === contextOf(activeView);
  const editorMatchesView = () => activeEditor && activeView && activeView.phase === 'active'
    && activeEditor.liftId === liftOf(activeView);

  const revoke = (binding) => {
    if (!binding || binding.revoked) return;
    binding.revoked = true;
    binding.control.removeEventListener('click', binding.wrapper);
    if (controlBindings.get(binding.control) === binding) controlBindings.delete(binding.control);
  };
  const retireEditor = () => {
    const token = activeEditor && activeEditor.token;
    activeEditor = null;
    for (const binding of [...controlBindings.values()]) {
      if (binding.kind === 'settings' && binding.editorToken === token) revoke(binding);
    }
  };
  const retireControls = () => {
    for (const binding of [...controlBindings.values()]) revoke(binding);
  };
  const uniqueControl = (selector) => {
    if (!mountLive || !phone || typeof phone.querySelectorAll !== 'function') return null;
    const controls = phone.querySelectorAll(selector);
    return controls.length === 1 ? controls[0] : null;
  };
  const controlFor = (action) => {
    if (action === 'recordSettings') return uniqueControl('[data-slot="settings-save"]');
    if (action === 'logSet') return uniqueControl('[data-slot="log"]');
    if (action === 'undo') return uniqueControl('[data-action="undo"]');
    if (action === 'finish' || action === 'forget') return uniqueControl('[data-slot="primary"]');
    return null;
  };
  const actionFits = (action, view) => {
    if (!view) return false;
    if (action === 'logSet') return view.phase === 'active' && !!view.set;
    if (action === 'undo') return view.phase === 'saved' && !!view.saved;
    if (action === 'forget') return view.phase === 'saved' && !!view.next;
    if (action === 'finish') return view.phase === 'complete' || (view.phase === 'saved' && !view.next);
    return false;
  };
  const bindingLive = (binding, event) => !binding.revoked && mountLive
    && refusalDepth === 0 && controlBindings.get(binding.control) === binding
    && binding.control.isConnected && phone.contains(binding.control)
    && !binding.control.disabled && event && event.type === 'click'
    && event.currentTarget === binding.control && !consumedEvents.has(event)
    && sameContext(binding)
    && (binding.kind !== 'settings' || (settingsLane && activeEditor
      && binding.editorToken === activeEditor.token && editorMatchesView()))
    && (binding.kind !== 'gym' || actionFits(binding.action, activeView));

  function startSettingsRead(liftId, refresh = false, editorToken = null) {
    if (!settingsLane || typeof liftId !== 'string' || !liftId) return Promise.resolve();
    if (!refresh && settingsRead.has(liftId)) return Promise.resolve();
    if (settingsInFlight.has(liftId)) return settingsInFlight.get(liftId);
    const operation = Promise.resolve()
      .then(() => settingsLane.latest(liftId))
      .then(
        (latest) => { settingsRead.set(liftId, freezeDeep({ state: 'known', latest: detached(latest || null) })); },
        () => { settingsRead.set(liftId, freezeDeep({ state: 'failed', latest: null })); },
      )
      .then(() => {
        if (mountLive && liftOf(activeView) === liftId
          && (!activeEditor || activeEditor.token === editorToken)) return repaint();
        return undefined;
      })
      .finally(() => { settingsInFlight.delete(liftId); });
    settingsInFlight.set(liftId, operation);
    settingsReading = operation;
    return operation;
  }

  function openSettingsLane() {
    if (settingsLane) return null;
    if (settingsOpening) return settingsOpening;
    /* COACH V1 SEAT READ: the lane's own handle is the shared one (openSharedHost above), never a second open. */
    const opening = openSharedHost(doc.defaultView || null, model.day);
    if (!opening) return null;
    settingsOpening = opening
      .then(async (host) => { settingsLane = host; if (mountLive) await repaint(); return true; })
      .catch(() => { settingsLane = null; return false; });
    return settingsOpening;
  }

  const copySettingsRaw = (raw) => ({
    rows: raw && Array.isArray(raw.rows)
      ? raw.rows.map((row) => ({ name: row && row.name, value: row && row.value })) : [],
    cues: raw && raw.cues,
    revision: raw && Number.isSafeInteger(raw.revision) && raw.revision >= 0 ? raw.revision : 0,
  });
  const copyGymRaw = (raw) => ({ load: raw && raw.load, reps: raw && raw.reps,
    effort: raw && raw.effort ? detached(raw.effort) : null });
  const settingOutcome = (kind, reason, token, liftId) => freezeDeep(Object.assign({ kind },
    reason ? { reason } : {}, token ? { editorToken: token } : {}, liftId ? { liftId } : {}));
  const gymOutcome = (action, result) => freezeDeep({ kind: 'gym-result', action,
    result: result === undefined ? undefined : detached(result) });

  async function recordSettings(raw, token, liftId) {
    const machine = machineFromDraft(raw, liftId);
    if (!machine) return settingOutcome('invalid', 'empty', token);
    if (!acceptable(machine)) return settingOutcome('invalid', 'shape', token);
    if (!settingsLane || !activeEditor || activeEditor.token !== token || !editorMatchesView()) {
      return settingOutcome('ignored', settingsLane ? 'stale' : 'unavailable');
    }
    const result = await settingsLane.save(machine);
    if (!result || result.ok !== true) return settingOutcome('not-saved', null, token);
    settingsRead.delete(liftId);
    await startSettingsRead(liftId, true, token);
    return settingOutcome('saved', null, token, liftId);
  }

  async function runGym(action, raw, view) {
    let result;
    if (action === 'logSet') result = await model.logSet({ startId: view.startId,
      slot: view.set.slot, lift: view.set.lift, load: String(raw.load || '').trim(),
      reps: String(raw.reps || '').trim(), effort: raw.effort && raw.effort.reserve });
    else if (action === 'finish') result = await model.finish({ startId: view.startId });
    else if (action === 'undo') result = await model.undo({ startId: view.startId, opId: view.saved.opId });
    else if (action === 'forget') result = model.forget();
    return gymOutcome(action, result);
  }

  /* A neutral repaint can replace the active card while a real set commit settles.
     The durable read advances to the next slot and the exact old Log context is
     correctly revoked. The acknowledgement still belongs to the current workout and
     lift only when the live Log binding owns the advanced slot. This narrow handoff
     lets it paint the real Saved result; leaving, changing workout/lift, or a refusal
     still has no handoff and therefore no stale callback. */
  const continuedLogBinding = (binding, outcome, capturedView, capturedEditor) => {
    if (binding.kind !== 'gym' || binding.action !== 'logSet'
      || !outcome || outcome.kind !== 'gym-result' || outcome.action !== 'logSet'
      || !outcome.result || outcome.result.ok !== true || !mountLive || !workoutBusy
      || !capturedView || capturedView.phase !== 'active'
      || !activeView || activeView.phase !== 'active'
      || capturedView.startId !== activeView.startId
      || liftOf(capturedView) !== liftOf(activeView)
      || !capturedView.set || !activeView.set || capturedView.set.slot === activeView.set.slot) return null;
    return [...controlBindings.values()].find((row) => row.kind === 'gym'
      && row.action === 'logSet' && !row.revoked && sameContext(row)) || null;
  };

  const deliver = async (binding, outcome, capturedView, capturedEditor) => {
    let current = binding.kind === 'settings' && activeEditor
      ? [...controlBindings.values()].find((row) => row.kind === 'settings'
        && row.editorToken === activeEditor.token && row.editorToken === binding.editorToken && !row.revoked)
      : binding.kind === 'gym'
        ? [...controlBindings.values()].find((row) => row.kind === 'gym'
          && row.action === binding.action && row.context === binding.context && !row.revoked)
        : binding;
    if (!current && binding.kind === 'gym')
      current = continuedLogBinding(binding, outcome, capturedView, capturedEditor);
    if (!current || current.revoked || !sameContext(current)
      || controlBindings.get(current.control) !== current
      || !current.control.isConnected || !phone.contains(current.control)) return;
    const settlement = underRefusal(() => current.onOutcome(outcome));
    await settlement;
  };

  const dispatch = (binding, event) => {
    if (!bindingLive(binding, event)) return;
    const busy = binding.kind === 'settings' ? subjectBusy.recordSettings : workoutBusy;
    if (busy) return;
    event.preventDefault();
    consumedEvents.add(event);
    if (binding.kind === 'settings') subjectBusy.recordSettings = true;
    else { subjectBusy[binding.action] = true; workoutBusy = true; }
    if (binding.kind === 'settings') binding.control.disabled = true;
    const capturedView = activeView;
    const capturedEditor = activeEditor;
    let settleOperation, rejectOperation;
    const operation = new Promise((resolve, reject) => {
      settleOperation = resolve;
      rejectOperation = reject;
    });
    if (binding.kind === 'settings') settingsPending = operation;
    const execute = async () => {
      const raw = underRefusal(() => {
        const supplied = binding.readRaw();
        return binding.kind === 'settings' ? copySettingsRaw(supplied) : copyGymRaw(supplied);
      });
      if (binding.revoked || !sameContext(binding)) return;
      let outcome;
      if (binding.kind === 'settings') {
        if (!capturedEditor || capturedEditor.token !== binding.editorToken) return;
        outcome = await recordSettings(raw, binding.editorToken, capturedEditor.liftId);
        if (outcome.kind === 'saved' && activeEditor && activeEditor.token === binding.editorToken) {
          const callback = [...controlBindings.values()].find((row) => row.kind === 'settings'
            && row.editorToken === binding.editorToken && !row.revoked);
          if (!callback || !mountLive || !activeEditor || activeEditor.token !== binding.editorToken
            || callback.revoked || !sameContext(callback)
            || controlBindings.get(callback.control) !== callback
            || !callback.control.isConnected || !phone.contains(callback.control)) return;
          retireEditor();
          const settlement = underRefusal(() => callback.onOutcome(outcome));
          await settlement;
          return;
        }
      } else outcome = await runGym(binding.action, raw, capturedView);
      await deliver(binding, outcome, capturedView, capturedEditor);
    };
    execute().finally(() => {
      if (binding.kind === 'settings') {
        subjectBusy.recordSettings = false;
        const current = activeEditor && [...controlBindings.values()].find((row) => row.kind === 'settings'
          && row.editorToken === activeEditor.token && !row.revoked && sameContext(row));
        if (current && current.control.isConnected && phone.contains(current.control)) current.control.disabled = false;
      }
      else { subjectBusy[binding.action] = false; workoutBusy = false; }
    }).then(settleOperation, rejectOperation);
    operation.catch(() => {});
  };

  const bind = (kind, action, editorToken, readRaw, onOutcome) => {
    const control = controlFor(action);
    if (!control || typeof readRaw !== 'function' || typeof onOutcome !== 'function') return () => {};
    if (kind === 'settings' && (!activeEditor || activeEditor.token !== editorToken)) return () => {};
    if (kind === 'gym' && !actionFits(action, activeView)) return () => {};
    for (const previous of [...controlBindings.values()]) {
      if (previous.kind === kind && previous.action === action) revoke(previous);
    }
    revoke(controlBindings.get(control));
    const binding = { kind, action, editorToken, readRaw, onOutcome, control,
      context: contextOf(activeView), revoked: false, wrapper: null };
    binding.wrapper = (event) => dispatch(binding, event);
    controlBindings.set(control, binding);
    control.addEventListener('click', binding.wrapper);
    return () => revoke(binding);
  };

  const installView = (value, sequence) => {
    if (!mountLive || sequence !== readSequence) return null;
    activeView = detached(value);
    if (!editorMatchesView()) retireEditor();
    for (const binding of [...controlBindings.values()]) {
      if (binding.kind === 'gym' && !sameContext(binding)) revoke(binding);
    }
    return detached(activeView);
  };

  const facade = Object.freeze({
    available: () => !!settingsLane,
    entryFor: (liftId) => settingsRead.has(liftId) ? detached(settingsRead.get(liftId)) : null,
    stateFor: (liftId) => settingsRead.has(liftId) ? settingsRead.get(liftId).state : 'reading',
    hasRead: (liftId) => settingsRead.has(liftId),
    settingsBusy: () => subjectBusy.recordSettings,
  });
  const hooks = Object.freeze({
    readView: async () => {
      const sequence = ++readSequence;
      const value = await model.read();
      return installView(value, sequence);
    },
    settingsEditOpened: () => {
      if (!mountLive || !settingsLane || !activeView || activeView.phase !== 'active') return null;
      const liftId = liftOf(activeView), entry = liftId ? settingsRead.get(liftId) : null;
      if (!entry || entry.state !== 'known') return null;
      retireEditor();
      const token = Object.freeze({});
      activeEditor = { token, liftId };
      return Object.freeze({ editorToken: token, latest: detached(entry.latest) });
    },
    settingsEditClosed: (token) => { if (activeEditor && activeEditor.token === token) retireEditor(); },
    leave: () => { mountLive = false; ++readSequence; retireEditor(); retireControls(); activeView = null; },
    bindSettingsSave: (token, readRaw, onOutcome) => bind('settings', 'recordSettings', token, readRaw, onOutcome),
    bindGymAction: (action, readRaw, onOutcome) => bind('gym', action, null, readRaw, onOutcome),
    open: () => openSettingsLane(),
    startRead: (liftId) => startSettingsRead(liftId),
    listen: (element, type, listener) => {
      if (!element || typeof element.addEventListener !== 'function' || typeof listener !== 'function') return;
      let types = listenerBindings.get(element);
      if (!types) { types = new Map(); listenerBindings.set(element, types); }
      let listeners = types.get(type);
      if (!listeners) { listeners = new Map(); types.set(type, listeners); }
      if (listeners.has(listener)) return;
      const wrapper = (event) => underRefusal(() => listener(event));
      listeners.set(listener, wrapper);
      element.addEventListener(type, wrapper);
    },
    unlisten: (element, type, listener) => {
      const types = listenerBindings.get(element), listeners = types && types.get(type);
      const wrapper = listeners && listeners.get(listener);
      if (!wrapper) return;
      element.removeEventListener(type, wrapper);
      listeners.delete(listener);
      if (listeners.size === 0) types.delete(type);
    },
    paint: (draw) => underRefusal(draw),
  });
  const api = Object.freeze({
    pending: () => settingsPending,
    ready: () => settingsOpening,
    lane: () => settingsLane,
    read: () => settingsReading,
    stateFor: (liftId) => facade.stateFor(liftId),
  });
  return Object.freeze({ facade, hooks, api });
}

export default { createGymSettingsLane, machineFromDraft, acceptable };
