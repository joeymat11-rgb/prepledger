# S9-PREP-A RUNNER REVIEW R3 - INDEPENDENT RE-CHECK, ROUND 3

**VERDICT: ACCEPT WITH NOTES. No blocking finding.**

Reviewed head `c3d58264` on `rebuild/b-s9-prep-runner`, the round
`aa42ded0..c3d58264` (five commits), against the ticket, spec v4 section B,
review R4 and the PM's four rulings P-A1 to P-A4. The author is gone and I
was told to disagree; I re-measured every load-bearing claim myself before
reading the author's answer to it, and the one thing the PM made a STOP
condition (P-A1's precondition) I measured first, at three different chain
refs, before opening the runner diff.

Reading was done in the farm at `c3d58264` (synced, FARM-VERIFY PASS). The
bar of record and both `--ci` runs were re-run on the PC in
`%TEMP%\earned-s9a`, whose `HEAD`, `origin/rebuild/b-s9-prep-runner` and the
farm copy are all `c3d58264d5c8778ad0db9662fe34ea9c75249516`. Mutation work
was done in throwaway worktrees of my own, removed afterwards. I edited
nothing in the lane worktree but this file.

---

## 1. P-A1's PRECONDITION, RE-MEASURED BY ME, AND THE STOP DID NOT FIRE

The ruling was conditional and the condition is the whole of why a guard on
the seal path may be strengthened at all: every ruling line any spec under
`rebuild/lanes/b/tooling/packages/` cites by sha256 must still pass the
narrower rule. **I enumerated it myself, twice, with my own script, before
reading section 11.1.**

METHOD, read-only: walk every `packages/*.json` for every field whose name
ends `lineSha256`, add the runner's own `SUPERSESSION_STANDING_RULING`, read
`rebuild/DECISIONS.md` out of Git at `CHAIN_REF`
(`refs/remotes/origin/rebuild/t2-client-core`), hash every line the way the
runner hashes it, locate each cite, and test the located line under BOTH the
old rule `/(?:^|[ U+00B7])RULED$/` and the new one (last U+00B7-delimited
clause, trimmed, exactly `RULED`).

| where I ran it | chain ref | ledger lines | cites located | ruling lines | old-rule fails | new-rule fails | disagreements |
|---|---|---|---|---|---|---|---|
| farm | `4d2112c9` | - | 47 of 47 in `packages/` | 7 | 40 | 40 | **0** |
| farm, runner constant added | `4d2112c9` | - | 48 of 48 | 8 | 40 | 40 | **0** |
| **PC, the live ref the bar reads** | **`7546a9e0`** | **565** | **48 of 48** | **8** | 40 | 40 | **0** |

The eight ruling lines, every one located uniquely and passing BOTH rules:
`DECISIONS:153` (the runner's `SUPERSESSION_STANDING_RULING`, 4 clauses),
and `:160` `H3`, `:421` `S3`, `:444` `S4`, `:462` `S5`, `:490` `S6`,
`:514` `S7`, `:527` `S8` (5 clauses each, `coverage.superseded.rulingLineSha256`).
Every one ends in a last clause that is the bare word `RULED`.

**The precondition holds. No standing seal is voided by the strengthening,
and the author's section 11.1 is confirmed rather than taken.** One detail
the author could not have known: the chain ref has moved three times since
the measurement was first taken (author `4e832c2a`, farm `4d2112c9`, PC
`7546a9e0` at 565 lines). The result is stable across all three, and it is
stable by construction: the cites are sha256 of the line, so a located line
cannot change its own clauses without ceasing to be located at all, which is
a different and louder refusal.

---

## 2. THE RUNNER DIFF, EVERY ADDED LINE

`b-package.cjs` moved by 72 added and 14 deleted lines in one commit
(`c18fa1bd`), and I read all of them.

**P-A1.** `RULED_CLAUSE_SEPARATOR` at `:1012` and `ruledTerminal()` at
`:1013`, ONE function called from `supersessionRuling()` `:1298` and
`releaseRuling()` `:1360`. The old regex is gone from the file: the only
surviving `RULED$` in the runner is a comment at `:986`. The two grant
readers split on a U+00B7 literal at two other sites; the new constant is a
third literal of the same codepoint, so "same character" is a fact I checked
rather than read - I decoded every non-ASCII byte this round adds and there
is exactly ONE, the U+00B7 of `RULED_CLAUSE_SEPARATOR`.

**P-A2.** The `if (pmap)` skip at `:1384` is now an assert by name,
`RELEASE-WITHOUT-A-BOUND-PARENT`, and it stands AFTER the early return, so
X2 is untouched: a package that declares nothing released and carries no
release block still returns `{at:null,line:null,granted:[],declared:[]}`
before any ledger read and before this assert. An empty-object product map
passes this assert and is then refused one line later by
`RELEASE-PATH-IS-NOT-A-PARENT-PRODUCT-PIN`, which is the right order.

**P-A3.** `releasedAncestry()` returns a Map of path to entry at `:2065-:2070`
and the H17 skip asserts at `:2119-:2124` that the block's
`lastSealedSha256` equals `parentPin(entry, file)` of the grandparent entry,
before `gskipped.push(file); continue;`. `parentPin()` is the same accessor
the walk itself uses, so an `executionPins` string and a `product` object are
read identically. Every path NOT named in an ancestor released block still
gets both of `held()`'s asserts; the parent walk and `held()` are untouched.

**X1 by reading**, then by running: nothing in these 72 lines changes what
`proposed()` emits for a spec that declares no release, and section 4's two
`--ci` runs measure that on the final bytes.

No line of this round is a wildcard, a prefix, a pattern or an existence
check. Nothing was weakened, skipped or deleted to go green.

---

## 3. MUTATION: EVERY NEW CLAUSE REVERTED, ONE AT A TIME

My own harness, in a throwaway farm worktree at `c3d58264` (`node_modules`
wired, no private junction, removed afterwards): revert one clause from the
head bytes, run **all ten lane-B tooling suites**, restore, and re-check the
runner sha at the end (`32916e509df0` before and after, bytes equal).
Baseline: **130 pass / 0 fail, nothing red anywhere.**

| revert | cells that go red across the WHOLE bar |
|---|---|
| `ruledTerminal()` at the supersession call site `:1298` | `gate-supersession` **(P-A1)** only |
| `ruledTerminal()` at the release call site `:1360` | `release-from-seal` **(P-A1)** only |
| `ruledTerminal()` itself `:1013` | **BOTH** (P-A1) cells at once |
| the P-A2 assert `:1384`, back to `if (pmap)` | `release-from-seal` **(P-A2)** only |
| the P-A3 assert `:2120` | `release-from-seal` **(P-A3)** only |
| `releasedAncestry()` reads the grandparent only | `release-from-seal` **B.8 (11), B.8 (12), (P-A3)** |
| `releasedAncestry()` returns an empty Map | `release-from-seal` **B.8 (11), B.8 (12), (P-A3)** |
| H13's `role !== 'released'` filter `:3574` | `release-from-seal` **(P-A4)** only |
| **`releasedAncestry()` first-writer-wins `:2068`, to last writer wins** | **NOTHING, across all ten suites** |
| **`releasedAncestry()` reads the PARENT only (grandparent half dropped)** | **NOTHING, across all ten suites** |

**The author's mutation table reproduces row for row.** Every clause this
round added is killed by exactly one cell, and no revert reddens a cell that
is not about it. The last two rows are mine and are not in the author's
table; see note N3.

---

## 4. THE BAR, RE-RUN ON THE PC AT `c3d58264`

`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, each file on its own,
through a `.cmd` with a log and a `.done` file.

| suite | pass | fail | exit |
|---|---|---|---|
| `child-diagnostic-tail` | 11 | 0 | 0 |
| `execution-targets` | 9 | 0 | 0 |
| `gate-supersession` | **16** | 0 | 0 |
| `parent-gate-closure-and-load-floor` | 14 | 0 | 0 |
| `parent-pin-shapes-and-spec-successors` | 9 | 0 | 0 |
| `pinned-unchanged-and-ruled-substitutions` | 17 | 0 | 0 |
| `product-phase-and-ledger` | 7 | 0 | 0 |
| `release-from-seal` | **21** | 0 | 0 |
| `seal-tip-and-byte-identity` | 17 | 0 | 0 |
| `successor-moves` | 9 | 0 | 0 |
| **TOTAL** | **130** | **0** | all 0 |

125 at R2 plus this round's five cells, and only the two suites this round
touched moved (15 to 16, 17 to 21). The same ten suites reproduce 130/0 in
the farm as well, on Linux, which is a free second operating system for
this part of the bar.

**`--ci --package S8`**: `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION;
required evidence missing or failed; local diagnostics withheld`, **exit 1**.
The observation line reads `runner
32916e509df0e38e4cb464a4b30c871f880d11a849958c5d7e9d14d1e2961be3
byte-identical on disk and in Git at HEAD`, `status=BRIEF-ACCEPTED`, `224
declared product files`, `25 declared child(ren)`, `argv file-first under 24
fixed root(s)`, `5 byte-identity carrier(s) declared SUPERSEDED under a PM
line recorded by sha256 0c2d0db53471`.

**`--ci --package H3`**: the same named refusal, **exit 1**.

That is the same refusal name at the same exit code as at `da9f8683`, which
is X1 measured once more on the final bytes: the runner grew a role and
neither sealed package notices. It also exercises P-A1 at the run level -
both packages resolve their supersessions through the STRENGTHENED terminal
test, against `DECISIONS:527` and `:160`, and both still resolve.

I did not re-run the six `s9-*` mirrors, their six `s8-*` siblings or the
four `CHILD_SPECS` suites: this round touches none of those files (measured,
section 6), so R2's measurement of them stands unchanged, including the
PRE-EXISTING `setup.test.mjs` `not ok 151` that R2 took at the branch base.

---

## 5. THE THREE ATTACKS, EACH REFUSED BY NAME

Run against the head runner, with the refusal text printed rather than
asserted, so the name is measured and not inferred:

- **A3, a line ending `NOT RULED`** (and its temporal twin, `not yet RULED`):
  `RELEASE-RULING-IS-NOT-A-RULED-LINE DECISIONS:10; a release stands on a
  RULED ledger line of the chain branch and on nothing else, and a ruled
  line is one whose LAST clause is the bare word RULED`. The supersession
  half refuses the same line as
  `GATE-SUPERSESSION-RULING-IS-NOT-A-RULED-LINE`. Both codes are in
  `FAIL_CODES`.
- **A release with no bound parent**: `RELEASE-WITHOUT-A-BOUND-PARENT
  rebuild/m3/w7-preview/today/build.mjs
  rebuild/m3/w7-preview/today/preview.css; DECISIONS:536 (2) releases a path
  OUT OF a parent seal ...` - and it names both paths whose parent pin would
  have gone unchecked.
- **NEW-1, an ancestor block at a sha the grandparent never sealed**:
  `ANCESTOR-RELEASED-BLOCK-IS-NOT-THE-GRANDPARENT-PIN
  rebuild/m3/w7-preview/today/preview.css; the released block records
  aaaaaaaaaaaa and rebuild/m4/spec/acceptance-s8-fixture.json pins it at
  4ee865c982c5`.

And the controls hold: the honest ruled line still frees both paths and
still grants the five carriers; the honest released block still skips both
paths and still says how many it stood aside for; B.8 (12)'s no-op is still
a no-op.

---

## 6. RED FIRST, THE FENCE, AND E FACT 7

**RED FIRST, verified by running it, not by reading the commit message.** I
checked out `0d9cdeb8` in a worktree of its own: the runner there is the
UNCHANGED `25ddc44c32d0d71b924cf62c2e0a8647697b6e77a55a91a132388217b6789ca6`
and the two suites measure `gate-supersession` **15 pass / 1 fail** and
`release-from-seal` **18 pass / 3 fail**, the four failures being exactly
(P-A1) x2, (P-A2) and (P-A3). (P-A4) passes there, as the report says it
does by design, because it pins H13 by reading the runner's text. The hunks
land in the next commit, `c18fa1bd`, and take both suites to 16/0 and 21/0.
The commit message's failure list is true.

**THE FENCE.** `git diff --name-only aa42ded0..c3d58264` is **eleven files**
and every one is on this ticket's owned list: `b-package.cjs`, the two
tooling suites, the seven `packages/*.json` re-pins, and the author report.
Nothing under `rebuild/lanes/c/`, no `rebuild.yml`, no
`measure/test/boundary.test.mjs`, no `today/test/package.test.cjs`, no
product file, nothing on the WAIT list, no `DECISIONS.md`, no
`lanes/STATUS.md`. Nothing sealed, no receipt, no artifact, no `--full`.

**NO EM DASH AND NO EN DASH.** I decoded every added line of this round: 611
added lines, U+2013 count **0**, U+2014 count **0**, and exactly one
non-ASCII character in total, the U+00B7 of `RULED_CLAUSE_SEPARATOR`. I also
checked the whole lane, `da9f8683..c3d58264`: across every runner line this
lane has ever added, U+2013/U+2014 count is **0**. (The 263 em dashes in
`b-package.cjs` are all older text from previous tickets, none of them
touched.)

**E FACT 7, verified field by field.** Seven specs, `H3`, `S3`, `S4`, `S5`,
`S6`, `S7`, `S8`, one changed line each, and in every one the changed field
is `tooling.runnerSha256` and nothing else: I parsed each JSON and listed
every 64-hex value that is a runner sha, and `tooling.runnerSha256` is the
only one, with one correct exception - `S8.json`'s own
`product["rebuild/lanes/b/tooling/b-package.cjs"].post` still carries
`e31dd206...335e`, which is S8's sealed product pin and which E fact 7 does
not re-target. The value re-pinned is
**`32916e509df0e38e4cb464a4b30c871f880d11a849958c5d7e9d14d1e2961be3`**,
which is the runner on disk in the farm, the runner on disk on the PC
(`certutil`), and the runner in Git at `HEAD` (`git show HEAD:...`), all
three equal; 3638 lines. `B-NTC`, `B1`, `B2`, `B3`, `B4` still carry
`4482bb8a...`, correctly untouched. The re-pins are the LAST commit before
the report, after the last runner byte.

---

## 7. NOTES

**N1. The precondition is stable, but it is a per-ref fact and the chain ref
moves.** It was true at `4e832c2a` (author), `4d2112c9` (farm) and
`7546a9e0` (the PC, 565 lines, at the time of this review). It stays true
without re-measuring, because a cite is a sha256 of the whole line: an
edited ruling line stops being located at all and refuses louder. No action.

**N2. The new rule also refuses a ruling line that carries NO U+00B7 at
all.** `split` on a line with no separator yields the whole line, so the
trimmed WHOLE LINE would have to be the bare word `RULED`. That is a
tightening beyond "the last clause", and it is invisible today because all
eight cited lines carry four or five clauses. **It is a live instruction for
the PM**, who writes the `RELEASE-FROM-SEAL` line and the THEME line after
this review: the line must end with the separator followed by the bare word,
`... U+00B7 RULED`, and not merely with the word `RULED`. The runner will
refuse `RELEASE-RULING-IS-NOT-A-RULED-LINE` otherwise, and the refusal will
look like a mystery rather than a typo.

**N3. One clause of this round is killed by nothing, and I am reporting it
rather than passing it.** Reverting `if (!out.has(file))` at `:2068`
(first-writer-wins) to last-writer-wins reddens NOTHING across all ten
suites. I probed why before calling it: dropping the grandparent argument
from `releasedAncestry()` entirely ALSO reddens nothing, so the tie-break
lives inside a half the runner's own comment already declares a no-op on the
reachable chain and the PM already accepted as defence in depth. It is
therefore not a new uncovered guard; it is the interior of an accepted
unreachable one. **But P-A3 gave it a consequence it did not have before**:
when two ancestors name the same path, the tie-break now decides WHICH
`lastSealedSha256` is measured against the grandparent's pin, and with the
grandparent's own block winning that comparison would be self-referential.
If the PM wants it covered, the cost is one fixture line - a `released`
block on `GA_FILE` in `release-from-seal.test.cjs` - and no runner change.
**Not blocking: no reachable behaviour depends on it, and the bar proves the
enclosing half fires nothing.**

**N4. STOP-2 versus P-A3, which the author self-reported (report 11.7), and
I agree with the author.** Spec F.2 STOP-2 admits exactly two changes inside
`pins()` and P-A3's assert is a third. It should nonetheless stand: the PM's
ruling names that assert, at that site, with that comparison, so the change
is the PM's and not an author's; it NARROWS the set of paths that leave the
walk unchecked; and the only paths that reach the new line are the ones
H17's `continue` already skipped. STOP-2 exists to stop an author moving the
seal's own walk to make a design work, and this is the opposite motion. **It
is the PM's word to say, and the revert is one assert plus one Map-for-Set
if he reads STOP-2 strictly; (P-A3) is the cell that would go red.**

**N5. Two small numbers in the report are off, and neither changes a
conclusion.** Section 11.9 says "583" added lines; I measure **611 added and
71 deleted** over the eleven files. Section 11.1 says "48 cited line-sha256
fields" under a method that walks `packages/*.json`; the honest split is
**47 in `packages/` plus the runner's own `SUPERSESSION_STANDING_RULING`**,
which the table beneath it does show correctly. The substantive claims under
both sentences - zero em dashes over every added line, and all eight ruling
lines passing - are confirmed.

**N6. R2 N7's two corrected cites are real at this head.** `:3573-:3577` is
the `AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY` say with H13's filter, and
`:2131-:2141` is the `gkept` say with H17's skipped clause. I read both.

**N7. What I did not verify.** Anything that seals; `packages/S9.json` and
the rest of the WAIT list; GitHub CI on both operating systems for this
head; the real `RELEASE-FROM-SEAL` ledger line, which does not exist yet;
and the six mirrors, their siblings and the four `CHILD_SPECS` suites, which
this round does not touch and which R2 measured at this branch base. I read
no private file, no `ledger/`, no `src/history.js`, and no cell of this lane
reads the real ledger for a release line.

---

## 8. THE RECORD

- Head reviewed: `c3d58264d5c8778ad0db9662fe34ea9c75249516`
- Final runner sha256: `32916e509df0e38e4cb464a4b30c871f880d11a849958c5d7e9d14d1e2961be3`
  (3638 lines; equal on the PC disk, in Git at `HEAD`, and in the farm)
- Bar: ten lane-B tooling suites, **130 pass / 0 fail**, all exit 0
- `--ci --package S8` and `--ci --package H3`: `SEALED-PROFILE-RECOMPUTATION`,
  exit 1, both, which is the state at `da9f8683`
- Reviewer: cowork (Earned lane hand), independent re-check, round 3
