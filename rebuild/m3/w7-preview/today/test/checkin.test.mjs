// A3 — the recovery check-in, end to end over the REAL stack.
//
// Real here: the encrypted repository (AES-GCM over fake-indexeddb, the same storage
// the browser uses), the accepted T2 stage over rebuild/client, the accepted durable
// public client, and the operation envelope rebuild/client/ops.cjs builds. Nothing is
// stubbed; the check-in's ONLY addition to that stack is its closed command producer,
// which the accepted stage takes as an argument.
//
// Synthetic and labelled: the athlete (rebuild/m3/w7-preview/fixtures.cjs), the device
// keys, the lease — the same three the gym card and the weigh-in use.
import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { createCheckInHost, CHECKIN_SCHEMA_VERSION } from '../checkin-host.mjs';
import { DATABASE as LOCAL_DATABASE, NAMESPACE as LOCAL_NAMESPACE, createGymHost } from '../gym-host.mjs';
import { createReadingHost } from '../reading-host.mjs';
import { createWorkoutEntry } from '../today-entry.mjs';
import CheckInCommands from '../checkin-commands.cjs';
import Model from '../checkin-model.mjs';
import { createCheckInDraft, createCheckInModel, sleepNightFor, recordedLines, dayBefore } from '../checkin-model.mjs';
import { mountCheckIn } from '../checkin-app.mjs';
import { createCheckInEntry } from '../today-entry.mjs';
import TodayApp from '../today-app.cjs';
import TodayModel from '../today-model.cjs';
import Fixtures from '../../fixtures.cjs';
import design from '../design.cjs';

const { mountToday } = TodayApp;
const { createTodayModel, SYNTHETIC_DAY } = TodayModel;
const { createSyntheticState } = Fixtures;
const DAY = SYNTHETIC_DAY;
const NEXT_DAY = (() => {
  const [y, m, d] = DAY.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
})();

/* ONE device: one IndexedDB factory, which is one installation of the local era,
   reopened across "relaunches" exactly as a real browser reopens its own storage.
   C4c: no key is minted here — the page does not take one, and the check-in now
   opens the SAME installation the weigh-in and the workout do. */
async function device() {
  const fault = faultDatabase();
  const open = (day = DAY) => createCheckInHost({ day, indexedDB: fault.indexedDB, crypto: webcrypto });
  return { fault, open, host: await open() };
}
const opsOf = async repository => Object.values((await repository.load()).generation.collections.ops || {});
const outboxOf = async repository => Object.values((await repository.load()).generation.collections.outbox || {});
/* A state with NO sleep night for the night before `day`, so the ask-for-it branch
   can be exercised beside the confirm-it one. */
function stateWithoutLastNight(day = DAY) {
  const state = createSyntheticState(day);
  state.sleep.nights = state.sleep.nights.filter(n => n.d !== dayBefore(day));
  return state;
}

/* ==========================================================================
   1. THE SHEET. Pure, no storage: the four laws of the approved notes.
   ========================================================================== */
test('A3 — every answer starts unselected, and blank stays blank', () => {
  const draft = createCheckInDraft();
  const state = draft.state();
  for (const value of Object.values(state.choices)) assert.equal(value, null, 'no answer is preselected');
  for (const value of Object.values(state.issues)) assert.equal(value, false, 'no issue is preselected');
  for (const value of Object.values(state.fields)) assert.equal(value, '', 'no field is prefilled');
  for (const open of Object.values(state.followups)) assert.equal(open, false, 'no detail branch is open');
  /* A sheet nobody touched is not a fact about anything. It refuses rather than
     storing an empty record, and it certainly never stores "none" or zero. */
  const built = draft.answers();
  assert.equal(built.ok, false);
  assert.equal(built.copy, Model.NOTHING_ANSWERED);
});

test('A3 — tapping a selected answer again clears it', () => {
  const draft = createCheckInDraft();
  assert.equal(draft.choose('energy', 'Low'), 'Low');
  assert.equal(draft.state().choices.energy, 'Low');
  assert.equal(draft.choose('energy', 'Low'), null, 'the same answer again clears it');
  assert.equal(draft.state().choices.energy, null);
  // A different answer replaces it; it does not accumulate.
  draft.choose('energy', 'Low');
  draft.choose('energy', 'High');
  assert.equal(draft.state().choices.energy, 'High');
  // Cleared means ABSENT from the record, never "none".
  draft.choose('energy', 'High');
  draft.choose('stress', 'Moderate');
  const built = draft.answers();
  assert.equal(built.ok, true);
  assert.deepEqual(Object.keys(built.answers), ['stress']);
  assert.equal(Object.hasOwn(built.answers, 'energy'), false, 'a cleared answer is absent, not null');
});

test('A3 — "None" is an answer the athlete gave, and silence is not', () => {
  const answered = createCheckInDraft();
  answered.choose('soreness', 'None');
  assert.deepEqual(answered.answers().answers, { soreness: 'None' });
  const silent = createCheckInDraft();
  silent.choose('stress', 'Low');
  assert.equal(Object.hasOwn(silent.answers().answers, 'soreness'), false,
    'an untouched soreness question is not a report of no soreness');
  // The same for the issue row: not pressing "Pain" is silence, never a denial.
  assert.equal(Object.hasOwn(silent.answers().answers, 'issues'), false);
});

