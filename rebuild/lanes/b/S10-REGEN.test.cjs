'use strict';
/* S10-REGEN's PATH BOUNDARY, on synthetic ports (Astra S10-INTEGRATION-REVIEW-L2 B5). The helper is
   compiled in memory with FAKE node:child_process and node:fs modules, so nothing here touches the
   repository: every git answer and every file is invented below, and every content read the helper
   attempts is recorded. The rows require that an out-of-scope, forbidden, linked or non-regular
   changed name is REFUSED BY NAME BEFORE ANY READ OF IT, and that before the refusal nothing but the
   fixed inputs was read. S10_REGEN_UNDER_TEST may name another copy of the helper (used for the
   red-first run against the pre-B5 helper), at ANY directory depth (D-S10I-16): REPO below is resolved
   ONCE, from the helper under test, by the same expression the helper uses for its own REPO, so the
   fake ports and the helper always agree on which repository-relative name an absolute path is. */
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const crypto = require('node:crypto');
const Module = require('node:module');
const fsReal = require('node:fs');

const HELPER = process.env.S10_REGEN_UNDER_TEST || path.join(__dirname, 'S10-REGEN.cjs');
const REPO = path.resolve(path.dirname(HELPER), '..', '..', '..');   // the helper's own REPO (its __dirname is dirname(HELPER))
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
  // The split source VIEW is a parent product pin that S10 carries, as the three real sourceBlobs.s9 paths are
  // (B5-L5: every path the helper looks up must be held by a reviewed inventory).
  put([P, HEAD], S9SPEC, JSON.stringify({ product: { [A]: { pre: null, post: sha('a0\n'), role: 'new' },
    [VIEW]: { pre: null, post: sha('view\n'), role: 'new' } }, children: [], brief: { file: null } }));
  disk[SPEC] = JSON.stringify({ parent: { options: [{ id: 'S9', artifact: 'rebuild/m4/spec/acceptance-s9-ui-pins.json',
    review: 'rebuild/m4/spec/review-s9-ui-pins.json' }] }, product: { [A]: { pre: sha('a0\n'), post: sha('a1\n'), role: 'edited' },
    [VIEW]: { pre: sha('view\n'), post: sha('view\n'), role: 'carried' } },
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

/* B5 RESIDUAL, L4 (Astra S10-INTEGRATION-REVIEW-L4): standard credential and key file names under the
   allowed roots. Every name is invented and the only content anywhere is MARKER, an invented JSON marker
   on the fake ports: no real credential or key file exists here or is opened. The three names the L4
   probe admitted (.netrc, _netrc, .ssh/id_ed25519) and two more shapes (.npmrc, a .pem under a keys
   directory) are fed through EVERY input source of the L4 matrix, plus the parent candidate execution
   pins, and each must be refused BY NAME before any content read of it. Then every clause of the
   admission rule is covered as a changed path. */
const MARKER = '{"synthetic":"invented marker, not a credential"}\n';
const ART = 'rebuild/m4/spec/acceptance-s9-ui-pins.json', REV = 'rebuild/m4/spec/review-s9-ui-pins.json';
const SEALED_READS = new Set([...FIXED, ART, REV]);
const everywhere = (w, name) => { for (const r of [P, HEAD]) w.at[r][name] = MARKER; w.disk[name] = MARKER; };
const editSpec = (w, fn) => { const s = JSON.parse(w.disk[SPEC]); fn(s); w.disk[SPEC] = JSON.stringify(s); w.at[HEAD][SPEC] = w.disk[SPEC]; };
const editS9 = (w, fn) => { for (const r of [P, HEAD]) { const s = JSON.parse(w.at[r][S9SPEC]); fn(s); w.at[r][S9SPEC] = JSON.stringify(s); } };
const editArt = (w, fn) => { const a = JSON.parse(w.at[P][ART]); fn(a); w.at[P][ART] = JSON.stringify(a); };
const L4_SOURCES = [   // [source, world with the name planted there only, reads allowed before the refusal or null]
  ['changed paths', (name) => { const w = world(); everywhere(w, name); w.changed.push(name); return w; }, FIXED],
  ['S10.product', (name) => { const w = world(); everywhere(w, name); editSpec(w, (s) => { s.product[name] = { pre: null, post: sha(MARKER), role: 'new' }; }); return w; }, FIXED],
  ['the parent candidate product', (name) => { const w = world(); everywhere(w, name); editS9(w, (s) => { s.product[name] = { pre: null, post: sha(MARKER), role: 'new' }; }); return w; }, FIXED],
  ['the parent candidate execution pins', (name) => { const w = world(); everywhere(w, name); editS9(w, (s) => { s.children = [{ argv: [name] }]; }); return w; }, FIXED],
  ['the sealed parent product', (name) => { const w = sealed(world(), 'ACCEPTED'); everywhere(w, name); editArt(w, (a) => { a.product[name] = sha(MARKER); }); return w; }, SEALED_READS],
  ['the sealed parent execution pins', (name) => { const w = sealed(world(), 'ACCEPTED'); everywhere(w, name); editArt(w, (a) => { a.executionPins[name] = sha(MARKER); }); return w; }, SEALED_READS],
  ['the parent artifact path', (name) => { const w = world(); everywhere(w, name); editSpec(w, (s) => { s.parent.options[0].artifact = name; }); return w; }, FIXED],
  ['the parent review path', (name) => { const w = world(); everywhere(w, name); editSpec(w, (s) => { s.parent.options[0].review = name; }); return w; }, FIXED],
  ['the D-SPLIT-PARENT split sources', (name) => { const w = world(); everywhere(w, name);   // validated after the product reads: only the name itself is checked
    const g = JSON.parse(w.disk[REGIONS]); g.witness.sourceBlobs.s9.synthetic = { path: name, oid: oid(MARKER) };
    w.disk[REGIONS] = JSON.stringify(g); w.at[HEAD][REGIONS] = w.disk[REGIONS]; return w; }, null],
];
const L4_NAMES = ['rebuild/m4/spec/.netrc', 'rebuild/m4/spec/_netrc', 'rebuild/m4/spec/.ssh/id_ed25519',
  'rebuild/m4/workout/.npmrc', 'rebuild/m4/workout/keys/deploy.pem'];
function refusedBeforeRead(r, name, why, before) {
  assert.equal(r.reads.includes(name), false, 'the helper READ ' + name + ' (content read reached) before refusing it');
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, 'not refused: ' + r.out);
  assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(name), 'not refused BY NAME: ' + r.out);
  assert.match(r.out, /not admitted for a content read/);
  assert.match(r.out, why);
  if (before) for (const f of r.reads) assert(before.has(f), 'a product read happened before the refusal: ' + f);
}
for (const name of L4_NAMES) {
  for (const [source, build, before] of L4_SOURCES) {
    test('S10-REGEN B5-L4 REFUSES ' + name + ' supplied through ' + source + ', BY NAME, before any content read of it', () => {
      refusedBeforeRead(run(build(name)), name, /dot-name|credential or key file name|key or secret container extension/, before);
    });
  }
}
const DOT = /a dot-name segment/, CRED = /a credential or key file name/, KEYX = /a key or secret container extension/, EXT = /is not one S10 or its S9 parent declares/;
const L4_CLAUSES = [
  ['rebuild/m4/spec/.aws/config', DOT], ['rebuild/m4/spec/.gnupg/pubring.kbx', DOT], ['rebuild/m4/workout/.gitconfig', DOT],
  ['rebuild/m4/spec/.pypirc', DOT], ['rebuild/m4/spec/.htpasswd', DOT], ['rebuild/m4/spec/.env', DOT],
  ['rebuild/m4/spec/.docker/config.json', DOT], ['rebuild/m3/w7-preview/.config/app.json', DOT], ['rebuild/m4/spec/.GIT/config', DOT],
  ['rebuild/m4/spec/netrc', CRED], ['rebuild/m4/spec/_NETRC', CRED], ['rebuild/m4/spec/known_hosts', CRED],
  ['rebuild/m4/spec/id_rsa', CRED], ['rebuild/m4/spec/id_dsa', CRED], ['rebuild/m4/spec/id_ecdsa', CRED],
  ['rebuild/m4/spec/ID_ED25519', CRED], ['rebuild/m4/spec/id_rsa.pub', CRED], ['rebuild/m4/spec/id_ed25519.pub', CRED],
  ['rebuild/m4/spec/id_ed25519_sk', CRED], ['rebuild/m4/spec/id_rsa/notes.json', CRED], ['rebuild/m4/spec/known_hosts.json', CRED],
  ['rebuild/m4/spec/signing.pem', KEYX], ['rebuild/m4/workout/deploy.key', KEYX], ['rebuild/m4/spec/cert.p12', KEYX],
  ['rebuild/m4/spec/cert.pfx', KEYX], ['rebuild/m4/spec/vault.kdbx', KEYX], ['rebuild/m4/spec/putty.ppk', KEYX],
  ['rebuild/m4/spec/release.asc', KEYX], ['rebuild/m4/spec/backup.gpg', KEYX], ['rebuild/m4/spec/android.jks', KEYX],
  ['rebuild/m4/spec/release.keystore', KEYX], ['rebuild/m4/spec/SIGNING.PEM', KEYX], ['rebuild/m4/spec/signing.pem.json', KEYX],
  ['rebuild/m4/spec/certs.p12/x.json', KEYX],
  ['rebuild/m4/spec/README', EXT], ['rebuild/m4/spec/dump.txt', EXT], ['rebuild/m4/spec/tool.py', EXT],
  ['rebuild/m4/spec/store.sqlite', EXT], ['rebuild/m4/spec/config.yaml', EXT], ['rebuild/m4/spec/photo.png', EXT],
  ['rebuild/m4/spec/archive.zip', EXT],
];
for (const [name, why] of L4_CLAUSES) {
  test('S10-REGEN B5-L4 admission rule REFUSES the changed name ' + name + ' BY NAME, before any content read of it', () => {
    refusedBeforeRead(run(L4_SOURCES[0][1](name)), name, why, FIXED);
  });
}
/* EXACT REVIEWED FILES (PM ruling on Round 9): a dot-name is admitted only as an exact-file SCOPE entry. */
test('S10-REGEN B5-L4 CONTROL: the exact reviewed .github/workflows/rebuild.yml is admitted and measured', () => {
  const YML = '.github/workflows/rebuild.yml';
  const w = world(); w.at[P][YML] = 'on: push\n'; w.at[HEAD][YML] = 'on: [push]\n'; w.disk[YML] = 'on: [push]\n'; w.changed.push(YML);
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.match(r.out, /\.github\/workflows\/rebuild\.yml: undeclared {2}=> {2}new/);
});
for (const name of ['rebuild/m4/spec/.github/workflows/rebuild.yml', 'rebuild/m4/workout/.github/x.json']) {
  test('S10-REGEN B5-L4 REFUSES ' + name + ' (a .github segment that is not an exact reviewed file) BY NAME, before any content read of it', () => {
    refusedBeforeRead(run(L4_SOURCES[0][1](name)), name, DOT, FIXED);
  });
}

