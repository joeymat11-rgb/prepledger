'use strict';
// Mutate a disposable authority copy; neither product nor frozen laws change.
const assert = require('node:assert/strict');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const {createHash} = require('node:crypto'), {spawnSync} = require('node:child_process');
const {buildCore} = require('../build.cjs');
const root = path.resolve(__dirname, '../../../..');
const source = path.join(root, 'rebuild/authority');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-workout-bite-'));
const copy = path.join(scratch, 'authority');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const pins = Object.fromEntries(fs.readdirSync(source).filter(x => fs.statSync(path.join(source,x)).isFile())
  .map(x => [x, sha(fs.readFileSync(path.join(source,x)))]));
fs.cpSync(source, copy, {recursive:true});
const target = path.join(copy, 'admit.cjs'), original = fs.readFileSync(target);
const needle = '...(workout ? workoutReferences(op) : [])';
assert.equal(original.toString().split(needle).length, 2);
function run(file, expectedExit, evidence) {
  const result = spawnSync(process.execPath, [path.join(__dirname,file),'--authority-root',copy],
    {cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});
  const text = (result.stdout || '') + (result.stderr || '');
  fs.writeFileSync(path.join(scratch,file + '.' + expectedExit + '.log'), text);
  assert.equal(result.status, expectedExit, file + ' native exit');
  assert(!text.includes('HARNESS ERROR'), file + ' must reach behavioral assertions');
  assert(text.includes(evidence), file + ' named behavioral evidence');
  return text.split(/\r?\n/).find(line => line.includes(evidence));
}
async function main() {
  try {
    fs.writeFileSync(target, original.toString().replace(needle, '...[]'));
    console.log('WORKOUT BITE RED-core: ' + run('workout-core.test.cjs',1,'FAIL rejected-start-terminal-dependency'));
    console.log('WORKOUT BITE RED-http: ' + run('workout-http.test.cjs',1,'FAIL http-rejected-start-child-terminal'));
    fs.writeFileSync(target, original);
    assert.equal(sha(fs.readFileSync(target)), sha(original));
    console.log(run('workout-core.test.cjs',0,'WORKOUT ACTUAL CORE PASS'));
    console.log(run('workout-http.test.cjs',0,'WORKOUT R1 HTTP PASS'));
    for (const [file,hash] of Object.entries(pins)) assert.equal(sha(fs.readFileSync(path.join(source,file))),hash);
    console.log('WORKOUT BITE PASS — both boundaries detected; restored admit SHA256 ' + sha(original));
  } finally {
    fs.writeFileSync(target, original);
    // HTTP harness builds an ignored bundle. Leave it sourced from the real tree.
    await buildCore();
  }
}
main().catch(error => {console.error('WORKOUT BITE FAIL ' + (error.code || error.name)); process.exitCode=1;});
