# Lifecycle review: explicit public fixture helpers

2026-09-13 · PM290 under193/266/276/284/286. D2's exact sparse R3 review stopped at module loading: two file-level failures, zero real cases. The already licensed rebuild/m3/w6/test/support.mjs uses createRequire for rebuild/conform/lib/ops.cjs; that helper and its canonical encoder were omitted from the previous parsed inventory. The wider earlier checkout masked the omission. Preserve this actual refusal and qualify the prior109-module/134-input lists as incomplete runtime inventories, without discarding or relabeling their actual functional results.

PM read the complete support module and both helpers at exact C7e64848dcd1395f26ed3bbbc9e19b9c3e7dce7db. These are public synthetic fixture constructors: ops requires only node:crypto and canonical; canonical has no imports. Neither reads files, loads private fixtures or accesses a network. The other literal createRequire targets client/index.cjs and m3/w6/t2-stage.cjs are already in the prior manifest.

| Exact path | Git blob | Bytes | SHA256 |
| --- | --- | --- | --- |
| rebuild/conform/lib/ops.cjs | 6cf0d2f2e51abb37b022010a423647a8f5983ef7 | 6337 | cbf7e73cd899492981a03bc4b4153f12a77cc664c4c90c29774ef30bf981d1c1 |
| rebuild/conform/lib/canonical.cjs | de71c53a0df29a31b43d72cb28ebc652ad79eb86 | 2656 | ca9d5daa7df046be3849ca21e9a21cdf43cbff4fd204246b673ec5621e84f4fa |

PM independently verified these same blobs at C18ff0dcf015193a9b76b83fbbc80fbe888f15d24 and C1316639e71cc8b23b24570bb6aa0e7508da90032. Both are absent from the old parsed and tracked-input manifests. This is the exact missing helper closure; the shipped product is unchanged.

D2 may read/materialize these two exact Git sources in its owned R3 review tree, include them in the explicit source inventory and run the existing literal pair and exact four/37 replays after current public closure/identity verification. Inspect literal createRequire calls within the already licensed source set plus these two helpers; account for their resolved public modules alongside ordinary imports/requires. Derive actual final counts and preserve original inventory files unaltered. Another missing dependency requires a named grant; no whole-directory inclusion or generic loader bypass.

Read-only exact helper identity comparison at the named C parent commits is allowed for evidence applicability. It does not retroactively make the old inventories complete or make a current run an old-head run. No habitual rerun of unchanged original failures. No product/test edit, new graph beyond these two sources, conform suite/private fixture, seed/history/soak/native/H3/FULL/package/currentCI/separate browser/build or owner-data access. Existing286 independent source-first/report-last, setup disclosure and final composition/release boundaries remain. D2 stays MAX and records the corrected closure and actual execution honestly.
