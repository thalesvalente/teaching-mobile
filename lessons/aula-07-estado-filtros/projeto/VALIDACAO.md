# Validação do starter — Aula 07

Data: **20/10/2026**. Escopo: projeto novo, tarefas, avaliador, interface Web compilada e relatório parcial. As funções do aluno permanecem com TODOs na versão entregue.

## Verificações realizadas

| Verificação | Resultado |
|---|---|
| Instalação com versões da base Aula 05 e lockfile próprio | Concluída na pasta do projeto |
| `npm run typecheck` | PASS |
| Exportação Web Expo | PASS — quatro rotas estáticas, incluindo lista e detalhe |
| Starter sem respostas | 0,0 / 10,0; 20 critérios pendentes |
| Fixture de referência correta, externa ao starter | 10,0 / 10,0; 20 critérios passaram |
| Fixture com apenas M1 concluída | 2,0 / 10,0; demais 16 critérios pendentes |
| Filtro que devolve sempre todos os registros | Erros identificados; nota 8,0 |
| Chave da lista baseada na posição | Erros identificados; nota 9,0 |
| Barras sempre com largura 100 | Erro identificado; nota 9,5 |
| Barras EDA sem período, ou com nomes genéricos | A07-20 identifica a divergência; nota 9,5 nas duas mutações |
| Nova execução da referência correta | Continua 10,0, sem acumular pontos |
| Sintaxe dos arquivos de referência em `apoio/` | PASS |

Os valores de 8,0, 9,0 e 9,5 correspondem a defeitos introduzidos em fixtures de teste, mantendo as demais funções corretas. Não são notas arbitrárias atribuídas ao starter. A solução de referência usada na verificação não foi colocada no arquivo que os estudantes devem completar.

## Revisão independente do contrato e das entregas parciais

O critério A07-20 compara nome, valor e unidade das barras com os registros recebidos. Em EDA, identifica título e período, incluindo o caso `sem período`; um rótulo genérico repetido no texto não recebe crédito. O conjunto permanece com **20 critérios de 0,5 ponto**, e a referência correta continua com 10,0.

`node tests/avaliador-projeto.test.mjs`, executado a partir da raiz do repositório, passou nos cinco testes focais de rótulos. Essas fixtures não implementam as quatro funções da atividade. Os testes da referência integrada e das mutações foram mantidos fora do starter.

A fronteira da interface valida os formatos retornados pelas funções antes de usá-los no JSX. Um teste dirigido do TSX, com estado de carregamento concluído e dependências de interface simuladas, verificou sete retornos inválidos: resumo sem barras, lista como objeto, item de lista incompleto, filtro como objeto, estado como objeto, texto de barra como objeto e largura `NaN`. Todos exibiram a missão a corrigir, preservaram o placar e o botão de recálculo e mantiveram a nota produzida pelo avaliador. O starter e a referência correta também continuaram renderizando. A validação não substitui um retorno errado por uma solução e não acrescenta pontos.

Após a alteração do TSX, `npm run typecheck` e `EXPO_NO_TELEMETRY=1 EXPO_OFFLINE=1 npm run export:web` passaram novamente. Um smoke test do novo bundle em Chromium, a 390 × 844 px, confirmou nota inicial 0,0, recálculo, troca para EDA, busca e período, sem erro JavaScript nem rolagem horizontal. As fixtures de retornos inválidos foram verificadas no teste dirigido; não foram executadas em dispositivo nativo.

## Interface Web

Build real testada com Chromium, em **320, 390, 768 e 1440 px**, altura de 900 px:

- sem erro JavaScript em página;
- sem rolagem horizontal da página;
- idioma `pt-BR` e título identificado;
- placar inicial 0,0 / 10,0 e recálculo funcionando;
- troca para EDA, preenchimento da busca e filtro de período acionados;
- zero violações automáticas do axe-core nas regras WCAG A/AA aplicadas ao estado inicial de cada largura;
- captura móvel inspecionada visualmente.

Um título vazio produzido inicialmente pelo Expo Router foi detectado no teste e corrigido com `Head`. O documento Web usa `lang="pt-BR"`, foco visível e viewport sem restrição de zoom.

## Relatório parcial

O comando `npm run nota` foi executado com as quatro missões pendentes. Gerou JSON e HTML com 0,0 / 10,0, 20 pendências e hash do arquivo avaliado. A impressão real do HTML gerou **quatro páginas A4**, renderizadas e inspecionadas: placar, tabela por missão, 20 critérios, rastreabilidade e numeração sem conteúdo cortado.

O navegador controla a impressão. A versão HTML mantém títulos, tabela, textos e indicador de progresso acessíveis; a conformidade estrutural do PDF com PDF/UA não foi certificada.

## Limites reais

Não foram executados emulador Android, simulador iOS, aparelhos físicos ou leitores de tela nativos. A compilação Web e os testes de funções não substituem esses testes. As plataformas Android/iOS estão configuradas no projeto com as dependências já utilizadas pela disciplina; a execução depende de um ambiente nativo compatível.

O teste automático de acessibilidade é uma verificação parcial e não uma certificação integral WCAG. A equipe ainda deve testar teclado, toque, orientação, zoom e tecnologia assistiva disponível na integração do seu aplicativo.
