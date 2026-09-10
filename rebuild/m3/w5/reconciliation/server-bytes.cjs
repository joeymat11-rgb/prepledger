'use strict';
// Server-owned JSON graphs only. Network graphs still enter the original
// duplicate-key/UTF-8/schema validators. Nothing here grants authenticity.
const {createHash}=require('node:crypto');
const {canonicalEncode}=require('../../../authority/canonical.cjs');
const BASE=require('./codec.cjs');
const LIMIT=8192;
function* quoted(value,canonical){
 const text=canonical?value.normalize('NFC'):value;
 yield '"';
 for(let offset=0;offset<text.length;){
  let end=Math.min(offset+LIMIT,text.length);
  if(end<text.length&&text.charCodeAt(end-1)>=0xd800&&text.charCodeAt(end-1)<=0xdbff&&text.charCodeAt(end)>=0xdc00&&text.charCodeAt(end)<=0xdfff)end--;
  yield JSON.stringify(text.slice(offset,end)).slice(1,-1);offset=end;
 }
 yield '"';
}
function* parts(value,canonical=false,field){
 if(typeof value==='string'){yield* quoted(value,canonical);return;}
 if(value===null||typeof value!=='object'){
  const out=canonical?canonicalEncode(value):JSON.stringify(value);
  if(out===undefined)throw TypeError('Server JSON requires a defined value');yield out;return;
 }
 if(Array.isArray(value)){
  if(canonical&&field==='causal_parents'){
   const prefix='{"causal_parents":';yield canonicalEncode({causal_parents:value}).slice(prefix.length,-1);return;
  }
  yield '[';let first=true;
  for(const item of value){if(canonical&&item===undefined)continue;if(!first)yield ',';first=false;yield* parts(item,canonical);}
  yield ']';return;
 }
 yield '{';let first=true;
 for(const key of canonical?Object.keys(value).sort():Object.keys(value)){
  const item=value[key];if(canonical&&item===undefined)continue;
  if(!first)yield ',';first=false;yield* quoted(key,false);yield ':';yield* parts(item,canonical,key);
 }
 yield '}';
}
function length(value){let n=0;for(const part of parts(value))n+=Buffer.byteLength(part);return n;}
function update(sink,value,{canonical=false,domain}={}){
 if(domain!==undefined)sink.update(domain,'utf8');
 for(const part of parts(value,canonical))sink.update(part,'utf8');return sink;
}
function hashJSON(tag,value){return update(createHash('sha256').update(tag+'\0','utf8'),value).digest('base64url');}
function codec(){
 // One instance per bridge read. The same base64 occurrence is decoded once;
 // generated row bytes and cursor bytes remain privately owned until return.
 const decoded=new Map();
 function decode64(value,max=BASE.LIMITS.payload){
  if(typeof value!=='string'||!/^[A-Za-z0-9_-]*$/.test(value)||value.length%4===1||Math.floor(value.length*3/4)>max)BASE.fail();
  const remainder=value.length%4;
  if(remainder){const last='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.indexOf(value[value.length-1]);if(last&(remainder===2?15:3))BASE.fail();}
  let bytes=decoded.get(value);if(!bytes){bytes=Buffer.from(value,'base64url');decoded.set(value,bytes);}return bytes;
 }
 function encode64(value){const bytes=typeof value==='string'?Buffer.from(value,'utf8'):Buffer.from(value);const out=bytes.toString('base64url');decoded.set(out,bytes);return out;}
 function parse(value,max=16777216){
  if(typeof value!=='string')return BASE.parse(value,max);
  if(Buffer.byteLength(value)>max)BASE.fail('RECONCILE_LIMIT',413);
  // This branch accepts only worker-owned fatal-decoded text; preserving BOM
  // refusal here also keeps direct bridge string calls compatible.
  if(value.charCodeAt(0)===0xfeff)BASE.fail();
  // Direct bridge callers can supply UTF-16 that no fatal UTF-8 worker reader
  // can produce. Preserve the original TextEncoder replacement in that case.
  for(let i=0;i<value.length;i++){
   const code=value.charCodeAt(i);
   if(code>=0xd800&&code<=0xdbff){const next=value.charCodeAt(++i);if(!(next>=0xdc00&&next<=0xdfff))return BASE.parse(value,max);}
   else if(code>=0xdc00&&code<=0xdfff)return BASE.parse(value,max);
  }
  return BASE.parseOwnedText(value);
 }
 return {...BASE,decode64,encode64,parse};
}
// Fully validated assembly is measured before a Response exists. Pull merely
// emits deterministic bytes; no validation/signing/database work is deferred.
const responses=new WeakMap();
function markResponse(value){responses.set(value,length(value));return value;}
function responseBody(value){
 if(!responses.has(value))return JSON.stringify(value);
 const iterator=parts(value),encoder=new TextEncoder();
 return new ReadableStream({pull(controller){
  let text='';while(text.length<16384){const next=iterator.next();if(next.done){if(text)controller.enqueue(encoder.encode(text));controller.close();return;}text+=next.value;}
  controller.enqueue(encoder.encode(text));
 },cancel(){iterator.return();}});
}
module.exports={parts,length,update,hashJSON,codec,markResponse,responseBody};
