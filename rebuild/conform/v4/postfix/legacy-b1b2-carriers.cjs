'use strict';
// Public construction carrier only. Original witnesses and historical carriers
// stay byte-identical. Compose their reviewed expectation tables once; D12 once.
// No FULL/private route or acceptance receipt is implemented by this program.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),Module=require('node:module'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const H=require('../../../engine/test/b1b2-public-engine.cjs');
const PINS=Object.freeze({
 'defect-witnesses':'557c12e72690c39733369a09dba920055ffa6fbbb8b4508d6307fbdc66294644',
 'defect-witnesses-2':'833db0431e656f862636ab96383c64b8e52f4cbaf94e28da14c1bae52115aaf2',
 'defect-witnesses-3':'f5169bebd527ac13c8a570859bb5d728535a2a71734e135904a77be36c8506e6',
 'defect-witnesses-4':'c90ffeaa953a9b04146432f39702f87fc8c51ce7f0be77876f075fc4142b87f7'
});
// Extract only the public literal tables, never import the historical runner's
// broad helper dependency closure or execute its entry point. The source heads
// are the accepted historical candidates, not claims of present acceptance.
function tables(){
 const b1=fs.readFileSync(path.join(__dirname,'legacy-b1-carriers.cjs'),'utf8');
 const b2=fs.readFileSync(path.join(root,'rebuild/m4/spec/b2-inherited-carriers.cjs'),'utf8');
 const one=b1.slice(b1.indexOf('const EXPECTATIONS ='),b1.indexOf('\n// ---------------------------------------------------------------------------\nlet activeContext'));
 const two=b2.slice(b2.indexOf('const W1 ='),b2.indexOf('\n// Expected post-B2 tail'));
 assert.ok(one.startsWith('const EXPECTATIONS ='));assert.ok(two.startsWith('const W1 ='));
 assert.doesNotMatch(one+two,/\brequire\s*\(|process\.|readFile|import\s*\(/);
 return {b1:vm.runInNewContext(one+';EXPECTATIONS',Object.create(null)),b2:vm.runInNewContext('const DASH="—";'+two+';SUCCESSORS',Object.create(null))};
}
function exact(source,before,after,site,edits){assert.equal(source.split(before).length-1,1,'one exact expectation site: '+site);assert.ok(!edits.some(e=>e.site===site),'duplicate substitution '+site);edits.push({site,beforeSha256:sha(before),afterSha256:sha(after),occurrences:1});return source.replace(before,after);}
function prepareCarrier(id,bytes){
 assert.ok(Object.hasOwn(PINS,id),'B1B2 unknown witness');assert.equal(sha(bytes),PINS[id],'original witness pin');
 let source=bytes.toString('utf8');const edits=[],t=tables();
 if(id==='defect-witnesses-2'){
  source=exact(source,'assert.equal(step.slopePer1k, 100);','assert.equal(step.slopePer1k, 0.1);','D12-slope',edits);
  source=exact(source,'assert.equal(step.resolved, false);','assert.equal(step.resolved, true);','D12-resolved',edits);
 }
 for(const [before,after,site]of t.b1[id]||[])source=exact(source,before,after,site,edits);
 for(const [site,before,after]of t.b2[id]||[])source=exact(source,before,after,site,edits);
 return {source,edits,sourceHash:sha(bytes),carrierHash:sha(source)};
}
function runPublic(){
 H.inspectClosure();const results=[];
 for(const id of Object.keys(PINS)){
  const file=path.join(root,'rebuild/engine/test',id+'.cjs'),bytes=fs.readFileSync(file),p=prepareCarrier(id,bytes),output=[];
  const m=new Module(file);m.filename=file;
  m.require=request=>{
   if(request==='node:assert/strict')return assert;
   if(request==='../index.cjs')return H;
   if(request==='../policy.cjs')return require('../../../engine/policy.cjs');
   throw Error('B1B2 denied before load: '+request);
  };
  // A local log sink is the only presentation injection. All engine calls use
  // the real current public module assembly and the one invented seed fixture.
  m.__capture=(...args)=>output.push(args.map(String).join(' '));
  m._compile('const console={log:(...a)=>module.__capture(...a)};\n'+p.source,file);
  const expected={'defect-witnesses':10,'defect-witnesses-2':11,'defect-witnesses-3':5,'defect-witnesses-4':5}[id];
  assert.equal(output.filter(x=>x.startsWith('REPRODUCED ')).length,expected);
  assert.match(output.at(-1),new RegExp(expected+'/'+expected));assert.deepEqual(fs.readFileSync(file),bytes);
  results.push({id,cases:expected,edits:p.edits,tail:output.at(-1)});
 }
 assert.equal(results.flatMap(r=>r.edits).filter(e=>e.site.startsWith('D12-')).length,2);
 return results;
}
module.exports={PINS,prepareCarrier,runPublic};
if(require.main===module){process.env.TZ='America/New_York';const r=runPublic();console.log('B1B2 PUBLIC CARRIERS: '+r.length+'/4; '+r.reduce((n,x)=>n+x.cases,0)+' cases; '+r.reduce((n,x)=>n+x.edits.length,0)+' substitutions; original bytes retained');}
