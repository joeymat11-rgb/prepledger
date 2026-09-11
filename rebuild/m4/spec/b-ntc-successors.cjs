'use strict';
// LANE B — B-NTC SUCCESSOR CARRIERS. Authored by lane B under DECISIONS:113 (1), which
// ratified MOVES_RULING B-NTC-INHERITED-1 as written in B-NTC-REVIEW-r2.md §E.3.
//
// WHAT THIS IS. DECISIONS:109 PATH A lets this child supersede a parent EXECUTION PIN:
// rebuild/m4/workout/engine-runtime.cjs widens its exposed reader surface by two names, and
// .github/workflows/rebuild.yml is re-enumerated. The accepted parent M2-NATIVE-CARRIERS
// keeps its own pins and therefore refuses the child's bytes — correctly, by design. The
// gates behind those pins are still worth running, against the child's bytes. So each
// successor here LOADS the parent carrier's OWN ORIGINAL BODY and executes it, in a private
// module that never enters require.cache, with every other parent pin held byte-identical.
//
// WHAT THIS IS NOT. It is not an acceptance, a receipt, or a claim on the chain. The
// parent's `accepted` boolean is never inherited: profile.verify() is answered here with
// `accepted:false`, deliberately. No original is copied, none is skipped, and the ONLY text
// substitutions applied to any original body are the three in SUBSTITUTIONS below, which
// packages/B-NTC.json enumerates verbatim and rebuild/lanes/b/tooling/b-package.cjs asserts
// against this file's own table before it admits a single inherited gate.
//
// NO CLI-GUARD REWRITE. A privately compiled module is not process.mainModule, so an
// original whose body stands behind `if (require.main === module)` would not run. The
// candidate this replaces rewrote that guard to `if(true)` — a fourth text substitution,
// and not a pin re-target, so DECISIONS:113 (1) (c) does not permit it. Instead the entry
// module is made the main module for the duration of its own compile and restored in a
// finally: the guard is answered, not edited, and not one byte of any original moves.
const fs = require('node:fs'), path = require('node:path'), Module = require('node:module');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../..');
const L = require('../../conform/v4/postfix/legacy-gates.cjs');
const { sha } = require('../../conform/v4/postfix/target.cjs');
const rel = file => path.join(root, file);

// The accepted parent, by bytes, and the commit its receipt names as reviewed.
const PARENT_ARTIFACT = 'rebuild/m4/spec/acceptance-native-carriers.json';
const PARENT_ARTIFACT_SHA256 = 'e940359b684b90e2e92ae325a86c018f91a7aa27bec7c5466165116657c2201a';
const PARENT_ACCEPTANCE_COMMIT = 'b95ccca879e371b5ba225ad12cae612ec89469ba';
const CHILD_SPEC = 'rebuild/lanes/b/tooling/packages/B-NTC.json';
// The two parent execution pins this child supersedes (DECISIONS:109 PATH A). Every other
// parent pin must be byte-identical on disk, and these two must equal the spec's post-image.
const SUPERSEDED = Object.freeze(['rebuild/m4/workout/engine-runtime.cjs', '.github/workflows/rebuild.yml']);

// Each successor names its parent carrier as a LITERAL path, never as a concatenation, so
// that a reader — and the seal runner's SUCCESSOR-DOES-NOT-NAME-THE-ORIGINAL check — can
// see which accepted file this package proposes to run without evaluating a line of it.
const ORIGINALS = {
  "traces": "rebuild/m4/spec/native-carriers-traces.cjs",
  "direct": "rebuild/m4/spec/native-carriers-direct.cjs",
  "legacy": "rebuild/m4/spec/native-carriers-legacy.cjs",
  "witnesses": "rebuild/m4/spec/native-carriers-witnesses.cjs",
  "cases": "rebuild/m4/spec/native-carriers-cases.cjs",
  "source-carriers": "rebuild/m4/spec/native-carriers-source-carriers.cjs",
  "inherited-carriers": "rebuild/m4/spec/native-carriers-inherited-carriers.cjs",
  "defect-witnesses": "rebuild/m4/spec/native-carriers-defect-witnesses.cjs",
  "writers-differential": "rebuild/m4/spec/native-carriers-writers-differential.cjs",
  "second-gate": "rebuild/m4/spec/native-carriers-second-gate.cjs"
};
// The support modules the carriers share, and the parent's own profile and its tests.
const SUPPORT = "rebuild/m4/spec/native-carriers-source.cjs";
const BRIDGE = "rebuild/m4/spec/native-carriers-parent-source.cjs";
const PROFILE = "rebuild/m4/spec/native-carriers-profile.cjs";
const PROFILE_TESTS = "rebuild/m4/spec/native-carriers-profile.test.cjs";

