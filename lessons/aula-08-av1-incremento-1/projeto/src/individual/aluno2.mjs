/** Slot 2 · estado: loading > error > base vazia > filtro vazio > pronto.
 * input = {op:'estado',loading:false,error:null,items:[...],filtered:[]}.
 * Trabalhe individualmente. Não coloque seu nome neste arquivo.
 */
export function resolver(input) {
  // TODO M4: valide entradas e diferencie 'vazio' de 'sem-resultados'.
  return input?.loading ? 'carregando' : 'pronto';
}
