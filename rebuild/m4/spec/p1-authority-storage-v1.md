# P1 authority row storage — bounded technical proposal v1.1

ASTRA, 2026-09-08. Proposed, not implemented or independently accepted. This closes one server-storage design decision needed by the existing prescription-capture/recovery work; it does not close capture, P1 as a whole, CLOCK, private provisioning or release. No new product rule, service, model, queue or custody arrangement.

Source pins: R1 `bec056d6b8f86069c500d958e86f212bd6e5f392`; W6 `17fa69f09a19e0b6a72566c9504fddebdd599a0b`; parent delivery brief `5a5eb69a351b3600c0d0e49bbc62d1d77e827d94`. The frozen authority's operation HMAC, signed bytes, synchronous core, accepted history and original migrations remain unchanged.

## 1. Decision and exact coverage

Encrypt **every original `authority_rows.value` byte string**, including metadata, operations, history, log, initial plans and any subsequently accepted capture collection. Preserve the existing table/key identity and add `sealed` JSON and `storage_revision` INTEGER columns. The physical `value` column becomes a deterministic, deliberately minimal SQL-validation projection. Decryption reconstructs the original raw `value` before any existing core, issuer or reconciliation consumer sees it. No application reads the projection as an authority record.

This is needed because `0002_reconciliation.sql` checks JSON fields/counts and indexes issue ordinals. Replacing `value` with one opaque wrapper currently fails `r1_invalid_registry`; dropping the trigger makes that malformed update pass in an in-memory SQLite control. Preserve those original SQL checks; do not suppress them to fit encryption. A second plaintext copy of all six control collections is unnecessary and would expose extensible lease/event contents.

`projection(collection, original)` uses fixed insertion order and `JSON.stringify`, copying only these named properties. Existing semantic validation still applies to the full decrypted original; projection is not a new admission policy.

| Collection | Exact physical `value` projection |
|---|---|
| accountRegistry | `profile, account_epoch, state, history_origin` in that order, original values |
| deviceIssuance | `device_id, creation_epoch, current_lease_id, issue_ordinal`, original values |
| issuedLeases | `lease:{athlete_id,device_id,lease_id}` copied from original lease; `lease_bytes_b64:"P1_SEALED"`; then original `issuer_profile, issue_ordinal, issuance_intent_digest, account_epoch, creation_epoch` |
| issuanceIntents | Original `stable_request_digest, lease_id, result_creation_epoch` |
| enrollmentIntents | Original `stable_request_digest, device_id, lease_id` |
| standingEvents | Original `kind, athlete_id, device_id, account_epoch, creation_epoch`; `evidence:{}` |
| Every other already-supported collection | Exactly `{"p1":"earned/authority-row/v1"}` |

The sentinel is a physical projection field, never a lease encoding handed to the issuer/client. `issuedLeases.lease_bytes_b64`, full signed lease, event evidence and unknown nested content remain only inside the encrypted original. The original SQL checks need the three lease IDs, nonempty text sentinel, event object type and unchanged outer fields; the ordinal index continues using the real ordinal. After decrypting, regenerate this projection and require byte equality with physical `value` before consuming the row. Wrong projections refuse, even when their SQL shape is otherwise legal.

Opaque athlete/device/row identities, account state, lease linkage/ordinals, subject-to-athlete mapping, table membership and approximate row sizes remain observable to a database reader. This is server-managed P1 payload protection, not P2 end-to-end secrecy or metadata anonymity. The Worker can decrypt. No health facts, exact prescription text, plan payload, private receipt text or keys belong in clear projections/logs. Unknown collections remain subject to the existing closed protocol manifest; the default encryption rule does not authorize them.

## 2. Envelope and provider contract

Use native WebCrypto AES-256-GCM with a **fresh generated 256-bit data key for each sealing invocation**, a fresh random 96-bit IV and a 128-bit tag. Wrap that one-use key with AES-256-KW under an epoch-specific server key-encryption key (KEK). Only encrypted data keys are stored. Never accept caller-provided data keys, reuse a data key, cache one for retries, or fall back to wall-time/counters/weak randomness. Cryptographic RNG/key-generation failure refuses the attempt. Freshness is probabilistic cryptographic generation, not a claim of mathematically unique random samples. Do not introduce an unproved persisted nonce counter that an old backup could roll back.

