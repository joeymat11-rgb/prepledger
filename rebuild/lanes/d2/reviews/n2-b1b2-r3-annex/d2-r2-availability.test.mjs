import test from 'node:test';
import assert from 'node:assert/strict';
import { DAY, NIGHT, basis, device, projected, collections, consumers } from './d2-r2-support.mjs';
import TodayModel from '../rebuild/m3/w7-preview/today/today-model.cjs';

// Expected outcomes come from PM246/R7, read before candidate execution. These
// fixtures are invented inputs. The production factories, bindings and hosts are
// never substituted. No fixture is an athlete record or a retained-data clone.
const targets = [['absent', undefined], ['null', null], ['string', '8'], ['NaN', NaN], ['Infinity', Infinity]];
function targetOn(state, value) {
  if (value === undefined) delete state.sleep.cleanH; else state.sleep.cleanH = value;
  return state;
}
function noTarget(E, state) {
  assert.deepEqual(E.atSleepTarget(state), { run: null, at: null, targetKnown: false });
  const anchor = E.sleepAnchor(state), lights = E.lightsOutT(state);
  assert.equal(anchor.target, null); assert.equal(anchor.needBed, null); assert.equal(anchor.shiftMin, null);
  assert.equal(lights.target, null); assert.equal(lights.t, null);
  const sleepLine = E.weekReview(state).lines.find(line => line.startsWith('sleep '));
  assert.match(sleepLine, /nights recorded; target not recorded.*comparison unavailable/);
  assert.doesNotMatch(sleepLine, /\d+\/\d+ clean|clears|recovered/);
}
function unknownDebt(E, state, expectedBand = 'UNKNOWN') {
  const recovery = E.recoveryIndex(state), sleep = recovery.flags.find(flag => flag.k === 'sleep');
  assert.equal(E.sleepInfo(state).clean, false);
  assert.ok(E.currentSleepObservation(state), 'observed debt is not missing evidence');
  assert.equal(Object.hasOwn(recovery, 'sleepEvidence'), false);
  assert.equal(recovery.score, null); assert.equal(recovery.lever, null); assert.equal(recovery.band, expectedBand);
  assert.ok(sleep, 'actual debt must retain its flag'); assert.equal(sleep.cost, null);
  assert.match(sleep.receipt, /observed short night or three-night sleep debt/);
  assert.match(sleep.fix, /record your sleep target/); assert.match(sleep.fix, /observed debt still counts/);
  assert.ok(recovery.factors.includes(sleep.receipt));
  for (const flag of recovery.flags) assert.ok(flag.receipt && flag.fix, 'each real factor retains an action');
  noTarget(E, state);
  return recovery;
}

for (const [label, target] of targets) test('R2 real 0/2/8-hour entries with ' + label + ' target keep observation and target availability separate', async () => {
  for (const hours of [0, 2, 8]) {
    const kit = await device();
    try {
      assert.equal((await kit.host.save({ date: NIGHT, hours }, { supersedes: null })).ok, true);
      const before = await collections(kit.host), input = targetOn(basis(), target);
      const model = await projected(kit.host, input), state = model.stateFromOps(), E = model.engine;
      // The actual Today constructor JSON-clones its basis: NaN/Infinity become
      // null. The second phase also checks the exact nonfinite input directly
      // through these same bound production readers, without replacing them.
      if (typeof target === 'number' && !Number.isFinite(target)) assert.equal(state.sleep.cleanH, null);
      for (const phase of ['actual projected state', 'exact target supplied to bound reader']) {
        if (phase.startsWith('exact')) targetOn(state, target);
        assert.equal(E.currentSleepObservation(state).h, hours, phase);
        assert.deepEqual(E.fiveLevers(state).sleep,
          { label: 'SLEEP', state: 'quiet', detail: 'sleep target not recorded' }, phase);
        noTarget(E, state);
        if (hours < 6.5) unknownDebt(E, state);
        else {
          assert.equal(E.sleepInfo(state).clean, true);
          const recovery = E.recoveryIndex(state);
          assert.deepEqual([recovery.flags, recovery.score, recovery.band, recovery.lever], [[], 100, 'GREEN', null]);
        }
      }
      assert.equal(model.recordedSleep(NIGHT).savedDate, DAY);
      assert.deepEqual(await collections(kit.host), before, 'readers preserve exact facts/outbox');
      await consumers(model, kit, NIGHT, hours);
    } finally { kit.host.close(); }
  }
});

