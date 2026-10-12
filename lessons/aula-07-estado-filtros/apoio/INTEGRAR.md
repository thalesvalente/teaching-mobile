# Aula 7 — integrar sem substituir o app

Use os arquivos como referência de estudo. Não são um novo projeto instalável. Não copie uma pasta `app` concorrente, não mude dependências e não substitua a coleção construída pela equipe.

1. Leia `modelo.ts`: filtrar preserva a fonte, resumir descreve o recorte.
2. Revise `PainelAula07.tsx`: recebe os dados e um callback `aoAbrir`, mantendo sua navegação externa. Os três cenários são simulações locais e podem ser removidos após a prática.
3. Integre a lógica ou o componente na tela existente. Não apague o formulário, os providers, os estilos ou a lógica de adicionar registros da Aula 6.
4. Mapeie os campos da sua base para a projeção de leitura `Registro`; mantenha o ID original. Na base Memórias, use `categoria` e `resumo`/`descricao` existentes. Em EDA, a projeção usa `categoria: indicador.situacao`, e preserva `valor`, `unidade` e `meta` na coleção de origem. O campo `periodo` é um acréscimo didático; só atribua um período que os dados realmente informem.
5. `dados.ts` fornece uma coleção simulada para experimentar separadamente. Não é migração nem substituição de dados existentes. Memórias usa seis registros e três categorias. EDA acrescenta duas semanas inventadas e nunca mistura percentuais com estudantes no mesmo eixo.
6. Em `aoAbrir`, chame a função de navegação já existente. Confira dois IDs diferentes e retorne à lista mantendo o recorte. O componente não decide nomes de rotas por você.
7. Rode a verificação de tipos e o app com os scripts existentes. Observe busca, combinação de filtros, limpeza, carregamento, falha e repetição da tentativa. Teste rótulos, teclado, toque e alternativa textual em dispositivo disponível.
8. Guarde commit, arquivos modificados, resultado observado, pendências e uso de IA na ficha. Não invente execução nativa: quando não tiver sido feita, marque pendente.

O simulador HTML executa JavaScript, não React Native. Os testes automáticos da ficha não certificam o app. A referência TSX foi verificada sintaticamente nesta entrega; a compatibilidade de tipos/imports com a baseline da equipe e a execução no aparelho precisam ser verificadas na integração.