Cloudflare documents native AES-GCM and AES-KW, including wrap/unwrap operations: [Workers Web Crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/). That capability documentation and the Node probe below do not substitute for the pinned Wrangler/actual Worker execution gate.

`sealed` is JSON with exactly these ordered fields: `profile:"earned/authority-row/v1", key_epoch, wrapped_key_b64, iv_b64, ciphertext_b64`. Base64url is unpadded/canonical; wrapped raw 32-byte key is 40 bytes, IV 12, ciphertext includes the 16-byte tag. Reject unknown fields/profile, duplicates, noncanonical encodings, malformed UTF-8/JSON and invalid lengths before crypto. Use existing strict parsing/byte helpers where applicable. Preserve the decrypted original bytes, including JSON property order/escaping; never parse/reserialize them for history DTOs or signatures.

Additional authenticated data is UTF-8 of `JSON.stringify(["earned/authority-row/aad/v1", namespace, athlete, collection, row_id, String(storage_revision), profile, key_epoch, physicalValue])`. Every element is a string; the last is the exact projection JSON string. JSON string escaping makes separators and Unicode unambiguous. Namespace is a pinned logical-storage identity from trusted deployment/recovery configuration, never a request field. Copying an envelope across athletes/rows/collections/namespaces/storage revisions/epochs or changing its projection must fail authentication or the regenerated-projection comparison. `storage_revision` is a positive safe integer physical write stamp, not an operation/schema version or client revision. Each new/changed row gets the captured server global revision plus one, in the SAME guarded batch that advances that global revision. Read validation requires the stamp to be no greater than the captured global revision; overflow refuses before sealing/writing. New storage guards reject a mutable-row UPDATE whose stamp does not strictly increase; original immutable triggers still forbid their updates. This protects a sealed-column-only rollback even when both versions have the constant projection. A coordinated rollback of envelope AND stamp (for example restoring an entire old database) can still authenticate: only the existing independently anchored currentness/recovery/fence checks can establish freshness. This is not a claim to close those checks.

Provider API: `getWrappingKey({namespace, epoch, purpose:"write"|"read"}) -> Promise<CryptoKey>`. Keys are AES-KW/256, nonextractable, usage limited to wrap for writing and unwrap for reading; production bindings may return separately imported handles for those usages. The provider validates namespace/epoch/purpose against I's configured inventory. No default/empty key, automatic replacement, cross-account/request-selected namespace or silent legacy epoch. Local public tests generate ephemeral keys per run; private provisioning/backup uses the existing I/W4/W8 custody channel. Worker signing, operation identity/HMAC, browser body and browser frame keys stay separate and unchanged.

One database control row records pinned `profile, namespace, write_epoch` and is read in the same batch as the global revision and authority rows. The bridge checks it against the trusted deployment profile and provider inventory. New writes use exactly that epoch. The atomic publishing batch first asserts the global revision **and** the captured storage-control values through failing constraints; then writes every projection+sealed pair and existing effects and advances the revision. Rotation changes the write epoch under the same revision guard, after provisioning the new key. Old deployments may read retained epochs but cannot publish with a stale write epoch. Do not compare server revisions with client revisions.

Retain old read keys for every retained row/export. Immutable rows do not need rewriting just to rotate future writes: existing immutable UPDATE/DELETE triggers remain effective. Missing old keys means explicit unavailability, never empty account/automatic reseed. A compromised historical KEK still exposes ciphertext encrypted under it; rotation does not retroactively restore secrecy. Key deletion or mass rewrapping requires a separately verified recovery/retention action, not this change.

## 3. Actual bridge, migration and recovery joins

