'use strict';
// EXPECTATION AUTHORING ONLY. This carrier cannot load an extracted candidate.
// Its sole engine input is the independently pinned frozen bundle. Never use its
// GREEN assertions as implementation evidence: PACKAGE separately runs real E.
const {wrapFactory,graphEncoder}=require('../target.cjs');
const {createFrozenEngine}=require('./import-guards-frozen.cjs');
const {createHosts}=require('./import-guards-hosts.cjs');
const {laws,CASES}=require('../laws/import-guards.cjs');
const fs=require('node:fs'),path=require('node:path'),L=require('../legacy-gates.cjs');
const {remapGraph}=require('../structural-delta.cjs');
const NativeDate=Date,A='2030-02-03',ID='synthetic-a',OTHER='synthetic-b';
const sourceReceipts=new WeakSet();
function createFrozenSource(options){
 if(!options||Object.keys(options).join('|')!=='root'||typeof options.root!=='string')throw Error('EXPECTED-FROZEN-SOURCE-INPUT');
 const root=fs.realpathSync(options.root),gitRoot=fs.realpathSync(L.git(root,['rev-parse','--show-toplevel']).toString().trim());
 if(root!==gitRoot)throw Error('EXPECTED-FROZEN-REPO-ROOT');
 const base=JSON.parse(fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/manifest.json'),'utf8'));
 if(base.baseline.frozenCommit!=='fe516c1'||base.baseline.frozenBlob!=='f98671d823f0d8cd83e730cdd930afe5f5e7b628')throw Error('EXPECTED-FROZEN-SOURCE-PIN');
 const bundles=L.publicReferences({baseline:root,scratch:path.join(root,'.tmp/postfix/expectation-public-reference'),sourcePins:base.baseline.buildSources});
 const receipt=Object.freeze({root,bundle:bundles.main});sourceReceipts.add(receipt);return receipt;
}
const r=(name,...tuple)=>name+' '+JSON.stringify(tuple.length===1&&name!=='entryidentity'&&name!=='skippedidentity'?tuple[0]:tuple);
const entry=r('entryidentity',A,ID),slot=r('setidentity',A,ID,2),skipped=r('skippedidentity',A,ID),session=r('sessionidentity',A);
const guard=lost=>({safe:lost.length===0,lost});
const profiles={};
function declare(caseId,name,values,cite){if(profiles[caseId])throw Error('DUPLICATE-PROFILE');profiles[caseId]=Object.freeze({name,values:Object.freeze(values),cite});}
// Every refusal is a literal accepted identity, never read from an observed
// repaired guard. Original positive controls keep the actual frozen function.
const fixed={
 'IG33-READ-REPLACE':[r('readidentity',A)],
 'IG33-SET-SHRINK':[slot],'IG33-ENTRY-LOST':[entry],
 'IG33-COMPENSATION-LIFT':[slot],'IG33-COMPENSATION-DAY':[entry],
 'IG33-OCCUPIED-ZERO':[slot],'IG33-OCCUPIED-STRING':[slot],
 'IG33-PADDING-HOLE':[slot],'IG33-PADDING-NULL':[slot],'IG33-PADDING-UNDEFINED':[slot],
 'IG33-EMPTY-ENTRY':[entry],
 'IG33-SKIPPED-REMOVE':[skipped],'IG33-SKIPPED-MOVE':[skipped],'IG33-SKIPPED-BARE-RESTORE':[skipped],'IG33-SKIPPED-MALFORMED-UNSKIP':[skipped],'IG33-SKIPPED-UNRELATED-SKIP':[skipped],
 'IG33-UNRELATED-REAL-STRIKE':[entry],
 'IG33-SKIP-UNRELATED-LOSS':[r('entryidentity',A,OTHER)],
 'IG33-OPAQUE-ENTRIES-GETTER':[session],'IG33-AMBIGUOUS-NULL-PROTO-EDIT':[session],
 'IG33-REASON-ORDER':['feedop permanent',r('readidentity',A),r('entryidentity',A,OTHER),slot,r('skippedidentity',A,OTHER),session],
 'IG33-SLOT-NUMERIC-ORDER':[slot,r('setidentity',A,ID,10)],
 'IG33-SAVE-GUARDED':[entry],
 'IG33-RESTORE-UNGUARDED-REMOTE-RICH':[entry],'IG33-RESTORE-UNGUARDED-LOCAL-RICH':[entry]
};
for(const variant of ['MISSING','SCALAR','WRONG-ID','MISSING-REPS','INVALID-AT','EMPTY-OP','UNKNOWN-KIND','NO-RECEIPT','WRONG-RECEIPT','PAYLOAD-MISMATCH','RIR-MISMATCH','AMEND-SHRINK','LOAD-AMEND-SHRINK','SUPERSEDED','CONTRADICTORY-OP'])fixed['IG33-CORRECTION-'+variant]=[slot];
for(const variant of ['AMEND-NONARRAY','UNSKIP-NONARRAY','DUPLICATE-KIND','DUPLICATE-ID','NONJSON'])fixed['IG33-MIXED-'+variant]=[slot];
for(const variant of ['IDLESS','DUPLICATE','NONARRAY','SKIPPED-IDLESS','SKIPPED-DUPLICATE'])for(const action of ['REMOVE','EDIT'])fixed['IG33-AMBIGUOUS-'+variant+'-'+action]=[session];
for(const [id,lost]of Object.entries(fixed))declare(id,'dataLossGuard',[guard(lost)],'BRIEF-IMPORT-GUARDS.md §1 D33; §2 '+id);
for(const direction of ['FORWARD','REVERSE'])declare('IG33-LEGACY-CORR-'+direction,'dataLossGuard',[guard([entry]),guard([]),guard([entry])],'BRIEF-IMPORT-GUARDS.md §1 legacy corr-only; guard richer preimage, sparse preimage, retry');
declare('IG33-GHSYNC-REMOTE-RICH','dataLossGuard',[guard([entry]),guard([entry])],'BRIEF-IMPORT-GUARDS.md §1 legacy host; frozen12364–12368 remote-only guard, two identical attempts');
for(const c of CASES.filter(c=>c.defect==='D34'&&c.frozenRed))declare(c.id,'isPristineSeed',c.id.startsWith('IG34-MARKER-')?[false,false]:[false],'BRIEF-IMPORT-GUARDS.md §1 D34 complete four families; frozen13270–13272/16217 marker OR for host cases');
// This compatibility case remains GREEN because the pre-existing marker keeps
// the offer visible. Its edited read.pt still makes both predicate calls false:
// boot skips the redundant set, and the unchanged offer OR reads the marker.
declare('IG34-MARKER-EXISTING','isPristineSeed',[false,false],'BRIEF-IMPORT-GUARDS.md §1 D34 complete reads incl pt; frozen13270–13272/16217; existing-marker visible compatibility, exactly two predicate calls');
for(const c of CASES.filter(c=>c.defect==='D35'&&c.id.startsWith('IG35-FUTURE-')))declare(c.id,'migrate',['IDENTITY-UNTOUCHED'],'BRIEF-IMPORT-GUARDS.md §1 D35 future61/string61 returns original input before every non-version read');
for(const c of CASES)if(c.frozenRed&&!profiles[c.id])throw Error('MISSING-CLOSED-PROJECTION:'+c.id);
for(const id of Object.keys(profiles))if(!CASES.some(c=>c.id===id&&(c.frozenRed||c.id==='IG34-MARKER-EXISTING')))throw Error('EXTRA-CLOSED-PROJECTION:'+id);
function lock(v){if(v&&typeof v==='object'){for(const x of Object.values(v))lock(x);Object.freeze(v);}return v;}lock(profiles);
function configureDate(mode,day){globalThis.Date=NativeDate;if(mode==='frozen'){const ms=new NativeDate(...day.split('-').map((x,i)=>+x-(i===1?1:0)),12).getTime();globalThis.Date=class extends NativeDate{constructor(...args){super(...(args.length?args:[ms]));}static now(){return ms;}};}else if(mode!=='native')throw Error('DATE-MODE');}
async function produce({source,caseId,mode,day,project=false}){
 if(arguments.length!==1||!sourceReceipts.has(source)||!caseId||Object.keys(arguments[0]).some(k=>!['source','caseId','mode','day','project'].includes(k))||typeof project!=='boolean')throw Error('EXPECTED-EXPLICIT-INPUTS');
 const {root,bundle}=source;
 const before=globalThis.Date;configureDate(mode,day);const frames=[],p=project?profiles[caseId]:null;let used=0;
 try{
  const target=wrapFactory(options=>{const table=createFrozenEngine({...options,root,bundle});if(p){const frozen=table[p.name];if(typeof frozen!=='function')throw Error('EXPECTED-FROZEN-FUNCTION');table[p.name]=(...args)=>{if(used>=p.values.length)throw Error('EXTRA-EXPECTED-CALL:'+caseId);const value=p.values[used++];if(value==='IDENTITY-UNTOUCHED'){if(args.length!==1||!args[0]||!Object.hasOwn(args[0],'v')||!Object.hasOwn(Object.getOwnPropertyDescriptor(args[0],'v'),'value')||!([61,'61'].includes(args[0].v)))throw Error('EXPECTED-FUTURE-DOMAIN');return args[0];}if(p.name==='dataLossGuard'&&args.length!==2)throw Error('EXPECTED-GUARD-ARITY');if(p.name==='isPristineSeed'&&args.length!==1)throw Error('EXPECTED-PRISTINE-ARITY');return typeof value==='object'?structuredClone(value):value;};}return{__test:table};},{day,traceProfile:2,boundaryDateProfile:true},frames);
  const law=laws.find(l=>l.requiredCases.includes(caseId));if(!law)throw Error('EXPECTED-CASE-UNKNOWN');const result=await law.run({engine:target.engine,record:target.record,caseId,day,createHosts:engine=>createHosts({engine,record:target.record,root})});
  if(p&&used!==p.values.length)throw Error('UNUSED-EXPECTED-CALL:'+caseId);
  if(project&&result.assertions.some(a=>!a.ok))throw Error('INDEPENDENT-EXPECTATION-NOT-CLAIM:'+caseId+':'+result.assertions.filter(a=>!a.ok).map(a=>a.id));
  return{status:result.ok?'GREEN':'RED',frames,detail:graphEncoder()(result.detail),assertions:result.assertions,loaded:[]};
 }finally{globalThis.Date=before;}
}
// Full expected typed graphs retain every data/accessor descriptor and reference.
// Mechanical object-ID shifts remain exact. The one host with deleted calls uses
// an explicit injective correspondence of retained graph objects; deleted-only
// IDs receive unused spare IDs so existing bijection validation stays strict.
// Other cases retain exact numeric identity cells. No identity is discarded.
function ghSyncAliases(original,expected){
 const kept=[0,1,2,5,6,7,10],map=new Map(),reverse=new Map(),known=new Set(),finalIds=new Set();
 const tagged=v=>Array.isArray(v)&&['node','ref','function','symbol'].includes(v[0])&&Number.isSafeInteger(v[1]);
 function all(v,set){if(!v||typeof v!=='object')return;if(tagged(v))set.add(v[1]);for(const x of Object.values(v))all(x,set);}
 function match(a,b){if(!a||!b||typeof a!=='object'||typeof b!=='object')return;
  if(tagged(a)&&tagged(b)){const x=a[1],y=b[1];if(map.has(x)&&map.get(x)!==y||reverse.has(y)&&reverse.get(y)!==x)throw Error('EXPECTED-ALIAS-AMBIGUITY');map.set(x,y);reverse.set(y,x);
   if(a[0]==='node'&&b[0]==='node'){if(a[2]!==b[2]||a[3]!==b[3])throw Error('EXPECTED-ALIAS-TYPE');const props=new Map(b[4].map(p=>[JSON.stringify(p[0]),p]));for(const p of a[4]){const q=props.get(JSON.stringify(p[0]));if(q){if(p[1]!==q[1])throw Error('EXPECTED-ALIAS-DESCRIPTOR');match(p[p.length-1],q[q.length-1]);}}match(a[5],b[5]);}return;
  }
  if(Array.isArray(a)&&Array.isArray(b)){for(let i=0;i<Math.min(a.length,b.length);i++)match(a[i],b[i]);}else for(const k of Object.keys(a))if(Object.hasOwn(b,k))match(a[k],b[k]);
 }
 kept.forEach((oldIndex,newIndex)=>match(original.frames[oldIndex],expected.frames[newIndex]));all(original,known);all(expected,finalIds);let spare=Math.max(...known,...finalIds);
 // Nodes which exist only in deleted calls/fields receive explicit unused IDs.
 // This frees old ordinal collisions without removing any surviving reference.
 for(const id of [...known].sort((a,b)=>a-b))if(!map.has(id)){map.set(id,++spare);reverse.set(spare,id);}
 return [...map].filter(([a,b])=>a!==b).sort((a,b)=>a[0]-b[0]);
}
function exactCells(original,expected,caseId){const cells=[];let sequence=0;const cite=profiles[caseId]?.cite||'UNCHANGED frozen trace';
 const aliases=caseId==='IG33-GHSYNC-REMOTE-RICH'?ghSyncAliases(original,expected):[];
 original=remapGraph(original,aliases);
 function cell(op,path,before,after,afterPath=path){if(!path.length)throw Error('WHOLE-TRACE-REPLACEMENT-FORBIDDEN');cells.push({id:caseId+':'+(profiles[caseId]?.name||'preserve')+':'+(++sequence),op,path:path.map(String),...(JSON.stringify(path)===JSON.stringify(afterPath)?{}:{afterPath:afterPath.map(String)}),before,after});}
 function walk(a,b,p,q=p){if(JSON.stringify(a)===JSON.stringify(b))return;const ao=a&&typeof a==='object',bo=b&&typeof b==='object';if(!ao||!bo||Array.isArray(a)!==Array.isArray(b)){cell('replace',p,a,b,q);return;}
  if(Array.isArray(a)){const shared=Math.min(a.length,b.length);for(let i=0;i<shared;i++)walk(a[i],b[i],[...p,String(i)],[...q,String(i)]);for(let i=a.length-1;i>=b.length;i--)cell('remove',[...p,String(i)],a[i],null,[...q,String(i)]);for(let i=a.length;i<b.length;i++)cell('add',[...p,String(i)],null,b[i],[...q,String(i)]);return;}
  for(const k of Object.keys(a))if(!Object.hasOwn(b,k))cell('remove',[...p,k],a[k],null,[...q,k]);else walk(a[k],b[k],[...p,k],[...q,k]);for(const k of Object.keys(b))if(!Object.hasOwn(a,k))cell('add',[...p,k],null,b[k],[...q,k]);
 }
 if(caseId==='IG33-GHSYNC-REMOTE-RICH'){
  // Frozen12364–12368: each refused guard skips exactly today's timestamp and
  // its formatting. Preserve every retained frame; only its final index moves.
  const kept=[0,1,2,5,6,7,10],removed=[9,8,4,3],names=['migrate','mergeState','dataLossGuard','todayStart','isoOf','migrate','mergeState','dataLossGuard','todayStart','isoOf','IG33-GHSYNC-REMOTE-RICH.ghsync.complete'];
  if(original.frames.length!==11||expected.frames.length!==7||original.frames.some((f,i)=>(f.name||f.observation)!==names[i])||expected.frames.some((f,i)=>(f.name||f.observation)!==names[kept[i]]))throw Error('EXPECTED-GHSYNC-CALL-INVENTORY');
  kept.forEach((oldIndex,newIndex)=>walk(original.frames[oldIndex],expected.frames[newIndex],['frames',String(oldIndex)],['frames',String(newIndex)]));
  walk(original.detail,expected.detail,['detail']);
  for(const index of removed)cell('remove',['frames',String(index)],original.frames[index],null);
 }else walk(original,expected,[]);
 if(cells.length&&!profiles[caseId])throw Error('UNDECLARED-PROJECTION-DELTA:'+caseId);return{delta:{aliases,cells},cite};
}
module.exports={PROFILES:profiles,createFrozenSource,produce,exactCells};
