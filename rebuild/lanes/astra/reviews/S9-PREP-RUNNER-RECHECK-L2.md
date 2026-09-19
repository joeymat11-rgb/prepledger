# S9 prep runner narrow re-check L2
Reviewer: Astra (Codex), commissioned under DECISIONS:412, :569 and :613; narrow re-check, loop round 2; highest effort
Head: a224c7b063fb50c10659187603263370354827b5
Script SHA256 (certutil): d52acc31c99845ed774c5111a261b84012538495e0ee2caa1d13827c1d28bb53
VERDICT: ACCEPT WITH NAMED DEBTS

Scope: 397ac46693c8088ce168740d35d32e2dd37d4d47..a224c7b063fb50c10659187603263370354827b5; H27, its tests, the reported LIVE type clause, and the seven runner pins. No new hunt outside those changes.
Prior evidence: the specified refs/remotes/origin/rebuild/r-astra-s9a-runner-r6 file ends with "Mutation table pending completion." It contains B1/G3 and D1-D3 but no completed LIVE table. I re-ran the LIVE clause identified in the author's newest section rather than inventing missing rows.

Prior items
G1 CLOSED. Independently committed JSON product key "__proto__": PATH-IS-NOT-CANONICAL product key "__proto__" at spec().
G2 CLOSED. Independent brief, carrier and child "__proto__" inputs: PATH-IS-NOT-CANONICAL brief.file / carrierSuccessor.file / child argv target proto-child, respectively.
G3 / BLOCKING B1 CLOSED. Full old-chain witness reproduced below; HEAD refuses it at admission. Original a.css release plus A.CSS brief also prints PATH-CASE-COLLISION "a.css" (product key) and "A.CSS" (brief.file).
G4 CLOSED. Four-key extra/no-sealedBy record: ANCESTOR-RELEASED-BLOCK-IS-NOT-A-CLOSED-RELEASE-RECORD release.txt. Honest record plus nameless grandparent: ANCESTOR-RELEASE-GRANDPARENT-HAS-NO-PACKAGE-ID release.txt. Honest parsed-JSON record plus named matching grandparent: "plus 1 skipped as released by an ancestor artifact's released block: release.txt".
G5 CLOSED. Independent JSON product "__proto__" is refused by spec() before receipt production. No receipt writer was invoked by my own probes.
G6 CLOSED. Independent witnessPins key "./brief.md" and witnessFlips file "./brief.md": PATH-IS-NOT-CANONICAL carrierSuccessor.witnessPins key / witnessFlips file, respectively.
LIVE sealedBy type clause CLOSED. Removing only typeof block.sealedBy === 'string' && leaves the old release suite 41/41 green; against HEAD tests it yields 41 pass / 1 fail, at (P-A9 d), with TypeError: Cannot read properties of null (reading 'length'). The null row measures the clause independently.

B1 executed input and output
Synthetic Git repositories, canonical committed specs, real runner bytes, both Git keys holding those bytes, and inode equality confirming one Windows file. No main campaign, receipt or real athlete input.
Input: packageId="M2-S8-PROBE"; tooling.runner="rebuild/lanes/b/tooling/b-package.cjs"; product["rebuild/lanes/b/tooling/b-PACKAGE.cjs"]={pre:RUNNER_SHA,post:null,role:"released"}; parent product holds that alias at RUNNER_SHA. A new synthetic child supplies the ordinary own-product control.
PM input: RELEASE-FROM-SEAL M2-S8-PROBE rebuild/lanes/b/tooling/b-PACKAGE.cjs, alone in its U+00B7 clause, with a bare terminal RULED clause. Synthetic owner, contract, theme, brief and exact artifact-review claims are committed and verified by the real functions.
Old output: spec() ADMITTED; product() IMPLEMENTED; envelope().authorized=true; released=["rebuild/lanes/b/tooling/b-PACKAGE.cjs"]; executionPins includes "rebuild/lanes/b/tooling/b-package.cjs"; sameDiskFile=true.
Old edit: LF + "// edited after release" + LF. Output: PARENT-PIN-BROKEN rebuild/lanes/b/tooling/b-package.cjs; actual 3606a68d4901d4610353fb0a11a4b2669bc048feb3b72eb805c57ec9acdcdbb9; expected 71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0. These are R6's exact hashes.
HEAD exact output: PATH-CASE-COLLISION "rebuild/lanes/b/tooling/b-package.cjs" (the runner (a fixed execution pin)) and "rebuild/lanes/b/tooling/b-PACKAGE.cjs" (product key) differ only in case, and on a case-insensitive disk they are ONE file: one spec may not pin, release or execute a path through two spellings. Neither spelling is rewritten into the other
Second fixed-coordinate input: product["rebuild/lanes/b/tooling/packages/S8.JSON"]={pre:"e" repeated 64 times,post:null,role:"released"}, plus a canonical child and release citation. Old spec() ADMITTED.
HEAD exact output: PATH-CASE-COLLISION "rebuild/lanes/b/tooling/packages/S8.json" (this package spec file (a fixed execution pin)) and "rebuild/lanes/b/tooling/packages/S8.JSON" (product key) differ only in case, and on a case-insensitive disk they are ONE file: one spec may not pin, release or execute a path through two spellings. Neither spelling is rewritten into the other
Both fixed coordinates declared as ordinary product pins at their EXACT spelling: spec() ADMITTED at both revisions. Sixteen additional direct canonicalSpecPaths calls, eight other walked fields per coordinate, all refuse their case aliases by PATH-CASE-COLLISION.
H27 is the right fix: both execution coordinates now participate in the same identity invariant as declared paths.

