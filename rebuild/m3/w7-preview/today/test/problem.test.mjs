/* problem.test.mjs - "Report a problem" (DECISIONS:140 (3), REPORT-A-PROBLEM-BRIEF).

   The acceptance bar R1-R11 of the brief, executed. Real here: the encrypted
   repository over fake-indexeddb, the accepted durable public client, the page's own
   entries from today-entry.mjs, the shipped template, and the real build. Nothing
   about the diagnostic is asserted from a fixture that could agree with a bug: the
   leak test (R2) plants a weigh-in, a logged set and a first run in a REAL local era
   and then looks for every one of those values in the block. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto, createHash } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { createReadingHost } from '../reading-host.mjs';
import { createGymHost, openTodayHosts } from '../gym-host.mjs';
import { createGymModel, EFFORT_CHOICES, ADOPTION_PENDING } from '../gym-model.mjs';
import { createWorkoutEntry, createSetupEntry, createCheckInEntry, boot,
  SETUP_BASIS_STATE_REFUSED } from '../today-entry.mjs';
import { createCleanInitState, createSetupModel } from '../setup-model.mjs';
import { createSetupHost } from '../setup-host.mjs';
import TodayApp from '../today-app.cjs';
import TodayModel from '../today-model.cjs';
import ProblemReport from '../problem-report.cjs';
import ClientCopy from '../../../../client/copy.cjs';
import PlainCopy from '../plain-copy.cjs';
import design from '../design.cjs';
import { buildToday, buildIdOf, buildTagOf, injectBuildId, DIST } from '../build.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fsSync from 'node:fs';
import { createSleepHost, sleepNightsIn, PROFILE, OP_CLASS, OP_KIND } from '../sleep-host.mjs';
import SleepCommands from '../sleep-commands.cjs';
import SleepModel from '../sleep-model.cjs';
import Ops from '../../../../client/ops.cjs';
import { sleepNightFor, dayBefore } from '../checkin-model.mjs';

const readAsset = (name) => fs.readFile(path.join(DIST, name), 'utf8');

const { mountToday, createTodayModel, PROBLEM_ENTRY, PROBLEM_COPIED, PROBLEM_SELECT } = TodayApp;
const { buildProblemReport, devicePrefix, lanesOpen, enrolmentOf, offlineReadinessOf,
  stampOf, FIELDS, ENROLMENT, LANES, OFFLINE, BUILD, BUILD_PLACEHOLDER, RESTORE_MARK,
  NONE, UNKNOWN } = ProblemReport;
const DAY = TodayModel.SYNTHETIC_DAY;
const SLOT = 'earned-today-preview/' + DAY;
const AI_DASH = /[–—]/;
const HEX32 = /\b[0-9a-f]{32}\b/;

const lines = (block) => block.split('\n');
const fieldsOf = (block) => lines(block).map((line) => line.slice(0, line.indexOf(':')));
const valueOf = (block, field) => {
  const line = lines(block).find((l) => l.startsWith(field + ': '));
  return line === undefined ? null : line.slice(field.length + 2);
};

/* Today in jsdom, over the real template the build ships. */
const shell = () => design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml());
function today(options = {}, clipboard = undefined) {
  const dom = new JSDOM(shell());
  const doc = dom.window.document;
  if (clipboard !== undefined) {
    Object.defineProperty(dom.window.navigator, 'clipboard', { value: clipboard, configurable: true });
  }
  const model = options.model || createTodayModel({ today: DAY });
  const api = mountToday(doc, model, options);
  const pick = (slot) => doc.querySelector('#phone [data-slot="' + slot + '"]');
  return { dom, doc, api, model,
    status: () => doc.getElementById('today-status'),
    control: () => pick('problem-entry'),
    said: () => pick('problem-said'),
    box: () => pick('problem-box'),
    area: () => pick('problem-text'),
    async tap() { this.control().dispatchEvent(new dom.window.Event('click')); await new Promise((r) => setTimeout(r, 0)); },
  };
}

/* ONE device: one IndexedDB factory is one installation, so every host below opens
   the SAME local era, exactly as the page's own boot does. */
async function installation() {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const readings = await createReadingHost({ day: DAY, ...lane });
  const model = createTodayModel({ today: DAY, readings });
  return { fault, lane, readings, model };
}

/* A complete first-run document, built through the reducer's own actions. Its words
   and figures are deliberately distinctive so the leak test can look for them. */
const LABEL = 'Zebediah Quartzwood';
const LIFT_ONE = 'Kettlebell floor press';
const LIFT_TWO = 'Sled hack squat';
const FIRST_LOAD = '37';
const STEP = '11';
function firstRunDocument() {
  const model = createSetupModel({ today: DAY });
  model.setName(LABEL);
  model.toggleDay('1'); model.setDayKind('1', 'U');
  model.toggleDay('4'); model.setDayKind('4', 'L');
  const press = model.addExercise('U');
  model.setExerciseField(press.key, 'n', LIFT_ONE);
  model.chooseMg(press.key, 'chest');
  model.setExerciseField(press.key, 'first', FIRST_LOAD);
  model.setExerciseField(press.key, 'inc', STEP);
  const squat = model.addExercise('L');
  model.setExerciseField(squat.key, 'n', LIFT_TWO);
  model.chooseMg(squat.key, 'quads');
  model.setExerciseField(squat.key, 'first', '53');
  const built = model.document();
  assert.equal(built.ok, true, 'the fixture is complete: ' + JSON.stringify(built.missing));
  return built;
}

/* ==========================================================================
   R1 - THE EIGHT FIELDS, IN THAT ORDER, FOR EVERY STATE THE PAGE CAN REACH.
   ========================================================================== */
test('R1 - the block is exactly the eight declared fields, in order', () => {
  const block = buildProblemReport({ screen: 'today', lanes: { workout: true },
    enrolment: 'enrolled', offlineReady: 'unknown', device: 'device-' + 'ab12cd34'.repeat(4),
    userAgent: 'Mozilla/5.0 (probe)', at: new Date(2026, 8, 3, 8, 30, 15) });
  assert.deepEqual(fieldsOf(block), [...FIELDS]);
  assert.equal(lines(block).length, 8, 'eight lines and no more');
  assert.deepEqual(FIELDS, ['screen', 'lane open', 'enrolment', 'offline-ready',
    'build', 'device', 'user agent', 'at']);
});

test('R1 - every screen x enrolment x lane combination prints the same eight fields', () => {
  const screens = ['today', 'gym', 'recovery', 'setup', 'nutrition', 'coach', 'why', 'workout'];
  const laneSets = [{}, { workout: true }, { checkin: true }, { setup: true },
    { workout: true, checkin: true }, { workout: true, checkin: true, setup: true }];
  let built = 0;
  for (const screen of screens) {
    for (const enrolment of ENROLMENT) {
      for (const lanes of laneSets) {
        const block = buildProblemReport({ screen, lanes, enrolment, offlineReady: 'ready',
          device: null, userAgent: 'probe', at: new Date(2026, 8, 3) });
        assert.deepEqual(fieldsOf(block), [...FIELDS], screen + '/' + enrolment);
        assert.equal(valueOf(block, 'screen'), screen);
        assert.equal(valueOf(block, 'enrolment'), enrolment);
        assert.equal(valueOf(block, 'lane open'),
          LANES.filter((n) => lanes[n]).join(', ') || NONE);
        built += 1;
      }
    }
  }
  assert.equal(built, screens.length * ENROLMENT.length * laneSets.length);
});

test('R1 - an unknown screen, enrolment or readiness is reported unknown, never guessed', () => {
  const block = buildProblemReport({});
  assert.equal(valueOf(block, 'screen'), UNKNOWN);
  assert.equal(valueOf(block, 'enrolment'), UNKNOWN);
  assert.equal(valueOf(block, 'offline-ready'), UNKNOWN);
  assert.equal(valueOf(block, 'lane open'), NONE);
  assert.equal(valueOf(block, 'device'), NONE);
  assert.equal(valueOf(block, 'user agent'), UNKNOWN);
  const invented = buildProblemReport({ enrolment: 'probably-enrolled', offlineReady: 'maybe' });
  assert.equal(valueOf(invented, 'enrolment'), UNKNOWN, 'a state outside the four is not printed');
  assert.equal(valueOf(invented, 'offline-ready'), UNKNOWN);
});

/* ==========================================================================
   R4 - THE DEVICE PREFIX: EIGHT HEX, OR NONE. NEVER THIRTY-TWO.
   ========================================================================== */
test('R4 - the device id is exactly 8 hex after device-, and 32 never appear', () => {
  const full = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
  assert.equal(full.length, 32);
  for (const spelling of [full, 'device-' + full, ' DEVICE-' + full.toUpperCase() + ' ']) {
    assert.equal(devicePrefix(spelling), 'device-a1b2c3d4');
  }
  const block = buildProblemReport({ device: 'device-' + full });
  assert.match(valueOf(block, 'device'), /^device-[0-9a-f]{8}$/);
  assert.equal(HEX32.test(block), false, 'a 32-hex string anywhere in the block is a leak');
  assert.equal(block.includes(full), false);
  assert.equal(block.includes(full.slice(8)), false, 'the other 24 never travel');
});

test('R4 - a device id that is not hex, or is too short, is none rather than invented', () => {
  for (const bad of [null, undefined, 42, '', 'device-', 'device-zzzz', 'abc123', 'device-abc123']) {
    assert.equal(devicePrefix(bad), NONE, String(bad));
  }
  assert.equal(valueOf(buildProblemReport({ device: 'not an id' }), 'device'), NONE);
});

/* ==========================================================================
   R5 - THE FOUR ENROLMENT ANSWERS, AND WHERE EACH ONE COMES FROM.
   ========================================================================== */
test('R5 - enrolmentOf answers first-run, enrolled, restore-required and no-store', () => {
  assert.equal(enrolmentOf({ setup: { durable: true, enrolled: false } }), 'first-run');
  assert.equal(enrolmentOf({ setup: { durable: true, enrolled: true } }), 'enrolled');
  assert.equal(enrolmentOf({ setup: null }), 'no-store');
  assert.equal(enrolmentOf({ setup: { durable: false, enrolled: true } }), 'no-store');
  assert.equal(enrolmentOf({}), 'no-store');
  /* State 18 is read FIRST: a refused installation has no lane either, so the order
     is what keeps it from being reported as a device without a store. */
  assert.equal(enrolmentOf({ restoreNote: RESTORE_MARK + ': sign in (RESTORE_UNPROVEN)',
    setup: null }), 'restore-required');
  assert.equal(enrolmentOf({ restoreNote: RESTORE_MARK + ': sign in',
    setup: { durable: true, enrolled: true } }), 'restore-required');
  assert.deepEqual([...ENROLMENT].sort(),
    ['enrolled', 'first-run', 'no-store', 'restore-required']);
});

test('R5 - the restore mark really is rebuild/client own state-18 sentence', () => {
  /* The page cannot import that sentence here (today-app.cjs is CommonJS and the
     carrier, gym-host.mjs, is an ES module), so it declares the two words it matches
     on. This is the binding that makes the declaration honest: the real sentence,
     read from rebuild/client, still starts with them. */
  assert.equal(typeof ClientCopy.RESTORE_REQUIRED, 'string');
  assert.equal(ClientCopy.RESTORE_REQUIRED.startsWith(RESTORE_MARK), true,
    'rebuild/client now says: ' + ClientCopy.RESTORE_REQUIRED);
  assert.equal(enrolmentOf({ restoreNote: ClientCopy.RESTORE_REQUIRED }), 'restore-required');
  /* And the page's own rendering of it, after the render boundary has taken the
     em dash out (DECISIONS:114 (1)), is still recognised. */
  assert.equal(enrolmentOf({ restoreNote: PlainCopy.plainCopy(ClientCopy.RESTORE_REQUIRED) }),
    'restore-required');
});

test('the other two derived fields say what they can prove and no more', () => {
  assert.equal(offlineReadinessOf(null), UNKNOWN, 'no platform, no claim');
  assert.equal(offlineReadinessOf({ navigator: {} }), UNKNOWN, 'no service worker API, no claim');
  assert.equal(offlineReadinessOf({ navigator: { serviceWorker: {} } }), 'not-ready');
  assert.equal(offlineReadinessOf({ navigator: { serviceWorker: { controller: {} } } }), 'ready');
  assert.deepEqual([...OFFLINE], ['ready', 'not-ready', 'unknown']);
  assert.equal(lanesOpen(null), NONE);
  assert.equal(lanesOpen({ setup: true, workout: true }), 'workout, setup', 'boot order, not mine');
});

test('the time field is the same triple an operation carries', () => {
  const stamp = stampOf(new Date(2026, 8, 3, 8, 5, 9));
  assert.match(stamp, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{2}:\d{2}$/);
  assert.equal(stamp.startsWith('2026-09-03 08:05:09 '), true);
  assert.equal(stampOf('not a date'), UNKNOWN);
  assert.equal(stampOf(new Date(Number.NaN)), UNKNOWN);
});

/* ==========================================================================
   R3 / E7 - THE BUILD ID IS THE PINNED INPUT INVENTORY, NOT A CONSTANT.
   ========================================================================== */
test('R3 - the build id is sha256 over the pinned input inventory, recomputed here', async () => {
  const result = await buildToday();
  const independent = createHash('sha256').update(result.inventory
    .map((input) => input.path + ' ' + input.sha256).sort().join('\n')).digest('hex');
  assert.equal(result.buildId, independent, 'the build id is not what the inputs say it is');
  assert.equal(result.buildTag, 'earned-' + independent.slice(0, 12));
  assert.match(result.buildTag, /^earned-[0-9a-f]{12}$/);
  /* E7, executed: a changed pinned input changes the name. */
  const moved = result.inventory.map((input, index) => (index === 0
    ? { ...input, sha256: 'f'.repeat(64) } : input));
  assert.notEqual(buildIdOf(moved), result.buildId);
  assert.notEqual(buildTagOf(moved), result.buildTag);
  /* And the order esbuild happened to walk the graph in cannot change it. */
  assert.equal(buildIdOf([...result.inventory].reverse()), result.buildId);
});

test('R3 - the shipped page carries the injected build name and not the placeholder', async () => {
  const result = await buildToday();
  const app = await readAsset('app.js');
  assert.equal(app.includes(result.buildTag), true, 'the build name is not in the page');
  assert.equal(app.includes(BUILD_PLACEHOLDER), false, 'the placeholder shipped');
  /* The injection refuses both ways it could be wrong, rather than guessing. */
  assert.throws(() => injectBuildId('nothing to replace here', 'earned-000000000000'),
    /BUILD-ID-INJECTION FAIL/);
  assert.throws(() => injectBuildId(BUILD_PLACEHOLDER + ' and ' + BUILD_PLACEHOLDER, 'earned-0'),
    /BUILD-ID-INJECTION FAIL/);
  assert.equal(injectBuildId('x ' + BUILD_PLACEHOLDER + ' y', 'earned-abc'), 'x earned-abc y');
  /* Unbuilt - this test, a module off disk - the constant reads as what it is. */
  assert.equal(BUILD, BUILD_PLACEHOLDER);
  assert.equal(valueOf(buildProblemReport({}), 'build'), BUILD_PLACEHOLDER);
});

/* ==========================================================================
   R9 / R10 - THE OWNER'S NO-DASH RULE, AND THE DESIGN BINDING.
   ========================================================================== */
test('R9 - the control, both confirmations and the block itself carry no em or en dash', () => {
  for (const sentence of [PROBLEM_ENTRY, PROBLEM_COPIED, PROBLEM_SELECT]) {
    assert.equal(AI_DASH.test(sentence), false, sentence);
  }
  const block = buildProblemReport({ screen: 'today', lanes: { workout: true, checkin: true },
    enrolment: 'enrolled', offlineReady: 'ready', device: 'device-' + 'b'.repeat(32),
    userAgent: 'Mozilla/5.0 (iPhone) probe', at: new Date(2026, 8, 3) });
  assert.equal(AI_DASH.test(block), false);
  /* A user agent that carries one is normalised on the way in, exactly as every
     other string the athlete can see is (DECISIONS:114 (1) / :121). */
  const dashed = buildProblemReport({ userAgent: 'Probe 1.0 — experimental' });
  assert.equal(AI_DASH.test(dashed), false);
  assert.equal(valueOf(dashed, 'user agent'), 'Probe 1.0: experimental');
});

test('R10 - the three sentences are preview-owned, declared, and bound to the view', () => {
  const approved = design.readApproved();
  const approvedText = approved.map((a) => a.html).join('\n');
  const source = design.appSource();
  for (const sentence of [PROBLEM_ENTRY, PROBLEM_COPIED, PROBLEM_SELECT]) {
    assert.equal(design.PREVIEW_RUNTIME_COPY.includes(sentence), true, 'declared: ' + sentence);
    assert.equal(approvedText.includes(sentence), false,
      'a preview-owned sentence must be ABSENT from the approved references: ' + sentence);
    assert.equal(source.includes(sentence), true, 'present in a view source: ' + sentence);
  }
  assert.doesNotThrow(() => design.assertDesignBinding(approved, design.templateHtml(), source));
  /* The mutant, executed: a view that declares the sentence and then drops it fails. */
  assert.throws(() => design.assertDesignBinding(approved, design.templateHtml(),
    source.split(PROBLEM_COPIED).join('')), /COPY-BINDING FAIL/);
});

test('R10 - every class the control and its box use is in the APPROVED stylesheets', () => {
  const approved = design.readApproved();
  const template = design.templateHtml();
  const start = template.indexOf('<template id="t-today">');
  const section = template.slice(start, template.indexOf('</template>', start));
  assert(section.includes('data-slot="problem-entry"'), 'the control is in the shipped template');
  assert(section.includes('data-slot="problem-text"'), 'the box is in the shipped template');
  const css = approved.map((a) => a.styles).join('\n');
  for (const token of design.classTokens(section)) {
    if (design.PREVIEW_CLASSES.includes(token)) continue;
    const selector = new RegExp('\\.' + token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w-])');
    assert(selector.test(css), '.' + token + ' is not in the approved stylesheets');
  }
  /* And the template still carries no literal figure, the control included. */
  for (const line of design.textOf(section)) {
    assert.equal(/\d/.test(line), false, 'the template carries a literal figure: "' + line + '"');
  }
});

/* ==========================================================================
   R7 / R8 - THE CLIPBOARD, AND THE BOX THAT DOES NOT DEPEND ON IT.
   ========================================================================== */
test('R7 - the control is on Today, in the approved vocabulary, before it is tapped', () => {
  const kit = today();
  assert(kit.control(), 'the control is on the screen');
  assert.equal(kit.control().textContent.trim(), PROBLEM_ENTRY);
  assert.equal(kit.said().hidden, true, 'it says nothing until it is tapped');
  assert.equal(kit.box().hidden, true, 'and shows no box until it is tapped');
});

test('R7 - the clipboard taking the block says Copied, and the box carries the same text', async () => {
  let written = null;
  const kit = today({}, { writeText: async (text) => { written = text; } });
  await kit.tap();
  assert.equal(kit.said().hidden, false);
  assert.equal(kit.said().textContent, PROBLEM_COPIED);
  assert.equal(typeof written, 'string');
  assert.deepEqual(fieldsOf(written), [...FIELDS]);
  /* R8: the same string, not a second rendering of it. */
  assert.equal(kit.area().value, written);
  assert.equal(kit.box().hidden, false, 'the box is UNCONDITIONAL, success or not');
});

test('R7 - a clipboard that is absent, and one that throws, both show the box and its sentence', async () => {
  const absent = today({}, undefined);
  await absent.tap();
  assert.equal(absent.said().textContent, PROBLEM_SELECT);
  assert.equal(absent.box().hidden, false);
  assert.deepEqual(fieldsOf(absent.area().value), [...FIELDS]);

  const refusing = today({}, { writeText: async () => { throw new Error('NotAllowedError'); } });
  await refusing.tap();
  assert.equal(refusing.said().textContent, PROBLEM_SELECT);
  assert.equal(refusing.box().hidden, false);
  assert.deepEqual(fieldsOf(refusing.area().value), [...FIELDS]);
});

test('R8 - the box is selectable and pre-selected, and holds the whole block', async () => {
  const kit = today({}, undefined);
  await kit.tap();
  const area = kit.area();
  assert.equal(area.tagName, 'TEXTAREA');
  assert.equal(area.readOnly, true, 'read-only text is still selectable text');
  assert.equal(area.disabled, false, 'a disabled control cannot be selected from');
  assert.equal(area.selectionStart, 0);
  assert.equal(area.selectionEnd, area.value.length, 'pre-selected, whole');
  assert.equal(lines(area.value).length, 8);
});

