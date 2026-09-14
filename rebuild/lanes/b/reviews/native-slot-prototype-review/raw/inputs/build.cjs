'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { ROOT, SCRATCH } = require('./loader.cjs');
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
function childEnv(extra = {}) {
  const systemRoot = process.env.SystemRoot || process.env.WINDIR;
  if (!systemRoot) throw new Error('Windows system root is required');
  const dirs = {
    TEMP: path.join(SCRATCH, 'temp'), TMP: path.join(SCRATCH, 'temp'),
    TMPDIR: path.join(SCRATCH, 'temp'),
    ZIG_GLOBAL_CACHE_DIR: path.join(SCRATCH, 'cache', 'global'),
    ZIG_LOCAL_CACHE_DIR: path.join(SCRATCH, 'cache', 'local')
  };
  for (const dir of Object.values(dirs)) fs.mkdirSync(dir, { recursive: true });
  return { SystemRoot: systemRoot, WINDIR: systemRoot,
    SystemDrive: path.parse(systemRoot).root.replace(/[\\/]$/, ''),
    ComSpec: path.join(systemRoot, 'System32', 'cmd.exe'),
    PATH: path.join(systemRoot, 'System32'), PATHEXT: '.COM;.EXE;.BAT;.CMD',
    NODE_OPTIONS: '', NODE_PATH: '', ...dirs, ...extra };
}
function runRecorded(executable, args, directory, label, env, timeout = 180000) {
  const start = new Date().toISOString();
  const result = spawnSync(executable, args, { cwd: ROOT, env, windowsHide: true,
    timeout, maxBuffer: 16 * 1024 * 1024 });
  const stdout = path.join(directory, `${label}.stdout`);
  const stderr = path.join(directory, `${label}.stderr`);
  fs.writeFileSync(stdout, result.stdout || Buffer.alloc(0), { flag: 'wx' });
  fs.writeFileSync(stderr, result.stderr || Buffer.alloc(0), { flag: 'wx' });
  const record = { executable, args, cwd: ROOT, environment: env, start,
    end: new Date().toISOString(), pid: result.pid ?? null, status: result.status,
    signal: result.signal, error: result.error ? { code: result.error.code, message: result.error.message } : null,
    stdout: { path: stdout, bytes: fs.statSync(stdout).size, sha256: sha256(stdout) },
    stderr: { path: stderr, bytes: fs.statSync(stderr).size, sha256: sha256(stderr) } };
  write(path.join(directory, `${label}.result.json`), record);
  return record;
}
function main() {
  const [phase, sourceHead] = process.argv.slice(2);
  if (!/^[a-z][a-z0-9-]{0,39}$/.test(phase || '') || !/^[a-f0-9]{40}$/.test(sourceHead || ''))
    throw new Error('Usage: build.cjs unique-phase exact-source-head');
  if (process.platform !== 'win32' || process.arch !== 'x64' || process.version !== 'v22.23.2')
    throw new Error('Exact Node v22.23.2 Windows x64 is required');
  const manifest = JSON.parse(fs.readFileSync(path.join(SCRATCH, 'NATIVE-SLOT-PROTOTYPE-INPUTS.json')));
  const nodePin = manifest.runtimeAndHeaders.files.find(x => x.path === 'win-x64/node.exe');
  if (sha256(process.execPath) !== nodePin.sha256) throw new Error('Runtime hash mismatch');
  const zigArchive = path.join(SCRATCH, 'downloads', 'zig-x86_64-windows-0.15.2.zip');
  if (sha256(zigArchive) !== manifest.toolchain.windowsX64.shasum) throw new Error('Compiler archive hash mismatch');
  const zigRoot = path.join(SCRATCH, 'toolchain', 'zig-x86_64-windows-0.15.2');
  const zig = path.join(zigRoot, 'zig.exe');
  const zigInventory = JSON.parse(fs.readFileSync(path.join(SCRATCH, 'zig-extraction.json')));
  const zigExePin = zigInventory.files.find(x => x.member === 'zig-x86_64-windows-0.15.2/zig.exe');
  if (!zigExePin || sha256(zig) !== zigExePin.sha256) throw new Error('Extracted compiler hash mismatch');
  const headerInventory = JSON.parse(fs.readFileSync(path.join(SCRATCH, 'header-extraction.json')));
  for (const entry of headerInventory.files) {
    const file = path.join(SCRATCH, 'toolchain', entry.member);
    if (fs.statSync(file).size !== entry.bytes || sha256(file) !== entry.sha256)
      throw new Error(`Header changed: ${entry.member}`);
  }
  const library = path.join(SCRATCH, 'downloads', 'node.lib');
  const libraryPin = manifest.runtimeAndHeaders.files.find(x => x.path === 'win-x64/node.lib');
  if (sha256(library) !== libraryPin.sha256) throw new Error('Import library hash mismatch');
  const directory = path.join(SCRATCH, 'builds', phase);
  fs.mkdirSync(path.dirname(directory), { recursive: true });
  fs.mkdirSync(directory); // Deliberately refuse overwriting any prior attempt.
  const sourceNames = ['mapping.c', 'loader.cjs', 'build.cjs', 'PROTOCOL.md', 'test/prototype.test.cjs'];
  const sources = sourceNames.map(name => ({ path: path.join(__dirname, name),
    bytes: fs.statSync(path.join(__dirname, name)).size, sha256: sha256(path.join(__dirname, name)) }));
  const env = childEnv();
  const inputs = { phase, sourceHead, runtime: { version: process.version, path: process.execPath,
    sha256: sha256(process.execPath) }, compiler: { version: '0.15.2', path: zig, sha256: sha256(zig),
    archiveSha256: sha256(zigArchive) }, library: { path: library, sha256: sha256(library) },
    headerArchiveSha256: manifest.runtimeAndHeaders.files[0].sha256,
    headerFilesVerified: headerInventory.files.length, sources, environment: env };
  write(path.join(directory, 'inputs.json'), inputs);
  const version = runRecorded(zig, ['version'], directory, 'compiler-version', env);
  if (version.status !== 0 || version.error || fs.readFileSync(version.stdout.path, 'utf8').trim() !== '0.15.2')
    throw new Error('Pinned compiler version prerequisite failed; retained raw result');
  const binaries = {};
  for (const [name, definitions] of [
    ['candidate', []], ['version-mismatch', ['-DSLOT_VERSION=2']],
    ['size-mismatch', ['-DSLOT_VIEW_BYTES=128']]
  ]) {
    const binary = path.join(directory, `${name}.node`);
    const args = ['cc', '-target', 'x86_64-windows-gnu', '-shared', '-std=c11', '-O2',
      '-Wall', '-Wextra', '-Werror', '-DNAPI_VERSION=8', '-DWIN32_LEAN_AND_MEAN',
      ...definitions, '-I', path.join(SCRATCH, 'toolchain', 'node-v22.23.2', 'include', 'node'),
      path.join(__dirname, 'mapping.c'), library, '-lkernel32', '-o', binary];
    const result = runRecorded(zig, args, directory, name, env);
    if (result.status !== 0 || result.error || !fs.existsSync(binary))
      throw new Error(`Pinned ${name} build failed; see retained raw stdout/stderr/result`);
    binaries[name] = { path: binary, bytes: fs.statSync(binary).size, sha256: sha256(binary), definitions };
  }
  write(path.join(directory, 'build.json'), { ...inputs, binaries });
  console.log(JSON.stringify({ phase, sourceHead, built: Object.keys(binaries), directory }));
}
if (require.main === module) main();
module.exports = { childEnv, runRecorded, sha256, write };
