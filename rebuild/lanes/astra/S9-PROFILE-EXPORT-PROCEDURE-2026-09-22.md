# S9 proposed artifact export procedure
Status: prepared, NOT independently reviewed or executed. This is not an execution grant.
Current integration e5d3d05 has no S9.json, so it cannot supply the final export inputs.
Scratch helper: %TEMP%/earned-s9-profile-export-preparation/export-s9-profile.cjs.
SHA256: 7541ad0eddf124dc61f08ffe2aeae97c583f61d351bf618b40c15b0344deddc4.

The exact future invocation, after reviewed committed inputs and runtime authority, is:
node export-s9-profile.cjs --execute-reviewed-export <integration-root> <full-head> <runner-sha256> <new-s9-child-name>
Run with the pinned Node executable. Replace values with the reviewed final immutable inputs.
The fixed reviewed scratch root is C:/Users/joeym/AppData/Local/Temp/earned-s9-profile-export-results.
Create/verify that ordinary directory before execution; its physical path must equal the literal.
The destination is a new s9-prefixed child created exclusively; existing paths and junction aliases refuse.
No existing artifact, review, receipt or product file is overwritten by this helper.

The helper asserts clean HEAD, disk/Git runner and spec identity, and one main-sequence marker.
It compiles the real unchanged prefix using the runner's original filename and module paths.
Its appended calls are spec(), parent(spec), and proposed(spec,bound), in that order.
It does not invoke the campaign, laws(), children(), privateOracle(), gates() or receipt writer.
It does import the original top-level dependencies; it is NOT a pure static source checker.
It uses JSON.stringify(value,null,2) plus one LF for each exported artifact.
The accompanying review envelope is exactly version1, statusPENDING, receipt:null.
The helper directly emits two fresh scratch JSON files and hashes; caught exceptions expose no text.
Imported-module/subprocess output is not generally suppressed and still needs containment review.
Final spec/runner/HEAD and chain-ref identities plus clean tracked state are checked before writing.
Every artifact product/post, execution pin and parent artifact/review pin is checked against disk and Git.
These checks supplement final-input containment review; they do not authorize protected reads.

Before execution the independent reviewer must trace the top-level import effects and the
spec()/parent()/proposed() call effects against actual final inputs, including Git and reads.
Direct dependencies: conform/v4/postfix/{run,legacy-gates,strict-json,target}.cjs;
m4/spec/native-carriers-errors.cjs and m4/spec/load-write-reference.cjs, all under rebuild/.
Their transitive behavior is not yet cleared by this note. No source is stubbed or copied.
A protected-source read/hash permission for the separate checker does not authorize this compile.
Do not run it before containment review and required owner/runtime authority.

A write failure can retain an incomplete output directory; never delete or install it as a success.
Install only after terminal exit0 and the success marker, both exact files, hashes and parse checks.
After the approved export, independently compare the two scratch JSON files, hashes and fixed
coordinates, then install as rebuild/m4/spec/acceptance-s9-ui-pins.json and review-s9-ui-pins.json.
Run actual --ci on committed final inputs; envelope() must recompute the same complete object.
Re-export after any input change. PENDING never grants acceptance or a private full run.
Final Claude, separately authorized private --full, receipt, review envelope and subsequent
byte-identity proof remain in brief section6 order. No invented receipt or PM token.
