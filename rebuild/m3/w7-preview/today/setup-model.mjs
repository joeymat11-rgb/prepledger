// setup-model.mjs - A4, Dad's first run. The PURE state machine behind the six
// screens. It holds the athlete's answers in memory, names every missing one, and
// builds the ONE document rebuild/m4/workout/athlete-state.cjs createCleanInitState
// accepts. It touches no store, no clock of its own and no DOM.
//
// H1 (DECISIONS:93 condition C3, BUILD-BRIEF S24). This file imports NOTHING from
// rebuild/engine. The three numbers Earned supplies are declared HERE as literals,
// each with the provenance BUILD-BRIEF section 2.8 recorded for it, and not one of
// them is read off seed.cjs, which is one athlete's own lifts.
//
// The contract is imported, never retyped (BUILD-BRIEF S2): REQUIRED_SETUP and
// REQUIRED_EXERCISE come out of the constructor's own module, so a member added
// upstream fails this flow's tests instead of silently going unsent.
import AthleteState from '../../../m4/workout/athlete-state.cjs';
/* A4b: the kind of each training day is PROPOSED, not asked (DECISIONS:125 (1)).
   The rule lives in its own pure module so a different ruling is one file. */
import { proposeKinds } from './split-kinds.mjs';

export const { REQUIRED_SETUP, REQUIRED_EXERCISE } = AthleteState;
export const { createCleanInitState } = AthleteState;

/* THE MUSCLE LABELS, SPELLED AS THE ENGINE SPELLS THEM (DECISIONS:115).
   Source: rebuild/engine/seed.cjs EXERCISES (:14-60) - delts :16, back :20,
   biceps :31, chest :33, forearms :39, triceps :41, calves :46, abs :48,
   quads :52, glutes :54, hams :58. The list is a LITERAL here, not a read of
   seed.cjs (S24: nothing in a setup file may import or copy from the engine);
   test/setup.test.mjs parses seed.cjs at TEST time and asserts the two agree,
   so a label added upstream tells the builder rather than drifting (S25). */
export const MG_LABELS = Object.freeze(['chest', 'back', 'delts', 'biceps', 'triceps',
  'forearms', 'abs', 'quads', 'hams', 'glutes', 'calves']);

/* A plain-language gloss shown BESIDE a label. DISPLAY ONLY (DECISIONS:115
   "never a different stored value"): the engine has no gloss table, so these
   words are INVENTED, and S25 asserts no gloss is ever stored. */
export const MG_GLOSS = Object.freeze({ delts: 'shoulders', abs: 'core',
  quads: 'front of thigh', hams: 'hamstrings' });

/* THE STANDARD START (DECISIONS:114 (2), :117 (5)). INVENTED, declared on screen
   as Earned's own standard, changeable, and never one athlete's numbers. The
   accepted engine has no default set count or rep target for a new lift:
   constants.cjs:327 VOL_BANDS counts WEEKLY sets per muscle, progression.cjs:426
   ex.hi || 8 is a guard clean-init never reaches. Cited, NOT derived. */
export const STANDARD_SETS = 3;
export const STANDARD_HI = 10;
/* THE STANDARD STEP. SOURCED: rebuild/engine/migrate.cjs:795 clamps any inc above
   5 down to 5, and the engine's own two newborn lifts are minted with inc: 5
   (:1651, :1653). A literal here for the same H1 reason as the labels. */
export const STANDARD_INC = 5;
export const STANDARD_INC_UNIT = 'lb';

/* Ranges AROUND the standard. INVENTED (section 2.8); the only engine bound on
   either member is "positive integer" (athlete-state.cjs:72, :105, :106). */
export const SETS_OPTIONS = Object.freeze([2, 3, 4]);
export const HI_OPTIONS = Object.freeze([6, 8, 10, 12]);

/* The weekday keys athlete-state.cjs:82-87 requires, in the order
   rebuild/engine/plan.cjs:11 reads them: mk(iso).getDay(), 0 = Sunday. */
export const WEEKDAYS = Object.freeze(['0', '1', '2', '3', '4', '5', '6']);
export const WEEKDAY_NAMES = Object.freeze(['Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday']);
/* athlete-state.cjs:61 DAY_KINDS, and the words the screen uses for them. */
export const DAY_KINDS = Object.freeze(['U', 'L']);
export const DAY_KIND_WORDS = Object.freeze({ U: 'Upper body', L: 'Lower body' });
export const REST = 'REST';
export const SCREENS = 6;

