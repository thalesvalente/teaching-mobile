/* Browser E2E: ficha original -> bytes reais do PDF -> SHA-256 -> POST mock -> recibo.
 * Nunca envia nomes reais nem usa endpoint Google implantado. */
'use strict';
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const os=require('node:os');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=fs.mkdtempSync(path.join(os.tmpdir(),'mobile-e2e-'));
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const endpoint='https://script.google.com/macros/s/FAKE-MOBILE-TEST/exec';
const deployedEndpoint='https://script.google.com/macros/s/AKfycbyrvOlCl0Icm98SRNJ3SJy4gjx4Q4GH_k0EhxV50ebe93JXj_zjE8MmJ_zoGMwvNtXR/exec';
function server() {
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
    '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
  return http.createServer((req,res)=>{
    const file=decodeURIComponent((req.url||'').split('?')[0])
      .replace(/^\/teaching-mobile\//,'');
    const target=path.resolve(root,file);
    if(!target.startsWith(root+path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()){
      res.writeHead(404);res.end('Not found');return;
    }
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'text/plain'});
    res.end(fs.readFileSync(target));
  });
}
(async()=>{
  const srv=server();
  await new Promise(resolve=>srv.listen(0,'127.0.0.1',resolve));
  const port=srv.address().port;
  const address='http://127.0.0.1:'+port+
    '/teaching-mobile/lessons/aula-07-estado-filtros/atividade.html';
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({acceptDownloads:true,viewport:{width:390,height:844}});
  let count=0,mode='ok',lastPost=null,storedReceipt=null,lookups=0;
  const tests=[];
  try{
    // Com o endpoint real configurado, PDF local não aciona envio HTTP.
    // Qualquer submissão nos testes seguintes é interceptada e usa apenas mock.
    await page.goto(address,{waitUntil:'networkidle'});
    await page.locator('#score').waitFor();
    assert.equal(await page.locator('#mobile-submit').isEnabled(),true);
    const originalPdf=await Promise.all([
      page.waitForEvent('download',{timeout:15000}),
      page.locator('#pdf').click()
    ]).then(x=>x[0]);
    const localFile=path.join(out,'original.pdf');await originalPdf.saveAs(localFile);
    assert.equal(fs.readFileSync(localFile).subarray(0,8).toString('latin1'),'%PDF-1.4');
    tests.push('PDF local continua disponível sem enviar ao Google');

    await page.route('**/entrega-appscript.js?v=*',async route=>{
      const original=fs.readFileSync(path.join(root,'lessons/aula-07-estado-filtros/entrega-appscript.js'),'utf8');
      assert.ok(original.includes("const ENDPOINT = '"+deployedEndpoint+"';"));
      await route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',
        body:original.replace("const ENDPOINT = '"+deployedEndpoint+"';","const ENDPOINT = '"+endpoint+"';")});
    });
    await page.route('**/exec?receipt=*',async route=>{
      lookups++;
      const nonce=new URL(route.request().url()).searchParams.get('receipt');
      const data=storedReceipt && storedReceipt.nonce===nonce
        ? storedReceipt : {channel:'mobile-entrega-aula07',nonce,pending:true};
      const js='window.__mobileEntregaReceipt&&window.__mobileEntregaReceipt('+
        JSON.stringify(data)+');';
      await route.fulfill({status:200,contentType:'text/javascript;charset=utf-8',body:js});
    });
    await page.route(endpoint,async route=>{
      count++;
      const form=new URLSearchParams(route.request().postData()||'');
      const payload=JSON.parse(form.get('payload'));
      lastPost={form,payload};
      const source=payload.snapshot;
      const grade=source.scores.simulator.earned;
      const receipt={
        channel:'mobile-entrega-aula07',nonce:form.get('nonce'),
        ok:mode!=='reject',activity:payload.activity,
        instrument:'simulador-html',receiptId:'browser-qa-'+count,
        receivedAt:'2026-10-21T13:00:00.000Z',
        pdfSha256:mode==='bad-hash'?'f'.repeat(64):payload.pdfSha256,
        answersSha256:hash(JSON.stringify(source)),
        signature:'c'.repeat(64),grade,xp:grade*10,
        error:'Falha simulada do Apps Script'
      };
      storedReceipt=receipt;
      const html=mode==='silent-frame'
        ? '<!doctype html><title>Resposta em iframe bloqueada</title>'
        : '<!doctype html><meta charset="utf-8"><script>top.postMessage('+
          JSON.stringify(receipt)+', "*");</scr'+'ipt>';
      await route.fulfill({status:200,contentType:'text/html;charset=utf-8',body:html});
    });
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.locator('#mobile-submit').isEnabled(),true);
    await page.locator('#team').fill('Equipe QA');
    await page.locator('[data-member="0"]').fill('QA Ana');
    await page.locator('[data-member="1"]').fill('QA Bia');
    await page.locator('#cfg-prioridade').selectOption('status');
    assert.match(await page.locator('#score').innerText(),/1,0/);
    assert.match(await page.locator('#xp').innerText(),/10 \/ 100 XP/);
    const original=await Promise.all([
      page.waitForEvent('download',{timeout:15000}),
      page.locator('#pdf').click()
    ]).then(x=>x[0]);
    const originalPartial=path.join(out,'parcial-original.pdf');
    await original.saveAs(originalPartial);
    const snapshotBefore=await page.evaluate(()=>JSON.stringify(window.MobileActivity.snapshot()));
    const newPdf=await Promise.all([
      page.waitForEvent('download',{timeout:15000}),
      page.locator('#mobile-submit').click()
    ]).then(x=>x[0]);
    const newPath=path.join(out,'parcial-enviado.pdf');await newPdf.saveAs(newPath);
    await page.waitForFunction(()=>document.getElementById('mobile-delivery-status')
      .textContent.includes('ENTREGA CONFIRMADA'),{timeout:15000});
    assert.equal(count,1);
    assert.equal(lastPost.payload.schema,'mobile-a07-v1');
    assert.equal(lastPost.payload.activity,'MOBILE-AULA07-2026');
    const realHash=hash(fs.readFileSync(newPath));
    assert.equal(lastPost.payload.pdfSha256,realHash);
    assert.equal(realHash,hash(fs.readFileSync(originalPartial)),
      'Botão novo gera os mesmos bytes do PDF existente para o mesmo modelo');
    assert.equal(JSON.stringify(lastPost.payload.snapshot),snapshotBefore);
    assert.match(await page.locator('#mobile-delivery-status').innerText(),/browser-qa-1/);
    tests.push('PDF bytes idênticos + SHA-256 real + recibo');

    // Aluno pode reenviar; entrega não acumula pontos nem altera a rubrica.
    await page.locator('#cfg-prioridade').selectOption('lista');
    assert.match(await page.locator('#score').innerText(),/0,0/);
    const redelivery=await Promise.all([
      page.waitForEvent('download',{timeout:15000}),
      page.locator('#mobile-submit').click()
    ]).then(x=>x[0]);
    await redelivery.saveAs(path.join(out,'reenvio.pdf'));
    await page.waitForFunction(()=>document.getElementById('mobile-delivery-status')
      .textContent.includes('browser-qa-2'),{timeout:15000});
    assert.equal(count,2);
    assert.equal(lastPost.payload.snapshot.scores.simulator.earned,0);
    tests.push('Reenvio reduz nota para zero sem alterar atividades');

    // Reproduz a falha real: POST recebido, mas iframe sem postMessage.
    // A consulta GET recupera o recibo sem um segundo POST.
    mode='silent-frame';
    const silent=await Promise.all([
      page.waitForEvent('download',{timeout:15000}),
      page.locator('#mobile-submit').click()
    ]).then(x=>x[0]);
    await silent.saveAs(path.join(out,'sem-mensagem-iframe.pdf'));
    await page.waitForFunction(()=>document.getElementById('mobile-delivery-status')
      .textContent.includes('browser-qa-3'),{timeout:15000});
    assert.equal(count,3,'Consulta de recibo não pode reenviar a atividade');
    assert.ok(lookups>0,'Fallback GET deve consultar recibo');
    tests.push('iframe sem resposta confirma via GET, sem POST duplicado');

    // Erro real deve aparecer, ainda que o PDF local tenha sido baixado.
    mode='reject';
    const rejection=await Promise.all([
      page.waitForEvent('download',{timeout:15000}),
      page.locator('#mobile-submit').click()
    ]).then(x=>x[0]);
    await rejection.saveAs(path.join(out,'recusado.pdf'));
    await page.waitForFunction(()=>document.getElementById('mobile-delivery-status')
      .textContent.includes('ENTREGA NÃO CONFIRMADA'),{timeout:15000});
    assert.equal(count,4);
    tests.push('POST recusado não é falso sucesso');

    mode='bad-hash';
    const invalid=await Promise.all([
      page.waitForEvent('download',{timeout:15000}),
      page.locator('#mobile-submit').click()
    ]).then(x=>x[0]);
    await invalid.saveAs(path.join(out,'adulterado.pdf'));
    await page.waitForFunction(()=>document.getElementById('mobile-delivery-status')
      .textContent.includes('ENTREGA NÃO CONFIRMADA'),{timeout:15000});
    assert.equal(count,5);
    tests.push('Recibo com hash diferente é rejeitado');

    // Fallback para caractere indisponível: não há bytes e não há POST.
    await page.locator('#team').fill('Equipe 🧪');
    const before=count;
    await page.locator('#mobile-submit').click();
    await page.waitForFunction(()=>document.getElementById('mobile-delivery-status')
      .textContent.includes('nenhuma entrega online foi enviada'),{timeout:15000});
    assert.equal(count,before);
    tests.push('Fallback de impressão não fabrica hash nem entrega');

    for(const width of [320,390,768,1280]){
      await page.setViewportSize({width,height:850});
      const dimension=await page.evaluate(()=>({
        doc:document.documentElement.scrollWidth,viewport:window.innerWidth
      }));
      assert.ok(dimension.doc<=dimension.viewport+1,
        'Overflow horizontal em '+width+': '+JSON.stringify(dimension));
    }
    const a11y=await page.evaluate(()=>({
      role:document.getElementById('mobile-delivery-status').getAttribute('role'),
      live:document.getElementById('mobile-delivery-status').getAttribute('aria-live'),
      disabled:document.getElementById('mobile-submit').disabled
    }));
    assert.equal(a11y.role,'status');assert.equal(a11y.live,'polite');
    tests.push('320/390/768/1280 px sem overflow + mensagem aria-live');
    await page.locator('#mobile-submit').focus();
    assert.equal(await page.evaluate(()=>document.activeElement.id),'mobile-submit');
    await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
    const violations=await page.evaluate(async()=>{
      const result=[];
      for(const id of ['mobile-submit','mobile-delivery-status']){
        const node=document.getElementById(id);
        const scan=await window.axe.run(node,{runOnly:{
          type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']
        }});
        result.push(...scan.violations.map(v=>({id:v.id,impact:v.impact,target:id})));
      }
      return result;
    });
    assert.deepEqual(violations,[]);
    tests.push('Foco por teclado e axe-core WCAG 2.2 AA nos controles novos');
    // Falta de URL: botão continua bloqueado e exportação PDF não depende do endpoint.
    await page.unroute('**/entrega-appscript.js?v=*');
    await page.route('**/entrega-appscript.js?v=*',async route=>{
      const original=fs.readFileSync(path.join(root,'lessons/aula-07-estado-filtros/entrega-appscript.js'),'utf8');
      await route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',
        body:original.replace("const ENDPOINT = '"+deployedEndpoint+"';","const ENDPOINT = '';")});
    });
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.locator('#mobile-submit').isDisabled(),true);
    const pdfWithoutEndpoint=await Promise.all([
      page.waitForEvent('download',{timeout:15000}),page.locator('#pdf').click()
    ]).then(x=>x[0]);
    await pdfWithoutEndpoint.saveAs(path.join(out,'sem-endpoint.pdf'));
    assert.ok(fs.readFileSync(path.join(out,'sem-endpoint.pdf')).subarray(0,8).toString('latin1')==='%PDF-1.4');
    tests.push('Fallback sem endpoint bloqueia envio e mantém PDF');
    for(const name of tests)console.log('PASS',name);
    console.log('BROWSER MOBILE: '+tests.length+'/'+tests.length+' PASS');
  } finally {
    await browser.close();await new Promise(resolve=>srv.close(resolve));
    fs.rmSync(out,{recursive:true,force:true});
  }
})().catch(error=>{console.error('BROWSER MOBILE: FAIL',error.stack);process.exitCode=1;});
