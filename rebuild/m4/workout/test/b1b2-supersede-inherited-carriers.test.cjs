'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const H=require('./b1b2-evidence.cjs');
if(process.env.B1B2_MIGRATION_STAGE!==undefined) {
  assert.equal(process.env.B1B2_MIGRATION_STAGE,'worker');assert.ok(['M','R'].includes(process.env.B1B2_MIGRATION_SIDE));assert.ok(['frozen','native'].includes(process.env.B1B2_MIGRATION_CLOCK));
  assert.deepEqual(process.argv.slice(2),[]);
  H.migrationWorker(H[process.env.B1B2_MIGRATION_SIDE],process.env.B1B2_MIGRATION_CLOCK);
  // No parent-family terminal or tests here: an externally selected worker can
  // never satisfy the registered complete child or omit another side silently.
} else {
  assert.equal(process.env.B1B2_MIGRATION_SIDE,undefined);assert.equal(process.env.B1B2_MIGRATION_CLOCK,undefined);
function constants(ref) {
  const file='rebuild/engine/constants.cjs',m=new Module(path.join(H.ROOT,file));m.filename=path.join(H.ROOT,file);
  m.require=()=>{throw Error('CONSTANTS_UNDECLARED_DEPENDENCY');};m._compile(H.blob(ref,file).toString(),m.filename);return m.exports();
}
test('B1B2/INHERITED-1 complete prior inventory, eight successors, original H3 construction',()=>{
  H.original('h3-supersede-inherited-carriers.test.cjs');H.closedEngineInventory();H.reconstructRuntime();H.reconstructH3();
});
test('B1B2/INHERITED-2 original H3 SUP-6 constants export and four-label differential',()=>{
  const accepted=constants(H.H3_BASE),ours=constants(H.R);
  assert.deepEqual(Object.keys(ours).sort(),Object.keys(accepted).sort());
  assert.deepEqual(Object.keys(accepted).filter(k=>JSON.stringify(accepted[k])!==JSON.stringify(ours[k])).sort(),['MG_LABEL']);
  for(const [k,v] of Object.entries(accepted.MG_LABEL))assert.equal(ours.MG_LABEL[k],v);
  assert.deepEqual(Object.keys(ours.MG_LABEL).filter(k=>!Object.hasOwn(accepted.MG_LABEL,k)).sort(),['back_lats','back_lower','back_traps','back_upper']);
  assert.deepEqual(H.disk('rebuild/engine/constants.cjs'),H.blob(H.M,'rebuild/engine/constants.cjs'));
});
test('B1B2/INHERITED-3 original H3 SUP-7 red-first region heads and complete producer scan',()=>{
  const ours=constants(H.R),accepted=constants(H.H3_BASE),keys=['back_lats','back_upper','back_traps','back_lower'];
  for(const k of keys){assert.ok(Object.hasOwn(ours.MG_LABEL,k));assert.equal(Object.hasOwn(accepted.MG_LABEL,k),false);}
  const hits=[];
  function walk(dir){for(const e of fs.readdirSync(path.join(H.ROOT,dir),{withFileTypes:true})){
    if(e.name==='node_modules')continue;const p=dir+'/'+e.name;if(e.isDirectory()){walk(p);continue;}
    if(!/\.(cjs|mjs|js|json)$/.test(e.name))continue;
    const source=fs.readFileSync(path.join(H.ROOT,p),'utf8');for(const k of keys)if(source.includes(k))hits.push(p);
  }}
  for(const root of ['rebuild/engine','rebuild/m3/w7-preview/today','rebuild/m4/workout'])walk(root);
  assert.deepEqual([...new Set(hits)].filter(f=>!f.startsWith(H.W)).sort(),['rebuild/engine/constants.cjs']);
});
test('B1B2/INHERITED-4 all original combined witnesses including witness 2',()=>{
  const rows=require('../../../conform/v4/postfix/legacy-b1b2-carriers.cjs').runPublic();
  assert.equal(rows.length,4);assert.equal(rows.reduce((n,r)=>n+r.edits.length,0),35);
  const two=rows.find(r=>r.id==='defect-witnesses-2');assert.equal(two.cases,11);assert.equal(two.edits.filter(e=>e.site.startsWith('D12-')).length,2);
});
test('B1B2/INHERITED-5 full native migration continuity with exact admitted deltas',()=>{
  const rows=H.migrationContinuity();assert.ok(rows.length>1);console.log('B1B2 MIGRATION CONTINUITY: '+JSON.stringify(rows));
});

}