Measured disagreement
WITHDRAWN: the claimed String-wrapper bypass mechanism. The runner imports node:assert/strict; its assert.equal rejects the wrapper even after the type clause is removed. The author is right on this mechanism.
| Input, otherwise honest four-key release record | HEAD | Type clause removed | Author measurement versus mine |
|---|---|---|---|
| sealedBy=new String('M2-S8-FIXTURE'), grandparent packageId='M2-S8-FIXTURE' | CLOSED-RELEASE-RECORD refusal | Same named refusal; actual [String: 'M2-S8-FIXTURE'], expected primitive 'M2-S8-FIXTURE' | Both refuse the wrapper |
| sealedBy=null, same named grandparent | ANCESTOR-RELEASED-BLOCK-IS-NOT-A-CLOSED-RELEASE-RECORD release.txt | TypeError: Cannot read properties of null (reading 'length'); failCode=null | Both reproduce the raw TypeError |
The original coverage finding was valid; the new null witness closes it. No finding remains disputed.

New BLOCKING items: none reproduced.

NAMED DEBTS (carry these lines into S9)
D1 MAP-CONSTRUCTION: the three assignment-built maps still lose a directly supplied __proto__ key; production safety depends on retaining canonicalSpecPaths admission before every producer, including future ones.
D2 DISK-IDENTITY: JavaScript lowercase equality is not filesystem identity; this Windows disk keeps K/U+212A, U+1E9E/U+00DF and U+0130/i+U+0307 distinct while H25 refuses them; none occurs in the 22 standing files.
D3 JSON-BOUNDARY: H26 accepts extra symbol keys, accessor values and a Proxy hiding an extra key in direct calls; retain JSON-only artifact ingress, which cannot deliver any of those object identities.
These retain R6's limits, not reachable bypasses of the admitted JSON chain. H27 adds no map producer or artifact ingress. The Unicode disk and non-JSON exotic-object measurements are retained from R6, not claimed as fresh executions here.

Mutation and witness table
Each mutation changes one production clause in an OS-temp copy; current tests stay byte-identical. All runs are sequential. KILLED means an executed assertion failed, not a syntax error.
| Row | Single-clause change / input | Suite pass/fail/skipped | Output / disposition |
|---|---|---|---|
| H27-R | Delete only seen.push(['the runner (a fixed execution pin)', RUNNER]) | release 41/1/0 | KILLED (H27): Missing expected exception: the runner |
| H27-S | Delete only the fixed package-spec seen.push | release 41/1/0 | KILLED (H27): Missing expected exception: the package spec file |
| LIVE-T | Delete only typeof block.sealedBy === 'string' && | release 41/1/0 | KILLED (P-A9 d): null.length TypeError |
| LIVE-T old control | Same deletion in unchanged 397ac466 runner and unchanged 397ac466 release suite | release 41/0/0 | LIVE reproduced on that historical suite; CLOSED at HEAD |
| B1 old/head | Same synthetic release/re-pin chain | independent probe | Old AUTHORIZED then PARENT-PIN-BROKEN; HEAD PATH-CASE-COLLISION |
| H27-S old/head | Release S8.JSON alias of fixed S8.json | independent probe | Old ADMITTED; HEAD PATH-CASE-COLLISION |
| Exact-coordinate controls | Exact runner/spec spellings as ordinary product keys | independent probe | ADMITTED at both revisions |
| Other path routes | Brief, carrier file/parent, witnessPins, witnessFlips, successor original/carrier, child argv | 16 independent calls | 16 PATH-CASE-COLLISION refusals |
No executable production clause was moved in the range; the two seeded pushes are the two additions. The new null oracle and the labelled wrapper control were also exercised independently above.