/* B5 RESIDUAL, L5 (Astra S10-INTEGRATION-REVIEW-L5; Fable REVIEW-S10-INTEGRATION-l4 D-S10I-15): POSITIVE REVIEWED
   PROVENANCE. These names pass every name and extension rule (ordinary-looking credential containers), so no
   name rule refuses them; what refuses them is that NO reviewed inventory holds them. Through every source that
   is not itself a reviewed inventory (changed paths, the sealed parent product and execution pins, the parent
   artifact and review paths, the D-SPLIT-PARENT split sources) each must be refused BY NAME, before any content
   read of it. Every name is invented; the only content anywhere is MARKER. A name that S10.json or the parent
   S9.json itself declares (the S10.product, parent candidate product and candidate execution-pin sources) is a
   member BY THAT DECLARATION, so provenance cannot refuse it there and no row claims it does (the helper's LIMIT). */
const L5_NAMES = ['rebuild/m4/spec/service-account.json', 'rebuild/m4/spec/kubeconfig.yml', 'rebuild/m4/spec/id_rsa.backup.json',
  'rebuild/m4/spec/keys.json', 'rebuild/m4/spec/passwords.json', 'rebuild/m4/spec/private.json', 'rebuild/m4/spec/env.json',
  'rebuild/m4/spec/apikey.json', 'rebuild/m4/spec/wallet.json', 'rebuild/m4/spec/keystore/x.json'];
