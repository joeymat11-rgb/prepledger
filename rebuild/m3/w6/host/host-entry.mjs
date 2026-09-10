// Browser entry for the workout host page. It re-exports the existing W6
// browser entry unchanged and adds ONLY the host composition and the product
// providers a page needs to call it. It composes nothing at import time: a
// page must supply the repository, identity, keys, clock and engine.
//
// The ENGINE RUNTIME IS NOT EXPORTED HERE and cannot be, on this branch.
// rebuild/m4/workout/engine-runtime.cjs composes twelve rebuild/engine
// modules, and six of them — at the bytes the accepted candidate-L needs,
// including rebuild/engine/performed.cjs, which does not exist under
// rebuild/engine at all — cannot be written into rebuild/engine here without
// breaking the closed engine inventory that rebuild/m4/spec/load-write-package.cjs
// --ci enforces. Measured with the real esbuild build:
// rebuild/m3/w6/host/esbuild-probe.mjs. A page therefore receives `engine` as
// an injected provider, and this branch cannot yet supply a bundled one.
export * from '../browser-entry.mjs';
export { composeWorkoutHost, createUnavailableNativeTrendContext } from './workout-host.mjs';
export { default as AthleteState } from '../../../m4/workout/athlete-state.cjs';
export { default as WorkoutBasis } from '../../../m4/workout/workout-basis.cjs';
export { default as ResumePolicy } from '../../../m4/workout/resume-policy.cjs';
export { default as SourceProjection } from '../../../m4/workout/source-projection.cjs';
export { default as EngineCapture } from '../../../m4/workout/engine-capture.cjs';
export { default as EngineHistory } from '../../../m4/workout/engine-history.cjs';
export { default as SourceCodec } from '../../w5/source/codec.cjs';
export { projectWorkoutRecords } from '../../../m4/workout/project-history.mjs';
