'use strict';
// Independent review of f047b5b. Public, synthetic checks only; never enter main/full gates.
// Reuse the audited builder's Git-fixture construction, not its test assertions.
// Production probes below compile the exact runner without either fixture substitution.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const Module = require('node:module');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../../..');
const CANDIDATE = 'f195b7fe69c8ede31c322f5da72481e63b8c3b0b';
const RUNNER = 'rebuild/lanes/b/tooling/b-package.cjs';
const FIXTURE = 'rebuild/lanes/b/tooling/test/astra-issuer-compatibility.test.cjs';
const CHAIN = 'refs/remotes/origin/rebuild/t2-client-core';
const LEDGER = 'rebuild/DECISIONS.md';
const DOC = 'rebuild/lanes/astra/OWNER-APPROVED-HANDOVER.md';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const git = (...args) => cp.execFileSync('git', args, {cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});
const runnerBytes = fs.readFileSync(path.join(root,RUNNER));
const fixtureBytes = fs.readFileSync(path.join(root,FIXTURE));
assert(runnerBytes.equals(git('show',CANDIDATE+':'+RUNNER)), 'Exact candidate runner, disk equals Git');
assert(fixtureBytes.equals(git('show',CANDIDATE+':'+FIXTURE)), 'Exact candidate fixture, disk equals Git');
assert.equal(hash(runnerBytes),'6d68174177f3e9598f3680d198290a891d77d90febafc7c865cd21bf581b7ba7');
assert.equal(hash(fixtureBytes),'a90f2434e8607800ed95ea1902c886031c69297e79f92be57ed33aabbed074b9');
const fixtureText = fixtureBytes.toString('utf8');
const fixtureBoundary = '\ntest.after(';
assert.equal(fixtureText.split(fixtureBoundary).length,2);
const fixtureFile = path.join(root,FIXTURE);
const fm = new Module(fixtureFile,module);
fm.filename=fixtureFile;fm.paths=Module._nodeModulePaths(path.dirname(fixtureFile));
fm._compile(fixtureText.slice(0,fixtureText.indexOf(fixtureBoundary)) + `
module.exports={makeFixture,VOID,docBytes,cleanup(){
  for(const item of scratches){const resolved=fs.realpathSync(item);
    assert.equal(path.dirname(resolved),fs.realpathSync(tempRoot));
    assert(path.basename(resolved).startsWith('astra-issuer-'));
    fs.rmSync(resolved,{recursive:true,force:true});
  }
}};`,fixtureFile);
const fixtures = fm.exports;
test.after(()=>fixtures.cleanup());

const runnerFile=path.join(root,RUNNER), production=new Module(runnerFile,module);
production.filename=runnerFile;production.paths=Module._nodeModulePaths(path.dirname(runnerFile));
const source=runnerBytes.toString('utf8');
const boundary='// ------------------------------------------------------------------ 8. main sequence';
assert.equal(source.split(boundary).length,2);
const savedArgv=process.argv;
process.argv=[process.execPath,runnerFile,'--ci','--package','B1'];
try {
  production._compile(source.slice(0,source.indexOf(boundary))+
    '\nmodule.exports={pmReceipt,pmLedger,option,init(){logDir=path.join(root,".tmp");}};',runnerFile);
} finally {process.argv=savedArgv;}
const real=production.exports;real.init();
const claim=(line,ledgerLine,role)=>({ledgerLine,role,line,lineSha256:hash(Buffer.from(line))});

test('I01 real unmodified runner recognizes exact published Astra PM authority',()=>{
  const lines=git('show',CHAIN+':'+LEDGER).toString('utf8').split(/\r?\n/);
  assert.equal(real.pmLedger(CHAIN,claim(lines[197],198,'Astra PM'),
    ['BRIEF-ASTRA-ISSUER-COMPATIBILITY-v1.0.md']), 'Astra PM');
});

test('I02 real historical cowork receipt remains valid at handover and current descendant',()=>{
  const anchor='3ef096d671af924caefa346c530f06784f382af0';
  const lines=git('show',anchor+':'+LEDGER).toString('utf8').split(/\r?\n/);
  const line=lines.find(value=>/^- .* · cowork · POSTFIX-ACCEPTANCE .* ACCEPTED$/.test(value));
  assert(line,'A genuine historical acceptance exists');
  for(const at of [anchor,CHAIN]) {
    const receipt={commit:at,path:LEDGER,line,lineSha256:hash(Buffer.from(line))};
    assert.equal(real.pmReceipt(at,receipt,[]),'cowork');
  }
});

test('I03 actual option verifies a published historical parent with the unmodified runner',()=>{
  const spec=JSON.parse(fs.readFileSync(path.join(root,'rebuild/lanes/b/tooling/packages/B1.json'),'utf8'));
  const option=spec.parent.options.find(value=>value.sha256 && value.reviewSha256);
  assert(option,'A published sealed parent option exists');
  const bound=real.option(option);
  assert.equal(bound.option.sha256,option.sha256);
  assert.match(bound.reviewedCommit,/^[a-f0-9]{40}$/);
});

