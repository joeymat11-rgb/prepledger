# REVIEW-S10-SPEC-R2-FABLE-l1: S10 final spec, round 2 (T6f re-run after DECISIONS:832)

Reviewer: Claude Fable 5.1, blind (Astra's copy not read). Read-only on the object.
Object: worktree C:\Users\joeym\AppData\Local\Temp\earned-astra-135, HEAD e9ff2ca24e6e3a7632fb1e1724928d8db0fb4945
(detached; = ccc2f63 + the GSS settle fix e9ff2ca), working rebuild/lanes/b/tooling/packages/S10.json
sha256 68e7f964ab0a7adfbb86da9ea422fd8cfc94a8b7c0847c80637308bef3adb614 (106863 bytes) on top of
the committed final spec 4dc2029 (sha256 fbb4a49044e65130f1fbedee5257c61266c6fb340c09e40ae07cd1a1001d7bc4,
106863 bytes; HEAD:S10.json is byte-identical to 4dc2029:S10.json).
Ledger read: DECISIONS.md at refs/remotes/origin/rebuild/t2-client-core = 4ea143a (833 lines), lines 816, 826,
827, 828-831, 832 only. Brief read: S10-TODAY-SPLIT-BRIEF.md at HEAD, sha256 e5aabac9... (81810 bytes,
= the L4 line :831 value), sections 10, 12, 12.1, 13.
Every hash below was taken from blobs extracted with cmd /c "git show REV:path > file" (no PS5 redirect).

## VERDICT: ACCEPT WITH NAMED DEBTS (D-R2-1, D-R2-2, D-R2-3 below; none is a spec-byte defect)

The working S10.json is exactly the S10-REGEN --write result the rule expects after e9ff2ca: three lines
moved, nothing else. It is fit for the T6 commit once the needle re-observation question (Q5) is settled.

## Q1. git diff HEAD -- rebuild/lanes/b/tooling/packages/S10.json: exactly which lines moved

Measured: --stat 1 file changed, 3 insertions(+), 3 deletions(-); -U0 shows three one-line hunks:
- :900  product["rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs"].post
        83f4c1db2e7e0216345e5f7478e88f2e5476dd941368ca67b2fd3877052b4a2c -> 64b0875225bcd7f64009f1ab67a10c88c542821f3b794794fee36c9cbb4718fd
- :910  product["rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs"].post
        cea1cd3f392d8ef679e0659eb2b8cf6c6b9742e23b343ab1927fb797d6fbb74b -> ae42d717897e00d2b532ba8fd420abe7c9fdc3d631c5fbea685766441b26a7c0
- :2053 notes[] PRODUCT MAP sentence: "post is sha256 of the bytes at HEAD dc08f36f56ce..." ->
        "... at HEAD e9ff2ca24e6e3a7632fb1e1724928d8db0fb4945"; the rest of the sentence, the parent
        d7f6540, the two released paths and Roles {edited 22, carried 230, new 47, superseded-by-child 1,
        released 2} are unchanged.
Both entries keep pre null and role "new" (the files are new in S10). No other line moved. FINDING: none.

## Q2. Recomputed posts from the blobs at e9ff2ca

git show e9ff2ca:<path> > file, then SHA256 over the file bytes:
- gss-annex-g6-g8.test.mjs      28870 bytes  64b0875225bcd7f64009f1ab67a10c88c542821f3b794794fee36c9cbb4718fd  = spec :900
- gss-annex-log-timing.test.mjs 19540 bytes  ae42d717897e00d2b532ba8fd420abe7c9fdc3d631c5fbea685766441b26a7c0  = spec :910
Pre-fix control at ccc2f63: 27789 bytes 83f4c1db... and 18557 bytes cea1cd3f... = the two OLD posts, so the
old spec pinned ccc2f63 bytes and the new spec pins e9ff2ca bytes; the commit message's two arrows are exact.
Wider control (scratch verify-posts.ps1): every product entry with a non-null post, except the protected five
(skipped by rule, their lines are unchanged by the diff), re-hashed from e9ff2ca blobs: 295 equal, 0 mismatch,
0 missing, 2 null (the two released paths). The spec's product map stands at e9ff2ca in full.

## Q3. Everything else byte-identical to 4dc2029

The 3-line diff above is the whole difference, so by construction status (BRIEF-ACCEPTED), the 36 children
(one needle each; today-17 still "# pass 726"; the engine-files-differential terminal line unchanged),
brief {file, sha256 e5aabac9..., acceptedLedgerLine 831 with lineSha256 1fa5309c...}, authorizations
(owner :60, contract :49, theme :830 c497e941..., review prefix/terminal), parent (S9, f24476220ec9...,
receipt :809), release.rulingLineSha256 6f6b5410..., tooling.runnerSha256 9fbfdd2d..., sourceBase d7f6540,
artifact paths and protectedSurfaces are byte-identical. Cross-checks: b-package.cjs at HEAD and at 4dc2029
both hash 9fbfdd2d9b09fe2aa8f8bd93090220b302414d32efba78e52a83309a61a7ec7c (= runnerSha256);
.github/workflows/rebuild.yml at both is e3b9c9d1...; git diff --stat 4dc2029 HEAD over b-package.cjs,
rebuild.yml, S10-REGEN.cjs, the brief, production-mapping.cjs and page-bundle.test.mjs is empty.
The needle "# pass 726" is plausible on the fixed bytes: the fix registers no new test (the only
"test(" matches in the diff are two /logged/.test(...) regex calls); the count is still owed by T4 (Q5).

## Q4. The fix commit e9ff2ca

git show --stat e9ff2ca -- rebuild .github and diff-tree --name-status (whole commit): exactly
M rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs (+16) and
M rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs (+14); 30 insertions, 0 deletions.
Content shape: one 13-line helper block per file (painted(check, 5000) + savedScreen(page)), then one
"await painted(() => savedScreen(mounted));" before the oracle at G6 (:221), NEUTRAL (:321), G7 (:398) and
G5 (:261). No assertion, label, plant, until(), within() or timeout line is removed or edited. Test-only,
as :832 ruled (Track B, 6.2). FINDING: none.

## Q5. Which needles are void; what the PM must re-observe

Brief 12.1 item 6 (binding, L4-accepted bytes): "A child needle taken before the last product byte change is
void." Both changed files are declared S10 product (role new). Every one of the 36 needles now in S10.json
was taken at f4125cd (:827) and carried into 4dc2029, i.e. before e9ff2ca. Under the brief's rule ALL 36
needles are void and every child must be re-observed at e9ff2ca before T6, not only today-17.
DECISIONS:832 says "T4 for every child that runs a changed file"; only today-17 runs either file (its argv
lists both; no other child's argv names them). That is narrower than the brief. Named as D-R2-1: the PM
either re-observes all 36 (33 are shared-slot pure-logic children; today-17 and the guard-tripped set are
PM-seat exclusive) or records a ledger ruling that reconciles :832 with brief 12.1 item 6 before the T6
commit. Not for me to pick; the brief's text says 36.
m4-import-production: production-admission.test.mjs:296-320 and production-mapping.test.cjs:~100-115 read
packages/S10.json only for status === 'BRIEF-ACCEPTED' and parent.chosen (then hash the PARENT receipt).
They do not hash S10.json bytes, so its "# pass 28" cannot move because of the two post pins; it depends on
S10.json only through status and parent, both unchanged. It is still void under the brief's rule (D-R2-1).
Spec readers for the record: s10-sup-source-carriers, -inherited-carriers, -defect-witnesses,
-writers-differential, -second-gate and s10-engine-files-differential parse S10.json and compare declared
posts to disk for rebuild/engine paths only; the two moved pins are Today test paths, so no effect expected,
but they read the changed bytes and belong in a re-observation under either reading.

## Q6. Missing before the new T7 merge (runbook T6/T7)

1. The T6 commit itself: S10.json is uncommitted; T6 is the single commit after the last product byte
   change, so nothing product-side may land after it on the lane (the PRODUCT MAP note names e9ff2ca as
   the bytes' HEAD, the same pattern as 4dc2029's note naming dc08f36f; acceptable).
2. Needle re-observation per Q5 (D-R2-1), then the needle values must still equal the committed ones or
   the T6 bytes change again.
3. The census addendum :826 owes "for dc08f36/f2be262 at the final head"; the final head is now e9ff2ca,
   so the addendum must cover e9ff2ca's +30 lines too (D-R2-2).
4. T7 preflight (brief 12.1 item 1): the chain tip has moved from 194f03f (merged at ccc2f63) to 4ea143a
   (:832 appended); the merge must re-measure that chain diff against product, pins, runner and spec.
5. The exact-head both-OS rebuild run at the new merge commit, named by run id and conclusion (brief 13,
   :627); CI-M1 36199898809 at ccc2f63 is red and proves nothing for the new head.
6. Worktree hygiene (D-R2-3): git status in the object worktree shows a SECOND uncommitted entry,
   untracked rebuild/lanes/astra/reviews/S10-FINAL-SPEC-REVIEW-L2.md (not read; blind). The task said one
   uncommitted file. It must not ride into the T6 commit, and the T9 exporter clean step re-reads untracked
   entries, so the PM should place it deliberately (commit as a review or move to scratch) before T6.
7. Astra's round-2 read of the same bytes (12.8) and the PM's own exact-byte read (12.10) before --ci.

## Named debts
- D-R2-1 needle-void scope: brief 12.1 item 6 voids all 36; :832 names only children that run a changed
  file (today-17). Ruling or full re-observation owed before T6.
- D-R2-2 census addendum at the final head must include e9ff2ca (+30 test-only lines).
- D-R2-3 untracked Astra L2 review file sits in the shared review worktree; keep it out of T6.

## AAR
1. Did: diffed the working spec against HEAD/4dc2029, re-hashed 297 product blobs at e9ff2ca, checked runner/workflow/brief shas, read :816/:826-:832 and brief 10/12/13, traced who reads S10.json.
2. Result: spec bytes exactly right (3 lines, both posts verified); verdict ACCEPT WITH NAMED DEBTS, all three debts are process items for the PM, none is a byte defect.
3. Hardest call: brief 12.1 item 6 vs :832 on how many needles are void; reported both readings, took no side.
4. Did not do: no node run, no slot taken, no test executed, protected five never extracted or hashed, Astra's file never opened.
5. Would change next time: the task brief should say how many uncommitted entries to expect (tracked and untracked) so a stray file is a measurement, not a surprise.
6. Scratch: C:\Users\joeym\AppData\Local\Temp\s10-spec-r2-fable (cmd/ps1 helpers, extracted blobs, verify-posts.out); safe to delete after T25.
