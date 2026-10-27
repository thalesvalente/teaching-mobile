'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const lesson = path.join(root, 'lessons/aula-08-av1-incremento-1');
const read = name => fs.readFileSync(path.join(lesson, name), 'utf8');
const blobSha = bytes => crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');

test('portal e README têm caminhos da Aula08; links relativos existentes não quebram', () => {
  for (const name of ['index.html', 'README.md']) assert.match(fs.readFileSync(path.join(root, name), 'utf8'), /aula-08-av1-incremento-1/);
  for (const file of [path.join(root, 'index.html'), path.join(lesson, 'index.html'), path.join(lesson, 'atividade.html')]) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/\b(?:href|src)="([^"#][^"]*)"/g)) {
      const value = match[1];
      // data-src de imagens originais indisponíveis pertence ao gate G1 separado.
      if (source.slice(Math.max(0, match.index - 5), match.index).endsWith('data-')) continue;
      if (/^(?:https?:|data:|blob:|mailto:)/.test(value)) continue;
      const target = path.resolve(path.dirname(file), decodeURIComponent(value.split(/[?#]/)[0]));
      assert.ok(fs.existsSync(target), `${path.relative(root, file)}: ${value}`);
    }
  }
});
test('quatro marcos, valores corretos e cinco passos operacionais', () => {
  assert.equal((read('index.html').match(/class="milestone"/g) || []).length, 4);
  for (const value of ['M1', 'M2', 'M3', 'M4']) assert.ok(read('MISSOES.md').includes(value));
  assert.match(read('MISSOES.md'), /M1 \+ M2 \+ M3/);
  assert.equal((read('MISSOES.md').match(/^\| M[1-4]-\d \|/gm) || []).length, 20);
  assert.match(read('MISSOES.md'), /envio não é um quinto marco/);
});
test('Gemini tutor por missão, quatro delimitadores e privacidade', () => {
  const guide = read('GUIA_GEMINI.md');
  for (const tag of ['INSTRUCOES', 'CONTEXTO', 'DADOS', 'SAIDA']) assert.equal((guide.match(new RegExp('<' + tag + '>', 'g')) || []).length, 4);
  for (const word of ['navegador', 'VS Code', 'terminal', '.env', 'senhas', 'tokens', 'humanChange']) assert.ok(guide.includes(word));
});
test('páginas usam rótulos, skip link, alternativas e scripts locais', () => {
  for (const name of ['index.html', 'atividade.html']) {
    const html = read(name);
    assert.match(html, /lang="pt-BR"/); assert.match(html, /class="skip-link"/);
    assert.match(html, /<img[^>]*alt="[^"]{30,}"/); assert.match(html, /class="equivalent"/);
    assert.ok(!/<script[^>]*src="https?:/.test(html));
  }
  assert.match(read('atividade.html'), /aria-live="polite"/);
  assert.equal((read('atividade.html').match(/>Verificar, gerar PDF e entregar<\/button>/g) || []).length, 1);
  assert.match(read('visual.css'), /prefers-reduced-motion/);
  assert.match(read('visual.css'), /focus-visible/);
});
test('parser do navegador reutiliza contrato real; nenhuma fonte avaliada no DOM', () => {
  assert.match(read('jsonl.js'), /projeto\/src\/contrato\.mjs/);
  const sandbox = read('verificador.js');
  assert.match(sandbox, /setAttribute\('sandbox', 'allow-scripts'\)/);
  assert.ok(!sandbox.includes('allow-same-origin'));
  assert.match(sandbox, /connect-src 'none'/); assert.match(sandbox, /worker\.terminate/);
  assert.ok(!/\beval\s*\(/.test(sandbox));
  assert.ok(!/innerHTML\s*=/.test(read('atividade.js')));
});
test('Aulas 06 e 07 preservadas fora do adaptador Code.gs autorizado', () => {
  const expected = {
    'lessons/aula-06-navegacao-formularios/atividade.html': 'ac26b4c1069c0fc4aef60d852188f642096b2068',
    'lessons/aula-06-navegacao-formularios/atividade.js': 'a4329efb1ceab3bd8354355157ff4e21762fda01',
    'lessons/aula-07-estado-filtros/atividade.html': '663b580fa18dbd4ac0198c23be805c32fc7dc368',
    'lessons/aula-07-estado-filtros/atividade.js': 'ed71c16be982fb393e31bed9e53fcb3f47b9248c',
    'lessons/aula-07-estado-filtros/entrega-appscript.js': 'aa7767021f053d26e1ddfbebc4bc1ae470dfa67d',
    'lessons/aula-07-estado-filtros/appscript/RubricaAula07.gs': 'b6d37759cf6c8748fce6043a870c9e1ab8d3fd23',
    'lessons/aula-07-estado-filtros/pdf.js': '5b804e39f90e78f4be54fe27d77807ad199aab31'
  };
  for (const [name, sha] of Object.entries(expected)) assert.equal(blobSha(fs.readFileSync(path.join(root, name))), sha, name);
});
