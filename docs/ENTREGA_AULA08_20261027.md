# Aula 08 — entrega integrada da missão MOBILE-A08-LAB-VIVO-AV1-IMPLEMENT-01

## Estado da entrega

**`A08_LAB_VIVO_PARTIAL_BLOCKED`.** Código, conteúdo textual, projeto local, contrato JSONL, ficha, sandbox, PDF, Apps Script, testes e parecer independente estão implementados na branch obrigatória. O gate G1 permanece bloqueado porque os dois PNGs originais não foram localizados. A implantação e o E2E real do Google permanecem `PENDING_LIVE_E2E`.

O laboratório foi adaptado para **Mobile Web responsivo, sem dependências de aplicação**, executável com Node 22 ou superior. Essa decisão reduz a preparação de iniciantes em uma aula de 100 minutos e exercita os contratos pedidos: estado, filtros, lista, detalhe, formulário e resumo acessível. Não produz APK nem exige Expo. As aulas existentes de React Native/Expo foram preservadas.

Há três subagentes nativos reais, além do coordenador: B (`/root/local`), D (`/root/server`) e E (`/root/qa`). Com quatro posições simultâneas disponíveis, o coordenador executou A, C e a integração compartilhada. E trabalhou em worktree própria e não escreveu produção nem testes permanentes. Os handoffs e os SHAs por frente constam abaixo e no [mapa de publicação](aula08-evidencias/publicacao.json).

## Git, baseline e proveniência

| Item | Valor |
|---|---|
| Repositório único | `thalesvalente/teaching-mobile` |
| Branch | `feat/aula-08-laboratorio-vivo-av1-20261027` |
| Main observada antes de qualquer escrita | `a0ac0749ece9805833c4f34d31c07db76032fe6b` |
| Árvore da baseline | `e5911d0e7f07eade62ef7c8ea293725a2f8e905b` |
| Candidata de código/testes avaliada localmente | `b5de67bf8db0c4904212b8ad887f4dc9da261a4d` |
| Commit publicado equivalente de código/testes | `bcb1fa2663d18e1f9ec8814373a11ff6fd486ef0` |
| Árvore idêntica dessas duas candidatas | `46d46cb27f6260525b43b2f2628e0a5e88c0b533` |
| Commit publicado com parecer independente | `d67715d25afd627885e57dae13ee398e5b0b91a2` |
| Árvore com parecer independente | `8ead3247a6d3c28f001d6cb017fcccce74fc09c2` |

O push HTTPS do executor não dispunha de credencial. A publicação foi concluída pela conexão GitHub autorizada, criando a sequência de objetos Git sobre a baseline e, então, a branch nova. **Cada árvore publicada foi comparada com a árvore do commit integrado local e coincidiu exatamente.** Os SHAs de commit diferem por metadados de publicação; não representam diferenças de conteúdo. O mapa preserva cada par local/remoto e sua árvore. Não houve reescrita de branch existente, force push ou merge em main.

Depois da candidata de código/testes, os commits finais acrescentam somente documentação e evidências. O HEAD final, sua árvore e a PR Draft são registrados na resposta de entrega e na própria PR, evitando um documento que tente incluir seu próprio SHA. A publicação da branch não é implantação do Apps Script nem publicação da aula em produção.

### Handoffs das frentes

