# Aula 7 — integrar sem substituir o app

Use os arquivos desta pasta como referência de estudo. Para começar um laboratório executável com tarefas e nota, abra o [projeto da Aula 07](../projeto/README.md) e suas [missões](../projeto/MISSOES.md). Para continuar no app da equipe, siga o roteiro abaixo. Não copie uma pasta `app` concorrente, não mude dependências e não substitua a coleção construída pela equipe.

1. Leia `modelo.ts`: filtrar preserva a fonte, resumir descreve o recorte.
2. Revise `PainelAula07.tsx`: recebe os dados e um callback `aoAbrir`, mantendo sua navegação externa. Os três cenários são simulações locais e podem ser removidos após a prática.
3. Integre a lógica ou o componente na tela existente. Não apague o formulário, os providers, os estilos ou a lógica de adicionar registros da Aula 6.
4. Mapeie os campos da sua base para a projeção de leitura `Registro`; mantenha o ID original. Na base Memórias da Aula 05, use `categoria` e `resumo`. A referência da Aula 06 usa `descricao` e não inclui categoria: preserve os demais campos e acrescente a categoria explicitamente, sem fingir que ela já existia. Em EDA, a projeção usa `categoria: indicador.situacao`, e preserva `valor`, `unidade` e `meta` na coleção de origem. O campo `periodo` é um acréscimo didático; só atribua um período que os dados realmente informem.
5. `dados.ts` fornece uma coleção simulada para experimentar separadamente. Não é migração nem substituição de dados existentes. Memórias usa seis registros e três categorias. EDA acrescenta duas semanas inventadas e nunca mistura percentuais com estudantes no mesmo eixo.
6. Em `aoAbrir`, chame a função de navegação correspondente à coleção. **EDA: ações da Aula 06 e indicadores da Aula 07 são coleções distintas.** Não envie um ID de indicador para `/acoes/[id]`. Preserve o cadastro de ações; para indicadores, use uma tela de detalhe própria ou mantenha o cartão informativo. Confira dois IDs diferentes e retorne à lista mantendo o recorte. O componente não decide nomes de rotas por você.
7. Rode a verificação de tipos e o app com os scripts existentes. Observe busca, combinação de filtros, limpeza, carregamento, falha e repetição da tentativa. Teste rótulos, teclado, toque e alternativa textual em dispositivo disponível.
8. Guarde commit, arquivos modificados, resultado observado, pendências e uso de IA na ficha. Não invente execução nativa: quando não tiver sido feita, marque pendente.

O simulador HTML executa JavaScript, não React Native. Os testes automáticos da ficha não certificam o app. A referência TSX foi verificada sintaticamente nesta entrega; a compatibilidade de tipos/imports com a baseline da equipe e a execução no aparelho precisam ser verificadas na integração.

## Pontuação e entrega

O [projeto com missões](../projeto/README.md) executa testes sobre as funções escritas pela equipe e mostra a nota em andamento, de 0,0 a 10,0. `npm run nota` gera relatório HTML imprimível e JSON, mesmo com funções pendentes. Essa nota do código é diferente da nota do simulador HTML e da autoavaliação da implementação na ficha.

Na ficha, confirme apenas cenários realmente observados e associe evidências. Um cenário ainda não executado fica pendente e vale zero, sem impedir impressão/PDF. Preencher arquivos, commit ou textos de evidência não concede pontos por si só. A avaliação visual, a execução em aparelho e a autoria dependem de verificação humana.
