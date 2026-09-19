/* EW2 BUILD BRIEF - E-R41, HANDOFF 2 (Astra's D4): THE PER-ADOPTION
   Start.plan_basis THROUGH THE SHARED GYM INSTALLATION.

   DECISIONS:621 (4): this handoff is NOT AUTHORIZED. The brief MEASURES the
   smallest route with ZERO PRODUCT BYTES, names the file, the lines and the
   alternatives with their cost, and the PM rules once. Nothing here proposes
   a byte; every number below is executed.

   THE CLAIM UNDER TEST is Astra's, word for word: "createGymHost ignores a
   per-call planBasis option, so the current zero-byte today-bindings contract
   cannot carry the proposed changing fold label by the stated route."

   Everything is SYNTHETIC and nothing is sealed: it runs in the farm scratch
   AND on the PC.
   Run it as:  node rebuild/lanes/d/plan-edit/ew2b-r41-d4-planbasis.mjs      */
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { IDBFactory, liveAt, firstRunWith } from '../../../m3/w7-preview/import/test/support.mjs';
import { PHONE, SETUP_DAY, AT, phoneState, EFFORT } from '../p3-real-shape/real-shape-support.mjs';
import { createGymModel } from '../../../m3/w7-preview/today/gym-model.mjs';
import { openTodayOverLocalEra } from '../../../m3/w6/local/today-bindings.mjs';

/* `eraFor` in the import corpus's support module does NOT forward `planBasis`,
   so this cell opens the installation through the page's own entry point
   instead. MEASURED, and it is the cell that had to change, not the product. */
const eraWith = (indexedDB, at, planBasis) => openTodayOverLocalEra({ indexedDB,
  crypto: webcrypto, ...names, live: liveAt(at), planBasis });

const DAY = '2026-09-17';
const line = (k, v) => console.log(String(k).padEnd(56) + ' ' + v);

const names = { databaseName: 'ew2b-r41d4', namespace: 'joe/ew2b-r41d4',
  athleteId: 'ath-ew2b-d4', deviceId: 'dev-ew2b-d4' };

/* ONE WHOLE workout through the REAL gym card, start to finish, and the
   plan_basis the Start operation it wrote actually carries. The session is
   FINISHED rather than left open, because an unreconciled session makes the
   next card refuse WORKOUT_HISTORY_RECONCILIATION_REQUIRED and this cell needs
   two workouts on ONE installation. Nothing is read out of a helper's return
   value: the label comes off the durable operation. */
async function startAndReadLabel(era, day, perCallPlanBasis) {
  const open = on => era.createGymHost({ day: on, engineState: phoneState(PHONE),
    plannedSplitSlotId: 'earned-today-preview/' + on,
    ...(perCallPlanBasis ? { planBasis: perCallPlanBasis } : {}) });
  const gymHost = await open(day);
  const gym = createGymModel({ gymHost, sessionTitle: null, hostForDay: open });
  const ready = await gym.read();
  if (ready.phase !== 'ready') { gymHost.close(); throw new Error('card not ready: ' + (ready.code || ready.phase)); }
  const started = await gym.start();
  if (started.ok !== true) { gymHost.close(); throw new Error('start refused: ' + started.code); }
  let view = await gym.read();
  const startId = view.startId, total = view.total;
  for (let n = 0; n <= total; n += 1) {
    if (view.phase === 'saved' && view.complete !== true) { gym.forget(); view = await gym.read(); }
    if (view.phase !== 'active') break;
    const logged = await gym.logSet({ startId, slot: view.set.slot, lift: view.set.lift,
      load: view.entry.load, reps: view.entry.reps, effort: EFFORT });
    if (logged.ok !== true) { gymHost.close(); throw new Error('logSet refused: ' + logged.code); }
    view = await gym.read();
  }
  if (!(view.complete === true || view.phase === 'complete')) {
    gymHost.close(); throw new Error('the session never completed: ' + view.phase); }
  if ((await gym.finish({ startId })).ok !== true) { gymHost.close(); throw new Error('finish refused'); }
  gymHost.close();
  const generation = (await era.generation()).generation;
  const starts = Object.values(generation.collections.ops)
    .filter(op => op.kind === 'session-start');
  const latest = starts[starts.length - 1];
  const found = JSON.stringify(latest).match(/"plan_basis":"([^"]*)"/);
  return { label: found ? found[1] : null, starts: starts.length };
}

