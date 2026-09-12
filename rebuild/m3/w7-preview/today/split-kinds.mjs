// split-kinds.mjs - A4b. Earned proposes each training day's session kind; the
// athlete picks only the DAYS (DECISIONS:125 (1), owner verbatim: "should we give
// people the ability to pick only the days, and from there earned prescribes
// either upper lower ... some people won't know to not put two uppers back to
// back").
//
// THE MECHANISM IS INVENTED, AND THE SCREEN SAYS SO; THE INTENT IS CITED
// (DECISIONS:129 (3)). No ledger line and no engine constant states an
// alternation rule, and this one is deliberately NOT derived from
// rebuild/engine/plan.cjs:21's fallback week (Mon/Thu upper, Tue/Fri lower):
// that is ONE athlete's week, and H1 (DECISIONS:93 condition C3) forbids it as a
// source. So the MECHANISM below - alternate in calendar order, never stack a
// kind on consecutive training days when the count allows, an odd count puts the
// extra kind furthest from its twin - is Earned's own and is marked invented.
// What it is FOR is not invented: each muscle trained about twice a week, with
// roughly forty-eight hours between sessions of the same kind (Schoenfeld,
// Ogborn and Krieger 2016, frequency meta-analysis). Alternating is the shortest
// mechanism that reaches that intent from a list of days alone, and the athlete
// may override any day with one tap.
//
// PURE. No clock, no state, no store, no DOM. Input is the weekday indices he
// tapped; output is a kind for each of them and nothing else. The caller's array
// is never mutated.
//
// THE SEAM (A4B-BRIEF section 9, open question 5). If the PM names a public
// standard to cite instead, or rules a different rule, ONLY `proposeKinds`
// changes: screen 2 calls it, the model stores its result as a PROPOSAL the
// athlete may override, and nothing else in the flow knows how a kind was chosen.
/* The two kinds, written out rather than imported from setup-model.mjs: the
   model now calls THIS module when a day is tapped, and an import back the other
   way would be a cycle whose initialisation order decides whether UPPER is "U"
   or undefined. They are athlete-state.cjs:61 DAY_KINDS, and setup.test.mjs
   asserts the two lists are the same two strings. */
export const DAY_KINDS = Object.freeze(['U', 'L']);
const [UPPER, LOWER] = DAY_KINDS;

/* Weekday indices as rebuild/m4/workout/athlete-state.cjs:82-87 keys them and
   rebuild/engine/plan.cjs:11 reads them: 0 = Sunday. */
const WEEK = 7;

/* `days`: distinct weekday indices 0..6. Returns { [dayIndex]: "U" | "L" }. */
export function proposeKinds(days) {
  if (!Array.isArray(days) || days.length === 0) return {};
  const sorted = [...new Set(days.filter((d) => Number.isSafeInteger(d) && d >= 0 && d < WEEK))]
    .sort((a, b) => a - b);
  const n = sorted.length;
  if (n === 0) return {};

  /* The cyclic gap from each training day to the next, wrapping the week. */
  const gap = (i) => (sorted[(i + 1) % n] - sorted[i] + WEEK) % WEEK;

  /* An EVEN count alternates perfectly from anywhere, so start at the first day.
     An ODD count cannot: exactly one consecutive pair must share a kind. Start
     immediately AFTER the largest gap, so the pair that repeats is the one with
     the most rest between its two days, the day furthest from its twin
     (DECISIONS:125 (1)). Ties go to the smallest index, which makes a week of
     equal gaps (n = 7) deterministic rather than arbitrary. */
  let start = 0;
  if (n % 2 !== 0) {
    let biggest = 0;
    for (let i = 1; i < n; i += 1) if (gap(i) > gap(biggest)) biggest = i;
    start = (biggest + 1) % n;
  }

  const kinds = {};
  for (let k = 0; k < n; k += 1) {
    kinds[sorted[(start + k) % n]] = k % 2 === 0 ? UPPER : LOWER;
  }
  return kinds;
}

export default { proposeKinds, DAY_KINDS };
