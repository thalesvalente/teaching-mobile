/** Tarefa coletiva 2 · estado: loading > error > base vazia > filtro vazio > pronto.
 * input = {op:'estado',loading:false,error:null,items:[...],filtered:[]}.
 * Trabalhem em equipe. O número não identifica um aluno; não coloquem nomes aqui.
 */
export function resolver(input) {
  // TODO M4: valide entradas e diferencie 'vazio' de 'sem-resultados'.
  return input?.loading ? 'carregando' : 'pronto';
}
