'use strict';
/* S12-REGEN (M2-S12-LOOK, the PM's route A of DECISIONS:904: an UNSEALED child of the sealed S11, run
   with --ci). The port of rebuild/lanes/b/S11-REGEN.cjs (a283b778; itself the port of S10-REGEN.cjs,
   Astra S10-INTEGRATION-REVIEW-L2..L5 B5, D-REGEN-INPUT, D-S11-A1, D-S11-A2) to S12 over the SEALED S11
   parent (DECISIONS:896-897, seal tip 7c79ef1). ONE COMMAND, RUN AFTER S12 IS MERGE-FORWARDED (never
   rebased, DECISIONS:563) ONTO THE SEALED S11 PARENT:

     node rebuild/lanes/b/S12-REGEN.cjs --parent <S11_PARENT_COMMIT> [--worktree] [--receipt-line N] [--write [--allow-stale-notes]]

   It re-measures, AT THE PARENT COMMIT, every value of packages/S12.json that the S11 seal fixes:
   every product `pre` (from the sealed S11 artifact's product map), the pre of every S11 execution pin
   S12 changes (role superseded-by-child), parent.options[0].sha256 and reviewSha256, sourceBase and
   tooling.runnerSha256; every `post` is re-measured at HEAD. Children, coverage and authorizations are
   CARRIED from the S12.json on disk, never authored. The three notes whose content IS a parent
   measurement - PRODUCT MAP, the parent-unpinned paths and the superseded execution pins - are
   REGENERATED; every other note is carried, and a carried note that still makes a draft-time claim (the
   S11 helper's STALE pattern, unchanged) is FLAGGED; --write refuses while one is flagged unless
   --allow-stale-notes is given. --receipt-line is REQUIRED with --write (parent.options[0].
   receiptLedgerLine, the S11 receipt's ledger coordinate, DECISIONS:896). The PENDING census is
   S11-REGEN's, unchanged in kind (D-S11-A1: every path, no cap): printed on disk before any fill, and
   after the fill on --write; the values this helper does not own (THEME, the brief citation, every
   needle) are the PM's and are LISTED, never refused and never invented here.

   TWO THINGS ARE NEW IN S12, and each is a reviewed difference from S11-REGEN, not a widening of it.
   (A) ANCESTOR RELEASES. S11-REGEN dropped the paths its PARENT artifact released. The sealed S11
       releases nothing, so the paths released further up - rebuild/m3/w7-preview/today/today-app.cjs and
       gym-app.mjs (S10, DECISIONS:828) and preview.css and build.mjs (S9, DECISIONS:786) - would read
       here as changed, unpinned paths and be declared `new`, which RE-SEALS presentation files the
       owner's rulings took out of the sealed inventory. So the helper walks the sealed chain from the
       parent artifact through each artifact's own parent.artifact, AT THE PARENT COMMIT, reading only
       paths of the shape rebuild/m4/spec/acceptance-<slug>.json (each validated and bound into REVIEWED
       by the artifact that names it, before it is read), and drops the UNION of their `released` blocks
       from the whole declared union. The walk stops at the first parent that is not of that shape (the
       release role exists only since S9, and the chain's root, acceptance-step-efficacy.json, stands
       outside rebuild/m4/spec/) and is bounded at ANCESTOR_HOPS; a released path is never read.
   (B) --worktree, for authoring BEFORE the commit. A builder seat may not commit, so S12.json is first
       written from the WORKING TREE: discovery is `git diff --name-only <P> -- <SCOPE...>` (the
       worktree against the parent) plus `git ls-files --others --exclude-standard -- <SCOPE...>` (new
       files not yet tracked), and every post is sha256 of the bytes ON DISK. Every path is still
       validated before any read (a path absent at HEAD is allowed only in this mode, and only because
       it is new), the protected five are still never read and must still be byte-identical and clean,
       and the PRODUCT MAP note SAYS the posts were measured on an uncommitted working tree. The proof
       that the result is the committed truth is the run WITHOUT --worktree after the commit: a dry run
       there must print "0 entr(ies) would change". Without --worktree the helper is S11-REGEN's: posts
       at HEAD, and any disk that differs from HEAD is a PROBLEM (commit first).

   THE PATH BOUNDARY (B5, carried from S11-REGEN unchanged in kind). Nothing is read outside a POSITIVE,
   reviewed scope:
   (1) SCOPE below is S11-REGEN's 40 entries verbatim plus four exact files: the S11 brief of record
       (rebuild/lanes/b/S11-NATIVE-LOAD-BRIEF.md, an execution pin of the parent artifact), this helper
       and its test, and .github/workflows/look-gates.yml (the look's own workflow, declared by S12;
       admitted by identity as the two other exact workflow files are). Every run prints the count of
       entries and of path/revision pairs it validated. FIXED_INPUTS (S12.json, the parent's S11.json,
       the runner) are the INITIAL TRUST INPUTS: they are validated first, before any read. In order,
       the reads that precede discovery are: S12.json on disk and S11.json at the parent P; then, each
       validated first, the S11 parent artifact and review at P, refused by name unless they are exactly
       PARENT_ARTIFACT and PARENT_REVIEW (the reviewed slug s11-native-load); then the ancestor artifacts
       of (A), each validated first; and, only in the CANDIDATE mode (no artifact at P, so a dry run
       only), the parent's execution-pin targets at P (the runner, S11.json, the S11 brief and every S11
       child argv file), each validated first. Otherwise the runner itself is read only after discovery.
   (2) Discovery is a SCOPED diff, never an unscoped one; every git call that names a path passes it
       after an explicit `--`, and blob bytes are read only by object id (cat-file) after that path
       passed validation.
   (3) EVERY path - from the specs, the artifacts, the execution pins and the discovery - is validated
       BEFORE ANY READ OF ANY OF THEM: inside SCOPE; no absolute path, `..`, backslash or control
       character; not in the forbidden set (src/, rebuild/conform/private, any ledger/ directory, any
       *soak* name); admitted by the positive name rule; a regular file mode in Git (never a symlink
       120000 or submodule 160000) at the parent and at HEAD where present; on disk neither the file nor
       any directory above it inside the repository is a symlink or junction; and, last, an EXACT
       member of the reviewed inventory (REVIEWED) unless it is a changed report the run never reads or
       declares. One failure refuses the whole run by name.
   (4) The protected five (rebuild/engine/seed, migrate, merge, index, oracle-shim) are NEVER read:
       their post is their pre only if Git holds the same object id at the parent and at HEAD and the
       working tree is clean for them; otherwise the run refuses.
   D-REGEN-INPUT: --write also requires the parent's review envelope to be status ACCEPTED, and every
   released path of (A) is excluded from the WHOLE declared union, not only from the discovery.
   Without --write it is a DRY RUN and writes nothing. It loads no engine module. */
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), crypto = require('node:crypto');
const REPO = path.resolve(__dirname, '..', '..', '..');
const SPEC = 'rebuild/lanes/b/tooling/packages/S12.json', S11SPEC = 'rebuild/lanes/b/tooling/packages/S11.json';
const RUNNER = 'rebuild/lanes/b/tooling/b-package.cjs';
const SCOPE = ['.github/workflows/rebuild.yml', '.github/workflows/shared-preflight.yml',
  'rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs', 'rebuild/engine/',
  'rebuild/lanes/b/S10-REGEN.cjs', 'rebuild/lanes/b/S10-REGEN.test.cjs', 'rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md',
  'rebuild/lanes/b/S11-REGEN.cjs', 'rebuild/lanes/b/S11-REGEN.test.cjs', 'rebuild/lanes/b/S9-UI-PINS-BRIEF.md', 'rebuild/lanes/b/tooling/',
  'rebuild/lanes/c/p3-today-hotfix/', 'rebuild/lanes/c/passphrase-normalize/', 'rebuild/lanes/c/s9-today-carry/',
  'rebuild/lanes/c/today-split-spike/', 'rebuild/lanes/c/today-split/', 'rebuild/lanes/c/ui-port/',
  'rebuild/lanes/d/b-lom/', 'rebuild/lanes/d/f2/', 'rebuild/lanes/d/import-retract/', 'rebuild/lanes/d/p3-capture-start/',
  'rebuild/lanes/d/p3-followons/', 'rebuild/lanes/d/p3-layout-v2/', 'rebuild/lanes/d/p3-port-fix/',
  'rebuild/lanes/d/p3-real-shape/', 'rebuild/lanes/d/p3-replay-all/', 'rebuild/lanes/d/p3-replay-measure/',
  'rebuild/lanes/d/plan-edit/', 'rebuild/lanes/tooling/test/', 'rebuild/m1/MOCK.md', 'rebuild/m1/approved-2026-09-08/',
  'rebuild/m3/setup/port/', 'rebuild/m3/w6/host/', 'rebuild/m3/w6/local/', 'rebuild/m3/w6/t2-stage.cjs', 'rebuild/m3/w6/test/',
  'rebuild/m3/w7-preview/', 'rebuild/m4/import/', 'rebuild/m4/spec/', 'rebuild/m4/workout/',
  /* S12's four exact files (header (1)). */
  'rebuild/lanes/b/S11-NATIVE-LOAD-BRIEF.md', 'rebuild/lanes/b/S12-REGEN.cjs', 'rebuild/lanes/b/S12-REGEN.test.cjs',
  '.github/workflows/look-gates.yml'];
