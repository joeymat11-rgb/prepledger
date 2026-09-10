'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const {createHash}=require('node:crypto'),{execFileSync}=require('node:child_process');
const H=require('./r1-population-diagnostic.cjs');
const sha=b=>createHash('sha256').update(b).digest('hex');
const parent=path.resolve(__dirname,'../.generated');
function scratch(t){fs.mkdirSync(parent,{recursive:true});const p=fs.mkdtempSync(path.join(parent,'population-helper-'));t.after(()=>{assert(path.resolve(p).startsWith(parent+path.sep));fs.rmSync(p,{recursive:true,force:true});});return p;}
function fixture(t){
  const temp=scratch(t),repository=path.join(temp,'repo'),productDir=path.join(repository,'rebuild/m3/w5'),helperFile=path.join(productDir,'test/r1-population-diagnostic.cjs');
  fs.mkdirSync(repository,{recursive:true});
  for(const file of H.SOURCE_FILES){const dest=path.join(productDir,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,'synthetic source '+file+'\n');}
  fs.writeFileSync(helperFile,'synthetic diagnostic helper\n');
  fs.mkdirSync(path.join(repository,'rebuild/authority'),{recursive:true});fs.writeFileSync(path.join(repository,'rebuild/authority/index.cjs'),'synthetic authority\n');
  const git=args=>execFileSync('git',args,{cwd:repository,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git(['init','--quiet']);git(['config','user.name','Synthetic Test']);git(['config','user.email','synthetic@example.invalid']);git(['config','core.autocrlf','false']);git(['add','.']);git(['commit','--quiet','-m','synthetic source fixture']);
  const receiptPath=path.join(temp,'caller-receipt.json'),r={format:'earned/r1-population-source-pins/v1',head:git(['rev-parse','HEAD']),helperSha256:sha(fs.readFileSync(helperFile)),sourcePins:H.sourcePins(productDir)};
  const write=value=>fs.writeFileSync(receiptPath,JSON.stringify(value));write(r);
  return {repository,productDir,helperFile,receiptPath,r,write,git};
}
test('fresh checkout creates nested evidence directory before inventory',t=>{const p=path.join(scratch(t),'missing','generated');assert.deepEqual(H.prepareEvidenceDirectory(p,'fresh'),[]);assert(fs.statSync(p).isDirectory());});
test('new run preserves old evidence and refuses overwriting any current arm',t=>{
  const p=scratch(t),old=new Map([['r1-resource-old.json','{"old":true}\n'],['r1-population-diagnostic-A.json','{"original":true}\n']]);
  for(const [name,value]of old)fs.writeFileSync(path.join(p,name),value);
  assert.deepEqual(H.prepareEvidenceDirectory(p,'new').map(x=>x.name),[...old.keys()].sort());
  for(const [name,value]of old)assert.equal(fs.readFileSync(path.join(p,name),'utf8'),value);
  const current=path.join(p,'r1-population-diagnostic-new-B.json');fs.writeFileSync(current,'retain exactly');
  assert.throws(()=>H.prepareEvidenceDirectory(p,'new'),/preserve prior/);assert.equal(fs.readFileSync(current,'utf8'),'retain exactly');
  assert.throws(()=>H.prepareEvidenceDirectory(p,'../escape'),/safe diagnostic/);
});
test('file in place of evidence directory fails without deleting or overwriting it',t=>{const p=path.join(scratch(t),'blocked');fs.writeFileSync(p,'keep');assert.throws(()=>H.prepareEvidenceDirectory(p,'new'));assert.equal(fs.readFileSync(p,'utf8'),'keep');});
test('documented individual-string bound uses UTF8 bytes and preserves historical fixture size',()=>{
  assert.equal(H.D1_STRING_BYTES,2000000);H.assertStringSize(' '.repeat(1357356));H.assertStringSize('\u00e9'.repeat(1000000));
  assert.throws(()=>H.assertStringSize('\u00e9'.repeat(1000000)+'x'),/2,000,000-byte/);assert.throws(()=>H.assertStringSize(' '.repeat(2097151)),/2,000,000-byte/);
});
test('caller receipt validates exact HEAD, helper and ordered source bytes',t=>{const f=fixture(t),v=H.validateSources(f);assert.equal(v.base,f.r.head);assert.equal(v.sourceMode,'explicit-candidate-receipt');assert.deepEqual(v.sourcePins,f.r.sourcePins);assert.equal(v.receiptSha256,sha(fs.readFileSync(f.receiptPath)));});
test('missing, extra, stale and reordered receipts fail closed',t=>{
  const f=fixture(t);assert.throws(()=>H.validateSources({...f,receiptPath:path.join(path.dirname(f.receiptPath),'absent.json')}));
  for(const change of [r=>({...r,head:'0'.repeat(40)}),r=>({...r,helperSha256:'0'.repeat(64)}),r=>({...r,sourcePins:r.sourcePins.slice().reverse()}),r=>({...r,extra:true})]){f.write(change(f.r));assert.throws(()=>H.validateSources(f));}
  f.write(f.r);const file=path.join(f.productDir,H.SOURCE_FILES[0]);fs.appendFileSync(file,'changed');assert.throws(()=>H.validateSources(f),/source byte pins/);
});
test('HEAD must also cover clean authority dependencies and no untracked W5 source',t=>{
  const f=fixture(t),authority=path.join(f.repository,'rebuild/authority/index.cjs'),before=fs.readFileSync(authority);fs.appendFileSync(authority,'changed');assert.throws(()=>H.validateSources(f));fs.writeFileSync(authority,before);
  fs.writeFileSync(path.join(f.productDir,'unexpected.cjs'),'untracked');assert.throws(()=>H.validateSources(f),/untracked authority/);
});
test('invalid setup neither loads product inputs nor spawns a workload',async t=>{
  const file=require.resolve('./r1-population-diagnostic.cjs'),m=new Module(file,module);m.filename=file;m.paths=module.paths;
  let spawned=0,loaded=0;const base=m.require.bind(m);m.require=name=>{
    if(name==='node:child_process')return {...require(name),spawn(){spawned++;throw Error('workload must not start');}};
    if(name.startsWith('../reconciliation/')||name==='./r1-resource-fixture.cjs'){loaded++;throw Error('inputs must not load');}
    return base(name);
  };
  m._compile(fs.readFileSync(file,'utf8'),file);
  await assert.rejects(m.exports.run({receiptPath:path.join(scratch(t),'absent.json'),runId:'never-start'}));assert.equal(loaded,0);assert.equal(spawned,0);
});
test('candidate CLI requires both explicit receipt and a distinct safe output id',()=>{
  assert.deepEqual(H.parseArgs([]),{arm:null,options:{receiptPath:null,runId:null}});
  const receipt=path.resolve('synthetic-receipt.json');assert.deepEqual(H.parseArgs(['--source-pins',receipt,'--run-id','candidate-1']).options,{receiptPath:receipt,runId:'candidate-1'});
  for(const argv of [['--run-id','x'],['--source-pins',receipt],['--source-pins','relative.json','--run-id','x'],['--unknown','x'],['--run-id','x','--run-id','y']])assert.throws(()=>H.parseArgs(argv));
});