const DECLARING = new Set(['S10.product', 'the parent candidate product', 'the parent candidate execution pins']);
const NOT_REVIEWED = /not an exact member of a reviewed inventory/;
for (const name of L5_NAMES) {
  for (const [source, build, before] of L4_SOURCES.filter(([s]) => !DECLARING.has(s))) {
    test('S10-REGEN B5-L5 REFUSES ' + name + ' supplied through ' + source + ' (in no reviewed inventory), BY NAME, before any content read of it', () => {
      refusedBeforeRead(run(build(name)), name, NOT_REVIEWED, before);
    });
  }
}
test('S10-REGEN B5-L5: an UNDECLARED changed path with an ordinary name is refused BY NAME before any content read (declare it in S10.json first)', () => {
  const name = 'rebuild/m4/workout/b.cjs';
  refusedBeforeRead(run(L4_SOURCES[0][1](name)), name, NOT_REVIEWED, FIXED);
});
test('S10-REGEN B5-L5: S10.json naming a declared product file as the parent artifact is refused BY NAME, before any read of it', () => {
  const w = world(); editSpec(w, (s) => { s.parent.options[0].artifact = A; });
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.reads.includes(A), false, 'the helper READ ' + A + ' (content read reached) before refusing it');
  for (const f of r.reads) assert(FIXED.has(f), 'a product read happened before the refusal: ' + f);
  assert.equal(r.exitCode, 2, 'not refused: ' + r.out);
  assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(A), 'not refused BY NAME: ' + r.out);
  assert.match(r.out, /not admitted for a content read: not the reviewed S9 parent artifact or review/);
});
test('S10-REGEN B5-L5 CONTROL: a changed Markdown report outside rebuild/engine/, in no inventory, is neither read, declared nor refused', () => {
  const name = 'rebuild/m4/spec/NOTES.md';
  const w = world(); w.at[HEAD][name] = 'notes\n'; w.disk[name] = 'notes\n'; w.changed.push(name);
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.equal(r.reads.includes(name), false, 'the helper READ ' + name);
  assert.equal(r.out.includes(name), false, 'the report was declared or named: ' + r.out);
});
