/**
 * Aula 08 · Desafio avançado. Implementação deliberadamente incompleta.
 *
 * Regras e casos de borda estão em ../README.md. Não altere as assinaturas.
 * Os testes calculam a nota a partir deste arquivo. Não há gabarito embutido.
 *
 * IMPORTANTE: a aplicação é funcional como estrutura Expo, mas os seis TODOs
 * abaixo introduzem defeitos intencionais de domínio para investigação.
 */

/**
 * @returns {'erro'|'carregando'|'vazio'|'sem-resultados'|'pronto'}
 */
export function estadoTela({ carregando, erro, totalFonte, totalVisivel }) {
  // TODO A: prioridade de erro/carregamento; distinguir base vazia e filtro vazio.
  return 'pendente';
}

/**
 * Busca sem acentos/caixa, filtros de categoria/período, ordem estável.
 * A coleção original deve ser preservada, inclusive a ordem dos objetos.
 */
export function filtrarOrdenar(registros, filtros) {
  // TODO B: não use splice(), sort() direto na fonte nem altere registros.
  return [];
}

/** IDs são opacos e nunca devem ser convertidos em números. */
export function obterPorId(registros, id) {
  // TODO C: distinguir id inexistente de válido, sem colisões.
  return undefined;
}

/** @returns {{ok:boolean, erros:Record<string,string>, valor?:object}} */
export function validarFormulario(formulario, registros) {
  // TODO D: title 5-60; descrição 10-180; categoria conhecida; título único por trilha.
  // Aplicar trim e validar a versão normalizada antes de salvar.
  return { ok: false, erros: { titulo: 'Ainda não implementado' } };
}

/** Insere sem mutação nem duplicação (inclusive dois toques no mesmo botão). */
export function inserirImutavel(registros, novo) {
  // TODO E: rejeitar ID repetido, devolver array novo quando inserir.
  return registros;
}

/** @returns {{total:number, porCategoria:Record<string,number>, ids:string[]}} */
export function resumir(registros) {
  // TODO F: agregar sem contar duas vezes ou modificar o array recebido.
  return { total: -1, porCategoria: {}, ids: [] };
}
