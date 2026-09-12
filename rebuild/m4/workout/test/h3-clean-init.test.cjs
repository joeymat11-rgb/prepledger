'use strict';
/* M2-H3-CLEAN-INIT — the cells.
   DECISIONS:124 RULED that `createCleanInitState` must gain `blackout` and the
   `model` members bfEst reads, because the ACCEPTED engine dereferences both
   without a guard and a brand-new athlete therefore could not paint Today at
   all: rebuild/engine/energy.cjs:370 `s.blackout.until`, then once blackout
   exists rebuild/engine/energy.cjs:84 `s.model.anchorISO`.

   The red-first cell is lane C's, not lane B's invention. It was written by the
   A4 reviewer as `H3 - the accepted engine still cannot paint Today for a
   clean-init athlete` in rebuild/m3/w7-preview/today/test/setup.test.mjs on
   origin/rebuild/lane-c-a4, and recorded in
   rebuild/lanes/c/dad-first-run/A4-REVIEW-ANNEX.md §H3. Cell 3 below is that
   cell's four-state assertion ported onto lane B's own synthetic athlete —
   lane C's version reaches for A4's `documentOf(filled())`, which does not
   exist at this head. The four states are asserted in the same order and for
   the same reasons; what flips is state four, which used to be the ONLY one
   lane C could make pass and is now what the constructor itself produces.

   WHAT LANE C's CELL DID NOT ASSERT, and cell 5 does: A4's fourth state used
   `model: { anchorISO, anchorLb: 170, k: 0 }` and only asserted `doesNotThrow`.
   Not throwing is not the bar. A clean-init athlete has declared no bodyweight
   and no body-fat reading, so every figure derived from one must read as NO
   READING on the screen — never as a default estimate. That is measured here
   against the real view, not argued.

   The fixture is synthetic, public and non-secret, the same posture as
   rebuild/m3/w6/host/test/journey-fixture.cjs and
   rebuild/m3/w7-preview/today/test/ntc-h6-delta.test.mjs. Not one value is
   taken from rebuild/engine/seed.cjs — cell 2 asserts that in both directions.

   The gym-card cells reuse B-NTC's own journey helpers (the `lane`/`conductDay`
   shape of ntc-h6-delta.test.mjs): a page load per day over one fault-injected
   IndexedDB, so "day+3 still opens" is said about a real reopen. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Module = require('node:module');
const { webcrypto } = require('node:crypto');

const AthleteState = require('../athlete-state.cjs');
const { createCleanInitState, BLACKOUT_MEMBERS, MODEL_MEMBERS, SLEEP_MEMBERS, REQUIRED_SETUP } = AthleteState;
const TodayModel = require('../../../m3/w7-preview/today/today-model.cjs');
const { createTodayModel } = TodayModel;
const { createTodayEngine } = require('../../../m3/w7-preview/today/today-engine.cjs');
const design = require('../../../m3/w7-preview/today/design.cjs');
const todayApp = require('../../../m3/w7-preview/today/today-app.cjs');

const STATE_FILE = path.join(__dirname, '..', 'athlete-state.cjs');
const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const readRepo = rel => fs.readFileSync(path.join(REPO, rel), 'utf8');

/* 2026-09-07 is a Monday. The split starts THAT DAY — A4's S6: the day a fresh
   split starts is in force that same day — so `split.from` is this athlete's
   own setup date, which is the only date H3 derives anything from. */
const DAY = '2026-09-07';
const SETUP = Object.freeze({
  athlete_label: 'synthetic H3 clean-init athlete',
  split: { from: DAY, map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'U', 5: 'REST', 6: 'L' } },
  exercises: [
    { id: 'db-bench', n: 'Dumbbell bench press', mg: 'chest', day: 'U', sets: 3, hi: 10, inc: 5, steps: [20, 25, 30, 35, 40] },
    { id: 'lat-pulldown', n: 'Lat pulldown', mg: 'back', day: 'U', sets: 2, hi: 12, inc: 10, steps: [50, 60, 70, 80] },
    { id: 'leg-press', n: 'Leg press', mg: 'quads', day: 'L', sets: 3, hi: 12, inc: 10, steps: [90, 100, 110, 120] },
  ],
  priority_muscles: ['chest'],
});
const plainState = () => JSON.parse(JSON.stringify(createCleanInitState({ setup: SETUP })));
const offsetDay = (day, days) => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

/* ---------------------------------------------------------------- 1. closed() */
test('H3/1 - the constructor writes both members and closed() pins each member set', () => {
  const state = createCleanInitState({ setup: SETUP });
  assert.equal(Object.hasOwn(state, 'blackout'), true, 'blackout is written');
  assert.equal(Object.hasOwn(state, 'model'), true, 'model is written');
  // closed() is what makes these EXACT: the module declares the names, the
  // constructed objects carry those names and no others, in that order.
  assert.deepEqual(BLACKOUT_MEMBERS, ['until']);
  assert.deepEqual(MODEL_MEMBERS, ['anchorISO', 'drip', 'src']);
  assert.deepEqual(Reflect.ownKeys(state.blackout), BLACKOUT_MEMBERS);
  assert.deepEqual(Reflect.ownKeys(state.model), MODEL_MEMBERS);
  // freezeDeep reaches them: they are part of the state, not attached beside it.
  assert.equal(Object.isFrozen(state.blackout), true);
  assert.equal(Object.isFrozen(state.model), true);
  // And they survive the round trip the engine's own writers make
  // (rebuild/engine/writers.cjs:425 JSON.parse(JSON.stringify(state))), which
  // is why no value in them may be NaN or undefined-as-a-value.
  const round = plainState();
  assert.deepEqual(round.blackout, state.blackout);
  assert.deepEqual(round.model, state.model);
  assert.deepEqual(Reflect.ownKeys(round.model), MODEL_MEMBERS);
});

