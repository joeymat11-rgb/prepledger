'use strict';
// Scoped package proof controls; product bytes are restored in finally.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root=path.resolve(__dirname,'../../..'),S=require('./b-ntc-successors.cjs'),C=require('./b-ntc-runtime-closure.cjs');
const {sha}=require('../../conform/v4/postfix/target.cjs');
const spec=()=>JSON.parse(fs.readFileSync(path.join(root,'rebuild/lanes/b/tooling/packages/B-NTC.json')));
for(const file of ['rebuild/m4/workout/source-projection.cjs','rebuild/m4/workout/native-baseline.cjs',
  'rebuild/m3/w6/local/local-client.mjs','rebuild/m3/w6/local/initial-setup.mjs','rebuild/m4/workout/athlete-state.cjs']){
  test('actual owner child refuses source drift: '+file,()=>{
    const p=path.join(root,file),before=fs.readFileSync(p);
    try{fs.appendFileSync(p,'\n// qualification source drift\n');assert.throws(()=>S.preflight(),/Exact actual child supersession|Exact declared child bytes/);}
    finally{fs.writeFileSync(p,before);}
    assert.equal(sha(fs.readFileSync(p)),sha(before));
  });
}
test('runtime import closure refuses missing authoritative setup and native-baseline dependency pins',()=>{
  for(const file of ['rebuild/m3/w6/local/initial-setup.mjs','rebuild/m4/workout/native-baseline.cjs']){
    const s=spec();delete s.product[file];assert.throws(()=>C.verify(s),/Missing or wrong runtime closure pin/);
  }
});
test('shortened closure manifest refuses even with its candidate byte hash supplied',()=>{
  const p=path.join(root,C.FILE),before=fs.readFileSync(p),s=spec(),manifest=JSON.parse(before);
  delete manifest.files['rebuild/m3/w6/local/local-client.mjs'];
  try{fs.writeFileSync(p,JSON.stringify(manifest,null,2)+'\n');s.product[C.FILE].post=sha(fs.readFileSync(p));assert.throws(()=>C.verify(s),/Actual imported runtime closure differs/);}
  finally{fs.writeFileSync(p,before);}
  assert.equal(sha(fs.readFileSync(p)),sha(before));
});
test('archived parent and actual owner source remain separate after all restorations',()=>{
  const read=fs.readFileSync,load=Module._load,{a,spec:s,source,parent}=S.preflight();
  const file='rebuild/m4/workout/source-projection.cjs';
  assert.equal(parent.accepted,true,'Only the archived parent has acceptance');
  assert.equal(s.product[file].pre,a.executionPins[file]);assert.equal(s.product[file].role,'superseded-by-child');
  assert.equal(source.SUPPORT[file],s.product[file].post);assert.notEqual(source.SUPPORT[file],a.executionPins[file]);
  assert.equal(require('./native-carriers-source.cjs').SUPPORT[file],a.executionPins[file],'Ordinary original source verifier remains pinned to parent');
  assert.equal(typeof require('../workout/native-baseline.cjs').projectNativeBaseline,'function');
  assert.equal(fs.readFileSync,read);assert.equal(Module._load,load);
  assert(C.verify(s).files['rebuild/m3/w6/local/initial-setup.mjs']);
});
