// Preparation only: one explicitly selected synthetic start and set in one runtime.
// The host owns client qualification, selection, capture, recovery and later slots.
const mounted = new WeakMap();
const nonblank = value => typeof value === 'string' && value.trim().length > 0;
const fields = ['planned_split_slot_id', 'plan_basis', 'lift_lineage_id', 'logical_set_slot', 'label'];

export function mountWorkoutCommandPanel(root, { client, selection } = {}) {
  if (!root?.ownerDocument || typeof root.append !== 'function') throw new TypeError('A DOM root is required');
  mounted.get(root)?.dispose();
  const doc = root.ownerDocument;
  const el = (tag, text) => { const node = doc.createElement(tag); if (text !== undefined) node.textContent = text; return node; };
  const panel = el('section');
  panel.className = 'workout-command-panel';
  panel.setAttribute('aria-label', 'Synthetic workout demonstration');
  const style = el('style', `
    .workout-command-panel { box-sizing:border-box; max-width:34rem; padding:24px; background:#F4F0E8; color:#1C1B18; font:16px/1.5 'Instrument Sans','Helvetica Neue',Helvetica,Arial,sans-serif; }
    .workout-command-panel h2 { font-size:28px; line-height:1.2; margin:8px 0 20px; }
    .workout-command-panel p { margin:12px 0; }
    .workout-command-panel label { display:flex; flex-direction:column; gap:6px; margin:16px 0; }
    .workout-command-panel input,.workout-command-panel select { box-sizing:border-box; width:100%; min-height:48px; padding:10px 12px; border:1px solid #6F6759; border-radius:8px; background:#FFFDFA; color:#1C1B18; font:inherit; font-size:16px; }
    .workout-command-panel button { width:100%; min-height:56px; padding:12px 20px; border:1.5px solid #1C1B18; border-radius:14px; background:#1C1B18; color:#F4F0E8; font-family:inherit; font-size:14px; font-weight:600; line-height:1.4; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; }
    .workout-command-panel button:disabled { opacity:.55; cursor:default; }
    .workout-command-panel :focus-visible { outline:3px solid #775D28; outline-offset:3px; }
    .workout-command-panel [role=status] { min-height:3em; font-weight:500; }
  `);
  const title = el('h2');
  const status = el('p'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); status.setAttribute('aria-atomic', 'true');
  const startForm = el('form'), startButton = el('button', 'Start'); startButton.type = 'submit'; startForm.append(startButton);
  const setForm = el('form'); setForm.noValidate = true;
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
  panel.append(style, el('p', 'Synthetic demonstration'), title, startForm, setForm, status,
    el('p', 'This visit records one start and one set. Refresh and resume, saved workout instructions, more sets and finishing a workout still need support from the host app.'));
  root.append(panel);
  let disposed = false, pending = false, startId = null, finished = false, recovery = false;
  // Copy only trusted explicit primitive selection; never retain a mutable host object.
  const chosen = {};
  let valid = typeof client?.execute === 'function';
  for (const field of fields) { const value = selection?.[field]; if (!nonblank(value)) valid = false; chosen[field] = value; }
  title.textContent = nonblank(chosen.label) ? chosen.label : 'Workout selection required';
  const paintControls = () => {
    startButton.disabled = !valid || pending || recovery || startId !== null || finished;
    for (const control of [load, reps, reserve, setButton]) control.disabled = !valid || pending || recovery || startId === null || finished;
    panel.setAttribute('aria-busy', String(pending));
  };
  const tell = text => { if (!disposed) status.textContent = text; };
  tell(valid ? 'Start when you are ready to record this synthetic set.' : 'Choose a complete workout selection in the host before starting.');
  paintControls();

  function refusal(result) {
    // A changed context may have committed without acknowledgement. Never offer a
    // blind retry after an uncertain outcome; the host must reconcile the identity.
    if (result?.committed === true || result?.durable === true || result?.stored === true || result?.acknowledged !== false) {
      recovery = true; return 'Save not confirmed. Your entries remain here. Return to the host for recovery before retrying.';
    }
    if (result.state === 17) { recovery = true; return 'Sign-in or installation recovery is required. Your entries remain here.'; }
    if (result.state === 18) { recovery = true; return 'Stored information needs recovery. Your entries remain here.'; }
    if (result.state === 20) { recovery = true; return 'Reconnect through the host to restore the write allowance. Your entries remain here.'; }
    if (result.state === 3) return 'Could not save. Your entries remain here. You can try again.';
    recovery = true; return 'Save not confirmed. Your entries remain here. Return to the host for recovery.';
  }
  async function execute(action, input) {
    pending = true; tell('Saving…'); paintControls();
    try {
      const result = await client.execute('workout', { action, input });
      if (disposed) return;
      if (result?.acknowledged !== true) { tell(refusal(result)); return; }
      if (action === 'start') {
        if (!nonblank(result.op_id)) { recovery = true; tell('Start was acknowledged, but its reference is unavailable. Return to the host for recovery.'); return; }
        startId = result.op_id; tell('Saved — start recorded on this device. Enter the set you performed.');
      } else { finished = true; tell('Saved — set logged on this device. This demonstration is complete.'); }
    } catch {
      if (!disposed) { recovery = true; tell('Save not confirmed. Your entries remain here. Return to the host for recovery before retrying.'); }
    } finally {
      pending = false;
      if (!disposed) { paintControls(); if (startId !== null && !finished && !recovery) load.focus(); }
    }
  }
  const onStart = event => {
    event.preventDefault(); if (disposed || !valid || pending || recovery || startId !== null || finished) return;
    void execute('start', { planned_split_slot_id: chosen.planned_split_slot_id, plan_basis: chosen.plan_basis });
  };
  const onSet = event => {
    event.preventDefault(); if (disposed || !valid || pending || recovery || startId === null || finished) return;
    load.removeAttribute('aria-invalid'); reps.removeAttribute('aria-invalid'); reserve.removeAttribute('aria-invalid');
    const lbText = load.value.trim(), repsText = reps.value.trim();
    const lb = Number(lbText), count = Number(repsText);
    if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(lbText) || !Number.isFinite(lb) || lb <= 0) {
      load.setAttribute('aria-invalid', 'true'); tell('Enter a weight in pounds greater than zero.'); load.focus(); return;
    }
    if (!/^\d+$/.test(repsText) || !Number.isSafeInteger(count)) {
      reps.setAttribute('aria-invalid', 'true'); tell('Enter completed repetitions as a whole number, including zero if you completed none.'); reps.focus(); return;
    }
    const input = { session_start_op_id: startId, logical_set_slot: chosen.logical_set_slot, lift_lineage_id: chosen.lift_lineage_id,
      load: { value: lb, unit: 'lb' }, reps: { value: count, unit: 'rep' } };
    const effort = reserve.value;
    if (['0', '1', '2'].includes(effort)) input.reserve = { tag: 'exact', value: Number(effort), unit: 'rep' };
    else if (effort === '3+') input.reserve = { tag: 'at_least', value: 3, unit: 'rep' };
    else if (['unknown', 'skipped'].includes(effort)) input.reserve = { tag: effort };
    else if (effort !== '') { reserve.setAttribute('aria-invalid', 'true'); tell('Choose a listed clean-reps-left answer or leave it unrecorded.'); reserve.focus(); return; }
    void execute('set', input);
  };
  startForm.addEventListener('submit', onStart); setForm.addEventListener('submit', onSet);
  const handle = { dispose() {
    if (disposed) return;
    disposed = true; startForm.removeEventListener('submit', onStart); setForm.removeEventListener('submit', onSet);
    panel.remove(); if (mounted.get(root) === handle) mounted.delete(root);
    // No cancellation: an already issued durable operation can still complete.
  } };
  mounted.set(root, handle); return handle;
}
