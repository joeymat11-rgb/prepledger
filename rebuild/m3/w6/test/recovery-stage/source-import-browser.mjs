// Synthetic actual Chrome storage/relaunch + workerd source recovery witness.
// The installed seeded engine runs ONLY in this Node harness. Its synthetic
// prepared bytes cross into the browser; no engine/authority private code does.
import {buildBrowser} from '../../build-browser.mjs';
import {parseStrictJson} from '../../strict-json.mjs';
import {chromium} from 'playwright-core';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {mkdtemp,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const r1=process.env.EARNED_ROWS_R1_ROOT,m4=process.env.EARNED_IMPORT_M4_ROOT;
if(!r1||!m4)throw Error('Use run-source-import.cjs with --browser');
const root=resolve(import.meta.dirname,'../..'),require=createRequire(join(r1,'rebuild/m3/w5/package.json'));
const C=require('./reconciliation/codec.cjs'),P=require('./reconciliation/paged-codec.cjs').createSourceRowsCodec(),S=require('./source/codec.cjs');
const Sign=require('./crypto.cjs'),Ops=require('../../client/ops.cjs');
const runtime=await require('./test/r1-workerd.cjs').createR1Runtime({p1:true,sourceProfile:S.PROFILE});
const dir=await mkdtemp(join(tmpdir(),'earned-source-browser-'));let server,browser;
try{
  await runtime.bridge.initializeR1({first:{plan:{},devices:{}}},{'subject-first':'first'});
  const enroll=async intent_id=>(await runtime.bridge.enrollScoped('subject-first',{intent_id,schema_version:1,nonce:P.hash('native',intent_id)})).payload.issuance.lease;
  const lease=await enroll('local'),other=await enroll('remote'),key=Sign.publicKeyOf(runtime.authorityKey);
  const scopeDigest=C.scopeDigest({issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0],subject:'subject-first',athleteId:'first',actorDeviceId:lease.device_id});
  const F=require(join(m4,'rebuild/m3/w7-preview/fixtures.cjs'));
  const engine=require(join(m4,'rebuild/engine/index.cjs')).createEngine({clock:{today:()=>F.SYNTHETIC_DAY,nowISO:()=>F.SYNTHETIC_DAY+'T12:00:00.000Z',hour:()=>12},ids:{fresh:p=>p+'synthetic'}});
  const original=new TextEncoder().encode(JSON.stringify(F.createSyntheticState(),null,2)+'\r\n');
  const prepared=require(join(m4,'rebuild/m4/import/prepare.cjs')).createImportPreparation({engine,parseStrictJson}).prepare(original,{localBytes:original});
  const input={source:Array.from(prepared.sourceBytes()),candidate:Array.from(prepared.candidateBytes()),local:Array.from(prepared.localBytes())};
  const entry=join(dir,'entry.mjs'),outfile=join(dir,'browser.js');
  await writeFile(entry,`import {openRepository} from ${JSON.stringify(join(root,'repository.mjs'))};import {createDurablePublicClient} from ${JSON.stringify(join(root,'public-client.mjs'))};import T2 from ${JSON.stringify(join(root,'t2-stage.cjs'))};import {parseStrictJson} from ${JSON.stringify(join(root,'strict-json.mjs'))};import {createRowsRecovery,createRowsFetcher} from ${JSON.stringify(join(root,'recovery-transport.mjs'))};import C from ${JSON.stringify(join(r1,'rebuild/m3/w5/reconciliation/codec.cjs'))};import BaseP from ${JSON.stringify(join(r1,'rebuild/m3/w5/reconciliation/paged-codec.cjs'))};import S from ${JSON.stringify(join(r1,'rebuild/m3/w5/source/codec.cjs'))};window.SourceTest={openRepository,createDurablePublicClient,T2,parseStrictJson,createRowsRecovery,createRowsFetcher,C,P:BaseP.createSourceRowsCodec(),S};`);
  const build=await buildBrowser({entryPoints:[entry],outfile});const bundle=await readFile(outfile);
  let sequence=0,previous=null,sourceId='native-synthetic-source',staged,activation,remote,rollback;
  const operation=payload=>{const seq=++sequence,op_id='native-source-'+seq,op=Ops.build({op_id,athlete_id:'first',device_id:other.device_id,device_seq:seq,
    predecessor:previous,parents:[],kind:'fact',class:payload.type?'event':'reading',lease_id:other.lease_id,
    effective:{local_date:'2026-09-04',local_time:'12:00',utc_offset:'-04:00'},payload},runtime.identityKeys.first);previous=op_id;return op;};
  const send=async(action,fields)=>{const reply=await runtime.request('/import',{profile:S.PROFILE,device_id:other.device_id,action,...fields});assert.equal(reply.status,200,reply.body.error?.code);return reply.body;};
  const intent=()=>({type:'source-import-intent',interval:{start:'2026-09-04',end:'2026-09-04'},source_id:sourceId,material_digest:staged.manifest.material_digest});
  server=createServer(async(req,res)=>{try{
    res.setHeader('Cache-Control','no-store');if(req.url==='/bundle.js'){res.setHeader('Content-Type','application/javascript');res.end(bundle);return;}
    if(req.method==='POST'){
      const chunks=[];for await(const chunk of req)chunks.push(chunk);const bytes=Buffer.concat(chunks);
      res.setHeader('Content-Type','application/json');
      if(req.url==='/synthetic-source'){
        const material=JSON.parse(bytes);staged=S.prepareMaterial(sourceId,material,S.frontier(()=>undefined,0));await send('manifest',{manifest:staged.manifest});
        for(let index=0;index<staged.chunks.length;index++)await send('chunk',{source_id:sourceId,index,data_b64:staged.chunks[index]});
        activation=operation(intent());await send('activate',{source_id:sourceId,expected:staged.manifest.basis,operation:activation});
        remote=operation({lb:{value:177,unit:'lb'},note:'synthetic native later remote'});
        assert.equal((await runtime.bridge.invokeScoped('subject-first',other.device_id,'admit',['first',remote])).status,'ACCEPTED');
        res.end(JSON.stringify({activation,remote}));return;
      }
      if(req.url==='/synthetic-rollback'){
        rollback=operation({...intent(),type:'source-rollback-intent',target_activation_id:activation.op_id});
        await send('rollback',{target_activation_id:activation.op_id,expected:JSON.parse(bytes),operation:rollback});res.end(JSON.stringify(rollback));return;
      }
      if(req.url==='/reconcile/rows'){
        const reply=await fetch(new URL(req.url,runtime.url),{method:'POST',headers:{'Content-Type':'application/json',Origin:runtime.issuer.config.origins[0],Authorization:'Bearer '+runtime.issuer.token('subject-first')},body:bytes});
        res.statusCode=reply.status;res.end(Buffer.from(await reply.arrayBuffer()));return;
      }
    }
    res.setHeader('Content-Type','text/html');res.end('<!doctype html><meta charset=utf-8><script type=module src=/bundle.js></script>');
  }catch{res.statusCode=500;res.end('{"error":"synthetic harness failed"}');}});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const url='http://127.0.0.1:'+server.address().port,userDataDir=join(dir,'chrome-profile');
  const launch=()=>chromium.launchPersistentContext(userDataDir,{headless:true,executablePath:process.env.W6_BROWSER_BIN||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const flow=async({phase,lease,key,scopeDigest,identityKey,input,previous})=>{
    const {openRepository,createDurablePublicClient,T2,parseStrictJson,createRowsRecovery,createRowsFetcher,C,P,S}=window.SourceTest;
    const checks=[],ok=(condition,name)=>{if(!condition)throw Error(name);checks.push(name);};
    // Fixed test-only key permits a fresh browser process. No production key or
    // account lifecycle qualification is claimed by this storage witness.
    const aes=await crypto.subtle.importKey('raw',new Uint8Array(32).fill(11),'AES-GCM',false,['encrypt','decrypt']);
    const setup={databaseName:'synthetic-native-source',namespace:'first/'+lease.device_id,keyProvider:()=>aes,authorizeEnrollment:x=>x==='synthetic'};
    const repo=await openRepository(setup);
    if(phase===1)await repo.initialize({collections:{meta:{checkpoint:{counts:{ops:0,outbox:0}}},sync:{snapshot:{plan:{},reads:[]},frontier:{W:0,authorityW:0}}},metadata:{authorityLease:lease}},'synthetic');
    const args={repository:repo,stage:T2.createT2Stage(()=>({athleteId:'first',deviceId:lease.device_id,identityKey,clock:{now:()=>lease.not_before,today:()=>lease.not_before.slice(0,10),tz:'+00:00',monotonicMs:()=>0},lease,standing:'enrolled',online:false,contract:{client:'1',required:'1'}}),{allowInbound:true}),
      namespace:setup.namespace,athleteId:'first',deviceId:lease.device_id,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,
      observationGuard:{run:async(_kind,action)=>action()},validateCommit:()=>null,keys:[key],crypto,permissionNowIso:()=>lease.not_before,recovery:{codec:C,protocol:P,sourceCodec:S,scopeDigest}};
    const client=createDurablePublicClient(args),custody=repo.importCustody({parseStrictJson,validateContext:()=>null}),sourceId='native-synthetic-source';
    const recover=async()=>{
      const prepared=await client.prepareLocalRecovery();ok(prepared.prepared,'native basis authenticates '+phase);const basis=prepared.basis;
      const stage=repo.recovery({codec:C,protocol:P,verificationKeys:[key],validateContext:()=>null}),verifier=P.createRowsVerifier({keys:[key],subtle:crypto.subtle});
      const result=await createRowsRecovery({stage,codec:C,protocol:P,newRequest:async()=>basis.request({nonce:C.encode64(crypto.getRandomValues(new Uint8Array(32))),contextId:P.hash('native-source',phase)}),
        expected:r=>basis.expected(r),fetchPage:createRowsFetcher({baseURL:location.href,codec:C,protocol:P,headers:async()=>({})}),
        observeNegative:async(reply,context)=>{ok((await verifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor})).verified,'native signed source page');},
        validateProfile:input=>basis.reconcile(input)}).run({explicitRetry:true});
      ok(result.evidenceReady,'native complete source recovery '+(result.reason||phase));return result.evidence;
    };
    let material,originals,checkpoint,rollback;
    if(phase===1){
      checkpoint=await repo.load();await custody.stage(sourceId,checkpoint,{sourceBytes:Uint8Array.from(input.source),candidateBytes:Uint8Array.from(input.candidate),localBytes:Uint8Array.from(input.local),engineContextJson:'{"build":"synthetic-installed-engine"}'});
      const held=await custody.load(sourceId),text=x=>new TextDecoder().decode(x);
      material={source_json:text(held.sourceBytes),candidate_json:text(held.candidateBytes),local_json:text(held.localBytes),checkpoint_json:JSON.stringify(held.checkpoint),engine_context_json:held.engineContextJson};
      originals=await(await fetch('/synthetic-source',{method:'POST',body:JSON.stringify(material)})).json();ok(!!originals.activation,'actual R1 binding');
      for(const lb of [171,172,173])ok((await client.execute('weighIn',{lb})).acknowledged,'native queued local save '+lb);
      const before=await repo.load(),first=await recover(),selected=await first.sourceImport(),candidate=await first.assemble();
      await candidate.inspectSourceImport(x=>ok(C.fullEqual(x.material,material)&&x.source.current.intent_op_id===originals.activation.op_id,'native exact authenticated material'));
      await candidate.inspect(x=>ok(C.fullEqual(x.collections.outbox,before.generation.collections.outbox)&&C.fullEqual(x.collections.ops[originals.remote.op_id],originals.remote),'native remote original and pending queue retained'));
      ok(C.fullEqual(await repo.load(),before),'native inspection publishes no active generation');
      rollback=await(await fetch('/synthetic-rollback',{method:'POST',body:JSON.stringify(selected.frontier)})).json();
      const rolled=await recover(),assembled=await rolled.assemble();let historical;
      await assembled.inspectSourceImport(x=>ok(x.source.current.intent_op_id===rollback.op_id&&C.fullEqual(x.material,material),'native rollback binding retains original material'));
      await assembled.inspect(x=>{historical=x;});ok(assembled.projectionPending&&!assembled.activated,'native recovery remains inactive');
      await repo.commit(await repo.load(),historical);
      let stale;try{await assembled.inspectSourceImport(()=>{});}catch(e){stale=e;}ok(stale?.code==='LOCAL_RECOVERY_CHANGED','native final local revision retires handle');
      for(const lb of [174,175])ok((await client.execute('weighIn',{lb})).acknowledged,'native later save '+lb);
    }else{
      ({material,originals,checkpoint,rollback}=previous);
      const before=await repo.load();ok(Object.keys(before.generation.collections.outbox).length===5,'fresh browser retains five pending originals');
      const held=await custody.load(sourceId);ok(C.fullEqual(held.checkpoint,checkpoint)&&C.sameBytes(held.sourceBytes,Uint8Array.from(input.source)),'fresh browser retains named source and checkpoint');
      const evidence=await recover(),assembled=await evidence.assemble();
      await assembled.inspectSourceImport(x=>ok(C.fullEqual(x.material,material)&&x.source.current.intent_op_id===rollback.op_id,'fresh browser authenticates source rollback and exact material'));
      await assembled.inspect(x=>ok(C.fullEqual(x.collections.outbox,before.generation.collections.outbox)&&C.fullEqual(x.collections.ops[originals.remote.op_id],originals.remote),'fresh browser retains remote and all pending originals'));
    }
    repo.close();return {checks,material,originals,checkpoint,rollback};
  };
  const args={lease,key,scopeDigest,identityKey:runtime.identityKeys.first,input};
  browser=await launch();let page=await browser.newPage();await page.goto(url);const first=await page.evaluate(flow,{...args,phase:1});
  await browser.close();browser=await launch();page=await browser.newPage();await page.goto(url);const second=await page.evaluate(flow,{...args,phase:2,previous:first});
  const checks=[...first.checks,...second.checks];await writeFile(join(dir,'evidence.json'),JSON.stringify({profile:'earned/source-browser/v1',checks,passed:checks.length,browser:browser.browser()?.version(),inputs:build.inventory},null,2));
  console.log('SOURCE BROWSER PASS '+checks.length+' checks; complete Chrome close/relaunch; '+dir);
}finally{
  if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));await runtime.close();
}
