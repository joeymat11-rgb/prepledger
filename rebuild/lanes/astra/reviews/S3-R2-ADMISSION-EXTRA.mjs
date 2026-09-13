// Independent public reviewer probe, authored without executing the candidate.
// Exact candidate 0df6ad3f3ec8d69a6e10ba68c279b7b77d061596;
// exact source 946c36059a7ce6b949933da3904db3db8e6b8bd3.
// Run only by the root reviewer against its verified, freshly installed copied
// S3_SCRATCH tree. This file does not alter any candidate source or loader.
// All facts, identities, queue entries and producer mapping below are invented.
// This is neither actual C2 provenance nor native/final-source admission.
import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, realpathSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {createHash, webcrypto} from 'node:crypto';

const MANIFEST = 'rebuild/m4/spec/s3-portable-sources.json';
const MANIFEST_SHA256 = '5e5266c253a36304543757a360b74bd0567134dd64da03aae09bf4fe38e6fbee';
const sha = value => createHash('sha256').update(value).digest('hex');
const samePath = (a,b) => process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
const inside = (parent,child) => {
  const relative = path.relative(parent,child);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep));
};
assert.equal(process.versions.node, '22.23.2', 'EXTRA_SETUP: exact owned Node version');
assert.equal(process.env.TZ, 'America/New_York', 'EXTRA_SETUP: explicit calendar realm');
assert.equal(Intl.DateTimeFormat().resolvedOptions().timeZone, 'America/New_York');
for (const name of ['NODE_OPTIONS','NODE_PATH','NODE_V8_COVERAGE'])
  assert.ok(!process.env[name], 'EXTRA_SETUP: no injection: ' + name);
assert.equal(process.env.S3_MUTATION, undefined, 'EXTRA_SETUP: unmodified candidate');
assert.ok(process.env.S3_SCRATCH, 'EXTRA_SETUP: copied tree required');
const root = path.resolve(process.env.S3_SCRATCH);
assert.equal(path.basename(root), 'tree', 'EXTRA_SETUP: copied tree basename');
assert.ok(samePath(realpathSync.native(root), root), 'EXTRA_SETUP: real owned root');
function verifySources() {
  const manifestPath = path.join(root, MANIFEST);
  assert.ok(samePath(realpathSync.native(manifestPath), manifestPath));
  const bytes = readFileSync(manifestPath);
  assert.equal(sha(bytes), MANIFEST_SHA256, 'EXTRA_SETUP: fixed successor manifest');
  const manifest = JSON.parse(bytes.toString('utf8'));
  assert.equal(manifest.profile, 'earned/s3-provisional-public-sources/v1');
  assert.equal(manifest.phase, 'portable-core-candidate');
  assert.equal(manifest.sourceM, '100820aa47a4f8729642033499eaec0f0ee282e1');
  assert.equal(manifest.implementationParent, '06c5b4a5d76c9973849d0f4cde51b379bc35be43');
  assert.equal(manifest.sources.length, 111, 'EXTRA_SETUP: full public inventory');
  const names = new Set();
  for (const entry of manifest.sources) {
    assert.equal(typeof entry.path, 'string');
    assert.ok(!entry.path.includes('\\') && !path.posix.isAbsolute(entry.path) && path.posix.normalize(entry.path) === entry.path);
    assert.ok(!names.has(entry.path));
    names.add(entry.path);
    const file = path.resolve(root, entry.path);
    assert.ok(inside(root,file) && samePath(realpathSync.native(file),file), 'EXTRA_SETUP: no source escape: ' + entry.path);
    assert.equal(sha(readFileSync(file)),entry.sha256,'EXTRA_SETUP: pinned source: ' + entry.path);
  }
  return names;
}
const sources = verifySources();
after(() => verifySources());
const candidateImport = name => {
  assert.ok(sources.has(name),'EXTRA_SETUP: named direct public import');
  return import(pathToFileURL(path.join(root,name)).href);
};

