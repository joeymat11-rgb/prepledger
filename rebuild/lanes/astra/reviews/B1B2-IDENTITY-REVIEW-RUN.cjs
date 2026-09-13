'use strict';
const assert=require('node:assert/strict'),test=require('node:test'),path=require('node:path');
assert(process.env.EARNED_REVIEW_ROOT,'Root driver verifies exact public source manifest before invoking');
assert.equal(process.env.TZ,'America/New_York');
const H=require(path.join(process.env.EARNED_REVIEW_ROOT,'rebuild/engine/test/b1b2-public-engine.cjs'));
const A=require('./B1B2-IDENTITY-REVIEW-ANNEX.cjs');
test('REVIEW Q2 fixed whole-name owner, group, identity and order controls',()=>{console.log('REVIEW_Q2 '+JSON.stringify(A.runQ2(H)));});
if(!process.env.EARNED_REVIEW_Q2_ONLY){
 let observations;
 test('REVIEW D7 runnable native-view legacy-origin paired controls',()=>{observations=A.runD7(H,process.env.EARNED_REVIEW_SIDE||'candidate');console.log('REVIEW_D7 '+JSON.stringify(observations));});
 test('REVIEW D7 future-only row excluded through fallback',()=>{assert(observations,'Prior actual paired controls must complete');A.assertFutureOnlyExclusion(observations);});
}
