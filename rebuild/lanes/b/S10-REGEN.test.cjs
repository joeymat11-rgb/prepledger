'use strict';
/* S10-REGEN's PATH BOUNDARY, on synthetic ports (Astra S10-INTEGRATION-REVIEW-L2 B5). The helper is
   compiled in memory with FAKE node:child_process and node:fs modules, so nothing here touches the
   repository: every git answer and every file is invented below, and every content read the helper
   attempts is recorded. The rows require that an out-of-scope, forbidden, linked or non-regular
   changed name is REFUSED BY NAME BEFORE ANY READ OF IT, and that before the refusal nothing but the
   fixed inputs was read. S10_REGEN_UNDER_TEST may name another copy of the helper (used for the
   red-first run against the pre-B5 helper). */
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const crypto = require('node:crypto');
const Module = require('node:module');
const fsReal = require('node:fs');

const HELPER = process.env.S10_REGEN_UNDER_TEST || path.join(__dirname, 'S10-REGEN.cjs');
const REPO = path.resolve(__dirname, '..', '..', '..');
const rel = (abs) => path.relative(REPO, abs).split(path.sep).join('/');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const oid = (s) => crypto.createHash('sha1').update(String(s)).digest('hex');
const P = 'a'.repeat(40), HEAD = 'b'.repeat(40);
const SPEC = 'rebuild/lanes/b/tooling/packages/S10.json', S9SPEC = 'rebuild/lanes/b/tooling/packages/S9.json';
const RUNNER = 'rebuild/lanes/b/tooling/b-package.cjs', REGIONS = 'rebuild/lanes/c/today-split-spike/regions.json';
const A = 'rebuild/m4/workout/a.cjs', VIEW = 'rebuild/m3/w7-preview/today/today-app.cjs';
const FIXED = new Set([SPEC, S9SPEC, RUNNER, REGIONS]);

