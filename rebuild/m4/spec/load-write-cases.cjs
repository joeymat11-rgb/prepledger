'use strict';
// Invented states only. This import-free module runs under the unchanged strict
// post-fix target; it cannot load a candidate or manufacture its own reference.
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=v=>JSON.parse(JSON.stringify(v));
const sleep={clean:true,last:{h:8},mean3:8};
function state(){return {v:60,reads:[],dailyLogs:{},sessionLog:{},exercises:[{id:'synthetic_press',n:'Synthetic press',mg:'chest',day:'U',w:100,wSets:[100,95],sets:2,hi:10,lo:8,inc:5,last:[8,8],own:false,std:null,reclaim:null,ladder:null,topAt:null,topRun:0,forks:[]}],exOrder:{U:['synthetic_press'],L:[]},trend:180,model:{anchorISO:'2026-08-01',lean:135,drip:0,src:'EYE'},sleep:{nights:[],cleanH:7,needed:3},blackout:{until:'2026-07-01'},targets:{},plan:{autonomy:'propose',mode:'bodycomp'},queue:[],feed:[],weekly:[],events:[],proposals:[],agentProposals:[],adjustments:[],forecasts:[],accepted:[],retirements:{},split:[]};}
const entry=extra=>({id:'synthetic_press',w:100,reps:[10,10],rir:2,rirEnd:0,...extra});
const tests=[];
function add(id,defect,claims,execute){tests.push({id,defect,claims,execute});}
function seedQueue(T){let s=state();for(const day of ['2026-08-27','2026-08-31'])s=T.completeSession(s,day,[entry()],sleep).s;return s;}
for(const vector of [true,false])add('LW41-DEBUT'+(vector?'':'-NO-VECTOR'),'D41',['reached','vector','scalar','nonalias','input'],c=>{
 const s=seedQueue(c.T),q=s.queue.find(q=>q.kind==='debut'&&!q.done);if(!q)throw Error('Synthetic debut prerequisite missing');if(!vector)delete q.newWSets;
 const before=clone(s),out=c.T.completeSession(s,c.day,[entry({w:105,reps:[9,8],isDebutNow:true})],sleep),ex=out.s.exercises[0],saved=out.s.queue.find(x=>x.id===q.id);
 c.check('reached',!!saved&&saved.done===true);c.check('vector',equal(ex.wSets,vector?[105,100]:[100,95]));c.check('scalar',ex.w===105);c.check('nonalias',!vector||ex.wSets!==saved.newWSets);c.check('input',equal(s,before));c.record({s,out});
});
for(const kind of ['VECTOR','NULL','ABSENT','OLD-NULL'])add('LW41-RESET-'+kind,'D41',['vector','scalar','input'],c=>{
 const s=state();if(kind==='NULL')s.exercises[0].wSets=null;if(kind==='ABSENT')delete s.exercises[0].wSets;if(kind==='OLD-NULL')s.exercises[0].w=null;
 const ap={id:'synthetic-reset',kind:'reset',exId:'synthetic_press',newW:90,title:'Synthetic reset'};s.agentProposals=[ap];const before=clone(s),out=c.T.applyAgentProposal(s,ap,c.day);
 c.check('vector',kind==='ABSENT'?!Object.hasOwn(out.exercises[0],'wSets'):equal(out.exercises[0].wSets,kind==='NULL'?null:kind==='OLD-NULL'?[100,95]:[90,85]));c.check('scalar',out.exercises[0].w===90);c.check('input',equal(s,before));c.record({s,out});
});
add('LW41-RESET-NON-DYADIC','D41',['vector','scalar','input','controls'],c=>{
 const s=state();s.exercises[0].w=100.1;s.exercises[0].wSets=[100.1,95.2];
 const ap={id:'synthetic-decimal-reset',kind:'reset',exId:'synthetic_press',newW:90.1,title:'Synthetic decimal reset'};
 s.agentProposals=[ap];const before=clone(s),out=c.T.applyAgentProposal(s,ap,c.day);
 c.check('vector',equal(out.exercises[0].wSets,[90.1,85.20000000000002]));c.check('scalar',out.exercises[0].w===90.1);c.check('input',equal(s,before));
 c.check('controls',equal(out.plan,before.plan)&&equal(out.queue,before.queue)&&out.agentProposals.length===0&&equal(out.feed,[{
  d:c.day,t:'RESET APPLIED — Synthetic press 100.1 → 90.1',how:'3-session stall, evidence-based back-off, your consent — rebuild starts next session'}]));
 c.record({s,out});
});
for(const kind of ['OWNED','REPEATED','ORDINARY','OMITTED'])add('LW43-'+kind,'D43',['loads','input'],c=>{
 const s=state();if(kind==='OWNED'){s.exercises[0].own=true;s.exercises[0].std=[8,8];}
 const rows=kind==='REPEATED'?[entry({w:110,reps:[8]}),entry({w:90,reps:[6]})]:[entry({w:kind==='OWNED'?110:100,reps:[8,8]})];if(kind==='OMITTED')delete rows[0].w;
 const before=clone({s,rows}),out=c.T.completeSession(s,c.day,rows,sleep);
 c.check('loads',equal(out.s.sessionLog[c.day].entries.map(e=>e.w),kind==='REPEATED'?[110,90]:[kind==='OWNED'?110:100]));
 // completeSession's unchanged provenance pre-pass adds og to caller entries.
 c.check('input',equal(s,before.s)&&equal(rows,before.rows.map(row=>({...row,og:0}))));c.record({s,rows,out});
});
add('LW41-MERGE-MINT','D41',['mint','isolation'],c=>{
 const a=c.T.completeSession(state(),'2026-08-27',[entry()],sleep).s,b=c.T.completeSession(state(),'2026-08-31',[entry()],sleep).s,out=c.T.mergeState(a,b),other=c.engine();
 // The original merge normalizes caller state. Exact pre/post graph comparison
 // preserves that behavior; this case does not invent input immutability.
 c.check('mint',out.queue.some(q=>q.kind==='debut'&&!q.done));c.check('isolation',other.earnWalk!==c.T.earnWalk&&other.SEED!==c.T.SEED);c.record({a,b,out});
});
const CASES=tests.map(({execute,...row})=>row);
const ASSERTION_INVENTORY=tests.flatMap(t=>t.claims.map(name=>({caseId:t.id,defect:t.defect,id:t.id+'/'+name})));
const laws=['D41','D43'].map(defect=>({id:'V4-'+defect+'-LOAD-WRITES',defect,expect:'GREEN',implementation:'PRESENT',cite:'PERFORMED-ENGINE-v1 §6; approved D41/D43 source literals',async run(target){
 const selected=tests.filter(t=>t.defect===defect&&(!target.caseId||target.caseId===t.id));if(!selected.length)throw Error('Missing load case');const assertions=[];
 for(const t of selected){let seen=0;const c={T:target.engine(),day:target.day,engine:target.engine,check(name,ok){if(name!==t.claims[seen++])throw Error('Load assertion order');assertions.push({id:t.id+'/'+name,ok:!!ok});},record(value){target.record(t.id,value);}};t.execute(c);if(seen!==t.claims.length)throw Error('Missing load assertion');}
 return {ok:assertions.every(a=>a.ok),assertions};
},mutant:[]}));
module.exports={laws,CASES,ASSERTION_INVENTORY,INVENTORY:laws.map(l=>l.id)};
