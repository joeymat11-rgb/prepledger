import assert from 'node:assert/strict';
import fs from 'node:fs';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../m3/w6/test/support.mjs';
import { openCoachWorld } from '../../../coach/local-world.mjs';
import Tools from '../../../coach/tools.cjs';
import { createSleepHost } from '../../../m3/w7-preview/today/sleep-host.mjs';
import { createCheckInEntry } from '../../../m3/w7-preview/today/today-entry.mjs';
import Sleep from '../../../m3/w7-preview/today/sleep-model.cjs';
import Today from '../../../m3/w7-preview/today/today-model.cjs';
import App from '../../../m3/w7-preview/today/today-app.cjs';
import Design from '../../../m3/w7-preview/today/design.cjs';

const DAY = '2030-02-04', NIGHT = '2030-02-03';
const outcomes = [];
const inputs = () => ({ indexedDB: faultDatabase().indexedDB, crypto: webcrypto, day: DAY });
const collections = async repository => (await repository.load()).generation.collections;
const facts = async repository => { const c = await collections(repository); return { ops: c.ops, outbox: c.outbox }; };
const source = fs.readFileSync('rebuild/m3/w7-preview/today/today-app.cjs', 'utf8');
const body = source.slice(source.indexOf('function sleepEntryFor(')).match(/^function sleepEntryFor[\s\S]*?^  \}/m)[0];
const laneFromActualSource = Function('return (' + body + ')')();
function mount(model, mountOptions) {
  const dom = new JSDOM(Design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', Design.templateHtml()), { url: 'http://localhost/?screen=sleep' });
  const doc = dom.window.document;
  const api = App.mountToday(doc, model, mountOptions);
  const pick = slot => doc.querySelector('#phone [data-slot="' + slot + '"]');
  const type = (slot, value, event = 'input') => { const el = pick(slot); assert(el, slot); el.value = value; el.dispatchEvent(new dom.window.Event(event, { bubbles: true })); };
  return { dom, doc, api, pick, type };
}
async function check(name, run) {
  try { await run(); outcomes.push({ name, result: 'PASS' }); }
  catch (error) { outcomes.push({ name, result: 'FAIL', code: error.code || error.name, message: error.message }); }
}

await check('R3-C1 actual tool read and confirmation use one recorded night', async () => {
  const w = await openCoachWorld(inputs());
  try {
    assert.equal((await w.sleepHost.save({ date: NIGHT, hours: 1 })).ok, true);
    const turn = Tools.createCoachTools(w).openTurn('d2-r4-read-confirm');
    const read = await turn.call.today_checkin({});
    assert.equal(read.values.sleepRecordHours.value, 1);
    assert.equal((await turn.call.answer_checkin({ confirmed: true, confirm_sleep_record: true })).ok, true);
    const saved = w.checkin.recorded().answers;
    assert.equal(saved.sleep_hours.value, read.values.sleepRecordHours.value);
    assert.equal(saved.sleep_hours_source, 'existing-record');
    assert.equal(saved.sleep_hours_record_date, NIGHT);
  } finally { w.close(); }
});
await check('R3-C2 disabled lane has no qualified hours and cannot write confirmation', async () => {
  const w = await openCoachWorld({ ...inputs(), withSleep: false });
  try {
    const turn = Tools.createCoachTools(w).openTurn('d2-r4-disabled');
    const read = await turn.call.today_checkin({});
    assert.equal(read.values.sleepRecordHours.value, null);
    assert.equal(read.values.sleepRecordHours.blank, true);
    assert.equal(w.sleepOnLocalEra, false);
    const before = await facts(w.checkInHost.repository);
    assert.equal((await turn.call.answer_checkin({ confirmed: true, confirm_sleep_record: true })).ok, false);
    assert.deepEqual(await facts(w.checkInHost.repository), before);
  } finally { w.close(); }
});
await check('R3-C3 separate same-store reader sees the other actual client write', async () => {
  const options = inputs(), reader = await openCoachWorld(options), writer = await openCoachWorld(options);
  try {
    assert.notEqual(reader.client, writer.client);
    assert.equal((await writer.sleepHost.save({ date: NIGHT, hours: 2 })).ok, true);
    assert.equal(Object.values((await collections(reader.bindings.repository)).ops).find(o => o.class === 'sleep').payload.night.hours, 2);
    const read = await Tools.createCoachTools(reader).openTurn('d2-r4-other-client').call.today_checkin({});
    assert.equal(read.values.sleepRecordHours.value, 2);
    assert.equal(read.values.sleepRecordDate.value, NIGHT);
  } finally { writer.close(); reader.close(); }
});
await check('same hours from a new operation still require a fresh actual-tool confirmation', async () => {
  const options = inputs(), reader = await openCoachWorld(options), writer = await openCoachWorld(options);
  try {
    assert.equal((await writer.sleepHost.save({ date: NIGHT, hours: 3 })).ok, true);
    const turn = Tools.createCoachTools(reader).openTurn('d2-r4-equal-new-observation');
    assert.equal((await turn.call.today_checkin({})).values.sleepRecordHours.value, 3);
    const first = Sleep.recordedNight(await writer.sleepHost.all(), NIGHT).op_id;
    assert.equal((await writer.sleepHost.save({ date: NIGHT, hours: 3 })).ok, true);
    assert.notEqual(Sleep.recordedNight(await writer.sleepHost.all(), NIGHT).op_id, first);
    const before = await facts(reader.checkInHost.repository);
    assert.equal((await turn.call.answer_checkin({ confirmed: true, confirm_sleep_record: true, note: 'Keep this actual draft' })).ok, false);
    assert.deepEqual(await facts(reader.checkInHost.repository), before);
    assert.equal(reader.checkin.draft().state().fields.note, 'Keep this actual draft');
    assert.equal(reader.checkin.draft().state().sleepConfirm, null);
    await turn.call.today_checkin({});
    assert.equal((await turn.call.answer_checkin({ confirmed: true, confirm_sleep_record: true })).ok, true);
  } finally { writer.close(); reader.close(); }
});
await check('a once-readable coach lane cannot keep asserting hours after its real host closes', async () => {
  const w = await openCoachWorld(inputs());
  try {
    await w.sleepHost.save({ date: NIGHT, hours: 4 });
    const turn = Tools.createCoachTools(w).openTurn('d2-r4-closed-after-read');
    assert.equal((await turn.call.today_checkin({})).values.sleepRecordHours.value, 4);
    w.sleepHost.close();
    assert.equal((await turn.call.today_checkin({})).values.sleepRecordHours.value, null);
    const before = await facts(w.checkInHost.repository);
    assert.equal((await turn.call.answer_checkin({ confirmed: true, confirm_sleep_record: true })).ok, false);
    assert.deepEqual(await facts(w.checkInHost.repository), before);
  } finally { w.close(); }
});

for (const delayed of [false, true]) await check('R3-U1 failed new 5h cannot match old 5h' + (delayed ? ' during read retry' : ' immediately'), async () => {
  const host = await createSleepHost(inputs());
  let page;
  try {
    assert.equal((await host.save({ date: NIGHT, hours: 5 })).ok, true);
    assert.equal((await host.save({ date: NIGHT, hours: 8 })).ok, true);
    const before = await facts(host.repository);
    let readable = !delayed;
    const lane = laneFromActualSource({ ...host,
      async all() { if (!readable) throw new Error('SYNTHETIC_UNREADABLE'); return host.all(); },
      async save() { throw new Error('SYNTHETIC_BEFORE_COMMIT'); }
    }, await host.all());
    page = mount(Today.createTodayModel({ today: DAY }), { sleep: lane });
    page.pick('sleep-change').click(); page.pick('sleep-mode-hours').click(); page.type('sleep-hours', '5');
    page.pick('sleep-save').click(); await page.api.sleepPending();
    if (delayed) { assert.equal(page.pick('sleep-save').disabled, true); readable = true; page.pick('sleep-read-retry').click(); await page.api.sleepPending(); }
    assert.deepEqual(await facts(host.repository), before);
    assert.equal(Sleep.recordedNight(await host.all(), NIGHT).night.hours, 8);
    assert.equal(page.pick('sleep-hours').value, '5');
    assert.match(page.pick('sleep-error').textContent, /Nothing was recorded/);
    assert.match(page.pick('sleep-recorded').textContent, /8 h/);
  } finally { page?.dom.window.close(); host.close(); }
});
await check('R3-D1/D2 actual historical quality, date, save and correction remain visible', async () => {
  const { day: unusedDay, ...options } = inputs();
  const historicalDay = '2030-02-03', chosen = '2030-02-02';
  const prior = await createCheckInEntry(Today.createTodayModel({ today: historicalDay }), options);
  let entry, host, page;
  try {
    prior.checkin.draft().choose('sleep_quality', 'Good');
    assert.equal((await prior.checkin.save()).ok, true);
    const priorRows = await prior.host.forDate(historicalDay);
    assert.equal(priorRows.length, 1, 'historical fixture saved on its intended day');
    const basis = Today.createTodayModel({ today: DAY }).basisState(); basis.sleep.nights = [];
    const model = Today.createTodayModel({ today: DAY, basisState: basis });
    entry = await createCheckInEntry(model, options); host = await createSleepHost({ day: DAY, ...options });
    page = mount(model, { sleep: laneFromActualSource(host, await host.all()), checkin: entry });
    await page.api.checkInKitReady(); page.type('sleep-date', chosen, 'change'); await page.api.sleepCheckInReady();
    assert.equal((await entry.host.forDate(historicalDay)).at(-1).answers.sleep_quality, 'Good');
    assert.match(page.pick('sleep-quality').textContent, /Quality: Good/);
    assert.match(page.doc.querySelector('#phone').textContent, /From your check-in on 2030-02-03/);
    page.pick('sleep-mode-hours').click(); page.type('sleep-hours', '5'); page.pick('sleep-save').click(); await page.api.sleepPending();
    assert.equal(page.pick('sleep-date').value, chosen); assert.equal(page.pick('sleep-recorded').hidden, false);
    assert.match(page.pick('sleep-recorded').textContent, /5 h/);
    page.pick('sleep-change').click(); page.type('sleep-hours', '6'); page.pick('sleep-save').click(); await page.api.sleepPending();
    assert.equal(page.pick('sleep-date').value, chosen); assert.match(page.pick('sleep-recorded').textContent, /6 h/);
    assert.equal(Sleep.recordedNight(await host.all(), chosen).night.hours, 6);
    assert.deepEqual(await prior.host.forDate(historicalDay), priorRows);
  } finally { page?.dom.window.close(); host?.close(); entry?.host.close(); prior.host.close(); }
});
console.log(JSON.stringify({ candidate: 'bdbee8b455b0530143c9df34d065c1204f70ee0f', controls: outcomes.length, pass: outcomes.filter(o => o.result === 'PASS').length, outcomes }));
if (outcomes.some(o => o.result !== 'PASS')) process.exitCode = 1;
