'use strict';
// Separate opt-in local check. Never loaded by the synthetic law runner.
// stdout is an allowlist of defect IDs and verdict labels; private details and
// exception messages never leave this process. A check error exits nonzero.
process.env.TZ='America/New_York';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {bundle}=require('./helpers.cjs');
const predicates=require('./live-predicates.cjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function check(today){
 const file=path.resolve(__dirname,'../private/live.json'),bytes=fs.readFileSync(file);
 const pin=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../oracle/manifest.json'),'utf8')).goldens['live.main'].blobSha256;
 if(sha(bytes)!==pin)throw Error('Private fixture pin mismatch');
 const raw=JSON.parse(bytes),result={};
 for(let i=1;i<=45;i++){
   const id='D'+i,predicate=predicates[id];if(typeof predicate!=='function')throw Error('Missing predicate');
   const verdict=predicate(structuredClone(raw),bundle('candidate').engine(today),today);
   if(typeof verdict==='boolean')result[id]=verdict?'TRIGGERED':'NOT TRIGGERED';
   else if(typeof verdict==='string'&&/^NOT APPLICABLE \([a-zA-Z0-9 ,;:'’/-]+\)$/.test(verdict))result[id]=verdict;
   else throw Error('Invalid verdict');
 }
 if(sha(fs.readFileSync(file))!==sha(bytes))throw Error('Private fixture changed');
 return result;
}
if(require.main===module){
 try{
  const at=process.argv.indexOf('--today');
  const today=at<0?new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()):process.argv[at+1];
  if(!/^\d{4}-\d{2}-\d{2}$/.test(today))throw Error('Invalid audit clock');
  const verdicts=check(today);for(const[id,verdict]of Object.entries(verdicts))console.log(id+' '+verdict);
 }catch{console.error('LIVE CHECK FAILED (private details withheld)');process.exitCode=1;}
}
module.exports={check};
