"use strict";
/* Node-only integration: the unchanged T2 committer runs against an isolated real memory backend.
   Browser crypto/permission amendments are deliberately not hidden in this adapter. */
const Client = require("../../client/index.cjs");
const clone = value => structuredClone(value);
const COMMANDS = new Set(["weighIn", "logSet", "logSession", "finishSession"]);

function snapshotBackend(backend, seededNames = []) {
  const collections = Object.create(null);
  for (const name of new Set([...seededNames, ...backend.collections()])) {
    const collection = Object.create(null);
    for (const key of backend.keys(name)) collection[key] = backend.get(name, key);
    collections[name] = collection;
  }
  return collections;
}
function createT2Stage(configProvider) {
  if (typeof configProvider !== "function") throw new Error("T2 configuration provider required");
  return (generation, command, args) => {
    const backend = Client.memoryBackend(clone(generation.collections));
    const checkpoint = backend.get("meta", "checkpoint");
    let intact = false;
    try {
      intact = checkpoint && checkpoint.counts && ["ops", "outbox"].every(name =>
        Number.isSafeInteger(checkpoint.counts[name]) && checkpoint.counts[name] >= 0) && new Client.Store(backend).integrity().intact;
    } catch {}
    if (!intact) return { generation: clone(generation), result: { acknowledged: false, state: 18,
      code: "T2_INTEGRITY_UNPROVEN", copy: Client.copy.RESTORE_REQUIRED }, view: null };
    const config = configProvider(clone(generation.metadata));
    // No transport is installed: this slice must not observe inbound authority facts.
    const client = Client.createClient({ ...config, backend, transport: undefined });
    client.boot();
    if (command !== null && !COMMANDS.has(command)) throw new Error("Unsupported staged command");
    const result = command === null ? { acknowledged: false, readOnly: true } : client[command](args);
    const next = { collections: snapshotBackend(backend, Object.keys(generation.collections)), metadata: clone(generation.metadata) };
    return { generation: next, result: clone(result), view: clone(client.face()) };
  };
}
module.exports = { createT2Stage, snapshotBackend };
