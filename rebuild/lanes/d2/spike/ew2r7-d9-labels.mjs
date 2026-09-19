/* EW2 ROUND 7 CELL D9 - throwaway. Astra's debt D9 is a list of EVIDENCE LABELS in
   section 13 that are wrong by COUNT or by WORDING. Correcting a label is not a new
   author round, and a label is not corrected by agreeing with her in prose: this cell
   COUNTS each one. It reads only files this lane owns and changes nothing. */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const line = (k, v) => console.log(k.padEnd(58) + ' ' + v);
const SPIKE = 'rebuild/lanes/d2/spike';
const SPEC = 'rebuild/lanes/d2/EW2-SPEC.md';

/* 1. THE CELL CENSUS. */
const files = readdirSync(SPIKE).filter(f => f.startsWith('ew2r6-')).sort();
const witnesses = files.filter(f => /^ew2r6-w/.test(f));
const prototypes = files.filter(f => /^ew2r6-p\d/.test(f));
const support = files.filter(f => f === 'ew2r6-support.mjs');
const loader = files.filter(f => f === 'ew2r6-proto-r30.cjs');
line('ew2r6 files committed in spike/', String(files.length));
line('  witness programs', witnesses.length + ' ' + JSON.stringify(witnesses.map(f => f.slice(6, -4))));
line('  journey prototypes', prototypes.length + ' ' + JSON.stringify(prototypes.map(f => f.slice(6, -4))));
line('  support (never run alone) / loader', support.length + ' / ' + loader.length);
line('  EXECUTABLE cells, prototypes included', String(witnesses.length + prototypes.length));
assert.equal(files.length, 13);
assert.equal(witnesses.length, 8);
assert.equal(prototypes.length, 3);
assert.equal(witnesses.length + prototypes.length, 11);

/* 2. THE LOADER. It EXPORTS its net count; it neither prints it nor asserts it. */
const loaderPath = fileURLToPath(new URL('./ew2r6-proto-r30.cjs', import.meta.url));
const stdout = execFileSync(process.execPath, [loaderPath], { encoding: 'utf8' });
const source = readFileSync(loaderPath, 'utf8');
line('running the loader alone printed bytes', String(stdout.length));
line('  occurrences of "assert" in the loader', String(source.split('assert').length - 1));
line('  occurrences of "console." in the loader', String(source.split('console.').length - 1));
line('  the value it EXPORTS as HUNK_NET_LINES', String(require(loaderPath).HUNK_NET_LINES));
assert.equal(stdout, '');
assert.equal(source.split('assert').length - 1, 0);
assert.equal(source.split('console.').length - 1, 0);
assert.equal(require(loaderPath).HUNK_NET_LINES, 22);

/* 3. THE ACCEPTANCE ROWS SECTION 13 ADDS. Counted from the table itself. */
const spec = readFileSync(SPEC, 'utf8').split('\n');
const start = spec.findIndex(l => l.startsWith('### 13.11'));
const end = spec.findIndex((l, i) => i > start && l.startsWith('### 13.12'));
const rows = spec.slice(start, end).filter(l => /^\| \*\*`EW-\d+/.test(l));
const ids = rows.map(l => (l.match(/EW-\d+/) || [])[0]);
line('acceptance rows the 13.11 table carries', rows.length + ' ' + JSON.stringify(ids));
assert.equal(rows.length, 4);
assert.deepEqual(ids, ['EW-21', 'EW-22', 'EW-23', 'EW-24']);

/* 4. WHAT p1b's ready LINE IS, read from the cell that prints it. */
const p1b = readFileSync(SPIKE + '/ew2r6-p1b-j1-noHostBytes.mjs', 'utf8');
line('p1b reads "ready" off the fixture flag, not a join', String(p1b.includes('view.ready')));
line('p1b supplies its own admittedBasisOf', String(p1b.includes('admittedBasisOf:')));
/* The only Start-shaped token in p1b is `starts_on`, the edit's own effective day.
   No Start operation, no gym host and no adoption is executed anywhere in it. */
const startTokens = p1b.match(/workout-basis|workoutBasis|plan_basis|createGymHost|adopt[A-Za-z]*/g) || [];
line('p1b Start / adoption tokens', JSON.stringify(startTokens));
assert.equal(p1b.includes('view.ready'), true);
assert.equal(p1b.includes('admittedBasisOf:'), true);
assert.deepEqual(startTokens, []);

/* 5. WHAT p2's union LINE IS, read from the cell that prints it. */
const p2 = readFileSync(SPIKE + '/ew2r6-p2-j2-prototype.mjs', 'utf8');
line('p2 computes the union from the FOLDED state', String(p2.includes('after.state.exercises.filter')));
line('p2 writes planRoster once, from its entries list', String(p2.includes('out.planRoster = Object.fromEntries')));
assert.equal(p2.includes('after.state.exercises.filter'), true);
assert.equal(p2.includes('out.planRoster = Object.fromEntries'), true);
console.log('ALL ASSERTIONS HELD');
