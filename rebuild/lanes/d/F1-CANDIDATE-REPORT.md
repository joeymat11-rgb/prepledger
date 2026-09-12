# F1 common engine candidate

Lane D author report. CANDIDATE-BUILT; not PR-READY, reviewed, accepted or sealed.
Product commit: 2d50e887011181aaab6deb4099156c6cef0bc2b8 on rebuild/lane-d-f1.
Parent: 964f183; PM authority: DECISIONS:148. Seven product files: +114/-39 lines.
Authoring HIGH; PM-supplied independent Claude MAX review remains pending.

## Evidence

| check | result | reproducible source / local log |
|---|---|---|
| frozen parent product laws | 23 F failures, 5/5 controls pass | f1/product-laws.test.cjs; F1_SOURCE_REF=964f183; .tmp/f1-product-baseline.tap |
| candidate product laws | 27/28 pass; F1-02b remains RED | f1/product-laws.test.cjs; .tmp/f1-product-candidate.tap |
| product fault mutants | 9/9 killed; 2/2 attribution controls; source drift 0 | f1/product-mutants.cjs; .tmp/lane-d-f1/product-mutants-G2DC5i/summary.json |
| historical isolated prototype | 19/19; isolated mutants 8/8 | f1/session-kind-prototype.test.cjs; f1/mutant-check.cjs |
| existing public host regression | 23/23 | host/test/engine-equivalence.test.cjs + journey.test.mjs; .tmp/f1-host-regression.tap |
| new public native F journey | 12/12 | f1/native-journey.test.mjs; .tmp/f1-native-journey.tap |
| Today browser build | PASS; 3 assets, 103 inputs; copy/network scans pass | rebuild/m3/w7-preview/today/build.mjs; .tmp/f1-today-build.log |
| product syntax and whitespace | seven modules parse; diff check clean | node --check; git diff --check |

The public laws exercise actual runtime factories, configured slots, interleaving, retirement, constructor refusal, structural selection, weekly exposures, actual proposal arithmetic/cap, recorded volume, health advice, book completeness and rolling seven-day progress. Five controls compare U/L results to allowlisted frozen source; this is not the full public or private census.

The native journey uses the real encrypted repository, durable client, host and runtime. It proves raw clean-init F debut, both-family partial logging, remove/undo, restart/resume, close with an unperformed lift, correction and qualified next targets at day+3/day+7. The mixed case actually records an intervening U session. A forced F set-save abort leaves revision, ops and outbox unchanged; retry records exactly one set. No initialization-field augmentation is used. The fixture explicitly copies the two recorded loads into exercise configuration after close; automatic load adoption remains unproved.

F1-02b is an active assertion for the inherited B2/D9 latest-effective split correction. It fails on this earlier parent because insertion order still chooses the effective split. Do not skip or weaken it. See F1-BUILD-NOTES.md for the matched-window clarification and unchanged no-F paths.

## Gates still open

- Rebase onto the ruled H3, B1+B2, B4+B3 predecessors; retake pins, run the date-selection law and native continuity on that actual parent.
- Lane B: admit/register F1, supply the cumulative public CI path and inherited-gate successors, then private FULL verdict, receipt and authorized rerun. Lane D has read no private fixture and claims no FULL result.
- Documented builder preflight executable is absent at this parent; requested from PM/B in shared REQUESTS at 06:12 ET.
- PM: independent Claude MAX reviewer and formal v1.0 brief judgment after the owner's starter-set answer. The submitted v0.1 remains frozen; no acceptance/citation lines authored by D.
- Lane C owns F1-14/F1-15 setup companion. F2 tag projection is the next Lane D brief; current regional totals are not qualified by F1.

CI on product 2d50e88: rebuild run 34687928147 fails on both Ubuntu and Windows at `Cumulative B-NTC native-carrier and legacy-census evidence`; successor registration is pending. Existing pipeline run 34687928309 passes. This is not a green cumulative candidate.
