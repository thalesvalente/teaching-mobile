# Aula 08 · Seu laboratório vivo

Você vai completar um app pequeno de atividades da escola. Ele abre no navegador, adapta-se a uma tela de celular e usa dados fictícios. O projeto **já funciona como ponto de partida**, mas alguns comportamentos têm pendências marcadas com `TODO`.

Este laboratório consolida funções, estado, lista, formulário e navegação das aulas Mobile. É um projeto **Mobile Web**, sem dependências externas; não precisa de Expo e não gera um app nativo Android/iOS. `app.json` é uma descrição do laboratório, não uma configuração Expo.

## 1. Preparar (M1)

Tenha Node.js 22 ou mais recente e VS Code. Abra esta pasta `projeto` no VS Code, depois abra **Terminal → Novo terminal**.

```bash
npm ci
npm run preflight
npm run web
```

Abra o endereço mostrado no terminal: `http://127.0.0.1:8088`. Mantenha esse terminal aberto. Use outro terminal, nesta mesma pasta, para testar. `Ctrl+C` encerra o servidor.

Não precisa entrar no GitHub, instalar extensão de IA ou configurar pipeline. Se a escola entregar a pasta pronta, basta abri-la. O servidor só escuta no próprio computador; para observar a tela estreita, use o modo de dispositivo do navegador.

## 2. Programar e testar (M2 e M3)

1. Experimente buscar `praça`, selecionar uma categoria e abrir um detalhe.
2. Abra `src/equipe.mjs`. Escolha **um** comentário `TODO`.
3. Peça ao Gemini uma explicação ou pista, usando apenas a função necessária.
4. Faça a alteração, salve e atualize a página do app.
5. Execute:

```bash
npm run nota
```

O comando mostra `OK` e `PENDENTE` para cada critério e uma estimativa por slot. No starter, algumas funções já passam e outras precisam de trabalho. **Você não precisa começar com nota 10.** Pode testar quantas vezes quiser.

A nota local é formativa. Alterar os testes ou a nota no pacote não altera a regra de avaliação do servidor.

### Onde editar

| Arquivo | Quem trabalha | Função |
|---|---|---|
| `src/equipe.mjs` | Equipe | Busca, estados, identidade, retorno, formulário e resumo |
| `src/individual/aluno1.mjs` | Integrante do slot 1 | Normalizar busca |
| `src/individual/aluno2.mjs` | Integrante do slot 2 | Distinguir estados da tela |
| `src/individual/aluno3.mjs` | Integrante do slot 3 | Validar formulário |
| `src/individual/aluno4.mjs` | Integrante do slot 4 | Criar chave estável pelo ID |
| `src/evidencias.json` | Equipe | Registrar uma síntese honesta do uso da IA |

Não escreva nomes nessas fontes. Associe cada integrante ao seu slot **na ficha online**. Preserve os quatro arquivos individuais mesmo se alguns slots não forem usados.

### Registrar a ajuda recebida

`src/evidencias.json` começa com `{"aiLog":[]}`. Isso significa que **nenhum uso de IA foi declarado**. Depois de usar o Gemini, acrescente uma entrada real. Modelo de estrutura (substitua todos os textos pela sua experiência):

```json
{
  "aiLog": [
    {
      "mission": "M2",
      "request": "Explique aqui o que você pediu.",
      "suggestion": "Resuma a pista que aproveitou.",
      "humanChange": "Explique a alteração que você fez.",
      "test": "Registre o comando e o resultado observado."
    }
  ]
}
```

Use `M1`, `M2`, `M3` ou `M4`. Cada texto tem limite de 400 caracteres, com até 20 entradas. Não copie o exemplo como se fosse uma ação executada. Não use e-mails, nomes de estudantes, senhas, tokens ou o texto completo de conversas.

## 3. Trabalhar individualmente (M4)

Cada pessoa completa `resolver(input)` no arquivo de seu slot. Todos recebem cinco critérios de 0,5 ponto: caso principal, limite, entrada inválida, regressão e contrato de saída.

| Slot | Entrada principal | Saída esperada |
|---|---|---|
| 1 | `{op:'normalizar',value:'  PRAÇA  '}` | `'praca'` |
| 2 | `{op:'estado',loading:false,error:null,items:[{id:'r1'}],filtered:[]}` | `'sem-resultados'` |
| 3 | `{op:'validar',form:{title:'Oficina',category:'Arte'}}` | `{valid:true,errors:{}}` |
| 4 | `{op:'chave',item:{id:0}}` | `'0'` |

Cada função é autocontida: sem `import`, rede, DOM, armazenamento ou execução externa. Recebe JSON e devolve JSON imediatamente, sem `Promise`. Não usa data, sorteio ou entrada do terminal. Não altera a entrada. Assim, o mesmo comportamento pode ser examinado no navegador isolado.

## 4. Gerar e entregar

Para uma equipe com os quatro slots:

```bash
npm run entrega
```

Para uma equipe menor, indique os slots que serão associados a integrantes na ficha:

```bash
npm run nota -- --slots=1,2
npm run entrega -- --slots=1,2
```

Use slots únicos e em ordem crescente, de 1 a 4. O comando cria **`entrega/entrega-a08.jsonl`**. Abra a ficha da Aula 08, importe esse arquivo, identifique a equipe e associe nomes e slots e clique em **Avaliar e enviar**.

O JSONL contém somente as fontes de equipe e dos slots escolhidos, hashes e evidências permitidas. `.env`, `.git`, `node_modules` e outros arquivos não são incluídos. Base64 é **codificação**, não criptografia. Revise as fontes antes de gerar; o programa recusa alguns padrões comuns de segredo/e-mail, mas não consegue identificar todo dado pessoal em texto livre.

