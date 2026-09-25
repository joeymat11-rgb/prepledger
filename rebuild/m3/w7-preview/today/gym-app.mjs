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
/* C-UI-4. The two form refusals the model owns, so the card can anchor each to the thing
   it names (W-19 under the numerals, W-20 on the effort row) without rewording either. */
import { CHOOSE_EFFORT, ENTER_PERFORMED } from './gym-model.mjs';

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
/* C-UI-4 round 3, W-21 (DECISIONS:820 (2): the board's words win). A set the layer refused
   is said as the board draws it: this lead sentence, then the layer's own reason (its copy
   and its code, each once, as review B1 requires) in the refusal's tail. Both are verbatim
   in app/states-workout.js and declared in design.cjs RUNTIME_COPY. */
export const SET_NOT_RECORDED = 'This set could not be recorded on this device, and no part of it was recorded.';
export const LAYER_REASON = 'The layer’s own reason: ';

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

export function mountGym(doc, phone, { model, onBack, onChanged, onCheckIn, onCoach, draft, settings } = {}) {
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
    phone.classList.remove('w-rest');
    return go();
  }
  const held = draft && typeof draft === 'object' ? draft : newGymDraft();
  if (!Object.hasOwn(held, 'effort')) held.effort = null;   // NOTHING is preselected
  if (!held.entry || typeof held.entry !== 'object') held.entry = { load: null, reps: null };
  let showSetup = false, showWhy = false, showHelp = false;
  /* W-21: the code of the last set the layer refused on this mount, so a repaint that
     carries the same remembered refusal keeps the board's dress. */
  let setRefusedCode = null;

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
  /* C-UI-4 - the set and rest screens are the pack's chassis: a scrolling .body and a
     fixed .stack that must be the two DIRECT children of the live .ui host (app.css
     ".screen .ui > .body" / "> .stack"), so these two templates are mounted whole, as a
     fragment, rather than as one wrapping element. Everything that must be reached
     after the mount is taken as an element reference before it: a fragment is empty
     once its children have moved onto the phone. */
  const chassis = id => {
    const node = doc.getElementById(id);
    if (!node) throw new Error('Gym card: missing approved template ' + id);
    return node.content.cloneNode(true);
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
  /* C-UI-4 round 3 (DECISIONS:820 (2), (3); W-06 #talk-workout) - the board's coach pill.
     The coach is not live, so the pill does the one honest thing it can: it opens the Coach
     screen, which says so (C-61). It is drawn only when the page gives the card that route,
     exactly as the check-in row is; with no route there is nothing on the screen to tap. */
  function coachPill(root) {
    const voice = root.querySelector('#workout-voice');
    if (!voice) return;
    voice.hidden = typeof onCoach !== 'function';
    if (typeof onCoach === 'function') {
      hooks.listen(root.querySelector('#talk-workout'), 'click', () => leaveCard(() => onCoach()));
    }
  }
  /* D2 ROUND 2, R2-1 - MOUNT OWNERSHIP. `phone` is the page's ONE surface and every
     screen shares it. This mount owns it from the moment it is created until the
     athlete navigates away, and after that it owns nothing: a background read that
     settles a second later must not put the workout back over Today or over the
     check-in he is now filling in. `owns` is that ownership, `leaveCard` hands it over
     BEFORE the caller's navigation runs, and every write to the shared element goes
     through `show`, which refuses once ownership is gone. */
  function show(root, rest = false) {
    if (!owns) return;
    /* C-UI-4: taken before the mount, because a chassis fragment is empty after it. */
    const heading = root.querySelector('h1') || root.firstElementChild || root;
    phone.replaceChildren(root);
    /* The pack's rest-screen rule (states-workout.css ".ui.w-rest .log") sits on the
       host itself; every other screen of the card clears it. */
    phone.classList.toggle('w-rest', rest === true);
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
    /* C-UI-4 (F3): on the set screen the block is the pack's machine row. The view module
       (C-UI-5's, unchanged) still reads the store's answer into its own shape, but its list
       markup (a div per pair, a p for a sentence) and its open label are handed to
       detached holders, so none of it lands inside the button; the row is composed below
       from the same answer, as states-workout.js machine() draws it. */
    const blockSlots = new Map(map);
    for (const name of ['settings-list', 'settings-open-label']) blockSlots.set(name, doc.createElement('span'));
    MachineSettingsView.renderBlock(doc, blockSlots, { copy: SETTINGS_COPY, latest, state, put });
    /* The block's heading is the settings panel's title (W-35, C-UI-5), so the row does
       not repeat it; the view module still fills it, unchanged. */
    const blockHead = map.get('settings-head');
    if (blockHead) blockHead.hidden = true;
    /* W-06: the serif title is the stored setting itself ("Seat 4." on the board: each
       stored name and value, verbatim and in the stored order) and the sub line is the
       open label. W-33 / W-34 / W-36: the title is the open label and the sub line the
       reading, empty or unreadable sentence; W-36's action half is the note block under
       the row. A stored cue keeps its own sub line (the view module's settings-cues). */
    const stored = state === 'known' && latest && latest.machine ? latest.machine : null;
    const storedPairs = stored && Array.isArray(stored.settings) ? stored.settings : [];
    const shown = storedPairs.map((pair) => plainOrDrop(pair.name, 'settings-name') + ' '
      + plainOrDrop(pair.value, 'settings-value') + '.').join(' ');
    const when = state === 'failed' ? SETTINGS_UNREAD : state !== 'known' ? SETTINGS_READING
      : (!stored || (storedPairs.length === 0 && !stored.cues)) ? SETTINGS_NONE : '';
    put(map, 'machine-setting', shown ? shown : SETTINGS_OPEN);
    put(map, 'machine-when', shown ? SETTINGS_OPEN : when);
    put(map, 'machine-note', state === 'failed' ? SETTINGS_UNREAD_ACTION : '');
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

  /* ---------------- the active set (C-UI-4: W-05 to W-21, W-32, W-42) ----------------
     The pack's board, bound to the capture. Nothing is added to it and nothing taken
     away except where a drawn state names the one thing it changes. */
  function renderActive(view) {
    const root = chassis('t-gym');
    const map = slots(root);
    put(map, 'session-title', view.title || view.session.instruction.display);
    put(map, 'lift', view.lift.label);
    /* The set strip is the pack's set dots: one per set of this lift, the recorded
       ones filled, the current one ringed, a skipped one faded (W-29's own class). */
    const dots = map.get('strip');
    dots.replaceChildren();
    for (const entryOf of view.strip) {
      const dot = doc.createElement('i');
      /* `slot` stays as the card's existing hook for its checks (ruling R2), beside the
         pack's own dot classes, exactly as `.choice` stays on the chips. */
      dot.className = 'slot' + (entryOf.done ? (entryOf.text === 'skipped' ? ' skip' : ' done') : entryOf.current ? ' now' : '');
      dots.append(dot);
    }
    put(map, 'set-count', 'Set ' + view.set.position + ' of ' + view.set.count);

    /* W-07 to W-13: the engine's own sentence under the lift name, the first line only,
       and a "Why?" that reveals the rest (W-13). */
    const all = view.prescription.reason;
    root.querySelector('.w-reasons').hidden = all.length === 0;
    put(map, 'reason', all.length ? all[0] : '');
    const why = root.querySelector('[data-action="why"]');
    why.hidden = all.length < 2;
    lines(map.get('reason-more'), showWhy ? all.slice(1) : [], 'w-reason w-more');
    hooks.listen(why, 'click', () => { showWhy = !showWhy; paint(); });

    /* The set card. The numerals are the entry itself: the prescribed figures, or what
       the athlete has typed over them, in the two real boxes the set is logged from. */
    /* W-06 (DECISIONS:820 (2)): the eyebrow is the board's static "Today’s set" and the
       state word "Unlogged" (template); the set's position is #set-count. */
    const load = root.querySelector('#gym-weight');
    const reps = root.querySelector('#gym-reps');
    const loadBox = root.querySelector('#w-value');
    const repsBox = root.querySelector('#r-value');
    load.value = held.entry.load === null ? (view.entry.load === null ? '' : String(view.entry.load)) : held.entry.load;
    reps.value = held.entry.reps === null ? (view.entry.reps === null ? '' : String(view.entry.reps)) : held.entry.reps;
    /* W-08 / W-09: a cell the engine did not specify has no figure to set in numerals,
       so the prescription is said as its own line, in the cell's own words, as the pack's
       prescLine draws it: each cell in its own span either side of the gold .w-presc-x.
       The line is the model's own (prescriptionLine joins the two cells with ' × '); a
       line in any other shape is said whole, never re-cut. */
    const plan = map.get('plan');
    const planLine = view.prescription.line;
    const planCells = planLine ? planLine.split(' × ') : [];
    plan.replaceChildren();
    if (planCells.length === 2) {
      const [left, times, right] = [doc.createElement('span'), doc.createElement('span'), doc.createElement('span')];
      left.textContent = plainOrDrop(planCells[0], 'plan');
      times.className = 'w-presc-x';
      times.textContent = '×';
      right.textContent = plainOrDrop(planCells[1], 'plan');
      plan.append(left, times, right);
    } else plan.textContent = plainOrDrop(planLine || '', 'plan');
    plan.hidden = !planLine || (view.entry.load !== null && view.entry.reps !== null);
    /* W-18 (DECISIONS:820 (2), (4)): with no load step on file the board's hint says so
       under the numerals; there are no +/- steps, so the box always takes typed entry. */
    map.get('step-hint').hidden = view.entry.step !== null;
    put(map, 'effort-target', view.prescription.effort);
    /* W-16 / W-17: the qualified comparison, or nothing at all (no guess, no empty row). */
    put(map, 'previous', view.previous);
    if (!view.previous) {
      root.querySelector('#last-time').hidden = true;
      root.querySelector('#setcard .divider').hidden = true;
    }

    const logLabel = map.get('log-label');
    /* The Log button carries the set it will record, with the multiplication sign
       (the pack's "Log 50 × 8"); with a box still empty it names the set instead. */
    const syncEntry = () => {
      /* An empty box is not dressed: the blank underline is W-19's mark alone (F4). */
      for (const input of [load, reps]) input.size = Math.max(1, input.value.length);
      const both = load.value.trim() !== '' && reps.value.trim() !== '';
      logLabel.textContent = plainOrDrop(both ? 'Log ' + load.value.trim() + ' × ' + reps.value.trim()
        : 'Log set ' + view.set.position, 'log-label');
    };
    syncEntry();

    const bindSettings = settingsPaint(root, map, view);
    /* W-14: the capture's own setup sentence, behind its link. */
    const setupNote = map.get('setup-note');
    const setupLink = root.querySelector('[data-action="setup"]');
    if (view.prescription.setup) {
      setupLink.hidden = false;
      setupNote.textContent = showSetup ? plainOrDrop(view.prescription.setup, 'setup-note') : '';
      setupNote.hidden = !showSetup;
      hooks.listen(setupLink, 'click', () => { showSetup = !showSetup; paint(); });
    } else { setupLink.hidden = true; setupNote.hidden = true; }

    /* Refusals, each anchored to the thing it names (states-workout.css): an entry the
       athlete left empty under the numerals, with the empty box marked (W-19); a missing
       effort answer on the effort row, which wears the mark (W-20); anything the layer
       refused in the stack above the Log it refused (W-21). ONE alert element carries
       them all, moved to its anchor, so a live refusal is the drawn state's element and
       the stack only grows upward: the Log button does not move. */
    const errorBox = root.querySelector('#gym-error');
    const rir = root.querySelector('#rir');
    const numerals = root.querySelector('#numerals');
    const logRow = root.querySelector('.stack .log-row');
    /* Which refusal is on the screen: 'entry' is W-19's, the one that names the boxes. */
    let refused = null;
    const clearRefusal = () => {
      refused = null;
      errorBox.textContent = '';
      errorBox.hidden = true;
      rir.classList.remove('is-invalid');
      loadBox.classList.remove('w-blank', 'is-invalid');
      repsBox.classList.remove('w-blank', 'is-invalid');
    };
    const refuse = (result, setRefused = false) => {
      clearRefusal();
      const text = result ? refusalText(result) : '';
      if (!text) return;
      const own = result && !result.code;
      if (own && result.copy === ENTER_PERFORMED) {
        refused = 'entry';
        errorBox.className = 'refusal note-block w-refusal w-card-refusal';
        numerals.insertAdjacentElement('afterend', errorBox);
        /* W-19: the empty box carries the mark, the pack's `value w-blank is-invalid`. */
        for (const [box, input] of [[loadBox, load], [repsBox, reps]]) {
          if (input.value.trim() === '') box.classList.add('w-blank', 'is-invalid');
        }
      } else {
        errorBox.className = 'refusal note-block w-refusal' + (own && result.copy === CHOOSE_EFFORT ? ' rir-refusal' : '');
        logRow.parentNode.insertBefore(errorBox, logRow);
        if (own && result.copy === CHOOSE_EFFORT) rir.classList.add('is-invalid');
      }
      if (setRefused && !own) {
        /* W-21 (DECISIONS:820 (2)): the board's lead, then the layer's own reason, its copy
           and its code each once (review B1), in the refusal's tail. */
        const lead = doc.createElement('span');
        lead.className = 'refusal-text';
        lead.textContent = SET_NOT_RECORDED;
        const tail = doc.createElement('span');
        tail.className = 'refusal-tail';
        tail.textContent = plainOrDrop(LAYER_REASON + text + (text.endsWith('.') ? '' : '.'), 'gym-error');
        errorBox.replaceChildren(lead, tail);
      } else errorBox.textContent = plainOrDrop(text, 'gym-error');
      errorBox.hidden = false;
    };
    /* Typing into the boxes answers W-19's refusal, so its sentence and its mark go
       (F7); a refusal about the effort answer or from the layer stays until answered. */
    const typed = () => { if (refused === 'entry') clearRefusal(); syncEntry(); };
    hooks.listen(load, 'input', () => { held.entry.load = load.value; typed(); });
    hooks.listen(reps, 'input', () => { held.entry.reps = reps.value; typed(); });

    /* The five locked RIR chips (BRIEF-RIR-DISPLAY), nothing preselected. `.choice`
       stays beside the pack's `.chip` as the card's own hook for its existing checks. */
    const choices = map.get('choices');
    choices.replaceChildren();
    for (const choice of model.effortChoices()) {
      const unsure = !!choice.reserve && choice.reserve.tag === 'unknown';
      const button = doc.createElement('button');
      button.className = 'chip choice' + (unsure ? ' unsure' : '');
      button.type = 'button';
      button.setAttribute('data-rir', unsure ? 'unsure' : choice.label);
      button.textContent = plainOrDrop(choice.label, 'effort-choice');
      // NOTHING is preselected: every answer starts aria-pressed="false".
      button.setAttribute('aria-pressed', String(!!held.effort && held.effort.label === choice.label));
      hooks.listen(button, 'click', () => {
        held.effort = choice;
        for (const other of choices.querySelectorAll('.chip')) other.setAttribute('aria-pressed', String(other === button));
        clearRefusal();
      });
      choices.append(button);
    }

    /* A3 / W-42 - the approved design's own route to the check-in, from inside the
       workout flow. It is shown only when the page actually gave the card that route;
       the card itself knows nothing about check-ins. */
    const toCheckIn = root.querySelector('[data-action="checkin"]');
    if (toCheckIn) {
      toCheckIn.hidden = typeof onCheckIn !== 'function';
      if (typeof onCheckIn === 'function') {
        hooks.listen(toCheckIn, 'click', () => leaveCard(() => onCheckIn()));
      }
    }

    /* W-15: the clean rep help opens under the chips, in the stack, which grows upward. */
    const help = root.querySelector('[data-action="clean-rep"]');
    const helpNote = map.get('clean-rep-note');
    lines(helpNote, showHelp ? CLEAN_REP_HELP : [], '');
    hooks.listen(help, 'click', () => { showHelp = !showHelp; paint(); });

    const logOutcome = async (outcome) => {
      if (!outcome || outcome.kind !== 'gym-result' || outcome.action !== 'logSet') return;
      const result = outcome.result;
      if (!result.ok) { setRefusedCode = result.code || null; refuse(result, !!result.code); return; }
      setRefusedCode = null;
      held.entry = { load: null, reps: null };
      held.effort = null; showWhy = false; showSetup = false; showHelp = false;
      await paint();
      if (onChanged) onChanged();
    };

    hooks.listen(root.querySelector('[data-action="back"]'), 'click', () => leaveCard(() => onBack()));
    if (view.message) refuse(view.message, !!view.message.code && view.message.code === setRefusedCode);
    coachPill(root);
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
     screen, reachable once a skip is wired (A3/A4), and before this branch existed
     it fell through to renderActive and read `.lift` off a null active slot. The
     athlete gets the rest screen with the finish action and no invented saved fact.
     C-UI-4 / W-28: the rest chassis with the set card hidden, no next set, no Undo. */
  function renderComplete(view) {
    const root = chassis('t-rest');
    const map = slots(root);
    put(map, 'session-title', view.title || view.session.instruction.display);
    put(map, 'saved-title', view.session.instruction.display);
    root.querySelector('.w-reasons').hidden = true;
    put(map, 'reason', '');
    map.get('saved-block').hidden = true;
    put(map, 'entry-title', '');
    put(map, 'saved-facts', '');
    put(map, 'rest-note', NO_REST_PRESCRIBED);
    put(map, 'next-label', '');
    put(map, 'next-plan', '');
    put(map, 'next-effort', '');
    map.get('next-block').hidden = true;
    root.querySelector('[data-action="undo"]').hidden = true;
    put(map, 'primary-label', FINISH_WORKOUT);
    for (const el of root.querySelectorAll('[data-action="back"]')) {
      hooks.listen(el, 'click', () => leaveCard(() => onBack()));
    }
    coachPill(root);
    icons(root);
    show(root, true);
    hooks.bindGymAction('finish', () => undefined, (outcome) => finishOutcome(view, outcome));
  }

  /* ---------------- the saved set and the rest (C-UI-4: W-22 to W-26, W-43) ----------------
     The same screen repainted: the title says what happened, the set card carries the
     stored facts, the rest line is always said and there is no timer, the next set is
     named with its prescription, and Undo takes the Edit button's place beside Log. */
  function renderSaved(view) {
    const root = chassis('t-rest');
    const map = slots(root);
    const next = view.next;
    put(map, 'session-title', view.title || view.session.instruction.display);
    put(map, 'saved-title', next ? 'Set ' + view.saved.position + ' logged' : view.lift.label + ' complete');
    const reasonLines = view.reasonLines.slice(0, 1);
    root.querySelector('.w-reasons').hidden = reasonLines.length === 0;
    put(map, 'reason', reasonLines.length ? reasonLines[0] : '');
    put(map, 'entry-title', 'What you did · Set ' + view.saved.position);
    put(map, 'saved-facts', view.saved.facts);
    /* F2: the same set card, repainted (states-workout.js rest()): the numerals keep the
       stored set's own figures, read back out of the facts line the model composed from
       the stored operation ("<load> lb × <reps> reps · ..."); a line in any other
       shape draws no figures rather than a guessed one. */
    const logged = /^(.+?) lb × (.+?) reps · /.exec(view.saved.facts || '');
    put(map, 'rest-load', logged ? logged[1] : '');
    put(map, 'rest-reps', logged ? logged[2] : '');
    root.querySelector('#numerals').hidden = !logged;
    const restNote = put(map, 'rest-note', NO_REST_PRESCRIBED);

    put(map, 'next-label', next
      ? (next.sameLift ? 'Next · Set ' + next.position + ' of ' + next.count : 'Next · ' + next.label)
      : '');
    put(map, 'next-plan', next ? next.line : '');
    put(map, 'next-effort', next ? next.effort : '');
    map.get('next-block').hidden = !next;

    /* W-22 (DECISIONS:820 (2)): the board's own "Start set N". */
    put(map, 'primary-label', next ? 'Start set ' + next.position : FINISH_WORKOUT);
    const primaryOutcome = async (outcome) => {
      if (next) { await paint(); return; }
      await finishOutcome(view, outcome);
    };
    const undoOutcome = async (outcome) => {
      if (!outcome || outcome.kind !== 'gym-result' || outcome.action !== 'undo') return;
      const result = outcome.result;
      /* W-26: the rest line is replaced by the layer's own refusal, in the refusal's dress. */
      if (!result.ok) {
        put(map, 'rest-note', refusalText(result));
        restNote.className = 'refusal note-block w-refusal';
        return;
      }
      await paint();
      if (onChanged) onChanged();
    };
    for (const el of root.querySelectorAll('[data-action="back"]')) {
      hooks.listen(el, 'click', () => leaveCard(() => onBack()));
    }
    coachPill(root);
    icons(root);
    show(root, true);
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
    const viewLift = view.lift && typeof view.lift.id === 'string' ? view.lift.id : null;
    const viewStart = typeof view.startId === 'string' ? view.startId : null;
    const sameSettingsContext = settingsDraftLift === viewLift && settingsDraftStart === viewStart;
    if (settingsEditorToken && (view.phase !== 'active' || !sameSettingsContext)) {
      /* Saved is a temporary screen inside the same workout/lift. Its lane view has
         already retired the old editor token, so retain only a detached draft and
         let the next active view mint fresh editor authority. Every other departure
         clears the carry exactly as before. */
      const carryAcrossSaved = view.phase === 'saved' && sameSettingsContext;
      if (carryAcrossSaved) rememberSettings(view, settingsErrors.get(settingsEditorToken) || '');
      hooks.settingsEditClosed(settingsEditorToken);
      settingsDraft = null; settingsDraftStart = null; settingsDraftLift = null; settingsEditorToken = null;
      if (!carryAcrossSaved) clearSettingsCarry();
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
