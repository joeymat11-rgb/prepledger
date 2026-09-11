'use strict';
// Closed successor of the original five writer witnesses. The three old-defect
// predicates are changed only for source-projected/current executions. Every
// other assertion remains literal. Full expected frames are sealed first.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),S=require('./native-carriers-parent-source.cjs'),Expected=require('./load-write-expectations.cjs'),NativeDate=Date;
const parent=require('../../conform/v4/postfix/helpers/build-step-efficacy-expectations.cjs').createFrozenSource({root});
const source=Expected.createSource({root});Expected.verifySource(source);
const file=path.join(root,'rebuild/engine/test/defect-witnesses-7.cjs'),original=fs.readFileSync(file,'utf8');
assert.equal(S.sha(original),'990e814209aac63537288d80127e6a088b375c19562820cfec7bfd1a19a08d8a');
const R=require('../../engine/test/writers-reference.cjs');
const seam='  const R = createWriterReference({ clock, Date: NativeDate, random: deterministicRandom() });\n  const expected = execute(R);\n  const C = createEngine({ clock, ids: deterministicIds(clock, deterministicRandom()) });\n  const actual = execute(C);\n  assert.equal(JSON.stringify(actual), JSON.stringify(expected), label + \': exact complete outputs and pre/post-call inputs\');';
const collect='  const actual = execute(__engine(clock));\n  __record(label, actual);';
const predicates=[
 ['debut-vector','assert.deepEqual(s.exercises[0].wSets, [100, 95]);','assert.deepEqual(s.exercises[0].wSets, [105, 100]);'],
 ['reset-vector','assert.deepEqual(reset.exercises[0].wSets, [100, 95]);','assert.deepEqual(reset.exercises[0].wSets, [90, 85]);'],
 ['owned-entry',"assert.equal(r.s.sessionLog['2026-09-03'].entries[0].w, 100);","assert.equal(r.s.sessionLog['2026-09-03'].entries[0].w, 110);"]
];
function run(kind,mode){
 let bytes=S.replace(original,seam,collect,'one-sided witness collection');
 if(kind!=='parent')for(const [id,a,b]of predicates)bytes=S.replace(bytes,a,b,id);
 const rows=[];
 const req=name=>{
  if(['node:assert/strict','node:child_process'].includes(name))return require(name);
  if(name==='./writers-reference.cjs')return R;
  if(name==='../index.cjs')return {createEngine(){throw Error('Only explicit witness engine selector may load candidate');}};
  throw Error('Unlisted witness dependency');
 };
 const make=clock=>kind==='candidate'?require('../../engine/index.cjs').createEngine({clock,ids:R.deterministicIds(clock,R.deterministicRandom())}):R.createWriterReference({clock,Date:NativeDate,random:R.deterministicRandom(),enginePath:kind==='parent'?parent.projection:source.bundle});
 try{globalThis.Date=NativeDate;
  vm.runInThisContext('(function(require,process,console,__filename,__engine,__record){\n'+bytes+'\n})',{filename:file})(req,{...process,argv:[process.execPath,file,'--worker',mode]},Object.freeze({log(){}}),file,make,(label,frames)=>rows.push({id:label.split(' ')[0],frames}));
  assert.deepEqual(rows.map(row=>row.id),['D41','D42','D43','D44','D45']);return rows;
 }finally{globalThis.Date=NativeDate;}
}
const sealed=new Map();let phase='expectation construction';
try{
 for(const mode of ['frozen','native']){
  const prior=run('parent',mode),next=run('projected',mode);
  for(let i=0;i<5;i++)assert.equal(JSON.stringify(prior[i])===JSON.stringify(next[i]),!['D41','D43'].includes(next[i].id),'Only approved load witnesses change from accepted D12 parent');
  sealed.set(mode,JSON.stringify(next));
 }
 Expected.verifySource(source);console.log('NATIVE WITNESS EXPECTATIONS SEALED: 10 complete source-derived witness executions; no candidate loaded');
 S.verify(root);
 for(const mode of ['frozen','native']){phase=mode;const rows=run('candidate',mode);assert.equal(JSON.stringify(rows)===sealed.get(mode),true,'Exact complete witness results/input mutations/receipts');
  console.log('NATIVE DEFECT WITNESS '+mode+': 5/5 complete comparisons PASS; 3 exact changed predicates; D42/D44/D45 parent consequences unchanged');
 }
 console.log('NATIVE DEFECT WITNESSES: 10/10 complete comparisons PASS; original frozen files unchanged; PACKAGE receipt PENDING');
}catch(_){console.error('NATIVE DEFECT WITNESSES FAIL in '+phase+'; protected context withheld');process.exitCode=1;}
finally{sealed.clear();globalThis.Date=NativeDate;}