/* ---------------------------------------------------------------- the copy.
   Every sentence the six screens can show, in one place, so design.cjs can bind
   them and test/setup.test.mjs can scan them. NO EM DASH AND NO EN DASH
   (DECISIONS:114 (1), owner verbatim "no ai dashes are allowed in the ui"): an
   aside is a colon or a new sentence, a range is the word "to". S23 asserts it
   over this module, the view, the template and the rendered DOM. */
export const COPY = Object.freeze({
  brand: 'Earned',
  next: 'Next',
  back: 'Back',
  skip: 'Skip',
  addExercise: 'Add an exercise',
  removeExercise: 'Remove',
  somethingElse: 'Something else',
  screen1Head: 'Let’s set up your week.',
  screen1Lead: 'Six short questions. Nothing here is a target or a promise: it is what your gym can do and when you can get there.',
  nameLabel: 'What should we call you?',
  screen2Head: 'Which days?',
  screen2Lead: 'Tap the days you will be in the gym, then say what each one is. You can change this whenever your week changes.',
  screen2Kinds: 'Earned plans two kinds of day so far: upper body and lower body.',
  /* A4b screen 2 (DECISIONS:125 (1), confirmed :129 (3)). He picks the days;
     Earned says what each one is. The MECHANISM is Earned's own and the screen
     says so in its own words: no published standard states it, and inventing a
     citation for it would be worse than admitting the invention. What it is FOR
     is cited, in the next line. */
  screen2Proposal: 'Tap the days you will be in the gym. Earned says what each day is.',
  screen2Rule: 'Earned alternates upper and lower down your week, and when the count is odd it repeats the kind across your longest gap. That is Earned’s own rule, not a published standard. Change any day and Earned will leave it alone after that.',
  /* WHAT THE RULE IS FOR, which is not invented (DECISIONS:129 (3)): each muscle
     worked about twice a week with roughly two days between sessions of the same
     kind. The citation itself lives in split-kinds.mjs's header, where a source
     belongs; the screen says the intent in his words and no digits. */
  screen2Why: 'The point is to work each muscle about twice a week, with a couple of days between sessions of the same kind.',
  screen2Yours: 'Your choice',
  screen2Ours: 'Earned’s suggestion',
  /* The F1 sentence, verbatim from DECISIONS:125 (2). It is shown only while a
     two-day week is what he has chosen, and it will clear itself the day F1
     merges, with no edit here. */
  screen2TwoDays: 'With two days, Earned\'s full-body plan is coming; for now one upper day and one lower day.',
  /* Its sibling. One day is the same shortfall, further along, and saying it
     only for two days would be a silence for the athlete who has less. */
  screen2OneDay: 'With one day, Earned can give you one upper day. A second day is what lets it cover your lower body at all.',
  screen3Head: 'What you will do.',
  screen3Lead: 'Name what you actually use. A machine’s own label is a fine name.',
  screen3NoLoad: 'Do not add a weight yet. Earned asks for that at the gym, on the day.',
  standardHead: 'Earned’s standard start',
  standardBody: 'That is where Earned starts every new lift, the same for every exercise below. Change either one if you already know better.',
  setsLabel: 'Sets of each exercise',
  hiLabel: 'Reps you aim to reach before the weight goes up',
  worksLabel: 'What does it work?',
  exerciseNameLabel: 'What is it called?',
  /* A4b screen 3 (DECISIONS:127 (1)): TWO DOORS, both landing on one editable
     week. Neither door asks a beginner what a lift targets. */
  doorsHead: 'How do you want to start?',
  doorBuild: 'Build my week for me',
  doorBuildBody: 'Earned fills the days you chose with a starting set of exercises. Rename, remove or add anything afterwards.',
  doorChoose: 'I’ll choose',
  doorChooseBody: 'Search by name, or say what you want to work and pick from there.',
  doorSwitchToBuild: 'Or let Earned build it for me',
  doorSwitchToChoose: 'Or pick them myself',
  doorRebuild: 'Build it again',
  searchLabel: 'Search for an exercise',
  searchNone: 'Nothing by that name yet. You can add it yourself below.',
  workLabel: 'What do you want to work?',
  groupBack: 'Back to all of them',
  addFromCatalogue: 'Add',
  customHead: 'Not in the list?',
  customRegionRequired: 'Pick a part of it. Earned counts arms and legs one muscle at a time, so it needs to know which one.',
  /* The band sentences. Both are arithmetic said out loud, never a reassurance:
     A4B-BRIEF 4.4, over the engine's own VOL_BANDS (constants.cjs:327). */
  floorSentence: 'Two days is the floor of what Earned can count, not the middle of it. Each muscle gets six sets a week here, and Earned’s band starts at eight.',
  minorsSentence: 'At two days there is no room for arms or shoulders on their own. They get worked by the presses and the rows, and Earned does not yet count that toward them.',
  screen4Head: 'What the weights do.',
  screen4Lead: 'This is about the machine, not about you. Look at the stack or the plates and tell us what it can make.',
  screen4Hint: 'For example, the lightest pin, and how far apart the pins are.',
  firstLabel: 'Lightest setting',
  incLabel: 'Smallest jump up',
  rungsSummary: 'My machine’s jumps are uneven: let me list them',
  rungsLabel: 'The whole stack, smallest first',
  screen5Head: 'Anything in particular?',
  screen5Lead: 'Tap what you care about most. You can leave this empty.',
  screen5Honest: 'We will keep this with your plan. It does not change your sessions yet.',
  screen6Head: 'Here’s your week.',
  screen6NoLoad: 'We have not put a weight on anything. On your first session Earned will ask you to pick a load you can control, and whatever that gives is where you start.',
  repsWord: 'reps',
  jumpWord: 'jump',
  unknownWord: 'not answered yet',
  setupEntry: 'Set up your week',
  /* C1 (A4 review round 1). THE ONE SENTENCE THE LANDING TODAY OWES HIM. His
     answers are durably recorded, but the accepted engine cannot yet paint a
     clean-init athlete (register item H3), so Today is still standing on the
     preview's sample athlete. Saying nothing there is S19's named silent
     failure, "a fake dashboard greets a brand-new athlete". It is shown ONLY
     while the record holds his first run AND the screen is not yet his, and it
     clears itself the day H3 closes, with no edit. */
  notHisNumbersYet: 'Your week is saved on this device. The numbers on this screen are still the preview’s sample athlete, not you. Nothing here was measured from anything you did.',
  screen6Priorities: 'What matters most',
  screen6Nothing: 'nothing named',
  refusalHead: 'Earned can’t build your week yet',
  start: 'Start using Earned',
  restWord: 'Rest',
  saveRefused: 'Your week could not be recorded on this device, and no part of it was recorded.',
  alreadyRecorded: 'This device is already set up. Nothing was recorded.',
});

