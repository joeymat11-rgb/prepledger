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

  /* ---------- 6. B1, PINNED ---------- */
  console.log('B1, PINNED BY NAME (Astra\'s finding, reproduced by this author):');
  assert.equal(blockText.includes('Seat'), false);
  assert.equal(blockText.includes(GymApp.SETTINGS_NONE), true);
  assert.deepEqual(draft, { rows: [{ name: '', value: '' }], cues: '' });
  assert.equal(blockText.includes(NOTICE), false);
  assert.deepEqual(settingsAfter, undefined);
  console.log('  The hunk the brief specifies hands the ANSWER to a cache, a block');
  console.log('  and a draft that all consume a bare RECORD. The block says "'
    + GymApp.SETTINGS_NONE + '",');
  console.log('  the sentence is nowhere, the editor opens BLANK, and one new cue');
  console.log('  saved over that blank draft supersedes Seat=4 without ever showing');
  console.log('  it to him. B1 STANDS AND IS NOT DISPUTED.');
  console.log('');

  /* ================= 7. THE CORRECTED HANDOFF, COUNTED ================= */
  /* Three consumers, named, and a fourth file for the WORD. Each patch is
     applied in memory, counted by line diff, and proved to parse. */
  const diff = (a, b) => {
    const m = a.length, n = b.length;
    const lcs = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--)
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    let i = 0, j = 0, added = 0, removed = 0;
    while (i < m && j < n) {
      if (a[i] === b[j]) { i++; j++; }
      else if (lcs[i + 1][j] >= lcs[i][j + 1]) { removed++; i++; }
      else { added++; j++; }
    }
    return { added: added + (n - j), removed: removed + (m - i) };
  };
  const only = (text, needle) => {
    assert.equal(occurrences(text, needle), 1, 'anchor is not unique: ' + needle.slice(0, 48));
    return text;
  };
  const parses = async text => {
    try { await import('data:text/javascript;base64,' + Buffer.from(text).toString('base64')); return true; }
    catch (error) { return !/SyntaxError/.test(String(error && error.name)); }
  };

  /* E1, gym-settings-lane.mjs: the READ, and the CACHE that receives it. The
     lane stores the bare record and a BOOLEAN, never a sentence: copy is not
     this file's to own. */
  const E1_READ_OLD = '      .then(() => settingsLane.latest(liftId))';
  const E1_READ_NEW = "      .then(() => import('./machine-note-identity.mjs')"
    + '\n        .then((m) => m.latestNoteOn(settingsLane, liftId)))';
  const E1_CACHE_OLD =
    "        (latest) => { settingsRead.set(liftId, { state: 'known', latest: latest || null }); },";
  const E1_CACHE_NEW =
    "        (answer) => { settingsRead.set(liftId, { state: 'known',"
    + '\n          latest: (answer && answer.record) || null,'
    + '\n          unmatched: !!(answer && answer.untranslated && answer.untranslated.length) }); },';
  const e1 = only(only(holderSource, E1_READ_OLD), E1_CACHE_OLD)
    .replace(E1_READ_OLD, E1_READ_NEW).replace(E1_CACHE_OLD, E1_CACHE_NEW);
  const e1Count = diff(holderSource.split('\n'), e1.split('\n'));

  /* E2, gym-app.mjs: the WORD, its place in the card's own copy table, and the
     one line of `settingsPaint` that hands it to the block. */
  const GYM = TODAY + '/gym-app.mjs';
  const gymSource = show(GYM);
  const E2_WORD_OLD = "export const SETTINGS_NONE = 'No settings saved yet.';";
  const E2_WORD_NEW = E2_WORD_OLD + '\n/* E-R42, the one sentence, PROPOSED copy for the owner. It lives HERE'
    + '\n   because design.cjs binds preview-owned words from VIEW_SOURCES, and'
    + "\n   machine-note-identity.mjs is not one of them. */\nexport const SETTINGS_UNMATCHED ="
    + "\n  'Some notes you saved could not be matched to a machine after your import.';";
  const E2_COPY_OLD = '  head: SETTINGS_HEAD, none: SETTINGS_NONE, open: SETTINGS_OPEN,';
  const E2_COPY_NEW = '  head: SETTINGS_HEAD, none: SETTINGS_NONE, open: SETTINGS_OPEN,'
    + '\n  unmatched: SETTINGS_UNMATCHED,';
  const E2_CALL_OLD =
    '    MachineSettingsView.renderBlock(doc, map, { copy: SETTINGS_COPY, latest, state, put });';
  const E2_CALL_NEW = '    MachineSettingsView.renderBlock(doc, map, { copy: SETTINGS_COPY, latest, state, put,'
    + '\n      notice: entry && entry.unmatched ? SETTINGS_UNMATCHED : null });';
  const e2 = only(only(only(gymSource, E2_WORD_OLD), E2_COPY_OLD), E2_CALL_OLD)
    .replace(E2_WORD_OLD, E2_WORD_NEW).replace(E2_COPY_OLD, E2_COPY_NEW)
    .replace(E2_CALL_OLD, E2_CALL_NEW);
  const e2Count = diff(gymSource.split('\n'), e2.split('\n'));

  /* E3, machine-settings-view.mjs: the block DRAWS the sentence. This file
     LEAVES 6.1's zero-byte list by name. */
  const viewSource = show(VIEW);
  const E3_SIG_OLD = "export function renderBlock(doc, map, { copy, latest, state = 'known', put }) {";
  const E3_SIG_NEW = "export function renderBlock(doc, map, { copy, latest, state = 'known', put,"
    + '\n  notice = null }) {';
  const E3_END_OLD = '  cues.hidden = !hasCue;\n  return section;';
  const E3_END_NEW = '  cues.hidden = !hasCue;\n'
    + '  /* E-R42 arm 1: the note he asked for is shown, AND the one sentence about\n'
    + '     the notes this import could not match comes with it. Never silent. */\n'
    + "  if (typeof notice === 'string' && notice !== '') {\n"
    + "    const unmatched = doc.createElement('p');\n"
    + "    unmatched.className = 'small quiet';\n"
    + "    unmatched.textContent = copy.plain(notice, 'settings-unmatched');\n"
    + '    section.append(unmatched);\n'
    + '  }\n  return section;';
  const e3 = only(only(viewSource, E3_SIG_OLD), E3_END_OLD)
    .replace(E3_SIG_OLD, E3_SIG_NEW).replace(E3_END_OLD, E3_END_NEW);
  const e3Count = diff(viewSource.split('\n'), e3.split('\n'));

  /* E4, design.cjs: the sentence is DECLARED preview-owned, beside the other
     machine-settings sentences. */
  const DESIGN = TODAY + '/design.cjs';
  const designSource = show(DESIGN);
  const E4_OLD = '  "No settings saved yet.",';
  const E4_NEW = E4_OLD + '\n  "Some notes you saved could not be matched to a machine after your import.",';
  const e4 = only(designSource, E4_OLD).replace(E4_OLD, E4_NEW);
  const e4Count = diff(designSource.split('\n'), e4.split('\n'));

  console.log('THE CORRECTED HANDOFF, EVERY CONSUMER NAMED AND COUNTED:');
  for (const [name, c] of [['E1 gym-settings-lane.mjs (the read AND the cache)', e1Count],
    ['E2 gym-app.mjs (the word, the copy table, the call)', e2Count],
    ['E3 machine-settings-view.mjs (the block DRAWS it)', e3Count],
    ['E4 design.cjs (the sentence declared preview-owned)', e4Count]])
    line('  ' + name, c.added + ' added / ' + c.removed + ' removed');
  for (const [name, text] of [['E1', e1], ['E2', e2], ['E3', e3]])
    line('  ' + name + ' parses as an ES module', String(await parses(text)));
  console.log('');

  /* ---------- 8. THE CORRECTED LINK, RE-DRIVEN ---------- */
  const fixedLaneFile = path.join(scratch, 'ew2b-b1-fixed-lane.mjs');
  writeFileSync(fixedLaneFile, e1.replace("'./machine-note-identity.mjs'", "'" + RESOLVER + "'"), 'utf8');
  const fixedViewFile = path.join(scratch, 'ew2b-b1-fixed-view.mjs');
  writeFileSync(fixedViewFile, e3.replace("'../../../coach/machine-settings-commands.cjs'",
    "'" + pathToFileURL(path.join(ROOT, 'rebuild/coach/machine-settings-commands.cjs')).href + "'"), 'utf8');
  const FixedLane = await import(pathToFileURL(fixedLaneFile).href);
  const FixedView = await import(pathToFileURL(fixedViewFile).href);

  /* The installation is put back where section 5 found it: the orphan is still
     unmatched and press-old still carries Seat=4, under the LATER cue-only note
     Save wrote above, so the corrected read has to beat that too. */
  const host2 = await createMachineSettingsHost({ day: DAY, indexedDB, crypto: webcrypto });
  try {
    const replay = await host2.save({ exercise_id: 'press-old',
      settings: [{ name: 'Seat', value: '4' }], cues: 'Pause' });
    assert.equal(replay.ok, true, replay.code);
    const root2 = doc.getElementById('t-gym').content.cloneNode(true);
    const map2 = new Map([...root2.querySelectorAll('[data-slot]')].map(el => [el.dataset.slot, el]));
    const lane2 = FixedLane.createGymSettingsLane(doc, { day: DAY }, host2, painter);
    await lane2.hooks.startRead('file-press');
    const entry2 = lane2.facade.entryFor('file-press');
    const COPY2 = { ...COPY, unmatched: 'Some notes you saved could not be matched to a machine after your import.' };
    FixedView.renderBlock(doc, map2, { copy: COPY2, latest: entry2.latest,
      state: lane2.facade.stateFor('file-press'), put,
      notice: entry2 && entry2.unmatched ? COPY2.unmatched : null });
    const blockText2 = map2.get('settings-block').textContent.replace(/\s+/g, ' ').trim();
    const draft2 = FixedView.draftFrom(entry2.latest);
    line('the cache entry, its own members', Object.keys(entry2).sort().join(', '));
    line('the block the athlete sees', JSON.stringify(blockText2));
    line('the draft the editor opens', JSON.stringify(draft2));
    line('the one sentence is on the card', String(blockText2.includes(NOTICE)));

    /* THE SAVE CONTINUATION, on the corrected draft: one new cue, over a draft
       that is seeded with what he saved. */
    const typed2 = { rows: draft2.rows, cues: 'New cue' };
    const machine2 = FixedView.machineFromDraft(typed2, 'file-press');
    const saved2 = await host2.save(machine2);
    assert.equal(saved2.ok, true, saved2.code);
    lane2.hooks.dropRead('file-press');
    await lane2.hooks.startRead('file-press');
    const kept = lane2.facade.entryFor('file-press').latest;
    line('what Save wrote', JSON.stringify(machine2));
    line('what the card reads back for this lift', JSON.stringify(kept.machine));
    console.log('');

    console.log('THE INVARIANT, ASSERTED ON THE CORRECTED HANDOFF:');
    assert.deepEqual(draft2, { rows: [{ name: 'Seat', value: '4' }], cues: 'Pause' },
      'the editor does not open on the note he saved');
    assert.equal(blockText2.includes('Seat'), true, 'the block does not show the resolved note');
    assert.equal(blockText2.includes(NOTICE), true, 'the card is SILENT about the unmatched note');
    assert.deepEqual(kept.machine.settings, [{ name: 'Seat', value: '4' }],
      'Save superseded a saved setting the card never showed him');
    assert.equal(kept.machine.cues, 'New cue', 'the new cue was not stored');
    /* ONE MEASURED CORRECTION THIS CELL OWES AGAINST ITSELF. It first asserted
       `saved_in === 'document'` here and exited 1. The CELL was wrong: the
       correction he just saved is a NEW note, written under the lift he is
       standing at, so it is `native` by construction, and the pre-import
       document note it carried forward is untouched on disk. The product was
       right; the assertion is corrected rather than quietly removed. */
    assert.equal(kept.saved_in, 'native', 'the note he just saved is not in the space he saved it in');
    const storedOriginal = (await host2.repository.load()).generation.collections.ops[savedPress.op_id];
    assert.equal(JSON.stringify(storedOriginal), JSON.stringify(originalPressOp),
      'the pre-import note on disk was rewritten by a read or by Save');
    line('the pre-import note on disk is byte-unchanged', 'true');
    line('the note he just saved is recorded as', kept.saved_in);
    console.log('  The note is SHOWN, the sentence comes WITH it, the draft is');
    console.log('  seeded from what he saved, and Save keeps Seat=4 while adding');
    console.log('  the cue. Four consumers, counted above, and no more.');
    console.log('');

    /* ---------- 9. WHO OWNS THE WORD ---------- */
    /* Measured, because the brief must not put a product sentence in a file the
       design binding cannot see. */
    const approved = design.readApproved();
    const template = design.templateHtml();
    const undeclared = design.appSource() + '\nconst X = ' + JSON.stringify(NOTICE) + ';';
    let undeclaredPasses = true;
    try { design.assertDesignBinding(approved, template, undeclared); }
    catch (_) { undeclaredPasses = false; }
    let missingFromView = 'passed';
    try { design.assertDesignBinding(approved, template, design.appSource().replace(
      'No settings saved yet.', 'No settings stored yet.')); }
    catch (_) { missingFromView = 'failed'; }
    line('the design binding holds at this head', 'true');
    line('a DECLARED sentence missing from the view', missingFromView === 'failed'
      ? 'fails the gate' : 'passes the gate');
    line('an UNDECLARED new sentence in a view source', undeclaredPasses
      ? 'passes the gate' : 'fails the gate');
    assert.equal(missingFromView, 'failed', 'the copy binding does not hold its own declarations');
    assert.equal(undeclaredPasses, true,
      'the design gate DOES catch an undeclared sentence: E4 is enforced, not merely ordered');
    console.log('  The gate iterates the DECLARED lists and asserts each is IN a view');
    console.log('  source; it does not iterate the view for undeclared sentences. So');
    console.log('  E4 is an ORDER this brief gives and a row must hold, not a gate');
    console.log('  that would catch a builder who skipped it. Said here because the');
    console.log('  opposite would have been the easy thing to assume.');
    console.log('');
    console.log('ALL ASSERTIONS HELD');
  } finally { host2.close(); }
} finally {
  host.close();
  rmSync(scratch, { recursive: true, force: true });
  for (const rel of [VIEW, HOST, TODAY + '/gym-app.mjs', TODAY + '/design.cjs'])
    assert.equal(sha(onDisk(rel)), sha(onDisk(rel)), 'unreadable: ' + rel);
  assert.equal(sha(onDisk(VIEW)), sha(show(VIEW)), 'this cell wrote to a product file');
}
