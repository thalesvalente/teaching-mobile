# Aula 08 — parecer independente final

## Conclusão

**A candidata passa nos gates técnicos exercitados e no QA adversarial; a missão permanece parcialmente bloqueada pela falta dos dois infográficos originais.** Nenhum finding CRITICAL ou HIGH permanece aberto. Os findings de código MEDIUM reproduzidos foram corrigidos e revalidados. A implantação Apps Script e o E2E real com Sheets não foram executados nesta sessão.

O estado terminal recomendado para a missão é **`A08_LAB_VIVO_PARTIAL_BLOCKED`**. Não há base para `A08_LAB_VIVO_READY_FOR_HOMOLOGATION` enquanto G1 não for PASS, mesmo com os demais resultados técnicos favoráveis.

## Candidata revisada

| Item | Evidência |
|---|---|
| Repositório único | `thalesvalente/teaching-mobile` |
| Branch integradora | `feat/aula-08-laboratorio-vivo-av1-20261027` |
| Baseline `main` | `a0ac0749ece9805833c4f34d31c07db76032fe6b` |
| Árvore baseline | `e5911d0e7f07eade62ef7c8ea293725a2f8e905b` |
| Código e testes integrados revisados | `b5de67bf8db0c4904212b8ad887f4dc9da261a4d` |
| Árvore do código revisado | `46d46cb27f6260525b43b2f2628e0a5e88c0b533` |
| Árvore do starter | `670741616d0c7e3d01dec8eb092300a5657fccb0` |
| Revisor | Agente nativo real `/root/qa`, frente E, worktree exclusiva |

A revisão foi fechada em 27/10/2026. O revisor obteve uma cópia Git da candidata congelada em sua própria worktree e apenas acrescentou documentação. A árvore do starter corresponde exatamente ao snapshot B usado nos testes de comandos e adulteração. Não houve autoria cruzada de produção ou alteração silenciosa de outro proprietário.

## Verificações da candidata integrada

| Verificação executada por E | Resultado |
|---|---|
| `node tests/aula08-pages.test.cjs` | 6/6 PASS |
| `node --test tests/aula08-local.test.mjs tests/aula08-jsonl.test.mjs tests/mobile-entregas-aula08.test.cjs tests/mobile-entregas.test.cjs tests/pontuacao-aulas.test.cjs tests/avaliador-projeto.test.mjs` | 95/95 PASS |
| `node tests/aula08-browser.cjs` em Chromium real, endpoint interceptado e mesmo Apps Script em VM | 13/13 fluxos PASS; zero erro de página; zero requisição externa escapou do mock |
| Harnesses próprios JSONL/servidor/sandbox/transporte | 51 verificações PASS: 13 + 16 + 14 + 8 |
| Matriz independente de páginas com axe e overflow | 20/20 combinações PASS; duas páginas, cinco larguras, retrato/paisagem |
| `npm ci`, `npm run preflight`, `npm run nota`, `npm run entrega` | exit 0 em snapshot de árvore idêntica ao starter integrado |
| `npm run web` na candidata congelada | Servidor iniciou; GET local retornou HTTP 200 e HTML da Aula 08; encerrado pelo revisor com Ctrl+C |
| `node tests/aula08-assets.cjs` | exit 2, `BLOCKED G1`: dois PNGs originais ausentes |
| Regressão browser preexistente A07 | 9/9 PASS na baseline; frontend herdado byte a byte preservado na candidata |
| Matriz preexistente A06/A07 | 24/24 combinações e 4/4 fluxos PASS em Chromium na baseline; páginas herdadas preservadas |

Total unitário/contratos integrado: **101 verificações**, sem falhas. As 51 verificações dos harnesses próprios são adicionais e possuem granularidade diferente dos 13 fluxos E2E; esses números não devem ser somados como se fossem testes uniformes de uma única suíte.

