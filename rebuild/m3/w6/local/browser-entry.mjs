// browser-entry.mjs — the LOCAL-ERA bundle surface for a host page.
//
// Deliberately narrow: the factory, the presence/sidecar helpers a host needs to
// reason about its own cache, and StorageFailure. No hosted surface is exported
// from here — there is no W5 wire, no transport, no sync in the local era.
export { openLocalDurableClient, opsBasis, sidecarFailure, sidecarStale, commitFailure, DERIVED,
  COLLECTIONS, markerDatabaseName, LOCAL_GENERATION_PROFILE } from "./local-client.mjs";
export { openLocalKeys, keysPresent, keysDatabaseName, probeRecord } from "./local-keys.mjs";
export { createLocalEra, readLocalEra, localEraConfig, publicEra, localEraLeaseId, leaseExpired,
  leaseRenewalDue, renewLocalEraLease, LOCAL_ERA_PROFILE, LOCAL_ERA_DAYS,
  LOCAL_ERA_RENEW_WITHIN_DAYS } from "./local-era.mjs";
export { StorageFailure } from "../repository.mjs";
