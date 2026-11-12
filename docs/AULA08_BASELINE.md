# Aula 08 - baseline e coordenação

Missão: `MOBILE-A08-LAB-VIVO-AV1-IMPLEMENT-01`.

Registro de leitura anterior à implementação em 27/10/2026:

| Objeto | SHA Git |
|---|---|
| `main` | `a0ac0749ece9805833c4f34d31c07db76032fe6b` |
| Árvore de `main` | `e5911d0e7f07eade62ef7c8ea293725a2f8e905b` |
| Subárvore Aula 06 | `68930e4655bdc3e4fe3f8737dd16d0ac35cbf60a` |
| Subárvore Aula 07 | `ea1c6a25e773dff3a224a42b8b101e14196447d4` |
| `appscript/Code.gs` | `e72317d98159990fd588132886687005acab69ef` |
| `appscript/RubricaAula07.gs` | `b6d37759cf6c8748fce6043a870c9e1ab8d3fd23` |

O conector GitHub e o clone concordaram no SHA e na árvore. A branch de destino ainda não existia. O clone inicial usou `--no-checkout`; os arquivos ausentes naquele estado eram apenas a árvore de trabalho ainda não materializada. Após checkout, a árvore estava limpa. Nenhum conteúdo das Aulas 06/07 foi apagado.

Baseline executada pelo QA independente: `pontuacao-aulas.test.cjs` 26 PASS; `avaliador-projeto.test.mjs` 5 PASS; `mobile-entregas.test.cjs` 15 PASS. Total: 46 verificações, sem falhas.

## Delegações reais

Há três slots nativos de subagentes além do coordenador. Foram abertos três agentes, cada qual com worktree e branch próprias, todos a partir da baseline acima.

| Responsável | Frente | Branch local | Ownership | Gate |
|---|---|---|---|---|
| Coordenador `/root` | A + C + integração | `feat/aula-08-laboratorio-vivo-av1-20261027` | conteúdo, páginas, sandbox, PDF, portal, globais e integração | conteúdo, browser, links e integração |
| `/root/local` | B | `work/a08-local-20261027` | projeto e testes `aula08-local*`/`aula08-jsonl*` | comandos locais, determinismo, contrato |
| `/root/server` | D | `work/a08-server-20261027` | `Code.gs`, `RubricaAula08.gs`, integração Sheets e testes específicos | rubrica, transporte, regressão A07 |
| `/root/qa` | E independente | `work/a08-qa-20261027` | pareceres em `docs/`; produção somente leitura | ataques, regressão, findings |

Os agentes não editam a mesma worktree. Alterações são integradas pelo coordenador por commits, sem force push ou merge para main. Os SHAs dos handoffs e resultados finais são registrados no relatório de entrega. QA independente não substitui testes nem homologação docente.

## Pendências de entrada

Os dois PNGs exigidos no prompt não foram anexados e `/mnt/data` não existe neste ambiente. Também não foram encontrados arquivos com os nomes exigidos no workspace. Nenhuma imagem foi regenerada ou substituída. A aula contém as descrições equivalentes e os pontos de inclusão; G1 permanece bloqueado enquanto os originais não forem fornecidos.

A atualização da implantação Apps Script e o E2E em Sheets precisam de acesso operacional ao projeto Google. Código e testes simulados são entregáveis independentes. Sem escrita real verificada, G10 permanece `PENDING_LIVE_E2E`.
