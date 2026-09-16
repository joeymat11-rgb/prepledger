// food-live-save.test.mjs - FOOD-LIVE-SAVE.
//
// P3-REPLAY-ALL-FAMILIES review R3 (Fable) found that on a LIVE era - the era the
// SHIPPED page opens, S4 / DECISIONS:455-457 - a food day and a machine note were
// refused and nothing was written, while sleep on the same era saved. The cause is
// one line in each of two files: both handed `client.hostBindings` a
// `clientClockFor(day)` built with NO live instant provider, which is the pinned
// preview instant `day + 'T13:00:00.000Z'`. A live installation issues its lease
// not_before the REAL instant of enrolment, and 13:00Z on that day stands outside
// that window, so rebuild/client/lease.cjs refused every write state 20 with
// "Connect once to keep saving" and the op never reached the log.
//
// These cells stand on the SHIPPED BUILD PATH - today-entry.mjs boot() with no
// declared day, which is what the phone runs - and on both sides of the year, because
// the offset the era stamps is the only thing that differs between them.
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { openTodayOverLocalEra, clientClockFor, localDayOf, localOffsetOf } from '../../local/today-bindings.mjs';
import { createDurablePublicClient } from '../../public-client.mjs';
import { LOCAL_ERA_SCHEMA_VERSION } from '../../local/local-era.mjs';
import * as Entry from '../../../w7-preview/today/today-entry.mjs';
import design from '../../../w7-preview/today/design.cjs';
import { createFoodHost } from '../../../w7-preview/today/food-host.mjs';
import { createMachineSettingsHost, PROFILE as MACHINE_PROFILE } from '../../../w7-preview/today/machine-settings-host.mjs';
import { createSleepHost } from '../../../w7-preview/today/sleep-host.mjs';
import FoodCommands from '../../../w7-preview/today/food-commands.cjs';
import TodayModel from '../../../w7-preview/today/today-model.cjs';

const REPO = fileURLToPath(new URL('../../../../../', import.meta.url));
const readRepo = (p) => readFileSync(REPO + p, 'utf8');

/* The two real instants the ticket names. Both are 18:00Z, which is AFTER the pinned
   13:00Z preview instant on the same calendar day - that ordering is the defect, and
   it holds in either half of the year. America/New_York answers them with different
   offsets, so nothing here may name a zone: the device's own Date does. */
const SUMMER = new Date('2026-09-16T18:00:00.000Z');
const WINTER = new Date('2026-11-20T18:00:00.000Z');

const shellDoc = () => new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
  { url: 'http://127.0.0.1:4179/' }).window.document;

const FOOD_DAY = Object.freeze({ cal: 2100, pro: 170 });
const MACHINE = Object.freeze({ exercise_id: 'chest-press', cues: 'seat 4, handles narrow' });
const opsOf = async (era) => Object.values((await era.generation()).generation.collections.ops || {});
const profileOf = (op) => (op && op.payload && op.payload.profile) || null;
const oneOf = (ops, profile) => ops.filter((op) => profileOf(op) === profile);

/* THE SHIPPED PAGE, opened the way the phone opens it: no declared day, a real instant
   provider, so boot() stands on the device's own calendar date and hands the
   installation a MOVING clock. `now` is the only injection, and it is the same one
   local-real-day.test.mjs uses. */
async function bootLive(at, idb) {
  return Entry.boot({ document: shellDoc(), indexedDB: idb, crypto: webcrypto, now: () => at });
}

/* ==========================================================================
   FLS/1 - THE REPRODUCTION, KEPT EXECUTABLE. The line the two hosts carried is
   restated here verbatim rather than left in them:

       await era.client.hostBindings({ workoutCommands: createFoodCommands(),
         clock: clientClockFor(day) })

   over a LIVE era, and the save it produces. This is the cell that was RED against
   the hosts before the fix and is GREEN against the cause after it: the refusal is
   a property of that frozen clock, not of the food lane, and it is still there for
   anyone who puts the clock back.
   ========================================================================== */
