'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const T=require('../target.cjs'),L=require('../legacy-gates.cjs'),S=require('../structural-delta.cjs'),M=require('../laws/set-one-era.cjs'),C=require('../helpers/set-one-era-mutants.cjs');
const FIXTURE_SHA='f4c72b029485a8a31fac5d24461f022a6dd8f54a4bf17a4423bb2d05254af352';
function run({root,selected=[]}){
 const {base,caseInput}=C.coordinates(root),bytes=fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/fixtures/set-one-era-deltas.json'));assert.equal(T.sha(bytes),FIXTURE_SHA,'SOURCE-ONLY-SEAL');const rows=JSON.parse(bytes)[0].cases;
 const bundle=path.join(root,'rebuild/conform/engines/engine-main.cjs'),bundleSha256=T.sha(fs.readFileSync(bundle));let cells=0,negative=false;
 for(const row of rows.filter(x=>!selected.length||selected.includes(x.id))){for(const matrix of base.matrix){const e=row.expectations.find(x=>x.mode===matrix.mode&&x.day===matrix.day),input={...caseInput,lawId:M.D30.id,caseId:row.id,...matrix};
  const frozen=T.runRaw({...input,kind:'direct-frozen',candidate:null,inventory:null,bundle,bundleSha256}),candidate=T.runRaw(input),trace=x=>({frames:x.frames,detail:x.detail});
  assert.deepEqual(L.assertions(frozen,row.assertions),row.originalFailures,row.id+' FROZEN-CLAIMS');assert.equal(T.sha(JSON.stringify(trace(frozen))),e.originalTraceSha256,row.id+' FROZEN-TRACE');
  assert.deepEqual(L.assertions(candidate,row.assertions),[],row.id+' CANDIDATE-CLAIMS');S.compareStructural(trace(frozen),trace(candidate),e.delta);
  if(!negative&&row.id==='ERA30-ORIGINAL'){const bad=structuredClone(trace(candidate)),call=bad.frames.find(f=>f.name==='setOneRead'),result=call.after[4].find(p=>p[0][1]==='result').at(-1),ex=result[4].find(p=>p[0][1]==='exId').at(-1);ex[1]='unlisted-output-change';assert.throws(()=>S.compareStructural(trace(frozen),bad,e.delta));negative=true;}
  cells++;}
 console.log(row.id+' ACTUAL FROZEN/CANDIDATE 4/4 exact trace PASS');}
 if(!selected.length)assert.equal(cells,140,'COMPLETE-INVENTORY');
 console.log('ERA30 ACTUAL DIRECT '+cells+' cells PASS; '+(negative?'unlisted output DETECTED':'output sensitivity not selected')+'; volume '+C.VOLUME_SHA);return{cells,negative};
}
module.exports={run,FIXTURE_SHA};
if(require.main===module)try{run({root:path.resolve(__dirname,'../../../../..'),selected:process.argv.length>2?process.argv.slice(2):['ERA30-ORIGINAL','ERA30-CLOCK-RETAINED-ENGINE','ERA30-READ-CUT-CURRENT','ERA30-CLOCK-AMBIENT-TRAP','ERA30-LAB-COUNTING','ERA30-LAB-LIVE']});}catch(e){console.error('ERA30 DIRECT ERROR: '+e.message.split('\n')[0]);process.exitCode=1;}
