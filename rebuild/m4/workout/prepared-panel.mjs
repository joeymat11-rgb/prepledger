import {mountWorkoutCommandPanel} from './command-panel.mjs';
import Capture from './capture.cjs';
import {parseStrictJson} from '../../m3/w6/strict-json.mjs';

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
  if(enableContinuation&&!['readWorkoutHistory','prepareWorkoutContinuation','executeResumedWorkout'].every(k=>typeof client[k]==='function'))throw new TypeError('Interpreted continuation client required');
  roots.get(root)?.dispose();clients.get(client)?.dispose();
  const doc=root.ownerDocument,el=(tag,text)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
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
      const renderHistory=(parent,sessions)=>{
        const historyPanel=el('section');historyPanel.className='prepared-history';historyPanel.setAttribute('aria-label','Recovered workout history');
        historyPanel.append(el('h2','Recorded workout'),el('p','Recovered from authenticated storage. Local and accepted facts remain distinct; this does not assert progression eligibility.'));
        for(const s of sessions){
          const list=el('ol');
          for(const f of s.projection.facts){
            const v=f.current,slot=s.original?.slots.find(x=>x.logical_set_slot===f.logical_set_slot&&x.lift_lineage_id===f.lift_lineage_id);
            list.append(el('li',`${slot?.label||'Recorded set'} — ${f.included===false?'excluded from current interpretation':v?`${v.load.value} ${v.load.unit} × ${v.reps.value} ${v.reps.unit}`:'interpretation required'} (${f.current_status||f.source_status})`));
          }
          for(const row of s.records.filter(r=>r.operation.kind==='session-skip'))list.append(el('li',`Skipped entry — ${row.operation.payload.reason} (${row.status})`));
          for(const close of s.projection.close_records)list.append(el('li',`${close.kind==='normal'?'Workout finished':'Workout ended early'} (${close.status})`));
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
          status.textContent='Workout history recovered. Finished and skipped entries remain distinct.';renderHistory(shell,matching);
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
      let currentSelection=null;
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
      style.textContent+=`.prepared-active-slot .prepared-strip{list-style:none;display:flex;flex-wrap:wrap;gap:7px;padding:0;margin:0 0 20px}.prepared-strip li{flex:1 1 3.5em;border-top:2px solid #D8D0C2;padding-top:7px;color:#5A5348;font-size:.875em}.prepared-strip li[aria-current=step]{border-color:#1C1B18;color:#1C1B18}.prepared-active-slot .prepared-targets{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin:8px 0 14px}.prepared-targets p{color:#5A5348;font-size:.875em}.prepared-targets .prepared-value{display:block;color:#1C1B18;font:400 1.7em/1.2 'Instrument Serif',Georgia,serif;margin-top:5px}.prepared-active-slot>.prepared-target-label{color:#5A5348;font-weight:400}`;
      const displayActive=selection=>{
        currentSelection=selection;
        active.replaceChildren();
        const selected=view.slots[selection.index];
        if(!selected||selected.logical_set_slot!==selection.logical_set_slot||selected.lift_lineage_id!==selection.lift_lineage_id)
          throw new Error('Original slot unavailable');
        const strip=el('ol');strip.className='prepared-strip';strip.setAttribute('aria-label','Workout entry position');
        view.slots.forEach((_slot,index)=>{const item=el('li','Entry '+(index+1));if(index===selection.index)item.setAttribute('aria-current','step');strip.append(item);});
        const label=el('p','Original instructions for this set');label.className='prepared-target-label';
        const targets=el('div');targets.className='prepared-targets';
        for(const [key,name] of [['load','Weight'],['reps','Repetitions']]){
          const cell=selected[key],line=el('p',name),value=el('span',cell.display+(cell.state==='specified'?'':cell.state==='unknown'?' (unknown)':' (not prescribed)'));
          value.className='prepared-value';line.append(value);targets.append(line);
        }
        active.append(strip,label,targets);show(active,'Effort',selected.effort);
        if(enableContinuation){const now=currentView.slots[selection.index];active.append(el('h3','Current instructions'));for(const key of ['load','reps','effort','reason','confidence'])show(active,key[0].toUpperCase()+key.slice(1),now[key]);}
      };
      const refreshCurrent=async startId=>{
        const p=await client.prepareWorkoutContinuation({session_start_op_id:startId});
        if(disposed)return {acknowledged:false,code:'WORKOUT_HOST_DISPOSED',state:3};
        if(p?.prepared!==true){allowedActions=[];currentReason.hidden=false;currentReason.textContent='Current assessment unavailable. Recover this workout before continuing.';return p;}
        currentView=p.view.current;allowedActions=p.view.allowed_actions.slice();currentReason.hidden=false;currentReason.textContent='Current assessment: '+p.view.current_reason;
        if(currentSelection)displayActive(currentSelection);return p;
      };
      const proxy={async execute(command,args){
        if(command!=='workout'||args.action!=='start'){
          if(!enableContinuation)return client.execute(command,args);
          const p=await refreshCurrent(args.input.session_start_op_id);if(p?.prepared!==true)return {...p,acknowledged:false};
          const result=await client.executeResumedWorkout({resumeId:p.resumeId,action:args.action,input:args.input});
          if(!disposed&&result?.acknowledged===true&&args.action!=='close')await refreshCurrent(args.input.session_start_op_id);
          return result;
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
