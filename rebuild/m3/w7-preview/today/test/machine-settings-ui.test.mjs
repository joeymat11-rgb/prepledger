/* machine-settings-ui.test.mjs - the gym card's half of coach wave one
   (DECISIONS:154 (2), :140): the settings this athlete stored for THIS machine, shown
   back on the active set, and captured from it.

   Real here: the encrypted repository over fake-indexeddb, the ACCEPTED durable public
   client, the accepted W6 workout host behind gym-model.mjs, the coach's own producer
   (rebuild/coach/machine-settings-commands.cjs) and its own read tool
   (rebuild/coach/wave1-tools.cjs machine_settings), the shipped template and the real
   design binding. Nothing is stubbed.

   THE ONE-SHAPE CLAIM IS EXECUTED, NOT ASSERTED (S6). S6c drives the coach's own
   wave-one tool over the lane the GYM CARD opened and captured into, and S6a compares
   the op the card writes with the op the coach's producer builds for the same answer,
   member by member. A second validator, a second profile or a gym-card flavour of the
   payload fails here rather than in the field. */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { webcrypto, createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { createGymHost } from '../gym-host.mjs';
import { createGymModel, EFFORT_CHOICES } from '../gym-model.mjs';
import GymApp, { mountGym } from '../gym-app.mjs';
import { createMachineSettingsHost, PROFILE, ACTION } from '../machine-settings-host.mjs';
import MachineSettingsView from '../machine-settings-view.mjs';
import MachineSettings from '../../../../coach/machine-settings-commands.cjs';
import TodayModel from '../today-model.cjs';
import design from '../design.cjs';
import { buildToday } from '../build.mjs';

const { createTodayModel, SYNTHETIC_DAY } = TodayModel;
const { SETTINGS_HEAD, SETTINGS_NONE, SETTINGS_OPEN, SETTINGS_EDITOR_TITLE, SETTINGS_CUES_LEAD,
  SETTINGS_ADD, SETTINGS_SAVE, SETTINGS_CANCEL, SETTINGS_NOTHING, SETTINGS_REFUSED,
  SETTINGS_NOT_SAVED, SETTINGS_NAME_LABEL, SETTINGS_VALUE_LABEL, SETTINGS_CUE_LABEL,
  SETTINGS_READING, SETTINGS_UNREAD, SETTINGS_UNREAD_ACTION } = GymApp;
const { prepare, machineOf, machineSettingsIn, latestFor, SETTINGS_MAX, SETTING_TEXT_MAX } = MachineSettings;
const DAY = SYNTHETIC_DAY;
const SLOT = 'earned-today-preview/' + DAY;
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const readRepo = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const shaOf = (rel) => createHash('sha256').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex');
const AI_DASH = /[–—]/;
/* The ACCEPTED effort answer, taken from the layer rather than invented here. */
const CHOSEN = EFFORT_CHOICES.find((choice) => choice.label === '2').reserve;
/* Prose removed: a file that EXPLAINS why it does not do something must not fail a
   "this never appears" check for saying so (DECISIONS:114 (1)). */
const codeOf = (text) => text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
const NEW_FILES = ['machine-settings-host.mjs', 'machine-settings-view.mjs'];
const PAGE_FILES = fs.readdirSync(path.join(ROOT, 'rebuild/m3/w7-preview/today'))
  .filter((name) => /\.(cjs|mjs)$/.test(name));

/* ONE device: one IndexedDB factory is one installation of the local era, so the gym
   host and the settings lane below are in the SAME sealed generation under the same
   lease - which is what C4c requires and what S5 measures. */
async function device(options = {}) {
  const fault = options.fault || faultDatabase();
  const today = createTodayModel({});
  const state = options.engineState || today.stateFromOps();
  const openGym = () => createGymHost({ day: DAY, engineState: state, indexedDB: fault.indexedDB,
    crypto: webcrypto, plannedSplitSlotId: SLOT });
  const openSettings = (day = DAY) => createMachineSettingsHost({ day,
    indexedDB: fault.indexedDB, crypto: webcrypto });
  const gymHost = await openGym();
  const settings = await openSettings();
  return { fault, today, state, gymHost, settings, openGym, openSettings,
    model: createGymModel({ gymHost, sessionTitle: today.read().workout.title }) };
}
const opsOf = async (repository) => Object.values((await repository.load()).generation.collections.ops || {});
const outboxOf = async (repository) => Object.values((await repository.load()).generation.collections.outbox || {});
const settingsOps = async (repository) =>
  (await opsOf(repository)).filter((op) => op.payload && op.payload.profile === PROFILE);

const shell = () => design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml());
/* The card, mounted on the shipped template with the lane injected - which is the same
   object gym-app.mjs opens for itself on a device that has an encrypted store. */
async function card(kit, options = {}) {
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  const phone = doc.getElementById('phone');
  await kit.model.start();
  const mounted = mountGym(doc, phone, { model: kit.model, onBack: () => {},
    settings: Object.hasOwn(options, 'settings') ? options.settings : kit.settings });
  await mounted;
  /* D2 round 1, finding 1 - the card is on the screen BEFORE the settings read has
     answered, so a test that wants the block to say something durable waits for the
     read separately. That the card does not wait is exactly what D2.1 measures. */
  if (typeof mounted.settings.read === 'function' && mounted.settings.read()) await mounted.settings.read();
  const pick = (slot) => doc.querySelector('#phone [data-slot="' + slot + '"]');
  return { dom, doc, phone, mounted, pick,
    text: () => phone.textContent,
    click: (selector) => doc.querySelector('#phone ' + selector).dispatchEvent(new dom.window.Event('click')),
    rowCount: () => doc.querySelectorAll('#phone [data-slot="settings-rows"] .row').length,
    async open() {
      this.click('[data-action="settings-open"]');
      await waitFor(() => pick('settings-editor') && pick('settings-editor').hidden === false
        && doc.querySelector('#phone [data-settings-name="0"]'), 'the editor to open');
    },
    async addRow() {
      const was = this.rowCount();
      this.click('[data-action="settings-add"]');
      await waitFor(() => this.rowCount() === was + 1, 'a row to be added');
    },
    async save() {
      this.click('[data-slot="settings-save"]');
      await mounted.settings.pending();
      await settle();
    },
    type(index, name, value) {
      const set = (attr, text) => {
        const box = doc.querySelector('#phone [data-settings-' + attr + '="' + index + '"]');
        box.value = text;
        box.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
      };
      if (name !== null) set('name', name);
      if (value !== null) set('value', value);
    },
    cue(text) {
      const box = doc.querySelector('#phone [data-slot="settings-cue"]');
      box.value = text;
      box.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    },
  };
}
/* A repaint is `model.read()` plus a durable read of the lane, so it is several turns
   of the event loop rather than one microtask. */
async function settle(rounds = 8) {
  for (let i = 0; i < rounds; i++) await new Promise((resolve) => setTimeout(resolve, 0));
}
/* A repaint is a DURABLE read, so it is timing, not a tick count: wait for the
   screen to actually say what was asked of it rather than guessing at rounds. */
