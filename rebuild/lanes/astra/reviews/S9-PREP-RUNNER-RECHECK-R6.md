# S9 prep runner re-check R6
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412, :569 and :587; the last narrow re-check, fix round 6; highest effort
Head: 397ac46693c8088ce168740d35d32e2dd37d4d47
Script SHA256 (certutil): 71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0

VERDICT: REJECT

G1 CLOSED. Original reviewed-map mismatch: PATH-IS-NOT-CANONICAL product key "__proto__"; ordinary-key control still GIT-SOURCE-PIN.
G2 CLOSED. Original brief and carrier inputs: PATH-IS-NOT-CANONICAL brief.file "__proto__" / carrierSuccessor.file "__proto__". Child input now refuses PATH-IS-NOT-CANONICAL too.
G3 STILL OPEN. Original a.css/A.CSS witness now PATH-CASE-COLLISION; H25 still misses the fixed runner path. B1 below reaches AUTHORIZED release/re-pin.
G4 CLOSED. Original four-key extra/no-sealedBy JSON with nameless grandparent: ANCESTOR-RELEASED-BLOCK-IS-NOT-A-CLOSED-RELEASE-RECORD. Honest record with nameless grandparent: ANCESTOR-RELEASE-GRANDPARENT-HAS-NO-PACKAGE-ID.
G5 CLOSED. Original receipt witness: PATH-IS-NOT-CANONICAL product key "__proto__" before a receipt can be written.
G6 CLOSED. Original witnessPins and separate witnessFlips inputs: PATH-IS-NOT-CANONICAL carrierSuccessor.witnessPins key "./brief.md" / witnessFlips file "./brief.md".

BLOCKING B1 (H25): fixed execution-pin coordinates are absent from canonicalSpecPaths().
Exact route: tooling.runner="rebuild/lanes/b/tooling/b-package.cjs"; product["rebuild/lanes/b/tooling/b-PACKAGE.cjs"]={"pre":"71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0","post":null,"role":"released"}; the parent product seals that alias at the same hash; both Git keys hold the real runner bytes, and Windows resolves them to one file.
Exact PM token: RELEASE-FROM-SEAL M2-S8-PROBE rebuild/lanes/b/tooling/b-PACKAGE.cjs, alone in its own U+00B7 clause, terminal RULED.
Measured: spec() ADMITTED; product() IMPLEMENTED; envelope() authorized=true; released=["rebuild/lanes/b/tooling/b-PACKAGE.cjs"]; executionPins includes "rebuild/lanes/b/tooling/b-package.cjs". Appending LF + "// edited after release" + LF to that file yields PARENT-PIN-BROKEN rebuild/lanes/b/tooling/b-package.cjs, actual 3606a68d4901d4610353fb0a11a4b2669bc048feb3b72eb805c57ec9acdcdbb9, expected 71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0.
Smallest fix: seed H25's identity walk with RUNNER and TOOLING + '/packages/' + ID + '.json'; add the fixed-coordinate case-alias witness. This is a well-formed, executed spec, not a non-JSON hypothetical. No full-package PASS claimed.

NAMED DEBTS (carry these lines into S9)
D1 MAP-CONSTRUCTION: the three assignment-built maps still lose a directly supplied __proto__ key; production safety depends on retaining canonicalSpecPaths admission before every producer, including future ones.
D2 DISK-IDENTITY: JavaScript lowercase equality is not filesystem identity; this Windows disk keeps K/U+212A, U+1E9E/U+00DF and U+0130/i+U+0307 distinct while H25 refuses them; none occurs in the 22 standing files.
D3 JSON-BOUNDARY: H26 accepts extra symbol keys, accessor values and a Proxy hiding an extra key in direct calls; retain JSON-only artifact ingress, which cannot deliver any of those object identities.

Choke-point enumeration (all producers, not only the edited lines)
- proposed().executionPins: fixed RUNNER and TOOLING+'/packages/'+ID+'.json' are NOT walked; neither can contain __proto__, because the path prefixes are fixed and ID is from the closed CLI list. Brief.file, carrierSuccessor.file and every childArgv target ARE walked. childArgv accepts only non-flag string targets, exactly the argv strings the walk visits. No other producer or imported parent execution-pin map feeds this map. Fixed coordinates are safe for H23, but their omission causes B1 under H25.
- writeSealedRunReceipt().product: every key comes from Object.keys(s.product), filtered by role and existence; ALL are walked. The production call follows spec() and the final authorized envelope; direct unadmitted test calls are not another production entry.
- envelope().reviewed: keys come from m.executionPins (the five routes above) and m.product (the walked s.product keys excluding released). Before construction, same(m,proposed(s,bound)) compares complete JSON serializations; an independently supplied artifact key cannot bypass recomputation. No parent/grandparent path key is imported into these three maps by another route. The main sequence calls spec() first and does not mutate its path fields.

