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
import { createGymHost } from '../gym-host.mjs';
import { createGymModel, EFFORT_CHOICES } from '../gym-model.mjs';
import { createWorkoutEntry, createSetupEntry, createCheckInEntry } from '../today-entry.mjs';
import { createSetupModel } from '../setup-model.mjs';
import TodayApp from '../today-app.cjs';
import TodayModel from '../today-model.cjs';
import ProblemReport from '../problem-report.cjs';
import ClientCopy from '../../../../client/copy.cjs';
import PlainCopy from '../plain-copy.cjs';
import design from '../design.cjs';
import { buildToday, buildIdOf, buildTagOf, injectBuildId, DIST } from '../build.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

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
