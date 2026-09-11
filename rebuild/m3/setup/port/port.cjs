#!/usr/bin/env node
'use strict';
/* rebuild/m3/setup/port/port.cjs — Joe's PORT SCRIPT. Runs on the owner's PC,
   only after he asks for it in his own words, and only there.

   It takes the frozen app's private ledger (ledger/state.json, SCHEMA_V 60),
   walks it forward through the ACCEPTED migrate/merge modules, proves the
   engine that did the walking against the frozen port-oracle gate, and writes
   ONE passphrase-sealed file that Joe moves to his phone himself.

   WHAT IT NEVER DOES. It never prints a ledger value. Every line below is a
   path, a count, a hash or a verdict — the same rule port-oracle.cjs already
   enforces in code for the private blob. It never uploads anything. It never
   writes inside the repository, inside any git working tree, or anywhere a
   junction or an 8.3 short name leads back into one (see outRefusal: the first
   version of that guard compared strings, and an independent reviewer walked
   through it twice). It never overwrites an existing bundle.

   THREE THINGS MUST AGREE BEFORE IT SEALS. (1) prepare.cjs's own dataLossGuard,
   (2) a state-level counts check built on the port-oracle's own census counts()
   — it covers exercises, queue, earned, debuts and events, which dataLossGuard
   was measured NOT to protect — and (3) the frozen gate, GREEN in both Date
   modes. Any one of them says no and nothing is written at all.

   WHAT IT REUSES, UNCHANGED (nothing here re-implements migration or merge):
     · rebuild/m4/import/prepare.cjs  createImportPreparation({engine, parseStrictJson})
       — the accepted preparation: snapshot the original bytes BEFORE any engine
         call, migrate (merge when --local is given), re-parse through the strict
         boundary, and run dataLossGuard against every preimage.
     · rebuild/m3/w6/strict-json.mjs  parseStrictJson — the W6 strict parser
       (ESM; loaded here with a dynamic import() because this CLI is CommonJS).
     · rebuild/engine/oracle-shim.cjs — the SAME engine table the port-oracle
       gate certifies, with the same pinned clock.
     · rebuild/conform/oracle/port-oracle.cjs check — the frozen gate, invoked as
       a child process. Never edited, never re-implemented, never bypassed.

   THE GATE, AND EXACTLY WHAT IT PROVES. See GATE below for where the command
   came from. port-oracle `check` reads the fixtures pinned in the oracle's own
   manifest and compares the census THIS engine produces against the frozen
   golden. So it certifies the ENGINE that performed this port, over blobs the
   manifest pins by hash — it does not take a migrated state as an argument.
   With the private blob present (rebuild/conform/private/live.json) that is the
   full ten-law gate on three blobs, which is the "10/10" of the module 5 and 6
   acceptances. On a public checkout the private blob is absent and the same
   command runs the PUBLIC part only: seven laws on two fixtures. The script
   prints which of the two it got and refuses to seal unless every law is GREEN
   in BOTH Date modes. */
const fs = require('node:fs');
const path = require('node:path');
const { createHash, createCipheriv, randomBytes, randomInt } = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { createImportPreparation } = require('../../../m4/import/prepare.cjs');
const { counts: censusCounts } = require('../../../conform/oracle/census.cjs');
const { PROFILE, KDF, CIPHER, TAG_BYTES, aadBytes, deriveKey } = require('./unseal.cjs');
const { WORDS } = require('./wordlist.cjs');

/* THE GATE — found in rebuild/m2/BRIEF-5.md §2 ("the real FULL port-oracle
   check is now mandatory"), reproduced verbatim in rebuild/m2/REPORT-M2-5-ASTRA.md
   and accepted in rebuild/DECISIONS.md 2026-09-05 (modules 5 and 6: "port-oracle
   10/10 × 2 modes"). Two fresh Node processes from the repository root, with
   MEASURED_TEST_NOW and TZ pinned exactly as oracle/manifest.json pins them —
   the oracle fails closed if either differs. */
