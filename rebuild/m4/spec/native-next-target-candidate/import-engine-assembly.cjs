'use strict';
// TEST-ONLY importer assembly. Composes the immutable retained public engine
// factories under test-support/import-engine in the existing index order, with
// the private seed module replaced by an EXPLICIT synthetic provider bound to
// the public createSyntheticState fixture. These are disclosed synthetic
// athlete inputs, not missing-data defaults and not a production historical
// supplier. migrate, dataLossGuard, mergeState, createImportPreparation and
// projectLineage execute unchanged; nothing here is the prescription runtime.
const path=require('node:path');
const ROOT=path.resolve(__dirname,'../../../../test-support/import-engine/rebuild/engine');
const F=require('../../../../test-support/import-engine/rebuild/m3/w7-preview/fixtures.cjs');
const ORDER=['dates','constants','<seed>','plan','progression','sleep','energy','policy','today','volume','migrate','earn','merge','writers'];
function syntheticSeed({day,history,rollups}){
 return function createSyntheticSeed(){
  const SEED=F.createSyntheticState(day);
  return {SEED,HISTORY:structuredClone(history),ROLLUPS:structuredClone(rollups),exById:(s,id)=>s.exercises.find(e=>e.id===id)};
 };
}
function createImportEngine({day=F.SYNTHETIC_DAY,hour=12,history=[],rollups=[]}={}){
 const clock={today:()=>day,nowISO:()=>day+'T12:00:00.000Z',nowMs:()=>Date.parse(day+'T12:00:00.000Z'),hour:()=>hour,dow:()=>new Date(day+'T00:00:00Z').getUTCDay()};
 const deps={clock,ids:{fresh:p=>p+'synthetic',next:()=>{throw new Error('Importer assembly mints no IDs');}},drafts:Object.freeze({length:0,key:()=>null})};
 const E={};
 for(const name of ORDER){
  const create=name==='<seed>'?syntheticSeed({day,history,rollups}):require(path.join(ROOT,name+'.cjs'));
  Object.assign(E,create(E,deps));
 }
 return E;
}
module.exports={createImportEngine,ORDER,ROOT,fixtures:F};
