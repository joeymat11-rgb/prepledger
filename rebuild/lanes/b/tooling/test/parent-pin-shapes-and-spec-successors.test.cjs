'use strict';
// LANE B — r7b. Two defects the H3 builder found, each measured both ways.
//
//   F-E  The chain carries TWO artifact shapes. The accepted originals write `product` as a
//        flat file -> sha256 map; this runner's proposed() writes file -> {pre, post, role}.
//        `held()` and product()'s pre-image check knew only the flat one, so the FIRST child
//        of a package sealed by this runner refused `PARENT-PIN-BROKEN-AT-SOURCEBASE` on a
//        file whose bytes are identical everywhere. The READERS are fixed; no sealed artifact
//        is rewritten — `acceptance-b-ntc-native-trend-context.json` is merged and receipted.
//   F-C  `SUCCESSOR_PACKAGES`, `SUCCESSOR_PARENT_COMMIT` and `SUCCESSOR_WRAPPER` were
//        constants naming B-NTC-as-child-of-NATIVE-CARRIERS, so `DECISIONS:142`'s grant to
//        M2-H3-CLEAN-INIT could not be declared at all. The machinery is spec-driven now and
//        the RULING'S OWN BYTES on the chain branch decide what a spec may claim.
//
// Method is the house one: compile the REAL runner, changing only its filesystem root by its
// module location and (for the ruling cases) one constant, asserted below to be the only line
// that differs. No ref, object or commit of the real repository is read.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const cp = require('node:child_process');
const Module = require('node:module');
const crypto = require('node:crypto');