**Persisted-bytes contract, explicitly re-sourced:** in legacy plaintext mode the source is literal D1 `value`; in selected P1 mode it is the exact authenticated DECRYPTION of `sealed`, before parse/reserialization. The physical SQL projection is never the persisted logical record. Keep the existing `r1-codec.test.cjs:32` equality assertion over logical raw-row inputs unchanged: that test uses a synthetic `f.rows` fixture, not a direct D1 query. Add actual P1-D1 coverage proving noncanonical-but-valid original whitespace/property order/escaping survives encryption, unchanged-row staging, reconcile DTOs and isolated recovery byte-for-byte, while the physical `value` is the different projection. The guard should fail if the implementation returns the projection OR `JSON.stringify(JSON.parse(original))`. Preserve the legacy-mode assertion and all original frozen suites; no golden rewrite or weaker equality is authorized. This makes the property at `bridge.cjs:171,191–195` explicit instead of silently moving its premise.

Both `bridge.cjs` paths must use the codec: ordinary batch/load/serialization at31–40/71–84, and R1 scoped/global reads at125–137, reconciliation fast path at146–162, staging at168–170 and write delta at301–306. Decode every selected physical row before these current consumers, including foreign ownership/dependency inputs; `rawBefore`/project DTOs receive original decrypted raw strings. Compare plaintext candidate values to original plaintext to find deltas; encryption randomness must never make unchanged rows look modified. Seal only changed/new rows, before the existing guarded commit. No result before durable commit; CAS retries reload state and generate fresh data keys. No reused ciphertext from an uncommitted retry is required.

SQL migration adds the sealed column, positive-safe-integer storage stamp, monotonic mutable-stamp guard and storage-control row and fail-closed structural guards for the selected storage profile without changing either original migration's triggers/indexes. Missing seal/profile/control, invalid projection or failed decryption is not legacy plaintext. Existing plaintext test databases may retain an explicit legacy-only deployment configuration; a sealed deployment must never auto-detect/downgrade to it. Old binaries must not be routed to a sealed database.

Existing immutable rows cannot be backfilled with UPDATE under the accepted triggers. For an existing database, use an **isolated copy**: stop admissions/issuance, capture a stable revision/export and its original row bytes, load original migrations plus the new storage schema in the new database, encrypt and INSERT each original row with its projection and initial storage stamp `sourceRevision+1`; set the isolated target global revision to that same value before making it accessible. Refuse safe-integer exhaustion. Prove exact decrypted row/subject/history/commitment/frontier equality; the new physical stamp/global revision are declared storage metadata, not altered operation history. When restoring an already sealed export, preserve its existing stamps and corresponding checkpoint global revision instead of inventing new ones. Keep the source intact. Test retries/interruption/duplicate identity/restore before switching routing. Before routing, require the source revision still matches the frozen checkpoint; otherwise resume/capture a new checkpoint rather than lose intervening writes. Existing client outboxes remain available and replay once after reopening ingress. Rollback after new target writes requires preserving/replaying those later writes, not simply pointing at the older source. This procedure is a required implementation rehearsal, not an executed migration claim or permission to touch private data.

Exports carry the storage profile/namespace/epoch inventory, encrypted rows and independently protected historical KEKs through existing I custody. Isolated restores retain the original logical namespace and signed bytes but use isolated bindings/auth routing; they do not silently remap athlete IDs inside signed history. Prove authenticated usable history and later-write/outbox survival. P1 authenticity does not prove completeness, freshness, nondeletion or an anti-rollback fence; existing R1/currentness, K1 and backup/restore gates continue unchanged.

Stored-row parse/authentication/projection mismatch maps to existing `RETAINED_INTEGRITY` where available; otherwise a typed unavailable response, never a success. Provider missing/unavailable keys produces typed retryable service unavailability without key/row/crypto diagnostic text. The client keeps its entered values/outbox and does not advance a frontier or drain on either failure. If stored truth cannot be established, the existing integrity/recovery path is18; independently known standing loss retains17. A remote503 alone does not invent local sign-out or invalidate an otherwise qualified local store. Exact route mappings must be exercised through the real W6 consumer before acceptance.