const PROTECTED = new Set(['seed', 'migrate', 'merge', 'index', 'oracle-shim'].map((n) => 'rebuild/engine/' + n + '.cjs'));
const FORBIDDEN = [/(^|\/)src\//, /^rebuild\/conform\/private(\/|$)/, /(^|\/)ledger\//, /soak/i];
/* B5 RESIDUAL (Astra S10-INTEGRATION-REVIEW-L3), carried unchanged: filesystem-equivalence matching of the
   forbidden set and the protected five, 8.3 and alternate-data-stream spellings refused outright, and the
   auth-shaped name exclusion (AUTH_ALLOWLIST stays empty). */
const AUTH_SEGMENT = /auth|credential|token|secret/i;
const AUTH_ALLOWLIST = new Set([]);
/* B5 RESIDUAL, L4, carried unchanged: POSITIVE ADMISSION FOR A CONTENT READ (no dot-name segment except an
   exact-file SCOPE entry, no credential or key file name, no key container extension, and a declared file
   type). S12 adds no file type: the look's files are .cjs, .mjs, .css, .html and .yml. */
const CREDENTIAL_NAMES = new Set(['_netrc', 'netrc', '.netrc', 'credentials', 'known_hosts', 'authorized_keys', 'authorized_keys2',
  ...['id_rsa', 'id_dsa', 'id_ecdsa', 'id_ed25519', 'id_ecdsa_sk', 'id_ed25519_sk'].flatMap((k) => [k, k + '.pub']),
  '.git-credentials', '.gitconfig', '.htpasswd', '.pypirc', '.npmrc', '.pgpass', '.dockercfg']);
const KEY_EXT = new Set(['pem', 'key', 'p12', 'pfx', 'kdbx', 'ppk', 'asc', 'gpg', 'jks', 'keystore']);
const ADMITTED_EXT = new Set(['.cjs', '.css', '.html', '.json', '.md', '.mjs', '.yml']);
const EXACT_REVIEWED = new Set(SCOPE.filter((r) => !r.endsWith('/')));
/* B5 RESIDUAL, L5, carried: POSITIVE REVIEWED PROVENANCE. REVIEWED is the union of the inventories this run
   binds: the fixed inputs and exact-file SCOPE entries; the S11 parent artifact and review (slug
   s11-native-load); the product keys of S12.json; the product keys of the parent's S11.json at P and its
   execution-pin paths; and, new in S12 (header (A)), each ancestor artifact path the artifact before it
   names as its parent. LIMIT (as S10- and S11-REGEN): a path that S12.json or the parent S11.json itself
   declares is a member BY THAT DECLARATION; the review of that declaration is its gate. */
const PARENT_ARTIFACT = 'rebuild/m4/spec/acceptance-s11-native-load.json', PARENT_REVIEW = 'rebuild/m4/spec/review-s11-native-load.json';
const ANCESTOR_SHAPE = /^rebuild\/m4\/spec\/acceptance-[a-z0-9-]+\.json$/;
const ANCESTOR_HOPS = 16;
const REVIEWED = new Set([SPEC, S11SPEC, RUNNER, ...EXACT_REVIEWED, PARENT_ARTIFACT, PARENT_REVIEW]);
const NOT_REVIEWED = 'not admitted for a content read: not an exact member of a reviewed inventory (S12.json product, the parent S11.json product and execution pins, the fixed inputs, the S11 parent artifact and review and the ancestors they name, the exact-file SCOPE entries); declare it in S12.json first';
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
  if (!ADMITTED_EXT.has(ext)) return 'extension ' + (ext || '(none)') + ' is not one S12 or its S11 parent declares (' + [...ADMITTED_EXT].join(' ') + ')';
  return null;
}
const canonSeg = (s) => s.toLowerCase().replace(/[. ]+$/, '');
const CANON_PROTECTED = new Set([...PROTECTED].map((f) => f.split('/').map(canonSeg).join('/')));
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const git = (a) => cp.execFileSync('git', a, { cwd: REPO, maxBuffer: 1e9, stdio: ['ignore', 'pipe', 'ignore'] });
const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const WRITE = process.argv.includes('--write');
const WORKTREE = process.argv.includes('--worktree');
const fail = (m) => { console.error('S12-REGEN REFUSED: ' + m); process.exit(2); };
if (WRITE && !/^[1-9][0-9]*$/.test(arg('--receipt-line') || ''))
  fail('--write needs --receipt-line N (the S11 receipt ledger line, parent.options[0].receiptLedgerLine); the runner re-reads that line');

