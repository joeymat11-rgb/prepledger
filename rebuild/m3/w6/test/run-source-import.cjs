'use strict';
// Compose CURRENT public R1 + W6 bytes explicitly, separate from the preserved
// old pinned recovery/current-head runners. No private source or install.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),{createHash}=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),r1=path.resolve(process.argv[2]||''),m4=path.resolve(process.argv[3]||'');
if(!process.argv[2]||!process.argv[3])throw Error('Provide retained R1 and M4 worktrees');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'earned-source-recovery-')),pins={};
function copy(base,name){
  const source=path.join(base,name);for(const entry of fs.readdirSync(source,{withFileTypes:true})){
    if(['node_modules','.tmp','.generated','private','engines'].includes(entry.name))continue;
    const relative=path.join(name,entry.name),target=path.join(dir,relative);
    if(entry.isDirectory()){fs.mkdirSync(target,{recursive:true});copy(base,relative);}
    else if(entry.isFile()){const bytes=fs.readFileSync(path.join(base,relative));fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);
      pins[relative.replaceAll('\\','/')]={root:base,sha256:createHash('sha256').update(bytes).digest('hex')};}
  }
}
for(const name of ['rebuild/authority','rebuild/client','rebuild/m4/workout','rebuild/m3/w5','rebuild/m3/rigs','rebuild/conform/lib'])copy(r1,name);
for(const name of ['rebuild/client','rebuild/m4/workout','rebuild/m3/w6'])copy(root,name);
for(const [base,name]of [[r1,'rebuild/m3/w5/node_modules'],[root,'rebuild/m3/w6/node_modules']])
  fs.symlinkSync(path.join(base,name),path.join(dir,name),process.platform==='win32'?'junction':'dir');
// Record consumed M4 sources without copying the seeded engine into this public
// composition or into a browser bundle. These are code pins, not fixture data.
const externalPins={};
for(const name of ['index','dates','constants','seed','plan','progression','sleep','energy','policy','today','volume','migrate','earn','merge','writers'].map(n=>'rebuild/engine/'+n+'.cjs')
  .concat(['rebuild/m4/import/prepare.cjs','rebuild/m3/w7-preview/fixtures.cjs'],process.argv.includes('--browser')?[]:['rebuild/m4/import/reading-replay.cjs','rebuild/m4/import/daily-history.cjs','rebuild/m4/workout/engine-order.cjs','rebuild/m4/workout/engine-capture.cjs','rebuild/m4/spec/performed-proposal/factory.cjs']))
  externalPins[name]=createHash('sha256').update(fs.readFileSync(path.join(m4,name))).digest('hex');
