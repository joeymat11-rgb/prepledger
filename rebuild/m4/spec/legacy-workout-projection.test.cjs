'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),Module=require('node:module'),crypto=require('node:crypto'),vm=require('node:vm');
const {spawnSync}=require('node:child_process');
if(!process.argv[2])throw Error('Pass the pinned R1 003c816 checkout explicitly');
const root=path.resolve(process.argv[2]),out=process.argv[3]&&path.resolve(process.argv[3]);
const ref='003c816e695fce7e77e17665f25d8cdcc2435211', results=[];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function git(args,cwd=root){const r=spawnSync('git',args,{cwd,windowsHide:true,maxBuffer:12e6});assert.equal(r.status,0);return r.stdout;}
const paths=git(['ls-tree','-r','--name-only',ref,'rebuild/authority','rebuild/client','rebuild/m3/w5']).toString().trim().split(/\r?\n/).filter(p=>p.endsWith('.cjs'));
const pins={};for(const p of paths){const x=git(['show',ref+':'+p]);assert.ok(x.equals(fs.readFileSync(path.join(root,p))),p);pins[p]=hash(x);}
const readerPath=path.join(__dirname,'r1-history-reader.cjs');
assert.equal(hash(fs.readFileSync(readerPath)),'be06c0111ca1ccd0f587933f61d7ee91fb7235f8670e1cb31a6f239ddd316e25');
const W5=path.join(root,'rebuild/m3/w5'), K=require(path.join(W5,'crypto.cjs')),C=require(path.join(W5,'reconciliation/codec.cjs'));
const V=require(path.join(W5,'reconciliation/verify.cjs')),S=require(path.join(root,'rebuild/authority/validate.cjs'));
const Client=require(path.join(root,'rebuild/client')),H=require(path.join(root,'rebuild/authority/crypto.cjs'));
const fixtureFile=path.join(W5,'test/r1-codec.test.cjs'),src=fs.readFileSync(fixtureFile,'utf8'),end=src.indexOf("test('tagged SHA256");assert(end>0);
const m=new Module(fixtureFile,module);m.filename=fixtureFile;m.paths=Module._nodeModulePaths(path.dirname(fixtureFile));m._compile(src.slice(0,end)+'\nmodule.exports={fixture,packet};',fixtureFile);
const {fixture,packet}=m.exports;
const createReader=require(readerPath).linkR1HistoryReader({codec:C,createR1Verifier:V.createR1Verifier,validShape:S.validShape});
const createView=require('./legacy-workout-view.cjs').createLegacyWorkoutView;
const check=(name,fn)=>Promise.resolve().then(fn).then(()=>{results.push({name,status:'PASS'});console.log('PASS '+name);});
const input=f=>{const p=packet(f);return {manifest:p.mr,pages:p.pages,request:f.requestBytes,expected:f.expected};};
const reader=f=>createReader({keys:[K.publicKeyOf(f.key)],subtle:crypto.webcrypto.subtle,athleteId:f.athleteId,actorDeviceId:f.actorDeviceId});
(async()=>{
  const corePath=path.join(fs.mkdtempSync(path.join(require('node:os').tmpdir(),'earned-workout-history-')),'core.cjs');await require(path.join(W5,'build.cjs')).buildCore({outfile:corePath});
  const core=require(corePath), f=fixture(), identity=crypto.randomBytes(32).toString('hex'),localAuth=crypto.randomBytes(32).toString('hex');
  // R1 registry/genesis rows are tracked synthetic fixture data, NOT an issuer.
  // T2 local HMAC lease and R1 public lease share capability fields; signatures
  // differ at their declared test boundaries. Operations cross unchanged.
  const rows=f.rows.filter(r=>['deviceIssuance','issuedLeases','enrollmentIntents','standingEvents','accountRegistry','metadata'].includes(r.collection));
  const meta=JSON.parse(rows.find(r=>r.collection==='metadata').value);meta.seq=0;rows.find(r=>r.collection==='metadata').value=JSON.stringify(meta);
  const backend=core.memoryBackend(rows.map(r=>[JSON.stringify([r.athlete,r.collection,r.row_id]),JSON.parse(r.value)]));
  const authority=core.createAuthority({backend,authorityKey:f.key,identityKeys:{[f.athleteId]:identity},clock:()=> '2026-09-06T16:00:00.000Z',athletes:{[f.athleteId]:{devices:meta.devices,plan:{}}},
    resolveIssuedLease:(tx,athlete,device,id)=>tx.get('issuedLeases',JSON.stringify([device,id]))?.lease});
  const authored=[];
  function makeClient(device){const publicLease=meta.devices[device].lease,{signature,...fields}=publicLease;
    const client=Client.createClient({athleteId:f.athleteId,deviceId:device,identityKey:identity,authorityKey:localAuth,
      lease:H.signLease(fields,localAuth),backend:Client.memoryBackend({sync:{snapshot:{plan:{},reads:[]},frontier:{W:0,authorityW:0}}}),
      clock:{now:()=> '2026-09-06T16:00:00.000Z',today:()=> '2026-09-06',monotonicMs:()=>0,tz:'-04:00'},online:false,standing:'enrolled',contract:{client:'1',required:'1'},transport:{}});
    client.boot();return client;}
  const a=makeClient('device-a'),b=makeClient('device-b');
  await check('ACTUAL-T2-TWO-DEVICE-WRITERS',()=>{assert.equal(a.logSession({date:'2026-09-06',sets:[{lift:'synthetic-row',load:45,reps:8,slot:'first'},{lift:'synthetic-row',load:40,reps:10,slot:'second'}]}).acknowledged,true);assert.equal(a.finishSession().acknowledged,true);assert.equal(b.logSession({date:'2026-09-06',sets:[{lift:'synthetic-push',load:25,reps:9,slot:'first'}]}).acknowledged,true);authored.push(...a.model.ops.values(),...b.model.ops.values());assert.equal(authored.length,6);});
  assert.equal(a.correction(authored[2].op_id,{load:{value:35,unit:'lb'}}).acknowledged,true);authored.push(a.model.ops.get('op-device-a-5'));
  const original=JSON.stringify(authored);let waiting;
  await check('ACTUAL-P256-CORE-ORDER-AND-WAITING-DRAIN',()=>{assert.equal(authority.admit(f.athleteId,authored[1]).status,'ACCEPTED');waiting=authority.admit(f.athleteId,authored[6]);assert.equal(waiting.status,'WAITING');for(const op of authored.filter((_,i)=>i!==1&&i!==6))assert.equal(authority.admit(f.athleteId,op).status,'ACCEPTED');assert.equal(authority.frontier(f.athleteId),7);assert.equal(authority.dispositionHistory(f.athleteId,'device-a',5).length,2);});
  f.rows=backend.snapshot().map(([key,value])=>{const[athlete,collection,row_id]=JSON.parse(key);return{athlete,collection,row_id,value:JSON.stringify(value)};});
  f.request.claims=authored.map((op,i)=>({claim_id:'claim-'+i,envelope_b64:C.encode64(C.encode(op))}));f.requestBytes=C.encode(f.request);f.expected.requestDigest=C.hash('request',f.requestBytes);
  const view=createView(reader(f));let result;
  await check('ACTUAL-R1-MULTI-OPERATION-PROOF-TO-VIEW',async()=>{result=await view.read(input(f));assert.equal(result.verified,true);assert.equal(result.view.events.length,7);assert.equal(result.view.through,7);assert.equal(result.decisionReady,false);});
  await check('MIXED-LOADS-AND-REPS-REMAIN-PER-SET',()=>{assert.deepEqual(result.view.events.filter(e=>e.kind==='session-set').map(e=>e.observations),[{load:{value:45,unit:'lb'},reps:{value:8,unit:'rep'}},{load:{value:40,unit:'lb'},reps:{value:10,unit:'rep'}},{load:{value:25,unit:'lb'},reps:{value:9,unit:'rep'}}]);});
  await check('BOTH-DEVICES-AND-EXPLICIT-START-REFERENCES',()=>{const sets=result.view.events.filter(e=>e.kind==='session-set');assert.deepEqual(sets.map(e=>[e.deviceId,e.sessionStartId]),[['device-a','op-device-a-1'],['device-a','op-device-a-1'],['device-b','op-device-b-1']]);assert(sets.every(e=>e.association==='RECORDED_REFERENCE'));});
  await check('UNKNOWN-EFFORT-AND-BASIS-NOT-DEFAULTED',()=>{for(const e of result.view.events){if(e.kind==='session-set')assert.deepEqual(e.reserve,{tag:'unknown',reason:'NOT_RECORDED_BY_SCHEMA1_WRITER'});if(e.kind==='session-start')assert.equal(e.planBasis,null);}assert.equal(result.view.mode,'ORIGINAL_RECORDED_EVENTS');assert.equal(result.view.currency,'CAPTURED_PREFIX_ONLY');});
  await check('ORIGINAL-OPERATION-AND-LAST-DISPOSITION-BYTES',()=>{for(const event of result.view.events){assert.deepEqual(event.operation,authored.find(o=>o.op_id===event.id));const dr=event.source.dispositionRow;assert.equal(C.text(C.decode64(dr.value_b64)),f.rows.find(r=>r.collection===dr.collection&&r.row_id===dr.row_id).value);}const correction=result.view.events.find(e=>e.id===authored[6].op_id);assert.equal(correction.source.dispositionRow.row_id,JSON.stringify([authored[6].op_id,2]));});
  await check('CROSS-CLASS-CORRECTION-VISIBLE-NOT-SILENTLY-FOLDED',()=>{const edit=result.view.events.find(e=>e.id===authored[6].op_id);assert.equal(edit.operation.class,'reading');assert.equal(edit.kind,'correction');assert.equal(edit.interpretation,'UNINTERPRETED');assert(result.view.issues.some(i=>i.opId===edit.id&&i.code==='HISTORY_EFFECT_REQUIRES_QUALIFIED_FOLD'));assert.equal(result.view.events.find(e=>e.id===authored[2].op_id).observations.load.value,40);assert.equal(result.decisionReady,false);});
  await check('REPLAY-NO-DUPLICATE-AND-INPUT-UNCHANGED',async()=>{for(const op of authored){const before=authority.disposition(f.athleteId,op.device_id,op.device_seq);assert.deepEqual(authority.admit(f.athleteId,op),before);}assert.equal(authority.frontier(f.athleteId),7);assert.equal(JSON.stringify(authored),original);const x=input(f);assert.deepEqual(await view.read(x),await view.read(x));});
  await check('FORGED-PACKET-NO-WORKOUT-VIEW',async()=>{const x=input(f);x.pages[0].fill(0);const r=await view.read(x);assert.equal(r.verified,false);assert.equal(r.view,null);});
  await check('OUTPUT-MUTATION-NO-RETAINED-HISTORY-CHANGE',async()=>{result.view.events.find(e=>e.id===authored[1].op_id).observations.load.value=999;const next=await view.read(input(f));assert.equal(next.view.events.find(e=>e.id===authored[1].op_id).observations.load.value,45);assert.equal(JSON.stringify(authored),original);});
  await check('EFFECTIVE-INVENTED-EFFORT-FAULT',async()=>{const raw=fs.readFileSync(path.join(__dirname,'legacy-workout-view.cjs'),'utf8'),needle="{tag:'unknown',reason:'NOT_RECORDED_BY_SCHEMA1_WRITER'}";assert.equal(raw.split(needle).length,2);const mod={exports:{}};vm.runInNewContext(raw.replace(needle,"{tag:'exact',value:0,unit:'rep'}"),{module:mod,structuredClone,Map,Object,Number});const r=await mod.exports.createLegacyWorkoutView(reader(f)).read(input(f));assert.equal(r.verified,true);assert.throws(()=>assert.equal(r.view.events.find(e=>e.id===authored[1].op_id).reserve.tag,'unknown'));});
  const createProjection=require('./legacy-workout-projection.cjs').createLegacyWorkoutProjection;
  const baseline=backend.snapshot(),Ops=require(path.join(root,'rebuild/client/ops.cjs'));
  const target=authored[2].op_id, priorEdit=authored[6].op_id;
  function extra(id,device,seq,kind,targetId,parents,payload){return Ops.build({op_id:id,athlete_id:f.athleteId,device_id:device,device_seq:seq,
    predecessor:device==='device-a'?'op-device-a-5':seq===4?'chain-edit':'op-device-b-2',parents,class:'reading',kind,target:targetId,
    effective:{local_date:'2026-09-06',local_time:'12:00',utc_offset:'-04:00'},lease_id:'lease-'+device,payload},identity);}
  async function trial(ops,construct=createProjection,fromGenesis=false){const db=core.memoryBackend(fromGenesis?rows.map(r=>[JSON.stringify([r.athlete,r.collection,r.row_id]),JSON.parse(r.value)]):baseline),server=core.createAuthority({backend:db,authorityKey:f.key,
    identityKeys:{[f.athleteId]:identity},clock:()=> '2026-09-06T16:00:00.000Z',athletes:{[f.athleteId]:{devices:meta.devices,plan:{}}},
    resolveIssuedLease:(tx,athlete,device,id)=>tx.get('issuedLeases',JSON.stringify([device,id]))?.lease});
    const replies=ops.map(op=>server.admit(f.athleteId,op));assert(replies.every(d=>['ACCEPTED','WAITING'].includes(d.status)));
    const g={...f,rows:db.snapshot().map(([key,value])=>{const[athlete,collection,row_id]=JSON.parse(key);return{athlete,collection,row_id,value:JSON.stringify(value)};})};
    const retained=JSON.stringify(db.snapshot());const response=await construct(reader(g)).read(input(g));assert.equal(response.verified,true);assert(response.projection);assert.equal(JSON.stringify(db.snapshot()),retained,'READ_ONLY_RETAINED_ROWS');return response;}
  const set=(r,id=target)=>r.projection.sets.find(s=>s.id===id);
  await check('SIGNED-CORRECTION-CHANGES-OBSERVATIONS-NOT-ORIGINAL',async()=>{const r=await trial([]);assert.equal(set(r).observations.load.value,35);assert.equal(set(r).original.load.value,40);assert.equal(set(r).effects[0].id,priorEdit);assert.equal(set(r,authored[1].op_id).observations.load.value,45);assert.equal(set(r).planBasis,null);assert.equal(r.decisionReady,false);});
  const chain=extra('chain-edit','device-b',3,'correction',target,[target,priorEdit],{replacement_fields:{reps:{value:11,unit:'rep'}}});
  await check('SIGNED-CAUSAL-CHAIN-COMPOSES-DISJOINT-FIELDS',async()=>{const r=await trial([chain]);assert.deepEqual(set(r).observations,{load:{value:35,unit:'lb'},reps:{value:11,unit:'rep'}});assert.deepEqual(set(r).effects.map(e=>e.id),[priorEdit,chain.op_id]);});
  const removed=extra('remove-set','device-b',4,'tombstone',target,[target,chain.op_id],{reason:'synthetic mistaken entry'});
  await check('SIGNED-REMOVAL-EXCLUDES-CONTRIBUTION-RETAINS-HISTORY',async()=>{const r=await trial([removed,chain]);assert.equal(set(r).state,'REMOVED');assert.equal(set(r).observations,null);assert.equal(set(r).original.load.value,40);assert.equal(set(r).effects.length,3);assert.equal(set(r,authored[1].op_id).state,'INCLUDED');assert(r.recorded.events.some(e=>e.id===removed.op_id));});
  const rival=extra('concurrent-edit','device-a',6,'correction',target,[target],{replacement_fields:{load:{value:30,unit:'lb'}}});
  await check('TRANSPORT-PREDECESSOR-DOES-NOT-INVENT-EDIT-CAUSALITY',async()=>{const r=await trial([rival]);assert.equal(set(r).state,'UNRESOLVED');assert.equal(set(r).observations,null);assert(set(r).unresolved.includes('CONCURRENT_TARGET_EDITS'));assert.equal(set(r).effects.length,2);assert.equal(set(r,authored[1].op_id).state,'INCLUDED');});
  await check('BOTH-CONCURRENT-ACCEPTANCE-ORDERS-REMAIN-UNRESOLVED',async()=>{const forward=await trial([rival]),reverse=await trial([...authored.slice(0,6),rival,authored[6]],createProjection,true);for(const r of [forward,reverse]){assert.equal(set(r).state,'UNRESOLVED');assert.equal(set(r).observations,null);assert.deepEqual(set(r).unresolved,['CONCURRENT_TARGET_EDITS']);assert.equal(set(r).effects.length,2);assert.equal(set(r).original.load.value,40);}assert.deepEqual(set(forward).effects.map(e=>e.id).sort(),set(reverse).effects.map(e=>e.id).sort());});
  const unsupported=extra('unsupported-clear','device-b',3,'correction',target,[target,priorEdit],{replacement_fields:{reserve:null}});
  await check('UNSUPPORTED-ACCEPTED-REPLACEMENT-NEVER-PARTIAL-TRUTH',async()=>{const r=await trial([unsupported]);assert.equal(set(r).state,'UNRESOLVED');assert.equal(set(r).observations,null);assert(set(r).unresolved.includes('UNSUPPORTED_REPLACEMENT'));assert.equal(set(r).effects.at(-1).operation.payload.replacement_fields.reserve,null);});
  await check('DROPPED-CORRECTION-EFFECTIVE-FAULT',async()=>{const source=fs.readFileSync(path.join(__dirname,'legacy-workout-projection.cjs'),'utf8'),needle='observations={...observations,...copy(replacement)}';assert.equal(source.split(needle).length,2);const mod={exports:{}};vm.runInNewContext(source.replace(needle,'observations={...observations}'),{module:mod,require:()=>({createLegacyWorkoutView:createView}),structuredClone,Map,Set,Object,Array,Number});const r=await trial([],mod.exports.createLegacyWorkoutProjection);assert.throws(()=>assert.equal(set(r).observations.load.value,35));});
  await check('ACTUAL-ACCEPTED-NULL-START-RETAINED-AS-UNSUPPORTED',async()=>{
    const Ops=require(path.join(root,'rebuild/client/ops.cjs'));
    const op=Ops.build({op_id:'unsupported-start',athlete_id:f.athleteId,device_id:'device-a',device_seq:6,
      predecessor:'op-device-a-5',parents:[],class:'session',kind:'session-start',
      effective:{local_date:'2026-09-06',local_time:'12:00',utc_offset:'-04:00'},lease_id:'lease-device-a',payload:null},identity);
    assert.equal(authority.admit(f.athleteId,op).status,'ACCEPTED');
    f.rows=backend.snapshot().map(([key,value])=>{const[athlete,collection,row_id]=JSON.parse(key);return{athlete,collection,row_id,value:JSON.stringify(value)};});
    const r=await view.read(input(f));assert.equal(r.verified,true);
    const e=r.view.events.find(e=>e.id===op.op_id);assert.equal(e.interpretation,'UNINTERPRETED');assert.equal(e.operation.payload,null);
    assert(e.readerIssues.some(i=>i.code==='MISSING_LEGACY_SLOT'));assert(e.readerIssues.some(i=>i.code==='UNSUPPORTED_START_FIELDS'));
    assert(r.view.issues.some(i=>i.opId===op.op_id&&i.code==='UNSUPPORTED_SESSION_PAYLOAD'));assert.equal(r.decisionReady,false);
  });
  for(const[p,h]of Object.entries(pins))assert.equal(hash(fs.readFileSync(path.join(root,p))),h,p);
  if(out)fs.writeFileSync(out,JSON.stringify({ref,readerSha:hash(fs.readFileSync(readerPath)),viewSha:hash(fs.readFileSync(path.join(__dirname,'legacy-workout-view.cjs'))),projectionSha:hash(fs.readFileSync(path.join(__dirname,'legacy-workout-projection.cjs'))),scope:'actual T2 writer and P256-core admission/WAITING drain plus R1 signed projection and verifier; synthetic genesis/issuer rows and distinct local HMAC lease fixture; memory only, not D1/HTTP/IDB/phone/currentness/qualified workout fold',results,pins},null,2)+'\n',{flag:'wx'});
  console.log('LEGACY WORKOUT VIEW: '+results.length+'/'+results.length+' PASS; actual writer/core/history; no product changes');
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
