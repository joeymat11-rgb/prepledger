'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../..');
const S=require('./b-ntc-successors.cjs');
// The archived two-file overlay must not conceal changed actual-child bytes.
// All three are candidate-owned paths. Originals are restored before returning.
for(const file of ['rebuild/m4/workout/engine-runtime.cjs','.github/workflows/rebuild.yml','rebuild/m4/workout/native-trend-context.cjs']){
  test('actual-child preflight refuses undeclared drift in '+file,()=>{
    const p=path.join(root,file),before=fs.readFileSync(p);
    try{fs.writeFileSync(p,Buffer.concat([before,Buffer.from('\n// undeclared child drift\n')]));
      assert.throws(()=>S.preflight(),/Exact actual child supersession|Exact declared child bytes/);
    }finally{fs.writeFileSync(p,before);}
    assert(fs.readFileSync(p).equals(before),'Candidate byte restoration');
  });
}
test('full archived-parent plus actual-child preflight succeeds after all restorations',()=>{
  const read=fs.readFileSync,load=require('node:module')._load;
  S.preflight();
  assert.equal(fs.readFileSync,read,'No global filesystem overlay survives');
  assert.equal(require('node:module')._load,load,'No global module loader hook');
});
