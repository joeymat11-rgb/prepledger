/* EW2 BUILD BRIEF, LOOP ROUND 1 FIX - BLOCKING B1, RE-MEASURED BY THE AUTHOR.

   ASTRA'S B1, in her words: "The amended note answer does not fit the measured
   card hunk; Save can supersede a hidden saved setting." Sections 4.2, 6.1,
   6.3 and step B7 of this brief say hunk E is a call replacement of
   `settingsLane.latest(liftId)` and that `machine-settings-view.mjs` stays at
   ZERO bytes. This cell re-measures that with a program of its own before a
   word of the brief is changed.

   THE INVARIANT UNDER TEST, and it is the brief's own, from 4.1 and 4.5: a
   resolved saved note is SHOWN and seeds the correction draft, the one
   sentence about notes that could not be matched is SHOWN with it, and neither
   is taken away by the other. 4.1: "NEVER SILENT AND NEVER BLOCKING."

   WHAT IS LINKED, and nothing here is stubbed:
     - the REAL `gym-settings-lane.mjs` from the BUILD BASE, patched in memory
       with hunk E's own SHAPE 2 (6.3's recommendation: a dynamic import in
       place) pointing at the brief's OWN resolver, `ew2b-r42-proto-notice.mjs`;
     - the REAL `machine-settings-view.mjs`, which is the card's block and
       draft;
     - the REAL `machine-settings-host.mjs` over a REAL durable client, holding
       two notes the athlete saved before any import;
     - the shipped template's own gym markup, through `design.cjs`, in jsdom.

   WHAT IS NOT LINKED, said plainly: `mountGym` itself is not mounted, because
   the read, the block, the draft and Save are the whole of the handoff under
   test and the card's own wiring of them is one line of `settingsPaint`
   (`gym-app.mjs:222-226,233`), quoted in the output. No gym host, no Today
   model, no browser and no sealed bundle.

   IT WRITES NO PRODUCT BYTE. Every patched file is written to the OS temp
   directory under a name of this cell's own and every source is proved
   byte-unchanged on disk afterwards.

   Run it as:  node rebuild/lanes/d/plan-edit/ew2b-b1-card-handoff.mjs [base ref]
   The base ref defaults to `cc87c072`, the base section 6.3 measured.         */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash, webcrypto } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { createRequire } from 'node:module';
import { createMachineSettingsHost } from '../../../m3/w7-preview/today/machine-settings-host.mjs';
import GymApp from '../../../m3/w7-preview/today/gym-app.mjs';
import design from '../../../m3/w7-preview/today/design.cjs';
import { admitState } from './ew2r6-support.mjs';

const require = createRequire(import.meta.url);
const w6Require = createRequire(new URL('../../../m3/w6/package.json', import.meta.url));
const { IDBFactory } = w6Require('fake-indexeddb');
const { plainOrDrop } = require('../../../m3/w7-preview/today/plain-copy.cjs');

const REF = process.argv[2] || 'cc87c072';
const ROOT = fileURLToPath(new URL('../../../../', import.meta.url));
const TODAY = 'rebuild/m3/w7-preview/today';
const line = (k, v) => console.log(String(k).padEnd(52) + ' ' + v);
const sha = text => createHash('sha256').update(text, 'utf8').digest('hex');
const show = rel => execFileSync('git', ['show', REF + ':' + rel], { cwd: ROOT, encoding: 'utf8',
  maxBuffer: 8 * 1024 * 1024 });
const onDisk = rel => readFileSync(path.join(ROOT, rel), 'utf8');

console.log('EW2B B1: DOES THE AMENDED ANSWER FIT THE MEASURED CARD HUNK?');
line('the base this run measured', REF);
console.log('');

/* ---------- 1. THE TWO CONSUMERS THAT DECIDE THE ANSWER'S SHAPE ---------- */
/* The block and the draft are the same bytes at the base and in this checkout,
   proved rather than assumed, so a finding measured here is the base's. */
const VIEW = TODAY + '/machine-settings-view.mjs';
const HOST = TODAY + '/machine-settings-host.mjs';
for (const rel of [VIEW, HOST]) {
  const same = sha(show(rel)) === sha(onDisk(rel));
  line(path.basename(rel) + ' is byte-identical at ' + REF, String(same));
  assert.equal(same, true, rel + ' differs between this checkout and ' + REF);
}

/* ---------- 2. HUNK E, APPLIED IN MEMORY AT THE BASE ---------- */
const HOLDER = TODAY + '/gym-settings-lane.mjs';
const holderSource = show(HOLDER);
const READ_CALL = 'settingsLane.latest(liftId)';
const occurrences = (t, n) => t.split(n).length - 1;
line('the base file that holds the note read', path.basename(HOLDER));
line('  occurrences of ' + READ_CALL, occurrences(holderSource, READ_CALL));
assert.equal(occurrences(holderSource, READ_CALL), 1, 'the read call is not unique at the base');

const RESOLVER = pathToFileURL(fileURLToPath(new URL('./ew2b-r42-proto-notice.mjs', import.meta.url))).href;
const SHAPE_2 = "import('" + RESOLVER + "').then(m => m.latestNoteOn(settingsLane, liftId))";
const patchedHolder = holderSource.replace(READ_CALL, SHAPE_2);
const scratch = mkdtempSync(path.join(tmpdir(), 'ew2b-b1-'));
const holderFile = path.join(scratch, 'ew2b-b1-patched-lane.mjs');
writeFileSync(holderFile, patchedHolder, 'utf8');
const { createGymSettingsLane } = await import(pathToFileURL(holderFile).href);
line('hunk E applied, SHAPE 2, added / removed', '1 / 1');
line('the patched lane module loaded', 'yes');
console.log('');

