/* EW2 BUILD BRIEF - E-R39, PART 2: WHAT A SECOND ADMISSION KEEPS, AND WHAT IT
   TAKES AWAY.

   ew2b-r39-second-admission.mjs answers the PM's gate question (YES, a second
   admission happens) and shows that collections.derived.localSource, the ONE
   record E-R30's hunk D would write the lift correspondence onto and 14.2's
   note resolver would read, is REPLACED wholesale by the second admission.

   This cell measures the other half, which is what makes the STOP actionable:
   whether the material a fix would need is still on disk after the second
   admission, or whether it is gone. It asserts nothing about what the build
   SHOULD do; :621 (2) sends that decision to the PM.

   PC ONLY: it seals TWO bundles through the REAL port. INVENTED throughout.
   Run it as:  node rebuild/lanes/d/plan-edit/ew2b-r39-retention.mjs         */
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, admit,
  SETUP } from '../../../m3/w7-preview/import/test/support.mjs';

const D1 = { day: '2026-09-16', at: '2026-09-16T16:00:00.000Z' };
const D2 = { day: '2026-09-17', at: '2026-09-17T16:00:00.000Z' };

const FILE_A = sealInventedBundle();
const FILE_B = sealInventedBundle(SETUP,
  { sessions: [['2026-08-14', 'U'], ['2026-08-18', 'L'], ['2026-08-24', 'U']] });

const names = { databaseName: 'ew2b-r39r', namespace: 'joe/ew2b-r39r',
  athleteId: 'ath-ew2b', deviceId: 'dev-ew2b' };

const pad = s => (s + '                                                       ').slice(0, 55);
const say = (label, value) => console.log(pad(label) + ' ' + value);

console.log('EW2B E-R39 PART 2: WHAT SURVIVES THE SECOND ADMISSION');
console.log('');

const indexedDB = new IDBFactory();
const era = await eraFor({ indexedDB, live: liveAt(D1.at), ...names });
await firstRun(era, D1.day);

const one = await admit(era, FILE_A, { day: D1.day, ...names });
assert.equal(one.admitted, true, 'the first admission must succeed');
const two = await admit(era, FILE_B, { day: D2.day, ...names });
assert.equal(two.admitted, true, 'the second admission must succeed');

const loaded = await era.generation();
const g = loaded.generation, m = g.metadata, c = g.collections;
const sources = m.localSources;
const ids = Object.keys(sources.selections);
const derived = c.derived.localSource;

say('selections on disk after both admissions', ids.length);
say('the active one', String(sources.active === ids[1]) + ' (the second)');
console.log('');
console.log('WHAT EACH RETAINED SELECTION STILL CARRIES:');
for (let i = 0; i < ids.length; i += 1) {
  const s = sources.selections[ids[i]];
  say('  selection ' + (i + 1) + ': its own basis digest', s.basis && s.basis.source_digest ? 'present' : 'ABSENT');
  say('  selection ' + (i + 1) + ': its own order_map', s.order_map === null ? 'null, this file needed none' : Object.keys(s.order_map).length + ' entries');
  say('  selection ' + (i + 1) + ': its identity review', s.identity_review ? 'present' : 'ABSENT');
  say('  selection ' + (i + 1) + ': the file it names', s.name);
  say('  selection ' + (i + 1) + ': the selection it replaced', s.previous === null ? 'none (it was first)' : 'the one before it');
}
console.log('');
console.log('WHAT THE ONE DERIVED RECORD CARRIES:');
say('  derived.localSource.basis names selection', derived.basis.local_selection_id === sources.active ? 'THE ACTIVE ONE ONLY' : 'something else');
say('  members on derived.localSource', Object.keys(derived).sort().join(', '));
say('  members on derived.localSource.view', Object.keys(derived.view).sort().join(', '));
say('  a lift_correspondence member exists today', String(Object.hasOwn(derived.view, 'lift_correspondence')));
console.log('');

/* ------------------------------------------------------------------ */
console.log('THE PIN, asserted:');

assert.equal(ids.length, 2);
for (const id of ids) {
  const s = sources.selections[id];
  assert.ok(s.basis && typeof s.basis.source_digest === 'string' && s.basis.source_digest.length,
    'a retained selection lost its own basis');
  assert.ok(Object.hasOwn(s, 'order_map'), 'a retained selection lost its order map member');
  assert.ok(s.identity_review, 'a retained selection lost its identity review');
}
console.log('  EVERY selection keeps its OWN basis, its order map member and its');
console.log('  identity review, under metadata.localSources.selections, after the');
console.log('  second admission. MEASURED CORRECTION, and it is this cell that was');
console.log('  wrong rather than the product: order_map is NULL on both selections');
console.log('  here, because neither invented file needed one. The member is');
console.log('  present and per selection; its VALUE is per file.');
console.log('  The material a per-admission join would need is still on disk.');

assert.equal(derived.basis.local_selection_id, sources.active);
console.log('  collections.derived.localSource is SINGULAR and names only the');
console.log('  ACTIVE selection. It is the only place an admission-time');
console.log('  derivation is published, so a per-admission correspondence');
console.log('  written there is overwritten by the next admission.');

assert.equal(Object.hasOwn(derived.view, 'lift_correspondence'), false);
console.log('  CONTROL: no lift_correspondence member exists at this head.');
console.log('  Hunk D would add it, to that singular record. E-R30 and 14.2');
console.log('  both read it and neither is written yet: this is a measurement');
console.log('  about the PLACE, taken before any byte is spent on it.');
console.log('');
console.log('ALL ASSERTIONS HELD');
era.close();
