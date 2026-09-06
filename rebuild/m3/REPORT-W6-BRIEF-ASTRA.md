# W6-BRIEF — ASTRA report

## 1. What and why

Publishes `BRIEF-W6.md`: the future async browser bridge, separate permission/athlete time, durable recovery fences, clock/state matrix and acceptance tests. Proposes 24 observed hours plus 64 newly committed operation slots after unproved restart, counted from an authenticated reconciled checkpoint. The owner already chose bounded saving; these numbers and residual exposure await Sol's refinement review and recorded adoption. No W6 product implementation or rule adoption is claimed.

Also closes cowork's accepted W0 hardening request: the public checker now pins this checkout's client, and the adapter no longer searches a legacy machine directory. A missing `index.cjs` cannot pass via an external copy or `index.js` fallback. This is test plumbing outside the frozen-law list, not a change to the client or authority product.

## 2. Base, claim and scope

Queue W6-BRIEF; branch `rebuild/m3-w6-brief`. Started 2026-09-06 05:03 UTC from W0 PR25 head `b00057e21b5951783b2cde33d7e2e7b6f53b492d`, independently accepted by cowork while integration was pending. Published start receipt `61335a5`; integration `9a42b10eb3a66c238dba7b2ad28dc8afb9924709` subsequently arrived and is included through merge `024cc83`.

Changes: brief; this single report; claim receipt; QUEUE and append-only DECISIONS evidence; `m3/w0/public-conformance.cjs`, its focused test, and `conform/adapters/client.cjs`. Frozen app, product engine/client/authority, suite laws/reference/oracle/runner/manifest, seeded soak, W3 witnesses and lockfile are unchanged. Existing audit/W5 tasks were not duplicated or edited; no published W5 branch/contract was available at the observation recorded here.

## 3. Brief decisions and remaining review

- The budget is an operating allowance, not certified elapsed time or a maximum loss claim. Coherent old-store restore can restore its counters and produce conflicting Saved acknowledgements repeatedly. A finite server sequence range would limit distinct accepted slots, not all those acknowledgements.
- Signed checkpoint time plus observed elapsed is kept separate from athlete-attested date/time/offset. Raw wall-clock UTC never directly decides server lease validity; original lease endpoints and standing retain precedence. Last time/slot is inclusive; whole multi-op batches reserve atomically.
- Legitimate late arrivals keep their original bytes and capability; renewal cannot strand them, renumber them or make WAITING children block unrelated transport progress. W5's actual wire/time/renewal fields stay OPEN until published and pinned.
- Known rejection, sign-out and expiry need more than a RAM flag. The brief requires an executable recovery-intent/fence mechanism, including its own write failures; any unresolved stronger persistence guarantee blocks CLOCK rather than being omitted. Sign-out intent immediately refuses state17 even if its marker cannot persist.
- Two bounded subagents assisted this task: one checked the state/clock contract, one built the narrowly assigned hardening regression. They are same-family assistance, not cowork/Sol independence. The contract review found missing signed-time mapping and sign-out-intent wording; both were corrected before publication. Original W3 red witnesses remain unchanged.

## 4. Reproduction and executed output

Windows, Node24.19.0. Use a **real node_modules directory**, not a symlink/junction: on a clean checkout run `npm ci --include=dev`. This execution copied the already-installed pinned dependencies into a real directory; esbuild0.28.1/react19.2.8/yaml2.9.0 matched the root package. No install/lockfile change was committed. This clarifies the earlier W0 reproduction line; symlinked dependencies can correctly fail the site-package boundary.

From repo root run the three W0 entry points and `node --test rebuild/m3/w0/test/public-conformance.test.cjs rebuild/m3/w0/test/scope-package.test.mjs rebuild/m3/clock-spike/test/continuity.test.mjs rebuild/m3/clock-spike/test/core-witness.test.mjs`. This is 7 public-check tests +3 package tests +39 unchanged W3 assertions. The W3 witness tests reproduce known RED limitations, not phone acceptance.

For the unchanged full suite/selftest, follow AGENTS private preparation locally; restore/check public pins and keep preparation output verdict-only. Explicit ENGINE_MAIN/ENGINE_OLD point at ignored `.tmp/m3-w0-engines/engine-main.cjs` and `engine-old.cjs`, built by W0 from fe516c1/a0009c3. Set MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York; also explicitly set EARNED_CLIENT_DIR to this checkout for the full runner. Run strict with MEASURED_TEST_NOW unset.

