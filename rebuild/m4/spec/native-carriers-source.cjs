'use strict';
// Closed source construction for M2-NATIVE-CARRIERS. This checks BYTES; it does
// not replace the package's receipt, behaviour or whole-engine obligations.
//
// Every adopted engine byte is either (a) reconstructed from the pinned
// sourceBase by an exact, unique literal carrier, or (b) a whole-file adoption
// pinned by sha256. Nothing is transformed, rounded or re-formatted.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const BASE='189523bdb2fa37187ce9e08b93c4e6dc27d41efd';
const root=path.resolve(__dirname,'../../..');
// Closed rebuild/engine inventory AFTER adoption: the parent's sixteen plus the
// two native files this package adds.
const RETAINED=['constants','dates','earn','energy','index','merge','migrate','oracle-shim','plan','policy','progression','seed','sleep','today','volume','writers'].map(n=>'rebuild/engine/'+n+'.cjs');
const NEW=['rebuild/engine/performed.cjs','rebuild/engine/entered-load.cjs'];
const ENGINE=[...RETAINED,...NEW];
// Whole-file adoptions. performed.cjs is the accepted L candidate's own new file
// (reviews rev171/173/174/175); entered-load.cjs is the in-tree candidate byte
// set that performed.cjs requires, taken verbatim from sourceBase.
const WHOLE={
 'rebuild/engine/performed.cjs':{sha256:'2372e66ba4e31f7229c870e4d1e2e95855d7a49ee705394c23b53b84ec249f3a',origin:'native-candidate-L changed/rebuild/engine/performed.cjs (HASHES-L-AFTER.sha256)'},
 'rebuild/engine/entered-load.cjs':{sha256:'2a0cd97ec843924e6dc428f2dbb0fe3c5bf10335610a3315c205c84fc324a3a3',origin:'rebuild/m4/spec/configured-load-candidate/entered-load.cjs @ sourceBase'},
};
// Adopted support/execution files, each a whole-file adoption of the accepted L
// bytes. They are not engine product; they are pinned as execution.
const SUPPORT={
 'rebuild/m4/spec/native-next-target-candidate/fixture.cjs':'2554ae6ecd553df70473cc417676512e7e7188bdbcb150497698568e81df86a9',
 'rebuild/m4/spec/native-next-target-candidate/import-engine-assembly.cjs':'cb58dafbaed93e72bb94329219a4d6c36a80b88485456cfbc7620628d1f4ca22',
 'rebuild/m4/spec/native-next-target-candidate/reach.cjs':'6b76c5e45c089cf25873fd1d4b4c66f318ea20b0a3eb291b6164888cb7a2242c',
 'rebuild/m4/spec/native-next-target-candidate/source-delta.cjs':'fce1c2f92bf445373fdab39fdd1e2f16705f0312c6b3b8347c225dae6639ea6a',
 'rebuild/m4/workout/engine-runtime.cjs':'9be218975e39d84465f6c337d48b60c5009f268eb68d7b9808871ad867c61b23',
 'rebuild/m4/workout/source-projection.cjs':'fecb0447d5079628bb531c59bfbc64b72d302c1fa3e844ef2692a161a0f0e37e',
 'rebuild/m4/workout/test/native-next-targets.test.cjs':'8ab8ac5b7e1a35a9006e952f07ce170a2bb58ce962e213f18ee2bd385b6b3a41',
 'rebuild/m4/workout/test/native-next-targets-assembly.test.cjs':'eb75529047b1f9fad7f362bff4c3a5d649f3d27470bfd158102190f73e610c14',
 'rebuild/m4/workout/test/native-next-targets-correction.test.cjs':'ffed53fdee84e587507485e8883c34cf11d63c5489d48e770bc76b5ccab4aea1',
};
const CHANGES_FILE='rebuild/m4/spec/native-carriers-changes.json';
const CHANGES_SHA='9e6f608a322ac0773275fdd3916df6655c9f9b6ac975a88023907b3f877438c5';
// Exact before/after pins of every carried file.
const CARRIED={
 'rebuild/engine/plan.cjs':{before:'2b834933ce0b93164064a7be36462f68683eb48a31d57c17a41cd81ed32c45b7',after:'1b26c87f6fa037259a4ce480585e07714f5b38d4995a56bc94965f49386af2a3'},
 'rebuild/engine/progression.cjs':{before:'adeb1b103260278452bd840185d7dfecd2642c4744955bf06bb0b495e02f9d4e',after:'7031838d37cfc522d3757437abc957b0a8e3688af0b540a830673d9aad030ef5'},
 'rebuild/engine/sleep.cjs':{before:'2dde4a082ba72d61f0c1cfa3c98fa8c9038d639ce5349078023874ae29cc0407',after:'3dd34e111fe56f757d55ad2a419e019109a4746430a76c1477d1bdfb94145da0'},
 'rebuild/engine/today.cjs':{before:'af4c65d2998c2fd588d6251a220262db5395e7ca5410ad36fe314826a04cbe0d',after:'397532ecf20a4f5a9e1bd4a7d8d312cf5fd52058427603a7726ba512107bdbb3'},
 'rebuild/engine/writers.cjs':{before:'008d92961d210ed07850ea881bd3a9f01ee873c1958f8b7d3a47506342c96bf5',after:'00291236ee0fe5a5bf0130d50219cb7753013302ae82a2c0af507f5a7aa649e6'},
 // The composition carrier. The accepted L bytes assume an engine index that
 // already registers performed.cjs; this base has neither file. Without it the
 // legacy composition throws (E.performedRirSets is not a function) and the
 // frozen public census cannot even be computed. Registered BEFORE plan.cjs so
 // the performed helpers exist when plan/progression/today/writers bind them.
 'rebuild/engine/index.cjs':{before:'2f6e35e6499845510a3ed6bd5f51866da29029435a5a0377502ccfcdb1fc97eb',after:'40ccc489a44dfdb4581e157a06f8bcf70fe77e25f33051ffca90b5910cd6b893'},
 // The same composition carrier for the preview browser build, which the parent
 // profile also pins as product: the adopted progression reads
 // E.performedNumericEntry, so the preview engine must register the two native
 // files and the build must allow them as inputs.
 'rebuild/m3/w7-preview/browser-engine.cjs':{before:'9b0ae9234e11127115db2e99e6b1809544aa3a531fa3c204df5f89324e0755fb',after:'4b1b19c0b7dcabb81dc6cc7364bc0c61834d326c25497ad0c2ff795ab0f00f61'},
 'rebuild/m3/w7-preview/build.mjs':{before:'d6c5253c067441e8578d1765757c7cb3ecdc8d1f34b95728b2dbecb54b21fab5',after:'dc5bc77d468b0933c5f848cae2398074b93ff916cbc5e75bfe7710e2460e93b1'},
};
// Product files this package pins that live outside rebuild/engine.
const PREVIEW=['rebuild/m3/w7-preview/browser-engine.cjs','rebuild/m3/w7-preview/build.mjs'];
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
function changes(){
 const raw=fs.readFileSync(path.join(root,CHANGES_FILE));
 assert.equal(sha(raw),CHANGES_SHA,'Pinned literal carrier list');
 const list=JSON.parse(raw);
 assert(Array.isArray(list)&&list.length===48,'Declared carrier count');
 for(const c of list)assert(typeof c.id==='string'&&typeof c.before==='string'&&typeof c.after==='string'&&Object.hasOwn(CARRIED,c.file),'Carrier shape '+c.id);
 return list;
}
function replace(source,before,after,label){
 assert.equal(source.split(before).length,2,'Unique exact source site: '+label);
 return source.replace(before,after);
}
function baseline(root_){
 const out={};
 for(const file of Object.keys(CARRIED))out[file]=cp.execFileSync('git',['show',BASE+':'+file],{cwd:root_,encoding:'utf8',windowsHide:true,maxBuffer:9e7});
 return out;
}
function construct(before){
 const out={...before};
 for(const [file,pin]of Object.entries(CARRIED))assert.equal(sha(out[file]),pin.before,'sourceBase preimage '+file);
 for(const c of changes())out[c.file]=replace(out[c.file],c.before,c.after,c.id);
 for(const [file,pin]of Object.entries(CARRIED))assert.equal(sha(out[file]),pin.after,'Constructed carrier postimage '+file);
 return out;
}
function verify(root_){
 assert.equal(arguments.length,1,'Source verifier accepts no caller-supplied postimage');
 const expected=construct(baseline(root_));
 const actual=fs.readdirSync(path.join(root_,'rebuild/engine')).filter(n=>n.endsWith('.cjs')).sort();
 assert.deepEqual(actual,ENGINE.map(f=>path.basename(f)).sort(),'Closed engine file inventory');
 const product={};
 for(const [file,bytes]of Object.entries(expected)){
  assert.equal(fs.readFileSync(path.join(root_,file),'utf8'),bytes,'Exact product construction: '+file);
  product[file]=sha(bytes);
 }
 for(const [file,pin]of Object.entries(WHOLE)){
  const bytes=fs.readFileSync(path.join(root_,file));
  assert.equal(sha(bytes),pin.sha256,'Whole-file adoption: '+file);
  product[file]=pin.sha256;
 }
 for(const file of RETAINED){
  if(Object.hasOwn(product,file))continue;
  const bytes=fs.readFileSync(path.join(root_,file),'utf8');
  assert.equal(bytes,cp.execFileSync('git',['show',BASE+':'+file],{cwd:root_,encoding:'utf8',windowsHide:true,maxBuffer:9e7}),'Untouched retained engine file: '+file);
  product[file]=sha(bytes);
 }
 for(const [file,hash]of Object.entries(SUPPORT))assert.equal(sha(fs.readFileSync(path.join(root_,file))),hash,'Adopted support bytes: '+file);
 return product;
}
module.exports={BASE,ENGINE,RETAINED,NEW,PREVIEW,WHOLE,SUPPORT,CARRIED,CHANGES_FILE,CHANGES_SHA,sha,changes,replace,baseline,construct,verify};
