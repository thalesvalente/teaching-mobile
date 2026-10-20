# Aula 07 — Estado, filtros e visualização de dados

**Professor:** Prof. Dr. Thales Levi Azevedo Valente  
**Turma:** 3º ano do Técnico em Informática Integrado · IFMA Campus Itapecuru-Mirim  
**Material:** aula e ficha HTML, projeto Expo com missões e avaliação formativa. Sem envio automático de respostas.

[Abrir aula](index.html) · [Abrir ficha e oficina](atividade.html) · [Projeto executável](projeto/README.md) · [Missões do projeto](projeto/MISSOES.md) · [Como integrar o código](apoio/INTEGRAR.md)

## Base e limites

O Plano de Ensino de Programação para Dispositivos Móveis 2026.2, arquivo fornecido `Plano_de_Ensino_Programacao_Dispositivos_Moveis_2026_4(2).md`, define o encontro 7 (data planejada: 16/09) como **Estado, filtros e visualização de dados**. Prevê FlatList, eventos, carregamento, vazio e erro com dados simulados; lista e filtro de pontos para Memórias; cartões, filtro e primeiro gráfico local para EDA; preparação do portfólio e Incremento 1. O plano disponível se identifica como rascunho com pendência de calendário. Este material não confirma sua publicação no SUAP nem realiza lançamento no diário.

A Aula 7 continua os objetivos de navegação e formulários da Aula 6. As funções desta aula operam sobre uma projeção de leitura da coleção; não substitua os dados, o cadastro, as rotas ou providers da equipe. API/HTTP, persistência, MapView e bibliotecas de gráficos especializadas não são requisitos novos desta entrega.

Os dados, as duas semanas inventadas de EDA, as verificações do laboratório e a rubrica formativa foram elaborados para a oficina. Não são requisitos reais das comunidades nem diagnóstico de pessoas ou setores. O gráfico de EDA não mistura percentuais com quantidades de estudantes e não calcula uma taxa de evasão.

## Organização dos 100 minutos

- **Primeiros 50:** slides 1–24, com 25 min de explicações/demonstrações e 25 min de previsões, experimentos e discussão guiada. Tempos sugeridos nas notas de cada slide. Slides 25–28: consulta, integração, fontes e acesso final à ficha.
- **Próximos 50:** 25 min no laboratório (incluindo identificação), 20 min de implementação acompanhada no app existente e 5 min para revisão/registro/exportação.

Essa distribuição operacionaliza o pedido de aula + oficina, mantendo a ênfase prática do plano. Não equivale à leitura expositiva de todos os slides. Estudantes com necessidade específica podem usar leitura vertical, tempo adicional e os arquivos de apoio.

## Sequência didática

Aula 6 → problema de uma lista maior → estado e evento → seleção sem apagar a fonte → categoria → busca textual → combinação dos filtros → FlatList → renderItem → identidade por ID → carregamento/sucesso/erro → vazio versus sem resultados → recuperação → cartões → unidade/escala → gráfico com alternativa textual → teste integrado → implementação/evidências → ficha.

Antes de cada demonstração, peça uma previsão. Depois, uma pessoa opera e outra explica. O cenário Memórias tem seis registros fictícios: busca `praça` encontra dois; `praça` + `Lugar` encontra um; limpar restaura seis. A busca trata maiúsculas e espaços nas pontas, mas preserva acentos. EDA mantém a unidade dos valores; os dois cartões agregados contam indicadores e indicadores em atenção, não estudantes.

## Atividade, correção e documento final

| Etapa do laboratório | Tempo | Testes | Pontos máximos |
|---|---:|---:|---:|
| Estado da tela | 5 min | 4 | 2,0 |
| Busca e filtros | 7 min | 6 | 3,0 |
| Lista com identidade | 5 min | 4 | 2,0 |
| Resumo visual coerente | 8 min | 6 | 3,0 |

Cada teste vale 0,5. A pontuação acompanha as escolhas atuais e usa os mesmos critérios na tela, na impressão e no PDF. Cada critério só é avaliado quando suas escolhas necessárias foram respondidas; os demais continuam pendentes e valem zero. O denominador é sempre 10,0. Dicas e tentativas não descontam pontos, e nova conferência substitui a anterior. Os testes isolam a habilidade de cada critério usando referência correta nas demais; a prévia reúne todas as escolhas.

**A nota é formativa, não autenticada e não substitui I1, I2 ou I3.** A atividade roda no navegador, não no runtime Expo. Não há comprovação automática de autoria, execução no aparelho, commit ou compreensão individual.

