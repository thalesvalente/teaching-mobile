# MOBILE-A08-REMEDIATION-MA-01 — Candidata v2

Base auditada: fe9cd3dd9f07c0fdc144467df63aa1a4f7c1731c; árvore 9b8fb179233ab8d1aeeda78388f2e45cf31df37d. Destino exclusivo teaching-mobile, branch feat/aula-08-laboratorio-vivo-av1-20261027, PR Draft #4. Sem merge, force push ou operação Google.

## Estado e autoridade

**A08_REMEDIATION_CONDITIONAL.** Implementação não equivale a aceite docente, implantação ou liberação de notas. Não havia subagentes nativos: frentes e revisão sequenciais pelo mesmo assistente; revisão independente por outro agente/pessoa NOT_EXECUTED.

F02 propõe quatro tarefas para todos; F03 propõe reflexão verdadeira com ou sem IA; F06 propõe contextualizar os originais. Decisões ainda pendentes. Servidor v2 nega ações oficiais novas até MOBILE_A08_POLICY_APPROVAL=four-tasks-reflection-v2, valor que não foi configurado no Google. Fixtures simulam aceite apenas nos testes.

## Matriz de remediação

| Achado | Mudança | Testes de encerramento técnico | Restrição residual |
|---|---|---|---|
| F01 HIGH | Composição persistente normalizada por atividade/equipe; recusa alteração antes de notas/auditoria; reserva processing/committed/write_failed | Shrink/add/replace/disjoint, ordem/case/espaços, reenvio 10→9,5 para todos, histórico inconsistente e falha parcial | Nomes não autenticam identidade; reconciliação docente |
| F02 MEDIUM | Quatro tarefas exigidas na CLI, parser e servidor, independentes de participantes | Omissão recusada em todas as fronteiras; equipes de 1–4 pessoas | DECISION_REQUIRED_F02 |
| F03 MEDIUM | aiUsage used/not-used/undeclared com reflexão e log coerente | Uso/não uso completos podem atingir 10; ausência pendente; contradições recusadas | DECISION_REQUIRED_F03; declaração não prova veracidade |
| F04 MEDIUM | Quotas por equipe, composição e participante, com teto global, não somente por pacote | Seis equipes legítimas com mesmo pacote; troca de pacote; rotação de nome; expiração e teto global | Não elimina Sybil/DoS; não é autenticação |
| F05 MEDIUM | Cinco páginas, 22 passos, guias, comentários das tarefas e PDF coletivos; documentação v2 | Testes de páginas e revisão textual; critérios/rótulos consistentes | Relatórios anteriores são históricos |
| F06 MEDIUM | Originais preservados localmente; hashes e contextualização explícita antes de figuras | Gate exige PNG e SHA exatos; texto distingue Expo/Web, app/arquivos, nota individual/coletiva e 9,2 | Publicação binária remota e aceite docente pendentes |
| F07 MEDIUM | Axe, overflow e foco executados dentro de cada viewport; estados interativos adicionais | Matriz JSON por página, viewport, estado e resultados | Leitor de tela humano e uso com estudantes não executados; sem certificação WCAG |
| F08 LOW | Mensagens por campo, normalização coerente, aria-invalid/describedby e foco no erro de submissão | Campo vazio, curto, longo, fórmula, caracteres e duplicatas; E2E de identificação inválida | Servidor valida independentemente |

## Contratos preservados e migração

20 critérios de 0,5 e pesos 2,5+2+3+2,5. Uma nota para a equipe, mesma nota em cada linha dos participantes. HMAC/hash, referência no servidor, allowlist, anti-replay, CSP/origem opaca, workers/deadlines preservados. Nenhum código de estudante executa no Apps Script.

Schema mobile-a08-v2, rubrica candidata mobile-a08-lab-vivo-2.0.0, gerador/contrato2.0.0, avaliador formativo-2.0.0. Versão não é aprovação. Pacotes antigos são recusados com orientação para obter projeto atualizado e gerar novamente. Starter: aiLog vazio, status undeclared, reflexão vazia; nenhum trabalho fictício preenchido.

Composição é conjunto normalizado, não ordem de digitação. Registro da equipe persiste além do TTL de desafios. Alteração de participantes/homônimos divergentes não é automaticamente conciliada. Auditoria legada só é admitida se cada linha descreve a mesma composição completa. Falha parcial bloqueia a equipe até reconciliação, sem recibo; não há promessa de transação multirange.

## Evidências e publicação

Reproduções iniciais confirmaram os defeitos. Após obtenção da baseline completa pelo artifact da CI, a suíte local passou com 128 testes. A qualificação remota somente leitura (run 40609444571; staging fcc1e83bac6dd8952052323ef51b36b4049f4eb1) executou a candidata em runner efêmero: 128 testes, 15 cenários Chromium e 67 amostras reais de axe/overflow/foco, sem falhas nesses checks. G1 continuou bloqueado pelos binários ausentes no Git.

A CI de qualificação não publicou código: usou contents:read, sem credencial persistida, e exportou fontes/hash/evidências. A integração é publicada explicitamente pelo conector GitHub após revisão. O workflow e os scripts temporários são removidos da árvore integrada. A CI regular passa a testar Linux e Windows e exporta evidências do navegador. Diferenças finais de texto, foco e documentação precisam ser revalidadas no SHA integrado; não confundir qualificação do staging com CI final.

Os originais existem na conversa (não são ausência de fornecimento), mas não há transferência binária concluída pelo conector nesta frente. O gate não é desativado, imagens não são regeneradas e nenhum placeholder é considerado aprovação.

## Pendências para uso oficial

Aceite F02/F03 e contextualização F06; publicação dos PNGs exatos; revisão independente; homologação autorizada Apps Script/Sheets com equipe fictícia, reenvio, auditoria, recibo/PDF e limpeza. Leitor de tela humano e estudantes: NOT_EXECUTED. Google: PENDING_LIVE_E2E. Nenhuma senha, nota real ou nome de estudante foi empregado nos testes ou publicado.
