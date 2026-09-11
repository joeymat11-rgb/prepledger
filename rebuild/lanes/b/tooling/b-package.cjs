'use strict';
// LANE B closed-package tooling — ONE generic runner for B1..B4.
//
// Usage: node rebuild/lanes/b/tooling/b-package.cjs --ci|--full --package <B1|B2|B3|B4>
//
// It reads the declarative package spec at rebuild/lanes/b/tooling/packages/<id>.json
// (product file map with pre/post sha256, D-ids, law ids, parent artifact, carrier
// successor, authorizations, expected witness flips, protected surfaces, coverage)
// and executes the same closed-package choreography the accepted M2-LOAD-WRITES and
// M2-NATIVE-CARRIERS runners execute — by REQUIRING their immutable machinery
// (postfix/run.cjs GATES + gateRun, legacy-gates.cjs, target.cjs, strict-json.cjs,
// native-carriers-errors.cjs, load-write-reference.cjs), never by copying it.
//
// Two modes, no third. --ci is public evidence only. --full adds the private-oracle
// requirement, the historical 45-law audit and the 19 original gates (second gate
// included). No PASS word is printed without an ACCEPTED review envelope naming the
// exact artifact bytes: PENDING evidence exits 2 as REVIEW-PENDING (DECISIONS:86-87).
// The final acceptance artifact itself lives in rebuild/m4/spec at package time;
// this directory holds only the reusable tooling and the pre-package declarations.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../../..');
const P = path.join(root, 'rebuild/conform/v4/postfix');
const R = require(path.join(P, 'run.cjs')), L = require(path.join(P, 'legacy-gates.cjs')), J = require(path.join(P, 'strict-json.cjs'));
const { sha } = require(path.join(P, 'target.cjs'));
// The closed BLOCKED classification of the original runner, reused as published.
const BLOCKED = require(path.join(root, 'rebuild/m4/spec/native-carriers-errors.cjs')).codes;
const Reference = require(path.join(root, 'rebuild/m4/spec/load-write-reference.cjs'));
const SPEC_DIR = path.join(__dirname, 'packages');
const CARRIED = ['D12', 'D33', 'D34', 'D35', 'D41', 'D43']; // repaired by the accepted parents (DECISIONS:87, :93)
const GATE_IDS = R.GATES.map(g => g[0]);
// run.cjs exports GATES and gateRun but not its PIN_PATHS inventory; derive it from
// the immutable source the same way native-carriers-errors.cjs derives the blocked
// code list, so the fidelity check uses the original list and never a second copy.
const PIN_PATHS = (() => {
  const source = fs.readFileSync(path.join(P, 'run.cjs'), 'utf8');
  const m = [...source.matchAll(/^const PIN_PATHS=(\[[^\]]+\]);$/gm)];
  assert.equal(m.length, 1, 'Original closed PIN_PATHS inventory');
  const list = JSON.parse(m[0][1].replaceAll("'", '"'));
  assert(list.length && new Set(list).size === list.length, 'PIN_PATHS inventory');
  return list;
})();
const args = process.argv.slice(2);
// Exactly two modes, exactly one package; no third mode and no defaulting. A usage
// error refuses in one line rather than leaking a local stack.
if (!(args.length === 3 && ['--full', '--ci'].includes(args[0]) && args[1] === '--package' && /^B[1-4]$/.test(args[2]))) {
  console.error('B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B1|B2|B3|B4');
  process.exit(1);
}
const ci = args[0] === '--ci', ID = args[2];
const say = line => console.log('B PACKAGE ' + ID + ' ' + line);
const open = [];
const note = (reason, ciBlocking = true) => { open.push({ reason, ciBlocking }); };
const keys = (o, list, label) => assert.deepEqual(Object.keys(o).sort(), list.slice().sort(), label);
let logDir;

// ---------------------------------------------------------------- 1. the spec
const SPEC_KEYS = ['version', 'lanePackage', 'packageId', 'status', 'brief', 'sourceBase', 'dIds', 'laws',
  'carriedAcceptedIds', 'privateLiveTriggered', 'parent', 'product', 'coverage', 'carrierSuccessor',
  'witnessFlips', 'protectedSurfaces', 'authorizations', 'artifact', 'children', 'notes'];
