/* P1 — NO AI DASHES IN THE UI.
 *
 * DECISIONS:114 (1), the owner verbatim: "no ai dashes are allowed in the ui". No em dash
 * (U+2014) and no en dash (U+2013) in any text an athlete can see. The brief is
 * rebuild/slice/P1-NO-DASHES-BRIEF.md; its amendment (DECISIONS:117 (1)) adds a
 * build-time refusal and a render-time one.
 *
 * This file proves four things, in this order:
 *   1. the normaliser rewrites the three shapes the brief names and REFUSES the rest;
 *   2. the built page carries no dash in anything the athlete can see, and the build
 *      REFUSES to write one (planted, refused, restored byte for byte);
 *   3. every screen state these screens can reach renders without a dash, over the same
 *      real stack the other today tests use;
 *   4. the frozen sources' own prose (rebuild/engine, rebuild/client, w6, m4) still
 *      arrives whole, with the dash taken out at the render boundary and nothing else
 *      changed.
 *
 * The REAL-BROWSER half of bar item 1 lives where the states already exist: browser-check
 * .mjs, gym-check.mjs and checkin-check.mjs assert the same rule on the rendered DOM at
 * every screen they walk, in msedge. This file is the part that runs under `node --test`
 * on both CI runners.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { buildToday, DIST, ASSETS } from '../build.mjs';
import PlainCopy from '../plain-copy.cjs';
import design from '../design.cjs';
import TodayApp from '../today-app.cjs';
import TodayModel from '../today-model.cjs';
import { createReadingHost } from '../reading-host.mjs';
import { createGymHost } from '../gym-host.mjs';
import { createGymModel } from '../gym-model.mjs';
import { mountGym } from '../gym-app.mjs';
import { createCheckInHost } from '../checkin-host.mjs';
import { createCheckInModel } from '../checkin-model.mjs';
import { mountCheckIn } from '../checkin-app.mjs';
import Engine from '../../../../engine/index.cjs';

const { plainCopy, hasAiDash, scanBuiltAssets, AiDashInBuild } = PlainCopy;
const { mountToday } = TodayApp;
const { createTodayModel, createBasisState, engineClockFor, SYNTHETIC_DAY } = TodayModel;
const { createEngine } = Engine;

const DAY = SYNTHETIC_DAY;
const SLOT = 'earned-today-preview/' + DAY;
const SOURCE = design.SOURCE;
const DASH = /[–—]/;

/* Everything an athlete can read out of a rendered document: the text nodes, the
   attributes a browser paints, and the tab title. */
const USER_FACING_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt', 'value', 'aria-description'];
function visibleStrings(doc, root) {
  const host = root || doc.getElementById('phone') || doc.body;
  const out = [];
  const walk = doc.createTreeWalker(host, 4 /* SHOW_TEXT */);
  for (let node = walk.nextNode(); node; node = walk.nextNode()) {
    const value = node.nodeValue;
    if (value && value.trim()) out.push({ what: 'text', value });
  }
  for (const el of host.querySelectorAll('*')) {
    for (const name of USER_FACING_ATTRIBUTES) {
      const value = el.getAttribute(name);
      if (value) out.push({ what: el.tagName.toLowerCase() + '[' + name + ']', value });
    }
  }
  const status = doc.getElementById('today-status');
  if (status && status.textContent) out.push({ what: 'today-status', value: status.textContent });
  const storage = doc.getElementById('today-storage');
  if (storage && storage.textContent) out.push({ what: 'today-storage', value: storage.textContent });
  if (doc.title) out.push({ what: 'document.title', value: doc.title });
  return out;
}
function assertNoDashOnScreen(doc, where, root) {
  const strings = visibleStrings(doc, root);
  /* A sweep that found nothing to read would pass on an empty screen and prove nothing. */
  assert(strings.length >= 3, 'nothing was rendered to sweep (' + where + ')');
  const hits = strings.filter((entry) => DASH.test(entry.value));
  assert.deepEqual(hits, [], 'an AI dash reached the screen (' + where + '): '
    + hits.map((h) => h.what + ' "' + h.value.trim() + '"').join(' | '));
  return strings.length;
}

