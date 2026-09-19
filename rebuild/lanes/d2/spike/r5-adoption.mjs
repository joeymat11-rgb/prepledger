/* EW2 SPEC ROUND 5 - THE ADOPTION LOAD COUNT, under E-R17 PRIME (iii).
   Throwaway, never pushed, synthetic only.

   R4 B2 measured THREE repository.load() calls per adoption under the spec's
   3.4.4 as printed, because the gate does not load a generation: the load is
   local-source-basis.mjs:78, one frame deeper, inside admittedLocalSourceState,
   which returns the BASIS and throws the generation away.

   E-R17 PRIME (i) takes the hunk: ONE ADDED EXPORT in local-source-basis.mjs
   that returns the basis AND the generation its own repository.load() already
   produced. This cell PROTOTYPES that export and counts, on an instrumented
   repository, the way R4 counted three.

   It also drives the NEVER-THROWS contract (:70-:73) of both spellings, so the
   spec can say whether the existing export may be re-expressed through the new
   one or must stay byte-identical. */
import * as S from './r5-support.mjs';
import { admittedLocalSourceBasis, admittedLocalSourceState }
  from '../../../m3/w7-preview/today/local-source-basis.mjs';
import { setupsIn } from '../../../m3/w7-preview/today/setup-host.mjs';