function spec() {
  const raw = fs.readFileSync(path.join(SPEC_DIR, ID + '.json'));
  const s = J.parseExact(raw); // exact reviewed bytes + duplicate-decoded-key refusal
  keys(s, SPEC_KEYS, 'Closed package-spec keys');
  assert.equal(s.version, 1); assert.equal(s.lanePackage, ID);
  assert(/^M2-B[1-4]-[A-Z0-9-]+$/.test(s.packageId), 'Package id shape');
  assert(['SKELETON', 'PROPOSED', 'BRIEF-ACCEPTED'].includes(s.status), 'Spec status');
  keys(s.brief, ['file', 'sha256', 'acceptedLedgerLine'], 'Brief citation');
  assert(/^[a-f0-9]{40}$/.test(s.sourceBase), 'sourceBase is a commit');
  assert(Array.isArray(s.dIds) && s.dIds.length && new Set(s.dIds).size === s.dIds.length &&
    s.dIds.every(d => /^D([1-9]|[1-3][0-9]|4[0-5])$/.test(d)) && !s.dIds.some(d => CARRIED.includes(d)),
    'D-id inventory: unique, in range, never a already-repaired id');
  assert.deepEqual(Object.keys(s.laws).sort(), s.dIds.slice().sort(), 'Exactly one law id per D-id');
  assert.deepEqual(s.carriedAcceptedIds, CARRIED, 'Carried accepted ids');
  assert(Array.isArray(s.privateLiveTriggered) && s.privateLiveTriggered.every(d => s.dIds.includes(d)), 'LIVE-triggered subset');
  keys(s.parent, ['decided', 'chosen', 'options'], 'Parent block');
  assert(typeof s.parent.decided === 'boolean' && Array.isArray(s.parent.options) && s.parent.options.length, 'Parent options');
  assert(s.parent.chosen === null || s.parent.options.some(o => o.id === s.parent.chosen), 'Chosen parent is an option');
  for (const [file, pin] of Object.entries(s.product)) {
    keys(pin, ['pre', 'post', 'role'], 'Product pin ' + file);
    assert(/^[a-f0-9]{64}$/.test(pin.pre) && (pin.post === null || /^[a-f0-9]{64}$/.test(pin.post)), 'Product sha256 ' + file);
    assert(['edited', 'carried', 'new'].includes(pin.role), 'Product role ' + file);
  }
  keys(s.coverage, ['inherited', 'moves'], 'Coverage block');
  for (const gate of [...Object.keys(s.coverage.inherited), ...Object.keys(s.coverage.moves)]) assert(GATE_IDS.includes(gate), 'Covered gate is an original gate: ' + gate);
  assert(!Object.keys(s.coverage.moves).some(g => Object.hasOwn(s.coverage.inherited, g)), 'A gate is inherited-covered or moved, never both');
  for (const flip of s.witnessFlips) keys(flip, ['file', 'line', 'from', 'to'], 'Witness flip');
  keys(s.authorizations, ['owner', 'contract', 'theme', 'review'], 'Closed authorization keys');
  keys(s.authorizations.review, ['role', 'prefix', 'terminal'], 'Review claim');
  assert(s.authorizations.review.role === 'cowork' && s.authorizations.review.terminal === 'ACCEPTED' &&
    s.authorizations.review.prefix === 'POSTFIX-ACCEPTANCE ' + s.packageId, 'Review claim binds this package id');
  keys(s.artifact, ['file', 'review', 'runner'], 'Artifact coordinates');
  assert(s.artifact.file.startsWith('rebuild/m4/spec/acceptance-') && s.artifact.review.startsWith('rebuild/m4/spec/review-'), 'Artifact lives in rebuild/m4/spec');
  for (const child of s.children) keys(child, ['name', 'argv', 'needle'], 'Declared child');
  say('SPEC OBSERVED packages/' + ID + '.json ' + sha(raw) + '; status=' + s.status + '; ' + s.dIds.length +
    ' D-ids ' + s.dIds.join('>') + '; ' + Object.keys(s.product).length + ' declared product files');
  if (s.status !== 'BRIEF-ACCEPTED' || !s.brief.acceptedLedgerLine) note('brief ' + s.brief.file + ' not accepted by a PM ledger line');
  return s;
}

