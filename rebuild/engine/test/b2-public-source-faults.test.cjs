'use strict';
// PM246 public construction evidence. All states below are invented. No seed,
// historical fixture, frozen engine, native host, or protected test is loaded.
const assert = require('node:assert/strict');
const test = require('node:test');
const H = require('./b1b2-public-engine.cjs');
const {createNativeTrendContextBinding,createDayFactsReader} = require('../../m4/workout/native-trend-context.cjs');
const lift = (o={}) => ({id:'public-lift',n:'Press',w:100,inc:5,sets:2,hi:10,last:[8,7],setup:'invented',day:'U',mg:'chest',...o});
const state = (ex=lift()) => ({...H.syntheticState(),exercises:[ex]});
function facts(rows) {
  const sessions=rows.map(([d,reps],n)=>{
    const start='public-start-'+n,lineage='public-lift';
    const entry={profile:'earned/performed-lift/v1',start_op_id:start,lift_lineage_id:lineage,
      completion:{op_id:start+'-complete',kind:'normal',status:'stored-on-this-device'},
      slots:reps.map((value,i)=>{const slot=JSON.stringify([lineage,i+1]);return {position:i+1,logical_set_slot:slot,state:value===null?'unlogged':'performed',
        ...(value===null?{}:{fact:{included:true,source_op_id:start+'-set-'+i,logical_set_slot:slot,lift_lineage_id:lineage,
          source_status:'stored-on-this-device',current_status:'stored-on-this-device',edit_op_ids:[],issues:[],current:{load:{unit:'lb',value:100},reps:{unit:'rep',value}}}})};})};
    return {start_op_id:start,effective:{local_date:d},record:{entries:[entry]}};
  });
  return {profile:'earned/workout-facts/v1',source_revision:1,sessions,order:{profile:'earned/workout-order/v1',frontier:sessions.length,start_ids:sessions.map(x=>x.start_op_id)}};
}
function native(s,day='2026-09-03',fault) {
  let dayReader;
  const binding=createNativeTrendContextBinding({dayFacts:iso=>dayReader.dayFacts(iso)});
  const resolver=fault=== 'missing'?undefined:fault?request=>fault(binding.resolve(request),request):binding.resolve;
  const engine=H.createEngine({clock:H.clockAt(day),ids:{fresh:()=> 'public-unused-id'},nativeTrendContext:resolver});
  dayReader=createDayFactsReader({state:s,engine});
  return {engine,run:fn=>binding.withFacts(s.workoutFacts,()=>fn(engine)),binding};
}
test('D1 fixed first-line fit and native no-surviving-line semantics',()=>{
  const T=H.createEngine({clock:H.clockAt('2026-09-03')});
  for(const [sets,expected] of [[3,[8,7,6]],[1,[8]]]){
    const ex=lift({last:null,first:[8,7],sets});assert.deepEqual(T.targetsFor(ex,state(ex)),expected);
    const cached=lift({last:[12,11],first:[8,7],sets}),s=state(cached);s.workoutFacts=facts([['2026-09-01',[null,null]]]);
    native(s).run(E=>assert.deepEqual(E.targetsFor(cached,s),expected));
  }
});
test('D7 native earlier/current/future date bounds and query advance',()=>{
  const ex=lift(),s=state(ex);s.workoutFacts=facts([['2026-08-31',[8,7]],['2026-09-03',[9,8]],['2026-09-10',[13,12]]]);
  native(s).run(E=>assert.deepEqual(E.progressAnchor(ex,s),[9,8]));
  native(s,'2026-08-31').run(E=>assert.deepEqual(E.progressAnchor(ex,s),[8,7]));
  native(s,'2026-09-10').run(E=>assert.deepEqual(E.progressAnchor(ex,s),[13,12]));
});
test('R3 native future-only anchor is empty, never cached or future evidence',()=>{
  const ex=lift({last:[7,6]}),s=state(ex);s.workoutFacts=facts([['2026-09-10',[13,12]]]);
  native(s).run(E=>assert.deepEqual(E.progressAnchor(ex,s),[]));
});
test('native same-day reset refuses both consumers; before/after retain positives',()=>{
  for(const method of ['targetsFor','progressAnchor']){
    const ex=lift({last:null,first:[8,7]}),s=state(ex);s.workoutFacts=facts([['2026-09-01',[9,8]]]);
    s.feed=[{d:'2026-09-01',t:'RESET APPLIED — Press'}];
    native(s).run(E=>assert.throws(()=>E[method](ex,s),{code:'PROGRESSION_RESET_MAPPING_REQUIRED'}));
  }
  const ex=lift({last:null,first:[8,7]}),s=state(ex);s.workoutFacts=facts([['2026-08-31',[9,8]]]);s.feed=[{d:'2026-09-01',t:'RESET APPLIED — Press'}];
  native(s).run(E=>assert.deepEqual(E.targetsFor(ex,s),[8,7]));
  s.workoutFacts=facts([['2026-09-02',[9,8]]]);native(s).run(E=>assert.deepEqual(E.progressAnchor(ex,s),[9,8]));
});
test('actual native resolver fails closed on missing, mismatched, throwing, nonboolean and pace',()=>{
  const faults=['missing',a=>({...a,source_revision:2}),()=>{throw Error('invented refusal');},a=>({...a,debt:null})];
  for(const fault of faults){const ex=lift(),s=state(ex);s.workoutFacts=facts([['2026-09-01',[9,8]]]);
    native(s,'2026-09-03',fault).run(E=>assert.throws(()=>E.progressAnchor(ex,s),{code:'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'}));}
  const ex=lift(),s=state(ex);s.workoutFacts=facts([['2026-09-01',[9,8]]]);s.workoutFacts.sessions[0].pace='unknown-invented-value';
  native(s).run(E=>assert.throws(()=>E.progressAnchor(ex,s),{code:'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'}));
});
