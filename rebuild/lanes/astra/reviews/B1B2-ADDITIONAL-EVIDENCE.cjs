'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict'),util=require('node:util');
const root=path.resolve(__dirname,'../../../..'),base=path.join(root,'.tmp/er-b1b2'),pub=path.join(base,'public'),out=path.join(base,'results');
assert.match(root.replaceAll('\\','/'),/\/work\/pm-caretaker\/review-b1b2-complete$/);assert.equal(process.version,'v22.23.2');
const M='100820aa47a4f8729642033499eaec0f0ee282e1';
const manifest=JSON.parse(fs.readFileSync(path.join(base,'public-manifest.json'))),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function verify(dir,overrides={}){for(const row of manifest.files)assert.equal(sha(fs.readFileSync(path.join(dir,row.file))),overrides[row.file]||row.sha256,row.file);assert(!fs.existsSync(path.join(dir,'rebuild/engine/seed.cjs')));}
function copy(label){const dir=path.join(base,label);assert(!fs.existsSync(dir),'fresh copy '+label);verify(pub);for(const row of manifest.files){const dst=path.join(dir,row.file);assert(dst.startsWith(dir+path.sep));fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(path.join(pub,row.file),dst);}verify(dir);return dir;}
const env={...process.env,TZ:'America/New_York',TEMP:path.join(base,'temp'),TMP:path.join(base,'temp')};for(const k of Object.keys(env))if(/^(NODE_OPTIONS|NODE_PATH|NODE_V8_COVERAGE|V8_COVERAGE|NODE_TEST_CONTEXT|NODE_TEST_WORKER_ID)$/i.test(k))delete env[k];
const rows=[];
function run(dir,label,argv,extras={}){const t=performance.now(),r=cp.spawnSync(process.execPath,argv,{cwd:dir,env:{...env,EARNED_REVIEW_ROOT:dir,...extras},encoding:'utf8',maxBuffer:64*1024*1024,windowsHide:true});assert(!r.error,r.error?.message);fs.writeFileSync(path.join(out,label+'.stdout.log'),r.stdout);fs.writeFileSync(path.join(out,label+'.stderr.log'),r.stderr);const row={label,argv,status:r.status,durationMs:performance.now()-t,stdoutSha256:sha(r.stdout),stderrSha256:sha(r.stderr),totals:Object.fromEntries([...r.stdout.matchAll(/^# (tests|pass|fail|cancelled|skipped|todo) (\d+)$/gm)].map(x=>[x[1],+x[2]]))};rows.push(row);return{...r,row};}
const action=process.argv[2];
if(action==='q2'){
 const A=require('./B1B2-IDENTITY-REVIEW-ANNEX.cjs'),edit=A.Q2_LOOKUP_MUTANT,dir=copy('q2'),file=path.join(dir,edit.relativePath),original=fs.readFileSync(file),text=original.toString();
 const argv=['--test','--test-reporter=tap',path.join(__dirname,'B1B2-IDENTITY-REVIEW-RUN.cjs')],extra={EARNED_REVIEW_Q2_ONLY:'1'};
 assert.equal(run(dir,'q2-original',argv,extra).status,0);assert.equal(text.split(edit.before).length,2);
 const mutant=text.replace(edit.before,edit.after),mutantHash=sha(mutant);
 try{
  fs.writeFileSync(file,mutant);verify(dir,{[edit.relativePath]:mutantHash});
  const old=run(dir,'q2-mutant-committed-delta',['rebuild/lanes/b/b2-delta-cells.cjs']);assert.equal(old.status,0);assert.match(old.stdout,/32\/32 HOLD · side CANDIDATE · Q2 NOT APPLIED/);
  const probe=run(dir,'q2-mutant-independent',argv,extra);assert.equal(probe.status,1);assert.equal(probe.row.totals.tests,1);assert.equal(probe.row.totals.fail,1);assert.match(probe.stdout,/code: 'ERR_ASSERTION'/);assert.match(probe.stdout,/Q2 FIXED OWNER: atFront/);assert.match(probe.stdout,/review-short/);assert.match(probe.stdout,/review-incline/);
 }finally{fs.writeFileSync(file,original);verify(dir);}
 assert.equal(run(dir,'q2-restored',argv,extra).status,0);verify(dir);fs.writeFileSync(path.join(out,'q2-evidence.json'),JSON.stringify({candidate:manifest.candidate,mutant:{file:edit.relativePath,originalSha256:sha(original),mutantSha256:mutantHash},rows,restored:true},null,2)+'\n');
}else if(action==='public-M'){
 const dir=copy('public-M'),overrides={};
 for(const row of manifest.identity){const b=cp.execFileSync('git',['show',M+':'+row.file],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});fs.writeFileSync(path.join(dir,row.file),b);overrides[row.file]=sha(b);}verify(dir,overrides);
 fs.writeFileSync(path.join(out,'public-M-manifest.json'),JSON.stringify({sourceBase:M,syntheticCarrier:manifest.candidate,files:manifest.files.map(r=>({...r,sha256:overrides[r.file]||r.sha256}))},null,2)+'\n');
 const r=run(dir,'public-laws-M',['rebuild/conform/v4/postfix/legacy-b1b2-carriers.cjs','--public-laws']);assert.equal(r.status,0);verify(dir,overrides);
 const p='.tmp/b1b2-public-audit/',a=JSON.parse(fs.readFileSync(path.join(dir,p,'public-laws-M.json'))),b=JSON.parse(fs.readFileSync(path.join(pub,p,'public-laws-candidate.json')));
 assert.equal(a.rows.length,45);assert.equal(b.rows.length,45);const changes=a.rows.filter((r,i)=>!util.isDeepStrictEqual(r,b.rows[i])).map(r=>r.defect);
 assert.deepEqual(changes,['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D16','D17','D18','D19','D21','D23','D24','D25','D27','D28','D29','D30','D31','D32','D45']);
 assert.deepEqual(a.rows.find(r=>r.defect==='D22'),b.rows.find(r=>r.defect==='D22'));
 const d45=structuredClone(a.rows.find(r=>r.defect==='D45')),old='last night — h; 0 consecutive night(s) at his 7.5 h target; the session is flagged NORMAL',current='UNKNOWN (no current finite sleep observation); 0 consecutive night(s) at the recorded 7.5 h target; no observed short-sleep restriction';assert.equal(d45.frames[0].result.split(old).length,2);d45.frames[0].result=d45.frames[0].result.replace(old,current);assert.deepEqual(d45,b.rows.find(r=>r.defect==='D45'));
 const d7=run(dir,'identity-M',['--test','--test-reporter=tap',path.join(__dirname,'B1B2-IDENTITY-REVIEW-RUN.cjs')],{EARNED_REVIEW_SIDE:'base'});assert.equal(d7.status,1);verify(dir,overrides);
 fs.writeFileSync(path.join(out,'public-M-evidence.json'),JSON.stringify({sourceBase:M,rows,totals:{M:a.totals,candidate:b.totals},changes,d22CompleteRowParity:true,d45OnlyLicensedCopy:true,sourcePreserved:true},null,2)+'\n');
}else throw Error('closed action');
console.log(JSON.stringify({action,rows}));
