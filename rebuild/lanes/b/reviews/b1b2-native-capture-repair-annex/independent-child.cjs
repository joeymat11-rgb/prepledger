'use strict';
// Invented objects only. Direct-mode cases deliberately avoid node:test bootstrap,
// while test-mode cases use four real node:test tests. No original native child.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const mode=process.env.ER_CASE,output=process.env.ER_OUTPUT,details={mode,events:[]};
let settle,early;
if(mode.startsWith('early-')){
 early=new Promise(resolve=>{settle=resolve;});
 if(mode!=='early-no-reaction')early.then(()=>{details.events.push('early-reaction');fs.writeFileSync(path.join(output,'deferred-ran.txt'),'invented callback ran\n');});
 details.promiseSymbolsBefore=Object.getOwnPropertySymbols(early).map(s=>s.description);
 if(mode==='early-frozen')Object.freeze(early);
 if(mode==='early-sealed')Object.seal(early);
 if(mode==='early-nonextensible')Object.preventExtensions(early);
 details.extensibleBefore=Object.isExtensible(early);
}
const helper=require(path.resolve(__dirname,'../../../../..','rebuild/m4/workout/test/b1b2-evidence.cjs'));
const originalEmit=process.emit,originalDescriptor=Object.getOwnPropertyDescriptor(process,'emit');
if(mode==='normal-own-descriptor')Object.defineProperty(process,'emit',{value:originalEmit,writable:false,enumerable:false,configurable:true});
const beforeDescriptor=Object.getOwnPropertyDescriptor(process,'emit');
function execute(){
 const before=Object.fromEntries(helper.READERS.map(k=>[k,{value:1}])),after=structuredClone(before);
 if(mode==='reader-fail')after.nowModel.value=2;
 helper.approvedNativeDifference('second-readers',before,after);
 fs.writeFileSync(path.join(output,'writer-reached.txt'),'yes\n');
 const a={reads:[],trend:1},b=structuredClone(a);if(mode==='writer-fail')b.trend=2;
 helper.approvedNativeDifference('second-applyRead',a,b);
 details.objectsUnchanged=JSON.stringify(before)===JSON.stringify(Object.fromEntries(helper.READERS.map(k=>[k,{value:1}])));
 const wrongReceiver={};assert.equal(Reflect.apply(process.emit,wrongReceiver,['invented-event']),false);
 if(mode==='manual-exit')process.emit('exit',0);
 process.on('exit',()=>{
  details.events.push('exit-listener');
  if(mode.startsWith('early-'))settle();
  if(mode==='microtask')queueMicrotask(()=>{details.events.push('microtask');fs.writeFileSync(path.join(output,'deferred-ran.txt'),'yes\n');});
  if(mode==='nested-promise')Promise.resolve().then(()=>Promise.resolve().then(()=>{fs.writeFileSync(path.join(output,'deferred-ran.txt'),'yes\n');}));
  if(mode==='next-tick')process.nextTick(()=>{fs.writeFileSync(path.join(output,'deferred-ran.txt'),'yes\n');});
  if(mode==='late-observation')helper.approvedNativeDifference('second-readers',before,after);
  if(mode==='nested-exit'&&!details.nested){details.nested=true;process.emit('exit',0);}
  if(mode==='lost-emitter')process.emit=function laterReplacement(){return true;};
  if(mode==='late-unlink-replacement'){const original=fs.unlinkSync;fs.unlinkSync=function replacement(p){return original(p);};}
  if(mode==='exit-throw')throw Error('INVENTED_EXIT_THROW');
  if(early)details.promiseSymbolsAtExit=Object.getOwnPropertySymbols(early).map(s=>s.description);
  fs.writeFileSync(path.join(output,'details.json'),JSON.stringify(details,null,2)+'\n');
 });
 if(mode==='late-marker-io'){
  const original=fs.readFileSync;fs.readFileSync=function(file,...args){if(process._exiting&&String(file).endsWith('capture-manifest.json'))throw Error('INVENTED_MARKER_IO');return Reflect.apply(original,this,[file,...args]);};
 }
 if(mode==='cleanup-microtask'){
  const original=fs.lstatSync;let scheduled=false;fs.lstatSync=function(file,...args){if(process._exiting&&!scheduled&&String(file).endsWith('capture-manifest.json')){scheduled=true;queueMicrotask(()=>{fs.writeFileSync(path.join(output,'deferred-ran.txt'),'cleanup callback\n');});}return Reflect.apply(original,this,[file,...args]);};
 }
 // A beforeExit listener can see the wrapper but is not treated as termination.
 process.once('beforeExit',()=>{fs.writeFileSync(path.join(output,'before-exit.json'),JSON.stringify({originalEmit:process.emit===originalEmit,originalOwn:!!originalDescriptor,beforeOwn:!!beforeDescriptor})+'\n');});
}
if(process.env.ER_DIRECT==='1'){
 process.stdout.write('TAP version 13\n');
 for(let i=1;i<=3;i++){assert.equal(i,i);process.stdout.write('ok '+i+' - invented synchronous assertion '+i+'\n');}
 execute();process.stdout.write('ok 4 - actual helper comparison\n1..4\n# tests 4\n# suites 0\n# pass 4\n# fail 0\n# cancelled 0\n# skipped 0\n# todo 0\n# duration_ms 1\n');
}else{
 const test=require('node:test');for(let i=1;i<=3;i++)test('invented assertion '+i,()=>assert.equal(i,i));test('actual helper comparison',execute);
}
