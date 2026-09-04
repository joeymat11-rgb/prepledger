/* interop-claude.cjs — the T2 client end-to-end against the T3 authority through rebuild/authority/transport.cjs.
   Scenario (brief §4): client.weighIn → client.syncOnce → the signed disposition drains the outbox → client.reduceThroughW
   pulls the receipt → client.frontier() === 1 — with two devices of one athlete and a second athlete, and with a forged
   authority key (nothing drains). Zero suite code: only the two products and node:crypto. */
const path = require("node:path"), crypto = require("node:crypto");
const ROOT = path.join(__dirname, "..");
const Client = require(path.join(ROOT, "client"));
const Authority = require(path.join(ROOT, "authority"));
const { localTransport } = require(path.join(ROOT, "authority", "transport.cjs"));
const AUTH_KEY = "authority-signing-key-interop", K_IDENTITY = "k-identity-interop";
const NOW = "2026-09-04T12:00:00Z", TODAY = "2026-09-04";
const clock = { now: () => NOW, today: () => TODAY, tz: "-04:00", monotonicMs: () => 0 };
const lease = (device_id, athlete_id) => Authority.crypto.signLease(AUTH_KEY, { lease_id: "L-" + device_id, device_id, athlete_id, schema_version: 1, range: [1, 500], not_before: "2026-09-01T00:00:00Z", not_after: "2026-10-01T00:00:00Z", issued_server_time: "2026-09-01T00:00:00Z" });
const authority = Authority.createAuthority({ authorityKey: AUTH_KEY, clock: { now: () => NOW }, athletes: {
  "ath-1": { devices: { "dev-A": { lease: lease("dev-A", "ath-1") }, "dev-B": { lease: lease("dev-B", "ath-1") } } },
  "ath-2": { devices: { "dev-C": { lease: lease("dev-C", "ath-2") } } } } });
const mkClient = (deviceId, athleteId, authorityKey) => { const c = Client.createClient({ deviceId, athleteId, identityKey: K_IDENTITY, authorityKey, backend: Client.memoryBackend(), clock, lease: lease(deviceId, athleteId), transport: localTransport(authority, athleteId), online: true, contract: { client: "1", required: "1" } }); c.boot(); return c; };
const rows = []; const say = (label, ok, detail) => { rows.push(ok); console.log((ok ? "PASS" : "FAIL") + " — " + label + (detail ? "  " + detail : "")); };
/* 1. one device, one athlete */
const A = mkClient("dev-A", "ath-1", AUTH_KEY);
const w1 = A.weighIn({ date: TODAY, lb: 170.6 }); const sentA = A.syncOnce(); const dA = authority.disposition("ath-1", "dev-A", 1);
say("dev-A weigh-in acknowledged locally, sent once, outbox drained by the signed ACCEPTED disposition", w1.acknowledged && sentA.length === 1 && A.outbox().length === 0 && dA && dA.status === "ACCEPTED" && authority.verifyDisposition(dA), `disposition ${dA && dA.status} seq ${dA && dA.athlete_log_seq}`);
const WA = A.reduceThroughW(); say("dev-A reduceThroughW pulls receipt 1 → frontier 1", WA === 1 && A.frontier() === 1, `W=${A.frontier()}`);
/* 2. second device of the same athlete: its weigh-in is seq 2; pulling brings dev-A's op along */
const B = mkClient("dev-B", "ath-1", AUTH_KEY);
const w2 = B.weighIn({ date: TODAY, lb: 170.4 }); B.syncOnce(); const dB = authority.disposition("ath-1", "dev-B", 1); const WB = B.reduceThroughW();
say("dev-B weigh-in ACCEPTED as athlete_log_seq 2; dev-B reduces through W=2 (both devices' receipts, contiguous)", w2.acknowledged && dB && dB.status === "ACCEPTED" && dB.athlete_log_seq === 2 && WB === 2 && B.outbox().length === 0, `W=${WB}`);
const WA2 = A.reduceThroughW(); say("dev-A catches up to W=2 on its next reduction (the other device's receipt carries the op)", WA2 === 2, `W=${WA2}`);
say("authority log for ath-1 holds exactly the two ops in seq order", JSON.stringify(authority.log("ath-1").map((o) => o.device_id)) === JSON.stringify(["dev-A", "dev-B"]) && authority.frontier("ath-1") === 2);
/* 3. a second athlete is isolated */
const C = mkClient("dev-C", "ath-2", AUTH_KEY);
const w3 = C.weighIn({ date: TODAY, lb: 201.2 }); C.syncOnce(); const WC = C.reduceThroughW();
say("ath-2 on dev-C: its own log starts at seq 1 (W=1); ath-1's log is untouched", w3.acknowledged && WC === 1 && authority.frontier("ath-2") === 1 && authority.frontier("ath-1") === 2, `W(ath-2)=${WC}`);
/* 4. a FORGED authority: an authority signing with a key the client does not trust. The client keeps its real key and its
   real lease; every disposition the impostor returns fails verification, so nothing drains and no face turns "Synced". */
