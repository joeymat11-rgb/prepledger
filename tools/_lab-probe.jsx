// tiny probe bundled by render-smoke.mjs — exposes the EVIDENCE census function so the
// smoke can assert DOM equivalence (everything labStatusList knows must render behind
// the FINDINGS door) rather than counting rows against a hand-written number that goes
// stale the moment an instrument is added.
import { __test } from "../src/app.jsx";
module.exports = { labStatusList: __test.labStatusList };
