"use strict";
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { generateSigningKey, signLease, verifyDisposition, publicKeyOf } = require("../w5/crypto.cjs");
const O = require("../../conform/lib/ops.cjs");
const NOW = "2026-09-03T00:00:00Z";

async function databaseDigest(db) {
  const tables = (await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' ORDER BY name").all()).results;
  const values = [];
  for (const table of tables) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(table.name)) throw new Error("Unexpected synthetic schema identifier");
    const rows = (await db.prepare('SELECT * FROM "' + table.name + '"').all()).results;
    values.push([table.name, rows.map(row => JSON.stringify(row)).sort()]);
  }
  return createHash("sha256").update(JSON.stringify(values)).digest("hex");
}

async function run(options = {}) {
  const { createLocalD1 } = require("../w5/local-d1.cjs");
  const { createBridge } = require("../w5/bridge.cjs");
  const authorityKey = generateSigningKey("race-d1-run"), verificationKey = publicKeyOf(authorityKey);
  const p1Bytes=options.p1 ? require('node:crypto').randomBytes(32) : null;
  const storage=p1Bytes ? await require('./p1-test-profile.cjs').createTestStorage(p1Bytes) : undefined;
  const runtime = await require('./worker-race-runtime.cjs').createRaceRuntime({ authorityKey,
    identityKeys: { 'ath-1': O.K_IDENTITY, 'ath-2': O.K_IDENTITY }, clockISO: NOW,
    ...(p1Bytes ? {p1TestKey:p1Bytes.toString('base64url')} : {}) });
  const databaseErrors = new Set();
  const observedDb = { prepare: sql => runtime.db.prepare(sql), async batch(statements) {
    try { return await runtime.db.batch(statements); }
    catch (error) {
      if (!String(error.message).includes('stale_revision') && !databaseErrors.has(error.message)) {
        databaseErrors.add(error.message); console.log('D1-RACE DATABASE ERROR ' + error.message);
      }
      throw error;
    }
  } };
  const config = { db: observedDb, authorityKey, identityKeys: () => O.K_IDENTITY, clock: () => NOW, storage };
  const lease = (athlete, device) => {
    const { signature, ...record } = O.lease(device);
    return signLease({ ...record, athlete_id: athlete }, authorityKey);
  };
  const athletes = {
    "ath-1": { plan: { protein_g: 150, steps: 8000 }, devices: { "dev-A": { lease: lease("ath-1", "dev-A") }, "dev-B": { lease: lease("ath-1", "dev-B") } } },
    "ath-2": { plan: { protein_g: 150, steps: 8000 }, devices: { "dev-C": { lease: lease("ath-2", "dev-C") } } },
  };
  const seed = createBridge(config);
  try {
    await seed.initialize(athletes);
    const foreignChild = O.build({ op_id: "race-foreign-child", device_id: "dev-A", device_seq: 1, parents: ["race-foreign"] });
    const ownChild = O.build({ op_id: "race-own-child", device_id: "dev-A", device_seq: 2, pred: "race-foreign-child", parents: ["race-parent"] });
    assert.equal((await seed.invoke("admit", ["ath-1", foreignChild])).status, "WAITING");
    assert.equal((await seed.invoke("admit", ["ath-1", ownChild])).status, "WAITING");
    const operations = [
      O.build({ op_id: "race-foreign", athlete_id: "ath-2", device_id: "dev-C", device_seq: 1 }),
      O.build({ op_id: "race-parent", device_id: "dev-B", device_seq: 1 }),
      ownChild,
      ...Array.from({ length: 97 }, (_, i) => O.build({ op_id: "race-fact-" + (i + 3), device_id: "dev-A", device_seq: i + 3 })),
    ];
    // No shared in-process authority instance or queue: every call starts its
    // own bridge invocation and takes its own asynchronous D1 snapshot.
    let completed = 0;
    const replies = await Promise.all(operations.map(async op => {
      const result = await runtime.invoke("admit", [op.athlete_id, op]);
      if (++completed % 25 === 0 && !options.quiet) console.log(`D1-RACE PROGRESS ${completed}/100 independent invocations completed`);
      return result;
    }));
    assert.equal(replies.length, 100);
    assert(replies.every(reply => ["ACCEPTED", "WAITING"].includes(reply.status)),
      'Unexpected concurrent replies: ' + JSON.stringify(replies.filter(reply => !["ACCEPTED", "WAITING"].includes(reply.status)).map(reply => ({ status: reply.status, code: reply.rejection_code }))));
    assert(replies.every(reply => verifyDisposition(reply, verificationKey)));
    const fresh = createBridge(config);
    const one = await fresh.invoke("receipts", ["ath-1", 0]), two = await fresh.invoke("receipts", ["ath-2", 0]);
    assert.equal(one.length, 99); assert.equal(two.length, 1);
    assert.deepEqual(one.map(row => row.seq), Array.from({ length: 99 }, (_, i) => i + 1));
    assert.equal(new Set(one.map(row => row.op.op_id)).size, 99);
    assert.equal((await fresh.invoke("disposition", ["ath-1", "dev-A", 1])).rejection_code, "CROSS_ATHLETE_REFERENCE");
    assert.equal((await fresh.invoke("disposition", ["ath-1", "dev-A", 2])).status, "ACCEPTED");
    assert.deepEqual((await fresh.invoke("dispositionHistory", ["ath-1", "dev-A", 2])).map(row => row.status), ["WAITING", "ACCEPTED"]);
    const original = await fresh.invoke("admit", ["ath-1", ownChild]);
    assert.deepEqual(await createBridge(config).invoke("admit", ["ath-1", ownChild]), original);
    if (!options.quiet) console.log("D1-RACE PASS 100 independent workerd invocations; foreign ownership and waiting drain; 100 unique contiguous accepted records across two athletes");

    // Capture the actual write batch and cut each statement boundary with a
    // SQLite runtime error. D1 must roll back revision, rows and every effect.
    let writeCount = null, expectedWriteCount = null;
    function cutDatabase(cut, observations = []) {
      let calls = 0;
      return {
        prepare: sql => runtime.db.prepare(sql),
        async batch(statements) {
          calls++;
          if (calls % 2 === 0) {
            writeCount = statements.length;
            if (cut !== null) {
              observations.push({ cut, length: statements.length });
              // Capture before the injected SQLite failure. The outer rig
              // asserts this evidence even if the bridge converts this guard
              // error to UNAVAILABLE; a mismatched layout cannot earn a PASS.
              if (cut < 0 || cut > statements.length || statements.length !== expectedWriteCount)
                throw new Error("RIG_CUT_LAYOUT_MISMATCH");
              const fail = runtime.db.prepare("SELECT abs(-9223372036854775808)");
              return runtime.db.batch([...statements.slice(0, cut), fail, ...statements.slice(cut)]);
            }
          }
          return runtime.db.batch(statements);
        },
      };
    }
    const probe = O.build({ op_id: "cut-probe", device_id: "dev-B", device_seq: 2, kind: "plan-mutation", class: "plan", payload: null, plan: {} });
    assert.equal((await createBridge({ ...config, db: cutDatabase(null) }).invoke("admit", ["ath-1", probe])).status, "ACCEPTED");
    assert(Number.isInteger(writeCount) && writeCount > 1, "Bridge did not expose one read batch followed by one write batch");
    expectedWriteCount = writeCount;
    const boundaries = expectedWriteCount + 1;
    for (let cut = 0; cut < boundaries; cut++) {
      const operation = O.build({ op_id: "cut-op-" + cut, device_id: "dev-B", device_seq: cut + 3, kind: "plan-mutation", class: "plan", payload: null, plan: {} });
      const before = await databaseDigest(runtime.db);
      const observations = [];
      const result = await createBridge({ ...config, db: cutDatabase(cut, observations) }).invoke("admit", ["ath-1", operation]);
      assert.equal(observations.length, 1, "Crash cut must exercise exactly one captured write batch");
      assert.equal(observations[0].length, expectedWriteCount, "Crash batch layout differs from the measured probe; use identical cloned prestate");
      assert(cut <= observations[0].length, "Crash cut exceeds the current write batch length");
      assert.equal(observations[0].cut, cut, "Crash cut evidence does not match the requested boundary");
      assert.equal(result.status, "UNAVAILABLE", "No durable success may escape a failed D1 batch");
      assert.equal(await databaseDigest(runtime.db), before, "Partial rows after atomic write cut " + cut);
      const accepted = await createBridge(config).invoke("admit", ["ath-1", operation]);
      assert.equal(accepted.status, "ACCEPTED");
      assert.deepEqual(await createBridge(config).invoke("admit", ["ath-1", operation]), accepted);
      assert.equal((await createBridge(config).invoke("log", ["ath-1"])).filter(op => op.op_id === operation.op_id).length, 1);
    }
    if (!options.quiet) console.log(`D1-CRASH PASS ${boundaries}/${boundaries} atomic batch cuts; no partial rows; exact retry one effect`);
    // D1 can commit successfully and lose only its reply. Capture the durable
    // disposition before throwing, then require the bridge's fresh-snapshot
    // retry to return those bytes with exactly one log/plan effect.
    const lostOperation = O.build({ op_id: "cut-lost-d1-reply", device_id: "dev-B", device_seq: boundaries + 3,
      kind: "plan-mutation", class: "plan", payload: null, plan: {} });
    let lostCalls = 0, replyDropped = false, durableDispositionBytes = null;
    const lostReplyDatabase = {
      prepare: sql => runtime.db.prepare(sql),
      async batch(statements) {
        const call = ++lostCalls;
        const result = await runtime.db.batch(statements);
        if (call === 2) {
          const columns=storage ? 'athlete,collection,row_id,value,sealed,storage_revision' : 'value';
          const rows = await runtime.db.prepare("SELECT "+columns+" FROM authority_rows WHERE athlete = ? AND collection = 'operations' AND row_id = ?")
            .bind("ath-1", lostOperation.op_id).all();
          let row=rows.results[0];
          if(storage){const revision=(await runtime.db.prepare('SELECT revision FROM authority_revision WHERE id=1').first()).revision;
            row=await require('../w5/storage/row-codec.cjs').createAuthorityRowCodec(storage).open(row,{revision});}
          durableDispositionBytes = JSON.stringify(JSON.parse(row.value).disposition);
          replyDropped = true;
          throw new Error("fetch failed");
        }
        return result;
      },
    };
    const lostAccepted = await createBridge({ ...config, db: lostReplyDatabase }).invoke("admit", ["ath-1", lostOperation]);
    assert(replyDropped && lostCalls >= 4, "Lost durable reply did not trigger a fresh read/write attempt");
    assert.equal(lostAccepted.status, "ACCEPTED");
    assert.equal(JSON.stringify(lostAccepted), durableDispositionBytes, "Retry changed the original durable disposition bytes");
    assert.deepEqual(await createBridge(config).invoke("admit", ["ath-1", lostOperation]), lostAccepted);
    assert.equal((await createBridge(config).invoke("log", ["ath-1"])).filter(op => op.op_id === lostOperation.op_id).length, 1);
    assert.equal((await createBridge(config).invoke("planTransactions", ["ath-1"])).filter(tx => tx.txn_id === lostOperation.requested_transaction_id).length, 1);
    if (!options.quiet) console.log("D1-LOST-REPLY PASS durable write then fetch failure; fresh snapshot retry; original signed bytes and one plan effect");
    const durableDigest = await databaseDigest(runtime.db);
    await runtime.close();
    const reopened = await createLocalD1({ directory: runtime.directory });
    try {
      assert.equal(await databaseDigest(reopened.db), durableDigest, "Disk database changed across workerd close/reopen");
      assert.deepEqual(await createBridge({ ...config, db: reopened.db }).invoke("admit", ["ath-1", ownChild]), original);
      assert.deepEqual(await createBridge({ ...config, db: reopened.db }).invoke("admit", ["ath-1", lostOperation]), lostAccepted);
      if (!options.quiet) console.log("D1-REOPEN PASS persisted rows and signed replay survive workerd close/reopen");
    } finally { await reopened.close(); }
    return { ok: true, invocations: 100, cuts: boundaries, lostReply: true };
  } finally { await runtime.close(); }
}
module.exports = { run, databaseDigest };
if (require.main === module) run().catch(error => { console.error("D1-RACE FAIL " + error.message); process.exitCode = 1; });
