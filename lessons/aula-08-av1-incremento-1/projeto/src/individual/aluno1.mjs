/** Slot 1 · busca: devolva texto sem espaços nas pontas, em minúsculas e sem acentos.
 * input = {op:'normalizar',value:'  PRAÇA  '} => 'praca'. Inválido ou >200 => ''.
 * Trabalhe individualmente. Não coloque seu nome neste arquivo.
 */
export function resolver(input) {
  // TODO M4: valide a entrada e normalize. Preserve o contrato do README.
  return typeof input?.value === 'string' ? input.value : '';
}
