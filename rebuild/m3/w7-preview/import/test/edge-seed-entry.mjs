/* P3-IMPORT-UI-2, the real-Edge run (bar item j): THE INSTALLATION, seeded on
   the SAME ORIGIN, before the shipped page is opened.

   The A1 dist is the shipped page and exposes nothing: there is no way to put a
   first run into it except by tapping the six setup screens, and reproducing the
   journey fixture's exact programme through the catalogue by hand would be a
   test of the catalogue, not of the Import route. So this module - built by the
   ACCEPTED page bundler, served from the same origin, loaded ONCE before the
   page - opens the very installation gym-host.mjs openTodayHosts opens (same
   database, same namespace, same athlete, same LIVE clock) and records the first
   run through the accepted setup lane. Nothing here touches the Import route,
   the admission controller or custody: the browser does all of that by tap.

   Synthetic only: the setup document is the PUBLIC journey fixture's. */
import { openTodayHosts, localDayOf } from '../../today/gym-host.mjs';
import Setup from '../../today/setup-commands.mjs';

window.SEED = async function seed({ setup, tags }) {
  const live = () => new Date();
  const day = localDayOf(live());
  const era = await openTodayHosts({ indexedDB: window.indexedDB, crypto: window.crypto, live });
  const host = await era.createSetupHost({ day,
    commands: Setup.createSetupCommands(), profile: Setup.PROFILE });
  const saved = await host.save({ setup, tags });
  /* WHAT THE INSTALLATION ACTUALLY WROTE, and the two facts admission will
     measure it against: the zone this device resolves to and its own offset
     today. Returned so the run reports them rather than guessing at a refusal. */
  const loaded = await era.generation();
  const ops = Object.values(loaded.generation.collections.ops || {})
    .map(op => ({ kind: op.kind, ...op.effective }));
  host.close();
  era.close();
  return { ok: saved.ok === true, code: saved.code || null, day, ops,
    zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offsetMinutes: new Date().getTimezoneOffset() };
};
