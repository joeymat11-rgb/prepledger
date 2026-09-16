/* P3-IMPORT-UI-2 - THE REAL TAP SEQUENCE, on the REAL Today route.

   Nothing here mounts the Import screen by hand. Each cell boots the shipped
   page (today-entry.mjs boot() into design.shellHtml(), over fake-indexeddb and
   the real encrypted repository), taps the entry link the Measure screen shows,
   and then taps its way through the route the athlete taps: pick, the six
   words, Unlock, the identity question, the review, the confirm.

   The bundle is SYNTHETIC and sealed by the real port.cjs from the PUBLIC
   journey fixture through the accepted clean-init constructor. See ./support.mjs:
   no private fixture, no ledger and no owner data is reachable from here.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, durable, SETUP,
  STRANGER_SETUP, Entry, shellWindow, slot, tap, type, textOf, pickBundle } from './support.mjs';
import { baselineWeeks } from '../../measure/measure-baseline.mjs';
import Screen from '../import-screen.mjs';

const SEALED = sealInventedBundle();
const SUMMER = { day: '2026-09-16', at: '2026-09-16T16:00:00.000Z', offset: '-04:00' };
const WINTER = { day: '2026-11-20', at: '2026-11-20T16:00:00.000Z', offset: '-05:00' };
const MARKERS = ['db-bench', 'lat-pulldown', 'leg-press'];

const scope = tag => ({ databaseName: 'p3u-' + tag, namespace: 'joe/p3u-' + tag,
  athleteId: 'ath-p3u', deviceId: 'dev-p3u' });

async function device(tag, when) {
  const names = scope(tag);
  const indexedDB = new IDBFactory();
  const era = await eraFor({ indexedDB, live: liveAt(when.at), ...names });
  await firstRun(era, when.day);
  return { era, names, indexedDB };
}

/* THE SHIPPED PAGE, on the device's own live clock. No declared day: boot()
   resolves it from the instant, which is the whole point of the S4 live path. */
async function openPage(era, when) {
  const win = shellWindow();
  const booted = await Entry.boot({ document: win.document, hosts: era, now: liveAt(when.at) });
  await booted.api.ready;
  return { win, doc: win.document, booted };
}

/* THE MEASURE SCREEN, driven the way the athlete drives it, because the entry
   link this ticket adds sits on ITS "No baseline yet" line. jsdom gives the page
   no IndexedDB of its own, so the measure lane is handed one here (it opens its
   own database, exactly as it does on a phone) and then the markers pick - the
   screen that stands before the comparison until a pick exists - is answered
   with three of this athlete's own lifts. */
async function openMeasure(win, booted, { pick = true } = {}) {
  const doc = win.document;
  if (!win.indexedDB) Object.defineProperty(win, 'indexedDB',
    { configurable: true, value: new IDBFactory() });
  await booted.api.render('measure', true);
  const settle = async (wanted) => {
    for (let guard = 0; guard < 40 && !slot(doc, wanted); guard++) {
      await new Promise(resolve => setTimeout(resolve, 1));
      await booted.api.render('measure', false);
    }
    return slot(doc, wanted);
  };
  const form = await settle('measure-marker-pick');
  if (form && pick) {
    const boxes = [...doc.querySelectorAll('[data-slot="measure-marker-option"]')].slice(0, 3);
    for (const box of boxes) { box.checked = true; box.dispatchEvent(new win.Event('change', { bubbles: true })); }
    form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
    await settle('measure-baseline-note');
  }
  const trial = slot(doc, 'measure-trial-start');
  return { note: slot(doc, 'measure-baseline-note'), link: slot(doc, 'import-entry'),
    markers: [...doc.querySelectorAll('[data-slot="measure-marker-option"]')].map(b => b.value),
    trialStart: trial ? trial.textContent : null };
}

/* ONE TAP, then everything that tap started, then the repaint it asked for.
   `settled()` is the screen's own handle on the work in flight; the explicit
   re-render afterwards is what makes the assertion read the painted screen and
   not a frame that was still being built. */
async function afterTap(booted, node) {
  tap(node);
  const screen = booted.api.importScreen();
  if (screen) await screen.settled();
  await booted.api.render('import', false);
  return booted.api.importScreen();
}

/* THE WHOLE SEQUENCE, in the athlete's own order, from the Measure entry link.
   Every step returns what it painted so a cell can assert on the way through. */
