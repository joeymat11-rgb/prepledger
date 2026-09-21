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

Pending PM publication of this required red checkpoint before implementation.