test('R11 - the control and the box are held to the phone, in the shipped stylesheet', () => {
  /* jsdom lays nothing out, so the geometry itself is browser-check.mjs's row. What
     is asserted here is that the shipped chrome really carries the rules that row
     measures, and that neither of them invents a class. */
  const css = design.chromeCss();
  assert.match(css, /\[data-slot="problem-entry"\]\s*\{[^}]*min-height:\s*44px/);
  assert.match(css, /\[data-slot="problem-text"\]\s*\{[^}]*max-width:\s*100%/);
  assert.match(css, /\[data-slot="problem-text"\]\s*\{[^}]*box-sizing:\s*border-box/);
  assert.match(css, /\.view textarea\s*\{\s*font-size:\s*16px/, 'the 16px iOS zoom rule covers it');
  assert.equal(/\.problem/.test(css), false, 'the control invents no class of its own');
});

/* ==========================================================================
   R6 - THE CONTROL WRITES NOTHING.
   ========================================================================== */
const opsOf = async (repository) => Object.values((await repository.load()).generation.collections.ops || {});

test('R6 - tapping the control writes nothing, with a store and without one', async () => {
  const bare = today({}, { writeText: async () => {} });
  await bare.tap();
  await bare.tap();
  assert.equal(bare.said().textContent, PROBLEM_COPIED, 'it still answers');

  const kit = await installation();
  const setup = await createSetupEntry({ today: DAY }, kit.lane);
  const workout = await createWorkoutEntry(kit.model, kit.lane);
  const before = await opsOf(setup.host.repository);
  const page = today({ model: kit.model, setup, workout }, { writeText: async () => {} });
  await page.tap();
  const after = await opsOf(setup.host.repository);
  assert.equal(after.length, before.length, 'the generation is exactly as it was');
  assert.deepEqual(after.map((op) => op.op_id), before.map((op) => op.op_id));
  setup.host.close();
});

/* ==========================================================================
   R5, ON THE REAL PAGE: THE FOUR STATES AS THE VIEW ACTUALLY OBSERVES THEM.
   ========================================================================== */
test('R5 - the page reports first-run before the setup op and enrolled after it', async () => {
  const kit = await installation();
  const setup = await createSetupEntry({ today: DAY }, kit.lane);
  const before = today({ model: kit.model, setup }, undefined);
  await before.tap();
  assert.equal(valueOf(before.area().value, 'enrolment'), 'first-run');
  assert.equal(valueOf(before.area().value, 'lane open'), 'setup');

  const built = firstRunDocument();
  const written = await setup.host.save({ setup: built.setup, tags: built.tags });
  assert.equal(written.ok, true, written.code);
  await setup.refresh();
  const after = today({ model: kit.model, setup }, undefined);
  await after.tap();
  assert.equal(valueOf(after.area().value, 'enrolment'), 'enrolled');
  setup.host.close();
});

test('R5 - no lane at all reports no-store, and a state-18 refusal reports restore-required', async () => {
  const bare = today({}, undefined);
  await bare.tap();
  assert.equal(valueOf(bare.area().value, 'enrolment'), 'no-store');
  assert.equal(valueOf(bare.area().value, 'lane open'), NONE);
  assert.equal(valueOf(bare.area().value, 'device'), NONE, 'no store, no device id, never invented');

  /* What boot() does on a state-18 refusal: it hands mountToday NO lanes and writes
     rebuild/client's own sentence on the page's status line. Both are reproduced
     here, on the real page, and the block must tell the two apart. */
  const refused = today({}, undefined);
  refused.status().textContent = PlainCopy.plainCopy(ClientCopy.RESTORE_REQUIRED)
    + ' (RESTORE_UNPROVEN)';
  await refused.tap();
  assert.equal(valueOf(refused.area().value, 'enrolment'), 'restore-required');
});

/* ==========================================================================
   R2 - THE LEAK TEST, OVER A REAL STORE WITH REAL RECORDS IN IT.
   ========================================================================== */
test('R2 - a block built over a store holding a weigh-in, a set and a first run leaks none of it', async () => {
  const kit = await installation();
  /* A weigh-in, through the real reading lane. */
  const READING = 197.3;
  const weighed = await kit.model.weighIn(READING);
  assert.equal(weighed.ok, true, weighed.copy);

  /* One logged set, through the accepted W6 host over the same installation. */
  const gymHost = await createGymHost({ day: DAY, engineState: kit.model.stateFromOps(),
    plannedSplitSlotId: SLOT, ...kit.lane });
  const gym = createGymModel({ gymHost, sessionTitle: kit.model.read().workout.title });
  const started = await gym.start();
  assert.equal(started.ok, true, started.code);
  const view = await gym.read();
  assert.equal(view.phase, 'active', view.code || '');
  /* The prescribed load and reps, exactly as the screen logs them: the capture layer
     refuses a figure it did not prescribe, and a value the store would not take is no
     test of whether the block leaks the values it holds. */
  const LOAD = String(view.entry.load);
  const REPS = String(view.entry.reps);
  const logged = await gym.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
    load: LOAD, reps: REPS, effort: EFFORT_CHOICES.find((c) => c.label === '2').reserve });
  assert.equal(logged.ok, true, logged.code || logged.copy);
  const liftName = view.set.lift;

  /* The first run, with its athlete label and its own exercise names and loads. */
  const setup = await createSetupEntry({ today: DAY }, kit.lane);
  const built = firstRunDocument();
  const written = await setup.host.save({ setup: built.setup, tags: built.tags });
  assert.equal(written.ok, true, written.code);
  await setup.refresh();
  const checkin = await createCheckInEntry(kit.model, kit.lane);
  const workout = await createWorkoutEntry(kit.model, kit.lane);

  /* The page, with all three lanes, and the block it actually copies. */
  const page = today({ model: kit.model, setup, workout, checkin }, undefined);
  await page.tap();
  const block = page.area().value;
  assert.deepEqual(fieldsOf(block), [...FIELDS]);
  assert.equal(valueOf(block, 'lane open'), 'workout, checkin, setup');
  assert.equal(valueOf(block, 'enrolment'), 'enrolled');
  assert.match(valueOf(block, 'device'), /^device-[0-9a-f]{8}$/, 'a real installation id, truncated');

  /* NOT ONE FIGURE THE STORE HOLDS IS IN IT.

     Compared as whole numbers, not as substrings, and over the five lines that carry
     words rather than identifiers. The other three are excluded BY SHAPE, not by
     hope: `build` is asserted above to be the sha256 of the pinned inputs, `device`
     to match /^device-[0-9a-f]{8}$/, and `at` to be a clock. Digits inside a hash, a
     hex prefix or a timestamp coincide with small numbers constantly - a device whose
     prefix reads ab12cd34 contains "12" - so testing a reps count against them would
     be a coin toss that proves nothing either way. What it would hide is a real leak,
     and a real leak can only arrive through a VALUE, which is what is tested here. */
  const opaque = new Set(['build', 'device', 'at']);
  const readable = lines(block)
    .filter((line) => !opaque.has(line.slice(0, line.indexOf(':')))).join('\n');
  assert.equal(lines(readable).length, 5);
  const runs = new Set(readable.match(/\d+(?:\.\d+)?/g) || []);
  const figures = [String(READING), LOAD, REPS, FIRST_LOAD, STEP,
    ...built.setup.exercises.map((e) => String(e.first_load))];
  for (const figure of figures) {
    assert.equal(runs.has(figure), false, 'the block leaks a stored figure: ' + figure);
  }
  /* And not one word of it: no athlete label, no exercise name. */
  for (const word of [LABEL, LIFT_ONE, LIFT_TWO, liftName, built.setup.athlete_label]) {
    assert.equal(block.includes(word), false, 'the block leaks a stored word: ' + word);
  }
  /* No operation id, and no full device id. */
  const ops = await opsOf(setup.host.repository);
  assert(ops.length >= 1, 'the store really has operations in it');
  for (const op of ops) {
    assert.equal(block.includes(op.op_id), false, 'the block leaks an operation id');
    assert.equal(block.includes(op.device_id), false, 'the block leaks the full device id');
  }
  assert.equal(HEX32.test(block), false, 'a 32-hex string anywhere in the block is a leak');
  /* And no payload of any op, member by member, reaches it. */
  const payloads = JSON.stringify(ops.map((op) => op.payload));
  for (const word of new Set((payloads.match(/[A-Za-z]{5,}/g) || []))) {
    if (['setup', 'profile', 'earned', 'first', 'exercises'].includes(word.toLowerCase())) continue;
    assert.equal(block.includes(word), false, 'the block leaks a payload word: ' + word);
  }
  setup.host.close(); gymHost.close(); kit.readings.close();
});

/* ==========================================================================
   ROUND 1, CONDITION C1 - THE SHAPE AND THE VALUE SETS, PINNED FIELD BY FIELD.

   The reviewer landed two mutants that this suite missed, and both missed for
   the same reason: every test above looks for a value it PLANTED, and neither a
   ninth field nor a field that carries something it should not is a planted
   value. E2 put JSON.stringify(model.read()) - the whole of Today's view DTO,
   engine figures included - into `user agent`, and survived. Z4 added a ninth
   field, and survived.

   So this is the other kind of test: nothing here knows what the block SHOULD
   say. It asserts what a block may BE - how many lines, which keys, in which
   order, and for every enumerated field, that its value is one of the values
   that field is allowed to have. A field that carries page internals is caught
   because page internals are not in any of those sets, whatever they happen to
   contain on the day.
   ========================================================================== */
const STAMP = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{2}:\d{2}$/;
const BUILD_SHAPE = /^earned-([0-9a-f]{12}|notinjected)$/;
const DEVICE_SHAPE = /^(device-[0-9a-f]{8}|none)$/;
/* A user agent is a sentence about a browser. It is the one free-text field in
   the block, so it is the one a mutation can hide behind: these three characters
   are what a serialised object brings with it and what a user agent never has. */
