'use strict';
/* P3-REAL-SHAPE - THE FIXTURE OF RECORD: a legacy state with the OLD APP'S
   SHAPE at schema 60, built from the old app's PUBLIC source and nothing else.

   PROVENANCE. The shape below is read from origin/main src/app.jsx, the old
   app's public source: EXERCISES (:386-:433), SEED (:435-:520), the weave
   (:521-:593) and patchV40 (:11053-:11070). SEED.v is set to SCHEMA_V by the
   weave at :521 and the seed's own comments say it twice (:438, :529): the seed
   is AUTHORED ALREADY-CURRENT and never walks the patch chain, so there is no
   chain to run from the seed to 60 and this module states v: 60 directly. The
   patch chain is still what DEFINES several of these members, and each one is
   cited to the patch that writes it.

   PRIVACY, HARD. The old app's SEED carries the seed athlete's own July
   figures. They are app source, but this lane treats them as the OWNER's
   numbers: NOT ONE weight, rep, body reading, trend, lean mass, calorie,
   protein, step or sleep figure from SEED is copied here. Every number below is
   SYNTHETIC and chosen so it cannot be mistaken for any athlete's. What IS
   copied is SHAPE: member names, lift ids, lift `n` names, `mg` labels, day
   letters, the split entry's three members, and the collection names.

   WHAT IS DELIBERATELY ABSENT, because the old app has it nowhere:
     - `athlete_label` at the top level (the new app's REQUIRED_SETUP member)
     - `steps` on an exercise (the new app's rung ladder)
     - `secondary` on an exercise (the new app's credit list)
     - `priority_muscles` at the top level
   Those four absences are the measurement, not an oversight. */
const SCHEMA_V = 60;

/* THE SPLIT, exactly as patchV40 (:11057) and the weave (:552) write it: a
   non-empty ARRAY of dated periods, each one {from, map, why} - three members,
   the third a provenance note string. `map` is keyed 0-6 with U / L / REST.
   This is the shape the S7 rule's B-C refuses on (`why`). */
const SPLIT_FROM = '2026-08-09';
const SPLIT_MAP = { 0: 'U', 1: 'L', 2: 'REST', 3: 'REST', 4: 'U', 5: 'L', 6: 'REST' };
const SPLIT_WHY = 'SYNTHETIC-FIXTURE athlete-stated 2026-08-09 - Sun U / Mon L / Thu U / Fri L';
const splitEntry = () => ({ from: SPLIT_FROM, map: { ...SPLIT_MAP }, why: SPLIT_WHY });

/* THE SIXTEEN LIFTS, ids / n / mg / day as the old app's EXERCISES literal
   declares them (:386-:433) after the weave's SPLIT edits (pronated retired,
   fly and hipthrust inserted). EVERY NUMBER IS SYNTHETIC.
   `w` deliberately keeps the old app's THREE value types, because the new app's
   constructor never mints any of them: a number, the string 'BW' (hanging), the
   string 'hold' (hack) and null (a newborn lift). */
