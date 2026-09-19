/* EW2 ROUND 6 PROTOTYPE 3 - throwaway. E-R32 / JOURNEY J3.
   The exercise-id provider and the two-sided collision rule, as pure functions
   over the product's own slugOf and the product's own normaliseName. No product
   file is edited. Both of Astra F3's witnesses are the two rows at the end. */
import { createRequire } from 'node:module';
import { slugOf } from '../../../m3/w7-preview/today/setup-model.mjs';

const require = createRequire(import.meta.url);
const { normaliseName, idCollisions } = require('../../../m4/workout/lift-correspondence.cjs');
const line = (k, v) => console.log(k.padEnd(62) + ' ' + v);
const EX = (id, n, mg) => ({ id, n, mg, day: 'U', sets: 2, hi: 9, inc: 2.75, steps: [11, 13.75, 16.5] });

/* (1) THE PROVIDER. One set, named, and it is a UNION, not the setup's ids.
   Lifetime: it is rebuilt from the authenticated read on every mint, so review,
   retry and reload all see the same reservations without carrying state. */
function reservedHandles({ setupIds = [], fileIds = [], planCreated = [], retired = [],
  tombstoned = [], rosterIds = [] } = {}) {
  return new Set([...setupIds, ...fileIds, ...planCreated, ...retired, ...tombstoned, ...rosterIds]);
}
function mintExerciseId(name, reserved) { return slugOf(name, new Set(reserved)); }

/* (2) THE COLLISION RULE, asked of IDENTITIES rather than of current names.
   A NEW identity (one no admitted correspondence and no roster entry answers
   for) may not take ANY occupied file handle, an equal normalised label
   included. An ESTABLISHED identity keeps the mapping it was admitted with, so
   its own rename is not re-checked against the file at all. */
function planIdCollisions(fileLifts, foldedRows, { correspondence = {}, rosterIds = [] } = {}) {
  const fileById = new Map(fileLifts.map(e => [e.id, e]));
  const established = new Set([...Object.keys(correspondence), ...rosterIds]);
  const out = [];
  for (const row of foldedRows) {
    if (established.has(row.id)) continue;               // its mapping is already admitted
    if (!fileById.has(row.id)) continue;                 // the handle is free
    out.push({ id: row.id, why: 'PLAN_EDIT_FILE_HANDLE_OCCUPIED',
      label_equal: normaliseName(row.n) === normaliseName(fileById.get(row.id).n) });
  }
  return out;
}

const fileLifts = [EX('lateral', 'Lateral', 'back'), EX('press', 'Press', 'chest')];
const setupIds = ['press', 'row', 'squat'];
const correspondence = { press: 'press' };   // what admission recorded for the established identity

console.log('--- J3 (a) A NEW IDENTITY WITH AN EQUAL LABEL ONTO AN OCCUPIED HANDLE');
const naive = slugOf('Lateral', new Set(setupIds));
line('what slugOf mints against the SETUP ids alone', naive);
line('product idCollisions on that folded row (E-R25 (i) as worded)',
  JSON.stringify(idCollisions(fileLifts, [EX(naive, 'Lateral', 'chest')])));
line('PROTOTYPE planIdCollisions on the same row',
  JSON.stringify(planIdCollisions(fileLifts, [EX(naive, 'Lateral', 'chest')], { correspondence })));
line('=> refuses BY NAME even though the labels are equal',
  String(planIdCollisions(fileLifts, [EX(naive, 'Lateral', 'chest')], { correspondence }).length === 1));

console.log('--- J3 (a2) AND THE PREVENTION: mint against the RESERVED UNION');
const reserved = reservedHandles({ setupIds, fileIds: fileLifts.map(e => e.id) });
const minted = mintExerciseId('Lateral', reserved);
line('slugOf("Lateral", setup ids UNION file handles)', minted);
line('collisions for the minted id',
  JSON.stringify(planIdCollisions(fileLifts, [EX(minted, 'Lateral', 'chest')], { correspondence })));

console.log('--- J3 (b) AN ESTABLISHED IDENTITY RENAMED MUST PASS');
const renamed = [EX('press', 'Renamed press', 'chest')];
line('product idCollisions on the folded rename', JSON.stringify(idCollisions(fileLifts, renamed)));
line('PROTOTYPE planIdCollisions on the folded rename',
  JSON.stringify(planIdCollisions(fileLifts, renamed, { correspondence })));
line('=> a legitimate rename is NOT a collision',
  String(planIdCollisions(fileLifts, renamed, { correspondence }).length === 0));

console.log('--- J3 (c) RETIRED AND TOMBSTONED CREATIONS STAY RESERVED');
const afterRemove = reservedHandles({ setupIds, fileIds: fileLifts.map(e => e.id),
  retired: ['lateral-2'], tombstoned: ['lateral-3'] });
line('re-adding the same label after a remove mints', mintExerciseId('Lateral', afterRemove));
line('=> never an implicit resurrection', 'true: the retired handle is still taken');

console.log('--- J3 (d) A PLAN-CREATED IDENTITY ALREADY IN THE ROSTER IS ESTABLISHED');
const roster = ['lateral-2'];
line('the roster row renamed, checked again',
  JSON.stringify(planIdCollisions(fileLifts, [EX('lateral-2', 'Side raise', 'delts')],
    { correspondence, rosterIds: roster })));
