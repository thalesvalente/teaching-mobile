# MOBILE A08 V4 — handoff operacional

## Retomar deste ponto

Usar a mesma branch `feat/aula08-lab-vivo-ciclos-20261111` e a [PR #7](https://github.com/thalesvalente/teaching-mobile/pull/7). Conferir o HEAD e a CI exata; não voltar à v2, não recriar a planilha da turma e não refazer auditorias válidas em conteúdo idêntico. A v3 permanece complementar; a PR histórica #4 está preservada.

Arquivos centrais: [readback](MOBILE_A08_V4_READBACK.md), [implementação](MOBILE_A08_V4_IMPLEMENTATION.md), [integração](MOBILE_A08_V4_INTEGRATION.md), [segurança](MOBILE_A08_V4_SECURITY_REVIEW.md), [QA](MOBILE_A08_V4_QA.md), [release](MOBILE_A08_V4_RELEASE.md) e [matriz20](MOBILE_A08_V4_CRITERIA.md).

## Checkpoint de código pronto

`303e4751abfb9105f9efa7c205adb6ec8f35d0b0` mantém cinco runs verdes, 27 checks C3 por engine e vinte missões aprovadas. A PR #7 está pronta para revisão e sem merge; main permanece em `d329d12007ca3d989cfbaa01c1e126479f6a8e39`. [Readback da retomada](aula08-v4-evidencias/qa-google-preparacao-20261112/github-readback.json). A fonte é idêntica à base revisada em 825ce143; esta consolidação altera somente documentação/evidências. Observar a CI do novo SHA se houver commit, sem refazer reparos ou simular resultados.

## Estado do receptor

- Planilha de produção existente: `1pkbf3rJD3R5-lX7TuOyfir0A4ID1m2QfUg8ZIfNOeT0`.
- Atividade: `MOBILE-A08-2026`; contrato: `mobile-a08-lab-v4`; bimestre: 4; Habilitada: FALSE no readback.
- Frontend: `PROD_ENDPOINT = ''`; `PROD_RELEASE_ENABLED = false`.
- Código preparado: `mobile-notas-4.1.0`.
- Projeto QA independente privado: `1ovzrG-dYeR4evHeFcV4M5vNA1kjKUdZi1sFcL3dVbzjtOVhgDeEdOOWJ`; planilha QA privada: `1BTl0lw_tGDaQOIBOxy5eCDSRuvv-skc6hXX8yte6X3A`.
- Código/manifesto salvos e conferidos byte a byte; oito propriedades QA, duas flags falsas e nenhuma propriedade PROD. Dez abas e 115 células da fixture conferidas; locale/fuso ajustados exclusivamente no QA.
- OAuth, execuções, bootstrap, implantação versionada e `/exec`: **NOT_RUN**, nenhum endpoint criado.
- **Preparação QA pronta para aprovação específica**; `MOBILE_A08_V4_READY_FOR_EXACT_APPROVAL` somente para OAuth/QA. A liberação global continua **BLOCKED**; PROD não foi instalado/ativado por esta missão.

## Próxima ação: aprovação exata do QA preparado

A conta Apps Script coincide com a conexão Google. A [retificação](aula08-v4-evidencias/qa-google-preparacao-20261112/evidence-correction.json) retira a inferência anterior de incompatibilidade e preserva a evidência histórica. O projeto `teaching-mobile-entregas-2026`, criado em 21/10 e modificado em 23/10, foi observado somente no overview; não foi usado como prova ou fonte da v4.

Usar os recursos QA acima, já preparados e privados; não criar outra planilha de produção nem recriar o QA. A [revisão C3 da preparação](aula08-v4-evidencias/qa-google-preparacao-20261112/independent-review.json) é PASS nesse escopo. Conferir a [proposta concreta de aprovação](MOBILE_A08_V4_RELEASE.md#aprovação-exata-preparada-somente-qa): dois escopos OAuth (`spreadsheets`, amplo sobre as planilhas da conta, e `userinfo.email`), Web App QA como proprietário com acesso anônimo, bootstrap, ativação temporária, testes sintéticos e fechamento ao final. O botão Deploy não foi clicado.

Somente após aprovação específica, executar o [runbook](../integrations/mobile-aula08-appscript/README.md): revalidar hashes/IDs, conceder os dois escopos, executar `prepararAmbienteQAMobile()`, implantar a versão QA e registrar a URL `/exec` realmente emitida, depois liberar QA temporariamente. A prévia deve usar `?qa=1`, a origem `http://127.0.0.1:8138` e somente esse endpoint. O health deverá identificar QA, SYNTHETIC_ONLY, versão 4.1.0 e o destino isolado, mas o health sozinho não homologa a integração.

Executar interface → Apps Script → planilha QA → recibo → readback → reconciliação. Registrar falhas e incertezas, sem reenvio cego com nonce novo. Ao terminar, definir `MOBILE_NOTAS_QA_SUBMISSIONS_ENABLED=false` e preservar segredo/auditoria/recibos. Antes do consentimento, cancelar o formulário não cria endpoint; após consentimento, revogação OAuth ou arquivamento da implantação exige autorização própria. Não incluir efeitos PROD nessa aprovação.

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
