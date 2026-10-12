# Aula 07 — Estado, filtros e visualização de dados

**Professor:** Prof. Dr. Thales Levi Azevedo Valente  
**Turma:** 3º ano do Técnico em Informática Integrado · IFMA Campus Itapecuru-Mirim  
**Material:** 1.0.0 · HTML interativo, sem instalação ou envio automático de respostas.

[Abrir aula](index.html) · [Abrir ficha e oficina](atividade.html) · [Como integrar o código](apoio/INTEGRAR.md)

## Base e limites

O Plano de Ensino de Programação para Dispositivos Móveis 2026.2, arquivo fornecido `Plano_de_Ensino_Programacao_Dispositivos_Moveis_2026_4(2).md`, define o encontro 7 (data planejada: 16/09) como **Estado, filtros e visualização de dados**. Prevê FlatList, eventos, carregamento, vazio e erro com dados simulados; lista e filtro de pontos para Memórias; cartões, filtro e primeiro gráfico local para EDA; preparação do portfólio e Incremento 1. O plano disponível se identifica como rascunho com pendência de calendário. Este material não confirma sua publicação no SUAP nem realiza lançamento no diário.

A Aula 6 e seus arquivos foram preservados. As funções desta aula operam sobre uma projeção de leitura da coleção; não substitua os dados, o cadastro, as rotas ou providers da equipe. API/HTTP, persistência, MapView e bibliotecas de gráficos especializadas não são requisitos novos desta entrega.

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

Cada teste vale 0,5. Ele só é avaliado depois de preenchidas as escolhas da etapa. Dicas e tentativas não descontam pontos; nova conferência substitui a anterior. Alterar uma escolha invalida os resultados daquela etapa até nova conferência. O PDF sempre recalcula a pontuação. Os testes isolam a habilidade de cada etapa usando referência correta nas outras; a prévia reúne todas as escolhas.

**A nota é formativa, não autenticada e não substitui I1, I2 ou I3.** A atividade roda no navegador, não no runtime Expo. Não há comprovação automática de autoria, execução no aparelho, commit ou compreensão individual.

A ficha registra equipe, componentes, projeto único, data, escolhas, resultados, reflexões, participação, arquivos modificados, commit, teste nativo/ambiente, requisito atendido, pendências e log de IA. Se a equipe declarar implementação testada, precisa descrever arquivos e teste; isso não concede nota automaticamente. Pendências continuam explícitas no PDF.

O PDF usa A4, identidade institucional verde/vermelha, capa, controle do documento, seções, texto justificado e paginação. O gerador é uma adaptação isolada do utilizado na Aula 6; o arquivo anterior não é alterado. Caracteres fora das fontes padrão são sinalizados, sem substituição silenciosa; a versão para impressão preserva esses textos via navegador. A impressão alternativa depende das configurações de impressão do dispositivo.

## Dados e privacidade

Nomes e respostas ficam na aba e nos arquivos que o estudante baixa. Não existe salvamento automático, login, envio a servidor ou integração de entrega. Guardar PDF não basta para reabrir campos: use a cópia JSON desta atividade. A importação aceita o esquema `mobile-a07-v1`, limita tamanho/campos e recalcula resultados; não aceita uma nota pronta vinda do arquivo.

**Não publique PDFs/JSONs identificados em repositórios públicos.** Use o canal de entrega combinado. As coleções do simulador são fictícias e reiniciam ao recarregar.

## Código de apoio

`apoio/modelo.ts`, `dados.ts`, `PainelAula07.tsx` e `INTEGRAR.md` também estão no botão **Código** da apresentação. São referências para integração, não um projeto Expo completo e não uma ordem de sobrescrever o aplicativo. Preserve tipos e IDs, adapte o callback de abrir detalhe e execute as verificações do projeto existente.

A sintaxe TS/TSX e funções puras foram verificadas localmente; a integração de tipos/imports com a baseline da equipe e a execução nativa são etapas a realizar no ambiente real. Ver detalhes em `QA.md`.

## Fontes técnicas verificadas

- [React Native · FlatList](https://reactnative.dev/docs/flatlist)
- [React · estrutura do estado](https://pt-br.react.dev/learn/choosing-the-state-structure)
- [JavaScript · Array.filter](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [React Native · TextInput](https://reactnative.dev/docs/textinput)
- [React Native · acessibilidade](https://reactnative.dev/docs/accessibility)

Consulta técnica em 12/10/2026. A documentação confirma APIs e comportamento; os objetivos e a progressão vêm do plano fornecido.
