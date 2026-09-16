# P3-IMPORT-UI - INDEPENDENT REVIEW, ROUND 1

# VERDICT: ACCEPT

Reviewed sha 88d5e5450b37f921609bc1ba4a3b30ca69ee623d (+ ebc4f51c03f7d9a63e07465611e0ce98370af3a8)
on branch rebuild/c-p3-import-ui off 7042576d51958078ea139665cfdbf991a02a0373.
Reviewer cells and probes live in %TEMP%\imp-rv\, never in the repository; every
tail below is my own run on this sha. ACCEPT is a verdict on **the stop**, not on
a delivered screen. The ticket says "the C2b machinery is consumed, not edited; if
it is insufficient, STOP and report". It is insufficient, the author stopped,
removed no guard, touched no sealed byte, and left executed evidence behind. The
two MAJORs below are omissions in the evidence the PM will rule on, not defects in
the ruling.

## 1. The stop is true (verified independently, not on the report's word)
`rebuild/m3/w6/local/source-admission.mjs` lines 16-19 statically import
`m4/workout/engine-runtime.cjs`, `m4/import/local-source-profile.cjs`,
`m4/import/local-source-order.cjs` and `m4/import/browser-replay.mjs`, all four
FORBIDDEN by name in `rebuild/m3/w7-preview/today/build.mjs:45-64`, the page's own
accepted law. `createLocalSourceController` has exactly one definition in the tree
(source-admission.mjs:31) and every other caller is a test or a review annex, so
there is no second, page-safe door. I re-ran P3-B1..B4 on this sha: green,
including the input law refusing the graph with the Node harnesses stubbed.

## 2. Findings

**1. MAJOR - the stop analysis omits the one measurement that moves the ruling.**
The whole C2b custody stack IS page-safe today, and the report never says so. My
probe %TEMP%\imp-rv\probe-custody.mjs (accepted bundler, accepted `assertBundleInputs`):
- shipped baseline: 121 modules, 1 660 910 B
- today-entry + `m3/w6/local/import-bundle.mjs`: 122 modules, 1 662 891 B, LAW PASS
- today-entry + `m3/w6/local/browser-entry.mjs`, the exact module the ticket's
  READ FIRST names as the C2b exports: 123 modules, 1 663 918 B, LAW PASS
