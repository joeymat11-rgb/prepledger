import { registerHooks } from 'node:module';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const config = JSON.parse(fs.readFileSync(process.env.D2_R4_MUTATION, 'utf8'));
let hits = 0;
registerHooks({
  load(url, context, nextLoad) {
    const loaded = nextLoad(url, context);
    if (!url.startsWith('file:') || fileURLToPath(url).replaceAll('\\', '/').toLowerCase() !== config.path.toLowerCase()) return loaded;
    const source = fs.readFileSync(fileURLToPath(url), 'utf8');
    const hash = createHash('sha256').update(source).digest('hex');
    if (hash !== config.sha256 || source.split(config.from).length !== 2) throw new Error('D2_MUTATION_ANCHOR_MISMATCH');
    hits++;
    process.stderr.write('D2_MUTATION_APPLIED ' + config.id + '\n');
    return { ...loaded, source: source.replace(config.from, config.to), shortCircuit: true };
  }
});
process.on('exit', () => { if (hits !== 1) { process.stderr.write('D2_MUTATION_HITS ' + hits + '\n'); process.exitCode = 92; } });
