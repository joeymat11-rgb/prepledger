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
  /* The boxes are waited FOR, not assumed: on a starved runner the waist form is one
     of the things that had not arrived when the old 24-turn drain gave up. */
  await settle(() => view.pick('measure-waist-date') && view.pick('measure-waist-value')
    && view.pick('measure-waist-save'),
  'the waist entry boxes for ' + row.date + ' to be on the screen');
  view.pick('measure-waist-date').value = row.date;
  view.pick('measure-waist-value').value = String(row.in);
  /* WHAT THE SAVE IS WAITED ON, and why it is the table and not the screen. The lane
     writes, and only THEN does the comparison re-read and repaint. "The screen stopped
     changing" is true in the gap between the save being accepted and that repaint
     landing, so a wait on stillness returns a table that does not yet carry this row -
     which is how a green-looking run produced `Not enough data yet` in the two waist
     columns of the last week. The condition is therefore the TABLE'S OWN CONTENT
     changing: the page has taken this reading when what it renders is no longer what
     it rendered before the click. */
  const before = renderedTableText(view);
  view.pick('measure-waist-save').click();
  await settle(() => renderedTableText(view) !== before,
    'the trial table to repaint with the waist row for ' + row.date);
  /* AND THEN UNTIL IT STOPS REPAINTING, because the repaint is itself in stages: the
     table comes back with the new row's shape before the comparison has recomputed the
     waist columns, so "it changed" is true while the last week still reads
     `Not enough data yet`. Measured: waiting only for the first change left cell (a)
     red on exactly those two columns about one run in three - the same intermittency,
     one layer down, which is why the wait is on the table settling and not on the
     first sign of movement. */
  await quiet(() => renderedTableText(view),
    'the trial table to stop repainting after the waist row for ' + row.date);
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

/* THE SETTLE, AND WHY IT IS NOW A CONDITION AND NOT A COUNT.
   DECISIONS:482 stop 6 / S6 brief section 7. What stood here was
   `settle = async (rounds = 24) => { for (...) await setTimeout(r, 0); }` - a FIXED
   24-turn macrotask drain with NO condition attached. Every mount, every go(slot) and
   pickMarkersOnScreen ended in it, and go() then did `pick(slot).click()`. So on a cold
   or loaded windows-latest runner, where the real fake-indexeddb and webcrypto work
   behind a route change outlasts 24 turns, the drain returned BEFORE the screen existed
   and the next line dereferenced null, or tableOf read `no trial table rendered`. That
   is the whole of the flake recorded four times in this class (:467 note 2, :481): an
   80 s render and then a null element, always in (a) and (d), never on ubuntu.
   A WIDER COUNT IS REFUSED AS A FIX: it turns a race into a slower race and the next
   occurrence is un-diagnosable again. So the wait is now attached to the thing being
   waited FOR, and when the deadline passes it FAILS LOUDLY with the slot's own name,
   the elapsed milliseconds and the turns taken, instead of returning quietly and
   letting an unrelated line throw a TypeError three frames later.
   The deadline is a CEILING ON FAILURE, not the wait itself: a fast run returns on the
   turn the condition holds and never approaches it. It is overridable so the red side
   of this mechanism can be executed rather than argued. */
const SETTLE_DEADLINE_MS = Number(process.env.MEASURE_SETTLE_DEADLINE_MS) > 0
  ? Number(process.env.MEASURE_SETTLE_DEADLINE_MS) : 30000;
/* How many consecutive unchanged turns count as "the screen stopped changing". */
const SETTLE_STABLE_TURNS = 3;