test('A3 — the conditional detail branches exactly as the approved notes list them', () => {
  const draft = createCheckInDraft();
  assert.equal(draft.state().followups.soreness, false);
  draft.choose('soreness', 'None');
  assert.equal(draft.state().followups.soreness, false, 'None has no location and no impact to give');
  draft.choose('soreness', 'Mild');
  assert.equal(draft.state().followups.soreness, true, 'soreness asks location and functional impact');
  draft.set('soreness_location', 'quads and glutes');
  draft.set('soreness_impact', 'A little');

  for (const [issue, fields] of [['pain', ['pain_location', 'pain_change', 'pain_impact']],
    ['illness', ['illness_note']], ['away', ['away_days', 'away_reason']]]) {
    assert.equal(draft.state().followups[issue], false);
    assert.equal(draft.toggleIssue(issue), true);
    assert.equal(draft.state().followups[issue], true, issue + ' opens its own detail');
    assert(fields.every(f => Object.hasOwn(draft.state().fields, f)), issue + ' asks exactly its own fields');
  }
  draft.set('pain_location', 'left knee, on the press');
  draft.set('pain_change', 'New');
  draft.set('pain_impact', 'I change how I move');
  draft.set('illness_note', 'sore throat since yesterday');
  draft.set('away_days', '3');
  draft.set('away_reason', 'travel');

  const built = draft.answers();
  assert.equal(built.ok, true);
  assert.deepEqual(built.answers.issues, ['pain', 'illness', 'away']);
  assert.equal(built.answers.pain_change, 'New');
  assert.equal(built.answers.pain_impact, 'I change how I move');
  /* The SHEET hands over the athlete's own number; the envelope law's {value, unit}
     is applied by the closed command, once, where the operation is built. */
  assert.equal(built.answers.away_days, 3);
  assert.deepEqual(CheckInCommands.answersOf(built.answers).away_days, { value: 3, unit: 'day' });
  /* Pain is asked SEPARATELY from muscle soreness, and each keeps its own answers. */
  assert.equal(built.answers.soreness, 'Mild');
  assert.equal(built.answers.soreness_location, 'quads and glutes');
  assert.notEqual(built.answers.pain_location, built.answers.soreness_location);
  /* No numerical pain score exists anywhere in the model or in the stored shape. */
  assert.equal(Object.keys(built.answers).some(k => /score|rating|severity|readiness/i.test(k)), false);
});

test('A3 — a cleared issue\'s hidden detail is never submitted', () => {
  const draft = createCheckInDraft();
  draft.toggleIssue('pain');
  draft.set('pain_location', 'left knee');
  draft.set('pain_change', 'New');
  draft.choose('soreness', 'Significant');
  draft.set('soreness_location', 'quads');
  draft.choose('energy', 'Low');

  draft.toggleIssue('pain');                       // deselect
  assert.equal(draft.state().fields.pain_location, '', 'the hidden detail is gone, not merely hidden');
  draft.choose('soreness', 'Significant');         // clear soreness
  assert.equal(draft.state().fields.soreness_location, '');

  const built = draft.answers();
  assert.deepEqual(built.answers, { energy: 'Low' });
  /* And the door refuses it again even if a caller reconstructs it by hand. */
  assert.throws(() => CheckInCommands.answersOf({ energy: 'Low', pain_location: 'left knee' }),
    /CHECKIN_INPUT_INVALID/);
  assert.throws(() => CheckInCommands.answersOf({ soreness: 'None', soreness_location: 'quads' }),
    /CHECKIN_INPUT_INVALID/);
});

test('A3 — the form bounds refuse in words and record nothing', () => {
  const draft = createCheckInDraft();
  draft.set('sleep_hours', '30');
  assert.deepEqual(draft.answers(), { ok: false, copy: Model.HOURS_OUT_OF_RANGE });
  draft.set('sleep_hours', 'eight');
  assert.deepEqual(draft.answers(), { ok: false, copy: Model.HOURS_OUT_OF_RANGE });
  draft.set('sleep_hours', '7.5');
  assert.deepEqual(draft.answers().answers, { sleep_hours: 7.5, sleep_hours_source: 'entered' });
  draft.toggleIssue('away');
  draft.set('away_days', '2.5');
  assert.deepEqual(draft.answers(), { ok: false, copy: Model.DAYS_INVALID });
});

/* ==========================================================================
   2. THE DURABLE LANE.
   ========================================================================== */