Removed clauses: copied the old predicate from 4ccfdfcd; enumerated the empty string and all strings of length 1..4 over /, backslash, dot, a, underscore: 781 strings; disagreements=0; old-refused/new-admitted=0. Empty segments imply all three removed tests for arbitrary string lengths, too. H23 only additionally excludes __proto__ segments outside this short alphabet test.

P-A13 disk measurements (distinct markers, inode check, then writing the second spelling and rereading the first; U+ notation is ASCII reporting of the actual Unicode filenames)
| Pair | Disk one file? | Lowercase equal / guard refuses? |
|---|---|---|
| I / U+0131 (dotless i) | no | no / no |
| SS / U+00DF (sharp s) | no | no / no |
| U+1E9E / U+00DF | no | yes / yes |
| K / U+212A (Kelvin) | no | yes / yes |
| U+03A3 / U+03C2 (final sigma) | no | no / no |
| U+FF21 / U+FF41 (full-width case) | yes | yes / yes |
| A / U+FF21 (full-width versus ASCII) | no | no / no |
| U+0130 / i+U+0307 | no | yes / yes |
No tested disk alias escaped lowercase equality. Scan: 22 files, 2861 canonicalSpecPaths visits plus 371 artifact execution keys = 3232, including 38 newly walked values; zero noncanonical, reserved-segment, non-ASCII or distinct lowercase-collision paths. Adding the fixed coordinates to the scan also found zero standing collisions. Thus zero standing packages carry the case-distinct pair H25 would wrongly refuse on Linux; no Linux filesystem run is claimed.

H26 direct-call and JSON controls
| Input | Executed result | Can ordinary JSON preserve that form? |
|---|---|---|
| Honest four keys plus fifth Symbol key | one pin skipped | no; symbol disappears |
| Own accessor role returning released | one pin skipped | no; parse yields an own data property |
| Proxy hiding configurable extra key from ownKeys | one pin skipped | no; traps disappear |
| Same four keys in reverse insertion order | one pin skipped | yes; valid record, correctly admitted |
| sealedBy=new String('M2-S8-FIXTURE') | CLOSED-RELEASE-RECORD refusal | no wrapper identity; JSON round-trip becomes primitive string and correctly skips |
Normal honest record, product+execution at the same hash, and reversed JSON key order each skip one pin. A release two generations back reasserts zero pins without a spurious refusal. No honest-chain regression reproduced. Duplicate literal and escaped-decoded keys still refuse JSON-DUPLICATE-KEY. Matching product hash and named grandparent checks remain in force; none of these probes supplies a dishonest release via parsed JSON.

No-release and package-byte comparison
All four CLI runs (S8/H3 at 4ccfdfcd and HEAD) exited 1 with "B PACKAGE <ID> FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld". Correction to the author: THREE stdout lines and ONE stderr line each, not four stdout lines. Both streams match byte-for-byte after replacing only the two 64-hex hashes on SPEC OBSERVED. S8 remains 224 product files/25 children; H3 64/10; both 24 roots and five superseded carriers.
S8 spec: df3f785dad9c13eda9e27fc31ba84d1290690c621ed9fa7dc86c1bfe838c2a39 -> 32f1aad82eea4e89f71ef84ba1e162ae8e2d3e33c087ed6c41c74faca9be5475.
H3 spec: 119c215348aea0d49404be8fcf09cc2fb6216e3a4370878027e6ea2da61b69a6 -> 36a4245f65dcc08dc6602230fb8d61352f0d733449bd1493ce040085fec6577f.
Runner: 316f86c541f109a5876f5ea8d0557164151585f4f5940ce8878c3bec02bee43e -> header hash. Old CLI used unchanged old bytes in a scratch public-file projection with Git object alternates and HEAD=4ccfdfcd; current CLI ran in the assigned worktree.
H3/S3/S4/S5/S6/S7/S8.json: replacing exactly one old runnerSha256 value produces each entire HEAD file byte-for-byte; no other field or byte differs.

Mutation table pending completion.
