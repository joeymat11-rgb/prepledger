/* P3-IMPORT-UI-2 - EVERY WAY THE DAY CAN GO WRONG, ON THE REAL ROUTE.

   Each cell measures the durable record before and after and compares the two:
   "nothing was written" is that comparison, never a claim. After custody has
   been taken, "nothing was written" means the retract path ran and every
   consumer reads the generation it read before the file was staged.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, durable, STRANGER_WEEK_SETUP,
  REPO, Entry, shellWindow, slot, tap, type, textOf, pickBundle, installTraps,
  phoneDevice, SOURCE_SESSION_DAYS } from './support.mjs';
import { listImports, listImportRetractions } from '../../../w6/local/browser-entry.mjs';
import { admittedLocalSourceState } from '../../today/local-source-basis.mjs';
/* P3-X9 (round 4) reads the column the Measure screen draws, the same way
   route.test.mjs's own admission cells read it. */
import { baselineWeeks } from '../../measure/measure-baseline.mjs';
import Screen from '../import-screen.mjs';

const SEALED = sealInventedBundle();
/* CHANGED by P3-PORT-FIX (spec 4.4). BEFORE: sealInventedBundle(STRANGER_SETUP).
   AFTER the new programme rule that bundle admits, because it varies only the
   athlete label (compared by neither rule) and one lift's set count (RETAINED
   from the file). STRANGER_WEEK_SETUP varies the split MAP as well, which is
   what a stranger's bundle looks like to the rule as it now stands. */
const STRANGER = sealInventedBundle(STRANGER_WEEK_SETUP);
const DAY = '2026-09-16', AT = '2026-09-16T16:00:00.000Z';
/* This athlete's own three lifts, which are the markers P3-X9 draws the
   baseline column over. */
const MARKERS = ['db-bench', 'lat-pulldown', 'leg-press'];

/* THE MEASURE LANE'S OWN OPERATIONS, by their class, so "the import left them
   alone" is a comparison of what is on disk and not a claim. */
async function opsOfClass(era, wanted) {
  const loaded = await era.generation();
  return Object.values(loaded.generation.collections.ops || {})
    .filter(op => op.class === wanted).map(op => op.op_id).sort();
}

const scope = tag => ({ databaseName: 'p3x-' + tag, namespace: 'joe/p3x-' + tag,
  athleteId: 'ath-p3x', deviceId: 'dev-p3x' });

async function device(tag, { enrolled = true } = {}) {
  const era = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(AT), ...scope(tag) });
  if (enrolled) await firstRun(era, DAY);
  const win = shellWindow();
  const booted = await Entry.boot({ document: win.document, hosts: era, now: liveAt(AT) });
  await booted.api.ready;
  return { era, win, doc: win.document, booted };
}

/* EVERYTHING A CONSUMER CAN SEE, so "as if the file had never been staged" is
   four independent reads and not one. */
async function consumers(era, booted) {
  return { durable: await durable(era),
    imports: (await listImports(era.client)).map(e => e.name).sort(),
    retractions: (await listImportRetractions(era.client)).map(r => r.name).sort(),
    basis: await admittedLocalSourceState(booted.setup) };
}

async function afterTap(booted, node) {
  tap(node);
  const screen = booted.api.importScreen();
  if (screen) await screen.settled();
  await booted.api.render('import', false);
  return booted.api.importScreen();
}

/* The route, opened straight from Today's own render rather than through the
   Measure screen: these cells are about what happens ON it, and P3-U1 already
   proves the Measure link is the door. */
async function openRoute(booted) {
  await booted.api.render('import', true);
  return booted.api.importScreen();
}

async function toIdentity(win, booted, sealed, { passphrase = sealed.passphrase, bytes = sealed.bytes } = {}) {
  const doc = win.document;
  await openRoute(booted);
  pickBundle(win, doc.getElementById('import-file'), bytes);
  await booted.api.render('import', false);
  type(doc.getElementById('import-passphrase'), passphrase);
  return afterTap(booted, slot(doc, 'import-unlock'));
}

