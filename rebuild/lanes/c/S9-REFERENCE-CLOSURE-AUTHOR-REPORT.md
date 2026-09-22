# S9 P-S9-2 reference-closure author report

Status: MEASURED RED; the constructed MOCK.md digest omission is detected.
Base: f123133922868ea2a976e399e5b8abb133a3d540.
Branch: rebuild/c-s9-reference-closure.
Owned cell: rebuild/lanes/c/ui-port/reference-closure.test.mjs.

## Contract and red
The cell names all four current design-of-record documents through independent
literal relative new URL expressions and independent sha256 literals.
The production row reads all four URLs and requires no named refusal.
Four changed-document controls use that same assertion path and require an
AssertionError containing D-REFERENCE-CLOSURE CHANGED plus the exact path.
The red-first source deliberately omits only MOCK.md's digest comparison.
That constructed omission is test scaffolding, not a pre-existing product defect.
Expected red: four reference controls green; MOCK.md changed control red by absence.
Removing any one final digest comparison must make its matching control red.
Measured with the exact command below: 5 tests, 4 pass, 1 fail, exit 1.
The named red is D-REFERENCE-CLOSURE changed document: rebuild/m1/MOCK.md.
Red log: C:/Users/joeym/AppData/Local/Temp/earned-s9-reference-closure-d015f1f5fbc446f99fdd23d438b7f403/red.log.
Red log SHA256: 9b254bbc2b538232f986619f73f8edb2dd39fa8f3e99dd55b9767c1b6e6caf57.

## Git-measured reference hashes
Earned-refinement-A.html: fddfe0542c4a578653a11941d96fbf6727dc2d9f83c500449c694339e89ab031.
Earned-additions-C-approved.html: caf9c2dc683e220112bc8bf85ed8dbe670428c8015b1ae8ec7d68a35720b2a45.
ADDITIONS-C-APPROVED-HANDOFF.md: a0963e54240ba0d60c44a18d51399728e11d68239dcad798b094d48de60b6cf5.
MOCK.md: cdf8eb5c3be00359f8f16706022ce153c8d77482df4323e136d223280464300c.
Each working file's Git blob id matched f1231339 before sha256 measurement.

## Static reachability and proposed execution
Static source inspection found the runner recognizes literal relative new URL.
The four relative URLs resolve from ui-port to the four paths above.
Final integrated executedClosure remeasurement remains owed; it was not executed here.
Top-level execution creates frozen metadata and functions only.
Test callbacks read the cell's four named documents through Node fs.
Imports are Node assert, test, crypto and fs; no package or repository module loads.
No network, browser, child process, temp write, runner, engine or package execution.
After runtime grant, run from the candidate root with fixed time and timezone:
$env:MEASURED_TEST_NOW='2026-09-03'; $env:TZ='America/New_York';
& 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --test --test-concurrency=1 'rebuild/lanes/c/ui-port/reference-closure.test.mjs'

## Limits
No package, pin literal, CI, token, runner, engine, seal, ledger or status edit.
The reader is not yet declared by S9.json; integration owns that declaration.
No seal, acceptance, full-candidate PASS or cross-platform conclusion is claimed.