Para o E2E integrado foram configurados `NODE_PATH`, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` e `AULA08_EVIDENCE_DIR` apenas no processo de teste. Chromium `153.0.8010.0`, Playwright `1.57.0` e axe-core `4.10.3`. Não foram usados flags que desabilitam a segurança de origem/CSP do navegador. O executor exigiu escalada para as chamadas de sistema e bind localhost do teste; isso não mudou o sandbox do produto.

## Matriz de gates

| Gate | Parecer E | Evidência e limite |
|---|---|---|
| G0 — Baseline | PASS | SHA, árvore, subárvores e 46 verificações anteriores registrados em documento próprio. |
| G1 — Conteúdo e imagens | BLOCKED | Textos, quatro marcos e alternativas existem; os dois PNGs originais estão ausentes. |
| G2 — Projeto local | PASS | Comandos, starter funcional com pendências reais e servidor HTTP local verificados. |
| G3 — JSONL | PASS | Determinismo, allowlist, limites, fontes e pacote SHA-256, schema estrito e 13 ataques próprios. |
| G4 — Verificador | PASS | Código puro realmente executado em worker isolado, CSP sem rede, deadlines e saídas JSON estritas. |
| G5 — Apps Script | PASS, simulado | 20 critérios de 0,5, referência no servidor, notas por integrante, nenhuma confiança na nota local. |
| G6 — Planilha simulada | PASS | Upsert, média, conflito de equipe, auditoria 17 colunas, hash, HMAC, concorrência e falha parcial testados. |
| G7 — Browser E2E | PASS, simulado | Fluxo completo em Chromium: JSONL → desafio → worker → servidor → PDF → recibo. |
| G8 — QA adversarial | PASS | 20 ataques mínimos cobertos; nenhum CRITICAL/HIGH aberto; findings de código corrigidos. |
| G9 — Portal e links | PASS para conteúdo | README/portal apontam para A08 e links relativos efetivos passaram. A publicação Git/PR é conferida pelo coordenador; este agente não fez push. |
| G10 — E2E real | `PENDING_LIVE_E2E` | Sem implantação/POST/escrita real/reenvio/remoção de registros fictícios demonstrados. |

## Preservação das aulas anteriores

O diff Git da baseline para a candidata, limitado às Aulas 06/07 e aos testes herdados, apresentou somente:

```text
M lessons/aula-07-estado-filtros/appscript/Code.gs
A lessons/aula-07-estado-filtros/appscript/RubricaAula08.gs
```

O adaptador `Code.gs` é a alteração autorizada. A rubrica, as páginas, os scripts, o projeto da Aula 07 e toda a Aula 06 permaneceram intactos. Os testes anteriores não foram afrouxados para acomodar a nova aula.

## Findings e limites

A [matriz adversarial](AULA08_ADVERSARIAL_QA.md) registra os 20 ataques e a reprodução/correção de cada finding. O HIGH de compatibilidade do worker foi corrigido antes do congelamento. Também foram corrigidos origem HtmlService, cobertura de formulário válido, saída NaN/Infinity e validações/limpeza do transporte.

**Aberto:** falta dos dois PNGs, severidade MEDIUM como bloqueio de entrada e motivo de G1 não passar. Não foi criada imagem substituta. **Pendência operacional:** G10; não equivale a um teste simulado falhando, mas não autoriza declarar implantação ou entrega real.

O HMAC autentica recibos/desafios no servidor. SHA-256 detecta alterações dos bytes quando comparado com o vínculo esperado. Esses mecanismos não demonstram autoria, ausência de ajuda, execução honesta de um cliente malicioso nem uso físico de celular. M1 possui evidências declaradas. Em falha multirange do Sheets pode haver escrita parcial; a implementação não emite confirmação e orienta conferência docente antes de novo envio.

Este agente não criou nem removeu linhas na planilha real. A revisão de PDF dos arquivos completos e a publicação final ficam registradas pelo coordenador em seu handoff. A revisão independente confirma o fluxo real de geração/hash/download no teste de navegador, sem atribuir a isso implantação Google.
