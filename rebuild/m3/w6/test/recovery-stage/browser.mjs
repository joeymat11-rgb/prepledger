import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import {mkdtemp,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
if(!process.env.EARNED_ROWS_R1_ROOT)throw Error('Use pinned run-recovery-stage.cjs --browser');
const r1=resolve(process.env.EARNED_ROWS_R1_ROOT),root=resolve(import.meta.dirname,'../..');
const require=createRequire(join(r1,'rebuild/m3/w5/package.json')),P=require('./reconciliation/paged-codec.cjs'),C=require('./reconciliation/codec.cjs'),S=require('./crypto.cjs');
const authority=S.generateSigningKey('native-stage'),sign=x=>({...x,authority_signature:S.signatureOver(x,authority,x.profile)}),h=P.hash('synthetic','native-stage');
const request={version:C.REQUEST_VERSION,nonce:h,context_id:h,mode:'CURRENT_DEVICE',claims:[],requested_lease_ids:[]};
const raw=[{collection:'history',row_id:'a',value:' {"text":"e\u0301","n":1.00} '},{collection:'history',row_id:'b',value:' {"synthetic":true} '}];
const manifest=sign(P.makeManifest({keyEpoch:authority.kid,scopeDigest:h,request,basisDigest:h,revision:1,storageControlDigest:h,snapshotId:h,collectionCounts:P.COLLECTIONS.map(c=>[c,raw.filter(r=>r.collection===c).length]),chainSeed:h}));
const a=P.makePage({manifest,rawRows:[raw[0]],sign}),b=P.makePage({manifest,previousCursor:a.next_cursor,rawRows:[raw[1]],sign}),end=P.makePage({manifest,previousCursor:b.next_cursor,rawRows:[],sign});
const replies=[{manifest,page:a},{manifest,page:b},{manifest,page:end,finish:P.makeFinish({manifest,page:end,sign})}];
const expected={scopeDigest:h,nonce:h,contextId:h,requestDigest:C.hash('request',C.encode(request)),basisDigest:h,claimSetDigest:P.hash('claims',[]),mode:'CURRENT_DEVICE'};
const bundled=await build({stdin:{contents:`import {openRepository} from ${JSON.stringify(join(root,'repository.mjs'))};import {validateRecoveryProfile} from ${JSON.stringify(join(root,'recovery-profile.mjs'))};import {createRowsRecovery,createRowsFetcher} from ${JSON.stringify(join(root,'recovery-transport.mjs'))};import Public from ${JSON.stringify(join(r1,'rebuild/m3/w5/public-client.cjs'))};import P from ${JSON.stringify(join(r1,'rebuild/m3/w5/reconciliation/paged-codec.cjs'))};import C from ${JSON.stringify(join(r1,'rebuild/m3/w5/reconciliation/codec.cjs'))};window.StageTest={openRepository,P,C,Public,validateRecoveryProfile,createRowsRecovery,createRowsFetcher};`,resolveDir:root},bundle:true,platform:'browser',format:'iife',write:false,logLevel:'silent'});
const runtime=await require('./test/r1-workerd.cjs').createR1Runtime({p1:true}),profileReplies=[];
let profileExpected,profileKey;
try{
 await runtime.bridge.initializeR1({first:{plan:{},devices:{}}},{'subject-first':'first'});
 const enrolled=await runtime.bridge.enrollScoped('subject-first',{intent_id:'native-profile',schema_version:1,nonce:h}),lease=enrolled.payload.issuance.lease;
 for(let n=1;n<=2;n++){const op=require('../../client/ops.cjs').build({op_id:'native-profile-'+n,athlete_id:'first',device_id:lease.device_id,device_seq:n,predecessor:n===1?null:'native-profile-1',parents:[],kind:'fact',class:'reading',lease_id:lease.lease_id,effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},payload:{lb:{value:160,unit:'lb'}}},runtime.identityKeys.first);assert.equal((await runtime.bridge.invokeScoped('subject-first',lease.device_id,'admit',['first',op])).status,'ACCEPTED');}
 profileExpected={...expected,scopeDigest:C.scopeDigest({issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0],subject:'subject-first',athleteId:'first',actorDeviceId:lease.device_id})};
 let body={profile:P.DOMAINS.begin,device_id:lease.device_id,request,basis_digest:h};
 for(let i=0;i<16;i++){const reply=await runtime.request('/reconcile/rows',body);assert.equal(reply.status,200);profileReplies.push(reply.body);if(reply.body.finish)break;body={profile:P.DOMAINS.continue,device_id:lease.device_id,manifest:reply.body.manifest,cursor:reply.body.page.next_cursor};}
 assert(profileReplies.at(-1).finish);profileExpected={stage:profileExpected,consumer:{athleteId:'first',actorDeviceId:lease.device_id,scopeDigest:profileExpected.scopeDigest,basisDigest:h}};profileKey=S.publicKeyOf(runtime.authorityKey);
}finally{await runtime.close();}
const out=await mkdtemp(join(tmpdir(),'earned-native-recovery-'));
const server=createServer((req,res)=>{res.setHeader('Cache-Control','no-store');if(req.url==='/reconcile/rows'&&req.method==='POST'){let body='';req.on('data',chunk=>body+=chunk);req.on('end',()=>{const input=JSON.parse(body),index=input.cursor?.index||0;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(profileReplies[index]));});}else if(req.url==='/bundle.js'){res.setHeader('Content-Type','application/javascript');res.end(bundled.outputFiles[0].text);}else{res.setHeader('Content-Type','text/html');res.end('<!doctype html><meta charset="utf-8"><script src="/bundle.js"></script>');}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,executablePath:process.env.W6_BROWSER_BIN||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port);
 const checks=await page.evaluate(async({replies,expected,publicKey,raw,profileReplies,profileExpected,profileKey,request})=>{
  const {openRepository,P,C,Public,validateRecoveryProfile,createRowsRecovery,createRowsFetcher}=window.StageTest,checks=[];
  const ok=(value,name)=>{if(!value)throw Error(name);checks.push(name);};
  const gate={mode:null,release:false,denied:false,put:null},key=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  const indexed={open(...args){const request=indexedDB.open(...args);request.addEventListener('success',()=>{
   const db=request.result,transaction=db.transaction.bind(db);
   db.transaction=(...args)=>{
    const tx=transaction(...args);if(args[1]!=='readwrite'||!gate.mode)return tx;
    const store=tx.objectStore('generations'),put=store.put.bind(store),get=store.get.bind(store),objectStore=tx.objectStore.bind(tx);
    store.put=(value,key)=>{if(Array.isArray(key)){gate.put?.();if(gate.mode==='quota'&&key[2]==='row'||gate.mode==='controlquota'&&key[1]==='transport')throw new DOMException('Synthetic quota','QuotaExceededError');}return put(value,key);};
    store.get=key=>{const request=get(key);if(gate.mode==='deny'&&Array.isArray(key)&&key[2]==='row')request.addEventListener('success',()=>{gate.denied=true;});return request;};
    tx.objectStore=name=>name==='generations'?store:objectStore(name);
    if(gate.mode==='hold'){const keep=()=>{if(!gate.release){try{get(['earned/recovery-rows/v1','head']).onsuccess=keep;}catch{}}};keep();}
    return tx;
   };
  });return request;}};
  const options={indexedDB:indexed,crypto,databaseName:'native-stage-'+crypto.randomUUID(),namespace:'synthetic-native',keyProvider:()=>key,authorizeEnrollment:()=>true};
  const repo=await openRepository(options),initial={collections:{outbox:{pending:{original:'synthetic-unsynced'}}},metadata:{synthetic:true}};
  await repo.initialize(initial,{});const before=await repo.load();
  const config={protocol:P,codec:C,verificationKeys:[publicKey],validateContext:()=>gate.denied?{state:17,code:'SIGNED_OUT'}:null},stage=repo.recovery(config);
  await stage.start({expected});
  gate.mode='hold';let reach;const reached=new Promise(r=>{reach=r;});gate.put=reach;let acknowledged=false;
  const pending=stage.append(C.encode(replies[0])).then(value=>{acknowledged=true;return value;});await reached;
  await new Promise(resolve=>setTimeout(resolve,30));ok(!acknowledged,'held native transaction never acknowledges staged progress early');
  gate.release=true;const first=await pending;ok(first.staged&&first.complete===false,'native completed transaction grants progress only');gate.mode=null;
  repo.close();const fresh=await openRepository(options),again=fresh.recovery(config);ok((await again.progress()).pages===1,'same native IndexedDB store resumes the durable page after reopen');
  gate.mode='quota';let quota;try{await again.append(C.encode(replies[1]));}catch(e){quota=e;}gate.mode=null;
  ok(quota?.state===3,'native quota failure refuses the page');ok((await again.progress()).pages===1,'native quota abort leaves head and all indexes at previous page');
  gate.mode='deny';let denied;try{await again.append(C.encode(replies[1]));}catch(e){denied=e;}gate.mode=null;
  ok(denied?.state===17,'standing changed during IDB reads refuses at the final write cut');ok((await again.progress()).pages===1,'refused context writes no page');gate.denied=false;
  await again.append(C.encode(replies[1]));await again.append(C.encode(replies[2]));
  const inventory=await again.inventory(),rows=[];const verdict=await inventory.visit(row=>rows.push(row));
  ok(JSON.stringify(rows)===JSON.stringify(raw),'native staged visitor preserves exact original strings');
  ok(verdict.inventoryVerified&&!verdict.complete&&!verdict.activated,'native complete inventory is not account activation');
  ok(JSON.stringify(await inventory.readRow('history','a'))===JSON.stringify(raw[0]),'native encrypted indexed row lookup returns the verified original');
  ok(JSON.stringify(await fresh.load())===JSON.stringify(before),'active generation, token and unsynced outbox are byte-identical');
  const scanned=[];ok(await inventory.scan('history',row=>scanned.push(row))===2,'native bounded key cursor checks exact collection cardinality');ok(scanned.every(row=>raw.some(r=>JSON.stringify(r)===JSON.stringify(row))),'native collection cursor returns exact signed originals');
  const profileStage=fresh.recovery({...config,verificationKeys:[profileKey]}),publicVerifier=Public.createPublicVerifier({keys:[profileKey],subtle:crypto.subtle}),rowVerifier=P.createRowsVerifier({keys:[profileKey],subtle:crypto.subtle});let calls=0,observed=0;
  const fetcher=createRowsFetcher({baseURL:location.href,codec:C,protocol:P,headers:async()=>({})});
  const flow={stage:profileStage,codec:C,protocol:P,newRequest:async()=>request,expected:async()=>({...profileExpected.stage,...profileExpected.consumer}),fetchPage:async(body,options)=>{calls++;return fetcher(body,options);},observeNegative:async(reply,context)=>{if(!(await rowVerifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor})).verified)throw Error('unproved native ingress');observed++;},validateProfile:args=>validateRecoveryProfile({...args,codec:C,protocol:P,publicVerifier})};
  gate.mode='controlquota';const refused=await createRowsRecovery(flow).run({explicitRetry:true});gate.mode=null;ok(!refused.evidenceReady&&calls===0,'native quota on durable attempt marker prevents any fetch');
  const result=await createRowsRecovery(flow).run({explicitRetry:true}),profile=result.evidence;if(!result.evidenceReady)throw Error('Native flow refused '+JSON.stringify({reason:result.reason,calls,observed}));ok(result.evidenceReady&&result.complete===false&&result.activated===false,'native finite controller returns evidence without activation');ok(observed===calls&&calls===profileReplies.length,'native HTTP fetcher sends every response through signature ingress');
  ok(profile.profileVerified&&(await profile.summary()).W===2,'actual Worker/D1/P1 HTTP originals validate relationally with original signatures in native browser');ok(profile.complete===false&&profile.activated===false,'native profile interpretation does not grant activation');
  const priorCalls=calls;ok((await createRowsRecovery(flow).run()).reason==='EXPLICIT_RETRY_REQUIRED'&&calls===priorCalls,'native reopened controller cannot silently restart a surviving attempt');
  ok(JSON.stringify(await fresh.load())===JSON.stringify(before),'native complete profile interpretation leaves active outbox and generation untouched');fresh.close();return checks;
 },{replies,expected,publicKey:S.publicKeyOf(authority),raw,profileReplies,profileExpected,profileKey,request});
 assert.equal(checks.length,20);await writeFile(join(out,'evidence.json'),JSON.stringify({checks,browser:await browser.version(),limitations:['desktop Chromium, not owner iPhone','native fetcher uses loopback replay of actual Worker/D1/P1-produced signed originals','synthetic verified ingress callback, not durable production knowledge policy','no activation or phone key-custody qualification']},null,2));
 console.log('RECOVERY TRANSPORT NATIVE PASS — 20 checks; actual Worker/D1/P1 originals through native HTTP fetcher/IndexedDB/crypto/controller, quota and retry fences; NOT production negative-ingress, activation or phone acceptance');
 console.log('Evidence '+out);
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
