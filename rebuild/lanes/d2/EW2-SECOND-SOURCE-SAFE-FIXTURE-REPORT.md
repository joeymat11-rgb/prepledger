# EW2 second-source safe fixture: author report

Role: commissioned Sol builder. This is author evidence, not acceptance.
Base: 5626eef50237b74bdd2f13f75babe8435334d78b.
Review: cff2c578cdfb718cddbc6fc2d547edfae0cae2e3, D1 and D2 only.

## Result

D1/D2 author correction is complete. No product or engine byte changed.
The ew2c cells now use a dedicated invented-envelope helper. It keeps the real
AES-GCM, hashes, strict parser, replay engine, preparation, encrypted repository,
custody, admission and CAS path. It invokes neither port.cjs nor an oracle.
Oracle PASS/count metadata and producer evidence are labeled synthetic.

## Scope and safety

No product or engine byte is in scope. The original ew2c cells are unsafe to run
because their inherited seal helper reaches the real port oracle. They were not
run during this correction.
D3 linked-screen and D4 mixed-history remain build debts.

## Evidence

Environment: MEASURED_TEST_NOW=2026-09-03; TZ=America/New_York. Node processes
ran sequentially from the assigned base 5626eef50237b74bdd2f13f75babe8435334d78b.

- Guard measure: exit 0; all listed guard, abort, retry, reload, reopen, CAS,
  pre-carried and lost-ack assertions passed. Scratch counts were +1/-0 for the
  prepare guard, review alternative and proposed sentence.
- Baseline six journeys: exit 1; J1/J2/J4/J6 passed; J3/J5 were red as required.
- Safe D2 counterexample: retraction was omitted in OS-temp only; exit 1;
  J3/J5 were red, so the added lifecycle assertions detect the defect.
- Guarded six journeys: exit 0; J1-J6 passed; J3/J5 refused by
  LOCAL_SOURCE_SECOND_ADMISSION_REFUSED.

For each named refusal, the complete loaded generation before and after prepare
was equal. Across carry/refuse/retract, revision advanced twice, the pending
import was removed, one retraction was appended and encrypted custody remained
readable. Admitted selections, application and collections stayed equal.

Final logs: `%TEMP%/ew2-safe-fixture-guard-final.log`,
`%TEMP%/ew2-safe-fixture-baseline-final.log`, and
`%TEMP%/ew2-safe-fixture-guarded-final.log`.
Counterexample scratch:
`%TEMP%/ew2-safe-fixture-counterexample-final-6865a66d79a64bb7ba4f991dceb4d525/`.

## Limits

No private input, old-app source, port oracle, seal tooling or receipt was used.
No whole Today step, private gate, protected fixture, phone or Linux run was done.
This is author evidence. Independent review and integration remain separate.
