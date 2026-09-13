import fs from 'node:fs';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const candidate='2fdf33e5d3d357b8886591cfec7252ebf3518013',archive='4c355b2751e14f281bd5c529a67d2492675dbaca',prefix='rebuild/lanes/e/reviews/frozen-build-setup-evidence/',dir='.tmp/frozen-author-reconciliation';fs.mkdirSync(dir,{recursive:true});
function blob(ref,p){const r=spawnSync('git',['show',ref+':'+p],{maxBuffer:4*1024*1024});if(r.status)throw Error('Named author blob unavailable');return r.stdout;}
const inputs=[{ref:candidate,path:'rebuild/lanes/e/FROZEN-BUILD-SETUP-REPORT.md',local:'report.md'},
 {ref:archive,path:prefix+'INDEX.md',local:'INDEX.md',bytes:1279,sha256:'b3a7cd141b93e230004770a5b692f4296056e7ac79d959732eb32e2212e64436'},
 {ref:archive,path:prefix+'ORIGINAL-PATHS.json',local:'ORIGINAL-PATHS.json',bytes:5102,sha256:'ff14cdeb359bacd702d601d3e7c981b3122318b24163736b8006eb95d11fa9ac'}];
const read=inputs.map(x=>{const b=blob(x.ref,x.path);if(x.bytes&&b.length!==x.bytes||x.sha256&&sha(b)!==x.sha256)throw Error('Author pin mismatch');fs.writeFileSync(dir+'/'+x.local,b);return {...x,bytes:b.length,sha256:sha(b),lines:b.toString().trimEnd().split('\n').length};});
fs.writeFileSync(dir+'/first-read.json',JSON.stringify({firstVerdict:'561d3b2779decaaa7f5b8e8bca21f1cbdd9a08ad',sentBeforeAuthorRead:true,readAt:new Date().toISOString(),inputs:read},null,2)+'\n');
console.log(JSON.stringify(read));console.log(fs.readFileSync(dir+'/report.md','utf8'));console.log(fs.readFileSync(dir+'/INDEX.md','utf8'));const map=JSON.parse(fs.readFileSync(dir+'/ORIGINAL-PATHS.json'));console.log('MAP KEYS',Object.keys(map));console.log(JSON.stringify(map));