| Frente | Responsável | Origem / integração verificável |
|---|---|---|
| A — conteúdo e Gemini | Coordenador | Publicado `7bfb8a3284986edb5b681a21c1993c2b9555d38c`; originais PNG pendentes |
| B — projeto e JSONL | `/root/local` | Originais `50de206cc3b80ca1ee56632dbc1fc9d27135b3b8`, `8fff55e3f2adc651cc637fc49313aeab0e5c076f`; publicados `9fcf73af7ec59bcca49ea3d083a6e10014c24e81`, `0afbbebc500e75b10e0023bdc4bb9988e42d7ab9`; subárvore final do starter `670741616d0c7e3d01dec8eb092300a5657fccb0` |
| C — páginas, sandbox e PDF | Coordenador | Publicados `8314da3668798b02c6975abf1a7e932be484a1be`, `bcb1fa2663d18e1f9ec8814373a11ff6fd486ef0` |
| D — servidor e runbook | `/root/server` | Originais `45bb20e8159690fda22894f7eedd0d84c1ac5b5f`, `40b677514eeb489b4c3cb0f48d4e9b8b2eeb30eb`, `cf13e477c6aa758f6642977e2267aaf70c12c148`, `5162a3101cc4ebb05fd41aae1694269da9ce452b`; publicados `790e89f95d651747b2a57454431d6d9b323a983e`, `40604fa3dc9e83b999664432ac9a20fa7c1f7f27`, `fadaa87298e6561535be2728772d0f6d3d9094a3`, `1dcf70e5acaf5f8f749083644e9f2d5fbb554928` |
| E — revisão independente | `/root/qa` | Parecer sobre árvore `46d46cb27f6260525b43b2f2628e0a5e88c0b533`; commit de origem final `69e0420066f59234376435d8f0b02b05c9b954ca`; publicado `d67715d25afd627885e57dae13ee398e5b0b91a2` |
| Integração, portal, CI e evidências | Coordenador | Publicado `7419afcc39619ea5bf6bc270db003624131ea145` e commit documental desta entrega |

## Matriz requisito → arquivo → teste/evidência

Os caminhos de aula abaixo são relativos a `lessons/aula-08-av1-incremento-1/`; caminhos iniciados com `tests/`, `docs/` ou `.github/` são relativos à raiz.

