import { NUTRITION_FIELDS, describeNutritionInputs } from './nutrition-input-model.mjs';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const title = key => key[0].toUpperCase() + key.slice(1);

// Keep model alive across Back/remount for transient draft retention. destroy()
// removes only this view; the Today owner closes model on installation teardown.
export function mountNutritionInput(doc, root, { model, onBack = () => {}, onSaved = () => {} }) {
  let previousPhase = null, lastSaved = null, disposed = false;
  function render() {
    if (disposed) return;
    const state = model.snapshot(), d = state.draft, focus = root.contains(doc.activeElement) ? doc.activeElement?.name : null;
    const open = new Set([...root.querySelectorAll('details[open]')].map(x => x.dataset.detail));
    const field = (path, label, value, type = 'text') => `<div class="nutrition-field"><label for="ni-${path}">${esc(label)}</label><input id="ni-${path}" name="${path}" type="${type}" value="${esc(value)}"${type === 'text' && /amount|lower$|upper$/.test(path) ? ' inputmode="decimal"' : ''}></div>`;
    const select = (path, label, value, options) => `<div class="nutrition-field"><label for="ni-${path}">${esc(label)}</label><select id="ni-${path}" name="${path}"><option value="">Choose an answer</option>${options.map(([v, label]) => `<option value="${v}"${value === v ? ' selected' : ''}>${esc(label)}</option>`).join('')}</select></div>`;
    const rows = inputs => `<dl class="nutrition-review">${describeNutritionInputs(inputs).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
    let body = '';
    if (state.phase === 'loading') body = '<p>Reading your saved answers…</p><button class="link" data-action="load">Try reading again</button>';
    else if (state.phase === 'edit') {
      body = `<form novalidate><fieldset${state.busy ? ' disabled' : ''}>
        ${select('goal.kind', 'What would you like to work toward?', d.goal.kind, [['declared', 'Describe my goal'], ['unknown', 'I’m not sure yet'], ...(state.saved ? [['cleared', 'Clear my previous goal']] : [])])}
        ${d.goal.kind === 'declared' ? field('goal.statement', 'Your goal', d.goal.statement) + field('goal.phase', 'Your current phase, in your own words', d.goal.phase) : d.goal.kind === 'cleared' ? field('goal.reason', 'Why clear this goal?', d.goal.reason) : ''}
        ${select('existing_plan.kind', 'Do you have an existing nutrition plan?', d.existing_plan.kind, [['recorded', 'Yes, record my plan'], ['none', 'No, I have no existing plan'], ['unknown', 'I’m not sure'], ...(state.saved ? [['cleared', 'Clear my recorded plan']] : [])])}
        ${d.existing_plan.kind === 'cleared' ? field('existing_plan.reason', 'Why clear this plan?', d.existing_plan.reason) : ''}`;
      if (d.existing_plan.kind === 'recorded') {
        body += `<section aria-label="Recorded plan"><p class="fine">Record what your plan actually says. You can mark any amount as unknown.</p>${field('existing_plan.source', 'Where did this plan come from?', d.existing_plan.source)}${field('existing_plan.agreed_date', 'Date you agreed this plan', d.existing_plan.agreed_date, 'date')}`;
        for (const key of NUTRITION_FIELDS) {
          const f = d.existing_plan.fields[key], path = `existing_plan.fields.${key}`, unit = key === 'calories' ? 'kcal/day' : 'g/day';
          const summary = f.kind ? ({ target: 'Target', minimum: 'Minimum', range: 'Range', not_prescribed: 'Not prescribed', unavailable: 'Unknown' })[f.kind] : 'Add details';
          body += `<details data-detail="${key}"${open.has(key) ? ' open' : ''}><summary>${title(key)} <span>${summary}</span></summary>${select(`${path}.kind`, `${title(key)} in your plan`, f.kind, [['target', 'A target'], ['minimum', 'A minimum'], ['range', 'A range'], ['not_prescribed', 'Not prescribed in my plan'], ['unavailable', 'I don’t know']])}`;
          if (['target', 'minimum'].includes(f.kind)) body += field(`${path}.amount`, `${title(key)} amount (${unit})`, f.amount);
          if (f.kind === 'range') body += field(`${path}.lower`, `Lower ${key} limit (${unit})`, f.lower) + select(`${path}.lower_inclusive`, 'Lower limit meaning', f.lower_inclusive, [['true', 'At least (includes this amount)'], ['false', 'More than (excludes this amount)']]) + field(`${path}.upper`, `Upper ${key} limit (${unit})`, f.upper) + select(`${path}.upper_inclusive`, 'Upper limit meaning', f.upper_inclusive, [['true', 'At most (includes this amount)'], ['false', 'Less than (excludes this amount)']]);
          if (f.kind === 'unavailable') body += field(`${path}.reason`, 'What is unknown? (optional)', f.reason);
          body += '</details>';
        }
        body += '</section>';
      }
      if (state.saved) body += `<details data-detail="change"${open.has('change') ? ' open' : ''}><summary>Correcting an earlier answer?</summary>${select('change', 'How should this be recorded?', d.change, [['update', 'A change from now'], ['correction', 'A correction to my earlier answer']])}<p class="fine">Both keep the original record.</p></details>`;
      body += `</fieldset><button class="primary" type="submit"${state.busy || state.conflicting ? ' disabled' : ''}>${state.busy ? 'Preparing review…' : 'Review my answers'}</button></form>`;
    } else if (state.phase === 'review' || state.phase === 'error') {
      body = `${rows(state.review.inputs)}<p class="fine">Recorded for ${esc(state.review.effective.local_date)} at ${esc(state.review.effective.local_time)} (${esc(state.review.effective.utc_offset)}).</p><p class="fine">${state.review.change === 'correction' ? 'Correction to an earlier answer. The original stays in your history.' : 'These are your recorded answers. They do not change a recommended plan.'}</p><div class="nutrition-actions"><button class="link" data-action="edit"${state.busy ? ' disabled' : ''}>Edit answers</button>${state.phase === 'review' || state.canRetry ? `<button class="primary" data-action="confirm"${state.busy ? ' disabled' : ''}>${state.busy ? 'Saving…' : state.canRetry ? 'Try saving again' : 'Save my answers'}</button>` : ''}</div>`;
      if (state.reviewRequired) body += `<button class="primary" data-action="review"${state.busy ? ' disabled' : ''}>Review my answers again</button>`;
    } else if (state.phase === 'saved') body = `${state.saved ? rows(state.saved.inputs) : ''}<button class="link" data-action="edit">Change my answers</button>`;
    root.innerHTML = `<section class="page nutrition-input" aria-label="Your nutrition"><button class="back" data-action="back">Back to my plan</button><div class="detail-head"><h1 tabindex="-1">${state.phase === 'review' || state.phase === 'error' ? 'Review your answers.' : 'Your nutrition.'}</h1><p>Your goal and the plan you already have.</p></div>${state.saved && state.phase === 'edit' ? `<p class="fine">Using your saved answers from ${esc(state.saved.effective.local_date)}. Saved on this phone; sync is not confirmed.</p>` : ''}<p class="${state.errorField || state.phase === 'error' ? 'error' : 'status'}" role="${state.errorField || state.phase === 'error' ? 'alert' : 'status'}">${esc(state.message)}</p>${state.conflicting ? '<button class="link" data-action="load">Load saved answers (replaces this draft)</button>' : ''}${body}</section>`;
    if (state.errorField) {
      const input = doc.getElementById(`ni-${state.errorField}`); const detail = input?.closest('details'); if (detail) detail.open = true;
      input?.setAttribute('aria-invalid', 'true'); input?.focus();
    } else if (focus && root.querySelector(`[name="${focus}"]`)) root.querySelector(`[name="${focus}"]`).focus();
    else if (previousPhase !== state.phase && state.phase !== 'loading') root.querySelector('h1').focus();
    previousPhase = state.phase;
    if (state.phase === 'saved' && state.saved?.sourceOpId !== lastSaved) { lastSaved = state.saved?.sourceOpId; onSaved(); }
  }
  const input = event => { if (event.target.name) model.update(event.target.name, event.target.value); };
  const change = event => { input(event); if (event.target.tagName === 'SELECT') render(); };
  const click = event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'back') onBack();
    else if (action === 'edit') model.edit();
    else if (action === 'load') model.load();
    else if (action === 'confirm') model.confirm();
    else if (action === 'review') model.review();
  };
  const submit = event => { event.preventDefault(); model.review(); };
  root.addEventListener('input', input); root.addEventListener('change', change); root.addEventListener('click', click); root.addEventListener('submit', submit);
  const unsubscribe = model.subscribe(render); render();
  return { destroy() { disposed = true; unsubscribe(); root.removeEventListener('input', input); root.removeEventListener('change', change); root.removeEventListener('click', click); root.removeEventListener('submit', submit); } };
}