So +2 modules and +3 008 bytes buys step 1, step 2, Unlock, the BUNDLE_AUTH_FAILED
/ BUNDLE_PAYLOAD_INVALID / LOCAL_IMPORT_ALREADY_PRESENT / LOCAL_IMPORT_REBASE_
REQUIRED copy, the listImports summary and cancel. Only step 3's review and
confirm are walled. This is not a request to ship a custody-only
screen - custody without admission writes an import entry and shows Joe nothing,
which is arguably worse than no door - but that trade-off should be costed, not
left unmeasured. It changes section 3 directly: option 3 ("admission stays on the
PC") is nearly free on the page, and the report does not let the PM see that.

**2. MAJOR - the runbook's pre-check 6 discharge is flatter than the evidence.**
P3-RUNBOOK.md now reads "**DISCHARGED IN CODE (P3-IMPORT-UI).**" with no caveat.
Every admitting cell qualifies through a mapping the harness authors itself:
`support.mjs:207`, `id: 'TEST-ONLY-p3-mapping'`, with its own enumerated calendar.
I confirmed the author's open item 3 independently: every
`createProducerRegistry` caller in the tree is a test or a review annex, so the
live clock is necessary and proven and still not sufficient on Joe's real bundle,
which would refuse SOURCE_ENGINE_CONTEXT_UNPROVEN. That caveat belongs in the
runbook, not only in report section 9. The cells are right; the one sentence that
governs the real run is too confident.

**3. MINOR - a suite verdict was predicted, not executed, and is wrong.**
Report section 5: "`b-package --ci --package S5` should be **GREEN**". I ran it:
`B PACKAGE S5 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP`. Expected red per the ticket,
for a reason unrelated to drift. The drift conclusion itself is right and I
verified it separately: no `lanes/c` and no `w7-preview/import` path appears
anywhere in packages/S5.json, while `today-app.cjs` (S5.json:433) and the fifteen
`measure/**` files (:503-573) are pinned and untouched. Sealed drift: NONE.

**4. MINOR - the controller's identity question is never pinned by a cell.** It is
`prefix_question` at source-admission.mjs:80 ("Did every workout in this file
happen before this first Earned workout, with none already recorded in Earned?"),
and `prepareSource` (:168) takes `prefixAnswer` beside `identityConfirmed`, but
`support.mjs`'s `admit()` passes `{identityConfirmed: true}` only. That string is
the one screen-facing sentence the next author must reproduce word for word, and a
cell pinning it would have survived whatever section 3 ruling lands.

**5. MINOR - bar (d) proves programme drift, not identity.** `STRANGER_SETUP`
changes `athlete_label` and one exercise's set count, and the code observed is
LOCAL_SOURCE_PROGRAMME_UNRESOLVED. A file differing only by athlete label is
untested, so the refusal holds for a different week, not a different person.

**6. MINOR - three report rows the ticket asked for were skipped as unreachable.**
I ran them here: coach 231/231, client 18/18, rig187 PASS. All green, but the
rows belonged in the report.

**7. MINOR - the report is 126 lines against the ticket's 90** (sections 2, 3, 9), disclosed by the author.

**8. NOTE - `--out` placement.** `support.mjs` seals into `%TEMP%\imp-out-<random>
\out` (mkdtempSync prefix `imp-out-`), a sibling of the mandated `%TEMP%\imp-out\`:
outside every git tree, synthetic bundle only, no private path read or named, so
the privacy intent is met and the letter of the instruction is not.

**9. NOTE - nothing was weakened, and the wall was fenced rather than argued.**
763 insertions, 9 deletions, every deletion prose inside P3-RUNBOOK.md; no engine,
`m3/w6/**`, `m4/**`, `measure/**`, `rebuild.yml` or `lanes/b/tooling/**` byte.
`page-bundle.test.mjs` is written to go RED the day the wall comes down, and P3-L4
keeps the frozen-clock bug under an assertion. Report section 5's route round the
measure seal is real: `measure-view.mjs:183` publishes that data-slot as claimed.

**10. NOTE - bar (a), (b), (e), (g), (h), (j) are unmet by necessity**, and I did
not run Edge either: there is nothing to tap. A1 builds at 121 pinned inputs with
no import route in it, which is the WHY this ticket opened with.

## 3. Tails, all my own runs on 88d5e54 (TZ=America/New_York)
```
P3 import cells:      tests 15   pass 15   fail 0   duration_ms 1488.5202
port:                 tests 65   pass 65   fail 0   duration_ms 2737.7126
today-17 (7 files):   tests 276  pass 276  fail 0   duration_ms 15280.073
today-17 (6 files):   tests 369  pass 369  fail 0   duration_ms 5629.3302
today-17 (measure 4): tests 21   pass 21   fail 0   duration_ms 52446.0662
W6:                   tests 586  pass 586  fail 0   duration_ms 8627.2181
coach:                tests 231  pass 231  fail 0   duration_ms 997.3456
client:               tests 18   pass 18   fail 0   duration_ms 124.8061
rig187:               PASS (5 OK rows, real and mutant)
A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-c41c7b74a73f; approved design pinned; 69 bound classes; 2 pinned typefaces inlined; no literal figure in the template; 3/3 assets scanned and free of any network reference; no em/en dash in any text the athlete can see
A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256; cache name earned-slice-9fae5d08f01c2584b2e175324855b894 derived from those bytes (no version constant)
b-package --ci --package S5: FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP (expected red, ticket's own note)
probe-custody: baseline 121/1660910 B; +import-bundle 122/1662891 B PASS; +browser-entry 123/1663918 B PASS
```
Copy census on all six changed files: zero U+2013, zero U+2014, zero CRLF; the
runbook's six em dashes are all in sections this ticket left intact.

## 4. What the PM needs from this review
The stop is sound and report section 3 is the right shape. Before ruling, take
finding 1's number (the custody half is +2 modules) and put finding 2's caveat in
the runbook. Findings 3-8 are hygiene, clearable without touching a product byte.
