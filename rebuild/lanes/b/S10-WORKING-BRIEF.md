# S10 working integration brief

Status: WORKING PAPER ONLY. This brief does not authorize an S10 build, seal,
merge, deploy, import, engine change, owner option, or copy choice.

Revision 2 of the working paper adopted at DECISIONS:699 (ffc10ea, independent
review ae96e30). Line numbers `:N` cite `rebuild/DECISIONS.md` on
`origin/rebuild/t2-client-core` at d9464f2 (780 lines; it differs from
37a18d21 only by the added :780). This revision folds only inputs that exist
on 2026-09-23 so that S10 can start the moment S9 seals:

- the CUI sequencing fold already recorded as paper-of-record caa0abf (:740),
  itself binding :732 and disposition a12be09;
- the accepted GSS input 66d32530 and its Claude closure notes (:765, receipt
  1b41692 `astra/GSS-CLAUDE-CLOSURE-2026-09-22.md`, review 31c88922);
- the TODAY-SPLIT build base b35a48e3 with D-SPLIT-PARENT and the :633 debts
  (:633, :662, Claude 324b994a, Astra L3 175f6323 and L4 84302990);
- the four S-R30 exceptions and the deferral guard (:626);
- the EPP engine-repair carriage and D-EPP-1/3/4 (:631, :644, f0a5eb1a);
- round 2: the debts of Claude Fable 5.1 review
  REVIEW-S10-WORKING-BRIEF-l1.md (sha256 606eb3cf..., ACCEPT WITH NAMED
  DEBTS) and the PM's rulings Q3 and Q5, cited as "PM ruling, DECISIONS:780,
  Claude Opus 5.5 PM" (:780 read whole at d9464f2); Q1/Q2 rest on :635 and
  :778 alone;
- round 3: the debts of review REVIEW-S10-WORKING-BRIEF-l2.md (sha256
  a29f0279..., ACCEPT WITH NAMED DEBTS).

Prepared from the accepted TODAY-SPLIT build base
`b35a48e35a1f3e3c278c377934794a32b632535b`, its Astra L4 and Claude review,
the accepted GYM-SETTINGS-WRITER-SEAL input, the EW2 build brief, and the
later rulings through :780. Every value labeled STOP or INPUT REQUIRED below
must come from the final accepted input, never from this paper. Values marked
OBSERVED were read from a named non-final commit and must be re-measured.

Binding sequencing fold: DECISIONS:732 and independently reviewed disposition
a12be09 (paper-of-record caa0abf, :740). Accepted CUI0/S9 pins precede S10;
accepted CUI1 does not. Every existing GSS, source-closure and section 8
copy-lock STOP remains. This fold authorizes no build, token, pin promotion or
automatic queue dispatch.

## 1. Purpose and non-goals

S10 is the integration and reseal that places the accepted writers-out Today
split and the later accepted gym-settings writer change on one actual S9
parent. It releases the named view files, keeps durable writer decisions in
sealed siblings, installs a real copy lock, updates declarations and execution
pins, and proves the resulting exact bytes on both required platforms.

This is not a second split design round. It does not implement EW2 product
work, TODAY-MODEL-HANDOFF, TODAY-OUTCOME-TYPE, GYM-START-IN-PAINT, an earn-on-
phone option, or a design transfer. It does not use the pure-cut proof to bless
later authored writer logic. EW2 suite work B0-B4 and B1a may precede S10, but
EW2 product bytes remain after S10.

GYM-SETTINGS-WRITER-SEAL stays BEFORE S10 (:626 S-R30 (1)); its accepted input
is now named in section 6.2 (:765).

After S10, reseal children are ordered (:626 S-R30 (2)):

