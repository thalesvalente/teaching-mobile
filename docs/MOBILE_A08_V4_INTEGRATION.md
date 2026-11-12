# MOBILE A08 v4 — Integração, confiança da avaliação e estado conectado

## Resultado desta fase

**Backend 4.1.0 preservado; preparação Google QA pronta para aprovação específica.** A planilha de produção existente foi preservada. Foi criado somente um ambiente QA privado, com projeto Apps Script independente e planilha sintética próprios. C3 aprovou a preparação; execução, consentimento OAuth, implantação versionada e homologação conectada permanecem **NOT_RUN**.

O gate **MOBILE_A08_V4_READY_FOR_EXACT_APPROVAL** aplica-se exclusivamente ao consentimento e à implantação/ativação temporária QA descritos em [release](MOBILE_A08_V4_RELEASE.md#aprovação-exata-preparada-somente-qa). A liberação global continua **BLOCKED**. O ciclo `INTERFACE → APPS SCRIPT → PLANILHA QA → RECIBO → READBACK → RECONCILIAÇÃO` ainda não ocorreu; não se declara COMPLETE, READY_FOR_RELEASE ou autorização de produção.

## Readback conectado da planilha existente

Fonte: [planilha Mobile v4](https://docs.google.com/spreadsheets/d/1pkbf3rJD3R5-lX7TuOyfir0A4ID1m2QfUg8ZIfNOeT0/edit), metadata e células lidas pelos conectores Google Drive/Sheets durante esta execução. Evidência sanitizada: [readback-sheets.json](aula08-v4-evidencias/readback-sheets.json). O horário de gravação do arquivo é registrado; a ferramenta não forneceu timestamps individuais das chamadas de leitura.

| Aba | sheetId observado | Estrutura conferida | Estado observado |
| --- | --- | --- | --- |
| 1º Bimestre | 1207026835 | Aluno, Matrícula, Equipe, Média /10 | Sem linhas de nota nas sentinelas A1:F3 |
| 2º Bimestre | 510002 | Aluno, Matrícula, Equipe, Média /10 | Sem linhas de nota nas sentinelas A1:F3 |
| 3º Bimestre | 510003 | Aluno, Matrícula, Equipe, Média /10 | Sem linhas de nota nas sentinelas A1:F3 |
| 4º Bimestre | 510004 | Aluno, Matrícula, Equipe, Aula 08 /10, Média /10 | Sem notas/fórmulas preenchidas em A1:F3 |
| Auditoria | 510005 | 28 colunas, compatíveis com AU_HEADERS | H2:H1000 sem IDs de entrega |
| Equipes | 510006 | 16 colunas, compatíveis com T_HEADERS; oculta | A2:A1000 sem equipes |
| Alunos | 510007 | 8 colunas, compatíveis com A_HEADERS | A2:A1000 sem matrículas |
| Resultados | 510008 | 10 colunas, compatíveis com R_HEADERS; oculta | A2:A1000 sem resultados |
| Atividades | 510009 | 8 colunas, seis cabeçalhos de contrato | MOBILE-A08-2026, bimestre 4, mobile-a08-lab-v4, Habilitada FALSE |
| Orientações | 510010 | 3 colunas | Instruções Mobile, privacidade, identidade, auditoria e status inicial |

Locale `pt_BR`, fuso `America/Fortaleza`, primeira linha congelada em todas as abas. Metadados e cabeçalhos coincidem com o checkpoint. A verificação de vazio usa colunas-chave e sentinelas, sem afirmar uma varredura de cada célula do documento.

### Incompatibilidades reais corrigidas no código

- A validação da aba Alunos permite `VALIDADO`, enquanto o backend anterior exigia exclusivamente `VALIDADO_DOCENTE`. O leitor agora aceita `VALIDADO` e a forma legada explícita, sem converter ou regravar a planilha.
- Homônimo liberado é `SIM`/`NÃO` na planilha; o diagnóstico administrativo entende esse formato e o booleano legado. Identidade continua por matrícula, permitindo homônimos com matrículas distintas.
- Atividades contém checkboxes FALSE em linhas sem ID. O catálogo ignora linhas vazias com apenas esse FALSE; não inventa atividades nem trata a linha como catálogo ambíguo.
- O código anterior convertia XP em nota e escrevia Resultados/bimestre antes da validação docente. A recepção agora não escreve nessas abas.
- A função anterior de “QA” ativava propriedades PROD. QA agora exige modo, ID, propriedades, chave e dados próprios; IDs Mobile PROD e históricos protegidos são rejeitados como destino QA.

## Apps Script: estado conectado na retomada de 12/11/2026

A hipótese anterior de conta incompatível foi retirada: a sessão Apps Script corresponde ao perfil da conexão Google. A [retificação](aula08-v4-evidencias/qa-google-preparacao-20261112/evidence-correction.json) identifica os campos incorretos de `readback-sheets.json`, preservado como histórico. O overview também mostra `teaching-mobile-entregas-2026`, criado em 21/10/2026 e modificado em 23/10/2026. Isso comprova a existência do projeto histórico, sem comprovar vínculo com a planilha v4, versão 4.1.0 ou compatibilidade; seu código, propriedades, segredos e dados não foram copiados.

| Item | Estado | Evidência/limite |
| --- | --- | --- |
| Código do receptor no Git | PASS | `Code.gs`, versão mobile-notas-4.1.0; fonte `303e4751abfb9105f9efa7c205adb6ec8f35d0b0` |
| Identidade da sessão Apps Script | PASS, identidade apenas | Perfil igual ao da conexão Google; inferência `ACCOUNT_MISMATCH` retirada |
| Projeto QA independente | PASS, preparação | `1ovzrG-dYeR4evHeFcV4M5vNA1kjKUdZi1sFcL3dVbzjtOVhgDeEdOOWJ`; privado, somente um proprietário, sem alteração de permissões |
| Planilha QA sintética | PASS, preparação | `1BTl0lw_tGDaQOIBOxy5eCDSRuvv-skc6hXX8yte6X3A`; privada, dez abas, 115 células comparadas por valor e tipo sem divergência |
| Código e manifesto salvos no editor | PASS, readback de bytes | Ambos iguais aos arquivos do SHA 303e4751; hashes completos abaixo |
| Script Properties QA | PASS, preparação | Oito propriedades; QA/SYNTHETIC_ONLY, destino isolado e flags de segurança/recepção falsas; nenhuma propriedade PROD |
| Bootstrap de administrador/segredo | NOT_RUN | Nenhuma execução; não há evidência de HMAC ou vínculo administrativo gerado |
| OAuth | NOT_RUN | Dois escopos identificados; consentimento não solicitado nem concedido |
| Implantação versionada e `/exec` | NOT_RUN | Formulário preparado, botão Deploy não clicado; sem versão instalada nem URL `/exec` |
| Submissão QA e reconciliação | NOT_RUN | Dependem da aprovação específica e da execução do ciclo completo |
| Projeto associado à planilha PROD v4 | NOT_RUN | Associação ainda não verificada; projeto histórico não serve como prova |
| Implantação/ativação PROD | NOT_RUN | Exige aprovação própria; frontend e configuração PROD v4 permanecem bloqueados |

Recursos observados: [projeto Apps Script QA](https://script.google.com/home/projects/1ovzrG-dYeR4evHeFcV4M5vNA1kjKUdZi1sFcL3dVbzjtOVhgDeEdOOWJ) e [planilha QA](https://docs.google.com/spreadsheets/d/1BTl0lw_tGDaQOIBOxy5eCDSRuvv-skc6hXX8yte6X3A/edit). Não foi criada outra planilha de produção. A alteração de locale/fuso, de `en_US`/`America/Los_Angeles` para `pt_BR`/`America/Fortaleza`, atingiu exclusivamente a planilha QA, sem alterar dimensões nem compartilhamento. O catálogo habilitado na fixture QA não ativa recepção: `MOBILE_NOTAS_QA_SUBMISSIONS_ENABLED` permanece `false`.

| Artefato salvo no projeto QA | SHA-256 conferido |
| --- | --- |
| `Code.gs` | `7002e407f5359f6aeaaadca4e3260b45dfb7c701460124e0d10196abb7feb0f9` |
| `appsscript.json` | `5906b4ab8001c5e91db36bf1dd7bad85205d1fbb5b2b5cf7d37d6df6f0813c24` |

Evidências: [células, tipos e privacidade QA](aula08-v4-evidencias/qa-google-preparacao-20261112/sheets-native-readback.json), [propriedades e hashes](aula08-v4-evidencias/qa-google-preparacao-20261112/script-properties-readback.json), [metadados do projeto privado](aula08-v4-evidencias/qa-google-preparacao-20261112/project-metadata.json), [inspeção visual nativa](aula08-v4-evidencias/qa-google-preparacao-20261112/native-visual-review.json) e [revisão independente C3](aula08-v4-evidencias/qa-google-preparacao-20261112/independent-review.json). A inspeção visual cobre as colunas visíveis e as linhas da fixture nas dez abas; o readback de 115 células complementa esse limite de viewport. Nenhuma dessas provas equivale a uma entrega recebida pelo Apps Script.

### Gate de consentimento e exposição QA

A [proposta exata](aula08-v4-evidencias/qa-google-preparacao-20261112/deployment-proposal.json) prepara um Web App executado pelo proprietário (`USER_DEPLOYING`) com acesso anônimo (`ANYONE_ANONYMOUS`, opção visual Anyone). A planilha e o projeto Apps Script permanecem privados; o que se propõe tornar acessível é o endpoint QA. Não há endpoint ativo.

O manifesto solicita somente `https://www.googleapis.com/auth/spreadsheets` e `https://www.googleapis.com/auth/userinfo.email`. O primeiro concede capacidade ampla sobre as planilhas da conta; **OAuth não restringe essa concessão à planilha QA**. A limitação de efeitos ao destino QA depende do código e da configuração revisados. O segundo é usado pelas verificações de identidade ativa/efetiva e pelo vínculo administrativo privado. Ver [escopos Sheets](https://developers.google.com/workspace/sheets/api/scopes), [Session](https://developers.google.com/apps-script/reference/base/session) e [semântica Web App](https://developers.google.com/apps-script/manifest/web-app-api-executable).

A aprovação deve abranger os dois escopos, bootstrap no editor autenticado, implantação QA anônima, ativação temporária, testes exclusivamente fictícios e fechamento da recepção ao final. A sequência e a reversão estão em [release](MOBILE_A08_V4_RELEASE.md) e no [runbook do receptor](../integrations/mobile-aula08-appscript/README.md). Ela não autoriza PROD, merge/Pages, estudantes reais, notas oficiais, compartilhamento da planilha ou exclusões.

## Política de confiança implementada

| Dimensão | Origem | Persistência e efeito |
| --- | --- | --- |
| XP formativo | Avaliador local da bancada, relatado pelo cliente | Validado quanto à consistência 20×5; retornado como claimedXp, sem virar nota |
| Resultado técnico | Relatório LOCAL_BROWSER_UNTRUSTED, código exato e SHA-256 | Armazenado como evidência; technicalVerification=NOT_VERIFIED |
| Nota institucional | Conferência docente autenticada dos 20 critérios, 0,5 por critério | Somente evento VALIDADO pode alimentar Resultados/bimestre |

Receber o payload não executa TSX no Apps Script. Não foi criado serviço externo de execução arbitrária. A opção adotada é validação docente explícita: menor complexidade e nenhuma execução de código de estudante com credenciais Google.

Estados persistidos: `PENDENTE_VALIDACAO` na recepção; `VALIDADO` ou `REJEITADO` em um novo evento de revisão. Recebimento é identificado pelo tipo `MOBILE_V4_SUBMISSION`; revisão pelo tipo `MOBILE_V4_TEACHER_REVIEW`. `RECEBIDO` é o reconhecimento de transporte (`ok:true`), não um estado de aprovação. Incerteza de rede não produz recibo confirmado até readback íntegro.

### Recepção e recibos

O gateway `notasCommit_` permite à submissão escrever somente Auditoria e Equipes. A rubrica do cliente não pode escolher colunas, escrever Alunos ou Resultados, mudar o cadastro, validar nota ou chamar administração pelo HTTP.

O recibo contém `grade:null`, `officialGrade:null`, `gradeReceived:null`, `status:PENDENTE_VALIDACAO`, `teacherReviewRequired:true`, `claimedXp`, hashes de evidência e código, assinatura, versão e IDs. `bestGrades` tem somente notas docentes previamente validadas, ou `null`. Todos os 28 campos da auditoria, exceto a própria célula HMAC, são vinculados à assinatura.

`signatureVerified:true` significa verificação do receptor após readback, não verificação independente no navegador. O segredo não sai das Script Properties. O frontend reconcilia o mesmo recibo por pedido somente leitura.

O hash de código preserva whitespace e bytes UTF-8. A evidência canônica exclui metadados locais de UI e XP antes de persistir; a rubrica técnica declarada permanece marcada como não verificada. Se `technicalEvaluation` vier preenchido, devem existir os vinte IDs corretos, estados PASS/FAIL/NOT_RUN, revisão inteira não negativa e hash correspondente ao código recebido.

### Idempotência e incidentes

Mesmo nonce e mesmo pedido retornam o recibo anterior sem nova escrita. Mesmo nonce com outro conteúdo é recusado. Novo envio válido da equipe acrescenta auditoria e atualiza apenas o último recibo; não muda nota oficial.

Composição, ordem de integrantes, nomes e nome de equipe precisam permanecer estáveis. Alteração exige conferência docente e é bloqueada **antes** da escrita. Matrícula já vinculada a outra equipe da mesma atividade também é recusada. Cadastros continuam somente leitura pelo HTTP.

Após timeout, `reconcileTeam` com o pedido e nonce originais faz somente leitura. Uma gravação completa com resposta perdida pode ser confirmada por readback. Uma gravação parcial fica bloqueada; auditoria sem equipe, último recibo incompatível ou validação docente sem projeções completas não é promovida a sucesso. A reconciliação não cria registros ausentes nem reabre recepção encerrada.

### Validação docente e maior nota

`validarEntregaDocenteMobile` exige sessão ativa e efetiva iguais ao administrador do projeto, rubrica aprovada, vinte critérios e referência/parecer da conferência. Em PROD exige autorização adicional de lançamento oficial. A função não é uma operação HTTP.

Cada decisão cria evento assinado e mantém a recepção original. Apenas notas VALIDADO participam da política de maior nota por matrícula/atividade. Uma revisão de 12 critérios aprovados produz 6,0 mesmo quando o navegador declarou 100 XP. A rejeição preserva evidência e não escreve nota. Repetição exata de revisão é idempotente; decisão conflitante para recibo já revisado é bloqueada.

Cada leitura de integridade exige que um evento VALIDADO tenha Resultados, boletim e nota da equipe materializados e compatíveis. Assim, timeout durante validação não pode retornar replay VALIDADO com boletim vazio.

## Testes executados e cobertura

Comando autoral: `node --test tests/mobile-aula08-v4-backend.test.cjs` — **32 testes PASS**. Adapter: `tests/mobile-aula08-v4-fixture.cjs`, que lê exatamente o Code.gs deste diretório. Evidência: [backend-tests.tap](aula08-v4-evidencias/backend-tests.tap).

Revisão independente C3 adicionou `tests/independent-aula08-v4-backend.test.cjs` — **8 adversariais**. Quatro falhas iniciais foram reproduzidas e corrigidas: ordem de integrantes, nome cadastral alterado, replay de revisão parcialmente escrita e ausência de homologação QA nas verificações por requisição PROD. O coordenador e C3 registram o rerun independente no relatório QA. O rerun conjunto local do autor passou **40/40** sem mudar os asserts independentes.

Na execução real de navegador, o adaptador local revelou uma incompatibilidade adicional: `Utilities.formatDate` ignorava o padrão solicitado e emitia `:` no identificador de recibo. O frontend recusou esse recibo como deveria. C3 corrigiu o adaptador para os padrões e fusos usados pelo servidor, sem afrouxar o parser de produção, e acrescentou um nono teste independente. O conjunto passou **41/41**, registrado em [c3-backend-date-adapter-retest.tap](aula08-v4-evidencias/c3-backend-date-adapter-retest.tap). Essa correção melhora a fidelidade da simulação e continua sem provar implantação Google.

| Casos requeridos | Prova local | Conectado Google |
| --- | --- | --- |
| Matrícula existente/inexistente/zeros/homônimo | PASS | NOT_RUN |
| Duplicidade, quantidade e equipe válida/inválida | PASS | NOT_RUN |
| Recepção parcial 0/35 XP e completa 100 XP | PASS, sem nota | NOT_RUN |
| Reenvio igual/maior/menor e alteração de composição | PASS | NOT_RUN |
| Mesmo nonce/outro conteúdo | PASS | NOT_RUN |
| Timeout antes/depois e falha parcial de escrita | PASS, injeção na fixture | NOT_RUN |
| Reconciliação sem criar entrega | PASS | NOT_RUN |
| Hash, código e cada campo assinado adulterados | PASS | NOT_RUN |
| Aprovação ausente/recepção bloqueada/permissão negada | PASS | NOT_RUN |
| QA/PROD e destinos históricos isolados | PASS | NOT_RUN |
| Docente não autenticado, rubrica e autorização oficial | PASS | NOT_RUN |
| Maior nota validada, rejeição e replay parcial docente | PASS | NOT_RUN |
| Fórmulas de média | String/coluna/contrato conferidos no adapter | Avaliação real da fórmula NOT_RUN |

A fixture não chama Google, não simula aprovação humana real e não contém nomes/matrículas reais. Os estados acima não substituem homologação instalada.

## Privacidade e riscos residuais

A consulta por matrícula completa retorna o nome cadastrado para confirmação. Esse desenho é identidade declarada, não login de estudante nem prova de autoria. Quem conhece matrícula válida pode confirmar o nome enquanto a consulta estiver aberta. Não existe busca por nome, listagem pública nem resposta diferenciada que revele cadastro inativo. Rate limits por cache mitigam abuso de melhor esforço; não garantem proteção DDoS. A adequação desse modelo precisa de aceite docente antes de produção.

O HMAC assegura integridade em relação ao segredo do servidor; não atesta autoria, execução nativa ou correção do código. O professor continua responsável pela evidência de avaliação. Alterações manuais que quebrem assinaturas/projeções exigem reconciliação deliberada, sem exclusão automática de histórico.

## Pendências concretas

1. Obter aprovação específica dos dois escopos OAuth e do Web App QA anônimo, incluindo bootstrap, ativação temporária, testes sintéticos e fechamento da recepção.
2. Revalidar projeto QA, planilha isolada e hashes; após aprovação, executar bootstrap, implantar e registrar os identificadores, versão e `/exec` reais. Não recriar os recursos QA preparados.
3. Executar o ciclo conectado completo, validar fórmulas/projeções e reconciliação no QA, preservar recibos fictícios e desabilitar recebimento ao final.
4. Aprovar rubrica e modelo de consulta/identidade; conferir cadastro real apenas após autorização específica.
5. Apresentar mudança exata e obter autorização para implantação PROD, ativação, merge/Pages e lançamento oficial nos respectivos gates.

A preparação concluída não concede consentimento OAuth nem autorização de publicação QA. As operações PROD têm gates próprios. O frontend continua com `PROD_ENDPOINT=''` e `PROD_RELEASE_ENABLED=false` até o gate correspondente.
