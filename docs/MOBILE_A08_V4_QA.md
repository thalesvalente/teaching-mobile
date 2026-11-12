# MOBILE A08 v4 — QA independente e matriz de critérios

Revisor: **C3**, agente nativo independente dos autores da implementação. A missão reutiliza a v4 `e429771c3dd7483dbd513d0b6be7ee4cf6e1c2e3`, a candidata avançada v3 e a referência pedagógica de bancada única. A PR histórica #4 permanece separada.


## Parecer técnico concluído

**Fonte verificada: `825ce143fe4f6dcb5f8d1903f5441c50cebdec64`.** C3 confirmou **27/27 cenários em cada um dos três motores** e zero violações axe nas cinco larguras. Os testes C1 também aprovaram as vinte missões pela UI, regressão, XP, componentes, teclado, IDs de formulário, PDF e JSON. Cinco execuções Actions terminaram com sucesso; publicação e escrita na main foram corretamente ignoradas. Não há falha crítica de código conhecida aberta.

A revisão técnica Web/Expo Web e backend simulado está concluída nesse SHA. Estado operacional: **MOBILE_A08_V4_BLOCKED_EXTERNAL_DEPLOYMENT**. Google QA instalado, Android/iOS e auditoria humana/assistiva continuam sem prova. Ver [readback da CI](aula08-v4-evidencias/ci-825ce-final-readback.json), [parecer C3](aula08-v4-evidencias/ci-825ce/c3-final-review.json) e [execução v4](https://github.com/thalesvalente/teaching-mobile/actions/runs/43129942677). Um commit posterior somente de documentação/evidências também deve passar a CI no seu SHA exato, sem atribuir a ele resultados de outra fonte.

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
| Suíte independente Chromium, SHA `3cfc16a` | GitHub Actions, navegador real | 17 PASS / 8 FAIL; 5 ARIA e 3 contratos com adaptador de data incorreto | `aula08-v4-evidencias/ci-3cfc/c3-browser-results.json` |
| PDF/screenshots Chromium `3cfc16a` | Artefato real da CI, inspeção visual | FAIL: rodapé CSS ainda cita Web; documento A4 legível, hash integral, quatro ciclos e vinte missões | `aula08-v4-evidencias/ci-3cfc/c3-visual-review.json` |
| Adaptador de data corrigido | Backend Node/VM, Sheets sintético | 41 PASS / 0 FAIL, incluindo 9 testes independentes C3 | `aula08-v4-evidencias/c3-backend-date-adapter-retest.tap` |
| Candidata `a363b326`, Chromium/Firefox/WebKit | GitHub Actions, três motores reais | **25/25 PASS em cada motor**; C1 também aprovou as vinte missões na UI | `aula08-v4-evidencias/ci-a363/` |
| PDF/screenshots `a363b326` | Artefatos reais da CI | PASS na inspeção visual: Mobile correto, A4, vinte critérios e quatro ciclos; cinco larguras Chromium | `aula08-v4-evidencias/ci-a363/c3-visual-review.json` |
| Fonte final `825ce143`, Chromium/Firefox/WebKit | GitHub Actions, três motores reais | **27/27 PASS por motor**, incluindo as novas regressões de abas e formulários | `aula08-v4-evidencias/ci-825ce/c3-*-results.json` |
| PDF/JSON finais `825ce143` | Arquivos reais da CI e inspeção C3 | PASS: exemplo com 5 XP, hash do PDF igual ao código no JSON, nota pendente | `aula08-v4-evidencias/ci-825ce/c3-final-review.json` |
| Recepção conectada Google QA | Interface + Apps Script + planilha QA | BLOCKED por implantação externa não comprovada | `MOBILE_A08_V4_INTEGRATION.md` |
| Android/iOS real | Dispositivo/emulador nativo | NOT_RUN | Roteiro nativo em `laboratorio-vivo/projeto/README.md` |
| Tecnologia assistiva | Leitor de tela e revisão humana | NOT_RUN | Não declarar conformidade WCAG integral |

Os oito adversariais C3 cobrem reordenação de integrantes, alteração nominal no cadastro, escrita docente parcial, gate PROD incompleto, adulteração de cada campo assinado, tentativa HTTP de chamar administração, confirmação de matrícula forjada e fórmula tratada como texto. Quatro falhas de integridade/autorização foram corrigidas por C2 e retestadas por C3 sem alterar os asserts.

## Suíte independente de navegador e ciclo de reparos

`node tests/independent-aula08-v4-browser.cjs` utiliza Playwright e axe-core fixados no lockfile raiz. `C3_ARTIFACT_DIR` seleciona o diretório de evidências. O workflow publica esse diretório mesmo quando há falhas.

A suíte verifica 360, 390, 768, 1024 e 1440 pixels, reflow adicional a 320 pixels, axe na página principal, navegação de diálogo por teclado e foco visível, isolamento do DOM pai, rejeição de mensagem de origem indevida, recusa de APIs ambientais, CSP de conexão/imagem, erro de sintaxe, loop comum, recuperação, importação/exportação de continuidade, JSON inválido sem perda de trabalho, PDF A4 com 20 missões e quatro ciclos Mobile, bloqueio de produção e ausência de matrícula no salvamento automático.

Os artefatos incluem screenshots, resultados axe com verificações incompletas explicitadas, um PDF fictício, um JSON de continuidade fictício e relatório por cenário. O teste de CSP é executado no iframe independentemente da recusa do compilador, evitando inferir bloqueio de rede apenas porque a compilação foi recusada. A suíte final também verifica bloqueio de script arbitrário e recarga de script de bootstrap após o fechamento da política. Isso não afirma bloqueio de toda forma possível de navegação hostil.

Três cenários adicionais exercitam a interface real contra o arquivo `Code.gs` exato por transporte HTTP interceptado e Sheets em memória: recebimento normal; resposta com assinatura adulterada detectada pela comparação com readback; perda da resposta após gravar, timeout de 45 segundos e reconciliação com o mesmo identificador. Conferem versão 4.1.0, consulta de identidade sintética, hash TSX, nota oficial nula, uma única escrita e ausência de notas no boletim. Seus arquivos `simulated-contract-*.json` são explicitamente **simulados**, sem requisição real ao Google e sem substituir homologação conectada.

### Achados da primeira execução de navegador

No SHA `3cfc16a1b6ce64a86cae9d3cb0e0b5239a707377`, os cenários de isolamento, mensagem forjada, CSP de conexão/imagem, loop comum, recuperação, JSON, bloqueio de produção, matrícula não persistida e reflow passaram. Os cinco resultados axe falharam em `aria-allowed-attr`: `setPane` aplicava `aria-selected` ao `<main id="conteudo">`, em vez de limitar a seleção aos botões de abas.

Os três cenários de entrega simulada falharam antes do readback porque o adaptador `Utilities.formatDate` ignorava o padrão do Apps Script e produzia recibo com dois-pontos. O frontend corretamente o rejeitou. O adaptador foi corrigido; um nono teste independente exige os formatos UTC e Fortaleza reais e o ID contratual. O reteste backend produziu 41/41 PASS. A interface após o reparo passou nas execuções a363b326 e 825ce143 descritas abaixo.

A inspeção do PDF real encontrou o rodapé gerado por CSS `@page` com a disciplina Web, invisível no `textContent` usado pelo teste inicial. O teste agora extrai o PDF por Poppler, verifica a identificação, A4, hash completo e sua caixa dentro das margens. Uma suspeita inicial de hash cortado foi **retirada**: a medição comprovou 64 caracteres íntegros; o caractere extra vinha do número da seção seguinte concatenado no DOM. O registro preserva essa retificação.

WebKit não iniciou a prévia nessa candidata; diagnóstico da execução seguinte identificou a CSP `script-src self` incompatível com a origem opaca nesse motor. C1 corrigiu o bootstrap sem adicionar `allow-same-origin`. Todos esses reparos foram retestados no SHA 825ce143 antes do parecer integrado. Os artefatos intermediários permanecem identificados pelo SHA, nunca como evidência final.

## Candidatas verdes e fechamento de acessibilidade

O [run 43129137112](https://github.com/thalesvalente/teaching-mobile/actions/runs/43129137112) executou o SHA **`a363b326b8c4d0da1eb9280ea0c67b4c0305d515`**. C3 conferiu os relatórios reais baixados: Chromium 143.0.7499.4, Firefox 144.0.2 e WebKit 26.0, cada um com 25 PASS e zero FAIL. C1 aprovou na UI todas as vinte missões, XP cumulativo de 100, regressão técnica sem apagar XP histórico, componentes React Native Web, PDF e retomada. Os três cenários de entrega em cada motor permanecem **simulados**, embora usem navegador real e o Code.gs exato.

A revisão visual C3 abriu as três páginas do PDF real e as capturas Chromium de 360, 390, 768, 1024 e 1440 pixels, além de amostras Firefox e WebKit. O PDF está legível, tem rodapé Mobile, quatro ciclos e os vinte critérios. Seu hash de código foi extraído integralmente do PDF e cabe nas margens. PDF real é validado somente em Chromium; nos outros motores a prova cobre o documento HTML de impressão, pois `page.pdf` não está disponível. O PDF gerado não é marcado/tagged; não há alegação de PDF/UA.

Axe registrou zero violações nos cinco tamanhos em cada motor, com dois grupos inconclusivos: nomes ARIA em contêineres genéricos e contraste do ícone decorativo de localização. A inspeção posterior encontrou dois comportamentos não cobertos pelo teste inicial: acesso por setas/Home/End às abas com tabindex alternado e IDs repetidos nas duas instâncias do formulário. C1 corrigiu esses pontos e atribuiu papel de grupo aos contêineres rotulados. C3 acrescentou duas regressões independentes, totalizando **27 cenários por motor**: navegação real por teclado dos dois grupos de abas e relação de cada campo com o erro da própria prévia. Essas alterações foram retestadas no SHA **825ce143fe4f6dcb5f8d1903f5441c50cebdec64**: 27/27 PASS em cada motor. A nova auditoria axe eliminou os itens ARIA inconclusivos; resta somente a análise de contraste do ícone decorativo `aria-hidden` de localização. Os resultados anteriores não foram transferidos para código diferente: o novo SHA teve execução própria.

### Evidências finais no repositório

- [PDF fictício com 5 XP](aula08-v4-evidencias/ci-825ce/relatorio-exemplo-ficticio.pdf) e [JSON de continuidade correspondente](aula08-v4-evidencias/ci-825ce/continuidade-exemplo-ficticio.json). C3 conferiu visualmente as três páginas; o hash TSX corresponde ao código exato do JSON. XP histórico e resultado técnico atual permanecem separados.
- Capturas finais [360](aula08-v4-evidencias/ci-825ce/viewport-360.png), [390](aula08-v4-evidencias/ci-825ce/viewport-390.png), [768](aula08-v4-evidencias/ci-825ce/viewport-768.png), [1024](aula08-v4-evidencias/ci-825ce/viewport-1024.png), [1440](aula08-v4-evidencias/ci-825ce/viewport-1440.png) e [reflow 320](aula08-v4-evidencias/ci-825ce/reflow-320.png). CSS e renderer de PDF são byte a byte iguais aos da inspeção visual a363; os comportamentos alterados foram retestados na CI final.
- [Relatório Chromium](aula08-v4-evidencias/ci-825ce/c3-chromium-results.json), [Firefox](aula08-v4-evidencias/ci-825ce/c3-firefox-results.json), [WebKit](aula08-v4-evidencias/ci-825ce/c3-webkit-results.json), quinze resultados axe e [hashes dos arquivos](aula08-v4-evidencias/ci-825ce/files.sha256). São 27 cenários repetidos em três motores, não 81 requisitos distintos.
- Três recibos de cenário descrevem transporte interceptado e Sheets em memória; não contêm recibos Google reais nem matrículas de estudantes reais.

### Achados de UX encerrados

| Achado | Severidade | Reprodução | Correção e reteste |
|---|---|---|---|
| C3-A11Y01 — seleção ARIA no main | Alta | `#conteudo` recebia aria-selected; axe falhava nas cinco larguras | Seleção limitada aos botões de aba; zero violações nos três motores |
| C3-A11Y02 — aba com tabindex negativo sem setas | Alta | Focar Código/arquivo e tentar mudar por teclado | Setas, wrap, Home/End, foco e painel verificados por C1 e C3 em 390 px |
| C3-A11Y03 — IDs repetidos nas prévias | Média | Abrir formulário Web e móvel simultaneamente | IDs por instância/raiz; quatro campos apontam para erros da própria prévia; C1/C3 PASS |
| C3-PDF01 — rodapé da disciplina Web | Média | Imprimir A4; CSS @page trazia rótulo antigo | Rodapé Mobile e texto extraído do PDF real; revisão visual das três páginas |
| C3-PDF02 — suspeita de hash cortado | Não confirmada | Observação visual inicial confundiu número da seção seguinte concatenado no DOM | Falso positivo retirado; PDF real contém os 64 caracteres e bbox dentro da margem |

## Cobertura verificável e limites

| Requisito | Evidência disponível | Estado/limite |
|---|---|---|
| Vinte missões, 100 XP e starter incompleto | Contratos Node e relatório C1 `ci-825ce/c1-browser-results.json` | PASS no SHA 825ce143 |
| Determinismo, mutação, idempotência e regressão | Avaliador comum e testes Node; regressão pela UI | PASS no escopo técnico executado |
| Nota oficial não autodeclarada | Backend 41/41, três cenários HTTP simulados por motor | PASS no código/fixture; instalação real não comprovada |
| PDF/JSON/retomada | PDF real e exportação/importação em navegador | PASS 825ce143; exemplos são fictícios |
| Isolamento do pai e comunicação | SecurityError de origem opaca, peer message ignorada, tokens/revisão | PASS nos três motores |
| Rede de código aluno | Compilador + probes independentes de fetch, imagem, beacon e novos scripts | PASS para esses canais; não é garantia contra todo uso hostil de CPU ou navegação |
| Reenvio/reconciliação sem duplicação | Backend adversarial + timeout real de UI com Sheets em memória | PASS simulado; ciclo Google BLOCKED |
| Responsividade | Reflow 320 adicional e screenshots cinco larguras | PASS 825ce143 |
| Acessibilidade | Axe, teclado de diálogo/abas, revisão visual e IDs | Testes automatizados PASS; leitor de tela e auditoria humana NOT_RUN |
| Planilha íntegra/preservação | Readback conectado sem escrita; contrato em fixture | Não se infere integridade transacional Google sem homologação instalada |
| Aulas anteriores | Regressões históricas e verificação de assets/links | Preservadas; nenhuma publicação de produção nesta missão |

## Gates G1–G6 — parecer após revisão técnica

Os gates abaixo têm escopo integral. Resultados técnicos parciais aprovados são detalhados na tabela de cobertura e não transformam um gate operacional incompleto em PASS.

| Gate | Estado | Evidência e pendência efetiva |
|---|---|---|
| G1 — Pedagogia | PASS | Quatro ciclos, 20 critérios, 100 XP e profundidade Mobile coerentes; nota docente separada. Aceite humano da rubrica continua gate de produção. |
| G2 — Engenharia | BLOCKED | Código, dependências, TypeScript, Expo Web, vinte critérios e navegador PASS no SHA 825ce143. Android/iOS real permanece NOT_RUN; não há emulação nativa fictícia. |
| G3 — UX e acessibilidade | BLOCKED | Responsividade, PDF, teclado, IDs e axe automatizado PASS; contraste do ícone decorativo inconclusivo, tecnologia assistiva e auditoria humana NOT_RUN. Sem declaração de WCAG integral. |
| G4 — Segurança e dados | BLOCKED | Código/backend e controles de navegador PASS no escopo executado; faltam propriedades, permissões e segredo do serviço instalado. Não há falha crítica de código conhecida aberta. |
| G5 — Integração | BLOCKED | Falta ciclo Google conectado interface → Apps Script → planilha QA → recibo → readback → reconciliação. Três simulações por motor não suprem esse gate. |
| G6 — Publicação | BLOCKED | PR #7 limpa e revisável, cinco execuções verdes e prévia estática validada. Merge/Pages/PROD não executados; exigem gates externos e aprovação específica. |

**Código autorizado e QA técnico executável concluídos; operação externa ainda bloqueada.** O estado permanece `MOBILE_A08_V4_BLOCKED_EXTERNAL_DEPLOYMENT`, não COMPLETE nem autorização de produção. O fechamento documental deve preservar a fonte verificada e obter CI verde no SHA exato da PR antes de qualquer solicitação futura de integração.
