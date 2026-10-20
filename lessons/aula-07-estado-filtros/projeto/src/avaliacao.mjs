// Rubrica pública: 20 comportamentos observáveis, 0,5 ponto por comportamento.
// Estes testes executam as funções do aluno. Não certificam interface, autoria ou dispositivo.
import * as aluno from './missoes.mjs';
import { memorias, eda } from './dados.mjs';

export const MISSOES = [
  { id: 'estado', nome: 'Estado da tela', max: 2 },
  { id: 'filtros', nome: 'Busca e filtros', max: 3 },
  { id: 'lista', nome: 'Lista com identidade', max: 2 },
  { id: 'resumo', nome: 'Resumo visual coerente', max: 3 }
];
const copia = (lista) => lista.map(item => ({ ...item }));
const fixa = (lista) => Object.freeze(copia(lista).map(Object.freeze));
const iguais = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const ids = (lista) => lista.map(item => String(item.id));
const exige = (ok, mensagem) => { if (!ok) throw Error(mensagem); };

// Compara os rótulos com os registros de origem, não apenas com a própria barra.
// A identidade é usada no diagnóstico; não exige um campo novo no retorno do aluno.
export function validarRotulosBarras(barras, esperadas) {
  exige(Array.isArray(barras), 'O resumo precisa devolver barras em um array.');
  exige(barras.length === esperadas.length, 'Cada categoria ou indicador válido do recorte precisa da sua própria barra.');
  const usadas = new Set();
  for (const esperado of esperadas) {
    const indice = barras.findIndex((barra, i) => !usadas.has(i) && barra
      && typeof barra.nome === 'string'
      && esperado.partesNome.every(parte => barra.nome.includes(parte))
      && barra.valor === esperado.valor && barra.unidade === esperado.unidade);
    exige(indice >= 0, `A barra de ${esperado.id} deve identificar ${esperado.partesNome.join(' · ')} com valor ${esperado.valor} ${esperado.unidade}.`);
    const barra = barras[indice];
    exige(typeof barra.texto === 'string' && barra.texto.includes(barra.nome)
      && barra.texto.includes(String(esperado.valor)) && barra.texto.includes(esperado.unidade),
    `O texto de ${esperado.id} precisa comunicar o nome, o valor e a unidade do mesmo registro.`);
    usadas.add(indice);
  }
}

