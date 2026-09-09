import {mountWorkoutCommandPanel} from './command-panel.mjs';
import Capture from './capture.cjs';
import {parseStrictJson} from '../../m3/w6/strict-json.mjs';

const roots=new WeakMap(),clients=new WeakMap(),needsReconciliation=new WeakSet();
const validator=Capture.createPrescriptionCapture({parseStrictJson});
const nonblank=value=>typeof value==='string'&&value.trim().length>0;

// This lifecycle owner requires a dedicated, statically configured real public client.
// It does not qualify its producer, supply credentials, or reconstruct an active workout.
export function mountPreparedWorkoutPanel(root,{client,plannedSplitSlotId}) {
  if(!root?.ownerDocument||!nonblank(plannedSplitSlotId)||
      !['prepareWorkout','startPreparedWorkout','retireWorkoutPreparations','execute'].every(k=>typeof client?.[k]==='function'))
    throw new TypeError('Prepared workout host configuration required');
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
      if(needsReconciliation.has(client)){
        status.textContent='Restore the active workout through the host before starting again. Previous saving may have completed.';
        return {mounted:false,code:'WORKOUT_HOST_RECONCILIATION_REQUIRED'};
      }
      const prepared=await client.prepareWorkout({planned_split_slot_id:plannedSplitSlotId});
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
      const original=el('details'),caption=el('summary','Prepared instructions — not yet saved');
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
      const first=view.slots[0];
      const active=el('section');active.className='prepared-active-slot';active.setAttribute('aria-label','Original instructions for this set');
      active.style.cssText='order:3;padding-bottom:16px';
      style.textContent+=`.prepared-active-slot .prepared-strip{list-style:none;display:flex;flex-wrap:wrap;gap:7px;padding:0;margin:0 0 20px}.prepared-strip li{flex:1 1 3.5em;border-top:2px solid #D8D0C2;padding-top:7px;color:#5A5348;font-size:.875em}.prepared-strip li[aria-current=step]{border-color:#1C1B18;color:#1C1B18}.prepared-active-slot .prepared-targets{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin:8px 0 14px}.prepared-targets p{color:#5A5348;font-size:.875em}.prepared-targets .prepared-value{display:block;color:#1C1B18;font:400 1.7em/1.2 'Instrument Serif',Georgia,serif;margin-top:5px}.prepared-active-slot>.prepared-target-label{color:#5A5348;font-weight:400}`;
      const displayActive=selection=>{
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
      };
      const proxy={async execute(command,args){
        if(command!=='workout'||args.action!=='start')return client.execute(command,args);
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
        }
        return result;
      }};
      panel=mountWorkoutCommandPanel(controls,{client:proxy,selection:{planned_split_slot_id:plannedSplitSlotId,
        plan_basis:view.basis.plan_basis,logical_set_slot:first.logical_set_slot,lift_lineage_id:first.lift_lineage_id,label:first.label},
        additionalSlots:view.slots.slice(1).map(({logical_set_slot,lift_lineage_id,label})=>({logical_set_slot,lift_lineage_id,label})),onActiveSlotChange:displayActive});
      controls.querySelector('.wcp-progress').after(active);
      status.textContent='Synthetic prepared instructions. Performed weight and repetitions are entered separately below.';
      return {mounted:true};
    }catch{
      if(!disposed)status.textContent='Instructions are unavailable. Return to the host for recovery; nothing is shown as saved.';
      return {mounted:false,code:'WORKOUT_HOST_FAILED'};
    }
  })();
  return Object.freeze(handle);
}
