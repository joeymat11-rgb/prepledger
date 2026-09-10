'use strict';
// Materialise the composition root the accepted L candidate's
// rebuild/m4/workout/engine-runtime.cjs actually needs.
//
// WHY THIS EXISTS. engine-runtime.cjs composes twelve engine factories through
// require('../../engine/<name>.cjs'). Six of those files, at their accepted L
// bytes, cannot be written into rebuild/engine/ on this branch:
// rebuild/m4/spec/load-write-source.cjs verify() asserts a CLOSED
// rebuild/engine file inventory (exactly constants, dates, energy, index,
// merge, migrate, oracle-shim, plan, policy, progression, seed, sleep, today,
// volume, writers, earn) and exact bytes for plan/progression/sleep/today/
// writers. Adding performed.cjs and entered-load.cjs, or changing those five,
// makes `node rebuild/m4/spec/load-write-package.cjs --ci` fail. That profile
// is not ours to edit, so the L carrier bytes are staged HERE, beside the
// candidate that owns them, and assembled into a scratch root on demand.
//
// Nothing is installed, nothing under rebuild/engine is written, and no byte
// is transformed: every file is copied verbatim and its sha256 is returned.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '../../../..');
// Carriers at the accepted L bytes (hashes/HASHES-L-AFTER.sha256).
const L_CARRIERS = Object.freeze({
  'performed.cjs': '2372e66ba4e31f7229c870e4d1e2e95855d7a49ee705394c23b53b84ec249f3a',
  'plan.cjs': '1b26c87f6fa037259a4ce480585e07714f5b38d4995a56bc94965f49386af2a3',
  'progression.cjs': '7031838d37cfc522d3757437abc957b0a8e3688af0b540a830673d9aad030ef5',
  'sleep.cjs': '3dd34e111fe56f757d55ad2a419e019109a4746430a76c1477d1bdfb94145da0',
  'today.cjs': '397532ecf20a4f5a9e1bd4a7d8d312cf5fd52058427603a7726ba512107bdbb3',
  'writers.cjs': '00291236ee0fe5a5bf0130d50219cb7753013302ae82a2c0af507f5a7aa649e6',
});
// Unchanged retained engine files, taken from rebuild/engine as they stand.
const RETAINED = Object.freeze(['dates.cjs', 'constants.cjs', 'energy.cjs', 'policy.cjs', 'volume.cjs', 'earn.cjs']);
// performed.cjs requires ./entered-load.cjs; the retained tree keeps those
// bytes under the configured-load candidate, pinned by its own runner.
const ENTERED_LOAD = 'rebuild/m4/spec/configured-load-candidate/entered-load.cjs';
const ENTERED_LOAD_SHA = '2a0cd97ec843924e6dc428f2dbb0fe3c5bf10335610a3315c205c84fc324a3a3';
const sha = buffer => crypto.createHash('sha256').update(buffer).digest('hex');

function materializeEngineRoot() {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-native-engine-'));
  fs.mkdirSync(path.join(out, 'rebuild/engine'), { recursive: true });
  fs.mkdirSync(path.join(out, 'rebuild/m4/workout'), { recursive: true });
  const pins = {};
  const put = (from, to, expected) => {
    const bytes = fs.readFileSync(from), hash = sha(bytes);
    if (expected && hash !== expected) throw new Error('Staged carrier bytes changed: ' + to + ' ' + hash);
    fs.writeFileSync(path.join(out, to), bytes); pins[to] = hash;
  };
  for (const [name, expected] of Object.entries(L_CARRIERS))
    put(path.join(__dirname, 'engine', name), 'rebuild/engine/' + name, expected);
  for (const name of RETAINED)
    put(path.join(ROOT, 'rebuild/engine', name), 'rebuild/engine/' + name, null);
  put(path.join(ROOT, ENTERED_LOAD), 'rebuild/engine/entered-load.cjs', ENTERED_LOAD_SHA);
  // Accepted L bytes were 9be218975e39d84465f6c337d48b60c5009f268eb68d7b9808871ad867c61b23.
  // This branch applies exactly one change (twelve literal requires in place of
  // the glob-expanded one; see the file's SLICE-A0 comment) and therefore pins
  // the changed bytes. That change needs the L owner's re-review.
  put(path.join(ROOT, 'rebuild/m4/workout/engine-runtime.cjs'), 'rebuild/m4/workout/engine-runtime.cjs',
    '4d48a9b13557072284cc017c132b32cc15ea08c9107120baf6fa85c496ea50f0');
  return { root: out, pins, runtimeModule: path.join(out, 'rebuild/m4/workout/engine-runtime.cjs') };
}

module.exports = { materializeEngineRoot, L_CARRIERS, RETAINED, ENTERED_LOAD, ROOT, sha };
