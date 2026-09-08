'use strict';
// Exact source/dependency trace carrier. No candidate supplies expected answers.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const Parent=require('./step-efficacy-frozen.cjs');
const {graphEncoderV2}=require('../trace-v2.cjs');
const RealDate=Date,frozenInstances=new WeakMap(),sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const DELEGATE_BEFORE='const todayStart = (...args) => E.todayStart(...args);\n';
const DELEGATE_AFTER=DELEGATE_BEFORE+'const forksOf = (...args) => E.forksOf(...args);\nconst sameEra = (...args) => E.sameEra(...args);\n';
const CUT='    if (!sameEra(forks, d, at)) continue;\n';
function declarations(root){
 const lines=Parent.frozenSource(root).split('\n'),before=lines.slice(8882,8911).join('\n');
 if(!before.startsWith('function setOneRead(s, exId) {')||before.split('\n').length!==29)throw Error('ERA30-DECLARATION-PIN');
 const a=before.split('\n');if(!/typeof ex9\.w !== "number"/.test(a[2])||!/^\s*const sl = s.sessionLog\[d\];$/.test(a[5]))throw Error('ERA30-PROJECTION-ANCHOR');
 const after=a.flatMap((line,i)=>[...(i===5?[CUT.slice(0,-1)]:[]),line,...(i===2?['  const forks = forksOf(s, exId);','  const at = forks.length ? isoOf(todayStart()) : null;']:[])]).join('\n');
 const primitive=[...lines.slice(304,308),...lines.slice(3158,3160),lines[3168]].join('\n');
 return{before,after,primitive,beforeSha256:sha(before),afterSha256:sha(after),primitiveSha256:sha(primitive)};
}
function createFrozenEngine(options){const T=Parent.createFrozenEngine(options);frozenInstances.set(T.HISTORY,{root:options.root,clock:options.clock,project:options.sourceProjection===true});return T;}
function createHosts(options){
 const inherited=Parent.createHosts(options),T=options.engine,registered=frozenInstances.get(T.HISTORY);
 const dependencyTable=options.dependencyTable;if(!dependencyTable||dependencyTable.HISTORY!==T.HISTORY||dependencyTable.ROLLUPS!==T.ROLLUPS)throw Error('ERA30-REAL-DEPENDENCY-TABLE');
 let factory,decs;
 if(registered){decs=declarations(registered.root);const names=['forksOf','sameEra','isoOf','todayStart','dayWeather','paceRushed','_tCrit','TREND_MIN_SESSIONS','TREND_SE_FLOOR'];
  const make=new Function(...names,(registered.project?decs.after:decs.before)+'\nreturn {setOneRead};');
  factory=E=>make(...names.map(n=>E[n]));
 }else{
  if(!options.candidate||!options.inventory||!Object.hasOwn(options.inventory,'volume.cjs'))throw Error('ERA30-EXPLICIT-CANDIDATE-HOST');
  const file=path.resolve(options.candidate,'volume.cjs'),bytes=fs.readFileSync(file);
  if(sha(bytes)!==options.inventory['volume.cjs'])throw Error('ERA30-HOST-VOLUME-PIN');
  // Distinct diagnostic filename: canonical mutation coverage must never count
  // this second wrapper's different byte offset as the product loader script.
  const module={exports:{}};vm.runInThisContext('(function(module,exports){\n'+bytes.toString('utf8')+'\n})',{filename:file+'#era30-dependency-probe'})(module,module.exports);
  if(typeof module.exports!=='function')throw Error('ERA30-VOLUME-FACTORY');factory=E=>module.exports(E,{clock:null,ids:null,drafts:null});
 }
 return{...inherited,snapshot:value=>graphEncoderV2({boundaryDateProfile:true})(value),
  probeSetOne({state,exId,clock,label}){
   if(typeof label!=='string'||typeof options.record!=='function')throw Error('ERA30-PROBE-RECORD');
   const frames=[],counts=new Map(),E={...dependencyTable};
   if(registered){const primitives=new Function(decs.primitive+'\nreturn {isoOf,todayStart,_tCrit,TREND_MIN_SESSIONS};')();Object.assign(E,primitives);}
   const real={...E};
   for(const name of ['forksOf','sameEra','isoOf','todayStart','dayWeather','paceRushed','_tCrit']){
    if(typeof real[name]!=='function')throw Error('ERA30-HOST-DEPENDENCY:'+name);
    E[name]=(...args)=>{const f={name};
     if(name==='sameEra'||name==='dayWeather')f.date=args[1];
     if(name==='paceRushed')f.date=Object.keys(state.sessionLog||{}).find(d=>{const v=Object.getOwnPropertyDescriptor(state.sessionLog,d);return Object.hasOwn(v,'value')&&v.value===args[0];});
     const key=name+'@'+(f.date||'query'),n=counts.get(key)||0;counts.set(key,n+1);const at=label+'.'+key+'#'+n;
     options.record(at+'.before',{args});
     try{const result=real[name](...args);options.record(at+'.after',{args,result});return result;}
     catch(error){options.record(at+'.after',{args,error});throw error;}finally{frames.push(f);}};
   }
   options.record(label+'.input.before',{state});const old=globalThis.Date;
   class ReferenceDate extends RealDate {
    constructor(...args){super(...(args.length?args:[clock.nowMs()]));}
    static now(){return clock.nowMs();}
  }
   let value,error;
   try{if(registered)globalThis.Date=ReferenceDate;value=factory(E).setOneRead(state,exId);}
   catch(e){error={name:e.name,message:e.message};}finally{globalThis.Date=old;}
   options.record(label+'.input.after',{state});return{result:error?{error}:{value},frames};
  }};
}
module.exports={createFrozenEngine,createHosts,declarations,DELEGATE_BEFORE,DELEGATE_AFTER,CUT};
