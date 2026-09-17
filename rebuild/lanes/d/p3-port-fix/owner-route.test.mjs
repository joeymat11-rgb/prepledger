/* P3-PORT-FIX (lane D, CELLS). THE OWNER'S PATH THROUGH THE SHIPPED PAGE.

   Carried forward from rebuild/lanes/d/p3-port-refusal/owner-route.test.mjs
   (the diagnosis branch rebuild/d-p3-port-refusal), with the two rewrites spec
   5 (h) names: the phone's setup document is built by the REAL setup reducer
   rather than hand-given the file's own start date and per-lift numbers, which
   the shipped screens cannot write. D-PRR-1's expected result INVERTS: the
   refusal the owner saw on 2026-09-17 is now an admission. D-PRR-2 becomes the
   route-level half of cell (a): the next morning, and the companion.

   Nothing here is mounted by hand: the page is design.shellHtml() with
   today-entry.mjs boot() over the real encrypted repository, and the route is
   opened and tapped the way he taps it.

   SYNTHETIC ONLY: the bundle is sealed by the real port.cjs from the PUBLIC
   journey fixture. No private fixture, no ledger, no owner file.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, eraFor, liveAt, durable, shippedSetup,
  firstRunWith, variedProgramme, variedLegacyState, STRANGER_WEEK_SETUP,
  Entry, shellWindow, slot, tap, type, pickBundle }
  from '../../../m3/w7-preview/import/test/support.mjs';
import { listImportRetractions } from '../../../m3/w6/local/browser-entry.mjs';
import Screen from '../../../m3/w7-preview/import/import-screen.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';
import { createGymModel } from '../../../m3/w7-preview/today/gym-model.mjs';
import { createPlanEditProjector } from '../../../m4/workout/plan-edit-model.cjs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const SETUP_DAY = '2026-09-16', IMPORT_DAY = '2026-09-17', NEXT_DAY = '2026-09-18';
const AT = day => day + 'T16:00:00.000Z';
const clone = value => JSON.parse(JSON.stringify(value));
const hashBasis = text => createHash('sha256').update(text, 'utf8').digest('hex');
const scopeFor = tag => ({ databaseName: 'p3-pfr-' + tag, namespace: 'joe/p3-pfr-' + tag,
  athleteId: 'ath-p3-pfr', deviceId: 'dev-p3-pfr' });

/* THE PHONE, as the shipped screens wrote it, and the OLD APP's file. */
const PHONE = shippedSetup({ today: SETUP_DAY });
const FILE = variedProgramme(PHONE.setup);
const SEALED = sealInventedBundle(FILE, { state: variedLegacyState(FILE) });
/* A stranger's week, for the refusal the sentence is rendered for. */
const STRANGER_WEEK = sealInventedBundle(STRANGER_WEEK_SETUP);
/* The same file with ONE lift moved to the other day, so only P-C can fire and
   the rendered detail names a lift. */
const WRONG_DAY_FILE = (() => {
  const varied = clone(FILE); varied.exercises[0].day = 'L';
  return sealInventedBundle(varied, { state: variedLegacyState(varied) });
})();

let validateTags, projectNewTags;
test.before(async () => {
  const { createSetupTagProjector } = createRequire(import.meta.url)('../plan-edit/f2-tag-adapter.cjs');
  const { ENGINE_MG, REGION_MG } = await import('../../../m3/w7-preview/today/exercise-catalogue.mjs');
  const api = createSetupTagProjector({ taxonomy: { muscles: ENGINE_MG, regions: REGION_MG } });
  validateTags = api.validateExerciseTags; projectNewTags = api.projectNewExerciseTags;
});

/* ONE PHONE: one IDBFactory, setup completed on day one through the SHIPPED
   reducer's document, and the page reopened on day two, which is when he
   imports. */
async function phone(tag, { at = IMPORT_DAY } = {}) {
  const indexedDB = new IDBFactory();
  const scope = scopeFor(tag);
  const first = await eraFor({ indexedDB, live: liveAt(AT(SETUP_DAY)), ...scope });
  await firstRunWith(first, SETUP_DAY, PHONE.setup, PHONE.tags);
  first.close();
  return { ...(await reopen(indexedDB, scope, at)), indexedDB, scope };
}

async function reopen(indexedDB, scope, at) {
  const era = await eraFor({ indexedDB, live: liveAt(AT(at)), ...scope });
  const win = shellWindow();
  Object.defineProperty(win, 'indexedDB', { configurable: true, value: indexedDB });
  const booted = await Entry.boot({ document: win.document, hosts: era, now: liveAt(AT(at)) });
  await booted.api.ready;
  return { era, win, doc: win.document, booted,
    close: () => { booted.rollover.stop(); booted.teardown(); era.close(); } };
}

async function afterTap(booted, node) {
  tap(node);
  const screen = booted.api.importScreen();
  if (screen) await screen.settled();
  await booted.api.render('import', false);
  return booted.api.importScreen();
}

