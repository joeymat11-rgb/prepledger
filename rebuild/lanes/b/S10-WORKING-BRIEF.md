# S10 working integration brief

Status: WORKING PAPER ONLY. This brief does not authorize an S10 build, seal,
merge, deploy, import, engine change, owner option, or copy choice.

Prepared from the accepted TODAY-SPLIT build base
`b35a48e35a1f3e3c278c377934794a32b632535b`, its Astra L4 and Claude review,
the accepted GYM-SETTINGS-WRITER-SEAL paper, the EW2 build brief, and the
later rulings through 2026-09-21. Every hash labeled INPUT REQUIRED below must
come from the final accepted input, never from this paper.

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

After S10, reseal children are ordered:

1. TODAY-MODEL-HANDOFF.
2. TODAY-OUTCOME-TYPE, including D-SPLIT-LISTEN.
3. GYM-START-IN-PAINT.

Each child owns its own brief, proof, review, pins, reseal, and CI. None is
silently folded into S10.

## 2. Required inputs and hard stops

The integrator writes an input table before touching product bytes. Each row
has exact 40-character commit, tree or blob identities, acceptance citation,
review file, and role.

| Input | Required state | STOP |
|---|---|---|
| S9 parent | Accepted integrated S9 commit, runner, release machinery, declarations, workflow and all final UI pins | No S10 branch or package until this exact parent exists. |
| TODAY-SPLIT | Accepted `b35a48e3...` or an explicitly reviewed successor | Any product change after that head requires its own disposition. |
| GSS | Final accepted GYM-SETTINGS-WRITER-SEAL product and tests | Current rejected/in-flight candidate is not an input. |
| Copy lock | Accepted design/copy declaration including screens not yet ported | No released on-screen copy may enter the seal without it. |
| C-UI | Final accepted source/package and both-platform evidence needed by S9/S10 | Windows-only or proposed package state is insufficient. |
| S10 declarations | Final S9 inventory schema, S10 package id, product and execution maps, child rules | Do not copy S8/S9 counts or field shapes by memory. |

Current readiness on 2026-09-21 is deliberately incomplete: the split is an
accepted build base; GSS remains under repair after independent rejection; CUI
has exact-candidate Windows evidence while final independent and Linux evidence
remain pending; the final S9 parent and copy lock do not exist. This paper is
preparation, never permission to bypass those stops.

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

### 4.2 Tests and proof paths

Re-measure and declare every touched test. The known set includes the split
source-read tests (`food.test.mjs`, `problem.test.mjs`), final GSS tests
(`machine-settings-ui.test.mjs`, `gym.test.mjs`), the writer fence,
`package.test.cjs`, `setup.test.mjs`, and the measure boundary test when its pin
is re-homed. The final diff, not this list, decides the complete set.

Pure source-read repoints preserve assertions and are red-first. New writer
behavior receives new behavioral rows. No assertion deletion, expected-failure
conversion, denominator reduction, or missing test registration is allowed.

### 4.3 Declaration and execution paths

The integrator owns only the final explicitly commissioned S10 declaration
files: the current acceptance inventory successor, the S10 release/package
declaration, the accepted runner's S10 registration, and the existing
`.github/workflows/rebuild.yml` registration when the PM commissions that last
hunk. Do not create a second workflow or shadow runner.

Every path added to a product declaration is reconciled with execution pins,
children, mirrors, required inputs, release roles, and changed-pin owners. A
file cannot be product-pinned but unexecuted, executed but undeclared, released
in one mirror and sealed in another, or named by a child under the wrong role.

## 5. S-R30 released exceptions and review rule

Carry these four exceptions verbatim:

> the released view holds model at 32 pinned sites and converts the weigh-in text itself; the food and sleep hooks take DOM nodes and twelve copy values are injected by name; paint may call model.start at one pinned site; live lane power through the facade, pinned by acquisition site.

These are exceptions, not proof that released files are passive. Released
files still hold live writer-bearing objects. The fence is a tripwire, not a
semantic oracle. Every released exception-site hunk needs independent data-
path final review under the current Claude protocol and a PM read. Any new
exception, changed count, changed acquisition site, or widened capability is a
STOP and a named ticket, not a quiet table refresh.

## 6. Two evidence tracks that must stay separate

### 6.1 Track A: pure cut

