import { createEnrollment } from './enrollment.mjs';
import { newSetupDraft, validateSchedule, exerciseFromDraft, setupFromDraft, WEEK, DAY_LABEL } from './setup-model.mjs';
import { CATALOGUE } from './catalogue.mjs';

export function mountSetup(doc, { indexedDB, crypto, calendar, onSaved }) {
  const root = doc.getElementById('phone'), status = doc.getElementById('today-status');
  const draft = newSetupDraft(calendar.sample().day);
  let step = 0, editor = null, editIndex = -1, closed = false, review = null;
  const enrollment = createEnrollment({ indexedDB, crypto, calendar, onSaved });
  const el = (tag, text, cls) => { const n = doc.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
  const button = (text, action, cls = 'link') => { const b = el('button', text, cls); b.type = 'button'; b.addEventListener('click', action); return b; };
  let form, error;
  function showError(err) {
    error.textContent = err.message;
    const target = form.elements.namedItem(err.field);
    if (target?.focus) { target.setAttribute('aria-invalid', 'true'); target.focus(); }
    else error.focus();
  }
  function field(parent, key, label, value, onChange, { type = 'text', choices, hint } = {}) {
    const group = el('div', null, 'setup-field'), lab = el('label', label);
    const input = el(choices ? 'select' : 'input'); input.name = key; input.id = 'setup-' + key;
    lab.htmlFor = input.id;
    if (choices) for (const [value, text] of choices) { const option = el('option', text); option.value = value; input.append(option); }
    else { input.type = type; if (type === 'number') { input.min = '0'; input.step = 'any'; input.inputMode = 'decimal'; } }
    input.value = value; input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); onChange(input.value); });
    group.append(lab, input);
    if (hint) { const note = el('p', hint, 'small muted'); note.id = input.id + '-hint'; input.setAttribute('aria-describedby', note.id); group.append(note); }
    parent.append(group); return input;
  }
  function submit(text, action) {
    const b = el('button', text, 'primary'); b.type = 'submit'; form.append(b);
    form.addEventListener('submit', event => { event.preventDefault(); try { action(); } catch (err) { showError(err); } });
  }
  function confirmation(parent, name, text, checked, change) {
    const label = el('label', null, 'setup-confirm'), input = el('input'); input.type = 'checkbox'; input.name = name; input.checked = checked;
    input.addEventListener('change', () => change(input.checked)); label.append(input, doc.createTextNode(text)); parent.append(label);
  }
  function describe(ex) {
    return `${DAY_LABEL[ex.day]} · ${ex.sets} sets · ${ex.hi} rep ceiling · ${ex.inc} lb increase`;
  }
  function paint() {
    if (closed) return;
    const page = el('section', null, 'page setup');
    const mast = el('div', null, 'mast'); mast.append(el('span', 'Earned', 'brand'), el('span', 'Your routine', 'small muted')); page.append(mast);
    const head = el('div', null, 'detail-head');
    head.append(el('h1', ['Make it yours.', 'Your exercises.', 'Ready to save?'][step]));
    head.append(el('p', ['Bring the routine you already follow. Choose each day below; nothing is prescribed for you.',
      'Add your current exercises in the order you train them. Only supported exercises with positive loads in pounds can be entered here.',
      'Check your routine before saving it on this device. Your first workout will establish your working loads.'][step]));
    page.append(head); form = el('form'); form.noValidate = true;
    error = el('p', '', 'error'); error.tabIndex = -1; error.setAttribute('role', 'alert'); form.append(error);
    if (step === 0) {
      field(form, 'athlete_label', 'Your name', draft.athlete_label, v => draft.athlete_label = v);
      field(form, 'from', 'Routine starts', draft.from, v => draft.from = v, { type: 'date', hint: 'Confirm the date this weekly schedule begins.' });
      const week = el('fieldset', null, 'setup-week'); week.append(el('legend', 'Your weekly schedule'));
      WEEK.forEach((name, i) => field(week, 'day-' + i, name, draft.map[i], v => draft.map[i] = v,
        { choices: [['', 'Choose…'], ['U', 'Upper'], ['L', 'Lower'], ['REST', 'Rest']] })); form.append(week);
      form.append(el('p', 'This setup supports a repeating upper/lower/rest week. If your routine uses another split, it cannot be represented here yet.', 'note'));
      submit('Continue', () => { validateSchedule(draft); step = 1; paint(); });
    } else if (step === 1 && editor) {
      field(form, 'choice', 'Exercise', editor.choice, v => editor.choice = v, { choices: [['', 'Choose…'], ...CATALOGUE.map(x => [x.id, x.n + ' · ' + DAY_LABEL[x.day]])] });
      field(form, 'sets', 'Sets per session', editor.sets, v => editor.sets = v, { type: 'number' });
      field(form, 'hi', 'Rep ceiling', editor.hi, v => editor.hi = v, { type: 'number', hint: 'The highest reps in your current prescribed range.' });
      field(form, 'inc', 'Load increase (lb)', editor.inc, v => editor.inc = v, { type: 'number' });
      field(form, 'loadMode', 'Available equipment loads', editor.loadMode, v => { editor.loadMode = v; paint(); },
        { choices: [['list', 'List the actual loads'], ['range', 'Evenly spaced range']] });
      if (editor.loadMode === 'range') {
        field(form, 'min', 'Lightest available load (lb)', editor.min || '', v => editor.min = v, { type: 'number' });
        field(form, 'max', 'Heaviest available load (lb)', editor.max || '', v => editor.max = v, { type: 'number', hint: 'Every load between these limits must exist at the increase you entered above.' });
      } else field(form, 'loads', 'Available loads (lb)', editor.loads, v => editor.loads = v,
        { hint: 'Separate each load with a comma, from lightest to heaviest. Use the same load convention you record for each set.' });
      form.append(el('p', 'No working load is chosen here. Bodyweight, assisted, mixed-unit and per-side routines are not supported by this setup.', 'note'));
      confirmation(form, 'movement', 'This is my bilateral exercise. I will use the same movement and equipment when logging it.', !!editor.confirmed, v => editor.confirmed = v);
      submit(editIndex < 0 ? 'Add exercise' : 'Keep changes', () => {
        if (!editor.confirmed) { const e = new Error('Confirm that this choice represents your actual exercise.'); e.field = 'movement'; throw e; }
        const ex = exerciseFromDraft(editor, CATALOGUE);
        if (draft.exercises.some((x, i) => i !== editIndex && x.id === ex.id)) { const e = new Error('That exercise is already in your routine. Edit its existing entry.'); e.field = 'choice'; throw e; }
        if (editIndex < 0) draft.exercises.push(ex); else draft.exercises[editIndex] = ex;
        editor = null; paint();
      });
      form.append(button('Cancel exercise', () => { editor = null; paint(); }));
    } else if (step === 1) {
      for (const [index, ex] of draft.exercises.entries()) {
        const row = el('div', null, 'setup-exercise'); row.append(el('h2', ex.n), el('p', describe(ex), 'small muted'));
        row.append(button('Edit ' + ex.n, () => { editIndex = index; editor = { choice: ex.id, sets: String(ex.sets), hi: String(ex.hi), inc: String(ex.inc), loads: ex.steps.join(', '), loadMode: 'list' }; paint(); }));
        row.append(button('Remove ' + ex.n, () => { draft.exercises.splice(index, 1); paint(); }));
        if (index > 0) row.append(button('Move ' + ex.n + ' earlier', () => { [draft.exercises[index - 1], draft.exercises[index]] = [ex, draft.exercises[index - 1]]; paint(); }));
        form.append(row);
      }
      form.append(button('Add an exercise', () => { editIndex = -1; editor = { choice: '', sets: '', hi: '', inc: '', loads: '', loadMode: 'list' }; paint(); }));
      const priorities = el('details', null, 'setup-priorities'); priorities.append(el('summary', 'Priority muscles (optional)'));
      priorities.append(el('p', 'Saved as your stated preference. This preference does not change prescriptions yet.', 'small muted'));
      for (const mg of [...new Set(draft.exercises.map(x => x.mg))]) {
        const lab = el('label'), check = el('input'); check.type = 'checkbox'; check.checked = draft.priority_muscles.includes(mg);
        check.addEventListener('change', () => { draft.priority_muscles = check.checked ? [...draft.priority_muscles, mg] : draft.priority_muscles.filter(x => x !== mg); });
        lab.append(check, doc.createTextNode(CATALOGUE.find(x => x.mg === mg)?.muscleLabel || mg)); priorities.append(lab);
      }
      form.append(priorities);
      form.append(el('p', 'The seven choices above are the current coverage. One version of each can be recorded. If your routine needs another exercise or a second equipment or technique variant, this setup cannot capture your full routine yet.', 'note'));
      let complete = false;
      confirmation(form, 'complete', 'These entries include my complete current routine, using the supported exercises.', false, v => complete = v);
      submit('Review routine', () => {
        if (!complete) { const e = new Error('Confirm that your complete routine is represented. If an exercise is missing from the choices, do not omit it to finish setup.'); e.field = 'complete'; throw e; }
        draft.priority_muscles = draft.priority_muscles.filter(mg => draft.exercises.some(x => x.mg === mg));
        review = setupFromDraft(draft); step = 2; paint();
      });
      form.append(button('Back to schedule', () => { step = 0; paint(); }));
    } else {
      form.append(el('h2', review.athlete_label)); form.append(el('p', 'Starts ' + review.split.from, 'note'));
      for (const day of ['U', 'L', 'REST']) {
        const names = WEEK.filter((_, i) => review.split.map[i] === day);
        if (names.length) form.append(el('p', DAY_LABEL[day] + ': ' + names.join(', '), 'small'));
      }
      for (const ex of review.exercises) {
        const row = el('div', null, 'setup-exercise'); row.append(el('h2', ex.n), el('p', describe(ex), 'small'), el('p', 'Available loads: ' + ex.steps.join(', ') + ' lb', 'small muted')); form.append(row);
      }
      const names = review.priority_muscles.map(mg => CATALOGUE.find(x => x.mg === mg)?.muscleLabel || mg);
      form.append(el('p', names.length ? 'Your priorities: ' + names.join(', ') : 'No priority muscles selected.', 'note'));
      submit('Save my routine', async () => {
        if (enrollment.status().state === 'saving') return;
        for (const control of form.elements) control.disabled = true;
        if (status) status.textContent = 'Saving your routine…';
        const outcome = await enrollment.save(review);
        if (closed) return;
        if (outcome.state === 'retry') {
          for (const control of form.elements) control.disabled = false;
          showError(new Error('Your routine was not saved. Your entries are still here. Try saving again.'));
          if (status) status.textContent = 'Routine not saved.';
        } else if (outcome.state === 'restore') {
          error.textContent = 'This device needs to be reopened or restored before continuing. Do not set up again. (' + outcome.failure + ')'; error.focus();
          if (status) status.textContent = 'Reopen or restore this device.';
        }
      });
      form.append(button('Back to exercises', () => { step = 1; paint(); }));
    }
    page.append(form); root.replaceChildren(page); root.scrollTop = 0;
    const title = head.querySelector('h1'); title.tabIndex = -1; title.focus({ preventScroll: true }); root.scrollTop = 0;
  }
  paint();
  return { close() { closed = true; }, draft, enrollment };
}
