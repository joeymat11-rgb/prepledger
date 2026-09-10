'use strict';
// Raw original desired laws only, no historical repair controls or mutations.
// This matrix is evidence for the cumulative successor, NOT PACKAGE acceptance
// or complete output/alias/receipt delta accounting.
process.env.TZ='America/New_York';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),dir=path.join(root,'rebuild/conform/v4'),NativeDate=Date;
const S=require('./load-write-source.cjs'),bundlePath=process.env.ENGINE_MAIN;
assert(bundlePath&&path.isAbsolute(bundlePath),'Explicit ENGINE_MAIN required');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(bundlePath)).digest('hex'),'ef574bc82f18fe555d70a9387e9cd8c5c8984b988be3fbea5f4272770f041ab5');
S.verify(root);
const files=fs.readdirSync(dir).filter(f=>/^laws-.*\.cjs$/.test(f)).sort();
const pinned=cp.execFileSync('git',['ls-tree','--name-only',S.BASE+':rebuild/conform/v4'],{cwd:root,encoding:'utf8',windowsHide:true}).trim().split('\n').filter(f=>/^laws-.*\.cjs$/.test(f)).sort();
assert.deepEqual(files,pinned,'Original law-file inventory');
for(const file of [...files,'helpers.cjs'])assert(fs.readFileSync(path.join(dir,file)).equals(cp.execFileSync('git',['show',S.BASE+':rebuild/conform/v4/'+file],{cwd:root,windowsHide:true})),'Original input pin: '+file);
const H=require(path.join(dir,'helpers.cjs'));
const laws=files.flatMap(file=>{const mod=require(path.join(dir,file));assert.deepEqual(mod.INVENTORY,mod.laws.map(l=>l.id));return mod.laws;}).sort((a,b)=>Number(a.defect.slice(1))-Number(b.defect.slice(1)));
assert.deepEqual(laws.map(l=>l.defect),Array.from({length:45},(_,i)=>'D'+(i+1)));
const fixed=new Set(['D12','D33','D34','D35','D41','D43']);let observations=0;
function execute(law,B){try{const r=law.run(B);assert.equal(typeof r.ok,'boolean');return r.ok?'GREEN':'RED';}catch(e){
 if(law.defect==='D44'&&e instanceof TypeError&&e.message==="Cannot read properties of null (reading 'agentProposals')")return 'DATED-THROW';
 throw Error('Unexpected raw law execution failure: '+law.defect); // never relay a protected value
}}
for(const mode of ['native','frozen'])for(const day of ['2026-09-03','2026-09-07']){
 if(mode==='frozen')globalThis.Date=class extends NativeDate{constructor(...a){super(...(a.length?a:[NativeDate.parse(day+'T16:00:00.000Z')]));}static now(){return NativeDate.parse(day+'T16:00:00.000Z');}};
 try{
  const bundles=['frozen','candidate'].map(kind=>{const B=H.bundle(kind,bundlePath);return {...B,clock:d=>H.clock(d===undefined?day:d),engine:d=>B.engine(d===undefined?day:d)};});
  let changed=0,unchanged=0;
  for(const law of laws){const statuses=bundles.map(B=>execute(law,B));const original=day==='2026-09-07'&&law.defect==='D27'?'GREEN':day==='2026-09-07'&&law.defect==='D44'?'DATED-THROW':'RED';
   assert.deepEqual(statuses,[original,fixed.has(law.defect)?'GREEN':original],'Exact expected raw status '+law.defect+' '+mode+' '+day);
   if(fixed.has(law.defect))changed++;else unchanged++;observations+=2;
   if(['D41','D43'].includes(law.defect))console.log('LOAD WRITE SEED '+law.defect+' '+mode+' '+day+': RED-frozen / GREEN-candidate');
  }
  console.log('RAW MATRIX '+mode+' '+day+': '+changed+' selected GREEN / '+unchanged+' inherited statuses unchanged; 45/45 accounted');
 }finally{globalThis.Date=NativeDate;}
}
console.log('LOAD WRITE RAW SEEDS: '+observations+'/360 exact status observations PASS; controls NOT called; full trace/alias/receipt PACKAGE accounting PENDING');
