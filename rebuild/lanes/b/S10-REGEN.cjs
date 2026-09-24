'use strict';
/* S10-REGEN (D-S10I-7, REVIEW-S10-INTEGRATION-l1; B5 and D-REGEN-INPUT of Astra S10-INTEGRATION-
   REVIEW-L2). ONE COMMAND, RUN AFTER S10 IS MERGE-FORWARDED (never rebased, brief 12.12) ONTO THE
   SEALED S9 PARENT:

     node rebuild/lanes/b/S10-REGEN.cjs --parent <S9_PARENT_COMMIT> [--receipt-line N] [--write [--allow-stale-notes]]

   It re-measures, AT THE PARENT COMMIT, every value of packages/S10.json that the S9 seal moves:
   every product `pre` (from the sealed artifact's product map), the pre of every S9 execution pin
   S10 changes (packages/S9.json above all, role superseded-by-child), parent.options[0].sha256 and
   reviewSha256, sourceBase, and tooling.runnerSha256; every `post` is re-measured at HEAD. It also
   re-measures D-SPLIT-PARENT (brief 3.1): the three sourceBlobs.s9 of regions.json at the parent.
   Children, coverage and authorizations are CARRIED from the S10.json on disk, never authored.
   NOTES (D-S10I-10): the three notes whose content IS a parent measurement - PRODUCT MAP, the
   parent-unpinned paths and the superseded execution pins - are REGENERATED from the values this
   run measures. Every other note is carried, and any carried note that still cites the S9
   candidate (6dc2596, its S9.json bytes a1f9fa38, or the word CANDIDATE) is FLAGGED; --write
   refuses while one is flagged unless --allow-stale-notes is given, and then prints the list.
   --receipt-line is REQUIRED with --write: parent.options[0].receiptLedgerLine is the S9 receipt's
   ledger coordinate, a parent binding the runner re-reads (it is optional only for a dry run).

   THE PATH BOUNDARY (B5). Nothing is read outside a POSITIVE, reviewed scope:
   (1) SCOPE below is the fixed list of S10 product roots (every declared S10 path, every S9 product
       and execution pin, measured to lie under one of them); FIXED_INPUTS are the only files read
       before discovery, and they are validated first.
   (2) Discovery is `git diff --name-only <P> HEAD -- <SCOPE...>`, never an unscoped diff; every
       git call that names a path passes it after an explicit `--` (ls-tree), and blob bytes are read
       only by object id (cat-file) after that path passed validation.
   (3) EVERY path - from the specs, the artifact, the execution pins and the diff - is validated
       BEFORE ANY READ OF ANY OF THEM: inside SCOPE; no absolute path, `..`, backslash or control
       character; not in the forbidden set (src/, rebuild/conform/private, any ledger/ directory, any
       *soak* name); admitted by the positive name rule (no dot-name, credential or key file name, or
       key container extension, and a file type S10 or its parent declares: B5 L4 below); a regular
       file mode in Git (never a symlink 120000 or submodule 160000) at the parent and at HEAD where
       present; and on disk neither the file nor any directory above it
       inside the repository is a symlink or junction. One failure refuses the whole run by name.
   (4) The protected five (rebuild/engine/seed, migrate, merge, index, oracle-shim) are NEVER read:
       their post is their pre only if Git holds the same object id at the parent and at HEAD and
       the working tree is clean for them; otherwise the run refuses.
   D-REGEN-INPUT: --write also requires the parent's review envelope to be status ACCEPTED, and a
   parent-released path is excluded from the WHOLE declared union, not only from the diff.
   Without --write it is a DRY RUN and writes nothing. It loads no engine module. */
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), crypto = require('node:crypto');
const REPO = path.resolve(__dirname, '..', '..', '..');
const SPEC = 'rebuild/lanes/b/tooling/packages/S10.json', S9SPEC = 'rebuild/lanes/b/tooling/packages/S9.json';
const RUNNER = 'rebuild/lanes/b/tooling/b-package.cjs', REGIONS = 'rebuild/lanes/c/today-split-spike/regions.json';
const SCOPE = ['.github/workflows/rebuild.yml', '.github/workflows/shared-preflight.yml', 'rebuild/engine/',
  'rebuild/lanes/b/S10-REGEN.cjs', 'rebuild/lanes/b/S10-REGEN.test.cjs', 'rebuild/lanes/b/S9-UI-PINS-BRIEF.md', 'rebuild/lanes/b/tooling/',
  'rebuild/lanes/c/p3-today-hotfix/', 'rebuild/lanes/c/passphrase-normalize/', 'rebuild/lanes/c/s9-today-carry/',
  'rebuild/lanes/c/today-split-spike/', 'rebuild/lanes/c/today-split/', 'rebuild/lanes/c/ui-port/',
  'rebuild/lanes/d/b-lom/', 'rebuild/lanes/d/f2/', 'rebuild/lanes/d/import-retract/', 'rebuild/lanes/d/p3-capture-start/',
  'rebuild/lanes/d/p3-followons/', 'rebuild/lanes/d/p3-layout-v2/', 'rebuild/lanes/d/p3-port-fix/',
  'rebuild/lanes/d/p3-real-shape/', 'rebuild/lanes/d/p3-replay-all/', 'rebuild/lanes/d/p3-replay-measure/',
  'rebuild/lanes/d/plan-edit/', 'rebuild/lanes/tooling/test/', 'rebuild/m1/MOCK.md', 'rebuild/m1/approved-2026-09-08/',
  'rebuild/m3/setup/port/', 'rebuild/m3/w6/host/', 'rebuild/m3/w6/local/', 'rebuild/m3/w6/test/', 'rebuild/m3/w7-preview/',
  'rebuild/m4/import/', 'rebuild/m4/spec/', 'rebuild/m4/workout/'];
