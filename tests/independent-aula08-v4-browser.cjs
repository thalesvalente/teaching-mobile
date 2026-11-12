/** C3 independent browser/security/accessibility review. Synthetic data only.
 * npm ci && npx playwright install chromium
 * node tests/independent-aula08-v4-browser.cjs
 * C3_ARTIFACT_DIR defaults to .artifacts/c3-aula08-v4.
 * C3_BROWSER=chromium|firefox|webkit; PDF generation requires Chromium.
 * This is NOT a connected Google QA submission or native Android/iOS test.
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const playwright = require('playwright');
const {createFixture}=require('./mobile-aula08-v4-fixture.cjs');
const root = path.resolve(__dirname, '..');
const lesson = 'lessons/aula-08-av1-incremento-1/laboratorio-vivo';
const out = path.resolve(root, process.env.C3_ARTIFACT_DIR || '.artifacts/c3-aula08-v4');
const engine = process.env.C3_BROWSER || 'chromium';
fs.mkdirSync(out, {recursive:true});
const report = {reviewer:'C3 independent QA',scope:'local browser and synthetic data; Google/native NOT_RUN',
  sha:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
  triggerSha:process.env.GITHUB_SHA || null,
  engine,checks:[],errors:[],unexpectedExternalRequests:[],probes:[]};
const mime = {'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8',
  '.tsx':'text/plain;charset=utf-8','.css':'text/css;charset=utf-8','.json':'application/json'};
const server = http.createServer((req,res)=>{
  const url = new URL(req.url,'http://localhost');
  if(url.pathname === '/c3-synthetic-probe') {
    report.probes.push(url.searchParams.get('channel'));
    res.writeHead(200,{'Access-Control-Allow-Origin':'*','Content-Type':'text/javascript'});
    res.end('/* synthetic probe only */');return;
  }
  const parsed = path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!parsed.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const file=fs.existsSync(parsed)&&fs.statSync(parsed).isDirectory()?path.join(parsed,'index.html'):parsed;
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function check(id,fn) {
  try {const details=await fn();report.checks.push({id,status:'PASS',...(details===undefined?{}:{details})});console.log('PASS C3 '+id);}
  catch(error){report.checks.push({id,status:'FAIL',message:String(error.stack||error)});console.error('FAIL C3 '+id+': '+error.message);}
}
async function compiled(page) {
  await page.waitForFunction(()=>document.querySelector('#compiler-status')?.textContent.includes('Executado'),null,{timeout:45000});
}
async function closeDialogs(page){await page.evaluate(()=>document.querySelectorAll('dialog[open]').forEach(x=>x.close()));}
async function runSource(page,source){await page.locator('#code').fill(source);await page.locator('#run').click();}
let browser;
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  assert.ok(playwright[engine],'Unsupported browser engine');
  browser=await playwright[engine].launch({headless:true,
    ...(engine==='chromium'&&process.env.C3_CHROMIUM_EXECUTABLE?{executablePath:process.env.C3_CHROMIUM_EXECUTABLE}:{})});
  report.browserVersion=browser.version();
  async function pageFor(width){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    await page.route('**/*',route=>{
      const u=route.request().url();
      if(u.startsWith(origin+'/')||u.startsWith('data:')||u.startsWith('blob:'))return route.continue();
      report.unexpectedExternalRequests.push({width,url:u.split('?')[0]});return route.abort();
    });
    page.on('pageerror',e=>report.errors.push({width,message:e.message}));
    page.on('dialog',d=>d.accept());
    await page.goto(origin+'/'+lesson+'/',{waitUntil:'domcontentloaded'});
    await compiled(page);return page;
  }
  for(const width of [360,390,768,1024,1440]){
    const page=await pageFor(width);
    await check('reflow-'+width,async()=>{
      const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(size.scroll<=size.width+2,JSON.stringify(size));
      assert.equal(await page.locator('#mission-select option').count(),20);
      await page.screenshot({path:path.join(out,'viewport-'+width+'.png'),fullPage:true});return size;
    });
    await check('axe-main-'+width,async()=>{
      await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
      const result=await page.evaluate(async()=>{
        const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});
        return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),
          incomplete:r.incomplete.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}))};
      });
      fs.writeFileSync(path.join(out,'axe-'+width+'.json'),JSON.stringify(result,null,2)+'\n');
      assert.deepEqual(result.violations,[],'Automated accessibility violations');
      return {violations:0,incomplete:result.incomplete.length,note:'Incomplete checks require human review; opaque iframe not covered.'};
    });
    await page.close();
  }
  const page=await pageFor(1440);
  const original=await page.locator('#code').inputValue();
  await check('opaque-sandbox-parent-isolation',async()=>{
    assert.equal(await page.locator('#preview').getAttribute('sandbox'),'allow-scripts');
    const frame=page.frames().find(f=>/preview\.html/.test(f.url()));assert.ok(frame);
    const result=await frame.evaluate(()=>{try{void parent.document.title;return {blocked:false};}catch(e){return {blocked:true,name:e.name};}});
    assert.equal(result.blocked,true);assert.equal(result.name,'SecurityError');return result;
  });
  await check('forged-peer-message-ignored',async()=>{
    const before=await page.locator('#xp-top').textContent();
    await page.evaluate(()=>window.dispatchEvent(new MessageEvent('message',{source:window,origin:location.origin,
      data:{from:'ifma-mobile-a08',type:'CHECKED',token:'forged',revision:0,runId:1,stage:'M1-01',ok:true}})));
    await pause(150);assert.equal(await page.locator('#xp-top').textContent(),before);
  });
  await check('keyboard-dialog-focus',async()=>{
    await page.locator('#team-open').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#team-dialog').evaluate(x=>x.open),true);
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.getElementById('team-dialog').contains(document.activeElement)),true);
    const focus=await page.evaluate(()=>{const s=getComputedStyle(document.activeElement);return {outlineStyle:s.outlineStyle,outlineWidth:s.outlineWidth,boxShadow:s.boxShadow};});
    assert.ok((focus.outlineStyle!=='none'&&parseFloat(focus.outlineWidth)>0)||focus.boxShadow!=='none','No visible focus indicator');
    await page.keyboard.press('Escape');assert.equal(await page.locator('#team-dialog').evaluate(x=>x.open),false);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'team-open');return focus;
  });
  await check('student-network-apis-rejected-and-csp-connect-image',async()=>{
    const probe=origin+'/c3-synthetic-probe?channel=';
    const malicious=original+'\nfetch('+JSON.stringify(probe+'fetch')+').catch(()=>{});\n'+
      'const c3image=new Image();c3image.src='+JSON.stringify(probe+'image')+';\n'+
      'try{navigator.sendBeacon('+JSON.stringify(probe+'beacon')+',"synthetic")}catch{};\n'+
      'const c3script=document.createElement("script");c3script.src='+JSON.stringify(probe+'script')+';document.body.appendChild(c3script);\n';
    await runSource(page,malicious);await pause(700);
    assert.match(await page.locator('#compiler-status').textContent(),/erro|fora do contrato|bloquead/i,'Compiler must reject ambient network APIs');
    // Exercise CSP independently of compiler rejection. This controlled probe is
    // evaluated in the child only; it never carries user information or secrets.
    const frame=page.frames().find(f=>/preview\.html/.test(f.url()));assert.ok(frame);
    await frame.evaluate(url=>{
      fetch(url+'csp-fetch').catch(()=>{});
      const img=new Image();img.src=url+'csp-image';
      try{navigator.sendBeacon(url+'csp-beacon','synthetic');}catch{}
    },probe);
    await pause(500);
    assert.deepEqual(report.probes,[],'CSP allowed connect/image network request');
    return {probeCount:report.probes.length,status:await page.locator('#compiler-status').textContent(),
      scope:'Compiler denies ambient network APIs; independent CSP connect-src/img-src check. Required local script loads are allowed by script-src.'};
  });
  await check('syntax-error-and-recovery',async()=>{
    await runSource(page,'export default function Broken( {');
    await page.waitForFunction(()=>/erro|falh|syntax/i.test(document.querySelector('#compiler-status')?.textContent||''),null,{timeout:10000});
    assert.equal(await page.locator('#run').isEnabled(),true);
    await runSource(page,original);await compiled(page);
    assert.equal(await page.locator('#guide-check').isEnabled(),true);
  });
  await check('loop-budget-and-recovery',async()=>{
    await runSource(page,original+'\nwhile(true){}\n');
    await page.waitForFunction(()=>/erro|limite|tempo|interromp/i.test(document.querySelector('#compiler-status')?.textContent||''),null,{timeout:12000});
    assert.equal(await page.locator('#run').isEnabled(),true);
    const error=await page.locator('#compiler-status').textContent();
    await runSource(page,original);await compiled(page);return {error,limit:'Common instrumented loops; not a hostile-code CPU/RAM guarantee.'};
  });
  await check('checkpoint-export-import-and-malformed-rejection',async()=>{
    await page.locator('#mission-select').selectOption('M3-02');
    const downloadPromise=page.waitForEvent('download');await page.locator('#save-progress').click();
    const download=await downloadPromise;const target=path.join(out,'continuar-depois-ficticio.json');await download.saveAs(target);
    const saved=JSON.parse(fs.readFileSync(target,'utf8'));
    assert.equal(saved.schema,'ifma-mobile-aula08-checkpoint-v1');assert.equal(saved.code,original);assert.equal(saved.activeTask,'M3-02');
    await page.locator('#code').fill(original+'\n// synthetic modification');
    await page.locator('#progress-file').setInputFiles({name:'malformed.json',mimeType:'application/json',buffer:Buffer.from('{bad')});
    await page.waitForFunction(()=>/malformado|sintaxe/i.test(document.querySelector('#progress-status')?.textContent||''));
    assert.equal(await page.locator('#code').inputValue(),original+'\n// synthetic modification');
    await page.locator('#progress-file').setInputFiles(target);
    await page.waitForFunction(()=>/retomado/i.test(document.querySelector('#progress-status')?.textContent||''));
    assert.equal(await page.locator('#code').inputValue(),original);await compiled(page);
    return {schema:saved.schema,xp:saved.xp,codeBytes:Buffer.byteLength(saved.code)};
  });
  await check('pdf-partial-mobile-identity-and-20-missions',async()=>{
    await closeDialogs(page);await page.locator('#team-open').click();await page.locator('#web-team').fill('Equipe Fictícia QA');
    await page.keyboard.press('Escape');
    await page.evaluate(()=>{window.print=()=>{};});
    assert.equal(await page.evaluate(()=>window.WebLabEvidence.printPartial()),true);
    const content=await page.locator('#print-report').textContent();
    assert.match(content,/Mobile|Dispositivos Móveis/i);assert.doesNotMatch(content,/INF031|WEB-A05|Desenvolvimento (?:de Sistemas )?Web/);
    assert.equal(await page.locator('#print-report .doc-mission-row').count(),20);
    assert.equal(await page.locator('#print-report .doc-cycle-row').count(),4);
    assert.match(content,/não (?:constitui|equivalem|é)|NÃO são|pendente/i);
    fs.writeFileSync(path.join(out,'pdf-text.txt'),content,'utf8');
    if(engine==='chromium'){
      await page.pdf({path:path.join(out,'exemplo-ficticio-a4.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});
      return {missions:20,cycles:4,pdf:'exemplo-ficticio-a4.pdf'};
    }
    return {missions:20,cycles:4,pdf:'NOT_RUN: page.pdf requires Chromium'};
  });
  await check('production-off-no-external-request',async()=>{
    const cfg=await page.evaluate(()=>({endpoint:window.WebEntregaConfig.endpoint,activated:window.WebEntregaConfig.activated}));
    assert.equal(cfg.endpoint,'');assert.equal(cfg.activated,false);
    await closeDialogs(page);await page.locator('#quick-pdf').click();
    await page.waitForFunction(()=>/ENVIO NÃO REALIZADO/i.test(document.querySelector('#web-delivery-status')?.textContent||''));
    assert.deepEqual(report.unexpectedExternalRequests,[]);return cfg;
  });
  await check('matricula-not-silently-persisted',async()=>{
    await closeDialogs(page);await page.locator('#team-open').click();
    const synthetic='00000000.ITA0001';await page.locator('#web-member-0-enrollment').fill(synthetic);
    await page.keyboard.press('Escape');
    await page.locator('#code').fill(original+'\n// save synthetic session');
    const stored=await page.evaluate(()=>JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)]))));
    assert.equal(stored.includes(synthetic),false,'Enrollment present in automatic persistence');
  });
  await check('reduced-motion-and-320-reflow',async()=>{
    await closeDialogs(page);await page.setViewportSize({width:320,height:900});
    const result=await page.evaluate(()=>({reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.equal(result.reduced,true);assert.ok(result.scroll<=result.width+2,JSON.stringify(result));
    await page.screenshot({path:path.join(out,'reflow-320.png'),fullPage:true});return result;
  });
  await page.close();
  // Exact frontend/backend contract through an intercepted HtmlService transport.
  // The URL below is deliberately fictitious. No request reaches Google.
  for(const scenario of ['normal','tampered-response-signature','timeout-after-write']){
    await check('simulated-interface-backend-'+scenario,async()=>{
      const f=createFixture();f.props.MOBILE_NOTAS_QA_ALLOWED_ORIGIN=origin;
      const endpoint='https://script.google.com/macros/s/C3_SYNTHETIC_QA_ONLY/exec';
      const operations=[],responses=[],outside=[];
      const qa=await browser.newPage({viewport:{width:1440,height:1000}});
      qa.on('pageerror',e=>report.errors.push({scope:scenario,message:e.message}));
      qa.on('dialog',d=>d.accept());
      await qa.route('**/*',async route=>{
        const req=route.request(),url=new URL(req.url());
        if(req.url().startsWith(origin+'/'))return route.continue();
        if(url.origin+url.pathname!==endpoint){outside.push(req.url().split('?')[0]);return route.abort();}
        if(req.method()==='GET'){
          const result=f.scope.doGet({parameter:Object.fromEntries(url.searchParams)}).content;
          return route.fulfill({status:200,contentType:'text/html;charset=utf-8',body:result});
        }
        const params=new URLSearchParams(req.postData()||'');
        const payload=JSON.parse(params.get('payload')),nonce=params.get('nonce');
        operations.push({operation:payload.operation,nonce});
        const result=f.post(payload,nonce);responses.push(result);
        if(payload.operation==='submitTeam'&&scenario==='timeout-after-write'){
          return route.fulfill({status:200,contentType:'text/html;charset=utf-8',body:'<!doctype html><p>Synthetic lost response after committed write.</p>'});
        }
        const response=payload.operation==='submitTeam'&&scenario==='tampered-response-signature'
          ? {...result,signature:'f'.repeat(64)}:result;
        const safe=JSON.stringify(response).replace(/</g,'\\u003c');
        return route.fulfill({status:200,contentType:'text/html;charset=utf-8',
          body:'<!doctype html><script>top.postMessage('+safe+','+JSON.stringify(origin)+');</script>'});
      });
      try{
        await qa.goto(origin+'/'+lesson+'/?qa=1');await compiled(qa);
        const code=await qa.locator('#code').inputValue();
        await qa.locator('#team-open').click();
        await qa.locator('#qa-appscript-url').fill(endpoint);await qa.locator('#qa-endpoint-activate').click();
        await qa.waitForFunction(()=>document.getElementById('qa-endpoint-status')?.textContent.includes('QA conectada'));
        await qa.locator('#web-team').fill('Equipe C3 Sintética');
        await qa.locator('#web-member-0-enrollment').fill('00000000.ITA0001');
        await qa.locator('#web-member-0-lookup').click();
        await qa.locator('#web-member-0-confirm').check();await qa.locator('#team-done').click();
        await qa.evaluate(()=>{window.print=()=>{};});
        await qa.locator('#quick-pdf').click();
        if(scenario==='normal'){
          await qa.waitForFunction(()=>document.getElementById('web-delivery-status')?.textContent.includes('EVIDÊNCIAS RECEBIDAS E RECONCILIADAS'),null,{timeout:25000});
        }else{
          await qa.waitForFunction(()=>document.getElementById('web-delivery-status')?.textContent.includes('ENVIO NÃO CONFIRMADO'),null,{timeout:55000});
          if(scenario==='tampered-response-signature')assert.match(await qa.locator('#web-delivery-status').textContent(),/Readback divergiu/);
          if(scenario==='timeout-after-write')assert.match(await qa.locator('#web-delivery-status').textContent(),/Sem confirmação/);
          assert.equal(await qa.locator('#web-reconcile').isEnabled(),true);
          await qa.locator('#web-reconcile').click();
          await qa.waitForFunction(()=>document.getElementById('web-delivery-status')?.textContent.includes('ENTREGA RECONCILIADA'),null,{timeout:25000});
        }
        assert.deepEqual(outside,[],'Unexpected external request escaped the simulated transport');
        const submit=operations.filter(x=>x.operation==='submitTeam'),reconcile=operations.filter(x=>x.operation==='reconcileTeam');
        assert.equal(submit.length,1);assert.ok(reconcile.length>=1);
        assert.ok(reconcile.every(x=>x.nonce===submit[0].nonce),'Reconciliation must reuse the original request id');
        const receipt=responses.find(r=>r.receiptId);assert.ok(receipt);
        assert.equal(receipt.version,'mobile-notas-4.1.0');assert.equal(receipt.officialGrade,null);assert.equal(receipt.gradeReceived,null);
        assert.equal(receipt.status,'PENDENTE_VALIDACAO');assert.equal(receipt.signatureVerified,true);
        assert.equal(receipt.codeSha256,crypto.createHash('sha256').update(code).digest('hex'));
        assert.equal(f.calls.writes.length,1);assert.equal(f.tabs.Auditoria.rows.length,2);
        assert.equal(f.tabs.Resultados.rows.length,1);assert.equal(f.tabs['4º Bimestre'].rows.length,1);
        const summary={mode:'SIMULATED_HTTP_AND_IN_MEMORY_SHEETS_NOT_CONNECTED_GOOGLE',scenario,
          operations:operations.map(x=>x.operation),sameRequestId:true,writes:1,version:receipt.version,
          grade:null,status:receipt.status,codeSha256:receipt.codeSha256};
        fs.writeFileSync(path.join(out,'simulated-contract-'+scenario+'.json'),JSON.stringify(summary,null,2)+'\n');
        return summary;
      }finally{await qa.close();}
    });
  }
  await check('no-unhandled-page-errors',()=>assert.deepEqual(report.errors,[]));
})().catch(error=>{
  report.checks.push({id:'browser-harness',status:'FAIL',message:String(error.stack||error)});console.error(error.stack||error);
}).finally(async()=>{
  if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));
  report.summary={pass:report.checks.filter(x=>x.status==='PASS').length,fail:report.checks.filter(x=>x.status==='FAIL').length};
  fs.writeFileSync(path.join(out,'independent-browser-report.json'),JSON.stringify(report,null,2)+'\n');
  if(report.summary.fail)process.exitCode=1;
  console.log(JSON.stringify(report.summary));
});
