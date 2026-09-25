'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),Module=require('node:module'),assert=require('node:assert/strict');
if(!process.argv[2])throw Error('Explicit R1 003c816 checkout required');
const r1=path.resolve(process.argv[2]),requested=process.argv[3]&&path.resolve(process.argv[3]);
if(requested&&fs.existsSync(requested))throw Error('Output directory must be new');
const outputDirectory=requested||fs.mkdtempSync(path.join(os.tmpdir(),'earned-history-ui-'));
if(requested)fs.mkdirSync(outputDirectory,{recursive:true});
const repo=path.resolve(__dirname,'../../../..');
const file=path.join(repo,'rebuild/m4/spec/legacy-workout-projection.test.cjs');
const source=fs.readFileSync(file,'utf8');
const hook='  for(const[p,h]of Object.entries(pins))assert.equal(hash(fs.readFileSync(path.join(root,p))),h,p);';
assert.equal(source.split(hook).length,2);
process.argv[2]=r1;process.argv[3]=undefined;
const m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));
// One explicit in-memory UI probe before the original final source-pin checks.
// The committed fixture, source assertions and product files are not rewritten.
const call='  await require('+JSON.stringify(path.join(__dirname,'history-panel-check.cjs'))+')({outputDirectory:'+JSON.stringify(outputDirectory)+',createProjection,reader,input,fixture:f,trial,chain,removed,rival,unsupported,consumerCases});\n';
console.log('Synthetic UI output: '+outputDirectory);
m._compile(source.replace(hook,call+hook),file);
