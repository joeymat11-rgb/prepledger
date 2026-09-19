/* EW2 BUILD BRIEF - E-R39, THE FIRST MEASURED STEP, PINNED.

   DECISIONS:621 (2) orders this before any other work on the brief: measure,
   through the REAL admission path on synthetic sealed bundles, whether a
   SECOND admission can happen on one installation at all - the same file
   again, a different file, after a reload.

   THE ANSWER IS YES, and this cell is the pin. It also measures the one
   consequence D1 turns on and nobody had executed: what the second admission
   does to the single derived record that E-R30's translation boundary and
   14.2's note resolver would both read.

   THIS CELL CANNOT RUN IN THE FARM: it seals THREE bundles through the REAL
   rebuild/m3/setup/port/port.cjs, whose oracle files are outside the farm's
   include list. PC only, in a worktree with the live node_modules junctions
   (spec 14.8). Everything is INVENTED: the port mints each passphrase and
   writes each source into an OS temp folder. No owner file is read.

   Run it as:  node rebuild/lanes/d/plan-edit/ew2b-r39-second-admission.mjs  */
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, admit, durable,
  SETUP } from '../../../m3/w7-preview/import/test/support.mjs';

const D1 = { day: '2026-09-16', at: '2026-09-16T16:00:00.000Z' };
const D2 = { day: '2026-09-17', at: '2026-09-17T16:00:00.000Z' };
const D3 = { day: '2026-09-18', at: '2026-09-18T16:00:00.000Z' };

/* THREE REAL FILES, each differing from the others in exactly one thing, the
   session days the old app recorded, so each is a different content digest and
   a different custody name while every day stays inside the harness's own
   execution calendar. */
const FILE_A = sealInventedBundle();
const FILE_B = sealInventedBundle(SETUP,
  { sessions: [['2026-08-14', 'U'], ['2026-08-18', 'L'], ['2026-08-24', 'U']] });
const FILE_C = sealInventedBundle(SETUP,
  { sessions: [['2026-08-14', 'U'], ['2026-08-17', 'L'], ['2026-08-31', 'U']] });

const names = { databaseName: 'ew2b-r39s', namespace: 'joe/ew2b-r39s',
  athleteId: 'ath-ew2b', deviceId: 'dev-ew2b' };

const pad = s => (s + '                                                       ').slice(0, 55);
const say = (label, value) => console.log(pad(label) + ' ' + value);

async function attempt(era, file, day) {
  try {
    const r = await admit(era, file, { day, ...names });
    if (r.admitted) return { outcome: 'ADMITTED', detail: 'view.ready=' + (r.view && r.view.ready) };
    return { outcome: 'REFUSED', stage: r.stage,
      code: r.code || (r.codes && r.codes[0]) || null,
      detail: (r.code ? String(r.code) : '') + (r.codes ? ' [' + r.codes.join(',') + ']' : '') };
  } catch (error) {
    return { outcome: 'THREW', stage: 'throw', code: error && error.code ? error.code : null,
      detail: String(error && error.message).slice(0, 160) };
  }
}

/* WHAT THE INSTALLATION RECORDS ABOUT ITS IMPORTS, read straight out of the
   durable generation, never out of the helper's return value. */
async function record(era) {
  const loaded = await era.generation();
  const g = loaded.generation, m = g.metadata || {}, c = g.collections || {};
  const sources = m.localSources || { selections: {}, active: null };
  const derived = c.derived && c.derived.localSource ? c.derived.localSource : null;
  return {
    selectionIds: Object.keys(sources.selections || {}).sort(),
    active: sources.active,
    previousOfActive: sources.active && sources.selections[sources.active]
      ? sources.selections[sources.active].previous : undefined,
    applicationSelection: m.localSourceApplication ? m.localSourceApplication.selection_id : null,
    derivedDigest: derived ? derived.basis.source_digest : null,
    derivedSelection: derived ? derived.basis.local_selection_id : null,
    imports: (m.imports || []).map(e => e.name).sort(),
    ops: Object.keys(c.ops || {}).length,
  };
}

console.log('EW2B E-R39: CAN A SECOND ADMISSION HAPPEN ON ONE INSTALLATION?');
console.log('');

const indexedDB = new IDBFactory();
const era1 = await eraFor({ indexedDB, live: liveAt(D1.at), ...names });
await firstRun(era1, D1.day);

const first = await attempt(era1, FILE_A, D1.day);
say('1. FIRST admission, file A', first.outcome + '   ' + first.detail);
const afterA = await record(era1);
say('  selections recorded / active is the first', afterA.selectionIds.length + ' / ' + String(afterA.active === afterA.selectionIds[0]));
say('  the derived record names file A', String(afterA.derivedSelection === afterA.active));