This leaves operation-HMAC historical epoch mapping and the exact capture/version/issuer registration as separate existing joins: a storage KEK cannot be used as an identity key. Start payload stays `{}`; one original operation builder, same-generation capture/Start/outbox and signed same-athlete recovery remain required. P1 server codec acceptance alone does not authorize that schema change or whole P1 completion.

## 4. Required acceptance and bounded evidence

Revision v1.1 addresses Opus98 REVISE3ee: R1 explicitly names the re-sourced logical-byte property and original assertion plus real P1 boundary evidence; R2 adds the authenticated physical storage stamp and a sealed-only replay refusal/control. Reviewer independently reproduced18/18 and12/12, and eight own model checks. Its initial all-collection SQL fixture used invalid slot/log row IDs, then corrected them; not a product failure. Original verdict is retained. The sentinel never validated base64 in the original SQL either: actual issuer `issuedLease` validates decoded full lease equality after decryption. Both original0001 slot/log indexes use row_id, so their enforcement needs no payload projection. No product or clinical claim is added.

Implement in the retained R1 boundary after this technical proposal's independent acceptance; preserve ownership, mandatory conformance/selftest/strict and exact source/CI review. Required actual local-D1/HTTP evidence: original SQL guards still effective; the exact persisted-logical-byte equality and effective projection/reserialization bites specified above; sealed-column-only old-version substitution refuses even for a constant projection, while a full old-envelope+stamp restore remains an explicit freshness test; equal decrypted state/disposition/pull/reconciliation bytes; malformed/swap/tamper/missing-key/profile/projection/old-epoch failures; two athletes; all existing law/race/replay/after-commit cuts; storage-epoch change races the commit; exact plaintext migration and isolated encrypted restore; no payload canary in physical database/export/logs; all crypto runs through the pinned Worker implementation. An effective disposable authentication or projection-check bite must go RED, followed by exact restoration and affected GREEN.

Measure physical ciphertext expansion, bind/row/SQL batch limits, memory and latency on the existing R1 resource corpus. Decrypt incrementally and release intermediates where possible; do not silently enlarge the 96MiB resource budget or the existing request262144/reconciliation1048576 transport bounds. Current R1 resource failure remains unresolved. Transport DTOs are reconstructed plaintext under the existing authenticated channel; storage ciphertext is not added to the current reconciliation payload. Prescription-capture transport has its own still-open size/manifest proof.

Executed evidence for this proposal is deliberately smaller: original-SQL in-memory projection probes and native Node WebCrypto below. It does not exercise the real bridge, D1, production provider, phone, storage activation or recovery. No private data or retained key enters either probe. No new physiological/clinical or outcome claim.

### Reproducible native-crypto probe

Extract this single `javascript` fence and execute with Node from an empty scratch directory. Keys exist only in memory. This is a disposable model of the proposed envelope, not a production parser/provider implementation.