// ---- (3) validation, used before every read (S11-REGEN's, unchanged in kind) ---------------------
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
  if (!inScope(f)) return 'outside the S12 product scope';
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
function validate(f, revs, reads = true) {  // reads: false only for a changed report the run never reads or declares
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
  if (reads && !REVIEWED.has(f)) return NOT_REVIEWED;         // B5 L5: provenance, after every refusal above
  return null;
}
function validateAll(paths, revs, label, reads = () => true) {
  const bad = [];
  const shaped = paths.filter((f) => !shape(f));
  for (const rev of revs) prefetch(rev, [...new Set(shaped)]);
  for (const f of paths) { const why = validate(f, revs, reads(f)); if (why) bad.push(f + ' (' + why + ')'); }
  if (bad.length) fail('REGEN-PATH-REFUSED ' + label + ': ' + bad.slice(0, 10).join('; ') + (bad.length > 10 ? ' ... ' + bad.length : ''));
}
// Reads happen ONLY through these two, and only for a path validate() accepted at that revision.
function blobAt(rev, f) {
  if (PROTECTED.has(f)) throw new Error('S12-REGEN never reads a protected engine file: ' + f);
  if (!validated.has(rev + ':' + f)) throw new Error('S12-REGEN read before validation: ' + rev + ':' + f);
  if (!REVIEWED.has(f)) throw new Error('S12-REGEN read outside the reviewed inventory: ' + f);
  const e = validated.get(rev + ':' + f);
  return e ? cp.execFileSync('git', ['cat-file', 'blob', e.oid], { cwd: REPO, maxBuffer: 1e9 }) : null;
}
function diskAt(f) {
  if (PROTECTED.has(f)) throw new Error('S12-REGEN never reads a protected engine file: ' + f);
  if (!validated.has('HEAD:' + f)) throw new Error('S12-REGEN disk read before validation: ' + f);
  if (!REVIEWED.has(f)) throw new Error('S12-REGEN disk read outside the reviewed inventory: ' + f);
  try { return fs.readFileSync(path.join(REPO, ...f.split('/'))); } catch { return null; }
}
const shaAt = (rev, f) => { const b = blobAt(rev, f); return b === null ? null : sha(b); };
// The POST of a path: its bytes at HEAD, or with --worktree its bytes on disk (header (B)).
const postOf = (f) => { if (!WORKTREE) return shaAt('HEAD', f); const b = diskAt(f); return b === null ? null : sha(b); };
// PENDING census: the JSON path of every string value that begins with the word PENDING (names only, no read).
function pendingPaths(v, at, out) {
  if (typeof v === 'string') { if (/^PENDING\b/.test(v)) out.push(at); }
  else if (Array.isArray(v)) v.forEach((x, i) => pendingPaths(x, at + '[' + i + ']', out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) pendingPaths(x, at + (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? '.' + k : '[' + JSON.stringify(k) + ']'), out);
  return out;
}

// ---- (1) the parent and the fixed inputs, validated first --------------------------------------
const P = (() => { const p = arg('--parent'); if (!p) fail('--parent <S11_PARENT_COMMIT> is required');
  try { return git(['rev-parse', '--verify', p + '^{commit}']).toString().trim(); } catch { fail('not a commit: ' + p); } })();
try { git(['merge-base', '--is-ancestor', P, 'HEAD']); } catch { fail('the parent ' + P.slice(0, 7) + ' is not an ancestor of HEAD; merge-forward first, never rebase'); }
const HEADSHA = git(['rev-parse', 'HEAD']).toString().trim();
validateAll([SPEC, S11SPEC, RUNNER], [P, 'HEAD'], 'fixed input');
const specRaw = diskAt(SPEC); if (!specRaw) fail('no ' + SPEC + ' on disk');
const S12 = JSON.parse(specRaw.toString('utf8'));
const s11raw = blobAt(P, S11SPEC); if (!s11raw) fail('no ' + S11SPEC + ' at the parent');
const S11 = JSON.parse(s11raw.toString('utf8'));
// B5 L5: the reviewed inventory, bound once from the two specs just read (names only; no other read yet).
const s11targets = [...new Set([RUNNER, S11SPEC, ...(S11.brief && S11.brief.file ? [S11.brief.file] : []),
  ...(S11.children || []).flatMap((c) => (c.argv || []).filter((a) => !a.startsWith('--')))])];
for (const f of [...Object.keys(S12.product || {}), ...Object.keys(S11.product || {}), ...s11targets]) REVIEWED.add(f);
const option = ((S12.parent && Array.isArray(S12.parent.options)) ? S12.parent.options : []).find((o) => o.id === 'S11') || fail('S12.json names no S11 parent option');
validateAll([option.artifact, option.review], [P], 'parent artifact');
if (option.artifact !== PARENT_ARTIFACT || option.review !== PARENT_REVIEW)
  fail('REGEN-PATH-REFUSED parent artifact: ' + [option.artifact, option.review].join(', ') + ' (not admitted for a content read: not the reviewed S11 parent artifact or review, which are exactly ' + PARENT_ARTIFACT + ' and ' + PARENT_REVIEW + ')');
const artRaw = blobAt(P, option.artifact), revRaw = blobAt(P, option.review);
const pinOf = (e, f) => { if (typeof e === 'string') return e; if (e && typeof e === 'object' && 'pre' in e && 'post' in e) return e.post === null ? e.pre : e.post; fail('parent pin shape ' + f); };
const pendingBefore = pendingPaths(S12, '$', []);

let pmap, epins, mode, parentReleased;
const ancestors = [], releasedBy = new Map();
if (artRaw) {
  const art = JSON.parse(artRaw.toString('utf8')); mode = 'SEALED ARTIFACT ' + option.artifact + ' ' + sha(artRaw).slice(0, 12);
  pmap = Object.fromEntries(Object.entries(art.product || {}).map(([f, e]) => [f, pinOf(e, f)]));
  epins = { ...(art.executionPins || {}) };
  parentReleased = new Set(Object.keys(art.released || {}));
  for (const f of parentReleased) releasedBy.set(f, option.artifact);
  // (A) ANCESTOR RELEASES: the sealed chain above the parent, each artifact bound by the one that names it.
  let next = art.parent && typeof art.parent.artifact === 'string' ? art.parent.artifact : null;
  while (next && ANCESTOR_SHAPE.test(next)) {
    if (ancestors.length >= ANCESTOR_HOPS) fail('the ancestor walk passed ' + ANCESTOR_HOPS + ' artifacts at ' + next + '; a sealed chain this long is not this repository\'s');
    if (ancestors.includes(next) || next === option.artifact) fail('the ancestor walk returned to ' + next);
    REVIEWED.add(next);
    validateAll([next], [P], 'ancestor artifact');
    const raw = blobAt(P, next);
    if (!raw) fail('the ancestor artifact ' + next + ' named by the chain is not at the parent ' + P.slice(0, 7));
    const a = JSON.parse(raw.toString('utf8'));
    ancestors.push(next);
    for (const f of Object.keys(a.released || {})) { parentReleased.add(f); if (!releasedBy.has(f)) releasedBy.set(f, next); }
    next = a.parent && typeof a.parent.artifact === 'string' ? a.parent.artifact : null;
  }
  if (WRITE) {                                            // D-REGEN-INPUT: an ACCEPTED parent only
    let review = null; try { review = revRaw && JSON.parse(revRaw.toString('utf8')); } catch { review = null; }
    if (!review || review.status !== 'ACCEPTED') fail('the parent review ' + option.review + ' is not an ACCEPTED envelope at ' + P.slice(0, 7));
  }
} else {
  if (WRITE) fail('no sealed S11 artifact ' + option.artifact + ' at ' + P.slice(0, 7) + '; --write needs the seal, a dry run does not');
  mode = 'CANDIDATE (no artifact at the parent): pre from S11.json posts, execution pins recomputed as proposed() would; the ancestor walk is not taken';
  pmap = Object.fromEntries(Object.entries(S11.product).filter(([, v]) => v.role !== 'released').map(([f, v]) => [f, v.post]));
  validateAll(s11targets, [P], 'parent execution pin');
  epins = {};
  for (const t of s11targets) { const e = validated.get(P + ':' + t); if (e) epins[t] = PROTECTED.has(t) ? null : shaAt(P, t); }
  parentReleased = new Set(Object.entries(S11.product).filter(([, v]) => v.role === 'released').map(([f]) => f));
  for (const f of parentReleased) releasedBy.set(f, S11SPEC);
}

// ---- (2) discovery, scoped; then EVERY path validated before any product read ---------------------
const changed = WORKTREE
  ? [...new Set([...git(['diff', '--name-only', P, '--', ...SCOPE]).toString().split('\n').filter(Boolean),
      ...git(['ls-files', '--others', '--exclude-standard', '--', ...SCOPE]).toString().split('\n').filter(Boolean)])].sort()
  : git(['diff', '--name-only', P, 'HEAD', '--', ...SCOPE]).toString().split('\n').filter(Boolean);
/* A released path of the parent or an ancestor (header (A)) is validated below like every changed path
   (shape, Git mode, links) but is never READ and never declared: it is not in changedRead. */
const changedRead = changed.filter((f) => f !== SPEC && (!f.endsWith('.md') || f.startsWith('rebuild/engine/')) && !parentReleased.has(f));
const readSet = new Set([...Object.keys(S12.product), ...Object.keys(pmap), ...Object.keys(epins), ...changedRead]);
validateAll([...readSet, ...changed.filter((f) => !readSet.has(f))], [P, 'HEAD'], 'declared or changed', (f) => readSet.has(f));
const candidates = [...Object.keys(S12.product), ...Object.keys(pmap), ...changedRead];
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
  const was = S12.product[f];
  const post = PROTECTED.has(f) ? protectedPost(f) : postOf(f);
  if (was && was.role === 'released') {
    if (!Object.hasOwn(pmap, f)) problems.push('released path is not a parent product pin: ' + f);
    product[f] = { pre: pmap[f] || null, post: null, role: 'released' };
  } else if (post === null) { problems.push('declared path absent ' + (WORKTREE ? 'on disk' : 'at HEAD') + ': ' + f); continue; }
  else if (Object.hasOwn(pmap, f)) product[f] = { pre: pmap[f], post, role: pmap[f] === post ? 'carried' : 'edited' };
  else if (Object.hasOwn(epins, f)) { if (epins[f] === post && !was) continue; product[f] = { pre: epins[f], post, role: 'superseded-by-child' }; }
  else { if (validated.get(P + ':' + f)) parentUnpinned.push(f); product[f] = { pre: null, post, role: 'new' }; }
  if (!was || was.pre !== product[f].pre || was.post !== product[f].post || was.role !== product[f].role)
    moves.push(f + ': ' + (was ? was.role + ' ' + String(was.pre).slice(0, 8) + '->' + String(was.post).slice(0, 8) : 'undeclared') +
      '  =>  ' + product[f].role + ' ' + String(product[f].pre).slice(0, 8) + '->' + String(product[f].post).slice(0, 8));
}
for (const f of Object.keys(S12.product)) if (!Object.hasOwn(product, f)) moves.push(f + ': dropped' + (parentReleased.has(f) ? ' (released by ' + releasedBy.get(f) + ')' : ' (absent, or an unchanged execution pin that needs no declaration)'));
if (!WORKTREE) for (const [f, p] of Object.entries(product)) if (p.role !== 'released' && p.post !== null && !PROTECTED.has(f)) {
  const disk = diskAt(f);
  if (disk === null || sha(disk) !== p.post) problems.push('disk differs from HEAD (commit first): ' + f);
}
const runnerPost = postOf(RUNNER);