const LIFTS = [
  { id: 'lateral', n: 'Lateral machine', mg: 'delts', day: 'U', w: 30, inc: 5, sets: 4, hi: 15, head: 'delts_side' },
  { id: 'rearDelt', n: 'Rear-delt fly (cable, unilateral)', mg: 'delts', day: 'U', w: 10, inc: 2.5, sets: 3, hi: 12, head: 'delts_rear' },
  { id: 'rows', n: 'Prime seated row (hooks)', mg: 'back', day: 'U', w: 60, inc: 5, sets: 2, hi: 10 },
  { id: 'curl', n: 'Curls (preacher)', mg: 'biceps', day: 'U', w: 25, inc: 5, sets: 3, hi: 12, wSets: [25, 25, 20] },
  { id: 'fly', n: 'Machine fly', mg: 'chest', day: 'U', w: null, inc: 5, sets: 2, hi: 20 },
  { id: 'press', n: 'Press', mg: 'chest', day: 'U', w: 90, inc: 5, sets: 3, hi: 9 },
  { id: 'pulldown', n: 'Pulldown', mg: 'back', day: 'U', w: 55, inc: 5, sets: 3, hi: 10 },
  { id: 'sulek', n: 'Sulek wrist curl (high cable)', mg: 'forearms', day: 'U', w: 17.5, inc: 2.5, sets: 2, hi: 15 },
  { id: 'tricep', n: 'Tricep', mg: 'triceps', day: 'U', w: 20, inc: 5, sets: 3, hi: 13 },
  { id: 'calves', n: 'Calves', mg: 'calves', day: 'L', w: 70, inc: 5, sets: 3, hi: 11, pauseSec: 2 },
  { id: 'abs', n: 'Prime abdominal crunch', mg: 'abs', day: 'L', w: 35, inc: 5, sets: 3, hi: 14 },
  { id: 'hanging', n: 'Supported leg raise (medicine-ball pad)', mg: 'abs', day: 'L', w: 'BW', inc: null, sets: 2, hi: 8 },
  { id: 'hack', n: 'Hack squat', mg: 'quads', day: 'L', w: 'hold', inc: 10, sets: 2, hi: 10 },
  { id: 'hipthrust', n: 'Hip thrust machine', mg: 'glutes', day: 'L', w: null, inc: 5, sets: 3, hi: 12 },
  { id: 'extension', n: 'Leg extension', mg: 'quads', day: 'L', w: 40, inc: 5, sets: 2, hi: 10 },
  { id: 'ham', n: 'Ham curl', mg: 'hams', day: 'L', w: 45, inc: 5, sets: 2, hi: 12 },
];

/* THE EXTRA EXERCISE MEMBERS the old app carries and the new app's
   REQUIRED_EXERCISE (athlete-state.cjs:67) does not name. Each is cited to the
   line of the old app's public source that writes it. Every VALUE is synthetic.
     setup / setupAt          EXERCISES literal; weave :527 stamps setupAt
     lastMeta {d,w,reps,debt} EXERCISES literal; weave :578 adds rirSets
     last                     EXERCISES literal (the last session's reps)
     rirHist                  weave :576
     note                     EXERCISES literal (rearDelt)
     std / own / ownNote      EXERCISES literal (press, extension)
     first / debutNote        EXERCISES literal (abs)
     pendingThird             EXERCISES literal (hack)
     wSets                    EXERCISES literal (curl)
     pauseSec                 weave :535 (calves)
     wAt / incAt / setsAt / hiAt   EXERCISES literal, the per-field stamps
     forks                    weave :536-:539 (the two technique changes)
     renames                  weave :545-:547
     pinsBornAt               weave :532 */
const STAMP = '2026-08-13T12:00:00.000Z';
const LAST_DAY = '2026-08-14';
const SYNTH_REPS = { lateral: [11, 10, 10, 9], rearDelt: [9, 9], rows: [8, 8], curl: [9, 7, 8],
  press: [7, 6, 6], pulldown: [7, 7], sulek: [10, 7], tricep: [11, 10, 9], calves: [11, 9, 8],
  abs: [12, 11, 11], hanging: [5, 4], hack: [11, 10], extension: [8, 5], ham: [9, 9] };
const FORKS = { pulldown: 'hooks standardized', rows: 'hooks standardized', calves: '2 s pause replaces 5 s' };
const RENAMES = ['rows', 'rearDelt', 'curl', 'sulek', 'abs', 'hanging'];
const STAMPED = { rearDelt: ['setsAt'], fly: ['wAt', 'incAt', 'setsAt', 'hiAt'],
  pulldown: ['setsAt'], calves: ['setsAt'], hipthrust: ['wAt', 'incAt', 'setsAt', 'hiAt'] };