const PROTECTED = new Set(['seed', 'migrate', 'merge', 'index', 'oracle-shim'].map((n) => 'rebuild/engine/' + n + '.cjs'));
const FORBIDDEN = [/(^|\/)src\//, /^rebuild\/conform\/private(\/|$)/, /(^|\/)ledger\//, /soak/i];
/* B5 RESIDUAL (Astra S10-INTEGRATION-REVIEW-L3). The forbidden set and the protected five are
   matched under FILESYSTEM EQUIVALENCE, not byte equality: every segment is compared lower-cased
   with trailing dots and spaces stripped (how Windows resolves a name), so LEDGER/, Ledger/,
   ledger./, SRC/, SEED.cjs or seed.cjs. cannot slip past a lower-case pattern. Two spellings are
   refused outright because they name something other than what they spell: an 8.3 short name
   (a segment containing ~ followed by a digit) and an alternate data stream (a colon in a
   segment). A segment that ends in a dot or a space is also refused outright: no S10 path is
   spelled that way, and the canonical match above already covers what it would alias.
   AUTH EXCLUSION: a segment named auth.json or .credentials, or matching auth|credential|token|
   secret (case-insensitive), is refused under every allowed root unless the full path is in
   AUTH_ALLOWLIST - the paths S10.json (and the S9 product and execution pins) already declare
   that match. Measured at ac79eab: none does, so the list is empty. */
const AUTH_SEGMENT = /auth|credential|token|secret/i;
const AUTH_ALLOWLIST = new Set([]);
/* B5 RESIDUAL, L4 (Astra S10-INTEGRATION-REVIEW-L4): POSITIVE ADMISSION FOR A CONTENT READ. A word
   list is not the no-auth contract (.netrc, _netrc and .ssh/id_ed25519 match none of the four words
   above), so after every refusal above, kept in its order, a path under an allowed root is admitted
   only if ALL of these hold (admission() below; segments compared lower-cased):
   (a) no segment is a dot-name (.netrc, .ssh, .aws, .git*, .npmrc, .pypirc, ...): credential and tool
       configuration live in dot-files and dot-directories;
   (b) no segment, nor a segment without its final extension, is a standard credential or key file
       name (CREDENTIAL_NAMES);
   (c) no dotted part of any segment is a key or secret container extension (KEY_EXT), so signing.pem,
       signing.pem.json and certs.p12/ are all refused;
   (d) the file's final extension is in ADMITTED_EXT, the file types that S10.json and the parent
       S9.json product sets actually contain, measured at 62788b1 (S9.json at 6dc2596 and at HEAD):
       S10.product 296 paths .cjs 163 .mjs 113 .json 13 .md 3 .yml 2 .html 2; S9.product 255 paths
       .cjs 134 .mjs 105 .json 9 .yml 2 .html 2 .md 2 .css 1. A name with no extension is refused.
   EXACT REVIEWED FILES (PM ruling on S10-INTEGRATION-REPORT.md Round 9): (a) does not apply to a
   path EQUAL to an exact-file SCOPE entry (SCOPE without a trailing slash), and to nothing else: that
   admits .github/workflows/rebuild.yml and .github/workflows/shared-preflight.yml, which S10
   declares, by identity; any other path with a .github segment (or any dot-name) is refused, and
   (b)-(d) still apply to the exact files. All 309 names S10-REGEN validates at the real repository
   (declared, parent, execution, fixed, artifact, split and changed) pass (a)-(d). */
const CREDENTIAL_NAMES = new Set(['_netrc', 'netrc', '.netrc', 'credentials', 'known_hosts', 'authorized_keys', 'authorized_keys2',
  ...['id_rsa', 'id_dsa', 'id_ecdsa', 'id_ed25519', 'id_ecdsa_sk', 'id_ed25519_sk'].flatMap((k) => [k, k + '.pub']),
  '.git-credentials', '.gitconfig', '.htpasswd', '.pypirc', '.npmrc', '.pgpass', '.dockercfg']);
const KEY_EXT = new Set(['pem', 'key', 'p12', 'pfx', 'kdbx', 'ppk', 'asc', 'gpg', 'jks', 'keystore']);
const ADMITTED_EXT = new Set(['.cjs', '.css', '.html', '.json', '.md', '.mjs', '.yml']);
const EXACT_REVIEWED = new Set(SCOPE.filter((r) => !r.endsWith('/')));
function admission(segs) {
  const exact = EXACT_REVIEWED.has(segs.join('/'));
  for (const s of segs) {
    const c = s.toLowerCase(), stem = c.lastIndexOf('.') > 0 ? c.slice(0, c.lastIndexOf('.')) : c;
    if (c.startsWith('.') && !exact) return 'a dot-name segment (' + s + ')';
    if (CREDENTIAL_NAMES.has(c) || CREDENTIAL_NAMES.has(stem)) return 'a credential or key file name (' + s + ')';
    const x = c.split('.').slice(1).find((p) => KEY_EXT.has(p));
    if (x) return 'a key or secret container extension (.' + x + ' in ' + s + ')';
  }
  const last = segs[segs.length - 1].toLowerCase(), i = last.lastIndexOf('.');
  const ext = i > 0 ? last.slice(i) : '';
  if (!ADMITTED_EXT.has(ext)) return 'extension ' + (ext || '(none)') + ' is not one S10 or its S9 parent declares (' + [...ADMITTED_EXT].join(' ') + ')';
  return null;
}
const canonSeg = (s) => s.toLowerCase().replace(/[. ]+$/, '');
const CANON_PROTECTED = new Set([...PROTECTED].map((f) => f.split('/').map(canonSeg).join('/')));
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const git = (a) => cp.execFileSync('git', a, { cwd: REPO, maxBuffer: 1e9, stdio: ['ignore', 'pipe', 'ignore'] });
const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const WRITE = process.argv.includes('--write');
const fail = (m) => { console.error('S10-REGEN REFUSED: ' + m); process.exit(2); };
if (WRITE && !/^[1-9][0-9]*$/.test(arg('--receipt-line') || ''))
  fail('--write needs --receipt-line N (the S9 receipt ledger line, parent.options[0].receiptLedgerLine); the runner re-reads that line');

// ---- (3) validation, used before every read -------------------------------------------------
const inScope = (f) => SCOPE.some((r) => (r.endsWith('/') ? f.startsWith(r) : f === r));
function shape(f) {
  if (typeof f !== 'string' || !f || f.startsWith('/') || /^[A-Za-z]:/.test(f) || f.includes('\\') || /[\x00-\x1f]/.test(f)
    || f.split('/').some((s) => s === '..' || s === '.' || s === '')) return 'not a plain repository-relative path';
  const segs = f.split('/');
  if (segs.some((s) => s.includes(':'))) return 'an alternate-data-stream spelling (colon in a segment)';
  if (segs.some((s) => /~[0-9]/.test(s))) return 'an 8.3 short-name spelling';
  if (segs.some((s) => /[. ]$/.test(s))) return 'a segment ending in a dot or a space';
  const canon = segs.map(canonSeg).join('/');
  if (FORBIDDEN.some((re) => re.test(f) || re.test(canon))) return 'in the forbidden set';
  if (CANON_PROTECTED.has(canon) && !PROTECTED.has(f)) return 'an alternate spelling of a protected engine file';
  if (!inScope(f)) return 'outside the S10 product scope';
  if (!AUTH_ALLOWLIST.has(f) && segs.some((s) => ['auth.json', '.credentials'].includes(canonSeg(s)) || AUTH_SEGMENT.test(s)))
    return 'an auth-shaped name under an allowed root (auth.json, .credentials, auth|credential|token|secret)';
  const refused = admission(segs);
  if (refused) return 'not admitted for a content read: ' + refused;
  return null;
}
const entryCache = new Map();
function prefetch(rev, paths) {          // metadata only: mode and object id, explicit paths after --
  const todo = paths.filter((f) => !entryCache.has(rev + ':' + f));
  for (let i = 0; i < todo.length; i += 150) {
    const chunk = todo.slice(i, i + 150);
    for (const f of chunk) entryCache.set(rev + ':' + f, null);
    for (const line of git(['ls-tree', '--full-tree', rev, '--', ...chunk]).toString().split('\n').filter(Boolean)) {
      const m = /^(\d{6}) (\w+) ([0-9a-f]{40})\t(.*)$/.exec(line);
      if (!m) continue;
      if (entryCache.has(rev + ':' + m[4])) entryCache.set(rev + ':' + m[4], { mode: m[1], type: m[2], oid: m[3] });
    }
  }
}
function treeEntry(rev, f) { if (!entryCache.has(rev + ':' + f)) prefetch(rev, [f]); return entryCache.get(rev + ':' + f); }
function diskLinks(f) {                  // the file and every directory above it inside the repository
  const parts = f.split('/');
  for (let i = 1; i <= parts.length; i++) {
    let st = null; try { st = fs.lstatSync(path.join(REPO, ...parts.slice(0, i))); } catch { return null; }
    if (st.isSymbolicLink()) return parts.slice(0, i).join('/');
  }
  return null;
}
const validated = new Map();
function validate(f, revs) {
  const why = shape(f);
  if (why) return why;
  for (const rev of revs) {
    const e = treeEntry(rev, f);
    if (e && (e.bad || e.type !== 'blob' || !['100644', '100755'].includes(e.mode)))
      return 'not a regular file in Git at ' + String(rev).slice(0, 7) + ' (' + (e.bad || e.mode + ' ' + e.type) + ')';
    validated.set(rev + ':' + f, e);
  }
  const link = diskLinks(f);
  if (link) return 'a symlink or junction on disk at ' + link;
  return null;
}
function validateAll(paths, revs, label) {
  const bad = [];
  const shaped = paths.filter((f) => !shape(f));
  for (const rev of revs) prefetch(rev, [...new Set(shaped)]);
  for (const f of paths) { const why = validate(f, revs); if (why) bad.push(f + ' (' + why + ')'); }
  if (bad.length) fail('REGEN-PATH-REFUSED ' + label + ': ' + bad.slice(0, 10).join('; ') + (bad.length > 10 ? ' ... ' + bad.length : ''));
}
// Reads happen ONLY through these two, and only for a path validate() accepted at that revision.
function blobAt(rev, f) {
  if (PROTECTED.has(f)) throw new Error('S10-REGEN never reads a protected engine file: ' + f);
  if (!validated.has(rev + ':' + f)) throw new Error('S10-REGEN read before validation: ' + rev + ':' + f);
  const e = validated.get(rev + ':' + f);
  return e ? cp.execFileSync('git', ['cat-file', 'blob', e.oid], { cwd: REPO, maxBuffer: 1e9 }) : null;
}
function diskAt(f) {
  if (PROTECTED.has(f)) throw new Error('S10-REGEN never reads a protected engine file: ' + f);
  if (!validated.has('HEAD:' + f)) throw new Error('S10-REGEN disk read before validation: ' + f);
  try { return fs.readFileSync(path.join(REPO, ...f.split('/'))); } catch { return null; }
}
const shaAt = (rev, f) => { const b = blobAt(rev, f); return b === null ? null : sha(b); };

// ---- (1) the parent and the fixed inputs, validated first --------------------------------------
const P = (() => { const p = arg('--parent'); if (!p) fail('--parent <S9_PARENT_COMMIT> is required');
  try { return git(['rev-parse', '--verify', p + '^{commit}']).toString().trim(); } catch { fail('not a commit: ' + p); } })();
try { git(['merge-base', '--is-ancestor', P, 'HEAD']); } catch { fail('the parent ' + P.slice(0, 7) + ' is not an ancestor of HEAD; merge-forward first, never rebase'); }
const HEADSHA = git(['rev-parse', 'HEAD']).toString().trim();
validateAll([SPEC, S9SPEC, RUNNER, REGIONS], [P, 'HEAD'], 'fixed input');
const S10 = JSON.parse(diskAt(SPEC).toString('utf8'));
const s9raw = blobAt(P, S9SPEC); if (!s9raw) fail('no ' + S9SPEC + ' at the parent');
const S9 = JSON.parse(s9raw.toString('utf8'));
const option = S10.parent.options.find((o) => o.id === 'S9') || fail('S10.json names no S9 parent option');
validateAll([option.artifact, option.review], [P], 'parent artifact');
const artRaw = blobAt(P, option.artifact), revRaw = blobAt(P, option.review);
const pinOf = (e, f) => { if (typeof e === 'string') return e; if (e && typeof e === 'object' && 'pre' in e && 'post' in e) return e.post === null ? e.pre : e.post; fail('parent pin shape ' + f); };

let pmap, epins, mode, parentReleased;
if (artRaw) {
  const art = JSON.parse(artRaw.toString('utf8')); mode = 'SEALED ARTIFACT ' + option.artifact + ' ' + sha(artRaw).slice(0, 12);
  pmap = Object.fromEntries(Object.entries(art.product || {}).map(([f, e]) => [f, pinOf(e, f)]));
  epins = { ...(art.executionPins || {}) };
  parentReleased = new Set(Object.keys(art.released || {}));
  if (WRITE) {                                            // D-REGEN-INPUT: an ACCEPTED parent only
    let review = null; try { review = revRaw && JSON.parse(revRaw.toString('utf8')); } catch { review = null; }
    if (!review || review.status !== 'ACCEPTED') fail('the parent review ' + option.review + ' is not an ACCEPTED envelope at ' + P.slice(0, 7));
  }
} else {
  if (WRITE) fail('no sealed S9 artifact ' + option.artifact + ' at ' + P.slice(0, 7) + '; --write needs the seal, a dry run does not');
  mode = 'CANDIDATE (no artifact at the parent): pre from S9.json posts, execution pins recomputed as proposed() would';
  pmap = Object.fromEntries(Object.entries(S9.product).filter(([, v]) => v.role !== 'released').map(([f, v]) => [f, v.post]));
  const targets = [RUNNER, S9SPEC, ...(S9.brief && S9.brief.file ? [S9.brief.file] : [])];
  for (const c of S9.children) for (const a of c.argv) if (!a.startsWith('--')) targets.push(a);
  validateAll([...new Set(targets)], [P], 'parent execution pin');
  epins = {};
  for (const t of new Set(targets)) { const e = validated.get(P + ':' + t); if (e) epins[t] = PROTECTED.has(t) ? null : shaAt(P, t); }
  parentReleased = new Set(Object.entries(S9.product).filter(([, v]) => v.role === 'released').map(([f]) => f));
}

// ---- (2) discovery, scoped; then EVERY path validated before any product read ---------------------
const changed = git(['diff', '--name-only', P, 'HEAD', '--', ...SCOPE]).toString().split('\n').filter(Boolean);
validateAll([...Object.keys(S10.product), ...Object.keys(pmap), ...Object.keys(epins), ...changed], [P, 'HEAD'], 'declared or changed');
const candidates = [...Object.keys(S10.product), ...Object.keys(pmap),
  ...changed.filter((f) => f !== SPEC && (!f.endsWith('.md') || f.startsWith('rebuild/engine/')))];
const droppedReleased = [...new Set(candidates.filter((f) => parentReleased.has(f)))].sort();
const declared = new Set(candidates.filter((f) => !parentReleased.has(f)));

function protectedPost(f) {                                 // never read: object ids and status only
  const a = validated.get(P + ':' + f), b = validated.get('HEAD:' + f);
  const dirty = git(['status', '--porcelain', '--', f]).toString().trim();
  if (!a || !b || a.oid !== b.oid || dirty) fail('protected engine file changed between the parent and HEAD, or is dirty: ' + f);
  return pmap[f] || null;
}
const product = {}, moves = [], problems = [], parentUnpinned = [];
for (const f of [...declared].sort()) {
  const was = S10.product[f];
  const post = PROTECTED.has(f) ? protectedPost(f) : shaAt('HEAD', f);
  if (was && was.role === 'released') {
    if (!Object.hasOwn(pmap, f)) problems.push('released path is not a parent product pin: ' + f);
    product[f] = { pre: pmap[f] || null, post: null, role: 'released' };
  } else if (post === null) { problems.push('declared path absent at HEAD: ' + f); continue; }
  else if (Object.hasOwn(pmap, f)) product[f] = { pre: pmap[f], post, role: pmap[f] === post ? 'carried' : 'edited' };
  else if (Object.hasOwn(epins, f)) { if (epins[f] === post && !was) continue; product[f] = { pre: epins[f], post, role: 'superseded-by-child' }; }
  else { if (validated.get(P + ':' + f)) parentUnpinned.push(f); product[f] = { pre: null, post, role: 'new' }; }
  if (!was || was.pre !== product[f].pre || was.post !== product[f].post || was.role !== product[f].role)
    moves.push(f + ': ' + (was ? was.role + ' ' + String(was.pre).slice(0, 8) + '->' + String(was.post).slice(0, 8) : 'undeclared') +
      '  =>  ' + product[f].role + ' ' + String(product[f].pre).slice(0, 8) + '->' + String(product[f].post).slice(0, 8));
}
for (const f of Object.keys(S10.product)) if (!Object.hasOwn(product, f)) moves.push(f + ': dropped' + (parentReleased.has(f) ? ' (released by the parent)' : ' (an unchanged execution pin needs no declaration)'));
for (const [f, p] of Object.entries(product)) if (p.role !== 'released' && p.post !== null && !PROTECTED.has(f)) {
  const disk = diskAt(f);
  if (disk === null || sha(disk) !== p.post) problems.push('disk differs from HEAD (commit first): ' + f);
}

// D-SPLIT-PARENT (brief 3.1), at the parent: object ids only.
const regions = JSON.parse(diskAt(REGIONS).toString('utf8'));
const findKey = (o, k) => { if (!o || typeof o !== 'object') return null; if (Object.hasOwn(o, k)) return o[k]; for (const v of Object.values(o)) { const r = findKey(v, k); if (r) return r; } return null; };
const blobs = (findKey(regions, 'sourceBlobs') || {}).s9 || fail('regions.json carries no sourceBlobs.s9');
validateAll(Object.values(blobs).map((b) => b.path), [P], 'D-SPLIT-PARENT source');
const split = Object.values(blobs).map(({ path: f, oid }) => { const e = validated.get(P + ':' + f); return { f, oid, got: e ? e.oid : null, ok: !!e && e.oid === oid }; });

const roles = {}; for (const p of Object.values(product)) roles[p.role] = (roles[p.role] || 0) + 1;
console.log('S10-REGEN ' + (WRITE ? 'WRITE' : 'DRY RUN') + ' at parent ' + P + ' / HEAD ' + HEADSHA);
console.log('  mode: ' + mode);
console.log('  scope: ' + SCOPE.length + ' reviewed roots; ' + validated.size + ' path/revision pair(s) validated before any product read; ' + changed.length + ' changed path(s) in scope');
console.log('  product: ' + Object.keys(product).length + ' paths ' + JSON.stringify(roles) + '; ' + moves.length + ' entr(ies) would change');
for (const m of moves.slice(0, 40)) console.log('    ' + m);
if (moves.length > 40) console.log('    ... ' + (moves.length - 40) + ' more');
console.log('  parent-released paths left undeclared: ' + ([...parentReleased].sort().join(' ') || 'none') + (droppedReleased.length ? '; dropped from the declared union: ' + droppedReleased.join(' ') : ''));
console.log('  parent-unpinned paths declared new (DECISIONS:792): ' + parentUnpinned.length + (parentUnpinned.length ? ' - ' + parentUnpinned.join(' ') : ''));
console.log('  S9.json execution-pin pre at the parent: ' + String(epins[S9SPEC]).slice(0, 12) + (product[S9SPEC] ? ' (declared ' + product[S9SPEC].role + ')' : ' (unchanged, not declared)'));
console.log('  parent.options[0]: artifact sha256 ' + (artRaw ? sha(artRaw) : 'ABSENT') + ', review sha256 ' + (revRaw ? sha(revRaw) : 'ABSENT') +
  ', receiptLedgerLine ' + (arg('--receipt-line') || 'not given'));
console.log('  runnerSha256 at HEAD ' + shaAt('HEAD', RUNNER));
for (const s of split) console.log('  D-SPLIT-PARENT ' + (s.ok ? 'EQUAL ' : 'STOP  ') + s.f + ' expected ' + s.oid + ' at parent ' + s.got);
for (const p of problems) console.log('  PROBLEM ' + p);
if (split.some((s) => !s.ok)) problems.push('D-SPLIT-PARENT');

// D-S10I-10: regenerate the measured notes; flag the carried ones that still cite the candidate.
const execSup = Object.entries(product).filter(([, p]) => p.role === 'superseded-by-child').map(([f, p]) => f + ' pre ' + p.pre + ' post ' + p.post);
const MEASURED = [
  ['PRODUCT MAP', 'PRODUCT MAP (regenerated by rebuild/lanes/b/S10-REGEN.cjs at parent ' + P + '). pre is the parent pin read at that commit (' + mode + '); post is sha256 of the bytes at HEAD ' + HEADSHA + '. Parent-released paths are not declared: ' + ([...parentReleased].sort().join(', ') || 'none') + '. New paths are every path HEAD changed since the parent, inside the S10 product scope, that the parent does not pin, except Markdown reports outside rebuild/engine/ and this spec itself; tracked Markdown under rebuild/engine/ is declared because the engine-inventory cells walk every tracked file there. Roles: ' + JSON.stringify(roles) + '.'],
  ['PARENT-UNPINNED PATHS', 'PARENT-UNPINNED PATHS (regenerated at ' + P + '): ' + parentUnpinned.length + ' path(s) existed at the parent pinned by neither its product map nor its execution pins and change here, so they are declared role new with pre null (DECISIONS:792): ' + (parentUnpinned.join(', ') || 'none') + '.'],
  ['EXECUTION PIN SUPERSEDED', 'EXECUTION PIN SUPERSEDED (regenerated at ' + P + '): the parent execution pins this package changes, each declared superseded-by-child with the pre measured at the parent: ' + (execSup.join('; ') || 'none') + '.']];
const OLD_PREFIX = { 'PRODUCT MAP': ['PRODUCT MAP'], 'PARENT-UNPINNED PATHS': ['PARENT-UNPINNED PATHS', 'SEVEN PATHS'], 'EXECUTION PIN SUPERSEDED': ['EXECUTION PIN SUPERSEDED'] };
const notes = S10.notes.slice(), refreshed = [];
for (const [key, text] of MEASURED) {
  const i = notes.findIndex((n) => OLD_PREFIX[key].some((p) => n.startsWith(p)));
  if (i >= 0) notes[i] = text; else notes.push(text);
  refreshed.push(key + (i >= 0 ? ' [' + i + ']' : ' [appended]'));
}
const stale = notes.map((n, i) => [n, i]).filter(([n]) => /6dc2596|a1f9fa38|CANDIDATE/.test(n) && !MEASURED.some(([, t]) => t === n)).map(([n, i]) => '[' + i + '] ' + n.slice(0, 70));
console.log('  notes regenerated: ' + refreshed.join(', '));
for (const s of stale) console.log('  STALE NOTE (still cites the S9 candidate; re-author it) ' + s);
if (!WRITE) { console.log('DRY RUN: nothing written'); process.exit(problems.length ? 1 : 0); }
if (problems.length) fail(problems.length + ' problem(s) above');
if (stale.length && !process.argv.includes('--allow-stale-notes')) fail(stale.length + ' carried note(s) still cite the S9 candidate (listed above); re-author them, or pass --allow-stale-notes to write and keep the list');
S10.sourceBase = P;
S10.parent.decided = true; S10.parent.chosen = 'S9';
option.sha256 = sha(artRaw); option.reviewSha256 = revRaw ? sha(revRaw) : null;
option.receiptLedgerLine = Number(arg('--receipt-line'));
S10.notes = notes;
S10.tooling.runnerSha256 = shaAt('HEAD', RUNNER);
S10.product = product;
fs.writeFileSync(path.join(REPO, SPEC), JSON.stringify(S10, null, 2) + '\n');
console.log('WROTE ' + SPEC + ' ' + sha(fs.readFileSync(path.join(REPO, SPEC))));