test('P3-X1 (bar c) - a WRONG PASSPHRASE shows BUNDLE_AUTH_FAILED and the one '
  + 'honest sentence, writes nothing, and keeps the draft', async () => {
  const { era, win, doc, booted } = await device('wrong-words');
  const before = await consumers(era, booted);
  const screen = await toIdentity(win, booted, SEALED, { passphrase: 'these are not the six words' });
  assert.deepEqual(screen.refusal(), { code: 'BUNDLE_AUTH_FAILED', detail: null });
  const painted = textOf(doc);
  assert.ok(painted.includes('BUNDLE_AUTH_FAILED'), 'the machinery\'s own code is not on the screen');
  assert.ok(painted.includes(Screen.COPY.authFailed), 'the one honest sentence is missing');
  assert.equal(screen.step(), 'words', 'the draft was thrown away');
  assert.equal(doc.getElementById('import-passphrase').value, 'these are not the six words',
    'what he typed was cleared out from under him');
  assert.ok(textOf(doc).includes('earned-port-2026-09-16.json'), 'the file he picked was forgotten');
  assert.deepEqual(await consumers(era, booted), before, 'the device is not exactly as it was');
  booted.rollover.stop(); booted.teardown(); era.close();
});

test('P3-X2 (bar c) - ONE FLIPPED BYTE gets the SAME code and writes nothing',
  async () => {
    const { era, win, doc, booted } = await device('flipped');
    const before = await consumers(era, booted);
    const bytes = Uint8Array.from(SEALED.bytes);
    const at = Math.floor(bytes.length / 2);
    bytes[at] = bytes[at] ^ 0x01;
    const screen = await toIdentity(win, booted, SEALED, { bytes });
    assert.equal(screen.refusal().code, 'BUNDLE_AUTH_FAILED',
      'one code for every structural and key failure, by design');
    assert.ok(textOf(doc).includes(Screen.COPY.authFailed));
    assert.deepEqual(await consumers(era, booted), before);
    booted.rollover.stop(); booted.teardown(); era.close();
  });

test('P3-X3 (bar d) - IDENTITY NO writes nothing at all: custody has not been '
  + 'taken yet, which is why the question is asked first', async () => {
  const { era, win, doc, booted } = await device('identity-no');
  const before = await consumers(era, booted);
  const screen = await toIdentity(win, booted, SEALED);
  assert.equal(screen.step(), 'identity');
  assert.equal(slot(doc, 'import-identity-question').textContent, Screen.IDENTITY_QUESTION);
  assert.deepEqual(await consumers(era, booted), before, 'unsealing wrote something');
  const after = await afterTap(booted, slot(doc, 'import-identity-no'));
  assert.equal(after.step(), 'pick');
  assert.ok(textOf(doc).includes(Screen.COPY.cancelled));
  assert.deepEqual(await consumers(era, booted), before, 'a No left something behind');
  assert.equal(after.custody(), null, 'custody was taken for a file he said No to');
  booted.rollover.stop(); booted.teardown(); era.close();
});

test('P3-X4 (bar d) - a CANCEL AFTER CUSTODY retracts: every consumer reads the '
  + 'generation it read before the file was staged, and the retract register '
  + 'keeps the history', async () => {
  const { era, win, doc, booted } = await device('cancel');
  const before = await consumers(era, booted);
  await toIdentity(win, booted, SEALED);
  const staged = await afterTap(booted, slot(doc, 'import-identity-yes'));
  assert.equal(staged.step(), 'review', JSON.stringify(staged.refusal()));
  const name = staged.custody().name;
  assert.deepEqual((await consumers(era, booted)).imports, [name], 'custody did not stage the file');
  /* The Back control on the review screen IS the cancel, because there is
     nothing else it could honestly be once custody has been taken. */
  const cancelled = await afterTap(booted, slot(doc, 'import-back'));
  assert.equal(cancelled.refusal(), null, JSON.stringify(cancelled.refusal()));
  const after = await consumers(era, booted);
  assert.deepEqual(after.imports, before.imports, 'the entry is still live');
  assert.equal(after.durable.ops, before.durable.ops, 'an operation was minted');
  assert.equal(after.durable.outbox, before.durable.outbox);
  assert.equal(after.durable.applied, false, 'a basis was committed');
  assert.equal(after.durable.basis, false);
  assert.equal(after.basis, before.basis, 'local-source-basis sees an import');
  assert.deepEqual(after.retractions, [name], 'nothing was deleted, so the register must hold it');
  booted.rollover.stop(); booted.teardown(); era.close();
});

