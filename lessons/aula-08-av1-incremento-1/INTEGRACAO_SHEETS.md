# Aula 08 · Integração docente com Apps Script e Sheets

**Estado desta entrega: código e testes simulados prontos; implantação e E2E real pendentes (`PENDING_LIVE_E2E`).** A existência de uma URL Mobile não demonstra que a Aula 08 esteja implantada ou que notas tenham sido recebidas. Nesta missão não houve acesso à planilha real, alteração de Script Properties nem registros fictícios reais.

## Configuração única da disciplina

Em `../aula-07-estado-filtros/appscript/Code.gs`, `MOBILE_CFG.activities['MOBILE-AULA08-2026']` concentra:

| Campo | Valor |
|---|---|
| Planilha | A mesma planilha exclusiva Mobile já presente em `MOBILE_CFG.spreadsheetId` |
| Aba | `4º Bimestre` |
| Coluna | `Aula 08` |
| Schema | `mobile-a08-v1` |
| Rubrica | `mobile-a08-lab-vivo-1.0.0` |
| Instrumento | `laboratorio-vivo-av1` |
| Adaptador | `aula08` |

O professor pode alterar aba/coluna nesse cadastro antes da implantação. A coluna nova entra antes de `Média`; o cálculo continua aritmético, incluindo zero nas outras atividades para estudantes novos. Não modificar a planilha/endpoint de PPI I. O frontend aceita exclusivamente a URL Mobile previamente configurada na Aula 07. Não existe campo para o aluno fornecer um endpoint.

Arquivos a instalar no mesmo projeto Apps Script Mobile:

- `Code.gs`: configuração compartilhada, adaptador de transporte e infraestrutura existente.
- `RubricaAula07.gs`: permanece byte a byte igual ao baseline; necessária à Aula 07.
- `RubricaAula08.gs`: desafios, referência pura, validação e recibos da Aula 08.

O GET mantém `mobile-entregas-1.0.0` para preservar a integração da Aula 07. O GET sozinho não identifica a disponibilidade da Aula 08. Ela deve ser homologada pelo protocolo de desafio.

## Como a nota é calculada

O servidor emite entradas variáveis e conserva a referência. As fontes permitidas executam em sandbox no navegador. O servidor recebe apenas dados JSON: entradas referenciadas pelo desafio, saídas, hashes e metadados. **Nenhuma fonte de estudante é executada no Apps Script.** Não há `eval`, importação remota nem `Function` com código recebido.

| Marco | Critérios | Pontos |
|---|---:|---:|
| M1: pacote, fontes, preflight, registro de IA, slots | 5 | 2,5 compartilhados |
| M2: prioridade, filtros, preservação, identidade | 4 | 2,0 compartilhados |
| M3: estado, recuperação, navegação, formulário, recorte, resumo | 6 | 3,0 compartilhados |
| M4: principal, limite, inválido, regressão, contrato | 5 | 2,5 por integrante |

Cada critério vale exatamente 0,5. A nota de cada estudante é `M1 + M2 + M3 + M4 do seu slot`. O mesmo envio pode gerar notas diferentes. Um preflight malsucedido e um log de IA vazio permanecem pendentes; não são preenchidos artificialmente. A presença de um registro não prova que uma ação aconteceu. Nenhuma rubrica pretende provar autoria ou experiência real no aparelho.

`localResult` é informativo, opcional e descartado pelo adaptador. Alterar `grade`, `xp`, `scores` ou `passed` dentro dele não altera a nota. Esses campos diretamente no envelope são recusados. M1 contém critérios de integridade e declaração, portanto uma entrega com todas as funções erradas pode conservar pontos de M1; não confundir zero comportamental com nota total zero.

## Protocolo da ficha

Todos os pedidos usam formulário POST com `nonce` aleatório por requisição e `payload` contendo JSON. Todos os envelopes da Aula 08 exigem `activity` e `schema` da tabela. O recebimento depende de `MOBILE_WEB_SUBMISSIONS_ENABLED=true` nas Script Properties.

O retorno `postMessage` contém `channel`, `requestNonce` (eco do `nonce` de transporte) e os campos da ação. O `nonce` aleatório do desafio é diferente desse eco. A ficha deve conferir origem Google permitida, janela do iframe correspondente, canal e `requestNonce` antes de aceitar uma resposta. Nenhuma mensagem de erro ou timeout confirma entrega.

| Ação | Campos adicionais | Canal | Efeito |
|---|---|---|---|
| `challenge` | pacote, slots, fontes, equipe, integrantes, evidência | `mobile-aula08-challenge` | Emite desafio; não escreve notas |
| `verify` | dados anteriores + `challengeId`, `challengeToken`, `outputs` | `mobile-aula08-verification` | Calcula prévia oficial; não escreve notas ou auditoria |
| `verifyAndSubmit` | dados anteriores + `pdfSha256` | `mobile-aula08-receipt` | Recalcula, grava e retorna recibo |
| `validateReceipt` | `receipt` completo | `mobile-aula08-receipt-validation` | Verifica HMAC do recibo no servidor |

