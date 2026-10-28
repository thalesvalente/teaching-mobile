# Evidências da Aula 08

**QA SINTÉTICO — NÃO É UMA ENTREGA REAL NO GOOGLE.** As capturas de recibo e o PDF usam equipe/integrantes fictícios e Apps Script da candidata executado em VM, com Sheets e transporte simulados. Nenhum POST de entrega escapou para o Google, conforme o resultado do navegador. Não use esses arquivos como comprovante de nota lançada.

Código/testes exercitados: commit local `b5de67bf8db0c4904212b8ad887f4dc9da261a4d`, equivalente publicado `bcb1fa2663d18e1f9ec8814373a11ff6fd486ef0`, ambos com árvore `46d46cb27f6260525b43b2f2628e0a5e88c0b533`. A captura do starter foi produzida pela frente B; a subárvore do projeto foi preservada na integração. O [mapa de publicação](publicacao.json) conserva a proveniência dos commits.

## Arquivos

| Artefato | O que demonstra |
|---|---|
| [Resumo dos comandos](comandos/summary.json) | Comando, diretório relativo, exit code, contagem e arquivo de log |
| [00.log](comandos/00.log), [01.log](comandos/01.log), [02.log](comandos/02.log), [03.log](comandos/03.log) | `npm ci`, preflight, nota formativa e geração JSONL |
| [04.log](comandos/04.log), [05.log](comandos/05.log), [06.log](comandos/06.log) | Local 9, JSONL 16 e páginas 6: 31 verificações |
| [07.log](comandos/07.log) | Apps Script A08: 24 verificações |
| [08.log](comandos/08.log), [09.log](comandos/09.log), [10.log](comandos/10.log) | Regressões Mobile 15, pontuação 26 e avaliador 5: 46 verificações |
| [Resultado do browser](browser-results.json) | 13 cenários, Chromium usado, ausência de pageErrors/pedidos externos e bloqueios declarados |
| [Introdução em 375 px](aula08-375.png) | Página completa, quatro marcos, navegação e aviso honesto dos originais ausentes |
| [Recibo simulado em 375 px](ficha08-recibo-simulado-375.png) | Estado final do E2E simulado com nomes fictícios; não atesta Sheets real |
| [Starter em 375 px](starter-375.png) | Aplicativo local responsivo |
| [PDF de exemplo sintético](exemplo-qa-aula08.pdf) | Sete páginas A4, critérios/notas individuais, hashes e estado anterior ao recibo |
| [Manifesto SHA-256](manifesto.json) | Integridade dos arquivos de evidência listados; não prova autoria nem implantação |
| [Equivalência Git](publicacao.json) | Commit integrado → publicado → árvore idêntica |

O PDF foi gerado antes do envio simulado e conserva o estado de recibo pendente. Essa ordem permite assinar o hash dos bytes originais sem reescrevê-los depois. O recibo separado é validado pelo servidor no E2E. O hash SHA-256 do PDF de exemplo é `43f741acd79c43ea5914ec003ebc089df2b6e2f37c272852973ba8b8d94a4924`.

O coordenador inspecionou visualmente as sete páginas renderizadas, sem cortes ou sobreposições. Os acentos foram preservados e nenhum texto extrapolou as margens na verificação realizada. O PDF não é declarado PDF/UA. A origem das capturas e os hashes não mudam o caráter simulado dessas evidências.

## Leitura dos resultados

São **101 verificações unitárias/de contrato**, **13 cenários de browser** e **51 verificações adicionais independentes**. Não somar essas granularidades como uma única suíte. O [parecer E](../REVISAO_AULA_08_FINAL_20261027.md) descreve os harnesses próprios e as 20 combinações de viewport/orientação. O [relatório integrador](../ENTREGA_AULA08_20261027.md) apresenta a matriz completa de requisitos e os gates.

**G1 BLOCKED:** os dois infográficos originais continuam ausentes. As screenshots mostram a alternativa textual/aviso; não substituem os originais. **G10 PENDING_LIVE_E2E:** implantação, notas reais, reenvio e limpeza no Google ainda não foram demonstrados.

Os logs são resultados observados em 27/10/2026, com Node 24.22.1 e npm 11.9.0. O browser foi Chromium 153.0.8010.0, usando Playwright 1.57.0 e axe-core 4.10.3. Nenhuma flag desativou a segurança de origem ou CSP do navegador. Para reproduzir em outro ambiente, seguir o workflow versionado e os guias da aula.