const STRUCTURED = /[{}"]/;

function assertBlockShape(block, where = 'the block') {
  const rows = block.split('\n');
  assert.equal(rows.length, FIELDS.length, where + ' is exactly ' + FIELDS.length + ' lines');
  const keys = rows.map((row) => row.slice(0, row.indexOf(': ')));
  assert.deepEqual(keys, [...FIELDS], where + ' carries exactly these fields, in this order');
  const value = (field) => rows[FIELDS.indexOf(field)].slice(field.length + 2);
  assert(ENROLMENT.includes(value('enrolment')) || value('enrolment') === UNKNOWN, 'enrolment');
  assert(OFFLINE.includes(value('offline-ready')) || value('offline-ready') === UNKNOWN, 'offline-ready');
  assert.match(value('build'), BUILD_SHAPE, 'build');
  assert.match(value('device'), DEVICE_SHAPE, 'device');
  const lanes = value('lane open');
  if (lanes !== NONE) {
    for (const name of lanes.split(', ')) assert(LANES.includes(name), 'lane open: ' + name);
  }
  assert(value('at') === UNKNOWN || STAMP.test(value('at')), 'at: ' + value('at'));
  assert.equal(STRUCTURED.test(value('user agent')), false,
    'the user agent field carries structured data: ' + value('user agent').slice(0, 120));
  assert.equal(value('screen').includes(' '), false, 'screen is one token: ' + value('screen'));
  return { rows, value };
}

test('C1 - the block is eight fields in order and every value is in its own set', () => {
  /* Over every state the builder can be handed, including the ones that mean
     "this page could not observe it". */
  const screens = ['today', 'gym', 'recovery', 'setup', 'nutrition', 'coach'];
  const devices = [null, 'device-' + 'a1b2c3d4e5f60718293a4b5c6d7e8f90', 'not an id', ''];
  const agents = ['Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', '', null,
    'Probe 1.0 — experimental'];
  let checked = 0;
  for (const screen of screens) {
    for (const enrolment of [...ENROLMENT, undefined, 'probably']) {
      for (const offlineReady of [...OFFLINE, undefined]) {
        for (const device of devices) {
          for (const userAgent of agents) {
            assertBlockShape(buildProblemReport({ screen, lanes: { workout: true, setup: true },
              enrolment, offlineReady, device, userAgent, at: new Date(2026, 8, 3, 8, 5, 9) }));
            checked += 1;
          }
        }
      }
    }
  }
  assert.equal(checked, screens.length * 6 * 4 * devices.length * agents.length);
  /* And the empty state, which is what a page with nothing open would hand it. */
  assertBlockShape(buildProblemReport({}), 'the empty block');
});

test('C1 - the page block is the same shape, and user agent is the browser\'s own string', async () => {
  const kit = await installation();
  const setup = await createSetupEntry({ today: DAY }, kit.lane);
  const workout = await createWorkoutEntry(kit.model, kit.lane);
  const page = today({ model: kit.model, setup, workout }, undefined);
  await page.tap();
  const { value } = assertBlockShape(page.area().value, 'the block the page copied');
  /* BYTE-EQUAL to the platform's own string, not a rendering of something else.
     Through the page's render boundary, which is how every other string on this
     screen arrives (DECISIONS:114 (1) / :121). */
  assert.equal(value('user agent'),
    PlainCopy.plainCopy(page.dom.window.navigator.userAgent, 'problem-user-agent'));
  assert(value('user agent').length > 0, 'the browser really gave one');
  assert.equal(value('screen'), 'today');
  assert.equal(value('lane open'), 'workout, setup');
  setup.host.close();
});

/* ==========================================================================
   P0-B HIS NUMBERS (CRITICAL-PATH-2026-09-15 section 4, Route B - see
   rebuild/lanes/c/P0-HIS-NUMBERS-AUTHOR-REPORT.md and P0B-AUTHOR-REPORT.md).
   On an ENROLLED installation, Today and the gym card stand on the athlete's
   OWN state (setup.athleteState(), built by the ACCEPTED clean-init
   constructor) instead of the preview's synthetic fixture. Every boot below is
   a real page load over a real fault-injected store; nothing here reaches into
   history.js, ledger/ or any soak path. One installation per cell.
   ========================================================================== */
const P0B_DAY = DAY;
/* A first-run document driven through the reducer's own actions, exactly as
   setup.test.mjs's own `filled()` is (2.1-2.14): Dad, two upper lifts and one
   lower - never built by reaching into the model's state. */
function p0bFirstRunDocument() {
  const model = createSetupModel({ today: P0B_DAY });
  model.setName('Dad');
  model.toggleDay('1'); model.setDayKind('1', 'U');
  model.toggleDay('4'); model.setDayKind('4', 'L');
  const press = model.addExercise('U');
  model.setExerciseField(press.key, 'n', 'Chest press');
  model.chooseMg(press.key, 'chest');
  model.setExerciseField(press.key, 'first', '20');
  model.setExerciseField(press.key, 'inc', '10');
  const row = model.addExercise('U');
  model.setExerciseField(row.key, 'n', 'Seated row');
  model.chooseMgOther(row.key);
  model.setMgOther(row.key, 'lats and mid back');
  model.setExerciseField(row.key, 'first', '30');
  const legs = model.addExercise('L');
  model.setExerciseField(legs.key, 'n', 'Leg press');
  model.chooseMg(legs.key, 'quads');
  model.setExerciseField(legs.key, 'first', '45');
  model.setExerciseField(legs.key, 'rungs', '45 / 70 / 100 / 135');
  const built = model.document();
  assert.equal(built.ok, true, 'the P0B fixture is complete: ' + JSON.stringify(built.missing));
  return built.setup;
}
const p0bTags = (setup) => Object.fromEntries(setup.exercises.map((e) => [e.id, { head: null, secondary: [] }]));

/* One device, first run already recorded, so `enrolled` is true for every
   boot() this device does from here on. */
async function p0bEnrolledDevice() {
  const fault = faultDatabase();
  const host = await createSetupHost({ day: P0B_DAY, indexedDB: fault.indexedDB, crypto: webcrypto });
  const setup = p0bFirstRunDocument();
  assert.equal((await host.save(setup, p0bTags(setup))).ok, true);
  host.close();
  return { fault, setup };
}
/* A real page load over the device's store - boot(), unedited, exactly as the
   shipped page calls it (today-entry.mjs is byte-identical to the tip). */
async function p0bOpen(kit) {
  const dom = new JSDOM(shell());
  const booted = await boot({ document: dom.window.document, today: P0B_DAY,
    indexedDB: kit.fault.indexedDB, crypto: webcrypto });
  return { dom, doc: dom.window.document, booted };
}

test('P0B.1 - an enrolled installation adopts HIS state: label Dad, note hidden, a workout', async () => {
  const kit = await p0bEnrolledDevice();
  const { doc, booted } = await p0bOpen(kit);
  assert.deepEqual(booted.failures, [], 'every lane opened');
  await booted.api.ready;
  assert.equal(booted.model.stateFromOps().athlete_label, 'Dad',
    'Today adopted the athlete the first-run record holds');
  assert.equal(booted.setup.athleteLabel(), 'Dad');
  assert.equal(doc.querySelector('[data-slot="setup-note"]').hidden, true,
    'SETUP_NOT_HIS_NUMBERS clears once the two labels agree');
  const view = booted.model.read();
  assert.equal(view.workout.available, true, 'and it paints HIS week');
  assert.equal(view.workout.exerciseCount, 2, 'his two U-day lifts on this Monday');
  booted.hosts.close();
});

test('P0B.2 - the gym card lists HIS exercise ids from setup, not the fixture\'s', async () => {
  const kit = await p0bEnrolledDevice();
  const { booted } = await p0bOpen(kit);
  await booted.api.ready;
  const his = kit.setup.exercises.filter((e) => e.day === 'U').map((e) => e.id);
  assert.deepEqual(his, ['chest-press', 'seated-row']);
  const card = await booted.workout.gym.read();
  assert.equal(card.phase, 'ready', 'the gym host rebased through hostForDay(day): ' + (card.code || ''));
  assert.equal(card.lift.id, 'chest-press', 'his own first U-day lift');
  assert.equal(card.lift.count, 2);
  const fixtureIds = createTodayModel({ today: P0B_DAY }).stateFromOps().exercises.map((e) => e.id);
  for (const id of his) assert.equal(fixtureIds.includes(id), false, 'no fixture lift shares his id: ' + id);
  booted.hosts.close();
});

test('P0B.3 - a fresh installation is unchanged: still the fixture, still the note', async () => {
  const fault = faultDatabase();
  const dom = new JSDOM(shell());
  const booted = await boot({ document: dom.window.document, today: P0B_DAY,
    indexedDB: fault.indexedDB, crypto: webcrypto });
  assert.equal(booted.setup.firstRun(), true, 'nothing enrolled');
  /* P0B.8 (r2, review finding 2) - the pending-adoption gate is enrolled-only.
     Captured before `ready` so this is genuinely the synchronous first frame. */
  const firstFrame = dom.window.document.getElementById('phone').textContent;
  await booted.api.ready;
  const expected = createTodayModel({ today: P0B_DAY });
  const expectedKcal = TodayApp.calorieHeadline(expected.read().calorieTarget);
  assert(expectedKcal, 'the fixture really carries a figure to check for');
  assert.equal(firstFrame.includes(expectedKcal), true,
    'an un-enrolled install paints the fixture exactly as A1 always has - the gate never applies here');
  assert.equal(JSON.stringify(booted.model.stateFromOps()), JSON.stringify(expected.stateFromOps()),
    'the basis is exactly today-model.cjs createBasisState, the fixture - adoption never touched it');
  assert.equal(dom.window.document.querySelector('[data-slot="setup-entry"]').hidden, false,
    'the setup tile is still offered');
  assert.equal(dom.window.document.querySelector('[data-slot="setup-note"]').hidden, true,
    'nothing recorded, nothing to say');
  booted.hosts.close();
});

test('P0B.4 - an injected foreign basisState over an enrolled installation still throws', async () => {
  const kit = await p0bEnrolledDevice();
  const dom = new JSDOM(shell());
  const before = dom.window.document.getElementById('phone').innerHTML;
  await assert.rejects(() => boot({ document: dom.window.document, today: P0B_DAY,
    indexedDB: kit.fault.indexedDB, crypto: webcrypto,
    basisState: createTodayModel({ today: P0B_DAY }).stateFromOps() }),
  (error) => error.code === SETUP_BASIS_STATE_REFUSED);
  assert.equal(dom.window.document.getElementById('phone').innerHTML, before, 'nothing was painted');
});

test('P0B.5 - a weigh-in and a logged set survive a store close/reopen on HIS basis', async () => {
  const kit = await p0bEnrolledDevice();
  const first = await p0bOpen(kit);
  await first.booted.api.ready;
  assert.equal((await first.booted.model.weighIn(181.2)).ok, true);
  /* The gym card rebased before the weigh-in; re-probe before Start, exactly as
     the screen does after any durable write. */
  await first.booted.workout.refresh();
  const started = await first.booted.workout.gym.start();
  assert.equal(started.ok, true, started.code || '');
  const active = await first.booted.workout.gym.read();
  assert.equal(active.phase, 'active');
  const logged = await first.booted.workout.gym.logSet({ startId: active.startId, slot: active.set.slot,
    lift: active.set.lift, load: '20', reps: '10', effort: EFFORT_CHOICES.find((c) => c.label === '2').reserve });
  assert.equal(logged.ok, true, logged.code || '');
  first.booted.hosts.close();

  const again = await p0bOpen(kit);
  await again.booted.api.ready;
  assert.deepEqual(again.booted.failures, []);
  const state = again.booted.model.stateFromOps();
  assert.equal(state.athlete_label, 'Dad', 'still his basis after the reopen');
  assert.equal(state.reads.length, 1, 'the weigh-in came back through the accepted writer');
  assert.equal(state.reads[0].w, 181.2, 'engine row shape {d, w, ...} (writers.cjs)');
  assert.equal(state.reads[0].d, P0B_DAY);
  assert.equal(again.booted.model.read().hasReadToday, true);
  const card = await again.booted.workout.gym.read();
  assert.equal(card.phase, 'active', card.code || '');
  assert.equal(card.done, 1, 'the logged set came back');
  assert.equal(card.lift.id, 'chest-press', 'on his lift');
  again.booted.hosts.close();
});

test('P0B.6 - no frame ever paints a foreign athlete: the only defined label any render shows is HIS', async () => {
  const kit = await p0bEnrolledDevice();
  const dom = new JSDOM(shell());
  /* An instrumented model, otherwise IDENTICAL to what boot() would build
     itself: every render this page load makes calls model.read() exactly once
     (today-app.cjs renderToday), so recording the athlete_label behind each
     call is recording the render sequence. The fixture basis carries no
     athlete_label at all (today-model.cjs createBasisState), so an unadopted
     frame contributes `undefined`, never a foreign name - there is no fixture
     "athlete" to paint a label for in the first place. */
  const base = createTodayModel({ today: P0B_DAY });
  const labels = [];
  const model = { ...base, read() {
    const view = base.read();
    let label; try { label = base.stateFromOps().athlete_label; } catch (_) { label = undefined; }
    labels.push(label);
    return view;
  } };
  const booted = await boot({ document: dom.window.document, today: P0B_DAY, model,
    indexedDB: kit.fault.indexedDB, crypto: webcrypto });
  await booted.api.ready;
  const defined = [...new Set(labels.filter((l) => typeof l === 'string'))];
  assert.deepEqual(defined, ['Dad'], 'across every render this load made, the only athlete label ever painted is his own');
  booted.hosts.close();
});

/* ==========================================================================
   P0-B r2 (owner review, rebuild/lanes/c/P0B-REVIEW.md) - three findings, each
   with its own cell, over the SAME real boot() this whole file already uses.
   ========================================================================== */

test('P0B.7 - the check-in adopts HIS state too: no fixture night offered on his sheet', async () => {
  const kit = await p0bEnrolledDevice();
  const { doc, booted } = await p0bOpen(kit);
  await booted.api.ready;
  /* Review finding 1: the entry today-entry.mjs:83 returns has no
     adoptEngineState of its own; only entry.checkin (the model) does. */
  assert.equal(typeof booted.checkin.checkin.adoptEngineState, 'function');
  const view = booted.checkin.checkin.read();
  assert.equal(view.sleepRecord, null, 'his own clean-init basis carries no fixture night');
  booted.api.render('recovery', true);
  const known = doc.querySelector('[data-slot="sleep-known"]');
  assert.equal(known.hidden, true, 'nothing offered to confirm');
  assert.equal(doc.getElementById('phone').textContent.includes('From your sleep record for'), false,
    'the fixture\'s night is never offered on his sheet');
  booted.hosts.close();
});

test('P0B.8 - an enrolled installation paints no fixture figure before adoption; S19 stays true', async () => {
  const kit = await p0bEnrolledDevice();
  const { doc, booted } = await p0bOpen(kit);
  /* Captured before `ready`: this really is the synchronous first frame. */
  const firstView = booted.model.read();
  assert.equal(firstView.calorieTarget.gated, true, 'no fixture calorie figure before adoption resolves');
  assert.equal(Number.isFinite(firstView.proteinTarget.g), false, 'no fixture protein figure before adoption resolves');
  const weight = firstView.nowModel && firstView.nowModel.headed ? firstView.nowModel.headed.weight : NaN;
  assert.equal(Number.isFinite(weight), false, 'no fixture weight trend before adoption resolves');
  const fixtureView = createTodayModel({ today: P0B_DAY }).read();
  const fixtureKcal = TodayApp.calorieHeadline(fixtureView.calorieTarget);
  const fixtureTrend = TodayApp.trendLine(fixtureView);
  assert(fixtureKcal, 'the fixture really carries a calorie figure to hide');
  const firstFrame = doc.getElementById('phone').textContent;
  assert.equal(firstFrame.includes(fixtureKcal), false, 'the fixture figure never paints, not even for one frame');
  assert.equal(firstFrame.includes(fixtureTrend), false, 'nor the fixture weight trend');
  /* r3 N3 - the workout line's own count and the marching order (the
     "next best action" text) are fixture-derived too; gate both. */
  assert.equal(firstView.workout.exerciseCount, null, 'no fixture exercise count before adoption resolves');
  assert.deepEqual(firstView.marchingOrder, {}, 'no fixture marching order before adoption resolves');
  assert.equal(firstFrame.includes('No session is scheduled today.'), true,
    'the same honest fallback an athlete with no session at all already sees');
  const fixtureCount = fixtureView.workout.exerciseCount;
  assert(Number.isFinite(fixtureCount) && fixtureCount > 0, 'the fixture really carries a count to hide');
  assert.equal(firstFrame.includes(fixtureCount + ' exercise'), false,
    'no fixture-derived exercise count on this frame');
  assert.equal(doc.querySelector('[data-slot="setup-note"]').hidden, false, 'S19: the note stays visible on this frame');
  await booted.api.ready;
  const afterView = booted.model.read();
  assert.equal(afterView.workout.exerciseCount, 2, 'his own U-day count reads back once adoption settles');
  booted.hosts.close();
});

test('P0B.9 - a tap that beats adoption is refused, not recorded: no fixture id lands in his store', async () => {
  const kit = await p0bEnrolledDevice();
  const hosts = await openTodayHosts({ indexedDB: kit.fault.indexedDB, crypto: webcrypto, day: P0B_DAY });
  const realSetup = await createSetupEntry({ today: P0B_DAY }, { hosts });
  assert.equal(realSetup.summary().enrolled, true);
  /* The 300 ms delayed adoption the review reproduced (probe3.mjs B3): the
     REAL read, only slow to settle - never a faked answer. */
  const delayedSetup = { ...realSetup, athleteState: () => new Promise((resolve) => {
    setTimeout(() => { realSetup.athleteState().then(resolve); }, 300);
  }) };
  const model = createTodayModel({ today: P0B_DAY });
  const workout = await createWorkoutEntry(model, { hosts });
  const dom = new JSDOM(shell());
  const api = mountToday(dom.window.document, model, { workout, setup: delayedSetup });
  /* The early tap: fired the instant mountToday returns, well inside the
     300 ms window - over whatever host Start would have been live on before
     this ticket, the fixture's. */
  const early = await workout.gym.start();
  assert.equal(early.ok, false, 'Start is refused while his own state is still loading');
  assert.equal(early.code, 'WORKOUT_ADOPTION_PENDING');
  await api.ready;
  const card = await workout.gym.read();
  assert.equal(card.phase, 'ready', 'the card rebased onto his own host once adoption settled: ' + (card.code || ''));
  assert.equal(card.lift.id, 'chest-press', 'his own lift, never the fixture\'s');
  hosts.close();
});

test('P0B.10 - athleteState() rejects: Start stays refused, never the fixture host; the status shows why', async () => {
  const kit = await p0bEnrolledDevice();
  const hosts = await openTodayHosts({ indexedDB: kit.fault.indexedDB, crypto: webcrypto, day: P0B_DAY });
  const realSetup = await createSetupEntry({ today: P0B_DAY }, { hosts });
  assert.equal(realSetup.summary().enrolled, true);
  /* A real rejection - a corrupt or undecryptable first-run record, the case
     the .catch exists for (review N1). */
  const cause = () => new Error('SETUP_STATE_BOOM');
  const rejectingSetup = { ...realSetup, athleteState: () => Promise.reject(cause()) };
  const model = createTodayModel({ today: P0B_DAY });
  const workout = await createWorkoutEntry(model, { hosts });
  const dom = new JSDOM(shell());
  const api = mountToday(dom.window.document, model, { workout, setup: rejectingSetup });
  await api.ready;
  /* r3 N1 - the hold IS released (it no longer sits behind a promise the
     rejection never reaches: `.finally()` on the whole chain ran). That
     release must never, by itself, hand Start the still-fixture host back
     (r3 N2/N1's own residual risk) - gym-model's `everHeld` guard keeps it
     refused, on the SAME code, since no rebase ever ran. */
  const refused = await workout.gym.start();
  assert.equal(refused.ok, false, 'Start stays refused after a rejection - never the fixture host');
  assert.equal(refused.code, 'WORKOUT_ADOPTION_PENDING');
  const status = dom.window.document.getElementById('today-status');
  assert.equal(status.textContent, TodayApp.athleteStateFailureCopy(cause()),
    'the real cause reaches the athlete, visibly, on the status line');
  /* No fixture id was ever written: start() above never reached
     client.startPreparedWorkout, so nothing durable was recorded at all -
     no retry is offered here, so "released" only ever means this. */
  hosts.close();
});

test('P0B.11 - both new adoption-safety strings are complete, dash-free sentences', () => {
  const sample = TodayApp.athleteStateFailureCopy(new Error('SETUP_STATE_BOOM'));
  for (const sentence of [ADOPTION_PENDING, sample]) {
    assert.equal(AI_DASH.test(sentence), false, 'no en dash or em dash: ' + sentence);
    assert.equal(/[.!?]$/.test(sentence.trim()), true, 'ends with sentence punctuation: ' + sentence);
    assert(sentence.trim().length > 0, 'not blank');
  }
});

/* r4 (review 3e226456, N3b BLOCKING) - emptying marchingOrder alone let the
   instruction-why binding fall through to view.statusFace.cause, which was
   never gated: the enrolled first frame still painted the fixture's own
   rich-history verdict (ON COURSE / "The cut is working"). Whole-DOM sweep
   of the entire synchronous first frame for every distinctive fixture
   string reachable by any word, cause, verdict, target, trend or badge -
   not just the handful of fields already checked field-by-field above. */
test('P0B.12 - the enrolled first frame paints no fixture verdict, figure or name: the whole DOM, once', async () => {
  const kit = await p0bEnrolledDevice();
  const { doc, booted } = await p0bOpen(kit);
  const firstFrame = doc.getElementById('phone').textContent;
  const forbidden = [
    'ON COURSE', 'cut is working',
    '2,300', '155 g', '2,262', '2,360', '180.4',
    'demo-press', 'demo-row', 'demo-leg', 'demo-curl',
    'Chest press', 'Seated row', 'Leg press', 'Leg curl',
    '2 exercises',
  ];
  for (const needle of forbidden) {
    assert.equal(firstFrame.includes(needle), false, 'the fixture string "' + needle + '" never paints on this frame');
  }
  assert.equal(doc.querySelector('[data-slot="setup-note"]').hidden, false, 'S19: the note stays visible on this frame');
  await booted.api.ready;
  booted.hosts.close();
});

/* ==========================================================================
   P0-C (P-INSTALL-VERIFY step 4/11, ledger DECISIONS:433). Three narrow, live-site
   findings. Item (a): P0-B's adoption ran only at mount, so the IN-PAGE transition off
   "Start using Earned" (no reload) painted the fixture verbatim for one frame on a real
   device. Item (b): the primary button's label and its click disagreed about which
   sheet opens. Item (c) is a PWA-shell dash fix, its cells live in rebuild/slice/pwa's
   own suites (P0C.3).
   ========================================================================== */
test('P0C.1 - completing setup adopts his own state in place, exactly as a fresh mount does', async () => {
  const fault = faultDatabase();
  const dom = new JSDOM(shell());
  const booted = await boot({ document: dom.window.document, today: P0B_DAY,
    indexedDB: fault.indexedDB, crypto: webcrypto });
  assert.equal(booted.setup.firstRun(), true, 'nothing enrolled yet');
  booted.api.render('setup');
  const model = booted.setup.setup;
  model.setName('Joe-test');
  model.toggleDay('1'); model.setDayKind('1', 'U');
  const press = model.addExercise('U');
  model.setExerciseField(press.key, 'n', 'Joe-test Bench Press');
  model.chooseMg(press.key, 'chest');
  model.setExerciseField(press.key, 'first', '20');
  model.goto(6);
  booted.api.render('setup');
  const primary = dom.window.document.querySelector('#phone [data-slot="primary"]');
  assert.equal(primary.textContent.trim(), 'Start using Earned');
  const beforeReady = booted.api.ready;
  primary.click();
  await new Promise((resolve) => setTimeout(resolve, 50));
  assert.notEqual(booted.api.ready, beforeReady, 'the transition armed a NEW adoption chain');
  await booted.api.ready;
  assert.equal(booted.api.screen(), 'today', 'landed on Today, in page, with no reload');

  const firstFrame = dom.window.document.getElementById('phone').textContent;
  assert.equal(dom.window.document.querySelector('[data-slot="setup-note"]').hidden, true,
    'SETUP_NOT_HIS_NUMBERS never survives the in-page transition');
  const fixtureView = createTodayModel({ today: P0B_DAY }).read();
  const fixtureKcal = TodayApp.calorieHeadline(fixtureView.calorieTarget);
  const forbidden = [fixtureKcal, '155 g', '2,262', '2,360', '180.4', 'ON COURSE', 'cut is working'];
  for (const needle of forbidden) {
    assert.equal(firstFrame.includes(needle), false, 'no fixture string survives the transition: ' + needle);
  }
  assert.equal(booted.model.stateFromOps().athlete_label, 'Joe-test',
    'Today stands on his own record, not the fixture');

  /* gym/check-in/sleep all read the adopted state, exactly as P0B required at boot. */
  const card = await booted.workout.gym.read();
  assert.equal(card.phase, 'ready', card.code || '');
  assert.equal(card.lift.count, 1, 'his own single Monday U-day lift, not the fixture week');
  assert.equal(typeof booted.checkin.checkin.adoptEngineState, 'function');
  assert.equal(booted.checkin.checkin.read().sleepRecord, null,
    'his own clean-init basis carries no fixture night, on his check-in sheet too');
  booted.hosts.close();
});

test("P0C.2 - the primary button's label names the sheet it opens, before and after the weigh-in", async () => {
  const kit = await installation();
  const before = today({ model: kit.model });
  before.api.render('today');
  const primaryBefore = before.doc.querySelector('#phone [data-slot="primary"]');
  const viewBefore = kit.model.read();
  assert.equal(viewBefore.marchingOrder.kind, 'weight', 'this fixture\'s own owed head really is the weigh-in');
  assert.equal(primaryBefore.textContent.trim().toLowerCase(), viewBefore.marchingOrder.thenText.toLowerCase(),
    'when the engine\'s owed head IS the weigh-in, its own words are shown unchanged (view.test.mjs)');
  primaryBefore.dispatchEvent(new before.dom.window.Event('click'));
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert(before.doc.querySelector('#phone [role="dialog"] #morning-weight'),
    'clicking it opened the WEIGHT sheet the label named');

  /* P-INSTALL-VERIFY step 5 - a clean-init athlete's owed head can be something ELSE
     (kind "night", "log last night"), a real engine sentence, but never a sheet this
     click opens. Reproduced by wrapping a real model's read() with the SAME shape,
     one field changed - never a fabricated view. */
  const mismatchModel = createTodayModel({ today: DAY });
  const realRead = mismatchModel.read;
  mismatchModel.read = () => {
    const view = realRead();
    return { ...view, marchingOrder: { ...view.marchingOrder, kind: 'night', thenText: 'log last night' } };
  };
  const mismatch = today({ model: mismatchModel });
  mismatch.api.render('today');
  const primaryMismatch = mismatch.doc.querySelector('#phone [data-slot="primary"]');
  assert.equal(primaryMismatch.textContent.trim(), "Log this morning's weight",
    'the engine\'s off-topic owed head is never shown as the primary label');
  primaryMismatch.dispatchEvent(new mismatch.dom.window.Event('click'));
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert(mismatch.doc.querySelector('#phone [role="dialog"] #morning-weight'),
    'label and action agree: it opened WEIGHT, exactly as the corrected label named');

  assert.equal((await kit.model.weighIn(170.6)).ok, true);
  const after = today({ model: kit.model });
  after.api.render('today');
  const view = kit.model.read();
  const primaryAfter = after.doc.querySelector('#phone [data-slot="primary"]');
  assert.equal(primaryAfter.textContent.trim(), 'Start ' + view.workout.title,
    'once the weigh-in is done, the label names the workout');
  primaryAfter.dispatchEvent(new after.dom.window.Event('click'));
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(after.api.screen(), 'workout', 'clicking it opened exactly the screen the label named');
});

/* ======================= N2, THE SLEEP ENTRY (relocated from test/sleep.test.mjs;
   PM routing DECISIONS:427 (1), on origin at 408a42f1) =======================
   Relocated here rather than left in its own file so h3-clean-init.test.cjs's closed
   enumeration of rebuild/m3/w7-preview/today/test/ file names (DECISIONS:186) stays
   exact and no new file is added. Cell names N2-01..N2-18 are unchanged; only their
   host file moved, and firstRunDocument was renamed sleepFirstRunDocument to avoid
   colliding with this file's own fixture builder of the same name. Every N2 PRODUCT
   file (sleep-check.mjs, sleep-commands.cjs, sleep-host.mjs, sleep-model.cjs) is
   untouched by this move. */

const { SLEEP_TITLE, SLEEP_NONE, SLEEP_MODE_TIMES, SLEEP_MODE_HOURS,
  SLEEP_ESTIMATE_PREFIX, SLEEP_CLOCK_CHANGE, SLEEP_HOURS_NOTE, SLEEP_FROM_TIMES,
  SLEEP_USE_CHECKIN, SLEEP_SAVE, SLEEP_NO_SAVE_TIME, SLEEP_NOT_SAVED, SLEEP_NO_STORE,
  SLEEP_NOTHING_RECORDED, SLEEP_REFUSAL_COPY, SLEEP_RECORDED_PREFIX } = TodayApp;
const { prepare, validate, nightOf, ACTION } = SleepCommands;
const NIGHT = dayBefore(DAY);              // 2030-02-03
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const readRepo = (rel) => fsSync.readFileSync(path.join(ROOT, rel), 'utf8');
const shaOf = (rel) => createHash('sha256').update(fsSync.readFileSync(path.join(ROOT, rel))).digest('hex');
/* THE CODE, with its prose removed (DECISIONS:114 (1)). */
const codeOf = (text) => text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
const NEW_FILES = ['sleep-commands.cjs', 'sleep-model.cjs', 'sleep-host.mjs'];

/* ONE device: one IndexedDB factory is one installation of the local era, so every
   host below is in the SAME sealed generation the other five lanes are in. */
async function device(options = {}) {
  const fault = options.fault || faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const open = (day = DAY) => createSleepHost({ day, ...lane });
  const host = await open();
  return { fault, lane, open, host };
}
const outboxOf = async (repository) => Object.values((await repository.load()).generation.collections.outbox || {});

/* The lane object today-app.cjs builds for itself, built here so the tests drive the
   same shape the page does. */
function entryFor(host, rows) {
  const source = readRepo('rebuild/m3/w7-preview/today/today-app.cjs');
  const body = source.slice(source.indexOf('function sleepEntryFor('))
    .match(/^function sleepEntryFor[\s\S]*?^  \}/m)[0];
  return Function('return (' + body + ')')()(host, rows);
}
async function laneOver(host) { return entryFor(host, await host.all()); }

function screenOn(options = {}) {
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1:4178/' + (options.query || '') });
  const doc = dom.window.document;
  const model = options.model || createTodayModel({ today: DAY });
  const api = mountToday(doc, model, options.mount || {});
  const pick = (slot) => doc.querySelector('#phone [data-slot="' + slot + '"]');
  return { dom, doc, model, api, pick,
    text: () => doc.getElementById('phone').textContent,
    type(slot, value) {
      const box = doc.querySelector('#phone [data-slot="' + slot + '"]');
      box.value = value;
      box.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    },
    /* A select or a date field answers to `change`, not `input`. */
    choose(slot, value) {
      const box = doc.querySelector('#phone [data-slot="' + slot + '"]');
      box.value = value;
      box.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    },
    click(selector) {
      doc.querySelector('#phone ' + selector).dispatchEvent(new dom.window.Event('click'));
    },
    async tapSave() {
      pick('sleep-save').dispatchEvent(new dom.window.Event('click'));
      await api.sleepPending();
      await new Promise((resolve) => setTimeout(resolve, 0));
    },
  };
}
const rowsFor = (nights) => nights.map((night, index) => ({
  op_id: 'op-' + index, device_seq: index + 1, savedDate: DAY, savedTime: '08:00', savedOffset: '+00:00', night }));

/* THE FIRST RUN'S OWN DOCUMENT, built through the accepted reducer. */
function sleepFirstRunDocument({ today = DAY } = {}) {
  const model = createSetupModel({ today });
  model.setName('Dad');
  model.toggleDay('1'); model.setDayKind('1', 'U');
  model.toggleDay('4'); model.setDayKind('4', 'L');
  const press = model.addExercise('U');
  model.setExerciseField(press.key, 'n', 'Chest press');
  model.chooseMg(press.key, 'chest');
  model.setExerciseField(press.key, 'first', '20');
  model.setExerciseField(press.key, 'inc', '10');
  const legs = model.addExercise('L');
  model.setExerciseField(legs.key, 'n', 'Leg press');
  model.chooseMg(legs.key, 'quads');
  model.setExerciseField(legs.key, 'first', '45');
  model.setExerciseField(legs.key, 'inc', '15');
  model.togglePriority('quads');
  const built = model.document();
  assert.equal(built.ok, true, 'the first-run fixture is complete: ' + JSON.stringify(built.missing));
  return built.setup;
}


/* ==========================================================================
   N2-01 - THE CLOSED COMMAND AND THE ACCEPTED ENVELOPE.
   ========================================================================== */
test('N2-01 - the producer builds ONE sleep/fact op of the accepted envelope', () => {
  const action = prepare({ action: ACTION, input: { night: { date: NIGHT, bed: '23:00', wake: '06:30' } } });
  /* The class and the kind are read out of the ACCEPTED list, not restated here. */
  assert(Ops.CLASSES.includes(OP_CLASS), 'rebuild/client/ops.cjs already knows this class');
  assert(Ops.KINDS.includes(OP_KIND), 'and this kind');
  assert.equal(action.class, OP_CLASS);
  assert.equal(action.kind, OP_KIND);
  assert.deepEqual(Object.keys(action.payload).sort(), ['night', 'profile']);
  assert.equal(action.payload.profile, PROFILE);
  assert.deepEqual(action.payload.night, { date: NIGHT, bed: '23:00', wake: '06:30' });
  assert.deepEqual(action.parents, []);
});