console.log('EW2B E-R41 D4: CAN A PER-ADOPTION Start.plan_basis REACH THE CARD?');
console.log('');

const indexedDB = new IDBFactory();

/* ROUTE 0, THE ONE THE SPEC ASSUMED. One installation, the era's own default
   label, and a per-call planBasis handed to createGymHost. */
const era1 = await eraWith(indexedDB, AT(SETUP_DAY), 'EW2B-ERA-LABEL-ONE');
await firstRunWith(era1, SETUP_DAY, PHONE.setup, PHONE.tags);
const ignored = await startAndReadLabel(era1, DAY, 'EW2B-PER-CALL-LABEL');
line('the era was opened with planBasis', 'EW2B-ERA-LABEL-ONE');
line('createGymHost was handed planBasis', 'EW2B-PER-CALL-LABEL');
line('the label the stored Start actually carries', String(ignored.label));
line('the per-call option was HONOURED', String(ignored.label === 'EW2B-PER-CALL-LABEL'));
era1.close();
console.log('');

/* ROUTE 1, THE ZERO-PRODUCT-BYTE ROUTE. A SECOND era over the SAME
   IndexedDB, opened with the label this adoption needs. No sealed byte moves;
   the cost is a second durable client on one installation. */
const era2 = await eraWith(indexedDB, AT(SETUP_DAY), 'EW2B-ERA-LABEL-TWO');
const second = await startAndReadLabel(era2, '2026-09-18', null);
line('ROUTE 1: a SECOND era on the SAME IndexedDB', 'opened');
line('  it was opened with planBasis', 'EW2B-ERA-LABEL-TWO');
line('  the label its stored Start carries', String(second.label));
line('  the route carries a changing label', String(second.label === 'EW2B-ERA-LABEL-TWO'));
line('  session-start operations on disk now', second.starts);
era2.close();
console.log('');

/* ROUTE 2, THE SEALED HUNK, COUNTED RATHER THAN ESTIMATED, the way
   `ew2r7-p5-card-hunk.mjs` counted hunk E: both anchors are proved unique in
   the file on disk, the patch is applied IN MEMORY, the lines are counted by
   diff and the file is left byte-unchanged. NOTHING IS WRITTEN. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const BINDINGS = fileURLToPath(new URL('../../../m3/w6/local/today-bindings.mjs', import.meta.url));
const source = readFileSync(BINDINGS, 'utf8');
const ANCHOR_DESTRUCTURE = '    const { day, engineState, plannedSplitSlotId } = options;';
const ANCHOR_RESOLVER = '      planBasis, inputBasis, causalParents: () => lastResolved.slice() });';
const occurrences = (text, needle) => text.split(needle).length - 1;

line('ROUTE 2 anchor 1, createGymHost\'s destructure', occurrences(source, ANCHOR_DESTRUCTURE));
line('ROUTE 2 anchor 2, the resolver\'s planBasis', occurrences(source, ANCHOR_RESOLVER));
assert.equal(occurrences(source, ANCHOR_DESTRUCTURE), 1, 'anchor 1 is not unique');
assert.equal(occurrences(source, ANCHOR_RESOLVER), 1, 'anchor 2 is not unique');

const patched = source
  .replace(ANCHOR_DESTRUCTURE,
    '    const { day, engineState, plannedSplitSlotId, planBasis: callPlanBasis } = options;')
  .replace(ANCHOR_RESOLVER,
    '      planBasis: callPlanBasis || planBasis, inputBasis, causalParents: () => lastResolved.slice() });');
const before = source.split('\n'), after = patched.split('\n');
let added = 0, removed = 0;
for (let i = 0; i < before.length; i += 1) if (before[i] !== after[i]) { added += 1; removed += 1; }
line('ROUTE 2 lines added / removed', added + ' / ' + removed);
line('ROUTE 2 net lines', String(added - removed));

/* ROUTE 2B, LOOP ROUND 1 FIX (Astra's N6): her SMALLER same-contract patch,
   re-measured here rather than taken on her word. It changes the RESOLVER LINE
   ONLY and leaves the destructure alone, reading the option off `options`
   directly. Its scope is proved rather than assumed: the resolver line is
   inside `createGymHost`'s own body, so `options` is that function's parameter
   and no new binding is introduced. */
