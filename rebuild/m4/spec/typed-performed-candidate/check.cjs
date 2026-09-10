'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),Module=require('node:module'),assert=require('node:assert/strict');
const S=require('../performed-proposal/source.cjs'),build=require('./construct.cjs');
const root=process.env.EARNED_CONFIGURED_HISTORY;assert(root,'Existing exact configured-history composition required');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'configured-history-sources.json')));
for(const [file,pin]of Object.entries(manifest.candidatePins))assert.equal(S.sha(fs.readFileSync(path.join(root,file))),pin,file);
const actualFactory=fs.readFileSync(path.resolve(__dirname,'../performed-proposal/factory.cjs'),'utf8');assert.equal(S.sha(actualFactory),'0a03c9e541e22d2617993fb4f5bb43f4ed0126c51defddf391da36e491511b75');
assert.equal(S.sha(fs.readFileSync(require.resolve('../performed-proposal/source.cjs'))),'3050f2f493b16d97b7f09a8b8f0b0772c122fbf1ad89e79a94f7ae6434115eb5');
const baseline=S.baseline(),previous=S.construct(baseline),next=build(actualFactory,previous.sources['rebuild/engine/progression.cjs']);
const entered=fs.readFileSync(path.resolve(__dirname,'../configured-load-candidate/entered-load.cjs'),'utf8');assert.equal(S.sha(entered),'2a0cd97ec843924e6dc428f2dbb0fe3c5bf10335610a3315c205c84fc324a3a3');
const sources={...previous.sources,'rebuild/engine/performed.cjs':next.factory,'rebuild/engine/progression.cjs':next.progression,'rebuild/engine/entered-load.cjs':entered};
const output=fs.mkdtempSync(path.join(os.tmpdir(),'earned-typed-performed-'));
for(const [file,text]of Object.entries(sources)){const dest=path.join(output,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,text);}
const fixtureFile=path.resolve(__dirname,'../configured-history-candidate/test.cjs'),fixtureSource=fs.readFileSync(fixtureFile,'utf8'),end=fixtureSource.indexOf("test('actual encrypted reopen");assert(end>0);
const m=new Module(fixtureFile,module);m.filename=fixtureFile;m.paths=Module._nodeModulePaths(path.dirname(fixtureFile));m._compile(fixtureSource.slice(0,end)+'\nmodule.exports={fixture,Adapter};',fixtureFile);
const {fixture,Adapter}=m.exports,F=require('../../../m3/w7-preview/fixtures.cjs');
const clock={today:()=>F.SYNTHETIC_DAY,nowMs:()=>Date.parse(F.SYNTHETIC_DAY+'T12:00:00Z'),nowISO:()=>F.SYNTHETIC_DAY+'T12:00:00.000Z',hour:()=>12,dow:()=>1};
const engine=map=>S.load(map)('rebuild/m3/w7-preview/browser-engine.cjs').createBrowserEngine({clock}),E=engine(sources),Old=engine(previous.sources);
const pounds=value=>({value,unit:'lb'}),config=key=>({kind:'configuration',configuration_key:key}),results=[];
async function check(name,fn){await fn();results.push(name);console.log('PASS '+name);}
async function main(){
 await check('actual stored configured facts retain full history, target/original/current fields and effort APIs',async()=>{
  const f=await fixture();try{const facts=await f.map(),entry=facts.sessions[0].record.entries[0],before=JSON.stringify(facts);
   assert.equal(E.performedEntry(entry),entry);assert.equal(E.performedHistoryMembers({sessionLog:{},workoutFacts:facts}).length,1);
   const slots=E.performedTypedSlots(entry);assert.deepEqual(slots,entry.slots);slots[0].fact.current.load.configuration_key='different';assert.equal(JSON.stringify(facts),before);
   assert.deepEqual(E.rirSetsOf(entry),Array(3).fill({tag:'at_least',value:3,unit:'rep'}));assert.equal(E.rirReceipt(entry),'RIR at least 3→at least 3');
   assert.equal(E.performedLoadText(entry.slots[0].fact.current.load),'BW+band');
   assert.throws(()=>Old.performedEntry(entry),{code:'PERFORMED_ENTRY_INVALID'});
  }finally{f.close();}
 });
 await check('configured and mixed inputs explicitly refuse numeric score/values and actual volume null-filter consumer',async()=>{
  for(const values of [[config('BW'),config('hold'),config('cafe\u0301')],[config('BW'),pounds(20),pounds(15)]]){
   const f=await fixture({values});try{const entry=(await f.map()).sessions[0].record.entries[0],before=JSON.stringify(entry);
    for(const read of [()=>E.performedValues(entry),()=>E.sessionScore(entry),()=>E._blockSlope([{en:entry},{en:entry},{en:entry}])])
     assert.throws(read,error=>error.code==='PERFORMED_NUMERIC_LOAD_UNAVAILABLE'&&error.reason==='configuration_has_no_numeric_magnitude'&&error.source_op_ids.includes(f.ids[0]));
    assert.equal(JSON.stringify(entry),before);assert.equal(E.performedTypedSlots(entry).length,3);
   }finally{f.close();}
  }
 });
 await check('actual v1 and typed numeric records keep equivalent scalar and effort outputs without rejecting v2',async()=>{
  for(const profile of [Adapter.PROFILE,Adapter.CONFIGURATION_PROFILE]){
   const f=await fixture({profile,targets:[pounds(30),pounds(25),pounds(20)],values:[pounds(30),pounds(25),pounds(20)]});
   try{const entry=(await f.map()).sessions[0].record.entries[0],legacy=structuredClone(entry);legacy.profile='earned/performed-lift/v1';
    const read=(X,value)=>({score:X.sessionScore(value),rir:X.rirSetsOf(value),receipt:X.rirReceipt(value),values:X.performedValues(value)});
    assert.deepEqual(read(E,entry),read(Old,legacy));assert.equal(E.performedValues(entry).length,3);
   }finally{f.close();}
  }
 });
 await check('new reader rejects missing/malformed targets and original/current load corruption',async()=>{
  const f=await fixture();try{const original=(await f.map()).sessions[0].record.entries[0];
   for(const change of [x=>delete x.slots[0].prescribed_load,x=>x.slots[0].prescribed_load={state:'unknown'},
    x=>x.slots[0].prescribed_load={state:'specified',source:{...config('BW'),unit:'lb'}},
    x=>x.slots[0].fact.original.load={value:0,unit:'lb'},x=>x.slots[0].fact.current.load={kind:'configuration',configuration_key:' '}]){
    const entry=structuredClone(original);change(entry);assert.throws(()=>E.performedEntry(entry),{code:'PERFORMED_ENTRY_INVALID'});
   }
  }finally{f.close();}
 });
 await check('configured equality never grants same-load comparability or becomes silently excluded numeric evidence',async()=>{
  const f=await fixture();try{const a=(await f.map()).sessions[0].record.entries[0],b=structuredClone(a);b.start_op_id='explicit-isolated-pair-second-start';
   // The second identity is a comparison-boundary probe, not another stored workout.
   assert.throws(()=>E.performedPair(a,b),{code:'PERFORMED_NUMERIC_LOAD_UNAVAILABLE'});
   assert.equal(E.performedLoadText(config(' caf\u00e9 ')),' caf\u00e9 ');assert.equal(E.performedLoadText(config(' cafe\u0301 ')),' cafe\u0301 ');
  }finally{f.close();}
 });
}
main().then(()=>{
 for(const [file,pin]of Object.entries(manifest.candidatePins))assert.equal(S.sha(fs.readFileSync(path.join(root,file))),pin,file);
 const restored=S.baseline();assert.deepEqual(restored,baseline);assert.equal(fs.readFileSync(path.resolve(__dirname,'../performed-proposal/factory.cjs'),'utf8'),actualFactory);
 const evidence={runtime:process.version,historyRoot:root,historyManifest:S.sha(fs.readFileSync(path.join(root,'configured-history-sources.json'))),factoryOriginal:S.sha(actualFactory),factoryCandidate:S.sha(next.factory),progressionCandidate:S.sha(next.progression),enteredLoad:S.sha(entered),sources:Object.fromEntries(Object.entries(sources).map(([f,s])=>[f,S.sha(s)])),results,limits:['actual fake-indexeddb/unissued fixture','full schema/issuer/UI/science not enabled','numeric consumers refuse unsupported magnitude; no configuration comparability policy','liftTrend/progressionTrend still need actual native-history enumeration mapping']};
 fs.writeFileSync(path.join(output,'EVIDENCE.json'),JSON.stringify(evidence,null,2)+'\n');console.log('TYPED PERFORMED EVIDENCE '+output);
}).catch(error=>{console.error(error);console.log('TYPED PERFORMED FAILED SCRATCH '+output);process.exitCode=1;});