/* RED FIRST for the sweep itself: a dash put into a rendered node, in text or in an
   attribute, must be found. */
test('P1 — the screen sweep really catches a dash, in text and in an attribute', () => {
  const doc = dom();
  const phone = doc.getElementById('phone');
  const p = doc.createElement('p');
  p.textContent = 'a sentence long enough to read';
  const input = doc.createElement('input');
  input.setAttribute('placeholder', 'hours');
  phone.append(p, input, doc.createElement('span'));
  assert.equal(typeof assertNoDashOnScreen(doc, 'a clean fixture'), 'number');
  p.textContent = 'a sentence — long enough to read';
  assert.throws(() => assertNoDashOnScreen(doc, 'a planted text dash'), /an AI dash reached the screen/);
  p.textContent = 'a sentence long enough to read';
  input.setAttribute('placeholder', '—');
  assert.throws(() => assertNoDashOnScreen(doc, 'a planted attribute dash'), /input\[placeholder\]/);
});

const shell = () => design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml());
const dom = () => new JSDOM(shell(), { url: 'http://127.0.0.1:4178/' }).window.document;
const settle = async (ticks = 60) => { for (let i = 0; i < ticks; i++) await new Promise((r) => setTimeout(r, 2)); };

/* ==========================================================================
   1. THE NORMALISER. Three shapes, and a refusal for everything else.
   ========================================================================== */
test('P1 — the normaliser rewrites an aside, a range and a stray dash, and nothing else', () => {
  // The brief's own worked examples.
  assert.equal(plainCopy('spike — damped in trend'), 'spike: damped in trend');
  assert.equal(plainCopy('60–400 lb'), '60 to 400 lb');
  assert.equal(plainCopy('Coach — not wired yet'), 'Coach: not wired yet');
  // A leading or trailing dash is decoration and goes.
  assert.equal(plainCopy('— recorded today'), 'recorded today');
  assert.equal(plainCopy('—'), '');
  assert.equal(plainCopy('recorded today —'), 'recorded today');
  // Ranges the engine really writes.
  assert.equal(plainCopy('1.08–1.26 lb/wk'), '1.08 to 1.26 lb/wk');
  assert.equal(plainCopy('+100–150 kcal (~3–5%)'), '+100 to 150 kcal (~3 to 5%)');
  // Text with no dash is returned untouched, character for character.
  const clean = 'Today’s target 2,262 to 2,360 kcal · Why this plan?';
  assert.equal(plainCopy(clean), clean);
  // A minus sign and a hyphen are not dashes and are never touched.
  assert.equal(plainCopy('−2.85% on strength'), '−2.85% on strength');
  assert.equal(plainCopy('low-energy check'), 'low-energy check');
  // null and undefined keep their meaning of "no value".
  assert.equal(plainCopy(null), null);
  assert.equal(plainCopy(undefined), undefined);
  // And a dash in a shape the brief gives no rule for is REFUSED, never guessed at.
  for (const hostile of ['endpoints—no bounce', 'min–max', 'a—b']) {
    assert.throws(() => plainCopy(hostile, 'a-slot'), (error) => {
      assert.equal(error.code, 'AI_DASH_IN_UI');
      assert.equal(error.name, 'AiDashRefused');
      assert.equal(error.where, 'a-slot');
      return true;
    }, hostile);
  }
  assert.equal(hasAiDash('a — b'), true);
  assert.equal(hasAiDash('a - b'), false);
});

test('P1 — the engine’s own headline vocabulary survives the normaliser, whole', () => {
  const titles = design.headlineVocabulary();
  assert(titles.length >= 10, 'the engine titles were read');
  const dashed = titles.filter((t) => DASH.test(t));
  assert(dashed.length >= 4, 'the engine really does write dashed titles: ' + dashed.length);
  for (const title of titles) {
    const plain = plainCopy(title);
    assert(!DASH.test(plain), title);
    // Nothing is truncated: every word of the engine's title is still there.
    for (const word of title.split(/[\s–—]+/).filter(Boolean)) {
      assert(plain.includes(word), 'the normaliser dropped "' + word + '" from "' + title + '"');
    }
  }
});

