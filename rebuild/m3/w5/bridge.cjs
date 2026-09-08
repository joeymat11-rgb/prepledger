"use strict";
// No I/O enters a synchronous transaction. Each invocation stages a complete
// snapshot and publishes its delta only behind the database revision assertion.
const { memoryBackend, rowKey } = require('../../authority/store.cjs');
const { validateWorkoutShape } = require('../../m4/workout/schema.cjs');
const { createWorkoutProfile } = require('../../m4/workout/authority-profile.cjs');
const workoutProfile = createWorkoutProfile(validateWorkoutShape);
const METHODS = new Set(['admit','log','receipts','frontier','disposition','dispositionHistory','revokeDevice',
  'exportSnapshot','plan','planTransactions','planState','planOfDomain','txnDigests','issue','apply','confirmBasis','instanceOf','instanceState']);
const unavailable = () => ({ status: 'UNAVAILABLE', retry: true });
const transient = error => /fetch failed|SQLITE_BUSY|SQLITE_LOCKED|overloaded/i.test(String(error.message));
const backoff = attempt => new Promise(resolve => setTimeout(resolve,
  Math.floor(Math.random() * Math.min(250, 4 * 2 ** Math.min(attempt, 6)))));
const denied = () => { const error = new Error('Scope denied'); error.code = 'SCOPE_FORBIDDEN'; throw error; };

