import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,existsSync,mkdtempSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {buildBrowser} from '../build-browser.mjs';
import {O,initial,config} from './support.mjs';
const require=createRequire(import.meta.url),here=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const Sign=require('../../w5/crypto.cjs'),{chromium}=require('playwright-core');
if(!process.env.W6_BROWSER_BIN||!existsSync(process.env.W6_BROWSER_BIN)){console.log('PREPARED WORKOUT BROWSER BLOCKED — W6_BROWSER_BIN required');process.exit(2);}
const built=await buildBrowser({outfile:join(here,'.tmp/browser/prepared-workout.js'),entryPoints:[join(here,'browser-entry.mjs')]});
const signing=Sign.generateSigningKey('prepared-workout-synthetic'),key=Sign.publicKeyOf(signing),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2},signing);
const server=createServer((request,response)=>{if(request.url==='/app.js'){response.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});response.end(readFileSync(built.outfile));}
 else if(request.url==='/'){response.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});response.end('<!doctype html><title>Prepared workout native test</title>');}else{response.writeHead(404);response.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;let context;
try{
 context=await chromium.launchPersistentContext(mkdtempSync(join(here,'.tmp/prepared-workout-')),{executablePath:process.env.W6_BROWSER_BIN,headless:true});
 await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
 const page=await context.newPage();await page.goto(origin);const cfg=config();delete cfg.clock;
 const result=await page.evaluate(async({seed,cfg,key,lease})=>{
  const W=await import('/app.js'),capture=W.PrescriptionCapture.createPrescriptionCapture({parseStrictJson:W.parseStrictJson});
  const commands=W.WorkoutCommands.createWorkoutCommands({prescriptionCapture:capture});
  const keyMaterial=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  const setup={databaseName:'prepared-native',namespace:'synthetic/A',keyProvider:()=>keyMaterial,authorizeEnrollment:()=>true};
  const repo=await W.openRepository(setup);seed.metadata.authorityLease=lease;await repo.initialize(seed,'synthetic-only');
  const stage=W.Stage.createT2Stage(()=>({...cfg,clock:{now:()=> '2026-09-04T00:00:00Z',today:()=> '2026-09-04',tz:'+00:00',monotonicMs:()=>0}}),{allowInbound:true,workoutCommands:commands});
  let calls=0;
  const unknown=()=>({state:'unknown',display:'Unknown',source_json:null});
  const args={repository:repo,stage,namespace:setup.namespace,athleteId:'ath-1',deviceId:'dev-A',schemaVersion:2,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,
   observationGuard:{run:async(_kind,fn)=>fn()},validateCommit:()=>null,keys:[key],prescriptionCapture:capture,
   workoutProducerIdentity:{app_build:'synthetic',engine_build:'synthetic',rule_profile:'synthetic',source_schema:'synthetic'},
   resolveWorkoutBasis:()=>({plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic',causal_parents:[]}),
   workoutProducer:(_g,c)=>{calls++;return {profile:capture.profile,producer:c.producer,basis:c.basis,
    session:{instruction:unknown(),reason:unknown(),confidence:unknown()},slots:[40,45,40].map((n,i)=>({logical_set_slot:'slot-'+i,lift_lineage_id:'same',label:'Cafe\u0301',
    load:{state:'specified',display:n+' lb',source_json:` {"value":${n}.00,"unit":"lb"} `},reps:unknown(),effort:unknown(),setup:unknown(),reason:unknown(),confidence:unknown()}))};}};
  const c=W.createDurablePublicClient(args),prepared=await c.prepareWorkout({planned_split_slot_id:'synthetic-slot'});
  if(!prepared.prepared)throw Error('Preparation refused');const original=JSON.stringify(prepared.view);prepared.view.slots[0].label='caller mutation';
  let release=false,arrived;const write=new Promise(resolve=>arrived=resolve),transaction=IDBDatabase.prototype.transaction;
  IDBDatabase.prototype.transaction=function(...a){const tx=transaction.apply(this,a);if(a[1]!=='readwrite')return tx;
   const store=tx.objectStore('generations'),put=store.put.bind(store),objectStore=tx.objectStore.bind(tx);
   store.put=(value,key)=>{if(key==='active')arrived();return put(value,key);};
   tx.objectStore=name=>name==='generations'?store:objectStore(name);
   const hold=()=>{if(release)return;try{store.get('active').onsuccess=hold;}catch{}};hold();return tx;};
  let acknowledged=false;const pending=c.startPreparedWorkout({preparedId:prepared.preparedId}).then(r=>{acknowledged=r.acknowledged;return r;});
  await write;const noEarlySaved=acknowledged===false;release=true;const started=await pending;IDBDatabase.prototype.transaction=transaction;
  if(!started.acknowledged)throw Error('Start refused');const replay=await c.startPreparedWorkout({preparedId:prepared.preparedId});
  const saved=await repo.load(),op=saved.generation.collections.ops[started.op_id];
  repo.close();const fresh=await W.openRepository(setup);const reopened=await fresh.load();fresh.close();
  return {noEarlySaved,acknowledged:started.acknowledged,sameCapture:JSON.stringify(op.prescription_capture)===original,
   sameReplay:replay.op_id===started.op_id,oneOperation:Object.keys(saved.generation.collections.ops).length===1,
   oneOutbox:Object.keys(saved.generation.collections.outbox).length===1,oneProducer:calls===1,
   reopened:JSON.stringify(saved)===JSON.stringify(reopened),emptyPayload:JSON.stringify(op.payload)==='{}',
   originalUnicode:op.prescription_capture.slots[0].label==='Cafe\u0301'};
 },{seed:initial(),cfg,key,lease});
 assert.deepEqual(result,{noEarlySaved:true,acknowledged:true,sameCapture:true,sameReplay:true,oneOperation:true,oneOutbox:true,oneProducer:true,reopened:true,emptyPayload:true,originalUnicode:true});
 console.log('PREPARED WORKOUT BROWSER PASS — 10 native assertions; actual T2/P-256/AES-GCM/held IndexedDB transaction, one captured Start/outbox and exact reopen; synthetic producer/guard, unissued schema, not phone/recovery acceptance');
}finally{if(context)await context.close();await new Promise(resolve=>server.close(resolve));}