```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
SCOPE-FREEZE PENDING — new PWA archive, full private suite and final M3 implementation evidence remain release gates
PUBLIC-CONFORMANCE PASS: 99 reference GREEN; 99 STRONG (141 targeted mutants detected); 70 adapter GREEN; 29 RED-as-specified (policy/progression absent)
PUBLIC-ORACLE check PASS — 7/7 unchanged public oracle laws; private NOT RUN
PUBLIC-ORACLE sensitivity PASS — 9/9 unchanged public oracle laws; private NOT RUN
PUBLIC-CANDIDATE frozen PASS — 7/7 unchanged public oracle laws; private NOT RUN
PUBLIC-CANDIDATE native PASS — 7/7 unchanged public oracle laws; private NOT RUN
ENGINE-TRACK PASS — rig185 W1 PASS, W2 PASS on frozen engine; unchanged assertions
tests 49
pass 49
fail 0
PRIVATE PREPARATION PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SELFTEST PASS
PASS engine suite — 3072 assertions passed
All checks passed. Safe to ship.
```

Last two lines are from the unchanged strict checker, not M3 release approval. `rig187 ⇒ PASS` independently reproduces its existing restart gap/control. The full suite ran after the public-only check; the public wrapper's private-NOT-RUN statement applies only to that wrapper. `git diff --check` passed. Exact-head Linux/Windows workflow and strict results are attached in the PR once available; this report does not anticipate their verdicts.

## 5. Deletion bite, effective regression and restoration

The tracked regression creates a disposable public-only layout and a usable external client. It deletes the layout's product `index.cjs`, installs a usable `index.js` decoy, and launches a fresh Node process. It also proves an explicit external override still works for other runners while the public runner rejects redirection.

```text
CLIENT-PATH BITE: deleted checkout index.cjs -> PUBLIC-CONFORMANCE FAIL: ADAPTER-LOAD: client (exit 1); usable external/index.js fallbacks refused
CLIENT-PATH MUTANT DETECTED: restoring legacy fallback + removing pin reproduced false PUBLIC-CONFORMANCE PASS; disposable sources restored byte-for-byte
```

The old selector is recreated only in the disposable copy with its fallback path changed to the temporary external client. No actual `/home/claude` path is created/read. Pin alone prevents fallback; removing fallback alone also prevents it; reverting both reproduces cowork's false PASS. The final restored sources fail closed again. Public-wrapper SHA256 `bc1637925a01837612765031c62464997db2f30d96bca838a1fcb0c3223d552f`; adapter SHA256 `34156b3d58b4fdd8b5d0cb5294e3342932e1ed09a14f687f35fcac596ae3b8c6`. Actual working product files were never deleted; assertions restore disposable sources byte-for-byte before cleanup.

## 6. W0 integration confirmation and queue evidence

Independently read GitHub's workflow/job results on W0 integration `9a42b10eb3a66c238dba7b2ad28dc8afb9924709`: [rebuild run34013150167](https://github.com/joeymat11-rgb/prepledger/actions/runs/34013150167) completed SUCCESS, with `rebuild-public (windows-latest)` SUCCESS and `rebuild-public (ubuntu-latest)` SUCCESS. [Existing pipeline34013150174](https://github.com/joeymat11-rgb/prepledger/actions/runs/34013150174) also completed SUCCESS. This answers the requested integration-commit check without asking the owner to relay another status question.

QUEUE now marks W0 accepted/integrated, W6-BRIEF claimed/published for review and W6-REFINEMENT ready to receive review. W6 implementation still needs the published W5 contract and its final CLOCK verdict needs adopted refinement. W7-PREVIEW is the next READY unclaimed Astra item. These are routine evidence updates, appended to DECISIONS; no new scope, additional hours, accepted budget or self-acceptance.

## 7. Seams and uncertainty

W6-RESTORE-BOUND, W6-LATE-CREATION and W6-KNOWLEDGE-LOSS remain explicit. Browser bounds, persistence across the actual target's faults, local sealing/custody, W5 wire/time/lease-history semantics and refinement review are unresolved implementation inputs. The proposed recovery marker can turn an interrupted exchange into an offline recovery interruption; its usability and failure behavior must be tested. No code here proves a fully general durable fence after storage itself stops accepting writes.

The public checker intentionally pins its own client; other runners may explicitly choose another client for a future boundary test. Required adapter caches are exercised in fresh processes by the regression. No real server, phone action, spend, service provisioning or private port occurred. M3 acceptance and the idle experiment remain separate.

## 8. Wall-clock and NEXT

Active work began 2026-09-06 05:03 UTC. Local checks and document review completed at 05:12 UTC (approximately9 minutes); PR publication/CI wait is reported separately in the PR, not hidden in a build-time claim. This is observed elapsed work, not a future delivery forecast.

NEXT: W6-BRIEF unblocks **W6-REFINEMENT review** and publishes W6 storage/standing/test requirements. It does not publish W5's contract, adopt the numeric allowance or finish W6. Cowork verifies this PR's hardening by execution and reviews the brief; Sol reviews the specified refinement through the existing queue process. Proposed next Astra item: **W7-PREVIEW**, subject to fresh status/claim check; not yet claimed here. Existing W5/audit tasks stay reserved. No owner account/phone action is required for this brief. One PR; do not merge.
