'use strict';
// LANE B closed-package tooling — ONE generic runner for B1..B4.
// Usage: node rebuild/lanes/b/tooling/b-package.cjs --ci|--full --package <B1|B2|B3|B4>
//
// The SUBSTANTIVE requirements live in the spec packages/<id>.json, bound BY BYTES — the
// split BRIEF-IMPORT-GUARDS.md §3 requires: the reviewed spec pins THIS FILE's sha256
// (tooling.runnerSha256), and the sealed artifact acceptance-<slug>.json — written by the
// PM's integrator, never by this tooling — embeds the canonical spec bytes' sha256, this
// runner's sha256, the product map and the executionPins; envelope() recomputes it
// (same(m,proposed())) and re-reads every pinned byte from Git at the reviewed commit.
// Neither file pins itself. Everything executable is REQUIRED from the immutable
// originals (run.cjs GATES + gateRun, legacy-gates.cjs, target.cjs, strict-json.cjs,
// native-carriers-errors.cjs, load-write-reference.cjs), never copied. Two modes, no
// third: --ci is public evidence only; --full adds the private oracle, the historical
// 45-law audit and the 19 original gates. A gate counts as COVERED only when a DECLARED
// child actually executed in this process, exit 0, with its exact declared verdict
// matched — never on a file's existence. No PASS word without an ACCEPTED envelope
// naming the exact artifact bytes (DECISIONS:86-87). README.md carries the long form.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../../..'), P = path.join(root, 'rebuild/conform/v4/postfix');
const R = require(path.join(P, 'run.cjs')), L = require(path.join(P, 'legacy-gates.cjs')), J = require(path.join(P, 'strict-json.cjs'));
const { sha } = require(path.join(P, 'target.cjs'));
const BLOCKED = require(path.join(root, 'rebuild/m4/spec/native-carriers-errors.cjs')).codes; // the original closed BLOCKED list
const Reference = require(path.join(root, 'rebuild/m4/spec/load-write-reference.cjs'));
const TOOLING = 'rebuild/lanes/b/tooling', RUNNER = TOOLING + '/b-package.cjs';
const SPEC_DIR = path.join(__dirname, 'packages'), IDS = ['B1', 'B2', 'B3', 'B4'];
// W7: every exemption is fixed HERE and nowhere else — the lane-B tooling inventory, the
// roots a declared child may execute from, and (in spec()) the artifact/review paths the
// package id itself determines. A spec can never nominate its own exempt path.
const TOOLING_FILES = [RUNNER, TOOLING + '/README.md', TOOLING + '/TOOLING-REPORT.md', ...IDS.map(i => TOOLING + '/packages/' + i + '.json')];
const CHILD_ROOTS = ['rebuild/m4/spec/', 'rebuild/conform/v4/postfix/', 'rebuild/engine/test/', 'rebuild/m4/workout/test/', 'rebuild/m3/w7-preview/test/'];
const NO_INLINE = /^(?:-e|--eval|-p|--print|--input-type|-r|--require|--import)$/; // a child never runs inline code
const CARRIED = ['D12', 'D33', 'D34', 'D35', 'D41', 'D43']; // repaired by the accepted parents (DECISIONS:87, :93)
const GATE_IDS = R.GATES.map(g => g[0]);
// run.cjs exports GATES and gateRun but not its PIN_PATHS inventory; derive it from the
// immutable source the way native-carriers-errors.cjs derives the blocked code list.
const PIN_PATHS = (() => {
  const m = [...fs.readFileSync(path.join(P, 'run.cjs'), 'utf8').matchAll(/^const PIN_PATHS=(\[[^\]]+\]);$/gm)];
  assert.equal(m.length, 1, 'Original closed PIN_PATHS inventory');
  const list = JSON.parse(m[0][1].replaceAll("'", '"'));
  assert(list.length && new Set(list).size === list.length, 'PIN_PATHS inventory'); return list;
})();
const args = process.argv.slice(2);
// Exactly two modes, exactly one package; no third mode, no defaulting, case-exact ids.
if (!(args.length === 3 && ['--full', '--ci'].includes(args[0]) && args[1] === '--package' && IDS.includes(args[2]))) {
  console.error('B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B1|B2|B3|B4'); process.exit(1);
}
const ci = args[0] === '--ci', ID = args[2];
const say = line => console.log('B PACKAGE ' + ID + ' ' + line);
const open = [], note = (reason, ciBlocking = true) => { open.push({ reason, ciBlocking }); };
const keys = (o, list, label) => assert.deepEqual(Object.keys(o).sort(), list.slice().sort(), label);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rel = file => path.join(root, file), diskSha = file => sha(fs.readFileSync(rel(file)));
const argvFiles = argv => argv.filter(a => !a.startsWith('-'));
let logDir, ARTIFACT, REVIEW, specRaw;

// ---------------------------------------------------------------- 1. the spec
const SPEC_KEYS = ['version', 'lanePackage', 'packageId', 'status', 'brief', 'sourceBase', 'dIds', 'laws', 'carriedAcceptedIds',
  'privateLiveTriggered', 'parent', 'tooling', 'product', 'coverage', 'carrierSuccessor', 'witnessFlips', 'protectedSurfaces',
  'authorizations', 'artifact', 'children', 'notes'];