// Every candidate import follows the complete, independently fixed 111-source
// pre-import check above. The root reviewer separately inspects this closure.
const {fixtureSetup,fixtureState,fixtureClock,fixtureEffective,fixtureBytes} = await candidateImport('rebuild/m4/import/test/s3/fixtures.mjs');
const {openRepository} = await candidateImport('rebuild/m3/w6/repository.mjs');
const {openLocalKeys} = await candidateImport('rebuild/m3/w6/local/local-keys.mjs');
const {createLocalEra,readLocalEra} = await candidateImport('rebuild/m3/w6/local/local-era.mjs');
const {createLocalSourceController} = await candidateImport('rebuild/m3/w6/local/source-admission.mjs');
const {createSourcePlatform} = await candidateImport('rebuild/m3/w6/local/source-platform.mjs');
const {createBrowserReplay} = await candidateImport('rebuild/m4/import/browser-replay.mjs');
const {default:Profile} = await candidateImport('rebuild/m4/import/local-source-profile.cjs');
const {default:Ops} = await candidateImport('rebuild/client/ops.cjs');
const {default:Setup} = await candidateImport('rebuild/m3/w7-preview/today/setup-commands.mjs');
const {createCleanInitState} = await candidateImport('rebuild/m3/w7-preview/today/setup-model.mjs');
const {parseStrictJson} = await candidateImport('rebuild/m3/w6/strict-json.mjs');
const {default:Capture} = await candidateImport('rebuild/m4/workout/capture.cjs');
const {default:EngineCapture} = await candidateImport('rebuild/m4/workout/engine-capture.cjs');
const {default:Commands} = await candidateImport('rebuild/m4/workout/commands.cjs');
const {default:Runtime} = await candidateImport('rebuild/m4/workout/engine-runtime.cjs');
const {default:SyntheticEngine} = await candidateImport('rebuild/m4/import/test/s3/engine.cjs');
const resolver = createRequire(path.join(root,'rebuild/m3/w6/package.json'));
const idbFile = resolver.resolve('fake-indexeddb');
assert.ok(inside(root,realpathSync.native(idbFile)) && idbFile.split(path.sep).includes('node_modules'), 'EXTRA_SETUP: own copied installed dependency');
const idbModule = await import(pathToFileURL(idbFile).href);
const IDBFactory = idbModule.IDBFactory ?? idbModule.default?.IDBFactory;
assert.equal(typeof IDBFactory,'function');

