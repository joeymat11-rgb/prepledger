// setup-app.mjs - A4's view: Dad's six first-run screens.
//
// It clones the t-setup template and binds it to setup-model.mjs. It carries NO
// question, NO label, NO choice and NO number of its own: every word comes from
// setup-model.mjs COPY / VALIDATION / MISSING, which design.cjs binds as this
// screen's named preview-owned vocabulary, and the only digits it can put on
// screen are an answer he typed, a weekday, the "n of 6" counter, and the TWO
// declared standards (the standard start on screen 3, the standard step on
// screen 4). Section 2.8 of the BUILD-BRIEF is the provenance for each.
//
// NOTHING IS PRESELECTED except the standard start, which is a PROPOSAL and is
// declared as one on the screen (DECISIONS:114 (2)). Every other choice begins
// unselected and a second tap clears it. Back never destroys an answer: the model
// holds them and navigation only moves.
import TodayApp from './today-app.cjs';
import Model from './setup-model.mjs';
/* THE RENDER BOUNDARY for the owner's no-dashes rule (DECISIONS:114 (1), P1 merged at
   DECISIONS:121). Every string these six screens write into the DOM goes through it,
   exactly as today-app.cjs, gym-app.mjs and checkin-app.mjs do: fail-closed PER SLOT,
   so an unrewritable string blanks its own slot and logs rather than taking the screen
   down. A4's own copy is dash-free by construction and its suite asserts that; this is
   the boundary for anything composed beside it. */
import PlainCopy from './plain-copy.cjs';
/* A4b: the catalogue and the starter week. Both are pure data-and-arithmetic
   modules with no DOM and no store, so this view stays the only thing here that
   knows about the document. */
import { GROUPS, searchByName, regionsOf, entriesFor, customEntry } from './exercise-catalogue.mjs';
import { proposeWeek } from './starter-week.mjs';

const { plainOrDrop } = PlainCopy;
const { ARROW } = TodayApp;
const { COPY, VALIDATION, MISSING, MG_LABELS, SETS_OPTIONS, HI_OPTIONS, WEEKDAYS,
  WEEKDAY_NAMES, DAY_KINDS, DAY_KIND_WORDS, SCREENS, STANDARD_INC, STANDARD_INC_UNIT,
  GROUP_WORDS, REGION_WORDS,
  standardStartLine, standardStepLine, standardStepSummary, counterLine, glossFor,
  dayKindValidation, parseRungs,
  /* DECISIONS:133 (2): the one naming predicate and the summary's sets line. */
  namedExercise, setsLine } = Model;

const groupWord = (g) => GROUP_WORDS[g] || g;
const regionWord = (r) => REGION_WORDS[r] || r;

