import {test} from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {IDBKeyRange,IDBFactory} from 'fake-indexeddb';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {fixture,deferred} from '../support.mjs';
import {createRowsRecovery,createRowsFetcher,RECOVERY_LIMITS as L} from '../../recovery-transport.mjs';
import {validateRecoveryProfile} from '../../recovery-profile.mjs';
if(!process.env.EARNED_ROWS_R1_ROOT)throw Error('Use the pinned recovery runner');
const require=createRequire(resolve(process.env.EARNED_ROWS_R1_ROOT,'rebuild/m3/w5/package.json'));
const C=require('./reconciliation/codec.cjs'),P=require('./reconciliation/paged-codec.cjs'),S=require('./crypto.cjs'),Public=require('./public-client.cjs');
const h=P.hash('synthetic','transport'),actor='device-synthetic';
test('rows adaptation preserves all four pinned accepted transport limits',()=>assert.deepEqual(L,require('./reconciliation/transport.cjs').LIMITS));
const idle=()=>new Promise(r=>setImmediate(r));
async function until(fn){const end=performance.now()+5000;while(performance.now()<end){if(fn())return;await new Promise(r=>setTimeout(r,1));}throw Error('Test event did not arrive');}
const reply=(status,body)=>({status,bodyBytes:C.encode(body)});
async function raw(f,action){const db=await new Promise((resolve,reject)=>{const r=f.indexedDB.open(f.setup.databaseName,1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});try{await new Promise((resolve,reject)=>{const tx=db.transaction('generations','readwrite');action(tx.objectStore('generations'));tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);});}finally{db.close();}}
async function setup(t,overrides={},fixtureOptions={}){
 const f=await fixture(fixtureOptions);await f.seed();assert.equal((await f.bridge.execute('weighIn',{lb:170.6})).acknowledged,true);const before=await f.repo.load();t.after(()=>f.repo.close());
 const authority=S.generateSigningKey('transport-test'),keys=[S.publicKeyOf(authority)],sign=x=>({...x,authority_signature:S.signatureOver(x,authority,x.profile)});
 const state={now:0,calls:0,nonces:0,negatives:0,denied:false},request=()=>({version:C.REQUEST_VERSION,nonce:P.hash('nonce',++state.nonces),context_id:h,mode:'CURRENT_DEVICE',claims:[],requested_lease_ids:[]});
 const expected=req=>({athleteId:'synthetic-athlete',actorDeviceId:actor,scopeDigest:h,nonce:req.nonce,contextId:req.context_id,requestDigest:C.hash('request',C.encode(req)),basisDigest:h,claimSetDigest:P.hash('claims',req.claims),mode:req.mode});
 const stage=f.repo.recovery({codec:C,protocol:P,verificationKeys:keys,validateContext:()=>state.denied?{state:17,code:'SIGNED_OUT'}:null,keyRange:IDBKeyRange});
 const rows=[{collection:'metadata',row_id:'state',value:'{}'}];
 function response(body,custom=rows){
  const manifest=body.manifest||sign(P.makeManifest({keyEpoch:authority.kid,scopeDigest:h,request:body.request,basisDigest:h,revision:1,storageControlDigest:h,snapshotId:h,collectionCounts:P.COLLECTIONS.map(c=>[c,custom.filter(r=>r.collection===c).length]),chainSeed:h}));
  const page=P.makePage({manifest,previousCursor:body.cursor||null,rawRows:body.cursor?[]:custom,sign});return reply(200,{manifest,page,...body.cursor?{finish:P.makeFinish({manifest,page,sign})}:{}});
 }
 const options={stage,codec:C,protocol:P,newRequest:async()=>request(),expected:async req=>expected(req),monotonicMs:()=>state.now,
  fetchPage:async body=>{state.calls++;return response(body);},observeNegative:async()=>{state.negatives++;},
  // Generic signed inventory in controller-unit cases; semantic success here is
  // a declared stand-in. The real HTTP/full-profile case below has no stand-in.
  validateProfile:async()=>({profileVerified:true,complete:false,activated:false}),...overrides};
 return {...f,before,stage,state,options,authority,keys,response,request,expected,controller:createRowsRecovery(options)};
}
test('finite rows controller uses durable pages without granting activation; reopen needs explicit retry',async t=>{
 const f=await setup(t),result=await f.controller.run();assert.equal(result.evidenceReady,true);assert.equal(result.complete,false);assert.equal(result.activated,false);assert.equal(result.checkpoint,false);assert.equal(f.state.calls,2);
 assert.equal((await f.stage.attemptPersistence().load()).status,'VALIDATED');const fresh=await f.fresh();t.after(()=>fresh.repository.close());
 const reopened=fresh.repository.recovery({codec:C,protocol:P,verificationKeys:f.keys,validateContext:()=>null,keyRange:IDBKeyRange}),controller=createRowsRecovery({...f.options,stage:reopened});
 assert.equal((await controller.run()).reason,'EXPLICIT_RETRY_REQUIRED');assert.equal(f.state.calls,2);assert.equal((await controller.run({explicitRetry:true})).evidenceReady,true);assert.equal(f.state.calls,4);assert.deepEqual(await fresh.repository.load(),f.before);
});
test('network outage is exactly three attempts and leaves durable exhaustion',async t=>{
 const f=await setup(t);f.options.fetchPage=async()=>{f.state.calls++;throw Error('offline');};const result=await createRowsRecovery(f.options).run();assert.equal(result.evidenceReady,false);assert.equal(result.recoveryState,18);assert.equal(f.state.calls,3);assert.equal((await f.stage.attemptPersistence().load()).status,'EXHAUSTED');assert.deepEqual(await f.repo.load(),f.before);
});
test('faster source stops at three fresh requests; quiet explicit retry then validates',async t=>{
 const f=await setup(t);let busy=true;f.options.fetchPage=async body=>{f.state.calls++;return busy?reply(409,{error:{code:'SNAPSHOT_CHANGED'}}):f.response(body);};const controller=createRowsRecovery(f.options);
 assert.equal((await controller.run()).reason,'RESTARTS_EXHAUSTED');assert.equal(f.state.calls,3);assert.equal(f.state.nonces,3);busy=false;assert.equal((await controller.run({explicitRetry:true})).evidenceReady,true);assert.deepEqual(await f.repo.load(),f.before);
});
test('nonce reuse and mismatched expected request cannot reset recovery indefinitely',async t=>{
 const f=await setup(t),fixed=f.request();f.options.newRequest=async()=>fixed;f.options.fetchPage=async()=>reply(409,{error:{code:'SNAPSHOT_CHANGED'}});assert.equal((await createRowsRecovery(f.options).run()).reason,'NONCE_REUSED');
 f.options.expected=async req=>({...f.expected(req),requestDigest:P.hash('bad','request')});assert.equal((await createRowsRecovery(f.options).run({explicitRetry:true})).reason,'EXPECTED_REQUEST_MISMATCH');
});
test('watchdog checks monotonic time after response and never calls it lease expiry',async t=>{
 const f=await setup(t);f.options.fetchPage=async body=>{f.state.now=L.attemptMs;return f.response(body);};const result=await createRowsRecovery(f.options).run();assert.equal(result.evidenceReady,false);assert.equal(result.recoveryState,18);assert.notEqual(result.state,20);assert.equal(f.state.negatives,1);assert.deepEqual(await f.repo.load(),f.before);
});
test('watchdog rejects a profile finishing at its exact boundary',async t=>{
 const f=await setup(t);let capturedSignal;f.options.validateProfile=async({signal})=>{capturedSignal=signal;f.state.now=L.attemptMs;return {profileVerified:true,complete:false,activated:false};};assert.equal((await createRowsRecovery(f.options).run()).evidenceReady,false);assert(capturedSignal.aborted);assert.notEqual((await f.stage.attemptPersistence().load()).status,'VALIDATED');
});
test('ordinary refresh does not invent storage loss or checkpoint credit',async t=>{
 const f=await setup(t);f.options.fetchPage=async()=>{throw Error('offline');};const result=await createRowsRecovery({...f.options,context:'REFRESH'}).run();assert.equal(Object.hasOwn(result,'recoveryState'),false);assert.equal(result.checkpoint,false);assert.equal(result.preserveKnownStates,true);assert.deepEqual(await f.repo.load(),f.before);
});
test('negative ingress failure stops without retry or positive evidence',async t=>{
 const f=await setup(t);f.options.observeNegative=async()=>{throw Error('knowledge persistence unproven');};const result=await createRowsRecovery(f.options).run();assert.equal(result.reason,'NEGATIVE_INGRESS_UNPROVEN');assert.equal(f.state.calls,1);assert.equal(result.evidenceReady,false);assert.deepEqual(await f.repo.load(),f.before);
});
test('known standing learned from a response refuses the following durable write',async t=>{
 const f=await setup(t);f.options.observeNegative=async()=>{f.state.denied=true;};assert.equal((await createRowsRecovery(f.options).run()).evidenceReady,false);assert.equal(f.state.calls,1);assert.equal((await f.stage.progress()).pages,0);assert.deepEqual(await f.repo.load(),f.before);
});
test('timed-out signed200 replies still reach cryptographic negative ingress with captured context',async t=>{
 const f=await setup(t),callbacks=[],pending=[],seen=[],verifier=P.createRowsVerifier({keys:f.keys,subtle:webcrypto.subtle}),originals=Public.createPublicVerifier({keys:f.keys,subtle:webcrypto.subtle});
 const disposition=S.signDisposition({op_id:'rejected-op',device_id:actor,device_seq:1,canonical_content_commitment:h,status:'REJECTED'},f.authority),rows=[{collection:'history',row_id:JSON.stringify(['rejected-op',1]),value:JSON.stringify(disposition)}];
 f.options.fetchPage=(body,{signal})=>new Promise(resolve=>pending.push({body,resolve,signal}));f.options.timers={setTimeout(fn,ms){if(ms===L.timeoutMs)callbacks.push(fn);return fn;},clearTimeout(){}};
 f.options.observeNegative=async(reply,context)=>{const checked=await verifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor});assert(checked.verified);const d=C.parse(C.decode64(checked.value.page.rows[0].value_b64));assert(await originals.verifyDisposition(d));seen.push(d.status);};
 const running=createRowsRecovery(f.options).run();for(let i=0;i<3;i++){await until(()=>callbacks[i]);callbacks[i]();}assert.equal((await running).evidenceReady,false);
 for(const p of pending){assert(p.signal.aborted);p.resolve(f.response(p.body,rows));}await until(()=>seen.length===3);assert.deepEqual(seen,['REJECTED','REJECTED','REJECTED']);assert.deepEqual(await f.repo.load(),f.before);
 // This observer is a verified synthetic witness, not the production durable
 // knowledge-loss/state19 policy or an assertion of CLOCK acceptance.
});
test('competing persistence handles cannot overwrite a newer durable attempt',async t=>{
 const f=await setup(t),a=f.stage.attemptPersistence(),b=f.stage.attemptPersistence();assert.equal(await a.load(),null);assert.equal(await b.load(),null);const record={status:'ACTIVE',restarts:0,requests:0,page:0,reason:null};
 const results=await Promise.allSettled([a.save(record),b.save(record)]);assert.equal(results.filter(x=>x.status==='fulfilled').length,1);assert.equal(results.filter(x=>x.status==='rejected').length,1);assert.equal((await f.stage.attemptPersistence().load()).status,'ACTIVE');assert.deepEqual(await f.repo.load(),f.before);
});
test('tampered durable attempt is not silently replaced and no network starts',async t=>{
 const f=await setup(t),p=f.stage.attemptPersistence();await p.load();await p.save({status:'ACTIVE',restarts:0,requests:1,page:0,reason:null});
 await raw(f,store=>{const r=store.get(['earned/recovery-rows/v1','transport']);r.onsuccess=()=>{const x=r.result;new Uint8Array(x.ciphertext)[0]^=1;store.put(x,['earned/recovery-rows/v1','transport']);};});
 assert.equal((await f.controller.run({explicitRetry:true})).evidenceReady,false);assert.equal(f.state.calls,0);await assert.rejects(f.stage.attemptPersistence().load());assert.deepEqual(await f.repo.load(),f.before);
});
test('durable attempt marker is committed before the first network request',async t=>{
 const f=await setup(t);f.options.fetchPage=async body=>{const marker=await f.stage.attemptPersistence().load();assert.equal(marker.status,'ACTIVE');assert(marker.requests>=1);return f.response(body);};assert.equal((await createRowsRecovery(f.options).run()).evidenceReady,true);
});
test('concurrent run on one controller is refused rather than duplicated',async t=>{
 const f=await setup(t),hold=deferred();f.options.fetchPage=async body=>{await hold.promise;return f.response(body);};const controller=createRowsRecovery(f.options),run=controller.run();await until(()=>controller);assert.equal((await controller.run()).code,'ATTEMPT_RUNNING');hold.resolve();assert.equal((await run).evidenceReady,true);
});
test('actual Worker/D1/P1 HTTP flows through durable finite transport and indexed full-profile validation',async t=>{
 const runtime=await require('./test/r1-workerd.cjs').createR1Runtime({p1:true});t.after(()=>runtime.close());const f=await fixture();await f.seed();assert((await f.bridge.execute('weighIn',{lb:170.6})).acknowledged);const before=await f.repo.load();t.after(()=>f.repo.close());
 await runtime.bridge.initializeR1({first:{plan:{},devices:{}}},{'subject-first':'first'});const enrolled=await runtime.bridge.enrollScoped('subject-first',{intent_id:'finite-profile',schema_version:1,nonce:h}),lease=enrolled.payload.issuance.lease,Ops=require('../../client/ops.cjs');
 for(let n=1;n<=8;n++){const op=Ops.build({op_id:'finite-fact-'+n,athlete_id:'first',device_id:lease.device_id,device_seq:n,predecessor:n===1?null:'finite-fact-'+(n-1),parents:[],kind:'fact',class:'reading',lease_id:lease.lease_id,effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},payload:{lb:{value:160,unit:'lb'},note:'SYNTHETIC '+ 'x'.repeat(70000)}},runtime.identityKeys.first);assert.equal((await runtime.bridge.invokeScoped('subject-first',lease.device_id,'admit',['first',op])).status,'ACCEPTED');}
 const keys=[S.publicKeyOf(runtime.authorityKey)],verifier=P.createRowsVerifier({keys,subtle:webcrypto.subtle}),publicVerifier=Public.createPublicVerifier({keys,subtle:webcrypto.subtle}),stage=f.repo.recovery({codec:C,protocol:P,verificationKeys:keys,validateContext:()=>null,keyRange:IDBKeyRange});let nonce=0,observed=0;
 const controller=createRowsRecovery({stage,codec:C,protocol:P,newRequest:async()=>({version:C.REQUEST_VERSION,nonce:P.hash('finite-nonce',++nonce),context_id:h,mode:'CURRENT_DEVICE',claims:[],requested_lease_ids:[]}),
  expected:async req=>({athleteId:'first',actorDeviceId:lease.device_id,scopeDigest:C.scopeDigest({issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0],subject:'subject-first',athleteId:'first',actorDeviceId:lease.device_id}),nonce:req.nonce,contextId:req.context_id,requestDigest:C.hash('request',C.encode(req)),basisDigest:h,claimSetDigest:P.hash('claims',req.claims),mode:req.mode}),
  fetchPage:createRowsFetcher({baseURL:runtime.url,codec:C,protocol:P,headers:async()=>({Origin:runtime.issuer.config.origins[0],Authorization:'Bearer '+runtime.issuer.token('subject-first')})}),observeNegative:async(reply,context)=>{assert.equal(reply.status,200);assert((await verifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor})).verified);observed++;},
  validateProfile:args=>validateRecoveryProfile({...args,codec:C,protocol:P,publicVerifier})});
 const result=await controller.run();assert.equal(result.evidenceReady,true);assert.equal(result.complete,false);assert.equal((await result.evidence.summary()).W,8);assert(observed>2);assert.deepEqual(await f.repo.load(),before);assert.equal((await stage.attemptPersistence().load()).status,'VALIDATED');
});