const CLAIM_KEYS = ['ledgerLine', 'role', 'line', 'lineSha256'];
function claim(v, role, label) { // a ledger citation whose text hashes to the sha it names
  keys(v, CLAIM_KEYS, 'Authorization claim ' + label);
  assert(Number.isInteger(v.ledgerLine) && v.ledgerLine > 0 && v.role === role, 'Claim coordinates ' + label);
  assert(typeof v.line === 'string' && !/[\r\n]/.test(v.line) && /^[a-f0-9]{64}$/.test(v.lineSha256) && sha(Buffer.from(v.line)) === v.lineSha256, 'LEDGER-LINE-SHA256 ' + label);
}
function spec() {
  specRaw = fs.readFileSync(path.join(SPEC_DIR, ID + '.json'));
  const s = J.parseExact(specRaw); // exact reviewed bytes + duplicate-decoded-key refusal
  keys(s, SPEC_KEYS, 'Closed package-spec keys');
  assert.equal(s.version, 1); assert.equal(s.lanePackage, ID);
  assert(/^M2-B[1-4]-[A-Z0-9-]+$/.test(s.packageId), 'Package id shape');
  assert(['SKELETON', 'PROPOSED', 'BRIEF-ACCEPTED'].includes(s.status), 'Spec status');
  keys(s.brief, ['file', 'sha256', 'acceptedLedgerLine'], 'Brief citation');
  assert(/^[a-f0-9]{40}$/.test(s.sourceBase), 'sourceBase is a commit');
  assert(Array.isArray(s.dIds) && s.dIds.length && new Set(s.dIds).size === s.dIds.length && s.dIds.every(d => /^D([1-9]|[1-3][0-9]|4[0-5])$/.test(d)) &&
    !s.dIds.some(d => CARRIED.includes(d)), 'D-id inventory: unique, in range, never a already-repaired id');
  assert.deepEqual(Object.keys(s.laws).sort(), s.dIds.slice().sort(), 'Exactly one law id per D-id');
  assert.deepEqual(s.carriedAcceptedIds, CARRIED, 'Carried accepted ids');
  assert(Array.isArray(s.privateLiveTriggered) && s.privateLiveTriggered.every(d => s.dIds.includes(d)), 'LIVE-triggered subset');
  keys(s.parent, ['decided', 'chosen', 'options'], 'Parent block');
  assert(typeof s.parent.decided === 'boolean' && Array.isArray(s.parent.options) && s.parent.options.length, 'Parent options');
  assert(s.parent.chosen === null || s.parent.options.some(o => o.id === s.parent.chosen), 'Chosen parent is an option');
  // W1. This runner's bytes are bound by the REVIEWED SPEC — not by itself, not by a list
  // it writes. An injected line here refuses before anything else executes.
  keys(s.tooling, ['runner', 'runnerSha256'], 'Tooling pin');
  assert.equal(s.tooling.runner, RUNNER, 'Tooling pin names this runner');
  assert.equal(diskSha(RUNNER), s.tooling.runnerSha256, 'RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER');
  for (const [file, pin] of Object.entries(s.product)) {
    keys(pin, ['pre', 'post', 'role'], 'Product pin ' + file);
    assert(/^[a-f0-9]{64}$/.test(pin.pre) && (pin.post === null || /^[a-f0-9]{64}$/.test(pin.post)), 'Product sha256 ' + file);
    assert(['edited', 'carried', 'new'].includes(pin.role) && (pin.role !== 'carried' || pin.pre === pin.post), 'Product role ' + file);
  }
  // W3. Each declared child is schema-checked, its needle is non-empty, and its argv
  // executes a real file under a fixed root — never inline code, never a no-op.
  const names = new Set();
  for (const c of s.children) {
    keys(c, ['name', 'argv', 'needle'], 'Declared child');
    assert(typeof c.name === 'string' && /^[a-z0-9][a-z0-9-]{1,39}$/.test(c.name) && !names.has(c.name), 'Child name');
    names.add(c.name);
    assert(typeof c.needle === 'string' && c.needle.trim().length >= 8, 'CHILD-NEEDLE-EMPTY ' + c.name);
    assert(Array.isArray(c.argv) && c.argv.length && c.argv.every(a => typeof a === 'string' && a.length && !NO_INLINE.test(a)), 'Child argv ' + c.name);
    const targets = argvFiles(c.argv);
    assert(targets.length, 'CHILD-ARGV-EXECUTES-NO-FILE ' + c.name);
    for (const f of targets) assert(!path.isAbsolute(f) && !f.includes('..') && CHILD_ROOTS.some(r => f.startsWith(r)) && fs.existsSync(rel(f)), 'CHILD-ARGV-TARGET ' + c.name + ' ' + f);
  }
  // W2. A covering child is a DECLARED child by name; its EXECUTION is what covers a gate.
  keys(s.coverage, ['inherited', 'moves'], 'Coverage block');
  for (const [gate, child] of [...Object.entries(s.coverage.inherited), ...Object.entries(s.coverage.moves)]) {
    assert(GATE_IDS.includes(gate), 'Covered gate is an original gate: ' + gate);
    assert(typeof child === 'string' && names.has(child), 'COVERAGE-CHILD-NOT-DECLARED ' + gate + ' ' + child);
  }
  assert(!Object.keys(s.coverage.moves).some(g => Object.hasOwn(s.coverage.inherited, g)), 'A gate is inherited-covered or moved, never both');
  for (const flip of s.witnessFlips) keys(flip, ['file', 'line', 'from', 'to'], 'Witness flip');
  keys(s.authorizations, ['owner', 'contract', 'theme', 'review'], 'Closed authorization keys');
  claim(s.authorizations.owner, 'owner', 'owner'); claim(s.authorizations.contract, 'cowork', 'contract');
  if (s.authorizations.theme !== null) {
    claim(s.authorizations.theme, 'cowork', 'theme');
    assert(s.authorizations.theme.line.includes(s.packageId) && s.authorizations.theme.line.endsWith(' · ACCEPTED'), 'Theme line binds this package id');
  }
  keys(s.authorizations.review, ['role', 'prefix', 'terminal'], 'Review claim');
  assert(s.authorizations.review.role === 'cowork' && s.authorizations.review.terminal === 'ACCEPTED' &&
    s.authorizations.review.prefix === 'POSTFIX-ACCEPTANCE ' + s.packageId, 'Review claim binds this package id');
  const slug = s.packageId.replace(/^M2-/, '').toLowerCase(); // W7: derived here, only agreed to by the spec
  ARTIFACT = 'rebuild/m4/spec/acceptance-' + slug + '.json'; REVIEW = 'rebuild/m4/spec/review-' + slug + '.json';
  keys(s.artifact, ['file', 'review'], 'Artifact coordinates');
  assert.equal(s.artifact.file, ARTIFACT, 'Artifact path is the one this package id determines');
  assert.equal(s.artifact.review, REVIEW, 'Review path is the one this package id determines');
  say('SPEC OBSERVED packages/' + ID + '.json ' + sha(specRaw) + '; runner ' + s.tooling.runnerSha256 + '; status=' + s.status +
    '; ' + s.dIds.length + ' D-ids ' + s.dIds.join('>') + '; ' + Object.keys(s.product).length + ' declared product files; ' +
    s.children.length + ' declared child(ren)');
  if (fs.existsSync(rel(s.brief.file))) assert.equal(diskSha(s.brief.file), s.brief.sha256, 'Brief bytes');
  else note('brief ' + s.brief.file + ' not authored');
  if (s.status !== 'BRIEF-ACCEPTED' || !s.brief.acceptedLedgerLine) note('brief ' + s.brief.file + ' not accepted by a PM ledger line');
  return s;
}

