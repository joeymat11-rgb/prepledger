import fs from 'node:fs';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),dir='.tmp/author-reconciliation';fs.mkdirSync(dir,{recursive:true});
const refs=[
 {ref:'e85ad803ae8af600726c1491f35c90c7b3cd2c03',path:'rebuild/lanes/e/MEMORY-IDLE-CLIENT-FOUNDATION-REPORT.md',name:'final-report.md',bytes:6722,sha:'0a517f9675f5a44be8d856ab9abd156ab70d93bd568f8637bfdc3ff76419cfda'},
 {ref:'b7dc5a041cdcfdc9488b74ac0d84a28dcd8aa661',path:'rebuild/lanes/e/reviews/idle-client-foundation-evidence/INDEX.md',name:'INDEX.md',bytes:1681,sha:'88041bcf449d4c5789a2864432af241a65e2e2a2f632cbea6ed3c7fd9b14a177'},
 {ref:'b7dc5a041cdcfdc9488b74ac0d84a28dcd8aa661',path:'rebuild/lanes/e/reviews/idle-client-foundation-evidence/ORIGINAL-PATHS.json',name:'ORIGINAL-PATHS.json',bytes:11103,sha:'61fc7854b9d046e32d42fc5fde3a87bb18a9c6b55af27f91f6d68d0d435f37e7'}];
for(const x of refs){const r=spawnSync('git',['show',x.ref+':'+x.path],{maxBuffer:4*1024*1024});if(r.status)throw Error('Author blob read failed');if(r.stdout.length!==x.bytes||sha(r.stdout)!==x.sha)throw Error('Author blob identity mismatch');fs.writeFileSync(dir+'/'+x.name,r.stdout);console.log(x.name,x.bytes,x.sha);}
console.log(fs.readFileSync(dir+'/final-report.md','utf8'));console.log(fs.readFileSync(dir+'/INDEX.md','utf8'));
const map=JSON.parse(fs.readFileSync(dir+'/ORIGINAL-PATHS.json'));console.log('MAPPING KEYS',Object.keys(map));console.log(JSON.stringify(map).slice(0,2700));
fs.writeFileSync(dir+'/first-read.json',JSON.stringify({firstVerdict:'00c6237a2169aa6da2b3348c6b28ac8e821dbf9d',firstVerdictSentBeforeRead:true,readAt:new Date().toISOString(),refs},null,2)+'\n');
