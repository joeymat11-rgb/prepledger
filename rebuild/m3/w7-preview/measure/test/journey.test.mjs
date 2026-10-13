/* P-MEASURE v1, ROUND 3 - BAR ITEM (a), EXECUTED.
   The real Today route in jsdom over fake-indexeddb, on an enrolled
   installation, fed by twelve synthetic weeks entered through the real
   commands, with the markers picked through the real screen, and the RENDERED
   table asserted week by week against the committed hand-computed table in
   measure-fixture.json. This is the cell review R2 findings 1, 2, 6 and 7 all
   turn on: round 2 had no cell that mounted anything. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { faultDatabase, FIXTURE, enrol, enterFixture, page, tableOf,
  pickMarkersOnScreen, typeWaist, measureScreenReady, waitForTrialTable, settle } from './support.mjs';
import Model from '../../today/setup-model.mjs';

/* A DEVICE PER CELL, and the second half of the DECISIONS:482 stop 6 cause.
   What stood here memoised ONE trialDevice() promise for the whole file, so (a), (d)
   and (e) all read the SAME store and the same half-drained page state. That is why
   the windows-latest flake took (a) and (d) TOGETHER: (d) ran onMeasure() over the
   store (a) had written and branched on `view.pick('measure-marker-pick')`, so it
   inherited whatever (a) left behind when the old fixed drain gave up early. A cell
   that fails because of what another cell left is not diagnosable from its own output.
   Each cell now builds its own device and owns its own store. It costs what twelve
   weeks of real commands cost, three times over instead of once, and that is the
   honest price of a cell whose result depends on nothing but itself. Nothing about
   the subjects moves: the same fixture, the same commands, the same assertions. */
async function trialDevice() {
  const fault = faultDatabase();
  const built = await enrol(fault);
  const basis = Model.createCleanInitState({ setup: built.setup });
  await enterFixture(fault, FIXTURE.entries, basis);
  return { fault, basis };
}

/* The screen as the athlete reaches it: pick the markers once, type the last
   two waist readings, and the comparison stands. */
async function onMeasure(fault, basis, options = {}) {
  const view = await page(fault, { basis, ...options });
  await view.go('measure-tile', measureScreenReady(view),
    'the measure screen to finish loading into either its marker pick or its trial table');
  if (view.pick('measure-marker-pick')) {
    await pickMarkersOnScreen(view);
    for (const row of FIXTURE.entries.waist.slice(-2)) await typeWaist(view, row);
  }
  /* The screen this helper promises its callers is the LOADED one: every cell below
     reads the table, the export block or the trial-start line off it immediately. */
  await waitForTrialTable(view);
  return view;
}

test('P-MEASURE (a) - the real route renders the trial table week by week, against the committed table', async () => {
  const { fault, basis } = await trialDevice();
  const view = await page(fault, { basis });
  await view.go('measure-tile', measureScreenReady(view),
    'the measure screen to finish loading into either its marker pick or its trial table');
  assert(view.pick('measure-marker-pick'), 'the markers pick screen is not offered');
  const offered = await pickMarkersOnScreen(view);
  assert.equal(offered, 3, 'the pick offers this device\'s own three lifts');
  /* The last two waist readings are TYPED INTO THE SCREEN, not written behind
     it: the box the athlete sees is the one that records them. */
  for (const row of FIXTURE.entries.waist.slice(-2)) await typeWaist(view, row);
  await waitForTrialTable(view);
  const table = tableOf(view);
  assert(table, 'no trial table rendered');
  assert.deepEqual(table[0], FIXTURE.header, 'the rendered header');
  assert.equal(table.length, FIXTURE.expected.length + 1,
    'twelve weekly rows plus the header');
  for (const row of FIXTURE.expected) {
    const rendered = table[row.week];
    const label = 'Week ' + row.week + (row.week <= 2 ? ' (run in)' : '');
    assert.deepEqual(rendered, [label, ...row.cells], 'week ' + row.week + ' as rendered');
  }
  await view.close();
});

/* BAR ITEM (d). Review R2 finding 3: exportText was called from nowhere but a
   test file. The control is on the screen, and what it renders IS the table. */
