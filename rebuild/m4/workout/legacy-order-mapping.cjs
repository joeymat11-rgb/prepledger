'use strict';
// B-LOM. THE LEGACY ORDER MAPPING, built from the installation's OWN recorded
// facts (DECISIONS:486; rebuild/lanes/b/B-LOM-BRIEF.md sections 2 to 4).
//
// rebuild/engine/performed.cjs:176-183 refuses PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED
// whenever an imported session log and native sessions coexist and the state
// does not carry, on its workoutFacts, a legacy_baseline of profile
// earned/imported-engine-history/v1 whose session_log is the SAME OBJECT as
// s.sessionLog, plus an order.import_anchor carrying the same two ids. The
// engine states in its own source that it delegates that binding ("The
// authenticated import controller owns the generation/activation binding; this
// is not a caller proof"), so NO rebuild/engine byte moves for this ticket:
// moving one would weaken a proof the engine deliberately hands out. The proof
// is built HERE, from what the installation already recorded, or it is refused
// by name.
//
// THE TWO IDS, on a LOCAL era. No activation operation is minted when a local
// source is admitted (DECISIONS:486 (b)), so neither id can be an operation id.
// They are fixed from the admission's own digests, and both are recorded in the
// generation, which is what makes them checkable rather than asserted:
//
//   source_generation_id = basis.source_digest. The content digest of the
//     admitted source on this installation: WHICH imported history this
//     baseline is. It is the local analogue of the guarded lineage's
//     source.source_id (rebuild/m4/import/replay-core.cjs:384).
//
//   activation_op_id = basis.local_selection_id, which is selection.id and the
//     value metadata.localSources.active carries: 'local-source:' followed by a
//     digest over the source name, its material digest, the input revision, the
//     input token, the order map and the action. No operation activates a local
//     source; the recorded SELECTION is the act that does, so its id is the
//     activation id. rebuild/m4/workout/engine-order.cjs reads it back out of
//     the same authenticated generation instead of taking it from a caller.
//
// Deterministic: a pure function of the recorded selection and the adopted
// session log. No clock, no network, no I/O, no private data, nothing required
// from rebuild/m4/import (this module ships inside the page's boot graph and
// must not pull the import lane into it), and no argument mutated in place.
//
// WHAT "BOUND" MEANS HERE, stated honestly (reviews R1 finding 3, R3 finding 4).
// This module cannot RECOMPUTE a digest: recomputing one needs the import lane,
// which must not enter the page's boot graph (DECISIONS:480). So of the sixteen
// recorded fields it reads, it is PRESENCE-bound on the ten digest-valued ones
// - the six basis digests, the three map digests and native_root_id - and
// SUBSTITUTION-bound on the six that it can cross-check without hashing
// anything: the five shared identity fields, which the order map and the basis
// must agree on character for character, and local_selection_id, which must be
// the selection's own id and the id metadata.localSources.active names. The
// athlete's answer is bound the same way, by strict identity to true.
//
// No wrong order can come out of that boundary, and this is why. A substituted
// digest breaks the three recorded copies of Q that
// rebuild/m3/w7-preview/today/local-source-basis.mjs compares before Today
// adopts anything, so the page adopts NO imported state and the legacy branch
// of performed.cjs is never entered. A substituted native_root_id makes
// engine-order.cjs refuse WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN, because the
// Start it names is not the rootless Start the graph actually holds. A
// substituted source_digest or selection id makes it refuse
// WORKOUT_ORDER_IMPORT_ANCHOR_UNPROVEN, because the generation records neither.
// Every one of those is a REFUSAL BY NAME. What this module buys is that a
// corrupted record cannot become a silently different workout order; what it
// does not buy, and does not claim, is detection of a record rewritten by
// something that also rewrote all three copies of Q.
//
// S6 CARRY, review R4 finding 1: the sentence above is NARROWER than the truth
// and is corrected here rather than left to be found. order_input is
// PRESENCE-bound exactly as the ten digest-valued fields are, so the undetected
// case does not need all three copies of Q. Deleting the recorded order_map AND
// scrubbing the session-start out of order_input.operations - two fields, no
// copy of Q touched - makes the mixed predicate below read "nothing native was
// there at admission", and the days OPEN where an intact record blocks them.
// NO WRONG ORDER RESULTS, which is why the boundary still holds: the only map
// kind is athlete-confirmed-legacy-prefix with the answer true, and the
// ordering a missing map falls back to is that same prefix. The claim this
// module makes is therefore "a corrupted record cannot become a silently
// different workout order", never "a corrupted record cannot become a record
// that looks un-imported".
const PROFILE='earned/imported-engine-history/v1';
const BASIS_PROFILE='earned/local-source-basis/v1';
const MAP_PROFILE='earned/local-source-order-map/v1';
const FACTS_PROFILE='earned/workout-facts/v1';
const ORDER_PROFILE='earned/workout-order/v1';
const PROMPT='earned/legacy-prefix-prompt/v1';
const ASSERTION='athlete-confirmed-legacy-prefix';
const REFUSAL='LEGACY_ORDER_MAPPING_UNPROVEN';
// EVERY digest this mapping is bound to. A selection missing one of them is not
// a proof; an order map disagreeing with the selection's own basis on any of
// the five SHARED identity fields is not a proof either. Both refuse by name.
const SHARED=Object.freeze(['installation_id','era_id','athlete_id','source_digest','checkpoint_digest']);
const BASIS_DIGESTS=Object.freeze(['material_digest','operation_digest','interpretation_digest',
 'programme_digest','order_map_digest','engine_digest']);
