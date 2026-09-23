/* GSS annex G3: real quota refusal across the current public mount/draft boundary.
   The encrypted store and fault seam are existing synthetic fixtures; the phone,
   settings writer, DOM capture and Back ownership handoff are production paths. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import GymApp, { mountGym, newGymDraft } from '../gym-app.mjs';
import { createMachineSettingsHost, PROFILE } from '../machine-settings-host.mjs';
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
  let view = activeView();
  const model = { day: DAY, read: async () => copy(view), effortChoices: () => EFFORTS,
    start: async () => ({ ok: true }) };
  return { fault, settings, dom, phone, model, setView(next) { view = copy(next); } };
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

async function heldQuotaRemount(plant = false, action = 'cancel') {
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
    if (action === 'save') {
      replacement.click('[data-slot="settings-save"]');
      await within(replacement.mounted.settings.pending(), 'fresh remount Save'); await settle();
      const after = await collections(reopened.repository);
      const opIds = Object.keys(after.ops).filter((id) => !Object.hasOwn(before.ops, id));
      const outboxIds = Object.keys(after.outbox).filter((id) => !Object.hasOwn(before.outbox, id));
      for (const [id, op] of Object.entries(before.ops))
        assert.deepEqual(after.ops[id], op, 'GSS-G3-FRESH-SAVE-PRIOR-OP-CHANGED ' + id);
      for (const [id, item] of Object.entries(before.outbox))
        assert.deepEqual(after.outbox[id], item, 'GSS-G3-FRESH-SAVE-PRIOR-OUTBOX-CHANGED ' + id);
      assert.equal(opIds.length, 1, 'GSS-G3-FRESH-SAVE-OP-COUNT');
      assert.equal(outboxIds.length, 1, 'GSS-G3-FRESH-SAVE-OUTBOX-COUNT');
      assert.deepEqual(after.ops[opIds[0]].payload, { profile: PROFILE,
        machine: { exercise_id: LIFT, settings: [{ name: 'Seat', value: 'four' }] } },
      'GSS-G3-FRESH-SAVE-PAYLOAD');
      assert.equal(after.outbox[outboxIds[0]].op_id, after.ops[opIds[0]].op_id,
        'GSS-G3-FRESH-SAVE-OUTBOX-LINK');
      assert.equal(replacement.pick('[data-slot="settings-editor"]').hidden, true,
        'GSS-G3-FRESH-SAVE-DID-NOT-CLEAR');
    } else {
      replacement.click('[data-action="settings-cancel"]'); await settle();
      assert.equal(replacement.pick('[data-slot="settings-editor"]').hidden, true,
        'GSS-G3-REMOUNT-CANCEL-DID-NOT-CLEAR');
      assert.deepEqual(await collections(reopened.repository), before, 'GSS-G3-REMOUNT-CANCEL-WROTE');
    }
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

test('GSS-G3-CARRIER: restored settings use a fresh Save authority exactly once',
  { timeout: 30000 }, () => heldQuotaRemount(false, 'save'));

async function staleOutcomeCannotOverwrite() {
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
    assert.equal((await within(reached.promise, 'stale quota result')).ok, false);
    unit.fault.state.armed = false;
    first.click('[data-action="back"]');
    const replacement = await within(replacementPromise, 'stale same-phone remount');
    assert.equal(oldOwnedInsideBack, false, 'GSS-G3-STALE-OLD-OWNERSHIP');
    assert.equal(replacement.pick('[data-slot="settings-editor"]').hidden, false,
      'GSS-G3-STALE-RESTORE-MISSING');
    replacement.input('[data-settings-value="0"]', 'five');
    release.resolve(); await within(pending, 'stale old delivery'); await settle();
    assert.equal(replacement.pick('[data-settings-value="0"]').value, 'five',
      'GSS-G3-STALE-OUTCOME-OVERWROTE-DRAFT');
    assert.equal(replacement.pick('[data-slot="settings-error"]').textContent, '',
      'GSS-G3-STALE-OUTCOME-OVERWROTE-ERROR');
    reopened = await createMachineSettingsHost({ day: DAY, indexedDB: unit.fault.indexedDB,
      crypto: webcrypto });
    assert.deepEqual(await collections(reopened.repository), before, 'GSS-G3-STALE-OUTCOME-WROTE');
    replacement.click('[data-action="settings-cancel"]'); await settle();
  } finally { release.resolve(); unit.fault.state.armed = false; reopened?.close();
    unit.settings.close(); unit.dom.window.close(); }
}

async function isolatedCarrier(kind) {
  const unit = await world(); let reopened, replacementPromise = null;
  try {
    const draft = newGymDraft(); draft.entry = { load: '41', reps: '8' }; draft.effort = EFFORTS[0];
    const before = await collections(unit.settings.repository);
    let first;
    first = await mount(unit, draft, unit.settings, () => {
      let nextDraft = draft;
      if (kind === 'context') {
        const other = activeView(); other.startId = 'gss-g3-other-start'; other.lift.id = 'other-lift';
        other.set.lift = 'other-lift'; unit.setView(other);
      } else nextDraft = newGymDraft();
      replacementPromise = mount(unit, nextDraft, unit.settings);
    });
    await first.openEditor(); first.input('[data-settings-name="0"]', 'Seat');
    first.input('[data-settings-value="0"]', 'four');
    unit.fault.state.armed = true; unit.fault.state.mode = 'quota';
    first.click('[data-slot="settings-save"]'); await within(first.mounted.settings.pending(), kind + ' quota');
    unit.fault.state.armed = false;
    assert.equal(first.pick('[data-slot="settings-error"]').textContent, GymApp.SETTINGS_NOT_SAVED);
    first.click('[data-action="back"]');
    const replacement = await within(replacementPromise, kind + ' isolated remount');
    assert.equal(first.mounted.settings.owns(), false, 'GSS-G3-ISOLATION-OLD-OWNERSHIP ' + kind);
    assert.equal(replacement.pick('[data-slot="settings-editor"]').hidden, true,
      'GSS-G3-ISOLATION-EDITOR-INHERITED ' + kind);
    assert.equal(replacement.pick('[data-slot="settings-error"]').textContent, '',
      'GSS-G3-ISOLATION-ERROR-INHERITED ' + kind);
    reopened = await createMachineSettingsHost({ day: DAY, indexedDB: unit.fault.indexedDB,
      crypto: webcrypto });
    assert.deepEqual(await collections(reopened.repository), before, 'GSS-G3-ISOLATION-WROTE ' + kind);
  } finally { unit.fault.state.armed = false; reopened?.close(); unit.settings.close(); unit.dom.window.close(); }
}

test('GSS-G3-STALE: an old outcome cannot overwrite a replacement mount',
  { timeout: 20000 }, staleOutcomeCannotOverwrite);

test('GSS-G3-ISOLATION: different workout context and different draft inherit nothing',
  { timeout: 30000 }, async () => {
    await isolatedCarrier('context');
    await isolatedCarrier('draft');
  });

async function oldDomCannotMutateReplacement() {
  const unit = await world(); let reopened, replacementPromise = null;
  try {
    const draft = newGymDraft();
    const before = await collections(unit.settings.repository);
    let first;
    first = await mount(unit, draft, unit.settings, () => {
      replacementPromise = mount(unit, draft, unit.settings);
    });
    await first.openEditor();
    first.click('[data-action="settings-add"]'); await settle();
    first.input('[data-settings-name="0"]', 'Seat'); first.input('[data-settings-value="0"]', 'four');
    first.input('[data-settings-name="1"]', 'Pin'); first.input('[data-settings-value="1"]', 'three');
    const oldValue = first.pick('[data-settings-value="0"]');
    const oldAdd = first.pick('[data-action="settings-add"]');
    const oldRemove = first.pick('[data-settings-remove="1"]');
    assert(oldValue && oldAdd && oldRemove, 'GSS-G3-OLD-DOM-PRECONDITION');
    first.click('[data-action="back"]');
    const replacement = await within(replacementPromise, 'old DOM remount');
    assert.equal(replacement.pick('[data-slot="settings-editor"]').hidden, false,
      'GSS-G3-OLD-DOM-RESTORE-MISSING');
    oldValue.value = 'stale';
    oldValue.dispatchEvent(new unit.dom.window.Event('input', { bubbles: true }));
    oldAdd.click(); oldRemove.click();
    replacement.click('[data-action="settings-add"]'); await settle();
    assert.equal(replacement.pick('[data-settings-value="0"]').value, 'four',
      'GSS-G3-OLD-DOM-INPUT-MUTATED-REPLACEMENT');
    assert.equal(replacement.pick('[data-settings-name="1"]').value, 'Pin',
      'GSS-G3-OLD-DOM-REMOVE-MUTATED-REPLACEMENT');
    assert.equal(replacement.pick('[data-settings-value="1"]').value, 'three',
      'GSS-G3-OLD-DOM-ROW-MUTATED-REPLACEMENT');
    assert.equal(unit.phone.querySelectorAll('[data-slot="settings-rows"] .row').length, 3,
      'GSS-G3-OLD-DOM-ADD-MUTATED-REPLACEMENT');
    replacement.click('[data-action="settings-cancel"]'); await settle();
    reopened = await createMachineSettingsHost({ day: DAY, indexedDB: unit.fault.indexedDB,
      crypto: webcrypto });
    assert.deepEqual(await collections(reopened.repository), before, 'GSS-G3-OLD-DOM-WROTE');
  } finally { reopened?.close(); unit.settings.close(); unit.dom.window.close(); }
}

test('GSS-G3-OLD-DOM: retired input/add/remove controls cannot mutate replacement state',
  { timeout: 20000 }, oldDomCannotMutateReplacement);

async function refusedEditor(unit, draft) {
  const before = await collections(unit.settings.repository);
  const page = await mount(unit, draft, unit.settings);
  await page.openEditor();
  page.input('[data-settings-name="0"]', 'Seat');
  page.input('[data-settings-value="0"]', 'four');
  unit.fault.state.armed = true; unit.fault.state.mode = 'quota';
  page.click('[data-slot="settings-save"]');
  await within(page.mounted.settings.pending(), 'retired control quota');
  unit.fault.state.armed = false; await settle();
  assert.equal(page.pick('[data-slot="settings-error"]').textContent, GymApp.SETTINGS_NOT_SAVED,
    'GSS-G3-RETIRED-QUOTA-PRECONDITION');
  assert.deepEqual(await collections(unit.settings.repository), before,
    'GSS-G3-RETIRED-QUOTA-WROTE');
  return { before, page };
}

function proveRestored(page, label) {
  assert.equal(page.pick('[data-slot="settings-editor"]')?.hidden, false,
    label + '-EDITOR');
  assert.equal(page.pick('[data-settings-value="0"]')?.value, 'four',
    label + '-DRAFT');
  assert.equal(page.pick('[data-slot="settings-error"]')?.textContent, GymApp.SETTINGS_NOT_SAVED,
    label + '-ERROR');
}

test('GSS-G3-RETIRED-CANCEL: a retired Cancel cannot erase replacement carry',
  { timeout: 20000 }, async () => {
    const unit = await world(); let reopened;
    try {
      const draft = newGymDraft();
      const { before, page: first } = await refusedEditor(unit, draft);
      const oldCancel = first.pick('[data-action="settings-cancel"]');
      first.click('[data-action="back"]'); await settle();
      assert.equal(first.mounted.settings.owns(), false, 'GSS-G3-RETIRED-CANCEL-OLD-OWNS');
      const second = await mount(unit, draft, unit.settings);
      proveRestored(second, 'GSS-G3-RETIRED-CANCEL-SECOND');
      assert.equal(oldCancel.isConnected, false, 'GSS-G3-RETIRED-CANCEL-STILL-CONNECTED');
      oldCancel.click(); await settle();
      assert.equal(second.pick('[data-settings-value="0"]').value, 'four',
        'GSS-G3-RETIRED-CANCEL-MUTATED-REPLACEMENT');
      second.click('[data-action="back"]'); await settle();
      const third = await mount(unit, draft, unit.settings);
      proveRestored(third, 'INDEPENDENT-G3-RETIRED-CANCEL-CARRY');
      unit.settings.close(); unit.settings = null;
      reopened = await createMachineSettingsHost({ day: DAY, indexedDB: unit.fault.indexedDB,
        crypto: webcrypto });
      assert.deepEqual(await collections(reopened.repository), before,
        'GSS-G3-RETIRED-CANCEL-WROTE');
    } finally { unit.fault.state.armed = false; reopened?.close(); unit.settings?.close();
      unit.dom.window.close(); }
  });

test('GSS-G3-DELAYED-RESTORE: retired input cannot mutate carry before its clone',
  { timeout: 20000 }, async () => {
    const unit = await world(); let reopened; const entered = deferred(), release = deferred();
    try {
      const draft = newGymDraft();
      const { before, page: first } = await refusedEditor(unit, draft);
      const oldInput = first.pick('[data-settings-value="0"]');
      first.click('[data-action="back"]'); await settle();
      assert.equal(first.mounted.settings.owns(), false, 'GSS-G3-DELAYED-RESTORE-OLD-OWNS');
      const delayed = { latest: async (...args) => { entered.resolve(); await release.promise;
        return unit.settings.latest(...args); }, save: (...args) => unit.settings.save(...args) };
      const mounting = mount(unit, draft, delayed);
      await within(entered.promise, 'delayed restore read entered');
      assert.equal(oldInput.isConnected, false, 'GSS-G3-DELAYED-RESTORE-INPUT-CONNECTED');
      oldInput.value = 'retired mutation';
      oldInput.dispatchEvent(new unit.dom.window.Event('input', { bubbles: true }));
      release.resolve();
      const second = await within(mounting, 'delayed restore mount');
      proveRestored(second, 'INDEPENDENT-G3-DELAYED-RESTORE');
      unit.settings.close(); unit.settings = null;
      reopened = await createMachineSettingsHost({ day: DAY, indexedDB: unit.fault.indexedDB,
        crypto: webcrypto });
      assert.deepEqual(await collections(reopened.repository), before,
        'GSS-G3-DELAYED-RESTORE-WROTE');
    } finally { release.resolve(); unit.fault.state.armed = false; reopened?.close();
      unit.settings?.close(); unit.dom.window.close(); }
  });
