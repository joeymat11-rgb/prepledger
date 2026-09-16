'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
function provider(){assert.ok(fs.existsSync(path.join(__dirname,'../engine-provider.cjs')),'S3 real public engine provider is implemented');return require('../engine-provider.cjs');}
// SYNTHETIC reviewed native-Date evidence. Each raw input is retained exactly
// as recorded and bound to the exact epoch the native implementation produces,
// malformed input to NaN, and each epoch to its exact native ISO string or to
// the invalid outcome. No reference data and no calendar algorithm of our own.
const NATIVE_DATE_EVIDENCE={profile:'earned/native-date-capability/v1',
 parse_vectors:[{input:'2026-03-15T12:00:00.000Z',epoch:1773576000000},{input:'2026-03-08T07:00:00.000Z',epoch:1772953200000},
  {input:'2026-09-03T12:00:00.000Z',epoch:1788436800000},{input:'TEST-ONLY not a timestamp',epoch:null}],
 constructor_vectors:[{epoch:1772953200001,iso:'2026-03-08T07:00:00.001Z'},{epoch:1788436800001,iso:'2026-09-03T12:00:00.001Z'},
  {epoch:8640000000000001,iso:null}]};
test('S3-PROVIDER-OWNERSHIP: arbitrary context and proof-shaped flags cannot construct a provider',()=>{
 for(const engineContext of [null,{}, {verified:true,accepted:true,clock:'2026-09-03'}, {profile:'earned/source-engine-context/v1',producer:'default'}])
  assert.throws(()=>provider().createSourceReplayEngine({engineContext}),{code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'});
});
function context({drafts=true,change}={}){
 assert.ok(fs.existsSync(path.join(__dirname,'../local-source-profile.cjs')),'S3 source context registry is implemented');
 const {createProducerRegistry,PUBLIC_FACTORY_DIGEST,SOURCE_PINS}=require('../local-source-profile.cjs'),hash=x=>require('node:crypto').createHash('sha256').update(x).digest('hex');
 const zone=Intl.DateTimeFormat().resolvedOptions().timeZone,day='2026-09-03',noon=new Date(2026,8,3,12);
 const engine={sha256:SOURCE_PINS['rebuild/engine/oracle-shim.cjs'],treeSha256:'b'.repeat(64),schemaV:60,path:'rebuild/engine/oracle-shim.cjs'},gate={clock:day,tz:zone};
 const materialDigest='c'.repeat(64),entry={profile:'earned/source-producer-mapping/v1',id:'TEST-ONLY-synthetic',engine,gate,construction:'oracle-shim-default/v1',public_factory_digest:PUBLIC_FACTORY_DIGEST,source_pins:SOURCE_PINS,executions:[{id:'TEST-ONLY-no-C2',material_digest:materialDigest,calendar:{profile:'earned/native-date-compatibility/v1',compatibility_id:'TEST-ONLY-calendar',range:{from:'2026-01-01',to:'2026-12-31'},zone,dates:[{day,noonISO:noon.toISOString(),offsetMinutes:noon.getTimezoneOffset()}],native_date:structuredClone(NATIVE_DATE_EVIDENCE)}}],dependencies:drafts?{drafts:'default-empty'}:{}};
 if(change)change(entry);
 const registry=createProducerRegistry([entry],{hash});
 return registry.qualify({context:{profile:'earned/local-import/v1',engine,oracle:{gate:{...gate,command:'SYNTHETIC public algorithms only',cwd:'TEST-ONLY',scope:'synthetic',laws:0,modes:[],manifestPin:null,foundIn:'TEST-ONLY no real-C2 execution'}}},materialDigest});
}
test('S3-PROVIDER-CURRENT: current60 uses real algorithms with no reference seed access',()=>{
 const engine=provider().createSourceReplayEngine({engineContext:context()});
 assert.deepEqual(Object.keys(engine).sort(),['SCHEMA_V','applyRead','currentRate','dataLossGuard','mergeState','migrate','writeDaily'].sort());
 const F=require('../../../m3/w7-preview/fixtures.cjs');
 const state=F.createSyntheticState('2026-09-03'),old=structuredClone(state),result=engine.migrate(state);
 assert.equal(result.v,60);assert.equal(engine.dataLossGuard(old,result).safe,true);
});
test('S3-PROVIDER-CAUGHT60: inner patch catch cannot publish partial v60 or clear instance poison',()=>{
 const engine=provider().createSourceReplayEngine({engineContext:context()});
 const F=require('../../../m3/w7-preview/fixtures.cjs'),state=F.createSyntheticState('2026-09-03');state.v=59;
 assert.throws(()=>engine.migrate(state),{code:'SOURCE_ENGINE_DEPENDENCY_REQUIRED',dependency:'SEED'});
 assert.throws(()=>engine.currentRate(F.createSyntheticState('2026-09-03')),{code:'SOURCE_ENGINE_DEPENDENCY_REQUIRED'});
});
test('S3-PROVIDER-CONTEXT-CUSTODY: looked-up context and its clock stay immutable',()=>{
 const c=context(),P=require('../local-source-profile.cjs'),held=P.sourceEngineContext(c),before=held.clock.nowISO();
 assert.ok(Object.isFrozen(held));assert.ok(Object.isFrozen(held.mapping));
 assert.throws(()=>{held.clock={today:()=> '2030-01-01'};},TypeError);
 assert.throws(()=>{held.mapping.gate.clock='2030-01-01';},TypeError);
 assert.equal(P.sourceEngineContext(c).clock.nowISO(),before);
 assert.throws(()=>P.engineContextAt(c,'2026-03-08',2),{code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'});
});
test('S3-PROVIDER-SOURCE60-LOCAL59: real source-first merge never independently migrates the local59 image',()=>{
 const engine=provider().createSourceReplayEngine({engineContext:context()});
 const F=require('../../../m3/w7-preview/fixtures.cjs'),source=F.createSyntheticState('2026-09-03'),local=structuredClone(source);local.v=59;
 const {createImportPreparation}=require('../prepare.cjs'),prep=createImportPreparation({engine,parseStrictJson:x=>JSON.parse(x)});
 const original=Buffer.from(JSON.stringify(local)),result=prep.prepare(Buffer.from(JSON.stringify(source)),{localBytes:original});
 assert.equal(result.candidateState().v,60);assert.deepEqual(result.localBytes(),original);assert.equal(result.localState().v,59);
});
test('S3-PROVIDER-CAUGHT51: caught draft scans remain poisoned outside the engine',()=>{
 const engine=provider().createSourceReplayEngine({engineContext:context({drafts:false})});
 const F=require('../../../m3/w7-preview/fixtures.cjs'),state=F.createSyntheticState('2026-09-03');state.v=50;
 assert.throws(()=>engine.migrate(state),{code:'SOURCE_ENGINE_DEPENDENCY_REQUIRED',dependency:'drafts'});
 assert.throws(()=>engine.writeDaily(F.createSyntheticState('2026-09-03'),'2026-09-04',{cal:2200}),{code:'SOURCE_ENGINE_DEPENDENCY_REQUIRED',dependency:'drafts'});
 const mapped=provider().createSourceReplayEngine({engineContext:context()});
 assert.throws(()=>mapped.migrate(structuredClone(state)),{code:'SOURCE_ENGINE_DEPENDENCY_REQUIRED',dependency:'SEED'},'Mapped empty drafts pass the same real patch51 scan before patch60 needs its reference');
});
test('S3-PROVIDER-CALENDAR-REACHED: real regression over DST requires historical range coverage',()=>{
 const F=require('../../../m3/w7-preview/fixtures.cjs'),state=F.createSyntheticState('2026-03-15'),before=JSON.stringify(state);
 const covered=provider().createSourceReplayEngine({engineContext:context()}),rate=covered.currentRate(state);
 assert.equal(rate.method,'regression');assert.equal(rate.n,28);assert.equal(rate.from,state.reads[0].d);assert.equal(rate.to,state.reads.at(-1).d);
 const narrow=provider().createSourceReplayEngine({engineContext:context({change:e=>{e.executions[0].calendar.range.from='2026-09-01';}})});
 assert.throws(()=>narrow.currentRate(state),{code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'});
 assert.equal(JSON.stringify(state),before);
});
test('S3-PROVIDER-MAPPING: path, entry, closure, preparation day and compatibility cannot be arbitrary labels',()=>{
 const changes=[e=>{e.engine.path='other-engine.cjs';},e=>{e.engine.sha256='f'.repeat(64);},e=>{e.public_factory_digest='f'.repeat(64);},e=>{e.source_pins={...e.source_pins,'tools/_fixed-now.mjs':'f'.repeat(64)};},e=>{e.gate.clock='2026-09-04';},e=>{e.executions[0].calendar.dates[0].noonISO='2026-09-03T12:00:00.000Z';},e=>{e.executions.push(structuredClone(e.executions[0]));}];
 for(const change of changes)assert.throws(()=>context({change}),{code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'});
});
// SYNTHETIC merge inputs that actually reach the native-Date seam. The absolute
// instants below are authored fixture inputs; the production merge owns every
// comparison. Nothing here is real athlete data or a copied engine algorithm.
const MERGE_DAY='2026-03-07';
function mergeInputs(){
 const base={v:60,reads:[],weekly:[],sleep:{nights:[]},dailyLogs:{},sessionLog:{},exercises:[],feed:[],suggestionLog:[],adjustments:[],queue:[]};
 const corrected=structuredClone(base),earlier=structuredClone(base),later=structuredClone(base),malformed=structuredClone(base);
 corrected.sessionLog[MERGE_DAY]={entries:[{id:'TEST-ONLY-lift',reps:[8]}],corr:{at:'2026-03-08T01:30:00',rev:1},note:'TEST-ONLY-corrected'};
 earlier.sessionLog[MERGE_DAY]={entries:[{id:'TEST-ONLY-lift',reps:[9]}],at:Date.parse('2026-03-08T06:15:00Z'),note:'TEST-ONLY-earlier'};
 later.sessionLog[MERGE_DAY]={entries:[{id:'TEST-ONLY-lift',reps:[10]}],at:Date.parse('2026-03-08T06:45:00Z'),note:'TEST-ONLY-later'};
 malformed.sessionLog[MERGE_DAY]={entries:[{id:'TEST-ONLY-lift',reps:[7]}],corr:{at:'TEST-ONLY not a timestamp',rev:1},note:'TEST-ONLY-malformed'};
 return {corrected,earlier,later,malformed};
}
test('S3-PROVIDER-NATIVE-DATE-REACHED: a full-year context permits the reached March parse through the injected seam',()=>{
 const I=mergeInputs(),before=JSON.stringify(I),engine=provider().createSourceReplayEngine({engineContext:context()});
 const earlier=engine.mergeState(I.corrected,I.earlier),later=engine.mergeState(I.corrected,I.later);
 assert.equal(earlier.sessionLog[MERGE_DAY].note,'TEST-ONLY-corrected','The earlier plain record loses to the correction instant');
 assert.deepEqual(earlier.sessionLog[MERGE_DAY].entries[0].reps,[8]);
 assert.equal(later.sessionLog[MERGE_DAY].note,'TEST-ONLY-later','The later plain record wins through the reached native parse');
 assert.deepEqual(later.sessionLog[MERGE_DAY].entries[0].reps,[10]);
 assert.equal(JSON.stringify(I),before,'Original inputs are never rewritten');
});
test('S3-PROVIDER-NATIVE-DATE-WITHHELD: a September-only context withholds the same reached March parse and stays poisoned',()=>{
 const I=mergeInputs(),before=JSON.stringify(I);
 const narrow=provider().createSourceReplayEngine({engineContext:context({change:e=>{e.executions[0].calendar.range.from='2026-09-01';}})});
 assert.throws(()=>narrow.mergeState(I.corrected,I.later),{code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'});
 assert.throws(()=>narrow.dataLossGuard({},{}),{code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'},'The first calendar refusal survives into a later dataLossGuard call');
 assert.equal(JSON.stringify(I),before,'A refused comparison leaves the original bytes alone');
});
test('S3-PROVIDER-NATIVE-DATE-ABSENT: missing native-Date evidence refuses at the reached operation and poisons the instance',()=>{
 const I=mergeInputs();
 const bare=provider().createSourceReplayEngine({engineContext:context({change:e=>{delete e.executions[0].calendar.native_date;}})});
 assert.throws(()=>bare.mergeState(I.corrected,I.later),{code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'},'Absent evidence never yields a guessed parse');
 assert.throws(()=>bare.dataLossGuard({},{}),{code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'},'Missing evidence poisons this provider instance for good');
});
test('S3-PROVIDER-NATIVE-DATE-VECTORS: evidence contradicted by the real native implementation cannot qualify',()=>{
 const changes=[
  e=>{e.executions[0].calendar.native_date.parse_vectors[0].epoch=1773576000001;},
  e=>{e.executions[0].calendar.native_date.parse_vectors[3].epoch=0;},
  e=>{e.executions[0].calendar.native_date.parse_vectors[3].input='2026-09-03T12:00:00.000Z';},
  e=>{e.executions[0].calendar.native_date.constructor_vectors[0].iso='2026-03-08T07:00:00.000Z';},
  e=>{e.executions[0].calendar.native_date.constructor_vectors[2].iso='+275760-09-13T00:00:00.000Z';},
  e=>{e.executions[0].calendar.native_date.parse_vectors=[];},
  e=>{e.executions[0].calendar.native_date.constructor_vectors=[];},
  e=>{e.executions[0].calendar.native_date.profile='earned/native-date-capability/v2';},
  e=>{e.executions[0].calendar.native_date=true;}];
 for(const change of changes)assert.throws(()=>context({change}),{code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'});
 assert.ok(context(),'The reviewed evidence itself still qualifies');
});
test('S3-PROVIDER-NATIVE-DATE-MALFORMED: an unparseable original stamp keeps its proved native behaviour',()=>{
 const I=mergeInputs(),before=JSON.stringify(I),engine=provider().createSourceReplayEngine({engineContext:context()});
 const merged=engine.mergeState(I.malformed,I.later),reversed=engine.mergeState(I.later,I.malformed);
 assert.equal(merged.sessionLog[MERGE_DAY].corr.at,'TEST-ONLY not a timestamp','The unparseable original stamp is retained exactly, never normalized or rewritten');
 assert.ok(merged.sessionLog[MERGE_DAY]&&reversed.sessionLog[MERGE_DAY],'Native NaN keeps the unstamped merge rules running in both directions');
 assert.equal(JSON.stringify(I),before,'Original inputs are never rewritten');
 assert.equal(engine.dataLossGuard({},{}).safe!==undefined,true,'A proved native NaN is not a calendar refusal and leaves no poison');
});
// GATE-AUDIT-SPEC-P2 finding 2. The three engine files this provider actually
// depends on are pinned by byte, re-qualified against the merged companion, and
// a mutated engine byte is refused by the mapping and by the portable manifest.
const ENGINE_DEPENDENCIES=['rebuild/engine/merge.cjs','rebuild/engine/today.cjs','rebuild/m4/workout/engine-runtime.cjs'];
test('S3-PROVIDER-ENGINE-PINS: the S3-changed engine files are re-qualified and a mutated byte refuses',()=>{
 const {SOURCE_PINS}=require('../local-source-profile.cjs'),crypto=require('node:crypto');
 const root=path.resolve(__dirname,'../../../..'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'rebuild/m4/spec/s3-portable-sources.json'),'utf8'));
 const pinned=new Map(manifest.sources.map(e=>[e.path,e.sha256]));
 for(const name of ENGINE_DEPENDENCIES){
  const bytes=fs.readFileSync(path.join(root,name)),actual=sha(bytes);
  assert.equal(SOURCE_PINS[name],actual,'Producer mapping pin is re-qualified after the companion byte change: '+name);
  assert.equal(pinned.get(name),actual,'Portable source manifest agrees with the same bytes: '+name);
  const mutated=Buffer.concat([bytes,Buffer.from('\n')]);
  assert.notEqual(sha(mutated),actual,'A mutated engine byte is a different source');
 }
 assert.equal(require('../../../m4/workout/engine-runtime.cjs').COMPOSITION.exposed.includes('sessionMembership'),true,
  'The pinned runtime bytes are the merged companion that exposes the membership reader');
 for(const name of ENGINE_DEPENDENCIES)assert.throws(()=>context({change:e=>{e.source_pins={...e.source_pins,[name]:'f'.repeat(64)};}}),
  {code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'},'A mapping carrying a mutated engine pin cannot qualify: '+name);
 for(const name of ENGINE_DEPENDENCIES)assert.throws(()=>context({change:e=>{const pins={...e.source_pins};delete pins[name];e.source_pins=pins;}}),
  {code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'},'A mapping that drops the engine pin cannot qualify: '+name);
});
