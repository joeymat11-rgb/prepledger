'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const crypto=require('node:crypto'),Module=require('node:module'),{spawnSync}=require('node:child_process');
if(!process.argv[2])throw Error('Pass the checkout at pinned R1 003c816 explicitly');
const root=path.resolve(process.argv[2]);
const out=process.argv[3]&&path.resolve(process.argv[3]);
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const git=args=>{const r=spawnSync('git',args,{cwd:root,windowsHide:true,maxBuffer:8e6});if(r.status)throw Error('git source unavailable');return r.stdout;};
const ref='003c816e695fce7e77e17665f25d8cdcc2435211';
const sourcePaths=git(['ls-tree','-r','--name-only',ref,'rebuild/authority','rebuild/client','rebuild/m3/w5']).toString().trim().split(/\r?\n/).filter(x=>x.endsWith('.cjs'));
const pins={};for(const file of sourcePaths){const bytes=git(['show',ref+':'+file]);assert.ok(fs.readFileSync(path.join(root,file)).equals(bytes),'SOURCE_PIN '+file);pins[file]=hash(bytes);}
const W5=path.join(root,'rebuild/m3/w5'), C=require(path.join(W5,'reconciliation/codec.cjs')),
 P=require(path.join(W5,'reconciliation/project.cjs')), K=require(path.join(W5,'crypto.cjs')),
 V=require(path.join(W5,'reconciliation/verify.cjs')),Shape=require(path.join(root,'rebuild/authority/validate.cjs'));
