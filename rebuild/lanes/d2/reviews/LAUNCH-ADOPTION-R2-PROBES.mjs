import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { assertNoNodeOnlyGlobals } from '../../../m3/w7-preview/today/build.mjs';

const bundle = fs.readFileSync(new URL('../../../../.tmp/w7-today-dist/app.js', import.meta.url), 'utf8');
const scan = (...assets) => assertNoNodeOnlyGlobals(assets);
const clean = scan(['app.js', bundle]);
let refused = 0, admitted = 0;
const no = (assets, reason) => { assert.throws(() => scan(...assets), reason); refused++; };
const yes = assets => { const r = scan(...assets); assert.equal(r.offences.length, 0); assert.equal(r.scannedModules, clean.scannedModules); admitted++; };

for (const code of ['var x = __dirname;', 'var x = __filename;', 'var x = require("missing");']) {
  no([['app.js', code + '\n' + bundle]], /NODE-GLOBAL-IN-BUNDLE FAIL: <unattributed>/);
  no([['app.js', bundle], ['extra.js', code]], /NODE-GLOBAL-IN-BUNDLE FAIL: <unattributed>/);
}
for (const code of [
  'var x = typeof __dirname === "undefined" ? __dirname : "fallback";',
  'var x = typeof __filename === "undefined" ? __filename : "fallback";',
  'var x = typeof require === "undefined" ? require("missing") : null;',
]) no([['app.js', code + '\n' + bundle]], /NODE-GLOBAL-IN-BUNDLE FAIL/);
for (const code of [
  'var x = typeof __dirname === "string" ? __dirname : "fallback";',
  "var x = typeof __filename == 'string' ? __filename : 'fallback';",
  'var x = typeof require === "function" ? require("missing") : null;',
  '// __dirname and require("missing") are explanation only\nvar x = 1;',
]) yes([['app.js', code + '\n' + bundle], ['extra.js', code]]);
yes([['app.js', bundle + '\n// node_modules/vendor/index.js\nvar vendorDeadBranch = __dirname;']]);
no([['app.js', 'var x = typeof __dirname === "string" ? __dirname : "fallback"; var y = __dirname;\n' + bundle]], /NODE-GLOBAL-IN-BUNDLE FAIL/);
no([['app.js', bundle.replace(/^\s*\/\/ \S+\.(?:cjs|mjs|js)\s*$/gm, '')]], /NODE-GLOBAL-GUARD BLIND/);
const original = 'typeof __dirname === "string" ? __dirname : "rebuild/m3/w7-preview/today"';
assert.equal(bundle.split(original).length, 2);
no([['app.js', bundle.replace(original, '__dirname')]], /NODE-GLOBAL-IN-BUNDLE FAIL/);

const clauses = bundle.match(/^export \{[\s\S]*?\};\s*$/m) || [];
assert.equal(clauses.length, 1);
assert.throws(() => new vm.Script('var d2Unattributed = __dirname;\n' + bundle.replace(clauses[0], '')).runInNewContext({}),
  e => e.name === 'ReferenceError' && /__dirname/.test(e.message), 'R1 witness still represents a real execution failure');
// Re-instate the precise R1 omission in an isolated compilation of this guard.
// No tracked source or served asset is changed, and only an assertion failure qualifies.
const source = fs.readFileSync(new URL('../../../m3/w7-preview/today/build.mjs', import.meta.url), 'utf8');
const chunk = source.slice(source.indexOf('const NODE_ONLY ='), source.indexOf('/* THE BUILD ID')).replace('export function assertNoNodeOnlyGlobals', 'function assertNoNodeOnlyGlobals');
const site = 'if (segment.module && /node_modules/.test(segment.module)) continue;';
assert.equal(chunk.split(site).length, 2);
const mutant = Function('assert', chunk.replace(site, 'if (!segment.module || /node_modules/.test(segment.module)) continue;') + '\nreturn assertNoNodeOnlyGlobals;')(assert);
assert.throws(() => assert.throws(() => mutant([['app.js', 'var d2Unattributed = __dirname;\n' + bundle]]), /NODE-GLOBAL-IN-BUNDLE FAIL/),
  error => error.code === 'ERR_ASSERTION', 'the independent rejection assertion kills the restored omission');
yes([['app.js', bundle]]);
console.log(JSON.stringify({ case: 'D2-R2-ATTRIBUTION', refused, admitted, controls: refused + admitted, scannedModules: clean.scannedModules, r1Witness: 'unsafe prefix refused; execution remains ReferenceError', mutantsKilledByAssertion: 1 }));
