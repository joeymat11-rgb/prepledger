'use strict';
const {createHash}=require('node:crypto');
const {isDeepStrictEqual}=require('node:util');
const {createReplayCore}=require('./replay-core.cjs');
const core=createReplayCore({bytes:x=>Buffer.from(x),text:x=>Buffer.from(x).toString('utf8'),
 hash:x=>createHash('sha256').update(x).digest('hex'),equal:isDeepStrictEqual,
 runtime:()=>({node:process.versions.node,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone})});
module.exports={createReadingReplay:core.createReadingReplay,PROFILE:core.READING_PROFILE};