/* A4b, the picker's two layers in plain words (DECISIONS:127 (3)). DISPLAY ONLY,
   exactly as MG_GLOSS is: what the catalogue stores and what the document
   carries is always the engine's own label, never one of these. The words
   themselves are INVENTED - the engine names only the three delt heads
   (constants.cjs:333) - and no stored value is derived from them. */
export const GROUP_WORDS = Object.freeze({
  chest: 'Chest', back: 'Back', shoulders: 'Shoulders',
  arms: 'Arms', legs: 'Legs', core: 'Core',
});
export const REGION_WORDS = Object.freeze({
  lats: 'Lats', upper_back: 'Upper back', traps: 'Traps', lower_back: 'Lower back',
  delts_front: 'Front delts', delts_side: 'Side delts', delts_rear: 'Rear delts',
  biceps: 'Biceps', triceps: 'Triceps', forearms: 'Forearms',
  quads: 'Quads', hams: 'Hamstrings', glutes: 'Glutes', calves: 'Calves', abs: 'Abs',
});

/* The validation words, verbatim from BRIEF.md sections 3 and 6. Shown quietly,
   beside the answer they are about, and only after he has tried to move on. */
export const VALIDATION = Object.freeze({
  name: 'We need something to call you. A first name is fine.',
  dayKind: 'Tell us what DAY is: upper or lower.',
  load: 'That doesn’t look like a weight. Numbers only.',
  inc: 'The jump needs to be more than nothing.',
  rungs: 'Put them smallest first and we’ll take it from there.',
});
export const dayKindValidation = (name) => VALIDATION.dayKind.replace('DAY', name);