// DECISIONS:113 (1) (c): "the only text substitution permitted is a pin re-target made
// necessary by a declared superseded-by-child product path, every such substitution
// enumerated verbatim in the package spec and in the review". This IS that list. It is one
// strict-JSON literal on purpose: the seal runner reads it without executing this file and
// deepEquals it against packages/B-NTC.json coverage.successors.substitutions, so a
// retarget weakened here and nowhere else refuses, and a retarget added here refuses too.
// Every replacement this module performs is driven by this table and by nothing else.
//
// Three entries. The PM's parenthetical names two — "the witnesses exposed-surface
// deepEqual and the cases mutant-detector target" — because B-NTC-REVIEW-r2 §E.2 counted
// the substitutions applied to GATE BODIES. The third, the SUPPORT pin re-target, is the
// pin re-target condition (c) is literally about; r2 §E.1 records it separately ("the only
// substitution is one exact string in native-carriers-source.cjs swapping the runtime
// SUPPORT pin for the child's"). Lane B states all three here rather than carry a count.
const SUBSTITUTIONS = [
 {
  "original": "rebuild/m4/spec/native-carriers-source.cjs",
  "from": "'rebuild/m4/workout/engine-runtime.cjs':'9be218975e39d84465f6c337d48b60c5009f268eb68d7b9808871ad867c61b23'",
  "to": "'rebuild/m4/workout/engine-runtime.cjs':'c03732e896a9596a06edd304bb8f23f2340c29b5e036043a4205f225916be936'",
  "why": "the SUPPORT pin re-target DECISIONS:113 (1) (c) is about: engine-runtime.cjs is declared superseded-by-child, so the shared source module must expect the child's byte or every carrier refuses the child tree before running one assertion"
 },
 {
  "original": "rebuild/m4/spec/native-carriers-witnesses.cjs",
  "from": "assert.deepEqual(COMPOSITION.exposed.slice().sort(),['genSession','rirPlan'],'Exposed reader surface');",
  "to": "assert.deepEqual(COMPOSITION.exposed.slice().sort(),['cleanAtDate','dayWeather','genSession','rirPlan'],'Exposed reader surface');",
  "why": "the same exact four-name deepEqual over the surface the child declares; DECISIONS:109 PATH A widens EXPOSED by dayWeather and cleanAtDate, so the parent's two-name expectation is the pin this supersession re-targets and the assertion stays exact, never relaxed"
 },
 {
  "original": "rebuild/m4/spec/native-carriers-cases.cjs",
  "from": "path.join(root,'rebuild/m4/workout/test/native-next-targets.test.cjs')",
  "to": "path.join(root,'rebuild/m4/spec/b-ntc-native-next-targets.test.cjs')",
  "why": "the mutant detector re-targeted onto the child's copy of the focused test, which is the file that reads the widened surface; the detector itself is unchanged and still has to catch every mutant it caught for the parent"
 }
];