const same = await attempt(era1, FILE_A, D2.day);
say('2. the SAME file again, same session', same.outcome + ' at ' + same.stage + '   ' + same.detail);

const second = await attempt(era1, FILE_B, D2.day);
say('3. a DIFFERENT file, same session', second.outcome + '   ' + second.detail);
const afterB = await record(era1);
say('  selections recorded now', afterB.selectionIds.length);
say('  the active selection MOVED', String(afterB.active !== afterA.active));
say('  the new selection records its previous', String(afterB.previousOfActive === afterA.active));
say('  localSourceApplication names the second', String(afterB.applicationSelection === afterB.active));
say('  the ONE derived record now names', afterB.derivedSelection === afterB.active ? 'THE SECOND FILE' : 'something else');
say('  file A\'s basis digest survives in derived', String(afterB.derivedDigest === afterA.derivedDigest));
say('  imports held in custody', afterB.imports.length);
say('  operations written by either admission', afterB.ops);
era1.close();
console.log('');

/* AFTER A RELOAD. The era is closed and a new one opened on the SAME
   IndexedDB, which is what a page reload does. FILE_C has never been carried,
   so custody's own duplicate guard cannot be what answers. */
const era2 = await eraFor({ indexedDB, live: liveAt(D3.at), ...names });
const sameCold = await attempt(era2, FILE_A, D3.day);
say('4. the SAME file again, AFTER A RELOAD', sameCold.outcome + ' at ' + sameCold.stage + '   ' + sameCold.detail);
const third = await attempt(era2, FILE_C, D3.day);
say('5. a THIRD, never-carried file, AFTER A RELOAD', third.outcome + '   ' + third.detail);
const afterC = await record(era2);
say('  selections recorded now', afterC.selectionIds.length);
say('  the ONE derived record now names', afterC.derivedSelection === afterC.active ? 'THE THIRD FILE' : 'something else');
say('  file B\'s basis digest survives in derived', String(afterC.derivedDigest === afterB.derivedDigest));
era2.close();
console.log('');

/* ------------------------------------------------------------------ */
console.log('THE PIN, asserted:');

assert.equal(first.outcome, 'ADMITTED', 'the first admission must succeed');
console.log('  the first admission succeeds');

assert.equal(same.outcome, 'REFUSED');
assert.equal(same.stage, 'custody');
assert.equal(same.code, 'LOCAL_IMPORT_ALREADY_PRESENT');
assert.equal(sameCold.code, 'LOCAL_IMPORT_ALREADY_PRESENT');
console.log('  THE SAME FILE AGAIN is refused BY NAME at custody, hot and cold:');
console.log('    LOCAL_IMPORT_ALREADY_PRESENT');

assert.equal(second.outcome, 'ADMITTED',
  'E-R39: a DIFFERENT file was NOT admitted on the same installation');
assert.equal(third.outcome, 'ADMITTED',
  'E-R39: a THIRD file was NOT admitted after a reload');
console.log('  A SECOND ADMISSION CAN HAPPEN: a different file is ADMITTED,');
console.log('  in the same session AND after a reload. E-R39 answers YES.');

assert.equal(afterB.selectionIds.length, 2, 'the second selection was not recorded');
assert.equal(afterC.selectionIds.length, 3, 'the third selection was not recorded');
assert.notEqual(afterB.active, afterA.active, 'the active selection did not move');
assert.equal(afterB.previousOfActive, afterA.active, 'the second selection lost its previous');
assert.equal(afterB.applicationSelection, afterB.active, 'the application marker did not move');
console.log('  every selection is RETAINED in metadata.localSources.selections,');
console.log('  and each one records the selection it replaced.');

assert.equal(afterB.derivedSelection, afterB.active,
  'the derived record did not move to the second selection');
assert.notEqual(afterB.derivedDigest, afterA.derivedDigest,
  'the derived record kept the first basis');
assert.notEqual(afterC.derivedDigest, afterB.derivedDigest,
  'the derived record kept the second basis');
console.log('  BUT collections.derived.localSource is a SINGLE record and the');
console.log('  second admission REPLACES it. The first admission\'s basis, and');
console.log('  with it the ONE recorded correspondence E-R30 hunk D would add');
console.log('  and 14.2\'s note resolver would read, is no longer readable there.');

assert.equal(afterB.ops, afterA.ops, 'an admission wrote an operation');
console.log('  CONTROL: no admission wrote an operation. Nothing on disk was');
console.log('  rewritten; the selections accumulate and only the derived record moves.');
console.log('');
console.log('ALL ASSERTIONS HELD');
