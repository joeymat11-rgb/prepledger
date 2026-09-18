/* P3-REAL-SHAPE - THE BAR, part 1: ADMISSION, ADOPTION, THE LABEL, THE
   NEGATIVES, THE COMPANION AND THE INVARIANT ROWS (spec section 4 (a), (b),
   (e), (f), (g), (i)).

   Every cell runs the SHIPPED page - design.shellHtml(), today-entry.mjs
   boot(), the real encrypted repository over fake-indexeddb, the real Import
   route - on a live clock, against a bundle sealed by the REAL port.cjs from
   the real-shape fixture. Nothing is mounted by hand and nothing is stubbed.

   RED FIRST. Against the UNCHANGED tree every cell here fails with the code and
   field section 1 of the spec records; the author's report lists each one.

   SYNTHETIC ONLY. Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { Fixture, PHONE, PHONE_ID, variant, sealed, sealNamed, walk, durable, reopen,
  toReview, afterTap, phoneNaming, clone, IMPORT_DAY, SETUP_DAY, AT,
  tagProjector, companionFor } from './real-shape-support.mjs';
import { IDBFactory, eraFor, liveAt, firstRunWith, Entry, shellWindow, slot,
  installTraps, textOf } from '../../../m3/w7-preview/import/test/support.mjs';
import { listImportRetractions } from '../../../m3/w6/local/browser-entry.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Corr = require('../../../m4/workout/lift-correspondence.cjs');

const NEXT_L = '2026-09-18';   // the Friday the FILE's own split map calls L
const NEXT_U = '2026-09-20';   // the Sunday it calls U
const totalOn = (lifts, day) => lifts.filter(e => e.day === day).reduce((n, e) => n + e.sets, 0);

/* (a) THE BAR. A fresh-start phone whose setup names the same lifts BY NAME
   imports the real-shape bundle - `why` on the period, short-handle ids, no
   athlete_label, no `steps`, `inc: null` on the bodyweight lift, `BW` and
   `hold` working loads - and the screen shows no refusal, takes custody,
   commits, and takes nothing back. D-RS-a0 INVERTED. */
test('(a) D-RS-BAR-a - the real-shape bundle, as the old app holds it, ADMITS '
  + 'on the shipped page: no refusal line, custody kept, basis committed, '
  + 'nothing retracted', async () => {
  const out = await walk('bar-a', sealed(0));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  assert.equal(out.line, null);
  assert.equal(out.stage, 'done');
  const after = await durable(out.kit.era);
  assert.equal(after.applied, true);
  assert.equal(after.basis, true);
  assert.equal(after.rebaseRequired.length, 0);
  assert.equal((await listImportRetractions(out.kit.era.client)).length, 0);
  /* The file this admitted really is the OLD app's shape, or the cell is about
     something else: the period's third member, the handles, no label, no ladder
     and the two configuration loads. */
  const file = variant(0);
  assert.deepEqual(Object.keys(file.split[0]).sort(), ['from', 'map', 'why']);
  assert.equal(Object.hasOwn(file, 'athlete_label'), false);
  assert.equal(file.exercises.find(e => e.n === 'Hack squat').id, 'hack');
  for (const e of file.exercises) assert.equal(Object.hasOwn(e, 'steps'), false, e.id);
  assert.deepEqual(file.exercises.filter(e => typeof e.w === 'string').map(e => e.w).sort(),
    ['BW', 'hold']);
  out.kit.close();
});

/* (b) ADOPTED, AND THE MORNING. THE ONE CELL THAT DECIDES.
   The same walk, then Entry.boot on the SAME IndexedDB at a later instant: the
   page adopts, and the card the PAGE itself opens carries the FILE's lifts, the
   FILE's ids and each lift's own sets and hi.

   GAP 5 IS NOT CLOSED BY THIS TICKET and this cell says so rather than hiding
   it. PM QUESTION 1 was ruled YES subject to a measurement; the measurement
   (q1-producer.test.mjs) REFUSED in both directions, so today-bindings.mjs is
   unmoved and the L day - which is where the `BW` raise and the `hold` hack
   live - still has no card. The U day is proved here in full; the L day is
   proved in full by D-RS-h2, the same day with the configuration loads replaced
   by numbers. D-RS-d inverted in its bracket level (the label now arrives from
   admission, not from the file). */
