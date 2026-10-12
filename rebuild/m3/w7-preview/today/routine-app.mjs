// routine-app.mjs - S15 "Change my routine": the editor's screens.
//
// Four views over ONE lane (routine-host.mjs session()): the routine list (with
// reorder), one exercise (rename, sets, rep aim, workout, replace, remove), a
// new exercise (typed or picked from the catalogue), and the week (which days
// are Upper, Lower or rest). Every save is ONE dated plan-edit; the date it
// starts on is on the screen before the button is tapped, and a refusal keeps
// whatever the athlete had entered. Words are routine-model.mjs COPY or
// setup's own; every string goes through plain-copy's render boundary.
import PlainCopy from './plain-copy.cjs';
import M, { SETS_OPTIONS, HI_OPTIONS, WEEKDAYS, WEEKDAY_NAMES, DAY_KINDS, DAY_KIND_WORDS, REST,
  MG_LABELS } from './routine-model.mjs';
import { COPY as SETUP_COPY, glossFor, setsLine, standardStepLine } from './setup-model.mjs';
import { searchByName } from './exercise-catalogue.mjs';

const { plainOrDrop } = PlainCopy;
const { COPY } = M;

const withValue = (options, value) => (options.includes(value) || !Number.isSafeInteger(value) ? options.slice()
  : [...options, value].sort((a, b) => a - b));