async function walkTheRoute(win, booted, sealed, { answer = 'yes', stopAt = null } = {}) {
  const doc = win.document;
  const measure = await openMeasure(win, booted);
  const entry = measure.link;
  assert.ok(entry, 'the Measure screen offers no Import link');
  assert.ok(measure.note, 'the Measure screen painted no baseline line to put it on');
  assert.equal(measure.note.nextElementSibling, entry,
    'the link is not on the No baseline yet line');
  tap(entry);
  await booted.api.render('import', false);
  const seen = { entryLabel: entry.textContent };
  if (stopAt === 'entry') return seen;
  pickBundle(win, doc.getElementById('import-file'), sealed.bytes);
  await booted.api.render('import', false);
  type(doc.getElementById('import-passphrase'), sealed.passphrase === undefined ? '' : sealed.passphrase);
  seen.screen = await afterTap(booted, slot(doc, 'import-unlock'));
  if (stopAt === 'unlock') return seen;
  seen.identityQuestion = slot(doc, 'import-identity-question')
    && slot(doc, 'import-identity-question').textContent;
  seen.screen = await afterTap(booted, slot(doc, 'import-identity-' + answer));
  if (stopAt === 'identity') return seen;
  seen.reviewQuestion = slot(doc, 'import-review-question')
    && slot(doc, 'import-review-question').textContent;
  seen.reviewText = textOf(doc);
  seen.screen = await afterTap(booted, slot(doc, 'import-confirm'));
  seen.measure = measure;
  return seen;
}

async function admitsOn(tag, when) {
  const { era, indexedDB } = await device(tag, when);
  const { win, doc, booted } = await openPage(era, when);
  const trialStart = when.day;
  /* BEFORE: the measure baseline column has nothing to draw. */
  assert.deepEqual(await baselineWeeks(booted.setup, trialStart, 8, MARKERS, booted.model.engine), [],
    'the measure baseline column has something in it before any import');
  const before = await durable(era);
  const seen = await walkTheRoute(win, booted, SEALED);
  assert.equal(seen.entryLabel, Screen.COPY.entryNew);
  assert.equal(seen.identityQuestion, Screen.IDENTITY_QUESTION);
  assert.equal(seen.reviewQuestion, Screen.IDENTITY_QUESTION,
    'the screen asked one question and the controller asked another');
  assert.ok(seen.reviewText.includes(Screen.COPY.confirm), 'the review carried no explicit confirm');
  assert.equal(seen.screen.refusal(), null, 'the route refused: ' + JSON.stringify(seen.screen.refusal()));
  assert.equal(seen.screen.step(), 'done');
  assert.ok(textOf(doc).includes(Screen.COPY.done));
  const after = await durable(era);
  assert.equal(after.applied, true, 'no basis was committed');
  assert.equal(after.basis, true);
  assert.deepEqual(after.rebaseRequired, [], 'admission is what clears it');
  assert.equal(after.ops, before.ops, 'admission minted an operation of its own');
  return { era, win, doc, booted, trialStart, after, indexedDB, seen };
}

test('P3-U1 (bar a) - ON A SUMMER DAY, with the live clock, the whole tap '
  + 'sequence admits and Today, the gym card and the measure baseline all '
  + 'stand on the imported history', async () => {
  const { era, win, doc, booted, trialStart, seen } = await admitsOn('summer', SUMMER);
  const basis = booted.model.basisState();
  assert.equal(basis.athlete_label, SETUP.athlete_label, 'Today stands on the fixture, not his record');
  assert.deepEqual(basis.exercises.map(e => [e.id, e.w]),
    [['db-bench', 45], ['lat-pulldown', 80], ['leg-press', 120]], 'the imported loads ARE the basis');
  assert.deepEqual(Object.keys(basis.sessionLog).sort(), ['2026-08-14', '2026-08-17', '2026-08-21']);
  /* THE GYM CARD. Whether this calendar day is a training day is the engine's
     business and not this ticket's, so the assertion is the one the import owns:
     nothing the fixture athlete carries is on the card, and when the card does
     have a lift in hand it is his own, prescribed from his IMPORTED load. */
  const card = await booted.workout.gym.read();
  const cardText = JSON.stringify(card);
  for (const mark of ['demo-press', 'demo-row', 'demo-leg', 'demo-curl'])
    assert.ok(!cardText.includes(mark), 'a fixture lift is on the gym card: ' + mark);
  if (card.phase === 'ready') {
    assert.equal(card.lift.id, 'db-bench', 'the card opens on a lift that is not his');
    assert.match(card.prescription.line, /^45 lb/, 'the card prescribes from the IMPORTED working load');
  }
  const baseline = await baselineWeeks(booted.setup, trialStart, 8, MARKERS, booted.model.engine);
  assert.ok(baseline.length > 0, 'the measure baseline column still reads No baseline yet');
  /* AND ON THE SCREEN. Re-open Measure after the import: the baseline note is
     hidden because there is now a baseline, the link has changed its words, and
     TRIAL DAY ONE - which is the device's own first entry and has nothing to do
     with the import - reads exactly what it read before. */
  const afterMeasure = await openMeasure(win, booted);
  assert.equal(afterMeasure.note.hidden, true, 'the No baseline yet line is still showing');
  assert.equal(afterMeasure.link.textContent, Screen.COPY.entryDone);
  assert.equal(afterMeasure.trialStart, seen.measure.trialStart, 'trial day one moved');
  assert.match(afterMeasure.trialStart, /Trial day one: 2026-09-16/);
  /* And the operation this installation wrote carries the SUMMER offset, which
     is the live clock doing its job (runbook pre-check 6, now on the page). */
  const ops = Object.values((await era.generation()).generation.collections.ops);
  assert.deepEqual([...new Set(ops.map(op => op.effective.utc_offset))], [SUMMER.offset]);
  booted.rollover.stop(); booted.teardown(); era.close();
});

