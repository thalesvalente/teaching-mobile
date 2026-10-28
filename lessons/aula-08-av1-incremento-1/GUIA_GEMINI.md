# Gemini como tutor — quatro missões coletivas

Use a [página HTML do tutor](gemini.html) no navegador. A extensão é opcional. A equipe programa no VS Code e executa `npm run nota` no terminal; o tutor não executa o projeto por ela.

Nunca envie nomes, senhas, tokens, `.env` ou o repositório inteiro. Copie somente a função necessária e a mensagem de teste. Toda tarefa é coletiva; o número de arquivo não identifica aluno.

## M1 — Compreender

```text
<INSTRUCOES>Seja tutor. Dê uma pista, não a solução completa.</INSTRUCOES>
<CONTEXTO>Somos uma equipe iniciante retomando funções em Mobile Web.</CONTEXTO>
<DADOS>Vou colar somente resolver(input), sem nomes ou segredos.</DADOS>
<SAIDA>Explique entrada e saída com um exemplo. Pergunte como entendemos a função.</SAIDA>
```

## M2 — Revisar uma pendência

```text
<INSTRUCOES>Explique o problema e espere nossa tentativa antes de sugerir código.</INSTRUCOES>
<CONTEXTO>Implementamos estados, busca e filtros sem alterar a coleção original.</CONTEXTO>
<DADOS>Vou colar somente a função e o critério pendente.</DADOS>
<SAIDA>Mostre uma entrada, a saída esperada, uma condição a revisar e um teste pequeno.</SAIDA>
```

## M3 — Integrar

```text
<INSTRUCOES>Avance um passo por vez sem alterar a arquitetura.</INSTRUCOES>
<CONTEXTO>Queremos abrir detalhes, voltar mantendo filtros e validar o formulário.</CONTEXTO>
<DADOS>Vou colar somente navegar ou validar e o resultado do teste.</DADOS>
<SAIDA>Descreva estado antes/depois, uma pista e um caso de erro. Peça que testemos e expliquemos.</SAIDA>
```

## M4 — Tarefa técnica da equipe

```text
<INSTRUCOES>Seja tutor; não escreva a solução completa de primeira.</INSTRUCOES>
<CONTEXTO>Trabalhamos as quatro tarefas; agora revisamos busca, estados, formulário ou ID. Os números não representam pessoas.</CONTEXTO>
<DADOS>Vou colar a função e a mensagem do teste, sem nomes ou segredos.</DADOS>
<SAIDA>Sugira um caso normal, um limite e uma entrada inválida. Dê uma pista e peça que a equipe teste e explique.</SAIDA>
```

## Registro verdadeiro

No arquivo `src/evidencias.json`, `aiLog` registra somente interações reais com `mission`, `request`, `suggestion`, `humanChange` e `test`. Use até 20 entradas e 400 caracteres por texto. `aiUsage` contém `status` e `reflection`.

Na política candidata, `used` exige log real e reflexão; `not-used` exige log vazio e reflexão verdadeira; `undeclared` permanece pendente. A reflexão tem de 20 a 400 caracteres para pontuar. Não invente registros para ganhar pontos. O default é vazio:

```json
{"aiLog": [], "aiUsage": {"status": "undeclared", "reflection": ""}}
```

Esta política aguarda aceite docente para uso oficial. Declarações não demonstram autoria ou veracidade por si mesmas.
