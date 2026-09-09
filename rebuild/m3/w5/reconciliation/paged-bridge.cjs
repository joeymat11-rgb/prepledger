'use strict';
// Complete scoped inventory AT a checked database cut; not profile validation,
// local activation, recovered credentials or current offline-write permission.
const {randomBytes}=require('node:crypto');
const {rowKey}=require('../../../authority/store.cjs');
const C=require('./codec.cjs'),P=require('./paged-codec.cjs'),I=require('./issuer.cjs');
const Sign=require('../crypto.cjs');
const {createDatabaseStorage}=require('../storage/database.cjs');
const columns='r.athlete,r.collection,r.row_id,r.value,r.sealed,r.storage_revision';
const own='(SELECT athlete FROM authority_subjects WHERE subject=?)';
const pageSQL=`WITH candidates AS (
 SELECT athlete,collection,row_id,length(CAST(athlete AS BLOB))+length(CAST(collection AS BLOB))+length(CAST(row_id AS BLOB))+
 length(CAST(value AS BLOB))+length(CAST(sealed AS BLOB))+8 AS stored_bytes
 FROM authority_rows WHERE athlete=${own} AND (? IS NULL OR collection COLLATE BINARY > ? COLLATE BINARY
 OR (collection=? AND row_id COLLATE BINARY > ? COLLATE BINARY))
 ORDER BY collection COLLATE BINARY,row_id COLLATE BINARY LIMIT 32
), budgeted AS (
 SELECT *,SUM(stored_bytes) OVER (ORDER BY collection COLLATE BINARY,row_id COLLATE BINARY ROWS UNBOUNDED PRECEDING) AS running_bytes,
 ROW_NUMBER() OVER (ORDER BY collection COLLATE BINARY,row_id COLLATE BINARY) AS position FROM candidates
) SELECT ${columns},b.stored_bytes FROM budgeted b JOIN authority_rows r USING(athlete,collection,row_id)
 WHERE b.running_bytes<=262144 OR b.position=1 ORDER BY r.collection COLLATE BINARY,r.row_id COLLATE BINARY`;
// Five indexed records. The projected issuer pointer chooses the lease row;
// BOTH pointer and selected lease are subsequently authenticated by P1 + I.device.
const standingSQL=`SELECT ${columns} FROM authority_rows r WHERE athlete=${own} AND (
 (collection IN ('metadata','accountRegistry') AND row_id='state') OR
 (collection IN ('deviceIssuance','revocations') AND row_id=?) OR
 (collection='issuedLeases' AND row_id=json_array(?,(SELECT json_extract(value,'$.current_lease_id')
 FROM authority_rows WHERE athlete=${own} AND collection='deviceIssuance' AND row_id=?))))`;
const names=P.COLLECTIONS.map(c=>"'"+c+"'").join(','); // Static source enums, never caller text.
const countsSQL=`SELECT CASE WHEN collection IN (${names}) THEN collection ELSE 'UNSUPPORTED' END AS collection,COUNT(*) AS n
 FROM authority_rows WHERE athlete=${own} GROUP BY 1`;
const metaSQL=`SELECT v.revision,s.athlete,c.profile,c.namespace,c.write_epoch FROM authority_revision v
 LEFT JOIN authority_subjects s ON s.subject=? LEFT JOIN authority_storage c ON c.id=1 WHERE v.id=1`;
