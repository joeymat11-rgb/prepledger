'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const {state,clone,patch}=require('./helpers.cjs');
return {id:'V4-break-undo-restores-scale-effect',defect:'D42',theme: 'undo-half-effects',family:'engine',cite:'D42; app.jsx @ fe516c1:10015-10021,10252,3675',expect:'GREEN',
 run(B){const T=B.engine(),s=state();s.blackout={until:'2026-08-01'};s.proposals=[{id:'synthetic-break',rid:'synthetic-break',title:'Synthetic break',apply:{kind:'break',start:'2026-09-03',end:'2026-09-09'}}];const applied=T.applyProposal(s,'synthetic-break'),undone=T.undoAdjustment(applied,'synthetic-break');if(undone.plan.brk!==null||!undone.adjustments[0].undone)throw Error('D42 real break undo missing');const a=T.applyRead(undone,'2026-09-03',181,{hour:8}),b=T.applyRead(s,'2026-09-03',181,{hour:8});return {ok:JSON.stringify(undone.blackout)===JSON.stringify(s.blackout)&&a.reads[0].sealed===b.reads[0].sealed&&a.trend===b.trend,detail:'Undoing the break must reverse its scale seal and subsequent read effect.'};},
 control(B){let C=patch(B,'applyProposal',(old)=>function(s,id){const r=old(s,id),p=s.proposals?.find(p=>p.id===id);if(p?.apply?.kind==='break'){const a=r.adjustments.find(x=>x.rid===p.rid);a.auditBlackoutUndo=clone(s.blackout);}return r;});return patch(C,'undoAdjustment',(old)=>function(s,rid){const a=[...(s.adjustments||[])].reverse().find(a=>!a.undone&&(!rid||a.rid===rid)),r=old(s,rid);if(a?.auditBlackoutUndo)r.blackout=clone(a.auditBlackoutUndo);return r;});},
 mutants:[{name:'undo-plan-without-scale-seal',make:B=>patch(B,'undoAdjustment',(_,T)=>T.__auditOriginal.undoAdjustment)}]};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
