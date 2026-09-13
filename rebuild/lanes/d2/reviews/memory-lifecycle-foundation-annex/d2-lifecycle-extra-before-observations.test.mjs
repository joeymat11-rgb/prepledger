import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {JSDOM} from 'jsdom';
import {faultDatabase} from '../rebuild/m3/w6/test/support.mjs';
import {createGymHost} from '../rebuild/m3/w7-preview/today/gym-host.mjs';
import {createGymModel,EFFORT_CHOICES} from '../rebuild/m3/w7-preview/today/gym-model.mjs';
import GymApp,{mountGym,newGymDraft} from '../rebuild/m3/w7-preview/today/gym-app.mjs';
import {createMachineSettingsHost} from '../rebuild/m3/w7-preview/today/machine-settings-host.mjs';
import TodayModel from '../rebuild/m3/w7-preview/today/today-model.cjs';
import design from '../rebuild/m3/w7-preview/today/design.cjs';
const DAY='2030-02-04', SLOT='earned-today-preview/'+DAY;
const EFFORT=EFFORT_CHOICES.find(x=>x.label==='2').reserve;
function gate(){let release,enter;return{wait:new Promise(r=>release=r),reached:new Promise(r=>enter=r),release:()=>release(),enter:()=>enter()};}
async function device(){
 const fault=faultDatabase(),today=TodayModel.createTodayModel({today:DAY}),state=today.stateFromOps();
 const open=()=>createGymHost({day:DAY,engineState:state,indexedDB:fault.indexedDB,crypto:webcrypto,plannedSplitSlotId:SLOT});
 const gymHost=await open(),model=createGymModel({gymHost});
 const settings=await createMachineSettingsHost({day:DAY,indexedDB:fault.indexedDB,crypto:webcrypto});
 return{fault,today,state,open,gymHost,model,settings,close(){settings.close();gymHost.close();}};
}
async function collections(kit){const {ops,outbox}=(await kit.gymHost.repository.load()).generation.collections;return{ops,outbox};}
function preserved(before,after,added){for(const kind of ['ops','outbox']){assert.equal(Object.keys(after[kind]).length,Object.keys(before[kind]).length+added);for(const [id,row]of Object.entries(before[kind]))assert.deepEqual(after[kind][id],row);}}
function wrap(host,method,handle){const original=host.host.client[method];return{...host,host:{...host.host,client:{...host.host.client,[method]:input=>handle(input,()=>original(input))}}};}
async function log(model,view){const result=await model.logSet({startId:view.startId,slot:view.set.slot,lift:view.set.lift,load:String(view.entry.load),reps:String(view.entry.reps),effort:EFFORT});assert.equal(result.ok,true,result.code);return result;}
async function allSets(model){for(let i=0;i<30;i++){const v=await model.read();if(v.complete)return v;if(v.phase==='saved'){model.forget();continue;}assert.equal(v.phase,'active');await log(model,v);model.forget();}throw Error('SYNTHETIC_SESSION_DID_NOT_COMPLETE');}
async function until(check,label){for(let i=0;i<1500;i++){if(check())return;await new Promise(r=>setTimeout(r,1));}throw Error('Timed out: '+label);}
const shell=()=>design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',design.templateHtml());
async function page(kit,{model=kit.model,draft=newGymDraft(),settings=kit.settings,dom=new JSDOM(shell()),onBack=()=>{},onChanged=()=>{}}={}){
 const doc=dom.window.document,phone=doc.getElementById('phone');
 const mounted=mountGym(doc,phone,{model,draft,settings,onBack,onChanged});await mounted;
 return{dom,doc,phone,mounted,draft,
  click(selector){const el=phone.querySelector(selector);assert.ok(el,selector);el.dispatchEvent(new dom.window.Event('click'));},
  input(selector,value){const el=phone.querySelector(selector);assert.ok(el,selector);el.value=value;el.dispatchEvent(new dom.window.Event('input',{bubbles:true}));},
  async ready(){if(mounted.settings.read())await mounted.settings.read();},
  async editor(){this.click('[data-action="settings-open"]');await until(()=>phone.querySelector('[data-settings-value="0"]')&&!phone.querySelector('[data-slot="settings-editor"]').hidden,'editor open');},
  choose(){const buttons=[...phone.querySelectorAll('[data-slot="choices"] button')];const el=buttons.find(b=>b.textContent.trim()==='2')||buttons[0];assert.ok(el);el.dispatchEvent(new dom.window.Event('click'));},
 };
}

