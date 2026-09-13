'use strict';
// AUTHORING ONLY until the separate B-only PC grant. No fixture is replaced.
// The pinned original public main and frozen/unfrozen workers execute in fresh
// processes, with their own manifest/golden checks and exact original packets.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),Module=require('node:module'),crypto=require('node:crypto');
const H=require('./b1b2-evidence.cjs');
const ORIGINAL='rebuild/engine/test/census-partial.cjs';
const SHIM='rebuild/engine/oracle-shim.cjs';
const CENSUS='rebuild/conform/oracle/census.cjs';
const VOLUME='rebuild/engine/test/volume-projection.cjs';
const ENV=['B1B2_CENSUS_STAGE','B1B2_CENSUS_SIDE','B1B2_CENSUS_CLOCK','B1B2_CENSUS_FRAMES'];
assert.deepEqual(process.argv.slice(2),[],'closed census argv');
H.reconstructRepair();
function pinned(file) {
  assert.ok(Object.hasOwn(H.changes.nativePrograms,file),'declared native program BEFORE read');
  const bytes=H.candidateSource(file),object=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  assert.equal(object,H.changes.nativePrograms[file].gitBlob,'exact original program blob');
  assert.deepEqual(bytes,H.blob(H.M,file));assert.deepEqual(bytes,H.blob('HEAD',file));
  return bytes.toString();
}
// Type/order/alias-preserving observations. They never replace a return value
// and are written only beneath this invocation's own .tmp directory.
function frame(value,seen=new Map()) {
  if(value===null)return {type:'null'};
  const type=typeof value;
  if(type!=='object')return {type,value:type==='number'&&!Number.isFinite(value)?String(value):type==='undefined'?null:value};
  if(seen.has(value))return {type:'reference',id:seen.get(value)};
  const id=seen.size;seen.set(value,id);
  return {type:Array.isArray(value)?'array':'object',id,...(Array.isArray(value)?{length:value.length}:{}),entries:Object.keys(value).map(key=>[key,frame(value[key],seen)])};
}
function frameRoot() {
  const value=process.env.B1B2_CENSUS_FRAMES;
  assert.equal(typeof value,'string');const absolute=path.resolve(value),parent=path.resolve(H.ROOT,'.tmp');
  assert.equal(path.dirname(absolute),parent,'process-local census frame directory');
  assert.match(path.basename(absolute),/^b1b2-census-[A-Za-z0-9]+$/);assert.ok(fs.statSync(absolute).isDirectory());return absolute;
}
function runOriginal(side,stage,mode) {
  assert.ok(['M','T'].includes(side));assert.ok(['main','worker'].includes(stage));
  if(stage==='worker')assert.ok(['frozen','unfrozen'].includes(mode));else assert.equal(mode,undefined);
  const directory=frameRoot(),observed=[],ref=H[side],file=path.join(H.ROOT,ORIGINAL),normal=Module.createRequire(file);
  // Validate all named original code pins before a native/oracle import. These
  // are code pins, not permission to run during construction.
  for(const program of Object.keys(H.changes.nativePrograms))pinned(program);
  const record=(kind,value)=>{observed.push({kind,value:frame(value)});return value;};
  const observeFunction=(kind,fn)=>function(...args){return record(kind,Reflect.apply(fn,this,args));};
  function observeTable(table) {
    const wrappers=new Map();
    return new Proxy(table,{get(target,key,receiver){
      const value=Reflect.get(target,key,receiver);
      if(!['currentRate','regime','progressionTrend'].includes(key)||typeof value!=='function')return value;
      if(!wrappers.has(key))wrappers.set(key,observeFunction('today-input:'+key,value));return wrappers.get(key);
    }});
  }
  function shim() {
    const abs=path.join(H.ROOT,SHIM),m=new Module(abs,module);m.filename=abs;
    m.require=request=>{assert.equal(request,'./index.cjs','original shim index boundary');return {createEngine:options=>H.nativeEngine(ref,options)};};
    m._compile(pinned(SHIM),abs);assert.ok(m.exports.__test);return {...m.exports,__test:observeTable(m.exports.__test)};
  }
  let saved=false;
  function save() {
    assert.equal(saved,false,'one complete original frame packet');saved=true;
    fs.writeFileSync(path.join(directory,side+'-'+(stage==='main'?'main':mode)+'.json'),JSON.stringify(observed));
  }
  const workerOut=new Proxy(process.stdout,{get(target,key){if(key==='write')return function(chunk,...rest){save();return target.write(chunk,...rest);};return Reflect.get(target,key);}});
  const localProcess=new Proxy(process,{get(target,key){
    if(key==='argv')return stage==='worker'?[process.execPath,file,'--worker',mode]:[process.execPath,file,'--public'];
    if(key==='stdout'&&stage==='worker')return workerOut;return Reflect.get(target,key);
  },set(target,key,value){if(key==='exitCode'&&stage==='main')save();return Reflect.set(target,key,value);}});
  const m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));m.__process=localProcess;
  m.require=request=>{
    if(request==='node:child_process')return {...cp,spawnSync:(command,args,options)=>{
      assert.equal(stage,'main');assert.equal(command,process.execPath);assert.ok(Array.isArray(args));
      assert.equal(args.length,3);assert.equal(args[0],file);assert.equal(args[1],'--worker');assert.ok(['frozen','unfrozen'].includes(args[2]));
      return cp.spawnSync(command,[__filename],{...options,cwd:H.ROOT,env:{...(options.env===undefined?process.env:options.env),B1B2_CENSUS_STAGE:'worker',B1B2_CENSUS_SIDE:side,B1B2_CENSUS_CLOCK:args[2],B1B2_CENSUS_FRAMES:directory}});
    }};
    if(request===path.join(H.ROOT,SHIM))return shim();
    if(request==='../../conform/oracle/census.cjs'){const original=normal(request);return {...original,census:observeFunction('census',original.census)};}
    if(request==='./volume-projection.cjs'){const original=normal(request);return {...original,projection:observeFunction('volume',original.projection)};}
    const frozen=path.resolve(process.env.ENGINE_MAIN||path.join(H.ROOT,'rebuild/conform/engines/engine-main.cjs'));
    if(request===frozen){const original=normal(request);return {...original,__test:observeTable(original.__test)};}
    assert.ok(['node:fs','node:path','node:crypto','node:url','../../conform/lib/harness.cjs','./volume-reference.cjs'].includes(request),'closed original census dependency BEFORE load');
    return normal(request);
  };
  // Only a lexical process facade is added. Original source bytes, input
  // snapshots, golden comparisons and failure/exit behavior are unchanged.
  m._compile('"use strict";const process=module.__process;\n'+pinned(ORIGINAL),file);
}
if(process.env.B1B2_CENSUS_STAGE!==undefined) {
  // A selected internal stage never prints the complete parent terminal. An
  // externally supplied stage therefore cannot satisfy the registered child.
  runOriginal(process.env.B1B2_CENSUS_SIDE,process.env.B1B2_CENSUS_STAGE,process.env.B1B2_CENSUS_CLOCK);
} else {
  for(const key of ENV)assert.equal(process.env[key],undefined,'complete top-level census invocation');
  const directory=fs.mkdtempSync(path.join(H.ROOT,'.tmp','b1b2-census-')),runs=[];
  for(const side of ['M','T']) {
    const result=cp.spawnSync(process.execPath,[__filename],{cwd:H.ROOT,windowsHide:true,encoding:'utf8',maxBuffer:9e7,
      env:{...process.env,TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03',B1B2_CENSUS_STAGE:'main',B1B2_CENSUS_SIDE:side,B1B2_CENSUS_FRAMES:directory}});
    // Original public program terminals are retained. Full observations are
    // never printed, including when an exact field comparison refuses.
    process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');
    runs.push({side,source:H[side],status:result.status,signal:result.signal,error:!!result.error,stdout:H.sha(result.stdout||''),stderr:H.sha(result.stderr||'')});
  }
  console.log('B1B2 ORIGINAL PUBLIC CENSUS RUNS: '+JSON.stringify(runs));
  const comparisons=[];
  for(const mode of ['main','frozen','unfrozen']) {
    const load=side=>JSON.parse(fs.readFileSync(path.join(directory,side+'-'+mode+'.json'),'utf8'));
    const before=load('M'),after=load('T');assert.ok(before.length&&after.length,'nonempty complete native frames');
    const difference=H.fieldDiff(before,after);
    fs.writeFileSync(path.join(directory,'difference-'+mode+'.json'),JSON.stringify(difference));
    comparisons.push(H.approvedNativeDifference('native-census-'+mode,before,after));
  }
  assert.equal(runs.length,2);assert.ok(runs.every(r=>r.status===0&&r.signal===null&&!r.error),'every unchanged original public census side succeeds');
  console.log('B1B2 PUBLIC CENSUS: 2 complete original public runs; 3 complete M/T frame comparisons; '+JSON.stringify(comparisons));
}
