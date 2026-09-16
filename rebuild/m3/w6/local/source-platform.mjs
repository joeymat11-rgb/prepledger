import {sha256} from '@noble/hashes/sha2.js';
import Profile from '../../../m4/import/local-source-profile.cjs';
const encoder=new TextEncoder(),decoder=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true});
export function losslessEqual(a,b){
 if(Object.is(a,b))return true;
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Object.getPrototypeOf(a)!==Object.getPrototypeOf(b))return false;
 const ak=Reflect.ownKeys(a).filter(k=>Object.prototype.propertyIsEnumerable.call(a,k)),bk=Reflect.ownKeys(b).filter(k=>Object.prototype.propertyIsEnumerable.call(b,k));
 return ak.length===bk.length&&ak.every(k=>bk.includes(k)&&losslessEqual(a[k],b[k]));
}
export function createSourcePlatform(){
 const bytes=x=>typeof x==='string'?encoder.encode(x):new Uint8Array(x);
 return Object.freeze({bytes,text:x=>decoder.decode(x),hash:x=>Array.from(sha256(bytes(x)),b=>b.toString(16).padStart(2,'0')).join(''),equal:losslessEqual,
 runtime:()=>({platform:'javascript',user_agent:globalThis.navigator?.userAgent??null,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone}),encode:Profile.encode});
}