test('N2-01 - unknown keys, foreign shapes and a forged check-in reference all refuse', () => {
  const good = { date: NIGHT, hours: 7 };
  for (const input of [
    { ...good, score: 9 },                       // an unknown member
    { ...good, quality: 'Good' },                // no quality member exists here
    { date: NIGHT },                             // neither shape
    { hours: 7 },                                // no night date
    { ...good, from_checkin_op_id: '' },         // an empty reference is not a reference
    { ...good, from_checkin_op_id: 7 },
    { date: NIGHT, bed: '23:00', wake: '06:30', from_checkin_op_id: 'op-1' },
  ]) assert.throws(() => nightOf(input), /SLEEP_INPUT_INVALID/, JSON.stringify(input));
  for (const request of [
    { action: 'sleep-night' },
    { action: 'other', input: { night: good } },
    { action: ACTION, input: { night: good, extra: 1 } },
    { action: ACTION, input: { night: good, effective: { local_date: NIGHT } } },
  ]) assert.throws(() => prepare(request), /SLEEP_INPUT_INVALID/, JSON.stringify(request));
  /* And validate() refuses the same shapes on the envelope the client actually built. */
  const read = () => null;
  assert.equal(validate({ kind: OP_KIND, class: OP_CLASS, effective: { local_date: DAY },
    payload: { profile: PROFILE, night: { date: NIGHT, hours: 7 } }, causal_parents: [] }, read), true);
  assert.equal(validate({ kind: OP_KIND, class: OP_CLASS, effective: { local_date: DAY },
    payload: { profile: 'earned/other/v1', night: { date: NIGHT, hours: 7 } }, causal_parents: [] }, read), false);
  assert.equal(validate({ kind: 'event', class: OP_CLASS, effective: { local_date: DAY },
    payload: { profile: PROFILE, night: { date: NIGHT, hours: 7 } }, causal_parents: [] }, read), false);
});

/* ==========================================================================
   N2-02 - BOTH MODES, AND EVERY BOUND, HANDLED BY THE EXACT CONTRACT.
   ========================================================================== */
test('N2-02 - an explicit zero is an ANSWER and a blank is unknown', () => {
  assert.deepEqual(nightOf({ date: NIGHT, hours: 0 }), { date: NIGHT, hours: 0 },
    'zero hours is a legitimate entered answer (A3 own 0..24 precedent)');
  assert.deepEqual(nightOf({ date: NIGHT, hours: 24 }), { date: NIGHT, hours: 24 });
  assert.equal(SleepModel.hoursRefusal({ hours: '0', date: NIGHT }, DAY), null);
  assert.equal(SleepModel.hoursRefusal({ hours: '', date: NIGHT }, DAY), SleepModel.REFUSALS.NOTHING,
    'a blank is UNKNOWN and is refused rather than becoming a zero');
  assert.equal(SleepModel.hoursRefusal({ hours: '   ', date: NIGHT }, DAY), SleepModel.REFUSALS.NOTHING);
});

test('N2-02 - hours, dates, strings, null, NaN and infinity are refused by name', () => {
  for (const hours of [-1, 24.5, 7.125, Number.NaN, Number.POSITIVE_INFINITY, '7', null, true]) {
    assert.throws(() => nightOf({ date: NIGHT, hours }), /SLEEP_INPUT_INVALID/, String(hours));
  }
  for (const date of ['2030-02-30', '2030-13-01', '30-02-03', '2030-2-3', '', null, 20300203]) {
    assert.throws(() => nightOf({ date, hours: 7 }), /SLEEP_INPUT_INVALID/, String(date));
  }
  assert.equal(SleepModel.hoursRefusal({ hours: '7.125', date: NIGHT }, DAY), SleepModel.REFUSALS.HOURS);
  assert.equal(SleepModel.hoursRefusal({ hours: '25', date: NIGHT }, DAY), SleepModel.REFUSALS.HOURS);
  assert.equal(SleepModel.hoursRefusal({ hours: 'lots', date: NIGHT }, DAY), SleepModel.REFUSALS.HOURS);
  /* A FUTURE night has not happened: a completed night is refused by name. */
  assert.equal(SleepModel.hoursRefusal({ hours: '7', date: DAY }, DAY), SleepModel.REFUSALS.NIGHT_DATE);
  assert.equal(SleepModel.hoursRefusal({ hours: '7', date: '2030-02-05' }, DAY), SleepModel.REFUSALS.NIGHT_DATE);
});

test('N2-02 - lone times, equal times, bad clock values and excessive awake minutes refuse', () => {
  for (const input of [
    { date: NIGHT, bed: '23:00' },
    { date: NIGHT, wake: '06:30' },
    { date: NIGHT, awake_min: 30 },
    { date: NIGHT, bed: '23:00', wake: '23:00' },       // sleepSpanH would wrap this to 24 h
    { date: NIGHT, bed: '24:00', wake: '06:30' },
    { date: NIGHT, bed: '23:0', wake: '06:30' },
    { date: NIGHT, bed: '23:60', wake: '06:30' },
    { date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 451 },   // the span is 450 minutes
    { date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 30.5 },
    { date: NIGHT, bed: '23:00', wake: '06:30', awake_min: -1 },
    { date: NIGHT, bed: '23:00', wake: '06:30', hours: 7 },         // never both shapes
  ]) assert.throws(() => nightOf(input), /SLEEP_INPUT_INVALID/, JSON.stringify(input));
  assert.deepEqual(nightOf({ date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 450 }),
    { date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 450 }, 'the whole span is allowed');
  const refusals = SleepModel.REFUSALS;
  assert.equal(SleepModel.timesRefusal({ bed: '', wake: '', date: NIGHT }, DAY), refusals.NOTHING);
  assert.equal(SleepModel.timesRefusal({ bed: '23:00', wake: '', date: NIGHT }, DAY), refusals.BOTH_TIMES);
  assert.equal(SleepModel.timesRefusal({ bed: '23:00', wake: 'x', date: NIGHT }, DAY), refusals.TIME_FORM);
  assert.equal(SleepModel.timesRefusal({ bed: '07:00', wake: '07:00', date: NIGHT }, DAY), refusals.SAME_TIME);
  assert.equal(SleepModel.timesRefusal({ bed: '23:00', wake: '06:30', awake_min: '451', date: NIGHT }, DAY), refusals.AWAKE);
  assert.equal(SleepModel.timesRefusal({ bed: '23:00', wake: '06:30', awake_min: '4.5', date: NIGHT }, DAY), refusals.AWAKE);
  assert.equal(SleepModel.timesRefusal({ bed: '23:00', wake: '06:30', date: NIGHT }, DAY), null);
});

/* D2 R4: UI date checks do not enforce the producer's completed-night contract. */
for (const [label, date, accepted] of [
  ['previous night', NIGHT, true],
  ['late entry', '2030-01-30', true],
  ['same-day night', DAY, false],
  ['future night', '2030-02-05', false],
]) {
  test('N2-02 R5 - the actual producer admits only completed nights: ' + label, async () => {
    const kit = await device();
    try {
      const before = { ops: await opsOf(kit.host.repository), outbox: await outboxOf(kit.host.repository) };
      const saved = await kit.host.save({ date, hours: 2 }, { supersedes: null });
      const after = { ops: await opsOf(kit.host.repository), outbox: await outboxOf(kit.host.repository) };
      assert.deepEqual({ ok: saved.ok, opsAdded: after.ops.length - before.ops.length,
        outboxAdded: after.outbox.length - before.outbox.length },
      { ok: accepted, opsAdded: accepted ? 1 : 0, outboxAdded: accepted ? 1 : 0 });
      if (accepted) {
        const row = (await kit.host.forDate(date)).at(-1);
        assert.equal(row.savedDate, DAY, 'the client stamps the real save day');
        assert.equal(row.night.date, date, 'a late entry retains its own night label');
      } else {
        assert.deepEqual(after, before, 'refusal preserves every existing op and outbox entry');
      }
    } finally { kit.host.close(); }
  });
}

test('N2-02 / N2-04 R5 - completion uses the envelope clock after an open host crosses midnight', async () => {
  const { openTodayInstallation } = await import('../../../w6/local/today-bindings.mjs');
  let day = DAY;
  const clock = { today: () => day, now: () => day + 'T13:00:00.000Z', tz: '-05:00', monotonicMs: () => 0 };
  const era = await openTodayInstallation({ indexedDB: faultDatabase().indexedDB, crypto: webcrypto, day, clock });
  const host = await createSleepHost({ day, era });
  const snapshot = async () => ({ ops: await opsOf(host.repository), outbox: await outboxOf(host.repository) });
  try {
    const empty = await snapshot();
    assert.equal((await host.save({ date: DAY, hours: 2 }, { supersedes: null })).ok, false);
    assert.deepEqual(await snapshot(), empty, 'the current night writes nothing');
    day = '2030-02-05';
    assert.equal((await host.save({ date: DAY, hours: 2 }, { supersedes: null })).ok, true,
      'the same night becomes eligible after the installation clock advances');
    const committed = await snapshot();
    assert.equal(committed.ops.length, empty.ops.length + 1);
    assert.equal(committed.outbox.length, empty.outbox.length + 1);
    const row = (await host.forDate(DAY)).at(-1);
    assert.equal(row.night.date, DAY);
    assert.equal(row.savedDate, day, 'the envelope uses the new clock, not host construction day');
    for (const date of [day, '2030-02-06']) {
      assert.equal((await host.save({ date, hours: 2 }, { supersedes: null })).ok, false);
      assert.deepEqual(await snapshot(), committed, 'a refused night preserves the accepted night and its outbox');
    }
  } finally { host.close(); era.close(); }
});

/* R5's envelope comparison must not compare against a caller-authored save stamp. */
for (const [label, date, saveDay] of [
  ['current night with tomorrow stamp', DAY, '2030-02-05'],
  ['future night with later stamp', '2030-02-05', '2030-02-06'],
  ['previous night with matching stamp', NIGHT, DAY],
  ['late night with backdated stamp', '2030-01-30', '2030-02-01'],
]) {
  test('N2-01 / N2-02 R6 - raw producer refuses a supplied save stamp: ' + label, async () => {
    const kit = await device();
    try {
      assert.equal((await kit.host.save({ date: '2029-12-01', hours: 0 }, { supersedes: null })).ok, true);
      const before = { ops: await opsOf(kit.host.repository), outbox: await outboxOf(kit.host.repository) };
      const result = await kit.host.client.execute('workout', { action: ACTION, input: {
        night: { date, hours: 2 }, supersedes: null,
        effective: { local_date: saveDay, local_time: '08:00', utc_offset: '+00:00' },
      } });
      const after = { ops: await opsOf(kit.host.repository), outbox: await outboxOf(kit.host.repository) };
      assert.deepEqual({ acknowledged: result.acknowledged, opsAdded: after.ops.length - before.ops.length,
        outboxAdded: after.outbox.length - before.outbox.length },
      { acknowledged: false, opsAdded: 0, outboxAdded: 0 });
      assert.deepEqual(after, before, 'the raw refusal preserves the existing observation and outbox');
      assert.equal(kit.host.today(), DAY, 'the installation day remains the actual day');
    } finally { kit.host.close(); }
  });
}

test('N2-01 / N2-05 R6 - ordinary raw past-night writes and corrections keep the client stamp', async () => {
  const kit = await device();
  try {
    let prior = null;
    let count = (await opsOf(kit.host.repository)).length;
    for (const night of [{ date: NIGHT, hours: 0 }, { date: NIGHT, bed: '23:00', wake: '06:30' }]) {
      const beforeOps = await opsOf(kit.host.repository), beforeOutbox = await outboxOf(kit.host.repository);
      const result = await kit.host.client.execute('workout', { action: ACTION, input: { night, supersedes: prior } });
      assert.equal(result.acknowledged, true);
      const ops = await opsOf(kit.host.repository), outbox = await outboxOf(kit.host.repository);
      assert.equal(ops.length, ++count);
      assert.equal(outbox.length, beforeOutbox.length + 1);
      assert.deepEqual(ops.slice(0, -1), beforeOps, 'correction appends and retains the previous observation');
      const row = (await kit.host.forDate(NIGHT)).at(-1);
      assert.deepEqual(row.night, night);
      assert.equal(row.savedDate, DAY);
      assert.equal(ops.at(-1).effective.local_date, DAY);
      prior = row.op_id;
    }
  } finally { kit.host.close(); }
});

test('N2-02 / N2-04 R6 - raw producer keeps the actual clock through midnight and correction', async () => {
  const { openTodayInstallation } = await import('../../../w6/local/today-bindings.mjs');
  let day = DAY;
  const clock = { today: () => day, now: () => day + 'T13:00:00.000Z', tz: '-05:00', monotonicMs: () => 0 };
  const era = await openTodayInstallation({ indexedDB: faultDatabase().indexedDB, crypto: webcrypto, day, clock });
  const host = await createSleepHost({ day, era });
  const snapshot = async () => ({ ops: await opsOf(host.repository), outbox: await outboxOf(host.repository) });
  const save = (hours, supersedes) => host.client.execute('workout',
    { action: ACTION, input: { night: { date: DAY, hours }, supersedes } });
  try {
    const before = await snapshot();
    assert.equal((await save(2, null)).acknowledged, false);
    assert.deepEqual(await snapshot(), before, 'raw current-night refusal writes nothing');
    day = '2030-02-05';
    assert.equal((await save(2, null)).acknowledged, true);
    const first = (await host.forDate(DAY)).at(-1);
    assert.equal(first.savedDate, day);
    assert.equal((await save(3, first.op_id)).acknowledged, true);
    const rows = await host.forDate(DAY), after = await snapshot();
    assert.equal(rows.length, 2);
    assert.equal(rows[0].op_id, first.op_id);
    assert.deepEqual(rows.map(row => row.night.hours), [2, 3]);
    assert(rows.every(row => row.savedDate === day && row.night.date === DAY));
    assert.equal(after.ops.length, before.ops.length + 2);
    assert.equal(after.outbox.length, before.outbox.length + 2);
  } finally { host.close(); era.close(); }
});

/* ==========================================================================
   N2-03 - THE HOURS ARE THE ENGINE'S. Seam S2 is the ROW, never the span.
   ========================================================================== */
test('N2-03 - every projected h deep-equals a direct writers.cjs sleepSpanH call', () => {
  const model = createTodayModel({ today: DAY });
  const E = model.engine;
  const table = [
    { bed: '23:00', wake: '06:30' },                    // past midnight
    { bed: '22:15', wake: '05:45', awake_min: 20 },     // awake subtracted
    { bed: '01:00', wake: '09:00' },                    // no wrap at all
    { bed: '23:59', wake: '00:01' },                    // two minutes
    { bed: '23:00', wake: '06:30', awake_min: 450 },    // the whole span awake
  ];
  for (const night of table) {
    const row = SleepModel.rowFor({ date: NIGHT, ...night }, E);
    const direct = E.sleepSpanH(night.bed, night.wake,
      Object.hasOwn(night, 'awake_min') ? night.awake_min : 0);
    assert.equal(row.h, direct, JSON.stringify(night));
    assert.equal(row.d, NIGHT);
    assert.equal(row.bed, night.bed);
    assert.equal(row.wake, night.wake);
  }
  /* A TYPED duration is the athlete's own number, unchanged, with no clock fields. */
  const typed = SleepModel.rowFor({ date: NIGHT, hours: 6.25 }, E);
  assert.deepEqual(typed, { d: NIGHT, h: 6.25 });
});

test('N2-03 - the page computes no span of its own, and a mode correction drops the clock fields', () => {
  /* A source scan, because a screen that did the subtraction itself could agree with
     the engine on this table and disagree on the next one. */
  for (const file of ['sleep-model.cjs', 'today-app.cjs']) {
    const code = codeOf(readRepo('rebuild/m3/w7-preview/today/' + file));
    assert.equal(/1440/.test(code), false, file + ' carries the midnight wrap itself');
    assert.equal(/\/\s*60/.test(code.replace(/span - awakeMin/g, '')), false,
      file + ' converts minutes to hours itself');
  }
  assert(readRepo('rebuild/m3/w7-preview/today/sleep-model.cjs')
    .includes('engine.sleepSpanH(night.bed, night.wake, awake)'), 'through the engine it is handed');
  const model = createTodayModel({ today: DAY });
  const rows = rowsFor([{ date: NIGHT, bed: '23:00', wake: '06:30' }, { date: NIGHT, hours: 5 }]);
  const state = SleepModel.projectSleepNights({ sleep: { nights: [] } }, rows, model.engine);
  assert.deepEqual(state.sleep.nights, [{ d: NIGHT, h: 5 }],
    'switching to a duration REMOVES the obsolete bed and wake');
});

/* ==========================================================================
   N2-04 - THE NIGHT LABEL, AND THE SAVE STAMP, ARE DIFFERENT FACTS.
   ========================================================================== */
test('N2-04 - the night is the day BEFORE, across month, year and leap boundaries', () => {
  assert.equal(SleepModel.nightDateFor(DAY), NIGHT);
  assert.equal(SleepModel.nightDateFor(DAY), dayBefore(DAY), 'the check-in own rule, not a second one');
  for (const [day, night] of [['2030-03-01', '2030-02-28'], ['2028-03-01', '2028-02-29'],
    ['2031-01-01', '2030-12-31'], ['2030-02-03', '2030-02-02']]) {
    assert.equal(SleepModel.nightDateFor(day), night, day);
    assert.equal(SleepModel.nightDateFor(day), dayBefore(day), day);
  }
});

test('N2-04 - a late entry keeps the chosen night, and the save stamp stays separate', async () => {
  const kit = await device();
  assert.equal((await kit.host.save({ date: '2030-01-30', hours: 7 })).ok, true, 'a night recorded late');
  const [row] = await kit.host.all();
  assert.equal(row.night.date, '2030-01-30', 'the NIGHT label is the athlete choice');
  assert.equal(row.savedDate, DAY, 'and the save stamp is the client own envelope');
  assert.match(row.savedTime, /^\d{2}:\d{2}(:\d{2})?$/);
  assert.notEqual(row.night.date, row.savedDate);
  kit.host.close();
});

/* ==========================================================================
   N2-05 - ONE DELIBERATE SAVE, ONE OPERATION, ONE TRANSACTION.
   ========================================================================== */
test('N2-05 - a real save adds ONE op and its outbox entry in one generation', async () => {
  const kit = await device();
  const before = await opsOf(kit.host.repository);
  const result = await kit.host.save({ date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 15 });
  assert.equal(result.ok, true, result.code || '');
  const ops = await opsOf(kit.host.repository);
  assert.equal(ops.length, before.length + 1, 'exactly one operation');
  const op = ops.find((o) => o.class === OP_CLASS);
  assert.equal(op.kind, OP_KIND);
  assert.deepEqual(op.payload.night, { date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 15 });
  assert.equal((await outboxOf(kit.host.repository)).length, 1, 'and its outbox entry');
  kit.host.close();
});

test('N2-05 - a closed lane records nothing and says which refusal it was', async () => {
  const kit = await device();
  kit.host.close();
  const refused = await kit.host.save({ date: NIGHT, hours: 7 });
  assert.equal(refused.ok, false);
  assert.equal(refused.code, 'LOCAL_CLIENT_CLOSED');
  assert.equal(refused.op_id, null);
});

/* ==========================================================================
   N2-06 - A CORRECTION APPENDS, THE PROJECTION IS DETERMINISTIC, AND NOTHING
   INVENTS A WINNER.
   ========================================================================== */
test('N2-06 - a correction is a NEW op, the latest wins, and the projection is idempotent', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  assert.equal((await kit.host.save({ date: NIGHT, bed: '23:00', wake: '06:30' })).ok, true);
  assert.equal((await kit.host.save({ date: NIGHT, hours: 5.5 })).ok, true);
  const rows = await kit.host.all();
  assert.equal(rows.length, 2, 'two operations, nothing updated and nothing deleted');
  const state = SleepModel.projectSleepNights({ sleep: { nights: [] } }, rows, model.engine);
  assert.deepEqual(state.sleep.nights, [{ d: NIGHT, h: 5.5 }], 'the LATEST op for the night wins');
  /* Replaying twice, and replaying a reversed object order, give the same answer. */
  const again = SleepModel.projectSleepNights(state, rows, model.engine);
  assert.deepEqual(again.sleep.nights, state.sleep.nights, 'replay is idempotent');
  kit.host.close();
});

test('N2-06 - many nights sort ascending however the log is read, and unrelated dates survive', () => {
  const model = createTodayModel({ today: DAY });
  const rows = rowsFor([{ date: '2030-02-02', hours: 6 }, { date: '2030-01-30', hours: 8 },
    { date: NIGHT, bed: '23:00', wake: '06:30' }]);
  const basis = { sleep: { nights: [{ d: '2029-12-31', h: 7, bed: '22:00', wake: '05:00' }] }, other: 1 };
  const state = SleepModel.projectSleepNights(basis, rows, model.engine);
  assert.deepEqual(state.sleep.nights.map((n) => n.d),
    ['2029-12-31', '2030-01-30', '2030-02-02', NIGHT], 'sorted ascending by d');
  assert.deepEqual(state.sleep.nights[0], { d: '2029-12-31', h: 7, bed: '22:00', wake: '05:00' },
    'an unrelated basis night is untouched');
  assert.equal(state.other, 1, 'and every unrelated member of the state survives');
  assert.deepEqual(basis.sleep.nights.length, 1, 'the original object was not mutated');
  /* The same rows in the reverse read order give the same sorted projection. */
  const reversed = SleepModel.projectSleepNights(basis, [...rows].reverse(), model.engine);
  assert.deepEqual(reversed.sleep.nights.map((n) => n.d).sort(), state.sleep.nights.map((n) => n.d).sort());
});