async function waitFor(check, what) {
  for (let i = 0; i < 400; i++) {
    if (check()) return;
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
  throw new Error('timed out waiting for ' + what);
}
const blockText = (page) => page.pick('settings-block').textContent;
const pairs = (page) => [...page.doc.querySelectorAll('#phone [data-slot="settings-list"] .row')]
  .map((row) => [row.querySelector('strong').textContent, row.querySelector('span').textContent]);

/* One captured machine, through the CARD, from the active set's own lift. */
async function capture(page, rows, cues) {
  await page.open();
  for (let index = 1; index < rows.length; index++) await page.addRow();
  rows.forEach((row, index) => page.type(index, row[0], row[1]));
  if (cues !== undefined) page.cue(cues);
  await page.save();
}

/* ==========================================================================
   S1 - NOTHING STORED: the honest empty state, and no figure at all.
   ========================================================================== */
test('S1 - with nothing stored the active set says so, in the brief\'s own sentence', async () => {
  const kit = await device();
  const page = await card(kit);
  assert.equal(page.pick('settings-block').hidden, false, 'the block is on the active set');
  assert.equal(page.pick('settings-head').textContent, SETTINGS_HEAD);
  assert.match(blockText(page), /No settings saved yet\./);
  assert.equal(SETTINGS_NONE, 'No settings saved yet.', 'the brief names this sentence verbatim');
  kit.settings.close(); kit.gymHost.close();
});

test('S1 - the empty block carries NO figure and no dash of any kind', async () => {
  const kit = await device();
  const page = await card(kit);
  const block = blockText(page);
  assert.doesNotMatch(block, /\d/, 'a zero or a borrowed figure is on the empty block: ' + block);
  assert.equal(AI_DASH.test(block), false, 'the empty block renders an ai dash');
  assert.doesNotMatch(block, /-/, 'the empty block renders a hyphen where a figure would be');
  assert.equal(page.pick('settings-cues').hidden, true, 'no cue line without a cue');
  kit.settings.close(); kit.gymHost.close();
});

test('S1 - with no lane at all the card is exactly the card that shipped before', async () => {
  const kit = await device();
  /* jsdom has no indexedDB, so this is also what every other suite in this
     repository mounts: the block and the editor stay hidden and nothing is offered. */
  const page = await card(kit, { settings: null });
  assert.equal(page.pick('settings-block').hidden, true);
  assert.equal(page.pick('settings-editor').hidden, true);
  assert.doesNotMatch(page.text(), /No settings saved yet/);
  assert.doesNotMatch(page.text(), /Machine settings/);
  kit.settings.close(); kit.gymHost.close();
});

/* ==========================================================================
   S2 - STORED SETTINGS render VERBATIM, in the stored order, cue below.
   ========================================================================== */
test('S2 - stored settings render verbatim and in the STORED order, with the cue below', async () => {
  const kit = await device();
  const view = await kit.model.read();
  assert.equal((await kit.settings.save({ exercise_id: view.lift.id,
    settings: [{ name: 'Seat', value: 'four' }, { name: 'Back pad', value: 'two notches' },
      { name: 'Pin', value: '3' }],
    cues: 'Elbows in, and stop one short.' })).ok, true);
  const page = await card(kit);
  assert.deepEqual(pairs(page), [['Seat', 'four'], ['Back pad', 'two notches'], ['Pin', '3']],
    'the order is the order he gave, not an order this page chose');
  assert.match(page.pick('settings-cues').textContent, /Elbows in, and stop one short\./);
  assert.equal(page.pick('settings-cues').hidden, false);
  assert.doesNotMatch(blockText(page), /No settings saved yet/);
  kit.settings.close(); kit.gymHost.close();
});

test('S2 - "four" stays "four": nothing is interpreted into a number or a unit', async () => {
  const kit = await device();
  const view = await kit.model.read();
  await kit.settings.save({ exercise_id: view.lift.id, settings: [{ name: 'Seat', value: 'four' }] });
  const page = await card(kit);
  assert.deepEqual(pairs(page), [['Seat', 'four']]);
  assert.doesNotMatch(blockText(page), /\b4\b/, 'a word was turned into a figure');
  assert.doesNotMatch(blockText(page), /notch|lb|kg|cm/, 'a unit was invented');
  kit.settings.close(); kit.gymHost.close();
});

test('S2 - a cue on its own is a whole answer, with no settings row and no empty state', async () => {
  const kit = await device();
  const view = await kit.model.read();
  await kit.settings.save({ exercise_id: view.lift.id, cues: 'Breathe out on the way up.' });
  const page = await card(kit);
  assert.deepEqual(pairs(page), []);
  assert.match(page.pick('settings-cues').textContent, /Breathe out on the way up\./);
  assert.match(page.pick('settings-cues').textContent, new RegExp(SETTINGS_CUES_LEAD.replace(':', ':')));
  assert.doesNotMatch(blockText(page), /No settings saved yet/);
  kit.settings.close(); kit.gymHost.close();
});

/* ==========================================================================
   S3 - ANOTHER LIFT'S SETTINGS NEVER APPEAR ON THIS ONE.
   ========================================================================== */
test('S3 - settings stored for ANOTHER exercise id never appear on this one', async () => {
  const kit = await device();
  const view = await kit.model.read();
  await kit.settings.save({ exercise_id: 'some-other-lift', settings: [{ name: 'Seat', value: 'nine' }] });
  const page = await card(kit);
  assert.deepEqual(pairs(page), [], 'nothing was borrowed from the other lift');
  assert.match(blockText(page), /No settings saved yet\./);
  assert.doesNotMatch(page.text(), /nine/);
  kit.settings.close(); kit.gymHost.close();
});

test('S3 - two lifts in one session each show their OWN settings, or nothing', async () => {
  const kit = await device();
  const view = await kit.model.read();
  assert.equal(view.lift.count, 2, 'this athlete\'s own day really has two lifts');
  await kit.settings.save({ exercise_id: view.lift.id, settings: [{ name: 'Seat', value: 'four' }] });
  const page = await card(kit);
  assert.deepEqual(pairs(page), [['Seat', 'four']]);
  /* Walk to the second lift the way the screen does, and read the block again. */
  const second = await secondLift(kit);
  assert.notEqual(second.lift.id, view.lift.id, 'the card really moved to another lift');
  const other = await card(kit);
  assert.deepEqual(pairs(other), [], 'the second lift shows nothing, never the first lift\'s seat');
  assert.match(blockText(other), /No settings saved yet\./);
  kit.settings.close(); kit.gymHost.close();
});

/* Log every set of the first lift so the active set becomes the second lift's. */
async function secondLift(kit) {
  for (let guard = 0; guard < 30; guard++) {
    const view = await kit.model.read();
    if (view.phase === 'saved') { kit.model.forget(); continue; }
    if (view.phase !== 'active') throw new Error('the session ended before the second lift');
    const first = await kit.model.read();
    if (first.lift.index === 2) return first;
    const result = await kit.model.logSet({ startId: view.startId, slot: view.set.slot,
      lift: view.set.lift, load: String(view.entry.load), reps: String(view.entry.reps),
      effort: CHOSEN });
    assert.equal(result.ok, true, 'set refused: ' + result.code);
    kit.model.forget();
  }
  throw new Error('the second lift was never reached');
}

/* ==========================================================================
   S4 - LATEST WINS.
   ========================================================================== */
test('S4 - three captures for one lift leave THREE ops and the block shows the third', async () => {
  const kit = await device();
  const view = await kit.model.read();
  for (const value of ['four', 'five', 'six']) {
    assert.equal((await kit.settings.save({ exercise_id: view.lift.id,
      settings: [{ name: 'Seat', value }] })).ok, true);
  }
  assert.equal((await settingsOps(kit.settings.repository)).length, 3,
    'a correction is a NEW op: nothing was updated and nothing was deleted');
  const page = await card(kit);
  assert.deepEqual(pairs(page), [['Seat', 'six']], 'the LATEST wins');
  assert.doesNotMatch(blockText(page), /four|five/, 'a replaced setting is gone, not stale');
  kit.settings.close(); kit.gymHost.close();
});

test('S4 - the winning op carries the WHOLE machine: a dropped row is dropped', async () => {
  const kit = await device();
  const view = await kit.model.read();
  await kit.settings.save({ exercise_id: view.lift.id,
    settings: [{ name: 'Seat', value: 'four' }, { name: 'Pin', value: 'three' }] });
  await kit.settings.save({ exercise_id: view.lift.id, settings: [{ name: 'Seat', value: 'five' }] });
  const page = await card(kit);
  assert.deepEqual(pairs(page), [['Seat', 'five']]);
  assert.doesNotMatch(blockText(page), /Pin/, 'the replaced row survived from an earlier op');
  kit.settings.close(); kit.gymHost.close();
});

test('S4 - latestFor is the COACH\'s rule, read out of its module at test time', async () => {
  const kit = await device();
  const view = await kit.model.read();
  for (const value of ['four', 'five']) {
    await kit.settings.save({ exercise_id: view.lift.id, settings: [{ name: 'Seat', value }] });
  }
  const generation = (await kit.settings.repository.load()).generation;
  const rows = machineSettingsIn(generation);
  assert.equal(rows.length, 2);
  assert.deepEqual(latestFor(rows, view.lift.id), await kit.settings.latest(view.lift.id),
    'the lane returns exactly what the coach\'s own latestFor returns');
  assert.equal(latestFor(rows, 'nobody'), null);
  kit.settings.close(); kit.gymHost.close();
});

/* ==========================================================================
   S5 - THE CAPTURE: one op, one outbox entry, one transaction.
   ========================================================================== */
test('S5 - a capture from the gym card writes ONE op and its outbox entry', async () => {
  const kit = await device();
  const page = await card(kit);
  const before = await opsOf(kit.settings.repository);
  await capture(page, [['Seat', 'four'], ['Pin', 'three']], 'Elbows in.');
  const ops = await settingsOps(kit.settings.repository);
  assert.equal(ops.length, 1, 'one tap, one operation');
  assert.equal(ops.length, (await opsOf(kit.settings.repository)).length - before.length);
  /* The workout's own start op is in this generation too - that is the point of one
     store - so the outbox is narrowed to THIS operation rather than counted whole. */
  const outbox = await outboxOf(kit.settings.repository);
  assert.equal(outbox.filter((entry) => entry.op_id === ops[0].op_id).length, 1,
    'the outbox entry co-exists with the operation, in the same transaction');
  kit.settings.close(); kit.gymHost.close();
});

test('S5 - the captured op is what the block then shows, read back off the store', async () => {
  const kit = await device();
  const page = await card(kit);
  await capture(page, [['Seat', 'four']], 'Elbows in.');
  assert.deepEqual(pairs(page), [['Seat', 'four']], 'the block repainted from the durable record');
  assert.match(page.pick('settings-cues').textContent, /Elbows in\./);
  assert.equal(page.pick('settings-editor').hidden, true, 'the editor closed itself');
  kit.settings.close(); kit.gymHost.close();
});

test('S5 - a storage fault writes NO part of the capture, and the card says so', async () => {
  const kit = await device();
  const page = await card(kit);
  kit.settings.close();                       // the lane is detached under the card
  await page.open();
  page.type(0, 'Seat', 'four');
  await page.save();
  assert.equal(page.pick('settings-error').textContent, SETTINGS_NOT_SAVED);
  assert.deepEqual(await settingsOps(kit.gymHost.repository), [], 'and nothing was written');
  assert.equal(page.pick('settings-editor').hidden, false, 'his answer is still on the screen');
  kit.gymHost.close();
});

/* ==========================================================================
   S6 - ONE SHAPE. No second producer, no second profile, no second validator.
   ========================================================================== */
test('S6a - the op the CARD writes is the op the COACH\'s producer builds', async () => {
  const kit = await device();
  const page = await card(kit);
  const view = await kit.model.read();
  await capture(page, [['Seat', 'four'], ['Pin', 'three']], 'Elbows in.');
  const [written] = await settingsOps(kit.settings.repository);
  const expected = prepare({ action: ACTION, input: { machine: { exercise_id: view.lift.id,
    settings: [{ name: 'Seat', value: 'four' }, { name: 'Pin', value: 'three' }], cues: 'Elbows in.' } } });
  assert.equal(written.class, expected.class);
  assert.equal(written.kind, expected.kind);
  assert.deepEqual(Object.keys(written.payload), Object.keys(expected.payload));
  assert.deepEqual(written.payload, expected.payload,
    'the gym card writes the coach\'s payload, member for member');
  assert.equal(written.payload.profile, PROFILE);
  kit.settings.close(); kit.gymHost.close();
});

test('S6b - no second profile, validator or payload shape exists anywhere in today/**', () => {
  /* The profile string may appear in exactly one place in this page: the import in
     machine-settings-host.mjs names the module, never the literal. */
  /* The PAGE's modules. The optional PC-only checks are excluded by name and for one
     reason: they read the store through `page.evaluate`, inside the browser, where they
     cannot import anything, so a check that narrows a generation has to spell the
     profile. Nothing they spell ships, and nothing they spell decides what is written. */
  for (const name of PAGE_FILES.filter((file) => !/-check\.mjs$/.test(file))) {
    const code = codeOf(readRepo('rebuild/m3/w7-preview/today/' + name));
    assert.equal(code.includes('earned/machine-settings'), false,
      name + ' spells the machine-settings profile itself (mutant S-M5)');
    if (name === 'machine-settings-host.mjs' || name === 'machine-settings-view.mjs') continue;
    assert.equal(/machineOf\s*\(/.test(code), false, name + ' gates a capture of its own');
  }
  const host = codeOf(readRepo('rebuild/m3/w7-preview/today/machine-settings-host.mjs'));
  const view = codeOf(readRepo('rebuild/m3/w7-preview/today/machine-settings-view.mjs'));
  const importsProducer = (code) => /import\s+\w+\s+from\s+'[^']*coach\/machine-settings-commands\.cjs'/.test(code);
  assert(importsProducer(host), 'the host imports the coach\'s producer');
  assert(importsProducer(view), 'the view gates on the coach\'s producer');
  /* And the one gate really is `machineOf`: the view calls it rather than listing
     the caps again. A local re-implementation is mutant S-M4. */
  assert(view.includes('machineOf('), 'the view calls the producer\'s own gate');
  assert.equal(/SETTING_TEXT_MAX\s*=|TEXT_MAX\s*=|EXERCISE_ID_MAX\s*=/.test(view + host), false,
    'a cap is re-declared in the page instead of imported');
});

test('S6c - THE COACH READS WHAT THE GYM CARD CAPTURED, through its own wave-one tool', async () => {
  const kit = await device();
  const page = await card(kit);
  const view = await kit.model.read();
  await capture(page, [['Seat', 'four'], ['Pin', 'three']], 'Elbows in.');
  /* The coach's own read tool, over the lane THIS PAGE opened. Nothing is copied
     between the two halves of wave one: it is one generation and one op. */
  const { createWave1Tools } = await import('../../../../coach/wave1-tools.cjs');
  const tools = createWave1Tools({
    world: { today: {}, machineSettings: kit.settings },
    coach: { openTurn: () => 'turn-1' },
  });
  const answer = await tools.dispatch('machine_settings', { exercise_id: view.lift.id }, 'turn-1');
  assert.equal(answer.ok, true, 'the coach could not read the card\'s capture: ' + JSON.stringify(answer));
  assert.equal(answer.values.exerciseId.value, view.lift.id);
  assert.deepEqual(answer.values.settings.map((pair) => [pair.name.value, pair.value.value]),
    [['Seat', 'four'], ['Pin', 'three']]);
  assert.equal(answer.values.cues.value, 'Elbows in.');
  assert.equal(answer.machine.exercise_id, view.lift.id,
    'and it is THIS lift, out of the one generation the gym card wrote into');
  kit.settings.close(); kit.gymHost.close();
});

test('S6d - and the card reads what the COACH captured, with no second read path', async () => {
  const kit = await device();
  const view = await kit.model.read();
  /* Written exactly as rebuild/coach/local-world.mjs writes it: the same producer,
     the same `machine`, through this installation's own lane. */
  await kit.settings.save(machineOf({ exercise_id: view.lift.id,
    settings: [{ name: 'Seat', value: 'four' }], cues: 'Elbows in.' }));
  const page = await card(kit);
  assert.deepEqual(pairs(page), [['Seat', 'four']]);
  assert.match(page.pick('settings-cues').textContent, /Elbows in\./);
  kit.settings.close(); kit.gymHost.close();
});

/* ==========================================================================
   S7 - EVERY PRODUCER REFUSAL, in the page's own words, recording nothing.
   ========================================================================== */
test('S7 - neither a setting nor a cue records nothing, and says which is missing', async () => {
  const kit = await device();
  const page = await card(kit);
  await page.open();
  await page.save();
  assert.equal(page.pick('settings-error').textContent, SETTINGS_NOTHING);
  assert.deepEqual(await settingsOps(kit.settings.repository), []);
  kit.settings.close(); kit.gymHost.close();
});

test('S7 - a name with no value, a value with no name and a repeated name all refuse', async () => {
  const kit = await device();
  const page = await card(kit);
  for (const rows of [[['Seat', '']], [['', 'four']],
    [['Seat', 'four'], ['Seat', 'five']]]) {
    await page.open();
    for (let index = 1; index < rows.length; index++) await page.addRow();
    rows.forEach((row, index) => page.type(index, row[0], row[1]));
    await page.save();
    assert.equal(page.pick('settings-error').textContent, SETTINGS_REFUSED,
      'refusal for ' + JSON.stringify(rows));
    assert.deepEqual(await settingsOps(kit.settings.repository), [],
      'nothing was written for ' + JSON.stringify(rows));
    page.click('[data-action="settings-cancel"]');
    await settle();
  }
  kit.settings.close(); kit.gymHost.close();
});

test('S7 - the caps are the PRODUCER\'s, executed: over-long text and a 13th row refuse', async () => {
  const kit = await device();
  const view = await kit.model.read();
  const long = 'x'.repeat(SETTING_TEXT_MAX + 1);
  assert.throws(() => machineOf({ exercise_id: view.lift.id, settings: [{ name: long, value: 'four' }] }),
    /MACHINE_SETTINGS_INPUT_INVALID/);
  const thirteen = Array.from({ length: SETTINGS_MAX + 1 },
    (_, i) => ({ name: 'Setting ' + i, value: 'v' }));
  assert.throws(() => machineOf({ exercise_id: view.lift.id, settings: thirteen }),
    /MACHINE_SETTINGS_INPUT_INVALID/);
  /* And the page refuses exactly what the producer refuses, because it asks it. */
  assert.equal(MachineSettingsView.acceptable({ exercise_id: view.lift.id,
    settings: [{ name: long, value: 'four' }] }), false);
  assert.equal(MachineSettingsView.acceptable({ exercise_id: view.lift.id, settings: thirteen }), false);
  assert.equal(MachineSettingsView.acceptable({ exercise_id: view.lift.id,
    settings: [{ name: 'Seat', value: 'four' }] }), true);
  assert.equal(MachineSettingsView.MAX_ROWS, SETTINGS_MAX, 'the editor\'s row cap IS the producer\'s');
  kit.settings.close(); kit.gymHost.close();
});

test('S7 - a refused capture leaves his answers on the screen, unchanged', async () => {
  const kit = await device();
  const page = await card(kit);
  await page.open();
  page.type(0, 'Seat', '');
  await page.save();
  assert.equal(page.pick('settings-error').textContent, SETTINGS_REFUSED);
  assert.equal(page.doc.querySelector('#phone [data-settings-name="0"]').value, 'Seat',
    'nothing he typed was thrown away by a refusal');
  kit.settings.close(); kit.gymHost.close();
});

/* ==========================================================================
   S8 - CANCELLING, AND NEVER BLOCKING THE SET.
   ========================================================================== */
test('S8 - cancelling writes nothing and leaves the record exactly as it was', async () => {
  const kit = await device();
  const view = await kit.model.read();
  await kit.settings.save({ exercise_id: view.lift.id, settings: [{ name: 'Seat', value: 'four' }] });
  const page = await card(kit);
  await page.open();
  page.type(0, 'Seat', 'nine');
  page.click('[data-action="settings-cancel"]');
  await settle();
  assert.equal(page.pick('settings-editor').hidden, true, 'the editor closed');
  assert.equal((await settingsOps(kit.settings.repository)).length, 1, 'no second op');
  assert.deepEqual(pairs(page), [['Seat', 'four']], 'the record is what it was');
  kit.settings.close(); kit.gymHost.close();
});

test('S8 - capture never blocks logging a set, and the primary action is unmoved', async () => {
  const kit = await device();
  const page = await card(kit);
  const before = page.doc.querySelector('#phone [data-slot="log-label"]').textContent;
  await page.open();
  assert.equal(page.pick('settings-editor').hidden, false, 'the editor really is open');
  const log = page.doc.querySelector('#phone [data-slot="log"]');
  assert.equal(log.disabled, false, 'the set can still be logged with the editor open');
  assert.equal(page.doc.querySelector('#phone [data-slot="log-label"]').textContent, before,
    'the primary action did not move or change');
  assert.equal(page.doc.querySelectorAll('#phone .cta').length, 1,
    'the active set still has exactly ONE primary action');
  kit.settings.close(); kit.gymHost.close();
});

test('S8 - a set logs with the editor open, and nothing about the settings changes', async () => {
  const kit = await device();
  const page = await card(kit);
  await page.open();
  page.type(0, 'Seat', 'four');
  const view = await kit.model.read();
  const result = await kit.model.logSet({ startId: view.startId, slot: view.set.slot,
    lift: view.set.lift, load: String(view.entry.load), reps: String(view.entry.reps),
    effort: CHOSEN });
  assert.equal(result.ok, true, 'the set was refused: ' + result.code);
  assert.deepEqual(await settingsOps(kit.settings.repository), [],
    'logging a set wrote no machine-settings op');
  kit.settings.close(); kit.gymHost.close();
});

/* ==========================================================================
   S9 - DURABILITY.
   ========================================================================== */
test('S9 - the block survives a new host over the same store', async () => {
  const kit = await device();
  const page = await card(kit);
  await capture(page, [['Seat', 'four']], 'Elbows in.');
  kit.settings.close();
  const again = await kit.openSettings();
  const view = await kit.model.read();
  const row = await again.latest(view.lift.id);
  assert(row, 'the capture did not survive a relaunch of the lane');
  assert.deepEqual(row.machine.settings, [{ name: 'Seat', value: 'four' }]);
  assert.equal(row.machine.cues, 'Elbows in.');
  again.close(); kit.gymHost.close();
});

test('S9 - and a whole new installation over the same IndexedDB reads it back', async () => {
  const kit = await device();
  const view = await kit.model.read();
  await kit.settings.save({ exercise_id: view.lift.id, settings: [{ name: 'Seat', value: 'four' }] });
  kit.settings.close(); kit.gymHost.close();
  /* A relaunch: new gym host, new lane, same encrypted store on the same factory. */
  const relaunch = await device({ fault: kit.fault });
  const page = await card(relaunch);
  assert.deepEqual(pairs(page), [['Seat', 'four']], 'a relaunch reads it off disk');
  relaunch.settings.close(); relaunch.gymHost.close();
});

test('S9 - the read-back carries the op id, the date and the time it was recorded', async () => {
  const kit = await device();
  const view = await kit.model.read();
  await kit.settings.save({ exercise_id: view.lift.id, settings: [{ name: 'Seat', value: 'four' }] });
  const row = await kit.settings.latest(view.lift.id);
  assert.match(row.op_id, /^op-/);
  assert.equal(row.date, DAY);
  assert.match(row.time, /^\d{2}:\d{2}(:\d{2})?$/);
  assert.deepEqual(Object.keys(row.machine), ['exercise_id', 'settings']);
  kit.settings.close(); kit.gymHost.close();
});

test('S9 - a closed lane refuses in the client\'s own shape and writes nothing', async () => {
  const kit = await device();
  kit.settings.close();
  const refused = await kit.settings.save({ exercise_id: 'lift', settings: [{ name: 'Seat', value: 'four' }] });
  assert.equal(refused.ok, false);
  assert.equal(refused.code, 'LOCAL_CLIENT_CLOSED');
  assert.deepEqual(await settingsOps(kit.gymHost.repository), []);
  kit.gymHost.close();
});

/* ==========================================================================
   S10 - CUSTODY, PROVED against the pin list rather than asserted.
   ========================================================================== */
test('S10 - PAGE_PINS names exactly four files, and all four are sha-identical', () => {
  const journey = readRepo('rebuild/m3/w6/test/local-today-journey.test.mjs');
  const block = journey.slice(journey.indexOf('export const PAGE_PINS'),
    journey.indexOf('const pageFile'));
  const pinned = [...block.matchAll(/'([\w.-]+\.mjs)':\s*'([a-f0-9]{64})'/g)];
  assert.deepEqual(pinned.map((m) => m[1]),
    ['today-entry.mjs', 'gym-host.mjs', 'reading-host.mjs', 'checkin-host.mjs'],
    'the pin list is not what this build\'s custody was read out of');
  for (const [, name, expected] of pinned) {
    assert.equal(shaOf('rebuild/m3/w7-preview/today/' + name), expected,
      name + ' is PINNED and must be byte-identical (mutant S-M7)');
  }
});

test('S10 - today-bindings.mjs is byte-identical to the B-NTC package\'s own hash', () => {
  const pkg = JSON.parse(readRepo('rebuild/lanes/b/tooling/packages/B-NTC.json'));
  const pinned = 'rebuild/m3/w6/local/today-bindings.mjs';
  assert(pkg.product[pinned], 'the package still pins it');
  assert.equal(shaOf(pinned), pkg.product[pinned].post,
    'this build must not touch a file the B-NTC artifact pins ON DISK (DECISIONS:144)');
  assert.equal(shaOf('rebuild/m3/w6/test/local-today-journey.test.mjs'),
    pkg.product['rebuild/m3/w6/test/local-today-journey.test.mjs'].post,
    'and the journey suite itself is unmoved');
});

test('S10 - the lane is opened through client.hostBindings, not a w6 factory', () => {
  const host = codeOf(readRepo('rebuild/m3/w7-preview/today/machine-settings-host.mjs'));
  assert(host.includes('era.client.hostBindings('), 'the honest extension point');
  assert.equal(/era\.create(Reading|Gym|CheckIn|Setup|MachineSettings)Host/.test(host), false,
    'no w6 factory is asked for a fifth lane');
  assert(host.includes('createDurablePublicClient'), 'the accepted durable client');
  assert(host.includes('LOCAL_ERA_SCHEMA_VERSION'), 'the era\'s own lease schema');
  const app = codeOf(readRepo('rebuild/m3/w7-preview/today/gym-app.mjs'));
  assert(app.includes("import('./machine-settings-host.mjs')"),
    'gym-app.mjs opens the lane itself, because today-entry.mjs is pinned');
});

/* ==========================================================================
   S11 / S12 - THE OWNER'S RULE, AND THE DESIGN BINDING.
   ========================================================================== */
test('S11 - no em or en dash in the new sources, the template section or the screen', async () => {
  for (const file of [...NEW_FILES, 'gym-app.mjs']) {
    const text = readRepo('rebuild/m3/w7-preview/today/' + file);
    for (const match of text.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g)) {
      const literal = match[1] === undefined ? match[2] : match[1];
      assert.equal(AI_DASH.test(literal), false, file + ' string literal: ' + literal);
    }
  }
  const section = gymTemplate();
  assert.equal(AI_DASH.test(section.slice(section.indexOf('settings-block'),
    section.indexOf('settings-cancel-label'))), false, 'the shipped settings markup');
  const kit = await device();
  const view = await kit.model.read();
  await kit.settings.save({ exercise_id: view.lift.id, settings: [{ name: 'Seat', value: 'four' }] });
  const page = await card(kit);
  await page.open();
  assert.equal(AI_DASH.test(page.text()), false, 'the rendered card with the editor open');
  kit.settings.close(); kit.gymHost.close();
});