test('A3 — a check-in is ONE dated operation of the accepted envelope', async () => {
  const kit = await device();
  assert.deepEqual(await opsOf(kit.host.repository), [], 'a fresh device holds no check-in');
  assert.deepEqual(await kit.host.forDate(DAY), []);

  const result = await kit.host.save({ energy: 'Low', soreness: 'Mild', soreness_location: 'quads',
    stress: 'High', sleep_quality: 'Poor', sleep_hours: 6.5, sleep_hours_source: 'entered' });
  assert.equal(result.ok, true, result.copy || result.code);

  const ops = await opsOf(kit.host.repository);
  assert.equal(ops.length, 1, 'one check-in is one operation');
  const op = ops[0];
  assert.equal(op.kind, 'fact');
  assert.equal(op.class, 'event');
  assert.equal(op.effective.local_date, DAY);
  assert.equal(op.schema_version, CHECKIN_SCHEMA_VERSION);
  assert.equal(op.payload.profile, CheckInCommands.PROFILE);
  assert.equal(typeof op.canonical_content_commitment, 'string');
  /* Every quantity is {value, unit}, as the A3 envelope requires. */
  assert.deepEqual(op.payload.answers.sleep_hours, { value: 6.5, unit: 'h' });
  /* NOTHING numeric is derived from a choice: the payload holds the athlete's own
     words and the two quantities they entered, and no other number at all. */
  const numbers = JSON.stringify(op.payload.answers).match(/\d+(\.\d+)?/g) || [];
  assert.deepEqual(numbers, ['6.5'], 'no score, index or weight is derived from an answer');

  const rows = await kit.host.forDate(DAY);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].date, DAY);
  assert.equal(rows[0].time, '08:00', 'the provenance time is the engine clock, not the renderer');
  kit.host.close();
});

test('A3 — the check-in survives a reload, a new host and a relaunch', async () => {
  const kit = await device();
  await kit.host.save({ energy: 'Moderate', note: 'slept badly, legs fine' });
  await kit.host.restart();                        // the reload path
  assert.equal((await kit.host.forDate(DAY)).length, 1);
  kit.host.close();

  const again = await kit.open();                  // a brand new page over the same storage
  const rows = await again.forDate(DAY);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].answers.energy, 'Moderate');
  assert.equal(rows[0].answers.note, 'slept badly, legs fine');
  again.close();
});

test('A3 — a storage fault records NO part of the check-in', async () => {
  const kit = await device();
  const before = await opsOf(kit.host.repository);
  kit.fault.state.armed = true;
  kit.fault.state.mode = 'quota';
  const result = await kit.host.save({ energy: 'Low', stress: 'High', note: 'this must not survive' });
  kit.fault.state.armed = false;
  assert.equal(result.ok, false, 'a storage fault is reported, never swallowed');
  assert(result.code || result.copy, 'the refusal names a cause');
  assert.deepEqual(await opsOf(kit.host.repository), before, 'no operation survived the fault');
  assert.deepEqual(await outboxOf(kit.host.repository), [], 'no outbox entry survived the fault either');
  assert.deepEqual(await kit.host.forDate(DAY), []);
  // The same sheet still saves once the fault is gone: nothing was half-written.
  const retry = await kit.host.save({ energy: 'Low', stress: 'High' });
  assert.equal(retry.ok, true, retry.copy || retry.code);
  assert.equal((await opsOf(kit.host.repository)).length, 1);
  kit.host.close();
});

test('A3 — the operation and its outbox entry are one transaction', async () => {
  const kit = await device();
  await kit.host.save({ stress: 'Low' });
  const ops = await opsOf(kit.host.repository);
  const outbox = await outboxOf(kit.host.repository);
  assert.equal(ops.length, 1);
  assert.equal(outbox.length, 1, 'the outbox entry was written with the operation');
  assert.equal(outbox[0].op_id, ops[0].op_id);
  kit.host.close();
});

test('A3 — yesterday is never today, and a denial is never carried forward', async () => {
  const kit = await device();
  /* Day one: the athlete says, explicitly, that nothing else is affecting today and
     that there is no soreness. */
  await kit.host.save({ soreness: 'None', energy: 'High' });
  kit.host.close();

  /* Day two: a new page on the same device, standing on the next day. */
  const tomorrow = await kit.open(NEXT_DAY);
  assert.deepEqual(await tomorrow.forDate(NEXT_DAY), [], 'today starts blank');
  const all = await tomorrow.all();
  assert.equal(all.length, 1, 'yesterday is still on the device');
  assert.equal(all[0].date, DAY);

  const model = createCheckInModel({ host: tomorrow, day: NEXT_DAY, engineState: stateWithoutLastNight(NEXT_DAY) });
  await model.refresh();
  const view = model.read();
  assert.equal(view.recorded, null, 'yesterday\'s check-in is not today\'s');
  for (const value of Object.values(view.draft.choices)) assert.equal(value, null,
    'yesterday\'s answers do not pre-fill today\'s sheet');
  assert.equal(view.note, Model.NOTHING_YET);
  tomorrow.close();
});

test('A3 — today\'s check-in reads back with its provenance, and a second one is refused', async () => {
  const kit = await device();
  const model = createCheckInModel({ host: kit.host, day: DAY, engineState: stateWithoutLastNight() });
  await model.refresh();
  assert.equal(model.read().recorded, null);

  model.draft().choose('energy', 'Low');
  model.draft().choose('soreness', 'Significant');
  model.draft().set('soreness_location', 'quads');
  model.draft().set('soreness_impact', 'Quite a lot');
  const saved = await model.save();
  assert.equal(saved.ok, true, saved.copy);
  assert.equal(saved.copy, Model.PLAN_UNCHANGED, 'the screen states the plan consequence, not "saved"');

  const view = model.read();
  assert.equal(view.recorded.date, DAY);
  assert.equal(view.recorded.provenance, Model.RECORDED_AT_PREFIX + '08:00');
  assert.deepEqual(view.recorded.lines, [
    'Energy right now: Low',
    'Muscle soreness right now: Significant',
    'Which muscles?: quads',
    'Does it affect your usual movement?: Quite a lot',
  ]);
  /* Nothing on the read-back is an interpretation: every line is a question the
     approved design asks and an answer the athlete gave. */
  for (const line of view.recorded.lines) assert(/: /.test(line));

  const again = await model.save();
  assert.equal(again.ok, false);
  assert.equal(again.copy, Model.ALREADY_RECORDED);
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'the refusal wrote nothing');
  kit.host.close();
});