// Reuse only the tracked public fixture/packet definitions. No registered test,
// production guard or law is edited or substituted by this extraction.
const fixtureFile=path.join(W5,'test/r1-codec.test.cjs'), fixtureSource=fs.readFileSync(fixtureFile,'utf8');
const end=fixtureSource.indexOf("test('tagged SHA256");assert.ok(end>0);
const fxModule=new Module(fixtureFile,module);
fxModule.filename=fixtureFile;fxModule.paths=Module._nodeModulePaths(path.dirname(fixtureFile));
fxModule._compile(fixtureSource.slice(0,end)+'\nmodule.exports={fixture,packet};',fixtureFile);
const {fixture,packet}=fxModule.exports;
const link=require('./r1-history-reader.cjs').linkR1HistoryReader;
const create=link({codec:C,createR1Verifier:V.createR1Verifier,validShape:Shape.validShape});
const copy=structuredClone, results=[];
const options=f=>({keys:[K.publicKeyOf(f.key)],subtle:crypto.webcrypto.subtle,athleteId:f.athleteId,actorDeviceId:f.actorDeviceId});
const input=(f,p=packet(f))=>({manifest:p.mr,pages:p.pages,request:new Uint8Array(f.requestBytes),expected:copy(f.expected)});
function startFixture(){
 const f=fixture(), oldId=f.op.op_id;
 const op={...f.op,class:'session',kind:'session-start',payload:{slot:'AD_HOC'}};
 op.canonical_content_commitment=K.commitmentOf(op,'synthetic-identity');
 const d=K.signDisposition({...f.d,canonical_content_commitment:op.canonical_content_commitment},f.key);
 for(const row of f.rows){const x=JSON.parse(row.value);
   if(row.collection==='operations'&&row.row_id===oldId)row.value=JSON.stringify({...x,op,commitment:op.canonical_content_commitment,disposition:d},null,1);
   if(row.collection==='history')row.value=JSON.stringify(d);
   if(row.collection==='log')row.value=JSON.stringify({...x,op});
 }
 f.op=op;f.d=d;f.request.claims=[{claim_id:'query-a',envelope_b64:C.encode64(C.encode(op))}];
 f.requestBytes=C.encode(f.request);f.expected.requestDigest=C.hash('request',f.requestBytes);return f;
}
async function test(name,fn){await fn();results.push({name,status:'PASS'});console.log('PASS '+name);}
(async()=>{
 const f=startFixture(), original=input(f), originalHash=hash(Buffer.from(original.manifest));
 const reader=create(options(f)); let control;
 await test('ACTUAL-R1-SIGNED-PROJECTION-TO-LEGACY-HISTORY',async()=>{control=await reader.read(original);assert.equal(control.verified,true);assert.equal(control.history.through,1);assert.equal(control.history.starts.length,1);assert.equal(control.history.currency,'CAPTURED_PREFIX_ONLY');});
 await test('ABSENT-PLAN-BASIS-NEVER-INVENTED',()=>{assert.equal(control.decisionReady,false);assert.equal(control.history.starts[0].planBasis,null);assert.equal(control.history.starts[0].eligibility,null);assert.equal(control.history.starts[0].liveness,'NOT_FOLDED');assert.deepEqual(control.history.issues.map(x=>x.code),['MISSING_LEGACY_PLAN_BASIS','ELIGIBILITY_REDUCER_UNIMPLEMENTED']);});
 await test('EXACT-LOG-OPERATION-DISPOSITION-ROW-BYTES',()=>{const source=control.history.facts[0].source;for(const [name,collection]of [['logRow','log'],['operationRow','operations'],['dispositionRow','history']])assert.equal(C.text(C.decode64(source[name].value_b64)),f.rows.find(x=>x.collection===collection).value);assert.equal(hash(Buffer.from(control.history.source.manifestBytes)),originalHash);assert.deepEqual(control.history.facts[0].operation,copy(f.op));});
 await test('TAMPERED-PAGE-NO-HISTORY',async()=>{const x=input(f),p=C.parse(x.pages[0]);p.data_b64=p.data_b64.slice(0,-2)+'AA';x.pages[0]=C.encode(p);const r=await reader.read(x);assert.equal(r.verified,false);assert.equal(r.history,null);});
 await test('MISSING-PAGE-NO-HISTORY',async()=>{const x=input(f);x.pages=[];assert.equal((await reader.read(x)).verified,false);});
 await test('UNPINNED-SIGNER-NO-HISTORY',async()=>{const bad=create({...options(f),keys:[K.publicKeyOf(K.generateSigningKey('untrusted'))]});assert.equal((await bad.read(input(f))).history,null);});
 await test('WRONG-CHALLENGE-REFUSED',async()=>{const x=input(f);x.expected.nonce=C.encode64(new Uint8Array(32).fill(9));assert.equal((await reader.read(x)).verified,false);});
 await test('LOCAL-ATHLETE-AND-DEVICE-BINDINGS',async()=>{for(const k of ['athleteId','actorDeviceId']){const x=input(f);x.expected[k]='foreign-synthetic';const r=await reader.read(x);assert.equal(r.code,'LOCAL_SCOPE_MISMATCH');assert.equal(r.history,null);}});
 await test('SIGNED-OUTER-WITH-FORGED-INNER-DISPOSITION',async()=>{const g=startFixture();for(const row of g.rows){const x=JSON.parse(row.value);if(row.collection==='history'){x.authority_signature='forged';row.value=JSON.stringify(x);}if(row.collection==='operations'){x.disposition.authority_signature='forged';row.value=JSON.stringify(x);}}const r=await create(options(g)).read(input(g));assert.equal(r.verified,false);assert.equal(r.history,null);});
 await test('WAITING-AND-REJECTED-NEVER-ACCEPTED-FACTS',async()=>{for(const status of ['WAITING','REJECTED']){const g=fixture({status});const r=await create(options(g)).read(input(g));assert.equal(r.verified,true);assert.equal(r.history.facts.length,0);assert.equal(r.decisionReady,false);assert.ok(r.history.source.payloadBytes.length>0);}});
 await test('INPUT-MUTATION-DURING-ASYNC-VERIFICATION',async()=>{const x=input(f),capturedHash=hash(Buffer.from(x.manifest)),pending=reader.read(x);x.expected.athleteId='foreign';x.manifest.fill(0);x.pages[0].fill(0);x.request.fill(0);const r=await pending;assert.equal(r.verified,true);assert.equal(r.history.facts[0].operation.athlete_id,f.athleteId);assert.equal(hash(Buffer.from(r.history.source.manifestBytes)),capturedHash);});
 await test('OUTPUT-ALIAS-DOES-NOT-CHANGE-INPUT-OR-NEXT-READ',async()=>{control.history.facts[0].operation.payload.slot='changed';control.history.source.manifestBytes.fill(0);const r=await reader.read(input(f));assert.equal(r.history.starts[0].slot,'AD_HOC');assert.equal(r.history.facts[0].operation.payload.slot,'AD_HOC');});
 await test('EXACT-REPEATED-READ-HAS-NO-ISSUANCE-OR-STORAGE-EFFECT',async()=>{const x=input(f),a=await reader.read(x),b=await reader.read(x);assert.deepEqual(a,b);assert.equal(a.decisionReady,false);});
 await test('UNRELATED-READING-RETAINED-WITHOUT-START',async()=>{const g=fixture(),r=await create(options(g)).read(input(g));assert.equal(r.verified,true);assert.equal(r.history.facts.length,1);assert.equal(r.history.starts.length,0);assert.equal(r.decisionReady,false);});
 await test('MALFORMED-RAW-INPUT-REFUSES',async()=>{const r=await reader.read({manifest:null,pages:[],request:null,expected:null});assert.equal(r.verified,false);assert.equal(r.history,null);});
 await test('EFFECTIVE-INVENTED-NO-PLAN-FAULT',async()=>{const source=fs.readFileSync(path.join(__dirname,'r1-history-reader.cjs'),'utf8'),needle='planBasis:null';assert.equal(source.split(needle).length,2);const m={exports:{}};vm.runInNewContext(source.replace(needle,"planBasis:'NO_ACCEPTED_PLAN'"),{module:m,structuredClone,Uint8Array,Map,Date});const faulty=m.exports.linkR1HistoryReader({codec:C,createR1Verifier:V.createR1Verifier,validShape:Shape.validShape})(options(f));const r=await faulty.read(input(f));assert.equal(r.verified,true);assert.throws(()=>assert.equal(r.history.starts[0].planBasis,null));assert.equal((await reader.read(input(f))).history.starts[0].planBasis,null);});
 for(const [file,pin]of Object.entries(pins))assert.equal(hash(fs.readFileSync(path.join(root,file))),pin,'SOURCE_UNCHANGED '+file);
 const result={ref,scope:'actual R1 projector/signatures/verifier with tracked synthetic row fixture; no issuer/D1/HTTP/IDB/phone/currentness or prescription qualification',sources:pins,readerSha:hash(fs.readFileSync(path.join(__dirname,'r1-history-reader.cjs'))),results};
 if(out)fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
 console.log('R1 HISTORY READER: '+results.length+'/'+results.length+' PASS; 1/1 effective no-plan fault; no product source changed');
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
