# MOBILE A08 V4 — prévia e gates de liberação

## Estado operacional

**Preparação QA pronta para aprovação específica.** O estado **MOBILE_A08_V4_READY_FOR_EXACT_APPROVAL** tem escopo exclusivo nos dois consentimentos OAuth e no Web App QA descritos abaixo. O projeto e a planilha QA privados estão preparados; o parecer independente da preparação é PASS. Não houve execução Apps Script, concessão OAuth, implantação versionada ou criação de `/exec`.

A liberação global continua **BLOCKED**: faltam o ciclo conectado QA e os demais gates nativos, assistivos, docentes e de produção. Não se declara `COMPLETE` nem `READY_FOR_RELEASE`. A aprovação solicitável agora é de QA; não autoriza merge, Pages, Apps Script PROD, dados reais ou notas oficiais.

## Checkpoint técnico aprovado

A [PR #7](https://github.com/thalesvalente/teaching-mobile/pull/7) está aberta e pronta para revisão, com `mergeable=true`, estado `clean` e sem merge no readback da retomada. Seu checkpoint conferido é **`303e4751abfb9105f9efa7c205adb6ec8f35d0b0`**, árvore **`79c20543498f1b92f839b6262150b4f95c8412d7`**. As cinco execuções Actions, de quatro workflows, permanecem verdes; nenhuma foi reexecutada na leitura da retomada. A main continua em `d329d12007ca3d989cfbaa01c1e126479f6a8e39`. [Readback GitHub atual](aula08-v4-evidencias/qa-google-preparacao-20261112/github-readback.json).

| Verificação | Evidência conectada | Resultado |
|---|---|---|
| V4 push | [43131091449](https://github.com/thalesvalente/teaching-mobile/actions/runs/43131091449) | SUCCESS |
| V4 PR | [43131097912](https://github.com/thalesvalente/teaching-mobile/actions/runs/43131097912) | SUCCESS |
| Aula 07 | [43131097997](https://github.com/thalesvalente/teaching-mobile/actions/runs/43131097997) | SUCCESS |
| Aula 08 histórica | [43131097870](https://github.com/thalesvalente/teaching-mobile/actions/runs/43131097870) | SUCCESS |
| Build do portal | [43131097965](https://github.com/thalesvalente/teaching-mobile/actions/runs/43131097965) | SUCCESS; publicação/deploy SKIPPED |

A revisão independente executou **27/27 cenários em Chromium, Firefox e WebKit**. O teste autoral percorreu as vinte missões pela interface, 5→100 XP, e os fluxos de componente, teclado, dois formulários, regressão, PDF/JSON e bloqueio de produção. Os dois Expo passaram `npm ci`, TypeScript, starter e build Web. A raiz passou 170 testes; o contrato da bancada passou 13.

O SHA 303e4751 consolidou documentação e evidências da fonte testada em 825ce143 e teve sua própria CI verde. Esta retomada acrescenta somente documentação e evidência Google, sem alterar fonte, testes ou workflows. A evidência técnica anterior permanece válida para o código idêntico; se um novo commit documental for publicado, seus checks serão observados no SHA exato e registrados na PR, sem inventar um hash futuro nem criar um ciclo de commits autocitantes. Não existe autorização implícita de merge.

## Mudança preparada

| Destino | Mudança candidata | Impacto | Reversão |
|---|---|---|---|
| Branch v4 | Código, testes, docs e reconciliação main→v4 | Somente desenvolvimento/PR | Preservar commits e reverter a mudança na branch |
| Portal Mobile | Link canônico da bancada, mantendo aulas anteriores | Publicável apenas após aprovação | Revert do commit de integração do portal |
| Pages | Prévia `_site` produzida por CI, sem deploy | Artefato para inspeção | Nenhum efeito público a reverter nesta missão |
| Apps Script QA | Projeto privado independente, fonte 4.1.0 exata e oito propriedades salvas | Consentimento dos dois escopos e Web App anônimo aguardam aprovação específica | Cancelar formulário antes do consentimento; após ativação, fechar recebimento preservando segredo/histórico |
| Apps Script PROD | Preparação aponta à planilha existente; flags falsas | Instalação/ativação exigem aprovação específica futura | Bloquear recepção e frontend; preservar chave e histórico |
| Planilha PROD existente | Nenhuma escrita nesta execução | Continua atividade desabilitada | Não houve mutação |
| Planilha QA isolada | Fixture sintética, dez abas e 115 células verificadas; locale/fuso corrigidos só no QA | Privada, sem permissão pública; não recebe entregas ainda | Preservar recurso, dados e evidências; sem exclusão automática |

## Prévia verificável

Workflow: `.github/workflows/qa-aula08-live-v4.yml`. O job `previa` produz `mobile-a08-v4-site-preview-<SHA>` e o job `navegador` produz evidências/PDF/JSON. Os arquivos `tested-sha.txt`, `tested-tree.txt` e `mobile-a08-preview-manifest.json` identificam a fonte.

Prévia do código aprovado: artifact **13903898267**, `mobile-a08-v4-site-preview-825ce143fe4f6dcb5f8d1903f5441c50cebdec64`, no [run 43129942677](https://github.com/thalesvalente/teaching-mobile/actions/runs/43129942677). SHA-256 do ZIP: `b07a98f9bc74a09407b916170bcf154fe7214dc525586d5fc9fcc4b848488073`. O arquivo foi baixado e seu hash foi conferido com a API GitHub. O artifact expira em 12/12/2026; os exemplos e relatórios essenciais estão versionados em `docs/aula08-v4-evidencias/ci-825ce/`.

Exemplos revisáveis: [PDF A4 fictício com 5 XP](aula08-v4-evidencias/ci-825ce/relatorio-exemplo-ficticio.pdf), [JSON correspondente](aula08-v4-evidencias/ci-825ce/continuidade-exemplo-ficticio.json), [desktop 1440](aula08-v4-evidencias/ci-825ce/viewport-1440.png) e [móvel 390](aula08-v4-evidencias/ci-825ce/viewport-390.png). A [revisão independente](aula08-v4-evidencias/ci-825ce/c3-final-review.json) relaciona todos os tamanhos, hashes e limites.

URL canônica **planejada para após publicação**:

`https://thalesvalente.github.io/teaching-mobile/lessons/aula-08-av1-incremento-1/laboratorio-vivo/`

Essa URL não é apresentada como v4 publicada. Para inspecionar o artifact localmente, extraia o conteúdo em uma pasta chamada `teaching-mobile`, sirva a pasta pai por HTTP e abra `/teaching-mobile/lessons/aula-08-av1-incremento-1/laboratorio-vivo/`. O receptor permanece desabilitado.

## Aprovação exata preparada somente QA

Recursos: [projeto QA privado](https://script.google.com/home/projects/1ovzrG-dYeR4evHeFcV4M5vNA1kjKUdZi1sFcL3dVbzjtOVhgDeEdOOWJ) e [planilha QA privada](https://docs.google.com/spreadsheets/d/1BTl0lw_tGDaQOIBOxy5eCDSRuvv-skc6hXX8yte6X3A/edit). O código e o manifesto salvos correspondem ao SHA 303e4751; os hashes completos estão no [readback de propriedades](aula08-v4-evidencias/qa-google-preparacao-20261112/script-properties-readback.json). O [parecer independente](aula08-v4-evidencias/qa-google-preparacao-20261112/independent-review.json) aprovou a preparação e manteve OAuth, implantação, bootstrap e ciclo conectado como NOT_RUN.

| Mudança exata proposta | Impacto que requer aprovação |
|---|---|
| Conceder `https://www.googleapis.com/auth/spreadsheets` ao projeto QA | Permite ler, editar, criar e excluir planilhas da conta. A concessão OAuth é ampla e não fica restrita à planilha QA; o código/configuração revisados delimitam os efeitos da missão |
| Conceder `https://www.googleapis.com/auth/userinfo.email` ao mesmo projeto | Permite obter a identidade por e-mail usada nas verificações de sessão e no vínculo administrativo privado; não é acesso ao Gmail |
| Criar Web App QA com `executeAs=USER_DEPLOYING` e `access=ANYONE_ANONYMOUS` | Endpoint público sem login do visitante, executando com a autoridade do proprietário. A opção visual Anyone corresponde ao acesso anônimo da proposta; `ANYONE` no manifesto exige usuário logado |
| Executar bootstrap, ativar QA temporariamente, testar e fechar recepção | Cria administrador/segredo somente no projeto QA, permite registros exclusivamente fictícios durante a homologação e encerra novos recebimentos ao final |

Fontes oficiais: [alcance dos escopos Sheets](https://developers.google.com/workspace/sheets/api/scopes), [identidade Session](https://developers.google.com/apps-script/reference/base/session) e [acesso/identidade de Web Apps](https://developers.google.com/apps-script/manifest/web-app-api-executable). A planilha e o projeto Apps Script permanecem privados: não se propõe compartilhar o arquivo nem conceder acesso ao editor. Nenhum consentimento foi solicitado/concedido e **Deploy não foi clicado**. [Proposta observada](aula08-v4-evidencias/qa-google-preparacao-20261112/deployment-proposal.json).

Após aprovação explícita deste conjunto:

1. Conferir novamente os dois recursos, os hashes da fonte, modo QA e ausência de propriedades PROD.
2. Conceder somente os dois escopos declarados e executar `prepararAmbienteQAMobile()` no editor autenticado. O administrador e o HMAC ficam privados; não registrar seus valores em logs, Git ou relatórios.
3. Criar a implantação versionada QA com os valores de execução/acesso acima; registrar ID, versão e URL `/exec` efetivamente retornados.
4. Executar `liberarRecebimentoQAMobile()` apenas nesse projeto e testar o ciclo interface → Apps Script → planilha QA → recibo → readback → reconciliação com identidades/evidências sintéticas.
5. Desabilitar `MOBILE_NOTAS_QA_SUBMISSIONS_ENABLED` ao concluir; preservar recibos, auditoria, planilha e segredo para readback reproduzível.

Essa autorização não abrange produção, merge/Pages, estudantes reais, notas oficiais, recursos históricos/Web/PPI, compartilhamento da planilha ou exclusões. A preparação atual não substitui a resposta humana a essa proposta.

## Gates para qualquer aprovação de produção

| Gate | Evidência exigida |
|---|---|
| Código e CI | Todos os jobs exigidos verdes no SHA exato proposto para integração |
| Revisão | Parecer técnico/segurança independente, sem falha crítica aberta |
| Pedagogia | Aceite docente da rubrica vinte × 0,5 e composição da equipe |
| Contrato | Cliente 4.1.0, backend 4.1.0, headers e catálogo alinhados |
| Google QA | Interface → Apps Script → planilha QA → recibo → readback → reconciliação |
| Identidade | Cadastro real conferido e aceite do limite de identidade declarada por matrícula |
| Reenvios | Duplicata, maior/menor nota validada, timeout e falha parcial homologados |
| Publicação | Diff e artefato revisados; canonical path; main/Pages explicitamente autorizados |
| Reversão | Bloqueio de frontend/receptor e rollback identificados, sem apagar histórico |
| Aprovação | Texto do usuário vinculando operação, ambiente, recursos e SHA exatos |

## Operações ainda não autorizadas

Merge na main, publicação Pages, instalação/atualização Apps Script PROD, ativação de recebimento real, cadastro de estudantes reais, compartilhamentos, escrita histórica, lançamento oficial e exclusão permanecem fora da execução atual. A autorização de revisão da PR não autoriza essas operações.

A alegação anterior de conta incompatível foi uma inferência incorreta, retirada pela [retificação de evidência](aula08-v4-evidencias/qa-google-preparacao-20261112/evidence-correction.json). O projeto Mobile histórico observado no overview não comprova alinhamento v4. A limitação atual é a decisão específica sobre consentimento OAuth e exposição do endpoint QA; os recursos de preparação já existem. Não se deve recriá-los nem apresentar a ausência anterior de conector Apps Script como incapacidade da superfície de navegador disponível.

## Plano de reversão preparado

**QA antes do consentimento:** cancelar o formulário preparado sem conceder OAuth ou criar endpoint; conservar os recursos privados já preparados. **QA depois de ativação aprovada:** definir `MOBILE_NOTAS_QA_SUBMISSIONS_ENABLED=false` e preservar segredo, auditoria e recibos. Revogar a concessão OAuth QA ou arquivar a implantação exige autorização própria; não apagar recursos nem histórico.

**Produção futura:** registrar SHA anterior da main, SHA candidato, configuração Pages, ID/versão da implantação Apps Script e evidência QA. Após aprovação, cada efeito deverá ter readback.

Se houver problema após publicação, desabilitar primeiro novas recepções via configuração e facade administrativa autenticada. Reverter frontend/commit do portal para o SHA anterior revisado. Não apagar auditoria, resultados ou recibos; não regenerar segredo HMAC com histórico existente. Erro parcial exige diagnóstico e reparo especificamente aprovado, mantendo evidência original.
