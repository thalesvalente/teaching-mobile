# Aula 08 — Operação Dados sob Pressão

Seu objetivo é tornar um aplicativo React Native resistente a estados de erro, filtros combinados, entradas inválidas e ações repetidas. Use somente dados fictícios nas trilhas **Memórias** e **EDA/Permanência**.

| Ciclo | Conteúdo | Tempo | Missões | XP formativos |
|---|---|---:|---:|---:|
| M1 | Estados sob falhas | 15 min | 5 | 25 |
| M2 | Filtros e imutabilidade | 25 min | 4 | 20 |
| M3 | Fluxo, navegação e validação | 35 min | 6 | 30 |
| M4 | Idempotência, resumos e regressão | 25 min | 5 | 25 |
| Total | | 100 min | 20 | 100 |

## Trabalhe na mesma bancada

1. Escolha uma missão e leia **Faça → Observe → Entenda**, o conceito e o teste esperado.
2. Use **Localizar no código** para chegar ao trecho relevante do arquivo completo.
3. Edite `ProjetoUniversal.tsx` e clique **Executar**. O atalho `Ctrl+Enter` também executa.
4. Observe a interface e clique **Conferir missão**. O feedback informa o comportamento que ainda precisa ser corrigido.
5. Use **Conferir progresso** para repetir os 20 testes sobre a versão atual.

Em telas estreitas, alterne entre **Código** e **Resultado** sem mudar de missão. As duas prévias executam React Native Web com estados independentes. A largura móvel **não é Android/iOS nativo**. O [projeto Expo v4](../projeto/README.md) usa o mesmo TSX para permitir a verificação em aparelho real.

O arquivo inicial tem erros intencionais nas seis funções do domínio. Preserve os tipos, os IDs e a interface. A bancada permite React, `react-native` e funções do domínio; APIs de rede, armazenamento e acesso à página principal estão fora do exercício. Erros de sintaxe e loops comuns geram mensagens de diagnóstico. Se a prévia deixar de responder, reinicie-a pelo botão mostrado, preservando o código e o progresso.

## Entenda os três resultados

- **XP formativos:** cada missão conquistada acrescenta 5 XP, uma vez. São históricos e permanecem após uma regressão.
- **Testes atuais:** mostram quais comportamentos passaram no código que está aberto agora. Editar ou importar código exige nova conferência.
- **Avaliação institucional:** rubrica de 20 critérios, 0,5 ponto cada, total de 10 pontos. A nota oficial permanece pendente até a validação docente. Um navegador ou JSON com 100 XP não comprova uma nota 10.

## Equipe, continuidade e evidências

Informe o nome da equipe e de 1 a 8 integrantes. Para entrega online, cada matrícula deve ser consultada no cadastro do professor e o nome retornado precisa ser confirmado. Preserve zeros iniciais e não confirme nomes incorretos. A interface não cadastra nem altera estudantes.

**Salvar progresso** baixa um JSON para continuar depois. **Retomar arquivo** restaura código, missão e conquistas; a identificação precisa ser consultada novamente antes de enviar. Código e progresso podem ficar no navegador; nomes e matrículas não são salvos automaticamente. O JSON baixado explicitamente pode conter identificação: guarde-o com a equipe e o professor.

**Imprimir / salvar PDF A4** permite gerar relatório parcial ou completo. Missões e reflexões pendentes continuam visíveis. Salvar PDF não envia o documento e não comprova entrega.

**Gerar PDF e Enviar** só transmite evidências quando o receptor estiver autorizado. A confirmação depende de recibo e readback do servidor. O estado inicial da entrega é `PENDENTE_VALIDACAO`, com nota oficial pendente.

Se o recibo não chegar, use **Consultar recibo pendente** antes de enviar novamente. Essa consulta não cria uma nova entrega. **Salvar solicitação pendente** permite continuar essa reconciliação depois; seu arquivo contém identificação e comprovantes de consulta, portanto não deve ser publicado.

No modo QA, use exclusivamente matrículas fictícias. O docente informará quando o recebimento da turma estiver liberado.

## O que registrar no celular real

Registre modelo, sistema e versão do Expo, além do commit ou hash do código. Teste teclado, toque duplo, rolagem, foco, leitor de tela, retorno do detalhe preservando filtros e os estados de erro/vazio. Anote o que ainda não foi possível testar; a prévia no navegador não substitui essa evidência.
