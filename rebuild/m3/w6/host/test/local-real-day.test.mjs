// local-real-day.test.mjs — M2-S4-REAL-DAY.
//
// The owner's ruling (DECISIONS:432) is that Joe logs FRESH DAILY from now, and
// the PM's finding of 2026-09-16 is that the shipped page still boots on the
// frozen preview day. These cells are the difference, measured on both sides:
//
//   * with NO declared day, boot() stands on THIS DEVICE'S own calendar date,
//     hands its hosts a MOVING clock, stamps records with the real instant and
//     the real civil offset, and re-opens itself at local midnight;
//   * with a DECLARED day — every fixture, every check script, every suite —
//     nothing moves at all: the clocks are byte-for-byte the tip's own literals,
//     read back out of Git at this package's sourceBase and compared.
//
// The September case is the one P2's author stopped on: today-bindings.mjs's
// fixed -05:00 made the installation's own setup operation fail the offset
// predicate rebuild/m3/w6/local/source-admission.mjs applies, so admission
// refused it LOCAL_SOURCE_CONTEXT_UNRESOLVED on every EDT day. That predicate is
// executed here against a real op written both ways.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { IDBFactory } from 'fake-indexeddb';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { openTodayOverLocalEra, clientClockFor, localDayOf, localOffsetOf } from '../../local/today-bindings.mjs';
import Journey from './journey-fixture.cjs';
import Setup from '../../../w7-preview/today/setup-commands.mjs';
import * as Entry from '../../../w7-preview/today/today-entry.mjs';
import TodayModel from '../../../w7-preview/today/today-model.cjs';
import design from '../../../w7-preview/today/design.cjs';

const REPO = fileURLToPath(new URL('../../../../../', import.meta.url));
const readRepo = (p) => readFileSync(REPO + p, 'utf8');
const SETUP = JSON.parse(JSON.stringify(Journey.SETUP));
const TAGS = Object.fromEntries(SETUP.exercises.map(e => [e.id, { head: null, secondary: [] }]));

/* Two real instants on one machine, chosen because America/New_York answers
   them differently: the first is inside EST (-05:00), the second inside EDT
   (-04:00). Nothing here names a zone — the device's own Date does. */
const WINTER = new Date('2026-01-15T18:00:00.000Z');
const SUMMER = new Date('2026-09-03T18:00:00.000Z');

/* The approved shell, exactly as local-today-journey.test.mjs builds it. */
const shellDoc = () => new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
  { url: 'http://127.0.0.1:4179/' }).window.document;

/* The op the installation writes for its own first run — the operation P2's
   author found admission refusing. Written through the page's own setup lane,
   with the page's own commands and profile, exactly as today-entry.mjs does. */
async function firstRunOp(era, day) {
  const host = await era.createSetupHost({ day, commands: Setup.createSetupCommands(), profile: Setup.PROFILE });
  const saved = await host.save({ setup: SETUP, tags: TAGS });
  assert.equal(saved.ok, true, 'the first run is recorded: ' + saved.code);
  const generation = (await era.generation()).generation;
  host.close();
  const ops = Object.values(generation.collections.ops || {});
  const op = ops.find(o => o.payload && o.payload.profile === Setup.PROFILE);
  assert(op, 'the installation wrote its own setup operation');
  return op;
}

/* THE PREDICATE, quoted from rebuild/m3/w6/local/source-admission.mjs (the
   replay loop over every op): the op's recorded utc_offset is compared against
   the offset the engine context's own clock reports for that local date and
   hour, and a disagreement is issued as LOCAL_SOURCE_CONTEXT_UNRESOLVED. It is
   restated here rather than imported because it is the RULE that has to hold,
   and it has to hold on a branch whether or not the import lane has landed on
   it yet. The instant is the one the op itself carries. */
const OFFSET_RE = /^([+-])(0\d|1[0-4]):([0-5]\d)$/;
function offsetAgrees(op, at) {
  const match = OFFSET_RE.exec((op.effective && op.effective.utc_offset) || '');
  if (!match) return false;
  const supplied = (match[1] === '+' ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3]));
  return at.getTimezoneOffset() === supplied;
}

