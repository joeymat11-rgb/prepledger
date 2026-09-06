'use strict';
// Frozen-only diagnostic and synthetic-input carrier. No candidate supplies an answer.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const Parent=require('./import-guards-frozen.cjs'),Hosts=require('./import-guards-hosts.cjs');
const SOURCE_BLOB='f98671d823f0d8cd83e730cdd930afe5f5e7b628';
const BEFORE='const slopePer1k = den ? +((num / den) * 1000).toFixed(3) : 0;';
const AFTER='const slopePer1k = den ? +(num / den).toFixed(3) : 0;';
function frozenSource(root){const bytes=execFileSync('git',['show','fe516c1:src/app.jsx'],{cwd:root,windowsHide:true,maxBuffer:8*1024*1024});if(crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex')!==SOURCE_BLOB)throw Error('SE12-SOURCE-PIN');return bytes.toString('utf8');}
function authoredRollups(root,history){
 const lines=frozenSource(root).split('\n');
 // EXACT mk306, fmtShort310 and weekRollups597–625. The only HISTORY is caller-owned synthetic rows.
 return new Function('HISTORY',[lines[305],lines[309],...lines.slice(596,625)].join('\n')+'\nreturn weekRollups();')(history);
}
function createHosts(options){return {...Hosts.createHosts(options),authoredRollups:history=>authoredRollups(options.root,history)};}
function createFrozenEngine(options={}){
 const {root,bundle,clock,drafts}=options;if(!root||!bundle||!clock)throw Error('SE12-FROZEN-EXPLICIT-INPUTS');
 // Parent adapter remains literal and unchanged. It also exposes missing writer exports.
 return Parent.createFrozenEngine(options);
}
module.exports={SOURCE_BLOB,BEFORE,AFTER,frozenSource,authoredRollups,createHosts,createFrozenEngine};