| Requisito | Arquivo principal / ownership | Teste ou evidência |
|---|---|---|
| Baseline antes de editar, preservação A06/A07 | `docs/AULA08_BASELINE.md`, `docs/REVISAO_AULA_08_BASELINE_20261027.md` / coordenador e E | SHA/árvore/subárvores; 46 verificações herdadas; diff final limitado ao adaptador autorizado |
| Quatro marcos, 20 critérios de 0,5, aula de 100 minutos | `README.md`, `MISSOES.md`, `index.html` / A e C | `tests/aula08-pages.test.cjs`; leitura de E; rubrica servidor 24 testes |
| Cinco passos operacionais e linguagem de iniciante | `README.md`, `index.html`, `atividade.html` / A e C | E2E, leitura vertical e revisão didática E |
| Dois infográficos originais | `assets/README.md`, slots de imagem nas páginas / A e C | `tests/aula08-assets.cjs`: exit 2, BLOCKED; nenhuma imagem substituta |
| Tutor Gemini no navegador, prompts e registro responsável | `GUIA_GEMINI.md`, `projeto/src/evidencias.json` / A e B | Prompts com quatro delimitadores; parser valida log estruturado; log inicial vazio |
| Starter executável, lista/detalhe/formulário/estados/filtros/resumo | `projeto/` / B | 9 testes locais, HTTP 200, inspeção do starter e captura em 375 px |
| `npm ci`, `preflight`, `web`, `nota`, `entrega` | `projeto/package.json`, `projeto/scripts/` / B | Logs 00–03; teste HTTP local; execução independente de E |
| Avaliador formativo público sem autoridade oficial | `projeto/src/avaliacao-local.mjs`, `projeto/scripts/avaliar.mjs` / B | Zero/parcial/máximo; teste de avaliador adulterado; servidor ignora nota local |
| Geração determinística e allowlist de fontes | `projeto/scripts/gerar-entrega.mjs`, `projeto/src/contrato.mjs` / B | 16 testes JSONL, incluindo limites, symlink, ausentes, UTF-8/Base64/hash |
| Parser estrito e hash canônico na ficha | `jsonl.js`, `projeto/src/contrato.mjs` / C e B, ownership separado | 16 testes JSONL + 13 ataques independentes; importação real e drag/drop |
| Identidade somente online, nomes associados aos slots | `atividade.html`, `atividade.js` / C | Slots 1–4, campos congelados durante envio; mudança limpa confirmação; teste servidor de conflito/fórmula |
| Um botão principal, progresso e nenhuma confirmação em erro | `atividade.js`, `entrega-appscript.js` / C | 13 cenários Chromium; escrita recusada, timeout, recibo adulterado |
| Sandbox sem DOM/rede/armazenamento, fontes permitidas | `verificador.js` / C | 14 ataques independentes; CSP, origem opaca, worker clássico e import de módulo; zero exfiltração |
| Deadline e saída JSON finita, sem efeitos de serialização | `verificador.js` / C | Loop/top-level/promise interrompidos; NaN, Infinity, getter, toJSON e arrays inválidos rejeitados |
| Desafios variáveis, HMAC, TTL, replay e limites | `../aula-07-estado-filtros/appscript/RubricaAula08.gs` / D | 24 testes A08 + 16 ataques independentes; 41 casos para quatro slots |
| Referência e nota calculadas no servidor; fonte nunca executada lá | `RubricaAula08.gs` e adaptador `Code.gs` / D | Zero/parcial/máximo, notas distintas, local-result adulterado, inspeção sem eval de fonte |
| Configuração Mobile centralizada e bloqueio de PPI | `config.js`, `Code.gs`, `INTEGRACAO_SHEETS.md` / C e D | Allowlist exata; ataque PPI recusado antes do POST; configuração 4º Bimestre/Aula 08 |
| Upsert, média, ordenação, coluna e 17 campos de auditoria | `Code.gs`, `RubricaAula08.gs` / D | Fixtures Sheets, reenvio/conflito/concorrência; 15 regressões A07 |
| PDF A4, critérios/notas/IA/hashes/estado e bytes estáveis | `pdf.js`, `pdf-engine.js` / C | PDF real de 7 páginas; hash dos bytes; re-download idêntico; inspeção visual de todas as páginas |
| Recibo vincula pacote, respostas, PDF, identidade e notas | `entrega-appscript.js`, `RubricaAula08.gs` / C e D | Verificação HMAC no servidor, mutações rejeitadas; origem/source/nonce; frame Google aninhado |
| Fallback offline e impressão | `atividade.js`, `pdf.js`, `ACESSIBILIDADE.md` / C e A | PDF local sem POST e sem confirmação; impressão disponível com página já carregada |
| WCAG/teclado, foco, skip link, aria-live, larguras/orientações | `visual.css`, páginas, `ACESSIBILIDADE.md` / C e A | 20 combinações independentes, zero overflow/violações axe AA; teclado e inspeção visual |
| Portal, README e links relativos | `/README.md`, `/index.html` / coordenador | 6 testes de páginas, rotas da Aula 08 e links efetivos |
| QA independente e 20 ataques mínimos | `docs/AULA08_ADVERSARIAL_QA.md`, parecer final / E | 51 verificações próprias adicionais, sem CRITICAL/HIGH aberto |
| Reprodução automática por mantenedores | `.github/workflows/qa-aula08.yml` / coordenador | Jobs de contratos, Chromium e gate separado dos originais; alunos não usam Actions |
| Implantação docente, homologação, limites e contingência | `INTEGRACAO_SHEETS.md` / D | Runbook completo; G10 ainda PENDING_LIVE_E2E, nenhuma escrita real alegada |

## Verificações executadas

### Comandos e resultados

