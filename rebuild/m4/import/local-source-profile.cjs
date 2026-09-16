'use strict';
const contexts=new WeakMap(),copy=structuredClone;
const fail=code=>{const e=new Error(code);e.code=code;throw e;};
const PUBLIC_FACTORY_DIGEST='65be42aa6737ddb396c0229fb0c17bff158e2d573f8887ada0f6621b94c8b626';
const SOURCE_PINS=Object.freeze({
 'rebuild/m3/setup/port/port.cjs':'08f877c73baaea6d7ab9737df303a8bd6e83c17697780130eea64e6fc615b070',
 'rebuild/m3/setup/port/unseal.cjs':'515822a128031f03dde27d96c161d5528dd444673e00fa2e5c9a1d40719abf02',
 'rebuild/engine/oracle-shim.cjs':'dd653bc170d3c5ae3b8cfa5c2ca8166b1de385a0903e056eab7ea062c125052d',
 'rebuild/engine/index.cjs':'40ccc489a44dfdb4581e157a06f8bcf70fe77e25f33051ffca90b5910cd6b893',
 // RE-QUALIFIED AGAINST THE MERGED M2-S3-COMPANION. These are the three engine
 // files this provider actually depends on: merge.cjs carries the nativeDate
 // seam it injects, today.cjs the membership pool admission reads, and
 // engine-runtime.cjs the frozen five-name reader facade. They are pinned by
 // byte here so that a mutated engine byte cannot qualify a producer mapping.
 'rebuild/engine/merge.cjs':'01e9d6e6000fd625b9f50c336c3440fb8f84e61f3e77bce4a9bf93fb8fb63b00',
 'rebuild/engine/today.cjs':'685f6e1e907cd9bba268e5d8f6927120172869febe1c747ffb9bd851aa17c45a',
 'rebuild/m4/workout/engine-runtime.cjs':'95d0c6757a0e646a0bbd0f6328ccbfd70cba6c5f97f0e1009eb6ae2ccb614f30',
 'tools/_fixed-now.mjs':'ab939a356467d095f357d796f87a6567b9bcb9e0171b17fe4fb0f447916cf5a7'});
