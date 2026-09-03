const fs=require("node:fs");const JP=JSON.stringify,clP=(x)=>JSON.parse(JP(x));
const T=require("/tmp/rig174/engine-fix4b.cjs").__test;const RAW=JSON.parse(fs.readFileSync("/tmp/rig174/live.json","utf8"));
const m=T.migrate(clP(RAW));
const key=(f)=>(f.op||"")+"|"+f.d+"|"+f.t;
const a=new Map(RAW.feed.map(f=>[key(f),f])),b=new Map(m.feed.map(f=>[key(f),f]));
const gone=[...a.keys()].filter(k=>!b.has(k)),added=[...b.keys()].filter(k=>!a.has(k));
console.log("gone",gone.length);for(const k of gone)console.log("  -",k.slice(0,140));
console.log("added",added.length);for(const k of added)console.log("  +",k.slice(0,140));
