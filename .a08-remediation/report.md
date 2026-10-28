# Aula 08 — Remediação F01–F08, candidata v2

Missão MOBILE-A08-REMEDIATION-MA-01. Base auditada fe9cd3dd9f07c0fdc144467df63aa1a4f7c1731c, árvore 9b8fb179233ab8d1aeeda78388f2e45cf31df37d.

**Candidata condicionada a decisões docentes, publicação dos originais e homologação real.** Não há aprovação pedagógica implícita ou operação Google. Sem subagentes nativos: implementação/revisão sequenciais pelo mesmo assistente; revisão independente não executada.

| Finding | Correção candidata | Evidência exigida | Limite |
|---|---|---|---|
| F01 HIGH | Composição normalizada por atividade/equipe, reserva persistente e recusa de mudanças antes de notas | Shrink/add/replace/disjoint; ordem; 10→9,5 para todos; escrita parcial | Nomes não são autenticação; reconciliação docente |
| F02 | Quatro tarefas na CLI, parser e servidor, independentes de participantes | Omissão recusada em cada fronteira | DECISION_REQUIRED_F02 |
| F03 | aiUsage used/not-used/undeclared, reflexão verdadeira e log coerente | Uso/não uso podem pontuar; ausência pendente; contradição recusada | DECISION_REQUIRED_F03; declaração não prova autoria |
| F04 | Quotas por equipe/composição/participante e teto global, não só pacote | Seis equipes com mesmo pacote; rotação; TTL e teto | Nome livre não autentica; abuso apenas limitado |
| F05 | Materiais ativos, CLI e PDF coletivos; tarefas não são alunos | Cinco páginas, 22 passos e inspeção | Relatórios antigos são históricos |
| F06 | Contexto explícito para imagens históricas e hashes originais | Presença e SHA-256 do PNG | Binários disponíveis na conversa mas não publicados; aceite pendente |
| F07 | Axe/overflow/foco por viewport, estados adicionais e matriz JSON | CI navegador e artifact | Sem certificação WCAG ou leitor de tela humano |
| F08 | Erros por campo com texto, aria-describedby/aria-invalid | Unidade e E2E | Servidor valida independentemente |

Schema mobile-a08-v2; rubrica candidata mobile-a08-lab-vivo-2.0.0; gerador/contrato2.0.0; avaliador formativo-2.0.0. Pacote antigo é recusado com orientação para obter projeto atualizado e executar npm run entrega. Starter mantém aiLog vazio, aiUsage undeclared e reflexão vazia: nenhuma experiência é inventada.

Os 20 critérios e pesos 2,5+2+3+2,5 permanecem. M4 verifica todos os arquivos. M1-4 exige reflexão verdadeira e declaração coerente de uso ou não uso. O servidor exige MOBILE_A08_POLICY_APPROVAL=four-tasks-reflection-v2; sem esse aceite de configuração docente, ações oficiais novas são recusadas. A propriedade não é alterada nesta missão e fixtures apenas simulam aceite.

A composição persiste além do TTL dos desafios. Omissão/adição/troca de participantes e equipes homônimas divergentes não são mescladas. Auditoria legada só pode ser reutilizada se cada linha descreve o mesmo conjunto completo. Reserva processing precede notas; sucesso passa committed após flush; falha marca write_failed, sem recibo, bloqueando até reconciliação. Sheets não tem atomicidade multirange.

Mantidos HMAC, SHA-256, allowlist, CSP/origem opaca, deadlines e anti-replay. Nenhum código de estudante roda no Apps Script. Resultado local não é autoridade. Nomes não provam identidade.

Reproduções antes da mudança usaram fontes da auditoria verificadas por hash. Testes focais locais usam RubricaAula08 real modificada e infraestrutura compartilhada extraída/VM, não substituem suíte completa. CI remota é usada para a suíte completa devido à falha de DNS local. O gate dos PNGs continua falhando enquanto não houver publicação, sem sucesso artificial. Conferir execução e SHA antes de declarar PASS.

Pendências: aceitar F02/F03 e contextualizaçãoF06; publicar dois originais sem alteração; autorizar separadamente deployment/E2E/limpeza; revisão por outro agente/pessoa e leitor de tela humano. Estado real: PENDING_LIVE_E2E.
