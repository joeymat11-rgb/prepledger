'use strict';
// Focused real-source controls. Only export the runner's unchanged functions;
// do not execute its FULL/CI main or substitute authority/source implementations.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root=path.resolve(__dirname,'../../..'),C=require('./b-ntc-runtime-closure.cjs');
const spec=()=>JSON.parse(fs.readFileSync(path.join(root,'rebuild/lanes/b/tooling/packages/B-NTC.json')));
const clone=x=>JSON.parse(JSON.stringify(x));
for(const file of ['rebuild/m3/w6/local/calendar.mjs','rebuild/m3/w7-preview/today/today-entry.mjs',
  'rebuild/m3/w6/test/local-owner-entry.test.mjs','rebuild/m3/w6/test/local-owner-browser.mjs'])
test('final closure refuses real disk drift: '+file,()=>{
  const full=path.join(root,file),before=fs.readFileSync(full);
  try{fs.appendFileSync(full,'\n// public source drift control\n');assert.throws(()=>C.verify(spec()),/Actual imported runtime closure differs/);}
  finally{fs.writeFileSync(full,before);}
  assert(fs.readFileSync(full).equals(before));
});
test('calendar and entry tests cannot disappear from the actual source declaration',()=>{
  for(const file of ['rebuild/m3/w6/local/calendar.mjs','rebuild/m3/w6/test/local-owner-entry.test.mjs']){
    const s=spec();delete s.product[file];assert.throws(()=>C.verify(s),/Missing or wrong runtime closure pin/);
  }
  assert(C.verify(spec()).files['rebuild/m3/w6/test/local-owner-browser.mjs']);
});
function api(){
  const file=path.join(root,'rebuild/lanes/b/tooling/b-package.cjs'),source=fs.readFileSync(file,'utf8');
  const marker='// ------------------------------------------------------------------ 8. main sequence';assert.equal(source.split(marker).length,2);
  const m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));
  const argv=process.argv;process.argv=[process.execPath,file,'--ci','--package','B-NTC'];
  try{m._compile(source.split(marker)[0]+'\nmodule.exports={loadSuccessorPolicy,validateSuccessorDefinition,successorAuthorization,successorSupport,MOVES_RULING};',file);}
  finally{process.argv=argv;}
  return m.exports;
}
const bound=()=>({option:spec().parent.options.find(p=>p.id==='NATIVE-CARRIERS'),
  acceptance:JSON.parse(fs.readFileSync(path.join(root,'rebuild/m4/spec/acceptance-native-carriers.json')))});
test('real final policy validator accepts the exact committed proposed definition',()=>{
  const a=api(),s=spec(),p=a.loadSuccessorPolicy();
  assert.equal(a.validateSuccessorDefinition(s,bound(),p),p);
  assert.equal(s.children.length,19);assert.equal(p.children.length,19);
  assert.deepEqual(s.coverage.moves,{});assert.equal(a.MOVES_RULING,null);
});
test('actual entry helper-as-test argv or shortened verdict cannot retain policy coverage',()=>{
  const a=api(),p=a.loadSuccessorPolicy();
  for(const change of [c=>c.argv=['--test','rebuild/m4/spec/native-carriers-source.cjs'],c=>c.needle='# pass 1']){
    const s=clone(spec());change(s.children.find(c=>c.name==='owner-entry-calendar'));
    assert.throws(()=>a.validateSuccessorDefinition(s,bound(),p),/SUCCESSOR-CHILD-DECLARATIONS/);
  }
});
test('missing, changed or wrongly classified final sources refuse the exact policy',()=>{
  const a=api(),p=a.loadSuccessorPolicy(),file='rebuild/m3/w6/local/calendar.mjs';
  for(const change of [s=>delete s.product[file],s=>s.product[file].post='0'.repeat(64),s=>s.product[file].role='carried']){
    const s=clone(spec());change(s);assert.throws(()=>a.validateSuccessorDefinition(s,bound(),p),/SUCCESSOR-PRODUCT-CLOSURE/);
  }
});
test('correct source policy supplies no PM authority or child receipt',()=>{
  const a=api(),s=spec();assert.equal(s.authorizations.theme,null);assert.equal(s.brief.acceptedLedgerLine,null);
  assert.throws(()=>a.successorSupport(s,bound()),/SUCCESSOR-PM-AUTHORITY-UNISSUED/);
});

require('./b-ntc-existing-dependencies.test.cjs');