const out = {};
const h = await S.scaffold({ tag: 'r5-adoption' });
try {
  /* THE INSTRUMENT. One counter, shared by the gate's repository and by the
     host's own client, so every durable load in one adoption lands on it. */
  const loads = { n: 0, where: [] };
  const count = label => { loads.n++; loads.where.push(label); };
  const real = h.repository;
  const gateRepository = { ...real,
    async load(...a) { count('the gate side (local-source-basis.mjs:78 or the hunk)'); return real.load(...a); } };
  /* The setup ENTRY the gate reads off, in the shape local-source-basis.mjs:74-:80
     asks for: setup.host.repository, setup.host.namespace, setup.athleteLabel(). */
  const setupEntry = { host: { repository: gateRepository, namespace: h.options.namespace },
    athleteLabel: () => h.document.athlete_label,
    athleteState: () => h.rawBasis };

  /* THE PROTOTYPE OF E-R17 PRIME (i)'s ONE ADDED EXPORT. It is the read half
     with the SAME try in the SAME place, returning the generation beside the
     basis instead of discarding it. */
  async function admittedLocalSourceRead(setup) {
    try {
      const host = setup && setup.host;
      const repository = host && host.repository;
      if (!repository || typeof repository.load !== 'function') return { generation: null, basis: null };
      const loaded = await repository.load();
      const label = setup && typeof setup.athleteLabel === 'function' ? setup.athleteLabel() : null;
      const generation = loaded && loaded.generation;
      return { generation: generation || null,
        basis: admittedLocalSourceBasis(generation, { athleteLabel: label, namespace: host.namespace || null }) };
    } catch (_) { return { generation: null, basis: null }; }
  }

  /* The editor host, opened over a generation the caller already holds. Its
     client is the scaffold's counting adapter, so host.read()'s own
     lane.reopen() shows up on the same counter. */
  async function openEditWeekHost(generation) {
    const ops = setupsIn(generation);
    const setupOperation = ops.length ? generation.collections.ops[ops[ops.length - 1].op_id] : h.setupOperation;
    return h.host({ setupOperation,
      basisState: admittedLocalSourceBasis(generation,
        { athleteLabel: h.document.athlete_label, namespace: h.options.namespace }) || h.taggedBasis });
  }

  const hostLoadCounter = () => { const before = h.reads.load; return () => h.reads.load - before; };

  /* A. THE SPEC's 3.4.4 AS PRINTED IN v4, which is what R4 measured. */
  loads.n = 0; loads.where = [];
  let since = hostLoadCounter();
  {
    const imported = await admittedLocalSourceState(setupEntry).catch(() => null);
    void imported;
    const loaded = await gateRepository.load();          // 3.4.4's hunk, line 1
    const host = await openEditWeekHost(loaded.generation);
    try { await host.read(); } finally { host.close(); }
  }
  out['A. 3.4.4 AS PRINTED IN v4 (what R4 B2 measured)'] = {
    'gate-side repository.load() calls': loads.n,
    where: loads.where,
    "host-side repository.load() calls (openEditWeekHost + one host.read())": since(),
    TOTAL: loads.n + since(),
  };

  /* B. E-R17 PRIME: ONE added export, called ONCE by the gate. */
  loads.n = 0; loads.where = [];
  since = hostLoadCounter();
  {
    const read = await admittedLocalSourceRead(setupEntry);
    const importAdmitted = !!read.basis;
    void importAdmitted;
    const host = await openEditWeekHost(read.generation);
    try { await host.read(); } finally { host.close(); }
  }
  out['B. E-R17 PRIME: the gate calls the ONE added export'] = {
    'gate-side repository.load() calls': loads.n,
    where: loads.where,
    "host-side repository.load() calls (openEditWeekHost + one host.read())": since(),
    TOTAL: loads.n + since(),
  };

  /* C. THE GATE AS IT STANDS TODAY, with no editor at all: the floor. */
  loads.n = 0; loads.where = [];
  since = hostLoadCounter();
  { const imported = await admittedLocalSourceState(setupEntry); void imported; }
  out['C. the gate as it stands today, today-app.cjs:2482-:2488, no editor'] = {
    'gate-side repository.load() calls': loads.n,
    'host-side repository.load() calls': since(),
    TOTAL: loads.n + since(),
    'so the EXTRA durable act E-R17 PRIME costs': 'B TOTAL minus C TOTAL',
  };

  /* D. WHERE THE ONE UNAVOIDABLE EXTRA LOAD IS: construction versus read. */
  loads.n = 0; loads.where = [];
  since = hostLoadCounter();
  {
    const read = await admittedLocalSourceRead(setupEntry);
    const host = await openEditWeekHost(read.generation);
    const afterConstruct = since();
    let afterRead;
    try { await host.read(); afterRead = since(); } finally { host.close(); }
    out['D. construction versus read'] = {
      'gate-side loads': loads.n,
      'host-side loads after openEditWeekHost(generation) alone': afterConstruct,
      'host-side loads after one host.read()': afterRead,
      'the one unavoidable extra act': 'lane.reopen() inside readVerified (plan-edit-host.mjs:148)',
    };
  }

  /* E. THE NEVER-THROWS CONTRACT (:70-:73), driven on BOTH spellings. */
  const throwing = { host: { repository: { load: () => { throw new Error('durable is down'); } },
    namespace: h.options.namespace }, athleteLabel: () => h.document.athlete_label };
  const absent = { host: { repository: null, namespace: h.options.namespace },
    athleteLabel: () => h.document.athlete_label };
  const notAFunction = { host: { repository: { load: 7 }, namespace: h.options.namespace },
    athleteLabel: () => h.document.athlete_label };
  const rejecting = { host: { repository: { load: async () => { throw new Error('rejected'); } },
    namespace: h.options.namespace }, athleteLabel: () => h.document.athlete_label };
  const drive = async (label, fn, arg) => {
    try { return { [label]: 'returned ' + JSON.stringify(await fn(arg)) }; }
    catch (e) { return { [label]: 'THREW ' + (e && e.message) }; }
  };
  out['E. the never-throws contract, driven'] = Object.assign({},
    await drive('existing export, a THROWING repository', admittedLocalSourceState, throwing),
    await drive('existing export, a REJECTING repository', admittedLocalSourceState, rejecting),
    await drive('existing export, an ABSENT repository', admittedLocalSourceState, absent),
    await drive('existing export, load is not a function', admittedLocalSourceState, notAFunction),
    await drive('new export, a THROWING repository', admittedLocalSourceRead, throwing),
    await drive('new export, a REJECTING repository', admittedLocalSourceRead, rejecting),
    await drive('new export, an ABSENT repository', admittedLocalSourceRead, absent),
    await drive('new export, load is not a function', admittedLocalSourceRead, notAFunction),
    await drive('new export, undefined setup', admittedLocalSourceRead, undefined));
} finally { h.close(); }

console.log(JSON.stringify(out, null, 1));
