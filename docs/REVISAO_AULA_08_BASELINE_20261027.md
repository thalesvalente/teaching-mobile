# Aula 08 — baseline e execução independente

Missão: `MOBILE-A08-LAB-VIVO-AV1-IMPLEMENT-01`.

## Identidade e ownership

Revisor nativo real: `/root/qa`, frente E. Worktree exclusiva `a08-qa`, branch `work/a08-qa-20261027`. O revisor não implementou arquivos de produção, não alterou testes herdados e não publicou no GitHub. Seu ownership limita-se a `docs/REVISAO_AULA_08_*.md` e `docs/AULA08_ADVERSARIAL_QA.md`. Correções são encaminhadas ao proprietário.

## Baseline observado antes de alterações

| Item | SHA |
|---|---|
| `main` / commit de entrada | `a0ac0749ece9805833c4f34d31c07db76032fe6b` |
| Árvore completa | `e5911d0e7f07eade62ef7c8ea293725a2f8e905b` |
| Aula 06 | `68930e4655bdc3e4fe3f8737dd16d0ac35cbf60a` |
| Aula 07 | `ea1c6a25e773dff3a224a42b8b101e14196447d4` |

`git status --short` estava vazio nesta worktree. A coleta foi feita em 27/10/2026. Nenhum SHA antigo foi presumido.

## Testes existentes executados

| Comando | Resultado observado |
|---|---|
| `node --test tests/pontuacao-aulas.test.cjs tests/avaliador-projeto.test.mjs tests/mobile-entregas.test.cjs` | exit 0; 3 arquivos PASS |
| `node tests/pontuacao-aulas.test.cjs` | 26/26 PASS |
| `node tests/avaliador-projeto.test.mjs` | 5/5 PASS |
| `node tests/mobile-entregas.test.cjs` | 15/15 PASS |
| `node tests/mobile-entrega-browser.cjs` | 9/9 fluxos PASS em Chromium real |
| `node tests/navegadores-aulas.cjs` com `QA_ENGINES=chromium` | 24/24 combinações da matriz; 4/4 fluxos PASS; zero falhas reportadas |

Total unitário da baseline: 46 verificações. As 3 entradas exibidas pelo comando combinado são arquivos, não três asserts. PDF, reenvio, recusa, hash adulterado, contingência sem endpoint, foco, responsividade e axe-core foram exercitados pelos testes de navegador existentes. Firefox e WebKit não foram executados nesta sessão; os resultados não são extrapolados para esses motores.

## Ambiente e reprodução dos testes de navegador

- Node.js `v24.22.1`.
- Playwright `1.57.0`, axe-core `4.10.3` instalados em diretório temporário isolado.
- Chromium real `153.0.8010.0`, distribuição `@sparticuz/chromium@153.0.0` obtida pelo npm.
- O download padrão do Chromium pelo CDN do Playwright retornou arquivos inválidos/erro HTTP. A distribuição alternativa foi extraída e a versão executada foi conferida.
- Argumentos adicionais limitados a `--no-sandbox` e `--disable-dev-shm-usage`. Não foram usados argumentos que desabilitam a segurança de origem, CSP ou isolamento de sites.
- O executor exigiu execução escalada para permitir as chamadas de sistema do navegador. Isso não alterou a configuração do produto nem o sandbox da Aula 08.
- Para o teste legado sem opção de executável, um preload temporário adaptou somente `chromium.launch` para o executável disponível. Os arquivos Git permaneceram intactos.
- O teste `navegadores-aulas.cjs` foi servido por HTTP local. O transporte de submissões da Aula 07 foi interceptado pelo mock já existente no seu teste. Nenhum nome real, registro ou envio foi feito ao Google.

Reprodução em um ambiente com Chromium padrão do Playwright instalado: instalar as versões de QA, executar os comandos da tabela e configurar `AULAS_URL` para o servidor estático local. O runner geral aceita `QA_PLAYWRIGHT`, `QA_AXE`, `QA_CHROMIUM`, `QA_ENGINES` e `QA_OUTPUT_DIR`.

## Bloqueios materiais conhecidos

Os dois PNGs obrigatórios não estão disponíveis nos caminhos fornecidos no prompt. Esta revisão não criou, regenerou ou substituiu as imagens. G1 continua dependente dos originais. A revisão simulada não equivale a implantação Apps Script, escrita no Google Sheets ou homologação real; G10 requer evidência própria.
