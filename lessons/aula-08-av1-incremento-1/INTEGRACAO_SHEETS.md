# Aula 08 — Integração e homologação controlada da candidata v2

**PENDING_LIVE_E2E. Este runbook não é autorização de operação.** Nenhum deployment, Script Property, nota ou registro Google foi alterado pela remediação. O destino é exclusivamente o projeto Mobile já versionado; preservar Aula 07 e nunca utilizar PPI.

## Identificação e proveniência

Atividade MOBILE-AULA08-2026; schema mobile-a08-v2; rubrica candidata mobile-a08-lab-vivo-2.0.0; instrumento laboratorio-vivo-av1. Aba 4º Bimestre, coluna Aula 08 antes de Média, auditoria de 17 colunas. A planilha mantém uma linha por participante, com a mesma nota coletiva e o mesmo recibo para todos. Não existe associação nome–slot.

Antes de operar, registrar SHA/tree da distribuição, hashes de Code.gs, RubricaAula08.gs e RubricaAula07.gs, CI, responsável e backup do código/deployment anterior. RubricaAula07.gs deve permanecer intacta. Não publicar segredos, alunos ou notas reais no Git.

## Decisões e autorizações distintas

F02: quatro tarefas obrigatórias para todas as equipes. F03: registro reflexivo verdadeiro de uso ou não uso de IA. F06: contextualização das imagens originais ou derivada expressamente aprovada. Essas propostas não recebem aceite automático pelo fato de existir código.

Também são necessárias autorização de implantação e autorização específica para E2E com equipe fictícia e limpeza. Acesso à planilha ou endpoint não equivale a autorização. Não ativar políticas, alterar permissões ou rotacionar HMAC para fazer um teste passar.

## Pacote e política

Os nomes são informados somente na ficha. O JSONL contém fontes e evidências. aiUsage distingue used, not-used e undeclared. Used exige log real; not-used exige log vazio; undeclared permanece pendente. Para pontuar, reflexão de 20–400 caracteres, sem dados pessoais. Declaração não prova autoria. Default vazio, sem gerar texto em nome dos estudantes.

Schema/contrato v2 rejeitam pacotes antigos com orientação para obter a versão atual e executar npm run entrega. Não converter ou editar o JSONL silenciosamente.

A propriedade docente MOBILE_A08_POLICY_APPROVAL precisa corresponder a four-tasks-reflection-v2 para ações oficiais novas. Até aceite explícito, deixá-la ausente. Challenge/verify/verifyAndSubmit são recusados com DECISION_REQUIRED_F02_F03. Essa propriedade NÃO foi definida no ambiente real; somente fixtures de teste simulam seu valor.

## Protocolo e integridade

Challenge vincula atividade, schema, pacote, fontes, quatro tarefas, equipe, participantes e evidências. Verify recebe saídas dos casos e retorna uma avaliação coletiva com rubric,team,m1,m2,m3,m4,total,criteria. VerifyAndSubmit recalcula a nota, grava e retorna recibo; validateReceipt verifica sua HMAC.

O recibo inclui activity,schema,instrument,rubric,receiptId,receivedAt,challengeId,packageSha256,pdfSha256,answersSha256,sourceHashes,team,members,evaluation,gradeStatus,signature. A HMAC cobre todos os campos exceto a própria assinatura. A ficha confere origem/janela/nonce/canal e vínculos antes de confirmar. Hash identifica bytes; HMAC autentica emissão, não autoria nem identidade real.

Nenhuma fonte de aluno roda no Apps Script. O navegador executa funções em isolamento com CSP, origem opaca, workers descartáveis e limites. O servidor compara dados com sua referência. Resultado local não é autoridade. Um cliente substituído pode fabricar respostas; não prometer inviolabilidade.

## Composição e concorrência

Identidade de equipe é atividade mais nome normalizado; composição é conjunto ordenado de nomes normalizados. Reordenação e diferenças de caixa/espaços não são alteração. Omissão, adição, substituição ou equipe homônima com conjunto disjunto é recusada antes de notas/auditoria.

