# Astra tooling correction — executed child targets

> **LANE B ANNOTATION, 2026-09-11 (fix r5). THIS DOCUMENT BINDS NOTHING.**
> `DECISIONS:112 (2)` rules the Astra provenance VOID: its ledger lines, its brief
> amendment and its theme are not on the chain, its code is adopted only as a speculative
> builder candidate with Astra as author, and its self-reviews do not count as the
> independent review. Every sentence below is a hypothesis. Two independent blind reviews
> re-measured them and the record is:
>
> * the `childArgv()` change itself — **confirmed** (`TOOLING-REVIEW-r5` §C, ACCEPT, and
>   lane B keeps commit `c7b7133`);
> * "`node --test rebuild/lanes/b/tooling/test/execution-targets.test.cjs` → 9 passed /
>   0 failed, exit 0" — **not reproducible as stated.** `B-NTC-REVIEW-r2` R8 measured
>   **8/9, exit 1** on `rebuild/lane-b-ntc`, because the suite asserted
>   `packages/B-NTC.json`'s `children.length === 5` and that spec declares **15** there.
>   The claim was true on one branch and false on the other, and the report says neither.
>   Fixed under `TOOLING-REVIEW-r5` Z8: the suite now builds its own inherited-map fixture
>   and is **9/9 on both lane branches** (`TOOLING-FIX-r5-REPORT.md`);
> * the two commits `7cd7a5b` and `85f7d56`, described elsewhere in the Astra report set,
>   were **REJECTED** by `TOOLING-REVIEW-r5` and lane B **reverted** both.
>
> No claim below has been re-checked beyond the three above. Read it as a candidate's
> notes, not as evidence.

2026-09-11. Candidate only; independent review required.
Branch `codex/astra-tooling-fix`, base `7748880701ef62246c8362c43f760ee10f86c2cc`.
Assignment: PM `ASTRA-TOOLING-FIX.md`. Prior independent source review:
`TOOLING-REVIEW-ASTRA-r5.md` at `b148622da0937fc13529e9aa3b0fb80c86fe4028`.

## Change

`childArgv()` is now the only executable-target definition. Bare Node script mode
admits exactly one file; extra positional files refuse
`CHILD-ARGV-BARE-SCRIPT-ARGUMENTS` rather than count application arguments as tests.
`--test` retains multiple explicit files. Ownership, proposed source pins, fidelity,
moved coverage validation and actual child execution all consume this definition;
inherited coverage consumes the target list produced by that execution. The old
`argvFiles()` filter is removed. Logging names every executed target.

Parent PRODUCT files must be `carried` or `edited`, with their exact parent preimage.
`new` cannot masquerade as an inherited product. Parent execution pins still require
`superseded-by-child` and exact preimages. Genuinely new files still work.

Only these child roots were added:
`rebuild/m3/w6/host/test/`, `rebuild/m3/w7-preview/today/test/`.
Targets must be existing files with .cjs/.mjs/.js suffixes, within the fixed roots;
absolute/traversal/backslash paths and unapproved options refuse. Duplicate flags
and reporter-without-test mode also refuse. The regression file and this report
are exact entries in TOOLING_FILES; no directory exemption was added.

Six package specs change ONLY tooling.runnerSha256, mechanically to:
`e08580e7bb6b044d578f44f6bb685ff850f606d62e8043be6dbd2004dd39512c`.
MOVES_RULING stays null. No mapping, acceptance, authorization or receipt was invented.

## Executed checks

Node v24.19.0, Windows, existing runtime. No install.

- Before the fix: focused regression suite **3 passed / 6 failed**, exit 1.
  Failures expose trailing-own argv, inherited argv, source-pin argv, product-role
  mislabelling, missing intended roots, and insufficient path/mode restrictions.
- After the fix: `node --test rebuild/lanes/b/tooling/test/execution-targets.test.cjs`
  **9 passed / 0 failed / 0 skipped**, exit 0. Final run includes all five inherited
  child names and the real nine-gate map from B-NTC as additional negative controls.
- `node --check rebuild/lanes/b/tooling/b-package.cjs`: exit 0.
- `git diff --check`: exit 0.

The nine groups execute actual runner functions and real Node children. Direct own
success passes the existing exact seal block; absent execution and directly throwing
own code refuse. Real `--test` runs both good files and fails a throwing second file;
its output is checked for the second child's evidence. The bare first-pass/second-throw
shape refuses before ownership, execution or sealing can count it. All five forged
inherited children refuse; a directly executed parent-pinned positive still covers.
Proposed source pins include both real test targets and refuse bare trailing targets.
Parent product/execution role and preimage positive/negative pairs discriminate.
Both intended new roots actually execute Node tests; adjacent/foreign roots refuse.

Harness details: the runner source is compiled only up to its unchanged main-campaign
delimiter. A temporary module location gives it an isolated public fixture tree;
original dependency modules load from the real checkout. No runner function body
is rewritten. The exact existing Y1 seal assertion block is extracted from source
and exercised without forging an ACCEPTED envelope. NODE_TEST_CONTEXT is removed
only from the harness child environment so Node's outer test worker does not alter
nested Node --test behaviour. Generated scratch files are removed after checking
the resolved path remains under the intended temporary directory. No existing data
is deleted. Logs remain ignored under `.tmp/tooling-fix/`.

## Limits / next step

This is focused component evidence, not a --ci/--full campaign or a package PASS.
The independent r4/r5 authority, ancestry and envelope evidence is retained as prior
review evidence, not claimed as re-executed here. No engine, host, runtime, frozen
law/oracle, accepted artifact, shared STATUS/DECISIONS or lockfile changed. No private
fixture/ledger read, installation, push, merge, deployment or protected-soak activity.

The original independent reviewer must check this exact candidate. Only after ACCEPT
may B-NTC use it. Exact successor mappings, changed-wrapper evidence and a separately
reviewed PM ruling remain necessary before any nonempty coverage.moves is admitted.
Full/private readiness, original gates, source pins, receipt ancestry and the exact
acceptance envelope remain unchanged obligations.
