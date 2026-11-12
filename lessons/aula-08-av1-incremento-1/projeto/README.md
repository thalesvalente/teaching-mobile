# Aula 08 — Projeto do laboratório vivo

**Para estudantes:** use [Começar](../comecar.html), [Missões](../missoes.html) e [Entrega](../atividade.html). Este arquivo é consulta técnica, não o ponto de entrada da aula.

Candidata v2: quatro tarefas para toda equipe e registro reflexivo de uso ou não uso de IA. As propostas aguardam aceite docente; o servidor bloqueia avaliação oficial até liberação explícita e homologação. A nota é única para a equipe. Os arquivos com nomes históricos aluno1–aluno4 não identificam pessoas.

## Preparar e testar

Node.js 22+ e VS Code. No terminal desta pasta, onde está package.json:

```bash
npm ci
npm run preflight
npm run web
```

Abra http://127.0.0.1:8088 no mesmo computador e deixe o terminal aberto. Em outro terminal nesta pasta execute `npm run nota`. Salve alterações e atualize o navegador. O app é Mobile Web responsivo, com dados escolares fictícios; não usa Expo, APK ou emulador.

O comando mostra OK/PENDENTE por critério e uma estimativa coletiva. Os TODOs são intencionais. Repita os testes sem penalidade; não altere o avaliador para fabricar acertos. A nota local não grava na planilha nem tem autoridade oficial.

| Arquivo | Trabalho coletivo |
|---|---|
| src/equipe.mjs | Estados, busca, filtros, IDs, recuperação, navegação, formulário e resumo |
| src/individual/aluno1.mjs | Normalização da busca |
| src/individual/aluno2.mjs | Estados da lista |
| src/individual/aluno3.mjs | Validação de formulário |
| src/individual/aluno4.mjs | ID estável |
| src/evidencias.json | Registro verdadeiro do processo, com ou sem IA |

Todas as equipes trabalham os quatro arquivos técnicos, mesmo com um, dois ou três participantes. Não associe nomes aos arquivos. Omitir tarefas é recusado pela CLI, pelo JSONL e pelo servidor. A opção explícita equivalente ao padrão é `--slots=1,2,3,4`; seleção parcial não é aceita nesta candidata.

## Registro de processo

O arquivo inicial não inventa evidência:

```json
{"aiLog": [], "aiUsage": {"status": "undeclared", "reflection": ""}}
```

`aiUsage.status` é `used`, `not-used` ou `undeclared`. `used` exige ao menos uma interação real no log; `not-used` exige log vazio; `undeclared` indica ausência de informação. `reflection` é texto de até 400 caracteres, com pelo menos 20 após trim para pontuar na proposta. Usar ou não usar IA pode pontuar quando a declaração e reflexão são verdadeiras e completas. Não invente interações.

Uma entrada de `aiLog` possui exatamente `mission` (M1, M2, M3 ou M4), `request`, `suggestion`, `humanChange` e `test`. Os quatro textos são não vazios, com até 400 caracteres. Limite de 20 entradas. Não inclua nomes, e-mails, senhas, tokens ou conversas completas. Declaração não comprova autoria.

## Contratos das funções

Todas as funções exportam `resolver(input)`, recebem JSON e devolvem JSON puro imediatamente. Não fazem import, rede, DOM, armazenamento, leitura do terminal, sorteio, data ou Promise. Não modificam a entrada. Os testes locais em worker evitam travamentos acidentais, mas **não são uma sandbox de segurança do sistema operacional**. Não execute código de terceiros não confiáveis no computador.

Em `src/equipe.mjs`, `input.op` escolhe a operação. Registros possuem `id`, `title`, `category`, `period`, `value`. IDs válidos são números finitos ou strings não vazias de até 80 caracteres. Preserve o ID, inclusive zero; não use posição do array. Arrays têm até 100 registros.

