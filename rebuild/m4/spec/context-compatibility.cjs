'use strict';
// Synthetic compatibility evidence only. No classification policy is selected.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{createHash}=require('node:crypto'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../../..'),w6=path.resolve(process.argv[2]||'');
if(!process.argv[2])throw Error('Provide retained W6 root');
const F=require('../../m3/w7-preview/fixtures.cjs'),{createEngine}=require('../../engine/index.cjs'),Ops=require('../../client/ops.cjs'),Validate=require('../../authority/validate.cjs');
const day='2026-09-09',engineFor=({day,hour})=>createEngine({clock:{today:()=>day,nowISO:()=>day+'T12:00:00.000Z',hour:()=>hour},ids:{fresh:p=>p+'synthetic-context'}});
const E=engineFor({day,hour:8}),base=F.createSyntheticState(day),original=structuredClone(base),days=['2026-09-03','2026-09-04','2026-09-05','2026-09-06','2026-09-07'];
const checks=[];
function check(name,action){action();checks.push(name);}
const dated=structuredClone(base);dated.events=[{id:'synthetic-event',d:'2026-09-04',t:'SYNTHETIC event',estimated:false}];
check('Legacy dated event has pre-day context and three hard days',()=>assert.deepEqual(days.map(d=>{const v=E.dayWeather(dated,d);return {d,hard:v.hard,event:v.flags.some(f=>f.k==='event')};}),
 days.map((d,i)=>({d,hard:i>=1&&i<=3,event:i<=3}))));
check('Rate ignores an actual legacy hard-event classification',()=>{
 assert.equal(E.dayWeather(dated,'2026-09-04').hard,true);
 assert.deepEqual(E.currentRate(dated),E.currentRate(base));
});
check('Observed intake/rate maintenance ignores that same classification',()=>{assert(E.observedTDEE(base));assert.deepEqual(E.observedTDEE(dated),E.observedTDEE(base));});
const illness=structuredClone(base);illness.dayCtx={'2026-09-08':{illness:true}};
check('Legacy illness context is recorded without a hard exclusion',()=>{const v=E.dayWeather(illness,'2026-09-08');assert(v.flags.some(f=>f.k==='illness'));assert.equal(v.hard,false);assert.equal(v.hardSession,false);});
const sleep=structuredClone(base);sleep.sleep.nights.at(-1).h=3;
check('Actual sleep reader changes when an existing night changes',()=>{assert.equal(E.cleanAtDate(base,day),true);assert.equal(E.cleanAtDate(sleep,day),false);assert.notDeepEqual(E.recoveryIndex(base),E.recoveryIndex(sleep));});
const missing=structuredClone(base);missing.sleep.nights=[];
check('Missing legacy sleep is not a proven good night',()=>{assert.equal(E.cleanAtDate(missing,day),true);assert.equal(missing.sleep.nights.length,0);});
const event=(type,id)=>Ops.build({op_id:id,athlete_id:'first',device_id:'remote',device_seq:1,parents:[],kind:'fact',class:'event',lease_id:'synthetic-context-lease',
 effective:{local_date:'2026-09-04',local_time:'08:00',utc_offset:'-04:00'},payload:{type,interval:{start:'2026-09-04',end:'2026-09-04'}}},'synthetic-context-identity');
