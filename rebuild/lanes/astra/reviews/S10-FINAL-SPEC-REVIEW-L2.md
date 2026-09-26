# S10 final spec review L2
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM; blind; package tier; round 2
Head checked: e9ff2ca24e6e3a7632fb1e1724928d8db0fb4945.
Disk spec: 106863 bytes; sha256 68e7f964ab0a7adfbb86da9ea422fd8cfc94a8b7c0847c80637308bef3adb614.
HEAD spec sha256: fbb4a49044e65130f1fbedee5257c61266c6fb340c09e40ae07cd1a1001d7bc4.
VERDICT: ACCEPT WITH NAMED DEBTS
Acceptance covers this final-spec re-pin and static declarations only; it is not a seal or execution acceptance.

## Q1. Exactly which keys changed; nothing else moved
Invariant: only the re-pin and its generated provenance move. Measured: THREE JSON leaves, three textual substitutions.
product[rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs].post:
83f4c1db2e7e0216345e5f7478e88f2e5476dd941368ca67b2fd3877052b4a2c -> 64b0875225bcd7f64009f1ab67a10c88c542821f3b794794fee36c9cbb4718fd.
product[rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs].post:
cea1cd3f392d8ef679e0659eb2b8cf6c6b9742e23b343ab1927fb797d6fbb74b -> ae42d717897e00d2b532ba8fd420abe7c9fdc3d631c5fbea685766441b26a7c0.
notes[1]: provenance advances dc08f36f56ce36303ddccc8223def0fb38c6319b -> e9ff2ca24e6e3a7632fb1e1724928d8db0fb4945.
Counterexample to literal "two keys only": notes[1] also moves, as S10-REGEN's static MEASURED constructor requires.
Replacing exactly these three old JSON values reproduces the entire disk file byte-for-byte. No other byte moves.
notes[8] is unchanged, as are notes[0,2,7], all children, authorizations, coverage, release and artifact coordinates.
Both posts recomputed independently from explicit HEAD blobs match the claims AND test-file disk bytes (28870 / 19540 bytes).
Neither test was executed. Roles unchanged: edited 22, carried 230, new 47, superseded-by-child 1, released 2; total 302.

## Q2. Truth of declarations and changed values
Inputs: selected chain DECISIONS:816,826,827,828-831 only; brief; parent artifact; runner source; current and historical S9 specs.
Brief file rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md: 81810 bytes;
sha256 e5aabac9809f70dc5dcc105892a4f4ff468193d713c6e6d99a044bf40e5b74c8 matches both spec and L4.
L1 :828 = 6f6b5410071eab452cfa0a9f46748ea08c1db8533345f46361ea91626106c525.
L2 :829 = d8884ec6f13e0df0ff078bc2c0d2d90ffc1c06d1820c15fdcf5e3ddcaa550c92.
L3 :830 = c497e941acaf414c9dfa9a2c2a562af27d02149065cee4e0b3780df141c1c17b.
L4 :831 = 1fa5309c2d70eaa39873439e85e689c43083a720eb857d8102667dd640e3bea0.
All four hashes recomputed from UTF-8 line bytes without line terminators and equal the spec citations.
L3/L4 embedded text, role cowork, line number and terminal ACCEPTED match exactly; L1/L2 terminal clauses are exactly RULED.
Status BRIEF-ACCEPTED and packageId M2-S10-TODAY-SPLIT agree with L4 and :816.
Review prefix POSTFIX-ACCEPTANCE M2-S10-TODAY-SPLIT, role cowork and terminal ACCEPTED pass the runner's static predicates.
Artifact acceptance-s10-today-split.json and review-s10-today-split.json under rebuild/m4/spec/ equal the package-derived names.
Release: exactly today/today-app.cjs and today/gym-app.mjs under rebuild/m3/w7-preview/ match L1's set.
Both release pre-images equal parent artifact pins; post=null. Neither enters any of the FIVE execution-pin routes (Q25 PASS).
Parent artifact bytes at sourceBase hash to f24476220ec9fe187aded6d708c2371a3f604c3f2a41bb94a9594e351d8b8b1c.
Supersession: five carrier keys equal L2's set; L2 expressly covers nine gates and the two EPP engine changes.
All five whys cite DECISIONS:829 (RULED), its correct 12-character hash prefix, and their own declared s10-sup evidence child.
All referenced differential evidence children exist; no why carries PROPOSED or S9's no-engine-change justification.
This verifies the claims' binding and evidence coordinates, not execution of their historical reconstruction assertions.
notes[0]: L1-L4 coordinates, brief hash and parent hash agree; its historical child observation is bounded below.
notes[2]: today-17 has 22 actual file arguments, 2 flags, and needle '# pass 726', agreeing with :827's observation.
notes[7]: own supersession/release hashes and engine-change explanation agree with L1/L2; no proposed token remains.
notes[8]: unchanged means its older CI and sensitivity assertions are carried, not newly verified by this review.
Runner disk hash equals tooling.runnerSha256 9fbfdd2d9b09fe2aa8f8bd93090220b302414d32efba78e52a83309a61a7ec7c.

