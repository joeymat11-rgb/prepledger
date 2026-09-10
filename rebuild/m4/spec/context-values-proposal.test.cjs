'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const C=require('./context-values-proposal.cjs'),V=require('../workout/edit-values.cjs');
const Ops=require('../../client/ops.cjs'),Authority=require('../../authority/validate.cjs');
const effective={local_date:'2026-09-10',local_time:'08:30',utc_offset:'-04:00'},hours={value:7.5,unit:'h'};
const make=(cls,payload,version=2)=>Ops.build({op_id:'context-synthetic',athlete_id:'synthetic-athlete',device_id:'synthetic-device',
 device_seq:1,parents:[],kind:'fact',class:cls,schema_version:version,lease_id:'synthetic-unissued',
 effective,payload},'public-synthetic-identity');
const sleep=(payload={hours,quality:'good'})=>make('sleep',{night_start_date:'2026-09-09',...payload});
const values=op=>C.decode(op).current;
const fails=(action,code)=>assert.throws(action,e=>e.code===code);

test('approved independent sleep observations preserve zero, hours-only and quality-only',()=>{
 for(const p of [{hours},{quality:'poor'},{hours:{value:0,unit:'h'}},{hours,quality:'okay'}]){
  const op=sleep(p),current=values(op);
  assert.deepEqual(Object.keys(current).sort(),[...Object.keys(p),'effective','night_start_date'].sort());
  const legacy=C.legacyCorrespondence('sleep',current);
  assert.deepEqual(legacy.candidate,p.hours?{d:'2026-09-09',h:p.hours.value}:null);
  assert.equal(legacy.policy,'unqualified');assert.equal(legacy.installed,false);
 }
 fails(()=>values(sleep({})),'CONTEXT_SLEEP_OBSERVATION_REQUIRED');
});
test('actual existing authority still requires hours; candidate never changes v1 validity or bytes',()=>{
 const old=make('sleep',{hours,quality:'good'},1),bytes=JSON.stringify(old),commitment=old.canonical_content_commitment;
 assert.equal(Authority.validShape(old),true);
 const untouched=C.decode(old);assert.equal(untouched.state,'uninterpreted');assert.equal(untouched.current,null);
 assert.equal(Authority.validShape(make('sleep',{quality:'good'},1)),false);
 assert.equal(Authority.validShape(sleep({quality:'good'})),false);
 assert.equal(JSON.stringify(old),bytes);assert.equal(Ops.commitmentOf(old,'public-synthetic-identity'),commitment);
});
test('all-cleared current sleep remains history, not zero, denial, valid empty original or corruption',()=>{
 const op=sleep(),bytes=JSON.stringify(op),start=values(op);
 const noHours=C.patch('sleep',start,{hours:{clear:true}});
 assert(!Object.hasOwn(noHours,'hours'));assert.equal(noHours.quality,'good');
 const empty=C.patch('sleep',noHours,{quality:{clear:true}});
 assert.deepEqual(empty,{night_start_date:'2026-09-09',effective});
 assert.equal(C.atDate('sleep',empty,'2026-09-10').relation,'no-current-observation');
 assert.equal(C.legacyCorrespondence('sleep',empty).candidate,null);
 assert.deepEqual(C.patch('sleep',empty,{hours:{value:0,unit:'h'}}).hours,{value:0,unit:'h'});
 assert.equal(JSON.stringify(op),bytes);assert.deepEqual(values(op),start);
});
test('complete effective correction does not move the separately reported night',()=>{
 const op=sleep(),before=values(op);
 const changed=C.patch('sleep',before,{effective:{local_date:'2026-09-12',local_time:'22:00',utc_offset:'+09:00'}});
 assert.equal(C.atDate('sleep',changed,'2026-09-10').relation,'reported-night');
 assert.equal(C.atDate('sleep',changed,'2026-09-13').relation,'outside');
 const corrected=C.patch('sleep',changed,{night_start_date:'2026-09-10'});
 assert.equal(C.atDate('sleep',corrected,'2026-09-11').relation,'reported-night');
 assert.equal(op.effective.local_date,'2026-09-10');
 fails(()=>C.patch('sleep',before,{effective:{local_date:'2026-09-12'}}),'CONTEXT_EFFECTIVE');
 assert.equal(V.effective(changed.effective),true);
});
test('calendar labels do not become elapsed hours across leap day, year boundary or DST',()=>{
 const cases=[['2024-02-28','2024-02-29'],['2024-02-29','2024-03-01'],['2026-12-31','2027-01-01'],
  ['2026-03-08','2026-03-09'],['2026-11-01','2026-11-02']];
 for(const [a,b]of cases)assert.equal(C.nextDate(a),b);
 for(const d of ['2026-02-29','2026-04-31','2026-9-09','2026-09-09T00:00:00Z'])assert.equal(C.date(d),false);
 const script='const c=require('+JSON.stringify(require.resolve('./context-values-proposal.cjs'))+');process.stdout.write(JSON.stringify('+JSON.stringify(cases)+'.map(x=>c.nextDate(x[0]))))';
 for(const TZ of ['UTC','America/New_York','Pacific/Auckland']){
  const child=spawnSync(process.execPath,['-e',script],{env:{...process.env,TZ},encoding:'utf8'});
  assert.equal(child.status,0,child.stderr);assert.deepEqual(JSON.parse(child.stdout),cases.map(x=>x[1]));
 }
});
test('sleep invalid values cannot be silently coerced or mapped to the approved quality scale',()=>{
 for(const p of [{hours:null},{hours:{value:'7',unit:'h'}},{hours:{value:-0,unit:'h'}},{hours:{value:25,unit:'h'}},
  {hours:{value:7,unit:'hours'}},{quality:3},{quality:'Good'},{quality:null},{quality:{clear:true}}]){
  fails(()=>values(sleep(p)),Object.hasOwn(p,'hours')?'CONTEXT_HOURS':'CONTEXT_QUALITY');
 }
 fails(()=>C.patch('sleep',values(sleep()),{night_start_date:{clear:true}}),'CONTEXT_CLEAR_REQUIRED');
 fails(()=>C.patch('sleep',values(sleep()),{quality:{clear:true,extra:true}}),'CONTEXT_QUALITY');
});
test('date-only reported interval is inclusive with no invented legacy event halo',()=>{
 const current=values(make('event',{type:'NO_EXERCISE_ATTESTATION',interval:{start:'2026-09-09',end:'2026-09-10'}}));
 assert.deepEqual(['2026-09-08','2026-09-09','2026-09-10','2026-09-11','2026-09-12'].map(d=>C.atDate('event',current,d).relation),
  ['outside','within-reported-dates','within-reported-dates','outside','outside']);
 assert.deepEqual(C.legacyCorrespondence('event',current),{candidate:null,unmapped:['event'],policy:'unqualified',installed:false});
 assert.equal(current.type,'NO_EXERCISE_ATTESTATION');
 fails(()=>values(make('event',{type:'x',interval:{start:'2026-09-10',end:'2026-09-09'}})),'CONTEXT_INTERVAL_END');
 fails(()=>values(make('event',{type:'x',interval:{start:'2026-09-09'}})),'CONTEXT_INTERVAL_END_REQUIRED');
});
test('open illness has unresolved end; closing, reopening and effective edits preserve factual distinctions',()=>{
 const op=make('illness',{interval:{start:'2026-09-08'},note:'synthetic reported context'}),original=values(op);
 assert.equal(C.atDate('illness',original,'2026-09-07').relation,'outside');
 assert.equal(C.atDate('illness',original,'2026-09-30').relation,'end-unresolved');
 const closed=C.patch('illness',original,{interval:{start:'2026-09-08',end:'2026-09-09'},note:{clear:true}});
 assert(!Object.hasOwn(closed,'note'));assert.equal(C.atDate('illness',closed,'2026-09-10').relation,'outside');
 const reopened=C.patch('illness',closed,{interval:{start:'2026-09-08'}});
 assert.equal(C.atDate('illness',reopened,'2026-09-10').relation,'end-unresolved');
 assert.deepEqual(op.payload.interval,{start:'2026-09-08'});
});
test('pain interval can gain an end only in a derived targeted edit, never in an original',()=>{
 const op=make('pain-attestation',{scope:'open-interval',interval:{start:'2026-09-08'}}),before=values(op);
 const current=C.patch('pain-attestation',before,{interval:{start:'2026-09-08',end:'2026-09-09'}});
 assert.equal(C.atDate('pain-attestation',current,'2026-09-10').relation,'outside');
 assert.equal(C.atDate('pain-attestation',before,'2026-09-10').relation,'end-unresolved');
 fails(()=>values(make('pain-attestation',{scope:'open-interval',interval:{start:'2026-09-08',end:'2026-09-09'}})),'PAIN_CLOSE_REQUIRES_TARGETED_EDIT');
});
test('session-only pain requires actual same-athlete Start; time edits cannot reassign scope or identity',()=>{
 const op=make('pain-attestation',{scope:'session-only',session_start_op_id:'actual-start'}),current=values(op);
 const start={op_id:'actual-start',athlete_id:op.athlete_id,class:'session',kind:'session-start'};
 assert.deepEqual(C.references(op.class,current),['actual-start']);
 assert.equal(C.validateReferences(op,current,id=>id==='actual-start'?start:null),true);
 for(const invalid of [null,{...start,athlete_id:'different'},{...start,kind:'session-close'},{...start,op_id:'other'}])
  fails(()=>C.validateReferences(op,current,()=>invalid),'CONTEXT_START_RELATION');
 assert.equal(C.atDate(op.class,current,'2026-09-10').relation,'session-unresolved');
 assert.equal(C.atDate(op.class,current,'2026-09-10',{sessionStartId:'actual-start'}).relation,'reported-session');
 assert.equal(C.atDate(op.class,current,'2026-09-10',{sessionStartId:'other'}).relation,'outside');
 fails(()=>C.patch(op.class,current,{session_start_op_id:'other'}),'CONTEXT_PATCH_FIELD');
 fails(()=>C.patch(op.class,current,{scope:'open-interval'}),'CONTEXT_PATCH_FIELD');
});
test('reserved source strings cannot disappear into physiological coverage recognition',()=>{
 for(const type of ['source-import-intent','source-rollback-intent']){
  const op=make('event',{type,interval:{start:'2026-09-09',end:'2026-09-09'}});
  fails(()=>values(op),'SOURCE_CONTROL_REQUIRES_BOUND_PROFILE');
 }
 const arbitrary=values(make('event',{type:'unregistered-physiological-type',interval:{start:'2026-09-09',end:'2026-09-09'}}));
 assert.equal(C.atDate('event',arbitrary,'2026-09-09').policy,'unqualified');
 assert.equal(C.legacyCorrespondence('event',arbitrary).candidate,null);
});
test('historical unknown shapes stay original evidence and future versions refuse',()=>{
 const old=make('sleep',{hours:{value:8,unit:'historical-unit'},quality:{clear:true}},1),raw=JSON.stringify(old);
 assert.deepEqual(C.decode(old),{state:'uninterpreted',original:old,current:null,issues:['LEGACY_CONTEXT_UNQUALIFIED']});
 assert.equal(JSON.stringify(old),raw);
 fails(()=>values(make('sleep',{hours},3)),'CONTEXT_VERSION');
 const current=values(sleep());
 fails(()=>C.patch('sleep',current,{}),'CONTEXT_PATCH_EMPTY');
 fails(()=>C.patch('sleep',current,{safety_clearance:true}),'CONTEXT_PATCH_FIELD');
});
test('proposed night label corresponds to the actual installed nightsBefore reader without changing source',()=>{
 // This actual reader has no external dependency. Instantiate only its public
 // module so the portable review packet never needs the seeded engine entry.
 const E=require('../../engine/sleep.cjs')({},{clock:{today:()=>effective.local_date},ids:{fresh:()=> 'public-synthetic'}});
 const mapped=C.legacyCorrespondence('sleep',values(sleep())).candidate;
 const source={sleep:{nights:[mapped]}},bytes=JSON.stringify(source);
 assert.deepEqual(E.nightsBefore(source,'2026-09-09'),[]);
 assert.deepEqual(E.nightsBefore(source,'2026-09-10'),[{d:'2026-09-09',h:7.5}]);
 // No quality conversion, clean/hold decision or private fixture is exercised.
 assert.equal(JSON.stringify(source),bytes);
 assert.equal(C.legacyCorrespondence('sleep',values(sleep({quality:'poor'}))).candidate,null);
});
