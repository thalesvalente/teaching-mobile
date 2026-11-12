# Aula 08 — QA independente e adversarial

Missão `MOBILE-A08-LAB-VIVO-AV1-IMPLEMENT-01`, frente E, revisor nativo real `/root/qa`.

## Escopo e independência

O revisor trabalhou em worktree isolada e não escreveu código de produção nem alterou testes herdados. Executou as suítes existentes e criou harnesses temporários próprios para atacar o contrato JSONL, o sandbox, o transporte e o servidor. Correções foram encaminhadas ao coordenador ou ao proprietário D; a revalidação é registrada abaixo. Nenhuma revisão substitui a implantação, o teste real da planilha ou a homologação docente.

Baseline e regressões iniciais: [registro independente](REVISAO_AULA_08_BASELINE_20261027.md). O parecer foi fechado sobre a candidata integrada `b5de67bf8db0c4904212b8ad887f4dc9da261a4d`, árvore `46d46cb27f6260525b43b2f2628e0a5e88c0b533`. Os snapshots abaixo registram a origem das verificações por componente; as suítes integradas foram reexecutadas no SHA final, conforme [revisão final](REVISAO_AULA_08_FINAL_20261027.md).

## Snapshots e testes efetivamente executados

| Superfície | Identificação | Evidência independente |
|---|---|---|
| Projeto/JSONL | `8fff55e3f2adc651cc637fc49313aeab0e5c076f` | Snapshot isolado: 25/25 testes autorais reexecutados; 13/13 ataques adicionais; `npm ci`, `preflight`, `nota`, `entrega` exit 0 |
| Apps Script | `5162a3101cc4ebb05fd41aae1694269da9ce452b` | 24/24 testes Aula 08, 15/15 regressões Aula 07, 16/16 ataques adicionais via `doPost` em VM |
| Sandbox | Arquivo integrado do coordenador, após correção do worker clássico | 14/14 testes próprios finais, incluindo execução pura real, rede, DOM, armazenamento, loops, limpeza e oito formatos de saída não JSON rejeitados |
| Transporte | Arquivo integrado, após suporte a hostname HtmlService | 8/8 testes próprios Chromium, com frames aninhados, origem/nonce/source incorretos, timeout e endpoint PPI |
| Páginas | Introdução e ficha do coordenador | 20/20 combinações: duas páginas × cinco larguras × retrato/paisagem; zero overflow e zero violações axe nos testes executados |

As larguras da revisão de páginas foram 320, 375, 768, 1024 e 1440 px, cada uma em retrato e paisagem. O skip link levou o foco a `#conteudo` nas duas páginas. Importação e andamento usam `role=status`/`aria-live=polite`. O banner offline apareceu quando a rede do contexto Chromium foi desativada. Capturas da introdução em 1440 px e da ficha em 375 px foram inspecionadas visualmente, sem cortes ou sobreposição observados. Os infográficos ausentes não foram considerados aprovados.

O starter gerou um pacote de 7.629 bytes com quatro slots no snapshot testado. As notas formativas iniciais foram 4,5; 5,0; 5,0; 5,0, com pendências reais e log de IA vazio. Esse resultado não foi usado como autoridade pelo servidor.

## Os 20 ataques mínimos

