'use strict';
// Synthetic fixtures only. Fresh keys per run; no production custody provider.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {randomBytes,webcrypto}=require('node:crypto');
const PROFILE='earned/authority-row/v1',NAMESPACE='synthetic-p1-rigs',EPOCH='run-only';
async function provision(db){
  for(const [name,count] of [['0002_reconciliation.sql',6],['0003_payload_storage.sql',8]]){
    const sql=fs.readFileSync(path.resolve(__dirname,'../w5/migrations',name),'utf8').replace(/--[^\n]*/g,'');
    const parts=sql.match(/CREATE TRIGGER[\s\S]*?^END;|(?:CREATE TABLE|CREATE UNIQUE INDEX|INSERT INTO|DROP TABLE|ALTER TABLE)[\s\S]*?;/gm);
    assert.equal(parts.length,count);await db.batch(parts.map(x=>db.prepare(x)));
  }
  await db.prepare('INSERT INTO authority_storage VALUES(1,?,?,?)').bind(PROFILE,NAMESPACE,EPOCH).run();
}
async function createTestStorage(bytes=randomBytes(32)){
  const key=await webcrypto.subtle.importKey('raw',bytes,'AES-KW',false,['wrapKey','unwrapKey']);
  return {profile:PROFILE,namespace:NAMESPACE,crypto:webcrypto,async getWrappingKey({namespace,epoch,purpose}){
    assert.equal(namespace,NAMESPACE);assert.equal(epoch,EPOCH);assert(['read','write'].includes(purpose));return key;
  }};
}
module.exports={provision,createTestStorage,PROFILE,NAMESPACE,EPOCH};