const GATE = Object.freeze({
  clock: '2026-09-03',
  tz: 'America/New_York',
  oracle: 'rebuild/conform/oracle/port-oracle.cjs',
  manifest: 'rebuild/conform/oracle/manifest.json',
  engine: 'rebuild/engine/oracle-shim.cjs',
  preload: './tools/_fixed-now.mjs',
  modes: Object.freeze([Object.freeze(['frozen', true]), Object.freeze(['unfrozen', false])]),
  lawsPublic: 7,
  lawsFull: 10,
});
const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const STRICT_JSON = path.join(REPO, 'rebuild', 'm3', 'w6', 'strict-json.mjs');
const PASSPHRASE_WORDS = 6;
const BUNDLE_PROFILE = PROFILE;

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - String(s).length));
let step = 0;
function say(name, verdict, detail) {
  step += 1;
  console.log(`${step}. ${pad(name, 10)} ${pad(verdict, 4)}  ${detail}`);
}
function note(detail) { console.log(`   ${detail}`); }
class PortError extends Error {
  constructor(message, exitCode) { super(message); this.exitCode = exitCode || 1; }
}

const USAGE = [
  'usage: node rebuild/m3/setup/port/port.cjs --source <path-to-ledger-state.json> --out <dir>',
  '                                           [--local <phone-export.json>] [--engine <path>]',
  '',
  '  --source         the ledger JSON to port (on the real run: ledger/state.json)',
  '  --out            a folder OUTSIDE the repository, outside any git working tree,',
  '                   for the sealed bundle and the passphrase',
  '  --local          optional second ledger to merge in (a phone export)',
  '  --local-inspect  with --local: say what that file is and stop. Writes nothing.',
  '  --local-confirm  with --local: the first 8 characters of the local file\'s sha256,',
  '                   as --local-inspect prints them. Without it a merge will not run.',
  '  --engine         optional engine module (default rebuild/engine/oracle-shim.cjs)',
  '',
  '  exit 0 = sealed bundle written.  exit 2 = a check said no, nothing written.',
].join('\n');

/* Windows: a path may arrive with backslashes, forward slashes, spaces, or
   quotes the shell left on. path.resolve normalises all of it against cwd. */
function parseArgs(argv) {
  const out = { source: null, out: null, local: null, engine: null, confirm: null, inspect: false, help: false };
  const paths = { '--source': 'source', '--out': 'out', '--local': 'local', '--engine': 'engine' };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') { out.help = true; continue; }
    if (arg === '--local-inspect') { out.inspect = true; continue; }
    const key = paths[arg];
    if (!key && arg !== '--local-confirm') throw new PortError(`unknown argument ${arg}\n\n${USAGE}`);
    const value = argv[++i];
    if (value === undefined) throw new PortError(`${arg} needs a value\n\n${USAGE}`);
    const clean = value.trim().replace(/^"(.*)"$/, '$1');
    if (key) out[key] = path.resolve(clean);
    else out.confirm = clean.toLowerCase();
  }
  return out;
}

function readInput(label, file) {
  let stat;
  try { stat = fs.statSync(file); } catch { throw new PortError(`${label} not found: ${file}`); }
  if (!stat.isFile()) throw new PortError(`${label} is not a file: ${file}`);
  return fs.readFileSync(file);
}

/* The gate's own stdout is the one stream in this script that could carry a
   ledger value (for PUBLIC fixtures it prints counts and lift totals; for the
   private blob port-oracle.cjs replaces every detail with a constant). So it is
   captured, reduced to verdict + law id, and NEVER echoed or stored. */
