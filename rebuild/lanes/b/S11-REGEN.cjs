'use strict';
/* S11-REGEN (S11 NATIVE-LOAD reseal brief DRAFT rev3 section 11 T3f; S11-RESEAL-PLAN I10). The port of
   rebuild/lanes/b/S10-REGEN.cjs (98d1cfff; D-S10I-7, Astra S10-INTEGRATION-REVIEW-L2..L5 B5 and
   D-REGEN-INPUT) to M2-S11 (package id PROPOSED, STOP-S11-ID). ONE COMMAND, RUN AFTER S11 IS
   MERGE-FORWARDED (never rebased, DECISIONS:563) ONTO THE SEALED S10 PARENT (brief T3k):

     node rebuild/lanes/b/S11-REGEN.cjs --parent <S10_PARENT_COMMIT> [--receipt-line N] [--write [--allow-stale-notes]]

   It re-measures, AT THE PARENT COMMIT, every value of packages/S11.json that the S10 seal moves:
   every product `pre` (from the sealed S10 artifact's product map), the pre of every S10 execution
   pin S11 changes (packages/S10.json above all, role superseded-by-child once S11's two runner hunks
   re-pin its tooling.runnerSha256, brief section 4), parent.options[0].sha256 and reviewSha256,
   sourceBase and tooling.runnerSha256; every `post` is re-measured at HEAD. S10-REGEN's
   D-SPLIT-PARENT check (regions.json sourceBlobs.s9) was S10's own and is NOT ported: S11 has no
   split source, so regions.json is not a fixed input here.
   Children, coverage and authorizations are CARRIED from the S11.json on disk, never authored.
   NOTES: the three notes whose content IS a parent measurement - PRODUCT MAP, the parent-unpinned
   paths and the superseded execution pins - are REGENERATED from the values this run measures. Every
   other note is carried, and any carried note that still cites the S10 candidate (9849bc7, e9ff2ca,
   the candidate S10.json bytes 82f60c3a, the word CANDIDATE or the words PROPOSED DRAFT) is FLAGGED;
   --write refuses while one is flagged unless --allow-stale-notes is given, and then prints the list.
   --receipt-line is REQUIRED with --write: parent.options[0].receiptLedgerLine is the S10 receipt's
   ledger coordinate, a parent binding the runner re-reads (it is optional only for a dry run).
   PENDING CENSUS (new in S11): the S11 draft marks every value nobody can measure before the S10 seal
   as a string that begins with the word PENDING and names its STOP. Every such value is listed by its
   JSON path on every run, before and after the fields this helper fills; the ones it does not fill
   (package id, brief, THEME, needles, the supersession ruling, the option note) are the PM's at T5/T6
   and are LISTED, never refused and never invented here.

   THE PATH BOUNDARY (B5, carried from S10-REGEN unchanged in kind). Nothing is read outside a
   POSITIVE, reviewed scope:
   (1) SCOPE below is the fixed list of S11 product roots and exact files: S10-REGEN's 36 entries
       verbatim, plus four exact files: rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md (the S10 brief of
       record, an execution pin of the parent artifact), this helper and its test, and
       rebuild/m3/w6/t2-stage.cjs (FC06, a NATIVE-LOAD product path that lies under no S10 root;
       rebuild/m3/w6/ itself is NOT a root, so a sibling there stays outside). Every run prints the
       count of entries and of path/revision pairs it validated. FIXED_INPUTS (S11.json, the parent's
       S10.json, the runner) are the only files read before discovery, and they are validated first.
   (2) Discovery is `git diff --name-only <P> HEAD -- <SCOPE...>`, never an unscoped diff; every
       git call that names a path passes it after an explicit `--` (ls-tree), and blob bytes are read
       only by object id (cat-file) after that path passed validation.
   (3) EVERY path - from the specs, the artifact, the execution pins and the diff - is validated
       BEFORE ANY READ OF ANY OF THEM: inside SCOPE; no absolute path, `..`, backslash or control
       character; not in the forbidden set (src/, rebuild/conform/private, any ledger/ directory, any
       *soak* name); admitted by the positive name rule (no dot-name, credential or key file name, or
       key container extension, and a file type S11 or its parent declares); a regular file mode in
       Git (never a symlink 120000 or submodule 160000) at the parent and at HEAD where present; on
       disk neither the file nor any directory above it inside the repository is a symlink or
       junction; and, last, it is an EXACT member of the reviewed inventory (REVIEWED) unless it is a
       changed report the run never reads or declares. One failure refuses the whole run by name.
   (4) The protected five (rebuild/engine/seed, migrate, merge, index, oracle-shim) are NEVER read:
       their post is their pre only if Git holds the same object id at the parent and at HEAD and
       the working tree is clean for them; otherwise the run refuses.
   D-REGEN-INPUT: --write also requires the parent's review envelope to be status ACCEPTED, and a
   parent-released path (today-app.cjs and gym-app.mjs at S10) is excluded from the WHOLE declared
   union, not only from the diff.
   Without --write it is a DRY RUN and writes nothing. It loads no engine module. */
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), crypto = require('node:crypto');
const REPO = path.resolve(__dirname, '..', '..', '..');
const SPEC = 'rebuild/lanes/b/tooling/packages/S11.json', S10SPEC = 'rebuild/lanes/b/tooling/packages/S10.json';
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
  'rebuild/m3/w7-preview/', 'rebuild/m4/import/', 'rebuild/m4/spec/', 'rebuild/m4/workout/'];
