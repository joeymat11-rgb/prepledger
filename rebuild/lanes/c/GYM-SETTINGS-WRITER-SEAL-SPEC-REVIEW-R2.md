# GYM-SETTINGS-WRITER-SEAL specification: independent review, round 2 of 3

Reviewer: Claude (independent lane hand, told to disagree), under DECISIONS:613's reviewer-author loop
Subject: rebuild/lanes/c/GYM-SETTINGS-WRITER-SEAL-SPEC.md at 0cfe5a5b of rebuild/c-gym-settings-writer-seal-spec
Round 1 review: GYM-SETTINGS-WRITER-SEAL-SPEC-REVIEW-R1.md at 3c6ed453 (verdict REJECT, on size only)
Code read at: e08bc11cec423e5d5878110e78d16ccc5f3f8a29, the paper's declared baseline
Live lane tip cross-checked at: c38ed5fb of rebuild/c-today-split-build (the split's fix round, two commits past the head R1 saw)

## VERDICT: ACCEPT WITH NOTES

Every one of the eleven round 1 findings landed, none was disputed, and the four grounds for a
reject are all absent: a builder following this paper stores the same bytes and keeps every
refusal; the invariant holds under the design as now written; nothing in it needs a byte nobody
authorized except the one hunk named in N1 below, which is a paper edit and not a design change;
and it is no longer materially larger than the invariant needs. Measured: entry point groups 14 to
10, token kinds 3 to 1, rows 20 to 17 (16 unconditional plus one conditional on G1), isTrusted and
the native-browser gate gone, jsdom drives preserved.

The notes are four paper edits and one wrong line number. N1 is the only one I would hold a build
for: the round 2 revision adds a paint adapter whose synchronous contract cannot wrap paint's real
body without splitting it at gym-app.mjs:517, and that restructure is in no hunk row of section C
and has no M/R/N class.

BAR: claims checked 27 (narrow round; 16 of them written or changed by this revision); TRUE 25;
IMPRECISE 1; FALSE 1. Probes reproduced: 4 of the 4 new MEASURED (Round 2) claims, plus 4
re-measurements at the live tip (fence drift, gym-file drift, listener census, dispatch scan).

## 0. What I did

Synced origin/rebuild/c-gym-settings-writer-seal-spec (0cfe5a5b) and origin/rebuild/c-today-split-build
(c38ed5fb) into the farm and read there; farm-verify printed PASS on both syncs. Diffed the
specification bf6bc062 to 0cfe5a5b (108 insertions, 83 deletions) and checked that diff against my
own twelve findings, then opened every citation the revision newly wrote or changed. Probes ran in
the same farm scratch worktree of e08bc11c I used in round 1 (prefix gss-), one node process at a
time, synthetic inputs only. No store, no host, no athlete input. Nothing sealed, no receipt, no
artifact, no byte under rebuild/engine, nothing on the never-read list.

This is a narrow round: sections A, C, E, F and H were accepted in round 1 and I re-read only the
lines this revision changed.

## 1. The eleven round 1 findings

No finding was disputed. Under DECISIONS:613 that made all eleven orders, and all eleven landed.

| Finding | Landed where | Verified |
|---|---|---|
| R1-B1 isTrusted is not the admission rule | B Gesture admission, D GSS-GESTURE-CONTROL and GSS-GESTURE-NESTED, G3 | YES. Every isTrusted requirement is deleted from B and D; the trust text survives only as G3's alternative and as my attributed measurement at line 92 |
| R1-B2 three token kinds to one | B entry points, command signatures at line 68 | YES. "No permit, cardToken or present API exists; editorToken is the only identity token." Commands are recordSettings(rawAnswers, editorToken) and the four gym commands on a private captured context |
| R1-B3 cut hooks.present | B entry points and Gesture admission | YES. No present in the table; binders select inside phone after show, containment and isConnected checked at dispatch, leave revokes all bindings |
| R1-B4 size | B interface accounting, D row accounting | YES, measured in section 8 below |
| R1-N1 facade.effortChoices detaches nothing | line 69 | YES, with my measurement attributed |
| R1-N2 the untrusted drives are understated | line 93 | YES. gym.test:499/:505/:506 and the 15 lane-D2 files are named, with "no CI home" kept as mine |
| R1-N3 five missing parity inputs | E rows at 190, 197, 198, 205, 206, 207 | YES, all five, and see section 4 |
| R1-N4 seven buildability gaps | 172, 175, 174, 177, 107, 156-163, 83-88 | YES, all seven; the ordered admission sequence is now the single ordering definition |
| R1-N5 three clipped regions and the 216/226 self-count | 171 (:552-585), 124 (:455-581), 179 (:995-1021), 236 | YES, and the obsolete git status transcript is gone |
| R1-N6 re-measure F's anchors at the real starting head | 166 | YES, and section 6 shows it was needed |
| R1-N7 zero readers of settings.lane and settings.ready | G4 | YES, attributed to me and scoped as not re-run |

## 2. Disputes judged

None. The revision's last section has eleven lines, R1-B1 to R1-B4 and R1-N1 to R1-N7, and every
one begins LANDED. No finding is marked DISPUTED, so there is nothing for this round to re-measure
on that account. I record it because the loop rule makes an undisputed finding an order, and the
author obeyed all eleven rather than arguing any of them.

## 3. The four MEASURED (Round 2) claims, reproduced

The revision adds four claims under its own new label and retains no probe file for any of them
(H says "No Round 2 scratch file was created"). All four reproduce here, and I have retained my
two probe files so the PM and round 3 can re-run them.

| Claim | Reproduced? | My output |
|---|---|---|
| E line 190: exact view:39-49 helper, exerciseId 'synthetic-lift', empty value and cues; names 0, false and null give a null machine; name 7 gives {exercise_id:'synthetic-lift',settings:[{name:'7',value:''}]} | YES, exactly (gss-r2-coerce.mjs) | name=0 -> null; name=false -> null; name=null -> null; name=7 -> {"exercise_id":"synthetic-lift","settings":[{"name":"7","value":""}]}, acceptable=false. undefined and NaN also give null |
| line 91: 0 matches for /\.click\s*\(/ and 0 dispatchEvent spellings in the five named T paths | YES | gym-app.mjs, machine-settings-view.mjs, gym-settings-lane.mjs, today-app.cjs, today-lanes.cjs: click=0 dispatch=0 each, at e08bc11c AND at the live tip c38ed5fb |
| line 89: ordinary scoped listener starts paint, paint awaits a resolved read, resumed segment clicks the intended control; without resumed scope 1 admitted, with resumed scope 0, final depth 0 | YES (gss-r2-depth.mjs) | unwrapped: head=0 resumed=1 afterStart=1 render=1; all segments wrapped: head=0 resumed=0 afterStart=0 render=0; final depth 0 in both |
| line 155 and line 238: baseline 20 rows, now 16 unconditional plus conditional custody; B has 10 interface groups; 251 LF lines, ASCII, no CR, final LF | YES | git show bf6bc062 grep -c '^| GSS-' = 20; the revision = 17; entry point table = 10 rows; node byte check: 251 LF lines, 0 CR, 0 non-ASCII, 0 U+2013, 0 U+2014, final LF present |

One measurement of my own that supports the design and that nobody has written down: holding the
refusal depth ACROSS an await, which B line 82 forbids, refuses the athlete's own tap. MEASURED
(gss-r2-depth.mjs, last row): with depth held across a pending read, a real click at the live
enabled control returns refused:depth and writes 0. The prohibition is not stylistic; it is the
difference between a safeguard and a button that stops working while a read the athlete never
asked for is in flight. Section D should carry that as a RED plant: "hold depth across the await,
and the athlete's own tap during a pending paint is silently refused."

## 4. The correction the author made to me, accepted, and a stronger case for it

E line 190 says my round 1 wording ("a row whose name is a number, false or null becomes '' and the
row is dropped") does not describe a truthy number. The author is right and I was wrong. MEASURED:
String(7 || '') is '7', so the row survives, and it is the producer at view:54-57 that refuses the
half-pair, not the helper.

The stronger case is not in E yet. MEASURED (gss-r2-coerce.mjs, last line): a row whose name AND
value are both numbers, {name: 7, value: 5}, produces {"exercise_id":"synthetic-lift",
"settings":[{"name":"7","value":"5"}]} and acceptable returns TRUE. So a non-string draft row does
not merely get refused differently today; it can be ACCEPTED and STORED as the strings "7" and "5".
That is the case that proves a typed boundary check at readRaw would silently lose a write the
released code performs. E's row should name it beside the refused half-pair, in one line.

## 5. N1, the paint adapter: the one thing I would fix before a builder starts

B line 89 adds hooks.paint(draw), which "executes only a synchronous drawing segment", and requires
R to wrap "the synchronous parts of paint, including continuations after awaits". Measured against
paint's real body:

READ gym-app.mjs:506-533. paint awaits twice, at :511 (model.read) and at :517 (model.start). Its
synchronous drawing returns are at :513, :514, :518, :528, :531 and :532. The three synchronous
segments are :507-511, :512-517 and :518-520 (plus the six returns) - and the middle segment
CONTAINS the :517 await, so it cannot be passed to a synchronous hooks.paint(draw) as one closure.
Satisfying the rule as written means splitting paint's body into three closures and rewriting its
control flow. That is a control-flow rewrite of released drawing code, in the file the split just
cut and S10 will pin.

Three things follow, all of them paper edits.

1. Section C's gym-app row lists ":511 read context" and nothing else in paint. The paint
   restructure is in no hunk row and has no class: it is not M, it is not a named import/export/call
   or copy-mapper transformation (R), and it is not writer logic (N). Line 46 tells a builder to
   list an unclassified hunk for PM review, which means the first builder to open this file stops
   and asks. Name the hunk and its class in C.
2. Name the segments. MEASURED, there are exactly three plus six synchronous returns; a rule that
   says "the synchronous parts" cannot be checked for completeness, and a missed segment fails OPEN
   and silently. D's plant ("omit resumed paint scope") proves one site, never completeness.
3. Price the alternative before choosing. MEASURED (gss-r2-depth.mjs, row renderSites): wrapping
   only the six synchronous drawing returns, which is six one-line call-site changes and no control
   flow change at all, refuses the plant inside a render helper (render=0) but admits a bare plant
   sitting between the branch tests (resumed=1, afterStart=1). Those two positions are reachable
   only by a `.click(` or dispatchEvent spelling inserted into released source, which is exactly
   what GSS-GESTURE-CONTROL's static half already rejects, MEASURED at 0 occurrences in all five
   files at both heads. So the segment split buys, over the cheaper shape, only the runtime half of
   a counterexample whose static half the same ticket already owns. I do not say which to take:
   the PM asked for a runtime rule under which PAINT CANNOT WRITE, and the segment split delivers
   that literally. I say the paper must state the cost it is choosing, because W1 is a size worry
   and this is the largest single released-file change the round 2 design adds.

## 6. W3 re-measured: the collision my round 1 called a future one has arrived

Line 166 carries my round 1 measurement correctly and scopes it to "e08bc11c-to-2df2f32d". At the
live tip it is out of date, and the PM should have the current numbers.

MEASURED git diff --stat e08bc11c c38ed5fb -- rebuild/ .github/: 10 files changed. The proposed
file set of this ticket is gym-app.mjs, gym-settings-lane.mjs, machine-settings-view.mjs,
test/machine-settings-ui.test.mjs, test/gym.test.mjs and writer-fence.test.mjs. The intersection is
NO LONGER EMPTY: writer-fence.test.mjs is now +216/-1 (1908 lines to 2123).

- The five gym product and test paths are still byte-untouched by the split round (MEASURED, empty
  diffstat for all five between e08bc11c and c38ed5fb). The lane's own product work is unobstructed.
- F's changes are in two places only: 1 line replaced by 5 at :1724 (FENCE-MODEL-HELD), and 211
  lines appended after :1908. MEASURED anchor drift for every anchor section D cites: :19, :192-210,
  :552-585, :773, :789-801, :882-889, :891-895, :897, :958-989, :968, :995-1021, :1110, :1404-1422,
  :1409, :1444-1475 and :1669 are all UNMOVED and still name exactly what the spec says they name.
  The two anchors above the edit shift by +4: :1751-1785 is now :1755-1789 and :1817-1907 is now
  :1821-1911. D's preamble already orders a re-measure, which is why this is a note and not a defect.
- MEASURED, the 211 appended rows contain 0 occurrences of "gym" and read today-app.cjs and
  today-lanes.cjs only, so "Today E.6 still reads only today-lanes" survives the round.
- The gesture guard MOVED without changing: `let gestures = 0` is at :70 at the tip, not :63, because
  a seven-line comment was inserted above it; the wrapper body is unchanged. Line 40's citation of
  today-lanes.cjs:63-75 is TRUE at the declared baseline and stale at the tip. One clause ("at
  e08bc11c") fixes it.
- Two things the split round has ruled since e08bc11c that this paper should absorb, both one line.
  First, F:1724 now says a pinned count is an EQUALITY and not a ceiling, and that "a drop has to be
  deliberate too... it lands in the report beside the count it changed." This ticket deliberately
  drops or changes at least three pinned counts (the six declared seams, LISTENERS_OUTSIDE_SHIM for
  gym-app.mjs, the three Object.freeze wrappers), so D should say the builder reports each changed
  count beside its cause. Second, the appended rows establish a Today law that a guarded writer must
  sit DIRECTLY inside a hooks.listen callback, proved statically. The gym design uses a different
  shape (sealed binders plus refusal depth). That is not a collision, the subjects and files differ,
  but two different laws will live in one file and the paper should say which is which.

## 7. Citation defects introduced by this revision

| Claim | Grade | What is there |
|---|---|---|
| E line 207: "card:417 -> refusalScreen:495 -> stub -> show:171-176" | FALSE | refusalScreen is at :501; :495 is inside refusalText's body. The chain and the behaviour are right: :417 calls refusalScreen, :501 calls stub at :198, stub calls show at :171, and show moves focus at :175-176. One digit fix, and it matters because the builder must preserve the focus move |
| B line 89: "READ card:511 resumes after model.read, and :516-520 resumes after model.start" | IMPRECISE | :516 is the phase test and :517 is the await itself; the resumed segment is :518-520 |

Every other citation this revision wrote or changed is TRUE at the baseline: view:39-49 and :54-57,
card:353, :439, :467-470, :478, :511, model:38-39, Producer:49-84 and :33-36, F:882-889, :968,
:1409's four-argument call, UI test:455-581, F:552-585, F:995-1021, and the tip-checked listener
census (MEASURED at c38ed5fb: 19 addEventListener sites in gym-app.mjs, of which 5 are writer
controls at :249, :386, :439, :467 and :473, so line 177's "0 or 14" is exact at the live tip too).

## 8. W1 re-checked: the size after round 2

| Measure | bf6bc062 | 0cfe5a5b | How measured |
|---|---|---|---|
| Sealed entry point groups | 14 | 10 | table rows in B |
| Token kinds | 3 | 1 | editorToken only; permit and cardToken deleted from the command signatures |
| Rows | 20 | 17 (16 plus conditional custody) | grep -c '^| GSS-' at both heads |
| Product and test paths | 6 | 6, or 5 under G1's alternative | section C |
| New browser gate | required | none | G3 and F line 214 |
| Authored lines | not priced | still not priced | C line 129 says so out loud |

Two honest qualifications for the PM. First, part of the row reduction is grouping rather than
deletion: GSS-RAW-SNAPSHOT is now folded into GSS-RAW-PARITY, and B's 10 is a count of groups, not
of callable functions. The paper states both, and no assertion or plant was dropped, so I accept it;
the PM should read "16 rows" as "16 row groups holding the same twenty obligations." Second, the
only number W1 really wants, authored lines, cannot be produced by a paper and remains unmeasured on
both sides. The real cuts are elsewhere and they are genuine: present, the permit, cardToken,
facade.effortChoices, isTrusted, the trusted-event harness rewrite and the native browser gate are
all gone, and those were the expensive ones.

## 9. The four PM rulings

My round 1 recommendations stand unchanged: G1 relocate (changed-then-pinned), G2 yes with forget
classed transient, G3 no to isTrusted, G4 yes to boolean availability. Nothing I measured this round
moves any of them.

One thing the PM should see plainly about G3. The row still reads OPEN and records both
recommendations, but B, D's two gesture rows and the new paint adapter now specify the depth-zero
branch ONLY; the isTrusted text is deleted rather than kept as a second branch, which is how G1 keeps
its alternative alive. That is a consequence of my own R1-B1 being BLOCKING and undisputed, so the
author was obliged to write it that way and I do not fault it. It does mean the PM's choice is no
longer symmetric: retaining trust now costs a respecification of B's Gesture admission section, the
ordered admission sequence's depth clause, the hooks.paint adapter, and D's GSS-GESTURE-CONTROL and
GSS-GESTURE-NESTED rows. G3's last sentence gestures at this ("wrappers for ordinary controls buy
nothing and the browser proof/harness cost must be separately authorized"). It should say exactly
which sections would be rewritten, so the PM knows the size of the choice he is being offered. One
sentence.

Also worth recording: the smaller design now rests mainly on measurements this review supplied
(the jsdom trust routes, the eight-row admission matrix, the listener census, the zero-reader
census). The paper attributes each one to me, which is the right practice. I re-ran the four that
could have moved with the live tip (dispatch scan, listener census, gym-file drift, fence drift);
all four hold. The jsdom trust results and the admission matrix were not re-run this round and are
still round 1 measurements.

## 10. Findings, in the order the author should take them

| # | Grade | Finding |
|---|---|---|
| R2-N1 | MUST FIX BEFORE BUILD | The paint adapter. Name the paint hunk and its class in section C, name the three synchronous segments and six drawing returns (MEASURED: :507-511, :512-517, :518-520; returns at :513, :514, :518, :528, :531, :532), state that the :517 await forces the body to split, and record the cheaper six-call-site shape and what it gives up. Section 5 |
| R2-N2 | NOTE | E line 207 cites refusalScreen at :495; it is at :501. B line 89's ":516-520" should be ":518-520". Section 7 |
| R2-N3 | NOTE | W3 is stale at the live tip: writer-fence.test.mjs is now +216/-1, two cited anchors drift +4, and today-lanes.cjs:63-75 is :70-82 there. Add the "at e08bc11c" clause, and absorb F:1724's new equality-and-report rule for every pinned count this ticket changes. Section 6 |
| R2-N4 | NOTE | E should name the accepted numeric pair {name:7,value:5} -> stored "7"/"5" (MEASURED), which is the case that proves a typed readRaw boundary would lose a write. Section 4 |
| R2-N5 | NOTE | Add a RED plant for holding refusal depth across an await: MEASURED, the athlete's own tap during a pending paint is then silently refused. Section 3 |
| R2-N6 | NOTE | G3 should name the sections that would need rewriting if the PM retains trust, and the three MEASURED (Round 2) claims should cite a retained artifact (mine are named in section 11). Section 9 |

## 11. Evidence

Probes, in the farm scratch worktree of e08bc11c used in round 1, node one process at a time,
synthetic inputs only, MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York:
gss-r2-coerce.mjs (the exact view helpers against names 0, false, null, 7, '7', undefined, NaN, and
the numeric pair) and gss-r2-depth.mjs (the three paint wrapping strategies against four plant
positions, and depth held across an await). Both retained beside round 1's gss-probe.mjs,
gss-forget.mjs, gss-trust.mjs, gss-trust2.mjs and gss-admission.mjs.
Static counts by grep over the synced worktrees at e08bc11c and c38ed5fb; file hygiene by node byte
read; row and group counts by grep against both specification blobs. Nothing was written to any
worktree of the chain, nothing was pushed anywhere but this review file, and farm-verify printed
PASS after every sync.
