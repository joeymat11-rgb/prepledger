'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../legacy-set-one-era-carriers.cjs'),P=require('../legacy-carriers.cjs'),STEP=require('../legacy-step-efficacy-carriers.cjs');
const H=require('../helpers/set-one-era-source-projection.cjs'),L=require('../legacy-gates.cjs'),{sha}=require('../target.cjs');
const root=path.resolve(__dirname,'../../../../..'),rel=id=>'rebuild/engine/test/'+id+'.cjs';
function original(id){const bytes=L.object(root,P.ORIGINAL_COMMIT,rel(id));assert.ok(bytes.equals(fs.readFileSync(path.join(root,rel(id)))));return bytes;}
test('D30 carries the exact nine STEP gates plus one original witness4 invocation',()=>{
  assert.deepEqual(C.CARRIER_IDS,[...STEP.CARRIER_IDS,'defect-witnesses-4']);assert.equal(new Set(C.CARRIER_IDS).size,10);
});
test('D30 source gates preserve every STEP substitution and add only exact volume comparison',()=>{
  for(const id of C.SOURCE_IDS){const bytes=original(id),prior=STEP.prepareCarrier(id,bytes),next=C.prepareCarrier(id,bytes);
    assert.deepEqual(next.edits.slice(0,-1),prior.edits);assert.equal(next.edits.at(-1).site,'D30-exact-prior-volume-module');
    assert.equal(next.source.split('__carrier.priorVolume(').length,2);assert.equal(next.sourceHash,sha(bytes));
    assert.throws(()=>C.prepareCarrier(id,Buffer.concat([bytes,Buffer.from('\n')])));
  }
});
test('D30 witness changes one exact expected result, preserves all other program bytes',()=>{
  const bytes=original('defect-witnesses-4'),next=C.prepareCarrier('defect-witnesses-4',bytes);
  assert.equal(next.source.replace(C.WITNESS_AFTER,C.WITNESS_BEFORE),bytes.toString('utf8'));
  assert.equal(next.edits.length,1);assert.throws(()=>C.prepareCarrier('defect-witnesses-4',Buffer.from(next.source)),{code:'ERA-WITNESS-PIN'});
});
test('Actual whole frozen witness4 and exact source-projected successor execute all five invented cases',()=>{
  const source=H.createFrozenSource({root}),bytes=original('defect-witnesses-4'),next=C.prepareCarrier('defect-witnesses-4',bytes);
  const beforeTZ=process.env.TZ;process.env.TZ='America/New_York';
  function execute(program,project){const codes=[];
    const sandbox={require(name){if(name==='node:assert/strict')return assert;if(name==='../index.cjs')return{createEngine(options){const t=H.createFrozenEngine({source,project,...options});t.HISTORY.length=0;t.ROLLUPS.length=0;return{__test:t};}};throw Error('ERA-TEST-UNEXPECTED-IMPORT');},structuredClone,process,console:{log(text){if(text.startsWith('REPRODUCED '))codes.push(text.slice(11,14));}}};
    let error;try{new Function('require','console','structuredClone','process',program)(sandbox.require,sandbox.console,structuredClone,process);}catch(e){error=e;}
    return{codes,error};
  }
  try{
    for(const [program,project]of [[bytes.toString('utf8'),false],[next.source,true]]){const r=execute(program,project);assert.equal(r.error,undefined);assert.deepEqual(r.codes,['D28','D29','D30','D31','D32']);}
    for(const [program,project]of [[next.source,false],[bytes.toString('utf8'),true]]){const r=execute(program,project);assert.equal(r.error?.code,'ERR_ASSERTION');assert.deepEqual(r.codes,['D28','D29']);}
  }finally{if(beforeTZ===undefined)delete process.env.TZ;else process.env.TZ=beforeTZ;}
});
