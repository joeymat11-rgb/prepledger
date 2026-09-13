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
    '\nmodule.exports={sealOnTheTip,sealedRunReceipt,writeSealedRunReceipt,sealedRunReceiptInstruction,' +
    'VERDICT_FILE,SEAL_TIP_RULE,FAIL_CODES,init(a,raw){logDir=root;ARTIFACT=a;specRaw=raw;}};', runnerFile);
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
  // The lane head still has the OLD tip as an ancestor; what is asked is the CURRENT tip,
  // and that is what makes ancestry (DECISIONS:145) exclude every stale base.
  git('checkout', '--quiet', 'fixture-chain');
  write('rebuild/DECISIONS.md', '- 2026-09-12 · cowork · a chain line\n- 2026-09-12 · cowork · a later chain line\n');
  git('add', '-A'); git('commit', '--quiet', '-m', 'the chain moves on');
  const tip = git('rev-parse', 'HEAD').trim();
  git('checkout', '--quiet', 'fixture-lane');
  assert.equal(git('rev-parse', 'HEAD').trim(), LANE_HEAD);
  assert.notEqual(tip, BASE);
  assert.throws(() => api.sealOnTheTip(spec(), out), /SEAL-BASE-IS-NOT-THE-CHAIN-TIP/);
  // The OLD tip is still an ancestor of this head, and that is exactly why the question is
  // asked of the CURRENT tip: a stale base is a head with every chain commit but the latest
  // ones, and DECISIONS:145's ancestry test refuses it for that reason.
  cp.execFileSync('git', ['merge-base', '--is-ancestor', BASE, 'HEAD'], { cwd: scratch });
});

