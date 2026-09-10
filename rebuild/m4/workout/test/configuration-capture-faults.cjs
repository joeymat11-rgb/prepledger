'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {spawnSync,execFileSync}=require('node:child_process'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../../../..'),adapter=path.join(__dirname,'../engine-capture.cjs'),test=path.join(__dirname,'configuration-capture.test.cjs');
const w6=process.env.PERFORMED_W6_DIR;if(!w6)throw Error('Provide retained PERFORMED_W6_DIR');
const sha=x=>createHash('sha256').update(x).digest('hex'),source=fs.readFileSync(adapter,'utf8');
const relative=['dates','constants','plan','progression','sleep','energy','policy','today','volume','earn','writers'].map(n=>'rebuild/engine/'+n+'.cjs')
 .concat(['rebuild/m3/w7-preview/fixtures.cjs','rebuild/m3/w7-preview/browser-engine.cjs']);
const pins=Object.fromEntries(relative.map(p=>[path.join(root,p),sha(fs.readFileSync(path.join(root,p)))]));
for(const p of ['rebuild/m3/w6/strict-json.mjs','rebuild/m4/workout/capture.cjs'])pins[path.join(w6,p)]=sha(fs.readFileSync(path.join(w6,p)));
const output=fs.mkdtempSync(path.join(os.tmpdir(),'earned-configuration-capture-')),copy=path.join(output,'engine-capture.cjs');
function execute(name){
 const r=spawnSync(process.execPath,['--test','--test-reporter=tap',test],{encoding:'utf8',windowsHide:true,timeout:30000,env:{...process.env,EARNED_CONFIGURATION_ADAPTER:copy}});
 fs.writeFileSync(path.join(output,name+'.log'),(r.stdout||'')+(r.stderr||''));return r;
}
const faults=[
 ['normalize-key',"return valueCell(value,{kind:'configuration',configuration_key:value});","return valueCell(value.trim(),{kind:'configuration',configuration_key:value.trim()});",'EXACT_CONFIG_SOURCE'],
 ['configuration-to-zero',"return valueCell(value,{kind:'configuration',configuration_key:value});","return valueCell('0 lb',{value:0,unit:'lb'});",'EXACT_CONFIG_SOURCE'],
 ['ignore-original-vector','||original.wSets!==undefined)fail','||false)fail','CONFIG_VECTOR_CONFLICT'],
 ['ignore-debut-vector','||q?.newWSets!==undefined||','||false||','CONFIG_DEBUT_VECTOR_CONFLICT'],
 ['upgrade-old-profile','configured=producer.rule_profile===CONFIGURATION_PROFILE','configured=true','V1_LAYOUT_PROFILE'],
 ['ignore-configuration-display','&&cell.display===source.configuration_key','&&true','CONFIG_CELL_COHERENCE'],
 ['downgrade-new-layout',"configured?'earned/captured-lift-layout/v2'","configured?'earned/captured-lift-layout/v1'",'NEW_LAYOUT_PROFILE']
];
const evidence={node:process.version,adapterSha256:sha(source),testSha256:sha(fs.readFileSync(test)),root,w6,
 w6Head:execFileSync('git',['rev-parse','HEAD'],{cwd:w6,encoding:'utf8',windowsHide:true}).trim(),pins,results:[],
 limits:'Opt-in local mechanical capture candidate over actual unchanged readers and invented W7 state only. No writer, private seed, issuance, authentication, recovery, scientific, resource or activation verdict.'};
try{
 fs.writeFileSync(copy,source);const baseline=execute('baseline');assert.equal(baseline.status,0,baseline.stdout+baseline.stderr);assert.match(baseline.stdout,/# pass 10/);assert.match(baseline.stdout,/# skipped 0/);evidence.baseline='10 PASS';
 for(const [name,from,to,label]of faults){
  assert.equal(source.split(from).length,2,'Exact one mutation anchor '+name);fs.writeFileSync(copy,source.replace(from,to));
  const r=execute(name),log=(r.stdout||'')+(r.stderr||'');
  assert.equal(r.status,1,name+' did not complete with failure');assert(log.includes('ERR_ASSERTION'),name+' did not reach assertion');assert(log.includes(label),name+' did not reach '+label);
  evidence.results.push({name,assertion:label,status:'EFFECTIVE_ASSERTION'});console.log('PASS effective '+name);
 }
}finally{fs.writeFileSync(copy,source);assert.equal(fs.readFileSync(adapter,'utf8'),source);}
const restored=execute('restored');assert.equal(restored.status,0,restored.stdout+restored.stderr);assert.match(restored.stdout,/# pass 10/);assert.match(restored.stdout,/# skipped 0/);evidence.restored='10 PASS';
evidence.disposableRestoredSha256=sha(fs.readFileSync(copy));assert.equal(evidence.disposableRestoredSha256,evidence.adapterSha256);
for(const [p,hash]of Object.entries(pins))assert.equal(sha(fs.readFileSync(p)),hash,'Consumed source changed: '+p);
const artifact=path.join(output,'evidence.json');fs.writeFileSync(artifact,JSON.stringify(evidence,null,2)+'\n');
console.log('CONFIGURATION CAPTURE 10 baseline / '+faults.length+' effective faults / 10 restored PASS\n'+artifact+'\nSHA256 '+sha(fs.readFileSync(artifact)));
