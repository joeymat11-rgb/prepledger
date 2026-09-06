'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const S=require('../structural-delta.cjs'),T=require('../target.cjs');
const throws=(fn,code)=>assert.throws(fn,e=>e.code===code),copy=structuredClone;
function fixture(){
  const array=[{id:'synthetic-omitted',value:1},{id:'synthetic-retained',value:2,nested:{untouched:true}}],encode=T.graphEncoderV2();
  const before={frames:[{value:encode(array)}]};array.splice(0,1);const after={frames:[{value:encode(array)}]},p=['frames','0','value','4'];
  const cells=[
    {id:'retained-key',op:'replace',path:p.concat('1','0','1'),afterPath:p.concat('0','0','1'),before:'1',after:'0'},
    {id:'length-value',op:'replace',path:p.concat('2','5','1'),afterPath:p.concat('1','5','1'),before:'2',after:'1'},
    {id:'exact-omission',op:'remove',path:p.concat('0'),before:copy(before.frames[0].value[4][0]),after:null},
  ];return {before,after,delta:{aliases:[],cells}};
}
test('dense Array retained descriptor shifts with complete content and identity preserved',()=>{const f=fixture();assert.equal(S.compareStructural(f.before,f.after,f.delta),true);});
test('explicit alias bijection precedes exact retained Array identity comparison',()=>{const f=fixture(),id=f.before.frames[0].value[1];f.after.frames[0].value[1]=999;f.delta.aliases=[[id,999]];assert.equal(S.compareStructural(f.before,f.after,f.delta),true);});
test('wrong Array identity cannot borrow the retained descriptor mapping',()=>{const f=fixture();f.after.frames[0].value[1]=999;throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-ARRAY-CORRESPONDENCE');});
test('changed retained content is rejected even if an exact extra leaf delta is offered',()=>{const f=fixture(),value=f.after.frames[0].value[4][0][5],prop=value[4].find(p=>p[0][1]==='value');prop[5][1]='99';f.delta.cells.unshift({id:'attempted-extra',op:'replace',path:['frames','0','value','4','1','5','4','1','5','1'],afterPath:['frames','0','value','4','0','5','4','1','5','1'],before:'2',after:'99'});throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-ARRAY-RETAINED-CONTENT');});
test('a different surviving object is not the retained original card',()=>{const f=fixture();f.after.frames[0].value[4][0][5][1]=999;throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-ARRAY-RETAINED-CONTENT');});
test('different retained property flags are not hidden by same values',()=>{const f=fixture();f.after.frames[0].value[4][0][2]=false;throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-ARRAY-CORRESPONDENCE');});
test('plain object descriptor arrays cannot masquerade as typed Array nodes',()=>{const f=fixture();f.before.frames[0].value[2]='Object';f.after.frames[0].value[2]='Object';throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-ARRAY-CORRESPONDENCE');});
test('custom Array prototype is refused',()=>{const f=fixture();f.before.frames[0].value[3]='custom';throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-ARRAY-CORRESPONDENCE');});
test('sparse Array descriptors are not this dense omission profile',()=>{const f=fixture();f.before.frames[0].value[4][1][0][1]='3';throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-ARRAY-CORRESPONDENCE');});
test('longer Arrays require a separately specified correspondence',()=>{const f=fixture();f.before.frames[0].value[4].push([['string','extra'],'data',true,true,true,['null']]);throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-ARRAY-CORRESPONDENCE');});
test('whole retained card replacement is forbidden',()=>{const f=fixture();f.delta.cells[0]={id:'blanket',op:'replace',path:['frames','0','value','4','1','5'],afterPath:['frames','0','value','4','0','5'],before:f.before.frames[0].value[4][1][5],after:f.after.frames[0].value[4][0][5]};throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-FRAME-CORRESPONDENCE');});
test('relocation cannot also change a leaf path',()=>{const f=fixture();f.delta.cells[0].afterPath[5]='5';throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-FRAME-CORRESPONDENCE');});
test('two original descriptor mappings cannot collide on index0',()=>{const f=fixture();f.delta.cells[1].afterPath[4]='0';throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-FRAME-CORRESPONDENCE');});
test('original path overlap is still rejected',()=>{const f=fixture();f.delta.cells.push({...copy(f.delta.cells[0]),id:'overlap'});throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-OVERLAP');});
test('omission cell pins all discarded bytes',()=>{const f=fixture();f.delta.cells[2].before[5][1]=999;throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-PREDICATE');});
test('omission cannot be omitted from the exact reconstruction',()=>{const f=fixture();f.delta.cells.pop();throws(()=>S.compareStructural(f.before,f.after,f.delta),'UNAPPROVED-DELTA');});
test('unlisted output field still fails after valid correspondence',()=>{const f=fixture();f.after.extra=['string','unlisted'];throws(()=>S.compareStructural(f.before,f.after,f.delta),'UNAPPROVED-DELTA');});
test('mapped addition still requires original absence',()=>{const f=fixture();f.delta.cells[0].op='add';f.delta.cells[0].before=null;throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-PREDICATE');});
test('mapped removal still requires final absence',()=>{const f=fixture();f.delta.cells[0].op='remove';f.delta.cells[0].after=null;throws(()=>S.compareStructural(f.before,f.after,f.delta),'DELTA-PREDICATE');});
test('existing frame-index relocation profile remains exact',()=>{const before={frames:[{fixed:1},{discard:true},{x:'old'}]},after={frames:[{fixed:1},{x:'new'}]},delta={aliases:[],cells:[{id:'leaf',op:'replace',path:['frames','2','x'],afterPath:['frames','1','x'],before:'old',after:'new'},{id:'frame',op:'remove',path:['frames','1'],before:{discard:true},after:null}]};assert.equal(S.compareStructural(before,after,delta),true);});
