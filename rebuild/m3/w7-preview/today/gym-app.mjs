// gym-app.mjs — the gym card's view: Refinement A's workout and saved-set/rest
// screens, bound slot by slot to the accepted capture layer through gym-model.mjs.
//
// It carries NO number and NO plan word of its own. Every slot is filled from the
// model's DTO; a slot with no value is filled with the cell's own words, never a
// placeholder figure. Refusals are printed exactly as the capture layer returned
// them — its code, and its copy when it supplied one.

import TodayApp from './today-app.cjs';
// The render boundary for the owner's no-dashes rule (DECISIONS:114 (1)): the engine's
// prescription reasons and the layer's refusals are not this file's words, and the dash
// comes out of them here rather than in the frozen source. A dash the normaliser cannot
// rewrite costs that one slot, not the screen (P1 review, Finding 3).
import PlainCopy from './plain-copy.cjs';
/* DECISIONS:154 (2) / :140 wave one - the machine-settings block and its capture
   editor. The VIEW module owns the shape; the words below are this file's, because
   this file is one of design.cjs's VIEW_SOURCES and is therefore where the copy
   binding can see them. The producer and every rule about the op are the coach's,
   imported by machine-settings-view.mjs and machine-settings-host.mjs. */
import MachineSettingsView from './machine-settings-view.mjs';

const { plainOrDrop } = PlainCopy;
const { ARROW } = TodayApp;
// The approved prototype's own check mark, copied from Earned-refinement-A.html.
export const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';

/* Copy this preview owns because the approved prototype cannot say it: the
   prototype counts down a fictional rest timer, and the accepted engine
   prescribes no rest length at all, so the screen states that instead of
   inventing one. Declared in design.cjs and checked to be absent from the
   approved references, so it can never smuggle in approved-looking words. */
export const NO_REST_PRESCRIBED = 'Your plan does not set a rest length.';
/* REVIEW B1. A refusal that came from the accepted layer is NOT a fault of this
   device, and this screen must not say it is. The lead below is neutral and
   factual; the layer's own reason and its own code follow it, each exactly once.
   The device sentence lives in today-app.cjs and is used only when the page has no
   workout host at all. */
export const COULD_NOT_PREPARE = 'Earned could not prepare today’s workout, and nothing was recorded.';
export const WORKOUT_RECORDED = 'Today’s workout is recorded on this device.';
export const FINISH_WORKOUT = 'Finish this workout';
export const CLEAN_REP_HELP = [
  'A rep you could complete with the same range of motion and control, without changing your technique to finish it.',
  'Estimate how many more you could have done at the end of the set. If you can’t tell, choose Unsure.',
];

/* MACHINE SETTINGS, wave one (DECISIONS:154 (2), :140). Every sentence the block and
   its editor can put on the screen, declared here and nowhere else, so design.cjs binds
   them exactly as it binds the rest of the gym card's words. The empty state is the one
   the brief names verbatim: this device holds nothing for this lift and says so, rather
   than showing a zero, a dash or another lift's setting. */
export const SETTINGS_HEAD = 'Your settings for this machine';
export const SETTINGS_NONE = 'No settings saved yet.';
export const SETTINGS_OPEN = 'Machine settings';
export const SETTINGS_EDITOR_TITLE = 'Save the settings for this machine';
export const SETTINGS_NAME_LABEL = 'Setting';
export const SETTINGS_VALUE_LABEL = 'Value';
export const SETTINGS_CUE_LABEL = 'Anything to remember';
export const SETTINGS_CUES_LEAD = 'To remember:';
export const SETTINGS_ADD = 'Add another setting';
export const SETTINGS_REMOVE = 'Remove this setting';
export const SETTINGS_SAVE = 'Save these settings';
export const SETTINGS_CANCEL = 'Close without saving';
export const SETTINGS_NOTHING = 'Add a setting or a cue before saving. Nothing was recorded.';
export const SETTINGS_REFUSED = 'Each setting needs a short name and a short value, and each name only once. Nothing was recorded.';
export const SETTINGS_NOT_SAVED = 'These settings could not be recorded on this device, and no part of them was recorded.';
/* D2 ROUND 1, FINDING 2 - UNKNOWN IS NOT EMPTY. A read that has not answered yet, and
   a read that FAILED, are two states this block may be in and neither of them is "no
   settings saved". Both say what they are, and neither offers the capture editor,
   because an editor seeded from a failed read is a blank form that looks like a
   correction and would overwrite settings the athlete still has. */