const MAP_DIGESTS=Object.freeze(['legacy_members_digest','native_members_digest','root_interpretation_digest']);
const text=x=>typeof x==='string'&&x.length>0;
const plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const fail=()=>{const e=new Error(REFUSAL);e.code=REFUSAL;throw e;};
// Key-order-independent canonical encoding, written here on purpose: the import
// lane's own encoder must not enter the page's boot graph (DECISIONS:480).
function canonical(value){
 if(value===null||typeof value!=='object')return JSON.stringify(value)??'null';
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
}
// The active recorded selection, or null when this installation has admitted NO
// import. Absence is not a refusal: an installation with no import must behave
// exactly as it did before this module existed. A registry that NAMES an active
// selection it does not hold, or holds under another id, is a corrupt record
// and refuses rather than quietly reading as "no import".
function activeLocalSelection(generation){
 const registry=generation&&generation.metadata&&generation.metadata.localSources;
 if(!plain(registry)||registry.active===null||registry.active===undefined)return null;
 if(!text(registry.active))fail();
 const selection=plain(registry.selections)?registry.selections[registry.active]:null;
 if(!plain(selection)||selection.id!==registry.active)fail();
 return selection;
}
function createLegacyOrderMapping({selection,orderMap}={}){
 if(!plain(selection))fail();
 const basis=selection.basis;
 if(!plain(basis)||basis.profile!==BASIS_PROFILE)fail();
 if(!text(selection.id)||selection.id!==basis.local_selection_id)fail();
 for(const k of SHARED)if(!text(basis[k]))fail();
 for(const k of BASIS_DIGESTS)if(!text(basis[k]))fail();
 // An order map is recorded only when an imported log was being adopted AND
 // native Starts already existed (source-admission.mjs `mixed`). Its PRESENCE
 // carries the athlete's own answer, and that answer has to be a strict true.
 //
 // Its ABSENCE is evidence too, but it has to be EARNED, and round 2's first
 // MAJOR is that it was not: a deleted or nulled map was read as "nothing
 // native was here at admission", which is the one reading a LOST map also
 // produces. Absence is never proof on its own. It is proof only when the SAME
 // recorded selection shows there was nothing native to order, and the
 // selection records exactly that in its own `order_input` - the input the
 // order map was computed over. So the test below is admission's own `mixed`
 // predicate, run against the recorded input instead of against a live
 // generation: an imported log with any recorded session-start beside it MUST
 // carry a map, and a record that does not is refused by name.
 const map=orderMap===undefined?(selection.order_map===undefined?null:selection.order_map):orderMap;
 if(map!==null){
  if(!plain(map)||map.profile!==MAP_PROFILE)fail();
  for(const k of SHARED)if(!text(map[k])||map[k]!==basis[k])fail();
  for(const k of MAP_DIGESTS)if(!text(map[k]))fail();
  if(!text(map.native_root_id))fail();
  const a=map.assertion;
  if(!plain(a)||a.kind!==ASSERTION||a.answer!==true||a.prompt_version!==PROMPT||!text(a.review_digest))fail();
  // A map handed in separately must be the map this selection recorded.
  if(plain(selection.order_map)&&canonical(selection.order_map)!==canonical(map))fail();
 }else{
  if(plain(selection.order_map))fail();
  const input=selection.order_input;
  if(!plain(input)||!plain(input.operations)||!plain(input.legacyLog))fail();
  if(Object.keys(input.legacyLog).length&&Object.values(input.operations)
   .some(op=>plain(op)&&op.class==='session'&&op.kind==='session-start'))fail();
 }
 const anchor=Object.freeze({source_generation_id:basis.source_digest,activation_op_id:selection.id});
 const binding=Object.freeze({profile:'earned/legacy-order-mapping/v1',
  ...Object.fromEntries(SHARED.map(k=>[k,basis[k]])),
  ...Object.fromEntries(BASIS_DIGESTS.map(k=>[k,basis[k]])),
  activation_op_id:anchor.activation_op_id,
  order_map:map===null?null:Object.freeze({...Object.fromEntries(MAP_DIGESTS.map(k=>[k,map[k]])),
   native_root_id:map.native_root_id,review_digest:map.assertion.review_digest})});
 const digest=canonical(binding);
 // session_log is the CALLER'S OWN object, never a copy: performed.cjs:176
 // compares it by REFERENCE against s.sessionLog, and a second copy of the
 // imported log is exactly what that rule exists to prevent.
 function baseline(sessionLog){
  if(!plain(sessionLog)||!Object.keys(sessionLog).length)fail();
  return {profile:PROFILE,source_generation_id:anchor.source_generation_id,
   activation_op_id:anchor.activation_op_id,session_log:sessionLog};
 }
 // Returns a NEW workoutFacts; neither argument is mutated. The caller composes
 // {...state, workoutFacts: attach(state.workoutFacts, state)} so that the
 // state the engine reads and the log the baseline names are one object.
 function attach(workoutFacts,state){
  if(!plain(state)||!plain(workoutFacts)||workoutFacts.profile!==FACTS_PROFILE)fail();
  const order=workoutFacts.order;
  if(!plain(order)||order.profile!==ORDER_PROFILE||!Array.isArray(order.start_ids))fail();
  const existing=order.import_anchor;
  // A PROVEN order already carries the anchor engine-order.cjs derived. It must
  // be this mapping's anchor; a disagreement refuses and is never overwritten.
  if(existing!==undefined&&existing!==null&&(!plain(existing)||
    existing.source_generation_id!==anchor.source_generation_id||
    existing.activation_op_id!==anchor.activation_op_id))fail();
  return {...workoutFacts,legacy_baseline:baseline(state.sessionLog),
   order:{...order,import_anchor:{source_generation_id:anchor.source_generation_id,
    activation_op_id:anchor.activation_op_id}}};
 }
 return Object.freeze({anchor,binding,digest,baseline,attach,REFUSAL});
}
module.exports={createLegacyOrderMapping,activeLocalSelection,REFUSAL,PROFILE,BASIS_PROFILE,MAP_PROFILE};
