# MOBILE-A08-V4 — checkpoint Google em 12/11/2026

**Resultado: BLOCKED_SPECIFIC — AUTO_REVIEW_OAUTH_BROAD_SCOPE_CONFIRMATION_REQUIRED.** O login foi restabelecido e o projeto QA abriu com o proprietário. A homologação integral permanece pendente.

| Fase | Estado | Evidência |
| --- | --- | --- |
| F0 Readback | PASS | Código/manifesto remotos e hashes idênticos; oito propriedades corretas; GitHub e Sheets conferidos |
| F1 OAuth/bootstrap | BLOCKED | Revisão automática rejeitou consentimento para todas as planilhas; execução pendente cancelada |
| F2 Implantação | BLOCKED | Nenhuma versão ou URL /exec criada |
| F3 Integração | BLOCKED | Zero envios, recibos ou testes de backend reais |
| F4 Interface | BLOCKED | Prévia local recusou conexão no Cloud Browser; nenhum E2E conectado |
| F5 Fechamento | PASS limitado | Recebimento nunca ativado; propriedade false novamente observada; sem health novo |
| F6 QA | PASS limitado | PASS_CHECKPOINT_EVIDENCE_REVIEW_ONLY; revisão independente do checkpoint, sem aprovação da integração |

## Recursos realmente utilizados

- Apps Script QA: `1ovzrG-dYeR4evHeFcV4M5vNA1kjKUdZi1sFcL3dVbzjtOVhgDeEdOOWJ`.
- Sheets QA: `1BTl0lw_tGDaQOIBOxy5eCDSRuvv-skc6hXX8yte6X3A`, leituras limitadas, sem escrita.
- Sheets PROD: `1pkbf3rJD3R5-lX7TuOyfir0A4ID1m2QfUg8ZIfNOeT0`, somente leitura mínima do catálogo.
- PR #7 e branch v4 existentes; PR #4 preservada. Fonte original d6e42ef2bebc7f1faf7473b95e3f5e8eb4729fd2; árvore 218dc7195b66232c7c21696c3759b42b41e863b7. Cinco Actions históricos do SHA original success, sem reruns.

## Matriz e limites

A matriz planejada permanece NOT_RUN. Identidade/0–35–100 XP, idempotência, reconciliação, assinatura, avaliação docente e isolamento conectado não foram exercitados contra receptor real. Nenhum teste simulado foi apresentado como teste Google. PDF/JSON e suítes históricas não foram repetidos porque o código continua idêntico.

## Parecer independente

C3 concluiu `PASS_CHECKPOINT_EVIDENCE_REVIEW_ONLY`. Hashes, escopos, propriedades, classificações NOT_RUN e sanitização estão coerentes. A homologação Google permanece BLOCKED_SPECIFIC. Ver `independent-qa.md`.

## Próxima operação concreta

Receber confirmação explícita em conversa para conceder ao projeto QA os escopos spreadsheets e userinfo.email, reconhecendo o alcance sobre todas as planilhas da conta. Depois concluir OAuth, executar bootstrap, criar versão Web App QA executada pelo proprietário e pública sem login, testar somente dados sintéticos e fechar recebimento. Antes de abrir recepção, resolver acesso do navegador à prévia sem alterar a origem aprovada inadvertidamente. Merge, Pages, produção, dados reais e notas oficiais continuam não autorizados.

A confirmação é necessária porque a revisão automática rejeitou especificamente a concessão ampla Sheets, apesar do registro de aprovação no anexo.
