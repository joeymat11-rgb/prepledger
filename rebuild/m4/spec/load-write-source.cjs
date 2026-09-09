'use strict';
// Closed source construction for Review146. This checks bytes; it does not
// replace the post-fix PACKAGE's receipt, behavior or whole-engine obligations.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const BASE='28ff3be3a0c47fa76b642015ac3757da5c76548c';
const FILES=['constants','dates','energy','index','merge','migrate','oracle-shim','plan','policy','progression','seed','sleep','today','volume','writers'].map(n=>'rebuild/engine/'+n+'.cjs');
const PREVIEW='rebuild/m3/w7-preview/browser-engine.cjs',FIXTURE='rebuild/m3/w7-preview/fixtures.cjs',EARN='rebuild/engine/earn.cjs';
const CHANGES=[
 ['D41-debut','if (q.newW != null) { ex.w = q.newW; ex.wAt = clock.nowISO(); }','if (q.newW != null) { ex.w = q.newW; ex.wAt = clock.nowISO(); } if (Array.isArray(q.newWSets)) ex.wSets = q.newWSets.slice();'],
 ['D41-reset','const oldW = ex3.w; ex3.w = ap.newW; ex3.wAt = clock.nowISO(); ex3.last = null;','const oldW = ex3.w; ex3.w = ap.newW; ex3.wAt = clock.nowISO(); if (Array.isArray(ex3.wSets) && typeof oldW === "number") ex3.wSets = ex3.wSets.map(w => w + ex3.w - oldW); ex3.last = null;'],
 ['D43-entry','w: ex2 && typeof ex2.w === "number" ? ex2.w : null,','w: typeof e.w === "number" ? e.w : ex2 && typeof ex2.w === "number" ? ex2.w : null,']
];
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
function replace(source,before,after,label){assert.equal(source.split(before).length,2,'Unique exact source site: '+label);return source.replace(before,after);}
function baseline(root){const out={};for(const file of [...FILES,PREVIEW,FIXTURE])out[file]=cp.execFileSync('git',['show',BASE+':'+file],{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:8e6});return out;}
function construct(before){
 const out={...before},writer='rebuild/engine/writers.cjs',migrate='rebuild/engine/migrate.cjs',index='rebuild/engine/index.cjs';
 assert.equal(sha(before[writer]),'8b4cc4048d00e36845e2652ee939583d55ee06132e166701945cc64fde136d36');
 for(const [id,a,b]of CHANGES)out[writer]=replace(out[writer],a,b,id);
 assert.equal(sha(out[writer]),'008d92961d210ed07850ea881bd3a9f01ee873c1958f8b7d3a47506342c96bf5');
 const marker='// Copied from frozen src/app.jsx @ fe516c1:2466-2558.\n';
 const start=before[migrate].indexOf(marker),bodyStart=start+marker.length,end=before[migrate].indexOf('// Copied from frozen',bodyStart);
 assert(start>=0&&end>bodyStart,'Exact earn declaration boundary');
 const body=before[migrate].slice(bodyStart,end);
 assert.equal(sha(body),'888af1dc693a4a0929b6883a7ce5393f908890cb633059e193fe92fd1bb212c3');
 out[migrate]=before[migrate].slice(0,start)+before[migrate].slice(end);
 out[migrate]=replace(out[migrate],'const localStorage = drafts;\n','const localStorage = drafts;\nconst earnWalk = (...args) => E.earnWalk(...args);\n','late earn binding');
 out[EARN]='"use strict";\n\n// One canonical, data-free implementation; callers supply state and earned day.\nmodule.exports = function createEarn(E) {\n'+['loadRungs','nextLoad','typicalError','beatsNoise'].map(n=>'const '+n+' = (...args) => E.'+n+'(...args);\n').join('')+'\n'+marker+body+'return { earnWalk };\n};\n';
 out[index]=replace(out[index],'  require("./migrate.cjs"),\n','  require("./migrate.cjs"),\n  require("./earn.cjs"),\n','canonical factory after migration delegate');
 out[PREVIEW]=replace(out[PREVIEW],'  require("../../engine/volume.cjs"),\n','  require("../../engine/volume.cjs"),\n  require("../../engine/earn.cjs"),\n','data-free browser dependency');
 return out;
}
function verify(root){
 assert.equal(arguments.length,1,'Source verifier accepts no caller-supplied postimage');
 const expected=construct(baseline(root));
 const actual=fs.readdirSync(path.join(root,'rebuild/engine')).filter(n=>n.endsWith('.cjs')).sort();
 assert.deepEqual(actual,[...FILES.map(f=>path.basename(f)),path.basename(EARN)].sort(),'Closed engine file inventory');
 for(const [file,bytes]of Object.entries(expected))assert.equal(fs.readFileSync(path.join(root,file),'utf8'),bytes,'Exact product construction: '+file);
 return Object.fromEntries(Object.entries(expected).map(([file,bytes])=>[file,sha(bytes)]));
}
module.exports={BASE,FILES,PREVIEW,EARN,CHANGES,sha,replace,baseline,construct,verify};
