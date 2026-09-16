/* P3-IMPORT-UI-2 - EVERY WAY THE DAY CAN GO WRONG, ON THE REAL ROUTE.

   Each cell measures the durable record before and after and compares the two:
   "nothing was written" is that comparison, never a claim. After custody has
   been taken, "nothing was written" means the retract path ran and every
   consumer reads the generation it read before the file was staged.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, durable, STRANGER_SETUP,
  REPO, Entry, shellWindow, slot, tap, type, textOf, pickBundle, installTraps,
  phoneDevice } from './support.mjs';
import { listImports, listImportRetractions } from '../../../w6/local/browser-entry.mjs';
import { admittedLocalSourceState } from '../../today/local-source-basis.mjs';
import Screen from '../import-screen.mjs';

const SEALED = sealInventedBundle();
const STRANGER = sealInventedBundle(STRANGER_SETUP);
const DAY = '2026-09-16', AT = '2026-09-16T16:00:00.000Z';

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
  assert.equal(Screen.REFUSAL_SENTENCE.LOCAL_SOURCE_PROGRAMME_UNRESOLVED, undefined,
    'a sentence was invented for a code that already says what it means');
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

/* THE FINDING THE REAL-EDGE RUN MADE, PINNED SO IT CANNOT BE FORGOTTEN.

   On a phone there is ONE IndexedDB, so the measure lane (measure-host.mjs
   openTodayHosts, the SAME database and namespace the page's own installation
   uses) writes its trial-start operation into the very generation admission
   replays. The S3 replay maps six families and has none for that operation, so
   it raises LOCAL_SOURCE_CONTEXT_UNRESOLVED and the import refuses - and the
   route then retracts, so nothing is left behind, which is the only part of
   this that is this ticket's to own.

   THIS CELL ASSERTS THE CURRENT, HONEST BEHAVIOUR, not a behaviour anyone
   wants. It is written to go RED the day the import lane learns the measure
   family, and whoever teaches it must come back here and say so. It is also
   why P3-U1 and P3-U2 hand the measure lane a SEPARATE IDBFactory: those cells
   are about the route, and this one is about the collision.

   ROUND 2 (review r1 finding 1) measured what "opening Measure" costs: the
   first render writes TWO earned/measure-trial-start/v1 operations before the
   screen paints anything, and the markers pick adds a third of
   earned/measure-markers/v1. All three are class body-composition-source, and
   source-admission.mjs:148 is where an operation of a class the replay has no
   family for becomes LOCAL_SOURCE_CONTEXT_UNRESOLVED. So the Measure entry
   cannot admit on any phone, ever, until lane D teaches that family - which is
   why the entry that CAN admit is on Today (today-app.cjs renderToday, P3-U6)
   and why this pair of cells stands beside it rather than instead of it.

   Not fixed here: adding a family to rebuild/m4/import's replay is a change to
   the admission stack, which is lane D's and is not an author's fix. Open item
   1 of rebuild/lanes/c/P3-IMPORT-UI-2-AUTHOR-REPORT.md. */
