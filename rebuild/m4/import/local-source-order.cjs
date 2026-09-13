'use strict';
const {encode,digest,freeze}=require('./local-source-profile.cjs');
const fail=code=>{const e=new Error(code);e.code=code;throw e;};
function createLocalSourceOrder({hash}={}){
 if(typeof hash!=='function')throw TypeError('Raw SHA256 required');
 const reviews=new WeakMap(),maps=new WeakMap();
 function inspect(input){
  try{
   const s=structuredClone(input),ops=s.operations;if(!ops||!s.legacyLog||!s.rootInterpretation)throw Error();
   const memo=new Map();
   function ancestors(id,visiting=new Set()){
    if(memo.has(id))return memo.get(id);if(visiting.has(id))throw Error();
    const op=ops[id];if(!op||op.op_id!==id||!Array.isArray(op.causal_parents)||new Set(op.causal_parents).size!==op.causal_parents.length)throw Error();
    const seen=new Set(),next=new Set(visiting).add(id);for(const p of op.causal_parents){seen.add(p);for(const a of ancestors(p,next))seen.add(a);}memo.set(id,seen);return seen;
   }
   for(const id of Object.keys(ops))ancestors(id);
   const starts=Object.values(ops).filter(o=>o.class==='session'&&o.kind==='session-start').map(o=>o.op_id);
   const roots=starts.filter(id=>!starts.some(other=>other!==id&&ancestors(id).has(other)));
   if(starts.length&&roots.length!==1)throw Error();
   const root=roots[0]||null;
   if(root&&starts.some(id=>id!==root&&!ancestors(id).has(root)))throw Error();
   return {snapshot:s,starts,root,ancestors};
  }catch{fail('LOCAL_SOURCE_ORDER_MAP_UNPROVEN');}
 }
 function mapFor(item,answer){
  const s=item.snapshot,legacy=Object.entries(s.legacyLog);
  if(answer!==true)fail('ORDER_EVIDENCE_REQUIRED');
  const review_digest=digest(hash,'earned/local-source-order-review/v1',s);
  return freeze({profile:'earned/local-source-order-map/v1',installation_id:s.installation_id,era_id:s.era_id,athlete_id:s.athlete_id,source_digest:s.source_digest,
   legacy_members_digest:digest(hash,'earned/local-source-legacy-members/v1',legacy),native_root_id:item.root,
   native_members_digest:digest(hash,'earned/local-source-native-members/v1',Object.entries(s.operations)),checkpoint_digest:s.checkpoint_digest,
   assertion:{kind:'athlete-confirmed-legacy-prefix',answer:true,prompt_version:'earned/legacy-prefix-prompt/v1',review_digest},
   root_interpretation_digest:digest(hash,'earned/local-source-root-interpretation/v1',s.rootInterpretation)});
 }
 function review(input){const item=inspect(input),handle=freeze({profile:'earned/local-source-order-review/v1',legacy_count:Object.keys(item.snapshot.legacyLog).length,native_root_id:item.root,native_start_ids:item.starts.slice(),review_digest:digest(hash,'earned/local-source-order-review/v1',item.snapshot)});reviews.set(handle,item);return handle;}
 function confirm(handle,{answer}={}){const item=reviews.get(handle);if(!item)fail('LOCAL_SOURCE_ORDER_REVIEW_UNOWNED');const map=mapFor(item,answer);maps.set(map,item);return map;}
 function restore(map,original){const item=inspect(original);if(encode(map)!==encode(mapFor(item,true)))fail('LOCAL_SOURCE_ORDER_MAP_UNPROVEN');const owned=freeze(structuredClone(map));maps.set(owned,item);return owned;}
 function validate(map,input){
  const prior=maps.get(map);if(!prior)fail('LOCAL_SOURCE_ORDER_MAP_UNPROVEN');const next=inspect(input),s=next.snapshot,old=prior.snapshot;
  if(['installation_id','era_id','athlete_id','source_digest','checkpoint_digest'].some(k=>s[k]!==old[k])||encode(Object.entries(s.legacyLog))!==encode(Object.entries(old.legacyLog))||next.root!==prior.root)fail('LOCAL_SOURCE_ORDER_MAP_UNPROVEN');
  for(const [id,value]of Object.entries(old.rootInterpretation))if(!Object.hasOwn(s.rootInterpretation,id)||encode(s.rootInterpretation[id])!==encode(value))fail('LOCAL_SOURCE_ORDER_MAP_UNPROVEN');
  for(const [id,op]of Object.entries(old.operations))if(encode(s.operations[id])!==encode(op))fail('LOCAL_SOURCE_ORDER_MAP_UNPROVEN');
  for(const id of next.starts)if(!Object.hasOwn(old.operations,id)&&(!prior.root||!next.ancestors(id).has(prior.root)))fail('LOCAL_SOURCE_ORDER_MAP_UNPROVEN');
  return freeze({ready:true,profile:map.profile,start_ids:next.starts,legacy_prefix:!!Object.keys(s.legacyLog).length,map});
 }
 return Object.freeze({review,confirm,validate,restore});
}
module.exports={createLocalSourceOrder};
