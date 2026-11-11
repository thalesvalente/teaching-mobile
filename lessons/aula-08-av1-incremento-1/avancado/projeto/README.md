# Aula 08 — Operação Dados sob Pressão (nível avançado)

**IFMA · Programação para Dispositivos Móveis · 3º ano · Candidata v3, NÃO HOMOLOGADA.**

## O que mudou em relação ao Laboratório Vivo de Web

A Aula 05 de Web ensina React/React Native Web com 14 exercícios guiados, código pronto e prévias. **Aqui o motor de dados está quebrado de propósito**: a equipe precisa inferir e implementar seis contratos, integrar o fluxo com Expo Router, diagnosticar casos-limite e defender as escolhas. O app usa duas trilhas fictícias (Memórias e Permanência). A arquitetura é React Native + Expo; a demonstração Web não substitui teste real no dispositivo.

## Início rápido

Pré-requisitos: Node 22.13+, npm, VS Code; Expo Go compatível com o SDK 57 no aparelho ou ambiente de desenvolvimento apropriado. As versões seguem a base da Aula 07 do repositório `thalesvalente/teaching-mobile`.

```bash
cd projeto
npm run nota              # sem instalar dependências: começa com pendências
npm install               # instala dependências fixadas; gera package-lock.json
npm run web               # conferir prévia, NÃO equivale a teste nativo
npm start                 # abra no aparelho com cliente compatível
npm run typecheck
npm run nota              # 20 critérios sobre o código REAL
npm run entrega           # pacote formativo de evidências
```

O ZIP não traz `node_modules` nem `package-lock.json`: `npm ci` NÃO funciona até o lockfile ser gerado e versionado. Para publicação em repositório, gere o lockfile com a instalação e valide em CI. Sem rede, o avaliador puro funciona imediatamente; a interface Expo requer dependências instaladas.

## Contrato técnico que deve ser implementado

Edite **somente** `src/engine.mjs` para as seis funções, sem alterar suas assinaturas; a interface usa exatamente esse módulo. Confira primeiro a interface preparada em `app/` e os dados em `src/dados.ts`. Não remova nem altere casos de teste para aumentar a nota.

- `estadoTela`: `erro` prevalece sobre `carregando`; em seguida `vazio` se fonte = 0; `sem-resultados` se recorte = 0; caso contrário `pronto`.
- `filtrarOrdenar`: busca insensível a caixa/acento e `trim`, categoria + período por AND, `ordem: az|za`, estável; **não muta** fonte, não recria IDs.
- `obterPorId`: IDs são strings opacas; ID desconhecido retorna **`null`** (não `undefined` nem primeiro item).
- `validarFormulario`: título de 5 a 60 caracteres, descrição de 10 a 180 depois de `trim`, categoria válida (`Lugar`, `Evento`, `Indicador`, `Ação`), período (`Manhã`, `Tarde`, `Noite`); título duplicado na mesma trilha deve ser recusado, ignorando caixa e acentos. Retorne `{ok, erros, valor?}` com mensagens por campo.
- `inserirImutavel`: inserir cria cópia da coleção, sem alterar argumentos; chamada repetida com o mesmo ID não duplica.
- `resumir`: `{total, porCategoria, ids}` em ordem de entrada, sem mutação.

## Experimento: concorrência e estados

O botão **Recarregar** simula um carregamento assíncrono e usa um identificador de requisição para descartar respostas atrasadas. O botão **Simular erro** força falha. Investigue o comportamento de tocar rapidamente várias vezes, alternar de trilha, filtrar e abrir detalhes. Explique a diferença entre estado da interface e estado da coleção.

## Quatro missões e avaliação

| Marco | Tempo | Desafio | Critérios | Peso |
|---|---:|---|---:|---:|
| M1 | 15 min | Máquina de estados e falhas | 5 | 2,5 |
| M2 | 25 min | Busca + filtros + imutabilidade | 4 | 2,0 |
| M3 | 35 min | Detalhe, formulário e inserção segura | 6 | 3,0 |
| M4 | 25 min | Idempotência, resumo e QA | 5 | 2,5 |
| **Total** | **100 min** | | **20** | **10,0** |

Cada critério vale 0,5 ponto; 5 XP. Os testes independentes usam dados fictícios; a nota local pode ser parcial. `npm test` termina com código diferente de zero até atingir 20/20, deliberadamente. O relatório fica em `entrega/resultado.html` (imprimível em PDF) e `entrega/resultado.json`, com SHA-256 do motor. `npm run entrega` gera pacote **formativo**, sem envio a servidor.

## Aceite de entrega (além dos testes puros)

Demonstre a aplicação no **aparelho** com o fluxo lista → detalhe → retorno com filtros → formulário válido e inválido → novo item visível. Teste dois toques, falha de leitura, recuperação, item inexistente, navegação por teclado quando aplicável e leitor de tela TalkBack/VoiceOver quando disponível. Registre resultado, dispositivo, sistema, commit, erros remanescentes e contribuição individual. Dados são totalmente fictícios.

**Não confunda as notas:** 100 XP do tutorial interativo, 0–10 do código e evidências em aparelho são instrumentos diferentes. Nenhum é nota institucional até aprovação docente e homologação do receptor. **NÃO enviar pacote v3 ao App Script da PR #4 (schema v2).**
