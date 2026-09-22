# S9 directory-reference checker root-dot supplement L3
Verdict: ACCEPT for the existing authorized Windows-local PM read-only check.
Candidate a23c079b1bda934257cce944fc2763d914636956 and sourceBase are unchanged.
Final helper SHA256, independently verified before/after controls:
83eb00a95950ba68cb586268924263d36fb9e4e620347e4d2c912b2b179fdcea
Helper: retained checker folder/s9-source-custody-check-a23c079-directory-fix.cjs.
Removing one exact line reproduces accepted L2 fb75b6a2 bytes exactly:
if (index === 0 && base === '.') continue;
No other algorithm, permission, target, path, output, or cap change exists.
Public browser-build.test.mjs:11 really supplies the no-trailing-slash root reference.
Actual PM STOP log retained, SHA256:
b6e1cfddfcbf063bd25beab9c6ac095b07078519342de435fbe15f501915f4c1
The direct root is a directory; the skip occurs only before its extension candidates.
Root '.' still tries '..cjs'; root './' still tries './.cjs', canonical '.cjs'.
Independent builtins-only synthetic harness SHA256:
5b16febaf972166888a570041bf611d5b7f740fc1915bc7a44b9daf268f66bfb
PID63680 exit0 reproduces GIT_ENTRY_SHAPE using unchanged accepted L2 helper.
Red log SHA256: 7d33a4fcd8fdcd8118d6b64e01c20dccf09823e7c292dea2f6eff4aa9890dcfa
PID45856 exit0 proves final dot-root closure is exactly target plus '..cjs'.
Green log SHA256: 0fd55f205b63e85de47fdc6ec23c49996359cc649d96eea1fa228fc655e1a4df
Prior slash-root, exact four-file closure, eight refusals and Windows regular-slash parity pass.
Synthetic harness uses fresh disposable Git data and actual helper definitions without main.
No real integration helper, protected source, repository module, or private census was run.
Both processes terminal; runtime released immediately before this report.
Earlier L2 evidence, slash-link red and the actual failed PM check are preserved.
PM may invoke this exact final helper under permission 766; retain any further STOP/HELD.
This does not claim Linux/path parity, complete closure, full package or final seal acceptance.
