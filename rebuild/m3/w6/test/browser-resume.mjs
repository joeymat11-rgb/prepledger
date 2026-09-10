import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,existsSync,mkdirSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {randomBytes} from 'node:crypto';
import {buildBrowser} from '../build-browser.mjs';
import {O,initial,config,Client} from './support.mjs';
const require=createRequire(import.meta.url),here=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const Sign=require('../../w5/crypto.cjs'),{chromium}=require('playwright-core');
if(!process.env.W6_BROWSER_BIN||!existsSync(process.env.W6_BROWSER_BIN)){console.log('WORKOUT RESUME BLOCKED — W6_BROWSER_BIN required');process.exit(2);}
const artifacts=process.env.W6_UI_ARTIFACT_DIR?join(resolve(process.env.W6_UI_ARTIFACT_DIR),'workout-resume'):join(here,'.tmp/workout-resume');mkdirSync(artifacts,{recursive:true});
const built=await buildBrowser({outfile:join(artifacts,'app.js'),entryPoints:[join(here,'browser-entry.mjs')]});
const signing=Sign.generateSigningKey('resume-synthetic'),key=Sign.publicKeyOf(signing),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2},signing);
// Test-run-only custody survives page disposal. Never a production key bootstrap:
// no key is committed, sent to an external origin or written to an evidence file.
const rawKey=[...randomBytes(32)],cfg=config();delete cfg.clock;
const server=createServer((request,response)=>{
 if(request.url==='/app.js'){response.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});response.end(readFileSync(built.outfile));}
 else if(request.url==='/'){response.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});response.end('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Synthetic workout resume</title><main id="root"></main></html>');}
 else{response.writeHead(404);response.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;let browser;
const checks=[],check=(value,name)=>{assert(value,name);checks.push(name);};
try{
 browser=await chromium.launch({executablePath:process.env.W6_BROWSER_BIN,headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844}}),errors=[];
 context.setDefaultTimeout(10000);
 await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
 async function open(first,options={}){
  const page=await context.newPage();page.on('pageerror',()=>errors.push('pageerror'));await page.goto(origin);
  const ready=await page.evaluate(async({first,seed,cfg,key,lease,rawKey,options})=>{
   const W=await import('/app.js'),aes=await crypto.subtle.importKey('raw',new Uint8Array(rawKey),{name:'AES-GCM'},false,['encrypt','decrypt']);
   const setup={databaseName:'resume-synthetic',namespace:'synthetic/A',keyProvider:()=>aes,authorizeEnrollment:e=>e==='synthetic-enrollment'};
   const repo=await W.openRepository(setup);if(first){const g=structuredClone(seed);g.metadata.authorityLease=lease;await repo.initialize(g,'synthetic-enrollment');}
   const capture=W.PrescriptionCapture.createPrescriptionCapture({parseStrictJson:W.parseStrictJson});
   const commands=W.WorkoutCommands.createWorkoutCommands({prescriptionCapture:capture});
   const stage=W.Stage.createT2Stage(()=>({...cfg,clock:{now:()=> '2026-09-04T00:00:00Z',today:()=> '2026-09-04',tz:'+00:00',monotonicMs:()=>0}}),{allowInbound:true,workoutCommands:commands});
   const unknown=()=>({state:'unknown',display:'Unknown',source_json:null}),cell=(n)=>({state:'specified',display:n+' lb',source_json:JSON.stringify({value:n,unit:'lb'})});
   let produced=0;
   const prescription=c=>({profile:capture.profile,producer:c.producer,basis:c.basis,
    session:{instruction:{state:'specified',display:'Synthetic workout',source_json:'"test only"'},reason:unknown(),confidence:unknown()},
    slots:[40,45,50].map((n,i)=>({logical_set_slot:'slot-'+i,lift_lineage_id:'same-lineage',label:'Synthetic lift '+i,load:cell(n),reps:unknown(),effort:unknown(),setup:unknown(),reason:unknown(),confidence:unknown()}))});
   const client=W.createDurablePublicClient({repository:repo,stage,namespace:setup.namespace,athleteId:'ath-1',deviceId:'dev-A',schemaVersion:2,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,
    observationGuard:{run:async(_kind,fn)=>fn()},validateCommit:()=>null,keys:[key],prescriptionCapture:capture,
    workoutProducerIdentity:{app_build:'synthetic',engine_build:'synthetic',rule_profile:'synthetic',source_schema:'synthetic'},
    resolveWorkoutBasis:()=>({plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic',causal_parents:[]}),
    workoutProducer:(_g,c)=>{produced++;return prescription(c);},
    workoutResumePolicy:(_g,c)=>{if(globalThis.__resumeTest?.assessmentLost)throw Error('Synthetic assessment unavailable');const now=prescription(c);now.slots[2].load=cell(35);return {allowed_actions:options.refuseSets?['skip','close']:['set','skip','close'],reason:'Synthetic current assessment; not a personal prescription',current_capture:now};}});
   const handle=W.mountPreparedWorkoutPanel(document.querySelector('#root'),{client,plannedSplitSlotId:'synthetic-slot',enableContinuation:true});
   globalThis.__resumeTest={repo,client,produced:()=>produced,handle};return handle.ready;
  },{first,seed:initial(),cfg,key,lease,rawKey,options});
  check(ready.mounted,first?'initial actual host mounted':'fresh page mounted from stored workout');return page;
 }
 const snapshot=page=>page.evaluate(async()=>{const s=await globalThis.__resumeTest.repo.load();return {ops:Object.values(s.generation.collections.ops||{}),revision:s.revision,produced:globalThis.__resumeTest.produced()};});
 const waitStatus=(page,text)=>page.waitForFunction(t=>document.querySelector('.wcp-status')?.textContent.includes(t),text);
 async function log(page,weight,reps){await page.locator('input[name=load]').fill(String(weight));await page.locator('input[name=reps]').fill(String(reps));await page.getByRole('button',{name:'Log set',exact:true}).click();await waitStatus(page,'set logged');}
 let page=await open(true);await page.getByRole('button',{name:'Start',exact:true}).click();await waitStatus(page,'start recorded');
 check(!await page.locator('.prepared-current-instructions').evaluate(x=>x.open),'unchanged current details are available without repeating the original target');
 await log(page,41.5,8);await page.getByRole('button',{name:'Next',exact:true}).click();await log(page,46,9);
 const before=await snapshot(page),start=before.ops.find(o=>o.kind==='session-start');check(before.ops.filter(o=>o.kind==='session-set').length===2,'two actual sets durably recorded before close');
 const original=JSON.stringify(start.prescription_capture);await page.close();
 page=await open(false,{refuseSets:true});check(await page.getByRole('button',{name:'Log set',exact:true}).isDisabled(),'current safety refusal disables Log set on the reopened screen');
 await page.evaluate(()=>document.querySelector('.wcp-entry').requestSubmit());
 check((await snapshot(page)).revision===before.revision,'forced form submission cannot bypass displayed safety refusal');
 await page.getByText('Workout options',{exact:true}).click();check(!await page.getByRole('button',{name:'Finish early',exact:true}).isDisabled(),'current policy can retain explicit early Finish while refusing sets');await page.close();
 page=await open(false);let recovered=await snapshot(page);
 check(recovered.produced===0,'fresh page does not regenerate original instructions or create a Start');
 check(recovered.revision===before.revision,'reopen itself makes no durable write');
 check(JSON.stringify(recovered.ops.find(o=>o.op_id===start.op_id).prescription_capture)===original,'exact original capture survives page close and reopen');
 check(await page.locator('.wcp-start').isHidden(),'Start is hidden after resuming existing identity');
 check((await page.locator('.wcp-progress').innerText()).includes('3 of 3'),'resume selects first remaining set, not a completed entry');
 check((await page.locator('.prepared-history').innerText()).includes('41.5 lb × 8 rep')&&(await page.locator('.prepared-history').innerText()).includes('46 lb × 9 rep'),'earlier performed values visibly recovered');
 check((await page.locator('.prepared-active-slot').innerText()).includes('50 lb')&&(await page.locator('.prepared-active-slot').innerText()).includes('35 lb'),'original and separately labelled current instructions both shown');
 check(await page.locator('.prepared-current-instructions').evaluate(x=>x.open),'changed current guidance opens automatically on resume');
 check((await page.locator('.prepared-strip [data-slot="slot-0"]').innerText()).includes('8 reps recorded')&&(await page.locator('.prepared-strip [data-slot="slot-1"]').innerText()).includes('9 reps recorded'),'resumed strip is rebuilt from interpreted recorded values');
 await page.screenshot({path:join(artifacts,'resumed-current-guidance-390.png'),fullPage:true});
 check((await page.locator('input[name=load]').inputValue())==='','resumed performed input is empty, never fabricated from prescription');
 check(await page.locator('.wcp-finish').isHidden(),'normal Finish unavailable while a set remains');
 await page.evaluate(()=>{globalThis.__resumeTest.assessmentLost=true;});
 await page.locator('input[name=load]').fill('36');await page.locator('input[name=reps]').fill('10');
 await page.getByRole('button',{name:'Log set',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.prepared-current-reason')?.textContent.startsWith('Current assessment unavailable'));
 check(await page.locator('.prepared-current-instructions').count()===0&&(await page.locator('.prepared-active-slot').innerText()).includes('50 lb')&&!(await page.locator('.prepared-active-slot').innerText()).includes('35 lb'),'failed current assessment withdraws its old instructions and preserves the original');
 check(await page.locator('input[name=load]').inputValue()==='36'&&await page.locator('.wcp-entry').isVisible()&&await page.getByRole('button',{name:'Log set',exact:true}).isDisabled(),'assessment failure preserves visible entered values and disables further logging');
 check((await page.locator('.wcp-status').innerText()).includes('Reopen the workout to recover')&&!(await page.locator('.wcp-status').innerText()).includes('try again'),'unavailable assessment gives recovery guidance rather than an unavailable retry');
 check((await snapshot(page)).revision===before.revision,'failed fresh assessment cannot append a Set');
 await page.screenshot({path:join(artifacts,'assessment-unavailable-390.png'),fullPage:true});
 await page.close();page=await open(false);
 await log(page,36,10);await page.getByRole('button',{name:'Finish workout',exact:true}).click();await waitStatus(page,'workout finished');
 const finished=await snapshot(page);check(finished.ops.filter(o=>o.kind==='session-start').length===1,'round trip retains exactly one Start');
 check(finished.ops.filter(o=>o.kind==='session-close').length===1&&finished.ops.find(o=>o.kind==='session-close').payload.completion_kind==='normal','one normal Close durably recorded');
 check(finished.ops.filter(o=>o.kind==='session-set').every(o=>o.session_start_op_id===start.op_id),'every set retains the original session identity');
 await page.close();page=await open(false);recovered=await snapshot(page);
 check(recovered.revision===finished.revision&&recovered.ops.length===finished.ops.length,'finished history reopen does not write or duplicate');
 check((await page.locator('.prepared-history').innerText()).includes('36 lb × 10 rep')&&(await page.locator('.prepared-history').innerText()).includes('Workout finished'),'normal Finish and all performed values survive another reopen');
 check(await page.locator('.wcp-entry').count()===0,'closed workout reopens as history, not writable unfinished work');
 await page.getByRole('button',{name:'Correct this set',exact:true}).first().click();await page.locator('.history-editor').waitFor();
 check(await page.locator('[name=correctedLoad]').inputValue()==='41.5'&&await page.locator('[name=correctedReps]').inputValue()==='8','editor reads exact current values for the chosen first set');
 check(await page.locator('.history-editor').evaluate(form=>[...form.querySelectorAll('input,select')].every(x=>parseFloat(getComputedStyle(x).fontSize)>=16)),'correction inputs remain at least16px');
 await page.evaluate(()=>document.documentElement.style.fontSize='32px');check(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),'correction editor remains within the phone-width viewport at200percent text');await page.evaluate(()=>document.documentElement.style.fontSize='');
 await page.getByRole('button',{name:'Save correction',exact:true}).click();check((await page.locator('.history-edit-status').innerText())==='No changes to save.'&&(await snapshot(page)).revision===finished.revision,'unchanged correction makes no hidden commit');
 await page.locator('[name=correctedLoad]').fill('42');await page.locator('[name=correctedReps]').fill('9');await page.locator('[name=correctedReserve]').selectOption('3+');
 await page.evaluate(()=>{
  const original=IDBDatabase.prototype.transaction;let entered=false,release=false;
  IDBDatabase.prototype.transaction=function(...args){const tx=original.apply(this,args);if(args[1]!=='readwrite')return tx;
   const store=tx.objectStore('generations'),put=store.put.bind(store),getStore=tx.objectStore.bind(tx);store.put=(value,key)=>{if(key==='active')entered=true;return put(value,key);};tx.objectStore=name=>name==='generations'?store:getStore(name);
   const hold=()=>{if(release)return;try{store.get('active').onsuccess=hold;}catch{}};hold();return tx;};
  globalThis.__correctionHold={entered:()=>entered,release(){release=true;IDBDatabase.prototype.transaction=original;}};
 });
 await page.getByRole('button',{name:'Save correction',exact:true}).click();await page.waitForFunction(()=>globalThis.__correctionHold.entered());
 check((await page.locator('.history-edit-status').innerText())==='Saving…','held real IndexedDB correction transaction never says Saved early');
 check(await page.getByRole('button',{name:'Save correction',exact:true}).isDisabled(),'pending correction cannot be submitted twice');await page.evaluate(()=>globalThis.__correctionHold.release());
 await page.waitForFunction(()=>document.querySelector('.prepared-workout-host>p').textContent.startsWith('Saved — correction'));
 let corrected=await snapshot(page);const firstSet=finished.ops.find(o=>o.kind==='session-set'),correction=corrected.ops.find(o=>o.kind==='correction');
 check(correction.target_op_id===firstSet.op_id&&correction.lift_lineage_id===firstSet.lift_lineage_id,'correction targets the exact recorded operation and lineage');
 check(JSON.stringify(corrected.ops.find(o=>o.op_id===firstSet.op_id))===JSON.stringify(firstSet),'original set operation remains byte-identical after correction');
 check(correction.payload.replacement_fields.reserve.tag==='at_least'&&correction.payload.replacement_fields.reserve.value===3,'bounded effort is recorded as a bound, not an exact value');
 check(corrected.ops.filter(o=>o.kind==='session-close').length===1&&corrected.ops.filter(o=>o.kind==='session-start').length===1,'correction does not rerun Start or normal Finish');
 await page.close();page=await open(false);check((await page.locator('.prepared-history-set').first().innerText()).includes('42 lb × 9 rep')&&(await page.locator('.prepared-history-set').first().innerText()).includes('Clean reps left: 3+'),'corrected values survive a fresh page and are visibly distinct from original');
 await page.locator('.prepared-history-set').first().getByText('Original recorded entry',{exact:true}).click();check((await page.locator('.prepared-history-set').first().innerText()).includes('41.5 lb × 8 rep'),'original recorded values remain reachable after reopen');
 await page.screenshot({path:join(artifacts,'corrected-history.png'),fullPage:true});
 check((await page.locator('.prepared-history-set').nth(1).innerText()).includes('46 lb × 9 rep')&&(await page.locator('.prepared-history-set').nth(2).innerText()).includes('36 lb × 10 rep'),'later sets survive correction unchanged');
 await page.getByRole('button',{name:'Correct this set',exact:true}).first().click();await page.locator('.history-editor').waitFor();await page.locator('[name=correctedLoad]').fill('43');
 await page.evaluate(async()=>{const r=await globalThis.__resumeTest.client.readWorkoutHistory(),set=r.history.sessions[0].projection.facts[2];await globalThis.__resumeTest.client.execute('workout',{action:'correct',input:{target_op_id:set.source_op_id,lift_lineage_id:set.lift_lineage_id,replacement_fields:{reps:{value:11,unit:'rep'}}}});});
 await page.getByRole('button',{name:'Save correction',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.history-edit-status').textContent.startsWith('History changed'));
 check(await page.locator('[name=correctedLoad]').inputValue()==='43','stale editor preserves typed value and refuses a silent rebase');
 check((await snapshot(page)).ops.filter(o=>o.kind==='correction').length===2,'stale save adds no third correction');
 await page.close();page=await open(false);await page.getByRole('button',{name:'Correct this set',exact:true}).first().click();await page.locator('.history-editor').waitFor();
 await page.getByText('Remove a mistaken entry',{exact:true}).click();await page.locator('[name=removalReason]').fill('Mistaken duplicate record');await page.getByRole('button',{name:'Remove recorded entry',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.prepared-workout-host>p').textContent.startsWith('Saved — mistaken'));
 await page.close();page=await open(false);check((await page.locator('.prepared-history-set').first().innerText()).includes('excluded from current interpretation'),'mistaken entry removal survives reopen without deleting its original');
 check((await page.locator('.prepared-history-set').nth(2).innerText()).includes('36 lb × 11 rep'),'later correction survives the earlier entry removal');
 // Feed actual historical T2 constructor output through signed pull, actual
 // browser storage and a fresh page. This is a synthetic authority, not issuance.
 const legacy=Client.createClient({...config(),deviceId:'dev-B',lease:O.lease('dev-B'),backend:Client.memoryBackend(initial().collections),transport:{}});legacy.boot();
 check(legacy.logSession({date:'2026-09-03',sets:[{lift:'Historical row',load:45,reps:8,slot:'first'}]}).acknowledged,'actual old T2 writer records legacy set');
 check(legacy.finishSession().acknowledged,'actual old T2 writer records legacy Close');
 check(legacy.correction('op-dev-B-2',{load:{value:40,unit:'lb'}}).acknowledged,'actual old T2 writer records direct legacy correction');
 const oldOps=[...legacy.model.ops.values()],prior=await snapshot(page),allOps=[...prior.ops,...oldOps];
 const receipts=allOps.map((op,i)=>Sign.signReceipt({seq:i+1,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,accepted_at:'2026-09-04T00:00:00Z',op},signing));
 const wireVersion=require('../../w5/public-client.cjs').WIRE_VERSION;
 const signed=Sign.signPull({athlete_id:'ath-1',device_id:'dev-A',after:0,through:receipts.length,receipts,wire_version:wireVersion,key_epoch:signing.kid},signing);
 const accepted=await page.evaluate(async response=>globalThis.__resumeTest.client.acceptResponse('pull',response),{wireVersion,body:signed});check(accepted.accepted,'actual browser saves signed mixed legacy/current history');
 await page.close();page=await open(false);
 const older=page.getByRole('region',{name:'Older workout records'});await older.waitFor();
 const olderText=await older.innerText();
 check(olderText.includes('Historical row (recorded label)')&&olderText.includes('40 lb × 8 rep'),'fresh actual host visibly shows corrected legacy observations and their recorded label');
 check(olderText.includes('not recorded')&&olderText.includes('completion type unknown')&&!olderText.includes('Workout ended early'),'legacy missing instructions effort and Close type are explicit without invented completion');
 check(await older.getByRole('button',{name:'Correct this set',exact:true}).count()===0,'legacy view does not enable unqualified current-schema correction');
 await older.getByText('Original recorded entry',{exact:true}).click();check((await older.innerText()).includes('45 lb × 8 rep'),'legacy original quantity remains reachable in actual host');
 const restored=await snapshot(page);check(restored.ops.length===allOps.length&&restored.produced===0,'legacy display does not create a Start or produce new instructions');
 check(JSON.stringify(restored.ops.filter(o=>oldOps.some(old=>old.op_id===o.op_id)))===JSON.stringify(oldOps),'legacy originals remain unchanged through native signed save and reopen');
 await page.screenshot({path:join(artifacts,'legacy-history-390.png'),fullPage:true});
 await page.setViewportSize({width:320,height:844});check(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),'legacy history fits320px');
 await page.evaluate(()=>document.documentElement.style.fontSize='32px');check(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),'legacy history fits320px at200percent text');
 await page.screenshot({path:join(artifacts,'legacy-history-320-large-text.png'),fullPage:true});
 check(errors.length===0,'no browser page errors');await context.close();
 console.log(`WORKOUT RESUME/CORRECT PASS — ${checks.length} checks; actual retained host/client/encrypted IndexedDB; same Start/normal Close; corrected history, immutable originals and later facts`);
 for(const name of checks)console.log('PASS '+name);
}finally{await browser?.close();await new Promise(r=>server.close(r));}
