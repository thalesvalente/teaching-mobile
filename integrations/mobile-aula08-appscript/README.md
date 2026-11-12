# Mobile Aula 08 — receptor 4.1.0

Este diretório continua o backend Mobile existente. Ele não usa endpoint, dados, segredo ou instalação de Web/PPI. A recepção registra evidência **PENDENTE_VALIDACAO**. XP e testes no navegador não escrevem notas em Resultados ou nos bimestres. A única promoção de nota passa pela função administrativa autenticada `validarEntregaDocenteMobile`, com rubrica de vinte critérios booleanos de 0,5 ponto e referência de conferência docente.

## Estado verificável desta entrega

- Planilha Mobile de produção existente confirmada por conector; dez abas; atividade desabilitada; nenhuma escrita realizada nela.
- Código e testes locais: ver [integração](../../docs/MOBILE_A08_V4_INTEGRATION.md).
- Apps Script QA/PROD: **BLOCKED_EXTERNAL_DEPLOYMENT**. Nenhuma ferramenta Apps Script disponível; navegador não estava na conta Google correta. Projeto vinculado, propriedades, versão instalada e URL `/exec` não foram confirmados.
- Fixtures e adapter Sheets são sintéticos e locais. Não são prova de integração Google operacional.

## Arquivos de instalação

| Arquivo | Finalidade |
| --- | --- |
| `Code.gs` | Servidor Mobile 4.1.0 com handlers HTTP e facades administrativas |
| `appsscript.json` | V8, fuso Fortaleza, serviço avançado Sheets v4 e escopos explícitos |
| `script-properties.qa.example.json` | Chaves de configuração QA, desativadas por padrão |
| `script-properties.prod.example.json` | Configuração PROD apontando somente à planilha já criada, bloqueada |
| `qa-fixture.json` | Dez abas e dois cadastros exclusivamente fictícios; nenhum dado de turma |

Os arquivos de propriedades são **modelos para Script Properties**, não arquivos a importar no editor como código. Não persistir segredo HMAC no Git, no frontend, nos logs ou em relatórios. A função de preparação cria a chave apenas dentro das propriedades do projeto e recusa regenerá-la se houver histórico.

## Concluir QA na conta correta

1. Entrar na conta Google proprietária pretendida e conferir sua identidade visualmente. Não reutilizar a sessão de outra conta.
2. Criar uma planilha **somente QA** a partir da estrutura e dos registros fictícios de `qa-fixture.json`; não copiar a planilha da turma. O ID deve ser diferente da produção e dos recursos históricos protegidos. Manter privada. A aba Atividades da fixture tem apenas MOBILE-A08-2026 habilitada; Alunos usa `00000000.ITA0001`/`00000000.ITA0002`, `VALIDADO` e fonte `QA_SYNTHETIC_ONLY`.
3. Criar projeto Apps Script Mobile QA próprio. Copiar `Code.gs` e `appsscript.json`. Conferir que o serviço avançado Sheets está habilitado; quando houver projeto Cloud padrão, seguir as instruções oficiais sobre o serviço/API.
4. Configurar as propriedades do modelo QA, preencher apenas o ID QA e a origem local. Para este teste fictício: `MOBILE_NOTAS_QA_TEACHER_APPROVAL=A08-V4-QA-SYNTHETIC`; para testar revisão docente fictícia: `MOBILE_NOTAS_QA_TEACHER_RUBRIC_APPROVAL=A08-V4-RUBRIC-20X05`. Não preencher nenhuma propriedade PROD neste projeto.
5. Executar `prepararAmbienteQAMobile()` no editor autenticado. Ele valida a estrutura e cadastro sintético, cria segredo interno e fixa a identidade administrativa. Executar `liberarRecebimentoQAMobile()` somente nesse projeto QA. Essas funções não ativam produção.
6. Criar versão/implantação de Web App QA conforme as políticas de conta. A escolha do acesso do Web App muda permissões e requer aprovação específica. Guardar, fora de logs públicos, ID do projeto, versão e URL `/exec`; não reutilizar `/exec` Web/PPI. Usar execução pelo proprietário quando o modelo aprovado de consulta sem login for adotado.
7. Na prévia local, habilitar modo QA pelo mecanismo do frontend e informar somente esse endpoint. O health precisa responder versão `mobile-notas-4.1.0`, modo QA, `SYNTHETIC_ONLY` e ID da planilha QA. A origem informada em Script Properties deve coincidir com a origem local.
8. Executar a matriz de casos abaixo pela interface, salvar recibos fictícios e fazer readback independente da planilha. Repetir a requisição exata em `reconcileTeam`; exigir mesmo recibo e `signatureVerified:true`, sem aumento de linhas.
9. Registrar evidência do ciclo **INTERFACE → APPS SCRIPT → PLANILHA QA → RECIBO → READBACK → RECONCILIAÇÃO**, incluindo SHA do frontend/backend, versão implantada, ID QA, timestamps, requestId e hashes. A aprovação QA depende deste ciclo, não de um GET health.

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

Bloquear recebimento com a facade administrativa `bloquearRecebimentoProducaoMobile()`; preservar o segredo e o histórico. Restaurar a versão anterior do código/implantação apenas após avaliação de compatibilidade do contrato. Não apagar linhas, trocar chave HMAC com histórico ou migrar notas manualmente para “destravar”. Para escrita parcial, manter registro incerto, comparar as requisições planejadas com o readback e pedir decisão docente específica antes de reparar. A gravação normal usa uma única chamada `Sheets.Spreadsheets.batchUpdate`, com readback; a fixture também simula persistência parcial para verificar falha fechada.

## Limites e privacidade

Consulta exata de matrícula retorna o nome cadastrado para confirmação; não é autenticação do estudante nem comprovação de autoria. Quem conhece uma matrícula válida pode confirmar esse nome enquanto o receptor estiver aberto. Os limites por cache são mitigação de melhor esforço, não proteção DDoS. Não há busca por nome nem listagem pública; matrícula inexistente e inativa têm resposta genérica. Aprovar esse modelo de identidade antes de produção. Dados pessoais ficam em memória na interface ou em exportação iniciada pelo aluno; não copiar dados reais para QA.

## Referências oficiais consultadas

- [Estrutura do manifesto Apps Script](https://developers.google.com/apps-script/manifest)
- [Serviço avançado Sheets](https://developers.google.com/apps-script/advanced/sheets)
- [Implantação de Web Apps](https://developers.google.com/apps-script/guides/web)
