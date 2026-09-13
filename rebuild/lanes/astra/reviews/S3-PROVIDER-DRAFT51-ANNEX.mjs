// Independent reviewer orchestration; root runs it serially in its own copied tree.
// Candidate ebc4c4e870497199c113c5e5c85bdced679589cf. No real-C2 evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

assert.match(process.versions.node, /^22\./);
assert.equal(Intl.DateTimeFormat().resolvedOptions().timeZone, 'America/New_York');
assert.ok(process.env.S3_SCRATCH && process.env.S3_RUN_ROOT, 'Root supplies owned copied tree and run directory');
assert.equal(process.env.S3_MUTATION, undefined, 'Start from the original candidate, not another mutation');
const root = path.resolve(process.env.S3_SCRATCH), run = path.resolve(process.env.S3_RUN_ROOT);
const same = (a,b) => process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
assert.ok(same(fs.realpathSync.native(root), root) && same(fs.realpathSync.native(run), run));
assert.equal(path.basename(root), 'tree'); assert.ok(same(path.dirname(root), run), 'Mutation stays in this exact owned run');
const sha = value => createHash('sha256').update(value).digest('hex');
const manifestBytes = fs.readFileSync(path.join(root, 'rebuild/m4/spec/s3-portable-sources.json'));
assert.equal(sha(manifestBytes), 'c7623bcaa982182ab2cccd5ca542c450a758a4b8a2be99b0d4c063d55926a15d');
const manifest = JSON.parse(manifestBytes), pins = new Map(manifest.sources.map(row => [row.path,row.sha256]));
assert.equal(manifest.implementationParent, '06c5b4a5d76c9973849d0f4cde51b379bc35be43');
assert.equal(manifest.sourceM, '100820aa47a4f8729642033499eaec0f0ee282e1');
assert.equal(pins.size, 111); assert.equal(manifest.sources.length, 111);
function candidatePath(name) {
  assert.ok(pins.has(name), 'Only a listed candidate source may be used');
  const file = path.resolve(root,name), relative = path.relative(root,file);
  assert.ok(relative && !path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep));
  assert.ok(same(fs.realpathSync.native(file),file), 'No redirected source'); return file;
}
function verifyOriginals() {
  for (const [name, expected] of pins) assert.equal(sha(fs.readFileSync(candidatePath(name))), expected, 'Original source restored: ' + name);
}
verifyOriginals();
const target = 'rebuild/m4/import/engine-provider.cjs', targetPath = candidatePath(target);
const providerTests = candidatePath('rebuild/m4/import/test/engine-provider.test.cjs');
const preload = candidatePath('rebuild/m4/import/test/s3/current-head.cjs');
const declaredTests = [...fs.readFileSync(providerTests,'utf8').matchAll(/^test\('([^']+)'/gm)].map(match => match[1]);
assert.ok(declaredTests.length > 0); assert.equal(new Set(declaredTests).size,declaredTests.length);
const originalHash = 'f8b3d4cb7f8a7fd2c414a83b54cc497ca3aee71be90269ddd30b3eeb9c231a3e';
assert.equal(pins.get(target), originalHash); assert.ok(manifest.mutationTargets.includes(target));
const needle = "context.mapping.dependencies?.drafts==='default-empty'?Object.freeze({length:0,key:()=>null}):unavailable('drafts')";
const replacement = 'Object.freeze({length:0,key:()=>null})';

test('REVIEW-DRAFT51-DISCRIMINATION: the actual caught51 assertion must kill an invented empty-draft substitution', {timeout:240000}, t => {
  const logs = fs.mkdtempSync(path.join(run,'review-draft51-'));
  const original = fs.readFileSync(targetPath), source = original.toString('utf8');
  assert.equal(sha(original), originalHash); assert.equal(source.split(needle).length,2,'One exact registered semantic site');
  const mutant = Buffer.from(source.replace(needle,replacement)), mutation = {path:target, original_sha256:originalHash, sha256:sha(mutant)};
  const execute = (name, registration) => {
    const env = {...process.env}; delete env.NODE_TEST_CONTEXT; delete env.S3_MUTATION;
    if (registration) env.S3_MUTATION = JSON.stringify(registration);
    const result = spawnSync(process.execPath,['--require',preload,'--test','--test-reporter=tap',providerTests],
      {cwd:root,env,windowsHide:true,encoding:'utf8',timeout:60000,maxBuffer:12e6});
    fs.writeFileSync(path.join(logs,name+'.tap'),(result.stdout||'')+(result.stderr||''));
    return result;
  };
  const inspect = (result,label) => {
    assert.equal(result.error,undefined,label+': actual child launched and completed');
    const log = (result.stdout||'')+(result.stderr||'');
    const count = key => {const matches = [...log.matchAll(new RegExp('^# '+key+' ([0-9]+)$','gm'))]; assert.equal(matches.length,1,label+': one actual '+key+' total'); return Number(matches[0][1]);};
    const totals = {tests:count('tests'),pass:count('pass'),fail:count('fail'),skipped:count('skipped'),cancelled:count('cancelled')};
    assert.equal(totals.tests,declaredTests.length,label+': every declared current provider cell executed');
    assert.equal(totals.skipped,0); assert.equal(totals.cancelled,0); assert.equal(totals.pass+totals.fail,declaredTests.length);
    const reportedNames = [...log.matchAll(/^(?:not ok|ok) [0-9]+ - (S3-PROVIDER-[^\r\n]+)$/gm)].map(match => match[1]);
    assert.deepEqual(reportedNames.sort(),declaredTests.slice().sort(),label+': complete named current suite, not a filtered child');
    const selected = [...log.matchAll(/^(not ok|ok) [0-9]+ - S3-PROVIDER-CAUGHT51:.*$/gm)];
    assert.equal(selected.length,1,label+': selected caught51 test actually reported');
    const tail = log.slice(selected[0].index).split('\n');
    const end = tail.findIndex((line,i) => i>0 && /^(# Subtest:|(?:not ok|ok) [0-9]+ -|1\.\.)/.test(line));
    const block = tail.slice(0,end<0 ? undefined : end).join('\n');
    return {status:result.status,totals,selected:selected[0][1],selectedAssertion:/\bcode: ['"]?ERR_ASSERTION\b/.test(block),
      setupFailure:/SyntaxError|MODULE_NOT_FOUND|ERR_MODULE_NOT_FOUND|S3_SOURCE_DRIFT|S3_UNLISTED_MODULE|S3_MUTATION_UNREGISTERED|IMPORT_PREPARATION_DEPENDENCIES/.test(log)};
  };
  const clean = (summary,label) => {assert.equal(summary.status,0,label+': child succeeds'); assert.equal(summary.totals.pass,declaredTests.length); assert.equal(summary.totals.fail,0); assert.equal(summary.selected,'ok');};
  const baseline = inspect(execute('original'), 'original'); clean(baseline,'original');
  let mutantResult;
  try {
    // This env registration is the existing current-head mutation protocol;
    // neither the candidate manifest nor its assertions are changed.
    fs.writeFileSync(targetPath,mutant); mutantResult = execute('empty-drafts-mutant',mutation);
  } finally {
    fs.writeFileSync(targetPath,original); verifyOriginals();
  }
  const restored = inspect(execute('restored'),'restored'); clean(restored,'restored'); verifyOriginals();
  const changed = inspect(mutantResult,'empty-drafts-mutant');
  const evidence = {candidate:'ebc4c4e870497199c113c5e5c85bdced679589cf', target, original_sha256:originalHash,
    mutant_sha256:mutation.sha256, baseline, mutant:changed, restored, restored_all_source_hashes:true};
  fs.writeFileSync(path.join(logs,'evidence.json'),JSON.stringify(evidence,null,2)+'\n');
  t.diagnostic(JSON.stringify({...evidence,logs}));
  const killed = changed.status===1 && changed.selected==='not ok' && changed.selectedAssertion && !changed.setupFailure;
  assert.equal(killed,true,'The named caught51 assertion must kill this mutant; a complete passing mutant suite proves its missing-draft case is masked');
});
