'use strict';
// Selected physical storage boundary; the synchronous authority and its raw
// logical record interface do not see projections, ciphertext or write stamps.
const C = require('../reconciliation/codec.cjs');
const PROFILE = 'earned/authority-row/v1';
const ROW_COLUMNS = 'athlete, collection, row_id, value, sealed, storage_revision';
const fail = () => C.fail('RETAINED_INTEGRITY',500);

function createDatabaseStorage(db, config) {
  if (!config || config.profile !== PROFILE || typeof config.namespace !== 'string' || !config.namespace ||
      typeof config.getWrappingKey !== 'function') throw new TypeError('Explicit P1 storage configuration required');
  const namespace = config.namespace;
  const { createAuthorityRowCodec } = require('./row-codec.cjs');
  const codec = createAuthorityRowCodec({namespace,getWrappingKey:config.getWrappingKey,crypto:config.crypto ?? globalThis.crypto});
  const controlStatement = () => db.prepare('SELECT profile, namespace, write_epoch FROM authority_storage WHERE id = 1');

  async function load(controlResult, rows, revision) {
    if (!C.safe(revision)) fail();
    if (revision === Number.MAX_SAFE_INTEGER) C.fail('UNAVAILABLE',503);
    if (!controlResult || !Array.isArray(controlResult.results) || controlResult.results.length !== 1 || !Array.isArray(rows)) fail();
    const row = controlResult.results[0];
    C.exact(row,['profile','namespace','write_epoch'],{code:'RETAINED_INTEGRITY'});
    if (row.profile !== PROFILE || row.namespace !== namespace || typeof row.write_epoch !== 'string' || !row.write_epoch) fail();
    const control = Object.freeze({profile:PROFILE,namespace,write_epoch:row.write_epoch});
    // Replace each owned D1-result slot as it is decoded. Do not retain a second
    // complete plaintext/ciphertext result array during an account reconciliation.
    for (let i=0;i<rows.length;i++) rows[i] = await codec.open(rows[i],{revision});
    return control;
  }

  function guard(revision, control) {
    // A missing/replaced storage-control row fails the SAME CHECK assertion;
    // an UPDATE of the control row itself could otherwise silently affect zero.
    return db.prepare('UPDATE authority_revision SET revision = CASE WHEN revision = ? AND EXISTS (SELECT 1 FROM authority_storage WHERE id = 1 AND profile = ? AND namespace = ? AND write_epoch = ?) THEN revision ELSE -1 END WHERE id = 1')
      .bind(revision,control.profile,control.namespace,control.write_epoch);
  }

  async function write(rawRow, revision, control) {
    const row = await codec.seal(rawRow,{revision,writeEpoch:control.write_epoch});
    return db.prepare('INSERT INTO authority_rows (athlete, collection, row_id, value, sealed, storage_revision) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (athlete, collection, row_id) DO UPDATE SET value = excluded.value, sealed = excluded.sealed, storage_revision = excluded.storage_revision')
      .bind(row.athlete,row.collection,row.row_id,row.value,row.sealed,row.storage_revision);
  }

  return Object.freeze({rowColumns:ROW_COLUMNS,controlStatement,load,guard,write});
}
module.exports = { createDatabaseStorage,PROFILE,ROW_COLUMNS };