function world(extra) {
  const at = { [P]: {}, [HEAD]: {} }, disk = {};
  const put = (revs, f, s) => { for (const r of revs) at[r][f] = s; };
  put([P], A, 'a0\n'); put([HEAD], A, 'a1\n'); disk[A] = 'a1\n';
  put([P, HEAD], RUNNER, 'runner\n'); disk[RUNNER] = 'runner\n';
  put([P, HEAD], VIEW, 'view\n'); disk[VIEW] = 'view\n';
  const regions = JSON.stringify({ witness: { sourceBlobs: { s9: { 'today-app.cjs': { path: VIEW, oid: oid('view\n') } } } } });
  put([HEAD], REGIONS, regions); disk[REGIONS] = regions;
  put([P, HEAD], S9SPEC, JSON.stringify({ product: { [A]: { pre: null, post: sha('a0\n'), role: 'new' } }, children: [], brief: { file: null } }));
  disk[SPEC] = JSON.stringify({ parent: { options: [{ id: 'S9', artifact: 'rebuild/m4/spec/acceptance-s9-ui-pins.json',
    review: 'rebuild/m4/spec/review-s9-ui-pins.json' }] }, product: { [A]: { pre: sha('a0\n'), post: sha('a1\n'), role: 'edited' } },
    notes: [], tooling: {} });
  put([HEAD], SPEC, disk[SPEC]);
  const w = { at, disk, changed: [A], modes: {}, links: new Set(), reads: [], ...extra };
  for (const [f, s] of Object.entries(w.addHead || {})) { at[HEAD][f] = s; w.disk[f] = s; }
  return w;
}
function fakes(w) {
  const byOid = new Map();
  for (const r of [P, HEAD]) for (const [f, s] of Object.entries(w.at[r])) byOid.set(oid(s), [f, s]);
  const lsLine = (r, f) => (Object.hasOwn(w.at[r], f) ? (w.modes[f] || '100644') + ' blob ' + oid(w.at[r][f]) + '\t' + f : null);
  const git = (args) => {
    const a = args.slice();
    if (a[0] === 'rev-parse' && a[1] === '--verify') return P + '\n';
    if (a[0] === 'rev-parse' && a[1] === 'HEAD') return HEAD + '\n';
    if (a[0] === 'rev-parse') { const [r, f] = a[1].split(':'); const e = w.at[r === 'HEAD' ? HEAD : r][f]; if (e === undefined) throw new Error('no such path'); return oid(e) + '\n'; }
    if (a[0] === 'merge-base') return '';
    if (a[0] === 'diff') return w.changed.join('\n') + '\n';
    if (a[0] === 'status') return '';
    if (a[0] === 'ls-tree') {
      const i = a.indexOf('--'); const r = a.filter((x) => x !== '--full-tree')[1];
      const rev = r === 'HEAD' ? HEAD : r;
      return a.slice(i + 1).map((f) => lsLine(rev, f)).filter(Boolean).join('\n') + '\n';
    }
    if (a[0] === 'cat-file') { const hit = byOid.get(a[2]); if (!hit) throw new Error('no object'); w.reads.push(hit[0]); return hit[1]; }
    if (a[0] === 'show') { const [r, f] = a[1].split(':'); w.reads.push(f); const e = w.at[r === 'HEAD' ? HEAD : r][f]; if (e === undefined) throw new Error('no such path'); return e; }
    throw new Error('unexpected git ' + a.join(' '));
  };
  const cp = { execFileSync: (cmd, args) => { assert.equal(cmd, 'git'); return Buffer.from(git(args)); } };
  const exists = (f) => Object.hasOwn(w.disk, f) || Object.keys(w.disk).some((k) => k.startsWith(f + '/'));
  const fs = {
    readFileSync: (abs) => { const f = rel(String(abs)); w.reads.push(f); if (!Object.hasOwn(w.disk, f)) { const e = new Error('ENOENT ' + f); e.code = 'ENOENT'; throw e; } return Buffer.from(w.disk[f]); },
    existsSync: (abs) => exists(rel(String(abs))),
    lstatSync: (abs) => { const f = rel(String(abs)); if (!exists(f) && !w.links.has(f)) { const e = new Error('ENOENT'); e.code = 'ENOENT'; throw e; } return { isSymbolicLink: () => w.links.has(f) }; },
    writeFileSync: () => { throw new Error('a dry run wrote a file'); },
  };
  return { cp, fs };
}
function run(w, argv = ['--parent', 'fake']) {
  const { cp, fs } = fakes(w);
  const m = new Module(HELPER, module);
  m.filename = HELPER; m.paths = [];
  m.require = (id) => ({ 'node:fs': fs, 'node:child_process': cp, 'node:path': path, 'node:crypto': crypto }[id]
    || (() => { throw new Error('the helper required ' + id); })());
  const saved = { argv: process.argv, exit: process.exit, log: console.log, error: console.error };
  const out = [];
  process.argv = [process.execPath, HELPER, ...argv];
  process.exit = (code) => { const e = new Error('exit'); e.exitCode = code; throw e; };
  console.log = (...x) => out.push(x.join(' ')); console.error = (...x) => out.push(x.join(' '));
  let exitCode = 0, error = null;
  try { m._compile(fsReal.readFileSync(HELPER, 'utf8'), HELPER); }
  catch (e) { if (e && typeof e.exitCode === 'number') exitCode = e.exitCode; else error = e; }
  finally { Object.assign(process, { argv: saved.argv, exit: saved.exit }); console.log = saved.log; console.error = saved.error; }
  return { exitCode, error, out: out.join('\n'), reads: w.reads.slice() };
}

test('S10-REGEN CONTROL: an in-scope change is measured, and only allowlisted paths are read', () => {
  const r = run(world());
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.match(r.out, /DRY RUN: nothing written/);
  for (const f of r.reads) assert(FIXED.has(f) || f === A || f === VIEW, 'read outside the declared set: ' + f);
});

