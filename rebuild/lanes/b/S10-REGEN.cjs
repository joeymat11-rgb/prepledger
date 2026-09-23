'use strict';
/* S10-REGEN (D-S10I-7, REVIEW-S10-INTEGRATION-l1). ONE COMMAND, RUN AFTER S10 IS MERGE-FORWARDED
   (never rebased, brief 12.12) ONTO THE SEALED S9 PARENT:

     node rebuild/lanes/b/S10-REGEN.cjs --parent <S9_PARENT_COMMIT> [--receipt-line N] [--write]

   It re-measures, AT THE PARENT COMMIT, every value of packages/S10.json that the S9 seal moves:
   every product `pre` (from the sealed artifact's product map), the pre of every S9 execution pin
   S10 changes (packages/S9.json above all, role superseded-by-child), parent.options[0].sha256 and
   reviewSha256, sourceBase, and tooling.runnerSha256; every `post` is re-measured at HEAD. It also
   re-measures D-SPLIT-PARENT (brief 3.1): the three sourceBlobs.s9 of regions.json at the parent.
   Notes, children, coverage and authorizations are CARRIED from the S10.json on disk, never authored.

   Without --write it is a DRY RUN: it prints what would change and writes nothing. --write refuses
   unless the sealed S9 artifact exists at the parent, so a candidate value can never be baked in.
   It reads bytes only (git show / sha256); it loads no engine module. */
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), crypto = require('node:crypto');
const REPO = path.resolve(__dirname, '..', '..', '..');
const SPEC = 'rebuild/lanes/b/tooling/packages/S10.json', S9SPEC = 'rebuild/lanes/b/tooling/packages/S9.json';
const RUNNER = 'rebuild/lanes/b/tooling/b-package.cjs';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const git = (a, opt) => cp.execFileSync('git', a, { cwd: REPO, maxBuffer: 1e9, ...(opt || {}) });
const show = (rev, f) => { try { return git(['show', rev + ':' + f], { stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return null; } };
const shaAt = (rev, f) => { const b = show(rev, f); return b === null ? null : sha(b); };
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const WRITE = process.argv.includes('--write');
const fail = m => { console.error('S10-REGEN REFUSED: ' + m); process.exit(2); };

const P = (() => { const p = arg('--parent'); if (!p) fail('--parent <S9_PARENT_COMMIT> is required');
  try { return git(['rev-parse', '--verify', p + '^{commit}']).toString().trim(); } catch { fail('not a commit: ' + p); } })();
try { git(['merge-base', '--is-ancestor', P, 'HEAD']); } catch { fail('the parent ' + P.slice(0, 7) + ' is not an ancestor of HEAD; merge-forward first, never rebase'); }
const S10 = JSON.parse(fs.readFileSync(path.join(REPO, SPEC), 'utf8'));
const S9 = JSON.parse(show(P, S9SPEC) || fail('no ' + S9SPEC + ' at the parent'));
const option = S10.parent.options.find(o => o.id === 'S9') || fail('S10.json names no S9 parent option');
const artRaw = show(P, option.artifact), revRaw = show(P, option.review);
const pinOf = (e, f) => { if (typeof e === 'string') return e; if (e && typeof e === 'object' && 'pre' in e && 'post' in e) return e.post === null ? e.pre : e.post; fail('parent pin shape ' + f); };

let pmap, epins, mode, parentReleased;
if (artRaw) {
  const art = JSON.parse(artRaw); mode = 'SEALED ARTIFACT ' + option.artifact + ' ' + sha(artRaw).slice(0, 12);
  pmap = Object.fromEntries(Object.entries(art.product || {}).map(([f, e]) => [f, pinOf(e, f)]));
  epins = art.executionPins || {};
  parentReleased = new Set(Object.keys(art.released || {}));
} else {
  if (WRITE) fail('no sealed S9 artifact ' + option.artifact + ' at ' + P.slice(0, 7) + '; --write needs the seal, a dry run does not');
  mode = 'CANDIDATE (no artifact at the parent): pre from S9.json posts, execution pins recomputed as proposed() would';
  pmap = Object.fromEntries(Object.entries(S9.product).filter(([, v]) => v.role !== 'released').map(([f, v]) => [f, v.post]));
  epins = { [RUNNER]: shaAt(P, RUNNER), [S9SPEC]: shaAt(P, S9SPEC) };
  if (S9.brief && S9.brief.file && shaAt(P, S9.brief.file)) epins[S9.brief.file] = shaAt(P, S9.brief.file);
  for (const c of S9.children) for (const a of c.argv) if (!a.startsWith('--')) epins[a] = shaAt(P, a);
  parentReleased = new Set(Object.entries(S9.product).filter(([, v]) => v.role === 'released').map(([f]) => f));
}
// A path the PARENT released leaves the sealed inventory; S10 never re-pins it (brief 4.3, 9 item 5).

// The declared set: what S10 declares now, every parent product pin, and every path HEAD changed since P.
const changed = git(['diff', '--name-only', P, 'HEAD']).toString().split('\n').filter(Boolean)
  .filter(f => f !== SPEC && !parentReleased.has(f) && (!f.endsWith('.md') || f.startsWith('rebuild/engine/')));
const declared = new Set([...Object.keys(S10.product), ...Object.keys(pmap), ...changed]);
const product = {}, moves = [], problems = [], parentUnpinned = [];
for (const f of [...declared].sort()) {
  const post = shaAt('HEAD', f), was = S10.product[f];
  if (was && was.role === 'released') {
    if (!Object.hasOwn(pmap, f)) problems.push('released path is not a parent product pin: ' + f);
    product[f] = { pre: pmap[f] || null, post: null, role: 'released' };
  } else if (post === null) { problems.push('declared path absent at HEAD: ' + f); continue; }
  else if (Object.hasOwn(pmap, f)) product[f] = { pre: pmap[f], post, role: pmap[f] === post ? 'carried' : 'edited' };
  else if (Object.hasOwn(epins, f)) { if (epins[f] === post && !was) continue; product[f] = { pre: epins[f], post, role: 'superseded-by-child' }; }
  else { if (shaAt(P, f) !== null) parentUnpinned.push(f); product[f] = { pre: null, post, role: 'new' }; }
  if (!was || was.pre !== product[f].pre || was.post !== product[f].post || was.role !== product[f].role)
    moves.push(f + ': ' + (was ? was.role + ' ' + String(was.pre).slice(0, 8) + '->' + String(was.post).slice(0, 8) : 'undeclared') +
      '  =>  ' + product[f].role + ' ' + String(product[f].pre).slice(0, 8) + '->' + String(product[f].post).slice(0, 8));
}
for (const f of Object.keys(S10.product)) if (!Object.hasOwn(product, f)) moves.push(f + ': dropped (an unchanged execution pin needs no declaration)');
for (const [f, p] of Object.entries(product)) if (p.role !== 'released' && p.post !== null) {
  const disk = fs.existsSync(path.join(REPO, f)) ? sha(fs.readFileSync(path.join(REPO, f))) : null;
  if (disk !== p.post) problems.push('disk differs from HEAD (commit first): ' + f);
}

// D-SPLIT-PARENT (brief 3.1), at the parent.
const regions = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/c/today-split-spike/regions.json'), 'utf8'));
const findKey = (o, k) => { if (!o || typeof o !== 'object') return null; if (Object.hasOwn(o, k)) return o[k]; for (const v of Object.values(o)) { const r = findKey(v, k); if (r) return r; } return null; };
const blobs = (findKey(regions, 'sourceBlobs') || {}).s9 || fail('regions.json carries no sourceBlobs.s9');
const split = Object.values(blobs).map(({ path: f, oid }) => { let got = null; try { got = git(['rev-parse', P + ':' + f]).toString().trim(); } catch {}
  return { f, oid, got, ok: got === oid }; });

const roles = {}; for (const p of Object.values(product)) roles[p.role] = (roles[p.role] || 0) + 1;
console.log('S10-REGEN ' + (WRITE ? 'WRITE' : 'DRY RUN') + ' at parent ' + P + ' / HEAD ' + git(['rev-parse', 'HEAD']).toString().trim());
console.log('  mode: ' + mode);
console.log('  product: ' + Object.keys(product).length + ' paths ' + JSON.stringify(roles) + '; ' + moves.length + ' entr(ies) would change');
for (const m of moves.slice(0, 40)) console.log('    ' + m);
if (moves.length > 40) console.log('    ... ' + (moves.length - 40) + ' more');
console.log('  parent-released paths left undeclared: ' + [...parentReleased].sort().join(' '));
console.log('  parent-unpinned paths declared new (DECISIONS:792): ' + parentUnpinned.length + (parentUnpinned.length ? ' - ' + parentUnpinned.join(' ') : ''));
console.log('  S9.json execution-pin pre at the parent: ' + String(epins[S9SPEC]).slice(0, 12) + (product[S9SPEC] ? ' (declared ' + product[S9SPEC].role + ')' : ' (unchanged, not declared)'));
console.log('  parent.options[0]: artifact sha256 ' + (artRaw ? sha(artRaw) : 'ABSENT') + ', review sha256 ' + (revRaw ? sha(revRaw) : 'ABSENT') +
  ', receiptLedgerLine ' + (arg('--receipt-line') || 'not given'));
console.log('  runnerSha256 at HEAD ' + shaAt('HEAD', RUNNER));
for (const s of split) console.log('  D-SPLIT-PARENT ' + (s.ok ? 'EQUAL ' : 'STOP  ') + s.f + ' expected ' + s.oid + ' at parent ' + s.got);
for (const p of problems) console.log('  PROBLEM ' + p);
if (split.some(s => !s.ok)) problems.push('D-SPLIT-PARENT');
if (!WRITE) { console.log('DRY RUN: nothing written'); process.exit(problems.length ? 1 : 0); }
if (problems.length) fail(problems.length + ' problem(s) above');
S10.sourceBase = P;
S10.parent.decided = true; S10.parent.chosen = 'S9';
option.sha256 = sha(artRaw); option.reviewSha256 = revRaw ? sha(revRaw) : null;
if (arg('--receipt-line')) option.receiptLedgerLine = Number(arg('--receipt-line'));
S10.tooling.runnerSha256 = shaAt('HEAD', RUNNER);
S10.product = product;
fs.writeFileSync(path.join(REPO, SPEC), JSON.stringify(S10, null, 2) + '\n');
console.log('WROTE ' + SPEC + ' ' + sha(fs.readFileSync(path.join(REPO, SPEC))));
