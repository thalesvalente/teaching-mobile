/** C1 authored browser verification. All data synthetic; no Google writes. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const reference=require('./aula08-v4-reference.cjs');
const root=path.resolve(__dirname,'..');
const lesson='lessons/aula-08-av1-incremento-1/laboratorio-vivo';
const lab=path.join(root,lesson);
const out=path.resolve(process.env.AULA08_V4_EVIDENCE_DIR||path.join(root,'test-results/aula08-v4'));
const ids=['M1-01','M1-02','M1-03','M1-04','M1-05','M2-01','M2-02','M2-03','M2-04','M3-01','M3-02','M3-03','M3-04','M3-05','M3-06','M4-01','M4-02','M4-03','M4-04','M4-05'];
const evidence={kind:'LOCAL_BROWSER_SYNTHETIC',startedAt:new Date().toISOString(),checks:[],native:'NOT_RUN',connectedGoogle:'NOT_RUN'};
function pass(name,details){evidence.checks.push({name,status:'PASS',...(details?{details}: {})});console.log('PASS: '+name);}
function checkStatic(){
 const read=n=>fs.readFileSync(path.join(lab,n),'utf8');
 const host=read('lab.js'),criteria=read('criteria.js'),backend=fs.readFileSync(path.join(root,'integrations/mobile-aula08-appscript/Code.gs'),'utf8');
 const matches=(s,r)=>Array.from(s.matchAll(r),x=>x[1]);
 assert.deepEqual(matches(host,/"id": "(M[1-4]-\d{2})"/g),ids);
 assert.deepEqual(matches(criteria,/i\('(M[1-4]-\d{2})'/g),ids);
 assert.deepEqual(matches(backend,/\['(M[1-4]-\d{2})',5\]/g),ids);
 assert.match(read('entrega-config.js'),/PROD_RELEASE_ENABLED = false/);
 assert.match(read('entrega-config.js'),/PROD_ENDPOINT = ''/);
 assert.match(read('preview.html'),/connect-src 'none'/);
 assert.match(read('entrega-appscript.js'),/gradeReceived!==null/);
 assert.match(backend,/mobile-notas-4\.1\.0/);
 for(const f of ['lab.js','criteria.js','preview.js','runtime-compiler.js','report-print.js','entrega-config.js','entrega-appscript.js','roster-client.js','production-gate.js'])new Function(read(f));
 pass('Contracts align: 20 criteria, 100 XP and production disabled');
}
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.tsx':'text/plain;charset=utf-8','.css':'text/css;charset=utf-8','.json':'application/json'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const requested=path.resolve(root,'.'+pathname);
 if(!requested.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 const file=fs.existsSync(requested)&&fs.statSync(requested).isDirectory()?path.join(requested,'index.html'):requested;
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
async function compiled(page){await page.waitForFunction(()=>document.querySelector('#compiler-status')?.textContent.startsWith('✓ Executado'),null,{timeout:25000});}
async function setCode(page,code){
 if(await page.locator('#view-code').isVisible())await page.locator('#view-code').click();
 await page.locator('#code').fill(code);await page.locator('#run').click();await compiled(page);
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});checkStatic();
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port+'/'+lesson+'/';
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{}),args:['--no-sandbox']});
 try{
  for(const width of [360,390,768,1024,1440]){
   const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await compiled(page);
   assert.equal(await page.locator('#mission-select option').count(),20);
   assert.equal(await page.locator('#xp-top').textContent(),'0');
   const size=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,width:innerWidth}));
   assert.ok(size.actual<=size.width+2,JSON.stringify(size));
   if(width<1025){await page.locator('#view-preview').click();assert.equal(await page.locator('#preview').isVisible(),true);await page.locator('#view-code').click();}
   await page.screenshot({path:path.join(out,'viewport-'+width+'.png'),fullPage:true});
   assert.deepEqual(errors,[]);await page.close();pass('Responsive '+width+'px and starter compiles');
  }
  const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto(url);await compiled(page);
  const original=await page.locator('#code').inputValue();
  const solution=reference(original);await setCode(page,solution);
  const frame=page.frameLocator('#preview');
  await frame.locator('#web-root [data-testid="busca"]').fill('PRAÇA');
  assert.equal(await frame.locator('#web-root [data-testid^="registro-"]').count(),2);
  await frame.locator('#web-root [data-testid="registro-m-03"]').click();
  await frame.locator('#web-root [data-testid="titulo-detalhe"]').filter({hasText:'Mapa da praça'}).waitFor();
  await frame.locator('#web-root').getByRole('button',{name:'Voltar sem perder filtros',exact:true}).click();
  assert.equal(await frame.locator('#web-root [data-testid="busca"]').inputValue(),'PRAÇA');
  await frame.locator('#web-root').getByRole('button',{name:'Novo registro',exact:true}).click();
  await frame.locator('#web-root [data-testid="novo-titulo"]').fill('ab');
  await frame.locator('#web-root [data-testid="nova-descricao"]').fill('curta');
  await frame.locator('#web-root').getByRole('button',{name:'Salvar registro',exact:true}).click();
  assert.match(await frame.locator('#web-root #titulo-error').textContent(),/5 a 60/);
  assert.match(await frame.locator('#web-root #descricao-error').textContent(),/10 a 180/);
  await frame.locator('#web-root [data-testid="novo-titulo"]').fill('Novo registro QA');
  await frame.locator('#web-root [data-testid="nova-descricao"]').fill('Descrição sintética longa de teste.');
  await frame.locator('#web-root').getByRole('button',{name:'Salvar registro',exact:true}).click();
  await frame.locator('#web-root [data-testid="busca"]').fill('Novo registro QA');
  assert.equal(await frame.locator('#web-root [data-testid^="registro-"]').count(),1);
  assert.equal(await frame.locator('#mobile-root [data-testid^="registro-"]').count(),4,'two preview states remain independent');
  pass('React Native Web components: search, detail, preserved filters, errors and immutable insertion');
  for(let index=0;index<ids.length;index++){
   await page.locator('#mission-select').selectOption(ids[index]);await page.locator('#guide-check').click();
   await page.waitForFunction(expected=>document.querySelector('#xp-top')?.textContent===String(expected),(index+1)*5);
  }
  assert.equal(await page.locator('#xp-top').textContent(),'100');
  const technical=await page.evaluate(()=>window.WebLabEvidence.snapshot().technicalEvaluation);
  assert.deepEqual(technical.criteria.map(x=>x.id),ids);assert.ok(technical.criteria.every(x=>x.status==='PASS'));
  assert.equal(technical.sourceSha256,crypto.createHash('sha256').update(solution).digest('hex'));
  pass('All 20 missions pass via UI, XP exactly 100, code hash and current tests match');
  // A changed current revision may fail while historical formative achievements survive.
  await setCode(page,original);await page.locator('#review-xp').click();
  await page.waitForFunction(()=>document.querySelector('#review-status')?.textContent.includes('0/20'));
  assert.equal(await page.locator('#xp-top').textContent(),'100');
  const reg=await page.evaluate(()=>window.WebLabEvidence.snapshot());
  assert.ok(reg.technicalEvaluation.criteria.every(x=>x.status==='FAIL'));assert.equal(reg.avaliacaoDocente.notaOficial,null);
  pass('Regression invalidates current technical tests without erasing historical XP or generating a grade');
  // Fresh synthetic session for artifacts: never export/reference a full answer key.
  await page.close();
  const sample=await browser.newPage({viewport:{width:1440,height:1000}});await sample.goto(url);await compiled(sample);
  const partial=original.replace("return 'pendente';","if(info.erro)return 'erro';return 'pendente';");await setCode(sample,partial);
  await sample.locator('#guide-check').click();await sample.waitForFunction(()=>document.querySelector('#xp-top')?.textContent==='5');
  await sample.locator('#team-open').click();await sample.locator('#web-team').fill('Equipe QA Exemplo');await sample.locator('#team-done').click();
  const download=sample.waitForEvent('download');await sample.locator('#save-progress').click();const file=await download;
  const checkpointPath=path.join(out,'continuidade-exemplo-ficticio.json');await file.saveAs(checkpointPath);
  const checkpoint=JSON.parse(fs.readFileSync(checkpointPath,'utf8'));assert.equal(checkpoint.xp,5);assert.equal(checkpoint.code,partial);
  await setCode(sample,original);sample.once('dialog',d=>d.accept());await sample.locator('#progress-file').setInputFiles(checkpointPath);await sample.waitForFunction(()=>/retomado/i.test(document.querySelector('#progress-status')?.textContent||''));await compiled(sample);
  assert.equal(await sample.locator('#code').inputValue(),partial);assert.equal(await sample.locator('#xp-top').textContent(),'5');
  assert.equal(await sample.evaluate(()=>window.WebLabEvidence.snapshot().technicalEvaluation.criteria.filter(x=>x.status==='PASS').length),0);
  pass('Checkpoint export/import preserves partial code and XP; current technical results require recheck');
  await sample.locator('#evidence-open').click();
  await sample.evaluate(()=>{window.print=()=>{};});await sample.locator('#print').click();
  await sample.emulateMedia({media:'print'});await sample.pdf({path:path.join(out,'relatorio-exemplo-ficticio.pdf'),format:'A4',printBackground:true});
  const report=await sample.locator('#print-report').textContent();assert.match(report,/Programação para Dispositivos Móveis/);assert.match(report,/M4 — Idempotência/);assert.doesNotMatch(report,/Desenvolvimento (de Sistemas )?Web|WEB-A05/);
  assert.match(report,/PENDENTE DE VALIDAÇÃO DOCENTE/);pass('A4 PDF with Mobile identity, four cycles, partial XP and pending official grade');
  await sample.emulateMedia({media:'screen'});await sample.locator('#web-submit').click();
  assert.match(await sample.locator('#web-delivery-status').textContent(),/ENVIO NÃO REALIZADO/);
  assert.equal(await sample.evaluate(()=>window.WebEntrega.ativado),false);pass('Production delivery remains blocked; no Google write');
  await sample.close();
 }finally{await browser.close();await new Promise(r=>server.close(r));}
 evidence.finishedAt=new Date().toISOString();evidence.status='PASS';fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(evidence,null,2)+'\n');
})().catch(error=>{evidence.status='FAIL';evidence.error=error.stack||String(error);fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(evidence,null,2)+'\n');console.error(error);server.close();process.exitCode=1;});
