import assert from 'node:assert/strict';

export async function runExtensionDom(page) {
  return page.evaluate(async()=>{
    const {mountWorkoutCommandPanel:mount}=await import('/retained-w6.js');
    const root=document.querySelector('#root'), checks=[];
    const selection={planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN',logical_set_slot:'slot-A',lift_lineage_id:'lift-A',label:'Synthetic press'};
    const more=[{logical_set_slot:'slot-B',lift_lineage_id:'lift-A',label:'Synthetic press second set'},{logical_set_slot:'slot-C',lift_lineage_id:'lift-B',label:'<svg onload="window.injected=true">'}];
    const ok=(v,n)=>{if(!v)throw Error('Extension check failed: '+n);checks.push(n);};
    const settle=()=>new Promise(r=>setTimeout(r,0)), status=()=>root.querySelector('[role=status]').textContent;
    const forms=()=>root.querySelectorAll('form'), send=n=>forms()[n].dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    const set=(name,v)=>{root.querySelector(`[name=${name}]`).value=v;};
    const next=()=>[...root.querySelectorAll('button')].find(x=>x.textContent==='Next').click();
    const items=()=>[...root.querySelectorAll('ol li')].map(x=>x.textContent);
    for(const additionalSlots of [null,{},[null],[{}],[{...more[0],label:' '}],[{...more[0],lift_lineage_id:''}],[{...more[0],logical_set_slot:'slot-A'}],[more[0],more[0]],Array(1)]) {
      let calls=0;mount(root,{selection,additionalSlots,client:{async execute(){calls++;return {acknowledged:true,op_id:'s'};}}});send(0);await settle();
      ok(calls===0 && root.querySelector('button').disabled,'invalid slots '+checks.length+' refuse before Start');
    }
    let calls=[],release;
    const client={execute(command,args){calls.push({command,...structuredClone(args)});return new Promise(r=>release=r);}};
    let handle=mount(root,{selection,additionalSlots:more,client});
    send(2);send(3);ok(calls.length===0,'skip and close cannot precede Start');
    send(0);release({acknowledged:true,op_id:'same-start'});await settle();
    send(1);send(2);send(3);ok(calls.length===1 && items().length===1,'blank values neither log skip nor close');
    set('load','40.5');set('reps','8');set('reserve','3+');send(1);next();send(1);
    ok(calls.length===2 && items().length===1 && root.querySelector('h2').textContent===selection.label && status()==='Saving…','pending Set neither repeats advances nor reads back');
    release({acknowledged:true,op_id:'set-A'});await settle();
    ok(items()[1].includes('40.5 lb × 8') && items()[1].includes('3+ clean reps left') && !root.textContent.includes('set-A'),'acknowledged Set exact readable fact without technical ID');
    ok(root.querySelector('h2').textContent===selection.label && root.querySelector('[name=load]').value==='40.5','acknowledgement waits for explicit Next');
    next();ok(root.querySelector('h2').textContent===more[0].label && root.querySelector('[name=load]').value==='' && root.querySelector('[name=reps]').value==='','explicit Next changes only completed slot controls');
    set('load','35');set('reps','6');set('reserve','0');send(1);release({acknowledged:true,op_id:'set-B'});await settle();next();
    ok(!root.querySelector('svg') && root.querySelector('h2').textContent===more[1].label,'additional label is text');
    set('skipReason','Equipment unavailable');send(2);next();send(2);
    ok(calls.length===4 && items().length===3 && status()==='Saving…','pending Skip neither repeats advances nor reads back');
    release({acknowledged:true,op_id:'skip-C'});await settle();
    ok(items()[3].includes('skipped — Equipment unavailable') && !items()[3].includes('repetitions') && !Object.hasOwn(calls[3].input,'reps') && calls[3].input.skip_scope==='set','explicit Skip records reason without invented zero');
    ok(calls.slice(1).every(x=>x.input.session_start_op_id==='same-start') && calls.filter(x=>x.action==='start').length===1,'all slots reference one acknowledged Start');
    ok(![...root.querySelectorAll('button')].some(x=>x.textContent==='Finish') && ![...root.querySelectorAll('option')].some(x=>x.value==='normal'),'normal Finish withheld: early-only contract');
    set('closeChoice','early');send(3);send(3);ok(calls.length===5 && items().length===4 && status()==='Saving…','pending Close neither repeats nor reads back');
    release({acknowledged:true,op_id:'close-A'});await settle();send(1);send(2);send(3);next();
    ok(calls.length===5 && [...root.querySelectorAll('button,input,select')].every(x=>x.disabled) && items().length===5 && calls[4].input.completion_kind==='early','acknowledged early Close freezes all logging without fake completion');
    for(const action of ['set','skip','close']) for(const outcome of ['refused','late','throw','unknown','missing-id']) {
      let n=0;
      mount(root,{selection,additionalSlots:more,client:{async execute(_c,args){n++;if(args.action==='start')return {acknowledged:true,op_id:'s'};
        if(outcome==='refused')return {acknowledged:false,state:3};
        if(outcome==='late')return {acknowledged:false,stored:true,durable:true,confirmed:false,committed:true,committedRevision:'private-revision',state:18};
        if(outcome==='throw')throw Error('unsafe-error');if(outcome==='missing-id')return {acknowledged:true};return undefined;
      }}});
      send(0);await settle();set('load','45.5');set('reps','0');set('reserve','2');set('skipReason','Time');set('closeChoice','early');send({set:1,skip:2,close:3}[action]);await settle();next();
      ok(n===2 && items().length===1 && root.querySelector('h2').textContent===selection.label && root.querySelector('[name=load]').value==='45.5' && root.querySelector('[name=reps]').value==='0' && root.querySelector('[name=reserve]').value==='2' && root.querySelector('[name=skipReason]').value==='Time' && root.querySelector('[name=closeChoice]').value==='early' && !status().startsWith('Saved') && !root.textContent.includes('private-revision') && !root.textContent.includes('unsafe-error'),`${action}/${outcome}: no advance/readback, safe status, all entered values retained`);
    }
    handle=mount(root,{selection,additionalSlots:more,client});send(0);release({acknowledged:true,op_id:'dispose-start'});await settle();set('closeChoice','early');send(3);
    const old=root.querySelector('.workout-command-panel');handle.dispose();mount(root,{selection,additionalSlots:more,client});const before=root.textContent;release({acknowledged:true,op_id:'late-close'});await settle();
    ok(!old.isConnected && root.textContent===before,'dispose during Close prevents late readback and new mount painting');
    return checks;
  });
}

export async function runExtensionDurable(page, fixture, screenshotPath) {
  await page.evaluate(async({seed,cfg,key,lease})=>{
    const W=await import('/retained-w6.js'),{mountWorkoutCommandPanel:mount}=await import('/retained-w6.js');
    const encryptionKey=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
    const setup={databaseName:'panel-multiple-synthetic',namespace:'synthetic/multiple',keyProvider:()=>encryptionKey,authorizeEnrollment:()=>true};
    const repo=await W.openRepository(setup);seed.metadata.authorityLease=lease;seed.collections.drafts={other:{weight:'unchanged',reps:'7'}};seed.collections.meta.activeSession={otherSession:'preserve'};
    await repo.initialize(seed,'synthetic-only');
    const stage=W.Stage.createT2Stage(()=>({...cfg,clock:{now:()=> '2026-09-04T00:00:00Z',today:()=> '2026-09-04',tz:'+00:00',monotonicMs:()=>0}}),{allowInbound:true});
    const client=W.createDurablePublicClient({repository:repo,stage,namespace:setup.namespace,athleteId:'ath-1',deviceId:'dev-A',schemaVersion:2,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,observationGuard:{run:async(_k,fn)=>fn()},validateCommit:()=>null,keys:[key]});
    const selection={planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN',logical_set_slot:'A',lift_lineage_id:'press',label:'Synthetic press · first set'};
    const additionalSlots=[{logical_set_slot:'B',lift_lineage_id:'press',label:'Synthetic press · second set'},{logical_set_slot:'C',lift_lineage_id:'row',label:'Synthetic row'},{logical_set_slot:'D',lift_lineage_id:'curl',label:'Synthetic curl · left unlogged'}];
    mount(document.querySelector('#root'),{client,selection,additionalSlots});
    window.multi={repo,setup,W,originals:{},before:JSON.stringify(seed.collections.drafts)};
  },fixture);
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('[role=status]').textContent.startsWith('Saved — start'));
  const hold=async()=>page.evaluate(()=>{
    const original=IDBDatabase.prototype.transaction;window.multiGate={entered:false,release:false};
    IDBDatabase.prototype.transaction=function(...args){const tx=original.apply(this,args);if(args[1]==='readwrite'&&tx.objectStoreNames.contains('generations')){
      const store=tx.objectStore('generations'),put=store.put.bind(store);store.put=(v,k)=>{if(k==='active')multiGate.entered=true;return put(v,k);};const getStore=tx.objectStore.bind(tx);tx.objectStore=n=>n==='generations'?store:getStore(n);
      const keep=()=>{if(!multiGate.release){try{store.get('active').onsuccess=keep;}catch{}}};keep();}return tx;};multi.restoreTransaction=()=>{IDBDatabase.prototype.transaction=original;};
  });
  const quota=async()=>page.evaluate(async()=>{
    multi.beforeFault=JSON.stringify(await multi.repo.load());const original=IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put=function(v,k){if(this.name==='generations'&&k==='active')throw new DOMException('Synthetic quota','QuotaExceededError');return original.call(this,v,k);};multi.restorePut=()=>{IDBObjectStore.prototype.put=original;};
  });
  const failed=async(label)=>{
    await quota();await page.getByRole('button',{name:label,exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('[role=status]').textContent.startsWith('Could not save'));
    assert.equal(await page.evaluate(async()=>{multi.restorePut();return multi.beforeFault===JSON.stringify(await multi.repo.load());}),true);
  };
  const delayed=async(label,prefix)=>{
    const count=await page.locator('ol li').count(),title=await page.locator('h2').textContent();await hold();await page.getByRole('button',{name:label,exact:true}).click();await page.waitForFunction(()=>multiGate.entered);
    assert.equal(await page.getByRole('status').textContent(),'Saving…');assert.equal(await page.locator('ol li').count(),count);assert.equal(await page.locator('h2').textContent(),title);
    await page.evaluate(()=>{multiGate.release=true;multi.restoreTransaction();});await page.waitForFunction(prefix=>document.querySelector('[role=status]').textContent.startsWith(prefix),prefix);
  };
  await page.getByLabel('Weight (lb)',{exact:true}).fill('40.5');await page.getByLabel('Completed repetitions').fill('8');await page.getByLabel('Clean reps left (optional)').selectOption('3+');
  await failed('Log set');assert.equal(await page.getByLabel('Weight (lb)',{exact:true}).inputValue(),'40.5');await delayed('Log set','Saved — set logged');
  await page.evaluate(async()=>{multi.originals=structuredClone((await multi.repo.load()).generation.collections.ops);});
  await page.getByRole('button',{name:'Next',exact:true}).click();await page.getByLabel('Weight (lb)',{exact:true}).fill('35');await page.getByLabel('Completed repetitions').fill('6');
  await page.getByRole('button',{name:'Log set',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[role=status]').textContent.startsWith('Saved — set logged'));
  await page.getByRole('button',{name:'Next',exact:true}).click();await page.getByLabel('Reason to skip this set').selectOption('Equipment unavailable');
  await failed('Skip this set');assert.equal(await page.getByLabel('Reason to skip this set').inputValue(),'Equipment unavailable');await delayed('Skip this set','Saved — this set was explicitly skipped');
  await page.getByRole('button',{name:'Next',exact:true}).click();await page.getByLabel('Weight (lb)',{exact:true}).fill('20');await page.getByLabel('Completed repetitions').fill('4');await page.getByLabel('End this workout').selectOption('early');
  await failed('Finish early');assert.equal(await page.getByLabel('Weight (lb)',{exact:true}).inputValue(),'20');assert.equal(await page.getByLabel('Completed repetitions').inputValue(),'4');await delayed('Finish early','Saved — workout ended early');
  const result=await page.evaluate(async()=>{
    const before=await multi.repo.load();multi.repo.close();const reopened=await multi.W.openRepository(multi.setup),after=await reopened.load();reopened.close();
    const ops=Object.values(after.generation.collections.ops),start=ops.find(x=>x.kind==='session-start'),sets=ops.filter(x=>x.kind==='session-set'),skip=ops.find(x=>x.kind==='session-skip'),close=ops.find(x=>x.kind==='session-close');
    return {reopen:JSON.stringify(before)===JSON.stringify(after),count:ops.length,outbox:Object.keys(after.generation.collections.outbox).length,kinds:ops.map(x=>x.kind),sameStart:ops.filter(x=>x!==start).every(x=>x.session_start_op_id===start.op_id),originals:Object.entries(multi.originals).every(([id,op])=>JSON.stringify(op)===JSON.stringify(after.generation.collections.ops[id])),drafts:after.generation.collections.drafts,active:after.generation.collections.meta.activeSession,sets:sets.map(x=>({slot:x.logical_set_slot,payload:x.payload})),skip:{slot:skip.logical_set_slot,scope:skip.skip_scope,payload:skip.payload},close:close.payload,unlogged:!ops.some(x=>x.logical_set_slot==='D'),allSchema2:ops.every(x=>x.schema_version===2),items:[...document.querySelectorAll('ol li')].map(x=>x.textContent),frozen:[...document.querySelectorAll('.workout-command-panel button,input,select')].every(x=>x.disabled)};
  });
  assert.equal(result.reopen,true);assert.equal(result.count,5);assert.equal(result.outbox,5);assert.equal(result.sameStart,true);assert.equal(result.originals,true);assert.equal(result.unlogged,true);assert.equal(result.allSchema2,true);assert.equal(result.frozen,true);assert.equal(result.items.length,5);
  assert.deepEqual(result.kinds,['session-start','session-set','session-set','session-skip','session-close']);
  assert.deepEqual(result.sets,[{slot:'A',payload:{load:{value:40.5,unit:'lb'},reps:{value:8,unit:'rep'},reserve:{tag:'at_least',value:3,unit:'rep'}}},{slot:'B',payload:{load:{value:35,unit:'lb'},reps:{value:6,unit:'rep'}}}]);
  assert.deepEqual(result.skip,{slot:'C',scope:'set',payload:{reason:'Equipment unavailable'}});assert.deepEqual(result.close,{completion_kind:'early'});
  assert.deepEqual(result.drafts,{other:{weight:'unchanged',reps:'7'}});assert.deepEqual(result.active,{otherSession:'preserve'});
  await page.screenshot({path:screenshotPath,fullPage:true});
  return ['one actual acknowledged Start for two mixed-load Sets/Skip/early Close','native quota and delayed IDB Set/Skip/Close preserve input and no false readback/advance','five exact operations and outbox entries after encrypted reopen','original first-start/set bytes and unrelated draft/active-session metadata preserved','unlogged fourth slot creates no zero or operation','acknowledged local event list and closed controls'];
}