/* ==========================================================================
   3. SLEEP — reuse with provenance, and the seam.
   ========================================================================== */
test('A3 — an existing dated sleep night is reused with provenance, not asked for twice', async () => {
  const kit = await device();
  /* The fixture's athlete has a night for every day before today, so the night
     dated the day before this check-in is on file. The engine's own shape is the
     authority: rebuild/engine/sleep.cjs reads n.d and n.h. */
  const state = createTodayModel({ today: DAY }).stateFromOps();
  const night = sleepNightFor(state, DAY);
  assert(night, 'the athlete has a sleep night for last night');
  assert.equal(night.date, dayBefore(DAY));
  assert.equal(night.hours, 8);

  const model = createCheckInModel({ host: kit.host, day: DAY, engineState: state });
  await model.refresh();
  assert.deepEqual(model.read().sleepRecord, { date: dayBefore(DAY), hours: 8 });
  assert.equal(model.read().draft.askHours, false, 'the hours box is not shown while the record stands');

  /* Confirming reuses the record, and the stored fact names where it came from. */
  model.draft().confirmSleep();
  model.draft().choose('sleep_quality', 'Okay');
  const saved = await model.save();
  assert.equal(saved.ok, true, saved.copy);
  const row = (await kit.host.forDate(DAY))[0];
  assert.deepEqual(row.answers.sleep_hours, { value: 8, unit: 'h' });
  assert.equal(row.answers.sleep_hours_source, 'existing-record');
  assert.equal(row.answers.sleep_hours_record_date, dayBefore(DAY));
  assert.equal(row.answers.sleep_quality, 'Okay');
  assert.match(recordedLines(row)[0], /From your sleep record for /);

  /* SEAM S2, executed: the engine's sleep record is UNCHANGED. The check-in writes
     no sleep night, because rebuild/engine/writers.cjs exports no writer that could
     take one — applyRead is the only fact writer it offers, and it takes a weight.
     Sleep QUALITY has no field in the engine's night shape at all. */
  const after = createTodayModel({ today: DAY }).stateFromOps();
  assert.deepEqual(after.sleep.nights, state.sleep.nights, 'no sleep night was fabricated');
  assert.equal(Object.keys(state.sleep.nights[0]).includes('quality'), false);
  kit.host.close();
});

test('A3 — confirming is an answer, so tapping it again clears it', async () => {
  const record = { date: dayBefore(DAY), hours: 8 };
  const draft = createCheckInDraft({ sleepRecord: record });
  assert.equal(draft.state().askHours, false);
  draft.confirmSleep();
  assert.deepEqual(draft.answers().answers,
    { sleep_hours: 8, sleep_hours_source: 'existing-record', sleep_hours_record_date: record.date });
  draft.confirmSleep();
  assert.equal(draft.state().sleepConfirm, null);
  assert.equal(draft.answers().ok, false, 'an unconfirmed record is not an answer');
  /* Saying "No — answer it here" reveals the box and makes the entered value the
     source; the unconfirmed record is never stored. */
  draft.answerSleepHere();
  assert.equal(draft.state().askHours, true);
  draft.set('sleep_hours', '5');
  assert.deepEqual(draft.answers().answers, { sleep_hours: 5, sleep_hours_source: 'entered' });
});

test('A3 — with no dated night on file the question is simply asked', async () => {
  const model = createCheckInModel({ day: DAY, engineState: stateWithoutLastNight() });
  assert.equal(model.read().sleepRecord, null);
  assert.equal(model.read().draft.askHours, true);
});

/* ==========================================================================
   4. THE SCREEN, over the real lane.
   ========================================================================== */
function shell() {
  return design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml());
}
async function screen(options = {}) {
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  const phone = doc.getElementById('phone');
  const model = options.model;
  await model.refresh();
  mountCheckIn(doc, phone, { model, onBack: options.onBack || (() => {}), onChanged: options.onChanged });
  return { dom, doc, phone };
}
const text = doc => doc.getElementById('phone').textContent;
const options = doc => [...doc.querySelectorAll('#phone .option')];
const byLabel = (doc, label) => options(doc).find(b => b.textContent.trim() === label);
async function settle() { for (let i = 0; i < 50; i++) await new Promise(r => setTimeout(r, 2)); }