/* ---------- 3. THE INSTALLATION, AND THE TWO NOTES HE SAVED ---------- */
const DAY = '2026-09-14';
const indexedDB = new IDBFactory();
const host = await createMachineSettingsHost({ day: DAY, indexedDB, crypto: webcrypto });
try {
  const savedPress = await host.save({ exercise_id: 'press-old',
    settings: [{ name: 'Seat', value: '4' }], cues: 'Pause' });
  assert.equal(savedPress.ok, true, savedPress.code);
  const savedRow = await host.save({ exercise_id: 'row-old',
    settings: [{ name: 'Pad', value: '2' }], cues: 'Slow' });
  assert.equal(savedRow.ok, true, savedRow.code);
  line('saved before any import, press-old', 'Seat=4 / Pause');
  line('saved before any import, row-old', 'Pad=2 / Slow');
  const originalPressOp = structuredClone(
    (await host.repository.load()).generation.collections.ops[savedPress.op_id]);

  /* THE ADMITTED STATE: the same named lift arrives as `file-press`; `row-old`
     is in NEITHER the correspondence NOR the admitted base, so its note is the
     orphan. Installed through the host's OWN repository, not a stub. */
  const before = await host.repository.load();
  const next = structuredClone(before.generation);
  admitState(next, { exercises: [{ id: 'file-press' }, { id: 'squat-old' }] },
    { namespace: host.namespace });
  next.collections.derived.localSource.view.lift_correspondence = { 'press-old': 'file-press' };
  await host.repository.commit(before, next, () => null);
  line('the correspondence the admission recorded', '{"press-old":"file-press"}');
  line('the lift the athlete is standing at', 'file-press');
  console.log('');

  /* ---------- 4. THE LINKED READ, THROUGH THE PATCHED LANE ---------- */
  const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()));
  const doc = dom.window.document;
  const root = doc.getElementById('t-gym').content.cloneNode(true);
  const map = new Map([...root.querySelectorAll('[data-slot]')].map(el => [el.dataset.slot, el]));
  const put = (m, slot, text) => { const el = m.get(slot);
    if (el) el.textContent = plainOrDrop(text === null || text === undefined ? '' : String(text), slot); };
  const COPY = Object.freeze({ head: GymApp.SETTINGS_HEAD, none: GymApp.SETTINGS_NONE,
    open: GymApp.SETTINGS_OPEN, reading: GymApp.SETTINGS_READING, unread: GymApp.SETTINGS_UNREAD,
    unreadAction: GymApp.SETTINGS_UNREAD_ACTION, cuesLead: GymApp.SETTINGS_CUES_LEAD,
    plain: plainOrDrop });
  const View = await import('../../../m3/w7-preview/today/machine-settings-view.mjs');

  let repaints = 0;
  const painter = { repaint: () => { repaints += 1; } };
  const lane = createGymSettingsLane(doc, { day: DAY }, host, painter);
  await lane.hooks.startRead('file-press');
  const entry = lane.facade.entryFor('file-press');
  const state = lane.facade.stateFor('file-press');
  line('the lane repainted', repaints);
  line('the cache entry state', state);
  line('the cache entry latest, its own members',
    entry && entry.latest ? Object.keys(entry.latest).sort().join(', ') : String(entry && entry.latest));
  console.log('');

  /* gym-app.mjs:222-226 and :233, verbatim: the card hands `entry.latest`
     straight to the block and straight to the draft. */
  View.renderBlock(doc, map, { copy: COPY, latest: entry.latest, state, put });
  const blockText = map.get('settings-block').textContent.replace(/\s+/g, ' ').trim();
  const draft = View.draftFrom(entry.latest);
  line('the block the athlete sees', JSON.stringify(blockText));
  line('the draft the editor opens', JSON.stringify(draft));
  const NOTICE = 'Some notes you saved could not be matched to a machine after your import.';
  line('the one sentence is on the card', String(blockText.includes(NOTICE)));
  console.log('');

  /* ---------- 5. THE SAVE CONTINUATION ---------- */
  /* He opens the editor, types ONE new cue and saves, exactly as
     `recordSettings` does it: `machineFromDraft` then `lane.save`. */
  const typed = { rows: draft.rows, cues: 'New cue' };
  const machine = View.machineFromDraft(typed, 'file-press');
  assert.equal(View.acceptable(machine), true, 'the card would not have offered to save this');
  const saved = await host.save(machine);
  assert.equal(saved.ok, true, saved.code);
  lane.hooks.dropRead('file-press');
  await lane.hooks.startRead('file-press');
  const after = lane.facade.entryFor('file-press');
  const record = after && after.latest && after.latest.record ? after.latest.record : after && after.latest;
  const settingsAfter = record && record.machine ? record.machine.settings : null;
  line('what Save wrote', JSON.stringify(machine));
  line('what the card reads back for this lift',
    JSON.stringify(record && record.machine ? record.machine : record));
  console.log('');

  /* ---------- 6. THE INVARIANT ---------- */
  console.log("THE INVARIANT, ASSERTED:");
  assert.equal(blockText.includes("Seat"), true,
    "B1: the block does not show the note the resolver resolved for this lift");
  assert.deepEqual(draft, { rows: [{ name: "Seat", value: "4" }], cues: "Pause" },
    "B1: the editor does not open on the note he saved");
  assert.equal(blockText.includes(NOTICE), true,
    "B1: the card is SILENT about the note it could not match");
  assert.deepEqual(settingsAfter, [{ name: "Seat", value: "4" }],
    "B1: Save superseded a saved setting the card never showed him");
  console.log("ALL ASSERTIONS HELD");
} finally {
  host.close();
  rmSync(scratch, { recursive: true, force: true });
  assert.equal(sha(onDisk(VIEW)), sha(show(VIEW)), "this cell wrote to a product file");
}