test('FLS/1 - the frozen preview clock over a LIVE era is refused state 20, and writes nothing', async () => {
  const at = SUMMER, day = localDayOf(at);
  const era = await openTodayOverLocalEra({ indexedDB: new IDBFactory(), crypto: webcrypto,
    databaseName: 'fls-red', namespace: 'fls/red', athleteId: 'owner', deviceId: 'dev-fls-red',
    live: () => at });
  try {
    const frozen = clientClockFor(day);
    assert.equal(frozen.now(), day + 'T13:00:00.000Z', 'the pinned preview instant, said out loud');
    const bindings = await era.client.hostBindings({ workoutCommands: FoodCommands.createFoodCommands(),
      clock: frozen });
    const client = createDurablePublicClient({ ...bindings, schemaVersion: LOCAL_ERA_SCHEMA_VERSION });
    await client.reopen();
    const result = await client.execute('workout', { action: FoodCommands.ACTION, input: { day: FOOD_DAY } });
    assert.equal(result.acknowledged, false, 'the write was NOT acknowledged');
    assert.equal(result.state, 20, 'and state 20 is the lease refusing it');
    assert.match(result.copy, /Connect once to keep saving/, 'in the client\'s own words');
    assert.deepEqual(oneOf(await opsOf(era), FoodCommands.PROFILE), [], 'and nothing was written');
  } finally { era.close(); }
});

/* ==========================================================================
   FLS/2 - THE OWNER'S CASE. A fresh installation, the shipped boot, one food day and
   one machine note saved, read back, and read back AGAIN after every handle is
   disposed and the page is re-opened off the same disk. Run on both sides of the
   year, because the offset the era stamps is the only thing that differs.
   ========================================================================== */
async function liveSaves(at) {
  const idb = new IDBFactory(), day = localDayOf(at), offset = localOffsetOf(at);
  let booted = await bootLive(at, idb);
  const lane = { day, indexedDB: idb, crypto: webcrypto };
  try {
    assert.equal(booted.today, day, 'the page opened on the device\'s own calendar date');
    assert.equal(!!booted.live, true, 'and on a live instant provider');
    const food = await createFoodHost(lane), machine = await createMachineSettingsHost(lane);
    const saved = await food.save(FOOD_DAY);
    assert.equal(saved.ok, true, 'the food day was saved: ' + saved.code + ' state ' + saved.state);
    assert.equal(saved.state, 1, 'state 1, saved on this phone');
    const noted = await machine.save(MACHINE);
    assert.equal(noted.ok, true, 'the machine note was saved: ' + noted.code + ' state ' + noted.state);
    assert.equal(noted.state, 1);
    assert.deepEqual((await food.forDate(day)).map((row) => row.day), [{ ...FOOD_DAY }],
      'and the food day reads back off the same generation');
    assert.deepEqual((await machine.latest(MACHINE.exercise_id)).machine, { ...MACHINE },
      'and so does the machine note');
    /* THE STAMP, which is the whole of it: the era's real instant and the offset in
       force AT that instant, on the day the screen is standing on. */
    for (const op of [...oneOf(await opsOf(booted.hosts), FoodCommands.PROFILE),
      ...oneOf(await opsOf(booted.hosts), MACHINE_PROFILE)]) {
      assert.equal(op.effective.local_date, day, 'stamped on the page\'s own day');
      assert.equal(op.effective.utc_offset, offset, 'with the offset in force at the instant');
    }
    /* DISPOSE AND REOPEN. Every handle released, the page torn down, then opened
       again off the same IndexedDB - a real relaunch, re-read from disk. */
    food.close(); machine.close();
    if (booted.rollover) booted.rollover.stop();
    if (typeof booted.teardown === 'function') booted.teardown();
    booted = await bootLive(at, idb);
    const food2 = await createFoodHost(lane), machine2 = await createMachineSettingsHost(lane);
    try {
      assert.deepEqual((await food2.forDate(day)).map((row) => row.day), [{ ...FOOD_DAY }],
        'the food day survived dispose and reopen');
      assert.deepEqual((await machine2.latest(MACHINE.exercise_id)).machine, { ...MACHINE },
        'and so did the machine note');
    } finally { food2.close(); machine2.close(); }
  } finally {
    if (booted && booted.rollover) booted.rollover.stop();
    if (booted && typeof booted.teardown === 'function') booted.teardown();
  }
}

