/* P3-IMPORT-UI-2 - THE REAL TAP SEQUENCE, on the REAL Today route.

   Nothing here mounts the Import screen by hand. Each cell boots the shipped
   page (today-entry.mjs boot() into design.shellHtml(), over fake-indexeddb and
   the real encrypted repository), taps an entry link the page painted, and then
   taps its way through the route the athlete taps: pick, the six words, Unlock,
   the identity question, the review, the confirm.

   ROUND 2 (review r1 finding 1): P3-U5 and P3-U6 open the page the way a PHONE
   has it - ONE IDBFactory and ONE installation, gym-host.mjs's own - and it is
   those two that carry bar (a). The cells above them keep a second store for
   the measure lane and say so where they use it.

   The bundle is SYNTHETIC and sealed by the real port.cjs from the PUBLIC
   journey fixture through the accepted clean-init constructor. See ./support.mjs:
   no private fixture, no ledger and no owner data is reachable from here.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, durable, SETUP,
  STRANGER_WEEK_SETUP, Entry, shellWindow, slot, tap, type, textOf, pickBundle,
  phoneDevice } from './support.mjs';
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

/* THE MEASURE SCREEN, driven the way the athlete drives it, because one of the
   two entry links sits on ITS "No baseline yet" line. Then the markers pick -
   the screen that stands before the comparison until a pick exists - is
   answered with three of this athlete's own lifts.

   THE SEPARATE IDBFactory HERE IS NOT A PHONE'S CONFIGURATION, and round 2 says
   so out loud (review r1 finding 1). It isolates the measure lane's operations
   from the generation admission replays, which is what lets the cells below be
   about the ROUTE. What an athlete's phone actually does with ONE store is
   executed by P3-U6 (from the Today link, which admits), by P3-X10 (from THIS
   link, which refuses LOCAL_SOURCE_CONTEXT_UNRESOLVED and retracts) and by
   P3-X9; none of them uses this helper. */
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
  + 'the summary lists the import, and THE ROUTE opens no second import door at '
  + 'all - on this page session or a fresh one; the machinery behind that door '
  + 'answers the rebase code, verbatim', async () => {
  const { era, win, doc, booted, indexedDB } = await admitsOn('second', SUMMER);
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

  /* THE SECOND ATTEMPT, ANSWERED AT THE ROUTE FIRST (round 4, review r2 MINOR
     5). The reviewer's objection was exact: round 2 proved this bar by calling
     browser-entry.importBundle, which is the machinery and not the route, so
     the ROUTE-level claim stood unexecuted. Here it is, executed, and it is a
     stronger answer than a code: after admission there is no second import door
     on this route to refuse anything. Both entry links paint the read-only
     summary, neither opens a chooser, and the assertion below is the ABSENCE of
     every control a second attempt would need - on this page session and on a
     fresh one opened over the same store, which is the configuration an athlete
     comes back to tomorrow.

     What the machinery answers BEHIND that closed door is kept underneath,
     labelled as the machinery's answer and not the screen's, because it is what
     any future second door would have to paint. */
  assert.equal(doc.getElementById('import-file'), null,
    'the route offers a chooser to a device that has already admitted');
  assert.equal(textOf(doc).includes(Screen.COPY.pickLabel), false,
    'the pick step is painted after admission');
  assert.equal(slot(doc, 'import-unlock'), null, 'the words step is reachable after admission');
  await booted.api.render('today', true);
  const todayLink = slot(doc, 'import-entry');
  assert.equal(todayLink.textContent, Screen.COPY.entryDone,
    'the Today link still offers an import that has already happened');
  tap(todayLink);
  await booted.api.render('import', false);
  assert.equal(doc.getElementById('import-file'), null,
    'the Today link opens a chooser on a device that has already admitted');
  assert.ok(textOf(doc).includes(Screen.COPY.summaryHead), 'it opened no summary either');

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
  /* CHANGED by P3-PORT-FIX (spec 4.4, and review R2 NOTE N-2). BEFORE:
     sealInventedBundle(STRANGER_SETUP). This cell asserts
     LOCAL_IMPORT_REBASE_REQUIRED, which the machinery answers BEFORE any
     programme comparison, so it does not go red under the new rule; the seal
     line is retargeted only so the fixture story stays straight across the
     suites that share it. */
  const other = sealInventedBundle(STRANGER_WEEK_SETUP);
  const third = await machinery.importBundle(era.client,
    { bundleBytes: other.bytes, passphrase: other.passphrase });
  assert.equal(third.rebaseRequired, true, JSON.stringify(third));
  assert.equal(third.code, 'LOCAL_IMPORT_REBASE_REQUIRED',
    'the machinery\'s own code for a file arriving onto a device that already has operations');
  booted.rollover.stop(); booted.teardown(); era.close();

  /* AND TOMORROW'S PAGE (round 4, review r2 MINOR 4 as well as MINOR 5). A
     FRESH page session over the SAME store: the FIRST Today frame reads
     "History imported" and never the offer, because the entry is not painted
     until the adoption chain has answered - the stale first frame the reviewer
     measured is what this asserts is gone - and the route it opens still has no
     chooser on it. */
  const again = await eraFor({ indexedDB, ...scope('second'), live: liveAt(SUMMER.at) });
  const tomorrow = await openPage(again, SUMMER);
  await tomorrow.booted.api.render('today', true);
  const firstFrame = slot(tomorrow.doc, 'import-entry');
  assert.ok(firstFrame, 'the reopened Today frame offers no entry at all');
  assert.equal(firstFrame.textContent, Screen.COPY.entryDone,
    'the FIRST Today frame of a reopened admitted device offers the import again');
  tap(firstFrame);
  await tomorrow.booted.api.render('import', false);
  assert.equal(tomorrow.doc.getElementById('import-file'), null,
    'a reopened page offers a second import door');
  assert.ok(textOf(tomorrow.doc).includes(Screen.COPY.summaryHead));
  tomorrow.booted.rollover.stop(); tomorrow.booted.teardown(); again.close();
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

/* P3-U5, RESTATED IN ROUND 2 (review r1 finding 1). WHAT IT USED TO SAY: the
   second entry link is on setup's LAST screen and on no earlier one. That was
   true and it was a trap, and the reason is written here rather than left as a
   deletion: on setup's last screen the athlete's first run has NOT been saved,
   so the installation holds no first-run operation, source-admission.mjs
   programme() finds no setup document, and the walk refuses
   LOCAL_SOURCE_PROGRAMME_UNRESOLVED after taking custody. THE NEW RULE, wider
   than the old one because it covers every setup screen and the Today screen
   too: no setup screen offers the route at all, and "from setup's end"
   (DECISIONS:470) is served on the screen setup ends on - Today, on the very
   frame the first run lands.

   ROUND 4, REVIEW R3 MAJOR 1, AND THE RED SIDE MOVED TO WHERE THE TRAP WAS.
   Round 2 left the Today link ungated, so the trap it had just removed from
   setup's last screen was still standing on the screen setup's Back lands on -
   and on a fresh install, before S6-C's setup-first, that is the FIRST screen an
   athlete sees. So this cell's red side is no longer "setup's last screen": it
   is the UNENROLLED TODAY FRAME, where it belongs. What it proves, in order:
   the unenrolled Today paints NO entry; no setup screen does either; no control
   anywhere on that page can reach the route; and the walk that link would have
   started is executed once, forced open, to show exactly what the gate is
   worth - custody taken and then refused, with a permanent retraction record
   left on a device whose owner did nothing wrong. Then the green side: the
   moment the first run is saved, Today offers it and it opens the route.
   (DECISIONS:480 RULING 1 as the PM amended it in round 4: both entries gated
   on an enrolled installation, no entry at setup's end.) */
test('P3-U5 - THE UNENROLLED INSTALLATION IS OFFERED NO ROUTE AT ALL: not on '
  + 'Today, not on any setup screen, and the walk it would have started can '
  + 'only take custody and refuse; the entry appears the moment the first run '
  + 'is saved', async () => {
  const fresh = await phoneDevice({ at: SUMMER.at, day: SUMMER.day, firstRun: false });
  const doc = fresh.doc, model = fresh.booted.setup.setup;
  assert.equal(fresh.booted.setup.firstRun(), true, 'this installation is not fresh');
  /* THE TODAY FRAME AN UNENROLLED INSTALLATION SHOWS - the screen setup's Back
     lands on, and the first screen of a fresh install on this branch. */
  await fresh.booted.api.render('today', true);
  assert.equal(fresh.booted.api.screen(), 'today', 'the page did not go to Today');
  assert.equal(slot(doc, 'import-entry'), null,
    'the unenrolled Today frame offers the import: ' + textOf(doc));
  assert.equal(textOf(doc).includes(Screen.COPY.entryNew), false,
    'the two words are painted on the unenrolled Today frame by something else');
  for (let screen = 1; screen <= 6; screen++) {
    model.goto(screen);
    await fresh.booted.api.render('setup', false);
    assert.equal(slot(doc, 'import-entry'), null, 'the link is on setup screen ' + screen);
  }
  /* AND NOTHING ELSE ON THE UNENROLLED PAGE REACHES THE ROUTE. The two entry
     links are the only controls that ever call render("import"), so with both
     withheld an unenrolled walk cannot start at all: there is no painted
     control on Today whose route is the Import screen. */
  await fresh.booted.api.render('today', true);
  assert.deepEqual([...doc.querySelectorAll('[data-go="import"]')], [],
    'something on the unenrolled Today frame routes to the import');
  /* WHAT THE GATE IS WORTH, executed rather than argued: the route forced open
     the way no painted control can open it, walked with a good file, takes
     custody and then refuses - and the retraction that costs him is permanent.
     This is the whole reason the frame above carries no link. */
  const before = await durable(fresh.era);
  await fresh.booted.api.render('import', true);
  const refused = await walkFromHere(fresh.win, fresh.booted, SEALED);
  assert.equal(refused.refusal().code, 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    'an unenrolled walk admits after all, so the gate above is arguing against '
    + 'the machinery: ' + JSON.stringify(refused.refusal()));
  /* THE COST, named: the file was taken into custody before it could be
     refused, and the record of taking it back is permanent. No athlete should
     be able to reach this, which is what the withheld link above means. */
  assert.equal(fresh.booted.api.importScreen().retractions().length, 1,
    'the forced walk did not even reach custody, so this cell measures nothing');
  /* "Nothing was written" means every consumer reads what it read before. The
     REVISION is the one number that moves and must: retract deletes nothing, so
     the custody commit and the retraction record are both still on disk
     (P3-IMPORT-RETRACT, DECISIONS:477), and a revision that had gone back would
     mean something had been erased. */
  const after = await durable(fresh.era);
  assert.deepEqual({ ...after, revision: null }, { ...before, revision: null },
    'the refused walk left something behind');
  assert.equal(after.revision, before.revision + 2,
    'the custody commit and its retraction are not both on disk: ' + after.revision);
  /* AND FINDING 4: the painted refusal prints the code ONCE.
     CHANGED by P3-PORT-FIX (spec 3.2, 3.3). BEFORE: the bare code. AFTER: the
     code once, carrying the field that refused, then the one sentence. On an
     UNENROLLED installation the field is `setup_document`, because this phone
     holds no first-run document at all, and that is exactly what the screen now
     says. The build report raises as an open question for the PM whether the
     sentence, which speaks of a training week the athlete set up, is the right
     one for a phone that has not been set up at all; changing it needs a second
     sentence and this spec rules exactly one. */
  const box = slot(doc, 'import-refusal').textContent;
  assert.ok(box.startsWith('LOCAL_SOURCE_PROGRAMME_UNRESOLVED (setup_document)'), box);
  assert.equal(box.split('LOCAL_SOURCE_PROGRAMME_UNRESOLVED').length - 1, 1,
    'the code is printed more than once: ' + box);
  fresh.close();

  /* THE GREEN SIDE: the same words, on Today, the moment the first run exists. */
  const enrolled = await phoneDevice({ at: SUMMER.at, day: SUMMER.day });
  await enrolled.booted.api.render('today', true);
  const link = slot(enrolled.doc, 'import-entry');
  assert.ok(link, 'Today offers no Import link');
  assert.equal(link.textContent, Screen.COPY.entryNew);
  tap(link);
  await enrolled.booted.api.render('import', false);
  assert.equal(enrolled.booted.api.screen(), 'import', 'the link opened nothing');
  assert.ok(textOf(enrolled.doc).includes(Screen.COPY.pickLabel),
    'it opened something other than the route');
  enrolled.close();
});

/* ONE TAP AT A TIME from wherever the route is already open. Shared by the
   phone-configuration cells below so each of them differs only in WHERE the
   athlete tapped. */
async function walkFromHere(win, booted, sealed) {
  const doc = win.document;
  pickBundle(win, doc.getElementById('import-file'), sealed.bytes);
  await booted.api.render('import', false);
  type(doc.getElementById('import-passphrase'), sealed.passphrase);
  await afterTap(booted, slot(doc, 'import-unlock'));
  await afterTap(booted, slot(doc, 'import-identity-yes'));
  const confirm = slot(doc, 'import-confirm');
  return confirm ? afterTap(booted, confirm) : booted.api.importScreen();
}

/* BAR (a), ON THE CONFIGURATION A PHONE HAS (round 2, review r1 finding 1).
   ONE IDBFactory, ONE installation - gym-host.mjs's own openTodayHosts with its
   own defaults, which is the installation the measure lane opens too - a first
   run, and then the athlete taps the link on Today and walks the whole sequence.
   No second store anywhere, and no helper hands the page a store the phone does
   not have. This is the cell bar (a) is judged by. */
test('P3-U6 (bar a, ONE STORE) - on the phone\'s own installation the athlete '
  + 'taps Import on Today and the whole sequence ADMITS', async () => {
  const phone = await phoneDevice({ at: SUMMER.at, day: SUMMER.day });
  const doc = phone.doc;
  const before = await durable(phone.era);
  assert.equal(before.ops, 1, 'this installation holds more than its first run: ' + before.ops);
  await phone.booted.api.render('today', true);
  const link = slot(doc, 'import-entry');
  assert.ok(link, 'Today offers no Import link');
  tap(link);
  await phone.booted.api.render('import', false);
  const screen = await walkFromHere(phone.win, phone.booted, SEALED);
  assert.equal(screen.refusal(), null, 'the route refused: ' + JSON.stringify(screen.refusal()));
  assert.equal(screen.step(), 'done');
  assert.ok(textOf(doc).includes(Screen.COPY.done));
  const after = await durable(phone.era);
  assert.equal(after.applied, true, 'no basis was committed');
  assert.equal(after.basis, true);
  assert.equal(after.ops, before.ops, 'admission minted an operation of its own');
  assert.deepEqual(after.rebaseRequired, []);
  /* AND THE ATHLETE'S OWN STATE, adopted: Today and the gym card stand on the
     loads the file carried, not on the fixture's. */
  const basis = phone.booted.model.basisState();
  assert.deepEqual(basis.exercises.map(e => [e.id, e.w]),
    [['db-bench', 45], ['lat-pulldown', 80], ['leg-press', 120]], 'the import is not the basis');
  /* FINDING 7: re-entering the route hands back the summary, not the sentence
     that belongs to the import he just confirmed. */
  await phone.booted.api.render('today', true);
  tap(slot(doc, 'import-entry'));
  await phone.booted.api.render('import', false);
  const text = textOf(doc);
  assert.ok(text.includes(Screen.COPY.summaryHead), 're-opening shows no summary');
  assert.equal(text.includes(Screen.COPY.done), false,
    're-opening still shows the done sentence: ' + text);
  assert.equal(slot(doc, 'import-entry'), null, 'the route paints an entry link of its own');
  phone.close();
});