test('P3-U2 (bar b) - the SAME tap sequence on a WINTER day', async () => {
  const { era, booted } = await admitsOn('winter', WINTER);
  assert.deepEqual(booted.model.basisState().exercises.map(e => e.w), [45, 80, 120]);
  const ops = Object.values((await era.generation()).generation.collections.ops);
  assert.deepEqual([...new Set(ops.map(op => op.effective.utc_offset))], [WINTER.offset]);
  booted.rollover.stop(); booted.teardown(); era.close();
});

test('P3-U3 (bar e) - after admission the entry links read History imported, '
  + 'the summary lists the import, and a SECOND file gets the machinery\'s own '
  + 'rebase code, verbatim', async () => {
  const { era, win, doc, booted } = await admitsOn('second', SUMMER);
  const measure = await openMeasure(win, booted);
  assert.equal(measure.link.textContent, Screen.COPY.entryDone,
    'the Measure link still offers an import that has already happened');
  assert.equal(booted.api.importAdmitted(), true);
  tap(measure.link);
  await booted.api.render('import', false);
  assert.ok(textOf(doc).includes(Screen.COPY.summaryHead), 'the read-only summary is not on the screen');
  const listed = booted.api.importScreen().imports();
  assert.equal(listed.length, 1, 'listImports says ' + listed.length);
  assert.ok(textOf(doc).includes(listed[0].name), 'the summary does not name the import');

  /* THE SECOND ATTEMPT. The screen after admission is read only, so the second
     file is taken to the machinery the way any other caller would take it, and
     what it answers is what a second attempt gets: the rebase code, verbatim,
     and no second basis. */
  const machinery = await import('../../../w6/local/browser-entry.mjs');
  const second = await machinery.importBundle(era.client,
    { bundleBytes: SEALED.bytes, passphrase: SEALED.passphrase });
  assert.equal(second.imported, false);
  assert.equal(second.code, 'LOCAL_IMPORT_ALREADY_PRESENT', 'the same file, again');
  /* A RE-PORT of the same ledger: the source hash, and so the derived name, is
     the one already taken, and the bundle is not the same bundle. This is the
     LOCAL_IMPORT_NAME_TAKEN case DECISIONS:477 carried to this ticket. */
  const rePort = sealInventedBundle();
  const named = await machinery.importBundle(era.client,
    { bundleBytes: rePort.bytes, passphrase: rePort.passphrase });
  assert.equal(named.imported, false);
  assert.equal(named.code, 'LOCAL_IMPORT_NAME_TAKEN', JSON.stringify(named));
  /* A DIFFERENT file: staged, and told it needs the review this device has
     already given another file. That is the rebase code, verbatim. */
  const other = sealInventedBundle(STRANGER_SETUP);
  const third = await machinery.importBundle(era.client,
    { bundleBytes: other.bytes, passphrase: other.passphrase });
  assert.equal(third.rebaseRequired, true, JSON.stringify(third));
  assert.equal(third.code, 'LOCAL_IMPORT_REBASE_REQUIRED',
    'the machinery\'s own code for a file arriving onto a device that already has operations');
  booted.rollover.stop(); booted.teardown(); era.close();
});

