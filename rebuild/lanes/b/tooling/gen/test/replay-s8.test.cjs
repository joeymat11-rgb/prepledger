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
const C = require('../lib/compare.cjs');

const REPO = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const GEN = path.join(REPO, 'rebuild', 'lanes', 'b', 'tooling', 'gen', 'new-child.cjs');
const R = { parentSeal: '285fe08b30b5417ca9c0232c755d226f0ce62597', sourceBase: '8ebc860c30980dc5793be15202ea1a292e3769ba', base: '1af78de', post: '82c98f8' };
const SUBST = [
  'P3-PORT-FIX and P3-PORT-FIX-2=P3-REAL-SHAPE and P3-LAYOUT-V2',
  'DECISIONS:509, :510=DECISIONS:522, :523',
  '(:509, :510)=(:522, :523)',
  '(DECISIONS:509)=(DECISIONS:522)',
];

/* R1 N2. THE NEEDLE COMPARISON AND WHAT IT REQUIRES.
   A needle is a `# pass N` (or a verdict sentence) printed by the tree that is CHECKED
   OUT. Comparing the generator's needles with the ones the S8 round recorded is therefore
   only meaningful from a worktree standing AT the post head, under the env children()
   builds. Those two conditions are checked here and the switch is named after them. When
   either is missing the comparison is DECLINED with its reason printed - not skipped in
   silence, and not reported as a proof that ran. */
const AT_POST_HEAD = M.revParse(REPO, 'HEAD') === M.revParse(REPO, R.post);
/* Two spellings, one switch: the long name says what it requires, and GEN_REPLAY_NEEDLES
   is the short one the ticket and the PM use. Neither weakens the two conditions below. */
const WANT_NEEDLES = !!(process.env.GEN_REPLAY_NEEDLES_AT_POST_HEAD || process.env.GEN_REPLAY_NEEDLES);
let NEEDLES_COMPARABLE = false, NEEDLES_WHY = '';
if (!WANT_NEEDLES) {
  NEEDLES_WHY = 'To compare all 25: check a worktree out AT ' + R.post + ' and set GEN_REPLAY_NEEDLES_AT_POST_HEAD=1. Anywhere else the numbers belong to a different tree.';
} else if (!AT_POST_HEAD) {
  NEEDLES_WHY = 'GEN_REPLAY_NEEDLES_AT_POST_HEAD is set, but HEAD is ' + M.revParse(REPO, 'HEAD').slice(0, 8) + ' and the post head is ' + R.post + '. A needle measured against another tree is not evidence about this round, so the comparison was declined.';
} else {
  /* `referenceOk`, not `exact`: THIS process is a `node --test` child and `childEnv()`
     refuses for that reason alone, correctly. The process that measures the needles is the
     GENERATOR, which `generate()` spawns without NODE_TEST_CONTEXT, so its own
     `childEnv()` is the exact one. What has to hold HERE is the other half - that the
     pinned reference bundles can be built in this worktree at all. */
  const ce = M.childEnv(REPO);
  if (!ce.referenceOk) NEEDLES_WHY = 'HEAD is at the post head, but the env is not the one children() builds: ' + ce.why;
  else NEEDLES_COMPARABLE = true;
}

/* R2 N2. Every run made two `sealgen-replay-*` folders of 25 files and removed neither, on
   a PC several lanes share. They are this cell's own and this cell takes them away again
   (REPLAY-15, last); nothing else in %TEMP% is touched. */
