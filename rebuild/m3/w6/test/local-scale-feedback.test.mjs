import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { openTodayInstallation } from '../local/today-bindings.mjs';
import { createLocalCalendar } from '../local/calendar.mjs';
import { createDurablePublicClient } from '../public-client.mjs';
import { boot } from '../../w7-preview/today/today-entry.mjs';
import design from '../../w7-preview/today/design.cjs';
import { localEraConfig } from '../local/local-era.mjs';
import Client from '../../../client/index.cjs';
import { createGymModel, EFFORT_CHOICES } from '../../w7-preview/today/gym-model.mjs';

const setup = { athlete_label: 'Synthetic scale owner', split: { from: '2026-01-01', map: {0:'U',1:'U',2:'U',3:'U',4:'U',5:'U',6:'U'} },
  exercises: [{id:'press',n:'Press',mg:'chest',day:'U',sets:1,hi:10,inc:2.5,steps:[20,22.5,25]}],priority_muscles:[] };
async function fixture(t, iso = '2026-09-01T12:00:00Z') {
  const state = { iso }, indexedDB = new IDBFactory();
  const calendar = createLocalCalendar({now:()=>new Date(state.iso),offsetMinutes:()=>-240});
  const era = await openTodayInstallation({indexedDB,crypto:webcrypto,calendar,initialSetup:setup});
  t.after(()=>era.close());
  return {state,indexedDB,calendar,era};
}
const context = calendar => {const a=calendar.sample();return {local_date:a.day,local_time:a.time,utc_offset:a.offset};};

test('real owner saves first eligible weight, Why shows factual baseline and local standing, reopen retains it', async t => {
  const f=await fixture(t);f.era.close();
  const dom=new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',design.templateHtml()),{url:'http://localhost/'});
  let page=await boot({document:dom.window.document,indexedDB:f.indexedDB,crypto:webcrypto,calendar:f.calendar});
  t.after(()=>{page.close();dom.window.close();});
  assert.equal(page.model.read().scaleFeedback.baseline,null);
  assert.equal((await page.model.weighIn(170)).ok,true);
  await page.refresh();
  const view=page.model.read();assert.equal(view.scaleFeedback.baseline.value,170);assert.equal(view.scaleFeedback.smoothedWeight.value,170);
  assert.equal(view.scaleFeedback.scaleRate,null);assert.equal(view.calorieTarget.mid,null);
  assert.match(view.scaleFeedback.standing,/not server-accepted/);
  page.api.render('why');assert.match(dom.window.document.getElementById('phone').textContent,/Baseline: 170 lb/);
  assert.match(dom.window.document.getElementById('phone').textContent,/not a measured trend/);
  assert.doesNotMatch(JSON.stringify(view.scaleFeedback),/identityKey|privateJwk|sourceOpId|canonical_content_commitment|operations/);
  page.close();page=await boot({document:dom.window.document,indexedDB:f.indexedDB,crypto:webcrypto,calendar:f.calendar});
  assert.equal(page.model.read().scaleFeedback.smoothedWeight.value,170);
});

test('actual produced late then ten eligible daily weights reach measured scale rate; correction/removal remain honest',async t=>{
  const f=await fixture(t,'2026-08-31T18:00:00Z');
  let reader=await f.era.createReadingHost({day:'2026-08-31'});await reader.weighIn({date:'2026-08-31',lb:190});
  assert.equal(reader.scaleFeedback().view.baseline,null);assert.deepEqual(reader.scaleFeedback().view.exclusions,['AFTER_NOON']);
  for(let n=1;n<=10;n++) {const day='2026-09-'+String(n).padStart(2,'0');f.state.iso=day+'T12:00:00Z';reader.close();reader=await f.era.createReadingHost({day});
    assert.equal((await reader.weighIn({date:day,lb:171-n/10})).ok,true);
    assert.equal(!!reader.scaleFeedback().view.scaleRate,n===10);}
  const measured=reader.scaleFeedback().view;assert.equal(measured.count,10);assert.equal(measured.baseline.value,170.9);
  assert(Number.isFinite(measured.scaleRate.lo));assert(Number.isFinite(measured.scaleRate.hi));
  const ops=Object.values((await f.era.generation()).generation.collections.ops);const target=ops.find(op=>op.class==='reading'&&op.effective.local_date==='2026-09-01');
  // Synthetic history production using the actual T2 correction writer. The
  // Today UI has no reading correction editor; this is a read-boundary fixture.
  async function edit(kind, value) {
    const snapshot=await reader.repository.load(),next=structuredClone(snapshot.generation);
    const backend=Client.memoryBackend(next.collections);
    const identity=next.metadata.localEra.lease;
    const client=Client.createClient({...localEraConfig(next.metadata,{athleteId:identity.athlete_id,deviceId:identity.device_id,clock:f.calendar.clock}),backend});
    client.boot();assert.equal(client[kind](target.op_id,value).acknowledged,true);
    next.collections=Object.fromEntries(backend.collections().map(name=>[name,Object.fromEntries(backend.keys(name).map(key=>[key,backend.get(name,key)]))]));
    await reader.repository.commit(snapshot,next,()=>null);
  }
  await edit('correction',{lb:{value:172,unit:'lb'}});
  await reader.restart();assert.equal(reader.scaleFeedback().view.baseline.value,172);
  await edit('tombstone','Synthetic removal');
  await reader.restart();assert(reader.scaleFeedback().view.exclusions.includes('READING_RESOLUTION_REQUIRED'));
  assert.equal(reader.scaleFeedback().view.count,9);reader.close();
});

