'use strict';
// Synthetic whole-state differential against the real pinned frozen bundle.
// No candidate function, DTO projection, private fixture or normalized receipt
// supplies the expected result. Direction and input mutation are observed.
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync, execFileSync } = require('node:child_process');
const NativeDate = globalThis.Date;
if (!process.argv.includes('--worker')) {
  for (const mode of ['frozen', 'native']) {
    const child = spawnSync(process.execPath, [__filename, '--worker', mode], {
      env: { ...process.env, TZ: 'America/New_York', MEASURED_TEST_NOW: '2026-09-03' },
      encoding: 'utf8', windowsHide: true
    });
    process.stdout.write(child.stdout || ''); process.stderr.write(child.stderr || '');
    if (child.error) throw child.error;
    assert.equal(child.status, 0, mode + ' merge differential failed');
  }
  process.exit(0);
}
const mode = process.argv.at(-1), ROOT = path.resolve(__dirname, '../../..');
assert.equal(execFileSync('git', ['hash-object', 'src/app.jsx'], { cwd: ROOT, encoding: 'utf8', windowsHide: true }).trim(),
  'f98671d823f0d8cd83e730cdd930afe5f5e7b628');
const G = require(path.resolve(process.env.ENGINE_MAIN || path.join(__dirname, '../../conform/engines/engine-main.cjs'))).__test;
globalThis.Date = NativeDate; // Frozen bundle installs its own Date when loaded.
assert.equal(typeof G.mergeState, 'function');
const clocks = ['2026-09-03T16:00:00.000Z', '2031-02-04T09:17:23.456Z'].map(instant => {
  const ms = NativeDate.parse(instant), d = new NativeDate(ms);
  return { today: () => [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-'),
    nowMs: () => ms, nowISO: () => instant, hour: () => d.getHours(), dow: () => d.getDay(), tz: 'America/New_York' };
});
class AmbientFrozenDate extends NativeDate {
  constructor(...args) { super(...(args.length ? args : [clocks[0].nowMs()])); }
  static now() { return clocks[0].nowMs(); }
}
const CandidateDate = mode === 'frozen' ? AmbientFrozenDate : NativeDate;
globalThis.Date = CandidateDate;
const { createEngine } = require('../index.cjs');
const { createMigrationReference, deterministicIds } = require('./migrate-reference.cjs');
assert.equal(globalThis.Date, CandidateDate);
const clone = value => structuredClone(value);
const state = () => ({ v: 60, trend: 180, reads: [], weekly: [], dailyLogs: {}, sessionLog: {},
  sleep: { nights: [], needed: 3 }, exercises: [], queue: [], feed: [], forecasts: [],
  adjustments: [], proposals: [], suggestionLog: [], targets: {},
  learned: { tdee: [], anchors: [] }, plan: { goals: [], ifthen: [], setAt: {}, phaseLog: [] },
  exOrder: { U: [], L: [] }, planGen: 52, retirements: {}, insertions: {},
  waist: [], photos: [], events: [], caffLog: [], medsLog: [], skinfolds: [],
  temp: [], pulse: [], soreness: [], energy: [], grip: [], trials: [], agentProposals: [],
  dayCtx: {}, labSeen: {}, model: { lean: 150, drip: 0, src: 'DEXA', anchorISO: '2026-01-01' } });
const exercise = extra => ({ id: 'synthetic_press', n: 'Synthetic press', mg: 'chest', day: 'U',
  w: 100, inc: 5, sets: 2, hi: 10, lo: 8, setup: 'Synthetic setup', ...extra });
function mintPair() {
  return ['2026-08-28', '2026-08-30'].map(d => {
    const s = state(); s.exercises = [exercise({ topAt: 100, topRun: 1 })]; s.exOrder.U = ['synthetic_press'];
    s.sessionLog[d] = { entries: [{ id: 'synthetic_press', w: 100, reps: [10, 10], rir: 2, rirSets: [2, 0] }] };
    s.feed = [{ d, t: 'SYNTHETIC PRESS — TOP OF WINDOW, PROVISIONAL', how: 'Synthetic first sighting', op: 'synthetic:' + d }];
    return s;
  });
}
function reference(clock, blocked = false, accesses = []) {
  class ReferenceDate extends NativeDate {
    constructor(...args) {
      if (!args.length && blocked) { accesses.push('new Date()'); throw Error('synthetic blocked clock'); }
      super(...(args.length ? args : [clock.nowMs()]));
    }
    static now() { if (blocked) { accesses.push('Date.now()'); throw Error('synthetic blocked clock'); } return clock.nowMs(); }
  }
  return { mergeState(...args) {
    const old = globalThis.Date; globalThis.Date = ReferenceDate;
    try { return G.mergeState(...args); } finally { globalThis.Date = old; }
  } };
}
function aliases(value) {
  const seen = new Map(), repeated = [];
  function walk(v,p) { if (!v || typeof v !== 'object') return; if(seen.has(v)){repeated.push([p,seen.get(v)]);return;} seen.set(v,p);for(const k of Object.keys(v))walk(v[k],p+'/'+k); }
  walk(value,'$'); return repeated;
}
function capture(T, pair, calls) {
  const inputs = clone(pair), results = [], frames = [];
  for (const [local,remote] of calls) {
    const localArg = local < 0 ? results[-local-1] : inputs[local];
    const remoteArg = remote < 0 ? results[-remote-1] : inputs[remote];
    const result = T.mergeState(localArg, remoteArg);
    results.push(result);
    // Capture the cut NOW: a later call may mutate a previously returned subtree.
    const value = { result, inputs, args: [localArg, remoteArg] };
    frames.push({ json: JSON.stringify(value), aliases: aliases(value) });
  }
  return { frames, last: results.at(-1), inputs };
}
let comparisons = 0;
function compare(label, pair, calls = [[0,1]], clock = clocks[0]) {
  const expected = capture(reference(clock), pair, calls);
  assert.equal(globalThis.Date, CandidateDate, label + ': reference restored Date');
  const E = createEngine({ clock, ids: { fresh() { throw Error('merge unexpectedly requested a fresh id'); } } });
  const got = capture(E, pair, calls);
  assert.equal(globalThis.Date, CandidateDate, label + ': candidate preserves Date');
  assert.deepEqual(got.frames, expected.frames, label + ': full bytes, post-call inputs and aliases');
  comparisons++; return got.last;
}
const fixtures = [];
function add(name, build, check) { fixtures.push({ name, build, check }); }
add('two-device disjoint records', () => {
  const a=state(),b=state();
  for(const [s,d,tag] of [[a,'2026-08-28','A'],[b,'2026-08-30','B']]) {
    s.reads=[{d,w:180,pt:180}];s.sleep.nights=[{d,h:8}];s.dailyLogs[d]={cal:2200,pro:170,steps:7000};
    s.sessionLog[d]={entries:[{id:'synthetic_press',w:100,reps:[8,8]}]};
    s.feed=[{d,t:'Synthetic '+tag,how:'Keep punctuation,  spaces — '+tag,op:'op-'+tag}];
    s.queue=[{id:'queue-'+tag,done:false}];s.events=[{id:'event-'+tag,d,t:'Synthetic event'}];
  } return [a,b];
}, r=>{assert.equal(r.reads.length,2);assert.equal(Object.keys(r.sessionLog).length,2);assert.equal(r.feed.length,2);});
add('same-day keyed read clean beats late',()=>{const a=state(),b=state();a.reads=[{d:'2026-08-30',w:180,pt:180}];b.reads=[{d:'2026-08-30',w:190,pt:180,offWindow:true,note:'longer synthetic late body'}];return[a,b];},r=>{assert.equal(r.reads.length,1);assert.equal(r.reads[0].w,180);});
add('scalar local-wins is retained',()=>{const a=state(),b=state();a.syntheticScalar='local-A';b.syntheticScalar='local-B';return[a,b];});
add('same-key terminal queue and adjustment',()=>{const a=state(),b=state();a.queue=[{id:'queue',done:true,state:'DONE',gate:'Synthetic delivered 8,8'}];b.queue=[{id:'queue',done:false,state:'READY'}];a.adjustments=[{id:'adjust',rid:'synthetic',d:'2026-08-30',undone:true,title:'Undone'}];b.adjustments=[{id:'adjust',rid:'synthetic',d:'2026-08-30',title:'Applied'}];return[a,b];},r=>{assert.equal(r.queue[0].done,true);assert.equal(r.adjustments[0].undone,true);});
add('keyless multiplicity and differing same-day order',()=>{const a=state(),b=state(),f={d:'2026-08-30',t:'Repeated synthetic note',how:'same'};a.feed=[clone(f),clone(f),{d:f.d,t:'A only',how:'A'}];b.feed=[{d:f.d,t:'B only',how:'B'},clone(f)];a.forecasts=[{d:f.d,pred7:180},{d:f.d,pred7:180}];b.forecasts=[{pred7:180,d:f.d}];return[a,b];},r=>{assert.equal(r.feed.filter(f=>f.t==='Repeated synthetic note').length,2);assert.equal(r.forecasts.length,2);});
add('stamped load carries caches; ladder repair waits for migration',()=>{const a=state(),b=state();a.exercises=[exercise({w:110,wAt:'2026-08-30T10:00:00.000Z',last:null,lastMeta:{d:'2026-08-28',w:100,reps:[8,8]}})];b.exercises=[exercise({w:100,wAt:'2026-08-29T10:00:00.000Z',steps:[90,100,120],stepsAt:'2026-08-31T10:00:00.000Z',last:[8,8]})];return[a,b];},r=>{assert.equal(r.exercises[0].w,110);assert.equal(r.exercises[0].steps.includes(110),false);});
add('same-stamp config conflict',()=>{const a=state(),b=state(),at='2026-08-30T10:00:00.000Z';a.exercises=[exercise({sets:2,setsAt:at,hi:10,hiAt:at})];b.exercises=[exercise({sets:3,setsAt:at,hi:12,hiAt:at})];return[a,b];},r=>{assert.equal(r.exercises[0].sets,3);assert.equal(r.exercises[0].hi,12);});
add('fork classes and rename histories',()=>{const a=state(),b=state();a.exercises=[exercise({forks:[{from:'2026-08-20',kind:'technique',why:'Synthetic setup',prevN:'Old name'}],renames:[{from:'2026-08-15',prevN:'Earlier name'}]})];b.exercises=[exercise({forks:[{from:'2026-08-20',kind:'context',split:true,why:'Synthetic context',prevN:'Old name'}],renames:[{from:'2026-08-25',prevN:'Later name'}]})];return[a,b];});
add('higher plan generation carries order as one register',()=>{const a=state(),b=state();a.planGen=53;a.exOrder={U:['local-only'],L:[]};b.planGen=52;b.exOrder={U:['remote-only'],L:[]};return[a,b];},r=>{assert.equal(r.planGen,53);assert.deepEqual(r.exOrder.U,['local-only']);});
add('plan learned and sleep keyed unions',()=>{const a=state(),b=state();a.plan.goals=[{id:'goal-A',text:'A'}];b.plan.goals=[{id:'goal-B',text:'B'}];a.learned.anchors=[{id:'anchor-A',d:'2026-08-28',bf:18}];b.learned.anchors=[{id:'anchor-B',d:'2026-08-30',bf:17}];a.sleep.nights=[{d:'2026-08-28',h:8}];b.sleep.nights=[{d:'2026-08-30',h:7.5}];return[a,b];},r=>{assert.equal(r.learned.anchors.length,2);assert.equal(r.sleep.nights.length,2);});
add('old schema on one side preserves additive keyed records',()=>{const a=state(),b=state();b.v=54;delete b.suggestionLog;delete b.learned;a.proposals=[{id:'proposal-new',rid:'new',title:'New'}];b.proposals=[{id:'proposal-old',rid:'old',title:'Old'}];a.dailyLogs['2026-08-30']={cal:2200};b.dailyLogs['2026-08-28']={cal:2300};return[a,b];},r=>{assert.equal(r.proposals.length,2);assert.equal(Object.keys(r.dailyLogs).length,2);});
add('attested struck set survives stale richer body with receipt',()=>{
  const a=state(),b=state(),d='2026-08-30',at='2026-08-30T18:00:00.000Z',op='synthetic:strike';
  b.sessionLog[d]={entries:[{id:'synthetic_press',w:100,reps:[8,8,8],rirSets:[2,1,0]}]};
  a.sessionLog[d]={entries:[{id:'synthetic_press',w:100,reps:[8,8],rirSets:[2,1]}],corr:{at,rev:1},corrLog:[{op,kind:'strike',id:'synthetic_press',at,to:[{id:'synthetic_press',reps:[8,8],rirSets:[2,1]}]}]};
  a.feed=[{d,op,t:'SET STRUCK — synthetic',how:'The third set was entered by mistake; two sets stand.'}];return[a,b];
},r=>{assert.deepEqual(r.sessionLog['2026-08-30'].entries[0].reps,[8,8]);assert.equal(r.sessionLog['2026-08-30'].corrLog.length,1);assert.equal(r.feed.filter(f=>f.op==='synthetic:strike').length,1);});
add('legacy correction creates exact carve receipt',()=>{const a=state(),b=state(),d='2026-08-30';a.sessionLog[d]={corr:{at:'2026-08-30T18:00:00.000Z',rev:1},entries:[{id:'keep',w:100,reps:[8]}]};b.sessionLog[d]={entries:[{id:'keep',w:100,reps:[8]},{id:'removed',w:50,reps:[8]}]};return[a,b];},r=>{assert.equal(r.feed.filter(f=>f.op==='carve:2026-08-30').length,1);});
add('suggestion decisions rematerialize exact receipts and effects',()=>{const a=state(),b=state();a.suggestionLog=[{sid:'synthetic-sug',d:'2026-08-29',at:'2026-08-29T13:00:00.000Z',decided:'approved',title:'Synthetic protein',apply:{kind:'protein',to:190}}];b.suggestionLog=[{sid:'synthetic-sug',d:'2026-08-30',at:'2026-08-30T13:00:00.000Z',decided:'dismissed',title:'Synthetic protein',apply:{kind:'protein',to:190}}];b.feed=[{d:'2026-08-30',op:'sug:synthetic-sug',t:'ANALYST SUGGESTION DISMISSED',how:'obsolete synthetic body'}];return[a,b];},r=>{assert.equal(r.targets.proteinG,190);assert.equal(r.feed.filter(f=>f.op==='sug:synthetic-sug').length,1);assert.match(r.feed.find(f=>f.op==='sug:synthetic-sug').how,/190 g\/day/);});
add('qualifying union mints only at merge exit',mintPair,r=>{assert.equal(r.queue.filter(q=>q.newW===105&&q.state==='DEBUT'&&!q.done).length,1);assert.equal(r.feed.filter(f=>f.t==='SYNTHETIC PRESS 105 EARNED').length,1);});
add('one sighting cannot jointly mint',()=>{const pair=mintPair();pair[1].sessionLog={};pair[1].feed=[];return pair;},r=>{assert.equal(r.queue.some(q=>q.newW===105&&!q.done),false);assert.equal(r.feed.some(f=>f.t==='SYNTHETIC PRESS 105 EARNED'),false);});
add('hot opener blocks joint mint',()=>{const pair=mintPair();for(const s of pair)for(const log of Object.values(s.sessionLog)){log.entries[0].rir=0;log.entries[0].rirSets=[0,0];}return pair;},r=>{assert.equal(r.queue.some(q=>q.newW===105&&!q.done),false);assert.equal(r.feed.some(f=>f.t==='SYNTHETIC PRESS 105 EARNED'),false);});

for(const clock of clocks)for(const fixture of fixtures){
  const pair=fixture.build();
  for(const [direction,call] of [['AB',[0,1]],['BA',[1,0]]]){
    const label=fixture.name+' '+direction+' clock='+clock.nowISO();
    const once=compare(label,pair,[call],clock);fixture.check?.(once);
    // Repeat the same remote batch twice after the first result, preserving input
    // mutations between calls exactly as the frozen engine does.
    const repeated=compare(label+' repeated batch twice',pair,[call,[-1,call[1]],[-2,call[1]]],clock);
    fixture.check?.(repeated);
  }
}
for(const [label,pair] of [['absent remote',[state(),null]],['absent local',[null,state()]],['junk remote',[state(),'junk']],['both absent',[null,null]]])compare(label,pair);
const scalarPair=fixtures.find(x=>x.name==='scalar local-wins is retained').build();
assert.equal(compare('explicit AB scalar',scalarPair).syntheticScalar,'local-A');
assert.equal(compare('explicit BA scalar',scalarPair,[[1,0]]).syntheticScalar,'local-B');

// The actual boot boundary repairs the merged old/current-schema state. This is
// supplemental to the merge-only cuts; both full results and mutated inputs count.
for(const clock of clocks)for(const call of [[0,1],[1,0]]) {
  const pair=fixtures.find(x=>x.name==='old schema on one side preserves additive keyed records').build();
  const expected=capture(reference(clock),pair,[call]);
  const R=createMigrationReference(G,{clock,ids:deterministicIds(),Date:NativeDate});
  const expectedMigrated=R.migrate(expected.last);
  expected.frames.push({json:JSON.stringify({result:expectedMigrated,inputs:expected.inputs}),aliases:aliases({result:expectedMigrated,inputs:expected.inputs})});
  assert.equal(globalThis.Date,CandidateDate);
  const E=createEngine({clock,ids:deterministicIds()});
  const got=capture(E,pair,[call]),migrated=E.migrate(got.last);
  got.frames.push({json:JSON.stringify({result:migrated,inputs:got.inputs}),aliases:aliases({result:migrated,inputs:got.inputs})});
  assert.deepEqual(got.frames,expected.frames,'old/current schema merge then additive boot migration');
  assert.equal(Object.keys(migrated.dailyLogs).length,2);
  assert.equal(migrated.proposals.length,2);
  comparisons++;
}

// Host composition: migrate the incoming replica, merge into local, then boot
// the combined state. Older schema is exercised on each side by reversing roles.
function composed(T, M, pair, call) {
  const inputs=clone(pair),frames=[];
  const cut=(result,extra)=>{const value={result,inputs,...extra};frames.push({json:JSON.stringify(value),aliases:aliases(value)});};
  const remoteMigrated=M.migrate(inputs[call[1]]);
  cut(remoteMigrated,{args:[inputs[call[1]]]});
  const merged=T.mergeState(inputs[call[0]],remoteMigrated);
  cut(merged,{args:[inputs[call[0]],remoteMigrated]});
  const result=M.migrate(merged);
  cut(result,{args:[merged],remoteMigrated});
  return {frames,result};
}
for(const clock of clocks)for(const call of [[0,1],[1,0]]) {
  const pair=fixtures.find(x=>x.name==='old schema on one side preserves additive keyed records').build();
  const R=createMigrationReference(G,{clock,ids:deterministicIds(),Date:NativeDate});
  const expected=composed(reference(clock),R,pair,call);
  assert.equal(globalThis.Date,CandidateDate);
  const E=createEngine({clock,ids:deterministicIds()});
  const got=composed(E,E,pair,call);
  assert.deepEqual(got.frames,expected.frames,'host migrate(remote) -> merge -> migrate, every call cut');
  assert.equal(Object.keys(got.result.dailyLogs).length,2);assert.equal(got.result.proposals.length,2);
  comparisons++;
}

// An already-unioned qualifying record is booted without invoking merge. Boot
// must preserve the frozen refusal to mint new earned loads from legacy history.
for(const clock of clocks) {
  const pair=mintPair(),s=clone(pair[0]);
  Object.assign(s.sessionLog,pair[1].sessionLog);s.feed.push(...pair[1].feed);
  const expectedInput=clone(s),actualInput=clone(s);
  const R=createMigrationReference(G,{clock,ids:deterministicIds(),Date:NativeDate});
  const expected=R.migrate(expectedInput);
  const E=createEngine({clock,ids:deterministicIds()}),actual=E.migrate(actualInput);
  assert.equal(JSON.stringify({result:actual,input:actualInput}),JSON.stringify({result:expected,input:expectedInput}),'boot-only qualifying union, whole state');
  assert.deepEqual(aliases({result:actual,input:actualInput}),aliases({result:expected,input:expectedInput}),'boot-only qualifying union, return/input aliases');
  assert.equal(actual.queue.some(q=>q.newW===105&&!q.done),false);
  assert.equal(actual.feed.some(f=>f.t==='SYNTHETIC PRESS 105 EARNED'),false);
  assert.equal(globalThis.Date,CandidateDate);
  comparisons++;
}

// Ordinary merge versus a qualifying writer path with hostile dependencies. A
// swallowed access is still recorded; success alone cannot prove clock freedom.
function hostile(pair) {
  let armed=false;const accesses=[];
  const trap=(family,values)=>new Proxy(values,{get(target,key){if(armed){accesses.push(family+'.'+String(key));throw Error('synthetic blocked '+family);}return target[key];}});
  const c=trap('clock',clocks[0]),ids=trap('ids',{fresh(){throw Error('unexpected id');}}),drafts=trap('drafts',{length:0,key(){return null;}});
  const E=createEngine({clock:c,ids,drafts});armed=true;
  const result=capture(E,pair,[[0,1]]);
  const frozenAccess=[];const expected=capture(reference(clocks[0],true,frozenAccess),pair,[[0,1]]);
  assert.deepEqual(result.frames,expected.frames,'hostile dependency cut matches frozen behavior');
  assert.equal(accesses.some(a=>a.startsWith('ids.')||a.startsWith('drafts.')),false);
  return {result:result.last,accesses,frozenAccess};
}
const ordinary=hostile(fixtures[0].build());assert.deepEqual(ordinary.accesses,[]);assert.deepEqual(ordinary.frozenAccess,[]);
const mintedBlocked=hostile(mintPair());
assert.ok(mintedBlocked.accesses.includes('clock.today'));
assert.ok(mintedBlocked.frozenAccess.includes('new Date()'));
assert.equal(mintedBlocked.result.queue.some(q=>q.newW===105&&!q.done),false);
assert.equal(mintedBlocked.result.feed.some(f=>f.t==='SYNTHETIC PRESS 105 EARNED'),false);
assert.equal(globalThis.Date,CandidateDate);
console.log('M6 SYNTHETIC '+mode+': PASS — '+comparisons+' exact whole-state differential cases; '+fixtures.length+' two-device scenarios, both directions, repeat batch twice, two injected clocks; complete returns/inputs/aliases/receipts.');
console.log('M6 CLOCK '+mode+': ordinary merge makes no clock/ID/draft access; qualifying mint reads clock.today (frozen new Date), and blocked access suppresses the earn in both engines.');
