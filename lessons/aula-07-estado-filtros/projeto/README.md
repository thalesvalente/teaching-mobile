# Aula 07 — Projeto «Dados em movimento»

Um projeto **Expo + React Native executável**, com duas coleções fictícias e quatro missões para completar. A interface foi preparada; a lógica de estado, filtros, identidade e resumo fica em `src/missoes.mjs`, inicialmente com TODOs. A entrega inicial vale **0,0 / 10,0**: abrir o projeto não concede pontos.

[Missões e contratos](MISSOES.md) · [Registro de evidências](EVIDENCIAS.md) · [Ficha da equipe](../atividade.html) · [Integrar no app existente](../apoio/INTEGRAR.md)

## O que o aluno faz

1. Implementa uma missão em `src/missoes.mjs`.
2. Executa `npm run nota` e lê o resultado de cada critério.
3. Abre o app, experimenta os controles e corrige o comportamento.
4. Repete até o resultado desejado; registra o que ficou pendente.
5. Gera o relatório e transfere a lógica para o app da equipe, preservando navegação e cadastro.

O projeto está dentro de [`thalesvalente/teaching-mobile`](https://github.com/thalesvalente/teaching-mobile/tree/main/lessons/aula-07-estado-filtros/projeto). Não é um repositório remoto separado. Faça a atividade no fork ou na cópia de trabalho da equipe. Não sobrescreva o aplicativo já desenvolvido.

## Começar pelos testes — sem instalar dependências

Use Node **22.13 ou posterior**, conforme a base da disciplina. A avaliação usa somente recursos do Node:

```sh
cd lessons/aula-07-estado-filtros/projeto
node scripts/avaliar.mjs
```

O comando equivalente é `npm run nota`. Não exige `npm install` para corrigir as funções. O resultado aparece no terminal e gera:

- `entrega/resultado.json`: critérios, pontos, pendências e SHA-256 do código avaliado;
- `entrega/resultado.html`: relatório legível no navegador, com **Imprimir / salvar como PDF**.

O HTML e o PDF permitem **qualquer resultado parcial**, inclusive zero. Uma missão pendente não impede pontuar outra. A nota sempre usa o máximo fixo de **10,0**, sem renormalizar apenas as respostas prontas. Gerar o relatório não completa tarefas nem muda a nota.

## Executar a interface

As versões de Expo, React Native e bibliotecas foram copiadas da base da Aula 05 deste repositório; não é preciso atualizar os outros projetos.

```sh
npm ci
npm run web
```

Se estiver trabalhando com uma cópia sem `package-lock.json`, use `npm install` uma vez e guarde o lockfile gerado com o projeto. Para o aparelho, use `npm start` e um cliente compatível com a versão de Expo da base; `npm run android` e `npm run ios` dependem do respectivo ambiente nativo. A prévia Web já permite realizar as missões; registrar teste no celular exige realmente executá-lo.

A tela apresenta a nota calculada pelas funções do aluno. Após editar, use **Recalcular nota do código**. O botão não concede XP: executa novamente os mesmos critérios do terminal.

```sh
npm run typecheck
npm test
```

`npm test` gera os mesmos relatórios e termina com código de erro enquanto houver critérios pendentes ou falhando. Isso é esperado no starter e evita anunciar aprovação incompleta. Para consultar ou exportar uma nota parcial sem essa sinalização, use `npm run nota`.

## Como os pontos funcionam

| Missão | Função do aluno | Critérios | Pontos | XP |
|---|---|---:|---:|---:|
| M1 — Estado da tela | `classificarTela` | 4 | 2,0 | 20 |
| M2 — Busca e filtros | `filtrar` | 6 | 3,0 | 30 |
| M3 — Lista com identidade | `prepararLista` | 4 | 2,0 | 20 |
| M4 — Resumo visual | `resumir` | 6 | 3,0 | 30 |
| **Total** | | **20** | **10,0** | **100** |

Cada critério confirmado vale **0,5 ponto = 5 XP**. Pendência ou falha vale zero. Dicas e novas tentativas não descontam pontos. Reexecutar substitui a nota anterior; os pontos não se acumulam entre execuções. O teste verifica as duas trilhas quando o comportamento é comum.

Os níveis mostram o avanço: **Primeiros passos** (menos de 3), **Em construção** (3 a 6,5), **Explorador de dados** (7 a 9,5) e **Missão concluída** (10). O nível não altera a fórmula.

## Três resultados distintos, todos visíveis

| Resultado | Origem | O que comprova |
|---|---|---|
| Nota do laboratório HTML | Ficha da aula | Escolhas feitas no simulador didático |
| Nota do código deste projeto | `npm run nota` ou botão no app | Comportamentos das quatro funções executadas nos casos de teste |
| Autoavaliação da implementação | Rubrica e evidências da ficha | Declaração da equipe sobre o app, sujeita à conferência docente |

Não some essas notas para fabricar uma nota oficial. Os testes puros não verificam leitor de tela, autoria, qualidade visual nem execução em aparelho. A equipe sabe os pontos conquistados e os critérios da conferência; o professor aplica os instrumentos de avaliação da disciplina.

## Continuidade entre as trilhas

- **Memórias:** cada registro deste starter tem `categoria`. Ao integrar com a referência da Aula 06, preserve os campos que sua equipe já usa e acrescente a categoria quando ela ainda não existir. Não atribua categorias fictícias a registros reais.
- **Permanência escolar:** a Aula 06 cadastra **ações**; a Aula 07 analisa **indicadores**. São coleções diferentes. Não use o ID de indicador para abrir uma rota de ação. Este starter usa uma rota de detalhe própria, que recebe trilha e ID.
- **Busca:** trata maiúsculas e espaços nas pontas; preserva acentos. `praça` encontra dois registros em Memórias. `praca` não tem o mesmo comportamento nesta regra.
- **Dados e gráficos:** porcentagens usam escala fixa 0–100%; quantidades de estudantes ficam em texto, fora desse eixo. As coleções não descrevem pessoas ou comunidades reais.

## Entrega

Registre na ficha o commit, os arquivos alterados, o ambiente, a nota do código, os resultados observados e as pendências. Abra `entrega/resultado.html`, confira a pontuação e salve o PDF, mesmo que ainda incompleto. A pasta `entrega/` é ignorada pelo Git para evitar publicar documentos de avaliação por acidente. Envie pelo canal combinado com o professor.

O SHA-256 identifica o arquivo usado nesta execução; não é assinatura, autenticação de autoria ou proteção contra adulteração. A nota apresentada é formativa e verificável pelo professor reexecutando o projeto.
