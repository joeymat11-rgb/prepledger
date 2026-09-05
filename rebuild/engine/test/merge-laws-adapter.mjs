// PL_ENGINE adapter for the unchanged tools/sync-laws.mjs. No reference engine,
// fallback helper, copied law, fixture rewrite or product wrapper is installed.
import { loadCandidate } from "./merge-laws.cjs";
export const __test = loadCandidate();
