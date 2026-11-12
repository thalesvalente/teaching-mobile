# MOBILE A08 v4 — Integração, confiança da avaliação e estado conectado

## Resultado desta fase

**Backend 4.1.0 implementado; testes locais aprovados; homologação Google bloqueada por implantação externa.** A planilha existente foi lida por conexão Google autorizada e preservada. Não foi criada outra planilha de produção, nem escritos estudantes, equipes, notas ou auditoria reais. O receptor e o frontend de produção permanecem bloqueados.

Estado externo: **MOBILE_A08_V4_BLOCKED_EXTERNAL_DEPLOYMENT**. O ciclo conectado `INTERFACE → APPS SCRIPT → PLANILHA QA → RECIBO → READBACK → RECONCILIAÇÃO` não foi executado. Nenhum teste de fixture, GET de disponibilidade ou leitura de planilha é apresentado como esse ciclo.

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

## Apps Script: observado e não observado

| Item | Estado | Evidência/limite |
| --- | --- | --- |
| Código do receptor no Git | PASS | `integrations/mobile-aula08-appscript/Code.gs`, versão mobile-notas-4.1.0 |
| Manifesto/configuração para implantação | PASS | appsscript.json e modelos de Script Properties separados |
| Projeto nativo associado à planilha PROD | BLOCKED | Ferramentas disponíveis não expõem Apps Script; metadata Drive/Sheets não expõe projeto vinculado |
| Busca por MIME Apps Script | PASS, escopo limitado | Busca Mobile e busca geral retornaram zero arquivos; isso **não prova inexistência** de projeto vinculado |
| Sessão de navegador correta | BLOCKED | Coordenador observou conta diferente da conexão Google pretendida; nenhuma instalação nessa identidade |
| URL `/exec`, versão instalada, propriedades | NOT_RUN | Nenhum identificador/deployment/propriedade foi observado; não há URL inventada |
| Submissão QA real e reconciliação | BLOCKED | Sem instalação QA acessível na conta correta |
| Implantação/ativação PROD | NOT_RUN | Exige aprovação específica; bloqueios mantidos |

Não foi criada uma planilha QA ociosa. A fixture permite criá-la quando houver caminho concreto para instalar o projeto correto e executar a homologação. O [runbook do receptor](../integrations/mobile-aula08-appscript/README.md) contém arquivos, sequência mínima, propriedades, contratos, matriz e reversão.

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

1. Acessar Apps Script na conta Google correta; confirmar projeto vinculado/deployment se existir, sem reutilizar Web/PPI.
2. Instalar QA isolado, executar o ciclo real e registrar `/exec`, versão, SHA e recibos fictícios.
3. Validar a fórmula bimestral e as projeções no Google Sheets real QA.
4. Aprovar rubrica e modelo de consulta/identidade; conferir cadastro real apenas após autorização específica.
5. Apresentar mudança exata e obter autorização para implantação PROD, ativação, merge/Pages e lançamento oficial nos respectivos gates.

Nada desta fase autoriza por si só essas operações. O frontend continua com `PROD_ENDPOINT=''` e `PROD_RELEASE_ENABLED=false` até o gate correspondente.
