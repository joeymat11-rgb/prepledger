'use strict';
/* S12-REGEN's PATH BOUNDARY and its S12 deltas, on synthetic ports. The port of
   rebuild/lanes/b/S11-REGEN.test.cjs (89012d94; itself the port of S10-REGEN.test.cjs, Astra
   S10-INTEGRATION-REVIEW-L2..L5 B5, D-REGEN-INPUT, D-S10I-11, DECISIONS:812, D-S11-A1, D-S11-A2, D-S11P-2).
   The helper is compiled in memory with FAKE node:child_process and node:fs modules, so nothing here
   touches the repository: every git answer and every file is invented below, and every content read the
   helper attempts is recorded. The rows require that an out-of-scope, forbidden, linked or non-regular name
   is REFUSED BY NAME BEFORE ANY READ OF IT, and that before the refusal nothing but the fixed inputs was
   read. S12_REGEN_UNDER_TEST may name another copy of the helper (a mutant, or a red-first copy), at ANY
   directory depth: REPO below is resolved ONCE, from the helper under test, by the same expression the
   helper uses for its own REPO.
   Every ported row keeps its meaning with S12's names (S12.json, the parent S11.json, the S11 artifact slug
   s11-native-load); the row labels carry S12-REGEN and keep the S11 tag of the delta they were written for.
   Rows NEW in S12 carry "S12" in their name: the ancestor-release walk (header (A)) and --worktree
   (header (B)). */
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const crypto = require('node:crypto');
const Module = require('node:module');
const fsReal = require('node:fs');