A ficha registra equipe, componentes, projeto único, data, escolhas, resultados, reflexões, participação, arquivos modificados, commit, teste nativo/ambiente, requisito atendido, pendências e log de IA. A rubrica de implementação tem 20 cenários de 0,5 ponto, agrupados em quatro missões de 2,0/3,0/2,0/3,0. São confirmações da equipe, claramente separadas da nota automática do laboratório. Preencher nomes ou evidências não concede pontos. Pendências continuam explícitas no PDF; respostas, identificação e evidências incompletas não impedem exportar um rascunho.

O PDF usa A4, identidade institucional verde/vermelha, identificação, controle do documento, seções e paginação. Tela, impressão e PDF mostram a mesma pontuação atual, incluindo pendências. A versão para impressão depende das configurações do navegador. A geração do documento não comprova autoria nem execução nativa.

## Dados e privacidade

Nomes e respostas ficam na aba e nos arquivos que o estudante baixa. Não existe salvamento automático, login, envio a servidor ou integração de entrega. Guardar PDF não basta para reabrir campos: use a cópia JSON desta atividade. A importação aceita o esquema `mobile-a07-v1`, limita tamanho/campos e recalcula resultados; não aceita uma nota pronta vinda do arquivo.

**Não publique PDFs/JSONs identificados em repositórios públicos.** Use o canal de entrega combinado. As coleções do simulador são fictícias e reiniciam ao recarregar.

## Projeto executável, missões e código de apoio

Agora há um [starter Expo com duas trilhas](projeto/README.md), quatro funções a completar e [missões com contratos e critérios públicos](projeto/MISSOES.md). Ele está versionado no mesmo repositório da disciplina; não foi criado outro repositório remoto.

- **`npm run nota`** executa 20 testes de funções reais, mostra 0,0–10,0/100 XP e gera `entrega/resultado.json` e `entrega/resultado.html`.
- **App Expo:** usa as mesmas funções e o mesmo avaliador; o botão “Recalcular nota do código” mostra o resultado durante a implementação.
- **Relatório parcial:** o HTML pode ser impresso ou salvo como PDF com qualquer nota, sem exigir concluir as missões.
- **Integração:** a equipe transfere sua mudança para o app existente e registra a evidência na ficha.

O starter começa com quatro TODOs e nota zero. A interface fornecida organiza a atividade; o aluno precisa implementar estados, filtros, identidade e resumo. Executar os testes puros não exige instalar as dependências do Expo. Para iniciar a interface, siga o README do projeto.

`apoio/modelo.ts`, `dados.ts`, `PainelAula07.tsx` e `INTEGRAR.md` continuam sendo referências de consulta. Eles não substituem o código da equipe. Preserve tipos e IDs, adapte o callback de abrir detalhe e execute as verificações da base existente.

**Continuidade de domínio:** a Aula 06 cadastra ações na trilha EDA; a Aula 07 filtra indicadores. Não misture as coleções ou seus IDs. Em Memórias, mantenha a categoria da base da Aula 05 ou acrescente esse campo explicitamente quando sua versão ainda não o tiver.

## Notas que o aluno acompanha

| Instrumento | Escala | Origem e limite |
|---|---|---|
| Missões da aula | 0,0–10,0 / 100 XP | Respostas conceituais no material interativo |
| Laboratório da ficha | 0,0–10,0 | Comportamentos das escolhas no simulador HTML |
| Código do projeto | 0,0–10,0 / 100 XP | Testes executados sobre as funções escritas pelo aluno |
| Implementação na ficha | 0,0–10,0 | Autoavaliação dos cenários executados, com evidências e conferência docente |

As escalas não são somadas para fabricar uma nota oficial. Cada instrumento informa seu próprio progresso, seus critérios e suas pendências. A interface, o dispositivo, a autoria e a compreensão individual não são certificados pelo avaliador das funções.

## Fontes técnicas verificadas

- [React Native · FlatList](https://reactnative.dev/docs/flatlist)
- [React · estrutura do estado](https://pt-br.react.dev/learn/choosing-the-state-structure)
- [JavaScript · Array.filter](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [React Native · TextInput](https://reactnative.dev/docs/textinput)
- [React Native · acessibilidade](https://reactnative.dev/docs/accessibility)

Consulta técnica em 12/10/2026. A documentação confirma APIs e comportamento; os objetivos e a progressão vêm do plano fornecido.