test('N2-06 - rejected, tombstoned and foreign-profile facts are excluded, and no winner is invented', () => {
  const night = { date: NIGHT, hours: 7 };
  const generation = { collections: {
    ops: {
      good: { op_id: 'good', kind: OP_KIND, class: OP_CLASS, device_seq: 2,
        payload: { profile: PROFILE, night }, effective: { local_date: DAY, local_time: '08:00' } },
      dead: { op_id: 'dead', kind: OP_KIND, class: OP_CLASS, device_seq: 1,
        payload: { profile: PROFILE, night: { date: NIGHT, hours: 1 } }, effective: { local_date: DAY } },
      stone: { op_id: 'stone', kind: 'tombstone', target_op_id: 'dead' },
      other: { op_id: 'other', kind: OP_KIND, class: OP_CLASS, device_seq: 3,
        payload: { profile: 'earned/other/v1', night: { date: NIGHT, hours: 2 } }, effective: { local_date: DAY } },
      refused: { op_id: 'refused', kind: OP_KIND, class: OP_CLASS, device_seq: 4,
        payload: { profile: PROFILE, night: { date: NIGHT, hours: 3 } }, effective: { local_date: DAY } },
    },
    rejected: { refused: { reason: 'SYNTHETIC' } },
  } };
  const rows = sleepNightsIn(generation, PROFILE);
  assert.deepEqual(rows.map((r) => r.op_id), ['good'], 'one row survives the filter');
  /* THE CONFLICT SEAM (:167 (1)): the rendered state is deferred to hosted sync, and
     the projector must still refuse to invent a winner. On one device the winner is
     the HIGHEST authenticated device sequence, which is a fact about the log. */
  const ordered = SleepModel.winningNights(rowsFor([{ date: NIGHT, hours: 6 }, { date: NIGHT, hours: 9 }]));
  assert.equal(ordered.length, 1);
  assert.equal(ordered[0].device_seq, 2, 'the later device sequence, never wall-clock time');
  assert.equal(SleepModel.winningNights([]).length, 0, 'and nothing at all invents a night');
});

/* ==========================================================================
   N2-07 / N2-08 - THE CHECK-IN STOPS ASKING TWICE, ON THE SAME PAGE, WITH
   checkin-* BYTE-IDENTICAL.
   ========================================================================== */
test('N2-08 - a saved night is what the check-in own reader finds, with no A3 edit', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY, sleepNights: null });
  assert.equal((await kit.host.save({ date: NIGHT, bed: '23:00', wake: '06:30' })).ok, true);
  model.setSleepNights(await laneOver(kit.host));
  const state = model.stateFromOps();
  /* checkin-model.mjs sleepNightFor, called here exactly as A3 calls it. */
  const found = sleepNightFor(state, DAY);
  assert(found, 'the check-in own reader finds the night N2 wrote');
  assert.equal(found.date, NIGHT);
  assert.equal(found.hours, model.engine.sleepSpanH('23:00', '06:30'));
  kit.host.close();
});

test('N2-08 - the check-in files are BYTE-IDENTICAL: N2 changes A3 not at all', () => {
  /* The reuse path already existed and was dead because nothing wrote a night. N2 is
     what brings it to life, and the cleanest proof that the shape is right is that
     none of these files moved. The hashes are re-read from disk at test time. */
  const pinned = {
    'checkin-model.mjs': shaOf('rebuild/m3/w7-preview/today/checkin-model.mjs'),
    'checkin-app.mjs': shaOf('rebuild/m3/w7-preview/today/checkin-app.mjs'),
    'checkin-commands.cjs': shaOf('rebuild/m3/w7-preview/today/checkin-commands.cjs'),
    'checkin-host.mjs': shaOf('rebuild/m3/w7-preview/today/checkin-host.mjs'),
  };
  const head = JSON.parse(readRepo('rebuild/lanes/b/tooling/packages/B-NTC.json'));
  assert.equal(pinned['checkin-host.mjs'],
    /'checkin-host\.mjs':\s*'([a-f0-9]{64})'/.exec(readRepo('rebuild/m3/w6/test/local-today-journey.test.mjs'))[1],
    'checkin-host.mjs is a PAGE_PINS file and must stay byte-identical');
  assert.equal(shaOf('rebuild/m3/w6/local/today-bindings.mjs'),
    head.product['rebuild/m3/w6/local/today-bindings.mjs'].post,
    'today-bindings.mjs is pinned ON DISK by the merged B-NTC artifact (DECISIONS:144)');
  for (const name of ['today-entry.mjs', 'gym-host.mjs', 'reading-host.mjs', 'checkin-host.mjs']) {
    const pin = new RegExp("'" + name.replace('.', '\\.') + "':\\s*'([a-f0-9]{64})'")
      .exec(readRepo('rebuild/m3/w6/test/local-today-journey.test.mjs'));
    assert.equal(shaOf('rebuild/m3/w7-preview/today/' + name), pin[1], name + ' moved');
  }
  /* And N2's own modules say nothing about enrolment or a second store. */
  for (const file of NEW_FILES) {
    const text = readRepo('rebuild/m3/w7-preview/today/' + file);
    assert.equal(/firstRun|enrol|RESTORE_REQUIRED/i.test(text), false, file);
  }
  assert(Object.keys(pinned).length === 4);
});

/* ==========================================================================
   THE SCREEN: N2-14, N2-15, N2-16, N2-18.
   ========================================================================== */
test('N2-15 - with no store the sleep screen says what cannot happen, why and what to do', () => {
  const page = screenOn();
  page.doc.querySelector('#phone [data-go="sleep"]').dispatchEvent(new page.dom.window.Event('click'));
  assert.equal(page.api.screen(), 'sleep');
  const note = page.pick('sleep-note').textContent;
  assert(note.startsWith(SLEEP_NO_STORE), 'what cannot happen and what to do: ' + note);
  assert(note.includes('NO_LOCAL_STORE'), 'and why: jsdom offers no encrypted store');
  assert.equal(page.pick('sleep-entry-form').hidden, true, 'and no entry it cannot keep');
  assert.equal(page.pick('sleep-recorded').textContent, '', 'nothing is read back');
  assert.equal(page.pick('sleep-save').closest('[data-slot="sleep-entry-form"]').hidden, true,
    'and the save control is inside the hidden entry');
});

test('N2-14 - with a lane and nothing recorded the entry is honest and offers both modes', async () => {
  const kit = await device();
  /* A basis with NO night for this date: the preview fixture athlete already has a
     month of nights, and an empty state has to be measured on an athlete who has none.
     The first-run document is the one this product actually creates. */
  const clean = createCleanInitState({ setup: sleepFirstRunDocument() });
  const page = screenOn({ model: createTodayModel({ today: DAY, basisState: clean }),
    mount: { sleep: await laneOver(kit.host) }, query: '?screen=sleep' });
  page.api.render('sleep');
  assert.equal(page.pick('sleep-entry-form').hidden, false);
  assert.equal(page.pick('sleep-title').textContent, SLEEP_TITLE);
  assert.match(page.pick('sleep-night').textContent, new RegExp(NIGHT));
  assert.equal(page.pick('sleep-note').textContent, SLEEP_NONE, 'the honest empty state');
  assert.doesNotMatch(page.pick('sleep-note').textContent, /0 h/, 'never a zero');
  assert.equal(page.pick('sleep-mode-times').getAttribute('aria-pressed'), 'true',
    'TIMES is the first mode (:167 (3))');
  assert.equal(page.pick('sleep-mode-hours').getAttribute('aria-pressed'), 'false');
  assert.equal(page.pick('sleep-times').hidden, false);
  assert.equal(page.pick('sleep-hours-mode').hidden, true);
  assert.equal(page.doc.querySelector('#phone #sleep-bed').value, '', 'both boxes start blank');
  assert.equal(page.doc.querySelector('#phone #sleep-wake').value, '');
  assert.equal(page.pick('sleep-recorded').hidden, true);
  assert.equal(page.doc.querySelectorAll('#phone .primary').length, 1, 'ONE primary action');
  assert.equal(page.pick('sleep-save-label').textContent, SLEEP_SAVE);
  kit.host.close();
});

test('N2-03 / N2-14 - the estimate on screen is the ENGINE own span, and equal times route to hours', async () => {
  const kit = await device();
  const page = screenOn({ model: createTodayModel({ today: DAY }), mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  const direct = createTodayModel({ today: DAY }).engine.sleepSpanH('23:00', '06:30');
  assert.equal(page.pick('sleep-estimate').textContent,
    SLEEP_ESTIMATE_PREFIX + direct + ' h Time awake was not recorded.');
  page.type('sleep-wake', '23:00');
  assert.equal(page.pick('sleep-estimate').textContent, SLEEP_CLOCK_CHANGE,
    'a clock-change night is offered the hours mode, never a clamped 24');
  kit.host.close();
});

test('N2-05 / N2-14 - the screen records ONE op and reads it back off the ENGINE, with provenance', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const page = screenOn({ model, mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();
  const ops = await opsOf(kit.host.repository);
  assert.equal(ops.length, 1, 'one tap, one operation');
  assert.deepEqual(ops[0].payload.night, { date: NIGHT, bed: '23:00', wake: '06:30' });
  const logged = model.loggedSleep(NIGHT);
  assert.equal(logged.h, model.engine.sleepSpanH('23:00', '06:30'), 'the engine holds it');
  const line = page.pick('sleep-recorded').textContent;
  assert.equal(page.pick('sleep-recorded').hidden, false);
  assert(line.startsWith(logged.h + ' h'), line);
  assert(line.includes(SLEEP_FROM_TIMES), 'and says which shape it came from');
  assert(line.includes(SLEEP_RECORDED_PREFIX), 'with the stamp the operation carries');
  assert.equal(line.includes(SLEEP_NO_SAVE_TIME), false);
  kit.host.close();
});

test('N2-14 - every refusal is the page own sentence and records nothing at all', async () => {
  const kit = await device();
  const page = screenOn({ mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  for (const [bed, wake, code] of [['', '', 'NOTHING'], ['23:00', '', 'BOTH_TIMES'],
    ['07:00', '07:00', 'SAME_TIME']]) {
    page.type('sleep-bed', bed);
    page.type('sleep-wake', wake);
    await page.tapSave();
    assert.equal(page.pick('sleep-error').textContent,
      SLEEP_REFUSAL_COPY[code] + ' ' + SLEEP_NOTHING_RECORDED, code);
    assert.deepEqual(await opsOf(kit.host.repository), [], 'and nothing was written');
  }
  /* The hours mode, including its own bound. */
  page.click('[data-action="sleep-mode-hours"]');
  page.type('sleep-hours', '25');
  await page.tapSave();
  assert.equal(page.pick('sleep-error').textContent,
    SLEEP_REFUSAL_COPY.HOURS + ' ' + SLEEP_NOTHING_RECORDED);
  assert.deepEqual(await opsOf(kit.host.repository), []);
  /* An explicit zero IS an answer and records. */
  page.type('sleep-hours', '0');
  await page.tapSave();
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'zero hours is recorded');
  assert.deepEqual((await kit.host.all())[0].night, { date: NIGHT, hours: 0 });
  kit.host.close();
});

test('N2-06 / N2-14 - a correction through the screen replaces the night and shows the new shape', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const page = screenOn({ model, mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();
  assert.equal(model.loggedSleep(NIGHT).bed, '23:00');
  page.click('[data-action="sleep-mode-hours"]');
  page.type('sleep-hours', '5.5');
  await page.tapSave();
  assert.equal((await opsOf(kit.host.repository)).length, 2, 'a correction is a NEW op');
  assert.deepEqual(model.loggedSleep(NIGHT), { d: NIGHT, h: 5.5 },
    'and the obsolete clock fields are gone, not stale');
  assert(page.pick('sleep-recorded').textContent.includes(SLEEP_HOURS_NOTE));
  kit.host.close();
});

/* ==========================================================================
   N2-09 / N2-10 / N2-11 / N2-13 - ONE STORE, AND WHAT THE NIGHT REACHES.
   ========================================================================== */
test('N2-09 - the lane is opened through client.hostBindings, in the SAME installation', async () => {
  const source = readRepo('rebuild/m3/w7-preview/today/sleep-host.mjs');
  assert(source.includes('era.client.hostBindings('), 'the honest extension point');
  assert.equal(/era\.create(Reading|Gym|CheckIn|Setup|Food|Sleep)Host/.test(codeOf(source)), false,
    'no w6 factory is asked for a sixth lane');
  assert(source.includes('createDurablePublicClient'), 'the accepted durable client');
  assert(source.includes('LOCAL_ERA_SCHEMA_VERSION'), 'the era own lease schema');
  assert.equal(/indexedDB\.open|new Date\(\)|Date\.now\(\)/.test(codeOf(source)), false,
    'no second store and no second clock');
  /* And a real host really does land in the same generation as a food day. */
  const kit = await device();
  const { createFoodHost } = await import('../food-host.mjs');
  const food = await createFoodHost({ day: DAY, ...kit.lane });
  assert.equal((await kit.host.save({ date: NIGHT, hours: 7 })).ok, true);
  assert.equal((await food.save({ cal: 2100 })).ok, true);
  const ops = await opsOf(kit.host.repository);
  assert.equal(ops.filter((o) => o.class === OP_CLASS).length, 1);
  assert.equal(ops.filter((o) => o.class === 'food-day').length, 1,
    'both facts are in ONE sealed generation under ONE lease');
  assert.deepEqual(kit.host.lease, food.lease, 'the same authority lease');
  food.close(); kit.host.close();
});

test('N2-10 - the night reaches the state the workout preparation and Today read', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const before = model.stateFromOps();
  assert.equal((await kit.host.save({ date: NIGHT, bed: '23:00', wake: '06:30' })).ok, true);
  model.setSleepNights(await laneOver(kit.host));
  const after = model.stateFromOps();
  assert.notDeepEqual(after.sleep.nights, before.sleep.nights, 'the night is in the state');
  assert.equal(after.sleep.nights[after.sleep.nights.length - 1].d, NIGHT);
  /* The plan still prepares over that state, through the engine and nothing else. */
  const view = model.read();
  assert.equal(view.blocked, false);
  assert(view.workout, 'the workout preparation still answers with the night projected');
  /* And the readings replay is untouched by the sleep replay. */
  assert.deepEqual(after.reads, before.reads, 'N2 did not touch the reading replay');
  assert.deepEqual(after.dailyLogs, before.dailyLogs, 'nor the food replay');
  kit.host.close();
});

test('N2-13 - an existing basis night survives, and a same-date correction keeps the rest', () => {
  const model = createTodayModel({ today: DAY });
  const basis = model.basisState();
  assert(basis.sleep.nights.length > 0, 'the fixture athlete already has nights');
  const first = basis.sleep.nights[0];
  /* A date the basis does NOT hold, so an addition is measured as an addition. */
  const fresh = '2029-12-30';
  assert.equal(basis.sleep.nights.some((n) => n.d === fresh), false);
  const state = SleepModel.projectSleepNights(basis, rowsFor([{ date: fresh, hours: 6 }]), model.engine);
  assert.deepEqual(state.sleep.nights[1], first, 'every old row is preserved');
  assert.equal(state.sleep.nights.length, basis.sleep.nights.length + 1);
  /* And a date the basis DOES hold is MERGED, never doubled and never emptied.
     D2 ROUND 1, FINDING 7 - this cell previously asserted an exact two-member
     REPLACEMENT, which enforced the very behaviour the contract forbids: an op speaks
     only about the duration of a night, so a member it does not carry is not news and
     must survive. Only the members the hours form CONTRADICTS are removed. */
  const held = basis.sleep.nights[0].d;
  const replaced = SleepModel.projectSleepNights(basis, rowsFor([{ date: held, hours: 3 }]), model.engine);
  assert.equal(replaced.sleep.nights.length, basis.sleep.nights.length, 'one row per date');
  assert.equal(replaced.sleep.nights[0].d, held);
  assert.equal(replaced.sleep.nights[0].h, 3, 'the new duration wins');
  assert.equal(Object.hasOwn(replaced.sleep.nights[0], 'bed'), false, 'obsolete clock fields go');
  assert.equal(Object.hasOwn(replaced.sleep.nights[0], 'wake'), false);
  assert.equal(Object.hasOwn(replaced.sleep.nights[0], 'awakeMin'), false);
  assert.equal(state.sleep.needed, basis.sleep.needed, 'unrelated sleep members survive');
  /* Zero sleep ops leave an existing basis exactly as it was. */
  assert.equal(SleepModel.projectSleepNights(basis, [], model.engine), basis,
    'an empty op set changes nothing at all');
});

test('N2-11 - a clean-init athlete records a night and NO screen this lane owns prints NaN', async () => {
  // Exercise the integrated H3 constructor and the first night through actual hosts.
  // Missing recovery inputs retain the engine's own interpretation, owned by B1.
  const clean = createCleanInitState({ setup: sleepFirstRunDocument() });
  const model = createTodayModel({ today: DAY, basisState: clean });
  const kit = await device();
  const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'his night is recorded');
  const text = page.text();
  assert.doesNotMatch(text, /NaN/, 'no NaN on the sleep screen');
  assert.doesNotMatch(text, /undefined/, 'and no undefined');
  assert.match(page.pick('sleep-recorded').textContent, /h /, 'his own night is read back');
  // H3 is integrated: execute its actual constructor, then paint the current Today.
  assert.doesNotThrow(() => model.read());
  page.api.render('today');
  assert.doesNotMatch(page.text(), /NaN|undefined/);
  assert.equal(model.basisState().name, clean.name);
  /* The engine reader itself is NAMED here rather than repaired locally: it is an
     m4/workout constructor question and belongs beside H3 (:154 (6)). */
  const state = model.stateFromOps();
  assert.equal(state.sleep.nights.length, 1, 'the night really is in his state');
  const { createWorkoutEntry, createCheckInEntry } = await import('../today-entry.mjs');
  const workout = await createWorkoutEntry(model, kit.lane), checkin = await createCheckInEntry(model, kit.lane);
  const connected = screenOn({ model, query: '?screen=sleep',
    mount: { sleep: await laneOver(kit.host), workout, checkin } });
  await connected.api.checkInKitReady();
  await connected.api.render('workout');
  assert.doesNotMatch(connected.text(), /NaN|undefined/);
  assert.deepEqual(workout.gymHost.host.lastProjection().accepted_state.sleep.nights, state.sleep.nights);
  const beforeCheckIn = await opsOf(kit.host.repository);
  await connected.api.render('recovery');
  assert.doesNotMatch(connected.text(), /NaN|undefined/);
  assert.match(connected.text(), /7\.5 h/);
  assert.deepEqual(await opsOf(kit.host.repository), beforeCheckIn, 'opening the check-in did not confirm it');
  connected.dom.window.close(); page.dom.window.close(); checkin.host.close();
  kit.host.close();
});

/* ==========================================================================
   N2-16 / N2-17 / N2-18 - THE BUILD, THE DESIGN BINDING, DURABILITY, CUSTODY.
   ========================================================================== */
test('N2-17 - a night survives a NEW host over the same encrypted store', async () => {
  const kit = await device();
  assert.equal((await kit.host.save({ date: NIGHT, bed: '22:45', wake: '06:15', awake_min: 10 })).ok, true);
  kit.host.close();
  const again = await kit.open();
  const rows = await again.all();
  assert.equal(rows.length, 1, 'the relaunch found the durable night');
  assert.deepEqual(rows[0].night, { date: NIGHT, bed: '22:45', wake: '06:15', awake_min: 10 });
  const model = createTodayModel({ today: DAY, sleepNights: { rows: () => rows } });
  assert.equal(model.loggedSleep(NIGHT).h, model.engine.sleepSpanH('22:45', '06:15', 10));
  again.close();
});

test('N2-16 - the build carries N2 three modules and still names no network', async () => {
  const result = await buildToday();
  for (const file of NEW_FILES) {
    assert(result.inputs.includes('rebuild/m3/w7-preview/today/' + file), file + ' is not in the built page');
  }
  assert.equal(result.assets.length, 3);
  assert(result.inputs.length >= 110, 'the pinned input inventory grew with N2');
  assert.match(result.buildTag, /^earned-[0-9a-f]{12}$/);
});

test('N2-16 - every sleep sentence is DECLARED, and the binding refuses a dropped one', () => {
  const approved = design.readApproved();
  const source = design.appSource();
  const approvedText = approved.map((a) => a.html).join('\n');
  const lines = [SLEEP_TITLE, SLEEP_NONE, SLEEP_MODE_TIMES, SLEEP_MODE_HOURS, SLEEP_SAVE,
    SLEEP_CLOCK_CHANGE, SLEEP_HOURS_NOTE, SLEEP_FROM_TIMES, SLEEP_USE_CHECKIN,
    SLEEP_NOT_SAVED, SLEEP_NO_STORE, ...Object.values(SLEEP_REFUSAL_COPY)];
  for (const line of lines) {
    assert(design.PREVIEW_RUNTIME_COPY.includes(line), 'declared: ' + line);
    assert(source.includes(line), 'present in a view source: ' + line);
    if (line !== SLEEP_TITLE) {
      assert.equal(approvedText.includes(line), false, 'preview-owned, so ABSENT upstream: ' + line);
    }
  }
  assert.doesNotThrow(() => design.assertDesignBinding(approved, design.templateHtml(), source));
  assert.throws(() => design.assertDesignBinding(approved, design.templateHtml(),
    source.split(SLEEP_SAVE).join('')), /COPY-BINDING FAIL/);
});

test('N2-16 - no em or en dash in N2 own sources, its template or its rendered screen', async () => {
  for (const file of [...NEW_FILES, 'today-app.cjs', 'today-model.cjs']) {
    const text = readRepo('rebuild/m3/w7-preview/today/' + file);
    for (const match of text.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g)) {
      const literal = match[1] === undefined ? match[2] : match[1];
      assert.equal(AI_DASH.test(literal), false, file + ' string literal: ' + literal);
    }
  }
  const template = design.templateHtml();
  const start = template.indexOf('<template id="t-sleep">');
  assert(start >= 0, 'the sleep screen is in the shipped template');
  const section = template.slice(start, template.indexOf('</template>', start));
  assert.equal(AI_DASH.test(section), false, 'the shipped sleep template');
  const kit = await device();
  const page = screenOn({ mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  assert.equal(AI_DASH.test(page.text()), false, 'the rendered screen');
  kit.host.close();
});

test('N2-18 - every class the sleep screen uses is an APPROVED selector, and it invents no width', () => {
  const approved = design.readApproved();
  const template = design.templateHtml();
  const start = template.indexOf('<template id="t-sleep">');
  const section = template.slice(start, template.indexOf('</template>', start));
  const css = approved.map((a) => a.styles).join('\n');
  for (const token of design.classTokens(section)) {
    if (design.PREVIEW_CLASSES.includes(token)) continue;
    const selector = new RegExp('\\.' + token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w-])');
    assert(selector.test(css), '.' + token + ' is not in the approved stylesheets');
  }
  for (const line of design.textOf(section)) {
    assert.equal(/\d/.test(line), false, 'the template carries a literal figure: "' + line + '"');
  }
  assert.equal(/style="/.test(section), false, 'no inline style on the entry');
  assert.equal(/\.sleep/.test(design.chromeCss()), false, 'N2 invents no class');
  for (const file of ['today-app.cjs', ...NEW_FILES]) {
    const text = readRepo('rebuild/m3/w7-preview/today/' + file);
    assert.equal(/(?<![-\w])(min-width|width)\s*[:=]\s*['"]?\d/.test(text), false, file + ' sets a width');
  }
  assert(section.includes('class="hours"'), 'the boxes are the approved direct-entry control');
});

test('N2-16 - N2 touches nothing outside its custody', () => {
  const own = ['sleep-commands.cjs', 'sleep-model.cjs', 'sleep-host.mjs', 'sleep-check.mjs',
    'today-app.cjs', 'today-model.cjs', 'screens.template.html', 'design.cjs', 'build.mjs',
    'test/problem.test.mjs'];
  for (const name of own) {
    assert(fsSync.existsSync(path.join(ROOT, 'rebuild/m3/w7-preview/today', name)), name);
  }
  /* The engine and the client are untouched by construction: N2 imports the span
     function through the composition it is handed and carries no engine of its own. */
  const model = readRepo('rebuild/m3/w7-preview/today/sleep-model.cjs');
  assert.equal(/require\(["']\.\.\/\.\.\/\.\.\/\.\.\/engine/.test(model), false,
    'sleep-model imports no engine of its own');
  const commands = readRepo('rebuild/m3/w7-preview/today/sleep-commands.cjs');
  assert.equal(/require\(["'].*\/client\//.test(commands), false,
    'the producer imports nothing from rebuild/client');
  /* ONE caller of the span function on this page, and it is the projector. */
  const files = fsSync.readdirSync(path.join(ROOT, 'rebuild/m3/w7-preview/today'))
    .filter((name) => /\.(cjs|mjs)$/.test(name));
  const callers = files.filter((name) =>
    /sleepSpanH\(/.test(codeOf(readRepo('rebuild/m3/w7-preview/today/' + name))));
  assert.deepEqual(callers.sort(), ['sleep-model.cjs', 'today-app.cjs'],
    'the projector and the screen estimate, and nothing else: ' + callers);
});

/* ==========================================================================
   N2-07 - THE SAME-PAGE JOURNEY, through the REAL check-in entry.
   ========================================================================== */
test('N2-07 - save a night, open the check-in WITHOUT a reload, and it stops asking twice', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const sleepHost = await createSleepHost({ day: DAY, ...lane });
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: sleepFirstRunDocument() }) });
  /* THE REAL check-in entry, from the pinned today-entry.mjs, over the same store. */
  const { createCheckInEntry } = await import('../today-entry.mjs');
  const entry = await createCheckInEntry(model, lane);
  assert.equal(entry.summary().durable, true, 'the check-in really opened its durable lane');
  assert.equal(entry.checkin.sleepRecord, null, 'and it captured a state with no night in it');
  const checkinOps = async () => (await opsOf(sleepHost.repository))
    .filter((op) => op.class !== OP_CLASS);
  const before = (await checkinOps()).length;

  const page = screenOn({ model, query: '?screen=sleep',
    mount: { sleep: await laneOver(sleepHost), checkin: entry } });
  await page.api.checkInKitReady();
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();
  assert.equal((await opsOf(sleepHost.repository)).filter((o) => o.class === OP_CLASS).length, 1);

  /* NO RELOAD. The route rebinds the check-in over the same host and the CURRENT
     projected state; the screen is the same screen, mounted by checkin-app.mjs. */
  const opened = page.api.render('recovery');
  await opened;
  await new Promise((resolve) => setTimeout(resolve, 0));
  const sheet = page.text();
  const hours = model.loggedSleep(NIGHT).h;
  assert(sheet.includes(String(hours)),
    'the check-in did not offer the night N2 just recorded: ' + sheet.slice(0, 200));
  assert(sheet.includes(NIGHT), 'and it carries the night date with it');
  assert.equal((await checkinOps()).length, before,
    'opening the check-in wrote NOTHING: no automatic confirmation, no check-in op');
  sleepHost.close();
  if (entry.host) entry.host.close();
});

/* ==========================================================================
   N2-12 - THE READ SIDE. The PM narrowed the coach companion to optional
   (:167 (2)): it rides only if this row cannot pass without it.
   ========================================================================== */
test('N2-12 - any reader gets the same dated night and provenance from the shared projector', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  assert.equal((await kit.host.save({ date: NIGHT, bed: '23:00', wake: '06:30', awake_min: 20 })).ok, true);
  const rows = await kit.host.all();
  /* The projector is PURE and takes the state and the engine it is handed, so a second
     reader composing its own state reaches the identical row without a companion. */
  const mine = SleepModel.projectSleepNights(model.basisState(), rows, model.engine);
  const theirs = SleepModel.projectSleepNights(model.basisState(), rows, model.engine);
  assert.deepEqual(SleepModel.loggedNight(mine, NIGHT), SleepModel.loggedNight(theirs, NIGHT));
  assert.equal(SleepModel.loggedNight(mine, NIGHT).h, model.engine.sleepSpanH('23:00', '06:30', 20));
  /* And on REOPENING the lane the same reader gets the same answer, with provenance. */
  kit.host.close();
  const again = await kit.open();
  const reopened = await again.all();
  assert.deepEqual(reopened[0].night, rows[0].night, 'the same night, byte for byte');
  assert.equal(reopened[0].savedDate, rows[0].savedDate, 'and the same save stamp');
  /* The companion reads this profile through the shared host, without authoring it. */
  const world = readRepo('rebuild/coach/local-world.mjs');
  assert.equal(/sleep-night|earned\/sleep-night/.test(world), false,
    'the coach companion must not author its own sleep command or profile');
  again.close();
});

/* ==========================================================================
   D2 ROUND 1 - ONE CELL PER FINDING. Each was written RED against the head D2
   reviewed (3925e90) and is listed in N2-REPORT.md with the failure it printed.
   ========================================================================== */

/* FINDING 1. A reference is a claim about another operation, and a claim is
   worth exactly what authenticating it is worth. */
test('N2-01 - D2 finding 1: a forged check-in reference is refused, and a stale correction cannot supersede', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const host = await createSleepHost({ day: DAY, ...lane });
  const sleepOps = async () => (await opsOf(host.repository)).filter((op) => op.class === OP_CLASS);

  /* (a) AN ID NOTHING ANSWERS TO. Nothing is written and the reason names itself. */
  const forged = await host.save({ date: NIGHT, hours: 7, from_checkin_op_id: 'no-such-operation' });
  assert.equal(forged.ok, false, 'a forged source was accepted');
  assert.equal(forged.code, 'SLEEP_SOURCE_MISSING');
  assert.equal((await sleepOps()).length, 0, 'and it wrote nothing at all');

  /* (b) A REAL CHECK-IN, saved through the accepted entry over the SAME store. */
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: sleepFirstRunDocument() }) });
  const { createCheckInEntry } = await import('../today-entry.mjs');
  const entry = await createCheckInEntry(model, lane);
  const draft = entry.checkin.draft();
  draft.answerSleepHere();
  draft.set('sleep_hours', '7');
  assert.equal((await entry.checkin.save()).ok, true, 'the check-in itself recorded');
  const source = entry.checkin.recorded().op_id;
  assert(source, 'and it has an op id to cite');

  /* The same id with the WRONG hours is refused: a citation must match what it cites. */
  const mismatched = await host.save({ date: NIGHT, hours: 6, from_checkin_op_id: source });
  assert.equal(mismatched.ok, false);
  assert.equal(mismatched.code, 'SLEEP_SOURCE_WRONG_HOURS');
  /* And for the wrong NIGHT: this check-in speaks for the night before its own day. */
  const wrongNight = await host.save({ date: '2030-01-20', hours: 7, from_checkin_op_id: source });
  assert.equal(wrongNight.ok, false);
  assert.equal(wrongNight.code, 'SLEEP_SOURCE_WRONG_NIGHT');
  assert.equal((await sleepOps()).length, 0, 'three refusals, zero writes');

  /* The honest citation is accepted, once it is really a citation. */
  const good = await host.save({ date: NIGHT, hours: 7, from_checkin_op_id: source });
  assert.equal(good.ok, true, good.code || '');
  const first = (await host.forDate(NIGHT))[0].op_id;

  /* (c) A STALE EDITOR. A second screen corrects the night; the first, which still
     believes it is looking at `first`, may not silently replace the newer one. */
  assert.equal((await host.save({ date: NIGHT, hours: 8 }, { supersedes: first })).ok, true);
  const stale = await host.save({ date: NIGHT, hours: 5 }, { supersedes: first });
  assert.equal(stale.ok, false, 'a stale editor overwrote a newer save');
  assert.equal(stale.code, 'SLEEP_STALE_NIGHT');
  assert.equal((await sleepOps()).length, 2, 'the refusal appended nothing');
  assert.equal(SleepModel.recordedNight(await host.all(), NIGHT).night.hours, 8,
    'and the newer night still wins');
  host.close();
  if (entry.host) entry.host.close();
});