function legacyExercises() {
  return LIFTS.map((row) => {
    const reps = SYNTH_REPS[row.id] ? SYNTH_REPS[row.id].slice() : null;
    const e = { id: row.id, mg: row.mg, n: row.n, day: row.day, w: row.w,
      inc: row.inc, sets: row.sets, hi: row.hi, last: reps,
      setup: 'SET - SYNTHETIC FIXTURE setup line for ' + row.id
        + '\nSame path, same endpoints - no swing', setupAt: STAMP, rirHist: [] };
    if (row.head) e.head = row.head;
    if (typeof row.wSets !== 'undefined') e.wSets = row.wSets.slice();
    if (typeof row.pauseSec !== 'undefined') e.pauseSec = row.pauseSec;
    if (reps) e.lastMeta = { d: LAST_DAY, w: row.w, reps: reps.slice(), debt: true,
      rirSets: new Array(reps.length).fill(null) };
    if (row.id === 'press') { e.std = [7, 7, 6]; e.own = true; e.ownNote = 'SYNTHETIC - repeat 7,7,6'; }
    if (row.id === 'extension') { e.std = [8, 8]; e.own = true; e.ownNote = 'SYNTHETIC - own 40x8,8'; }
    if (row.id === 'abs') { e.first = [10, 10, 10]; e.debutNote = 'DEBUT - SYNTHETIC baseline'; e.last = null; }
    if (row.id === 'hack') { e.pendingThird = true; e.last = null; }
    if (row.id === 'rearDelt') e.note = 'SYNTHETIC - log the weaker side';
    if (FORKS[row.id]) e.forks = [{ from: '2026-08-13', why: FORKS[row.id], prevN: row.n + ' (old)' }];
    if (RENAMES.includes(row.id)) e.renames = [{ from: '2026-08-13', prevN: row.n + ' (old)' }];
    for (const key of STAMPED[row.id] || []) e[key] = '2026-08-12T00:00:00.000Z';
    if (e.setup.indexOf('[PIN]') > -1) e.pinsBornAt = e.setupAt;
    return e;
  });
}

/* THE FILE'S OWN WORKOUT DAYS. Sunday / Monday / Thursday / Friday under the
   split map above, so the legacy log agrees with the week it ships. */
const SESSION_DAYS = [['2026-08-09', 'U'], ['2026-08-10', 'L'], ['2026-08-13', 'U'], ['2026-08-14', 'L']];
const READS = [['2026-08-02', 150.1], ['2026-08-09', 149.6], ['2026-08-13', 149.2], ['2026-08-14', 148.8]];

/* THE TOP-LEVEL STATE. Member for member, the old app's SEED (:435-:520) plus
   everything the weave (:521-:593) attaches, plus `targets` - which the SEED
   itself does not carry (it never walks the chain) but which patchV32
   (:10746-:10764) writes onto every MIGRATED state, and the owner's file is a
   migrated state. `v` is 60 because the weave sets SEED.v = SCHEMA_V at :521.
   EVERY NUMBER, DATE-STAMPED FIGURE AND PROSE STRING IS SYNTHETIC. */