const sourceRoot = path.resolve(__dirname, '../../../../..');
const runnerRel = 'rebuild/lanes/b/tooling/b-package.cjs';
const source = fs.readFileSync(path.join(sourceRoot, runnerRel), 'utf8');
const delimiter = '// ------------------------------------------------------------------ 8. main sequence';
assert.equal(source.split(delimiter).length, 2, 'one real campaign boundary');
const sha = buf => crypto.createHash('sha256').update(buf).digest('hex');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-r7b-'));
function write(file, text) {
  const target = path.join(scratch, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
  return text;
}
const git = (...argv) => cp.execFileSync('git', argv, { cwd: scratch, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
for (const original of ['rebuild/conform/v4/postfix/run.cjs', 'rebuild/conform/v4/postfix/target.cjs',
  'rebuild/conform/v4/postfix/legacy-gates.cjs', 'rebuild/conform/v4/postfix/strict-json.cjs',
  'rebuild/m4/spec/native-carriers-errors.cjs', 'rebuild/m4/spec/load-write-reference.cjs'])
  write(original, fs.readFileSync(path.join(sourceRoot, original)));

// --------------------------------------------------------------- the fixture repository
// The ruling the fixture's own chain branch carries, in `DECISIONS:142`'s shape: it names
// the package, grants a SUCCESSOR, stands on the base ruling's conditions, and names the
// support file whose supersession makes the successor necessary.
const PACKAGE_ID = 'M2-H3-CLEAN-INIT';
const SUPPORT = 'rebuild/m3/w6/host/test/journey.test.mjs';
const RULING_LINE = '- 2026-09-12 · cowork · H3 RULINGS — F-C GRANTED in the :113 shape: ' + PACKAGE_ID +
  ' may declare a SUCCESSOR for the parent gate whose carrier pins ' + SUPPORT +
  ' (its assertion is the defect), under conditions (a)-(e) of B-NTC-INHERITED-1 with the substitution enumerated · RULED';
const OTHER_LINE = '- 2026-09-12 · cowork · a chain line that grants nothing at all, and is long enough to be a ruling · RULED';
const FOREIGN_LINE = '- 2026-09-12 · cowork · M2-SOMEONE-ELSE may declare a SUCCESSOR under conditions (a)-(e) of B-NTC-INHERITED-1' +
  ' for the carrier that pins ' + SUPPORT + ' · RULED';
write('rebuild/DECISIONS.md', [OTHER_LINE, RULING_LINE, FOREIGN_LINE, ''].join('\n'));
write('rebuild/engine/plan.cjs', 'module.exports = { plan: true };\n');
write('rebuild/engine/today.cjs', 'module.exports = { today: true };\n');
git('init', '--quiet', '-b', 'fixture-chain');
git('config', 'user.email', 'tooling7@earned.local');
git('config', 'user.name', 'lane-b-tooling7');
git('add', '-A'); git('commit', '--quiet', '-m', 'the chain');
const SOURCE_BASE = git('rev-parse', 'HEAD').trim();

const fixtureSource = source.replace(
  "const CHAIN_REF = 'refs/remotes/origin/rebuild/t2-client-core';",
  "const CHAIN_REF = 'refs/heads/fixture-chain';");
{
  const a = source.split('\n'), b = fixtureSource.split('\n');
  assert.equal(a.length, b.length, 'the fixture changes no line count');
  const moved = a.map((line, i) => [i, line]).filter(([i, line]) => line !== b[i]);
  assert.equal(moved.length, 1, 'exactly one constant is re-pointed at the fixture');
  assert.match(moved[0][1], /^const CHAIN_REF = '/);
}
write(runnerRel, fixtureSource);
const runnerFile = path.join(scratch, runnerRel);
const m = new Module(runnerFile, module);
m.filename = runnerFile;
m.paths = Module._nodeModulePaths(path.dirname(path.join(sourceRoot, runnerRel)));
const baseRequire = m.require.bind(m);
m.require = file => baseRequire(path.isAbsolute(file) && file.startsWith(scratch + path.sep)
  ? path.join(sourceRoot, path.relative(scratch, file)) : file);
const savedArgv = process.argv;
process.argv = [process.execPath, runnerFile, '--ci', '--package', 'H3'];
try {
  m._compile(fixtureSource.slice(0, fixtureSource.indexOf(delimiter)) +
    '\nmodule.exports={parentPin,pins,product,successorRuling,successorGates,acceptedVerdicts,open,' +
    'init(){logDir=root;specRaw=Buffer.from("{}");}};', runnerFile);
} finally { process.argv = savedArgv; }
const api = m.exports;
api.init();

test.after(() => {
  const resolved = fs.realpathSync(scratch);
  assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
  assert(path.basename(resolved).startsWith('earned-r7b-'));
  fs.rmSync(resolved, { recursive: true, force: true });
});

// ------------------------------------------------------------- F-E. the two pin shapes
const PLAN = 'rebuild/engine/plan.cjs';
const planSha = sha(fs.readFileSync(path.join(scratch, PLAN)));

test('F-E — a parent product entry is read from EITHER shape, and gives the same byte', () => {
  // The flat form every accepted original writes, and the {pre, post, role} form this
  // runner's own proposed() writes. Both name the same pinned byte.
  assert.equal(api.parentPin(planSha, PLAN), planSha);
  assert.equal(api.parentPin({ pre: planSha, post: planSha, role: 'carried' }, PLAN), planSha);
  // The PINNED byte of a changed file is its POST-image — what the parent's seal stands at.
  assert.equal(api.parentPin({ pre: '1'.repeat(64), post: planSha, role: 'edited' }, PLAN), planSha);
  // A `new` file the parent declared but never wrote pins its pre-image, which is all there
  // is; and anything that is neither shape is a NAMED refusal, never a skipped entry.
  assert.equal(api.parentPin({ pre: planSha, post: null, role: 'new' }, PLAN), planSha);
  for (const bad of [null, 42, [], {}, { pre: 'nope', post: null }, 'not-a-sha', { pre: null, post: null, role: 'new' }])
    assert.throws(() => api.parentPin(bad, PLAN), /PARENT-PIN-SHAPE/);
  // r8 change 4. `post || pre` read a FALSY NON-NULL post as absent and fell back to the
  // pre-image — silently answering a question it had not been asked. Only the literal null
  // means "no post-image yet"; 0, "" and false are malformed and say so.
  for (const post of [0, '', false, NaN])
    assert.throws(() => api.parentPin({ pre: planSha, post, role: 'edited' }, PLAN), /PARENT-PIN-SHAPE/,
      'a falsy non-null post is malformed, not a fallback: ' + JSON.stringify(post));
  // …and the one case that IS a fallback is still exactly that one.
  assert.equal(api.parentPin({ pre: planSha, post: null, role: 'new' }, PLAN), planSha);
});

test('F-E — pins() re-asserts a parent sealed in EITHER shape; B-NTC\'s children unblock', () => {
  // The defect, as the H3 builder measured it: a child bound to a parent whose product map
  // is the object form refused PARENT-PIN-BROKEN-AT-SOURCEBASE on the first entry.
  const spec = { product: {}, sourceBase: SOURCE_BASE };
  const grandparent = 'rebuild/m4/spec/acceptance-grandparent.json';
  write(grandparent, JSON.stringify({ product: {}, executionPins: {} }, null, 2) + '\n');
  const boundWith = productMap => ({ option: { id: 'PARENT', artifact: 'rebuild/m4/spec/acceptance-parent.json' },
    reviewedCommit: SOURCE_BASE, decided: true,
    acceptance: { product: productMap, executionPins: {},
      parent: { artifact: grandparent, sha256: sha(fs.readFileSync(path.join(scratch, grandparent))) } } });
  api.open.length = 0;
  api.pins(spec, boundWith({ [PLAN]: planSha }));                                        // the flat form
  api.pins(spec, boundWith({ [PLAN]: { pre: planSha, post: planSha, role: 'carried' } })); // the object form
  assert.deepEqual(api.open, [], 'neither shape leaves an obligation open');
  // Nothing is weakened: a pin that really has moved still refuses, in both shapes.
  assert.throws(() => api.pins(spec, boundWith({ [PLAN]: '0'.repeat(64) })), /PARENT-PIN-BROKEN/);
  assert.throws(() => api.pins(spec, boundWith({ [PLAN]: { pre: '0'.repeat(64), post: '0'.repeat(64), role: 'carried' } })), /PARENT-PIN-BROKEN/);
});

test('F-E — product() takes the child pre-image from EITHER shape, and still refuses drift', () => {
  // The parent pinned TODAY at an older byte and this child has edited it to what stands on
  // disk; PLAN it carries unchanged. Both parent shapes must give the same reading.
  const TODAY = 'rebuild/engine/today.cjs';
  const todaySha = sha(fs.readFileSync(path.join(scratch, TODAY)));
  const parentTodaySha = '3'.repeat(64);
  const child = { product: { [PLAN]: { pre: planSha, post: planSha, role: 'carried' },
    [TODAY]: { pre: parentTodaySha, post: todaySha, role: 'edited' } } };
  const bound = flat => ({ acceptance: { executionPins: {}, product: flat
    ? { [PLAN]: planSha, [TODAY]: parentTodaySha }
    : { [PLAN]: { pre: planSha, post: planSha, role: 'carried' },
        [TODAY]: { pre: '4'.repeat(64), post: parentTodaySha, role: 'edited' } } } });
  assert.equal(api.product(child, bound(true)), 'IMPLEMENTED');
  assert.equal(api.product(child, bound(false)), 'IMPLEMENTED', 'the object form reads the parent POST-image');
  // A child whose pre-image is NOT the parent's pinned byte still refuses, in both shapes.
  const wrong = { product: { [PLAN]: { pre: '0'.repeat(64), post: '0'.repeat(64), role: 'carried' } } };
  for (const flat of [true, false]) assert.throws(() => api.product(wrong, bound(flat)), /pre-image is not the parent pin|UNLISTED-PRODUCT-DRIFT/);
});

// --------------------------------------------- F-C. the successor machinery is spec-driven
const RULING_SHA = sha(Buffer.from(RULING_LINE));
const supBlock = over => ({
  ruling: 'MOVES_RULING=DECISIONS:142 in the B-NTC-INHERITED-1 shape',
  rulingLineSha256: RULING_SHA,
  support: SUPPORT,
  parentAcceptanceCommit: SOURCE_BASE,
  wrapper: null,
  carriers: { 'source-carriers': { successor: 'rebuild/m4/spec/h3-source-carriers.cjs', original: over } },
  substitutions: [],
});
const specWith = sup => ({ packageId: PACKAGE_ID, product: { [SUPPORT]: { pre: '1'.repeat(64), post: '2'.repeat(64), role: 'edited' } },
  coverage: { inherited: {}, moves: {}, successors: sup } });

test('F-C — the RULING\'S OWN BYTES admit the package, not a constant in the runner', () => {
  // What replaced `SUCCESSOR_PACKAGES = new Set(['B-NTC'])`: the line the spec cites by
  // sha256 must stand on the chain branch, name THIS package, grant a SUCCESSOR, and stand
  // on the base ruling's conditions. A spec can forge none of the four.
  const found = api.successorRuling(specWith(supBlock('rebuild/m4/spec/carrier.cjs')));
  assert.equal(found.line, RULING_LINE);
  assert.equal(found.at, 2, 'the line is located by its bytes, and reported where it stands');
});

test('F-C — a wrong ruling sha256 refuses, and so does a line that grants nothing', () => {
  const wrong = specWith({ ...supBlock('rebuild/m4/spec/carrier.cjs'), rulingLineSha256: '0'.repeat(64) });
  assert.throws(() => api.successorRuling(wrong), /SUCCESSOR-RULING-LINE-SHA256-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH/);
  const other = specWith({ ...supBlock('rebuild/m4/spec/carrier.cjs'), rulingLineSha256: sha(Buffer.from(OTHER_LINE)) });
  assert.throws(() => api.successorRuling(other), /SUCCESSOR-RULING-DOES-NOT-NAME-THIS-PACKAGE|SUCCESSOR-RULING-DOES-NOT-GRANT-A-SUCCESSOR/);
  // A real grant that names some OTHER package frees nothing for this one. The package is
  // the one on the COMMAND LINE, not the one the spec writes, so a spec cannot rename
  // itself into somebody else's ruling either.
  const foreign = specWith({ ...supBlock('rebuild/m4/spec/carrier.cjs'), rulingLineSha256: sha(Buffer.from(FOREIGN_LINE)) });
  assert.throws(() => api.successorRuling(foreign), /SUCCESSOR-RULING-DOES-NOT-NAME-THIS-PACKAGE/);
});

test('F-C — the ruling must NAME the support file the successor is necessary for', () => {
  const elsewhere = specWith({ ...supBlock('rebuild/m4/spec/carrier.cjs'), support: 'rebuild/m4/workout/not-in-the-ruling.cjs' });
  elsewhere.product['rebuild/m4/workout/not-in-the-ruling.cjs'] = { pre: '1'.repeat(64), post: '2'.repeat(64), role: 'edited' };
  assert.throws(() => api.successorRuling(elsewhere), /SUCCESSOR-RULING-DOES-NOT-NAME-THE-SUPPORT-FILE/);
  // And the support file must be one THIS package declares a change on: a successor is
  // "made necessary by a declared product path", never by a path the spec merely names.
  const undeclared = specWith(supBlock('rebuild/m4/spec/carrier.cjs'));
  undeclared.product = {};
  assert.throws(() => api.successorRuling(undeclared), /SUCCESSOR-SUPPORT-IS-NOT-A-DECLARED-CHANGE-OF-THIS-PACKAGE/);
});

test('F-C — the admitted gates are the PARENT\'s own byChild, bounded by the ruling', () => {
  // The gate set is DERIVED three ways at once and a spec can widen none of them: the
  // parent artifact's own coverage.byChild, the carriers THIS spec declares, and the
  // parent's own executionPins. A gate the ruling does not reach is simply not in the map,
  // and coverage() then refuses it by the ordinary rule.
  const carrier = 'rebuild/m4/spec/carrier.cjs';
  const unrelated = 'rebuild/m4/spec/unrelated.cjs';
  write(carrier, "const PIN = '" + SUPPORT + "';\nmodule.exports = { PIN };\n");
  write(unrelated, 'module.exports = { nothing: true };\n');
  const bound = { acceptance: { executionPins: { [carrier]: sha(fs.readFileSync(path.join(scratch, carrier))),
    [unrelated]: sha(fs.readFileSync(path.join(scratch, unrelated))) },
    coverage: { byChild: { 'migrate-source': 'source-carriers', 'witnesses-2': 'inherited-carriers' } } } };
  const s = specWith(supBlock(carrier));
  const admitted = api.successorGates(s, bound);
  assert.deepEqual([...admitted.keys()], ['migrate-source'], 'only the gate whose declared carrier reaches the support file');
  assert.equal(admitted.get('migrate-source').original, carrier);
  // A carrier the spec declares that does NOT reach the support file carries no gate.
  const away = specWith(supBlock(unrelated));
  assert.equal(api.successorGates(away, bound).size, 0);
  // A carrier the PARENT does not pin carries no gate either.
  const unpinned = specWith(supBlock('rebuild/m4/spec/never-pinned.cjs'));
  assert.equal(api.successorGates(unpinned, bound).size, 0);
});

test('F-C — the accepted verdict comes from the PARENT ARTIFACT when it has children', () => {
  // A parent sealed by THIS runner carries children:[{name, argv, needle}] in its own bytes,
  // so no wrapper file is involved at all — which is what made the wrapper constant
  // un-generalisable. The older wrapper path stays for a parent that has no children.
  const s = specWith(supBlock('rebuild/m4/spec/carrier.cjs'));
  const bound = { acceptance: { executionPins: {},
    children: [{ name: 'source-carriers', argv: ['x.cjs'], needle: 'NATIVE SOURCE CARRIERS: 6/6 PASS;' }] } };
  assert.equal(api.acceptedVerdicts(s, bound).get('source-carriers'), 'NATIVE SOURCE CARRIERS: 6/6 PASS;');
  // With neither children nor a declared wrapper there is no schedule to hold anyone to,
  // and that refuses by name rather than admitting an unheld successor.
  assert.throws(() => api.acceptedVerdicts(s, { acceptance: { executionPins: {} } }),
    /SUCCESSOR-ACCEPTED-SCHEDULE-UNAVAILABLE/);
});