| Nº | Ataque executado | Resultado observado e barreira |
|---:|---|---|
| 1 | Substituir `avaliacao-local.mjs` para sempre passar | O teste executado altera somente o relatório formativo; as fontes avaliadas permanecem as mesmas. A verificação oficial ignora esse resultado. |
| 2 | Editar `local-result` para nota 10 | Com hash antigo, rejeição. Após rehash completo, é aceito apenas como metadado; com todas as funções falhando, o servidor conservou os 2,5 pontos legítimos de M1, nunca a nota 10 declarada. |
| 3 | Alterar Base64 sem atualizar hash da fonte | Rejeitado pelo importador, inclusive quando o hash global é recalculado. |
| 4 | Atualizar hash da fonte e conservar package hash antigo | Rejeitado por incoerência do hash global. |
| 5 | Fabricar package hash | Rejeitado por recomputação SHA-256 independente. |
| 6 | Remover `end` | Rejeitado por estrutura/contagem de linhas. |
| 7 | Duplicar fonte | Rejeitado mesmo com envelope recalculado. |
| 8 | Incluir arquivo fora da allowlist, incluindo `.env` | Rejeitado. O gerador também recusa arquivos ausentes, symlinks e tamanho excessivo. |
| 9 | Enviar mais de quatro slots | Rejeitado pelo contrato e pelo servidor. |
| 10 | Trocar `activity` ou schema | Rejeitado; não recebe desafio Aula 08 válido nem gera linhas de nota. |
| 11 | Reutilizar desafio consumido/expirado | Rejeitado; a expiração foi testada também exatamente no limite de 600.000 ms. Não há duplicação de linhas. |
| 12 | Alterar challenge token | Verificação e envio recusados. |
| 13 | Enviar outputs de outro pacote/desafio | Rejeitado por IDs/vínculos. Alterar o hash de uma fonte depois da emissão também é recusado. |
| 14 | Inserir loop infinito no corpo ou no topo do módulo | Worker encerrado; retorno `TIMEOUT` em aproximadamente 0,5 s com o prazo do harness. Promise que nunca resolve também foi encerrada. |
| 15 | Tentar rede no sandbox | `fetch` direto indisponível; `fetch` recuperado de protótipo e import remoto bloqueados pelo CSP. Zero requisições alcançaram o endpoint local de exfiltração. |
| 16 | Nomes com fórmulas de planilha | Nomes com `=`, `+`, `-`, `@` ou tabulação/fórmula recusados. Texto de equipe começando com fórmula é escapado como texto no servidor; não é fórmula executável. |
| 17 | Reenvio simultâneo/reentrante | `LockService` impediu a segunda execução; exatamente um recibo foi emitido e uma linha por integrante foi mantida. |
| 18 | Simular timeout do transporte | Promise rejeitada, iframe/form removidos; nenhuma confirmação. Origem, nonce ou janela incorretos também terminam sem confirmação. |
| 19 | Alterar nota/campos no recibo | Mutações em nota, pacote, PDF, respostas, equipe, atividade e assinatura recusadas pelo HMAC. O recibo original valida e seu hash corresponde ao corpo canônico. |
| 20 | Usar endpoint da PPI | Frontend recusou antes de qualquer POST. A allowlist contém somente a implantação Mobile configurada. |

Também foram exercitados chaves JSON duplicadas, chaves reservadas de protótipo, BOM em string/bytes, UTF-8 e Base64 inválidos, payload grande, dados pessoais reconhecíveis em fonte, valores fora de JSON, campos `grade`/`xp`/`scores`/`passed` fora do contrato, falha de escrita e `flush` falho após escrita parcial. Scripts dentro de saídas foram tratados como dados; não executaram no Apps Script nem no documento pai.

## Findings e revalidação

