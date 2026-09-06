'use strict';
// Exact reviewed UTF-8 JSON bytes, including a duplicate-DECODED-key check
// before JSON.parse has any opportunity to discard an earlier member.
const {TextDecoder}=require('node:util');
function bad(code){throw Object.assign(new Error(code),{code});}
function parseExact(bytes) {
  if(!Buffer.isBuffer(bytes))bad('JSON-BYTES');
  let text;try{text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{bad('JSON-UTF8');}
  let p=0;const ws=()=>{while(/[\x20\t\r\n]/.test(text[p]||'!'))p++;};
  function string(){const start=p;if(text[p++]!=='"')bad('JSON-SYNTAX');while(p<text.length){const c=text[p++];if(c==='"'){try{return JSON.parse(text.slice(start,p));}catch{bad('JSON-SYNTAX');}}if(c==='\\')p++;}bad('JSON-SYNTAX');}
  function value(){ws();const c=text[p];if(c==='"'){string();return;}
    if(c==='{'){p++;ws();const keys=new Set();if(text[p]==='}'){p++;return;}for(;;){ws();const key=string();if(keys.has(key))bad('JSON-DUPLICATE-KEY');keys.add(key);ws();if(text[p++]!==':')bad('JSON-SYNTAX');value();ws();const end=text[p++];if(end==='}')return;if(end!==',')bad('JSON-SYNTAX');}}
    if(c==='['){p++;ws();if(text[p]===']'){p++;return;}for(;;){value();ws();const end=text[p++];if(end===']')return;if(end!==',')bad('JSON-SYNTAX');}}
    const match=/^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(text.slice(p));if(!match)bad('JSON-SYNTAX');p+=match[0].length;
  }
  value();ws();if(p!==text.length)bad('JSON-SYNTAX');
  let parsed;try{parsed=JSON.parse(text);}catch{bad('JSON-SYNTAX');}
  if(!bytes.equals(Buffer.from(JSON.stringify(parsed,null,2)+'\n','utf8')))bad('JSON-NONCANONICAL-BYTES');
  return parsed;
}
module.exports={parseExact};
