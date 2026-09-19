/* EW2 BUILD BRIEF - E-R40 CONDITION 1: HUNK E, RE-MEASURED AT THE BUILD BASE.

   DECISIONS:621 (3) GRANTS hunk E as a named budget item on three conditions,
   the first of which is this one, in the PM's own words: "it is RE-MEASURED at
   the build base (the Today split cut the settings lane out of gym-app.mjs; if
   the read lives in gym-settings-lane.mjs by then, the hunk moves with it and
   is re-counted)".

   Spec 14.4 counted hunk E at `1ad61cfe`, where the read was
   `gym-app.mjs:147`'s `settingsLane.latest(liftId)`: 2 added, 1 removed.
   This cell re-counts it wherever the read actually lives NOW.

   IT READS FILES AND WRITES NOTHING. No product is executed, no DOM is driven
   and no byte is proposed: it counts a candidate patch in memory the way
   `ew2r7-p5-card-hunk.mjs` counted the original, and proves the files on disk
   are byte-unchanged afterwards.

   Run it against any checkout, naming that checkout's root:
     node rebuild/lanes/d/plan-edit/ew2b-r40-hunk-e-base.mjs <repo root>     */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.argv[2] || fileURLToPath(new URL('../../../../', import.meta.url));
const TODAY = path.join(ROOT, 'rebuild/m3/w7-preview/today');
const line = (k, v) => console.log(String(k).padEnd(56) + ' ' + v);
const occurrences = (text, needle) => text.split(needle).length - 1;

/* The read the corrected note resolver has to replace, in whichever file holds
   it, and the import line the resolver is inserted beside. */
const READ_CALL = 'settingsLane.latest(liftId)';
const CANDIDATES = ['gym-app.mjs', 'gym-settings-lane.mjs'];
let FIRST_BODY_LINE = null;

console.log('EW2B E-R40: WHERE HUNK E LANDS, AND WHAT IT COSTS THERE');
line('the checkout this run measured', ROOT);
console.log('');

const holders = [];
for (const name of CANDIDATES) {
  const file = path.join(TODAY, name);
  if (!existsSync(file)) { line(name, 'does not exist in this checkout'); continue; }
  const text = readFileSync(file, 'utf8');
  const n = occurrences(text, READ_CALL);
  line(name + ' holds ' + READ_CALL, n + (n ? ' time(s)' : ' times'));
  if (n) holders.push({ name, file, text, n });
}
console.log('');

assert.equal(holders.length, 1,
  'the note read is in ' + holders.length + ' files here, so hunk E has no single home');
const holder = holders[0];
line('HUNK E LANDS IN', holder.name);
assert.equal(holder.n, 1, 'the read call is not unique in ' + holder.name);
FIRST_BODY_LINE = holder.text.split('\n').find(t => /^export\s|^const\s|^function\s/.test(t)) || '';

/* THE HOLDER'S OWN IDIOM decides what an import COSTS here. gym-app.mjs has a
   static import block; the cut settings lane at the build base has NO static
   import at all and reaches its host through a DYNAMIC import. So both shapes
   are counted, and the PM is shown the price of each rather than one number
   that quietly assumes the shape. */
const lines = holder.text.split('\n');
const importLines = lines.filter(t => /^import\s/.test(t));
line('static import lines in ' + holder.name, importLines.length);
line('dynamic import() calls in ' + holder.name, occurrences(holder.text, 'import(\'./'));
line('anchor, the note read, occurrences', occurrences(holder.text, READ_CALL));
console.log('');

const RESOLVER = './machine-note-identity.mjs';
const count = patchedText => {
  const after = patchedText.split('\n');
  let removed = 0;
  for (const l of lines) if (!after.includes(l)) removed += 1;
  const added = after.length - lines.length + removed;
  return { added, removed, net: after.length - lines.length, after: patchedText };
};

/* SHAPE 1: a STATIC import, placed beside the last one where there is one and
   at the head of the module body where there is not, plus the read call. */
const anchorImport = importLines.length ? importLines[importLines.length - 1] : null;
const STATIC_LINE = "import { latestNoteOn } from '" + RESOLVER + "';";
const shape1 = count(anchorImport
  ? holder.text.replace(anchorImport, anchorImport + '\n' + STATIC_LINE)
      .replace(READ_CALL, 'latestNoteOn(settingsLane, liftId)')
  : holder.text.replace(FIRST_BODY_LINE, STATIC_LINE + '\n\n' + FIRST_BODY_LINE)
      .replace(READ_CALL, 'latestNoteOn(settingsLane, liftId)'));
line('SHAPE 1, a static import: added / removed', shape1.added + ' / ' + shape1.removed);

/* SHAPE 2: the holder's OWN idiom, a dynamic import in place. It adds no
   import line and no static edge to the page's import graph. */
const shape2 = count(holder.text.replace(READ_CALL,
  "import('" + RESOLVER + "').then(m => m.latestNoteOn(settingsLane, liftId))"));
line('SHAPE 2, a dynamic import in place: added / removed', shape2.added + ' / ' + shape2.removed);
console.log('');

for (const [name, shape] of [['SHAPE 1', shape1], ['SHAPE 2', shape2]]) {
  let ok = true;
  try { await import('data:text/javascript;base64,' + Buffer.from(shape.after).toString('base64')); }
  catch (error) { if (/SyntaxError/.test(String(error && error.name))) ok = false; }
  line(name + ' parses as an ES module', String(ok));
  assert.equal(ok, true, name + ' does not parse');
}
line(holder.name + ' on disk is byte-unchanged', String(readFileSync(holder.file, 'utf8') === holder.text));
console.log('');

console.log('THE PIN, asserted:');
assert.equal(shape1.removed, 1, 'SHAPE 1 does not replace exactly one line');
assert.equal(shape2.removed, 1, 'SHAPE 2 does not replace exactly one line');
/* A file WITH an import block takes the new import as ONE line beside the
   others; a file with NONE takes it as a line plus the blank that separates it
   from the body. Both are counted, neither is assumed. */
assert.equal(shape1.added, anchorImport ? 2 : 3,
  'SHAPE 1 is not the size this holder\'s import block implies');
assert.equal(shape2.added, 1, 'SHAPE 2 is not 1 added line');
assert.equal(readFileSync(holder.file, 'utf8'), holder.text, 'this cell wrote to a product file');
console.log('  HUNK E LANDS IN ' + holder.name + ' in this checkout.');
console.log('  SHAPE 1, a static import, is ' + shape1.added + ' added and ' + shape1.removed + ' removed.');
console.log(anchorImport
  ? '  This holder HAS an import block, so that is spec 14.4\'s own count, reproduced.'
  : '  This holder has NO static import at all, so the import costs a line AND');
if (!anchorImport) console.log('  the blank that separates it from the body: THREE, not two.');
console.log('  SHAPE 2, the dynamic import this file already uses for its host,');
console.log('  is 1 added and 1 removed, net 0, and adds no static edge to the');
console.log('  page\'s import graph at all.');
console.log('  Nothing on disk moved and no byte is proposed here.');
console.log('');
console.log('NOT MEASURED HERE, and no line above claims it: the patched file was');
console.log('not EXECUTED on a linked card path. That is E-R40 condition 2 and it');
console.log('needs a DOM, which no cell of this round drove.');
console.log('');
console.log('ALL ASSERTIONS HELD');