// ------------------------------------------- 2. the single-parent immutable chain
function parent(s) {
  for (const o of s.parent.options) {
    keys(o, ['id', 'artifact', 'sha256', 'review', 'receiptLedgerLine', 'note'], 'Parent option ' + o.id);
    if (!o.sha256) { say('PARENT OPTION ' + o.id + ' ' + o.artifact + ' NOT-YET-SEALED (' + o.note + ')'); continue; }
    const raw = fs.readFileSync(path.join(root, o.artifact));
    assert.equal(sha(raw), o.sha256, 'Parent artifact bytes ' + o.id);
    const a = J.parseExact(raw), review = J.parseExact(fs.readFileSync(path.join(root, o.review)));
    assert.equal(review.status, 'ACCEPTED', 'Parent independently accepted ' + o.id);
    const r = review.receipt; assert(r && typeof r.commit === 'string', 'Parent receipt ' + o.id);
    L.verifyReceipt(root, r.commit, r, { role: 'cowork' });
    assert(r.line.includes(o.sha256) && r.line.includes(o.artifact) && r.line.endsWith(' ACCEPTED'), 'Parent receipt content ' + o.id);
    say('PARENT OPTION ' + o.id + ' ' + a.packageId + ' ' + o.artifact + ' ' + o.sha256 +
      ' ACCEPTED at ' + r.commit + ' (DECISIONS:' + o.receiptLedgerLine + ')');
  }
  if (!s.parent.decided || !s.parent.chosen) {
    say('PARENT UNDECIDED; ' + s.parent.options.length + ' documented options; the PM names exactly one — a single-parent immutable chain cannot have two heads (PLAN-TRACK-B-PACKAGES-v1.md:146)');
    note('parent artifact not named by the PM'); return null;
  }
  const chosen = s.parent.options.find(o => o.id === s.parent.chosen);
  assert(chosen.sha256, 'Chosen parent is a sealed accepted artifact');
  const rivals = fs.readdirSync(SPEC_DIR).filter(f => f.endsWith('.json') && f !== ID + '.json')
    .map(f => J.parseExact(fs.readFileSync(path.join(SPEC_DIR, f))))
    .filter(o => o.parent.chosen && o.parent.options.find(x => x.id === o.parent.chosen).artifact === chosen.artifact);
  assert(!rivals.length, 'SINGLE-PARENT-CHAIN: ' + chosen.artifact + ' already claimed by ' + rivals.map(r => r.lanePackage).join(' '));
  say('PARENT BOUND ' + chosen.id + ' ' + chosen.artifact + ' ' + chosen.sha256 + '; single-parent chain holds');
  return chosen;
}
// Walk the accepted chain to the artifact that still carries the audit baseline
// (the closed cumulative profiles do not: M2-STEP-EFFICACY is where it lives).
function baselineOf(s, chosen) {
  let file = chosen && chosen.artifact;
  if (!file) {
    const sealed = s.parent.options.filter(o => o.sha256 && fs.existsSync(path.join(root, o.artifact)));
    if (sealed.length !== 1) return null;
    file = sealed[0].artifact;
  }
  for (let hop = 0; hop < 8; hop++) {
    const a = J.parseExact(fs.readFileSync(path.join(root, file)));
    if (a.baseline && a.baseline.publicPins && typeof a.baseline.auditCommit === 'string') return a.baseline;
    if (!a.parent || !a.parent.artifact) return null;
    file = a.parent.artifact;
  }
  return null;
}

