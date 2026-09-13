import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { webcrypto } from 'node:crypto';
import { faultDatabase, deferred } from '../../../m3/w6/test/support.mjs';
import { createGymHost } from '../../../m3/w7-preview/today/gym-host.mjs';
import { createGymModel, EFFORT_CHOICES } from '../../../m3/w7-preview/today/gym-model.mjs';
import { mountGym, SETTINGS_REFUSED, SETTINGS_READING, SETTINGS_UNREAD } from '../../../m3/w7-preview/today/gym-app.mjs';
import { createMachineSettingsHost } from '../../../m3/w7-preview/today/machine-settings-host.mjs';
import Today from '../../../m3/w7-preview/today/today-model.cjs';
import design from '../../../m3/w7-preview/today/design.cjs';

const outcomes = [];
async function until(check, label) { const end = Date.now() + 5000; while (!check()) { assert(Date.now() < end, label); await new Promise(r => setTimeout(r, 1)); } }
async function device() {
  const fault = faultDatabase(), today = Today.createTodayModel({}), day = Today.SYNTHETIC_DAY;
  const gym = await createGymHost({ day, engineState: today.stateFromOps(), indexedDB: fault.indexedDB, crypto: webcrypto, plannedSplitSlotId: 'earned-today-preview/' + day });
  const settings = await createMachineSettingsHost({ day, indexedDB: fault.indexedDB, crypto: webcrypto });
  const model = createGymModel({ gymHost: gym, sessionTitle: today.read().workout.title });
  await model.start();
  const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()), { url: 'http://localhost/' });
  const doc = dom.window.document;
  const k = { fault, gym, settings, model, dom, doc, mounted: null,
    pick: slot => doc.querySelector('#phone [data-slot="' + slot + '"]'),
    click: selector => { const el = doc.querySelector('#phone ' + selector); assert(el, selector); el.click(); },
    async snapshot() { const c = (await settings.repository.load()).generation.collections; return structuredClone({ ops: c.ops || {}, outbox: c.outbox || {} }); },
    pairs: () => [...doc.querySelectorAll('[data-slot="settings-list"] .row')].map(r => [r.querySelector('strong').textContent, r.querySelector('span').textContent]),
    type(value) { const box = doc.querySelector('[data-settings-value="0"]'); box.value = value; box.dispatchEvent(new dom.window.Event('input', { bubbles: true })); },
    name(value) { const box = doc.querySelector('[data-settings-name="0"]'); box.value = value; box.dispatchEvent(new dom.window.Event('input', { bubbles: true })); },
    async open() { const old = this.pick('settings-editor'); this.click('[data-action="settings-open"]'); await until(() => this.pick('settings-editor') !== old && !this.pick('settings-editor').hidden, 'new editor ready'); },
    async cancel() { this.click('[data-action="settings-cancel"]'); await until(() => this.pick('settings-editor').hidden, 'cancel settled'); },
    close() { dom.window.close(); settings.close(); gym.close(); },
  };
  k.mount = async (options = {}) => {
    k.mounted = mountGym(doc, doc.getElementById('phone'), { model, settings, onBack() {}, ...options });
    await k.mounted; if (!options.pendingRead) await k.mounted.settings.read();
  };
  return k;
}

// Independent closure of the baseline witness, followed by actual valid retry and reset.
{
  const k = await device(), gate = deferred(), entered = deferred(); let held = false;
  try {
    await k.mount({ model: { ...k.model, async read() { const result = await k.model.read(); if (held) { entered.resolve(); await gate.promise; } return result; } } });
    await k.open(); k.name('Seat'); const before = await k.snapshot();
    held = true; k.click('[data-action="settings-add"]'); await entered.promise;
    k.click('[data-slot="settings-save"]'); await k.mounted.settings.pending();
    assert.equal(k.pick('settings-error').textContent, SETTINGS_REFUSED);
    const old = k.pick('settings-editor'); held = false; gate.resolve();
    await until(() => k.pick('settings-editor') !== old, 'held repaint finishes');
    assert.equal(k.pick('settings-error').textContent, SETTINGS_REFUSED);
    assert.deepEqual(await k.snapshot(), before);
    assert.equal(k.doc.querySelector('[data-settings-name="0"]').value, 'Seat');
    await k.cancel(); await k.open(); assert.equal(k.pick('settings-error').textContent, '', 'cancel/new draft clears refusal');
    k.name('Seat'); k.type('four'); k.click('[data-slot="settings-save"]'); await k.mounted.settings.pending();
    await until(() => k.pick('settings-editor').hidden, 'valid save closes');
    assert.deepEqual(k.pairs(), [['Seat', 'four']]);
    const after = await k.snapshot();
    assert.equal(Object.keys(after.ops).length, Object.keys(before.ops).length + 1);
    assert.equal(Object.keys(after.outbox).length, Object.keys(before.outbox).length + 1);
    await k.open(); assert.equal(k.pick('settings-error').textContent, '', 'successful save/new draft clears refusal');
    outcomes.push('held refusal, cancel/new draft reset, valid save exactly once, success reset');
  } finally { held = false; gate.resolve(); k.close(); }
}