Dados vinculados ao desafio:

```text
{activity, schema, packageSha256, slots, sourceHashes,
 team, members, evidence}
```

`slots` é um array crescente, sem repetição, com 1 a 4 valores entre 1 e 4. `members` possui a mesma ordem e cardinalidade: `{name, slot}`. `sourceHashes` é um objeto `path → SHA-256`, com exatamente `src/equipe.mjs` e `src/individual/alunoN.mjs` para os slots informados. `evidence` contém `preflight`, `aiLog` e `environment`, conforme o contrato JSONL, sem a chave `type`.

O vínculo usa SHA-256 do JSON canônico: chaves de objetos ordenadas lexicalmente, ordem dos arrays preservada, sem espaços adicionais. Strings de identificação e log são aparadas nas extremidades. A ficha envia e compara essa forma normalizada.

O desafio retorna `ok`, `challengeId`, `nonce`, `issuedAt`, `expiresAt`, `activity`, `schema`, `packageSha256`, `bindingSha256`, `casesSha256`, `slots`, `sourceHashes`, `cases` e `token`. Cada caso é `{id, criterion, scope, slot?, input}`. O `id` é opaco e contém prefixo variável; respostas copiadas de outro desafio são rejeitadas mesmo que os nomes dos critérios coincidam.

Saída do executor:

```javascript
{id: 'id-opaco', ok: true, value: /* JSON */, unchanged: true}
// ou
{id: 'id-opaco', ok: false, error: 'EXECUTION_ERROR'}
// ou error: 'TIMEOUT'
```

O observador do sandbox compara a entrada antes e depois. M2-3 exige `unchanged: true`; congelar a entrada não mede preservação e não deve substituir essa observação. O limite de uma saída é 20.000 caracteres canônicos. Resultados incompletos, IDs repetidos, campos extras e erros não previstos são recusados.

`verify` retorna `evaluation: {rubric, members}`. Cada integrante possui `name`, `slot`, `m1`, `m2`, `m3`, `m4`, `total` e exatamente 20 `criteria` com `{id,label,passed,points,max}`. A prévia permite gerar o PDF com nota oficial **antes** de calcular o hash dos bytes. A entrega final repete a avaliação; não aceita a prévia como autoridade.

`verifyAndSubmit` retorna `{ok:true, receipt, evaluation}`. O objeto `receipt` contém:

```text
activity, schema, instrument, rubric, receiptId, receivedAt,
challengeId, packageSha256, pdfSha256, answersSha256,
sourceHashes, team, members, gradeStatus, signature
```

A HMAC cobre todos esses campos, exceto `signature`, com domínio específico da Aula 08. `validateReceipt` recebe apenas esse objeto, sem `channel` ou `requestNonce`, e retorna `valid:true`, `receiptSha256` (SHA-256 canônico do recibo **incluindo a assinatura**), `receiptId`, hashes e assinatura. O frontend deve conferir o hash canônico retornado contra o objeto recebido e só então apresentar confirmação. O segredo HMAC nunca sai do servidor. Base64 no pacote é **codificação**, não criptografia.

## Expiração, replay e concorrência

- Desafio válido por 10 minutos.
- No máximo 5 desafios por hash de pacote a cada 10 minutos.
- No máximo 8 prévias/verificações por desafio; ao atingir o limite, solicitar outro.
- Estado em Script Properties, protegido por `LockService`, com no máximo 200 desafios ativos/retidos.
- Registros de desafio retidos por 2 horas após a expiração para diagnóstico e replay; limpeza ocorre na emissão seguinte.
- `verify` incrementa um contador técnico de limitação, mas não consome o desafio e não modifica notas ou auditoria.
- Um desafio passa a `processing` persistentemente antes de qualquer escrita de nota. Concluído o flush, passa a `consumed`. Novas tentativas com o mesmo desafio são recusadas.
- Um reenvio legítimo pede novo desafio e substitui as linhas existentes por estudante/atividade; não duplica alunos nem auditoria.

A limitação por pacote é uma barreira simples. Um cliente deliberadamente malicioso pode trocar hashes para tentar contorná-la. Ela não é autenticação, proteção de identidade nem serviço resistente a negação de serviço.

## Auditoria e falhas de escrita

As **17 colunas existentes** permanecem na mesma ordem. Detalhes dos quatro marcos e das notas individuais ficam em `Respostas JSON`. As colunas de nota/XP recebem o valor do integrante daquela linha. HMAC, SHA do PDF e SHA das respostas permanecem disponíveis.

O Apps Script/Sheets não oferece transação atômica entre todas essas escritas. Uma falha depois de alguma operação pode deixar linhas parciais. O adaptador marca `write_failed`, bloqueia o replay e **não emite recibo nem confirmação**. O docente deve conferir a auditoria e o boletim pelo ID do desafio, reparar exclusivamente o que ficou incompleto e liberar um novo envio por novo desafio. Não repetir o mesmo payload como se isso confirmasse conclusão. `MOBILE_A08_CHALLENGE_<id>` conserva o estado técnico por tempo limitado; para diagnóstico, inspecionar sem publicar seu conteúdo.