test('P3-X5 (bar d) - ANOTHER ATHLETE\'S FILE: the controller\'s refusal shown '
  + 'VERBATIM, the file retracted, nothing left behind', async () => {
  const { era, win, doc, booted } = await device('stranger');
  const before = await consumers(era, booted);
  await toIdentity(win, booted, STRANGER);
  const reviewed = await afterTap(booted, slot(doc, 'import-identity-yes'));
  /* The programme check can bite at review or at prepare depending on what the
     file carries; either way the code on the screen is the machinery's own. */
  const at = reviewed.step() === 'review'
    ? await afterTap(booted, slot(doc, 'import-confirm')) : reviewed;
  assert.equal(at.refusal().code, 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    'the screen invented a code: ' + JSON.stringify(at.refusal()));
  assert.ok(textOf(doc).includes('LOCAL_SOURCE_PROGRAMME_UNRESOLVED'),
    'the machinery\'s own word is not on the screen');
  /* CHANGED by P3-PORT-FIX (spec 3.2). BEFORE: this asserted the code reached
     him with NO sentence beside it, which was true and was the defect the
     diagnosis named: a fresh-start owner whose own history was refused read a
     bare LOCAL_SOURCE_PROGRAMME_UNRESOLVED and nothing a person can act on.
     AFTER: exactly one sentence, in plain English, with no value from the file
     in it and no en dash or em dash. The rest of this cell is unchanged. */
  assert.equal(Screen.REFUSAL_SENTENCE.LOCAL_SOURCE_PROGRAMME_UNRESOLVED,
    'This file was written by a different training week than the one you set '
    + 'up on this phone. Nothing on this phone was changed.',
    'the one sentence this code reaches him with');
  assert.ok(textOf(doc).includes('Nothing on this phone was changed'),
    'the sentence is not on the screen');
  const after = await consumers(era, booted);
  assert.deepEqual(after.imports, before.imports, 'the refused file is still staged');
  assert.equal(after.durable.applied, false);
  assert.equal(after.durable.basis, false);
  assert.equal(after.durable.ops, before.durable.ops);
  assert.equal(after.retractions.length, 1, 'the refused file was not retracted');
  booted.rollover.stop(); booted.teardown(); era.close();
});

test('P3-X6 (bar d, DECISIONS:477 carry) - a retract the machinery REFUSES for a '
  + 'seeded sibling shows its code and leaves the entry visible in the summary',
  async () => {
    /* A device with no operations at all: an import onto it is SEEDED, and it
       seeds the derived cache. Two of them, and retracting either would wipe a
       cache the other seeded - which is the guard P3-D-FOLLOWONS (b) added. */
    const { era, win, doc, booted } = await device('seeded', { enrolled: false });
    const machinery = await import('../../../w6/local/browser-entry.mjs');
    const first = await machinery.importBundle(era.client,
      { bundleBytes: SEALED.bytes, passphrase: SEALED.passphrase });
    assert.equal(first.code, 'LOCAL_IMPORT_SEEDED', JSON.stringify(first));
    await toIdentity(win, booted, STRANGER);
    const at = await afterTap(booted, slot(doc, 'import-identity-yes'));
    const refused = at.step() === 'review' ? await afterTap(booted, slot(doc, 'import-confirm')) : at;
    assert.equal(refused.refusal().code, 'LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN',
      'the seeded-sibling guard did not bite: ' + JSON.stringify(refused.refusal()));
    assert.ok(textOf(doc).includes('LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN'));
    assert.ok(textOf(doc).includes(Screen.COPY.retractRefused));
    const live = (await listImports(era.client)).map(e => e.name).sort();
    assert.equal(live.length, 2, 'the entry that could not be taken back was hidden anyway');
    for (const name of live) assert.ok(textOf(doc).includes(name),
      'the summary does not still list ' + name);
    booted.rollover.stop(); booted.teardown(); era.close();
  });

test('P3-X7 (bar g) - THE TRAPS: fetch, XMLHttpRequest, navigator.share, '
  + 'window.open, URL.createObjectURL and a download click never fire, across '
  + 'the whole successful sequence', async () => {
  const { era, win, doc, booted } = await device('traps');
  const traps = installTraps(win);
  await toIdentity(win, booted, SEALED);
  await afterTap(booted, slot(doc, 'import-identity-yes'));
  const done = await afterTap(booted, slot(doc, 'import-confirm'));
  assert.equal(done.step(), 'done', JSON.stringify(done.refusal()));
  assert.deepEqual(traps.fired(), [], 'the route reached for the network or the OS');
  /* And no anchor with a download attribute was ever built at all. */
  assert.equal(doc.querySelectorAll('a[download]').length, 0);
  assert.equal(doc.querySelectorAll('a[href]').length, 0, 'the route wrote an address down');
  booted.rollover.stop(); booted.teardown(); era.close();
});

