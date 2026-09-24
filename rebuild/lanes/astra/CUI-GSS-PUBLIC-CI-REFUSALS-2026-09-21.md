# CUI and GSS public CI refusal evidence
PM integration reconnaissance, 2026-09-21. No acceptance or guard waiver.
Supersedes only the unknown failure-code portion of CUI-GSS-PUBLIC-CI-STATUS-2026-09-21.md.

## Exact observed refusal, both operating systems
GSS04ea69e, run35663801586, jobs106544901237/106544901547:
SEALED-PROFILE-RECOMPUTATION.
GSS accepted split baseb35a48e, run35631340226, jobs106438004635/106438005132:
SEALED-PROFILE-RECOMPUTATION.
CUIcf149820, run35661341912, jobs106537043174/106537042068:
SEAL-BASE-IS-NOT-THE-CHAIN-TIP.
CUI initial base6c593603, run35624678952, jobs106416007304/106416007600:
SEAL-BASE-IS-NOT-THE-CHAIN-TIP.
Eight job log requests returned200; each contained exactly one matching S8 refusal line.

## Mechanism checked without executing package helpers
At all four heads, the S8 artifact's runner and spec SHA256 pins equal actual Git blob bytes.
The runner's proposed(s,bound) recomputes executionPins from child file bytes and compares
the complete result to the sealed artifact before it can accept that artifact.
At GSS04ea and splitb35, both selected adapter and machine-settings UI test bytes differ
from their sealed executionPins. The adapter's actual hash is identical between those heads;
the settings UI test has different actual hashes at each. Either mismatch is sufficient
to prevent byte equality with the S8 artifact. This is not proof that these are the only differences.
Selected design/gym test pins equal the artifact at both GSS heads.
The same four selected test pins equal the artifact at both CUI heads.
The CUI observed refusal is the runner's separate chain-tip ancestry guard, as its source defines.

## Evidence custody and limits
Collector %TEMP%/pm-ci-safe-refusals-704.ps1 fetched logs in memory and output only the
strictly framed B PACKAGE S8 FAIL code when the code was present in the runner source.
No raw log was printed or saved. Eight complete-log hashes and job IDs are retained in
%TEMP%/pm-ci-safe-refusals-704.json. Authentication was never printed or passed in a URL.
Pin check %TEMP%/pm-ci-s8-pin-check-704.ps1 reads only three named public package files
and four named Today tests as Git blobs, hashes bytes, and executes none of their code.
No private fixture, old-app source, protected soak or quarantined scratch was accessed.

## Integration consequence
Do not call the GSS failure a chain-tip refusal or repair it by changing the S8 artifact.
Changed sealed tests must travel through their authorized successor package and complete
its declared review, platform and seal checks. Preserve S9/S10 ownership and parent checks.
CUI must separately satisfy the accepted chain-tip integration procedure.
No rerun, source edit, artifact rewrite, merge, seal or deployment was performed here.
