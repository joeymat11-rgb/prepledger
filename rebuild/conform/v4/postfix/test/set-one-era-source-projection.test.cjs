'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const H=require('../helpers/set-one-era-source-projection.cjs'),F=require('../helpers/step-efficacy-frozen.cjs');
const root=path.resolve(__dirname,'../../../../..');
test('D30 source projection restores every frozen byte and rejects any other preimage',()=>{
  const original=F.frozenSource(root),projected=H.projectSource(original);
  assert.equal(projected.replace(H.FORKS,'').replace(H.GUARD,''),original);
  assert.equal(projected.split(H.FORKS).length,2);assert.equal(projected.split(H.GUARD).length,2);
  assert.throws(()=>H.projectSource(original+'\n'),{code:'SO30-FROZEN-SOURCE-PIN'});
  assert.throws(()=>H.projectSource(projected),{code:'SO30-FROZEN-SOURCE-PIN'});
});
test('D30 source construction refuses extra candidate input and non-root directories',()=>{
  assert.throws(()=>H.createFrozenSource({root,candidate:root}),{code:'SO30-EXPECTED-FROZEN-ONLY'});
  assert.throws(()=>H.createFrozenSource({root:path.join(root,'rebuild/engine')}),{code:'SO30-EXPECTED-REPO'});
});
test('D30 source factory requires an owned receipt and verified bundle bytes',()=>{
  assert.throws(()=>H.createFrozenEngine({source:{root},clock:{nowMs:()=>0}}),{code:'SO30-SOURCE-RECEIPT'});
});
test('D30 whole-bundle projection reaches lexical readers on invented input; no candidate loads',()=>{
  const source=H.createFrozenSource({root});
  const clock={nowMs:()=>Date.UTC(2026,8,3,16),today:()=>new Date(2026,8,3,12)};
  const a=H.createFrozenEngine({source,clock}),b=H.createFrozenEngine({source,project:true,clock});
  for(const t of [a,b]){t.HISTORY.length=0;t.ROLLUPS.length=0;assert.equal(typeof t.labAnalytics2,'function');}
  const s={exercises:[{id:'invented-lift',w:100,forks:[{from:'2026-09-01',kind:'technique'}]}],sessionLog:{'2026-08-01':{entries:[{id:'invented-lift',w:100,reps:[8]}]},'2026-09-02':{entries:[{id:'invented-lift',w:100,reps:[9]}]}}};
  const before=JSON.stringify(s);
  assert.deepEqual(a.setOneRead(s,'invented-lift'),{status:'COUNTING',exId:'invented-lift',n:2,need:4});
  assert.deepEqual(b.setOneRead(s,'invented-lift'),{status:'COUNTING',exId:'invented-lift',n:1,need:4});
  assert.equal(JSON.stringify(s),before);
  assert.equal(Object.keys(require.cache).some(p=>/[/\\]rebuild[/\\]engine[/\\](?!test[/\\])/.test(p)),false);
  const bytes=fs.readFileSync(source.projection);
  try{fs.appendFileSync(source.projection,'\n');assert.throws(()=>H.createFrozenEngine({source,project:true,clock}),{code:'SO30-BUNDLE-PIN'});}
  finally{fs.writeFileSync(source.projection,bytes);}
  assert.deepEqual(H.createFrozenEngine({source,project:true,clock}).setOneRead(s,'invented-lift'),{status:'COUNTING',exId:'invented-lift',n:1,need:4});
});