test('P-MEASURE (d) - the export block text equals the rendered table, cell for cell', async () => {
  const { fault, basis } = await trialDevice();
  const view = await onMeasure(fault, basis);
  assert.equal(view.pick('measure-export-text'), null, 'the block is shown before it is asked for');
  await view.go('measure-export', () => view.pick('measure-export-text'),
    'the copyable export block to be rendered after the export control was used');
  const block = view.pick('measure-export-text');
  assert(block, 'no copyable block after the export control was used');
  assert.equal(block.tagName, 'TEXTAREA');
  assert.equal(block.readOnly, true, 'the block is editable');
  const lines = block.value.split('\n');
  const table = tableOf(view);
  for (const row of FIXTURE.expected) {
    const label = 'Week ' + row.week + (row.week <= 2 ? ' (run in)' : '');
    const line = [label, ...row.cells].join(' | ');
    assert(lines.includes(line), 'the export is missing the rendered week ' + row.week + ': ' + line);
    assert.deepEqual(table[row.week], [label, ...row.cells], 'week ' + row.week + ' still renders');
  }
  assert(lines.includes(FIXTURE.header.join(' | ')), 'the export header is not the rendered header');
  /* NO VERDICTS, NO COACHING COPY (plan section 4 (3)), and no dash. */
  const words = block.value.toLowerCase();
  for (const word of ['pass', 'fail', 'good', 'bad', 'better', 'worse', 'verdict', 'recommend', 'should']) {
    assert.equal(words.includes(word), false, 'the export judges the numbers: ' + word);
  }
  const aiDash = new RegExp('[' + String.fromCharCode(0x2013, 0x2014) + ']');
  assert.equal(aiDash.test(block.value), false, 'an en or em dash in the exported table');
  await view.close();
});

/* BAR ITEM (e). Review R2 finding 2: `startDate: model.today` re-based the
   window every morning, so weeks 2 to 12 could never exist. Day one is the
   first enrolled record's own local date, written once. */
test('P-MEASURE (e) - trial day one is the first enrolled record, and survives a reload and a later day', async () => {
  const { fault, basis } = await trialDevice();
  const first = await onMeasure(fault, basis);
  assert.equal(first.pick('measure-trial-start').textContent,
    'Trial day one: ' + FIXTURE.trialStart);
  assert.equal(await first.lane.trialStart(), FIXTURE.trialStart);
  assert.equal(await first.lane.firstEnrolledDate(), FIXTURE.trialStart,
    'day one is not the enrolment record\'s own date');
  await first.close();

  /* A RELOAD: a whole new page, a new lane, the same store. */
  const again = await onMeasure(fault, basis);
  assert.equal(again.pick('measure-trial-start').textContent,
    'Trial day one: ' + FIXTURE.trialStart);
  await again.close();

  /* A LATER DAY. The window is unchanged: week 1 still starts on day one and
     still renders the same row, and a thirteenth week is never invented. */
  const later = await onMeasure(fault, basis, { today: '2026-04-02' });
  assert.equal(await later.lane.trialStart(), FIXTURE.trialStart,
    'a later day re-based the trial');
  const table = tableOf(later);
  assert.deepEqual(table[1], ['Week 1 (run in)', ...FIXTURE.expected[0].cells],
    'week 1 changed when the clock moved');
  assert.equal(table.length, 13, 'the window past week 12 is not capped');
  await later.close();
});

/* E2a (PM, the E2 scope; no engine change). ABOUT YOU on the real Measure route:
   height and sex, then the body-fat band, said back ("Body fat: 12-15% (your
   estimate)") with a Change control beside each answer, which asks the question
   again with the answer held filled in; a new save is a new record and the
   latest wins (the PM's ruling on E2a). "I don't know" and "Not now" are kept, so
   neither question nags, and both stay changeable; a refusal is said in words and
   writes nothing. An enrolled device with no trial data is enough: the section
   stands beside the comparison, not inside it. Every value is invented. Red
   first: on 3d13efe the screen has no About you section. */
