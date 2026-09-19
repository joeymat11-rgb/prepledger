/* EW2 BUILD BRIEF, LOOP ROUND 1 FIX - THE TWO NOTES THAT CARRY A NUMBER.

   N7: "B0 needs 28 selectable IDs (27 in spec 5 plus EW-25), not 23 plus one."
   The brief took spec 5's own sentence, "TWENTY-THREE selectable ids over
   twenty cells", which was written in v5 and never re-counted after v6 added
   four acceptance rows to that same table. This cell COUNTS the table.

   N2 / D6: "place slugOf/reserved-id minting on a permitted import boundary;
   E6 forbids the released setup-model import that 13.4's direct provider call
   assumes." The brief promised to name the boundary later. This cell measures
   where it already is.

   IT READS FILES AND WRITES NOTHING.
   Run it as:  node rebuild/lanes/d/plan-edit/ew2b-n-register.mjs             */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../../../', import.meta.url));
const read = rel => readFileSync(path.join(ROOT, rel), 'utf8');
const line = (k, v) => console.log(String(k).padEnd(56) + ' ' + v);

console.log('EW2B N7 AND N2/D6: THE ID REGISTER AND THE MINTING BOUNDARY');
console.log('');

/* ---------------- N7: SPEC 5's TABLE, COUNTED ---------------- */
const spec = read('rebuild/lanes/d2/EW2-SPEC.md').split('\n');
const start = spec.findIndex(l => l.startsWith('## 5. THE CELL PLAN'));
const end = spec.findIndex((l, i) => i > start && l.startsWith('## 6. '));
assert.ok(start > 0 && end > start, 'spec section 5 could not be located');
const ids = [];
for (const row of spec.slice(start, end)) {
  if (!row.startsWith('|')) continue;
  const first = row.split('|')[1] || '';
  const found = first.match(/EW-\d+[a-d]?/);
  if (found && !ids.includes(found[0])) ids.push(found[0]);
}
line('spec section 5 spans lines', (start + 1) + ' to ' + end);
line('selectable ids its table carries', ids.length);
line('  the four v6 rows among them',
  ['EW-21', 'EW-22', 'EW-23', 'EW-24'].filter(id => ids.includes(id)).join(', '));
line('spec 5 still SAYS, in its own prose', 'TWENTY-THREE selectable ids');
line('EW-25, added by :621 (5), is in that table', String(ids.includes('EW-25')));
line('SO B0 WRITES', (ids.length + 1) + ' selectable ids');
console.log('');
assert.equal(ids.length, 27, 'spec section 5 does not carry 27 selectable ids');
assert.equal(ids.includes('EW-25'), false, 'EW-25 is in spec 5 after all');
assert.equal(spec.slice(start, end).join('\n').includes('TWENTY-THREE selectable ids'), true,
  'spec 5 no longer carries the sentence this note corrects');

/* ---------------- N2 / D6: WHERE slugOf MAY BE CALLED ---------------- */
const SETUP_MODEL = 'rebuild/m3/w7-preview/today/setup-model.mjs';
const ADMISSION = 'rebuild/m3/w6/local/source-admission.mjs';
const admission = read(ADMISSION);
const EXISTING = "import {createCleanInitState} from '../../w7-preview/today/setup-model.mjs';";
const occurrences = (t, n) => t.split(n).length - 1;
line('setup-model.mjs exports slugOf', String(/export function slugOf\(/.test(read(SETUP_MODEL))));
line('source-admission.mjs ALREADY imports setup-model.mjs', occurrences(admission, EXISTING));
assert.equal(occurrences(admission, EXISTING), 1, 'the admission import line has moved');
const withSlug = admission.replace(EXISTING,
  "import {createCleanInitState, slugOf} from '../../w7-preview/today/setup-model.mjs';");
const before = admission.split('\n'), after = withSlug.split('\n');
let changed = 0;
for (let i = 0; i < before.length; i += 1) if (before[i] !== after[i]) changed += 1;
line('adding slugOf to it costs, in lines', changed + ' changed, 0 added');
assert.equal(changed, 1, 'adding slugOf is not one changed line');
assert.equal(after.length, before.length, 'adding slugOf added a line');

/* AND WHY IT MAY NOT BE CALLED FROM THE PAGE: every today-page module that
   imports setup-model.mjs, listed rather than claimed. */
const TODAY = 'rebuild/m3/w7-preview/today';
const pageImporters = readdirSync(path.join(ROOT, TODAY))
  .filter(name => /\.(mjs|cjs)$/.test(name))
  .filter(name => /from ['"]\.\/setup-model\.mjs['"]|require\(['"]\.\/setup-model\.mjs['"]\)/
    .test(read(TODAY + '/' + name)));
line('today-page modules importing setup-model.mjs', pageImporters.join(', ') || 'none');
line('the EW2 lane is one of them', String(pageImporters.includes('edit-week-lane.cjs')));
assert.equal(pageImporters.includes('edit-week-lane.cjs'), false,
  'the EW2 lane already imports setup-model.mjs, which 2.2 E6 forbids');
console.log('');

console.log('THE PIN, asserted:');
console.log('  N7: spec 5\'s table carries ' + ids.length + ' selectable ids, not 23. Its own');
console.log('  prose was written in v5 and never re-counted when v6 added EW-21');
console.log('  to EW-24 to that same table. B0 writes ' + (ids.length + 1) + ', EW-25 included.');
console.log('  N2/D6: the permitted minting boundary is source-admission.mjs,');
console.log('  which ALREADY imports setup-model.mjs for createCleanInitState.');
console.log('  Adding slugOf to that one import line is 1 changed line and 0');
console.log('  added. The today PAGE may not do it: 2.2\'s E6 row keeps');
console.log('  setup-model.mjs off the lane\'s MAY-IMPORT list, and no lane file');
console.log('  imports it today.');
console.log('');
console.log('ALL ASSERTIONS HELD');
