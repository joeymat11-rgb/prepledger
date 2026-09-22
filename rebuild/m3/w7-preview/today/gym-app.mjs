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
/* THE SPLIT (spec B.9). The settings lane, its read cache and the two functions that
   open and read it are sealed in this module; what comes back is three frozen objects. */
import { createGymSettingsLane } from './gym-settings-lane.mjs';

const { plainOrDrop } = PlainCopy;
/* REVIEW R1 FINDING 2 - the two headings the stub screen falls back to when the card
   is handed no title (S6 item 3 hands it none on a day the engine's stamp does not
   describe). Both are today-app.cjs's own declared sentences, already bound by
   design.cjs and already checked ABSENT from the approved references, so the stub
   screen gains a true heading without this file inventing a word. */
const { ARROW, WORKOUT_CANNOT_OPEN, WORKOUT_RECORDED_TODAY } = TodayApp;
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
/* A supplied gym draft is the public lifetime of one transient card across remounts.
   Keep the settings editor's editable state beside that object, never inside the
   durable payload and never with its old token or control authority. */
const SETTINGS_DRAFT_CARRY = new WeakMap();

export function mountGym(doc, phone, { model, onBack, onChanged, onCheckIn, draft, settings } = {}) {
  if (!phone) throw new Error('Gym card: no host element');
  /* D2 round 2, R2-1 - see `show`. True while THIS mount is the screen on the phone. */
  let owns = true;
  /* Navigation, of every kind: ownership is handed over BEFORE the page moves, so a
     read, a save or any other deferred work that settles afterwards has nothing to
     paint onto. Nothing is cancelled and nothing is thrown; the answer simply arrives
     to a mount that is no longer the screen. */
  function leaveCard(go) {
    owns = false;
    hooks.leave();
    return go();
  }
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
  /* The card receives detached reads through `facade`, lifecycle and sealed bindings
     through `hooks`, and the exactly pinned public passthrough through `api`. The lane
     receives only this phone and the one-entry repaint handle; writer commands and editor
     identities stay private to it. */
  const painter = Object.freeze({ repaint: () => paint() });
  const { facade, hooks, api } = createGymSettingsLane(doc, phone, model, settings, painter);
  let settingsDraft = null;       // non-null only while the editor is open
  let settingsDraftStart = null;  // the actual workout this editor belongs to
  let settingsDraftLift = null;   // the lift that draft belongs to
  let settingsEditorToken = null;
  let settingsDraftRevision = 0;  // input identity inside one editor token
  // A repaint replaces DOM nodes, not the draft's refusal. Weak keys also keep a
  // delayed result from assigning the old draft's message to a replacement draft.
  const settingsErrors = new WeakMap();
  const settingsSubmittedRevisions = new WeakMap();
  const clearSettingsCarry = () => SETTINGS_DRAFT_CARRY.delete(held);
  const rememberSettings = (view, error) => {
    if (!owns || !settingsDraft || !view || typeof view.startId !== 'string'
      || !view.lift || typeof view.lift.id !== 'string') return;
    SETTINGS_DRAFT_CARRY.set(held, Object.freeze({ startId: view.startId, liftId: view.lift.id,
      draft: { rows: settingsDraft.rows.map((row) => ({ name: row.name, value: row.value })),
        cues: settingsDraft.cues }, revision: settingsDraftRevision,
      error: typeof error === 'string' ? error : '' }));
  };



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
  /* D2 ROUND 2, R2-1 - MOUNT OWNERSHIP. `phone` is the page's ONE surface and every
     screen shares it. This mount owns it from the moment it is created until the
     athlete navigates away, and after that it owns nothing: a background read that
     settles a second later must not put the workout back over Today or over the
     check-in he is now filling in. `owns` is that ownership, `leaveCard` hands it over
     BEFORE the caller's navigation runs, and every write to the shared element goes
     through `show`, which refuses once ownership is gone. */
  function show(root) {
    if (!owns) return;
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

  /* `head` is what the screen is called when the card has no title of its own.
     REVIEW R1 FINDING 2: this used to be `view.title || ''`, which was harmless only
     while the card was ALWAYS handed the engine's next-session stamp. Since S6 item 3
     withholds that stamp on a day it does not describe, `view.title` is null on both
     screens this paints - the refusal and the recorded workout - and the fallbacks at
     renderActive/renderComplete/renderSaved cannot serve here: neither of these views
     carries a `session`. An h1 put to '' is also HIDDEN by put() and is the element
     show() then focuses, so the blank was a lost heading, not just a quiet one. Each
     caller names the heading true of ITS screen. */
  function stub(view, note, detail, head) {
    const root = template('t-workout');
    const map = slots(root);
    put(map, 'workout-title', view.title || head);
    put(map, 'stub-note', note);
    put(map, 'workout-detail', detail || '');
    hooks.listen(root.querySelector('[data-go="today"]'), 'click', event => {
      event.preventDefault(); leaveCard(() => onBack());
    });
    icons(root);
    show(root);
  }

  /* The block and the editor, painted onto the active set. With no lane both stay
     hidden and the card is exactly the card that shipped before this build. */
  function settingsPaint(root, map, view) {
    const block = map.get('settings-block');
    const editor = map.get('settings-editor');
    if (!block || !editor) return null;
    if (!facade.available()) { block.hidden = true; editor.hidden = true; hooks.open(); return null; }
    const liftId = view.lift && typeof view.lift.id === 'string' ? view.lift.id : null;
    if (!liftId) { block.hidden = true; editor.hidden = true; return null; }
    /* NOT AWAITED. The read is started here and its answer arrives in its own repaint;
       this function, and therefore the whole card, is finished either way. */
    if (!facade.hasRead(liftId)) hooks.startRead(liftId);
    const entry = facade.entryFor(liftId);
    const state = entry ? entry.state : 'reading';
    const latest = entry ? entry.latest : null;
    MachineSettingsView.renderBlock(doc, map, { copy: SETTINGS_COPY, latest, state, put });
    const openControl = root.querySelector('[data-action="settings-open"]');
    /* UNTIL THE READ ANSWERS, THERE IS NOTHING TO CORRECT (finding 2). Offering the
       editor here would seed it from a null the athlete never chose. */
    if (state !== 'known') { openControl.disabled = true; editor.hidden = true; return null; }
    openControl.disabled = false;
    if (!settingsDraft || !settingsEditorToken) {
      const carried = SETTINGS_DRAFT_CARRY.get(held);
      if (carried && carried.startId === view.startId && carried.liftId === liftId) {
        const reopened = hooks.settingsEditOpened();
        if (reopened) {
          settingsEditorToken = reopened.editorToken;
          settingsDraft = { rows: carried.draft.rows.map((row) => ({ name: row.name, value: row.value })),
            cues: carried.draft.cues };
          settingsDraftStart = carried.startId;
          settingsDraftLift = carried.liftId;
          settingsDraftRevision = carried.revision;
          if (carried.error) settingsErrors.set(settingsEditorToken, carried.error);
          rememberSettings(view, carried.error);
        }
      } else if (carried) clearSettingsCarry();
    }
    hooks.listen(openControl, 'click', () => {
      const opened = hooks.settingsEditOpened();
      if (!opened) return;
      settingsEditorToken = opened.editorToken;
      settingsDraft = MachineSettingsView.draftFrom(opened.latest);
      settingsDraftStart = view.startId;
      settingsDraftLift = liftId;
      settingsDraftRevision = 0;
      rememberSettings(view, '');
      paint();
    });
    if (!settingsDraft || !settingsEditorToken || settingsDraftLift !== liftId) {
      editor.hidden = true;
      return null;
    }
    editor.hidden = false;
    const paintedDraft = settingsDraft;
    const paintedToken = settingsEditorToken;
    MachineSettingsView.renderEditor(doc, map, { copy: SETTINGS_COPY, draft: paintedDraft, put,
      onChanged: () => {
        if (settingsDraft !== paintedDraft || settingsEditorToken !== paintedToken) return;
        settingsDraftRevision += 1;
        rememberSettings(view, settingsErrors.get(paintedToken) || '');
        paint();
      } });
    hooks.listen(editor, 'input', () => {
      if (settingsDraft === paintedDraft && settingsEditorToken === paintedToken
        && editor.isConnected && phone.contains(editor)) {
        settingsDraftRevision += 1;
        rememberSettings(view, settingsErrors.get(paintedToken) || '');
      }
    });
    map.get('settings-error').textContent = plainOrDrop(settingsErrors.get(paintedToken) || '', 'settings-error');
    hooks.listen(root.querySelector('[data-action="settings-cancel"]'), 'click', () => {
      /* CANCELLING WRITES NOTHING. The draft is thrown away and the durable record is
         whatever it already was; the athlete is returned to the block. */
      if (!owns || settingsDraft !== paintedDraft || settingsEditorToken !== paintedToken) return;
      hooks.settingsEditClosed(paintedToken);
      settingsDraft = null; settingsDraftStart = null; settingsDraftLift = null; settingsEditorToken = null;
      clearSettingsCarry();
      settingsDraftRevision = 0; paint();
    });
    const save = map.get('settings-save');
    save.disabled = facade.settingsBusy();
    return () => hooks.bindSettingsSave(paintedToken,
      () => {
        settingsSubmittedRevisions.set(paintedToken, settingsDraftRevision);
        return { rows: paintedDraft.rows, cues: paintedDraft.cues, revision: settingsDraftRevision };
      }, async (outcome) => {
        if (!outcome || outcome.kind === 'ignored') return;
        if (outcome.editorToken !== paintedToken) return;
        if (outcome.kind === 'saved') {
          if (settingsEditorToken === paintedToken) {
            const submittedRevision = settingsSubmittedRevisions.get(paintedToken);
            const revised = Number.isSafeInteger(submittedRevision)
              && settingsDraftRevision !== submittedRevision;
            if (revised) {
              const message = settingsErrors.get(paintedToken) || '';
              const reopened = hooks.settingsEditOpened();
              if (!reopened) return;
              settingsEditorToken = reopened.editorToken;
              if (message) settingsErrors.set(settingsEditorToken, message);
              rememberSettings(view, message);
            } else {
              settingsDraft = null; settingsDraftStart = null; settingsDraftLift = null; settingsEditorToken = null;
              clearSettingsCarry();
              settingsDraftRevision = 0;
            }
          }
          await paint();
          return;
        }
        const message = outcome.kind === 'not-saved' ? SETTINGS_NOT_SAVED
          : outcome.reason === 'empty' ? SETTINGS_NOTHING : SETTINGS_REFUSED;
        settingsErrors.set(paintedToken, message);
        rememberSettings(view, message);
        const current = phone.querySelector('[data-slot="settings-error"]');
        if (owns && settingsEditorToken === paintedToken && current) {
          current.textContent = plainOrDrop(message, 'settings-error');
        }
      });
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
    hooks.listen(why, 'click', () => { showWhy = !showWhy; paint(); });

    const setupNote = map.get('setup-note');
    const setupLink = root.querySelector('[data-action="setup"]');
    if (view.prescription.setup) {
      lines(setupNote, showSetup ? [view.prescription.setup] : [], 'small quiet');
      hooks.listen(setupLink, 'click', () => { showSetup = !showSetup; paint(); });
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
    const bindSettings = settingsPaint(root, map, view);
    put(map, 'entry-title', 'What you did · Set ' + view.set.position);
    put(map, 'previous', view.previous);

    const load = root.querySelector('#gym-weight');
    const reps = root.querySelector('#gym-reps');
    load.value = held.entry.load === null ? (view.entry.load === null ? '' : String(view.entry.load)) : held.entry.load;
    reps.value = held.entry.reps === null ? (view.entry.reps === null ? '' : String(view.entry.reps)) : held.entry.reps;
    hooks.listen(load, 'input', () => { held.entry.load = load.value; });
    hooks.listen(reps, 'input', () => { held.entry.reps = reps.value; });
    for (const button of root.querySelectorAll('[data-step]')) {
      const [field, direction] = button.dataset.step.split(':');
      const size = field === 'load' ? (view.entry.step === null ? null : view.entry.step) : 1;
      if (size === null) { button.disabled = true; continue; }
      hooks.listen(button, 'click', () => {
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
      hooks.listen(button, 'click', () => {
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
      if (typeof onCheckIn === 'function') {
        hooks.listen(toCheckIn, 'click', () => leaveCard(() => onCheckIn()));
      }
    }

    const help = root.querySelector('[data-action="clean-rep"]');
    const helpNote = map.get('clean-rep-note');
    lines(helpNote, showHelp ? CLEAN_REP_HELP : [], 'small quiet');
    hooks.listen(help, 'click', () => { showHelp = !showHelp; paint(); });

    put(map, 'log-label', 'Log set ' + view.set.position);
    const logOutcome = async (outcome) => {
      if (!outcome || outcome.kind !== 'gym-result' || outcome.action !== 'logSet') return;
      const result = outcome.result;
      if (!result.ok) {
        root.querySelector('#gym-error').textContent = plainOrDrop(refusalText(result), 'gym-error');
        return;
      }
      held.entry = { load: null, reps: null };
      held.effort = null; showWhy = false; showSetup = false; showHelp = false;
      await paint();
      if (onChanged) onChanged();
    };

    const upNext = view.upNext;
    put(map, 'up-next', upNext ? upNext.label : '');
    if (!upNext) root.querySelector('.next-lift').hidden = true;

    hooks.listen(root.querySelector('[data-action="back"]'), 'click', () => leaveCard(() => onBack()));
    if (view.message) root.querySelector('#gym-error').textContent = plainOrDrop(refusalText(view.message), 'gym-error');
    icons(root);
    show(root);
    if (bindSettings) bindSettings();
    hooks.bindGymAction('logSet', () => ({ load: load.value, reps: reps.value, effort: held.effort }), logOutcome);
  }

  async function finishOutcome(view, outcome) {
    if (!outcome || outcome.kind !== 'gym-result' || outcome.action !== 'finish') return;
    const result = outcome.result;
    if (!result.ok) { refusalScreen(view, result); return; }
    if (onChanged) onChanged();
    leaveCard(() => onBack());
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
    for (const el of root.querySelectorAll('[data-action="back"]')) {
      hooks.listen(el, 'click', () => leaveCard(() => onBack()));
    }
    icons(root);
    show(root);
    hooks.bindGymAction('finish', () => undefined, (outcome) => finishOutcome(view, outcome));
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
    const primaryOutcome = async (outcome) => {
      if (next) { await paint(); return; }
      await finishOutcome(view, outcome);
    };
    const undoOutcome = async (outcome) => {
      if (!outcome || outcome.kind !== 'gym-result' || outcome.action !== 'undo') return;
      const result = outcome.result;
      if (!result.ok) { put(map, 'rest-note', refusalText(result)); return; }
      await paint();
      if (onChanged) onChanged();
    };
    for (const el of root.querySelectorAll('[data-action="back"]')) {
      hooks.listen(el, 'click', () => leaveCard(() => onBack()));
    }
    icons(root);
    show(root);
    hooks.bindGymAction(next ? 'forget' : 'finish', () => undefined, primaryOutcome);
    hooks.bindGymAction('undo', () => undefined, undoOutcome);
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
    (result && result.code) || '', WORKOUT_CANNOT_OPEN);

  async function paint() {
    /* D2 round 2, R2-1 - a repaint asked for by work that started while this mount WAS
       the screen, and answered after the athlete left it, paints nothing. The read
       still resolves and is still cached; it simply has no surface to claim. */
    if (!owns) return null;
    const view = await hooks.readView();
    if (!owns) return null;
    if (!view) return null;
    const activeLift = view.phase === 'active' && view.lift ? view.lift.id : null;
    const activeStart = view.phase === 'active' ? view.startId : null;
    if (settingsEditorToken && (settingsDraftLift !== activeLift || settingsDraftStart !== activeStart)) {
      hooks.settingsEditClosed(settingsEditorToken);
      settingsDraft = null; settingsDraftStart = null; settingsDraftLift = null; settingsEditorToken = null;
      clearSettingsCarry();
      settingsDraftRevision = 0;
    }
    if (view.phase === 'blocked') return hooks.paint(() => refusalScreen(view, view));
    if (view.phase === 'finished') return hooks.paint(() => stub(view, WORKOUT_RECORDED,
      view.sets + (view.sets === 1 ? ' set' : ' sets') + ' recorded', WORKOUT_RECORDED_TODAY));
    if (view.phase === 'ready') {
      const started = await model.start();
      if (!started.ok) return hooks.paint(() => refusalScreen(view, started));
      if (onChanged) onChanged();
      return paint();
    }
    /* D2 round 1, finding 1 - THE DURABLE SETTINGS READ USED TO BE AWAITED HERE, which
       made an OPTIONAL read a prerequisite for painting the workout: with a pending
       read there was no active set and no log control at all. It is gone. The block
       reads the log per exercise id, started from settingsPaint and applied in its own
       repaint, so the card renders and the set is logged whether that read is pending,
       finished or failed. */
    if (view.phase === 'saved') return hooks.paint(() => renderSaved(view));
    /* Every slot recorded but no saved set to show — reachable once a skip is wired
       (A3/A4): offer the finish rather than crashing on an absent active slot. */
    if (view.phase === 'complete') return hooks.paint(() => renderComplete(view));
    return hooks.paint(() => renderActive(view));
  }

  /* The first paint, as every existing caller already awaits. The settings handles
     ride ON that promise rather than replacing it, so `await mountGym(...)` still
     means "the card is on the screen": a durable capture is several turns of the
     event loop, and a check that polls the log needs to know when it has settled. */
  const first = paint();
  first.settings = Object.freeze({
    pending: () => api.pending(),
    ready: () => api.ready(),
    lane: () => api.lane(),
    /* The optional read, exposed so a CHECK can wait for it. Nothing on the card
       waits for it, which is the whole point of finding 1. */
    read: () => api.read(),
    stateFor: (liftId) => api.stateFor(liftId),
    /* D2 round 2, R2-1 - whether THIS mount is still the screen on the phone. */
    owns: () => owns,
  });
  return first;
}

export default { mountGym, newGymDraft, CHECK, NO_REST_PRESCRIBED, COULD_NOT_PREPARE, WORKOUT_RECORDED,
  CLEAN_REP_HELP, FINISH_WORKOUT,
  SETTINGS_HEAD, SETTINGS_NONE, SETTINGS_OPEN, SETTINGS_EDITOR_TITLE, SETTINGS_NAME_LABEL,
  SETTINGS_VALUE_LABEL, SETTINGS_CUE_LABEL, SETTINGS_CUES_LEAD, SETTINGS_ADD, SETTINGS_REMOVE,
  SETTINGS_SAVE, SETTINGS_CANCEL, SETTINGS_NOTHING, SETTINGS_REFUSED, SETTINGS_NOT_SAVED,
  SETTINGS_READING, SETTINGS_UNREAD, SETTINGS_UNREAD_ACTION };