const VERDICT = /^([A-Z_]+(?:\([^)]*\))?)\s{2,}(PORT-\S+)/;
function runGateMode(label, frozen, enginePath) {
  const args = [];
  if (frozen) args.push('--import', GATE.preload);
  args.push(GATE.oracle, 'check', enginePath || GATE.engine, label);
  const res = spawnSync(process.execPath, args, {
    cwd: REPO, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024,
    env: { ...process.env, MEASURED_TEST_NOW: GATE.clock, TZ: GATE.tz },
  });
  if (res.error) throw new PortError('the oracle gate could not be started: ' + res.error.message, 2);
  const rows = [];
  for (const raw of String(res.stdout || '').split(/\r?\n/)) {
    const match = VERDICT.exec(raw);
    if (match) rows.push({ verdict: match[1], id: match[2] });
  }
  const green = rows.filter(r => r.verdict === 'GREEN').length;
  return { status: res.status, rows, green, total: rows.length };
}

/* The gate certifies THE ENGINE THAT DID THIS PORT, so it is handed the same
   engine module --engine selected (the repo's oracle-shim by default). Gating a
   different engine than the one that migrated would prove nothing. */
function runGate(label, enginePath) {
  const modes = [];
  for (const [mode, frozen] of GATE.modes) {
    const run = runGateMode(`${label}-${mode}`, frozen, enginePath);
    modes.push({ mode, ...run });
  }
  const total = modes[0].total;
  const ok = modes.every(m => m.status === 0 && m.total === total && m.green === m.total) &&
    (total === GATE.lawsPublic || total === GATE.lawsFull);
  const scope = total === GATE.lawsFull ? 'FULL (3 blobs: the two public fixtures + the private live blob)'
    : total === GATE.lawsPublic ? 'PUBLIC (2 public fixtures; rebuild/conform/private/live.json is absent)'
      : `UNEXPECTED (${total} laws - neither the 7-law public gate nor the 10-law full gate)`;
  const failed = modes.flatMap(m => m.rows.filter(r => r.verdict !== 'GREEN').map(r => `${m.mode}:${r.verdict} ${r.id}`));
  return { ok, total, scope, modes, failed };
}

/* COUNTS ONLY. recordCounts is the engine's own record census — the same
   function dataLossGuard compares. Printing before → after for every class is
   the HANDOFF 0.17 recipe, and a count is not a value. */
function countsLine(before, after) {
  const keys = [...new Set([...Object.keys(before || {}), ...Object.keys(after || {})])].sort();
  return keys.map(k => `${k} ${(before || {})[k]}->${(after || {})[k]}`).join('  ');
}

function makePassphrase() {
  const picked = [];
  for (let i = 0; i < PASSPHRASE_WORDS; i++) picked.push(WORDS[randomInt(WORDS.length)]);
  return picked.join('-');
}

function seal(payload, passphrase, sourceSha256) {
  const salt = randomBytes(KDF.saltBytes);
  const iv = randomBytes(CIPHER.ivBytes);
  const key = deriveKey(passphrase, salt);
  const cipher = createCipheriv('aes-256-gcm', key, iv, { authTagLength: TAG_BYTES });
  cipher.setAAD(aadBytes(sourceSha256));
  const body = Buffer.concat([cipher.update(Buffer.from(JSON.stringify(payload), 'utf8')), cipher.final()]);
  return {
    profile: BUNDLE_PROFILE,
    sealedAt: new Date().toISOString(),
    kdf: { name: KDF.name, hash: KDF.hash, iterations: KDF.iterations, salt: salt.toString('base64') },
    cipher: { name: CIPHER.name, keyBits: CIPHER.keyBits, ivBytes: CIPHER.ivBytes, tagBits: CIPHER.tagBits, iv: iv.toString('base64') },
    aad: [BUNDLE_PROFILE, sourceSha256],
    ciphertext: Buffer.concat([body, cipher.getAuthTag()]).toString('base64'),
  };
}

/* mode 600 where the OS honours it. On Windows the bits are advisory, so the
   script says where the file is and tells Joe to delete it — it never claims a
   permission it did not get. */