const roles = {}; for (const p of Object.values(product)) roles[p.role] = (roles[p.role] || 0) + 1;
console.log('S12-REGEN ' + (WRITE ? 'WRITE' : 'DRY RUN') + ' at parent ' + P + ' / HEAD ' + HEADSHA + (WORKTREE ? ' + THE UNCOMMITTED WORKING TREE (--worktree)' : ''));
console.log('  mode: ' + mode + (WORKTREE ? '; posts are sha256 of the bytes ON DISK, not at HEAD (header (B))' : ''));
console.log('  scope: ' + SCOPE.length + ' reviewed roots and exact files; ' + validated.size + ' path/revision pair(s) validated before any product read; ' + changed.length + ' changed path(s) in scope, ' + (changed.length - changedRead.length) + ' of them never read (reports, S12.json)');
console.log('  reviewed inventory: ' + REVIEWED.size + ' exact paths (S12.json product, parent S11.json product and execution pins, fixed inputs, S11 parent artifact and review, the ancestor artifacts, exact-file SCOPE entries); every read path is a member');
console.log('  ancestor artifacts walked for releases (header (A)): ' + (ancestors.length ? ancestors.length + ' - ' + ancestors.join(' ') : 'none'));
console.log('  product: ' + Object.keys(product).length + ' paths ' + JSON.stringify(roles) + '; ' + moves.length + ' entr(ies) would change');
for (const m of moves.slice(0, 40)) console.log('    ' + m);
if (moves.length > 40) console.log('    ... ' + (moves.length - 40) + ' more');
console.log('  released paths left undeclared (the parent and its ancestors): ' + ([...parentReleased].sort().map((f) => f + ' (' + releasedBy.get(f) + ')').join(' ') || 'none') + (droppedReleased.length ? '; dropped from the declared union: ' + droppedReleased.join(' ') : ''));
console.log('  parent-unpinned paths declared new (DECISIONS:792): ' + parentUnpinned.length + (parentUnpinned.length ? ' - ' + parentUnpinned.join(' ') : ''));
console.log('  S11.json execution-pin pre at the parent: ' + String(epins[S11SPEC]).slice(0, 12) + (product[S11SPEC] ? ' (declared ' + product[S11SPEC].role + ')' : ' (unchanged, not declared)'));
console.log('  parent.options[0]: artifact sha256 ' + (artRaw ? sha(artRaw) : 'ABSENT') + ', review sha256 ' + (revRaw ? sha(revRaw) : 'ABSENT') +
  ', receiptLedgerLine ' + (arg('--receipt-line') || 'not given'));