// ------------------------------------------- 2. the single-parent immutable chain
const RECEIPT = /^(?:- [^\r\n]+ )?POSTFIX-ACCEPTANCE (\S+) ([a-f0-9]{40}) (\S+) ([a-f0-9]{64}) ACCEPTED$/;
// One sealed option, fully verified: artifact bytes on disk, the independent ACCEPTED
// envelope, the receipt line by its own sha256 at its base, and — W4 — the artifact bytes
// as they stand IN GIT at the commit that receipt names as reviewed.
function option(o) {
  keys(o, ['id', 'artifact', 'sha256', 'review', 'receiptLedgerLine', 'note'], 'Parent option ' + o.id);
  if (!o.sha256) { say('PARENT OPTION ' + o.id + ' ' + o.artifact + ' NOT-YET-SEALED (' + o.note + ')'); return null; }
  const raw = fs.readFileSync(rel(o.artifact));
  assert.equal(sha(raw), o.sha256, 'Parent artifact bytes ' + o.id);
  const acceptance = J.parseExact(raw), review = J.parseExact(fs.readFileSync(rel(o.review)));
  assert.equal(review.status, 'ACCEPTED', 'Parent independently accepted ' + o.id);
  const r = review.receipt; assert(r && typeof r.commit === 'string', 'Parent receipt ' + o.id);
  L.verifyReceipt(root, r.commit, r, { role: 'cowork', mentions: [o.sha256, o.artifact] });
  const m = RECEIPT.exec(r.line);
  assert(m && m[1] === acceptance.packageId && m[3] === o.artifact && m[4] === o.sha256, 'Parent receipt content ' + o.id);
  assert.equal(sha(L.object(root, m[2], o.artifact)), o.sha256, 'Parent artifact bytes in Git at its reviewed commit ' + o.id);
  L.git(root, ['merge-base', '--is-ancestor', m[2], 'HEAD']);
  say('PARENT OPTION ' + o.id + ' ' + acceptance.packageId + ' ' + o.artifact + ' ' + o.sha256 + ' ACCEPTED at ' + m[2] +
    ' (DECISIONS:' + o.receiptLedgerLine + '); bytes identical on disk and in Git');
  return { option: o, acceptance, reviewedCommit: m[2], receiptBase: r.commit };
}
function parent(s) {
  const sealed = s.parent.options.map(option).filter(Boolean);
  if (!s.parent.decided || !s.parent.chosen) {
    say('PARENT UNDECIDED; ' + s.parent.options.length + ' documented options; the PM names exactly one — a single-parent immutable chain cannot have two heads (PLAN-TRACK-B-PACKAGES-v1.md:146)');
    note('parent artifact not named by the PM');
    if (sealed.length !== 1) { note('no single sealed chain head on disk; parent pins, product inventory and inherited coverage are unverifiable'); return null; }
    say('PARENT PROVISIONAL ' + sealed[0].option.id + '; the one sealed chain head on disk carries the pins re-asserted below — it is NOT a claim on the chain');
    return { ...sealed[0], decided: false };
  }
  const bound = sealed.find(x => x.option.id === s.parent.chosen);
  assert(bound, 'Chosen parent is a sealed accepted artifact');
  const rivals = fs.readdirSync(SPEC_DIR).filter(f => f.endsWith('.json') && f !== ID + '.json')
    .map(f => J.parseExact(fs.readFileSync(path.join(SPEC_DIR, f))))
    .filter(o => o.parent.chosen && o.parent.options.find(x => x.id === o.parent.chosen).artifact === bound.option.artifact);
  assert(!rivals.length, 'SINGLE-PARENT-CHAIN: ' + bound.option.artifact + ' already claimed by ' + rivals.map(r => r.lanePackage).join(' '));
  say('PARENT BOUND ' + bound.option.id + ' ' + bound.option.artifact + ' ' + bound.option.sha256 + '; single-parent chain holds');
  return { ...bound, decided: true };
}
// W4. Every parent pin still holds, and every grandparent pin the parent did not supersede
// still holds — the check native-carriers-profile.cjs performs in parent() and
// grandparent(), which fidelity()'s tree diff cannot substitute for. The parent's own
// product map is re-asserted by product(), which owns every file this spec declares.
function pins(s, bound) {
  if (!bound) { note('parent and grandparent artifact pins not re-asserted'); return; }
  const a = bound.acceptance; let kept = 0, gkept = 0;
  for (const [file, hash] of Object.entries({ ...a.product, ...a.executionPins })) {
    if (Object.hasOwn(s.product, file)) continue;
    assert.equal(diskSha(file), hash, 'PARENT-PIN-BROKEN ' + file); kept++;
  }
  const g = a.parent;
  assert(g && typeof g.artifact === 'string' && /^[a-f0-9]{64}$/.test(g.sha256), 'Grandparent coordinates');
  assert.equal(diskSha(g.artifact), g.sha256, 'GRANDPARENT-ARTIFACT-BYTES');
  const ga = J.parseExact(fs.readFileSync(rel(g.artifact)));
  if (g.review) {
    const gr = J.parseExact(fs.readFileSync(rel(g.review)));
    assert.equal(gr.status, 'ACCEPTED', 'Grandparent independently accepted');
    L.verifyReceipt(root, gr.receipt.commit, gr.receipt, { role: 'cowork', mentions: [g.sha256, g.artifact] });
  }
  for (const [file, hash] of Object.entries({ ...ga.product, ...ga.executionPins })) {
    if (Object.hasOwn(a.product, file) || Object.hasOwn(a.executionPins, file) || Object.hasOwn(s.product, file)) continue;
    assert.equal(diskSha(file), hash, 'GRANDPARENT-PIN-BROKEN ' + file); gkept++;
  }
  say('PARENT PINS RE-ASSERTED at run time; ' + kept + ' pin(s) from ' + bound.option.artifact + ' plus its ' +
    Object.keys(a.product).length + ' product pins through the inventory below, and ' + gkept + ' un-superseded grandparent pin(s) from ' +
    g.artifact + ', byte-identical on disk; parent artifact byte-identical in Git at ' + bound.reviewedCommit);
}
// Walk the accepted chain to the artifact that still carries the audit baseline (the
// closed cumulative profiles do not: M2-STEP-EFFICACY is where it lives).
function baselineOf(bound) {
  let file = bound && bound.option.artifact;
  for (let hop = 0; file && hop < 8; hop++) {
    const a = J.parseExact(fs.readFileSync(rel(file)));
    if (a.baseline && a.baseline.publicPins && typeof a.baseline.auditCommit === 'string') return a.baseline;
    file = a.parent && a.parent.artifact;
  }
  return null;
}

