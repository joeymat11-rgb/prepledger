'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
function provider(){assert.ok(fs.existsSync(path.join(__dirname,'../engine-provider.cjs')),'S3 real public engine provider is implemented');return require('../engine-provider.cjs');}
test('S3-PROVIDER-OWNERSHIP: arbitrary context and proof-shaped flags cannot construct a provider',()=>{
 for(const engineContext of [null,{}, {verified:true,accepted:true,clock:'2026-09-03'}, {profile:'earned/source-engine-context/v1',producer:'default'}])
  assert.throws(()=>provider().createSourceReplayEngine({engineContext}),{code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'});
});
function context({drafts=true,change}={}){
 assert.ok(fs.existsSync(path.join(__dirname,'../local-source-profile.cjs')),'S3 source context registry is implemented');
 const {createProducerRegistry,PUBLIC_FACTORY_DIGEST,SOURCE_PINS}=require('../local-source-profile.cjs'),hash=x=>require('node:crypto').createHash('sha256').update(x).digest('hex');
 const zone=Intl.DateTimeFormat().resolvedOptions().timeZone,day='2026-09-03',noon=new Date(2026,8,3,12);
 const engine={sha256:SOURCE_PINS['rebuild/engine/oracle-shim.cjs'],treeSha256:'b'.repeat(64),schemaV:60,path:'rebuild/engine/oracle-shim.cjs'},gate={clock:day,tz:zone};
 const materialDigest='c'.repeat(64),entry={profile:'earned/source-producer-mapping/v1',id:'TEST-ONLY-synthetic',engine,gate,construction:'oracle-shim-default/v1',public_factory_digest:PUBLIC_FACTORY_DIGEST,source_pins:SOURCE_PINS,executions:[{id:'TEST-ONLY-no-C2',material_digest:materialDigest,calendar:{profile:'earned/native-date-compatibility/v1',compatibility_id:'TEST-ONLY-calendar',range:{from:'2026-01-01',to:'2026-12-31'},zone,dates:[{day,noonISO:noon.toISOString(),offsetMinutes:noon.getTimezoneOffset()}]}}],dependencies:drafts?{drafts:'default-empty'}:{}};
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