// Cada critério tem seus próprios dados; um erro numa missão não anula as outras.
const TESTES = [
  ['estado', 'Carregando tem prioridade sobre lista vazia', f => {
    exige(f.classificarTela('carregando', [], []) === 'carregando', 'Esperado: carregando.');
    exige(f.classificarTela('carregando', copia(memorias), copia(memorias)) === 'carregando', 'Dados anteriores não eliminam o carregamento.');
  }],
  ['estado', 'Erro tem prioridade sobre a coleção', f => {
    exige(f.classificarTela('erro', [], []) === 'erro', 'Esperado: erro.');
    exige(f.classificarTela('erro', copia(eda), copia(eda)) === 'erro', 'Dados anteriores não eliminam o erro.');
  }],
  ['estado', 'Base vazia e filtro sem resultado são diferentes', f => {
    exige(f.classificarTela('sucesso', [], []) === 'vazia', 'Sem registros na base: vazia.');
    exige(f.classificarTela('sucesso', copia(memorias), []) === 'semResultado', 'Base existente, recorte vazio: semResultado.');
  }],
  ['estado', 'Sucesso com itens mostra conteúdo', f => {
    for (const base of [memorias, eda]) exige(f.classificarTela('sucesso', copia(base), copia(base.slice(0, 1))) === 'conteudo', 'Esperado: conteudo nas duas trilhas.');
  }],
  ['filtros', 'Busca vazia conserva a coleção completa', f => {
    for (const base of [memorias, eda]) exige(iguais(f.filtrar(fixa(base), '', 'Todas', 'Todos'), base), 'Busca vazia deve devolver os seis registros na mesma ordem.');
  }],
  ['filtros', 'Busca trata maiúsculas e espaços nas pontas', f => {
    exige(iguais(ids(f.filtrar(fixa(memorias), '  PRAÇA  ')), ['m2', 'm6']), 'PRAÇA deve encontrar m2 e m6.');
    exige(iguais(ids(f.filtrar(fixa(eda), '  FREQUÊNCIA  ')), ['i1', 'i4']), 'FREQUÊNCIA deve encontrar i1 e i4.');
    const tituloComEspacos = [{ ...memorias[0], titulo: '  Exemplo  ' }];
    exige(f.filtrar(fixa(tituloComEspacos), ' exemplo ').length === 1, 'Normalize também os títulos recebidos.');
  }],
  ['filtros', 'Texto e categoria usam interseção', f => {
    exige(iguais(ids(f.filtrar(fixa(memorias), 'praça', 'Lugar')), ['m2']), 'praça E Lugar deve retornar apenas m2.');
    exige(iguais(ids(f.filtrar(fixa(eda), 'Frequência', 'adequado')), ['i4']), 'Frequência E adequado deve retornar apenas i4.');
  }],
  ['filtros', 'Período combina com os demais filtros', f => {
    exige(iguais(ids(f.filtrar(fixa(eda), '', 'Todas', 'Semana 2')), ['i4', 'i5', 'i6']), 'Semana 2 deve retornar i4, i5 e i6.');
    exige(iguais(ids(f.filtrar(fixa(eda), 'Frequência', 'atencao', 'Semana 2')), []), 'Todos os três critérios precisam corresponder.');
  }],
  ['filtros', 'Termo inexistente produz recorte vazio', f => {
    for (const base of [memorias, eda]) exige(f.filtrar(fixa(base), 'zzzz').length === 0, 'zzzz não deve encontrar itens.');
  }],
  ['filtros', 'Filtrar e limpar preserva os dados de origem', f => {
    for (const base of [memorias, eda]) {
      const entrada = copia(base), antes = JSON.stringify(entrada);
      f.filtrar(entrada, base[1].titulo, base[1].categoria);
      exige(JSON.stringify(entrada) === antes, 'A função alterou a coleção recebida.');
      exige(iguais(f.filtrar(entrada, '', 'Todas', 'Todos'), base), 'Limpar deve recuperar os seis registros.');
    }
  }],
  ['lista', 'Só os itens do recorte chegam à lista', f => {
    for (const base of [memorias, eda]) {
      const recorte = copia(base.slice(1, 3));
      const linhas = f.prepararLista(fixa(recorte));
      exige(linhas.length === 2 && iguais(linhas.map(x => x.item), recorte), 'A lista deve conter exatamente os dois registros recebidos.');
    }
  }],
  ['lista', 'A chave acompanha o ID depois de reordenar', f => {
    const antes = f.prepararLista(fixa(memorias));
    const depois = f.prepararLista(fixa(copia(memorias).reverse()));
    exige(depois.every(linha => linha.key === antes.find(x => x.item.id === linha.item.id)?.key), 'A chave mudou com a posição.');
    exige(new Set(antes.map(x => x.key)).size === memorias.length, 'As chaves precisam ser distintas.');
  }],
  ['lista', 'Cada cartão recebe seus próprios dados', f => {
    for (const base of [memorias, eda]) {
      const linhas = f.prepararLista(fixa(base));
      exige(iguais(linhas.map(x => x.item), base), 'Não repita o primeiro registro e não elimine campos.');
    }
  }],
  ['lista', 'IDs numéricos e textuais geram chaves textuais', f => {
    const entrada = [{ ...memorias[0], id: 27 }, { ...memorias[1], id: 'registro-x' }];
    const linhas = f.prepararLista(fixa(entrada));
    exige(iguais(linhas.map(x => x.key), ['27', 'registro-x']), 'Use a representação textual do ID, nunca o índice.');
    exige(f.prepararLista([]).length === 0, 'Uma lista vazia deve continuar vazia.');
  }],
  ['resumo', 'Cartões descrevem somente o recorte', f => {
    const m = f.resumir(fixa([memorias[1]]), 'memorias');
    const e = f.resumir(fixa([eda[0], eda[2]]), 'eda');
    exige(m.total === 1 && m.segundo === 1, 'Uma memória e uma categoria no recorte.');
    exige(e.total === 2 && e.segundo === 2, 'Dois indicadores, dois em atenção; não são duas pessoas.');
  }],
  ['resumo', 'Recorte vazio tem contadores zerados', f => {
    for (const trilha of ['memorias', 'eda']) {
      const r = f.resumir([], trilha);
      exige(r.total === 0 && r.segundo === 0 && r.barras.length === 0, 'Vazio deve produzir total 0, segundo 0 e nenhuma barra.');
    }
  }],
  ['resumo', 'Barras usam os mesmos registros da lista', f => {
    const m = f.resumir(fixa([memorias[1], memorias[4]]), 'memorias');
    const e = f.resumir(fixa([eda[1], eda[3]]), 'eda');
    exige(m.barras.length === 1 && m.barras[0].nome === 'Lugar' && m.barras[0].valor === 2, 'Recorte de lugares: uma barra Lugar com valor 2.');
    exige(iguais(e.barras.map(b => b.valor), [94, 91]), 'O recorte EDA deve preservar os valores 94 e 91.');
  }],
  ['resumo', 'Unidades e valores inválidos não se misturam', f => {
    const extras = [NaN, Infinity, -1, 101].map((valor, i) => ({ ...eda[0], id: `x${i}`, valor }));
    const r = f.resumir(fixa([...eda, ...extras]), 'eda');
    exige(r.barras.length === 4 && r.barras.every(b => b.unidade === '%' && Number.isFinite(b.valor) && b.valor >= 0 && b.valor <= 100), 'Barras aceitam apenas % finitos no intervalo 0–100. Quantidades ficam em texto.');
  }],
  ['resumo', 'Barras respeitam uma escala comum', f => {
    const m = f.resumir(fixa(memorias.slice(0, 4)), 'memorias');
    exige(m.barras.find(b => b.nome === 'Relato')?.largura === 100, 'Relato tem duas memórias: largura 100.');
    exige(m.barras.find(b => b.nome === 'Lugar')?.largura === 50, 'Lugar tem uma memória: largura 50.');
    const e = f.resumir(fixa(eda), 'eda');
    exige(iguais(e.barras.map(b => b.largura), [88, 94, 91, 86]), 'Em EDA a escala é fixa em 0–100%.');
  }],
  ['resumo', 'Cada barra tem nome, valor e unidade em texto', f => {
    const edaComPeriodoAusente = [...eda, { ...eda[0], id: 'i-sem-periodo', titulo: 'Presença em atividade', periodo: undefined, valor: 90 }];
    for (const [trilha, base] of [['memorias', memorias], ['eda', edaComPeriodoAusente]]) {
      const r = f.resumir(fixa(base), trilha);
      const esperadas = trilha === 'memorias'
        ? [...new Set(base.map(item => item.categoria))].map(categoria => ({
          id: `categoria ${categoria}`, partesNome: [categoria],
          valor: base.filter(item => item.categoria === categoria).length, unidade: 'memórias'
        }))
        : base.filter(item => item.unidade === '%' && Number.isFinite(item.valor) && item.valor >= 0 && item.valor <= 100)
          .map(item => ({ id: `indicador ${item.id}`, partesNome: [item.titulo, item.periodo || 'sem período'], valor: item.valor, unidade: '%' }));
      validarRotulosBarras(r?.barras, esperadas);
    }
  }]
];

