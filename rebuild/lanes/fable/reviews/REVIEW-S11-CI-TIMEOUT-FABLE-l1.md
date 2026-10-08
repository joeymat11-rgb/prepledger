# REVIEW S11 CI TIMEOUT (rebuild-public 30 -> 60), Fable l1

Tree C:\Users\joeym\AppData\Local\Temp\earned-s11int, HEAD d7b4cc26, status ` M .github/workflows/rebuild.yml` only.
Report read: S11-CI-TIMEOUT-FIX-REPORT.md. Every claim below is my own measurement (git grep over HEAD via
spawnSync with the private/src/ledger/soak/app.js/engine exclusions; byte compare of HEAD blob vs working tree).

## (1) The diff
- Byte compare HEAD blob d92305c vs working tree: 48685 -> 48685 bytes, exactly 1 byte differs, offset 693,
  0x33 ('3') -> 0x36 ('6'); CR count 0 before and 0 after. `git diff --stat` 1 file, +1/-1, at :28.
- Working-tree timeout-minutes values: 60 (public-gates :28), 10 (:572 font transport, untouched). PASS.

## (2) Consumers (independent search)
- Pins of the OLD sha 0c861be9 (gated): packages/S11.json:50 product post, acceptance-s11-native-load.json:203
  product post, receipts/S11.json:12 sealedRun.product. All three move at the PM's REGEN; until then step 13
  (`b-package.cjs --ci --package S11`) refuses the rebuild.yml pin. Same three the report names; none missed.
- Record-only cites of 0c861be9: S11-SEAL-RUNBOOK.md:33, S11-NATIVE-LOAD-BRIEF.md:25,143. No gate reads them.
- New sha 009174b1 appears nowhere in HEAD (expected; REGEN writes it).
- Readers of `timeout-minutes` in tests: only shared-preflight-ci-registration.test.cjs:57,60, bound 1..20 on job
  public-preflight of shared-preflight.yml. It never opens rebuild.yml. No test or law bounds rebuild-public's timeout.
- Tests that parse rebuild.yml text (engine-revision, h3-clean-init H3/13, pwa workflow, pack-pin P-FENCE-1,
  release-object (7), sealed-inventory-fence rows 18/32 assertTwoOsJob + no `|| true`, production-mapping/
  -admission `--package <id>`): all match step names, conditions, matrix, runs-on; none read the timeout line.
- The one whole-file equality (ci-second-gate.test.cjs 'exactly one command') was RETIRED at DECISIONS:627
  P-S9-5 (file :29-58 says so); B1B2-R3/R4-SOURCE-REVIEW.cjs are frozen scripts with no CI step. No missed consumer.

## (3) Laws, guards, wall-time budgets
- Searched rebuild/ laws, briefs, DECISIONS, STATUS, REQUESTS, b-package.cjs for timeout / N min / wall near CI.
  No rule says CI must finish within N minutes. b-package.cjs only REPORTS each child's wall ms on the OBSERVED
  line in --ci (:2866-2872, child-diagnostic-tail.test.cjs:170); it asserts no budget. The 25-minute figure in
  the C-UI-0 reviews is teeth.py's own acceptance item, not this job. The only hard bound in the repo is the
  shared-preflight 1..20 rule, on another workflow. Raising :28 weakens nothing.
- S11-NATIVE-LOAD-BRIEF.md:369 anticipated this: rev9's "the standing job's 30 is too short" was withdrawn as
  UNMEASURED and the timeout was to be SIZED FROM EVIDENCE (D-L4-MEASURE). This change is that evidence step.

## (4) Is 60 sound, or is it hiding a regression?
- Workload grew: S10.json 36 children / 302 product posts -> S11.json 39 children / 320 posts, plus the new
  S11 steps added at 97a0aa6 (standing step, S11-REGEN :413, W6 :439/:449, C4B, FC12 :217). The third T5b
  observation run 37108132701 (DECISIONS:890), which runs ONLY the 39 children with the same argv/env as the
  runner, took windows 07:58:38-08:18:43Z = 20m05s and ubuntu 7m45s. Step 13's hosted 1175 s / 1229 s
  (19.6-20.5 min) equals the children's own measured cost on windows. That is the same bytes doing the same
  work, not a slowed child: expected growth, no regression signal in the repo.
- DECISIONS:891 T15 run 37110080030 at A was green on both OS, so the job already sat within a minute of the
  cap; the two cancellations are hosted windows variance across the 30-minute edge, which is exactly what a
  per-job cap should not decide. 60 gives about 2x headroom; a genuine hang still ends inside an hour.
- No cheaper fix is in scope for a timeout line: splitting the package step or parallelising children would be
  a runner change with its own re-pins and review, and the brief's own path (:354/:369) is size-from-evidence.

## Named debts (for the PM; none blocks the value)
- D-TM-1: the comment at :25-27 still justifies 30 ("Raised from 15 ... 2026-09-11 re-seal"). With the sha
  moving at REGEN anyway, this is the cheapest moment to add one line citing the 29.3-29.5 min cancellations
  and the T5b windows 20 min; left as-is the file says 60 while explaining 30. PM's call, same REGEN cycle.
- D-TM-2: S11-SEAL-RUNBOOK.md:33 and S11-NATIVE-LOAD-BRIEF.md:25,143 quote 0c861be9 as history; record only.
- D-TM-3: the report says production-admission.test.mjs ran once before the oracle-shim limit was noticed;
  no bytes moved, disclosed by the builder, nothing for me to add.

VERDICT: ACCEPT WITH NAMED DEBTS (D-TM-1 comment drift; D-TM-2, D-TM-3 record only). One byte, LF kept,
every gated consumer is one of the three pins the PM's REGEN re-pins, no law or budget weakened, 60 is sized
from the measured 20 min windows child cost plus the other steps, not covering a regression.