test('R2 the same genuine previous 2h plus explicit pre-existing same-date 8h gives target8/run1/cost20, target9/run0/cost30, or unavailable', async () => {
  const kit = await device();
  try {
    assert.equal((await kit.host.save({ date: NIGHT, hours: 2 }, { supersedes: null })).ok, true);
    const before = await collections(kit.host), cases = [];
    for (const [target, run, cost, score, band] of [[8, 1, 20, 80, 'GREEN'], [9, 0, 30, 70, 'WATCH'], [undefined, null, null, null, 'UNKNOWN']]) {
      const input = targetOn(basis(), target);
      // N2 forbids saving today's uncompleted night. This is explicitly a
      // pre-existing synthetic engine-basis row, never claimed as an N2 save.
      input.sleep.nights.push({ d: DAY, h: 8 });
      const model = await projected(kit.host, input), state = model.stateFromOps(), E = model.engine;
      const recovery = E.recoveryIndex(state), flag = recovery.flags.find(f => f.k === 'sleep');
      assert.deepEqual(state.sleep.nights.map(n => [n.d,n.h]), [[NIGHT,2],[DAY,8]]);
      assert.equal(E.currentSleepObservation(state).h, 8);
      assert.equal(E.sleepInfo(state).clean, false, 'the genuine previous short night remains observed debt');
      assert.equal(E.atSleepTarget(state).run, run);
      assert.equal(flag.cost, cost); assert.equal(recovery.score, score); assert.equal(recovery.band, band);
      if (target === undefined) unknownDebt(E, state);
      else { assert.equal(recovery.lever.k, 'sleep'); assert.match(flag.fix, new RegExp((3-run) + ' more nights at ' + target + ' h')); }
      assert.equal(model.loggedSleep(NIGHT).h, 2);
      assert.equal(model.recordedSleep(NIGHT).savedDate, DAY);
      cases.push(model);
    }
    assert.deepEqual(await collections(kit.host), before);
    for (const model of cases) assert.deepEqual(model.storedSleepNights(), cases[0].storedSleepNights());
    // Actual entries consume the previous completed night, while the actual gym
    // receives the whole same projected state. Enter Start only once per device.
    await consumers(cases[2], kit, NIGHT, 2);
  } finally { kit.host.close(); }
});

test('R2 three genuine consecutive 6.6h nights keep unpriced debt; a calendar gap does not manufacture it', async () => {
  for (const [dates, debt] of [[['2030-02-01','2030-02-02',NIGHT],true], [['2030-01-31','2030-02-01',NIGHT],false]]) {
    const kit = await device();
    try {
      for (const date of dates) assert.equal((await kit.host.save({date,hours:6.6},{supersedes:null})).ok,true);
      const model = await projected(kit.host), state = model.stateFromOps(), E = model.engine;
      assert.equal(state.sleep.nights.length,3);
      if (debt) unknownDebt(E,state);
      else {
        assert.equal(E.sleepInfo(state).clean,true);
        assert.deepEqual(E.recoveryIndex(state).flags,[]);
        assert.equal(E.recoveryIndex(state).band,'GREEN');
        noTarget(E,state);
      }
      await consumers(model,kit,NIGHT,6.6);
    } finally {kit.host.close();}
  }
});

for (const [label,h] of [['null',null],['string','2'],['NaN',NaN],['Infinity',Infinity]]) test('R2 invalid current '+label+' is unavailable, never zero debt or a sleep intervention', async () => {
  const kit=await device();
  try {
    const before=await collections(kit.host);
    assert.equal((await kit.host.save({date:NIGHT,hours:h},{supersedes:null})).ok,false,'producer refuses invalid hours');
    assert.deepEqual(await collections(kit.host),before);
    const input=basis(); input.sleep.nights=[{d:NIGHT,h}]; input.sleep.cleanH=8;
    const model=await projected(kit.host,input), state=model.stateFromOps(), E=model.engine;
    for(const phase of ['actual projected state','exact invalid supplied to bound reader']) {
      if(phase.startsWith('exact')) state.sleep.nights[0].h=h;
      assert.equal(E.currentSleepObservation(state),null);
      assert.equal(E.sleepInfo(state).clean,true);
      const recovery=E.recoveryIndex(state);
      assert.deepEqual([recovery.band,recovery.score,recovery.flags],['UNKNOWN',null,[]]);
      assert.equal(recovery.sleepEvidence.state,'UNKNOWN');
      assert.deepEqual(E.fiveLevers(state).sleep,{label:'SLEEP',state:'quiet',detail:'current sleep not recorded'});
      assert.notEqual(E.theOneFix(state).rung,'sleep');
    }
    await consumers(model,kit,null,null);
  } finally {kit.host.close();}
});

