/* gym-settings-lane.mjs - THE MACHINE SETTINGS LANE, SEALED (spec B.9, DECISIONS:550 S-R4).
 *
 * The settings lane handle, its read cache and the two functions that open and read it
 * were CUT OUT of gym-app.mjs by rebuild/lanes/c/today-split-spike/cut.cjs, region by
 * region, byte for byte: GA-S01, GA-S02, GA-S03 and GA-S04, 41 lines. Their bytes were
 * compared against a sha256 recorded at two named refs BEFORE anything was written
 * (S-R19). Two substitutions were applied, both call-target rewrites: the two paint()
 * calls become painter.repaint().
 *
 * THE ONLY AUTHORED LINES ARE THIS BANNER, THE FACTORY LINE BELOW AND THE RETURN BLOCK AT
 * THE END, and all three are declared in regions.json's product block.
 *
 * WHAT CROSSES BACK, and it is the whole interface: a FACADE of seven read-only thunks, a
 * callback table of four, and nothing else. The released card cannot assign a binding in
 * here, which is the one rule no word list could ever have caught: settingsSaving is not
 * a writer's name, and gym-app.mjs:279 assigned it from a released click handler.
 *
 * WHAT IS NOT IN HERE, said plainly, because a reader will look for it. recordSettings
 * (gym-app.mjs:286-:318) is SEAM G1 and stays RELEASED and byte-identical in this round:
 * it refuses three times on the identity of a draft object the VIEW mints, and a seal
 * cannot compare an object it never saw. B.9's disposal, an editSeq token minted and
 * compared inside the seal, is part 2 of this build and is not built here. Until it is,
 * the released half of SEAM G1 still decides what is stored, and the build report names
 * that as the S-R17 (g) STOP it is.
 *
 * gym-app.mjs:546 model.start() inside paint() is LEFT BYTE-IDENTICAL: it is the one
 * durable PUT any paint root reaches in these three files, it is a pre-existing fact of
 * the page, and S-R12 says it is named out loud and carried as its own ticket
 * (GYM-START-IN-PAINT), not fixed inside a pure move.
 */

export function createGymSettingsLane(doc, model, settings, painter) {
  /* GA-S01  gym-app.mjs:123-125 */
  let settingsLane = settings || null;
  let settingsOpening = null;
  let settingsSaving = null;

  /* GA-S02  gym-app.mjs:131-140 */
  /* D2 ROUND 1, FINDING 1 - THE OPTIONAL READ IS NEVER A PREREQUISITE FOR THE CARD.
     The read used to be AWAITED inside paint(), so a slow lane meant no active set, no
     log control and no workout at all until it answered. It is now a lookup in a cache
     keyed by exercise id: the card paints from whatever that cache holds, a lift with
     no entry STARTS a read and paints the pending state, and the answer repaints only
     the lift it belongs to. A late answer for a lift the athlete has moved past is
     stored and never shown. */
  const settingsRead = new Map();   // exercise id -> {state: 'known'|'failed', latest}
  const settingsInFlight = new Set();
  let settingsReading = null;       // the last read started, for checks and tests

  /* GA-S03  gym-app.mjs:142-156 */
  function startSettingsRead(liftId) {
    if (!settingsLane || typeof liftId !== 'string' || !liftId) return settingsReading;
    if (settingsRead.has(liftId) || settingsInFlight.has(liftId)) return settingsReading;
    settingsInFlight.add(liftId);
    settingsReading = Promise.resolve()
      .then(() => settingsLane.latest(liftId))
      .then(
        (latest) => { settingsRead.set(liftId, { state: 'known', latest: latest || null }); },
        /* A REFUSAL IS NOT AN ABSENCE (finding 2). It is recorded as its own state and
           the block says so; it never becomes "no settings saved yet". */
        () => { settingsRead.set(liftId, { state: 'failed', latest: null }); },
      )
      .then(() => { settingsInFlight.delete(liftId); return painter.repaint(); });
    return settingsReading;
  }

  /* GA-S04  gym-app.mjs:158-170 */
  function openSettingsLane() {
    if (settingsLane || settingsOpening) return settingsOpening;
    const view = doc.defaultView || null;
    const idb = (view && view.indexedDB) || (typeof globalThis !== 'undefined' ? globalThis.indexedDB : undefined);
    const web = (view && view.crypto) || (typeof globalThis !== 'undefined' ? globalThis.crypto : undefined);
    if (!idb || !web || !web.subtle || typeof model.day !== 'string') return null;
    settingsOpening = Promise.resolve()
      .then(() => import('./machine-settings-host.mjs'))
      .then((module) => module.createMachineSettingsHost({ day: model.day, indexedDB: idb, crypto: web }))
      .then(async (host) => { settingsLane = host; await painter.repaint(); return host; })
      .catch(() => { settingsLane = null; return null; });
    return settingsOpening;
  }

  /* THE INTERFACE, frozen. `facade` is READ-ONLY: every entry returns sealed state and
     none of them changes it. `hooks` is the only way released code changes anything in
     here. The two objects are separate on purpose, so that a later ticket adding a
     getter cannot quietly add a setter beside it. */
  return Object.freeze({
    facade: Object.freeze({
      lane: () => settingsLane,
      pending: () => settingsSaving,
      ready: () => settingsOpening,
      reading: () => settingsReading,
      hasRead: (liftId) => settingsRead.has(liftId),
      entryFor: (liftId) => settingsRead.get(liftId) || null,
      stateFor: (liftId) => (settingsRead.has(liftId) ? settingsRead.get(liftId).state : 'reading'),
    }),
    hooks: Object.freeze({
      open: () => openSettingsLane(),
      startRead: (liftId) => startSettingsRead(liftId),
      dropRead: (liftId) => { settingsRead.delete(liftId); },
      saving: (p) => { settingsSaving = p; return p; },
    }),
  });
}
