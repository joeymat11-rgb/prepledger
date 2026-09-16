/* P3-IMPORT-UI - THE LIVE CLOCK IS WHAT MAKES A REAL EDT DAY ADMISSIBLE.

   P3-STAGE finding 3 (DECISIONS:454) and P3-RUNBOOK pre-check 6: the phone's
   IMPORT screen must write its own setup/session operations with the LIVE
   device clock. today-bindings.mjs clientClockFor's non-live branch hardcodes
   tz "-05:00" year-round; source-admission.mjs replay() compares each
   operation's recorded utc_offset against the civil offset the execution
   calendar actually had on that day, so on any EDT day (mid-March to early
   November) the frozen branch refuses LOCAL_SOURCE_CONTEXT_UNRESOLVED.

   P2's own witness chose a WINTER day (2026-11-20) to stand beside that bug.
   These cells stand on a SUMMER day instead, with the live clock the shipped
   page already runs on (S4), and prove BOTH halves: the live branch admits,
   and the frozen branch still refuses with exactly that code.

   Everything here is SYNTHETIC. See ./support.mjs. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, ownOperations, admit,
  localDayOf, localOffsetOf, IMPORTED_LOADS, SOURCE_SESSION_DAYS } from './support.mjs';

/* Noon local on each day, so the instant is unambiguous either side of a
   transition: 2026-09-16 is EDT (-04:00) and 2026-11-20 is EST (-05:00). */
const SUMMER = { day: '2026-09-16', at: '2026-09-16T16:00:00.000Z', offset: '-04:00' };
const WINTER = { day: '2026-11-20', at: '2026-11-20T17:00:00.000Z', offset: '-05:00' };
const SEALED = sealInventedBundle();

const scope = tag => ({ databaseName: 'p3-import-' + tag, namespace: 'joe/p3-' + tag,
  athleteId: 'ath-p3', deviceId: 'dev-p3' });

/* This whole file is about one timezone's own civil offsets, so a run in any
   other zone would be measuring nothing. It refuses rather than passing. */
test('P3-L0 - the harness really is standing in America/New_York', () => {
  assert.equal(Intl.DateTimeFormat().resolvedOptions().timeZone, 'America/New_York',
    'set TZ=America/New_York: these cells assert this zone\'s own DST offsets');
  assert.equal(localOffsetOf(new Date(SUMMER.at)), SUMMER.offset);
  assert.equal(localOffsetOf(new Date(WINTER.at)), WINTER.offset);
  assert.equal(localDayOf(new Date(SUMMER.at)), SUMMER.day);
  assert.equal(localDayOf(new Date(WINTER.at)), WINTER.day);
});

async function run(tag, when) {
  const indexedDB = new IDBFactory();
  const names = scope(tag);
  const era = await eraFor({ indexedDB, live: liveAt(when.at), ...names });
  await firstRun(era, when.day);
  return { era, names, ops: await ownOperations(era) };
}

test('P3-L1 - on a SUMMER day the live clock stamps the installation\'s own '
  + 'operation with the offset actually in force', async () => {
  const { era, ops } = await run('summer-stamp', SUMMER);
  assert.equal(ops.length, 1, 'the first run wrote exactly one operation');
  assert.equal(ops[0].local_date, SUMMER.day);
  assert.equal(ops[0].utc_offset, SUMMER.offset,
    'EDT, not the frozen branch\'s year-round -05:00');
  era.close();
});

test('P3-L2 - the import is ADMITTED on a SUMMER day (2026-09-16, EDT) with the '
  + 'live clock: no LOCAL_SOURCE_CONTEXT_UNRESOLVED', async () => {
  const { era, names } = await run('summer-admit', SUMMER);
  const result = await admit(era, SEALED, { day: SUMMER.day, ...names });
  assert.deepEqual(result.codes || [], [], 'admission raised no issue');
  assert.equal(result.admitted, true, 'admitted on a real EDT day');
  assert.equal(result.view.ready, true);
  assert.deepEqual(result.view.state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS);
  assert.deepEqual(Object.keys(result.view.state.sessionLog).sort(), SOURCE_SESSION_DAYS);
  era.close();
});

test('P3-L3 - P2\'s WINTER day (2026-11-20, EST) still admits on the same path',
  async () => {
    const { era, names } = await run('winter-admit', WINTER);
    const result = await admit(era, SEALED, { day: WINTER.day, ...names });
    assert.deepEqual(result.codes || [], []);
    assert.equal(result.admitted, true);
    assert.deepEqual(result.view.state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS);
    era.close();
  });

/* THE BUG ITSELF, EXECUTED. The same summer day with the era's FROZEN clock -
   the shape today-bindings.mjs builds when no `live` is handed in - writes the
   op at a year-round -05:00 and admission refuses it by name. This is the
   fence: a page that ever stops handing the hosts a live instant fails here
   before it can fail on Joe's phone. */
test('P3-L4 - the FROZEN clock refuses the same summer day with '
  + 'LOCAL_SOURCE_CONTEXT_UNRESOLVED', async () => {
  const indexedDB = new IDBFactory();
  const names = scope('summer-frozen');
  const frozen = { today: () => SUMMER.day, now: () => SUMMER.day + 'T13:00:00.000Z',
    tz: '-05:00', monotonicMs: () => 0 };
  const era = await eraFor({ indexedDB, clock: frozen, ...names });
  await firstRun(era, SUMMER.day);
  const ops = await ownOperations(era);
  assert.equal(ops[0].utc_offset, '-05:00', 'the frozen branch\'s year-round offset');
  const result = await admit(era, SEALED, { day: SUMMER.day, ...names });
  assert.equal(result.admitted, false);
  assert.deepEqual([...new Set(result.codes)], ['LOCAL_SOURCE_CONTEXT_UNRESOLVED'],
    'exactly the refusal P3-STAGE finding 3 predicted');
  era.close();
});
