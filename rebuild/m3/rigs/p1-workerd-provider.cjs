'use strict';
// Local rig binding only; never the production key-custody implementation.
async function storageFromTestBinding(binding){
  if(typeof binding!=='string')throw new TypeError('Synthetic P1 binding required');
  const bytes=Buffer.from(binding,'base64url');
  if(bytes.length!==32||bytes.toString('base64url')!==binding)throw new TypeError('Synthetic P1 key shape');
  const key=await globalThis.crypto.subtle.importKey('raw',bytes,'AES-KW',false,['wrapKey','unwrapKey']);
  return {profile:'earned/authority-row/v1',namespace:'synthetic-p1-rigs',
    async getWrappingKey({namespace,epoch,purpose}){
      if(namespace!=='synthetic-p1-rigs'||epoch!=='run-only'||!['read','write'].includes(purpose))throw new Error('Synthetic P1 binding mismatch');
      return key;
    }};
}
module.exports={storageFromTestBinding};