// ------------------------------------------------ 3. product state and fidelity
function product(s) {
  const at = { pre: [], post: [], drift: [] };
  for (const [file, pin] of Object.entries(s.product)) {
    const disk = sha(fs.readFileSync(path.join(root, file)));
    if (disk === pin.pre) at.pre.push(file);
    else if (pin.post && disk === pin.post) at.post.push(file);
    else at.drift.push(file);
  }
  assert(!at.drift.length, 'UNLISTED-PRODUCT-DRIFT ' + at.drift.join(' '));
  const phase = at.post.length === 0 ? 'NOT-IMPLEMENTED' : at.pre.length === 0 ? 'IMPLEMENTED' : 'PARTIAL';
  say('PRODUCT ' + phase + '; ' + at.post.length + ' at the declared post-image / ' + at.pre.length +
    ' at the pinned pre-image / 0 unlisted drift');
  if (phase !== 'IMPLEMENTED') note('product ' + phase + ' (' + at.pre.length + ' declared file(s) still at the pinned pre-image)');
  return phase;
}
function fidelity(s) {
  L.git(root, ['merge-base', '--is-ancestor', s.sourceBase, 'HEAD']); // sourceBase is an ancestor of HEAD
  const changed = L.git(root, ['diff', '--name-only', s.sourceBase, 'HEAD', '--',
    'rebuild/engine', 'rebuild/conform', 'rebuild/m4/spec']).toString().split(/\r?\n/).filter(Boolean);
  const unlisted = changed.filter(f => !Object.hasOwn(s.product, f) && f !== s.artifact.file && f !== s.artifact.review &&
    !f.startsWith('rebuild/m4/spec/' + ID.toLowerCase() + '-') && f !== (s.carrierSuccessor && s.carrierSuccessor.file));
  assert(!unlisted.length, 'UNLISTED-SOURCE-CHANGE ' + unlisted.join(' '));
  // PIN_PATHS agree between Git and disk at HEAD (run.cjs:8's own inventory).
  const dirty = L.git(root, ['status', '--porcelain', '--', ...PIN_PATHS]).toString().split(/\r?\n/).filter(Boolean);
  assert(!dirty.length, 'PIN-PATHS-GIT-DISK-DISAGREE ' + dirty.length + ' path(s)');
  say('FIDELITY OBSERVED; sourceBase ' + s.sourceBase.slice(0, 7) + ' ancestor of HEAD ' +
    L.git(root, ['rev-parse', '--short', 'HEAD']).toString().trim() + '; ' + changed.length +
    ' engine/conform/m4-spec file(s) changed since sourceBase, all declared; ' + PIN_PATHS.length + ' PIN_PATHS byte-identical Git vs disk');
}
// --------------------------------------------------------- 4. the 45 register laws
function laws(s, bundles, phase) {
  const env = { ...process.env, NODE_OPTIONS: '', NODE_V8_COVERAGE: '', TZ: 'America/New_York', MEASURED_TEST_NOW: '2026-09-03', ENGINE_MAIN: bundles.main, ENGINE_OLD: bundles.old };
  for (const key of ['PL_ENGINE', 'PL_LAWS_LIB', 'CONFORM_MUTATE_LAWS', 'CONFORM_ADAPTERS_DIR']) delete env[key];
  const r = cp.spawnSync(process.execPath, ['rebuild/conform/v4/run-defect-laws.cjs'],
    { cwd: root, env, encoding: 'utf8', windowsHide: true, timeout: 1800000, maxBuffer: 32 * 1024 * 1024 });
  fs.writeFileSync(path.join(logDir, 'defect-laws.log'), (r.stdout || '') + (r.stderr || ''));
  assert(!r.error && r.stdout, 'Required 45-law red-first execution');
  const rows = new Map(), lines = r.stdout.split(/\r?\n/);
  for (const line of lines) {
    const m = /^(D\d+) (\S+) \S (RED|GREEN|THROWS)-frozen \/ (RED|GREEN|THROWS)-candidate \/ (mutant-DETECTED|AUDIT-FAIL)$/.exec(line);
    if (m) rows.set(m[1], { id: m[2], frozen: m[3], candidate: m[4], mutants: m[5] });
  }
  assert.equal(rows.size, 45, 'All 45 register laws executed');
  const total = lines.filter(line => line.startsWith('TOTAL 45 laws')).at(-1);
  assert(total, 'Audit total line');
  say('LAWS 45/45 executed | ' + total);
  const want = d => s.dIds.includes(d) ? (phase === 'IMPLEMENTED' ? 'GREEN' : 'RED') : CARRIED.includes(d) ? 'GREEN' : 'RED';
  let agree = 0;
  for (const [d, row] of rows) {
    if (s.dIds.includes(d)) assert.equal(row.id, s.laws[d], 'Declared law id for ' + d);
    const expected = want(d), bad = row.frozen !== 'RED' || row.candidate !== expected;
    if (s.dIds.includes(d) || bad) say('LAW ' + d + ' ' + row.id + ' ' + row.frozen + '-frozen / ' + row.candidate +
      '-candidate / ' + row.mutants + ' | declared RED-frozen / ' + expected + '-candidate' + (bad ? ' MISMATCH' : ''));
    if (bad) note('law ' + d + ' is ' + row.candidate + '-candidate where ' + expected + '-candidate is declared'); else agree++;
  }
  say('LAWS DECLARED-STATE ' + agree + '/45 rows agree with the spec at product phase ' + phase +
    '; the package D-ids must be GREEN-candidate / RED-frozen before any receipt');
  return env;
}