// Delayed results come from a real successful write or a real IndexedDB quota refusal.
for (const fail of [true, false]) {
  const k = await device(), gate = deferred(), entered = deferred();
  try {
    await k.mount({ settings: { ...k.settings, async save(machine) {
      if (fail) { k.fault.state.armed = true; k.fault.state.mode = 'quota'; }
      const result = await k.settings.save(machine); k.fault.state.armed = false;
      assert.equal(result.ok, !fail, 'real transaction outcome'); entered.resolve(); await gate.promise; return result;
    } } });
    const before = await k.snapshot(); await k.open(); k.name('Seat'); k.type('four');
    k.click('[data-slot="settings-save"]'); await entered.promise;
    await k.cancel(); await k.open(); k.name('Seat'); k.type('nine');
    gate.resolve(); await k.mounted.settings.pending();
    assert.equal(k.pick('settings-editor').hidden, false);
    assert.equal(k.doc.querySelector('[data-settings-value="0"]').value, 'nine');
    assert.equal(k.pick('settings-error').textContent, '');
    const after = await k.snapshot();
    assert.equal(Object.keys(after.ops).length, Object.keys(before.ops).length + (fail ? 0 : 1));
    assert.equal(Object.keys(after.outbox).length, Object.keys(before.outbox).length + (fail ? 0 : 1));
    outcomes.push('old real ' + (fail ? 'quota refusal' : 'committed success') + ' isolated from replacement draft');
  } finally { k.fault.state.armed = false; gate.resolve(); k.close(); }
}

// Actual producer/encrypted repository result is held, then released unchanged.
{
  const k = await device(), gate = deferred(), entered = deferred();
  try {
    const view = await k.model.read();
    assert.equal((await k.settings.save({ exercise_id: view.lift.id, settings: [{ name: 'Seat', value: 'five' }] })).ok, true);
    const before = await k.snapshot(); let actual;
    await k.mount({ pendingRead: true, settings: { ...k.settings, async latest(id) { actual = await k.settings.latest(id); entered.resolve(); await gate.promise; return actual; } } });
    await entered.promise;
    assert.equal(k.pick('settings-block').hidden, false, 'old openCard visible-block condition is already satisfied');
    assert(k.pick('settings-block').textContent.includes(SETTINGS_READING));
    assert.equal(k.doc.querySelector('[data-action="settings-open"]').disabled, true, 'new readiness condition remains false');
    assert.equal(k.pick('log').disabled, false, 'optional settings never block Log');
    assert.deepEqual(k.pairs(), [], 'no durable figure is guessed while pending');
    gate.resolve(); await k.mounted.settings.read();
    assert.equal(k.doc.querySelector('[data-action="settings-open"]').disabled, false);
    assert.deepEqual(k.pairs(), [['Seat', 'five']]); assert.deepEqual(await k.snapshot(), before);
    outcomes.push('real saved read: pending visibility differs from readiness; exact record restored without write');
  } finally { gate.resolve(); k.close(); }
}

// Failed and honestly empty reads stay distinguishable by the harness predicate.
for (const fail of [true, false]) {
  const k = await device();
  try {
    await k.mount({ settings: { ...k.settings, async latest(id) { if (fail) throw new Error('D2 controlled read failure'); return k.settings.latest(id); } } });
    assert.equal(k.doc.querySelector('[data-action="settings-open"]').disabled, fail);
    assert.deepEqual(k.pairs(), []);
    if (fail) assert(k.pick('settings-block').textContent.includes(SETTINGS_UNREAD));
    else assert.throws(() => assert.deepEqual(k.pairs(), [['Seat', 'five']]), 'known empty must still fail existing data equality');
    outcomes.push(fail ? 'failed read cannot satisfy readiness' : 'known empty can be ready but fails saved-data equality');
  } finally { k.close(); }
}
console.log(JSON.stringify({ case: 'D2-LAUNCH-SETTINGS', cases: outcomes.length, passed: outcomes }));
