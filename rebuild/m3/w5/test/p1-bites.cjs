'use strict';
// Effective product-boundary mutations exist only in isolated child require caches.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const assert=require('node:assert/strict');
const file=path.resolve(__dirname,'../storage/database.cjs');
const original=fs.readFileSync(file,'utf8'),sha=x=>createHash('sha256').update(x).digest('hex');
const cases=[
  {name:'control assertion',pattern:'P1 checked control-row disappearance',
   before:'revision = ? AND EXISTS (SELECT 1 FROM authority_storage WHERE id = 1 AND profile = ? AND namespace = ? AND write_epoch = ?)',after:'revision = ?',
   before2:'.bind(revision,control.profile,control.namespace,control.write_epoch)',after2:'.bind(revision)'},
  {name:'original raw bytes',pattern:'P1 actual D1 copy and both bridge readers',
   before:'rows[i] = await codec.open(rows[i],{revision});',
   after:'{ rows[i] = await codec.open(rows[i],{revision}); rows[i].value = JSON.stringify(JSON.parse(rows[i].value)); }'},
  {name:'physical projection',pattern:'P1 actual D1 copy and both bridge readers',
   before:'rows[i] = await codec.open(rows[i],{revision});',
   after:'rows[i] = {athlete:rows[i].athlete,collection:rows[i].collection,row_id:rows[i].row_id,value:rows[i].value};'},
];
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'earned-p1-bites-'));
const selected=process.argv[2] ? cases.filter(c=>c.name===process.argv[2]) : cases;
assert(selected.length>0,'Unknown P1 bite case');
for(const c of selected){
  assert.equal(original.split(c.before).length,2);let mutated=original.replace(c.before,c.after);
  if(c.before2){assert.equal(mutated.split(c.before2).length,2);mutated=mutated.replace(c.before2,c.after2);}
  const preload=path.join(dir,c.name.replaceAll(' ','-')+'.cjs');
  fs.writeFileSync(preload,`const M=require('node:module'),p=require('node:path');const f=${JSON.stringify(file)};const m=new M(f,module);m.filename=f;m.paths=M._nodeModulePaths(p.dirname(f));require.cache[f]=m;m._compile(${JSON.stringify(mutated)},f);`);
  const args=['--test','--test-reporter=tap','--test-name-pattern',c.pattern,path.join(__dirname,'p1-bridge.test.cjs')];
  const red=spawnSync(process.execPath,['--require',preload,...args],{encoding:'utf8'});
  fs.writeFileSync(path.join(dir,c.name.replaceAll(' ','-')+'-red.log'),red.stdout+red.stderr);
  assert.equal(red.status,1,red.stdout+red.stderr);assert.match(red.stdout,/not ok/);
  const green=spawnSync(process.execPath,args,{encoding:'utf8'});
  fs.writeFileSync(path.join(dir,c.name.replaceAll(' ','-')+'-restored.log'),green.stdout+green.stderr);
  assert.equal(green.status,0,green.stdout+green.stderr);
  assert.equal(sha(fs.readFileSync(file)),sha(original));
  console.log(`P1 BITE ${c.name}: RED native 1 / original PASS native 0; source unchanged ${sha(original)}`);
}
console.log(`P1 BITES PASS ${selected.length}/${selected.length}; logs ${dir}`);
