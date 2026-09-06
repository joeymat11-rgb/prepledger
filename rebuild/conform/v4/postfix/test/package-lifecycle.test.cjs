'use strict';
// Run the unchanged package tests under BOTH operational schema states in
// disposable copies. The synthetic ACCEPTED shape grants NO real approval;
// exact receipt verification still executes inside the package's synthetic Git.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const base=path.resolve(__dirname,'../../../../..'),relative='rebuild/conform/v4/postfix',source=path.join(base,relative);
// The package tests create a nested Git repository; keep its Windows path below
// Git's default path limit without changing the user's Git configuration.
const parent=path.join(require('node:os').tmpdir(),'earned-postfix-lifecycle');fs.mkdirSync(parent,{recursive:true});
const realManifest=path.join(source,'manifest-import-guards.json'),realBytes=fs.readFileSync(realManifest);
const sourceTest=fs.readFileSync(path.join(source,'test/package.test.cjs'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const status of ['PENDING','ACCEPTED'])test('actual package tests survive synthetic '+status+' envelope lifecycle',()=>{
  const root=fs.mkdtempSync(path.join(parent,'synthetic-')),directory=path.join(root,relative);
  try{
    fs.mkdirSync(path.dirname(directory),{recursive:true});fs.cpSync(source,directory,{recursive:true});
    assert.ok(fs.readFileSync(path.join(directory,'test/package.test.cjs')).equals(sourceTest));
    const e=JSON.parse(realBytes),line='- synthetic schema fixture · cowork · NO REAL APPROVAL; schema lifecycle only';
    e.receipts.review=status==='PENDING'?{status,receipt:null}:{status,receipt:{commit:'0'.repeat(40),path:'rebuild/DECISIONS.md',line,lineSha256:sha(line)}};
    fs.writeFileSync(path.join(directory,'manifest-import-guards.json'),JSON.stringify(e,null,2)+'\n');
    const env={...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:''};delete env.NODE_TEST_CONTEXT;
    const child=cp.spawnSync(process.execPath,['--test','--test-reporter=tap',path.join(directory,'test/package.test.cjs')],{cwd:root,encoding:'utf8',windowsHide:true,timeout:60000,maxBuffer:2*1024*1024,env});
    assert.equal(child.status,0,(child.stdout||'')+(child.stderr||''));
    assert.match(child.stdout,/# tests 73\b/);assert.match(child.stdout,/# pass 73\b/);assert.match(child.stdout,/# fail 0\b/);assert.match(child.stdout,/# skipped 0\b/);assert.match(child.stdout,/# cancelled 0\b/);
    for(const name of ['operational envelope refuses pending plus receipt','operational envelope refuses accepted without receipt','real synthetic artifact commit and exact ledger line produce noncircular acceptance','missing review stays pending, not a fabricated acceptance','new dedicated receipt refuses NOT ACCEPTED'])assert.ok(child.stdout.includes(name),name);
    assert.ok(fs.readFileSync(realManifest).equals(realBytes),'real operational manifest is unchanged');
  }finally{
    const resolved=fs.realpathSync(root);assert.ok(resolved.startsWith(fs.realpathSync(parent)+path.sep));fs.rmSync(resolved,{recursive:true,force:true});
  }
});
