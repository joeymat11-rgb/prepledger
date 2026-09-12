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
// that line's exact bytes found IN GIT at the parent's receipt base, never by declaration.
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
//
// TOOLING-REVIEW r5 (Z1-Z11), on the withdrawn successor commits. r5 rejected 7cd7a5b and
// 85f7d56 and lane B REVERTED both rather than patch them: their admission condition was a
// theme digest DECISIONS:112 (2) declares void, they verified no relation between a
// successor and the parent's original, they held successors to prefix needles where the
// parent was held to full verdicts, and they turned an unissued authorization into an
// opaque exit-1 FAIL for the one package they existed for. What lands instead is lane B's
// own, under the ruling that has since been made: DECISIONS:113 (1), which ratifies
// B-NTC-REVIEW-r2 E.3 as written. Z1: SUCCESSOR_RULING is the only thing that admits a
// successor and it is recorded HERE, not in a policy file; the admitted gates are DERIVED
// from the parent artifact's own coverage.byChild plus the carrier's own source closure,
// never a hardcoded nine. Z2: successorCoverage() proves the RELATION - the original is
// the parent's byte in the parent's pin map and in Git at the parent's acceptance commit;
// the successor names it and contains none of its lines; its substitutions are exactly the
// spec's enumerated list and nothing else in its closure replaces. Z3: the verdict needle
// is the parent wrapper's own `verdicts` string in full, read out of the pinned original.
// Z4: nothing on this path asserts for an authority that is merely not yet issued - the
// brief line and the seal stay OPEN obligations and B-NTC exits 2 like every other
// package. Z5: there is no policy sourceCommit at all; pins are taken at HEAD and the
// parent's acceptance commit is anchored on CHAIN_REF. Z6: the catch names the refusing
// assertion from a vocabulary derived from this file. Z7: the spec is pinned in Git at
// HEAD as the runner is. Z11: the UNDECIDED branch says that Y2's scan did not run.
// The void theme name and every Astra policy digest appear nowhere in this tree at all.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../../..'), P = path.join(root, 'rebuild/conform/v4/postfix');
const R = require(path.join(P, 'run.cjs')), L = require(path.join(P, 'legacy-gates.cjs')), J = require(path.join(P, 'strict-json.cjs'));
const { sha } = require(path.join(P, 'target.cjs'));
const BLOCKED = require(path.join(root, 'rebuild/m4/spec/native-carriers-errors.cjs')).codes; // the original closed BLOCKED list
const Reference = require(path.join(root, 'rebuild/m4/spec/load-write-reference.cjs'));
const TOOLING = 'rebuild/lanes/b/tooling', RUNNER = TOOLING + '/b-package.cjs';
// The closed package-id list. Case-exact, ordered as the PM ruled the chain
// (DECISIONS:103 (1): B-NTC first, then B1, B2, B4, B3; B-LOM follows B-NTC if the legacy
// order-mapping seam turns out not to be the same seam). DECISIONS:124 rules a new package
// in between — M2-H3-CLEAN-INIT, child of M2-B-NTC, "ORDER B-NTC → H3 → B1 → B2 → B4 → B3"
// — so H3 stands here, before B1. Widening this list is the ONLY way a new package id
// becomes runnable — a spec can never nominate its own id.
const SPEC_DIR = path.join(__dirname, 'packages'), IDS = ['B-NTC', 'B-LOM', 'H3', 'B1', 'B2', 'B3', 'B4'];
// The real chain branch, resolved from GIT REFS and never from a spec (X2/R3-B). Every
// ancestry assertion that decides whether a commit is on the accepted chain names THIS.
const CHAIN_REF = 'refs/remotes/origin/rebuild/t2-client-core';
// X1. The PM ruling that would admit a gate MOVE. It does not exist, so every non-empty
// coverage.moves refuses — see the header. Setting this to anything other than null is a
// reviewed tooling change, not a spec change, and it must not land before X3's needle
// proof has been exercised on a real move.
const MOVES_RULING = null;
// TOOLING-REVIEW r5 (Z1-Z11) / B-NTC-REVIEW r2 (R5). THE SUCCESSOR RULING, recorded HERE
// and nowhere else (W7), because DECISIONS:113 (1) (e) says in terms "the tooling records
// this ruling id and refuses coverage.inherited in any package that does not cite it".
//
// DECISIONS:113 (1) ratifies MOVES_RULING B-NTC-INHERITED-1 "AS WRITTEN in
// B-NTC-REVIEW-r2.md §E.3 (this line is its id; it particularises DECISIONS:112 (1))".
// r5's Z1 was written before that line landed and reads :112's earlier wording, under
// which the nine successors would be coverage.moves. :113 settles r5's own PM question 1
// the other way and is the operative text: the child declares coverage.INHERITED naming a
// successor executable per parent child name, on five conditions — (a) coverage.moves
// stays {}, so X1 is NOT widened, for B-NTC or for anyone; (b) each successor compiles the
// parent gate's own original body, sha-verified against the parent's executionPins AND
// against the Git blob at the parent's acceptance commit, in a private module; (c) the
// only permitted text substitution is a pin re-target made necessary by a declared
// superseded-by-child product path, every one enumerated verbatim in the package spec;
// (d) the child never inherits the parent's accepted boolean; (e) this.
//
// So MOVES_RULING stays null and coverage.moves stays refused everywhere. What this
// constant admits is narrower: an inherited gate whose covering child is NOT a
// parent-pinned executable — the case coverage() refuses outright for every other package
// with INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE. A spec can never reach
// the successor path by declaration: the id below must be cited, the package id must be in
// the closed set below, and the gate must be one the PARENT ARTIFACT's own coverage.byChild
// records against a carrier that reads the superseded support file — derived at run time
// from the parent's bytes (successorGates), never a hardcoded list of nine names.
const SUCCESSOR_RULING = 'DECISIONS:113';
// The ruling's OWN id, fixed here beside its coordinate (W7) and for the same reason r6's
// F6 gives: a ledger COORDINATE is the spec's word, and `DECISIONS:113` is this runner's.
// ":113 (1)" ratifies "MOVES_RULING B-NTC-INHERITED-1", so the line standing at that
// coordinate on CHAIN_REF must say so before its bytes are read as the ruling text — which
// is what makes rulingText() a reading of THE RULING rather than of whatever line happens
// to be numbered 113 the day it is read.
const SUCCESSOR_RULING_ID = 'B-NTC-INHERITED-1';
// ":113 … for M2-B-NTC only". Fixed here; a spec cannot nominate its own id.
const SUCCESSOR_PACKAGES = new Set(['B-NTC']);
// ":113 (b) … the Git blob at the parent's acceptance commit b95ccca…". The commit is the
// one DECISIONS:104's re-seal names as reviewed, and it is asserted to be on the real chain
// branch (CHAIN_REF) and an ancestor of HEAD before any blob is read out of it — X2's rule
// applied to the successor path, which is r5's Z5. There is no policy `sourceCommit`: every
// successor and original byte is verified on disk and in Git AT HEAD, and the parent's own
// bytes against the chain. A commit a file names is never trusted for provenance.
const SUCCESSOR_PARENT_COMMIT = 'b95ccca879e371b5ba225ad12cae612ec89469ba';
// The parent wrapper whose `verdicts` table IS the accepted schedule (r5 Z3): the exact
// terminal strings the parent's own children must print. Read out of the immutable
// original, never re-typed here, exactly as PIN_PATHS and GATE_NEEDLE are.
const SUCCESSOR_WRAPPER = 'rebuild/m4/spec/native-carriers-package.cjs';
// The support file whose supersession is what makes a successor necessary at all
// (DECISIONS:109 PATH A). A parent carrier that does not reach it has no claim to a
// successor, and successorGates() refuses the gate rather than admitting it.
const SUCCESSOR_SUPPORT = 'rebuild/m4/workout/engine-runtime.cjs';
// r5 Z2. The successor's own substitution table must stand in its source as ONE strict-JSON
// literal under this name, so the runner can read it without executing a line of the lane's
// code — the same discipline PIN_PATHS uses against run.cjs. Every replacement the successor
// performs must be driven by it, and it must equal the spec's enumerated list byte for byte.
const SUCCESSOR_TABLE = 'SUBSTITUTIONS';
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
const TOOLING_FILES = [RUNNER, TOOLING + '/README.md', TOOLING + '/TOOLING-REPORT.md', TOOLING + '/TOOLING-FIX-ASTRA-REPORT.md',
  TOOLING + '/TOOLING-FIX-r5-REPORT.md', TOOLING + '/test/execution-targets.test.cjs', TOOLING + '/test/successor-moves.test.cjs',
  TOOLING + '/test/product-phase-and-ledger.test.cjs', ...IDS.map(i => TOOLING + '/packages/' + i + '.json')];
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
// Z6 / r5 F6 / r2 "what the PM must rule" 7. THE REFUSAL VOCABULARY. Every refusal used to
// collapse to one sentence and one exit code: r5 applied twelve structurally different
// tampers and got twelve byte-identical terminals, and r2 had to preload an assert tracer
// to learn why B-NTC refused at all. A lane can spend a whole pass guessing at that.
//
// What is printed is a CODE and nothing else. The vocabulary is DERIVED from this runner's
// own source — every named assertion label in this file already opens with an upper-kebab
// code, so the set is exactly the set of names a reviewer can grep for — and the catch
// prints a code only if the refusing message OPENS with one of them. That is what keeps
// the promise narrow: no assertion detail, no path, no count, no child stdout or stderr,
// nothing derived from the private census, and nothing an input can inject, because a
// string that is not already a name in this file is not in the set. The BLOCKED path is
// untouched — it still prints only its own closed code, and --full's private-oracle
// refusal still terminates `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` and nothing more.
// A hand that edits this file to widen the set moves the runner's own sha256 and refuses at
// RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER-IN-GIT before a line of it runs.
// TOOLING-REVIEW r6 change 6 (F5). The vocabulary stopped at this file's own names, so the
// refusals thrown by the REQUIRED ORIGINALS reached the catch as bare sentences: a forged
// ledger citation printed `B PACKAGE <ID> FAIL` with no code at all, which is the highest-
// value refusal this runner has. Those modules refuse in their own CLOSED vocabulary —
// target.cjs `fail(code)` and strict-json.cjs `bad(code)` both throw `new Error(code)`, so
// the code IS the message and failCode() already reads it. What was missing was admitting
// the names. They are read out of the immutable modules exactly the way BLOCKED is imported
// from native-carriers-errors.cjs, and narrowly: only the literal argument of those two
// closed refusal constructors, from a list of modules fixed HERE (W7) — the ones this
// runner already requires. Nothing an input can shape enters: a spec cannot add a module to
// this list, and a hand that edits it moves the runner's own sha256.
const ORIGINAL_CODE_SOURCES = [path.join(P, 'target.cjs'), path.join(P, 'legacy-gates.cjs'), path.join(P, 'strict-json.cjs'),
  path.join(P, 'run.cjs'), path.join(root, 'rebuild/m4/spec/native-carriers-errors.cjs'), path.join(root, 'rebuild/m4/spec/load-write-reference.cjs')];
