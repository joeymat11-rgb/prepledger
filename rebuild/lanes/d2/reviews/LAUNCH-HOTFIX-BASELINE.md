# D2 launch-hotfix baseline preparation

2026-09-13 00:03 ET. Preparation only; candidate review and verdict pending.
Authority: DECISIONS:193 and astra/LAUNCH-HOTFIX-ADOPTION-BRIEF.md, read before builder rationale.
Exact baseline: 3ef096d671af924caefa346c530f06784f382af0; own review-launch-hotfix worktree, branch rebuild/lane-d2-launch-baseline.
Fresh build: `node rebuild/m3/w7-preview/today/build.mjs`; PASS, 110 inputs, build earned-1e4d3c938f09, three assets.
Immediately executed the emitted app.js in installed Edge with a new synthetic context, local port 0 and the existing static server.
Browser reproduction: 1/1; two assertions pass. Actual pageerror: `__dirname is not defined`; browser dirname/require/process globals are all undefined.
Bundle SHA256: 67bf9005bddaaed3e4908b4bce617f25bbf198650bac95752b6dd6485646af22. Browser and server closed.
Executable annex: LAUNCH-HOTFIX-BASELINE.mjs; run from this exact baseline after a fresh build, with W7_BROWSER_BIN and TEMP/TMP pointing inside the review tree as applicable.
The successful build did not establish browser boot. No physical iPhone or whole-app claim; HOTFIX-DIRNAME.md remains unread.
H3 custody finding: b-package.cjs:2801 invokes Reference.create even for --ci; load-write-reference.cjs passes manifest.baseline.buildSources into legacy-gates.cjs:96-114 publicReferences.
That inventory names two src/history.js blobs, and publicReferences reads every listed blob with git. D2 has not run H3 or read either blob. Routed to B/PM for an authorized exact-candidate gate run; no bypass.
C now has PM write custody under :194; await its separately adopted current-H3 exact candidate and Windows/Ubuntu CI, including the previously failing named Today step. Old hotfix4c19239 is not combined-head evidence.
N2 round 3 remains separately REJECT per b9f9d86, with three findings and six observations; this package does not close them.
2026-09-13 00:06 ET update: PM designated B as sole local H3 runner under193. B executes the unchanged gate on the exact C candidate; D2 reports that as separate package evidence, never as its own execution. Operator dependency resolved; candidate and gate result remain pending.
Timestamp correction: the earlier shared STATUS/REQUESTS labels saying00:08 ET were ahead of the clock; publication1527ee5 is stamped00:05:19 ET, before operator update8119509 at00:06:56 ET. Commit order controls; no elapsed-time claim is made.