const PROTECTED = new Set(['seed', 'migrate', 'merge', 'index', 'oracle-shim'].map((n) => 'rebuild/engine/' + n + '.cjs'));
const FORBIDDEN = [/(^|\/)src\//, /^rebuild\/conform\/private(\/|$)/, /(^|\/)ledger\//, /soak/i];
/* B5 RESIDUAL (Astra S10-INTEGRATION-REVIEW-L3), carried. The forbidden set and the protected five are
   matched under FILESYSTEM EQUIVALENCE, not byte equality: every segment is compared lower-cased with
   trailing dots and spaces stripped (how Windows resolves a name), so LEDGER/, Ledger/, ledger./, SRC/,
   SEED.cjs or seed.cjs. cannot slip past a lower-case pattern. An 8.3 short name (a segment containing
   ~ followed by a digit) and an alternate data stream (a colon in a segment) are refused outright, and
   so is a segment that ends in a dot or a space.
   AUTH EXCLUSION: a segment named auth.json or .credentials, or matching auth|credential|token|secret
   (case-insensitive), is refused under every allowed root unless the full path is in AUTH_ALLOWLIST.
   The list stays empty: no path S11.json declares, and no S10 product or execution pin, matches. */
const AUTH_SEGMENT = /auth|credential|token|secret/i;
const AUTH_ALLOWLIST = new Set([]);
/* B5 RESIDUAL, L4 (Astra S10-INTEGRATION-REVIEW-L4), carried: POSITIVE ADMISSION FOR A CONTENT READ.
   After every refusal above, a path under an allowed root is admitted only if ALL of these hold:
   (a) no segment is a dot-name (.netrc, .ssh, .aws, .git*, .npmrc, .pypirc, ...);
   (b) no segment, nor a segment without its final extension, is a standard credential or key file
       name (CREDENTIAL_NAMES);
   (c) no dotted part of any segment is a key or secret container extension (KEY_EXT);
   (d) the file's final extension is in ADMITTED_EXT, S10-REGEN's set unchanged: the NATIVE-LOAD paths
       S11 adds are .cjs and .mjs only, so S11 widens nothing. A name with no extension is refused.
   EXACT REVIEWED FILES: (a) does not apply to a path EQUAL to an exact-file SCOPE entry (SCOPE without
   a trailing slash), and to nothing else: that admits .github/workflows/rebuild.yml and
   .github/workflows/shared-preflight.yml by identity; any other path with a .github segment (or any
   dot-name) is refused, and (b)-(d) still apply to the exact files. */
const CREDENTIAL_NAMES = new Set(['_netrc', 'netrc', '.netrc', 'credentials', 'known_hosts', 'authorized_keys', 'authorized_keys2',
  ...['id_rsa', 'id_dsa', 'id_ecdsa', 'id_ed25519', 'id_ecdsa_sk', 'id_ed25519_sk'].flatMap((k) => [k, k + '.pub']),
  '.git-credentials', '.gitconfig', '.htpasswd', '.pypirc', '.npmrc', '.pgpass', '.dockercfg']);
const KEY_EXT = new Set(['pem', 'key', 'p12', 'pfx', 'kdbx', 'ppk', 'asc', 'gpg', 'jks', 'keystore']);
const ADMITTED_EXT = new Set(['.cjs', '.css', '.html', '.json', '.md', '.mjs', '.yml']);
const EXACT_REVIEWED = new Set(SCOPE.filter((r) => !r.endsWith('/')));
/* B5 RESIDUAL, L5 (Astra S10-INTEGRATION-REVIEW-L5), carried: POSITIVE REVIEWED PROVENANCE. After every
   refusal above and every Git-mode and on-disk link check in validate(), a path is admitted for a Git or
   disk content read only if it is an EXACT member of REVIEWED (the exact string). REVIEWED is the union of
   the inventories this run binds, and nothing else:
     - the three fixed inputs and the exact-file SCOPE entries;
     - the S10 parent artifact and review, bound to the runner's slug s10-today-split (S10.json
       artifact.file / artifact.review): S11.json must name exactly these two paths;
     - the product keys of S11.json (the fixed input under review);
     - the product keys of the parent's S10.json at P and its execution-pin paths (RUNNER, S10.json, the
       S10 brief, every S10 child argv target: what proposed() pins).
   Every other source must be a member. A changed path outside REVIEWED is refused by name before any read
   of it; to measure it, declare it in S11.json first, a reviewed change. Changed Markdown outside
   rebuild/engine/ (and S11.json itself) is never read or declared. blobAt() and diskAt() also refuse any
   non-member, as a last line. LIMIT (as S10-REGEN): a path that S11.json or the parent S10.json itself
   declares is a member BY THAT DECLARATION; the review of that declaration is its gate. */
const PARENT_ARTIFACT = 'rebuild/m4/spec/acceptance-s10-today-split.json', PARENT_REVIEW = 'rebuild/m4/spec/review-s10-today-split.json';
const REVIEWED = new Set([SPEC, S10SPEC, RUNNER, ...EXACT_REVIEWED, PARENT_ARTIFACT, PARENT_REVIEW]);
const NOT_REVIEWED = 'not admitted for a content read: not an exact member of a reviewed inventory (S11.json product, the parent S10.json product and execution pins, the fixed inputs, the S10 parent artifact and review, the exact-file SCOPE entries); declare it in S11.json first';
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
  if (!ADMITTED_EXT.has(ext)) return 'extension ' + (ext || '(none)') + ' is not one S11 or its S10 parent declares (' + [...ADMITTED_EXT].join(' ') + ')';
  return null;
}
const canonSeg = (s) => s.toLowerCase().replace(/[. ]+$/, '');
const CANON_PROTECTED = new Set([...PROTECTED].map((f) => f.split('/').map(canonSeg).join('/')));
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const git = (a) => cp.execFileSync('git', a, { cwd: REPO, maxBuffer: 1e9, stdio: ['ignore', 'pipe', 'ignore'] });
const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const WRITE = process.argv.includes('--write');
const fail = (m) => { console.error('S11-REGEN REFUSED: ' + m); process.exit(2); };
if (WRITE && !/^[1-9][0-9]*$/.test(arg('--receipt-line') || ''))
  fail('--write needs --receipt-line N (the S10 receipt ledger line, parent.options[0].receiptLedgerLine); the runner re-reads that line');

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
  if (!inScope(f)) return 'outside the S11 product scope';
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
  if (PROTECTED.has(f)) throw new Error('S11-REGEN never reads a protected engine file: ' + f);
  if (!validated.has(rev + ':' + f)) throw new Error('S11-REGEN read before validation: ' + rev + ':' + f);
  if (!REVIEWED.has(f)) throw new Error('S11-REGEN read outside the reviewed inventory: ' + f);
  const e = validated.get(rev + ':' + f);
  return e ? cp.execFileSync('git', ['cat-file', 'blob', e.oid], { cwd: REPO, maxBuffer: 1e9 }) : null;
}
function diskAt(f) {
  if (PROTECTED.has(f)) throw new Error('S11-REGEN never reads a protected engine file: ' + f);
  if (!validated.has('HEAD:' + f)) throw new Error('S11-REGEN disk read before validation: ' + f);
  if (!REVIEWED.has(f)) throw new Error('S11-REGEN disk read outside the reviewed inventory: ' + f);
  try { return fs.readFileSync(path.join(REPO, ...f.split('/'))); } catch { return null; }
}
const shaAt = (rev, f) => { const b = blobAt(rev, f); return b === null ? null : sha(b); };
// PENDING census: the JSON path of every string value that begins with the word PENDING (names only, no read).
function pendingPaths(v, at, out) {
  if (typeof v === 'string') { if (/^PENDING\b/.test(v)) out.push(at); }
  else if (Array.isArray(v)) v.forEach((x, i) => pendingPaths(x, at + '[' + i + ']', out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) pendingPaths(x, at + (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? '.' + k : '[' + JSON.stringify(k) + ']'), out);
  return out;
}

// ---- (1) the parent and the fixed inputs, validated first --------------------------------------
const P = (() => { const p = arg('--parent'); if (!p) fail('--parent <S10_PARENT_COMMIT> is required');
  try { return git(['rev-parse', '--verify', p + '^{commit}']).toString().trim(); } catch { fail('not a commit: ' + p); } })();
try { git(['merge-base', '--is-ancestor', P, 'HEAD']); } catch { fail('the parent ' + P.slice(0, 7) + ' is not an ancestor of HEAD; merge-forward first, never rebase'); }
const HEADSHA = git(['rev-parse', 'HEAD']).toString().trim();
validateAll([SPEC, S10SPEC, RUNNER], [P, 'HEAD'], 'fixed input');
const specRaw = diskAt(SPEC); if (!specRaw) fail('no ' + SPEC + ' on disk');
const S11 = JSON.parse(specRaw.toString('utf8'));
const s10raw = blobAt(P, S10SPEC); if (!s10raw) fail('no ' + S10SPEC + ' at the parent');
const S10 = JSON.parse(s10raw.toString('utf8'));
// B5 L5: the reviewed inventory, bound once from the two specs just read (names only; no other read yet).
const s10targets = [...new Set([RUNNER, S10SPEC, ...(S10.brief && S10.brief.file ? [S10.brief.file] : []),
  ...(S10.children || []).flatMap((c) => (c.argv || []).filter((a) => !a.startsWith('--')))])];
for (const f of [...Object.keys(S11.product || {}), ...Object.keys(S10.product || {}), ...s10targets]) REVIEWED.add(f);
const option = ((S11.parent && Array.isArray(S11.parent.options)) ? S11.parent.options : []).find((o) => o.id === 'S10') || fail('S11.json names no S10 parent option');
validateAll([option.artifact, option.review], [P], 'parent artifact');
if (option.artifact !== PARENT_ARTIFACT || option.review !== PARENT_REVIEW)
  fail('REGEN-PATH-REFUSED parent artifact: ' + [option.artifact, option.review].join(', ') + ' (not admitted for a content read: not the reviewed S10 parent artifact or review, which are exactly ' + PARENT_ARTIFACT + ' and ' + PARENT_REVIEW + ')');
const artRaw = blobAt(P, option.artifact), revRaw = blobAt(P, option.review);
const pinOf = (e, f) => { if (typeof e === 'string') return e; if (e && typeof e === 'object' && 'pre' in e && 'post' in e) return e.post === null ? e.pre : e.post; fail('parent pin shape ' + f); };
const pendingBefore = pendingPaths(S11, '$', []);

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
  if (WRITE) fail('no sealed S10 artifact ' + option.artifact + ' at ' + P.slice(0, 7) + '; --write needs the seal, a dry run does not');
  mode = 'CANDIDATE (no artifact at the parent): pre from S10.json posts, execution pins recomputed as proposed() would';
  pmap = Object.fromEntries(Object.entries(S10.product).filter(([, v]) => v.role !== 'released').map(([f, v]) => [f, v.post]));
  validateAll(s10targets, [P], 'parent execution pin');
  epins = {};
  for (const t of s10targets) { const e = validated.get(P + ':' + t); if (e) epins[t] = PROTECTED.has(t) ? null : shaAt(P, t); }
  parentReleased = new Set(Object.entries(S10.product).filter(([, v]) => v.role === 'released').map(([f]) => f));
}