const PROVENANCE = 'earned/s3-reviewer-public-invented-hack/v1';
const SOURCE_DAY = '2026-09-03', START_DAY = '2026-09-05';
let number = 0;
async function makeFixture(t,pending) {
  const indexedDB = new IDBFactory(), crypto = webcrypto;
  const databaseName = 's3-independent-r2-hack-' + (++number);
  const namespace = 'TEST-ONLY-r2-hack/athlete/device';
  const athleteId = 'TEST-ONLY-r2-hack-athlete', deviceId = 'TEST-ONLY-r2-hack-device';
  const name = 'TEST-ONLY-r2-hack-source', platform = createSourcePlatform();

  // Change the public setup BEFORE constructing the source or creating any
  // authenticated operation/checkpoint. Nothing rewrites an existing original.
  const setup = fixtureSetup(), declared = setup.exercises.find(e => e.day === 'L');
  assert.ok(declared, 'EXTRA_SETUP: the public setup has a lower-day exercise');
  declared.id = 'hack'; declared.n = 'TEST-ONLY hack squat';
  const source = structuredClone(createCleanInitState({setup})), publicHistory = fixtureState(SOURCE_DAY);
  for (const key of ['model','trend','reads','dailyLogs','sleep']) source[key] = structuredClone(publicHistory[key]);
  source.sessionLog = {};
  const hack = source.exercises.find(e => e.id === 'hack');
  hack.w = hack.steps[0];
  source.queue = pending ? [{id:'TEST-ONLY-hack-debut',kind:'debut',exId:'hack',newW:hack.steps[1],done:false,state:'READY',t:'TEST-ONLY recorded debut'}] : [];
  const sourceBytes = fixtureBytes(source);
  // This follows the licensed public fixture's preparation construction. Actual
  // qualification must independently reproduce those bytes through the real
  // production provider; the synthetic engine is never given to the controller.
  const preparation = createBrowserReplay({platform}).createImportPreparation({
    engine:SyntheticEngine.createEngine({clock:fixtureClock(SOURCE_DAY)}),parseStrictJson
  }).prepare(sourceBytes);
  const candidateBytes = preparation.candidateBytes();
  assert.equal(preparation.candidateState().queue.some(q => q.exId === 'hack' && !q.done && q.state !== 'PROPOSED'), pending, 'EXTRA_SETUP: the tested queued branch survives genuine preparation');

  const engine = {sha256:Profile.SOURCE_PINS['rebuild/engine/oracle-shim.cjs'],treeSha256:'b'.repeat(64),schemaV:60,path:'rebuild/engine/oracle-shim.cjs'};
  const gate = {clock:SOURCE_DAY,tz:'America/New_York',scope:'TEST-ONLY public synthetic mapping; no C2 execution'};
  const engineContextJson = JSON.stringify({profile:'earned/local-import/v1',engine,oracle:{gate}});
  const raw = {source_json:platform.text(sourceBytes),candidate_json:platform.text(candidateBytes),local_json:null,engine_context_json:engineContextJson};
  const materialDigest = Profile.digest(platform.hash,'earned/local-source-material/v1',raw);
  const dates = ['2026-01-15','2026-03-07','2026-03-09',SOURCE_DAY,START_DAY,'2026-11-02'].map(day => {
    const d = new Date(fixtureClock(day).nowMs());
    return {day,noonISO:d.toISOString(),offsetMinutes:d.getTimezoneOffset()};
  });
  const mapping = {profile:'earned/source-producer-mapping/v1',construction:'oracle-shim-default/v1',id:'TEST-ONLY-independent-hack',engine,gate:{clock:gate.clock,tz:gate.tz},
    public_factory_digest:Profile.PUBLIC_FACTORY_DIGEST,source_pins:Profile.SOURCE_PINS,
    executions:[{id:'TEST-ONLY-public-no-C2',material_digest:materialDigest,calendar:{profile:'earned/native-date-compatibility/v1',compatibility_id:'TEST-ONLY-2026-calendar',zone:gate.tz,range:{from:'2026-01-01',to:'2026-12-31'},dates}}],dependencies:{drafts:'default-empty'}};
  const registry = Profile.createProducerRegistry([mapping],{hash:platform.hash});
  const keys = await openLocalKeys({indexedDB,crypto,databaseName});
  t.after(() => keys.close());
  await keys.generate();
  const repository = await openRepository({indexedDB,crypto,databaseName,namespace,keyProvider:keys.keyProvider,authorizeEnrollment:e => e === PROVENANCE});
  t.after(() => repository.close());
  const era = createLocalEra({crypto,athleteId,deviceId,enrolledAt:'2026-09-03T00:00:00.000Z'});
  const tags = Object.fromEntries(setup.exercises.map(e => [e.id,{head:null,secondary:[]}]));
  const setupAction = Setup.prepare({action:Setup.ACTION,input:{setup,tags,effective:fixtureEffective(SOURCE_DAY)}});
  const setupOp = Ops.build({...setupAction,op_id:'TEST-ONLY-r2-setup',athlete_id:athleteId,device_id:deviceId,device_seq:1,predecessor:null,parents:[],lease_id:era.lease.lease_id,schema_version:2},era.identityKey);
  assert.equal(Setup.validate(setupOp,() => undefined),true,'EXTRA_SETUP: actual matching setup producer validates');
  const generation = {collections:{ops:{[setupOp.op_id]:setupOp},outbox:{[setupOp.op_id]:{op_id:setupOp.op_id}},dispositions:{},rejected:{},receipts:{},sync:{frontier:{W:0,authorityW:0}},derived:{}},metadata:{namespace,localEra:era,imports:[]}};
  await repository.initialize(generation,PROVENANCE);
  await keys.persist(await keys.keyProvider());
  const loaded = await repository.load();
  const custody = repository.importCustody({parseStrictJson,validateContext:() => null});
  await custody.stage(name,loaded,{sourceBytes,candidateBytes,localBytes:null,engineContextJson});
  const next = structuredClone(loaded.generation);
  next.metadata.imports.push({name,sourceSha256:platform.hash(sourceBytes),migratedSha256:platform.hash(candidateBytes),localSha256:null,engineSha256:engine.sha256,schemaV:60,rebaseRequired:true,createdAt:'2026-09-05T12:00:00.000Z'});
  await repository.commit(loaded,next,() => null);
  const controller = createLocalSourceController({repository,namespace,athleteId,deviceId,producerRegistry:registry,asOf:START_DAY,platform});
  t.after(() => controller.close());
  return {repository,controller,custody,name,platform,source,sourceBytes,candidateBytes,athleteId,deviceId,pending};
}

