const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=fs.realpathSync(process.cwd()),out=path.join(root,'.tmp/r2-review'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const old='c7623bcaa982182ab2cccd5ca542c450a758a4b8a2be99b0d4c063d55926a15d',pin='5e5266c253a36304543757a360b74bd0567134dd64da03aae09bf4fe38e6fbee',candidate='0df6ad3f3ec8d69a6e10ba68c279b7b77d061596',prior='ebc4c4e870497199c113c5e5c85bdced679589cf';
const entries=[['S3-ADMISSION-REVIEW-ANNEX.mjs','d7278c30e40cbfca883ad7080ca03413be06927db5d694442c07f0fad99d2a0f'],['S3-PROVIDER-REVIEW-ANNEX.mjs','96629e40ba5beef76aeac1b410a33ae514a700a0ff6b59c7675e374b07a00126'],['S3-PROVIDER-DRAFT51-ANNEX.mjs','16232b8d7a3a71f30424d54f7a8ded4f0f1ee88876e984d2c6d3f45a352d6914'],['S3-HARNESS-REVIEW-ANNEX.mjs','a370af67163c60633db8048aad61a76425af95dd424f97befe012d5fbb7802ce']];
const provider=cp.execFileSync('git',['show','946c36059a7ce6b949933da3904db3db8e6b8bd3:rebuild/m4/import/engine-provider.cjs'],{cwd:root});assert.equal(sha(fs.readFileSync(path.join(root,'rebuild/m4/import/engine-provider.cjs'))),sha(provider));
const records=[];
for(const [file,expected] of entries){const original=cp.execFileSync('git',['show','26ba95c380b20db6c7b46c40d45e7433ebf12ccd:rebuild/lanes/astra/reviews/'+file],{cwd:root});assert.equal(sha(original),expected);fs.writeFileSync(path.join(out,'original-'+file),original);let text=original.toString();const edits=[];
 const replace=(before,after,count)=>{assert.equal(text.split(before).length-1,count,file+' occurrence');text=text.split(before).join(after);edits.push({before,after,count});};
 replace(old,pin,1);replace(prior,candidate,file==='S3-PROVIDER-DRAFT51-ANNEX.mjs'?2:1);
 if(file==='S3-PROVIDER-DRAFT51-ANNEX.mjs')replace('f8b3d4cb7f8a7fd2c414a83b54cc497ca3aee71be90269ddd30b3eeb9c231a3e',sha(provider),1);
 if(file==='S3-HARNESS-REVIEW-ANNEX.mjs')replace("const sourceRoot = path.resolve(path.dirname(annexFile), '../../../..');",'const sourceRoot = '+JSON.stringify(root)+';',1);
 let reversed=text;for(const e of [...edits].reverse())reversed=reversed.split(e.after).join(e.before);assert.equal(reversed,original.toString(),'No semantic edits');
 const adapted='adapted-'+file;fs.writeFileSync(path.join(out,adapted),text);records.push({file,original_sha256:sha(original),adapted,adapted_sha256:sha(text),edits,reverseEqual:true});
}
fs.writeFileSync(path.join(out,'adaptation.json'),JSON.stringify({candidate,manifest:pin,provider:sha(provider),records},null,2)+'\n');console.log(JSON.stringify(records.map(r=>({file:r.file,adapted_sha256:r.adapted_sha256,edits:r.edits.length,reverseEqual:r.reverseEqual}))));