export const SETTINGS_READING = 'Reading your saved settings for this machine.';
export const SETTINGS_UNREAD = 'Settings could not be read.';
export const SETTINGS_UNREAD_ACTION = 'Nothing was lost and nothing was changed. Log your set as usual, and open Earned again on this device to see them.';
/* The one object the view module is handed. It owns no words of its own. */
const SETTINGS_COPY = Object.freeze({
  head: SETTINGS_HEAD, none: SETTINGS_NONE, open: SETTINGS_OPEN,
  reading: SETTINGS_READING, unread: SETTINGS_UNREAD, unreadAction: SETTINGS_UNREAD_ACTION,
  editorTitle: SETTINGS_EDITOR_TITLE, nameLabel: SETTINGS_NAME_LABEL, valueLabel: SETTINGS_VALUE_LABEL,
  cueLabel: SETTINGS_CUE_LABEL, cuesLead: SETTINGS_CUES_LEAD, add: SETTINGS_ADD, remove: SETTINGS_REMOVE,
  save: SETTINGS_SAVE, cancel: SETTINGS_CANCEL, plain: plainOrDrop,
});

/* A3 review F7 — the card's TRANSIENT state (what is typed into the two boxes and
   which effort answer is chosen) lives in an object the caller may hold, so leaving
   the card for the check-in and coming straight back does not throw the athlete's
   half-entered set away. Nothing durable lives here: the moment a set is logged this
   is cleared, and a caller that passes nothing gets a fresh one — which is exactly
   what every existing caller and every A2 test does. */
export function newGymDraft() { return { effort: null, entry: { load: null, reps: null } }; }