// ------------------------------------------------ 3. product state and fidelity
// W2. The inventory is checked against the PARENT's product map, not only against itself:
// a pre-image that is not the parent's pinned byte, and a parent-pinned file this spec
// drops from its inventory, are both UNLISTED-PRODUCT-DRIFT.
function product(s, bound) {
  const pmap = bound && bound.acceptance.product, at = { pre: [], post: [], carried: [], drift: [] };
  for (const [file, pin] of Object.entries(s.product)) {
    if (pmap && Object.hasOwn(pmap, file)) assert.equal(pin.pre, pmap[file], 'UNLISTED-PRODUCT-DRIFT pre-image is not the parent pin: ' + file);
    else assert(pin.role === 'new' || !pmap, 'UNLISTED-PRODUCT-DRIFT ' + file + ' is not parent-pinned and is not declared new');
    if (pin.role === 'new' && pin.post === null && !fs.existsSync(rel(file))) { at.pre.push(file); continue; }
    const disk = diskSha(file);
    if (pin.role === 'carried') { assert.equal(disk, pin.pre, 'UNLISTED-PRODUCT-DRIFT ' + file); at.carried.push(file); }
    else if (disk === pin.pre) at.pre.push(file);
    else if (pin.post && disk === pin.post) at.post.push(file);
    else at.drift.push(file);
  }
  assert(!at.drift.length, 'UNLISTED-PRODUCT-DRIFT ' + at.drift.join(' '));
  if (!pmap) note('product inventory completeness unverified until the PM names the parent');
  else for (const file of Object.keys(pmap))
    assert(Object.hasOwn(s.product, file), 'UNLISTED-PRODUCT-DRIFT ' + file + ' is pinned by the parent and is not in this product inventory');
  const phase = at.post.length === 0 ? 'NOT-IMPLEMENTED' : at.pre.length === 0 ? 'IMPLEMENTED' : 'PARTIAL';
  say('PRODUCT ' + phase + '; ' + at.post.length + ' at the declared post-image / ' + at.pre.length + ' at the pinned pre-image / ' + at.carried.length +
    ' carried byte-identical from the parent / 0 unlisted drift' + (pmap ? '; the inventory covers all ' + Object.keys(pmap).length + ' parent-pinned product files' : ''));
  if (phase !== 'IMPLEMENTED') note('product ' + phase + ' (' + at.pre.length + ' declared file(s) still at the pinned pre-image)');
  return phase;
}
// W1. The tooling directory is inside the change check: the spec and the runner are
// evidence, so a committed change to either — or a new file smuggled beside them — is
// visible here, and their BYTES are pinned by the reviewed spec and the sealed artifact.
function fidelity(s, sealed) {
  L.git(root, ['merge-base', '--is-ancestor', s.sourceBase, 'HEAD']); // sourceBase is an ancestor of HEAD
  const changed = L.git(root, ['diff', '--name-only', s.sourceBase, 'HEAD', '--', 'rebuild/engine', 'rebuild/conform', 'rebuild/m4/spec', TOOLING]).toString().split(/\r?\n/).filter(Boolean);
  const targets = new Set(s.children.flatMap(c => argvFiles(c.argv)));
  const unlisted = changed.filter(f => !(Object.hasOwn(s.product, f) || f === ARTIFACT || f === REVIEW || TOOLING_FILES.includes(f) || targets.has(f) || f === (s.carrierSuccessor && s.carrierSuccessor.file)));
  assert(!unlisted.length, 'UNLISTED-SOURCE-CHANGE ' + unlisted.join(' '));
  assert.equal(diskSha(RUNNER), s.tooling.runnerSha256, 'RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER');
  if (sealed) { assert.equal(sealed.runner.sha256, diskSha(RUNNER), 'SEALED-RUNNER-BYTES-CHANGED'); assert.equal(sealed.spec.sha256, sha(specRaw), 'SEALED-SPEC-BYTES-CHANGED'); }
  const dirty = L.git(root, ['status', '--porcelain', '--', ...PIN_PATHS]).toString().split(/\r?\n/).filter(Boolean);
  assert(!dirty.length, 'PIN-PATHS-GIT-DISK-DISAGREE ' + dirty.length + ' path(s)');
  say('FIDELITY OBSERVED; sourceBase ' + s.sourceBase.slice(0, 7) + ' ancestor of HEAD ' + L.git(root, ['rev-parse', '--short', 'HEAD']).toString().trim() + '; ' + changed.length +
    ' engine/conform/m4-spec/lane-b-tooling file(s) changed since sourceBase, all in the fixed inventory; runner ' + s.tooling.runnerSha256.slice(0, 12) + ' and spec ' +
    sha(specRaw).slice(0, 12) + ' pinned' + (sealed ? ' inside the sealed artifact' : ' (artifact not sealed yet)') + '; ' + PIN_PATHS.length + ' PIN_PATHS byte-identical Git vs disk');
}
// W6. The owner and contract ledger lines are found as EXACT LINE BYTES in
// rebuild/DECISIONS.md at a real chain commit, under their own roles and with content
// mentions; the contract must additionally BE the parent artifact's own contract line.
function authority(s, bound) {
  const theme = s.authorizations.theme;
  if (!theme) note('theme ledger line accepting this brief is null (THEME-AUTHORIZATION-UNAVAILABLE before any receipt)');
  if (!bound) { note('owner and contract ledger lines not verified at a chain commit'); return; }
  const at = bound.receiptBase;
  for (const [v, mentions] of [[s.authorizations.owner, ['M2-RULE']], [s.authorizations.contract, ['POSTFIX-GATE BRIEF']]])
    L.verifyReceipt(root, at, { commit: at, path: 'rebuild/DECISIONS.md', line: v.line, lineSha256: v.lineSha256 }, { role: v.role, mentions });
  assert.equal(s.authorizations.contract.lineSha256, bound.acceptance.authorizations.contract.lineSha256, 'INHERITED-CONTRACT-AUTHORIZATION');
  say('AUTHORITY OBSERVED owner DECISIONS:' + s.authorizations.owner.ledgerLine + ' and contract DECISIONS:' + s.authorizations.contract.ledgerLine +
    ' present as exact ledger line bytes at ' + at.slice(0, 7) + ' under their own roles; contract inherited byte-equal from the parent; theme ' +
    (theme ? 'DECISIONS:' + theme.ledgerLine : 'NULL — no PASS word is available'));
}