export const settle = async (until = null, label = 'the page to settle',
  { deadlineMs = SETTLE_DEADLINE_MS } = {}) => {
  const started = Date.now();
  let turns = 0;
  for (;;) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    turns += 1;
    let done = false;
    try { done = until === null ? turns >= SETTLE_STABLE_TURNS : !!until(); }
    catch (_) { done = false; }
    if (done) {
      const ms = Date.now() - started;
      if (process.env.MEASURE_SETTLE_TRACE) console.log('SETTLE-TRACE turns=' + turns + ' ms=' + ms + ' :: ' + label);
      return { turns, ms };
    }
    const waited = Date.now() - started;
    if (waited >= deadlineMs)
      throw new Error('MEASURE-SETTLE-DEADLINE: waited ' + waited + ' ms over ' + turns
        + ' macrotask turns for ' + label + ', which never arrived. The page stack did '
        + 'not finish the work behind this step inside the deadline; this is the real '
        + 'condition failing, not a count running out.');
  }
};

/* "The screen stopped changing", for the steps whose outcome has no single slot to
   name. It keeps waiting WHILE the page is still moving, so it is a condition on the
   page and not a budget: only an unchanged read, SETTLE_STABLE_TURNS turns running,
   ends it, and settle's own deadline is what bounds the failure. */
export const quiet = async (read, label, options = {}) => {
  let last = Symbol('unread');
  let stable = 0;
  return settle(() => {
    const now = read();
    if (now === last) stable += 1; else { stable = 0; last = now; }
    return stable >= SETTLE_STABLE_TURNS;
  }, label, options);
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
  const pick = (slot) => doc.querySelector('#phone [data-slot="' + slot + '"]');
  const all = (selector) => [...doc.querySelectorAll('#phone ' + selector)];
  const phone = () => doc.getElementById('phone').innerHTML;
  /* THE MOUNT WAITS FOR THE PAGE'S OWN ANSWER, not for 24 turns. today-app.cjs
     publishes `api.ready` for exactly this - it is the adoption chain's settle, and
     its own comment says a caller may await it to see that settle - so the page is
     asked when it is ready instead of being guessed at. It is a getter the done
     callback reassigns, so it is read here at await time, and a rejection is the
     chain's own business (adoptAthleteState catches and reports it); this wait only
     needs to know the chain has finished, not how it went. */
  try { await api.ready; } catch (_) { /* reported by adoptAthleteState's own catch */ }
  /* Then the screen itself: Today's Measure control is the thing every cell below
     reaches for first, so its arrival is what "this page is up" means here. */
  await settle(() => pick('measure-tile'),
    'the Today screen to paint its Measure control after mountToday');
  await quiet(phone, 'the Today screen to stop changing after mountToday');
  return { dom, doc, api, model, setup, lane, pick, all, phone,
    text: () => doc.getElementById('phone').textContent,
    /* go() ASSERTS ITS TARGET BEFORE IT CLICKS, AND WAITS FOR WHAT THE CLICK IS FOR.
       Two things were wrong with the line this replaces, `pick(slot).click(); settle()`.
       First, it clicked whatever the 24-turn drain happened to leave, so a control that
       had not arrived was a TypeError on null. Second - and this is the half that made
       the flake look like a timeout - THESE SCREENS PAINT IN TWO STAGES: the route
       change renders the frame, then the lane's own read resolves and the screen paints
       again with its real content. Between those two paints the DOM is briefly STILL,
       so "the screen changed" and even "the screen stopped changing" are both true
       while the screen is still half built. Measured here: the frame arrives 1 turn
       after the click and goes quiet 4 turns later, while the marker pick screen the
       next line needs arrives long after that. A caller that knows which screen it is
       opening therefore NAMES it, and that name - not a count, not a stillness - is
       what is waited on. `until` is the terminal state of the screen being opened;
       without one the generic change-then-quiet wait stands, and it is only sound for
       a control whose whole effect is one paint. */
    async go(slot, until = null, what = null) {
      await settle(() => pick(slot),
        'the control "' + slot + '" to be on the screen before it is clicked');
      const before = phone();
      pick(slot).click();
      await settle(() => phone() !== before,
        'the screen to change after "' + slot + '" was clicked');
      if (until) await settle(until, what || ('the screen "' + slot + '" opens to finish loading'));
      else await quiet(phone, 'the screen to stop changing after "' + slot + '" was clicked');
    },
    /* CLOSE WAITS FOR THE SCREEN TO BE STILL FIRST, and this is the third face of the
       same cause. Tearing the lane down while a repaint is still in flight makes the
       next paint call markers() on a closed client, and measure-host.mjs answers
       LOCAL_CLIENT_CLOSED from inside renderMeasure - an async rejection with no cell
       to attach itself to, which surfaced as a bare error in cell (e). The old fixed
       drain hid it by accident: 24 turns happened to outlast the pending render. So
       the view is asked to be quiet before its stores are closed, on the same
       condition-with-a-deadline every other wait here uses. */
    async close() {
      try { await quiet(phone, 'the screen to be still before the stores are closed'); }
      catch (_) { /* a page that never settles is the caller's failure, not the close's */ }
      try { reading.close(); food.close(); sleep.close(); lane.close(); } catch (_) { /* detached */ }
    } };
}

