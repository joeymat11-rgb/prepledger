'use strict';
// Materialise the two immutable prerequisites the adopted L tests name but this
// repository does not carry, without inventing a byte.
//
// (1) PACKET/inputs/accepted-generated/rebuild/engine/<owned>.cjs — the ACCEPTED
//     preimage the candidate's own source-delta was constructed over. It is
//     RECOVERED, not guessed: every edit in source-delta.cjs is a UNIQUE literal
//     replacement, so applying each (after -> before) in reverse to the adopted
//     candidate text inverts the construction exactly. The recovery is accepted
//     only when it hashes to source-delta's OWN published ACCEPTED pin and
//     construct() over it reproduces the adopted bytes exactly. A wrong recovery
//     cannot pass either check.
// (2) <root>/test-support/import-engine — the immutable RETAINED public engine
//     that the test-only importer assembly composes (never the candidate). Its
//     bytes are read from git at the profile's sourceBase and pinned here, so the
//     importer lane is provably unaffected by the adopted carriers.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'../../..');
const BASE='189523bdb2fa37187ce9e08b93c4e6dc27d41efd';
const DELTA='rebuild/m4/spec/native-next-target-candidate/source-delta.cjs';
const DELTA_SHA='fce1c2f92bf445373fdab39fdd1e2f16705f0312c6b3b8347c225dae6639ea6a';
const Delta=require('./native-next-target-candidate/source-delta.cjs');
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const show=(commit,file)=>cp.execFileSync('git',['show',commit+':'+file],{cwd:ROOT,encoding:'utf8',windowsHide:true,maxBuffer:9e7});
// The retained engine the importer assembly composes, in its index order.
const IMPORT_ENGINE=['dates','constants','plan','progression','sleep','energy','policy','today','volume','migrate','earn','merge','writers'].map(n=>'rebuild/engine/'+n+'.cjs');
const IMPORT_FIXTURES='rebuild/m3/w7-preview/fixtures.cjs';

// Enumerate the literal edits of the pinned source-delta bytes. The edit region
// is straight-line code (`const <name>='<file>';` and `edit(file,before,after);`)
// executed with a recording `edit`; nothing is replaced and no product code runs.
function changeList(){
 const src=fs.readFileSync(path.join(ROOT,DELTA),'utf8');
 assert.equal(sha(src),DELTA_SHA,'Pinned source-delta bytes');
 const body=src.slice(src.indexOf('function construct(accepted){'));
 const from=body.indexOf('const edit=('),to=body.indexOf('const pins=Object.fromEntries');
 assert(from>0&&to>from,'Exact edit region boundary');
 const region=body.slice(body.indexOf('\n',from)+1,to);
 const recorded=[];
 // eslint-disable-next-line no-new-func
 new Function('edit',region)((file,before,after)=>{recorded.push({file,before,after});});
 assert.equal(recorded.length,34,'Declared literal edit count');
 return recorded;
}
function candidateSources(){
 return Object.fromEntries(Delta.OWNED.map(file=>[file,fs.readFileSync(path.join(ROOT,file),'utf8')]));
}
function recoverAccepted(){
 const candidate=candidateSources(),recovered={...candidate},changes=changeList();
 for(let i=changes.length-1;i>=0;i--){
  const {file,before,after}=changes[i];
  assert.equal(recovered[file].split(after).length,2,'Unique inverse site in '+file);
  recovered[file]=recovered[file].replace(after,before);
 }
 for(const file of Delta.OWNED)assert.equal(sha(recovered[file]),Delta.ACCEPTED[file],'Recovered ACCEPTED preimage '+file);
 const built=Delta.construct(recovered);
 for(const file of Delta.OWNED)assert.equal(built.sources[file],candidate[file],'construct(recovered) reproduces the adopted bytes: '+file);
 return recovered;
}
function materializePacket(dir){
 const accepted=recoverAccepted(),pins={};
 for(const file of Delta.OWNED){
  const out=path.join(dir,'inputs/accepted-generated',file);
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,accepted[file]);pins[file]=sha(accepted[file]);
 }
 return pins;
}
function materializeImportEngine(){
 const dir=path.join(ROOT,'test-support/import-engine'),pins={};
 for(const file of [...IMPORT_ENGINE,IMPORT_FIXTURES]){
  const bytes=show(BASE,file),out=path.join(dir,file);
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,bytes);pins[file]=sha(bytes);
 }
 return {dir,pins};
}
function removeImportEngine(){
 const dir=path.join(ROOT,'test-support');
 assert(path.resolve(dir).startsWith(path.resolve(ROOT)+path.sep),'Scoped removal');
 fs.rmSync(dir,{recursive:true,force:true});
}
function create(root){
 assert.equal(path.resolve(root),path.resolve(ROOT),'One repository root');
 const dir=path.join(ROOT,'.tmp/native-carriers-packet');
 fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
 const packet=materializePacket(dir),engine=materializeImportEngine();
 return {packet:dir,packetPins:packet,importEngine:engine.dir,importEnginePins:engine.pins};
}
module.exports={ROOT,BASE,DELTA,DELTA_SHA,IMPORT_ENGINE,IMPORT_FIXTURES,sha,changeList,candidateSources,recoverAccepted,materializePacket,materializeImportEngine,removeImportEngine,create};
if(require.main===module){
 try{
  const made=create(ROOT);
  console.log('NATIVE CARRIERS REFERENCE: '+Object.keys(made.packetPins).length+'/6 ACCEPTED preimages recovered and pin-verified; '+Object.keys(made.importEnginePins).length+' retained import-engine files at '+BASE);
  console.log('EARNED_NATIVE_PACKET_ROOT='+made.packet);
 }catch(error){console.error('NATIVE CARRIERS REFERENCE FAIL: '+error.message);process.exitCode=1;}
}
