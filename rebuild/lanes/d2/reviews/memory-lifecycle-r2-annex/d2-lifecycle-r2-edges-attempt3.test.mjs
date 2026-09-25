import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {gate,device,collections,preserved,wrap,until,page,EFFORT} from './d2-lifecycle-r2-support.mjs';
import {createGymModel} from '../rebuild/m3/w7-preview/today/gym-model.mjs';
import GymApp from '../rebuild/m3/w7-preview/today/gym-app.mjs';
const settled=p=>Object.values(p.mounted.refreshState().counts).every(n=>n===0);
async function editor(p){await p.ready();await p.editor();p.input('[data-settings-name="0"]','Seat');p.input('[data-settings-value="0"]','four');}
test('D2 R2 editor row addition preserves the real submitted set payload and acknowledges it exactly once',async()=>{
  const kit=await device(),pause=gate();let p,changed=0,committed;
  try{
    assert.equal((await kit.model.start()).ok,true);
    // This positive control pauses ACKNOWLEDGEMENT after the real commit. The
    // separate final case below preserves the before-commit repaint refusal.
    const model=createGymModel({gymHost:wrap(kit.gymHost,'executeResumedWorkout',async(input,original)=>{committed=await original();pause.enter();await pause.wait;return committed;})});
    p=await page(kit,{model,onChanged:()=>changed++});await editor(p);p.input('#gym-weight','35');p.input('#gym-reps','7');p.choose();
    const before=await collections(kit);p.click('[data-slot="log"]');await pause.reached;assert.equal(committed.acknowledged,true);const snapshot=p.mounted.refreshState();
    p.click('[data-action="settings-add"]');await until(()=>!!p.phone.querySelector('[data-settings-value="1"]'),'added editor row');
    p.input('[data-settings-name="1"]','Pin');p.input('[data-settings-value="1"]','new independent answer');
    const draft=p.draft.settingsEditor.draft;assert(p.mounted.refreshState().epoch>snapshot.epoch);
    pause.release();await until(()=>changed===1&&settled(p),'current set completion');
    const after=await collections(kit);preserved(before,after,1);
    const op=Object.entries(after.ops).find(([id])=>!Object.hasOwn(before.ops,id))[1];
    assert.equal(op.kind,'session-set');assert.deepEqual(op.payload,{load:{value:35,unit:'lb'},reps:{value:7,unit:'rep'},reserve:EFFORT});
    assert.equal(p.draft.settingsEditor.draft,draft);assert.deepEqual(draft.rows,[{name:'Seat',value:'four'},{name:'Pin',value:'new independent answer'}]);
    assert.deepEqual(p.draft.entry,{load:null,reps:null});assert.equal(p.draft.effort,null);assert(p.phone.querySelector('[data-action="undo"]'));
    assert.equal(snapshot.counts.busy,1);assert(Object.isFrozen(snapshot)&&Object.isFrozen(snapshot.counts));
    fs.writeFileSync('.tmp/d2-lifecycle-r2-submitted-set.json',JSON.stringify({payload:op.payload,editor:draft,changed,counts:p.mounted.refreshState().counts},null,2)+'\n');
  }finally{pause.release();if(p)await until(()=>settled(p),'settled cleanup');p?.dom.window.close();kit.close();}
});
test('D2 R2 entry stepper and effort retain their new values when the unchanged settings submission confirms',async()=>{
  const kit=await device(),pause=gate();let p;
  try{
    assert.equal((await kit.model.start()).ok,true);
    p=await page(kit,{settings:{latest:(...args)=>kit.settings.latest(...args),save:async machine=>{pause.enter();await pause.wait;return kit.settings.save(machine);}}});await editor(p);
    const lift=p.draft.settingsEditor.lift,before=await collections(kit);p.click('[data-slot="settings-save"]');await pause.reached;const snapshot=p.mounted.refreshState();
    const up=[...p.phone.querySelectorAll('[data-step]')].find(b=>b.dataset.step.split(':')[0]==='load'&&Number(b.dataset.step.split(':')[1])>0);assert(up);
    up.dispatchEvent(new p.dom.window.Event('click'));p.choose();const entry={...p.draft.entry},effort=p.draft.effort;
    assert.notEqual(entry.load,null);assert(p.mounted.refreshState().epoch>snapshot.epoch);
    pause.release();await p.mounted.settings.pending();preserved(before,await collections(kit),1);
    assert.deepEqual((await kit.settings.latest(lift)).machine.settings,[{name:'Seat',value:'four'}]);
    assert.equal(p.draft.settingsEditor.draft,null);assert.deepEqual(p.draft.entry,entry);assert.equal(p.draft.effort,effort);
    assert.equal(snapshot.counts.settingsSaving,1);assert(settled(p));
  }finally{pause.release();if(p)await p.mounted.settings.pending();p?.dom.window.close();kit.close();}
});
test('D2 R2 actual failed settings Save retains its current error beside independent entry edits and on remount',async()=>{
  const kit=await device(),pause=gate();let p,next;
  try{
    assert.equal((await kit.model.start()).ok,true);
    p=await page(kit,{settings:{latest:(...args)=>kit.settings.latest(...args),save:async machine=>{pause.enter();await pause.wait;return kit.settings.save(machine);}}});await editor(p);
    const before=await collections(kit),draft=p.draft,held=draft.settingsEditor.draft;p.click('[data-slot="settings-save"]');await pause.reached;
    p.input('#gym-weight','');p.input('#gym-reps','');p.choose();const effort=draft.effort;
    kit.fault.state.mode='quota';kit.fault.state.armed=true;pause.release();await p.mounted.settings.pending();kit.fault.state.armed=false;
    preserved(before,await collections(kit),0);assert.equal(draft.settingsEditor.draft,held);assert.equal(draft.settingsEditor.error,GymApp.SETTINGS_NOT_SAVED);
    assert.equal(p.phone.querySelector('[data-slot="settings-error"]').textContent,GymApp.SETTINGS_NOT_SAVED);
    next=await page(kit,{draft,dom:p.dom});await next.ready();
    assert.equal(p.mounted.refreshState().owns,false);assert.equal(next.phone.querySelector('[data-slot="settings-error"]').textContent,GymApp.SETTINGS_NOT_SAVED);
    assert.deepEqual(draft.entry,{load:'',reps:''});assert.equal(draft.effort,effort);preserved(before,await collections(kit),0);
  }finally{pause.release();kit.fault.state.armed=false;if(p)await p.mounted.settings.pending();if(next)await until(()=>settled(next),'remount settled');p?.dom.window.close();kit.close();}
});
test('D2 R2 independent editor repaint must not silently invalidate an actual pending set submission',async()=>{
  const kit=await device(),pause=gate(),observation={preparations:[],execute:null};let p,result;
  try{
    assert.equal((await kit.model.start()).ok,true);
    const observed=wrap(kit.gymHost,'prepareWorkoutContinuation',async(input,original)=>{const prepared=await original();observation.preparations.push({prepared:prepared.prepared,resumeId:prepared.resumeId});return prepared;});
    const model=createGymModel({gymHost:wrap(observed,'executeResumedWorkout',async(input,original)=>{observation.execute=input.resumeId;pause.enter();await pause.wait;result=await original();return result;})});
    p=await page(kit,{model});await editor(p);p.choose();const before=await collections(kit),oldError=p.phone.querySelector('#gym-error');
    p.click('[data-slot="log"]');await pause.reached;p.click('[data-action="settings-add"]');
    await until(()=>p.phone.querySelector('#gym-error')!==oldError&&p.mounted.refreshState().counts.paint===0,'independent editor repaint completes before refusal');
    // No storage fault is armed. The ordinary editor repaint prepares another
    // continuation through the same real model before this pending one executes.
    pause.release();await until(()=>p.mounted.refreshState().counts.busy===0,'actual set result');
    const after=await collections(kit);
    for(const kind of ['ops','outbox'])for(const [id,row]of Object.entries(before[kind]))assert.deepEqual(after[kind][id],row);
    const currentError=p.phone.querySelector('#gym-error').textContent;
    const modelRead=await model.read();
    fs.writeFileSync('.tmp/d2-lifecycle-r2-refused-set.json',JSON.stringify({result,phase:modelRead.phase,message:modelRead.message,currentError,detachedError:oldError.textContent,currentLogVisible:!!p.phone.querySelector('[data-slot="log"]'),counts:p.mounted.refreshState().counts,opsBefore:Object.keys(before.ops).length,opsAfter:Object.keys(after.ops).length,outboxBefore:Object.keys(before.outbox).length,outboxAfter:Object.keys(after.outbox).length,observation},null,2)+'\n');
    assert.equal(result.acknowledged,true,'an independent local editor-row change must not invalidate the pending set submission');
    preserved(before,after,1);assert.equal(p.draft.settingsEditor.draft.rows.length,2);
  }finally{pause.release();kit.fault.state.armed=false;if(p)await until(()=>settled(p),'refusal settled');p?.dom.window.close();kit.close();}
});
