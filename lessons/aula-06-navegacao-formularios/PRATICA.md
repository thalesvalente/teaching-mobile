# Aula 06 — Missão «Do toque ao registro»

[Abrir aula](../Aula_06_Mobile_Navegacao_Formularios.html) · [Abrir ficha e placar](atividade.html) · [Guia Git](../../docs/GUIA_GIT_UPSTREAM.md)

## Onde está o projeto?

O repositório da disciplina contém duas bases Expo executáveis:

- [Memórias Quilombolas — base da Aula 05](../3/aula05-memorias/README_ALUNO.md);
- [Permanência escolar — base da Aula 05](../3/aula05-eda/README_ALUNO.md).

A Aula 06 tem código de referência completo no botão **Código** da apresentação, mas não uma terceira pasta Expo pronta. Continue no aplicativo da equipe ou na base correspondente e integre os arquivos necessários. Preserve estilos, dados, tipos e componentes já construídos.

Se ainda não iniciou uma base, siga o README dessa pasta. Não execute `npm install` na pasta da ficha HTML: ela não é o projeto Expo.

## Placar e critérios conhecidos desde o início

Na ficha há dois resultados de até 10,0: **laboratório automático** e **implementação autoavaliada com evidências**. Ambos mostram a pontuação durante o trabalho e no PDF. Cada resultado conserva seu máximo fixo, mesmo com campos em branco. Não se somam para produzir nota oficial.

| Missão prática | Máximo | Para declarar atendimento |
|---|---:|---|
| M1 — Transformar telas em rotas | 2,0 | Lista, detalhe variável, formulário fixo e Stack organizados no app |
| M2 — Abrir, encontrar e voltar | 2,0 | Dois IDs abrem itens diferentes; ID inexistente tem saída; retorno funciona com e sem histórico |
| M3 — Controlar e validar | 3,0 | Digitar/apagar atualiza estado; `trim`; título mínimo 3 e descrição/resumo mínimo 10; erro explica a correção |
| M4 — Registrar com segurança | 3,0 | Inválido não cria; válido aparece na coleção e detalhe; voltar não reabre o formulário salvo; dois toques não duplicam |

Use os níveis e o placar da ficha para acompanhar o progresso. A rubrica prática contém 20 cenários de 0,5 ponto agrupados nessas quatro missões; os cenários não realizados ficam pendentes e valem zero, preservando os pontos dos demais. Dicas e repetição não descontam pontos. Não declare atendimento apenas por copiar o trecho: execute o teste e registre o resultado. A ficha deixa explícito que essa parte é autoavaliação, sujeita à conferência docente.

## M1 — Planeje a rota antes de criar arquivos

Existem duas organizações válidas nos materiais:

| Exemplo | Lista | Detalhe | Formulário |
|---|---|---|---|
| Referência da apresentação | `app/index.tsx` → `/` | `app/memorias/[id].tsx` | `app/memorias/nova.tsx` |
| Simulador da ficha | `app/memorias/index.tsx` → `/memorias` | `app/memorias/[id].tsx` | `app/memorias/nova.tsx` |

Escolha a que corresponde ao seu app. O endereço de retorno deve apontar para a **lista realmente existente**. Na trilha de ações, substitua `memorias` por `acoes`. O nome da pasta `app` e a extensão `.tsx` não fazem parte da URL.

## M2 — Teste o caminho completo

Abra o segundo registro e confira o título. Volte. Abra um ID inexistente e confirme que há uma saída. Teste uma entrada direta no detalhe: sem histórico, o retorno deve substituir a tela pela rota da lista existente.

O simulador usa IDs numéricos; o código da apresentação usa identificadores como `m1` e `a1`. Preserve o ID de sua base. Ao comparar com o parâmetro textual da rota, normalize a representação, por exemplo `String(item.id)`.

## M3 — Faça a validação revelar o que falta

Teste vazio, somente espaços, título com 2 e 3 caracteres, descrição/resumo com 9 e 10 caracteres. O texto dos erros deve explicar qual campo precisa mudar. Tente corrigir só o campo indicado.

A ficha chama o texto maior de `resumo`; a referência da apresentação usa `descricao`. São nomes de campo diferentes para o mesmo papel didático. Mapeie explicitamente na integração e mantenha os demais campos da base.

## M4 — Confirme o resultado do cadastro

Teste um envio inválido, um válido e dois toques rápidos no mesmo envio. O novo registro deve aparecer na coleção compartilhada. A confirmação substitui o formulário pelo detalhe, para que “Voltar” não reabra uma submissão já concluída.

Na trilha EDA, o formulário cria **ações de apoio**, não indicadores. Preserve os indicadores da base da Aula 05 em sua própria coleção. Na Aula 07, filtros e gráficos trabalham com indicadores; não envie seus IDs para rotas de ações.

## Boss — Uma pessoa usa, outra confere

Troque os papéis: implementar, testar e explicar. Teste os controles por toque e teclado disponíveis, a leitura dos rótulos e o formulário com teclado virtual. Registre aparelho ou navegador, arquivos, commit, resultado e o que ainda falta.

Na ficha, gere o PDF a qualquer momento. Questões não respondidas e testes pendentes aparecem assim no documento; a nota atual é preservada. Guarde também o JSON para continuar preenchendo depois.