async function aboutDevice() {
  const fault = faultDatabase();
  const built = await enrol(fault);
  return { fault, basis: Model.createCleanInitState({ setup: built.setup }) };
}
async function aboutScreen(fault, basis) {
  const view = await page(fault, { basis });
  await view.go('measure-tile', measureScreenReady(view),
    'the measure screen to finish loading into either its marker pick or its trial table');
  if (view.pick('measure-marker-pick')) await pickMarkersOnScreen(view);
  await settle(() => view.pick('measure-about') && view.pick('measure-trial-table'),
    'the About you section and the trial table to be on the Measure screen');
  return view;
}
const saidOf = (view) => view.all('[data-slot="measure-about-said"]').map((p) => p.textContent);
const changesOf = (view) => view.all('[data-slot="measure-about-change"]').map((b) => b.textContent + '|' + b.getAttribute('aria-label'));
const chooseRadio = (view, name, value) => {
  const radio = view.all('input[name="' + name + '"]').find((r) => r.value === value);
  assert(radio, 'no ' + name + ' choice ' + value);
  radio.checked = true;
};
const LEAD = 'Optional. Skip anything you like, and change it later.';

test('E2A-J1 - height and sex, then the band: asked on Measure, said back with Change, changed, and still said after a reload', async () => {
  const { fault, basis } = await aboutDevice();
  const view = await aboutScreen(fault, basis);
  assert.equal(view.pick('measure-about').querySelector('h2').textContent, 'About you');
  assert.equal(view.pick('measure-about-lead').textContent, LEAD);
  assert(view.pick('measure-body-entry') && view.pick('measure-band-pick'), 'both questions are asked');
  assert.deepEqual(view.all('[data-slot="measure-band-set"]').map((s) => s.dataset.set), ['male', 'female'],
    'with no sex recorded both tables are offered');
  assert.deepEqual(view.all('[data-slot="measure-band-option"] .title').map((s) => s.textContent),
    ['8-11%', '12-15%', '16-20%', '21-25%', '26% or more', '15-19%', '20-24%', '25-29%', '30-34%', '35% or more']);
  assert.equal(view.all('[data-slot="measure-band-line"]').length, 10, 'one plain line per band');
  assert.equal(view.pick('measure-band-unknown').textContent, 'I don\'t know', 'I don\'t know is a choice like any band');
  assert.deepEqual([view.pick('measure-band-save').textContent, view.pick('measure-band-save').className], ['Save', 'save'], 'the pack\'s Save pill');

  chooseRadio(view, 'measure-sex', 'male');
  view.pick('measure-height-feet').value = '5';
  view.pick('measure-height-inches').value = '10';
  view.pick('measure-body-save').click();
  await settle(() => saidOf(view).includes('Height: 5 ft 10 in') && view.pick('measure-band-pick'),
    'the height and sex to be said back');
  assert.deepEqual(view.all('[data-slot="measure-band-set"]').map((s) => s.dataset.set), ['male'],
    'once he is recorded male, the bands for men alone');
  chooseRadio(view, 'measure-band', 'men:12:15');
  view.pick('measure-band-save').click();
  await settle(() => saidOf(view).includes('Body fat: 12-15% (your estimate)'), 'the band to be said back');
  assert.deepEqual(saidOf(view), ['Height: 5 ft 10 in', 'Sex: Male', 'Body fat: 12-15% (your estimate)']);
  assert.deepEqual(changesOf(view), ['Change|Change height and sex', 'Change|Change height and sex', 'Change|Change body fat'],
    'a Change beside each saved answer');
  assert.deepEqual(view.all('[data-slot="measure-about-sep"]').map((s) => s.getAttribute('aria-hidden')), ['true', 'true', 'true']);
  assert.equal(view.pick('measure-band-pick'), null, 'the band is not asked again');
  assert.equal(view.pick('measure-body-entry'), null);

  /* CHANGE: the question again, the answer held filled in and focused; a save is a new record and the latest wins */
  view.all('[data-slot="measure-about-change"]')[2].click();
  await settle(() => view.pick('measure-band-pick'), 'the band question to open again');
  const held = view.all('input[name="measure-band"]').find((r) => r.checked);
  assert.equal(held && held.value, 'men:12:15', 'the answer held is filled in');
  assert.equal(view.doc.activeElement, held, 'and focused');
  chooseRadio(view, 'measure-band', 'men:16:20');
  view.pick('measure-band-save').click();
  await settle(() => saidOf(view).includes('Body fat: 16-20% (your estimate)'), 'the changed band to be said back');
  const band = await view.lane.bodyFatBand(), body = await view.lane.bodyProfile();
  assert.deepEqual([band.low, band.high, band.source, band.table, body.sex, body.height.value, body.height.unit],
    [16, 20, 'self-estimate', 'men', 'male', 70, 'in'], 'what the screen said is what the store holds, the table it came from with it');
  assert(view.pick('measure-trial-table'), 'the comparison still stands');
  await view.close();

  const again = await aboutScreen(fault, basis);
  assert.deepEqual(saidOf(again), ['Height: 5 ft 10 in', 'Sex: Male', 'Body fat: 16-20% (your estimate)'], 'after a reload');
  assert.equal(again.pick('measure-body-entry'), null);
  assert.equal(again.pick('measure-band-pick'), null);
  await again.close();
});