const MADE = [];
function generate(extra, stage) {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'sealgen-replay-'));
  MADE.push(out);
  const argv = [GEN, '--id', 'S8', '--name', 'M2-S8-REAL-SHAPE', '--parent', 'S7',
    '--head', R.sourceBase, '--base', R.base, '--post-head', R.post, '--parent-seal', R.parentSeal,
    '--child-root', 'rebuild/lanes/d/p3-real-shape/', '--dispatch-line', '523',
    '--stage', stage || (NEEDLES_COMPARABLE ? 'all' : 'hunks'), '--out', out, '--quiet', '--repo', REPO];
  for (const s of SUBST) argv.push('--subst', s);
  /* NOT A TEST CHILD. This process carries NODE_TEST_CONTEXT=child-v8, and a `node --test`
     grandchild that inherits it reports over the v8 serializer: empty stdout, exit 0, no
     needle, and a red child that looks green. The generator the PM runs is an ordinary
     process, so the one this cell runs is given an ordinary process's env. `childEnv()`
     refuses outright when the variable is present, which is the safety net under this. */
  const env = Object.assign({}, process.env);
  delete env.NODE_TEST_CONTEXT;
  const r = cp.spawnSync(process.execPath, argv.concat(extra || []), { cwd: REPO, env, encoding: 'utf8', maxBuffer: 1 << 26, windowsHide: true });
  assert.equal(r.status, 0, 'the generator itself must exit 0: ' + (r.stderr || '').slice(0, 400));
  return out;
}
const OUT = generate();
const real = f => { const b = M.blobBytes(REPO, R.post, f); return b === null ? null : b.toString('utf8'); };
const made = f => { const p = path.join(OUT, 'tree', f.split('/').join(path.sep)); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; };
const spec = JSON.parse(fs.readFileSync(path.join(OUT, 'packages', 'S8.json'), 'utf8'));
const realSpec = JSON.parse(real('rebuild/lanes/b/tooling/packages/S8.json'));
const TALLY = { compared: 0, identical: 0, selfChecks: 0, internal: 0, prose: [], narrative: [], ordering: [], byteIdentical: [], unexplained: [] };
/* R2 M4. THREE KINDS OF CHECK, COUNTED APART, and only the first is reproduction.
   fact()      - something THIS RUN GENERATED against something THE ROUND COMMITTED.
   internal()  - both sides generated: the generated cell against a literal, the generated
                 spec against the sha of the generated runner. Real checks, and they are
                 exactly as strong as the generator's own consistency, which is not what
                 "reproduced the round" means. 19 of the 795 the R1 round led with were
                 these, and they were inside the headline.
   selfCheck() - both sides committed: a property of the round, not of this generator. */
function internal(name, got, want) {
  TALLY.internal += 1;
  if (got === want || (got !== null && typeof got === 'object' && JSON.stringify(got) === JSON.stringify(want))) return true;
  TALLY.unexplained.push('INTERNAL ' + name + '\n      got: ' + JSON.stringify(got) + '\n      want: ' + JSON.stringify(want));
  return false;
}
/* A CROSS-SIDE fact: something this run generated against something the round committed.
   Only these are counted in the headline (R1 N6). */
function fact(name, got, want) {
  TALLY.compared += 1;
  if (got === want || (got !== null && typeof got === 'object' && JSON.stringify(got) === JSON.stringify(want))) { TALLY.identical += 1; return true; }
  TALLY.unexplained.push(name + '\n      generated: ' + JSON.stringify(got) + '\n      committed: ' + JSON.stringify(want));
  return false;
}
/* A SELF-CHECK: both sides of it come from the same side of the round (committed against
   committed, or generated against generated). It is a real check and it is reported, but
   it is NOT a comparison of this generator with the round, so it is counted apart from
   the headline - the number in the report is what the generator reproduced, nothing else. */
function selfCheck(name, got, want) {
  TALLY.selfChecks += 1;
  if (got === want || (got !== null && typeof got === 'object' && JSON.stringify(got) === JSON.stringify(want))) return true;
  TALLY.unexplained.push('SELF-CHECK ' + name + '\n      got: ' + JSON.stringify(got) + '\n      want: ' + JSON.stringify(want));
  return false;
}
/* THE CODE LINES OF A FILE and the MECHANICAL / PROSE rule both live in
   gen/lib/compare.cjs now, so that the rule itself can be put under test with real
   committed lines and a mutant of one (REPLAY-12). */
