# 📱 Programação para Dispositivos Móveis

Disciplina do **3º ano do Curso Técnico em Informática Integrado ao Ensino Médio — IFMA Campus Itapecuru-Mirim**.

**Professor:** Prof. Dr. Thales Levi Azevedo Valente  
**Período:** 2026.2  
**Portal:** https://thalesvalente.github.io/teaching-mobile/

## Aulas publicadas

| Aula | Tema | Material |
|---|---|---|
| 04 | TypeScript e componentes React Native | [PDF](lessons/2/typeScript-components-react-native.pdf) |
| 05 | Interface móvel e acessibilidade | [PDF](lessons/3/slides-Interface%20e%20acessibilidade.pdf) |
| 06 | Navegação e formulários — De tela em tela: navegar, voltar e cadastrar | [Aula interativa original · 50 min](lessons/Aula_06_Mobile_Navegacao_Formularios.html) · [Atividade vinculada · 50 min](lessons/aula-06-navegacao-formularios/atividade.html) |
| 07 | Estado, filtros e visualização de dados | [Aula interativa · 50 min](lessons/aula-07-estado-filtros/) · [Ficha e atividade · 50 min](lessons/aula-07-estado-filtros/atividade.html) |
| 08 | Laboratório vivo da AV1 · Incremento 1 | [Aula · 100 min](lessons/aula-08-av1-incremento-1/) · [Ficha de entrega](lessons/aula-08-av1-incremento-1/atividade.html) · [Guia e projeto](lessons/aula-08-av1-incremento-1/README.md) |

### Práticas da Aula 05
- [Mapa de Memórias Quilombolas](lessons/3/aula05-memorias/)
- [Permanência e Evasão Escolar](lessons/3/aula05-eda/)

### Aula 06 · aula + oficina
A apresentação reúne navegação, formulários e desafios com nota de 0 a 10 (100 XP). Em telas pequenas, a leitura vertical permite ampliar o conteúdo sem encolher o slide inteiro. A ficha possui duas trilhas, dicas, 20 verificações automáticas de 0,5 ponto, nota corrente e [missões de implementação](lessons/aula-06-navegacao-formularios/PRATICA.md).

Questões não respondidas permanecem pendentes e valem zero no denominador fixo de 10. PDF, impressão e cópia para continuar preservam as escolhas e a pontuação corrente. Identificação incompleta não impede uma exportação parcial.

### Aula 07 · aula + ficha de atividade
[Estado, filtros e visualização de dados](lessons/aula-07-estado-filtros/README.md): aula com desafios pontuados, prévias de filtros/estados/gráficos, ficha com 20 verificações formativas e [projeto Expo executável com missões e avaliador](lessons/aula-07-estado-filtros/projeto/README.md). O projeto possui pontos de implementação para o estudante e relatório parcial de testes. A ficha distingue a nota automática do simulador da autoavaliação da prática com evidências; o avaliador do projeto executa testes das funções implementadas. Os resultados são formativos e não lançam notas no SUAP.

As notas da aula, do simulador e do projeto correspondem a instrumentos distintos, cada um com máximo de 10. Não são somadas automaticamente. Ver os critérios apresentados antes de iniciar cada atividade.

### Aula 08 · laboratório vivo da AV1
Quatro marcos, 20 critérios de 0,5 e notas individuais. O [starter web responsivo](lessons/aula-08-av1-incremento-1/projeto/README.md) usa `npm run nota` para feedback e `npm run entrega` para produzir um JSONL estrito. A [ficha](lessons/aula-08-av1-incremento-1/atividade.html) verifica funções em sandbox, solicita cálculo no Apps Script Mobile e gera PDF e recibo. As notas locais são informativas. [Homologação e limites](lessons/aula-08-av1-incremento-1/INTEGRACAO_SHEETS.md).

**Candidata da branch:** infográficos originais pendentes e implantação Apps Script/E2E real ainda não homologados. A publicação na branch não altera o site de `main`.

## Estrutura

```text
.
├── index.html
├── docs/
│   └── GUIA_GIT_UPSTREAM.md
├── lessons/
│   ├── 2/
│   ├── 3/
│   ├── Aula_06_Mobile_Navegacao_Formularios.html  # aula principal
│   ├── aula-06-navegacao-formularios/
│   │   └── atividade.html
│   ├── aula-07-estado-filtros/
│   │   ├── index.html
│   │   ├── atividade.html
│   │   ├── apoio/
│   │   └── projeto/               # Expo, missões e avaliador
│   ├── compartilhado/             # acessibilidade e jogo das aulas
│   └── extra/
└── README.md
```

## Verificação da Aula 08

```bash
node --test tests/aula08-local*.test.* tests/aula08-jsonl*.test.* tests/aula08-pages*.test.cjs
node --test tests/mobile-entregas.test.cjs tests/mobile-entregas-aula08.test.cjs
node tests/aula08-browser.cjs
```

O E2E usa Chromium, `playwright` e `axe-core`, com o servidor Apps Script executado em VM e transporte interceptado. Não envia dados ao Google. O teste dos dois assets originais é um gate separado e permanece bloqueado enquanto eles estiverem ausentes.

## Verificação das aulas 6 e 7

Contrato de pontuação (Node.js, sem dependências adicionais):

```bash
node tests/pontuacao-aulas.test.cjs
```

O [registro da revisão](docs/REVISAO_AULAS_06_07_20261020.md) documenta as alterações, os testes em navegadores, as exportações e os limites da validação.

## Projetos integradores
1. **Mapa Interativo de Memórias Quilombolas**.
2. **Permanência e Evasão Escolar**.

As duas trilhas usam **TypeScript + React Native + Expo** e evoluem incrementalmente ao longo das aulas.

## Guia Git / upstream
O guia completo foi movido para [docs/GUIA_GIT_UPSTREAM.md](docs/GUIA_GIT_UPSTREAM.md).

Configuração inicial:
```bash
git remote add upstream https://github.com/thalesvalente/teaching-mobile.git
```

Rotina:
```bash
git status
git fetch upstream
git merge upstream/main
git push origin main
```

## GitHub Pages
O portal está preparado para publicação estática pela raiz da branch `main`.

Endereço esperado:
https://thalesvalente.github.io/teaching-mobile/

---
IFMA · Campus Itapecuru-Mirim · Programação para Dispositivos Móveis · 2026.2
