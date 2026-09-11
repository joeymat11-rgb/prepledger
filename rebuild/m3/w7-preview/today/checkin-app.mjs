// checkin-app.mjs — the recovery check-in's view.
//
// It clones the approved t-recovery template and binds it to checkin-model.mjs. It
// carries NO question, NO choice and NO number of its own: every word on screen is
// either in the template (checked verbatim against the approved reference by
// design.cjs) or a declared preview-owned sentence from checkin-model.mjs.
//
// NOTHING IS PRESELECTED. The template ships every option with aria-pressed="false"
// and every <select> on its "Leave unanswered" row; this file never sets a pressed
// state the athlete did not press, and never fills a field the athlete left blank.
// Tapping a pressed option again clears it — the model owns that rule, this file
// just repaints what the model says.

import TodayApp from './today-app.cjs';
import Model from './checkin-model.mjs';
// The render boundary for the owner's no-dashes rule (DECISIONS:114 (1)).
import PlainCopy from './plain-copy.cjs';

const { plainCopy } = PlainCopy;
const { ARROW } = TodayApp;
const { SLEEP_KNOWN_LEAD, SLEEP_RECORD_PREFIX } = Model;

export function mountCheckIn(doc, phone, { model, onBack, onChanged } = {}) {
  if (!phone) throw new Error('Check-in: no host element');
  let busy = false;
  /* A repaint must not move the athlete's focus or close the note they opened: this
     screen repaints on every tap, and a heading that grabs focus each time would make
     the form unusable with a keyboard or a screen reader. The heading is focused once,
     when the screen is entered. */
  let entered = false, noteOpen = false;

  const template = id => {
    const node = doc.getElementById(id);
    if (!node) throw new Error('Check-in: missing approved template ' + id);
    return node.content.firstElementChild.cloneNode(true);
  };
  const slots = root => {
    const map = new Map();
    for (const el of root.querySelectorAll('[data-slot]')) if (!map.has(el.dataset.slot)) map.set(el.dataset.slot, el);
    return map;
  };
  function put(map, name, text) {
    const el = map.get(name);
    if (!el) throw new Error('Check-in: template slot missing: ' + name);
    el.textContent = plainCopy(text === null || text === undefined ? '' : String(text), name);
    el.hidden = text === null || text === undefined || text === '';
    return el;
  }

  function paint() {
    const view = model.read();
    const root = template('t-recovery');
    const map = slots(root);
    for (const el of root.querySelectorAll('[data-arrow]')) el.innerHTML = ARROW;
    const error = root.querySelector('#checkin-error');
    const locked = !!view.recorded;

    /* THE READ-BACK. Today's stored check-in, in the approved design's own question
       wording, with the provenance the durable operation itself carries. It is the
       ONLY thing on this screen that is not an unanswered question. */
    const recorded = map.get('recorded');
    recorded.replaceChildren();
    if (view.recorded) {
      const head = doc.createElement('p');
      head.textContent = plainCopy(view.recorded.provenance || '', 'recorded-provenance');
      head.hidden = !view.recorded.provenance;
      recorded.append(head);
      for (const line of view.recorded.lines) {
        const p = doc.createElement('p');
        p.className = 'fine';
        p.textContent = plainCopy(line, 'recorded-line');
        recorded.append(p);
      }
      /* The plan consequence, stated with the record it belongs to. A "saved" screen
         alone would imply the engine used these answers; it has not. */
      const consequence = doc.createElement('p');
      consequence.textContent = plainCopy(Model.PLAN_UNCHANGED, 'plan-unchanged');
      recorded.append(consequence);
      recorded.hidden = false;
    } else recorded.hidden = true;

    put(map, 'fine', locked ? Model.ALREADY_RECORDED : Model.NOTHING_YET);

    /* SLEEP — the existing dated night, reused with its provenance rather than asked
       for twice. The hours box is not even shown while the record stands unanswered:
       there is nothing to type. Saying "No — answer it here" reveals it. */
    const known = map.get('sleep-known');
    const ask = map.get('sleep-ask');
    const state = view.draft;
    const offered = !!view.sleepRecord && !locked;
    known.hidden = !offered;
    if (offered) {
      put(map, 'sleep-known-lead', SLEEP_KNOWN_LEAD);
      put(map, 'sleep-known-fact',
        SLEEP_RECORD_PREFIX + view.sleepRecord.date + ' · ' + view.sleepRecord.hours + ' h');
    }
    for (const button of root.querySelectorAll('[data-confirm]')) {
      const pressed = offered && (button.dataset.confirm === 'sleep'
        ? state.sleepConfirm === 'confirmed' : state.sleepConfirm === 'rejected');
      button.setAttribute('aria-pressed', String(pressed));
      /* A control behind a hidden block is not merely invisible: it is inert, so it
         can never be reached by a keyboard or a script and can never answer anything. */
      button.disabled = !offered;
      if (offered) button.addEventListener('click', () => {
        if (button.dataset.confirm === 'sleep') model.draft().confirmSleep();
        else model.draft().answerSleepHere();
        paint();
      });
    }
    ask.hidden = !state.askHours || locked;

    /* Every single-answer question. The template holds the approved words; this loop
       only reflects what the model currently holds and sends taps back to it. */
    for (const button of root.querySelectorAll('[data-group]')) {
      const group = button.dataset.group;
      const label = button.textContent.trim();
      button.setAttribute('aria-pressed', String(state.choices[group] === label));
      button.disabled = locked;
      button.addEventListener('click', () => { model.draft().choose(group, label); paint(); });
    }
    /* The multi-answer question. An issue NOT pressed is not a denial — it is
       silence, and silence stores nothing. */
    for (const button of root.querySelectorAll('[data-issue]')) {
      const name = button.dataset.issue;
      button.setAttribute('aria-pressed', String(state.issues[name]));
      button.disabled = locked;
      button.addEventListener('click', () => { model.draft().toggleIssue(name); paint(); });
    }
    /* Conditional detail. A branch that is not open is not merely invisible: the
       model has already cleared it, so nothing behind it can be submitted. */
    for (const block of root.querySelectorAll('[data-follow]')) {
      block.hidden = locked || !state.followups[block.dataset.follow];
    }
    for (const field of root.querySelectorAll('[data-field]')) {
      const name = field.dataset.field;
      field.value = state.fields[name] === undefined ? '' : state.fields[name];
      field.disabled = locked;
      const handler = () => { model.draft().set(name, field.value); if (error) error.textContent = ''; };
      field.addEventListener('input', handler);
      field.addEventListener('change', handler);
    }

    const primary = map.get('primary');
    primary.disabled = locked || busy;
    primary.addEventListener('click', async () => {
      if (busy || locked) return;
      busy = true;
      primary.disabled = true;
      const result = await model.save();
      busy = false;
      if (!result.ok) {
        if (error) error.textContent = plainCopy(result.copy, 'checkin-error');
        primary.disabled = false;
        return;
      }
      paint();
      if (onChanged) onChanged();
    });
    if (view.message && !view.message.ok && error) error.textContent = plainCopy(view.message.copy, 'checkin-error');

    for (const el of root.querySelectorAll('[data-go="today"]')) {
      el.addEventListener('click', event => { event.preventDefault(); if (onBack) onBack(); });
    }

    const details = root.querySelector('details.checkin-note');
    if (details) {
      details.open = noteOpen;
      details.addEventListener('toggle', () => { noteOpen = details.open; });
    }

    phone.replaceChildren(root);
    if (!entered) {
      entered = true;
      const heading = root.querySelector('h1') || root;
      heading.tabIndex = -1;
      heading.focus();
    }
    return root;
  }

  return paint();
}

export default { mountCheckIn };
