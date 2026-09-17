"use strict";

/* P6-COACH-WIRE-2 (DECISIONS:456). ENGINE_REVISION is a label bound to the
 * sealed receipt on disk by THIS test, not a runtime measurement: recompute
 * the sha256 from the receipt bytes and compare, so a reseal that moves the
 * receipt (S5 and on) goes red here until the constant is updated.
 *
 * ENGINE-REVISION-SEAL-WINDOW: the standing package's receipt does not exist
 * yet DURING its own sealing run, and the constant then names the PARENT seal.
 * Both states are one rule (REVISION_RULE below), and both are executed. */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { ENGINE_REVISION } = require("../engine-revision.cjs");

const REBUILD_ROOT = path.join(__dirname, "..", "..");
const REPO_ROOT = path.join(REBUILD_ROOT, "..");

/* The seal this label is bound to is the one the STANDING CI step names
   (rebuild.yml --package <id>), never a hardcoded file: S5 turned the S4
   literal red exactly as designed, and the fix is to read the id.
 *
 * AND THE SEALING WINDOW. The sealing FULL run writes receipts/<standing>.json
 * at its END, so between the flip of the CI step to the new package and the
 * seal itself there is no receipt to read and the old shape went ENOENT. The
 * invariant in that window is not "no check": the constant still names the
 * PARENT seal, because it only ever moves AFTER the new receipt exists
 * (DECISIONS:465-467, :495). Both sides are one function, and both are
 * executed below against fixtures. Same rule, same words, as
 * rebuild/m4/import/test/production-mapping.test.cjs P3-M3. */
const REVISION_RULE =
  "ENGINE_REVISION names the standing package's seal: if receipts/<standing>.json "
  + "EXISTS the constant is <that receipt's packageId>@<first 16 hex of sha256 over its "
  + "bytes>; if it does NOT (the sealing window) the standing spec "
  + "packages/<standing>.json must exist with status BRIEF-ACCEPTED and name a parent "
  + "whose receipt exists, and the constant is <the PARENT receipt's packageId>@<sha16 "
  + "of the PARENT receipt>, because the constant moves only after the new receipt "
  + "exists (DECISIONS:465-467, :495)";

const sha16 = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 16);
const receiptId = (file) => {
  const receipt = JSON.parse(fs.readFileSync(file, "utf8"));
  return receipt.packageId || receipt.lanePackage;
};

/* THE ONE READING OF THE RULE, over a repo root: the real tree in the two cells
   below, a temp fixture in the cells that execute its red sides. Every refusal
   names the state it refused in. */
function standingSeal(repoRoot) {
  const tooling = (...p) => path.join(repoRoot, "rebuild", "lanes", "b", "tooling", ...p);
  const yml = fs.readFileSync(path.join(repoRoot, ".github", "workflows", "rebuild.yml"), "utf8");
  const m = /b-package\.cjs\s+--ci\s+--package\s+(\S+)/.exec(yml);
  if (!m) throw new Error("no standing `b-package.cjs --ci --package <id>` step in rebuild.yml");
  const standing = m[1];
  const receipt = tooling("receipts", standing + ".json");
  if (fs.existsSync(receipt))
    return { standing, state: "sealed", named: standing, receipt,
      expected: receiptId(receipt) + "@" + sha16(receipt) };
  const spec = tooling("packages", standing + ".json");
  if (!fs.existsSync(spec))
    throw new Error("the standing package " + standing + " has neither a sealed receipt nor "
      + "a spec at rebuild/lanes/b/tooling/packages/" + standing + ".json. " + REVISION_RULE);
  const declared = JSON.parse(fs.readFileSync(spec, "utf8"));
  if (declared.status !== "BRIEF-ACCEPTED")
    throw new Error("packages/" + standing + ".json is " + declared.status + ", not "
      + "BRIEF-ACCEPTED, so no sealing window is open. " + REVISION_RULE);
  const parent = declared.parent && declared.parent.chosen;
  if (!parent)
    throw new Error("packages/" + standing + ".json names no parent.chosen. " + REVISION_RULE);
  const parentReceipt = tooling("receipts", parent + ".json");
  if (!fs.existsSync(parentReceipt))
    throw new Error("the parent " + parent + " of the standing package " + standing
      + " has no sealed receipt at receipts/" + parent + ".json. " + REVISION_RULE);
  return { standing, state: "window", named: parent, receipt: parentReceipt,
    expected: receiptId(parentReceipt) + "@" + sha16(parentReceipt) };
}

function checkRevision(revision, repoRoot) {
  assert.match(revision, /^[^@]+@[0-9a-f]{16}$/,
    "ENGINE_REVISION is not <package-id>@<16 hex>: " + revision);
  const seal = standingSeal(repoRoot);
  assert.equal(revision, seal.expected, "the standing package is " + seal.standing
    + " and its receipt is " + seal.state + ": the constant must name " + seal.named
    + " as " + seal.expected + ", not " + revision + ". " + REVISION_RULE);
  return seal;
}

