'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const {state,clone,patch}=require('./helpers.cjs');
return {id:'V4-merge-preserves-written-trial-decisions',defect:'D38',theme: 'merge-tie-identity',family:'engine',cite:'D38; app.jsx @ fe516c1:10125-10126,10138,13876,14070',expect:'GREEN',
 run(B){const T=B.engine(),ap={id:'synthetic-trial',kind:'trial',custom:{abId:'synthetic-ab',t:'Synthetic trial'}},s=state();s.agentProposals=[ap];let ok=true;for(const name of ['applyAgentProposal','dismissAgentProposal']){const decided=T[name](clone(s),clone(ap),'2026-08-30');if(decided.trials.length!==1)throw Error('D38 real trial writer missing');for(const pair of [[decided,state()],[state(),decided]]){const out=T.mergeState(...clone(pair));ok=ok&&out.trials.some(r=>JSON.stringify(r)===JSON.stringify(decided.trials[0]));}}return {ok,detail:'Accepted and declined trial facts written by real writers must survive both merge directions.'};},
 control(B){return patch(B,'mergeState',(old)=>function(a,b){const rows=[...(a.trials||[]),...(b.trials||[])],out=old(a,b),seen=new Set(out.trials.map(r=>JSON.stringify(r)));for(const r of rows)if(!seen.has(JSON.stringify(r))){out.trials.push(clone(r));seen.add(JSON.stringify(r));}out.trials.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));return out;});},
 mutants:[{name:'trial-key-id-or-day-only',make:B=>patch(B,'mergeState',(_,T)=>T.__auditOriginal.mergeState)}]};

})());

laws.push((()=>{
'use strict';
const {state,lift,clone,patch}=require('./helpers.cjs');
return {id:'V4-merge-preserves-offer-dismissal',defect:'D39',theme: 'merge-tie-identity',family:'engine',cite:'D39; app.jsx @ fe516c1:10132-10141,14071,14216',expect:'GREEN',
 run(B){const T=B.engine(),ap={id:'synthetic-volume',kind:'volume',pg:52,mg:'chest',exId:'synthetic_press',dir:1,title:'Synthetic volume offer'},other={id:'unrelated-reset',kind:'reset',exId:'synthetic_press',newW:90,title:'Unrelated reset'},s=state();s.agentProposals=[ap,other];s.exercises=[lift({id:'synthetic_press',n:'Synthetic press',sets:2,hi:10})];const dismissed=T.dismissAgentProposal(clone(s),clone(ap),'2026-08-30');if(dismissed.agentProposals.some(p=>p.id===ap.id)||!dismissed.agentProposals.some(p=>p.id===other.id))throw Error('D39 real selective dismissal missing');const a=T.mergeState(clone(dismissed),clone(s)),b=T.mergeState(clone(s),clone(dismissed));return {ok:[a,b].every(x=>!x.agentProposals.some(p=>p.id===ap.id)&&x.agentProposals.some(p=>p.id===other.id)),detail:'A stale copy must not reopen the same dismissed offer; the unrelated offer remains available.'};},
 control(B){let C=patch(B,'dismissAgentProposal',(old)=>function(s,ap,d){const out=old(s,ap,d);out.auditDismissed=[...(out.auditDismissed||[]),ap.id];return out;});return patch(C,'mergeState',(old)=>function(a,b){const ids=[...new Set([...(a.auditDismissed||[]),...(b.auditDismissed||[])])],out=old(a,b);out.auditDismissed=ids;out.agentProposals=out.agentProposals.filter(p=>!ids.includes(p.id));return out;});},
 mutants:[{name:'union-stale-offer-without-decision',make:B=>patch(B,'mergeState',(_,T)=>T.__auditOriginal.mergeState)},{name:'drop-every-offer-on-merge',make:B=>patch(B,'mergeState',old=>(a,b)=>({...old(a,b),agentProposals:[]}))}]};

})());

laws.push((()=>{
'use strict';
const {state,clone,patch}=require('./helpers.cjs');
return {id:'V4-daily-conflict-direction-independent',defect:'D40',theme: 'merge-tie-identity',family:'engine',cite:'D40; app.jsx @ fe516c1:13372,13881-13885,14081,14240',expect:'GREEN',
 run(B){const T=B.engine(),a=state(),b=state();a.dailyLogs['2026-08-30']={cal:2000};b.dailyLogs['2026-08-30']={cal:2100};const ab=T.mergeState(clone(a),clone(b)),ba=T.mergeState(clone(b),clone(a));return {ok:JSON.stringify(ab.dailyLogs)===JSON.stringify(ba.dailyLogs),detail:'Equal-authority daily values must resolve independently of merge direction.'};},
 control(B){return patch(B,'mergeState',(old)=>function(a,b){const x=clone(a.dailyLogs||{}),y=clone(b.dailyLogs||{}),out=old(a,b);for(const d of Object.keys(x))if(y[d]&&JSON.stringify(x[d]).length===JSON.stringify(y[d]).length)out.dailyLogs[d]=[x[d],y[d]].sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))).at(-1);return out;});},
 mutants:[{name:'equal-richness-local-wins',make:B=>patch(B,'mergeState',(_,T)=>T.__auditOriginal.mergeState)}]};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
