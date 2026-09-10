"use strict";
const path = require("node:path");
const Client = require(path.join(process.env.EARNED_CLIENT_DIR, "index.cjs"));
const O = require("../../../conform/lib/ops.cjs");
const { create } = require("../../../conform/adapters/client.cjs");
const { laws } = require("../../../conform/laws/sheet-B-client.cjs");
const { runActionVectors } = require("./contract-probe.cjs");
const calls = [];
const bundle = { client(opts) {
  const client = create(opts);
  return Object.fromEntries(Object.entries(client).map(([key, value]) => [key, typeof value !== "function" ? value : (...args) => {
    const result = value(...args); calls.push({ key, args, result }); return result;
  }]));
} };
const verdicts = laws.map(law => ({ id: law.id, ...law.run(bundle) }));
const required = [undefined, {}, { deviceId: "a" }, { deviceId: "a", identityKey: "synthetic" }].map(config => {
  try { Client.createClient(config); return "unexpected success"; } catch (error) { return error.message; }
});
process.stdout.write(JSON.stringify({ verdicts, calls, required, actions: runActionVectors(Client, O) }));
