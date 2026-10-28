# Aula 08 — Runbook da candidata v2

**PENDING_LIVE_E2E. Este documento não autoriza operação. Nenhum deploy, propriedade ou dado Google foi alterado.** Destino único Mobile, preservando Aula 07; não usar PPI.

Atividade MOBILE-AULA08-2026; schema mobile-a08-v2; rubrica mobile-a08-lab-vivo-2.0.0; instrumento laboratorio-vivo-av1; aba 4º Bimestre, Aula 08 antes de Média; Auditoria existente de17colunas. Uma linha por participante mantém a mesma nota e recibo coletivos. Quatro tarefas para equipes de1–4pessoas, sem associação nome–arquivo.

## Antes da implantação

Registrar SHA/tree, hashes de Code.gs/RubricaAula08.gs/RubricaAula07.gs, CI e backup da distribuição/deployment. RubricaAula07.gs deve permanecer intacta. Não publicar segredos ou nomes/notas reais. Obter decisões separadas de F02(quatro tarefas), F03(reflexão com ou semIA), F06(contextualização dos originais), implantação e E2E com equipe fictícia/limpeza. Não inferir aceite do acesso ao endpoint.

## Migração e aceite

Evidências: aiLog e aiUsage:{status,reflection}; used exige log real; not-used exige log vazio; undeclared é informação ausente. Reflexão de20–400caracteres para pontuar, sem dados pessoais; não prova autoria. Default vazio, nunca preencher pelo aluno. Obter projeto atualizado e gerar JSONL novamente. Não editar nem converter pacotes antigos silenciosamente.

Somente depois de autorização: abrir Apps Script Mobile existente e conferir planilha/identificador; instalar Code.gs e RubricaAula08.gs do mesmoSHA, preservarRubricaAula07.gs. Até aceiteF02/F03, deixar ausente MOBILE_A08_POLICY_APPROVAL. Somente com decisão docente registrada, definir MOBILE_A08_POLICY_APPROVAL=four-tasks-reflection-v2. Isso não autentica alunos nem autoriza liberação automática. Conferir MOBILE_WEB_SUBMISSIONS_ENABLED conforme autorização. Não rotacionarHMAC nem mudarpermissões para destravar. Publicar no deploymentautorizado, preservar/exec; GETlegado não comprovaA08. Não criarcolunas/linhas antecipadamente.

## E2E autorizado

Usar equipe/nomes fictícios exclusivos previamente aprovados, sem colisão comalunos. Registrar apenas dadosnecessários antes/depois.

1. ImportarfixtureJSONLv2, informar equipe e nomes semslots.
2. Challenge→verify→nota coletiva→PDF/hash→verifyAndSubmit→validateReceipt; conferirversões/HMAC.
3. ConferirPDF e segundo download byteabyte/hash dorecibo.
4. Conferirmesmanota emtodas aslinhas, média, preservaçãoA07 e17colunasAuditoria.
5. Reenviar mesmacomposição reordenada e notaalterada: todosatualizam semduplicatas.
6. Omitir/adicionar/substituir pessoa: recusadoantes dealterarnotas/auditoria.
7. Erro/timeout não confirma. Não injetarfalhas destrutivas na planilhareal; usar simulação para corrupção,quotas/concorrência.
8. Remover somente linhasfictícias e registros técnicos criadosnesse testeconforme listaaprovada. Preservarcolunas/fórmulas/dadosreais; comprovarlimpezae responsável.

HTTP200não basta: exigir escritaigual, reenvio, auditoria,PDF/reciboelimpeza.

## Reconciliação e rollback

ROSTER_CHANGED nãoautoriza atualizaromitidos ou apagar cadastro. ROSTER_RECONCILIATION_REQUIRED/write_failed exige suspender equipeeconfrontar challengeId/receiptId/boletim/auditoria. Alteração somentecom autorização docente específicaelistadecélulas. Reserva permanecebloqueada até reconciliação. Não há atomicidadeSheets.

Semautorização, rollback apenasGit nacandidata. Emproduçãoautorizada, suspender A08retirando aceiteenquantov2ativa. **Não restaurarA08antigavulnerável.** Alternativa peloresponsável: distribuiçãoA07-onlyverificada querecuseA08, preservandoA07. Nãoreverter notasouapagadauditoriaautomaticamente.

Quotas: desafio10min; cinco porequipe/composição, dezporparticipante, cemglobalmente. Pacotealterado nãorenovaquota. Nome livre nãoéautenticação; quotaslimitam,nãoeliminamabuso. Nenhumcódigo recebido executanoAppsScript. CSP/origemopaca/workers/deadlinespreservados. HMACautenticaemissão,nãoautoria.
