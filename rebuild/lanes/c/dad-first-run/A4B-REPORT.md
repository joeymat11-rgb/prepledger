# A4B REPORT

Branch `rebuild/lane-c-a4b`, base `origin/rebuild/t2-client-core` @ d9fee35 (the
tip moved twice during round 1, both moves docs-only; no B-NTC code has merged
and `today-bindings.mjs` is untouched by them, so the rebase had no conflict).
Round 1: ACCEPT WITH CONDITIONS at e67fde6 (`A4B-REVIEW.md` + annex, copied in at
93438e0). Evidence, hunks by file, S26-S44: `A4B-REPORT-ANNEX.md`.

## WHAT LANDED

Screen 2 asks only for the DAYS; `split-kinds.mjs` proposes each day's kind, the
screen prints the mechanism as Earned's own INVENTION and the intent it serves
(citation in the module header, DECISIONS:129 (3)), and a tap makes a day his: no
re-proposal may move it after that. Screen 3 offers TWO DOORS above the SAME
editable week, so neither is a wall: "Build my week for me" fills the chosen days
from the catalogue, "I'll choose" opens search-by-name and the two-layer picker,
and A4's by-hand path is still there. The payload widens to three closed members
`{profile, setup, tags}`; the document is unchanged, no load is asked and screen 4
is untouched. NEW: `split-kinds.mjs`, `exercise-catalogue.mjs` (83), `starter-week.mjs`, `test/catalogue.test.mjs`.

## ROUND 1 CONDITIONS

- **C1 (BLOCKING, the owner look) CLOSED.** The page on 4178 was a stale bundle.
  RED first: the served `/app.js` at pid 60960 was **1429004 bytes** and did not
  contain `COPY.screen2Why`. Ran `build.mjs`, restarted `serve.mjs`. GREEN: pid
  **48880**, `/app.js` **1429587 bytes**, `COPY.screen2Why` present with the rule
  and F1 sentences, `GET /` 200.
- **C2 CLOSED.** Brief 4.2 amended: the false closing sentence is replaced by the
  true per-kind table (upper 8 lifts / 24 sets at every count; lower 8/24 at
  D_L <= 2 and **5 lifts / 15 sets** at D_L >= 3, the catalogue's minors being
  U-only but for `abs`), with the ruling ids and why both alternatives are worse.
  S32's session-size subtest now asserts the SETS, not only the lifts.
- **C3** is the coordinator's REQUESTS line to the PM.
- **C4 CLOSED.** Brief section 1 amended: it claimed `today-bindings.mjs` is not
  touched; it is, +11/-2, necessarily and within `:129 (1)`, and `today-entry.mjs`
  (+4) and the journey `PAGE_PINS` re-pin (+7) are named there too.
- **C5 CLOSED** as a flag, below. **C6** is the hand test, a person's.

## OWNER LOOK NOTES

1. The `:125 (2)` F1 sentence is verbatim, so it renders `Earned's` with a
   STRAIGHT apostrophe while every other string on screen 2 uses the curly one
   (`Earned's suggestion`, `Earned's own rule`). Verbatim won over house style;
   the PM or the owner decides which way it should go.
2. S31 departs from `:127 (3)`: `arms` and `legs` have no single engine bucket,
   so those two ask for the part instead of guessing. Routed to the PM as C3.
3. Screen 3 after "Build my week for me" is ~8300px in an 842px viewport; S41
   permits it and it is measured, but the length is the owner's to judge.

## COUNTS (Windows, this head)

setup **145** / catalogue **43** / today **64** / copy **36** / gym **64** /
checkin **28** / `build.mjs` **PASS** (102 pinned inputs). W6 552, journey 51, A0
host 31, w7 19 and the four msedge checks ran at e67fde6 and are NOT re-run here:
since then only `A4B-BRIEF.md`, the two reports and one subtest of
`test/setup.test.mjs` changed, and no licensed non-test file moved. Mutants
M21-M32 12/12 killed at e67fde6, plus the reviewer's own R11-R14. Carried from
A4: H3, H2, F1, F2; `catalogue.test.mjs` joins the suites `rebuild.yml` does not
enumerate. No owner screen 4-6 notes landed at either rebase; nothing folded.