async function appendOriginalCapture(f) {
  const loaded = await f.repository.load(), generation = structuredClone(loaded.generation), era = readLocalEra(generation.metadata);
  const captureReader = Capture.createPrescriptionCapture({parseStrictJson});
  const runtime = Runtime.createEngineRuntime({clock:fixtureClock(START_DAY)});
  const producer = {app_build:'TEST-ONLY-r2-review',engine_build:'TEST-ONLY-public-runtime',rule_profile:EngineCapture.PROFILE,source_schema:'TEST-ONLY-invented-state/v1'};
  const basis = {plan_basis:'TEST-ONLY-matching-programme',input_basis:f.platform.hash(JSON.stringify({state:f.source,ops:generation.collections.ops})),source_revision:loaded.revision};
  const sleep = {last:{h:8}};
  const sourceBefore = sha(JSON.stringify(f.source));
  // The ACTUAL signature is prepare({state,day,sleep,basis,...}); sleep is an
  // original explicit public input to the real producer, never a product patch.
  const prepared = EngineCapture.createEngineWorkoutCapture({engine:runtime,prescriptionCapture:captureReader,producerIdentity:producer}).prepare({state:f.source,day:START_DAY,sleep,basis});
  assert.equal(sha(JSON.stringify(f.source)),sourceBefore,'EXTRA_SETUP: capture reader preserves source');
  assert.deepEqual([...new Set(prepared.capture.slots.map(s => s.lift_lineage_id))],['hack'],'EXTRA_SETUP: complete original lower-day membership');
  const commands = Commands.createWorkoutCommands({prescriptionCapture:captureReader});
  const add = (action,input) => {
    const rows = Object.values(generation.collections.ops).sort((a,b) => a.device_seq - b.device_seq), previous = rows.at(-1)?.op_id ?? null, seq = rows.length + 1;
    const request = commands.prepare({action,input:{...input,effective:fixtureEffective(START_DAY,10),causal_parents:previous ? [previous] : []}});
    const op = Ops.build({...request,op_id:'TEST-ONLY-r2-workout-' + seq,athlete_id:f.athleteId,device_id:f.deviceId,device_seq:seq,predecessor:previous,lease_id:era.lease.lease_id,schema_version:2},era.identityKey);
    assert.equal(commands.validate(op,id => generation.collections.ops[id]),true,'EXTRA_SETUP: real workout command validates');
    generation.collections.ops[op.op_id] = op;
    generation.collections.outbox[op.op_id] = {op_id:op.op_id};
    return op;
  };
  const start = add('start',{planned_split_slot_id:'TEST-ONLY-Saturday-L',plan_basis:basis.plan_basis,prescription_capture:prepared.capture});
  for (const slot of prepared.layout.slots) add('set',{session_start_op_id:start.op_id,logical_set_slot:slot.logical_set_slot,lift_lineage_id:slot.lift_lineage_id,
    load:{value:f.pending ? f.source.exercises.find(e => e.id === 'hack').steps[1] : f.source.exercises.find(e => e.id === 'hack').steps[0],unit:'lb'},
    reps:{value:8,unit:'rep'},reserve:{tag:'exact',value:2,unit:'rep'}});
  add('close',{session_start_op_id:start.op_id,completion_kind:'normal'});
  await f.repository.commit(loaded,generation,() => null);
  return {startId:start.op_id,capture:prepared.capture};
}

async function expectQualified(t,pending) {
  const f = await makeFixture(t,pending);
  const beforeCapture = await f.custody.load(f.name);
  const held = await appendOriginalCapture(f);
  const before = await f.repository.load(), beforeHash = sha(JSON.stringify(before.generation));
  const materialBefore = {source:sha(beforeCapture.sourceBytes),candidate:sha(beforeCapture.candidateBytes),checkpoint:sha(JSON.stringify(beforeCapture.checkpoint))};
  const review = await f.controller.reviewSource(f.name);
  const result = await f.controller.prepareSource(review,{identityConfirmed:true,prefixAnswer:true});
  const view = result?.profile === 'earned/local-source-qualification/v1' ? await f.controller.view(result) : result;
  const afterMaterial = await f.custody.load(f.name);
  assert.equal(sha(JSON.stringify((await f.repository.load()).generation)),beforeHash,'EXTRA_PRESERVE: no durable write during qualification');
  assert.equal(sha(afterMaterial.sourceBytes),materialBefore.source,'EXTRA_PRESERVE: immutable source bytes');
  assert.equal(sha(afterMaterial.candidateBytes),materialBefore.candidate,'EXTRA_PRESERVE: immutable candidate bytes');
  assert.equal(sha(JSON.stringify(afterMaterial.checkpoint)),materialBefore.checkpoint,'EXTRA_PRESERVE: original checkpoint');
  t.diagnostic(JSON.stringify({pending,ready:view?.ready ?? null,pending_application:view?.pending ?? null,issues:(view?.issues ?? []).map(x => x.code)}));
  assert.equal(view?.ready,true,'R2_HACK_QUALIFIED: complete matching original capture must retain supported qualification');
  assert.deepEqual(view.workout_facts.sessions.map(x => x.start_op_id),[held.startId]);
  assert.equal(sha(JSON.stringify(view.workout_facts.sessions[0].capture)),sha(JSON.stringify(held.capture)),'EXTRA_PRESERVE: exact original capture');
}
test('R2-ADMISSION-HACK-CONTROL: matching source/setup and real capture without pending debut qualifies', async t => expectQualified(t,false));
test('R2-ADMISSION-HACK-PENDING: matching source/setup and real capture with explicit sleep and pending debut qualifies', async t => expectQualified(t,true));
