'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {createLocalD1}=require('../local-d1.cjs');
const profile='earned/authority-row/v1';
// Structural SQL fixtures only. These placeholders deliberately are NOT
// authenticated ciphertext and must never pass the product row decoder.
const seal=()=>JSON.stringify({profile,key_epoch:'synthetic',wrapped_key_b64:'A'.repeat(54),iv_b64:'A'.repeat(16),ciphertext_b64:'A'.repeat(22)});
const marker=JSON.stringify({p1:profile});
const insert='INSERT INTO authority_rows (athlete,collection,row_id,value,sealed,storage_revision) VALUES (?,?,?,?,?,?)';
function migration(db,name,count){
  const sql=fs.readFileSync(path.join(__dirname,'../migrations',name),'utf8').replace(/--[^\n]*/g,'');
  // Only these pinned migration constructs are supported, not arbitrary SQL.
  const statements=sql.match(/CREATE TRIGGER[\s\S]*?^END;|(?:CREATE TABLE|CREATE UNIQUE INDEX|INSERT INTO|DROP TABLE|ALTER TABLE)[\s\S]*?;/gm);
  assert.equal(statements.length,count);
  return db.batch(statements.map(s=>db.prepare(s)));
}
async function fixture(t){const r=await createLocalD1();t.after(()=>r.close());await migration(r.db,'0002_reconciliation.sql',6);return r;}

test('P1 selected migration refuses nonempty source atomically on actual local D1',async t=>{
  const {db}=await fixture(t),original='{ "synthetic" : true }';
  await db.prepare('INSERT INTO authority_rows VALUES (?,?,?,?)').bind('athlete-a','operations','op-a',original).run();
  await assert.rejects(migration(db,'0003_payload_storage.sql',8));
  assert.equal((await db.prepare('SELECT value FROM authority_rows').first()).value,original);
  assert.deepEqual((await db.prepare('PRAGMA table_info(authority_rows)').all()).results.map(r=>r.name),['athlete','collection','row_id','value']);
  assert.equal(await db.prepare("SELECT name FROM sqlite_master WHERE name = 'p1_install_empty_guard'").first(),null);
});

test('P1 actual D1 structural guards preserve original constraints and safe monotonic stamps',async t=>{
  const {db}=await fixture(t);await migration(db,'0003_payload_storage.sql',8);
  await db.prepare('INSERT INTO authority_storage (id,profile,namespace,write_epoch) VALUES (1,?,?,?)').bind(profile,'synthetic-storage','synthetic').run();
  const before=await db.prepare("SELECT name FROM sqlite_master WHERE type = 'trigger' AND name LIKE 'r1_%' ORDER BY name").all();
  assert.equal(before.results.length,5); // Original five triggers and separate ordinal index.
  const add=(collection,id,value=marker,stamp=1,sealed=seal())=>db.prepare(insert).bind('athlete-a',collection,id,value,sealed,stamp).run();
  await assert.rejects(db.prepare('INSERT INTO authority_rows (athlete,collection,row_id,value) VALUES (?,?,?,?)').bind('athlete-a','operations','plain',marker).run());
  for(const stamp of [0,-1,1.5,Number.MAX_SAFE_INTEGER+1,null])await assert.rejects(add('operations','bad-stamp',marker,stamp));
  await assert.rejects(add('operations','bad-seal',marker,1,'{}'));
  await add('operations','op-a');
  const original=await db.prepare("SELECT * FROM authority_rows WHERE row_id='op-a'").first();
  for(const stamp of [0,1])await assert.rejects(db.prepare("UPDATE authority_rows SET storage_revision=? WHERE row_id='op-a'").bind(stamp).run());
  assert.deepEqual(await db.prepare("SELECT * FROM authority_rows WHERE row_id='op-a'").first(),original);
  await db.prepare("UPDATE authority_rows SET storage_revision=2 WHERE row_id='op-a'").run();
  assert.equal((await db.prepare("SELECT storage_revision FROM authority_rows WHERE row_id='op-a'").first()).storage_revision,2);
  await assert.rejects(db.prepare("UPDATE authority_rows SET row_id='moved',storage_revision=3 WHERE row_id='op-a'").run());
  const registry={profile:'earned/r1/v1',account_epoch:1,state:'ACTIVE',history_origin:'PROFILE_GENESIS'};
  await add('accountRegistry','state',JSON.stringify(registry));
  await assert.rejects(db.prepare("UPDATE authority_rows SET value=?,storage_revision=2 WHERE collection='accountRegistry'").bind(JSON.stringify({...registry,state:'INVALID'})).run());
  const issued={lease:{athlete_id:'athlete-a',device_id:'device-a',lease_id:'lease-a'},lease_bytes_b64:'P1_SEALED',issuer_profile:'earned/r1/v1',issue_ordinal:1,issuance_intent_digest:'synthetic',account_epoch:1,creation_epoch:1};
  await add('issuedLeases',JSON.stringify(['device-a','lease-a']),JSON.stringify(issued));
  await assert.rejects(db.prepare("UPDATE authority_rows SET storage_revision=2 WHERE collection='issuedLeases'").run(),/r1_immutable_row/);
  await assert.rejects(db.prepare("DELETE FROM authority_rows WHERE collection='issuedLeases'").run(),/r1_immutable_row/);
  await assert.rejects(add('issuedLeases',JSON.stringify(['device-a','lease-b']),JSON.stringify({...issued,lease:{...issued.lease,lease_id:'lease-b'}})));
  // Explicit known residual: DELETE+INSERT of a mutable old envelope AND stamp
  // bypasses an UPDATE-only guard. This is not a cryptographic freshness fence.
  await db.prepare("DELETE FROM authority_rows WHERE collection='operations' AND row_id='op-a'").run();
  await add('operations','op-a',original.value,original.storage_revision,original.sealed);
  assert.deepEqual(await db.prepare("SELECT * FROM authority_rows WHERE row_id='op-a'").first(),original);
});