```javascript
'use strict';
const assert = require('node:assert/strict');
const {webcrypto: crypto} = require('node:crypto');
const s=crypto.subtle, profile='earned/authority-row/v1';
const b=x=>new TextEncoder().encode(x), enc=x=>Buffer.from(x).toString('base64url');
const dec=x=>Buffer.from(x,'base64url');
const physical='{"p1":"earned/authority-row/v1"}';
const context={namespace:'synthetic-storage',athlete:'synthetic-a',collection:'operations',row_id:'op-a',storage_revision:1,physical};
const aad=(c,e)=>b(JSON.stringify(['earned/authority-row/aad/v1',c.namespace,c.athlete,c.collection,c.row_id,String(c.storage_revision),e.profile,e.key_epoch,c.physical]));
const keys=new Map();
async function key(epoch){keys.set(epoch,await s.generateKey({name:'AES-KW',length:256},false,['wrapKey','unwrapKey']));}
async function seal(raw,c,epoch){
  const dk=await s.generateKey({name:'AES-GCM',length:256},true,['encrypt','decrypt']);
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const e={profile,key_epoch:epoch,wrapped_key_b64:enc(await s.wrapKey('raw',dk,keys.get(epoch),'AES-KW')),iv_b64:enc(iv),ciphertext_b64:''};
  e.ciphertext_b64=enc(await s.encrypt({name:'AES-GCM',iv,additionalData:aad(c,e),tagLength:128},dk,raw));return e;
}
async function open(e,c){
  assert.ok(Number.isSafeInteger(c.storage_revision)&&c.storage_revision>0);
  assert.deepEqual(Object.keys(e),['profile','key_epoch','wrapped_key_b64','iv_b64','ciphertext_b64']);assert.equal(e.profile,profile);
  for(const k of ['wrapped_key_b64','iv_b64','ciphertext_b64'])assert.equal(enc(dec(e[k])),e[k]);
  assert.equal(dec(e.wrapped_key_b64).length,40);assert.equal(dec(e.iv_b64).length,12);assert.ok(dec(e.ciphertext_b64).length>=16);
  const dk=await s.unwrapKey('raw',dec(e.wrapped_key_b64),keys.get(e.key_epoch),'AES-KW',{name:'AES-GCM',length:256},false,['decrypt']);
  return Buffer.from(await s.decrypt({name:'AES-GCM',iv:dec(e.iv_b64),additionalData:aad(c,e),tagLength:128},dk,dec(e.ciphertext_b64)));
}
(async()=>{
  let count=0;const pass=()=>count++;const raw=b('{ "z" : "synthetic 3+ / café", "a": 1 }\n');
  assert.notEqual(Buffer.from(raw).toString(),JSON.stringify(JSON.parse(Buffer.from(raw).toString())));
  await key('old');const e=await seal(raw,context,'old');assert.deepEqual(await open(e,context),Buffer.from(raw));pass();
  const twice=await seal(raw,context,'old');assert.notEqual(e.wrapped_key_b64,twice.wrapped_key_b64);assert.deepEqual(await open(twice,context),Buffer.from(raw));pass();
  for(const field of ['namespace','athlete','collection','row_id','physical']){await assert.rejects(open(e,{...context,[field]:context[field]+'-changed'}));pass();}
  for(const field of ['wrapped_key_b64','iv_b64','ciphertext_b64']){const x=dec(e[field]);x[0]^=1;await assert.rejects(open({...e,[field]:enc(x)},context));pass();}
  await assert.rejects(open({...e,profile:'wrong'},context));pass();
  await assert.rejects(open({...e,extra:true},context));pass();
  await assert.rejects(open({...e,iv_b64:e.iv_b64+'='},context));pass();
  await key('new');await assert.rejects(open({...e,key_epoch:'new'},context));pass();
  const newest=await seal(raw,context,'new');assert.deepEqual(await open(newest,context),Buffer.from(raw));assert.deepEqual(await open(e,context),Buffer.from(raw));pass();
  const old=keys.get('old');keys.delete('old');await assert.rejects(open(e,context));keys.set('old',old);assert.deepEqual(await open(e,context),Buffer.from(raw));pass();
  // Independent wrong-provider key must fail; restoration must recover exact bytes.
  await key('old');await assert.rejects(open(e,context));keys.set('old',old);assert.deepEqual(await open(e,context),Buffer.from(raw));pass();
  // Constant projection, same identity, newer stored version: old seal alone refuses.
  const c2={...context,storage_revision:2},raw2=b('{\"z\":\"synthetic changed\",\"a\":2}'),e2=await seal(raw2,c2,'new');
  assert.deepEqual(await open(e2,c2),Buffer.from(raw2));await assert.rejects(open(e,c2));pass();
  // Explicit residual: coordinated envelope+stamp restore authenticates the old bytes.
  assert.deepEqual(await open(e,context),Buffer.from(raw));pass();
  // Removal of context binding is an effective disposable model bite.
  const dk=await s.generateKey({name:'AES-GCM',length:256},true,['encrypt','decrypt']);const iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=await s.encrypt({name:'AES-GCM',iv},dk,raw);
  const mutantOpen=async _ignoredContext=>Buffer.from(await s.decrypt({name:'AES-GCM',iv},dk,ct));
  let caught=false;try{await assert.rejects(mutantOpen({...context,athlete:'synthetic-b'}));}catch(_){caught=true;}assert.equal(caught,true);pass();
  console.log(`P1 NATIVE CRYPTO PROBE PASS ${count}/20; context-omission model mutant DETECTED; no D1/bridge/provider/phone claim`);
})().catch(()=>{console.error('P1 NATIVE CRYPTO PROBE FAIL');process.exitCode=1;});
```

