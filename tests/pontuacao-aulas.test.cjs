/* Contrato público da oficina: avaliação parcial, denominador fixo e sem crédito
   por respostas ausentes. Executar: node --test tests/pontuacao-aulas.test.cjs */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function load(lesson) {
  const context = { window: {} };
  const root = process.env.AULAS_ROOT || path.join(__dirname, '..');
  const filename = lesson === 6
    ? 'lessons/aula-06-navegacao-formularios/modelo.js'
    : 'lessons/aula-07-estado-filtros/nucleo.js';
  vm.runInNewContext(fs.readFileSync(path.join(root, filename), 'utf8'), context);
  const api = lesson === 6 ? context.window.Mobile6 : context.window.Aula7;
  return {
    api,
    evaluate(answers, project) {
      const results = lesson === 6 ? api.evaluate(answers, project) : api.avaliar(answers, project);
      return Array.from(results, r => ({
        id: r.id,
        status: lesson === 6 ? r.status : { passou: 'pass', ajustar: 'fail', pendente: 'pending' }[r.status],
        earned: lesson === 6 ? r.earned : r.pontos,
        max: r.max
      }));
    }
  };
}
const total = results => results.reduce((sum, r) => sum + r.earned, 0);

for (const lesson of [6, 7]) {
  for (const project of Object.keys(load(lesson).api.PROJECTS)) {
    const label = `Aula ${lesson} / ${project}`;
    test(`${label}: vazia continua em 0/10 com vinte critérios pendentes`, () => {
      const { evaluate } = load(lesson);
      const results = evaluate({}, project);
      assert.equal(results.length, 20);
      assert.equal(total(results), 0);
      assert.equal(results.reduce((sum, r) => sum + r.max, 0), 10);
      assert.ok(results.every(r => r.status === 'pending'));
    });
    test(`${label}: referência correta alcança 10/10 e repetir não acumula pontos`, () => {
      const { api, evaluate } = load(lesson);
      for (let attempt = 0; attempt < 3; attempt++) {
        const results = evaluate(api.GOOD, project);
        assert.ok(results.every(r => r.status === 'pass'));
        assert.equal(total(results), 10);
      }
    });
    test(`${label}: resposta independente recebe crédito mesmo com a etapa incompleta`, () => {
      const { evaluate } = load(lesson);
      const answers = lesson === 6 ? { list: 'index' } : { prioridade: 'status' };
      const results = evaluate(answers, project);
      assert.equal(total(results), lesson === 6 ? 0.5 : 1);
      assert.equal(results[0].status, 'pass');
      assert.ok(results.some(r => r.status === 'pending'));
      assert.equal(results.reduce((sum, r) => sum + r.max, 0), 10);
    });
    test(`${label}: apagar qualquer resposta deixa seus critérios pendentes sem apagar os demais`, () => {
      const { api, evaluate } = load(lesson);
      for (const key of api.KEYS) {
        const results = evaluate({ ...api.GOOD, [key]: '' }, project);
        assert.ok(results.some(r => r.status === 'pending'), `${key}: ausência precisa aparecer como pendência`);
        assert.ok(total(results) > 0 && total(results) < 10, `${key}: deve preservar somente crédito independente`);
        assert.ok(results.filter(r => r.status === 'pending').every(r => r.earned === 0));
      }
    });
    test(`${label}: valores desconhecidos não ganham nota por fallback`, () => {
      const { api, evaluate } = load(lesson);
      const invalid = Object.fromEntries(api.KEYS.map(key => [key, '<valor-inexistente>']));
      const results = evaluate(invalid, project);
      assert.equal(total(results), 0);
      assert.ok(results.every(r => r.status === 'pending'));
    });
    test(`${label}: avaliação não modifica as respostas e devolve a mesma pontuação`, () => {
      const { api, evaluate } = load(lesson);
      const answers = { ...api.GOOD, [api.KEYS[api.KEYS.length - 1]]: '' };
      const original = JSON.stringify(answers);
      const first = evaluate(answers, project);
      const second = evaluate(answers, project);
      assert.equal(JSON.stringify(answers), original);
      assert.deepEqual(first, second);
    });
    if (lesson === 6) test(`${label}: crédito por salvar texto normalizado depende de trim respondido e correto`, () => {
      const { evaluate } = load(lesson);
      const missing = evaluate({ storage: 'shared' }, project).find(r => r.id === 17);
      const wrong = evaluate({ storage: 'shared', trim: 'raw' }, project).find(r => r.id === 17);
      const correct = evaluate({ storage: 'shared', trim: 'trim' }, project).find(r => r.id === 17);
      assert.equal(missing.status, 'pending');
      assert.equal(missing.earned, 0);
      assert.equal(wrong.status, 'fail');
      assert.equal(wrong.earned, 0);
      assert.equal(correct.status, 'pass');
      assert.equal(correct.earned, 0.5);
    });
  }
}