test('P3-X8 (bar h) - THE COPY CENSUS: no em or en dash anywhere the athlete '
  + 'reads, and the two inputs are 16 px with every keyboard helper off',
  async () => {
  const { era, win, doc, booted } = await device('census');
  const dash = /[–—]/;
  for (const [key, value] of Object.entries(Screen.COPY))
    assert.ok(!dash.test(value), 'an AI dash in COPY.' + key);
  assert.ok(!dash.test(Screen.IDENTITY_QUESTION), 'an AI dash in the identity question');
  await openRoute(booted);
  assert.ok(!dash.test(textOf(doc)), 'an AI dash on the painted Import screen');
  const file = doc.getElementById('import-file');
  assert.equal(file.accept, '.json');
  assert.equal(file.previousElementSibling.textContent, Screen.COPY.pickLabel);
  pickBundle(win, file, SEALED.bytes);
  await booted.api.render('import', false);
  const words = doc.getElementById('import-passphrase');
  assert.equal(words.getAttribute('autocapitalize'), 'off');
  assert.equal(words.getAttribute('autocorrect'), 'off');
  assert.equal(words.getAttribute('autocomplete'), 'off');
  assert.equal(words.spellcheck, false);
  const css = fs.readFileSync(REPO + 'rebuild/m3/w7-preview/today/preview.css', 'utf8');
  assert.match(css, /\[data-slot="import-screen"\] input \{ font-size: 16px; min-height: 48px; \}/);
  assert.match(css, /\[data-slot="import-screen"\] button \{ min-height: 44px; \}/);
  assert.match(css, /\[data-slot="import-entry"\] \{ min-height: 44px; \}/);
  booted.rollover.stop(); booted.teardown(); era.close();
});

/* P3-X9 AND P3-X10, RE-REASONED INTO ONE POSITIVE CELL (round 4, the ticket's
   step 4). THE NEW REASON IS WRITTEN WHERE THE OLD ASSERTION STOOD, and the old
   assertion is named so nobody has to go looking for it in the history.

   WHAT THE PAIR USED TO ASSERT, and why it was right on its base: on a phone
   there is ONE IndexedDB, so the measure lane (gym-host.mjs openTodayHosts, the
   SAME database and namespace the page's own installation uses) writes its
   trial-start operations - two before the screen paints anything, a third when
   the markers pick is answered, all of class body-composition-source - into the
   very generation admission replays. The S3 replay had no family for that class,
   so source-admission.mjs:148 answered LOCAL_SOURCE_CONTEXT_UNRESOLVED and the
   import refused. P3-X9 pinned that refusal from Today's render and P3-X10 from
   the Measure link itself, and both said in as many words that they would go RED
   the day the lane learned the family, and that whoever taught it must come back
   here and say so.

   IT HAS BEEN TAUGHT. P3-REPLAY-MEASURE-FAMILY landed the F7 family
   (rebuild/m4/import/measure-replay.cjs, origin/rebuild/d-p3-replay-measure
   47a223d, which this branch is now rebased onto), and Measure-then-import
   ADMITS on one store. So the two refusal cells are not merely stale, their
   subject is gone: there is no collision left to assert. They become the ONE
   positive cell below, which walks the very sequence they refused - the phone's
   own IDBFactory and installation through gym-host.mjs openTodayHosts, the first
   run saved, Measure LOOKED AT until its markers pick paints, and only then the
   tap on "Import my history" - and proves it admits and that the measure lane's
   own record is untouched by the import that crossed it.

   The old cells' one claim that still matters is kept and asserted below: the
   route leaves the measure operations exactly as it found them, and trial day
   one - the device's own first entry, which has nothing to do with any import -
   still reads what it read before. */
