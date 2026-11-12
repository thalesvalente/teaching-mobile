# MOBILE A08 v4 — revisão independente de segurança

Revisor: **C3**, agente nativo separado dos autores C1/C2. O coordenador C0 integra o código e administra o GitHub. Referência da missão: 11/11/2026, America/Fortaleza.

## Escopo e força das evidências

Foram examinados o executor TSX, a comunicação entre iframe e página, a entrega, o backend Mobile exato e a política de publicação. Os testes locais do backend usam um adaptador de Apps Script/Sheets **em memória**, com matrículas `00000000.ITA…` e identidades fictícias. O adaptador é compartilhado com C2; os cenários e os asserts independentes foram escritos por C3.

Essa execução não instala Apps Script, não recebe notas reais e não homologa Google Sheets. A homologação conectada precisa demonstrar interface → Apps Script → planilha QA → recibo → readback → reconciliação.

## Achados e correções

| ID | Severidade | Reprodução e impacto | Correção / evidência |
|---|---|---|---|
| C3-S01 | Crítica | O backend inicial convertia XP declarado em nota e preenchia o boletim antes da conferência docente, apesar do recibo indicar pendência. | Recepção somente em Auditoria/Equipes; nota oficial nula. Resultados e bimestre somente após operação docente autenticada, rubrica 20 × 0,5 e autorização de lançamento. `tests/mobile-aula08-v4-backend.test.cjs`. |
| C3-S02 | Alta | O helper de liberação QA original utilizava modo PROD. | Configurações e segredos separados por ambiente; QA rejeita os IDs protegidos e exige matrículas e cadastro sintéticos. Testes C2 de isolamento e liberação. |
| C3-B01 | Alta | Reordenar os mesmos integrantes gravava um novo recibo e somente depois detectava divergência com a composição armazenada. | Comparação de identidade antes de gravar; alteração de ordem/composição é recusada sem nova escrita. Teste independente 1. |
| C3-B02 | Alta | Alterar o nome no cadastro e consultar novamente podia gravar uma entrega não conciliável com a equipe anterior. | Identidade divergente é encaminhada à conferência docente antes do commit. Teste independente 2. |
| C3-B03 | Alta | Uma revisão docente com escrita parcial deixava evento assinado sem Resultados/boletim; a repetição devolvia `VALIDADO` indevidamente. | Integridade exige a projeção da maior nota validada em Resultados, bimestre e Equipes antes de aceitar replay. Teste independente 3. |
| C3-B04 | Alta | As flags de recebimento PROD permitiam consulta sem referência de homologação QA. | Configuração verifica referência QA e aprovação da rubrica em cada requisição, além das demais flags. Teste independente 4. |
| C3-S03 | Alta | O iframe inicial não tinha CSP nem limite cooperativo para loops comuns. | CSP restritiva, origem opaca, controle de importações/APIs, orçamento cooperativo e recuperação. Validação dinâmica depende da suíte de navegador; não se infere a partir da inspeção estática. |
| C3-CI01 | Alta | O workflow falhou antes de criar jobs: nome de etapa com dois-pontos sem aspas. | Reprodução independente `ScannerError`, linha 25 coluna 26. `readback-ci.json`; correção pelo coordenador com validação YAML e execução no SHA final. |

As quatro falhas C3-B01…B04 foram reproduzidas antes da correção: **4 PASS / 4 FAIL**. Após reparos por C2, os mesmos oito testes independentes produziram **8 PASS / 0 FAIL**, exit 0, sem mudança dos asserts. Logs iniciais permanecem em `aula08-v4-evidencias/c3-backend-initial.log`.

## Controles verificados localmente

`node --test tests/independent-aula08-v4-backend.test.cjs` verifica também adulteração individual dos 28 campos assinados da Auditoria, impossibilidade de chamar ações administrativas por HTTP, rejeição de confirmação de matrícula forjada e tratamento de texto semelhante a fórmula como valor de texto. Não houve conexão Google nesses testes.

A recepção não executa TSX no Apps Script. Proveniência do navegador é `LOCAL_BROWSER_UNTRUSTED`; relatório técnico permanece `NOT_VERIFIED`; os recibos de recepção informam `PENDENTE_VALIDACAO`, nota oficial nula e necessidade de conferência docente. O HMAC é verificado pelo servidor no readback/replay; não se entrega o segredo HMAC ao navegador. O campo `signatureVerified` é uma afirmação do servidor, não uma verificação criptográfica autônoma pelo cliente.

A identidade por matrícula e confirmação de nome não prova autoria nem autentica o aluno. Isso deve permanecer explícito para o docente. Credenciais administrativas são verificadas por identidade ativa/efetiva e propriedade de administrador; os helpers estão fechados no módulo privado. As flags de aprovação são configuração controlada pelo docente e não uma evidência automática de autorização humana.

## Fronteiras do executor de código

O iframe usa `sandbox="allow-scripts"`, sem `allow-same-origin`, e não recebe identidade, matrícula ou credenciais. O resultado local não autoriza nota oficial. O compilador restringe imports a React/React Native e rejeita APIs ambientais, incluindo `process.getBuiltinModule`; C3 confirmou essa rejeição com uma fonte sintética.

O orçamento instrumentado interrompe loops e recursões comuns. Não é garantia inviolável contra esgotamento de CPU/memória por JavaScript hostil ou APIs nativas do navegador. O avaliador CLI em Worker limita tempo/heap e recebe ambiente vazio, mas **não é sandbox do sistema operacional**. Deve ser usado como ferramenta local pelo próprio autor em ambiente sem segredos; não se deve oferecer esse processo como serviço remoto que execute submissões arbitrárias. A implantação do Apps Script não executa o CLI.

## Verificações ainda dependentes de outra superfície

O Chromium local não iniciou: `socket() failed: Operation not permitted`, antes de carregar a aplicação. A prova está em `aula08-v4-evidencias/c3-local-browser-blocked.json`. A suíte independente `tests/independent-aula08-v4-browser.cjs` deve executar em GitHub Actions, com artefatos e SHA exato; a falha ambiental não é um PASS nem um FAIL da aula.

Permanecem fora da prova local: instalação Apps Script, propriedades reais, segredo instalado, permissões Google, ciclo conectado QA, execução Android/iOS e revisão por tecnologia assistiva. A configuração de produção do frontend deve continuar com endpoint vazio e `PROD_RELEASE_ENABLED = false` até os gates e a autorização específica.

## Parecer

**Revisão local independente do backend: PASS, limitada ao código e ao adaptador simulado identificados.** O parecer integrado G4/G5 depende da revisão final do SHA, dos resultados de navegador e da implantação QA. Nenhuma liberação de produção é concedida por este documento.
