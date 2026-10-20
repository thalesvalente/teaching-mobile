# Missões — Dados em movimento

**Objetivo:** transformar uma coleção em informação encontrável, mantendo a fonte intacta. O placar vai de **0 a 100 XP**, equivalente a **0,0 a 10,0 pontos**. Execute `npm run nota` após cada mudança; não espere terminar tudo para saber sua nota.

As quatro funções ficam em `src/missoes.mjs`. Edite esse arquivo; mantenha `src/avaliacao.mjs` como rubrica. Os comentários explicam o contrato e os testes são públicos. A interface importa as mesmas funções que o avaliador.

## Rota de trabalho

| Momento | Ação | Evidência |
|---|---|---|
| Antes de editar | Execute o avaliador e abra o app | 0,0; quatro missões pendentes |
| Durante cada missão | Implemente, teste, observe e explique | Nota atual e critérios que passaram |
| Boss — recorte integrado | Combine busca/categoria/período, limpe e simule erro | Observação do comportamento no app |
| Fechamento | Rode o avaliador e exporte o relatório parcial ou completo | HTML/PDF + commit + ficha |

Os 20 minutos da oficina podem ser usados para **uma missão e uma integração pequena**. As demais continuam em estudo ou ficam registradas como pendentes. Não há perda de pontos por tempo, dicas ou tentativa.

## M1 — Estado da tela · 20 XP · até 2,0 pontos

**Implemente:** `classificarTela(status, base, visiveis)`.

| Entrada | Resultado esperado |
|---|---|
| `status === 'carregando'`, com ou sem dados anteriores | `'carregando'` |
| `status === 'erro'`, com ou sem dados anteriores | `'erro'` |
| Sucesso, `base` sem registros | `'vazia'` |
| Sucesso, `base` com registros e `visiveis` vazio | `'semResultado'` |
| Sucesso e recorte com registros | `'conteudo'` |

Quatro critérios de 5 XP: carregamento; erro; distinção entre os dois vazios; conteúdo após sucesso.

**Experimento:** toque em “Base vazia”; depois volte a “Com dados” e busque `zzzz`. As mensagens precisam ser diferentes. Em “Simular erro”, “Tentar novamente” inicia a espera local e recupera os dados.

**Dica:** verificar `base.length` antes de `status` pode chamar uma espera de “nenhum dado”.

## M2 — Encontrar sem apagar · 30 XP · até 3,0 pontos

**Implemente:** `filtrar(registros, busca, categoria = 'Todas', periodo = 'Todos')`.

Compare o título e a busca depois de `trim().toLowerCase()`. Combine **texto E categoria E período**. “Todas” e “Todos” desativam apenas seu respectivo critério. Devolva o recorte sem remover ou alterar os registros recebidos.

| Caso de teste | Esperado |
|---|---|
| Busca vazia, todas as categorias e períodos | 6 registros |
| Memórias: `  PRAÇA  ` | `m2` e `m6` |
| Memórias: `praça` + `Lugar` | Somente `m2` |
| EDA: `Frequência` + `adequado` | Somente `i4` |
| EDA: `Semana 2`, demais filtros livres | `i4`, `i5` e `i6` |
| EDA: `Frequência` + `atencao` + `Semana 2` | Nenhum registro |
| `zzzz` | Recorte vazio, base intacta |
| Filtrar e depois limpar | Os 6 registros originais reaparecem |

Seis critérios de 5 XP: busca vazia; normalização; interseção; período; termo inexistente; preservação/limpeza.

**Dica:** `filter` devolve uma seleção. Substituir a coleção de origem pelo resultado faz os outros registros desaparecerem do próximo filtro.

## M3 — Cada registro tem identidade · 20 XP · até 2,0 pontos

**Implemente:** `prepararLista(visiveis)`.

Devolva um array com uma entrada por registro recebido:

```js
{ key: '27', item: registroComId27 }
```

A chave é o ID convertido para texto; `item` preserva todos os campos do registro. Mantenha a ordem do recorte. A lista do app usa `linha.key` em `keyExtractor` e `linha.item` em `renderItem`.

Quatro critérios de 5 XP: exatamente o recorte; chave estável após inverter a ordem; dados próprios de cada cartão; IDs numéricos/textuais e lista vazia.

**Experimento:** abra dois cartões diferentes e volte. O detalhe precisa corresponder ao registro tocado; os filtros da lista devem permanecer.

**Dica:** posição é o lugar do item hoje. ID é a identidade que acompanha o registro quando a ordem muda.

## M4 — Resumir sem distorcer · 30 XP · até 3,0 pontos

**Implemente:** `resumir(visiveis, trilha)`.

O retorno tem este formato:

```js
{
  total: 1,
  segundo: 1,
  barras: [
    { nome: 'Lugar', valor: 1, unidade: 'memórias', largura: 100,
      texto: 'Lugar: 1 memórias' }
  ]
}
```

O texto pode ter redação diferente, mas deve conter **nome, valor e unidade** da barra. `largura` é um número entre 0 e 100.

| Contrato | Memórias | EDA |
|---|---|---|
| `total` | Quantidade de registros do recorte | Quantidade de indicadores do recorte |
| `segundo` | Categorias distintas no recorte | Indicadores com categoria `atencao` |
| Barras | Uma por categoria presente, com contagem | Uma por indicador com unidade `%` e valor finito entre 0 e 100 |
| Nome | A categoria | Título + período; use `sem período` quando ausente |
| Unidade | `memórias` | `%` |
| Escala | Maior contagem do recorte ocupa 100; demais proporcionais | Fixa em 0–100; valor 88 corresponde a largura 88 |
| Recorte vazio | `total: 0`, `segundo: 0`, `barras: []` | Mesmo retorno vazio |

Valores em estudantes **não entram no eixo percentual**; a interface já os apresenta em texto. Não some percentuais ou os interprete como causa de evasão. As duas semanas são inventadas.

Seis critérios de 5 XP: cartões do recorte; vazio; barras do recorte; unidades/valores válidos; escala; alternativa textual. Cada critério executa exemplos independentes: uma falha não zera a missão inteira.

**Dica:** derive lista, cartões e gráfico da mesma variável `visiveis`. Não guarde outra cópia da seleção em um estado independente.

## Boss — Interface e integração

Esta validação usa a rubrica de **implementação da ficha**, separada da nota automática das funções. Marque “atendido” somente depois de executar e guardar evidência:

| Missão da ficha | Máximo | Resultado a observar |
|---|---:|---|
| Estado da tela | 2,0 | Carregando, base vazia, sem resultados e erro identificáveis; nova tentativa recupera |
| Busca e filtros | 3,0 | Texto/categoria/período combinam; limpar restaura os dados |
| Lista com identidade | 2,0 | Cartões corretos, dois detalhes corretos, retorno preserva recorte |
| Resumo visual coerente | 3,0 | Contadores e barras acompanham a lista; nome/valor/unidade legíveis sem depender da cor |

Registre também largura/orientação, uso de teclado e toque, leitura dos rótulos, ambiente e limitações. O avaliador das funções não observa essas interações. Não some a autoavaliação à nota do código; são duas evidências com origens diferentes.

## Exportar sem terminar tudo

Execute `npm run nota`, abra `entrega/resultado.html` e use **Imprimir / salvar como PDF**. O relatório mostra a nota dessa execução, cada pendência e o máximo fixo. Não é necessário preencher identidade nem concluir todas as missões para salvar. Registre os autores na ficha da equipe e entregue os arquivos pelo canal combinado.
