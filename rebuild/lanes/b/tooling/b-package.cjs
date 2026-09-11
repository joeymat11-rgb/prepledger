'use strict';
// LANE B closed-package tooling — ONE generic runner for B-NTC, B-LOM and B1..B4.
// Usage: node rebuild/lanes/b/tooling/b-package.cjs --ci|--full --package <B-NTC|B-LOM|B1|B2|B3|B4>
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
// matched — never on a file's existence, never by a child that short-circuits node, and
// never beyond the bound: inherited coverage IS the parent artifact's own gate->child map
// byte-for-byte, and a MOVE must name a reason and a child whose argv executes the gate's
// own original executable (or a file whose bytes require it), one gate per child unless
// run.cjs itself groups them on one executable. A child's argv carries only the two flags
// the accepted originals use; every inline-code and short-circuit form refuses. Every
// obligation that a ledger line would clear — brief acceptance, theme — is cleared only by
// exact ledger bytes in Git at its accepted-chain anchor, never by declaration.
// No POSTFIX PACKAGE PASS without an ACCEPTED envelope naming the exact artifact bytes
// (DECISIONS:86-87); --ci's own PUBLIC CI EVIDENCE PASS is public evidence only and is
// qualified in its own sentence.
//
// TOOLING-REVIEW r3 (X1-X4). X1: coverage.moves must be {} in every package this runner
// admits. The move code path below is kept whole and is gated behind MOVES_RULING, an
// explicit PM ruling that DOES NOT EXIST — a non-empty moves refuses in spec() and again
// in envelope() before any ACCEPTED branch. That is what closes R3-A: r3's move/needle
// composite (a declared child that never runs the gate's original still being reported
// "MOVED, carries <original>") needs a non-empty moves to reach anything at all, so with
// moves refused the wrapper has NO REACH — not a narrower one, none. X2: a parent option
// pins its REVIEW file by sha256 as well as its artifact, and the receipt base that review
// names must be an ancestor of the real chain branch, resolved from Git refs (CHAIN_REF)
// and never from the spec — that closes R3-B, where a spec could point at a scratch commit
// and have the runner report forged ledger lines as "found in Git". X3: a move is proved
// by the ORIGINAL GATE'S OWN needle out of R.GATES appearing in the moving child's stdout
// — the >=200-byte floor is no longer evidence for a moving child. X4: the two sentences
// that said more than was verified now say what was verified, and BRIEF-ACCEPTED implies a
// non-null acceptedLedgerLine. README.md carries the long form.
//
// TOOLING-REVIEW r4 (Y1-Y4). Y1: a package in NO_REGISTER_IDS declares no D-id, so the
// 45-law accounting — the only substantive behavioural obligation this runner imposes on
// B1..B4 — imposes NOTHING on it, and its "45/45 rows agree" line would print on the day
// the package is finished having proved nothing about it. The REPLACEMENT obligation is
// its OWN executed children: at least MIN_OWN_CHILDREN declared child(ren) whose argv
// executes a file this spec declares in product with role "new", each of which children()
// already requires to run IN THIS PROCESS, exit 0, with its exact declared needle at line
// start. It is an OPEN (--ci blocking) obligation from the first run and it REFUSES at the
// seal, beside X1's re-assert — that is where it belongs, because before the carrier lands
// the target file does not exist and CHILD-ARGV-TARGET refuses the declaration. STANDING,
// like X1/X2 (DECISIONS:108 (d)). Y1 also gives the parent EXECUTION pin a role of its own:
// DECISIONS:109 rules that a child package supersedes its parent's execution pins (B-NTC
// re-pins .github/workflows/rebuild.yml inside its own seal), and under X-era roles such a
// file could only enter product() as "new" — a false label. role "superseded-by-child"
// says what is true, and product() now requires it for exactly the parent-executionPin
// case and enforces the same pin.pre === parent-pin equality it enforces for parent
// PRODUCT files. Y2: the single-parent rule read sibling packages/*.json FROM DISK only,
// so an uncommitted edit to a sibling's `chosen` freed the parent (r4 G14); it now reads
// the siblings IN GIT AT HEAD as well, and — the durable fact — refuses when an
// already-sealed rebuild/m4/spec/acceptance-*.json ON THE CHAIN BRANCH already names the
// same parent artifact. Y3 is spec-note text. Y4: the PIN_PATHS sentence counted 18 paths
// where 16 exist in this tree; it now counts the ones that exist and says so.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../../..'), P = path.join(root, 'rebuild/conform/v4/postfix');
const R = require(path.join(P, 'run.cjs')), L = require(path.join(P, 'legacy-gates.cjs')), J = require(path.join(P, 'strict-json.cjs'));
const { sha } = require(path.join(P, 'target.cjs'));
const BLOCKED = require(path.join(root, 'rebuild/m4/spec/native-carriers-errors.cjs')).codes; // the original closed BLOCKED list
const Reference = require(path.join(root, 'rebuild/m4/spec/load-write-reference.cjs'));
const TOOLING = 'rebuild/lanes/b/tooling', RUNNER = TOOLING + '/b-package.cjs';
// The closed package-id list. Case-exact, ordered as the PM ruled the chain
// (DECISIONS:103 (1): B-NTC first, then B1, B2, B4, B3; B-LOM follows B-NTC if the legacy
// order-mapping seam turns out not to be the same seam). Widening this list is the ONLY
// way a new package id becomes runnable — a spec can never nominate its own id.
const SPEC_DIR = path.join(__dirname, 'packages'), IDS = ['B-NTC', 'B-LOM', 'B1', 'B2', 'B3', 'B4'];
// The real chain branch, resolved from GIT REFS and never from a spec (X2/R3-B). Every
// ancestry assertion that decides whether a commit is on the accepted chain names THIS.
const CHAIN_REF = 'refs/remotes/origin/rebuild/t2-client-core';
// X1. The PM ruling that would admit a gate MOVE. It does not exist, so every non-empty
// coverage.moves refuses — see the header. Setting this to anything other than null is a
// reviewed tooling change, not a spec change, and it must not land before X3's needle
// proof has been exercised on a real move.
const MOVES_RULING = null;
// One reviewed candidate definition; it confers NO authority. A real PM theme line
// on CHAIN_REF must cite this digest before any successor can cover a parent gate.
const SUCCESSOR_POLICY_FILE = TOOLING + '/b-ntc-successors.json';
const SUCCESSOR_POLICY_SHA = '614717800602ce09f792b77a2ef04f191a9d156573b572b772aa1854afae17ee';
// Packages that register no D-ID at all. DECISIONS:93: feature work under the ratified
// slice plan takes no register D-ID, and DECISIONS:103 (1) rules B-NTC (and B-LOM behind
// it) exactly that kind of package — it turns an accepted open boundary into a provider.
// Fixed HERE, like every other exemption (W7): a repair package can never empty its own
// D-id inventory to dodge the law-agreement accounting.
const NO_REGISTER_IDS = new Set(['B-NTC', 'B-LOM']);
// Y1 (TOOLING-REVIEW-r4 §5.1/§7) — the REPLACEMENT obligation for a package with no D-id,
// and therefore no law obligation. Fixed HERE beside NO_REGISTER_IDS itself (W7), because
// a package that can name its own exemption could otherwise name its own replacement: the
// minimum number of DECLARED children that must execute one of this package's OWN
// role:"new" product files. Every declared child is already required to run in this
// process, exit 0, and print its exact declared needle at line start (children()); Y1 adds
// that for a no-register package at least this many of them must be its own. It is an open
// obligation on every run and a refusal at the seal.
const MIN_OWN_CHILDREN = 1;
// The closed product-role vocabulary. "superseded-by-child" is Y1's second half: the role
// a file carries when the PARENT pinned it in executionPins (not in product) and this
// package supersedes it inside its own seal — DECISIONS:109, "a child package supersedes
// its parent's execution pins exactly as NATIVE-CARRIERS superseded LOAD-WRITES". Before
// it, such a file could only be declared "new", which is false of a file the parent pins,
// and the pin.pre === parent-pin equality product() enforces for parent PRODUCT files was
// not enforced for it at all. Both are fixed by giving the case its own name.
const PRODUCT_ROLES = ['edited', 'carried', 'new', 'superseded-by-child'];
// W7: every exemption is fixed HERE and nowhere else — the lane-B tooling inventory, the
// roots a declared child may execute from, and (in spec()) the artifact/review paths the
// package id itself determines. A spec can never nominate its own exempt path.
const TOOLING_FILES = [RUNNER, TOOLING + '/README.md', TOOLING + '/TOOLING-REPORT.md', TOOLING + '/TOOLING-FIX-ASTRA-REPORT.md', TOOLING + '/test/execution-targets.test.cjs', SUCCESSOR_POLICY_FILE, TOOLING + '/test/successor-authority.test.cjs', TOOLING + '/TOOLING-SUCCESSORS-ASTRA-REPORT.txt', TOOLING + '/TOOLING-POLICY-FIX-ASTRA-REPORT.txt', ...IDS.map(i => TOOLING + '/packages/' + i + '.json')];
const CHILD_ROOTS = ['rebuild/m4/spec/', 'rebuild/conform/v4/postfix/', 'rebuild/engine/test/', 'rebuild/m4/workout/test/', 'rebuild/m3/w7-preview/test/', 'rebuild/m3/w6/host/test/', 'rebuild/m3/w7-preview/today/test/'];
// N2. A child never runs inline code and never short-circuits node. NO_INLINE is matched
// on the flag PREFIX, so the `=<code>` spellings (--eval=, --print=, --input-type=,
// --require=, --import=) are caught with the bare ones; NO_RUN catches every form that
// makes node print and exit without executing the named file. Both are backstops with
// their own named refusals — the operative rule is ARGV_ALLOWED, an ALLOW-list of the only
// two flags the accepted originals ever pass (load-write-package.cjs:38-41 and
// native-carriers-package.cjs:64-70 use exactly --test and --test-reporter=tap, and
// otherwise pass a bare file path). Anything else refuses, including -r/--require of an
// allowed root, `-`/`--` (stdin), and any flag standing after the file.
const NO_INLINE = /^(?:-e|--eval|-p|--print|--input-type|-r|--require|--import|--loader|--experimental-loader)(?:=|$)/;
const NO_RUN = /^(?:--version|-v|--help|-h)/; // node prints and exits; the named file never runs
const ARGV_ALLOWED = new Set(['--test', '--test-reporter=tap']);
const CARRIED = ['D12', 'D33', 'D34', 'D35', 'D41', 'D43']; // repaired by the accepted parents (DECISIONS:87, :93)
const GATE_IDS = R.GATES.map(g => g[0]);
// N1. The original executable behind each gate, and the groups run.cjs ITSELF forms by
// running two gates from one file (conformance/selftest on rebuild/conform/run.cjs). Both
// are read out of R.GATES, never re-typed: a move may not cover more gates than the
// original groups on the executable it names.
const GATE_FILE = new Map(R.GATES.map(g => [g[0], g[1]]));
const GATE_GROUP = new Map();
for (const [id, file] of GATE_FILE) GATE_GROUP.set(file, [...(GATE_GROUP.get(file) || []), id]);
// N3. The original gate's own terminal line, built from the original ids: a real gate run
// emits `LEGACY <id> PASS | <tail>` (run.cjs gateRun). A child whose stdout is too thin to
// be an execution must carry one of these or it did not run anything.
const GATE_TERMINAL = new RegExp('^LEGACY (?:' + GATE_IDS.join('|') + ') PASS \\| ', 'm');
const NEEDLE_FLOOR = 200; // bytes of stdout below which a child cannot have executed a gate file
// X3. Each original gate's OWN expected output needle, read out of R.GATES and never
// re-typed: gateRun() destructures `[id,file,needle,arg]=gate` and refuses the gate unless
// `result.stdout.includes(needle)`. A MOVING child is held to that same original test, so
// "the child executes the gate's original" stops being a text test over require specifiers
// and becomes an output test taken from the immutable original. (TOOLING-REVIEW-r3 X3
// writes `R.GATES[i][2][0]`; that is one CHARACTER of the needle — the needle itself is
// `g[2]`, and taking `[0]` would have weakened the check to almost nothing. Corrected
// here, and recorded in TOOLING-REPORT.md §r3.) The needle is matched with includes(), the
// original's own criterion, NOT at line start: two of the nineteen needles stand mid-line
// in their own gate's output ("preserved writer defects;", "PASS exact sync-laws source"),
// so a line-start rule would refuse gates that really ran.
const GATE_NEEDLE = new Map(R.GATES.map(g => [g[0], g[2]]));
for (const [id, needle] of GATE_NEEDLE) assert(typeof needle === 'string' && needle.length >= 8, 'Original gate needle ' + id);
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
  console.error('B PACKAGE USAGE REFUSED; exactly: --ci|--full --package ' + IDS.join('|')); process.exit(1);
}
const ci = args[0] === '--ci', ID = args[2];
const say = line => console.log('B PACKAGE ' + ID + ' ' + line);
const open = [], note = (reason, ciBlocking = true) => { open.push({ reason, ciBlocking }); };
const keys = (o, list, label) => assert.deepEqual(Object.keys(o).sort(), list.slice().sort(), label);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rel = file => path.join(root, file), diskSha = file => sha(fs.readFileSync(rel(file)));
const gitSha = (commit, file) => sha(L.object(root, commit, file)); // bytes as they stand IN GIT
const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// N2/N3. The whole argv of a declared child, decided here and nowhere else: allow-listed
// flags first, then explicit executable files under fixed roots. In bare-script mode
// Node runs exactly ONE file: trailing positions are application arguments, not executions.
// Only --test executes multiple explicit files. This function is the single definition
// used by validation, pins, ownership, fidelity and both inherited/moved coverage.
function childArgv(c) {
  assert(Array.isArray(c.argv) && c.argv.length && c.argv.every(a => typeof a === 'string' && a.length), 'Child argv ' + c.name);
  for (const a of c.argv) {
    assert(!NO_INLINE.test(a), 'CHILD-ARGV-INLINE-CODE ' + c.name + ' ' + a);
    assert(!NO_RUN.test(a), 'CHILD-ARGV-SHORT-CIRCUITS-EXECUTION ' + c.name + ' ' + a);
    assert(a !== '-' && a !== '--', 'CHILD-ARGV-STDIN-OR-END-OF-OPTIONS ' + c.name);
  }
  let i = 0;
  for (; i < c.argv.length && c.argv[i].startsWith('-'); i++)
    assert(ARGV_ALLOWED.has(c.argv[i]), 'CHILD-ARGV-FLAG-NOT-ALLOWED ' + c.name + ' ' + c.argv[i]);
  const flags = c.argv.slice(0, i);
  assert(new Set(flags).size === flags.length, 'CHILD-ARGV-DUPLICATE-FLAG ' + c.name);
  const testMode = flags.includes('--test');
  assert(testMode || !flags.includes('--test-reporter=tap'), 'CHILD-ARGV-REPORTER-WITHOUT-TEST ' + c.name);
  const targets = c.argv.slice(i);
  assert(targets.length, 'CHILD-ARGV-EXECUTES-NO-FILE ' + c.name);
  for (const f of targets) {
    assert(!f.startsWith('-'), 'CHILD-ARGV-FLAG-AFTER-FILE ' + c.name + ' ' + f);
    assert(!path.isAbsolute(f) && !path.win32.isAbsolute(f) && !f.includes('..') && !f.includes('\\') && /\.(?:cjs|mjs|js)$/.test(f) && CHILD_ROOTS.some(r => f.startsWith(r)) && fs.existsSync(rel(f)) && fs.statSync(rel(f)).isFile(), 'CHILD-ARGV-TARGET ' + c.name + ' ' + f);
  }
  assert(testMode || targets.length === 1, 'CHILD-ARGV-BARE-SCRIPT-ARGUMENTS ' + c.name + '; extra positional files are not executed by Node');
  return targets;
}
// N1. "a file that requires the original" is decided by READING the covering file's bytes,
// never by a declaration: every relative require/import specifier is resolved against that
// file's own directory and compared to the executable run.cjs names for the gate.
function requiresOriginal(file, original) {
  const src = fs.readFileSync(rel(file), 'utf8'), dir = path.posix.dirname(file);
  for (const m of src.matchAll(/(?:\brequire|\bimport)\s*\(\s*['"]([^'"]+)['"]\s*\)|\bfrom\s*['"]([^'"]+)['"]/g)) {
    const ref = m[1] || m[2];
    if (!ref || !ref.startsWith('.')) continue;
    const base = path.posix.normalize(path.posix.join(dir, ref));
    if ([base, base + '.cjs', base + '.js', base + '.mjs'].includes(original)) return true;
  }
  return false;
}
// Y1. The package's OWN children: the declared children whose argv executes a file THIS
// spec declares in product with role "new" — its own new code, as opposed to the parent's
// successor children, which are what the inherited coverage map already binds. Decided by
// reading the spec's own product roles, never by a declaration of ownership; and a spec
// cannot widen it, because role "new" is refused for any file the parent pins (product()).
function ownChildren(s) {
  return s.children.filter(c => childArgv(c).some(f => Object.hasOwn(s.product, f) && s.product[f].role === 'new'));
}
let logDir, ARTIFACT, REVIEW, specRaw;

