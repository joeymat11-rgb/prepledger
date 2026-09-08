'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {createRequire}=require('node:module'),{randomBytes,createHash}=require('node:crypto');
const root=path.resolve(process.argv[2]||path.resolve(__dirname,'../../../..')),w5=path.join(root,'rebuild/m3/w5'),baseRequire=createRequire(path.join(w5,'worker.cjs'));
const sourceDirectory=path.resolve(process.argv[3]||w5);
const outputDirectory=process.argv[4]?path.resolve(process.argv[4]):fs.mkdtempSync(path.join(os.tmpdir(),'earned-current-head-evidence-'));
fs.mkdirSync(outputDirectory,{recursive:true});
const cache={};
function load(name){
 if(cache[name])return cache[name].exports;
 const m={exports:{}};cache[name]=m;
 const source=fs.readFileSync(path.join(sourceDirectory,name),'utf8');
 new Function('require','module','exports',source)(q=>['./crypto.cjs','./public-client.cjs'].includes(q)?load(q.slice(2)):baseRequire(q),m,m.exports);
 return m.exports;
}
const C=load('crypto.cjs'),P=load('public-client.cjs'),{createWorker}=load('worker.cjs');
const {buildCore}=baseRequire('./build.cjs'),{createBridge}=baseRequire('./bridge.cjs'),{createLocalD1}=baseRequire('./local-d1.cjs');
const {hostWorker,testIssuer}=baseRequire('../rigs/rig190.cjs'),Ops=baseRequire('../../client/ops.cjs'),Codec=baseRequire('./reconciliation/codec.cjs');
const NOW='2026-09-04T16:00:00.000Z',nonce=()=>randomBytes(32).toString('base64url'),results=[];
const check=async(name,fn)=>{await fn();results.push(name);console.log('PASS '+name);};
const clone=x=>JSON.parse(JSON.stringify(x));
async function main(){
 const core=require(await buildCore({outfile:path.join(fs.mkdtempSync(path.join(os.tmpdir(),'earned-current-head-core-')),'core.cjs')}));
 const runtime=await createLocalD1();let host;
 try{
  const sql=fs.readFileSync(path.join(w5,'migrations/0002_reconciliation.sql'),'utf8').replace(/--[^\n]*/g,'');
  const statements=sql.match(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm)||[];assert.equal(statements.length,6);
  await runtime.db.batch(statements.map(s=>runtime.db.prepare(s)));
  const issuer=testIssuer(),key=C.generateSigningKey('current-head-synthetic');
  const config={db:runtime.db,core,authorityKey:key,identityKeys:{first:nonce(),second:nonce()},clock:()=>NOW,
   reconciliationProfile:Codec.PROFILE,r1:{issuer:issuer.config.issuer,origin:issuer.config.origins[0]}};
  const bridge=createBridge(config);
  assert.deepEqual(await bridge.initializeR1({first:{plan:{steps:8000},devices:{}},second:{plan:{steps:9000},devices:{}}},
   {firstSubject:'first',secondSubject:'second'}),{initialized:true});
  const enrol=await bridge.enrollScoped('firstSubject',{intent_id:'head-first',schema_version:1,nonce:nonce()});
  const other=await bridge.enrollScoped('secondSubject',{intent_id:'head-second',schema_version:1,nonce:nonce()});
  const actor=enrol.payload.issuance.lease.device_id,lease=enrol.payload.issuance.lease;
  const op=Ops.build({op_id:'head-set-one',athlete_id:'first',device_id:actor,device_seq:1,predecessor:null,parents:[],kind:'fact',class:'reading',lease_id:lease.lease_id,
   effective:{local_date:'2026-09-04',local_time:'12:00',utc_offset:'-04:00'},payload:{lb:{value:160,unit:'lb'}}},config.identityKeys.first);
  assert.equal((await bridge.invokeScoped('firstSubject',actor,'admit',['first',op])).status,'ACCEPTED');
  host=await hostWorker(createWorker({bridge,authorityKey:key,auth:issuer.config,clock:()=>NOW}));
  const request=async(body,subject='firstSubject',route='/pull')=>{
   const r=await fetch(host.url+route,{method:'POST',headers:{'Content-Type':'application/json',Origin:issuer.config.origins[0],Authorization:'Bearer '+issuer.token(subject)},body:JSON.stringify(body)});
   assert.match(r.headers.get('cache-control'),/no-store/);return {status:r.status,body:await r.json()};
  };
  let calls=[];
  const boundary=(sink=async value=>{calls.push(value);return {durable:true,confirmed:true};},extra={})=>P.createPublicBoundary({keys:[C.publicKeyOf(key)],athleteId:'first',deviceId:actor,client:{receiveCurrentHead:sink},...extra});
  const begin=(b,after=0)=>b.beginHistoryChallenge({after,clientRevision:7,issuanceAttempt:'attempt-one'});
  let original;
  await check('REAL-D1-HTTP-AND-P256 current head and durable-context callback',async()=>{
   const b=boundary(),q=begin(b);assert.equal(q.challenge.length,43);assert.equal(Object.hasOwn(q,'clientRevision'),false);
   const response=await request(q);assert.equal(response.status,200);original=response.body;
   assert.equal(original.head,1);assert.equal(original.through,1);assert.equal(C.verifyCurrentHead(original,key),true);
   assert.equal((await b.acceptCurrentHead(original)).accepted,true);assert.equal(calls.length,1);
   assert.deepEqual(calls[0].context,{clientRevision:7,issuanceAttempt:'attempt-one',athleteId:'first',deviceId:actor});
   assert.deepEqual(calls[0].envelope.receipts[0].op,op);
   assert.equal((await b.acceptCurrentHead(original)).accepted,false);assert.equal(calls.length,1);
  });
  await check('EMPTY-AT-HEAD full empty range accepted',async()=>{const b=boundary(),q=begin(b,1),r=await request(q);assert.equal(r.body.receipts.length,0);assert.equal((await b.acceptCurrentHead(r.body)).accepted,true);});
  await check('FRONTIER-AHEAD existing409/state18',async()=>{const r=await request(begin(boundary(),2));assert.equal(r.status,409);assert.deepEqual(r.body,{error:{code:'FRONTIER_AHEAD',state:18}});});
  for(const [name,patch]of [['profile',{history_profile:'unknown'}],['short challenge',{challenge:'abc'}],['noncanonical challenge',{challenge:'A'.repeat(42)+'B'}]])
   await check('REQUEST '+name+' refused',async()=>assert.equal((await request({...begin(boundary()),...patch})).status,400));
  await check('FOREIGN-SUBJECT and athlete-selector denied',async()=>{
   assert.equal((await request(begin(boundary()),'secondSubject')).status,403);
   assert.equal((await request({...begin(boundary()),athlete_id:'first'})).status,403);
   const q={...begin(boundary()),device_id:other.payload.issuance.lease.device_id};assert.equal((await request(q)).status,403);
  });
  const modifications={challenge:e=>({...e,challenge:nonce()}),profile:e=>({...e,history_profile:'old'}),head:e=>({...e,head:e.head+1}),after:e=>({...e,after:1}),scope:e=>({...e,athlete_id:'second'}),device:e=>({...e,device_id:'different'}),missing:e=>({...e,receipts:[]}),duplicate:e=>({...e,head:2,through:2,receipts:[...e.receipts,...e.receipts]}),epoch:e=>({...e,key_epoch:'unrecognized'})};
  for(const [name,modify]of Object.entries(modifications))await check('AUTHENTIC-SIGNED wrong '+name+' refused before sink',async()=>{
   let count=0;const b=boundary(async()=>{count++;return {durable:true,confirmed:true};}),q=begin(b),r=await request(q);
   assert.equal((await b.acceptCurrentHead(C.signCurrentHead(modify(r.body),key))).accepted,false);assert.equal(count,0);
  });
  await check('TAMPERED inner receipt refused despite signed outer envelope',async()=>{
   const b=boundary(),r=(await request(begin(b))).body,e=clone(r);e.receipts[0].op.payload.lb.value=999;
   const n=calls.length;assert.equal((await b.acceptCurrentHead(C.signCurrentHead(e,key))).accepted,false);assert.equal(calls.length,n);
  });
  await check('LEGACY routes retain original signatures; reserved field cannot upgrade',async()=>{
   const legacy=await request({device_id:actor,after:0});assert(C.verifyPull(legacy.body,key));assert.equal(C.verifyCurrentHead(legacy.body,key),false);
   let count=0;const b=P.createPublicBoundary({keys:[C.publicKeyOf(key)],athleteId:'first',deviceId:actor,client:{deliverReceipts:()=>count++,receiveSnapshot:()=>count++}});
   assert.equal((await b.acceptPull(legacy.body)).accepted,true);assert.equal(count,1);
   assert.equal((await b.acceptPull(C.signPull({...legacy.body,history_profile:P.HISTORY_PROFILE},key))).accepted,false);
   assert.equal((await b.acceptPull(original)).accepted,false);assert.equal(count,1);
   const snap=(await request({device_id:actor,watermark:1},'firstSubject','/snapshot')).body;
   assert.equal((await b.acceptSnapshot(snap)).accepted,true);assert.equal(count,2);
   assert.equal((await b.acceptSnapshot(C.signSnapshot({...snap,history_profile:P.HISTORY_PROFILE},key))).accepted,false);assert.equal(count,2);
  });
  await check('SIMULTANEOUS replay invokes sink once',async()=>{
   let count=0;const b=boundary(async()=>{count++;return {durable:true,confirmed:true};}),e=(await request(begin(b))).body;
   const r=await Promise.all([b.acceptCurrentHead(e),b.acceptCurrentHead(e)]);assert.equal(count,1);assert.equal(r.filter(x=>x.accepted).length,1);
  });
  await check('REPLACED request and relaunched boundary reject old proof',async()=>{
   let count=0;const b=boundary(async()=>{count++;return {durable:true,confirmed:true};}),e=(await request(begin(b))).body;begin(b);
   assert.equal((await b.acceptCurrentHead(e)).accepted,false);assert.equal((await boundary().acceptCurrentHead(e)).accepted,false);assert.equal(count,0);
  });
  await check('REPLACEMENT during asynchronous signature verification prevents sink',async()=>{
   let release,entered;const wait=new Promise(r=>entered=r),gate=new Promise(r=>release=r);let blocked=false,count=0;
   const subtle={importKey:(...a)=>crypto.subtle.importKey(...a),async verify(...a){if(!blocked){blocked=true;entered();await gate;}return crypto.subtle.verify(...a);}};
   const b=boundary(async()=>{count++;return {durable:true,confirmed:true};},{subtle}),e=(await request(begin(b))).body,p=b.acceptCurrentHead(e);
   await wait;begin(b);release();assert.equal((await p).accepted,false);assert.equal(count,0);
  });
  await check('DURABILITY no success before completion; failure consumes request',async()=>{
   let release,entered;const wait=new Promise(r=>entered=r),gate=new Promise(r=>release=r);
   const b=boundary(async()=>{entered();await gate;return {durable:false,confirmed:false,state:18};}),e=(await request(begin(b))).body;
   let done=false;const p=b.acceptCurrentHead(e).then(x=>{done=true;return x;});await wait;assert.equal(done,false);release();
   const r=await p;assert.equal(r.accepted,false);assert.equal(r.state,18);assert.equal((await b.acceptCurrentHead(e)).accepted,false);
  });
  await check('UNCONFIRMED callback does not manufacture durable acceptance',async()=>{
   for(const result of [undefined,true,{}, {durable:true}, {confirmed:true}]){const b=boundary(async()=>result),e=(await request(begin(b))).body;assert.equal((await b.acceptCurrentHead(e)).accepted,false);}
  });
  await check('THROWING durable sink retains authenticated-but-unknown state18 without raw errors',async()=>{
   const b=boundary(async()=>{throw Error('synthetic confidential failure');}),e=(await request(begin(b))).body;
   const r=await b.acceptCurrentHead(e);assert.equal(r.accepted,false);assert.equal(r.verified,true);assert.equal(r.state,18);
   assert.equal(JSON.stringify(r).includes('confidential'),false);assert.equal((await b.acceptCurrentHead(e)).accepted,false);
  });
  await check('CONTEXT invalidation while sink runs refuses wrapper acceptance (not actual issuance)',async()=>{
   let release,entered;const wait=new Promise(r=>entered=r),gate=new Promise(r=>release=r);
   const b=boundary(async()=>{entered();await gate;return {durable:true,confirmed:true};}),e=(await request(begin(b))).body,p=b.acceptCurrentHead(e);
   await wait;b.invalidateHistoryChallenge();release();const r=await p;assert.equal(r.accepted,false);assert.equal(r.stored,true);assert.equal(r.state,18);
  });
  function afterSecondRead(effect){
   let reads=0,fired=false;
   const statement=(text,args=[])=>({text,original:runtime.db.prepare(text).bind(...args),bind(...a){return statement(text,a);}});
   return {prepare:text=>statement(text),async batch(statements){
    const result=await runtime.db.batch(statements.map(x=>x.original));
    if(statements.length===3 && statements.every(x=>x.text.startsWith('SELECT')) && ++reads===2){fired=true;await effect();}
    return result;
   },didFire:()=>fired};
  }
  async function race(db){
   const b=boundary(),worker=createWorker({bridge:createBridge({...config,db}),authorityKey:key,auth:issuer.config,clock:()=>NOW});
   // Same actual handler and independent D1 invocation; direct Request removes only socket scheduling.
   const response=await worker.fetch(new Request('http://localhost/pull',{method:'POST',headers:{'Content-Type':'application/json',Origin:issuer.config.origins[0],Authorization:'Bearer '+issuer.token('firstSubject')},body:JSON.stringify(begin(b))}));
   return {response,body:await response.json(),boundary:b};
  }
  await check('REAL-D1 race head advance retries coherent scoped range',async()=>{
   const next=Ops.build({op_id:'head-set-two',athlete_id:'first',device_id:actor,device_seq:2,predecessor:op.op_id,parents:[],kind:'fact',class:'reading',lease_id:lease.lease_id,
    effective:{local_date:'2026-09-04',local_time:'12:01',utc_offset:'-04:00'},payload:{lb:{value:161,unit:'lb'}}},config.identityKeys.first);
   const db=afterSecondRead(async()=>assert.equal((await bridge.invokeScoped('firstSubject',actor,'admit',['first',next])).status,'ACCEPTED'));
   const r=await race(db);assert(db.didFire());assert.equal(r.response.status,200);assert.equal(r.body.head,2);assert.equal(r.body.receipts.length,2);
   assert.equal((await r.boundary.acceptCurrentHead(r.body)).accepted,true);
  });
  await check('REAL-D1 race subject ownership change refuses old scope',async()=>{
   const db=afterSecondRead(async()=>{await runtime.db.batch([runtime.db.prepare("DELETE FROM authority_subjects WHERE subject='secondSubject'"),runtime.db.prepare("UPDATE authority_subjects SET athlete='second' WHERE subject='firstSubject'"),runtime.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1')]);});
   const r=await race(db);assert(db.didFire());assert.equal(r.response.status,403);assert.equal(r.body.error.state,17);
   await runtime.db.batch([runtime.db.prepare("UPDATE authority_subjects SET athlete='first' WHERE subject='firstSubject'"),runtime.db.prepare("INSERT INTO authority_subjects(subject,athlete) VALUES('secondSubject','second')"),runtime.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1')]);
  });
  await check('REAL-D1 race revocation refuses old scope',async()=>{
   const db=afterSecondRead(async()=>{await bridge.invoke('revokeDevice',['first',actor]);});
   const r=await race(db);assert(db.didFire());assert.equal(r.response.status,403);assert.equal(r.body.error.state,17);
  });
  const pins=Object.fromEntries(['worker.cjs','crypto.cjs','public-client.cjs'].map(n=>[n,createHash('sha256').update(fs.readFileSync(path.join(sourceDirectory,n))).digest('hex')]));
  fs.writeFileSync(path.join(outputDirectory,'result.json'),JSON.stringify({scope:'Actual local D1 and local HTTP; real signatures/core; durable sink and async-race scheduling explicitly stubbed, not IDB/CLOCK/issuance/phone acceptance',results,pins},null,2)+'\n');
  console.log('CURRENT-HEAD CANDIDATE: '+results.length+'/'+results.length+' PASS');
 }finally{if(host)await host.close();await runtime.close();}
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});
