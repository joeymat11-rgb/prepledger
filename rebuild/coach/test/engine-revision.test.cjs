"use strict";

/* P6-COACH-WIRE-2 (DECISIONS:456). ENGINE_REVISION is a label bound to the
 * sealed receipt on disk by THIS test, not a runtime measurement: recompute
 * the sha256 from the receipt bytes and compare, so a reseal that moves the
 * receipt (S5 and on) goes red here until the constant is updated. */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { ENGINE_REVISION } = require("../engine-revision.cjs");

const REBUILD_ROOT = path.join(__dirname, "..", "..");
const REPO_ROOT = path.join(REBUILD_ROOT, "..");

/* The receipt this label is bound to is the one the STANDING CI step names
   (rebuild.yml --package <id>), never a hardcoded file: S5 turned the S4
   literal red exactly as designed, and the fix is to read the id. */
function standingPackageShortId() {
  const yml = fs.readFileSync(path.join(REPO_ROOT, ".github", "workflows", "rebuild.yml"), "utf8");
  const m = /b-package\.cjs\s+--ci\s+--package\s+(\S+)/.exec(yml);
  assert.ok(m, "no standing `b-package.cjs --ci --package <id>` step found in rebuild.yml");
  return m[1];
}

test("ENGINE_REVISION recomputes from the standing package's sealed receipt on disk", () => {
  const m = /^([^@]+)@([0-9a-f]{16})$/.exec(ENGINE_REVISION);
  assert.ok(m, "ENGINE_REVISION is not <package-id>@<16 hex>: " + ENGINE_REVISION);
  const [, packageId, prefix] = m;
  const shortId = standingPackageShortId();
  const receiptPath = path.join(REBUILD_ROOT, "lanes", "b", "tooling", "receipts", shortId + ".json");
  const bytes = fs.readFileSync(receiptPath);
  const sha = crypto.createHash("sha256").update(bytes).digest("hex");
  assert.equal(prefix, sha.slice(0, 16), "revision prefix does not match sha256(receipts/" + shortId + ".json)");
  const receipt = JSON.parse(bytes.toString("utf8"));
  assert.equal(packageId, receipt.packageId || receipt.lanePackage, "revision package id does not match the receipt");
});

test("the standing CI b-package step names the same package ENGINE_REVISION is pinned to", () => {
  const shortId = standingPackageShortId();
  const receiptPath = path.join(REBUILD_ROOT, "lanes", "b", "tooling", "receipts", shortId + ".json");
  const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
  const [packageId] = ENGINE_REVISION.split("@");
  assert.equal(packageId, receipt.packageId || receipt.lanePackage,
    "rebuild.yml's --package " + shortId + " resolves to a different package than ENGINE_REVISION");
});

test("engine-revision.cjs imports neither fs nor path (it ships to the browser)", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "engine-revision.cjs"), "utf8");
  assert.equal(/require\(\s*["']node:fs["']\s*\)/.test(src), false, "requires node:fs");
  assert.equal(/require\(\s*["']fs["']\s*\)/.test(src), false, "requires fs");
  assert.equal(/require\(\s*["']node:path["']\s*\)/.test(src), false, "requires node:path");
  assert.equal(/require\(\s*["']path["']\s*\)/.test(src), false, "requires path");
  /* an ES import of fs or path specifically, not the bare English word
     "import" (which appears harmlessly in this file's own comments) */
  assert.equal(/import\s[^;\n]*from\s*["'](node:)?(fs|path)["']/.test(src), false, "ES-imports fs or path");
});