/* THE REFUSAL TABLE (S3). Every CLEAN_INIT_* code the constructor can throw has
   a screen sentence here, and test/setup.test.mjs enumerates the codes out of
   rebuild/m4/workout/athlete-state.cjs at test time: a code added upstream with
   no sentence fails the suite rather than showing Dad a raw code. */
export const REFUSAL_SENTENCES = Object.freeze({
  CLEAN_INIT_SETUP_REQUIRED: 'We don’t know what to call you.',
  CLEAN_INIT_SPLIT_REQUIRED: 'We don’t know which days you train.',
  CLEAN_INIT_EXERCISES_REQUIRED: 'Your week has no exercises in it yet.',
  CLEAN_INIT_EXERCISE_REQUIRED: 'One of your exercises is not finished yet.',
  CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED: 'A priority needs a name. Leave it out instead.',
});
const MISSING = Object.freeze({
  name: 'We don’t know what to call you.',
  days: 'We don’t know which days you train.',
  dayKind: 'DAY doesn’t have a session kind yet.',
  kindEmpty: 'Your KIND day has no exercises in it.',
  kindMissing: 'You have KIND exercises, but no KIND day in your week.',
  exerciseName: 'One exercise on your KIND day still has no name.',
  exerciseMg: 'NAME has nothing it works yet.',
  exerciseFirst: 'NAME has no lightest setting yet.',
});
export { MISSING };

/* ------------------------------------------------------------ small helpers */
const trim = (v) => (typeof v === 'string' ? v.trim() : '');
/* The engine's own rung parser, restated: rebuild/engine/progression.cjs:406-409
   parseRungs splits on ANY non-numeric separator. Restated rather than imported,
   because a setup file may not reach into rebuild/engine (S24); the test asserts
   this function agrees with the engine's on the same inputs. */
export function parseRungs(text) {
  return String(text === undefined || text === null ? '' : text)
    .split(/[^0-9.]+/).filter((part) => part !== '' && part !== '.')
    .map(Number).filter((n) => Number.isFinite(n));
}
export const isAscending = (list) => list.every((x, i) => i === 0 || x > list[i - 1]);
/* A positive finite number typed into a 16px numeric field. An empty box is NOT
   a zero: it is unanswered, and the caller decides what that means. */
