# SEAL-AUTOMATION - independent review R1

Reviewed head `5bad0dc81ea651100f7824627be4f7fb1c82db8f` on `rebuild/b-seal-gen`, in
`%TEMP%\earned-sealgen`, against base `2758edc`. The author's report was read AFTER the
code and after the proof had been re-run here; every number below is one I measured in
this worktree, not one I copied.

## VERDICT: REJECT

Two BLOCKING items, both small, neither of them in the part of the work the proof covers.
The generator and the replay are real and they are not circular; I could not break the
core claim and I tried. What blocks is a guard that is missing on the one thing the
generator MEASURES rather than mirrors, and a chain stage that will push whatever branch
it is standing on.

## 1. The proof is NOT circular, and here is why I believe it

This was the first thing I attacked, because `--post-head 82c98f8` is handed to the
generator and `82c98f8` is also the commit the comparison reads. It is not circular:

- Everything the generator WRITES is produced from blobs at `--base 1af78de`, the merge
  before any S8-PREP commit (`run()`: `const parentRev = ctx.base`, and every
  `M.blobBytes(root, parentRev, ...)` under it). The comparison target is the blob at
  `82c98f8`. Two different commits, one before the round and one after it.
- `--post-head` is used for four things only: the `post` sha of each declared path, the
  candidate set (`diff(parentSeal..postHead)`), the ledger text, and the lane cell list.
  The first three are exactly the second pass the report describes in section 6 (apply the
  generated tree, then re-run with `--post-head HEAD`), so the replay is running the
  generator in the mode a real round would use at that point, not in a privileged one.
- The fourth one I measured, because it is the one that could have handed over an answer:
  `git ls-tree rebuild/lanes/d/p3-real-shape/` returns the same 8 entries at `1af78de` and
  at `82c98f8`. The lane cell list was not given to it by the answer commit.
- Independent of the cell, I ran the generator myself and compared its ancestor spec
  output with the committed files: `H3 S3 S4 S5 S6 S7` all come out byte-for-byte equal to
  the blob at the base, and to the blob at the post head, once the one `runnerSha256`
  value is normalised (35098 / 38378 / 42795 / 51063 / 84681 / 83327 bytes, equal on both
  sides). That is a whole-file identity the cell never asserts, and it rules out the
  reformatting hazard I went looking for (a regenerated `packages/*.json` with different
  JSON spacing would have moved six pinned product shas).
- The three token lines: I recomputed `sha256` over the line bytes myself and found all
  three in `rebuild/DECISIONS.md` at HEAD, at lines 525, 526 and 527, and confirmed
  `spec.authorizations.theme.line` and `spec.brief.acceptedLedgerLine.line` are the same
  bytes as the ledger lines they hash to. The leading dash is included and the newline is
  not, which is what `claim()` reads.
- The red control (REPLAY-11) does move something the cell asserts, and it is caught.

## 2. My replay numbers

`node --test rebuild/lanes/b/tooling/gen/test/replay-s8.test.cjs`, with
`MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York` each on its own line of a .cmd:

```
facts compared 800, identical 791, UNEXPLAINED 0
byte-identical files 4, prose-only 9, test titles 1, ordering 2
# pass 11  # fail 0   duration_ms 42198.8
```

Identical to the report, first run, no re-run needed. Generator run standalone:
`declared 226 paths {"edited":24,"carried":182,"superseded-by-child":1,"new":19}`,
`parent pins re-hashed 206, mismatches 0`. The committed S8 declares 224 with
`{"edited":24,"carried":182,"superseded-by-child":1,"new":17}`: same histogram, the two
extra `new` are the two p3-layout-v2 cells (see N4).

With `GEN_REPLAY_NEEDLES=1` the same cell is **RED**: `# pass 10 # fail 1`, REPLAY-10
fails with 24 UNEXPLAINED, every one of them a needle the generator did not record. See
B1 and N2.

## BLOCKING

### B1. A needle is NOT measured the way `children()` runs it: the env is a different env

`gen/lib/measure.cjs` says, in its own header, that rule (2) is "a child needle is MEASURED
by running the child the way `children()` runs it (b-package.cjs:2190-2231)". It then uses

