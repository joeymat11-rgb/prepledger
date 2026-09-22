# S9 guard debts: author report

Role: commissioned Sol builder under DECISIONS:633. This is author evidence,
not acceptance.
Base: 15ab6e83a9a3f1ce8d6b3183c3280e320a294ed3.
Review: 9f45e4b3911b5f9d48eded810499150c3c86359c.

## Scope

D-NULL-ARTIFACT, D-CONDITION-MATCHER and the named historical report
denominators only. No workflow, product, engine, runner, pin, package, spec,
ledger, STATUS, part-2 design or seal work is in scope.

## Red first

With MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York, focused cells ran
sequentially against the still-defective readers:

- release-object: 2/0/2, exit 1. JSON null returned no refusal, and
  `!cancelled() && false` was accepted.
- sealed-inventory-fence: 1/0/1, exit 1. The semantic counterexample was
  accepted by the matcher shared by its three condition readers.
- pack-pin: 1/0/1, exit 1. The semantic counterexample was accepted.

Red logs: `%TEMP%/s9-guard-red-release.log`,
`%TEMP%/s9-guard-red-fence.log`, and `%TEMP%/s9-guard-red-pack.log`.

## Result

PM published red checkpoint 6b231e312b83dd3e314e3a5996924e26dc20d1a3.

- JSON `null` now receives the existing named ARTIFACT-NOT-JSON refusal. Parse
  failures retain their original single refusal.
- All five condition readers now require the whole permitted
  `if: ${{ !cancelled() }}` expression. Honest exact expressions pass;
  appended `&& false`, prefixed `false ||`, and appended `|| true` fail.
- The integration report now labels merge preflights as triple-dot and the
  whole-branch inventory as two-dot. The F2 interval is two first-parent
  merges versus 49 newly reachable commits, and the incoming P4B papers are six.

## Green evidence

Focused changed rows: release-object 2/2, fence 1/1, pack 1/1, all exit 0.
They drive the same readers used by the real rows. The current workflow's five
exact conditions remain positive controls.

Full release-object: 10/9/1, with only the pre-existing expected real-row
ARTIFACT-ABSENT red. Full pack-pin: 70/69/1, with only the pre-existing expected
real-row PACK-ROOT-ABSENT red. Fixture and new guard rows passed in both cells.

An attempted filter failed to exclude the fence real row. That run produced
49/48/1 with its pre-existing 22-path red, but its transitive helper performs
unscoped Git show/diff operations. Read safety is not established for that one
accidental run, so it is excluded from acceptance evidence and was not repeated.

## Limits

No workflow, product, engine, runner, pin, package, spec, ledger or STATUS file
changed. No part-2 artifact, brief, seal, receipt, private proof, Linux or hosted
CI was run. Separate Astra and Claude review remain required before acceptance.
