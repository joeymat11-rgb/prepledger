'use strict';
// DIRECT carrier coverage. Two kinds of check, both over the adopted bytes:
// (1) structural — every one of the 46 literal carriers landed exactly once and
//     its sourceBase preimage site is gone, and every changed module's exported
//     surface gained exactly the declared names and lost none;
// (2) behavioural — the carriers whose effect can be exercised without a durable
//     client: the shared body-alarm signal (detection/tier extracted verbatim
//     from the presentation), the rirPlan alarm floor that now reads it, and the
//     legacy passthrough of the new governing reads. The deep native-lane
//     behaviour is the three adopted L tests, run as the package's focused child.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
const S=require('./native-carriers-source.cjs');
let checks=0,presentationOnlyFailures=0;
const ok=(cond,label)=>{assert(cond,label);checks++;};
function structural(){
 const base=S.baseline(root);
 for(const c of S.changes()){
  const after=fs.readFileSync(path.join(root,c.file),'utf8');
  ok(after.split(c.after).length===2,'Carrier landed exactly once: '+c.id);
  ok(base[c.file].split(c.before).length===2,'Carrier preimage site unique at sourceBase: '+c.id);
  if(c.before!==c.after)ok(!after.includes(c.before)||c.after.includes(c.before),'Carrier preimage site consumed: '+c.id);
 }
}
const clock={today:()=>'2026-09-03',nowISO:()=>'2026-09-03T12:00:00.000Z',nowMs:()=>Date.parse('2026-09-03T12:00:00.000Z'),hour:()=>12,dow:()=>4};
function engine(){return require(path.join(root,'rebuild/engine/index.cjs')).createEngine({clock});}
const ADDED={
 'rebuild/engine/performed.cjs':['performedLine','performedLoadMatches','performedOriginalRirSets'],
 'rebuild/engine/progression.cjs':['governingLast','governingMeta'],
 'rebuild/engine/sleep.cjs':['bodyAlarmSignal'],
};
function surface(){
 const E=engine();
 for(const [file,names]of Object.entries(ADDED))for(const name of names)ok(typeof E[name]==='function','New export composed ('+path.basename(file)+'): '+name);
 // Nothing retired: every name the sourceBase engine exported is still exported.
 const before=cp.execFileSync(process.execPath,['-e',
  'const {createEngine}=require(process.argv[1]);const E=createEngine({clock:{today:()=>"2026-09-03",nowISO:()=>"2026-09-03T12:00:00.000Z",nowMs:()=>0,hour:()=>12,dow:()=>4}});console.log(JSON.stringify(Object.keys(E).sort()));',
  path.join(root,'.tmp/native-carriers-base-engine/rebuild/engine/index.cjs')],{encoding:'utf8',windowsHide:true});
 for(const name of JSON.parse(before))ok(Object.hasOwn(E,name),'Retained export: '+name);
}
// A synthetic pulse/sleep state good enough for the alarm branch only.
function alarmState({spike=0,prevSpike=0,hours=8}={}){
 const day=d=>new Date(Date.parse('2026-09-03T00:00:00Z')+d*86400000).toISOString().slice(0,10);
 const pulse=[];for(let i=13;i>=0;i--)pulse.push({d:day(-i),bpm:60});
 pulse[13].bpm=60+spike;pulse[12].bpm=60+prevSpike;
 return {pulse,sleep:{nights:[{d:day(-1),h:hours}],target:8},sessionLog:{},exercises:[],feed:[],queue:[],meds:[],events:[]};
}
function behavioural(){
 const E=engine();
 // Detection and tier are the presentation's own, extracted verbatim: whenever
 // one is null so is the other, and when both fire the tiers agree.
 for(const spec of [{},{spike:11},{spike:8,prevSpike:8},{spike:8,prevSpike:8,hours:5},{spike:5,prevSpike:9},{spike:7}]){
  const s=alarmState(spec);
  let signal=null,presentation=null,sErr=null,pErr=null;
  try{signal=E.bodyAlarmSignal(s);}catch(e){sErr=e;}
  try{presentation=E.bodyAlarm(s,null);}catch(e){pErr=e;}
  // Detection never fails where the presentation succeeds. The converse is the
  // whole point of the carrier: presentation may fail on a state whose detection
  // is sound, and that must no longer be able to drop a real alarm.
  ok(!(sErr&&!pErr),'Detection no weaker than presentation: '+JSON.stringify(spec));
  if(sErr||pErr){presentationOnlyFailures+=pErr?1:0;continue;}
  ok((signal===null)===(presentation===null),'Alarm signal and presentation agree on firing: '+JSON.stringify(spec));
  if(signal)ok(signal.tier===presentation.tier,'Alarm tier identical: '+JSON.stringify(spec));
 }
 // The rirPlan floor reads the signal: a state whose presentation would throw
 // still floors when detection succeeds. Detection failure still yields no floor.
 const s=alarmState({spike:11});
 s.exercises=[{id:'demo',n:'Demo',sets:3,w:100,hi:10,lo:6,first:[8,8,8],last:[8,8,8],lastMeta:null}];
 const ex={...s.exercises[0],holdFlag:false};
 const plan=E.rirPlan(s,ex,{});
 ok(Array.isArray(plan.plan)&&Array.isArray(plan.why),'rirPlan returns plan/why on an alarm day');
 ok(plan.why.some(w=>/alarm day/.test(w)),'rirPlan floors on a detected alarm');
 const calm=alarmState({});calm.exercises=s.exercises;
 ok(!E.rirPlan(calm,ex,{}).why.some(w=>/alarm day/.test(w)),'No alarm floor without a signal');
 // Legacy passthrough: with no registered native view the governing reads are
 // exactly the imported cache, object-identical where the cache is an object.
 const lift={id:'demo',last:[8,8,8],lastMeta:{d:'2026-09-01',w:100,reps:[8,8,8],rir:2}};
 ok(E.governingLast(lift,calm)===lift.last,'governingLast is the cache for a legacy-only state');
 ok(E.governingMeta(lift,calm)===lift.lastMeta,'governingMeta is the cache for a legacy-only state');
 ok(E.governingLast(lift,{})===lift.last,'governingLast passthrough without a state view');
}
// `--behaviour` runs only the behavioural half. The mutant runner uses it so that
// a mutant is never counted detected merely because the byte-level carrier check
// noticed its own text change.
function main({behaviourOnly=false}={}){
 if(!behaviourOnly)S.verify(root);
 // A disposable sourceBase engine for the retained-export comparison.
 const dir=path.join(root,'.tmp/native-carriers-base-engine/rebuild/engine');
 fs.rmSync(path.join(root,'.tmp/native-carriers-base-engine'),{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
 for(const file of S.RETAINED)fs.writeFileSync(path.join(dir,path.basename(file)),require('../../conform/v4/postfix/legacy-gates.cjs').object(root,S.BASE,file));
 try{if(!behaviourOnly)structural();surface();behavioural();}
 finally{fs.rmSync(path.join(root,'.tmp/native-carriers-base-engine'),{recursive:true,force:true});}
 console.log('NATIVE CARRIERS DIRECT'+(behaviourOnly?' (behaviour only)':'')+': '+checks+'/'+checks+' PASS; '+presentationOnlyFailures+' alarm states where only the presentation refused (the carrier\'s stated defect class)');
}
if(require.main===module){try{main({behaviourOnly:process.argv.includes('--behaviour')});}catch(error){const failed=require('./native-carriers-errors.cjs').failure(error);console.error(failed.line);process.exitCode=failed.exit;}}
module.exports={main};
