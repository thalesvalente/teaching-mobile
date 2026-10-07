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
| 06 | Navegação e formulários | [Aula interativa · 50 min](lessons/aula-06-navegacao-formularios/) · [Atividade · 50 min](lessons/aula-06-navegacao-formularios/atividade.html) |

### Práticas da Aula 05
- [Mapa de Memórias Quilombolas](lessons/3/aula05-memorias/)
- [Permanência e Evasão Escolar](lessons/3/aula05-eda/)

### Aula 06 · oficina interativa
A atividade possui identificação da equipe, nomes dos componentes, duas trilhas de projeto, dicas ligadas aos slides, 20 verificações automáticas (10,0 pontos) e exportação de PDF formal com a pontuação recalculada.

## Estrutura

```text
.
├── index.html
├── docs/
│   └── GUIA_GIT_UPSTREAM.md
├── lessons/
│   ├── 2/
│   ├── 3/
│   ├── aula-06-navegacao-formularios/
│   │   ├── index.html
│   │   └── atividade.html
│   ├── Aula_06_Mobile_Navegacao_Formularios.html  # versão anterior preservada
│   └── extra/
└── README.md
```

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
