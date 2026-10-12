# QA — Aula 07 · versão 1.0.0

## Executado localmente

**Motor e apoio:** 45 asserções Node passaram: configuração correta e vazia nas duas trilhas; todas as opções defeituosas foram exercitadas individualmente e afetaram pelo menos uma verificação; fonte preservada ao filtrar/limpar; sintaxe dos três arquivos TS/TSX; execução das funções puras de filtro/resumo transpila­das de `modelo.ts`.

**Interface Chromium:** 28 slides carregados; índices, conceitos, código, revelação de respostas, consulta aos arquivos de referência, estado da busca, busca/categoria combinados, vazio, recuperação de falha, demonstração de fonte destrutiva e correção, inversão de ordem/identidade e gráfico EDA com período. Impressão/restauração conserva os estados. Navegação por teclado e foco de controles foram considerados na implementação; não foi realizado teste com leitor de tela real.

**Ficha:** adicionar identificação, percorrer quatro etapas, total de 10/10 com configuração correta, queda após mudança, correção e repetição sem acumulação, dicas apontando para slides existentes, mudança de projeto invalidando nota, reabertura JSON com nomes e evidências, rejeição de declaração nativa testada sem arquivos/teste e exportação real de PDF/JSON. Novas verificações ocorrem na exportação; campos de evidência não concedem pontos.

**Layout:** exame geométrico dos 28 slides, inclusive respostas reveladas, sem elementos de conteúdo fora da área principal. A rolagem fica dentro da prévia do app. Leitura vertical sem transbordamento horizontal em 320, 390 e 768 px; apresentação conferida em 1280, 1440 e 1920 px. Ficha verificada de 320 a 1440 px. Inspeção visual das telas de capa, filtro, FlatList e gráfico.

**PDF:** arquivo real gerado no Chromium, com três nomes fictícios acentuados e teste nativo explicitamente pendente. Seis páginas A4; extração preserva nomes e texto; nenhum bloco de texto fora da página. Capa e páginas internas renderizadas para inspeção. Fonte do PDF direto tem cobertura limitada; caracteres não suportados geram orientação para impressão alternativa em vez de adulterar a resposta.

## Limites

As rotas de navegação de teste local foram verificadas por análise dos arquivos; o navegador de QA recebeu HTML/CSS/JS locais em memória, sem depender de HTTP externo. Publicação e arquivos no GitHub Pages precisam ser verificados separadamente após o commit.

O simulador é HTML/JavaScript, não emulador nem execução de FlatList nativo. Não executamos Expo no Android/iOS nem teste de integração na baseline dos alunos. TSX foi validado sintaticamente; não foi declarado `typecheck` completo contra React Native instalado. As evidências nativas da equipe permanecem separadas da pontuação automática.

As versões anteriores da disciplina não fazem parte do escopo de alteração; somente o catálogo do portal/README recebe o novo acesso.
