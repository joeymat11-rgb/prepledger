// local-schema-probe.mjs — THE C4 CRUX, EXECUTED.
//
// A2 split Today into TWO encrypted generations because "one generation carries
// ONE authority lease with ONE schema_version" (reading-host.mjs header). Lane C's
// local era carries ONE lease at schema_version 2 (local-era.mjs
// LOCAL_ERA_SCHEMA_VERSION). So the question C4 has to answer by EXECUTION, not by
// reading, is: can that single schema-2 generation admit a schema-1 reading?
//
// Three probes, one installation, one generation. Run:
//   node rebuild/m3/w6/test/local-schema-probe.mjs
import { IDBFactory } from "fake-indexeddb";
import { webcrypto } from "node:crypto";
import { createDurablePublicClient } from "../public-client.mjs";
import { openLocalDurableClient } from "../local/local-client.mjs";

const DAY = "2026-05-04";
const clock = { now: () => DAY + "T08:00:00.000Z", today: () => DAY, tz: "+00:00", monotonicMs: () => 0 };
const lines = [];
const say = line => { lines.push(line); console.log(line); };

const indexedDB = new IDBFactory();
const client = await openLocalDurableClient({ indexedDB, crypto: webcrypto,
  databaseName: "c4-schema-probe", namespace: "probe/device-A",
  athleteId: "probe-athlete", deviceId: "probe-device", clock });
await client.enroll();
await client.boot();
const bindings = await client.hostBindings();
const sealedLease = (await bindings.repository.load()).generation.metadata.authorityLease;
say("lease.schema_version = " + sealedLease.schema_version + "   (rebuild/m3/w6/local/local-era.mjs LOCAL_ERA_SCHEMA_VERSION)");

// PROBE A — the PUBLIC client at the lease's own schema (2), asked for a weigh-in.
const publicAt2 = createDurablePublicClient({ ...bindings, schemaVersion: 2 });
await publicAt2.reopen();
const a = await publicAt2.execute("weighIn", { date: DAY, lb: 170.6 });
say("A public client schemaVersion:2 execute('weighIn') -> acknowledged=" + a.acknowledged
  + " state=" + a.state + " code=" + a.code);

// PROBE B — the PUBLIC client at the READING schema (1) over the same lease.
const publicAt1 = createDurablePublicClient({ ...bindings, schemaVersion: 1 });
const opened = await publicAt1.reopen();
const b = await publicAt1.execute("weighIn", { date: DAY, lb: 170.6 });
say("B public client schemaVersion:1 reopen -> refusal=" + JSON.stringify(opened.refusal || null));
say("B public client schemaVersion:1 execute('weighIn') -> acknowledged=" + b.acknowledged
  + " state=" + b.state + " code=" + b.code);

// PROBE C — C1's own execute() path (the bridge), same generation, same lease.
const c = await client.execute("weighIn", { date: DAY, lb: 170.6 });
say("C C1 execute('weighIn') -> acknowledged=" + c.acknowledged + " state=" + c.state
  + " op_id=" + c.op_id);
const gen = (await bindings.repository.load()).generation;
const ops = Object.values(gen.collections.ops || {});
say("C stored ops = " + ops.length + "; schema_versions = "
  + JSON.stringify(ops.map(op => [op.class, op.schema_version])));
say("C lease_ids = " + JSON.stringify([...new Set(ops.map(op => op.lease_id))]));
client.close();

const verdict = a.acknowledged !== true && b.acknowledged !== true && c.acknowledged === true;
say(verdict
  ? "VERDICT: the pinned public client CANNOT admit a reading under the schema-2 local-era lease; C1's own bridge CAN, into the SAME generation."
  : "VERDICT: UNEXPECTED — re-read this probe before trusting the report.");
process.exit(verdict ? 0 : 2);
