# MOBILE A08 v4 — QA independente e matriz de critérios

Revisor: **C3**, agente nativo independente dos autores da implementação. A missão reutiliza a v4 `e429771c3dd7483dbd513d0b6be7ee4cf6e1c2e3`, a candidata avançada v3 e a referência pedagógica de bancada única. A PR histórica #4 permanece separada.

## Como interpretar este relatório

O código testado, a superfície de execução e o resultado são registrados separadamente. Uma fixture de Sheets não demonstra integração Google. A execução Web não demonstra Android/iOS. Axe não demonstra conformidade WCAG completa. A recepção de evidência não valida nota.

O workflow registra `git rev-parse HEAD` e a árvore efetivamente testada. No relatório C3, `sha` é o checkout testado; `triggerSha` registra, separadamente, o SHA do evento GitHub, que pode ser um merge sintético de PR.

## Matriz dos vinte critérios

Cada linha vale **5 XP formativos** e corresponde a **0,5 ponto na rubrica técnica**, cuja validação institucional exige conferência docente. O oráculo executável comum está em `lessons/aula-08-av1-incremento-1/laboratorio-vivo/criteria.js`; o estudante edita `shared/ProjetoUniversal.tsx`. Os mesmos critérios alimentam a bancada e o avaliador local do projeto Expo.

| Critério | Comportamento verificável | Função do aluno | Ciclo |
|---|---|---|---|
| M1-01 | Erro prevalece sobre carregamento simultâneo | `estadoTela` | M1 |
| M1-02 | Carregamento sem erro permanece explícito | `estadoTela` | M1 |
| M1-03 | Base vazia tem estado próprio | `estadoTela` | M1 |
| M1-04 | Filtro sem correspondência difere de base vazia | `estadoTela` | M1 |
| M1-05 | Dados disponíveis geram estado pronto | `estadoTela` | M1 |
| M2-01 | Busca normaliza espaço, caixa e acento | `filtrarOrdenar` | M2 |
| M2-02 | Categoria e período se combinam por AND | `filtrarOrdenar` | M2 |
| M2-03 | Ordem Z–A preserva IDs | `filtrarOrdenar` | M2 |
| M2-04 | Filtro preserva array de origem e referências dos objetos | `filtrarOrdenar` | M2 |
| M3-01 | Detalhe encontra o ID opaco exato | `obterPorId` | M3 |
| M3-02 | ID ausente, caixa diferente e base vazia devolvem null | `obterPorId` | M3 |
| M3-03 | Formulário válido após trim; limites máximos e categoria validados | `validarFormulario` | M3 |
| M3-04 | Título e descrição insuficientes geram erros específicos | `validarFormulario` | M3 |
| M3-05 | Duplicidade normalizada é bloqueada na mesma trilha, permitida entre trilhas | `validarFormulario` | M3 |
| M3-06 | Inserção produz novo array sem alterar a fonte | `inserirImutavel` | M3 |
| M4-01 | Repetir o mesmo ID não duplica a inserção | `inserirImutavel` | M4 |
| M4-02 | Resumo mantém total e IDs sem perda | `resumir` | M4 |
| M4-03 | Contagem por categoria corresponde aos dados | `resumir` | M4 |
| M4-04 | Resumo vazio é seguro | `resumir` | M4 |
| M4-05 | Resumo preserva ordem/fonte, é repetível e trata nomes como dados | `resumir` | M4 |

| Ciclo | Tempo | Critérios | XP |
|---|---:|---:|---:|
| M1 — Estados sob falhas | 15 min | 5 | 25 |
| M2 — Filtros e imutabilidade | 25 min | 4 | 20 |
| M3 — Fluxo, navegação e validação | 35 min | 6 | 30 |
| M4 — Idempotência, resumos e regressão | 25 min | 5 | 25 |
| Total | 100 min | 20 | 100 |

## Execuções e evidências disponíveis

