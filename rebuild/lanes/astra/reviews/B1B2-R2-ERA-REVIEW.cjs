'use strict';
// Independent audit of the fixed, public-only ERA reference construction.
// No candidate CLI, protected loader or whole frozen program is invoked.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),Module=require('node:module'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),base=path.join(root,'.tmp/er-b1b2-r2'),C='c4716edad91453e74ba17f70ab076781ff5367de';
assert.equal(process.version,'v22.23.2');assert.equal(process.env.TZ,'America/New_York');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),git=(...a)=>cp.execFileSync('git',a,{cwd:root,windowsHide:true,maxBuffer:8e6});
const rel='rebuild/engine/test/b2-era30.test.cjs',pub=path.join(base,'public'),text=fs.readFileSync(path.join(pub,rel),'utf8');
assert.equal(sha(text),sha(git('show',C+':'+rel)));
const boundary='const command=process.argv.slice(2);';assert.equal(text.split(boundary).length,2);
function load(dir){const file=path.join(dir,rel),m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));m._compile(text.slice(0,text.indexOf(boundary))+'\nmodule.exports={EXPECTED,EXPECTED_WIRE,EXPECTED_SHA256,REFERENCE_CONSTRUCTION,LITERALS,PROJECTED_SOURCE,PROJECTION_SHA256,specimens,buildReference,runCase,graph,engine,evaluate,ambientDate,FAMILIES,DAYS,MODES};',file);return m.exports;}
const A=load(pub);
// A separate dictionary decoder rejects invalid references, cycles and duplicate keys.
const wire=JSON.parse(text.match(/^const EXPECTED_WIRE = (.+);$/m)[1]),active=new Set(),seen=new Set(),memo=new Map();
function decode(v){if(v===null||typeof v!=='object')return v;assert.deepEqual(Object.keys(v),['d']);assert(Number.isInteger(v.d)&&v.d>=0&&v.d<wire.table.length);if(memo.has(v.d))return memo.get(v.d);assert(!active.has(v.d),'acyclic dictionary');active.add(v.d);seen.add(v.d);const row=wire.table[v.d];assert(['s','a','o'].includes(row[0]));let r;if(row[0]==='s')r=row[1];else if(row[0]==='a')r=row[1].map(decode);else{assert.equal(new Set(row[1].map(x=>x[0])).size,row[1].length);r=Object.fromEntries(row[1].map(([k,x])=>[k,decode(x)]));}active.delete(v.d);memo.set(v.d,r);return r;}
const expected=decode(wire.root);assert.deepEqual(expected,A.EXPECTED);assert.equal(sha(JSON.stringify(expected,null,2)+'\n'),A.EXPECTED_SHA256);
assert.equal(expected.results.length,212);assert.equal(new Set(expected.results.map(r=>[r.mode,r.day,r.id].join('/'))).size,212);
const phase=git('show','e5d6bbec84910b9eb27d8a7393312a5788b29fce:'+rel).toString();assert.equal(phase.match(/^const EXPECTED_WIRE = (.+);$/m)[1],text.match(/^const EXPECTED_WIRE = (.+);$/m)[1]);
const extracted=JSON.parse(fs.readFileSync(path.join(root,'.tmp/r2-review/allowed-reference.json')));
for(const r of A.LITERALS.extracts){const e=extracted.find(x=>x.name===r.name);assert.equal(e.text,r.text);assert.equal(sha(e.text),r.sha256);}
const original=extracted.find(x=>x.name==='setOneRead').text;
const ownProjection=original.replace('  const pts = [];','  const fk9 = forksOf(s, exId);\n  const at9 = fk9.length ? isoOf(todayStart()) : null;\n  const pts = [];').replace('    const sl = s.sessionLog[d];','    if (!sameEra(fk9, d, at9)) continue;\n    const sl = s.sessionLog[d];');
assert.equal(ownProjection,A.PROJECTED_SOURCE);assert.equal(sha(ownProjection),'7c797d3ffcb95c28b066fb6c0877d959e1d99109eecde5adf88b607e0ffeea3e');
// Re-evaluate the reference against its original 18 public construction inputs.
const construction=path.join(base,'era-reference-construction');fs.mkdirSync(construction,{recursive:true});
for(const row of A.REFERENCE_CONSTRUCTION.files){assert(!/seed|private|soak|history/i.test(row.file));const b=git('show',A.REFERENCE_CONSTRUCTION.head+':'+row.file);assert.equal(sha(b),row.sha256);const f=path.join(construction,row.file);fs.mkdirSync(path.dirname(f),{recursive:true});if(fs.existsSync(f))assert.deepEqual(fs.readFileSync(f),b);else fs.writeFileSync(f,b);}
const B=load(construction),rebuilt=B.buildReference();assert.deepEqual(rebuilt,expected,'all complete before/projected frames derive from named construction sources');
// Separate arithmetic and membership implementation; no candidate/reference reader
// chooses these expectations. OLS uses pair sums instead of the production loop.
function independent(c,query){
 const e=(c.s.exercises||[]).find(x=>x&&x.id===c.exId);if(!e||typeof e.w!=='number')return{status:'IDLE',exId:c.exId};
 const cuts=Array.isArray(e.forks)?e.forks:e.fork&&e.fork.from?[e.fork]:[];
 const era=d=>cuts.reduce((n,f)=>n+(f&&f.from<=d?1:0),0),which=era(query),points=[];
 for(const d of Object.keys(c.s.sessionLog||{}).sort()){
  if(cuts.length&&era(d)!==which)continue;
  const s=c.s.sessionLog[d],entry=(s.entries||[]).find(x=>x&&x.id===c.exId);
  if(!entry||!entry.reps||!entry.reps.length||String(entry.w)!==String(e.w))continue;
  let event=false;try{void c.s.dayCtx;event=(c.s.events||[]).some(x=>{const delta=(Date.parse(d+'T12:00:00')-Date.parse(x.d+'T12:00:00'))/86400000;return delta>=0&&delta<=2;});}catch{}
  if(event||s.pace==='rushed')continue;points.push([d,Number(entry.reps[0])||0]);
 }
 const n=points.length,count=()=>({status:'COUNTING',exId:c.exId,n,need:4});if(n<4)return count();const values=points.map(p=>p[1]),sum=values.reduce((x,y)=>x+y,0),mean=sum/n;if(!(mean>0))return{...count(),n:0};
 const sumx=n*(n-1)/2,sumxx=n*(n-1)*(2*n-1)/6,sumxy=values.reduce((v,y,i)=>v+i*y,0),slope=(n*sumxy-sumx*sum)/(n*sumxx-sumx*sumx),intercept=(sum-slope*sumx)/n;
 const residual=values.reduce((v,y,i)=>v+(y-intercept-slope*i)**2,0),xx=sumxx-sumx*sumx/n,se=Math.max(100*Math.sqrt(residual/(n-2)/xx)/mean,.001);
 const t=({1:12.706,2:4.303,3:3.182,4:2.776,5:2.571,6:2.447,7:2.365,8:2.306,9:2.262,10:2.228})[n-2]||(1.96+2.7/(n-2)),pct=100*slope/mean,round=v=>+v.toFixed(3);
 return{status:'LIVE',exId:c.exId,n,pct:round(pct),lo:round(pct-t*se),hi:round(pct+t*se),from:points[0][0],to:points.at(-1)[0]};
}
const modelRows=[],dateRows=[];
for(const mode of A.MODES)for(const day of A.DAYS){
 const rig=A.engine(mode,day),before=Date.now(),dateNow=vm.runInContext('Date.now()',rig.context),empty=vm.runInContext('new Date().getTime()',rig.context),after=Date.now();
 if(mode==='frozen'){assert.equal(dateNow,new Date(2026,6,29,12).getTime());assert.equal(empty,dateNow);}else{assert(dateNow>=before&&dateNow<=after);assert(empty>=before&&empty<=after);}
 for(const expr of ["new Date('2026-09-03T16:00:00.000Z').getTime()","new Date(2026,8,3,12).getTime()","Date.parse('2026-09-03T16:00:00.000Z')","Date.UTC(2026,8,3,16)"]){assert.equal(vm.runInContext(expr,rig.context),vm.runInNewContext(expr));}
 assert.equal(rig.E.isoOf(rig.E.todayStart()),day);
 // Reach the factory's lexical Date realm after compilation, not a labeled host call.
 const real=rig.context.Date;rig.context.Date=class RealmProbe extends real{constructor(...a){if(a.length===3)throw Error('REVIEW_ACTUAL_DATE_REALM');super(...a);}};
 assert.throws(()=>rig.E.todayStart(),/REVIEW_ACTUAL_DATE_REALM/);rig.context.Date=real;
 dateRows.push({mode,day,ambientNow:dateNow,empty,query:day,explicitSemantics:true,actualFactoryRealm:true});
 const cases=A.specimens(day);assert.equal(cases.length,53);assert.deepEqual([...new Set(cases.map(c=>c.family))].sort(),A.FAMILIES.slice().sort());
 for(const c of cases){const recorded=expected.results.find(r=>r.mode===mode&&r.day===day&&r.id===c.id);let want;try{want={value:A.graph(independent(c,c.query||day))};}catch(e){want={error:{name:e.name,message:e.message}};}assert.deepEqual(recorded.projected.frame,want,c.id+' independent membership/fit');
  if(c.query)assert.deepEqual(recorded.projected.first.frame,{value:A.graph(independent(c,day))},'first query independently derived');
  const actual=A.runCase('candidate',c,mode,day);assert.deepEqual(actual,recorded.projected,c.id+' whole frame independent rerun');
  if(c.lab){const arr=actual.lab.value.nodes[0].properties.filter(p=>/^\d+$/.test(p.key)).map(p=>actual.lab.value.nodes[p.value.ref]),card=arr.find(n=>n.properties.some(p=>p.key==='id'&&p.value==='set1')),get=k=>card.properties.find(p=>p.key===k).value;assert(card);assert.equal(get('status'),want.value.nodes[0].properties.find(p=>p.key==='status').value==='LIVE'?'LIVE':'ARMED');}
  modelRows.push({mode,day,id:c.id,family:c.family,frameSHA256:sha(JSON.stringify(actual)),independentSHA256:sha(JSON.stringify(want))});
 }
}
const evidence={candidate:C,sourceConstruction:A.REFERENCE_CONSTRUCTION,expectedSHA256:A.EXPECTED_SHA256,phase1WireUnchanged:true,dictionary:{entries:wire.table.length,reachable:seen.size,frames:212},projectionSHA256:sha(ownProjection),rebuiltSHA256:sha(JSON.stringify(rebuilt,null,2)+'\n'),independentAlgorithm:'Separate calendar-era membership, positive count and pair-sum OLS/CI; all 212 full frames checked against fixed reference and actual candidate; actual LAB aggregate retained.',dateRows,modelRows};
fs.writeFileSync(path.join(base,'results/era-independent.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify({dictionary:evidence.dictionary,referenceReconstruction:true,independentModels:modelRows.length,actualDateRealms:dateRows.length,allFields:true}));
