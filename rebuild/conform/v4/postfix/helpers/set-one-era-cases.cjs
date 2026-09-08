'use strict';
// Wholly invented direct states. Never clone SEED or authored HISTORY/ROLLUPS.
const NativeDate = Date, id = 'synthetic-press';
function shift(day, offset) { const d = new NativeDate(day + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + offset); return d.toISOString().slice(0, 10); }
function state(day) { return {trend: 180, model: {lean: 150, anchorISO: '2026-01-01', drip: 0, src: 'DEXA'},
  weekly: [], reads: [{d: day, w: 180}], dailyLogs: {}, sleep: {nights: [-3, -2, -1].map(n => ({d: shift(day, n), h: 8})), cleanH: 7.5, needed: 3},
  sessionLog: {}, blackout: {until: '2025-01-01'}, learned: {anchors: []}, events: [], dayCtx: {}, plan: {}, targets: {}, exercises: [], queue: []}; }
function lift(extra = {}) { return {id, n: 'Synthetic press', w: 100, sets: 3, hi: 12, lo: 8, setup: 'Invented setup', day: 'U', mg: 'chest', ...extra}; }
function session(y, w = 100) { return {entries: [{id, w, reps: [y, y], rirSets: [0, 0]}]}; }
function fixture(day, points, ex = {}) { const s = state(day); s.exercises = [lift(ex)]; for (const [n, y, w] of points) s.sessionLog[shift(day, n)] = session(y, w === undefined ? 100 : w); return s; }
const cases = [], add = (name, make) => cases.push({id: name, make});
const count = n => ({status: 'COUNTING', exId: id, n, need: 4});
const old = [[-20, 70], [-19, 80], [-18, 90], [-17, 100]];
const current = [[0, 10], [1, 11], [2, 12], [3, 13]];
add('ERA30-ORIGINAL', day => {
  const s = state(day); s.exercises = [lift({forks: [{from: '2026-09-01', kind: 'technique', prevN: 'Other technique'}]})];
  for (const [i, d] of ['2026-08-10', '2026-08-17', '2026-08-24', '2026-09-03'].entries()) s.sessionLog[d] = session(10 + i);
  return {s, expected: count(1), included: ['2026-09-03'], queryCalls: 1, frozenStatus: 'LIVE'};
});
add('ERA30-NONE', day => ({s: fixture(day, current), unchanged: true, included: current.map(p => shift(day, p[0])), queryCalls: 0}));
add('ERA30-EMPTY-OVERRIDES-LEGACY', day => ({s: fixture(day, current, {forks: [], fork: {from: shift(day, 2)}}), unchanged: true,
  included: current.map(p => shift(day, p[0])), queryCalls: 0}));
add('ERA30-LEGACY', day => ({s: fixture(day, [...old, [0, 13]], {fork: {from: shift(day, -1)}}), expected: count(1), included: [day], queryCalls: 1}));
for (const [name, forks] of [
  ['BOUNDARY', [-6, -2]], ['MULTIPLE-PERMUTED', [-2, -6]], ['MULTIPLE-DUPLICATE', [-2, -6, -2]]
]) add('ERA30-' + name, day => ({s: fixture(day, [[-7, 10], [-6, 11], [-5, 12], [-3, 13], [-2, 14], [-1, 15], [0, 16]],
  {forks: forks.map(n => ({from: shift(day, n), kind: 'technique'}))}), expected: count(3), included: [-2, -1, 0].map(n => shift(day, n)), queryCalls: 1}));
add('ERA30-UNRELATED-EXERCISE', day => {
  const s = fixture(day, current); s.exercises.push(lift({id: 'other', forks: [{from: shift(day, 1)}]}));
  return {s, unchanged: true, included: current.map(p => shift(day, p[0])), queryCalls: 0};
});
add('ERA30-FUTURE-WITHIN-QUERY-ERA', day => ({s: fixture(day, [[-5, 99], [-4, 10], [-1, 11], [0, 12], [2, 13], [3, 80], [4, 90]],
  {forks: [-4, 3].map(n => ({from: shift(day, n), kind: 'technique'}))}), expectedFit: [10, 11, 12, 13],
  included: [-4, -1, 0, 2].map(n => shift(day, n)), queryCalls: 1}));
add('ERA30-FUTURE-CROSSED-QUERY', day => ({s: fixture(day, [[-5, 99], [-4, 10], [-1, 11], [0, 12], [2, 13], [3, 80], [4, 90]],
  {forks: [-4, 3].map(n => ({from: shift(day, n), kind: 'technique'}))}), queryDay: shift(day, 4), expected: count(2),
  included: [3, 4].map(n => shift(day, n)), queryCalls: 1}));
add('ERA30-CLOCK-RETAINED-ENGINE', day => ({s: fixture(day, [[-5, 99], [-4, 10], [-1, 11], [0, 12], [2, 13], [3, 80], [4, 90]],
  {forks: [-4, 3].map(n => ({from: shift(day, n), kind: 'technique'}))}), sequence:[day,shift(day,4)],
  expectedSequence:[{fit:[10,11,12,13],dates:[-4,-1,0,2].map(n=>shift(day,n))},{value:count(2)}],
  included:[-4,-1,0,2,3,4].map(n=>shift(day,n)), queryCalls:2}));
