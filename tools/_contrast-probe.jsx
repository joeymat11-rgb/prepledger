// tiny probe bundled by contrast-audit.mjs — exports the two palettes via __test
import { __test } from "../src/app.jsx";
module.exports = { PALETTE: __test.PALETTE, DT_PALETTE: __test.DT_PALETTE };
