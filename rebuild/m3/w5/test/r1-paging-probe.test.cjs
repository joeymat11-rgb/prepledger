'use strict';
// Architecture probe only: actual pinned D1 and P1 rows, no production route,
// signed continuation, complete-profile validation or resource PASS claim.
const {test}=require('node:test'),assert=require('node:assert/strict');
const {createR1Runtime}=require('./r1-workerd.cjs');
const {createDatabaseStorage}=require('../storage/database.cjs');
const compare=(a,b)=>Buffer.compare(Buffer.from(a.collection),Buffer.from(b.collection))||Buffer.compare(Buffer.from(a.row_id),Buffer.from(b.row_id));
const key=row=>JSON.stringify([row.collection,row.row_id]);
// Window calculation touches at most 32 key/length tuples; only its bounded
// prefix crosses the Worker binding. A single oversize first row makes progress.
const pageSQL=`WITH candidates AS (
 SELECT athlete,collection,row_id,
   length(CAST(athlete AS BLOB))+length(CAST(collection AS BLOB))+length(CAST(row_id AS BLOB))+
   length(CAST(value AS BLOB))+length(CAST(sealed AS BLOB))+8 AS stored_bytes
 FROM authority_rows
 WHERE athlete=(SELECT athlete FROM authority_subjects WHERE subject=?)
   AND (? IS NULL OR collection COLLATE BINARY > ? COLLATE BINARY
     OR (collection=? AND row_id COLLATE BINARY > ? COLLATE BINARY))
 ORDER BY collection COLLATE BINARY,row_id COLLATE BINARY LIMIT 32
), budgeted AS (
 SELECT *,SUM(stored_bytes) OVER (ORDER BY collection COLLATE BINARY,row_id COLLATE BINARY ROWS UNBOUNDED PRECEDING) AS running_bytes,
 ROW_NUMBER() OVER (ORDER BY collection COLLATE BINARY,row_id COLLATE BINARY) AS position
 FROM candidates
)
SELECT r.athlete,r.collection,r.row_id,r.value,r.sealed,r.storage_revision,b.stored_bytes
FROM budgeted b JOIN authority_rows r USING(athlete,collection,row_id)
WHERE b.running_bytes<=? OR b.position=1
ORDER BY r.collection COLLATE BINARY,r.row_id COLLATE BINARY`;