function createBridge(config) {
  const { db, authorityKey, identityKeys, clock } = config;
  if (!db || !authorityKey || !identityKeys || !clock) throw new TypeError('D1, authority keys, identity keys and clock required');
  // The production bundle uses the declared crypto boundary and the reviewed
  // reserved-workout profile seam. Tests may supply the same core
  // loaded from a disposable source copy; no mutation logic lives here.
  const core = config.core || require('./.generated/core.cjs');
  const retries = config.maxAttempts ?? 256;
  const profile = config.reconciliationProfile;
  if (profile !== undefined && profile !== 'earned/r1/v1') throw new TypeError('Unsupported reconciliation profile');
  async function execute(method, args, principal, seed) {
    for (let attempt = 0; attempt < retries; attempt++) {
      let loaded;
      try { loaded = await db.batch([
        db.prepare('SELECT revision FROM authority_revision WHERE id = 1'),
        db.prepare('SELECT athlete, collection, row_id, value FROM authority_rows'),
        db.prepare('SELECT subject, athlete FROM authority_subjects'),
      ]); } catch (error) {
        if (!transient(error)) return unavailable();
        await backoff(attempt); continue;
      }
      const [revisionResult, rowResult, subjectsResult] = loaded;
      const revision = revisionResult.results[0].revision;
      const snapshot = rowResult.results.map(r => [rowKey(r.athlete, r.collection, r.row_id), JSON.parse(r.value)]);
      const before = new Map(snapshot.map(([key, value]) => [key, JSON.stringify(value)]));
      const backend = memoryBackend(snapshot);
      const subjects = new Map(subjectsResult.results.map(r => [r.subject, r.athlete]));
      const athletes = Object.fromEntries(snapshot.flatMap(([key, value]) => {
        const [athlete, table, id] = JSON.parse(key);
        return table === 'metadata' && id === 'state' ? [[athlete, { devices: value.devices, plan: value.initialPlan }]] : [];
      }));
      const authority = core.createAuthority({ backend: config.backendFactory ? config.backendFactory(backend) : backend,
        authorityKey, identityKeys, clock, workoutProfile, athletes: { ...athletes, ...(seed ? seed.athletes : {}) } });
      const scope = (subject, device) => {
        const athlete = subjects.get(subject);
        const state = athlete && backend.get(rowKey(athlete, 'metadata', 'state'));
        if (!state || !Object.hasOwn(state.devices, device) || backend.get(rowKey(athlete, 'revocations', device))) return null;
        return { athlete_id: athlete, device_id: device, lease: state.devices[device].lease };
      };
      let scoped;
      if (principal) {
        scoped = scope(principal.subject, principal.device);
        if (!scoped) denied();
        if (!['scope','enrol'].includes(method) && args[0] !== scoped.athlete_id) denied();
        if (method === 'admit' && (!args[1] || args[1].device_id !== scoped.device_id || args[1].athlete_id !== scoped.athlete_id)) denied();
      }
      let result;
      if (seed) result = { initialized: true };
      else if (method === 'scope' || method === 'enrol') result = scoped || scope(...args);
      else if (method === 'lease') result = backend.get(rowKey(args[0], 'metadata', 'state'))?.devices[args[1]]?.lease;
      else {
        if (!METHODS.has(method)) throw new TypeError('Unknown authority method');
        result = authority[method](...args);
      }
      if (result && result.status === 'UNAVAILABLE') return result;
      const delta = backend.snapshot().filter(([key, value]) => before.get(key) !== JSON.stringify(value));
      const newSubjects = seed ? Object.entries(seed.subjects).filter(([s, a]) => {
        if (subjects.has(s) && subjects.get(s) !== a) throw new Error('Existing subject binding is immutable');
        if (!backend.get(rowKey(a, 'metadata', 'state'))) throw new Error('Unknown provisioned athlete');
        return !subjects.has(s);
      }) : [];
      // Even a read-only successful result is authorized at a checked revision.
      // A stale scope/read cannot authorize a response after a concurrent change.
      const statements = [db.prepare('UPDATE authority_revision SET revision = CASE WHEN revision = ? THEN revision ELSE -1 END WHERE id = 1').bind(revision)];
      for (const [key, value] of delta) {
        const [athlete, collection, id] = JSON.parse(key);
        statements.push(db.prepare('INSERT INTO authority_rows (athlete, collection, row_id, value) VALUES (?, ?, ?, ?) ON CONFLICT (athlete, collection, row_id) DO UPDATE SET value = excluded.value')
          .bind(athlete, collection, id, JSON.stringify(value)));
      }
      for (const [subject, athlete] of newSubjects) statements.push(db.prepare('INSERT INTO authority_subjects (subject, athlete) VALUES (?, ?)').bind(subject, athlete));
      statements.push(db.prepare('UPDATE authority_revision SET revision = revision + 1 WHERE id = 1'));
      try { await db.batch(statements); return result; }
      catch (error) {
        // A CHECK failure is exclusively the revision assertion. Any other
        // failure refuses this attempt without exposing an uncommitted result.
        if (!String(error.message).includes('stale_revision') && !transient(error)) return unavailable();
        // Desynchronize independent workers after contention; this is not a
        // lock or shared queue. Every retry still reloads and asserts D1 state.
        // Transport failure can occur after durable acceptance: reload instead
        // of re-publishing this delta, so any accepted request replays once.
        await backoff(attempt);
      }
    }
    return unavailable();
  }
  if (profile === undefined) return {
    initialize: (athletes, subjects = {}) => execute(null, [], null, { athletes, subjects }),
    invoke: (method, args = []) => execute(method, args),
    invokeScoped: (subject, device, method, args = []) => execute(method, args, { subject, device }),
  };
  // The profile is a deployment setting, never a caller override. The original
  // fixture path above remains byte-for-byte operationally independent of R1.
  const C = require('./reconciliation/codec.cjs'), I = require('./reconciliation/issuer.cjs');
  const { project, validateRetained, claimsAgainst } = require('./reconciliation/project.cjs');
  const r1 = config.r1 || {};
  function trustedContext(context) {
    const value = context || { issuer: r1.issuer, origin: r1.origin };
    const origins = r1.origins || [r1.origin];
    if (!value || value.issuer !== r1.issuer || !origins.includes(value.origin) ||
        !C.nonempty(value.issuer) || !C.nonempty(value.origin)) I.error('SCOPE_FORBIDDEN', 403);
    return value;
  }
  async function executeR1(action, principal, request, context, seed) {
    const reconcileSubject = action === 'reconcile' ? principal?.subject : undefined;
    for (let attempt = 0; attempt < retries; attempt++) {
      let loaded;
      // BRIEF-W5-R1 v1.2: only reconciliation scopes this consistent read.
      // Both subject predicates use the captured authenticated principal; a
      // missing mapping selects zero rows, never a global fallback snapshot.
      try { loaded = await db.batch(action === 'reconcile' ? [
        db.prepare('SELECT revision FROM authority_revision WHERE id = 1'),
        db.prepare('SELECT subject, athlete FROM authority_subjects WHERE subject = ?').bind(reconcileSubject ?? null),
        db.prepare('SELECT athlete, collection, row_id, value FROM authority_rows WHERE athlete = (SELECT athlete FROM authority_subjects WHERE subject = ?)').bind(reconcileSubject ?? null),
      ] : [
        db.prepare('SELECT revision FROM authority_revision WHERE id = 1'),
        db.prepare('SELECT athlete, collection, row_id, value FROM authority_rows'),
        db.prepare('SELECT subject, athlete FROM authority_subjects'),
      ]); } catch (cause) {
        if (!transient(cause)) return unavailable();
        await backoff(attempt); continue;
      }
      const [revisionResult, rowResult, subjectResult] = action === 'reconcile' ? [loaded[0],loaded[2],loaded[1]] : loaded;
      if (revisionResult.results.length !== 1 || !Number.isSafeInteger(revisionResult.results[0].revision)) I.error('UNAVAILABLE', 503, true);
      const revision = revisionResult.results[0].revision;
      if (action === 'reconcile') {
        // A complete proof is read-only. Keep the global revision guard and
        // own-account integrity/scope checks without constructing a writer backend, cloning
        // every row or booting the admission core for each proof page.
        const subjects = new Map(subjectResult.results.map(r => [r.subject,r.athlete]));
        const athlete = principal && subjects.get(reconcileSubject), actor = principal && principal.device;
        if (!principal || !athlete) denied();
        const standingRows = new Map(), needed = new Set(['metadata','accountRegistry','deviceIssuance','issuedLeases','revocations']);
        try {
          for (const row of rowResult.results) {
            const value = C.parse(C.bytes(row.value));
            if (row.athlete === athlete && needed.has(row.collection)) standingRows.set(rowKey(row.athlete,row.collection,row.row_id),value);
          }
        } catch (_) { I.error('RETAINED_INTEGRITY'); }
        const reader = { get:key => standingRows.get(key) };
        I.registry(reader,athlete); I.device(reader,athlete,actor,authorityKey);
        const scopeDigest = C.scopeDigest({...trustedContext(context),subject:reconcileSubject,athleteId:athlete,actorDeviceId:actor});
        const result = {...project({rawRows:rowResult.results,athleteId:athlete,actorDeviceId:actor,request:request.request,scopeDigest}),scopeDigest};
        if (request.expectedPayloadDigest !== undefined && result.payloadDigest !== request.expectedPayloadDigest) I.error('SNAPSHOT_CHANGED',409);
        const statements = [db.prepare('UPDATE authority_revision SET revision = CASE WHEN revision = ? THEN revision ELSE -1 END WHERE id = 1').bind(revision),
          db.prepare('UPDATE authority_revision SET revision = revision + 1 WHERE id = 1')];
        try { await db.batch(statements); return result; }
        catch (cause) {
          if (!String(cause.message).includes('stale_revision') && !transient(cause)) return unavailable();
          await backoff(attempt); continue;
        }
      }
      let snapshot;
      try { snapshot = rowResult.results.map(r => [rowKey(r.athlete, r.collection, r.row_id), C.parse(C.bytes(r.value))]); }
      catch (_) { I.error('RETAINED_INTEGRITY'); }
      const before = new Map(snapshot.map(([key,value]) => [key, JSON.stringify(value)]));
      const rawBefore = new Map(rowResult.results.map(r => [rowKey(r.athlete,r.collection,r.row_id), r.value]));
      const subjects = new Map(subjectResult.results.map(r => [r.subject,r.athlete]));
      const backend = memoryBackend(snapshot);
      const athletes = Object.fromEntries(snapshot.flatMap(([key,value]) => {
        const [athlete,table,id] = JSON.parse(key);
        return table === 'metadata' && id === 'state' ? [[athlete,{devices:value.devices,plan:value.initialPlan}]] : [];
      }));
      const authority = core.createAuthority({ backend: config.backendFactory ? config.backendFactory(backend) : backend,
        authorityKey, identityKeys, clock, workoutProfile, athletes: { ...athletes, ...(seed ? seed.athletes : {}) },
        resolveIssuedLease: (tx, athlete, deviceId, leaseId) => {
          // Admission drains WAITING across the whole staged database. A
          // foreign account not yet converted to R1 must remain unavailable,
          // not acquire an invented LEASE_UNKNOWN terminal rejection.
          const account = tx.get('accountRegistry','state');
          if (!C.object(account) || Object.keys(account).length !== 4 || account.profile !== profile ||
              !C.safe(account.account_epoch,1) || !['ACTIVE','CLOSED'].includes(account.state) ||
              !['PROFILE_GENESIS','VERIFIED_IMPORT','OBSERVED_CURRENT'].includes(account.history_origin))
            throw new Error('R1 historical profile unavailable');
          return tx.get('issuedLeases',JSON.stringify([deviceId,leaseId]))?.lease;
        } });
      // Preserve the exact D1 JSON TEXT for every unchanged row. Reserializing
      // the parsed snapshot would silently erase whitespace/property evidence.
      const rawRows = () => backend.snapshot().map(([key,value]) => {
        const [athlete,collection,row_id] = JSON.parse(key), serialized = JSON.stringify(value);
        return { athlete,collection,row_id,value: before.get(key) === serialized ? rawBefore.get(key) : serialized };
      });
      let athlete = principal && subjects.get(principal.subject), actor = principal && principal.device;
      const resultContext = () => ({ ...trustedContext(context), subject: principal.subject, athleteId: athlete, actorDeviceId: actor });
      const issuerContext = () => ({ backend, athlete, authorityKey, clock, config: r1 });
      let result, newSubjects = [];
      if (seed) {
        for (const [subject,target] of Object.entries(seed.subjects)) {
          if (subjects.has(subject)) I.error('INTENT_CONFLICT',409);
          if (subjectResult.results.some(r => r.athlete === target)) I.error('INTENT_CONFLICT',409);
          if (!Object.hasOwn(seed.athletes,target)) I.error('INVALID_R1_REQUEST',400);
          newSubjects.push([subject,target]);
        }
        if (new Set(newSubjects.map(([,a]) => a)).size !== newSubjects.length) I.error('INTENT_CONFLICT',409);
        for (const target of Object.keys(seed.athletes)) {
          if (!newSubjects.some(([,a]) => a === target)) I.error('INVALID_R1_REQUEST',400);
          I.genesis({ backend, athlete:target, config:r1, authorityKey }, snapshot.some(([key]) => JSON.parse(key)[0] === target));
        }
        result = { initialized:true };
      } else if (action === 'closeAccount') {
        athlete = request.athlete;
        const account = backend.get(rowKey(athlete,'accountRegistry','state'));
        if (!account || account.profile !== profile) I.error('UNAVAILABLE',503,true);
        if (account.state !== 'CLOSED') {
          I.registry(backend,athlete);
          if (account.account_epoch === Number.MAX_SAFE_INTEGER) I.error('ISSUANCE_EXHAUSTED',409);
          I.transaction(backend,() => {
            I.put(backend,athlete,'accountRegistry','state',{...account,account_epoch:account.account_epoch+1,state:'CLOSED'});
            I.event(backend,athlete,'ACCOUNT_CLOSED',null,{state:'CLOSED'},r1);
          });
        }
        result = { state:'CLOSED' };
      } else {
        if (principal && !athlete) denied();
        if (!principal) athlete = request.args[0]; // trusted internal authority API only
        I.registry(backend,athlete);
        if (principal && action !== 'enroll') I.device(backend,athlete,actor,authorityKey);
        if (action === 'enroll' || action === 'renew') {
          trustedContext(context);
          const issued = action === 'enroll' ? I.enroll(issuerContext(),request) : I.renew(issuerContext(),actor,request);
          actor = issued.deviceId;
          result = { payload:{issuance:issued.issuance,current_standing:I.standing(backend,athlete,actor)},
            scopeDigest:C.scopeDigest(resultContext()),intentDigest:issued.intentDigest };
        } else if (action === 'recoveryReplay') {
          const scopeDigest = C.scopeDigest(resultContext());
          const envelopeBytes = C.bytes(request.envelopeBytes), envelope = C.parse(envelopeBytes,C.LIMITS.request);
          if (!C.fullEqual(envelope,request.envelope) || envelope.athlete_id !== athlete ||
              !backend.get(rowKey(athlete,'deviceIssuance',envelope.device_id))) denied();
          // Source A may be revoked; actor B may not. A's original barrier is
          // evaluated by the unchanged admission core, never impersonated by B.
          I.device(backend,athlete,envelope.device_id,authorityKey,{allowRevoked:true});
          const requestDigest = C.hash('operation',envelopeBytes);
          // Replay needs the same complete retained-integrity/full-value checks,
          // not serialization of an unrelated complete proof. A proof transport
          // cap cannot disable the exact retry of an otherwise valid operation.
          const retainedState = validateRetained(rawRows(),athlete);
          if (retainedState.registry.state !== 'ACTIVE' || !retainedState.devices.includes(actor) ||
              retainedState.val('revocations',actor)) denied();
          const claim = claimsAgainst(retainedState,[{claim_id:'replay',envelope_b64:C.encode64(envelopeBytes)}],
            athlete,actor,'ACCOUNT_RECOVERY')[0];
          const known = backend.get(rowKey(athlete,'operations',envelope.op_id));
          // Never rely solely on a projected label to protect the core's early
          // cached-result path. It keys by op_id+commitment, so modified source
          // fields with that same commitment also require full-value refusal.
          if (known && known.commitment === envelope.canonical_content_commitment && !C.fullEqual(known.op,envelope)) {
            if (!known || !known.disposition || !claim.history_rows.length) I.error('RETAINED_INTEGRITY');
            const logRow = known.disposition.status === 'ACCEPTED'
              ? retainedState.retainedRows.find(r => r.collection === 'log' && r.row_id === String(known.disposition.athlete_log_seq)) : null;
            if (known.disposition.status === 'ACCEPTED' && !logRow) I.error('RETAINED_INTEGRITY');
            result = { payload:{original_envelope_digest:requestDigest,outcome:'ENVELOPE_MISMATCH',
              disposition_bytes_b64:claim.history_rows[claim.history_rows.length-1].value_b64,
              authority_record:{operation_row:claim.stored_operation_row,history_rows:claim.history_rows,log_row:logRow},
              current_standing:I.standing(backend,athlete,actor)},scopeDigest,intentDigest:requestDigest };
          } else {
            let disposition = authority.admit(athlete,envelope);
            if (disposition && disposition.status === 'UNAVAILABLE') return disposition;
            const retained = backend.get(rowKey(athlete,'operations',envelope.op_id));
            let dispositionBytes = C.encode(disposition);
            if (retained && retained.commitment === envelope.canonical_content_commitment && C.fullEqual(retained.op,envelope)) {
              disposition = retained.disposition;
              const history = rawRows().find(r => r.athlete === athlete && r.collection === 'history' &&
                r.row_id === JSON.stringify([envelope.op_id,retained.historyCount]));
              if (!history) I.error('RETAINED_INTEGRITY');
              dispositionBytes = C.bytes(history.value);
            }
            result = { payload:{original_envelope_digest:requestDigest,outcome:'DISPOSITION',
              disposition_bytes_b64:C.encode64(dispositionBytes),authority_record:null,current_standing:I.standing(backend,athlete,actor)},
              scopeDigest,intentDigest:requestDigest };
          }
        } else if (action === 'invoke') {
          const { method,args } = request;
          if (principal && !['scope','enrol'].includes(method) && args[0] !== athlete) denied();
          if (principal && method === 'admit' && (!args[1] || args[1].athlete_id !== athlete || args[1].device_id !== actor)) denied();
          if (method === 'scope' || method === 'enrol') result = {athlete_id:athlete,device_id:actor,
            lease:backend.get(rowKey(athlete,'metadata','state')).devices[actor].lease};
          else if (method === 'lease') result = backend.get(rowKey(athlete,'metadata','state')).devices[args[1]]?.lease;
          else {
            if (!METHODS.has(method)) throw new TypeError('Unknown authority method');
            const prior = method === 'revokeDevice' && backend.get(rowKey(athlete,'revocations',args[1]));
            result = authority[method](...args);
            if (method === 'revokeDevice' && !prior && result?.status !== 'UNAVAILABLE') I.transaction(backend,() =>
              I.event(backend,athlete,'DEVICE_REVOKED',args[1],result,r1));
          }
        } else throw new TypeError('Unknown reconciliation method');
      }
      if (result?.status === 'UNAVAILABLE') return result;
      const delta = backend.snapshot().filter(([key,value]) => before.get(key) !== JSON.stringify(value));
      const statements = [db.prepare('UPDATE authority_revision SET revision = CASE WHEN revision = ? THEN revision ELSE -1 END WHERE id = 1').bind(revision)];
      for (const [key,value] of delta) {
        const [owner,collection,id] = JSON.parse(key);
        statements.push(db.prepare('INSERT INTO authority_rows (athlete, collection, row_id, value) VALUES (?, ?, ?, ?) ON CONFLICT (athlete, collection, row_id) DO UPDATE SET value = excluded.value')
          .bind(owner,collection,id,JSON.stringify(value)));
      }
      for (const [subject,target] of newSubjects) statements.push(db.prepare('INSERT INTO authority_subjects (subject, athlete) VALUES (?, ?)').bind(subject,target));
      statements.push(db.prepare('UPDATE authority_revision SET revision = revision + 1 WHERE id = 1'));
      try { await db.batch(statements); return result; }
      catch (cause) {
        if (!String(cause.message).includes('stale_revision') && !transient(cause)) return unavailable();
        await backoff(attempt);
      }
    }
    return unavailable();
  }
  return {
    initialize:(athletes,subjects={}) => execute(null,[],null,{athletes,subjects}),
    initializeR1:(athletes,subjects={}) => executeR1('initialize',null,null,null,{athletes,subjects}),
    invoke:(method,args=[]) => executeR1('invoke',null,{method,args}),
    invokeScoped:(subject,device,method,args=[]) => executeR1('invoke',{subject,device},{method,args}),
    enrollScoped:(subject,request,context) => executeR1('enroll',{subject},request,context),
    renewScoped:(subject,device,request,context) => executeR1('renew',{subject,device},request,context),
    reconcileScoped:(subject,device,request,expectedPayloadDigest,context) => executeR1('reconcile',{subject,device},{request,expectedPayloadDigest},context),
    recoveryReplayScoped:(subject,device,request,context) => executeR1('recoveryReplay',{subject,device},request,context),
    closeAccount:(athlete) => executeR1('closeAccount',null,{athlete}),
  };
}
module.exports = { createBridge };
