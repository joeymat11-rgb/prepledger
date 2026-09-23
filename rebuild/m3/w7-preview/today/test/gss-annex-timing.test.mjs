/* GSS annex timing proof, initial G1/G2 batch.
 *
 * Current public surfaces only: mountGym, its settings pending handle, and the
 * durable machine-settings host. No retired lifecycle counters or refresh API.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';
import GymApp, { mountGym } from '../gym-app.mjs';
import { createMachineSettingsHost, PROFILE } from '../machine-settings-host.mjs';
import design from '../design.cjs';
// fake-indexeddb is a dependency of rebuild/m3/w6 only (its package.json), so it is resolved
// from there, as browser-check.mjs resolves w6's dependencies; a bare import from this
// directory cannot reach rebuild/m3/w6/node_modules (S10, DECISIONS:792).
const { IDBFactory } = createRequire(new URL('../../../w6/package.json', import.meta.url))('fake-indexeddb');

const DAY = '2026-09-03';
const LIFT = 'gss-annex-lift';
const EXPECTED = Object.freeze({ exercise_id: LIFT,
  settings: [Object.freeze({ name: 'Seat', value: 'four' })] });
const EFFORT = Object.freeze({ label: '2', reserve: Object.freeze({ tag: 'known', value: 2 }) });

const shell = () => design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml());
const copy = (value) => structuredClone(value);
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
};
const settle = async (rounds = 8) => {
  for (let index = 0; index < rounds; index += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
};
async function until(check, label) {
  for (let index = 0; index < 400; index += 1) {
    if (check()) return;
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
  throw new Error('GSS-ANNEX-TIMEOUT: ' + label);
}
async function within(value, label, milliseconds = 5000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('GSS-ANNEX-BOUNDED-WAIT: ' + label)), milliseconds);
  });
  try { return await Promise.race([Promise.resolve(value), timeout]); }
  finally { clearTimeout(timer); }
}

function activeView() {
  return { phase: 'active', startId: 'gss-annex-start', title: 'Synthetic workout',
    session: { instruction: { display: 'Synthetic workout' } },
    lift: { id: LIFT, label: 'Synthetic lift', index: 1, count: 1 },
    set: { slot: 0, lift: LIFT, position: 1 },
    prescription: { reason: ['Synthetic reason'], setup: null,
      line: 'Synthetic plan', effort: 'Synthetic effort' },
    strip: [], entry: { load: null, reps: null, step: 2.5 }, previous: '',
    upNext: null, message: null };
}

async function openHost(indexedDB, databaseName) {
  return createMachineSettingsHost({ day: DAY, indexedDB, crypto: webcrypto, databaseName });
}

async function collections(repository) {
  const held = (await repository.load()).generation.collections;
  return copy({ ops: held.ops || {}, outbox: held.outbox || {} });
}

function holdAcknowledgement(host) {
  const reached = deferred(), release = deferred();
  let submitted = null;
  return { reached: reached.promise, release: release.resolve,
    submitted: () => copy(submitted),
    settings: {
      latest: (...args) => host.latest(...args),
      save: async (machine) => {
        submitted = copy(machine);
        const result = await host.save(machine);
        reached.resolve();
        await release.promise;
        return result;
      },
    } };
}

async function mountedPage(settings) {
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1/' });
  const doc = dom.window.document, phone = doc.getElementById('phone');
  const view = activeView();
  const model = { day: DAY, read: async () => copy(view), effortChoices: () => [EFFORT],
    start: async () => ({ ok: true }) };
  const mounted = mountGym(doc, phone, { model, settings, onBack: () => {} });
  await mounted;
  if (mounted.settings.read()) await mounted.settings.read();
  await settle();
  const pick = (selector) => phone.querySelector(selector);
  const click = (selector) => {
    const control = pick(selector);
    assert(control, 'GSS-ANNEX-MISSING-CONTROL: ' + selector);
    control.click();
  };
  const input = (selector, value) => {
    const control = pick(selector);
    assert(control, 'GSS-ANNEX-MISSING-INPUT: ' + selector);
    control.value = value;
    control.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  };
  const openEditor = async () => {
    click('[data-action="settings-open"]');
    await until(() => pick('[data-slot="settings-editor"]')?.hidden === false
      && pick('[data-settings-value="0"]'), 'settings editor open');
  };
  return { dom, doc, phone, mounted, pick, click, input, openEditor };
}

function added(before, after, table) {
  for (const [id, row] of Object.entries(before[table])) {
    assert.deepEqual(after[table][id], row, 'GSS-' + table.toUpperCase() + '-PRESERVE: ' + id);
  }
  return Object.keys(after[table]).filter((id) => !Object.hasOwn(before[table], id));
}

function proveOneDurableSettingsWrite(before, after, submitted, latest) {
  const opIds = added(before, after, 'ops');
  const outboxIds = added(before, after, 'outbox');
  assert.equal(opIds.length, 1, 'GSS-DURABLE-OP-COUNT');
  assert.equal(outboxIds.length, 1, 'GSS-DURABLE-OUTBOX-COUNT');
  const op = after.ops[opIds[0]], outbox = after.outbox[outboxIds[0]];
  assert.deepEqual(submitted, EXPECTED, 'GSS-SUBMITTED-SNAPSHOT');
  assert.deepEqual(op.payload, { profile: PROFILE, machine: EXPECTED }, 'GSS-DURABLE-PAYLOAD');
  assert.equal(outbox.op_id, op.op_id, 'GSS-DURABLE-OUTBOX-LINK');
  assert.equal(Object.values(after.outbox).filter((row) => row.op_id === op.op_id).length, 1,
    'GSS-DURABLE-OUTBOX-EXACTLY-ONCE');
  assert.deepEqual(latest.machine, EXPECTED, 'GSS-DURABLE-REOPEN-LATEST');
}

function proveG1Editor(observed) {
  assert.equal(observed.open, true, 'GSS-G1-STALE-EDITOR-CLEAR');
  assert.equal(observed.saveEnabled, true, 'GSS-G1-REVISED-OUTCOME-REBIND');
  assert.equal(observed.value, 'six', 'GSS-G1-NEWER-ANSWER-LOST');
  assert.equal(observed.error, GymApp.SETTINGS_NOTHING, 'GSS-G1-NEWER-ERROR-LOST');
}

function proveG2Draft(observed) {
  assert.equal(observed.editorClosed, true, 'GSS-G2-UNCHANGED-EDITOR-STAYED-OPEN');
  assert.equal(observed.load, observed.expectedLoad, 'GSS-G2-INDEPENDENT-LOAD-LOST');
  assert.equal(observed.reps, observed.expectedReps, 'GSS-G2-INDEPENDENT-REPS-LOST');
  assert.equal(observed.effortPressed, observed.expectedEffort,
    'GSS-G2-INDEPENDENT-EFFORT-LOST');
}

function observeG1(page) {
  const editor = page.pick('[data-slot="settings-editor"]');
  return { open: !!editor && !editor.hidden,
    saveEnabled: page.pick('[data-slot="settings-save"]')?.disabled === false,
    value: page.pick('[data-settings-value="0"]')?.value || null,
    error: page.pick('[data-slot="settings-error"]')?.textContent || '' };
}

function observeG2(page, expectedLoad, expectedReps, expectedEffort) {
  const effort = [...page.phone.querySelectorAll('[data-slot="choices"] button')]
    .find((button) => button.textContent === '2');
  return { editorClosed: page.pick('[data-slot="settings-editor"]')?.hidden === true,
    load: page.pick('#gym-weight')?.value, expectedLoad,
    reps: page.pick('#gym-reps')?.value, expectedReps,
    effortPressed: effort?.getAttribute('aria-pressed') === 'true', expectedEffort };
}

async function runG1(plant = false) {
  const indexedDB = new IDBFactory(), databaseName = 'gss-annex-g1-' + (plant ? 'plant' : 'candidate');
  let host, reopened, page, hold;
  try {
    host = await openHost(indexedDB, databaseName);
    const before = await collections(host.repository);
    hold = holdAcknowledgement(host);
    page = await mountedPage(hold.settings);
    await page.openEditor();
    page.click('[data-slot="settings-save"]');
    await within(page.mounted.settings.pending(), 'G1 invalid Save delivery');
    await settle();
    assert.equal(page.pick('[data-slot="settings-error"]').textContent, GymApp.SETTINGS_NOTHING,
      'GSS-G1-ERROR-PRECONDITION');
    page.input('[data-settings-name="0"]', 'Seat');
    page.input('[data-settings-value="0"]', 'four');
    await settle();
    page.click('[data-slot="settings-save"]');
    const pending = page.mounted.settings.pending();
    await within(hold.reached, 'G1 held Save acknowledgement');
    page.input('[data-settings-value="0"]', 'six');
    await until(() => page.pick('[data-settings-value="0"]')?.value === 'six',
      'newer same-editor answer');
    hold.release();
    await within(pending, 'G1 held Save delivery');
    await settle();
    let plantReached = false;
    if (plant) {
      const editor = page.pick('[data-slot="settings-editor"]');
      assert(editor, 'GSS-G1-PLANT-SEAM-MISSING');
      editor.hidden = true;
      plantReached = true;
    }
    const observed = observeG1(page);

    host.close(); host = null;
    reopened = await openHost(indexedDB, databaseName);
    const after = await collections(reopened.repository);
    proveOneDurableSettingsWrite(before, after, hold.submitted(), await reopened.latest(LIFT));
    if (plant) assert.equal(plantReached, true, 'GSS-G1-PLANT-NOT-REACHED');
    proveG1Editor(observed);
  } finally {
    hold?.release();
    const cleanup = page?.mounted.settings.pending();
    if (cleanup) await within(cleanup, 'G1 cleanup', 2000).catch(() => {});
    page?.dom.window.close();
    reopened?.close();
    host?.close();
  }
}

async function runG2(variant, plant = false) {
  const indexedDB = new IDBFactory();
  const databaseName = 'gss-annex-g2-' + variant + '-' + (plant ? 'plant' : 'candidate');
  let host, reopened, page, hold;
  try {
      host = await openHost(indexedDB, databaseName);
      const before = await collections(host.repository);
      hold = holdAcknowledgement(host);
      page = await mountedPage(hold.settings);
      await page.openEditor();
      page.input('[data-settings-name="0"]', 'Seat');
      page.input('[data-settings-value="0"]', 'four');
      await settle();
      page.click('[data-slot="settings-save"]');
      const pending = page.mounted.settings.pending();
      await within(hold.reached, 'G2 ' + variant + ' held Save acknowledgement');

      let expectedLoad, expectedReps, expectedEffort;
      if (variant === 'entry-fields') {
        page.input('#gym-weight', '41');
        page.input('#gym-reps', '8');
        expectedLoad = '41'; expectedReps = '8'; expectedEffort = false;
      } else {
        const up = [...page.phone.querySelectorAll('[data-step]')]
          .find((button) => button.dataset.step === 'load:1');
        assert(up, 'GSS-G2-STEPPER-PRECONDITION');
        up.click();
        const effort = [...page.phone.querySelectorAll('[data-slot="choices"] button')]
          .find((button) => button.textContent === '2');
        assert(effort, 'GSS-G2-EFFORT-PRECONDITION');
        effort.click();
        expectedLoad = '2.5'; expectedReps = ''; expectedEffort = true;
      }
      hold.release();
      await within(pending, 'G2 ' + variant + ' held Save delivery');
      await settle();
      let plantReached = false;
      if (plant) {
        const load = page.pick('#gym-weight');
        assert(load, 'GSS-G2-PLANT-SEAM-MISSING');
        load.value = '';
        plantReached = true;
      }
      const observed = observeG2(page, expectedLoad, expectedReps, expectedEffort);

      host.close(); host = null;
      reopened = await openHost(indexedDB, databaseName);
      const after = await collections(reopened.repository);
      proveOneDurableSettingsWrite(before, after, hold.submitted(), await reopened.latest(LIFT));
      if (plant) assert.equal(plantReached, true, 'GSS-G2-PLANT-NOT-REACHED');
      proveG2Draft(observed);
  } finally {
      hold?.release();
      const cleanup = page?.mounted.settings.pending();
      if (cleanup) await within(cleanup, 'G2 ' + variant + ' cleanup', 2000).catch(() => {});
      page?.dom.window.close();
      reopened?.close();
      host?.close();
  }
}

test('D-GSS-G1: same-editor revision survives held real Save while original stores once',
  { timeout: 20000 }, async () => {
    await assert.rejects(runG1(true), (error) =>
      error && error.message.includes('GSS-G1-STALE-EDITOR-CLEAR'));
    await runG1(false);
  });

test('D-GSS-G2: entry and stepper-effort changes survive held real Save',
  { timeout: 30000 }, async () => {
  await assert.rejects(runG2('entry-fields', true), (error) =>
    error && error.message.includes('GSS-G2-INDEPENDENT-LOAD-LOST'));
  const failures = [];
  for (const variant of ['entry-fields', 'stepper-effort']) {
    try { await runG2(variant, false); }
    catch (error) { failures.push(error); }
  }
  if (failures.length) throw failures[0];
});

async function runG1Aba() {
  const indexedDB = new IDBFactory(), databaseName = 'gss-annex-g1-aba';
  let host, reopened, page, hold;
  try {
    host = await openHost(indexedDB, databaseName);
    const before = await collections(host.repository);
    hold = holdAcknowledgement(host);
    page = await mountedPage(hold.settings);
    await page.openEditor();
    page.click('[data-slot="settings-save"]');
    await within(page.mounted.settings.pending(), 'G1 ABA invalid Save delivery');
    await settle();
    assert.equal(page.pick('[data-slot="settings-error"]').textContent, GymApp.SETTINGS_NOTHING,
      'GSS-G1-ABA-ERROR-PRECONDITION');
    page.input('[data-settings-name="0"]', 'Seat');
    page.input('[data-settings-value="0"]', 'four');
    page.click('[data-slot="settings-save"]');
    const pending = page.mounted.settings.pending();
    await within(hold.reached, 'G1 ABA held Save acknowledgement');
    page.input('[data-settings-value="0"]', 'six');
    page.input('[data-settings-value="0"]', 'four');
    assert.equal(page.pick('[data-settings-value="0"]').value, 'four',
      'GSS-G1-ABA-REVISION-PRECONDITION');
    hold.release();
    await within(pending, 'G1 ABA held Save delivery');
    await settle();
    const observed = observeG1(page);

    host.close(); host = null;
    reopened = await openHost(indexedDB, databaseName);
    const after = await collections(reopened.repository);
    proveOneDurableSettingsWrite(before, after, hold.submitted(), await reopened.latest(LIFT));
    assert.equal(observed.open, true, 'GSS-G1-ABA-EDITOR-CLEAR');
    assert.equal(observed.saveEnabled, true, 'GSS-G1-ABA-REVISED-OUTCOME-REBIND');
    assert.equal(observed.value, 'four', 'GSS-G1-ABA-ANSWER-LOST');
    assert.equal(observed.error, GymApp.SETTINGS_NOTHING, 'GSS-G1-ABA-ERROR-LOST');
  } finally {
    hold?.release();
    const cleanup = page?.mounted.settings.pending();
    if (cleanup) await within(cleanup, 'G1 ABA cleanup', 2000).catch(() => {});
    page?.dom.window.close();
    reopened?.close();
    host?.close();
  }
}

test('D-GSS-G1-ABA: edit then revert is still a newer held-Save revision',
  { timeout: 20000 }, runG1Aba);
