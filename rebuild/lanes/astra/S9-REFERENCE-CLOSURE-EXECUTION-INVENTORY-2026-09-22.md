# S9 reference-closure execution inventory v1

- Static inspection at clean integration `cd58925a2b74d786be03e921b89debb4e68d5b34`; no test or repository module ran.
- Declared child argv is exactly `--test --test-reporter=tap rebuild/lanes/c/ui-port/reference-closure.test.mjs`; needle is null.
- Local measurement command: pinned Node executable plus those exact argv, cwd at repository root; no clock, TZ, browser, network, package install, or extra target.
- Target SHA-256 is `0ac19325f0969270037f4e9c778a1e126793767442c455ad856dc4c4b607f48b`, equal to its S9 `role:new` post.
- Current S9 spec SHA-256 is `7dd5fd4c34b5bc96b38753d4512cc2f77a42b618333891dbf983ea9db397ed3d`; runner SHA-256 is `5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22`.
- The four exact public inputs and current/literal SHA-256 values are:
  - `Earned-refinement-A.html`: `fddfe0542c4a578653a11941d96fbf6727dc2d9f83c500449c694339e89ab031`.
  - `Earned-additions-C-approved.html`: `caf9c2dc683e220112bc8bf85ed8dbe670428c8015b1ae8ec7d68a35720b2a45`.
  - `ADDITIONS-C-APPROVED-HANDOFF.md`: `a0963e54240ba0d60c44a18d51399728e11d68239dcad798b094d48de60b6cf5`.
  - `rebuild/m1/MOCK.md`: `cdf8eb5c3be00359f8f16706022ce153c8d77482df4323e136d223280464300c`.
- S9 declares all four `pinned-unchanged` with identical pre/post hashes.

## Actual effects
- Imports only `node:assert/strict`, `node:test`, `node:crypto`, and `node:fs`; no local helper or product module is imported.
- The Node test runner isolates the single test file; inside it, calls are `fs.readFileSync`, SHA-256, in-memory `Buffer.concat`, and assertions only.
- One positive test reads all four files once. Four refusal tests each read all four again and append a constructed string in memory to one selected result: 20 public reads total.
- It writes no file, changes no environment, starts no app/browser/server, calls no Git command, and accesses no engine or protected path.
- Success TAP contains five named passing tests and summary counters. It exposes only test names/public paths and timing, not document bytes or hashes.
- Failure output contains `UNREADABLE` or `CHANGED` plus a public path and assertion stack; the implementation does not print source bytes or computed hashes.

## Evidence and bounded measurement
- Accepted E17 `dd182f8` already established the literal closure as exactly this target plus these four documents; this inventory does not reopen reader behavior.
- GitHub Actions run `35684542499` gives accepted step-only success for workflow command `node --test <target>`; it is not an exact declared-argv local run or a Linux-local claim.
- The exact declared command should produce five tests. Candidate needle `# pass 5` is structurally stronger than `# fail 0`, but must be copied only after observing exact composed-head TAP on the pinned Node.
- Retain stdout/stderr, PID, exit code, head, target/spec hashes, and counters; require tests 5, pass 5, fail 0, skipped 0.
- Existing permission 766 is not exercised by this child because it never approaches the protected five. Only a bounded local runtime slot is needed.
- If only S9 metadata changes before measurement, rebind the spec SHA/execution pin; keep target and four reference pins fixed unless their public bytes move.
