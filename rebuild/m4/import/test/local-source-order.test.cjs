'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
function api(){assert.ok(fs.existsSync(path.join(__dirname,'../local-source-order.cjs')),'S3 local source order is implemented');return require('../local-source-order.cjs');}
const platform={hash:x=>require('node:crypto').createHash('sha256').update(x).digest('hex')};
function input(){return {installation_id:'installation',era_id:'era',athlete_id:'athlete',source_digest:'a'.repeat(64),checkpoint_digest:'b'.repeat(64),legacyLog:{'2026-09-01':{entries:[]}},operations:{root:{op_id:'root',kind:'session-start',class:'session',causal_parents:[],payload:{capture:{exercise:'squat'}}}},rootInterpretation:{root:{exercise:'squat'}}};}
test('S3-ORDER-ATTESTATION: exact immutable displayed membership requires a distinct factual answer',()=>{
 const controller=api().createLocalSourceOrder(platform),original=input(),review=controller.review(original);
 assert.throws(()=>controller.confirm({...review},{answer:true}),{code:'LOCAL_SOURCE_ORDER_REVIEW_UNOWNED'});
 assert.throws(()=>controller.confirm(review,{answer:false}),{code:'ORDER_EVIDENCE_REQUIRED'});
 const map=controller.confirm(review,{answer:true});
 assert.equal(map.assertion.kind,'athlete-confirmed-legacy-prefix');
 assert.equal(map.native_root_id,'root');
 assert.equal(controller.validate(map,original).ready,true);
});
test('S3-ORDER-DESCENDANT: new descendants revalidate; independent roots cannot borrow prefix evidence',()=>{
 const controller=api().createLocalSourceOrder(platform),original=input(),map=controller.confirm(controller.review(original),{answer:true});
 const descendant=structuredClone(original);descendant.operations.child={op_id:'child',kind:'session-start',class:'session',causal_parents:['root'],payload:{capture:{exercise:'squat'}}};
 assert.equal(controller.validate(map,descendant).ready,true);
 descendant.operations.child.causal_parents=[];
 assert.throws(()=>controller.validate(map,descendant),{code:'LOCAL_SOURCE_ORDER_MAP_UNPROVEN'});
});
test('S3-ORDER-MEMBERS: dates and labels do not repair changed members or mapped root interpretation',()=>{
 const controller=api().createLocalSourceOrder(platform),original=input(),map=controller.confirm(controller.review(original),{answer:true});
 for(const change of [x=>{x.legacyLog['2026-09-01'].entries.push({id:'other'});},x=>{x.rootInterpretation.root.exercise='same-name-other-id';},x=>{x.source_digest='c'.repeat(64);},x=>{x.operations.root.causal_parents=['missing'];}]){
  const changed=structuredClone(original);change(changed);assert.throws(()=>controller.validate(map,changed),{code:'LOCAL_SOURCE_ORDER_MAP_UNPROVEN'});
 }
});
test('S3-ORDER-STRUCTURE: cycles, duplicated identities and unknown parents never acquire date order',()=>{
 const controller=api().createLocalSourceOrder(platform);
 for(const change of [x=>{x.operations.root.causal_parents=['root'];},x=>{x.operations.other={...x.operations.root};},x=>{x.operations.root.causal_parents=['missing'];}]){
  const changed=input();change(changed);assert.throws(()=>controller.review(changed),{code:'LOCAL_SOURCE_ORDER_MAP_UNPROVEN'});
 }
});