/* --------------------------------------- 2. every value, and not one number */
test('H3/2 - every value is this athlete\'s own setup date or an explicit absence', () => {
  const state = createCleanInitState({ setup: SETUP });
  const from = state.split[0].from;
  assert.equal(from, SETUP.split.from, 'the split starts on his own setup date');
  assert.equal(state.model.anchorISO, from, 'anchored on that date and nothing else');
  assert.equal(state.blackout.until, offsetDay(from, -1), 'the day before it');
  assert.equal(state.model.drip, null, 'dripOf (energy.cjs:21) reads null as the engine\'s own DRIP_DEFAULT');
  assert.equal(state.model.src, null, 'no anchor source is claimed');
  assert.equal(Object.hasOwn(state.model, 'lean'), false,
    'no body-composition anchor is invented: the setup document carries none');
  assert.equal(REQUIRED_SETUP.includes('bodyweight') || REQUIRED_SETUP.includes('lean'), false,
    'and the setup document really does not collect one, so there is nothing to derive it from');

  /* THE H1 RULE, EXECUTED. Nothing here may be one athlete's number. The
     owner's seed carries model.lean 139.7, model.anchorISO 2026-07-21,
     model.src "coach's eye" and a blackout SEAL_UNTIL; none of those may
     appear anywhere in the state this constructor produces. */
  const seed = readRepo('rebuild/engine/seed.cjs');
  assert(/model:\s*\{\s*lean:\s*139\.7/.test(seed),
    'the seed really does carry that lean anchor, or this cell is asserting nothing');
  const text = JSON.stringify(plainState());
  for (const owned of ['139.7', '2026-07-21', "coach's eye", 'DEXA'])
    assert.equal(text.includes(owned), false, 'the owner\'s ' + owned + ' is not in a new athlete\'s state');

  // Every setup-document value round-trips, unchanged and complete.
  assert.equal(state.athlete_label, SETUP.athlete_label);
  assert.deepEqual(state.priority_muscles, SETUP.priority_muscles);
  assert.deepEqual(state.split[0].map, SETUP.split.map);
  assert.equal(state.exercises.length, SETUP.exercises.length);
  for (const declared of SETUP.exercises) {
    const built = state.exercises.find(e => e.id === declared.id);
    for (const k of ['n', 'mg', 'day', 'sets', 'hi', 'inc']) assert.equal(built[k], declared[k], declared.id + '.' + k);
    assert.deepEqual(built.steps, declared.steps, declared.id + '.steps');
    assert.equal(built.w, null, 'and still no working load');
  }
});

/* ------------------------------- 3. lane C's four states, ported and flipped */
test('H3/3 - the four states of lane C\'s A4 cell, now with the fourth produced by the constructor', () => {
  /* Ported from `H3 - the accepted engine still cannot paint Today for a
     clean-init athlete`, origin/rebuild/lane-c-a4
     rebuild/m3/w7-preview/today/test/setup.test.mjs, and
     rebuild/lanes/c/dad-first-run/A4-REVIEW-ANNEX.md §H3. */
  const state = plainState();
  // The two throw sites lane C named are still exactly as unguarded as they were:
  // H3 is a change to the CONSTRUCTOR, and asserting this keeps that honest.
  assert(readRepo('rebuild/engine/energy.cjs').includes('daysUntil(s.blackout.until)'),
    'energy.cjs:370 still dereferences s.blackout.until unguarded');
  assert(readRepo('rebuild/engine/energy.cjs').includes('s.model.anchorISO'),
    'energy.cjs:84 bfEst still dereferences s.model.anchorISO unguarded');
  const without = (...names) => { const s = plainState(); for (const n of names) delete s[n]; return s; };

  /* STATE 1 — neither member: the first throw is s.blackout.until. */
  assert.throws(() => createTodayModel({ today: DAY, basisState: without('blackout', 'model') }).read(),
    /Cannot read properties of undefined \(reading 'until'\)/, 'state 1: nowModel throws on s.blackout.until');
  /* STATE 2 — `blackout: {}` is not a fix shape: daysUntil(undefined) reaches
     mk() at rebuild/engine/dates.cjs:8 and throws on undefined.split. */
  assert.throws(() => createTodayModel({ today: DAY,
    basisState: { ...without('model'), blackout: {} } }).read(),
  /Cannot read properties of undefined \(reading 'split'\)/, 'state 2: blackout:{} throws in dates.cjs');
  /* STATE 3 — a VALID blackout alone only MOVES the throw to bfEst. */
  assert.throws(() => createTodayModel({ today: DAY,
    basisState: { ...without('model'), blackout: { until: '2020-01-01' } } }).read(),
  /Cannot read properties of undefined \(reading 'anchorISO'\)/, 'state 3: the throw moves to energy.cjs:84');
  /* STATE 4 — THE FLIP. Lane C could only reach this by hand-writing both
     members into the state; the constructor writes them now. */
  assert.doesNotThrow(() => createTodayModel({ today: DAY, basisState: state }).read(),
    'state 4: the state the constructor actually produces paints Today');

  /* And guarding energy.cjs:370 alone would only have moved the throw: these
     readers are equally unguarded, which is why the fix is the constructor's. */
  for (const [file, least] of [['rebuild/engine/sleep.cjs', 1], ['rebuild/engine/writers.cjs', 1]]) {
    const unguarded = (readRepo(file).match(/\bs\.blackout\.until\b/g) || []).length;
    assert(unguarded >= least, file + ' still reads blackout.until directly (' + unguarded + ')');
  }
});

/* ------------------------------------------- 4. no reader throws, by name */
test('H3/4 - no engine reader throws over a clean-init state, and none is in a blackout', () => {
  const state = plainState();
  const E = createTodayEngine({ clock: TodayModel.engineClockFor(DAY) });
  /* Every reader the Today projection runs, called directly so a failure names
     the reader rather than "the page". rebuild/m3/w7-preview/today/
     today-model.cjs projectionOf is the list. */
  for (const reader of ['nowModel', 'statusFace', 'currentRate', 'calorieTarget',
    'proteinTarget', 'marchingOrder', 'readRecency'])
    assert.doesNotThrow(() => E[reader](state), reader + ' reads a clean-init state');
  /* The blackout readers DECISIONS:124 and lane C's REQUESTS 20:45 named, each
     one exercised, and each one agreeing that no blackout is in force. */
  assert.equal(E.blackoutOn(state), false, 'sleep.cjs:1913 blackoutOn — not sealed from day one');
  assert.doesNotThrow(() => E.dayWeather(state, DAY), 'sleep.cjs:1879 dayWeather');
  assert.doesNotThrow(() => E.weekWeather(state, [DAY, offsetDay(DAY, 1)]), 'sleep.cjs:1893 weekWeather (s, days)');
  assert.equal(E.observedTDEE(state), null, 'energy.cjs:370 observedTDEE returns, it does not throw');
  /* sleep.cjs:1879 is the ONE reader that tests `iso <= until` INCLUSIVE. With
     `until` one day before the setup date, the athlete's own first day is not
     inside the window — the reason the value is the day before and not the day
     itself. This cell is the measurement that decided it. */
  const weather = E.dayWeather(state, DAY);
  assert.equal((weather.flags || []).some(f => f && f.k === 'sealwater'), false,
    'his first day is NOT inside a sealed window');
  assert.equal(weather.noisy, false, 'and is not marked noisy by a blackout he never had');
  /* A weigh-in on that first day is accepted as a real reading, not a sealed one. */
  const afterRead = E.applyRead(state, DAY, 186.4, { hour: 8 });
  assert.equal(afterRead.reads.length, 1);
  assert.equal(afterRead.reads[0].sealed, false, 'writers.cjs:427 — the first reading is not sealed');
});

/* -------------------------------------------------- 5. no invented number */
test('H3/5 - Today paints, and shows NO number this athlete has not given it', async () => {
  const { JSDOM } = await import('jsdom');
  const state = plainState();
  const view = createTodayModel({ today: DAY, basisState: state }).read();

  /* The engine's own gates agree there is nothing to price from. */
  assert.equal(view.calorieTarget.gated, true);
  assert.equal(view.nowModel.eat.gated, true);
  assert.equal(view.latestRead, null);
  assert.equal(view.hasReadToday, false);
  /* proteinTarget has NO gate of its own (rebuild/engine/energy.cjs:116 — the
     finding F-A in the brief), so it returns a figure whatever the state. What
     keeps an invented number off the screen is that the figure is NOT FINITE,
     and rebuild/m3/w7-preview/today/today-app.cjs:259/:260 gates on exactly that.
     Both halves are asserted, because either one alone would let "0 g" through:
     `model.lean: null` coerces to 0 and prints. */
  assert.equal(Number.isFinite(view.proteinTarget.g), false, 'no protein figure is claimed');
  assert.equal(Number.isFinite(view.proteinTarget.ffmKg), false, 'and no lean mass is claimed');
  assert.equal(Number.isFinite(view.proteinTarget.bf), false, 'and no body-fat percentage is claimed');

  const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
    { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  todayApp.mountToday(doc, createTodayModel({ today: DAY, basisState: state }), {});
  const slot = name => { const el = doc.querySelector('[data-slot="' + name + '"]'); return el && el.textContent; };
  const text = doc.getElementById('phone').textContent.replace(/\s+/g, ' ').trim();

  /* THE "NO READING" STATES ARE EXACTLY WHAT TODAY SHOWS. */
  assert.equal(slot('protein'), 'Not available yet', 'the protein slot says there is no reading');
  assert.equal(slot('protein-unit'), 'Not available yet');
  assert.equal(/NaN/.test(text), false, 'and it is not broken on screen either');
  assert.equal(/undefined|null/.test(text), false);
  /* The only digits on the page belong to the date he is standing in and the
     count of lifts he himself declared for today. No figure about his body. */
  const digits = text.match(/\d[\d,.]*/g) || [];
  assert.deepEqual(digits.sort(), ['2', '7'].sort(),
    'every digit on the screen is his own: the 7th, and the 2 lifts he declared for today');
  /* And the plan he DID give is painted — this is not a blank page. */
  assert.equal(view.workout.title, 'UPPER BODY · TODAY');
  assert.equal(view.workout.available, true);
  assert.equal(view.workout.exerciseCount, 2, 'both of his U-day lifts');
  assert(text.includes('UPPER BODY'), 'his own upper-body day is on the screen');
});

/* ------------------------------- 6. the gym card, day+0 and day+3, unmoved */
test('H3/6 - the gym card still opens and closes on day+0 and day+3', async () => {
  /* B-NTC's own journey helpers, reused: rebuild/m3/w7-preview/today/test/
     ntc-h6-delta.test.mjs `lane()` / `conductDay()`. Each day is a PAGE LOAD —
     a new host over the SAME fault-injected store — so this is said about a
     real reopen, not about one process's memory. A clean-init lift starts at
     `w: null`, a permanent DEBUT, so the fixture sets one working load per lift
     from that lift's own declared `steps`, exactly as B-NTC's cell does and for
     the same declared reason. Nothing else about the state is changed. */
  const { faultDatabase } = await import('../../../m3/w6/test/support.mjs');
  const { createGymHost } = await import('../../../m3/w7-preview/today/gym-host.mjs');
  const { createGymModel, EFFORT_CHOICES } = await import('../../../m3/w7-preview/today/gym-model.mjs');
  const CHOSEN = EFFORT_CHOICES.find(c => c.label === '2').reserve;

  const athlete = () => {
    const s = plainState();
    for (const e of s.exercises) e.w = e.steps[Math.floor(e.steps.length / 2)];
    return s;
  };
  const state = athlete();
  const fault = faultDatabase();
  const on = async day => {
    const host = await createGymHost({ day, engineState: state, indexedDB: fault.indexedDB,
      crypto: webcrypto, plannedSplitSlotId: 'slot', databaseName: 'h3-gym' });
    return { host, model: createGymModel({ gymHost: host, sessionTitle: 'T' }) };
  };
  const conduct = async handle => {
    const probe = await handle.model.read();
    if (probe.phase !== 'ready') return { probe: probe.phase, code: probe.code, logged: 0 };
    const started = await handle.model.start();
    assert(started.ok, 'start refused: ' + started.code);
    let logged = 0;
    for (let guard = 0; guard < 40; guard++) {
      const v = await handle.model.read();
      if (v.phase === 'saved') { if (v.complete) break; handle.model.forget(); continue; }
      if (v.phase !== 'active') break;
      const r = await handle.model.logSet({ startId: v.startId, slot: v.set.slot, lift: v.set.lift,
        load: String(v.entry.load), reps: String(v.entry.reps), effort: CHOSEN });
      assert(r.ok, 'set refused: ' + r.code);
      logged++; handle.model.forget();
    }
    const last = await handle.model.read();
    const closedOk = await handle.model.finish({ startId: last.startId });
    return { probe: probe.phase, logged, closed: closedOk.ok, code: closedOk.code || null };
  };

  const zero = await conduct(await on(DAY));
  assert.equal(zero.probe, 'ready', 'day+0: the card opens for a clean-init athlete');
  assert.equal(zero.closed, true, 'day+0: and it closes');
  assert(zero.logged >= 1, 'day+0: sets were logged (' + zero.logged + ')');
  /* Day+3 is 2026-09-10, a Thursday, and this athlete's second U day. It is the
     very offset A2-REPORT §9.1 named, and it still opens after a page reload. */
  const three = await conduct(await on(offsetDay(DAY, 3)));
  assert.equal(three.probe, 'ready', 'day+3: the card still opens — code ' + three.code);
  assert.equal(three.closed, true, 'day+3: and it still closes');
  assert(three.logged >= 1, 'day+3: sets were logged (' + three.logged + ')');
});

/* ------------------------------------------------------------- 7. mutants */
/* Each mutant is a named edit to a COPY of rebuild/m4/workout/athlete-state.cjs
   loaded in isolation, and each is killed by a named cell above. A mutation
   whose `from` is not present exactly once refuses rather than applying to
   nothing, so a mutant cannot rot into a no-op when the file moves. */
const MUTANTS = [
  { id: 'M1', name: 'a member removed — blackout loses `until`',
    from: '{ until: dayBefore(split.from) }', to: '{}',
    killedBy: 'H3/1 (the exact member set) and H3/3 state 2',
    dies: mutated => { assert.throws(() => mutated.createCleanInitState({ setup: SETUP }),
      e => e.code === 'STATE_BLACKOUT_MEMBER_SET'); } },
  { id: 'M2', name: '`until` in the FUTURE — a blackout in force from day one',
    from: 'const blackout = closed({ until: dayBefore(split.from) }',
    to: 'const blackout = closed({ until: dayAfter(dayAfter(split.from)) }',
    killedBy: 'H3/2 (until is the day before) and H3/4 (blackoutOn is false)',
    dies: mutated => {
      const s = JSON.parse(JSON.stringify(mutated.createCleanInitState({ setup: SETUP })));
      assert.notEqual(s.blackout.until, offsetDay(DAY, -1), 'the mutant really moved the date');
      const E = createTodayEngine({ clock: { today: () => DAY } });
      assert.equal(E.blackoutOn(s), true, 'the mutant puts a brand-new athlete inside a blackout');
    } },
  { id: 'M3', name: 'a COPIED SEED VALUE — the owner\'s own anchor (seed.cjs:70)',
    from: '{ anchorISO: split.from, drip: null, src: null }',
    to: '{ anchorISO: \'2026-07-21\', drip: 0, src: "coach\'s eye" }',
    killedBy: 'H3/2 (the H1 rule, executed)',
    dies: mutated => {
      const s = JSON.parse(JSON.stringify(mutated.createCleanInitState({ setup: SETUP })));
      assert.equal(s.model.anchorISO, '2026-07-21', 'the mutant really copied the seed');
      const text = JSON.stringify(s);
      assert(['2026-07-21', "coach's eye"].some(v => text.includes(v)),
        'and H3/2 refuses exactly this: one athlete\'s numbers in another athlete\'s state');
    } },
  { id: 'M4', name: 'a model member RENAMED — anchorISO becomes anchorIso',
    from: '{ anchorISO: split.from, drip: null, src: null }',
    to: '{ anchorIso: split.from, drip: null, src: null }',
    killedBy: 'H3/1 (closed() over the declared names) and H3/3 state 4',
    dies: mutated => { assert.throws(() => mutated.createCleanInitState({ setup: SETUP }),
      e => e.code === 'STATE_MODEL_MEMBER_SET'); } },
  { id: 'M5', name: 'closed() SKIPPED for the new members, so drift reaches the engine',
    from: 'const blackout = closed({ until: dayBefore(split.from) }, BLACKOUT_MEMBERS, \'STATE_BLACKOUT_MEMBER_SET\');',
    to: 'const blackout = { until: dayBefore(split.from), reason: \'wedding fortnight\' };',
    killedBy: 'H3/1 (Reflect.ownKeys equals the declared set) alone - executed, M5 passes H3/2',
    dies: mutated => {
      const s = mutated.createCleanInitState({ setup: SETUP });
      assert.deepEqual(Reflect.ownKeys(s.blackout), ['until', 'reason'],
        'without closed() a member the module never declared reaches the state');
      assert.notDeepEqual(Reflect.ownKeys(s.blackout), BLACKOUT_MEMBERS, 'which is what H3/1 refuses');
    } },
  { id: 'M6', name: 'a NaN DATE — the calendar round-trip guard removed',
    from: 'if (out === null || !isoDay(out) || dayAfter(out) !== iso)',
    to: 'if (false)',
    killedBy: 'H3/7 itself (the guard is the only thing that refuses 2026-02-30)',
    dies: mutated => {
      const bad = { ...SETUP, split: { ...SETUP.split, from: '2026-02-30' } };
      // The real constructor refuses a day that is not on the calendar...
      assert.throws(() => createCleanInitState({ setup: bad }),
        e => e.code === 'CLEAN_INIT_SPLIT_REQUIRED' && e.detail === 'from must be a real calendar day');
      // ...the mutant accepts it and hands the engine a silently shifted window.
      const s = mutated.createCleanInitState({ setup: bad });
      assert.equal(s.blackout.until, '2026-03-01', 'the mutant normalises 2026-02-30 into March behind the athlete\'s back');
    } },
  { id: 'M7', name: 'sleep.needed COPIED from the seed instead of read from the engine (seed.cjs:80)',
    from: "require('../../engine/constants.cjs')().SLEEP_ANCHOR_MIN_N", to: '3',
    killedBy: 'H3/S1 (the value IS read from the engine, and the module types no digit)',
    dies: mutated => {
      const s = mutated.createCleanInitState({ setup: SETUP });
      assert.equal(s.sleep.needed, 3, 'the mutant produces the same number TODAY, which is why a value test alone would miss it...');
      const mutatedSrc = fs.readFileSync(STATE_FILE, 'utf8')
        .replace("require('../../engine/constants.cjs')().SLEEP_ANCHOR_MIN_N", '3');
      assert.equal(/require\('\.\.\/\.\.\/engine\/constants\.cjs'\)\(\)\.SLEEP_ANCHOR_MIN_N/.test(mutatedSrc), false,
        '...but it no longer reads the engine constant, so if the engine moved the number this state would silently not - exactly what H3/S1 refuses');
    } },
];

test('H3/7 - seven named mutants, each of them killed by a named cell', () => {
  const original = fs.readFileSync(STATE_FILE, 'utf8');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'h3-mutants-'));
  try {
    for (const mutant of MUTANTS) {
      assert.equal(original.split(mutant.from).length, 2,
        mutant.id + ': exactly one mutation site for ' + JSON.stringify(mutant.from.slice(0, 40)));
      const file = path.join(dir, mutant.id + '.cjs');
      fs.writeFileSync(file, original.replace(mutant.from, mutant.to), 'utf8');
      // A private compilation: nothing here enters the require cache of the real module.
      const m = new Module(file, module);
      m.filename = file;
      m.paths = Module._nodeModulePaths(dir);
      /* The mutant is compiled OUTSIDE the repository, so its own relative
         specifiers — athlete-state.cjs reads the engine's constants through
         one (H3/S1) — are resolved against the REAL module's directory
         instead. Nothing enters the require cache of the mutant, and the
         modules it reaches are the real ones, unmutated, which is the point:
         only the bytes under test differ. */
      const normal = m.require.bind(m);
      m.require = name => (name.startsWith('.')
        ? require(path.resolve(path.dirname(STATE_FILE), name))
        : normal(name));
      m._compile(fs.readFileSync(file, 'utf8'), file);
      mutant.dies(m.exports);
    }
    assert.equal(MUTANTS.length, 7, 'seven named mutants, no fewer');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

/* ============ H3/S1 - `sleep.needed`, lane C's H3-class finding (REQUESTS 04:11 (1)) ======
   RED-FIRST. The pre-image shape is `sleep: { nights: [] }` with `needed`
   ABSENT, and this cell asserts the defect on that shape before it asserts the
   fix on ours, so the cell is red on the parent's athlete-state.cjs and green
   on this one. Nothing here reads rebuild/engine/seed.cjs. */
test('H3/S1 - sleep.needed is the engine\'s own constant, and four unguarded readers stop printing `undefined`', () => {
  const E = createTodayEngine({ clock: TodayModel.engineClockFor(DAY) });
  const state = plainState();

  /* (1) THE MEMBER SET IS PINNED, like blackout and model. */
  assert.deepEqual(Reflect.ownKeys(state.sleep).sort(), SLEEP_MEMBERS.slice().sort(),
    'the sleep object is closed over exactly the declared names');
  assert.deepEqual(state.sleep.nights, [], 'no night is seeded');

  /* (2) THE VALUE IS THE ENGINE'S, READ OUT OF THE ENGINE. Not a literal in
     athlete-state.cjs and not a copy of seed.cjs's `sleep.needed: 3`. */
  const K = require('../../../engine/constants.cjs')();
  assert.equal(state.sleep.needed, K.SLEEP_ANCHOR_MIN_N,
    'sleep.needed IS rebuild/engine/constants.cjs SLEEP_ANCHOR_MIN_N');
  assert.equal(state.sleep.needed, AthleteState.SLEEP_NEEDED);
  assert.equal(typeof state.sleep.needed, 'number');
  assert(Number.isInteger(state.sleep.needed) && state.sleep.needed >= 1,
    'a reachable target: a run of at least one night');
  /* The H1 rule, executed: this module never names the seed, and the value is
     not typed as a digit beside the member either. */
  const src = readRepo('rebuild/m4/workout/athlete-state.cjs');
  assert.equal(/require\([^)]*seed\.cjs/.test(src), false, 'athlete-state.cjs never reads the seed');
  assert(/closed\(\{ nights: \[\], needed: SLEEP_NEEDED \}/.test(src),
    'the member is written from the engine-read constant, never from a literal');
  assert(/require\('\.\.\/\.\.\/engine\/constants\.cjs'\)\(\)\.SLEEP_ANCHOR_MIN_N/.test(src),
    'the value is READ from the engine at load time - a literal here could drift from it silently (mutant M7)');

  /* (3) WHAT THE READERS EXPECT FOR ZERO NIGHTS IS UNCHANGED. */
  assert.deepEqual(E.atSleepTarget(state, null), { run: 0, at: false },
    'sleep.cjs:1053 - not at a sleep target he has no nights for');
  assert.equal(E.sleepInfo(state).need, state.sleep.needed, 'sleep.cjs:1903 need is a number, not undefined');
  assert.equal(E.fiveLevers(state).sleep.detail, '99 nights dark — can\'t read',
    'today.cjs:264 - with no night at all the dark branch answers, as before');

  /* (4) THE DEFECT, MEASURED ON THE PRE-IMAGE SHAPE AND GONE ON OURS.
     One night on the record takes today.cjs:266 out of the dark branch. */
  const night = { d: offsetDay(DAY, -1), h: 6.1 };
  const withNight = JSON.parse(JSON.stringify(state)); withNight.sleep.nights = [night];
  const preImage = JSON.parse(JSON.stringify(withNight)); delete preImage.sleep.needed;

  assert.equal(E.fiveLevers(preImage).sleep.detail, '0/undefined clean',
    'RED: the parent shape puts the word undefined on the SLEEP lever');
  assert.equal(E.fiveLevers(withNight).sleep.detail, '0/' + state.sleep.needed + ' clean',
    'GREEN: ours prints a number he can count towards');
  assert.equal(E.sleepInfo(preImage).need, undefined,
    'RED: sleep.cjs:1903 hands its caller `need: undefined` on the parent shape');
  assert.equal(Object.hasOwn(JSON.parse(JSON.stringify(E.sleepInfo(preImage))), 'need'), false,
    'RED: and JSON.stringify DROPS the member, so a host reading the projection sees no `need` at all');
  assert.equal(E.sleepInfo(withNight).need, state.sleep.needed, 'GREEN: a number that survives the round trip');
  assert.equal(JSON.parse(JSON.stringify(E.sleepInfo(withNight))).need, state.sleep.needed, 'GREEN');
  /* recoveryIndex is where the NaN was: `Math.min(3, undefined - 0) * 10`. */
  const reason = s => JSON.stringify(E.recoveryIndex(s));
  assert(/0 of undefined clean nights/.test(reason(preImage)), 'RED: "0 of undefined clean nights"');
  assert(/NaN more nights/.test(reason(preImage)), 'RED: and a NaN count of nights owed');
  assert.equal(/undefined clean nights|NaN more nights/.test(reason(withNight)), false,
    'GREEN: neither survives');
  assert(/3 more nights/.test(reason(withNight)), 'GREEN: three named nights owed');

  /* (5) F-G IS OPEN AND THIS CELL HOLDS IT OPEN. `sleep.cleanH` is still
     absent - the engine states two different defaults for it (7.5 at
     sleep.cjs:1071, 8 at sleep.cjs:925) so there is no single honest value -
     and the measured consequence is that the clean-night RUN cannot advance.
     Recorded here so it cannot be forgotten, and so that closing it turns this
     assertion red rather than passing unnoticed. */
  const slept = JSON.parse(JSON.stringify(state));
  slept.sleep.nights = [-3, -2, -1].map(k => ({ d: offsetDay(DAY, k), h: 8.3 }));
  assert.equal(Object.hasOwn(slept.sleep, 'cleanH'), false, 'F-G: cleanH is deliberately not written');
  assert.deepEqual(E.atSleepTarget(slept, null), { run: 0, at: false },
    'F-G, measured: three clean 8.3 h nights still count as a run of 0, because sleep.cjs:1051 compares against an absent cleanH');
  /* And it is NOT on Today's own projection, which is why F-G is an open
     finding and not an S2 blocker: the view carries no `undefined` text. */
  const view = createTodayModel({ today: DAY, basisState: withNight }).read();
  assert.equal(/undefined/.test(JSON.stringify(view)), false,
    'no reader in the Today projection prints undefined on this state');
});

/* ====================== F-B — THE FIRST WEIGH-IN (DECISIONS:142 (3)) ======================
   An S2 blocker in its own right: the owner's FIRST weigh-in must not make the
   trend NaN. `rebuild/engine/writers.cjs` applyRead gains a first-read branch
   that seeds the trend with THE READING ITSELF — his own number, the engine's
   first observation of the level, never a default and never another athlete's
   figure. Nothing about the rule needs an owner ruling: it invents nothing,
   chooses nothing between alternatives that differ in what they claim about
   him, and the only number it writes is the one he typed. The brief says so in
   one line; if the PM disagrees the cell is where the disagreement lands. */
test('H3/8 - first weigh-in on a clean-init athlete: trend finite and equal to the reading, second reading damped as today', () => {
  const E = createTodayEngine({ clock: TodayModel.engineClockFor(DAY) });
  const state = plainState();
  assert.equal(Object.hasOwn(state, 'trend'), false, 'he arrives with no bodyweight, and none is invented for him');

  /* THE FIRST READING. */
  const one = E.applyRead(state, DAY, 186.4, { hour: 8 });
  assert.equal(Number.isFinite(one.trend), true, 'the trend is a number, not NaN');
  assert.equal(one.trend, 186.4, 'and it is exactly what he put on the scale');
  assert.equal(one.reads.length, 1);
  assert.equal(one.reads[0].w, 186.4);
  assert.equal(one.reads[0].pt, null, 'there was no prior trend, and the row says so rather than carrying undefined');
  assert.equal(one.reads[0].sealed, false);
  assert.equal(one.reads[0].note, '', 'no spike, no seal, no noise claim on a reading with nothing to compare to');
  /* It survives the round trip the writer itself makes (JSON.parse/stringify):
     a NaN or an undefined here would come back null and re-enter the defect. */
  const plain = JSON.parse(JSON.stringify(one));
  assert.equal(plain.trend, 186.4);
  assert.equal(plain.reads[0].pt, null);

  /* THE SECOND READING — damped exactly as today: trend += 0.3 * clamp(d). */
  const two = E.applyRead(one, offsetDay(DAY, 1), 184.9, { hour: 8 });
  const expected = +(186.4 + 0.3 * Math.max(-1.5, Math.min(1.5, 184.9 - 186.4))).toFixed(1);
  assert.equal(two.trend, expected, 'the accepted EMA, unchanged, from the second reading on');
  assert.equal(two.reads[1].pt, 186.4, 'and the second row carries the real prior trend');

  /* AN ATHLETE WHO ALREADY HAS A TREND IS UNTOUCHED — the branch is reached
     only when there is no finite trend, so every accepted state behaves as it
     did. This is the same arithmetic asserted over a state that carries one. */
  const carried = E.applyRead({ ...plainState(), trend: 200 }, DAY, 198.5, { hour: 8 });
  assert.equal(carried.trend, +(200 + 0.3 * -1.5).toFixed(1), 'a carried trend still damps, never re-seeds');
  assert.equal(carried.reads[0].pt, 200);
});

test('H3/9 - after that first weigh-in, Today paints his own number and still invents none', async () => {
  const { JSDOM } = await import('jsdom');
  const E = createTodayEngine({ clock: TodayModel.engineClockFor(DAY) });
  const state = JSON.parse(JSON.stringify(E.applyRead(plainState(), DAY, 186.4, { hour: 8 })));
  const view = createTodayModel({ today: DAY, basisState: state }).read();

  /* The whole trend/pt/weekly chain, named, with what each reads before a
     SECOND reading exists. Every one of them is finite or an honest gate. */
  assert.equal(state.trend, 186.4, 'trend');
  assert.equal(state.reads[0].pt, null, 'pt on the first row');
  assert.deepEqual(state.weekly, [], 'weekly: no snapshot yet — one reading is not a week');
  assert.equal(view.currentRate.measured, false, 'currentRate: not measured, and says so');
  assert.equal(view.currentRate.n, 0);
  assert.equal(view.latestRead.lb, 186.4, 'the reading he entered is the reading shown');
  assert.equal(view.morningRead.lb, 186.4, 'and it is this morning\'s reading');
  /* F-A still holds after the seeding: no body-composition anchor exists, so
     every figure derived from one is STILL non-finite and the view still says
     "Not available yet". Seeding the trend must not make bfEst start inventing. */
  assert.equal(Number.isFinite(view.proteinTarget.g), false, 'no protein figure is claimed');
  assert.equal(Number.isFinite(view.proteinTarget.bf), false, 'no body-fat percentage is claimed');
  assert.equal(Number.isFinite(view.proteinTarget.ffmKg), false, 'no lean mass is claimed');

  const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
    { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  todayApp.mountToday(doc, createTodayModel({ today: DAY, basisState: state }), {});
  const text = doc.getElementById('phone').textContent.replace(/\s+/g, ' ').trim();
  assert.equal(/NaN/.test(text), false, 'no NaN reaches the screen');
  assert.equal(doc.querySelector('[data-slot="protein"]').textContent, 'Not available yet');
  assert(text.includes('186.4'), 'his own reading is on the screen');
  /* Every figure on the page is his own reading, his date, or his lift count —
     the same bound-slot standard as H3/5, with the reading now among them. */
  const digits = (text.match(/\d[\d,.]*/g) || []).sort();
  assert.deepEqual(digits, ['186.4', '186.4', '2', '7'].sort(),
    'the 7th, 2 lifts, and the number he put on the scale — twice, as trend and as this morning');
});

/* ============== F2, LABEL HALF — MG_LABEL region heads (DECISIONS:135 (5)) ============== */
test('H3/10 - volume bucketing reads the four new back region heads, and renders their labels', () => {
  const E = createTodayEngine({ clock: TodayModel.engineClockFor(DAY) });
  const constants = readRepo('rebuild/engine/constants.cjs');
  /* The four the bundle names for the BACK region, spelled as the engine spells
     a head key (`<muscle>_<head>`, as delts_side/rear/front already are). */
  for (const [key, label] of [['back_lats', 'lats'], ['back_upper', 'upper back'],
    ['back_traps', 'traps'], ['back_lower', 'lower back']])
    assert(constants.includes(key + ': "' + label + '"'), key + ' carries the label "' + label + '"');
  /* The three that were already there are untouched. */
  for (const [key, label] of [['delts_side', 'side delt'], ['delts_rear', 'rear delt'], ['delts_front', 'front delt']])
    assert(constants.includes(key + ': "' + label + '"'), key + ' is unchanged');

  /* THE BUCKETING, EXECUTED. volume.cjs:74 buckets by `e.head || e.mg`; a lift
     carrying one of the new heads must land in its own bucket and be printed
     with its label, not its key. */
  const state = plainState();
  state.trend = 186.4;
  state.exercises = [
    { id: 'pulldown', n: 'Lat pulldown', mg: 'back', head: 'back_lats', day: 'U', sets: 4, hi: 10, inc: 10, steps: [50, 60], w: 60, forks: [] },
    { id: 'face-pull', n: 'Face pull', mg: 'back', head: 'back_upper', day: 'U', sets: 3, hi: 15, inc: 5, steps: [20, 25], w: 25, forks: [] },
    { id: 'shrug', n: 'Shrug', mg: 'back', head: 'back_traps', day: 'U', sets: 2, hi: 12, inc: 10, steps: [90, 100], w: 100, forks: [] },
    { id: 'back-ext', n: 'Back extension', mg: 'back', head: 'back_lower', day: 'L', sets: 2, hi: 12, inc: 5, steps: [10, 15], w: 15, forks: [] },
    /* AND A LABEL WITH NO HEAD — it must bucket and render exactly as before. */
    { id: 'leg-press', n: 'Leg press', mg: 'quads', day: 'L', sets: 3, hi: 12, inc: 10, steps: [90, 100], w: 100, forks: [] },
  ];
  state.exOrder = { U: ['pulldown', 'face-pull', 'shrug'], L: ['back-ext', 'leg-press'] };
  /* programmeVolume counts a fixed week beginning 2026-07-27, so this athlete's
     own split must already be in force across it or dayType falls back to the
     engine's Mon/Thu week and the per-week counts stop being his. Two U days
     and one L day, exactly as SETUP declares them. */
  state.split = [{ from: '2026-07-01', map: SETUP.split.map }];
  const rows = E.programmeVolume(state);
  const buckets = new Map(rows.map(r => [r.mg, r]));
  assert(buckets.size, 'the volume reader produced buckets to inspect');
  /* volume.cjs:74 `bucket = e.head || e.mg` — each headed lift lands in its OWN
     bucket, and volume.cjs:32 `mgLabel(k) = MG_LABEL[k] || k` prints the label. */
  for (const [key, label] of [['back_lats', 'lats'], ['back_upper', 'upper back'],
    ['back_traps', 'traps'], ['back_lower', 'lower back']]) {
    assert(buckets.has(key), key + ' is its own bucket, not pooled into "back"');
    assert.equal(E.mgLabel(key), label, key + ' prints "' + label + '", not its key');
  }
  assert.equal(buckets.has('back'), false, 'the four headed lifts did NOT collapse into one "back" bucket');
  /* A LABEL WITH NO HEAD renders exactly as before: the key is the word. */
  assert(buckets.has('quads'), 'a lift with no head still buckets on its mg label');
  assert.equal(E.mgLabel('quads'), 'quads', 'and prints exactly as it did before this change');
  assert.equal(E.mgLabel('chest'), 'chest');
  assert.equal(E.mgLabel('synthetic-unmapped'), 'synthetic-unmapped', 'an unknown bucket still falls through to its own key');
  /* The sets really are this athlete's own declared sets, per bucket. */
  assert.equal(buckets.get('back_lats').sets, 4 * 2, '4 sets on each of his two U days');
  assert.equal(buckets.get('quads').sets, 3 * 1, '3 sets on his one L day');
});

test('H3/11 - the LABEL half changes no other engine behaviour, and the INDIRECT half is untouched', () => {
  const constants = readRepo('rebuild/engine/constants.cjs');
  /* The bundle is the LABEL half only; F1 keeps the INDIRECT half. */
  assert(constants.includes('const INDIRECT = { press: { triceps: 0.5, delts: 0.5 }, rows: { biceps: 0.5 }, pulldown: { biceps: 0.5 }, curl: { forearms: 0.5 } };'),
    'INDIRECT is byte-for-byte what it was: the INDIRECT half stays with F1');
  /* Lane C's accepted provenance cell 2.8 row 2 asserts the engine has no gloss
     table for the labels first-run collects. Adding entries for the bare muscle
     labels would break it and change nothing on screen, so they are not added.
     This cell asserts lane C's own predicate directly, so the two cannot drift. */
  assert.equal(/MG_LABEL[\s\S]{0,400}quads/.test(constants), false,
    'lane C setup.test.mjs 2.8 row 2 still holds against this table');
  const MG_LABELS = ['chest', 'back', 'delts', 'biceps', 'triceps', 'forearms', 'abs', 'quads', 'hams', 'glutes', 'calves'];
  const table = constants.slice(constants.indexOf('const MG_LABEL = {'));
  const body = table.slice(0, table.indexOf('};') + 2);
  for (const label of MG_LABELS)
    assert.equal(new RegExp('\\b' + label + ':').test(body), false,
      label + ' is a muscle label, not a head: `MG_LABEL[k] || k` already renders it as itself');
  assert.equal((body.match(/:/g) || []).length, 7, 'exactly seven head entries: three delt, four back');
});

/* ====== H3/12 — THE FIRST READ AND THE WINDOW (DECISIONS:146 (3), OPTION B) ======
   The first draft of F-B seeded the trend whatever the window. Review r1 found
   what that made the app say: a first read at 23:00 came back with
   `offWindow: true`, `note: "late read — set aside"` and a LATE READ — SET
   ASIDE feed line, and the trend WAS that reading; a sealed first read said
   "sealed — excluded from trend" and was the trend. The same two calls on a
   trend-carrying athlete leave his trend alone, so two athletes were told the
   same words and given different arithmetic.

   The PM ruled OPTION B (`:146 (3)`): seed only from an in-window, unsealed
   first read; otherwise the trend stays absent and Today keeps saying "Not
   available yet". The copy was not rewritten — the behaviour was made to match
   it. This cell asserts B, and the option-A branch is kept only so the two
   readings of the question stay visible in one place. */
const FIRST_READ_ON_A_SET_ASIDE_ROW = false;   // DECISIONS:146 (3) = OPTION B

test('H3/12 - a first weigh-in that is late or sealed does NOT seed the trend, and Today says so', () => {
  const E = createTodayEngine({ clock: TodayModel.engineClockFor(DAY) });
  const seeds = FIRST_READ_ON_A_SET_ASIDE_ROW;
  assert.equal(seeds, false, 'DECISIONS:146 (3) ruled option B; this cell asserts B');

  /* IN WINDOW — the ruled-in case, unchanged. */
  const inWindow = E.applyRead(plainState(), DAY, 186.4, { hour: 8 });
  assert.equal(inWindow.trend, 186.4, 'an in-window first read IS the trend');
  assert.equal(!!inWindow.reads[0].offWindow, false);
  assert.equal(inWindow.reads[0].sealed, false);
  assert.equal(inWindow.reads[0].note, '', 'nothing is claimed about a reading with nothing to compare to');

  /* LATE (off-window) FIRST READ — recorded, and NOT the trend. */
  const late = E.applyRead(plainState(), DAY, 186.4, { hour: 23 });
  assert.equal(late.reads.length, 1, 'the reading is still RECORDED — it is never refused');
  assert.equal(late.reads[0].w, 186.4, 'and it is his number, unchanged');
  assert.equal(late.reads[0].offWindow, true, 'the row is marked off-window');
  assert.equal(late.reads[0].note, 'late read — set aside', 'and it says so');
  assert.equal((late.feed[0] || {}).t, 'LATE READ — SET ASIDE', 'and the feed repeats it');
  assert.equal(Object.hasOwn(late, 'trend'), false, 'set aside means SET ASIDE: no trend is written');
  assert.equal(late.reads[0].pt, null, 'and there is still no prior trend to report');

  /* SEALED FIRST READ. A clean-init athlete cannot reach this by himself (H3/4
     proves no blackout is in force), so the state is built by hand and said to be. */
  const sealedState = { ...plainState(), blackout: { until: offsetDay(DAY, 13) } };
  const sealed = E.applyRead(sealedState, DAY, 186.4, { hour: 8 });
  assert.equal(sealed.reads[0].sealed, true, 'the row is marked sealed');
  assert.equal(sealed.reads[0].note, 'sealed — excluded from trend', 'and it says EXCLUDED FROM TREND');
  assert.equal(Object.hasOwn(sealed, 'trend'), false, 'so it really is excluded');

  /* THE TWO ATHLETES NOW AGREE. A trend-carrying athlete was always left alone
     by both hours; the clean-init athlete is now left alone in the same words. */
  const carried = { ...plainState(), trend: 187.2 };
  assert.equal(E.applyRead(carried, DAY, 186.4, { hour: 23 }).trend, 187.2,
    'a trend-carrying athlete: the late read is set aside');
  assert.equal(E.applyRead({ ...carried, blackout: { until: offsetDay(DAY, 13) } }, DAY, 186.4, { hour: 8 }).trend,
    187.2, 'and a sealed read is excluded');

  /* AND TODAY KEEPS THE HONEST SURFACE until an in-window reading arrives. */
  const view = createTodayModel({ today: DAY, basisState: JSON.parse(JSON.stringify(late)) }).read();
  assert.equal(Number.isFinite(view.proteinTarget.g), false, 'no figure is claimed from a trend he has not established');
  assert.equal(view.currentRate.measured, false);

  /* THEN AN IN-WINDOW READING THE NEXT MORNING SEEDS IT — the late row is still
     on file, and the trend is the first reading that was actually in window. */
  const next = E.applyRead(late, offsetDay(DAY, 1), 185.9, { hour: 8 });
  assert.equal(next.trend, 185.9, 'the first IN-WINDOW reading is the seed');
  assert.equal(next.reads.length, 2, 'and nothing he recorded was thrown away');
  assert.equal(next.reads[1].pt, null, 'it is still a first trend, so there is no prior one');
});

/* ====== H3/13 — the rebuild.yml enumeration DECISIONS:142 (2)(b) rides on H3 ======
   Review r1 PM ITEM: nothing in the tree asserts it. The only workflow cell,
   conform/v4/postfix/test/ci-second-gate.test.cjs, is stale-RED at this head AND
   at ce38aa3 (pre-existing, not an H3 regression), so H3 carries its own. */
test('H3/13 - the CI today step enumerates setup.test.mjs, named and not globbed', () => {
  const yml = readRepo('.github/workflows/rebuild.yml');
  const step = yml.split('\n').find(l => l.trim().startsWith('run: node --test') && l.includes('w7-preview/today/test/adapter.test.mjs'));
  assert(step, 'the today step is still one `run:` line naming its files');
  const FILES = ['adapter.test.mjs', 'checkin.test.mjs', 'design.test.cjs', 'gym.test.mjs',
    'ntc-h6-delta.test.mjs', 'package.test.cjs', 'setup.test.mjs', 'view.test.mjs'];
  for (const f of FILES)
    assert(step.includes('rebuild/m3/w7-preview/today/test/' + f), f + ' is named in the today step');
  assert.equal(/[*?]/.test(step), false, 'every file is named rather than globbed, as the step has always said');
  /* And the eight named there are exactly the eight that exist, so a file added
     under that directory cannot acquire a CI home by accident or lose one. */
  const onDisk = fs.readdirSync(path.join(REPO, 'rebuild/m3/w7-preview/today/test'))
    .filter(n => /\.test\.(mjs|cjs)$/.test(n)).sort();
  /* NOT ENUMERATED ANYWHERE, AND THIS IS A FINDING, NOT A LICENCE (v1.8 F-H).
     `copy.test.mjs` is A4's own and lane C enumerates it elsewhere.
     `catalogue.test.mjs` and `problem.test.mjs` arrived with the tip merged
     into this branch (origin/rebuild/t2-client-core @ ec80cbe) and
     `.github/workflows/rebuild.yml` names NEITHER — measured: the string
     "catalogue" and the string "problem" do not occur in the workflow at all,
     so 2 of the 11 test files under that directory have no CI home. That is a
     rebuild.yml change only the PM may rule on (the :142 (2)(b) precedent),
     so H3 does NOT apply it and asserts the exact state instead: a third file
     appearing unenumerated, or one of these two acquiring a home, turns this
     red and sends someone to read it. */
  const UNENUMERATED = ['catalogue.test.mjs', 'copy.test.mjs', 'problem.test.mjs'];
  assert.deepEqual(onDisk, FILES.concat(UNENUMERATED).sort(),
    'the directory holds exactly the eight enumerated files plus the three this step does not name');
  for (const f of ['catalogue.test.mjs', 'problem.test.mjs'])
    assert.equal(new RegExp(f.replace('.', '\\.')).test(yml), false,
      f + ' has no CI home anywhere in the workflow — F-H, raised for the PM, not fixed here');
});