async function toReview(win, booted, sealed) {
  const doc = win.document;
  await booted.api.render('import', true);
  pickBundle(win, doc.getElementById('import-file'), sealed.bytes);
  await booted.api.render('import', false);
  type(doc.getElementById('import-passphrase'), sealed.passphrase);
  const unlocked = await afterTap(booted, slot(doc, 'import-unlock'));
  assert.equal(unlocked.step(), 'identity', JSON.stringify(unlocked.refusal()));
  return afterTap(booted, slot(doc, 'import-identity-yes'));
}

/* D-PRR-1, CARRIED FORWARD AND INVERTED. The cell that reproduced the owner's
   refusal now reproduces his import. Nothing about the route changed: the same
   phone, the same taps, the same file. */
test('D-PRR-1 (the owner\'s screen, INVERTED by P3-PORT-FIX) - a fresh-start '
  + 'phone set up yesterday ADMITS his own history at CONFIRM, with no refusal '
  + 'and nothing taken back', async () => {
  const kit = await phone('owner');
  const reviewed = await toReview(kit.win, kit.booted, SEALED);
  assert.equal(reviewed.step(), 'review',
    'the unseal or the review refused: ' + JSON.stringify(reviewed.refusal()));
  const at = await afterTap(kit.booted, slot(kit.doc, 'import-confirm'));
  assert.equal(at.refusal(), null,
    'the owner\'s own history was refused: ' + JSON.stringify(at.refusal()));
  assert.equal(at.step(), 'done');
  assert.equal(slot(kit.doc, 'import-refusal'), null,
    'the screen painted a refusal line on an admitted import');
  const taken = await listImportRetractions(kit.era.client);
  assert.equal(taken.length, 0, 'nothing was taken back');
  const after = await durable(kit.era);
  assert.equal(after.applied, true);
  assert.equal(after.basis, true);
  kit.close();
});

const sumSets = (setup, kind) => setup.exercises
  .filter(e => e.day === kind).reduce((n, e) => n + e.sets, 0);

/* D-PRR-2, CARRIED FORWARD AND REWRITTEN (spec 5 (h)): the phone's document is
   the shipped reducer's, so nothing here admits against a document the screens
   cannot produce. This is the ROUTE-LEVEL half of cell (a): THE NEXT MORNING,
   and THE COMPANION DOES NOT REFUSE. */
test('D-PRR-2 (cell (a), route level) - the morning after an admitted import the '
  + 'gym card is built from the FILE\'s programme, and the Edit My Week '
  + 'companion opens on that same basis without refusing', async () => {
  const kit = await phone('morning');
  const reviewed = await toReview(kit.win, kit.booted, SEALED);
  assert.equal(reviewed.step(), 'review', JSON.stringify(reviewed.refusal()));
  const at = await afterTap(kit.booted, slot(kit.doc, 'import-confirm'));
  assert.equal(at.refusal(), null, JSON.stringify(at.refusal()));
  assert.equal(at.step(), 'done');
  kit.close();

  /* THE FOLLOWING LOCAL DAY: the same live binding read at a second instant
     over the SAME IndexedDB, which is exactly what the next morning is. It is
     not a frozen clock and it is not a 24 hour wait. */
  const next = await reopen(kit.indexedDB, kit.scope, NEXT_DAY);
  const loaded = await next.era.generation();
  const adopted = admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: PHONE.setup.athlete_label, namespace: kit.scope.namespace });
  assert.notEqual(adopted, null, 'the page did not adopt the admitted import');
  for (const ex of FILE.exercises) {
    const landed = adopted.exercises.find(e => e.id === ex.id);
    assert.equal(landed.sets, ex.sets, ex.id + ': the adopted basis is the FILE\'s');
    assert.equal(landed.hi, ex.hi, ex.id + ': the adopted rep target is the FILE\'s');
  }

  /* THE BOOTED PAGE'S OWN CARD, FIRST (review R1 note 2, closed in the fix
     round). Note 2 is right that the block below opens a host this cell chose
     the basis for, which proves the engine and the file but not the page's
     adoption chain. This reads the card the PAGE is holding: today-entry.mjs
     boot() built the workout entry, today-app.cjs:2482 athleteBasisState()
     asked local-source-basis.mjs whether an admitted import stands, adoptBasis
     took it and gym.rebase() reopened the card's host on it. Nothing is passed
     in here: no basis, no host, no day. A read prepares and mints nothing, so
     it runs before the block below rather than after its Start. */
  assert.ok(next.booted.workout, 'the page booted without a workout entry');
  const pageCard = await next.booted.workout.gym.read();
  assert.equal(pageCard.phase, 'ready',
    'the page\'s own card would not prepare on the adopted basis: '
    + (pageCard.code || pageCard.phase));
  assert.equal(pageCard.total, sumSets(FILE, 'U'),
    'the page\'s own card prescribed ' + pageCard.total + ' sets; the FILE says '
    + sumSets(FILE, 'U') + '. The adoption chain did not carry the file through');

  /* THE GYM CARD, through the real host and the real engine, on the adopted
     basis: 2026-09-18 is the Friday the file's own split map calls U, and the
     card prescribes the FILE's number of sets, not the document's. */
  const open = on => next.era.createGymHost({ day: on, engineState: adopted,
    plannedSplitSlotId: 'earned-today-preview/' + on });
  const gymHost = await open(NEXT_DAY);
  const gym = createGymModel({ gymHost, sessionTitle: null, hostForDay: open });
  const ready = await gym.read();
  assert.equal(ready.phase, 'ready',
    'the gym card would not prepare on the file\'s split: ' + (ready.code || ready.phase));
  const started = await gym.start();
  assert.equal(started.ok, true, 'the start was refused: ' + (started.code || started.copy));
  const card = await gym.read();
  assert.equal(card.total, sumSets(FILE, 'U'),
    'the card prescribed ' + card.total + ' sets; the FILE says ' + sumSets(FILE, 'U'));
  assert.notEqual(sumSets(FILE, 'U'), sumSets(PHONE.setup, 'U'),
    'the two documents must disagree, or this assertion proves nothing');
  gymHost.close();

  /* THE COMPANION DOES NOT REFUSE (spec 1.6, finding 1 executed). The REAL
     admitted generation, the REAL first-run document this installation wrote,
     and the REAL local-source-basis.mjs join, on the local-source branch. */
  const origin = Object.values(loaded.generation.collections.ops)
    .find(op => op.payload?.profile === 'earned/first-run-setup/v1');
  const projector = createPlanEditProjector({ basisState: adopted, setupOperation: origin,
    validateTags, projectNewExerciseTags: projectNewTags, hashBasis,
    basisSource: 'local-source',
    admittedBasisOf: g => admittedLocalSourceBasis(g,
      { athleteLabel: PHONE.setup.athlete_label, namespace: kit.scope.namespace }) });
  const plan = projector.read(loaded.generation, NEXT_DAY);
  for (const ex of FILE.exercises) {
    const row = plan.state.exercises.find(e => e.id === ex.id);
    assert.equal(row.sets, ex.sets, ex.id + ': the plan the companion reads is the FILE\'s');
    assert.equal(row.hi, ex.hi);
  }
  next.close();
});

