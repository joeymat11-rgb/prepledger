import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { buildToday } from '../rebuild/m3/w7-preview/today/build.mjs';
const result = await buildToday();
const assets = result.assets.map(name => {
  const bytes = fs.readFileSync(path.join(result.dist, name));
  return { name, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
});
fs.writeFileSync('.tmp/d2-combined-build.json', JSON.stringify({ ...result, assetHashes: assets }, null, 2) + '\n');
console.log(JSON.stringify({ buildTag: result.buildTag, inputs: result.inputs.length, assets }, null, 2));
