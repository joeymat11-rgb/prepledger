'use strict';
// DECISIONS:154/214. Actual runner readers in invented Git repositories.
// The campaign/main sequence, engine factories and private gates never execute.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const Module = require('node:module'), crypto = require('node:crypto');
const sourceRoot = path.resolve(__dirname, '../../../../..');
const runnerPath = 'rebuild/lanes/b/tooling/b-package.cjs';
const source = fs.readFileSync(path.join(sourceRoot, runnerPath), 'utf8');
const boundary = '// ------------------------------------------------------------------ 8. main sequence';
assert.equal(source.split(boundary).length, 2);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const scratchRoot = path.join(sourceRoot, '.tmp');
fs.mkdirSync(scratchRoot, {recursive:true});
const scratches = [];
const originals = ['rebuild/conform/v4/postfix/run.cjs','rebuild/conform/v4/postfix/target.cjs',
  'rebuild/conform/v4/postfix/legacy-gates.cjs','rebuild/conform/v4/postfix/strict-json.cjs',
  'rebuild/m4/spec/native-carriers-errors.cjs','rebuild/m4/spec/load-write-reference.cjs'];
const outside = 'rebuild/m3/w6/local/today-bindings.mjs';
const core = ['rebuild/engine/sleep.cjs','rebuild/conform/fixture.cjs','rebuild/m4/spec/fixture.cjs'];
function fixture(code=source) {
  const root=fs.mkdtempSync(path.join(scratchRoot,'git-pin-classes-'));scratches.push(root);
  const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe'],windowsHide:true}).trim();
  const write=(file,bytes)=>{const target=path.join(root,file);assert(target.startsWith(root+path.sep));fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);};
  const commit=()=>{git('add','-A');git('commit','--quiet','--allow-empty','-m','synthetic pin boundary');return git('rev-parse','HEAD');};
  git('init','--quiet','-b','fixture-chain');git('config','user.name','Synthetic pin test');git('config','user.email','pin-test@earned.local');git('config','core.autocrlf','false');
  for(const file of originals)write(file,fs.readFileSync(path.join(sourceRoot,file)));
  for(const file of [outside,...core])write(file,'export const evidence = "base";\n');
  const expected=sha('export const evidence = "base";\n'),base=commit();
  write(runnerPath,code);
  const file=path.join(root,runnerPath),m=new Module(file,module);m.filename=file;
  m.paths=Module._nodeModulePaths(path.dirname(path.join(sourceRoot,runnerPath)));
  const originalRequire=m.require.bind(m);
  m.require=id=>originalRequire(path.isAbsolute(id)&&id.startsWith(root+path.sep)?path.join(sourceRoot,path.relative(root,id)):id);
  const saved=process.argv;process.argv=[process.execPath,file,'--ci','--package','B1'];
  try { m._compile(code.slice(0,code.indexOf(boundary))+'\nmodule.exports={held,pins,product,parentPin,envelope,fidelity,init(){logDir=root;specRaw=Buffer.from("{}");ARTIFACT="rebuild/m4/spec/absent.json";REVIEW="rebuild/m4/spec/absent-review.json";}};',file); }
  finally {process.argv=saved;}
  const api=m.exports;api.init();
  return {root,git,write,commit,base,expected,api,s:{sourceBase:base,product:{}}};
}
test.after(()=>{for(const dir of scratches){const resolved=fs.realpathSync(dir);assert.equal(path.dirname(resolved),fs.realpathSync(scratchRoot));assert(path.basename(resolved).startsWith('git-pin-classes-'));fs.rmSync(resolved,{recursive:true,force:true});}});
test('G1 actual inherited reader permits outside disk/HEAD drift only in CI',()=>{
  const f=fixture();f.write(outside,'changed public UI\n');f.commit();
  assert.equal(f.api.held(f.s,outside,f.expected,'PARENT-PIN-BROKEN','ci'),true);
  for(const phase of ['full-entry','full-terminal'])assert.throws(()=>f.api.held(f.s,outside,f.expected,'PARENT-PIN-BROKEN',phase),/GIT-BOUND-PIN-DISK/);
});
test('G2 wrong or missing sourceBase refuses even with correct actual bytes',()=>{
  const f=fixture();f.write(outside,'different base\n');const wrong=f.commit();f.write(outside,'export const evidence = "base";\n');f.commit();
  for(const sourceBase of [wrong,'0'.repeat(40)])assert.throws(()=>f.api.held({...f.s,sourceBase},outside,f.expected,'PARENT-PIN-BROKEN','ci'),/SOURCEBASE|git|Command failed/);
});
for(const file of core)test('G3 actual core reader retains disk and HEAD checks: '+file,()=>{
  const f=fixture();f.write(file,'changed core\n');f.commit();
  for(const phase of ['ci','full-entry','full-terminal'])assert.throws(()=>f.api.held(f.s,file,f.expected,'PARENT-PIN-BROKEN',phase),/PARENT-PIN-BROKEN/);
  f.write(file,'export const evidence = "base";\n');
  assert.throws(()=>f.api.held(f.s,file,f.expected,'PARENT-PIN-BROKEN','ci'),/GIT-DISK-DISAGREE/);
});
test('G4 parent and grandparent reader preserve flat/structured images and current sourceBase',()=>{
  const f=fixture(),gfile='rebuild/m4/spec/synthetic-grandparent.json';
  const ga={product:{[outside]:{pre:'0'.repeat(64),post:f.expected,role:'edited'}},executionPins:{}};
  const grandBytes=JSON.stringify(ga,null,2)+'\n';f.write(gfile,grandBytes);
  const bound={option:{artifact:'synthetic-parent'},reviewedCommit:f.base,acceptance:{product:{},executionPins:{[core[0]]:f.expected},parent:{artifact:gfile,sha256:sha(grandBytes)}}};
  f.write(outside,'new UI\n');f.commit();f.api.pins(f.s,bound,'ci');
  assert.throws(()=>f.api.pins(f.s,bound,'full-entry'),/GIT-BOUND-PIN-DISK/);
  for(const post of [false,0,''])assert.throws(()=>f.api.parentPin({pre:f.expected,post,role:'edited'},outside),/PARENT-PIN-SHAPE/);
  f.s.sourceBase=f.git('rev-parse','HEAD');assert.throws(()=>f.api.pins(f.s,bound,'ci'),/AT-SOURCEBASE/);
});
for(const role of ['carried','pinned-unchanged'])test('G5 actual product preserves '+role+' attribution with Git-bound CI bytes',()=>{
  const f=fixture(),pin={pre:f.expected,post:f.expected,role};f.s.product[outside]=pin;
  const bound=role==='carried'?{acceptance:{product:{[outside]:f.expected},executionPins:{}}}:null;
  f.write(outside,'new UI\n');f.commit();
  const printed=[],saved=console.log;console.log=line=>printed.push(line);
  try {f.api.product(f.s,bound,null,'ci');}finally{console.log=saved;}
  assert(printed.some(line=>line.includes(role==='carried'?'1 carried':'1 declared role "pinned-unchanged"')));
  assert.throws(()=>f.api.product(f.s,bound,null,'full-entry'),/GIT-BOUND-PIN-DISK/);
});
test('G5 declared new or edited implementation never borrows Git-only unchanged evidence',()=>{
  const f=fixture();
  for(const role of ['new','edited','superseded-by-child']){
    f.s.product[outside]={pre:f.expected,post:sha('required new bytes\n'),role};
    f.write(outside,'unlisted bytes\n');
    assert.throws(()=>f.api.product(f.s,null,null,'ci'),/UNLISTED-PRODUCT-DRIFT/);
  }
});
test('G6-G8 absent envelope still enforces full entry and terminal unchanged-pin proof',()=>{
  const f=fixture();f.s.product[outside]={pre:f.expected,post:f.expected,role:'pinned-unchanged'};
  assert.equal(f.api.envelope(f.s,null,undefined,'full-entry').authorized,false);
  f.write(outside,'changed after entry\n');
  assert.throws(()=>f.api.envelope(f.s,null,new Map(),'full-terminal'),/GIT-BOUND-PIN-DISK/);
  assert.throws(()=>f.api.envelope(f.s,null,undefined,'full-entry'),/GIT-BOUND-PIN-DISK/);
  f.commit();f.write(outside,'export const evidence = "base";\n');
  assert.throws(()=>f.api.envelope(f.s,null,new Map(),'full-terminal'),/GIT-BOUND-PIN-HEAD/);
  assert.equal(f.api.envelope(f.s,null,undefined,'ci').authorized,false);
});
test('G10 alias and traversal cannot choose an outside-core class',()=>{
  const f=fixture();for(const file of ['rebuild/engine/../m3/x.cjs','rebuild\\engine\\sleep.cjs','Rebuild/engine/sleep.cjs','rebuild/ENGINE/sleep.cjs','rebuild/engine./sleep.cjs','rebuild//engine/sleep.cjs','C:/outside.cjs'])
    assert.throws(()=>f.api.held(f.s,file,f.expected,'PARENT-PIN-BROKEN','ci'),/PIN-PATH-NORMALIZED/);
  assert.throws(()=>f.api.held(f.s,outside,f.expected,'PARENT-PIN-BROKEN','spec-declared-safe'),/PIN-PHASE-CLOSED/);
});
test('G11 actual fidelity still refuses runner and unlisted source drift',()=>{
  const f=fixture();f.commit();f.s.children=[];f.s.tooling={runnerSha256:sha(source)};
  f.api.fidelity(f.s,null);
  f.write(runnerPath,source+'\n// unreviewed runner\n');
  assert.throws(()=>f.api.fidelity(f.s,null),/RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER/);
  f.write(runnerPath,source);f.write('rebuild/engine/unlisted-synthetic.cjs','module.exports=1;\n');f.commit();
  assert.throws(()=>f.api.fidelity(f.s,null),/UNLISTED-SOURCE-CHANGE/);
});
function mutated(from,to) {assert.equal(source.split(from).length,2,'one exact mutation anchor');return source.replace(from,to);}
function losesRefusal(probe) {assert.throws(probe,e=>e.code==='ERR_ASSERTION'&&/^Missing expected exception/.test(e.message));}
test('mutation: forcing core paths to Git-only loses the actual core reader refusal',()=>{
  const f=fixture(mutated("return /^rebuild\\/(?:engine|conform|m4)(?:\\/|$)/.test(file) ? 'disk-head' : 'sourcebase-git';","return 'sourcebase-git';"));
  f.write(core[0],'changed core\n');f.commit();
  losesRefusal(()=>assert.throws(()=>f.api.held(f.s,core[0],f.expected,'PARENT-PIN-BROKEN','ci'),/PARENT-PIN-BROKEN/));
});
test('mutation: accepting actual disk instead of sourceBase loses the wrong-base refusal',()=>{
  const f=fixture(mutated("assert.equal(gitSha(s.sourceBase, file), hash, code + '-AT-SOURCEBASE ' + file);\n  if (strict)","assert.equal(diskSha(file), hash, code + '-AT-SOURCEBASE ' + file);\n  if (strict)"));
  f.write(outside,'wrong source base\n');f.s.sourceBase=f.commit();f.write(outside,'export const evidence = "base";\n');f.commit();
  losesRefusal(()=>assert.throws(()=>f.api.held(f.s,outside,f.expected,'PARENT-PIN-BROKEN','ci'),/AT-SOURCEBASE/));
});
test('mutation: omitting terminal verification loses the after-entry drift refusal',()=>{
  const f=fixture(mutated('const entries = unchangedGitPins(s, bound);','const entries = unchangedGitPins(s, bound); if (phase === "full-terminal") return entries;'));
  f.s.product[outside]={pre:f.expected,post:f.expected,role:'pinned-unchanged'};
  f.api.envelope(f.s,null,undefined,'full-entry');f.write(outside,'changed after entry\n');
  losesRefusal(()=>assert.throws(()=>f.api.envelope(f.s,null,new Map(),'full-terminal'),/GIT-BOUND-PIN-DISK/));
});
test('mutation: omitting HEAD equality loses the independent full-terminal refusal',()=>{
  const f=fixture(mutated("assert.equal(gitSha('HEAD', file), hash, 'GIT-BOUND-PIN-HEAD ' + phase + ' ' + file);",'/* mutation: no HEAD proof */'));
  f.s.product[outside]={pre:f.expected,post:f.expected,role:'pinned-unchanged'};
  f.write(outside,'changed committed bytes\n');f.commit();f.write(outside,'export const evidence = "base";\n');
  losesRefusal(()=>assert.throws(()=>f.api.envelope(f.s,null,new Map(),'full-terminal'),/GIT-BOUND-PIN-HEAD/));
});
test('mutation: bypassing current runner identity loses the actual fidelity refusal',()=>{
  const from="  assert.equal(diskSha(RUNNER), s.tooling.runnerSha256, 'RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER');\n  assert.equal(gitSha('HEAD', RUNNER), s.tooling.runnerSha256, 'RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER-IN-GIT');\n  if (sealed)";
  const code=mutated(from,'  /* mutation: bypass both runner identity checks */\n  if (sealed)'),f=fixture(code);
  f.commit();f.s.children=[];f.s.tooling={runnerSha256:sha(code)};f.api.fidelity(f.s,null);
  f.write(runnerPath,code+'\n// unreviewed\n');
  losesRefusal(()=>assert.throws(()=>f.api.fidelity(f.s,null),/RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER/));
});