const refusals = [
  ['an out-of-scope changed name', (w) => { w.changed.push('rebuild/secret/other.json'); w.at[HEAD]['rebuild/secret/other.json'] = 'x'; w.disk['rebuild/secret/other.json'] = 'x'; }, 'rebuild/secret/other.json', /outside the S10 product scope/],
  ['a forbidden private path', (w) => { w.changed.push('rebuild/conform/private/live.json'); w.at[HEAD]['rebuild/conform/private/live.json'] = 'x'; }, 'rebuild/conform/private/live.json', /forbidden set/],
  ['a forbidden soak name inside a root', (w) => { w.changed.push('rebuild/m4/spec/soak-run.json'); w.at[HEAD]['rebuild/m4/spec/soak-run.json'] = 'x'; w.disk['rebuild/m4/spec/soak-run.json'] = 'x'; }, 'rebuild/m4/spec/soak-run.json', /forbidden set/],
  ['a traversal name', (w) => { w.changed.push('rebuild/m4/workout/../../../outside.json'); }, 'rebuild/m4/workout/../../../outside.json', /plain repository-relative/],
  ['a symlink on disk', (w) => { const f = 'rebuild/m4/workout/link.cjs'; w.changed.push(f); w.at[HEAD][f] = 'l'; w.disk[f] = 'l'; w.links.add(f); }, 'rebuild/m4/workout/link.cjs', /symlink or junction/],
  ['a junction above the file', (w) => { const f = 'rebuild/m4/workout/j/x.cjs'; w.changed.push(f); w.at[HEAD][f] = 'j'; w.disk[f] = 'j'; w.links.add('rebuild/m4/workout/j'); }, 'rebuild/m4/workout/j/x.cjs', /junction on disk at rebuild\/m4\/workout\/j/],
  ['a Git symlink entry', (w) => { const f = 'rebuild/m4/workout/glink.cjs'; w.changed.push(f); w.at[HEAD][f] = 'target'; w.disk[f] = 'target'; w.modes[f] = '120000'; }, 'rebuild/m4/workout/glink.cjs', /not a regular file in Git/],
];
for (const [label, plant, name, why] of refusals) {
  test('S10-REGEN REFUSES ' + label + ' BY NAME, BEFORE ANY READ OF IT', () => {
    const w = world(); plant(w);
    const r = run(w);
    assert.equal(r.error, null, String(r.error && r.error.stack));
    assert.equal(r.reads.includes(name), false, 'the helper READ ' + name + ' before refusing it');
    for (const f of r.reads) assert(FIXED.has(f), 'a product read happened before the refusal: ' + f);
    assert.equal(r.exitCode, 2, 'not refused: ' + r.out);
    assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(name), 'not refused BY NAME: ' + r.out);
    assert.match(r.out, why);
  });
}

