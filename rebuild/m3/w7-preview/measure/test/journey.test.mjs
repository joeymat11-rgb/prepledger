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
  pickMarkersOnScreen, typeWaist, measureScreenReady, waitForTrialTable } from './support.mjs';
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
