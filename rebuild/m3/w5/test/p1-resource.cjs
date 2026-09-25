'use strict';
// Same original R1 workload, assertions, meter and ceilings; only the explicitly
// selected storage runtime and fixture's raw-byte access differ. No paid service.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const assert=require('node:assert/strict');
const {createR1Runtime}=require('./r1-workerd.cjs');
const {populate}=require('./r1-resource-fixture.cjs');
const {createDatabaseStorage}=require('../storage/database.cjs');
async function main(){
  const output=fs.mkdtempSync(path.join(os.tmpdir(),'earned-p1-resource-'));
  const evidenceFile=path.join(output,'original-meter.json');
  let runtime,storage;const physical=[];
  async function runtimeFactory(){runtime=await createR1Runtime({p1:true});storage=createDatabaseStorage(runtime.db,runtime.storage);return runtime;}
  async function readLogicalRows(db){
    const loaded=await db.batch([db.prepare('SELECT revision FROM authority_revision WHERE id=1'),
      db.prepare('SELECT '+storage.rowColumns+' FROM authority_rows ORDER BY athlete,collection,row_id'),storage.controlStatement()]);
    const revision=loaded[0].results[0].revision;
    const rows=loaded[1].results;
    const stat={rows:rows.length,physicalBytes:0,logicalBytes:0,maxPhysicalRowBytes:0,maxSealedBytes:0};
    for(const r of rows){const n=Buffer.byteLength(JSON.stringify(r));stat.physicalBytes+=n;stat.maxPhysicalRowBytes=Math.max(stat.maxPhysicalRowBytes,n);stat.maxSealedBytes=Math.max(stat.maxSealedBytes,Buffer.byteLength(r.sealed));}
    await storage.load(loaded[2],rows,revision);
    for(const r of rows)stat.logicalBytes+=Buffer.byteLength(r.value);
    physical.push(stat);return rows;
  }
  async function writeLogicalRow(row,revision){
    const controlResult=await runtime.db.batch([storage.controlStatement()]);
    const control=await storage.load(controlResult[0],[],revision);
    await runtime.db.batch([storage.guard(revision,control),await storage.write(row,revision,control),
      runtime.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1')]);
  }
  const result=await require('./r1-resource.test.cjs').run({runtimeFactory,
    populateFixture:options=>populate({...options,readLogicalRows,writeLogicalRow}),outputFile:evidenceFile});
  assert.equal(result.ceilings.observedAllocationBytes,96*1024*1024);
  fs.writeFileSync(path.join(output,'p1-physical-expansion.json'),JSON.stringify({profile:'earned/authority-row/v1',measurements:physical,
    note:'Synthetic JSON bytes excluding SQL pages/index overhead; generated key material omitted. Existing resource metric/ceilings unchanged.'},null,2)+'\n');
  console.log(`P1 RESOURCE ${result.verdict} — ${result.completedPages} actual pages; ${result.violations.length} violations; original96MiB meter unchanged`);
  if(result.failure)console.log('P1 RESOURCE FAILURE '+result.failure.phase+': '+result.failure.message);
  console.log('P1 RESOURCE evidence '+output);
  process.exitCode=result.verdict==='PASS'?0:result.verdict==='BLOCKED'?2:1;
}
module.exports={main};
if(require.main===module)main().catch(e=>{console.error('P1 RESOURCE FAIL',e);process.exitCode=1;});