test(':135 (4) / :145 — MERGING the tip restores the seal, and so does rebasing onto it', () => {
  // DECISIONS:145 RULED ancestry: "merge or rebase both count". `git merge --no-ff <tip>`
  // from the lane puts the tip on the SECOND parent — the case the first-parent reading
  // refused and :137 (1) makes the house move — and it is a seal under the shipped rule.
  git('merge', '--no-ff', '--quiet', '-m', 'merge the chain tip', 'fixture-chain');
  said.length = 0;
  api.sealOnTheTip(spec(), out);
  assert.match(said[0], /SEAL BASE ON THE TIP/);
  // A REBASE onto the tip — ":135's own timeline: rebase + final round + seal each, on the
  // tip" — is the other way, and is admitted with no ledger line either.
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
const RECEIPT = 'rebuild/lanes/b/tooling/receipts/B-NTC.json';
const receiptSha = () => sha(fs.readFileSync(path.join(scratch, RECEIPT)));
// r8 change 1. A SEALED RUN is no longer "a file on disk that agrees with the bytes": the
// receipt's own sha256 must stand in the verdict file AND its bytes must be committed. This
// helper does what the sealer must do — write, name, commit — so every case below starts
// from an authentic receipt and takes exactly one of those three away.
function seal(commit = true, name = true) {
  const wrote = api.writeSealedRunReceipt(spec(), KEY);
  const lines = ['# VERDICT B-NTC', 'artifact ' + wrote.sealedRun.artifactSha256,
    'spec ' + wrote.sealedRun.specSha256, 'runner ' + wrote.sealedRun.runnerSha256];
  if (name) lines.push('sealed-run receipt ' + RECEIPT + ' sha256 ' + receiptSha());
  write(VERDICT, lines.join('\n') + '\n');
  if (commit) { git('add', '-A'); git('commit', '--quiet', '-m', 'the sealed run'); }
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
  // r8 change 1 put the authenticity test FIRST, so each variant below is COMMITTED and its
  // sha named in the verdict — otherwise every one of them would refuse at NOT-IN-GIT and
  // this case would prove nothing about the shape rules it is here for.
  const file = path.join(scratch, 'rebuild/lanes/b/tooling/receipts/B-NTC.json');
  const before = fs.readFileSync(file, 'utf8');
  const land = text => {
    fs.writeFileSync(file, text);
    write(VERDICT, ['# VERDICT B-NTC', 'artifact ' + sha(fs.readFileSync(path.join(scratch, ARTIFACT))),
      'spec ' + sha(SPEC_BYTES), 'runner ' + sha(fs.readFileSync(runnerFile)),
      'sealed-run receipt sha256 ' + receiptSha(), ''].join('\n'));
    git('add', '-A'); git('commit', '--quiet', '-m', 'a receipt variant');
  };
  const body = JSON.parse(before);
  delete body.sealedRun.envelopeKey;
  land(JSON.stringify(body, null, 2) + '\n');
  assert.equal(api.sealedRunReceipt(spec(), KEY).code, 'SEALED-RUN-RECEIPT-SHAPE');
  const other = JSON.parse(before); other.packageId = 'M2-SOMEONE-ELSE';
  land(JSON.stringify(other, null, 2) + '\n');
  assert.equal(api.sealedRunReceipt(spec(), KEY).code, 'SEALED-RUN-RECEIPT-SHAPE');
  land('{ not json at all');
  assert.equal(api.sealedRunReceipt(spec(), KEY).code, 'SEALED-RUN-RECEIPT-UNREADABLE');
  seal();
  assert.equal(api.sealedRunReceipt(spec(), KEY).ok, true);
});

test('both rulings carry their own names in the refusal vocabulary', () => {
  for (const code of ['SEAL-BASE-IS-NOT-THE-CHAIN-TIP', 'SEAL-FREEZE-LINE-NOT-ON-THE-CHAIN-BRANCH',
    'SEAL-FREEZE-LINE-DOES-NOT-FREEZE-THIS-PACKAGE', 'SEAL-FREEZE-LINE-DOES-NOT-NAME-A-BASE-IN-THIS-FIRST-PARENT-CHAIN',
    'SEAL-FREEZE-LINE-SHAPE', 'SEALED-RUN-RECEIPT-VOID', 'SEALED-RUN-RECEIPT-ABSENT', 'SEALED-RUN-RECEIPT-SHAPE',
    'SEALED-RUN-RECEIPT-UNREADABLE', 'SEALED-RUN-VERDICT-FILE-ABSENT', 'SEALED-RUN-VERDICT-DOES-NOT-NAME-THE-EVIDENCE-HASHES',
    'SEALED-RUN-RECEIPT-NOT-IN-GIT', 'SEALED-RUN-VERDICT-DOES-NOT-NAME-THE-RECEIPT'])
    assert(api.FAIL_CODES.has(code), 'the vocabulary carries ' + code);
});

// -------------------------------------------------- r8 change 1: authentic, not consistent
test('r8 — a receipt that is not COMMITTED refuses, however consistent it is', () => {
  // The hole r8 fired: a receipt written by hand, by a process that never ran a gate,
  // returned ok:true and the 19 gates were skipped on a plain disk read. Written and named
  // but NOT committed is exactly that case, and it now refuses by name.
  const r = api.sealedRunReceipt(spec(), KEY);
  assert.equal(r.ok, true, 'the committed control still re-verifies');
  // (a) EDITED SINCE IT WAS COMMITTED. Perfectly canonical, perfectly shaped, and the
  // authenticity test fires BEFORE the content tests, so this is NOT-IN-GIT and not VOID.
  const committed = fs.readFileSync(path.join(scratch, RECEIPT), 'utf8');
  const edited = JSON.parse(committed);
  edited.sealedRun.artifactSha256 = '7'.repeat(64);
  fs.writeFileSync(path.join(scratch, RECEIPT), JSON.stringify(edited, null, 2) + '\n');
  const dirty = api.sealedRunReceipt(spec(), KEY);
  assert.equal(dirty.ok, false);
  assert.equal(dirty.code, 'SEALED-RUN-RECEIPT-NOT-IN-GIT');
  assert.match(dirty.moved[0], /is not committed at HEAD/);
  fs.writeFileSync(path.join(scratch, RECEIPT), committed);
  assert.equal(api.sealedRunReceipt(spec(), KEY).ok, true);
  // (b) NEVER COMMITTED AT ALL — the hand-written case, with the identical bytes on disk.
  git('rm', '--cached', '--quiet', RECEIPT);
  git('commit', '--quiet', '-m', 'the receipt is no longer in Git');
  const only = api.sealedRunReceipt(spec(), KEY);
  assert.equal(only.ok, false);
  assert.equal(only.code, 'SEALED-RUN-RECEIPT-NOT-IN-GIT');
  seal();                                              // restore the authentic one
  assert.equal(api.sealedRunReceipt(spec(), KEY).ok, true);
});

test('r8 — the verdict must name the RECEIPT\'s own sha256, not only the three public ones', () => {
  // The three evidence hashes are public and a forger has them; the receipt's sha256 exists
  // only once a seal step has written one. Take just that line out and the step is gone.
  seal(true, false);
  const r = api.sealedRunReceipt(spec(), KEY);
  assert.equal(r.ok, false);
  assert.equal(r.code, 'SEALED-RUN-VERDICT-DOES-NOT-NAME-THE-RECEIPT');
  // A verdict naming SOME receipt sha, but not this one, is the same refusal.
  const before = fs.readFileSync(path.join(scratch, VERDICT), 'utf8');
  write(VERDICT, before + 'sealed-run receipt sha256 ' + '9'.repeat(64) + '\n');
  git('add', '-A'); git('commit', '--quiet', '-m', 'a verdict naming the wrong receipt');
  assert.equal(api.sealedRunReceipt(spec(), KEY).code, 'SEALED-RUN-VERDICT-DOES-NOT-NAME-THE-RECEIPT');
  seal();
  assert.equal(api.sealedRunReceipt(spec(), KEY).ok, true);
  // And the seal step TELLS the sealer what to do, on the run that writes the receipt.
  const instruction = api.sealedRunReceiptInstruction();
  assert(instruction.includes(RECEIPT) && instruction.includes(receiptSha()) && instruction.includes(VERDICT));
});

// ------------------------------------ r8 F1: the tip rule is ONE constant, both ways tested
test('r8 F1 / DECISIONS:145 — SEAL_TIP_RULE is one word, and both settings are measured', () => {
  // DECISIONS:145 RULED ancestry: the current chain tip must be an ancestor of the branch
  // head, a merge and a rebase both count, a stale base does not, the FREEZE escape is kept.
  assert.equal(api.SEAL_TIP_RULE, 'ancestor', 'DECISIONS:145 is the shipped rule');
  // The same source with the one word changed, and nothing else — asserted, not assumed.
  const strict = fixtureSource.replace("const SEAL_TIP_RULE = 'ancestor';", "const SEAL_TIP_RULE = 'first-parent';");
  const a = fixtureSource.split('\n'), b = strict.split('\n');
  assert.equal(a.length, b.length);
  assert.equal(a.filter((line, i) => line !== b[i]).length, 1, 'exactly one line differs between the two rules');
  const strictFile = path.join(scratch, 'rebuild/lanes/b/tooling/b-package-first-parent.cjs');
  fs.writeFileSync(strictFile, strict);
  const m2 = new Module(strictFile, module);
  m2.filename = strictFile;
  m2.paths = Module._nodeModulePaths(path.dirname(path.join(sourceRoot, runnerRel)));
  const base2 = m2.require.bind(m2);
  m2.require = file => base2(path.isAbsolute(file) && file.startsWith(scratch + path.sep)
    ? path.join(sourceRoot, path.relative(scratch, file)) : file);
  const saved = process.argv;
  process.argv = [process.execPath, strictFile, '--full', '--package', 'B-NTC'];
  try {
    m2._compile(strict.slice(0, strict.indexOf(delimiter)) +
      '\nmodule.exports={sealOnTheTip,SEAL_TIP_RULE,init(a,raw){logDir=root;ARTIFACT=a;specRaw=raw;}};', strictFile);
  } finally { process.argv = saved; }
  const alt = m2.exports;
  alt.init(ARTIFACT, SPEC_BYTES);
  assert.equal(alt.SEAL_TIP_RULE, 'first-parent');
  // THE CASE THAT DIVIDES THEM, measured on one repository: a lane that MERGED the tip with
  // `--no-ff`. The tip is an ancestor of HEAD and is NOT in HEAD's first-parent chain.
  // DECISIONS:145 rules this a SEAL, which is what the shipped runner now says.
  git('checkout', '--quiet', 'fixture-lane');
  git('reset', '--quiet', '--hard', LANE_HEAD);
  git('merge', '--no-ff', '--quiet', '-m', 'merge the chain tip', 'fixture-chain');
  const tip = git('rev-parse', 'refs/heads/fixture-chain').trim();
  cp.execFileSync('git', ['merge-base', '--is-ancestor', tip, 'HEAD'], { cwd: scratch });
  assert(!git('rev-list', '--first-parent', 'HEAD').split(/\r?\n/).includes(tip));
  said.length = 0;
  api.sealOnTheTip(spec(), out);
  assert.match(said[0], /SEAL BASE ON THE TIP/);
  assert.match(said[0], /rule=ancestor/);
  assert.throws(() => alt.sealOnTheTip(spec(), out), /SEAL-BASE-IS-NOT-THE-CHAIN-TIP/);
  // A REBASE onto the tip satisfies both, so :145 widens and does not replace.
  git('reset', '--quiet', '--hard', LANE_HEAD);
  git('rebase', '--quiet', 'fixture-chain');
  said.length = 0;
  api.sealOnTheTip(spec(), out); alt.sealOnTheTip(spec(), out);
  assert.equal(said.length, 2);
  for (const line of said) assert.match(line, /SEAL BASE ON THE TIP/);
  // And ancestry still refuses a genuinely STALE base, which is the failure :135 names.
  git('checkout', '--quiet', 'fixture-chain');
  git('commit', '--quiet', '--allow-empty', '-m', 'the chain moves past this lane');
  git('checkout', '--quiet', 'fixture-lane');
  assert.throws(() => api.sealOnTheTip(spec(), out), /SEAL-BASE-IS-NOT-THE-CHAIN-TIP/);
  assert.throws(() => alt.sealOnTheTip(spec(), out), /SEAL-BASE-IS-NOT-THE-CHAIN-TIP/);
});
