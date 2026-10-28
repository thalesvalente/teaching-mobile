# Aula 08 — Acessibilidade e limites da verificação

A experiência didática está nas cinco páginas HTML: visão geral, preparação, missões, Gemini e entrega. A navegação tem mesma ordem, indicação da página atual, link para pular conteúdo e próxima etapa. Critérios e prompts usam details/summary nativos. Os 22 passos são consultáveis sem preencher marcações.

A identificação solicita equipe e até quatro participantes, nunca nome–slot. Erros têm texto por campo, aria-describedby e aria-invalid, incluindo ausência, nome curto, fórmula, caractere inválido e duplicação normalizada. O botão explica o impedimento; uma submissão inválida encaminha o foco ao campo correspondente. Mensagens de estado usam aria-live. Cor não é a única indicação.

A revisão automatizada passa a executar axe, overflow e foco/teclado **dentro** de cada combinação das cinco páginas, cinco larguras (320/375/768/1024/1440) e duas alturas (812/375), além de estados expandidos, identificação inválida, política pendente, recibo, erro e offline. Os registros de cada amostra ficam em accessibility-matrix.json. As combinações são viewports simulados, não aparelhos reais nem prova de todas as orientações físicas.

A qualificação anterior à integração registrou 67 amostras e 15 cenários de navegador. A candidata final precisa ser vinculada ao SHA e logs da própria CI; não reutilizar uma contagem como prova de outro código.

## Imagens e equivalência

Os originais são preservados byte a byte e possuem hashes em assets/originais.sha256. Estão disponíveis na conversa; a publicação binária remota permanece pendente. Os textos antes das figuras explicam que as imagens são referências históricas com diferenças de Expo, arquivos, aplicativo, nota individual e exemplo 9,2/10. O roteiro atual é Web, coletivo e usa incrementos de 0,5. A contextualização aguarda decisão docente. Alternativas textuais e ampliação não dispensam conferir a imagem publicada.

## Limites

Nenhuma execução de axe é certificação WCAG/eMAG. Leitor de tela operado por pessoa, testes com estudantes e avaliação em aparelhos físicos são NOT_EXECUTED enquanto não houver evidência própria. Não afirmar que um teste de foco após a skip-link cobre toda a navegação possível.

O PDF gerado é um registro visual/textual, não declarado PDF/UA. O motor tem conjunto limitado de caracteres; quando necessário, a ficha oferece impressão local sem simular confirmação. PDF local, feedback de teste e caixas de progresso não equivalem a entrega.

Sem rede, o projeto baixado pode ser editado e testado. O recibo exige servidor homologado. Os estados de erro e política pendente precisam permanecer distinguíveis de sucesso. O armazenamento do progresso contém apenas IDs de passos, não nomes ou nota.