// --------------------------------------------------------- 4. the 45 register laws
function laws(s, bundles, phase) {
  const env = { ...process.env, NODE_OPTIONS: '', NODE_V8_COVERAGE: '', TZ: 'America/New_York', MEASURED_TEST_NOW: '2026-09-03', ENGINE_MAIN: bundles.main, ENGINE_OLD: bundles.old, EARNED_CLIENT_DIR: path.join(root, 'rebuild/client') };
  for (const key of ['PL_ENGINE', 'PL_LAWS_LIB', 'CONFORM_MUTATE_LAWS', 'CONFORM_ADAPTERS_DIR']) delete env[key];
  const r = cp.spawnSync(process.execPath, ['rebuild/conform/v4/run-defect-laws.cjs'], { cwd: root, env, encoding: 'utf8', windowsHide: true, timeout: 1800000, maxBuffer: 32 * 1024 * 1024 });
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
    if (s.dIds.includes(d) || bad) say('LAW ' + d + ' ' + row.id + ' ' + row.frozen + '-frozen / ' + row.candidate + '-candidate / ' + row.mutants +
      ' | declared RED-frozen / ' + expected + '-candidate' + (bad ? ' MISMATCH' : ''));
    if (bad) note('law ' + d + ' is ' + row.candidate + '-candidate where ' + expected + '-candidate is declared'); else agree++;
  }
  say('LAWS DECLARED-STATE ' + agree + '/45 rows agree with the spec at product phase ' + phase +
    '; the package D-ids must be GREEN-candidate / RED-frozen before any receipt');
  return env;
}

