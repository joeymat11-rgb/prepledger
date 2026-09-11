import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import app from '../today-app.cjs';
import TodayModel from '../today-model.cjs';
import design from '../design.cjs';
import Athlete from '../../../../m4/workout/athlete-state.cjs';

const { createTodayModel, engineClockFor, SYNTHETIC_DAY } = TodayModel;
function mount(model) {
  const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()), { url: 'http://127.0.0.1/' });
  const doc = dom.window.document, api = app.mountToday(doc, model);
  api.render('nutrition');
  return { dom, doc, api, rows: () => [...doc.querySelectorAll('#phone .macro-row')],
    footer: () => doc.querySelector('#phone [data-slot="stub-note"]').textContent };
}
function labels(kit) {
  assert.deepEqual(kit.rows().map(row => row.querySelector('strong').textContent), ['Energy', 'Protein', 'Carbohydrate', 'Fat']);
  assert.doesNotMatch(kit.doc.getElementById('phone').textContent, /not prescribed/i);
}
function unavailable(row, reason) {
  assert.equal(row.querySelector('.number'), null);
  assert.match(row.querySelector('.row').textContent, /not available|unavailable/i);
  if (reason) assert.equal(row.querySelector('p').textContent, reason);
}
function boundaryModel(change) {
  const actual = createTodayModel({ today: SYNTHETIC_DAY }), view = actual.read();
  // Explicit presentation-boundary controls; retained numeric values still come
  // from the actual synthetic engine projection, not invented recommendations.
  return { actual: view, model: { ...actual, read: () => change(structuredClone(view)) } };
}

test('fresh owner producer renders four unknown fields as unavailable with its configuration reason', () => {
  const day = '2026-09-11';
  const basisState = Athlete.createCleanInitState({ setup: { athlete_label: 'synthetic-nutrition-copy',
    split: { from: day, map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'REST', 5: 'U', 6: 'REST' } },
    exercises: [{ id: 'synthetic-press', n: 'Synthetic press', mg: 'chest', day: 'U', sets: 1, hi: 10, inc: 5, steps: [20, 25] }], priority_muscles: [] } });
  const model = createTodayModel({ mode: 'owner', today: day, basisState, engineClock: engineClockFor(day) });
  const view = model.read(), kit = mount(model);
  labels(kit);
  unavailable(kit.rows()[0], view.calorieTarget.why); unavailable(kit.rows()[1], view.proteinTarget.why);
  unavailable(kit.rows()[2]); unavailable(kit.rows()[3]);
  assert.equal(kit.doc.querySelectorAll('#phone .number').length, 0);
  assert.doesNotMatch(kit.footer(), /above are today's engine targets/);
  kit.dom.window.close();
});

test('available energy retains engine rounding and full range when protein is unavailable', () => {
  const reason = 'Protein evidence is unavailable in this boundary fixture.';
  const { actual, model } = boundaryModel(view => ({ ...view, proteinTarget: { g: null, why: reason } }));
  const kit = mount(model); labels(kit);
  const energy = kit.rows()[0];
  assert.equal(energy.querySelector('.number').textContent, app.calorieHeadline(actual.calorieTarget));
  assert.equal(energy.querySelector('.unit').textContent, ' kcal');
  assert.equal(energy.querySelector('p').textContent, app.calorieBand(actual.calorieTarget));
  unavailable(kit.rows()[1], reason); unavailable(kit.rows()[2]); unavailable(kit.rows()[3]);
  assert.doesNotMatch(kit.footer(), /Energy and protein above are today's engine targets/);
  kit.dom.window.close();
});

test('gated energy retains its refusal and suppresses stale numbers without hiding available protein', () => {
  const reason = 'Energy evidence is gated in this boundary fixture.';
  const { actual, model } = boundaryModel(view => ({ ...view, calorieTarget: { ...view.calorieTarget, gated: true, why: reason } }));
  const kit = mount(model); labels(kit);
  unavailable(kit.rows()[0], reason);
  const protein = kit.rows()[1];
  assert.equal(protein.querySelector('.number').textContent, new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(actual.proteinTarget.g));
  assert.equal(protein.querySelector('.unit').textContent, ' g');
  assert.equal(protein.querySelector('p').textContent, 'Your daily protein target.');
  assert.doesNotMatch(kit.rows()[0].textContent, new RegExp(app.calorieHeadline(actual.calorieTarget)));
  kit.dom.window.close();
});

test('missing target objects use unavailable fallbacks and preserve all four fields', () => {
  const { model } = boundaryModel(view => ({ ...view, calorieTarget: null, proteinTarget: null }));
  // Start from a normal view because Today itself has a separate existing DTO
  // contract; this boundary case targets only the nutrition renderer.
  const normal = createTodayModel({ today: SYNTHETIC_DAY });
  let nutrition = false;
  const kit = mount({ ...normal, read: () => nutrition ? model.read() : normal.read() });
  nutrition = true; kit.api.render('nutrition'); labels(kit);
  for (const row of kit.rows()) unavailable(row);
  assert.doesNotMatch(kit.rows().map(row => row.textContent).join(' '), /\d/, 'missing fields cannot borrow numerical guidance from another part of the view');
  kit.dom.window.close();
});

test('actual blocked model exposes its refusal after available nutrition and leaves no stale targets', () => {
  let paint = 'TRUTHFUL';
  const refusal = 'This local record could not be verified. Restore your record to continue.';
  const readings = { reads: () => [], paint: () => paint, face: () => ({ state: 18 }),
    blockedCopy: () => refusal, label: () => '', outboxRetained: () => true };
  const model = createTodayModel({ today: SYNTHETIC_DAY, readings }), kit = mount(model);
  assert.equal(kit.doc.querySelectorAll('#phone .number').length, 2);
  paint = 'BLOCKED'; assert.equal(model.read().blocked, true);
  kit.api.render('nutrition'); labels(kit);
  for (const row of kit.rows()) unavailable(row);
  assert.equal(kit.footer(), refusal);
  assert.equal(kit.doc.querySelectorAll('#phone .number').length, 0);
  kit.dom.window.close();
});
