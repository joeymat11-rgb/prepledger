'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const {state,lift,clone,patch}=require('./helpers.cjs');
const entry=x=>({id:'synthetic_press',w:100,reps:[10,10],rir:2,rirEnd:0,...x});
const slp=()=>({clean:true,last:{h:8},mean3:8});
return {id:'V4-load-writes-advance-per-set-vector',defect:'D41',theme: 'scalar-per-set-load',family:'progression',cite:'D41; app.jsx @ fe516c1:2617-2625,10123',expect:'GREEN',
 run(B){const T=B.engine();let s=state();s.exercises=[lift({id:'synthetic_press',n:'Synthetic press',sets:2,hi:10,wSets:[100,95]})];for(const d of ['2026-08-27','2026-08-31'])s=T.completeSession(s,d,[entry()],slp()).s;const q=s.queue.find(x=>x.kind==='debut'&&!x.done);if(!q||q.newW!==105||JSON.stringify(q.newWSets)!=='[105,100]')throw Error('D41 real queued vector missing');const done=T.completeSession(s,'2026-09-03',[entry({w:105,reps:[9,8],isDebutNow:true})],slp()).s;const initial=state();initial.exercises=[lift({id:'synthetic_press',n:'Synthetic press',sets:2,hi:10,wSets:[100,95]})];const ap={id:'synthetic-reset',kind:'reset',exId:'synthetic_press',newW:90,title:'Synthetic reset'};initial.agentProposals=[ap];const reset=T.applyAgentProposal(initial,ap,'2026-09-03');return {ok:done.exercises[0].w===105&&JSON.stringify(done.exercises[0].wSets)==='[105,100]'&&reset.exercises[0].w===90&&JSON.stringify(reset.exercises[0].wSets)==='[90,85]',detail:'Debut copies its queued vector; reset applies its scalar delta to every set.'};},
 control(B){let C=patch(B,'completeSession',(old)=>function(s,d,en,...args){const queues=clone(s.queue||[]),r=old(s,d,en,...args);for(const e of en)if(e.isDebutNow){const q=queues.find(q=>q.exId===e.id&&!q.done&&q.newWSets),ex=r.s.exercises.find(x=>x.id===e.id);if(q&&ex)ex.wSets=clone(q.newWSets);}return r;});return patch(C,'applyAgentProposal',(old)=>function(s,ap,d){const prior=s.exercises?.find(e=>e.id===ap.exId),r=old(s,ap,d),e=r.exercises?.find(e=>e.id===ap.exId);if(ap.kind==='reset'&&e&&prior?.wSets)e.wSets=prior.wSets.map(w=>w+e.w-prior.w);return r;});},
 mutants:[{name:'scalar-only-debut-write',make:B=>patch(B,'completeSession',(_,T)=>T.__auditOriginal.completeSession)},{name:'scalar-only-reset-write',make:B=>patch(B,'applyAgentProposal',(_,T)=>T.__auditOriginal.applyAgentProposal)}]};

})());

laws.push((()=>{
'use strict';
const {state,lift,patch}=require('./helpers.cjs');
return {id:'V4-owned-session-retains-entered-load',defect:'D43',theme: 'scalar-per-set-load',family:'progression',cite:'D43; app.jsx @ fe516c1:2586,2628-2651,2757',expect:'GREEN',
 run(B){const T=B.engine(),s=state();s.exercises=[lift({id:'synthetic_press',n:'Synthetic press',sets:2,hi:10,std:[8,8],own:true})];const r=T.completeSession(s,'2026-09-03',[{id:'synthetic_press',w:110,reps:[8,8],rir:2,rirEnd:0}],{clean:true,last:{h:8},mean3:8}),e=r.s.sessionLog['2026-09-03'].entries.find(e=>e.id==='synthetic_press');if(r.s.exercises[0].own||r.s.exercises[0].lastMeta.w!==110)throw Error('D43 actual owned writer branch missing');return {ok:e.w===110,detail:'The completed session must store the athlete-entered load at the owned-standard branch.'};},
 control(B){return patch(B,'completeSession',(old)=>function(s,d,entries,...args){const r=old(s,d,entries,...args);for(const en of entries){const ex=s.exercises.find(x=>x.id===en.id),stored=r.s.sessionLog[d].entries.find(x=>x.id===en.id);if(ex?.own&&ex.std&&typeof en.w==='number'&&stored)stored.w=en.w;}return r;});},
 mutants:[{name:'owned-early-return-records-configured-load',make:B=>patch(B,'completeSession',(_,T)=>T.__auditOriginal.completeSession)}]};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
