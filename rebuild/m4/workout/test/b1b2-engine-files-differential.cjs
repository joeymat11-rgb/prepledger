'use strict';
// Full source/disk/HEAD validation. Held until PC: seed bytes are in inventory.
const assert=require('node:assert/strict');
const H=require('./b1b2-evidence.cjs');
assert.deepEqual(process.argv.slice(2),[]);
const runtime=H.reconstructRuntime(),h3=H.reconstructH3(),inventory=H.closedEngineInventory();
console.log('B1B2 ENGINE FILES DIFFERENTIAL: '+runtime.length+' runtime files; '+h3+' original H3 hunks; '+inventory.unchanged+' unchanged; '+inventory.added+' new evidence files; '+inventory.total+' full disk/HEAD/source entries');
