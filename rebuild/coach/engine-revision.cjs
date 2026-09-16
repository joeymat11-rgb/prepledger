"use strict";

/* P6-COACH-WIRE-2 (DECISIONS:456). ENGINE_REVISION is the sealed package
 * identity the running engine bytes were accepted under - a label bound to
 * accepted bytes by a test (engine-revision.test.cjs), not a runtime
 * measurement and not a clock. No fs or path import here: this module ships
 * inside the browser bundle alongside rebuild/client/index.cjs, whose
 * boundary refuses any Node-only import.
 *
 * The literal is <PACKAGE-ID>@<first 16 hex of sha256 over the bytes of
 * rebuild/lanes/b/tooling/receipts/<PACKAGE-ID short name>.json>, computed
 * once from a small node one-liner (sha256 of the receipt file's raw bytes,
 * lower-hex, first 16 characters) and pasted here as a literal. Currently
 * the standing CI step is `--package S4` (.github/workflows/rebuild.yml),
 * whose receipt is rebuild/lanes/b/tooling/receipts/S4.json and whose long
 * package id (receipt field "packageId") is M2-S4-REAL-DAY; the computed
 * prefix is 171ebcd4d4b3b2b4.
 *
 * engine-revision.test.cjs recomputes this from the receipt on disk and from
 * rebuild.yml's own --package flag, so a reseal (S5 and on) that moves the
 * receipt or the standing package turns that test red until this literal is
 * updated by the reseal's own ticket - a stale revision can never ship
 * silently.
 */
const ENGINE_REVISION = "M2-S4-REAL-DAY@171ebcd4d4b3b2b4";

module.exports = { ENGINE_REVISION };
