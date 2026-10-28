/** Tarefa coletiva 1 · busca: texto sem espaços nas pontas, em minúsculas e sem acentos.
 * input = {op:'normalizar',value:'  PRAÇA  '} => 'praca'. Inválido ou >200 => ''.
 * Trabalhem em equipe. O número não identifica um aluno; não coloquem nomes aqui.
 */
export function resolver(input) {
  // TODO M4: valide a entrada e normalize. Preserve o contrato do README.
  return typeof input?.value === 'string' ? input.value : '';
}