test('A3 — the screen shows the approved questions, all blank, and records what is tapped', async () => {
  const kit = await device();
  const model = createCheckInModel({ host: kit.host, day: DAY, engineState: stateWithoutLastNight() });
  const { doc } = await screen({ model });

  for (const heading of ['A quick check-in.', 'Last night’s sleep', 'Energy right now',
    'Muscle soreness right now', 'Stress right now', 'Anything else affecting today?']) {
    assert(text(doc).includes(heading), heading);
  }
  for (const button of options(doc)) assert.equal(button.getAttribute('aria-pressed'), 'false');
  for (const select of doc.querySelectorAll('#phone select')) assert.equal(select.value, '');
  for (const input of doc.querySelectorAll('#phone input, #phone textarea')) assert.equal(input.value, '');
  assert(text(doc).includes(Model.NOTHING_YET));
  /* Every conditional block is closed until the answer that opens it is given. */
  for (const block of doc.querySelectorAll('#phone [data-follow]')) assert.equal(block.hidden, true);

  byLabel(doc, 'Mild').click();
  assert.equal(byLabel(doc, 'Mild').getAttribute('aria-pressed'), 'true');
  assert.equal(doc.querySelector('#phone [data-follow="soreness"]').hidden, false);
  byLabel(doc, 'Mild').click();
  assert.equal(byLabel(doc, 'Mild').getAttribute('aria-pressed'), 'false', 'a second tap clears it');
  assert.equal(doc.querySelector('#phone [data-follow="soreness"]').hidden, true);

  byLabel(doc, 'Pain').click();
  const painBlock = doc.querySelector('#phone [data-follow="pain"]');
  assert.equal(painBlock.hidden, false);
  assert(painBlock.textContent.includes('Keep pain separate from ordinary muscle soreness.'));
  doc.querySelector('#pain-location').value = 'left knee, on the press';
  doc.querySelector('#pain-location').dispatchEvent(new (doc.defaultView.Event)('input', { bubbles: true }));
  byLabel(doc, 'High').click();                     // energy High (the first High is energy)

  doc.querySelector('#phone [data-slot="primary"]').click();
  await settle();
  const rows = await kit.host.forDate(DAY);
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0].answers.issues, ['pain']);
  assert.equal(rows[0].answers.pain_location, 'left knee, on the press');
  assert.equal(Object.hasOwn(rows[0].answers, 'soreness'), false, 'the cleared answer was not stored');
  assert(text(doc).includes(Model.RECORDED_AT_PREFIX), 'the screen reads back with provenance');
  assert(text(doc).includes(Model.PLAN_UNCHANGED), 'the screen states the plan consequence');
  for (const button of options(doc)) assert.equal(button.disabled, true, 'a recorded check-in is not re-answered');
  /* No readiness word, no score, anywhere on screen. */
  assert.doesNotMatch(text(doc), /readiness|score|out of|\/10|points/i);
  kit.host.close();
});

test('A3 — a refused check-in says why, on screen, and stores nothing', async () => {
  const kit = await device();
  const model = createCheckInModel({ host: kit.host, day: DAY, engineState: stateWithoutLastNight() });
  const { doc } = await screen({ model });
  doc.querySelector('#phone [data-slot="primary"]').click();
  await settle();
  assert.equal(doc.querySelector('#checkin-error').textContent, Model.NOTHING_ANSWERED);
  assert.deepEqual(await opsOf(kit.host.repository), []);

  doc.querySelector('#sleep-hours').value = '99';
  doc.querySelector('#sleep-hours').dispatchEvent(new (doc.defaultView.Event)('input', { bubbles: true }));
  doc.querySelector('#phone [data-slot="primary"]').click();
  await settle();
  assert.equal(doc.querySelector('#checkin-error').textContent, Model.HOURS_OUT_OF_RANGE);
  assert.deepEqual(await opsOf(kit.host.repository), []);
  kit.host.close();
});

test('A3 — the sleep record is offered for confirmation on screen, with its date', async () => {
  const kit = await device();
  const state = createTodayModel({ today: DAY }).stateFromOps();
  const model = createCheckInModel({ host: kit.host, day: DAY, engineState: state });
  const { doc } = await screen({ model });
  const known = doc.querySelector('#phone [data-slot="sleep-known"]');
  assert.equal(known.hidden, false);
  assert(known.textContent.includes(Model.SLEEP_KNOWN_LEAD));
  assert(known.textContent.includes(dayBefore(DAY)), 'the record\'s own date is shown');
  assert.equal(doc.querySelector('#phone [data-slot="sleep-ask"]').hidden, true, 'it is not asked twice');

  doc.querySelector('#phone [data-confirm="reject"]').click();
  assert.equal(doc.querySelector('#phone [data-slot="sleep-ask"]').hidden, false);
  doc.querySelector('#phone [data-confirm="sleep"]').click();
  assert.equal(doc.querySelector('#phone [data-confirm="sleep"]').getAttribute('aria-pressed'), 'true');
  doc.querySelector('#phone [data-slot="primary"]').click();
  await settle();
  const row = (await kit.host.forDate(DAY))[0];
  assert.equal(row.answers.sleep_hours_source, 'existing-record');
  kit.host.close();
});

/* ==========================================================================
   5. TODAY AND THE WORKOUT FLOW reach the check-in.
   ========================================================================== */
