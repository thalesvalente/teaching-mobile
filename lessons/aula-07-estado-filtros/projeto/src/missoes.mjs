// Edite estas QUATRO funções. Preserve assinaturas e contratos de MISSOES.md.
// O avaliador e o aplicativo importam este mesmo arquivo.
function pendente(missao) {
  const erro = new Error(`Implemente ${missao} em src/missoes.mjs.`);
  erro.name = 'MissaoPendente';
  throw erro;
}

/**
 * M1 · Estado da tela — até 2 pontos.
 * @param {import('./tipos').Status} status
 * @param {readonly import('./tipos').Registro[]} base
 * @param {readonly import('./tipos').Registro[]} visiveis
 * @returns {import('./tipos').Tela}
 */
export function classificarTela(status, base, visiveis) {
  // TODO M1: carregando/erro antes de vazio; diferencie base vazia de filtro vazio.
  return pendente('M1 — Estado da tela');
}

/**
 * M2 · Busca e filtros — até 3 pontos. Nunca altere a coleção recebida.
 * @param {readonly import('./tipos').Registro[]} registros
 * @param {string} busca
 * @param {string} categoria
 * @param {string} periodo
 * @returns {import('./tipos').Registro[]}
 */
export function filtrar(registros, busca, categoria = 'Todas', periodo = 'Todos') {
  // TODO M2: título com trim/toLowerCase; texto E categoria E período.
  // Mantemos acentos: "praca" não é equivalente a "praça" nesta regra didática.
  return pendente('M2 — Busca e filtros');
}

/**
 * M3 · Lista com identidade — até 2 pontos.
 * @param {readonly import('./tipos').Registro[]} visiveis
 * @returns {import('./tipos').Linha[]}
 */
export function prepararLista(visiveis) {
  // TODO M3: um { key: String(item.id), item } para cada registro do recorte.
  // Preserve a ordem e todos os dados de cada registro. Não use a posição como ID.
  return pendente('M3 — Lista com identidade');
}

/**
 * M4 · Resumo visual — até 3 pontos.
 * @param {readonly import('./tipos').Registro[]} visiveis
 * @param {import('./tipos').Trilha} trilha
 * @returns {import('./tipos').Resumo}
 */
export function resumir(visiveis, trilha) {
  // TODO M4: total e segundo descrevem o recorte; veja contratos em MISSOES.md.
  // Memórias: conte por categoria, escala comum pelo maior valor.
  // EDA: somente percentuais finitos entre 0 e 100 nas barras; escala 0–100.
  // Cada barra contém nome, valor, unidade, largura (0–100) e texto acessível.
  return pendente('M4 — Resumo visual');
}
