import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { fixture, faultDatabase } from "./support.mjs";

test("required disposable early-ack bite is effective and restored byte-for-byte", async () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const source = fs.readFileSync(path.join(root, "bridge.mjs"));
  const hash = value => createHash("sha256").update(value).digest("hex");
  const scratch = path.join(root, ".tmp"); fs.mkdirSync(scratch, { recursive: true });
  const dir = fs.mkdtempSync(path.join(scratch, "early-ack-"));
  fs.copyFileSync(path.join(root, "repository.mjs"), path.join(dir, "repository.mjs"));
  const target = path.join(dir, "bridge.mjs"); fs.writeFileSync(target, source);
  const old = "const commit = await repository.commit(snapshot, candidate.generation, () => validateCommit({ command, args: clone(args), snapshotRevision: snapshot.revision }));";
  const replacement = "const pending = repository.commit(snapshot, candidate.generation, () => validateCommit({ command, args: clone(args), snapshotRevision: snapshot.revision })); pending.catch(() => {}); const commit = { revision: -1, durability: { actual: 'not-complete' } };";
  assert.equal(source.toString().split(old).length - 1, 1, "one effective mutation target required");
  try {
    fs.writeFileSync(target, source.toString().replace(old, replacement));
    assert.notEqual(hash(fs.readFileSync(target)), hash(source));
    const { createBridge } = await import(pathToFileURL(target).href);
    const faults = faultDatabase(), f = await fixture({ indexedDB: faults.indexedDB }); await f.seed();
    const before = await f.repo.load();
    faults.state.armed = true; faults.state.mode = "delay";
    const bridge = createBridge({ repository: f.repo, stage: f.stage, validateCommit: () => null });
    let early = false;
    const command = bridge.execute("weighIn", { lb: 170.6 }).then(result => { early = result.acknowledged; return result; });
    await faults.state.write.promise;
    assert.equal(early, true, "mutant must have acknowledged with a live, incomplete transaction");
    faults.state.release = true; faults.state.tx.abort();
    assert.equal((await command).acknowledged, true);
    assert.deepEqual(await f.repo.load(), before, "aborted storage must contain no acknowledged mutant operation");
    console.log("IDB-187 FAIL — early acknowledgement before IndexedDB complete; delayed transaction abort left no saved operation (disposable mutant)");
    f.repo.close();
  } finally {
    fs.writeFileSync(target, source);
    assert.deepEqual(fs.readFileSync(target), source);
    assert.deepEqual(fs.readFileSync(path.join(root, "bridge.mjs")), source);
    console.log("W6 BITE RESTORED — bridge.mjs sha256 " + hash(source));
  }
});