// ---- (2) discovery, scoped; then EVERY path validated before any product read ---------------------
const changed = git(['diff', '--name-only', P, 'HEAD', '--', ...SCOPE]).toString().split('\n').filter(Boolean);
const changedRead = changed.filter((f) => f !== SPEC && (!f.endsWith('.md') || f.startsWith('rebuild/engine/')));
const readSet = new Set([...Object.keys(S11.product), ...Object.keys(pmap), ...Object.keys(epins), ...changedRead]);
validateAll([...readSet, ...changed.filter((f) => !readSet.has(f))], [P, 'HEAD'], 'declared or changed', (f) => readSet.has(f));
const candidates = [...Object.keys(S11.product), ...Object.keys(pmap), ...changedRead];
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
  const was = S11.product[f];
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
for (const f of Object.keys(S11.product)) if (!Object.hasOwn(product, f)) moves.push(f + ': dropped' + (parentReleased.has(f) ? ' (released by the parent)' : ' (absent at HEAD, or an unchanged execution pin that needs no declaration)'));
for (const [f, p] of Object.entries(product)) if (p.role !== 'released' && p.post !== null && !PROTECTED.has(f)) {
  const disk = diskAt(f);
  if (disk === null || sha(disk) !== p.post) problems.push('disk differs from HEAD (commit first): ' + f);
}

