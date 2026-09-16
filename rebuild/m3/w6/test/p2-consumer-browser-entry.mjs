// P2 S3 IMPORT JOIN - the page-realm half of the Edge witness. Everything here
// runs inside a REAL browser: real IndexedDB, real WebCrypto, the same product
// modules the phone ships. The sealed bundle bytes and the invented producer
// calendar are handed in by the driver; nothing is invented in this file.
import { openTodayOverLocalEra } from '../local/today-bindings.mjs';
import { createLocalSourceController, localSourceCommitCapability } from '../local/source-admission.mjs';
import { createSourcePlatform } from '../local/source-platform.mjs';
import { parseStrictJson } from '../strict-json.mjs';
import Profile from '../../../m4/import/local-source-profile.cjs';
import Capture from '../../../m4/workout/capture.cjs';
import Commands from '../../../m4/workout/commands.cjs';
import Setup from '../../w7-preview/today/setup-commands.mjs';
import * as Entry from '../../w7-preview/today/today-entry.mjs';

const prescriptionCapture = Capture.createPrescriptionCapture({ parseStrictJson });
const workoutCommands = Commands.createWorkoutCommands({ prescriptionCapture });
const clockFor = day => ({ now: () => day + 'T08:00:00.000Z', today: () => day,
  tz: '-05:00', monotonicMs: () => 0 });

/* The approved shell markup, composed by design.cjs on the Node side and handed
   in: design.cjs asserts with node:assert and has no place in a phone realm. */
function shell(input) {
  document.body.innerHTML = input.shellHtml;
  return document;
}
const era = input => openTodayOverLocalEra({ indexedDB: window.indexedDB, crypto: window.crypto,
  databaseName: input.db, namespace: input.ns, athleteId: input.athlete, deviceId: input.device,
  clock: clockFor(input.day) });

async function admit(installation, input) {
  const platform = createSourcePlatform();
  const carried = await installation.client.importBundle({
    bundleBytes: new Uint8Array(input.bundleBytes), passphrase: input.passphrase });
  if (!carried.imported) throw new Error('P2_BROWSER_CUSTODY_REFUSED ' + carried.code);
  const repository = (await installation.client.hostBindings({ workoutCommands })).repository;
  const custody = repository.importCustody({ parseStrictJson, validateContext: () => null });
  const material = await custody.load(carried.name);
  const raw = { source_json: platform.text(material.sourceBytes),
    candidate_json: platform.text(material.candidateBytes),
    local_json: material.localBytes === null ? null : platform.text(material.localBytes),
    engine_context_json: material.engineContextJson };
  const materialDigest = Profile.digest(platform.hash, 'earned/local-source-material/v1', raw);
  const context = parseStrictJson(raw.engine_context_json);
  const mapping = { profile: 'earned/source-producer-mapping/v1', id: 'TEST-ONLY-witness-mapping',
    construction: 'oracle-shim-default/v1', engine: context.engine,
    gate: { clock: context.oracle.gate.clock, tz: context.oracle.gate.tz },
    public_factory_digest: Profile.PUBLIC_FACTORY_DIGEST, source_pins: Profile.SOURCE_PINS,
    dependencies: { drafts: 'default-empty' },
    executions: [{ id: 'TEST-ONLY-witness-run', material_digest: materialDigest,
      calendar: { profile: 'earned/native-date-compatibility/v1',
        compatibility_id: 'TEST-ONLY-witness-calendar', zone: context.oracle.gate.tz,
        range: input.calendar.range, dates: input.calendar.dates,
        native_date: input.calendar.native_date } }] };
  const controller = createLocalSourceController({ repository, namespace: input.ns,
    athleteId: input.athlete, deviceId: input.device,
    producerRegistry: Profile.createProducerRegistry([mapping], { hash: platform.hash }),
    asOf: () => input.day, platform });
  const prepared = await controller.prepareSource(await controller.reviewSource(carried.name),
    { identityConfirmed: true });
  if (prepared.profile !== 'earned/local-source-qualification/v1') {
    throw new Error('P2_BROWSER_NOT_ADMITTED ' + JSON.stringify(prepared.issues || prepared));
  }
  const capability = localSourceCommitCapability(prepared);
  await capability.publish();
  const settled = await capability.reconcile();
  return controller.view(settled);
}

