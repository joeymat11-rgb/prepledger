'use strict';
// Synthetic fixtures and boundary adapters only. No private data is loaded here.
const NativeDate = globalThis.Date;
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const { createEngine } = require('../../engine/index.cjs');
const { createWriterReference, deterministicRandom, deterministicIds } = require('../../engine/test/writers-reference.cjs');
const clone = value => structuredClone(value);
let sourceLines;
function supplement(T, c) {
  // The bundle omits these diagnostic helpers. Compile only their exact pinned
  // declarations, with dependencies from that SAME frozen bundle, never modules.
  if (!sourceLines) {
    const bytes = execFileSync('git',['show','fe516c1:src/app.jsx'],{cwd:path.resolve(__dirname,'../../..'),maxBuffer:8*1024*1024,windowsHide:true});
    const hash = createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
    if (hash !== 'f98671d823f0d8cd83e730cdd930afe5f5e7b628') throw Error('Frozen diagnostic source mismatch');
    sourceLines = bytes.toString('utf8').split('\n');
  }
  const ranges = [[305,311],[1003,1005],[1858,1858],[2824,2824],[2835,2835],[4779,4797],[6994,6996]];
  const body = ranges.map(([a,b])=>sourceLines.slice(a-1,b).join('\n')).join('\n');
  const deps = ['nextLoad','partitionPrior','KCAL_PER_LB_FAT','KCAL_PER_LB_LEAN','KCAL_PER_LB_MIX','PRIOR_FAT_FRAC'];
  const added = new Function(...deps,body+'\nreturn {DAY,mk,isoOf,todayStart,daysUntil,fmtShort,weeksBetween,maxedOut,_bornValid,dripOf,energyDensityUncached,nightsBefore};')(...deps.map(k=>T[k]));
  class AtDate extends NativeDate { constructor(...args){super(...(args.length?args:[c.nowMs()]));} static now(){return c.nowMs();} }
  for (const [name, value] of Object.entries(added)) if (T[name] === undefined) T[name] = typeof value !== 'function' ? value : (...args) => {
    const before = globalThis.Date; globalThis.Date = AtDate;
    try { return value(...args); } finally { globalThis.Date = before; }
  };
  return T;
}
function clock(day = '2026-09-03') {
  let date = day;
  return { today: () => date, hour: () => 12,
    nowMs: () => new NativeDate(...date.split('-').map((x,i) => Number(x) - (i === 1 ? 1 : 0)), 12).getTime(),
    nowISO() { return new NativeDate(this.nowMs()).toISOString(); },
    dow() { return new NativeDate(this.nowMs()).getDay(); }, tz: 'America/New_York',
    set(next) { date = next; } };
}
function bundle(kind, enginePath) {
  if (!['frozen','candidate'].includes(kind)) throw Error('Unknown engine kind');
  return { kind, clock, engine(day = '2026-09-03') {
    const c = typeof day === 'string' ? clock(day) : day;
    return kind === 'frozen'
      ? supplement(createWriterReference({ clock: c, Date: NativeDate, random: deterministicRandom(),
          enginePath: enginePath || process.env.ENGINE_MAIN || path.resolve(__dirname,'../engines/engine-main.cjs') }), c)
      : createEngine({ clock: c, ids: deterministicIds(c, deterministicRandom()) }).__test;
  } };
}
function patch(B, name, replacementFactory) {
  return { ...B, engine(...args) {
    const T = B.engine(...args), original = T[name];
    if (typeof original !== 'function') throw Error('Missing engine function: ' + name);
    T.__auditOriginal = { ...T.__auditOriginal };
    if (!Object.hasOwn(T.__auditOriginal, name)) T.__auditOriginal[name] = original;
    T[name] = replacementFactory(original, T);
    return T;
  } };
}
const state = () => ({ v: 60, trend: 180, reads: [], weekly: [], dailyLogs: {}, sessionLog: {},
  sleep: { nights: [], needed: 3, debts: [], target: 8, cleanH: 7.5 }, exercises: [], queue: [], feed: [], forecasts: [], adjustments: [],
  proposals: [], suggestionLog: [], targets: {}, learned: { tdee: [], anchors: [] },
  plan: { goals: [], ifthen: [], setAt: {}, phaseLog: [] }, exOrder: { U: [], L: [] }, planGen: 52,
  retirements: {}, insertions: {}, waist: [], photos: [], events: [], trials: [], agentProposals: [],
  blackout: { until: '2026-07-27' }, model: { lean: 150, drip: 0, src: 'DEXA', anchorISO: '2026-08-01' }, dayCtx: {} });
const lift = (extra = {}) => ({ id: 'press', n: 'Press', w: 100, inc: 5, sets: 2, hi: 10, lo: 8,
  last: [8,7], setup: 'known', day: 'U', mg: 'chest', ...extra });
module.exports = { bundle, clock, state, lift, clone, patch };
