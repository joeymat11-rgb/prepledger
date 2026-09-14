
'use strict';
const native = require(process.env.SLOT_LOADER).load();
const d = JSON.parse(process.env.SLOT_DESCRIPTOR);
const h = native.attach(d.name, d.nonce, d.ownerPid, d.version, d.bytes);
process.on('message', message => {
  if (message !== 'finish') throw new Error('Unexpected control message');
  for (const event of [1, 2, 3, 4]) native.advance(h, event);
  native.close(h);
  process.send({ phase: 'closed', pid: process.pid }, () => process.disconnect());
});
process.send({ phase: 'attached', pid: process.pid, parentPid: process.ppid });
