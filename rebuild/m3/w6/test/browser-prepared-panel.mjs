import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {buildBrowser} from '../build-browser.mjs';
import {O,initial,config} from './support.mjs';
const require=createRequire(import.meta.url),here=resolve(dirname(fileURLToPath(import.meta.url)),'..'),source=resolve(here,'../../..');
const Sign=require('../../w5/crypto.cjs'),{chromium}=require('playwright-core');
if(!process.env.W6_BROWSER_BIN||!existsSync(process.env.W6_BROWSER_BIN)){console.log('PREPARED PANEL BLOCKED — W6_BROWSER_BIN required');process.exit(2);}
const artifacts=join(here,'.tmp/prepared-panel');mkdirSync(artifacts,{recursive:true});
const built=await buildBrowser({outfile:join(artifacts,'app.js'),entryPoints:[join(here,'browser-entry.mjs')]});
const signing=Sign.generateSigningKey('prepared-panel-synthetic'),key=Sign.publicKeyOf(signing),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2},signing);
const server=createServer((request,response)=>{
 if(request.url==='/app.js'){response.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});response.end(readFileSync(built.outfile));}
 else if(request.url==='/'){response.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});response.end('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Synthetic prepared workout</title><main id="root"></main></html>');}
 else{response.writeHead(404);response.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;let browser;
try{
 browser=await chromium.launch({executablePath:process.env.W6_BROWSER_BIN,headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844}});
 await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
 const page=await context.newPage(),errors=[];page.on('pageerror',()=>errors.push('pageerror'));await page.goto(origin);
 const cfg=config();delete cfg.clock;
 const checks=await page.evaluate(async({seed,cfg,key,lease})=>{
  const W=await import('/app.js'),root=document.querySelector('#root'),checks=[];
  const ok=(value,name)=>{if(!value)throw Error('Prepared panel check: '+name);checks.push(name);};
  const capture=W.PrescriptionCapture.createPrescriptionCapture({parseStrictJson:W.parseStrictJson});
  const commands=W.WorkoutCommands.createWorkoutCommands({prescriptionCapture:capture});
  let next=0;
  async function fixture(lost=false){
   const aes=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
   const setup={databaseName:'prepared-panel-'+next++,namespace:'synthetic/A',keyProvider:()=>aes,authorizeEnrollment:()=>true};
   const repo=await W.openRepository(setup),generation=structuredClone(seed);generation.metadata.authorityLease=lease;await repo.initialize(generation,'synthetic-only');
   let produced=0,latest,writeCalls=0;
   const repository={...repo,async commit(...args){writeCalls++;const result=await repo.commit(...args);if(lost){lost=false;throw Error('synthetic lost reply');}return result;}};
   const stage=W.Stage.createT2Stage(()=>({...cfg,clock:{now:()=> '2026-09-04T00:00:00Z',today:()=> '2026-09-04',tz:'+00:00',monotonicMs:()=>0}}),{allowInbound:true,workoutCommands:commands});
   const unknown=()=>({state:'unknown',display:'Unknown',source_json:null});
   const args={repository,stage,namespace:setup.namespace,athleteId:'ath-1',deviceId:'dev-A',schemaVersion:2,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,
    observationGuard:{run:async(_kind,fn)=>fn()},validateCommit:()=>null,keys:[key],prescriptionCapture:capture,
    workoutProducerIdentity:{app_build:'synthetic',engine_build:'synthetic',rule_profile:'synthetic',source_schema:'synthetic'},
    resolveWorkoutBasis:()=>({plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic',causal_parents:[]}),
    workoutProducer:(_g,c)=>{produced++;return latest={profile:capture.profile,producer:c.producer,basis:c.basis,
     session:{instruction:{state:'specified',display:'Synthetic instructions <script>bad</script>',source_json:'"synthetic"'},reason:unknown(),confidence:unknown()},
     slots:[40,45,40].map((n,i)=>({logical_set_slot:'slot-'+i,lift_lineage_id:'same',label:'Cafe\u0301 '+i,
      load:{state:'specified',display:n+' lb',source_json:` {"value":${n}.00,"unit":"lb"} `},reps:unknown(),
      effort:{state:'specified',display:'At least 3',source_json:'{"tag":"at_least","value":3,"unit":"rep"}'},setup:unknown(),reason:unknown(),confidence:unknown()}))};}};
   return {repo,setup,args,client:W.createDurablePublicClient(args),produced:()=>produced,latest:()=>latest,writes:()=>writeCalls};
  }
  const wait=async predicate=>{for(let i=0;i<1000;i++){if(predicate())return;await new Promise(r=>setTimeout(r,5));}throw Error('Prepared panel wait timed out');};
  const submit=()=>root.querySelector('.wcp-start').requestSubmit();
  function holdWrite(){
   const original=IDBDatabase.prototype.transaction;let release=false,arrived;
   const entered=new Promise(r=>arrived=r);
   IDBDatabase.prototype.transaction=function(...args){const tx=original.apply(this,args);if(args[1]!=='readwrite')return tx;
    const store=tx.objectStore('generations'),put=store.put.bind(store),objectStore=tx.objectStore.bind(tx);
    store.put=(value,key)=>{if(key==='active')arrived();return put(value,key);};tx.objectStore=name=>name==='generations'?store:objectStore(name);
    const hold=()=>{if(release)return;try{store.get('active').onsuccess=hold;}catch{}};hold();return tx;};
   return {entered,release(){release=true;IDBDatabase.prototype.transaction=original;}};
  }
  const f=await fixture(),handle=W.mountPreparedWorkoutPanel(root,{client:f.client,plannedSplitSlotId:'synthetic-slot'});
  ok((await handle.ready).mounted,'actual host mounts from one actual preparation');
  const original=JSON.stringify(f.latest());
  ok(f.produced()===1&&f.writes()===0,'preparation renders without writing');
  ok(root.textContent.includes('40 lb')&&root.textContent.includes('45 lb')&&root.textContent.includes('At least 3'),'ordered per-set prescriptions rendered');
  ok(root.textContent.includes('<script>bad</script>')&&!root.querySelector('script'),'producer strings stay text');
  ok([...root.querySelectorAll('input')].every(x=>x.value===''),'prescribed values do not prefill performed facts');
  f.latest().slots[0].load.display='producer mutation';
  const hold=holdWrite();submit();await hold.entered;
  ok(root.querySelector('.wcp-status').textContent==='Saving…','actual held transaction has no early Saved');
  ok(root.querySelector('.prepared-original summary').textContent.includes('not yet saved'),'capture caption remains unacknowledged');
  hold.release();await wait(()=>root.querySelector('.wcp-status').textContent.startsWith('Saved'));
  const saved=await f.repo.load(),op=Object.values(saved.generation.collections.ops)[0];
  ok(f.produced()===1&&f.writes()===1&&Object.keys(saved.generation.collections.ops).length===1,'one producer/build/Start commit');
  ok(JSON.stringify(op.prescription_capture)===original,'exact original capture saved despite later producer mutation');
  ok(root.querySelector('.prepared-original summary').textContent==='Original instructions — saved on this device','saved caption follows actual commit');
  const inputs=root.querySelectorAll('.wcp-entry input');inputs[0].value='40.5';inputs[1].value='8';root.querySelector('.wcp-effort select').value='3+';
  root.querySelector('.wcp-entry').requestSubmit();await wait(()=>root.querySelector('.wcp-status').textContent.includes('set logged'));
  const after=await f.repo.load(),set=Object.values(after.generation.collections.ops).find(x=>x.kind==='session-set');
  ok(set?.payload.load.value===40.5&&set.payload.reps.value===8&&set.payload.reserve.tag==='at_least','actual performed facts distinct from prescription');
  ok(set.session_start_op_id===op.op_id&&set.logical_set_slot==='slot-0','set references exact captured Start/slot');
  root.querySelector('.wcp-next').click();ok(root.querySelector('.wcp-title').textContent==='Cafe\u0301 1','same panel advances to next captured slot');
  window.panelProof={handle,f,original,after};
  // Keep the actual mounted state for a screenshot, then run remaining lifecycle cases separately.
  window.continuePanelProof=async()=>{
   handle.dispose();ok(root.children.length===0,'dispose removes old content');
   const retry=W.mountPreparedWorkoutPanel(root,{client:f.client,plannedSplitSlotId:'synthetic-slot'});
   ok((await retry.ready).code==='WORKOUT_HOST_RECONCILIATION_REQUIRED'&&!root.querySelector('button'),'same-client remount cannot duplicate unresolved/active workout');retry.dispose();
   f.repo.close();const fresh=await W.openRepository(f.setup);ok(JSON.stringify(await fresh.load())===JSON.stringify(after),'exact encrypted generation reopens');
   const reloaded=W.mountPreparedWorkoutPanel(root,{client:W.createDurablePublicClient({...f.args,repository:fresh}),plannedSplitSlotId:'synthetic-slot'});
   ok((await reloaded.ready).code==='WORKOUT_HISTORY_RECONCILIATION_REQUIRED'&&!root.querySelector('button')&&root.textContent.includes('saved workout needs to be recovered'),'fresh client mount refuses duplicate Start from actual retained workout');
   ok(JSON.stringify(await fresh.load())===JSON.stringify(after)&&f.produced()===1,'reload refusal changes neither stored facts nor original prescription');reloaded.dispose();fresh.close();
   const lost=await fixture(true),lh=W.mountPreparedWorkoutPanel(root,{client:lost.client,plannedSplitSlotId:'synthetic-slot'});await lh.ready;submit();
   await wait(()=>root.querySelector('.wcp-status').textContent.startsWith('Saved'));
   ok(lost.writes()===1&&lost.produced()===1&&Object.keys((await lost.repo.load()).generation.collections.ops).length===1,'lost reply reconciles one actual disk Start without rebuild/write');
   lh.dispose();lost.repo.close();
   const late=await fixture(),lateHost=W.mountPreparedWorkoutPanel(root,{client:late.client,plannedSplitSlotId:'synthetic-slot'});await lateHost.ready;
   const delayed=holdWrite();submit();await delayed.entered;lateHost.dispose();delayed.release();
   await wait(()=>late.writes()===1);await late.client.prepareWorkout({planned_split_slot_id:'barrier'});
   ok(root.children.length===0&&Object.keys((await late.repo.load()).generation.collections.ops).length===1,'disposal after permission does not cancel commit or paint late Saved');
   const blocked=W.mountPreparedWorkoutPanel(root,{client:late.client,plannedSplitSlotId:'synthetic-slot'});ok((await blocked.ready).mounted===false,'post-disposal issued Start requires host reconciliation');blocked.dispose();late.repo.close();
   const signedOut=await fixture(),refused=W.mountPreparedWorkoutPanel(root,{client:W.createDurablePublicClient({...signedOut.args,isCurrentSession:()=>false}),plannedSplitSlotId:'synthetic-slot'});
   ok((await refused.ready).state===17&&root.textContent.includes('Sign-in')&&!root.querySelector('button')&&signedOut.produced()===0,'known standing loss keeps instructions and Start unavailable with named recovery');refused.dispose();signedOut.repo.close();
   return checks;
  };
  return checks;
 },{seed:initial(),cfg,key,lease});
 await page.locator('.prepared-original summary').focus();await page.locator('.prepared-original summary').press('Enter');
 assert.equal(await page.locator('.prepared-original').evaluate(x=>x.open),true);
 await page.locator('.prepared-original summary').press('Enter');
 assert.equal(await page.locator('.prepared-original').evaluate(x=>x.open),false);
 const presentation=[];
 assert.equal(await page.locator('.wcp-start').isVisible(),false);presentation.push('acknowledged Start is retired visually');
 const lastRecord=await page.locator('.wcp-last-record').textContent();assert(lastRecord.includes('40.5 lb × 8'));presentation.push('last acknowledged fact stays visible');
 for(const name of ['wcp-options','wcp-readback']){
  assert.equal(await page.locator('.'+name).evaluate(x=>x.open),false);
  await page.locator('.'+name+' summary').focus();await page.locator('.'+name+' summary').press('Enter');
  assert.equal(await page.locator('.'+name).evaluate(x=>x.open),true);
  await page.locator('.'+name+' summary').press('Enter');assert.equal(await page.locator('.'+name).evaluate(x=>x.open),false);
  presentation.push(name+' is initially collapsed and keyboard-operable');
 }
 await page.getByLabel('Weight (lb)',{exact:true}).fill('77');
 assert.equal(await page.locator('.wcp-last-record').textContent(),lastRecord);await page.getByLabel('Weight (lb)',{exact:true}).fill('');
 presentation.push('unsaved typing cannot rewrite the last acknowledged fact');
 await page.screenshot({path:join(artifacts,'actual-prepared-panel.png'),fullPage:true});
 await page.locator('.wcp-options summary').click();await page.getByRole('button',{name:'Skip this set',exact:true}).click();
 assert.equal(await page.evaluate(()=>document.activeElement.name),'skipReason');assert.equal(await page.locator('.wcp-options').evaluate(x=>x.open),true);
 assert((await page.locator('.wcp-status').textContent()).includes('Choose a reason'));presentation.push('missing skip reason stays visible and focuses the real field');
 await page.getByRole('button',{name:'Finish early',exact:true}).click();
 assert.equal(await page.evaluate(()=>document.activeElement.name),'closeChoice');assert((await page.locator('.wcp-status').textContent()).includes('Choose early finish'));
 presentation.push('early-close confirmation stays visible and focuses the real choice');
 const all=await page.evaluate(()=>window.continuePanelProof());assert.equal(all.length,22);assert.deepEqual(errors,[]);
 for(const input of built.inventory)assert.equal(createHash('sha256').update(readFileSync(join(source,input.path))).digest('hex'),input.sha256,'source changed during proof');
 writeFileSync(join(artifacts,'evidence.json'),JSON.stringify({checks:all,presentation,browser:await browser.version(),inputs:built.inventory,limits:['synthetic producer/guard/unissued profile','desktop Chromium, not iPhone','same-client remount refuses until external host reconciliation','no normal Finish/corrections/authority recovery qualification']},null,2)+'\n');
 console.log('UI DISCLOSURES PASS — '+presentation.length+' native presentation checks; keyboard, correction focus, saved-only feedback and blank performed fields');
 console.log('PREPARED PANEL PASS — 22 native lifecycle checks plus keyboard original-instructions disclosure; actual prepared Start/Set/next, held IndexedDB/no early Saved, original capture, lost-reply reconciliation, disposal/standing, encrypted reopen and fresh-client duplicate refusal; synthetic producer/guard, not phone/qualified prescription');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