test('trusted static scale read refuses changed revision/token, session, observation and calendar; no renderer proof input',async t=>{
  const f=await fixture(t),reader=await f.era.createReadingHost({day:'2026-09-01'});
  await reader.weighIn({date:'2026-09-01',lb:170});
  const bindings=await f.era.client.hostBindings({clock:f.calendar.clientClock('2026-09-01')});
  for(const kind of ['revision','token','session','observation','calendar']) {
    let loads=0,current=true,epoch=bindings.sessionEpoch;
    const repository={...bindings.repository,async load(){const result=await bindings.repository.load();if(++loads===2){
      if(kind==='revision')return {...result,revision:result.revision+1};if(kind==='token')return {...result,token:'changed'};
      if(kind==='session')current=false;if(kind==='observation')epoch='changed';if(kind==='calendar')f.state.iso='2026-09-02T12:00:00Z';}return result;}};
    const client=createDurablePublicClient({...bindings,repository,subtle:webcrypto.subtle,schemaVersion:2,
      isCurrentSession:()=>current,observationEpoch:()=>epoch,scaleAsOf:()=>context(f.calendar)});
    const result=await client.readScaleFeedback({generation:{},eligibility:true});
    assert.equal(result.read,false,kind);assert.equal(result.view,undefined,kind);
    assert.equal(result.code,{revision:'SCALE_HISTORY_CHANGED',token:'SCALE_HISTORY_CHANGED',session:'SESSION_CHANGED',observation:'OBSERVATION_CHANGED',calendar:'SCALE_CALENDAR_CHANGED'}[kind]);
    f.state.iso='2026-09-01T12:00:00Z';
  }
  reader.close();
});

test('bad retained original and unproven history refuse before scale numbers escape',async t=>{
  const f=await fixture(t),reader=await f.era.createReadingHost({day:'2026-09-01'});await reader.weighIn({date:'2026-09-01',lb:170});
  const bindings=await f.era.client.hostBindings({clock:f.calendar.clientClock('2026-09-01')});
  for(const kind of ['original','history']) {
    const repository={...bindings.repository,async load(){const s=structuredClone(await bindings.repository.load());
      if(kind==='original')Object.values(s.generation.collections.ops)[0].payload.lb.value=999;
      else s.generation.metadata.wireProofs={unknown:{bad:true}};return s;}};
    const client=createDurablePublicClient({...bindings,repository,subtle:webcrypto.subtle,schemaVersion:2,scaleAsOf:()=>context(f.calendar)});
    const result=await client.readScaleFeedback();assert.equal(result.read,false);assert.equal(result.view,undefined);
  }
  reader.close();
});

test('one-store workout and reading interleave; fresh read includes completed-training exclusion and ignores lost cache',async t=>{
  const f=await fixture(t),day='2026-09-01';
  const reader=await f.era.createReadingHost({day});
  const gymHost=await f.era.createGymHost({day,engineState:(await f.era.initialSetup()).basisState,plannedSplitSlotId:'earned-today-preview/'+day});
  const gym=createGymModel({gymHost,sessionTitle:'Synthetic'});t.after(()=>{reader.close();gymHost.close();});
  assert.equal((await gym.start()).ok,true);const v=await gym.read();
  assert.equal((await gym.logSet({startId:v.startId,slot:v.set.slot,lift:v.set.lift,load:'20',reps:'10',effort:EFFORT_CHOICES.find(c=>c.label==='2').reserve})).ok,true);
  assert.equal((await gym.finish({startId:v.startId})).ok,true);
  assert.equal((await reader.weighIn({date:day,lb:170})).ok,true);
  let scale=reader.scaleFeedback();assert.equal(scale.read,true);assert.equal(scale.view.baseline,null);
  assert.deepEqual(scale.view.exclusions,['AFTER_COMPLETED_TRAINING']);
  const snapshot=await reader.repository.load(),next=structuredClone(snapshot.generation);
  assert.equal(Object.keys(next.collections.ops).length,4);
  delete next.collections.derived;await reader.repository.commit(snapshot,next,()=>null);
  await reader.restart();assert.deepEqual(reader.scaleFeedback().view,scale.view);
  assert.equal((await gym.read()).phase,'finished');
});

test('genuine concurrent weight commit invalidates captured read, then recomputes the whole new generation',async t=>{
  const f=await fixture(t),reader=await f.era.createReadingHost({day:'2026-09-01'});
  const bindings=await f.era.client.hostBindings({clock:f.calendar.clientClock('2026-09-01')});
  let loads=0;
  const repository={...bindings.repository,async load(){if(++loads===2)assert.equal((await reader.weighIn({date:'2026-09-01',lb:175})).ok,true);return bindings.repository.load();}};
  const client=createDurablePublicClient({...bindings,repository,subtle:webcrypto.subtle,schemaVersion:2,scaleAsOf:()=>context(f.calendar)});
  const stale=await client.readScaleFeedback();assert.equal(stale.read,false);assert.equal(stale.code,'SCALE_HISTORY_CHANGED');assert.equal(stale.view,undefined);
  const fresh=await client.readScaleFeedback();assert.equal(fresh.read,true);assert.equal(fresh.view.baseline.value,175);assert.equal(fresh.view.count,1);
  reader.close();
});
