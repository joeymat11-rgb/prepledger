'use strict';
const fs=require('node:fs');
// Streaming JSON grammar and heap metadata validation. Snapshot strings and
// numeric tables are never accumulated. Tokens retained only for small keys/meta.
class SnapshotJSON {
  constructor(){this.stack=[];this.root='value';this.mode=null;this.token='';this.keep=false;this.escape=false;this.unicode=0;this.counts={};this.meta={};this.top=new Set();}
  path(){const p=this.stack.at(-1);return p?p.path.concat(p.kind==='object'?p.key:'*'):[];}
  wantsValue(){const p=this.stack.at(-1);return p?['value','firstValue'].includes(p.state):this.root==='value';}
  valueDone(){const p=this.stack.at(-1);if(p){p.count++;p.state='comma';}else this.root='done';}
  scalar(value){if(!this.wantsValue())throw Error('SNAPSHOT_JSON_GRAMMAR');const p=this.path().join('.');if(['snapshot.node_count','snapshot.edge_count'].includes(p))this.meta[p]=value;
    if(['snapshot.meta.node_fields.*','snapshot.meta.edge_fields.*'].includes(p)){(this.meta[p]??=[]).push(value);if(this.meta[p].length>32)throw Error('SNAPSHOT_META_LIMIT');}
    const a=this.stack.at(-1);if(a&&['nodes','edges'].includes(a.path.join('.'))&&(!Number.isSafeInteger(value)||value<0))throw Error('SNAPSHOT_TABLE_VALUE');
    this.valueDone();}
  endString(){let value=null;if(this.keep)value=JSON.parse('"'+this.token+'"');const p=this.stack.at(-1);if(p?.kind==='object'&&['key','firstKey'].includes(p.state)){p.key=value;p.state='colon';if(p.path.length===0){if(this.top.has(value))throw Error('SNAPSHOT_DUPLICATE_FIELD');this.top.add(value);if(this.top.size>64)throw Error('SNAPSHOT_FIELD_LIMIT');}}else this.scalar(value);this.mode=null;this.token='';}
  feed(text){for(let i=0;i<text.length;i++){const c=text[i];if(this.mode==='string'){
      if(this.unicode){if(!/[0-9a-f]/i.test(c))throw Error('SNAPSHOT_ESCAPE');this.unicode--;}
      else if(this.escape){if(!'"\\/bfnrtu'.includes(c))throw Error('SNAPSHOT_ESCAPE');if(c==='u')this.unicode=4;this.escape=false;}
      else if(c==='"'){this.endString();continue;}else if(c==='\\')this.escape=true;else if(c.charCodeAt(0)<32)throw Error('SNAPSHOT_CONTROL');
      if(this.keep){this.token+=c;if(this.token.length>4096)throw Error('SNAPSHOT_TOKEN_LIMIT');}continue;
    }
    if(this.mode==='atom'){if(/[0-9eE+\.a-z-]/.test(c)){this.token+=c;if(this.token.length>128)throw Error('SNAPSHOT_ATOM_LIMIT');continue;}
      this.endAtom();i--;continue;}
    if(/\s/.test(c)){if(!' \t\r\n'.includes(c))throw Error('SNAPSHOT_WHITESPACE');continue;}
    const p=this.stack.at(-1);
    if(c==='"'){const key=p?.kind==='object'&&['key','firstKey'].includes(p.state);if(!key&&!this.wantsValue())throw Error('SNAPSHOT_JSON_GRAMMAR');this.keep=key||this.path().join('.').startsWith('snapshot.meta.');this.mode='string';continue;}
    if(c==='{'||c==='['){if(!this.wantsValue())throw Error('SNAPSHOT_JSON_GRAMMAR');const path=this.path();this.stack.push({kind:c==='{'?'object':'array',path,state:c==='{'?'firstKey':'firstValue',count:0,key:null});if(this.stack.length>128)throw Error('SNAPSHOT_DEPTH');continue;}
    if(c==='}'||c===']'){if(!p||p.kind!==(c==='}'?'object':'array')||!['comma','firstKey','firstValue'].includes(p.state))throw Error('SNAPSHOT_JSON_GRAMMAR');if(['nodes','edges','strings'].includes(p.path.join('.')))this.counts[p.path.join('.')]=p.count;this.stack.pop();this.valueDone();continue;}
    if(c===':'&&p?.kind==='object'&&p.state==='colon'){p.state='value';continue;}
    if(c===','&&p?.state==='comma'){p.state=p.kind==='object'?'key':'value';continue;}
    if(this.wantsValue()&&/[0-9tfn-]/.test(c)){this.mode='atom';this.token=c;continue;}throw Error('SNAPSHOT_JSON_GRAMMAR');
  }}
  endAtom(){const t=this.token;if(!/^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)$/.test(t))throw Error('SNAPSHOT_JSON_ATOM');this.scalar(JSON.parse(t));this.mode=null;this.token='';}
  finish(){if(this.mode==='atom')this.endAtom();if(this.mode||this.stack.length||this.root!=='done')throw Error('SNAPSHOT_JSON_INCOMPLETE');
    const nf=this.meta['snapshot.meta.node_fields.*'],ef=this.meta['snapshot.meta.edge_fields.*'],n=this.meta['snapshot.node_count'],e=this.meta['snapshot.edge_count'];
    if(!['snapshot','nodes','edges','strings'].every(k=>this.top.has(k))||!Array.isArray(nf)||!Array.isArray(ef)||!nf.includes('self_size')||!nf.includes('edge_count')||!ef.includes('to_node')||!Number.isSafeInteger(n)||n<1||!Number.isSafeInteger(e)||e<0||this.counts.nodes!==n*nf.length||this.counts.edges!==e*ef.length||!(this.counts.strings>0))throw Error('SNAPSHOT_METADATA_INVALID');
    return {validCompleteJSON:true,nodeCount:n,edgeCount:e,stringCount:this.counts.strings,nodeFields:nf,edgeFields:ef};}
}
class SnapshotSink {
  constructor(file,{cap=256*1024*1024,write=fs.writeSync}={}){this.fd=fs.openSync(file,'wx');this.cap=cap;this.write=write;this.bytes=0;this.chunks=0;this.closed=false;this.validator=new SnapshotJSON();this.tail='';}
  chunk(text){if(this.closed)throw Error('SNAPSHOT_LATE_CHUNK');if(typeof text!=='string')throw Error('SNAPSHOT_CHUNK_TYPE');text=this.tail+text;this.tail='';if(/[\uD800-\uDBFF]/.test(text.at(-1)||'')){this.tail=text.slice(-1);text=text.slice(0,-1);}const b=Buffer.from(text,'utf8');if(this.bytes+b.length>this.cap)throw Error('SNAPSHOT_OUTPUT_CAP');
    let offset=0;while(offset<b.length){const n=this.write(this.fd,b,offset,b.length-offset);if(!Number.isInteger(n)||n<=0)throw Error('SNAPSHOT_WRITE_FAILED');offset+=n;this.bytes+=n;}
    this.chunks++;this.validator.feed(text);}
  finish(){if(this.tail)throw Error('SNAPSHOT_UNPAIRED_SURROGATE');if(!this.chunks)throw Error('SNAPSHOT_NO_CHUNKS');const metadata=this.validator.finish();fs.fsyncSync(this.fd);this.close();return {bytes:this.bytes,chunks:this.chunks,...metadata};}
  close(){if(!this.closed){this.closed=true;fs.closeSync(this.fd);}}
}
module.exports={SnapshotJSON,SnapshotSink};