// ---------------------------- 5. witness carriers, executed children, gate coverage
function carriers(s) {
  const sites = new Set(s.witnessFlips.map(f => f.file + ':' + f.line)).size, flips = s.witnessFlips.length;
  assert.equal(sites, flips, 'One declared flip per witness assertion site');
  if (!s.carrierSuccessor) {
    say('CARRIERS NONE DECLARED; ' + flips + ' witness flip(s) declared');
    if (flips) note('witness flips are declared with no carrier successor named');
    return;
  }
  keys(s.carrierSuccessor, ['file', 'parent', 'witnessPins'], 'Carrier successor');
  for (const [file, hash] of Object.entries(s.carrierSuccessor.witnessPins))
    assert.equal(diskSha(file), hash, 'Pinned frozen witness input stays byte-identical: ' + file);
  const there = fs.existsSync(rel(s.carrierSuccessor.file));
  say('CARRIERS ' + (there ? 'PRESENT' : 'PENDING') + ' ' + s.carrierSuccessor.file + '; successor of ' + s.carrierSuccessor.parent + '; ' +
    flips + ' exact expectation substitution(s) at ' + sites + ' assertion site(s); ' +
    Object.keys(s.carrierSuccessor.witnessPins).length + ' frozen witness file(s) byte-identical (never edited)');
  if (!there) note('carrier successor ' + s.carrierSuccessor.file + ' not authored');
}
// Every declared child runs IN THIS PROCESS and must exit 0 with its exact declared
// verdict. The returned map is the only evidence a gate may be counted as covered by.
function children(s, env) {
  const ran = new Map();
  if (!s.children.length) {
    say('CHILDREN PENDING; the package declares no own children yet (source carriers, traces, direct cases, witnesses, mutants, bites, second gate)');
    note('package children not authored'); return ran;
  }
  for (const c of s.children) {
    const r = cp.spawnSync(process.execPath, c.argv, { cwd: root, env, encoding: 'utf8', windowsHide: true, timeout: 1800000, maxBuffer: 32 * 1024 * 1024 });
    fs.writeFileSync(path.join(logDir, c.name + '.log'), (r.stdout || '') + (r.stderr || ''));
    assert(!r.error && r.status === 0 && r.stdout.includes(c.needle), 'Required child ' + c.name);
    ran.set(c.name, { ok: true, needle: c.needle });
    say('CHILD ' + c.name + ' OBSERVED; exit 0 and exact declared verdict');
  }
  return ran;
}
// W2. A gate is covered ONLY by a declared child that executed here with its exact
// declared verdict — never by a file's existence. The inherited set must be exactly the
// parent artifact's own covered set; a move is carried by this package's own successor.
function coverage(s, bound, ran) {
  const covered = new Map([...Object.entries(s.coverage.inherited), ...Object.entries(s.coverage.moves)]);
  for (const [gate, child] of covered) assert(ran.get(child) && ran.get(child).ok, 'COVERAGE-CHILD-NOT-EXECUTED ' + gate + ' ' + child);
  const byChild = bound && bound.acceptance.coverage && bound.acceptance.coverage.byChild;
  if (!byChild) { if (covered.size) note('inherited coverage unverified against a parent artifact until the PM names the parent'); }
  else assert.deepEqual(Object.keys(s.coverage.inherited).sort(), Object.keys(byChild).sort(), 'INHERITED-COVERAGE-IS-NOT-THE-PARENT-COVERED-SET');
  say('COVERAGE ' + covered.size + '/' + GATE_IDS.length + ' original gate(s) covered by ' + new Set(covered.values()).size + ' executed child(ren) (' +
    Object.keys(s.coverage.inherited).length + ' inherited, ' + Object.keys(s.coverage.moves).length + ' moved); ' +
    (GATE_IDS.length - covered.size) + ' re-execute under --full');
  // The declared verdict is never echoed: it carries the word PASS, and a REVIEW-PENDING
  // run must print that word only inside its own two negations.
  for (const [gate, child] of covered) say('COVERAGE ' + gate + ' <- child ' + child + ' executed in this run; exit 0 and exact declared verdict');
  return covered;
}

// ------------------------------------------- 6. the authorized-envelope gate (PASS)
// W1. The sealed artifact IS the substantive package: it carries the spec bytes' sha256,
// this runner's sha256, the product map and the execution pins. proposed() recomputes it
// from the spec and the bytes on disk; envelope() refuses on any mismatch. The PM's
// integrator writes acceptance-<slug>.json with exactly these bytes — this tooling never
// writes in rebuild/m4/spec.
function proposed(s, bound) {
  const pins = { [RUNNER]: diskSha(RUNNER), [TOOLING + '/packages/' + ID + '.json']: sha(specRaw) };
  if (fs.existsSync(rel(s.brief.file))) pins[s.brief.file] = diskSha(s.brief.file);
  if (s.carrierSuccessor && fs.existsSync(rel(s.carrierSuccessor.file))) pins[s.carrierSuccessor.file] = diskSha(s.carrierSuccessor.file);
  for (const c of s.children) for (const f of argvFiles(c.argv)) pins[f] = diskSha(f);
  const covered = [...Object.keys(s.coverage.inherited), ...Object.keys(s.coverage.moves)].sort(), o = bound.option;
  return {
    version: 1, lanePackage: ID, packageId: s.packageId, sourceBase: s.sourceBase,
    parent: { id: o.id, artifact: o.artifact, sha256: o.sha256, review: o.review, receiptLedgerLine: o.receiptLedgerLine, reviewedCommit: bound.reviewedCommit },
    spec: { file: TOOLING + '/packages/' + ID + '.json', sha256: sha(specRaw) }, runner: { file: RUNNER, sha256: diskSha(RUNNER) },
    dIds: s.dIds, laws: s.laws, carriedAcceptedIds: s.carriedAcceptedIds, privateLiveTriggered: s.privateLiveTriggered,
    gates: GATE_IDS.slice().sort(),
    coverage: { covered, run: GATE_IDS.filter(g => !covered.includes(g)).sort(), byChild: { ...s.coverage.inherited, ...s.coverage.moves } },
    authorizations: s.authorizations, product: s.product, carrierSuccessor: s.carrierSuccessor, witnessFlips: s.witnessFlips,
    protectedSurfaces: s.protectedSurfaces, children: s.children, artifact: { file: ARTIFACT, review: REVIEW }, executionPins: pins,
  };
}
const ARTIFACT_KEYS = ['version', 'lanePackage', 'packageId', 'sourceBase', 'parent', 'spec', 'runner', 'dIds', 'laws', 'carriedAcceptedIds',
  'privateLiveTriggered', 'gates', 'coverage', 'authorizations', 'product', 'carrierSuccessor', 'witnessFlips', 'protectedSurfaces',
  'children', 'artifact', 'executionPins'];
