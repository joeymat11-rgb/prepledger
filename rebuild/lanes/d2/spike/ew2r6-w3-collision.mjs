/* EW2 ROUND 6 WITNESS 3 - throwaway.
   J3: both halves of Astra F3.
   (a) a NEW identity whose normalised label EQUALS the occupied file handle's:
       the augmented idCollisions of E-R25 (i) returns nothing, and admission's
       own `held` skip sees the id as present, so the new identity silently
       answers for the file row.
   (b) an ESTABLISHED identity's folded RENAME, checked the same blind way, is
       reported as a collision when it is not one. */
import { createRequire } from 'node:module';
import { slugOf } from '../../../m3/w7-preview/today/setup-model.mjs';

const require = createRequire(import.meta.url);
const LC = require('../../../m4/workout/lift-correspondence.cjs');
const line = (k, v) => console.log(k.padEnd(60) + ' ' + v);

const EX = (id, n, mg) => ({ id, n, mg, day: 'U', sets: 2, hi: 9, inc: 2.75, steps: [11, 13.75, 16.5] });

/* THE FILE, in FILE space. */
const fileLifts = [EX('lateral', 'Lateral', 'back'), EX('press', 'Press', 'chest')];

/* (a) THE EQUAL LABEL. The athlete types "Lateral" in Edit My Week on a phone
   whose setup never had one; slugOf mints the id against the ids already taken. */
const setupIds = new Set(['press', 'row', 'squat']);
const minted = slugOf('Lateral', setupIds);
line('slugOf("Lateral", setupIds)', minted);
const added = EX(minted, 'Lateral', 'chest');
line('the FILE already holds that handle', String(fileLifts.some(e => e.id === minted)));
line('  and the file row it holds is', JSON.stringify(
  fileLifts.find(e => e.id === minted) && { id: 'lateral', n: 'Lateral', mg: 'back' }));

// E-R25 (i): idCollisions asked of the lifts admission will actually carry,
// the setup document's AND the folded week's.
const foldedWeek = [EX('press', 'Press', 'chest'), added];
const augmented = LC.idCollisions(fileLifts, foldedWeek);
line('E-R25 (i) augmented idCollisions', JSON.stringify(augmented));
const held = new Set(fileLifts.map(e => e.id));
line('source-admission `held.has(minted)` (the append skip)', String(held.has(minted)));
line('=> a NEW identity is treated as the existing FILE row', String(augmented.length === 0 && held.has(minted)));

// THE ALREADY-KNOWN CASE, for contrast: a different label under the same handle.
const unequal = LC.idCollisions(fileLifts, [EX('lateral', 'Lateral raise', 'chest')]);
line('unequal-name control (R5 B1 class)', JSON.stringify(unequal));

/* (b) THE CONVERSE. The athlete RENAMES his established Press to "Renamed press".
   The folded week carries the same identity under the same id and a new name. */
const renamedFold = [EX('press', 'Renamed press', 'chest')];
const renameCheck = LC.idCollisions(fileLifts, renamedFold);
line('folded RENAME of the same identity, checked blind', JSON.stringify(renameCheck));
line('=> a legitimate rename is reported as a collision', String(renameCheck.length > 0));

// And the same fold before the rename, as the baseline.
line('the same identity before the rename', JSON.stringify(LC.idCollisions(fileLifts, [EX('press', 'Press', 'chest')])));

/* WHAT slugOf RESERVES: only the set it is handed. */
const taken = new Set(['press']);
line('slugOf("Press", taken={press})', slugOf('Press', taken));
line('slugOf knows nothing of the FILE handles', 'true by construction: one argument, one set');