// Each write goes through the real production handler and client. Late-ack cases
// alter only the returned envelope AFTER that actual client has committed; they
// are declared acknowledgement-loss seams, not counterfeit durable operations.
for(const kind of ['start','logSet','undo','finish','closeUnfinished'])for(const mode of ['confirmed','outcomeUnknown','stored','durable','committed','abort'])
test('D2 actual '+kind+' paused write / '+mode,async()=>{
 const kit=await device(),pause=gate();let pending,other;
 try{
  if(kind!=='start')assert.equal((await kit.model.start()).ok,true);
  let view=await kit.model.read(),opId;
  if(kind==='undo')opId=(await log(kit.model,view)).opId;
  if(kind==='finish')view=await allSets(kit.model);
  const method=kind==='start'?'startPreparedWorkout':kind==='undo'?'commitWorkoutEdit':'executeResumedWorkout';
  const handleKind=kind==='start'?'preparedId':kind==='undo'?'editId':'resumeId';
  let attempt,raw;
  const atWrite=async(input,original)=>{
   attempt=input;pause.enter();await pause.wait;
   if(mode==='abort'){kit.fault.state.mode='quota';kit.fault.state.armed=true;}
   try{raw=await original();}finally{kit.fault.state.armed=false;}
   if(mode==='abort'||mode==='confirmed')return raw;
   assert.equal(raw.acknowledged,true,'ack-loss seam follows a real confirmed commit');
   return{...raw,acknowledged:false,outcomeUnknown:mode==='outcomeUnknown',stored:mode==='stored',durable:mode==='durable',committed:mode==='committed',code:'D2_ACK_LOST_AFTER_REAL_COMMIT'};
  };
  if(kind==='closeUnfinished')other=await kit.open();
  const model=createGymModel({gymHost:wrap(kit.gymHost,method,atWrite),hostForDay:other?async()=>wrap(other,method,atWrite):undefined});
  if(kind==='start')await model.read();
  const before=await collections(kit),old=model.lifecycleState();
  const input=kind==='logSet'?{startId:view.startId,slot:view.set.slot,lift:view.set.lift,load:String(view.entry.load),reps:String(view.entry.reps),effort:EFFORT}:{startId:view.startId,opId,day:DAY};
  pending=model[kind](input);
  assert.equal(model.lifecycleState().counts[kind],1,'synchronous action submission');
  await pause.reached;
  assert.equal(model.lifecycleState().actions,1);assert.ok(model.lifecycleState().epoch>old.epoch);
  assert.deepEqual(await collections(kit),before,'client pause has not written');
  pause.release();const result=await pending;
  const snapshot=model.lifecycleState();assert.equal(snapshot.actions,0);assert.equal(snapshot.counts[kind],0);
  assert.ok(Object.isFrozen(snapshot)&&Object.isFrozen(snapshot.counts)&&Object.isFrozen(snapshot.unresolved));
  assert.equal(old.actions,0,'past lifecycle snapshots do not mutate');
  preserved(before,await collections(kit),mode==='abort'?0:1);
  if(mode==='confirmed'){assert.equal(result.ok,true,result.code);assert.equal(snapshot.uncertain,false);}
  else if(mode==='abort'){assert.equal(result.ok,false);assert.equal(raw.acknowledged,false);assert.equal(snapshot.uncertain,false,'actual transaction refusal is not unknown');}
  else{
   assert.equal(result.ok,false);assert.equal(result.outcomeUnknown,undefined,'display narrowing is unchanged');
   assert.equal(snapshot.uncertain,true,'real committed but unacknowledged write retains uncertainty');
   assert.equal(snapshot.unresolved.length,1);const row=snapshot.unresolved[0];assert.ok(Object.isFrozen(row));
   assert.equal(row.handleKind,handleKind);assert.equal(row.handleId,attempt[handleKind]);assert.equal(row.action,kind);
   for(const flag of ['outcomeUnknown','stored','durable','committed'])assert.equal(row[flag],flag===mode,'raw flag '+flag);
   await model.read();model.forget();assert.equal(model.lifecycleState().uncertain,true,'a readable committed view does not erase uncertainty');
  }
 }finally{pause.release();if(pending)await pending.catch(()=>{});other?.close();kit.close();}
});