/* The tip's OWN clock literals, read out of Git at this package's declared
   sourceBase and rebuilt as functions. They close over nothing but `day`, so
   this is a true differential against the bytes the parent sealed — not a
   restatement of them here. */
function tipClocks() {
  const base = JSON.parse(readRepo('rebuild/lanes/b/tooling/packages/S4.json')).sourceBase;
  const shown = spawnSync('git', ['show', base + ':rebuild/m3/w6/local/today-bindings.mjs'],
    { cwd: REPO, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  assert.equal(shown.status, 0, 'the tip bytes are readable at ' + base);
  const client = /export const clientClockFor = day => \(([\s\S]*?)\);\n/.exec(shown.stdout);
  const engine = /\nconst engineClockFor = day => \(([\s\S]*?)\);\n/.exec(shown.stdout);
  assert(client && engine, 'the tip still spells both clocks as one arrow each');
  return { client: new Function('day', 'return (' + client[1] + ');'),
    engine: new Function('day', 'return (' + engine[1] + ');') };
}

test('S4/1 - the device answers for its own day and its own offset, summer and winter', () => {
  assert.match(localOffsetOf(WINTER), /^[+-]\d\d:\d\d$/);
  assert.match(localOffsetOf(SUMMER), /^[+-]\d\d:\d\d$/);
  /* The two instants are 231 days apart, so a zone with a summer rule answers
     them DIFFERENTLY and a zone without answers them the same. Both are honest;
     what is asserted is that the answer is the device's, computed at the
     instant, never a constant. */
  assert.equal(localOffsetOf(WINTER) === localOffsetOf(SUMMER),
    WINTER.getTimezoneOffset() === SUMMER.getTimezoneOffset(),
    'the offset follows the instant, not the module');
  if (WINTER.getTimezoneOffset() === 300 && SUMMER.getTimezoneOffset() === 240) {
    assert.equal(localOffsetOf(WINTER), '-05:00', 'EST');
    assert.equal(localOffsetOf(SUMMER), '-04:00', 'EDT');
  }
});

/* An INDEPENDENT reading of the same Date: the local calendar accessors, which
   share no arithmetic with localDayOf's UTC shift. If the two ever disagree,
   one of them is wrong about the device. */
const localParts = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
  + '-' + String(d.getDate()).padStart(2, '0');

test('S4/1 - the calendar date turns over at LOCAL midnight, not at UTC midnight', () => {
  const before = new Date('2026-09-04T03:59:00.000Z');
  const after = new Date('2026-09-04T04:01:00.000Z');
  for (const at of [WINTER, SUMMER, before, after])
    assert.equal(localDayOf(at), localParts(at), at.toISOString());
  /* Named for the zone the owner is in: 03:59Z and 04:01Z on 2026-09-04 are
     23:59 and 00:01 in New York, so they are two different days there and the
     same day in UTC. */
  if (before.getTimezoneOffset() === 240 && after.getTimezoneOffset() === 240) {
    assert.equal(localDayOf(before), '2026-09-03');
    assert.equal(localDayOf(after), '2026-09-04');
    assert.notEqual(localDayOf(before), before.toISOString().slice(0, 10));
  }
});

test('S4/2 - WITH a declared day the clocks are the TIP\'S OWN, member for member', () => {
  const tip = tipClocks();
  for (const day of ['2026-09-03', '2026-01-15', TodayModel.SYNTHETIC_DAY]) {
    const mine = clientClockFor(day), theirs = tip.client(day);
    assert.equal(mine.today(), theirs.today(), day);
    assert.equal(mine.now(), theirs.now(), day);
    assert.equal(mine.tz, theirs.tz, day);
    assert.equal(mine.monotonicMs(), theirs.monotonicMs(), day);
    assert.deepEqual(Object.keys(mine).sort(), Object.keys(theirs).sort(), day);
  }
  /* And the literal values themselves, said out loud so a reader need not run
     the differential to know what "unchanged" means here. */
  const frozen = clientClockFor('2026-09-03');
  assert.equal(frozen.now(), '2026-09-03T13:00:00.000Z');
  assert.equal(frozen.tz, '-05:00');
  assert.equal(frozen.monotonicMs(), 0);
});

test('S4/2 - the engine clock with a declared day is the tip\'s too, hour 8 and all', () => {
  const tip = tipClocks();
  const era = { day: '2026-09-03' };
  const theirs = tip.engine(era.day);
  assert.equal(theirs.hour(), 8);
  assert.equal(theirs.stamp(), '2026-09-03T13:00:00.000Z');
  assert.equal(theirs.now().toISOString(), '2026-09-03T13:00:00.000Z');
  /* The module's own engine clock is not exported, so it is measured where it
     lands: a host opened on a declared day writes the tip's instant, which cell
     S4/5 asserts on a real operation. */
});

test('S4/3 - with NO options the page stands on the device\'s own date, and its clock moves', async () => {
  const doc = shellDoc();
  const booted = await Entry.boot({ document: doc, indexedDB: new IDBFactory(), crypto: webcrypto,
    now: () => SUMMER });
  try {
    assert.equal(booted.today, localDayOf(SUMMER), 'the page took the device\'s calendar date');
    assert.equal(booted.model.today, localDayOf(SUMMER), 'and so did the model it painted');
    assert.notEqual(booted.today, TodayModel.SYNTHETIC_DAY,
      'the shipped page is no longer on the preview day');
    assert(booted.live, 'a live instant provider was handed down');
    assert(booted.rollover, 'and a midnight watcher was armed');
  } finally { if (booted.rollover) booted.rollover.stop(); }
});

test('S4/3 - two reads of the live clock DIFFER: it is a clock, not a constant', async () => {
  const doc = shellDoc();
  const booted = await Entry.boot({ document: doc, indexedDB: new IDBFactory(), crypto: webcrypto });
  try {
    assert.equal(booted.today, localDayOf(new Date()), 'the real date, right now');
    const first = booted.live(), second = booted.live();
    assert(first instanceof Date && second instanceof Date);
    assert(second.getTime() >= first.getTime(), 'time does not run backwards');
    /* A clock that returns a pinned instant returns the SAME instant forever.
       Wait past one millisecond and read again: this one has moved. */
    await new Promise(resolve => setTimeout(resolve, 5));
    assert(booted.live().getTime() > first.getTime(), 'the clock moved between two reads');
    assert.equal(clientClockFor(booted.today).now(), booted.today + 'T13:00:00.000Z',
      'while the frozen clock, asked twice, never moves at all');
  } finally { if (booted.rollover) booted.rollover.stop(); }
});

test('S4/4 - MIDNIGHT with the app still open: the day is re-read and the page re-opens ONCE', () => {
  const doc = shellDoc();
  let at = new Date('2026-09-03T23:59:00.000Z'), opened = [];
  const watcher = Entry.watchDayRollover(doc, { day: localDayOf(at), now: () => at,
    reopen: (day) => { opened.push(day); return day; }, intervalMs: 3600000 });
  try {
    assert.equal(watcher.check(), null, 'nothing re-opens while the day has not moved');
    assert.deepEqual(opened, []);
    at = new Date(at.getTime() + 24 * 3600 * 1000);
    const moved = watcher.check();
    assert.equal(moved, localDayOf(at), 'the watcher adopted the new calendar date');
    assert.deepEqual(opened, [localDayOf(at)], 'and re-opened the page exactly once');
    assert.equal(watcher.check(), null, 'a second look on the same day re-opens nothing');
    assert.deepEqual(opened, [localDayOf(at)]);
    assert.equal(watcher.day(), localDayOf(at), 'the watcher now stands on the new day');
  } finally { watcher.stop(); }
});

test('S4/4 - a stopped watcher is inert, and a declared-day boot never arms one', async () => {
  const doc = shellDoc();
  let at = new Date('2026-09-03T12:00:00.000Z'), opened = 0;
  const watcher = Entry.watchDayRollover(doc, { day: localDayOf(at), now: () => at,
    reopen: () => { opened += 1; }, intervalMs: 3600000 });
  watcher.stop();
  at = new Date(at.getTime() + 48 * 3600 * 1000);
  assert.equal(watcher.check(), null);
  assert.equal(opened, 0, 'a stopped watcher never re-opens the page');
  const booted = await Entry.boot({ document: shellDoc(), today: TodayModel.SYNTHETIC_DAY,
    indexedDB: new IDBFactory(), crypto: webcrypto });
  assert.equal(booted.rollover, null, 'a caller that DECLARED its day is never moved off it');
  assert.equal(booted.today, TodayModel.SYNTHETIC_DAY);
});

/* ==========================================================================
   S4/7 - TWO CONSECUTIVE MIDNIGHTS, THROUGH THE REAL REOPEN PATH. S4/4 drives
   the watcher with a stub `reopen` that arms nothing, so it can only ever see
   the FIRST rollover. This one lets boot()'s own `reopen` run: it re-boots the
   page for real, and what is being measured is what the page is left HOLDING
   afterwards. One watcher, one interval timer and one `visibilitychange`
   listener per page, on night one and on night two - not two, and not four.
   Before the fix the watcher that fired stayed armed beside the one its re-boot
   created, so the second midnight fired BOTH and produced two more boots.
   ========================================================================== */
function countingDoc() {
  const doc = shellDoc();
  const add = doc.addEventListener.bind(doc), remove = doc.removeEventListener.bind(doc);
  let listeners = 0;
  doc.addEventListener = (type, fn, opts) => { if (type === 'visibilitychange') listeners += 1; return add(type, fn, opts); };
  doc.removeEventListener = (type, fn, opts) => { if (type === 'visibilitychange') listeners -= 1; return remove(type, fn, opts); };
  return { doc, listeners: () => listeners };
}

test('S4/7 - two midnights through the real reopen path leave ONE watcher, not four', async () => {
  const { doc, listeners } = countingDoc();
  const idb = new IDBFactory();
  /* Live interval timers, counted where the module takes them: the page's own
     global. Restored below whatever happens. */
  const realSet = globalThis.setInterval, realClear = globalThis.clearInterval;
  const timers = new Set();
  globalThis.setInterval = (fn, ms) => { const t = realSet(fn, ms); timers.add(t); return t; };
  globalThis.clearInterval = (t) => { timers.delete(t); return realClear(t); };
  let at = new Date('2026-09-03T18:00:00.000Z');
  const night1 = new Date('2026-09-04T18:00:00.000Z'), night2 = new Date('2026-09-05T18:00:00.000Z');
  let first = null, second = null, third = null;
  try {
    first = await Entry.boot({ document: doc, indexedDB: idb, crypto: webcrypto, now: () => at });
    assert.equal(first.today, localDayOf(at), 'the page opened on the device\'s own day');
    assert.equal(listeners(), 1, 'one visibilitychange listener after the first boot');
    assert.equal(timers.size, 1, 'and one interval timer');

    /* NIGHT ONE. The watcher fires, and its reopen is boot()'s own. */
    at = night1;
    assert.equal(first.rollover.check(), localDayOf(night1), 'the first watcher adopted night one');
    second = await first.rollover.reopened();
    assert.equal(second.today, localDayOf(night1), 'and the re-booted page stands on night one');
    assert.equal(listeners(), 1, 'the watcher that fired took its listener with it');
    assert.equal(timers.size, 1, 'and its timer');
    assert.equal(first.rollover.check(), null, 'the first watcher is inert once it has re-booted');

    /* NIGHT TWO. Only the watcher the night-one boot armed may fire. */
    at = night2;
    assert.equal(first.rollover.check(), null, 'the first watcher does NOT fire a second night');
    assert.equal(await first.rollover.reopened(), second, 'and it produced no second re-boot');
    assert.equal(second.rollover.check(), localDayOf(night2), 'the standing watcher adopted night two');
    third = await second.rollover.reopened();
    assert.equal(third.today, localDayOf(night2), 'the page stands on night two');
    assert.equal(listeners(), 1, 'still ONE listener after the second midnight, not four');
    assert.equal(timers.size, 1, 'still ONE interval timer after the second midnight');
    assert.notEqual(third, second, 'night two really did re-boot the page');
    assert.equal(doc.querySelectorAll('#phone').length, 1, 'and the page was not painted twice');
  } finally {
    for (const booted of [first, second, third]) if (booted && booted.rollover) booted.rollover.stop();
    globalThis.setInterval = realSet; globalThis.clearInterval = realClear;
    for (const t of timers) realClear(t);
  }
});

/* ==========================================================================
   S4/5 - THE SEPTEMBER CASE. P2's own witness note names it in terms: "an EDT
   day would make admission refuse the installation's own setup operation with
   LOCAL_SOURCE_CONTEXT_UNRESOLVED, which is the pinned binding talking and not
   this import", and P2 worked around it by choosing a WINTER day (2026-11-20).
   Both sides are executed here on a real operation.
   ========================================================================== */
test('S4/5 - the installation\'s own setup op now carries the REAL offset, and admission accepts it', async () => {
  const day = localDayOf(SUMMER);
  const era = await openTodayOverLocalEra({ indexedDB: new IDBFactory(), crypto: webcrypto,
    databaseName: 's4-live', namespace: 's4/live', athleteId: 'owner', deviceId: 'dev-s4-live',
    live: () => SUMMER });
  try {
    const op = await firstRunOp(era, day);
    assert.equal(op.effective.local_date, day, 'stamped on the day the host stands on');
    assert.equal(op.effective.utc_offset, localOffsetOf(SUMMER),
      'and with the offset in force at the instant it was written');
    assert.equal(offsetAgrees(op, SUMMER), true,
      'the source-admission offset predicate accepts it: no LOCAL_SOURCE_CONTEXT_UNRESOLVED');
    assert.match(op.effective.local_time, /^([01]\d|2[0-3]):[0-5]\d$/,
      'the local time is a well-formed wall time, as admission also requires');
  } finally { era.close(); }
});

test('S4/5 RED FIRST - the SAME op under the frozen clock still says -05:00, and is refused', async () => {
  const day = localDayOf(SUMMER);
  const era = await openTodayOverLocalEra({ indexedDB: new IDBFactory(), crypto: webcrypto,
    databaseName: 's4-frozen', namespace: 's4/frozen', athleteId: 'owner', deviceId: 'dev-s4-frozen',
    clock: clientClockFor(day) });
  try {
    const op = await firstRunOp(era, day);
    assert.equal(op.effective.utc_offset, '-05:00',
      'the pinned binding stamps one constant offset whatever the date is');
    /* And on a device whose real September offset is NOT -05:00 — which is every
       zone with a summer rule, including the owner's — that constant is what the
       predicate refuses. Where the device really is at -05:00 all year the two
       agree and there was never a defect to fix; the cell says which case it is
       standing in rather than passing silently. */
    if (SUMMER.getTimezoneOffset() !== 300)
      assert.equal(offsetAgrees(op, SUMMER), false,
        'this is the refusal P2 stopped on: LOCAL_SOURCE_CONTEXT_UNRESOLVED');
    else
      assert.equal(offsetAgrees(op, SUMMER), true,
        'this device is at -05:00 in September, so the frozen offset happens to be right');
  } finally { era.close(); }
});

/* The predicate above is RESTATED here rather than imported, because the rule has
   to hold whether or not the import lane stands on this branch. Now that P2 is
   merged, it is also ANCHORED: the two lines rebuild/m3/w6/local/source-admission.mjs
   actually applies are read off disk and compared with what this file executes, so
   a change to either side turns this cell red instead of leaving the restatement
   to drift quietly. With the module absent the cell says so and asserts nothing. */
test('S4/5 - the restated predicate IS the one source-admission.mjs applies', () => {
  let text = null;
  try { text = readRepo('rebuild/m3/w6/local/source-admission.mjs'); } catch { text = null; }
  if (text === null) { assert.equal(text, null, 'the import lane is not on this branch yet'); return; }
  assert(text.includes("match=/^([+-])(0\\d|1[0-4]):([0-5]\\d)$/.exec(eff?.utc_offset||'')"),
    'the offset shape this cell restates is the one the module parses');
  assert(text.includes("const supplied=(match[1]==='+'?-1:1)*(Number(match[2])*60+Number(match[3]));"),
    'and the sign convention is the same');
  assert(text.includes('.getTimezoneOffset()!==supplied)throw Error();'),
    'and the comparison is against the clock\'s own getTimezoneOffset');
  assert(text.includes("issue('LOCAL_SOURCE_CONTEXT_UNRESOLVED',op.op_id)"),
    'and the code it issues on a disagreement is the one S4 exists to stop');
  assert.equal(OFFSET_RE.source, '^([+-])(0\\d|1[0-4]):([0-5]\\d)$',
    'this file parses the offset with the module\'s own expression');
});

test('S4/6 - a DECLARED day records exactly the fixture triple it always did', async () => {
  const day = TodayModel.SYNTHETIC_DAY;
  const era = await openTodayOverLocalEra({ indexedDB: new IDBFactory(), crypto: webcrypto,
    databaseName: 's4-fixture', namespace: 's4/fixture', athleteId: 'owner', deviceId: 'dev-s4-fixture',
    clock: clientClockFor(day) });
  try {
    const op = await firstRunOp(era, day);
    /* 13:00Z read at -05:00 is 08:00 local. These three values are what every
       existing fixture cell on this branch stands on, and S4 moves none of them. */
    assert.deepEqual({ ...op.effective },
      { local_date: day, local_time: '08:00', utc_offset: '-05:00' });
  } finally { era.close(); }
});

test('S4/6 - and the live host records a DIFFERENT, real triple over the same code path', async () => {
  const era = await openTodayOverLocalEra({ indexedDB: new IDBFactory(), crypto: webcrypto,
    databaseName: 's4-live-2', namespace: 's4/live-2', athleteId: 'owner', deviceId: 'dev-s4-live-2',
    live: () => WINTER });
  try {
    const op = await firstRunOp(era, localDayOf(WINTER));
    assert.equal(op.effective.local_date, localDayOf(WINTER));
    assert.equal(op.effective.utc_offset, localOffsetOf(WINTER));
    assert.equal(offsetAgrees(op, WINTER), true, 'winter agrees too, for the right reason');
    assert.notEqual(op.effective.local_date, TodayModel.SYNTHETIC_DAY);
  } finally { era.close(); }
});

/* ==========================================================================
   S4/8 - THE MIDNIGHT RE-BOOT TEARS THE PREVIOUS MOUNT DOWN (review round 2,
   BLOCKING finding 1). S4/7 counts what the PAGE is left holding after two
   nights; this one measures what the OLD MOUNT can still DO. #phone is the one
   node every mount of this page shares, mountToday binds its Escape handler to
   that ELEMENT, and render only replaces the element's children - so before
   this round the old handler survived every re-boot carrying the OLD screen,
   the OLD model, the OLD day and the OLD hosts. Left off Today at local
   midnight, ONE hardware Escape repainted YESTERDAY over the new page, and one
   tap of the primary button on that repainted screen wrote a weigh-in stamped
   with the PREVIOUS local_date. Two consecutive midnights here, through the
   REAL reopen path, then the Escape and the tap on the OLD mount's own surface.
   ========================================================================== */
function countingPage() {
  const { doc, listeners } = countingDoc();
  const phone = doc.getElementById('phone');
  const add = phone.addEventListener.bind(phone), remove = phone.removeEventListener.bind(phone);
  let bound = 0;
  phone.addEventListener = (type, fn, opts) => { if (type === 'keydown') bound += 1; return add(type, fn, opts); };
  phone.removeEventListener = (type, fn, opts) => { if (type === 'keydown') bound -= 1; return remove(type, fn, opts); };
  return { doc, phone, listeners, keydowns: () => bound };
}
const pressEscape = (doc, phone) => phone.dispatchEvent(
  new doc.defaultView.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
async function until(ready, why) {
  for (let i = 0; i < 400; i += 1) { if (ready()) return; await new Promise(r => setTimeout(r, 5)); }
  assert.fail(why);
}
/* Every stamped row this installation holds, wherever the generation keeps it,
   so the assertion below is over the WHOLE record and not over one lane's
   projection of it. */
const stampedDates = gen => Object.values(gen.collections || {})
  .flatMap(collection => Object.values(collection || {}))
  .map(row => row && row.effective)
  .filter(eff => eff && typeof eff.local_date === 'string')
  .map(eff => eff.local_date);

test('S4/8 - after two midnights the OLD mount cannot repaint and cannot date a record', async () => {
  const { doc, phone, listeners, keydowns } = countingPage();
  const idb = new IDBFactory();
  const realSet = globalThis.setInterval, realClear = globalThis.clearInterval;
  const timers = new Set();
  globalThis.setInterval = (fn, ms) => { const t = realSet(fn, ms); timers.add(t); return t; };
  globalThis.clearInterval = (t) => { timers.delete(t); return realClear(t); };
  let at = new Date('2026-09-03T18:00:00.000Z');
  const night1 = new Date('2026-09-04T18:00:00.000Z'), night2 = new Date('2026-09-05T18:00:00.000Z');
  let first = null, second = null, third = null;
  try {
    first = await Entry.boot({ document: doc, indexedDB: idb, crypto: webcrypto, now: () => at });
    assert.equal(keydowns(), 1, 'the first mount bound one keydown to #phone');
    /* OFF Today, which is the whole trigger: the Escape guard reads the mount's
       OWN screen, so a mount left on Today refuses and a mount left anywhere
       else repaints. */
    first.api.render('why');
    assert.equal(first.api.screen(), 'why', 'the first mount is off Today at midnight');
    at = night1;
    assert.equal(first.rollover.check(), localDayOf(night1), 'night one moved the day');
    second = await first.rollover.reopened();
    second.api.render('why');
    at = night2;
    assert.equal(second.rollover.check(), localDayOf(night2), 'night two moved it again');
    third = await second.rollover.reopened();
    assert.equal(third.today, localDayOf(night2), 'the page stands on the second new day');
    assert.equal(third.api.screen(), 'today', 'and the live mount opened on Today');

    /* ONE HARDWARE ESCAPE on the surface both older mounts were bound to.
       Nothing is awaited between the snapshot and the comparison, so what is
       measured is the synchronous handler itself and no later repaint. */
    const painted = phone.textContent;
    pressEscape(doc, phone);
    assert.equal(phone.textContent, painted, 'the Escape repainted nothing at all');
    assert.equal(first.api.screen(), 'why', 'the first mount did not run its own render');
    assert.equal(second.api.screen(), 'why', 'nor did the second');
    assert.equal(third.api.screen(), 'today', 'and the live mount is where the athlete left it');

    /* ONE TAP of the primary button on that same surface, carried through the
       sheet it opens to a durable write. */
    const primary = phone.querySelector('[data-slot="primary"]');
    assert(primary && primary.disabled !== true, 'the live Today offers its primary action');
    primary.dispatchEvent(new doc.defaultView.MouseEvent('click', { bubbles: true }));
    await until(() => phone.querySelector('[role="dialog"]'), 'the tap opened the weigh-in sheet');
    const sheet = phone.querySelector('[role="dialog"]');
    sheet.querySelector('#morning-weight').value = '181.4';
    sheet.dispatchEvent(new doc.defaultView.Event('submit', { bubbles: true, cancelable: true }));
    await until(() => !phone.querySelector('[role="dialog"]'),
      'the weight was recorded and the sheet closed itself');

    const written = stampedDates((await third.hosts.generation()).generation);
    assert(written.length >= 1, 'the tap wrote something durable');
    for (const date of written)
      assert.equal(date, localDayOf(night2), 'every op carries the CURRENT local date');

    /* And the mounts the nights left behind hold nothing live: their handles
       were released before the new day opened, so their own model records
       nothing whatever it is asked, and the record does not move. */
    for (const stale of [first, second]) {
      let answered = null;
      try { answered = await stale.model.weighIn(179.2); }
      catch (error) { answered = { ok: false, code: (error && error.code) || 'THREW' }; }
      assert.notEqual(answered && answered.ok, true, 'a released host records nothing');
    }
    const after = stampedDates((await third.hosts.generation()).generation);
    assert.deepEqual(after, written, 'no op on any previous day reached the store');

    assert.equal(keydowns(), 1, 'exactly ONE #phone keydown listener is left standing');
    assert.equal(listeners(), 1, 'one visibilitychange listener, as S4/7 also holds');
    assert.equal(timers.size, 1, 'one interval timer');
    assert.equal(first.api.disposed(), true, 'the first mount was disposed by the re-boot');
    assert.equal(second.api.disposed(), true, 'and so was the second');
    assert.equal(third.api.disposed(), false, 'the mount the athlete is holding was not');
  } finally {
    for (const booted of [first, second, third]) if (booted && booted.rollover) booted.rollover.stop();
    globalThis.setInterval = realSet; globalThis.clearInterval = realClear;
    for (const t of timers) realClear(t);
    if (third && typeof third.teardown === 'function') third.teardown();
  }
});
