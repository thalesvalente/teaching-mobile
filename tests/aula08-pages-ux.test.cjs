'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '../lessons/aula-08-av1-incremento-1');
const pages = ['index.html', 'comecar.html', 'missoes.html', 'gemini.html', 'atividade.html'];

test('páginas didáticas com navegação consistente e sem links Markdown', () => {
  for (const name of pages) {
    const html = fs.readFileSync(path.join(root, name), 'utf8');
    assert.match(html, /<html lang="pt-BR">/);
    assert.match(html, /class="skip-link"/);
    assert.match(html, /<main[^>]*id="conteudo"/);
    assert.match(html, /aria-label="Navegação da Aula 08"/);
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1, name);
    for (const page of pages) assert.match(html, new RegExp('href="' + page.replace('.', '\\.') + '"'));
    assert.doesNotMatch(html, /href="[^"]+\.md"/i, name + ' não deve abrir Markdown');
  }
});

test('entrega tem uma ação primária e contingência por divulgação progressiva', () => {
  const html = fs.readFileSync(path.join(root, 'atividade.html'), 'utf8');
  assert.match(html, /<button id="submit-delivery"[^>]*>Avaliar e enviar<\/button>/);
  assert.match(html, /<details id="local-options"[\s\S]*?<summary>Precisa guardar uma cópia sem enviar\?<\/summary>/);
  assert.match(html, /<button id="local-pdf"[^>]*type="button"/);
  assert.match(html, /<button id="print-local"[^>]*type="button"/);
  assert.match(html, /aria-describedby="action-hint"/);
  assert.ok(html.indexOf('aria-labelledby="importar"') < html.indexOf('aria-labelledby="identificacao"'));
});

test('guia, critérios e prompts estão no HTML e não dependem de README.md', () => {
  const start = fs.readFileSync(path.join(root, 'comecar.html'), 'utf8');
  const missions = fs.readFileSync(path.join(root, 'missoes.html'), 'utf8');
  const tutor = fs.readFileSync(path.join(root, 'gemini.html'), 'utf8');
  for (const cmd of ['npm ci', 'npm run preflight', 'npm run web', 'npm run nota']) assert.ok(start.includes(cmd));
  for (const term of ['M1-1', 'M2-4', 'M3-6', 'M4-5']) assert.ok(missions.includes(term));
  assert.equal((tutor.match(/class="prompt-details"/g) || []).length, 4);
  assert.equal((tutor.match(/data-copy="prompt-m[1-4]"/g) || []).length, 4);
  assert.match(tutor, /evidencias.json/);
});