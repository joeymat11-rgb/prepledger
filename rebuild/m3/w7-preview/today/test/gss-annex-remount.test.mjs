/* GSS annex G3: real quota refusal across the current public mount/draft boundary.
   The encrypted store and fault seam are existing synthetic fixtures; the phone,
   settings writer, DOM capture and Back ownership handoff are production paths. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import GymApp, { mountGym, newGymDraft } from '../gym-app.mjs';
import { createMachineSettingsHost } from '../machine-settings-host.mjs';
import design from '../design.cjs';

const DAY = '2026-09-03';
const LIFT = 'gss-annex-lift';
const EFFORTS = Object.freeze([
  Object.freeze({ label: '2', reserve: Object.freeze({ tag: 'exact', value: 2, unit: 'rep' }) }),
  Object.freeze({ label: '3+', reserve: Object.freeze({ tag: 'at_least', value: 3, unit: 'rep' }) }),
]);
const shell = () => design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml());
const copy = (value) => structuredClone(value);
const deferred = () => { let resolve; const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve }; };
const settle = async (rounds = 8) => {
  for (let index = 0; index < rounds; index += 1) await new Promise((resolve) => setTimeout(resolve, 0));
};
async function within(value, label, milliseconds = 5000) {
  let timer;
  try { return await Promise.race([Promise.resolve(value), new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('GSS-G3-BOUNDED-WAIT: ' + label)), milliseconds);
  })]); } finally { clearTimeout(timer); }
}

function activeView() {
  return { phase: 'active', startId: 'gss-g3-start', title: 'Synthetic workout',
    session: { instruction: { display: 'Synthetic workout' } },
    lift: { id: LIFT, label: 'Synthetic lift', index: 1, count: 1 },
    set: { slot: 0, lift: LIFT, position: 1 },
    prescription: { reason: [], setup: null, line: 'Synthetic plan', effort: 'Synthetic effort' },
    strip: [], entry: { load: 40, reps: 10, step: 2.5 }, previous: '',
    upNext: null, message: null };
}

async function collections(repository) {
  const held = (await repository.load()).generation.collections;
  return copy({ ops: held.ops || {}, outbox: held.outbox || {} });
}

function pageTools(dom, phone, mounted) {
  const pick = (selector) => phone.querySelector(selector);
  const click = (selector) => { const control = pick(selector);
    assert(control, 'GSS-G3-MISSING-CONTROL ' + selector); control.click(); };
  const input = (selector, value) => { const control = pick(selector);
    assert(control, 'GSS-G3-MISSING-INPUT ' + selector); control.value = value;
    control.dispatchEvent(new dom.window.Event('input', { bubbles: true })); };
  return { mounted, pick, click, input, async openEditor() {
    click('[data-action="settings-open"]'); await settle();
    assert.equal(pick('[data-slot="settings-editor"]')?.hidden, false, 'GSS-G3-EDITOR-DID-NOT-OPEN');
  } };
}

async function world() {
  const fault = faultDatabase();
  const settings = await createMachineSettingsHost({ day: DAY, indexedDB: fault.indexedDB,
    crypto: webcrypto });
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1/' });
  const phone = dom.window.document.getElementById('phone');
  const model = { day: DAY, read: async () => copy(activeView()), effortChoices: () => EFFORTS,
    start: async () => ({ ok: true }) };
  return { fault, settings, dom, phone, model };
}

async function mount(world, draft, settings, onBack = () => {}) {
  const mounted = mountGym(world.dom.window.document, world.phone,
    { model: world.model, draft, settings, onBack });
  await mounted;
  if (mounted.settings.read()) await within(mounted.settings.read(), 'settings read');
  await settle();
  return pageTools(world.dom, world.phone, mounted);
}

async function quotaCancelWritesNothing() {
  const unit = await world(); let reopened;
  try {
    const draft = newGymDraft(); draft.entry = { load: '41', reps: '8' }; draft.effort = EFFORTS[0];
    const before = await collections(unit.settings.repository);
    const page = await mount(unit, draft, unit.settings);
    await page.openEditor(); page.input('[data-settings-name="0"]', 'Seat');
    page.input('[data-settings-value="0"]', 'four');
    unit.fault.state.armed = true; unit.fault.state.mode = 'quota';
    page.click('[data-slot="settings-save"]'); await within(page.mounted.settings.pending(), 'quota Save');
    unit.fault.state.armed = false;
    assert.equal(page.pick('[data-slot="settings-error"]').textContent, GymApp.SETTINGS_NOT_SAVED,
      'GSS-G3-QUOTA-ERROR-LOST');
    assert.equal(page.pick('[data-settings-value="0"]').value, 'four', 'GSS-G3-QUOTA-ANSWER-LOST');
    page.click('[data-action="settings-cancel"]'); await settle();
    assert.equal(page.pick('[data-slot="settings-editor"]').hidden, true, 'GSS-G3-CANCEL-DID-NOT-CLOSE');
    reopened = await createMachineSettingsHost({ day: DAY, indexedDB: unit.fault.indexedDB,
      crypto: webcrypto });
    assert.deepEqual(await collections(reopened.repository), before, 'GSS-G3-CANCEL-WROTE');
  } finally { unit.fault.state.armed = false; reopened?.close(); unit.settings.close(); unit.dom.window.close(); }
}

async function heldQuotaRemount(plant = false) {
  const unit = await world(); let reopened, replacementPromise = null, oldOwnedInsideBack = null;
  const reached = deferred(), release = deferred();
  try {
    const draft = newGymDraft(); draft.entry = { load: '41', reps: '8' }; draft.effort = EFFORTS[0];
    const before = await collections(unit.settings.repository);
    const heldSettings = { latest: (...args) => unit.settings.latest(...args), save: async (machine) => {
      const result = await unit.settings.save(machine); reached.resolve(result); await release.promise; return result;
    } };
    let first;
    first = await mount(unit, draft, heldSettings, () => {
      oldOwnedInsideBack = first.mounted.settings.owns();
      replacementPromise = mount(unit, draft, unit.settings);
    });
    await first.openEditor(); first.input('[data-settings-name="0"]', 'Seat');
    first.input('[data-settings-value="0"]', 'four');
    unit.fault.state.armed = true; unit.fault.state.mode = 'quota';
    first.click('[data-slot="settings-save"]'); const pending = first.mounted.settings.pending();
    const refusal = await within(reached.promise, 'real quota refusal');
    assert.equal(refusal.ok, false, 'GSS-G3-QUOTA-PRECONDITION');
    unit.fault.state.armed = false;
    first.input('#gym-weight', '52'); first.input('#gym-reps', '7');
    first.click('[data-slot="choices"] button:nth-child(2)');
    release.resolve(); await within(pending, 'held quota delivery'); await settle();
    assert.equal(first.pick('[data-slot="settings-error"]').textContent, GymApp.SETTINGS_NOT_SAVED,
      'GSS-G3-HELD-ERROR-PRECONDITION');
    first.click('[data-action="back"]');
    const replacement = await within(replacementPromise, 'same-phone remount');
    assert.equal(oldOwnedInsideBack, false, 'GSS-G3-OLD-OWNERSHIP-NOT-RETIRED');
    if (plant) replacement.input('#gym-weight', '');
    const observed = { load: replacement.pick('#gym-weight')?.value,
      reps: replacement.pick('#gym-reps')?.value,
      effort: [...replacement.pick('[data-slot="choices"]').querySelectorAll('button')]
        .find((button) => button.textContent === '3+')?.getAttribute('aria-pressed'),
      editorOpen: replacement.pick('[data-slot="settings-editor"]')?.hidden === false,
      name: replacement.pick('[data-settings-name="0"]')?.value || '',
      value: replacement.pick('[data-settings-value="0"]')?.value || '',
      error: replacement.pick('[data-slot="settings-error"]')?.textContent || '' };
    reopened = await createMachineSettingsHost({ day: DAY, indexedDB: unit.fault.indexedDB,
      crypto: webcrypto });
    assert.deepEqual(await collections(reopened.repository), before, 'GSS-G3-REMOUNT-WROTE');
    assert.equal(observed.load, '52', 'GSS-G3-INDEPENDENT-ENTRY-LOST');
    assert.equal(observed.reps, '7', 'GSS-G3-INDEPENDENT-REPS-LOST');
    assert.equal(observed.effort, 'true', 'GSS-G3-INDEPENDENT-EFFORT-LOST');
    assert.equal(observed.editorOpen, true, 'GSS-G3-EDITOR-LOST-ON-REMOUNT');
    assert.equal(observed.name, 'Seat', 'GSS-G3-NAME-LOST-ON-REMOUNT');
    assert.equal(observed.value, 'four', 'GSS-G3-ANSWER-LOST-ON-REMOUNT');
    assert.equal(observed.error, GymApp.SETTINGS_NOT_SAVED, 'GSS-G3-ERROR-LOST-ON-REMOUNT');
  } finally { release.resolve(); unit.fault.state.armed = false; reopened?.close();
    unit.settings.close(); unit.dom.window.close(); }
}

test('D-GSS-G3: real quota refusal survives Cancel and a held same-phone remount',
  { timeout: 30000 }, async () => {
    await quotaCancelWritesNothing();
    await assert.rejects(heldQuotaRemount(true), (error) =>
      error && error.message.includes('GSS-G3-INDEPENDENT-ENTRY-LOST'));
    await heldQuotaRemount(false);
  });
