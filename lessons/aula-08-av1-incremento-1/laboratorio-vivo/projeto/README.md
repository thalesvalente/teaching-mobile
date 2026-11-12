# Aula 08 v4 — projeto Expo da bancada

Este projeto reutiliza a candidata avançada v3 e as dependências Expo já adotadas, mas importa **o mesmo arquivo `../shared/ProjetoUniversal.tsx` da bancada**, sem manter uma segunda cópia do motor. O projeto v3 com Expo Router permanece preservado em `../../avancado/projeto` como aprofundamento de navegação. A v4 reúne navegação de estados, filtros, formulário, idempotência e resumo em uma bancada única.

## Executar

Na pasta `laboratorio-vivo/projeto`, usando Node 22.13+ e npm 10+:

```sh
npm ci
npm run typecheck
npm run avaliar
npm run web
```

Para Android/iOS, use `npm start` e abra o projeto em um Expo Go compatível com o SDK fixado no lockfile ou use `npm run android` / `npm run ios` com os ambientes nativos instalados. Isso exige teste real separado; a prévia React Native Web **não é emulador Android/iOS**.

Para levar a edição da bancada ao Expo, clique **Baixar .tsx** e substitua `laboratorio-vivo/shared/ProjetoUniversal.tsx`. O wrapper `App.tsx` continuará importando essa fonte. Preserve o diretório pai e `criteria.js`, `runtime-compiler.js`, `assets/vendor.js` ao baixar o repositório.

## Critérios e resultado

Os 20 testes vêm de `../criteria.js`, o mesmo módulo usado pela bancada. O starter contém pendências deliberadas: `npm run avaliar` registra 0/20 e explica cada falha; `npm run test:starter` comprova esse estado. `npm test` só termina com sucesso quando os 20 critérios passam.

Cada critério corresponde a 5 XP formativos e a 0,5 ponto na **rubrica técnica sujeita à validação docente**. O JSON `entrega/resultado-tecnico.json` traz hash SHA-256 da fonte, 20 resultados, origem local e `officialGrade: null`. O relatório pode ser adulterado pelo autor e não é certificado de nota.

O avaliador usa worker local sem variáveis de ambiente herdadas, com limite de 8 s e heap de 160 MiB. Isso ajuda contra erros comuns e não é uma fronteira de segurança para executar código hostil. Não execute trabalho de terceiros em uma máquina com credenciais de produção; a avaliação institucional requer conferência docente.

## Validar no aparelho

Registre modelo, sistema, versão do Expo e commit. Confira: estados de carregamento/erro/vazio/sem resultados; retorno do detalhe preservando filtros; formulário inválido com mensagens; toque duplo sem duplicação; teclado; rolagem; foco e leitor de tela; reinício da aplicação. Esta entrega não declara esses testes nativos executados.

A solução de referência é gerada apenas pelo teste QA fora do projeto do aluno e não integra o bundle nem o arquivo inicial. O repositório público permite consultar testes: essa separação não promete sigilo das implementações de QA.

## Servir a bancada estática

Sirva a raiz do repositório por HTTP em `http://127.0.0.1:PORTA` ou `http://localhost:PORTA`. A CSP da prévia autoriza somente os quatro scripts locais de runtime nos caminhos `/lessons/aula-08-av1-incremento-1/laboratorio-vivo/` e `/teaching-mobile/lessons/aula-08-av1-incremento-1/laboratorio-vivo/`, além do endereço canônico `https://thalesvalente.github.io/teaching-mobile/`. Depois do carregamento inicial, uma política cumulativa bloqueia novas fontes de script. A compilação permanece dentro do iframe de origem opaca; conexões, imagens externas e serviços privilegiados continuam bloqueados. Outro domínio de hospedagem exige revisar explicitamente essa lista; não use curingas de domínio nem retire `sandbox="allow-scripts"`.
