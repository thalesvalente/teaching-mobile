# Mobile 2026 — integração da ficha da Aula 07 ao Google Sheets

## Estado e entregáveis

- **Disciplina:** Programação para Dispositivos Móveis — IFMA 2026.2.
- **Planilha exclusiva:** [programacao-dispositivos-moveis-2026](https://docs.google.com/spreadsheets/d/1z5VEmScYCtfsEGg0AahY3cHE5eYO79Zj0xLMzx4iT0Y/edit).
- **Página existente:** [Ficha original da Aula 07](https://thalesvalente.github.io/teaching-mobile/lessons/aula-07-estado-filtros/atividade.html).
- **Servidor da disciplina:** [Code.gs](appscript/Code.gs) + [RubricaAula07.gs](appscript/RubricaAula07.gs).
- **Conector frontend:** [entrega-appscript.js](entrega-appscript.js).
- **Contrato automatizado:** [tests/mobile-entregas.test.cjs](../../tests/mobile-entregas.test.cjs).
- **E2E Chromium simulado:** [tests/mobile-entrega-browser.cjs](../../tests/mobile-entrega-browser.cjs).

**Endpoint Mobile recebido em 21/10/2026 e configurado no frontend:** [https://script.google.com/macros/s/AKfycbyrvOlCl0Icm98SRNJ3SJy4gjx4Q4GH_k0EhxV50ebe93JXj_zjE8MmJ_zoGMwvNtXR/exec](https://script.google.com/macros/s/AKfycbyrvOlCl0Icm98SRNJ3SJy4gjx4Q4GH_k0EhxV50ebe93JXj_zjE8MmJ_zoGMwvNtXR/exec). O botão “Gerar PDF e entregar” será habilitado pela ficha publicada quando o script carregar. **A URL por si só não certifica que os POSTs estão habilitados nem que o Google Sheets recebeu dados.** Não utilizar o endpoint da PPI I.

## Instrumentos distintos: contrato pedagógico imutável

| Instrumento | Origem | Lançamento automático em Aula 07 |
| --- | --- | --- |
| Missões da aula interativa | Questões e testes próprios da apresentação | NÃO |
| **Simulador HTML da ficha** | **Aula7.avaliar(choice, project), 20 critérios × 0,5** | **SIM: nota de 0 a 10** |
| Projeto Expo (npm run nota) | Testes de funções escritas pelos alunos | NÃO; execução separada e validação necessária |
| Autoavaliação declarada da prática | Caixas assinaladas + evidências da equipe | NÃO; registrada separadamente na Auditoria |

A **rubrica da ficha não é a rubrica de preenchimento da PPI I**. Um campo respondido incorretamente continua valendo zero nos critérios que dependem dele; questões não respondidas ficam pendentes, sem elevar denominador ou total. O Apps Script recalcula os 20 critérios com o **mesmo código original** de nucleo.js, espelhado e auditado por testes de igualdade literal. Nunca copiar nota ou XP recebido no campo \`scores\` do cliente como autoridade.

A Aula 07 é enviada para \`4º Bimestre\`, coluna \`Aula 07\`. Média aritmética simples por linha; atividades cadastradas mas não entregues valem zero. A aba \`Auditoria\` possui 17 colunas para identificadores, equipe, horários, PDF hash, respostas hash, HMAC, XP/nota automática, autoavaliação declarada, situação, rubrica, JSON normalizado, chave de upsert. Cada aluno da equipe recebe uma linha; o recibo e o hash podem ser compartilhados por uma entrega em grupo. O PDF **não é armazenado no Drive**; permanece com os estudantes.

## Configuração — ação humana obrigatória no Google Apps Script

1. Entre no Google Apps Script com a conta que pode editar a planilha Mobile. Crie um **novo projeto**, por exemplo \`teaching-mobile-entregas-2026\`. **Não substitua o projeto Apps Script da PPI I.**
2. Adicione o arquivo \`Code.gs\` com o conteúdo completo correspondente a este repositório.
3. Adicione **outro arquivo de script** denominado \`RubricaAula07.gs\`, colando integralmente o respectivo conteúdo. Os dois arquivos são obrigatórios; o servidor depende do avaliador \`MobileRubricAula07\`.
4. Clique em salvar e execute \`testarConexaoMobile\`. Deve aparecer \`Diagnóstico Mobile: PASS\`. Esse teste não cria entregas fictícias e não valida POST externo.
5. Em **Project Settings → Script properties**, mantenha \`MOBILE_WEB_SUBMISSIONS_ENABLED=false\` durante o preflight. \`MOBILE_RECEIPT_HMAC_SECRET\` é gerado automaticamente na primeira entrega autorizada, fica privado e não deve ser publicado.
6. **Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone** (MVP por link sem identificação autenticada). Publique e copie a URL **\`/exec\`**. O endpoint Mobile deve responder em GET: \`Mobile — endpoint de entrega ativo. Versão: mobile-entregas-1.0.0\`.
7. A URL Mobile já está em `entrega-appscript.js` (versão de cache `1.0.1`) e será publicada pelo GitHub Pages após o QA. **Não utilizar a URL da PPI**.
8. Após conferir a mensagem `Mobile — endpoint de entrega ativo. Versão: mobile-entregas-1.0.0` na URL `/exec`, defina `MOBILE_WEB_SUBMISSIONS_ENABLED=true` em Script Properties **somente para o teste autorizado com QA Ana/QA Bia**; após homologação, o professor decide manter o recebimento para a turma. O flag controla POSTs mesmo com Web App `Anyone`. A planilha continua privada.

**Contrato do recibo:** \`channel=mobile-entrega-aula07\`, \`nonce\` aleatório por clique, \`ok\`, \`receiptId\`, \`activity\`, \`instrument\`, \`receivedAt\` UTC, \`pdfSha256\`, \`answersSha256\`, \`grade\`, \`xp\`, \`signature\`. O aluno só vê **ENTREGA CONFIRMADA** quando a resposta legítima corresponde ao hash do PDF baixado e à nota local. Mensagens de erro e timeout nunca confirmam entrega. O PDF direto usa os mesmos bytes da geração local já existente. Quando caracteres não suportados acionam impressão, nenhum hash de PDF é inventado e nenhum POST acontece.

## Teste real da ficha publicada: G6 (pendente até implantação)

1. Abra a URL real do GitHub Pages e preencha duas pessoas **fictícias**, \`QA Ana\` e \`QA Bia\`; escolha a trilha Memórias e faça uma entrega parcial.
2. Clique **Gerar PDF e entregar**, confirme download do PDF e mensagem com recibo, nota, XP, SHA-256, HMAC e data UTC.
3. Confira na planilha **4º Bimestre**: duas linhas, nota do simulador, média, ordem alfabética; confira a aba **Auditoria**: duas linhas com mesmo recibo, mesma assinatura e hashes.
4. Altere respostas e reenvie com os mesmos nomes/equipe. As duas linhas devem ser **substituídas**, sem duplicatas; a nota atualiza e outros instrumentos continuam sem misturar.
5. Valide hash do PDF baixado contra o SHA-256 da Auditoria e o recibo. Verifique também erro/timeout sem falso sucesso e exportação offline.
6. Remova **somente** registros fictícios da planilha após conferência (não tocar notas reais).

**A URL foi fornecida, mas ainda não temos comprovante de POST real nem de escrita via ficha publicada.** Portanto, manter G6 `PENDING_LIVE_E2E` até verificar um recibo verdadeiro e as duas abas em Google Sheets.

## Situação operacional após conexão do frontend — 21/10/2026

- A ficha contém o endpoint Mobile correto. URL: https://script.google.com/macros/s/AKfycbyrvOlCl0Icm98SRNJ3SJy4gjx4Q4GH_k0EhxV50ebe93JXj_zjE8MmJ_zoGMwvNtXR/exec
- Google Web App ainda precisa confirmar por HTTP sua versão e liberação de POST; não basta o botão estar habilitado.
- O teste de envio deve ser feito pela **ficha publicada**, com QA Ana e QA Bia, verificando recibo, nota, hash, assinatura e média; depois deve remover somente os dois registros fictícios.
- Se clicar e não aparecer recibo, verifique `Executions > doPost` no Apps Script. Sem `doPost`, investigar acesso e envio em iframe; com `doPost` recusado, conferir Script Properties e erros. Não interpretar PDF baixado como entrega.

## Segurança e limites deliberados do MVP

- Acesso \`Anyone\` com execução \`Me\` e **sem login**: nomes declarados **não autenticam pessoas**; é possível falsificar envios ou usar o nome de outro estudante. Aplicar conferência docente antes de utilizar como nota definitiva.
- Os hashes enviados pelo navegador identificam o PDF que ele afirma ter gerado; **não comprovam isoladamente que o servidor recebeu aqueles bytes ou que PDF e JSON têm conteúdo correspondente**, pois o PDF não é armazenado.
- HMAC protege integridade do recibo originado pelo Apps Script; o segredo fica em Script Properties, nunca no repositório.
- A planilha Mobile usa ID próprio. O servidor não tem referências ao ID, URL ou segredo da planilha PPI.
- O formulário salva respostas e evidências no Sheets, inclusive nomes; reter/compartilhar conforme política institucional. Não publicar PDFs/JSON com estudantes em repositórios abertos.
- Ausência de URL pública Mobile mantém **PDF, impressão, rascunho JSON e gamificação** operacionais, sem rede.

## QA e invariantes protegidas

\`\`\`bash
node --test tests/pontuacao-aulas.test.cjs tests/avaliador-projeto.test.mjs
node --test tests/mobile-entregas.test.cjs
# Necessita Playwright Chromium:
node tests/mobile-entrega-browser.cjs
\`\`\`

O teste G0 verifica SHA de origem dos arquivos didáticos e remove apenas as três inserções de integração no HTML para confrontar seu Git blob original. O avaliador \`RubricaAula07.gs\` contém o núcleo inteiro entre marcadores conferidos literalmente; qualquer alteração em enunciados, exemplos, opções ou pontuação falha no CI. G2 compara retornos para ambos os projetos e múltiplas alternativas; G4 cobre reenvio, HMAC, hashes, médias, zero e alterações indevidas. G5 usa Chromium real com PDF real e POST interceptado **somente para QA**; nunca confundir o mock com o Google real.

## Aula 08 em diante (sem inventar enunciados)

Ao publicar nova ficha da disciplina: ler seus instrumentos e rubrica; registrar \`MOBILE-AULA08-2026\` (ou o código real correspondente) com bimestre, coluna, schema, instrumento, rubrica e avaliador **específico comprovado**; escrever testes de equivalência e conectar o botão usando o mesmo protocolo. Não criar notas pela simples presença de respostas quando a atividade já possui correção automática; não promover autoavaliação declarada a nota verificada. A mesma planilha terá novas colunas antes de Média, preenchendo zero para estudantes já existentes.
