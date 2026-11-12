# Mobile Aula 08 — receptor 4.1.0

Este diretório continua o backend Mobile existente. Ele não usa endpoint, dados, segredo ou instalação de Web/PPI. A recepção registra evidência **PENDENTE_VALIDACAO**. XP e testes no navegador não escrevem notas em Resultados ou nos bimestres. A única promoção de nota passa pela função administrativa autenticada `validarEntregaDocenteMobile`, com rubrica de vinte critérios booleanos de 0,5 ponto e referência de conferência docente.

## Estado verificável desta entrega

- Planilha Mobile de produção existente confirmada por conector; dez abas; atividade desabilitada; nenhuma escrita realizada nela.
- Código e testes locais: ver [integração](../../docs/MOBILE_A08_V4_INTEGRATION.md).
- Preparação QA: **PASS na revisão independente**, pronta para aprovação específica. Projeto Apps Script independente privado `1ovzrG-dYeR4evHeFcV4M5vNA1kjKUdZi1sFcL3dVbzjtOVhgDeEdOOWJ` e planilha QA privada `1BTl0lw_tGDaQOIBOxy5eCDSRuvv-skc6hXX8yte6X3A` já existem; não recriar.
- Código e manifesto salvos no QA são byte a byte iguais ao SHA `303e4751abfb9105f9efa7c205adb6ec8f35d0b0`; oito propriedades QA estão salvas. Dez abas e 115 células/tipos da fixture foram conferidos. Recepção e segurança QA permanecem `false`, sem propriedades PROD.
- OAuth, execução, bootstrap, implantação versionada, `/exec` e homologação conectada: **NOT_RUN**. Deploy não foi clicado. O gate `MOBILE_A08_V4_READY_FOR_EXACT_APPROVAL` é somente OAuth/QA; a liberação global continua **BLOCKED**, sem declaração de READY_FOR_RELEASE ou COMPLETE.
- A conta do navegador corresponde à conexão Google. A inferência anterior de incompatibilidade foi retirada em [retificação rastreável](../../docs/aula08-v4-evidencias/qa-google-preparacao-20261112/evidence-correction.json); o JSON histórico foi preservado. O projeto Mobile histórico, criado em 21/10 e modificado em 23/10, não comprova associação ou compatibilidade v4.
- O adapter de testes continua local/simulado. A fixture também foi instalada na planilha QA real, mas sua leitura não comprova operação do receptor. Evidências: [planilha QA](../../docs/aula08-v4-evidencias/qa-google-preparacao-20261112/sheets-native-readback.json), [propriedades/hashes](../../docs/aula08-v4-evidencias/qa-google-preparacao-20261112/script-properties-readback.json), [projeto privado](../../docs/aula08-v4-evidencias/qa-google-preparacao-20261112/project-metadata.json) e [parecer C3](../../docs/aula08-v4-evidencias/qa-google-preparacao-20261112/independent-review.json).

## Arquivos de instalação

| Arquivo | Finalidade |
| --- | --- |
| `Code.gs` | Servidor Mobile 4.1.0 com handlers HTTP e facades administrativas |
| `appsscript.json` | V8, fuso Fortaleza, serviço avançado Sheets v4 e escopos explícitos |
| `script-properties.qa.example.json` | Chaves de configuração QA, desativadas por padrão |
| `script-properties.prod.example.json` | Configuração PROD apontando somente à planilha já criada, bloqueada |
| `qa-fixture.json` | Dez abas e dois cadastros exclusivamente fictícios; nenhum dado de turma |

Os arquivos de propriedades são **modelos para Script Properties**, não arquivos a importar no editor como código. Não persistir segredo HMAC no Git, no frontend, nos logs ou em relatórios. A função de preparação cria a chave apenas dentro das propriedades do projeto e recusa regenerá-la se houver histórico.

## Concluir o QA preparado após aprovação específica