test('E2A-J2 - "Not now" and "I don\'t know" are kept and never nag, stay changeable, and a refusal is said in words and writes nothing', async () => {
  const { fault, basis } = await aboutDevice();
  const view = await aboutScreen(fault, basis);
  /* refusals first: nothing chosen, and a height outside the boxes' range */
  view.pick('measure-band-save').click();
  await settle(() => view.pick('measure-band-error') && !view.pick('measure-band-error').hidden, 'the band refusal');
  assert.equal(view.pick('measure-band-error').textContent, 'Choose a range, or I don\'t know.');
  view.pick('measure-height-feet').value = '9';
  view.pick('measure-body-save').click();
  await settle(() => view.pick('measure-body-error') && !view.pick('measure-body-error').hidden, 'the height refusal');
  assert.equal(view.pick('measure-body-error').textContent, 'Height in feet and inches, from 3 ft to 8 ft.');
  view.pick('measure-height-feet').value = '';
  view.pick('measure-body-save').click();
  await settle(() => view.pick('measure-body-error') && view.pick('measure-body-error').textContent === 'Choose an answer, or Not now.',
    'the nothing-chosen refusal');
  assert.equal(await view.lane.bodyFatBand(), null, 'a refusal wrote a band');
  assert.equal(await view.lane.bodyProfile(), null, 'a refusal wrote a profile');

  view.pick('measure-body-skip').click();
  await settle(() => !view.pick('measure-body-entry') && view.pick('measure-band-pick'), 'Not now to be kept, and the band asked');
  assert.deepEqual(saidOf(view), ['Height and sex: not given'], 'Not now is said back, with its Change');
  assert.deepEqual(view.all('[data-slot="measure-band-set"]').map((s) => s.dataset.set), ['male', 'female']);
  chooseRadio(view, 'measure-band', 'unknown');
  view.pick('measure-band-save').click();
  await settle(() => saidOf(view).includes('Body fat: not known'), 'I don\'t know to be said back');
  assert.equal(view.pick('measure-band-pick'), null);
  const band = await view.lane.bodyFatBand(), body = await view.lane.bodyProfile();
  assert.deepEqual([band.low, band.high, band.source, band.table], [null, null, 'unknown', null]);
  assert.deepEqual([body.sex, body.height], [null, null]);
  await view.close();

  const again = await aboutScreen(fault, basis);
  assert.deepEqual(saidOf(again), ['Height and sex: not given', 'Body fat: not known'], 'after a reload');
  assert.equal(again.pick('measure-body-entry'), null, 'Not now was asked again');
  assert.equal(again.pick('measure-band-pick'), null, 'I don\'t know was asked again');
  /* "Not now" is not a permanent block: Change asks again, with no Not now on a question already answered */
  again.all('[data-slot="measure-about-change"]')[0].click();
  await settle(() => again.pick('measure-body-entry'), 'the height and sex question to open again');
  assert.equal(again.pick('measure-body-skip'), null, 'Not now is offered only before a first answer');
  chooseRadio(again, 'measure-sex', 'female');
  again.pick('measure-body-save').click();
  await settle(() => saidOf(again).includes('Sex: Female'), 'the changed answer to be said back');
  assert.deepEqual(saidOf(again), ['Sex: Female', 'Body fat: not known']);
  assert.equal((await again.lane.bodyProfile()).sex, 'female');
  await again.close();
});
