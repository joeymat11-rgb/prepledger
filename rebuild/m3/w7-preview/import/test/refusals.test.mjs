/* P3-IMPORT-UI - THE REFUSALS AN IMPORT SCREEN WOULD HAVE TO SHOW VERBATIM.

   The screen itself is BLOCKED (see rebuild/lanes/c/P3-IMPORT-UI-AUTHOR-REPORT.md:
   the S3 admission controller cannot enter the shipped page bundle). What is not
   blocked, and is what any later screen has to be built against, is WHICH code
   the machinery answers with for each way the day can go wrong, and whether the
   device holds anything different afterwards.

   Every cell below measures the durable record before and after. "Nothing was
   written" is that comparison, never a claim.

   Everything here is SYNTHETIC. See ./support.mjs. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, durable, carry,
  admit, STRANGER_WEEK_SETUP } from './support.mjs';

const DAY = '2026-09-16', AT = '2026-09-16T16:00:00.000Z';
const SEALED = sealInventedBundle();
/* CHANGED by P3-PORT-FIX (spec 4.4). BEFORE: sealInventedBundle(STRANGER_SETUP),
   which varied the athlete label and one lift's set count. AFTER the new
   programme rule the label is compared by neither rule and the set count is
   RETAINED from the file, so that bundle ADMITS and this suite's refusal would
   have stopped being a refusal. STRANGER_WEEK_SETUP varies the split MAP as
   well as the label, which is what a stranger's bundle looks like to the rule
   as it now stands, and is a strict superset of what the old fixture proved. */
const STRANGER = sealInventedBundle(STRANGER_WEEK_SETUP);

const scope = tag => ({ databaseName: 'p3-refuse-' + tag, namespace: 'joe/p3r-' + tag,
  athleteId: 'ath-p3', deviceId: 'dev-p3' });

async function device(tag) {
  const names = scope(tag);
  const era = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(AT), ...names });
  await firstRun(era, DAY);
  return { era, names };
}

test('P3-R1 - a WRONG PASSPHRASE refuses BUNDLE_AUTH_FAILED and writes nothing',
  async () => {
    const { era } = await device('wrong-words');
    const before = await durable(era);
    const result = await carry(era, SEALED, { passphrase: 'these are not the six words' });
    assert.equal(result.carried.imported, false);
    assert.equal(result.carried.code, 'BUNDLE_AUTH_FAILED');
    assert.deepEqual(await durable(era), before, 'revision, ops, outbox and imports all unmoved');
    era.close();
  });

test('P3-R2 - ONE FLIPPED BYTE refuses with the SAME code and writes nothing',
  async () => {
    const { era } = await device('flipped-byte');
    const before = await durable(era);
    const tampered = { ...SEALED, bytes: Uint8Array.from(SEALED.bytes) };
    const at = Math.floor(tampered.bytes.length / 2);
    tampered.bytes[at] = tampered.bytes[at] ^ 0x01;
    const result = await carry(era, tampered);
    assert.equal(result.carried.imported, false);
    assert.equal(result.carried.code, 'BUNDLE_AUTH_FAILED',
      'one code for every structural and key failure, by design');
    assert.deepEqual(await durable(era), before);
    era.close();
  });

test('P3-R3 - the RIGHT words on the right file take custody, and the entry is '
  + 'reported as needing the rebase admission performs', async () => {
  const { era } = await device('custody');
  const before = await durable(era);
  const result = await carry(era, SEALED);
  assert.equal(result.carried.imported, true);
  assert.equal(result.carried.code, 'LOCAL_IMPORT_REBASE_REQUIRED',
    'an enrolled installation already carries its own first-run operation');
  const after = await durable(era);
  assert.equal(after.ops, before.ops, 'custody mints no operation of its own');
  assert.equal(after.outbox, before.outbox);
  assert.deepEqual(after.imports, [result.carried.name]);
  assert.deepEqual(after.rebaseRequired, [result.carried.name]);
  assert.equal(after.basis, false, 'custody is not admission: no basis yet');
  assert.equal(after.applied, false);
  era.close();
});

test('P3-R4 - ANOTHER ATHLETE\'S FILE is refused by the controller, by name, and '
  + 'no basis is committed', async () => {
  const { era, names } = await device('stranger');
  const before = await durable(era);
  const result = await admit(era, STRANGER, { day: DAY, ...names });
  assert.equal(result.admitted, false);
  assert.equal(result.stage, 'prepare');
  assert.deepEqual([...new Set(result.codes)], ['LOCAL_SOURCE_PROGRAMME_UNRESOLVED'],
    'the file\'s week is not the week this installation\'s first run recorded');
  const after = await durable(era);
  assert.equal(after.basis, false, 'nothing became this athlete\'s basis');
  assert.equal(after.applied, false);
  assert.equal(after.ops, before.ops, 'and no operation was minted');
  assert.equal(after.outbox, before.outbox);
  era.close();
});

test('P3-R5 - a SECOND attempt at the same file is a named no-op, not a second '
  + 'import', async () => {
  const { era } = await device('repeat');
  const first = await carry(era, SEALED);
  assert.equal(first.carried.imported, true);
  const after = await durable(era);
  const second = await carry(era, SEALED);
  assert.equal(second.carried.imported, false);
  assert.equal(second.carried.code, 'LOCAL_IMPORT_ALREADY_PRESENT');
  assert.deepEqual(await durable(era), after, 'the device is exactly as the first left it');
  era.close();
});

test('P3-R6 - after ADMISSION the entry no longer asks for a rebase and the basis '
  + 'is committed once', async () => {
  const { era, names } = await device('admitted');
  const result = await admit(era, SEALED, { day: DAY, ...names });
  assert.equal(result.admitted, true);
  const after = await durable(era);
  assert.deepEqual(after.rebaseRequired, [], 'admission is what clears it');
  assert.deepEqual(after.imports, [result.name]);
  assert.equal(after.applied, true);
  assert.equal(after.basis, true);
  era.close();
});