function numberOf(text) {
  const raw = trim(text);
  if (raw === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : NaN;
}
/* The engine's key for a lift, slugged from the name he typed. Uniqueness is the
   constructor's own rule (athlete-state.cjs:99-103); two machines with the same
   label get "-2", "-3" rather than one silently swallowing the other. */
export function slugOf(name, taken) {
  const base = trim(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const stem = base === '' ? 'lift' : base;
  let id = stem;
  let n = 1;
  while (taken.has(id)) { n += 1; id = stem + '-' + n; }
  taken.add(id);
  return id;
}

/* --------------------------------------------------------------- the answers
   TRANSIENT, exactly like A3's gymDraft (today-entry.mjs:119-121). Nothing here
   is of record until screen 6 writes the ONE operation. A half-finished setup is
   a state no reader can name, so no screen writes anything (BUILD-BRIEF 2.2). */
export function createSetupAnswers() {
  const answers = {
    name: '',
    /* null = not a training day (written REST), '' = chosen with no kind yet. */
    days: Object.fromEntries(WEEKDAYS.map((d) => [d, null])),
    sets: STANDARD_SETS,
    hi: STANDARD_HI,
    exercises: [],
    priorities: [],
  };
  return answers;
}
let nextKey = 0;
/* head and secondary are A4b's tags. They never reach the DOCUMENT - closed()
   throws on a ninth member (athlete-state.cjs:65-71) - they ride the op's third
   payload member instead (A4B-BRIEF 5). A hand-added lift starts untagged, which
   is honest: head null means "bucketed by mg", exactly what the engine does with
   a lift that has no head (volume.cjs:74). */
export function newExercise(day) {
  nextKey += 1;
  return { key: 'x' + nextKey, day, n: '', mg: '', mgSource: null, first: '', inc: '', rungs: '',
    head: null, secondary: [] };
}
const clone = (value) => JSON.parse(JSON.stringify(value));

/* TODAY'S LOCAL DATE (S6, M4). Built from the local calendar fields, never from
   toISOString(), which is the UTC day: at 8pm in America/New_York the UTC day is
   already tomorrow, and a split.from of tomorrow passes createCleanInitState and
   then refuses at the first gym visit with WORKOUT_SPLIT_NOT_IN_FORCE
   (rebuild/m3/w6/host/workout-host.mjs:39-48). */
export function localISO(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

export function createSetupModel({ today = localISO(), answers = createSetupAnswers() } = {}) {
  if (typeof today !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(today)) {
    throw new TypeError('createSetupModel requires today as a local ISO date');
  }
  let screen = 1;
  /* Validation is QUIET until he has tried to move on from a screen, and then it
     stays visible on THAT screen: coming back to it from the screen-6 refusal
     must show him what is missing, not a clean slate. Per screen, so arriving on
     screen 3 for the first time does not arrive pre-scolded. */
  const shownOn = new Set();

  /* The days he has claimed a kind for HIMSELF. Held beside the answers rather
     than inside them: it is provenance, not an answer, and the document never
     carries it. */
  const overrides = {};
  const chosenDays = () => WEEKDAYS.filter((d) => answers.days[d] !== null).map(Number);
  /* Re-propose every training day that is not an override (A4b, S27). */
  const repropose = () => {
    const proposed = proposeKinds(chosenDays());
    for (const d of WEEKDAYS) {
      if (answers.days[d] === null || Object.hasOwn(overrides, d)) continue;
      answers.days[d] = proposed[Number(d)] || '';
    }
  };

  const kindsInSplit = () => DAY_KINDS.filter((k) => WEEKDAYS.some((d) => answers.days[d] === k));
  const forKind = (kind) => answers.exercises.filter((e) => e.day === kind);

  const api = {
    today,
    screen: () => screen,
    validationShown: () => shownOn.has(screen),
    answers: () => clone(answers),
    kindsInSplit,
    forKind: (kind) => forKind(kind).map(clone),

    /* Navigation NEVER changes an answer (S16). Back and Next only move. */
    goto(n) {
      if (!Number.isSafeInteger(n) || n < 1 || n > SCREENS) return screen;
      screen = n;
      return screen;
    },
    next() { shownOn.add(screen); return api.goto(Math.min(SCREENS, screen + 1)); },
    back() { return api.goto(Math.max(1, screen - 1)); },

    setName(value) { answers.name = typeof value === 'string' ? value : ''; return answers.name; },

    /* A4b, DECISIONS:125 (1): he picks the DAYS and Earned proposes the kind.
       A day tapped on becomes a training day and the whole week is re-proposed
       around it; tapped off it is written REST and its override, if it had one,
       goes with it. Turning a day off is his own act, not a navigation. */
    toggleDay(d) {
      if (!WEEKDAYS.includes(d)) return null;
      if (answers.days[d] === null) answers.days[d] = '';
      else { answers.days[d] = null; delete overrides[d]; }
      repropose();
      return answers.days[d];
    },
    /* THE OVERRIDE (S27). A tap on the kind a day is merely SHOWING makes that
       kind his, and from then on no re-proposal may move it: adding a day later
       re-proposes the days he has not spoken for and leaves his alone. A second
       tap on a kind he already claimed gives the day back to the proposal, and
       the day is left unanswered rather than silently re-proposed, because
       clearing an answer must not look like choosing one. */
    setDayKind(d, kind) {
      if (!WEEKDAYS.includes(d) || !DAY_KINDS.includes(kind)) return null;
      if (answers.days[d] === null) return null;
      if (Object.hasOwn(overrides, d) && answers.days[d] === kind) {
        answers.days[d] = '';
        delete overrides[d];
      } else {
        answers.days[d] = kind;
        overrides[d] = kind;
      }
      return answers.days[d];
    },
    /* What the screen needs to say which days he spoke for himself. */
    overrides: () => ({ ...overrides }),
    proposedKinds: () => proposeKinds(chosenDays()),

    /* THE STANDARD START (S5, M20). Both values are ALWAYS held: tapping the
       selected chip again leaves it exactly where it is, choosing another value
       changes only that one, and neither can ever reach null. There is no
       "I'm not sure" here or anywhere else in the flow (DECISIONS:114 (2)). */
    chooseSets(value) {
      if (SETS_OPTIONS.includes(value)) answers.sets = value;
      return answers.sets;
    },
    chooseHi(value) {
      if (HI_OPTIONS.includes(value)) answers.hi = value;
      return answers.hi;
    },

    addExercise(kind) {
      if (!DAY_KINDS.includes(kind)) return null;
      const row = newExercise(kind);
      answers.exercises.push(row);
      return clone(row);
    },
    /* THE "BUILD MY WEEK FOR ME" DOOR (A4B-BRIEF 3.1). It REPLACES the rows the
       proposer owns and nothing else: a lift he added by hand before opening the
       door survives, because deleting his own work to make room for a proposal
       would be the app overruling him. Every proposed row is an ordinary answer
       row afterwards - renameable, removable, retaggable - which is what makes
       both doors land on the same editable week (S34). */
    applyProposal(rows, tags) {
      if (!Array.isArray(rows)) return null;
      const mine = answers.exercises.filter((e) => e.source !== 'proposal');
      const added = [];
      for (const r of rows) {
        if (!r || !DAY_KINDS.includes(r.day)) continue;
        const tag = (tags && r && tags[r.id]) || r || {};
        nextKey += 1;
        added.push({
          key: 'p' + nextKey, day: r.day,
          n: typeof r.n === 'string' ? r.n : '',
          mg: typeof r.mg === 'string' ? r.mg : '',
          mgSource: 'label', first: '', inc: '', rungs: '',
          head: typeof tag.head === 'string' && tag.head ? tag.head : null,
          secondary: Array.isArray(tag.secondary) ? clone(tag.secondary) : [],
          source: 'proposal',
        });
      }
      answers.exercises = mine.concat(added);
      /* sets and hi stay the athlete's screen-3 choice: the proposal carries
         A4's standards and may not silently overwrite a value he set. */
      return added.map(clone);
    },
    /* Enthusiasts may edit every tag on any entry, catalogue-sourced or custom
       (BRIEF 3.3). Refuses rather than storing a tag the engine cannot read. */
    setHead(key, head) {
      const row = answers.exercises.find((e) => e.key === key);
      if (!row) return null;
      if (head !== null && !(typeof head === 'string' && head.trim())) return null;
      row.head = head === null ? null : head.trim();
      return row.head;
    },
    setSecondary(key, list) {
      const row = answers.exercises.find((e) => e.key === key);
      if (!row || !Array.isArray(list)) return null;
      for (const s of list) {
        if (!s || typeof s !== 'object' || Array.isArray(s)) return null;
        if (Object.keys(s).length !== 2) return null;
        if (typeof s.mg !== 'string' || !s.mg.trim()) return null;
        if (typeof s.lend !== 'number' || !Number.isFinite(s.lend) || s.lend <= 0 || s.lend > 1) return null;
      }
      row.secondary = list.map((s) => ({ mg: s.mg.trim(), lend: s.lend }));
      return clone(row.secondary);
    },

    /* The "I'll choose" door (A4B-BRIEF 3.3). A catalogue entry, or the
       two-layer picker's product, becomes an ordinary answer row carrying its
       tags. It is NOT marked as the proposal's, so re-opening the other door
       never deletes it. */
    addFromCatalogue(kind, entry) {
      if (!DAY_KINDS.includes(kind) || !entry || typeof entry.n !== 'string' || !entry.n.trim()) return null;
      if (typeof entry.mg !== 'string' || !entry.mg.trim()) return null;
      const row = newExercise(kind);
      row.n = entry.n;
      row.mg = entry.mg;
      row.mgSource = MG_LABELS.includes(entry.mg) ? 'label' : 'other';
      row.head = typeof entry.head === 'string' && entry.head ? entry.head : null;
      row.secondary = Array.isArray(entry.secondary) ? clone(entry.secondary) : [];
      answers.exercises.push(row);
      return clone(row);
    },

    removeExercise(key) {
      const at = answers.exercises.findIndex((e) => e.key === key);
      if (at < 0) return false;
      answers.exercises.splice(at, 1);
      return true;
    },
    setExerciseField(key, field, value) {
      const row = answers.exercises.find((e) => e.key === key);
      if (!row || !['n', 'first', 'inc', 'rungs'].includes(field)) return null;
      row[field] = typeof value === 'string' ? value : '';
      return row[field];
    },

    /* THE MUSCLE CHIP (S25, M17, M18). The chip STORES the engine's own label,
       never the gloss beside it, and there is no coarse group and no mapping
       anywhere on the path from tap to stored value. A second tap clears it. */
    chooseMg(key, label) {
      const row = answers.exercises.find((e) => e.key === key);
      if (!row || !MG_LABELS.includes(label)) return null;
      if (row.mgSource === 'label' && row.mg === label) { row.mg = ''; row.mgSource = null; }
      else { row.mg = label; row.mgSource = 'label'; }
      return row.mg;
    },
    /* "Something else" stores what he types, VERBATIM and unmapped:
       athlete-state.cjs:98 accepts any non-empty string (DECISIONS:115). */
    chooseMgOther(key) {
      const row = answers.exercises.find((e) => e.key === key);
      if (!row) return null;
      if (row.mgSource === 'other') { row.mg = ''; row.mgSource = null; }
      else { row.mg = ''; row.mgSource = 'other'; }
      return row.mgSource;
    },
    setMgOther(key, value) {
      const row = answers.exercises.find((e) => e.key === key);
      if (!row || row.mgSource !== 'other') return null;
      row.mg = typeof value === 'string' ? value : '';
      return row.mg;
    },
    /* Screen 5. The same engine labels, any number or none, and no free entry:
       a priority the engine has no label for would name nothing. */
    togglePriority(label) {
      if (!MG_LABELS.includes(label)) return null;
      const at = answers.priorities.indexOf(label);
      if (at < 0) answers.priorities.push(label); else answers.priorities.splice(at, 1);
      return answers.priorities.slice();
    },

    /* WHAT IS STILL UNKNOWN (screen 6). Collected and named ONCE, each line
       carrying the screen that owns it, so nothing is mandatory by modal and
       nothing already answered is lost. Nothing here is ever guessed. */
    missing() {
      const out = [];
      if (trim(answers.name) === '') out.push({ screen: 1, code: 'CLEAN_INIT_SETUP_REQUIRED', copy: MISSING.name });
      const kinds = kindsInSplit();
      if (kinds.length === 0) out.push({ screen: 2, code: 'CLEAN_INIT_SPLIT_REQUIRED', copy: MISSING.days });
      for (const d of WEEKDAYS) {
        if (answers.days[d] === '') {
          out.push({ screen: 2, code: 'CLEAN_INIT_SPLIT_REQUIRED',
            copy: MISSING.dayKind.replace('DAY', WEEKDAY_NAMES[Number(d)]) });
        }
      }
      for (const kind of kinds) {
        if (forKind(kind).length === 0) {
          out.push({ screen: 3, code: 'CLEAN_INIT_EXERCISES_REQUIRED',
            copy: MISSING.kindEmpty.replace('KIND', DAY_KIND_WORDS[kind].toLowerCase()) });
        }
      }
      /* An exercise whose session kind left the week. It is NOT deleted (an
         answer is never destroyed by another answer), it is named, and the line
         goes back to screen 2 where the day it needs lives. */
      for (const kind of DAY_KINDS) {
        if (!kinds.includes(kind) && forKind(kind).length > 0) {
          out.push({ screen: 2, code: 'CLEAN_INIT_SPLIT_REQUIRED',
            copy: MISSING.kindMissing.replace(/KIND/g, DAY_KIND_WORDS[kind].toLowerCase()) });
        }
      }
      return out.concat(api.missingExercises());
    },

    /* Per exercise: the name, what it works, and the lightest setting. The jump
       is NOT here: a blank jump is the declared 5 lb standard step, said on the
       field's own helper line and repeated in the summary (BRIEF Q3). */
    missingExercises() {
      const out = [];
      for (const row of answers.exercises) {
        const label = trim(row.n);
        if (label === '') {
          out.push({ screen: 3, key: row.key, code: 'CLEAN_INIT_EXERCISE_REQUIRED',
            copy: MISSING.exerciseName.replace('KIND', DAY_KIND_WORDS[row.day].toLowerCase()) });
          continue;
        }
        if (trim(row.mg) === '') {
          out.push({ screen: 3, key: row.key, code: 'CLEAN_INIT_EXERCISE_REQUIRED',
            copy: MISSING.exerciseMg.replace('NAME', label) });
        }
        const first = numberOf(row.first);
        const rungs = parseRungs(row.rungs);
        if (rungs.length === 0 && (first === null || Number.isNaN(first))) {
          out.push({ screen: 4, key: row.key, code: 'CLEAN_INIT_EXERCISE_REQUIRED',
            copy: MISSING.exerciseFirst.replace('NAME', label) });
        }
        if (rungs.length > 0 && !isAscending(rungs)) {
          out.push({ screen: 4, key: row.key, code: 'CLEAN_INIT_EXERCISE_REQUIRED',
            copy: VALIDATION.rungs });
        }
        const inc = numberOf(row.inc);
        if (Number.isNaN(inc)) {
          out.push({ screen: 4, key: row.key, code: 'CLEAN_INIT_EXERCISE_REQUIRED',
            copy: VALIDATION.inc });
        }
      }
      return out;
    },

    /* THE DOCUMENT. Exactly the four members of REQUIRED_SETUP, imported from the
       constructor's own module, and never a superset: closed() throws on an extra
       key as loudly as on a missing one (athlete-state.cjs:65-71). Nothing is
       built while anything is missing: createCleanInitState is never called. */
    document() {
      const missing = api.missing();
      if (missing.length) return { ok: false, missing, setup: null, tags: null };
      const map = Object.fromEntries(WEEKDAYS.map((d) =>
        [d, DAY_KINDS.includes(answers.days[d]) ? answers.days[d] : REST]));
      const taken = new Set();
      /* The tags, keyed by the DOCUMENT's id, not the answer row's key: the id is
         only decided here, by slugOf against the ids already taken, so this is
         the one place the two key sets can be made to match exactly (BRIEF 5). */
      const tags = {};
      const exercises = answers.exercises.map((row) => {
        const rungs = parseRungs(row.rungs);
        const first = numberOf(row.first);
        const inc = numberOf(row.inc);
        const id = slugOf(row.n, taken);
        tags[id] = {
          head: typeof row.head === 'string' && row.head.trim() ? row.head.trim() : null,
          secondary: (Array.isArray(row.secondary) ? row.secondary : [])
            .map((s) => ({ mg: s.mg, lend: s.lend })),
        };
        return {
          id,
          n: trim(row.n),
          mg: trim(row.mg),
          day: row.day,
          sets: answers.sets,
          hi: answers.hi,
          inc: inc === null ? STANDARD_INC : inc,
          steps: rungs.length ? rungs.slice() : [first],
        };
      });
      const setup = {
        athlete_label: trim(answers.name),
        /* split.from is TODAY'S LOCAL date, always, and the flow offers no start
           date: a future `from` passes the constructor and then refuses at the
           first gym visit (workout-host.mjs:39-48 WORKOUT_SPLIT_NOT_IN_FORCE). */
        split: { from: today, map },
        exercises,
        priority_muscles: answers.priorities.slice(),
      };
      return { ok: true, missing: [], setup, tags };
    },
  };
  return api;
}

/* The two declared standards, as the sentence the screen shows. Composed here so
   the digits live in ONE place and S8's allowlist has exactly two entries. */
export const standardStartLine = () =>
  STANDARD_SETS + ' sets, aim for ' + STANDARD_HI + ' reps.';
export const standardStepLine = () => 'Leave the jump blank and Earned uses '
  + STANDARD_INC + ' ' + STANDARD_INC_UNIT + ', its standard step. Change it if yours is different.';
export const standardStepSummary = () => 'jump: ' + STANDARD_INC + ' ' + STANDARD_INC_UNIT
  + ', Earned’s standard step';
export const counterLine = (n) => n + ' of ' + SCREENS;
export const glossFor = (label) => (MG_GLOSS[label] ? label + ' (' + MG_GLOSS[label] + ')' : label);

export default {
  createSetupModel, createSetupAnswers, newExercise, parseRungs, isAscending, slugOf, localISO,
  MG_LABELS, MG_GLOSS, GROUP_WORDS, REGION_WORDS,
  STANDARD_SETS, STANDARD_HI, STANDARD_INC, STANDARD_INC_UNIT,
  SETS_OPTIONS, HI_OPTIONS, WEEKDAYS, WEEKDAY_NAMES, DAY_KINDS, DAY_KIND_WORDS, REST,
  SCREENS, COPY, VALIDATION, MISSING, REFUSAL_SENTENCES, REQUIRED_SETUP, REQUIRED_EXERCISE,
  createCleanInitState, dayKindValidation, standardStartLine, standardStepLine,
  standardStepSummary, counterLine, glossFor,
};
