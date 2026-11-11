# Roteiro docente — Aula 08 v3 (candidata avançada)

## Fundamentação e delimitação

A Aula 05 de Desenvolvimento Web (Laboratório Vivo v4) usa 14 missões guiadas, edita um componente React Native TSX já comentado e oferece duas prévias React Native Web. A Aula 07 de Mobile apresenta estado, filtros, FlatList, visualização de dados e avaliador formativo. A Aula 08 v2 em PR #4 utilizava um *starter Mobile Web*, sem Expo, e repetia operações familiares.

A v3 foi criada para tornar a AV1 um **desafio de integração, diagnóstico e evidência em ambiente Mobile real**, sem antecipar consumo de APIs REST ou persistência, previstos como conteúdos posteriores na proposta de sequência. O projeto é React Native + Expo Router, com funções quebradas deliberadamente.

## Objetivos observáveis

Ao término, uma equipe deve ser capaz de (1) descrever e corrigir a prioridade dos estados de uma interface; (2) filtrar e ordenar sem alterar dados-fonte; (3) controlar IDs e fluxos de tela; (4) validar e inserir sem duplicação; (5) executar testes de código com pontuação objetiva; (6) distinguir evidências automáticas de testes em aparelho e acessibilidade humana.

## Metodologia — 100 minutos

- **M1, 15 min:** ler o contrato, rodar `npm run nota` antes de instalar dependências, reproduzir erro/carregamento, corrigir `estadoTela` e justificar a prioridade.
- **M2, 25 min:** teste de entrada `PRACA`, categoria + período, ordenação Z-A, integridade do array e estabilidade de IDs.
- **M3, 35 min:** detalhe, ID inexistente, cadastro válido e inválido, título duplicado, inserção imutável, navegar e voltar sem limpar o filtro.
- **M4, 25 min:** dois toques rápidos, resumo, casos-limite, execução dos 20 testes, relatório PDF, evidências do dispositivo e defesa curta.

Para estudantes iniciantes com dificuldade, forneça *dicas graduais* após uma tentativa documentada, sem expor gabarito. Para estudantes avançados, desafio extra: implementar ordenação com desempate estável e analisar falhas de requisições assíncronas com cancelamento. Não criar nota adicional sem decisão pedagógica.

## Rubrica candidata

20 critérios de 0,5 = 10 pontos formativos; grupos M1 2,5, M2 2,0, M3 3,0, M4 2,5. O código é avaliado por `npm run nota`, os itens de dispositivo por observação de demonstração e a compreensão por defesa oral. O diagnóstico interativo de oito questões gera 100 XP próprios, **sem conversão automática** para nota oficial. Critérios e pesos devem ser aprovados antes da aplicação institucional.

## Gate de avaliação real

A versão v2 e a planilha da disciplina usam esquema `mobile-a08-v2`; esta entrega é `mobile-a08-avancado-formativo-v3`. **Não publicar, mesclar, reusar endpoint ou enviar nota automaticamente** sem revisão de rubrica, testes de integração do receptor Google, LGPD, acessibilidade, análise de fraude e homologação docente específica. Não copiar código-fonte ou IDs pessoais para repositório público sem autorização.

## Checklist independente

- [ ] Os 20 testes identificados executam funções reais, sem pontuação por autodeclaração.
- [ ] O starter e o gabarito de referência atingem respectivamente nota parcial inicial e 20/20, sem modificar testes.
- [ ] O Expo inicia e o fluxo completo é exercitado em aparelho de teste.
- [ ] ID inválido, erro, carregamento, sem resultados e dois toques são testados.
- [ ] HTML funciona em 360, 390, 768 e 1440 px, teclado, zoom e contraste.
- [ ] Usabilidade com leitor de tela é avaliada com pessoa/tecnologia assistiva.
- [ ] A avaliação v3 nunca contamina a planilha/endpoint v2; reenvio e recibo aguardam novo contrato.
- [ ] Todo artefato demonstra claramente que não está homologado como nota oficial.
