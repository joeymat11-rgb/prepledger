"use strict";
/* today-readings.cjs - THE WEIGH-IN WRITER, SEALED (DECISIONS:550 S-R10, spec F.1).
 *
 * The two functions in this file are the only ones in the Today model that can put a row
 * of the athlete's weigh-in log on disk, and the four sentences they refuse in. They were
 * CUT OUT of today-model.cjs by rebuild/lanes/c/today-split-spike/cut.cjs, region by
 * region, byte for byte: TM-S01, TM-S02 and TM-S03. Their bytes were compared against a
 * sha256 recorded at two named refs BEFORE anything was written (S-R19), and the five
 * lastMessage rewrites are the only substitutions, each one a declared row.
 *
 * THE ONLY AUTHORED LINES ARE THIS BANNER, THE FACTORY LINE BELOW AND THE RETURN LINE AT
 * THE END, and all three are declared in regions.json's product block, not invented by
 * the instrument.
 *
 * WHY IT IS ITS OWN FILE, and not inside today-lanes.cjs. today-model.cjs is constructed
 * by every cell and by today-entry.mjs without a document; today-lanes.cjs is mountToday's
 * partner and is constructed per mount. Putting the reading writer there would make the
 * model depend on the page's mount for no gain. And read() with its whole projection has
 * to stay FREE, so that a look ticket needing one more field on the view does not go back
 * through a reseal child; the writer cannot stay beside it, so the writer leaves.
 *
 * WHAT IT MAY NOT GAIN. Athlete-facing copy: the four constants below are the whole of it,
 * they are named one by one in the writer fence, and a FIFTH literal is a RED row
 * (DECISIONS:562 S-R22, :550 S-R13). Nothing here reads the DOM, installs a listener or
 * paints, and nothing here composes a sentence out of a value.
 *
 * EVERY BINDING IT NEEDS IS INJECTED, and the seven are a MEASUREMENT, not a choice: the
 * machine census over the cut's own output named them. read() is the seventh, because
 * reopen() calls the released read(), and the build does not go green without it.
 */

function createReadingsWriter({ day, readings, adoptedRead, stateFromOps, read, NO_STORE, setMessage }) {
  /* TM-S01  today-model.cjs:397-406 */
  const ALREADY_RECORDED = "Today's weigh-in is already recorded on this device. Changing a recorded reading needs the correction path, which is not wired yet.";
  /* The entry-form bound. rebuild/client accepts any finite number as a reading, so
     without this a slip of the thumb (10000, 0, -5) is recorded as a fact and the
     engine damps it into the trend for ever. This is a FORM bound, not an engine
     admission rule and not a new client law — the same posture, and the same numbers,
     as the reviewed w7-preview's weigh-in form. It refuses in words; it never refuses
     silently and never rounds an entry into range (review F8). */
  const FORM_MIN = 60, FORM_MAX = 400;
  const OUT_OF_RANGE = "A morning weight is recorded between " + FORM_MIN + " and " + FORM_MAX
    + " lb, to one decimal place. Nothing was recorded.";

  /* TM-S02  today-model.cjs:410-430 */
  async function weighIn(lb) {
    /* Refuse rather than write an operation the accepted writer would ignore. The engine
       keeps the FIRST reading for a date; a second stored operation would leave the log
       and the screen disagreeing. The correction path is named, not faked. */
    if (adoptedRead(stateFromOps(), day)) {
      setMessage({ ok: false, state: null, copy: ALREADY_RECORDED });
      return { ok: false, state: null, copy: ALREADY_RECORDED, op_id: null };
    }
    if (typeof lb === "number" && Number.isFinite(lb)
      && (lb < FORM_MIN || lb > FORM_MAX || Number(lb.toFixed(1)) !== lb)) {
      setMessage({ ok: false, state: null, copy: OUT_OF_RANGE });
      return { ok: false, state: null, copy: OUT_OF_RANGE, op_id: null };
    }
    if (!readings) {
      setMessage({ ok: false, state: null, copy: NO_STORE });
      return { ok: false, state: null, copy: NO_STORE, op_id: null };
    }
    const result = await readings.weighIn({ date: day, lb });
    setMessage({ ok: result.ok, state: result.state, copy: result.copy });
    return { ok: result.ok, state: result.state, copy: result.copy, op_id: result.op_id };
  }

  /* TM-S03  today-model.cjs:433-437 */
  async function reopen() {
    setMessage(null);
    if (readings) await readings.restart();
    return read();
  }

  return { weighIn, reopen, ALREADY_RECORDED, OUT_OF_RANGE, FORM_MIN, FORM_MAX };
}

module.exports = { createReadingsWriter };