A [proposta observada](../../docs/aula08-v4-evidencias/qa-google-preparacao-20261112/deployment-proposal.json) e o [gate detalhado de release](../../docs/MOBILE_A08_V4_RELEASE.md#aprovação-exata-preparada-somente-qa) tornam a decisão revisável. Solicita-se consentimento somente para `https://www.googleapis.com/auth/spreadsheets` e `https://www.googleapis.com/auth/userinfo.email`. O escopo Sheets permite operações amplas nas planilhas da conta; OAuth não limita a concessão ao arquivo QA. O controle de destino está no código/configuração revisados. O escopo de e-mail sustenta verificações de identidade administrativa, sem acesso ao Gmail.

O Web App proposto executa como proprietário (`USER_DEPLOYING`) e permite visitantes sem login (`ANYONE_ANONYMOUS`, opção visual Anyone). `ANYONE` no manifesto significa usuários logados e não é a opção anônima preparada. A planilha e o projeto permanecem privados; nenhuma mudança de compartilhamento dos arquivos é proposta.

Sequência autorizável, ainda não executada:

1. Obter aprovação expressa para os dois escopos, Web App QA anônimo, bootstrap, ativação temporária, testes fictícios e fechamento de recepção ao final. Isso não autoriza produção.
2. Revalidar identidade, os dois IDs QA e os hashes: `Code.gs` = `7002e407f5359f6aeaaadca4e3260b45dfb7c701460124e0d10196abb7feb0f9`; `appsscript.json` = `5906b4ab8001c5e91db36bf1dd7bad85205d1fbb5b2b5cf7d37d6df6f0813c24`. Reutilizar os recursos privados preparados, sem copiar dados da turma.
3. Conferir as oito propriedades já salvas: QA, SYNTHETIC_ONLY, ID QA acima, origem `http://127.0.0.1:8138`, duas flags `false` e marcadores de aprovação sintética. Esses marcadores não são aceite docente da rubrica PROD. Não preencher propriedades PROD.
4. Conceder somente os dois escopos aprovados e executar `prepararAmbienteQAMobile()` no editor autenticado. A função verifica estrutura/cadastro fictício, cria segredo interno e fixa a identidade administrativa. Não copiar valores de HMAC ou e-mail privado para logs públicos.
5. Criar versão/implantação Web App QA com `USER_DEPLOYING` e `ANYONE_ANONYMOUS`; registrar os identificadores, versão e `/exec` realmente emitidos. Não reutilizar endpoints Mobile históricos/Web/PPI.
6. Executar `liberarRecebimentoQAMobile()` somente nesse projeto, para ativação temporária QA. Catálogo habilitado na fixture não significa que a recepção já esteja aberta.
7. Abrir a prévia com `?qa=1`, configurar explicitamente o endpoint QA e conferir health com versão `mobile-notas-4.1.0`, QA, SYNTHETIC_ONLY e ID da planilha isolada. O health sozinho não homologa entrega.
8. Executar a matriz de casos pela interface, salvar recibos fictícios e fazer readback independente da planilha. Em `reconcileTeam`, repetir o mesmo identificador, payload e nonce; exigir o mesmo recibo e `signatureVerified:true`, sem duplicação de linhas.
9. Registrar o ciclo **INTERFACE → APPS SCRIPT → PLANILHA QA → RECIBO → READBACK → RECONCILIAÇÃO**, com SHA, versão, IDs, horários e hashes. Classificar separadamente simulações, testes conectados e cenários ainda não executados.
10. Ao concluir, definir `MOBILE_NOTAS_QA_SUBMISSIONS_ENABLED=false`; preservar auditoria, recibos, planilha e segredo para readback. Nenhuma etapa dessa sequência autoriza estudantes reais, notas oficiais, merge/Pages, implantação PROD, exclusões ou compartilhamento da planilha.

### Matriz QA obrigatória

Consulta existente/inexistente/zeros iniciais/homônimo; integrante duplicado; equipe inválida/válida; 0/35/100 XP; reenvio maior/menor; composição alterada; nonce repetido/conteúdo alterado; timeout antes/depois da escrita; falha parcial; reconciliação; hash e assinatura adulterados; atividade bloqueada; aprovação ausente; permissão negada; isolamento QA/PROD/Web/PPI; docente autenticado; rubrica incompleta; validação 6/10 a partir de 100 XP; maior **nota validada**; rejeição sem nota.

Falhas de rede são injetadas somente na fixture local quando não houver uma forma segura de reproduzir no Google. Classificar cada evidência como local ou conectada; não afirmar falha Google reproduzida por uma simulação.

## Contrato do recibo

`status=PENDENTE_VALIDACAO`; `grade=null`; `officialGrade=null`; `gradeReceived=null`; `claimedXp` é apenas relato formativo; `bestGrades` contém notas docentes já validadas ou `null`; `teacherReviewRequired=true`. Há `receiptId`, `requestId`, `nonce`, `answersSha256`, `codeSha256`, `storedEvidenceSha256`, `signature`, `signatureVerified`, membros e versão. `technicalVerification=NOT_VERIFIED` e `evidenceProvenance=LOCAL_BROWSER_UNTRUSTED` permanecem explícitos.

`signatureVerified:true` significa que **o receptor** releu e verificou o HMAC. O navegador não recebe segredo e não faz verificação HMAC independente. `answersSha256` corresponde à evidência canônica normalizada; `codeSha256` corresponde aos bytes UTF-8 exatos do TSX.

Para incerteza de transporte, usar `operation=reconcileTeam`, mesmo payload/identidade/evidência e mesmo nonce. É somente leitura: se não achar registro íntegro, responde `ENVIO_NAO_LOCALIZADO`; não cria entrega. Funciona mesmo após fechamento da recepção, desde que o recibo/identidade/contrato continuem íntegros. Não reenviar cegamente com novo nonce.

## Validação docente

Executar **somente no editor autenticado**, com rubrica e conferência aprovadas:

```javascript
validarEntregaDocenteMobile({
  receiptId: 'RECIBO_REAL_DA_ENTREGA_A_CONFERIR',
  decision: 'VALIDADO', // ou REJEITADO
  criteria: [/* exatamente 20 objetos { id: 'M1-01', passed: true } na ordem MOBILE_TASKS */],
  evidenceRef: 'REFERENCIA_DA_CONFERENCIA_DO_CODIGO_EXATO',
  reason: 'Parecer do docente com fundamento nos critérios e evidências'
});
```

Não há execução do TSX do estudante no Apps Script. A revisão deve conferir o código cujo hash está no recibo. Para um registro validado, a nota é a soma de `passed` × 0,5. O servidor anexa um evento assinado de validação/rejeição; não sobrescreve a recepção original. Resultados, Equipes e bimestre consideram somente notas validadas, preservando o máximo validado. Decisão conflitante para recibo já revisado é bloqueada; correções posteriores de lançamento exigem procedimento docente separado, sem apagar histórico.

## Produção: preparação não é ativação

Não recriar a planilha de produção. Antes de instalar/atualizar Apps Script, alterar acesso, habilitar catálogo, cadastrar estudantes, publicar Pages ou lançar nota, obter a aprovação humana específica e conferir gates do relatório RELEASE. O modelo PROD permanece falso. `ativarProducaoMobile()` requer aprovação de recepção, revisão de segurança, rubrica aprovada e referência da homologação QA; não fabrica esses comprovantes. A função de validar nota em PROD requer ainda `MOBILE_NOTAS_PROD_OFFICIAL_GRADES_APPROVED=A08-V4-OFFICIAL-GRADES-APPROVED`, que só pode ser preenchida após autorização específica de lançamento.

## Reversão e incidentes

**QA:** antes do consentimento, cancelar o formulário sem conceder OAuth ou criar endpoint; preservar o que já foi preparado. Após ativação aprovada, definir `MOBILE_NOTAS_QA_SUBMISSIONS_ENABLED=false` e conservar segredo/histórico. Revogar a concessão OAuth QA ou arquivar sua implantação exige autorização específica própria; não apagar recursos ou recibos.

**Produção futura:** bloquear recebimento com a facade administrativa `bloquearRecebimentoProducaoMobile()`; preservar o segredo e o histórico. Restaurar a versão anterior do código/implantação apenas após avaliação de compatibilidade do contrato. Não apagar linhas, trocar chave HMAC com histórico ou migrar notas manualmente para “destravar”. Para escrita parcial, manter registro incerto, comparar as requisições planejadas com o readback e pedir decisão docente específica antes de reparar. A gravação normal usa uma única chamada `Sheets.Spreadsheets.batchUpdate`, com readback; a fixture também simula persistência parcial para verificar falha fechada.

## Limites e privacidade

Consulta exata de matrícula retorna o nome cadastrado para confirmação; não é autenticação do estudante nem comprovação de autoria. Quem conhece uma matrícula válida pode confirmar esse nome enquanto o receptor estiver aberto. Os limites por cache são mitigação de melhor esforço, não proteção DDoS. Não há busca por nome nem listagem pública; matrícula inexistente e inativa têm resposta genérica. Aprovar esse modelo de identidade antes de produção. Dados pessoais ficam em memória na interface ou em exportação iniciada pelo aluno; não copiar dados reais para QA.

## Referências oficiais consultadas

- [Estrutura do manifesto Apps Script](https://developers.google.com/apps-script/manifest)
- [Serviço avançado Sheets](https://developers.google.com/apps-script/advanced/sheets)
- [Implantação de Web Apps](https://developers.google.com/apps-script/guides/web)

- [Alcance dos escopos Google Sheets](https://developers.google.com/workspace/sheets/api/scopes)
- [Identidade ativa e efetiva em Session](https://developers.google.com/apps-script/reference/base/session)
- [Valores de acesso e identidade Web App](https://developers.google.com/apps-script/manifest/web-app-api-executable)
