// Browser entry for a LOCAL-ERA workout host page.
//
// It re-exports the PM's host entry unchanged (rebuild/m3/w6/host/host-entry.mjs
// — composeWorkoutHost, the host-owned engine runtime mirror and every product
// provider a page needs) and adds ONLY the local half: the durable client a
// phone opens for itself and the bindings that turn it into the durable-client
// scope composeWorkoutHost asks for. Nothing is composed at import time; a page
// still has to enroll, boot and ask.
//
// No host/ file is edited to make this exist. That is the point: the host stays
// binding-only and the local era supplies the bindings.
export * from '../host/host-entry.mjs';
export { openLocalDurableClient, LOCAL_SCOPE, DERIVED, COLLECTIONS,
  opsBasis, sidecarFailure, sidecarStale, commitFailure, markerDatabaseName } from './local-client.mjs';
export { localHostBindings, localHostAuthorityKid, readLocalHostAuthority,
  LOCAL_HOST_CLIENT, LOCAL_HOST_INSTALL, LOCAL_HOST_AUTHORITY_PROFILE } from './host-bindings.mjs';
export { readLocalEra, publicEra, localEraLeaseId, leaseExpired, leaseRenewalDue,
  LOCAL_ERA_DAYS, LOCAL_ERA_PROFILE } from './local-era.mjs';
export { keysDatabaseName } from './local-keys.mjs';
