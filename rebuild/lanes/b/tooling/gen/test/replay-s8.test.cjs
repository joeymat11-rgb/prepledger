'use strict';
/* SEAL-AUTOMATION ACCEPTANCE: REPLAY THE S8 PREPARATION ROUND.
   A generator that cannot regenerate S8 is not accepted. This cell runs new-child.cjs as
   if preparing M2-S8-REAL-SHAPE from M2-S7-PORT-ADMISSION at the real S8 preparation base,
   and compares every MECHANICAL fact it produces with what the round actually committed
   at 82c98f8 (DECISIONS:524).

   THE LINE THIS CELL DRAWS, and it is the whole argument:
     MECHANICAL  - anything the RUNNER or `node --test` reads as data: an array literal, a
                   file path, a sha256, a role, a needle, an argv, an asserted count.
                   These must be BYTE-IDENTICAL. A single difference here is a failure.
     PROSE       - a comment, a test title, an assertion message. Nobody's build reads
                   them. The generator mirrors them and the differences are COUNTED and
                   LISTED here, never asserted away.
   RED CONTROL at the bottom: the same comparison run against a generator whose mirror is
   missing one substitution must go red, or none of the above is a measurement.

   Base commits (all on rebuild/d-p3-real-shape, in this repo's object store):
     parent seal  285fe08b  the S7 fast-forward onto rebuild/t2-client-core
     source base  8ebc860c  the lane head S8.json records as sourceBase
     hunk base    1af78de   the tip merged into the lane, before any S8-PREP commit
     post head    82c98f8   the accepted S8-PREP head (reviews 63d6647, 1eccaf4) */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');
const M = require('../lib/measure.cjs');

const REPO = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const GEN = path.join(REPO, 'rebuild', 'lanes', 'b', 'tooling', 'gen', 'new-child.cjs');
const R = { parentSeal: '285fe08b30b5417ca9c0232c755d226f0ce62597', sourceBase: '8ebc860c30980dc5793be15202ea1a292e3769ba', base: '1af78de', post: '82c98f8' };
const SUBST = [
  'P3-PORT-FIX and P3-PORT-FIX-2=P3-REAL-SHAPE and P3-LAYOUT-V2',
  'DECISIONS:509, :510=DECISIONS:522, :523',
  '(:509, :510)=(:522, :523)',
  '(DECISIONS:509)=(DECISIONS:522)',
];

function generate(extra) {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'sealgen-replay-'));
  const argv = [GEN, '--id', 'S8', '--name', 'M2-S8-REAL-SHAPE', '--parent', 'S7',
    '--head', R.sourceBase, '--base', R.base, '--post-head', R.post, '--parent-seal', R.parentSeal,
    '--child-root', 'rebuild/lanes/d/p3-real-shape/', '--dispatch-line', '523',
    '--stage', process.env.GEN_REPLAY_NEEDLES ? 'all' : 'hunks', '--out', out, '--quiet', '--repo', REPO];
  for (const s of SUBST) argv.push('--subst', s);
  const r = cp.spawnSync(process.execPath, argv.concat(extra || []), { cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 26, windowsHide: true });
  assert.equal(r.status, 0, 'the generator itself must exit 0: ' + (r.stderr || '').slice(0, 400));
  return out;
}
const OUT = generate();
const real = f => { const b = M.blobBytes(REPO, R.post, f); return b === null ? null : b.toString('utf8'); };
const made = f => { const p = path.join(OUT, 'tree', f.split('/').join(path.sep)); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; };
const spec = JSON.parse(fs.readFileSync(path.join(OUT, 'packages', 'S8.json'), 'utf8'));
const realSpec = JSON.parse(real('rebuild/lanes/b/tooling/packages/S8.json'));
const TALLY = { compared: 0, identical: 0, prose: [], narrative: [], ordering: [], byteIdentical: [], unexplained: [] };
function fact(name, got, want) {
  TALLY.compared += 1;
  if (got === want || (got !== null && typeof got === 'object' && JSON.stringify(got) === JSON.stringify(want))) { TALLY.identical += 1; return true; }
  TALLY.unexplained.push(name + '\n      generated: ' + JSON.stringify(got) + '\n      committed: ' + JSON.stringify(want));
  return false;
}
/* THE CODE LINES OF A FILE: every line that is not a comment. A comment is a `//` or `#`
   line, or any line inside a `/* ... *​/` block. Nothing here is clever, because the
   comparison has to be arguable in one reading. */
