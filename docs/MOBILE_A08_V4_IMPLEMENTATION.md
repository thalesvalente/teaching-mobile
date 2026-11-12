# MOBILE A08 V4 — implementação e decisões

## Escopo e reutilização

A missão continua a branch `feat/aula08-lab-vivo-ciclos-20261111`, inicialmente em `e429771c3dd7483dbd513d0b6be7ee4cf6e1c2e3`. A v3 `3be105d1de2c5f917851fa18278ba72f0116c177` já era ancestral da v4. Não houve reinício, cherry-pick redundante, alteração da PR histórica #4 ou recriação da planilha da turma.

Foram preservados a bancada, a fonte TSX, os desafios, os quatro ciclos, os recursos visuais e o backend Mobile original. A referência de experiência permanece a [Aula 05 Web](https://thalesvalente.github.io/teaching-web-development/lessons/aula-05-laboratorio-web-mobile/): missão junto ao código, Executar, Conferir missão, Faça → Observe → Entenda, prévias e continuidade. Conteúdos sobrepostos foram mantidos intencionalmente, com aprofundamento em falhas, validação, imutabilidade, idempotência e regressão.

## Arquitetura executável

| Parte | Implementação | Verificação |
|---|---|---|
| Bancada | `laboratorio-vivo/index.html`, `lab.js`, `style.css` | Playwright C1 e C3; cinco larguras e reflow adicional |
| Fonte do aluno | `laboratorio-vivo/shared/ProjetoUniversal.tsx` | Compilação TSX real, typecheck Expo, starter 0/20 |
| Critérios únicos | `laboratorio-vivo/criteria.js` | 20 IDs iguais no cliente, backend e matriz |
| Compilador | `runtime-compiler.js` | Imports limitados, orçamento cooperativo, erros recuperáveis |
| Prévia | `preview.html`, `preview.js`, vendor local | Iframe de origem opaca, CSP, nonce/revisão e fonte da mensagem |
| Expo v4 | `laboratorio-vivo/projeto/` | Lockfile, `npm ci`, `typecheck`, `test:starter`, export Web |
| Expo Router v3 | `avancado/projeto/` | Engine original preservada; lockfile, pares compatíveis, typecheck e critérios comuns |
| Equipe | `equipe-roster.js`, `roster-client.js` | Matrícula confirmada por cadastro; nomes/matrículas não persistidos automaticamente |
| Evidências | `report-print.js`, checkpoint JSON | PDF A4 parcial, retomada, hash TSX, validação de importação |
| Receptor | `integrations/mobile-aula08-appscript/Code.gs` | 32 testes autorais + 9 independentes (incluindo fidelidade de datas), com Google simulado |
| CI/prévia | `.github/workflows/qa-aula08-live-v4.yml` | SHA exato, permissões de leitura, artifacts e nenhuma implantação |

Os caminhos abreviados partem de `lessons/aula-08-av1-incremento-1/`. A [matriz detalhada](MOBILE_A08_V4_CRITERIA.md) liga cada critério ao trecho e ao teste concreto.

## XP, testes e nota

1. **XP formativo:** cada missão conquistada soma 5 XP, até 100. A conquista é histórica e não desaparece porque a edição seguinte contém regressão.
2. **Resultado técnico atual:** registra a revisão/hash do TSX e o resultado atual por critério. Editar, importar ou restaurar fonte invalida a fotografia técnica anterior; é necessário conferir novamente. Os dados são declarados pelo navegador e tratados como não confiáveis pelo servidor.
3. **Nota validada:** continua nula na recepção. A rubrica institucional tem vinte critérios de 0,5, cuja conferência é registrada por docente autenticado e vinculada ao código recebido. Somente essa etapa pode escrever Resultados e o bimestre, após autorização própria.

A escolha por conferência docente evita criar um serviço de execução remota de código de estudantes com credenciais. O Apps Script não interpreta TSX. A assinatura HMAC protege a integridade do registro emitido; não autentica o estudante nem prova que o código passou nos testes.

## Reconciliar v3 e v4

O wrapper Expo v4 importa a fonte TSX diretamente do diretório compartilhado da bancada. Não há segunda cópia a atualizar. O download `.tsx` do editor pode substituir essa fonte no checkout local.

A v3 conserva Expo Router e sua engine original como aprofundamento complementar. Seus scripts de avaliação passam a reutilizar o mesmo módulo de vinte critérios, evitando contratos divergentes. Dependências foram fixadas por lockfile. O starter permanece deliberadamente incompleto; `npm test` no projeto do aluno exige solução completa, enquanto `npm run test:starter` verifica que as vinte pendências esperadas continuam presentes. A suíte QA verifica separadamente a referência completa, a mutação de entrada, a idempotência e as regressões.

A referência de QA fica fora de `lessons/`, do bundle e do projeto distribuído. Exemplos exportados usam dados fictícios e starter/código parcial. O repositório é público; a separação de pastas não é promessa de sigilo dos testes.

A instalação remota revelou uma incompatibilidade real do lockfile v3 com npm 10: o peer transitivo do Expo exigia `@expo/metro-runtime` 57.0.18. O pacote e o lockfile foram alinhados, com reprodução da falha e do reparo usando Node 22/npm 10.9.9. `npm ci` foi preservado e passou depois da correção; não foi substituído por uma instalação permissiva.

## Segurança e limitações de execução

O iframe usa `sandbox="allow-scripts"` sem `allow-same-origin`, com CSP que restringe rede, frames, formulários e recursos. A página aceita mensagens apenas da janela esperada, com canal, nonce e revisão correspondentes. O compilador rejeita APIs ambientais/imports fora do contrato e instrumenta loops/funções com orçamento cooperativo. Isso reduz acidentes comuns e não é garantia de limites absolutos de CPU/RAM contra código hostil.

O WebKit recusou `'self'` no iframe de origem opaca. A inicialização agora permite somente quatro caminhos exatos de scripts na origem Pages prevista e em loopback local; depois de carregar esses scripts, uma segunda política cumulativa bloqueia novas cargas antes de aceitar código do aluno. Os testes independentes tentam conexões, imagem, beacon, script arbitrário e recarga de um script de inicialização. O orçamento de CPU reinicia por turno do event loop: vinte e cinco interações normais rápidas não acumulam o tempo de espera entre ações, enquanto um loop síncrono continua interrompido.

O avaliador CLI usa worker local com ambiente vazio, limite temporal e heap. Não é serviço para receber código de terceiros nem sandbox de sistema operacional. A autoridade de nota continua no processo docente descrito acima. O [parecer independente](MOBILE_A08_V4_SECURITY_REVIEW.md) documenta as fronteiras e os testes adversariais.

## Acessibilidade e documentos

As abas de painéis e arquivos usam foco móvel entre abas, setas, Home/End e identificação do painel ativo. O contador numérico de XP permanece visível em telas estreitas. Os dois componentes React usam `useId()` e prefixos distintos em `createRoot`, evitando que um campo descreva o erro da outra prévia. O guia aponta elementos e funções existentes no TSX entregue.

O PDF foi validado no arquivo efetivamente produzido, incluindo o rodapé de `@page`, as vinte missões, os quatro ciclos, o SHA-256 completo e a geometria A4. O rodapé herdado de Web foi corrigido. Uma suspeita visual de hash cortado foi retirada após medição confirmar os 64 caracteres dentro da margem; a regra de quebra de linha é preventiva. O documento é legível visualmente, mas PDF/UA, leitor de tela e conformidade integral WCAG não foram homologados.

## Preservação e publicação

A main foi reconciliada **na candidata**, resolvendo o conflito do portal e mantendo os links e builds Memórias/EDA. Os arquivos existentes das Aulas 06/07, `lessons/3` e `apps/` permanecem iguais à main auditada. O adaptador A08 v2 antes colocado na pasta da Aula 07 foi preservado como fixture de regressão; Code.gs ativo da Aula 07 foi restaurado byte a byte da main.

A falha histórica de CI era de YAML, antes de qualquer job. Foi corrigida a string com dois-pontos sem aspas, acrescentado push da candidata, fixadas dependências QA e registrados SHA/árvore efetivamente testados. Os testes históricos continuam ativos. Compilação usa permissões de leitura; a capacidade de publicar está separada e condicionada à main.

A primeira revisão do novo workflow também encontrou contexto `runner.temp` em `jobs.<job>.env`, posição recusada pelo GitHub antes dos jobs. Foram usados caminhos relativos e acrescentada uma verificação semântica desse caso ao checker. Falhas iniciais, logs, reparos e sucessos posteriores foram preservados; nenhum assert foi comentado para obter aprovação.

`build-aula08-preview.mjs` prepara um artefato sem publicar. Mantém os aplicativos anteriores, inclusive seus assets em caminhos `assets/node_modules`, e exclui dependências locais, testes e backend v4. O verificador confirma links da bancada, recursos compartilhados e igualdade dos aplicativos existentes. A configuração do frontend continua com endpoint vazio e release falso.

## Referenciais de qualidade

### Execução por fases e autoridade

O [manifesto da missão](aula08-v4-evidencias/mission-manifest.json) registra baseline, responsáveis, caminhos canônicos, invariantes e políticas `shell/net/io` por fase. A política operacional parte de negação e permite somente leitura conectada, alterações na candidata, testes e evidências fictícias. Produção tem listas vazias e depende de aprovação específica. Essas regras orientam a execução; não são apresentadas como um sandbox de sistema operacional.

C0 integra; C1 mantém bancada/Expo; C2 mantém backend/contratos; C3 escreve cenários adversariais e parecer independente; C4 verifica Actions/publicação. As edições são distribuídas por arquivos. Commits remotos utilizam árvore conferida e atualização da referência com `expected_sha`, sem force-push. A documentação conserva falhas iniciais, reparos e readback; nenhum resultado simulado recebe o rótulo de homologação conectada.

Os perfis normativos foram usados como organização de requisitos/rastreabilidade, descrição arquitetural, qualidade, integridade de dados, controles e ciclo de vida. Não se declara certificação ISO ou conformidade integral WCAG. Referências públicas de implementação: [sintaxe Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) e [WCAG 2.2](https://www.w3.org/TR/WCAG22/). A verificação efetiva e seus limites estão em [QA](MOBILE_A08_V4_QA.md).
