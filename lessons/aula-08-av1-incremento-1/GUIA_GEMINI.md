# Gemini como tutor - guia curto

**Percurso:** GitHub Pages → copiar prompt → Gemini no navegador → pedir explicação → VS Code → alterar código → terminal → executar testes.

Use **uma conversa por missão**. A integração do Gemini com VS Code é opcional; ninguém precisa instalar extensão, ligar contas ao GitHub ou usar Antigravity.

Antes de colar, confira: é somente a função necessária e o erro? Retire nomes pessoais, senhas, tokens, `.env` e qualquer informação privada. Não envie o projeto inteiro repetidamente.

## M1 - Entender o que vou fazer

```text
<INSTRUCOES>
Seja meu tutor. Use frases curtas. Primeiro me faça observar; não resolva por mim.
</INSTRUCOES>
<CONTEXTO>
Sou iniciante do 3º ano técnico e estou retomando Mobile. Vou trabalhar em uma função chamada resolver(input).
</CONTEXTO>
<DADOS>
Cole aqui somente a função e diga qual missão está fazendo, sem dados pessoais.
</DADOS>
<SAIDA>
1. Explique entrada e saída com um exemplo pequeno.
2. Diga onde observar o resultado.
3. Faça uma pergunta para conferir se entendi.
</SAIDA>
```

## M2 - Entender um teste pendente

```text
<INSTRUCOES>
Explique o problema e dê uma pista antes de sugerir código. Espere eu tentar.
</INSTRUCOES>
<CONTEXTO>
Estou implementando estado, busca e filtros sem apagar a coleção original.
</CONTEXTO>
<DADOS>
Cole somente a função resolver e a mensagem do teste pendente.
</DADOS>
<SAIDA>
Mostre o que entrou, o que deveria sair e a primeira condição que devo revisar.
Sugira um teste pequeno e diga por que ele ajuda.
</SAIDA>
```

## M3 - Ligar as telas

```text
<INSTRUCOES>
Atue como tutor. Use um passo de cada vez e não troque a arquitetura do projeto.
</INSTRUCOES>
<CONTEXTO>
Preciso abrir o detalhe, voltar à lista e preservar a busca e os filtros.
Também preciso mostrar mensagens quando um campo obrigatório está vazio.
</CONTEXTO>
<DADOS>
Cole somente a operação navegar OU validar e o resultado do teste correspondente.
</DADOS>
<SAIDA>
Descreva o estado antes e depois, dê uma pista e proponha um caso de erro.
Peça que eu explique a alteração com minhas palavras e execute npm run nota.
</SAIDA>
```

## M4 - Meu desafio individual

```text
<INSTRUCOES>
Seja tutor do meu aprendizado. Não escreva uma solução completa de primeira.
</INSTRUCOES>
<CONTEXTO>
Meu slot é [1, 2, 3 ou 4]. Meu desafio é [busca, estado, formulário ou chave por ID].
</CONTEXTO>
<DADOS>
Cole somente a função do seu arquivo individual e a mensagem do teste.
</DADOS>
<SAIDA>
Sugira um caso normal, um caso limite e uma entrada inválida.
Dê uma pista e me peça para testar a alteração antes de seguir.
</SAIDA>
```

## Fechar a conversa

Registre no `aiLog` de `src/evidencias.json`, sem nomes pessoais:

| Campo | Uma frase sobre… |
|---|---|
| `mission` | O marco: M1, M2, M3 ou M4 |
| `request` | O pedido feito à IA |
| `suggestion` | A sugestão aproveitada |
| `humanChange` | O que você alterou e entendeu |
| `test` | O comando/caso testado e o que observou |

Não invente um registro para ganhar ponto. O professor pode pedir que você explique a função. O Gemini sugere; você escolhe, altera e verifica.