// ---------------------------------------------------------------- reading the parent
// The accepted artifact by its immutable sha256. Nothing below is read until this holds.
function parentArtifact() {
  const raw = fs.readFileSync(rel(PARENT_ARTIFACT));
  assert.equal(sha(raw), PARENT_ARTIFACT_SHA256, 'Immutable accepted parent ' + PARENT_ARTIFACT);
  return JSON.parse(raw);
}
// One original body, anchored twice: the parent's own execution pin, and the Git blob at
// the commit the parent's receipt names as reviewed. Two independent anchors, because a
// hand that can move a file on disk can also move a pin that lives beside it.
function originalBody(file, a) {
  const bytes = fs.readFileSync(rel(file));
  assert.equal(sha(bytes), a.executionPins[file], 'Immutable original executable ' + file);
  assert(bytes.equals(L.object(root, PARENT_ACCEPTANCE_COMMIT, file)), 'Original executable at the parent acceptance commit ' + file);
  return bytes.toString('utf8');
}
// The ONLY place any original text is changed, and it changes exactly what SUBSTITUTIONS
// says for exactly the file named. A substitution whose `from` is not there, or is there
// more than once, refuses rather than silently applying to nothing.
function applySubstitutions(file, body) {
  let out = body, applied = 0;
  for (const substitution of SUBSTITUTIONS) {
    if (substitution.original !== file) continue;
    assert.equal(out.split(substitution.from).length, 2, 'One exact enumerated substitution site in ' + file);
    out = out.replace(substitution.from, substitution.to);
    applied++;
  }
  return { body: out, applied };
}
// The child's own declared state: every parent pin byte-identical on disk except the two
// declared superseded paths, each of which must equal the spec's post-image AND must have
// stood at the parent's pin at the acceptance commit. Then every file the spec declares must
// be at its own declared post-image. A forged post in the spec refuses here, not later.
function actualChild(a) {
  const spec = JSON.parse(fs.readFileSync(rel(CHILD_SPEC)));
  for (const [file, hash] of Object.entries({ ...a.product, ...a.executionPins })) {
    const disk = sha(fs.readFileSync(rel(file)));
    if (SUPERSEDED.includes(file)) {
      const pin = spec.product[file];
      assert(pin, 'Declared child supersession ' + file);
      assert.equal(pin.role, 'superseded-by-child', 'Declared supersession role ' + file);
      assert.equal(pin.pre, hash, 'Declared pre-image is the parent pin ' + file);
      assert.equal(sha(L.object(root, PARENT_ACCEPTANCE_COMMIT, file)), hash, 'Parent bytes at the acceptance commit ' + file);
      assert.equal(disk, pin.post, 'Exact actual child supersession ' + file);
    } else assert.equal(disk, hash, 'Unlisted parent pin drift ' + file);
  }
  for (const [file, pin] of Object.entries(spec.product))
    assert.equal(sha(fs.readFileSync(rel(file))), pin.post, 'Exact declared child bytes ' + file);
  return spec;
}