// The real native implementation, captured at module load before any caller
// can install a substitute. Every reviewed vector below is checked against it.
const NativeDate=Date;
function freeze(value){if(value&&typeof value==='object'&&!Object.isFrozen(value)){for(const v of Object.values(value))freeze(v);Object.freeze(value);}return value;}
// This profile preserves strings exactly (including normalization form), unlike
// operation identity's historical canonical profile. Raw material is never parsed
// and reserialized for its material commitment.
function encode(value){
 if(value===null||typeof value==='string'||typeof value==='boolean')return JSON.stringify(value);
 if(typeof value==='number'){if(!Number.isFinite(value)||Object.is(value,-0))fail('LOCAL_SOURCE_NON_JSON');return JSON.stringify(value);}
 if(Array.isArray(value))return '['+Array.from(value,v=>encode(v)).join(',')+']';
 if(!value||typeof value!=='object'||![Object.prototype,null].includes(Object.getPrototypeOf(value)))fail('LOCAL_SOURCE_NON_JSON');
 return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+encode(value[k])).join(',')+'}';
}
const digest=(hash,domain,value)=>hash(domain+'\n'+encode(value));
const validDay=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T00:00:00Z'))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
function clockAt(day,hour,calendar){
 if(!validDay(day)||!Number.isInteger(hour)||hour<0||hour>23||calendar.zone!==Intl.DateTimeFormat().resolvedOptions().timeZone||day<calendar.range.from||day>calendar.range.to)fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');
 const [y,m,d]=day.split('-').map(Number),date=new Date(y,m-1,d,hour,0,0,0);
 if(date.getFullYear()!==y||date.getMonth()!==m-1||date.getDate()!==d||date.getHours()!==hour)fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');
 return Object.freeze({today:()=>day,hour:()=>date.getHours(),dow:()=>date.getDay(),nowISO:()=>date.toISOString(),nowMs:()=>date.getTime()});
}
// EXPLICIT NATIVE-DATE CAPABILITY, under the immutable execution calendar.
// Reviewed parse vectors bind an original raw input to its exact epoch or to
// NaN; constructor vectors bind an epoch to its exact native ISO string or to
// the invalid outcome. Raw inputs and numeric results are retained as recorded
// and no timestamp is ever normalized or rewritten here. A calendar that makes
// no claim returns null: the provider then refuses at the reached operation
// rather than guessing, and the refusal poisons that provider instance.
function nativeDateCapability(cal){
 const evidence=cal.native_date;
 if(evidence===undefined)return null;
 if(!evidence||evidence.profile!=='earned/native-date-capability/v1'||!Array.isArray(evidence.parse_vectors)||!evidence.parse_vectors.length||
  !Array.isArray(evidence.constructor_vectors)||!evidence.constructor_vectors.length)fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');
 for(const v of evidence.parse_vectors){
  if(typeof v?.input!=='string'||!(v.epoch===null||Number.isSafeInteger(v.epoch)))fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');
  const actual=NativeDate.parse(v.input);
  if(v.epoch===null?!Number.isNaN(actual):actual!==v.epoch)fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');
 }
 for(const v of evidence.constructor_vectors){
  if(!Number.isSafeInteger(v?.epoch)||!(v.iso===null||typeof v.iso==='string'))fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');
  let iso=null;try{iso=new NativeDate(v.epoch).toISOString();}catch{iso=null;}
  if(iso!==v.iso)fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');
 }
 return freeze({profile:evidence.profile,zone:cal.zone,range:{from:cal.range.from,to:cal.range.to},
  parse_vectors:copy(evidence.parse_vectors),constructor_vectors:copy(evidence.constructor_vectors)});
}
function createProducerRegistry(entries,{hash}={}){
 if(!Array.isArray(entries)||typeof hash!=='function')throw TypeError('Immutable reviewed producer registry required');
 const mappings=freeze(copy(entries));
 function qualify({context,materialDigest}={}){
  if(!context?.engine||!context?.oracle?.gate)fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');
  const matches=mappings.filter(m=>encode(m.engine)===encode(context.engine)&&m.gate?.clock===context.oracle.gate.clock&&m.gate?.tz===context.oracle.gate.tz&&m.executions?.some(e=>e.material_digest===materialDigest));
  if(matches.length!==1)fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');
  const mapping=matches[0],executions=mapping.executions.filter(e=>e.material_digest===materialDigest);if(executions.length!==1)fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');const execution=executions[0],cal=execution.calendar;
  if(mapping.profile!=='earned/source-producer-mapping/v1'||mapping.construction!=='oracle-shim-default/v1'||mapping.public_factory_digest!==PUBLIC_FACTORY_DIGEST||encode(mapping.source_pins)!==encode(SOURCE_PINS)||mapping.engine.schemaV!==60||mapping.engine.path!=='rebuild/engine/oracle-shim.cjs'||mapping.engine.sha256!==SOURCE_PINS['rebuild/engine/oracle-shim.cjs']||mapping.gate.clock!=='2026-09-03'||mapping.gate.tz!=='America/New_York'||
   !mapping.id||!execution.id||cal?.profile!=='earned/native-date-compatibility/v1'||!cal.compatibility_id||cal.zone!==mapping.gate.tz||!validDay(cal.range?.from)||!validDay(cal.range?.to)||cal.range.from>cal.range.to||!Array.isArray(cal.dates)||!cal.dates.length)fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');
  for(const v of cal.dates){const c=clockAt(v.day,12,cal);if(c.nowISO()!==v.noonISO||new Date(c.nowMs()).getTimezoneOffset()!==v.offsetMinutes)fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');}
  const handle=Object.freeze({profile:'earned/source-engine-context/v1'}),clock=clockAt(mapping.gate.clock,12,cal),native=nativeDateCapability(cal);
  contexts.set(handle,freeze({mapping,execution,clock,clockAt:(day,hour)=>clockAt(day,hour,cal),native,digest:digest(hash,'earned/local-source-engine/v1',{mapping,execution})}));
  return handle;
 }
 return Object.freeze({qualify});
}
function sourceEngineContext(handle){const value=contexts.get(handle);if(!value)fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');return value;}
function engineContextAt(handle,day,hour){const c=sourceEngineContext(handle),next=Object.freeze({profile:'earned/source-engine-context/v1'});contexts.set(next,freeze({...c,clock:c.clockAt(day,hour)}));return next;}
module.exports={PUBLIC_FACTORY_DIGEST,SOURCE_PINS,encode,digest,freeze,validDay,createProducerRegistry,sourceEngineContext,engineContextAt};