1. TODAY-MODEL-HANDOFF.
2. TODAY-OUTCOME-TYPE, including D-SPLIT-LISTEN (:662) and D-GSS-LISTEN
   (:707 "LISTEN stays TODAY-OUTCOME-TYPE"; 50e2886: gym-app's hooks.listen
   drops a fourth argument silently, "PAYS: the same ticket, one refusal for
   both shims").
3. GYM-START-IN-PAINT.

Also after S10, and not ordered against those three by any ruling found: the
named, independently reviewed reseal child that promotes completed CUI1
references and pins (:732; a12be09 A6). See section 14.

Each child owns its own brief, proof, review, pins, reseal, and CI. None is
silently folded into S10.

## 2. Required inputs and hard stops

The integrator writes an input table before touching product bytes. Each row
has exact 40-character commit, tree or blob identities, acceptance citation,
review file, and role.

| Input | Required state | STOP |
|---|---|---|
| S9 parent | Accepted integrated S9 commit, runner, release machinery, declarations, workflow and all final S9 pins, including retained runtime references and the whole approved pack (:732 A1/A2) | No S10 branch or package until this exact parent exists. |
| TODAY-SPLIT | Accepted build base `b35a48e35a1f3e3c278c377934794a32b632535b` (:662) or an explicitly reviewed successor | Any product change after that head requires its own disposition. |
| GSS | Accepted input `66d325308bc584950163c1c177799ce4953fa298` on rebuild/c-gss-g6-g8-proof; chain 04ea69e (:701, Claude l1 50e2886 ACCEPT WITH DEBTS :707) -> 79d981a7 (:754, :759) -> 66d32530 (:765). Supersedes the ffc10ea row "Candidate 04ea in independent L3 review" | Accepted as product input only, not package; hosted evidence is owed at the composed S10 candidate (section 10.2; :627, :565); integration and S10 reseal owed (:765). |
| Copy lock | Accepted design/copy declaration including screens not yet ported (:732 A4) | No released on-screen copy may enter the seal without it. |
| C-UI | Accepted CUI0 including its independent audit, actual S9 reference/whole-pack pins and both-platform evidence (:732 A4; caa0abf) | Accepted CUI1 is not an S10 prerequisite (:732). Both-platform execution alone remains insufficient without required independent acceptance. |
| EPP | Whether the accepted S9 parent carries the engine repair (:631 O-1a) | Section 7.2 decides what S10 owes; unknown until S9 seals. |
| S10 declarations | Final S9 inventory schema, S10 package id, product and execution maps, child rules | Do not copy S8/S9 counts or field shapes by memory. |

Current readiness on 2026-09-23 is deliberately incomplete. The split is an
accepted build base (:662). GSS 66d32530 is Claude-accepted as product input
on a static review with independent 8/8 execution retained (:763, :765), and
its lane exact-head full CI is red at step 13 (:763, :765): a lane step-13
red of one of the two design-class families, :627's chain-tip refusal
(SEAL-BASE-IS-NOT-THE-CHAIN-TIP) or b98f375's sealed-profile refusal
(SEALED-PROFILE-RECOMPUTATION); the name at 66d32530 is unread. It proves
nothing either way and no lane diagnosis is owed (section 10.2). The
S9 integration branch holds a PROPOSED package at fe9f14b with final seal,
Claude review and both-OS CI still owed (:775, :776). No accepted copy lock
or S10 package id exists. This paper is preparation, never permission to
bypass those stops.

### 2.1 STOP placeholders that only the S9 seal can fill

Each is filled from the final accepted artifact, never from this paper or a
proposed branch. Until filled, the row is a STOP.

| Placeholder | Source when it exists |
|---|---|
| `S9_PARENT_COMMIT` (40 hex) | The accepted S9 seal and its ledger line |
| S9 final spec path and sha256 | The accepted S9 brief/spec as sealed |
| S9 product map and execution map, counts and field shapes | The sealed S9 acceptance inventory |
| S9 receipt/artifact sha and verdict | The sealed S9 receipt |
| S9 exact-head CI run ids, both OS | The accepted S9 closing record |
| `S10_PACKAGE_ID`, S10 brief path and sha256 | The PM, after this brief is final |
| RELEASE-FROM-SEAL, GATE-SUPERSESSION, THEME, BRIEF-BY-SHA lines and hashes | Section 11; written only by the PM at finalization |
| CUI0 acceptance citation and pins | The accepted S9 parent (:732 A4) |
| Copy-lock paths, eight answers and CI step | The accepted copy lock (section 8) |
| Whether EPP rides S9 | The accepted S9 inventory (section 7.2) |
| Observed blob ids of section 3.1 at the parent | Re-measured at `S9_PARENT_COMMIT` |
| Exact-head both-OS rebuild run id and conclusion at the composed S10 candidate | Step 12.14, under :627 and :565 (section 10.2) |
| Route that provides the real eslint-scope stack for D5 | Existing junctions, or an owner-approved route (section 6.1) |

## 3. Parent and source custody

### 3.1 D-SPLIT-PARENT

At the actual S10 parent, re-measure all three source blobs named by
`regions.json.sourceBlobs.s9`: `today-app.cjs`, `today-model.cjs`, and
`gym-app.mjs`. Compare actual blob ids to the table before a cut or generator
opens source.

If any differs, STOP. The required order is a new named ref, visible
re-witness, re-cut, byte equality, and actual DOM/listener cells again. The new
table and output receive independent review. An old cut proof is never reused
for changed input bytes.

A refusal on seal day is the instrument working, not a defect (Claude
324b994a D-SPLIT-PARENT: "Say it in the brief so a refusal on seal day reads
as the instrument working"). The claim that the S10 parent holds the pinned
source "stays true only while S9 part 2 and the chain leave those three files
alone" (324b994a, WHAT ELSE I MEASURED 3).

Expected ids, from `regions.json.sourceBlobs.s9` at b35a48e3 (read 2026-09-23;
equal to 324b994a's measurement):

| File | Expected blob (sourceBlobs.s9) | OBSERVED at S9 integration fe9f14b, non-final |
|---|---|---|
| `rebuild/m3/w7-preview/today/today-app.cjs` | `ea98aef614f29dfbf3ade5206fc877120bda3c9d` | equal |
| `rebuild/m3/w7-preview/today/today-model.cjs` | `6a146ff95a145f2f7835b35e9b86be8fcc840e5d` | equal |
| `rebuild/m3/w7-preview/today/gym-app.mjs` | `48bf0531fdbcccffe981bd3c4d2f44a91f7abd6d` | equal |

The fe9f14b column is a readiness observation by `git ls-tree` only, not the
check; the check runs at `S9_PARENT_COMMIT` (STOP until it exists).

Record the final parent commit, the three expected and observed blob ids,
`regions.json` digest, cutter/generator digests, and output digests. Refuse a
mixed ref, missing identity, unpinned product mode, changed buffer after read,
or source/table disagreement by name.

### 3.2 Exact parent diff

Before assembly, compare the chosen S10 branch to the accepted S9 parent using
explicit declared paths. Classify every hunk as M (pure moved byte), R
(declared rewrite), or N (new behavior). An unclassified hunk is a STOP.

No S9 artifact, report, accepted guard, runner clause, workflow condition, or
pin may change merely to make S10 green. A sealed-file change routes through
the S10 reseal. A released-file change still needs the review below.

## 4. File roles and owned integration surface

The final inventory is measured from the S9 parent. The following is the
minimum role map, not permission to assume an exhaustive list.

### 4.1 Product roles

- New or carried sealed siblings: `today-lanes.cjs`, `today-readings.cjs`, and
  `gym-settings-lane.mjs`. Their final GSS/split bytes receive product and
  execution pins where the final package schema requires them.
- Released and edited view files: `today-app.cjs` and `gym-app.mjs`. Their
  release is explicit. No child argument may quietly restore a seal pin that
  contradicts the final released role.
- Released build composition: `build.mjs`, with its final required-input list
  measured rather than copied from historical 48/51 or 26/29 counts.
- Final GSS inputs include `machine-settings-view.mjs`; its accepted post-GSS
  bytes become the S10 input. Earlier pinned-unchanged wording is historical.
- `food-model.cjs` and `sleep-model.cjs` remain pinned unchanged in S10 unless
  the final accepted parent expressly says otherwise.
- EW2 product files, admissions, adoption, routing, and screen work remain
  after S10. Do not retire or repoint the F2 dependency ahead of the product
  that consumes its final route.

OBSERVED product blobs at the accepted GSS input 66d32530 (`git ls-tree`,
2026-09-23; re-measure after merge onto the S9 parent, these are not pins):

| Path under `rebuild/m3/w7-preview/today/` | Blob at 66d32530 |
|---|---|
| `gym-settings-lane.mjs` | `40d59ee9261ce958ada7ba1e91046b7eba44d3d2` |
| `gym-app.mjs` | `d8ab53aa7e55f8bf31907a136f50ea811b663e7e` |
| `machine-settings-view.mjs` | `c8131055572ef598872ffbcfd7cf2b7c26ffc9ba` |
| `today-app.cjs` | `57b7ad2cf640591f79d1a2c05c01339cdffbb9eb` (same as b35a48e3, 324b994a) |
| `today-lanes.cjs` | `d66a80ef15cbe5a43f4c3760317df5694fa96e6f` |

b35a48e3 is an ancestor of 66d32530 (`git merge-base --is-ancestor`, exit 0).
Between them the diff under `rebuild/m3` touches only `gym-app.mjs`,
`gym-settings-lane.mjs` and `machine-settings-view.mjs` (plus tests below).
Outside `rebuild/m3` the same range also changes the writer fence
`rebuild/lanes/c/today-split/writer-fence.test.mjs` (+177 -45; blob
`f50a41a7cdd2c4bf906be3d83e81b89db96bcd36` at b35a48e3 ->
`09a6dd1832b33b39acac657463855842581103ef` at 66d32530, OBSERVED). It is the
tripwire that pins the S-R30 exception sites (:626 (3)(4)); see 4.2.

### 4.2 Tests and proof paths

Re-measure and declare every touched test. The known set includes the split
source-read tests (`food.test.mjs`, `problem.test.mjs`), final GSS tests
(`machine-settings-ui.test.mjs`, `gym.test.mjs`), the writer fence,
`package.test.cjs`, `setup.test.mjs`, and the measure boundary test when its pin
is re-homed. The final diff, not this list, decides the complete set.

GSS 66d32530 adds five test files under `rebuild/m3/w7-preview/today/test/`
relative to b35a48e3 (diff --stat, 2026-09-23): `gss-annex-g6-g8.test.mjs`,
`gss-annex-identity-reentrancy.test.mjs`, `gss-annex-log-timing.test.mjs`,
`gss-annex-remount.test.mjs`, `gss-annex-timing.test.mjs`; and edits
`machine-settings-ui.test.mjs`. It also changes
`rebuild/lanes/c/today-split/writer-fence.test.mjs` (4.1). Each needs a
declared product/execution role and a CI home; none is assumed registered.
The fence's rows for the S-R30 exception sites change only under a PM ruling
(:626 (4)); S10 records its final blob, role and CI step by measurement.

Fence changes in b35a48e3..66d32530 and the ruling behind each (measured by
review l2 a29f0279, `git diff` of the fence with explicit path, read whole):

- no today-app exception row changed: the 32 model sites and weigh-in, the
  food and sleep hooks and the twelve copy values have no touched row; the
  only today-app text is unchanged context and a new count row
  (GSS-GESTURE-CONTROL: today-app 0, today-lanes 2);
- paint's model.start: the seam text is byte-identical; its container drops
  the five gym writer seams and GYM_DECLARED_SITES goes 6 -> 1, with a new
  row re-pinning `await model.start()` and the six hooks.paint roots: :628
  G-R2 (the five seams sealed) and G-R5 (six-call-site shape);
- gym-app facade lane acquisition: RELEASED_FILES gym-app `lane:` loses its
  three facade.lane() spellings, replaced by api.lane exact-mapping rows:
  :628 G-R4; the Today facade (the 37 getters of :626) has no row in the diff;
- LISTENERS_OUTSIDE_SHIM gym-app 19 -> 0: :628 G-R3.

S10 re-asserts at the integrated bytes that no today-app exception row changed
and that each gym row above matches its :628 ruling; any other change is a STOP
under :626 (4).

Tidy-up listed for S10, not an edit made by this paper: LOOK_EDITS in the
fence keeps three dead keys for the removed facade.lane() spellings (fence
:1255-:1257 at 66d32530, per review l2). S10 (or GSS) drops them with a row,
never silently.

OBSERVED, non-final: `machine-settings-ui.test.mjs` is edited on three sides.
S9 fe9f14b edits it in aad0c62 (S9-PREP-A, +18 -1 against 8c2bc36e; blob
f5edb496 -> `6f70c0e2d824bdd19245c77f0328bd3b9dd13a77`); the split holds
`037e9624ec4073dd9957421966cb1e20713b3cff` (b35a48e3) and GSS holds
`5626b88f4353dc805ab3ce3828f82dee0d993543` (66d32530). At the S9 parent,
Track B's test is therefore a three-way merge, not an apply, and the 6.2
merge-forward rule fires by construction; this is expected, not a defect.

If S10 carries EPP (section 7.2), `rebuild/engine/test/proposed-pick.test.cjs`
joins this set.

Pure source-read repoints preserve assertions and are red-first. New writer
behavior receives new behavioral rows. No assertion deletion, expected-failure
conversion, denominator reduction, or missing test registration is allowed.

### 4.3 Declaration and execution paths

The integrator owns only the final explicitly commissioned S10 declaration
files: the current acceptance inventory successor, the S10 release/package
declaration, the accepted runner's S10 registration, and the existing
`.github/workflows/rebuild.yml` registration when the PM commissions that last
hunk. Do not create a second workflow or shadow runner.

Product and execution maps are separate. For every affected path, measure its
actual role, pre/post pin and coverage owner. Execution pins come only from the
runner, spec, brief, carrier and actual child argv; product-only data/design
assets are not forced into execution. An executed source still needs its proper
declaration, and all mirrors must agree on sealed/released role.

`today-app.cjs` and `gym-app.mjs` use pre=the bound S9-parent product pin and
post=null under the exact release grant; they must not collide with an
execution route. Check `today-model.cjs` against the actual parent product map:
never invent a release for a file that was not sealed there. Pin the accepted
post-GSS `machine-settings-view.mjs` bytes as :628 requires. Measure the final
product/execution roles of every changed test instead of assuming all tests
belong to both maps.

## 5. S-R30 released exceptions and review rule

Carry these four exceptions verbatim (:626 S-R30 (3)):

> the released view holds model at 32 pinned sites and converts the weigh-in text itself; the food and sleep hooks take DOM nodes and twelve copy values are injected by name; paint may call model.start at one pinned site; live lane power through the facade, pinned by acquisition site.

What S10 may claim, in the words :626 requires this brief to use, and no more:

> SO AFTER S10 THE RELEASED FILE STILL CAN WRITE, and what stands between a look ticket's mistake and the athlete's data is what S-R26 already said: the fence as a TRIPWIRE on every acquisition site, an independent review of every released hunk, and the PM's own read.

The deferral guard, verbatim (:626 S-R30 (4)):

> THE GUARD THAT GOES WITH THE DEFERRAL: any look-ticket hunk that touches a pinned exception site (the weigh-in submit, a food or sleep hook call, a facade lane acquisition, paint's start) gets the PM's Fable final whatever its tier, and the fence row for that site changes only under a PM ruling.

These are exceptions, not proof that released files are passive. Released
files still hold live writer-bearing objects. The fence is a tripwire, not a
semantic oracle. Every released exception-site hunk needs independent data-
path final review under the current Claude protocol and a PM read. Any new
exception, changed count, changed acquisition site, or widened capability is a
STOP and a named ticket, not a quiet table refresh.

The in-flight flag follows :626 S-R30 (5): the gym subjects in
GYM-SETTINGS-WRITER-SEAL, submitWeighIn in TODAY-MODEL-HANDOFF, recordIntake in
TODAY-OUTCOME-TYPE; recoverWorkout's hook is assigned to TODAY-MODEL-HANDOFF.
S10 authors none of these; the gym subjects' flag arrives as the accepted
Track B input (66d32530), and the other two stay with their tickets.

"The PM's Fable final" of :626 (4) is now a separate Claude Fable 5.1 reviewer
session, not a PM-seat act (:635 point 1, :778).

## 6. Two evidence tracks that must stay separate

### 6.1 Track A: pure cut

Reproduce the accepted split from the actual parent. Preserve source-door,
anchor, context, declaration, overlap, parsed-structure, output and report
checks. Compare generated `today-app.cjs` and `today-lanes.cjs` byte for byte
with an independent reconstruction. Run the DOM/listener equality cells on
the actual generated output. Record moved bytes and declared rewrites.

Track A may conclude only that the declared split preserved the measured
behavior. It cannot approve GSS N hunks, copy changes, or later ticket behavior.

Parser, DOM and platform proof remain owed at integration (:662). Claude
324b994a did not reproduce L4's 47/53 instrument count (20 rows failed on an
absent parser). Parser absence is not a pass or permission to install
(ae96e30). D5 (175f6323) requires "the real eslint-scope stack"; that stack is
provided only through the existing junctions or an owner-approved route. If
neither provides it, D5 is a named STOP (2.1), never paid by a substitute.

### 6.2 Track B: accepted GSS writer work

The accepted GSS input is `66d325308bc584950163c1c177799ce4953fa298`, not older
pre-annex or editor-only candidates (:765; 1b41692). This supersedes the
ffc10ea wording "Candidate 04ea in independent L3 review". Its chain, each on
its predecessor: 04ea69e (build on base b35a48e3, :701; Claude l1 50e2886
ACCEPT WITH DEBTS, :707) -> 79d981a7 (G6-G8 annex final, :754; Claude l2,
:759) -> 66d32530 (neutral repaint, :762, :763; Claude l3 31c88922, :765).

Apply only that accepted child to Track A's exact output. Carry its own
red-first lifecycle, focus replacement, exact API surface, pending/dispatch,
parity and D2 evidence. Re-run its actual mounted paths and writer fence at
the integrated bytes. Record actual M/R/N counts by physical hunk; do not copy
paper estimates.

Retained debts that S10 carries, by name (reconciled per review 606eb3cf
D-S10B-D2; this replaces ffc10ea's list "timer/dispatch residue, api.lane
passthrough census question, actual M/R/N counts, D2 annex coverage, and all
six inherited scope rows"):

- D-GSS-TIMER (:628): a programmatic click from outside every sealed scope is
  admitted at runtime and caught only by the static row; a computed spelling
  escapes both. Named residue, reported, not fixed by S10.
- D-GSS-PASSTHROUGH (:628): `api.lane` has zero readers by a spelling census;
  whether it retires "is a question for S10's brief after a
  destructure-aware census". S10 runs that census at the integrated bytes and
  reports it; retirement is a separate ruling, not an S10 hunk by default.
- D-GSS-LINES (:628): the builder reports M, R and N by physical hunk.
- The six inherited scope rows of the split (:653 "six inherited scope rows
  unavailable"; :662), still owed at integration.

Closed, not carried: the D2 census, "D2 count closes at12" (:707; 50e2886:
the paper's 13 "is a miscount, not a missing cell"); D-GSS-ANNEX-SILENT and
D-GSS-NEUTRAL-REPAINT (:765, 31c88922). Those two closures are static Claude
judgment with independent 8/8 execution and exact-removal reds (aab4fd1); do
not describe them as a new executed cell or CI result (1b41692). No parser or
archived-parent capability is invented.

If accepted GSS bytes depend on a source that differs at the S10 parent, STOP
and rebase by merge-forward with full reproof. Do not hand-apply a passing hunk
to a different parent.

This fires for `machine-settings-ui.test.mjs` (4.2, OBSERVED three-way edit).
The merged test is re-pinned from its merged bytes and re-run red-first on
both systems (the red at the pre-merge state recorded before the green) before
any Track B claim rests on it; no side's earlier result is reused for the
merged file.

### 6.3 GSS closure notes carried into S10 (:765; 1b41692)

Carried as written in the receipt; they qualify accepted scope and are not
authority to expand a sealed or data-path change.

- The original red 395bd581 and corrected red 669b467d remain immutable
  evidence.
- Cleared shared draft fields render the next view's prescribed defaults;
  blank inputs were not the contract (gym-app :388-:389 read by 31c88922).
- An entry typed during a held Log is cleared at acknowledgement on the
  existing ordinary path too (retained transient-input limitation; c6fb3017
  N1, reaffirmed 31c88922 N3).
- A revised Save can retain an earlier refusal message after a real successful
  write (unmeasured copy note; c6fb3017 N2, reaffirmed 31c88922 N3); no
  automatic repair grant. The copy lock covers every user-visible string
  state, including this one (PM ruling, DECISIONS:780, Claude Opus 5.5 PM);
  see section 8.
- `continuedLogBinding`'s unused `capturedEditor` parameter may be removed the
  next time the lane is touched (31c88922 N1). Do not start another round
  solely for that dead parameter. If S10 removes it, it is an N hunk in a
  sealed file and needs its own row and review.
- Help/Setup use the same repaint path as Why; assessed by reading, not
  separately executed rows (31c88922 N2).

## 7. S10 debt rows

### 7.1 Split debts (:633, retained verbatim by :662)

The following L3 debts (175f6323) are carried verbatim. Astra L4 (84302990)
repeats D3, D5, D6, D7 and D9 with identical text; Claude 324b994a carries them
unchanged.

- D3 / S10 writer cells: add repeated same-date readSleepCheckInView forcing forDate before EACH paint (M18), and inspect typed hours after successful save (M21); own traces remain read/paint/read/paint versus read/paint/paint, and empty hours versus "7.5".
- D5 / S10 instruments: rerun rows 12/13/14/16/32/33 with the real eslint-scope stack, independently exercise generator scope/binding outputs, and retain the uncovered-assignment no-write input; isolated tail checks are not generator-equivalence proof.
- D6 / S10 negative coverage: retain the earlier overlap-refusal debt, including competing replaces nested in a seam; no new overlap proof was commissioned or credited in L3.
- D7 / S10 evidence: validate or explicitly label headLines/closeLines as informational; incrementing either exits 0 with identical product bytes. The inventory correction to 182 witnessed regions plus 20 seams is verified.
- D9 / S10 instruments: classify the 21 L3 clause survivors listed below as equivalent or add branch-specific inputs; equal serialized observations do not establish general equivalence.

D9 survivors, verbatim:
`I042/I046/I047/I048/I052/I082/I088/I089/I094/I107/I172/I194/I196/I224/I229/I235/I236/I281/I289/I295/I301`.

L4's locator for D5, verbatim: "D5 numbering refers to L3; current rows are
identified by source lines 524, 539, 550, 614, 987 and 1028. D9's list remains
in the L3 review, unchanged." (84302990). L4 records D8 CLOSED by S-R32.

S-R33 (:633) adds a durable S10 boot-contract row for a plain options object.
L4's D4, verbatim: "D4 / S10 boot contract: S-R33 rules plain options objects;
the corresponding boot-contract row is still owed. Accessor options are outside
that ruling, not silently repaired here." The row proves the accepted
acquisition count and boot output at the integrated bytes.

D-SPLIT-PARENT (:662, 324b994a) pays in section 3.1.

D-SPLIT-LISTEN pays in TODAY-OUTCOME-TYPE (:662). Preserve the current
no-third-argument measurement (324b994a: 27 addEventListener calls in the base,
none passes a third argument) and scoped limitation; do not add a pre-S10 code
patch.

D1 and D2 remain owned by TODAY-GESTURE-PAINT-ROOTS and TODAY-OUTCOME-TYPE
(:633). Their inherited behavior is reported, not fixed or declared accepted by
S10.

### 7.2 EPP engine repair carriage (:631, :644)

The owner's O-1a (:631): the repair "RIDES S9 if it is accepted before S9's
part 2 is otherwise ready, and S10 if not; THE LOOK NEVER WAITS FOR IT." Claude
f0a5eb1a accepted the two clauses with named debts; the package is not accepted
or released (:644). No later ledger line through :780 records EPP acceptance or
S9 carriage (:780 rules only the payer if EPP rides S10). Which branch
applies is a STOP until the S9 parent exists.

OBSERVED, non-final (2026-09-23, at the PROPOSED S9 integration head fe9f14b):
`git ls-tree` finds no `rebuild/engine/test/proposed-pick.test.cjs`, and
`git grep proposed-pick` over `.github/workflows/rebuild.yml`,
`rebuild/lanes/b/tooling/packages` and `rebuild/lanes/b/S9-UI-PINS-BRIEF.md`
finds nothing (exit 1). So the S9 package as proposed today does not carry
EPP. This does not decide the branch; the STOP stands until S9 seals.

- If the S9 parent carries EPP: verify, do not redo. At the parent, the cell
  `rebuild/engine/test/proposed-pick.test.cjs` must stand in the S9 acceptance
  and run in `rebuild.yml` on both systems (D-EPP-1 PAYS "the integrator at
  EPP acceptance, and S9 part 2 before the seal"). If it does not, STOP and
  return to the PM; S10 does not silently absorb an S9 debt. If the wiring
  package did not pay D-EPP-4 (below), it is S10's by its own PAYS clause.
- If S10 carries EPP: it enters as its own reviewed input at engine tier
  (:631, :632), never as a Track A or Track B hunk, and S10 owes:
  - D-EPP-1, verbatim: "THE CELL GUARDS NOTHING YET. git grep for proposed-pick at the head finds 0 references in .github, rebuild/m4/spec and package.json, and .github names no file under rebuild/engine/test. Until the cell runs in the rebuild workflow on both systems and stands in the S9 acceptance, a later reconstruction of rebuild/engine can drop either clause silently."
  - D-EPP-3's declared departure and new pins for the sealed S8 keys
    `today.cjs` and `writers.cjs` (f0a5eb1a), with the owed gates it names
    (port oracle on the synthetic fixture, sensitivity pass, private gate,
    exact-head CI on both systems) named as owed, not claimed. D-EPP-3 names
    "the S9 seal chain" as payer; if EPP rides S10, D-EPP-3 moves with it
    and the S10 seal chain is its payer (PM ruling, DECISIONS:780, Claude
    Opus 5.5 PM).
  - D-EPP-4, verbatim: "THE CELL HAS NO SELF-SENSITIVITY GUARD. I carry the blind review's debt unchanged: its seven semantic mutants are killed, but deleting a row's main assertion stays green." It "PAYS: the package that wires the cell (D-EPP-1), or the S10 brief."
- Either way: exactly the two owner-worded clauses (:631). D-EPP-2 (a third
  engine change) needs the owner's word and is not S10's (:639, :644). D-EPP-5
  belongs to the live-app patch, not S10.

## 8. Copy lock

Before a released view is declared, insert the accepted C.6/:549 answers. The
required eight-answer contract states, without this brief choosing answers:

1. the comparison unit;
2. the observed client whose copy is measured;
3. the enumerated state set;
4. the policy for states/screens not yet ported;
5. the price/treatment of a legitimate record change;
6. the exact relationship between the copy arrays;
7. the machine on which reproduction is required;
8. whether and how that reproduction is enforced in CI.

It also names exact source/extraction ownership for released presentation copy,
sealed fallback reasons, generated/dynamic refusal copy, and all mirrors. These
are missing-input STOPs until the accepted lock supplies them; this brief does
not design substitute answers.

The lock must cover unported screens, actual composed-product enforcement and
coordinated deletion; these and source closure remain missing-input STOPs until
independently proved and accepted (:732 A4).

Scope of states: the lock covers every user-visible string state, including
the revised-Save stale refusal message (c6fb3017 N2; section 6.3) (PM ruling,
DECISIONS:780, Claude Opus 5.5 PM). This sets coverage, not the answers: the
eight answers above remain the accepted lock's to supply.

Run the lock on the actual composed product, not only on source fragments. Its
mandatory two-sided negative fixture deletes one sentence from both a rendered
screen and `APPROVED_COPY`; the lock must still refuse and name that missing
sentence. It must also catch copy moving into an unscanned file, duplicating or
changing ownership. Proposed EW2 wording and later ticket wording are excluded.
Missing answers, unresolved ownership, an uncovered screen, or a passing
coordinated-deletion plant is a STOP.

## 9. Ancestors, children, pins and mirrors

Build a final reconciliation table with one row per changed path:

`path | parent role/pin | S10 role/pin | execution owner | child effect |
mirror locations | evidence | reviewer`.

For every changed pin or role:

1. Name the old owner and why its pin changes or is removed.
2. Name the new owner and exact digest source.
3. Update every runner/package/workflow mirror in the same integration group,
   while keeping product and execution maps distinct.
4. Prove ancestor packages either remain byte-valid or are intentionally
   superseded by an accepted child rule.
5. Prove no child can re-pin a released file or omit a new sealed dependency.
6. For both released views, bind pre to the actual S9 parent and post to null,
   check the exact grant, and refuse any execution-route collision.

Run the accepted runner's own mirror and mutation rows. A marker-only match is
not proof. The workflow condition must be the complete permitted expression,
the runner path must be the actual runner, and every package id/root/child edge
must resolve at the exact candidate.

The workflow registration lands last, after the standalone new rows have run
on both systems. The workflow must invoke the accepted runner and the new tests
by real path. A green child command not reachable from CI is not closure.

S9's parent-pinned 09-08 reference documents remain carried unchanged unless
separately released by authority; S10 does not remove a parent's pins because
of the pre-S9 E17 selection (:732 A6).

## 10. Runtime and platform evidence

### 10.1 Rules

Before any command, inspect its complete relative import/child-process graph.
Use public synthetic fixtures only. No private corpus, old-app source, athlete
measurement, seal `--full`, receipt writer, or broad directory suite is used
for author iteration.

Never run an engine directory wholesale; inspect transitive helper reads before
any test; the quarantined EPP review scratch named at :645 and :658 is never
read, published, staged or deleted, and no private or legacy claim is
discharged by the EPP review (:645).

At the exact integrated candidate, record separately:

- the cut/instrument cells, including D3/D5/D6/D7/D9 and S-R33;
- split DOM/listener/copy evidence;
- GSS focused and mounted writer evidence, including the five gss-annex files;
- writer fence and all directly affected Today test files;
- complete Today step with honest inherited-red disposition;
- accepted public conformance and package `--ci` routes;
- the EPP cell and its departure evidence, if S10 carries EPP (section 7.2);
- copy lock and CUI preview checks where the final design contract requires;
- full public CI on Windows and Linux at the same commit.

Run one process at a time on the owner PC with fixed clock/time zone where the
test contract requires them. Linux and Windows reports name commit, source
digests, effective versions, mode, scope, counts and exits. A skipped, VOID,
refused, missing-dependency, unavailable-parser, or platform-only row is never
green evidence. Later success cannot hide an earlier failing gate.

### 10.2 Lane step-13 red and where hosted evidence is owed (:627, :565)

GSS exact-head rebuild run 35767357862 failed step 13 on Windows and Ubuntu;
metadata only, no cause inferred (:763, :765, 1b41692). Pipeline 35767357840
and shared-preflight 35767357849 passed; full CI remains red.

:627 rules this class: step 13, the standing cumulative S8 package step,
refuses on EVERY lane branch from the first append after its base, "WHATEVER
IT TOUCHES", and hosted CI "is measured at the merge-forward (:565) and not on
a lane"; the steps behind step 13 did not run, so on a lane hosted CI says
nothing about the lane's own cells. At earlier GSS heads (04ea69e, b35a48e3)
the read refusal was SEALED-PROFILE-RECOMPUTATION, not the chain-tip refusal
(b98f375, :707): changed sealed tests "must travel through their authorized
successor package", here the S10 reseal (this paper's reading). The refusal
name at 66d32530 is unread.

So no lane diagnosis is owed and none is a precondition for Track B. The
evidence owed is the exact-head both-OS rebuild run at the composed S10
candidate (step 12.14), named by run id and conclusion (:627 "a CI sentence
names the rebuild run id and its conclusion, or it is not written"). The lane
red is neither green nor a defect finding: S10 infers no pass from it and
repairs nothing by changing the S8 artifact (b98f375).

## 11. PM tokens and exact-byte finalization

Do not write a PM token from this working brief. After all inputs exist, copy
the exact full U+00B7 clause grammar from the final accepted runner/brief. The
four known line kinds are distinct:

- RELEASE-FROM-SEAL has exact token shape
  `RELEASE-FROM-SEAL <packageId> <path>[,<path>...]`. It binds
  `release.rulingLineSha256`, exactly 64 lowercase hex, in its own full clause
  and ends with bare final `RULED`.
- GATE-SUPERSESSION has exact token shape
  `GATE-SUPERSESSION <packageId> <carrier>[,<carrier>...]`. It binds
  `coverage.superseded.rulingLineSha256`, exactly 64 lowercase hex, in its own
  full clause and ends with bare final `RULED`.
- THEME reads the four-key cowork claim at `authorizations.theme`: exactly
  `ledgerLine`, `role`, `line`, and `lineSha256`, with `role` equal to `cowork`.
  Its line names this package id and ends with literal
  `SPACE U+00B7 SPACE ACCEPTED`.
- BRIEF-BY-SHA reads the separate four-key cowork claim at
  `brief.acceptedLedgerLine`, with the same exact keys and cowork role. Its line
  names this package id and `brief.file`, and matches terminal
  `(?:^|[ \u00b7])ACCEPTED$`; `brief.sha256` and `BRIEF-ACCEPTED` bind the
  final brief bytes under that distinct predicate.

Each cited `lineSha256` hashes the exact UTF-8 line bytes without its newline
and resolves uniquely on `CHAIN_REF`; `ledgerLine` is the positive integer
coordinate. Unknown final ids, paths, carriers, lines and hashes remain STOPs.

Do not combine these kinds, substitute a generic ACCEPTED line, or claim every
kind carries every commit/inventory field. Each line carries only the fields
and predicate its final accepted grammar requires. Compute hashes from final
bytes. A placeholder, stale ruling line, wrong field shape, or moved target is
refused.

Fold the :732 corrections into the final brief before any token or hash is
issued, and measure the actual accepted brief sha (a12be09, Execution
boundary). This revision's own sha is not a token input.

The PM reads every released exception hunk and the final declaration diff.
Author, independent Astra reviewer, PM/integrator, and Claude data-path final
remain distinct hands. Model assignment follows :778 ("No other rule
changes"): the Astra independent review stays (12.8, :635), and the Claude
data-path final (12.9) is a separate Claude Fable 5.1 reviewer session (:635
point 1, :778).

## 12. Integration, seal, recheck and live order

1. Accept final S9 parent/pins, CUI0 with independent audit, section 8
   eight-answer copy lock and final GSS child (66d32530 or a reviewed
   successor; its lane step-13 red is not a precondition, 10.2). Accepted
   CUI1 is not required (:732); source closure remains mandatory. Determine
   EPP carriage (7.2).
2. Create the S10 child from the exact accepted S9 parent.
3. Fill the input and reconciliation tables; run D-SPLIT-PARENT.
4. Reproduce Track A, then integrate Track B without mixing their evidence.
5. Pay S10 debts and add S-R33 red-first rows; if S10 carries EPP, pay
   D-EPP-1/3/4 as its own reviewed input.
6. Reconcile declarations, pins, children, runner, workflow and mirrors.
7. Run focused, complete Today, copy/design and public package evidence.
8. Obtain independent Astra review and fix/disprove findings round by round.
9. Obtain the separate Claude final over moved writers, GSS writer logic,
   released exception hunks and soon-sealed declarations (and the two EPP
   clauses at engine tier, if carried).
10. PM performs the exact-byte read; final runner, spec and workflow posts are
    committed before `--ci` or `proposed()`. `proposed()` returns an object;
    `--ci` writes no artifact or receipt.
11. Create the exact proposed artifact, still pending review. The PM alone runs
    the first authorized full in REVIEW-PENDING mode.
12. Record POSTFIX-ACCEPTANCE plus the accepted review envelope. The integrator
    then merge-forwards the accepted child, never rebases it.
13. Only an authorized full writes the receipt. Commit that receipt unchanged;
    the verdict names its exact sha. Commit the coach constant separately.
14. Run the authorized BYTE-IDENTITY reverify, then exact-head Windows and Linux
    CI, then fast-forward. A later DECISIONS/STATUS-only merge may reuse evidence
    only under the named :563/:565 name-only proof and confirming chain run.
15. Any product/execution change after review returns to the responsible proof;
    there is no author permission to run a seal or write a receipt.
16. A live deployment, import, or phone action requires its own authorization
    and live-slice proof. S10 acceptance alone does not grant it.

## 13. Final STOP list

STOP on any missing or merely proposed prerequisite; any unfilled section 2.1
placeholder; source blob mismatch; unclassified hunk; behavior change hidden in
Track A; unaccepted GSS byte; a missing or red exact-head both-OS rebuild run
at the composed S10 candidate, or any green inferred from a lane run (10.2,
:627); D5 without the real eslint-scope stack (6.1); undecided EPP
carriage or an EPP debt left unpaid by both S9 and S10 (7.2); a third
engine clause; changed/widened S-R30 exception; missing released-hunk review;
unpaid S10 debt; copy-lock gap; stale/missing pin or mirror; undeclared test;
child not reachable from CI; platform disagreement; skipped/refused row;
runner/workflow mutation; seal input drift; artifact/receipt mismatch; CUI1
promotion inside S10; or any request to infer an owner choice, engine
permission, import, merge-to-main, or deployment.

The builder reports the exact failing invariant, input, output and smallest
responsible owner. It does not weaken a guard, refresh a witness to bless an
unknown change, or continue sealing around the stop.

## 14. Sequencing boundary after real S10 release (:732; caa0abf)

Only after actual release may separately commissioned isolated CUI1/2/3/4/6
views compose on provisional CUI1 (a12be09 A5). Today face precedes proposal;
the existing queue stays. Section 8 still needs accepted answers covering
unported screens, enforcement on the actual composed product and coordinated
deletion. None is closed by this fold. Every original named
font/copy/scene/motion and applicable screen gate remains; no incomplete CUI1
acceptance, fake element, prototype substitution or waived named failure.

CUI1 reseal child plan (a12be09 A6): before completed CUI1 reference/pin
promotion, name and independently review its later reseal child; it
re-measures APPROVED-PIN, design.test and every affected sealed declaration.
Parent-pinned 09-08 references remain unchanged unless separately released by
authority. Whole-pack coverage stays. Promotion is never an S10 hunk.

The exact approved look and phone-earned weights precede Joe's trial; father's
trial follows Joe's (a12be09; :631 O-2). Any implementation that requires
lowering a guard returns to Joe as a concrete choice (a12be09).
