"use strict";
const Module = require("node:module");
const path = require("node:path");
function fromSource(file, source, imports = {}) {
  const filename = path.resolve(__dirname, "..", file);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = mod.require.bind(mod);
  mod.require = name => Object.hasOwn(imports, name) ? imports[name] : originalRequire(name);
  mod._compile(source, filename);
  return mod.exports;
}
module.exports = { fromSource };