function codeLines(text, hash) {
  const out = []; let inBlock = false;
  for (const raw of text.split('\n')) {
    const l = raw.trim();
    if (inBlock) { if (l.includes('*/')) inBlock = false; continue; }
    if (l.startsWith('/*')) { if (!l.includes('*/')) inBlock = true; continue; }
    if (!l || l.startsWith('//') || (hash && l.startsWith('#'))) continue;
    out.push(l);
  }
  return out;
}
const stripStrings = l => l.replace(/'(?:[^'\\]|\\.)*'/g, "''").replace(/"(?:[^"\\]|\\.)*"/g, '""');
/* A differing CODE line is prose only when the difference lives entirely inside a string
   that nothing reads as data - a `test(...)` title or the message argument of an assert.
   Every other difference is a code difference and fails this cell. */
const isNarrative = l => /^test\(/.test(l) || /assert[A-Za-z.]*\([\s\S]*,\s*['"]/.test(l);
function compareFile(f, hash) {
  const a = made(f), b = real(f);
  if (a === null || b === null) { fact('file present ' + f, a === null ? 'MISSING' : 'present', b === null ? 'MISSING' : 'present'); return; }
  TALLY.compared += 1;
  if (a === b) { TALLY.identical += 1; TALLY.byteIdentical.push(f); return; }
  const A = codeLines(a, hash), B = codeLines(b, hash);
  if (A.length !== B.length) { TALLY.unexplained.push(f + ': ' + A.length + ' code lines generated, ' + B.length + ' committed'); return; }
  const bad = [];
  for (let i = 0; i < A.length; i += 1) {
    if (A[i] === B[i]) continue;
    if (stripStrings(A[i]) === stripStrings(B[i]) && isNarrative(B[i])) { TALLY.narrative.push(f + ': ' + B[i].slice(0, 90)); continue; }
    bad.push(f + ' code line ' + (i + 1) + '\n      generated: ' + A[i].slice(0, 150) + '\n      committed: ' + B[i].slice(0, 150));
  }
  if (bad.length) TALLY.unexplained.push(...bad); else TALLY.prose.push(f);
}

const CELLS = ['source-carriers', 'inherited-carriers', 'defect-witnesses', 'writers-differential', 'second-gate']
  .map(n => 'rebuild/m4/workout/test/s8-supersede-' + n + '.test.cjs')
  .concat(['rebuild/m4/workout/test/s8-engine-files-differential.cjs']);
const CHILD_SPEC_CELLS = ['rebuild/m3/w7-preview/measure/test/boundary.test.mjs',
  'rebuild/m3/w7-preview/today/test/food.test.mjs', 'rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs',
  'rebuild/m3/w7-preview/today/test/problem.test.mjs', 'rebuild/m3/w7-preview/today/test/setup.test.mjs'];
const ANCESTORS = ['H3', 'S3', 'S4', 'S5', 'S6', 'S7'];
const grab = (text, re) => { const m = String(text).match(re); return m ? m[0] : null; };

test('REPLAY-1 - the three runner hunks are byte-identical to the hunks the round committed', () => {
  const a = made('rebuild/lanes/b/tooling/b-package.cjs'), b = real('rebuild/lanes/b/tooling/b-package.cjs');
  fact('IDS literal', grab(a, /^const SPEC_DIR = .*$/m), grab(b, /^const SPEC_DIR = .*$/m));
  fact('NO_REGISTER_IDS literal', grab(a, /^const NO_REGISTER_IDS = .*$/m), grab(b, /^const NO_REGISTER_IDS = .*$/m));
  const roots = s => { const L = s.split('\n'); const i = L.findIndex(l => /^const CHILD_ROOTS = \[/.test(l)); const o = []; for (let k = i; k < L.length; k += 1) { if (!/^\s*\/\//.test(L[k])) for (const m of (L[k].match(/'[^']*\/'/g) || [])) o.push(m); if (/\];\s*$/.test(L[k])) break; } return o; };
  fact('CHILD_ROOTS, element for element', roots(a), roots(b));
  fact('the argv gate the IDS comment cites', grab(a, /:\d+ refuses `--package/), grab(b, /:\d+ refuses `--package/));
  compareFile('rebuild/lanes/b/tooling/b-package.cjs');
});

test('REPLAY-2 - the six s8-* cells exist name for name and their CODE is byte-identical', () => {
  for (const f of CELLS) {
    compareFile(f);
    const a = made(f);
    fact(f + ' reads its own spec', a && a.includes("packages/S8.json'"), true);
    fact(f + ' names no S7 spec', a && a.includes("packages/S7.json'"), false);
  }
});

test('REPLAY-3 - F6/F7 assert the measured constants, and CHILD_SPECS gains S8 in every cell that has one', () => {
  const t = 'rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs';
  const a = made(t), b = real(t);
  for (const re of [/assert\.deepEqual\(api\.IDS, \[[^\]]*\]\);/, /assert\.deepEqual\(api\.IDS\.slice\(0, \d+\), \[[^\]]*\]\);/,
    /assert\.equal\(api\.IDS\.length, \d+\);/, /assert\.deepEqual\(\[\.\.\.api\.NO_REGISTER_IDS\]\.sort\(\), \[[^\]]*\]\);/,
    /assert\.equal\(api\.CHILD_ROOTS\.length, \d+\);/]) fact('tooling cell ' + re.source.slice(0, 38), grab(a, re), grab(b, re));
  fact('CHILD_ROOTS occurrences in F7', (a.match(/'rebuild\/lanes\/d\/p3-real-shape\/',/g) || []).length, (b.match(/'rebuild\/lanes\/d\/p3-real-shape\/',/g) || []).length);
  compareFile(t);
  for (const f of CHILD_SPEC_CELLS) { fact('CHILD_SPECS in ' + f, grab(made(f), /^const CHILD_SPECS = .*$/m), grab(real(f), /^const CHILD_SPECS = .*$/m)); compareFile(f); }
});

test('REPLAY-4 - every declared path, role, pre and post in packages/S8.json', () => {
  const g = spec.product, r = realSpec.product;
  const gk = Object.keys(g).sort(), rk = Object.keys(r).sort();
  const extra = gk.filter(f => !(f in r)), missing = rk.filter(f => !(f in g));
  for (const f of rk) { fact('role ' + f, g[f] && g[f].role, r[f].role); fact('pre ' + f, g[f] && g[f].pre, r[f].pre); fact('post ' + f, g[f] && g[f].post, r[f].post); }
  assert.deepEqual(missing, [], 'every path the round declared must be declared by the generator');
  /* EXTRA paths are not a defect and not a pass: they are exactly the candidates the
     generator declares and a PM may rule out (DECISIONS:524 N1 ruled the two
     p3-layout-v2 cells UNDECLARED and gave them a CI home by exact path instead). Each
     one is named in TODO.md with that reason, and --exclude is how the PM answers. */
  const todo = fs.readFileSync(path.join(OUT, 'TODO.md'), 'utf8');
  for (const f of extra) assert(todo.includes(f), 'an extra declared path must be named in TODO.md: ' + f);
  assert.deepEqual(extra, ['rebuild/lanes/d/p3-layout-v2/layout-v2.test.mjs', 'rebuild/lanes/d/p3-layout-v2/projector-parity.test.mjs'],
    'the only paths the generator declares that the round did not are the two the PM ruled out by hand at DECISIONS:524 N1');
});

test('REPLAY-5 - the package coordinates the runner reads, and the parent bound by artifact sha256', () => {
  fact('lanePackage', spec.lanePackage, realSpec.lanePackage);
  fact('packageId', spec.packageId, realSpec.packageId);
  fact('sourceBase', spec.sourceBase, realSpec.sourceBase);
  fact('parent.chosen', spec.parent.chosen, realSpec.parent.chosen);
  fact('parent artifact', spec.parent.options[0].artifact, realSpec.parent.options[0].artifact);
  fact('parent artifact sha256', spec.parent.options[0].sha256, realSpec.parent.options[0].sha256);
  fact('parent review', spec.parent.options[0].review, realSpec.parent.options[0].review);
  fact('parent review sha256', spec.parent.options[0].reviewSha256, realSpec.parent.options[0].reviewSha256);
  fact('parent receiptLedgerLine', spec.parent.options[0].receiptLedgerLine, realSpec.parent.options[0].receiptLedgerLine);
  fact('artifact.file', spec.artifact.file, realSpec.artifact.file);
  fact('artifact.review', spec.artifact.review, realSpec.artifact.review);
  fact('authorizations.review', spec.authorizations.review, realSpec.authorizations.review);
  fact('brief.file', spec.brief.file, realSpec.brief.file);
  fact('brief.sha256', spec.brief.sha256, realSpec.brief.sha256);
});

test('REPLAY-6 - the runner sha256 is re-pinned in every ancestor spec that pins it, from the generated bytes', () => {
  const want = M.sha256(Buffer.from(made('rebuild/lanes/b/tooling/b-package.cjs'), 'utf8'));
  fact('the package pins the sha of the runner this run generated', spec.tooling.runnerSha256, want);
  for (const id of ANCESTORS) {
    const g = JSON.parse(made('rebuild/lanes/b/tooling/packages/' + id + '.json'));
    fact(id + '.json re-pinned to the same runner', g.tooling.runnerSha256, want);
    const rr = JSON.parse(real('rebuild/lanes/b/tooling/packages/' + id + '.json'));
    fact(id + '.json re-pinned to the SAME sha the round pinned, allowing for the comment prose',
      rr.tooling.runnerSha256 === realSpec.tooling.runnerSha256, true);
  }
});

test('REPLAY-7 - the children, their argv and their needles', () => {
  const g = spec.children, r = realSpec.children;
  fact('child count', g.length, r.length);
  for (let i = 0; i < r.length; i += 1) {
    fact('child[' + i + '].name', g[i] && g[i].name, r[i].name);
    /* argv as a SET. The runner spawns `node --test <files>` and holds the child to one
       needle over the whole run (`# pass N`), so WHICH files are named is a fact and the
       ORDER they are named in is the author's reading order - real-shape-walk before
       real-shape-capture before the bar. The generator uses ls-tree order and says so in
       TODO.md; the difference is recorded here rather than asserted away. */
    const sorted = x => (x || []).slice().sort();
    if (!fact('child[' + i + '].argv (as a set)', sorted(g[i] && g[i].argv), sorted(r[i].argv))) continue;
    if (JSON.stringify(g[i].argv) !== JSON.stringify(r[i].argv)) TALLY.ordering.push('child `' + r[i].name + '` argv order');
    if (process.env.GEN_REPLAY_NEEDLES) fact('child[' + i + '].needle', g[i] && g[i].needle, r[i].needle);
  }
  if (!process.env.GEN_REPLAY_NEEDLES) {
    /* The needle mechanism proved on the cheapest real child rather than on all 25: the
       engine-files differential is the interesting one, because its needle is a whole
       sentence the child prints and not a `# pass N`, and children() requires it to stand
       at the head of a line. Set GEN_REPLAY_NEEDLES=1 for all 25. */
    const one = r.find(c => c.name === 'engine-files-differential');
    const run = M.runChild(REPO, one.argv);
    fact('the differential child is green here', run.status, 0);
    fact('its recorded needle stands at the head of a line of its own stdout', M.needleStandsAtLineStart(run.out, one.needle), true);
  }
});

test('REPLAY-8 - the three token lines: the sha256 this generator computes is the sha256 the runner matches', () => {
  /* The texts are the PM's and the generator never writes them. What is proved here is
     the RULE: sha256 over the line bytes, the leading dash included, the newline
     excluded - claim() at b-package.cjs and supersessionRuling(). Given the three real
     S8 line texts, this generator's own hash must be the one the sealed spec records. */
  fact('THEME lineSha256', M.sha256Text(realSpec.authorizations.theme.line), realSpec.authorizations.theme.lineSha256);
  fact('BRIEF-BY-SHA lineSha256', M.sha256Text(realSpec.brief.acceptedLedgerLine.line), realSpec.brief.acceptedLedgerLine.lineSha256);
  /* The ruling line is read at the CURRENT head, not at 82c98f8: the three token lines
     are appended AFTER the preparation round is accepted (they stand at :525, :526 and
     :527, and 82c98f8 predates all three). That ordering is the design - DECISIONS:524
     ends "Next: the three S8 token lines" - and it is why --ci at the prep head walks to
     RECEIPT-EXACT-LINE-MISSING and nothing worse. */
  const dec = M.blobBytes(REPO, 'HEAD', 'rebuild/DECISIONS.md').toString('utf8').split('\n');
  const gate = dec.find(l => M.sha256Text(l) === realSpec.coverage.superseded.rulingLineSha256);
  fact('the GATE-SUPERSESSION line is found in the ledger by its sha256 alone', typeof gate === 'string', true);
  fact('GATE-SUPERSESSION rulingLineSha256', gate && M.sha256Text(gate), realSpec.coverage.superseded.rulingLineSha256);
  fact('the BRIEF-BY-SHA line the generator drafts carries the measured brief sha256',
    fs.readFileSync(path.join(OUT, 'final-lines.txt'), 'utf8').includes(realSpec.brief.sha256), true);
});

test('REPLAY-9 - the standing CI step and the lane-cell step', () => {
  const a = made('.github/workflows/rebuild.yml'), b = real('.github/workflows/rebuild.yml');
  fact('the standing --ci --package line', grab(a, /^.*b-package\.cjs --ci --package S8$/m), grab(b, /^.*b-package\.cjs --ci --package S8$/m));
  fact('the standing step NAME', grab(a, /^\s*- name: Cumulative S8 .*$/m), grab(b, /^\s*- name: Cumulative S8 .*$/m));
  /* The lane-cell run line is generated by exact path from the child roots; the round's
     own line also names the two p3-layout-v2 cells the PM gave a CI home WITHOUT
     declaring them, which is the same ruling REPLAY-4 measures at the other end. */
  const gr = grab(a, /^\s*run: node --test rebuild\/lanes\/d\/p3-real-shape\/.*$/m);
  const rr = grab(b, /^\s*run: node --test rebuild\/lanes\/d\/p3-real-shape\/.*$/m);
  const cellsOf = s => (s || '').split(' ').filter(x => x.startsWith('rebuild/lanes/d/p3-real-shape/')).sort();
  if (fact('the lane-cell step names the six p3-real-shape cells by exact path (as a set)', cellsOf(gr), cellsOf(rr))
    && gr.split(' ').filter(x => x.startsWith('rebuild/')).join(' ') !== rr.split(' ').filter(x => x.startsWith('rebuild/')).join(' ')) {
    TALLY.ordering.push('the rebuild.yml lane-cell step, cell order (and the round also names the two p3-layout-v2 cells here, the DECISIONS:524 N1 ruling)');
  }
});

test('REPLAY-10 - THE VERDICT: every mechanical fact is identical, and every difference that is left is prose', () => {
  const lines = ['', 'REPLAY OF THE S8 PREPARATION ROUND (' + R.post + ')',
    '  facts compared        ' + TALLY.compared,
    '  identical             ' + TALLY.identical,
    '  byte-identical files  ' + TALLY.byteIdentical.length + (TALLY.byteIdentical.length ? '  [' + TALLY.byteIdentical.map(f => f.split('/').pop()).join(', ') + ']' : ''),
    '  files differing in comment prose only  ' + TALLY.prose.length + (TALLY.prose.length ? '  [' + TALLY.prose.map(f => f.split('/').pop()).join(', ') + ']' : ''),
    '  test titles / assert messages differing ' + TALLY.narrative.length,
    '  ordering the runner does not read      ' + TALLY.ordering.length,
    '  UNEXPLAINED           ' + TALLY.unexplained.length];
  for (const u of TALLY.narrative) lines.push('    narrative  ' + u);
  for (const u of TALLY.ordering) lines.push('    ordering   ' + u);
  for (const u of TALLY.unexplained) lines.push('    UNEXPLAINED  ' + u);
  console.log(lines.join('\n'));
  assert.equal(TALLY.unexplained.length, 0, 'unexplained differences:\n' + TALLY.unexplained.join('\n'));
  assert(TALLY.compared > 600, 'the comparison must actually be wide: ' + TALLY.compared + ' facts');
});

test('REPLAY-11 - RED CONTROL: a generator whose mirror is missing one substitution is caught', () => {
  /* Missing --subst pairs only change PROSE, and REPLAY-10 tolerates prose by design; a
     control that moved nothing mechanical would prove nothing. So this one breaks two
     facts the cells above compare by name: the spec every s8-* cell reads (REPLAY-2) and
     the child root (REPLAY-1, REPLAY-3). Both must be seen. */
  /* The mirror reads the PARENT's text, so the way to break the spec path is to pin the
     parent's own spelling to itself: a longer key wins the alternation, so
     `packages/S7.json` beats the `S7 -> S8` rule and the mutant cell keeps reading S7. */
  const out = generate(['--child-root', 'rebuild/lanes/d/NOT-A-ROOT/', '--subst', 'packages/S7.json=packages/S7.json']);
  const rd = f => fs.readFileSync(path.join(out, 'tree', f.split('/').join(path.sep)), 'utf8');
  const cell = rd('rebuild/m4/workout/test/s8-supersede-second-gate.test.cjs');
  assert(cell.includes("packages/S7.json'"), 'the mutant must read the WRONG spec');
  assert(!cell.includes("packages/S8.json'"), 'and not the right one');
  assert(made('rebuild/m4/workout/test/s8-supersede-second-gate.test.cjs').includes("packages/S8.json'"),
    'while the real run reads the right one - which is the fact REPLAY-2 asserts');
  const mutant = rd('rebuild/lanes/b/tooling/b-package.cjs'), good = made('rebuild/lanes/b/tooling/b-package.cjs');
  const roots = s => grab(s, /^const CHILD_ROOTS[\s\S]*?\];$/m);
  assert.notEqual(roots(mutant), roots(good), 'the child root must move, or REPLAY-1 proves nothing');
  assert(roots(mutant).includes('NOT-A-ROOT'), 'and it must be the root the control gave');
  const tc = rd('rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs');
  assert.notEqual(grab(tc, /assert\.equal\(api\.CHILD_ROOTS\.length, \d+\);/),
    grab(made('rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs'), /assert\.equal\(api\.CHILD_ROOTS\.length, \d+\);/),
    'and F7 must count it, or REPLAY-3 proves nothing');
});