// ---------------------------------------------------------------- 1. the spec
const SPEC_KEYS = ['version', 'lanePackage', 'packageId', 'status', 'brief', 'sourceBase', 'dIds', 'laws', 'carriedAcceptedIds',
  'privateLiveTriggered', 'parent', 'tooling', 'product', 'coverage', 'carrierSuccessor', 'witnessFlips', 'protectedSurfaces',
  'authorizations', 'artifact', 'children', 'notes'];
const CLAIM_KEYS = ['ledgerLine', 'role', 'line', 'lineSha256'];
function claim(v, role, label, child = false) { // a ledger citation whose text hashes to the sha it names
  keys(v, child && Object.hasOwn(v, 'commit') ? [...CLAIM_KEYS, 'commit'] : CLAIM_KEYS, 'Authorization claim ' + label);
  if (Object.hasOwn(v, 'commit')) assert(child && /^[a-f0-9]{40}$/.test(v.commit), 'CHILD-LEDGER-ANCHOR-SHAPE');
  assert(Number.isInteger(v.ledgerLine) && v.ledgerLine > 0 && v.role === role, 'Claim coordinates ' + label);
  assert(typeof v.line === 'string' && !/[\r\n]/.test(v.line) && /^[a-f0-9]{64}$/.test(v.lineSha256) && sha(Buffer.from(v.line)) === v.lineSha256, 'LEDGER-LINE-SHA256 ' + label);
}
function spec() {
  specRaw = fs.readFileSync(path.join(SPEC_DIR, ID + '.json'));
  const s = J.parseExact(specRaw); // exact reviewed bytes + duplicate-decoded-key refusal
  keys(s, SPEC_KEYS, 'Closed package-spec keys');
  assert.equal(s.version, 1); assert.equal(s.lanePackage, ID);
  // The package id is BOUND to the id on the command line, not merely shaped like one: a
  // spec filed as B1.json cannot carry M2-B2-…'s id and so cannot claim B2's artifact path.
  assert(new RegExp('^M2-' + escapeRe(ID) + '-[A-Z0-9-]+$').test(s.packageId), 'Package id shape');
  assert(['SKELETON', 'PROPOSED', 'BRIEF-ACCEPTED'].includes(s.status), 'Spec status');
  // N4. The brief acceptance is a ledger CITATION, shaped exactly like owner/contract/theme
  // — never a bare integer a spec can invent. Its bytes are resolved in Git by authority().
  keys(s.brief, ['file', 'sha256', 'acceptedLedgerLine'], 'Brief citation');
  if (s.brief.acceptedLedgerLine !== null) {
    claim(s.brief.acceptedLedgerLine, 'cowork', 'brief acceptance', true);
    assert.equal(s.status, 'BRIEF-ACCEPTED', 'BRIEF-ACCEPTANCE-STATUS disagrees with the cited ledger line');
    assert(s.brief.acceptedLedgerLine.line.includes(s.packageId) && s.brief.acceptedLedgerLine.line.includes(s.brief.file) &&
      /(?:^|[ ·])ACCEPTED$/.test(s.brief.acceptedLedgerLine.line), 'Brief acceptance line names this package and brief and ends in the ACCEPT terminal word');
  }
  // X4. r3's label defect: the status field was only checked line-implies-status, so
  // `status: 'BRIEF-ACCEPTED'` with `acceptedLedgerLine: null` was accepted and printed. It
  // cleared nothing, but a verdict file must not carry a word its own evidence denies.
  assert(s.status !== 'BRIEF-ACCEPTED' || s.brief.acceptedLedgerLine !== null,
    'BRIEF-ACCEPTED-WITHOUT-A-CITED-LEDGER-LINE: status says the brief is accepted and brief.acceptedLedgerLine is null');
  assert(/^[a-f0-9]{40}$/.test(s.sourceBase), 'sourceBase is a commit');
  // A repair package must register at least one D-id. The only packages allowed an empty
  // inventory are the ones the runner itself names in NO_REGISTER_IDS — the exemption is
  // fixed in this file (W7), so no spec can empty its own inventory to dodge the accounting.
  assert(Array.isArray(s.dIds) && (s.dIds.length || NO_REGISTER_IDS.has(ID)) && new Set(s.dIds).size === s.dIds.length &&
    s.dIds.every(d => /^D([1-9]|[1-3][0-9]|4[0-5])$/.test(d)) &&
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
  // Residual R1 closed on the runner. Self-verification DETECTS but cannot PREVENT: a
  // tampered runner has already executed its injected line by the time it reaches this
  // check, and a hand that edits the runner can re-take the disk pin in the same edit. So
  // the pin is also resolved against the bytes IN GIT at HEAD — the reviewed history, which
  // that hand cannot rewrite without a commit. Disk, Git and the spec pin must be one byte
  // string; a co-edited runner refuses here even though its disk hash agrees.
  assert.equal(gitSha('HEAD', RUNNER), s.tooling.runnerSha256, 'RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER-IN-GIT');
  for (const [file, pin] of Object.entries(s.product)) {
    keys(pin, ['pre', 'post', 'role'], 'Product pin ' + file);
    assert(/^[a-f0-9]{64}$/.test(pin.pre) && (pin.post === null || /^[a-f0-9]{64}$/.test(pin.post)), 'Product sha256 ' + file);
    assert(PRODUCT_ROLES.includes(pin.role) && (pin.role !== 'carried' || pin.pre === pin.post), 'Product role ' + file);
  }
  // W3 + N2/N3. Each declared child is schema-checked, its needle is non-empty, and its
  // argv carries only allow-listed flags and then real files under a fixed root — never
  // inline code, never a flag that makes node print and exit, never a no-op.
  const names = new Set(), byName = new Map();
  for (const c of s.children) {
    keys(c, ['name', 'argv', 'needle'], 'Declared child');
    assert(typeof c.name === 'string' && /^[a-z0-9][a-z0-9-]{1,39}$/.test(c.name) && !names.has(c.name), 'Child name');
    names.add(c.name); byName.set(c.name, c);
    assert(typeof c.needle === 'string' && c.needle.trim().length >= 8 && !/[\r\n]/.test(c.needle), 'CHILD-NEEDLE-EMPTY ' + c.name);
    childArgv(c);
  }
  // W2 + N1. A covering child is a DECLARED child by name and its EXECUTION covers the
  // gate. INHERITED coverage is bounded by the parent artifact (coverage() asserts the map
  // itself). A MOVE is bounded HERE, three ways at once: it must state a reason; its child
  // must execute the gate's own original executable, or a file whose bytes require that
  // executable; and one child may carry more than one gate only where run.cjs itself groups
  // those gates on a single executable. "All 19 by one child" satisfies none of the three.
  keys(s.coverage, ['inherited', 'moves'], 'Coverage block');
  // X1 — BLOCKING, and it is the FIRST thing decided about coverage. r3's residual R3-A is
  // the move/needle composite: a declared child that never ran the gate's original could
  // still be reported as carrying a moved gate. Every part of that finding enters through a
  // non-empty coverage.moves. MOVES_RULING is the PM ruling that would admit one, and it
  // does not exist — so `moves` must be `{}`, the finding has NO REACH, and the reviewer's
  // "the sealer must re-check this line at seal time" is now the runner's job, not a human's.
  // The whole move code path below is kept intact and is re-tested by the bites; it becomes
  // live the day a ruling is recorded here, and X3's needle proof guards it when it does.
  assert(MOVES_RULING === null || (typeof MOVES_RULING === 'string' && MOVES_RULING.length >= 16), 'MOVES-RULING-SHAPE');
  assert(MOVES_RULING !== null || !Object.keys(s.coverage.moves).length,
    'COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING ' + Object.keys(s.coverage.moves).join(' ') +
    '; coverage.moves must be {} under this runner (TOOLING-REVIEW-r3 X1)');
  for (const [gate, child] of Object.entries(s.coverage.inherited)) {
    assert(GATE_IDS.includes(gate), 'Covered gate is an original gate: ' + gate);
    assert(typeof child === 'string' && names.has(child), 'COVERAGE-CHILD-NOT-DECLARED ' + gate + ' ' + child);
  }
  const movedBy = new Map();
  for (const [gate, move] of Object.entries(s.coverage.moves)) {
    assert(GATE_IDS.includes(gate), 'Covered gate is an original gate: ' + gate);
    assert(!Object.hasOwn(s.coverage.inherited, gate), 'A gate is inherited-covered or moved, never both');
    assert(move && typeof move === 'object' && !Array.isArray(move), 'COVERAGE-MOVE-UNDECLARED ' + gate);
    keys(move, ['child', 'reason'], 'COVERAGE-MOVE-UNDECLARED ' + gate);
    assert(typeof move.child === 'string' && names.has(move.child), 'COVERAGE-CHILD-NOT-DECLARED ' + gate + ' ' + move.child);
    assert(typeof move.reason === 'string' && !/[\r\n]/.test(move.reason) && move.reason.trim().length >= 16, 'COVERAGE-MOVE-REASON-MISSING ' + gate);
    assert(!Object.values(s.coverage.inherited).includes(move.child), 'COVERAGE-MOVE-CHILD-IS-AN-INHERITED-CHILD ' + gate + ' ' + move.child);
    const original = GATE_FILE.get(gate), targets = childArgv(byName.get(move.child));
    assert(targets.includes(original) || targets.some(f => requiresOriginal(f, original)),
      'COVERAGE-MOVE-CHILD-DOES-NOT-EXECUTE-THE-ORIGINAL ' + gate + ' ' + move.child + ' needs ' + original);
    movedBy.set(move.child, [...(movedBy.get(move.child) || []), gate]);
  }
  for (const [child, gates] of movedBy) {
    const files = new Set(gates.map(g => GATE_FILE.get(g)));
    assert(gates.length === 1 || (files.size === 1 && gates.length <= GATE_GROUP.get(gates.map(g => GATE_FILE.get(g))[0]).length),
      'COVERAGE-MOVE-CHILD-COVERS-MORE-GATES-THAN-run.cjs-GROUPS ' + child + ' ' + gates.join(' '));
  }
  for (const flip of s.witnessFlips) keys(flip, ['file', 'line', 'from', 'to'], 'Witness flip');
  keys(s.authorizations, ['owner', 'contract', 'theme', 'review'], 'Closed authorization keys');
  claim(s.authorizations.owner, 'owner', 'owner'); claim(s.authorizations.contract, 'cowork', 'contract');
  if (s.authorizations.theme !== null) {
    claim(s.authorizations.theme, 'cowork', 'theme', true);
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
  say('SPEC OBSERVED packages/' + ID + '.json ' + sha(specRaw) + '; runner ' + s.tooling.runnerSha256 + ' byte-identical on disk and in Git at HEAD; status=' + s.status +
    '; ' + s.dIds.length + ' D-ids ' + s.dIds.join('>') + '; ' + Object.keys(s.product).length + ' declared product files; ' +
    s.children.length + ' declared child(ren), argv file-first under ' + CHILD_ROOTS.length + ' fixed root(s) with only ' +
    [...ARGV_ALLOWED].join(' ') + ' permitted; ' + Object.keys(s.coverage.moves).length +
    ' declared move(s), each naming its own original executable in a relative require specifier' +
    (MOVES_RULING === null ? ' (moves are refused outright under this runner — TOOLING-REVIEW-r3 X1)' : ''));
  if (fs.existsSync(rel(s.brief.file))) assert.equal(diskSha(s.brief.file), s.brief.sha256, 'Brief bytes');
  else note('brief ' + s.brief.file + ' not authored');
  return s;
}

// ------------------------------------------- 2. the single-parent immutable chain
const RECEIPT = /^(?:- [^\r\n]+ )?POSTFIX-ACCEPTANCE (\S+) ([a-f0-9]{40}) (\S+) ([a-f0-9]{64}) ACCEPTED$/;
// One sealed option, fully verified: artifact bytes on disk, the independent ACCEPTED
// envelope, the receipt line by its own sha256 at its base, and — W4 — the artifact bytes
// as they stand IN GIT at the commit that receipt names as reviewed.
function option(o) {
  keys(o, ['id', 'artifact', 'sha256', 'review', 'reviewSha256', 'receiptLedgerLine', 'note'], 'Parent option ' + o.id);
  if (!o.sha256) {
    assert.equal(o.reviewSha256, null, 'An unsealed parent option pins no review bytes ' + o.id);
    say('PARENT OPTION ' + o.id + ' ' + o.artifact + ' NOT-YET-SEALED (' + o.note + ')'); return null;
  }
  const raw = fs.readFileSync(rel(o.artifact));
  assert.equal(sha(raw), o.sha256, 'Parent artifact bytes ' + o.id);
  // X2 / R3-B, half one. The parent's REVIEW file is where receiptBase comes from, and
  // receiptBase remains the exact inherited owner/contract ledger anchor. Unpinned, a spec could
  // hand the runner any review file it liked — r3's C-COMMIT-3 wrote one inside the tooling
  // directory, pointed at a scratch commit carrying forged theme and brief lines, and the
  // runner reported them "found in Git" and dropped two open obligations. So the review
  // file is pinned BY BYTES beside the artifact, and re-read from Git at the artifact's own
  // reviewed commit exactly as the artifact is.
  assert(/^[a-f0-9]{64}$/.test(o.reviewSha256), 'Parent review sha256 ' + o.id);
  const reviewRaw = fs.readFileSync(rel(o.review));
  assert.equal(sha(reviewRaw), o.reviewSha256, 'PARENT-REVIEW-BYTES-NOT-THE-PINNED-REVIEW ' + o.id);
  const acceptance = J.parseExact(raw), review = J.parseExact(reviewRaw);
  assert.equal(review.status, 'ACCEPTED', 'Parent independently accepted ' + o.id);
  const r = review.receipt; assert(r && typeof r.commit === 'string', 'Parent receipt ' + o.id);
  // X2 / R3-B, half two — the decisive one. The receipt base must stand on the REAL chain
  // branch, resolved from Git refs here (CHAIN_REF) and never from anything the spec says.
  // envelope() already demands this of the package's OWN receipt; nothing demanded it of
  // the parent's, which is how a local scratch commit could become the ledger anchor.
  L.git(root, ['merge-base', '--is-ancestor', r.commit, CHAIN_REF]);
  // W6/N4, unchanged and load-bearing: the receipt line itself is found as EXACT LINE BYTES
  // in rebuild/DECISIONS.md in Git at that base, under role cowork, mentioning this
  // artifact path and this hash. X2 decides WHERE that base may be; this decides WHAT must
  // stand there. Both are required — neither substitutes for the other.
  L.verifyReceipt(root, r.commit, r, { role: 'cowork', mentions: [o.sha256, o.artifact] });
  const m = RECEIPT.exec(r.line);
  assert(m && m[1] === acceptance.packageId && m[3] === o.artifact && m[4] === o.sha256, 'Parent receipt content ' + o.id);
  assert.equal(sha(L.object(root, m[2], o.artifact)), o.sha256, 'Parent artifact bytes in Git at its reviewed commit ' + o.id);
  // The review file is authored AFTER the commit its own receipt names as reviewed — it
  // carries the receipt of the ledger line that accepts the artifact — so its bytes do not
  // stand at m[2] and asking for them there would be asking for the impossible. The anchor
  // that actually closes R3-B is the REAL CHAIN BRANCH: a review file a spec wrote beside
  // this runner (r3's C-COMMIT-3) does not exist on origin/rebuild/t2-client-core at all,
  // and no local commit can put it there. Both parent files are resolved there, which has a
  // second effect worth naming: a parent pin that upstream has since superseded — exactly
  // what DECISIONS:104 did to the DECISIONS:96 seal — stops verifying instead of passing
  // quietly, so a stale parent must be re-taken rather than carried.
  assert.equal(sha(L.object(root, CHAIN_REF, o.artifact)), o.sha256, 'PARENT-ARTIFACT-BYTES-NOT-ON-THE-CHAIN-BRANCH ' + o.id);
  assert.equal(sha(L.object(root, CHAIN_REF, o.review)), o.reviewSha256, 'PARENT-REVIEW-BYTES-NOT-ON-THE-CHAIN-BRANCH ' + o.id);
  L.git(root, ['merge-base', '--is-ancestor', m[2], 'HEAD']);
  L.git(root, ['merge-base', '--is-ancestor', m[2], CHAIN_REF]);
  say('PARENT OPTION ' + o.id + ' ' + acceptance.packageId + ' ' + o.artifact + ' ' + o.sha256 + ' ACCEPTED at ' + m[2] +
    ' (DECISIONS:' + o.receiptLedgerLine + '); artifact byte-identical on disk, in Git at that commit and on ' + CHAIN_REF +
    '; review ' + o.review + ' ' + o.reviewSha256.slice(0, 12) + ' byte-identical on disk and on that branch; receipt base ' +
    r.commit.slice(0, 7) + ' is an ancestor of it');
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
  // Y2 / r4 §5.2, half one. A sibling spec claims the same parent. This was read from DISK
  // only, where nothing pins it: r4's G14 freed the sibling's `chosen` in an uncommitted
  // edit and the check went silent — the tooling directory is not one of the PIN_PATHS,
  // fidelity()'s scan reads commits, and a seal pins only the sealing package's own spec
  // bytes. So the siblings are read from DISK **and** from GIT AT HEAD: the reviewed
  // history, which an uncommitted hand cannot reach and a committed one cannot hide.
  const claims = o => o && o.parent && o.parent.chosen && Array.isArray(o.parent.options) &&
    (o.parent.options.find(x => x.id === o.parent.chosen) || {}).artifact === bound.option.artifact;
  const rivals = [];
  for (const f of fs.readdirSync(SPEC_DIR)) {
    if (!f.endsWith('.json') || f === ID + '.json') continue;
    const o = J.parseExact(fs.readFileSync(path.join(SPEC_DIR, f)));
    if (claims(o)) rivals.push(o.lanePackage + ' (packages/' + f + ' on disk)');
  }
  for (const f of L.git(root, ['ls-tree', '--name-only', 'HEAD', TOOLING + '/packages/']).toString().split(/\r?\n/).filter(Boolean)) {
    if (!f.endsWith('.json') || path.posix.basename(f) === ID + '.json') continue;
    const o = J.parseExact(L.object(root, 'HEAD', f));
    if (claims(o)) rivals.push(o.lanePackage + ' (' + f + ' in Git at HEAD)');
  }
  assert(!rivals.length, 'SINGLE-PARENT-CHAIN: ' + bound.option.artifact + ' already claimed by ' + rivals.join(' '));
  // Y2 / r4 §5.2, half two — the durable one. The sibling scan is a fact about the specs as
  // they stand; the CHAIN is a fact about what has been SEALED. An already-sealed
  // acceptance-*.json that names this same artifact as its parent makes this claim a second
  // head whatever the specs say, so the sealed artifacts are read out of Git on the REAL
  // chain branch (CHAIN_REF, a runner constant nameable by no spec) and never from disk.
  const sealedRivals = L.git(root, ['ls-tree', '--name-only', CHAIN_REF, 'rebuild/m4/spec/']).toString().split(/\r?\n/)
    .filter(f => /^rebuild\/m4\/spec\/acceptance-[a-z0-9-]+\.json$/.test(f) && f !== ARTIFACT)
    .filter(f => { const a = J.parseExact(L.object(root, CHAIN_REF, f)); return a && a.parent && a.parent.artifact === bound.option.artifact; });
  assert(!sealedRivals.length, 'SINGLE-PARENT-CHAIN-SEALED: ' + bound.option.artifact +
    ' is already named as the parent by the sealed ' + sealedRivals.join(' ') + ' on ' + CHAIN_REF);
  say('PARENT BOUND ' + bound.option.id + ' ' + bound.option.artifact + ' ' + bound.option.sha256 +
    '; single-parent chain holds — no sibling spec claims it on disk or in Git at HEAD, and no sealed artifact on ' +
    CHAIN_REF + ' names it as parent');
  return { ...bound, decided: true };
}
// W4. Every parent pin still holds, and every grandparent pin the parent did not supersede
// still holds — the check native-carriers-profile.cjs performs in parent() and
// grandparent(), which fidelity()'s tree diff cannot substitute for. The parent's own
// product map is re-asserted by product(), which owns every file this spec declares.
// Residual R3 closed. The accepted original reads every SUPERSEDED file from Git at
// sourceBase ("Parent product preserved at sourceBase", native-carriers-profile.cjs:96) and
// every unchanged file from disk. This does both, and additionally resolves each unchanged
// pin against Git at HEAD — so a worktree that disagrees with the reviewed history under
// rebuild/m4/spec, rebuild/m3 or .github (where 28 of the 31 parent pins and all 23
// grandparent pins live, outside the 18 PIN_PATHS git-status check) cannot pass unnoticed.
function held(s, file, hash, code) {
  if (Object.hasOwn(s.product, file)) { assert.equal(gitSha(s.sourceBase, file), hash, code + '-AT-SOURCEBASE ' + file); return false; }
  assert.equal(diskSha(file), hash, code + ' ' + file);
  assert.equal(gitSha('HEAD', file), hash, code + '-GIT-DISK-DISAGREE ' + file);
  return true;
}
function pins(s, bound) {
  if (!bound) { note('parent and grandparent artifact pins not re-asserted'); return; }
  const a = bound.acceptance; let kept = 0, gkept = 0, base = 0;
  for (const [file, hash] of Object.entries({ ...a.product, ...a.executionPins })) {
    if (held(s, file, hash, 'PARENT-PIN-BROKEN')) kept++; else base++;
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
    if (Object.hasOwn(a.product, file) || Object.hasOwn(a.executionPins, file)) continue;
    if (held(s, file, hash, 'GRANDPARENT-PIN-BROKEN')) gkept++; else base++;
  }
  say('PARENT PINS RE-ASSERTED at run time; ' + kept + ' pin(s) from ' + bound.option.artifact + ' plus its ' +
    Object.keys(a.product).length + ' product pins through the inventory below, and ' + gkept + ' un-superseded grandparent pin(s) from ' +
    g.artifact + ', byte-identical on disk AND in Git at HEAD; ' + base + ' superseded pin(s) preserved in Git at sourceBase ' +
    s.sourceBase.slice(0, 7) + '; parent artifact byte-identical in Git at ' + bound.reviewedCommit);
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
  const pmap = bound && bound.acceptance.product, epins = bound && bound.acceptance.executionPins;
  const at = { pre: [], post: [], carried: [], drift: [], superseded: [] };
  for (const [file, pin] of Object.entries(s.product)) {
    if (pmap && Object.hasOwn(pmap, file)) {
      assert.equal(pin.pre, pmap[file], 'UNLISTED-PRODUCT-DRIFT pre-image is not the parent pin: ' + file);
      assert(pin.role === 'carried' || pin.role === 'edited', 'PARENT-PRODUCT-PIN-NOT-DECLARED-CARRIED-OR-EDITED ' + file);
      assert(pin.role !== 'superseded-by-child', 'PRODUCT-ROLE-MISLABELLED ' + file + ' is a parent PRODUCT pin, not an execution pin');
    } else if (epins && Object.hasOwn(epins, file)) {
      // Y1 second half / r4 §5.4. The parent pinned this file in executionPins. DECISIONS:109
      // rules that a child package supersedes those pins inside its own seal, and the only
      // role that admitted such a file before was "new" — false of a file the parent pins,
      // and it carried NO pre-image equality at all. Now the role says what is true and the
      // same equality that binds a parent PRODUCT pre-image binds this one.
      assert.equal(pin.role, 'superseded-by-child', 'PARENT-EXECUTION-PIN-NOT-DECLARED-SUPERSEDED ' + file +
        ' is pinned by the parent in executionPins; declare role "superseded-by-child" (DECISIONS:109), never "new"');
      assert.equal(pin.pre, epins[file], 'UNLISTED-PRODUCT-DRIFT pre-image is not the parent execution pin: ' + file);
      at.superseded.push(file);
    } else {
      assert(pin.role === 'new' || !pmap, 'UNLISTED-PRODUCT-DRIFT ' + file + ' is not parent-pinned and is not declared new');
      assert(pin.role !== 'superseded-by-child' || !pmap, 'SUPERSEDED-BY-CHILD-IS-NOT-A-PARENT-PIN ' + file);
    }
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
    ' carried byte-identical from the parent / 0 unlisted drift' + (pmap ? '; the inventory covers all ' + Object.keys(pmap).length + ' parent-pinned product files' : '') +
    '; ' + at.superseded.length + ' declared role "superseded-by-child" over a parent EXECUTION pin, each equal to the parent byte' +
    (at.superseded.length ? ' (' + at.superseded.join(' ') + ')' : ''));
  if (phase !== 'IMPLEMENTED') note('product ' + phase + ' (' + at.pre.length + ' declared file(s) still at the pinned pre-image)');
  return phase;
}
// W1. The tooling directory is inside the change check: the spec and the runner are
// evidence, so a committed change to either — or a new file smuggled beside them — is
// visible here, and their BYTES are pinned by the reviewed spec and the sealed artifact.
function fidelity(s, sealed) {
  L.git(root, ['merge-base', '--is-ancestor', s.sourceBase, 'HEAD']); // sourceBase is an ancestor of HEAD
  const changed = L.git(root, ['diff', '--name-only', s.sourceBase, 'HEAD', '--', 'rebuild/engine', 'rebuild/conform', 'rebuild/m4/spec', TOOLING]).toString().split(/\r?\n/).filter(Boolean);
  const targets = new Set(s.children.flatMap(c => childArgv(c)));
  const unlisted = changed.filter(f => !(Object.hasOwn(s.product, f) || f === ARTIFACT || f === REVIEW || TOOLING_FILES.includes(f) || targets.has(f) || f === (s.carrierSuccessor && s.carrierSuccessor.file)));
  assert(!unlisted.length, 'UNLISTED-SOURCE-CHANGE ' + unlisted.join(' '));
  assert.equal(diskSha(RUNNER), s.tooling.runnerSha256, 'RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER');
  assert.equal(gitSha('HEAD', RUNNER), s.tooling.runnerSha256, 'RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER-IN-GIT');
  if (sealed) { assert.equal(sealed.runner.sha256, diskSha(RUNNER), 'SEALED-RUNNER-BYTES-CHANGED'); assert.equal(sealed.spec.sha256, sha(specRaw), 'SEALED-SPEC-BYTES-CHANGED'); }
  // The whole inventory is handed to git status — a path that appears later is checked the
  // day it appears — but Y4: the SENTENCE must count what actually exists. Two of the
  // eighteen (rebuild/conform/goldens, rebuild/conform/manifest.json) are not in this tree,
  // so "18 byte-identical" overstated by two; r3 recorded that as R4 and carried it. Say the
  // number that was verified and name the shortfall.
  const dirty = L.git(root, ['status', '--porcelain', '--', ...PIN_PATHS]).toString().split(/\r?\n/).filter(Boolean);
  assert(!dirty.length, 'PIN-PATHS-GIT-DISK-DISAGREE ' + dirty.length + ' path(s)');
  const present = PIN_PATHS.filter(p => fs.existsSync(rel(p))), absent = PIN_PATHS.filter(p => !fs.existsSync(rel(p)));
  say('FIDELITY OBSERVED; sourceBase ' + s.sourceBase.slice(0, 7) + ' ancestor of HEAD ' + L.git(root, ['rev-parse', '--short', 'HEAD']).toString().trim() + '; ' + changed.length +
    ' engine/conform/m4-spec/lane-b-tooling file(s) changed since sourceBase, all in the fixed inventory; runner ' + s.tooling.runnerSha256.slice(0, 12) + ' and spec ' +
    sha(specRaw).slice(0, 12) + ' pinned' + (sealed ? ' inside the sealed artifact' : ' (artifact not sealed yet)') + '; ' + present.length + ' of ' + PIN_PATHS.length +
    ' PIN_PATHS present in this tree and byte-identical Git vs disk' +
    (absent.length ? '; ' + absent.length + ' not in this tree and therefore vacuous (' + absent.join(' ') + ')' : ''));
}
// W6. The owner and contract ledger lines are found as EXACT LINE BYTES in
// rebuild/DECISIONS.md at a real chain commit, under their own roles and with content
// mentions; the contract must additionally BE the parent artifact's own contract line.
// Parent owner/contract stay at the exact accepted parent receipt. New child
// claims may name a later immutable commit, but only on BOTH the candidate ancestry
// and the fixed accepted chain. A local-only spec-selected anchor cannot authorize.
function ledger(at, v, mentions, role) {
  L.verifyReceipt(root, at, { commit: at, path: 'rebuild/DECISIONS.md', line: v.line, lineSha256: v.lineSha256 }, { role, mentions });
}
function childLedger(s, bound, v, label, mentions) {
  claim(v, 'cowork', label, true);
  const at = v.commit || bound.receiptBase;
  assert(/^[a-f0-9]{40}$/.test(at), 'CHILD-LEDGER-ANCHOR-SHAPE');
  L.git(root, ['merge-base', '--is-ancestor', bound.receiptBase, at]);
  L.git(root, ['merge-base', '--is-ancestor', at, 'HEAD']);
  L.git(root, ['merge-base', '--is-ancestor', at, CHAIN_REF]);
  ledger(at, v, mentions, 'cowork');
  return at;
}
function authority(s, bound) {
  const theme = s.authorizations.theme, accepted = s.brief.acceptedLedgerLine;
  const themeOpen = () => note('theme ledger line accepting this brief is null (THEME-AUTHORIZATION-UNAVAILABLE before any receipt)');
  const briefOpen = () => note('brief ' + s.brief.file + ' not accepted by a PM ledger line');
  if (!bound) {
    assert(!theme, 'THEME-AUTHORIZATION-UNVERIFIABLE: no sealed parent to anchor the ledger line at');
    assert(!accepted, 'BRIEF-ACCEPTANCE-UNVERIFIABLE: no sealed parent to anchor the ledger line at');
    themeOpen(); briefOpen();
    note('owner and contract ledger lines not verified at a chain commit'); return;
  }
  const at = bound.receiptBase;
  claim(s.authorizations.owner, 'owner', 'owner');
  claim(s.authorizations.contract, 'cowork', 'contract');
  ledger(at, s.authorizations.owner, ['M2-RULE'], 'owner');
  ledger(at, s.authorizations.contract, ['POSTFIX-GATE BRIEF'], 'cowork');
  assert.equal(s.authorizations.contract.lineSha256, bound.acceptance.authorizations.contract.lineSha256, 'INHERITED-CONTRACT-AUTHORIZATION');
  const themeAt = theme ? childLedger(s, bound, theme, 'theme', [s.packageId]) : null;
  const briefAt = accepted ? childLedger(s, bound, accepted, 'brief acceptance', [s.packageId, s.brief.file]) : null;
  if (!theme) themeOpen();
  if (!accepted) briefOpen();
  say('AUTHORITY OBSERVED owner/contract exact roles and ledger bytes at parent receipt ' + at +
    '; inherited contract exact; theme ' + (themeAt || 'NULL') + '; brief acceptance ' + (briefAt || 'NULL') +
    '; any child anchor is an immutable ancestor of both candidate and fixed accepted chain');
}

// This is an exact source policy, not a generic wrapper or move exception. Pin the
// whole child declaration/product closure plus the immutable parent originals. The
// independently reviewed two-stage helper supplies actual original assertions; a
// different file that only prints its needle cannot satisfy these source checks.
function loadSuccessorPolicy() {
  assert.equal(diskSha(SUCCESSOR_POLICY_FILE), SUCCESSOR_POLICY_SHA, 'SUCCESSOR-POLICY-BYTES');
  assert.equal(gitSha('HEAD', SUCCESSOR_POLICY_FILE), SUCCESSOR_POLICY_SHA, 'SUCCESSOR-POLICY-GIT-BYTES');
  return J.parseExact(fs.readFileSync(rel(SUCCESSOR_POLICY_FILE)));
}
function validateSuccessorDefinition(s, bound, p) {
  assert.equal(sha(Buffer.from(JSON.stringify(p, null, 2) + '\n')), SUCCESSOR_POLICY_SHA, 'SUCCESSOR-POLICY-DEFINITION');
  assert.equal(ID, 'B-NTC', 'SUCCESSOR-WRONG-PACKAGE');
  assert.equal(s.lanePackage, p.lanePackage, 'SUCCESSOR-WRONG-PACKAGE');
  assert.equal(s.packageId, p.packageId, 'SUCCESSOR-WRONG-PACKAGE');
  assert(bound, 'SUCCESSOR-PARENT-MISSING');
  for (const [key, value] of Object.entries(p.parent)) assert.equal(bound.option[key], value, 'SUCCESSOR-PARENT-' + key);
  assert.equal(sha(L.object(root, p.sourceCommit, p.parent.artifact)), p.parent.sha256, 'SUCCESSOR-PARENT-ORIGIN');
  assert.equal(sha(Buffer.from(JSON.stringify(bound.acceptance, null, 2) + '\n')), p.parent.sha256, 'SUCCESSOR-PARENT-DEFINITION');
  assert.deepEqual(s.coverage, p.coverage, 'SUCCESSOR-COVERAGE-MAPPING');
  assert.deepEqual(s.children, p.children, 'SUCCESSOR-CHILD-DECLARATIONS');
  assert.deepEqual(s.product, p.product, 'SUCCESSOR-PRODUCT-CLOSURE');
  L.checkSources(root, p.sourceCommit, p.sourcePins);
  L.checkSources(root, 'HEAD', p.sourcePins);
  return p;
}
function successorAuthorization(s, bound) {
  assert(s.authorizations.theme, 'SUCCESSOR-PM-AUTHORITY-UNISSUED');
  return childLedger(s, bound, s.authorizations.theme, 'successor theme',
    [s.packageId, 'B-NTC-SUCCESSORS ' + SUCCESSOR_POLICY_SHA]);
}
function successorSupport(s, bound) {
  // The CLI package selects this obligation. Candidate argv, declarations and
  // parent pins can never turn it off, even when an unchanged helper loads as a test.
  if (ID !== 'B-NTC') return null;
  assert(bound, 'SUCCESSOR-PARENT-MISSING');
  const p = validateSuccessorDefinition(s, bound, loadSuccessorPolicy());
  successorAuthorization(s, bound);
  return p;
}
function acceptedOriginalChildren(bound) {
  if (Array.isArray(bound.acceptance.children)) return bound.acceptance.children;
  // Exact legacy format: the accepted artifact pins this schedule-bearing source.
  // These five entries are the literal names/argv/verdicts in that immutable file.
  const artifactSha = 'e940359b684b90e2e92ae325a86c018f91a7aa27bec7c5466165116657c2201a';
  const file = 'rebuild/m4/spec/native-carriers-package.cjs';
  const hash = '0fe94beee6a6e57315eee8535690d378cf42171e4c64bcf6172284fa47703655';
  assert.equal(sha(Buffer.from(JSON.stringify(bound.acceptance, null, 2) + '\n')), artifactSha, 'INHERITED-ACCEPTED-CHILD-SCHEDULE-UNAVAILABLE');
  assert.equal(bound.option.sha256, artifactSha, 'INHERITED-ORIGINAL-PARENT');
  assert.equal(bound.acceptance.executionPins[file], hash, 'INHERITED-ORIGINAL-SCHEDULE-PIN');
  L.checkSources(root, bound.reviewedCommit, { [file]: hash });
  const verdicts = {
    'source-carriers': 'NATIVE SOURCE CARRIERS: 6/6 PASS;',
    'inherited-carriers': 'NATIVE INHERITED CARRIERS: 6/6 PASS;',
    'defect-witnesses': 'NATIVE DEFECT WITNESSES: 10/10 complete comparisons PASS;',
    'writers-differential': 'NATIVE WRITERS DIFFERENTIAL: 3/3 Date/trap modes PASS;',
    'second-gate': 'NATIVE SECOND GATE:',
  };
  return Object.entries(verdicts).map(([name, needle]) => ({ name, argv: ['rebuild/m4/spec/native-carriers-' + name + '.cjs'], needle }));
}
function inheritedExecutable(s, bound, gate, child, result, support) {
  assert(result && result.ok, 'COVERAGE-CHILD-NOT-EXECUTED ' + gate + ' ' + child);
  const declared = s.children.find(c => c.name === child);
  assert(declared, 'INHERITED-CHILD-DECLARATION');
  assert.deepEqual(result.targets, childArgv(declared), 'INHERITED-EXECUTION-TARGETS');
  if (ID === 'B-NTC') {
    assert(support && support.coverage.inherited[gate] === child, 'SUCCESSOR-POLICY-REQUIRED-FOR-INHERITANCE');
    const exact = support.children.find(c => c.name === child);
    assert.deepEqual(declared, exact, 'SUCCESSOR-EXECUTABLE-DEFINITION');
    assert.equal(result.needle, exact.needle, 'SUCCESSOR-EXECUTED-VERDICT');
    return;
  }
  // Other packages can inherit an original route only from the exact schedule
  // embedded in their independently accepted parent or its exact pinned legacy
  // schedule source. ANY pinned helper is not an original gate executable.
  const originals = acceptedOriginalChildren(bound);
  assert.equal(bound.acceptance.coverage.byChild[gate], child, 'INHERITED-ACCEPTED-GATE-MAPPING');
  const matches = originals.filter(c => c.name === child);
  assert.equal(matches.length, 1, 'INHERITED-ACCEPTED-CHILD-SCHEDULE');
  assert.deepEqual(declared, matches[0], 'INHERITED-ACCEPTED-ARGV-VERDICT');
  assert.equal(result.needle, matches[0].needle, 'INHERITED-EXECUTED-VERDICT');
  for (const file of result.targets) {
    const pin = bound.acceptance.executionPins[file] || bound.acceptance.product[file];
    const hash = typeof pin === 'string' ? pin : pin && (pin.post || pin.pre);
    assert(hash && diskSha(file) === hash && gitSha('HEAD', file) === hash, 'INHERITED-ACCEPTED-EXECUTABLE-BYTES');
  }
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
  // Y1 / r4 §5.1, the honesty half. For B1..B4 this sentence is the substantive obligation:
  // a declared D-id only goes GREEN-candidate because the repair is really in the engine.
  // For a NO_REGISTER_IDS package the same 45 rows are the REGISTER BASELINE and nothing
  // more — they agree on the day the package is empty and on the day it is finished, and
  // reporting them as "agreement with the spec" without saying so is an X4-class overstatement.
  say('LAWS DECLARED-STATE ' + agree + '/45 rows agree with the spec at product phase ' + phase +
    (NO_REGISTER_IDS.has(ID)
      ? '; this package declares NO D-id, so these rows are the register BASELINE and prove nothing about it — its obligation is the Y1 own-child rule reported below'
      : '; the package D-ids must be GREEN-candidate / RED-frozen before any receipt'));
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
  // X3. Which gates, if any, this child is declared to MOVE — the gate ids in
  // coverage.moves already say which original each moving child must prove it ran, so no
  // new spec shape is needed. Empty under X1; the code path is exercised by the bites.
  const movedGates = new Map();
  for (const [gate, move] of Object.entries(s.coverage.moves)) movedGates.set(move.child, [...(movedGates.get(move.child) || []), gate]);
  if (!s.children.length) {
    say('CHILDREN PENDING; the package declares no own children yet (source carriers, traces, direct cases, witnesses, mutants, bites, second gate)');
    note('package children not authored'); return ran;
  }
  for (const c of s.children) {
    const targets = childArgv(c); // re-asserted here: the argv that is SPAWNED is the argv that was checked
    const r = cp.spawnSync(process.execPath, c.argv, { cwd: root, env, encoding: 'utf8', windowsHide: true, timeout: 1800000, maxBuffer: 32 * 1024 * 1024 });
    const out = r.stdout || '', bytes = Buffer.byteLength(out, 'utf8');
    fs.writeFileSync(path.join(logDir, c.name + '.log'), out + (r.stderr || ''));
    assert(!r.error && r.status === 0, 'Required child ' + c.name);
    // N3. The needle is a VERDICT, so it must stand at the head of its own line — not
    // somewhere inside a longer sentence, and not inside a negation. And a process that
    // printed a handful of bytes did not execute a gate file: `node --version` exits 0 and
    // prints its own eight characters at line start, so the floor is what refuses it.
    assert(new RegExp('^' + escapeRe(c.needle), 'm').test(out), 'CHILD-NEEDLE-NOT-A-TERMINAL-LINE ' + c.name);
    // X3. A MOVING child is held to the ORIGINAL GATE'S OWN test, not to a byte count. r3's
    // N3-05 and N3-07 both cleared the >=200-byte floor while the original never ran — 283
    // bytes of `z`, and a fabricated verdict line printed before the require. Neither can
    // produce the gate's own needle, because only the gate's own code prints it. So for a
    // moving child the floor is not evidence at all: the needle out of R.GATES is, matched
    // the way run.cjs matches it. A non-moving child keeps the floor — it covers nothing by
    // itself; its executions are what the inherited map already binds.
    const moved = movedGates.get(c.name) || [];
    for (const gate of moved)
      assert(out.includes(GATE_NEEDLE.get(gate)),
        'COVERAGE-MOVE-CHILD-DID-NOT-EMIT-THE-ORIGINAL-GATE-NEEDLE ' + c.name + ' ' + gate + '; ' + bytes +
        ' byte(s) of stdout without ' + JSON.stringify(GATE_NEEDLE.get(gate)) + ' — the byte floor is not evidence for a moving child');
    if (!moved.length) assert(bytes >= NEEDLE_FLOOR || GATE_TERMINAL.test(out),
      'CHILD-DID-NOT-REALLY-EXECUTE ' + c.name + '; ' + bytes + ' byte(s) of stdout and no original gate terminal line');
    ran.set(c.name, { ok: true, needle: c.needle, bytes, targets, moved });
    say('CHILD ' + c.name + ' OBSERVED; exit 0, ' + bytes + ' bytes of stdout, exact declared verdict at line start; ran ' + targets.join(' ') +
      (moved.length ? '; and emitted the original gate needle(s) ' + moved.join(' ') : ''));
  }
  return ran;
}
// W2. A gate is covered ONLY by a declared child that executed here with its exact
// declared verdict — never by a file's existence. The inherited set must be exactly the
// parent artifact's own covered set; a move is carried by this package's own successor.
function coverage(s, bound, ran) {
  const support = successorSupport(s, bound);
  const covered = new Map([...Object.entries(s.coverage.inherited), ...Object.entries(s.coverage.moves).map(([g, m]) => [g, m.child])]);
  for (const [gate, child] of covered) assert(ran.get(child) && ran.get(child).ok, 'COVERAGE-CHILD-NOT-EXECUTED ' + gate + ' ' + child);
  const byChild = bound && bound.acceptance.coverage && bound.acceptance.coverage.byChild;
  if (!byChild) { if (covered.size) note('inherited coverage unverified against a parent artifact until the PM names the parent'); }
  else {
    // N1. The WHOLE inherited map, gate AND child, is the parent artifact's own — not just
    // its gate ids. Re-pointing the parent's nine at one child of this spec's choosing is
    // what B30 did; that is what this equality refuses.
    assert.deepEqual(s.coverage.inherited, byChild, 'INHERITED-COVERAGE-IS-NOT-THE-PARENT-COVERED-SET');
    for (const [gate, child] of Object.entries(s.coverage.inherited)) {
      inheritedExecutable(s, bound, gate, child, ran.get(child), support);
    }
    // The closed bound the accepted original states as assert.equal(covered.length, 9):
    // exactly the parent's covered set plus this package's own declared, bounded moves.
    assert.equal(covered.size, Object.keys(byChild).length + Object.keys(s.coverage.moves).length, 'COVERED-SET-BOUND');
  }
  assert.equal(covered.size, Object.keys(s.coverage.inherited).length + Object.keys(s.coverage.moves).length, 'COVERED-SET-BOUND');
  say('COVERAGE ' + covered.size + '/' + GATE_IDS.length + ' original gate(s) covered by ' + new Set(covered.values()).size + ' executed child(ren) (' +
    Object.keys(s.coverage.inherited).length + ' inherited' + (byChild ? ', the parent map byte-for-byte' : ', unverified') + '; ' +
    Object.keys(s.coverage.moves).length + ' moved, each naming its own original executable in a relative require specifier' +
    ' and each proved by that gate’s own needle out of R.GATES in the child’s stdout); ' +
    (GATE_IDS.length - covered.size) + ' re-execute under --full');
  // The declared verdict is never echoed: it carries the word PASS, and a REVIEW-PENDING
  // run must print that word only inside its own two negations.
  for (const [gate, child] of covered) {
    const move = s.coverage.moves[gate];
    say('COVERAGE ' + gate + ' <- child ' + child + ' executed in this run; exit 0 and exact declared verdict' +
      (move ? '; MOVED, declared against ' + GATE_FILE.get(gate) + ' and observed emitting that gate’s own needle — ' + move.reason
        : '; inherited from ' + (bound ? bound.option.id : 'the parent the PM has not named yet')));
  }
  return covered;
}
// Y1 (TOOLING-REVIEW-r4 §5.1/§7), the reporting half — the refusing half is in envelope(),
// at the seal. A package in NO_REGISTER_IDS has no D-id and therefore no law obligation;
// this is what stands in its place and it is OPEN until it is met, so a --ci run of an
// unfinished no-register package cannot read as if nothing were owed. Nothing here is a
// declaration: `own` is derived from the spec's own product roles (ownChildren) and
// `executed` from the map children() built by actually spawning them in this process.
function noRegister(s, ran) {
  if (!NO_REGISTER_IDS.has(ID)) return;
  const own = ownChildren(s), executed = own.filter(c => ran.get(c.name) && ran.get(c.name).ok);
  say('NO-REGISTER OBLIGATION ' + ID + ' registers no D-id, so the 45-law accounting imposes nothing on it; in its place ' +
    executed.length + ' of ' + own.length + ' declared child(ren) executing one of this package\'s own role:"new" product file(s) ran in this process, ' +
    'exit 0, with their exact declared needle at line start — ' + MIN_OWN_CHILDREN + ' required at the seal (' + s.children.length +
    ' child(ren) declared in total' + (own.length ? ': ' + own.map(c => c.name + ' -> ' + childArgv(c).filter(f => Object.hasOwn(s.product, f) && s.product[f].role === 'new').join(' ')).join('; ') : '') + ')');
  if (executed.length < MIN_OWN_CHILDREN)
    note('no-register package: ' + executed.length + ' of the ' + MIN_OWN_CHILDREN +
      ' required child(ren) executing this package\'s own new product file(s) ran (TOOLING-REVIEW-r4 Y1; the seal refuses while this stands)');
}

// ------------------------------------------- 6. the authorized-envelope gate (PASS)
// W1. The sealed artifact IS the substantive package: it carries the spec bytes' sha256,
// this runner's sha256, the product map and the execution pins. proposed() recomputes it
// from the spec and the bytes on disk; envelope() refuses on any mismatch. The PM's
// integrator writes acceptance-<slug>.json with exactly these bytes — this tooling never
// writes in rebuild/m4/spec.
function proposed(s, bound) {
  const pins = { [RUNNER]: diskSha(RUNNER), [TOOLING + '/packages/' + ID + '.json']: sha(specRaw) };
  if (successorSupport(s, bound)) pins[SUCCESSOR_POLICY_FILE] = diskSha(SUCCESSOR_POLICY_FILE);
  if (fs.existsSync(rel(s.brief.file))) pins[s.brief.file] = diskSha(s.brief.file);
  if (s.carrierSuccessor && fs.existsSync(rel(s.carrierSuccessor.file))) pins[s.carrierSuccessor.file] = diskSha(s.carrierSuccessor.file);
  for (const c of s.children) for (const f of childArgv(c)) pins[f] = diskSha(f);
  const covered = [...Object.keys(s.coverage.inherited), ...Object.keys(s.coverage.moves)].sort(), o = bound.option;
  return {
    version: 1, lanePackage: ID, packageId: s.packageId, sourceBase: s.sourceBase,
    // X2: the parent's review byte-pin travels INTO the sealed artifact, so a later reader
    // of the artifact can re-take it without trusting the spec that produced it.
    parent: { id: o.id, artifact: o.artifact, sha256: o.sha256, review: o.review, reviewSha256: o.reviewSha256, receiptLedgerLine: o.receiptLedgerLine, reviewedCommit: bound.reviewedCommit },
    spec: { file: TOOLING + '/packages/' + ID + '.json', sha256: sha(specRaw) }, runner: { file: RUNNER, sha256: diskSha(RUNNER) },
    dIds: s.dIds, laws: s.laws, carriedAcceptedIds: s.carriedAcceptedIds, privateLiveTriggered: s.privateLiveTriggered,
    gates: GATE_IDS.slice().sort(),
    coverage: { covered, run: GATE_IDS.filter(g => !covered.includes(g)).sort(), moves: s.coverage.moves,
      byChild: { ...s.coverage.inherited, ...Object.fromEntries(Object.entries(s.coverage.moves).map(([g, m]) => [g, m.child])) } },
    authorizations: s.authorizations, product: s.product, carrierSuccessor: s.carrierSuccessor, witnessFlips: s.witnessFlips,
    protectedSurfaces: s.protectedSurfaces, children: s.children, artifact: { file: ARTIFACT, review: REVIEW }, executionPins: pins,
  };
}
const ARTIFACT_KEYS = ['version', 'lanePackage', 'packageId', 'sourceBase', 'parent', 'spec', 'runner', 'dIds', 'laws', 'carriedAcceptedIds',
  'privateLiveTriggered', 'gates', 'coverage', 'authorizations', 'product', 'carrierSuccessor', 'witnessFlips', 'protectedSurfaces',
  'children', 'artifact', 'executionPins'];
// Returns {authorized, said, sealed, key}; `key` identifies everything this evaluation
// depended on, and the END-of-run re-evaluation must reproduce it exactly (W5).
function envelope(s, bound, ran) {
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
  // X1, re-asserted AT THE SEAL. spec() already refused a non-empty coverage.moves, so this
  // can only fire if a future edit loosens that gate without loosening this one; it is here
  // because the reviewer's requirement is literally "must be {} at every seal", and the seal
  // is this branch. Nothing below it is reachable with a move declared.
  assert(MOVES_RULING !== null || !Object.keys(s.coverage.moves).length,
    'COVERAGE-MOVES-REFUSED-AT-SEAL-WITHOUT-A-PM-RULING ' + Object.keys(s.coverage.moves).join(' '));
  // Y1 — BLOCKING, and the seal is where it belongs. A package in NO_REGISTER_IDS carries
  // no D-id, so nothing in the 45-law accounting is ever owed by it: want(d) is RED for
  // every un-carried id and GREEN for the six carried ones whether the package is empty or
  // finished. Without this, POSTFIX PACKAGE PASS would print on a run in which not one line
  // of the package's own new code executed (r4 §5.1). It cannot live in spec(): before the
  // carrier lands the target file does not exist and CHILD-ARGV-TARGET refuses the
  // declaration — so it lives HERE, where the files exist by definition. MIN_OWN_CHILDREN
  // and role "new" are both fixed in this file (W7), so no spec can declare its way past it.
  // The execution half is enforced twice over: children() refuses any declared child that
  // does not run in this process, exit 0, with its exact needle at line start, and the
  // END-of-run re-evaluation re-asserts it here against the map that run actually produced.
  const own = NO_REGISTER_IDS.has(ID) ? ownChildren(s) : [];
  assert(!NO_REGISTER_IDS.has(ID) || own.length >= MIN_OWN_CHILDREN,
    'NO-REGISTER-PACKAGE-SEALED-WITHOUT-EXECUTING-ITS-OWN-PRODUCT ' + ID + '; ' + s.children.length +
    ' declared child(ren), ' + own.length + ' of them executing a role:"new" product file of this package, ' + MIN_OWN_CHILDREN + ' required');
  if (ran) for (const c of own)
    assert(ran.get(c.name) && ran.get(c.name).ok, 'NO-REGISTER-PACKAGE-OWN-CHILD-DID-NOT-EXECUTE ' + ID + ' ' + c.name);
  assert(s.authorizations.theme, 'THEME-AUTHORIZATION-UNAVAILABLE'); // no PASS before the brief's own ledger line is bound
  assert(s.brief.acceptedLedgerLine && s.status === 'BRIEF-ACCEPTED', 'BRIEF-ACCEPTANCE-UNAVAILABLE'); // N4: no PASS on an unaccepted brief
  authority(s, bound);
  successorSupport(s, bound);
  L.verifyReceipt(root, r.commit, r, { role: 'cowork', mentions: [s.packageId, ARTIFACT, hash] });
  const cited = { owner: [s.authorizations.owner, ['M2-RULE']], contract: [s.authorizations.contract, ['POSTFIX-GATE BRIEF']],
    theme: [s.authorizations.theme, [s.packageId]], brief: [s.brief.acceptedLedgerLine, [s.packageId, s.brief.file]] };
  for (const [v, mentions] of Object.values(cited))
    L.verifyReceipt(root, r.commit, { commit: r.commit, path: 'rebuild/DECISIONS.md', line: v.line, lineSha256: v.lineSha256 }, { role: v.role, mentions });
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
  L.git(root, ['merge-base', '--is-ancestor', r.commit, CHAIN_REF]); // the real chain branch, from Git refs, never from the spec
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
  successorSupport(s, bound); // refuse unissued or changed successors before any campaign
  // Honesty: this line ECHOES free text the spec supplies and counts it. It asserts
  // nothing, and r2 was right that "UNCHANGED" read as an observation. What actually holds
  // these surfaces is product(), pins() and the PIN_PATHS check above — not this sentence.
  say('PROTECTED SURFACES ' + s.protectedSurfaces.length + ' declared by the spec and echoed here, asserted by nothing in this line: ' + s.protectedSurfaces.join(' | '));
  say('PRIVATE LIVE-TRIGGERED ' + (s.privateLiveTriggered.length ? s.privateLiveTriggered.join(' ') : 'none') +
    '; a census change on any other declared D-id is a RED stop for a reviewed successor cell, never a golden regeneration');
  const bundles = Reference.create(root); // pinned public reference bundles, before any candidate factory loads
  const env = laws(s, bundles, phase);
  carriers(s);
  const ran = children(s, env);
  const covered = coverage(s, bound, ran);
  noRegister(s, ran); // Y1: the replacement obligation for a package with no D-id
  if (!ci) { privateOracle(); historical(bound, bundles); gates(bundles, first.authorized, covered, ran); }
  // W5. Re-evaluate AFTER all evidence: an artifact, review, receipt, spec or runner
  // swapped mid-run changes `key` and refuses here, before any terminal word is printed.
  // `ran` is handed over so the Y1 seal assert can re-take the EXECUTION half against the
  // map this run actually produced, not only the declaration half it could see at the top.
  const last = envelope(s, bound, ran);
  assert.equal(last.key, first.key, 'ENVELOPE-CHANGED-DURING-THE-RUN');
  assert.equal(last.authorized, first.authorized, 'ENVELOPE-CHANGED-DURING-THE-RUN');
  if (!last.authorized) note(last.sealed === null ? 'closed cumulative profile not sealed' : 'independent exact-artifact acceptance PENDING', false);
  for (const o of open) say('OPEN ' + o.reason);
  if (ci) {
    const blocking = open.filter(o => o.ciBlocking);
    if (blocking.length) { say('CI REVIEW-PENDING: ' + blocking.length + ' open obligation(s); public evidence only; no PASS is claimed'); process.exitCode = 2; }
    else { say('PUBLIC CI EVIDENCE PASS — public evidence only, NOT the package verdict; the 19 original gates, the private oracle and independent exact-artifact acceptance remain separate, and POSTFIX PACKAGE PASS is unavailable on this mode at any time'); process.exitCode = 0; }
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