| Grupo | Resultado |
|---|---|
| `npm ci`, `npm run preflight`, `npm run nota`, `npm run entrega` | Exit 0, logs preservados |
| `npm run web` | Servidor local iniciou; GET 200; encerramento controlado |
| Local / JSONL / páginas | 9 + 16 + 6 = 31 PASS |
| Apps Script A08 | 24 PASS |
| Regressões Mobile / pontuação / avaliador | 15 + 26 + 5 = 46 PASS |
| Total das suítes unitárias e de contratos | **101 PASS** |
| E2E Chromium com Apps Script real da candidata em VM e Sheets simulado | **13 cenários PASS**, zero pageErrors, zero pedidos externos escapando do mock |
| Harnesses independentes de E | **51 verificações PASS**: JSONL 13, servidor 16, sandbox 14, transporte 8 |
| Matriz independente de páginas | **20 combinações PASS**, duas páginas × cinco larguras × duas orientações |
| Regressões browser herdadas na baseline | A07 9/9; matriz A06/A07 24/24 e fluxos 4/4; páginas antigas preservadas |
| Gate das imagens | **Exit 2: BLOCKED G1**, resultado esperado enquanto os originais faltarem |

As granularidades de E2E, harnesses e suítes são diferentes; os números não são somados em um total artificial. Node 24.22.1, npm 11.9.0, Chromium 153.0.8010.0, Playwright 1.57.0 e axe-core 4.10.3 foram usados na sessão. O workflow usa Node 22. O navegador não recebeu flags que desativam segurança da Web.

Os comandos `node --test` solicitados também foram executados pelos proprietários/QA. A execução direta de cada arquivo preservada nos logs torna visíveis as contagens das verificações internas. Para reproduzir o E2E, instalar as dependências de QA indicadas no workflow e executar `node tests/aula08-browser.cjs`. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, `NODE_PATH` e `AULA08_EVIDENCE_DIR` foram opções do ambiente de teste, não requisitos do aluno.

### PDF e capturas

O [índice das evidências](aula08-evidencias/README.md) reúne logs, resultados, screenshots e um PDF de exemplo. **O PDF e a tela de recibo vêm exclusivamente do servidor simulado com nomes fictícios. Não comprovam uma entrega no Google.**

O coordenador renderizou e inspecionou as sete páginas A4 do PDF, sem cortes, sobreposições ou texto fora das margens observados. A extração conservou os acentos. O renderizador MuPDF produziu a inspeção final; o Poppler desse ambiente apresentou substituição de fontes/fontconfig. Os bytes usados no hash e os baixados novamente coincidiram no teste. O PDF não é declarado PDF/UA nem prova autoria.

## Gates e bloqueios

| Gate | Estado real | Evidência |
|---|---|---|
| G0 — Baseline | PASS | SHA/árvore e regressões anteriores registrados |
| G1 — Conteúdo e imagens | **BLOCKED** | Dois PNGs originais ausentes; textos e integração preparados |
| G2 — Projeto local | PASS | Comandos e aplicativo local verificados |
| G3 — JSONL | PASS | Contrato estrito, determinismo, limites e hashes |
| G4 — Verificador | PASS | Execução isolada real, casos variáveis, deadlines |
| G5 — Apps Script | PASS no ambiente simulado | Referência oficial, 20 critérios e A07 preservada |
| G6 — Planilha simulada | PASS | Notas individuais, upsert, média, auditoria, HMAC e falhas |
| G7 — Browser E2E | PASS no Chromium testado | Importação → desafio → sandbox → PDF → recibo simulado |
| G8 — QA adversarial | PASS | Nenhum CRITICAL/HIGH aberto no escopo verificado |
| G9 — Portal e links | PASS | Portal/README atualizados, links relativos verificados; branch publicada |
| G10 — E2E real | **PENDING_LIVE_E2E** | Sem implantação ou escrita real demonstradas |

### Entradas que faltam para G1

Não foram encontrados os arquivos originais nos caminhos fornecidos, nos arquivos da sessão ou nas buscas pelos nomes exatos na área de arquivos disponível:

- `/mnt/data/a_wide_infographic_poster_in_portuguese_with_a_cle.png`
- `/mnt/data/a_clean_colorful_infographic_poster_in_portuguese.png`

