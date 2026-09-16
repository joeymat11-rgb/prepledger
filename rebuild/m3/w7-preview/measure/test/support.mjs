/* P-MEASURE v1 round 3 - the shared harness for this directory's cells.
   REAL here: the encrypted repository over fake-indexeddb, the accepted durable
   public client, the accepted clean-init constructor, the real setup, reading,
   food, sleep, gym and measure lanes, the real Today route and the real
   measure screen. Nothing is stubbed and nothing is a fixture double: every
   figure below is synthetic and every write goes through a real command. */
import fs from 'node:fs';
import path from 'node:path';
import { webcrypto } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { createSetupHost } from '../../today/setup-host.mjs';
import { createReadingHost } from '../../today/reading-host.mjs';
import { createFoodHost } from '../../today/food-host.mjs';
import { createSleepHost } from '../../today/sleep-host.mjs';
import { createGymHost } from '../../today/gym-host.mjs';
import { createGymModel, EFFORT_CHOICES } from '../../today/gym-model.mjs';
import { createSetupEntry } from '../../today/today-entry.mjs';
import { createMeasureHost } from '../measure-host.mjs';
import design from '../../today/design.cjs';
import TodayApp from '../../today/today-app.cjs';
import Model from '../../today/setup-model.mjs';

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '../../../../..');
export const readRepo = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
export const FIXTURE = JSON.parse(readRepo('rebuild/m3/w7-preview/measure/measure-fixture.json'));
export const { mountToday, createTodayModel } = TodayApp;
export const shell = () => design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml());
export const EFFORT = EFFORT_CHOICES.find((choice) => choice.label === '2').reserve;
export { webcrypto, faultDatabase, createMeasureHost, JSDOM };

/* THE ENROLLED WEEK, built through the setup reducer's own actions and written
   by the ACCEPTED clean-init constructor: three training days and the three
   lifts this fixture follows as markers. */
export function enrolledDocument(day = FIXTURE.trialStart) {
  const model = Model.createSetupModel({ today: day });
  model.setName('Joe');
  for (const [weekday, kind] of [['1', 'U'], ['3', 'L'], ['5', 'U']]) {
    model.toggleDay(weekday);
    model.setDayKind(weekday, kind);
  }
  for (const [name, kind, mg, first] of [['Bench Press', 'U', 'chest', '135'],
    ['Back Squat', 'L', 'quads', '225'], ['Deadlift', 'L', 'quads', '275']]) {
    const row = model.addExercise(kind);
    model.setExerciseField(row.key, 'n', name);
    model.chooseMg(row.key, mg);
    model.setExerciseField(row.key, 'first', first);
  }
  model.togglePriority('quads');
  const built = model.document();
  if (!built.ok) throw new Error('fixture setup incomplete: ' + JSON.stringify(built.missing));
  return built;
}

export async function enrol(fault, day = FIXTURE.trialStart) {
  const host = await createSetupHost({ day, indexedDB: fault.indexedDB, crypto: webcrypto });
  const built = enrolledDocument(day);
  const result = await host.save(built.setup, built.tags);
  if (!result.ok) throw new Error('enrolment refused: ' + JSON.stringify(result));
  host.close();
  return built;
}

/* EVERY ENTRY THROUGH ITS OWN REAL COMMAND. The weigh-in is the reading lane's,
   the intake is N1's, the night is N2's, the sets are the gym card's own
   accepted workout stack, and the waist is this lane's new one. */
export async function enterFixture(fault, entries = FIXTURE.entries, basis = null) {
  const today = FIXTURE.today;
  const reading = await createReadingHost({ day: today, indexedDB: fault.indexedDB, crypto: webcrypto });
  for (const row of entries.reads) {
    const result = await reading.weighIn({ date: row.date, lb: row.lb });
    if (!result.ok) throw new Error('weigh-in refused on ' + row.date + ': ' + result.copy);
  }
  for (const row of entries.food) {
    const host = await createFoodHost({ day: row.date, indexedDB: fault.indexedDB, crypto: webcrypto });
    const day = row.cal === null ? { pro: row.pro } : { cal: row.cal, pro: row.pro };
    const result = await host.save(day);
    host.close();
    if (!result.ok) throw new Error('intake refused on ' + row.date + ': ' + result.copy);
  }
  const sleep = await createSleepHost({ day: today, indexedDB: fault.indexedDB, crypto: webcrypto });
  for (const row of entries.nights) {
    const result = await sleep.save({ date: row.date, hours: row.hours });
    if (!result.ok) throw new Error('night refused on ' + row.date + ': ' + result.copy);
  }
  sleep.close();
  await enterSessions(fault, entries.sessions, basis);
  /* Every waist reading but the LAST TWO: those two are typed into the real
     on-screen entry box by the journey cell, so both halves of this lane's own
     new entry path - the screen and the command - are executed. */
  const waist = entries.waist.slice(0, Math.max(0, entries.waist.length - 2));
  if (waist.length) {
    const measure = await createMeasureHost({ day: today, indexedDB: fault.indexedDB, crypto: webcrypto });
    for (const row of waist) {
      const result = await measure.save({ date: row.date, in: row.in });
      if (!result.ok) throw new Error('waist refused on ' + row.date + ': ' + result.code);
    }
    measure.close();
  }
  return { reading };
}

