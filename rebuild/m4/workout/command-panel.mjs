// Preparation only: one explicitly selected synthetic start and set in one runtime.
// The host owns client qualification, selection, capture, recovery and later slots.
const mounted = new WeakMap();
const nonblank = value => typeof value === 'string' && value.trim().length > 0;
const fields = ['planned_split_slot_id', 'plan_basis', 'lift_lineage_id', 'logical_set_slot', 'label'];

export function mountWorkoutCommandPanel(root, { client, selection, additionalSlots, onActiveSlotChange } = {}) {
  if (!root?.ownerDocument || typeof root.append !== 'function') throw new TypeError('A DOM root is required');
  mounted.get(root)?.dispose();
  const doc = root.ownerDocument;
  const el = (tag, text) => { const node = doc.createElement(tag); if (text !== undefined) node.textContent = text; return node; };
  const panel = el('section');
  panel.className = 'workout-command-panel';
  panel.setAttribute('aria-label', 'Synthetic workout demonstration');
  const style = el('style', `
    .workout-command-panel { box-sizing:border-box; width:100%; max-width:38rem; margin-inline:auto; padding:28px 24px; display:flex; flex-direction:column; background:#F4F0E8; color:#1C1B18; font:1rem/1.5 'Instrument Sans','Helvetica Neue',Helvetica,Arial,sans-serif; font-variant-numeric:tabular-nums; overflow-wrap:anywhere; }
    .workout-command-panel > * { box-sizing:border-box; min-width:0; }
    .workout-command-panel p { margin:0; }
    .workout-command-panel > p:first-of-type { order:0; color:#5A5348; font-size:.875em; letter-spacing:.03em; margin-bottom:16px; }
    .workout-command-panel .wcp-title { order:1; font-family:'Instrument Serif',Georgia,'Times New Roman',serif; font-size:3em; font-weight:400; line-height:1.05; letter-spacing:-.025em; margin:0 0 18px; }
    .workout-command-panel .wcp-progress { order:2; color:#2E5A3C; font-size:.9375em; padding:0 0 16px; }
    .workout-command-panel .wcp-start { order:3; margin:0 0 20px; }
    .workout-command-panel .wcp-entry { order:4; display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:18px 12px; padding-top:20px; border-top:1px solid #D8D0C2; }
    .workout-command-panel label { display:flex; flex-direction:column; justify-content:space-between; gap:8px; margin:0; min-width:0; color:#5A5348; }
    .workout-command-panel .wcp-effort,.workout-command-panel .wcp-log { grid-column:1 / -1; }
    .workout-command-panel .wcp-entry-heading { grid-column:1 / -1; margin:0; font-size:1.125em; font-weight:500; }
    .workout-command-panel .wcp-effort { color:#1C1B18; }
    .workout-command-panel input,.workout-command-panel select { box-sizing:border-box; width:100%; min-width:0; min-height:52px; padding:12px; border:1px solid #6F6759; border-radius:10px; background:#FAF7F1; color:#1C1B18; font:inherit; font-size:max(16px,1em); }
    .workout-command-panel .wcp-entry input { min-height:60px; font-weight:600; text-align:center; }
    .workout-command-panel input:disabled,.workout-command-panel select:disabled { opacity:1; color:#5A5348; -webkit-text-fill-color:#5A5348; background:transparent; border-color:#D8D0C2; }
    .workout-command-panel button { box-sizing:border-box; width:100%; min-height:56px; padding:14px 18px; border:1px solid #1C1B18; border-radius:14px; background:#1C1B18; color:#F4F0E8; font:600 1em/1.4 'Instrument Sans','Helvetica Neue',Helvetica,Arial,sans-serif; text-align:left; cursor:pointer; touch-action:manipulation; }
    .workout-command-panel button:disabled { opacity:1; min-height:44px; padding-block:10px; color:#6F6759; background:transparent; border-color:#D8D0C2; cursor:default; }
    .workout-command-panel .wcp-status { order:5; min-height:1.5em; padding:16px 0; font-weight:500; }
    .workout-command-panel[aria-busy=true] .wcp-status { color:#5A5348; }
    .workout-command-panel .wcp-next { order:6; margin-bottom:20px; }
    .workout-command-panel .wcp-finish { order:6; margin-bottom:20px; }
    .workout-command-panel .wcp-skip,.workout-command-panel .wcp-close { display:grid; gap:12px; padding:18px 0; border-top:1px solid #D8D0C2; }
    .workout-command-panel .wcp-skip button,.workout-command-panel .wcp-close button { min-height:44px; padding:10px 0; width:auto; justify-self:start; border:0; border-radius:0; background:transparent; color:#1C1B18; font-weight:500; text-decoration:underline; text-decoration-color:#9B9284; text-underline-offset:5px; }
    .workout-command-panel .wcp-skip button:disabled,.workout-command-panel .wcp-close button:disabled { color:#6F6759; text-decoration-color:#D8D0C2; }
    .workout-command-panel .wcp-close p { color:#5A5348; font-size:.875em; }
    .workout-command-panel .wcp-readback { order:9; border-top:1px solid #D8D0C2; margin-top:4px; padding-top:8px; }
    .workout-command-panel .wcp-options { order:7; border-top:1px solid #D8D0C2; padding:8px 0; }
    .workout-command-panel .wcp-options summary,.workout-command-panel .wcp-readback summary { box-sizing:border-box; min-height:44px; padding:10px 0; cursor:pointer; font-weight:500; }
    .workout-command-panel .wcp-options .wcp-skip { border-top:0; }
    .workout-command-panel .wcp-last-record { order:6; margin:0 0 18px; padding:12px 0; color:#2E5A3C; border-top:1px solid #D8D0C2; }
    .workout-command-panel [hidden] { display:none; }
    .workout-command-panel .wcp-readback h3 { margin:0 0 8px; font-size:1.125em; font-weight:500; }
    .workout-command-panel .wcp-readback p { color:#5A5348; font-size:.875em; }
    .workout-command-panel .wcp-readback ol { margin:14px 0 0; padding-left:1.5em; }
    .workout-command-panel .wcp-readback li { padding:10px 0; border-top:1px solid #D8D0C2; }
    .workout-command-panel .wcp-readback li::marker { color:#2E5A3C; }
    .workout-command-panel > p:last-of-type:not(:first-of-type) { order:10; margin-top:24px; padding-top:16px; border-top:1px solid #D8D0C2; color:#5A5348; font-size:.875em; }
    .workout-command-panel :focus-visible { outline:3px solid #2E5A3C; outline-offset:4px; }
    .workout-command-panel [aria-invalid=true] { border-color:#1C1B18; border-width:2px; }
    @media (max-width:340px) { .workout-command-panel { padding:24px 18px; } .workout-command-panel .wcp-title { font-size:2.5em; } .workout-command-panel .wcp-entry { column-gap:10px; } }
    @media (max-width:20em) { .workout-command-panel .wcp-entry { grid-template-columns:minmax(0,1fr); } }
  `);
  const title = el('h2');
  const status = el('p'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); status.setAttribute('aria-atomic', 'true');
  const startForm = el('form'), startButton = el('button', 'Start'); startButton.type = 'submit'; startForm.append(startButton);
  const setForm = el('form'); setForm.noValidate = true;
  const entryHeading=el('h3','What you did');entryHeading.className='wcp-entry-heading';setForm.append(entryHeading);
  const makeInput = (name, label, mode) => {
    const wrapper = el('label', label), input = el('input'); input.name = name; input.type = 'text'; input.inputMode = mode;
    input.autocomplete = 'off'; input.required = true; wrapper.append(input); setForm.append(wrapper); return input;
  };
  const load = makeInput('load', 'Weight (lb)', 'decimal');
  const reps = makeInput('reps', 'Completed repetitions', 'numeric');
  const reserveLabel = el('label', 'Clean reps left (optional)'), reserve = el('select'); reserve.name = 'reserve';
  for (const [value, text] of [['', 'Leave unrecorded'], ['0', '0'], ['1', '1'], ['2', '2'], ['3+', '3+'], ['unknown', 'Not sure'], ['skipped', 'Skip this question']]) {
    const option = el('option', text); option.value = value; reserve.append(option);
  }
  reserveLabel.append(reserve); setForm.append(reserveLabel);
  const setButton = el('button', 'Log set'); setButton.type = 'submit'; setForm.append(setButton);
  const extended = additionalSlots !== undefined;
  const progress = el('p'), skipForm = el('form'), skipLabel = el('label', 'Reason to skip this set'), skipReason = el('select');
  skipReason.name = 'skipReason';
  const skipReasons = ['Equipment unavailable', 'Time', 'I chose not to do this set'];
  for (const text of ['', ...skipReasons]) { const option = el('option', text || 'Choose a reason'); option.value = text; skipReason.append(option); }
  skipLabel.append(skipReason); const skipButton = el('button', 'Skip this set'); skipButton.type = 'submit'; skipForm.append(skipLabel, skipButton);
  const nextButton = el('button', 'Next'); nextButton.type = 'button';
  const finishButton=el('button','Finish workout');finishButton.type='button';finishButton.className='wcp-finish';
  const closeForm = el('form'), closeLabel = el('label', 'End this workout'), closeChoice = el('select'); closeChoice.name = 'closeChoice';
  for (const [value, text] of [['', 'Keep this workout open'], ['early', 'Finish early']]) { const option = el('option', text); option.value = value; closeChoice.append(option); }
  closeLabel.append(closeChoice); const closeButton = el('button', 'Finish early'); closeButton.type = 'submit'; closeForm.append(closeLabel, el('p', 'Logged facts stay recorded. Remaining work stays not logged.'), closeButton);
  const options = el('details'); options.className = 'wcp-options'; options.append(el('summary', 'Workout options'), skipForm, closeForm);
  const readback = el('details'); readback.setAttribute('aria-label', 'Recorded on this device during this visit');
  const events = el('ol'); readback.append(el('summary', 'Recorded in this visit'), el('p', 'Acknowledged on this device. This list is not synced or corrected workout history.'), events);
  const lastRecord = el('p'); lastRecord.className = 'wcp-last-record'; lastRecord.hidden = true;
  // Appearance-only classes; command/state/event code remains unchanged.
  title.className = 'wcp-title'; progress.className = 'wcp-progress';
  startForm.className = 'wcp-start'; setForm.className = 'wcp-entry';
  reserveLabel.className = 'wcp-effort'; setButton.className = 'wcp-log';
  status.className = 'wcp-status'; nextButton.className = 'wcp-next';
  skipForm.className = 'wcp-skip'; closeForm.className = 'wcp-close'; readback.className = 'wcp-readback';
  // End appearance-only classes.
  const disclosure =
    el('p', extended ? 'Synthetic workout entries for this visit only. Original instructions, when available, are supplied separately by the host. Refresh and resume and corrected history still need host support. Finish is explicit; recorded or skipped entries do not establish that a training plan was fully performed.' : 'This visit records one start and one set. Refresh and resume, saved workout instructions, more sets and finishing a workout still need support from the host app.');
  panel.append(style, el('p', 'Synthetic demonstration'), title, ...(extended ? [progress] : []), startForm, setForm, status,
    ...(extended ? [lastRecord, nextButton, finishButton, options, readback] : []), disclosure);
  root.append(panel);
  let disposed = false, pending = false, startId = null, finished = false, recovery = false, index = 0, slotDone = false;
  const acknowledgedEvents = []; // Only exact requests acknowledged in this mount; never a history projection.
  // Copy only trusted explicit primitive selection; never retain a mutable host object.
  const chosen = {};
  let valid = typeof client?.execute === 'function';
  for (const field of fields) { const value = selection?.[field]; if (!nonblank(value)) valid = false; chosen[field] = value; }
  const slots = [{ logical_set_slot: chosen.logical_set_slot, lift_lineage_id: chosen.lift_lineage_id, label: chosen.label }];
  if (extended) {
    const ids = new Set([chosen.logical_set_slot]);
    if (!Array.isArray(additionalSlots)) valid = false;
    else for (const item of additionalSlots) {
      if (!item || !['logical_set_slot', 'lift_lineage_id', 'label'].every(field => nonblank(item[field])) || ids.has(item.logical_set_slot)) { valid = false; continue; }
      ids.add(item.logical_set_slot); slots.push({ logical_set_slot: item.logical_set_slot, lift_lineage_id: item.lift_lineage_id, label: item.label });
    }
  }
  const slot = () => slots[index];
  title.textContent = nonblank(chosen.label) ? chosen.label : 'Workout selection required';
  const paintControls = () => {
    startButton.disabled = !valid || pending || recovery || startId !== null || finished;
    startForm.hidden = startId !== null; // Retire only the already acknowledged Start from the visual flow.
    const blocked = !valid || pending || recovery || startId === null || finished;
    for (const control of [load, reps, reserve, setButton]) control.disabled = blocked || slotDone;
    if (extended) {
      for (const control of [skipReason, skipButton]) control.disabled = blocked || slotDone;
      nextButton.hidden = !slotDone || index === slots.length - 1; nextButton.disabled = blocked || !slotDone;
      finishButton.hidden=!slotDone||index!==slots.length-1||finished;finishButton.disabled=blocked||!slotDone;
      closeChoice.disabled = closeButton.disabled = blocked;
      progress.textContent = `Set entry ${index + 1} of ${slots.length}${slotDone ? ' — action recorded' : finished ? ' — not logged' : ''}`;
    }
    panel.setAttribute('aria-busy', String(pending));
  };
  const tell = text => { if (!disposed) status.textContent = text; };
  tell(valid ? 'Start when you are ready to record this synthetic set.' : 'Choose a complete workout selection in the host before starting.');
  paintControls();
  // Trusted synchronous display observer; primitive copies expose neither mutable
  // selection nor command capability. Display failure disables further actions.
  const notifyActiveSlot = () => {
    if (!valid || disposed || onActiveSlotChange === undefined) return;
    try { onActiveSlotChange(Object.freeze({ logical_set_slot: slot().logical_set_slot,
      lift_lineage_id: slot().lift_lineage_id, index, count: slots.length })); }
    catch { valid = false; tell('Instructions could not be displayed. Return to the host before continuing.'); paintControls(); }
  };
  notifyActiveSlot();

  function refusal(result) {
    // A changed context may have committed without acknowledgement. Never offer a
    // blind retry after an uncertain outcome; the host must reconcile the identity.
    if (result?.outcomeUnknown === true || result?.committed === true || result?.durable === true || result?.stored === true || result?.acknowledged !== false) {
      recovery = true; return 'Save not confirmed. Your entries remain here. Return to the host for recovery before retrying.';
    }
    if (result.state === 17) { recovery = true; return 'Sign-in or installation recovery is required. Your entries remain here.'; }
    if (result.state === 18) { recovery = true; return 'Stored information needs recovery. Your entries remain here.'; }
    if (result.state === 20) { recovery = true; return 'Reconnect through the host to restore the write allowance. Your entries remain here.'; }
    if (result.state === 3) return 'Could not save. Your entries remain here. You can try again.';
    recovery = true; return 'Save not confirmed. Your entries remain here. Return to the host for recovery.';
  }
  async function execute(action, input) {
    const entered = structuredClone(input), displayLabel = slot().label;
    pending = true; tell('Saving…'); paintControls();
    try {
      const result = await client.execute('workout', { action, input });
      if (disposed) return;
      if (result?.acknowledged !== true) { tell(refusal(result)); return; }
      if (extended && action !== 'start' && !nonblank(result.op_id)) { recovery = true; tell('Update was acknowledged, but its reference is unavailable. Return to the host for recovery.'); return; }
      if (action === 'start') {
        if (!nonblank(result.op_id)) { recovery = true; tell('Start was acknowledged, but its reference is unavailable. Return to the host for recovery.'); return; }
        startId = result.op_id; tell('Saved — start recorded on this device. Enter the set you performed.');
      } else if (!extended) { finished = true; tell('Saved — set logged on this device. This demonstration is complete.'); }
      else if (action === 'close') { finished = true; tell(entered.completion_kind==='normal'?'Saved — workout finished on this device. Recorded and skipped entries stay distinct.':'Saved — workout ended early on this device. Remaining work stays not logged.'); }
      else {
        slotDone = true;
        tell(action === 'skip' ? 'Saved — this set was explicitly skipped. No repetitions were recorded.' : 'Saved — set logged on this device.');
      }
      if (extended) {
        acknowledgedEvents.push({ action, input: entered, op_id: nonblank(result.op_id) ? result.op_id : null });
        let summary;
        if (action === 'start') summary = 'Workout start recorded.';
        else if (action === 'close') summary = entered.completion_kind==='normal'?'Workout finished. Recorded and skipped entries stay distinct.':'Workout ended early. Remaining work is not logged.';
        else if (action === 'skip') summary = `${displayLabel}: skipped — ${entered.reason}.`;
        else {
          const effort = entered.reserve;
          const effortText = !effort ? 'clean reps left unrecorded' : effort.tag === 'at_least' ? `${effort.value}+ clean reps left` : effort.tag === 'exact' ? `${effort.value} clean reps left` : effort.tag === 'unknown' ? 'clean reps left: not sure' : 'clean-reps-left question skipped';
          summary = `${displayLabel}: ${entered.load.value} lb × ${entered.reps.value} completed repetitions; ${effortText}.`;
        }
        events.append(el('li', summary));
        if (action !== 'start') { lastRecord.textContent = 'Last recorded here: ' + summary; lastRecord.hidden = false; }
      }
    } catch {
      if (!disposed) { recovery = true; tell('Save not confirmed. Your entries remain here. Return to the host for recovery before retrying.'); }
    } finally {
      pending = false;
      if (!disposed) { paintControls(); if (startId !== null && !finished && !recovery && !slotDone) load.focus(); }
    }
  }
  const onStart = event => {
    event.preventDefault(); if (disposed || !valid || pending || recovery || startId !== null || finished) return;
    void execute('start', { planned_split_slot_id: chosen.planned_split_slot_id, plan_basis: chosen.plan_basis });
  };
  const onSet = event => {
    event.preventDefault(); if (disposed || !valid || pending || recovery || startId === null || finished || slotDone) return;
    load.removeAttribute('aria-invalid'); reps.removeAttribute('aria-invalid'); reserve.removeAttribute('aria-invalid');
    const lbText = load.value.trim(), repsText = reps.value.trim();
    const lb = Number(lbText), count = Number(repsText);
    if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(lbText) || !Number.isFinite(lb) || lb <= 0) {
      load.setAttribute('aria-invalid', 'true'); tell('Enter a weight in pounds greater than zero.'); load.focus(); return;
    }
    if (!/^\d+$/.test(repsText) || !Number.isSafeInteger(count)) {
      reps.setAttribute('aria-invalid', 'true'); tell('Enter completed repetitions as a whole number, including zero if you completed none.'); reps.focus(); return;
    }
    const input = { session_start_op_id: startId, logical_set_slot: slot().logical_set_slot, lift_lineage_id: slot().lift_lineage_id,
      load: { value: lb, unit: 'lb' }, reps: { value: count, unit: 'rep' } };
    const effort = reserve.value;
    if (['0', '1', '2'].includes(effort)) input.reserve = { tag: 'exact', value: Number(effort), unit: 'rep' };
    else if (effort === '3+') input.reserve = { tag: 'at_least', value: 3, unit: 'rep' };
    else if (['unknown', 'skipped'].includes(effort)) input.reserve = { tag: effort };
    else if (effort !== '') { reserve.setAttribute('aria-invalid', 'true'); tell('Choose a listed clean-reps-left answer or leave it unrecorded.'); reserve.focus(); return; }
    void execute('set', input);
  };
  const onSkip = event => {
    event.preventDefault(); if (!extended || disposed || !valid || pending || recovery || !startId || finished || slotDone) return;
    if (!skipReasons.includes(skipReason.value)) { tell('Choose a reason before explicitly skipping this set.'); options.open = true; skipReason.focus(); return; }
    void execute('skip', { session_start_op_id: startId, logical_set_slot: slot().logical_set_slot, lift_lineage_id: slot().lift_lineage_id, skip_scope: 'set', reason: skipReason.value });
  };
  const onNext = () => {
    if (!extended || disposed || !valid || pending || recovery || finished || !slotDone || index >= slots.length - 1) return;
    index++; slotDone = false; title.textContent = slot().label;
    // Only a completed slot's local controls reset on explicit navigation. No host draft/storage is touched.
    load.value = ''; reps.value = ''; reserve.value = ''; skipReason.value = ''; closeChoice.value = '';
    for (const control of [load, reps, reserve]) control.removeAttribute('aria-invalid');
    paintControls(); tell('Enter the set you performed, or explicitly skip this set.'); notifyActiveSlot(); if (valid) load.focus();
  };
  const onClose = event => {
    event.preventDefault(); if (!extended || disposed || !valid || pending || recovery || !startId || finished) return;
    if (closeChoice.value !== 'early') { tell('Choose early finish to end this workout. Remaining work will stay not logged.'); options.open = true; closeChoice.focus(); return; }
    void execute('close', { session_start_op_id: startId, completion_kind: 'early' });
  };
  const onFinish=()=>{
    if(!extended||disposed||!valid||pending||recovery||finished||!startId||!slotDone||index!==slots.length-1)return;
    void execute('close',{session_start_op_id:startId,completion_kind:'normal'});
  };
  startForm.addEventListener('submit', onStart); setForm.addEventListener('submit', onSet);
  if (extended) { skipForm.addEventListener('submit', onSkip); nextButton.addEventListener('click', onNext); finishButton.addEventListener('click',onFinish);closeForm.addEventListener('submit', onClose); }
  const handle = { dispose() {
    if (disposed) return;
    disposed = true; startForm.removeEventListener('submit', onStart); setForm.removeEventListener('submit', onSet);
    skipForm.removeEventListener('submit', onSkip); nextButton.removeEventListener('click', onNext); closeForm.removeEventListener('submit', onClose);
    finishButton.removeEventListener('click',onFinish);
    panel.remove(); if (mounted.get(root) === handle) mounted.delete(root);
    // No cancellation: an already issued durable operation can still complete.
  } };
  mounted.set(root, handle); return handle;
}
