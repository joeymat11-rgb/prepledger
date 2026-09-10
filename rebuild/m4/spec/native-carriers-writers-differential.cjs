'use strict';
// Exact original writer differential, pointed at the reviewed frozen-source
// projection and the actual candidate. No assertion or original file is edited.
// Protected context stays in memory; only the original closed verdicts escape.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),S=require('./native-carriers-parent-source.cjs'),Expected=require('./load-write-expectations.cjs'),NativeDate=Date;
const source=Expected.createSource({root});Expected.verifySource(source);S.verify(root);
const file=path.join(root,'rebuild/engine/test/writers-differential.cjs'),bytes=fs.readFileSync(file);
assert.equal(S.sha(bytes),'2fec66f65c55f751c749f827e5c0fca6a6747a9e8440ba66cd13d166f2951217');
const R=require('../../engine/test/writers-reference.cjs');
let mode='preparation',runs=0;
try{
 for(mode of ['frozen','native','trap']){
  const lines=[];
  const req=name=>{
   if(['node:assert/strict','node:child_process'].includes(name))return require(name);
   if(name==='../index.cjs')return require('../../engine/index.cjs');
   if(name==='./writers-reference.cjs')return {...R,createWriterReference:options=>{assert.equal(S.sha(fs.readFileSync(source.bundle)),source.bundleSha256,'Sealed frozen-source projection');return R.createWriterReference({...options,enginePath:source.bundle});}};
   throw Error('Unlisted original differential import');
  };
  globalThis.Date=NativeDate;
  const run=vm.runInThisContext('(function(require,process,console,__filename){\n'+bytes.toString('utf8')+'\n})',{filename:file});
  run(req,{...process,argv:[process.execPath,file,'--worker',mode]},Object.freeze({log:line=>{assert.equal(typeof line,'string');if(/^M7 (ISOLATION |WRITERS |NATIVE TRAP:)/.test(line))lines.push(line);}}),file);
  assert.equal(lines.filter(line=>line.startsWith('M7 WRITERS ')).length,1);assert.equal(lines.filter(line=>line.startsWith('M7 ISOLATION ')).length,1);
  if(mode==='trap')assert(lines.some(line=>line.startsWith('M7 NATIVE TRAP: PASS')));
  for(const line of lines)console.log(line);runs++;
 }
 console.log('NATIVE WRITERS DIFFERENTIAL: '+runs+'/3 Date/trap modes PASS; all original assertions/roster/aliases/instance checks intact; exact approved frozen-source expectation; PACKAGE receipt PENDING');
}catch(_){console.error('NATIVE WRITERS DIFFERENTIAL FAIL in '+mode+'; protected context withheld');process.exitCode=1;}
finally{globalThis.Date=NativeDate;}