test('P3-U4 (bar f) - a NEW SET saved after the import, then dispose and reopen: '
  + 'the imported history and the set are both still there', async () => {
  /* On the WINTER day, because a set has to be savable for this cell to be
     about survival rather than about which weekday the engine calls a training
     day. The summer path is P3-U1's. */
  const { era, booted, indexedDB } = await admitsOn('reopen', WINTER);
  const gym = booted.workout.gym;
  const Effort = await import('../../today/gym-model.mjs');
  const opening = await gym.start();
  assert.equal(opening.ok, true, 'Start is refused after the import: ' + JSON.stringify(opening));
  /* The card's own loop, exactly as rebuild/m3/w6/test/local-source-consumer.test.mjs
     drives it: read, log, forget, until the session is complete. */
  let logged = 0;
  for (let guard = 0; guard < 12; guard++) {
    const view = await gym.read();
    if (view.phase === 'saved') { if (view.complete) break; gym.forget(); continue; }
    if (view.phase !== 'active') break;
    /* What the athlete types into the card. A fresh mount carries no draft, so
       the two boxes are empty and the figures below are HIS: the working load
       the import brought (45 lb on this lift) and eight reps. */
    const saved = await gym.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
      load: String(view.entry.load === null ? 45 : view.entry.load),
      reps: String(view.entry.reps === null ? 8 : view.entry.reps),
      effort: Effort.EFFORT_CHOICES[0].reserve });
    assert.equal(saved.ok, true, 'the set was refused: ' + saved.code + ' '
      + JSON.stringify({ set: view.set, entry: view.entry }));
    logged += 1;
    gym.forget();
  }
  assert.ok(logged > 0, 'no set was saved on top of the imported history');
  booted.rollover.stop(); booted.teardown(); era.close();

  const again = await eraFor({ indexedDB, ...scope('reopen'), live: liveAt(WINTER.at) });
  const reopened = await openPage(again, WINTER);
  const basis = reopened.booted.model.basisState();
  assert.deepEqual(basis.exercises.map(e => [e.id, e.w]),
    [['db-bench', 45], ['lat-pulldown', 80], ['leg-press', 120]], 'the imported history is gone');
  assert.deepEqual(Object.keys(basis.sessionLog).sort(), ['2026-08-14', '2026-08-17', '2026-08-21']);
  const ops = Object.values((await again.generation()).generation.collections.ops);
  assert.equal(ops.filter(op => op.kind === 'session-start').length, 1, 'the Start is not on disk');
  assert.ok(ops.some(op => op.class === 'session' && op.kind !== 'session-start'),
    'the saved set is not on disk: ' + JSON.stringify(ops.map(op => op.class + '/' + op.kind)));
  reopened.booted.rollover.stop(); reopened.booted.teardown(); again.close();
});

test('P3-U5 - THE SECOND ENTRY LINK, on setup\'s LAST screen and nowhere else, '
  + 'while no import is admitted', async () => {
  /* A FRESH INSTALLATION: no first run, so the setup route is the one the page
     will open. The screens before the last carry no link at all. */
  const indexedDB = new IDBFactory();
  const era = await eraFor({ indexedDB, live: liveAt(SUMMER.at), ...scope('setup-link') });
  const win = shellWindow();
  const booted = await Entry.boot({ document: win.document, hosts: era, now: liveAt(SUMMER.at) });
  await booted.api.ready;
  const doc = win.document;
  assert.equal(booted.setup.firstRun(), true, 'this installation is not fresh');
  const model = booted.setup.setup;
  for (let screen = 1; screen < 6; screen++) {
    model.goto(screen);
    await booted.api.render('setup', false);
    assert.equal(slot(doc, 'import-entry'), null, 'the link is on setup screen ' + screen);
  }
  model.goto(6);
  await booted.api.render('setup', false);
  const link = slot(doc, 'import-entry');
  assert.ok(link, 'setup\'s last screen offers no Import link');
  assert.equal(link.textContent, Screen.COPY.entryNew);
  tap(link);
  await booted.api.render('import', false);
  assert.equal(booted.api.screen(), 'import', 'the link opened nothing');
  assert.ok(textOf(doc).includes(Screen.COPY.pickLabel), 'it opened something other than the route');
  booted.rollover.stop(); booted.teardown(); era.close();
});
