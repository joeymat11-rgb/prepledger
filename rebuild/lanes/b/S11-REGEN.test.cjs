'use strict';
/* S11-REGEN's PATH BOUNDARY and its S11 deltas, on synthetic ports. The port of
   rebuild/lanes/b/S10-REGEN.test.cjs (fec4c039; Astra S10-INTEGRATION-REVIEW-L2..L5 B5, D-REGEN-INPUT,
   D-S10I-11, DECISIONS:812). The helper is compiled in memory with FAKE node:child_process and node:fs
   modules, so nothing here touches the repository: every git answer and every file is invented below,
   and every content read the helper attempts is recorded. The rows require that an out-of-scope,
   forbidden, linked or non-regular name is REFUSED BY NAME BEFORE ANY READ OF IT, and that before the
   refusal nothing but the fixed inputs was read. S11_REGEN_UNDER_TEST may name another copy of the
   helper (a mutant, or a red-first copy), at ANY directory depth: REPO below is resolved ONCE, from the
   helper under test, by the same expression the helper uses for its own REPO.
   Every ported row keeps its meaning with S11's names (S11.json, the parent S10.json, the S10 artifact
   slug s10-today-split). S10's D-SPLIT-PARENT source row is not ported: the check it fed is S10's own.
   Rows NEW in S11 carry "S11" in their name: the FC06 exact SCOPE file, the candidate-parent released
   pair, the PENDING census, a successful --write, and the protected five by object id. */
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const crypto = require('node:crypto');
const Module = require('node:module');
const fsReal = require('node:fs');

const HELPER = process.env.S11_REGEN_UNDER_TEST || path.join(__dirname, 'S11-REGEN.cjs');
const REPO = path.resolve(path.dirname(HELPER), '..', '..', '..');   // the helper's own REPO (its __dirname is dirname(HELPER))
const rel = (abs) => path.relative(REPO, abs).split(path.sep).join('/');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const oid = (s) => crypto.createHash('sha1').update(String(s)).digest('hex');
const P = 'a'.repeat(40), HEAD = 'b'.repeat(40);
const SPEC = 'rebuild/lanes/b/tooling/packages/S11.json', S10SPEC = 'rebuild/lanes/b/tooling/packages/S10.json';
const RUNNER = 'rebuild/lanes/b/tooling/b-package.cjs';
const A = 'rebuild/m4/workout/a.cjs', VIEW = 'rebuild/m3/w7-preview/today/today-entry.mjs';
const ART = 'rebuild/m4/spec/acceptance-s10-today-split.json', REV = 'rebuild/m4/spec/review-s10-today-split.json';
const GYMAPP = 'rebuild/m3/w7-preview/today/gym-app.mjs';
const FIXED = new Set([SPEC, S10SPEC, RUNNER]);
const SEALED_READS = new Set([...FIXED, ART, REV]);