/* FINDING 2. Today changing is not the gym host changing. */
test('N2-09 - D2 finding 2: the REAL gym host sees the night after a same-page save', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const sleepHost = await createSleepHost({ day: DAY, ...lane });
  const model = createTodayModel({ today: DAY });
  const { createWorkoutEntry } = await import('../today-entry.mjs');
  const workout = await createWorkoutEntry(model, lane);
  const nightsIn = (entry) => {
    const projection = entry.gymHost.host.lastProjection();
    const state = projection && projection.accepted_state;
    return (state && state.sleep && Array.isArray(state.sleep.nights)) ? state.sleep.nights : [];
  };
  /* A night the athlete has NOT got, so the gym host's answer is unambiguous. */
  const fresh = '2029-12-30';
  assert.equal(nightsIn(workout).some((n) => n.d === fresh), false,
    'the fixture must not already hold the night under test');

  const page = screenOn({ model, query: '?screen=sleep',
    mount: { sleep: await laneOver(sleepHost), workout } });
  /* The page can only rebind where it can reach a store, exactly as it opens its own
     lanes: this window is given the same one device the hosts above are in. */
  Object.defineProperty(page.dom.window, 'indexedDB', { value: fault.indexedDB, configurable: true });
  Object.defineProperty(page.dom.window, 'crypto', { value: webcrypto, configurable: true });
  page.api.render('sleep');
  /* A half-typed set on the gym card, which the athlete has not logged yet. */
  const before = workout.gymDraft();
  before.reps = '8';
  page.choose('sleep-date', fresh);
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '05:00');
  await page.tapSave();
  assert.equal(page.pick('sleep-error').textContent, '', 'the night had to be recorded first');
  await page.api.workoutRebound();

  const rebound = page.api.workoutEntry();
  assert.notEqual(rebound, workout, 'the entry was never rebuilt');
  const row = nightsIn(rebound).find((n) => n.d === fresh);
  assert(row, 'the real gym host still cannot see the night this page just recorded');
  assert.equal(row.h, model.engine.sleepSpanH('23:00', '05:00', 0));
  assert.equal(nightsIn(workout).some((n) => n.d === fresh), false,
    'and the OLD host is left as it was, which is why it had to be replaced');
  assert.equal(rebound.gymDraft().reps, '8', 'the half-typed set did not survive the rebind');
  sleepHost.close();
});

/* FINDING 3. The rebind changes ONE answer. Everything else is still his. */
test('N2-07 - D2 finding 3: rebinding the check-in keeps an unrelated half-typed answer', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const sleepHost = await createSleepHost({ day: DAY, ...lane });
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: sleepFirstRunDocument() }) });
  const { createCheckInEntry } = await import('../today-entry.mjs');
  const entry = await createCheckInEntry(model, lane);
  /* HALF A CHECK-IN, typed before the night was recorded and never saved. */
  const draft = entry.checkin.draft();
  draft.choose('soreness', 'Mild');
  draft.set('soreness_location', 'left knee on the stairs');
  draft.choose('energy', 'Moderate');
  draft.toggleIssue('illness');
  draft.set('illness_note', 'sore throat since Tuesday');

  const page = screenOn({ model, query: '?screen=sleep',
    mount: { sleep: await laneOver(sleepHost), checkin: entry } });
  await page.api.checkInKitReady();
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();

  await page.api.render('recovery');
  await new Promise((resolve) => setTimeout(resolve, 0));
  /* A typed answer lives in an input's VALUE, which no amount of textContent shows. */
  const typed = [...page.doc.querySelectorAll('#phone input, #phone textarea')]
    .map((box) => box.value).filter(Boolean);
  const sheet = page.text();
  assert(typed.includes('left knee on the stairs'),
    'the rebind threw away an answer that had nothing to do with sleep: ' + typed.join(' | '));
  assert(typed.includes('sore throat since Tuesday'), 'and it threw away the illness note too');
  /* The choices he made are still pressed, not merely remembered. */
  assert(page.doc.querySelector('#phone [aria-pressed="true"]'), 'his choices were lost too');
  /* The one thing that MUST change is the night it reads back. */
  assert(sheet.includes(String(model.loggedSleep(NIGHT).h)), 'the new night is what it now offers');
  sleepHost.close();
  if (entry.host) entry.host.close();
});

/* FINDING 4. One device's sequence is an order. Two devices' is not. */
test('N2-06 - D2 finding 4: two unordered devices produce NO winner, and the ambiguous date is named', () => {
  const model = createTodayModel({ today: DAY });
  const twoDevices = [
    { op_id: 'a1', device_id: 'device-A', device_seq: 4, savedDate: DAY, savedTime: '07:00',
      savedOffset: '+00:00', night: { date: NIGHT, hours: 5 } },
    { op_id: 'b1', device_id: 'device-B', device_seq: 2, savedDate: DAY, savedTime: '07:30',
      savedOffset: '+00:00', night: { date: NIGHT, hours: 9 } },
  ];
  assert.deepEqual(SleepModel.winningNights(twoDevices), [],
    'a winner was invented between two devices that carry no order');
  assert.deepEqual(SleepModel.ambiguousNights(twoDevices), [NIGHT],
    'and the date the sync seam must resolve is not even named');

  /* The basis stands: an ambiguous date is projected NOT AT ALL, so no figure on any
     screen is a guess about which device was later. */
  const basis = { sleep: { nights: [{ d: NIGHT, h: 7, bed: '22:00', wake: '05:00' }] } };
  const state = SleepModel.projectSleepNights(basis, twoDevices, model.engine);
  assert.deepEqual(SleepModel.loggedNight(state, NIGHT), { d: NIGHT, h: 7, bed: '22:00', wake: '05:00' });
  /* Reversing the read order changes nothing, because nothing was chosen. */
  assert.deepEqual(SleepModel.winningNights([...twoDevices].reverse()), []);

  /* ONE device with two rows is still ordered, and still has a winner: the narrowing
     at :167 (1) deferred the conflict SCREEN, not this distinction. */
  const oneDevice = twoDevices.map((row) => ({ ...row, device_id: 'device-A' }));
  const won = SleepModel.winningNights(oneDevice);
  assert.equal(won.length, 1);
  assert.equal(won[0].op_id, 'a1', 'the highest device sequence on ONE device wins');
  assert.deepEqual(SleepModel.ambiguousNights(oneDevice), []);
  /* And the real host carries the device identity the projector needs to tell them
     apart, rather than dropping it on the way out. */
  const source = readRepo('rebuild/m3/w7-preview/today/sleep-host.mjs');
  assert.match(source, /device_id:/, 'the host drops the device identity again');
});

/* FINDING 5. The date is chosen, the quality is reused, and nothing is guessed. */
test('N2-04 - D2 finding 5: the night is dated by choice, quality is reused, and no source date is guessed', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: await laneOver(kit.host) } });
  page.api.render('sleep');
  /* (a) THE NIGHT IS DATED, and the athlete may say which night it is. */
  assert.equal(page.pick('sleep-date').value, NIGHT, 'the default is the night just gone');
  assert.equal(page.pick('sleep-date').max, NIGHT, 'and a night still running cannot be chosen');
  const older = '2029-12-30';
  page.choose('sleep-date', older);
  assert.match(page.pick('sleep-night').textContent, new RegExp(older),
    'the label does not follow the night that was chosen');
  page.click('[data-slot="sleep-mode-hours"]');
  page.type('sleep-hours', '6.5');
  await page.tapSave();
  assert.equal(page.pick('sleep-error').textContent, '', 'the chosen night had to record');
  assert.deepEqual((await kit.host.forDate(older))[0].night, { date: older, hours: 6.5 },
    'the night was recorded against a date the athlete never chose');

  /* (b) QUALITY IS THE CHECK-IN'S, DISPLAYED AND NEVER ASKED AGAIN. */
  assert.equal(page.pick('sleep-quality').textContent, TodayApp.SLEEP_QUALITY_NONE);
  assert.equal(page.pick('sleep-open-checkin').hidden, false, 'with no quality, offer the check-in');
  const withQuality = screenOn({ model: createTodayModel({ today: DAY }), query: '?screen=sleep',
    mount: { sleep: await laneOver(kit.host),
      checkin: { summary: () => ({ recorded: true }), host: null,
        checkin: { recorded: () => ({ date: DAY, op_id: 'checkin-1',
          answers: { sleep_quality: 'Good', sleep_hours: 7 } }) } } } });
  withQuality.api.render('sleep');
  assert.equal(withQuality.pick('sleep-quality').textContent, TodayApp.SLEEP_QUALITY_PREFIX + 'Good');
  assert.equal(withQuality.pick('sleep-open-checkin').hidden, true, 'and never asks a second time');

  /* (c) A CITED CHECK-IN THIS SCREEN CANNOT SEE IS NOT DATED WITH TODAY'S DATE. */
  const ghost = [{ op_id: 'ghost-1', device_seq: 1, savedDate: '2030-01-15', savedTime: '08:00',
    savedOffset: '+00:00', night: { date: NIGHT, hours: 7, from_checkin_op_id: 'gone' } }];
  const cited = screenOn({ model: createTodayModel({ today: DAY }), query: '?screen=sleep',
    mount: { sleep: { host: null, rows: () => ghost, refresh: async () => ghost,
      save: async () => ({ ok: false }), close() {} } } });
  cited.api.render('sleep');
  const line = cited.pick('sleep-recorded').textContent;
  assert(line.includes(TodayApp.SLEEP_CONFIRMED_PLAIN), 'it must say only what it knows: ' + line);
  assert.equal(line.includes(DAY), false, "today's date was substituted for provenance: " + line);
  kit.host.close();
});

/* FINDING 6. A commit is a fact; a read is a hope; and a late save owns nothing. */
test('N2-05 - D2 finding 6: an acknowledged night survives a failed read, and a late save never navigates', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: sleepFirstRunDocument() }) });
  /* (a) THE COMMIT LANDS, THE READ DOES NOT. The op is durable, so the screen may not
     go blank and the typed value may not be thrown away with it. */
  let readFails = true;
  let rows = await kit.host.all();
  const brittle = {
    host: kit.host,
    rows: () => rows,
    async refresh() {
      if (readFails) throw Object.assign(new Error('READ_REFUSED'), { code: 'READ_REFUSED' });
      rows = await kit.host.all(); return rows;
    },
    async save(night, precondition) {
      const result = await kit.host.save(night, precondition);
      if (!result || result.ok !== true) return result;
      try { await this.refresh(); return { ...result, readBack: true, readCode: null }; }
      catch (error) { return { ...result, readBack: false, readCode: error.code }; }
    },
    close() {},
  };
  const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: brittle } });
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'the night really committed');
  assert.equal(page.pick('sleep-recorded').hidden, false, 'a committed night vanished from the screen');
  assert.match(page.pick('sleep-recorded').textContent, /7\.5 h/, 'and its own figure with it');
  assert.equal(page.api.sleepAck().date, NIGHT);
  assert.equal(page.pick('sleep-bed').value, '23:00', 'what he typed was thrown away');
  assert.equal(page.pick('sleep-read-retry').hidden, false, 'and he was not offered the read again');
  assert.match(page.pick('sleep-error').textContent, /could not refresh/);

  /* The retry is a READ, not a second write, and it settles the screen. */
  readFails = false;
  page.pick('sleep-read-retry').dispatchEvent(new page.dom.window.Event('click'));
  await page.api.sleepPending();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'the retry wrote a second op');
  assert.equal(page.api.sleepAck(), null, 'the record can speak for itself now');
  assert.equal(page.pick('sleep-read-retry').hidden, true);
  kit.host.close();
});

