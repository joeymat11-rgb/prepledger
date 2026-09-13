'use strict';
// Full source/disk/HEAD validation. Held until PC: seed bytes are in inventory.
const assert=require('node:assert/strict');
const cp=require('node:child_process');
const H=require('./b1b2-evidence.cjs');
assert.deepEqual(process.argv.slice(2),[]);
const inventory=H.closedEngineInventory(),runtime=H.reconstructRuntime(),successor=H.reconstructSuccessor(),repair=H.reconstructRepair(),h3=H.reconstructH3();
// Fixed profile data only: no profile path can select an import or execution.
const profileFile='rebuild/lanes/b/tooling/packages/B1-B2.json';
const profileBytes=H.disk(profileFile);assert.deepEqual(profileBytes,H.blob('HEAD',profileFile));
const spec=JSON.parse(profileBytes);assert.equal(spec.sourceBase,H.M);
assert.ok(spec.product&&typeof spec.product==='object'&&!Array.isArray(spec.product));
const parentFile='rebuild/m4/spec/acceptance-h3-clean-init.json';
const parentRef='5f0c3781a227e18ffdf8236090fe2499ecd8782b';
const parentHash='b457b539a384d8c72531b880cd771e996c6b231f034a49272e899c1fba61e61f';
const git=args=>cp.execFileSync('git',args,{cwd:H.ROOT,windowsHide:true,maxBuffer:9e7});
const parentBytes=git(['show',parentRef+':'+parentFile]);
assert.equal(H.sha(parentBytes),parentHash,'immutable receipt187 H3 artifact');
assert.deepEqual(H.disk(parentFile),parentBytes);assert.deepEqual(H.blob('HEAD',parentFile),parentBytes);
const parent=JSON.parse(parentBytes);assert.equal(parent.sourceBase,H.H3_BASE);
assert.ok(parent.product&&typeof parent.product==='object'&&!Array.isArray(parent.product));
const tracked=git(['ls-files','--','rebuild/engine']).toString().trim().split('\n').filter(Boolean).sort();
assert.equal(tracked.length,inventory.total,'complete tracked engine inventory');
assert.equal(new Set(tracked).size,tracked.length);
const outside=tracked.filter(file=>!Object.hasOwn(spec.product,file));
assert.ok(outside.length>0,'nonzero engine files outside final product');
for(const file of outside) {
  const bytes=H.disk(file);assert.deepEqual(bytes,H.blob('HEAD',file),'outside product HEAD/disk '+file);
  if(Object.hasOwn(parent.product,file)) {
    const pin=parent.product[file];assert.ok(pin&&typeof pin==='object');
    assert.match(pin.post,/^[0-9a-f]{64}$/,'authenticated parent post '+file);
    assert.equal(H.sha(bytes),pin.post,'outside product byte-identical to parent post '+file);
  } else assert.deepEqual(bytes,H.blob(H.H3_BASE,file),'outside product byte-identical to H3 sourceBase '+file);
}
console.log('B1B2 ENGINE FILES DIFFERENTIAL: '+outside.length+' tracked rebuild/engine files outside product byte-identical');
console.log('B1B2 HISTORICAL ENGINE INVENTORY: '+runtime.length+' M/R runtime files; '+runtime.reduce((n,row)=>n+row.hunks,0)+' M/R hunks; '+h3+' original H3 hunks; '+inventory.original.unchanged+' M/R unchanged; '+inventory.original.added+' original evidence additions');
console.log('B1B2 SUCCESSOR ENGINE INVENTORY: '+successor.runtime.length+' R/S runtime files; '+successor.runtime.reduce((n,row)=>n+row.hunks,0)+' R/S hunks; '+inventory.successor.changed+' changed engine files; '+inventory.successor.unchanged+' R/S unchanged; '+inventory.successor.added+' successor evidence additions; S='+H.S);
console.log('B1B2 REPAIR ENGINE INVENTORY: '+repair.runtime.length+' S/T runtime files; '+repair.runtime.reduce((n,row)=>n+row.hunks,0)+' S/T hunks; '+inventory.repair.changed+' changed engine files; '+inventory.repair.unchanged+' S/T unchanged; '+inventory.repair.added+' repair evidence additions; '+inventory.total+' full disk/HEAD/T entries; T='+H.T);