test('R2 target alone, stale and future-only rows cannot create a current debt flag or claim current sleep', async () => {
  for(const rows of [[],[{d:'2030-02-01',h:2}],[{d:'2030-02-05',h:2}]]) {
    const kit=await device();
    try {
      const input=basis(); input.sleep.nights=rows; input.sleep.cleanH=8;
      const model=await projected(kit.host,input),state=model.stateFromOps(),E=model.engine;
      assert.equal(E.currentSleepObservation(state),null);
      assert.equal(E.sleepInfo(state).clean,true);
      assert.deepEqual([E.recoveryIndex(state).score,E.recoveryIndex(state).band,E.recoveryIndex(state).flags],[null,'UNKNOWN',[]]);
      assert.equal(E.fiveLevers(state).sleep.detail,'current sleep not recorded');
      await consumers(model,kit,null,null);
    }finally{kit.host.close();}
  }
});

test('R2 after logging and steps prerequisites, invalid current sleep stays quiet while actual short sleep reaches the real sleep rung', () => {
  for(const h of [null,'2',NaN,Infinity,0,2]) {
    const input=TodayModel.createTodayModel({today:DAY}).basisState();
    input.reads.push({d:DAY,w:180,note:'D2 explicit synthetic morning reading',sealed:false});
    input.dailyLogs[DAY]={cal:2300,pro:170,steps:8500};
    input.sleep.nights=input.sleep.nights.slice(-3); input.sleep.nights[2].h=h; input.sleep.cleanH=8;
    const model=TodayModel.createTodayModel({today:DAY,basisState:input}),state=model.stateFromOps(),E=model.engine;
    assert.deepEqual(E.nowFocus(state).owed,[],'logging must not hide the sleep rung under test');
    const levers=E.fiveLevers(state); assert.notEqual(levers.steps.state,'caution','steps must not hide the sleep rung');
    if(Number.isFinite(h)) {
      assert.equal(levers.sleep.state,'caution'); assert.equal(E.theOneFix(state).rung,'sleep');
    }else{
      assert.equal(levers.sleep.state,'quiet'); assert.notEqual(E.theOneFix(state).rung,'sleep');
    }
  }
});

for(const [band,hot] of [['WATCH',false],['LOW',true]]) test('R2 known independent warnings establish '+band+' while unknown sleep remains unranked with every action', async () => {
  const kit=await device();
  try {
    assert.equal((await kit.host.save({date:NIGHT,hours:2},{supersedes:null})).ok,true);
    const input=basis();
    input.exercises.forEach(e=>{e.holdFlag=true;});
    input.sessionLog['2030-02-02']={type:'U',entries:hot?Array.from({length:4},()=>({id:input.exercises[0].id,w:20,reps:[8,7],sets:2,rir:0})):[],niggles:['left knee','right knee','left elbow']};
    const model=await projected(kit.host,input),state=model.stateFromOps(),E=model.engine;
    const before=JSON.stringify(state), recovery=unknownDebt(E,state,band);
    assert.deepEqual(recovery.flags.map(f=>f.k).sort(),(hot?['sleep','held','hot','joints']:['sleep','held','joints']).sort());
    assert.equal(recovery.flags.filter(f=>Number.isFinite(f.cost)).reduce((sum,f)=>sum+f.cost,0),hot?51:41);
    assert.equal(E.genSession(state,DAY,null).ex.length,1,'UNKNOWN does not become a blanket gym ban');
    assert.equal(JSON.stringify(state),before,'all bound readers preserve their input state');
    await consumers(model,kit,NIGHT,2);
  }finally{kit.host.close();}
});

test('R2 real clock history has a measured clock but no invented target, bedtime or clean count', async () => {
  const kit=await device();
  try {
    for(const date of ['2030-01-29','2030-01-30','2030-01-31','2030-02-01','2030-02-02',NIGHT])
      assert.equal((await kit.host.save({date,bed:'22:00',wake:'06:00'},{supersedes:null})).ok,true);
    const model=await projected(kit.host),state=model.stateFromOps(),E=model.engine;
    assert.equal(E.sleepAnchor(state).measured,true); noTarget(E,state);
    assert.match(E.weekReview(state).lines.find(line=>line.startsWith('sleep ')),/^sleep 6 nights recorded/);
    const recorded=JSON.stringify(state.sleep.nights); state.sleep.cleanH=8;
    assert.equal(E.atSleepTarget(state).run,6);
    assert.match(E.weekReview(state).lines.find(line=>line.startsWith('sleep ')),/^sleep 6\/6 clean/);
    assert.equal(JSON.stringify(state.sleep.nights),recorded);
  }finally{kit.host.close();}
});
