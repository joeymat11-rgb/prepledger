/* P3-PORT-REFUSAL (lane D, DIAGNOSIS). THE OWNER'S PATH THROUGH THE SHIPPED
   PAGE, on ONE IndexedDB.

   Nothing here is mounted by hand: the page is design.shellHtml() with
   today-entry.mjs boot() over the real encrypted repository, and the route is
   opened and tapped the way he taps it - pick, the six words, Unlock, the
   identity question, the review, the confirm. The producer registry is the
   PRODUCTION one, because that is the one the screen builds.

   Day one is the day setup was completed; the import is the NEXT day, with the
   era reopened on that day exactly as reopening the app does.

   SYNTHETIC ONLY: the bundle is sealed by the real port.cjs from the PUBLIC
   journey fixture. No private fixture, no ledger, no owner file.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, eraFor, liveAt, durable, SETUP, TAGS,
  Entry, shellWindow, slot, tap, type, textOf, pickBundle }
  from '../../../m3/w7-preview/import/test/support.mjs';
import { listImportRetractions } from '../../../m3/w6/local/browser-entry.mjs';
import Setup from '../../../m3/w7-preview/today/setup-commands.mjs';
import Screen from '../../../m3/w7-preview/import/import-screen.mjs';

const SETUP_DAY = '2026-09-16', IMPORT_DAY = '2026-09-17';
const AT = day => day + 'T16:00:00.000Z';
const clone = value => JSON.parse(JSON.stringify(value));
const FILE_SETUP = clone(SETUP);
const PHONE_SETUP = clone(SETUP);
PHONE_SETUP.split = { from: SETUP_DAY, map: clone(SETUP.split.map) };
const SEALED = sealInventedBundle(FILE_SETUP);

const scopeFor = tag => ({ databaseName: 'p3-prr-' + tag, namespace: 'joe/p3-prr-' + tag,
  athleteId: 'ath-p3-prr', deviceId: 'dev-p3-prr' });

/* ONE PHONE: one IDBFactory, setup completed on day one and the page reopened
   on day two, which is when he imports. */
async function phone(tag, setup) {
  const indexedDB = new IDBFactory();
  const scope = scopeFor(tag);
  const first = await eraFor({ indexedDB, live: liveAt(AT(SETUP_DAY)), ...scope });
  const host = await first.createSetupHost({ day: SETUP_DAY,
    commands: Setup.createSetupCommands(), profile: Setup.PROFILE });
  const saved = await host.save({ setup, tags: TAGS });
  host.close();
  assert.equal(saved.ok, true, 'the first run was refused: ' + (saved.code || saved.copy));
  first.close();
  const era = await eraFor({ indexedDB, live: liveAt(AT(IMPORT_DAY)), ...scope });
  const win = shellWindow();
  Object.defineProperty(win, 'indexedDB', { configurable: true, value: indexedDB });
  const booted = await Entry.boot({ document: win.document, hosts: era,
    now: liveAt(AT(IMPORT_DAY)) });
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

async function toReview(win, booted) {
  const doc = win.document;
  await booted.api.render('import', true);
  pickBundle(win, doc.getElementById('import-file'), SEALED.bytes);
  await booted.api.render('import', false);
  type(doc.getElementById('import-passphrase'), SEALED.passphrase);
  const unlocked = await afterTap(booted, slot(doc, 'import-unlock'));
  assert.equal(unlocked.step(), 'identity', JSON.stringify(unlocked.refusal()));
  return afterTap(booted, slot(doc, 'import-identity-yes'));
}

/* WHAT HE SAW, reproduced: Unlock succeeds, the review screen paints, the
   confirm refuses by name, the picker is back and one entry stands under
   "Files you took back" with the reason label review-refused. */
test('D-PRR-1 (the owner\'s screen) - a fresh-start phone set up yesterday '
  + 'refuses his own history at CONFIRM with LOCAL_SOURCE_PROGRAMME_UNRESOLVED, '
  + 'retracts, and writes nothing', async () => {
  const kit = await phone('owner', PHONE_SETUP);
  const before = await durable(kit.era);
  const reviewed = await toReview(kit.win, kit.booted);
  assert.equal(reviewed.step(), 'review',
    'the unseal or the review refused: ' + JSON.stringify(reviewed.refusal()));
  assert.equal(reviewed.refusal(), null, 'the review itself refused');
  const at = await afterTap(kit.booted, slot(kit.doc, 'import-confirm'));
  assert.deepEqual(at.refusal(),
    { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', detail: null },
    'the screen said something else: ' + JSON.stringify(at.refusal()));
  assert.equal(slot(kit.doc, 'import-refusal').textContent,
    'LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
  assert.equal(Screen.REFUSAL_SENTENCE.LOCAL_SOURCE_PROGRAMME_UNRESOLVED, undefined,
    'the code reaches him with no sentence of any kind beside it');
  assert.equal(at.step(), 'pick', 'the picker was not reset');
  assert.ok(textOf(kit.doc).includes(Screen.COPY.retractionsHead));
  const taken = await listImportRetractions(kit.era.client);
  assert.equal(taken.length, 1, 'one file taken back');
  assert.equal(taken[0].reason, Screen.RETRACT_REASON.refused);
  assert.equal(taken[0].reason, 'review-refused');
  const after = await durable(kit.era);
  assert.equal(after.ops, before.ops, 'an operation was minted');
  assert.equal(after.applied, false);
  assert.equal(after.basis, false);
  kit.close();
});

/* THE SAME PAGE, THE SAME FILE, THE SAME TAPS: the only change is that the
   phone's setup document carries the file's own start date. */
test('D-PRR-2 (the green variant) - the same route ADMITS when the phone\'s '
  + 'setup document carries the file\'s programme', async () => {
  const kit = await phone('green', FILE_SETUP);
  const reviewed = await toReview(kit.win, kit.booted);
  assert.equal(reviewed.step(), 'review', JSON.stringify(reviewed.refusal()));
  const at = await afterTap(kit.booted, slot(kit.doc, 'import-confirm'));
  assert.equal(at.refusal(), null,
    'the matching programme was refused: ' + JSON.stringify(at.refusal()));
  assert.equal(at.step(), 'done');
  assert.equal((await durable(kit.era)).applied, true);
  kit.close();
});