Ten suites at this HEAD on this Windows PC
Exact executable: C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
Before each test/probe command, set on separate lines: MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York. Invoked each suite as node --test <file>, one at a time; each exit 0.
| Suite under rebuild/lanes/b/tooling/test | Tests | Pass | Fail | Skipped |
|---|---:|---:|---:|---:|
| child-diagnostic-tail.test.cjs | 11 | 11 | 0 | 0 |
| execution-targets.test.cjs | 9 | 9 | 0 | 0 |
| gate-supersession.test.cjs | 16 | 16 | 0 | 0 |
| parent-gate-closure-and-load-floor.test.cjs | 14 | 14 | 0 | 0 |
| parent-pin-shapes-and-spec-successors.test.cjs | 9 | 9 | 0 | 0 |
| pinned-unchanged-and-ruled-substitutions.test.cjs | 17 | 17 | 0 | 0 |
| product-phase-and-ledger.test.cjs | 7 | 7 | 0 | 0 |
| release-from-seal.test.cjs | 42 | 42 | 0 | 0 |
| seal-tip-and-byte-identity.test.cjs | 17 | 17 | 0 | 0 |
| successor-moves.test.cjs | 9 | 9 | 0 | 0 |
| Total | 151 | 151 | 0 | 0 |

No-release compatibility and byte checks
Both revisions, S8 exact stderr: B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld
Both revisions, H3 exact stderr: B PACKAGE H3 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld
All four comparison runs exit 1, with THREE stdout lines and ONE stderr line. Both streams match byte-for-byte after replacing only the spec and runner hashes on SPEC OBSERVED. S8 remains 224 products/25 children; H3 64/10; each has 24 roots and five superseded carriers.
Old CLI: unmodified old runner and 291 explicitly selected public files in an OS-temp projection, Git object alternates read-only, HEAD=397ac46693c8088ce168740d35d32e2dd37d4d47. HEAD CLI: assigned worktree. Both use chain ref 2405ff747ea0459c51a16212650330e20fbcb21d. No checkout or shared-ref mutation.
S8 spec SHA256: 32f1aad82eea4e89f71ef84ba1e162ae8e2d3e33c087ed6c41c74faca9be5475 -> 0c74ccf29dbf732ac5df5bd2247580d198faa5cc8abd7dc63334519fac1ee173.
H3 spec SHA256: 36a4245f65dcc08dc6602230fb8d61352f0d733449bd1493ce040085fec6577f -> 9e61d30ac6993509c3d3129fd0aaaff3395182b6651086224cc7f0964ecf96eb.
H3/S3/S4/S5/S6/S7/S8.json: the old runner hash occurs exactly once in every file; replacing it with the header hash reproduces each entire HEAD file byte-for-byte. The parsed changed field is tooling.runnerSha256; zero other changed bytes.
Fresh standing scan: real canonicalSpecPaths with each file's CLI ID admits all 12 package files; the ten standing acceptance artifacts have zero distinct lowercase-colliding keys and zero non-ASCII product/execution/released keys.
Final certutil and git rev-parse re-check match the header.

What I did not verify
No --full campaign, whole Today step, engine/conformance gate, generator, deployment, phone, protected soak, private fixture, ledger directory, auth file or frozen app source was read or executed. No full-package PASS is claimed.
No Linux rerun, new filesystem-identity survey, or broader hunt outside the narrow changes. No absent R6 table rows are claimed executed. Mutation counts above are the release suite only; the ten-suite baseline is separate.
Temporary fixtures/helpers/logs are retained at C:\Users\joeym\AppData\Local\Temp\astra-s9-l2-20260919-57c0182a. No scratch deletion was attempted. Helpers: own-probes.cjs, b1-chain.cjs, mutations.cjs, cli-compare.cjs, standing-scan.cjs, common.cjs.
Only this new review file was authored in the worktree; no tracked file was edited and nothing was committed.

Final command transcripts (stdout; git emitted only its existing global-ignore permission warnings on stderr)
$ git status --porcelain -- rebuild/lanes/astra/reviews/S9-PREP-RUNNER-RECHECK-L2.md rebuild/lanes/b/tooling/b-package.cjs rebuild/lanes/b/tooling/test rebuild/lanes/b/tooling/packages rebuild/lanes/b/S9-PREP-RUNNER-AUTHOR-REPORT.md
?? rebuild/lanes/astra/reviews/S9-PREP-RUNNER-RECHECK-L2.md
$ git diff --stat -- rebuild/lanes/astra/reviews/S9-PREP-RUNNER-RECHECK-L2.md rebuild/lanes/b/tooling/b-package.cjs rebuild/lanes/b/tooling/test rebuild/lanes/b/tooling/packages rebuild/lanes/b/S9-PREP-RUNNER-AUTHOR-REPORT.md
(no stdout)