## Q3. Child needles and S9 precedent
Static source: b-package.cjs:1962-1967 closes child keys and checks a single string, trimmed length >=8, no CR/LF.
b-package.cjs:2839 uses new RegExp('^' + escapeRe(c.needle), 'm'); it has no end-of-line anchor.
Measured 36 unique children, exactly one needle each: 35 '# pass N' strings and one engine differential terminal prefix.
Fresh builtins-only probe: shape PASS 36/36; line-start synthetic output matches 36/36; embedded negation refused 36/36.
Counterexample to exact-line matching: appending a suffix still matches 36/36. This is the existing substring contract.
No assertion here converts a syntactically valid needle into a measured current count.
S9 final commit 6dc2596 was read with explicit S9.json path: 33 children, 32 populated needles, b-lom null.
Current S9.json has 32 children, all populated. S10 uses its populated line-prefix shape, not the historical null exception.
PM T4 needle table sha256 ad2374d64792d0422c67a1b6f2c8f6e0e8d4e646c705156ae44cb28a3dce17eb matches notes[0]'s prefix.
34 needles match that table literally; engine differential matches after removing its table-only 'TERMINAL:' label: 35/36.
The remaining m4-import-production table value is '# pass 19'; the spec has '# pass 28'.
:826/:827 explain the pre-T6 sealing-window refusal and require re-observation. The permitted ledger lines do not prove that later 28.
notes[0] asserts a later 28 observation; I neither reproduced it nor treated the older 19 as a current failure.

## Q4. T6 completeness
Runbook bytes hash to a39a0253ae658eaebe72f11bdd83068bf1eec766fe1f1aad936336cd04300578.
Its T6 fields are filled; brief section 8 adds s10-copy-lock, explaining 36 versus the runbook's earlier 35.
No missing final-spec field found. notes[8] remains reconciled text; this round leaves it alone as instructed.
Q25's five-route release exclusion is measured above. The full required T6 static-check result of 0 REFUSED is not claimed.
Separate Fable final, PM exact-byte read and commitment of the reviewed bytes remain requirements, not outputs of this review.

## BLOCKING items
None found in the round-2 declaration diff. The third leaf is accurate generated provenance, not an unexplained product change.
The seal remains gated by the named debts below; this verdict does not authorize bypassing them.

## NAMED DEBTS / Q5. Before the seal
D-L2-STATIC: PM must retain the prescribed T6 static check with 0 REFUSED and complete ruling/receipt verification.
My selected-line checks cannot establish whole-ledger uniqueness and do not execute the runner's complete spec validator.
D-L2-EXECUTION: current-byte 36-child evidence, including m4-import-production 28 and both re-pinned Today cells, is owed here.
The f4125cd table predates the two changed test blobs; carried needle equality cannot prove their current execution.
PM's later --ci/--full must establish current outcomes; any product move requires the brief's REGEN/review/re-observation order.
D-ACCEPTANCE: independent Claude final over writers, GSS, released exceptions, declarations and EPP clauses; PM exact-byte read.
D-EPP-3 / D-S10I-8: authorized port/sensitivity/private evidence and the real-engine four-deletion RED half remain outside this review.
D-L2-SEAL: proposed artifact/export, exact-artifact acceptance, receipt and envelope, seal/recheck and exact-head Windows/Linux CI remain.
Carry the brief's D-S10R11-1..5, D-S10L5-1..6 and six D-COPYLOCK debts until their own evidence pays them; this re-pin pays none.
D-BLOM remains the stated protected-surface debt; no claim or attempt to re-measure it here.
:826's final-head census addendum and D-NODE-MODULES-HOME are not closed by this spec edit.

## Not verified / containment
No repository module or child test was loaded or executed; no b-package, REGEN run, --ci, --full, receipt or artifact generation.
Only Node builtins and explicitly selected Git blob reads powered the probes, one Node process at a time; required NOW/TZ set.
No protected engine, legacy source, private data, soak, auth file or claude-epp scratch was opened; no peer review was consulted.
No hosted CI, browser behavior, EPP semantics, complete product-pin census or older note[8] evidence was independently re-established.
No scratch files created, tracked files edited, commits, pushes or deletions. This is the only file written by the reviewer.
