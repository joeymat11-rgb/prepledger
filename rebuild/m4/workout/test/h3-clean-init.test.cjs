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
const { createCleanInitState, BLACKOUT_MEMBERS, MODEL_MEMBERS, REQUIRED_SETUP } = AthleteState;
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
  // (rebuild/engine/writers.cjs:424 JSON.parse(JSON.stringify(state))), which
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
     and rebuild/m3/w7-preview/today/today-app.cjs:209 gates on exactly that.
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
      e => e.code === 'CLEAN_INIT_BLACKOUT_REQUIRED'); } },
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
      e => e.code === 'CLEAN_INIT_MODEL_REQUIRED'); } },
  { id: 'M5', name: 'closed() SKIPPED for the new members, so drift reaches the engine',
    from: 'const blackout = closed({ until: dayBefore(split.from) }, BLACKOUT_MEMBERS, \'CLEAN_INIT_BLACKOUT_REQUIRED\');',
    to: 'const blackout = { until: dayBefore(split.from), reason: \'wedding fortnight\' };',
    killedBy: 'H3/1 (Reflect.ownKeys equals the declared set) and H3/2',
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
];

test('H3/7 - six named mutants, each of them killed by a named cell', () => {
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
      m._compile(fs.readFileSync(file, 'utf8'), file);
      mutant.dies(m.exports);
    }
    assert.equal(MUTANTS.length, 6, 'six named mutants, no fewer');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