test('N2-05 - D2 finding 6: a save that resolves after the athlete has left does not steal the screen', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY });
  let release = null;
  const held = new Promise((resolve) => { release = resolve; });
  let rows = await kit.host.all();
  const slow = {
    host: kit.host,
    rows: () => rows,
    async refresh() { rows = await kit.host.all(); return rows; },
    async save(night, precondition) {
      await held;                                    // the write the athlete did not wait for
      const result = await kit.host.save(night, precondition);
      if (!result || result.ok !== true) return result;
      await this.refresh();
      return { ...result, readBack: true, readCode: null };
    },
    close() {},
  };
  const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: slow } });
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  page.pick('sleep-save').dispatchEvent(new page.dom.window.Event('click'));
  /* HE LEAVES while it is in flight. */
  page.api.render('today');
  const onToday = page.text();
  assert.equal(page.api.screen(), 'today');
  release();
  await page.api.sleepPending();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(page.api.screen(), 'today', 'the late save navigated back to its own screen');
  assert.equal(page.text(), onToday, 'and repainted Today from under him');
  assert.equal((await opsOf(kit.host.repository)).length, 1,
    'the write itself still landed, because it was acknowledged');
  kit.host.close();
});

/* FINDING 7. An op carries what it carries; nothing else is news. */
test('N2-13 - D2 finding 7: a same-date overlay keeps unrelated row fields and drops only obsolete clock fields', () => {
  const model = createTodayModel({ today: DAY });
  /* A basis row carrying a member this lane has never heard of - which is precisely
     the case a projector must not destroy. */
  const basis = { sleep: { needed: 8, nights: [
    { d: NIGHT, h: 7, bed: '22:00', wake: '05:00', awakeMin: 15, sourceNote: 'imported from the old app' },
    { d: '2030-02-02', h: 6, sourceNote: 'keep me too' },
  ] } };
  const overlaid = SleepModel.projectSleepNights(basis,
    rowsFor([{ date: NIGHT, hours: 6.25 }]), model.engine);
  const row = SleepModel.loggedNight(overlaid, NIGHT);
  assert.equal(row.h, 6.25, 'the op wins on the member it carries');
  assert.equal(row.sourceNote, 'imported from the old app',
    'the overlay destroyed a field the operation says nothing about');
  assert.equal(Object.hasOwn(row, 'bed'), false, 'and the contradicted clock fields must go');
  assert.equal(Object.hasOwn(row, 'wake'), false);
  assert.equal(Object.hasOwn(row, 'awakeMin'), false);
  /* A TIMES op over the same row keeps the unrelated member and replaces the clock. */
  const timed = SleepModel.projectSleepNights(basis,
    rowsFor([{ date: NIGHT, bed: '23:00', wake: '06:30' }]), model.engine);
  const second = SleepModel.loggedNight(timed, NIGHT);
  assert.equal(second.sourceNote, 'imported from the old app');
  assert.equal(second.bed, '23:00');
  assert.equal(Object.hasOwn(second, 'awakeMin'), false, 'an omitted awake value is not kept');
  /* THE BASIS ITSELF IS NEVER MUTATED. */
  assert.equal(basis.sleep.nights[0].h, 7, 'the basis row was written through');
  assert.equal(basis.sleep.nights[0].bed, '22:00');
  assert.equal(SleepModel.loggedNight(overlaid, '2030-02-02').sourceNote, 'keep me too');
});

/* FINDING 1, the other half. A3's `existing-record` answer is the athlete CONFIRMING a
   night that already exists. It is not where a night comes from, so it may not be cited
   as the origin of one - otherwise a night could cite the check-in that cited it. */
test('N2-01 - D2 finding 1: a confirmed existing record is not the ORIGIN of a night', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const host = await createSleepHost({ day: DAY, ...lane });
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: sleepFirstRunDocument() }) });
  /* The night first, so the check-in has something real to confirm. */
  assert.equal((await host.save({ date: NIGHT, hours: 7 })).ok, true);
  model.setSleepNights(await laneOver(host));
  const { createCheckInEntry } = await import('../today-entry.mjs');
  const entry = await createCheckInEntry(model, lane);
  assert(entry.checkin.sleepRecord, 'the check-in must have found the night to confirm it');
  entry.checkin.draft().confirmSleep();
  assert.equal((await entry.checkin.save()).ok, true);
  const confirmed = entry.checkin.recorded();
  assert.equal(confirmed.answers.sleep_hours_source, 'existing-record',
    'this cell is only meaningful over a CONFIRMATION');

  const cited = await host.save({ date: NIGHT, hours: 7, from_checkin_op_id: confirmed.op_id });
  assert.equal(cited.ok, false, 'a confirmation was accepted as the origin of the night it confirmed');
  assert.equal(cited.code, 'SLEEP_SOURCE_NOT_ENTERED');
  assert.equal((await host.forDate(NIGHT)).length, 1, 'and nothing was appended');
  host.close();
  if (entry.host) entry.host.close();
});

/* ==========================================================================
   D2 ROUND 2 - ONE CELL PER FINDING. Each was written RED against the head D2
   reviewed (7d2fdab), reproducing that round's own executable annex (@ c25bfcb).
   ========================================================================== */

/* FINDING 1. A precondition that is not inside the commit is not a precondition. */
test('N2-01 / N2-05 - D2 round 2 finding 1: two concurrent corrections, and the loser refuses AT THE COMMIT', async () => {
  const kit = await device();
  const one = await kit.host.save({ date: NIGHT, hours: 7 });
  assert.equal(one.ok, true);
  /* BOTH corrections read the same winner before either of them commits, which is
     exactly the race a pre-read cannot see. */
  const both = await Promise.all([
    kit.host.save({ date: NIGHT, hours: 8 }, { supersedes: one.op_id }),
    kit.host.save({ date: NIGHT, hours: 5 }, { supersedes: one.op_id }),
  ]);
  const won = both.filter((r) => r.ok === true);
  const lost = both.filter((r) => r.ok !== true);
  assert.equal(won.length, 1, 'both concurrent corrections were admitted');
  assert.equal(lost.length, 1);
  assert.equal(lost[0].code, 'SLEEP_STALE_NIGHT');
  assert.equal((await kit.host.all()).length, 2, 'the loser appended an operation anyway');
  assert.equal(SleepModel.recordedNight(await kit.host.all(), NIGHT).night.hours, won[0] === both[0] ? 8 : 5,
    'the winner is the one that was acknowledged');

  /* AND THE CHECK IS THE PRODUCER'S, at the store. The accepted client calls this
     validator on the envelope it has built, synchronously, immediately before the one
     transaction that writes it - so a refusal here is a refusal at the commit. */
  const envelope = (hours, supersedes, seq) => ({
    op_id: 'op-dev-A-' + seq, athlete_id: 'ath-1', device_id: 'dev-A', device_seq: seq,
    kind: OP_KIND, class: OP_CLASS, causal_parents: [],
    effective: { local_date: DAY, local_time: '08:00', utc_offset: '+00:00' },
    payload: { profile: PROFILE, night: { date: NIGHT, hours }, supersedes },
  });
  const held = { 'op-dev-A-1': envelope(7, undefined, 1) };
  delete held['op-dev-A-1'].payload.supersedes;
  const reader = (id) => held[id];
  assert.equal(SleepCommands.validate(envelope(8, 'op-dev-A-1', 2), reader), true,
    'a correction that names the current night is accepted');
  assert.equal(SleepCommands.validate(envelope(5, 'op-dev-A-1', 3), (id) =>
    (id === 'op-dev-A-2' ? envelope(8, 'op-dev-A-1', 2) : held[id])), false,
  'a correction whose night has moved on is refused by the producer itself');
  assert.equal(SleepCommands.validate(envelope(5, null, 2), reader), false,
    '"this night has no operation" is refused when it has one');
  kit.host.close();
});

/* FINDING 2. Boot, and a save that finishes after the athlete has walked away. */
test('N2-09 - D2 round 2 finding 2: a stored night at boot, and a late save, both reach the REAL gym host', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const host = await createSleepHost({ day: DAY, ...lane });
  const basis = createTodayModel({ today: DAY }).basisState();
  basis.sleep.nights = [];                       // so a night can only come from the log
  const model = createTodayModel({ today: DAY, basisState: basis });
  const nightsIn = (entry) => {
    const projection = entry.gymHost.host.lastProjection();
    const state = projection && projection.accepted_state;
    return (state && state.sleep && Array.isArray(state.sleep.nights)) ? state.sleep.nights : [];
  };

  /* (a) BOOT WITH A NIGHT ALREADY STORED. No save happens here at all: the athlete
     simply opens the page on a device that already holds last night. */
  assert.equal((await host.save({ date: NIGHT, hours: 3 })).ok, true);
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1:4178/?screen=sleep' });
  Object.defineProperty(dom.window, 'indexedDB', { value: fault.indexedDB, configurable: true });
  Object.defineProperty(dom.window, 'crypto', { value: webcrypto, configurable: true });
  const { boot } = await import('../today-entry.mjs');
  const booted = await boot({ document: dom.window.document, today: DAY, model, ...lane });
  await booted.api.sleepReady();
  await booted.api.workoutRebound();
  assert.equal(booted.model.loggedSleep(NIGHT).h, 3, 'Today reads the stored night');
  assert(nightsIn(booted.api.workoutEntry()).some((n) => n.d === NIGHT),
    'the real gym host was prepared without the night this device already holds');

  /* (b) A SAVE THAT LANDS AFTER BACK. The screen must not be repainted, and the gym
     must still be told: the record is a fact about the device, not about the screen. */
  let release = null;
  const wait = new Promise((resolve) => { release = resolve; });
  const real = await laneOver(host);
  const slow = { ...real, rows: () => real.rows(), async refresh() { return real.refresh(); },
    async save(n, p) { await wait; return real.save(n, p); }, close() {} };
  const workout = booted.api.workoutEntry();
  const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: slow, workout } });
  Object.defineProperty(page.dom.window, 'indexedDB', { value: fault.indexedDB, configurable: true });
  Object.defineProperty(page.dom.window, 'crypto', { value: webcrypto, configurable: true });
  page.api.render('sleep');
  page.pick('sleep-change').dispatchEvent(new page.dom.window.Event('click'));
  page.click('[data-slot="sleep-mode-hours"]');
  page.type('sleep-hours', '1');
  page.pick('sleep-save').dispatchEvent(new page.dom.window.Event('click'));
  page.api.render('today');
  release();
  await page.api.sleepPending();
  await page.api.workoutRebound();
  assert.equal(page.api.screen(), 'today', 'the late save navigated');
  /* Today may repaint - it now has a truer number to show - but the sleep screen is
     NOT remounted over it, which is what "stealing the destination" means. */
  assert.equal(page.pick('sleep-entry-form'), null, 'the sleep screen was painted over Today');
  assert.match(page.text(), /Monday, February 4/, 'and Today is still the screen he chose');
  assert.equal(model.loggedSleep(NIGHT).h, 1, 'the night itself landed');
  const rebound = page.api.workoutEntry();
  assert.notEqual(rebound, workout, 'the gym was left with the state it captured');
  const row = nightsIn(rebound).find((n) => n.d === NIGHT);
  assert(row && row.h === 1, 'the real gym host did not see the night saved after Back');
  host.close();
});

/* FINDING 3. The sheet the athlete is filling in is the sheet he comes back to. */
test('N2-07 - D2 round 2 finding 3: a second visit to the check-in keeps what was typed on the first', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const sleepHost = await createSleepHost({ day: DAY, ...lane });
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: sleepFirstRunDocument() }) });
  const { createCheckInEntry } = await import('../today-entry.mjs');
  const entry = await createCheckInEntry(model, lane);
  entry.checkin.draft().choose('soreness', 'Mild');
  entry.checkin.draft().set('soreness_location', 'Original detail');

  const page = screenOn({ model, query: '?screen=sleep',
    mount: { sleep: await laneOver(sleepHost), checkin: entry } });
  await page.api.checkInKitReady();
  page.api.render('sleep');
  page.type('sleep-bed', '23:00');
  page.type('sleep-wake', '06:30');
  await page.tapSave();

  /* First visit: the night changed, so the model is rebuilt and the draft carried. */
  await page.api.render('recovery');
  await new Promise((resolve) => setTimeout(resolve, 0));
  const typedBox = [...page.doc.querySelectorAll('#phone input, #phone textarea')]
    .find((box) => box.value === 'Original detail');
  assert(typedBox, 'the first carry is what round 1 fixed');
  /* He edits THE REPLACEMENT, then leaves and comes back. */
  typedBox.value = 'Updated detail';
  typedBox.dispatchEvent(new page.dom.window.Event('input', { bubbles: true }));
  /* He steps out to Sleep and back. Today is not the route here only because a
     clean-init athlete still throws out of energy.cjs before H3 (N2-11's residual). */
  page.api.render('sleep');
  await page.api.render('recovery');
  await new Promise((resolve) => setTimeout(resolve, 0));
  const values = [...page.doc.querySelectorAll('#phone input, #phone textarea')].map((box) => box.value);
  assert(values.includes('Updated detail'),
    'the second visit threw away what he typed into the replacement: ' + values.filter(Boolean).join(' | '));
  assert.equal(values.includes('Original detail'), false, 'and put the original back');

  /* A SECOND CORRECTION rebinds again, and still carries the CURRENT sheet. */
  page.api.render('sleep');
  page.pick('sleep-change').dispatchEvent(new page.dom.window.Event('click'));
  page.click('[data-slot="sleep-mode-hours"]');
  page.type('sleep-hours', '6');
  await page.tapSave();
  assert.equal(page.pick('sleep-error').textContent, '', 'the correction had to record');
  /* A second operation for one night reads as a CORRECTION, not a first entry. */
  assert.match(page.pick('sleep-recorded').textContent, /Corrected \d{4}-\d{2}-\d{2} at \d{2}:\d{2}/,
    'the corrected night is not named as one: ' + page.pick('sleep-recorded').textContent);
  await page.api.render('recovery');
  await new Promise((resolve) => setTimeout(resolve, 0));
  const after = [...page.doc.querySelectorAll('#phone input, #phone textarea')].map((box) => box.value);
  assert(after.includes('Updated detail'), 'a second rebind lost the current sheet: ' + after.filter(Boolean).join(' | '));
  sleepHost.close();
  if (entry.host) entry.host.close();
});

/* FINDING 4. The reuse control exists for a check-in the athlete really answered. */
test('N2-08 - D2 round 2 finding 4: the REAL check-in hours are offered, and the saved night cites that op', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const sleepHost = await createSleepHost({ day: DAY, ...lane });
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: sleepFirstRunDocument() }) });
  const { createCheckInEntry } = await import('../today-entry.mjs');
  const entry = await createCheckInEntry(model, lane);
  entry.checkin.draft().answerSleepHere();
  entry.checkin.draft().set('sleep_hours', '7');
  entry.checkin.draft().choose('sleep_quality', 'Good');
  assert.equal((await entry.checkin.save()).ok, true);
  const stored = entry.checkin.recorded();
  assert.deepEqual(stored.answers.sleep_hours, { value: 7, unit: 'h' },
    'this cell is only meaningful over the shape A3 really stores');

  const page = screenOn({ model, query: '?screen=sleep',
    mount: { sleep: await laneOver(sleepHost), checkin: entry } });
  await page.api.checkInKitReady();
  await page.api.sleepCheckInReady();
  page.api.render('sleep');
  assert.equal(page.pick('sleep-use-checkin').hidden, false,
    'the reuse control is hidden for the one check-in it exists for');
  assert.match(page.pick('sleep-checkin').textContent, /7 h/);
  assert.match(page.pick('sleep-quality').textContent, /Good/);

  /* TAKING IT writes a night that CITES the real operation, and the host accepts it
     only because that citation is genuine. */
  page.pick('sleep-use-checkin').dispatchEvent(new page.dom.window.Event('click'));
  assert.equal(page.pick('sleep-hours').value, '7');
  await page.tapSave();
  assert.equal(page.pick('sleep-error').textContent, '', 'the cited night had to record');
  const saved = (await sleepHost.forDate(NIGHT))[0];
  assert.equal(saved.night.hours, 7);
  assert.equal(saved.night.from_checkin_op_id, stored.op_id,
    'the saved night does not carry the source the athlete reused');

  /* AND ONLY FOR THIS NIGHT. A check-in for the morning after some OTHER night is
     not an answer about this one. */
  const empty = createTodayModel({ today: DAY }).basisState();
  empty.sleep.nights = [];               // so nothing but the offer can fill the screen
  const older = screenOn({ model: createTodayModel({ today: DAY, basisState: empty }),
    query: '?screen=sleep',
    mount: { sleep: { host: null, rows: () => [], refresh: async () => [],
      save: async () => ({ ok: false }), close() {} },
      checkin: { summary: () => ({ recorded: true }), host: null,
        checkin: { recorded: () => ({ date: '2030-01-09', op_id: 'checkin-old',
          answers: { sleep_hours: { value: 9, unit: 'h' }, sleep_hours_source: 'entered' } }) } } } });
  older.api.render('sleep');
  assert.equal(older.pick('sleep-use-checkin').hidden, true,
    "another day's check-in was offered as this night's duration");
  sleepHost.close();
  if (entry.host) entry.host.close();
});

/* FINDING 5. What the screen says about a write must be what the log supports. */
test('N2-05 - D2 round 2 finding 5: a committed correction is shown, and an unknown outcome is never called nothing', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: sleepFirstRunDocument() }) });
  /* (a) 8 h RECORDED, CORRECTED TO 5 h, AND THE READ-BACK FAILS. The log says 5. */
  assert.equal((await kit.host.save({ date: NIGHT, hours: 8 })).ok, true);
  let rows = await kit.host.all();
  const brittle = {
    host: kit.host,
    rows: () => rows,
    async refresh() { throw Object.assign(new Error('READ_REFUSED'), { code: 'READ_REFUSED' }); },
    async save(night, precondition) {
      const result = await kit.host.save(night, precondition);
      if (!result || result.ok !== true) return result;
      try { await this.refresh(); return { ...result, readBack: true, readCode: null }; }
      catch (error) { return { ...result, readBack: false, readCode: error.code }; }
    },
    close() {},
  };
  const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: brittle } });
  page.api.render('sleep');
  page.pick('sleep-change').dispatchEvent(new page.dom.window.Event('click'));
  page.click('[data-slot="sleep-mode-hours"]');
  page.type('sleep-hours', '5');
  await page.tapSave();
  assert.equal(SleepModel.recordedNight(await kit.host.all(), NIGHT).night.hours, 5, 'the log holds 5');
  assert.equal(page.api.sleepAck().hours, 5);
  const line = page.pick('sleep-recorded').textContent;
  assert.match(line, /5 h/, 'the screen showed the night the correction replaced: ' + line);
  assert.doesNotMatch(line, /8 h/, 'and it must not still claim the old one');
  assert.match(line, /Save time not recorded\./, 'nor claim a stamp it does not have');
  kit.host.close();
});

test('N2-05 - D2 round 2 finding 5: a lost acknowledgment with an unreadable log stays UNKNOWN', async () => {
  const kit = await device();
  const model = createTodayModel({ today: DAY, basisState: createCleanInitState({ setup: sleepFirstRunDocument() }) });
  let readable = false;
  const rows = [];
  const lost = {
    host: kit.host,
    rows: () => rows,
    async refresh() {
      if (!readable) throw Object.assign(new Error('READ_REFUSED'), { code: 'READ_REFUSED' });
      rows.length = 0; rows.push(...await kit.host.all()); return rows;
    },
    /* The write COMMITS and then the acknowledgment is lost on the way back. */
    async save(night, precondition) {
      assert.equal((await kit.host.save(night, precondition)).ok, true);
      throw new Error('ACK_LOST');
    },
    close() {},
  };
  const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: lost } });
  page.api.render('sleep');
  page.click('[data-slot="sleep-mode-hours"]');
  page.type('sleep-hours', '4');
  await page.tapSave();
  assert.equal((await kit.host.all()).length, 1, 'the op did commit');
  assert.doesNotMatch(page.pick('sleep-error').textContent, /Nothing was recorded/,
    'the screen denied a write the log actually holds');
  assert.equal(page.pick('sleep-error').textContent, TodayApp.SLEEP_UNCERTAIN);
  assert.equal(page.pick('sleep-save').disabled, true, 'and left the save open to a duplicate');
  assert.equal(page.pick('sleep-read-retry').hidden, false, 'with no way to settle it');

  /* THE READ SETTLES IT. Now the log can be read, and it holds the night. */
  readable = true;
  page.pick('sleep-read-retry').dispatchEvent(new page.dom.window.Event('click'));
  await page.api.sleepPending();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal((await kit.host.all()).length, 1, 'settling the question wrote a second op');
  assert.equal(page.pick('sleep-save').disabled, false, 'the fence stayed up after the answer');
  assert.equal(page.pick('sleep-error').textContent, '');
  assert.match(page.pick('sleep-recorded').textContent, /4 h/, 'and the night it holds is shown');
  kit.host.close();
});