function astraGrandparent() {
  const f=fixtures.makeFixture({astraParent:true});
  const grand=f.parent;
  const parent=f.parentPackage('FIXTURE-INDEPENDENT-NEXT','Astra PM',grand);
  const bound=f.api.option(parent.option);bound.decided=true;
  f.api.pins(f.s,bound); // Positive control through actual option and pins.
  return {f,grand,parent,bound};
}
function replaceGrandReceipt(setup,line,at) {
  const {f,grand,parent}=setup;
  at=at || f.append(line);
  const receipt={...grand.receipt,commit:at,line,lineSha256:hash(Buffer.from(line))};
  f.write(grand.option.review,JSON.stringify({version:1,status:'ACCEPTED',receipt},null,2)+'\n');
  f.commit('independent public synthetic grandparent receipt');
  assert(f.read(grand.option.review).equals(Buffer.from(f.git('show','HEAD:'+grand.option.review)+'\n')),
    'Replacement is committed on the synthetic chain, not an uncommitted-file confound');
  const bound=f.api.option(parent.option);bound.decided=true;
  return bound;
}

for(const terminal of ['REJECTED','PENDING','ACCEPTED-BY-NAME']) {
  test('I04 grandparent receipt refuses terminal '+terminal,()=>{
    const setup=astraGrandparent();
    const line=setup.grand.receipt.line.replace(/ACCEPTED$/,terminal);
    const bound=replaceGrandReceipt(setup,line);
    assert.throws(()=>setup.f.api.pins(setup.f.s,bound),/Grandparent|GRANDPARENT|RECEIPT|PM-/,
      'Grandparent inheritance must enforce the exact ACCEPTED terminal');
  });
}

test('I05 grandparent receipt binds the exact accepted package id',()=>{
  const setup=astraGrandparent();
  const line=setup.grand.receipt.line.replace(setup.grand.acceptance.packageId,'M2-DIFFERENT-PACKAGE');
  const bound=replaceGrandReceipt(setup,line);
  assert.throws(()=>setup.f.api.pins(setup.f.s,bound),/Grandparent|GRANDPARENT|RECEIPT|PM-/,
    'Grandparent receipt package must equal the grandparent artifact package');
});

test('I06 grandparent receipt resolves its named reviewed commit',()=>{
  const setup=astraGrandparent();
  const line=setup.grand.receipt.line.replace(setup.grand.reviewedCommit,'0'.repeat(40));
  const bound=replaceGrandReceipt(setup,line);
  assert.throws(()=>setup.f.api.pins(setup.f.s,bound),/Grandparent|GRANDPARENT|RECEIPT|PM-|git/,
    'Grandparent receipt must name an existing reviewed artifact commit');
});

test('I07 receipt-context handover corruption refuses even after the chain tip is restored',()=>{
  const f=fixtures.makeFixture();
  f.write(DOC,fixtures.docBytes+'changed in receipt context\n');
  const bad=f.parentPackage('FIXTURE-CORRUPT-CONTEXT','Astra PM',f.parent);
  f.write(DOC,fixtures.docBytes);f.commit('restore the current chain handover document');
  assert(f.api.option(f.parent.option),'Unchanged historical parent remains usable');
  assert.throws(()=>f.api.option(bad.option),/PM-HANDOVER-DOCUMENT-BYTES/);
});

test('I08 new Astra receipt cannot occupy a pre-handover ledger position',()=>{
  const setup=astraGrandparent(), {f,grand}=setup;
  const line=grand.receipt.line.replace(' · POSTFIX-ACCEPTANCE ',' · moved POSTFIX-ACCEPTANCE ');
  const old=f.lines.indexOf(fixtures.VOID);assert(old>=0 && old<f.handover.lineNumber-1);
  f.lines[old]=line;f.ledger();const at=f.commit('put a new receipt before the fixed handover line');
  const bound=replaceGrandReceipt(setup,line,at);
  assert.throws(()=>f.api.pins(f.s,bound),/PM-ASTRA-LINE-BEFORE-HANDOVER/);
});

test('I09 an ambiguous duplicate exact claim refuses in the actual spec',()=>{
  const f=fixtures.makeFixture();f.append(f.s.authorizations.theme.line);
  assert.throws(()=>f.api.spec(),/RECEIPT-EXACT-LINE-MISSING/);
});

test('I10 role words in a grandparent payload confer no PM authority',()=>{
  const setup=astraGrandparent();
  const line=setup.grand.receipt.line.replace(' · Astra PM · ',' · builder · quoted · Astra PM · ');
  const bound=replaceGrandReceipt(setup,line);
  assert.throws(()=>setup.f.api.pins(setup.f.s,bound),/PM-ISSUER-ROLE/);
});
