# Aula 08 — Laboratório Vivo · AV1: Incremento 1

**Entrada para estudantes:** [Visão geral](index.html) · [Começar](comecar.html) · [Missões passo a passo](missoes.html) · [Apoio Gemini](gemini.html) · [Entrega](atividade.html).

Este Markdown é referência complementar. A experiência do aluno está em HTML, com 22 etapas Faça/Confira e navegação consistente.

## Estado da candidata

Implementação v2: avaliação coletiva, quatro tarefas de programação e registro reflexivo verdadeiro com ou sem IA. **F02/F03 são propostas aguardando aceite docente; o recebimento oficial permanece bloqueado até configuração autorizada e homologação real.** Publicação na branch/PR não atualiza a implantação Google ou a main.

Uma equipe, uma entrega, uma nota. A ficha solicita somente o nome da equipe e de um a quatro participantes, sem associação nome–arquivo. Os nomes históricos `src/individual/aluno1.mjs` a `aluno4.mjs` identificam tarefas, não estudantes. Todas as equipes trabalham os quatro arquivos; sua quantidade não depende da quantidade de pessoas.

| Marco | Tempo | Trabalho coletivo | Pontos |
|---|---:|---|---:|
| M1 | 15 min | Preparar, conhecer arquivos e registrar o processo | 2,5 |
| M2 | 25 min | Estados, filtros, preservação e IDs | 2,0 |
| M3 | 35 min | Recuperação, navegação, formulário e resumo | 3,0 |
| M4 | 25 min | Quatro tarefas, revisão e entrega | 2,5 |

São 20 critérios de 0,5. Em cada critério M4, todas as quatro tarefas devem passar seus casos. O resultado é igual para todos os participantes e não é uma média de notas individuais.

## Percurso operacional

No terminal da pasta `projeto`:

```bash
npm ci
npm run preflight
npm run web
```

Abra `http://127.0.0.1:8088` no mesmo computador. Use outro terminal na mesma pasta para `npm run nota`; ao concluir, execute `npm run entrega`. O starter é **Mobile Web**, com Node.js 22+, sem Expo ou APK. Ele tem TODOs intencionais e começa com pendências formativas.

A ficha deve ser servida por HTTP, não aberta como Markdown. Para teste docente local, na raiz do repositório, use `py -m http.server 8000` no Windows com Python, ou `python3 -m http.server 8000` no Linux, e abra `/lessons/aula-08-av1-incremento-1/index.html` no servidor local.

## Registro verdadeiro do processo

`src/evidencias.json` começa sem experiência inventada:

```json
{
  "aiLog": [],
  "aiUsage": {"status": "undeclared", "reflection": ""}
}
```

Na política proposta, `used` exige log real e reflexão; `not-used` exige log vazio e reflexão verdadeira; `undeclared` representa informação ainda ausente. A reflexão tem de 20 a 400 caracteres para pontuar. O log aceita até 20 entradas com `mission`, `request`, `suggestion`, `humanChange` e `test`; cada texto tem até 400 caracteres. Não inclua dados pessoais, senhas, tokens, `.env` ou conversas completas. Declarações não comprovam autoria nem identidade.

## Entrega e reenvio

Gere `projeto/entrega/entrega-a08.jsonl` com os arquivos atuais. Importe na ficha, preencha equipe e nomes e use **Avaliar e enviar** após liberação docente. A ficha executa casos isolados; o servidor calcula a nota, grava e assina o recibo. Sem recibo validado, o envio não está confirmado. PDF local não registra nota.

Em um reenvio, mantenha todos os participantes da entrega anterior. Reordenação, caixa e espaços não criam uma composição nova. Omissão, adição ou substituição é recusada para conferência docente. Não renomeie a equipe nem apague cadastros para contornar erro. Falha parcial requer reconciliação responsável, não repetição cega.

Schema `mobile-a08-v2`; rubrica candidata `mobile-a08-lab-vivo-2.0.0`; contrato/gerador `2.0.0`. Pacotes anteriores são recusados com orientação para baixar a versão atual e gerar novamente. Não edite JSONL manualmente.

## Imagens e limites

Os dois PNGs originais existem na conversa, mas a publicação binária na branch continua pendente. Seus bytes não devem ser alterados. Os textos HTML explicam diferenças da referência histórica: Expo, `.tsx`, app Memórias, prática individual e nota 9,2 não correspondem à candidata atual. A contextualização também aguarda decisão docente.

Nota local não tem autoridade. Hash identifica bytes; HMAC autentica emissão, não autoria; Base64 é codificação. Quotas limitam abuso sem autenticar nomes. A referência oficial não executa fontes dos alunos no Apps Script. [Integração e homologação docente](INTEGRACAO_SHEETS.md).