Os destinos previstos são `assets/infografico-marcos-av1.png` e `assets/fluxo-aluno-laboratorio-vivo.png`. Não houve geração, substituição ou aprovação de imagens alternativas. Quando os originais forem fornecidos, copiá-los sem substituição, executar o gate de assets e revisar ampliação, alternativa textual, legibilidade e layouts reais. A descrição textual atual permite usar a página, mas não satisfaz o requisito dos dois originais.

## Segurança e limites

**Garantido pelos caminhos de código exercitados:** parser estrito e hash recomputado; rubrica e nota calculadas no servidor a partir da referência; validação de token/TTL/vínculos; bloqueio de replay; recibo com HMAC apenas depois de escrita/flush bem-sucedidos; fontes de estudante nunca executadas no Apps Script; erros testados sem confirmação falsa.

**Mitigado:** adulteração simples de nota ou avaliador local; respostas copiadas de outro desafio; campos extras; fórmulas em nomes; reenvios concorrentes; execução abusiva das funções no browser por CSP, isolamento de origem, remoção de APIs, limites de tempo/saída. Essas afirmações descrevem o escopo testado, não segurança absoluta.

**Não garantido:** autoria, identidade nome-pessoa, ausência de ajuda, veracidade de preflight/log, uso físico em celular, honestidade de um cliente substituído ou impossibilidade de fabricar saídas corretas. SHA-256 identifica os bytes; HMAC autentica a emissão do servidor. Base64 é codificação. Também não há limite rígido de memória do sistema operacional nem transação atômica entre múltiplas escritas do Sheets.

O PDF é gerado antes do envio, com estado pendente, e seus bytes não são alterados depois. O recibo separado confirma o vínculo dos bytes com a gravação. Em falha parcial/timeout, guardar o PDF e conferir com o docente; nenhuma mensagem local transforma isso em confirmação. A contingência offline pressupõe a página já carregada ou servida localmente; não foi implementado service worker.

## Apps Script, Sheets e homologação

O código está pronto para instalação no projeto Mobile existente: atualizar `Code.gs`, preservar `RubricaAula07.gs`, adicionar `RubricaAula08.gs` e seguir o [runbook docente](../lessons/aula-08-av1-incremento-1/INTEGRACAO_SHEETS.md). O destino configurado é a planilha Mobile já existente, aba `4º Bimestre`, coluna `Aula 08`; nenhum endpoint ou planilha de PPI foi utilizado.

A infraestrutura simulada exercitou o código Apps Script da candidata, incluindo notas diferentes por integrante, reenvio, auditoria e falhas. **Não houve implantação real, alteração de Script Properties, POST de entrega ao Google nem escrita na planilha real. Nenhum registro fictício real foi criado; portanto nenhum foi removido.**

G10 exige atualização da implantação, recebimento habilitado, entrega fictícia, confirmação de notas/auditoria, reenvio sem duplicatas e remoção comprovada somente dos registros fictícios. O GET de uma URL Mobile existente não comprova essas condições.

## Findings e parecer

| Gravidade | Situação |
|---|---|
| CRITICAL | Nenhum identificado nos testes executados |
| HIGH | QA08-H01 corrigido e revalidado; nenhum aberto |
| MEDIUM | QA08-M01/M02/M03 corrigidos e revalidados; **QA08-M04 aberto: PNGs originais faltantes** |
| LOW | QA08-L01/L02 corrigidos e revalidados; nenhum aberto |

O [parecer independente](REVISAO_AULA_08_FINAL_20261027.md) e a [matriz dos 20 ataques](AULA08_ADVERSARIAL_QA.md) detalham reproduções, correções e limites. A correspondência entre seus SHAs locais e os SHAs publicados está no mapa de proveniência.

**Estado terminal: `A08_LAB_VIVO_PARTIAL_BLOCKED`.** Falta dos originais impede G1 PASS. G10 continua pendente e está explicitamente separado dos testes simulados.