const native=event('NO_EXERCISE_ATTESTATION','synthetic-no-exercise');
check('Native typed event is shape-valid but carries no legacy dated-event meaning',()=>{
 assert(Validate.validShape(native));const raw=structuredClone(base);raw.events=[native.payload];assert.throws(()=>E.dayWeather(raw,'2026-09-04'),TypeError);
 const guessed=structuredClone(base);guessed.events=[{d:native.payload.interval.start,t:native.payload.type}];assert.equal(E.dayWeather(guessed,'2026-09-06').hard,true);
 // Direct raw use throws; the invented date projection invents an exclusion.
 // Neither establishes the ratified type/interval interpretation.
});
(async()=>{
 const {parseStrictJson}=await import(pathToFileURL(path.join(w6,'rebuild/m3/w6/strict-json.mjs'))),{createReadingProjector}=await import(pathToFileURL(path.join(w6,'rebuild/m3/w6/reading-history.mjs')));
 const source=Buffer.from(JSON.stringify(base)),prep=require('../import/prepare.cjs').createImportPreparation({engine:E,parseStrictJson}).prepare(source,{localBytes:source});
 const empty={collections:{ops:{},dispositions:{},receipts:{},outbox:{},rejected:{},sync:{frontier:{W:0,authorityW:0}}},metadata:{}};
 const producer=require('../import/reading-replay.cjs').createReadingReplay({engineFor,projectReadings:createReadingProjector({athleteId:'first',deviceId:'local'}),parseStrictJson,
  producerIdentity:'synthetic-actual-installed-context',importBuild:'synthetic-context',deviceId:'local'});
 const material={source_json:source.toString(),candidate_json:prep.candidateBytes().toString(),local_json:source.toString(),checkpoint_json:JSON.stringify({revision:1,token:'synthetic',generation:empty}),engine_context_json:JSON.stringify({build:'synthetic-context',clock:day})};
 const g=structuredClone(empty);g.collections.ops[native.op_id]=native;g.collections.dispositions[native.op_id]={op_id:native.op_id,status:'ACCEPTED',athlete_log_seq:1,canonical_content_commitment:native.canonical_content_commitment};
 g.collections.receipts['1']={seq:1,op_id:native.op_id,canonical_content_commitment:native.canonical_content_commitment};g.collections.sync.frontier={W:1,authorityW:1};
 check('Current source producer refuses unsupported typed context rather than inventing eligibility',()=>{
  const v=producer.project({sourceId:'synthetic-context-source',material,generation:g,asOf:day});
  assert.equal(v.ready,false);assert.equal(v.accepted_calculation,null);assert(v.issues.some(i=>i.code==='ACCEPTED_ENGINE_CONTEXT_UNMAPPED'&&i.op_id===native.op_id));
  assert.equal(v.qualified,false);assert.equal(v.activated,false);assert.deepEqual(g.collections.ops[native.op_id],native);
 });
 check('Source fixture remains unchanged',()=>assert.deepEqual(base,original));
 const sha=x=>createHash('sha256').update(x).digest('hex'),pins={};
 for(const name of fs.readdirSync(path.join(root,'rebuild/engine')).filter(n=>n.endsWith('.cjs')))pins['rebuild/engine/'+name]=sha(fs.readFileSync(path.join(root,'rebuild/engine',name)));
 for(const name of ['rebuild/m4/import/reading-replay.cjs','rebuild/m4/import/daily-history.cjs','rebuild/m4/import/prepare.cjs','rebuild/m3/w7-preview/fixtures.cjs','rebuild/m4/spec/context-compatibility.cjs'])pins[name]=sha(fs.readFileSync(path.join(root,name)));
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'earned-context-boundary-'));
 const evidence={profile:'earned/context-compatibility/v1',kind:'synthetic actual-reader compatibility, not policy qualification',passed:checks.length,checks,pins,
  findings:{legacyEventWindow:'pre-day context; event day plus two hard days',rateAndMaintenance:'legacy event classification not consumed',illness:'interpretation-only legacy flag',sleep:'actual values affect readers; absent data returns cleanAtDate true',nativeTypedEvent:'requires qualified type/interval interpretation; shape alone insufficient'},
  qualified:false,activated:false};
 fs.writeFileSync(path.join(dir,'evidence.json'),JSON.stringify(evidence,null,2)+'\n');console.log('CONTEXT COMPATIBILITY '+checks.length+' CHECKS PASS '+dir);
})().catch(e=>{console.error(e.code||e.message);process.exitCode=1;});