test('P3-X9 - OPENING MEASURE FIRST makes the import refuse '
  + 'LOCAL_SOURCE_CONTEXT_UNRESOLVED, and the route still leaves nothing behind',
  async () => {
    const indexedDB = new IDBFactory();
    const win = shellWindow();
    /* ONE store AND ONE INSTALLATION, as a phone has: this opens the very
       installation gym-host.mjs openTodayHosts opens - the default database,
       namespace and athlete - so the measure lane's own openTodayHosts call
       lands in the SAME generation rather than beside it. */
    Object.defineProperty(win, 'indexedDB', { configurable: true, value: indexedDB });
    const { openTodayHosts } = await import('../../today/gym-host.mjs');
    const era = await openTodayHosts({ indexedDB, crypto: win.crypto, live: liveAt(AT) });
    await firstRun(era, DAY);
    const booted = await Entry.boot({ document: win.document, hosts: era, now: liveAt(AT) });
    await booted.api.ready;
    const doc = win.document;
    for (let guard = 0; guard < 40 && !slot(doc, 'measure-marker-pick'); guard++) {
      await booted.api.render('measure', false);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
    const before = await consumers(era, booted);
    assert.ok(before.durable.ops > 1, 'the measure lane wrote nothing, so this cell measures nothing');
    await toIdentity(win, booted, SEALED);
    const at = await afterTap(booted, slot(doc, 'import-identity-yes'));
    const refused = at.step() === 'review' ? await afterTap(booted, slot(doc, 'import-confirm')) : at;
    assert.equal(refused.refusal().code, 'LOCAL_SOURCE_CONTEXT_UNRESOLVED',
      'the collision is gone; re-reason this cell and say so: ' + JSON.stringify(refused.refusal()));
    const after = await consumers(era, booted);
    assert.deepEqual(after.imports, before.imports, 'the refused file is still staged');
    assert.equal(after.durable.ops, before.durable.ops, 'an operation was minted');
    assert.equal(after.durable.applied, false);
    assert.equal(after.retractions.length, 1, 'the refused file was not retracted');
    booted.rollover.stop(); booted.teardown(); era.close();
  });

/* P3-X10 (round 2, review r1 finding 1). P3-X9 opens the route from Today's own
   render; the reviewer's objection was that nothing anywhere took the tap from
   the LINK ON MEASURE on a phone's configuration, so the entry itself was
   untested where it matters. This cell taps that link and nothing else, and
   pins BOTH halves of what the athlete gets: the refusal, verbatim and printed
   ONCE, and a device left exactly as it was found. It goes RED the day the
   admission replay learns the measure family - and on that day the link works,
   which is the outcome everyone wants. */
test('P3-X10 - THE MEASURE LINK ITSELF, tapped on ONE store: the route refuses '
  + 'LOCAL_SOURCE_CONTEXT_UNRESOLVED and the device is unchanged', async () => {
  const phone = await phoneDevice({ at: AT, day: DAY });
  const doc = phone.doc;
  /* Waited on the markers pick, not on the link: the link is painted on the
     measure screen's FIRST frame, before the lane's own store has answered, and
     a cell that tapped it there would be testing the race rather than the
     athlete's day. */
  await phone.booted.api.render('measure', true);
  for (let guard = 0; guard < 40 && !slot(doc, 'measure-marker-pick'); guard++) {
    await new Promise(resolve => setTimeout(resolve, 1));
    await phone.booted.api.render('measure', false);
  }
  const link = slot(doc, 'import-entry');
  assert.ok(link, 'the Measure screen offers no Import link');
  const before = await consumers(phone.era, phone.booted);
  assert.ok(before.durable.ops > 1,
    'opening Measure wrote nothing, so this cell measures nothing');
  tap(link);
  await phone.booted.api.render('import', false);
  assert.equal(phone.booted.api.screen(), 'import', 'the Measure link opened nothing');
  pickBundle(phone.win, doc.getElementById('import-file'), SEALED.bytes);
  await phone.booted.api.render('import', false);
  type(doc.getElementById('import-passphrase'), SEALED.passphrase);
  await afterTap(phone.booted, slot(doc, 'import-unlock'));
  const at = await afterTap(phone.booted, slot(doc, 'import-identity-yes'));
  const refused = at.step() === 'review'
    ? await afterTap(phone.booted, slot(doc, 'import-confirm')) : at;
  assert.equal(refused.refusal().code, 'LOCAL_SOURCE_CONTEXT_UNRESOLVED',
    'the collision is gone; re-reason this cell and say so: ' + JSON.stringify(refused.refusal()));
  /* Printed ONCE (review r1 finding 4), not as CODE (CODE). */
  assert.equal(slot(doc, 'import-refusal').textContent, 'LOCAL_SOURCE_CONTEXT_UNRESOLVED');
  const after = await consumers(phone.era, phone.booted);
  assert.deepEqual(after.imports, before.imports, 'the refused file is still staged');
  assert.equal(after.durable.ops, before.durable.ops, 'an operation was minted');
  assert.equal(after.durable.applied, false);
  assert.deepEqual(after.basis, before.basis, 'a basis was committed');
  assert.equal(after.retractions.length, before.retractions.length + 1,
    'the refused file was not retracted');
  phone.close();
});
