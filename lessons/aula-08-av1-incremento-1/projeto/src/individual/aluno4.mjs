/** Slot 4 · chave estável: String(item.id). ID ausente/inválido => null.
 * input = {op:'chave',item:{id:'r24'}} => 'r24'. ID 0 é válido.
 * Trabalhe individualmente. Não coloque seu nome neste arquivo.
 */
export function resolver(input) {
  // TODO M4: valide o ID e preserve identidade sem usar a posição da lista.
  return input?.item?.id || null;
}
