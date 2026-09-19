/* EW2 SPEC ROUND 5 - WHICH DAY THE ADOPTION READ IS TAKEN ON (R4 N1, E-R24 / N1).
   Throwaway, never pushed, synthetic only.

   3.4.4's hunk calls host.read() with NO argument, and readVerified
   (plan-edit-host.mjs:145) defaults to localDay(). An edit reviewed on day D
   has starts_on D+1 (result() :376 is `if (value.starts_on <= date)`), so the
   adoption's own read sees nothing the edit did. EW-13d and EW-14 name no date.
   This re-measures R4's table so the spec can name the day in a clause. */
import * as S from './r5-support.mjs';

const out = {};
const h = await S.scaffold({ tag: 'r5-readday' });
try {
  const host = await h.host();
  const added = 'ew2-readday-add';
  const r1 = await host.review(S.addEdit(added));
  if (!r1.reviewed) throw new Error('review refused ' + r1.code);
  const s1 = await host.save(r1.review_id);
  if (!s1.ok) throw new Error('save refused ' + s1.code);
  const r2 = await host.review(S.update({ sets: 5 }));
  if (!r2.reviewed) throw new Error('review refused ' + r2.code);
  const s2 = await host.save(r2.review_id);
  if (!s2.ok) throw new Error('save refused ' + s2.code);

  const STARTS = s1.starts_on;
  const row = async (label, date) => {
    const read = date === undefined ? await host.read() : await host.read(date);
    const ex = read.read ? read.state.exercises : [];
    return { [label]: {
      'date asked': date === undefined ? 'NONE, so readVerified defaults to localDay() = ' + h.DAY0 : date,
      read: read.read, code: read.read ? null : read.code,
      'the added lift appears, times': ex.filter(e => e.id === added).length,
      "press-old sets": (ex.find(e => e.id === 'press-old') || {}).sets ?? null,
    } };
  };
  Object.assign(out,
    await row("1. the adoption's OWN day, no argument, which is what 3.4.4's hunk writes", undefined),
    await row('2. the adoption day named explicitly', h.DAY0),
    await row('3. starts_on itself', STARTS),
    await row('4. a day after starts_on', '2026-09-20'));
  out['0. the two edits'] = { add: { id: added, starts_on: s1.starts_on },
    update: { sets: 5, starts_on: s2.starts_on }, 'the adoption day': h.DAY0 };
} finally { h.close(); }

console.log(JSON.stringify(out, null, 1));