test('D2 actual read pause and failure preserve counts, snapshots and operations',async()=>{
 for(const fails of [false,true]){
  const kit=await device(),pause=gate();let pending;
  try{
   const model=createGymModel({gymHost:wrap(kit.gymHost,'readWorkoutHistory',async(input,original)=>{pause.enter();await pause.wait;if(fails)throw Error('D2_READ_REFUSED');return original();})});
   const before=await collections(kit),old=model.lifecycleState();pending=model.read();
   assert.equal(model.lifecycleState().reads,1);await pause.reached;assert.deepEqual(await collections(kit),before);
   pause.release();if(fails)await assert.rejects(pending,/D2_READ_REFUSED/);else assert.equal((await pending).phase,'ready');
   assert.equal(model.lifecycleState().reads,0);assert.equal(model.lifecycleState().actions,0);assert.equal(model.lifecycleState().uncertain,false);
   assert.ok(model.lifecycleState().epoch>old.epoch);assert.equal(old.reads,0);assert.deepEqual(await collections(kit),before);
  }finally{pause.release();if(pending)await pending.catch(()=>{});kit.close();}
 }
});

test('D2 old actual log cannot clear a replacement mount on the same phone',async()=>{
 // The acknowledgement is delayed AFTER the real commit. Delaying before it
 // lets a later continuation read retire the old resume handle, which is the
 // unchanged client protocol, not a defect in this lifecycle stage.
 const kit=await device(),pause=gate();let first,second;
 try{
  assert.equal((await kit.model.start()).ok,true);
  const model=createGymModel({gymHost:wrap(kit.gymHost,'executeResumedWorkout',async(input,original)=>{const result=await original();assert.equal(result.acknowledged,true);pause.enter();await pause.wait;return result;})});
  const draft=newGymDraft();first=await page(kit,{model,draft});await first.ready();first.choose();
  const before=await collections(kit);first.click('[data-slot="log"]');await pause.reached;
  second=await page(kit,{draft,dom:first.dom});await second.ready();second.input('#gym-weight','');second.input('#gym-reps','');second.choose();
  const entry=draft.entry,effort=draft.effort,screen=second.phone.firstElementChild;
  pause.release();await until(()=>first.mounted.refreshState().counts.busy===0,'old log settled');
  assert.equal(draft.entry,entry,'old acknowledged write cannot erase newer entry');assert.equal(draft.effort,effort);
  assert.deepEqual(draft.entry,{load:'',reps:''});assert.equal(second.phone.firstElementChild,screen,'old log cannot reclaim phone');
  assert.equal(first.mounted.refreshState().owns,false);assert.equal(second.mounted.refreshState().draft,true);
  preserved(before,await collections(kit),1);
 }finally{pause.release();first?.dom.window.close();kit.close();}
});

test('D2 acknowledged settings save preserves an actually newer editor answer',async()=>{
 const kit=await device(),pause=gate();let p;
 try{
  assert.equal((await kit.model.start()).ok,true);
  p=await page(kit,{settings:{latest:(...args)=>kit.settings.latest(...args),save:async machine=>{pause.enter();await pause.wait;return kit.settings.save(machine);}}});
  await p.ready();await p.editor();p.input('[data-settings-name="0"]','Seat');p.input('[data-settings-value="0"]','four');
  const before=await collections(kit);p.click('[data-slot="settings-save"]');await pause.reached;
  p.input('[data-settings-value="0"]','six');const edited=p.draft.settingsEditor.draft;
  pause.release();await p.mounted.settings.pending();
  assert.equal(p.draft.settingsEditor.draft,edited,'acknowledgement must not discard a newer editor answer');
  assert.equal(edited.rows[0].value,'six');assert.equal(p.draft.settingsEditor.error,null);
  const stored=await kit.settings.latest(p.draft.settingsEditor.lift);assert.equal(stored.machine.settings[0].value,'four');
  preserved(before,await collections(kit),1);
 }finally{pause.release();p?.dom.window.close();kit.close();}
});

test('D2 independent entry edits do not prevent confirmed settings Save clearing its unchanged editor',async()=>{
 const kit=await device(),pause=gate();let p;
 try{
  assert.equal((await kit.model.start()).ok,true);
  p=await page(kit,{settings:{latest:(...args)=>kit.settings.latest(...args),save:async machine=>{pause.enter();await pause.wait;return kit.settings.save(machine);}}});
  await p.ready();await p.editor();p.input('[data-settings-name="0"]','Seat');p.input('[data-settings-value="0"]','four');
  const before=await collections(kit);p.click('[data-slot="settings-save"]');await pause.reached;
  p.input('#gym-weight','');p.input('#gym-reps','');p.choose();const effort=p.draft.effort;
  pause.release();await p.mounted.settings.pending();
  preserved(before,await collections(kit),1);
  assert.deepEqual(p.draft.entry,{load:'',reps:''});assert.equal(p.draft.effort,effort);
  assert.equal(p.draft.settingsEditor.draft,null,'confirmed Save must resolve unchanged settings editor, preserving independent set draft');
 }finally{pause.release();p?.dom.window.close();kit.close();}
});