for (const n of [0, 1, 3, 4]) add('ERA30-COUNT-' + n, day => ({s: fixture(day, [...old, ...current.slice(0, n)],
  {forks: [{from: shift(day, -1), kind: 'technique'}]}), ...(n < 4 ? {expected: count(n)} : {expectedFit: [10, 11, 12, 13]}),
  included: current.slice(0, n).map(p => shift(day, p[0])), queryCalls: 1}));
for (const [name, ys] of [['FLAT', [10, 10, 10, 10]], ['INCREASING', [10, 11, 12, 13]], ['DECREASING', [13, 12, 11, 10]]]) {
  add('ERA30-FIT-' + name, day => ({s: fixture(day, [...old, ...ys.map((y, i) => [i, y])], {forks: [{from: shift(day, -1)}]}),
    expectedFit: ys, included: [0, 1, 2, 3].map(n => shift(day, n)), queryCalls: 1}));
  add('ERA30-FIT-' + name + '-WITHOUT-OLD', day => ({s: fixture(day, ys.map((y, i) => [i, y]), {forks: [{from: shift(day, -1)}]}),
    expectedFit: ys, included: [0, 1, 2, 3].map(n => shift(day, n)), queryCalls: 1}));
}
add('ERA30-IDLE-ABSENT', day => ({s: state(day), expected: {status: 'IDLE', exId: id}, included: [], queryCalls: 0, idle: true}));
add('ERA30-IDLE-TEXT-WEIGHT', day => ({s: fixture(day, current, {w: '100', forks: [{from: day}]}), expected: {status: 'IDLE', exId: id}, included: [], queryCalls: 0, idle: true}));
add('ERA30-NAN-WEIGHT-UNCHANGED', day => ({s: fixture(day, current.map(([n, y]) => [n, y, NaN]), {w: NaN}),
  unchanged: true, included: current.map(p => shift(day, p[0])), queryCalls: 0}));
add('ERA30-SET-COUNT-NO-FORK', day => ({s: fixture(day, current, {sets: 5}), unchanged: true,
  included: current.map(p => shift(day, p[0])), queryCalls: 0}));
add('ERA30-FILTERS-LOAD-REPS', day => {
  const s = fixture(day, [...old, [0, 10, '100'], [1, '11'], [2, 12], [3, 13], [4, 99, 101], [5, 77], [6, 66]], {forks: [{from: shift(day, -1)}]});
  s.sessionLog[shift(day, 5)].entries[0].reps = []; delete s.sessionLog[shift(day, 6)].entries[0].reps;
  return {s, expectedFit: [10, 11, 12, 13], included: [0, 1, 2, 3].map(n => shift(day, n)), queryCalls: 1};
});
add('ERA30-FILTERS-HARD', day => {
  const s=fixture(day,[...old,...Array.from({length:7},(_,i)=>[i,10+i])],{forks:[{from:shift(day,-1)}]});
  s.events=[{d:day,t:'Invented event'}];
  return {s,expectedFit:[13,14,15,16],included:[3,4,5,6].map(n=>shift(day,n)),
    weatherDates:[0,1,2,3,4,5,6].map(n=>shift(day,n)),paceDates:[3,4,5,6].map(n=>shift(day,n)),queryCalls:1};
});
add('ERA30-FILTERS-RUSHED', day => {
  const s=fixture(day,[...old,...current,[4,14]],{forks:[{from:shift(day,-1)}]});s.sessionLog[day].pace='rushed';
  return {s,expectedFit:[11,12,13,14],included:[1,2,3,4].map(n=>shift(day,n)),
    weatherDates:[0,1,2,3,4].map(n=>shift(day,n)),paceDates:[0,1,2,3,4].map(n=>shift(day,n)),queryCalls:1};
});
for (const [name, ys] of [['ZERO', [0, 0, 0, 0]], ['NEGATIVE', [-1, -2, -3, -4]]]) add('ERA30-FILTERS-' + name, day =>
  ({s: fixture(day, [...old, ...ys.map((y, i) => [i, y])], {forks: [{from: shift(day, -1)}]}), expected: count(0),
    included: [0, 1, 2, 3].map(n => shift(day, n)), queryCalls: 1}));
for (const which of ['OLD', 'CURRENT']) add('ERA30-READ-CUT-' + which, day => {
  const s = fixture(day, [...old, [0, 13]], {forks: [{from: shift(day, -1)}]}), at = which === 'OLD' ? shift(day, -20) : day;
  Object.defineProperty(s.sessionLog, at, {enumerable: true, configurable: true, get() { throw new TypeError('SYNTHETIC_SESSION_ACCESSOR'); }});
  return {s, ...(which === 'OLD' ? {expected: count(1), included: [day]} : {error: 'TypeError:SYNTHETIC_SESSION_ACCESSOR', included: []}),
    queryCalls: 1, frozenError: 'TypeError:SYNTHETIC_SESSION_ACCESSOR'};
});
add('ERA30-CLOCK-AMBIENT-TRAP',day=>({...cases.find(c=>c.id==='ERA30-FUTURE-WITHIN-QUERY-ERA').make(day),trap:true}));
add('ERA30-LAB-COUNTING',day=>({...cases.find(c=>c.id==='ERA30-ORIGINAL').make(day),lab:true,labStatus:'ARMED'}));
add('ERA30-LAB-LIVE',day=>({...cases.find(c=>c.id==='ERA30-FIT-INCREASING').make(day),lab:true,labStatus:'LIVE'}));
module.exports = {cases, id, shift, state, lift, session, fixture};
