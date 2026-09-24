# S9 engine-files differential execution inventory

- Static inspection only at integration `3072385dac2f97605eca45bbf208b5852bd8522d`; the child was not run.
- Declared child: `s9-engine-files-differential`; argv is exactly `rebuild/m4/workout/test/s9-engine-files-differential.cjs`; needle remains null.
- Direct command shape: pinned Node executable + that single relative path, with cwd at repository root; no flags, clock, TZ, network, browser, or dependency install.
- Target SHA-256: `7ad3937d41dcd2fc7ca5135448df9dc62dc61d1253433620f9abed779f8a92ba`; S9 declares it `role:new` with this post.
- Current S9 spec SHA-256: `5c6d5f952da5a8d2b0a15a34b2202df10125163bbe0add987739c9e441ab1bb1`.
- Accepted S8 parent artifact SHA-256: `3cf58e0edd76a56353b35008ef154d484098b5017fedeb648eb64a0ae6568d48`.
- Parent review SHA-256: `f7b9b51e38755f3364b398189b50be927e058b8606945f1a9fb51e1cd66cc632`.
- Runner SHA-256: `5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22`; it is not imported by this child.
- Imports are built-ins only: `node:assert/strict`, `node:fs`, `node:path`, `node:child_process`, `node:crypto`; there is no local helper import or module evaluation.

## Read and process effects
- Reads and parses public S9 JSON and the accepted S8 artifact, then verifies the artifact's exact SHA before using it.
- Spawns only `git ls-files -z rebuild/engine` and, for parent-unpinned paths, `git show <parent.sourceBase>:<path>`; max captured buffer is 90 MB.
- Reads every tracked `rebuild/engine/*` disk file as bytes solely to SHA-256 it; no engine file is required/imported/evaluated or written.
- Static Git/spec inventory is 45 tracked paths: 18 S9-declared carried paths and 27 outside paths.
- The authorized protected five are all in the 18 declared set, all `role:carried`, `pre===post`, and all have S8 parent post pins.
- Therefore their expected hashes come from artifact metadata; the child does not `git show` their source blobs. It reads their disk bytes only into SHA-256.
- No network, temporary file, environment mutation, repository write, or subprocess other than those read-only Git calls is present.

## Output and containment
- Success prints 27 `SAME` rows and 18 `CARRIED` rows, each exposing path, a 12-hex fingerprint, and parent-post/source-base classification.
- Its final source-determined line is `ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s) outside this package's declared product, all byte-identical to the parent; 18 named and NOT ONE moves, so all 45 tracked rebuild/engine file(s) stand byte-identical to the parent's own post;`.
- That line is a candidate needle only; it has not been observed in this preparation.
- Failure is a thrown assertion/nonzero exit. Messages expose path and at most 12-hex disk/parent fingerprints, never source bytes.
- Direct execution fits existing permission 766's five-file read/hash/static boundary: fingerprints and verdicts only, with no protected module execution. A separate runtime slot is still required.

## Final-head rebind
- The two UI literal post changes alter only S9 JSON bytes; they do not affect the 45-path split, target, parent artifact, or expected engine hashes.
- Rebind the S9 spec SHA/execution pin once after all final spec edits. Keep target, parent artifact/review, sourceBase, and runner pins unchanged unless their public bytes actually move.
- Before execution, independently compare those five fixed pins and confirm Git/disk worktree head; afterward retain stdout/stderr and exact exit code for the child evidence.