test('A3 — the check-in is reachable from Today, and Today reports the durable fact', async () => {
  const kit = await device();
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  const today = createTodayModel({ today: DAY });
  const entry = await createCheckInEntry(today,
    { indexedDB: kit.fault.indexedDB, crypto: webcrypto, deviceKeys: kit.keys });
  const api = mountToday(doc, today, { checkin: entry });
  entry.setOnRefresh(() => { if (api.screen() === 'today') api.render('today'); });

  const state = () => doc.querySelector('[data-slot="recovery-state"]').textContent;
  assert.equal(state(), '', 'nothing recorded says nothing at all');
  doc.querySelector('[data-go="recovery"]').click();
  assert(text(doc).includes('A quick check-in.'));

  entry.checkin.draft().choose('stress', 'High');
  doc.querySelector('#phone [data-slot="primary"]').click();
  await settle();
  assert(text(doc).includes(Model.RECORDED_AT_PREFIX), 'the check-in reads itself back');
  doc.querySelector('#phone [data-go="today"]').click();   // the approved back control
  assert.equal(state(), TodayApp.CHECKIN_RECORDED_TODAY, 'Today reports what the lane holds');
  entry.host.close();
});

/* A3 review F7 — BACK RETURNS WHERE THE ATHLETE CAME FROM. Entered from Today it goes
   back to Today; entered mid-set it goes back to that set, with the workout still in
   progress and what was typed into it still there. */
test('A3 — back from the check-in returns to where the athlete came from', async () => {
  const kit = await device();
  const lane = { indexedDB: kit.fault.indexedDB, crypto: webcrypto, deviceKeys: kit.keys };
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  const today = createTodayModel({ today: DAY });
  const workout = await createWorkoutEntry(today, lane);
  const entry = await createCheckInEntry(today, lane);
  const api = mountToday(doc, today, { workout, checkin: entry });

  /* From TODAY: back lands on Today. */
  doc.querySelector('[data-go="recovery"]').click();
  assert.equal(api.screen(), 'recovery');
  doc.querySelector('#phone [data-go="today"]').click();
  await settle();
  assert.equal(api.screen(), 'today');
  assert(doc.querySelector('[data-slot="recovery-state"]'), 'Today is on screen');

  /* From the ACTIVE SET: the card is opened, a weight is typed but not logged, the
     check-in is reached from the card's own approved route, and back lands on the
     same set with the typed value intact. */
  api.render('workout', true);
  await settle();
  const weight = doc.querySelector('#gym-weight');
  assert(weight, 'the gym card is on screen');
  const before = await opsOf(workout.gymHost.repository);
  weight.value = '47.5';
  weight.dispatchEvent(new (dom.window.Event)('input', { bubbles: true }));

  const route = doc.querySelector('#phone [data-action="checkin"]');
  assert(route, 'the card carries the route');
  assert.equal(route.hidden, false, 'the route is shown when the page supplies it');
  route.click();
  await settle();
  assert.equal(api.screen(), 'recovery');
  assert(text(doc).includes('A quick check-in.'));

  doc.querySelector('#phone [data-go="today"]').click();
  await settle();
  assert.equal(api.screen(), 'workout', 'back returned to the workout, not to Today');
  assert(doc.querySelector('#gym-weight'), 'the active set is on screen again');
  assert.equal(doc.querySelector('#gym-weight').value, '47.5',
    'the half-entered set survived the trip to the check-in');
  const afterOps = await opsOf(workout.gymHost.repository);
  assert.equal(afterOps.filter(o => o.kind === 'session-set').length, 0,
    'navigating to the check-in and back logs no set');
  assert.equal(afterOps.filter(o => o.kind === 'session-start').length,
    before.filter(o => o.kind === 'session-start').length + (before.length ? 0 : 1),
    'navigating never starts a second session');

  /* And the origin does not stick: entering again from Today goes back to Today. */
  doc.querySelector('#phone [data-action="back"]').click();
  await settle();
  assert.equal(api.screen(), 'today');
  doc.querySelector('[data-go="recovery"]').click();
  doc.querySelector('#phone [data-go="today"]').click();
  await settle();
  assert.equal(api.screen(), 'today', 'the workout origin was not inherited');

  workout.gymHost.close();
  entry.host.close();
});

/* A3 review F1 — the approved recovery vocabulary is HARVESTED from the pinned
   approved bytes, not listed by hand, and every harvested string must be on the
   shipped screen. The first build of this screen dropped six of the seven approved
   placeholders precisely because a placeholder is an attribute and no hand list
   mentioned it. */