function writePrivate(file, text) {
  if (fs.existsSync(file)) throw new PortError(`refusing to overwrite ${file}`);
  fs.writeFileSync(file, text, { mode: 0o600 });
  let restricted = false;
  try { fs.chmodSync(file, 0o600); restricted = (fs.statSync(file).mode & 0o077) === 0; } catch { restricted = false; }
  return restricted;
}

/* The engine is a directory of modules, not one file, so the bundle records
   both: the entry file's hash and a hash over every .cjs beside it. */
function engineDigest(file) {
  const dir = path.dirname(file);
  const names = fs.readdirSync(dir).filter(n => n.endsWith('.cjs')).sort();
  const lines = names.map(n => `${n} ${sha256(fs.readFileSync(path.join(dir, n)))}`);
  return { sha256: sha256(fs.readFileSync(file)), treeSha256: sha256(lines.join('\n')), files: names.length };
}

/* Public information only: the oracle manifest pins each gated blob by hash, so
   a source whose hash is one of them was itself inside the gate that just ran. */
function manifestPin(sourceSha256) {
  try {
    const man = JSON.parse(fs.readFileSync(path.join(REPO, GATE.manifest), 'utf8'));
    for (const [key, golden] of Object.entries(man.goldens || {})) {
      if (golden && golden.blobSha256 === sourceSha256) return key;
    }
  } catch { /* a missing manifest is the gate's problem, and it fails closed */ }
  return null;
}

/* --- WHERE THE BUNDLE MAY NOT GO -------------------------------------------
   The first version of this guard compared path.resolve() strings. The reviewer
   walked through it twice on Windows — once through a directory junction
   (mklink /J, no admin), once through an 8.3 short name (DOCUME~1) — and landed
   the sealed bundle AND the plaintext passphrase inside the tracked worktree of
   a PUBLIC repository. path.resolve normalises "." and separators; it resolves
   neither reparse points nor short names. fs.realpathSync.native does both.

   So: realpath everything first, then refuse three ways over — this worktree,
   ANY git working tree (a linked worktree's root carries a .git FILE, not a
   directory, and a junction lands inside some other checkout just as easily),
   and any path with a `rebuild` segment in it. Over-refusing costs Joe one
   retry with a different folder. Under-refusing publishes his ledger. */
function realPathOf(target) {
  // --out usually does not exist yet, so realpath the nearest ancestor that does.
  let probe = path.resolve(target);
  const tail = [];
  while (!fs.existsSync(probe)) {
    const parent = path.dirname(probe);
    if (parent === probe) return probe;
    tail.unshift(path.basename(probe));
    probe = parent;
  }
  let real;
  try { real = fs.realpathSync.native(probe); } catch { real = probe; }
  return tail.length ? path.resolve(real, ...tail) : real;
}
const REPO_REAL = realPathOf(REPO);

function contains(parent, child) {
  const rel = path.relative(parent, child);   // win32 path.relative is case-insensitive
  return rel === '' || (!rel.startsWith('..' + path.sep) && rel !== '..' && !path.isAbsolute(rel));
}

function insideRepo(dir) { return contains(REPO_REAL, realPathOf(dir)); }

/* A .git entry — directory (a normal clone) or file (a linked worktree) — marks
   a working tree whose `git add` could sweep the bundle up. */
function gitWorkingTreeAt(dir) {
  let probe = dir;
  for (;;) {
    if (fs.existsSync(path.join(probe, '.git'))) return probe;
    const parent = path.dirname(probe);
    if (parent === probe) return null;
    probe = parent;
  }
}

function outRefusal(dir) {
  const real = realPathOf(dir);
  if (contains(REPO_REAL, real)) return `inside this repository (${real})`;
  const tree = gitWorkingTreeAt(real);
  if (tree) return `inside a git working tree (${tree}) - a commit there could publish it`;
  if (real.split(path.sep).includes('rebuild')) return `inside a folder called "rebuild" (${real})`;
  return null;
}

