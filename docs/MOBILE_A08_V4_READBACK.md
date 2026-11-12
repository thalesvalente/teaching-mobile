# MOBILE A08 V4 — readback conectado

Data de referência da missão: **11/11/2026**, America/Fortaleza. Os recibos JSON registram os horários efetivos em UTC. Este documento registra a entrada da missão; não atribui resultados futuros ao checkpoint.

## Baseline conferido antes das alterações

| Recurso | Observação conectada | Relação com checkpoint |
|---|---|---|
| `main` | `d329d12007ca3d989cfbaa01c1e126479f6a8e39` | Igual |
| `feat/aula08-lab-vivo-ciclos-20261111` | `e429771c3dd7483dbd513d0b6be7ee4cf6e1c2e3` | Igual |
| `feat/aula08-desafio-avancado-v3-20261111` | `3be105d1de2c5f917851fa18278ba72f0116c177` | Igual; ancestral da v4, 29 commits atrás |
| [PR histórica #4](https://github.com/thalesvalente/teaching-mobile/pull/4) | Aberta, Draft; HEAD `a2c3becd0f55042f9bef5135cda68ca63fee6ec6` | Preservada, sem merge ou escrita |
| PR v4 | Nenhuma PR correspondente na leitura inicial | Criar uma única PR após integração |
| [Run 43108593937](https://github.com/thalesvalente/teaching-mobile/actions/runs/43108593937) | `completed/failure`, zero jobs, mesmo SHA v4 | Falha anterior à execução dos testes |

Leituras: conector GitHub autenticado e `git ls-remote`; clone com todos os refs, comparação de ancestralidade e `git merge-tree` sem alterar refs remotas. A v4 não continha três commits da main publicados em 28/10/2026; o merge de main **para a candidata** exige resolver somente `index.html`. A correção preserva os aplicativos e links existentes e acrescenta o acesso canônico à bancada. Isso não é merge na main.

## Inventário e diferenças

| Componente | Localização | Estado de entrada |
|---|---|---|
| Bancada única v4 | `lessons/aula-08-av1-incremento-1/laboratorio-vivo/` | 20 missões, TSX editável, preview, XP, equipe, PDF/JSON existentes |
| Fonte TSX da bancada | `laboratorio-vivo/shared/ProjetoUniversal.tsx` | Starter com pendências; precisa projeto Expo reprodutível |
| Projeto avançado v3 | `avancado/projeto/` | Preservado na ancestralidade; sem lockfile |
| Backend Mobile | `integrations/mobile-aula08-appscript/Code.gs` | `mobile-notas-4.0.0`, cálculo XP/10 promove declaração a boletim |
| Configuração receptor | `laboratorio-vivo/entrega-config.js` | `PROD_ENDPOINT = ''`, `PROD_RELEASE_ENABLED = false` |
| Avaliador navegador | `laboratorio-vivo/preview.js` | 20 IDs; teste browser existente cobre positivamente apenas um |
| CI v4 | `.github/workflows/qa-aula08-live-v4.yml` | YAML inválido na linha 25; sem gatilho push |
| QA histórico | `tests/mobile-entregas-aula08.test.cjs` | Exercita backend histórico da Aula 07, não Code.gs v4 |

### Causa da falha de workflow

`- name: Laboratório: contratos, 20 missões, navegador e XP` contém dois-pontos seguido de espaço em escalar não citado. Parser reproduziu `mapping values are not allowed here`, linha 25, coluna 26. O GitHub registrou falha instantânea com `jobs=[]`. Não há evidência de falha da aplicação nesse run. Ver [readback-ci.json](aula08-v4-evidencias/readback-ci.json).

## Google Sheets existente

[Planilha Mobile v4](https://docs.google.com/spreadsheets/d/1pkbf3rJD3R5-lX7TuOyfir0A4ID1m2QfUg8ZIfNOeT0/edit), **reutilizada em leitura**. Não foi criada outra planilha de produção.

- Dez abas confirmadas: 1º/2º/3º/4º Bimestre, Auditoria, Equipes, Alunos, Resultados, Atividades e Orientações.
- Catálogo: `MOBILE-A08-2026`, `Aula 08 — Operação Dados sob Pressão`, bimestre 4, contrato `mobile-a08-lab-v4`, **Habilitada FALSE**.
- Chaves em `Alunos`, `Equipes`, `Resultados` e `Auditoria` sem registros nas faixas verificadas. Cabeçalhos, fórmulas e validações registrados em [readback-sheets.json](aula08-v4-evidencias/readback-sheets.json).
- Incompatibilidade encontrada: planilha usa `VALIDADO/PENDENTE/REVISAR/INATIVO`; código exigia `VALIDADO_DOCENTE`. Campo de homônimo usa `SIM/NÃO`, não booleano puro.
- A validação de dados/checkbox pode fazer linhas vazias parecerem catálogo preenchido. O backend deve selecionar por identificador da atividade.
- Ferramentas de Apps Script não expostas. Busca Drive por MIME e Mobile não localizou projeto visível; isso **não prova inexistência de script vinculado**. ID de projeto, versão instalada, propriedades e `/exec` não observáveis pelo conector atual.
- Não houve POST, alteração de propriedades, cadastro de estudantes, nota, permissão ou compartilhamento. Planilhas históricas Mobile/Web e PPI não foram modificadas nem usadas como fonte de dados/segredos.

## Reparos mínimos autorizados

1. C1: concluir fonte única TSX/Expo, 20 critérios reproduzíveis, feedback/retomada, isolamento, acessibilidade e evidências do navegador.
2. C2: receber evidências como `PENDENTE_VALIDACAO`, separar nota validada, alinhar cabeçalhos/cadastro, reforçar idempotência/recibos/reconciliação e separar QA/PROD.
3. C0/C4: corrigir YAML e gatilhos, instalar dependências com lockfile, integrar main na candidata, preservar portal e produzir PR/prévia sem deploy.
4. C3: revisão independente adversarial, rastreabilidade G1–G6 e limites explícitos de validação conectada/nativa/assistiva.

## Bloqueadores de entrada

**Críticos corrigíveis:** confiança indevida no XP, falta de teste positivo das 20 missões, isolamento de rede incompleto, CI não inicializa. **Externos:** acesso de implantação Apps Script e homologação conectada QA; Android/iOS e tecnologia assistiva dependem de ambiente disponível. Merge, publicação/implantação PROD, permissões e uso de estudantes reais continuam exigindo aprovação humana específica.

## Continuidade após este baseline

A implementação prosseguiu na mesma branch e foi consolidada na [PR #7](https://github.com/thalesvalente/teaching-mobile/pull/7). O checkpoint de código **825ce143fe4f6dcb5f8d1903f5441c50cebdec64**, árvore **93cd3ca16d3141f7875b9d47b7c846e299dcc4ed**, passou em cinco execuções Actions de quatro workflows distintos. [Readback da CI e da PR](aula08-v4-evidencias/ci-825ce-final-readback.json). A main continua no SHA auditado, e os jobs de publicação foram ignorados nas PRs.

Os reparos e a revisão independente estão em [implementação](MOBILE_A08_V4_IMPLEMENTATION.md), [QA](MOBILE_A08_V4_QA.md) e [segurança](MOBILE_A08_V4_SECURITY_REVIEW.md). O SHA documental `303e4751abfb9105f9efa7c205adb6ec8f35d0b0` também passou nos cinco runs; a retomada confirmou branch/CI idênticas, PR pronta para revisão e main preservada. [Readback GitHub da retomada](aula08-v4-evidencias/qa-google-preparacao-20261112/github-readback.json). A preparação Google abaixo acrescenta evidências, sem alterar essa fonte ou transformar testes simulados em homologação.

## Retificação e preparação QA conectada em 12/11/2026

A inferência de conta incompatível registrada em `appsScriptDiscovery.browserReadback` do [readback histórico](aula08-v4-evidencias/readback-sheets.json) era incorreta. A sessão Apps Script corresponde ao perfil da conexão Google; a identidade do proprietário GitHub não demonstrava outra identidade Google. O arquivo histórico permanece intacto, e a [retificação](aula08-v4-evidencias/qa-google-preparacao-20261112/evidence-correction.json) identifica explicitamente os campos retirados como conclusão. As leituras de Sheets desse arquivo não foram descartadas nem repetidas sem necessidade.

O overview mostra o projeto histórico `teaching-mobile-entregas-2026`, criado em 21/10/2026 e modificado em 23/10/2026. Foi observada somente sua existência; não foram copiados código, dados, propriedades ou segredos, e seu vínculo com a planilha v4 não foi comprovado.

| Recurso QA preparado | Observação conectada | Limite |
|---|---|---|
| Projeto independente `1ovzrG-dYeR4evHeFcV4M5vNA1kjKUdZi1sFcL3dVbzjtOVhgDeEdOOWJ` | Privado, um proprietário; código/manifesto salvos e iguais ao SHA 303e4751; oito propriedades QA | Nenhuma execução, consentimento OAuth, bootstrap ou implantação |
| Planilha `1BTl0lw_tGDaQOIBOxy5eCDSRuvv-skc6hXX8yte6X3A` | Privada; dez abas e 115 células/tipos da fixture sem divergência | Apenas dados fictícios; nenhuma entrega, recibo ou nota real |
| Locale/fuso QA | Corrigidos para `pt_BR` e `America/Fortaleza` | Alteração somente no QA; sem mudança de dimensões/compartilhamento |
| Proposta Web App QA | Executar como proprietário e acesso anônimo preparados no formulário | Deploy não clicado; nenhuma versão instalada ou URL `/exec` |
| Revisão independente | C3 aprovou a preparação e os hashes/células/configuração observados | Não é homologação do ciclo conectado |

Evidências: [readback Sheets QA](aula08-v4-evidencias/qa-google-preparacao-20261112/sheets-native-readback.json), [propriedades e bytes](aula08-v4-evidencias/qa-google-preparacao-20261112/script-properties-readback.json), [privacidade do projeto](aula08-v4-evidencias/qa-google-preparacao-20261112/project-metadata.json), [proposta de implantação](aula08-v4-evidencias/qa-google-preparacao-20261112/deployment-proposal.json), [inspeção das dez abas](aula08-v4-evidencias/qa-google-preparacao-20261112/native-visual-review.json) e [parecer C3](aula08-v4-evidencias/qa-google-preparacao-20261112/independent-review.json).

**Preparação QA pronta para aprovação específica:** `MOBILE_A08_V4_READY_FOR_EXACT_APPROVAL` somente para os dois escopos OAuth, implantação QA anônima, bootstrap, ativação temporária, testes sintéticos e fechamento da recepção. A liberação global permanece BLOCKED; a conta e a ferramenta deixaram de ser o alegado impedimento. A [proposta e reversão](MOBILE_A08_V4_RELEASE.md) explicitam o alcance amplo do escopo Sheets, os recursos e os efeitos autorizáveis. Produção, main/Pages, estudantes reais e notas oficiais continuam fora desse gate.
