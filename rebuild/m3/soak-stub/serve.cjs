'use strict';
// Local preflight server only. Production hosting belongs to integrator W2.
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const assets = new Set(['index.html', 'app.mjs', 'store.mjs', 'styles.css', 'manifest.webmanifest',
  'service-worker.js', 'icon-180.png', 'icon-192.png', 'icon-512.png']);
const types = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript',
  '.css': 'text/css', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const name = new URL(req.url, 'http://localhost').pathname.slice(1) || 'index.html';
  if (!['GET', 'HEAD'].includes(req.method) || !assets.has(name)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(name)], 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' });
  if (req.method === 'HEAD') res.end(); else fs.createReadStream(path.join(__dirname, name)).pipe(res);
});
const port = Number(process.env.PORT || 8787);
server.listen(port, '127.0.0.1', () => console.log('Soak preflight: http://127.0.0.1:' + server.address().port));