function legacyState({ sessions = SESSION_DAYS, split = null } = {}) {
  const exercises = legacyExercises();
  const session = type => ({ type, entries: exercises.filter(e => e.day === type && e.last)
    .map(e => ({ id: e.id, w: e.w, reps: e.last.slice(), rir: 2, sets: e.sets })) });
  return {
    v: SCHEMA_V,
    phase: 'EASE 1',
    rate: { band: [1.0, 1.4] },
    skinfolds: [],
    maintenance: [{ label: 'SYNTHETIC block steps', cal: 2100, note: 'synthetic' }],
    trend: 149.4,
    model: { lean: 120.0, anchorISO: '2026-08-09', drip: 0, src: "coach's eye", err: '+/-1.5-3' },
    dexaPred: '~SYNTHETIC',
    reads: READS.map(([d, w]) => ({ d, w, note: 'SYNTHETIC', sealed: false })),
    blackout: { until: '2026-08-01', reason: 'SYNTHETIC fixture blackout' },
    sleep: { cleanH: 7.5, needed: 3, anchor: { wake: '06:45', inBed: 8.25, asleepTarget: 8 },
      caffMg: null, melaExp: { started: '2026-08-01', arm: 'none', baseline: 'SYNTHETIC' },
      nights: [{ d: '2026-08-13', h: 7 }, { d: '2026-08-14', h: 7.5 }],
      debts: ['SYNTHETIC debt line'] },
    exercises,
    queue: [
      { id: 'q_rows_debut', kind: 'debut', exId: 'rows', newW: 65, t: 'ROWS 65 DEBUT', state: 'DEBUT',
        gate: 'SYNTHETIC gate', rule: 'SYNTHETIC rule', done: false },
      { id: 'q_press_own', kind: 'own', exId: 'press', t: 'PRESS - OWN 90', state: 'OWN-IT',
        gate: 'SYNTHETIC gate', rule: 'SYNTHETIC rule', done: false },
      { id: 'q_info', kind: 'info', t: 'SYNTHETIC PARKED ITEM', state: 'PARKED',
        gate: 'SYNTHETIC gate', rule: 'SYNTHETIC rule', done: true },
    ],
    feed: [{ d: '2026-08-14', t: 'SYNTHETIC FEED ENTRY', how: 'synthetic' }],
    standing: 'SYNTHETIC standing line',
    zeroComp: { count: 1, last: 'SYNTHETIC - 8/12' },
    proteinDays: '3 of 5',
    fixWindow: null, boosts: 0, thesisConfirms: 1, lastThesisWk: 1,
    dailyLogs: { '2026-08-13': { cal: 2000, pro: 150, steps: 9000 },
      '2026-08-14': { cal: 2050, pro: 155, steps: 9500 } },
    events: [{ id: 'ev1', t: 'SYNTHETIC EVENT', d: '2026-08-20',
      protocol: 'SYNTHETIC protocol', estimated: false }],
    sessionLog: Object.fromEntries(sessions.map(([day, type]) => [day, session(type)])),
    weekly: [{ wk: '2026-08-09', trend: 149.4 }],
    proposals: [], adjustments: [],
    planGen: 51,
    insertions: { fly: '2026-08-14', hipthrust: '2026-08-14' },
    retirements: { pronated: '2026-08-12' },
    split: split || [splitEntry()],
    medsLog: [], energy: [], soreness: [], grip: [], caffLog: [],
    dayCtx: {}, agentProposals: [], temp: [], trials: [], pulse: [], forecasts: [],
    learned: { tdee: [], anchors: [] },
    labSeen: {}, creatine: null, photos: [], waist: [],
    sync: { last: null, status: '' },
    targets: {},
    exOrder: { U: exercises.filter(e => e.day === 'U').map(e => e.id),
      L: exercises.filter(e => e.day === 'L').map(e => e.id) },
    plan: { goals: [], ifthen: [], share: false, autonomy: 'propose', phaseLog: [] },
  };
}

/* THE PHONE'S OWN SETUP, in the words the owner would type. The `n` names are
   the FILE's, typed the way a person types them into the setup flow (title
   case, ordinary punctuation), and setup-model.mjs slugOf(:255) mints the
   phone's id from each one: 'Hack squat' -> 'hack-squat', never 'hack'. That
   divergence is gap 2 of DECISIONS:520 and it is built in here on purpose.
   The days are the file's week and the mg labels are the file's mg labels,
   which are the SAME eleven the setup flow offers (MG_LABELS,
   setup-model.mjs:29-30, both sourced from engine/seed.cjs). */
const TYPED_LIFTS = LIFTS.map(row => ({ day: row.day, n: row.n, mg: row.mg, first: '20' }));
const TYPED_DAYS = { 0: 'U', 1: 'L', 4: 'U', 5: 'L' };
/* slugOf, restated here for the fixture's own use so a cell can name the id the
   phone will mint without importing the ESM setup model into a .cjs helper.
   The lane cells assert this agrees with the real slugOf. */
function slugLike(name, taken) {
  const base = String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  let id = base === '' ? 'lift' : base, n = 1;
  while (taken.has(id)) { n += 1; id = (base || 'lift') + '-' + n; }
  taken.add(id);
  return id;
}
function phoneIds() {
  const taken = new Set();
  return Object.fromEntries(LIFTS.map(row => [row.id, slugLike(row.n, taken)]));
}

module.exports = { SCHEMA_V, LIFTS, SPLIT_FROM, SPLIT_MAP, SPLIT_WHY, splitEntry,
  SESSION_DAYS, READS, legacyExercises, legacyState, TYPED_LIFTS, TYPED_DAYS,
  slugLike, phoneIds, STAMP, LAST_DAY };
