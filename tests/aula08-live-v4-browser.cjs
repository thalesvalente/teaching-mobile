/** QA Aula 08 Live v4 — navegador real, origem isolada e sem writes Google.
 * Executar com Playwright instalado: node tests/aula08-live-v4-browser.cjs
 */
'use strict';
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root=path.resolve(__dirname,'..');
const lesson='lessons/aula-08-av1-incremento-1/laboratorio-vivo';
const tests=[
  'M1-01','M1-02','M1-03','M1-04','M1-05',
  'M2-01','M2-02','M2-03','M2-04',
  'M3-01','M3-02','M3-03','M3-04','M3-05','M3-06',
  'M4-01','M4-02','M4-03','M4-04','M4-05'
];
function checkStatic(){
  const file=n=>fs.readFileSync(path.join(root,lesson,n),'utf8');
  const lab=file('lab.js'), preview=file('preview.js'), server=fs.readFileSync(path.join(root,'integrations/mobile-aula08-appscript/Code.gs'),'utf8');
  const cfg=file('entrega-config.js'), deliver=file('entrega-appscript.js'), report=file('report-print.js');
  const group=(s,re)=>Array.from(s.matchAll(re),x=>x[1]);
  assert.deepEqual(group(lab,/"id": "(M[1-4]-\d{2})"/g),tests,'IDs na bancada');
  assert.deepEqual(group(preview,/i\('(M[1-4]-\d{2})'/g),tests,'IDs no avaliador de navegador');
  assert.deepEqual(group(server,/\['(M[1-4]-\d{2})',5\]/g),tests,'IDs no Apps Script');
  for(const [name,s] of [['lab',lab],['preview',preview],['server',server],['delivery',deliver],['report',report]])new Function(s);
  assert.match(lab,/ifma-mobile-a08-lab-v1/);
  assert.match(lab,/ifma-mobile-a08-host/);
  assert.match(preview,/from:'ifma-mobile-a08'/);
  assert.match(cfg,/PROD_RELEASE_ENABLED = false/);
  assert.match(cfg,/PROD_ENDPOINT = ''/);
  assert.match(server,/MOBILE_NOTAS_PROD_TEACHER_APPROVAL/);
  assert.match(server,/A08-V4-APPROVED/);
  assert.match(server,/enabled:p.getProperty\('MOBILE_NOTAS_PROD_SUBMISSIONS_ENABLED'\)==='true'/);
  assert.match(server,/1pkbf3rJD3R5-lX7TuOyfir0A4ID1m2QfUg8ZIfNOeT0/);
  assert.doesNotMatch(server,/1cPQD_ie3cEqt11fLXT398DPQIi5bnqkmTqfl9yk8a_Q/);
  assert.match(deliver,/exercicios.length!==20/);
  assert.match(report,/exercicios.length!==20/);
  assert.match(deliver,/ifma-mobile-aula08-lab-v1/);
  assert.match(report,/ifma-mobile-aula08-lab-v1/);
  console.log('PASS: contratos, 20 testes, validação das evidências e bloqueio de produção');
}
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.tsx':'text/plain;charset=utf-8','.css':'text/css;charset=utf-8','.json':'application/json'};
const server=http.createServer((req,res)=>{
  const safePath=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const p=path.resolve(root,'.'+safePath);
  if(!p.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const file=fs.existsSync(p)&&fs.statSync(p).isDirectory()?path.join(p,'index.html'):p;
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
  checkStatic();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port=server.address().port,url='http://127.0.0.1:'+port+'/'+lesson+'/';
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const issues=[];
  try {
    for(const width of [360,390,768,1024,1440]){
      const page=await browser.newPage({viewport:{width,height:width<=390?844:900}});
      page.on('pageerror',e=>issues.push(width+': '+e.message));
      await page.goto(url,{waitUntil:'domcontentloaded'});
      await page.waitForSelector('#mission-select');
      await page.waitForFunction(()=>document.querySelectorAll('#mission-select option').length===20,{timeout:25000});
      assert.equal(await page.locator('#xp-top').textContent(),'0');
      const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
      assert.ok(sizes.scroll<=sizes.width+2, 'horizontal overflow '+width+' '+JSON.stringify(sizes));
      assert.equal(await page.locator('#guide-number').count(),1);
      if(width===1440){
        await page.waitForFunction(()=>{const x=document.getElementById('compiler-status')?.textContent||'';return /execut|compil|erro|código/i.test(x)&&!x.includes('Preparando código')},{timeout:45000});
        const frame=page.frameLocator('#preview');
        await frame.locator('#web-root').waitFor({timeout:25000});
        assert.equal(await frame.locator('#mobile-root').count(),1);
        const options=await page.locator('#mission-select option').allTextContents();
        assert.equal(options.length,20);
        await page.locator('#mission-select').selectOption('M4-01');
        assert.match(await page.locator('#guide-title').textContent(),/Idempotência|toque|ID/i);
        await page.locator('#team-open').click();
        assert.equal(await page.locator('#team-dialog').evaluate(el=>el.open),true);
        await page.locator('#team-dialog [data-close-dialog]').first().click();
        assert.equal(await page.locator('#team-dialog').evaluate(el=>el.open),false);
        await page.locator('#mission-select').selectOption('M1-01');
        await page.locator('#guide-check').click();
        await page.waitForFunction(()=>/falh|erro|pendente|Esperado|Comportamento/i.test(document.querySelector('#guide-feedback')?.textContent||''),{timeout:25000});
        assert.equal(await page.locator('#xp-top').textContent(),'0','starter deve ser zero');
        const original=await page.locator('#code').inputValue();
        assert.match(original,/return 'pendente';/);
        const patched=original.replace("return 'pendente';","if (info.erro) return 'erro'; if(info.carregando)return 'carregando'; if(info.totalFonte===0)return 'vazio'; if(info.totalVisivel===0)return 'sem-resultados'; return 'pronto';");
        await page.locator('#code').fill(patched);
        await page.locator('#run').click();
        await page.waitForFunction(()=>{const x=document.querySelector('#compiler-status')?.textContent||'';return /execut|compil/i.test(x)&&!/Preparando/.test(x)},{timeout:45000});
        await page.locator('#guide-check').click();
        await page.waitForFunction(()=>document.querySelector('#xp-top')?.textContent==='5',{timeout:25000});
        console.log('PASS: correção do código, executar, conferir e pontuar 5 XP');
      }
      await page.close();
      console.log('PASS: viewport '+width);
    }
    assert.deepEqual(issues,[],'erros JS no browser');
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error('FAIL QA V4',e.stack||e);server.close();process.exitCode=1;});