console.log('  runnerSha256 ' + (WORKTREE ? 'on disk ' : 'at HEAD ') + runnerPost);
console.log('  PENDING census on disk: ' + pendingBefore.length + ' value(s)' + (pendingBefore.length ? ' - ' + pendingBefore.join(' ') : ''));   // D-S11-A1: every path, no cap
for (const p of problems) console.log('  PROBLEM ' + p);

// Regenerate the measured notes; flag the carried ones that still make a draft-time claim.
const execSup = Object.entries(product).filter(([, p]) => p.role === 'superseded-by-child').map(([f, p]) => f + ' pre ' + p.pre + ' post ' + p.post);
const MEASURED = [
  ['PRODUCT MAP', 'PRODUCT MAP (regenerated by rebuild/lanes/b/S12-REGEN.cjs at parent ' + P + '). pre is the parent pin read at that commit (' + mode + '); post is sha256 of the bytes ' +
    (WORKTREE ? 'ON DISK in the UNCOMMITTED working tree over HEAD ' + HEADSHA + ' (--worktree, header (B)): after the commit a dry run without --worktree must print "0 entr(ies) would change"'
      : 'at HEAD ' + HEADSHA) + '. Released paths of the parent and its ancestors are not declared: ' +
    ([...parentReleased].sort().map((f) => f + ' (' + releasedBy.get(f) + ')').join(', ') || 'none') + '. New paths are every path changed since the parent, inside the S12 product scope, that the parent does not pin, except Markdown reports outside rebuild/engine/ and this spec itself. Roles: ' + JSON.stringify(roles) + '.'],
  ['PARENT-UNPINNED PATHS', 'PARENT-UNPINNED PATHS (regenerated at ' + P + '): ' + parentUnpinned.length + ' path(s) existed at the parent pinned by neither its product map nor its execution pins and are declared here, so they are declared role new with pre null (DECISIONS:792): ' + (parentUnpinned.join(', ') || 'none') + '.'],
  ['EXECUTION PIN SUPERSEDED', 'EXECUTION PIN SUPERSEDED (regenerated at ' + P + '): the parent execution pins this package changes, each declared superseded-by-child with the pre measured at the parent: ' + (execSup.join('; ') || 'none') + '.']];