const codeLines = C.codeLines;
function compareFile(f, hash) {
  const a = made(f), b = real(f);
  if (a === null || b === null) { fact('file present ' + f, a === null ? 'MISSING' : 'present', b === null ? 'MISSING' : 'present'); return; }
  TALLY.compared += 1;
  if (a === b) { TALLY.identical += 1; TALLY.byteIdentical.push(f); return; }
  const A = codeLines(a, hash), B = codeLines(b, hash);
  if (A.length !== B.length) { TALLY.unexplained.push(f + ': ' + A.length + ' code lines generated, ' + B.length + ' committed'); return; }
  const bad = [];
  for (let i = 0; i < A.length; i += 1) {
    const verdict = C.classifyLine(A[i], B[i]);
    if (verdict === 'same') continue;
    if (verdict === 'narrative') { TALLY.narrative.push(f + ': ' + B[i].slice(0, 90)); continue; }
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
const NEEDLE_TABLE = [];

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
    /* R2 M4: generated against a literal - internal, not reproduction. */
    internal(f + ' reads its own spec', a && a.includes("packages/S8.json'"), true);
    internal(f + ' names no S7 spec', a && a.includes("packages/S7.json'"), false);
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
  /* R1 N4. "Named in TODO.md" passed trivially - every new path is named. The fact worth
     asserting is that each extra is named WITH THE RULING THAT APPLIES TO IT: it stands
     under no declared child root, so no declared child executes it, which is the
     DECISIONS:524 N1 shape. */
  const entryFor = f => (todo.split('\n\n').find(p => p.includes(f)) || '');
  /* R2 M3. "Under no declared child root" is not the test DECISIONS:524 N1 applied, and it
     was FALSE for six of the eleven paths this sentence reached: the s8-* supersede cells
     ARE the child argv targets and they live under rebuild/m4/workout/test/, which is no
     child's root. The test is now "does a declared child EXECUTE it" - argv target, or
     reached from one by import - and this cell asserts BOTH ends of it: the two paths that
     really are the :524 N1 shape carry the ruling, and no path a declared child executes
     carries it. The table is printed so the answer for each path can be read, not taken. */
  /* THE RULING, as the entry applies it: the :524 N1 citation TOGETHER WITH the claim that
     no declared child executes the path, and the invitation to --exclude that follows from
     it. A sentence that cites :524 N1 in order to say the shape does NOT apply is not this. */
  const N1_SHAPE = e => /DECISIONS:524 N1/.test(e) && /no declared child executes it/i.test(e);
  const INVITES_EXCLUDE = e => /Answer with --exclude to keep it undeclared/.test(e);
  /* BEHAVIOUR FIRST, with no help from anything this round added: the six generated s8-*
     cells are declared `new` and they ARE the child argv targets (REPLAY-7 compares those
     argv sets with the round's). None of them may be told that no declared child executes
     it, and none may be invited to --exclude. This is the assertion that goes red against
     the reviewed head. */
  for (const f of CELLS) {
    const e = entryFor(f);
    assert(e, 'every declared new path is named in TODO.md: ' + f);
    assert(!N1_SHAPE(e) && !INVITES_EXCLUDE(e), 'a path a declared child executes BY NAME must not carry the :524 N1 ruling:\n  ' + f + '\n' + e);
  }
  const rep = JSON.parse(fs.readFileSync(path.join(OUT, 'REPORT.json'), 'utf8'));
  console.log('  the `new` paths and the sentence each one gets (R2 M3):');
  for (const r of rep.newPaths) console.log('    ' + (r.executedBy + '        ').slice(0, 10) + ' ' + (r.child || '-') + '  ' + r.path);
  for (const f of extra) {
    assert(todo.includes(f), 'an extra declared path must be named in TODO.md: ' + f);
    assert(N1_SHAPE(entryFor(f)), 'an extra declared path must carry the ruling that applies to it:\n' + entryFor(f));
  }
  for (const r of rep.newPaths) {
    const e = entryFor(r.path);
    if (r.executedBy === 'none') { assert(N1_SHAPE(e), 'a path no declared child executes must carry the :524 N1 ruling: ' + r.path); continue; }
    assert(!N1_SHAPE(e) && !INVITES_EXCLUDE(e),
      'a path a declared child EXECUTES (' + r.executedBy + ', child ' + r.child + ') must NOT be told no child executes it, and must not be invited to --exclude:\n  ' + r.path + '\n' + e);
  }
  for (const f of CELLS) {
    const row = rep.newPaths.find(r => r.path === f);
    assert(row && row.executedBy === 'argv', 'the generated s8-* cells are the child argv targets: ' + f + ' -> ' + (row && row.executedBy));
  }
  assert.deepEqual(rep.newPaths.filter(r => r.executedBy === 'none').map(r => r.path).sort(), extra.slice().sort(),
    'the paths no declared child executes are exactly the extras the PM ruled out at :524 N1');
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

test('REPLAY-6 - the runner sha256 is re-pinned in exactly the specs the round re-pinned', () => {
  const want = M.sha256(Buffer.from(made('rebuild/lanes/b/tooling/b-package.cjs'), 'utf8'));
  /* THE SET IS THE CROSS-SIDE FACT (R1 N6). The VALUE cannot be: the generated runner
     differs from the committed one in comment prose, so its sha256 differs by
     construction, and the old cell compared the committed specs with each other and
     counted that as reproduction. What the round DID commit, and what this generator can
     be held to, is WHICH specs it touched: measured here from the diff of the round
     itself, and compared with the generator's own REPORT.json. */
  const repinnedByTheRound = M.diffNames(REPO, R.base, R.post)
    .filter(f => /^rebuild\/lanes\/b\/tooling\/packages\/[A-Z0-9]+\.json$/.test(f))
    .filter(f => {
      const before = M.blobBytes(REPO, R.base, f), after = M.blobBytes(REPO, R.post, f);
      if (!before || !after) return false;
      const t = b => { try { return JSON.parse(b.toString('utf8')).tooling.runnerSha256; } catch (e) { return null; } };
      return t(before) !== t(after);
    })
    .map(f => f.split('/').pop().replace('.json', ''))
    .filter(id => id !== 'S8')
    .sort();
  const report = JSON.parse(fs.readFileSync(path.join(OUT, 'REPORT.json'), 'utf8'));
  fact('the SET of ancestor specs re-pinned', report.repinnedSpecs.slice().sort(), repinnedByTheRound);
  /* R2 M4: generated spec against the sha of the generated runner - internal. */
  internal('the package pins the sha of the runner this run generated', spec.tooling.runnerSha256, want);
  /* R2 N1. Only ONE FIELD of each ancestor spec was compared, and the generator
     re-serialises the whole file with JSON.stringify(s, null, 2) + '\n'. A change in key
     order or spacing would move six pinned product shas and nothing here would see it -
     REPLAY-4 reads `post` from the git blob, not from the generated file. So each
     generated ancestor spec is now compared BYTE FOR BYTE with the committed blob, with
     only tooling.runnerSha256 swapped, at BOTH ends of the round (the base, which is what
     the generator edited, and the post head, which is what the round committed). */
  const swap = (text, sha) => text.replace(/("runnerSha256":\s*)"[a-f0-9]{64}"/, '$1"' + sha + '"');
  for (const id of ANCESTORS) {
    const f = 'rebuild/lanes/b/tooling/packages/' + id + '.json';
    const gen = made(f), atBase = M.blobBytes(REPO, R.base, f).toString('utf8'), atPost = real(f);
    fact(id + '.json is the blob at the base with ONLY runnerSha256 swapped', gen, swap(atBase, want));
    fact(id + '.json is the blob at the post head with the same swap', gen, swap(atPost, want));
    const g = JSON.parse(gen);
    internal(id + '.json re-pinned to the same runner', g.tooling.runnerSha256, want);
    /* Committed against committed: a property of the round, not of this generator. */
    const rr = JSON.parse(real('rebuild/lanes/b/tooling/packages/' + id + '.json'));
    selfCheck(id + '.json carries the one sha the committed package carries',
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
    if (NEEDLES_COMPARABLE) {
      const got = g[i] && g[i].needle;
      const ok = fact('child[' + i + '].needle', got, r[i].needle);
      NEEDLE_TABLE.push((ok ? '  same     ' : '  DIFFERS  ') + (r[i].name + '                              ').slice(0, 30) +
        ' committed ' + JSON.stringify(r[i].needle) + (ok ? '' : '  measured ' + JSON.stringify(got)));
    }
  }
  if (NEEDLES_COMPARABLE) {
    /* The 25-needle table, printed whole whether it agrees or not: a needle is a property
       of the tree at the sealed head, so this only ever runs from a worktree standing at
       82c98f8, and then the table IS the evidence. */
    const kids = JSON.parse(fs.readFileSync(path.join(OUT, 'needles.json'), 'utf8'));
    console.log('  THE 25 NEEDLES, measured here against the ones S8 committed:\n' + NEEDLE_TABLE.join('\n') +
      '\n    measured ' + kids.filter(k => k.measured).length + ' of ' + kids.length +
      '; not measured: ' + (kids.filter(k => !k.measured).map(k => k.name + ' (' + k.how + ')').join('; ') || 'none'));
  }
  if (!NEEDLES_COMPARABLE) {
    /* R1 N2. The all-25 mode was reported as "the fuller proof" and it CANNOT pass from
       an ordinary worktree: a needle is a `# pass N` printed by the tree that is CHECKED
       OUT, and this worktree is hundreds of commits past 82c98f8. So the comparison is
       gated on HEAD actually standing at the post head, the gate prints why it declined,
       and the name of the switch says what it requires. What is proved here instead is
       the MECHANISM, on the one child whose needle is a sentence rather than a tap count:
       children() requires that sentence to stand at the head of a line of the child's own
       stdout, and it does. */
    console.log('  needles: NOT compared against the round. ' + NEEDLES_WHY);
    const one = r.find(c => c.name === 'engine-files-differential');
    const ce = M.childEnv(REPO);
    /* The env is children()'s env, or the run says which part of it is missing (R1 B1). */
    if (!ce.exact) console.log('  needle env: NOT children()\'s env here - ' + ce.why);
    /* And the child is spawned WITHOUT this process's NODE_TEST_CONTEXT, for the reason
       `generate()` gives. This particular child is a plain script rather than a
       `node --test` run, so it printed its sentence either way - which is exactly why it
       was the ONE needle of 25 that came through before the defect was found. */
    const clean = Object.assign({}, ce.env);
    delete clean.NODE_TEST_CONTEXT;
    const run = M.runChild(REPO, one.argv, clean);
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
  /* WHICH LEDGER. Not HEAD: in the all-25 needle mode HEAD stands AT 82c98f8, which
     predates :525 to :527, so the line genuinely is not there and the check went red for
     the right reason in the wrong place. The ledger of record is the CHAIN BRANCH - the
     same ref the runner fixes as CHAIN_REF at b-package.cjs:189 - and this cell says which
     rev answered rather than assuming one. */
  const REVS = ['origin/rebuild/t2-client-core', 'refs/remotes/origin/rebuild/t2-client-core', 'HEAD'];
  let gate = null, gateRev = null;
  for (const rev of REVS) {
    const b = M.blobBytes(REPO, rev, 'rebuild/DECISIONS.md');
    if (!b) continue;
    const found = b.toString('utf8').split('\n').find(l => M.sha256Text(l) === realSpec.coverage.superseded.rulingLineSha256);
    if (found) { gate = found; gateRev = rev; break; }
  }
  console.log('  the GATE-SUPERSESSION line was found in the ledger at ' + (gateRev || 'NO REV TRIED'));
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
    '  cross-side facts      ' + TALLY.compared + '   (generated vs committed - this is the number that means reproduction)',
    '  identical             ' + TALLY.identical,
    '  internal consistency  ' + TALLY.internal + '   (generated vs generated: the cell reads its own spec, the spec pins the runner this run made; NOT counted above)',
    '  self-checks           ' + TALLY.selfChecks + '   (committed vs committed, a property of the round; NOT counted above)',
    '  needles               ' + (NEEDLES_COMPARABLE ? 'compared' : 'not compared: ' + NEEDLES_WHY),
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
  /* `hunks` explicitly: this control is about the mirror, it reads no needle, and in the
     all-25 mode letting it run 25 children again would double the cost of the one mode
     that is already the slow one. */
  const out = generate(['--child-root', 'rebuild/lanes/d/NOT-A-ROOT/', '--subst', 'packages/S7.json=packages/S7.json'], 'hunks');
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

test('REPLAY-12 - RED CONTROL: a wrong string INSIDE an assert expression is a difference, not prose', () => {
  /* R1 N1. The old rule blanked every string on the line and forgave any assert that
     carried a message, so a mutated data string inside the EXPRESSION was classified as
     narrative. The lines below are real: they are taken from the committed
     s8-supersede-second-gate cell at 82c98f8, by shape, so this control cannot drift away
     from the file it is about. */
  const cell = real('rebuild/m4/workout/test/s8-supersede-second-gate.test.cjs');
  const lines = C.codeLines(cell);
  const victim = lines.find(l => C.isAssertCall(l) && C.withoutMessage(l) !== null && /'[^']+'/.test(C.withoutMessage(l)));
  assert(victim, 'the committed cell must contain an assert with a string inside its expression AND a message');
  const head = C.withoutMessage(victim);
  const mutated = victim.replace(head, head.replace(/'([^']+)'/, "'MUTATED-$1'"));
  assert.notEqual(mutated, victim, 'the mutant must really differ');
  assert.equal(C.classifyLine(mutated, victim), 'different',
    'a mutated data string inside an assert expression must be a CODE difference:\n  ' + victim + '\n  ' + mutated);
  /* And the other half of the rule still holds: a differing MESSAGE, and only the
     message, is still prose - otherwise this control would have made the cell useless
     rather than honest. */
  const msgOnly = victim.replace(/,\s*(['"])((?:[^'"\\]|\\.)*)\1(\s*\)\s*;?)$/, ", $1a different message$1$3");
  assert.notEqual(msgOnly, victim, 'the message rewrite must really differ');
  assert.equal(C.classifyLine(msgOnly, victim), 'narrative', 'only the message moved: ' + msgOnly);
  assert.equal(C.classifyLine(victim, victim), 'same');
});

test('REPLAY-13 - the needle env is the env children() builds, and a reduced env records NOTHING', () => {
  /* R1 B1. children() does not hand its children the bare clock env: laws()
     (b-package.cjs:2085-2086) adds ENGINE_MAIN, ENGINE_OLD and EARNED_CLIENT_DIR and
     DELETES four variables that would otherwise arrive from the PM's own shell. This
     asserts all three halves of that, including the deletion - which is measured by
     poisoning this process's own env first. */
  const gen = require('../new-child.cjs');
  const POISON = 'sealgen-replay-poison';
  const saved = {};
  for (const k of M.CHILD_ENV_DELETED) { saved[k] = process.env[k]; process.env[k] = POISON; }
  let ce;
  try { ce = M.childEnv(REPO); } finally {
    for (const k of M.CHILD_ENV_DELETED) { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; }
  }
  /* These assert directly rather than through fact(): REPLAY-10 has already printed the
     verdict by the time this cell runs, so a fact() recorded here would never be read. */
  for (const [k, v] of Object.entries(M.CHILD_ENV_FIXED)) assert.equal(ce.env[k], v, 'child env sets ' + k);
  assert.equal(ce.env.EARNED_CLIENT_DIR, path.join(REPO, 'rebuild/client'), 'child env sets EARNED_CLIENT_DIR');
  for (const k of M.CHILD_ENV_DELETED) assert.equal(ce.env[k], undefined, 'child env DELETES ' + k + ' even when the shell carries it');
  assert.equal(!!ce.env.ENGINE_MAIN, ce.referenceOk, 'ENGINE_MAIN is set exactly when the reference build succeeded');
  assert.equal(!!ce.env.ENGINE_OLD, ce.referenceOk, 'ENGINE_OLD is set exactly when the reference build succeeded');
  assert.throws(() => M.runChild(REPO, ['--version']), /MEASURE-CHILD-ENV-REQUIRED/, 'runChild must refuse to default the env');
  /* THE TEST-RUNNER REFUSAL. This cell is itself a `node --test` child, so the refusal is
     not hypothetical here: it must fire, by name, every time this cell runs. It is what
     stops a needle being measured from inside a test runner, where a child prints nothing
     on stdout and still exits 0 - 24 of the 25 needles came back blank that way. */
  assert.equal(ce.inTestRunner, true, 'this cell runs under node --test, so childEnv must see it');
  assert.equal(ce.exact, false, 'and must refuse, whatever the reference build did');
  assert(/NODE_TEST_CONTEXT/.test(ce.why) && /v8 serializer/.test(ce.why), 'with the reason named: ' + ce.why);
  /* And the refusal itself: when the env is not children()'s env, measureChildren records
     no needle at all and says so once. It runs no child in that case, so this is cheap. */
  if (!ce.exact) {
    const todo = [];
    const kids = gen.measureChildren(REPO, { childDecls: [{ name: 'probe', argv: ['--test', 'nothing.test.cjs'], needle: '# pass 1' }] }, todo);
    assert(kids.every(k => k.measured === false && k.needle === gen.TODO_BLANK), 'no needle may be recorded under a reduced env');
    assert.equal(todo.length, 1, 'and the reason is named once in TODO');
    assert(/NOT MEASURED/.test(todo[0].what), 'the TODO entry must say so in its title: ' + todo[0].what);
  } else {
    console.log('  the reference build works here, so the reduced-env refusal was not exercised; set it up on a worktree with a broken node_modules to see it.');
  }
});

test('REPLAY-14 - RED CONTROL: the last string of a TWO-argument assert is an expected VALUE, never a message', () => {
  /* R2 M2. REPLAY-12 closed R1 N1 for a string inside the expression, but the rule still
     decided "the last string literal closing the call is the node:test MESSAGE" without
     asking how many arguments the call has. In `assert.equal(expr, 'VALUE')` that string
     IS the expected value, and a wrong value there was classified `narrative` and never
     failed the cell. The rule now asks the ARITY: `assert.equal` and its family need TWO
     preceding arguments before the last string can be a message; `assert(` needs one.
     First, the real committed line R2 named, by shape so this cannot drift from the file. */
  const cell = real('rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs');
  const lines = C.codeLines(cell);
  /* The victim is found with NO help from the new rule - it is the real committed line R2
     quoted, located by its own shape - so this assertion is about behaviour and goes red
     against the reviewed head rather than failing on a missing export. */
  const victim = lines.find(l => /^assert\.equal\(.*, 'IMPLEMENTED'\);$/.test(l));
  assert(victim, 'the committed F6/F7 cell must still carry the line R2 measured');
  const mutant = victim.replace(/'([^']*)'\s*\)\s*;?$/, m => m.replace("'", "'MUTATED-"));
  assert.notEqual(mutant, victim, 'the mutant must really differ: ' + victim);
  assert.equal(C.classifyLine(mutant, victim), 'different',
    'a mutated expected VALUE must be a CODE difference:\n  ' + victim + '\n  ' + mutant);
  const twoArg = lines.filter(l => C.isAssertCall(l) && C.withoutMessage(l) !== null && !C.isMessageArg(l));
  assert(twoArg.includes(victim), 'and the arity rule must be what says so');

  /* Then R2's own measurement, re-run over the committed blobs of every file compareFile
     compares, so the number is a standing fact of this cell and not a note in a review. */
  const FILES = ['rebuild/lanes/b/tooling/b-package.cjs']
    .concat(CELLS, ['rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs'], CHILD_SPEC_CELLS);
  /* THE RULE AS IT STOOD AT THE REVIEWED HEAD, three lines, so "what did the old rule do
     with these" is answered by measurement and not by memory. R2 reported 29 tolerated;
     the old rule never asked arity, so the honest number is every VALUE line. */
  const oldClassify = (a, b) => {
    if (a === b) return 'same';
    if (C.isTitleCall(a) && C.isTitleCall(b) && C.stripStrings(a) === C.stripStrings(b)) return 'narrative';
    const ha = C.withoutMessage(a), hb = C.withoutMessage(b);
    if (C.isAssertCall(a) && C.isAssertCall(b) && ha !== null && hb !== null && ha === hb) return 'narrative';
    return 'different';
  };
  let ending = 0, data = 0, tolerated = 0, toleratedOld = 0, messages = 0, messageStillProse = 0;
  for (const f of FILES) {
    const t = real(f);
    if (t === null) continue;
    for (const l of C.codeLines(t)) {
      if (!C.isAssertCall(l) || C.withoutMessage(l) === null) continue;
      ending += 1;
      const mut = l.replace(/'([^']*)'\s*\)\s*;?$/, m => m.replace("'", "'MUTATED-"))
                   .replace(/"([^"]*)"\s*\)\s*;?$/, m => m.replace('"', '"MUTATED-'));
      if (mut === l) continue;
      if (C.isMessageArg(l)) { messages += 1; if (C.classifyLine(mut, l) === 'narrative') messageStillProse += 1; }
      else {
        data += 1;
        if (C.classifyLine(mut, l) !== 'different') tolerated += 1;
        if (oldClassify(mut, l) !== 'different') toleratedOld += 1;
      }
    }
  }
  console.log('  arity rule over the committed blobs at ' + R.post + ':\n' +
    '    assert lines ending in a string literal        ' + ending + '\n' +
    '    of those, the last string is an expected VALUE ' + data + '\n' +
    '    mutated VALUE tolerated by the OLD rule        ' + toleratedOld + '   (R2 reported 29; the old rule never asked arity)\n' +
    '    mutated VALUE tolerated by THIS rule           ' + tolerated + '\n' +
    '    of those, the last string is a MESSAGE         ' + messages + '\n' +
    '    mutated MESSAGE still prose (the other half)   ' + messageStillProse);
  assert.equal(tolerated, 0, 'no mutated expected value may be tolerated as narrative');
  assert.equal(toleratedOld, data, 'the old rule tolerated every one of them, which is what this fix is about');
  assert.equal(messageStillProse, messages, 'and a message-only difference must still be prose, or the rule has gutted the cell');
  assert(ending >= 140, 'the measurement must be over the real corpus: ' + ending + ' assert lines');
});

test('REPLAY-16 - RED CONTROL: the tap needle is found in CRLF stdout, which is the only kind Windows produces', () => {
  /* R2 N7 asked for requirement (g) to run to completion once. It did, from a worktree
     standing at 82c98f8 with a whole node_modules, and it found this: 24 of the 25
     children ran green and 24 of the 25 needles came back BLANK. `tapPassNeedle` was
     /^# pass (\d+)$/m, and `$` in multiline mode matches before the \n with the \r still
     standing, so `# pass 26\r` never matched. The one needle that did come through was
     the engine-files differential's, because a sentence needle is matched by a prefix.
     Both line endings, and the needle returned must be the CR-free form the sealed
     packages carry and children() matches. */
  const body = ['TAP version 13', 'ok 1 - a', '1..1', '# tests 1', '# pass 26', '# fail 0'];
  for (const [nl, what] of [['\n', 'LF'], ['\r\n', 'CRLF']]) {
    const out = body.join(nl) + nl;
    assert.equal(M.tapPassNeedle(out), '# pass 26', 'the tap needle must be found in ' + what + ' stdout');
    assert(M.needleStandsAtLineStart(out, M.tapPassNeedle(out)), 'and it must satisfy children()\'s own predicate in ' + what);
  }
  assert.equal(M.tapPassNeedle('nothing here'), null, 'and a run with no tap summary still records nothing');
  /* The committed S8 needles are CR-free `# pass N` lines, which is what this returns. */
  const tapKids = realSpec.children.filter(c => /^# pass \d+$/.test(c.needle));
  assert(tapKids.length >= 20, 'the S8 package pins tap needles in this exact form: ' + tapKids.length);
});

test('REPLAY-15 - this cell removes the scratch folders it made', () => {
  /* R2 N2. Two `sealgen-replay-*` folders of 25 files per run, never removed, on a PC
     several lanes share. Only the folders THIS process created are removed - the list is
     the one mkdtempSync returned, not a glob over %TEMP% - so nothing another hand left
     behind is touched. It runs last because every cell above reads OUT. */
  const made = MADE.splice(0);
  for (const d of made) fs.rmSync(d, { recursive: true, force: true });
  for (const d of made) assert.equal(fs.existsSync(d), false, 'left behind: ' + d);
  console.log('  removed ' + made.length + ' scratch folder(s) this run created.');
});