// ---------------------------- 5. witness carriers, coverage moves and own children
function carriers(s) {
  const sites = new Set(s.witnessFlips.map(f => f.file + ':' + f.line)).size;
  const flips = s.witnessFlips.length;
  assert.equal(sites, flips, 'One declared flip per witness assertion site');
  if (!s.carrierSuccessor) {
    say('CARRIERS NONE DECLARED; ' + flips + ' witness flip(s) declared');
    if (flips) note('witness flips are declared with no carrier successor named');
    return;
  }
  keys(s.carrierSuccessor, ['file', 'parent', 'witnessPins'], 'Carrier successor');
  for (const [file, hash] of Object.entries(s.carrierSuccessor.witnessPins))
    assert.equal(sha(fs.readFileSync(path.join(root, file))), hash, 'Pinned frozen witness input stays byte-identical: ' + file);
  const there = fs.existsSync(path.join(root, s.carrierSuccessor.file));
  say('CARRIERS ' + (there ? 'PRESENT' : 'PENDING') + ' ' + s.carrierSuccessor.file + '; successor of ' + s.carrierSuccessor.parent +
    '; ' + flips + ' exact expectation substitution(s) at ' + sites + ' assertion site(s); ' +
    Object.keys(s.carrierSuccessor.witnessPins).length + ' frozen witness file(s) byte-identical (never edited)');
  if (!there) note('carrier successor ' + s.carrierSuccessor.file + ' not authored');
  for (const [gate, child] of Object.entries(s.coverage.moves))
    say('COVERAGE MOVE ' + gate + ' run -> covered byChild ' + child + '; the frozen witness file stays byte-identical');
}
function children(s, env) {
  if (!s.children.length) {
    say('CHILDREN PENDING; the package declares no own children yet (source carriers, traces, direct cases, witnesses, mutants, bites, second gate)');
    note('package children not authored'); return;
  }
  for (const c of s.children) {
    const r = cp.spawnSync(process.execPath, c.argv, { cwd: root, env, encoding: 'utf8', windowsHide: true, timeout: 1800000, maxBuffer: 32 * 1024 * 1024 });
    fs.writeFileSync(path.join(logDir, c.name + '.log'), (r.stdout || '') + (r.stderr || ''));
    assert(!r.error && r.status === 0 && r.stdout.includes(c.needle), 'Required child ' + c.name);
    say('CHILD ' + c.name + ' OBSERVED; exit 0 and exact declared verdict');
  }
}
// ------------------------------------------- 6. the authorized-envelope gate (PASS)
// Returns [authorized, lines]; the caller prints the POSTFIX header first.
function envelope(s) {
  const said = [], say = line => said.push('B PACKAGE ' + ID + ' ' + line);
  const file = path.join(root, s.artifact.file), reviewFile = path.join(root, s.artifact.review);
  if (!fs.existsSync(file) || !fs.existsSync(reviewFile)) {
    say('ENVELOPE ABSENT; ' + s.artifact.file + ' is not sealed yet — no PASS word is available');
    note('closed cumulative profile not sealed', false); return [false, said];
  }
  const raw = fs.readFileSync(file), artifact = J.parseExact(raw), hash = sha(raw);
  assert.equal(artifact.packageId, s.packageId, 'Artifact package identity');
  const review = J.parseExact(fs.readFileSync(reviewFile));
  keys(review, ['version', 'status', 'receipt'], 'Review envelope');
  assert.equal(review.version, 1); assert(['PENDING', 'ACCEPTED'].includes(review.status), 'Review status is PENDING or ACCEPTED');
  if (review.status === 'PENDING') {
    assert.equal(review.receipt, null, 'PENDING carries no receipt');
    say('ENVELOPE PENDING artifact=' + hash + '; independent exact-artifact acceptance required');
    note('independent exact-artifact acceptance PENDING', false); return [false, said];
  }
  const r = review.receipt; assert(r && typeof r.commit === 'string', 'Missing independent receipt');
  assert(s.authorizations.theme, 'THEME-AUTHORIZATION-UNAVAILABLE'); // no PASS before the brief's own ledger line is bound
  L.verifyReceipt(root, r.commit, r, { role: 'cowork' });
  for (const claim of [s.authorizations.owner, s.authorizations.theme])
    L.verifyReceipt(root, r.commit, { commit: r.commit, path: 'rebuild/DECISIONS.md', line: claim.line, lineSha256: claim.lineSha256 }, { role: claim.role });
  const re = new RegExp('^(?:- [^\\r\\n]+ )?POSTFIX-ACCEPTANCE ' + s.packageId + ' ([a-f0-9]{40}) (' +
    s.artifact.file.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + ') ([a-f0-9]{64}) ACCEPTED$');
  const m = re.exec(r.line);
  assert(m && m[3] === hash, 'Exact independent verdict naming these artifact bytes');
  assert(L.object(root, m[1], s.artifact.file).equals(raw), 'Reviewed artifact bytes');
  L.git(root, ['merge-base', '--is-ancestor', m[1], 'HEAD']);
  L.git(root, ['merge-base', '--is-ancestor', r.commit, 'refs/remotes/origin/rebuild/t2-client-core']);
  say('ENVELOPE AUTHORIZED artifact=' + hash + ' reviewed at ' + m[1] + '; receipt base ' + r.commit);
  return [true, said];
}