test('P3-X9 - MEASURE FIRST, THEN IMPORT, ON ONE STORE: the athlete opens '
  + 'Measure, taps Import my history on it and the whole walk ADMITS; Today, '
  + 'the gym card and the baseline column carry his history and the measure '
  + 'operations are untouched', async () => {
  const phone = await phoneDevice({ at: AT, day: DAY });
  const doc = phone.doc;
  /* MEASURE, LOOKED AT - rendered and settled until the markers pick is on the
     screen, which is what "the athlete opened Measure" costs the generation. */
  await phone.booted.api.render('measure', true);
  for (let guard = 0; guard < 40 && !slot(doc, 'measure-marker-pick'); guard++) {
    await new Promise(resolve => setTimeout(resolve, 1));
    await phone.booted.api.render('measure', false);
  }
  assert.ok(slot(doc, 'measure-marker-pick'), 'the markers pick never painted');
  const before = await consumers(phone.era, phone.booted);
  assert.ok(before.durable.ops > 1,
    'opening Measure wrote nothing, so this cell measures nothing');
  const measureOps = await opsOfClass(phone.era, 'body-composition-source');
  assert.ok(measureOps.length >= 2, 'the measure lane wrote no operations: ' + measureOps.length);
  const trialBefore = slot(doc, 'measure-trial-start') && slot(doc, 'measure-trial-start').textContent;
  /* THE TAP, on the link the measure screen carries. */
  const link = slot(doc, 'import-entry');
  assert.ok(link, 'the Measure screen offers no Import link');
  assert.equal(link.textContent, Screen.COPY.entryNew);
  tap(link);
  await phone.booted.api.render('import', false);
  assert.equal(phone.booted.api.screen(), 'import', 'the Measure link opened nothing');
  /* PICK, WORDS, UNLOCK, YES, CONFIRM - every step tapped, nothing called. */
  pickBundle(phone.win, doc.getElementById('import-file'), SEALED.bytes);
  await phone.booted.api.render('import', false);
  type(doc.getElementById('import-passphrase'), SEALED.passphrase);
  await afterTap(phone.booted, slot(doc, 'import-unlock'));
  assert.equal(slot(doc, 'import-identity-question').textContent, Screen.IDENTITY_QUESTION);
  const reviewing = await afterTap(phone.booted, slot(doc, 'import-identity-yes'));
  assert.equal(reviewing.step(), 'review',
    'the identity Yes refused: ' + JSON.stringify(reviewing.refusal()));
  const admitted = await afterTap(phone.booted, slot(doc, 'import-confirm'));
  assert.equal(admitted.refusal(), null,
    'Measure-then-import refuses again; the F7 family is the thing to look at: '
    + JSON.stringify(admitted.refusal()));
  assert.equal(admitted.step(), 'done');
  assert.ok(textOf(doc).includes(Screen.COPY.done));
  /* AND WHAT HE HAS NOW. The basis is his file's, on Today and on the gym card;
     the baseline column the Measure screen draws has weeks in it where it had
     none; the measure lane's own operations are the ones it wrote, unchanged;
     and trial day one has not moved. */
  const after = await consumers(phone.era, phone.booted);
  assert.equal(after.durable.applied, true, 'no basis was committed');
  assert.equal(after.durable.basis, true);
  assert.equal(after.durable.ops, before.durable.ops, 'the import minted an operation');
  assert.deepEqual(after.retractions, before.retractions, 'something was taken back');
  assert.deepEqual(await opsOfClass(phone.era, 'body-composition-source'), measureOps,
    'the import moved the measure lane\'s own operations');
  const basis = phone.booted.model.basisState();
  assert.deepEqual(basis.exercises.map(e => [e.id, e.w]),
    [['db-bench', 45], ['lat-pulldown', 80], ['leg-press', 120]], 'the import is not the basis');
  assert.deepEqual(Object.keys(basis.sessionLog).sort(), SOURCE_SESSION_DAYS);
  const card = JSON.stringify(await phone.booted.workout.gym.read());
  for (const mark of ['demo-press', 'demo-row', 'demo-leg', 'demo-curl'])
    assert.ok(!card.includes(mark), 'a fixture lift is on the gym card: ' + mark);
  const weeks = await baselineWeeks(phone.booted.setup, DAY, 8, MARKERS, phone.booted.model.engine);
  assert.ok(weeks.length > 0, 'the measure baseline column still reads No baseline yet');
  /* BACK ON THE MEASURE SCREEN ITSELF. */
  await phone.booted.api.render('measure', true);
  for (let guard = 0; guard < 40 && !slot(doc, 'import-entry'); guard++) {
    await new Promise(resolve => setTimeout(resolve, 1));
    await phone.booted.api.render('measure', false);
  }
  assert.equal(slot(doc, 'import-entry').textContent, Screen.COPY.entryDone,
    'the Measure link still offers an import that has already happened');
  const trialAfter = slot(doc, 'measure-trial-start') && slot(doc, 'measure-trial-start').textContent;
  assert.equal(trialAfter, trialBefore, 'trial day one moved');
  phone.close();
});