const FORGED_KEY = "attacker-key";
const forgedLease = (device_id, athlete_id) => Authority.crypto.signLease(FORGED_KEY, { ...lease(device_id, athlete_id), signature: undefined });
const impostor = Authority.createAuthority({ authorityKey: FORGED_KEY, clock: { now: () => NOW }, athletes: { "ath-1": { devices: { "dev-A": { lease: forgedLease("dev-A", "ath-1") } } } } });
const F = Client.createClient({ deviceId: "dev-A", athleteId: "ath-1", identityKey: K_IDENTITY, authorityKey: AUTH_KEY, backend: Client.memoryBackend(), clock, lease: lease("dev-A", "ath-1"), transport: localTransport(impostor, "ath-1"), online: true, contract: { client: "1", required: "1" } }); F.boot();
const w4 = F.weighIn({ date: TODAY, lb: 169.9 }); const sentF = F.syncOnce(); const dImp = impostor.disposition("ath-1", "dev-A", 1); const WF = F.reduceThroughW();
say("forged authority key: the impostor admits the op and signs, the client refuses the signature — the outbox keeps the op, no disposition is stored, the face stays Sent", w4.acknowledged && sentF.length === 1 && dImp && dImp.status === "ACCEPTED" && !authority.verifyDisposition(dImp) && F.outbox().length === 1 && F.rejectedLedger().length === 0 && F.faceLabel(F.outbox()[0].op_id) === Client.copy.SENT, `impostor says ${dImp && dImp.status} · outbox=${F.outbox().length} · W=${WF} (receipts are not signed in T2: W follows the impostor's log — see REPORT §5)`);
/* 5. a lost acknowledgement retries the SAME op_id: the authority replays the stored disposition, the log does not grow */
const D = mkClient("dev-B", "ath-1", AUTH_KEY); const before = authority.frontier("ath-1");
const w5 = D.weighIn({ date: TODAY, lb: 170.3 }); const op5 = D.outbox()[0].op_id;
/* dev-B's fresh install mints op-dev-B-1 again (the client derives op_id from device + seq) with NEW content: the same op_id
   with a different commitment is IDENTITY_COLLISION — transient (slot history and log untouched); signed with the real key,
   the client drains it into its rejected ledger; a second and third send replay the same answer */
D.syncOnce(); D.syncOnce(); const dispo1 = authority.disposition("ath-1", "dev-B", 1); const h = authority.dispositionHistory("ath-1", "dev-B", 1);
say("a reinstalled device reusing seq 1 with new content: IDENTITY_COLLISION, slot history stays 1, the log does not grow, the client files the rejection", w5.acknowledged && op5 === "op-dev-B-1" && authority.frontier("ath-1") === before && h.length === 1 && dispo1.op_id === op5 && dispo1.status === "ACCEPTED" && D.outbox().length === 0 && D.rejectedLedger().length === 1 && D.rejectedLedger()[0].reason === "IDENTITY_COLLISION", `frontier ${before} → ${authority.frontier("ath-1")} · slot history ${h.length} · rejected=${D.rejectedLedger().map((r) => r.reason).join(",")}`);
const ok = rows.every(Boolean); console.log("interop-claude ⇒ " + (ok ? "PASS" : "FAIL") + ` (${rows.filter(Boolean).length}/${rows.length}) — T2 client ↔ T3 authority through transport.cjs: two devices, a second athlete, a forged key`); process.exit(ok ? 0 : 1);