test('D2 independent editor edits do not hide an acknowledged set log or suppress successful-log clearing',async()=>{
 const kit=await device(),pause=gate();let p,changed=0;
 try{
  assert.equal((await kit.model.start()).ok,true);
  const model=createGymModel({gymHost:wrap(kit.gymHost,'executeResumedWorkout',async(input,original)=>{pause.enter();await pause.wait;return original();})});
  p=await page(kit,{model,onChanged:()=>{changed++;}});await p.ready();await p.editor();p.input('[data-settings-name="0"]','Seat');p.input('[data-settings-value="0"]','four');p.choose();
  const before=await collections(kit);p.click('[data-slot="log"]');await pause.reached;
  p.input('[data-settings-value="0"]','six');const editor=p.draft.settingsEditor.draft;
  pause.release();await until(()=>p.mounted.refreshState().counts.busy===0,'set commit settled');
  preserved(before,await collections(kit),1);assert.equal(editor.rows[0].value,'six');assert.equal(p.draft.settingsEditor.draft,editor);
  assert.equal((await model.read()).phase,'saved','real model has acknowledged this exact set');
  assert.ok(p.phone.querySelector('[data-action="undo"]'),'acknowledged set must show its Saved/Undo state despite independent editor edits');
  assert.equal(changed,1);assert.deepEqual(p.draft.entry,{load:null,reps:null});assert.equal(p.draft.effort,null);
 }finally{pause.release();p?.dom.window.close();kit.close();}
});

test('D2 actual logging stays available while optional settings read is pending and navigation hands off first',async()=>{
 const kit=await device(),pause=gate();let p,atBack;
 try{
  assert.equal((await kit.model.start()).ok,true);
  p=await page(kit,{settings:{latest:async id=>{pause.enter();await pause.wait;return kit.settings.latest(id);},save:(...args)=>kit.settings.save(...args)},onBack:()=>{atBack=p.mounted.refreshState();p.phone.replaceChildren(p.doc.createTextNode('D2 new owner'));}});
  await pause.reached;assert.equal(p.mounted.refreshState().counts.settingsReading,1);
  const before=await collections(kit);p.choose();p.click('[data-slot="log"]');
  await until(()=>!!p.phone.querySelector('[data-action="undo"]'),'logging completes before optional read');
  preserved(before,await collections(kit),1);assert.equal(p.mounted.refreshState().counts.settingsReading,1);
  p.click('[data-action="back"]');assert.equal(atBack.owns,false,'ownership must be gone inside navigation callback');
  pause.release();await p.mounted.settings.read();assert.equal(p.mounted.refreshState().counts.settingsReading,0);
  assert.equal(p.phone.textContent,'D2 new owner');assert.equal(p.mounted.refreshState().owns,false);
 }finally{pause.release();p?.dom.window.close();kit.close();}
});

test('D2 real settings transaction failure retains exact editor error and drafts on same-phone remount',async()=>{
 const kit=await device();let p,next;
 try{
  assert.equal((await kit.model.start()).ok,true);const draft=newGymDraft();p=await page(kit,{draft});await p.ready();await p.editor();p.input('[data-settings-name="0"]','Seat');p.input('[data-settings-value="0"]','four');
  const before=await collections(kit),editor=draft.settingsEditor.draft;
  kit.fault.state.mode='quota';kit.fault.state.armed=true;p.click('[data-slot="settings-save"]');await p.mounted.settings.pending();kit.fault.state.armed=false;
  assert.equal(draft.settingsEditor.draft,editor);assert.equal(draft.settingsEditor.error,GymApp.SETTINGS_NOT_SAVED);
  assert.equal(p.mounted.refreshState().counts.settingsSaving,0);preserved(before,await collections(kit),0);
  next=await page(kit,{draft,dom:p.dom});await next.ready();
  assert.equal(draft.settingsEditor.draft,editor);assert.equal(next.phone.querySelector('[data-slot="settings-error"]').textContent,GymApp.SETTINGS_NOT_SAVED);
  assert.equal(next.phone.querySelector('[data-settings-value="0"]').value,'four');assert.equal(p.mounted.refreshState().owns,false);
  next.click('[data-action="settings-cancel"]');await until(()=>draft.settingsEditor.draft===null,'explicit Cancel');await until(()=>Object.values(next.mounted.refreshState().counts).every(n=>n===0),'Cancel repaint settled before closing DOM');preserved(before,await collections(kit),0);
 }finally{kit.fault.state.armed=false;p?.dom.window.close();kit.close();}
});