test('A3 — every approved word of the recovery screen is on the shipped screen', async () => {
  const approved = design.readApproved();
  const vocabulary = design.recoveryVocabulary(approved);
  assert.deepEqual(vocabulary.placeholders, ['—', 'For example, quads and glutes',
    'Location and movement', 'What you have noticed', 'Days', 'Optional',
    'What else should your coach know?'], 'the harvest really reads the approved bytes');
  assert.equal(vocabulary.legends.length, 5);
  assert.equal(vocabulary.labels.length, 10);
  assert.equal(vocabulary.options.length, 12);
  assert.equal(vocabulary.choices.length, 12);

  const report = design.assertRecoveryBinding(approved, design.templateHtml());
  assert.deepEqual(report, { placeholders: 7, options: 12, labels: 10, legends: 5, choices: 12 });

  /* RED FIRST: dropping any ONE of them fails, so this can never pass by accident. */
  const template = design.templateHtml();
  for (const value of vocabulary.placeholders.filter(v => v !== '—')) {
    assert.throws(() => design.assertRecoveryBinding(approved,
      template.replace(` placeholder="${value}"`, '')), /APPROVED-RECOVERY FAIL/, value);
  }
  /* replaceAll, because several approved words appear on more than one question
     ("Leave unanswered", "Not sure"): removing one occurrence would leave the others
     to satisfy the check and the mutation would prove nothing. */
  for (const value of [...vocabulary.options, ...vocabulary.labels, ...vocabulary.legends,
    ...vocabulary.choices]) {
    assert.throws(() => design.assertRecoveryBinding(approved,
      template.replaceAll('>' + value + '<', '>x<')), /APPROVED-RECOVERY FAIL/, value);
  }

  /* And they are really RENDERED, not merely present in the template file. */
  const kit = await device();
  const model = createCheckInModel({ host: kit.host, day: DAY, engineState: stateWithoutLastNight() });
  const { doc } = await screen({ model });
  const shown = [...doc.querySelectorAll('#phone [placeholder]')].map(el => el.getAttribute('placeholder'));
  for (const value of vocabulary.placeholders) {
    assert(shown.includes(value), 'the approved placeholder is not on screen: ' + value);
  }
  kit.host.close();
});

test('A3 — the workout flow carries the approved route to the check-in', () => {
  const template = design.templateHtml();
  const gym = template.slice(template.indexOf('<template id="t-gym">'), template.indexOf('<template id="t-rest">'));
  assert(gym.includes('data-action="checkin"'), 'the gym card carries the route');
  assert(gym.includes('How are you feeling today?'), 'in the approved design\'s own sentence');
  const app = design.appSource();
  assert(app.includes('onCheckIn'), 'the card is handed the route, not the screen');
});

/* ==========================================================================
   6. MUTANTS. Each is the defect this screen exists to refuse; each must FAIL
   against the shipped code, so a future change that reintroduces it is caught.
   ========================================================================== */
test('A3 — MUTANT 1: inferring zero or none from a blank answer is refused', () => {
  const draft = createCheckInDraft();
  draft.choose('energy', 'Low');
  const built = draft.answers().answers;
  // The mutant: `answers.soreness = answers.soreness ?? 'None'`.
  const mutated = { ...built, soreness: 'None' };
  assert.notDeepEqual(built, mutated);
  assert.equal(Object.hasOwn(built, 'soreness'), false);
  assert.equal(Object.hasOwn(built, 'issues'), false);
  // And no field is ever stored as null or as an empty string.
  for (const value of Object.values(built)) {
    assert.notEqual(value, null);
    assert.notEqual(value, '');
  }
});

test('A3 — MUTANT 2: carrying yesterday forward is refused by the date filter', async () => {
  const kit = await device();
  await kit.host.save({ soreness: 'None', issues: ['illness'], illness_note: 'cold' });
  kit.host.close();
  const tomorrow = await kit.open(NEXT_DAY);
  const rows = await tomorrow.forDate(NEXT_DAY);
  assert.deepEqual(rows, [], 'the date filter is what makes this impossible');
  // The mutant: forDate() falling back to the newest row when today has none.
  const newest = (await tomorrow.all()).slice(-1);
  assert.equal(newest.length, 1);
  assert.notEqual(newest[0].date, NEXT_DAY);
  tomorrow.close();
});

test('A3 — MUTANT 3: deriving a score from the answers is refused by the closed shape', () => {
  for (const invented of [{ energy: 'Low', readiness: 4 }, { energy: 'Low', score: 1 },
    { energy: 'Low', recovery_index: { value: 0.5, unit: 'ratio' } }]) {
    assert.throws(() => CheckInCommands.answersOf(invented), /CHECKIN_INPUT_INVALID/,
      JSON.stringify(invented));
  }
  // Nothing in the shipped view or model computes a number from a choice.
  const source = design.appSource();
  assert.doesNotMatch(source, /readinessScore|recoveryScore|checkinScore/);
});

test('A3 — MUTANT 4: skipping the outbox entry is impossible — one transaction writes both', async () => {
  const kit = await device();
  await kit.host.save({ energy: 'High' });
  const ops = await opsOf(kit.host.repository);
  const outbox = await outboxOf(kit.host.repository);
  assert.equal(ops.length, outbox.length, 'an operation without its outbox entry cannot exist');
  assert.equal(outbox[0].op_id, ops[0].op_id);
  /* The accepted bridge re-checks exactly this before it commits: a staged batch
     whose operations are not all in the candidate's outbox is PREPARED_BATCH_MISMATCH.
     The fault test above shows the other half — neither, rather than one. */
  kit.host.close();
});

/* A3 review F4 — MUTANT 5 as a PROPERTY of the running lanes, not of three string
   constants. Three lanes are opened on ONE device, each is written through its own
   product path, and the ops on disk are read back.

   C4c REWROTE WHAT "SEPARATE" MEANS HERE. A3 proved it with three stores: no store
   held another store's operation. The lanes share one sealed generation now, so
   that form of the claim is not available and would be a lie if it were. The claim
   itself is unchanged and is made where it always mattered — each lane READS only
   its own operations, the workout ORDER sees neither of the other two (A3 review
   F2), and neither producer will accept the other's command. */