/* A whole fake repo root - one rebuild.yml, one spec, some receipts - so the
   cells below execute BOTH sides of the rule without depending on the real
   tree's current state. */
function fakeRoot({ standing, spec, receipts }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "erw-coach-"));
  const tooling = path.join(dir, "rebuild", "lanes", "b", "tooling");
  fs.mkdirSync(path.join(dir, ".github", "workflows"), { recursive: true });
  fs.mkdirSync(path.join(tooling, "receipts"), { recursive: true });
  fs.mkdirSync(path.join(tooling, "packages"), { recursive: true });
  fs.writeFileSync(path.join(dir, ".github", "workflows", "rebuild.yml"),
    "      - run: node rebuild/lanes/b/tooling/b-package.cjs --ci --package " + standing + "\n");
  for (const [id, body] of Object.entries(receipts || {}))
    fs.writeFileSync(path.join(tooling, "receipts", id + ".json"), JSON.stringify(body));
  if (spec)
    fs.writeFileSync(path.join(tooling, "packages", standing + ".json"), JSON.stringify(spec));
  return { dir, at: (...p) => path.join(tooling, ...p) };
}
const ACCEPTED = (parent) => ({ status: "BRIEF-ACCEPTED", parent: { decided: true, chosen: parent } });

test("ENGINE_REVISION names the standing package's sealed receipt on disk, or - "
  + "inside the sealing window - its parent's", () => {
  const seal = checkRevision(ENGINE_REVISION, REPO_ROOT);
  assert.ok(seal.state === "sealed" || seal.state === "window", seal.state);
});

test("the standing CI b-package step names the seal ENGINE_REVISION is pinned to", () => {
  const seal = standingSeal(REPO_ROOT);
  const [packageId] = ENGINE_REVISION.split("@");
  assert.equal(packageId, receiptId(seal.receipt),
    "rebuild.yml's --package " + seal.standing + " resolves to a " + seal.state + " seal ("
    + seal.named + ") whose packageId is not the one ENGINE_REVISION names. " + REVISION_RULE);
});

/* THE SEALED SIDE'S RED, EXECUTED: the trip-wire, undiminished. A receipt for
   the standing package on disk still pins the constant by sha AND by id. */
test("SEALED: a receipt for the standing package pins the constant, and a wrong "
  + "sha or a wrong package id is red", () => {
  const root = fakeRoot({ standing: "Z9", receipts: { Z9: { packageId: "M2-Z9-CHILD" } } });
  const sha = sha16(root.at("receipts", "Z9.json"));
  assert.equal(checkRevision("M2-Z9-CHILD@" + sha, root.dir).state, "sealed");
  assert.throws(() => checkRevision("M2-Z9-CHILD@0123456789abcdef", root.dir),
    /must name Z9/, "a wrong sha under a present receipt was accepted");
  assert.throws(() => checkRevision("M2-Y8-CHILD@" + sha, root.dir),
    /must name Z9/, "a wrong package id under a present receipt was accepted");
});

/* THE WINDOW ITSELF, EXECUTED. */
test("SEALING WINDOW: with no receipt for the standing package the constant must "
  + "name the PARENT seal, and nothing else", () => {
  const root = fakeRoot({ standing: "Z9", spec: ACCEPTED("Y8"),
    receipts: { Y8: { packageId: "M2-Y8-CHILD" }, X7: { packageId: "M2-X7-CHILD" } } });
  const seal = checkRevision("M2-Y8-CHILD@" + sha16(root.at("receipts", "Y8.json")), root.dir);
  assert.equal(seal.state, "window");
  assert.equal(seal.named, "Y8");
  assert.throws(() => checkRevision("M2-X7-CHILD@" + sha16(root.at("receipts", "X7.json")),
    root.dir), /must name Y8/, "a stale grandparent passed the sealing window");
  assert.throws(() => checkRevision("M2-NOT-A-PACKAGE@abcdef0123456789", root.dir),
    /must name Y8/, "a random string passed the sealing window");
});

/* AND EVERY OTHER STATE FAILS BY NAME rather than by ENOENT. */
test("no spec, a spec that is not BRIEF-ACCEPTED, a spec with no parent and a "
  + "parent with no receipt each fail by name", () => {
  const held = { Y8: { packageId: "M2-Y8-CHILD" } };
  const guess = "M2-Y8-CHILD@0123456789abcdef";
  for (const [spec, receipts, why] of [
    [null, held, /neither a sealed receipt nor a spec/],
    [{ status: "DRAFT", parent: { chosen: "Y8" } }, held, /is DRAFT, not BRIEF-ACCEPTED/],
    [{ status: "BRIEF-ACCEPTED", parent: {} }, held, /names no parent\.chosen/],
    [ACCEPTED("Y8"), {}, /parent Y8 of the standing package Z9 has no sealed receipt/]])
    assert.throws(() => checkRevision(guess,
      fakeRoot({ standing: "Z9", spec, receipts }).dir), why, String(why));
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
