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
// C2b. The phone side of Joe's PC port: unseal a sealed C2 bundle on WebCrypto
// alone and adopt it. No Node crypto, no node:buffer — atob/btoa and
// crypto.subtle, which is why this can ship in the phone bundle at all.
export { unsealBundle, qualifyBundle, importBundle, listImports, importOriginal, markImportRebased,
  importNameFor, importSummaries, importRebasePending, importRebaseCode,
  importIdentityOf, sameImport, bytesToBase64,
  base64ToBytes, sha256Hex, BUNDLE_PROFILE, BUNDLE_FAILURE, PAYLOAD_FAILURE,
  NOT_QUALIFIED, ORACLE_PASS, LOCAL_IMPORT_PROFILE, IMPORT_REBASE_CODE } from "./import-bundle.mjs";
export { StorageFailure } from "../repository.mjs";