/* D-REGEN-INPUT (Astra L2): the helper's input contract at a SEALED parent, on the same ports. */
function sealed(w, reviewStatus) {
  const ART = 'rebuild/m4/spec/acceptance-s9-ui-pins.json', REV = 'rebuild/m4/spec/review-s9-ui-pins.json';
  const BUILD = 'rebuild/m3/w7-preview/today/build.mjs';
  w.at[P][ART] = JSON.stringify({ product: { [A]: sha('a0\n') }, executionPins: {}, released: { [BUILD]: { role: 'released' } } });
  w.at[P][REV] = JSON.stringify({ version: 1, status: reviewStatus, receipt: null });
  for (const r of [P, HEAD]) w.at[r][BUILD] = 'build\n';
  w.disk[BUILD] = 'build\n';
  const spec = JSON.parse(w.disk[SPEC]);
  spec.product[BUILD] = { pre: sha('build\n'), post: sha('build\n'), role: 'carried' };
  w.disk[SPEC] = JSON.stringify(spec); w.at[HEAD][SPEC] = w.disk[SPEC];
  return w;
}
test('S10-REGEN D-REGEN-INPUT: --write refuses a parent whose review envelope is not ACCEPTED', () => {
  const r = run(sealed(world(), 'PENDING'), ['--parent', 'fake', '--write', '--receipt-line', '1']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.match(r.out, /is not an ACCEPTED envelope/);
});
test('S10-REGEN D-REGEN-INPUT: a parent-released path leaves the WHOLE declared union, even when the draft carries it', () => {
  const r = run(sealed(world(), 'ACCEPTED'));
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.match(r.out, /dropped from the declared union: rebuild\/m3\/w7-preview\/today\/build\.mjs/);
  assert.match(r.out, /rebuild\/m3\/w7-preview\/today\/build\.mjs: dropped \(released by the parent\)/);
  assert.equal(/build\.mjs: .*=>  new/.test(r.out), false, 'the released path became new');
});


/* D-S10I-11 (REVIEW-S10-INTEGRATION-l3): the two --write refusals of D-S10I-10, as rows. */
test('S10-REGEN D-S10I-11: --write without --receipt-line is refused BY NAME, before any read', () => {
  const r = run(sealed(world(), 'ACCEPTED'), ['--parent', 'fake', '--write']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.match(r.out, /--write needs --receipt-line N/);
  assert.deepEqual(r.reads, [], 'the helper read before refusing a --write with no receipt line');
});
test('S10-REGEN D-S10I-11: --write refuses while a carried note still cites the S9 candidate, and writes nothing', () => {
  const w = sealed(world(), 'ACCEPTED');
  const spec = JSON.parse(w.disk[SPEC]);
  spec.notes = ['PROPOSED DRAFT composed over the S9 candidate 6dc2596, not a spec of record.'];
  w.disk[SPEC] = JSON.stringify(spec); w.at[HEAD][SPEC] = w.disk[SPEC];
  const r = run(w, ['--parent', 'fake', '--write', '--receipt-line', '1']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.match(r.out, /STALE NOTE .*\[0\] PROPOSED DRAFT/);
  assert.match(r.out, /carried note\(s\) still cite the S9 candidate/);
});

/* B5 RESIDUAL (Astra S10-INTEGRATION-REVIEW-L3): the thirteen spellings its matrix ADMITTED, each a
   newly tracked changed input with a regular Git entry and a file on the fake disk, each required to be
   refused BY NAME before any read of it; then the same forbidden and auth shapes through every other
   input source. All on the synthetic ports above. */
const ADMITTED = [
  ['upper-case LEDGER directory', 'rebuild/m4/spec/LEDGER/synthetic.json', /forbidden set/],
  ['mixed-case Ledger directory', 'rebuild/m4/spec/Ledger/synthetic.json', /forbidden set/],
  ['upper-case SRC directory', 'rebuild/m4/workout/SRC/app.js', /forbidden set/],
  ['ledger directory with a trailing dot', 'rebuild/m4/spec/ledger./synthetic.json', /ending in a dot or a space/],
  ['ledger directory with a trailing space', 'rebuild/m4/spec/ledger /synthetic.json', /ending in a dot or a space/],
  ['upper-case protected basename', 'rebuild/engine/SEED.cjs', /alternate spelling of a protected engine file/],
  ['mixed-case protected basename', 'rebuild/engine/Merge.cjs', /alternate spelling of a protected engine file/],
  ['protected basename with a trailing dot', 'rebuild/engine/seed.cjs.', /ending in a dot or a space/],
  ['protected basename with a trailing space', 'rebuild/engine/index.cjs ', /ending in a dot or a space/],
  ['protected 8.3 short name', 'rebuild/engine/ORACLE~1.CJS', /8\.3 short-name/],
  ['auth.json under an allowed root', 'rebuild/m4/spec/auth.json', /auth-shaped/],
  ['.credentials under an allowed root', 'rebuild/m4/spec/.credentials', /auth-shaped/],
  ['an alternate data stream', 'rebuild/m4/workout/a.cjs:secret', /alternate-data-stream/],
];
for (const [label, name, why] of ADMITTED) {
  test('S10-REGEN B5 REFUSES ' + label + ' BY NAME, BEFORE ANY READ OF IT', () => {
    const w = world(); w.changed.push(name); w.at[HEAD][name] = 'synthetic\n'; w.disk[name] = 'synthetic\n';
    const r = run(w);
    assert.equal(r.error, null, String(r.error && r.error.stack));
    assert.equal(r.reads.includes(name), false, 'the helper READ ' + name + ' before refusing it');
    for (const f of r.reads) assert(FIXED.has(f), 'a product read happened before the refusal: ' + f);
    assert.equal(r.exitCode, 2, 'not refused: ' + r.out);
    assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(name), 'not refused BY NAME: ' + r.out);
    assert.match(r.out, why);
  });
}
const SOURCES = {
  'S10.product': (w, name) => { const s = JSON.parse(w.disk[SPEC]); s.product[name] = { pre: null, post: sha('synthetic\n'), role: 'new' }; w.disk[SPEC] = JSON.stringify(s); w.at[HEAD][SPEC] = w.disk[SPEC]; },
  'the parent product map': (w, name) => { const s = JSON.parse(w.at[P][S9SPEC]); s.product[name] = { pre: null, post: sha('synthetic\n'), role: 'new' }; w.at[P][S9SPEC] = JSON.stringify(s); w.at[P][name] = 'synthetic\n'; },
  'the parent artifact path': (w, name) => { const s = JSON.parse(w.disk[SPEC]); s.parent.options[0].artifact = name; w.disk[SPEC] = JSON.stringify(s); w.at[HEAD][SPEC] = w.disk[SPEC]; w.at[P][name] = '{}'; },
};
for (const [source, plant] of Object.entries(SOURCES)) {
  for (const name of ['rebuild/m4/spec/LEDGER/synthetic.json', 'rebuild/m4/spec/auth.json']) {
    test('S10-REGEN B5 REFUSES ' + name + ' supplied through ' + source + ', before any read of it', () => {
      const w = world(); w.at[HEAD][name] = 'synthetic\n'; w.disk[name] = 'synthetic\n'; plant(w, name);
      const r = run(w);
      assert.equal(r.error, null, String(r.error && r.error.stack));
      assert.equal(r.reads.includes(name), false, 'the helper READ ' + name + ' before refusing it');
      assert.equal(r.exitCode, 2, 'not refused: ' + r.out);
      assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(name), 'not refused BY NAME: ' + r.out);
    });
  }
}
