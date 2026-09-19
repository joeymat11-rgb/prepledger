/* EW2 BUILD BRIEF - E-R39 PROBE: CAN A SECOND ADMISSION HAPPEN ON ONE
   INSTALLATION AT ALL, THROUGH THE REAL ADMISSION PATH?

   DECISIONS:621 (2) makes this the brief's FIRST MEASURED STEP. Astra's D1
   asks for per-edit id-space provenance across "first admission, native
   file-id edits, second selection and rollback". Before any of that can be
   specified, the question underneath it has to be ANSWERED BY EXECUTION:
   does the shipped admission path let a second file be admitted at all?

   THIS CELL CANNOT RUN IN THE FARM. It seals TWO bundles through the REAL
   rebuild/m3/setup/port/port.cjs, whose oracle files are outside the farm's
   include list. It runs on the PC only, in a worktree with the live
   node_modules junctions (spec 14.8).

   EVERYTHING IS INVENTED. sealInventedBundle writes its source into an OS
   temp folder and the port mints its own passphrase. No owner file, no
   private fixture, no measurement of his, is read anywhere.

   It PRINTS and does not prescribe: the only assertion is that the FIRST
   admission succeeded, because a probe over a failed first admission would be
   measuring nothing. Run it as:
     node rebuild/lanes/d/plan-edit/ew2b-r39-probe.mjs                      */
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, admit, durable,
  SETUP } from '../../../m3/w7-preview/import/test/support.mjs';

const DAY_1 = { day: '2026-09-16', at: '2026-09-16T16:00:00.000Z' };
const DAY_2 = { day: '2026-09-17', at: '2026-09-17T16:00:00.000Z' };

/* TWO DIFFERENT REAL FILES. The second changes exactly one thing, the session
   days the old app recorded, so it is a different digest and a different
   custody name while staying inside the harness's own execution calendar. */
const FILE_A = sealInventedBundle();
const FILE_B = sealInventedBundle(SETUP,
  { sessions: [['2026-08-14', 'U'], ['2026-08-18', 'L'], ['2026-08-24', 'U']] });

const scope = tag => ({ databaseName: 'ew2b-r39-' + tag, namespace: 'joe/ew2b-r39-' + tag,
  athleteId: 'ath-ew2b', deviceId: 'dev-ew2b' });

const pad = s => (s + '                                                       ').slice(0, 55);
const say = (label, value) => console.log(pad(label) + ' ' + value);

/* WHATEVER HAPPENS IS THE MEASUREMENT. A throw is reported by its code, an
   ordinary refusal by its stage and its issue codes, and a success as a
   success; nothing is swallowed and nothing is asserted here. */
async function attempt(era, file, day, names) {
  try {
    const r = await admit(era, file, { day, ...names });
    if (r.admitted) return { outcome: 'ADMITTED', detail: 'view.ready=' + (r.view && r.view.ready) };
    return { outcome: 'REFUSED', stage: r.stage,
      detail: (r.code ? String(r.code) : '') + (r.codes ? ' [' + r.codes.join(',') + ']' : '') };
  } catch (error) {
    return { outcome: 'THREW', stage: 'throw',
      detail: (error && error.code ? error.code : '') + ' ' + String(error && error.message).slice(0, 140) };
  }
}

const report = (label, r) => say(label, r.outcome + (r.stage ? ' at ' + r.stage : '') + '   ' + (r.detail || ''));

async function boot(tag, when) {
  const indexedDB = new IDBFactory();
  const names = scope(tag);
  const era = await eraFor({ indexedDB, live: liveAt(when.at), ...names });
  await firstRun(era, when.day);
  return { indexedDB, names, era };
}

console.log('EW2B E-R39 PROBE: the second admission, through the REAL admission path');
console.log('');
say('file A sealed by the real port, bytes', FILE_A.bytes.length);
say('file B sealed by the real port, bytes', FILE_B.bytes.length);
say('the two files are different', String(Buffer.compare(Buffer.from(FILE_A.bytes), Buffer.from(FILE_B.bytes)) !== 0));
console.log('');

/* JOURNEY 1: the first admission, on its own, so the rest has a base. */
const one = await boot('same', DAY_1);
const first = await attempt(one.era, FILE_A, DAY_1.day, one.names);
report('1. FIRST admission of file A', first);
assert.equal(first.outcome, 'ADMITTED', 'the first admission must succeed or this probe measures nothing');
const afterFirst = await durable(one.era);
say('  after it: ops / outbox / imports', afterFirst.ops + ' / ' + afterFirst.outbox + ' / ' + JSON.stringify(afterFirst.imports));
say('  a basis is committed', String(afterFirst.basis) + ', applied=' + String(afterFirst.applied));
console.log('');

/* JOURNEY 2: THE SAME FILE AGAIN, same era, no reload. */
const again = await attempt(one.era, FILE_A, DAY_2.day, one.names);
report('2. the SAME file again, same session', again);

/* JOURNEY 3: A DIFFERENT FILE, same era, no reload. */
const other = await attempt(one.era, FILE_B, DAY_2.day, one.names);
report('3. a DIFFERENT file, same session', other);
const afterOther = await durable(one.era);
say('  after it: ops / imports', afterOther.ops + ' / ' + JSON.stringify(afterOther.imports));
one.era.close();
console.log('');

/* JOURNEY 4 and 5: AFTER A RELOAD. The era is closed and a new one is opened
   on the SAME IndexedDB, which is what a page reload does. */
const reopened = await eraFor({ indexedDB: one.indexedDB, live: liveAt(DAY_2.at), ...one.names });
const againCold = await attempt(reopened, FILE_A, DAY_2.day, one.names);
report('4. the SAME file again, AFTER A RELOAD', againCold);
const otherCold = await attempt(reopened, FILE_B, DAY_2.day, one.names);
report('5. a DIFFERENT file, AFTER A RELOAD', otherCold);
const afterCold = await durable(reopened);
say('  after it: ops / imports', afterCold.ops + ' / ' + JSON.stringify(afterCold.imports));
say('  a basis is still committed', String(afterCold.basis) + ', applied=' + String(afterCold.applied));
reopened.close();
console.log('');

/* JOURNEY 6: THE CONTROL. File B admits on its own on a FRESH installation,
   so a refusal above is about the SECOND admission and not about file B. */
const fresh = await boot('fresh', DAY_1);
const controlB = await attempt(fresh.era, FILE_B, DAY_1.day, fresh.names);
report('6. CONTROL: file B alone on a fresh install', controlB);
fresh.era.close();
console.log('');
console.log('PROBE COMPLETE. Nothing above is prescribed; every line is what ran.');
