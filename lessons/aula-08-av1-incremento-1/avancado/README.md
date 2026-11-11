# Aula 08 - Operação Dados sob Pressão · Candidata avançada v3

Disciplina: Programação para Dispositivos Móveis, IFMA Campus Itapecuru-Mirim.

## Abra a aula

- `index.html`: aula interativa (usa `style.css` e `aula.js` da mesma pasta).
- `Aula08_Desafio_Avancado_Interativa.html`: versão autônoma de um único arquivo (incluída no ZIP na raiz).
- `Aula08_Desafio_Avancado_Guia_Aluno.pdf`: roteiro A4 para impressão (incluído no ZIP na raiz).
- `projeto/`: aplicativo real React Native + Expo Router com seis TODOs e 20 testes de funções.
- `docs/ROTEIRO_DOCENTE.md`: cronograma de 100 minutos, rubrica, política e gates.

O HTML interativo não requer internet, servidor ou dependências. O projeto Expo necessita instalar as dependências para executar a interface no dispositivo.

## Primeira execução do projeto

```bash
cd projeto
npm run nota     # testa os TODOs: o starter começa com 0/20
npm install      # instala o stack Expo; gera package-lock.json
npm start        # Expo; abra o projeto em um dispositivo compatível
npm run typecheck
npm run nota
npm run entrega  # cria pacote apenas formativo, sem Google Sheets
```

**Não há pacote APK, instalação validada ou distribuição oficial.** Por padrão o motor está incompleto, para que os estudantes implementem as funções. O código de referência usado exclusivamente nos testes de QA não está incluído no material de aluno.

## Estado e limites

- Branch de revisão: `feat/aula08-desafio-avancado-v3-20261111` no repositório `thalesvalente/teaching-mobile`.
- Publicação no Pages: **não realizada**. Merge: **não realizado**.
- Contrato `mobile-a08-avancado-formativo-v3` é deliberadamente diferente do endpoint oficial v2 da PR #4.
- Nenhum lançamento de notas, integração real com Google Sheets, implantação ou operação de envio foi realizado.
- Necessita revisão/homologação pedagógica, verificação em Android/iOS e avaliação humana de acessibilidade antes de liberação oficial.