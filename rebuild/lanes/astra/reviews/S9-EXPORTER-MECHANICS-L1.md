# S9 prospective exporter mechanics review
Verdict: NEEDS CORRECTION; static mechanics only, no execution/containment approval.
Exporter SHA256: 580d272a4408177c05d90b1c9322c2dce541445b8846a96bb1b660e11beb0b82.
Procedure SHA256: fe93440e5af54e77ca36929828b749de3f0b436ec547e82fc3a13d477b5d1d9f.
Compared actual public b-package.cjs proposed, envelope, parent and main marker at5c62cb4.
Actual spec()/parent()/proposed() calls preserve runner object construction; no hand-built profile.
PENDING version1/receipt:null matches envelope; JSON formatting is deterministic with terminal LF.
Unique main marker, exact runner disk/Git hash and spec disk/Git identity are checked.
Direct helper Git reads disable replacement objects; caught errors expose no message/stack.
No campaign, receipt writer or explicit full/private run is invoked by the appended calls.

Corrections
1. The destination check is lexical despite realpath(root). An outside parent junction can
   resolve inside the checkout or another protected location. Resolve the existing output parent,
   require it beneath an explicitly reviewed scratch root, then create its fresh child exclusively.
2. After compilation only HEAD, runner and spec are rechecked. proposed() also hashes child,
   brief and carrier files; parent/release depend on chain refs. A mid-export change can survive.
   Recheck clean tracked state and bind/recheck relevant refs; final-input review must account for
   every contributing declared/execution input, not describe HEAD alone as a complete snapshot.
3. The two exclusive writes are not atomic together. A failure may retain one scratch artifact.
   Document incomplete output and prohibit installation unless both files and terminal success verify.

Limits
console.log/error suppression is not general output containment for imported modules or subprocesses.
Final top-level/import/call-effect review remains required before asserting verdict-only runtime output.
S9.json is absent; this review does not clear prospective spec()/parent()/proposed() effects.
No module evaluation, helper execution, protected read/hash, or worktree write occurred.
Re-review corrected frozen helper, then separately review final inputs and obtain runtime authority.