```
CHILD_ENV_FIXED = { NODE_OPTIONS:'', NODE_V8_COVERAGE:'', TZ:'America/New_York', MEASURED_TEST_NOW:'2026-09-03' }
runChild: env = Object.assign({}, process.env, CHILD_ENV_FIXED)
```

`children(s, env)` at `b-package.cjs:2190` does not build that env. It is handed the env
`laws()` builds at `b-package.cjs:2085`:

```
const env = { ...process.env, NODE_OPTIONS:'', NODE_V8_COVERAGE:'', TZ:'America/New_York',
              MEASURED_TEST_NOW:'2026-09-03',
              ENGINE_MAIN: bundles.main, ENGINE_OLD: bundles.old,
              EARNED_CLIENT_DIR: path.join(root, 'rebuild/client') };
for (const key of ['PL_ENGINE','PL_LAWS_LIB','CONFORM_MUTATE_LAWS','CONFORM_ADAPTERS_DIR']) delete env[key];
```

Three variables the child is guaranteed under the runner are absent under the generator
(`ENGINE_MAIN`, `ENGINE_OLD` from `Reference.create(root)`, and `EARNED_CLIENT_DIR`), and
four the runner DELETES are inherited by the generator's child from whatever shell the PM
is sitting in (`PL_ENGINE`, `PL_LAWS_LIB`, `CONFORM_MUTATE_LAWS`, `CONFORM_ADAPTERS_DIR`).

Why this is blocking and not a note: the needle is the one fact in the package that is
measured rather than mirrored, and a `# pass N` is exactly the kind of number that moves
when a suite branches on an env var. A needle measured under env A and then matched by
`children()` under env B is a package that refuses at `CHILD-NEEDLE-NOT-A-TERMINAL-LINE`
in chain A at best, and at worst is green for the wrong reason. The replay cannot catch it:
its default mode measures nothing (it re-runs one child with the COMMITTED argv and only
asks whether the needle stands at a line start), and its all-25 mode is red for other
reasons and was not reported.

Symptom, measured: running the generator with `--stage all` on this worktree,
`children 25, needles measured 7` - 18 children exit 1 and the generator (correctly)
records no needle for them. I am not claiming the env alone causes all 18; the tree has
moved a long way past `82c98f8` and the mirrored argv are S7-era children. But 7 of 25 is
not a measurement anyone can lean on, and the env difference is a fact in the two files.

Fix, smallest form: build the child env exactly as `laws()` does, including the deletions,
or state in the header and in the README that the needle is measured under a REDUCED env
and have `measureChildren` refuse to record any needle until it can be reproduced. Do not
leave a file claiming a line number as its authority while contradicting it.

### B2. `seal-chain.cjs` stage b6 pushes whatever branch HEAD is

`commandFor(... 'b6')` returns `git push -u origin HEAD`, and `startStage` writes a .cmd
whose first act is `cd /d "<REPO>"` where `REPO` is resolved from `__dirname`, i.e. the
worktree this file is sitting in. I confirmed the exact body with `--stage b6 --dry-run`:

```
cd /d "C:\Users\joeym\AppData\Local\Temp\earned-sealgen"
git push -u origin HEAD > "...\sealgen-chain-b6.log" 2>&1
```

Nothing checks which branch HEAD is. `gen/` is lane B tooling and will live on the chain
branch; the day someone runs `--stage b6` from a worktree standing on
`rebuild/t2-client-core` (or on `main`), that is a push to the chain branch performed by a
script, which is the thing the stop-the-line rules name. The author clearly thought about
this - b7, the fast-forward, is a `hand` stage and says "this lane never pushes that
branch" - so the guard is missing, not refused.

Fix: refuse in `commandFor`/`main` when `git symbolic-ref --short HEAD` is `main` or
`rebuild/t2-client-core`, or require `--branch <name>` and push that name explicitly.
Three lines, and it makes the stage say what it means.

## NOTES

### N1 (MAJOR). The cell's "narrative" tolerance can swallow a real code difference

`replay-s8.test.cjs` forgives a differing code line when `stripStrings(A)===stripStrings(B)`
and `isNarrative(B)`, where

```
isNarrative = l => /^test\(/.test(l) || /assert[A-Za-z.]*\([\s\S]*,\s*['"]/.test(l);
```

