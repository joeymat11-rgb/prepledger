"use strict";
const fs = require('node:fs'), path = require('node:path');
const esbuild = require('esbuild');
async function buildCore({ authorityRoot = path.resolve(__dirname, '../../authority'), cryptoPath = path.join(__dirname, 'crypto.cjs'), outfile = path.join(__dirname, '.generated/core.cjs') } = {}) {
  fs.mkdirSync(path.dirname(outfile), { recursive: true });
  await esbuild.build({ entryPoints: [path.join(authorityRoot, 'index.cjs')], bundle: true,
    platform: 'node', format: 'cjs', outfile, logLevel: 'silent',
    plugins: [{ name: 'declared-public-signature-boundary', setup(build) {
      build.onResolve({ filter: /^\.\/crypto\.cjs$/ }, args =>
        path.resolve(args.resolveDir) === path.resolve(authorityRoot) ? { path: cryptoPath } : undefined);
    } }],
  });
  return outfile;
}
module.exports = { buildCore };
if (require.main === module) buildCore().then(() => console.log('W5 CORE BUILD PASS')).catch(error => { console.error(error.message); process.exitCode = 1; });
