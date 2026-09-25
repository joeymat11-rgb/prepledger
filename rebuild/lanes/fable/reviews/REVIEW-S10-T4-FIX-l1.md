# REVIEW-S10-T4-FIX-l1 - independent Fable review of the S10 T4 re-pins (A) and (E)

Reviewer: Fable 5.1 (independent; did not write the fix). Lane W: %TEMP%\earned-s10int at 92be4e3, two files modified and uncommitted.
Scope: `git diff 92be4e3 -- rebuild .github/workflows/rebuild.yml` (soak excluded; not read). Static reading only, plus the REGEN dry run through pm-run shared. No test was run and nothing under the protected five was read or hashed.

## VERDICT: ACCEPT

## What the diff contains (2 files, 26 insertions, 7 deletions; rebuild.yml untouched)

(A) rebuild/m4/import/production-mapping.cjs, 1 line changed, 1 comment added.
- treeSha256 af5a187e0f55a307... -> 9c13505441a479cb98a6cc9a25358cec9d983bac0f08b342b0109e3d93f6709a, the value the PM measured from port.cjs engineDigest() at 92be4e3 (production-mapping.test.cjs:44 P3-M1 reported expected 9c135054..., actual af5a187e...).
- The pin is re-set to one exact value; nothing is widened, removed or made conditional. sha256 dd653bc1..., schemaV 60 and path are untouched, so the four-field set at :225 still matches port.cjs:714.
- The added comment is a `/* */` block like the rest of the file, and it is true: today.cjs and writers.cjs are top-level rebuild/engine modules and engineDigest() (port.cjs:222-226) hashes every top-level .cjs there. The existing comment's "18 engine modules" still holds: 18 top-level .cjs files at 92be4e3 (names only; no content read).

(E) rebuild/m3/w7-preview/import/test/page-bundle.test.mjs, two pins re-set, two comment blocks and two failure messages updated.
- :190 withAdmission.inventory.length 143 -> 146; :403 delta 21 -> 24. Both are exact values, not ranges; ROUTE_MODULES 19 and BASE_PINNED_INPUTS 121 are unchanged, so the route-only set is still asserted name for name.
- The counts match the three added modules: 143 + 3 = 146 and 21 + 3 = 24 (boot graph 123 -> 126, route-only 19 unmoved). Static check of the boot side: today-model.cjs:54 requires ./today-readings.cjs, today-app.cjs:39 requires ./today-lanes.cjs, gym-app.mjs:23 imports ./gym-settings-lane.mjs, and build.mjs REQUIRED_INPUTS names all three at :114, :115, :126 (git grep at 92be4e3). package.test.cjs:139-140 and :173-175 already record the same three as REQUIRED_INPUTS siblings.
- Comment history is consistent: the preceding block calls PASSPHRASE-NORMALIZE the SIXTH ticket (143), so S10 is the SEVENTH; the delta block calls PASSPHRASE-NORMALIZE the SECOND ticket to move the boot graph (after B-LOM), so S10 is the THIRD. Both new blocks say the figures were measured by the PM at 92be4e3 rather than summed, which is the file's own rule.
- Path note: the brief's `today/test/page-bundle.test.mjs` does not exist; the edited file is `import/test/page-bundle.test.mjs`, the one S10.json:688-690 declares. The fixer's correction is right.

## Pin search (repeated independently)
`git grep -n -E 'af5a187e|abf1ff15|e7fe3672|9c135054' -- rebuild .github/workflows/rebuild.yml ':!rebuild/conform/private' ':!rebuild/engine' ':!*soak*'`
- af5a187e live: only production-mapping.cjs:55 at HEAD (now :56 re-pinned). Reports P3-PRODUCER-MAPPING-AUTHOR-REPORT.md:17 and P3-PRODUCER-MAPPING-REVIEW-R1.md:15 are history and correctly left alone.
- abf1ff15 (file sha of production-mapping.cjs): S10.json:1019-1020 (REGEN updates it), and sealed S6-S9 packages, receipts and acceptance specs. Correctly left alone.
- e7fe3672 (file sha of page-bundle.test.mjs): S10.json:689-690 (REGEN), S9.json:435, receipts/S9.json:121, acceptance-s9-ui-pins.json:588 and :1885, PASSPHRASE-NORMALIZE-REVIEW-R2.md:400. Sealed history; correctly left alone.
- 9c135054 appears only in the re-pinned line. rebuild.yml has no hit.
- Second sweep for other count pins (`inventory\.length, 1[0-9]{2}|BASE_PINNED_INPUTS, 2[0-9]|treeSha256` over rebuild/m3, m4, coach): only the two re-pinned assertions carry counts; every other treeSha256 site is dynamic (port.cjs, production-admission.test.mjs comparing to Mapping.ENGINE) or a fixture 'b'.repeat(64). Search complete; no weaker or missed pin.

## REGEN dry run (re-run: `node %TEMP%\pm-run.cjs shared fable-s10-regen-review %TEMP%\pm6-s10regen.cmd`, slot after 0 s, no --write)
Log %TEMP%\pm6-s10regen-dry.log: HEAD 92be4e3, 302 product paths, "0 entr(ies) would change", three D-SPLIT-PARENT EQUAL, then `PROBLEM disk differs from HEAD (commit first)` for exactly the two edited files, `DRY RUN: nothing written`, EXIT=1. This agrees with the fixer: REGEN reads HEAD, so the carried -> edited flip for both entries (post shas below) can only be confirmed after the PM commits. No other path is flagged.

## Bytes
- production-mapping.cjs: pre abf1ff157045b2070c030de2d473eb6784f9bcffbfca433c09897de9a8b4264a (matches S10.json:1019), post ef405ab3294922174a8a4e8d48fa4f1492ee05b6b536e9655b39fa61bb6b73c2.
- page-bundle.test.mjs: pre e7fe36724aef60d9bdb14396cb12f2fcd58c412873929719552d698e6ae13220 (matches S10.json:689), post bedb5c8e37186bff6221e0749a9e3896c4e1e575d4684a96aaf7807ff9eba9a9.
- Both hashed by node from the file bytes; no CR, no U+2013/U+2014; `node --check` passes on both.

## Named reliances (not debts)
- 9c135054... and the counts 146 / 24 are the PM's measurements at 92be4e3; this review checks the pins against those and the static graph, and did not recompute engineDigest() (that would read the protected engine bytes) or run page-bundle.test.mjs (guard-tripped child). The PM's post-commit run of the 36 children is the confirmation.
- P3-M3 and the production-admission file-level fail remain the sealing-window rule (S10.json PROPOSED until T6); out of scope and unchanged by this fix.

## AAR
- asked: independent review of the two S10 T4 re-pins, the pin search, the count arithmetic and the REGEN dry run, static only.
- happened: diff read in full; both pins re-set to the exact measured values, comments true and consistent with the file's ticket history; pin search repeated with identical hits; boot-side imports and REQUIRED_INPUTS confirmed by git grep; REGEN dry run re-run and agrees.
- rework: none required.
- escaped: nothing; the fixer's path correction and the sealing-window reds were already disclosed.
- lesson: a pin whose value is a digest over a directory (engineDigest) moves whenever any file in that directory moves, so an S-ticket that touches rebuild/engine should list production-mapping.cjs as edited up front rather than carried.
- cost: about 12 tool calls, one shared runtime slot for the dry run (held 0 s wait), no exclusive slot, no test executed.