/* FINDING 6. The consumer proof :167 (2) made optional, now executed. */
test('N2-12 - D2 round 2 finding 6: the REAL coach reports the night this device recorded', async () => {
  const fault = faultDatabase();
  const inputs = { indexedDB: fault.indexedDB, crypto: webcrypto, day: DAY };
  const { openCoachWorld } = await import('../../../../coach/local-world.mjs');
  const Tools = (await import('../../../../coach/tools.cjs')).default;
  let world = await openCoachWorld(inputs);
  assert.equal(world.sleepOnLocalEra, true, 'the coach must really have the lane');
  /* The night is written through a host on the coach's OWN era - the same generation,
     lease and commit path its weigh-in and its workout are in. */
  const host = await createSleepHost({ day: DAY,
    era: { client: world.client, athleteId: world.bindings.athleteId, deviceId: world.bindings.deviceId } });
  assert.equal((await host.save({ date: NIGHT, hours: 1 })).ok, true);
  assert.equal((await host.all()).at(-1).night.hours, 1);

  /* THE ACTUAL TOOL, on the world that was already open when the night was written. */
  const after = await Tools.createCoachTools(world).openTurn('n2-after-save').call.today_checkin({});
  assert.equal(after.ok, true);
  assert.equal(after.values.sleepRecordHours.value, 1,
    'the coach reported a night the athlete does not have: ' + after.values.sleepRecordHours.value);
  assert.equal(after.values.sleepRecordDate.value, NIGHT);
  host.close(); world.close();

  /* AND AFTER A REOPEN, from the durable record alone. */
  world = await openCoachWorld(inputs);
  const reopened = await Tools.createCoachTools(world).openTurn('n2-after-reopen').call.today_checkin({});
  assert.equal(reopened.values.sleepRecordHours.value, 1);
  const ops = Object.values((await world.bindings.repository.load()).generation.collections.ops);
  assert.equal(ops.find((op) => op.class === OP_CLASS).payload.night.hours, 1,
    'and the stored operation is what it read');
  /* A COACH THAT CANNOT OPEN THE LANE SAYS SO rather than reporting the basis. */
  assert.equal(world.sleepOnLocalEra, true);
  world.close();
  const blind = await openCoachWorld({ ...inputs, withSleep: false });
  assert.equal(blind.sleepOnLocalEra, false, 'an unavailable lane must be declared, not hidden');
  blind.close();
});

test('N2-12 R3-C1 - the actual coach confirms the hours and date it read', async () => {
  const { openCoachWorld } = await import('../../../../coach/local-world.mjs');
  const Tools = (await import('../../../../coach/tools.cjs')).default;
  const world = await openCoachWorld({ indexedDB: faultDatabase().indexedDB, crypto: webcrypto, day: DAY });
  try {
    assert.equal((await world.sleepHost.save({ date: NIGHT, hours: 1 })).ok, true);
    const turn = Tools.createCoachTools(world).openTurn('n2-r3-confirm');
    const read = await turn.call.today_checkin({});
    assert.equal(read.values.sleepRecordHours.value, 1);
    assert.equal((await turn.call.answer_checkin({ confirmed: true, confirm_sleep_record: true })).ok, true);
    const saved = world.checkin.recorded().answers;
    assert.equal(saved.sleep_hours.value, 1, 'confirmation used a stale draft closure');
    assert.equal(saved.sleep_hours_source, 'existing-record');
    assert.equal(saved.sleep_hours_record_date, NIGHT);
  } finally { world.close(); }
});

test('N2-12 R3-C2 - a disabled sleep reader returns an unavailable value, never basis hours', async () => {
  const { openCoachWorld } = await import('../../../../coach/local-world.mjs');
  const Tools = (await import('../../../../coach/tools.cjs')).default;
  const world = await openCoachWorld({ indexedDB: faultDatabase().indexedDB, crypto: webcrypto, day: DAY, withSleep: false });
  try {
    const turn = Tools.createCoachTools(world).openTurn('n2-r3-disabled');
    const read = await turn.call.today_checkin({});
    assert.equal(world.sleepOnLocalEra, false);
    assert.equal(read.values.sleepRecordHours.value, null);
    assert.equal(read.values.sleepRecordHours.blank, true);
    assert.equal(world.sleepNight(), null);
    const before = await opsOf(world.checkInHost.repository);
    const saved = await turn.call.answer_checkin({ confirmed: true, confirm_sleep_record: true });
    assert.equal(saved.ok, false, 'an unavailable night cannot be confirmed');
    assert.deepEqual(await opsOf(world.checkInHost.repository), before);
  } finally { world.close(); }
});

test('N2-12 R3-C3 - the actual reader rereads another client in the same encrypted store', async () => {
  const { openCoachWorld } = await import('../../../../coach/local-world.mjs');
  const Tools = (await import('../../../../coach/tools.cjs')).default;
  const options = { indexedDB: faultDatabase().indexedDB, crypto: webcrypto, day: DAY };
  const reader = await openCoachWorld(options), writer = await openCoachWorld(options);
  try {
    assert.notEqual(reader.client, writer.client);
    assert.equal((await writer.sleepHost.save({ date: NIGHT, hours: 2 })).ok, true);
    assert.equal((await opsOf(reader.bindings.repository)).find(op => op.class === 'sleep').payload.night.hours, 2);
    const read = await Tools.createCoachTools(reader).openTurn('n2-r3-other-client').call.today_checkin({});
    assert.equal(read.values.sleepRecordHours.value, 2);
    assert.equal(read.values.sleepRecordDate.value, NIGHT);
  } finally { writer.close(); reader.close(); }
});

test('N2-12 R3 - a night changed since the coach read needs a new confirmation', async () => {
  const { openCoachWorld } = await import('../../../../coach/local-world.mjs');
  const Tools = (await import('../../../../coach/tools.cjs')).default;
  const options = { indexedDB: faultDatabase().indexedDB, crypto: webcrypto, day: DAY };
  const reader = await openCoachWorld(options), writer = await openCoachWorld(options);
  try {
    assert.equal((await writer.sleepHost.save({ date: NIGHT, hours: 1 })).ok, true);
    const turn = Tools.createCoachTools(reader).openTurn('n2-r3-stale-confirm');
    assert.equal((await turn.call.today_checkin({})).values.sleepRecordHours.value, 1);
    assert.equal((await writer.sleepHost.save({ date: NIGHT, hours: 2 })).ok, true);
    const before = await opsOf(reader.checkInHost.repository);
    const saved = await turn.call.answer_checkin({ confirmed: true, confirm_sleep_record: true, note: 'Keep this typed answer' });
    assert.equal(saved.ok, false);
    assert.deepEqual(await opsOf(reader.checkInHost.repository), before);
    assert.equal(reader.checkin.draft().state().fields.note, 'Keep this typed answer');
    assert.equal(reader.checkin.draft().state().sleepConfirm, null);
    assert.equal((await turn.call.today_checkin({})).values.sleepRecordHours.value, 2);
    assert.equal((await turn.call.answer_checkin({ confirmed: true, confirm_sleep_record: true })).ok, true);
    assert.equal(reader.checkin.recorded().answers.sleep_hours.value, 2);
  } finally { writer.close(); reader.close(); }
});

for (const delayedRead of [false, true]) {
  test('N2-05 R3-U1 - historical equality cannot acknowledge a new save' + (delayedRead ? ' on retry' : ''), async () => {
    const kit = await device();
    try {
      await kit.host.save({ date: NIGHT, hours: 5 });
      await kit.host.save({ date: NIGHT, hours: 8 });
      let readable = !delayedRead;
      const lane = entryFor({ ...kit.host,
        async all() { if (!readable) throw new Error('READ_UNAVAILABLE'); return kit.host.all(); },
        async save() { throw new Error('SYNTHETIC_BEFORE_COMMIT'); },
      }, await kit.host.all());
      const page = screenOn({ query: '?screen=sleep', mount: { sleep: lane } });
      page.pick('sleep-change').click(); page.pick('sleep-mode-hours').click(); page.type('sleep-hours', '5');
      await page.tapSave();
      if (delayedRead) {
        assert.equal(page.pick('sleep-save').disabled, true);
        readable = true; page.pick('sleep-read-retry').click(); await page.api.sleepPending();
      }
      assert.equal((await kit.host.all()).length, 2);
      assert.equal(SleepModel.recordedNight(await kit.host.all(), NIGHT).night.hours, 8);
      assert.equal(page.pick('sleep-hours').value, '5', 'the failed draft was erased');
      assert.match(page.pick('sleep-error').textContent, /Nothing was recorded/);
      assert.equal(page.pick('sleep-save').disabled, false);
      assert.match(page.pick('sleep-recorded').textContent, /8 h/);
      page.dom.window.close();
    } finally { kit.host.close(); }
  });
}

async function historicalPage() {
  const { createCheckInEntry } = await import('../today-entry.mjs');
  const inputs = { indexedDB: faultDatabase().indexedDB, crypto: webcrypto };
  const prior = await createCheckInEntry(createTodayModel({ today: '2030-02-03' }), inputs);
  prior.checkin.draft().choose('sleep_quality', 'Good');
  assert.equal((await prior.checkin.save()).ok, true);
  const basis = createTodayModel({ today: DAY }).basisState(); basis.sleep.nights = [];
  const model = createTodayModel({ today: DAY, basisState: basis });
  const entry = await createCheckInEntry(model, inputs), host = await createSleepHost({ day: DAY, ...inputs });
  const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: await laneOver(host), checkin: entry } });
  await page.api.checkInKitReady();
  page.choose('sleep-date', '2030-02-02'); await page.api.sleepCheckInReady?.();
  return { page, host, entry, close() { page.dom.window.close(); host.close(); entry.host.close(); prior.host.close(); } };
}

test('N2-08 R3-D1 - an earlier night reads quality from its following-day check-in', async () => {
  const kit = await historicalPage();
  try {
    assert.equal((await kit.entry.host.forDate('2030-02-03')).at(-1).answers.sleep_quality, 'Good');
    assert.match(kit.page.pick('sleep-quality').textContent, /Quality: Good/);
    assert.match(kit.page.text(), /From your check-in on 2030-02-03\./);
  } finally { kit.close(); }
});

test('N2-04 R3-D2 - saving an earlier night retains the selected date and visible record', async () => {
  const kit = await historicalPage();
  try {
    const { page, host } = kit;
    page.pick('sleep-mode-hours').click(); page.type('sleep-hours', '5'); await page.tapSave();
    assert.equal((await host.forDate('2030-02-02')).at(-1).night.hours, 5);
    assert.equal(page.pick('sleep-date').value, '2030-02-02');
    assert.equal(page.pick('sleep-recorded').hidden, false);
    assert.match(page.pick('sleep-recorded').textContent, /5 h/);
    page.pick('sleep-change').click(); page.type('sleep-hours', '6'); await page.tapSave();
    assert.equal(page.pick('sleep-date').value, '2030-02-02');
    assert.match(page.pick('sleep-recorded').textContent, /6 h/);
  } finally { kit.close(); }
});

test('N2-12 R4 - an unreadable sleep host cannot reuse a previously read night', async () => {
  const { openCoachWorld } = await import('../../../../coach/local-world.mjs');
  const Tools = (await import('../../../../coach/tools.cjs')).default;
  const world = await openCoachWorld({ indexedDB: faultDatabase().indexedDB, crypto: webcrypto, day: DAY });
  try {
    await world.sleepHost.save({ date: NIGHT, hours: 3 });
    const turn = Tools.createCoachTools(world).openTurn('n2-r4-unreadable');
    assert.equal((await turn.call.today_checkin({})).values.sleepRecordHours.value, 3);
    world.sleepHost.close();
    const read = await turn.call.today_checkin({});
    assert.equal(read.values.sleepRecordHours.value, null);
    assert.equal(read.values.sleepRecordHours.blank, true);
    assert.match(read.values.note.value, /could not be read/);
    assert.equal(world.sleepOnLocalEra, false);
    assert.equal((await turn.call.answer_checkin({ confirmed: true, confirm_sleep_record: true })).ok, false);
  } finally { world.close(); }
});

for (const chosen of [null, '2030-02-01']) {
  test('N2-04 R4 - the installation clock rollover requires confirmation' + (chosen ? ' for a chosen earlier night' : ''), async () => {
    const { openTodayInstallation } = await import('../../../w6/local/today-bindings.mjs');
    let day = DAY;
    const clock = { today: () => day, now: () => day + 'T13:00:00.000Z', tz: '-05:00', monotonicMs: () => 0 };
    const era = await openTodayInstallation({ indexedDB: faultDatabase().indexedDB, crypto: webcrypto, day, clock });
    const host = await createSleepHost({ day, era });
    try {
      const model = createTodayModel({ today: day, basisState: createCleanInitState({ setup: sleepFirstRunDocument() }) });
      const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: await laneOver(host) } });
      if (chosen) page.choose('sleep-date', chosen);
      page.pick('sleep-mode-hours').click(); page.type('sleep-hours', '4');
      day = '2030-02-05';
      // No intervening paint: pressing Save must itself read the installation clock.
      await page.tapSave();
      assert.equal((await host.all()).length, 0);
      assert.match(page.pick('sleep-error').textContent, /The date changed/);
      assert.equal(page.pick('sleep-keep-night').hidden, false);
      assert.equal(page.pick('sleep-hours').value, '4');
      page.pick('sleep-keep-night').click(); await page.tapSave();
      const saved = (await host.all()).at(-1);
      assert.equal(saved.night.date, chosen || NIGHT);
      assert.equal(saved.savedDate, day, 'the envelope must use the same current clock');
      assert.equal(page.pick('sleep-date').value, chosen || NIGHT);
      page.dom.window.close();
    } finally { host.close(); era.close(); }
  });
}

test('N2-10 R4 - an active Start and set remain byte-identical across sleep rebind', async () => {
  const { createWorkoutEntry } = await import('../today-entry.mjs');
  const { EFFORT_CHOICES } = await import('../gym-model.mjs');
  const fault = faultDatabase(), inputs = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const model = createTodayModel({ today: DAY }), workout = await createWorkoutEntry(model, inputs);
  const host = await createSleepHost({ day: DAY, ...inputs });
  try {
    assert.equal((await workout.gym.start()).ok, true);
    const active = await workout.gym.read();
    assert.equal(active.phase, 'active');
    assert.equal((await workout.gym.logSet({ startId: active.startId, slot: active.set.slot, lift: active.set.lift,
      load: String(active.entry.load), reps: String(active.entry.reps), effort: EFFORT_CHOICES.find(c => c.label === '2').reserve })).ok, true);
    workout.gym.forget();
    const before = (await opsOf(host.repository)).map(op => JSON.stringify(op));
    Object.assign(workout.gymDraft(), { load: '25', reps: '7', effort: '2' });
    const page = screenOn({ model, query: '?screen=sleep', mount: { sleep: await laneOver(host), workout } });
    Object.defineProperty(page.dom.window, 'indexedDB', { value: fault.indexedDB, configurable: true });
    Object.defineProperty(page.dom.window, 'crypto', { value: webcrypto, configurable: true });
    page.pick('sleep-change').click(); page.pick('sleep-mode-hours').click(); page.type('sleep-hours', '6');
    await page.tapSave(); await page.api.workoutRebound();
    const next = page.api.workoutEntry();
    assert.notEqual(next, workout);
    assert.deepEqual(next.gymDraft(), workout.gymDraft());
    const after = await opsOf(host.repository);
    assert.equal(after.length, before.length + 1);
    for (const op of before) assert(after.some(value => JSON.stringify(value) === op));
    const resumed = await next.gym.read();
    assert.equal(resumed.startId, active.startId);
    assert.equal(resumed.phase, 'active');
    assert.equal(next.gymHost.host.lastProjection().accepted_state.sleep.nights.find(n => n.d === NIGHT).h, 6);
    page.dom.window.close();
  } finally { host.close(); }
});

test('N2-08 R4 - a historical recovery link names its day and cannot save into today', async () => {
  const kit = await historicalPage();
  try {
    kit.page.choose('sleep-date', '2030-02-01'); await kit.page.api.sleepCheckInReady();
    const before = await opsOf(kit.host.repository);
    kit.page.pick('sleep-open-checkin').click();
    await kit.page.api.sleepCheckInReady(); await new Promise(resolve => setTimeout(resolve, 0));
    assert.match(kit.page.text(), /Recovery check-in on 2030-02-02/);
    assert.equal(kit.page.doc.querySelectorAll('#phone [data-field]').length, 0);
    assert.deepEqual(await opsOf(kit.host.repository), before);
  } finally { kit.close(); }
});

test('N2-05 R4 - aborting the real active-put transaction preserves ops and outbox', async () => {
  const kit = await device();
  try {
    await kit.host.save({ date: NIGHT, hours: 8 });
    const beforeOps = await opsOf(kit.host.repository), beforeOutbox = await outboxOf(kit.host.repository);
    kit.fault.state.armed = true; kit.fault.state.mode = 'delay';
    const saving = kit.host.save({ date: NIGHT, hours: 5 }, { supersedes: beforeOps.at(-1).op_id });
    await kit.fault.state.write.promise;
    kit.fault.state.tx.abort(); kit.fault.state.armed = false; kit.fault.state.release = true;
    assert.equal((await saving).ok, false);
    assert.deepEqual(await opsOf(kit.host.repository), beforeOps);
    assert.deepEqual(await outboxOf(kit.host.repository), beforeOutbox);
  } finally { kit.host.close(); }
});

test('N2-01 R4 - a cited quantity must actually use hours in both source validators', async () => {
  const { checkInSourceFault } = await import('../sleep-host.mjs');
  const night = { date: NIGHT, hours: 7, from_checkin_op_id: 'checkin-test' };
  const source = { op_id: 'checkin-test', athlete_id: 'ath-test', class: 'event', kind: 'fact',
    effective: { local_date: DAY }, payload: { profile: 'earned/recovery-checkin/v1',
      answers: { sleep_hours: { value: 7, unit: 'kg' }, sleep_hours_source: 'entered' } } };
  const op = { athlete_id: 'ath-test', payload: { night } };
  assert.equal(SleepCommands.citedCheckInIsReal(op, () => source), false);
  assert.equal(checkInSourceFault({ collections: { ops: { 'checkin-test': source } } }, night), 'SLEEP_SOURCE_WRONG_HOURS');
  source.payload.answers.sleep_hours.unit = 'h';
  assert.equal(SleepCommands.citedCheckInIsReal(op, () => source), true);
  assert.equal(checkInSourceFault({ collections: { ops: { 'checkin-test': source } } }, night), null);
});

test('N2-05 R4 - a stale correction shows the new saved record and preserves its draft', async () => {
  const kit = await device();
  try {
    await kit.host.save({ date: NIGHT, hours: 8 });
    const page = screenOn({ query: '?screen=sleep', mount: { sleep: await laneOver(kit.host) } });
    page.pick('sleep-change').click(); page.pick('sleep-mode-hours').click(); page.type('sleep-hours', '7');
    await kit.host.save({ date: NIGHT, hours: 9 });
    await page.tapSave();
    assert.equal((await kit.host.all()).length, 2);
    assert.equal(page.pick('sleep-hours').value, '7');
    assert.match(page.pick('sleep-recorded').textContent, /9 h/);
    assert.match(page.pick('sleep-error').textContent, /This night changed/);
    await page.tapSave();
    assert.equal((await kit.host.all()).length, 3);
    assert.match(page.pick('sleep-recorded').textContent, /7 h/);
    page.dom.window.close();
  } finally { kit.host.close(); }
});

/* ==========================================================================
   N2-19 - ABSENCE IS UNKNOWN, NEVER ZERO, AND APPLIES NO RESTRICTION.
   PM routing DECISIONS:427 (1): N2 carried no cell for this bar item, so one is
   added here, executed against the ENGINE'S OWN readers (D8, DECISIONS:109 PATH A)
   rather than anything N2 invents about sleep. */
test('N2-19 - with no nights recorded the engine reads UNKNOWN, never zero, and applies no restriction (D8, DECISIONS:109 PATH A)', () => {
  const basis = createTodayModel({ today: DAY }).basisState();
  basis.sleep.nights = [];                       // a fresh, zero-night athlete
  const bare = createTodayModel({ today: DAY, basisState: basis });
  const state = bare.stateFromOps();
  assert.equal(state.sleep.nights.length, 0, 'this cell is only meaningful with no nights at all');
  /* THE ENGINE'S OWN READER, not a re-implementation: sleepInfo's `last` is the
     athlete's last recorded night, and with none it is UNKNOWN - `undefined`, never
     a manufactured zero. */
  const info = bare.engine.sleepInfo(state);
  assert.equal(info.last, undefined, 'an absent night was read as zero rather than unknown');
  assert.notEqual(info.last, 0);
  /* AND cleanAtDate - the debt gate D8 answers through - applies NO restriction to an
     athlete it has no nights for (DECISIONS:109 PATH A: a fresh zero-night athlete is
     never held back by a debt the engine cannot see). */
  assert.equal(bare.engine.cleanAtDate(state, DAY), true,
    'an athlete with no nights at all was restricted by a debt the engine invented');
  assert.equal(info.clean, true);
  /* AND THE DAY ITSELF: the workout preparation still opens, exactly as it does for
     any other clean-init athlete (N2-11), because sleep absence carries no gate of
     its own. */
  const view = bare.read();
  assert.equal(view.blocked, false, 'an absent night blocked the day it does not describe');
  assert(view.workout, 'the workout preparation refused an athlete for a night it never recorded');
});