export function mountGym(doc, phone, { model, onBack, onChanged, onCheckIn, draft, settings } = {}) {
  if (!phone) throw new Error('Gym card: no host element');
  let busy = false;
  const held = draft && typeof draft === 'object' ? draft : newGymDraft();
  if (!Object.hasOwn(held, 'effort')) held.effort = null;   // NOTHING is preselected
  if (!held.entry || typeof held.entry !== 'object') held.entry = { load: null, reps: null };
  let showSetup = false, showWhy = false, showHelp = false;

  /* ---------------- MACHINE SETTINGS (DECISIONS:154 (2)) ----------------
     WHY THIS FILE OPENS THE LANE. The other four lanes are opened by boot() in
     today-entry.mjs, which is sha-pinned by local-today-journey.test.mjs PAGE_PINS
     and cannot gain a fifth. gym-app.mjs is DRIVEN by that suite, not pinned
     (PAGE_PINS names exactly four files), so the fifth lane is opened from here -
     once, asynchronously, and FAILING CLOSED. A device that will not give this page
     an encrypted store keeps exactly the card it has today: the block and the
     editor stay hidden, nothing is captured, and no jsdom mount in this repository
     changes, because jsdom has no indexedDB. Tests inject `settings` directly. */
  let settingsLane = settings || null;
  let settingsOpening = null;
  let settingsSaving = null;
  let settingsDraft = null;       // non-null only while the editor is open
  let settingsDraftLift = null;   // the lift that draft belongs to
  /* D2 ROUND 1, FINDING 1 - THE OPTIONAL READ IS NEVER A PREREQUISITE FOR THE CARD.
     The read used to be AWAITED inside paint(), so a slow lane meant no active set, no
     log control and no workout at all until it answered. It is now a lookup in a cache
     keyed by exercise id: the card paints from whatever that cache holds, a lift with
     no entry STARTS a read and paints the pending state, and the answer repaints only
     the lift it belongs to. A late answer for a lift the athlete has moved past is
     stored and never shown. */
  const settingsRead = new Map();   // exercise id -> {state: 'known'|'failed', latest}
  const settingsInFlight = new Set();
  let settingsReading = null;       // the last read started, for checks and tests

  function startSettingsRead(liftId) {
    if (!settingsLane || typeof liftId !== 'string' || !liftId) return settingsReading;
    if (settingsRead.has(liftId) || settingsInFlight.has(liftId)) return settingsReading;
    settingsInFlight.add(liftId);
    settingsReading = Promise.resolve()
      .then(() => settingsLane.latest(liftId))
      .then(
        (latest) => { settingsRead.set(liftId, { state: 'known', latest: latest || null }); },
        /* A REFUSAL IS NOT AN ABSENCE (finding 2). It is recorded as its own state and
           the block says so; it never becomes "no settings saved yet". */
        () => { settingsRead.set(liftId, { state: 'failed', latest: null }); },
      )
      .then(() => { settingsInFlight.delete(liftId); return paint(); });
    return settingsReading;
  }

  function openSettingsLane() {
    if (settingsLane || settingsOpening) return settingsOpening;
    const view = doc.defaultView || null;
    const idb = (view && view.indexedDB) || (typeof globalThis !== 'undefined' ? globalThis.indexedDB : undefined);
    const web = (view && view.crypto) || (typeof globalThis !== 'undefined' ? globalThis.crypto : undefined);
    if (!idb || !web || !web.subtle || typeof model.day !== 'string') return null;
    settingsOpening = Promise.resolve()
      .then(() => import('./machine-settings-host.mjs'))
      .then((module) => module.createMachineSettingsHost({ day: model.day, indexedDB: idb, crypto: web }))
      .then(async (host) => { settingsLane = host; await paint(); return host; })
      .catch(() => { settingsLane = null; return null; });
    return settingsOpening;
  }

  const template = id => {
    const node = doc.getElementById(id);
    if (!node) throw new Error('Gym card: missing approved template ' + id);
    return node.content.firstElementChild.cloneNode(true);
  };
  const slots = root => {
    const map = new Map();
    for (const el of root.querySelectorAll('[data-slot]')) if (!map.has(el.dataset.slot)) map.set(el.dataset.slot, el);
    return map;
  };
  function put(map, name, text) {
    const el = map.get(name);
    if (!el) throw new Error('Gym card: template slot missing: ' + name);
    el.textContent = plainOrDrop(text === null || text === undefined ? '' : String(text), name);
    el.hidden = text === null || text === undefined || text === '';
    return el;
  }
  function icons(root) {
    for (const el of root.querySelectorAll('[data-arrow]')) el.innerHTML = ARROW;
    for (const el of root.querySelectorAll('[data-check]')) el.innerHTML = CHECK;
  }
  function show(root) {
    phone.replaceChildren(root);
    const heading = root.querySelector('h1') || root;
    heading.tabIndex = -1;
    heading.focus();
  }
  const lines = (host, values, className) => {
    host.replaceChildren();
    for (const value of values) {
      const p = doc.createElement('p');
      p.className = className;
      p.textContent = plainOrDrop(value, className);
      host.append(p);
    }
    host.hidden = values.length === 0;
  };

  function stub(view, note, detail) {
    const root = template('t-workout');
    const map = slots(root);
    put(map, 'workout-title', view.title || '');
    put(map, 'stub-note', note);
    put(map, 'workout-detail', detail || '');
    root.querySelector('[data-go="today"]').addEventListener('click', event => { event.preventDefault(); onBack(); });
    icons(root);
    show(root);
  }

  /* The block and the editor, painted onto the active set. With no lane both stay
     hidden and the card is exactly the card that shipped before this build. */
  function settingsPaint(root, map, view) {
    const block = map.get('settings-block');
    const editor = map.get('settings-editor');
    if (!block || !editor) return;
    if (!settingsLane) { block.hidden = true; editor.hidden = true; openSettingsLane(); return; }
    const liftId = view.lift && typeof view.lift.id === 'string' ? view.lift.id : null;
    if (!liftId) { block.hidden = true; editor.hidden = true; return; }
    /* NOT AWAITED. The read is started here and its answer arrives in its own repaint;
       this function, and therefore the whole card, is finished either way. */
    if (!settingsRead.has(liftId)) startSettingsRead(liftId);
    const entry = settingsRead.get(liftId) || null;
    const state = entry ? entry.state : 'reading';
    const latest = entry ? entry.latest : null;
    MachineSettingsView.renderBlock(doc, map, { copy: SETTINGS_COPY, latest, state, put });
    const openControl = root.querySelector('[data-action="settings-open"]');
    /* UNTIL THE READ ANSWERS, THERE IS NOTHING TO CORRECT (finding 2). Offering the
       editor here would seed it from a null the athlete never chose. */
    if (state !== 'known') { openControl.disabled = true; editor.hidden = true; return; }
    openControl.disabled = false;
    openControl.addEventListener('click', () => {
      settingsDraft = MachineSettingsView.draftFrom(latest);
      settingsDraftLift = liftId;
      paint();
    });
    if (!settingsDraft || settingsDraftLift !== liftId) { editor.hidden = true; return; }
    editor.hidden = false;
    MachineSettingsView.renderEditor(doc, map, { copy: SETTINGS_COPY, draft: settingsDraft, put,
      onChanged: () => { paint(); } });
    map.get('settings-error').textContent = '';
    root.querySelector('[data-action="settings-cancel"]').addEventListener('click', () => {
      /* CANCELLING WRITES NOTHING. The draft is thrown away and the durable record is
         whatever it already was; the athlete is returned to the block. */
      settingsDraft = null; settingsDraftLift = null; paint();
    });
    map.get('settings-save').addEventListener('click', () => { settingsSaving = recordSettings(map, view); });
  }

  /* ONE op through the coach's producer (brief section 2). Both refusals below are
     decided BEFORE anything is written, and the second of them is the producer's own
     gate called through machine-settings-view.mjs - there is no validator here. */
  async function recordSettings(map, view) {
    const error = map.get('settings-error');
    const machine = MachineSettingsView.machineFromDraft(settingsDraft, view.lift.id);
    if (!machine) { error.textContent = plainOrDrop(SETTINGS_NOTHING, 'settings-error'); return; }
    if (!MachineSettingsView.acceptable(machine)) {
      error.textContent = plainOrDrop(SETTINGS_REFUSED, 'settings-error');
      return;
    }
    const save = map.get('settings-save');
    save.disabled = true;
    let result = null;
    try { result = await settingsLane.save(machine); }
    finally { save.disabled = false; }
    if (!result || result.ok !== true) {
      error.textContent = plainOrDrop(SETTINGS_NOT_SAVED, 'settings-error');
      return;
    }
    settingsDraft = null; settingsDraftLift = null;
    /* The capture is durable now, so the cached read for this lift is stale: drop it
       and read the LOG again rather than painting what this mount remembers. */
    settingsRead.delete(view.lift.id);
    await startSettingsRead(view.lift.id);
  }

  /* ---------------- the active set ---------------- */
  function renderActive(view) {
    const root = template('t-gym');
    const map = slots(root);
    put(map, 'session-title', view.title || view.session.instruction.display);
    put(map, 'exercise-position', 'Exercise ' + view.lift.index + ' of ' + view.lift.count);
    put(map, 'lift', view.lift.label);

    const reasonHost = map.get('reason');
    const all = view.prescription.reason;
    lines(reasonHost, showWhy ? all : all.slice(0, 1), 'change');
    const why = root.querySelector('[data-action="why"]');
    why.closest('.change').hidden = all.length < 2;
    why.addEventListener('click', () => { showWhy = !showWhy; paint(); });

    const setupNote = map.get('setup-note');
    const setupLink = root.querySelector('[data-action="setup"]');
    if (view.prescription.setup) {
      lines(setupNote, showSetup ? [view.prescription.setup] : [], 'small quiet');
      setupLink.addEventListener('click', () => { showSetup = !showSetup; paint(); });
    } else { setupLink.hidden = true; setupNote.hidden = true; }

    const strip = map.get('strip');
    strip.replaceChildren();
    for (const entryOf of view.strip) {
      const cell = doc.createElement('div');
      cell.className = 'slot' + (entryOf.done ? ' done' : entryOf.current ? ' current' : '');
      if (entryOf.current) cell.setAttribute('aria-current', 'step');
      cell.append(doc.createTextNode(plainOrDrop(entryOf.label, 'strip-label')));
      const strong = doc.createElement('strong');
      strong.textContent = plainOrDrop(entryOf.text, 'strip-text');
      cell.append(strong);
      strip.append(cell);
    }

    put(map, 'plan', view.prescription.line);
    put(map, 'effort-target', view.prescription.effort);
    settingsPaint(root, map, view);
    put(map, 'entry-title', 'What you did · Set ' + view.set.position);
    put(map, 'previous', view.previous);

    const load = root.querySelector('#gym-weight');
    const reps = root.querySelector('#gym-reps');
    load.value = held.entry.load === null ? (view.entry.load === null ? '' : String(view.entry.load)) : held.entry.load;
    reps.value = held.entry.reps === null ? (view.entry.reps === null ? '' : String(view.entry.reps)) : held.entry.reps;
    load.addEventListener('input', () => { held.entry.load = load.value; });
    reps.addEventListener('input', () => { held.entry.reps = reps.value; });
    for (const button of root.querySelectorAll('[data-step]')) {
      const [field, direction] = button.dataset.step.split(':');
      const size = field === 'load' ? (view.entry.step === null ? null : view.entry.step) : 1;
      if (size === null) { button.disabled = true; continue; }
      button.addEventListener('click', () => {
        const box = field === 'load' ? load : reps;
        const current = Number(box.value);
        const next = (Number.isFinite(current) ? current : 0) + Number(direction) * size;
        box.value = String(Math.max(0, Math.round(next * 100) / 100));
        held.entry[field] = box.value;
      });
    }

    const choices = map.get('choices');
    choices.replaceChildren();
    for (const choice of model.effortChoices()) {
      const button = doc.createElement('button');
      button.className = 'choice';
      button.type = 'button';
      button.textContent = plainOrDrop(choice.label, 'effort-choice');
      // NOTHING is preselected: every answer starts aria-pressed="false".
      button.setAttribute('aria-pressed', String(!!held.effort && held.effort.label === choice.label));
      button.addEventListener('click', () => {
        held.effort = choice;
        for (const other of choices.querySelectorAll('.choice')) other.setAttribute('aria-pressed', String(other === button));
        root.querySelector('#gym-error').textContent = '';
      });
      choices.append(button);
    }

    /* A3 — the approved design's own route to the check-in, from inside the workout
       flow. It is shown only when the page actually gave the card that route; the
       card itself knows nothing about check-ins. */
    const toCheckIn = root.querySelector('[data-action="checkin"]');
    if (toCheckIn) {
      toCheckIn.hidden = typeof onCheckIn !== 'function';
      if (typeof onCheckIn === 'function') toCheckIn.addEventListener('click', () => onCheckIn());
    }

    const help = root.querySelector('[data-action="clean-rep"]');
    const helpNote = map.get('clean-rep-note');
    lines(helpNote, showHelp ? CLEAN_REP_HELP : [], 'small quiet');
    help.addEventListener('click', () => { showHelp = !showHelp; paint(); });

    put(map, 'log-label', 'Log set ' + view.set.position);
    const button = map.get('log');
    button.addEventListener('click', async event => {
      event.preventDefault();
      if (busy) return;
      busy = true;
      const result = await model.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
        load: load.value.trim(), reps: reps.value.trim(), effort: held.effort && held.effort.reserve });
      busy = false;
      if (!result.ok) {
        root.querySelector('#gym-error').textContent = plainOrDrop(refusalText(result), 'gym-error');
        return;
      }
      held.entry = { load: null, reps: null };
      held.effort = null; showWhy = false; showSetup = false; showHelp = false;
      await paint();
      if (onChanged) onChanged();
    });

    const upNext = view.upNext;
    put(map, 'up-next', upNext ? upNext.label : '');
    if (!upNext) root.querySelector('.next-lift').hidden = true;

    root.querySelector('[data-action="back"]').addEventListener('click', () => onBack());
    if (view.message) root.querySelector('#gym-error').textContent = plainOrDrop(refusalText(view.message), 'gym-error');
    icons(root);
    show(root);
  }

  async function finishNow(view) {
    busy = true;
    const result = await model.finish({ startId: view.startId });
    busy = false;
    if (!result.ok) { refusalScreen(view, result); return; }
    if (onChanged) onChanged();
    onBack();
  }

  /* Every slot is recorded but this device has no saved set to show on the rest
     screen — reachable once a skip is wired (A3/A4), and before this branch existed
     it fell through to renderActive and read `.lift` off a null active slot. The
     athlete gets the rest screen with the finish action and no invented saved fact. */
  function renderComplete(view) {
    const root = template('t-rest');
    const map = slots(root);
    put(map, 'session-title', view.title || view.session.instruction.display);
    put(map, 'exercise-position', '');
    put(map, 'lift', view.session.instruction.display);
    lines(map.get('reason'), [], 'change');
    root.querySelector('.saved-block').hidden = true;
    put(map, 'rest-note', NO_REST_PRESCRIBED);
    put(map, 'next-label', '');
    put(map, 'next-plan', '');
    put(map, 'next-effort', '');
    put(map, 'primary-label', FINISH_WORKOUT);
    map.get('primary').addEventListener('click', () => { if (!busy) finishNow(view); });
    for (const el of root.querySelectorAll('[data-action="back"]')) el.addEventListener('click', () => onBack());
    icons(root);
    show(root);
  }

  /* ---------------- the saved set and the rest ---------------- */
  function renderSaved(view) {
    const root = template('t-rest');
    const map = slots(root);
    put(map, 'session-title', view.title || view.session.instruction.display);
    put(map, 'exercise-position', 'Exercise ' + view.lift.index + ' of ' + view.lift.count);
    put(map, 'lift', view.lift.label);
    lines(map.get('reason'), view.reasonLines.slice(0, 1), 'change');
    put(map, 'saved-title', 'Set ' + view.saved.position + ' logged');
    put(map, 'saved-facts', view.saved.facts);
    put(map, 'rest-note', NO_REST_PRESCRIBED);

    const next = view.next;
    put(map, 'next-label', next
      ? (next.sameLift ? 'Next · Set ' + next.position + ' of ' + next.count : 'Next · ' + next.label)
      : view.lift.label + ' complete');
    put(map, 'next-plan', next ? next.line : '');
    put(map, 'next-effort', next ? next.effort : '');

    put(map, 'primary-label', next ? 'Ready for set ' + next.position : FINISH_WORKOUT);
    map.get('primary').addEventListener('click', async () => {
      if (busy) return;
      if (next) { model.forget(); await paint(); return; }
      await finishNow(view);
    });

    root.querySelector('[data-action="undo"]').addEventListener('click', async () => {
      if (busy) return;
      busy = true;
      const result = await model.undo({ startId: view.startId, opId: view.saved.opId });
      busy = false;
      if (!result.ok) { put(map, 'rest-note', refusalText(result)); return; }
      await paint();
      if (onChanged) onChanged();
    });
    for (const el of root.querySelectorAll('[data-action="back"]')) el.addEventListener('click', () => onBack());
    icons(root);
    show(root);
  }

  /* The layer's own words, each part exactly ONCE (review B1). Several accepted
     refusals are thrown as an Error whose message IS the code and which carries no
     reason; gym-model already drops such a message rather than repeating it, and
     this dedupes anything that still coincides. */
  const refusalText = result => {
    const parts = [];
    for (const part of [result && result.copy, result && result.code]) {
      const value = typeof part === 'string' ? part.trim() : '';
      if (value && !parts.includes(value)) parts.push(value);
    }
    return parts.join(' · ');
  };
  const refusalScreen = (view, result) => stub(view,
    [COULD_NOT_PREPARE, result && result.copy && result.copy !== result.code ? result.copy : null]
      .filter(Boolean).join(' '),
    (result && result.code) || '');

  async function paint() {
    const view = await model.read();
    if (view.phase === 'blocked') return refusalScreen(view, view);
    if (view.phase === 'finished') return stub(view, WORKOUT_RECORDED,
      view.sets + (view.sets === 1 ? ' set' : ' sets') + ' recorded');
    if (view.phase === 'ready') {
      const started = await model.start();
      if (!started.ok) return refusalScreen(view, started);
      if (onChanged) onChanged();
      return paint();
    }
    /* D2 round 1, finding 1 - THE DURABLE SETTINGS READ USED TO BE AWAITED HERE, which
       made an OPTIONAL read a prerequisite for painting the workout: with a pending
       read there was no active set and no log control at all. It is gone. The block
       reads the log per exercise id, started from settingsPaint and applied in its own
       repaint, so the card renders and the set is logged whether that read is pending,
       finished or failed. */
    if (view.phase === 'saved') return renderSaved(view);
    /* Every slot recorded but no saved set to show — reachable once a skip is wired
       (A3/A4): offer the finish rather than crashing on an absent active slot. */
    if (view.phase === 'complete') return renderComplete(view);
    return renderActive(view);
  }

  /* The first paint, as every existing caller already awaits. The settings handles
     ride ON that promise rather than replacing it, so `await mountGym(...)` still
     means "the card is on the screen": a durable capture is several turns of the
     event loop, and a check that polls the log needs to know when it has settled. */
  const first = paint();
  first.settings = Object.freeze({
    pending: () => settingsSaving,
    ready: () => settingsOpening,
    lane: () => settingsLane,
    /* The optional read, exposed so a CHECK can wait for it. Nothing on the card
       waits for it, which is the whole point of finding 1. */
    read: () => settingsReading,
    stateFor: (liftId) => (settingsRead.has(liftId) ? settingsRead.get(liftId).state : 'reading'),
  });
  return first;
}

export default { mountGym, newGymDraft, CHECK, NO_REST_PRESCRIBED, COULD_NOT_PREPARE, WORKOUT_RECORDED,
  CLEAN_REP_HELP, FINISH_WORKOUT,
  SETTINGS_HEAD, SETTINGS_NONE, SETTINGS_OPEN, SETTINGS_EDITOR_TITLE, SETTINGS_NAME_LABEL,
  SETTINGS_VALUE_LABEL, SETTINGS_CUE_LABEL, SETTINGS_CUES_LEAD, SETTINGS_ADD, SETTINGS_REMOVE,
  SETTINGS_SAVE, SETTINGS_CANCEL, SETTINGS_NOTHING, SETTINGS_REFUSED, SETTINGS_NOT_SAVED,
  SETTINGS_READING, SETTINGS_UNREAD, SETTINGS_UNREAD_ACTION };