test('(b) D-RS-BAR-b - the next morning on the same IndexedDB the page ADOPTS '
  + 'the file: the U day\'s card is the FILE\'s lifts, ids and per-lift sets '
  + 'and hi, and its total is the file\'s and not the document\'s', async () => {
  const out = await walk('bar-b', sealed(0));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  out.kit.close();
  const file = variant(0);

  const morning = await reopen(out.kit.indexedDB, out.kit.scope, NEXT_U);
  const loaded = await morning.era.generation();
  const adopted = admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: PHONE.setup.athlete_label, namespace: out.kit.scope.namespace });
  assert.notEqual(adopted, null, 'the page did not adopt');
  assert.equal(adopted.athlete_label, PHONE.setup.athlete_label);
  for (const ex of file.exercises) {
    const landed = adopted.exercises.find(e => e.id === ex.id);
    assert.notEqual(landed, undefined, 'the file\'s lift is not in the basis: ' + ex.id);
    assert.equal(landed.n, ex.n, ex.id);
    assert.equal(landed.sets, ex.sets, ex.id);
    assert.equal(landed.hi, ex.hi, ex.id);
    assert.equal(landed.day, ex.day, ex.id);
  }
  /* The ids really are the FILE's handles and not the phone's slugs. */
  assert.equal(adopted.exercises.some(e => e.id === 'hack'), true);
  assert.equal(adopted.exercises.some(e => e.id === PHONE_ID.hack), false);

  const card = await morning.booted.workout.gym.read();
  const fileU = totalOn(file.exercises, 'U'), phoneU = totalOn(PHONE.setup.exercises, 'U');
  assert.notEqual(fileU, phoneU, 'the two documents must disagree, or the cell proves nothing');
  assert.equal(card.phase, 'ready', card.code || card.phase);
  assert.equal(card.total, fileU);
  morning.close();

  /* THE L DAY, AND GAP 5. Named, not hidden: the card is blocked because the
     page's capture producer is still v1 and the old app's `w` can be `BW` or
     `hold`. PM QUESTION 1's proviso was not met (q1-producer.test.mjs). */
  const lday = await reopen(out.kit.indexedDB, out.kit.scope, NEXT_L);
  const blocked = await lday.booted.workout.gym.read();
  assert.equal(blocked.phase, 'blocked');
  assert.equal(blocked.code, 'ENGINE_CAPTURE_LOAD_UNPROVEN');
  lday.close();
});

/* (e) THE LABEL, BOTH WAYS. D-RS-c INVERTED on the absent side, and a new
   refusal on the other. */
test('(e) D-RS-BAR-e1 - a file with NO athlete_label is admitted AND ADOPTED '
  + 'under this phone\'s own first-run label', async () => {
  const out = await walk('bar-e1', sealed(0));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  const loaded = await out.kit.era.generation();
  const state = loaded.generation.collections.derived.localSource.view.state;
  assert.equal(Object.hasOwn(variant(0), 'athlete_label'), false,
    'the file must carry no label, or this cell proves nothing');
  assert.equal(state.athlete_label, PHONE.setup.athlete_label,
    'admission did not write this phone\'s label onto the admitted state');
  assert.notEqual(admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: PHONE.setup.athlete_label, namespace: out.kit.scope.namespace }), null,
    'the page still refuses to adopt');
  out.kit.close();
});

test('(e) D-RS-BAR-e2 - a file saved under a DIFFERENT name is refused by that '
  + 'name, field athlete_label, and the screen renders the code line plus one '
  + 'sentence with no number, no dash and no value from the file', async () => {
  const bundle = sealNamed('other-label', () => {
    const state = variant(0);
    state.athlete_label = 'synthetic-other-identity';
    return state;
  });
  const out = await walk('bar-e2', bundle);
  assert.deepEqual(out.refusal, { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    detail: 'athlete_label', field: 'athlete_label' });
  assert.equal(out.line, 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED (athlete_label) This file was '
    + 'saved under a different name than the one you set up on this phone. '
    + 'Nothing on this phone was changed.');
  /* The two dash code points are built rather than typed, so this source file
     stays pure ASCII and the census over it cannot trip on its own assertion. */
  assert.equal(/[0-9]/.test(out.line), false, 'a number rode out');
  assert.equal(new RegExp('[' + String.fromCharCode(0x2013, 0x2014) + ']').test(out.line),
    false, 'an en dash or an em dash rode out');
  assert.equal(out.line.includes('synthetic-other-identity'), false,
    'the file\'s own value rode out on the refusal line');
  const after = await durable(out.kit.era);
  assert.equal(after.applied, false);
  assert.equal(after.basis, false);
  const taken = await listImportRetractions(out.kit.era.client);
  assert.equal(taken.length, 1);
  assert.equal(taken[0].reason, 'review-refused');
  out.kit.close();
});

/* P-LABEL IS TESTED BEFORE THE PER-LIFT LOOP (spec 2.3, review R1 N9): a file
   that names someone else AND carries a lift fault is refused BY THE NAME. */