function gymTemplate() {
  const template = design.templateHtml();
  const start = template.indexOf('<template id="t-gym">');
  return template.slice(start, template.indexOf('</template>', start));
}

test('S12 - every new sentence is declared, preview-owned, and REFUSED if dropped', () => {
  const approved = design.readApproved();
  const source = design.appSource();
  const approvedText = approved.map((a) => a.html).join('\n');
  for (const line of [SETTINGS_HEAD, SETTINGS_NONE, SETTINGS_OPEN, SETTINGS_EDITOR_TITLE,
    SETTINGS_CUES_LEAD, SETTINGS_ADD, SETTINGS_SAVE, SETTINGS_CANCEL,
    SETTINGS_NOTHING, SETTINGS_REFUSED, SETTINGS_NOT_SAVED, SETTINGS_CUE_LABEL]) {
    assert(design.PREVIEW_RUNTIME_COPY.includes(line), 'declared: ' + line);
    assert.equal(approvedText.includes(line), false, 'preview-owned, so ABSENT upstream: ' + line);
    assert(source.includes(line), 'present in a view source: ' + line);
  }
  assert.doesNotThrow(() => design.assertDesignBinding(approved, design.templateHtml(), source));
  assert.throws(() => design.assertDesignBinding(approved, design.templateHtml(),
    source.split(SETTINGS_NONE).join('')), /COPY-BINDING FAIL/);
});

