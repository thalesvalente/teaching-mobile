window.SLIDES7 = [
  {
    "title": "Estado, filtros e visualização de dados",
    "body": "<div class=\"two\"><div><h2 class=\"cover-title\">Encontrar,<br>filtrar e <em>entender.</em></h2><p class=\"lead\">A lista cresceu. Como mostrar a informação certa sem confundir a pessoa?</p><p class=\"small\">3º ano · Programação para Dispositivos Móveis<br>Prof. Dr. Thales Levi Azevedo Valente</p></div><article class=\"panel \"><h2>Aula 7 · dois momentos</h2><p class=\"\"><strong>50 min:</strong> explicações curtas e experimentos guiados.</p><p class=\"\"><strong>50 min:</strong> laboratório, implementação e ficha da equipe.</p><div class=\"rule\">Evolua o app da equipe. Se ainda não houver base, use o projeto inicial da Aula 7.</div></article></div>",
    "note": "Apresente o título do encontro 7 do plano. Os exemplos são inventados. A primeira metade intercala 25 min de exposição e 25 de participação; a oficina dura mais 50. Não alterar stack, dados reais nem aulas anteriores.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "0–1 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s01"
  },
  {
    "title": "A lista da Aula 6 continua aqui",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Já sabemos</h2><p class=\"\">Abrir um registro pelo ID, voltar e cadastrar com validação.</p><p class=\"\">O detalhe deve continuar mostrando o item certo. Em EDA, ações cadastradas e indicadores são coleções distintas.</p></article><article class=\"panel blue\"><h2>Agora precisamos</h2><p class=\"\">Encontrar registros, escolher um recorte e explicar o que aparece na tela.</p><div class=\"rule\"><strong>Nova pergunta:</strong> e se houver muitos itens, uma espera ou uma falha?</div></article></div>",
    "note": "Retome a aula anterior sem pressupor que todas as equipes já terminaram. Preserve o formulário, a coleção e o fluxo de navegação. Esta aula acrescenta uma camada de seleção e visualização.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "1–2 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s02"
  },
  {
    "title": "Experimente antes de ler o código",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Você consegue prever?</h2><p class=\"\"><strong>1.</strong> Busque “praça”. Quantos itens ficam?</p><p class=\"\"><strong>2.</strong> Escolha “Lugar”. E agora?</p><p class=\"\"><strong>3.</strong> Limpe os filtros. Os outros registros voltam?</p><div class=\"rule\">Não apagamos os dados; mudamos o que é exibido.</div></article><div class=\"device\" data-demo='{&quot;projeto&quot;: &quot;memorias&quot;, &quot;modo&quot;: &quot;completo&quot;}'></div></div>",
    "note": "Peça previsão, interação e explicação. Caso Memórias: busca praça traz 2; praça + Lugar traz 1; limpar traz 6. Não introduza código enquanto a turma ainda não entendeu o efeito. Os IDs só identificam os itens.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "2–4 min",
    "kind": "PRÁTICA GUIADA",
    "id": "s03"
  },
  {
    "title": "Estado é o que a tela lembra agora",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Três informações diferentes</h2><p class=\"\"><strong>Dados:</strong> a coleção de registros.</p><p class=\"\"><strong>Escolhas:</strong> texto buscado e categoria.</p><p class=\"\"><strong>Situação da tela:</strong> carregando, sucesso ou erro.</p></article><div class=\"stack\"><div class=\"codebox\"><div class=\"codehead\"><span>Dentro do componente</span><b>RECORTE</b></div><div class=\"codebody\"><div class=\"code-line\"><i aria-hidden=\"true\">1</i><span>const [busca, setBusca] = useState(&#x27;&#x27;);</span></div><div class=\"code-line\"><i aria-hidden=\"true\">2</i><span>const [categoria, setCategoria] =</span></div><div class=\"code-line\"><i aria-hidden=\"true\">3</i><span>  useState(&#x27;Todas&#x27;);</span></div></div></div><div class=\"rule\"><strong>visiveis</strong> pode ser calculado a partir dos dados e dessas escolhas.</div></div></div>",
    "note": "Defina estado sem confundir com situação de indicador. useState guarda o valor entre renderizações; setters pedem atualização. A lista filtrada é derivada, não precisa de outro estado duplicado. Estes hooks ficam dentro do componente e são importados de react.",
    "source": "React · estrutura do estado",
    "url": "https://pt-br.react.dev/learn/choosing-the-state-structure",
    "time": "4–6 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s04"
  },
  {
    "title": "O toque ou a digitação provoca uma mudança",
    "body": "<div class=\"two\"><div class=\"stack\"><div class=\"codebox\"><div class=\"codehead\"><span>Campo de busca · React Native</span><b>RECORTE</b></div><div class=\"codebody\"><div class=\"code-line\"><i aria-hidden=\"true\">1</i><span>&lt;TextInput</span></div><div class=\"code-line\"><i aria-hidden=\"true\">2</i><span>  value={busca}</span></div><div class=\"code-line\"><i aria-hidden=\"true\">3</i><span>  onChangeText={setBusca}</span></div><div class=\"code-line\"><i aria-hidden=\"true\">4</i><span>  accessibilityLabel=&quot;Buscar no título&quot;</span></div><div class=\"code-line\"><i aria-hidden=\"true\">5</i><span>/&gt;</span></div></div></div><p class=\"small\">Um <strong>evento</strong> é algo que aconteceu: digitar, tocar ou selecionar.</p></div><article class=\"panel blue\"><h2>Digite e acompanhe</h2><label>Texto buscado<input id=\"eventoBusca\" placeholder=\"Digite praça\"></label><div class=\"pipeline\"><div>1 · A pessoa digita.</div><div>2 · <code>setBusca</code> recebe o texto.</div><div>3 · Estado atual: <strong id=\"eventoValor\">\"\"</strong></div><div>4 · A lista será calculada de novo.</div></div></article></div>",
    "note": "Os alunos operam o campo e apagam o texto. O input desta página simula o evento do TextInput; não é o componente nativo. Não afirmar que o setter altera imediatamente a variável corrente.",
    "source": "React Native · TextInput",
    "url": "https://reactnative.dev/docs/textinput",
    "time": "6–8 min",
    "kind": "PRÁTICA GUIADA",
    "id": "s05"
  },
  {
    "title": "Filtrar é escolher, não apagar",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Uma coleção, várias visualizações</h2><div class=\"count-grid\"><div>Base<strong>6</strong></div><div>Categoria Lugar<strong>2</strong></div><div>Após limpar<strong>6</strong></div></div><div class=\"rule\">A lista completa continua existindo. O <strong>recorte</strong> é só a parte que atende ao filtro.</div><div class=\"reveal\"><button type=\"button\" data-answer aria-expanded=\"false\">Conferir uma resposta</button><div class=\"answer\" hidden>Os itens não foram excluídos. Limpar o filtro volta a mostrar a coleção completa.</div></div></article><div class=\"device\" data-demo='{&quot;projeto&quot;: &quot;memorias&quot;, &quot;modo&quot;: &quot;completo&quot;}'></div></div>",
    "note": "Peça que alternem Lugar, Relato e Todas. Recorte significa seleção visível, não coleção nova salva. Não confundir limpar filtro com apagar registros.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "8–10 min",
    "kind": "PRÁTICA GUIADA",
    "id": "s06"
  },
  {
    "title": "Primeiro: escolher uma categoria",
    "body": "<div class=\"two\"><div class=\"stack\"><div class=\"codebox\"><div class=\"codehead\"><span>filter retorna uma nova lista</span><b>RECORTE</b></div><div class=\"codebody\"><div class=\"code-line\"><i aria-hidden=\"true\">1</i><span>const visiveis = registros.filter(</span></div><div class=\"code-line\"><i aria-hidden=\"true\">2</i><span>  item =&gt; item.categoria === categoria</span></div><div class=\"code-line\"><i aria-hidden=\"true\">3</i><span>);</span></div></div></div><article class=\"panel \"><h2>Leia devagar</h2><p class=\"\"><strong>item</strong> é um registro examinado.</p><p class=\"\"><strong>===</strong> compara os valores.</p><p class=\"\">Se a comparação for verdadeira, o item entra no resultado.</p></article></div><article class=\"panel blue\"><h2>Exemplo: categoria = Lugar</h2><div class=\"pipeline\"><div>Roda de histórias · Relato → <strong>não entra</strong></div><div>Praça das conversas · Lugar → <strong>entra</strong></div><div>Casa de encontros · Lugar → <strong>entra</strong></div></div><p class=\"small\">Aqui ainda não tratamos a opção “Todas”. Ela entra no próximo passo.</p></article></div>",
    "note": "A função passada a filter é executada para cada item. Os alunos leem predicado como pergunta. Este recorte ensina apenas uma categoria; a versão completa também trata Todas e busca.",
    "source": "JavaScript · Array.filter",
    "url": "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/filter",
    "time": "10–12 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s07"
  },
  {
    "title": "Depois: buscar um trecho do título",
    "body": "<div class=\"two\"><div class=\"stack\"><div class=\"codebox\"><div class=\"codehead\"><span>Normalizar antes de comparar</span><b>RECORTE</b></div><div class=\"codebody\"><div class=\"code-line\"><i aria-hidden=\"true\">1</i><span>const termo = busca.trim().toLowerCase();</span></div><div class=\"code-line\"><i aria-hidden=\"true\">2</i><span>const titulo = item.titulo.toLowerCase();</span></div><div class=\"code-line\"><i aria-hidden=\"true\">3</i><span>const textoOk = titulo.includes(termo);</span></div></div></div><p class=\"small\"><strong>trim:</strong> tira espaços das pontas.<br><strong>toLowerCase:</strong> deixa minúsculo.<br><strong>includes:</strong> contém esse trecho?</p><div class=\"rule\">“  PRAÇA  ” encontra títulos com “praça”. Nesta regra, os acentos são preservados.</div></div><div class=\"device\" data-demo='{&quot;projeto&quot;: &quot;memorias&quot;, &quot;modo&quot;: &quot;completo&quot;}'></div></div>",
    "note": "Os alunos testam PRAÇA com espaços e depois um termo inexistente. Busca vazia corresponde a todos os títulos; não precisamos exigir um caractere. Esta normalização não remove acentos: praca e praça não são equivalentes na regra didática.",
    "source": "JavaScript · includes",
    "url": "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/includes",
    "time": "12–14 min",
    "kind": "PRÁTICA GUIADA",
    "id": "s08"
  },
  {
    "title": "Busca E categoria: os dois critérios precisam passar",
    "body": "<div class=\"two\"><div class=\"stack\"><div class=\"codebox\"><div class=\"codehead\"><span>Dentro de filter</span><b>RECORTE</b></div><div class=\"codebody\"><div class=\"code-line\"><i aria-hidden=\"true\">1</i><span>const categoriaOk = categoria === &#x27;Todas&#x27;</span></div><div class=\"code-line\"><i aria-hidden=\"true\">2</i><span>  || item.categoria === categoria;</span></div><div class=\"code-line\"><i aria-hidden=\"true\">3</i><span> </span></div><div class=\"code-line\"><i aria-hidden=\"true\">4</i><span>return textoOk &amp;&amp; categoriaOk;</span></div></div></div><p class=\"small\"><strong>||:</strong> uma condição OU a outra.<br><strong>&&:</strong> uma condição E a outra.</p></div><article class=\"panel blue\"><h2>Buscando “praça” em Lugar</h2><p class=\"\">Praça das conversas:<br>texto sim + categoria sim → <strong>entra</strong>.</p><p class=\"\">Cantigas da praça:<br>texto sim + categoria não → <strong>não entra</strong>.</p><div class=\"rule\">Em EDA, o período escolhido também precisa corresponder.</div></article></div>",
    "note": "Separe o OR interno que permite Todas do AND que combina critérios. Não reduzir tudo a decorar operadores. EDA acrescenta periodoOk como terceiro critério. Os dados e estes predicados são didáticos.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "14–16 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s09"
  },
  {
    "title": "Bug: o filtro está apagando a própria fonte",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Tente reproduzir</h2><p class=\"\">Neste exemplo com defeito, escolha <strong>Lugar</strong> e depois <strong>Todas</strong>.</p><p class=\"\">Por que a lista não voltou a ter seis itens?</p><div class=\"reveal\"><button type=\"button\" data-answer aria-expanded=\"false\">Conferir uma resposta</button><div class=\"answer\" hidden>O resultado filtrado substituiu a base. Correção: manter registros e calcular visiveis sem apagar os itens.</div></div><button type=\"button\" data-fix-source class=\"secondary\">Aplicar correção e restaurar base</button></article><div class=\"device\" data-demo='{&quot;projeto&quot;: &quot;memorias&quot;, &quot;modo&quot;: &quot;completo&quot;, &quot;config&quot;: {&quot;origem&quot;: &quot;apagar&quot;}}'></div></div>",
    "note": "Atividade de diagnóstico. Todos os outros comportamentos são corretos. O botão de correção recria somente esta demo com o modelo bom e seis itens; nenhum dado da ficha é alterado. Compare antes e depois.",
    "source": "React · evitar duplicação e contradições",
    "url": "https://pt-br.react.dev/learn/choosing-the-state-structure",
    "time": "16–18 min",
    "kind": "PRÁTICA GUIADA",
    "id": "s10"
  },
  {
    "title": "FlatList: quem organiza os itens na tela?",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Uma lista de registros parecidos</h2><p class=\"\"><strong>FlatList</strong> é o componente do React Native que organiza uma lista rolável.</p><p class=\"\">Ele prepara os cartões por partes, conforme rolamos, em vez de montar toda a lista longa de uma vez.</p><div class=\"rule\">Hoje vamos ligar a coleção filtrada a essa lista.</div></article><div class=\"stack\"><div class=\"codebox\"><div class=\"codehead\"><span>Primeiro: de onde vêm os itens?</span><b>RECORTE</b></div><div class=\"codebody\"><div class=\"code-line\"><i aria-hidden=\"true\">1</i><span>&lt;FlatList</span></div><div class=\"code-line\"><i aria-hidden=\"true\">2</i><span>  data={visiveis}</span></div><div class=\"code-line\"><i aria-hidden=\"true\">3</i><span>  renderItem={renderizarItem}</span></div><div class=\"code-line\"><i aria-hidden=\"true\">4</i><span>  keyExtractor={item =&gt; String(item.id)}</span></div><div class=\"code-line\"><i aria-hidden=\"true\">5</i><span>/&gt;</span></div></div></div><p class=\"small\"><strong>data:</strong> a coleção.<br><strong>renderItem:</strong> como desenhar cada item.<br><strong>keyExtractor:</strong> como identificar cada item.</p></div></div>",
    "note": "Apresente as três props sem detalhar todas simultaneamente. FlatList pode renderizar itens além dos visíveis; fale em janela e não em somente o pixel que aparece. Não promete testar desempenho nativo no simulador.",
    "source": "React Native · FlatList",
    "url": "https://reactnative.dev/docs/flatlist",
    "time": "18–20 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s11"
  },
  {
    "title": "renderItem desenha UM registro por vez",
    "body": "<div class=\"two\"><div class=\"stack\"><div class=\"codebox\"><div class=\"codehead\"><span>Função dentro do componente</span><b>RECORTE</b></div><div class=\"codebody\"><div class=\"code-line\"><i aria-hidden=\"true\">1</i><span>function renderizarItem({ item }) {</span></div><div class=\"code-line\"><i aria-hidden=\"true\">2</i><span>  return (</span></div><div class=\"code-line\"><i aria-hidden=\"true\">3</i><span>    &lt;Pressable onPress={() =&gt; abrir(item.id)}&gt;</span></div><div class=\"code-line\"><i aria-hidden=\"true\">4</i><span>      &lt;Text&gt;{item.titulo}&lt;/Text&gt;</span></div><div class=\"code-line\"><i aria-hidden=\"true\">5</i><span>    &lt;/Pressable&gt;</span></div><div class=\"code-line\"><i aria-hidden=\"true\">6</i><span>  );</span></div><div class=\"code-line\"><i aria-hidden=\"true\">7</i><span>}</span></div></div></div><p class=\"small\">O código completo traz os tipos TypeScript. <strong>abrir</strong> é a função de navegação da aplicação, não uma API nova.</p></div><article class=\"panel \"><h2>Não desenhe sempre o primeiro</h2><p class=\"\">A lista entrega um <strong>item diferente</strong> a cada chamada.</p><p class=\"\">Use o título e o ID desse item, não <code>registros[0]</code>.</p><div class=\"rule\">O toque continua abrindo o detalhe correto, como na Aula 6.</div></article></div>",
    "note": "Recorte intencional sem tipagem extensa; referência completa usa ListRenderItem<Registro>. Mostre relação item da lista e item.id. O callback abrir é recebido para manter a navegação existente.",
    "source": "React Native · renderItem",
    "url": "https://reactnative.dev/docs/flatlist",
    "time": "20–22 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s12"
  },
  {
    "title": "ID identifica; posição muda quando filtramos",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>A mesma pessoa não vira outra por mudar de fila</h2><p class=\"\">O registro mantém o <strong>mesmo ID</strong> quando muda de posição na lista.</p><div class=\"codebox\"><div class=\"codehead\"><span>Chave estável</span><b>RECORTE</b></div><div class=\"codebody\"><div class=\"code-line\"><i aria-hidden=\"true\">1</i><span>keyExtractor={item =&gt; String(item.id)}</span></div></div></div><button type=\"button\" class=\"secondary\" data-reverse>Inverter a ordem nesta prévia</button><p class=\"small\">Compare ID e key antes e depois. Ambos devem acompanhar o registro.</p></article><div class=\"device\" data-demo='{&quot;projeto&quot;: &quot;memorias&quot;, &quot;modo&quot;: &quot;completo&quot;}'></div></div>",
    "note": "Os alunos invertem e filtram. A identidade estável evita associar estado ao item errado. key é interna à reconciliação; a aplicação continua usando ID na navegação. Não afirmar que todo uso de índice é proibido, mas aqui a lista muda.",
    "source": "React Native · keyExtractor",
    "url": "https://reactnative.dev/docs/flatlist",
    "time": "22–24 min",
    "kind": "PRÁTICA GUIADA",
    "id": "s13"
  },
  {
    "title": "Enquanto os dados não chegam, não mostre “vazio”",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Três situações de carregamento</h2><div class=\"pipeline\"><div><strong>Carregando:</strong> aguardamos a resposta.</div><div><strong>Sucesso:</strong> recebemos uma coleção.</div><div><strong>Erro:</strong> a tentativa falhou.</div></div></article><article class=\"panel blue\"><h2>Depois do sucesso</h2><p class=\"\">A coleção pode ter registros <strong>ou estar vazia</strong>.</p><p class=\"\">Mesmo com dados, um filtro pode não encontrar resultados.</p><div class=\"rule\">Esperar, não encontrar e falhar não são a mesma coisa.</div></article></div>",
    "note": "Status é o estado da operação, não a categoria de um indicador em atenção. Hoje a resposta e a falha são simuladas localmente; HTTP e API virão em outro encontro.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "24–26 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s14"
  },
  {
    "title": "Que mensagem faz sentido em cada cenário?",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Compare as três situações</h2><p class=\"\"><strong>Base vazia:</strong> a resposta veio sem registros.</p><p class=\"\"><strong>Sem resultado:</strong> existem registros, mas nenhum atende aos filtros.</p><p class=\"\"><strong>Erro:</strong> não conseguimos obter a resposta.</p><div class=\"rule\">Escolha os cenários e tente a busca “zzzz” com a base completa.</div></article><div class=\"device\" data-demo='{&quot;projeto&quot;: &quot;memorias&quot;, &quot;modo&quot;: &quot;completo&quot;}'></div></div>",
    "note": "Prática: base vazia, sucesso com busca zzzz, erro com dados anteriores. Limpar filtros resolve o segundo caso, não uma falha de carregamento. Nenhum destes cenários é uma leitura da situação real do campus.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "26–29 min",
    "kind": "PRÁTICA GUIADA",
    "id": "s15"
  },
  {
    "title": "Verifique o status antes de desenhar a lista",
    "body": "<div class=\"two\"><div class=\"stack\"><div class=\"codebox\"><div class=\"codehead\"><span>Dentro da função componente</span><b>RECORTE</b></div><div class=\"codebody\"><div class=\"code-line\"><i aria-hidden=\"true\">1</i><span>if (status === &#x27;carregando&#x27;)</span></div><div class=\"code-line\"><i aria-hidden=\"true\">2</i><span>  return &lt;Text&gt;Carregando...&lt;/Text&gt;;</span></div><div class=\"code-line\"><i aria-hidden=\"true\">3</i><span>if (status === &#x27;erro&#x27;)</span></div><div class=\"code-line\"><i aria-hidden=\"true\">4</i><span>  return &lt;AvisoErro aoTentar={tentarNovamente} /&gt;;</span></div><div class=\"code-line\"><i aria-hidden=\"true\">5</i><span> </span></div><div class=\"code-line\"><i aria-hidden=\"true\">6</i><span>return &lt;FlatList data={visiveis} ... /&gt;;</span></div></div></div><p class=\"small\">Os hooks ficam antes dos retornos condicionais. <strong>AvisoErro</strong> é um componente da aplicação; a referência usa elementos nativos.</p></div><article class=\"panel \"><h2>E quando data estiver vazio?</h2><p class=\"\"><code>ListEmptyComponent</code> define o conteúdo mostrado pela FlatList sem itens.</p><p class=\"\">A mensagem pode distinguir “base vazia” de “sem resultados”.</p><div class=\"rule\">O <code>return</code> escolhe a interface desta renderização; não é voltar de tela.</div></article></div>",
    "note": "O ... indica omissão no recorte e não código para colar. Código completo no botão Código usa um elemento ListEmptyComponent e tratamento de estado. Não introduza múltiplos booleanos que possam contradizer-se.",
    "source": "React Native · ListEmptyComponent",
    "url": "https://reactnative.dev/docs/flatlist",
    "time": "29–31 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s16"
  },
  {
    "title": "Tentar novamente precisa fazer alguma coisa",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Teste uma recuperação</h2><p class=\"\"><strong>1.</strong> Escolha “Erro simulado”.</p><p class=\"\"><strong>2.</strong> Toque em “Tentar novamente”.</p><p class=\"\"><strong>3.</strong> Observe a espera e a lista recuperada.</p><div class=\"rule\">Trocar só o texto do botão não executa uma nova tentativa.</div></article><div class=\"device\" data-demo='{&quot;projeto&quot;: &quot;memorias&quot;, &quot;modo&quot;: &quot;completo&quot;}'></div></div>",
    "note": "No simulador há atraso local de meio segundo. No componente de referência a troca de cenário reinicia um efeito local e cancela o timer anterior. Não há servidor nem garantia de recuperação de uma rede real.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "31–33 min",
    "kind": "PRÁTICA GUIADA",
    "id": "s17"
  },
  {
    "title": "Um cartão responde uma pergunta pequena",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Mapa de Memórias</h2><p class=\"\"><strong>Quantas memórias</strong> aparecem neste recorte?</p><p class=\"\"><strong>Quantas categorias</strong> estão representadas?</p><div class=\"rule\">As contagens devem mudar junto com a lista.</div></article><article class=\"panel blue\"><h2>Permanência Escolar</h2><p class=\"\"><strong>Quantos indicadores</strong> aparecem no recorte?</p><p class=\"\"><strong>Quantos estão em atenção</strong> nos dados fictícios?</p><div class=\"rule\">Uma contagem de indicadores não é a quantidade de estudantes.</div></article></div>",
    "note": "Indicador é um valor resumido para observar algo; o cartão precisa de título, número e unidade. Na prévia EDA as linhas mantêm valor e unidade da base; os dois cartões agregados contam linhas, não pessoas.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "33–35 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s18"
  },
  {
    "title": "Não some números de unidades diferentes",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Dados locais de exemplo</h2><p class=\"\"><strong>88%</strong> · frequência média.</p><p class=\"\"><strong>94%</strong> · atividades entregues.</p><p class=\"\"><strong>7 estudantes</strong> · acompanhamento.</p><div class=\"reveal\"><button type=\"button\" data-answer aria-expanded=\"false\">Conferir uma resposta</button><div class=\"answer\" hidden>88 + 94 + 7 não é um indicador válido aqui. As medidas representam coisas diferentes.</div></div></article><article class=\"panel amber\"><h2>O gráfico precisa de uma unidade clara</h2><p class=\"\">Compare os percentuais em um eixo de <strong>0 a 100%</strong>.</p><p class=\"\">Mostre a quantidade de estudantes separadamente.</p><div class=\"rule\">Esses dados não demonstram causas de evasão. São valores inventados para aprender.</div></article></div>",
    "note": "Exemplo derivado dos tipos e valores sintéticos da base EDA, acrescentando períodos fictícios para exercitar filtros. Não é cálculo inferencial nem avaliação de estudantes reais. A comparação descritiva não autoriza somar percentuais.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "35–37 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s19"
  },
  {
    "title": "Primeiro gráfico: leia antes de interpretar",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>O que significa cada barra?</h2><p class=\"\"><strong>Memórias:</strong> tamanho proporcional à quantidade por categoria.</p><p class=\"\"><strong>EDA:</strong> tamanho proporcional ao percentual, na escala 0–100%.</p><p class=\"\">Use o filtro de período e compare.</p><div class=\"rule\">O rótulo deve dizer o nome, o valor e a unidade.</div></article><div class=\"device\" data-demo='{&quot;projeto&quot;: &quot;eda&quot;, &quot;modo&quot;: &quot;grafico&quot;, &quot;trocaProjeto&quot;: true}'></div></div>",
    "note": "Peça leitura descritiva: frequência semana1 88 e entregas94. A troca de projeto ocorre apenas nesta demo; a ficha tem um projeto único. Memórias usa escala comum pelo maior valor; EDA usa 100 fixo. Sem biblioteca adicional ou mapa nesta aula.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "37–40 min",
    "kind": "PRÁTICA GUIADA",
    "id": "s20"
  },
  {
    "title": "Lista, cartões e gráfico usam o MESMO recorte",
    "body": "<div class=\"two\"><div class=\"stack\"><div class=\"codebox\"><div class=\"codehead\"><span>Uma única seleção de dados</span><b>RECORTE</b></div><div class=\"codebody\"><div class=\"code-line\"><i aria-hidden=\"true\">1</i><span>const visiveis = filtrar(</span></div><div class=\"code-line\"><i aria-hidden=\"true\">2</i><span>  registros, busca, categoria, periodo</span></div><div class=\"code-line\"><i aria-hidden=\"true\">3</i><span>);</span></div><div class=\"code-line\"><i aria-hidden=\"true\">4</i><span>const total = visiveis.length;</span></div><div class=\"code-line\"><i aria-hidden=\"true\">5</i><span>const barras = resumir(visiveis, trilha);</span></div></div></div><p class=\"small\">As funções <strong>filtrar</strong> e <strong>resumir</strong> são funções de apoio desta aplicação. Não são APIs do Expo.</p></div><article class=\"panel \"><h2>Evite duas versões da verdade</h2><p class=\"\">Lista filtrada em “Lugar” + contador de todas as categorias = informação confusa.</p><div class=\"rule\">Primeiro filtre. Depois calcule o resumo desse resultado.</div><p class=\"small\">Na referência, cada barra tem largura calculada em uma escala comum.</p></article></div>",
    "note": "O valor total representa linhas visíveis. Mostre que um estado extra total pode ficar desatualizado se for esquecido; derivar de visiveis mantém relação explícita.",
    "source": "React · estado derivado",
    "url": "https://pt-br.react.dev/learn/choosing-the-state-structure",
    "time": "40–42 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s21"
  },
  {
    "title": "Uma barra sozinha não basta",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>O que a cor não pode esconder</h2><p class=\"\">Escreva <strong>nome + valor + unidade</strong> de cada barra.</p><p class=\"\">Garanta texto legível e indicação dos filtros usados.</p><p class=\"\">Um leitor de tela deve encontrar a mesma informação.</p><div class=\"rule\">O gráfico complementa os valores; não substitui sua descrição.</div></article><div class=\"device\" data-demo='{&quot;projeto&quot;: &quot;eda&quot;, &quot;modo&quot;: &quot;grafico&quot;}'></div></div>",
    "note": "Os alunos descrevem uma barra sem mencionar a cor. A prévia tem texto visível e barra decorativa aria-hidden; a referência nativa oferece texto acessível, sem depender da cor. Testar leitor de tela real permanece tarefa da equipe.",
    "source": "React Native · acessibilidade",
    "url": "https://reactnative.dev/docs/accessibility",
    "time": "42–44 min",
    "kind": "PRÁTICA GUIADA",
    "id": "s22"
  },
  {
    "title": "Desafio: encontre um erro antes da oficina",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Preveja → teste → explique</h2><p class=\"\"><strong>1.</strong> Filtre “Lugar” e busque “praça”.</p><p class=\"\"><strong>2.</strong> Vá ao resumo. Ele descreve o recorte?</p><p class=\"\"><strong>3.</strong> Busque “zzzz” e depois limpe.</p><p class=\"\"><strong>4.</strong> Simule erro e recupere a lista.</p><div class=\"reveal\"><button type=\"button\" data-answer aria-expanded=\"false\">Conferir uma resposta</button><div class=\"answer\" hidden>No passo 1 fica só Praça das conversas. O recorte tem 1 memória e 1 categoria. O termo zzzz não apaga a base.</div></div></article><div class=\"device\" data-demo='{&quot;projeto&quot;: &quot;memorias&quot;, &quot;modo&quot;: &quot;completo&quot;}'></div></div>",
    "note": "Dupla: uma pessoa opera e outra explica. Não marcar teste como realizado apenas por conhecer a resposta. Se uma etapa da Aula6 estiver pendente, registrar sem inventar execução.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "44–47 min",
    "kind": "PRÁTICA GUIADA",
    "id": "s23"
  },
  {
    "title": "O encontro termina com código E evidências",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Durante os próximos 50 minutos</h2><p class=\"\"><strong>25 min:</strong> configurar e testar no laboratório.</p><p class=\"\"><strong>20 min:</strong> aplicar uma mudança no app da equipe.</p><p class=\"\"><strong>5 min:</strong> registrar, revisar e exportar a ficha.</p></article><article class=\"panel blue\"><h2>Acompanhe cada pontuação</h2><p class=\"\">O laboratório corrige escolhas no modelo didático.</p><p class=\"\">O projeto tem testes de código e nota ao executar <code>npm run nota</code>. A rubrica registra evidências da interface.</p><div class=\"rule\">Um 10,0 nos testes de lógica não comprova execução em aparelho. Registre o que foi testado e as pendências.</div></article></div>",
    "note": "Conclui os 50min de aula guiada. Esta divisão operacionaliza o pedido do docente e a ênfase prática do plano. O arquivo de ficha não envia dados automaticamente e não transforma a pontuação formativa em I1/I2/I3.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "47–50 min",
    "kind": "EXPLICAR E DEMONSTRAR",
    "id": "s24"
  },
  {
    "title": "Apoio · o que alterar no projeto existente?",
    "body": "<div class=\"two\"><article class=\"panel\"><h2>Se a equipe já tem um app</h2><p>Preserve navegação, cadastro, tipos e providers.</p><p>Integre busca, filtros, estados e resumos ao mesmo recorte.</p><p>Em EDA, mantenha ações e indicadores separados: o ID de um indicador não abre o detalhe de uma ação.</p><p><a href=\"https://github.com/thalesvalente/teaching-mobile/blob/main/lessons/aula-07-estado-filtros/apoio/INTEGRAR.md\">Guia de integração e mapeamento</a></p></article><article class=\"panel\"><h2>Projeto inicial com missões</h2><p>Há uma base própria para começar a oficina, com tarefas e testes de lógica.</p><p><a href=\"https://github.com/thalesvalente/teaching-mobile/blob/main/lessons/aula-07-estado-filtros/projeto/README.md\">Abrir projeto e instruções</a> · <a href=\"https://github.com/thalesvalente/teaching-mobile/blob/main/lessons/aula-07-estado-filtros/projeto/MISSOES.md\">Ler as missões</a></p><p>Execute <code>npm run nota</code> para acompanhar 20 critérios, de 0 a 10, e gerar o resultado imprimível.</p><div class=\"rule\">Cada frente mantém seu resultado: aula, simulador, código e evidências práticas.</div></article></div>",
    "note": "Consulta durante a oficina. A base inicial é opcional para quem ainda não tem aplicativo. As funções puras têm avaliação real em npm run nota, separada da autoavaliação da interface. Mapeie IDs/categorias e nunca trate indicador EDA como uma ação cadastrada na Aula6.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "Consulta / oficina",
    "kind": "APOIO",
    "id": "s25"
  },
  {
    "title": "Apoio · preparar portfólio e Incremento 1",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Registros verificáveis</h2><p class=\"\">Arquivo alterado e commit no repositório da equipe.</p><p class=\"\">Um teste executado, resultado e eventual pendência.</p><p class=\"\">O que cada componente explicou ou corrigiu.</p><p class=\"\">Uso relevante de IA e validação humana.</p></article><article class=\"panel blue\"><h2>Próxima consolidação prevista</h2><p class=\"\">I1: portfólio; I2: prática individual; I3: Incremento 1.</p><p class=\"\">Os instrumentos e pesos permanecem os do plano.</p><div class=\"rule\">Não use a pontuação do simulador como nota oficial automática.</div></article></div>",
    "note": "Consulta. Plano seção13.1 e encontro8. As datas do documento são planejadas; não lançar diário por este material. Não inventar commit ou teste de dispositivo. A nota automática não cobre explicação e alteração individual.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "Consulta / oficina",
    "kind": "APOIO",
    "id": "s26"
  },
  {
    "title": "Referências e limites do material",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Base do planejamento</h2><p class=\"\">Plano de Ensino de Mobile 2026.2, encontro 7: estado, filtros e visualização de dados.</p><p class=\"\">Continuidade: listas, estado, cartões e navegação das Aulas 5 e 6.</p><p class=\"small\">Casos, períodos fictícios, comandos da oficina e rubrica formativa: elaboração didática.</p></article><article class=\"panel blue\"><h2>Consulta técnica</h2><p class=\"\"><a href=\"https://reactnative.dev/docs/flatlist\" target=\"_blank\" rel=\"noopener\">React Native · FlatList</a></p><p class=\"\"><a href=\"https://pt-br.react.dev/learn/choosing-the-state-structure\" target=\"_blank\" rel=\"noopener\">React · estrutura do estado</a></p><p class=\"\"><a href=\"https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/filter\" target=\"_blank\" rel=\"noopener\">JavaScript · filter</a></p><p class=\"\"><a href=\"https://reactnative.dev/docs/accessibility\" target=\"_blank\" rel=\"noopener\">React Native · acessibilidade</a></p><p class=\"small\">Sem emulação Expo na página, sem dados reais e sem chamadas de API.</p></article></div>",
    "note": "Plano anexado identifica-se como rascunho com pendência de calendário. Conteúdo do encontro7 é a referência solicitada; não afirmar aprovação no SUAP. Documentação técnica consultada em 12/10/2026; sem atualização de dependências do projeto.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "Consulta / oficina",
    "kind": "APOIO",
    "id": "s27"
  },
  {
    "title": "Ficha da atividade · registrem o trabalho da equipe",
    "body": "<div class=\"two\"><article class=\"panel \"><h2>Nomes, escolhas, testes e evidências</h2><p class=\"\">Escolham um projeto uma única vez.</p><p class=\"\">Dividam os papéis: implementar, conferir e explicar.</p><p class=\"\">A nota é atualizada durante as escolhas. Usem as dicas, repitam testes e guardem o rascunho.</p><div class=\"rule\">O PDF pode ser parcial: mantenham questões em branco e a pontuação já conquistada.</div></article><article class=\"panel blue\"><h2>Abrir a oficina</h2><a class=\"button\" href=\"atividade.html\" target=\"oficina07\" rel=\"noopener\">Abrir ficha e atividade · 50 min →</a><p class=\"\">O PDF traz os nomes, professor, pontuação por critério e o que ficou pendente.</p><p class=\"small\">Os nomes ficam no navegador e nos arquivos baixados. Não publiquem a ficha identificada em repositório público.</p></article></div>",
    "note": "Última tela: abre a ficha. Há exportação direta de PDF e rascunho JSON. A reprodução de nomes identifica autores declarados; não autentica autoria nem resultado.",
    "source": "Plano · encontro 7",
    "url": null,
    "time": "Consulta / oficina",
    "kind": "APOIO",
    "id": "s28"
  }
];