/* CELL (g). THE REFUSAL SENTENCE RENDERS. Read off the real screen, verbatim. */
async function refusedOn(tag, sealed) {
  const kit = await phone(tag);
  const before = await durable(kit.era);
  const reviewed = await toReview(kit.win, kit.booted, sealed);
  assert.equal(reviewed.step(), 'review', JSON.stringify(reviewed.refusal()));
  const at = await afterTap(kit.booted, slot(kit.doc, 'import-confirm'));
  const line = slot(kit.doc, 'import-refusal').textContent;
  const after = await durable(kit.era);
  assert.equal(after.ops, before.ops, 'an operation was minted');
  assert.equal(after.applied, false);
  assert.equal(after.basis, false);
  assert.equal(at.step(), 'pick', 'the picker was not reset');
  const taken = await listImportRetractions(kit.era.client);
  assert.equal(taken.length, 1);
  assert.equal(taken[0].reason, 'review-refused');
  kit.close();
  return { refusal: at.refusal(), line };
}

test('D-PF-g1 - a lift on the wrong day renders its own field and lift id, with '
  + 'the one sentence under it and nothing else', async () => {
  const { refusal, line } = await refusedOn('render-day', WRONG_DAY_FILE);
  assert.deepEqual(refusal,
    { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', detail: 'day db-bench' },
    'the screen said something else: ' + JSON.stringify(refusal));
  /* The box the athlete reads is refusalLines().join(' ') (import-screen.mjs:420):
     the code line first, then the one sentence, and nothing else. */
  const rendered = Screen.refusalLines(refusal.code, refusal.detail).join(' ');
  assert.equal(line, rendered, 'the screen rendered something other than refusalLines()');
  assert.equal(rendered, 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED (day db-bench) '
    + 'This file was written by a different training week than the one you set '
    + 'up on this phone. Nothing on this phone was changed.');
  assert.equal(new RegExp('[\\u2013\\u2014]').test(rendered), false,
    'no en dash and no em dash reaches the athlete');
  assert.equal(/[0-9]/.test(rendered), false, 'no number reaches him');
  for (const secret of [String(PHONE.setup.athlete_label), FILE.split.from,
    String(FILE.exercises[0].sets), String(FILE.exercises[0].hi)])
    assert.equal(rendered.includes(secret), false, 'a value rode out on the refusal');
});

test('D-PF-g2 - a stranger\'s week renders (split.map) with no lift id', async () => {
  const { refusal, line } = await refusedOn('render-week', STRANGER_WEEK);
  assert.deepEqual(refusal,
    { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', detail: 'split.map' });
  const rendered = Screen.refusalLines(refusal.code, refusal.detail);
  assert.equal(line, rendered.join(' '));
  assert.equal(rendered[0], 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED (split.map)');
  assert.equal(rendered.length, 2, 'the code line and the one sentence');
  assert.equal(rendered[1], 'This file was written by a different training week '
    + 'than the one you set up on this phone. Nothing on this phone was changed.');
  assert.equal(/db-bench|lat-pulldown|leg-press/.test(rendered.join(' ')), false,
    'a week disagreement names no lift');
});
