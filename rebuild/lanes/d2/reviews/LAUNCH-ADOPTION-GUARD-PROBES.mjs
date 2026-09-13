import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { assertNoNodeOnlyGlobals } from '../../../m3/w7-preview/today/build.mjs';

const bundle = fs.readFileSync(new URL('../../../../.tmp/w7-today-dist/app.js', import.meta.url), 'utf8');
const scan = source => assertNoNodeOnlyGlobals([['app.js', source]]);
const original = 'typeof __dirname === "string" ? __dirname : "rebuild/m3/w7-preview/today"';
assert.equal(bundle.split(original).length, 2, 'exactly one emitted original-defect site');
assert.equal(scan(bundle).offences.length, 0, 'the actual guarded candidate passes');
assert.throws(() => scan(bundle.replace(original, '__dirname')), /NODE-GLOBAL-IN-BUNDLE FAIL/, 'restored original defect refuses with attribution');
assert.throws(() => scan(bundle.replace(/^\s*\/\/ \S+\.(?:cjs|mjs|js)\s*$/gm, '')), /NODE-GLOBAL-GUARD BLIND/, 'complete attribution loss refuses');

// Partial attribution loss must not turn an executable pre-module fault into PASS.
const fault = 'var d2Unattributed = __dirname;\n';
const prefixed = fault + bundle;
const accepted = scan(prefixed);
assert.equal(accepted.offences.length, 0, 'witness: unattributed prefix is silently skipped');
const clauses = prefixed.match(/^export \{[\s\S]*?\};\s*$/m) || [];
assert.equal(clauses.length, 1, 'one export clause in the actual emitted bundle');
const script = prefixed.replace(clauses[0], '');
assert.throws(() => new vm.Script(script).runInNewContext({}), error => error.name === 'ReferenceError' && /__dirname/.test(error.message), 'that same emitted script really fails without Node globals');
console.log(JSON.stringify({ case: 'D2-GUARD-ATTRIBUTION', controls: 3, defect: 'unattributed executable prefix accepted', scannedModules: accepted.scannedModules, guardOffences: accepted.offences.length, browserShapedExecution: 'ReferenceError: __dirname is not defined' }));