function verifyExternal(){for(const [name,pin]of Object.entries(externalPins))assert.equal(createHash('sha256').update(fs.readFileSync(path.join(m4,name))).digest('hex'),pin,'M4 source changed during execution '+name);}
fs.writeFileSync(path.join(dir,'source-manifest.json'),JSON.stringify({r1Root:r1,w6Root:root,m4Root:m4,pins,externalPins},null,2));
if(process.argv.includes('--browser')){
  assert(!process.argv.includes('--faults'),'Browser and fault runs are separate');
  const result=cp.spawnSync(process.execPath,[path.join(dir,'rebuild/m3/w6/test/recovery-stage/source-import-browser.mjs')],
    {cwd:dir,env:{...process.env,EARNED_ROWS_R1_ROOT:dir,EARNED_IMPORT_M4_ROOT:m4},encoding:'utf8',windowsHide:true,timeout:300000,maxBuffer:8*1024*1024});
  fs.writeFileSync(path.join(dir,'browser.log'),(result.stdout||'')+(result.stderr||''));process.stdout.write(result.stdout||'');if(result.stderr)process.stderr.write(result.stderr);
  verifyExternal();console.log('SOURCE BROWSER COMPOSITION '+dir);process.exit(result.status??1);
}
const w6Test='rebuild/m3/w6/test/recovery-stage/source-import.test.mjs',r1Test='rebuild/m3/w5/test/source-import.test.cjs';
function execute(name,test=w6Test,pattern){
  const result=cp.spawnSync(process.execPath,['--test','--test-reporter=tap',...(pattern?['--test-name-pattern',pattern]:[]),path.join(dir,test)],
    {cwd:dir,env:{...process.env,EARNED_ROWS_R1_ROOT:dir,EARNED_IMPORT_M4_ROOT:m4},encoding:'utf8',windowsHide:true,timeout:300000,maxBuffer:8*1024*1024});
  fs.writeFileSync(path.join(dir,name+'.log'),(result.stdout||'')+(result.stderr||''));return result;
}
const result=execute('test');process.stdout.write(result.stdout||'');if(result.stderr)process.stderr.write(result.stderr);
verifyExternal();
console.log('SOURCE RECOVERY COMPOSITION '+dir);process.exitCode=result.status??1;
if(process.argv.includes('--faults')){
  assert.equal(result.status,0,'Joined baseline must pass; '+dir);
  const r1Baseline=execute('indexed-baseline',r1Test,'indexed source recovery');assert.equal(r1Baseline.status,0,'Indexed baseline must pass; '+dir);
  const sha=bytes=>createHash('sha256').update(bytes).digest('hex'),evidence={profile:'earned/source-recovery-faults/v1',directory:dir,faults:[]};
  const stage='rebuild/m3/w6/recovery-stage.mjs',codec='rebuild/m3/w5/source/codec.cjs';
  const faults=[
    ['v4-reads-v3-head',stage,"const HEAD=P.DOMAINS.manifest==='earned/r1/rows-v4/manifest'?[PROFILE,'head','rows-v4']:[PROFILE,'head'];","const HEAD=[PROFILE,'head'];",w6Test],
    ['protocol-refills-budget',stage,'const P=protocol,C=codec,verifier=',"const CONTROL=[PROFILE,'transport',protocol.DOMAINS.manifest];const P=protocol,C=codec,verifier=",w6Test],
    ['ignore-drained-prefix',codec,"check(same(pending.after,{W:seq,log_digest:prefix.digest(),selection_id:pending.intent_op_id}),'SOURCE_FRONTIER',500);",'/* faulty post-frontier bypass */',r1Test,'indexed source recovery'],
    ['ignore-component-digest',codec,"check(hash(k,C.bytes(value[k]))===m.component_digests[k],'SOURCE_COMPONENT_DIGEST');",'/* faulty component bypass */',r1Test,'indexed source recovery'],
  ];
  for(const [name,file,needle,replacement,test,pattern]of faults){
    const target=path.join(dir,file),original=fs.readFileSync(target),source=original.toString();
    assert.equal(source.split(needle).length,2,'Unique product mutation '+name);const mutated=source.replace(needle,replacement);let red;
    try{fs.writeFileSync(target,mutated);red=execute(name,test,pattern);}finally{fs.writeFileSync(target,original);}
    assert.equal(red.status,1,'Effective reached fault '+name+'; '+dir);assert.match(red.stdout,/code: 'ERR_ASSERTION'/,'Contract assertion, not loader failure');
    assert.match(red.stdout,/not ok /);evidence.faults.push({name,file,original_sha256:sha(original),mutant_sha256:sha(mutated),effective:true,log:name+'.log'});
    console.log('SOURCE RECOVERY FAULT RED '+name);
  }
  for(const [name,test,pattern]of [['joined-restored',w6Test],['indexed-restored',r1Test,'indexed source recovery']])
    assert.equal(execute(name,test,pattern).status,0,'Restored gate '+name+'; '+dir);
  for(const [name,pin]of Object.entries(pins)){
    assert.equal(sha(fs.readFileSync(path.join(dir,name))),pin.sha256,'Restored composition '+name);
    assert.equal(sha(fs.readFileSync(path.join(pin.root,name))),pin.sha256,'Product unchanged '+name);
  }
  evidence.restored_pass=true;fs.writeFileSync(path.join(dir,'fault-evidence.json'),JSON.stringify(evidence,null,2)+'\n');
  verifyExternal();
  console.log('SOURCE RECOVERY FAULTS RESTORED PASS '+dir);
}
