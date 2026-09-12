// Browser entry for the workout host page. It re-exports the existing W6
// browser entry unchanged and adds ONLY the host composition and the product
// providers a page needs to call it. It composes nothing at import time: a
// page must supply the repository, identity, keys, clock and engine.
//
// The engine runtime exported here is the HOST-OWNED mirror
// (./engine-runtime-host.cjs), not rebuild/m4/workout/engine-runtime.cjs. The
// accepted runtime composes its twelve modules through one non-literal
// require, which esbuild glob-expands over the whole of rebuild/engine —
// dragging in seed.cjs / migrate.cjs / merge.cjs / index.cjs and every
// Node-only rebuild/engine/test/* harness. Its bytes are pinned by the
// accepted M2-NATIVE-CARRIERS package, so the fix lives in the host module
// instead. Measured: rebuild/m3/w6/host/esbuild-probe.mjs. The two are held
// equivalent by rebuild/m3/w6/host/test/engine-equivalence.test.cjs.
export * from '../browser-entry.mjs';
export { composeWorkoutHost, createUnavailableNativeTrendContext } from './workout-host.mjs';
export { default as EngineRuntime } from './engine-runtime-host.cjs';
export { default as AthleteState } from '../../../m4/workout/athlete-state.cjs';
export { default as WorkoutBasis } from '../../../m4/workout/workout-basis.cjs';
export { default as ResumePolicy } from '../../../m4/workout/resume-policy.cjs';
export { default as SourceProjection } from '../../../m4/workout/source-projection.cjs';
export { default as EngineCapture } from '../../../m4/workout/engine-capture.cjs';
export { default as EngineHistory } from '../../../m4/workout/engine-history.cjs';
export { default as SourceCodec } from '../../w5/source/codec.cjs';
export { projectWorkoutRecords } from '../../../m4/workout/project-history.mjs';

// P2 / C1-REPORT "REQUEST TO PM" (2). THE LOCAL FACTORY, RE-EXPORTED — NOT A
// SECOND ONE. The comment at the top of this file ("a page must supply the
// repository, identity, keys, clock and engine") has had an answer since lane
// C's C1: rebuild/m3/w6/local/local-client.mjs `openLocalDurableClient` opens
// the real durable local store, and rebuild/m3/w6/local/host-bindings.mjs
// `localHostBindings` turns it into the twelve-member scope composeWorkoutHost
// asks for. A phone bundle built from this entry now has ONE import for both.
//
// These are re-export bindings: the values are the very objects those two
// modules export, in the same module instances, so there is NO second path to
// the store. C4's one-store design (rebuild/m3/w6/local/today-bindings.mjs,
// DECISIONS:111) imports `openLocalDurableClient` from the same
// ./local-client.mjs, and both of lane C's own entries
// (local/host-browser-entry.mjs, local/today-browser-entry.mjs) re-export the
// same two names explicitly, which shadows this `export *`-visible pair rather
// than duplicating it. Nothing here constructs, wraps, configures or caches
// anything; host/ still builds no store of its own.
export { openLocalDurableClient } from '../local/local-client.mjs';
export { localHostBindings } from '../local/host-bindings.mjs';
