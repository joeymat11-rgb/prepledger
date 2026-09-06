'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const {state,lift,patch}=require('./helpers.cjs');
return {id:'V4-analyst-effort-rule-matches-writer',defect:'D45',theme: 'analyst-writer-contract',family:'policy',cite:'D45; app.jsx @ fe516c1:12544,2498-2500',expect:'GREEN',
 run(B){const T=B.engine();let s=state();s.exercises=[lift({id:'synthetic_press',n:'Synthetic press',sets:2,hi:10})];const text=T.askContext(s);for(const d of ['2026-08-31','2026-09-03'])s=T.completeSession(s,d,[{id:'synthetic_press',w:100,reps:[10,10],rir:2,rirEnd:0}],{clean:true,last:{h:8},mean3:8}).s;const q=s.queue.find(x=>x.kind==='debut'&&!x.done);if(!q||q.newW!==105||s.sessionLog['2026-09-03'].entries[0].rirSets.at(-1)!==0)throw Error('D45 real terminal-zero earn missing');return {ok:!/terminal RIR gates every earn \(0 blocks it\)/.test(text)&&/opener[^.;\n]{0,80}(earn|eligib)/i.test(text)&&/terminal[^.;\n]{0,80}(target|siz|programmed)/i.test(text),detail:'Analyst context states opener-based earn eligibility and the terminal-set role, without prohibiting the actual terminal-zero earn.'};},
 control(B){return patch(B,'askContext',(old)=>(...args)=>old(...args).replace('terminal RIR gates every earn (0 blocks it)','the opener RIR guards earn eligibility; terminal zero is the programmed final-set target'));},
 mutants:[{name:'obsolete-terminal-zero-earn-prohibition',make:B=>patch(B,'askContext',(_,T)=>T.__auditOriginal.askContext)},{name:'blank-analyst-rule-text',make:B=>patch(B,'askContext',()=>()=>'' )}]};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
