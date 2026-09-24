# CUI and GSS exact-head public CI status
PM metadata observation, 2026-09-21. No workflow or source changed.
This is not an acceptance, failure waiver, or diagnosis from step names.

GSS candidate04ea69e60dea5875a5a82b562af24b2f2f71c7be:
rebuild run35663801586 completed failure, both OS jobs failed at step13.
Jobs106544901237 (Ubuntu) and106544901547 (Windows).
pipeline35663801849 and shared-preflight35663801632 completed success.

CUI candidatecf14982050a8169c7f4848ec0bf1f69c2bb5759f:
rebuild run35661341912 completed failure, both OS jobs failed at step13.
Jobs106537043174 (Ubuntu) and106537042068 (Windows).
pipeline35661341914 and shared-preflight35661341927 completed success.

Accepted split build parentb35a48e35a1f3e3c278c377934794a32b632535b:
rebuild run35631340226 completed failure, both OS jobs failed at step13.
Jobs106438004635 (Ubuntu) and106438005132 (Windows).

CUI initial base6c5936036c58b2381ebd56551888ea0e5867719e:
rebuild run35624678952 completed failure, both OS jobs failed at step13.
Jobs106416007304 (Ubuntu) and106416007600 (Windows).

Step13 is the cumulative S8/S7/S6/S5/S4/S3/H3/native/legacy-census package step.
At04ea69e, its workflow command is:
node rebuild/lanes/b/tooling/b-package.cjs --ci --package S8
Only run/job/step metadata and the named workflow source were read.
No raw job log, protected corpus, legacy source or private fixture was opened.

Matching failed step locations prove the earlier parents were already red there.
They do not prove identical causes or exclude a candidate regression.
Do not label the full public CI green from successful preflight/pipeline jobs.
The independent ordinary CUI Windows/Linux372/418 results retain their own scope.
Full public Windows/Linux success at the eventual integration head remains owed.
No rerun is warranted solely because these completed failures have been observed.

Run pages use https://github.com/joeymat11-rgb/prepledger/actions/runs/<run-id>.
Next integration hand must obtain safe exact failure evidence, reconcile accepted
package dependencies, and prove the resulting exact head without weakening guards.
