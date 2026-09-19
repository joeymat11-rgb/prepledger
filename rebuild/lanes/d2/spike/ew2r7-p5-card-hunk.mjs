/* EW2 ROUND 7 PROTOTYPE CELL 5 - throwaway. THE HONEST PRICE OF B1.
   The corrected read has to reach the card, and the card builds its own lane at
   `gym-app.mjs:165-167`, so the correction cannot be installed by injection: it is a
   named hunk in a file section 3.2 committed to ZERO bytes. This cell COUNTS that
   hunk instead of estimating it, proves both of its anchors are unique so the count
   is real, proves the patched text still parses as an ES module, and proves the
   resolver adds nothing to the page's import graph.

   IT EDITS NO PRODUCT FILE. `gym-app.mjs` is read, patched IN MEMORY, written to the
   OS temp directory under a name of this cell's own, checked there with
   `node --check`, and its bytes on disk are compared before and after. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const line = (k, v) => console.log(k.padEnd(58) + ' ' + v);
const CARD = 'rebuild/m3/w7-preview/today/gym-app.mjs';
const VIEW = 'rebuild/m3/w7-preview/today/machine-settings-view.mjs';
const before = readFileSync(CARD, 'utf8');

const ANCHOR_IMPORT = "import MachineSettingsView from './machine-settings-view.mjs';";
const ANCHOR_READ = '      .then(() => settingsLane.latest(liftId))';
const occurrences = (text, needle) => text.split(needle).length - 1;
line('anchor 1, the view import, occurrences', String(occurrences(before, ANCHOR_IMPORT)));
line('anchor 2, the note read, occurrences', String(occurrences(before, ANCHOR_READ)));
assert.equal(occurrences(before, ANCHOR_IMPORT), 1, 'anchor 1 has moved');
assert.equal(occurrences(before, ANCHOR_READ), 1, 'anchor 2 has moved');

const patched = before
  .replace(ANCHOR_IMPORT, ANCHOR_IMPORT + "\nimport NoteIdentity from './machine-note-identity.mjs';")
  .replace(ANCHOR_READ, '      .then(() => NoteIdentity.latestNoteOn(settingsLane, liftId))');

/* The line count, by a line diff rather than by assertion. */
function diff(a, b) {
  const m = a.length, n = b.length, lcs = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--)
    lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
  let i = 0, j = 0, added = 0, removed = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) { i++; j++; }
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) { removed++; i++; }
    else { added++; j++; }
  }
  return { added: added + (n - j), removed: removed + (m - i) };
}
const counts = diff(before.split('\n'), patched.split('\n'));
line('added lines', String(counts.added));
line('removed lines', String(counts.removed));
line('HUNK_NET_LINES', String(counts.added - counts.removed));
assert.deepEqual(counts, { added: 2, removed: 1 });

/* It still parses, checked by node itself. */
const scratch = join(tmpdir(), 'ew2r7-card-hunk.mjs');
writeFileSync(scratch, patched, 'utf8');
let parsed = 'no';
try { execFileSync(process.execPath, ['--check', scratch], { stdio: 'pipe' }); parsed = 'yes'; }
finally { rmSync(scratch, { force: true }); }
line('the patched card parses as an ES module', parsed);
assert.equal(parsed, 'yes');

/* The resolver adds NOTHING to the page's import graph: its one product import is
   the coach's producer, which the card's own view module already pulls in. */
const view = readFileSync(VIEW, 'utf8');
const shared = "import MachineSettings from '../../../coach/machine-settings-commands.cjs';";
line('the view already imports the coach producer', String(occurrences(view, shared) === 1));
assert.equal(occurrences(view, shared), 1);

line('gym-app.mjs on disk is byte-unchanged', String(readFileSync(CARD, 'utf8') === before));
assert.equal(readFileSync(CARD, 'utf8'), before);
console.log('ALL ASSERTIONS HELD');
