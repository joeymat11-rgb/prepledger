'use strict';
// LANE B — DECISIONS:135 (4) SEAL ON THE TIP and DECISIONS:136 (3) AUTHORIZED STEP =
// BYTE-IDENTITY RE-VERIFY, each measured both ways in a Git repository this test builds.
//
//   :135 (4) "the seal runner refuses to seal unless the branch head is on
//   origin/rebuild/t2-client-core (or the PM has written a FREEZE line naming the base)".
//   :136 (3) "when the sealed artifact's bytes, the runner, the spec and every pinned
//   product file are byte-identical to the sealed run the verdict file reports … the
//   authorized step is a --ci run + pin verification + receipt check and prints POSTFIX
//   PACKAGE PASS on that basis; ANY byte change voids the receipt and forces the FULL run
//   exactly as before; the first FULL run with the private census is unchanged."
//
// Method is the house one: compile the REAL runner with exactly ONE literal changed — the
// chain branch — asserted below to be the only line that differs. No ref, object or commit
// of the real repository is read, and no private input exists in this tree.
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
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-seal-tip-'));
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

const PACKAGE_ID = 'M2-B-NTC-NATIVE-TREND-CONTEXT';
const ARTIFACT = 'rebuild/m4/spec/acceptance-b-ntc-native-trend-context.json';
const VERDICT = 'rebuild/lanes/b/VERDICT-B-NTC.md';
const PRODUCT = 'rebuild/m4/spec/fixture-seal-product.cjs';
write(ARTIFACT, '{"version":1,"lanePackage":"B-NTC"}\n');
write(PRODUCT, 'console.log("the pinned product byte");\n');
write('rebuild/DECISIONS.md', '- 2026-09-12 · cowork · a chain line\n');
write(runnerRel, source); // placeholder; the fixture runner is written below

git('init', '--quiet', '-b', 'fixture-chain');
git('config', 'user.email', 'tooling7@earned.local');
git('config', 'user.name', 'lane-b-tooling7');
git('add', '-A'); git('commit', '--quiet', '-m', 'the chain base');
const BASE = git('rev-parse', 'HEAD').trim();
// The lane branch: one commit of its own on top of the chain base, so the chain tip stands
// in its first-parent chain exactly as a merged or freshly branched lane head does.
git('checkout', '--quiet', '-b', 'fixture-lane');
write('rebuild/lanes/b/NOTES.md', 'lane work\n');
git('add', '-A'); git('commit', '--quiet', '-m', 'lane work');
const LANE_HEAD = git('rev-parse', 'HEAD').trim();

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
process.argv = [process.execPath, runnerFile, '--full', '--package', 'B-NTC'];
try {
  m._compile(fixtureSource.slice(0, fixtureSource.indexOf(delimiter)) +
    '\nmodule.exports={sealOnTheTip,sealedRunReceipt,writeSealedRunReceipt,VERDICT_FILE,FAIL_CODES,' +
    'init(a,raw){logDir=root;ARTIFACT=a;specRaw=raw;}};', runnerFile);
} finally { process.argv = savedArgv; }
const api = m.exports;
const SPEC_BYTES = Buffer.from('{"the":"reviewed spec bytes"}\n');
api.init(ARTIFACT, SPEC_BYTES);

test.after(() => {
  const resolved = fs.realpathSync(scratch);
  assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
  assert(path.basename(resolved).startsWith('earned-seal-tip-'));
  fs.rmSync(resolved, { recursive: true, force: true });
});

const said = [];
const out = line => said.push(line);
const claim = line => ({ ledgerLine: 1, role: 'cowork', line, lineSha256: sha(Buffer.from(line)) });
const spec = freeze => ({ packageId: PACKAGE_ID, authorizations: { freeze: freeze || null },
  product: { [PRODUCT]: { pre: null, post: sha(fs.readFileSync(path.join(scratch, PRODUCT))), role: 'new' } } });

// ------------------------------------------------------- DECISIONS:135 (4) seal on the tip
test(':135 (4) — a head whose first-parent chain carries the chain tip may seal', () => {
  assert.equal(git('rev-parse', 'refs/heads/fixture-chain').trim(), BASE);
  said.length = 0;
  api.sealOnTheTip(spec(), out);
  assert.equal(said.length, 1);
  assert.match(said[0], /SEAL BASE ON THE TIP/);
  assert(said[0].includes(BASE.slice(0, 7)));
});