Reproduce the accepted split from the actual parent. Preserve source-door,
anchor, context, declaration, overlap, parsed-structure, output and report
checks. Compare generated `today-app.cjs` and `today-lanes.cjs` byte for byte
with an independent reconstruction. Run the DOM/listener equality cells on
the actual generated output. Record moved bytes and declared rewrites.

Track A may conclude only that the declared split preserved the measured
behavior. It cannot approve GSS N hunks, copy changes, or later ticket behavior.

### 6.2 Track B: accepted GSS writer work

Apply only the final independently accepted GSS child to Track A's exact
output. Carry its own red-first lifecycle, focus replacement, exact API surface,
pending/dispatch, parity and D2 evidence. Re-run its actual mounted paths and
writer fence at the integrated bytes. Record actual M/R/N counts and the D2
annex coverage; do not copy paper estimates.

Retained GSS debts remain visible: timer/dispatch residue, the `api.lane`
passthrough census question, actual M/R/N counts, D2 annex coverage, and all
six inherited scope rows. No parser or archived-parent capability is invented.

If accepted GSS bytes depend on a source that differs at the S10 parent, STOP
and rebase by merge-forward with full reproof. Do not hand-apply a passing hunk
to a different parent.

## 7. S10 debt rows

The following L3 debts are carried verbatim.

- D3 / S10 writer cells: add repeated same-date readSleepCheckInView forcing forDate before EACH paint (M18), and inspect typed hours after successful save (M21); own traces remain read/paint/read/paint versus read/paint/paint, and empty hours versus "7.5".
- D5 / S10 instruments: rerun rows 12/13/14/16/32/33 with the real eslint-scope stack, independently exercise generator scope/binding outputs, and retain the uncovered-assignment no-write input; isolated tail checks are not generator-equivalence proof.
- D6 / S10 negative coverage: retain the earlier overlap-refusal debt, including competing replaces nested in a seam; no new overlap proof was commissioned or credited in L3.
- D7 / S10 evidence: validate or explicitly label headLines/closeLines as informational; incrementing either exits 0 with identical product bytes. The inventory correction to 182 witnessed regions plus 20 seams is verified.
- D9 / S10 instruments: classify the 21 L3 clause survivors listed below as equivalent or add branch-specific inputs; equal serialized observations do not establish general equivalence.

D9 survivors, verbatim:
`I042/I046/I047/I048/I052/I082/I088/I089/I094/I107/I172/I194/I196/I224/I229/I235/I236/I281/I289/I295/I301`.

S-R33 adds a durable S10 boot-contract row for a plain options object. Accessor
options are outside that ruling and are not silently repaired. The row proves
the accepted acquisition count and boot output at the integrated bytes.

D-SPLIT-LISTEN pays in TODAY-OUTCOME-TYPE under the later ruling. Preserve the
current no-third-argument measurement and scoped limitation; do not add a pre-
S10 code patch.

D1 and D2 remain owned by TODAY-GESTURE-PAINT-ROOTS and TODAY-OUTCOME-TYPE.
Their inherited behavior is reported, not fixed or declared accepted by S10.

## 8. Copy lock

Before a released view is declared, the accepted copy lock must provide:

- exact source files and extraction rules for athlete-facing literals;
- ownership for sealed fallback reasons and released presentation sentences;
- exact-byte locks for current screens and a rule for screens not yet ported;
- generated-content and dynamic/refusal-copy treatment;
- a changed-copy review route and owner-copy route where required;
- mirrors that agree on the same source, digest, exceptions, and release role.

Run the lock on the actual composed product, not only on source fragments. It
must catch copy moving into an unscanned file, disappearing, duplicating, or
changing ownership. Proposed EW2 wording and later ticket wording are excluded.
Missing design declarations, unresolved copy ownership, or an uncovered screen
is a STOP. S10 does not invent copy to close it.

## 9. Ancestors, children, pins and mirrors

Build a final reconciliation table with one row per changed path:

`path | parent role/pin | S10 role/pin | execution owner | child effect |
mirror locations | evidence | reviewer`.

For every changed pin:

1. Name the old owner and why its pin changes or is removed.
2. Name the new owner and exact digest source.
3. Update every runner/package/workflow mirror in the same integration group.
4. Prove ancestor packages either remain byte-valid or are intentionally
   superseded by an accepted child rule.
5. Prove no child can re-pin a released file or omit a new sealed dependency.