That second branch matches ANY assert line that has a string anywhere after a comma, not
the message argument specifically, and `stripStrings` blanks every string on the line, not
only the last one. So a wrong string ANYWHERE inside an assert expression is tolerated as
long as the line also carries a message. Demonstrated on real committed lines from
`82c98f8:rebuild/m4/workout/test/s8-supersede-second-gate.test.cjs`, using the cell's own
two functions verbatim:

```
committed: assert.deepEqual(READERS.filter(r => typeof B[r] !== 'function'), [], 'every reader ...')
mutant   : assert.deepEqual(READERS.filter(r => typeof B[r] !== 'MUTATED-function'), [], 'every reader ...')
-> classified "narrative", not counted as a difference
```

Nothing slipped through in THIS round (the run reports exactly one narrative line and it
is genuinely an F7 test title), so the S8 result stands. But the line the cell draws in its
own header ("MECHANICAL ... must be BYTE-IDENTICAL") is wider than the code enforces, and
the red control does not exercise this path at all: REPLAY-11 is caught by the named
`fact()` checks in REPLAY-2 and REPLAY-3, never by `compareFile`. Narrow `isNarrative` to
`test(`/`it(` titles and to a string that is the LAST argument, and add a control that
mutates a data string inside an assert expression.

### N2 (MAJOR). `GEN_REPLAY_NEEDLES=1` is red, and the report does not say so

Report section 5 reads "The replay test measures one ... and does all 25 under
`GEN_REPLAY_NEEDLES=1`". Measured here: that mode fails, `# pass 10 # fail 1`, with 24
needle facts UNEXPLAINED, every generated needle being the `TODO_BLANK` string. The honest
statement is that the all-25 mode CANNOT pass from this worktree, because a needle is a
property of the tree at the head being sealed and the cell runs the children against the
checked-out tree, which is hundreds of commits past `82c98f8`. Requirement (g) of the
ticket is therefore proved for the MECHANISM on one child and not for the facts. Either
gate that mode on the worktree being at the post head, or rename it so nobody reads it as
"the fuller proof".

### N3 (MAJOR, one line to fix). `hash-lines.cjs` will hash a CR into a token line

It does `readFileSync(arg,'utf8').split('\n')` and hashes each line. `final-lines.txt` is
written LF by the generator, but the PM fills the blanks in an editor, and a Windows editor
that saves CRLF makes every hash `sha256(line + '\r')`. This sits on the one path where a
wrong sha costs a chain round: the line is appended to the ledger, the package pins the
hash, and `claim()` then finds nothing. Strip a trailing `\r` (or refuse a file with CRLF
and say why). The generator itself is clean: I checked every file it writes under
`tree/` and found 0 bytes of `\r`, and the blobs it mirrors from carry none.

### N4. The two extra declared paths are NOT explained in TODO.md

Report section 3.5 says the generator "names both in TODO.md with that reason" (the
DECISIONS:524 N1 ruling). It does not. Entries 49 and 50 of the generated TODO.md read the
same generic sentence as the seventeen genuinely new paths: "role:new and the parent does
not pin it - confirm the PM means to declare it (DECISIONS:487 stop 7 ...)". The `:524 N1`
wording only appears when `--exclude` is already passed, which is the case where the PM
has already decided. REPLAY-4's `assert(todo.includes(f))` therefore passes trivially: every
new path is listed. The behaviour is defensible; the report's description of it is not.

### N5. One silent drop in `buildPackage`

`if (/\.md$/i.test(f) && !(f in parentPins)) continue;` drops a new `.md` from the
candidate set with no TODO line, and it is the only skip in that loop that says nothing.
DECISIONS:519's slice-deploy trigger is exactly a new `.md`
(`rebuild/slice/pwa/DEPLOYS.md`). A one-line TODO entry keeps the file's own promise that
everything it could not decide is named.

### N6. REPLAY-6 compares nothing across the two sides

Its 13 facts are 7 generated-against-generated and 6 committed-against-committed
(`rr.tooling.runnerSha256 === realSpec.tooling.runnerSha256`). The report is honest about
WHY the value cannot match (comment prose moves the runner bytes), but those 13 facts are
counted inside the headline 800, and the set of ancestor specs is a hardcoded list in the
cell rather than a comparison against the specs the round actually re-pinned. Say "787
cross-side facts" or compare the SET of re-pinned specs, which is a fact the round did
commit.

### N7. The ORDINAL detector buries the TODO list it is supposed to focus