A composição persiste além do TTL do desafio. Histórico antigo só pode ser reutilizado quando as linhas e cada JSON de auditoria descrevem a mesma composição completa. Nunca inferir ou unir integrantes de registros contraditórios.

Sob ScriptLock, reserva processing precede escrita; após flush passa a committed. Falha marca write_failed, não emite recibo e bloqueia novos desafios até reconciliação. Sheets não oferece atomicidade multirange: dados parciais podem existir mesmo sem confirmação. Não apagar reserva para contornar bloqueio.

## Limites de tentativas

Desafio válido por dez minutos. Cinco emissões por equipe e composição, dez por participante, cem globalmente no intervalo. Mudar o pacote não renova quota. Equipes legítimas com mesmo pacote não compartilham a quota de cinco. Há teto de desafios e retenção para replay/diagnóstico.

Nomes livres não autenticam identidade. Quotas mitigam abuso, mas não eliminam rotação de identidades, negação de serviço ou fraude. Antes de uso real, o responsável deve confrontar limites com tamanho da turma e políticas institucionais; não aumentá-los silenciosamente nesta frente.

## Implantação — apenas após autorização

1. Conferir projeto Apps Script Mobile, planilha cadastrada, backup, responsável e SHA aprovado.
2. Instalar Code.gs e RubricaAula08.gs da mesma distribuição. Manter RubricaAula07.gs original.
3. Registrar o aceite de F02/F03 antes de definir MOBILE_A08_POLICY_APPROVAL. Manter MOBILE_WEB_SUBMISSIONS_ENABLED conforme autorização operacional.
4. Publicar no deployment Mobile autorizado, preservando a URL /exec. Mudança de allowlist precisa de autorização. GET sanitário legado não demonstra disponibilidade da Aula 08.
5. Não criar notas/colunas antecipadamente. O fluxo autorizado insere Aula 08 antes de Média quando necessário.

## Homologação real — autorização separada

Utilizar equipe fictícia exclusiva e nomes fictícios previamente aprovados, sem colisão com estudantes. Registrar somente o necessário, sem exportação massiva.

1. Importar fixture JSONL v2, informar equipe e participantes.
2. Percorrer challenge → verify → PDF/hash → verifyAndSubmit → validateReceipt. Conferir versões, nota coletiva e recibo.
3. Conferir hash dos bytes do PDF e igualdade do segundo download.
4. Conferir a mesma nota em todas as linhas, média, Aula 07 preservada e 17 colunas de auditoria.
5. Reenviar composição idêntica reordenada com resultado alterado: todos atualizam sem duplicatas.
6. Omissão, adição ou troca de participante deve ser recusada antes de alterar notas/auditoria.
7. Falhas destrutivas, corrupção, quotas e concorrência forçada pertencem às simulações, não à planilha real. Erro/timeout nunca confirma entrega.
8. Remover somente linhas fictícias e registros técnicos criados no teste conforme lista autorizada. Preservar colunas, fórmulas e dados reais. Documentar limpeza, data e responsável.

HTTP 200 não basta: exigir gravação conferida, igualdade das notas, reenvio, auditoria, PDF/recibo e limpeza.

## Reconciliação e rollback

ROSTER_CHANGED exige conferir a composição com o professor; não autoriza atualizar omitidos. ROSTER_RECONCILIATION_REQUIRED/write_failed exige suspender a equipe, confrontar challengeId/receiptId/boletim/auditoria e obter autorização específica para as células/registros necessários.

Sem autorização de produção, rollback apenas da candidata Git. Na implantação autorizada, suspender A08 retirando o aceite enquanto v2 estiver ativa. **Não restaurar a versão A08 antiga vulnerável.** Alternativa pelo responsável: distribuição A07-only verificada que recuse A08 e preserve Aula 07. Nunca reverter notas ou apagar auditoria automaticamente.
