import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../w6/test/support.mjs';
import { createFormFixture, fillRecorded, day } from './nutrition-input-fixture.mjs';
import { mountNutritionInput } from '../today/nutrition-input-view.mjs';
const { IDBFactory } = createRequire(new URL('../../w6/package.json',import.meta.url))('fake-indexeddb');
const fixture = options => createFormFixture({indexedDB:new IDBFactory(),crypto:webcrypto,...options});
test('fresh answers remain unselected; unknown and no existing plan save distinct real facts',async()=>{
  for(const answer of ['unknown','none']){const h=await fixture();try{
    assert.equal(h.model.snapshot().draft.goal.kind,'');assert.equal(h.model.snapshot().draft.existing_plan.kind,'');
    const before=await h.generation();await h.model.review();assert.equal(h.model.snapshot().errorField,'goal.kind');
    h.model.update('goal.kind','unknown');h.model.update('existing_plan.kind',answer);await h.model.review();
    assert.equal(h.model.snapshot().phase,'review');assert.equal((await h.generation()).revision,before.revision);
    await h.model.confirm();assert.equal(h.model.snapshot().phase,'saved');await h.reopen();
    assert.equal(h.model.snapshot().draft.existing_plan.kind,answer);assert.equal((await h.read()).view.records.length,1);
  }finally{h.close();}}
});
test('recorded four-field review/edit/save/reload and goal-only correction/clear preserve original plan/history',async()=>{
  const h=await fixture();try{
    fillRecorded(h.model);await h.model.review();const reviewed=h.model.snapshot().review;
    h.model.update('goal.statement','unreviewed mutation');assert.equal(h.model.snapshot().review.inputs.goal.statement,'Build strength steadily.');
    h.model.edit();assert.equal(h.model.snapshot().draft.existing_plan.fields.calories.amount,'2175');await h.model.review();await h.model.confirm();
    await h.reopen();const old=(await h.read()).view.local.current.inputs;
    h.model.update('goal.statement','Practice consistency.');h.model.update('change','correction');await h.model.review();await h.model.confirm();
    let read=await h.read();assert.deepEqual(read.view.local.current.inputs.existing_plan,old.existing_plan);assert.equal(read.view.records[1].original.payload.change,'correction');
    h.model.edit();h.model.update('goal.kind','cleared');h.model.update('goal.reason','My priorities changed.');h.model.update('existing_plan.kind','cleared');h.model.update('existing_plan.reason','This agreement ended.');
    await h.model.review();await h.model.confirm();read=await h.read();assert.equal(read.view.records.length,3);assert.deepEqual(read.view.records[0].original.payload.inputs,reviewed.inputs);
  }finally{h.close();}
});
test('invalid and unknown field retain draft without inventing zero; stale weight refresh preserves answers',async()=>{
  const h=await fixture();try{
    fillRecorded(h.model);h.model.update('existing_plan.fields.calories.amount','');await h.model.review();assert.equal(h.model.snapshot().errorField,'existing_plan.fields.calories.amount');
    h.model.update('existing_plan.fields.calories.kind','unavailable');await h.model.review();assert.equal(h.model.snapshot().review.inputs.existing_plan.fields.calories.kind,'unavailable');
    assert.equal((await h.weigh()).ok,true);await h.model.confirm();assert.equal(h.model.snapshot().phase,'error');assert.match(h.model.snapshot().message,/Another entry/);
    assert.equal((await h.read()).view.records.length,0);h.model.edit();await h.model.review();await h.model.confirm();assert.equal(h.model.snapshot().phase,'saved');
    assert.equal((await h.read()).view.local.current.inputs.existing_plan.fields.calories.kind,'unavailable');
  }finally{h.close();}
});
test('actual quota retry keeps reviewed values and late commit/context loss never shows Saved',async()=>{
  for(const mode of ['quota','delay']){const fault=faultDatabase(),h=await fixture({indexedDB:fault.indexedDB});try{
    fillRecorded(h.model);await h.model.review();fault.state.mode=mode;fault.state.armed=true;
    const pending=h.model.confirm();
    if(mode==='quota'){await pending;assert.equal(h.model.snapshot().phase,'error');assert.equal(h.model.snapshot().canRetry,true);assert.equal((await h.read()).view.records.length,0);fault.state.armed=false;await h.model.confirm();assert.equal(h.model.snapshot().phase,'saved');}
    else{await fault.state.write.promise;assert.equal(h.model.snapshot().busy,true);assert.doesNotMatch(h.model.snapshot().message,/Saved/);fault.state.tx.addEventListener('complete',()=>h.installation.close());fault.state.release=true;await pending;assert.equal(h.model.snapshot().phase,'error');assert.match(h.model.snapshot().message,/record reached this phone/);fault.state.armed=false;await h.reopen();assert.equal((await h.read()).view.records.length,1);}
  }finally{fault.state.release=true;fault.state.armed=false;h.close();}}
});
test('actual calendar rollover and time-zone change demand a fresh review and keep every draft value',async()=>{
  const h=await fixture();try{fillRecorded(h.model);await h.model.review();const draft=h.model.snapshot().draft;
    h.setNow('2026-09-13T00:01:00Z');await h.model.confirm();assert.equal(h.model.snapshot().phase,'edit');assert.match(h.model.snapshot().message,/date or time zone changed/);assert.deepEqual(h.model.snapshot().draft,draft);assert.equal((await h.read()).view.records.length,0);
    await h.model.review();assert.equal(h.model.snapshot().review.effective.local_date,'2026-09-13');h.setNow('2026-09-13T00:02:00Z',60);await h.model.confirm();assert.equal(h.model.snapshot().phase,'edit');await h.model.review();await h.model.confirm();
    assert.equal((await h.read()).view.records[0].original.effective.utc_offset,'+01:00');
  }finally{h.close();}
});
test('real competing nutrition change requires explicit load; a goal draft cannot overwrite its newer plan',async()=>{
  const h=await fixture();try{fillRecorded(h.model);await h.model.review();await h.model.confirm();h.model.edit();h.model.update('goal.statement','A draft goal');
    const read=await h.read(),p={effective:{local_date:day,local_time:'10:20',utc_offset:'+00:00'},change:'update',supersedes:read.view.local.current.sourceOpId,inputs:structuredClone(read.view.local.current.inputs)};
    p.inputs.existing_plan.fields.calories.amount.value=2205;const prepared=await h.installation.prepareNutritionInputs({expectedRevision:read.revision,proposal:p});await h.installation.commitNutritionInputs({preparedId:prepared.preparedId});
    await h.model.review();assert.equal(h.model.snapshot().conflicting,true);assert.equal(h.model.snapshot().draft.goal.statement,'A draft goal');assert.equal((await h.read()).view.records.length,2);
    await h.model.load();assert.equal(h.model.snapshot().draft.existing_plan.fields.calories.amount,'2205');
  }finally{h.close();}
});
test('mounted labels, review/edit and Back retain transient draft without committing or blocking weight',async()=>{
  const h=await fixture(),dom=new JSDOM('<main></main>'),root=dom.window.document.querySelector('main');let backs=0;
  try{let view=mountNutritionInput(dom.window.document,root,{model:h.model,onBack:()=>backs++});
    assert.equal(root.querySelectorAll('select').length,2);assert([...root.querySelectorAll('select')].every(x=>x.value===''));
    fillRecorded(h.model);h.model.edit();root.querySelector('[data-action="back"]').click();view.destroy();assert.equal(backs,1);assert.equal((await h.read()).view.records.length,0);assert.equal((await h.weigh()).ok,true);
    view=mountNutritionInput(dom.window.document,root,{model:h.model});assert.equal(root.querySelector('[name="goal.statement"]').value,'Build strength steadily.');await h.model.review();assert.match(root.textContent,/Target: 2175 kcal\/day/);assert.match(root.textContent,/less than 245 g\/day/);assert.match(root.textContent,/Not prescribed/);view.destroy();
  }finally{h.close();dom.window.close();}
});