Run the accepted runner's own mirror and mutation rows. A marker-only match is
not proof. The workflow condition must be the complete permitted expression,
the runner path must be the actual runner, and every package id/root/child edge
must resolve at the exact candidate.

The workflow registration lands last, after the standalone new rows have run
on both systems. The workflow must invoke the accepted runner and the new tests
by real path. A green child command not reachable from CI is not closure.

## 10. Runtime and platform evidence

Before any command, inspect its complete relative import/child-process graph.
Use public synthetic fixtures only. No private corpus, old-app source, athlete
measurement, seal `--full`, receipt writer, or broad directory suite is used
for author iteration.

At the exact integrated candidate, record separately:

- the cut/instrument cells, including D3/D5/D6/D7/D9 and S-R33;
- split DOM/listener/copy evidence;
- GSS focused and mounted writer evidence;
- writer fence and all directly affected Today test files;
- complete Today step with honest inherited-red disposition;
- accepted public conformance and package `--ci` routes;
- copy lock and CUI preview checks where the final design contract requires;
- full public CI on Windows and Linux at the same commit.

Run one process at a time on the owner PC with fixed clock/time zone where the
test contract requires them. Linux and Windows reports name commit, source
digests, effective versions, mode, scope, counts and exits. A skipped, VOID,
refused, missing-dependency, unavailable-parser, or platform-only row is never
green evidence. Later success cannot hide an earlier failing gate.

## 11. PM tokens and exact-byte finalization

Do not write a PM token from this working brief. After all inputs exist, copy
the exact line kinds and field grammar from the final accepted runner/release
spec. At minimum the flow distinguishes REQUEST/PROPOSED, independent review,
ACCEPTED, seal/receipt, and integration evidence; no line combines proposal and
acceptance.

Every token binds the exact candidate commit, parent, package id, brief digest,
sourceBase, product and execution inventories, review file/commit, evidence
run ids, and artifact/receipt identity required by the final grammar. Compute
all values from final bytes. A placeholder, shortened identity where full is
required, stale parent, report-only successor with changed product, or token
whose target moved is refused.

The PM reads every released exception hunk and the final declaration diff.
Author, independent Astra reviewer, PM/integrator, and Claude data-path final
remain distinct hands.

## 12. Integration, seal, recheck and live order

1. Accept final S9/CUI/copy-lock inputs and final GSS child.
2. Create the S10 child from the exact accepted S9 parent.
3. Fill the input and reconciliation tables; run D-SPLIT-PARENT.
4. Reproduce Track A, then integrate Track B without mixing their evidence.
5. Pay S10 debts and add S-R33 red-first rows.
6. Reconcile declarations, pins, children, runner, workflow and mirrors.
7. Run focused, complete Today, copy/design and public package evidence.
8. Obtain independent Astra review and fix/disprove findings round by round.
9. Obtain the separate Claude final over moved writers, GSS writer logic,
   released exception hunks and soon-sealed declarations.
10. PM performs exact-byte read and writes the proposed/accepted token sequence.
11. Flip workflow/declaration state in the order the final release spec requires;
    only then create the proposed seal artifact and receipt.
12. Reverify artifact inputs, product/execution pins, coach/revision transition,
    inventory fence and exact receipt bytes without regenerating evidence.
13. Integrator merge-forwards the accepted child, never rebases it, and proves
    name-only product/execution equality before and after the merge.
14. Run exact-head Windows and Linux CI. Any product or execution change after
    review returns to the appropriate evidence step.
15. A live deployment, import, or phone action requires its own authorization
    and live-slice proof. S10 acceptance alone does not grant it.

## 13. Final STOP list

STOP on any missing or merely proposed prerequisite; source blob mismatch;
unclassified hunk; behavior change hidden in Track A; unaccepted GSS byte;
changed/widened S-R30 exception; missing released-hunk review; unpaid S10 debt;
copy-lock gap; stale/missing pin or mirror; undeclared test; child not reachable
from CI; platform disagreement; skipped/refused row; runner/workflow mutation;
seal input drift; artifact/receipt mismatch; or any request to infer an owner
choice, engine permission, import, merge-to-main, or deployment.

The builder reports the exact failing invariant, input, output and smallest
responsible owner. It does not weaken a guard, refresh a witness to bless an
unknown change, or continue sealing around the stop.