| op | Entrada além de op | Saída e regra |
|---|---|---|
| estado | loading boolean, error string ou null, items e filtered arrays | Prioridade: carregando, erro, vazio, sem-resultados, pronto. Entrada inválida ou arrays maiores que 100: erro. |
| filtrar | items, query string, category string, period string | Novo array com texto E categoria E período, ordem e registros preservados. Todas e Todos não restringem. Normalize título/consulta com trim, minúsculas e remoção de acentos NFD U+0300–U+036F. Entrada inválida ou consulta maior que 200: array vazio. |
| chaves | items | Array de String(item.id), na mesma ordem; array ou ID inválido: array vazio. |
| tentar | state com status/error | Erro vira {status:'carregando',error:null}; outros estados válidos permanecem; entrada inválida: null. |
| navegar | state:{screen,selectedId,query,category,period}, action, id opcional | open com ID válido: detail e String(id). back: list e selectedId:null. Preserve filtros. Entrada inválida: null. |
| validar | form:{title,category} | {valid,errors}. Trim; campos não string contam como vazios. Ambos obrigatórios; limites 80 e 40. |
| resumo | items | {total:n,text:'n registro(s) no recorte.'}. Array inválido ou maior que 100: zero e texto correspondente. |

Mensagens exatas do formulário: `Informe o título.`, `Escolha a categoria.`, `Use até 80 caracteres.` e `Use até 40 caracteres.`. `errors` contém apenas campos com erro; sem erro, `{valid:true,errors:{}}`.

As tarefas 2 e 3 usam os contratos estado e validar. Tarefa 1: `{op:'normalizar',value:'  PRAÇA  '}` devolve `'praca'`; valor não string ou acima de 200 caracteres devolve `''`. Tarefa 4: `{op:'chave',item:{id:0}}` devolve `'0'`; ID inválido devolve null. A nota M4 tem cinco aspectos coletivos, cada um aprovado somente quando todas as tarefas passam seus casos.

## Gerar e entregar

```bash
npm run nota
npm run entrega
```

O pacote fica em `entrega/entrega-a08.jsonl`. Abra a ficha HTML, importe-o, informe equipe e nomes, sem slots pessoais, e use Avaliar e enviar após liberação docente. Mantenha a composição completa nos reenvios. Mudança de membros exige conferência docente. PDF local não confirma recebimento; guarde o recibo validado com o PDF.

Schema mobile-a08-v2; gerador/contrato 2.0.0; avaliador local formativo-2.0.0. Obtenha projeto atualizado e gere novamente para migrar pacotes antigos. Não edite o JSONL manualmente.

O pacote contém somente as cinco fontes, resultados locais informativos e evidências permitidas. Não inclui .env, .git ou node_modules. Base64 é codificação, não criptografia. A detecção de padrões de segredos não identifica todo dado pessoal em texto livre. Revise o conteúdo.

## Infraestrutura de apoio

contrato.mjs é compartilhado com a ficha; evidence-policy.mjs valida a proposta; avaliacao-local.mjs contém casos formativos. preflight.mjs confere Node e fontes; avaliar.mjs usa workers com timeout; gerar-entrega.mjs recusa arquivos fora de allowlist e symlinks e salva por substituição atômica. web.mjs expõe somente recursos públicos permitidos; dados.mjs contém exemplos fictícios.

Formato UTF-8, LF, um JSON canônico por linha. Chaves ordenadas; arrays preservam ordem. O SHA do pacote cobre as linhas anteriores a end, com LF final. lineCount inclui end. Limites: 128 KiB por pacote, 16 KiB por fonte e quatro tarefas obrigatórias. Campos extras, duplicatas e hashes inconsistentes são recusados.

Sem internet, continue editando e testando os arquivos já baixados. Se preflight falhar, restaure fontes e confira Node. Se o registro falhar, mantenha somente aiLog e aiUsage e valide seus campos. Se a ficha recusar pacote antigo, gere um novo com o projeto atualizado. Erro de composição ou gravação parcial exige o professor, não alteração de nomes ou repetição cega.