test(':135 (4) — the tip moving ahead refuses the seal, by name', () => {
  // The stale-base case :135 diagnoses: the chain moves and the lane head does not follow.
  // The lane head still has the OLD tip as an ancestor, which is why ancestry is not the
  // question asked — the CURRENT tip must stand in this head's own first-parent chain.
  git('checkout', '--quiet', 'fixture-chain');
  write('rebuild/DECISIONS.md', '- 2026-09-12 · cowork · a chain line\n- 2026-09-12 · cowork · a later chain line\n');
  git('add', '-A'); git('commit', '--quiet', '-m', 'the chain moves on');
  const tip = git('rev-parse', 'HEAD').trim();
  git('checkout', '--quiet', 'fixture-lane');
  assert.equal(git('rev-parse', 'HEAD').trim(), LANE_HEAD);
  assert.notEqual(tip, BASE);
  assert.throws(() => api.sealOnTheTip(spec(), out), /SEAL-BASE-IS-NOT-THE-CHAIN-TIP/);
  // And the old tip IS still an ancestor of this head — so a merge-base ancestry test would
  // have admitted it. The refusal is the whole point of :135 (4).
  cp.execFileSync('git', ['merge-base', '--is-ancestor', BASE, 'HEAD'], { cwd: scratch });
});

test(':135 (4) — REBASING onto the tip restores the seal; merging the tip in does not', () => {
  // The operational consequence, measured. `git merge --no-ff <tip>` from the lane puts the
  // tip on the SECOND parent, so the head is not built ON it and the refusal stands — this
  // is the one case where :135 (4) is stricter than "the tip is behind me".
  git('merge', '--no-ff', '--quiet', '-m', 'merge the chain tip', 'fixture-chain');
  assert.throws(() => api.sealOnTheTip(spec(), out), /SEAL-BASE-IS-NOT-THE-CHAIN-TIP/);
  // A REBASE onto the tip — ":135's own timeline: rebase + final round + seal each, on the
  // tip" — puts it in the first-parent chain and the seal is admitted, with no ledger line.
  git('reset', '--quiet', '--hard', LANE_HEAD);
  git('rebase', '--quiet', 'fixture-chain');
  said.length = 0;
  api.sealOnTheTip(spec(), out);
  assert.match(said[0], /SEAL BASE ON THE TIP/);
  // Put the lane head back where the freeze cases need it: behind the tip again.
  git('reset', '--quiet', '--hard', LANE_HEAD);
  assert.throws(() => api.sealOnTheTip(spec(), out), /SEAL-BASE-IS-NOT-THE-CHAIN-TIP/);
});

test(':135 (4) — a PM FREEZE line naming THIS base frees the seal, and only that', () => {
  const FREEZE = '- 2026-09-12 · cowork · FREEZE for ' + PACKAGE_ID + ' at base ' + LANE_HEAD + ' · RULED';
  // A freeze the lane wrote for itself is not on the chain branch and frees nothing.
  assert.throws(() => api.sealOnTheTip(spec(claim(FREEZE)), out), /SEAL-FREEZE-LINE-NOT-ON-THE-CHAIN-BRANCH/);
  // The PM writes it on the chain branch. Now the same citation resolves.
  git('checkout', '--quiet', 'fixture-chain');
  write('rebuild/DECISIONS.md', fs.readFileSync(path.join(scratch, 'rebuild/DECISIONS.md'), 'utf8') + FREEZE + '\n');
  git('add', '-A'); git('commit', '--quiet', '-m', 'the PM freezes the base');
  git('checkout', '--quiet', 'fixture-lane');
  said.length = 0;
  api.sealOnTheTip(spec(claim(FREEZE)), out);
  assert.match(said[0], /SEAL BASE FROZEN BY DECISIONS:/);
  assert(said[0].includes(LANE_HEAD.slice(0, 7)));
});

