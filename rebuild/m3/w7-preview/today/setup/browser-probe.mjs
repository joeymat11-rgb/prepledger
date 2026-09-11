// Test-only readback. No enrollment, setup authoring, operation or key export.
import { openTodayInstallation } from '../../../w6/local/today-bindings.mjs';
globalThis.inspectFirstUse = async () => {
  const era = await openTodayInstallation({ enroll:false });
  try {
    const { setup, basisState } = await era.initialSetup();
    const stored = await era.generation();
    return { setup, initialHistory: basisState.sessionLog, initialLoads: basisState.exercises.map(x => x.w),
      deviceId:era.deviceId, collections:stored.generation.collections };
  } finally { era.close(); }
};