export function mountRoutine(doc, root, { routine, onBack } = {}) {
  if (!root) throw new Error('Change my routine: no host element');
  let session = null, view = null, failure = null, alive = true;
  let screen = 'list', message = '', busy = false, focusNext = true;
  let order = null;            // { U: [...ids], L: [...ids] } the reorder draft
  let target = null;           // the row being changed
  let draft = null;            // the exercise draft
  let form = null;             // the new-exercise draft
  let week = null;             // the week draft
  let query = '';
  let pending = Promise.resolve();

  const el = (tag, slot, text) => {
    const node = doc.createElement(tag);
    if (slot) node.dataset.slot = slot;
    if (text !== undefined && text !== null) node.textContent = plainOrDrop(String(text), slot || tag);
    return node;
  };
  function button(slot, label, onTap, className = 'option') {
    const node = el('button', slot, label);
    node.type = 'button';
    node.className = className;
    node.disabled = busy;
    node.addEventListener('click', () => { if (!busy && alive) onTap(); });
    return node;
  }
  function chip(slot, label, pressed, onTap) {
    const node = button(slot, label, () => { onTap(); paint(); });
    node.setAttribute('aria-pressed', String(!!pressed));
    return node;
  }
  function field(id, label, value, onInput, numeric) {
    const wrap = el('div', id);
    wrap.className = 'field';
    const tag = el('label', null, label);
    tag.setAttribute('for', id);
    const input = doc.createElement('input');
    input.id = id;
    if (numeric) { input.inputMode = 'decimal'; }
    input.value = value === undefined || value === null ? '' : String(value);
    input.addEventListener('input', () => onInput(input.value));
    wrap.append(tag, input);
    return wrap;
  }

  /* ------------------------------------------------------------ the lane */
  function served() {
    const rows = M.rowsOf(view.state);
    return { rows, order: { U: rows.U.map(r => r.id), L: rows.L.map(r => r.id) } };
  }
  async function load() {
    if (!session) {
      session = routine && typeof routine.session === 'function' ? await routine.session() : { ok: false, code: 'ROUTINE_UNAVAILABLE' };
      if (!session.ok) { failure = session.code; session = null; return; }
      if (!alive) { session.close(); session = null; return; }
    }
    const next = await session.view();
    if (!next.ok) { failure = next.code; return; }
    failure = null; view = next; order = served().order;
  }
  function run(work) {
    pending = pending.then(work).catch((error) => { message = M.refusalWords(error && error.code); })
      .then(() => { busy = false; if (alive) paint(); });
    return pending;
  }
  /* ONE SAVE. The date shown is the date checked: the lane refuses a save the
     review would date differently. On a refusal the draft is untouched. */
  function save(edit, after) {
    busy = true; paint();
    return run(async () => {
      const result = await session.save(edit, view.starts_on);
      if (!alive) return;
      if (!result.ok) {
        message = M.refusalWords(result.code);
        /* Fable l1 N1: the day turned or the routine moved under the screen, so read the routine again (and with
           it the start date shown), keeping everything the athlete entered, so "save again" can succeed. */
        if (M.RELOAD_CODES.includes(result.code)) {
          const drafted = order;
          await load();
          if (drafted && view) for (const kind of DAY_KINDS) {
            if (JSON.stringify([...drafted[kind]].sort()) === JSON.stringify([...order[kind]].sort())) order[kind] = drafted[kind];
          }
        }
        return;
      }
      message = M.withDate(COPY.savedFor, result.starts_on);
      await load();
      if (after) after();
      screen = 'list'; target = null; draft = null; form = null; week = null; query = ''; focusNext = true;
    });
  }
  function go(next) { screen = next; message = ''; focusNext = true; paint(); }

  /* ------------------------------------------------------------ the screens */
  function head(body, text) {
    const h = el('h1', 'routine-title', text);
    h.tabIndex = -1;
    body.append(h);
    return h;
  }
  function note(body) {
    if (!message) return;
    const p = el('p', 'routine-message', message);
    p.className = 'note';
    p.setAttribute('role', 'status');
    body.append(p);
  }
  function listScreen(body) {
    head(body, COPY.entry);
    body.append(el('p', 'routine-starts', M.withDate(COPY.startsOn, view.starts_on)));
    note(body);
    const { rows, order: now } = served();
    for (const kind of DAY_KINDS) {
      const section = el('section', 'routine-' + kind);
      section.append(el('h2', 'routine-kind', DAY_KIND_WORDS[kind]));
      const list = el('ol', 'routine-list');
      const ids = order[kind];
      ids.forEach((id, index) => {
        const row = rows[kind].find(r => r.id === id);
        if (!row) return;
        const item = el('li', 'routine-row');
        item.dataset.id = row.id;
        item.append(el('p', 'routine-name', row.n), el('p', 'routine-sets', setsLine(row.sets, row.hi)));
        const up = button('routine-up', COPY.moveUp, () => { order[kind] = M.moved(order[kind], index, -1); message = ''; paint(); });
        up.disabled = busy || index === 0;
        const down = button('routine-down', COPY.moveDown, () => { order[kind] = M.moved(order[kind], index, 1); message = ''; paint(); });
        down.disabled = busy || index === ids.length - 1;
        const change = button('routine-change', COPY.change, () => {
          target = row; draft = { n: row.n, sets: row.sets, hi: row.hi, day: row.day }; go('exercise');
        });
        item.append(up, down, change);
        list.append(item);
      });
      section.append(list);
      if (!M.sameOrder(order[kind], now[kind])) {
        section.append(button('routine-save-order', COPY.saveOrder, () => save(M.reorderEdit(kind, order[kind])), 'cta'));
      }
      section.append(button('routine-add', SETUP_COPY.addExercise, () => {
        form = { n: '', mg: '', day: kind, first: '', inc: '', entry: null }; query = ''; go('add');
      }));
      body.append(section);
    }
    body.append(button('routine-week', COPY.week, () => { week = M.weekOf(view.state, view.starts_on); go('week'); }));
    body.append(button('routine-back', SETUP_COPY.back, () => { if (onBack) onBack(); }, 'link'));
  }

  function choices(body, slot, label, options, value, onPick, word = String) {
    const block = el('fieldset', slot);
    block.className = 'question';
    block.append(el('legend', null, label));
    const row = el('div', slot + '-options');
    row.className = 'options';
    for (const option of options) row.append(chip(slot + '-' + option, word(option), value === option, () => onPick(option)));
    block.append(row);
    body.append(block);
  }
  function exerciseScreen(body) {
    head(body, target.n);
    body.append(el('p', 'routine-starts', M.withDate(COPY.startsOn, view.starts_on)));
    note(body);
    body.append(field('routine-name', SETUP_COPY.exerciseNameLabel, draft.n, (v) => { draft.n = v; }));
    choices(body, 'routine-sets', COPY.setsLabel, withValue(SETS_OPTIONS, target.sets), draft.sets, (v) => { draft.sets = v; });
    choices(body, 'routine-hi', SETUP_COPY.hiLabel, withValue(HI_OPTIONS, target.hi), draft.hi, (v) => { draft.hi = v; });
    choices(body, 'routine-workout', COPY.workoutLabel, DAY_KINDS, draft.day, (v) => { draft.day = v; }, (k) => DAY_KIND_WORDS[k]);
    body.append(button('routine-save', COPY.saveChanges, () => {
      const built = M.updateEdit(target, draft);
      if (!built.ok) { message = built.copy; paint(); return; }
      save(built.edit);
    }, 'cta'));
    body.append(button('routine-replace', COPY.replace, () => {
      form = { n: '', mg: '', day: target.day, first: '', inc: '', entry: null }; query = ''; go('replace');
    }));
    body.append(button('routine-remove', COPY.remove, () => go('remove')));
    body.append(button('routine-back', SETUP_COPY.back, () => go('list'), 'link'));
  }
  function removeScreen(body) {
    head(body, M.withName(COPY.removeAsk, target.n));
    body.append(el('p', 'routine-starts', M.withDate(COPY.startsOn, view.starts_on)));
    note(body);
    body.append(button('routine-remove-yes', COPY.removeYes, () => save(M.removeEdit(target.id)), 'cta'));
    body.append(button('routine-keep', COPY.keep, () => go('exercise'), 'link'));
  }
  function newScreen(body, replacing) {
    head(body, replacing ? M.withName(COPY.replaceHead, target.n) : COPY.newHead);
    body.append(el('p', 'routine-starts', M.withDate(COPY.startsOn, view.starts_on)));
    body.append(el('p', 'routine-new-rule', M.newRuleLine()));
    note(body);
    const search = field('routine-search', SETUP_COPY.searchLabel, query, (v) => { query = v; });
    search.querySelector('input').addEventListener('change', () => paint());
    body.append(search);
    /* S15 ROUND 5 POLISH, item 8 (PM UI pass, shots 38/39): the picks follow the words AS HE TYPES. Only
       the results under the box are redrawn on each keystroke; the box is never replaced, so the caret
       stays in his hands. A pick still repaints the screen, as before. */
    const none = el('p', 'routine-search-none', SETUP_COPY.searchNone);
    const list = el('div', 'routine-search-results');
    list.className = 'options';
    const drawPicks = () => {
      const found = query.trim() ? searchByName(query, { limit: 6 }) : [];
      if (query.trim() && !found.length) { if (!none.isConnected) list.before(none); } else none.remove();
      list.hidden = !found.length;
      list.replaceChildren(...found.map((entry) => chip('routine-pick', entry.n, form.entry === entry, () => {
        form.entry = entry; form.n = entry.n; form.mg = entry.mg;
        if (!replacing && Array.isArray(entry.kinds) && entry.kinds.length && !entry.kinds.includes(form.day)) form.day = entry.kinds[0];
      })));
    };
    search.querySelector('input').addEventListener('input', drawPicks);
    body.append(list);
    drawPicks();
    body.append(field('routine-new-name', SETUP_COPY.exerciseNameLabel, form.n, (v) => { form.n = v; }));
    choices(body, 'routine-mg', SETUP_COPY.worksLabel, MG_LABELS, form.mg, (v) => {
      if (form.entry && form.entry.mg !== v) form.entry = null;
      form.mg = v;
    }, glossFor);
    choices(body, 'routine-new-day', COPY.workoutLabel, DAY_KINDS, form.day, (v) => { form.day = v; }, (k) => DAY_KIND_WORDS[k]);
    body.append(field('routine-first', SETUP_COPY.firstLabel, form.first, (v) => { form.first = v; }, true));
    body.append(field('routine-inc', SETUP_COPY.incLabel, form.inc, (v) => { form.inc = v; }, true));
    body.append(el('p', 'routine-step', standardStepLine()));
    body.append(button('routine-save', replacing ? COPY.replace : COPY.saveNew, () => {
      const built = M.newExerciseEdit(form, view.taken, { replaces: replacing ? target.id : null });
      if (!built.ok) { message = built.errors.map(e => e.copy).join(' '); paint(); return; }
      save(built.edit);
    }, 'cta'));
    body.append(button('routine-back', SETUP_COPY.back, () => go(replacing ? 'exercise' : 'list'), 'link'));
  }
  function weekScreen(body) {
    head(body, COPY.weekHead);
    body.append(el('p', 'routine-starts', M.withDate(COPY.startsOn, view.starts_on)));
    note(body);
    const word = (k) => (k === REST ? SETUP_COPY.restWord : DAY_KIND_WORDS[k]);
    for (const d of WEEKDAYS) {
      choices(body, 'routine-day-' + d, WEEKDAY_NAMES[Number(d)], [...DAY_KINDS, REST], week[d], (v) => { week[d] = v; }, word);
    }
    body.append(button('routine-save', COPY.saveWeek, () => save(M.splitEdit(week)), 'cta'));
    body.append(button('routine-back', SETUP_COPY.back, () => go('list'), 'link'));
  }

  function paint() {
    if (!alive) return root;
    const body = el('div', 'routine-screen');
    body.className = 'routine';
    if (!view) {
      head(body, COPY.entry);
      body.append(el('p', 'routine-state', failure ? M.unavailableWords(failure) : COPY.opening));
      body.append(button('routine-back', SETUP_COPY.back, () => { if (onBack) onBack(); }, 'link'));
    } else if (screen === 'exercise' && target) exerciseScreen(body);
    else if (screen === 'remove' && target) removeScreen(body);
    else if ((screen === 'add' || screen === 'replace') && form) newScreen(body, screen === 'replace');
    else if (screen === 'week' && week) weekScreen(body);
    else listScreen(body);
    root.replaceChildren(body);
    if (focusNext) {
      focusNext = false;
      const h = body.querySelector('[data-slot="routine-title"]');
      if (h && typeof h.focus === 'function') h.focus();
    }
    return root;
  }

  paint();
  run(load);
  return Object.freeze({
    paint,
    screen: () => screen,
    settled: () => pending,
    close() { alive = false; if (session) session.close(); },
  });
}

export default { mountRoutine };
