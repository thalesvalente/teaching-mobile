# Acessibilidade e leitura da Aula 08

## Recursos da interface

- Leitura vertical em todas as larguras, sem reduzir uma página inteira a um slide.
- Link “Pular para o conteúdo/ficha” no início; navegação e ações por teclado.
- Foco com contorno visível; alvos de toque com pelo menos 44 px, botões principais com 48 px ou mais.
- Rótulos associados a todos os campos e nomes explícitos para os slots.
- Progresso, importação e resultado em regiões `role=status`, `aria-live=polite` e `aria-atomic=true`.
- Critérios com as palavras “Aprovado” e “Pendente”; cor nunca é o único sinal.
- Diálogo de ampliação com botão Fechar, suporte a Escape e retorno de foco nativo.
- Respeito a `prefers-reduced-motion` e cores forçadas; nenhuma animação obrigatória.
- Erros sem descarte silencioso do trabalho; PDF e impressão locais independentes do recebimento online.

O relatório final de QA registra os testes efetivamente executados, larguras e limitações. Esta lista descreve recursos implementados, não uma certificação automática de conformidade integral.

## Textos equivalentes aos infográficos

### Mapa dos quatro marcos

M1, portfólio e preparação, tem cinco critérios de 0,5 e totaliza 2,5 pontos. M2, funções essenciais, tem quatro critérios e totaliza 2 pontos. M3, integração do Incremento 1, tem seis critérios e totaliza 3 pontos. M4, desafio individual e entrega, tem cinco critérios e totaliza 2,5 pontos por integrante. O total é 10. I1 é M1; I2 é M4; I3 é M2 + M3. Entregar o trabalho faz parte de M4.

Texto alternativo: “Quatro marcos da AV1: portfólio 2,5; funções essenciais 2; integração 3; desafio individual 2,5. Total de 10 pontos.”

### Fluxo do aluno

Abra a aula e prepare o projeto. Programe no VS Code com apoio do Gemini no navegador. Execute `npm run nota` para ver testes formativos. Execute `npm run entrega` para gerar `entrega-a08.jsonl`. Importe o arquivo na ficha e clique em “Verificar, gerar PDF e entregar”. Guarde o PDF e o recibo válido. Sem recibo, o envio não está confirmado.

Texto alternativo: “Fluxo do aluno: abrir a aula, programar com o Gemini como tutor, testar, gerar o JSONL, importar na ficha e guardar PDF e recibo.”

## Estado dos arquivos originais

Os dois PNGs solicitados não estavam disponíveis nesta execução. Nenhuma substituição foi gerada. As páginas mostram o percurso textual enquanto aguardam os originais e só habilitam ampliação depois de carregarem uma imagem válida. G1 permanece bloqueado.

## Verificação do professor

Conferir 320, 375, 768, 1024 e 1440 px, retrato e paisagem, zoom 200%, Tab/Shift+Tab/Enter/Escape, leitor de tela, contraste e impressão A4. Axe automatizado não substitui leitura humana, teste com tecnologia assistiva nem avaliação da compreensão dos estudantes. Imagens originais exigem revisão visual quando incorporadas.

O PDF vetorial preserva acentos portugueses e possui texto extraível. Caracteres fora da fonte padrão acionam orientação para impressão local, sem produzir hash ou confirmação fictícia. A versão HTML imprimível usa as fontes do navegador. O PDF não é declarado PDF/UA; a ficha HTML e a impressão oferecem alternativa textual.