test('A3 — MUTANT 5: a check-in cannot enter the workout or the weigh-in lane', async () => {
  const kit = await device();
  const lane = { indexedDB: kit.fault.indexedDB, crypto: webcrypto };
  const today = createTodayModel({ today: DAY });
  const readings = await createReadingHost({ day: DAY, ...lane });
  const gymHost = await createGymHost({ day: DAY, engineState: today.stateFromOps(),
    plannedSplitSlotId: 'earned-today-preview/' + DAY, ...lane });

  await kit.host.save({ energy: 'Low', stress: 'High' });
  const weighed = await readings.weighIn({ date: DAY, lb: 178.4 });
  assert.equal(weighed.ok, true, weighed.copy);

  const kindsIn = async repository => (await opsOf(repository))
    .map(op => op.kind + '/' + op.class + (op.payload && op.payload.profile ? '/' + op.payload.profile : ''));

  /* C4c — THE THREE LANES ARE ONE STORE NOW, so this no longer asks "does each
     store hold only its own operation" — there is one store, and the question is
     answered one level up, where it has always mattered: each lane READS only its
     own operations, and neither producer will accept the other's command.
     Executed, not asserted: the three hosts share ONE repository handle. */
  assert.equal(kit.host.repository, readings.repository, 'one repository handle, not three');
  assert.equal(kit.host.repository, gymHost.repository);
  assert.deepEqual(await kindsIn(kit.host.repository),
    ['fact/event/' + CheckInCommands.PROFILE, 'fact/reading'],
    'ONE generation holds both, and nothing else');
  assert.deepEqual((await kit.host.all()).map(row => row.date), [DAY],
    'and the check-in lane READS the check-in and nothing else');
  assert.deepEqual(readings.reads().map(row => row.lb), [178.4],
    'the weigh-in lane reads no check-in');
  assert.deepEqual(await gymHost.causalTipsNow(), [],
    'and the workout order sees neither — a check-in is not a causal tip (A3 review F2)');

  /* And the command itself cannot cross. The workout lane's ACCEPTED producer refuses
     a check-in action, and this lane's producer refuses a workout action — both
     without storing anything. */
  const before = await kindsIn(kit.host.repository);
  const intoWorkout = await gymHost.host.client.execute('workout',
    { action: 'checkin', input: { answers: { energy: 'Low' } } });
  assert.notEqual(intoWorkout.acknowledged, true, 'the workout lane accepted a check-in');
  assert.deepEqual(await kindsIn(kit.host.repository), before, 'the refusal stored nothing');

  const intoCheckIn = await kit.host.client.execute('workout',
    { action: 'start', input: { planned_split_slot_id: 'x', plan_basis: 'y' } });
  assert.notEqual(intoCheckIn.acknowledged, true, 'the check-in lane accepted a workout Start');
  assert.deepEqual(await kindsIn(kit.host.repository), before, 'the refusal stored nothing');

  /* ONE database, ONE namespace, ONE lease across all three lanes.

     C4d, review round 3: the third line here used to read
     `new Set([kit.host.databaseName, readings.databaseName,
       gymHost.repository.databaseName || kit.host.databaseName]).size === 1`.
     `repository` carries no `databaseName`, so that third term was ALWAYS the
     first one and the set was always a singleton — a tautology that would have
     passed with the gym lane in a different database entirely. The gym lane's
     answer is the identity already asserted above (`kit.host.repository ===
     gymHost.repository`), which is stronger than any name comparison; the two
     lanes that DO publish a name are checked against the era's own constants. */
  assert.equal(kit.host.databaseName, LOCAL_DATABASE);
  assert.equal(kit.host.namespace, LOCAL_NAMESPACE);
  assert.equal(readings.databaseName, LOCAL_DATABASE, 'the weigh-in lane names the same database');
  assert.equal(readings.namespace, LOCAL_NAMESPACE);
  assert.equal(new Set((await opsOf(kit.host.repository)).map(op => op.lease_id)).size, 1,
    'one lease_id across both write paths that wrote');

  readings.close();
  gymHost.close();
  kit.host.close();
});

test('A3 — MUTANT 6: the command producer refuses anything that is not a check-in', () => {
  const { prepare, validate } = CheckInCommands;
  assert.throws(() => prepare({ action: 'start', input: {} }), /CHECKIN_INPUT_INVALID/);
  assert.throws(() => prepare({ action: 'checkin', input: { answers: {}, extra: 1 } }), /CHECKIN_INPUT_INVALID/);
  assert.throws(() => prepare({ action: 'checkin', input: { answers: { energy: 'Sleepy' } } }), /CHECKIN_INPUT_INVALID/);
  const action = prepare({ action: 'checkin', input: { answers: { energy: 'Low' } } });
  assert.equal(action.class, 'event');
  assert.equal(action.kind, 'fact');
  const op = { kind: 'fact', class: 'event', athlete_id: 'a', causal_parents: [],
    effective: { local_date: DAY }, payload: action.payload };
  assert.equal(validate(op, () => undefined), true);
  assert.equal(validate({ ...op, class: 'session' }, () => undefined), false);
  assert.equal(validate({ ...op, payload: { profile: 'other', answers: {} } }, () => undefined), false);
  assert.equal(validate({ ...op, causal_parents: ['op-nobody'] }, () => undefined), false);
});