### Reproducible original-SQL projection probe

Run this `python` fence with the retained R1 source root as its sole argument. It reads only the two tracked SQL migrations; the database is in memory. The sealed-column/migration/crypto integration is deliberately not simulated here.

```python
import sqlite3, json, pathlib, sys
root=pathlib.Path(sys.argv[1]); db=sqlite3.connect(':memory:')
for name in ('0001_authority.sql','0002_reconciliation.sql'):
    db.executescript((root/'rebuild/m3/w5/migrations'/name).read_text(encoding='utf-8'))
def j(v): return json.dumps(v,separators=(',',':'))
a='synthetic-a'; d='synthetic-device'; lease='synthetic-lease'
values={
 'accountRegistry':('state',dict(profile='earned/r1/v1',account_epoch=1,state='ACTIVE',history_origin='PROFILE_GENESIS')),
 'deviceIssuance':(d,dict(device_id=d,creation_epoch=1,current_lease_id=lease,issue_ordinal=1)),
 'issuedLeases':(j([d,lease]),dict(lease=dict(athlete_id=a,device_id=d,lease_id=lease),lease_bytes_b64='P1_SEALED',issuer_profile='earned/r1/v1',issue_ordinal=1,issuance_intent_digest='synthetic-digest',account_epoch=1,creation_epoch=1)),
 'issuanceIntents':(j([d,'intent-a']),dict(stable_request_digest='synthetic-digest',lease_id=lease,result_creation_epoch=1)),
 'enrollmentIntents':('intent-b',dict(stable_request_digest='synthetic-digest',device_id=d,lease_id=lease)),
 'standingEvents':('event-a',dict(kind='DEVICE_ENROLLED',athlete_id=a,device_id=d,account_epoch=1,creation_epoch=1,evidence={}))
}
insert='INSERT INTO authority_rows(athlete,collection,row_id,value) VALUES(?,?,?,?)'
count=0
for c,(rid,v) in values.items():
    db.execute(insert,(a,c,rid,j(v))); count+=1
baseline=db.execute('SELECT * FROM authority_rows ORDER BY collection').fetchall()
def rejects(sql,args):
    global count
    try: db.execute(sql,args)
    except sqlite3.IntegrityError: count+=1
    else: raise AssertionError('SQL guard was ineffective')
    assert db.execute('SELECT * FROM authority_rows ORDER BY collection').fetchall()==baseline
bad=dict(values['accountRegistry'][1],state='INVALID')
rejects('UPDATE authority_rows SET value=? WHERE collection=?',(j(bad),'accountRegistry'))
bad=dict(values['deviceIssuance'][1],creation_epoch=2)
rejects('UPDATE authority_rows SET value=? WHERE collection=?',(j(bad),'deviceIssuance'))
rejects('UPDATE authority_rows SET value=value WHERE collection=?',('issuedLeases',))
rejects('DELETE FROM authority_rows WHERE collection=?',('standingEvents',))
bad=dict(values['issuedLeases'][1]);bad['lease']=dict(bad['lease'],athlete_id='synthetic-b',lease_id='foreign')
rejects(insert,(a,'issuedLeases',j([d,'foreign']),j(bad)))
bad=dict(values['issuedLeases'][1]);bad['lease']=dict(bad['lease'],lease_id='duplicate-ordinal')
rejects(insert,(a,'issuedLeases',j([d,'duplicate-ordinal']),j(bad)))
assert count==12
print('P1 SQL PROJECTION PROBE PASS 12/12; original guards/index intact; in-memory SQLite only')
```
