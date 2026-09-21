# CLAUDE REVIEW: EPP (proposed-pick repair), round 1
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1. A fresh session: not the
author of a2dfa3f or c9780cc, not PM4, not the Sol author of the report, not the Astra reviewer.
Asked at DECISIONS:639, class (a) data path and (b) next seal. Run on Joe's word "review".
Head 0d38b8e2633ee46b033f8386670bf6e25ef10862 on rebuild/e-proposed-pick-repair.
Base 8c2bc36e91ae346508d31095302eb86a6f708228. Red commit a2dfa3f. Repair commit c9780cc.
Spec rebuild/coach/EARN-ON-PHONE-OPTIONS-CHECK.md at a731f483, sha256 re-measured here:
71e6eaabde2a35af8bdc9b8b48577e603c03e8bf06ca37d935696b5be15c2e1c (equal to :639). Sections 7, 8, 10.
Everything ran on the owner's PC, Node v24.19.0, PC clock 2026-09-21 12:26 to 12:40 ET.
EVERY NUMBER BELOW IS INVENTED. No measurement of the owner's was read, run or printed.

## VERDICT
ACCEPT WITH NAMED DEBTS.
The two clauses are right, both are needed, and they change nothing outside the untapped-offer
defect. I looked for an input where the repair takes consent away, stores an untapped load, or
moves any other result, and found none by execution. Five debts are named in section 5. The
debts do not block the two clauses; two of them (D-EPP-1, D-EPP-2) must be paid before the
package can honestly be called finished for the phone.

## 1. ORDER OF WORK
I formed my findings from the spec and the diff first, ran my own cells, and only then read the
author report (58 lines, whole) and the Astra blind review (51 lines, whole, at 901ee41e).
I did not reuse their probes or their scratch folders. My scratch: %TEMP%\claude-epp
(run1.cmd, run2.cmd, bar.cjs, cmp.cjs, probe.cjs, probe2.cjs, peek.cjs and their outputs).
Worktrees: %TEMP%\earned-claude-EPP (this branch, cut from the head) and
%TEMP%\earned-claude-EPP-base (detached at the base). Both clean after every run.