const HELPER = process.env.S12_REGEN_UNDER_TEST || path.join(__dirname, 'S12-REGEN.cjs');
const REPO = path.resolve(path.dirname(HELPER), '..', '..', '..');   // the helper's own REPO (its __dirname is dirname(HELPER))
const rel = (abs) => path.relative(REPO, abs).split(path.sep).join('/');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const oid = (s) => crypto.createHash('sha1').update(String(s)).digest('hex');
const P = 'a'.repeat(40), HEAD = 'b'.repeat(40);
const SPEC = 'rebuild/lanes/b/tooling/packages/S12.json', S10SPEC = 'rebuild/lanes/b/tooling/packages/S11.json';   // S10SPEC names the PARENT spec (S11.json) in this port
const RUNNER = 'rebuild/lanes/b/tooling/b-package.cjs';
const A = 'rebuild/m4/workout/a.cjs', VIEW = 'rebuild/m3/w7-preview/today/today-entry.mjs';
const ART = 'rebuild/m4/spec/acceptance-s11-native-load.json', REV = 'rebuild/m4/spec/review-s11-native-load.json';
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
  disk[SPEC] = JSON.stringify({ parent: { options: [{ id: 'S11', artifact: ART, review: REV }] },
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
    if (a[0] === 'ls-files') return (w.untracked || []).join('\n') + '\n';   // S12 (B): --worktree discovery of untracked files
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

test('S12-REGEN CONTROL: an in-scope change is measured, and only allowlisted paths are read', () => {
  const r = run(world());
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.match(r.out, /DRY RUN: nothing written/);
  for (const f of r.reads) assert(FIXED.has(f) || f === A || f === VIEW, 'read outside the declared set: ' + f);
});

const refusals = [
  ['an out-of-scope changed name', (w) => { w.changed.push('rebuild/secret/other.json'); w.at[HEAD]['rebuild/secret/other.json'] = 'x'; w.disk['rebuild/secret/other.json'] = 'x'; }, 'rebuild/secret/other.json', /outside the S12 product scope/],
  ['a forbidden private path', (w) => { w.changed.push('rebuild/conform/private/live.json'); w.at[HEAD]['rebuild/conform/private/live.json'] = 'x'; }, 'rebuild/conform/private/live.json', /forbidden set/],
  ['a forbidden soak name inside a root', (w) => { w.changed.push('rebuild/m4/spec/soak-run.json'); w.at[HEAD]['rebuild/m4/spec/soak-run.json'] = 'x'; w.disk['rebuild/m4/spec/soak-run.json'] = 'x'; }, 'rebuild/m4/spec/soak-run.json', /forbidden set/],
  ['a traversal name', (w) => { w.changed.push('rebuild/m4/workout/../../../outside.json'); }, 'rebuild/m4/workout/../../../outside.json', /plain repository-relative/],
  ['a symlink on disk', (w) => { const f = 'rebuild/m4/workout/link.cjs'; w.changed.push(f); w.at[HEAD][f] = 'l'; w.disk[f] = 'l'; w.links.add(f); }, 'rebuild/m4/workout/link.cjs', /symlink or junction/],
  ['a junction above the file', (w) => { const f = 'rebuild/m4/workout/j/x.cjs'; w.changed.push(f); w.at[HEAD][f] = 'j'; w.disk[f] = 'j'; w.links.add('rebuild/m4/workout/j'); }, 'rebuild/m4/workout/j/x.cjs', /junction on disk at rebuild\/m4\/workout\/j/],
  ['a Git symlink entry', (w) => { const f = 'rebuild/m4/workout/glink.cjs'; w.changed.push(f); w.at[HEAD][f] = 'target'; w.disk[f] = 'target'; w.modes[f] = '120000'; }, 'rebuild/m4/workout/glink.cjs', /not a regular file in Git/],
];
for (const [label, plant, name, why] of refusals) {
  test('S12-REGEN REFUSES ' + label + ' BY NAME, BEFORE ANY READ OF IT', () => {
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
test('S12-REGEN D-REGEN-INPUT: --write refuses a parent whose review envelope is not ACCEPTED', () => {
  const r = run(sealed(world(), 'PENDING'), ['--parent', 'fake', '--write', '--receipt-line', '1']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.match(r.out, /is not an ACCEPTED envelope/);
});
test('S12-REGEN D-REGEN-INPUT: a parent-released path leaves the WHOLE declared union, even when the draft carries it', () => {
  const r = run(sealed(world(), 'ACCEPTED'));
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.match(r.out, /dropped from the declared union: rebuild\/m3\/w7-preview\/today\/gym-app\.mjs/);
  assert.match(r.out, /rebuild\/m3\/w7-preview\/today\/gym-app\.mjs: dropped \(released by rebuild\/m4\/spec\/acceptance-s11-native-load\.json\)/);
  assert.equal(/gym-app\.mjs: .*=>  new/.test(r.out), false, 'the released path became new');
});

/* D-S10I-11, ported: the two --write refusals, as rows (the stale note now cites the S10 candidate). */
test('S12-REGEN D-S10I-11: --write without --receipt-line is refused BY NAME, before any read', () => {
  const r = run(sealed(world(), 'ACCEPTED'), ['--parent', 'fake', '--write']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.match(r.out, /--write needs --receipt-line N/);
  assert.deepEqual(r.reads, [], 'the helper read before refusing a --write with no receipt line');
});
test('S12-REGEN D-S10I-11: --write refuses while a carried note still cites the S10 candidate, and writes nothing', () => {
  const w = sealed(world(), 'ACCEPTED');
  const spec = JSON.parse(w.disk[SPEC]);
  spec.notes = ['PROPOSED DRAFT composed over the S10 candidate 9849bc7, not a spec of record.'];
  w.disk[SPEC] = JSON.stringify(spec); w.at[HEAD][SPEC] = w.disk[SPEC];
  const r = run(w, ['--parent', 'fake', '--write', '--receipt-line', '1']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.match(r.out, /STALE NOTE .*\[0\] PROPOSED DRAFT/);
  assert.match(r.out, /carried note\(s\) still make a draft-time claim/);
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
  test('S12-REGEN B5 REFUSES ' + label + ' BY NAME, BEFORE ANY READ OF IT', () => {
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
    test('S12-REGEN B5 REFUSES ' + name + ' supplied through ' + source + ', before any read of it', () => {
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
    test('S12-REGEN B5-L4 REFUSES ' + name + ' supplied through ' + source + ', BY NAME, before any content read of it', () => {
      refusedBeforeRead(run(build(name)), name, /dot-name|credential or key file name|key or secret container extension/, before);
    });
  }
}
const DOT = /a dot-name segment/, CRED = /a credential or key file name/, KEYX = /a key or secret container extension/, EXT = /is not one S12 or its S11 parent declares/;
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
  test('S12-REGEN B5-L4 admission rule REFUSES the changed name ' + name + ' BY NAME, before any content read of it', () => {
    refusedBeforeRead(run(L4_SOURCES[0][1](name)), name, why, FIXED);
  });
}
/* EXACT REVIEWED FILES: a dot-name is admitted only as an exact-file SCOPE entry. */
test('S12-REGEN B5-L4 CONTROL: the exact reviewed .github/workflows/rebuild.yml is admitted and measured', () => {
  const YML = '.github/workflows/rebuild.yml';
  const w = world(); w.at[P][YML] = 'on: push\n'; w.at[HEAD][YML] = 'on: [push]\n'; w.disk[YML] = 'on: [push]\n'; w.changed.push(YML);
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.match(r.out, /\.github\/workflows\/rebuild\.yml: undeclared {2}=> {2}new/);
});
for (const name of ['rebuild/m4/spec/.github/workflows/rebuild.yml', 'rebuild/m4/workout/.github/x.json']) {
  test('S12-REGEN B5-L4 REFUSES ' + name + ' (a .github segment that is not an exact reviewed file) BY NAME, before any content read of it', () => {
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
    test('S12-REGEN B5-L5 REFUSES ' + name + ' supplied through ' + source + ' (in no reviewed inventory), BY NAME, before any content read of it', () => {
      refusedBeforeRead(run(build(name)), name, NOT_REVIEWED, before);
    });
  }
}
test('S12-REGEN B5-L5: an UNDECLARED changed path with an ordinary name is refused BY NAME before any content read (declare it in S11.json first)', () => {
  const name = 'rebuild/m4/workout/b.cjs';
  refusedBeforeRead(run(L4_SOURCES[0][1](name)), name, NOT_REVIEWED, FIXED);
});
test('S12-REGEN B5-L5: S11.json naming a declared product file as the parent artifact is refused BY NAME, before any read of it', () => {
  const w = world(); editSpec(w, (s) => { s.parent.options[0].artifact = A; });
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.reads.includes(A), false, 'the helper READ ' + A + ' (content read reached) before refusing it');
  for (const f of r.reads) assert(FIXED.has(f), 'a product read happened before the refusal: ' + f);
  assert.equal(r.exitCode, 2, 'not refused: ' + r.out);
  assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(A), 'not refused BY NAME: ' + r.out);
  assert.match(r.out, /not admitted for a content read: not the reviewed S11 parent artifact or review/);
});
test('S12-REGEN B5-L5 CONTROL: a changed Markdown report outside rebuild/engine/, in no inventory, is neither read, declared nor refused', () => {
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
  test('S12-REGEN DECISIONS:812: the exact SCOPE file ' + CI2 + ', pinned by the sealed parent' + (declaredInS11 ? ' and declared carried in S12.json' : ' and undeclared in S12.json') + ', is admitted and carried pre == post', () => {
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
    test('S12-REGEN DECISIONS:812 REFUSES ' + label + ' (' + name + ') supplied through ' + source + ' as outside the S12 product scope, BY NAME, before any read of it', () => {
      const r = run(build(name));
      assert.equal(r.error, null, String(r.error && r.error.stack));
      assert.equal(r.reads.includes(name), false, 'the helper READ ' + name + ' before refusing it');
      for (const f of r.reads) assert(SEALED_READS.has(f), 'a product read happened before the refusal: ' + f);
      assert.equal(r.exitCode, 2, 'not refused: ' + r.out);
      assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(name + ' (outside the S12 product scope)'), 'not refused BY NAME as outside the S12 product scope: ' + r.out);
    });
  }
}

/* S11 FC06: rebuild/m3/w6/t2-stage.cjs is a NATIVE-LOAD product path that lies under no S10 SCOPE root, so
   S11-REGEN admits it as an exact-file SCOPE entry and adds NO rebuild/m3/w6/ root. It stood at the S10
   parent pinned by nothing (parent-unpinned), so once declared and changed it is role new with pre null
   (DECISIONS:792 shape); a sibling, a case variant and a path below it stay outside the scope. */
const T2 = 'rebuild/m3/w6/t2-stage.cjs';
test('S12-REGEN S11 FC06: the exact SCOPE file ' + T2 + ', parent-unpinned, changed and declared by S11.json, is declared new with pre null', () => {
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
    test('S12-REGEN S11 FC06 REFUSES ' + label + ' (' + name + ') supplied through ' + source + ' as outside the S12 product scope, BY NAME, before any read of it', () => {
      const r = run(build(name));
      assert.equal(r.error, null, String(r.error && r.error.stack));
      assert.equal(r.reads.includes(name), false, 'the helper READ ' + name + ' before refusing it');
      for (const f of r.reads) assert(FIXED.has(f), 'a product read happened before the refusal: ' + f);
      assert.equal(r.exitCode, 2, 'not refused: ' + r.out);
      assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(name + ' (outside the S12 product scope)'), 'not refused BY NAME as outside the S12 product scope: ' + r.out);
    });
  }
}

/* S11 D-REGEN-INPUT at a CANDIDATE parent (the PREP-NOW case, brief T3f): with no sealed artifact the parent
   pins come from S10.json's own posts, and S10's role-released pair leaves the declared union there too;
   no parent pin is invented for it. */
test('S12-REGEN S11 candidate parent: an S10.json role-released path leaves the declared union and is never declared', () => {
  const w = world();
  for (const r of [P, HEAD]) w.at[r][GYMAPP] = 'gym\n';
  w.disk[GYMAPP] = 'gym\n';
  editS10(w, (s) => { s.product[GYMAPP] = { pre: sha('gym\n'), post: null, role: 'released' }; });
  editSpec(w, (s) => { s.product[GYMAPP] = { pre: sha('gym\n'), post: sha('gym\n'), role: 'carried' }; });
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.match(r.out, /mode: CANDIDATE/);
  assert.match(r.out, /released paths left undeclared \(the parent and its ancestors\): rebuild\/m3\/w7-preview\/today\/gym-app\.mjs \(rebuild\/lanes\/b\/tooling\/packages\/S11\.json\); dropped from the declared union: rebuild\/m3\/w7-preview\/today\/gym-app\.mjs/);
  assert.match(r.out, /gym-app\.mjs: dropped \(released by rebuild\/lanes\/b\/tooling\/packages\/S11\.json\)/);
  assert.equal(r.reads.includes(GYMAPP), false, 'the helper read a parent-released file');
});

/* S11 PENDING CENSUS: every string value of S11.json that begins with the word PENDING is listed by its JSON
   path on a dry run; a string that merely contains the word elsewhere is not a PENDING value. */
test('S12-REGEN S11 PENDING census: a dry run lists every PENDING value of S11.json by JSON path, and nothing else', () => {
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
test('S12-REGEN S11 --write: sourceBase, the parent option, the receipt line and the runner pin are filled; the rest stays PENDING and is listed', () => {
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
  assert.equal(s.parent.decided, true); assert.equal(s.parent.chosen, 'S11');
  assert.equal(s.parent.options[0].sha256, sha(w.at[P][ART]));
  assert.equal(s.parent.options[0].reviewSha256, sha(w.at[P][REV]));
  assert.equal(s.parent.options[0].receiptLedgerLine, 7);
  assert.equal(s.tooling.runnerSha256, sha('runner\n'));
  assert.equal(s.packageId, 'PENDING STOP-S11-ID: PROPOSED M2-S11-NATIVE-LOAD', 'the helper filled a field it does not own');
  assert.match(r.out, /PENDING left for the PM, never filled by this helper: 1 value\(s\) - \$\.packageId/);
  assert.match(r.out, /^WROTE rebuild\/lanes\/b\/tooling\/packages\/S12\.json [0-9a-f]{64}$/m);
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
test('S12-REGEN S11 protected five: an unchanged protected file is carried at the parent pin by object id, never read', () => {
  const r = run(protectedWorld('synthetic protected parent\n'));
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.equal(r.reads.includes(MIG), false, 'the helper READ a protected engine file');
  assert.equal(r.out.includes(MIG + ':'), false, 'the carried protected pin moved: ' + r.out);
});
test('S12-REGEN S11 protected five: a protected file whose object id moved refuses the run BY NAME, never read', () => {
  const r = run(protectedWorld('synthetic protected moved\n'));
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.equal(r.reads.includes(MIG), false, 'the helper READ a protected engine file');
  assert.match(r.out, /protected engine file changed between the parent and HEAD, or is dirty: rebuild\/engine\/migrate\.cjs/);
});

/* S11 D-S11P-2 (Fable REVIEW-S11-PREP-FABLE-l1): the S11 draft's carried notes [4]-[7] make draft-time
   claims (a MERGE measured in the prep worktree, NOT YET AUTHORED cells, a CHILDREN question OPEN FOR A PM
   RULING, OPEN ITEMS, brief steps T3a..T3k, the word DRAFT) that the seal's own steps make false, and none
   of them cites the S10 candidate. Each alternative of the widened STALE pattern has its own row; every
   note text is invented and carries that one marker only. Each row is red against the S10-candidate-only
   pattern (--write then succeeds and writes S11.json) and green with the widened one. */
const DRAFT_CLAIMS = [
  ['a MERGE note measured in the prep worktree', 'MERGE (invented): five paths merged cleanly in the prep worktree and are staged.', 'MERGE (invented)'],
  ['a MERGE note that waits on a brief step T3a..T3k', 'MERGE (invented): the standing step is final only after brief T3e renames its package.', 'MERGE (invented)'],
  ['a NOT YET AUTHORED note', 'NOT YET AUTHORED (invented): two gate cells and one runner hunk.', 'NOT YET AUTHORED'],
  ['a CHILDREN note with a question OPEN FOR A PM RULING', 'CHILDREN (invented): three children kept. OPEN FOR A PM RULING: whether one of them is superseded.', 'CHILDREN (invented)'],
  ['an OPEN ITEMS note', 'OPEN ITEMS (invented): one provisioning child and one three-way proof.', 'OPEN ITEMS'],
  ['a note that calls the spec a DRAFT', 'CHILDREN (invented): the argv lists of this DRAFT follow the parent.', 'CHILDREN (invented)'],
];
for (const [label, note, head] of DRAFT_CLAIMS) {
  test('S12-REGEN S11 D-S11P-2: --write refuses while ' + label + ' is carried, and writes nothing', () => {
    const w = sealed(world(), 'ACCEPTED'); w.allowWrite = true;
    editSpec(w, (s) => { s.notes = [note]; });
    const r = run(w, ['--parent', 'fake', '--write', '--receipt-line', '1']);
    assert.equal(r.error, null, String(r.error && r.error.stack));
    assert.deepEqual(w.writes, [], 'wrote S11.json while a draft-time note was carried: ' + r.out);
    assert.equal(r.exitCode, 2, r.out);
    assert(r.out.includes('STALE NOTE') && r.out.includes('[0] ' + head), 'the draft-time note was not flagged by index: ' + r.out);
    assert.match(r.out, /carried note\(s\) still make a draft-time claim/);
  });
}
test('S12-REGEN S11 D-S11P-2: a dry run over the draft layout flags [0] and the four draft-time notes [4]-[7], and neither the regenerated [1]-[3] nor a carried debt note [8]', () => {
  const w = world();
  editSpec(w, (s) => {
    s.notes = ['PROPOSED DRAFT (invented): not a spec of record.',
      'PRODUCT MAP (invented text, regenerated by the helper).',
      'PARENT-UNPINNED PATHS (invented text, regenerated by the helper).',
      'EXECUTION PIN SUPERSEDED (invented text, regenerated by the helper).',
      DRAFT_CLAIMS[0][1], DRAFT_CLAIMS[2][1], DRAFT_CLAIMS[3][1], DRAFT_CLAIMS[4][1],
      'D-EXAMPLE, CARRIED (invented): the example child stays undeclared, as at the parent; re-measured after a later date.'];
  });
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  const flagged = r.out.split('\n').filter((l) => l.includes('STALE NOTE')).map((l) => (l.match(/\[(\d+)\]/) || [])[1]);
  assert.deepEqual(flagged, ['0', '4', '5', '6', '7'], r.out);
});
test('S12-REGEN S11 D-S11P-2 CONTROL: a carried note with no candidate id and no draft-time claim is kept, unflagged, and --write proceeds', () => {
  const w = sealed(world(), 'ACCEPTED'); w.allowWrite = true;
  const keep = 'D-EXAMPLE, CARRIED (invented): the example child stays undeclared; its open item list in T31 was drafted and closed.';
  editSpec(w, (s) => { s.notes = [keep]; });
  const r = run(w, ['--parent', 'fake', '--write', '--receipt-line', '1']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.equal(r.out.includes('STALE NOTE'), false, 'a note with no draft-time claim was flagged: ' + r.out);
  assert.deepEqual(w.writes, [SPEC], r.out);
  assert(JSON.parse(w.disk[SPEC]).notes.includes(keep), 'the carried note was not kept');
});

/* S11 D-S11-A1 (Astra S11-REGEN-SCOPE-REVIEW-L1): the PENDING census is EXHAUSTIVE. The S11 draft holds more
   than 40 PENDING values, and a census capped at 40 ("... N more") hides the rest from the PM's inspection.
   Both censuses (on disk, and the one --write prints after its fill) must list every path, with no cap
   marker. Every value is invented. Red first against the capped helper (bf87138f), green after the fix. */
const MANY = 45;
const manyPending = (s) => { s.children = Array.from({ length: MANY }, (_, i) => ({ name: 'c' + i, argv: ['--test'], needle: 'PENDING STOP-S11-T4: invented needle ' + i })); };
const censusOf = (line) => line.split(' - ').slice(1).join(' - ').trim().split(' ');
test('S12-REGEN S11 D-S11-A1: a dry run lists ALL ' + MANY + ' PENDING values on disk, past 40, with no cap marker', () => {
  const w = world(); editSpec(w, manyPending);
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  const line = r.out.split('\n').find((l) => l.includes('PENDING census on disk:')) || '';
  assert.match(line, new RegExp('PENDING census on disk: ' + MANY + ' value\\(s\\) - '));
  assert.equal(/\.\.\. \d+ more/.test(line), false, 'the on-disk census is capped: ...' + line.slice(-60));
  assert.deepEqual(censusOf(line), Array.from({ length: MANY }, (_, i) => '$.children[' + i + '].needle'));
});
test('S12-REGEN S11 D-S11-A1: --write lists ALL the PENDING values it leaves for the PM, past 40, with no cap marker', () => {
  const w = sealed(world(), 'ACCEPTED'); w.allowWrite = true;
  editSpec(w, (s) => { manyPending(s); s.packageId = 'PENDING STOP-S11-ID: invented package id'; });
  const r = run(w, ['--parent', 'fake', '--write', '--receipt-line', '7']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  const line = r.out.split('\n').find((l) => l.includes('PENDING left for the PM')) || '';
  assert.match(line, new RegExp('never filled by this helper: ' + (MANY + 1) + ' value\\(s\\) - '));
  assert.equal(/\.\.\. \d+ more/.test(line), false, 'the after-fill census is capped: ...' + line.slice(-60));
  assert.deepEqual(censusOf(line).sort(), ['$.packageId', ...Array.from({ length: MANY }, (_, i) => '$.children[' + i + '].needle')].sort());
});

/* S11 D-S11-A2 (Astra S11-REGEN-SCOPE-REVIEW-L1): the header called FIXED_INPUTS "the only files read before
   discovery", but the S10 parent artifact and review are read (each validated first) before discovery too,
   and in the CANDIDATE mode of a dry run so are the parent's execution-pin targets. The two CONTROL rows pin
   the behaviour the corrected comment describes (the reads recorded before the scoped `git diff`, in order;
   green before and after, since only the comment changes). The header row is red first against the old
   comment (bf87138f) and green after it. */
function readsBeforeDiscovery(w, argv) {
  const snap = [], changed = w.changed;
  w.changed = { join: (sep) => { snap.push(w.reads.slice()); return changed.join(sep); } };
  const r = run(w, argv);
  return { r, before: snap[0] };
}
test('S12-REGEN S11 D-S11-A2 CONTROL: at a sealed parent the reads before discovery are exactly S11.json, the parent S10.json, the parent artifact and its review, in that order', () => {
  const { r, before } = readsBeforeDiscovery(sealed(world(), 'ACCEPTED'));
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.deepEqual(before, [SPEC, S10SPEC, ART, REV]);
});
test('S12-REGEN S11 D-S11-A2 CONTROL: with no artifact at the parent (CANDIDATE mode, dry run) the reads before discovery are S11.json, the parent S10.json and its execution-pin targets, never an artifact or review', () => {
  const { r, before } = readsBeforeDiscovery(world());
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.deepEqual(before.slice(0, 2), [SPEC, S10SPEC]);
  assert.deepEqual([...new Set(before.slice(2))].sort(), [RUNNER, S10SPEC].sort());
  assert.equal(before.includes(ART) || before.includes(REV), false, 'an artifact or review was read: ' + before.join(' '));
});
test('S12-REGEN S11 D-S11-A2: the header calls FIXED_INPUTS the initial trust inputs and names every read that precedes discovery', () => {
  const src = fsReal.readFileSync(HELPER, 'utf8');
  const header = src.slice(0, src.indexOf('*/'));
  assert.equal(/are the only files read before\s+discovery/.test(header), false, 'the header still says FIXED_INPUTS are the only files read before discovery');
  assert.match(header, /FIXED_INPUTS \(S12\.json, the parent's\s+S11\.json,\s+the runner\) are the INITIAL TRUST INPUTS/);
  assert.match(header, /the reads that precede\s+discovery are:/);
  for (const named of ['S12.json on disk', 'S11.json at the parent P', 'PARENT_ARTIFACT', 'PARENT_REVIEW', 'CANDIDATE mode', 'execution-pin targets'])
    assert(header.includes(named), 'the header does not name ' + named);
});

/* ==========================================================================
   S12 (A) - THE ANCESTOR-RELEASE WALK. The sealed S11 releases nothing; the paths S10 and S9 released are
   found by walking the chain above the parent artifact at P, each ancestor validated and bound by the
   artifact that names it before it is read, and a released path is never read and never declared.
   ========================================================================== */
const GRAND = 'rebuild/m4/spec/acceptance-s10-today-split.json';
const TODAYAPP = 'rebuild/m3/w7-preview/today/today-app.cjs';
function chained(w, grandparent, extraArtifact = {}) {   // a sealed, ACCEPTED parent naming `grandparent`
  w.at[P][ART] = JSON.stringify({ product: { [A]: sha('a0\n') }, executionPins: {},
    parent: { artifact: grandparent }, ...extraArtifact });
  w.at[P][REV] = JSON.stringify({ version: 1, status: 'ACCEPTED', receipt: null });
  return w;
}
test('S12-REGEN S12 (A): a path an ANCESTOR artifact released is dropped from the declared union, validated, and never read', () => {
  const w = chained(world(), GRAND);
  w.at[P][GRAND] = JSON.stringify({ product: {}, released: { [TODAYAPP]: { role: 'released' } } });
  w.at[P][TODAYAPP] = 'app parent\n'; w.at[HEAD][TODAYAPP] = 'app look\n'; w.disk[TODAYAPP] = 'app look\n';
  w.changed.push(TODAYAPP);
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.equal(r.reads.includes(TODAYAPP), false, 'the helper READ a released path');
  assert.match(r.out, /ancestor artifacts walked for releases \(header \(A\)\): 1 - rebuild\/m4\/spec\/acceptance-s10-today-split\.json/);
  assert.match(r.out, /released paths left undeclared \(the parent and its ancestors\): rebuild\/m3\/w7-preview\/today\/today-app\.cjs \(rebuild\/m4\/spec\/acceptance-s10-today-split\.json\)/);
  assert.equal(/today-app\.cjs: .*=>/.test(r.out), false, 'the released path was declared: ' + r.out);
  assert.deepEqual(r.reads.slice(0, 5), [SPEC, S10SPEC, ART, REV, GRAND], 'the ancestor is read after the parent artifact and review, and before discovery');
});
test('S12-REGEN S12 (A) RED CONTROL: without the ancestor walk the same released path would be read and declared new', () => {
  /* The same world with the grandparent carrying NO released block: the path is then an ordinary
     changed, undeclared file, so B5-L5 refuses it BY NAME before any read - which is exactly what the
     walk exists to replace with "released, not declared". */
  const w = chained(world(), GRAND);
  w.at[P][GRAND] = JSON.stringify({ product: {} });
  w.at[P][TODAYAPP] = 'app parent\n'; w.at[HEAD][TODAYAPP] = 'app look\n'; w.disk[TODAYAPP] = 'app look\n';
  w.changed.push(TODAYAPP);
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert(r.out.includes('REGEN-PATH-REFUSED') && r.out.includes(TODAYAPP), r.out);
  assert.equal(r.reads.includes(TODAYAPP), false);
});
for (const [label, grandparent] of [
  ['a parent outside rebuild/m4/spec/ (the chain root\'s shape)', 'rebuild/conform/v4/postfix/acceptance-step-efficacy.json'],
  ['a nested path under rebuild/m4/spec/', 'rebuild/m4/spec/LEDGER/acceptance-x.json'],
  ['a name that is not an acceptance artifact', 'rebuild/m4/spec/review-s10-today-split.json']]) {
  test('S12-REGEN S12 (A): the walk STOPS, reading nothing, at ' + label, () => {
    const w = chained(world(), grandparent);
    w.at[P][grandparent] = JSON.stringify({ product: {}, released: { [TODAYAPP]: { role: 'released' } } });
    const r = run(w);
    assert.equal(r.error, null, String(r.error && r.error.stack));
    assert.equal(r.exitCode, 0, r.out);
    assert.equal(r.reads.includes(grandparent), false, 'the helper READ ' + grandparent);
    assert.match(r.out, /ancestor artifacts walked for releases \(header \(A\)\): none/);
  });
}
test('S12-REGEN S12 (A): a chain that returns to an artifact already walked is refused BY NAME', () => {
  const w = chained(world(), GRAND);
  w.at[P][GRAND] = JSON.stringify({ product: {}, parent: { artifact: GRAND } });
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.match(r.out, /the ancestor walk returned to rebuild\/m4\/spec\/acceptance-s10-today-split\.json/);
});
test('S12-REGEN S12 (A): an ancestor the chain names but the parent commit does not hold is refused BY NAME', () => {
  const r = run(chained(world(), GRAND));
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.match(r.out, /the ancestor artifact rebuild\/m4\/spec\/acceptance-s10-today-split\.json named by the chain is not at the parent/);
});

/* ==========================================================================
   S12 (B) - --worktree. Posts from the bytes ON DISK, discovery from the worktree diff plus the
   untracked files in scope; every path still validated before any read; the protected five still never
   read; the PRODUCT MAP note says the posts are uncommitted. Without --worktree the same world is the
   S11 helper's: disk that differs from HEAD is a PROBLEM.
   ========================================================================== */
const NEWFILE = 'rebuild/m4/workout/new-cell.test.cjs';
function uncommitted(w) {
  w.disk[A] = 'a2 on disk\n';                               // edited after HEAD, not committed
  w.disk[NEWFILE] = 'brand new\n'; w.untracked = [NEWFILE]; // a new file, not tracked yet
  editSpec(w, (s) => { s.product[NEWFILE] = { pre: 'PENDING', post: 'PENDING', role: 'new' }; });
  return w;
}
test('S12-REGEN S12 (B): --worktree measures the uncommitted bytes ON DISK, finds the untracked file, and says so', () => {
  const r = run(uncommitted(world()), ['--parent', 'fake', '--worktree']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  assert.match(r.out, /\+ THE UNCOMMITTED WORKING TREE \(--worktree\)/);
  const h = sha('a2 on disk\n').slice(0, 8), n = sha('brand new\n').slice(0, 8);
  assert(r.out.includes('rebuild/m4/workout/a.cjs: edited ') && r.out.includes('->' + h), 'the post is not the disk bytes: ' + r.out);
  assert(r.out.includes(NEWFILE + ': new PENDING->PENDING  =>  new null->' + n), 'the untracked file was not measured as new: ' + r.out);
  assert.equal(/PROBLEM/.test(r.out), false, r.out);
});
test('S12-REGEN S12 (B) RED CONTROL: WITHOUT --worktree the same uncommitted tree is a PROBLEM (commit first)', () => {
  const w = uncommitted(world());
  w.at[HEAD][NEWFILE] = 'brand new\n';                       // tracked at HEAD here, so the only fault is A
  const r = run(w);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 1, r.out);
  assert.match(r.out, /PROBLEM disk differs from HEAD \(commit first\): rebuild\/m4\/workout\/a\.cjs/);
});
test('S12-REGEN S12 (B): --worktree --write writes the posts it measured and the PRODUCT MAP note names the uncommitted tree', () => {
  const w = sealed(uncommitted(world()), 'ACCEPTED'); w.allowWrite = true;
  const r = run(w, ['--parent', 'fake', '--worktree', '--write', '--receipt-line', '896']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 0, r.out);
  const s = JSON.parse(w.disk[SPEC]);
  assert.equal(s.product[A].post, sha('a2 on disk\n'));
  assert.deepEqual(s.product[NEWFILE], { pre: null, post: sha('brand new\n'), role: 'new' });
  assert.equal(s.parent.options[0].receiptLedgerLine, 896);
  const note = s.notes.find((x) => x.startsWith('PRODUCT MAP'));
  assert.match(note, /ON DISK in the UNCOMMITTED working tree over HEAD/);
  assert.match(note, /must print "0 entr\(ies\) would change"/);
});
test('S12-REGEN S12 (B): --worktree still refuses an UNDECLARED untracked file BY NAME before any content read', () => {
  const w = world(); const f = 'rebuild/m4/workout/stray.cjs';
  w.disk[f] = 'stray\n'; w.untracked = [f];
  refusedBeforeRead(run(w, ['--parent', 'fake', '--worktree']), f, NOT_REVIEWED, FIXED);
});
test('S12-REGEN S12 (B): --worktree still refuses a forbidden untracked name BY NAME before any read', () => {
  const w = world(); const f = 'rebuild/m4/spec/LEDGER/synthetic.json';
  w.disk[f] = 'x\n'; w.untracked = [f];
  const r = run(w, ['--parent', 'fake', '--worktree']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.reads.includes(f), false);
  assert.equal(r.exitCode, 2, r.out);
  assert.match(r.out, /forbidden set/);
});
test('S12-REGEN S12 (B): --worktree never reads a protected file and still refuses one that moved', () => {
  const r = run(protectedWorld('synthetic protected moved\n'), ['--parent', 'fake', '--worktree']);
  assert.equal(r.error, null, String(r.error && r.error.stack));
  assert.equal(r.exitCode, 2, r.out);
  assert.equal(r.reads.includes(MIG), false, 'the helper READ a protected engine file');
  assert.match(r.out, /protected engine file changed between the parent and HEAD, or is dirty: rebuild\/engine\/migrate\.cjs/);
});
test('S12-REGEN S12 SCOPE: the four exact files S12 adds are admitted, and the look workflow by identity only', () => {
  const src = fsReal.readFileSync(HELPER, 'utf8');
  for (const exact of ['rebuild/lanes/b/S11-NATIVE-LOAD-BRIEF.md', 'rebuild/lanes/b/S12-REGEN.cjs', 'rebuild/lanes/b/S12-REGEN.test.cjs', '.github/workflows/look-gates.yml'])
    assert(src.includes("'" + exact + "'"), 'SCOPE lacks ' + exact);
  const w = world(); const f = '.github/workflows/other.yml';
  w.at[HEAD][f] = 'x\n'; w.disk[f] = 'x\n'; w.changed.push(f);
  const r = run(w);
  assert.equal(r.exitCode, 2, r.out);
  assert(r.out.includes(f + ' (outside the S12 product scope)'), r.out);
});
