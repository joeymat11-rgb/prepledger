'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict'),Module=require('node:module');
const m4=path.resolve(__dirname,'../../../..'),work=path.dirname(m4),w6=path.join(work,'m3-w6-browser-bridge'),r1=path.join(work,'m3-w5-r1');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const prepared=process.env.EARNED_CONFIGURED_HISTORY_PREPARED;
let output;
if(prepared){output=prepared;assert(fs.existsSync(path.join(output,'configured-history-sources.json')));}
else{
 // Reuse only the existing public-source composition prefix. No test, browser,
 // fault, private fixture or runner body executes from this source extraction.
 const file=path.join(w6,'rebuild/m3/w6/test/run-current-head.cjs'),source=fs.readFileSync(file,'utf8'),end=source.indexOf('let mutation=null,preparedRestore=null;');assert(end>0);
 const build=new Module(file,module);build.filename=file;build.paths=Module._nodeModulePaths(path.dirname(file));
 const prior=process.argv;try{process.argv=[process.execPath,file,r1];build._compile(source.slice(0,end)+'\nmodule.exports={output};',file);}finally{process.argv=prior;}
 output=build.exports.output;
 const manifest=JSON.parse(fs.readFileSync(path.join(output,'source-manifest.json'))),pins={};
 const copy=(root,name,pin)=>{const src=path.join(root,name),b=fs.readFileSync(src);if(pin)assert.equal(sha(b),pin,name);const dest=path.join(output,name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b);pins[src]=sha(b);return dest;};
 const fixed={
  'schema.cjs':'9d18cce9434118fd33364c2bc6842923707685328fa62d115b90c63460923458',
  'edit-values.cjs':'bc3e760bb1870a3a30f7f7e15d427faea00ef31b9d4256050ac30161b3ec1546',
  'edit-history.cjs':'3e5dd5053ddbcc2491cc604da35e42fde625c6c0b94d409431c3bba65042d3e2',
  'context-values.cjs':'8cd6fe62aaf0ab1f11ecd7a35564f057b3b6c5a5e4facd5404f8f7b63caf4a2b',
  'source-control-values.cjs':'635ba7ec7515a53bb7029b81d223586a9d884b3d60e464ce178bf73a0d4ba560',
  'engine-history.cjs':'7ab75dc967e721d798d293f992796d67befd68e258e9e508f7bfd7a5cd24be89',
  'engine-capture.cjs':'309c75d82a036b24b09ebc6668ea73065aa76de5638b2dee3da18d9067e08785',
  'engine-order.cjs':'1ace8e3e585c04b2aaee5cb40b894069ffd1be245bffd4bf93046c454b25e10a'};
 for(const [file,pin]of Object.entries(fixed))copy(m4,'rebuild/m4/workout/'+file,pin);
 const target=path.join(output,'rebuild/m4/workout');
 const once=(s,a,b)=>{assert.equal(s.split(a).length,2);return s.replace(a,b);};
 let schema=fs.readFileSync(path.join(target,'schema.cjs'),'utf8'),edits=fs.readFileSync(path.join(target,'edit-values.cjs'),'utf8');
 schema=once(schema,"const load = value => quantity(value, 'lb') && value.value > 0;","const load = require('./entered-load.cjs');");
 edits=once(edits,"'use strict';","'use strict';\nconst enteredLoad=require('./entered-load.cjs');");
 edits=once(edits,"if(field==='load')return quantity(value,'lb')&&(version===1||value.value>0);","if(field==='load')return version===1?quantity(value,'lb'):enteredLoad(value);");
 fs.writeFileSync(path.join(target,'schema.cjs'),schema);fs.writeFileSync(path.join(target,'edit-values.cjs'),edits);
 const entered=fs.readFileSync(path.join(__dirname,'../configured-load-candidate/entered-load.cjs'));assert.equal(sha(entered),'2a0cd97ec843924e6dc428f2dbb0fe3c5bf10335610a3315c205c84fc324a3a3');fs.writeFileSync(path.join(target,'entered-load.cjs'),entered);
 assert.equal(sha(Buffer.from(schema)),'8902b4773c0aa73dca9a9751dea9f923ee61ed32658ad6c828a168782005820d');assert.equal(sha(Buffer.from(edits)),'6fa4fa7ccf268f44f28a2085bcfdb403b4bf463fc02ba27707873d11b61d97d3');
 const history=path.join(target,'engine-history.cjs');fs.copyFileSync(history,path.join(target,'engine-history-original.cjs'));fs.writeFileSync(history,require('./construct.cjs')(fs.readFileSync(history,'utf8')));
 const candidatePins={};for(const file of [...Object.keys(manifest.pins),...Object.keys(manifest.r1CandidateSources),...Object.keys(fixed).map(f=>'rebuild/m4/workout/'+f),'rebuild/m4/workout/entered-load.cjs','rebuild/m4/workout/engine-history-original.cjs'])candidatePins[file]=sha(fs.readFileSync(path.join(output,file)));
 fs.writeFileSync(path.join(output,'configured-history-sources.json'),JSON.stringify({runtime:process.version,output,composition:manifest,m4SourcePins:pins,candidatePins},null,2)+'\n');
}
const receipt=JSON.parse(fs.readFileSync(path.join(output,'configured-history-sources.json')));
function verify(){for(const [f,pin]of Object.entries(receipt.m4SourcePins))assert.equal(sha(fs.readFileSync(f)),pin,f);for(const [f,pin]of Object.entries(receipt.candidatePins))assert.equal(sha(fs.readFileSync(path.join(output,f))),pin,f);}
verify();
const result=cp.spawnSync(process.execPath,['--test',path.join(__dirname,'test.cjs')],{cwd:m4,env:{...process.env,EARNED_CONFIGURED_HISTORY:output},windowsHide:true,encoding:'utf8',maxBuffer:3e6});
fs.writeFileSync(path.join(output,'configured-history.log'),(result.stdout||'')+(result.stderr||''));process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');verify();
console.log('CONFIGURED HISTORY SOURCE '+output);assert.equal(result.status,0,'Actual configured history checks');