## 2. EVERY PRODUCT HUNK (DECISIONS:439), all read
git diff base..head -- rebuild : 4 files, +324 -2.
P1 rebuild/engine/today.cjs    @@ -94,7 +94,7 @@ genSession, line 97: adds  x.state !== "PROPOSED" &&
P2 rebuild/engine/writers.cjs  @@ -224,7 +224,7 @@ completeSession, line 227: adds the same words.
No other product byte moves. Not product: rebuild/engine/test/proposed-pick.test.cjs (+264, read
whole) and rebuild/engine/PROPOSED-PICK-REPAIR-REPORT.md (+58, read whole).
sha256 at head: today.cjs b4ebee3c32ccc8042b4373c1bc84337a1b2db1e6525f7bce0c009377a6bc4c6c,
writers.cjs 67033f9f06696345dac1358de6026fc3703c96ad2050dff3208ccb88d965fa7b (equal to the blind
review's), proposed-pick.test.cjs 19f78b8e901ddbb910cac7f796767aa7784479a0bc64e7664dd74eedb510448b.
git diff c9780cc4..head touches the report only, so :639's "product/test bytes equal" holds.
Reach of the changed name: in completeSession q is used only at lines 261 to 266 (the landing);
in genSession q is used only at 98, 115, 156 and 173, all behind isDebutNow. The exclusion is
word for word the one pickStructural already applies at today.cjs:55, so the card and the writer
now ask the question the picker asked. An entry with no state field passes all three alike.

## 3. WHAT I RAN
RED FIRST. proposed-pick.test.cjs on a plain export of a2dfa3f (git archive, no worktree):
8 tests, 3 pass, 5 fail, exit 1. Red rows R2, R3, R4, R7, R8; R1, R5, R6 pass as controls.
At the head: 8 pass, 0 fail, exit 0. R7 at red fails with NOTHING TO REVERT, which is not a
behavioural kill at red; at the head it executes both harmful halves. Agrees with both reports.
MY OWN CELL (probe.cjs), the same producer (completeSession twice, never a hand-built queue),
run against the unrepaired export and against the head, side by side:
 A uneven vector [100,95]: minted PROPOSED 110 [110,105] then DEBUT 105 [105,100].
   unrepaired card 110, stored 110 [110,105], the classic entry left open.
   repaired   card 105, stored 105 [105,100], one ESTABLISH, the offer still open and untapped.
 C after the untapped landing the offer can still be tapped: it becomes DEBUT 110, card 110,
   stored 110 [110,110], no open entry. Consent is kept, and it is a one-rung step from 105.
 D after the untapped landing, two more top sessions at 105: the stale offer is superseded by
   earn.cjs:79, the engine mints PROPOSED 115 then DEBUT 110, and the card takes 110, the entry
   the picker selected. The repaired order holds on the second earn too.
 E a one-sighting offer standing alone: card 100, isDebutNow false, on both engines. A debut-
   flagged entry arriving anyway: unrepaired ESTABLISHES the untapped offer; repaired does not.
 B see D-EPP-5.
THE BAR (bar.cjs): every cell under rebuild/engine/test, the four rebuild/m4/spec/load-write*.test
cells and rebuild/m3/w6/host/test/engine-equivalence.test.cjs, serially, on the base tree and on
the head tree, output normalized (tree path, millisecond timings) and hashed.
 30 cells exist in both trees. Exit codes identical in all 30: 12 exit 0 in both, 18 exit 1 in both.
 29 of the 30 have byte-identical normalized output. engine-equivalence 5/5 in both.
 load-write: assembly 2/0, errors 2/1, profile 2/6, load-write 0/3 (pass/fail), identical in both.
 The one output that differs is writers-source.cjs (exit 1 in both): see D-EPP-3.
 The 18 red cells are red at the base for reasons this package does not touch (absent esbuild,
 absent private fixture, stale pins, a generated engine-main that may not match this head).
 They are comparison evidence only. I make no green claim for any of them.

## 4. THE THIRD SITE, AND THE INPUT NOBODY TRIED: THE BASE
Both reports show rebuild/m4/workout/engine-capture.cjs:69-70 refusing the minted pair at the
head. Neither ran it at the BASE. I did (probe2.cjs: the real adapter and the real native runtime
of each tree, a stub validator, the producer's own pair, day 2026-09-07):
   base  card 110   untapped pair REFUSED ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED   tapped pair [110,110]
   head  card 105   untapped pair REFUSED ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED   tapped pair [110,110]
So the refusal is older than this repair. The repair neither causes it nor cures it. It also
means the phone's capture never turned the wrong 110 card into a prescription: it failed closed.
The cost is availability: prepare() throws for the whole day, so an athlete holding the untapped
pair gets no captured workout that day until the offer is tapped. The spec's section 6 case (c)
makes this reachable today through the shipped import merge, with no native earn at all.
Line 69 copies the OLD lookup (its comment says so) and now disagrees with the engine it mirrors.
I agree with the STOP: aligning it is a third product change and needs Joe's own word.

## 5. NAMED DEBTS
D-EPP-1 THE CELL GUARDS NOTHING YET. git grep for proposed-pick at the head finds 0 references in
  .github, rebuild/m4/spec and package.json, and .github names no file under rebuild/engine/test.
  Until the cell runs in the rebuild workflow on both systems and stands in the S9 acceptance, a
  later reconstruction of rebuild/engine can drop either clause silently.
  PAYS: the integrator at EPP acceptance, and S9 part 2 before the seal.
D-EPP-2 CAPTURE REFUSES THE MINTED PAIR (section 4). Smallest fix shape: give line 69 the same
  exclusion, keep the plurality refusal for two eligible entries, red first on the producer's pair.
  PAYS: its own package, on Joe's word, before THE PHONE EARNS WEIGHTS ships, because a native
  earn would mint this pair on the phone every time the trigger is met.
D-EPP-3 THE SEAL OWES A DECLARED DEPARTURE AND NEW PINS. today.cjs and writers.cjs are sealed S8
  product keys (acceptance-s8-real-shape.json:286 and :296). writers-source.cjs, the copy-fidelity
  cell against the frozen text, is red at the base and at the head, and its output now differs by
  exactly the P2 clause. The spec's section 7 says no row changes and no departure is declared;
  the golden rows indeed do not move, but the behaviour for the untapped pair deliberately departs
  from the frozen app, and the file headers still say "Copied from frozen". The S9 paper must
  declare it. Still owed and NOT run by me: the port oracle on the synthetic fixture, the
  sensitivity pass, the private gate, exact-head CI on both systems. PAYS: the S9 seal chain.
D-EPP-4 THE CELL HAS NO SELF-SENSITIVITY GUARD. I carry the blind review's debt unchanged: its
  seven semantic mutants are killed, but deleting a row's main assertion stays green.
  PAYS: the package that wires the cell (D-EPP-1), or the S10 brief.
D-EPP-5 ONE SESSION ACROSS THE SWITCH (probe B). A card drawn by an unrepaired build (110, debut)
  and finished on a repaired one: stored 105 [105,105], the performed load on the line 110, the
  offer still open. Nothing untapped is stored, so consent holds, but for that one session card
  and record disagree, and the landing returns before the logged-load adoption branch. No native
  path calls completeSession, so this touches only the live-app patch of :631 1b.
  PAYS: the live-app patch package: say it to Joe with the two-line diff, and release when no
  session is mid-flight.

## 6. NOTES (not blockers, not debts of this package; all identical at base and head)
N1 In probe E the repaired engine stores 105 when 105 is what was logged: that is the adoption
   law acting on a performed load, not the offer landing. The offer then stands at a load equal
   to the working weight until the next classic earn supersedes it.
N2 migrate.cjs:41 lets a standing PROPOSED block the joint mint, while earn.cjs:23 (R18) says an
   offer never blocks the classic earn. A missed earn, never an unsafe load. For the S10 brief.
N3 Outside rebuild/engine I found no other by-lift debut lookup in rebuild/m2, m3 or m4 except
   engine-capture.cjs:69. My first search missed that site because it spells the test as
   ['debut','unlock'].includes(q.kind); the two reports found it, and I then read and ran it.

## 7. WHAT I DID NOT DO, AND ONE THING I DID THAT I SHOULD SAY
Not run: the port oracle, sensitivity, the private gate, any seal or package tooling, hosted CI,
a linux run, a browser, a phone, a bundle, a real import. Not opened, listed or searched:
rebuild/conform/private, src/history.js, any ledger directory, EarnedPort, port-real.log,
astra-job-50.jsonl, the protected soak, any file under src of the old app.
DISCLOSURE. My bar ran EVERY file under rebuild/engine/test. Some of those cells, inside their own
process, read fe516c1:src/app.jsx through git show (writers-source, merge-source, migrate-source,
merge-laws) or look for the private fixture (census-partial, migrate-full: absent here, as it
should be). The blind reviewer chose not to run them; I should have checked before running.
What entered my session: about a dozen lines of completeSession code text from the
writers-source diff, the same text as rebuild/engine/writers.cjs but for the clause. No record,
no date of his, no measurement. The saved outputs %TEMP%\claude-epp\bar-*-source.cjs.txt and
bar-*-merge-laws*.txt are not opened by me and should be treated like astra-job-50.jsonl: never
opened, published, staged or deleted. To let the differentials load I copied the generated,
gitignored engine-main.cjs and engine-old.cjs from %TEMP%\earned-s5 into my two trees, unopened,
exactly as pm4-mk-lane.cmd does for a builder; they are ignored and are not in this commit.
I wrote this file straight into my own lane worktree through Desktop Commander instead of the
airlock, since nothing crossed from a cloud room; pm4-lf.cjs checked it before publishing.