test('(e) D-RS-BAR-e3 - a file with a different name AND a broken lift is '
  + 'refused by athlete_label, not by the lift', async () => {
  const bundle = sealNamed('other-label-broken', () => {
    const state = variant(0);
    state.athlete_label = 'synthetic-other-identity';
    state.exercises[0].sets = 0;
    return state;
  });
  const out = await walk('bar-e3', bundle);
  assert.equal(out.refusal.field, 'athlete_label', JSON.stringify(out.refusal));
  out.kit.close();
});

/* (f) THE NEGATIVES, ON THE REAL SHAPE. Every one of these is a rule option A
   KEEPS, measured on the file shape that option A admits, so none of them is
   green only because the old shape refused earlier for another reason. */
const negative = (name, key, mutate, expected) =>
  test('(f) D-RS-BAR-f ' + name, async () => {
    const out = await walk('bar-f-' + key, sealNamed('neg-' + key, () => mutate(variant(0))));
    assert.deepEqual(out.refusal, { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', ...expected });
    const after = await durable(out.kit.era);
    assert.equal(after.applied, false);
    assert.equal(after.basis, false);
    const taken = await listImportRetractions(out.kit.era.client);
    assert.equal(taken.length, 1);
    assert.equal(taken[0].reason, 'review-refused');
    out.kit.close();
  });

negative('- a STRANGER\'S WEEK (one day letter different) still refuses '
  + 'split.map and names no lift', 'week',
  state => { state.split[0].map['4'] = 'L'; return state; },
  { detail: 'split.map', field: 'split.map' });

negative('- a FUTURE-DATED period still refuses split.from', 'future',
  state => { state.split[0].from = '2027-01-01'; return state; },
  { detail: 'split.from', field: 'split.from' });

negative('- an EMPTY period array still refuses split', 'nosplit',
  state => { state.split = []; return state; },
  { detail: 'split', field: 'split' });

negative('- TWO LIFTS SHARING ONE ID refuse exercise_id', 'dupid',
  (state) => {
    const kept = state.exercises[0].id, gone = state.exercises[1].id;
    state.exercises[1].id = kept;
    const remap = x => (x === gone ? kept : x);
    state.exOrder = { U: state.exOrder.U.map(remap), L: state.exOrder.L.map(remap) };
    for (const day of Object.values(state.sessionLog))
      for (const entry of day.entries) entry.id = remap(entry.id);
    for (const q of state.queue) if (q.exId) q.exId = remap(q.exId);
    return state;
  },
  { detail: 'exercise_id lateral', field: 'exercise_id' });

negative('- a lift whose NAME NORMALISES TO NOTHING refuses exercise_n', 'unnamed',
  state => { state.exercises[0].n = '---'; return state; },
  { detail: 'exercise_n lateral', field: 'exercise_n' });

negative('- a lift with sets: 0 still refuses `sets` with its own lift id', 'sets0',
  state => { state.exercises[0].sets = 0; return state; },
  { detail: 'sets lateral', field: 'sets' });

/* THE CONTROL review R1 (N4) ASKED FOR. normaliseName's class is
   `\p{L}\p{N}` and not `[a-z0-9]`, so a lift named in a NON-LATIN script
   normalises to itself rather than to the empty string: it admits and it
   corresponds. The phone's own slugOf DOES collapse it (the id it mints is
   `lift`), which is exactly why the correspondence is by name. */
/* Built from code points so this source file stays pure ASCII. */
const CYRILLIC = String.fromCharCode(0x411, 0x43e, 0x43a, 0x43e, 0x432, 0x430, 0x44f,
  0x20, 0x43c, 0x430, 0x448, 0x438, 0x43d, 0x430);

test('(f) D-RS-BAR-f7 (the non-Latin control) - a lift named in a non-Latin '
  + 'script admits and corresponds normally', async () => {
  assert.equal(Corr.normaliseName(CYRILLIC), CYRILLIC.toLowerCase());
  assert.notEqual(Corr.normaliseName(CYRILLIC), '');
  const lifts = Fixture.TYPED_LIFTS.map(l => (l.n === 'Lateral machine' ? { ...l, n: CYRILLIC } : l));
  const setup = phoneNaming(lifts);
  const bundle = sealNamed('cyrillic', () => {
    const state = variant(0);
    state.exercises.find(e => e.id === 'lateral').n = CYRILLIC;
    return state;
  });
  const out = await walk('bar-f7', bundle, { setup });
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  const loaded = await out.kit.era.generation();
  const state = loaded.generation.collections.derived.localSource.view.state;
  /* The file's lift is there under the FILE's id and the FILE's name, and the
     phone's own row for it was corresponded rather than kept as a retired
     stranger: it is not in the state under the slug slugOf minted. */
  assert.equal(state.exercises.find(e => e.id === 'lateral').n, CYRILLIC);
  const phoneRowId = setup.setup.exercises.find(e => e.n === CYRILLIC).id;
  assert.equal(state.exercises.some(e => e.id === phoneRowId), false,
    'the corresponded document row was kept as its own lift');
  out.kit.close();
});

/* (g) THE COMPANION. Edit My Week opens on the adopted real-shape basis: the
   file's own `why` retained on the period, the file's short-handle lift ids in
   the rows, and the phone's label written on by admission. D-RS-k INVERTED,
   all three assertions. */
let TAGS = null;
test.before(async () => { TAGS = await tagProjector(); });

test('(g) D-RS-BAR-g - Edit My Week OPENS on the adopted real-shape basis: '
  + 'the file\'s `why`, the file\'s handle ids and the label admission wrote', async () => {
  const out = await walk('bar-g', sealed(0));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  const loaded = await out.kit.era.generation();
  const adopted = admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: PHONE.setup.athlete_label, namespace: out.kit.scope.namespace });
  assert.notEqual(adopted, null);
  /* The three things D-RS-k measured as refusals are all present here. */
  assert.equal(adopted.split.every(p => typeof p.why === 'string'), true, 'the file\'s note is gone');
  assert.equal(adopted.exercises.some(e => e.id === 'hack'), true, 'the handles are gone');
  assert.equal(adopted.athlete_label, PHONE.setup.athlete_label);
  assert.doesNotThrow(() => companionFor(loaded.generation, out.kit.scope, clone(adopted), TAGS));
  out.kit.close();
});