// Returns {authorized, said, sealed, key}; `key` identifies everything this evaluation
// depended on, and the END-of-run re-evaluation must reproduce it exactly (W5).
function envelope(s, bound) {
  const said = [], out = line => said.push('B PACKAGE ' + ID + ' ' + line);
  if (!fs.existsSync(rel(ARTIFACT)) || !fs.existsSync(rel(REVIEW))) {
    out('ENVELOPE ABSENT; ' + ARTIFACT + ' is not sealed yet — no PASS word is available');
    return { authorized: false, said, sealed: null, key: 'ABSENT' };
  }
  assert(bound && bound.decided, 'A sealed artifact requires the PM-named single parent');
  const raw = fs.readFileSync(rel(ARTIFACT)), m = J.parseExact(raw), hash = sha(raw);
  keys(m, ARTIFACT_KEYS, 'Closed acceptance-artifact keys');
  assert(same(m, proposed(s, bound)), 'SEALED-PROFILE-RECOMPUTATION: the artifact is not the spec, the runner and the pins it names');
  const review = J.parseExact(fs.readFileSync(rel(REVIEW)));
  keys(review, ['version', 'status', 'receipt'], 'Review envelope');
  assert.equal(review.version, 1); assert(['PENDING', 'ACCEPTED'].includes(review.status), 'Review status is PENDING or ACCEPTED');
  if (review.status === 'PENDING') {
    assert.equal(review.receipt, null, 'PENDING carries no receipt');
    out('ENVELOPE PENDING artifact=' + hash + ' spec=' + m.spec.sha256 + ' runner=' + m.runner.sha256 + '; independent exact-artifact acceptance required');
    return { authorized: false, said, sealed: m, key: 'PENDING:' + hash };
  }
  const r = review.receipt; assert(r && typeof r.commit === 'string', 'Missing independent receipt');
  assert(s.authorizations.theme, 'THEME-AUTHORIZATION-UNAVAILABLE'); // no PASS before the brief's own ledger line is bound
  L.verifyReceipt(root, r.commit, r, { role: 'cowork', mentions: [s.packageId, ARTIFACT, hash] });
  for (const [label, v] of Object.entries({ owner: s.authorizations.owner, contract: s.authorizations.contract, theme: s.authorizations.theme }))
    L.verifyReceipt(root, r.commit, { commit: r.commit, path: 'rebuild/DECISIONS.md', line: v.line, lineSha256: v.lineSha256 },
      { role: v.role, mentions: label === 'theme' ? [s.packageId] : label === 'owner' ? ['M2-RULE'] : ['POSTFIX-GATE BRIEF'] });
  const re = new RegExp('^(?:- [^\\r\\n]+ )?POSTFIX-ACCEPTANCE ' + s.packageId + ' ([a-f0-9]{40}) (' +
    ARTIFACT.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + ') ([a-f0-9]{64}) ACCEPTED$');
  const v = re.exec(r.line);
  assert(v && v[3] === hash, 'Exact independent verdict naming these artifact bytes');
  assert(L.object(root, v[1], ARTIFACT).equals(raw), 'Reviewed artifact bytes');
  // Every substantive byte the artifact pins is the byte that stood at the REVIEWED
  // commit — the spec and this runner included, since both are execution pins.
  const reviewed = { ...m.executionPins };
  for (const [file, pin] of Object.entries(m.product)) reviewed[file] = pin.post || pin.pre;
  L.checkSources(root, v[1], reviewed); // the original routine: Git at the reviewed commit AND the worktree
  L.git(root, ['merge-base', '--is-ancestor', v[1], 'HEAD']);
  L.git(root, ['merge-base', '--is-ancestor', r.commit, 'refs/remotes/origin/rebuild/t2-client-core']);
  L.git(root, ['merge-base', '--is-ancestor', s.sourceBase, 'HEAD']);
  out('ENVELOPE AUTHORIZED artifact=' + hash + ' reviewed at ' + v[1] + '; receipt base ' + r.commit + '; spec ' + m.spec.sha256 +
    ' and runner ' + m.runner.sha256 + ' pinned inside the artifact and re-read from Git');
  return { authorized: true, said, sealed: m, key: 'ACCEPTED:' + hash + ':' + v[1] + ':' + r.commit };
}

