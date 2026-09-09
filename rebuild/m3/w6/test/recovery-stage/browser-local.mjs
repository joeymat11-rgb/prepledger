import {buildBrowser} from '../../build-browser.mjs';
import {chromium} from 'playwright-core';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {mkdtemp,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const r1=process.env.EARNED_ROWS_R1_ROOT;if(!r1)throw Error('Use pinned recovery runner');
const root=resolve(import.meta.dirname,'../..'),require=createRequire(join(r1,'rebuild/m3/w5/package.json'));
const C=require('./reconciliation/codec.cjs'),P=require('./reconciliation/paged-codec.cjs'),S=require('./crypto.cjs');
const runtime=await require('./test/r1-workerd.cjs').createR1Runtime({p1:true});
let server,browser;
try{
 await runtime.bridge.initializeR1({first:{plan:{},devices:{}}},{'subject-first':'first'});
 const lease=(await runtime.bridge.enrollScoped('subject-first',{intent_id:'native-local',schema_version:1,nonce:P.hash('synthetic','native-local')})).payload.issuance.lease;
 const other=(await runtime.bridge.enrollScoped('subject-first',{intent_id:'native-other',schema_version:1,nonce:P.hash('synthetic','native-other')})).payload.issuance.lease;
 const remote=require('../../client/ops.cjs').build({op_id:'synthetic-native-other',athlete_id:'first',device_id:other.device_id,device_seq:1,parents:[],kind:'plan-mutation',class:'plan',lease_id:other.lease_id,effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},payload:null,plan:{domain:'protein',members:[{field:'protein_g',value:155,unit:'g/day',provenance:'athlete_edited'}]}},runtime.identityKeys.first);
 assert.equal((await runtime.bridge.invokeScoped('subject-first',other.device_id,'admit',['first',remote])).status,'ACCEPTED');
 const expectedSourceState=await runtime.bridge.invokeScoped('subject-first',other.device_id,'planState',['first','protein']);
 const key=S.publicKeyOf(runtime.authorityKey),scopeDigest=C.scopeDigest({issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0],subject:'subject-first',athleteId:'first',actorDeviceId:lease.device_id});
 const buildDir=await mkdtemp(join(tmpdir(),'earned-local-browser-build-')),entry=join(buildDir,'entry.mjs'),outfile=join(buildDir,'browser.js');
 await writeFile(entry,`import {openRepository} from ${JSON.stringify(join(root,'repository.mjs'))};import {createDurablePublicClient} from ${JSON.stringify(join(root,'public-client.mjs'))};import T2 from ${JSON.stringify(join(root,'t2-stage.cjs'))};import Client from ${JSON.stringify(resolve(root,'../../client/index.cjs'))};import {createRowsRecovery,createRowsFetcher} from ${JSON.stringify(join(root,'recovery-transport.mjs'))};import C from ${JSON.stringify(join(r1,'rebuild/m3/w5/reconciliation/codec.cjs'))};import P from ${JSON.stringify(join(r1,'rebuild/m3/w5/reconciliation/paged-codec.cjs'))};window.LocalTest={openRepository,createDurablePublicClient,T2,Client,createRowsRecovery,createRowsFetcher,C,P};`);
 await buildBrowser({entryPoints:[entry],outfile});const bundle=await readFile(outfile,'utf8');
 server=createServer(async(req,res)=>{try{res.setHeader('Cache-Control','no-store');if(req.url==='/bundle.js'){res.setHeader('Content-Type','application/javascript');res.end(bundle);return;}if(req.method==='POST'){
   const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);
   if(req.url==='/synthetic-admit'){const op=JSON.parse(body);const result=await runtime.bridge.invokeScoped('subject-first',lease.device_id,'admit',['first',op]);res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));return;}
   if(req.url==='/reconcile/rows'){const reply=await fetch(new URL(req.url,runtime.url),{method:'POST',headers:{'Content-Type':'application/json',Origin:runtime.issuer.config.origins[0],Authorization:'Bearer '+runtime.issuer.token('subject-first')},body});res.statusCode=reply.status;res.setHeader('Content-Type',reply.headers.get('Content-Type')||'application/json');res.end(Buffer.from(await reply.arrayBuffer()));return;}
 }res.setHeader('Content-Type','text/html');res.end('<!doctype html><meta charset=utf-8><script type=module src=/bundle.js></script>');}catch{res.statusCode=500;res.end('synthetic harness failed');}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({headless:true,executablePath:process.env.W6_BROWSER_BIN||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port);
 const checks=await page.evaluate(async({lease,key,scopeDigest,identityKey,remote,expectedSourceState})=>{
  const {openRepository,createDurablePublicClient,T2,Client,createRowsRecovery,createRowsFetcher,C,P}=window.LocalTest,checks=[];
  const ok=(condition,name)=>{if(!condition)throw Error(name);checks.push(name);};
  const aes=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  const setup={databaseName:'synthetic-native-local',namespace:'first/'+lease.device_id,keyProvider:()=>aes,authorizeEnrollment:e=>e==='synthetic'};
  const repo=await openRepository(setup);await repo.initialize({collections:{meta:{checkpoint:{counts:{ops:0,outbox:0}}},sync:{snapshot:{plan:{},reads:[]},frontier:{W:0,authorityW:0}}},metadata:{authorityLease:lease}},'synthetic');
  const args={repository:repo,stage:T2.createT2Stage(()=>({athleteId:'first',deviceId:lease.device_id,identityKey,clock:{now:()=>lease.not_before,today:()=>lease.not_before.slice(0,10),tz:'+00:00',monotonicMs:()=>0},lease,standing:'enrolled',online:false,contract:{client:'1',required:'1'}}),{allowInbound:true}),namespace:setup.namespace,athleteId:'first',deviceId:lease.device_id,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,observationGuard:{run:async(_kind,action)=>action()},validateCommit:()=>null,keys:[key],crypto,permissionNowIso:()=>lease.not_before,recovery:{codec:C,protocol:P,scopeDigest}};
  const client=createDurablePublicClient(args);ok((await client.execute('weighIn',{lb:170})).acknowledged,'native first operation acknowledged');ok((await client.execute('weighIn',{lb:171})).acknowledged,'native second operation acknowledged');
  const before=await repo.load(),ops=Object.values(before.generation.collections.ops);const disposition=await(await fetch('/synthetic-admit',{method:'POST',body:JSON.stringify(ops[0])})).json();ok(disposition.status==='ACCEPTED','actual local D1 accepted first original');
  const prepared=await client.prepareLocalRecovery();ok(prepared.prepared,'native public client authenticates recovery basis');const basis=prepared.basis;
  const stage=repo.recovery({codec:C,protocol:P,verificationKeys:[key],validateContext:()=>null}),verifier=P.createRowsVerifier({keys:[key],subtle:crypto.subtle});
  let observerFailure=null;const result=await createRowsRecovery({stage,codec:C,protocol:P,newRequest:async()=>{await basis.assertCurrent();return basis.request({nonce:C.encode64(crypto.getRandomValues(new Uint8Array(32))),contextId:P.hash('native-context','local')});},expected:r=>basis.expected(r),fetchPage:createRowsFetcher({baseURL:location.href,codec:C,protocol:P,headers:async()=>({})}),observeNegative:async(reply,context)=>{const checked=await verifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor});if(!checked.verified){observerFailure={status:reply.status,code:checked.code};throw Error('unproved synthetic ingress');}},validateProfile:input=>basis.reconcile(input)}).run();
  if(!result.evidenceReady)throw Error('Native local recovery refused '+JSON.stringify({code:result.code,reason:result.reason,observerFailure}));
  ok(result.evidenceReady&&result.evidence.localCompared,'native full HTTP recovery compares local originals');const pending=[];await result.evidence.pending(x=>pending.push(x));
  ok(pending[0].action==='TERMINAL_EVIDENCE'&&pending[1].action==='RETAIN_UNACKNOWLEDGED','native comparison distinguishes accepted and unsent');ok(JSON.stringify(pending.map(x=>x.original))===JSON.stringify(ops),'native exact originals retained');ok(JSON.stringify(await repo.load())===JSON.stringify(before),'native active generation and both outbox entries untouched');
  const proof=await result.evidence.archiveProof();
  const assembled=await result.evidence.assemble();let assembledCopy;await assembled.inspect(x=>{assembledCopy=x;});
  let sourcePlan;await assembled.inspectSourcePlan(x=>{sourcePlan=x;});
  ok(assembled.sourcePlanProjected&&C.fullEqual(sourcePlan.plan,{protein_g:155})&&C.fullEqual(sourcePlan.domains.protein,expectedSourceState)&&sourcePlan.W===2,'native recovered source plan and public HMAC commitments match actual authority');
  sourcePlan.plan.protein_g=999;await assembled.inspectSourcePlan(x=>{sourcePlan=x;});ok(sourcePlan.plan.protein_g===155,'native source-plan inspection cannot mutate retained projection');
  ok(assembled.assembled&&assembled.projectionPending&&!assembled.complete&&!assembled.activated&&!assembled.checkpoint,'native actual assembler remains inactive with plan projection pending');
  ok(Object.keys(assembledCopy.collections.outbox).length===1&&C.fullEqual(assembledCopy.collections.outbox[ops[1].op_id],before.generation.collections.outbox[ops[1].op_id]),'native candidate retains exact unacknowledged entry and drains only accepted entry');
  ok(C.fullEqual(assembledCopy.collections.ops[remote.op_id],remote)&&ops.every(op=>C.fullEqual(assembledCopy.collections.ops[op.op_id],op)),'native candidate imports exact foreign accepted original and preserves local originals');
  ok(assembledCopy.collections.sync.frontier.W===2&&Object.keys(assembledCopy.collections.receipts).length===2,'native candidate has contiguous verified receipts');
  ok(C.fullEqual(assembledCopy.collections.sync.snapshot.plan,{protein_g:155})&&C.fullEqual(assembledCopy.collections.sync.snapshot.planTransactionIds,sourcePlan.transactionIds)&&C.fullEqual(assembledCopy.metadata.authorityLease,before.generation.metadata.authorityLease),'native verified source plan joins candidate without a new lease');
  ok(C.fullEqual(assembledCopy.metadata.recoveryArchives,[proof])&&C.fullEqual(await repo.load(),before),'native candidate retains historical proof without active publication');
  const fresh=await openRepository(setup),reopened=createDurablePublicClient({...args,repository:fresh});ok((await reopened.prepareLocalRecovery()).prepared,'native fresh repository/client reauthenticates surviving originals');
  ok((await reopened.execute('weighIn',{lb:172})).acknowledged,'native new local write remains possible under synthetic standing');let stale;try{await result.evidence.assertCurrent();}catch(e){stale=e;}ok(stale?.code==='LOCAL_RECOVERY_CHANGED','native competing local generation refuses stale comparison');
  let staleCandidate;try{await assembled.inspect(()=>{});}catch(e){staleCandidate=e;}ok(staleCandidate?.code==='LOCAL_RECOVERY_CHANGED','native candidate cannot be consumed after a competing local write');
  ok(result.evidence.complete===false&&result.evidence.activated===false&&result.evidence.checkpoint===false,'native comparison grants no activation/checkpoint');
  const inventory=await stage.inventory(),reference=await inventory.archiveReference(),baseline=await fresh.load();
  await stage.start({expected:(await inventory.bindings()).expected,explicitRetry:true});let superseded;try{await inventory.assertCurrent();}catch(e){superseded=e;}
  ok(superseded?.code==='RECOVERY_STAGE_CHANGED','native new attempt invalidates current inventory');fresh.close();repo.close();
  const last=await openRepository(setup),archive=await last.recovery({codec:C,protocol:P,verificationKeys:[key],validateContext:()=>null}).openArchive(reference);
  let historical;try{await archive.assertCurrent();}catch(e){historical=e;}
  ok(archive.historicalOnly&&historical?.code==='RECOVERY_HISTORICAL_ONLY','native archive cannot grant current permission');
  const row=await archive.readRow('operations',ops[0].op_id);ok(JSON.stringify(C.parse(row.value).op)===JSON.stringify(ops[0]),'native reopened archive preserves exact accepted original');
  const bindings=await archive.bindings();ok(bindings.historicalOnly&&P.manifestDigest(bindings.manifest)===reference.manifestDigest,'native historical signed snapshot binding preserved');
  ok(JSON.stringify(await last.load())===JSON.stringify(baseline),'native archival reads preserve active data and all unsynced work');
  // Synthetic recovered-generation fixture through the actual receipt sink;
  // not the future assembler/activation or production observation policy.
  const candidate=structuredClone(baseline.generation),backend=Client.memoryBackend(candidate.collections),sink=Client.createClient({athleteId:'first',deviceId:lease.device_id,identityKey,backend,
   clock:{now:()=>lease.not_before,today:()=>lease.not_before.slice(0,10),monotonicMs:()=>0},authorityVerification:{verifyLease:()=>false,verifyDisposition:()=>false}});sink.boot();
  for(const seq of [1,2]){const log=C.parse((await archive.readRow('log',String(seq))).value);sink.deliverReceipts([{seq:log.seq,op_id:log.op.op_id,canonical_content_commitment:log.op.canonical_content_commitment,accepted_at:log.accepted_at,op:log.op}]);}
  candidate.collections=T2.snapshotBackend(backend,Object.keys(candidate.collections));candidate.metadata.recoveryArchives=[proof];
  candidate.collections.sync.snapshot=structuredClone(assembledCopy.collections.sync.snapshot);await last.commit(baseline,candidate);last.close();
  const final=await openRepository(setup),consumer=createDurablePublicClient({...args,repository:final});
  ok((await consumer.prepareLocalRecovery()).prepared,'native fresh public client authenticates foreign-device original from archive');
  const held=await final.load();ok(JSON.stringify(held.generation.collections.ops[remote.op_id])===JSON.stringify(remote),'native historical foreign-device bytes remain exact');
  ok(JSON.stringify(held.generation.collections.outbox)===JSON.stringify(baseline.generation.collections.outbox),'native historical authentication preserves every pending local entry');
  const changedPlan=structuredClone(held.generation);changedPlan.collections.sync.snapshot.plan.protein_g=999;await final.commit(held,changedPlan);
  const planCorrupted=await final.load(),planRefused=await createDurablePublicClient({...args,repository:final}).prepareLocalRecovery();
  ok(!planRefused.prepared&&planRefused.state===18&&planRefused.code==='RECOVERY_SNAPSHOT_DISAGREEMENT','native fresh authentication rejects changed derived plan');
  ok(C.fullEqual(await final.load(),planCorrupted),'native plan refusal publishes nothing');await final.commit(planCorrupted,held.generation);
  const changed=structuredClone(held.generation);changed.collections.ops[remote.op_id].members[0].value=999;await final.commit(await final.load(),changed);const corrupted=await final.load();
  const refused=await createDurablePublicClient({...args,repository:final}).prepareLocalRecovery();ok(!refused.prepared&&refused.state===18&&refused.code==='RECOVERY_ARCHIVE_ORIGINAL_CHANGED','native changed original cannot borrow historical proof');
  ok(JSON.stringify(await final.load())===JSON.stringify(corrupted),'native historical refusal publishes nothing');final.close();return checks;
 },{lease,key,scopeDigest,identityKey:runtime.identityKeys.first,remote,expectedSourceState});
 assert.equal(checks.length,33);const out=await mkdtemp(join(tmpdir(),'earned-native-local-recovery-'));await writeFile(join(out,'evidence.json'),JSON.stringify({checks,browser:await browser.version(),limitations:['synthetic standing and test proxy authentication','actual inactive source-plan assembler; full local projection/activation still pending','historical reopen phase uses separate synthetic recovered-generation fixture','desktop browser, not owner phones','no activation, checkpoint or production knowledge-loss policy']},null,2));console.log('LOCAL RECOVERY NATIVE PASS — 33 checks; actual public client, IndexedDB, P1/D1 HTTP, inactive candidate, historical authentication and changed-original refusal');console.log('Evidence '+out);
}finally{await browser?.close();if(server)await new Promise(r=>server.close(r));await runtime.close();}