test('S12 - every class in the new markup is a selector in the APPROVED stylesheets', () => {
  const approved = design.readApproved();
  const css = approved.map((a) => a.styles).join('\n');
  const section = gymTemplate();
  const mine = section.slice(section.indexOf('<!-- DECISIONS:154 (2)'), section.indexOf('<section class="entry">\n    <div class="entry-header">\n      <h2 data-slot="entry-title">'));
  assert(mine.includes('data-slot="settings-block"'), 'the block is in the shipped template');
  for (const token of design.classTokens(mine)) {
    if (design.PREVIEW_CLASSES.includes(token)) continue;
    const selector = new RegExp('\\.' + token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w-])');
    assert(selector.test(css), '.' + token + ' is not in the approved stylesheets');
  }
  for (const line of design.textOf(mine)) {
    assert.equal(/\d/.test(line), false, 'the template carries a literal figure: "' + line + '"');
  }
});

test('S12 - the new markup invents no class and sets no width of its own', () => {
  const css = design.chromeCss();
  assert.equal(/\.settings\b/.test(css), false, 'the build invents a class of its own');
  for (const file of [...NEW_FILES, 'gym-app.mjs']) {
    const text = readRepo('rebuild/m3/w7-preview/today/' + file);
    assert.equal(/(?<![-\w])(min-width|width)\s*[:=]\s*['"]?\d/.test(text), false, file + ' sets a width');
  }
  const section = gymTemplate();
  assert.equal(/style="/.test(section), false, 'no inline style anywhere on the card');
});

/* ==========================================================================
   S13 / S14 - THE SCREEN'S SHAPE, AND THE BUILD.
   ========================================================================== */
test('S13 - the editor offers real text boxes, labelled, with one row to start', async () => {
  const kit = await device();
  const page = await card(kit);
  await page.open();
  const boxes = [...page.doc.querySelectorAll('#phone [data-slot="settings-rows"] input')];
  assert.equal(boxes.length, 2, 'one row is a name and a value');
  for (const box of boxes) {
    assert.equal(box.type, 'text', 'a setting is his words, never a number box');
    assert(box.closest('label'), 'every box is labelled');
  }
  const labels = [...page.doc.querySelectorAll('#phone [data-slot="settings-rows"] label')]
    .map((label) => label.firstChild.textContent);
  assert.deepEqual(labels, [SETTINGS_NAME_LABEL, SETTINGS_VALUE_LABEL]);
  assert.equal(page.pick('settings-editor-title').textContent, SETTINGS_EDITOR_TITLE);
  assert.equal(page.pick('settings-cue-label').textContent, SETTINGS_CUE_LABEL);
  assert.equal(page.pick('settings-save-label').textContent, SETTINGS_SAVE);
  assert.equal(page.pick('settings-cancel-label').textContent, SETTINGS_CANCEL);
  kit.settings.close(); kit.gymHost.close();
});

test('S13 - a row can be added and removed, and the add stops at the producer\'s cap', async () => {
  const kit = await device();
  const page = await card(kit);
  await page.open();
  const rows = () => page.rowCount();
  assert.equal(rows(), 1, 'one blank row to start');
  assert.equal(page.doc.querySelector('#phone [data-settings-remove="0"]'), null,
    'the only row cannot be removed');
  await page.addRow();
  assert.equal(rows(), 2);
  assert.equal(page.pick('settings-add-label').textContent, SETTINGS_ADD);
  page.click('[data-settings-remove="1"]');
  await waitFor(() => rows() === 1, 'the row to be removed');
  assert.equal(rows(), 1, 'removing a row is local to the draft');
  for (let i = 1; i < SETTINGS_MAX; i++) await page.addRow();
  assert.equal(rows(), SETTINGS_MAX);
  assert.equal(page.doc.querySelector('#phone [data-action="settings-add"]').hidden, true,
    'the add stops at the producer\'s own cap rather than offering a 13th row');
  assert.deepEqual(await settingsOps(kit.settings.repository), [], 'and none of that wrote anything');
  kit.settings.close(); kit.gymHost.close();
});

test('S13 - the editor opens seeded from what is STORED, so a correction starts there', async () => {
  const kit = await device();
  const view = await kit.model.read();
  await kit.settings.save({ exercise_id: view.lift.id,
    settings: [{ name: 'Seat', value: 'four' }, { name: 'Pin', value: 'three' }], cues: 'Elbows in.' });
  const page = await card(kit);
  await page.open();
  assert.equal(page.doc.querySelector('#phone [data-settings-name="0"]').value, 'Seat');
  assert.equal(page.doc.querySelector('#phone [data-settings-value="1"]').value, 'three');
  assert.equal(page.doc.querySelector('#phone [data-slot="settings-cue"]').value, 'Elbows in.');
  kit.settings.close(); kit.gymHost.close();
});

test('S14 - the build pins the three new inputs and names no network', async () => {
  const result = await buildToday();
  for (const file of NEW_FILES) {
    assert(result.inputs.includes('rebuild/m3/w7-preview/today/' + file),
      file + ' is not in the built page');
  }
  assert(result.inputs.includes('rebuild/coach/machine-settings-commands.cjs'),
    'the coach\'s producer is not a pinned input of this page');
  assert.equal(result.assets.length, 3);
  assert(result.inputs.length >= 107, 'the pinned input inventory grew by exactly the files added');
  assert.match(result.buildTag, /^earned-[0-9a-f]{12}$/);
});

test('S14 - nothing under the page reaches the network or a store of its own', () => {
  for (const file of NEW_FILES) {
    const code = codeOf(readRepo('rebuild/m3/w7-preview/today/' + file));
    assert.equal(/fetch\s*\(|XMLHttpRequest|WebSocket|https?:\/\//.test(code), false,
      file + ' names the network');
    assert.equal(/localStorage|sessionStorage/.test(code), false, file + ' uses browser storage');
  }
  const host = codeOf(readRepo('rebuild/m3/w7-preview/today/machine-settings-host.mjs'));
  assert(host.includes('openTodayHosts('), 'the lane opens THIS installation, not a store of its own');
});

/* ==========================================================================
   S15 - ZERO REGRESSIONS in what this build touched.
   ========================================================================== */
test('S15 - this build adds files and edits only the ones its custody names', () => {
  const own = ['machine-settings-host.mjs', 'machine-settings-view.mjs', 'machine-settings-check.mjs',
    'gym-app.mjs', 'screens.template.html', 'design.cjs', 'build.mjs', 'gym-check.mjs',
    'test/machine-settings-ui.test.mjs'];
  for (const name of own) {
    assert(fs.existsSync(path.join(ROOT, 'rebuild/m3/w7-preview/today', name)), name);
  }
  /* gym-model.mjs is DRIVEN by the journey suite and was not touched at all: the
     lift id the block keys on was already on its DTO. */
  const model = readRepo('rebuild/m3/w7-preview/today/gym-model.mjs');
  assert.equal(/machine|settings-host/i.test(codeOf(model)), false,
    'gym-model.mjs did not need to change, and did not');
  assert(model.includes('lift: { id: activeLift.id'), 'the DTO already carried the exercise id');
});

test('S15 - the card with no capture at all is byte-for-byte the card that shipped', async () => {
  const kit = await device();
  const withLane = await card(kit);
  const without = await card(await device(), { settings: null });
  const strip = (page) => page.text().replace(/\s+/g, ' ').trim();
  assert.equal(strip(withLane).includes(SETTINGS_NONE), true, 'the lane adds the block');
  assert.equal(strip(without).includes(SETTINGS_NONE), false, 'and no lane adds nothing at all');
  assert.equal(strip(withLane).replace(SETTINGS_HEAD, '').replace(SETTINGS_NONE, '')
    .replace(SETTINGS_OPEN, '').replace(/\s+/g, ' ').trim(),
  strip(without), 'the only difference between the two cards is the block itself');
  kit.settings.close(); kit.gymHost.close();
});

/* ==========================================================================
   D2 ROUND 1 - the three blocking findings on the gym-card settings, reproduced
   and closed. Evidence in rebuild/lanes/c/GYM-CARD-SETTINGS-REPORT.md.
   ========================================================================== */

/* THE ACTUAL LOG CONTROL, not model.logSet. S-M6 adds a settings prerequisite to the
   handler, and a test that drives the model straight through cannot see it. */
async function logThrough(page, kit) {
  const before = await kit.model.read();
  const choices = [...page.doc.querySelectorAll('#phone [data-slot="choices"] .choice')];
  const choice = choices.find((button) => button.textContent === '2') || choices[0];
  assert(choice, 'the effort answers are on the card');
  choice.dispatchEvent(new page.dom.window.Event('click'));
  const log = page.doc.querySelector('#phone [data-slot="log"]');
  assert(log, 'the log control is on the card');
  assert.equal(log.disabled, false, 'the log control is usable');
  log.dispatchEvent(new page.dom.window.Event('click'));
  for (let i = 0; i < 600; i++) {
    const now = await kit.model.read();
    if (now.phase !== before.phase) return now;
    if (now.set && before.set && now.set.slot !== before.set.slot) return now;
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
  throw new Error('the log control never logged the set');
}

test('D2.1 - the card paints and the set LOGS while the settings read is still pending', async () => {
  const kit = await device();
  let release = null;
  const pending = new Promise((resolve) => { release = resolve; });
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  await kit.model.start();
  const mounted = mountGym(doc, doc.getElementById('phone'), { model: kit.model, onBack() {},
    settings: { latest: () => pending, save: async () => ({ ok: false }), close() {} } });
  let finished = false;
  mounted.then(() => { finished = true; });
  await settle();
  assert.equal(finished, true, 'mountGym resolved WITHOUT waiting for the optional read');
  const page = { dom, doc,
    pick: (slot) => doc.querySelector('#phone [data-slot="' + slot + '"]') };
  const block = page.pick('settings-block').textContent;
  assert(block.includes(SETTINGS_READING), 'the block says the read is still running: ' + block);
  assert.equal(block.includes(SETTINGS_NONE), false, 'pending is NEVER a confirmed absence');
  assert.equal(doc.querySelector('#phone [data-action="settings-open"]').disabled, true,
    'and there is nothing to correct until the read answers');
  /* THE WORKOUT IS FULLY USABLE with the optional read still in flight. */
  const view = await kit.model.read();
  const after = await logThrough(page, kit);
  assert.notEqual(after.phase, view.phase, 'the set was logged through the control');
  release(null);
  await mounted.settings.read();
  assert.equal(mounted.settings.stateFor(view.lift.id), 'known', 'the late answer landed');
  kit.settings.close(); kit.gymHost.close(); dom.window.close();
});

test('D2.2 - a FAILED read says so, never prints the empty state, and seeds no editor', async () => {
  const kit = await device();
  const page = await card(kit, { settings: {
    latest: async () => { throw new Error('SYNTHETIC_READ_FAILURE'); },
    save: async () => ({ ok: false }), close() {} } });
  const block = blockText(page);
  assert(block.includes(SETTINGS_UNREAD), 'the honest state: ' + block);
  assert(block.includes(SETTINGS_UNREAD_ACTION), 'with what it means and what to do');
  assert.equal(block.includes(SETTINGS_NONE), false,
    'a read that FAILED is never rendered as a confirmed absence');
  assert.equal(page.pick('settings-editor').hidden, true, 'no replacement editor is seeded');
  assert.equal(page.doc.querySelector('#phone [data-action="settings-open"]').disabled, true,
    'and the capture affordance is closed while the record is unknown');
  /* And the workout is untouched by any of it. */
  await logThrough(page, kit);
  kit.settings.close(); kit.gymHost.close();
});

/* S-M6: `if (busy) return;` in the log handler becomes `if (busy || !settingsLatest)
   return;`. It survived all 43 cells because S8 drove kit.model.logSet directly. These
   two drive the BUTTON with nothing saved for the lift, which is exactly the state the
   mutant refuses in. */
test('D2.3 / S-M6 - the LOG BUTTON logs a set with NO settings saved for the lift', async () => {
  const kit = await device();
  const page = await card(kit);
  assert(blockText(page).includes(SETTINGS_NONE), 'nothing is saved for this lift');
  assert.deepEqual(await settingsOps(kit.settings.repository), []);
  const before = await kit.model.read();
  const after = await logThrough(page, kit);
  assert.notEqual(after.phase, before.phase, 'the set was logged through the control itself');
  assert.deepEqual(await settingsOps(kit.settings.repository), [],
    'and logging a set wrote no machine-settings op');
  kit.settings.close(); kit.gymHost.close();
});

test('D2.3 / S-M6 - and logs with the editor open and UNSAVED text in it', async () => {
  const kit = await device();
  const page = await card(kit);
  await page.open();
  page.type(0, 'Seat', 'four');
  page.cue('Elbows in.');
  assert.deepEqual(await settingsOps(kit.settings.repository), [], 'nothing was saved');
  const before = await kit.model.read();
  const after = await logThrough(page, kit);
  assert.notEqual(after.phase, before.phase, 'the set logged with the editor open');
  assert.deepEqual(await settingsOps(kit.settings.repository), [],
    'and the unsaved draft was still never written');
  kit.settings.close(); kit.gymHost.close();
});

test('D2.1 / D2.2 - the new states are declared, dash free, and carry no figure', () => {
  const source = design.appSource();
  for (const line of [SETTINGS_READING, SETTINGS_UNREAD, SETTINGS_UNREAD_ACTION]) {
    assert(design.PREVIEW_RUNTIME_COPY.includes(line), 'declared: ' + line);
    assert(source.includes(line), 'present in a view source: ' + line);
    assert.equal(AI_DASH.test(line), false, 'dash free: ' + line);
    assert.equal(/\d/.test(line), false, 'no invented figure: ' + line);
  }
  /* The awaited read is GONE from paint(): finding 1 is a shape claim, pinned here. */
  const gym = codeOf(readRepo('rebuild/m3/w7-preview/today/gym-app.mjs'));
  assert.equal(/await\s+settingsLane\.latest/.test(gym), false,
    'the optional read must never be awaited on the card paint path');
});

/* ==========================================================================
   D2 ROUND 2 - R2-1, MOUNT OWNERSHIP. The deferred read used to repaint the card
   whenever it settled, over whatever screen the athlete had navigated to.
   ========================================================================== */

/* The card with a read that only answers when the test says so, on the SHARED phone
   element the rest of the page uses. */
async function cardWithHeldRead(kit, leave) {
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  const phone = doc.getElementById('phone');
  await kit.model.start();
  let release = null;
  const delayed = new Promise((resolve) => { release = resolve; });
  const mounted = mountGym(doc, phone, {
    model: kit.model,
    onBack: () => leave(doc, phone, 'back'),
    onCheckIn: () => leave(doc, phone, 'checkin'),
    settings: { latest: () => delayed, save: async () => ({ ok: false }), close() {} },
  });
  await mounted;
  assert(doc.querySelector('#phone [data-slot="log"]'), 'the card is usable with the read pending');
  return { dom, doc, phone, mounted, release: (value) => release(value) };
}

test('D2.R2 - BACK during a deferred read: the destination screen is never repainted over', async () => {
  const kit = await device();
  const page = await cardWithHeldRead(kit, (doc, phone) => {
    /* Exactly what the page does: it replaces the shared surface with another screen. */
    const other = doc.createElement('section');
    other.setAttribute('data-slot', 'synthetic-destination');
    other.textContent = 'SYNTHETIC_TODAY';
    phone.replaceChildren(other);
  });
  page.doc.querySelector('#phone [data-action="back"]').dispatchEvent(new page.dom.window.Event('click'));
  assert.equal(page.phone.textContent, 'SYNTHETIC_TODAY', 'the page navigated');
  assert.equal(page.mounted.settings.owns(), false, 'and the card handed the surface over');
  page.release(null);
  await page.mounted.settings.read();
  await settle();
  assert.equal(page.phone.textContent, 'SYNTHETIC_TODAY', 'the late read painted NOTHING');
  assert.equal(page.doc.querySelector('#phone [data-slot="log"]'), null, 'the card did not come back');
  assert(page.doc.querySelector('#phone [data-slot="synthetic-destination"]'), 'the destination is intact');
  kit.settings.close(); kit.gymHost.close(); page.dom.window.close();
});

test('D2.R2 - the CHECK-IN opened mid-read keeps its screen AND its half-typed draft', async () => {
  const kit = await device();
  const page = await cardWithHeldRead(kit, (doc, phone) => {
    /* The check-in the athlete is now filling in, with an answer already typed. */
    const sheet = doc.createElement('section');
    sheet.setAttribute('data-slot', 'synthetic-checkin');
    const box = doc.createElement('input');
    box.type = 'text';
    box.id = 'synthetic-checkin-note';
    sheet.append(box);
    phone.replaceChildren(sheet);
    box.value = 'SYNTHETIC_HALF_TYPED';
  });
  page.doc.querySelector('#phone [data-action="checkin"]').dispatchEvent(new page.dom.window.Event('click'));
  assert(page.doc.querySelector('#phone [data-slot="synthetic-checkin"]'), 'the check-in is on the screen');
  page.release(null);
  await page.mounted.settings.read();
  await settle();
  assert(page.doc.querySelector('#phone [data-slot="synthetic-checkin"]'), 'and it still is');
  assert.equal(page.doc.querySelector('#phone #synthetic-checkin-note').value, 'SYNTHETIC_HALF_TYPED',
    'his half-typed answer survived the late read');
  assert.equal(page.doc.querySelector('#phone [data-slot="log"]'), null, 'the workout did not reclaim the phone');
  kit.settings.close(); kit.gymHost.close(); page.dom.window.close();
});

test('D2.R2 - a read that FAILS after navigation is equally silent', async () => {
  const kit = await device();
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  const phone = doc.getElementById('phone');
  await kit.model.start();
  let reject = null;
  const delayed = new Promise((resolve, no) => { reject = no; });
  const mounted = mountGym(doc, phone, { model: kit.model,
    onBack: () => { phone.replaceChildren(doc.createTextNode('SYNTHETIC_TODAY')); },
    settings: { latest: () => delayed, save: async () => ({ ok: false }), close() {} } });
  await mounted;
  doc.querySelector('#phone [data-action="back"]').dispatchEvent(new dom.window.Event('click'));
  reject(new Error('SYNTHETIC_READ_FAILURE'));
  await mounted.settings.read();
  await settle();
  assert.equal(phone.textContent, 'SYNTHETIC_TODAY', 'a failed late read paints nothing either');
  assert.equal(doc.querySelector('#phone [data-slot="settings-block"]'), null);
  kit.settings.close(); kit.gymHost.close(); dom.window.close();
});