test('duplicate JSON fields and BOM remain visible to the closed decoder before staging',async t=>{
 const f=await setup(t);
 for(const kind of ['duplicate','bom','parsed-only']){
  f.options.fetchPage=async body=>{const response=f.response(body);if(kind==='parsed-only')return {status:200,body:C.parse(response.bodyBytes)};const text=C.text(response.bodyBytes);response.bodyBytes=new TextEncoder().encode(kind==='bom'?'\uFEFF'+text:text.replace('{"manifest":','{"manifest":null,"manifest":'));return response;};
  assert.equal((await createRowsRecovery(f.options).run({explicitRetry:true})).evidenceReady,false);assert.equal((await f.stage.progress()).pages,0);
 }assert.deepEqual(await f.repo.load(),f.before);
});
test('HTTP fetcher bounds request/response bytes and disables credentials, redirects and caching',async()=>{
 let captured,headers=0,cancelled=false;
 const fetcher=createRowsFetcher({baseURL:'https://synthetic.invalid',codec:C,protocol:P,headers:async()=>{headers++;return {Authorization:'synthetic-test-only'};},fetchImpl:async(url,options)=>{captured={url,options};return new Response(new ReadableStream({start(controller){controller.enqueue(new Uint8Array(P.LIMITS.response));controller.enqueue(new Uint8Array(1));},cancel(){cancelled=true;}}),{headers:{'Content-Type':'application/json'}});}});
 await assert.rejects(fetcher({profile:P.DOMAINS.begin,extra:'x'.repeat(C.LIMITS.request)}),/REQUEST_LIMIT/);assert.equal(headers,0);
 const signal=new AbortController().signal;await assert.rejects(fetcher({profile:P.DOMAINS.begin},{signal}),/RESPONSE_LIMIT/);assert(cancelled);assert.equal(captured.url.pathname,'/reconcile/rows');assert.equal(captured.options.signal,signal);assert.equal(captured.options.cache,'no-store');assert.equal(captured.options.credentials,'omit');assert.equal(captured.options.redirect,'error');assert.equal(captured.options.referrerPolicy,'no-referrer');
 assert.throws(()=>createRowsFetcher({baseURL:'http://synthetic.invalid',codec:C,protocol:P,headers:()=>({})}),/HTTPS/);
});
test('quota abort on the real attempt transaction prevents network and preserves unsynced work',async t=>{
 const inner=new IDBFactory(),fault={armed:false};
 const indexedDB={open(...args){const r=inner.open(...args);r.addEventListener('success',()=>{const db=r.result,transaction=db.transaction.bind(db);db.transaction=(...args)=>{const tx=transaction(...args);if(args[1]!=='readwrite'||!fault.armed)return tx;const store=tx.objectStore('generations'),put=store.put.bind(store),objectStore=tx.objectStore.bind(tx);store.put=(value,key)=>{if(Array.isArray(key)&&key[1]==='transport')throw new DOMException('Synthetic quota','QuotaExceededError');return put(value,key);};tx.objectStore=name=>name==='generations'?store:objectStore(name);return tx;};});return r;}};
 const f=await setup(t,{}, {indexedDB});fault.armed=true;const result=await f.controller.run();fault.armed=false;
 assert.equal(result.evidenceReady,false);assert.equal(f.state.calls,0);assert.equal(await f.stage.attemptPersistence().load(),null);assert.deepEqual(await f.repo.load(),f.before);
});