/* (i) THE INVARIANT ROWS (DECISIONS:439 (1)), on the real-shape fixture. The
   refusal used here is the stranger's week, which is a refusal option A KEEPS.
   Every trap is installed BEFORE the route is opened. */
test('(i) D-RS-BAR-i - on a refusal the device writes nothing, the refusal '
  + 'retracts with reason review-refused, no byte leaves the device, the '
  + 'passphrase is in no rendered text and no value from the file rides out',
async () => {
  const bundle = sealNamed('neg-week', () => { const s = variant(0); s.split[0].map['4'] = 'L'; return s; });
  const indexedDB = new IDBFactory();
  const scope = { databaseName: 'p3-rs-bar-i', namespace: 'joe/p3-rs-bar-i',
    athleteId: 'ath-p3-rs', deviceId: 'dev-p3-rs' };
  const first = await eraFor({ indexedDB, live: liveAt(AT(SETUP_DAY)), ...scope });
  await firstRunWith(first, SETUP_DAY, PHONE.setup, PHONE.tags);
  first.close();

  const era = await eraFor({ indexedDB, live: liveAt(AT(IMPORT_DAY)), ...scope });
  const win = shellWindow();
  Object.defineProperty(win, 'indexedDB', { configurable: true, value: indexedDB });
  const traps = installTraps(win);
  const booted = await Entry.boot({ document: win.document, hosts: era, now: liveAt(AT(IMPORT_DAY)) });
  await booted.api.ready;
  /* BEFORE is read after custody and the identity Yes and before the one tap
     that runs the rule, so what it measures is what THE REFUSAL wrote. */
  const reviewed = await toReview(win, booted, bundle);
  assert.equal(reviewed.step, 'identity');
  const kept = row => ({ ops: row.ops, outbox: row.outbox, applied: row.applied, basis: row.basis });
  const before = await durable(era);
  const at = await afterTap(booted, slot(win.document, 'import-confirm'));
  assert.deepEqual(at.refusal(), { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    detail: 'split.map', field: 'split.map' });

  const after = await durable(era);
  assert.deepEqual(kept(after), kept(before), 'the device wrote something on a refusal');
  assert.equal(after.applied, false);
  assert.equal(after.basis, false);
  /* AND THE FILE IS TAKEN BACK: the custody entry the pick wrote is gone. */
  assert.deepEqual(after.imports, []);
  const taken = await listImportRetractions(era.client);
  assert.equal(taken.length, 1);
  assert.equal(taken[0].reason, 'review-refused');
  assert.deepEqual(traps.fired(), [], 'a byte left the device');
  const text = textOf(win.document);
  assert.equal(text.includes(bundle.passphrase), false, 'the passphrase is on the screen');
  const line = slot(win.document, 'import-refusal');
  assert.equal(/[0-9]/.test(line.textContent), false, 'a number rode out on the refusal line');
  for (const lift of variant(0).exercises)
    assert.equal(line.textContent.includes(lift.id), false, 'a file lift id rode out: ' + lift.id);
  booted.rollover.stop(); booted.teardown(); era.close();
});
