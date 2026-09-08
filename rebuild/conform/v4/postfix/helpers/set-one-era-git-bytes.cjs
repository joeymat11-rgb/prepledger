'use strict';
// Exact D30 large-blob transport only. All caller hash/byte checks still run;
// the original 16 MiB legacy Git reader remains untouched for every other path.
const {execFileSync}=require('node:child_process');
const FILES=Object.freeze(['rebuild/conform/v4/postfix/acceptance-set-one-era.json','rebuild/conform/v4/postfix/fixtures/set-one-era-deltas.json']);
const MAX_BYTES=64*1024*1024,TIMEOUT_MS=60000;
function fail(code){const e=Error(code);e.code=code;throw e;}
function read(root,args,maxBuffer){try{return execFileSync('git',args,{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe'],maxBuffer,timeout:TIMEOUT_MS,env:{...process.env,GIT_TERMINAL_PROMPT:'0'}});}catch{fail('ERA-GIT-READ');}}
function object(root,ref,file){
 if(!FILES.includes(file)||ref!=='HEAD'&&!/^[a-f0-9]{40}$/.test(ref))fail('ERA-GIT-SELECTOR');
 const spec=ref+':'+file;
 if(read(root,['cat-file','-t',spec],4096).toString('utf8').trim()!=='blob')fail('ERA-GIT-TYPE');
 const text=read(root,['cat-file','-s',spec],4096).toString('utf8');if(!/^(?:0|[1-9]\d*)\r?\n$/.test(text))fail('ERA-GIT-SIZE');
 const size=Number(text.trim());if(!Number.isSafeInteger(size)||size<1||size>MAX_BYTES)fail('ERA-GIT-SIZE');
 const bytes=read(root,['cat-file','blob',spec],MAX_BYTES+1);if(bytes.length!==size)fail('ERA-GIT-BYTE-COUNT');return bytes;
}
module.exports={FILES,MAX_BYTES,TIMEOUT_MS,object};