/* Picking the markers THROUGH THE SCREEN: tick the boxes the pick screen
   offers and submit its own form. Nothing is written here by hand. */
export async function pickMarkersOnScreen(view, names = FIXTURE.markers) {
  /* The options and the submit are waited FOR. The old drain returned whether or not
     the pick screen had rendered, and `[...][0].click()` on an empty list is the
     second face of the same flake. */
  await settle(() => view.all('[data-slot="measure-marker-option"]').length > 0
    && view.all('[data-slot="measure-marker-save"]').length > 0,
  'the marker pick screen to offer its options and its save control');
  const boxes = view.all('[data-slot="measure-marker-option"]');
  for (const box of boxes) {
    if (!names.includes(box.value)) continue;
    box.checked = true;
    box.dispatchEvent(new view.dom.window.Event('change', { bubbles: true }));
  }
  view.all('[data-slot="measure-marker-save"]')[0].click();
  /* The markers are saved when the pick screen has gone: that is the page's own
     answer, and it is what the next line of every caller depends on. */
  await settle(() => !view.pick('measure-marker-pick'),
    'the marker pick screen to close after the markers were saved');
  await quiet(view.phone, 'the screen to stop changing after the markers were saved');
  return boxes.length;
}

/* WHEN THE MEASURE SCREEN HAS FINISHED LOADING, named once so both the cells and
   go() can wait on the same fact. The screen resolves to exactly one of two terminal
   states: the marker PICK screen, when this device has not chosen its three lifts
   yet, or the trial TABLE, when it has. Either one means the lane's read came back
   and the screen is whole; neither means it is still the empty frame the route change
   painted first. This is the condition the old 24-turn drain was standing in for. */
export const measureScreenReady = (view) => () =>
  !!(view.pick('measure-marker-pick') || view.pick('measure-trial-table'));

/* The rendered table as one comparable string, for the waits that need to know
   whether the page has REPAINTED rather than merely whether a table is present.
   Absent table and empty table are distinguishable, so "it appeared" and "it changed"
   are both expressible on the same read. */
export const renderedTableText = (view, slot = 'measure-trial-table') => {
  const table = view.pick(slot);
  return table === null ? '(no table)' : table.textContent;
};

/* THE TRIAL TABLE IS THE PAGE'S ANSWER to the waist readings, and it arrives on its
   own turn after the save is accepted - the same two-stage paint as the route change,
   one stage lower down. `no trial table rendered` is precisely the assertion the
   windows-latest flake failed on in cell (a), and this is the condition that was
   standing behind the drain that produced it. */
export async function waitForTrialTable(view) {
  return settle(() => view.pick('measure-trial-table'),
    'the trial table to render after the waist readings were entered');
}

/* The rendered table, as the athlete reads it: one array of cell strings per
   row, header first. */
export function tableOf(view, slot = 'measure-trial-table') {
  const table = view.pick(slot);
  if (!table) return null;
  return [...table.querySelectorAll('tr')]
    .map((tr) => [...tr.querySelectorAll('th,td')].map((cell) => cell.textContent));
}