// ----------------------------------------------------- 7. FULL-only: PC obligations
// run.cjs:115-117's own requirement, checked once up front so a run without the
// owner's PC reports the standing BLOCKED terminal line instead of spending the whole
// gate matrix first. gateRun() still enforces it independently inside migrate-full.
// Existence only: the private blob is never opened, read, hashed or quoted.
function privateOracle() {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'rebuild/conform/oracle/manifest.json')));
  const live = path.join(root, 'rebuild/conform/private/live.json');
  const golden = path.join(root, 'rebuild/conform', manifest.goldens['live.main'].path);
  if (!fs.existsSync(live) || !fs.existsSync(golden))
    throw Object.assign(new Error('REQUIRED-PRIVATE-PREPARATION-MISSING'), { code: 'REQUIRED-PRIVATE-PREPARATION-MISSING' });
  say('PRIVATE ORACLE PRESENT; verdict-only reporting — no private values, counts, hashes or prose leave this machine');
}
// An exact public-code snapshot of the audit baseline, not a replacement engine.
function historical(s, chosen, bundles) {
  const baseline = baselineOf(s, chosen);
  if (!baseline) { say('HISTORICAL AUDIT SKIPPED; the chain baseline is unresolved until the PM names the parent'); note('historical audit baseline unresolved'); return; }
  const dir = fs.mkdtempSync(path.join(logDir, 'original-audit-'));
  try {
    const files = Object.entries(baseline.publicPins).filter(([file]) => file.startsWith('rebuild/engine/') || /^rebuild\/conform\/v4\/[^/]+\.cjs$/.test(file));
    assert(files.some(([file]) => file === 'rebuild/conform/v4/run-defect-laws.cjs'), 'Baseline carries the audit runner');
    for (const [file, hash] of files) {
      const bytes = L.object(root, baseline.auditCommit, file); assert.equal(sha(bytes), hash, 'Pinned baseline byte: ' + file);
      const out = path.join(dir, file); assert(out.startsWith(dir + path.sep));
      fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, bytes);
    }
    say('HISTORICAL ' + L.historicalAudit({ baseline: dir, bundles }).replace(/\bPASS\b/g, 'OBSERVED'));
  } finally { assert(path.resolve(dir).startsWith(logDir + path.sep)); fs.rmSync(dir, { recursive: true, force: true }); }
}
function gates(s, bundles, authorized) {
  const covered = new Map([...Object.entries(s.coverage.inherited), ...Object.entries(s.coverage.moves)]);
  for (const [gate, child] of covered) {
    const there = fs.existsSync(path.join(root, 'rebuild/m4/spec/' + child + '.cjs'));
    say('ORIGINAL ' + gate + ' COVERED by child ' + child + (there ? '; frozen-source comparison carried at the package inventory' : ' — CHILD NOT AUTHORED'));
    if (!there) note('original gate ' + gate + ' is declared covered by an unauthored child ' + child);
  }
  const done = new Set(covered.keys());
  for (const gate of R.GATES) {
    if (done.has(gate[0])) continue;
    R.gateRun(root, bundles, gate, { emit: line => console.log(line.replace(/\bPASS\b/g, authorized ? 'PASS' : 'OBSERVED')) });
    done.add(gate[0]);
  }
  assert.deepEqual([...done].sort(), GATE_IDS.slice().sort(), 'No missing or extra original gate');
  say('FULL EVIDENCE: ' + (GATE_IDS.length - covered.size) + ' of the ' + GATE_IDS.length +
    ' original gates re-executed and ' + covered.size + ' carried by named successor children; second gate included');
}