const fail=(code,status=400,retryable=false)=>{throw new C.R1Error(code,status,retryable);};
function createPagedBridge({db,storage:config,authorityKey,r1}={}){
 if(!db||!config||!authorityKey||!r1)throw TypeError('P1 database, signing key and pinned auth context required');
 const storage=createDatabaseStorage(db,config);
 const sign=record=>({...record,authority_signature:Sign.signatureOver(record,authorityKey,record.profile)});
 return Object.freeze({async read(subject,raw,context){
  const request=P.decodeRequest(raw),actor=request.device_id;
  if(!C.nonempty(subject)||!context||context.issuer!==r1.issuer||!(r1.origins||[r1.origin]).includes(context.origin))fail('SCOPE_FORBIDDEN',403);
  const continued=request.profile===P.DOMAINS.continue,m=continued?request.manifest:null,previous=continued?request.cursor:null;
  // No unverified cursor may influence the SQL selection.
  if(continued&&(!Sign.verifyRecord(m,authorityKey,P.DOMAINS.manifest)||!Sign.verifyRecord(previous,authorityKey,P.DOMAINS.cursor)))fail('ROWS_SIGNATURE');
  const last=previous?.last_key,key=last?C.text(C.decode64(last.row_id_b64,P.LIMITS.row)):null;
  let loaded;
  try{loaded=await db.batch([db.prepare(metaSQL).bind(subject),db.prepare(standingSQL).bind(subject,actor,actor,subject,actor),
   db.prepare(countsSQL).bind(subject),db.prepare(pageSQL).bind(subject,last?.collection??null,last?.collection??null,last?.collection??null,key)]);}
  catch(_){fail('UNAVAILABLE',503,true);}
  if(loaded[0].results.length!==1)fail('RETAINED_INTEGRITY',500);
  const meta=loaded[0].results[0],revision=meta.revision;
  if(!C.nonempty(meta.athlete))fail('SCOPE_FORBIDDEN',403);
  const controlResult={results:[{profile:meta.profile,namespace:meta.namespace,write_epoch:meta.write_epoch}]};
  const standingRows=loaded[1].results,selected=loaded[3].results;
  if(standingRows.length>5||selected.length>P.LIMITS.rows)fail('RETAINED_INTEGRITY',500);
  const countMap=new Map();
  for(const row of loaded[2].results){if(!P.COLLECTIONS.includes(row.collection)||!C.safe(row.n)||countMap.has(row.collection))fail('RETAINED_INTEGRITY',500);countMap.set(row.collection,row.n);}
  const collectionCounts=P.COLLECTIONS.map(c=>[c,countMap.get(c)||0]);
  const physical=selected.reduce((sum,row)=>{
   const n=['athlete','collection','row_id','value','sealed'].reduce((n,k)=>n+C.bytes(row[k]).length,8);
   if(n!==row.stored_bytes||n>P.LIMITS.row||row.athlete!==meta.athlete||!P.COLLECTIONS.includes(row.collection))fail('RETAINED_INTEGRITY',500);
   delete row.stored_bytes;return sum+n;
  },0);
  if(selected.length>1&&physical>P.LIMITS.budget)fail('RETAINED_INTEGRITY',500);
  const control=await storage.load(controlResult,standingRows,revision);
  await storage.load(controlResult,selected,revision);
  const standing=new Map(standingRows.map(row=>[rowKey(row.athlete,row.collection,row.row_id),C.parse(C.bytes(row.value))]));
  I.device({get:key=>standing.get(key)},meta.athlete,actor,authorityKey);
  const scope=C.scopeDigest({issuer:context.issuer,origin:context.origin,subject,athleteId:meta.athlete,actorDeviceId:actor});
  const fingerprint=P.hash('storage-control',control);
  if(continued){
   if(m.scope_digest!==scope)fail('SCOPE_FORBIDDEN',403);
   if(m.revision!==revision||m.storage_control_digest!==fingerprint||!C.fullEqual(m.collection_counts,collectionCounts))fail('SNAPSHOT_CHANGED',409,true);
  }
  // Exactly the existing failing constraint, then an in-batch presence check:
  // a deleted revision row must not turn the UPDATE's zero effects into success.
  let cut;try{cut=await db.batch([storage.guard(revision,control),db.prepare('SELECT revision FROM authority_revision WHERE id=1')]);}
  catch(error){if(String(error.message).includes('stale_revision'))fail('SNAPSHOT_CHANGED',409,true);fail('UNAVAILABLE',503,true);}
  if(cut[1].results.length!==1||cut[1].results[0].revision!==revision)fail('RETAINED_INTEGRITY',500);
  // No signed successful page exists before the checked cut. This read does
  // not increment the revision and has no domain writes or retained cache.
  const manifest=m||sign(P.makeManifest({keyEpoch:Sign.activeKeyId(authorityKey),scopeDigest:scope,request:request.request,
   basisDigest:request.basis_digest,revision,storageControlDigest:fingerprint,snapshotId:randomBytes(32).toString('base64url'),
   collectionCounts,chainSeed:randomBytes(32).toString('base64url')}));
  const page=P.makePage({manifest,previousCursor:previous,rawRows:selected,sign});
  const result={manifest,page,...(!selected.length?{finish:P.makeFinish({manifest,page,sign})}:{})};
  return P.parseResponse(C.encode(result));
 }});
}
module.exports={createPagedBridge};
