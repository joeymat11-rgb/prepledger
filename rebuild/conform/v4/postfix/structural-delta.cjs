'use strict';
const {fail}=require('./target.cjs');
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function closed(value,names,code){if(!value||typeof value!=='object'||Array.isArray(value)||!equal(Object.keys(value).sort(),names.slice().sort()))fail(code);}
// Aliases are explicit reviewed bijections, never discarded identities. Profile2
// has only node/ref/function/symbol identity positions; arbitrary numbers remain.
function remapGraph(value,mappings){
  if(!Array.isArray(mappings))fail('ALIAS-MAPPING');const map=new Map(),targets=new Set(),used=new Set();
  for(const pair of mappings){if(!Array.isArray(pair)||pair.length!==2||pair.some(n=>!Number.isSafeInteger(n)||n<1)||pair[0]===pair[1]||map.has(pair[0])||targets.has(pair[1]))fail('ALIAS-MAPPING');map.set(pair[0],pair[1]);targets.add(pair[1]);}
  const known=new Set();
  function walk(v){if(!v||typeof v!=='object')return; if(Array.isArray(v)&&['node','ref','function','symbol'].includes(v[0])&&Number.isSafeInteger(v[1])){known.add(v[1]);if(map.has(v[1])){used.add(v[1]);v[1]=map.get(v[1]);}}for(const x of Object.values(v))walk(x);}
  const out=structuredClone(value);walk(out);
  for(const [from,to]of map)if(!used.has(from)||known.has(to)&&!map.has(to))fail('ALIAS-MAPPING-UNUSED-OR-COLLISION');
  return out;
}
// Syntax-only schema shared with acceptance.cjs. Existing frame relocation is
// unchanged. The second form is ONLY the reviewed dense two-element Array's
// retained descriptor1->0 / length descriptor2->1 after its first omission.
function validateAfterPath(d){
  const p=d.path,q=d.afterPath;
  if(!['replace','remove','add'].includes(d.op)||!Array.isArray(p)||!Array.isArray(q)||p.length<3||q.length!==p.length||p.some(x=>typeof x!=='string'||['*','__proto__','constructor','prototype'].includes(x))||q.some(x=>typeof x!=='string'||['*','__proto__','constructor','prototype'].includes(x))||p[0]!=='frames'||q[0]!=='frames'||!/^\d+$/.test(p[1])||!/^\d+$/.test(q[1])||(d.op==='replace'&&[d.before,d.after].some(x=>x!==null&&typeof x==='object')))fail('DELTA-FRAME-CORRESPONDENCE');
  const changed=p.map((v,i)=>v!==q[i]?i:-1).filter(i=>i>=0);
  if(changed.length!==1)fail('DELTA-FRAME-CORRESPONDENCE');const i=changed[0];
  if(i===1)return {kind:'frame',coordinate:i};
  if(i<3||p[i-1]!=='4'||!['1','2'].includes(p[i])||Number(q[i])!==Number(p[i])-1||!['0','1'].includes(q[i])||p.length<=i+1)fail('DELTA-FRAME-CORRESPONDENCE');
  return {kind:'array-first-omission',coordinate:i};
}
function valueAt(root,p){let v=root;for(const k of p){if(!v||typeof v!=='object'||!Object.hasOwn(v,k))fail('DELTA-ARRAY-CORRESPONDENCE');v=v[k];}return v;}
function verifyArrayOmission(before,after,p,coordinate){
  const prefix=p.slice(0,coordinate-1),a=valueAt(before,prefix),b=valueAt(after,prefix);
  const node=v=>Array.isArray(v)&&v.length===6&&v[0]==='node'&&Number.isSafeInteger(v[1])&&v[1]>0&&v[2]==='Array'&&v[3]==='standard'&&Array.isArray(v[4]);
  const element=(d,n)=>Array.isArray(d)&&d.length===6&&equal(d.slice(0,5),[['string',String(n)],'data',true,true,true]);
  const length=(d,n)=>equal(d,[['string','length'],'data',false,true,false,['number',String(n)]]);
  if(!node(a)||!node(b)||a[1]!==b[1]||!equal(a[5],b[5])||a[4].length!==3||b[4].length!==2||!element(a[4][0],0)||!element(a[4][1],1)||!element(b[4][0],0)||!length(a[4][2],2)||!length(b[4][1],1))fail('DELTA-ARRAY-CORRESPONDENCE');
  const retained=structuredClone(a[4][1]);retained[0][1]='0';
  if(!equal(retained,b[4][0]))fail('DELTA-ARRAY-RETAINED-CONTENT');
}
function compareStructural(before,after,{aliases=[],cells=[]}={}){
  const mapped=remapGraph(before,aliases);let current=structuredClone(mapped);const paths=[],destinations=[],ids=new Set(),arrayPairs=new Map(),arrayTargets=new Map();
  function location(root,p){if(!Array.isArray(p)||!p.length||p.some(x=>typeof x!=='string'||['*','__proto__','constructor','prototype'].includes(x)))fail('DELTA-PATH');let parent=root;for(const k of p.slice(0,-1)){if(!parent||typeof parent!=='object'||!Object.hasOwn(parent,k))fail('DELTA-UNUSED');parent=parent[k];}if(!parent||typeof parent!=='object')fail('DELTA-UNUSED');return {parent,key:p.at(-1)};}
  for(const d of cells){closed(d,Object.hasOwn(d,'afterPath')?['id','op','path','afterPath','before','after']:['id','op','path','before','after'],'DELTA-SCHEMA');if(typeof d.id!=='string'||!d.id||ids.has(d.id))fail('DELTA-ID');ids.add(d.id);
    if(!['replace','add','remove'].includes(d.op))fail('DELTA-OP');const p=d.path;if(!Array.isArray(p))fail('DELTA-PATH');
    if(paths.some(q=>equal(q.slice(0,p.length),p)||equal(p.slice(0,q.length),q)))fail('DELTA-OVERLAP');paths.push(p);
    const destination=Object.hasOwn(d,'afterPath')?d.afterPath:p;
    if(Object.hasOwn(d,'afterPath')){
      const mapping=validateAfterPath(d);
      if(mapping.kind==='array-first-omission'){
        verifyArrayOmission(mapped,after,p,mapping.coordinate);
        const from=JSON.stringify(p.slice(0,mapping.coordinate+1)),to=JSON.stringify(destination.slice(0,mapping.coordinate+1));
        if(arrayPairs.has(from)&&arrayPairs.get(from)!==to||arrayTargets.has(to)&&arrayTargets.get(to)!==from)fail('DELTA-ARRAY-COLLISION');arrayPairs.set(from,to);arrayTargets.set(to,from);
      }
    }
    if(d.op!=='remove'){if(destinations.some(q=>equal(q.slice(0,destination.length),destination)||equal(destination.slice(0,q.length),q)))fail('DELTA-DESTINATION-OVERLAP');destinations.push(destination);}
    const left=location(current,p),right=location(after,destination),hasLeft=Object.hasOwn(left.parent,left.key),hasRight=Object.hasOwn(right.parent,right.key);
    if(d.op==='replace'){if(!hasLeft||!hasRight||!equal(left.parent[left.key],d.before)||!equal(right.parent[right.key],d.after)||equal(d.before,d.after))fail('DELTA-PREDICATE');left.parent[left.key]=structuredClone(d.after);}
    if(d.op==='add'){if(Object.hasOwn(d,'afterPath')&&hasLeft)fail('DELTA-PREDICATE');if(d.before!==null||!hasRight||!equal(right.parent[right.key],d.after))fail('DELTA-PREDICATE');if(Array.isArray(left.parent)){const n=Number(left.key);if(!/^\d+$/.test(left.key)||!Number.isSafeInteger(n)||n<0||n>left.parent.length)fail('DELTA-PATH');left.parent.splice(n,0,structuredClone(d.after));}else{if(hasLeft)fail('DELTA-PREDICATE');left.parent[left.key]=structuredClone(d.after);}}
    if(d.op==='remove'){if(Object.hasOwn(d,'afterPath')&&hasRight)fail('DELTA-PREDICATE');if(d.after!==null||!hasLeft||!equal(left.parent[left.key],d.before))fail('DELTA-PREDICATE');if(Array.isArray(left.parent)){if(!/^\d+$/.test(left.key))fail('DELTA-PATH');left.parent.splice(Number(left.key),1);}else{if(hasRight)fail('DELTA-PREDICATE');delete left.parent[left.key];}}
  }
  if(!equal(current,after))fail('UNAPPROVED-DELTA');return true;
}
module.exports={compareStructural,remapGraph,validateAfterPath};