// ---------------------------------------------------------------- private compilation
// A private Module with an injected resolver. Nothing compiled here enters require.cache,
// so no original ever becomes the module some later require() returns. `asMain` answers an
// original's own `require.main === module` guard by making that module the main module for
// the duration of its compile — the guard is answered, never edited (see the header).
function compile(file, source, resolve, asMain = false) {
  const m = new Module(rel(file), module);
  m.filename = rel(file);
  m.paths = Module._nodeModulePaths(path.dirname(m.filename));
  const normal = m.require.bind(m);
  m.require = name => resolve(name, normal);
  const saved = process.mainModule;
  try {
    if (asMain) process.mainModule = m;
    m._compile(source, m.filename);
  } finally { if (asMain) process.mainModule = saved; }
  return m.exports;
}
// The parent's own preflight reads the two superseded paths from their reviewed ORIGIN, so
// that the ARCHIVED parent verifies against the bytes it was accepted over. Only those two
// reads are redirected; every other read is the real filesystem, unpatched and global-free.
function archivedReader(a) {
  return Object.freeze({ ...fs, readFileSync(file, options) {
    const f = typeof file === 'string' ? path.relative(root, path.resolve(file)).split(path.sep).join('/') : '';
    if (!SUPERSEDED.includes(f)) return fs.readFileSync(file, options);
    const bytes = L.object(root, PARENT_ACCEPTANCE_COMMIT, f);
    assert.equal(sha(bytes), a.executionPins[f], 'Archived overlay at the acceptance commit ' + f);
    const encoding = typeof options === 'string' ? options : options && options.encoding;
    return encoding ? bytes.toString(encoding) : bytes;
  } });
}
// The shared SUPPORT module, in one of its two states: ARCHIVED (the parent's own bytes,
// verifying the parent as accepted) or CHILD (the one enumerated pin re-target applied).
function supportModule(a, archived) {
  const body = originalBody(SUPPORT, a);
  const made = archived ? { body, applied: 0 } : applySubstitutions(SUPPORT, body);
  if (!archived) assert.equal(made.applied, 1, 'One enumerated SUPPORT pin re-target');
  return compile(SUPPORT, made.body, (name, normal) => name === 'node:fs' && archived ? archivedReader(a) : normal(name));
}
// Two stages, in this order and never the other: the ARCHIVED parent must verify as
// accepted against its own bytes, and only then does the child's own state get verified.
function preflight() {
  const a = parentArtifact(), spec = actualChild(a);
  const archived = supportModule(a, true);
  const profile = compile(PROFILE, originalBody(PROFILE, a), (name, normal) =>
    name === 'node:fs' ? archivedReader(a) : name === './native-carriers-source.cjs' ? archived : normal(name));
  const parent = profile.verify();
  assert.equal(parent.accepted, true, 'Archived parent independently accepted');
  const support = supportModule(a, false);
  support.verify(root);
  console.log('B-NTC ARCHIVED PARENT VERIFIED; the two superseded execution pins read at ' + PARENT_ACCEPTANCE_COMMIT + '; this is not child acceptance');
  console.log('B-NTC ACTUAL CHILD VERIFIED; the parent source construction and all of its assertions, with the one enumerated SUPPORT pin re-target; candidate code reads disk');
  return { a, spec, support, parent };
}

// ---------------------------------------------------------------- the successors
// One parent carrier, executed against the child's bytes. Everything it requires is either
// a private compilation of the parent's own original or the real module; the parent's
// profile is answered with its own verified result and `accepted:false`, because a child
// never inherits its parent's acceptance (DECISIONS:113 (1) (d)).
function run(name) {
  assert(Object.hasOwn(ORIGINALS, name), 'Closed successor name ' + name);
  const { a, support, parent } = preflight();
  const Reference = require('./native-carriers-reference.cjs');
  const made = Reference.create(root);
  process.env.EARNED_NATIVE_PACKET_ROOT = made.packet;
  const bridge = compile(BRIDGE, originalBody(BRIDGE, a),
    (n, normal) => n === './native-carriers-source.cjs' ? support : normal(n));
  const file = ORIGINALS[name];
  const entry = applySubstitutions(file, originalBody(file, a));
  compile(file, entry.body, (n, normal) =>
    n === './native-carriers-source.cjs' ? support :
    n === './native-carriers-parent-source.cjs' ? bridge :
    n === './native-carriers-profile.cjs' ? Object.freeze({ verify() {
      // An original gate asks its parent profile for the cumulative preflight. It ran
      // above and is re-taken here against the tree as it stands at this moment.
      actualChild(a); support.verify(root);
      return { ...parent, accepted: false, root };
    } }) : normal(n), true);
  Reference.removeImportEngine();
}
// The parent's own thirteen profile refusal controls, run unchanged against the ARCHIVED
// parent. Their temporary edits use the real filesystem; only the two superseded reads
// inside the private validators are answered from the acceptance commit.
function profileRefusals() {
  const { a } = preflight();
  const archived = supportModule(a, true);
  const profile = compile(PROFILE, originalBody(PROFILE, a), (name, normal) =>
    name === 'node:fs' ? archivedReader(a) : name === './native-carriers-source.cjs' ? archived : normal(name));
  compile(PROFILE_TESTS, originalBody(PROFILE_TESTS, a), (name, normal) =>
    name === './native-carriers-profile.cjs' ? profile : name === './native-carriers-source.cjs' ? archived : normal(name));
}
module.exports = { run, preflight, profileRefusals, ORIGINALS, SUBSTITUTIONS, NAMES: Object.freeze(Object.keys(ORIGINALS)) };
