import {parseStrictJson} from '../strict-json.mjs';
import {readLocalEra} from './local-era.mjs';
import Ops from '../../../client/ops.cjs';
import {createReadingProjector} from '../reading-history.mjs';
import Food from '../../w7-preview/today/food-commands.cjs';
import FoodModel from '../../w7-preview/today/food-model.cjs';
import CheckIn from '../../w7-preview/today/checkin-commands.cjs';
// P3-REPLAY-MEASURE-FAMILY. The S5 measure producer is READ here, never
// edited: measure-commands.cjs is S5-sealed, and the family below answers for
// the records it writes rather than changing what it writes. measure-host.mjs
// opens the SAME installation Today opens, so an athlete who opened the
// Measure screen before importing carries these records in the very generation
// admission replays; without a family they fell to the catch-all and refused
// LOCAL_SOURCE_CONTEXT_UNRESOLVED (P3-IMPORT-UI-2 open item 1, cell P3-X9).
import Measure from '../../w7-preview/measure/measure-commands.cjs';
import MeasureReplay from '../../../m4/import/measure-replay.cjs';
// P3-REPLAY-ALL-FAMILIES, RV-G4. body-composition-source is NOT one lane's
// class: the authority validates a LEAN-SOURCE payload of its own under it
// (rebuild/authority/validate.cjs payloadValid), which carries no profile at
// all. Membership is therefore by PROFILE, through this router, so the measure
// family answers for the three measure profiles and any other member of the
// class is refused in the CLASS's name rather than in a family's.
import BodyComposition from '../../../m4/import/body-composition-class.cjs';
// P3-REPLAY-ALL-FAMILIES, RV-S1. The N2 sleep producer is READ here, never
// edited. sleep-host.mjs opens the SAME installation Today opens, so one
// recorded night lands in the very generation admission replays; without a
// family it fell to the catch-all and refused LOCAL_SOURCE_CONTEXT_UNRESOLVED,
// reproduced through the real host before this was built.
import Sleep from '../../w7-preview/today/sleep-commands.cjs';
import SleepReplay from '../../../m4/import/sleep-replay.cjs';
import Setup from '../../w7-preview/today/setup-commands.mjs';
import {createCleanInitState} from '../../w7-preview/today/setup-model.mjs';
import Settings from '../../../coach/machine-settings-commands.cjs';
import {storedWorkoutHistory} from '../../../m4/workout/stored-history.mjs';
import {projectWorkoutRecords} from '../../../m4/workout/project-history.mjs';
import Capture from '../../../m4/workout/capture.cjs';
import SourceCodec from '../../w5/source/codec.cjs';
import SourceProjection from '../../../m4/workout/source-projection.cjs';
import EngineCapture from '../../../m4/workout/engine-capture.cjs';
/* P3-REAL-SHAPE 2.3/2.5. WHERE A LIFT OF THE FILE AND A LIFT OF THE DOCUMENT
   ARE THE SAME LIFT, stated ONCE and imported by the three readers that ask it
   (this module's programme rule, this module's capture block, and
   m4/workout/plan-edit-model.cjs) so the three cannot disagree. A second
   spelling of the rule would be a second rule. */
import LiftCorrespondence from '../../../m4/workout/lift-correspondence.cjs';
import History from '../../../m4/workout/engine-history.cjs';
// ROUTE 1, STEP ONE (P3-D-FOLLOWONS, DECISIONS:475; the brief's row E). The
// ACCEPTED host-owned MIRROR, not rebuild/m4/workout/engine-runtime.cjs. That
// file composes its twelve factories through ONE non-literal require, which
// esbuild answers by globbing the whole of rebuild/engine: engine/index.cjs,
// engine/seed.cjs and every Node-only engine/test/** harness are swept into
// any browser graph that reaches this module. The mirror is a BINDING, not a
// reimplementation - engine-runtime-host.cjs states the same twelve modules in
// the same order behind literal requires, and
// rebuild/m3/w6/host/test/engine-equivalence.test.cjs fails on any drift
// between the two. This module uses exactly one name from it,
// createEngineRuntime, and one reader off the frozen five-name facade,
// sessionMembership, so the swap changes no behaviour: proved cell by cell in
// rebuild/lanes/d/p3-followons/admission-swap.test.mjs, which runs the whole
// admission against BOTH runtimes and compares the durable basis byte for
// byte. What leaves the graph is measured in
// rebuild/m3/w7-preview/import/test/page-bundle.test.mjs.
import Runtime from '../host/engine-runtime-host.cjs';
import Profile from '../../../m4/import/local-source-profile.cjs';
import Order from '../../../m4/import/local-source-order.cjs';
import {createBrowserReplay,createSourceReplayEngine} from '../../../m4/import/browser-replay.mjs';
import {createSourcePlatform} from './source-platform.mjs';

const qualifications=new WeakMap(),reviews=new WeakMap();
/* P3-REAL-SHAPE. The three names this module uses off the shared correspondence
   helper. They are read here and nowhere restated. */
const {normaliseName,correspondence,idCollisions}=LiftCorrespondence;
// F7, the measure family. Pure and stateless: it is built once from the S5
// producer's own validate() and its three profile names, holds no clock, no
// engine and no platform, and is handed the day admission stands on per call.
const measureFamily=MeasureReplay.createMeasureReplayFamily({commands:Measure.createMeasureCommands(),
 profiles:{waist:Measure.PROFILE,markers:Measure.MARKERS_PROFILE,trialStart:Measure.TRIAL_PROFILE}});
// The shared class, judged by profile (RV-G4). F7 is its one member today and
// claims exactly the three S5 measure profiles; every other member of the class
// - the authority's own lean-source payload among them - is refused by the
// class's name until a family for it exists.
const bodyComposition=BodyComposition.createBodyCompositionClass({members:[{family:MeasureReplay.FAMILY,
 profiles:[Measure.PROFILE,Measure.MARKERS_PROFILE,Measure.TRIAL_PROFILE],replay:measureFamily.replay}]});
// F8, the sleep family. Pure and stateless, on the same terms as F7: built once
// from the N2 producer's own validate() and its one profile name, holding no
// clock, no engine and no platform.
const sleepFamily=SleepReplay.createSleepReplayFamily({commands:Sleep.createSleepCommands(),
 profile:Sleep.PROFILE});
const fail=(code,detail)=>{const e=new Error(code);e.code=code;if(detail)Object.assign(e,detail);throw e;};
/* THE CODES THIS MODULE RAISES (P3-PORT-FIX, spec 3.4). The recorded-workout
   `try` at :270 also encloses storedWorkoutHistory, projector.project and the
   engine runtime, which can throw errors this module did not name. Its catch
   may therefore only surface a code that is on this list; anything else keeps
   LOCAL_SOURCE_WORKOUT_UNRESOLVED, exactly as it did before. An allowlist, not
   a bare `e.code`, so no foreign code can become the athlete's refusal. */
const KNOWN_REPLAY_CODES=Object.freeze(new Set(['LOCAL_SOURCE_AUTHORITY_CONTEXT',
 'LOCAL_SOURCE_CAUSAL_CYCLE','LOCAL_SOURCE_COMMIT_UNPROVEN','LOCAL_SOURCE_COVERAGE_UNKNOWN',
 'LOCAL_SOURCE_EFFECT_UNMAPPED','LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED',
 'LOCAL_SOURCE_MATERIAL_MISMATCH','LOCAL_SOURCE_ORDER_MAP_REQUIRED','LOCAL_SOURCE_ORIGINAL_CHANGED',
 'LOCAL_SOURCE_ORIGINAL_INVALID','LOCAL_SOURCE_PROGRAMME_UNRESOLVED','LOCAL_SOURCE_QUALIFICATION_UNOWNED',
 'LOCAL_SOURCE_REOPEN_UNPROVEN','LOCAL_SOURCE_REVIEW_UNOWNED','LOCAL_SOURCE_ROLLBACK_UNPROVEN',
 'LOCAL_SOURCE_SCOPE','LOCAL_SOURCE_SELECTION_CONFLICT','LOCAL_SOURCE_SELECTION_UNPROVEN',
 'LOCAL_SOURCE_STALE','SOURCE_ENGINE_CONTEXT_UNPROVEN','SOURCE_PREPARATION_REPRODUCTION_MISMATCH']));
/* The issue detail an inner throw is allowed to carry out: a `field` from the
   closed vocabulary of spec 3.1 and, where the field is per lift, the lift id.
   GUARDED, so an error that carries no field (a CLEAN_INIT_* out of
   createCleanInitState, a TypeError) produces an issue with NO `field` member
   rather than one whose field is undefined.

   THE CLOSED VOCABULARY, in full. A `field` is a literal chosen by the code
   path, never interpolated, so no value from the file can ride out on one. An
   `exercise_id` is always the PHONE's own id, except on the four capture rows,
   where it is the id the admitted state holds and the athlete is being told
   about his OWN recorded Earned workout (spec 3.4).

     setup_document   zero or two first-run documents on this phone, or one
                      that does not validate
     split            the file's split is not a non-empty period array
     split.map        a period of the file's week is not this phone's week
     split.from       a period starts after today, or none is in force today
     exercises        the file lists a different number of lifts
     exercise_id      a lift this phone lists is missing from the file, or
                      listed twice                                    (per lift)
     day              a lift sits on a different training day          (per lift)
     mg               a lift is filed under a different muscle group   (per lift)
     sets hi inc      P3-PORT-FIX-2 (DECISIONS:509 NOTE 4): a RETAINED value the
     steps            document constructor itself would refuse         (per lift)
     capture_producer a recorded capture names an unknown rule profile
     capture_lift     a capture slot names a lift the admitted state does not
                      carry exactly once                              (per lift)
     capture_sets     a capture's slot count for a lift is not the count the
                      document that produced it prescribed            (per lift)
     capture_membership  the capture's lift pool or order is not the one the
                      engine's own membership reader gives for that day */
