// Browser entry for a Today page that runs over the LOCAL ERA — the C4 bundle.
//
// It re-exports the PM's host entry unchanged (as host-browser-entry.mjs does),
// adds this branch's drop-in, and adds the PAGE'S OWN adapters and view
// unmodified, so the browser check drives the real product code rather than a
// re-statement of it. Nothing under rebuild/m3/w7-preview/today/ is edited to
// make this exist; it is imported.
//
// Held to the same build as every other W6 bundle (local/build.mjs imports
// build-browser.mjs rather than copying it), so the Node-import allowlist, the
// authority exclusion and the cipher/typography pins all still apply.
export * from '../host/host-entry.mjs';
export { openLocalDurableClient, LOCAL_SCOPE, DERIVED, markerDatabaseName } from './local-client.mjs';
export { localHostBindings, LOCAL_HOST_CLIENT, LOCAL_HOST_INSTALL } from './host-bindings.mjs';
export { readLocalEra, publicEra, localEraLeaseId, LOCAL_ERA_SCHEMA_VERSION } from './local-era.mjs';
export { keysDatabaseName } from './local-keys.mjs';
export { openTodayOverLocalEra, causalTips, startOrderRefusalOf } from './today-bindings.mjs';

// The page's own code, imported and re-exported, never re-implemented.
export { createGymModel, EFFORT_CHOICES } from '../../w7-preview/today/gym-model.mjs';
export { default as TodayModel } from '../../w7-preview/today/today-model.cjs';
