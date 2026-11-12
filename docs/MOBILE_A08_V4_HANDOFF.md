# MOBILE A08 V4 — handoff operacional

## Retomar deste ponto

Usar a mesma branch `feat/aula08-lab-vivo-ciclos-20261111` e a PR correspondente. Conferir o HEAD e a CI exata; não voltar à v2, não recriar a planilha da turma e não refazer auditorias válidas em conteúdo idêntico. A v3 permanece complementar; a PR histórica #4 está preservada.

Arquivos centrais: [readback](MOBILE_A08_V4_READBACK.md), [implementação](MOBILE_A08_V4_IMPLEMENTATION.md), [integração](MOBILE_A08_V4_INTEGRATION.md), [segurança](MOBILE_A08_V4_SECURITY_REVIEW.md), [QA](MOBILE_A08_V4_QA.md), [release](MOBILE_A08_V4_RELEASE.md) e [matriz20](MOBILE_A08_V4_CRITERIA.md).

## Estado do receptor

- Planilha de produção existente: `1pkbf3rJD3R5-lX7TuOyfir0A4ID1m2QfUg8ZIfNOeT0`.
- Atividade: `MOBILE-A08-2026`; contrato: `mobile-a08-lab-v4`; bimestre: 4; Habilitada: FALSE no readback.
- Frontend: `PROD_ENDPOINT = ''`; `PROD_RELEASE_ENABLED = false`.
- Código preparado: `mobile-notas-4.1.0`.
- Projeto vinculado, implantação, propriedades e `/exec`: não confirmados.
- Google QA conectado: **BLOCKED_EXTERNAL_DEPLOYMENT**. PROD não instalado/ativado por esta missão.

## Ação externa mínima pendente

Na conta Google correta, conferir primeiro se existe projeto Mobile v4 associado. Disponibilizar acesso autorizado à superfície de Apps Script ou instalar manualmente o pacote específico de [integração Mobile](../integrations/mobile-aula08-appscript/README.md). O pacote já inclui manifesto, propriedades QA/PROD desabilitadas e fixture exclusivamente fictícia. Nenhum dado ou segredo de Web/PPI/histórico é necessário.

Criar **apenas ambiente QA isolado**, se ainda inexistente, e registrar IDs/versão/URL realmente observados. A criação de outra planilha de produção é proibida. Se a publicação Web App exigir mudança de acesso/compartilhamento, obter a aprovação específica dessa configuração antes de aplicá-la.

Com o QA disponível, abrir a candidata localmente com `?qa=1`, configurar explicitamente o endpoint QA e conferir que a resposta identifica `QA`, `SYNTHETIC_ONLY`, versão 4.1.0 e destino diferente de todos os IDs protegidos. Executar o ciclo real interface → Apps Script → planilha QA → recibo → readback → reconciliação. A matriz de cenários está no relatório de integração. Registrar falhas e incertezas, sem reenvio cego com nonce novo.

## Outras pendências reais

1. Verificação Android/iOS em aparelho/emulador real, com versão do sistema/Expo, commit e evidência. Build Web não substitui esse teste.
2. Revisão humana com teclado/leitor de tela e inspeção do PDF, complementando axe e reflow automatizados. Não declarar conformidade WCAG integral apenas por automação.
3. Aceite docente da rubrica e da política de identidade declarada; validar composição/cadastro da turma somente com autorização específica.
4. Depois dos gates de QA, apresentar SHA/diff, recursos, efeitos e rollback exatos para aprovar separadamente merge/Pages, implantação/ativação PROD e lançamento oficial de notas.

## Comandos de reprodução

Na raiz do checkout:

```sh
npm ci
npm run test:workflows
npm test
node --test tests/aula08-v4-contract.cjs
npx playwright install chromium
node tests/aula08-live-v4-browser.cjs
node tests/independent-aula08-v4-browser.cjs
node scripts/build-aula08-preview.mjs
node scripts/verify-mobile-pages.mjs _site
```

Em cada projeto Expo v4/v3:

```sh
npm ci
npm run typecheck
npm run test:starter
```

No v4, `npx expo export --platform web --output-dir dist` verifica empacotamento Web. O comando `npm test` do projeto do aluno é estrito e falha enquanto o starter estiver incompleto; isso é comportamento esperado, não defeito mascarado da CI. A suíte QA testa separadamente a solução de referência.

## Dados e incidentes

XP permanece formativo. Receber PDF/evidência não autoriza nota. O servidor guarda `PENDENTE_VALIDACAO`; revisão docente autenticada cria novo evento assinado e somente notas validadas entram no boletim. Preserve as evidências originais e as reservas em estados incertos. Não apagar registros para “resolver” divergências e não trocar chave HMAC sem procedimento de migração aprovado.
