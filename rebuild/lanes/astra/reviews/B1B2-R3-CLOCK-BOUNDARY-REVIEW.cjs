'use strict';
const assert=require('node:assert/strict'),test=require('node:test');
const {fixture,control,read,advancing}=require('./B1B2-R3-CONSUMER-REVIEW.cjs');
function boundary(s,mode){
 const midnight=Date.parse('2026-09-04T00:00:00.000-04:00');
 const old=read('S',s,'2026-09-03',mode,advancing(midnight-1000,0));
 const start=midnight-old.trace.length-1;
 const S=read('S',s,'2026-09-03',mode,advancing(start,1)),T=read('T',s,'2026-09-03',mode,advancing(start,1));
 assert(S.trace.every(x=>x.ms<midnight),'entire old control completes before midnight');
 return{startISO:new Date(start).toISOString(),stepMs:1,S,T};
}
for(const [name,s]of [['unknown-debt',fixture(undefined)],['unknown-healthy',fixture(undefined,'healthy')],['pending-decision',control('decisions').s]])test('R9 actual Today day coherence '+name,()=>{
 const result=boundary(s,'single-now');
 assert.equal(result.S.out.tISO,'2026-09-03');assert.equal(result.S.out.workout.today,true);assert.equal(result.S.out.workout.iso,result.S.out.tISO);
 assert.equal(result.T.out.tISO,'2026-09-03');assert.equal(result.T.out.workout.today,true);
 console.log('REVIEW_CLOCK_BOUNDARY '+JSON.stringify({name,...result}));
 // A workout explicitly marked today must belong to the returned Today date.
 // This asserts an actual changed result, not equality of unused query counts.
 assert.equal(result.T.out.workout.iso,result.T.out.tISO,'R9-MIXED-TODAY-DATE: added recovery reads must not label tomorrow as today');
});
for(const [name,s]of [['finite-sleep',fixture(8)],['finite-healthy',fixture(8,'ten')],['logging',control('logging').s],['steps',control('steps').s]])test('R9 unchanged advancing-clock control '+name,()=>{
 for(const mode of ['single-fix','single-order','single-now']){const {S,T}=boundary(s,mode);assert.deepEqual(T,S,'complete original outputs/actual time values and calls stay identical');}
});
