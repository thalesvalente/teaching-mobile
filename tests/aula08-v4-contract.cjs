'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const lab=path.join(root,'lessons/aula-08-av1-incremento-1/laboratorio-vivo');
global.window=global;
require(path.join(lab,'assets/vendor.js'));
const {compile}=require(path.join(lab,'runtime-compiler.js'));
const {create}=require(path.join(lab,'criteria.js'));
const reference=require('./aula08-v4-reference.cjs');
const starter=fs.readFileSync(path.join(lab,'shared/ProjetoUniversal.tsx'),'utf8');
const solution=reference(starter);
const run=source=>{const app=compile(source,global.LabVendor);return create(app).map(t=>{try{t.run();return {id:t.id,ok:true}}catch(e){return {id:t.id,ok:false,detail:e.message}}});};
test('20 deterministic criteria, same source and same evaluator in browser/Expo',()=>{
 const a=run(solution),b=run(solution);
 assert.equal(a.length,20);assert.equal(new Set(a.map(x=>x.id)).size,20);
 assert.deepEqual(a,b);assert.deepEqual(a.filter(x=>!x.ok),[]);
 assert.equal(a.filter(x=>x.ok).length*5,100);assert.equal(a.filter(x=>x.ok).length*0.5,10);
});
test('all 20 starter criteria fail deliberately',()=>assert.equal(run(starter).filter(x=>x.ok).length,0));
test('regression in idempotency affects M4-01 while other passes remain observable',()=>{
 const broken=solution.replace("return registros.some(r=>r.id===novo.id)?registros:[...registros,novo];","return [...registros,novo];");
 const results=run(broken);assert.equal(results.find(x=>x.id==='M4-01').ok,false);assert.ok(results.filter(x=>x.ok).length>10);
});
test('source mutation rejected by behavioral contract',()=>{
 const broken=solution.replace('const result=registros.filter(', 'const result=registros.reverse().filter(');
 assert.equal(run(broken).find(x=>x.id==='M2-04').ok,false);
});
test('invalid TSX, arbitrary imports and missing exports fail clearly',()=>{
 assert.throws(()=>compile('const x = <',global.LabVendor));
 assert.throws(()=>compile("import fs from 'node:fs';"+starter,global.LabVendor),/Importação/);
 assert.throws(()=>compile('export default function App(){return null}',global.LabVendor),/Contrato ausente/);
});
for(const expression of ['fetch("https://example.invalid/")','window.parent.document','navigator.sendBeacon("x","y")','new Function("return 1")','document.createElement("img")']){
 test('ambient API rejected: '+expression,()=>assert.throws(()=>compile(expression+';\n'+starter,global.LabVendor),/API fora do contrato/));
}
test('common synchronous infinite loop is interrupted before 2 s',()=>{
 const before=Date.now();assert.throws(()=>compile('while(true){}\n'+starter,global.LabVendor),/Limite de execução/);assert.ok(Date.now()-before<2000);
});
test('reference source not included in starter or browser bundle',()=>{
 assert.match(starter,/TODO M1/);assert.match(starter,/return 'pendente';/);
 assert.doesNotMatch(fs.readFileSync(path.join(lab,'index.html'),'utf8'),/aula08-v4-reference/);
 assert.match(fs.readFileSync(path.join(lab,'projeto/App.tsx'),'utf8'),/\.\.\/shared\/ProjetoUniversal/);
});