// ------------------------------------------------------------------ 8. main sequence
try {
  const s = spec();
  logDir = path.join(root, '.tmp/b-package', ID); fs.mkdirSync(logDir, { recursive: true });
  const [authorized, envelopeLines] = envelope(s);
  say('POSTFIX ' + s.packageId + ' ' + (authorized ? 'AUTHORIZED' : 'REVIEW-PENDING') + ' mode=' + args[0]);
  for (const line of envelopeLines) console.log(line);
  const chosen = parent(s);
  const phase = product(s);
  fidelity(s);
  say('PROTECTED SURFACES ' + s.protectedSurfaces.length + ' declared, verdict-only UNCHANGED: ' + s.protectedSurfaces.join(' | '));
  say('PRIVATE LIVE-TRIGGERED ' + (s.privateLiveTriggered.length ? s.privateLiveTriggered.join(' ') : 'none') +
    '; a census change on any other declared D-id is a RED stop for a reviewed successor cell, never a golden regeneration');
  const bundles = Reference.create(root); // pinned public reference bundles, built before any candidate factory loads
  const env = laws(s, bundles, phase);
  carriers(s);
  children(s, env);
  if (ci) {
    const blocking = open.filter(o => o.ciBlocking);
    for (const o of open) say('OPEN ' + o.reason);
    if (blocking.length) { say('CI REVIEW-PENDING: ' + blocking.length + ' open obligation(s); public evidence only; no PASS is claimed'); process.exitCode = 2; }
    else { say('PUBLIC CI EVIDENCE PASS; the 19 original gates, the private oracle and independent exact-artifact acceptance remain separate'); process.exitCode = 0; }
  } else {
    privateOracle();
    historical(s, chosen, bundles);
    gates(s, bundles, authorized);
    for (const o of open) say('OPEN ' + o.reason);
    const ready = authorized && !open.length;
    say(ready ? 'POSTFIX PACKAGE PASS ' + s.packageId
      : 'POSTFIX PACKAGE REVIEW-PENDING: ' + open.length + ' open obligation(s); independent exact-artifact acceptance required');
    process.exitCode = ready ? 0 : 2;
  }
} catch (error) {
  const blocked = BLOCKED.includes(error && error.code);
  console.error(blocked ? 'B PACKAGE ' + ID + ' BLOCKED ' + error.code
    : 'B PACKAGE ' + ID + ' FAIL; required evidence missing or failed; local diagnostics withheld');
  process.exitCode = blocked ? 2 : 1;
}
