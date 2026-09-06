'use strict';
// Descriptor profile 2. Neither branding nor snapshots invoke user getters.
const {types}=require('node:util');
const NativeDate=Date, dateTime=Date.prototype.getTime;
const errors=[Error,EvalError,RangeError,ReferenceError,SyntaxError,TypeError,URIError,AggregateError];
const typed=[Uint8Array,Uint8ClampedArray,Int8Array,Uint16Array,Int16Array,Uint32Array,Int32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array];
const typedProto=Object.getPrototypeOf(Uint8Array.prototype);
const typedGet=Object.fromEntries(['buffer','byteOffset','byteLength'].map(k=>[k,Object.getOwnPropertyDescriptor(typedProto,k).get]));
const viewGet=Object.fromEntries(['buffer','byteOffset','byteLength'].map(k=>[k,Object.getOwnPropertyDescriptor(DataView.prototype,k).get]));
function fail(code){throw Object.assign(new Error(code),{code});}
const BOUNDARY_DATES=new Set([
  'class ReferenceDate extends RealDate {\n    constructor(...args){super(...(args.length?args:[clock.nowMs()]));}\n    static now(){return clock.nowMs();}\n  }',
  'class ReferenceDate extends RealDate {\n    constructor(...args) { super(...(args.length ? args : [clock.nowMs()])); }\n    static now() { return clock.nowMs(); }\n  }',
  'class AtDate extends NativeDate { constructor(...args){super(...(args.length?args:[c.nowMs()]));} static now(){return c.nowMs();} }'
]);
function graphEncoderV2({boundaryDateProfile=false}={}){
  const identities=new Map();let next=0;
  const datePrototypes=new Set([NativeDate.prototype,globalThis.Date.prototype]);
  function knownBoundary(proto){
    if(!boundaryDateProfile||!proto||types.isProxy(proto)||!datePrototypes.has(Reflect.getPrototypeOf(proto))||Reflect.ownKeys(proto).join('|')!=='constructor')return false;
    const d=Reflect.getOwnPropertyDescriptor(proto,'constructor');if(!d||!Object.hasOwn(d,'value')||typeof d.value!=='function'||types.isProxy(d.value)||!BOUNDARY_DATES.has(Function.prototype.toString.call(d.value)))return false;
    if(Reflect.ownKeys(d.value).map(String).sort().join('|')!=='length|name|now|prototype')return false;
    return d.enumerable===false&&d.writable===true&&d.configurable===true;
  }
  const identity=v=>{if(!identities.has(v))identities.set(v,++next);return identities.get(v);};
  return function snapshot(root){const visited=new Set();
    function visit(v){
      if(v===null)return ['null'];const type=typeof v;
      if(type==='undefined')return ['undefined'];
      if(type==='number')return ['number',Number.isNaN(v)?'NaN':v===Infinity?'+Infinity':v===-Infinity?'-Infinity':Object.is(v,-0)?'-0':String(v)];
      if(type==='string'||type==='boolean'||type==='bigint')return [type,String(v)];
      if(type==='symbol')return ['symbol',identity(v),v.description??null];
      if(types.isProxy(v))fail('UNSUPPORTED-TRACE-PROXY');
      if(type==='function')return ['function',identity(v)];
      const id=identity(v);if(visited.has(v))return ['ref',id];visited.add(v);
      const proto=Reflect.getPrototypeOf(v);let tag,extra=null;
      if(Array.isArray(v)){if(proto!==Array.prototype)fail('UNSUPPORTED-TRACE-PROTOTYPE');tag='Array';}
      else if(types.isDate(v)){if(!datePrototypes.has(proto)&&!knownBoundary(proto))fail('UNSUPPORTED-TRACE-PROTOTYPE');tag='Date';extra=visit(Reflect.apply(dateTime,v,[]));}
      else if(types.isMap(v)){if(proto!==Map.prototype)fail('UNSUPPORTED-TRACE-PROTOTYPE');tag='Map';extra=Array.from(Reflect.apply(Map.prototype.entries,v,[]),([k,x])=>[visit(k),visit(x)]);}
      else if(types.isSet(v)){if(proto!==Set.prototype)fail('UNSUPPORTED-TRACE-PROTOTYPE');tag='Set';extra=Array.from(Reflect.apply(Set.prototype.values,v,[]),visit);}
      else if(types.isAnyArrayBuffer(v)){if(proto!==ArrayBuffer.prototype)fail('UNSUPPORTED-TRACE-TYPE');tag='ArrayBuffer';extra=Buffer.from(v).toString('hex');}
      else if(types.isDataView(v)||types.isTypedArray(v)){const ctor=types.isDataView(v)?DataView:typed.find(C=>proto===C.prototype);if(!ctor||proto!==ctor.prototype)fail('UNSUPPORTED-TRACE-PROTOTYPE');tag=ctor.name;const get=ctor===DataView?viewGet:typedGet;extra=Buffer.from(Reflect.apply(get.buffer,v,[]),Reflect.apply(get.byteOffset,v,[]),Reflect.apply(get.byteLength,v,[])).toString('hex');}
      else if(types.isNativeError(v)){const C=errors.find(C=>proto===C.prototype);if(!C)fail('UNSUPPORTED-TRACE-PROTOTYPE');tag=C.name;}
      else if(proto===null||proto===Object.prototype)tag='Object';
      else fail('UNSUPPORTED-TRACE-PROTOTYPE');
      const props=Reflect.ownKeys(v).filter(k=>!(types.isNativeError(v)&&k==='stack')).map(k=>{
        const d=Reflect.getOwnPropertyDescriptor(v,k);
        return Object.hasOwn(d,'value')?[visit(k),'data',!!d.enumerable,!!d.writable,!!d.configurable,visit(d.value)]:[visit(k),'accessor',!!d.enumerable,!!d.configurable,visit(d.get),visit(d.set)];
      });
      return ['node',id,tag,proto===null?'null-prototype':'standard',props,extra];
    }
    return visit(root);
  };
}
module.exports={graphEncoderV2,BOUNDARY_DATES};