test(':135 (4) — a freeze naming another package, or another base, frees nothing', () => {
  const forOther = '- 2026-09-12 · cowork · FREEZE for M2-SOMEONE-ELSE at base ' + LANE_HEAD + ' · RULED';
  const forOtherBase = '- 2026-09-12 · cowork · FREEZE for ' + PACKAGE_ID + ' at base ' + 'f'.repeat(40) + ' · RULED';
  git('checkout', '--quiet', 'fixture-chain');
  write('rebuild/DECISIONS.md', fs.readFileSync(path.join(scratch, 'rebuild/DECISIONS.md'), 'utf8') + forOther + '\n' + forOtherBase + '\n');
  git('add', '-A'); git('commit', '--quiet', '-m', 'two freezes that do not apply');
  git('checkout', '--quiet', 'fixture-lane');
  assert.throws(() => api.sealOnTheTip(spec(claim(forOther)), out), /SEAL-FREEZE-LINE-DOES-NOT-FREEZE-THIS-PACKAGE/);
  assert.throws(() => api.sealOnTheTip(spec(claim(forOtherBase)), out), /SEAL-FREEZE-LINE-DOES-NOT-NAME-A-BASE-IN-THIS-FIRST-PARENT-CHAIN/);
});

// ------------------------------------------- DECISIONS:136 (3) the byte-identity re-verify
const KEY = 'ACCEPTED:' + 'a'.repeat(64) + ':' + BASE + ':' + BASE;
function seal() {
  const wrote = api.writeSealedRunReceipt(spec(), KEY);
  write(VERDICT, ['# VERDICT B-NTC', 'artifact ' + wrote.sealedRun.artifactSha256,
    'spec ' + wrote.sealedRun.specSha256, 'runner ' + wrote.sealedRun.runnerSha256, ''].join('\n'));
  return wrote;
}

test(':136 (3) — no receipt at all is the OLD behaviour: the FULL run is required', () => {
  // The first full run with the private census is unchanged, because there is nothing for
  // the authorized step to re-verify against.
  const r = api.sealedRunReceipt(spec(), KEY);
  assert.equal(r.ok, false);
  assert.equal(r.code, 'SEALED-RUN-RECEIPT-ABSENT');
});

test(':136 (3) — identical bytes re-verify, and the receipt is what the seal step wrote', () => {
  const wrote = seal();
  assert.equal(wrote.sealedRun.artifactSha256, sha(fs.readFileSync(path.join(scratch, ARTIFACT))));
  assert.equal(wrote.sealedRun.specSha256, sha(SPEC_BYTES));
  assert.equal(wrote.sealedRun.runnerSha256, sha(fs.readFileSync(runnerFile)));
  assert.deepEqual(Object.keys(wrote.sealedRun.product), [PRODUCT]);
  assert.equal(api.VERDICT_FILE, VERDICT);
  const r = api.sealedRunReceipt(spec(), KEY);
  assert.equal(r.ok, true, r.code);
});

test(':136 (3) — ONE product byte changed voids the receipt and forces the FULL run', () => {
  const before = fs.readFileSync(path.join(scratch, PRODUCT), 'utf8');
  write(PRODUCT, before.replace('byte', 'bytes'));
  const moved = api.sealedRunReceipt({ ...spec(), product: { [PRODUCT]: { pre: null, post: sha(Buffer.from(before)), role: 'new' } } }, KEY);
  assert.equal(moved.ok, false);
  assert.equal(moved.code, 'SEALED-RUN-RECEIPT-VOID');
  assert.deepEqual(moved.moved, [PRODUCT]);
  write(PRODUCT, before);
  assert.equal(api.sealedRunReceipt(spec(), KEY).ok, true);
});

test(':136 (3) — the RUNNER changed, the ARTIFACT changed and the ENVELOPE changed each void it', () => {
  const runnerBefore = fs.readFileSync(runnerFile);
  fs.writeFileSync(runnerFile, Buffer.concat([runnerBefore, Buffer.from('\n// one byte of drift\n')]));
  assert.equal(api.sealedRunReceipt(spec(), KEY).code, 'SEALED-RUN-RECEIPT-VOID');
  fs.writeFileSync(runnerFile, runnerBefore);

  const artifactBefore = fs.readFileSync(path.join(scratch, ARTIFACT), 'utf8');
  write(ARTIFACT, '{"version":1,"lanePackage":"B-NTC","and":"one more field"}\n');
  assert.equal(api.sealedRunReceipt(spec(), KEY).code, 'SEALED-RUN-RECEIPT-VOID');
  write(ARTIFACT, artifactBefore);

  // A receipt taken under another ACCEPTED envelope — another receipt base or another
  // reviewed commit — is not this run's receipt.
  assert.equal(api.sealedRunReceipt(spec(), 'ACCEPTED:' + 'b'.repeat(64) + ':' + BASE + ':' + BASE).code, 'SEALED-RUN-RECEIPT-VOID');
  assert.equal(api.sealedRunReceipt(spec(), KEY).ok, true);
});

