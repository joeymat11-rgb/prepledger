# ENGINE-REVISION-SEAL-WINDOW - lane D author report

DEFECT. With the standing CI step at `--package S6` inside the package (the right
shape; S5 did the same at 657b847), `P3-M3` in m4/import/test/
production-mapping.test.cjs (child m4-import-production, 24/25 ->
CHILD-REQUIRED-EXIT-ZERO) and cells 1-2 of coach/test/engine-revision.test.cjs
(CI's C5 step) opened rebuild/lanes/b/tooling/receipts/S6.json - the file the
sealing FULL run writes at its END. ENOENT: no reseal declaring it can be sealed.

INVARIANT. In the window the rule is not "no check": the constant moves only
AFTER the new receipt exists (DECISIONS:465-467, :495), so it must still name the
PARENT seal. Both states are now one function, `standingSeal(repoRoot)`, and one
sentence, `REVISION_RULE`, quoted in both files and in every refusal:
- receipts/<standing>.json EXISTS -> constant == <its packageId>@<sha16 of it>.
  Unchanged: this is the trip-wire, and it is not weakened.
- it does NOT -> packages/<standing>.json must exist, be BRIEF-ACCEPTED and name
  `parent.chosen` whose receipt exists; constant == <PARENT receipt's
  packageId>@<sha16 of the PARENT receipt>.
- any other state (no spec, not BRIEF-ACCEPTED, no parent, parent with no
  receipt) fails BY NAME, never by ENOENT.
The standing id still comes from rebuild.yml's own `--package` flag; here the
rule resolves `window`, S6 -> parent S5 -> the constant already on disk.

RED SIDES, EXECUTED against temp fixture roots (fake rebuild.yml/spec/receipts),
so no cell depends on the real S6 state; the real-tree assertion runs too.
(a) receipt present + wrong sha, and + wrong id -> red [P3-M3A]. (b) absent + a
stale GRANDPARENT, and + a random string -> red [P3-M3B]. (c) absent + no spec ->
red, with three other bad states [P3-M3C]. (d) the window itself -> green, state
== "window". TWO REAL-TREE MUTANTS, run and reverted: the stale constant
M2-S4-TODAY-CHILD@171ebcd4d4b3b2b4 -> 23 pass / 3 fail (coach 1-2 + P3-M3, no
others); a SYNTHETIC receipts/S6.json beside the S5 constant reddens the same 3
as "its receipt is sealed: the constant must name S6".

COUNTS (Node 24, MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York). Child
m4-import-production 25 -> 28 pass, 0 fail (production-mapping 17 -> 20;
production-admission untouched at 8): the S6.json needle must move 25 -> 28, and
that file pins production-mapping.test.cjs - the PM re-measures both at the
reseal. Coach glob 229/2 -> 234 pass / 0 fail (+3); engine-revision-gap.test.cjs
is in it, green. STOPS: none. Untouched (ASCII, LF only): rebuild/engine/**, the
coach constant (reverted byte-for-byte), the census junction, conform/engines.