/* P3-X10, RE-REASONED IN ROUND 4 (review r3 MAJOR 2). WHAT IT USED TO ASSERT:
   the Measure link, tapped on one store, refusing LOCAL_SOURCE_CONTEXT_UNRESOLVED.
   That refusal is gone with the F7 family and the tap from that link is now
   P3-X9's, positive, above. THE NUMBER KEEPS ITS PLACE and takes the defect the
   final review found in its stead, which is the other thing an athlete can do
   from this route and could not until now.

   THE DEFECT: a file that will not unlock - six words mistyped, or the file
   itself damaged - refuses at the words step, and the screen kept the file and
   the refusal with it. There was no control anywhere that offered him ANOTHER
   file: Back left the cached screen standing on the same step with the same
   stale refusal, the link painted that again, and only a page reload got him
   out. For a damaged file that is not a recoverable state at all, and the
   runbook's "retype and try again" was advice he could not take.

   THE RULE NOW: Back without custody, and every later tap on the entry link,
   reset this route to the chooser and drop the bytes. Executed here end to end,
   in ONE page session: a damaged file refuses, and the very next thing he does
   is pick a good one and admit. */
test('P3-X10 - A DAMAGED FILE THEN A GOOD ONE, IN ONE PAGE SESSION: the refusal '
  + 'does not trap him on the words step, and no reload is needed', async () => {
  const phone = await phoneDevice({ at: AT, day: DAY });
  const doc = phone.doc;
  const before = await consumers(phone.era, phone.booted);
  await phone.booted.api.render('today', true);
  const link = slot(doc, 'import-entry');
  assert.ok(link, 'Today offers no Import link');
  tap(link);
  await phone.booted.api.render('import', false);
  /* THE DAMAGED FILE: the right six words, one byte flipped. */
  const damaged = Uint8Array.from(SEALED.bytes);
  const at = Math.floor(damaged.length / 2);
  damaged[at] = damaged[at] ^ 0x01;
  pickBundle(phone.win, doc.getElementById('import-file'), damaged, 'earned-port-damaged.json');
  await phone.booted.api.render('import', false);
  type(doc.getElementById('import-passphrase'), SEALED.passphrase);
  const refused = await afterTap(phone.booted, slot(doc, 'import-unlock'));
  assert.equal(refused.refusal().code, 'BUNDLE_AUTH_FAILED');
  assert.equal(refused.step(), 'words', 'the draft is dropped before he can retype');
  assert.deepEqual(await consumers(phone.era, phone.booted), before,
    'a file that never unlocked wrote something');
  /* BACK, WITH NO CUSTODY: out of the route, and the draft goes with him. The
     tap is taken bare - afterTap re-renders the import screen, which is exactly
     what this tap must NOT end on. */
  tap(slot(doc, 'import-back'));
  await phone.booted.api.importScreen().settled();
  assert.equal(phone.booted.api.screen(), 'today', 'Back did not leave the route');
  const screen = phone.booted.api.importScreen();
  assert.equal(screen.step(), 'pick', 'the screen still stands on the refused step');
  assert.equal(screen.refusal(), null, 'the refusal is still standing over a new attempt');
  assert.equal(screen.holdingBytes(), false, 'the damaged file is still in the closure');
  /* AND BACK IN, on the same page, through the same link. */
  tap(slot(doc, 'import-entry'));
  await phone.booted.api.render('import', false);
  assert.ok(doc.getElementById('import-file'), 'the route did not reopen on the chooser');
  assert.equal(slot(doc, 'import-refusal'), null,
    'the stale refusal is painted over the new attempt: ' + textOf(doc));
  assert.equal(textOf(doc).includes('earned-port-damaged.json'), false,
    'the damaged file is still named on the screen');
  /* THE GOOD FILE, and the whole walk, with no reload anywhere above. */
  pickBundle(phone.win, doc.getElementById('import-file'), SEALED.bytes);
  await phone.booted.api.render('import', false);
  type(doc.getElementById('import-passphrase'), SEALED.passphrase);
  await afterTap(phone.booted, slot(doc, 'import-unlock'));
  await afterTap(phone.booted, slot(doc, 'import-identity-yes'));
  const admitted = await afterTap(phone.booted, slot(doc, 'import-confirm'));
  assert.equal(admitted.refusal(), null,
    'the second file refused: ' + JSON.stringify(admitted.refusal()));
  assert.equal(admitted.step(), 'done');
  const after = await consumers(phone.era, phone.booted);
  assert.equal(after.durable.applied, true, 'no basis was committed');
  assert.equal(after.imports.length, 1, 'the damaged file took custody too: ' + after.imports);
  assert.deepEqual(after.retractions, [],
    'a file that never unlocked cost him a retraction record');
  /* AND THE BYTES ARE GONE once the work is done (review r3 NOTE): nothing that
     was in that file is still in this closure. */
  assert.equal(admitted.holdingBytes(), false, 'the admitted bundle is still in the closure');
  phone.close();
});

