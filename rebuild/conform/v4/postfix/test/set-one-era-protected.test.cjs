'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const H=require('../helpers/set-one-era-protected.cjs');
const fs=require('node:fs'),path=require('node:path'),A=require('../acceptance.cjs'),S=require('../source-proof.cjs'),L=require('../legacy-gates.cjs'),T=require('../target.cjs');
const root=path.resolve(__dirname,'../../../../..');
function candidateInventory(){const parent=A.stepParentArtifact(root),old=L.object(root,parent.baseline.auditCommit,S.ERA_FILE).toString('utf8');return{...parent.candidateEngine,'volume.cjs':T.sha(S.applySetOneEraChanges(old,S.proposeSetOneEraChanges(old)))};}
function expectedRows(verdict){return H.MODES.flatMap(mode=>H.DAYS.map(day=>({mode,day,verdict})));}
test('Protected seeded-card comparison requires the unique named card and exact complete bytes',()=>{
  const x=[{id:'other',text:'invented other'},{id:'set1',text:'invented card',meta:{n:1}}];
  assert.equal(H.sameCard(x,structuredClone(x)),true);
  assert.equal(H.sameCard([],[]),false);assert.equal(H.sameCard([{id:'set1'},{id:'set1'}],[{id:'set1'}]),false);
  const y=structuredClone(x);y[1].meta.n=2;assert.equal(H.sameCard(x,y),false);
  const z=structuredClone(x);z[1].extra='invented';assert.equal(H.sameCard(x,z),false);
  const other=structuredClone(x);other[0].text='different invented non-target';assert.equal(H.sameCard(x,other),true);
});
test('Source expectations precede actual candidate seeded-card verification, with only closed verdict output',()=>{
  const p=H.prepareSeededSetOneCard({root});
  assert.deepEqual(p.sourceVerdict,{name:'D30-SEEDED-SET-ONE-CARD-SOURCE',status:'PASS',rows:expectedRows('UNCHANGED')});
  const result=p.compareCandidate({candidate:path.join(root,'rebuild/engine'),inventory:candidateInventory()});
  assert.deepEqual(result,{name:'D30-SEEDED-SET-ONE-CARD-CANDIDATE',status:'PASS',rows:expectedRows('UNCHANGED')});
  assert.throws(()=>p.compareCandidate({candidate:path.join(root,'rebuild/engine'),inventory:candidateInventory()}),{code:'ERA-SEEDED-CUSTODY-CONSUMED'});
  p.dispose();
});
test('An executable source-altered candidate fails the private card comparison after valid pins',()=>{
  const base=path.join(root,'.tmp/postfix/seeded-set-one-controls');fs.mkdirSync(base,{recursive:true});const copy=fs.mkdtempSync(path.join(base,'candidate-')),inventory=candidateInventory();
  try{
    for(const name of Object.keys(inventory))fs.copyFileSync(path.join(root,'rebuild/engine',name),path.join(copy,name));
    const file=path.join(copy,'volume.cjs'),before=fs.readFileSync(file,'utf8'),anchor='function setOneRead(s, exId) {\n';
    assert.equal(before.split(anchor).length,2);
    const fake={status:'LIVE',exId:'invented-control',n:998,pct:97,lo:96,hi:98,from:'2000-01-01',to:'2000-01-02'};
    const after=before.replace(anchor,anchor+'  return '+JSON.stringify(fake)+';\n');fs.writeFileSync(file,after);inventory['volume.cjs']=T.sha(after);
    const p=H.prepareSeededSetOneCard({root});assert.equal(p.sourceVerdict.status,'PASS');
    // This public invented result proves the altered factory compiled/executed,
    // so the negative below is not merely a syntax error or rejected file pin.
    const factory=T.loadCandidate(copy,inventory),engine=factory({clock:T.clock(),ids:{fresh:()=>''}}).__test;
    assert.deepEqual(engine.setOneRead({exercises:[],sessionLog:{}},'invented-control'),fake);
    assert.deepEqual(p.compareCandidate({candidate:copy,inventory}),{name:'D30-SEEDED-SET-ONE-CARD-CANDIDATE',status:'RED',rows:expectedRows('RED')});p.dispose();
  }finally{assert(path.resolve(copy).startsWith(path.resolve(base)+path.sep));fs.rmSync(copy,{recursive:true,force:true});}
});