function localDate() {
  const now = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

/* --- THE STATE-LEVEL COUNTS CHECK ------------------------------------------
   dataLossGuard protects what it protects, and it was measured NOT to cover
   exercises, queue, earned, debuts or events: drop all 18 queue entries and it
   still answers {safe:true, lost:[]}. The port-oracle's counts law does cover
   them — but the oracle only ever censuses the blobs pinned on disk, which on
   the real run is a September snapshot, not the ledger being ported.

   So this runs the oracle's OWN counts() (a public export of
   rebuild/conform/oracle/census.cjs, called, never re-implemented) on the source
   state and on the migrated state, and refuses to seal if any guarded class came
   out smaller. It is a DECREASE rule, not the oracle's equality rule, because
   migration legitimately mints queue entries and EARNED feed lines. `sets` is
   printed but not gated: the oracle allows a decrease there for filed attested
   strikes, and dataLossGuard's D33 clause already refuses an undeclared one. */
const GUARDED = Object.freeze(['reads', 'nights', 'dailyLogs', 'sessionLog',
  'exercises', 'queue', 'earned', 'debuts', 'events', 'waist']);
const SHOWN = Object.freeze([...GUARDED, 'sets', 'feed', 'pendingDebuts', 'volume']);

function countsCheck(label, before, after) {
  const shrank = GUARDED.filter(k => (after[k] || 0) < (before[k] || 0))
    .map(k => `${k} ${before[k]}->${after[k]}`);
  return { label, before, after, shrank };
}
function censusLine(before, after) {
  return SHOWN.map(k => `${k} ${before[k]}->${after[k]}`).join('  ');
}

/* --- IS THIS --local THE SAME LEDGER? --------------------------------------
   HONEST LIMIT: the state carries no athlete, owner, install or device
   identity — there is nothing to key on, and the two public fixtures differ by
   less than two ledgers of the same man would. So this is a RELATEDNESS
   heuristic, not an identity check: it catches the realistic accident (Joe
   picks the wrong export and the ledger silently doubles into a fictional
   history) and it cannot detect a different athlete in principle. */
function relatedness(source, local, schemaV) {
  const key = r => (r && r.d !== undefined && r.w !== undefined) ? `${r.d}|${r.w}` : null;
  const mine = new Set((source.reads || []).map(key).filter(Boolean));
  const shared = new Set((local.reads || []).map(key).filter(Boolean).filter(k => mine.has(k)));
  // Same schema lineage: at or ahead of the source, never past what we can migrate.
  const lineage = Number.isSafeInteger(local.v) && local.v >= source.v && local.v <= schemaV;
  return { shared: shared.size, lineage, related: shared.size >= 1 && lineage };
}

async function run(argv) {
  const opts = parseArgs(argv);
  if (opts.help || (!opts.source && !opts.out)) { console.log(USAGE); return 0; }
  if (!opts.source) throw new PortError(`--source is required\n\n${USAGE}`);
  if (!opts.local && (opts.inspect || opts.confirm)) throw new PortError('--local-inspect and --local-confirm need --local');
  if (!opts.out && !opts.inspect) throw new PortError(`--out is required\n\n${USAGE}`);
  const refusal = opts.out ? outRefusal(opts.out) : null;
  if (refusal) throw new PortError(`--out is ${refusal}.\nPick a plain folder such as your Desktop or Documents. Nothing was written.`);
  // The oracle's manifest pins these exactly; anything else fails the gate closed.
  for (const [name, want] of [['MEASURED_TEST_NOW', GATE.clock], ['TZ', GATE.tz]]) {
    if (process.env[name] && process.env[name] !== want) {
      throw new PortError(`${name} is ${process.env[name]} but the gate is pinned to ${want}`);
    }
    process.env[name] = want;
  }
  const enginePath = opts.engine || path.join(REPO, GATE.engine);
  const engineModule = require(enginePath);
  const engine = engineModule && engineModule.__test ? engineModule.__test : engineModule;
  const { parseStrictJson } = await import(pathToFileURL(STRICT_JSON).href);

  // a. the source bytes, hashed before anything touches them
  const sourceBytes = readInput('--source', opts.source);
  const sourceSha256 = sha256(sourceBytes);
  say('SOURCE', 'PASS', `${opts.source}  sha256=${sourceSha256}  bytes=${sourceBytes.length}`);
  let localBytes, localSha256, localRelated = null;
  if (opts.local) {
    localBytes = readInput('--local', opts.local);
    localSha256 = sha256(localBytes);
    const first8 = localSha256.slice(0, 8);
    const parsed = raw => { try { return parseStrictJson(Buffer.from(raw)); } catch { return null; } };
    const sourceHead = parsed(sourceBytes), localHead = parsed(localBytes);
    const shaped = s => s && typeof s === 'object' && !Array.isArray(s) && Number.isSafeInteger(s.v);
    if (!shaped(sourceHead) || !shaped(localHead)) {
      say('LOCAL', 'FAIL', 'LOCAL_UNREADABLE  (not strict JSON, or no schema version)');
      return 2;
    }
    localRelated = relatedness(sourceHead, localHead, engine.SCHEMA_V);
    say('LOCAL', localRelated.related ? 'PASS' : 'FAIL', `${opts.local}  sha256=${localSha256}  bytes=${localBytes.length}`);
    note(`schema ${localHead.v} (source ${sourceHead.v}, engine ${engine.SCHEMA_V})  lineage=${localRelated.lineage}  ` +
      `readings this file has in common with the source: ${localRelated.shared}`);
    if (opts.inspect) {
      note(localRelated.related
        ? `This looks like the same ledger. To merge it, run again with  --local-confirm ${first8}`
        : 'LOCAL_UNRELATED  This does NOT look like the same ledger: no reading (same date AND same weight) is in both files.');
      note('Nothing was written - --local-inspect only looks.');
      return localRelated.related ? 0 : 2;
    }
    if (!localRelated.related) {
      note('LOCAL_UNRELATED  No reading (same date AND same weight) is in both files' +
        (localRelated.lineage ? '.' : ', and its schema is not in the source\'s lineage.'));
      note('Merging it would invent a history that never happened. Nothing was written.');
      note('Run again with --local-inspect to see what that file is.');
      return 2;
    }
    if (opts.confirm !== first8) {
      say('CONFIRM', 'FAIL', opts.confirm ? '--local-confirm does not match this file' : '--local-confirm is required before a merge');
      note('Run again with --local-inspect to see what that file is and what to confirm. Nothing was written.');
      return 2;
    }
  }

  // b. prepare: migrate (and merge) through the accepted module, guard included
  const preparation = createImportPreparation({ engine, parseStrictJson });
  let prepared;
  try {
    prepared = preparation.prepare(sourceBytes, localBytes ? { localBytes } : undefined);
  } catch (error) {
    // prepare.cjs already reduces every engine fault to a fixed code with no
    // athlete facts in it. Printing anything richer would undo that.
    say('PREPARE', 'FAIL', `${error && error.code ? error.code : 'IMPORT_MIGRATION_FAILED'}  (nothing written)`);
    return 2;
  }
  const summary = prepared.summary;
  const sourceState = prepared.sourceState();
  const candidateState = prepared.candidateState();
  const candidateBytes = prepared.candidateBytes();
  const before = engine.recordCounts(sourceState);
  const after = engine.recordCounts(candidateState);
  const guard = engine.dataLossGuard(sourceState, candidateState);
  say('PREPARE', 'PASS', `schema ${summary.source_schema}->${summary.candidate_schema}  ` +
    `migrated sha256=${summary.candidate_sha256}  bytes=${candidateBytes.length}`);
  note(`counts  ${countsLine(before, after)}`);
  note(`dataLossGuard  safe=${guard.safe}  lost=${guard.lost.length}  (prepare re-ran it against every preimage)`);
  if (guard.safe !== true || guard.lost.length !== 0) {
    say('GUARD', 'FAIL', `${guard.lost.length} lost record classes (nothing written)`);
    return 2;
  }

  // b2. the oracle's own counts(), applied to THESE states — the classes
  //     dataLossGuard does not cover (exercises, queue, earned, debuts, events)
  const migratedCounts = censusCounts(candidateState);
  const checks = [countsCheck('source', censusCounts(sourceState), migratedCounts)];
  if (localBytes) checks.push(countsCheck('local', censusCounts(prepared.localState()), migratedCounts));
  const shrank = checks.filter(c => c.shrank.length);
  say('COUNTS', shrank.length ? 'FAIL' : 'PASS',
    `census counts(), ${GUARDED.length} guarded classes, ${checks.length === 1 ? 'source' : 'source and local'} -> migrated`);
  for (const check of checks) note(`${check.label}  ${censusLine(check.before, check.after)}`);
  if (shrank.length) {
    for (const check of shrank) note(`SHRANK (${check.label}): ${check.shrank.join('  ')}`);
    note('A record class came out smaller than it went in. NO BUNDLE WRITTEN.');
    return 2;
  }

  // c. the frozen port-oracle gate, both Date modes, all laws GREEN or nothing
  const label = 'c2-port-' + localDate();
  const gateEngine = insideRepo(enginePath) ? path.relative(REPO, enginePath).split(path.sep).join('/') : enginePath;
  const gate = runGate(label, gateEngine);
  const digest = engineDigest(enginePath);
  const pin = manifestPin(sourceSha256);
  const gateDetail = gate.modes.map(m => `${m.mode} ${m.green}/${m.total}`).join('  ');
  if (!gate.ok) {
    say('ORACLE', 'FAIL', `${gateDetail}  scope ${gate.scope}`);
    for (const bad of gate.failed) note(`not GREEN: ${bad}`);
    note('NO BUNDLE WRITTEN. The gate is the frozen one; fix the engine, not the gate.');
    return 2;
  }
  say('ORACLE', 'PASS', `${gateDetail}  scope ${gate.scope}`);
  note(`gate  node [--import ${GATE.preload}] ${GATE.oracle} check ${gateEngine} <label>  ` +
    `(cwd ${REPO}, MEASURED_TEST_NOW=${GATE.clock} TZ=${GATE.tz})`);
  note(`engine  ${enginePath}  sha256=${digest.sha256}  tree(${digest.files} modules)=${digest.treeSha256}`);
  note(`source pinned by the oracle manifest: ${pin || "no - this source is not one of the gate's pinned blobs"}`);
  const oracle = {
    verdict: 'PASS',
    gate: {
      command: `node [--import ${GATE.preload}] ${GATE.oracle} check ${gateEngine} <label>`,
      cwd: REPO, clock: GATE.clock, tz: GATE.tz, scope: gate.scope, laws: gate.total,
      modes: gate.modes.map(m => ({ mode: m.mode, green: m.green, total: m.total })),
      manifestPin: pin,
      foundIn: 'rebuild/m2/BRIEF-5.md §2 · rebuild/m2/REPORT-M2-5-ASTRA.md · rebuild/DECISIONS.md 2026-09-05',
    },
  };

  // d. seal
  const payload = {
    profile: BUNDLE_PROFILE,
    createdAt: new Date().toISOString(),
    engine: { sha256: digest.sha256, treeSha256: digest.treeSha256, schemaV: engine.SCHEMA_V, path: path.relative(REPO, enginePath).split(path.sep).join('/') },
    source: { sha256: sourceSha256, bytes: sourceBytes.toString('base64') },
    migrated: { sha256: summary.candidate_sha256, state: candidateState },
    oracle,
    dataLoss: { safe: guard.safe, lost: guard.lost.length, before, after },
    census: {
      source: 'rebuild/conform/oracle/census.cjs counts()',
      guarded: [...GUARDED],
      rule: 'no guarded class may come out smaller',
      counts: Object.fromEntries(checks.map(c => [c.label, c.before]).concat([['migrated', migratedCounts]])),
    },
  };
  if (localBytes) {
    payload.local = { sha256: localSha256, bytes: localBytes.toString('base64') };
    payload.local.relatedness = { ...localRelated, note: 'relatedness heuristic - the state carries no athlete identity' };
  }
  const passphrase = makePassphrase();
  const envelope = seal(payload, passphrase, sourceSha256);
  const bundleText = JSON.stringify(envelope, null, 1) + '\n';
  say('SEAL', 'PASS', `${KDF.name}-${KDF.hash} ${KDF.iterations} iterations -> ${CIPHER.name}-${CIPHER.keyBits}  ` +
    `${PASSPHRASE_WORDS} words out of ${WORDS.length}  sealed bytes=${bundleText.length}`);

  // e. write. The folder is checked AGAIN once it exists: only then can its own
  //    realpath be read rather than its nearest existing ancestor's.
  fs.mkdirSync(opts.out, { recursive: true });
  const secondLook = outRefusal(opts.out);
  if (secondLook) {
    try { fs.rmdirSync(opts.out); } catch { /* not empty, or not ours - leave it */ }
    throw new PortError(`--out is ${secondLook}.\nNothing was written.`);
  }
  const stampedDate = localDate();
  const bundleFile = path.join(opts.out, `earned-port-${stampedDate}.json`);
  const passFile = path.join(opts.out, `earned-port-${stampedDate}-PASSPHRASE.txt`);
  if (fs.existsSync(bundleFile)) throw new PortError(`refusing to overwrite ${bundleFile}`);
  if (fs.existsSync(passFile)) throw new PortError(`refusing to overwrite ${passFile}`);
  const restricted = writePrivate(passFile, passphrase + '\n');
  // A passphrase with no bundle is litter; a bundle with no passphrase is a
  // brick. If the second write fails, take the first one back out.
  try { fs.writeFileSync(bundleFile, bundleText); }
  catch (error) { fs.rmSync(passFile, { force: true }); throw error; }
  say('WRITE', 'PASS', `${bundleFile}  sha256=${sha256(Buffer.from(bundleText, 'utf8'))}`);
  note(`passphrase file  ${passFile}  ${restricted ? '(owner-only)' : '(this OS does not enforce file modes - it is on your PC and only your PC)'}`);
  printNextSteps(bundleFile, passFile);
  return 0;
}

function printNextSteps(bundleFile, passFile) {
  console.log([
    '',
    'WHAT TO DO NEXT',
    '  1. The bundle is the ONE file to move to your phone:',
    '       ' + bundleFile,
    '     It is sealed, so the route does not matter: iCloud Drive, OneDrive, AirDrop,',
    '     or e-mail it to yourself. Anyone who gets the file without the passphrase has',
    '     a block of noise.',
    '  2. The passphrase stays HERE, on this PC:',
    '       ' + passFile,
    '     Open it when the phone asks for the words. Do not put it in the same place as',
    '     the bundle, and do not type it into anything except the import screen.',
    '  3. On the phone, open Earned, choose IMPORT, pick the bundle, type the six words.',
    '  4. When the phone says the import is in, delete BOTH files: the bundle from the',
    '     phone and from wherever you posted it, and the passphrase file from this PC.',
    '     Your ledger is untouched: this script only ever read it.',
    '',
  ].join('\n'));
}

if (require.main === module) {
  run(process.argv.slice(2)).then(code => { process.exitCode = code; }).catch(error => {
    console.log(`PORT FAILED  ${error && error.message ? error.message : String(error)}`);
    process.exitCode = error && error.exitCode ? error.exitCode : 1;
  });
}

module.exports = { run, GATE, REPO, REPO_REAL, USAGE, makePassphrase, seal, runGate, engineDigest,
  PASSPHRASE_WORDS, realPathOf, outRefusal, insideRepo, relatedness, GUARDED };
