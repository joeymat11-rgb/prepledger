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
          prepared?.state===20?'Reconnect through the host to restore the write allowance before preparing this workout.':
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
      const style=el('style',`.prepared-workout-host{max-width:38rem;margin-inline:auto;background:#F4F0E8;color:#1C1B18;font:1rem/1.5 Arial,sans-serif;overflow-wrap:anywhere}.prepared-workout-host>p,.prepared-workout-host .prepared-original{padding:20px 24px;margin:0}.prepared-workout-host .prepared-original summary{font:400 1.3em/1.2 Georgia,serif;min-height:44px;cursor:pointer}.prepared-workout-host .prepared-original h3{font-size:1em}.prepared-workout-host .prepared-original p{margin:.5em 0}.prepared-workout-host .prepared-original ol{padding-left:1.5em}.prepared-workout-host summary:focus-visible{outline:3px solid #2E5A3C;outline-offset:3px}`);
      const controls=el('div');shell.append(style,el('p',view.session.instruction.display),original,controls);
      const first=view.slots[0];
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
        additionalSlots:view.slots.slice(1).map(({logical_set_slot,lift_lineage_id,label})=>({logical_set_slot,lift_lineage_id,label}))});
      status.textContent='Synthetic prepared instructions. Performed weight and repetitions are entered separately below.';
      return {mounted:true};
    }catch{
      if(!disposed)status.textContent='Instructions are unavailable. Return to the host for recovery; nothing is shown as saved.';
      return {mounted:false,code:'WORKOUT_HOST_FAILED'};
    }
  })();
  return Object.freeze(handle);
}