const roles = {}; for (const p of Object.values(product)) roles[p.role] = (roles[p.role] || 0) + 1;
console.log('S11-REGEN ' + (WRITE ? 'WRITE' : 'DRY RUN') + ' at parent ' + P + ' / HEAD ' + HEADSHA);
console.log('  mode: ' + mode);
console.log('  scope: ' + SCOPE.length + ' reviewed roots and exact files; ' + validated.size + ' path/revision pair(s) validated before any product read; ' + changed.length + ' changed path(s) in scope, ' + (changed.length - changedRead.length) + ' of them never read (reports, S11.json)');
console.log('  reviewed inventory: ' + REVIEWED.size + ' exact paths (S11.json product, parent S10.json product and execution pins, fixed inputs, S10 parent artifact and review, exact-file SCOPE entries); every read path is a member');
console.log('  product: ' + Object.keys(product).length + ' paths ' + JSON.stringify(roles) + '; ' + moves.length + ' entr(ies) would change');
for (const m of moves.slice(0, 40)) console.log('    ' + m);
if (moves.length > 40) console.log('    ... ' + (moves.length - 40) + ' more');
console.log('  parent-released paths left undeclared: ' + ([...parentReleased].sort().join(' ') || 'none') + (droppedReleased.length ? '; dropped from the declared union: ' + droppedReleased.join(' ') : ''));
console.log('  parent-unpinned paths declared new (DECISIONS:792): ' + parentUnpinned.length + (parentUnpinned.length ? ' - ' + parentUnpinned.join(' ') : ''));
console.log('  S10.json execution-pin pre at the parent: ' + String(epins[S10SPEC]).slice(0, 12) + (product[S10SPEC] ? ' (declared ' + product[S10SPEC].role + ')' : ' (unchanged, not declared)'));
console.log('  parent.options[0]: artifact sha256 ' + (artRaw ? sha(artRaw) : 'ABSENT') + ', review sha256 ' + (revRaw ? sha(revRaw) : 'ABSENT') +
  ', receiptLedgerLine ' + (arg('--receipt-line') || 'not given'));
