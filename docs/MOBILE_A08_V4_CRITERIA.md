# Matriz dos 20 critérios — Mobile Aula 08 v4

Cada missão concede **5 XP formativos**, preservados como conquista. A rubrica docente independente vale **0,5 ponto por critério**, total 10. Testes locais não lançam nota. Fonte de execução compartilhada: `laboratorio-vivo/criteria.js` e `shared/ProjetoUniversal.tsx`.

| Critério | Ciclo | Comportamento observável | Trecho do TSX | Teste concreto | XP | Rubrica docente |
|---|---|---|---|---|---:|---:|
| M1-01 | M1 | Erro tem prioridade sobre carregamento | `// [03] MÁQUINA DE ESTADOS` | Simule carregamento e erro ao mesmo tempo. O resultado deve ser erro. | 5 | 0,5 |
| M1-02 | M1 | Carregando sem erro | `// [03] MÁQUINA DE ESTADOS` | Simule carregando=true com erro=null. | 5 | 0,5 |
| M1-03 | M1 | Coleção realmente vazia | `// [03] MÁQUINA DE ESTADOS` | Fonte=0, visível=0 deve ser vazio. | 5 | 0,5 |
| M1-04 | M1 | Busca sem resultados não é coleção vazia | `// [03] MÁQUINA DE ESTADOS` | Fonte=4, visível=0 deve ser sem-resultados. | 5 | 0,5 |
| M1-05 | M1 | Dados prontos em estado estável | `// [03] MÁQUINA DE ESTADOS` | Fonte=4, visível=2 deve produzir pronto. | 5 | 0,5 |
| M2-01 | M2 | Pesquisa ignora caixa e acentos | `// [04] FILTRO` | Busque PRAÇA com espaços; devem surgir dois registros. | 5 | 0,5 |
| M2-02 | M2 | Categoria e período combinados (AND) | `// [04] FILTRO` | Categoria Lugar + período Noite retorna m-03. | 5 | 0,5 |
| M2-03 | M2 | Ordenação Z-A com IDs íntegros | `// [04] FILTRO` | Ordem Z-A deve devolver m-02,m-03,e-01,m-01. | 5 | 0,5 |
| M2-04 | M2 | A fonte não muda e o resultado preserva os objetos | `// [04] FILTRO` | Busque mapa; resultado m-03 deve ser o mesmo objeto da fonte. | 5 | 0,5 |
| M3-01 | M3 | Detalhe usa ID opaco exato | `// [05] NAVEGAÇÃO E FORMULÁRIO` | Abra detalhe m-03 e confira Mapa da praça. | 5 | 0,5 |
| M3-02 | M3 | ID desconhecido devolve null | `// [05] NAVEGAÇÃO E FORMULÁRIO` | Consulte m-999; o resultado obrigatório é null. | 5 | 0,5 |
| M3-03 | M3 | Validação aceita valores corretos após trim | `export function validarFormulario` | Título com espaços externos e conteúdo válido deve passar. | 5 | 0,5 |
| M3-04 | M3 | Validação rejeita título/descrição insuficientes | `export function validarFormulario` | Título ab e descrição curta devem falhar separadamente. | 5 | 0,5 |
| M3-05 | M3 | Título repetido após normalizar acento/caixa é inválido na mesma trilha | `export function validarFormulario` | Fotografia da PRACA duplica Fotografia da praça na mesma trilha. | 5 | 0,5 |
| M3-06 | M3 | Inserção cria novo array sem mutar a fonte | `export function inserirImutavel` | Insira m-05; origem não deve mudar e novo item deve ficar no fim. | 5 | 0,5 |
| M4-01 | M4 | Idempotência: repetir toque/ID não duplica | `export function inserirImutavel` | Envie duas vezes x-2 e confira apenas um registro. | 5 | 0,5 |
| M4-02 | M4 | Resumo conta total e IDs sem perda | `export function resumir` | Quatro itens esperados e a ordem dos quatro IDs. | 5 | 0,5 |
| M4-03 | M4 | Resumo contabiliza categorias corretamente | `export function resumir` | Lugar=2, Evento=1, Indicador=1. | 5 | 0,5 |
| M4-04 | M4 | Resumo de base vazia é seguro | `export function resumir` | Resumo [] deve ser total 0, ids [] e categorias {}. | 5 | 0,5 |
| M4-05 | M4 | Resumo não modifica nem reordena a fonte | `export function resumir` | Executar resumo não pode alterar ou reordenar a fonte. | 5 | 0,5 |

## Evidências e limites

- `tests/aula08-v4-*`: contrato único, starter, referência de QA e regressões.
- `tests/aula08-live-v4-browser.cjs`: compilação real TSX, interação e 20 critérios no Chromium.
- `tests/independent-aula08-v4-browser.cjs`: segurança, acessibilidade e exportações em revisão separada.
- `tests/mobile-aula08-v4-backend.test.cjs` e `tests/independent-aula08-v4-backend.test.cjs`: nenhum XP autodeclarado vira nota institucional.
- CI gera resultados e SHA exato em artifacts. Arquivo de requisitos não é comprovante de execução.
- Aplicação nativa Android/iOS e leitor de tela humano: registrar separadamente; React Native Web não é emulador nativo.
