# QA da Aula 08 avançada v3 - 11/11/2026

## Resumo

**STATUS: CANDIDATE_REVIEW_ONLY.** Evidências reunidas nesta execução, sem certificação do Expo nativo ou homologação institucional.

## Testes realizados

| Gate | Resultado | Escopo |
|---|---|---|
| Avaliador Node no starter | PASS | 20 cenários executados: 0/20 e 0,0/10 antes de implementar |
| Avaliador Node na solução de referência descartável | PASS | 20/20 e 10,0/10 sem alterar os testes (gabarito não incluído) |
| Node `--check` | PASS | `aula.js`, `scripts/avaliar.mjs` |
| Sintaxe TypeScript/TSX | PASS com ressalva | Seis arquivos do app transpilados sem erro sintático; **não houve typecheck completo** porque dependências Expo não foram instaladas |
| Browser headless local (HTML+CSS+JS em memória) | PASS | Larguras 360, 390, 768, 1024, 1440 px: sem erro JavaScript e sem rolagem horizontal |
| Diagnóstico interativo | PASS | 8 respostas corretas → 100 XP; mudança de cenário, feedback e pontuação calculados |
| Exportação JSON | PASS | Download de `aula08_progresso_v3.json` |
| Exportação/impressão PDF | PASS | PDF A4 gerado e texto extraído (sem certificação PDF/UA) |
| Guia do aluno | PASS | PDF A4 de 5 páginas; a tabela de 20 critérios foi renderizada e inspecionada visualmente |
| Publicação no GitHub | PASS revisão | Branch criada com código-fonte, sem merge/Pages; sete arquivos conferidos byte a byte com o manifesto de origem |

## Pendências de aceite

- [ ] `npm install`, `npm run typecheck` e inicialização real do Expo com as versões pinadas.
- [ ] Fluxo E2E nativo em Android/iOS; dois toques, retorno, teclado virtual, falhas e identidade.
- [ ] Acessibilidade com tecnologias assistivas e pessoas usuárias; WCAG 2.2 AA não certificada.
- [ ] Teste integrado do PDF e do pacote de entrega no ambiente da escola.
- [ ] Geração/versionamento de `package-lock.json` e CI do aplicativo nativo.
- [ ] Aprovação docente dos critérios v3 e novo contrato seguro antes de qualquer envio oficial.
- [ ] Revisão independente por outra pessoa/agente (não simulada como executada).

## Decisões e trade-offs

Preservou-se a PR #4 e seu contrato v2 sem mesclar a candidata v3. A avaliação do código é formativa e local; não fabrica nota oficial. Não se antecipou API REST/persistência, pois o objetivo é elevar a complexidade dos conteúdos anteriores, reservando integração remota para a progressão curricular.

O app é Expo real (com projeto e telas RN), mas os testes aqui confirmaram apenas lógica JS pura e sintaxe TSX. A experiência em celular **ainda não** foi executada nem homologada.