const FN = '  async function createGymHost(options = {}) {';
const fnAt = source.indexOf(FN), resolverAt = source.indexOf(ANCHOR_RESOLVER);
const nextFnAt = source.indexOf('\n  async function ', fnAt + FN.length);
line('ROUTE 2B, createGymHost\'s own body', occurrences(source, FN));
line('  the resolver line is inside that body',
  String(fnAt >= 0 && resolverAt > fnAt && (nextFnAt === -1 || resolverAt < nextFnAt)));
assert.equal(occurrences(source, FN), 1, 'createGymHost is not unique');
assert.equal(fnAt >= 0 && resolverAt > fnAt && (nextFnAt === -1 || resolverAt < nextFnAt), true,
  'the resolver line is not inside createGymHost, so `options` is not in scope there');
const patched2b = source.replace(ANCHOR_RESOLVER,
  '      planBasis: options.planBasis || planBasis, inputBasis, causalParents: () => lastResolved.slice() });');
const after2b = patched2b.split('\n');
let added2b = 0, removed2b = 0;
for (let i = 0; i < before.length; i += 1) if (before[i] !== after2b[i]) { added2b += 1; removed2b += 1; }
line('ROUTE 2B lines added / removed', added2b + ' / ' + removed2b);
let parses2b = true;
try { await import('data:text/javascript;base64,' + Buffer.from(patched2b).toString('base64')); }
catch (error) { parses2b = !/SyntaxError/.test(String(error && error.name)); }
line('ROUTE 2B parses as an ES module', String(parses2b));
line('today-bindings.mjs on disk is byte-unchanged', String(readFileSync(BINDINGS, 'utf8') === source));
console.log('');

/* ------------------------------------------------------------------ */
console.log('THE PIN, asserted:');
assert.notEqual(ignored.label, 'EW2B-PER-CALL-LABEL',
  'createGymHost HONOURED a per-call planBasis: Astra\'s D4 would be withdrawn');
assert.equal(ignored.label, 'EW2B-ERA-LABEL-ONE',
  'the stored Start did not carry the era\'s own label either');
console.log('  D4 IS UPHELD BY EXECUTION: the per-call planBasis is IGNORED and');
console.log('  the stored Start carries the ERA\'s label. The label is fixed when');
console.log('  the installation is opened, not when the card is.');

assert.equal(second.label, 'EW2B-ERA-LABEL-TWO',
  'a second era with its own label did not change the stored Start');
console.log('  THE ZERO-PRODUCT-BYTE ROUTE WORKS: a second era over the same');
console.log('  IndexedDB carries a different label onto a real stored Start.');
console.log('  LOOP ROUND 1 FIX, Astra\'s N6: what this cell drove is SEQUENTIAL');
console.log('  ERA REOPENINGS over one installation, the first session FINISHED');
console.log('  before the second card opened. It is NOT two concurrently live');
console.log('  durable clients and this cell never claimed to be.');

assert.equal(added, 2);
assert.equal(removed, 2);
assert.equal(added2b, 1);
assert.equal(removed2b, 1);
assert.equal(parses2b, true);
console.log('  THE SEALED ALTERNATIVE IS 2 LINES CHANGED in today-bindings.mjs,');
console.log('  counted and not estimated, both anchors unique - AND ROUTE 2B, the');
console.log('  SMALLER same-contract patch, is 1 CHANGED LINE, measured here.');
console.log('  ROUTE 2B is the one this brief carries. That file is on 13.12\'s');
console.log('  ZERO-BYTE list, so it is the PM\'s word, not this cell\'s.');
console.log('');
console.log('ALL ASSERTIONS HELD');
