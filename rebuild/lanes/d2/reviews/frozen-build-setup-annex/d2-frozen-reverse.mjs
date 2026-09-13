import fs from 'node:fs';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';
const source='rebuild/conform/engines/build-engines.mjs',before=fs.readFileSync(source),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
if(sha(before)!=='6bc9b7f150f879fb944c3866cd6d3ef771791cf5de561b84bb5c410913dd4a7b')throw Error('Exact candidate required');
const cases=[
 {id:'reversal-loader-link',from:'stat.isFile() && stat.nlink !== 1',to:'false',entry:'.tmp/d2-frozen-controls.test.mjs',pattern:'^D2 F3',assertion:'linked loader must refuse before actual service/worktree creation'},
 {id:'reversal-entry-exclusive',from:"{flag:'wx'}",to:"{flag:'w'}",entry:'rebuild/conform/engines/test/build-engines.test.mjs',pattern:'^real build: a committed entry sentinel',assertion:'ERR_ASSERTION'},
 {id:'reversal-failure-claims',from:'fs.renameSync(pending, outfile);',to:'fs.renameSync(pending, outfile); console.log("built " + item.name + " @ " + item.head);',entry:'.tmp/d2-frozen-controls.test.mjs',pattern:'^D2 F4',assertion:'a real publication failure must never print successful build/export claims'}
];
const records=[];try{for(const m of cases){const text=before.toString();if(text.split(m.from).length!==2)throw Error('Expected one reversal anchor');const mutant=Buffer.from(text.replace(m.from,m.to));fs.writeFileSync(source,mutant);
 const r=spawnSync(process.execPath,['.tmp/d2-frozen-run.mjs',m.id,m.entry,m.pattern],{cwd:process.cwd(),encoding:'utf8',timeout:90000,maxBuffer:4*1024*1024});
 fs.writeFileSync(source,before);const out=fs.readFileSync('.tmp/d2-frozen-'+m.id+'.tap','utf8'),meta=JSON.parse(fs.readFileSync('.tmp/d2-frozen-'+m.id+'.json'));
 const kill=meta.exit===1&&out.includes('ERR_ASSERTION')&&out.includes(m.assertion)&&!out.includes('SyntaxError')&&!out.includes('MODULE_NOT_FOUND')&&!meta.error&&!meta.signal;
 records.push({...m,source,sourceSHA256:sha(before),mutantSHA256:sha(mutant),restoredSHA256:sha(fs.readFileSync(source)),behavioralKill:kill,run:meta});
 fs.writeFileSync('.tmp/d2-frozen-reversals.json',JSON.stringify({candidate:'2fdf33e5d3d357b8886591cfec7252ebf3518013',authorOutcomesRead:false,records},null,2)+'\n');
 console.log(JSON.stringify({id:m.id,behavioralKill:kill,exactRestoration:sha(fs.readFileSync(source))===sha(before),runnerExit:r.status}));if(!kill)throw Error('Invalid reversal result');
}}finally{fs.writeFileSync(source,before);}
for(const [label,entry] of [['public-restored','rebuild/conform/engines/test/build-engines.test.mjs'],['controls-restored','.tmp/d2-frozen-controls.test.mjs']]){const r=spawnSync(process.execPath,['.tmp/d2-frozen-run.mjs',label,entry],{cwd:process.cwd(),encoding:'utf8',timeout:180000,maxBuffer:4*1024*1024});console.log(r.stdout.trim());const meta=JSON.parse(fs.readFileSync('.tmp/d2-frozen-'+label+'.json'));const out=fs.readFileSync('.tmp/d2-frozen-'+label+'.tap','utf8');if(label==='public-restored'&&meta.exit!==0)throw Error('Public suite restoration failed');if(label==='controls-restored'&&!(meta.exit===1&&out.includes('# tests 5')&&out.includes('# pass 4')&&out.includes('# fail 1')&&out.includes('not ok 2 - D2 F2')))throw Error('Unexpected restored independent result');}
