'use strict';
// Bounded preparation for PERFORMED-ENGINE-v1, not a new acceptance gate.
// Actual V8 declaration reach from the retained static assembly. This records
// exercised paths; absent coverage never authorizes excluding another branch.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const assert=require('node:assert/strict'),crypto=require('node:crypto'),inspector=require('node:inspector');
const {fileURLToPath}=require('node:url');
const root=path.resolve(__dirname,'../../..'),base='3e908d2eed586288cebfaa12e3b0625671949079';
const NativeDate=Date,sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const modules=['dates','constants','plan','progression','sleep','energy','policy','today','volume','earn','writers'];
const paths=modules.map(n=>'rebuild/engine/'+n+'.cjs').concat(['rebuild/m3/w7-preview/browser-engine.cjs','rebuild/m3/w7-preview/fixtures.cjs']);
const sources={},texts={},declarations=[];
for(const file of paths){
 const bytes=fs.readFileSync(path.join(root,file));
 const pinned=cp.spawnSync('git',['show',base+':'+file],{cwd:root,windowsHide:true,maxBuffer:8e6});
 assert.equal(pinned.status,0,'Pinned public source exists: '+file);
 assert(bytes.equals(pinned.stdout),'Exact source changed: '+file);
 const source=bytes.toString('utf8');sources[file]={sha256:sha(bytes)};texts[file]=source;
 const marks=[...source.matchAll(/\/\/ Copied from frozen src\/app\.jsx @ fe516c1:(\d+)-(\d+)\.\r?\n/g)];
 for(let i=0;i<marks.length;i++){
  const start=marks[i].index+marks[i][0].length,end=i+1<marks.length?marks[i+1].index:source.lastIndexOf('\nreturn {')+1;
  const text=source.slice(start,end),name=/^(?:\s*\/\/[^\n]*\n)*(?:function|const|let)\s+([\w$]+)/.exec(text)?.[1];
  assert(name&&end>start,'Known copied declaration boundary: '+file);
  declarations.push({id:path.basename(file,'.cjs')+'.'+name,file,name,line:source.slice(0,start).split('\n').length,
   frozen:marks[i][1]+'-'+marks[i][2],sha256:sha(text),start,end});
 }
}
const session=new inspector.Session();session.connect();
const post=(name,params={})=>new Promise((resolve,reject)=>session.post(name,params,(error,value)=>error?reject(error):resolve(value)));
const F=require('../../m3/w7-preview/fixtures.cjs');
const clock={today:()=>F.SYNTHETIC_DAY,nowMs:()=>NativeDate.UTC(2030,1,4,12),nowISO:()=> '2030-02-04T12:00:00.000Z',hour:()=>12,dow:()=>1};
function makeEngine(){
 const E=require('../../m3/w7-preview/browser-engine.cjs').createBrowserEngine({clock});
 Object.assign(E,require('../../engine/writers.cjs')(E,{clock,ids:{next(){throw Error('Reader probe must not mint');}},drafts:{length:0,key:()=>null}}));
 return E;
}
function state(){const s=F.createSyntheticState();s.exercises[0].sets=3;s.exercises[0].last=[8,8,8];return s;}
function volume(terms){const s=state();s.sessionLog={'2030-01-20':{entries:[{id:'demo-press',w:40,reps:[8,8],rirSets:[2,0]}]}};
 terms.forEach((terminal,i)=>s.sessionLog[F.dayOffset('2030-01-24',i)]={entries:[{id:'demo-press',w:40,reps:[8,8,8],rirSets:[2,null,terminal]}]});return s;}
