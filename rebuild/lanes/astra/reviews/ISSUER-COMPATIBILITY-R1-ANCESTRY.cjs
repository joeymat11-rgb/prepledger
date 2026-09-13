'use strict';
// Independent reviewer controls: distinguish each reviewed-commit ancestry guard.
// Public synthetic Git only. Load fixture construction, never builder assertions.
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
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const git = (...args) => cp.execFileSync('git', args, {cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});
const runnerBytes = fs.readFileSync(path.join(root,RUNNER));
const fixtureBytes = fs.readFileSync(path.join(root,FIXTURE));
assert(runnerBytes.equals(git('show',CANDIDATE+':'+RUNNER)));
assert(fixtureBytes.equals(git('show',CANDIDATE+':'+FIXTURE)));
assert.equal(hash(runnerBytes),'6d68174177f3e9598f3680d198290a891d77d90febafc7c865cd21bf581b7ba7');
assert.equal(hash(fixtureBytes),'a90f2434e8607800ed95ea1902c886031c69297e79f92be57ed33aabbed074b9');
const source = runnerBytes.toString('utf8');
const fixtureText = fixtureBytes.toString('utf8');
const boundary = '\ntest.after(';
assert.equal(fixtureText.split(boundary).length,2);
const fixtureFile = path.join(root,FIXTURE), fm = new Module(fixtureFile,module);
fm.filename=fixtureFile;fm.paths=Module._nodeModulePaths(path.dirname(fixtureFile));
fm._compile(fixtureText.slice(0,fixtureText.indexOf(boundary)) + `
module.exports={makeFixture,cleanup(){
  for(const item of scratches){const resolved=fs.realpathSync(item);
    assert.equal(path.dirname(resolved),fs.realpathSync(tempRoot));
    assert(path.basename(resolved).startsWith('astra-issuer-'));
    fs.rmSync(resolved,{recursive:true,force:true});
  }
}};`,fixtureFile);
const fixtures=fm.exports;
test.after(()=>fixtures.cleanup());

function setup(code=source) {
  const f=fixtures.makeFixture({code,astraParent:true}),grand=f.parent;
  const parent=f.parentPackage('FIXTURE-INDEPENDENT-ANCESTRY','Astra PM',grand);
  const bound=f.api.option(parent.option);bound.decided=true;
  f.api.pins(f.s,bound); // Positive control uses the same code and fixture.
  return {f,grand,parent};
}
function replaceReceipt(s,reviewed) {
  const {f,grand}=s;
  assert.notEqual(reviewed,grand.reviewedCommit);
  const line=grand.receipt.line.replace(grand.reviewedCommit,reviewed);
  const at=f.append(line);
  const receipt={...grand.receipt,commit:at,line,lineSha256:hash(Buffer.from(line))};
  f.write(grand.option.review,JSON.stringify({version:1,status:'ACCEPTED',receipt},null,2)+'\n');
  f.commit('independent valid receipt at chain context');
}
function isAncestor(f,commit,ref) {
  const r=cp.spawnSync('git',['merge-base','--is-ancestor',commit,ref],{cwd:f.root,windowsHide:true});
  assert.ifError(r.error);assert([0,1].includes(r.status),'Git ancestry must resolve normally');
  return r.status===0;
}
function probe(kind,code=source) {
  const s=setup(code),{f,grand,parent}=s;
  let reviewed;
  if(kind==='HEAD') {
    const stale=f.git('rev-parse','HEAD');
    reviewed=f.commit('same artifact at later chain commit');
    replaceReceipt(s,reviewed);
    const bytes=f.read(grand.option.review);
    f.git('checkout','--quiet','--detach',stale);
    // Only the review file is staged into the older checkout; artifact/product
    // bytes and the parent option stay unchanged. This probes pins, not envelope.
    f.write(grand.option.review,bytes);
    assert.equal(isAncestor(f,reviewed,'HEAD'),false);
    assert.equal(isAncestor(f,reviewed,'fixture-chain'),true);
  } else {
    f.git('checkout','--quiet','-b','fixture-independent-head');
    reviewed=f.commit('same artifact on a separate candidate branch');
    f.git('checkout','--quiet','fixture-chain');
    replaceReceipt(s,reviewed);
    f.git('checkout','--quiet','fixture-independent-head');
    f.git('merge','--quiet','--no-ff','--no-edit','fixture-chain');
    assert.equal(isAncestor(f,reviewed,'HEAD'),true);
    assert.equal(isAncestor(f,reviewed,'fixture-chain'),false);
  }
  assert.equal(hash(Buffer.from(f.git('show',reviewed+':'+grand.option.artifact)+'\n')),grand.option.sha256,
    'The reviewed commit carries the exact legitimate grandparent artifact');
  const bound=f.api.option(parent.option);bound.decided=true;
  const refusal=kind==='HEAD'?'GRANDPARENT-REVIEWED-COMMIT-NOT-BEHIND-HEAD':
    'GRANDPARENT-REVIEWED-COMMIT-NOT-ON-THE-CHAIN-BRANCH';
  const destination=kind==='HEAD'?'HEAD':'refs/heads/fixture-chain';
  const expected=refusal+' '+reviewed.slice(0,12)+' is not an ancestor of '+destination;
  assert.throws(()=>f.api.pins(f.s,bound),error=>error instanceof Error && error.message===expected,
    'The individually violated ancestry condition must refuse');
}
function removeOne(needle) {
  assert.equal(source.split(needle).length,2,'exactly one source guard to mutate');
  return source.replace(needle,'/* Independent reviewer temporary guard removal. */');
}
for(const kind of ['HEAD','CHAIN']) {
  const guard=kind==='HEAD'?
    "ancestor(gm[2], 'HEAD', 'GRANDPARENT-REVIEWED-COMMIT-NOT-BEHIND-HEAD');":
    "ancestor(gm[2], CHAIN_REF, 'GRANDPARENT-REVIEWED-COMMIT-NOT-ON-THE-CHAIN-BRANCH');";
  test(kind+'-only violation refuses; removal of only that guard loses refusal; original positive restored',()=>{
    probe(kind);
    assert.throws(()=>probe(kind,removeOne(guard)),error=>error.code==='ERR_ASSERTION' &&
      /^Missing expected exception/.test(error.message),'The isolated source mutant must fail only the refusal assertion');
    setup(); // Fresh real-source positive proves restoration after the mutant.
    assert(fs.readFileSync(path.join(root,RUNNER)).equals(runnerBytes),'Production source never edited');
  });
}
