'use strict';
// Frozen host compositions with synthetic I/O, supplied engine functions only.
const path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const SOURCE_BLOB='f98671d823f0d8cd83e730cdd930afe5f5e7b628';
const SPANS=Object.freeze({boot:[13270,13272],offer:[16217,16217],marker:[13259,13261],ghSyncBuild:[12364,12368],saveGuard:[22161,22185],restore:[13242,13252],skip:[17891,17891],unskip:[17907,17920]});
function source(root){const b=execFileSync('git',['show','fe516c1:src/app.jsx'],{cwd:root,windowsHide:true,maxBuffer:8*1024*1024});if(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex')!==SOURCE_BLOB)throw Error('HOST-SOURCE-PIN');return b.toString('utf8').split('\n');}
function createHosts({engine:T,record=()=>{},root}={}){
  if(!T||!root)throw Error('HOST-EXPLICIT-INPUTS');const lines=source(root),part=name=>lines.slice(SPANS[name][0]-1,SPANS[name][1]).join('\n');
  const KEY='synthetic-state',RESTORE_OFFER_KEY='pl-restore-offer';
  function storage(raw=null,marker=null){const data=new Map(),calls=[];if(raw!==null)data.set(KEY,raw);if(marker!==null)data.set(RESTORE_OFFER_KEY,marker);return{data,calls,getItem(k){calls.push(['get',k]);return data.has(k)?data.get(k):null;},setItem(k,v){calls.push(['set',k,v]);data.set(k,v);},removeItem(k){calls.push(['remove',k]);data.delete(k);}};}
  const markerFns=store=>new Function('localStorage',part('marker')+'\nreturn {restoreOfferStands,clearRestoreOffer};')(store);
  return{
    provenance:{sourceBlob:SOURCE_BLOB,spans:SPANS},storage,
    bootMarker({raw=null,marker=null}={}){const store=storage(raw,marker),fn=new Function('localStorage','KEY','RESTORE_OFFER_KEY','migrate','isPristineSeed','let raw=null;\n'+part('boot')+'\nreturn s;');const s=fn(store,KEY,RESTORE_OFFER_KEY,T.migrate,T.isPristineSeed);record('host.boot',{calls:store.calls,state:s});return{s,store};},
    offerMarker(s,store){const fn=new Function('s','isPristineSeed','restoreOfferStands',part('offer')+'\nreturn pristine9;');return fn(s,T.isPristineSeed,markerFns(store).restoreOfferStands);},
    clearMarker(store){return markerFns(store).clearRestoreOffer();},
    ghSyncBuild(local,remote,sha='synthetic-sha'){const names=['state','mergeState','migrate','normalizePlan','dataLossGuard','isoOf','todayStart','LEDGER_DICT','btoa'];const fn=new Function(...names,part('ghSyncBuild')+'\nreturn buildBody;')(...[local,T.mergeState,T.migrate,T.normalizePlan,T.dataLossGuard,T.isoOf,T.todayStart,'SYNTHETIC DICTIONARY',s=>Buffer.from(s,'binary').toString('base64')]);return fn(remote,sha);},
    saveGuard(prev,ns,opts={}){const store=storage(JSON.stringify(prev)),offline=[],warnings=[];const fn=new Function('prev','ns','opts','dataLossGuard','localStorage','KEY','setOffline','console','let parseFailed=false,stashOk=false;\n'+part('saveGuard'));const result=fn(prev,ns,opts,T.dataLossGuard,store,KEY,x=>offline.push(x),{warn:(...x)=>warnings.push(x)});record('host.save',{result,calls:store.calls,offline,warnings});return{result,durable:JSON.parse(store.data.get(KEY)),offline,warnings};},
    async restoreFromCloud(local,remote){const fetchCalls=[];const fn=new Function('fetch','migrate','mergeState','isoOf','todayStart',part('restore')+'\nreturn restoreFromCloud;')(async(...args)=>{fetchCalls.push(args);return{ok:true,json:async()=>remote};},T.migrate,T.mergeState,T.isoOf,T.todayStart);const result=await fn(local);record('host.restore',{fetchCalls,result,local,remote});return result;},
    liveSkip(s,id,day){const full=part('skip'),begin=full.indexOf('onClick={() => {')+'onClick={() => {'.length,end=full.indexOf('}} style',begin);if(begin<15||end<begin)throw Error('HOST-SKIP-ANCHOR');let next=null;const calls=[],done=s.sessionLog[day],e=done.entries.find(x=>x.id===id),ex=(s.exercises||[]).find(x=>x.id===id);const names=['s','done','dateSel','e','ex','window','_stampCorr','_fileCorr','deriveLastMeta','isoOf','todayStart','fmtShort','setS','save'];new Function(...names,full.slice(begin,end))(s,done,day,e,ex,{confirm:()=>true,alert:x=>calls.push(['alert',x])},T._stampCorr,T._fileCorr,T.deriveLastMeta,T.isoOf,T.todayStart,T.fmtShort,x=>{next=x;calls.push(['setS']);},x=>calls.push(['save',x]));record('host.skip',{calls,next});return next;},
    liveUnskip(s,id,day,raw='10,9'){let next=null;const calls=[],ex=(s.exercises||[]).find(x=>x.id===id),names=['s','dateSel','k','ex','window','_stampCorr','_fileCorr','deriveLastMeta','buildRirSets','isoOf','todayStart','fmtShort','setS','save'];new Function(...names,part('unskip'))(s,day,{id},ex,{prompt:()=>raw,alert:x=>calls.push(['alert',x])},T._stampCorr,T._fileCorr,T.deriveLastMeta,T.buildRirSets,T.isoOf,T.todayStart,T.fmtShort,x=>{next=x;calls.push(['setS']);},x=>calls.push(['save',x]));record('host.unskip',{calls,next});return next;}
  };
}
module.exports={SOURCE_BLOB,SPANS,createHosts};