console.log('  runnerSha256 at HEAD ' + shaAt('HEAD', RUNNER));
console.log('  PENDING census on disk: ' + pendingBefore.length + ' value(s)' + (pendingBefore.length ? ' - ' + pendingBefore.slice(0, 40).join(' ') + (pendingBefore.length > 40 ? ' ... ' + (pendingBefore.length - 40) + ' more' : '') : ''));
for (const p of problems) console.log('  PROBLEM ' + p);

// Regenerate the measured notes; flag the carried ones that still cite the S10 candidate.
const execSup = Object.entries(product).filter(([, p]) => p.role === 'superseded-by-child').map(([f, p]) => f + ' pre ' + p.pre + ' post ' + p.post);
const MEASURED = [
  ['PRODUCT MAP', 'PRODUCT MAP (regenerated by rebuild/lanes/b/S11-REGEN.cjs at parent ' + P + '). pre is the parent pin read at that commit (' + mode + '); post is sha256 of the bytes at HEAD ' + HEADSHA + '. Parent-released paths are not declared: ' + ([...parentReleased].sort().join(', ') || 'none') + '. New paths are every path HEAD changed since the parent, inside the S11 product scope, that the parent does not pin, except Markdown reports outside rebuild/engine/ and this spec itself; tracked Markdown under rebuild/engine/ is declared because the engine-inventory cells walk every tracked file there. Roles: ' + JSON.stringify(roles) + '.'],
  ['PARENT-UNPINNED PATHS', 'PARENT-UNPINNED PATHS (regenerated at ' + P + '): ' + parentUnpinned.length + ' path(s) existed at the parent pinned by neither its product map nor its execution pins and are declared here, so they are declared role new with pre null (DECISIONS:792): ' + (parentUnpinned.join(', ') || 'none') + '.'],
  ['EXECUTION PIN SUPERSEDED', 'EXECUTION PIN SUPERSEDED (regenerated at ' + P + '): the parent execution pins this package changes, each declared superseded-by-child with the pre measured at the parent: ' + (execSup.join('; ') || 'none') + '.']];
