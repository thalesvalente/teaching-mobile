# As quatro missões da Aula 08

**Para o estudante:** abra [Missões passo a passo](missoes.html) no navegador. Este Markdown é referência complementar; as etapas da aula estão na página HTML.


Abra o projeto e use `npm run nota` após cada pequena alteração. O starter tem `TODO` intencionais. Não é preciso acertar tudo de uma vez.

## M1 - Preparar, compreender e registrar (15 minutos; 2,5 pontos)

1. Execute `npm ci`, `npm run preflight` e `npm run web`.
2. Encontre `src/equipe.mjs` e seu `src/individual/alunoN.mjs`.
3. Combine quem fica em cada slot. Para menos de quatro pessoas, use `-- --slots=1,2` (exemplo de dupla) nos comandos `nota` e `entrega`.
4. Diga a um colega o que entra e o que sai de uma função.
5. Registre o uso real de IA ao longo do trabalho, com pedido, sugestão, alteração humana e teste.

**Pausa para observar:** o aplicativo abriu? Você consegue explicar qual arquivo vai alterar?

## M2 - Implementar as funções essenciais (25 minutos; 2 pontos)

No arquivo `src/equipe.mjs`, examine a operação `input.op` e corrija os `TODO` das funções:

1. **Estado:** carregando deve aparecer antes de erro; erro deve aparecer antes da lista.
2. **Filtro:** combine a busca sem diferença entre maiúsculas/acentos com categoria e período.
3. **Preservação:** o filtro devolve um recorte; a coleção original deve continuar intacta.
4. **Identidade:** a chave usa o ID, inclusive o ID numérico zero; não use a posição na lista.

**Experimente:** busque “arvore” e “ÁRVORE”; troque os filtros; limpe a busca. Execute `npm run nota` e compare o antes e o depois.

## M3 - Integrar o Incremento 1 (35 minutos; 3 pontos)

1. Diferencie uma base vazia de uma busca sem resultados.
2. Provoque o estado de erro e use “Tentar novamente”.
3. Abra um item da lista, veja seu detalhe e volte.
4. Envie o formulário vazio e leia as mensagens; preencha os campos e confira os limites.
5. Volte à lista mantendo a busca, a categoria e o período anteriores.
6. Compare a quantidade do recorte com o resumo textual. Ele deve fazer sentido mesmo sem ver um gráfico.

**Mostre a um colega:** faça o percurso inteiro, explique um erro e rode novamente o teste. O verificador oficial mede o contrato das funções; a demonstração ajuda o professor a conferir a integração visual.

## M4 - Funções da equipe e entrega (25 minutos; 2,5 pontos coletivos)

A equipe organiza quais arquivos de tarefa vai completar. Slots identificam funções técnicas, não pessoas. Cada critério M4 só é aprovado quando todos os arquivos selecionados passam os casos correspondentes: principal, limite, entrada inválida, regressão e contrato de saída.

| Slot | Sua pergunta-guia |
|---|---|
| 1 - busca | Como transformar “ ÁRVORE ” em “arvore” e tratar entradas inválidas? |
| 2 - estado | O que mostrar se não há dados? E se só o filtro não encontrou nada? |
| 3 - formulário | Como informar campos ausentes e texto que ultrapassa o limite? |
| 4 - chave | Como preservar o ID de um item quando ele muda de posição? |

Execute `npm run nota`, registre a última alteração e execute `npm run entrega`. Abra a ficha, informe a equipe e os participantes, importe o pacote e clique em **Avaliar e enviar**. Guarde o PDF e o recibo. O envio não é um quinto marco.

## Os 20 critérios, visíveis desde o início

| ID | Critério | Valor |
|---|---|---:|
| M1-1 | Pacote e schema válidos | 0,5 |
| M1-2 | Fontes obrigatórias e hashes coerentes | 0,5 |
| M1-3 | Preparação registrada | 0,5 |
| M1-4 | Log de IA no formato mínimo | 0,5 |
| M1-5 | Equipe e slots consistentes | 0,5 |
| M2-1 | Prioridade de carregamento e erro | 0,5 |
| M2-2 | Busca normalizada e filtros combinados | 0,5 |
| M2-3 | Coleção original preservada | 0,5 |
| M2-4 | Identidade estável dos registros | 0,5 |
| M3-1 | Vazio versus sem resultados | 0,5 |
| M3-2 | Nova tentativa após erro | 0,5 |
| M3-3 | Lista, detalhe e retorno | 0,5 |
| M3-4 | Formulário e mensagens | 0,5 |
| M3-5 | Preservação do recorte após retorno | 0,5 |
| M3-6 | Resumo textual coerente | 0,5 |
| M4-1 | Caso principal dos arquivos do grupo | 0,5 |
| M4-2 | Casos limite dos arquivos do grupo | 0,5 |
| M4-3 | Entradas inválidas dos arquivos do grupo | 0,5 |
| M4-4 | Regressão dos arquivos do grupo | 0,5 |
| M4-5 | Contrato e limites dos arquivos do grupo | 0,5 |

A equipe recebe uma nota única: `M1 + M2 + M3 + M4 coletivo`. Todos os participantes recebem o mesmo valor. M1 contém evidências declaradas e integridade do pacote; ele não comprova autoria.