const OLD_PREFIX = { 'PRODUCT MAP': ['PRODUCT MAP'], 'PARENT-UNPINNED PATHS': ['PARENT-UNPINNED PATHS'], 'EXECUTION PIN SUPERSEDED': ['EXECUTION PIN SUPERSEDED'] };
const notes = (Array.isArray(S12.notes) ? S12.notes : []).slice(), refreshed = [];
for (const [key, text] of MEASURED) {
  const i = notes.findIndex((n) => OLD_PREFIX[key].some((p) => n.startsWith(p)));
  if (i >= 0) notes[i] = text; else notes.push(text);
  refreshed.push(key + (i >= 0 ? ' [' + i + ']' : ' [appended]'));
}
// S11-REGEN's STALE pattern, unchanged (D-S11P-2): a draft-time claim is false once the package's steps land.
const STALE = /9849bc7|e9ff2ca|82f60c3a|CANDIDATE|PROPOSED DRAFT|\bDRAFT\b|prep worktree|\bT3[a-k]\b|NOT YET AUTHORED|OPEN FOR A PM RULING|OPEN ITEMS/;
const stale = notes.map((n, i) => [n, i]).filter(([n]) => STALE.test(n) && !MEASURED.some(([, t]) => t === n)).map(([n, i]) => '[' + i + '] ' + n.slice(0, 70));
console.log('  notes regenerated: ' + refreshed.join(', '));
for (const s of stale) console.log('  STALE NOTE (still makes a draft-time claim; re-author it) ' + s);
if (!WRITE) { console.log('DRY RUN: nothing written'); process.exit(problems.length ? 1 : 0); }
if (problems.length) fail(problems.length + ' problem(s) above');
if (stale.length && !process.argv.includes('--allow-stale-notes')) fail(stale.length + ' carried note(s) still make a draft-time claim (listed above); re-author them, or pass --allow-stale-notes to write and keep the list');
S12.sourceBase = P;
S12.parent.decided = true; S12.parent.chosen = 'S11';
option.sha256 = sha(artRaw); option.reviewSha256 = revRaw ? sha(revRaw) : null;
option.receiptLedgerLine = Number(arg('--receipt-line'));
S12.notes = notes;
S12.tooling.runnerSha256 = runnerPost;
S12.product = product;
const pendingAfter = pendingPaths(S12, '$', []);
console.log('  PENDING left for the PM, never filled by this helper: ' + pendingAfter.length + ' value(s)' + (pendingAfter.length ? ' - ' + pendingAfter.join(' ') : ''));   // D-S11-A1: every path, no cap
fs.writeFileSync(path.join(REPO, SPEC), JSON.stringify(S12, null, 2) + '\n');
console.log('WROTE ' + SPEC + ' ' + sha(fs.readFileSync(path.join(REPO, SPEC))));
