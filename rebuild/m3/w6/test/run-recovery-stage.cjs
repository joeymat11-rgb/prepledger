'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),os=require('node:os'),crypto=require('node:crypto');
const source=path.resolve(process.argv[2]||''),pin='734986a688366293349145e6feb80fd4130d3702';
if(!process.argv[2])throw Error('Provide retained R1 worktree; no environment fallback');
for(const name of ['reconciliation/paged-codec.cjs','reconciliation/codec.cjs','reconciliation/project.cjs','reconciliation/transport.cjs','public-client.cjs']){
 const relative='rebuild/m3/w5/'+name,expected=cp.spawnSync('git',['show',pin+':'+relative],{cwd:source,windowsHide:true,maxBuffer:16e6});
 if(expected.status!==0||!expected.stdout.equals(fs.readFileSync(path.join(source,relative))))throw Error('Pinned R1 dependency mismatch: '+relative);
}
if(process.argv.includes('--bite')||process.argv.includes('--profile-bite')||process.argv.includes('--ordinal-bite')||process.argv.includes('--transport-bite')||process.argv.includes('--timer-bite')){
 const timerBite=process.argv.includes('--timer-bite'),transportBite=process.argv.includes('--transport-bite')||timerBite,ordinalBite=process.argv.includes('--ordinal-bite'),profileBite=process.argv.includes('--profile-bite')||ordinalBite;
 const root=path.resolve(__dirname,'../../../..'),out=fs.mkdtempSync(path.join(os.tmpdir(),'earned-stage-bite-'));
 const listing=cp.spawnSync('git',['ls-files','-z','--','rebuild/m3/w6','rebuild/client','rebuild/authority','rebuild/m4/workout','rebuild/conform/lib'],{cwd:root,windowsHide:true});
 if(listing.status!==0)throw Error('Public source listing failed');
 const names=new Set(listing.stdout.toString().split('\0').filter(Boolean));
 for(const name of ['recovery-stage.mjs','recovery-profile.mjs','recovery-transport.mjs','test/recovery-stage/transport.test.mjs','test/recovery-stage/profile-vectors.mjs','test/recovery-stage/stage.test.mjs','test/recovery-stage/browser.mjs','test/run-recovery-stage.cjs'])names.add('rebuild/m3/w6/'+name);
 for(const name of names){if(name.includes('..')||!name.startsWith('rebuild/'))throw Error('Unexpected source path');const target=path.join(out,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,name),target);}
 fs.symlinkSync(path.join(root,'rebuild/m3/w6/node_modules'),path.join(out,'rebuild/m3/w6/node_modules'),process.platform==='win32'?'junction':'dir');
 const sourceName=transportBite?'recovery-transport.mjs':profileBite?'recovery-profile.mjs':'recovery-stage.mjs',file=path.join(out,'rebuild/m3/w6',sourceName),original=fs.readFileSync(file),text=original.toString(),needle=timerBite?'timers={setTimeout:(fn,ms)=>globalThis.setTimeout(fn,ms),clearTimeout:id=>globalThis.clearTimeout(id)}':transportBite?'.then(async response=>{':ordinalBite?text.split('\n').find(line=>line.startsWith(' for(let n=1;n<=metadata.seq;n++)')):profileBite?"if(!await publicVerifier.verifyDisposition(h))fail('DISPOSITION_SIGNATURE');":'const decision=validateContext();';
 if(text.split(needle).length!==2)throw Error('Exact recovery mutation cut missing');fs.writeFileSync(file,text.replace(needle,timerBite?'timers={setTimeout,clearTimeout}':transportBite?'.then(async response=>{if(controller.signal.aborted)return response;':profileBite?'/* disposable original-signature bypass */':'const decision=null;'));
 const args=timerBite?[path.join(out,'rebuild/m3/w6/test/recovery-stage/browser.mjs')]:['--test','--test-reporter=tap',...(transportBite?['--test-name-pattern','timed-out signed200 replies']:profileBite?[]:['--test-name-pattern','known standing loss refuses']),path.join(out,'rebuild/m3/w6/test/recovery-stage',transportBite?'transport.test.mjs':'stage.test.mjs')],env={...process.env,EARNED_ROWS_R1_ROOT:source};
 const red=cp.spawnSync(process.execPath,args,{env,encoding:'utf8',windowsHide:true});fs.writeFileSync(path.join(out,'red.log'),red.stdout+red.stderr);
 if(red.status!==1||!(timerBite?red.stderr.includes('Native flow refused'):transportBite?/not ok \d+ - timed-out signed200 replies/.test(red.stdout):ordinalBite?/not ok \d+ - coherent signed log gap defeats counts alone/.test(red.stdout):profileBite?/not ok \d+ - original disposition signature forged/.test(red.stdout):red.stdout.includes('not ok 1 - known standing loss refuses')))throw Error('Recovery cut mutation was not effective; '+red.stdout+red.stderr);
 fs.writeFileSync(file,original);const green=cp.spawnSync(process.execPath,args,{env,encoding:'utf8',windowsHide:true});fs.writeFileSync(path.join(out,'restored.log'),green.stdout+green.stderr);
 if(green.status!==0||!fs.readFileSync(file).equals(original)||!fs.readFileSync(path.join(root,'rebuild/m3/w6',sourceName)).equals(original))throw Error('Restored recovery cut did not pass byte-identically');
 console.log(timerBite?'RECOVERY TIMER BITE RED — unbound browser timer receiver prevents native recovery; native exit1':transportBite?'RECOVERY TRANSPORT BITE RED — late signed rejection discarded after request timeout; native exit1':ordinalBite?'RECOVERY ORDINAL BITE RED — coherent signed log gap accepted after contiguous-log bypass; native exit1':profileBite?'RECOVERY PROFILE BITE RED — forged original disposition accepted after signature bypass; native exit1':'RECOVERY STAGE BITE RED — known standing loss committed when final context guard bypassed; native exit1');
 console.log((transportBite?'RECOVERY TRANSPORT':profileBite?'RECOVERY PROFILE':'RECOVERY STAGE')+' BITE RESTORED PASS — native exit0; SHA256 '+crypto.createHash('sha256').update(original).digest('hex'));
 console.log('Evidence '+out);process.exit(0);
}
const args=process.argv.includes('--browser')?[path.join(__dirname,'recovery-stage/browser.mjs')]:['--test',path.join(__dirname,'recovery-stage/stage.test.mjs'),path.join(__dirname,'recovery-stage/transport.test.mjs')];
const result=cp.spawnSync(process.execPath,args,{env:{...process.env,EARNED_ROWS_R1_ROOT:source},stdio:'inherit',windowsHide:true});process.exitCode=result.status??1;
