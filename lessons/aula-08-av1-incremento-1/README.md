# Aula 08 - Laboratório vivo da AV1

**Hoje:** retomar com calma, programar pequenas funções, ligar o Incremento 1 e registrar o que você aprendeu. **Tempo:** 100 minutos. **Equipe:** de 1 a 4 pessoas. Cada integrante recebe sua própria nota, de 0 a 10.

**Para estudantes:** [Visão geral](index.html) · [Começar passo a passo](comecar.html) · [Missões](missoes.html) · [Gemini](gemini.html) · [Ficha de entrega](atividade.html).

Os arquivos Markdown abaixo permanecem como referência técnica e material de apoio ao professor; a navegação recomendada para alunos é pelas páginas HTML.

## 1. Abrir a aula e preparar

Abra a pasta `projeto` no VS Code. Ela deve conter `package.json`, `src` e `scripts`. Se ainda não tem os arquivos, peça a cópia ao professor ou baixe o repositório como ZIP no GitHub: **não precisa criar conta nem fazer login**. Extraia o ZIP antes de trabalhar. Enquanto esta mudança estiver em revisão, selecione a branch `feat/aula-08-laboratorio-vivo-av1-20261027` antes de baixar.

Instale Node.js 22 ou mais recente caso o computador ainda não tenha. No terminal da pasta `lessons/aula-08-av1-incremento-1/projeto`, execute uma linha por vez:

```bash
npm ci
npm run preflight
npm run web
```

Abra o endereço que aparece no terminal. Mantenha esse terminal aberto e use um segundo terminal para os testes. `Ctrl+C` encerra o servidor quando terminar.

O starter é um aplicativo **web responsivo**, sem dependências externas, para experimentar no navegador os comportamentos de Mobile. Não gera APK. Os projetos React Native/Expo das aulas anteriores continuam disponíveis para a transposição ao aplicativo nativo.

Combinem os slots da equipe. Por padrão, os comandos incluem os quatro. Para uma equipe menor, use a opção `--slots`, por exemplo `npm run nota -- --slots=1,2` e `npm run entrega -- --slots=1,2`. Cada pessoa trabalha em seu arquivo, sem nomes pessoais no código ou no pacote:

| Slot | Arquivo | Desafio individual |
|---|---|---|
| 1 | `src/individual/aluno1.mjs` | Normalizar a busca |
| 2 | `src/individual/aluno2.mjs` | Distinguir estados da lista |
| 3 | `src/individual/aluno3.mjs` | Validar o formulário |
| 4 | `src/individual/aluno4.mjs` | Criar chave estável pelo ID |

## 2. Programar com apoio do Gemini

Abra o [guia do Gemini](GUIA_GEMINI.md). Copie um prompt e cole no Gemini **no navegador**. Trabalhe em uma missão por conversa. Envie somente a função necessária e a mensagem do teste.

Peça uma pista. Faça a alteração no VS Code. Explique em uma frase por que ela ajuda. Nunca envie `.env`, senhas, tokens, dados pessoais ou o projeto inteiro repetidamente. Extensão de IA, Antigravity e integração com GitHub não são necessários.

## 3. Testar e ver o resultado

```bash
npm run nota
```

O relatório mostra critérios aprovados e pendentes. Os `TODO` do starter existem para você praticar; é normal começar com nota parcial. Leia uma pendência, altere uma função e repita o teste. Não há penalidade por repetir.

**Essa nota é formativa e informativa.** Não escreve na planilha. A ficha fará uma nova verificação para calcular a nota da entrega. Alterar um teste para mostrar “passou” não corrige o comportamento do aplicativo.

### Nosso roteiro de 100 minutos

| Marco | Tempo | O que produzir | Valor |
|---|---:|---|---:|
| M1 | 15 min | Preparação, slots e registro do processo | 2,5 |
| M2 | 25 min | Estado, busca, filtros e identidade | 2,0 |
| M3 | 35 min | Navegação, formulário, retorno e resumo | 3,0 |
| M4 | 25 min | Função individual e entrega | 2,5 |

São 20 critérios de 0,5. M1, M2 e M3 são compartilhados; M4 é individual. I1 (portfólio) corresponde a M1; I3 (Incremento 1) corresponde a M2 + M3; I2 (prática individual) corresponde a M4. O envio está dentro do Marco 4.

Registre o uso real de IA em `src/evidencias.json`, dentro de `aiLog`. Use o modelo abaixo apenas como exemplo de formato; substitua pelo que aconteceu no seu trabalho. Se não usou IA, mantenha `[]` e converse com o professor sobre o critério do portfólio.

```json
{
  "mission": "M2",
  "request": "Pedi uma explicação sobre combinar dois filtros.",
  "suggestion": "A sugestão foi verificar as duas condições.",
  "humanChange": "Revisei a condição na função da equipe.",
  "test": "Executei npm run nota e comparei a pendência."
}
```

## 4. Executar npm run entrega

```bash
npm run entrega
```

O pacote fica em `entrega/entrega-a08.jsonl`. O comando inclui apenas as funções permitidas, os resultados locais e o registro do processo. Nomes de pessoas são preenchidos somente na ficha. Não envie arquivos `.env`, `.git`, `node_modules` ou um ZIP do projeto.

Se o comando informar erro, leia a mensagem, corrija no projeto e rode novamente. Não edite o JSONL à mão. Mantenha uma cópia do projeto e do arquivo gerado.

## 5. Importar e entregar

Abra a [ficha](atividade.html), preencha a equipe e associe os nomes aos slots presentes no pacote. Selecione ou arraste `entrega-a08.jsonl`. Confira o resumo e clique em **Verificar, gerar PDF e entregar**.

A página mostra o andamento. O PDF é gerado antes do envio e conserva esse estado; o recibo vem depois e identifica exatamente esse PDF. Guarde **os dois**. A confirmação só aparece depois de um recibo válido.

Se a rede falhar, use **Guardar PDF local** ou **Imprimir registro**. Isso preserva o trabalho sem confirmar um envio. Após timeout, pergunte ao professor se houve recebimento antes de repetir. Para continuar sem internet, mantenha a página já carregada ou sirva os arquivos localmente; não há promessa de reabrir uma página remota ainda não carregada.

## Se aparecer um problema

| Mensagem/situação | O que fazer |
|---|---|
| `npm` não encontrado | Peça apoio para instalar Node.js e reabra o terminal. |
| `package.json` não encontrado | Abra o terminal dentro da pasta `projeto`. |
| Testes pendentes | Leia o critério, abra a função indicada e faça uma mudança pequena. |
| Pacote inválido | Gere novamente com `npm run entrega`; não corrija hashes manualmente. |
| Slot sem nome | Confira quem trabalhou naquele arquivo e preencha a ficha. |
| Entrega não confirmada | Guarde o PDF e converse com o professor. |
| Caractere não suportado no PDF | Use **Imprimir registro** para preservar o texto; nenhuma entrega final é simulada. |

### Para o professor

[Integração e homologação Sheets](INTEGRACAO_SHEETS.md) · [Acessibilidade](ACESSIBILIDADE.md). Os dois infográficos originais exigidos ainda precisam ser fornecidos; as descrições equivalentes já estão nas páginas. A branch é uma candidata em revisão, não uma implantação homologada.
