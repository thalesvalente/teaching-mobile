# Quatro missões coletivas da Aula 08

**Para estudantes:** [Missões passo a passo](missoes.html). A página apresenta 22 etapas Faça/Confira (5+5+6+6), sem exigir leitura de Markdown.

**Candidata v2:** quatro tarefas para todos e registro reflexivo com ou sem IA aguardam aceite docente para uso oficial. Mantidos 100 minutos e 20 critérios de 0,5. Uma equipe recebe `M1 + M2 + M3 + M4`; a nota é igual para todos.

## M1 — Preparação · 15 minutos · 2,5 pontos

Abrir `projeto` no VS Code, executar `npm ci`, `npm run preflight` e `npm run web`, observar o aplicativo, conhecer os cinco arquivos de funções e executar `npm run nota`. Preparar registro verdadeiro em `src/evidencias.json`, sem inventar experiência com IA.

## M2 — Funções · 25 minutos · 2,0 pontos

Em `src/equipe.mjs`, revisar `estado`, `filtrar` e `chaves`: prioridade de carregamento/erro, busca normalizada, categoria/período combinados, preservação da coleção e identidade por ID. Com dados iniciais, `praca`, Arte e Manhã devem mostrar Fotografia da praça. ID numérico zero é válido.

## M3 — Integração · 35 minutos · 3,0 pontos

Distinguir base vazia e filtro sem resultados; recuperar erro; abrir detalhe e voltar sem perder filtros; validar título/categoria (80/40 caracteres após trim); produzir resumo textual. Demonstrar no aplicativo e rodar os testes. A demonstração visual não é substituída pelo teste das funções.

## M4 — Revisão e entrega · 25 minutos · 2,5 pontos

A equipe trabalha **os quatro** arquivos `src/individual/aluno1.mjs` a `aluno4.mjs`. Os números são identificadores técnicos, não pessoas. Cada um dos cinco critérios exige aprovação de todas as tarefas nos casos correspondentes. Omitir uma tarefa é recusado, não aumenta a nota. A distribuição interna do trabalho é livre.

Revisar normalização, estados, formulário e ID; executar `npm run nota`; registrar processo verdadeiro; executar `npm run entrega`; importar JSONL; preencher equipe e nomes; avaliar/enviar após liberação e guardar recibo validado. O envio não é um quinto marco.

## Critérios coletivos

| Critério | Verificação | Pontos |
|---|---|---:|
| M1-1 | Pacote e schema compatíveis | 0,5 |
| M1-2 | Fontes permitidas e hashes coerentes | 0,5 |
| M1-3 | Preflight e ambiente registrados | 0,5 |
| M1-4 | Registro reflexivo verdadeiro do processo | 0,5 |
| M1-5 | Equipe e tarefas consistentes | 0,5 |
| M2-1 | Prioridade de carregamento e erro | 0,5 |
| M2-2 | Busca normalizada e filtros combinados | 0,5 |
| M2-3 | Coleção original preservada | 0,5 |
| M2-4 | Identidade estável | 0,5 |
| M3-1 | Vazio e sem resultados distintos | 0,5 |
| M3-2 | Tentar novamente | 0,5 |
| M3-3 | Lista, detalhe e retorno | 0,5 |
| M3-4 | Formulário válido, inválido e limites | 0,5 |
| M3-5 | Recorte preservado no retorno | 0,5 |
| M3-6 | Resumo textual do recorte | 0,5 |
| M4-1 | Casos principais das quatro tarefas | 0,5 |
| M4-2 | Casos limite das quatro tarefas | 0,5 |
| M4-3 | Entradas inválidas das quatro tarefas | 0,5 |
| M4-4 | Regressão das quatro tarefas | 0,5 |
| M4-5 | Contratos e limites das quatro tarefas | 0,5 |

Pacote/schema/fontes inválidos são condições de admissão: podem impedir a avaliação, não simplesmente gerar nota zero. M1 contém declarações e integridade, não comprova autoria. `aiUsage` distingue used (log real), not-used (log vazio) e undeclared (pendente); reflexão de 20–400 caracteres para pontuar na proposta. Ausência não é automaticamente não uso.

Marcar passos no navegador não envia dados, não pontua e não comprova entrega. Reenvio com composição diferente exige o professor. Não há nota por slot nem associação de nome aos arquivos.
