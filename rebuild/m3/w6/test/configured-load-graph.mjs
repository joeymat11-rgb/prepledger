// Test-only graph comparison. Original browser build/security guards are unchanged.
import assert from 'node:assert/strict';
import {realpathSync} from 'node:fs';
import {resolve,relative,isAbsolute} from 'node:path';

export function compareConfiguredGraphs(retained,candidate,{sourceRoot,candidateRoot,composed}){
 const index=(inventory,root)=>{
  const base=realpathSync(root),result=new Map();
  for(const input of inventory){
   assert(/^[a-f0-9]{64}$/.test(input.sha256),'input hash required');
   const absolute=realpathSync(resolve(root,input.path)),normalized=absolute.replaceAll('\\','/');
   let key;
   if(normalized.includes('/node_modules/'))key='dependency:'+normalized;
   else{
    const local=relative(base,absolute).replaceAll('\\','/');
    assert(!isAbsolute(local)&&local!==''&&local!=='..'&&!local.startsWith('../'),'external nondependency input');
    key='product:'+local;
   }
   assert(!result.has(key),'duplicate input identity: '+key);result.set(key,input.sha256);
  }return result;
 };
 const before=index(retained,sourceRoot),after=index(candidate,candidateRoot);
 const allowed=new Map(Object.entries(composed).map(([file,hash])=>['product:rebuild/m4/workout/'+file,hash]));
 for(const key of before.keys())assert(after.has(key),'missing bundle input: '+key);
 for(const [key,hash]of after){
  if(allowed.has(key))assert.equal(hash,allowed.get(key),'changed composed input: '+key);
  else{assert(before.has(key),'unexpected bundle input: '+key);assert.equal(hash,before.get(key),'changed unchanged input: '+key);}
 }
 return {retained:before.size,candidate:after.size};
}
