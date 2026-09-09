'use strict';
const {EventEmitter}=require('node:events');
const ALLOWED=new Set(['Runtime.enable','Runtime.getIsolateId','Runtime.getHeapUsage','Debugger.enable','Debugger.pause','Debugger.resume','Debugger.disable','HeapProfiler.takeHeapSnapshot']);
class InspectorSession extends EventEmitter {
  constructor(socket){super();this.socket=socket;this.pending=new Map();this.sequence=0;this.closed=false;this.intentionalClose=false;this.commands=[];
    socket.on('message',bytes=>{if(bytes.length>4*1024*1024){this.fail('INSPECTOR_FRAME_CAP');return;}let data;try{data=JSON.parse(bytes.toString('utf8'));}catch{this.fail('INSPECTOR_INVALID_JSON');return;}
      if(data.id!==undefined){const item=this.pending.get(data.id);if(!item){this.emit('lateResponse');return;}this.pending.delete(data.id);clearTimeout(item.timer);data.error?item.reject(Error('INSPECTOR_COMMAND_REJECTED')):item.resolve(data.result||{});}
      else if(typeof data.method==='string')this.emit(data.method,data.params||{});
    });
    socket.on('error',()=>this.fail('INSPECTOR_SOCKET_FAILURE'));socket.on('close',()=>{this.closed=true;if(!this.intentionalClose)this.fail('INSPECTOR_SOCKET_CLOSED');});
  }
  fail(code){for(const p of this.pending.values()){clearTimeout(p.timer);p.reject(Error(code));}this.pending.clear();this.emit('failure',code);}
  command(method,params={},timeoutMs=5000){if(!ALLOWED.has(method))return Promise.reject(Error('INSPECTOR_COMMAND_FORBIDDEN'));if(this.closed)return Promise.reject(Error('INSPECTOR_SOCKET_CLOSED'));const id=++this.sequence;this.commands.push({id,method,sentMs:performance.now()});
    return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{this.pending.delete(id);reject(Error('INSPECTOR_COMMAND_TIMEOUT'));},timeoutMs);this.pending.set(id,{resolve,reject,timer});try{this.socket.send(JSON.stringify({id,method,params}),error=>{if(error){const p=this.pending.get(id);if(p){clearTimeout(p.timer);this.pending.delete(id);p.reject(Error('INSPECTOR_SEND_FAILURE'));}this.fail('INSPECTOR_SEND_FAILURE');}});}catch{this.fail('INSPECTOR_SEND_FAILURE');}});
  }
  async drain(){if(this.pending.size)throw Error('OBSERVATION_NOT_DRAINED');}
  close(){this.intentionalClose=true;this.closed=true;this.fail('INSPECTOR_CLEANUP');this.socket.close();this.socket.terminate();}
}
async function connect(WebSocket,url){const socket=new WebSocket(url,{maxPayload:4*1024*1024,perMessageDeflate:false,handshakeTimeout:5000});const session=new InspectorSession(socket);await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{socket.terminate();reject(Error('INSPECTOR_OPEN_TIMEOUT'));},5000);socket.once('open',()=>{clearTimeout(timer);resolve();});socket.once('error',()=>{clearTimeout(timer);reject(Error('INSPECTOR_OPEN_FAILED'));});});return session;}
module.exports={InspectorSession,connect};
