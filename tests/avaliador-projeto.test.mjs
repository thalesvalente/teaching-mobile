import test from 'node:test';
import assert from 'node:assert/strict';
import { validarRotulosBarras } from '../lessons/aula-07-estado-filtros/projeto/src/avaliacao.mjs';

// Fixtures de rótulos: não implementam as quatro funções que o aluno deve criar.
const esperadas = [
  { id: 'indicador i1', partesNome: ['Frequência média', 'Semana 1'], valor: 88, unidade: '%' },
  { id: 'indicador i4', partesNome: ['Frequência média', 'Semana 2'], valor: 91, unidade: '%' }
];
const barras = [
  { nome: 'Frequência média · Semana 1', valor: 88, unidade: '%', texto: 'Frequência média · Semana 1: 88%' },
  { nome: 'Frequência média (Semana 2)', valor: 91, unidade: '%', texto: 'Frequência média (Semana 2): 91 %' }
];

test('A07-20 aceita rótulos ligados aos registros, com redação e ordem flexíveis', () => {
  assert.doesNotThrow(() => validarRotulosBarras([...barras].reverse(), esperadas));
});

test('A07-20 rejeita nomes genéricos mesmo quando o próprio texto os repete', () => {
  const genericas = barras.map(b => ({ ...b, nome: 'Texto genérico', texto: `Texto genérico: ${b.valor}%` }));
  assert.throws(() => validarRotulosBarras(genericas, esperadas), /indicador i1/);
});

test('A07-20 exige distinguir os períodos de um mesmo indicador', () => {
  const semPeriodo = barras.map(b => ({ ...b, nome: 'Frequência média', texto: `Frequência média: ${b.valor}%` }));
  assert.throws(() => validarRotulosBarras(semPeriodo, esperadas), /Semana 1/);
  const trocadas = barras.map((b, i) => ({ ...b, nome: barras[1 - i].nome, texto: `${barras[1 - i].nome}: ${b.valor}%` }));
  assert.throws(() => validarRotulosBarras(trocadas, esperadas), /indicador i1/);
});

test('A07-20 exige sem período quando o registro não informa período', () => {
  const esperado = [{ id: 'indicador exemplo', partesNome: ['Presença', 'sem período'], valor: 90, unidade: '%' }];
  assert.doesNotThrow(() => validarRotulosBarras([{ nome: 'Presença · sem período', valor: 90, unidade: '%', texto: 'Presença · sem período: 90%' }], esperado));
  assert.throws(() => validarRotulosBarras([{ nome: 'Presença', valor: 90, unidade: '%', texto: 'Presença: 90%' }], esperado), /sem período/);
});

test('A07-20 mantém valor, unidade e alternativa textual associados à barra', () => {
  assert.throws(() => validarRotulosBarras(barras.map(b => ({ ...b, unidade: 'estudantes' })), esperadas), /88 %/);
  assert.throws(() => validarRotulosBarras(barras.map(b => ({ ...b, texto: b.nome })), esperadas), /nome, o valor e a unidade/);
  assert.throws(() => validarRotulosBarras([barras[0], barras[0]], esperadas), /indicador i4/);
  assert.throws(() => validarRotulosBarras(undefined, esperadas), /array/);
});