/* The waist entry AS THE ATHLETE MAKES IT: the boxes the screen rendered, and
   the screen's own submit. */
export async function typeWaist(view, row) {
  view.pick('measure-waist-date').value = row.date;
  view.pick('measure-waist-value').value = String(row.in);
  view.pick('measure-waist-save').click();
  await settle();
}

/* The sets, one session per training date, through the accepted workout stack:
   prepare, start, log each prescribed slot at the fixture's own load and reps,
   then close the session so the next day's preparation is not blocked. */
export async function enterSessions(fault, sessions, basis) {
  const byDate = new Map();
  for (const row of sessions) {
    if (!byDate.has(row.date)) byDate.set(row.date, new Map());
    byDate.get(row.date).set(row.id, row);
  }
  for (const [date, lifts] of [...byDate.entries()].sort()) {
    const host = await createGymHost({ day: date, engineState: basis,
      indexedDB: fault.indexedDB, crypto: webcrypto,
      plannedSplitSlotId: 'earned-today-preview/' + date });
    const gym = createGymModel({ gymHost: host, sessionTitle: 'trial' });
    await gym.read();
    const started = await gym.start();
    if (started.ok === false) throw new Error('session refused on ' + date + ': ' + (started.code || started.copy));
    let guard = 0;
    for (;;) {
      const view = await gym.read();
      if (!view.set || guard > 40) break;
      guard += 1;
      const wanted = lifts.get(view.set.lift);
      if (!wanted) break;
      const logged = await gym.logSet({ startId: view.startId, slot: view.set.slot,
        lift: view.set.lift, load: wanted.load, reps: wanted.reps, effort: EFFORT });
      if (logged.ok === false) throw new Error('set refused on ' + date + ': ' + (logged.code || logged.copy));
      /* The card shows the saved set until the athlete moves on; the same
         "continue" the screen offers is what lets the next slot be read. */
      gym.forget();
    }
    const view = await gym.read();
    if (view.startId) {
      const closed = await gym.finish({ startId: view.startId });
      if (closed && closed.ok === false) {
        throw new Error('close refused on ' + date + ': ' + JSON.stringify(closed).slice(0, 200)
          + ' phase=' + view.phase + ' set=' + JSON.stringify(view.set));
      }
    }
    host.close();
  }
}

export const settle = async (rounds = 24) => {
  for (let i = 0; i < rounds; i += 1) await new Promise((resolve) => setTimeout(resolve, 0));
};

/* THE REAL TODAY ROUTE, mounted on the approved shell. The lanes handed in are
   the real ones this device just wrote through; `measure` is the same
   injection point today-app.cjs already offers the food and sleep lanes. */
export async function page(fault, { basis, today = FIXTURE.today, measure = null } = {}) {
  const dom = new JSDOM(shell(), { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  const reading = await createReadingHost({ day: today, indexedDB: fault.indexedDB, crypto: webcrypto });
  const food = await createFoodHost({ day: today, indexedDB: fault.indexedDB, crypto: webcrypto });
  const sleep = await createSleepHost({ day: today, indexedDB: fault.indexedDB, crypto: webcrypto });
  const foodRows = await food.all(), sleepRows = await sleep.all();
  const model = createTodayModel({ today, basisState: basis, readings: reading,
    foodDays: { rows: () => foodRows }, sleepNights: { rows: () => sleepRows } });
  const setup = await createSetupEntry({ today }, { indexedDB: fault.indexedDB, crypto: webcrypto });
  const lane = measure || await createMeasureHost({ day: today,
    indexedDB: fault.indexedDB, crypto: webcrypto });
  const api = mountToday(doc, model, { setup, measure: lane });
  await settle();
  const pick = (slot) => doc.querySelector('#phone [data-slot="' + slot + '"]');
  const all = (selector) => [...doc.querySelectorAll('#phone ' + selector)];
  return { dom, doc, api, model, setup, lane, pick, all,
    text: () => doc.getElementById('phone').textContent,
    async go(slot) { pick(slot).click(); await settle(); },
    close() { try { reading.close(); food.close(); sleep.close(); lane.close(); } catch (_) { /* detached */ } } };
}

/* Picking the markers THROUGH THE SCREEN: tick the boxes the pick screen
   offers and submit its own form. Nothing is written here by hand. */
export async function pickMarkersOnScreen(view, names = FIXTURE.markers) {
  const boxes = view.all('[data-slot="measure-marker-option"]');
  for (const box of boxes) {
    if (!names.includes(box.value)) continue;
    box.checked = true;
    box.dispatchEvent(new view.dom.window.Event('change', { bubbles: true }));
  }
  view.all('[data-slot="measure-marker-save"]')[0].click();
  await settle();
  return boxes.length;
}

/* The rendered table, as the athlete reads it: one array of cell strings per
   row, header first. */
export function tableOf(view, slot = 'measure-trial-table') {
  const table = view.pick(slot);
  if (!table) return null;
  return [...table.querySelectorAll('tr')]
    .map((tr) => [...tr.querySelectorAll('th,td')].map((cell) => cell.textContent));
}
