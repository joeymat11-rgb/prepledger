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
  const active=()=>root.querySelector('.prepared-active-slot')?.textContent;
  ok(active()?.includes('40 lb')&&!active().includes('45 lb'),'current instructions select exact first slot, not the entire workout');
  ok(active().includes('Unknown (unknown)')&&active().includes('At least 3'),'unknown and bounded effort remain original display values');
  f.latest().slots[0].load.display='producer mutation';
  const hold=holdWrite();submit();await hold.entered;
  ok(root.querySelector('.wcp-status').textContent==='Saving…','actual held transaction has no early Saved');
  root.querySelector('.wcp-next').click();
  ok(active()?.includes('40 lb')&&!active().includes('producer mutation'),'pending Start cannot advance or replace immutable current instructions');
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
  ok(active()?.includes('45 lb')&&!active().includes('40 lb'),'explicit Next selects original next-set load within the same lineage');
  ok([...root.querySelectorAll('.wcp-entry input')].every(x=>x.value==='')&&f.produced()===1&&f.writes()===2,'display advance neither prefills performed facts nor regenerates or writes');
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
   const recoveredRepo=await W.openRepository(f.setup),recoveredClient=W.createDurablePublicClient({...f.args,repository:recoveredRepo});
   const history=await recoveredClient.readWorkoutHistory();
   ok(history.read===true&&JSON.stringify(history.history.sessions[0].original)===original&&history.history.sessions[0].records[0].operation.payload.load.value===40.5&&history.history.continuation.allowed===false&&JSON.stringify(await recoveredRepo.load())===JSON.stringify(after)&&f.produced()===1,'fresh native client recovers original instructions and stored set without changing history or granting resume');recoveredRepo.close();
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
   const normal=await fixture(),normalHost=W.mountPreparedWorkoutPanel(root,{client:normal.client,plannedSplitSlotId:'synthetic-slot'});await normalHost.ready;submit();await wait(()=>root.querySelector('.wcp-status').textContent.startsWith('Saved'));
   const finish=root.querySelector('.wcp-finish');finish.dispatchEvent(new Event('click'));
   ok(finish.hidden&&normal.writes()===1,'normal Finish unavailable before recorded entries and never commits implicitly');
   for(let i=0;i<3;i++){
    if(i===1){root.querySelector('.wcp-options summary').click();root.querySelector('[name=skipReason]').value='Time';root.querySelector('.wcp-skip').requestSubmit();await wait(()=>root.querySelector('.wcp-status').textContent.includes('explicitly skipped'));}
    else{root.querySelector('[name=load]').value=String(40+i);root.querySelector('[name=reps]').value='8';root.querySelector('.wcp-entry').requestSubmit();await wait(()=>root.querySelector('.wcp-status').textContent.includes('set logged'));}
    if(i<2)root.querySelector('.wcp-next').click();
   }
   ok(!finish.hidden&&!finish.disabled&&normal.writes()===4,'two actual Sets and one Skip expose explicit Finish without a hidden Close');
   const finishHold=holdWrite();finish.click();await finishHold.entered;
   ok(root.querySelector('.wcp-status').textContent==='Saving…'&&finish.disabled,'normal Finish waits for actual IndexedDB completion');finishHold.release();await wait(()=>root.querySelector('.wcp-status').textContent.includes('workout finished'));
   finish.dispatchEvent(new Event('click'));const finalStore=await normal.repo.load(),normalHistory=await normal.client.readWorkoutHistory(),closes=Object.values(finalStore.generation.collections.ops).filter(x=>x.kind==='session-close');
   ok(closes.length===1&&closes[0].payload.completion_kind==='normal'&&normal.writes()===5&&normal.produced()===1&&normalHistory.history.sessions[0].projection.facts.length===2&&normalHistory.history.sessions[0].projection.skipped_record_ids.length===1&&normalHistory.history.sessions[0].projection.close_records[0].kind==='normal','normal Finish persists once and preserves performed versus skipped history');normalHost.dispose();normal.repo.close();
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
 for(const [width,fontSize] of [[390,16],[320,16],[390,32],[320,32]]){
  await page.setViewportSize({width,height:844});await page.evaluate(size=>document.documentElement.style.fontSize=size+'px',fontSize);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'prepared screen fits viewport');
  const target=await page.locator('.prepared-active-slot').boundingBox(),entry=await page.locator('.wcp-entry').boundingBox();
  assert(target.y+target.height<=entry.y+1,'original instructions precede performed entry');
  assert.equal(await page.locator('.prepared-strip [aria-current=step]').textContent(),'Entry 2');
  await page.screenshot({path:join(artifacts,`active-${width}-${fontSize}.png`),fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='16px');
 await page.locator('.wcp-options summary').click();await page.getByRole('button',{name:'Skip this set',exact:true}).click();
 assert.equal(await page.evaluate(()=>document.activeElement.name),'skipReason');assert.equal(await page.locator('.wcp-options').evaluate(x=>x.open),true);
 assert((await page.locator('.wcp-status').textContent()).includes('Choose a reason'));presentation.push('missing skip reason stays visible and focuses the real field');
 await page.getByRole('button',{name:'Finish early',exact:true}).click();
 assert.equal(await page.evaluate(()=>document.activeElement.name),'closeChoice');assert((await page.locator('.wcp-status').textContent()).includes('Choose early finish'));
 presentation.push('early-close confirmation stays visible and focuses the real choice');
 const all=await page.evaluate(()=>window.continuePanelProof());assert.equal(all.length,32);assert.deepEqual(errors,[]);
 const observer=await page.evaluate(async()=>{
  const W=await import('/app.js'),root=document.querySelector('#root'),seen=[];
  const selection={planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN',logical_set_slot:'one',lift_lineage_id:'same',label:'Same label'};
  let calls=0,resolve;
  const handle=W.mountWorkoutCommandPanel(root,{selection,additionalSlots:[{logical_set_slot:'two',lift_lineage_id:'same',label:'Same label'}],
   client:{execute(){calls++;return new Promise(r=>{resolve=r;});}},onActiveSlotChange(s){seen.push(s);if(s.index===1)throw Error('synthetic display failure');}});
  const check=(v,n)=>{if(!v)throw Error('Observer check: '+n);};
  check(seen.length===1&&Object.isFrozen(seen[0])&&Object.keys(seen[0]).sort().join(',')==='count,index,lift_lineage_id,logical_set_slot','only frozen copied identity/navigation primitives');
  selection.logical_set_slot='mutated';check(seen[0].logical_set_slot==='one','host mutation cannot change observer snapshot');
  const next=root.querySelector('.wcp-next');next.click();check(seen.length===1&&calls===0,'unstarted Next inert');
  root.querySelector('.wcp-start').requestSubmit();resolve({acknowledged:true,op_id:'start'});await new Promise(r=>setTimeout(r,0));
  root.querySelector('[name=load]').value='40';root.querySelector('[name=reps]').value='8';root.querySelector('.wcp-entry').requestSubmit();next.click();
  check(seen.length===1,'pending set cannot advance');resolve({acknowledged:false,state:3});await new Promise(r=>setTimeout(r,0));next.click();check(seen.length===1,'failed set cannot advance');
  root.querySelector('.wcp-entry').requestSubmit();resolve({acknowledged:true,op_id:'set'});await new Promise(r=>setTimeout(r,0));next.click();
  check(seen.length===2&&seen[1].logical_set_slot==='two'&&root.querySelector('.wcp-status').textContent.includes('could not be displayed')&&root.querySelector('.wcp-log').disabled,'display exception blocks further logging with named error');
  handle.dispose();next.click();check(seen.length===2&&root.children.length===0,'disposed Next cannot notify or paint');return 7;
 });assert.equal(observer,7);assert.deepEqual(errors,[]);
 for(const input of built.inventory)assert.equal(createHash('sha256').update(readFileSync(join(source,input.path))).digest('hex'),input.sha256,'source changed during proof');
 writeFileSync(join(artifacts,'evidence.json'),JSON.stringify({checks:all,presentation,observerChecks:observer,activeLayouts:['390/16','320/16','390/32','320/32'],browser:await browser.version(),inputs:built.inventory,limits:['synthetic producer/guard/unissued profile','desktop Chromium, not iPhone','same-client remount refuses until external host reconciliation','no normal Finish/corrections/authority recovery qualification']},null,2)+'\n');
 console.log('UI DISCLOSURES PASS — '+presentation.length+' native presentation checks; keyboard, correction focus, saved-only feedback and blank performed fields');
 console.log('ACTIVE SLOT PASS — 5 actual prepared-display checks + 7 controlled observer checks; exact slot identity, frozen original values, no prefill/write, blocked advancement and failed-display refusal');
 console.log('PREPARED PANEL PASS — 32 native lifecycle/display/history checks plus keyboard original-instructions disclosure; actual prepared Start/multiple Sets/Skip/normal Finish, held IndexedDB/no early Saved, original capture, lost-reply reconciliation, disposal/standing, encrypted reopen and original-fact recovery; synthetic producer/guard, resume still unqualified');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