/* ==========================================================================
   2. THE BUILT PAGE, and the build-time refusal (DECISIONS:117 (1)).
   ========================================================================== */
test('P1 — the built page carries no dash in anything the athlete can see', async () => {
  const result = await buildToday();
  const assets = ASSETS.map((name) => [name, fs.readFileSync(path.join(DIST, name))]);
  assert.deepEqual(assets.map(([name]) => name).sort(), [...ASSETS].sort());

  const report = scanBuiltAssets(assets);
  assert.deepEqual(report.offences, [], 'the shipped assets carry a dash the athlete can see');

  /* Independently of the guard: the markup and the stylesheet outside their comments
     hold no dash at all, counted here rather than taken on the guard's word. */
  const html = assets.find(([n]) => n === 'index.html')[1].toString('utf8');
  const css = assets.find(([n]) => n === 'styles.css')[1].toString('utf8');
  assert.equal((html.replace(/<!--[\s\S]*?-->/g, ' ').match(/[–—]/g) || []).length, 0);
  assert.equal((css.replace(/\/\*[\s\S]*?\*\//g, ' ').match(/[–—]/g) || []).length, 0);
  assert(!DASH.test(html.match(/<title>([\s\S]*?)<\/title>/)[1]), 'the tab title');

  /* The frozen sources' prose is still in the bundle, dashes and all: this brief did not
     edit rebuild/engine, and the count is the evidence that the render boundary, not a
     sweep of somebody else's file, is what keeps it off the screen. */
  assert(report.admitted > 100, 'the frozen prose is still there: ' + report.admitted);
  assert.equal(result.dashes.offences.length, 0);
  assert.equal(result.dashes.admitted, report.admitted);
});

/* RED FIRST. A planted dash must stop the build, in the markup and in the bundle, and
   the plant must be gone again whatever happens. */
async function planted(file, find, replace) {
  const full = path.join(SOURCE, file);
  const original = fs.readFileSync(full);
  assert(original.toString('utf8').includes(find), 'the plant site exists in ' + file + ': ' + find);
  try {
    fs.writeFileSync(full, original.toString('utf8').replace(find, replace));
    const error = await buildToday().then(() => null, (e) => e);
    assert(error, 'the build accepted a planted dash in ' + file);
    return error;
  } finally {
    fs.writeFileSync(full, original);
    assert.equal(fs.readFileSync(full).equals(original), true, 'the plant was restored byte for byte');
  }
}

test('P1 — the build REFUSES a dash planted in the markup, and the plant is restored', async () => {
  const error = await planted('index.shell.html', '<title>Earned: Today</title>', '<title>Earned — Today</title>');
  assert.equal(error.code, 'AI_DASH_IN_BUILD', error.message);
  assert.equal(error.name, 'AiDashInBuild');
  assert(error.offences.some((o) => o.asset === 'index.html'), error.message);
  // and the build is clean again afterwards
  const again = await buildToday();
  assert.equal(again.dashes.offences.length, 0);
});

test('P1 — the build REFUSES a dash planted in a string this page owns', async () => {
  const error = await planted('today-app.cjs', 'const NOT_AVAILABLE = "Not available yet";',
    'const NOT_AVAILABLE = "Not available — yet";');
  assert.equal(error.code, 'AI_DASH_IN_BUILD', error.message);
  assert(error.offences.some((o) => o.asset === 'app.js' && /today-app\.cjs/.test(o.what)),
    'the offence names the module that wrote it: ' + error.message);
  const again = await buildToday();
  assert.equal(again.dashes.offences.length, 0);
});

test('P1 — the guard refuses to run blind on a bundle it cannot attribute', () => {
  assert.throws(() => scanBuiltAssets([['app.js', 'const a = "x";']]), (error) => {
    assert.equal(error.code, 'AI_DASH_GUARD_BLIND');
    return true;
  });
  // and it reads an escaped dash, which is how esbuild writes every non-ASCII character
  const bundle = '// rebuild/m3/w7-preview/today/today-app.cjs\nconst a = "spike \\u2014 damped";\n';
  const report = () => scanBuiltAssets([['app.js', bundle]]);
  assert.equal(report().offences.length, 1, 'an escaped dash is still a dash');
  assert(report().offences[0].excerpt.includes('spike'));
});

/* ==========================================================================
   3. EVERY SCREEN STATE, over the same real stack the other today tests use.
   ========================================================================== */
async function todayScreen(options = {}) {
  const fault = options.fault || faultDatabase();
  const readings = options.readings === null ? null
    : options.readings || await createReadingHost({ day: DAY, indexedDB: fault.indexedDB, crypto: webcrypto });
  const doc = dom();
  const model = options.model || createTodayModel({ today: DAY, ...(readings ? { readings } : {}) });
  const api = mountToday(doc, model, options.mount || {});
  return { doc, model, api, readings, fault, close: () => { if (readings) readings.close(); } };
}
async function weighIn(kit, value) {
  await kit.model.weighIn(value);
  kit.api.render('today');
}

test('P1 — Today renders every state it can reach without a dash', async (t) => {
  await t.test('empty, before a weigh-in', async () => {
    const kit = await todayScreen();
    assert.equal(kit.doc.querySelector('[data-slot="morning"]').textContent, 'This morning: not logged yet');
    assertNoDashOnScreen(kit.doc, 'Today, empty');
    assertNoDashOnScreen(kit.doc, 'Today, empty (whole document)', kit.doc.body);
    kit.close();
  });

  await t.test('with a reading whose ENGINE note carries a dash', async () => {
    const reference = createEngine({ clock: engineClockFor(DAY) });
    const note = reference.applyRead(createBasisState(DAY), DAY, 191.7, { hour: 8 }).reads.at(-1).note;
    assert(DASH.test(note), 'this brief needs the engine note to carry the dash it is about: ' + note);
    const kit = await todayScreen();
    await weighIn(kit, 191.7);
    const shown = kit.doc.querySelector('[data-slot="morning"]').textContent;
    assert.equal(shown, plainCopy('This morning ✓ 191.7 lb · ' + note));
    assert(shown.includes('damped in trend'), 'the engine note is still whole: ' + shown);
    assertNoDashOnScreen(kit.doc, 'Today, with a reading');
    kit.close();
  });

  await t.test('the plan explanation, which is the engine writing at length', async () => {
    const kit = await todayScreen();
    await weighIn(kit, 179.4);
    kit.doc.querySelector('[data-go="why"]').click();
    const bodies = [...kit.doc.querySelectorAll('#phone .macro-row p')].map((p) => p.textContent);
    assert(bodies.length >= 5, 'the whole explanation is on screen');
    assert(bodies.join(' ').length > 400, 'and it is the long form');
    assertNoDashOnScreen(kit.doc, 'Why this plan');
    kit.close();
  });

  await t.test('the entry points this slice has not wired', async () => {
    const kit = await todayScreen();
    for (const screen of ['nutrition', 'coach']) {
      kit.api.render(screen);
      assertNoDashOnScreen(kit.doc, 'the ' + screen + ' screen');
    }
    kit.api.render('today');
    for (const name of ['nutrition-state', 'coach-state']) {
      assert.equal(kit.doc.querySelector('[data-slot="' + name + '"]').textContent, 'Not wired yet');
    }
    kit.close();
  });

  await t.test('a workout in progress, recorded, unfinished and refused', async () => {
    for (const summary of [
      { phase: 'active', sets: 2 },
      { phase: 'finished', sets: 6 },
      { phase: 'unfinished', unfinished: { startId: 'op-1', day: '2030-02-04', sets: 1 } },
      { phase: 'blocked', code: 'WORKOUT_SPLIT_NOT_IN_FORCE' },
      null,
    ]) {
      const kit = await todayScreen({ mount: { workout: { summary: () => summary, open: () => {},
        recover: async () => ({ ok: true }) } } });
      await weighIn(kit, 179.4);
      assertNoDashOnScreen(kit.doc, 'Today, workout ' + (summary ? summary.phase : 'no host'));
      kit.close();
    }
  });

  await t.test('a check-in recorded, and a device with no check-in store', async () => {
    for (const summary of [{ durable: true, recorded: true }, { durable: true, recorded: false },
      { durable: false, recorded: false }, null]) {
      const kit = await todayScreen({ mount: { checkin: { summary: () => summary, open: () => {} } } });
      assertNoDashOnScreen(kit.doc, 'Today, check-in ' + JSON.stringify(summary));
      kit.close();
    }
  });

  await t.test('the weigh-in sheet, and the two refusals it can print', async () => {
    const kit = await todayScreen();
    kit.api.openWeighIn();
    assertNoDashOnScreen(kit.doc, 'the weigh-in sheet');
    const input = kit.doc.getElementById('morning-weight');
    const sheet = kit.doc.querySelector('[role="dialog"]');
    for (const value of ['10000', '']) {
      input.value = value;
      sheet.dispatchEvent(new kit.doc.defaultView.Event('submit', { bubbles: true, cancelable: true }));
      await settle();
      assert(kit.doc.getElementById('weigh-error').textContent.trim().length > 0, 'it refused in words');
      assertNoDashOnScreen(kit.doc, 'the weigh-in refusal for "' + value + '"');
    }
    kit.close();
  });

  await t.test('a page with no durable store at all', async () => {
    const kit = await todayScreen({ readings: null });
    assertNoDashOnScreen(kit.doc, 'Today with no store');
    kit.api.render('workout');
    assertNoDashOnScreen(kit.doc, 'the workout entry with no store');
    kit.api.render('recovery');
    assertNoDashOnScreen(kit.doc, 'the check-in with no store');
    kit.close();
  });
});

async function gymDevice(options = {}) {
  const fault = faultDatabase();
  const today = createTodayModel({});
  const state = options.engineState || today.stateFromOps();
  const gymHost = await createGymHost({ day: DAY, engineState: state, indexedDB: fault.indexedDB,
    crypto: webcrypto, plannedSplitSlotId: SLOT });
  return { fault, gymHost, model: createGymModel({ gymHost, sessionTitle: today.read().workout.title }) };
}

test('P1 — the gym card renders every state it can reach without a dash', async (t) => {
  const kit = await gymDevice();
  const doc = dom();
  const phone = doc.getElementById('phone');
  await mountGym(doc, phone, { model: kit.model, onBack: () => {}, onCheckIn: () => {} });

  await t.test('the active set, carrying the engine’s own prescription reason', async () => {
    const view = await kit.model.read();
    assert.equal(view.phase, 'active');
    const reason = [...doc.querySelectorAll('#phone .change')].map((p) => p.textContent).join(' ');
    assert(reason.trim().length > 0, 'the engine reason is on screen');
    assertNoDashOnScreen(doc, 'the active set');
  });

  await t.test('the refusal when no effort answer is given', async () => {
    doc.querySelector('[data-slot="log"]').click();
    await settle(20);
    assert.match(doc.getElementById('gym-error').textContent, /Choose clean reps left/);
    assertNoDashOnScreen(doc, 'the effort refusal');
  });

  await t.test('every open disclosure: why, the setup note and the clean-rep help', async () => {
    for (const action of ['why', 'setup', 'clean-rep']) {
      const link = doc.querySelector('[data-action="' + action + '"]');
      if (!link || link.hidden) continue;
      link.click();
      await settle(20);
      assertNoDashOnScreen(doc, 'the ' + action + ' disclosure');
    }
  });

  await t.test('the saved set and its rest screen', async () => {
    [...doc.querySelectorAll('#phone .choice')].find((c) => c.textContent === '2').click();
    doc.querySelector('[data-slot="log"]').click();
    await settle();
    assert.equal((await kit.model.read()).phase, 'saved');
    assertNoDashOnScreen(doc, 'the saved set');
  });

  await t.test('every remaining set, to the finish screen', async () => {
    for (let guard = 0; guard < 30; guard++) {
      const view = await kit.model.read();
      if (view.phase === 'saved' && view.complete) break;
      if (view.phase === 'saved') {
        doc.querySelector('[data-slot="primary"]').click();
        await settle();
        assertNoDashOnScreen(doc, 'the next active set');
        continue;
      }
      if (view.phase !== 'active') break;
      const choice = [...doc.querySelectorAll('#phone .choice')].find((c) => c.textContent === '2');
      if (choice) choice.click();
      doc.querySelector('[data-slot="log"]').click();
      await settle();
      assertNoDashOnScreen(doc, 'set ' + guard + ' saved');
    }
    const view = await kit.model.read();
    assert(view.complete, 'the session really reached its last set');
    assert.match(doc.querySelector('[data-slot="primary-label"]').textContent, /Finish this workout/);
    assertNoDashOnScreen(doc, 'the finish screen');
  });

  await t.test('the finished workout', async () => {
    doc.querySelector('[data-slot="primary"]').click();
    await settle();
    const after = dom();
    await mountGym(after, after.getElementById('phone'), { model: kit.model, onBack: () => {} });
    assert.equal((await kit.model.read()).phase, 'finished');
    assertNoDashOnScreen(after, 'the finished workout');
  });

  kit.gymHost.close();
});

test('P1 — a refusal from the accepted layer reaches the gym card without a dash', async () => {
  const base = createTodayModel({}).stateFromOps();
  const future = JSON.parse(JSON.stringify(base));
  future.split = [{ from: '2031-01-01', map: base.split[0].map }];
  const kit = await gymDevice({ engineState: future });
  const doc = dom();
  await mountGym(doc, doc.getElementById('phone'), { model: kit.model, onBack: () => {} });
  const shown = doc.getElementById('phone').textContent;
  assert.match(shown, /WORKOUT_SPLIT_NOT_IN_FORCE/, 'the layer’s own code is printed');
  assertNoDashOnScreen(doc, 'a layer refusal on the gym card');
  kit.gymHost.close();
});

async function checkInScreen(options = {}) {
  const fault = options.fault || faultDatabase();
  const host = options.host || await createCheckInHost({ day: DAY, indexedDB: fault.indexedDB, crypto: webcrypto });
  const model = createCheckInModel({ host, day: DAY, ...(options.engineState ? { engineState: options.engineState } : {}) });
  await model.refresh();
  const doc = dom();
  mountCheckIn(doc, doc.getElementById('phone'), { model, onBack: () => {}, onChanged: () => {} });
  return { fault, host, model, doc };
}
const optionByLabel = (doc, label) =>
  [...doc.querySelectorAll('#phone .option, #phone .choice')].find((b) => b.textContent.trim() === label);

test('P1 — the recovery check-in renders every branch without a dash', async (t) => {
  const stateWithoutLastNight = () => {
    const state = createTodayModel({}).stateFromOps();
    const previous = new Date(Date.UTC(...DAY.split('-').map(Number).map((n, i) => (i === 1 ? n - 1 : n))));
    previous.setUTCDate(previous.getUTCDate() - 1);
    const before = previous.toISOString().slice(0, 10);
    if (state.sleep && Array.isArray(state.sleep.nights)) {
      state.sleep.nights = state.sleep.nights.filter((n) => n.d !== before);
    }
    return state;
  };

  await t.test('the blank sheet, every question unanswered', async () => {
    const kit = await checkInScreen({ engineState: stateWithoutLastNight() });
    assert.match(kit.doc.getElementById('phone').textContent, /Nothing is recorded yet/);
    assertNoDashOnScreen(kit.doc, 'the blank check-in');
    kit.host.close();
  });

  await t.test('an existing dated sleep night, offered for confirmation', async () => {
    const kit = await checkInScreen();
    const view = kit.model.read();
    if (view.sleepRecord) {
      assert(kit.doc.querySelector('[data-slot="sleep-known"]').hidden === false, 'the record is offered');
      assertNoDashOnScreen(kit.doc, 'the sleep record offered');
      optionByLabel(kit.doc, 'No: answer it here').click();
      await settle(20);
      assertNoDashOnScreen(kit.doc, 'after answering the sleep question here');
    }
    kit.host.close();
  });

  await t.test('every conditional branch open at once', async () => {
    const kit = await checkInScreen({ engineState: stateWithoutLastNight() });
    for (const label of ['Low', 'Mild', 'High', 'Pain', 'Feeling ill', 'Time away']) {
      const button = optionByLabel(kit.doc, label);
      if (button) { button.click(); await settle(10); }
    }
    const shown = kit.doc.getElementById('phone').textContent;
    assert.match(shown, /Where, and during which movement\?/, 'the pain branch is open');
    assertNoDashOnScreen(kit.doc, 'every conditional branch open');
    kit.host.close();
  });

  await t.test('the form bounds, which refuse in words', async () => {
    const kit = await checkInScreen({ engineState: stateWithoutLastNight() });
    const hours = kit.doc.querySelector('#phone [data-field="sleep_hours"]');
    hours.value = '99';
    hours.dispatchEvent(new kit.doc.defaultView.Event('input', { bubbles: true }));
    kit.doc.querySelector('#phone [data-slot="primary"]').click();
    await settle();
    assert(kit.doc.getElementById('checkin-error').textContent.trim().length > 0, 'it refused in words');
    assertNoDashOnScreen(kit.doc, 'the check-in form bound');
    kit.host.close();
  });

  await t.test('a recorded check-in, read back with its provenance', async () => {
    const fault = faultDatabase();
    const kit = await checkInScreen({ fault, engineState: stateWithoutLastNight() });
    optionByLabel(kit.doc, 'Low').click();
    await settle(10);
    kit.doc.querySelector('#phone [data-slot="primary"]').click();
    await settle();
    assert(kit.model.read().recorded, 'the check-in is recorded');
    assertNoDashOnScreen(kit.doc, 'the recorded check-in');

    // and on a genuinely new screen over the same store
    const again = await checkInScreen({ fault, host: kit.host, engineState: stateWithoutLastNight() });
    assert.match(again.doc.getElementById('phone').textContent, /already recorded on this device/);
    assertNoDashOnScreen(again.doc, 'the check-in reopened');
    kit.host.close();
  });
});

/* ==========================================================================
   4. THE FROZEN SOURCES ARE NOT EDITED, AND THEIR WORDS STILL ARRIVE WHOLE.
   ========================================================================== */
test('P1 — this brief edits nothing outside today/, and the engine still writes dashes', () => {
  const engineDir = path.join(design.ROOT, 'rebuild/engine');
  let dashedFiles = 0;
  for (const name of fs.readdirSync(engineDir)) {
    if (!name.endsWith('.cjs')) continue;
    if (DASH.test(fs.readFileSync(path.join(engineDir, name), 'utf8'))) dashedFiles += 1;
  }
  assert(dashedFiles > 5, 'rebuild/engine is untouched and still full of dashes: ' + dashedFiles);
});

test('P1 — every word of a dashed sentence survives the rewrite', () => {
  const cases = [
    ['Nothing to fix — hold the line', 'Nothing to fix: hold the line'],
    ['Restore required — sign in (T2_INTEGRITY_UNPROVEN)', 'Restore required: sign in (T2_INTEGRITY_UNPROVEN)'],
    ['its range is 1.08–1.26 lb/week.', 'its range is 1.08 to 1.26 lb/week.'],
  ];
  for (const [before, after] of cases) {
    assert.equal(plainCopy(before), after);
    const words = before.split(/[\s–—]+/).filter(Boolean);
    for (const word of words) assert(plainCopy(before).includes(word), word);
  }
});

/* The design binding's ONE dash-normalised term, named here so a second one cannot be
   added without a test change and a line in the report (bar item 3). */
test('P1 — exactly one harvested approved term is dash-normalised, and it is named', () => {
  const approved = design.readApproved();
  const report = design.assertRecoveryBinding(approved, design.templateHtml());
  assert.deepEqual(report.dashNormalised,
    [{ kind: 'placeholders', approved: '—', shipped: '' }]);
});
