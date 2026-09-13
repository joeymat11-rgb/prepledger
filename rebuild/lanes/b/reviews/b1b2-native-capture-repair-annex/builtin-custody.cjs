'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../../..'),base=path.join(root,'.tmp/er-native-capture-repair'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const nodeSha='0d0f5e39f9f3d9587bc19f73eab3c2c9c4903fd02d6dbf9c853dd81b3d95fad4';
assert.equal(process.version,'v22.23.2');assert.equal(sha(fs.readFileSync(process.execPath)),nodeSha);
const specs=[
 ['async_hooks','70ccf0924b391ef4bab09721dbd8637b4c542cee5f7e016b24e6c46ccd61491c',[[1,297]]],
 ['internal/async_hooks','ba3796c9c95212cad67561d13924865defbf5dd59c6fb7c5237cab194639e53c',[[1,638]]],
 ['internal/promise_hooks','30a555b933f6ef49f0c93001fce25eca042f301a74e785dd95af94521c265a1e',[[1,127]]],
 ['internal/async_context_frame','69b0eb6a63200f2892175aff24a2ab328c8f22cc38052179baaeae24691b5636',[[1,78]]],
 ['internal/errors','b9af59ffba4fe768ddb48a484cd5370004961cac5d4a0f5905a5c9307026d14d',[[1,80],[190,260],[370,590],[1010,1129],[1458,1465]]],
 ['internal/util','2e5eb87114e5b919b248bbfa6c3a43f07bc49884cd3a48653a346916614dd691',[[1,90],[703,715],[947,1024]]],
 ['internal/validators','20e552e4b034c71d6feb343bcc676b6dc13d3eb1d0613e20da26fd73168ca8bb',[[1,50],[450,495]]],
 ['internal/util/types','2301cf16fd792af521e044b013136ef7188b68a46f885eafc7281e0acb5903f7',[[1,116]]],
 ['internal/options','effe1d5cd2803f1fc663248f933c70de1656b8b50d2268b7c22c09cf8d12571d',[[1,121]]],
 ['internal/assert','010606835f1b3e2b6c15c29bda0d73789469380e0abd89a4e20d196f3f23f9bb',[[1,23]]],
 ['internal/per_context/primordials','f76722b798e9b53d2693bf5b9f26c3201cbfc379a9b5ad5d1f3afabf2a77a164',[[1,100]]],
];
const modules=specs.map(([id,hash,ranges])=>{const file=path.join(base,'builtins',id.replaceAll('/','__')+'.js'),b=fs.readFileSync(file);assert.equal(sha(b),hash);return{id,bytes:b.length,sha256:hash,reviewedLines:ranges,entireModule:ranges.length===1&&ranges[0][1]===b.toString().split('\n').length};});
const authorRef='79f3be07adfaad5eb955866798952b5315ea1a33',prefix='rebuild/lanes/b/reviews/b1b2-native-capture-repair-evidence/';
const authorInputOnly=[['builtin-closure.json','19fd9292ae6889e7175f2004982baf5f39979b2036629d527b9186117ecc0ecd'],['builtin-closure.final.json','3c783e7924cbe274d23b23f57672a3fd38cbdc35838c12ab4c37b0a1ae984fef']].map(([name,hash])=>{
 const b=cp.execFileSync('git',['show',authorRef+':'+prefix+name],{cwd:root,windowsHide:true,maxBuffer:20000});assert.equal(sha(b),hash);fs.writeFileSync(path.join(base,'author-input-'+name),b);return{ref:authorRef,path:prefix+name,bytes:b.length,sha256:hash,earlyRead:'PM separately permitted both complete input-only manifests; no other author outputs opened'};
});
// Source inspection above precedes the first proposed-module load in this driver.
// No hook is enabled here; creating an empty hook permits exact prototype pins.
const hooks=require('node:async_hooks'),hook=hooks.createHook({}),string=Function.prototype.toString;
const functions=[['createHook',hooks.createHook,'fe8223decbb582cec92799127df3e5a5231a8d5d467b31b9216ec2d903d54460'],['enable',hook.enable,'857ccb0b6fe725486e1fdd07fede7b909a067d294050c957b7b95d49c6973fc0'],['disable',hook.disable,'7b21d3e0c8841ef1785fd7a1b18fa975f9f3c92f7d2d0aad40a948987c7d60e1'],['unlinkSync',fs.unlinkSync,'2b2d28c8fd4dafdb8f216f278863c3671344be98d86803ff41a72bbf37087cad']].map(([name,fn,hash])=>{const text=Reflect.apply(string,fn,[]);assert.equal(sha(text),hash);return{name,bytes:Buffer.byteLength(text),sha256:hash};});
const record={node:{version:process.version,sha256:nodeSha},modules,functions,authorInputOnly,hookEnabledByThisDriver:false,analysis:[
 'AsyncHook validates and stores callbacks by symbols. enable/disable update active or staged hook arrays, counts, trampoline and Promise-hook mode; staged arrays are installed after the current hook callback depth returns to zero.',
 'Observer init and promiseResolve ignore every argument and only set one bounded Boolean. They perform no IO, identifier/payload access, scheduling or explicit throw. Node treats exceptions from async-hook dispatch as fatal, so fatal callback tests are excluded.',
 'Promise tracking assigns private async-id symbols, including to promises made before activation. Promise-hook dispatch calls trackPromise before promiseResolve. This mutable bookkeeping is part of the behavior to challenge with invented precreated promises.',
 'disableHooks removes the callback trampoline and internally queues disablePromiseHookIfNecessary. The latter stops the native Promise hook only if no new hook needs it. This internal deferred teardown is not user-work completion evidence.',
 'Candidate enables at real outer exit dispatch, delegates exactly once, restores emitter ownership and validates pending marker while observed, disables, checks latch, and finally calls a pinned synchronous unlink wrapper.',
 'Function text pins reject replaced methods at capture setup. Text equality does not itself prove all native internals or dynamic callers safe; actual lifecycle controls remain necessary.'
 ],opaqueBoundaries:[
 'Pinned Node/V8 native async_wrap counters, resource creation, callback trampoline, Promise hook setPromiseHooks and task_queue enqueueMicrotask.',
 'Pinned native async_context_frame, errors, symbols, util/types, options, constants, string_decoder and bootstrap/module-loading machinery. Lazy AsyncLocalStorage/AsyncResource routes are not exercised by this observer and are not claimed reviewed.',
 'Only relevant validation/error/primordial routes were read in broad support modules; unrelated exports and untraversed lazy error formatting are not source-review claims.',
 'Final unlinkSync JavaScript wrapper was inspected and pinned; getValidatedPath and native filesystem unlink remain trusted opaque pinned-runtime boundaries, not separately opened source.'
 ],newAuthorCompletionOutcomesRead:false};
fs.writeFileSync(path.join(base,'builtin-closure.json'),JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify({modules:modules.length,functions,hookEnabled:false,newAuthorCompletionOutcomesRead:false}));