O preflight é executado de novo ao gerar o pacote, para registrar as condições observadas naquele computador. Não há data variável no JSONL. Com as mesmas fontes puras, evidências e ambiente, a geração produz os mesmos bytes e hashes. A identidade dos estudantes não é lida do computador nem inserida automaticamente.

**Sem internet:** continue programando e testando; o JSONL pode ser gerado sem rede. Guarde o arquivo e use o PDF local da ficha. PDF salvo não é entrega confirmada. Quando a rede voltar, solicite um novo desafio pela ficha e aguarde o recibo.

## Contratos de equipe: consulta durante os TODOs

Todos os exemplos usam `resolver(input)` de `src/equipe.mjs`. A propriedade `op` escolhe a operação.

Um registro contém `id`, `title`, `category`, `period` e `value`. IDs válidos são números finitos ou strings não vazias de até 80 caracteres; não use a posição do array como identidade. Preserve a string do ID sem modificá-la. Arrays têm até 100 registros.

| `op` | Entrada além de `op` | Saída e regra |
|---|---|---|
| `estado` | `loading:boolean`, `error:string\|null`, `items:array`, `filtered:array` | Prioridade: `'carregando'`, `'erro'`, `'vazio'`, `'sem-resultados'`, `'pronto'`. Entrada inválida ou arrays maiores que 100: `'erro'`. |
| `filtrar` | `items`, `query:string`, `category:string`, `period:string` | Novo array com texto **E** categoria **E** período; ordem e registros preservados. `Todas` e `Todos` não restringem. Normalize título/busca: espaços nas pontas, minúsculas e remoção de acentos NFD (`\u0300`–`\u036f`). Entrada inválida ou busca maior que 200: `[]`. |
| `chaves` | `items` | Array `String(item.id)` para cada registro, na mesma ordem. Array/ID inválido: `[]`. |
| `tentar` | `state:{status,error}` | Se `status==='erro'`, `{status:'carregando',error:null}`. Outros estados válidos permanecem iguais. Entrada inválida: `null`. |
| `navegar` | `state:{screen,selectedId,query,category,period}`, `action`, `id` opcional | `action:'open'` e ID válido: `screen:'detail'`, `selectedId:String(id)`. `action:'back'`: `screen:'list'`, `selectedId:null`. Preserve todos os filtros. Entrada inválida: `null`. |
| `validar` | `form:{title,category}` | `{valid,errors}`. Desconsidere espaços nas pontas; campos não string contam como vazios. Obrigatórios; limites 80/40. Mensagens abaixo. |
| `resumo` | `items` | `{total:n,text:'n registro(s) no recorte.'}`. Array inválido ou maior que 100: total 0 e texto correspondente. |

Mensagens do formulário:

- Título vazio: `Informe o título.`
- Categoria vazia: `Escolha a categoria.`
- Título maior que 80 caracteres após `trim`: `Use até 80 caracteres.`
- Categoria maior que 40 caracteres após `trim`: `Use até 40 caracteres.`

`errors` contém somente os campos com erro. Nenhum erro: `{valid:true,errors:{}}`. Para título e categoria vazios: `{valid:false,errors:{title:'Informe o título.',category:'Escolha a categoria.'}}`.

Os slots 2 e 3 seguem `estado` e `validar` exatamente. Slot 1: string inválida ou maior que 200 devolve `''`. Slot 4: ID inválido devolve `null`; `0` é válido.

## Como os arquivos de apoio funcionam

- `src/contrato.mjs`: esquema estrito, canonicalização e SHA-256, compartilhados com a ficha online.
- `src/avaliacao-local.mjs`: critérios e casos públicos; não contém autoridade sobre a planilha.
- `scripts/preflight.mjs`: confere Node 22+, fontes e log.
- `scripts/avaliar.mjs`: executa testes em workers que podem ser encerrados por timeout. Isso evita travamento acidental; o processo local não é apresentado como sandbox de segurança.
- `scripts/gerar-entrega.mjs`: lê somente caminhos permitidos, recusa symlinks e salva o JSONL por substituição atômica.
- `scripts/web.mjs`: servidor local sem dependências; só expõe os cinco recursos públicos do app.
- `src/dados.mjs`: dados escolares fictícios.

O pacote é UTF-8, LF e uma entidade JSON canônica por linha. Chaves são ordenadas alfabeticamente; arrays mantêm sua ordem. O hash do pacote cobre as linhas anteriores a `end`, cada uma com LF final. `lineCount` inclui a própria linha `end`. Limites: 128 KiB por pacote, 16 KiB por fonte, no máximo quatro slots. O importador recusa campos desconhecidos, linhas duplicadas, hashes incoerentes e formatos incompatíveis.

## Se algo não funcionar

| Mensagem/situação | Próximo passo |
|---|---|
| `npm` não encontrado | Abra um novo terminal depois de instalar Node 22+. Peça apoio ao professor. |
| Porta ocupada | Feche o outro terminal do laboratório com `Ctrl+C` e tente de novo. |
| Pendências em `npm run nota` | Escolha um TODO; leia o caso e teste uma mudança pequena. |
| Fonte ausente ou link não permitido | Restaure o arquivo original dentro de `src/`; não use atalhos/symlinks. |
| Log inválido | Deixe somente `aiLog` em `src/evidencias.json` e confira as cinco propriedades de cada entrada. |
| Possível segredo/dado pessoal | Remova a informação sensível das fontes e do log. |
| A página não mudou | Salve `src/equipe.mjs` e atualize o navegador. |
| Ficha recusou o pacote | Execute `npm run entrega` de novo e importe o arquivo recém-gerado. Não edite o JSONL à mão. |