// ----------------------------------------------------- 7. FULL-only: PC obligations
// run.cjs:115-117's own requirement, checked before the gate matrix so a run without the
// owner's PC reports the standing BLOCKED terminal line instead of spending the whole
// matrix first; gateRun() still enforces it independently inside migrate-full. Existence
// only: the private blob is never opened, read, hashed or quoted.
function privateOracle() {
  const manifest = JSON.parse(fs.readFileSync(rel('rebuild/conform/oracle/manifest.json')));
  if (!fs.existsSync(rel('rebuild/conform/private/live.json')) || !fs.existsSync(path.join(root, 'rebuild/conform', manifest.goldens['live.main'].path)))
    throw Object.assign(new Error('REQUIRED-PRIVATE-PREPARATION-MISSING'), { code: 'REQUIRED-PRIVATE-PREPARATION-MISSING' });
  say('PRIVATE ORACLE PRESENT; verdict-only reporting — no private values, counts, hashes or prose leave this machine');
}
// An exact public-code snapshot of the audit baseline, not a replacement engine.
function historical(bound, bundles) {
  const baseline = baselineOf(bound);
  if (!baseline) { say('HISTORICAL AUDIT SKIPPED; the chain baseline is unresolved until the PM names the parent'); note('historical audit baseline unresolved'); return; }
  const dir = fs.mkdtempSync(path.join(logDir, 'original-audit-'));
  try {
    const list = Object.entries(baseline.publicPins).filter(([file]) => file.startsWith('rebuild/engine/') || /^rebuild\/conform\/v4\/[^/]+\.cjs$/.test(file));
    assert(list.some(([file]) => file === 'rebuild/conform/v4/run-defect-laws.cjs'), 'Baseline carries the audit runner');
    for (const [file, hash] of list) {
      const bytes = L.object(root, baseline.auditCommit, file); assert.equal(sha(bytes), hash, 'Pinned baseline byte: ' + file);
      const out = path.join(dir, file); assert(out.startsWith(dir + path.sep));
      fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, bytes);
    }
    say('HISTORICAL ' + L.historicalAudit({ baseline: dir, bundles }).replace(/\bPASS\b/g, 'OBSERVED'));
  } finally { assert(path.resolve(dir).startsWith(logDir + path.sep)); fs.rmSync(dir, { recursive: true, force: true }); }
}
function gates(bundles, authorized, covered, ran) {
  for (const [gate, child] of covered) assert(ran.get(child) && ran.get(child).ok, 'COVERAGE-CHILD-NOT-EXECUTED ' + gate + ' ' + child);
  const done = new Set(covered.keys());
  for (const gate of R.GATES) {
    if (done.has(gate[0])) continue;
    R.gateRun(root, bundles, gate, { emit: line => console.log(line.replace(/\bPASS\b/g, authorized ? 'PASS' : 'OBSERVED')) });
    done.add(gate[0]);
  }
  assert.deepEqual([...done].sort(), GATE_IDS.slice().sort(), 'No missing or extra original gate');
  say('FULL EVIDENCE: ' + (GATE_IDS.length - covered.size) + ' of the ' + GATE_IDS.length + ' original gates re-executed and ' +
    covered.size + ' carried by successor children that executed in this run; second gate included');
}

// ------------------------------------------------------------------ 8. main sequence
try {
  const s = spec();
  logDir = path.join(root, '.tmp/b-package', ID); fs.mkdirSync(logDir, { recursive: true });
  const bound = parent(s);
  // Evaluated once HERE only to supply the header word and the sealed pins fidelity()
  // needs; the evaluation that DECIDES runs after every gate (W5).
  const first = envelope(s, bound);
  say('POSTFIX ' + s.packageId + ' ' + (first.authorized ? 'AUTHORIZED' : 'REVIEW-PENDING') + ' mode=' + args[0]);
  for (const line of first.said) console.log(line);
  pins(s, bound);
  const phase = product(s, bound);
  fidelity(s, first.sealed);
  authority(s, bound);
  say('PROTECTED SURFACES ' + s.protectedSurfaces.length + ' declared, verdict-only UNCHANGED: ' + s.protectedSurfaces.join(' | '));
  say('PRIVATE LIVE-TRIGGERED ' + (s.privateLiveTriggered.length ? s.privateLiveTriggered.join(' ') : 'none') +
    '; a census change on any other declared D-id is a RED stop for a reviewed successor cell, never a golden regeneration');
  const bundles = Reference.create(root); // pinned public reference bundles, before any candidate factory loads
  const env = laws(s, bundles, phase);
  carriers(s);
  const ran = children(s, env);
  const covered = coverage(s, bound, ran);
  if (!ci) { privateOracle(); historical(bound, bundles); gates(bundles, first.authorized, covered, ran); }
  // W5. Re-evaluate AFTER all evidence: an artifact, review, receipt, spec or runner
  // swapped mid-run changes `key` and refuses here, before any terminal word is printed.
  const last = envelope(s, bound);
  assert.equal(last.key, first.key, 'ENVELOPE-CHANGED-DURING-THE-RUN');
  assert.equal(last.authorized, first.authorized, 'ENVELOPE-CHANGED-DURING-THE-RUN');
  if (!last.authorized) note(last.sealed === null ? 'closed cumulative profile not sealed' : 'independent exact-artifact acceptance PENDING', false);
  for (const o of open) say('OPEN ' + o.reason);
  if (ci) {
    const blocking = open.filter(o => o.ciBlocking);
    if (blocking.length) { say('CI REVIEW-PENDING: ' + blocking.length + ' open obligation(s); public evidence only; no PASS is claimed'); process.exitCode = 2; }
    else { say('PUBLIC CI EVIDENCE PASS; the 19 original gates, the private oracle and independent exact-artifact acceptance remain separate'); process.exitCode = 0; }
  } else {
    const ready = last.authorized && !open.length;
    say(ready ? 'POSTFIX PACKAGE PASS ' + s.packageId
      : 'POSTFIX PACKAGE REVIEW-PENDING: ' + open.length + ' open obligation(s); independent exact-artifact acceptance required');
    process.exitCode = ready ? 0 : 2;
  }
} catch (error) {
  const blocked = BLOCKED.includes(error && error.code);
  console.error(blocked ? 'B PACKAGE ' + ID + ' BLOCKED ' + error.code : 'B PACKAGE ' + ID + ' FAIL; required evidence missing or failed; local diagnostics withheld');
  process.exitCode = blocked ? 2 : 1;
}