`ORDINAL` matches the bare word `second`, so a cell named `second-gate` produces a wall of
false alarms: of the 67 TODO entries in my run, entries 8 through 21 are all the word
"second" inside `s8-supersede-second-gate.test.cjs` ("(gate second-gate)", "re-run in a
second", "a second, independent source of bytes"). TODO.md is the first thing the PM reads
and it is the generator's whole answer to "what could I not decide". Teaching the reader to
skim it is a real cost. Drop `second` (and probably `generation` on its own) or require an
ordinal to stand next to a digit, an id or a family word.

### N8. A path the generator says the runner will refuse is still declared

In `buildPackage`, the `role === 'new' && pre !== null && pre === post` branch pushes the
TODO "this path cannot be declared new" and then falls through to
`product[f] = { pre, post, role }`. Either `continue` like the `--exclude` branch above it,
or change the wording. Today the file says one thing and the JSON says another.

### N9. `--post-head` defaults to `HEAD` with nothing checking it belongs to the round

`postHead = M.revParse(root, o.postHead || 'HEAD')`. A PM who forgets it on the first pass
measures every `post` against an unrelated tip. The run does print "the post head carries
<other sha>" for the runner, and `REPORT.json` carries `runnerAgrees`, but nothing refuses
and nothing lands in TODO.md. A cheap guard: if `postHead` is not a descendant of `head`,
say so as the first TODO line.

### N10. `propose.cjs` does not propose, but chain stage a5 is listed as `[run ]`

`propose.cjs` compiles the runner to its main-sequence boundary, confirms `proposed` is a
function, prints four lines saying it will not assemble the spec/bound pair, and exits 0.
That is an honest stub and the report says so in section 5, but `seal-chain.cjs` marks a5
`run` and prints it as the stage that writes `acceptance-<slug>.json`. A stage that exits 0
having written nothing is the kind of green a chain script should never show. Mark a5
`hand` until the assembly exists.

### N11. `--dry-run` still prints "started detached"

`startStage` returns before spawning, and `main` prints "started detached" and a poll
command regardless. Minor, but it is a script whose whole value is that you can trust what
it tells you it did.

## What I checked and found clean

- `git diff --stat 2758edc..HEAD`: 10 files, 1630 insertions, 0 deletions, all NEW. No
  read-only file of this lane is touched: not the runner, not any `packages/*.json`, not a
  receipt, not an acceptance artifact, not `.github/workflows/*`, not `rebuild/engine`,
  `rebuild/coach` or `rebuild/DECISIONS.md`.
- No `U+2013` and no `U+2014` in any of the 10 files (checked by code point, not by eye).
- No `mklink`, no junction creation, no reference to `rebuild/conform/private` outside one
  comment saying it is never read, no `EarnedPort`, no `appendFile`, no write to
  `DECISIONS.md` anywhere in `gen/`. `DECISIONS.md` is only ever read as a blob.
- `--full` cannot be reached. `--stage a7` refuses without the flag; I also ran
  `--stage b2 --pm-runs-full` and it STILL does not run it, it names the PM's own
  `s<N>-full<K>.cmd` and exits. That is stronger than the ticket asked for.
- Every product sha comes from `git cat-file blob <rev>:<path>`. I found no `readFileSync`
  of a working file anywhere on a measurement path (the only two are `propose.cjs` reading
  the runner it compiles, which is correct, and `hash-lines.cjs`, see N3).
- `pre` is re-measured from the source base rather than copied from the parent's `post`,
  and a disagreement becomes a TODO line rather than a silent carry. That is the right way
  round and it is the check DECISIONS:511 states by hand.
- Deleted and renamed paths: a path absent at the post head is pushed to `undecided` with
  a reason and never declared. Correct refusal.
- The `released` role is only ever produced from `--released`, requires the parent to pin
  the path, sets `post: null`, and the B.6 / risk R2 collision check against child argv
  targets is real code, not a sentence.

## For the PM

If B1 and B2 are fixed as described, I would accept this. The replay is a real measurement
of a real round, it reproduced here first time, and the parts I attacked hardest (the
ancestor re-pins, the token line rule, the role and sha computation) came back stronger
than the report claims rather than weaker. What I would NOT do is let S9 take a needle from
this generator until B1 is answered: every other number it produces has a second witness in
Git, and that one does not.