test('FLS/2 - SUMMER 2026-09-16: the food day and the machine note are written and kept', async () => {
  await liveSaves(SUMMER);
});

test('FLS/2 - WINTER 2026-11-20: the same, on the other side of the year', async () => {
  await liveSaves(WINTER);
});

/* FLS/3 - THE SLEEP PATH IS UNCHANGED. It already declared no clock, so it already
   took the era's own; this cell holds it where it was rather than assuming it. */
test('FLS/3 - sleep still saves on the same live era, stamped the same way', async () => {
  const at = SUMMER, day = localDayOf(at), idb = new IDBFactory();
  const booted = await bootLive(at, idb);
  const sleep = await createSleepHost({ day, era: booted.hosts });
  try {
    const saved = await sleep.save({ date: '2026-09-15', hours: 7 });
    assert.equal(saved.ok, true, 'sleep saved: ' + saved.code);
    const rows = await sleep.forDate('2026-09-15');
    assert.equal(rows.length, 1, 'and reads back');
    assert.equal(rows[0].savedDate, day, 'stamped on the page\'s own day');
    assert.equal(rows[0].savedOffset, localOffsetOf(at), 'with the real offset');
  } finally {
    sleep.close();
    if (booted.rollover) booted.rollover.stop();
    if (typeof booted.teardown === 'function') booted.teardown();
  }
});

/* ==========================================================================
   FLS/4 - THE NON-LIVE TEST CLOCK PATH DOES NOT MOVE. Every fixture, every check
   script and every existing food and machine cell opens on a DECLARED day with no
   live provider, and the installation's own clock is then byte-for-byte the frozen
   clock these two hosts used to build for themselves: 13:00Z, -05:00, read at -05:00
   as 08:00 local. Those three values are what the suites stand on, and this cell says
   them out loud over the REAL hosts rather than leaving them to the suites.
   ========================================================================== */
test('FLS/4 - a declared-day installation records exactly the triple it always did', async () => {
  const day = TodayModel.SYNTHETIC_DAY, idb = new IDBFactory();
  const lane = { day, indexedDB: idb, crypto: webcrypto };
  const food = await createFoodHost(lane), machine = await createMachineSettingsHost(lane);
  try {
    assert.equal((await food.save(FOOD_DAY)).ok, true, 'the fixture path still saves');
    assert.equal((await machine.save(MACHINE)).ok, true, 'and so does the machine note');
    const rows = await food.forDate(day);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].time, '08:00', '13:00Z read at -05:00 is 08:00 local, as it always was');
    assert.equal(rows[0].offset, '-05:00', 'and the pinned offset is unmoved');
    assert.equal(rows[0].date, day);
    const note = await machine.latest(MACHINE.exercise_id);
    assert.equal(note.time, '08:00', 'the machine note carries the same pinned time');
    assert.equal(note.date, day);
    const written = Object.values((await machine.repository.load()).generation.collections.ops || {})
      .filter((op) => profileOf(op) === MACHINE_PROFILE);
    assert.equal(written.length, 1);
    assert.equal(written[0].effective.utc_offset, '-05:00', 'and the pinned offset, unmoved');
    /* And it is the SAME triple the removed `clientClockFor(day)` produced, which is
       why no recorded figure moves: the declared-day installation's own clock and
       that frozen clock agree member for member. */
    const frozen = clientClockFor(day);
    assert.equal(frozen.now(), day + 'T13:00:00.000Z');
    assert.equal(frozen.tz, '-05:00');
  } finally { food.close(); machine.close(); }
});