// Reuse the already inspected PROGRESSION-CASES-01 outcome distinctions. These
// are legacy implementation controls, not personal/scientific qualification.
const probes=[
 ['fresh-workout',E=>{const s=state();const out=E.genSession(s,F.SYNTHETIC_DAY,{clean:true,last:{h:8},mean3:8});assert.equal(out.name,'UPPER');assert(out.ex.length>0);return out;}],
 ['effort-load-hold-distinction',E=>{const s=state(),e=s.exercises[0];e.lastMeta={reps:[8,8,8],rirSets:[2,null,null]};
  const a=E.progressStep(e,s);e.holdFlag=true;assert.deepEqual(E.progressStep(e,s),a);assert.equal(a.add,1);assert.match(a.why,/last set unrated/);
  e.lastMeta.rirSets[2]=3;const b=E.progressStep(e,s);assert.equal(b.add,3);e.holdFlag=false;assert.deepEqual(E.progressStep(e,s),b);return [a,b];}],
 ['effort-denominators',E=>{const out=[[0,null,null,null],[0,3,null,null],[0,3,3,null]].map(t=>E.volumeConversion(volume(t),'demo-press'));
  assert.deepEqual(out.map(x=>x.delivered),[null,true,false]);assert.deepEqual(out.map(x=>x.tier),['UNCLEAR','TOLERATED','UNDELIVERED']);return out;}],
 ['opener-isolation',E=>{const s=state();s.sessionLog={};for(let i=0;i<4;i++)s.sessionLog[F.dayOffset('2030-01-24',i)]={entries:[{id:'demo-press',w:40,reps:[8+i,8,8],rirSets:[2,null,0]}]};
  const a=E.setOneRead(s,'demo-press');assert.equal(a.status,'LIVE');assert.equal(a.n,4);s.sessionLog['2030-01-25'].entries[0].reps[1]=5;assert.deepEqual(E.setOneRead(s,'demo-press'),a);
  s.sessionLog['2030-01-25'].entries[0].w=35;const b=E.setOneRead(s,'demo-press');assert.equal(b.status,'COUNTING');assert.equal(b.n,3);assert.equal(b.need,4);return [a,b];}],
 ['read-consumers',E=>{const s=state(),e=s.exercises[0];return {score:E.sessionScore({w:40,reps:[8,7,6]}),noise:E.typicalError(s,e.id,F.SYNTHETIC_DAY),
  anchor:E.progressAnchor(e,s),targets:E.targetsFor(e,s),sighting:E.deriveSighting(s,e),trend:E.liftTrend(s,e.id),progression:E.progressionTrend(s),
  volume:E.muscleVolume(s),meta:E.deriveLastMeta(s,e.id),effort:E.rirPlan(s,e,{clean:true,last:{h:8},mean3:8}),debrief:E.sessionDebrief(s,'2030-02-01')};}],
];
async function main(){
 await post('Profiler.enable');await post('Profiler.startPreciseCoverage',{callCount:true,detailed:true});
 const observations=[],allReached=new Set(),delegates=new Map();
 try{
  for(const mode of ['native','frozen']){
   globalThis.Date=mode==='native'?NativeDate:class extends NativeDate{constructor(...args){super(...(args.length?args:[NativeDate.UTC(2027,0,1)]));}static now(){return NativeDate.UTC(2027,0,1);}};
   const E=makeEngine();await post('Profiler.takePreciseCoverage');
   for(const [name,probe]of probes){
    const output=probe(E),coverage=(await post('Profiler.takePreciseCoverage')).result,reached=[];
    for(const script of coverage){
     if(!script.url.startsWith('file:'))continue;
     const file=path.relative(root,fileURLToPath(script.url)).split(path.sep).join('/');if(!Object.hasOwn(sources,file))continue;
     for(const fn of script.functions){
      if(!(fn.ranges[0]?.count>0))continue;
      const declaration=declarations.find(d=>d.file===file&&d.name===fn.functionName&&fn.ranges[0].startOffset>=d.start&&fn.ranges[0].startOffset<d.end);
      if(declaration){reached.push(declaration.id);allReached.add(declaration.id);}
      else if(fn.functionName&&/^\w+$/.test(fn.functionName)){
       const source=texts[file],r=fn.ranges[0],body=source.slice(r.startOffset,r.endOffset);
       if(/=> E\.\w+\(\.\.\.args\)/.test(body))delegates.set(file+':'+r.startOffset,{file,name:fn.functionName,line:source.slice(0,r.startOffset).split('\n').length,sha256:sha(body)});
      }
     }
    }
    assert(reached.length>0,'Actual retained engine declarations reached');
    observations.push({mode,case:name,outputSha256:sha(JSON.stringify(output)),reached:[...new Set(reached)].sort()});
   }
  }
  for(const [name]of probes){const pair=observations.filter(x=>x.case===name);assert.equal(pair[0].outputSha256,pair[1].outputSha256,'Injected clock controls '+name);}
  const result={base,meaning:'Observed declaration reach only; no exhaustive branch/closure or source-change permission; synthetic legacy controls only',sources,observations,
   reachedDeclarations:declarations.filter(d=>allReached.has(d.id)).map(({start,end,...d})=>d),observedDelegates:[...delegates.values()]};
  const output=process.argv[2];assert(output,'Supply an explicit local JSON evidence path');fs.writeFileSync(path.resolve(output),JSON.stringify(result,null,2)+'\n');
  console.log(`PERFORMED READER REACH PASS: ${observations.length} actual probes; ${result.reachedDeclarations.length} reached declarations; ${result.observedDelegates.length} observed late delegates; native/frozen outputs equal`);
  console.log('Rich mapping / implementation / scientific qualification NOT RUN; branch completeness NOT CLAIMED');
 }finally{globalThis.Date=NativeDate;await post('Profiler.stopPreciseCoverage');session.disconnect();}
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