const OLD_PREFIX = { 'PRODUCT MAP': ['PRODUCT MAP'], 'PARENT-UNPINNED PATHS': ['PARENT-UNPINNED PATHS'], 'EXECUTION PIN SUPERSEDED': ['EXECUTION PIN SUPERSEDED'] };
const notes = (Array.isArray(S11.notes) ? S11.notes : []).slice(), refreshed = [];
for (const [key, text] of MEASURED) {
  const i = notes.findIndex((n) => OLD_PREFIX[key].some((p) => n.startsWith(p)));
  if (i >= 0) notes[i] = text; else notes.push(text);
  refreshed.push(key + (i >= 0 ? ' [' + i + ']' : ' [appended]'));
}
const STALE = /9849bc7|e9ff2ca|82f60c3a|CANDIDATE|PROPOSED DRAFT/;
const stale = notes.map((n, i) => [n, i]).filter(([n]) => STALE.test(n) && !MEASURED.some(([, t]) => t === n)).map(([n, i]) => '[' + i + '] ' + n.slice(0, 70));
console.log('  notes regenerated: ' + refreshed.join(', '));
for (const s of stale) console.log('  STALE NOTE (still cites the S10 candidate; re-author it) ' + s);
if (!WRITE) { console.log('DRY RUN: nothing written'); process.exit(problems.length ? 1 : 0); }
if (problems.length) fail(problems.length + ' problem(s) above');
if (stale.length && !process.argv.includes('--allow-stale-notes')) fail(stale.length + ' carried note(s) still cite the S10 candidate (listed above); re-author them, or pass --allow-stale-notes to write and keep the list');
S11.sourceBase = P;
S11.parent.decided = true; S11.parent.chosen = 'S10';
option.sha256 = sha(artRaw); option.reviewSha256 = revRaw ? sha(revRaw) : null;
option.receiptLedgerLine = Number(arg('--receipt-line'));
S11.notes = notes;
S11.tooling.runnerSha256 = shaAt('HEAD', RUNNER);
S11.product = product;
const pendingAfter = pendingPaths(S11, '$', []);
console.log('  PENDING left for the PM (T5/T6), never filled by this helper: ' + pendingAfter.length + ' value(s)' + (pendingAfter.length ? ' - ' + pendingAfter.slice(0, 40).join(' ') + (pendingAfter.length > 40 ? ' ... ' + (pendingAfter.length - 40) + ' more' : '') : ''));
fs.writeFileSync(path.join(REPO, SPEC), JSON.stringify(S11, null, 2) + '\n');
console.log('WROTE ' + SPEC + ' ' + sha(fs.readFileSync(path.join(REPO, SPEC))));
