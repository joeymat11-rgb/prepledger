'use strict';
// PM330 operator custody only. No native invocation is authorized by this file.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const {StringDecoder}=require('node:string_decoder');
const ROOT=path.resolve(__dirname,'../../../..');
const BASE='3bfed63febef002b8540d6ff3c56e19d08368711';
const CHILD='rebuild/m4/workout/test/b1b2-supersede-second-gate.test.cjs';
const HELPER='rebuild/m4/workout/test/b1b2-evidence.cjs',PROFILE='rebuild/lanes/b/tooling/packages/B1-B2.json';
const ARGV=Object.freeze(['--test','--test-reporter=tap',CHILD]);
const CAPS=Object.freeze({stdout:268435456,stderr:67108864,diagnostic:65536,records:2,rows:100000,path:4096});
const READERS=Object.freeze(['nowModel','statusFace','currentRate','calorieTarget','proteinTarget','marchingOrder','readRecency','fiveLevers','recoveryIndex','sleepInfo','observedTDEE','weekDigest','debtLedger','theOneThing','dossierData']);
const STATES=Object.freeze(['reads','trend','feed','queue','sleep','dailyLogs','sessionLog','model','learned','adjustments','suggestionLog','corrLog','exercises','state-shape','state-other']);
const KINDS=Object.freeze(['second-readers','second-applyRead']);
const own=(o,k)=>Object.hasOwn(o,k),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const equalPath=(a,b)=>process.platform==='win32'?a.toLowerCase()===b.toLowerCase():a===b;
function need(value,code){if(!value){const e=new Error(code);e.code=code;throw e;}}
function keys(o,names){return !!o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join('|')===names.slice().sort().join('|');}
function canonical(bytes){const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);const o=JSON.parse(text);need(JSON.stringify(o)===text,'DIAGNOSTIC');return o;}
function safeDirectory(dir,root=ROOT){
  need(equalPath(fs.realpathSync(root),root),'SCOPE');let walk=path.resolve(dir);
  need(equalPath(walk,root)||walk.startsWith(root+path.sep),'SCOPE');
  for(;;){const st=fs.lstatSync(walk);need(st.isDirectory()&&!st.isSymbolicLink()&&equalPath(fs.realpathSync(walk),walk),'SCOPE');if(equalPath(walk,root))break;walk=path.dirname(walk);}
}
function safeFile(file){const s=fs.lstatSync(file);need(s.isFile()&&!s.isSymbolicLink()&&s.nlink===1,'SCOPE');return s;}
function git(args){return cp.execFileSync('git',args,{cwd:ROOT,windowsHide:true,stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024});}
function verifyCommission(){
  need(process.argv.length===2&&process.version==='v22.23.2'&&process.platform==='win32','SCOPE');
  need(equalPath(path.resolve(process.cwd()),ROOT)&&/[\\/]work[\\/]pm-caretaker[\\/]b1b2-native-capture$/.test(ROOT),'SCOPE');safeDirectory(ROOT);
  const raw=process.env.EARNED_B1B2_CAPTURE_COMMISSION;
  need(typeof raw==='string'&&raw.length<=4096&&process.env.EARNED_B1B2_CAPTURE_DIR===undefined,'IDENTITY');
  const c=canonical(Buffer.from(raw));
  need(keys(c,['v','source','nodeSha256','operatorSha256','helperSha256','profileSha256','childSha256'])&&c.v===1&&/^[a-f0-9]{40}$/.test(c.source),'IDENTITY');
  for(const k of ['nodeSha256','operatorSha256','helperSha256','profileSha256','childSha256'])need(typeof c[k]==='string'&&/^[a-f0-9]{64}$/.test(c[k]),'IDENTITY');
  need(git(['rev-parse','HEAD']).toString().trim()===c.source,'IDENTITY');git(['merge-base','--is-ancestor',BASE,c.source]);
  need(!process.env.NODE_OPTIONS&&!process.env.NODE_PATH&&!process.env.NODE_TEST_CONTEXT,'IDENTITY');
  need(equalPath(process.execPath,path.join(ROOT,'.tmp','runtime','node.exe')),'IDENTITY');safeDirectory(path.dirname(process.execPath));
  const paths=[[process.execPath,c.nodeSha256],[__filename,c.operatorSha256],[path.join(ROOT,HELPER),c.helperSha256],[path.join(ROOT,PROFILE),c.profileSha256],[path.join(ROOT,CHILD),c.childSha256]];
  for(const [file,digest]of paths){safeFile(file);need(sha(fs.readFileSync(file))===digest,'IDENTITY');}
  for(const p of [path.relative(ROOT,__filename).split(path.sep).join('/'),HELPER,PROFILE,CHILD])need(fs.readFileSync(path.join(ROOT,p)).equals(git(['show','HEAD:'+p])),'IDENTITY');
  need(sha(git(['show',BASE+':'+CHILD]))===c.childSha256,'IDENTITY');
  const map='rebuild/m4/workout/test/b1b2-source-changes.json';safeFile(path.join(ROOT,map));
  need(fs.readFileSync(path.join(ROOT,map)).equals(git(['show',BASE+':'+map]))&&git(['rev-parse','HEAD:'+map]).equals(git(['rev-parse',BASE+':'+map])),'IDENTITY');
  need(git(['diff','--name-only',BASE,'HEAD','--','rebuild/engine','rebuild/m3']).length===0,'IDENTITY');
  return c;
}
// Install and read back a protected DACL before any private child output exists.
const ACL_SCRIPT=String.raw`$ErrorActionPreference='Stop'
$p=$env:EARNED_B1B2_ACL_PATH
$sid=[System.Security.Principal.WindowsIdentity]::GetCurrent().User
$system=[System.Security.Principal.SecurityIdentifier]::new('S-1-5-18')
$acl=[System.Security.AccessControl.DirectorySecurity]::new()
$acl.SetOwner($sid)
$acl.SetAccessRuleProtection($true,$false)
foreach($s in @($sid,$system)) {$acl.AddAccessRule([System.Security.AccessControl.FileSystemAccessRule]::new($s,'FullControl','ContainerInherit,ObjectInherit','None','Allow'))}
[System.IO.Directory]::SetAccessControl($p,$acl)
$read=[System.IO.Directory]::GetAccessControl($p)
if(-not $read.AreAccessRulesProtected){throw 'ACCESS'}
if($read.GetOwner([System.Security.Principal.SecurityIdentifier]).Value -ne $sid.Value){throw 'OWNER'}
$rules=@($read.GetAccessRules($true,$true,[System.Security.Principal.SecurityIdentifier]))
if($rules.Count -ne 2){throw 'RULES'}
foreach($r in $rules){if($r.IdentityReference.Value -notin @($sid.Value,'S-1-5-18') -or $r.AccessControlType -ne 'Allow' -or $r.IsInherited -or $r.FileSystemRights -ne 'FullControl' -or $r.InheritanceFlags -ne 'ContainerInherit, ObjectInherit'){throw 'RULE'}}
[Console]::Write('ACL_OK')`;
function secureWindowsDirectory(dir){
  need(process.platform==='win32'&&typeof process.env.SystemRoot==='string','ACCESS');
  const out=cp.execFileSync(path.join(process.env.SystemRoot,'System32','WindowsPowerShell','v1.0','powershell.exe'),['-NoProfile','-NonInteractive','-EncodedCommand',Buffer.from(ACL_SCRIPT,'utf16le').toString('base64')],{env:{...process.env,EARNED_B1B2_ACL_PATH:dir},windowsHide:true,stdio:['ignore','pipe','pipe'],encoding:'utf8',maxBuffer:4096});
  need(out==='ACL_OK','ACCESS');safeDirectory(dir);
}
function createDirectory(){
  for(const dir of [path.join(ROOT,'.tmp'),path.join(ROOT,'.tmp','b1b2-native-capture')]){if(!fs.existsSync(dir))fs.mkdirSync(dir,{mode:0o700});safeDirectory(dir);}
  const dir=path.join(ROOT,'.tmp','b1b2-native-capture',crypto.randomBytes(16).toString('hex'));
  fs.mkdirSync(dir,{mode:0o700});safeDirectory(dir);secureWindowsDirectory(dir);
  fs.writeFileSync(path.join(dir,'capture-manifest.json'),'{"v":1,"pending":true}\n',{flag:'wx',mode:0o600});return dir;
}
function diagnostics(bytes){
  need(bytes.length<=CAPS.diagnostic,'DIAGNOSTIC');const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
  need(text.endsWith('\n'),'DIAGNOSTIC');const lines=text.slice(0,-1).split('\n');need(lines.length>0&&lines.length<=2,'DIAGNOSTIC');
  return lines.map((line,i)=>{
    const o=canonical(Buffer.from(line));need(keys(o,['v','seq','kind','categories','differenceCount','comparisonVerdict'])&&o.v===1&&o.seq===i+1&&o.kind===KINDS[i],'DIAGNOSTIC');
    need(Number.isSafeInteger(o.differenceCount)&&o.differenceCount>=0&&o.differenceCount<=CAPS.rows&&Array.isArray(o.categories),'DIAGNOSTIC');
    const allowed=i===0?READERS:STATES;need(o.categories.length<=allowed.length,'DIAGNOSTIC');let sum=0,last='';
    for(const row of o.categories){need(keys(row,['id','count'])&&allowed.includes(row.id)&&row.id>last&&Number.isSafeInteger(row.count)&&row.count>0,'DIAGNOSTIC');sum+=row.count;last=row.id;}
    need(sum===o.differenceCount&&o.comparisonVerdict===(sum?'DIFFERENT':'MATCH'),'DIAGNOSTIC');
    return {kind:o.kind,categories:o.categories.map(r=>({id:r.id,count:r.count})),differenceCount:o.differenceCount,comparisonVerdict:o.comparisonVerdict};
  });
}
function tapCensus(){
  const decode=new StringDecoder('utf8');let pending='',bad=false,header=0,plan=null,results=[],trailer=[],done=false;
  const order=['tests','suites','pass','fail','cancelled','skipped','todo','duration_ms'];const values={};
  function line(s){
    if(s==='TAP version 13'){if(header++||results.length||trailer.length)bad=true;return;}
    let m=/^1\.\.([0-9]+)$/.exec(s);if(m){if(header!==1||plan!==null||trailer.length||Number(m[1])!==results.length)bad=true;plan=Number(m[1]);return;}
    m=/^(not ok|ok) ([0-9]+) - /.exec(s);if(m){if(header!==1||plan!==null||trailer.length||Number(m[2])!==results.length+1)bad=true;if(results.length===4){bad=true;return;}results.push(m[1]);return;}
    m=/^# (tests|suites|pass|fail|cancelled|skipped|todo|duration_ms) (\d+(?:\.\d+)?)$/.exec(s);
    if(m){if(plan===null||m[1]!==order[trailer.length]||own(values,m[1]))bad=true;if(trailer.length===order.length){bad=true;return;}trailer.push(m[1]);values[m[1]]=Number(m[2]);return;}
    if(trailer.length&&s.trim()!=='')bad=true;
  }
  return {push(bytes){pending+=decode.write(bytes);if(pending.length>65536&&!pending.includes('\n')){bad=true;pending='';}let i;while((i=pending.indexOf('\n'))>=0){const row=pending.slice(0,i).replace(/\r$/,'');if(row.length>65536)bad=true;else line(row);pending=pending.slice(i+1);}},finish(){
    need(!done,'CENSUS');done=true;pending+=decode.end();if(pending.trim())line(pending);
    need(!bad&&header===1&&trailer.length===order.length&&plan===results.length,'CENSUS');
    for(const k of order.slice(0,-1))need(Number.isSafeInteger(values[k])&&values[k]>=0,'CENSUS');
    need(values.suites===0&&values.tests===results.length&&values.pass===results.filter(r=>r==='ok').length&&values.fail===results.filter(r=>r==='not ok').length,'CENSUS');
    return Object.fromEntries(['tests','pass','fail','cancelled','skipped','todo'].map(k=>[k,values[k]]));
  }};
}
function summary(){return {gateVerdict:'UNAVAILABLE',captureVerdict:'FAIL',childExit:null,childSignal:null,tests:null,pass:null,fail:null,cancelled:null,skipped:null,todo:null,comparisons:KINDS.map(kind=>({kind,comparisonVerdict:'NOT_OBSERVED',differenceCount:null,categories:[]})),fixedFailureCode:'NONE'};}
async function capture(dir){
  const out=summary(),counts=tapCensus(),state={error:null,overflow:false,bytes:{stdout:0,stderr:0}},fds={};
  const error=code=>{if(!state.error)state.error=code;};
  for(const name of ['stdout','stderr'])try{fds[name]=fs.openSync(path.join(dir,name+'.raw'),'wx',0o600);}catch(_){error('RAW_IO');}
  let child;
  try{const env={...process.env,EARNED_B1B2_CAPTURE_DIR:dir};delete env.EARNED_B1B2_CAPTURE_COMMISSION;child=cp.spawn(process.execPath,ARGV,{cwd:ROOT,env,windowsHide:true,stdio:['ignore','pipe','pipe']});}catch(_){error('SPAWN');}
  if(child){
    for(const name of ['stdout','stderr']){
      if(!child[name]){error('SPAWN');continue;}
      child[name].on('error',()=>error('RAW_IO'));
      child[name].on('data',chunk=>{const b=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);if(name==='stdout')try{counts.push(b);}catch(_){error('CENSUS');}
        const take=Math.max(0,Math.min(b.length,CAPS[name]-state.bytes[name]));state.bytes[name]+=b.length;if(take!==b.length)state.overflow=true;
        if(take&&fds[name]!==undefined)try{let off=0;while(off<take){const n=fs.writeSync(fds[name],b,off,take-off);need(Number.isSafeInteger(n)&&n>0,'RAW_IO');off+=n;}}catch(_){error('RAW_IO');try{fs.closeSync(fds[name]);}catch(_){}delete fds[name];}
      });
    }
    await new Promise(resolve=>{child.on('error',()=>error('SPAWN'));child.on('close',(code,signal)=>{out.childExit=Number.isInteger(code)?code:null;out.childSignal=signal===null?null:['SIGTERM','SIGINT','SIGKILL','SIGABRT','SIGSEGV','SIGBREAK'].includes(signal)?signal:'OTHER_SIGNAL';resolve();});});
  }
  for(const fd of Object.values(fds))try{fs.fsyncSync(fd);fs.closeSync(fd);}catch(_){error('RAW_IO');try{fs.closeSync(fd);}catch(_){}}
  try{Object.assign(out,counts.finish());}catch(_){error('CENSUS');}
  if(out.childExit!==null||out.childSignal!==null)out.gateVerdict=out.childExit===0&&out.childSignal===null&&out.tests===4&&out.pass===4&&out.fail===0&&out.cancelled===0&&out.skipped===0&&out.todo===0?'PASS':'FAIL';
  if(state.overflow)error('RAW_OVERFLOW');
  let observed=[];
  try{safeDirectory(dir);const p=path.join(dir,'native-diagnostics.jsonl');need(safeFile(p).size<=CAPS.diagnostic,'DIAGNOSTIC');observed=diagnostics(fs.readFileSync(p));for(let i=0;i<observed.length;i++)out.comparisons[i]=observed[i];need(!fs.existsSync(path.join(dir,'capture-manifest.json'))&&observed.length===2,'DIAGNOSTIC');}catch(_){error('DIAGNOSTIC');}
  if(out.gateVerdict!=='PASS')error('CHILD');
  if(observed.some(r=>r.comparisonVerdict!=='MATCH'))error('CHILD');
  out.captureVerdict=state.error?'FAIL':'PASS';out.fixedFailureCode=state.error||'NONE';
  try{const file=path.join(dir,'capture-manifest.json');if(fs.existsSync(file)){safeFile(file);need(fs.readFileSync(file,'utf8')==='{\"v\":1,\"pending\":true}\n','RAW_IO');}fs.writeFileSync(file,JSON.stringify({v:1,complete:out.captureVerdict==='PASS',bytes:state.bytes,overflow:state.overflow,childExit:out.childExit,childSignal:out.childSignal,captureFailure:out.fixedFailureCode})+'\n',{flag:fs.existsSync(file)?'w':'wx',mode:0o600});}catch(_){out.captureVerdict='FAIL';out.fixedFailureCode='RAW_IO';}
  return out;
}
async function main(){let out;try{verifyCommission();out=await capture(createDirectory());}catch(e){out=summary();out.fixedFailureCode=['SCOPE','IDENTITY','ACCESS'].includes(e&&e.code)?e.code:'IDENTITY';}process.stdout.write(JSON.stringify(out)+'\n');process.exitCode=out.gateVerdict==='PASS'&&out.captureVerdict==='PASS'?0:1;}
// No dependency injection or lowered limits are reachable from the production entry.
// Tests load these exact functions in an isolated module realm with synthetic OS transports.
module.exports=Object.freeze({diagnostics,tapCensus,capture,verifyCommission,createDirectory,secureWindowsDirectory,main,ARGV,CAPS});
if(require.main===module)main().catch(()=>{const out=summary();out.fixedFailureCode='SPAWN';process.stdout.write(JSON.stringify(out)+'\n');process.exitCode=1;});