const FAIL_CODES = (() => {
  const src = fs.readFileSync(path.join(__dirname, 'b-package.cjs'), 'utf8'), out = new Set();
  for (const m of src.matchAll(/'([A-Z][A-Z0-9]*(?:-[A-Z0-9]+){2,})(?=['; ])/g)) out.add(m[1]);
  // held() composes two suffixes onto a base code; they are names too, so they are in.
  for (const base of [...out]) for (const suffix of ['-AT-SOURCEBASE', '-GIT-DISK-DISAGREE']) out.add(base + suffix);
  // The originals' own closed codes — RECEIPT-*, JSON-*, WORKTREE-SOURCE-PIN and their
  // siblings. One hyphen group is enough here (RECEIPT-CONTENT is a name), because the
  // string is not free text: it stands as the sole literal argument of fail()/bad().
  for (const file of ORIGINAL_CODE_SOURCES)
    for (const m of fs.readFileSync(file, 'utf8').matchAll(/\b(?:fail|bad)\(\s*'([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+)'\s*\)/g)) out.add(m[1]);
  assert(out.size >= 40, 'REFUSAL-VOCABULARY-TOO-SMALL ' + out.size);
  return out;
})();
// The one function that decides what a refusal may say. It reads the LEADING RUN of code
// characters and returns it only if it is already a name in this file; assert.equal appends
// its own "a !== b" diff after a newline, and that diff (and every path, count and value
// any message carries) stops at the first character a name cannot contain. Never returns
// anything an input could have shaped, because an unrecognised token returns null.
function failCode(message) {
  const token = (/^([A-Z][A-Z0-9-]{7,})/.exec(typeof message === 'string' ? message : '') || [])[1];
  return token && FAIL_CODES.has(token) ? token : null;
}
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
// r5 Z2. The SOURCE CLOSURE of a declared executable: the file itself plus every file it
// reaches through a relative require/import specifier, resolved the way requiresOriginal()
// resolves one. This is read, never executed, and it is bounded — a closure that will not
// close inside CLOSURE_LIMIT files is refused rather than truncated, because a truncated
// closure would silently weaken every check built on it.
// `enter` decides which reached files belong to the closure. proveSuccessor() passes "the
// files THIS PACKAGE declares as its own role:'new' product", because that is exactly the
// lane's own code. Everything else a successor requires is either the accepted parent's own
// pinned original (held byte-identical by pins() and by the two sha anchors below) or the
// immutable conform/postfix library (held by PIN_PATHS); neither is the successor's code,
// and walking into them would make the copy check see the original inside itself and the
// replace-site check read someone else's library. Files at the boundary are still CHECKED —
// proveSuccessor() refuses a boundary file that is neither pinned nor declared — they are
// just not part of the successor's own source.
const CLOSURE_LIMIT = 64;
function closure(file, enter = () => true) {
  const seen = new Map(), queue = [file], boundary = new Set();
  while (queue.length) {
    const f = queue.shift();
    if (seen.has(f)) continue;
    if (f !== file && !enter(f)) { boundary.add(f); continue; }
    assert(seen.size < CLOSURE_LIMIT, 'SUCCESSOR-SOURCE-CLOSURE-TOO-LARGE ' + file);
    assert(fs.existsSync(rel(f)) && fs.statSync(rel(f)).isFile(), 'SUCCESSOR-SOURCE-CLOSURE-FILE-MISSING ' + f);
    const src = fs.readFileSync(rel(f), 'utf8');
    seen.set(f, src);
    const dir = path.posix.dirname(f);
    for (const m of src.matchAll(/(?:\brequire|\bimport)\s*\(\s*['"]([^'"]+)['"]\s*\)|\bfrom\s*['"]([^'"]+)['"]/g)) {
      const ref = m[1] || m[2];
      if (!ref || !ref.startsWith('.')) continue;
      const base = path.posix.normalize(path.posix.join(dir, ref));
      for (const cand of [base, base + '.cjs', base + '.js', base + '.mjs'])
        if (fs.existsSync(rel(cand)) && fs.statSync(rel(cand)).isFile()) { queue.push(cand); break; }
    }
  }
  seen.boundary = boundary;
  return seen;
}
// Z1's derivation, and it is a DERIVATION: the gates a successor may carry are exactly the
// gates the PARENT ARTIFACT's own coverage.byChild records, whose parent carrier is a file
// the parent pins in executionPins, and whose carrier's own source closure reaches the
// superseded support file. Nine names are never typed here. A gate the parent does not
// record, or one whose carrier does not reach the support file, is not in the returned map
// and coverage() refuses it by the ordinary rule.
function successorGates(bound) {
  const out = new Map(); // gate -> { child, original }
  const byChild = bound && bound.acceptance.coverage && bound.acceptance.coverage.byChild;
  if (!byChild) return out;
  const epins = bound.acceptance.executionPins;
  for (const [gate, child] of Object.entries(byChild)) {
    // The parent's carrier for a child name is the file the parent PINS under that name;
    // the concatenation is only ever admitted because the parent's own pin map agrees.
    const original = 'rebuild/m4/spec/native-carriers-' + child + '.cjs';
    if (!Object.hasOwn(epins, original)) continue;
    let reaches = false;
    for (const src of closure(original).values()) if (src.includes(SUCCESSOR_SUPPORT)) { reaches = true; break; }
    if (!reaches) continue;
    out.set(gate, { child, original });
  }
  return out;
}
// Z3. The ACCEPTED SCHEDULE, read out of the parent wrapper's own `verdicts` table — the
// exact terminal string each parent child prints. The wrapper's bytes are a parent
// execution pin, re-asserted here before a character is parsed, so this is the parent's
// own text and not a re-typing of it. A successor is held to the string its parent was
// held to, in full: "NATIVE SOURCE CARRIERS: 6/6 PASS;", not "NATIVE SOURCE CARRIERS:".
function acceptedVerdicts(bound) {
  const pin = bound.acceptance.executionPins[SUCCESSOR_WRAPPER];
  assert(pin, 'SUCCESSOR-WRAPPER-NOT-A-PARENT-EXECUTION-PIN ' + SUCCESSOR_WRAPPER);
  assert.equal(diskSha(SUCCESSOR_WRAPPER), pin, 'SUCCESSOR-WRAPPER-BYTES ' + SUCCESSOR_WRAPPER);
  const src = fs.readFileSync(rel(SUCCESSOR_WRAPPER), 'utf8');
  const block = /^const verdicts=\{$([\s\S]*?)^\};$/m.exec(src);
  assert(block, 'SUCCESSOR-ACCEPTED-SCHEDULE-UNREADABLE ' + SUCCESSOR_WRAPPER);
  const map = new Map();
  for (const line of block[1].split('\n')) {
    if (!line.trim()) continue;
    const m = /^\s*'?([a-z0-9][a-z0-9-]*)'?\s*:\s*'((?:[^'\\]|\\.)*)',?\s*$/.exec(line);
    assert(m, 'SUCCESSOR-ACCEPTED-SCHEDULE-UNREADABLE line ' + JSON.stringify(line));
    map.set(m[1], m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
  }
  assert(map.size >= 10, 'SUCCESSOR-ACCEPTED-SCHEDULE-UNREADABLE ' + map.size + ' verdict(s)');
  return map;
}
// Z2, the substitution table as the successor itself states it: ONE strict-JSON array
// literal named SUCCESSOR_TABLE, extracted from the closure by bracket matching and parsed
// without executing anything. Its presence is what lets the runner assert that the ONLY
// replacements the successor performs are the ones the spec enumerates.
function successorTable(sources) {
  let found = null, holder = null;
  for (const [file, src] of sources) {
    const at = src.indexOf('const ' + SUCCESSOR_TABLE + ' = [');
    if (at < 0) continue;
    assert(found === null, 'SUCCESSOR-SUBSTITUTION-TABLE-DECLARED-TWICE ' + file);
    const start = src.indexOf('[', at);
    let depth = 0, end = -1;
    for (let i = start; i < src.length; i++) {
      if (src[i] === '[') depth++;
      else if (src[i] === ']' && --depth === 0) { end = i + 1; break; }
    }
    assert(end > start, 'SUCCESSOR-SUBSTITUTION-TABLE-UNREADABLE ' + file);
    found = JSON.parse(src.slice(start, end)); holder = file;
  }
  assert(found !== null, 'SUCCESSOR-SUBSTITUTION-TABLE-MISSING; the successor must state its replacements as one JSON ' + SUCCESSOR_TABLE + ' literal');
  return { table: found, holder };
}
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
// r6 change 4. THE RULING'S OWN BYTES, read from Git on the chain branch — the one text a
// spec cannot write. The coordinate is the runner's constant, and the line standing there
// must carry the ruling id the runner also fixes, or it is not the ruling and nothing below
// may lean on it. Read once per run, and only on the successor path.
let RULING_TEXT = null;
function rulingText() {
  if (RULING_TEXT === null) {
    const n = Number(SUCCESSOR_RULING.split(':')[1]);
    assert(Number.isInteger(n) && n > 0, 'SUCCESSOR-RULING-COORDINATE-SHAPE ' + SUCCESSOR_RULING);
    const line = L.object(root, CHAIN_REF, 'rebuild/DECISIONS.md').toString('utf8').split(/\r?\n/)[n - 1] || '';
    assert(line.includes(SUCCESSOR_RULING_ID),
      'SUCCESSOR-RULING-COORDINATE-IS-NOT-THE-RULING ' + SUCCESSOR_RULING + ' on the chain branch does not carry ' + SUCCESSOR_RULING_ID);
    RULING_TEXT = line;
  }
  return RULING_TEXT;
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
    claim(s.brief.acceptedLedgerLine, 'cowork', 'brief acceptance');
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
  assert(Array.isArray(s.dIds) && new Set(s.dIds).size === s.dIds.length &&
    s.dIds.every(d => /^D([1-9]|[1-3][0-9]|4[0-5])$/.test(d)) &&
    !s.dIds.some(d => CARRIED.includes(d)), 'D-id inventory: unique, in range, never a already-repaired id');
  // The empty-inventory half carries its OWN name so the refusal prints a code (Z6/F5): a
  // skeleton filed for a package the runner admits but that registers no D-id and is not in
  // NO_REGISTER_IDS refuses HERE, by name, instead of as a bare sentence. DECISIONS:124's
  // M2-H3-CLEAN-INIT is exactly that case until its own author fills the inventory in.
  assert(s.dIds.length || NO_REGISTER_IDS.has(ID),
    'REGISTER-D-ID-INVENTORY-EMPTY-AND-NOT-EXEMPT ' + ID + '; a repair package registers at least one D-id, and only the ids fixed in NO_REGISTER_IDS are exempt');
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
  // Z7 / r5 F9. The runner was pinned on disk AND in Git; the SPEC that pins it was pinned
  // on disk only, so an uncommitted spec edit ran clean while an uncommitted runner edit
  // refused. The spec is evidence in exactly the same sense — it is what the artifact will
  // carry the sha256 of — so it is held to the same two places. This is the check that
  // makes r5's E10 (an uncommitted `notes` append) refuse instead of quietly passing.
  assert.equal(gitSha('HEAD', TOOLING + '/packages/' + ID + '.json'), sha(specRaw), 'SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT');
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
  keys(s.coverage, ['inherited', 'moves', 'successors'], 'Coverage block');
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
  // Z1, the DECLARATION half. Nothing here admits a successor — successorCoverage() does
  // that, against the parent's own bytes — but a spec that declares the block at all must
  // be one the ruling names and must cite the ruling id. Everything else refuses HERE,
  // before any child runs, and X1's `moves === {}` above is untouched for every package
  // including this one: DECISIONS:113 (1) (a) is explicit that coverage.moves stays {}.
  if (s.coverage.successors !== null) {
    assert(s.coverage.successors && typeof s.coverage.successors === 'object' && !Array.isArray(s.coverage.successors), 'SUCCESSOR-BLOCK-UNDECLARED');
    keys(s.coverage.successors, ['ruling', 'parentAcceptanceCommit', 'carriers', 'substitutions'], 'Successor block');
    const sup = s.coverage.successors;
    assert(SUCCESSOR_PACKAGES.has(ID), 'SUCCESSOR-PACKAGE-NOT-RULED ' + ID + '; ' + SUCCESSOR_RULING + ' names ' + [...SUCCESSOR_PACKAGES].join(' ') + ' only');
    assert(typeof sup.ruling === 'string' && sup.ruling.includes('MOVES_RULING=' + SUCCESSOR_RULING),
      'SUCCESSOR-RULING-NOT-CITED ' + JSON.stringify(sup.ruling) + '; the spec must cite MOVES_RULING=' + SUCCESSOR_RULING);
    assert.equal(sup.parentAcceptanceCommit, SUCCESSOR_PARENT_COMMIT, 'SUCCESSOR-PARENT-ACCEPTANCE-COMMIT');
    assert(sup.carriers && typeof sup.carriers === 'object' && !Array.isArray(sup.carriers) && Object.keys(sup.carriers).length, 'SUCCESSOR-CARRIERS-UNDECLARED');
    for (const [name, c] of Object.entries(sup.carriers)) {
      keys(c, ['successor', 'original'], 'Successor carrier ' + name);
      assert(typeof c.successor === 'string' && typeof c.original === 'string', 'SUCCESSOR-CARRIER-SHAPE ' + name);
      // The successor file must be a file a DECLARED child of this package actually runs.
      assert(s.children.some(ch => childArgv(ch).includes(c.successor)), 'SUCCESSOR-NOT-AN-EXECUTED-CHILD-TARGET ' + name + ' ' + c.successor);
      assert(c.successor !== c.original, 'SUCCESSOR-IS-THE-ORIGINAL ' + name);
    }
    assert(Array.isArray(sup.substitutions), 'SUCCESSOR-SUBSTITUTIONS-UNDECLARED');
    // r6 change 4 (F3). ":113 (c)" permits ONE kind of substitution — "a pin re-target made
    // necessary by a declared superseded-by-child product path" — and then ratifies two
    // further ones by describing them in the ruling text itself ("two at 71fb2f1: the
    // witnesses exposed-surface deepEqual and the cases mutant-detector target"). The runner
    // enforced neither: it required each `from` to stand exactly once in a parent-pinned
    // original (successorProof) and the successor's own table to equal this list, but
    // nothing asked whether a change was a RE-TARGET at all — so a fourth, unratified
    // substitution was admitted and caught only by a human reading the spec. Both halves are
    // decided here, before any child runs. Residual, said out loud: (B) bounds WHICH module
    // and HOW MANY, not the substance of the text; the substance is still the spec's
    // enumeration, the parent's own bytes, and the package review.
    const superseded = Object.entries(s.product).filter(([, p]) => p.role === 'superseded-by-child');
    const ruledOriginals = new Set();
    for (const sub of sup.substitutions) {
      keys(sub, ['original', 'from', 'to', 'why'], 'Successor substitution');
      assert(typeof sub.original === 'string' && typeof sub.from === 'string' && sub.from.length >= 16 &&
        typeof sub.to === 'string' && sub.to.length >= 16 && sub.from !== sub.to &&
        typeof sub.why === 'string' && sub.why.trim().length >= 16, 'SUCCESSOR-SUBSTITUTION-SHAPE ' + JSON.stringify(sub.original));
      // The file a substitution applies to need not be a declared CARRIER's original: a
      // pin re-target most naturally lands in the support module the carriers share. What
      // is required of it is stronger and is checked at run time against the parent's own
      // bytes (successorProof): it must be a file the PARENT pins in executionPins, equal
      // to that pin and to the Git blob at the parent's acceptance commit.
      assert(/^rebuild\/m4\/spec\/[a-z0-9.-]+\.cjs$/.test(sub.original), 'SUCCESSOR-SUBSTITUTION-TARGET-SHAPE ' + sub.original);
      // (A) RE-TARGET. Replacing every superseded-by-child pre-image sha by its own post
      // turns `from` into `to`; or `from` and `to` differ only inside the one region where a
      // superseded-by-child PATH stands. Either way the two sides differ only in a path or a
      // pin THIS SPEC declares superseded, which is exactly what ":113 (c)" permits outright.
      let pinRetarget = sub.from;
      for (const [, p] of superseded) if (p.post) pinRetarget = pinRetarget.split(p.pre).join(p.post);
      const pathRetarget = superseded.some(([file]) => {
        const parts = sub.from.split(file);
        return parts.length === 2 && sub.to.length >= parts[0].length + parts[1].length &&
          sub.to.startsWith(parts[0]) && sub.to.endsWith(parts[1]);
      });
      if (pinRetarget === sub.to || pathRetarget) continue;
      // (B) RULED BY NAME. Not a re-target — so the RULING'S OWN BYTES, on the chain branch
      // and writable by no spec, must name it: the substituted module's own distinguishing
      // name stands in the ruling line, and at least one other word of that line stands in
      // the substitution's own text. The ruling names ONE such change per module it names,
      // so a second non-re-target over the same original refuses as well.
      const ruling = rulingText(), low = ruling.toLowerCase();
      const token = path.posix.basename(sub.original, '.cjs').split('-').pop(), text = (sub.from + '\n' + sub.to).toLowerCase();
      const echoed = (low.match(/[a-z][a-z0-9]{5,}/g) || []).filter(w => w !== token && text.includes(w));
      assert(token.length >= 4 && low.includes(token) && echoed.length && !ruledOriginals.has(sub.original),
        'SUCCESSOR-SUBSTITUTION-NOT-A-RE-TARGET-AND-NOT-RULED ' + sub.original + '; ' + SUCCESSOR_RULING +
        ' permits a re-target of a declared superseded-by-child path or pin, and otherwise only the substitutions its own text names, once each');
      ruledOriginals.add(sub.original);
    }
  }
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
  say('SPEC OBSERVED packages/' + ID + '.json ' + sha(specRaw) + '; runner ' + s.tooling.runnerSha256 + ' byte-identical on disk and in Git at HEAD; status=' + s.status +
    '; ' + s.dIds.length + ' D-ids ' + s.dIds.join('>') + '; ' + Object.keys(s.product).length + ' declared product files; ' +
    s.children.length + ' declared child(ren), argv file-first under ' + CHILD_ROOTS.length + ' fixed root(s) with only ' +
    [...ARGV_ALLOWED].join(' ') + ' permitted; ' + Object.keys(s.coverage.moves).length +
    ' declared move(s), each naming its own original executable in a relative require specifier' +
    (MOVES_RULING === null ? ' (moves are refused outright under this runner — TOOLING-REVIEW-r3 X1)' : '') +
    // B-NTC-REVIEW-r2 R5: the old sentence stopped at "0 declared move(s) … refused
    // outright", which was true of the key and false of the package while successor
    // executables carried the parent's gates. It now says which it is, on every run.
    '; ' + (s.coverage.successors === null ? 'no successor carriers declared (every inherited gate must be carried by a parent-pinned executable)'
      : Object.keys(s.coverage.successors.carriers).length + ' successor carrier(s) declared under ' + s.coverage.successors.ruling +
        ' with ' + s.coverage.successors.substitutions.length + ' enumerated substitution(s), each proved against the parent original in coverage()'));
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
  // receiptBase is the base every ledger obligation is resolved at. Unpinned, a spec could
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
    // Z11 / r5 F11. Y2's single-parent scan — the sibling specs on disk and in Git, and the
    // already-sealed artifacts on the chain branch — sits BELOW this return, so on an
    // UNDECIDED branch it does not run at all. r5's E18 (a rival sibling claiming B1's
    // parent) passes clean for exactly that reason. The scan is not hoisted here, because a
    // provisional head is not a claim on the chain and refusing a rival claim to a parent
    // the PM has not named would refuse the wrong thing; but the silence is now said out
    // loud on every such run, so no reader takes an UNDECIDED PASS for a single-parent one.
    note('single-parent scan (TOOLING-REVIEW-r4 Y2) did NOT run: it is reached only once the PM has named the parent, so a rival sibling claim or an already-sealed rival artifact would not be reported on this run');
    if (sealed.length !== 1) { note('no single sealed chain head on disk; parent pins, product inventory and inherited coverage are unverifiable'); return null; }
    say('PARENT PROVISIONAL ' + sealed[0].option.id + '; the one sealed chain head on disk carries the pins re-asserted below — it is NOT a claim on the chain; the Y2 single-parent scan did not run (see OPEN)');
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
    // r6 change 5 (F4). The post-first order below makes `pre === post` a FULLY SATISFIED
    // product claim, and for two of the four roles the word does not fit: a file the parent
    // pins and this package declares `edited`, or a parent EXECUTION pin it declares
    // `superseded-by-child`, is by its own role a file this package CHANGES. Declared with
    // pre === post and left untouched on disk it would now read PRODUCT IMPLEMENTED without
    // this package having produced a byte. Those two roles must therefore state a post that
    // differs from the pre. The case the reorder exists for is untouched: role `carried` is
    // pre === post BY DEFINITION (spec() requires it), and role `new` — a file this package
    // declares, does not change, and the parent does not pin — still counts at its post.
    assert(pin.pre !== pin.post || pin.role === 'carried' || pin.role === 'new',
      'PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE ' + file + ' is declared "' + pin.role +
      '" with pre === post; a file this package edits or supersedes must reach a post-image its parent does not already stand at');
    if (pin.role === 'new' && pin.post === null && !fs.existsSync(rel(file))) { at.pre.push(file); continue; }
    const disk = diskSha(file);
    // The POST-image is asked first, and the order is the whole of the change (fix r5
    // follow-up, from lane B's own §4.2 objection). A file this package declares and PINS
    // but does not CHANGE carries pre === post — it is complete at those bytes, and it was
    // being counted as "still at the pinned pre-image" for ever, so PRODUCT could never
    // leave PARTIAL and the `OPEN product PARTIAL` obligation blocked --ci permanently.
    // B-NTC has seven such files. Nothing is weakened: a file genuinely at a pre-image with
    // a DIFFERENT declared post still reports `pre`, a `carried` file is still held to
    // pin.pre exactly, and a file at neither image is still UNLISTED-PRODUCT-DRIFT. This is
    // a reporting order, not a refusal; no assertion is added, removed or relaxed.
    if (pin.role === 'carried') { assert.equal(disk, pin.pre, 'UNLISTED-PRODUCT-DRIFT ' + file); at.carried.push(file); }
    else if (pin.post && disk === pin.post) at.post.push(file);
    else if (disk === pin.pre) at.pre.push(file);
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
// N4/N5. The theme and the brief acceptance are held to the SAME standard as owner and
// contract: L.verifyReceipt reads rebuild/DECISIONS.md out of Git at the parent's receipt
// base and requires the exact line bytes under the right role. A line that exists only in
// the spec refuses; a line that is absent leaves its obligation OPEN. Neither can be
// cleared by declaration, and neither is verifiable at all without a sealed parent to
// anchor it — so a claim made without one refuses rather than counting.
function ledger(at, v, mentions) {
  L.verifyReceipt(root, at, { commit: at, path: 'rebuild/DECISIONS.md', line: v.line, lineSha256: v.lineSha256 }, { role: v.role, mentions });
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
  // TWO ANCHORS, because there are two kinds of line here, and conflating them was a defect
  // in EVERY child package (fix r5 follow-up; lane B raised it against itself).
  //
  // OWNER and CONTRACT are PARENT-ERA lines. The contract is additionally asserted
  // byte-equal to the parent artifact's own contract line, one assert below. They belong at
  // the parent's receipt base and stay there.
  //
  // THE THEME and THE BRIEF ACCEPTANCE are THIS PACKAGE'S OWN lines. They are written after
  // the parent was sealed — necessarily, since they accept work the parent had not seen. At
  // the parent's receipt base they can never be found, so `brief.acceptedLedgerLine` could
  // never be set on any child package before its own seal, and the obligation it clears
  // could never be cleared. That is what this fixes, and it fixes nothing else.
  //
  // The anchor for those two is CHAIN_REF — the real chain branch, resolved from Git refs
  // and nameable by no spec (X2). NOT `HEAD`: a lane can write any line it likes into its
  // own branch's DECISIONS.md, and clearing an obligation by self-declaration is exactly
  // what N4 exists to prevent. The chain branch is the PM's, so a line found there is the
  // PM's. envelope() re-resolves ALL FOUR at the package's OWN receipt base at the seal,
  // where it always did, and asserts that base is an ancestor of CHAIN_REF — so the seal is
  // no weaker, and this path is no stronger than the seal.
  const at = bound.receiptBase, own = CHAIN_REF;
  ledger(at, s.authorizations.owner, ['M2-RULE']);
  ledger(at, s.authorizations.contract, ['POSTFIX-GATE BRIEF']);
  assert.equal(s.authorizations.contract.lineSha256, bound.acceptance.authorizations.contract.lineSha256, 'INHERITED-CONTRACT-AUTHORIZATION');
  if (!theme) themeOpen(); else ledger(own, theme, [s.packageId]);
  if (!accepted) briefOpen(); else ledger(own, accepted, [s.packageId, s.brief.file]);
  say('AUTHORITY OBSERVED owner DECISIONS:' + s.authorizations.owner.ledgerLine + ' and contract DECISIONS:' + s.authorizations.contract.ledgerLine +
    ' present as exact ledger line bytes at the parent receipt base ' + at.slice(0, 7) + ' under their own roles; contract inherited byte-equal from the parent; theme ' +
    (theme ? 'DECISIONS:' + theme.ledgerLine + ' found in Git on ' + CHAIN_REF : 'NULL — no PASS word is available') + '; brief acceptance ' +
    (accepted ? 'DECISIONS:' + accepted.ledgerLine + ' found in Git on ' + CHAIN_REF : 'NULL — the obligation stays open') +
    '; this package\'s own two lines are resolved on the chain branch, not at its parent\'s receipt base — they are written after the parent was sealed and could never be found there');
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
// ------------------------------------------------ 5b. the successor proof (DECISIONS:113)
// Z2, and it is the whole point of the pass. The runner must be able to tell a FAITHFUL
// successor from one that quietly drops an assertion — r5's F3 was that it could only tell
// "these bytes" from "other bytes", and the bytes it trusted were authored elsewhere. So
// nothing here is an identity check over a declared sha. Every assertion below is a
// RELATION between the successor's source and the parent's original:
//
//   1. the parent's original is the parent's own byte, twice over — equal to the parent
//      artifact's executionPins entry AND to the Git blob at the parent's acceptance
//      commit, which is itself asserted to be on the real chain branch (Z5);
//   2. the successor NAMES that original and does not CONTAIN it: the original's own long
//      lines must not appear anywhere in the successor's source closure, so a successor
//      that copies the body instead of loading it refuses;
//   3. the successor's replacements are exactly the ones the spec enumerates verbatim —
//      the successor states them as one JSON table, the runner deep-equals that table
//      against the spec's list, requires every `from` to stand exactly once in the
//      original, and requires every replace() call site in the closure to be driven by the
//      table. A retarget turned into assert.ok(true) is a table entry the spec does not
//      carry, and it refuses;
//   4. the successor is held to the PARENT's own accepted verdict string in full (Z3).
//
// None of that proves the successor's runtime behaviour. What it proves is that the body
// compiled is the parent's body, that the differences are exactly the enumerated ones, and
// that a reviewer reading four strings in the spec is reading all of them.
// Every DECLARED successor carrier is proved here, once per run, whether or not it carries
// an inherited gate — a package that declares a successor over a parent original and then
// claims nothing with it is still running the parent's code against its own bytes, and the
// same four proofs apply. successorCoverage() then admits a GATE by looking the proof up.
function successorProof(s, bound, ran) {
  const proofs = new Map();
  const sup = s.coverage.successors;
  if (sup === null || !bound) return proofs;
  assert(SUCCESSOR_PACKAGES.has(ID), 'SUCCESSOR-PACKAGE-NOT-RULED ' + ID);
  // Z5, once for the run: the parent's acceptance commit is on the real chain branch,
  // resolved from Git refs, and behind HEAD. Nothing below reads a blob before this holds.
  L.git(root, ['merge-base', '--is-ancestor', SUCCESSOR_PARENT_COMMIT, CHAIN_REF]);
  L.git(root, ['merge-base', '--is-ancestor', SUCCESSOR_PARENT_COMMIT, 'HEAD']);
  // Z2 (c), the substitution list as a whole, BEFORE any carrier is considered. Every file
  // a substitution touches is a parent EXECUTION PIN, byte-equal to that pin and to the Git
  // blob at the parent's acceptance commit; every `from` stands exactly once in it; every
  // `to` stands in it not at all. A substitution over a file the parent does not pin, or
  // one whose `from` is not there, or one that is already applied, all refuse here.
  for (const sub of sup.substitutions) {
    const pin = bound.acceptance.executionPins[sub.original];
    assert(pin, 'SUCCESSOR-SUBSTITUTION-TARGET-NOT-A-PARENT-EXECUTION-PIN ' + sub.original);
    const bytes = fs.readFileSync(rel(sub.original));
    assert.equal(sha(bytes), pin, 'SUCCESSOR-ORIGINAL-NOT-THE-PARENT-EXECUTION-PIN ' + sub.original);
    assert.equal(sha(bytes), gitSha(SUCCESSOR_PARENT_COMMIT, sub.original), 'SUCCESSOR-ORIGINAL-NOT-THE-PARENT-ACCEPTANCE-BLOB ' + sub.original);
    const text = bytes.toString('utf8');
    assert.equal(text.split(sub.from).length, 2, 'SUCCESSOR-SUBSTITUTION-NOT-EXACTLY-ONCE-IN-THE-ORIGINAL ' + sub.original + ' ' + JSON.stringify(sub.from.slice(0, 48)));
    assert.equal(text.split(sub.to).length, 1, 'SUCCESSOR-SUBSTITUTION-ALREADY-IN-THE-ORIGINAL ' + sub.original + ' ' + JSON.stringify(sub.to.slice(0, 48)));
  }
  const accepted = acceptedVerdicts(bound);
  for (const [parentChild, declared] of Object.entries(sup.carriers))
    proofs.set(parentChild, proveSuccessor(s, bound, ran, parentChild, declared, accepted));
  return proofs;
}
function proveSuccessor(s, bound, ran, parentChild, declared, accepted) {
  const sup = s.coverage.successors, original = declared.original;
  assert.equal(bound.acceptance.executionPins[original] !== undefined, true, 'SUCCESSOR-ORIGINAL-NOT-A-PARENT-EXECUTION-PIN ' + original);
  // (1) the original is the parent's own byte, on disk, in the parent's pin map, and in Git
  // at the parent's acceptance commit — anchored on the chain by successorProof() above.
  const originalBytes = fs.readFileSync(rel(original));
  assert.equal(sha(originalBytes), bound.acceptance.executionPins[original], 'SUCCESSOR-ORIGINAL-NOT-THE-PARENT-EXECUTION-PIN ' + original);
  assert.equal(sha(originalBytes), gitSha(SUCCESSOR_PARENT_COMMIT, original), 'SUCCESSOR-ORIGINAL-NOT-THE-PARENT-ACCEPTANCE-BLOB ' + original);
  const originalText = originalBytes.toString('utf8');
  // (2) names it, and does not contain it. The closure is the files THIS PACKAGE declares as
  // its own role:"new" product — the lane's code and nothing else. Every file the walk stops
  // at is then named and required to be either the accepted parent's own pin or the immutable
  // conform library, so nothing leaves the closure unaccounted for.
  const parentOwn = new Set([...Object.keys(bound.acceptance.executionPins), ...Object.keys(bound.acceptance.product)]);
  assert(!parentOwn.has(declared.successor), 'SUCCESSOR-IS-A-PARENT-PINNED-FILE ' + declared.successor);
  const own = new Set(Object.entries(s.product).filter(([, p]) => p.role === 'new').map(([f]) => f));
  assert(own.has(declared.successor), 'SUCCESSOR-NOT-DECLARED-AS-THIS-PACKAGE-OWN-PRODUCT ' + declared.successor);
  const sources = closure(declared.successor, f => own.has(f));
  for (const f of sources.boundary)
    assert(parentOwn.has(f) || PIN_PATHS.some(p => f === p || f.startsWith(p + '/')) || f.startsWith('rebuild/conform/v4/postfix/'),
      'SUCCESSOR-CLOSURE-LEAVES-THE-PACKAGE ' + parentChild + ' ' + f + '; a successor may only reach its own new product, a parent pin, or the immutable conform library');
  const body = [...sources.values()].join('\n');
  assert(body.includes(original), 'SUCCESSOR-DOES-NOT-NAME-THE-ORIGINAL ' + parentChild + ' ' + original);
  // r6 change 3 (F2). ":113 (b)" says the original body is compiled "in a private module
  // that never enters require.cache", and nothing tested it: `require.cache` did not occur
  // in this file at all. A require() of the original is precisely how it WOULD enter the
  // cache — the module object is interned under its resolved path, shared with every other
  // requirer in the process, and its own top level runs once and is never compiled again —
  // so the clause is enforced by refusing a relative require/import of the original anywhere
  // in the successor's own source closure. Decided by READING the bytes, the way
  // requiresOriginal() decides it for a moved gate's carrier: never by a declaration.
  for (const f of sources.keys())
    assert(!requiresOriginal(f, original), 'SUCCESSOR-REQUIRES-THE-ORIGINAL-INSTEAD-OF-COMPILING-IT ' + parentChild + ' ' + f +
      '; ' + SUCCESSOR_RULING + ' (b) requires the parent body to be compiled in a private module that never enters require.cache');
  // Lines the substitution list touches are excluded from the copy test, because the table
  // is REQUIRED to carry them verbatim — that is condition (c) itself. Every OTHER long
  // line of the original must be absent from the successor's own source.
  const subs = sup.substitutions.filter(x => x.original === original);
  const quoted = sup.substitutions.flatMap(x => [x.from, x.to]);
  const lines = originalText.split('\n').map(l => l.trim())
    .filter(l => l.length >= 40 && !quoted.some(q => q.includes(l) || l.includes(q)));
  assert(lines.length >= 8, 'SUCCESSOR-ORIGINAL-TOO-SHORT-TO-PROVE-A-LOAD ' + original);
  const copied = lines.filter(l => body.includes(l));
  assert(!copied.length, 'SUCCESSOR-COPIES-THE-ORIGINAL-INSTEAD-OF-LOADING-IT ' + parentChild + '; ' +
    copied.length + ' of ' + lines.length + ' original line(s) stand verbatim in the successor source');
  // (3) the replacements are exactly the enumerated ones, and nothing else replaces.
  const { table, holder } = successorTable(sources);
  assert.deepEqual(table, sup.substitutions, 'SUCCESSOR-SUBSTITUTION-TABLE-DISAGREES-WITH-THE-SPEC ' + holder);
  for (const [file, src] of sources)
    for (const m of src.matchAll(/\.replace(?:All)?\s*\(/g)) {
      const line = src.slice(src.lastIndexOf('\n', m.index) + 1, src.indexOf('\n', m.index) + 1 || undefined);
      assert(line.includes(SUCCESSOR_TABLE) || /\bsub(?:stitution)?\b/.test(line),
        'SUCCESSOR-REPLACEMENT-NOT-DRIVEN-BY-THE-DECLARED-TABLE ' + file + ' ' + JSON.stringify(line.trim().slice(0, 72)));
    }
  // (4) the parent's own accepted verdict, in full (Z3), on the child that runs it.
  const want = accepted.get(parentChild);
  assert(want, 'SUCCESSOR-ACCEPTED-VERDICT-UNKNOWN ' + parentChild);
  const runners = s.children.filter(c => childArgv(c).includes(declared.successor));
  assert.equal(runners.length, 1, 'SUCCESSOR-NOT-AN-EXECUTED-CHILD-TARGET ' + parentChild + ' ' + declared.successor);
  assert.equal(runners[0].needle, want, 'SUCCESSOR-EXECUTED-VERDICT ' + parentChild +
    '; the successor is held to the parent\'s own accepted terminal string, not a prefix of it');
  assert(ran.get(runners[0].name) && ran.get(runners[0].name).ok, 'SUCCESSOR-CHILD-NOT-EXECUTED ' + parentChild + ' ' + runners[0].name);
  return { parentChild, original, successor: declared.successor, child: runners[0].name, substitutions: subs.length, verdict: want };
}
// The per-GATE admission. The ordinary rule is unchanged for every package that does not
// carry the ruling, and the ruled gate set is derived from the parent artifact's bytes.
function successorCoverage(s, bound, proofs, gate, child, targets) {
  assert(s.coverage.successors !== null, 'INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE ' + gate + ' ' + child + ' ' + targets[0]);
  assert(SUCCESSOR_PACKAGES.has(ID), 'SUCCESSOR-PACKAGE-NOT-RULED ' + ID);
  const admitted = successorGates(bound);
  assert(admitted.has(gate), 'SUCCESSOR-GATE-NOT-IN-THE-RULING ' + gate +
    '; the parent artifact records ' + admitted.size + ' gate(s) whose carrier reaches ' + SUCCESSOR_SUPPORT);
  const { child: parentChild, original } = admitted.get(gate);
  const proof = proofs.get(parentChild);
  assert(proof, 'SUCCESSOR-CARRIER-NOT-DECLARED ' + gate + ' ' + parentChild);
  assert.equal(proof.original, original, 'SUCCESSOR-ORIGINAL-IS-NOT-THE-PARENT-CARRIER ' + parentChild);
  assert.equal(proof.child, child, 'SUCCESSOR-CHILD-DOES-NOT-EXECUTE-THE-DECLARED-SUCCESSOR ' + gate + ' ' + child);
  assert(targets.includes(proof.successor), 'SUCCESSOR-CHILD-DOES-NOT-EXECUTE-THE-DECLARED-SUCCESSOR ' + gate + ' ' + proof.successor);
  return proof;
}
// W2. A gate is covered ONLY by a declared child that executed here with its exact
// declared verdict — never by a file's existence. The inherited set must be exactly the
// parent artifact's own covered set; a move is carried by this package's own successor.
function coverage(s, bound, ran) {
  const covered = new Map([...Object.entries(s.coverage.inherited), ...Object.entries(s.coverage.moves).map(([g, m]) => [g, m.child])]);
  const carried = new Map(); // gate -> the successor proof, for the gates DECISIONS:113 admits
  for (const [gate, child] of covered) assert(ran.get(child) && ran.get(child).ok, 'COVERAGE-CHILD-NOT-EXECUTED ' + gate + ' ' + child);
  // Every declared successor is proved before any gate is admitted by one, so a carrier
  // that claims no gate is held to exactly the same four proofs as one that does.
  const proofs = successorProof(s, bound, ran);
  const byChild = bound && bound.acceptance.coverage && bound.acceptance.coverage.byChild;
  if (!byChild) { if (covered.size) note('inherited coverage unverified against a parent artifact until the PM names the parent'); }
  else {
    // N1. The WHOLE inherited map, gate AND child, is the parent artifact's own — not just
    // its gate ids. Re-pointing the parent's nine at one child of this spec's choosing is
    // what B30 did; that is what this equality refuses.
    assert.deepEqual(s.coverage.inherited, byChild, 'INHERITED-COVERAGE-IS-NOT-THE-PARENT-COVERED-SET');
    for (const [gate, child] of Object.entries(s.coverage.inherited)) {
      const targets = ran.get(child).targets;
      // The ordinary case: the child ran the parent's own pinned executable. Unchanged.
      if (targets.some(f => Object.hasOwn(bound.acceptance.executionPins, f) || Object.hasOwn(bound.acceptance.product, f))) continue;
      // The ONLY other way in, and it is DECISIONS:113's: a successor proved against the
      // parent's own original. Without the ruling cited this throws the same code it
      // always threw, so X1's world is exactly as it was for every other package.
      carried.set(gate, successorCoverage(s, bound, proofs, gate, child, targets));
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
  // Z1/Z2, the honesty half, and it is the sentence r2's R5 said was missing: the runner
  // must not report "0 declared move(s) … refused outright" while successor executables
  // carry the parent's gates. Every successor-carried gate is named here with its parent
  // original, and the ruling id is printed once with the count it admitted.
  if (proofs.size) {
    const sup = s.coverage.successors;
    say('SUCCESSORS ' + proofs.size + ' declared successor executable(s) PROVED against the parent original, of which ' + carried.size +
      ' carry an inherited gate under MOVES_RULING=' + SUCCESSOR_RULING + ' (' + sup.ruling + '); coverage.moves stays {} and X1 is unwidened; each successor LOADS the parent carrier\'s own original, byte-equal to the parent execution pin AND to the Git blob at ' +
      SUCCESSOR_PARENT_COMMIT.slice(0, 7) + ' (on ' + CHAIN_REF + ' and behind HEAD), contains none of its lines, replaces only through the declared table, and prints the parent\'s own accepted verdict in full; ' +
      sup.substitutions.length + ' enumerated substitution(s)');
    for (const p of proofs.values())
      say('SUCCESSOR ' + p.parentChild + ' <- ' + p.successor + ' loads ' + p.original + '; child ' + p.child + '; ' +
        p.substitutions + ' substitution(s); verdict ' + JSON.stringify(p.verdict) +
        (carried.size && [...carried.values()].includes(p) ? '; carries ' + [...carried.entries()].filter(([, v]) => v === p).map(([g]) => g).join(' ') : '; carries no inherited gate'));
    for (const sub of sup.substitutions)
      say('SUCCESSOR SUBSTITUTION ' + sub.original + '; ' + JSON.stringify(sub.from) + ' -> ' + JSON.stringify(sub.to) + '; ' + sub.why);
  }
  for (const [gate, child] of covered) {
    const move = s.coverage.moves[gate], succ = carried.get(gate);
    say('COVERAGE ' + gate + ' <- child ' + child + ' executed in this run; exit 0 and exact declared verdict' +
      (move ? '; MOVED, declared against ' + GATE_FILE.get(gate) + ' and observed emitting that gate’s own needle — ' + move.reason
        : succ ? '; inherited from ' + bound.option.id + ' and CARRIED BY A SUCCESSOR ' + succ.successor + ' that loads ' + succ.original +
          ' (' + succ.substitutions + ' declared substitution(s); verdict ' + JSON.stringify(succ.verdict) + ')'
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
    // The successor block travels INTO the sealed artifact, like the parent's review pin
    // (X2): a later reader of the artifact can see which gates were carried by a successor,
    // under which ruling id, and what the enumerated substitutions were, without trusting
    // the spec that produced it. It is null for every package that declares none.
    coverage: { covered, run: GATE_IDS.filter(g => !covered.includes(g)).sort(), moves: s.coverage.moves,
      successors: s.coverage.successors,
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
  // Z6. The ONE token printed here is the leading word of the refusing assertion's own
  // name, and only when that word is already a name in this file (FAIL_CODES). Anything
  // else — an unnamed assertion, a runtime error, a message an input could shape — prints
  // the unchanged sentence and nothing more. Exit codes are unchanged in both branches.
  const code = blocked ? null : failCode(error && error.message);
  console.error(blocked ? 'B PACKAGE ' + ID + ' BLOCKED ' + error.code
    : 'B PACKAGE ' + ID + ' FAIL' + (code ? ' ' + code : '') + '; required evidence missing or failed; local diagnostics withheld');
  process.exitCode = blocked ? 2 : 1;
}
