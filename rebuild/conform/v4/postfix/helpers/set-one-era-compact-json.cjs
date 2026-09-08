'use strict';
// Proposed D30-only byte-format carrier. All parsing behavior comes from the
// immutable parent parser; only its final canonical whitespace expression is
// projected. The original parser/file and all parent formats remain unchanged.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const ORIGINAL_SHA='5722f233e704149f03f2898bf739c3cc42fe323a0c91e0eee55eb82cc57a3478';
const BEFORE='JSON.stringify(parsed,null,2)',AFTER='JSON.stringify(parsed)';
function fail(code){const e=Error(code);e.code=code;throw e;}
function sourceProjection(bytes){
 if(!Buffer.isBuffer(bytes)||crypto.createHash('sha256').update(bytes).digest('hex')!==ORIGINAL_SHA)fail('ERA-JSON-SOURCE-PIN');
 const original=bytes.toString('utf8');if(original.split(BEFORE).length!==2||original.includes(AFTER))fail('ERA-JSON-SOURCE-SITE');
 const projected=original.replace(BEFORE,AFTER);if(projected.split(AFTER).length!==2||!Buffer.from(projected.replace(AFTER,BEFORE),'utf8').equals(bytes))fail('ERA-JSON-SOURCE-REVERSAL');
 return projected;
}
const file=path.resolve(__dirname,'../strict-json.cjs'),source=sourceProjection(fs.readFileSync(file)),moduleObject={exports:{}};
vm.runInThisContext('(function(require,module,exports){\n'+source+'\n})',{filename:file})(require,moduleObject,moduleObject.exports);
function parseCompactExact(bytes){return moduleObject.exports.parseExact(bytes);}
module.exports={ORIGINAL_SHA,BEFORE,AFTER,sourceProjection,parseCompactExact};