test('R1 PAGING PROBE — actual D1 bounded P1 row reads and revision cuts',async t=>{
 const runtime=await createR1Runtime({p1:true});t.after(()=>runtime.close());
 const {db}=runtime,storage=createDatabaseStorage(db,runtime.storage);
 await runtime.bridge.initializeR1({first:{plan:{},devices:{}},second:{plan:{},devices:{}}},{'subject-first':'first','subject-second':'second'});
 const raw=[];
 for(let i=0;i<10;i++)raw.push({athlete:'first',collection:'history',row_id:JSON.stringify(['paging-synthetic',String(i)]),
   value:' {"synthetic":"'+('x'.repeat(140000))+'","text":"e\u0301","ordinal":'+i+'.00} '});
 raw.push({athlete:'first',collection:'history',row_id:'\uE000',value:' {"synthetic":"BMP"} '},
  {athlete:'first',collection:'history',row_id:'\u{10000}',value:' {"synthetic":"astral"} '});
 raw.push({athlete:'first',collection:'history',row_id:'control-'+('\u0000'.repeat(1024)),value:' {"synthetic":"control-key"} '});
 for(let i=0;i<40;i++)raw.push({athlete:'first',collection:'history',row_id:'small-'+String(i).padStart(3,'0'),value:' {"synthetic":true} '});
 const seed=await db.batch([db.prepare('SELECT revision FROM authority_revision WHERE id=1'),storage.controlStatement()]);
 const seedRevision=seed[0].results[0].revision,control=await storage.load(seed[1],[],seedRevision);
 const writes=[];for(const row of raw)writes.push(await storage.write(row,seedRevision,control));
 await db.batch([storage.guard(seedRevision,control),...writes,db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1')]);
 const expectedAthlete='first';
 async function page(subject,{after=null,revision=null,budget=262144}={},cut=()=>{}){
   const loaded=await db.batch([db.prepare('SELECT revision FROM authority_revision WHERE id=1'),
    db.prepare('SELECT athlete FROM authority_subjects WHERE subject=?').bind(subject),
    db.prepare(pageSQL).bind(subject,after?.collection??null,after?.collection??null,after?.collection??null,after?.row_id??null,budget),storage.controlStatement()]);
   if(loaded[1].results.length!==1||loaded[1].results[0].athlete!==expectedAthlete)throw Error('SCOPE_FORBIDDEN');
   const current=loaded[0].results[0].revision;if(revision!==null&&current!==revision)throw Error('SNAPSHOT_CHANGED');
   const selected=loaded[2].results,physicalBytes=selected.reduce((n,r)=>n+r.stored_bytes,0);
   assert.equal(physicalBytes,selected.reduce((sum,row)=>sum+['athlete','collection','row_id','value','sealed'].reduce((n,k)=>n+Buffer.byteLength(row[k]),0)+8,0),'Budget includes identity columns and revision, not only payload/seal');
   const rows=selected.map(({stored_bytes,...row})=>row),readControl=await storage.load(loaded[3],rows,current);
   await cut();await db.batch([storage.guard(current,readControl)]); // No read-induced revision increment.
   return {revision:current,rows,physicalBytes};
 }
 let originalRevision,assembled=[];
 await t.test('complete >1MiB synthetic raw inventory arrives exactly once; binary cursor and bytes preserved',async()=>{
   let after=null,sawFullRowPage=false;for(let attempt=0;attempt<40;attempt++){
     const result=await page('subject-first',{after,revision:originalRevision??null});originalRevision??=result.revision;
   assert(result.rows.length<=32);assert(result.physicalBytes<=262144||result.rows.length===1);
     if(result.rows.length===32)sawFullRowPage=true;
     if(!result.rows.length)break;
     for(const row of result.rows){assert(!after||compare(after,row)<0);assembled.push(row);after=row;}
   }
   const wanted=(await db.prepare('SELECT athlete,collection,row_id,value,sealed,storage_revision FROM authority_rows WHERE athlete=? ORDER BY collection COLLATE BINARY,row_id COLLATE BINARY').bind('first').all()).results;
   const c=await db.batch([storage.controlStatement()]);await storage.load(c[0],wanted,originalRevision);
   assert.deepEqual(assembled,wanted);assert.equal(new Set(assembled.map(key)).size,assembled.length);
   assert.equal(sawFullRowPage,true,'The row-count boundary was exercised');
   for(const row of raw)assert.equal(assembled.find(r=>key(r)===key(row)).value,row.value);
   assert(raw.reduce((n,r)=>n+Buffer.byteLength(r.value),0)>1048576);
   assert(assembled.findIndex(r=>r.row_id==='\uE000')<assembled.findIndex(r=>r.row_id==='\u{10000}'));
   assert.equal((await db.prepare('SELECT revision FROM authority_revision WHERE id=1').first()).revision,originalRevision);
 });
 await t.test('oversize first row advances instead of truncating or stalling',async()=>{
   const result=await page('subject-first',{after:{collection:'enrollmentIntents',row_id:''},revision:originalRevision,budget:128});
   assert.equal(result.rows.length,1);assert(result.physicalBytes>128);assert.equal(result.rows[0].value,raw[0].value);
 });
 await t.test('missing or foreign principal mapping cannot return another athlete history',async()=>{
   await assert.rejects(page('absent'),/SCOPE_FORBIDDEN/);await assert.rejects(page('subject-second'),/SCOPE_FORBIDDEN/);
 });
 await t.test('replayed cursor returns original bytes without writes',async()=>{
   const request={after:assembled[2],revision:originalRevision};assert.deepEqual(await page('subject-first',request),await page('subject-first',request));
   assert.equal((await db.prepare('SELECT revision FROM authority_revision WHERE id=1').first()).revision,originalRevision);
 });
 await t.test('write after consistent read fails the original guard; later page refuses old revision',async()=>{
   await assert.rejects(page('subject-first',{revision:originalRevision},()=>db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1').run()),/stale_revision/);
   await assert.rejects(page('subject-first',{revision:originalRevision}),/SNAPSHOT_CHANGED/);
 });
 await t.test('storage control replacement after read fails the same guard',async()=>{
   await assert.rejects(page('subject-first',{},()=>db.prepare("UPDATE authority_storage SET write_epoch='synthetic-replaced' WHERE id=1").run()),/stale_revision/);
 });
 console.log('R1 PAGING PROBE PASS — 6 actual D1/P1 cases; bounded row selection and exact raw inventory; NOT transport, profile or resource acceptance');
});