/* P3-X11 (round 4, review r3 MINOR 3). A refusal at the confirm step used to be
   painted with "Working." still beside it, because confirm() sets that note
   before it calls the machinery and only success or a refused retract cleared
   it. The athlete was told the code AND that something was still happening. */
test('P3-X11 - NO STALE "Working." BESIDE A REFUSAL: the note that said work '
  + 'was in flight goes when the work stops', async () => {
  const phone = await phoneDevice({ at: AT, day: DAY });
  const doc = phone.doc;
  await phone.booted.api.render('today', true);
  tap(slot(doc, 'import-entry'));
  await phone.booted.api.render('import', false);
  /* ANOTHER ATHLETE'S FILE, which is refused at the confirm - the one step that
     paints the note. */
  pickBundle(phone.win, doc.getElementById('import-file'), STRANGER.bytes);
  await phone.booted.api.render('import', false);
  type(doc.getElementById('import-passphrase'), STRANGER.passphrase);
  await afterTap(phone.booted, slot(doc, 'import-unlock'));
  const reviewing = await afterTap(phone.booted, slot(doc, 'import-identity-yes'));
  const refused = reviewing.step() === 'review'
    ? await afterTap(phone.booted, slot(doc, 'import-confirm')) : reviewing;
  assert.equal(refused.refusal().code, 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    JSON.stringify(refused.refusal()));
  /* CHANGED by P3-PORT-FIX (spec 3.2, 3.3). BEFORE: the box held the bare code.
     AFTER: the code line carries WHICH field disagreed, and the one sentence is
     under it. This cell is about the stale "Working." note, so it asserts the
     box is exactly what refusalLines() builds and leaves the wording to the
     cells that own it.
     CHANGED AGAIN by P3-PORT-FIX-2's fix round (review R1 NOTE 1): the screen
     carries the LEADING issue's field beside the code and the detail, and hands
     refusalLines() all three, so the sentence describes the fault the code line
     leads with. The box is asserted against that same three argument call. */
  /* RE-POINTED by P3-REAL-SHAPE (DECISIONS:521). The stranger's bundle carries
     a stranger's NAME as well as a stranger's week, and P-LABEL is now tested
     BEFORE anything per lift and before the week (spec 2.3, review R1 N9), so
     the leading field is `athlete_label` and its own sentence is under it. The
     SUBJECT of this cell - that the stale "Working." note goes when the work
     stops - is untouched, and so is the shape it asserts: the box is exactly
     what refusalLines() builds from the three arguments the screen hands it. */
  assert.equal(refused.refusal().field, 'athlete_label',
    'the screen did not carry the leading issue\'s field: '
    + JSON.stringify(refused.refusal()));
  assert.equal(slot(doc, 'import-refusal').textContent,
    Screen.refusalLines(refused.refusal().code, refused.refusal().detail,
      refused.refusal().field).join(' '));
  assert.ok(slot(doc, 'import-refusal').textContent
    .startsWith('LOCAL_SOURCE_PROGRAMME_UNRESOLVED (athlete_label)'));
  const note = slot(doc, 'import-note');
  assert.equal(Boolean(note && note.textContent === Screen.COPY.working), false,
    'the refusal is painted with "Working." beside it');
  assert.equal(textOf(doc).includes(Screen.COPY.working), false,
    '"Working." is still on the screen after everything stopped: ' + textOf(doc));
  phone.close();
});
