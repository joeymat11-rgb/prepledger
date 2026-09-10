import {mountWorkoutCommandPanel} from './command-panel.mjs';
import Capture from './capture.cjs';
import {parseStrictJson} from '../../m3/w6/strict-json.mjs';
import {installWorkoutTypography} from './typography.mjs';

const roots=new WeakMap(),clients=new WeakMap(),needsReconciliation=new WeakSet();
const validator=Capture.createPrescriptionCapture({parseStrictJson});
const nonblank=value=>typeof value==='string'&&value.trim().length>0;

// This lifecycle owner requires a dedicated, statically configured real public client.
// The client interprets authenticated continuation and current safety. This host
// renders those separate results; it does not qualify producers or supply keys.
export function mountPreparedWorkoutPanel(root,{client,plannedSplitSlotId,enableContinuation=false,prepareNewWorkout=false}) {
  if(!root?.ownerDocument||!nonblank(plannedSplitSlotId)||
      !['prepareWorkout','startPreparedWorkout','retireWorkoutPreparations','execute'].every(k=>typeof client?.[k]==='function'))
    throw new TypeError('Prepared workout host configuration required');
  if(enableContinuation&&!['readWorkoutHistory','prepareWorkoutContinuation','executeResumedWorkout','prepareWorkoutEdit','commitWorkoutEdit'].every(k=>typeof client[k]==='function'))throw new TypeError('Interpreted continuation client required');
  roots.get(root)?.dispose();clients.get(client)?.dispose();
  const doc=root.ownerDocument,el=(tag,text)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
  installWorkoutTypography(doc);
  const shell=el('section');shell.className='prepared-workout-host';shell.setAttribute('aria-label','Prepared synthetic workout');
  const status=el('p','Preparing instructions…');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  shell.append(status);root.append(shell);
  let disposed=false,startIssued=false,panel=null;
  const handle={ready:null,dispose(){
    if(disposed)return;disposed=true;
    if(startIssued)needsReconciliation.add(client);
    try{client.retireWorkoutPreparations();}finally{
      panel?.dispose();shell.remove();if(roots.get(root)===handle)roots.delete(root);if(clients.get(client)===handle)clients.delete(client);
    }
    // Already issued operations can finish. A new host must reconcile before another Start.
  }};
  roots.set(root,handle);clients.set(client,handle);
  handle.ready=(async()=>{
    try{
      if(needsReconciliation.has(client)&&!enableContinuation){
        status.textContent='Restore the active workout through the host before starting again. Previous saving may have completed.';
        return {mounted:false,code:'WORKOUT_HOST_RECONCILIATION_REQUIRED'};
      }
      let continuation=null,history=null;
      const renderHistory=(parent,sessions,editable=false)=>{
        const historyPanel=el('section');historyPanel.className='prepared-history';historyPanel.setAttribute('aria-label','Recovered workout history');
        historyPanel.append(el('style',`.prepared-history{padding:24px;background:#F4F0E8;color:#1C1B18;font:1rem/1.5 'Instrument Sans',Arial,sans-serif}.prepared-history h2{margin:0 0 12px;font:400 2.5em/1.05 'Instrument Serif',Georgia,serif;letter-spacing:-.025em}.prepared-history>p{color:#5A5348}.prepared-history p{margin:0 0 10px}.prepared-history ol{padding-left:1.25em;margin:20px 0 0}.prepared-history li{padding:20px 0;border-bottom:1px solid #D8D0C2}.prepared-history li::marker{color:#5A5348}.prepared-history details{margin:8px 0}.prepared-history summary{padding:8px 0;color:#5A5348}.prepared-history button,.prepared-history summary{min-height:44px;font:inherit;cursor:pointer}.prepared-history button{padding:10px 16px;background:transparent;color:#1C1B18;border:1px solid #6F6759;border-radius:10px;margin:8px 8px 0 0;max-width:100%;overflow-wrap:anywhere}.prepared-history button[type=submit]{background:#1C1B18;color:#F4F0E8;border-color:#1C1B18;font-weight:600}.prepared-history button:disabled{background:transparent;color:#6F6759;border-color:#D8D0C2;cursor:default}.prepared-history .history-editor{margin-top:16px;padding-top:16px;border-top:1px solid #D8D0C2}.prepared-history .history-editor h3{margin:0 0 10px;font-size:1.25em;font-weight:500}.prepared-history .history-edit-status{margin-top:12px;color:#5A5348}.prepared-history label{display:grid;gap:6px;margin:14px 0}.prepared-history input,.prepared-history select{box-sizing:border-box;min-height:48px;width:100%;font:inherit;font-size:max(16px,1em);padding:10px;background:#FAF7F1;color:#1C1B18;border:1px solid #6F6759;border-radius:8px}@media(max-width:340px){.prepared-history h2{font-size:1.75em}}.prepared-history [hidden]{display:none}.prepared-history :focus-visible{outline:3px solid #2E5A3C;outline-offset:3px}`));
        historyPanel.append(el('style',`.prepared-workout-host{max-width:38rem;margin-inline:auto;background:#F4F0E8;color:#1C1B18;font:1rem/1.5 'Instrument Sans',Arial,sans-serif;overflow-wrap:anywhere}.prepared-workout-host>p{padding:18px 24px 0;margin:0;color:#5A5348}.prepared-workout-host>button{min-height:44px;margin:0 24px 24px;padding:12px 16px;font:inherit;border:1px solid #6F6759;border-radius:10px;background:#FAF7F1;color:#1C1B18}`));
        historyPanel.append(el('h2','Recorded workout'),el('p','Test workout history. Review your recorded sets and corrections below; original entries remain available.'));
        let editorOpen=false;
        const format=v=>v?`${v.load.value} ${v.load.unit} × ${v.reps.value} ${v.reps.unit}`:'Not established';
        const effort=v=>!v?'Unrecorded':v.tag==='exact'?String(v.value):v.tag==='at_least'?'3+':v.tag==='unknown'?'Not sure':v.tag==='skipped'?'Question skipped':'Not asked';
        const recordedStatus=s=>({'stored-on-this-device':'Saved on this device','accepted-through-frontier':'Confirmed by server',rejected:'Rejected — needs attention'}[s]||'Status needs review');
        for(const s of sessions){
          const list=el('ol');
          for(const f of s.projection.facts){
            const v=f.current,slot=s.original?.slots.find(x=>x.logical_set_slot===f.logical_set_slot&&x.lift_lineage_id===f.lift_lineage_id);
            const item=el('li');item.className='prepared-history-set';
            item.append(el('p',`${slot?.label||'Recorded set'} — ${f.included===false?'excluded from current interpretation':v?format(v):'interpretation required'} (${recordedStatus(f.current_status||f.source_status)})`));
            if(f.included===true&&v)item.append(el('p','Clean reps left: '+effort(v.reserve)));
            const original=el('details');original.append(el('summary','Original recorded entry'),el('p',format(f.original)+'; clean reps left: '+effort(f.original.reserve)));item.append(original);
            if(f.edit_op_ids.length)item.append(el('p','Recorded changes are retained with the original entry.'));
            if(f.issues.includes('SET_SLOT_RESOLUTION_REQUIRED'))item.append(el('p','Another recorded entry shares this set position. Correcting this fact does not by itself resolve the workout.'));
            if(editable&&f.included===true&&f.issues.every(code=>code==='SET_SLOT_RESOLUTION_REQUIRED')&&v){
              const edit=el('button','Correct this set');edit.type='button';item.append(edit);
              edit.addEventListener('click',async()=>{
                if(disposed||editorOpen)return;editorOpen=true;edit.disabled=true;const message=el('p','Reading the current record…');message.className='history-edit-status';message.setAttribute('role','status');message.setAttribute('aria-live','polite');item.append(message);
                let p;try{p=await client.prepareWorkoutEdit({target_op_id:f.source_op_id});}catch{}
                if(disposed)return;
                if(p?.prepared!==true){message.textContent='This record cannot currently be corrected. Reopen the workout to review its latest history.';editorOpen=false;edit.disabled=false;return;}
                const form=el('form');form.className='history-editor';form.noValidate=true;
                form.append(el('h3','Correct the recorded set'),el('p','Change what was recorded. The original remains in history. This does not change your plan.'));
                const field=(name,label,value)=>{const wrapper=el('label',label),input=el('input');input.name=name;input.type='text';input.inputMode=name==='correctedLoad'?'decimal':'numeric';input.value=String(value);wrapper.append(input);form.append(wrapper);return input;};
                const load=field('correctedLoad','Recorded weight (lb)',p.view.current.load.value),reps=field('correctedReps','Recorded repetitions',p.view.current.reps.value);
                const reserveLabel=el('label','Recorded clean reps left'),reserve=el('select');reserve.name='correctedReserve';
                for(const [value,label]of [['keep','Keep current: '+effort(p.view.current.reserve)],['0','0'],['1','1'],['2','2'],['3+','3+'],['unknown','Not sure'],['skipped','Question skipped'],['not_asked','Not asked']]){const o=el('option',label);o.value=value;reserve.append(o);}reserveLabel.append(reserve);form.append(reserveLabel);
                const save=el('button','Save correction');save.type='submit';const cancel=el('button','Cancel');cancel.type='button';form.append(save,cancel);
                const removal=el('details');removal.append(el('summary','Remove a mistaken entry'));const reasonLabel=el('label','Reason for removal'),reason=el('input');reason.name='removalReason';reasonLabel.append(reason);const remove=el('button','Remove recorded entry');remove.type='button';removal.append(reasonLabel,el('p','This keeps the original in history and excludes it from the current interpretation.'),remove);form.append(removal);
                let pending=false,retired=false;const disable=()=>{for(const control of form.querySelectorAll('input,select,button'))control.disabled=pending||retired;};
                const submit=async(action,change)=>{
                  if(disposed||pending||retired)return;pending=true;message.textContent='Saving…';disable();
                  let r;try{r=await client.commitWorkoutEdit({editId:p.editId,action,change});}catch{r={acknowledged:false,outcomeUnknown:true};}
                  if(disposed)return;pending=false;retired=true;disable();
                  if(r?.acknowledged!==true){message.textContent=r?.outcomeUnknown?'Update not confirmed. Your entered values remain here. Reopen the workout to check its history before trying again.':r?.code==='WORKOUT_EDIT_STALE'?'History changed while this editor was open. Your entered values remain here. Reopen the workout and review the latest entry.':'Could not save this change. Your entered values remain here. Reopen the workout to resolve its current recovery state.';return;}
                  let read;try{read=await client.readWorkoutHistory();}catch{}
                  if(disposed)return;
                  if(read?.read!==true){message.textContent='Saved on this device. The updated history needs recovery before it can be shown.';return;}
                  historyPanel.remove();renderHistory(parent,read.history.sessions.filter(x=>x.start.operation.planned_split_slot_id===plannedSplitSlotId&&x.start.status!=='rejected'),true);
                  status.textContent=action==='remove'?'Saved — mistaken entry excluded; its original remains in history.':'Saved — correction recorded on this device. The original and later entries remain in history.';
                };
                form.addEventListener('submit',event=>{event.preventDefault();if(disposed||pending||retired)return;
                  const weight=Number(load.value.trim()),count=Number(reps.value.trim());
                  if(!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(load.value.trim())||!Number.isFinite(weight)||weight<=0){message.textContent='Enter a recorded weight greater than zero.';load.focus();return;}
                  if(!/^\d+$/.test(reps.value.trim())||!Number.isSafeInteger(count)){message.textContent='Enter recorded repetitions as a whole number, including zero.';reps.focus();return;}
                  const change={};if(weight!==p.view.current.load.value)change.load={value:weight,unit:'lb'};if(count!==p.view.current.reps.value)change.reps={value:count,unit:'rep'};
                  if(['0','1','2'].includes(reserve.value))change.reserve={tag:'exact',value:Number(reserve.value),unit:'rep'};
                  else if(reserve.value==='3+')change.reserve={tag:'at_least',value:3,unit:'rep'};
                  else if(['unknown','skipped','not_asked'].includes(reserve.value))change.reserve={tag:reserve.value};
                  else if(reserve.value!=='keep'){message.textContent='Choose a listed clean-reps-left answer.';return;}
                  if(change.reserve&&JSON.stringify(change.reserve)===JSON.stringify(p.view.current.reserve))delete change.reserve;
                  if(!Object.keys(change).length){message.textContent='No changes to save.';return;}void submit('correct',change);
                });
                remove.addEventListener('click',()=>{if(!reason.value.trim()){message.textContent='Enter the reason this entry was mistaken.';reason.focus();return;}void submit('remove',reason.value.trim());});
                cancel.addEventListener('click',()=>{if(pending||retired)return;retired=true;form.remove();message.remove();editorOpen=false;edit.disabled=false;edit.focus();});
                item.append(form);message.textContent='Review the recorded values, then explicitly save a correction or cancel.';load.focus();
              });
            }
            list.append(item);
          }
          for(const row of s.records.filter(r=>r.operation.kind==='session-skip'))list.append(el('li',`Skipped entry — ${row.operation.payload.reason} (${recordedStatus(row.status)})`));
          for(const close of s.projection.close_records)list.append(el('li',`${close.kind==='normal'?'Workout finished':'Workout ended early'} (${recordedStatus(close.status)})`));
          historyPanel.append(list);
        }parent.append(historyPanel);
      };
      if(enableContinuation){
        const read=await client.readWorkoutHistory();if(disposed)return {mounted:false,code:'WORKOUT_HOST_DISPOSED'};
        if(read?.read!==true){status.textContent='Stored workout information needs recovery before continuing.';return {mounted:false,code:read?.code||'WORKOUT_HISTORY_UNAVAILABLE',state:read?.state};}
        history=read.history;const matching=history.sessions.filter(s=>s.start.operation.planned_split_slot_id===plannedSplitSlotId&&s.start.status!=='rejected');
        const open=matching.filter(s=>!s.projection.close_records.length);
        if(open.length>1){status.textContent='More than one workout needs interpretation before continuing. No new workout was created.';return {mounted:false,code:'WORKOUT_SESSION_PARTITION_REQUIRED',state:14};}
        if(open.length===1){
          continuation=await client.prepareWorkoutContinuation({session_start_op_id:open[0].start.operation.op_id});
          if(disposed)return {mounted:false,code:'WORKOUT_HOST_DISPOSED'};
          if(continuation?.prepared!==true){status.textContent='This saved workout cannot yet continue. Resolve its current assessment or recovery state; no new workout was created.';return {mounted:false,code:continuation?.code||'WORKOUT_RESUME_UNAVAILABLE',state:continuation?.state};}
          needsReconciliation.delete(client);startIssued=true;
        }else if(matching.length&&!prepareNewWorkout){
          status.textContent='Workout history recovered. Finished and skipped entries remain distinct.';renderHistory(shell,matching,true);
          const again=el('button','Prepare another workout');again.type='button';again.addEventListener('click',()=>{if(!disposed)mountPreparedWorkoutPanel(root,{client,plannedSplitSlotId,enableContinuation:true,prepareNewWorkout:true});});shell.append(again);
          return {mounted:true,history:true};
        }
      }
      const prepared=continuation?{prepared:true,preparedId:continuation.resumeId,view:continuation.view.original}:await client.prepareWorkout({planned_split_slot_id:plannedSplitSlotId});
      if(disposed)return {mounted:false,code:'WORKOUT_HOST_DISPOSED'};
      if(prepared?.prepared!==true||!nonblank(prepared.preparedId)){
        status.textContent=prepared?.state===17?'Sign-in or installation recovery is required before preparing this workout.':
          prepared?.state===18?'Stored information needs recovery before instructions can be shown.':
          prepared?.state===19?'A rejected update needs recovery before starting another workout.':
          prepared?.state===20?'Reconnect through the host to restore the write allowance before preparing this workout.':
          prepared?.code==='WORKOUT_HISTORY_RECONCILIATION_REQUIRED'?'A saved workout needs to be recovered before starting another. No new workout was created.':
          'Instructions could not be prepared. Return to the host to resolve the current plan or recovery state.';
        return {mounted:false,code:prepared?.code||'WORKOUT_PREPARATION_UNAVAILABLE',state:prepared?.state};
      }
      // A fresh immutable display copy; shape equality is not producer/basis authorization.
      const view=validator.prepare(prepared.view,{producer:prepared.view.producer,basis:prepared.view.basis});
      let currentView=continuation?.view.current||view,allowedActions=continuation?.view.allowed_actions||['set','skip','close'];
      let currentSelection=null,currentAvailable=true;
      const slotKey=slot=>JSON.stringify([slot.lift_lineage_id,slot.logical_set_slot]);
      // Display-only facts from the host's interpreted continuation or an exact
      // acknowledged local action. No accepted-order or eligibility inference.
      const displayedCompletions=new Map((continuation?.view.slots||[]).filter(s=>s.completion).map(s=>[slotKey(s),structuredClone(s.completion)]));
      const original=el('details'),caption=el('summary','Prepared instructions — not yet saved');
      if(continuation)caption.textContent='Original instructions — recovered unchanged';
      original.className='prepared-original';original.setAttribute('aria-label','Original workout instructions');original.append(caption);
      const show=(parent,name,cell)=>{
        const line=el('p');line.append(el('strong',name+': '),doc.createTextNode(cell.display));
        if(cell.state!=='specified')line.append(doc.createTextNode(cell.state==='unknown'?' (unknown)':' (not prescribed)'));
        parent.append(line);
      };
      for(const key of ['instruction','reason','confidence'])show(original,key[0].toUpperCase()+key.slice(1),view.session[key]);
      const list=el('ol');for(const slot of view.slots){
        const item=el('li');item.append(el('h3',slot.label));
        for(const key of ['load','reps','effort','setup','reason','confidence'])show(item,key[0].toUpperCase()+key.slice(1),slot[key]);
        list.append(item);
      }original.append(list);
      const style=el('style',`.prepared-workout-host{max-width:38rem;margin-inline:auto;background:#F4F0E8;color:#1C1B18;font:1rem/1.5 'Instrument Sans','Helvetica Neue',Helvetica,Arial,sans-serif;overflow-wrap:anywhere}.prepared-workout-host>p{padding:16px 24px 0;margin:0;font-size:.875em;color:#5A5348}.prepared-workout-host>.prepared-instruction{padding:16px 24px 0;color:#2E5A3C;font-size:1em}.prepared-workout-host .prepared-original{padding:12px 24px 24px;margin:0;border-top:1px solid #D8D0C2}.prepared-workout-host .prepared-original summary{font:500 1em/1.5 'Instrument Sans','Helvetica Neue',Helvetica,Arial,sans-serif;min-height:44px;cursor:pointer}.prepared-workout-host .prepared-original h3{font:400 1.5em/1.2 'Instrument Serif',Georgia,serif;margin:16px 0 10px}.prepared-workout-host .prepared-original p{margin:.5em 0}.prepared-workout-host .prepared-original ol{padding-left:1.5em}.prepared-workout-host .prepared-original li{padding:12px 0;border-top:1px solid #D8D0C2}.prepared-workout-host summary:focus-visible{outline:3px solid #2E5A3C;outline-offset:3px}.prepared-workout-host .workout-command-panel{padding-top:20px}.prepared-workout-host .workout-command-panel .wcp-title{font-size:2.75em}.prepared-workout-host .workout-command-panel>p:first-of-type{margin-bottom:10px}@media(max-width:340px){.prepared-workout-host>p,.prepared-workout-host>.prepared-instruction{padding-inline:18px}.prepared-workout-host .prepared-original{padding-inline:18px}}`);
      const instruction=el('p',view.session.instruction.display+(view.session.instruction.state==='specified'?'':view.session.instruction.state==='unknown'?' (unknown)':' (not prescribed)'));instruction.className='prepared-instruction';
      const controls=el('div');shell.append(style,instruction,controls,original);
      const currentReason=el('p',continuation?.view.current_reason||'');currentReason.className='prepared-current-reason';currentReason.hidden=!continuation;shell.insertBefore(currentReason,controls);
      if(continuation)renderHistory(shell,history.sessions.filter(s=>s.start.operation.op_id===continuation.view.session_start_op_id));
      const first=view.slots[0];
      const active=el('section');active.className='prepared-active-slot';active.setAttribute('aria-label','Original instructions for this set');
      active.style.cssText='order:3;padding-bottom:16px';
      style.textContent+=`.prepared-active-slot .prepared-strip{list-style:none;display:flex;flex-wrap:wrap;gap:7px;padding:0;margin:0 0 20px}.prepared-strip li{flex:1 1 3.5em;border-top:2px solid #D8D0C2;padding-top:7px;color:#5A5348;font-size:.875em}.prepared-strip li[aria-current=step]{border-color:#1C1B18;color:#1C1B18}.prepared-active-slot .prepared-targets{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin:8px 0 14px}.prepared-targets p{color:#5A5348;font-size:.875em}.prepared-targets .prepared-value{display:block;color:#1C1B18;font:400 2em/1.15 'Instrument Serif',Georgia,serif;margin-top:5px}.prepared-active-slot>.prepared-target-label{color:#5A5348;font-weight:400}`;
      style.textContent+=`.prepared-strip .prepared-strip-value{display:block;margin-top:4px;font-size:1.125em;font-weight:500;line-height:1.35}.prepared-strip li[data-recorded]{border-color:#2E5A3C;color:#2E5A3C}.prepared-active-slot details{border-top:1px solid #D8D0C2;margin-top:16px;padding-top:4px}.prepared-active-slot summary{min-height:44px;box-sizing:border-box;padding:10px 0;cursor:pointer;color:#5A5348}.prepared-active-slot .prepared-current-instructions[open]{border-top:2px solid #2E5A3C}.prepared-active-slot .prepared-current-instructions[open]>summary{color:#2E5A3C;font-weight:500}.prepared-workout-host .workout-command-panel .wcp-entry input{font-size:max(1.5em,16px)}.prepared-workout-host .workout-command-panel .wcp-entry-heading{font-size:1.125em}`;
      const displayActive=selection=>{
        currentSelection=selection;
        active.replaceChildren();
        const selected=view.slots[selection.index];
        if(!selected||selected.logical_set_slot!==selection.logical_set_slot||selected.lift_lineage_id!==selection.lift_lineage_id)
          throw new Error('Original slot unavailable');
        const strip=el('ol');strip.className='prepared-strip';strip.setAttribute('aria-label','Workout entry position');
        const liftSlots=view.slots.map((slot,index)=>({slot,index})).filter(row=>row.slot.lift_lineage_id===selected.lift_lineage_id);
        strip.setAttribute('aria-label','Sets for this exercise');
        liftSlots.forEach(({slot,index},position)=>{
          const item=el('li'),name=el('span','Set '+(position+1)),done=displayedCompletions.get(slotKey(slot));
          item.setAttribute('data-slot',slot.logical_set_slot);item.append(name,doc.createTextNode(' '));
          const detail=done?.kind==='skipped'?'Skipped':done?.kind==='performed'?`${done.values.reps.value} reps recorded`:slot.reps.display+(slot.reps.state==='specified'?'':slot.reps.state==='unknown'?' (unknown)':' (not prescribed)');
          const value=el('strong',detail);value.className='prepared-strip-value';item.append(value);
          if(done)item.setAttribute('data-recorded',done.kind);
          if(index===selection.index)item.setAttribute('aria-current','step');strip.append(item);
        });
        const label=el('p','Original instructions for this set');label.className='prepared-target-label';
        const targets=el('div');targets.className='prepared-targets';
        for(const [key,name] of [['load','Weight'],['reps','Repetitions']]){
          const cell=selected[key],line=el('p',name),value=el('span',cell.display+(cell.state==='specified'?'':cell.state==='unknown'?' (unknown)':' (not prescribed)'));
          value.className='prepared-value';line.append(value);targets.append(line);
        }
        active.append(strip,label,targets);show(active,'Effort',selected.effort);
        const originalDetails=el('details');originalDetails.className='prepared-set-details';originalDetails.append(el('summary','Setup and prescription details'));
        for(const key of ['setup','reason','confidence'])show(originalDetails,key[0].toUpperCase()+key.slice(1),selected[key]);active.append(originalDetails);
        if(enableContinuation&&!currentAvailable){
          active.append(el('p','Current instructions unavailable. Recover this workout before continuing.'));
        }else if(enableContinuation){
          const now=currentView.slots[selection.index],changed=['load','reps','effort','setup','reason','confidence'].some(key=>JSON.stringify(now[key])!==JSON.stringify(selected[key]));
          const assessment=el('details');assessment.className='prepared-current-instructions';assessment.open=changed;
          assessment.append(el('summary',changed?'Current instructions differ':'Current instructions and assessment'));
          for(const key of ['load','reps','effort','setup','reason','confidence'])show(assessment,key[0].toUpperCase()+key.slice(1),now[key]);active.append(assessment);
        }
      };
      const refreshCurrent=async startId=>{
        let p;try{p=await client.prepareWorkoutContinuation({session_start_op_id:startId});}
        catch{p={prepared:false,code:'WORKOUT_RESUME_UNAVAILABLE'};}
        if(disposed)return {acknowledged:false,code:'WORKOUT_HOST_DISPOSED',state:3};
        if(p?.prepared!==true){currentAvailable=false;allowedActions=[];currentReason.hidden=false;currentReason.textContent='Current assessment unavailable. Recover this workout before continuing.';if(currentSelection)displayActive(currentSelection);return p;}
        currentAvailable=true;currentView=p.view.current;allowedActions=p.view.allowed_actions.slice();currentReason.hidden=false;currentReason.textContent='Current assessment: '+p.view.current_reason;
        if(currentSelection)displayActive(currentSelection);return p;
      };
      const proxy={async execute(command,args){
        if(command!=='workout'||args.action!=='start'){
          const displayInput=structuredClone(args.input);
          const recordDisplay=result=>{
            if(!disposed&&result?.acknowledged===true&&nonblank(result.op_id)&&['set','skip'].includes(args.action)){
              displayedCompletions.set(slotKey(displayInput),args.action==='set'?{kind:'performed',op_id:result.op_id,values:displayInput}:{kind:'skipped',op_id:result.op_id});
              if(currentSelection)displayActive(currentSelection);
            }
            return result;
          };
          if(!enableContinuation)return recordDisplay(await client.execute(command,args));
          const p=await refreshCurrent(args.input.session_start_op_id);if(p?.prepared!==true)return {...p,acknowledged:false,code:'WORKOUT_CURRENT_ASSESSMENT_UNAVAILABLE'};
          const result=await client.executeResumedWorkout({resumeId:p.resumeId,action:args.action,input:args.input});
          if(!disposed&&result?.acknowledged===true&&args.action!=='close')await refreshCurrent(args.input.session_start_op_id);
          return recordDisplay(result);
        }
        startIssued=true;
        let result=await client.startPreparedWorkout({preparedId:prepared.preparedId});
        if(!disposed&&result?.outcomeUnknown===true){
          status.textContent='Checking whether this start was saved…';
          // Same handle reads the exact authenticated operation; it cannot build a second Start.
          result=await client.startPreparedWorkout({preparedId:prepared.preparedId});
          if(result?.acknowledged!==true)result={...result,acknowledged:false,outcomeUnknown:true};
        }
        if(!disposed&&result?.acknowledged===true&&nonblank(result.op_id)){
          caption.textContent='Original instructions — saved on this device';status.textContent='Original instructions retained with this workout start.';
          if(enableContinuation)await refreshCurrent(result.op_id);
        }
        return result;
      }};
      panel=mountWorkoutCommandPanel(controls,{client:proxy,selection:{planned_split_slot_id:plannedSplitSlotId,
        plan_basis:view.basis.plan_basis,logical_set_slot:first.logical_set_slot,lift_lineage_id:first.lift_lineage_id,label:first.label},
        additionalSlots:view.slots.slice(1).map(({logical_set_slot,lift_lineage_id,label})=>({logical_set_slot,lift_lineage_id,label})),onActiveSlotChange:displayActive,
        ...(continuation?{continuation:{session_start_op_id:continuation.view.session_start_op_id,completed_slots:continuation.view.slots.filter(s=>s.completion).map(({logical_set_slot,lift_lineage_id})=>({logical_set_slot,lift_lineage_id}))}}:{}),
        ...(enableContinuation?{canExecute:action=>allowedActions.includes(action)}:{})});
      controls.querySelector('.wcp-progress').after(active);
      status.textContent=continuation?'Synthetic workout resumed from storage. Original instructions are unchanged; the current assessment is shown separately.':'Synthetic prepared instructions. Performed weight and repetitions are entered separately below.';
      return {mounted:true};
    }catch{
      if(!disposed)status.textContent='Instructions are unavailable. Return to the host for recovery; nothing is shown as saved.';
      return {mounted:false,code:'WORKOUT_HOST_FAILED'};
    }
  })();
  return Object.freeze(handle);
}