test(':136 (3) — a product file the receipt does not carry is as much a change as one that moved', () => {
  const extra = 'rebuild/m4/spec/fixture-seal-extra.cjs';
  write(extra, 'console.log("a second pinned file the sealed run never saw");\n');
  const s = spec();
  s.product[extra] = { pre: null, post: sha(fs.readFileSync(path.join(scratch, extra))), role: 'new' };
  const r = api.sealedRunReceipt(s, KEY);
  assert.equal(r.code, 'SEALED-RUN-RECEIPT-VOID');
  assert.deepEqual(r.moved, [extra]);
});

test(':136 (3) — the verdict file must NAME the sealed run\'s evidence hashes', () => {
  const before = fs.readFileSync(path.join(scratch, VERDICT), 'utf8');
  write(VERDICT, '# VERDICT B-NTC\nno hashes at all\n');
  assert.equal(api.sealedRunReceipt(spec(), KEY).code, 'SEALED-RUN-VERDICT-DOES-NOT-NAME-THE-EVIDENCE-HASHES');
  fs.rmSync(path.join(scratch, VERDICT));
  assert.equal(api.sealedRunReceipt(spec(), KEY).code, 'SEALED-RUN-VERDICT-FILE-ABSENT');
  write(VERDICT, before);
  assert.equal(api.sealedRunReceipt(spec(), KEY).ok, true);
});

test(':136 (3) — a mis-shaped or re-keyed receipt is refused, never partly trusted', () => {
  const file = path.join(scratch, 'rebuild/lanes/b/tooling/receipts/B-NTC.json');
  const before = fs.readFileSync(file, 'utf8');
  const body = JSON.parse(before);
  delete body.sealedRun.envelopeKey;
  fs.writeFileSync(file, JSON.stringify(body, null, 2) + '\n');
  assert.equal(api.sealedRunReceipt(spec(), KEY).code, 'SEALED-RUN-RECEIPT-SHAPE');
  const other = JSON.parse(before); other.packageId = 'M2-SOMEONE-ELSE';
  fs.writeFileSync(file, JSON.stringify(other, null, 2) + '\n');
  assert.equal(api.sealedRunReceipt(spec(), KEY).code, 'SEALED-RUN-RECEIPT-SHAPE');
  fs.writeFileSync(file, '{ not json at all');
  assert.equal(api.sealedRunReceipt(spec(), KEY).code, 'SEALED-RUN-RECEIPT-UNREADABLE');
  fs.writeFileSync(file, before);
  assert.equal(api.sealedRunReceipt(spec(), KEY).ok, true);
});

test('both rulings carry their own names in the refusal vocabulary', () => {
  for (const code of ['SEAL-BASE-IS-NOT-THE-CHAIN-TIP', 'SEAL-FREEZE-LINE-NOT-ON-THE-CHAIN-BRANCH',
    'SEAL-FREEZE-LINE-DOES-NOT-FREEZE-THIS-PACKAGE', 'SEAL-FREEZE-LINE-DOES-NOT-NAME-A-BASE-IN-THIS-FIRST-PARENT-CHAIN',
    'SEAL-FREEZE-LINE-SHAPE', 'SEALED-RUN-RECEIPT-VOID', 'SEALED-RUN-RECEIPT-ABSENT', 'SEALED-RUN-RECEIPT-SHAPE',
    'SEALED-RUN-RECEIPT-UNREADABLE', 'SEALED-RUN-VERDICT-FILE-ABSENT', 'SEALED-RUN-VERDICT-DOES-NOT-NAME-THE-EVIDENCE-HASHES'])
    assert(api.FAIL_CODES.has(code), 'the vocabulary carries ' + code);
});