function world(extra) {
  const at = { [P]: {}, [HEAD]: {} }, disk = {};
  const put = (revs, f, s) => { for (const r of revs) at[r][f] = s; };
  put([P], A, 'a0\n'); put([HEAD], A, 'a1\n'); disk[A] = 'a1\n';
  put([P, HEAD], RUNNER, 'runner\n'); disk[RUNNER] = 'runner\n';
  put([P, HEAD], VIEW, 'view\n'); disk[VIEW] = 'view\n';
  // VIEW is a parent product pin that S11 carries, as every S10 product key is carried or edited at S11.
  put([P, HEAD], S10SPEC, JSON.stringify({ product: { [A]: { pre: null, post: sha('a0\n'), role: 'new' },
    [VIEW]: { pre: null, post: sha('view\n'), role: 'new' } }, children: [], brief: { file: null } }));
  disk[SPEC] = JSON.stringify({ parent: { options: [{ id: 'S10', artifact: ART, review: REV }] },
    product: { [A]: { pre: sha('a0\n'), post: sha('a1\n'), role: 'edited' }, [VIEW]: { pre: sha('view\n'), post: sha('view\n'), role: 'carried' } },
    notes: [], tooling: {} });
  put([HEAD], SPEC, disk[SPEC]);
  const w = { at, disk, changed: [A], modes: {}, links: new Set(), reads: [], writes: [], allowWrite: false, ...extra };
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
    writeFileSync: (abs, data) => { if (!w.allowWrite) throw new Error('a dry run wrote a file'); const f = rel(String(abs)); w.writes.push(f); w.disk[f] = String(data); },
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

test('S11-REGEN CONTROL: an in-scope change is measured, and only allowlisted paths are read', () => {
  const r = run(world());
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.match(r.out, /DRY RUN: nothing written/);
  for (const f of r.reads) assert(FIXED.has(f) || f === A || f === VIEW, 'read outside the declared set: ' + f);
});

const refusals = [
  ['an out-of-scope changed name', (w) => { w.changed.push('rebuild/secret/other.json'); w.at[HEAD]['rebuild/secret/other.json'] = 'x'; w.disk['rebuild/secret/other.json'] = 'x'; }, 'rebuild/secret/other.json', /outside the S11 product scope/],
  ['a forbidden private path', (w) => { w.changed.push('rebuild/conform/private/live.json'); w.at[HEAD]['rebuild/conform/private/live.json'] = 'x'; }, 'rebuild/conform/private/live.json', /forbidden set/],
  ['a forbidden soak name inside a root', (w) => { w.changed.push('rebuild/m4/spec/soak-run.json'); w.at[HEAD]['rebuild/m4/spec/soak-run.json'] = 'x'; w.disk['rebuild/m4/spec/soak-run.json'] = 'x'; }, 'rebuild/m4/spec/soak-run.json', /forbidden set/],
  ['a traversal name', (w) => { w.changed.push('rebuild/m4/workout/../../../outside.json'); }, 'rebuild/m4/workout/../../../outside.json', /plain repository-relative/],
  ['a symlink on disk', (w) => { const f = 'rebuild/m4/workout/link.cjs'; w.changed.push(f); w.at[HEAD][f] = 'l'; w.disk[f] = 'l'; w.links.add(f); }, 'rebuild/m4/workout/link.cjs', /symlink or junction/],
  ['a junction above the file', (w) => { const f = 'rebuild/m4/workout/j/x.cjs'; w.changed.push(f); w.at[HEAD][f] = 'j'; w.disk[f] = 'j'; w.links.add('rebuild/m4/workout/j'); }, 'rebuild/m4/workout/j/x.cjs', /junction on disk at rebuild\/m4\/workout\/j/],
  ['a Git symlink entry', (w) => { const f = 'rebuild/m4/workout/glink.cjs'; w.changed.push(f); w.at[HEAD][f] = 'target'; w.disk[f] = 'target'; w.modes[f] = '120000'; }, 'rebuild/m4/workout/glink.cjs', /not a regular file in Git/],
];
for (const [label, plant, name, why] of refusals) {
  test('S11-REGEN REFUSES ' + label + ' BY NAME, BEFORE ANY READ OF IT', () => {
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

/* D-REGEN-INPUT: the helper's input contract at a SEALED parent, on the same ports. The sealed S10
   artifact releases gym-app.mjs (S10's own released pair is today-app.cjs and gym-app.mjs). */
function sealed(w, reviewStatus) {
  w.at[P][ART] = JSON.stringify({ product: { [A]: sha('a0\n') }, executionPins: {}, released: { [GYMAPP]: { role: 'released' } } });
  w.at[P][REV] = JSON.stringify({ version: 1, status: reviewStatus, receipt: null });
  for (const r of [P, HEAD]) w.at[r][GYMAPP] = 'gym\n';
  w.disk[GYMAPP] = 'gym\n';
  const spec = JSON.parse(w.disk[SPEC]);
  spec.product[GYMAPP] = { pre: sha('gym\n'), post: sha('gym\n'), role: 'carried' };
  w.disk[SPEC] = JSON.stringify(spec); w.at[HEAD][SPEC] = w.disk[SPEC];
  return w;
}
test('S11-REGEN D-REGEN-INPUT: --write refuses a parent whose review envelope is not ACCEPTED', () => {
  const r = run(sealed(world(), 'PENDING'), ['--parent', 'fake', '--write', '--receipt-line', '1']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.match(r.out, /is not an ACCEPTED envelope/);
});
test('S11-REGEN D-REGEN-INPUT: a parent-released path leaves the WHOLE declared union, even when the draft carries it', () => {
  const r = run(sealed(world(), 'ACCEPTED'));
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.match(r.out, /dropped from the declared union: rebuild\/m3\/w7-preview\/today\/gym-app\.mjs/);
  assert.match(r.out, /rebuild\/m3\/w7-preview\/today\/gym-app\.mjs: dropped \(released by the parent\)/);
  assert.equal(/gym-app\.mjs: .*=>  new/.test(r.out), false, 'the released path became new');
});

/* D-S10I-11, ported: the two --write refusals, as rows (the stale note now cites the S10 candidate). */
test('S11-REGEN D-S10I-11: --write without --receipt-line is refused BY NAME, before any read', () => {
  const r = run(sealed(world(), 'ACCEPTED'), ['--parent', 'fake', '--write']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.match(r.out, /--write needs --receipt-line N/);
  assert.deepEqual(r.reads, [], 'the helper read before refusing a --write with no receipt line');
});
test('S11-REGEN D-S10I-11: --write refuses while a carried note still cites the S10 candidate, and writes nothing', () => {
  const w = sealed(world(), 'ACCEPTED');
  const spec = JSON.parse(w.disk[SPEC]);
  spec.notes = ['PROPOSED DRAFT composed over the S10 candidate 9849bc7, not a spec of record.'];
  w.disk[SPEC] = JSON.stringify(spec); w.at[HEAD][SPEC] = w.disk[SPEC];
  const r = run(w, ['--parent', 'fake', '--write', '--receipt-line', '1']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.match(r.out, /STALE NOTE .*\[0\] PROPOSED DRAFT/);
  assert.match(r.out, /carried note\(s\) still cite the S10 candidate/);
});

/* B5 RESIDUAL (Astra S10-INTEGRATION-REVIEW-L3), ported: the thirteen spellings its matrix ADMITTED, each a
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
  test('S11-REGEN B5 REFUSES ' + label + ' BY NAME, BEFORE ANY READ OF IT', () => {
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
  'S11.product': (w, name) => { const s = JSON.parse(w.disk[SPEC]); s.product[name] = { pre: null, post: sha('synthetic\n'), role: 'new' }; w.disk[SPEC] = JSON.stringify(s); w.at[HEAD][SPEC] = w.disk[SPEC]; },
  'the parent product map': (w, name) => { const s = JSON.parse(w.at[P][S10SPEC]); s.product[name] = { pre: null, post: sha('synthetic\n'), role: 'new' }; w.at[P][S10SPEC] = JSON.stringify(s); w.at[P][name] = 'synthetic\n'; },
  'the parent artifact path': (w, name) => { const s = JSON.parse(w.disk[SPEC]); s.parent.options[0].artifact = name; w.disk[SPEC] = JSON.stringify(s); w.at[HEAD][SPEC] = w.disk[SPEC]; w.at[P][name] = '{}'; },
};
for (const [source, plant] of Object.entries(SOURCES)) {
  for (const name of ['rebuild/m4/spec/LEDGER/synthetic.json', 'rebuild/m4/spec/auth.json']) {
    test('S11-REGEN B5 REFUSES ' + name + ' supplied through ' + source + ', before any read of it', () => {
      const w = world(); w.at[HEAD][name] = 'synthetic\n'; w.disk[name] = 'synthetic\n'; plant(w, name);
      const r = run(w);
      assert.equal(r.error, null, String(r.error && r.error.stack));
      assert.equal(r.reads.includes(name), false, 'the helper READ ' + name + ' before refusing it');
      assert.equal(r.exitCode, 2, 'not refused: ' + r.out);
      assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(name), 'not refused BY NAME: ' + r.out);
    });
  }
}

/* B5 RESIDUAL, L4 (Astra S10-INTEGRATION-REVIEW-L4), ported: standard credential and key file names under
   the allowed roots. Every name is invented and the only content anywhere is MARKER, an invented JSON
   marker on the fake ports: no real credential or key file exists here or is opened. Each is fed through
   EVERY input source (S10's D-SPLIT-PARENT source excepted, see the header) and must be refused BY NAME
   before any content read of it. Then every clause of the admission rule is covered as a changed path. */
const MARKER = '{"synthetic":"invented marker, not a credential"}\n';
const everywhere = (w, name) => { for (const r of [P, HEAD]) w.at[r][name] = MARKER; w.disk[name] = MARKER; };
const editSpec = (w, fn) => { const s = JSON.parse(w.disk[SPEC]); fn(s); w.disk[SPEC] = JSON.stringify(s); w.at[HEAD][SPEC] = w.disk[SPEC]; };
const editS10 = (w, fn) => { for (const r of [P, HEAD]) { const s = JSON.parse(w.at[r][S10SPEC]); fn(s); w.at[r][S10SPEC] = JSON.stringify(s); } };
const editArt = (w, fn) => { const a = JSON.parse(w.at[P][ART]); fn(a); w.at[P][ART] = JSON.stringify(a); };
const L4_SOURCES = [   // [source, world with the name planted there only, reads allowed before the refusal]
  ['changed paths', (name) => { const w = world(); everywhere(w, name); w.changed.push(name); return w; }, FIXED],
  ['S11.product', (name) => { const w = world(); everywhere(w, name); editSpec(w, (s) => { s.product[name] = { pre: null, post: sha(MARKER), role: 'new' }; }); return w; }, FIXED],
  ['the parent candidate product', (name) => { const w = world(); everywhere(w, name); editS10(w, (s) => { s.product[name] = { pre: null, post: sha(MARKER), role: 'new' }; }); return w; }, FIXED],
  ['the parent candidate execution pins', (name) => { const w = world(); everywhere(w, name); editS10(w, (s) => { s.children = [{ argv: [name] }]; }); return w; }, FIXED],
  ['the sealed parent product', (name) => { const w = sealed(world(), 'ACCEPTED'); everywhere(w, name); editArt(w, (a) => { a.product[name] = sha(MARKER); }); return w; }, SEALED_READS],
  ['the sealed parent execution pins', (name) => { const w = sealed(world(), 'ACCEPTED'); everywhere(w, name); editArt(w, (a) => { a.executionPins[name] = sha(MARKER); }); return w; }, SEALED_READS],
  ['the parent artifact path', (name) => { const w = world(); everywhere(w, name); editSpec(w, (s) => { s.parent.options[0].artifact = name; }); return w; }, FIXED],
  ['the parent review path', (name) => { const w = world(); everywhere(w, name); editSpec(w, (s) => { s.parent.options[0].review = name; }); return w; }, FIXED],
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
    test('S11-REGEN B5-L4 REFUSES ' + name + ' supplied through ' + source + ', BY NAME, before any content read of it', () => {
      refusedBeforeRead(run(build(name)), name, /dot-name|credential or key file name|key or secret container extension/, before);
    });
  }
}
const DOT = /a dot-name segment/, CRED = /a credential or key file name/, KEYX = /a key or secret container extension/, EXT = /is not one S11 or its S10 parent declares/;
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
  test('S11-REGEN B5-L4 admission rule REFUSES the changed name ' + name + ' BY NAME, before any content read of it', () => {
    refusedBeforeRead(run(L4_SOURCES[0][1](name)), name, why, FIXED);
  });
}
/* EXACT REVIEWED FILES: a dot-name is admitted only as an exact-file SCOPE entry. */
test('S11-REGEN B5-L4 CONTROL: the exact reviewed .github/workflows/rebuild.yml is admitted and measured', () => {
  const YML = '.github/workflows/rebuild.yml';
  const w = world(); w.at[P][YML] = 'on: push\n'; w.at[HEAD][YML] = 'on: [push]\n'; w.disk[YML] = 'on: [push]\n'; w.changed.push(YML);
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.match(r.out, /\.github\/workflows\/rebuild\.yml: undeclared {2}=> {2}new/);
});
for (const name of ['rebuild/m4/spec/.github/workflows/rebuild.yml', 'rebuild/m4/workout/.github/x.json']) {
  test('S11-REGEN B5-L4 REFUSES ' + name + ' (a .github segment that is not an exact reviewed file) BY NAME, before any content read of it', () => {
    refusedBeforeRead(run(L4_SOURCES[0][1](name)), name, DOT, FIXED);
  });
}

/* B5 RESIDUAL, L5 (Astra S10-INTEGRATION-REVIEW-L5), ported: POSITIVE REVIEWED PROVENANCE. These names pass
   every name and extension rule, so what refuses them is that NO reviewed inventory holds them. Through every
   source that is not itself a reviewed inventory each must be refused BY NAME, before any content read of it.
   A name that S11.json or the parent S10.json itself declares is a member BY THAT DECLARATION, so provenance
   cannot refuse it there and no row claims it does (the helper's LIMIT). */
const L5_NAMES = ['rebuild/m4/spec/service-account.json', 'rebuild/m4/spec/kubeconfig.yml', 'rebuild/m4/spec/id_rsa.backup.json',
  'rebuild/m4/spec/keys.json', 'rebuild/m4/spec/passwords.json', 'rebuild/m4/spec/private.json', 'rebuild/m4/spec/env.json',
  'rebuild/m4/spec/apikey.json', 'rebuild/m4/spec/wallet.json', 'rebuild/m4/spec/keystore/x.json'];
const DECLARING = new Set(['S11.product', 'the parent candidate product', 'the parent candidate execution pins']);
const NOT_REVIEWED = /not an exact member of a reviewed inventory/;
for (const name of L5_NAMES) {
  for (const [source, build, before] of L4_SOURCES.filter(([s]) => !DECLARING.has(s))) {
    test('S11-REGEN B5-L5 REFUSES ' + name + ' supplied through ' + source + ' (in no reviewed inventory), BY NAME, before any content read of it', () => {
      refusedBeforeRead(run(build(name)), name, NOT_REVIEWED, before);
    });
  }
}
test('S11-REGEN B5-L5: an UNDECLARED changed path with an ordinary name is refused BY NAME before any content read (declare it in S11.json first)', () => {
  const name = 'rebuild/m4/workout/b.cjs';
  refusedBeforeRead(run(L4_SOURCES[0][1](name)), name, NOT_REVIEWED, FIXED);
});
test('S11-REGEN B5-L5: S11.json naming a declared product file as the parent artifact is refused BY NAME, before any read of it', () => {
  const w = world(); editSpec(w, (s) => { s.parent.options[0].artifact = A; });
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.reads.includes(A), false, 'the helper READ ' + A + ' (content read reached) before refusing it');
  for (const f of r.reads) assert(FIXED.has(f), 'a product read happened before the refusal: ' + f);
  assert.equal(r.exitCode, 2, 'not refused: ' + r.out);
  assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(A), 'not refused BY NAME: ' + r.out);
  assert.match(r.out, /not admitted for a content read: not the reviewed S10 parent artifact or review/);
});
test('S11-REGEN B5-L5 CONTROL: a changed Markdown report outside rebuild/engine/, in no inventory, is neither read, declared nor refused', () => {
  const name = 'rebuild/m4/spec/NOTES.md';
  const w = world(); w.at[HEAD][name] = 'notes\n'; w.disk[name] = 'notes\n'; w.changed.push(name);
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.equal(r.reads.includes(name), false, 'the helper READ ' + name);
  assert.equal(r.out.includes(name), false, 'the report was declared or named: ' + r.out);
});

/* DECISIONS:812, ported: rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs is an exact-file SCOPE entry
   by identity only (an S10 product key, carried at S10), so the exact file pinned by the sealed parent is
   carried pre == post, and a sibling, a case variant and a path below it are each refused BY NAME as outside
   the S11 product scope, through the changed paths and through the sealed parent product, before any read. */
const CI2 = 'rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs';
const CI2_BYTES = 'synthetic ci-second-gate bytes\n';
const parentPins = (w, name, bytes) => {   // the sealed parent pins name as a product, and its S10.json declares it
  for (const r of [P, HEAD]) w.at[r][name] = bytes;
  w.disk[name] = bytes;
  editArt(w, (a) => { a.product[name] = sha(bytes); });
  editS10(w, (s) => { s.product[name] = { pre: sha(bytes), post: sha(bytes), role: 'carried' }; });
};
for (const declaredInS11 of [false, true]) {
  test('S11-REGEN DECISIONS:812: the exact SCOPE file ' + CI2 + ', pinned by the sealed parent' + (declaredInS11 ? ' and declared carried in S11.json' : ' and undeclared in S11.json') + ', is admitted and carried pre == post', () => {
    const w = sealed(world(), 'ACCEPTED'); parentPins(w, CI2, CI2_BYTES);
    if (declaredInS11) editSpec(w, (s) => { s.product[CI2] = { pre: sha(CI2_BYTES), post: sha(CI2_BYTES), role: 'carried' }; });
    const r = run(w);
    assert.equal(r.error, null, String(r.error && r.error.stack));
    assert.equal(r.exitCode, 0, r.out);
    assert.equal(/REGEN-PATH-REFUSED|PROBLEM/.test(r.out), false, r.out);
    const h = sha(CI2_BYTES).slice(0, 8);
    if (declaredInS11) assert.equal(r.out.includes(CI2 + ':'), false, 'a declared carried pin moved: ' + r.out);
    else assert(r.out.includes(CI2 + ': undeclared  =>  carried ' + h + '->' + h), 'not carried pre == post: ' + r.out);
  });
}
const CI2_REFUSED = [
  ['a sibling under rebuild/conform/v4/postfix/test/', 'rebuild/conform/v4/postfix/test/other.test.cjs'],
  ['a case variant of the exact name', 'rebuild/conform/v4/postfix/test/CI-Second-Gate.test.cjs'],
  ['a path below the exact name', CI2 + '/x.cjs'],
];
const CI2_SOURCES = [   // each world also carries the exact file, pinned by the sealed parent
  ['changed paths', (name) => { const w = sealed(world(), 'ACCEPTED'); parentPins(w, CI2, CI2_BYTES); everywhere(w, name); w.changed.push(name); return w; }],
  ['the sealed parent product (declared by the parent S10.json too)', (name) => { const w = sealed(world(), 'ACCEPTED'); parentPins(w, CI2, CI2_BYTES); parentPins(w, name, MARKER); return w; }],
];
for (const [label, name] of CI2_REFUSED) {
  for (const [source, build] of CI2_SOURCES) {
    test('S11-REGEN DECISIONS:812 REFUSES ' + label + ' (' + name + ') supplied through ' + source + ' as outside the S11 product scope, BY NAME, before any read of it', () => {
      const r = run(build(name));
      assert.equal(r.error, null, String(r.error && r.error.stack));
      assert.equal(r.reads.includes(name), false, 'the helper READ ' + name + ' before refusing it');
      for (const f of r.reads) assert(SEALED_READS.has(f), 'a product read happened before the refusal: ' + f);
      assert.equal(r.exitCode, 2, 'not refused: ' + r.out);
      assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(name + ' (outside the S11 product scope)'), 'not refused BY NAME as outside the S11 product scope: ' + r.out);
    });
  }
}

/* S11 FC06: rebuild/m3/w6/t2-stage.cjs is a NATIVE-LOAD product path that lies under no S10 SCOPE root, so
   S11-REGEN admits it as an exact-file SCOPE entry and adds NO rebuild/m3/w6/ root. It stood at the S10
   parent pinned by nothing (parent-unpinned), so once declared and changed it is role new with pre null
   (DECISIONS:792 shape); a sibling, a case variant and a path below it stay outside the scope. */
const T2 = 'rebuild/m3/w6/t2-stage.cjs';
test('S11-REGEN S11 FC06: the exact SCOPE file ' + T2 + ', parent-unpinned, changed and declared by S11.json, is declared new with pre null', () => {
  const w = world(); w.at[P][T2] = 't2 parent\n'; w.at[HEAD][T2] = 't2 composed\n'; w.disk[T2] = 't2 composed\n'; w.changed.push(T2);
  editSpec(w, (s) => { s.product[T2] = { pre: null, post: sha('t2 composed\n'), role: 'new' }; });
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.equal(/REGEN-PATH-REFUSED|PROBLEM/.test(r.out), false, r.out);
  assert.match(r.out, /parent-unpinned paths declared new \(DECISIONS:792\): 1 - rebuild\/m3\/w6\/t2-stage\.cjs/);
});
const T2_REFUSED = [['a sibling directly under rebuild/m3/w6/', 'rebuild/m3/w6/t2-other.cjs'],
  ['a case variant of the exact name', 'rebuild/m3/w6/T2-Stage.cjs'], ['a path below the exact name', T2 + '/x.cjs']];
for (const [label, name] of T2_REFUSED) {
  for (const [source, build] of [L4_SOURCES[0], L4_SOURCES[1]]) {
    test('S11-REGEN S11 FC06 REFUSES ' + label + ' (' + name + ') supplied through ' + source + ' as outside the S11 product scope, BY NAME, before any read of it', () => {
      const r = run(build(name));
      assert.equal(r.error, null, String(r.error && r.error.stack));
      assert.equal(r.reads.includes(name), false, 'the helper READ ' + name + ' before refusing it');
      for (const f of r.reads) assert(FIXED.has(f), 'a product read happened before the refusal: ' + f);
      assert.equal(r.exitCode, 2, 'not refused: ' + r.out);
      assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(name + ' (outside the S11 product scope)'), 'not refused BY NAME as outside the S11 product scope: ' + r.out);
    });
  }
}

/* S11 D-REGEN-INPUT at a CANDIDATE parent (the PREP-NOW case, brief T3f): with no sealed artifact the parent
   pins come from S10.json's own posts, and S10's role-released pair leaves the declared union there too;
   no parent pin is invented for it. */
test('S11-REGEN S11 candidate parent: an S10.json role-released path leaves the declared union and is never declared', () => {
  const w = world();
  for (const r of [P, HEAD]) w.at[r][GYMAPP] = 'gym\n';
  w.disk[GYMAPP] = 'gym\n';
  editS10(w, (s) => { s.product[GYMAPP] = { pre: sha('gym\n'), post: null, role: 'released' }; });
  editSpec(w, (s) => { s.product[GYMAPP] = { pre: sha('gym\n'), post: sha('gym\n'), role: 'carried' }; });
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.match(r.out, /mode: CANDIDATE/);
  assert.match(r.out, /parent-released paths left undeclared: rebuild\/m3\/w7-preview\/today\/gym-app\.mjs; dropped from the declared union: rebuild\/m3\/w7-preview\/today\/gym-app\.mjs/);
  assert.match(r.out, /gym-app\.mjs: dropped \(released by the parent\)/);
  assert.equal(r.reads.includes(GYMAPP), false, 'the helper read a parent-released file');
});

/* S11 PENDING CENSUS: every string value of S11.json that begins with the word PENDING is listed by its JSON
   path on a dry run; a string that merely contains the word elsewhere is not a PENDING value. */
test('S11-REGEN S11 PENDING census: a dry run lists every PENDING value of S11.json by JSON path, and nothing else', () => {
  const w = world();
  editSpec(w, (s) => {
    s.packageId = 'PENDING STOP-S11-ID: PROPOSED M2-S11-NATIVE-LOAD';
    s.sourceBase = 'PENDING STOP-S11-BASE: the S10 fast-forward sha';
    s.parent.options[0].sha256 = 'PENDING STOP-S11-PARENT: the S10 artifact sha256';
    s.children = [{ name: 'c1', argv: ['--test'], needle: 'PENDING STOP-S11-T4: re-observe' }];
    s.notes = ['a note that is not PENDING at its start'];
  });
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  const line = r.out.split('\n').find((l) => l.includes('PENDING census on disk:')) || '';
  assert.match(line, /PENDING census on disk: 4 value\(s\) - /);
  for (const p of ['$.packageId', '$.sourceBase', '$.parent.options[0].sha256', '$.children[0].needle']) assert(line.includes(p), 'not listed: ' + p + ' in ' + line);
  assert.equal(line.includes('$.notes'), false, 'a note that only contains the word was counted: ' + line);
});

/* S11 --write at a SEALED, ACCEPTED parent (brief T3k): the fields this helper owns are filled from the
   parent and HEAD, the fields it does not own stay PENDING and are listed, and the bytes written are the
   runner's canonical JSON (strict-json.cjs parseExact: JSON.stringify(value, null, 2) + LF). */
test('S11-REGEN S11 --write: sourceBase, the parent option, the receipt line and the runner pin are filled; the rest stays PENDING and is listed', () => {
  const w = sealed(world(), 'ACCEPTED'); w.allowWrite = true;
  editSpec(w, (s) => {
    s.packageId = 'PENDING STOP-S11-ID: PROPOSED M2-S11-NATIVE-LOAD';
    s.sourceBase = 'PENDING STOP-S11-BASE: the S10 fast-forward sha';
    s.parent.decided = false; s.parent.chosen = null;
    Object.assign(s.parent.options[0], { sha256: 'PENDING STOP-S11-PARENT: a', reviewSha256: 'PENDING STOP-S11-PARENT: b', receiptLedgerLine: 'PENDING STOP-S11-PARENT: c' });
    s.tooling = { runner: RUNNER, runnerSha256: 'PENDING STOP-S11-RUNNER: after the two runner hunks' };
  });
  const r = run(w, ['--parent', 'fake', '--write', '--receipt-line', '7']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.deepEqual(w.writes, [SPEC], 'wrote something other than S11.json: ' + w.writes.join(' '));
  const bytes = w.disk[SPEC], s = JSON.parse(bytes);
  assert.equal(bytes, JSON.stringify(s, null, 2) + '\n', 'not the canonical JSON bytes the runner parses');
  assert.equal(s.sourceBase, P);
  assert.equal(s.parent.decided, true); assert.equal(s.parent.chosen, 'S10');
  assert.equal(s.parent.options[0].sha256, sha(w.at[P][ART]));
  assert.equal(s.parent.options[0].reviewSha256, sha(w.at[P][REV]));
  assert.equal(s.parent.options[0].receiptLedgerLine, 7);
  assert.equal(s.tooling.runnerSha256, sha('runner\n'));
  assert.equal(s.packageId, 'PENDING STOP-S11-ID: PROPOSED M2-S11-NATIVE-LOAD', 'the helper filled a field it does not own');
  assert.match(r.out, /PENDING left for the PM \(T5\/T6\), never filled by this helper: 1 value\(s\) - \$\.packageId/);
  assert.match(r.out, /^WROTE rebuild\/lanes\/b\/tooling\/packages\/S11\.json [0-9a-f]{64}$/m);
});

/* S11 PROTECTED FIVE (S11 moves rebuild/engine bytes; the five never move and are never read): a declared
   protected file whose object id is equal at the parent and at HEAD is carried at the parent pin with no read
   of it; one whose object id differs refuses the whole run by name, still with no read of it. Every byte here
   is invented on the fake ports. */
const MIG = 'rebuild/engine/migrate.cjs';
function protectedWorld(headBytes) {
  const w = world();
  w.at[P][MIG] = 'synthetic protected parent\n'; w.at[HEAD][MIG] = headBytes; w.disk[MIG] = headBytes;
  editS10(w, (s) => { s.product[MIG] = { pre: sha('x\n'), post: sha('synthetic protected parent\n'), role: 'carried' }; });
  editSpec(w, (s) => { s.product[MIG] = { pre: sha('synthetic protected parent\n'), post: sha('synthetic protected parent\n'), role: 'carried' }; });
  return w;
}
test('S11-REGEN S11 protected five: an unchanged protected file is carried at the parent pin by object id, never read', () => {
  const r = run(protectedWorld('synthetic protected parent\n'));
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.equal(r.reads.includes(MIG), false, 'the helper READ a protected engine file');
  assert.equal(r.out.includes(MIG + ':'), false, 'the carried protected pin moved: ' + r.out);
});
test('S11-REGEN S11 protected five: a protected file whose object id moved refuses the run BY NAME, never read', () => {
  const r = run(protectedWorld('synthetic protected moved\n'));
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.equal(r.reads.includes(MIG), false, 'the helper READ a protected engine file');
  assert.match(r.out, /protected engine file changed between the parent and HEAD, or is dirty: rebuild\/engine\/migrate\.cjs/);
});
