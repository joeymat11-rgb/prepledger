'use strict';
// Nonshipping value model. The actual strict parser is supplied by its witness;
// this is not a pluggable production validator, profile, save or permission.
function readLoad(raw,parseStrictJson){
 if(typeof raw!=='string'||typeof parseStrictJson!=='function')throw new TypeError('CONFIGURED_LOAD_MODEL_INPUT');
 const value=parseStrictJson(raw),keys=value&&typeof value==='object'&&!Array.isArray(value)?Object.keys(value):[];
 const exact=names=>keys.length===names.length&&names.every(k=>Object.hasOwn(value,k));
 if(exact(['value','unit'])&&value.unit==='lb'&&typeof value.value==='number'&&Number.isFinite(value.value)&&value.value>0)return structuredClone(value);
 if(exact(['kind','configuration_key'])&&value.kind==='configuration'&&typeof value.configuration_key==='string'&&value.configuration_key.trim().length>0)return structuredClone(value);
 throw new TypeError('CONFIGURED_LOAD_MODEL_VALUE');
}
module.exports={readLoad};
