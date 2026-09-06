"use strict";

// Test-only integration seam for the frozen synchronous T2 client. Its existing
// signature equality call becomes public verification; operation construction,
// HMAC commitments, lease checks, Store, Outbox and sync code remain unchanged.
// No private authority key or replacement HMAC ever enters the client.
const fs = require("node:fs"), path = require("node:path"), Module = require("node:module");
const { verifyRecord } = require("../w5/crypto.cjs");
const clientRoot = path.resolve(__dirname, "../../client");

function loadPublicT2() {
  const cache = new Map();
  function load(filename) {
    filename = path.resolve(filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const mod = new Module(filename, module);
    mod.filename = filename; mod.paths = Module._nodeModulePaths(path.dirname(filename)); cache.set(filename, mod);
    mod.require = id => id.startsWith(".")
      ? load(require.resolve(path.resolve(path.dirname(filename), id))) : require(id);
    mod._compile(fs.readFileSync(filename, "utf8"), filename);
    if (filename === path.join(clientRoot, "ops.cjs")) mod.exports = { ...mod.exports,
      signatureOver(key, domain, record, field) {
        if (!key || key.privateKey || (key.publicKey && key.publicKey.d)) return Symbol("invalid public key");
        return verifyRecord(record, key, domain, field) ? record[field] : Symbol("invalid signature");
      },
    };
    return mod.exports;
  }
  return load(path.join(clientRoot, "index.cjs"));
}

module.exports = { loadPublicT2 };