| Verificação | Superfície | Resultado observado | Evidência |
|---|---|---|---|
| Falha histórica Actions 43108593937 | GitHub conectado, somente leitura | FAIL antes dos jobs; YAML inválido | `aula08-v4-evidencias/readback-ci.json` |
| Backend independente antes dos reparos | Node/VM, Sheets sintético | 4 PASS / 4 FAIL | `aula08-v4-evidencias/c3-backend-initial.log` |
| Mesmos oito adversariais após os reparos | Node/VM, Sheets sintético | 8 PASS / 0 FAIL, exit 0 | `aula08-v4-evidencias/c3-backend-retest.json` |
| Navegador local | Chromium `/usr/bin/chromium` | BLOCKED antes de abrir página, socket EPERM | `aula08-v4-evidencias/c3-local-browser-blocked.json` |
| Suíte independente de navegador | GitHub Actions | NOT_RUN nesta revisão intermediária | `tests/independent-aula08-v4-browser.cjs` e artefato do workflow |
| Recepção conectada Google QA | Interface + Apps Script + planilha QA | BLOCKED por implantação externa não comprovada | `MOBILE_A08_V4_INTEGRATION.md` |
| Android/iOS real | Dispositivo/emulador nativo | NOT_RUN | Roteiro nativo em `laboratorio-vivo/projeto/README.md` |
| Tecnologia assistiva | Leitor de tela e revisão humana | NOT_RUN | Não declarar conformidade WCAG integral |

Os oito adversariais C3 cobrem reordenação de integrantes, alteração nominal no cadastro, escrita docente parcial, gate PROD incompleto, adulteração de cada campo assinado, tentativa HTTP de chamar administração, confirmação de matrícula forjada e fórmula tratada como texto. Quatro falhas de integridade/autorização foram corrigidas por C2 e retestadas por C3 sem alterar os asserts.

## Suíte independente de navegador preparada

`node tests/independent-aula08-v4-browser.cjs` utiliza Playwright e axe-core fixados no lockfile raiz. `C3_ARTIFACT_DIR` seleciona o diretório de evidências. O workflow publica esse diretório mesmo quando há falhas.

A suíte verifica 360, 390, 768, 1024 e 1440 pixels, reflow adicional a 320 pixels, axe na página principal, navegação de diálogo por teclado e foco visível, isolamento do DOM pai, rejeição de mensagem de origem indevida, recusa de APIs ambientais, CSP de conexão/imagem, erro de sintaxe, loop comum, recuperação, importação/exportação de continuidade, JSON inválido sem perda de trabalho, PDF A4 com 20 missões e quatro ciclos Mobile, bloqueio de produção e ausência de matrícula no salvamento automático.

Os artefatos incluem screenshots, resultados axe com verificações incompletas explicitadas, um PDF fictício, um JSON de continuidade fictício e relatório por cenário. O teste de CSP é executado no iframe independentemente da recusa do compilador, evitando inferir bloqueio de rede apenas porque a compilação foi recusada. Scripts locais necessários continuam sujeitos à política `script-src`; o teste não afirma bloqueio de toda forma possível de navegação hostil.

Três cenários adicionais exercitam a interface real contra o arquivo `Code.gs` exato por transporte HTTP interceptado e Sheets em memória: recebimento normal; resposta com assinatura adulterada detectada pela comparação com readback; perda da resposta após gravar, timeout de 45 segundos e reconciliação com o mesmo identificador. Conferem versão 4.1.0, consulta de identidade sintética, hash TSX, nota oficial nula, uma única escrita e ausência de notas no boletim. Seus arquivos `simulated-contract-*.json` são explicitamente **simulados**, sem requisição real ao Google e sem substituir homologação conectada.

## Gates G1–G6 — estado intermediário

| Gate | Estado | Critério para encerramento |
|---|---|---|
| G1 — Pedagogia | PASS | Quatro ciclos, 20 critérios e 100 XP coerentes; rubrica 0–10 separada e conteúdos sobrepostos preservados com maior profundidade. Aprovação docente da rubrica permanece gate de produção. |
| G2 — Engenharia | BLOCKED | Aguardar execução integrada no SHA exato; Android/iOS ainda não executado. |
| G3 — UX e acessibilidade | BLOCKED | Aguardar navegador remoto, inspeção visual do PDF/screenshots e revisão humana/assistiva disponível. |
| G4 — Segurança e dados | BLOCKED | Backend local independente aprovado; conclusão integrada depende de navegador, versão final e configuração efetivamente instalada. |
| G5 — Integração | BLOCKED | Falta prova conectada interface → Apps Script → planilha QA → recibo → readback → reconciliação. |
| G6 — Publicação | BLOCKED | Aguardar PR/SHA/checks finais e autorização exata para merge/Pages; não publicar a candidata automaticamente. |

Este documento é um registro verificável de revisão em andamento, sem conclusão artificial. Os resultados finais de Actions e a inspeção dos artefatos devem ser anexados antes de declarar prontidão técnica. Produção continua bloqueada.