Em caso de timeout depois de uma gravação, a ficha não afirma entrega. Conferir o boletim e a auditoria antes de repetir. Perder a resposta não desfaz uma escrita concluída. Esse comportamento aparece como contingência, não como sucesso simulado.

## Implantação pelo docente

1. Abra o projeto Apps Script **Mobile** associado à planilha já existente. Confira o ID em `MOBILE_CFG`; não reutilize PPI I.
2. Mantenha `MOBILE_WEB_SUBMISSIONS_ENABLED=false` durante a atualização e avise caso a turma esteja enviando a Aula 07.
3. Substitua `Code.gs`, preserve `RubricaAula07.gs` e acrescente `RubricaAula08.gs` do mesmo commit homologado. Salve.
4. Execute `testarConexaoMobile`. Ele confere infraestrutura e rubrica antiga, sem produzir entregas reais.
5. Atualize a implantação Web App Mobile existente, com execução pelo docente e acesso previsto para a ficha. Não publicar uma segunda planilha ou copiar segredos para o Git.
6. Confira a URL `/exec` Mobile da ficha. Um GET respondendo não encerra a homologação da Aula 08.
7. Somente na janela de homologação autorizada, habilite `MOBILE_WEB_SUBMISSIONS_ENABLED=true`.
8. Execute os passos do E2E abaixo. Ao terminar, o docente decide o período de recebimento. A chave `MOBILE_RECEIPT_HMAC_SECRET` é gerada no primeiro desafio sob lock, mantida somente em Script Properties e reutilizada pela infraestrutura Mobile.

Não apagar ou girar a chave HMAC sem considerar os recibos anteriores: isso invalida sua verificação. Fazer backup operacional do segredo no mecanismo privado da instituição, nunca neste repositório.

## Roteiro de homologação real (G10)

Executar com dois ou quatro **nomes fictícios**, por exemplo QA Ana e QA Bia, e uma equipe fictícia exclusiva. Nenhum desses passos foi executado em Sheets real nesta entrega.

1. Abra a ficha servida pela publicação a homologar; importe um JSONL gerado pelo starter e preencha slots/nome da equipe.
2. Execute o botão principal. Confira desafio vigente, prévia oficial, PDF baixado, hash exato dos bytes, recibo e validação do recibo.
3. Na aba `4º Bimestre`, confira a nova coluna `Aula 08` antes de `Média`, notas de cada integrante, preservação da Aula 07 e média aritmética.
4. Na aba `Auditoria`, confira uma linha por estudante/atividade, 17 colunas, instrumento, rubrica, hashes, assinatura e JSON com M1–M4.
5. Provoque desempenho diferente entre dois slots e reenvie por novo desafio. Confira notas distintas e substituição sem duplicatas.
6. Tente reutilizar um desafio, adulterar token/recibo e interromper a rede. A ficha não pode mostrar confirmação em falha.
7. Revise a Aula 07 com fixture autorizada de forma separada, sem alterar notas reais.
8. Remova **somente** linhas fictícias criadas no boletim e na auditoria. Preserve colunas, fórmulas, notas reais e infraestrutura. Registre quem conferiu, data, URL/versão e remoção.

G10 só recebe PASS depois de implantação, recebimento, escrita, reenvio, auditoria e limpeza efetivamente observados. Sem isso, conservar `PENDING_LIVE_E2E`.

## Evidências automatizadas e limites

```bash
node --test tests/mobile-entregas.test.cjs
node --test tests/mobile-entregas-aula08.test.cjs
```

As suites rodam em Node com Apps Script, Properties, LockService e Sheets simulados. O helper `createFixture` da suite A08 pode ser usado pelo Chromium para executar o adaptador real da candidata, com transporte interceptado e sem chamadas ao Google. Concorrência é testada por reentrada durante escrita e lock ocupado; isso não constitui teste de carga da infraestrutura real.

Cobertura: 20 critérios, notas distintas, nota local adulterada ignorada, HMAC, hash, reenvio, média, TTL/replay, token/atividade/schema/pacote inválidos, resultados de outro desafio, entradas extras, fórmulas em nomes, equipe conflitante, limites e escrita/flush com falha sem confirmação. A Aula 07 possui suite original independente.

**Garantias do código verificado:** cálculo no servidor, rubrica explícita, campos/limites, associação criptográfica de desafio e recibo aos dados, rejeição de replay e ausência de falso recibo no caminho de erro testado.

**Mitigações:** adulterar apenas nota/avaliador local, copiar resultados de outro desafio, inserir nomes como fórmula e reenviar concorrentemente são tratados pelos controles descritos.

**Não garantido:** autoria, honestidade do navegador, vínculo real nome-pessoa, ausência de ajuda, uso real em celular, efetiva execução das fontes por um cliente substituído, veracidade de preflight/log e atomicidade completa do Sheets. Um cliente inteiramente malicioso pode calcular saídas corretas sem executar as fontes declaradas. Hashes apenas identificam bytes/dados; HMAC autentica o servidor, não o estudante. O professor complementa com observação e conversa curta sobre o código.
