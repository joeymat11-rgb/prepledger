// gym-app.mjs — the gym card's view: Refinement A's workout and saved-set/rest
// screens, bound slot by slot to the accepted capture layer through gym-model.mjs.
//
// It carries NO number and NO plan word of its own. Every slot is filled from the
// model's DTO; a slot with no value is filled with the cell's own words, never a
// placeholder figure. Refusals are printed exactly as the capture layer returned
// them — its code, and its copy when it supplied one.

import TodayApp from './today-app.cjs';

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

/* A3 review F7 — the card's TRANSIENT state (what is typed into the two boxes and
   which effort answer is chosen) lives in an object the caller may hold, so leaving
   the card for the check-in and coming straight back does not throw the athlete's
   half-entered set away. Nothing durable lives here: the moment a set is logged this
   is cleared, and a caller that passes nothing gets a fresh one — which is exactly
   what every existing caller and every A2 test does. */
export function newGymDraft() { return { effort: null, entry: { load: null, reps: null } }; }

export function mountGym(doc, phone, { model, onBack, onChanged, onCheckIn, draft } = {}) {
  if (!phone) throw new Error('Gym card: no host element');
  let busy = false;
  const held = draft && typeof draft === 'object' ? draft : newGymDraft();
  if (!Object.hasOwn(held, 'effort')) held.effort = null;   // NOTHING is preselected
  if (!held.entry || typeof held.entry !== 'object') held.entry = { load: null, reps: null };
  let showSetup = false, showWhy = false, showHelp = false;

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
    if (!el) throw new Error('Gym card: template slot missing — ' + name);
    el.textContent = text === null || text === undefined ? '' : String(text);
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
      p.textContent = value;
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
      cell.append(doc.createTextNode(entryOf.label));
      const strong = doc.createElement('strong');
      strong.textContent = entryOf.text;
      cell.append(strong);
      strip.append(cell);
    }

    put(map, 'plan', view.prescription.line);
    put(map, 'effort-target', view.prescription.effort);
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
      button.textContent = choice.label;
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
        root.querySelector('#gym-error').textContent = refusalText(result);
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
    if (view.message) root.querySelector('#gym-error').textContent = refusalText(view.message);
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
    if (view.phase === 'saved') return renderSaved(view);
    /* Every slot recorded but no saved set to show — reachable once a skip is wired
       (A3/A4): offer the finish rather than crashing on an absent active slot. */
    if (view.phase === 'complete') return renderComplete(view);
    return renderActive(view);
  }

  return paint();
}

export default { mountGym, newGymDraft, CHECK, NO_REST_PRESCRIBED, COULD_NOT_PREPARE, WORKOUT_RECORDED,
  CLEAN_REP_HELP, FINISH_WORKOUT };
