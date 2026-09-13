'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
function provider(){assert.ok(fs.existsSync(path.join(__dirname,'../engine-provider.cjs')),'S3 real public engine provider is implemented');return require('../engine-provider.cjs');}
test('S3-PROVIDER-OWNERSHIP: arbitrary context and proof-shaped flags cannot construct a provider',()=>{
 for(const engineContext of [null,{}, {verified:true,accepted:true,clock:'2026-09-03'}, {profile:'earned/source-engine-context/v1',producer:'default'}])
  assert.throws(()=>provider().createSourceReplayEngine({engineContext}),{code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'});
});
function context(){
 assert.ok(fs.existsSync(path.join(__dirname,'../local-source-profile.cjs')),'S3 source context registry is implemented');
 const {createProducerRegistry}=require('../local-source-profile.cjs'),hash=x=>require('node:crypto').createHash('sha256').update(x).digest('hex');
 const zone=Intl.DateTimeFormat().resolvedOptions().timeZone,day='2026-09-03',noon=new Date(2026,8,3,12);
 const engine={sha256:'a'.repeat(64),treeSha256:'b'.repeat(64),schemaV:60,path:'synthetic-public-factories'},gate={clock:day,tz:zone};
 const materialDigest='c'.repeat(64),entry={profile:'earned/source-producer-mapping/v1',id:'TEST-ONLY-synthetic',engine,gate,public_factory_digest:'d'.repeat(64),source_pins:{'synthetic-public-fixture':'e'.repeat(64)},executions:[{id:'TEST-ONLY-no-C2',material_digest:materialDigest,calendar:{zone,dates:[{day,noonISO:noon.toISOString(),offsetMinutes:noon.getTimezoneOffset()}]}}],dependencies:{drafts:'default-empty'}};
 const registry=createProducerRegistry([entry],{hash});
 return registry.qualify({context:{engine,oracle:{gate}},materialDigest});
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
 assert.throws(()=>engine.migrate(state),{code:'SOURCE_ENGINE_DEPENDENCY_REQUIRED'});
 assert.throws(()=>engine.currentRate(F.createSyntheticState('2026-09-03')),{code:'SOURCE_ENGINE_DEPENDENCY_REQUIRED'});
});
