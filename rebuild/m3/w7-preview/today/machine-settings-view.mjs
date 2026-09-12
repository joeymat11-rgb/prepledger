// machine-settings-view.mjs - the active set's settings block and its capture editor,
// as pure DOM work over slots the approved template already carries.
//
// IT OWNS NO WORDS. Every sentence is passed in from gym-app.mjs, which is one of
// design.cjs's VIEW_SOURCES and is therefore where the copy binding can see it; this
// module owns the SHAPE of the block and nothing else. That split is also why a copy
// edit cannot change what is recorded and a layout change cannot quietly reword a
// refusal.
//
// IT OWNS NO VALIDATOR EITHER (brief section 2, mutants S-M4/S-M5). The only gate on a
// capture is `machineOf` from rebuild/coach/machine-settings-commands.cjs, imported and
// CALLED here to decide whether the page may offer to save - so the page's refusal and
// the producer's refusal are the same decision, taken once, and there is no second
// shape anywhere in this page's own folder.
//
// NOTHING IS INTERPRETED. "four" stays "four". The rows are trimmed of surrounding
// space (an empty box is an absent answer, not the string " ") and handed on in the
// order the athlete gave them; no unit is added, no number parsed, no row sorted.
import MachineSettings from '../../../coach/machine-settings-commands.cjs';

const { machineOf, SETTINGS_MAX } = MachineSettings;

export const MAX_ROWS = SETTINGS_MAX;

/* The editor's transient state. Seeded from what is stored so a correction starts from
   the settings he already has rather than from an empty form; a lift with nothing
   stored opens with one blank row. Nothing here is durable. */
export function draftFrom(latest) {
  const machine = latest && latest.machine ? latest.machine : null;
  const rows = machine && Array.isArray(machine.settings) && machine.settings.length
    ? machine.settings.map((pair) => ({ name: pair.name, value: pair.value }))
    : [{ name: '', value: '' }];
  return { rows, cues: (machine && typeof machine.cues === 'string' ? machine.cues : '') };
}

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

/* The stored settings, verbatim and in the stored order. `put` is the caller's slot
   filler, so every string still goes through P1's render boundary. */
export function renderBlock(doc, map, { copy, latest, state = 'known', put }) {
  const section = map.get('settings-block');
  if (!section) return null;
  section.hidden = false;
  put(map, 'settings-head', copy.head);
  put(map, 'settings-open-label', copy.open);
  const list = map.get('settings-list');
  const cues = map.get('settings-cues');
  list.replaceChildren();
  /* D2 round 1, finding 2 - UNKNOWN AND UNAVAILABLE ARE NOT EMPTY. A read still in
     flight, and a read that refused, each say what they are. Neither is ever allowed
     to fall through to the empty state below, which is a CONFIRMED absence. */
  if (state !== 'known') {
    const line = doc.createElement('p');
    line.className = 'small quiet';
    line.textContent = state === 'failed'
      ? copy.plain(copy.unread + ' ' + copy.unreadAction, 'settings-unread')
      : copy.plain(copy.reading, 'settings-reading');
    list.append(line);
    cues.textContent = '';
    cues.hidden = true;
    return section;
  }
  const machine = latest && latest.machine ? latest.machine : null;
  const pairs = machine && Array.isArray(machine.settings) ? machine.settings : [];
  if (!machine || (pairs.length === 0 && !machine.cues)) {
    /* THE HONEST EMPTY STATE. Never a zero, never a dash, never another lift's
       setting: this device holds nothing for this exercise id and says so. */
    const none = doc.createElement('p');
    none.className = 'small quiet';
    none.textContent = copy.none;
    list.append(none);
    cues.textContent = '';
    cues.hidden = true;
    return section;
  }
  for (const pair of pairs) {
    const row = doc.createElement('div');
    row.className = 'row';
    const name = doc.createElement('strong');
    name.textContent = copy.plain(pair.name, 'settings-name');
    const value = doc.createElement('span');
    value.textContent = copy.plain(pair.value, 'settings-value');
    row.append(name, value);
    list.append(row);
  }
  const hasCue = typeof machine.cues === 'string' && machine.cues !== '';
  cues.textContent = hasCue ? copy.plain(copy.cuesLead + ' ' + machine.cues, 'settings-cues') : '';
  cues.hidden = !hasCue;
  return section;
}

/* The editor: one row per setting, each a name and a value, plus one cue field. Adding
   and removing a row is local to the draft; nothing is written until Save. */
export function renderEditor(doc, map, { copy, draft, put, onChanged }) {
  const section = map.get('settings-editor');
  if (!section) return null;
  put(map, 'settings-editor-title', copy.editorTitle);
  put(map, 'settings-cue-label', copy.cueLabel);
  put(map, 'settings-add-label', copy.add);
  put(map, 'settings-save-label', copy.save);
  put(map, 'settings-cancel-label', copy.cancel);
  const host = map.get('settings-rows');
  host.replaceChildren();
  draft.rows.forEach((row, index) => {
    const line = doc.createElement('div');
    line.className = 'row';
    const nameLabel = doc.createElement('label');
    nameLabel.textContent = copy.nameLabel;
    const name = doc.createElement('input');
    name.type = 'text';
    name.value = row.name;
    name.setAttribute('data-settings-name', String(index));
    nameLabel.append(name);
    const valueLabel = doc.createElement('label');
    valueLabel.textContent = copy.valueLabel;
    const value = doc.createElement('input');
    value.type = 'text';
    value.value = row.value;
    value.setAttribute('data-settings-value', String(index));
    valueLabel.append(value);
    name.addEventListener('input', () => { row.name = name.value; });
    value.addEventListener('input', () => { row.value = value.value; });
    line.append(nameLabel, valueLabel);
    if (draft.rows.length > 1) {
      const remove = doc.createElement('button');
      remove.type = 'button';
      remove.className = 'text-link';
      remove.textContent = copy.remove;
      remove.setAttribute('data-settings-remove', String(index));
      remove.addEventListener('click', () => { draft.rows.splice(index, 1); onChanged(); });
      line.append(remove);
    }
    host.append(line);
  });
  const cue = map.get('settings-cue');
  cue.value = draft.cues;
  cue.addEventListener('input', () => { draft.cues = cue.value; });
  const add = section.querySelector('[data-action="settings-add"]');
  add.hidden = draft.rows.length >= MAX_ROWS;
  add.addEventListener('click', () => { draft.rows.push({ name: '', value: '' }); onChanged(); });
  return section;
}

export default { draftFrom, machineFromDraft, acceptable, renderBlock, renderEditor, MAX_ROWS };