const detailOf=e=>(e?.field?{field:e.field,...(e.exercise_id?{exercise_id:e.exercise_id}:{})}:undefined);
const {encode,digest,freeze,validDay,sourceEngineContext,engineContextAt}=Profile;
const copy=structuredClone;
const COLLECTIONS=new Set(['ops','outbox','dispositions','rejected','receipts','planTxns','plan','planTransactions','planHistory','suspensions','issuances','sessionStarts','sessionResolutions','drafts','sync','meta','derived']);
export function assertLocalSourceQualification(handle){if(!qualifications.has(handle))fail('LOCAL_SOURCE_QUALIFICATION_UNOWNED');return true;}
// Only narrow closures cross into the commit coordinator. No raw generation,
// enrollment key, or caller-chosen transaction body leaves controller custody.
export function localSourceCommitCapability(handle){assertLocalSourceQualification(handle);return qualifications.get(handle).commitCapability;}
export function createLocalSourceController({repository,namespace,athleteId,deviceId,producerRegistry,asOf,getSemanticEpoch=()=>0,isAlive=()=>true,platform=createSourcePlatform()}={}){
 if(!repository?.load||!repository?.commit||!repository?.importCustody||!namespace||!athleteId||!deviceId||typeof producerRegistry?.qualify!=='function')throw TypeError('Actual repository, enrollment scope and producer registry required');
 let epoch=0,closed=false;
 const currentDay=()=>typeof asOf==='function'?asOf():asOf;
 const stamp=()=>encode({epoch,semantic:getSemanticEpoch(),asOf:currentDay()});
 const syncGuard=expected=>closed||!isAlive()||stamp()!==expected?{code:'LOCAL_SOURCE_STALE',state:3}:null;
 const custody=repository.importCustody({parseStrictJson,validateContext:()=>closed||!isAlive()?{code:'LOCAL_SOURCE_CLOSED',state:3}:null});
 const core=createBrowserReplay({platform}),order=Order.createLocalSourceOrder(platform),reading=createReadingProjector({athleteId,deviceId});
 async function checked(held,action){if(syncGuard(held.stamp))fail('LOCAL_SOURCE_STALE');const value=await action();if(syncGuard(held.stamp))fail('LOCAL_SOURCE_STALE');return value;}
 async function current(held){const loaded=await checked(held,()=>repository.load());if(loaded.revision!==held.expected.revision||loaded.token!==held.expected.token)fail('LOCAL_SOURCE_STALE');return true;}
 function validateGeneration(g){
  const era=readLocalEra(g.metadata),c=g.collections,ops=c.ops||{};
  if(g.metadata.namespace!==namespace||era.lease.athlete_id!==athleteId||era.lease.device_id!==deviceId)fail('LOCAL_SOURCE_SCOPE');
  if(Object.keys(c).some(k=>!COLLECTIONS.has(k)))fail('LOCAL_SOURCE_EFFECT_UNMAPPED');
  if(c.sync?.frontier?.W!==0||(c.sync?.frontier?.authorityW??0)!==0||['receipts','rejected','dispositions'].some(k=>Object.keys(c[k]||{}).length)||Object.keys(g.metadata.wireProofs||{}).length)fail('LOCAL_SOURCE_AUTHORITY_CONTEXT');
  const sequences=new Set(),colors=new Map();
  function visit(id){if(colors.get(id)===1)fail('LOCAL_SOURCE_CAUSAL_CYCLE');if(colors.get(id)===2)return;const op=ops[id];if(!op||!Array.isArray(op.causal_parents)||new Set(op.causal_parents).size!==op.causal_parents.length)fail('LOCAL_SOURCE_ORIGINAL_INVALID');colors.set(id,1);for(const p of op.causal_parents)visit(p);colors.set(id,2);}
  for(const [id,op]of Object.entries(ops)){
   if(op.op_id!==id||op.athlete_id!==athleteId||op.device_id!==deviceId||op.lease_id!==era.lease.lease_id||!Number.isSafeInteger(op.device_seq)||op.device_seq<1||sequences.has(op.device_seq)||![1,2].includes(op.schema_version)||!Ops.KINDS.includes(op.kind)||!Ops.CLASSES.includes(op.class)||Ops.commitmentOf(op,era.identityKey)!==op.canonical_content_commitment||c.outbox?.[id]?.op_id!==id)fail('LOCAL_SOURCE_ORIGINAL_INVALID');
   if(['authority_signature','athlete_log_seq','accepted_at','decided_at','sealing_transitions','sealed'].some(k=>Object.hasOwn(op,k)))fail('LOCAL_SOURCE_AUTHORITY_CONTEXT');
   if(Ops.TARGET_REQUIRED.has(op.kind)?typeof op.target_op_id!=='string'||!op.target_op_id:Object.hasOwn(op,'target_op_id'))fail('LOCAL_SOURCE_ORIGINAL_INVALID');
   sequences.add(op.device_seq);visit(id);
   if(op.target_op_id&&(!ops[op.target_op_id]||!op.causal_parents.length))fail('LOCAL_SOURCE_ORIGINAL_INVALID');
  }
  if(Object.keys(c.outbox||{}).length!==Object.keys(ops).length||Object.keys(c.outbox||{}).some(id=>!Object.hasOwn(ops,id)))fail('LOCAL_SOURCE_ORIGINAL_INVALID');
  const ordered=Object.values(ops).sort((a,b)=>a.device_seq-b.device_seq);
  for(let i=0;i<ordered.length;i++)if(ordered[i].device_seq!==i+1||ordered[i].device_predecessor_op_id!==(i?ordered[i-1].op_id:null))fail('LOCAL_SOURCE_ORIGINAL_INVALID');
  if(['plan','planTxns','planTransactions','planHistory','suspensions','issuances'].some(k=>Object.keys(c[k]||{}).length))fail('LOCAL_SOURCE_EFFECT_UNMAPPED');
  return era;
 }
 function rawMaterial(m){return {source_json:platform.text(m.sourceBytes),candidate_json:platform.text(m.candidateBytes),local_json:m.localBytes===null?null:platform.text(m.localBytes),engine_context_json:m.engineContextJson};}
 async function reviewSource(name){
  const held={stamp:stamp()},loaded=await checked(held,()=>repository.load());held.expected={revision:loaded.revision,token:loaded.token};held.generation=copy(loaded.generation);
  const era=validateGeneration(held.generation),entries=held.generation.metadata.imports?.filter(e=>e.name===name)||[];
  if(entries.length!==1)fail(entries.length?'LOCAL_SOURCE_IMPORT_AMBIGUOUS':'LOCAL_SOURCE_IMPORT_REQUIRED');const entry=entries[0];
  const material=await checked(held,()=>custody.load(name));await current(held);
  const currentOps=held.generation.collections.ops,originalSets=[material.checkpoint.generation.collections.ops||{}];
  for(const [id,selection]of Object.entries(held.generation.metadata.localSources?.selections||{})){
   if(selection?.id!==id||!selection.order_input?.operations)fail('LOCAL_SOURCE_SELECTION_UNPROVEN');originalSets.push(selection.order_input.operations);
  }
  for(const originals of originalSets)for(const [id,original]of Object.entries(originals))if(!Object.hasOwn(currentOps,id)||encode(currentOps[id])!==encode(original))fail('LOCAL_SOURCE_ORIGINAL_CHANGED');
  const raw=rawMaterial(material),context=parseStrictJson(raw.engine_context_json);
  if(entry.sourceSha256!==platform.hash(material.sourceBytes)||entry.migratedSha256!==platform.hash(material.candidateBytes)||(entry.localSha256??null)!==(material.localBytes===null?null:platform.hash(material.localBytes))||entry.engineSha256!==context.engine?.sha256||entry.schemaV!==context.engine?.schemaV)fail('LOCAL_SOURCE_MATERIAL_MISMATCH');
  const materialDigest=digest(platform.hash,'earned/local-source-material/v1',raw),engineContext=producerRegistry.qualify({context,materialDigest});
  if(!validDay(currentDay()))fail('SOURCE_ENGINE_CONTEXT_UNPROVEN');
  Object.assign(held,{name,entry,eraId:era.eraId,material,raw,materialDigest,engineContext,sourceDigest:platform.hash(material.sourceBytes),checkpointDigest:digest(platform.hash,'earned/local-source-checkpoint/v1',material.checkpoint)});
  const candidate=parseStrictJson(raw.candidate_json),legacy=Object.keys(candidate.sessionLog||{}),native=Object.values(currentOps).filter(op=>op.class==='session'&&op.kind==='session-start');
  const membership=order.review({installation_id:namespace,era_id:era.eraId,athlete_id:athleteId,source_digest:held.sourceDigest,checkpoint_digest:held.checkpointDigest,legacyLog:candidate.sessionLog||{},operations:currentOps,rootInterpretation:{}});
  const review=freeze({profile:'earned/local-source-review/v1',installation_id:namespace,era_id:era.eraId,athlete_id:athleteId,device_id:deviceId,source_digest:held.sourceDigest,source_bytes:material.sourceBytes.length,material_digest:materialDigest,as_of:currentDay(),legacy_members:legacy,native_root_id:membership.native_root_id,native_members:native.map(op=>({op_id:op.op_id,effective:copy(op.effective)})),prefix_required:legacy.length>0&&native.length>0,
   prefix_question:'Did every workout in this file happen before this first Earned workout, with none already recorded in Earned?'});
  reviews.set(review,held);return review;
 }
 /* THE PROGRAMME RULE (P3-PORT-FIX, DECISIONS:506/:507). The imported file is
    proved to be THIS athlete's programme by its SHAPE, not by its numbers: the
    week he just described, the lifts he just listed, and where each one sits.
    His set counts, rep targets, increments, ladders, volume tags and stated
    priorities are RETAINED from the file and never proved against the one-number
    document the setup flow can write (setup-model.mjs:622-623,:633), because
    the flow cannot ask him for them and a rule he cannot answer is not a rule.
    Each retention carries its own argument in lanes/d/P3-PORT-FIX-SPEC.md 1.4. */
 /* P3-REAL-SHAPE (DECISIONS:520 option A, accepted DECISIONS:521). THE FILE
    WINS. The rule above was written against a picture of the owner's file, not
    against the file: every fixture the corpus sealed was built by the NEW app's
    own createCleanInitState, so all of them carried a two-member split, slug
    lift ids, an athlete_label, a `steps` ladder on every lift, a positive `inc`
    and a numeric working load. The owner's file carries none of those, and it
    refused on five separate fields before it could be adopted
    (lanes/d/P3-REAL-SHAPE-SPEC.md section 1, measured end to end).
    What is PROVED is now the week, the setup op, the owner's identity answer,
    the retained-number bounds and the capture provenance - and nothing else.
    Every lift the file lists is the athlete's lift, under the file's own id and
    the file's own name. Where a lift of the file and a lift of the document are
    THE SAME LIFT is decided by NAME, in one place three readers share
    (m4/workout/lift-correspondence.cjs). */
 function programme(source,ops,{today,documentSets=null,documentProgramme=null}){
  const setups=Object.values(ops).filter(o=>o.payload?.profile===Setup.PROFILE);
  if(setups.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'setup_document'});const op=setups[0];
  if(op.schema_version!==2||!Setup.validate(op,id=>ops[id]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'setup_document'});
  const scratch=createCleanInitState({setup:op.payload.setup});
  /* THE DOCUMENT'S OWN SET COUNT PER LIFT, handed back through an OUT PARAMETER
     (P3-PORT-FIX-2, DECISIONS:509 Q1). It is deliberately NOT a member of the
     returned basis: that object is the programme digest's input at :325, and a
     new member would change a digest that binds what was admitted. It is filled
     HERE, before any comparison below can refuse, so the capture check further
     down reads the document even on a file that never gets past this function. */
  if(documentSets)for(const ex of scratch.exercises)documentSets.set(ex.id,ex.sets);
  /* P3-REAL-SHAPE 2.3. THE DOCUMENT STATE ITSELF, out of this function by the
     SAME out-parameter discipline `documentSets` already uses and for the same
     reason: the capture block below has to ask the engine what the programme
     that PRODUCED a pre-import capture prescribed on that day, and that
     programme is this document, not the file. Filled HERE, before any
     comparison below can refuse, so the capture block reads the document even
     on a file that never gets past this function. It is NOT a member of the
     returned basis and therefore not a digest input. */
  if(documentProgramme)documentProgramme.state=scratch;
  /* P-LABEL FIRST (P3-REAL-SHAPE 2.1/2.3, review R1 N9). The file's name, when
     it has one, must be his, and a file that names someone else must be refused
     BY THAT NAME rather than by whichever lift member the loop below happens to
     reach first. A file that names NOBODY - which is every old-app file - takes
     this installation's own first-run label when it is admitted, in replay()
     below, and that is what turns today's silent non-adoption into something
     the owner can read. */
  if(Object.hasOwn(source,'athlete_label')&&source.athlete_label!==op.payload.setup.athlete_label)
   fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'athlete_label'});
  /* P3-REAL-SHAPE. NOTHING PER LIFT IS COMPARED ANY MORE: the file's lifts are
     the athlete's lifts, so `fields` (`day`, `mg`) and the per-lift id multiset
     equality both go. PROJECTED_FIELDS is what the admitted basis carries out to
     the programme digest at :325 and it GAINS `n`, because after option A the
     athlete's own name for a lift is part of what was admitted and is what the
     correspondence rule reads. */
  const PROJECTED_FIELDS=['id','n','day','mg','sets','hi','inc','steps','head','secondary'];
  /* BOUNDED is its own list (P3-PORT-FIX-2, DECISIONS:509 NOTE 4). These are
     still RETAINED - the file's value is what lands, and nothing here compares
     it with the phone's - but a retained value must still be one the athlete's
     own document constructor would accept, because the state it lands in is the
     state the engine reads. It LOSES `steps` and `inc`: the OLD app has no rung
     ladder on any lift and writes `inc: null` where there is no plate to add,
     and a bound on a member the file never carries is a rule the athlete cannot
     answer (P3-PORT-FIX-SPEC 1.4's own test). Both are bounded below instead,
     over the vocabulary the old app actually writes. */
  const BOUNDED_FIELDS=['sets','hi'];
  const periods=Array.isArray(source.split)?source.split:null;
  const week=scratch.split[0].map;
  if(!periods||!periods.length)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split'});
  for(const p of periods){
   if(!p||typeof p!=='object'||Array.isArray(p)||
      Object.keys(p).some(k=>k!=='from'&&k!=='map'&&k!=='why')||
      !Object.hasOwn(p,'from')||!Object.hasOwn(p,'map')||
      /* P3-REAL-SHAPE 2.3. `why` is the file's own provenance note
         (src/app.jsx:11057, :552). It is RETAINED as an opaque string, never
         parsed, never shown, never a rule; a non-string one is a malformed
         period. This one optional member is the whole of the widening, and it
         is the field the owner's own screenshot named. */
      (Object.hasOwn(p,'why')&&typeof p.why!=='string'))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split'});
   if(!validDay(p.from)||p.from>today)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split.from'});
   /* P3-REAL-SHAPE (review R1 NOTE 3). EVERY period's `map` IS SHAPE-CHECKED,
      including the earlier ones nothing compares. Presence is not a shape
      check: before this line a file whose earlier period was
      `{from:'2026-06-01', map:null}` was admitted and the `null` was stored in
      his state verbatim, a trap for whatever reads an earlier period next
      (`covered()` and `dayType` read the period in force and no other, today).
      What is asked is SHAPE and never content - the same key set as the week
      the document already built, and a non-empty string against each key - so
      an earlier week that genuinely differs is retained unexamined, which is
      the PM's Q2 ruling. The document's own week is the reference because
      createCleanInitState built it at the head of this function. */
   if(!p.map||typeof p.map!=='object'||Array.isArray(p.map)||
      encode(Object.keys(p.map).sort())!==encode(Object.keys(week).sort())||
      Object.values(p.map).some(v=>typeof v!=='string'||!v.trim()))
    fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split.map'});
  }
  /* P3-REAL-SHAPE, PM QUESTION 2 (DECISIONS:521, ruled YES). THE PERIOD IN
     FORCE TODAY is what P-A proves against; the earlier periods are
     shape-checked above and RETAINED UNEXAMINED as the athlete's own history of
     his own week. A live old-app state accumulates a period every time he
     changes his week, and requiring EVERY one of them to equal the week he just
     typed would refuse his file for a week he stopped training months ago.
     The period in force is the latest `from` that is not after today; every
     period's `from` is already bounded above, so this is simply the last one.
     `split.map` therefore names ONE period and never a historical one.
     THE TIE IS A RULE AND NOT AN ACCIDENT (review R1 NOTE 4). Two periods may
     share one `from` - the old app APPENDS a period every time he changes his
     week, and he may change it twice in a day - and the sort below does not
     order them. Array.prototype.sort is stable, so `.at(-1)` takes the LAST one
     THE FILE LISTS, which is the later of the two changes he made and the one
     he is training on. That is the rule, it is written here rather than left to
     be read out of the sort, and D-RS-R1-n4 pins it in both orders. A duplicated
     `from` is NOT refused: refusing it would throw away an import over a second
     edit on one day, which is a rule the athlete cannot answer. */
  const inForce=periods.filter(p=>p.from<=today).sort((a,b)=>a.from<b.from?-1:a.from>b.from?1:0).at(-1);
  if(!inForce)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split.from'});
  if(encode(inForce.map)!==encode(week))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split.map'});
  /* P3-REAL-SHAPE 2.3. THE FILE'S OWN LIFT LIST IS THE ATHLETE'S LIFT LIST.
     What is still proved about it is only that it is a list of lifts the engine
     can read at all: each one has a unique non-empty id, a name that survives
     normalisation, a day the engine knows, a muscle group, and retained numbers
     inside the constructor's own bounds. */
  if(!Array.isArray(source.exercises)||!source.exercises.length)
   fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'exercises'});
  const seen=new Set();
  for(const ex of source.exercises){
   if(typeof ex?.id!=='string'||!ex.id.trim()||seen.has(ex.id))
    fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'exercise_id',exercise_id:String(ex?.id??'')});
   seen.add(ex.id);
   /* A lift whose name normalises to EMPTY - a lift called '---' - cannot be
      corresponded to anything and cannot be shown to him, and the alternative
      is to guess. It refuses, with its own sentence on the screen. */
   if(typeof ex.n!=='string'||!normaliseName(ex.n))
    fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'exercise_n',exercise_id:ex.id});
   if(!['U','L'].includes(ex.day))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'day',exercise_id:ex.id});
   if(typeof ex.mg!=='string'||!ex.mg.trim())fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'mg',exercise_id:ex.id});
   /* `inc` is bounded to the OLD APP's own vocabulary: a finite number above
      zero, OR null, which is what it writes where there is no plate to add
      (src/app.jsx:399, the bodyweight raise). */
   if(!(typeof ex.inc==='number'&&Number.isFinite(ex.inc)&&ex.inc>0)&&ex.inc!==null)
    fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'inc',exercise_id:ex.id});
   /* `steps` is RETAINED and bounded ONLY WHEN PRESENT: a file with no ladder
      is the normal shape of the old app and is not a fault. THIS RESTATES
      athlete-state.cjs:130-133 (a non-empty strictly ascending list of positive
      loads) rather than delegating to it, because the probe below cannot be the
      whole answer for a member the file may not carry at all. If the
      constructor's ladder rule ever changes, this line has to change with it
      (spec review R2, small thing 1). */
   if(Object.hasOwn(ex,'steps')&&!(Array.isArray(ex.steps)&&ex.steps.length&&
       ex.steps.every((x,i)=>typeof x==='number'&&Number.isFinite(x)&&x>0&&(i===0||x>ex.steps[i-1]))))
    fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'steps',exercise_id:ex.id});
   /* THE DOCUMENT CONSTRUCTOR'S OWN BOUNDS, APPLIED TO THE RETAINED VALUES
      (P3-PORT-FIX-2, DECISIONS:509 NOTE 4 / D-PF-n4). Until P3-PORT-FIX every
      retained number had to EQUAL the phone's document, and the document has
      been through createCleanInitState, so the file's numbers were incidentally
      bounded to values the engine accepts. Retaining them dropped that bound and
      a `sets: 0` rode all the way into the adopted basis, where the gym card
      dead-ends. The bound is restored by ASKING THE CONSTRUCTOR ITSELF rather
      than by restating its rule here: the phone's own valid document is rebuilt
      with exactly ONE member of ONE lift replaced by the file's value, and if
      athlete-state.cjs refuses that document it refuses this value. No bound is
      invented and none is copied: what the constructor bounds
      (athlete-state.cjs:118-135 - every member present, `sets` and `hi`
      positiveInt, `inc` a finite number above zero, `steps` a non-empty
      ascending list of positive loads) is what admission bounds, and what it
      does not bound (any ceiling at all) admission does not bound either.
      The probe is attributable: the document alone already built a state at the
      head of this function, so the only thing that can have refused is the one
      substituted value. `head`, `secondary` and `priority_muscles` are outside
      REQUIRED_EXERCISE and the constructor sets no bound on the first two, so
      they stay retained and unbounded, as the ruling's four field names say.
      P3-REAL-SHAPE: the probe now runs against the document's FIRST lift, not
      against the document lift with this id, because after option A there is no
      longer a document lift that corresponds to this one by id. Any valid lift
      will do and the probe stays attributable, by the sentence above. */
   for(const key of BOUNDED_FIELDS)
    try{const first=op.payload.setup.exercises[0];
     createCleanInitState({setup:{...op.payload.setup,
      exercises:op.payload.setup.exercises.map(d=>d===first?{...d,[key]:ex[key]}:d)}});}
    catch{fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:key,exercise_id:ex.id});}
  }
  /* P3-REAL-SHAPE (spec review R2, small thing 2). AN ID SHARED BY TWO LIFTS
     THAT ARE NOT THE SAME LIFT IS REFUSED, not left to bind. After option A the
     file's handles and the document's slugs are independent id spaces. Where a
     FILE lift's id equals a DOCUMENT lift's id but the two do not answer for
     each other by NAME, the document row is neither corresponded nor appended
     (replay()'s `held` skip sees the id already present) and both the capture
     block and the companion's id branch would bind that slot or row to a
     DIFFERENT lift, silently. The tie-break is the correspondence rule itself.
     On the owner's own shape this cannot fire: the four ids his file and his
     setup share (press, pulldown, tricep, calves) are shared BY THE SAME NAME. */
  const collisions=idCollisions(source.exercises,scratch.exercises);
  if(collisions.length)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'exercise_id',exercise_id:collisions[0]});
  return {op_id:op.op_id,split:source.split,
   exercises:source.exercises.map(ex=>Object.fromEntries(PROJECTED_FIELDS
     .filter(k=>Object.hasOwn(ex,k)).map(k=>[k,ex[k]]))),
   priority_muscles:source.priority_muscles??[],
   /* THE CORRESPONDENCE, RECORDED. Which setup lift each file lift answers for,
      by normalised name, is part of what was admitted and therefore part of the
      programme digest at :325. */
   lift_correspondence:correspondence(source.exercises,scratch.exercises)};
 }
 // `prefixAnswer` is the athlete's own answer to the review's identity question
 // and nothing else. It is a value, never a default: an undefined one is a
 // question he has not answered, and F3 treats it as such.
 function replay(held,prefixAnswer){
  const g=held.generation,c=g.collections,ops=c.ops,rows=Object.values(ops).sort((a,b)=>a.device_seq-b.device_seq),issues=[],families=[];
  /* `detail` is the field and, where the field is per lift, the lift id, from
     the CLOSED vocabulary of P3-PORT-FIX-SPEC 3.1. Additive: every existing
     call site keeps its meaning, and an issue either carries a field from that
     table or carries none at all. */
  const issue=(code,id,detail)=>{issues.push({code,...(id?{op_id:id}:{}),...(detail||{})});};
  if(held.raw.local_json!==null&&held.raw.local_json!==held.raw.source_json&&Object.keys(held.material.checkpoint.generation.collections.ops||{}).length)fail('LOCAL_SOURCE_COVERAGE_UNKNOWN');
  const engineFor=(day,hour)=>createSourceReplayEngine({engineContext:engineContextAt(held.engineContext,day,hour)});
  const preparationEngine=createSourceReplayEngine({engineContext:held.engineContext});let prep;
  try{prep=core.createImportPreparation({engine:preparationEngine,parseStrictJson}).prepare(held.material.sourceBytes,held.material.localBytes===null?{}:{localBytes:held.material.localBytes});}
  catch(error){try{preparationEngine.dataLossGuard({},{});}catch(dependency){if(['SOURCE_ENGINE_DEPENDENCY_REQUIRED','SOURCE_ENGINE_CONTEXT_UNPROVEN'].includes(dependency.code))throw dependency;}throw error;}
  if(platform.text(prep.candidateBytes())!==held.raw.candidate_json)fail('SOURCE_PREPARATION_REPRODUCTION_MISMATCH');
  let state=prep.candidateState(),programmeBasis;
  for(const op of rows){const eff=op.effective,match=/^([+-])(0\d|1[0-4]):([0-5]\d)$/.exec(eff?.utc_offset||'');try{
   if(!validDay(eff?.local_date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(eff?.local_time||'')||!match)throw Error();
   const clock=sourceEngineContext(engineContextAt(held.engineContext,eff.local_date,Number(eff.local_time.slice(0,2)))).clock;
   const supplied=(match[1]==='+'?-1:1)*(Number(match[2])*60+Number(match[3]));
   if(new Date(clock.nowMs()).getTimezoneOffset()!==supplied)throw Error();
  }catch{issue('LOCAL_SOURCE_CONTEXT_UNRESOLVED',op.op_id);}}
  /* ONE CLOCK PER FILE (P3-PORT-FIX-SPEC 1.2, B-A). `currentDay()` is a LIVE
     function on the shipped page (import-screen.mjs:343, `asOf: () => day()`),
     so two reads inside one replay can straddle a local midnight. It is read
     ONCE here and passed in, so every period of one file is bounded against
     one day. */
  /* THE PHONE'S OWN DOCUMENT, per lift, for the capture provenance check below
     (P3-PORT-FIX-2, DECISIONS:509 Q1). Read out of programme() rather than off
     `state`, because `state` is the FILE's. */
  const documentSets=new Map();
  const documentProgramme={state:null};
  /* P3-REAL-SHAPE 2.5. THE DOCUMENT LIFT ID A CAPTURE NAMES -> THE FILE LIFT ID
     IT ANSWERS FOR, or null where the normalised name matched zero or several
     file lifts. Read by the capture block and by the re-key below; it is the
     correspondence admission itself recorded, never a second rule. */
  const liftAttach=id=>programmeBasis?.lift_correspondence?.[id]??null;
  try{programmeBasis=programme(state,ops,{today:currentDay(),documentSets,documentProgramme});}
  catch(e){issue(e.code,null,detailOf(e));}
  /* P3-REAL-SHAPE 2.4 (DECISIONS:520 option A). A FILE WITH NO NAME TAKES HIS.
     The old app has no athlete_label anywhere, and local-source-basis.mjs:54
     will not adopt a state whose label is not this installation's - which is
     why a fully admitted real-shape import left the Train screen on the setup
     numbers with nothing on screen to read (measured, spec row 5). The owner's
     identity Yes is the guard (DECISIONS:472 (a)) and P-LABEL in programme()
     has already refused a file that names someone else, so the only case left
     here is a file that names nobody. Written onto the REPLAYED state, which is
     not a digest input (Q hashes operations, interpretation, programme, order
     map and engine; `state` rides in the view).
     THE CANDIDATE STATE IS NOT FROZEN: m4/import/replay-core.cjs:87 hands back
     `() => copy(candidate)`, a fresh structuredClone per call, so this
     assignment cannot throw in a strict-mode module (review R1 N5, measured
     rather than assumed). */
  if(programmeBasis&&!Object.hasOwn(state,'athlete_label')){
   const setupOp=ops[programmeBasis.op_id];
   state.athlete_label=setupOp.payload.setup.athlete_label;
  }
  /* AND NOTHING OF HIS IS LOST (2.4/2.5 case 2, ruled after review R1 B5).
     EVERY document lift with no unique correspondent is appended to the
     admitted state as an INACTIVE lift, whether or not a recorded session names
     it, and tombstoned under the old app's own `retirements` member. The
     appended object is the DOCUMENT CONSTRUCTOR'S OWN (documentProgramme.state,
     built by createCleanInitState at the head of programme()), so it is valid
     by construction and no member is invented here. It is NOT added to
     `state.exOrder`: a retired lift leaves the day's pool by `exActive`
     (engine/plan.cjs:87-95, no date comparison at all), so the gym card is
     unchanged.
     THE UNCONDITIONAL FORM IS THE RULE. Scoping it to the lifts a recorded
     session names would leave the ordinary case - he typed sixteen lifts, the
     file holds fifteen, and he had not yet trained the sixteenth - with a
     permanent PLAN_EDIT_ORIGIN_UNPROVEN in Edit My Week: the exact failure this
     ticket exists to remove, moved from admission to the companion.
     ORDERING IS LOAD-BEARING. Both writes happen immediately after programme()
     returns and BEFORE any family is replayed, so the capture block below and
     every later reader see ONE state. */
  if(programmeBasis&&documentProgramme.state){
   const held=new Set(state.exercises.map(e=>e.id));
   for(const row of documentProgramme.state.exercises){
    // Corresponded, or already in the file's own list under this very id:
    // either way the lift is there and nothing is appended for it.
    if(programmeBasis.lift_correspondence?.[row.id]||held.has(row.id))continue;
    state.exercises=[...state.exercises,{...row}];
    state.retirements={...(state.retirements||{}),[row.id]:currentDay()};
   }
  }
  /* A-LEGACY-VECTOR, THE ADMISSION INVARIANT (NATIVE-LOAD-SPEC R9.13 (iv); owner approval DECISIONS:819, "Spread it evenly").
     A pending legacy scalar debut or unlock on a lift that stores per-set weights is admitted with the shifted per-set vector
     (legacyVectorAdmission, at the foot of this module). ORDERING, as above: on the replayed state, after the document-lift
     append and BEFORE any family reads it, so every later reader sees ONE state. The replayed state is not a digest input (Q
     hashes operations, interpretation, programme, order map and engine; programme() ran above, before this), so the source
     and checkpoint digests and the programme basis are the same with or without it. An entry it cannot spread evenly (open
     question N-Q1) is left as it was; its day refuses as before and nothing is raised. */
  legacyVectorAdmission(state);
  const facts=reading({operations:ops,dispositions:c.dispositions||{},receipts:c.receipts||{},frontier:c.sync.frontier,outbox:c.outbox,rejected:c.rejected||{}});
  const days=new Set((state.reads||[]).map(r=>r.d)),nativeReads=facts.records.filter(r=>r.original.kind==='fact').sort((a,b)=>a.original.device_seq-b.original.device_seq);
  let last=(state.reads||[]).map(r=>r.d).sort().at(-1)||null;
  for(const row of nativeReads){
   const eff=row.original.effective,hour=Number(eff?.local_time?.slice(0,2));
   if(row.local.state==='unresolved'||!validDay(row.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(eff?.local_time||'')||!/^([+-])(0\d|1[0-4]):[0-5]\d$/.test(eff?.utc_offset||'')||days.has(row.date)||last&&row.date<=last||row.date>currentDay()||row.date<sourceEngineContext(held.engineContext).mapping.gate.clock){issue('LOCAL_SOURCE_READING_UNRESOLVED',row.op_id);continue;}
   days.add(row.date);last=row.date;
   if(row.local.state==='included')try{state=engineFor(row.date,hour).applyRead(state,row.date,row.local.quantity.value,{hour});if(state.reads.filter(r=>r.d===row.date&&r.w===row.local.quantity.value).length!==1)throw Error();}catch{issue('LOCAL_SOURCE_READING_UNRESOLVED',row.op_id);}
   families.push({family:'F1',state:row.local.state==='removed'?'retained':'projected',op_id:row.op_id,effect_ids:row.local.effect_ids});
  }
  for(const row of facts.records)if(row.original.kind!=='fact'&&row.local.state==='unresolved')issue('LOCAL_SOURCE_READING_UNRESOLVED',row.op_id);
  const food=[];const checkDates=new Set();const measureRows=[];const sleepRows=[];
  for(const op of rows){
   if(op.class==='reading'||op.class==='session')continue;
   // THE OWNED CLASSES FIRST, so that EVERY record of one gets an answer from
   // its own family: a malformed one is refused by a NAMED code rather than
   // falling to the generic catch-all below. Each family is run once after this
   // loop, because each one's ordering rule is over its whole set.
   if(bodyComposition.owns(op)){measureRows.push(op);continue;}
   if(sleepFamily.owns(op)){sleepRows.push(op);continue;}
   const p=op.payload,day=op.effective?.local_date;
   if(!validDay(day)||day>currentDay()){issue('LOCAL_SOURCE_CONTEXT_UNRESOLVED',op.op_id);continue;}
   if(op.class==='food-day'&&op.schema_version===2&&Food.validate(op,id=>ops[id])){food.push({op_id:op.op_id,date:day,day:copy(p.day)});continue;}
   if(p?.profile===Setup.PROFILE){families.push({family:'F4',state:programmeBasis?'retained':'unresolved',op_id:op.op_id});continue;}
   /* P3-REAL-SHAPE (review R1 BLOCKING 1). THE NOTE'S LIFT ID IS READ THROUGH
      THE CORRESPONDENCE, exactly as the capture block reads a capture's. A
      machine-settings note the owner saved on THIS phone before the import
      names a DOCUMENT lift by the slug slugOf minted; after option A a
      CORRESPONDED document lift is not in the admitted state under that slug at
      all - it was never appended, because the file already carries it under the
      file's own handle - so this guard failed on his own note and the WHOLE
      import refused, with no field for the screen to name (measured, D-RS-R1-b1a).
      The guard is NOT weakened by this: it goes on asking that the lift the note
      names be in the admitted state, through the same correspondence the same
      function already recorded, and a note naming a lift neither side carries
      still refuses (D-RS-R1-b1c). `liftAttach` is null for an UNcorresponded
      document lift, which is appended under its own id and found as before
      (D-RS-R1-b1b), and null for a file-side id, which is found directly. */
   if(op.schema_version===2&&p?.profile===Settings.PROFILE&&Settings.validate(op,id=>ops[id])&&state.exercises.some(e=>e.id===(liftAttach(p.machine.exercise_id)??p.machine.exercise_id))){families.push({family:'F4',state:'retained',op_id:op.op_id});continue;}
   if(op.schema_version===2&&p?.profile===CheckIn.PROFILE&&CheckIn.validate(op,id=>ops[id])&&!checkDates.has(day)){checkDates.add(day);families.push({family:'F5',state:'retained',op_id:op.op_id});continue;}
   issue(op.class==='food-day'||op.class==='steps'?'LOCAL_SOURCE_DAILY_UNRESOLVED':op.class==='plan'?'LOCAL_SOURCE_EFFECT_UNMAPPED':'LOCAL_SOURCE_CONTEXT_UNRESOLVED',op.op_id);
  }
  // F7, THE MEASURE FAMILY (P3-REPLAY-MEASURE-FAMILY). These are athlete-local
  // records with no engine context of their own - a trial start, a dated waist
  // reading, a marker pick - so they are RETAINED and never projected: no
  // engine call, no state member and no programme answer comes from them, and
  // the baseline window stays the one derived from the import. The family
  // accounts for every record of its class, so none can be silently dropped.
  const measured=bodyComposition.replay(measureRows,{readOperation:id=>ops[id],asOf:currentDay()});
  for(const row of measured.issues)issue(row.code,row.op_id);
  for(const row of measured.families)families.push(row);
  // F8, THE SLEEP FAMILY (P3-REPLAY-ALL-FAMILIES). A night is an ATHLETE
  // RECORD, not session or programme evidence: it is RETAINED and never
  // projected, no engine call is made for it, nothing is written into
  // state.sleep.nights, and a night dated before the import's last day is
  // therefore neither contradicted by the imported history nor absorbed into
  // it. The family accounts for every record of its class, so none can be
  // silently dropped.
  const slept=sleepFamily.replay(sleepRows,{readOperation:id=>ops[id],asOf:currentDay()});
  for(const row of slept.issues)issue(row.code,row.op_id);
  for(const row of slept.families)families.push(row);
  const winners=FoodModel.winningRows(food);
  for(const row of winners){if(Object.keys(state.dailyLogs?.[row.date]||{}).some(k=>['cal','pro'].includes(k))){issue('LOCAL_SOURCE_DAILY_UNRESOLVED',row.op_id);continue;}
   const projected=FoodModel.foodProjection(state,[row],engineFor(row.date,12));if(projected.unavailable.length)issue('LOCAL_SOURCE_DAILY_UNRESOLVED',row.op_id);else state=projected.state;
   families.push({family:'F2',state:projected.unavailable.length?'retained':'projected',op_id:row.op_id});}
  for(const row of food)if(!winners.includes(row))families.push({family:'F2',state:'retained',op_id:row.op_id});
  // F3 READS THE PAGE'S OWN CAPTURES (local-capture-start-resume). The shipped
  // page prescribes through the SOURCE-AWARE capture profile: today-bindings.mjs
  // builds Capture.SOURCE_PROFILE with the w5 source codec, so every Start the
  // gym card writes carries a source_basis. This module used to install the v1
  // reader, which cannot read one: stored-history.mjs caught the throw as
  // ORIGINAL_CAPTURE_UNINTERPRETABLE, project-history.mjs carried that onto the
  // start record's issues, and engine-order.cjs then refused the whole order
  // WORKOUT_ORDER_START_INTERPRETATION_REQUIRED - which admission reported as
  // LOCAL_SOURCE_WORKOUT_UNRESOLVED. That is why a workout recorded BEFORE the
  // import could not be admitted at all (P3-REPLAY-ALL-FAMILIES, RV-INNER-CAUSE).
  // read() is a CLOSED historical dispatch, so the source-aware reader still
  // reads a v1 capture exactly as before; nothing is relaxed by installing it.
  const captures=Capture.createPrescriptionCapture({parseStrictJson,profile:Capture.SOURCE_PROFILE,sourceCodec:SourceCodec});let workoutFacts=null;
  // The adapter below only READS a layout, but the source-aware adapter refuses
  // to exist without a registered projection consumer. This is the accepted one
  // the page itself composes (today-bindings.mjs), not a stub: the NULL lane,
  // which is the only lane this installation has.
  const projectionReader=SourceProjection.createSourceProjectionReader({nullSelection:SourceProjection.createNullSelectionRegistrar({sourceCodec:SourceCodec})});
  /* THE START INTERPRETATION engine-order.cjs ASKS FOR: local-capture-start-resume.
     The law is a question about ORDER, and the athlete is the only one who can
     answer it. He answers it once, at :80: "Did every workout in this file
     happen before this first Earned workout, with none already recorded in
     Earned?" A Yes STATES the interpretation exactly - the imported file is the
     complete prefix, and the first Earned workout is the first workout after
     it - so it is carried here and applied to the Starts this installation
     already holds. Nothing else may supply it: an absent or No answer leaves
     the pre-import Start uninterpreted and F3 refuses by its own name, as it
     does today. The Yes also has to be TRUE of the records in hand, and that is
     checked rather than assumed: every native Start must be dated strictly
     after the file's last recorded workout day, because a Start on or before it
     is a workout the file does not precede. The trial day one is untouched (F7
     keeps the first enrolled record's date) and the imported history stays the
     baseline; what this states is only where the native Starts sit. */
  const legacyDays=Object.keys(state.sessionLog||{}).sort(),lastLegacyDay=legacyDays.at(-1)??null;
  const nativeStarts=rows.filter(op=>op.class==='session'&&op.kind==='session-start');
  const resumeRequired=legacyDays.length>0&&nativeStarts.length>0;
  let resumeStated=!resumeRequired;
  if(resumeRequired&&prefixAnswer!==true)issue('LOCAL_SOURCE_WORKOUT_UNRESOLVED');
  else if(resumeRequired){
   resumeStated=true;
   for(const op of nativeStarts)if(!validDay(op.effective?.local_date)||op.effective.local_date<=lastLegacyDay){
    issue('LOCAL_SOURCE_WORKOUT_UNRESOLVED',op.op_id);resumeStated=false;}
  }
  if(rows.some(op=>op.class==='session')&&resumeStated)try{
   const history=storedWorkoutHistory(g,{athleteId,deviceId,prescriptionCapture:captures}),runtime=Runtime.createEngineRuntime({clock:sourceEngineContext(held.engineContext).clock});
   const projector=History.createEngineHistoryProjector({athleteId,deviceId,projectWorkoutRecords,parseStrictJson,prescriptionCapture:captures,resolveCapturedLayout:({start})=>{
    const producer=start.prescription_capture.producer;if(![EngineCapture.PROFILE,EngineCapture.CONFIGURATION_PROFILE].includes(producer.rule_profile))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_producer'});
    const adapter=EngineCapture.createEngineWorkoutCapture({engine:runtime,prescriptionCapture:captures,producerIdentity:producer,sourceProjectionReader:projectionReader});
    const layout=adapter.readLayout(start.prescription_capture),counts=new Map();
    /* P3-REAL-SHAPE 2.5. A workout he recorded on this phone BEFORE the import
       was prescribed from the SETUP DOCUMENT, so every slot in it names a setup
       lift by its slug id. Once the file's own lifts are adopted the admitted
       state carries the file's handles, and this check refused `capture_lift`,
       naming the athlete's own lift back at him (measured, spec row 7).
       `liftAttach` is programmeBasis.lift_correspondence: the DOCUMENT lift id
       the capture names -> the FILE lift id it answers for, or null where the
       name matched zero or several file lifts. A slot with no correspondent keeps its
       own id, and rule 2 above has already appended that setup lift to the
       admitted state as a retired lift, so the check is total and its refusal
       now means a corrupt capture and nothing else. */
    for(const slot of layout.slots){
     const target=liftAttach(slot.lift_lineage_id)??slot.lift_lineage_id;
     if(state.exercises.filter(e=>e.id===target).length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_lift',exercise_id:slot.lift_lineage_id});
     // COUNTED UNDER THE DOCUMENT'S OWN ID, before the re-key: capture_sets and
     // capture_membership below both ask the DOCUMENT, and the document knows
     // this capture only by the id it prescribed under.
     counts.set(slot.lift_lineage_id,(counts.get(slot.lift_lineage_id)||0)+1);
    }
    /* CAPTURE PROVENANCE (P3-PORT-FIX-2, DECISIONS:509 Q1, option b).
       WHAT THIS CHECK VERIFIES. Not that the athlete's recorded workout agrees
       with the programme being admitted - it cannot, and it was never asked to.
       It verifies PROVENANCE: that this capture was prescribed by a programme
       that actually existed on this phone, so its slot count is a real
       prescription and not a fabricated or corrupted layout. A capture is
       evidence of what he performed, and evidence has to come from somewhere.

       WHY THE DOCUMENT IS THE RIGHT-HAND SIDE AFTER P3-PORT-FIX. The capture
       was written by the gym card before the import, and the card prescribed
       from the phone's own first-run DOCUMENT, so the document's set count for
       that lift IS the number of slots it wrote. Until P3-PORT-FIX the file's
       count had to equal the document's anyway, so `state` and the document
       were the same number and the check could read either. P3-PORT-FIX made
       `state` the FILE's, and reading `state` then asked the capture to match a
       programme that did not exist when it was written - which is why a phone
       that recorded one Earned workout before importing refused its owner's own
       history (D-PF-f1, the PM's Q1). The document is the programme that
       PRODUCED the capture; admission has already proved, at :180-215 above,
       that this same document is the same SHAPE as the file (the week, the lift
       ids, each lift's day and muscle group, the count), so the two sides of
       this check are the same list of lifts. The projected session then rides
       into the admitted state AS RECORDED: nothing here rebases it.

       WHAT STILL REFUSES. A capture whose slot count for a lift matches NEITHER
       the document nor the file: no programme in the story wrote it, and that is
       exactly the corruption this check exists for (D-PF-f5). A lift the
       DOCUMENT does not carry: `documentSets.get(id)` is undefined and no count
       equals it, so the capture refuses; that can only happen when programme()
       itself already refused (it is filled before any of its comparisons), and
       its own issue stands beside this one. The other three inner checks are
       untouched: capture_producer above, capture_lift above - which still reads
       `state`, because a lift the ADMITTED state does not carry is a different
       fault - and capture_membership below.

       PROVENANCE HERE IS PROVED BY SHAPE, NOT BY A SIGNATURE (recorded after
       independent review R1, NOTE 3). The capture is read out of THIS phone's
       own stored history, and on top of that it must agree with the document on
       every count, with the engine's own membership reader on the whole day's
       pool and order, and with one of the two engine producer profiles. Nothing
       here is a cryptographic signature over the capture, so a fabricated one
       that agrees with all of that is still admitted - as it was before this
       change, which widened nothing on that side. Whoever later reads the word
       "provenance" in this comment should read it as "it came from a programme
       this phone had", never as "it is authenticated". */
    for(const [id,count]of counts)if(documentSets.get(id)!==count)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_sets',exercise_id:id});
    // Compare complete programme membership at the ORIGINAL Start day, under
    // the authenticated original Start local date and this source's opaque
    // engineContextAt clock. The engine's own membership reader owns day
    // selection and active-lift order and reads NO sleep, so nothing here
    // invents a night to reproduce a structural target; it proves pool and
    // order only. The independent set-count validation above still stands and
    // historical prescription loads/reps and performed/skip/incomplete facts
    // remain untouched.
    const originalDay=start.effective.local_date,originalClock=sourceEngineContext(engineContextAt(held.engineContext,originalDay,12)).clock;
    /* P3-REAL-SHAPE 2.5 (review R1 B2). THE PROGRAMME THAT PRODUCED THIS
       CAPTURE IS THE DOCUMENT, exactly as it is for capture_sets above.
       `documentProgramme.state` is the state createCleanInitState built from the
       setup document at the head of programme(), and it is filled before any
       comparison there can refuse. The ADMITTED state is no longer the
       right-hand side, for the reason P3-PORT-FIX already gave about
       capture_sets: after option A the state is the FILE's, its `exOrder` is the
       FILE's, and asking a capture to match a pool and an order that did not
       exist when it was written refuses a workout he really did. It is also why
       the retirement date of an appended lift cannot be asked about here:
       `exActive` honours `retirements` with NO date comparison, so a setup lift
       retired on the import day is out of the ADMITTED pool even for a day
       before the import.
       NOTHING IS RELAXED. Pool AND order are compared, exactly and in order,
       against the only programme that can answer for them.
       THE GUARD ORDER IS LOAD-BEARING: sessionMembership returns NULL for any
       day that is not U or L (engine/today.cjs:83-85), so nothing may be read
       off it before it has been tested (review R1 B1), and a pre-import Start on
       a day the document's week calls REST must refuse BY NAME rather than
       throw a TypeError inside replay(). */
    const produced=documentProgramme.state
     ?Runtime.createEngineRuntime({clock:originalClock}).sessionMembership(documentProgramme.state,originalDay)
     :null;
    if(!produced||!['U','L'].includes(produced.day)||
       encode([...counts.keys()])!==encode([...produced.exercise_ids]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_membership'});
    /* THE LAYOUT IS RETURNED UNCHANGED, BYTE FOR BYTE. The re-key does NOT
       happen here and must not: engine-history.cjs:66-68 binds every layout slot
       to the STORED capture's own `lift_lineage_id`, so a layout whose slots had
       been re-addressed would refuse WORKOUT_CAPTURE_LAYOUT_UNPROVEN - the law
       that proves the layout really is this capture's. The re-key is a change of
       ADDRESS applied to the PROJECTED session, below, after that law has run on
       the ids it was written under. */
    return layout;}});
   workoutFacts=projector.project(history,g,{sourceRevision:held.expected.revision});
   /* THE RE-KEY (P3-REAL-SHAPE 2.5 rule 1). For a slot whose setup lift has
      exactly one file lift with the same normalised name, the projected entry
      is RE-KEYED to the FILE's lift id. Nothing about what he performed
      changes: the loads, the reps, the effort and the slot count ride in AS
      RECORDED, which is what P3-PORT-FIX-2 already guarantees and this does not
      touch. It is a change of ADDRESS, not of content, and it is the same move
      the old app itself made for a renamed lift (`renames`, src/app.jsx:544).
      The stored CAPTURE is left exactly as it was written, under the ids the
      document prescribed: it is evidence of what that programme said, and
      rewriting evidence is not what this is. Only the record's entries move, to
      the lift the admitted state actually carries - which capture_lift has
      already proved, one slot at a time, over this very id.
      AND THE SLOT KEY IS DELIBERATELY LEFT WHERE IT WAS (review R1 NOTE 5).
      Each slot also carries `logical_set_slot`, a JSON string that happens to
      hold the lift id the capture was WRITTEN with ("[\"calves\",1]"). It is
      NOT re-keyed: it is the capture's own address for its own set, its only
      reader outside the capture machinery is gym-model.mjs (:87,:353,:511) for
      the LIVE session, and moving it would rewrite the stored evidence this
      paragraph just said it would not rewrite. So a projected entry names the
      FILE's lift and its slot key still encodes the DOCUMENT's slug, on
      purpose; D-RS-R1-n5 pins both halves so the next reader does not assume
      the two agree. */
   if(workoutFacts&&programmeBasis&&Object.keys(programmeBasis.lift_correspondence||{}).length){
    const rekey=s=>({...s,record:{...s.record,
     entries:s.record.entries.map(e=>({...e,lift_lineage_id:liftAttach(e.lift_lineage_id)??e.lift_lineage_id}))}});
    workoutFacts={...workoutFacts,sessions:(workoutFacts.sessions||[]).map(rekey),
     incomplete_sessions:(workoutFacts.incomplete_sessions||[]).map(rekey)};
   }
   if([...workoutFacts.sessions,...workoutFacts.incomplete_sessions].some(s=>s.completion_state==='unresolved'||s.record.entries.some(e=>e.slots.some(x=>x.state==='unresolved'))))issue('LOCAL_SOURCE_WORKOUT_UNRESOLVED');
   families.push({family:'F3',state:'projected',start_ids:workoutFacts.order.start_ids});
  /* THE RENAME FIX (P3-PORT-FIX-SPEC 3.4). This catch used to bind `e` and never
     read it, so all four refusals raised above came out under a code that names
     the wrong thing. Only a code this module itself raises may pass; anything
     else keeps LOCAL_SOURCE_WORKOUT_UNRESOLVED, exactly as today. */
  }catch(e){issue(KNOWN_REPLAY_CODES.has(e?.code)?e.code:'LOCAL_SOURCE_WORKOUT_UNRESOLVED',null,detailOf(e));}
  // Historical decisions remain original state, without turning into new consent.
  families.push({family:'F6',state:'retained',source_fields:['accepted','decisions','feed'].filter(k=>Object.hasOwn(state,k))});
  let calculation=null;try{calculation={trend:state.trend,rate:engineFor(currentDay(),12).currentRate(state)};}catch{issue('LOCAL_SOURCE_CALCULATION_UNRESOLVED');}
  return {state,calculation,facts,workoutFacts,families,issues,programmeBasis,retained:rows.filter(op=>families.some(f=>f.state==='retained'&&f.op_id===op.op_id)).map(op=>copy(op))};
 }
 async function prepareSource(review,{identityConfirmed=false,prefixAnswer}={},internal=null){
  const existingSelection=internal?.selection;
  const held=reviews.get(review);if(!held)fail('LOCAL_SOURCE_REVIEW_UNOWNED');await current(held);
  if(identityConfirmed!==true&&!existingSelection)fail('LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED');
  // The SAME answer reaches F3's start interpretation and the order map, so a
  // reopen or a rollback replays under the very answer its own order map
  // records and nothing is re-asked on his behalf (local-capture-start-resume).
  const answer=existingSelection?existingSelection.order_map?.assertion?.answer:prefixAnswer;
  /* B-LOM. A selection recorded when this installation held NO native Start
     carries no order map (`mixed` below was false), and therefore carries no
     recorded answer to the prefix question either. Re-opening or rolling back to
     it once native workouts DO exist would replay under `undefined`, which is
     neither the athlete's Yes nor anything he can read: the records it would be
     asked to order are records it never saw. That is named here, before any
     replay, and nothing is written. The door reopens when the screen asks the
     question again for a selection that can carry the answer. */
  const nativeNow=Object.values(held.generation.collections.ops||{})
   .some(op=>op?.class==='session'&&op?.kind==='session-start');
  if(existingSelection&&!existingSelection.order_map&&nativeNow&&
    Object.keys(existingSelection.order_input?.legacyLog||{}).length)fail('LOCAL_SOURCE_ORDER_MAP_REQUIRED');
  const replayed=replay(held,answer);if(replayed.issues.length)return freeze({ready:false,pending:true,issues:replayed.issues,families:replayed.families});
  const operations=held.generation.collections.ops,rootInterpretation=Object.fromEntries((replayed.workoutFacts?.sessions||[]).concat(replayed.workoutFacts?.incomplete_sessions||[]).map(s=>[s.start_op_id,{capture:s.capture,record:s.record,completion:s.completion_state}]));
  const orderInput={installation_id:namespace,era_id:held.eraId,athlete_id:athleteId,source_digest:held.sourceDigest,checkpoint_digest:held.checkpointDigest,legacyLog:replayed.state.sessionLog||{},operations,rootInterpretation,display_review:review};
  let M=null;
  const mixed=Object.keys(orderInput.legacyLog).length>0&&Object.values(operations).some(op=>op.class==='session'&&op.kind==='session-start');
  if(mixed){if(existingSelection?.order_map){M=order.restore(existingSelection.order_map,existingSelection.order_input);order.validate(M,orderInput);}else M=order.confirm(order.review(orderInput),{answer:prefixAnswer});}
  const selectionId=internal?.action==='reopen'?existingSelection.id:'local-source:'+digest(platform.hash,'earned/local-source-selection/v1',{name:held.name,material:held.materialDigest,revision:held.expected.revision,token:held.expected.token,order:M,action:internal?.action||'select'});
  const interpretedWorkouts=copy(replayed.workoutFacts);if(interpretedWorkouts)delete interpretedWorkouts.source_revision;
  const interpretation={families:replayed.families,reading:replayed.facts,workout:interpretedWorkouts,collections:Object.fromEntries(Object.entries(held.generation.collections).filter(([k])=>k!=='derived'))};
  const Q=freeze({profile:'earned/local-source-basis/v1',installation_id:namespace,era_id:held.eraId,athlete_id:athleteId,device_id:deviceId,source_digest:held.sourceDigest,material_digest:held.materialDigest,checkpoint_digest:held.checkpointDigest,local_selection_id:selectionId,
   operation_digest:digest(platform.hash,'earned/local-source-operations/v1',operations),interpretation_digest:digest(platform.hash,'earned/local-source-interpretation/v1',interpretation),programme_digest:digest(platform.hash,'earned/local-source-programme/v1',replayed.programmeBasis),order_map_digest:digest(platform.hash,'earned/local-source-order-map/v1',M),engine_digest:sourceEngineContext(held.engineContext).digest,replay_profile:'earned/local-source-replay/v1',as_of:currentDay()});
  await current(held);
  const handle=Object.freeze({profile:'earned/local-source-qualification/v1'}),view=freeze({ready:true,basis:Q,order_map:M,state:replayed.state,calculation:replayed.calculation,workout_baseline:{profile:'earned/imported-engine-history/local-v1',local_source_basis:Q,session_log:replayed.state.sessionLog,
   /* B-LOM. The SAME baseline in the ENGINE's own profile, alongside the local
      one and not in place of it, so the two ids performed.cjs:176 asks for are
      readable from the admitted view instead of being invented downstream.
      Their meaning on a local era, where no activation operation is minted
      (DECISIONS:486 (b)): source_generation_id is this source's content digest
      on this installation - WHICH imported history the baseline is - and
      activation_op_id is the recorded selection id, the act that activated it,
      which metadata.localSources.active names and which the generation itself
      therefore records. Both are Q's own fields, so the three recorded copies of
      Q that local-source-basis.mjs compares bind them.
      This copy is the IDENTITY, not the reference: the engine also requires
      session_log to be the same OBJECT as the state's, and copy(view) into the
      generation cannot carry an object identity. The reference-bearing baseline
      is built where the state and the facts finally meet, at the engine seam in
      today-bindings.mjs, from these same two ids. Nor is order.import_anchor
      attached to workout_facts here: the projector above ran WITHOUT an import
      anchor, so writing one on would claim an order law that nobody ran. The
      page runs that law itself, with this anchor, on every read. */
   engine_baseline:{profile:'earned/imported-engine-history/v1',source_generation_id:Q.source_digest,
    activation_op_id:selectionId,session_log:replayed.state.sessionLog}},workout_facts:replayed.workoutFacts,families:replayed.families,retained:replayed.retained,/* P2 S3 IMPORT JOIN: 'today-gym-consumers' is no longer pending. An admitted
    import is adopted as the athlete's own basis by the P0-B chain, through
    rebuild/m3/w7-preview/today/local-source-basis.mjs, and proved on Today and
    on the gym card by the cells in today/test/local-source-consumer.test.mjs.
    'local-capture-start-resume' is no longer pending either: the start
    interpretation engine-order.cjs asks for is stated above from the athlete's
    own answer to the identity question, so a workout recorded on this device
    BEFORE the import is admitted and projected after the imported prefix. An
    absent or No answer, or a native Start the file does not precede, still
    refuses LOCAL_SOURCE_WORKOUT_UNRESOLVED and writes nothing. The list is
    empty because nothing is pending, not because the list was retired. */
   integration_pending:[]});
  const selection=internal?.action==='reopen'?copy(existingSelection):{id:selectionId,name:held.name,basis:Q,order_map:M,order_input:existingSelection?.order_input||orderInput,identity_review:existingSelection?.identity_review||review,previous:held.generation.metadata.localSources?.active??null,action:internal?.action||'select'};
  const next=copy(held.generation);next.metadata.localSources=next.metadata.localSources||{selections:{},active:null};
  if(next.metadata.localSources.selections[selectionId]&&encode(next.metadata.localSources.selections[selectionId])!==encode(selection))fail('LOCAL_SOURCE_SELECTION_CONFLICT');
  next.metadata.localSources.selections[selectionId]=copy(selection);next.metadata.localSources.active=selectionId;
  next.metadata.imports=next.metadata.imports.map(e=>e.name===held.name?{...e,rebaseRequired:false,localSourceSelectionId:selectionId}:e);
  next.collections.derived=next.collections.derived||{};next.collections.derived.localSource={basis:copy(Q),view:copy(view)};
  next.metadata.localSourceApplication={selection_id:selectionId,source_digest:Q.source_digest,input_revision:held.expected.revision,input_token:held.expected.token,committed_revision:held.expected.revision+1,basis:copy(Q),core_complete:true,s3_complete:false};
  const capability=Object.freeze({guard:()=>syncGuard(held.stamp),assertCurrent:()=>current(held),publish:()=>repository.commit(held.expected,next,()=>syncGuard(held.stamp)),reconcile:async()=>{
   const loaded=await checked(held,()=>repository.load()),marker=loaded.generation.metadata.localSourceApplication;
   if(marker?.selection_id!==selectionId||marker.committed_revision!==loaded.revision||encode(marker.basis)!==encode(Q))fail('LOCAL_SOURCE_COMMIT_UNPROVEN');
   return reopen(held.name);
  }});
  qualifications.set(handle,{controller:api,held,view,commitCapability:capability});return handle;
 }
 async function reopen(name){const review=await reviewSource(name),held=reviews.get(review),id=held.generation.metadata.localSources?.active,selection=held.generation.metadata.localSources?.selections?.[id];if(!selection||selection.name!==name||selection.identity_review.material_digest!==review.material_digest)fail('LOCAL_SOURCE_REOPEN_UNPROVEN');return prepareSource(review,{}, {selection,action:'reopen'});}
 async function rollback(selectionId){const at={stamp:stamp()},state=await checked(at,()=>repository.load()),selected=state.generation.metadata.localSources?.selections?.[selectionId];if(!selected)fail('LOCAL_SOURCE_ROLLBACK_UNPROVEN');const review=await checked(at,()=>reviewSource(selected.name)),held=reviews.get(review);if(held.expected.revision!==state.revision||held.expected.token!==state.token)fail('LOCAL_SOURCE_STALE');return prepareSource(review,{}, {selection:selected,action:'rollback'});}
 const api=Object.freeze({reviewSource,prepareSource:(review,answers)=>prepareSource(review,answers),reopen,rollback,assertCurrent:handle=>{assertLocalSourceQualification(handle);const q=qualifications.get(handle);if(q.controller!==api)fail('LOCAL_SOURCE_QUALIFICATION_UNOWNED');return current(q.held);},view:async handle=>{assertLocalSourceQualification(handle);const q=qualifications.get(handle);if(q.controller!==api)fail('LOCAL_SOURCE_QUALIFICATION_UNOWNED');await current(q.held);return q.view;},invalidate(){epoch++;},close(){closed=true;epoch++;}});
 return api;
}
/* A-LEGACY-VECTOR BEGIN (NATIVE-LOAD-SPEC R9.13 (iv), an ADMISSION INVARIANT; owner approval DECISIONS:819: "If found, spread
   that pending increase evenly or skip it?" = "Spread it evenly (Recommended)"). The ONE write: a LEGACY SCALAR STRUCTURAL ENTRY
   (a queue item not done, not PROPOSED, kind debut or unlock, no native_load_spend string, a finite numeric newW and no
   newWSets: the entry engine-capture.cjs:82-83 refuses over a per-set-weight lift) on a lift whose wSets is an array, under
   PRECONDITION P (w a finite number and every wSets element a finite number <= w), gets newWSets = wSets.map(x => x + (newW - w)):
   the earn.cjs:88 shape (also :63, :97), so no set is above the old app's own card newW and the trailing sets stay equal or lower.
   Nothing else is written: newW, state, t, every other entry, w and wSets are unchanged. An entry that fails P is left unconverted
   and returned by name (open question N-Q1). A converted entry carries newWSets and is never converted again (idempotent).
   Dependency-free on purpose: the NATIVE-LOAD walk (rebuild/m4/spec/native-load-options.test.cjs) evaluates these exact bytes,
   read between the two markers, because this module's own graph reaches a protected engine file. */
export function legacyVectorAdmission(state){
 const exercises=Array.isArray(state&&state.exercises)?state.exercises:[],queue=Array.isArray(state&&state.queue)?state.queue:[],named=[];
 for(const q of queue){
  if(!q||typeof q!=='object'||q.done||q.state==='PROPOSED'||(q.kind!=='debut'&&q.kind!=='unlock')||typeof q.native_load_spend==='string'||
   typeof q.newW!=='number'||!Number.isFinite(q.newW)||q.newWSets!==undefined)continue;
  const ex=exercises.find(x=>x&&x.id===q.exId);
  if(!ex||!Array.isArray(ex.wSets))continue;
  if(typeof ex.w!=='number'||!Number.isFinite(ex.w)||!ex.wSets.every(x=>typeof x==='number'&&Number.isFinite(x)&&x<=ex.w)){
   named.push({exId:q.exId,kind:q.kind,newW:q.newW,w:ex.w===undefined?null:ex.w,wSets:ex.wSets.slice()});continue;}
  q.newWSets=ex.wSets.map(x=>x+(q.newW-ex.w));
 }
 return named;
}
/* A-LEGACY-VECTOR END */