const shown = doc => (doc.getElementById('phone') || doc.body).textContent.replace(/\s+/g, ' ');

/* FIRST VISIT: the first run, the sealed bundle through C2b custody, the
   admission, and then the shipped Today and gym card over the same era. */
async function first(input) {
  const installation = await era(input);
  const host = await installation.createSetupHost({ day: input.day,
    commands: Setup.createSetupCommands(), profile: Setup.PROFILE });
  const saved = await host.save({ setup: input.setup, tags: input.tags });
  if (!saved.ok) throw new Error('P2_BROWSER_FIRST_RUN_REFUSED ' + saved.code);
  host.close();
  const view = await admit(installation, input);
  const booted = await Entry.boot({ document: shell(input), today: input.day, hosts: installation });
  await booted.api.ready;
  const basis = booted.model.basisState();
  const card = await booted.workout.gym.read();
  const out = { cells: 0, admitted: view.state.exercises.map(e => [e.id, e.w]),
    integration_pending: view.integration_pending,
    label: basis.athlete_label, basisLoads: basis.exercises.map(e => [e.id, e.w]),
    reads: basis.reads.map(r => r.w), sessions: Object.keys(basis.sessionLog).sort(),
    cardPhase: card.phase, cardLift: card.lift && card.lift.id, cardCount: card.lift && card.lift.count,
    cardLine: card.prescription && card.prescription.line, cardJson: JSON.stringify(card),
    text: shown(document), storage: Object.keys(window.localStorage || {}).length };
  /* One real set through the same model the screen drives, then close. */
  const start = await booted.workout.gym.start();
  if (!start.ok) throw new Error('P2_BROWSER_START_REFUSED ' + start.code);
  let logged = 0;
  for (let guard = 0; guard < 12; guard++) {
    const view2 = await booted.workout.gym.read();
    if (view2.phase === 'saved') { if (view2.complete) break; booted.workout.gym.forget(); continue; }
    if (view2.phase !== 'active') break;
    const result = await booted.workout.gym.logSet({ startId: view2.startId, slot: view2.set.slot,
      lift: view2.set.lift, load: String(view2.entry.load), reps: String(view2.entry.reps),
      effort: input.effort });
    if (!result.ok) throw new Error('P2_BROWSER_SET_REFUSED ' + result.code);
    logged += 1;
    booted.workout.gym.forget();
  }
  const closing = await booted.workout.gym.read();
  const finished = await booted.workout.gym.finish({ startId: closing.startId });
  if (!finished.ok) throw new Error('P2_BROWSER_FINISH_REFUSED ' + finished.code);
  out.logged = logged;
  out.cells = 12;
  return out;
}

/* AFTER THE KILL: a brand new page in a brand new browser process over the same
   profile, so the only thing carried across is what the device actually wrote. */
async function reopen(input) {
  const installation = await era(input);
  const booted = await Entry.boot({ document: shell(input), today: input.day, hosts: installation });
  await booted.api.ready;
  const basis = booted.model.basisState();
  const card = await booted.workout.gym.read();
  const generation = (await installation.generation()).generation;
  const ops = Object.values(generation.collections.ops || {});
  return { cells: 8, label: basis.athlete_label, basisLoads: basis.exercises.map(e => [e.id, e.w]),
    reads: basis.reads.map(r => r.w), sessions: Object.keys(basis.sessionLog).sort(),
    cardPhase: card.phase, cardSets: card.sets ?? null,
    sessionOps: ops.filter(op => op.class === 'session').map(op => op.kind),
    admitted: generation.metadata.localSourceApplication
      ? generation.metadata.localSourceApplication.core_complete : null,
    text: shown(document) };
}

window.P2 = Object.freeze({ first, reopen });