export function avaliar(implementacao = aluno) {
  const resultados = TESTES.map(([missao, titulo, testar], i) => {
    let estado = 'passou', detalhe = 'Comportamento confirmado nos dados de teste.';
    try { testar(implementacao); } catch (erro) {
      estado = erro?.name === 'MissaoPendente' ? 'pendente' : 'ajustar';
      detalhe = erro instanceof Error ? erro.message : String(erro);
    }
    return { id: `A07-${String(i + 1).padStart(2, '0')}`, missao, titulo, estado,
      pontos: estado === 'passou' ? 0.5 : 0, max: 0.5, detalhe };
  });
  const total = resultados.reduce((soma, r) => soma + r.pontos, 0);
  return {
    schema: 'mobile-a07-projeto-v1', versao: '1.0.0', total, max: 10,
    xp: total * 10, xpMax: 100,
    nivel: total === 10 ? 'Missão concluída' : total >= 7 ? 'Explorador de dados' : total >= 3 ? 'Em construção' : 'Primeiros passos',
    missoes: MISSOES.map(m => ({ ...m, pontos: resultados.filter(r => r.missao === m.id).reduce((soma, r) => soma + r.pontos, 0) })),
    resultados,
    limite: 'Nota formativa dos testes de funções deste projeto; interface, execução no aparelho e autoria exigem validação humana.'
  };
}