export function mountSetup(doc, phone, { model, onDone, onBack } = {}) {
  if (!phone) throw new Error('First run: no host element');
  let busy = false;
  let entered = false;
  let message = '';
  const openRungs = new Set();
  /* SCREEN 3'S VIEW STATE, and nothing else's. Which door he is standing in,
     which group and region the picker has open, and what he has typed into the
     two boxes. None of it is an answer, none of it reaches the model, and none
     of it reaches the document: closing the page loses exactly this and no
     answer with it. */
  let door = null;
  let group = null;
  let region = null;
  let query = '';
  let custom = '';

  const el = (tag, className, text, where) => {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = plainOrDrop(String(text), where || className || tag);
    return node;
  };
  const slots = (root) => {
    const map = new Map();
    for (const node of root.querySelectorAll('[data-slot]')) if (!map.has(node.dataset.slot)) map.set(node.dataset.slot, node);
    return map;
  };
  function put(map, name, text) {
    const node = map.get(name);
    if (!node) throw new Error('First run: template slot missing - ' + name);
    node.textContent = text === null || text === undefined ? '' : plainOrDrop(String(text), name);
    node.hidden = text === null || text === undefined || text === '';
    return node;
  }
  /* A chip. `.option` is the approved design's own answer control, so the tap
     target and the pressed state are the approved ones. */
  function chip(label, isPressed, onTap, className = 'option') {
    const button = el('button', className, label);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(!!isPressed));
    button.addEventListener('click', () => { onTap(); paint(); });
    return button;
  }
  function textField(id, labelText, value, onInput, type) {
    const wrap = el('div', 'field');
    const label = el('label', null, labelText);
    label.setAttribute('for', id);
    const input = doc.createElement('input');
    input.id = id;
    if (type) { input.type = type; input.inputMode = type === 'number' ? 'decimal' : 'text'; input.min = '0'; input.step = 'any'; }
    input.value = value === undefined || value === null ? '' : String(value);
    input.addEventListener('input', () => { onInput(input.value); message = ''; });
    input.addEventListener('change', () => { onInput(input.value); });
    wrap.append(label, input);
    return wrap;
  }

  /* ---------------------------------------------------------------- screen 1 */
  function screen1(body, answers) {
    body.append(textField('setup-name', COPY.nameLabel, answers.name, (v) => model.setName(v)));
  }

  /* ---------------------------------------------------------------- screen 2
     A4b (DECISIONS:125 (1)): seven weekday toggles, and Earned says what each
     chosen day IS. The kind chips stay, because the proposal is a proposal: a
     tap makes the day his and the model stops re-proposing it. A day left off
     is written REST explicitly (athlete-state.cjs:82-92, S7). */
  function screen2(body, answers) {
    body.append(el('p', 'small muted', COPY.screen2Proposal));
    const mine = model.overrides();
    for (const d of WEEKDAYS) {
      const name = WEEKDAY_NAMES[Number(d)];
      const block = el('fieldset', 'question');
      const legend = el('legend', null, name);
      const row = el('div', 'options');
      row.append(chip(name, answers.days[d] !== null, () => model.toggleDay(d)));
      if (answers.days[d] !== null) {
        for (const kind of DAY_KINDS) {
          row.append(chip(DAY_KIND_WORDS[kind], answers.days[d] === kind, () => model.setDayKind(d, kind)));
        }
      }
      block.append(legend, row);
      /* Whose choice this day's kind is, said plainly, so a proposal is never
         mistaken for something he answered. */
      if (DAY_KINDS.includes(answers.days[d])) {
        block.append(el('p', 'fine', Object.hasOwn(mine, d) ? COPY.screen2Yours : COPY.screen2Ours));
      }
      if (model.validationShown() && answers.days[d] === '') {
        block.append(el('p', 'small muted', dayKindValidation(name)));
      }
      body.append(block);
    }
    /* The rule, declared as Earned's own invention, under the days it moved, and
       beneath it what the rule is FOR, which is not invented (DECISIONS:129 (3);
       the citation itself is in split-kinds.mjs, not on the screen). */
    body.append(el('p', 'small muted', COPY.screen2Rule));
    body.append(el('p', 'small muted', COPY.screen2Why));
    /* The honest sentences for the weeks the engine cannot yet serve well
       (DECISIONS:125 (2), F1). Predicate only: they appear when the week is that
       small and clear the moment it is not. */
    const chosen = WEEKDAYS.filter((d) => answers.days[d] !== null).length;
    if (chosen === 1) body.append(el('p', 'small muted', COPY.screen2OneDay));
    if (chosen === 2) body.append(el('p', 'small muted', COPY.screen2TwoDays));
  }

  /* ---------------------------------------------------------------- screen 3
     A4b (DECISIONS:127 (1)): TWO DOORS, then the SAME editable week behind both.
     The door is a view state, never an answer: it is not in the model and not in
     the document, and switching doors adds nothing and destroys nothing. */
  function doorsPanel(body) {
    const panel = el('div', 'followup');
    panel.append(el('p', 'section-label', COPY.doorsHead));
    for (const [key, label, blurb] of [
      ['build', COPY.doorBuild, COPY.doorBuildBody],
      ['choose', COPY.doorChoose, COPY.doorChooseBody]]) {
      const button = el('button', 'option', label);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(door === key));
      button.addEventListener('click', () => { openDoor(key); paint(); });
      panel.append(button);
      panel.append(el('p', 'fine', blurb));
    }
    body.append(panel);
  }

  /* "Build my week for me". The proposal is computed from the days he chose and
     nothing else, and it REPLACES only its own previous rows. */
  function openDoor(key) {
    door = key;
    if (key !== 'build') return;
    const kinds = {};
    const answers = model.answers();
    for (const d of WEEKDAYS) if (DAY_KINDS.includes(answers.days[d])) kinds[Number(d)] = answers.days[d];
    const week = proposeWeek({ kinds, sets: answers.sets, hi: answers.hi });
    model.applyProposal(week.rows, week.tags);
  }

  /* The kind a catalogue entry goes on: the first of its own kinds his split
     actually contains, so nothing lands on a day he does not train. */
  function kindFor(entry) {
    const inSplit = model.kindsInSplit();
    for (const k of entry.kinds || []) if (inSplit.includes(k)) return k;
    return inSplit[0] || null;
  }

  function addEntry(entry) {
    const kind = kindFor(entry);
    if (!kind) return;
    model.addFromCatalogue(kind, entry);
  }

  /* A box whose CONTENT changes what is on the screen below it repaints when he
     is done typing, never on every keystroke: repainting mid-word would take the
     caret out of his hands, which is the one thing a text field may not do. */
  function repaintOnChange(wrap) {
    const input = wrap.querySelector('input');
    if (input) input.addEventListener('change', () => paint());
    return wrap;
  }

  /* Door two, layer zero: by name. Matches n and every alias, case-insensitive
     (DECISIONS:127 (2)); it never asks him what the lift targets. */
  function searchPanel(body) {
    const panel = el('div', 'followup');
    panel.append(repaintOnChange(textField('setup-search', COPY.searchLabel, query, (v) => { query = v; })));
    const found = searchByName(query, { limit: 8 });
    if (query.trim() !== '' && found.length === 0) panel.append(el('p', 'small muted', COPY.searchNone));
    for (const entry of found) {
      const line = el('div', 'row');
      line.append(el('span', null, entry.n));
      const add = el('button', 'text-link', COPY.addFromCatalogue);
      add.type = 'button';
      add.addEventListener('click', () => { addEntry(entry); query = ''; paint(); });
      line.append(add);
      panel.append(line);
    }
    body.append(panel);
  }

  /* Layer one and layer two: six groups, then that group's regions, then its
     lifts. Stopping at the group is complete where the group names one engine
     bucket; where it does not, the screen says so instead of guessing. */
  function pickerPanel(body) {
    const panel = el('div', 'followup');
    panel.append(el('p', 'quality-label', COPY.workLabel));
    if (group === null) {
      const row = el('div', 'options');
      for (const g of GROUPS) row.append(chip(groupWord(g), false, () => { group = g; region = null; }));
      panel.append(row);
      body.append(panel);
      return;
    }
    const back = el('button', 'text-link', COPY.groupBack);
    back.type = 'button';
    back.addEventListener('click', () => { group = null; region = null; paint(); });
    panel.append(back);
    const regions = regionsOf(group);
    if (regions.length) {
      const row = el('div', 'options');
      for (const r of regions) row.append(chip(regionWord(r), region === r, () => { region = region === r ? null : r; }));
      panel.append(row);
    }
    for (const entry of entriesFor(group, region)) {
      const line = el('div', 'row');
      line.append(el('span', null, entry.n));
      const add = el('button', 'text-link', COPY.addFromCatalogue);
      add.type = 'button';
      add.addEventListener('click', () => { addEntry(entry); paint(); });
      line.append(add);
      panel.append(line);
    }
    /* The custom picker (DECISIONS:127 (3)): his own name, tagged by the door he
       is standing in. */
    panel.append(el('p', 'quality-label', COPY.customHead));
    panel.append(repaintOnChange(textField('setup-custom', COPY.exerciseNameLabel, custom, (v) => { custom = v; })));
    const made = customEntry({ group, region, name: custom });
    const addCustom = el('button', 'text-link', COPY.addFromCatalogue);
    addCustom.type = 'button';
    addCustom.id = 'setup-custom-add';
    addCustom.disabled = !!made.error;
    addCustom.addEventListener('click', () => {
      const entry = customEntry({ group, region, name: custom });
      if (entry.error) return;
      addEntry(entry);
      custom = '';
      paint();
    });
    panel.append(addCustom);
    if (custom.trim() !== '' && made.error === 'CUSTOM_REGION_REQUIRED') {
      panel.append(el('p', 'small muted', COPY.customRegionRequired));
    }
    body.append(panel);
  }

  /* Both doors land on the SAME editable week (S34), so the week itself is NOT
     behind either of them: the standard start and the per-kind lists are always
     on the screen, and the doors sit above them as two ways to fill them. A door
     is therefore never a wall - the other one stays one tap away, and so does
     adding a lift by hand, exactly as A4 already allowed. */
  function screen3(body, answers) {
    doorsPanel(body);
    /* The arithmetic, said out loud, for the week sizes the bands cannot hold
       (A4B-BRIEF 4.4). Predicate only, over the days he actually chose. */
    const trainingDays = WEEKDAYS.filter((d) => DAY_KINDS.includes(answers.days[d])).length;
    if (trainingDays > 0 && trainingDays <= 2) {
      body.append(el('p', 'small muted', COPY.floorSentence));
      body.append(el('p', 'small muted', COPY.minorsSentence));
    }
    if (door !== null) {
      const switcher = el('button', 'text-link',
        door === 'build' ? COPY.doorSwitchToChoose : COPY.doorSwitchToBuild);
      switcher.type = 'button';
      switcher.addEventListener('click', () => { openDoor(door === 'build' ? 'choose' : 'build'); paint(); });
      body.append(switcher);
      if (door === 'build') {
        const again = el('button', 'text-link', COPY.doorRebuild);
        again.type = 'button';
        again.addEventListener('click', () => { openDoor('build'); paint(); });
        body.append(again);
      }
    }
    if (door === 'choose') { searchPanel(body); pickerPanel(body); }
    screen3Standard(body, answers);
  }

  function screen3Standard(body, answers) {
    const standard = el('div', 'followup');
    standard.append(el('p', 'section-label', COPY.standardHead));
    standard.append(el('h2', null, standardStartLine()));
    standard.append(el('p', null, COPY.standardBody));
    standard.append(el('p', 'quality-label', COPY.setsLabel));
    const setsRow = el('div', 'options');
    for (const value of SETS_OPTIONS) setsRow.append(chip(String(value), answers.sets === value, () => model.chooseSets(value)));
    standard.append(setsRow);
    standard.append(el('p', 'quality-label', COPY.hiLabel));
    const hiRow = el('div', 'options');
    for (const value of HI_OPTIONS) hiRow.append(chip(String(value), answers.hi === value, () => model.chooseHi(value)));
    standard.append(hiRow);
    body.append(standard);
    body.append(el('p', 'small muted', COPY.screen3NoLoad));
    for (const kind of model.kindsInSplit()) body.append(exerciseList(kind, answers));
  }

  function exerciseList(kind, answers) {
    const block = el('fieldset', 'question');
    block.append(el('legend', null, DAY_KIND_WORDS[kind]));
    for (const row of answers.exercises.filter((x) => x.day === kind)) {
      const card = el('div', 'followup');
      card.append(textField('setup-n-' + row.key, COPY.exerciseNameLabel, row.n,
        (v) => model.setExerciseField(row.key, 'n', v)));
      card.append(el('p', 'quality-label', COPY.worksLabel));
      const chips = el('div', 'options');
      /* THE CHIPS (S25). The gloss is DISPLAY ONLY; what is stored is the bare
         engine label, and there is no coarse group anywhere on this path. */
      for (const label of MG_LABELS) {
        chips.append(chip(glossFor(label), row.mgSource === 'label' && row.mg === label,
          () => model.chooseMg(row.key, label)));
      }
      chips.append(chip(COPY.somethingElse, row.mgSource === 'other', () => model.chooseMgOther(row.key)));
      card.append(chips);
      if (row.mgSource === 'other') {
        card.append(textField('setup-mg-' + row.key, COPY.worksLabel, row.mg,
          (v) => model.setMgOther(row.key, v)));
      }
      const remove = el('button', 'text-link', COPY.removeExercise);
      remove.type = 'button';
      remove.addEventListener('click', () => { model.removeExercise(row.key); paint(); });
      card.append(remove);
      block.append(card);
    }
    const add = el('button', 'text-link', COPY.addExercise);
    add.type = 'button';
    add.addEventListener('click', () => { model.addExercise(kind); paint(); });
    block.append(add);
    return block;
  }

  /* ---------------------------------------------------------------- screen 4
     The equipment screen. NO STARTING LOAD IS COLLECTED (S20): these two numbers
     are about the machine, and the first session is the probe. */
  function screen4(body, answers) {
    for (const row of answers.exercises) {
      const card = el('div', 'followup');
      card.append(el('p', 'section-label', row.n.trim() === '' ? COPY.exerciseNameLabel : row.n.trim()));
      card.append(el('p', 'small muted', COPY.screen4Hint));
      card.append(textField('setup-first-' + row.key, COPY.firstLabel, row.first,
        (v) => model.setExerciseField(row.key, 'first', v), 'number'));
      card.append(textField('setup-inc-' + row.key, COPY.incLabel, row.inc,
        (v) => model.setExerciseField(row.key, 'inc', v), 'number'));
      /* The standard step, said on the field's own helper line BEFORE he leaves
         it. Never pre-filled into the box: an empty box is unanswered, and the
         flow says what it will do with that rather than pretending he typed it. */
      card.append(el('p', 'small muted', standardStepLine()));
      const details = doc.createElement('details');
      details.className = 'checkin-note';
      details.open = openRungs.has(row.key);
      const summary = doc.createElement('summary');
      summary.textContent = plainOrDrop(COPY.rungsSummary, 'rungs-summary');
      details.append(summary);
      details.append(textField('setup-rungs-' + row.key, COPY.rungsLabel, row.rungs,
        (v) => model.setExerciseField(row.key, 'rungs', v)));
      details.addEventListener('toggle', () => {
        if (details.open) openRungs.add(row.key); else openRungs.delete(row.key);
      });
      card.append(details);
      if (model.validationShown()) {
        const rungs = parseRungs(row.rungs);
        if (rungs.length > 1 && !Model.isAscending(rungs)) card.append(el('p', 'small muted', VALIDATION.rungs));
      }
      body.append(card);
    }
  }

  /* ---------------------------------------------------------------- screen 5
     The one genuinely skippable answer, and the screen says so in its own words:
     it changes nothing yet, because no engine reader on the session path consumes
     priority_muscles (athlete-state.cjs:150-153). No free entry here. */
  function screen5(body, answers) {
    const chips = el('div', 'options');
    for (const label of MG_LABELS) {
      chips.append(chip(glossFor(label), answers.priorities.includes(label), () => model.togglePriority(label)));
    }
    body.append(chips);
  }

  /* ---------------------------------------------------------------- screen 6
     Not a "Done!" screen: what Earned now knows, in his own words and numbers,
     and an honest list of what it still does not. */
  function screen6(body, answers) {
    for (const d of WEEKDAYS) {
      const kind = answers.days[d];
      const row = el('div', 'macro-row');
      const top = el('div', 'row');
      top.append(el('strong', null, WEEKDAY_NAMES[Number(d)]));
      top.append(el('span', 'unit', DAY_KINDS.includes(kind) ? DAY_KIND_WORDS[kind] : COPY.restWord));
      row.append(top);
      const lifts = DAY_KINDS.includes(kind) ? answers.exercises.filter((x) => x.day === kind) : [];
      /* DECISIONS:133 (2). The row names the exercise even when he has not, and
         the sets read as a sentence rather than as screen 3's field label. */
      for (const lift of lifts) {
        const line = namedExercise(lift.n) + ': ' + (lift.mg.trim() || COPY.worksLabel)
          + ' · ' + setsLine(answers.sets, answers.hi);
        row.append(el('p', 'fine', line));
      }
      body.append(row);
    }
    for (const lift of answers.exercises) {
      const rungs = parseRungs(lift.rungs);
      const step = lift.inc.trim() === '' ? standardStepSummary()
        : COPY.jumpWord + ': ' + lift.inc.trim() + ' ' + STANDARD_INC_UNIT;
      const first = rungs.length ? rungs.join(', ') : lift.first.trim();
      body.append(el('p', 'fine', namedExercise(lift.n) + ': '
        + COPY.firstLabel.toLowerCase() + ' ' + (first === '' ? COPY.unknownWord : first) + ' · ' + step));
    }
    const priorities = el('div', 'macro-row');
    priorities.append(el('strong', null, COPY.screen6Priorities));
    priorities.append(el('p', null, answers.priorities.length
      ? answers.priorities.join(', ') : COPY.screen6Nothing));
    body.append(priorities);
    body.append(el('p', 'note', COPY.screen6NoLoad));
  }

  /* THE NAMED REFUSAL (screen 6). Not a modal and not a guess: every unknown is
     listed once, each line tappable back to the screen that owns it, and the
     primary action is disabled until nothing is unknown. */
  function refusalBlock(body, missing) {
    const block = el('div', 'followup');
    block.append(el('p', 'section-label', COPY.refusalHead));
    /* ONE GAP PER LINE (DECISIONS:133 (2)). These were bare inline buttons, so
       the browser flowed them into one run-on sentence and the owner read three
       gaps as one: "... has no exercises in it., has nothing it works yet., has
       no lightest setting yet.". Each now sits in its own block, and each copy
       is a whole sentence with a subject (setup-model.mjs missingExercises). */
    for (const item of missing) {
      const wrap = el('p', 'gap');
      const line = el('button', 'text-link', item.copy);
      line.type = 'button';
      line.addEventListener('click', () => { model.goto(item.screen); paint(true); });
      wrap.append(line);
      block.append(wrap);
    }
    body.append(block);
  }

  const HEADS = [COPY.screen1Head, COPY.screen2Head, COPY.screen3Head, COPY.screen4Head,
    COPY.screen5Head, COPY.screen6Head];
  const LEADS = [COPY.screen1Lead, COPY.screen2Lead, COPY.screen3Lead, COPY.screen4Lead,
    COPY.screen5Lead, ''];
  const NOTES = ['', COPY.screen2Kinds, '', '', COPY.screen5Honest, ''];
  const BODIES = [screen1, screen2, screen3, screen4, screen5, screen6];

  function paint(focus = false) {
    const n = model.screen();
    const answers = model.answers();
    const root = doc.getElementById('t-setup').content.firstElementChild.cloneNode(true);
    const map = slots(root);
    for (const node of root.querySelectorAll('[data-arrow]')) node.innerHTML = ARROW;
    put(map, 'counter', counterLine(n));
    put(map, 'head', HEADS[n - 1]);
    put(map, 'lead', LEADS[n - 1]);
    put(map, 'note', NOTES[n - 1]);

    const back = map.get('back');
    back.hidden = n === 1 && !onBack;
    put(map, 'back-label', COPY.back);
    back.addEventListener('click', () => {
      if (n === 1) { if (onBack) onBack(); return; }
      model.back();
      paint(true);
    });

    const body = map.get('body');
    body.replaceChildren();
    BODIES[n - 1](body, answers);

    const missing = model.missing();
    if (n === SCREENS && missing.length) refusalBlock(body, missing);

    const error = root.querySelector('#setup-error');
    if (model.validationShown() && n === 1 && answers.name.trim() === '') {
      error.textContent = plainOrDrop(VALIDATION.name, 'setup-error');
    } else error.textContent = plainOrDrop(message, 'setup-error');

    const primary = map.get('primary');
    const ready = n < SCREENS || missing.length === 0;
    put(map, 'primary-label', n === SCREENS ? COPY.start : COPY.next);
    primary.disabled = busy || !ready;
    primary.addEventListener('click', async () => {
      if (busy) return;
      if (n < SCREENS) { model.next(); paint(true); return; }
      const built = model.document();
      if (!built.ok) { paint(); return; }
      busy = true;
      primary.disabled = true;
      /* ONE argument, an ENVELOPE. today-entry.mjs's `onDone(document_)` forwards
         whatever it is handed, unchanged, to the durable lane; that file is
         byte-identical to the tip because the merged B-NTC artifact pins the
         files around it on disk, so A4b's third payload member travels INSIDE
         the one argument rather than as a second one. setup-host.mjs unpacks it
         (envelopeOf) and w6 never sees the difference. */
      const result = await onDone({ setup: built.setup, tags: built.tags });
      busy = false;
      if (!result || result.ok !== true) {
        message = (result && result.copy) || COPY.saveRefused;
        paint();
      }
    });

    /* The ONLY skip-like affordance in the whole flow, on the one screen whose
       answer is genuinely optional (S21). */
    const secondary = map.get('secondary');
    if (n === 5) {
      secondary.hidden = false;
      secondary.textContent = plainOrDrop(COPY.skip, 'secondary');
      secondary.addEventListener('click', () => { model.next(); paint(true); });
    } else secondary.hidden = true;

    /* The fine slot stays empty: screen 6 carries the no-load sentence in its own
       body, beside the week it is about, and saying it twice would be noise. */
    put(map, 'fine', '');

    phone.replaceChildren(root);
    if (!entered || focus) {
      entered = true;
      const heading = root.querySelector('h1') || root;
      heading.tabIndex = -1;
      heading.focus();
    }
    return root;
  }

  return paint();
}

export default { mountSetup };
