/** Configuração operacional Mobile; não reutilizar destinos de outras disciplinas. */
export const APPROVED_MOBILE_ENDPOINTS = Object.freeze([
  'https://script.google.com/macros/s/AKfycbyrvOlCl0Icm98SRNJ3SJy4gjx4Q4GH_k0EhxV50ebe93JXj_zjE8MmJ_zoGMwvNtXR/exec'
]);
export const CONFIG = Object.freeze({
  activity: 'MOBILE-AULA08-2026', schema: 'mobile-a08-v2',
  rubric: 'mobile-a08-lab-vivo-2.0.0', instrument: 'laboratorio-vivo-av1',
  evaluator: 'aula08', sheet: '4º Bimestre', column: 'Aula 08',
  endpoint: APPROVED_MOBILE_ENDPOINTS[0], timeoutMs: 25000
});
export const CRITERIA = Object.freeze({
  'M1-1': 'Pacote e versão corretos', 'M1-2': 'Fontes e hashes coerentes',
  'M1-3': 'Preparação registrada', 'M1-4': 'Registro reflexivo do processo', 'M1-5': 'Equipe e tarefas consistentes',
  'M2-1': 'Carregamento e erro têm prioridade', 'M2-2': 'Busca e filtros combinados',
  'M2-3': 'Coleção original preservada', 'M2-4': 'Identidade estável',
  'M3-1': 'Vazio e sem resultado são diferentes', 'M3-2': 'Tentar novamente após erro',
  'M3-3': 'Lista, detalhe e retorno', 'M3-4': 'Formulário e mensagens',
  'M3-5': 'Filtros preservados no retorno', 'M3-6': 'Resumo textual coerente',
  'M4-1': 'Caso principal da equipe', 'M4-2': 'Caso limite da equipe',
  'M4-3': 'Entrada inválida da equipe', 'M4-4': 'Regressão da equipe', 'M4-5': 'Saída e limites da equipe'
});
