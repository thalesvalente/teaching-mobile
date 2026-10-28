# Aula 08 — decisão docente: avaliação exclusivamente por equipe

Data: 27/10/2026. Natureza: alteração de regra de avaliação solicitada pelo docente, posterior à implementação inicial da Aula 08.

## Decisão

**Uma entrega = uma equipe = uma nota de 0,0 a 10,0.** O estudante informa apenas nome da equipe e nomes dos participantes (de um a quatro). Não existe campo de nome ↔ slot. Os números 1–4 dos arquivos `src/individual/alunoN.mjs` são identificadores de tarefas técnicas e podem ser resolvidos colaborativamente.

Há 20 critérios de 0,5:
- M1: cinco critérios de preparação (até 2,5);
- M2: quatro critérios de funções (até 2,0);
- M3: seis critérios de integração (até 3,0);
- M4: cinco critérios da equipe (até 2,5). Um critério M4 é aprovado quando todos os arquivos de tarefa incluídos no pacote passam seus respectivos casos. Se um arquivo falhar, o critério vale 0 para toda a equipe.

O resultado tem a forma `evaluation:{rubric,team,m1,m2,m3,m4,total,criteria}`. Não há `evaluation.members` ou nota por slot. O recibo HMAC assina `members:[{name},...]` e `evaluation`, além dos hashes, equipe e ID do desafio. O servidor devolve verificação e grava o **mesmo total da equipe** em cada linha correspondente aos participantes, preservando o formato histórico da planilha (uma linha por estudante) e as 17 colunas de auditoria.

## Mudanças verificáveis

- **Ficha** `atividade.html` e `atividade.js`: equipe e participantes (sem slots); só uma nota, um PDF e um recibo para o grupo.
- **Browser/contrato** `entrega-appscript.js`: resultado coletivo validado contra 20 critérios e recibo vinculado ao resultado e aos nomes.
- **Servidor** `RubricaAula08.gs`: referência pura e critérios M4 agregados por todas as tarefas incluídas. `Code.gs` registra rubrica `mobile-a08-lab-vivo-1.1.0`.
- **Projeto** `avaliacao-local.mjs`, `avaliar.mjs`, `contrato.mjs`: nota formativa única, critérios de M4 coletivos e JSONL coerente.
- **PDF** `pdf.js`: capa, seções e resultados coletivos; nomes listados sem distribuição de pontos individuais.
- **Documentação** da aula, missões e implantação: sem instruções que façam aluno associar seu nome a um arquivo.

## Limites e implantação

A mudança de rubrica é incompatível com JSONL e recibos gerados antes da revisão. **Baixe a branch atualizada e execute novamente `npm run entrega`**; não edite o JSONL manualmente. A implantação Apps Script antiga não foi atualizada automaticamente pela PR, portanto a entrega oficial continua dependendo de homologação real (G10 `PENDING_LIVE_E2E`). Os infográficos originais ainda não foram incorporados à branch (G1 pendente).

Nenhuma senha, nome real, nota ou registro de planilha real foi usado para testar a mudança. As regressões das Aulas 06 e 07 devem continuar passando. As evidências e pareceres produzidos para a rubrica antiga são históricos; não demonstram a conformidade da versão 1.1.0. Para a alteração coletiva, usar as verificações da CI vinculadas ao novo HEAD.

## Aceite

- [x] Ficha solicita apenas nomes e equipe; sem identificação por slot
- [x] Servidor calcula um conjunto de 20 critérios e nota coletiva
- [x] Recibo autentica equipe, nomes, avaliação e hashes
- [x] Planilha simulada recebe o mesmo valor para cada participante
- [x] A07 preservada no código e nas regressões
- [ ] Publicar os PNGs originais no GitHub (G1)
- [ ] Implantar Apps Script e verificar planilha real com equipe fictícia e limpeza (G10)
