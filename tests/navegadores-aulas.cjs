/* QA integrado. Configure AULAS_URL, QA_PLAYWRIGHT, QA_AXE e os executáveis
   QA_CHROMIUM/QA_FIREFOX/QA_WEBKIT se não usar os browsers do Playwright. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const pw = require(process.env.QA_PLAYWRIGHT || 'playwright');
const axe = process.env.QA_AXE || require.resolve('axe-core/axe.min.js');
const base = (process.env.AULAS_URL || 'http://127.0.0.1:18976/teaching-mobile/').replace(/\/?$/, '/');
const out = path.resolve(process.env.QA_OUTPUT_DIR || 'qa-output');
const engines = (process.env.QA_ENGINES || 'chromium,firefox,webkit').split(',');
const paths = {
  aula06: 'lessons/Aula_06_Mobile_Navegacao_Formularios.html',
  ficha06: 'lessons/aula-06-navegacao-formularios/atividade.html',
  aula07: 'lessons/aula-07-estado-filtros/',
  ficha07: 'lessons/aula-07-estado-filtros/atividade.html'
};
const report = { matrix: [], interactions: [], versions: {}, failures: [] };
fs.mkdirSync(out, { recursive: true });
async function check(name, action) {
  try { const detail = await action(); report.interactions.push({ name, status: 'PASS', detail }); console.log('PASS', name); }
  catch (error) { report.failures.push({ name, message: error.message }); console.error('FAIL', name, error.message); }
}
async function launch(engine) {
  const options = { headless: true };
  const executablePath = process.env['QA_' + engine.toUpperCase()];
  if (executablePath) options.executablePath = executablePath;
  if (engine === 'webkit' && process.env.QA_WEBKIT_ENV) options.env = { ...process.env, ...JSON.parse(process.env.QA_WEBKIT_ENV) };
  return pw[engine].launch(options);
}
async function a11y(page) {
  await page.addScriptTag({ path: axe });
  return page.evaluate(async () => {
    const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } });
    return result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }));
  });
}
async function download(page, selector, filename) {
  const promise = page.waitForEvent('download');
  await page.locator(selector).click();
  const d = await promise;
  await d.saveAs(path.join(out, filename));
  assert.equal(await d.failure(), null);
}
async function fiche(page, lesson, engine) {
  const prefix = `${engine}-ficha${lesson}`;
  await page.goto(base + paths['ficha' + lesson]);
  // Uma data opcional fora do intervalo não pode produzir uma cópia ilegível.
  await page.locator('#date').fill('2200-01-01');
  const dated = await page.evaluate(() => {
    const copy = MobileActivity.snapshot();
    MobileActivity.restore(copy);
    return copy.date;
  });
  assert.equal(dated, '');
  await page.locator('#date').fill('');
  const empty = await page.evaluate(() => MobileActivity.model());
  assert.equal(empty.score, '0,0 / 10,0');
  assert.equal(empty.members[0], 'Não informado');
  assert.equal(empty.partial, true);
  if (engine === 'chromium') await download(page, '#pdf', prefix + '-vazia.pdf');

  await page.locator(lesson === '06' ? '#cfg-list' : '#cfg-prioridade').selectOption(lesson === '06' ? 'index' : 'status');
  const expected = lesson === '06' ? '0,5 / 10,0' : '1,0 / 10,0';
  assert.equal(await page.locator('#score').textContent(), expected);
  await page.locator('#nativeStatus').selectOption('executado');
  const before = await page.evaluate(() => JSON.stringify(MobileActivity.snapshot()));
  await download(page, '#pdf', prefix + '-parcial.pdf');
  assert.equal(await page.locator('#score').textContent(), expected);
  assert.equal(await page.evaluate(() => JSON.stringify(MobileActivity.snapshot())), before);
  const m = await page.evaluate(() => MobileActivity.model());
  assert.equal(m.score, expected);
  assert.ok(JSON.stringify(m).includes('Evidências pendentes'));
  assert.ok(JSON.stringify(m).includes('Não respondido'));

  const popupPromise = page.context().waitForEvent('page');
  await page.locator('#printReport').click();
  const printable = await popupPromise;
  await printable.waitForLoadState();
  assert.ok((await printable.locator('body').innerText()).includes('Nota formativa do simulador: ' + expected));
  if (engine === 'chromium') await printable.pdf({ path: path.join(out, prefix + '-impressao.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
  await printable.close();
  assert.equal(await page.evaluate(() => JSON.stringify(MobileActivity.snapshot())), before);
  // O PDF direto usa fonte limitada: a alternativa nativa deve conservar Unicode.
  await page.locator('[data-member="0"]').fill('Equipe didática Ω');
  const unicodeBefore = await page.evaluate(() => JSON.stringify(MobileActivity.snapshot()));
  const unicodePopupPromise = page.context().waitForEvent('page');
  await page.locator('#pdf').click();
  const unicodePrint = await unicodePopupPromise;
  await unicodePrint.waitForLoadState();
  assert.ok((await unicodePrint.locator('body').innerText()).includes('Equipe didática Ω'));
  assert.ok((await unicodePrint.locator('body').innerText()).includes('Nota formativa do simulador: ' + expected));
  if (engine === 'chromium') await unicodePrint.pdf({ path: path.join(out, prefix + '-unicode.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
  await unicodePrint.close();
  assert.equal(await page.evaluate(() => JSON.stringify(MobileActivity.snapshot())), unicodeBefore);
  await page.locator('[data-member="0"]').fill('');
  if (engine === 'chromium') {
    await page.pdf({ path: path.join(out, prefix + '-ctrl-p.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
    assert.equal(await page.evaluate(() => JSON.stringify(MobileActivity.snapshot())), before);
    assert.equal(await page.locator('#print-snapshot').isVisible(), false);
  }

  await download(page, '#json', prefix + '-parcial.json');
  const exported = JSON.parse(fs.readFileSync(path.join(out, prefix + '-parcial.json'), 'utf8'));
  exported.scores.simulator.earned = 999;
  await page.evaluate(data => MobileActivity.restore(data), exported);
  assert.equal(await page.locator('#score').textContent(), expected);
  const stable = await page.evaluate(() => JSON.stringify(MobileActivity.snapshot()));
  const rejected = await page.evaluate(() => { try { const copy = MobileActivity.snapshot(); copy.members = []; MobileActivity.restore(copy); return false; } catch { return true; } });
  assert.equal(rejected, true);
  assert.equal(await page.evaluate(() => JSON.stringify(MobileActivity.snapshot())), stable);

  await page.locator('[data-practice="1"]').check();
  await page.locator('[data-practice-evidence="0"]').fill('Cenário didático executado. Evidência de teste, sem dados reais.');
  assert.equal(await page.locator('#practiceScore').textContent(), '0,5 / 10,0');
  await page.locator('#project').selectOption(lesson === '06' ? 'acoes' : 'eda');
  assert.equal(await page.locator('#practiceScore').textContent(), '0,0 / 10,0');
  assert.equal(await page.locator('[data-practice-evidence="0"]').inputValue(), '');
  await page.locator('#project').selectOption('memorias');
  assert.equal(await page.locator('#practiceScore').textContent(), '0,5 / 10,0');
  assert.ok((await page.locator('[data-practice-evidence="0"]').inputValue()).includes('Cenário didático'));

  // O máximo e a exclusão de resposta também passam pela UI real.
  await page.evaluate(lesson => {
    const copy = MobileActivity.snapshot();
    copy.choice = { ...(lesson === '06' ? Mobile6.GOOD : Aula7.GOOD) };
    MobileActivity.restore(copy);
  }, lesson);
  assert.equal(await page.locator('#score').textContent(), '10,0 / 10,0');
  await page.locator(lesson === '06' ? '#cfg-list' : '#cfg-prioridade').selectOption('');
  assert.notEqual(await page.locator('#score').textContent(), '10,0 / 10,0');
  await page.locator('#testStage').click();
  assert.equal(await page.locator('#score').textContent(), (await page.evaluate(() => MobileActivity.model())).score);
  return { empty: '0/10', partial: expected, exportPreservedState: true, unicodePrint: true, optionalDateRoundTrip: true, forgedScoreIgnored: true, separateProjectEvidence: true, full: '10/10' };
}
async function lecture(page, lesson, engine) {
  await page.goto(base + paths['aula' + lesson]);
  // Trocar de modo e redimensionar não pode enviar a leitura ao início.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(lesson => {
    const controller = lesson === '06' ? deck : Aula7Deck;
    controller.setReading(false);
    controller.show(20);
  }, lesson);
  await page.locator('#readingBtn').click();
  await page.waitForFunction(() => document.body.classList.contains('reading') && Math.abs(document.querySelector('#s21').getBoundingClientRect().top) < 40);
  await page.evaluate(lesson => (lesson === '06' ? deck : Aula7Deck).setReading(false), lesson);
  await page.setViewportSize({ width: 800, height: 900 });
  await page.waitForFunction(() => document.body.classList.contains('reading') && Math.abs(document.querySelector('#s21').getBoundingClientRect().top) < 40);
  assert.equal(await page.evaluate(lesson => (lesson === '06' ? deck : Aula7Deck).current, lesson), 20);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#gameBtn').click();
  const first = lesson === '06' ? 'rota' : 'estado';
  const second = lesson === '06' ? 'nav' : 'colecao';
  await page.locator(`input[name="game-${first}"][value="${lesson === '06' ? 0 : 1}"]`).check();
  await page.locator(`input[name="game-${second}"][value="${lesson === '06' ? 0 : 1}"]`).check();
  assert.equal(await page.locator('#lectureScore').textContent(), '1,0 / 10');
  assert.ok((await page.locator('#lectureProgressText').textContent()).includes('8 pendentes'));
  await page.locator(`[data-game-clear="${first}"]`).click();
  assert.equal(await page.locator('#lectureScore').textContent(), '0,0 / 10');
  await page.locator(`input[name="game-${first}"][value="${lesson === '06' ? 0 : 1}"]`).check();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#gameDialog').isVisible(), false);
  assert.equal(await page.locator('#gameBtn').evaluate(el => el === document.activeElement), true);
  const snapshot = () => page.evaluate(lesson => {
    const game = lesson === '06' ? deck.game : Aula7Deck.game;
    return { answers: game.answers, score: game.score(), hiddenAnswers: [...document.querySelectorAll('.slide .answer')].map(el => el.hidden), inputs: [...document.querySelectorAll('.slide input')].map(el => el.value), aria: [...document.querySelectorAll('.slide')].map(el => el.getAttribute('aria-hidden')) };
  }, lesson);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(lesson => (lesson === '06' ? deck : Aula7Deck).setReading(false), lesson);
  const before = await snapshot();
  assert.ok(before.aria.some(value => value === 'true'));
  const hiddenInPrint = await page.evaluate(() => {
    dispatchEvent(new Event('beforeprint'));
    return document.querySelectorAll('.slide[aria-hidden="true"]').length;
  });
  assert.equal(hiddenInPrint, 0);
  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
  assert.deepEqual(await snapshot(), before);
  if (engine === 'chromium') {
    await page.pdf({ path: path.join(out, `${engine}-aula${lesson}-parcial.pdf`), format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
  } else {
    await page.evaluate(() => { dispatchEvent(new Event('beforeprint')); dispatchEvent(new Event('afterprint')); });
  }
  assert.deepEqual(await snapshot(), before);
  assert.ok((await page.locator('#lectureReport').textContent()).includes('Nota atual: 1,0 / 10'));
  assert.ok((await page.locator('#lectureReport').textContent()).includes('Não respondida'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#gameBtn').click();
  const violations = await a11y(page);
  assert.deepEqual(violations, []);
  return { grade: '1/10', answered: 2, pending: 8, readingPreservedPosition: true, printPreservedState: true, allSlidesExposedInPrint: true, keyboardDialog: true, quizAxe: violations.length };
}

(async () => {
  for (const engine of engines) {
    const browser = await launch(engine);
    report.versions[engine] = browser.version();
    for (const [name, url] of Object.entries(paths)) {
      for (const viewport of [{ width: 320, height: 800 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1280, height: 900 }, { width: 1920, height: 1080 }, { width: 844, height: 390 }]) {
        const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(base + url);
        const geometry = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, reading: document.body.classList.contains('reading') }));
        const violations = viewport.width === 320 ? await a11y(page) : [];
        const pass = errors.length === 0 && geometry.scroll <= geometry.width + 1 && violations.length === 0;
        report.matrix.push({ engine, name, viewport, geometry, errors, violations, pass });
        if (!pass) report.failures.push({ name: `${engine}/${name}/${viewport.width}x${viewport.height}`, errors, geometry, violations });
        if (engine === 'chromium' && [390, 1280].includes(viewport.width)) await page.screenshot({ path: path.join(out, `${name}-${viewport.width}.png`) });
        await page.close();
      }
    }
    for (const lesson of ['06', '07']) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('dialog', dialog => dialog.accept());
      await check(`${engine}/ficha${lesson}: parcial, PDF, JSON, prática, retorno`, () => fiche(page, lesson, engine));
      await check(`${engine}/aula${lesson}: quiz, nota, impressão e teclado`, () => lecture(page, lesson, engine));
      await context.close();
    }
    await browser.close();
    fs.writeFileSync(path.join(out, 'validacao.json'), JSON.stringify(report, null, 2));
  }
  fs.writeFileSync(path.join(out, 'validacao.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ matrix: report.matrix.length, matrixPassed: report.matrix.filter(r => r.pass).length, flows: report.interactions.length, failures: report.failures }, null, 2));
  if (report.failures.length) process.exitCode = 1;
})().catch(e => { console.error(e); fs.writeFileSync(path.join(out, 'validacao.json'), JSON.stringify({ ...report, fatal: e.message }, null, 2)); process.exitCode = 1; });