| ID | Gravidade | Finding | Correção / situação |
|---|---|---|---|
| QA08-H01 | HIGH | Worker `type:module` criado a partir de blob no iframe de origem opaca falhava antes de executar até uma soma pura. | **Corrigido pelo coordenador.** Worker de bootstrap clássico, mantendo import do módulo do aluno, origem opaca e CSP. Harness original reexecutado sem transformação: 13/13 PASS. |
| QA08-M01 | MEDIUM | Regex de origem não incluía o formato `n-...-script.googleusercontent.com` usado por iframes HtmlService. | **Corrigido pelo coordenador.** Regra específica adicional, sem wildcard geral; nested frame desse formato passou e sibling/origem indevidos falharam. E2E real continua pendente. |
| QA08-M02 | MEDIUM | M3-4 avaliava formulários inválidos, mas não exigia aceitar um formulário válido. | **Corrigido por D em `5162a3101cc4ebb05fd41aae1694269da9ce452b`.** Casos válido e fronteira 80/40 adicionados, mantendo 20 critérios; mutante que sempre rejeita não pontua. |
| QA08-M03 | MEDIUM | `JSON.stringify` convertia `NaN` em `null` no worker, divergindo do avaliador local e podendo dar crédito a uma saída originalmente inválida. | **Corrigido pelo coordenador em `b5de67bf8db0c4904212b8ad887f4dc9da261a4d`.** Validação anterior à serialização, intrinsics capturados e protótipos congelados. NaN, Infinity, NaN aninhado, undefined em array/objeto, array esparso, getter e toJSON rejeitados; 14/14 testes do sandbox PASS. |
| QA08-M04 | MEDIUM / bloqueio de entrada | Os dois infográficos originais obrigatórios não foram fornecidos nos caminhos indicados. | **Aberto, dependência externa.** Descrições textuais e locais de integração existem; não houve regeneração/substituição. G1 não é PASS. |
| QA08-L01 | LOW | `issuedAt` inválido podia gerar `NaN` na comparação de TTL do frontend. | **Corrigido pelo coordenador.** Validação explícita de data finita, ordem temporal e emissão futura. A autoridade do servidor já rejeitava desafios não válidos. |
| QA08-L02 | LOW | Exceção síncrona em `form.submit` não limpava imediatamente os recursos de transporte. | **Corrigido pelo coordenador.** Exceção passa pela mesma função de encerramento/limpeza. |

Nenhum CRITICAL foi encontrado nos ataques executados. O HIGH reproduzido foi corrigido e revalidado. Isso descreve a evidência obtida; não é garantia de ausência de outras vulnerabilidades.

## Limites que permanecem

1. O servidor não executa fontes de estudantes. Recebe saídas e metadados e compara com sua referência. Um cliente completamente malicioso pode fabricar respostas; hashes e HMAC não provam autoria ou execução honesta.
2. M1 combina validação estrutural e evidências declaradas. A presença de log não comprova que a ajuda da IA ocorreu da forma declarada.
3. O sandbox usa isolamento de origem, CSP, remoção de APIs e limites de tempo/saída. Não se declara defesa absoluta contra vulnerabilidades do navegador nem limite rígido de memória do sistema operacional.
4. Sheets não oferece transação multirange. Uma falha pode deixar escrita parcial, mas o código não emite confirmação e mantém o desafio reservado/falho. O professor deve conferir antes de reenviar.
5. O conjunto de testes com Sheets é simulado. O GET público do endpoint Mobile retornou a mensagem de versão esperada, mas isso não atesta recebimento Aula 08, permissão de POST, implantação atualizada ou gravação na planilha.
6. Nenhum POST real foi feito por este revisor, nenhum estudante real foi usado e nenhum registro fictício foi criado ou removido na planilha real. G10 permanece `PENDING_LIVE_E2E`.
7. Axe e inspeção visual não substituem tecnologia assistiva real, revisão dos infográficos quando forem fornecidos ou homologação docente. PDF não é declarado PDF/UA.

## Reprodutibilidade dos harnesses independentes

Os harnesses foram executados como arquivos temporários de QA fora do repositório; não substituem as suítes versionadas. Seu procedimento foi: construir ou importar um pacote válido, aplicar uma mutação por caso, recalcular somente os hashes especificados pelo ataque, chamar o mesmo importador/`doPost`/módulo de browser da candidata e afirmar a saída, a ausência de confirmação, o estado de auditoria e a ausência de tráfego de exfiltração. O runtime foi Chromium real, sem argumentos que desabilitam segurança da Web. Os comandos e fixtures versionados relevantes estão em `tests/aula08-*.test.*`, `tests/mobile-entregas-aula08.test.cjs` e `tests/aula08-browser.cjs`.

Parecer final: **G8 PASS no escopo verificado**, nenhum CRITICAL/HIGH aberto e nenhum finding de código MEDIUM aberto. Permanece QA08-M04 (originais PNG ausentes), bloqueando G1; G10 permanece `PENDING_LIVE_E2E`. A missão completa deve ser classificada como `A08_LAB_VIVO_PARTIAL_BLOCKED` enquanto faltar G1. Não chamar a solução de implantada.
