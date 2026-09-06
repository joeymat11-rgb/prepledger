"use strict";
// No I/O enters a synchronous transaction. Each invocation stages a complete
// snapshot and publishes its delta only behind the database revision assertion.
const { memoryBackend, rowKey } = require('../../authority/store.cjs');
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
  // The production bundle supplies the unchanged core with only crypto.cjs
  // replaced at its declared platform boundary. Tests may supply the same core
  // loaded from a disposable source copy; no mutation logic lives here.
  const core = config.core || require('./.generated/core.cjs');
  const retries = config.maxAttempts ?? 256;
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
        authorityKey, identityKeys, clock, athletes: { ...athletes, ...(seed ? seed.athletes : {}) } });
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
  return {
    initialize: (athletes, subjects = {}) => execute(null, [], null, { athletes, subjects }),
    invoke: (method, args = []) => execute(method, args),
    invokeScoped: (subject, device, method, args = []) => execute(method, args, { subject, device }),
  };
}
module.exports = { createBridge };