/* ==========================================================================
   FLS/5 - THE CENSUS. Every host under rebuild/m3/w7-preview/today/ that writes an
   op, named, with the site that decides its clock. There are exactly two honest
   families, and after this ticket every one of the eight is in one of them:

     (a) IT DELEGATES TO today-bindings.mjs, which passes `clientClockFor(day, live)`
         at all four of its own sites (:306, :372, :468, :558) - the host's day over
         the installation's live instant:
           checkin-host.mjs:47   era.createCheckInHost
           gym-host.mjs:83       era.createGymHost
           reading-host.mjs:41   era.createReadingHost
           setup-host.mjs:79     era.createSetupHost
     (b) IT OPENS ITS OWN LANE over `era.client.hostBindings` and DECLARES NO CLOCK,
         so host-bindings.mjs:244 uses `scope.clock`, which IS the installation's live
         provider:
           food-host.mjs:72             hostBindings({ workoutCommands })   [this ticket]
           machine-settings-host.mjs:59 hostBindings({ workoutCommands })   [this ticket]
           sleep-host.mjs:106           hostBindings({ workoutCommands })
           measure/measure-host.mjs:159 hostBindings({ workoutCommands })

   What is forbidden is the third thing the two fixed files were doing: building a
   clock of their own from `day` alone. So no host page may import `clientClockFor`,
   and no host page may hand `hostBindings` a `clock:` at all - the day it declares
   reaches the installation as a DAY (openTodayHosts), never pre-baked into an instant.
   ========================================================================== */
const TODAY_HOSTS = ['checkin-host.mjs', 'food-host.mjs', 'gym-host.mjs',
  'machine-settings-host.mjs', 'reading-host.mjs', 'setup-host.mjs', 'sleep-host.mjs'];
const DELEGATES = { 'checkin-host.mjs': 'era.createCheckInHost', 'gym-host.mjs': 'era.createGymHost',
  'reading-host.mjs': 'era.createReadingHost', 'setup-host.mjs': 'era.createSetupHost' };
const OWN_LANE = ['food-host.mjs', 'machine-settings-host.mjs', 'sleep-host.mjs'];
/* THE CODE, with its prose removed: a file that explains why it does NOT build its
   own clock must not fail a "this never appears" check for saying so. */
const codeOf = (text) => text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');

test('FLS/5 - no host under today/ builds a clock of its own, and each is in one family', () => {
  const files = [...TODAY_HOSTS.map((name) => ['rebuild/m3/w7-preview/today/' + name, name]),
    ['rebuild/m3/w7-preview/measure/measure-host.mjs', 'measure-host.mjs']];
  for (const [path, name] of files) {
    const code = codeOf(readRepo(path));
    assert.equal(/clientClockFor/.test(code), false,
      name + ' builds no clock of its own from `day`');
    assert.equal(/hostBindings\(\{[^}]*clock\s*:/.test(code), false,
      name + ' hands hostBindings no clock, so the installation\'s own is used');
    if (Object.hasOwn(DELEGATES, name))
      assert.equal(code.includes(DELEGATES[name]), true,
        name + ' delegates to today-bindings through ' + DELEGATES[name]);
    else
      assert.equal(/era\.client\.hostBindings\(\{\s*workoutCommands/.test(code), true,
        name + ' opens its own lane over era.client.hostBindings');
  }
  /* And the four sites inside today-bindings.mjs really do pass `live`, so family (a)
     is live for the right reason and not by luck. */
  const bindings = codeOf(readRepo('rebuild/m3/w6/local/today-bindings.mjs'));
  assert.equal((bindings.match(/clientClockFor\(day, live\)/g) || []).length, 4,
    'today-bindings.mjs passes the live provider at all four of its own sites');
  assert.equal(/clientClockFor\(day\)[^,]/.test(bindings), false,
    'and at none of them does it drop it');
});
