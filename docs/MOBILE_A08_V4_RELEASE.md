# MOBILE A08 V4 — prévia e gates de liberação

## Estado operacional

**MOBILE_A08_V4_BLOCKED_EXTERNAL_DEPLOYMENT** enquanto não existir prova conectada de Apps Script QA. A candidata permanece revisável no GitHub; nenhuma operação de produção foi executada. O estado técnico exato deve ser lido com o relatório QA e os artifacts da execução vinculada ao HEAD da PR.

Não se usa `COMPLETE` porque não há publicação/homologação operacional. Não se pede aprovação genérica de produção para compensar a ausência de uma homologação QA.

## Mudança preparada

| Destino | Mudança candidata | Impacto | Reversão |
|---|---|---|---|
| Branch v4 | Código, testes, docs e reconciliação main→v4 | Somente desenvolvimento/PR | Preservar commits e reverter a mudança na branch |
| Portal Mobile | Link canônico da bancada, mantendo aulas anteriores | Publicável apenas após aprovação | Revert do commit de integração do portal |
| Pages | Prévia `_site` produzida por CI, sem deploy | Artefato para inspeção | Nenhum efeito público a reverter nesta missão |
| Apps Script QA | Código 4.1.0 + manifesto + propriedades exemplo | Requer conta correta e implantação isolada | Bloquear recebimento QA, preservar recibos fictícios |
| Apps Script PROD | Preparação aponta à planilha existente; flags falsas | Instalação/ativação exigem aprovação específica futura | Bloquear recepção e frontend; preservar chave e histórico |
| Planilha existente | Nenhuma escrita nesta execução | Continua atividade desabilitada | Não houve mutação |

## Prévia verificável

Workflow: `.github/workflows/qa-aula08-live-v4.yml`. O job `previa` produz `mobile-a08-v4-site-preview-<SHA>` e o job `navegador` produz evidências/PDF/JSON. Os arquivos `tested-sha.txt`, `tested-tree.txt` e `mobile-a08-preview-manifest.json` identificam a fonte.

URL canônica **planejada para após publicação**:

`https://thalesvalente.github.io/teaching-mobile/lessons/aula-08-av1-incremento-1/laboratorio-vivo/`

Essa URL não é apresentada como v4 publicada. Para inspecionar o artifact localmente, extraia o conteúdo em uma pasta chamada `teaching-mobile`, sirva a pasta pai por HTTP e abra `/teaching-mobile/lessons/aula-08-av1-incremento-1/laboratorio-vivo/`. O receptor permanece desabilitado.

## Gates para qualquer aprovação de produção

| Gate | Evidência exigida |
|---|---|
| Código e CI | Todos os jobs exigidos verdes no SHA exato proposto para integração |
| Revisão | Parecer técnico/segurança independente, sem falha crítica aberta |
| Pedagogia | Aceite docente da rubrica vinte × 0,5 e composição da equipe |
| Contrato | Cliente 4.1.0, backend 4.1.0, headers e catálogo alinhados |
| Google QA | Interface → Apps Script → planilha QA → recibo → readback → reconciliação |
| Identidade | Cadastro real conferido e aceite do limite de identidade declarada por matrícula |
| Reenvios | Duplicata, maior/menor nota validada, timeout e falha parcial homologados |
| Publicação | Diff e artefato revisados; canonical path; main/Pages explicitamente autorizados |
| Reversão | Bloqueio de frontend/receptor e rollback identificados, sem apagar histórico |
| Aprovação | Texto do usuário vinculando operação, ambiente, recursos e SHA exatos |

## Operações ainda não autorizadas

Merge na main, publicação Pages, instalação/atualização Apps Script PROD, ativação de recebimento real, cadastro de estudantes reais, compartilhamentos, escrita histórica, lançamento oficial e exclusão permanecem fora da execução atual. A autorização de revisão da PR não autoriza essas operações.

O bloqueio externo atual é a ausência de ferramenta Apps Script e de sessão do navegador na conta correta. Projeto associado, ID, versão, propriedades e `/exec` não foram comprovados. A busca Drive vazia não é prova de inexistência; conferir antes de criar projeto novo para evitar duplicação.

## Plano de reversão preparado

Antes de uma liberação futura, registrar SHA anterior da main, SHA candidato, configuração Pages, ID/versão da implantação Apps Script e evidência QA. Após aprovação, cada efeito deverá ter readback.

Se houver problema após publicação, desabilitar primeiro novas recepções via configuração e facade administrativa autenticada. Reverter frontend/commit do portal para o SHA anterior revisado. Não apagar auditoria, resultados ou recibos; não regenerar segredo HMAC com histórico existente. Erro parcial exige diagnóstico e reparo especificamente aprovado, mantendo evidência original.
