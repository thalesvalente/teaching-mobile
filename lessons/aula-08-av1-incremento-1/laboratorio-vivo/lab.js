/**
 * AULA 08 | Laboratório Vivo: tutoria conceitual e testes observáveis.
 * O código editado roda exclusivamente no iframe de origem opaca (preview.js).
 * Este arquivo organiza a aula e recebe os resultados dos testes comportamentais;
 * não interpreta manualmente o código do aluno nem atribui nota oficial.
 */
(() => {
  'use strict';

  // Cada tarefa informa: o que fazer, onde localizar, o que observar e como verificar.
  // Isso evita o antigo problema de desafios separados do arquivo completo.
  const tasks = [
  {
    "id": "M1-01",
    "xp": 5,
    "name": "Erro tem prioridade sobre carregamento",
    "phase": 1,
    "minutes": 3,
    "focus": "// [03] MÁQUINA DE ESTADOS",
    "type": "code",
    "do": "Simule carregamento e erro ao mesmo tempo. O resultado deve ser erro.",
    "observe": "Identifique precedência das condições.",
    "why": "Um spinner não pode ocultar uma falha ativa.",
    "hint": "Teste a ordem dos ifs; não basta trocar o texto da tela."
  },
  {
    "id": "M1-02",
    "xp": 5,
    "name": "Carregando sem erro",
    "phase": 1,
    "minutes": 3,
    "focus": "// [03] MÁQUINA DE ESTADOS",
    "type": "code",
    "do": "Simule carregando=true com erro=null.",
    "observe": "Ajuste o estado da tela.",
    "why": "O indicador deve informar que existe operação em curso.",
    "hint": "Compare o retorno da função com o contrato de M1."
  },
  {
    "id": "M1-03",
    "xp": 5,
    "name": "Coleção realmente vazia",
    "phase": 1,
    "minutes": 3,
    "focus": "// [03] MÁQUINA DE ESTADOS",
    "type": "code",
    "do": "Fonte=0, visível=0 deve ser vazio.",
    "observe": "Implemente o diagnóstico da fonte sem dados.",
    "why": "A mensagem deve refletir ausência de dados de origem.",
    "hint": "Investigue a diferença entre tamanho da fonte e recorte."
  },
  {
    "id": "M1-04",
    "xp": 5,
    "name": "Busca sem resultados não é coleção vazia",
    "phase": 1,
    "minutes": 3,
    "focus": "// [03] MÁQUINA DE ESTADOS",
    "type": "code",
    "do": "Fonte=4, visível=0 deve ser sem-resultados.",
    "observe": "Separe zero resultados do caso de base vazia.",
    "why": "O aluno deve receber orientação para limpar os filtros.",
    "hint": "Avalie os dois contadores de entrada."
  },
  {
    "id": "M1-05",
    "xp": 5,
    "name": "Dados prontos em estado estável",
    "phase": 1,
    "minutes": 3,
    "focus": "// [03] MÁQUINA DE ESTADOS",
    "type": "code",
    "do": "Fonte=4, visível=2 deve produzir pronto.",
    "observe": "Finalize as transições da máquina de estados.",
    "why": "O resultado deve ser estável e coerente.",
    "hint": "Verifique o caso positivo após os negativos."
  },
  {
    "id": "M2-01",
    "xp": 5,
    "name": "Pesquisa ignora caixa e acentos",
    "phase": 2,
    "minutes": 6,
    "focus": "// [04] FILTRO",
    "type": "code",
    "do": "Busque PRAÇA com espaços; devem surgir dois registros.",
    "observe": "Normalize e filtre sem perder acentuação na saída.",
    "why": "A busca deve encontrar praça mesmo quando o termo digitado não tem acento.",
    "hint": "Compare os textos em cópias de leitura."
  },
  {
    "id": "M2-02",
    "xp": 5,
    "name": "Categoria e período combinados (AND)",
    "phase": 2,
    "minutes": 6,
    "focus": "// [04] FILTRO",
    "type": "code",
    "do": "Categoria Lugar + período Noite retorna m-03.",
    "observe": "Aplique categoria e período juntos.",
    "why": "A lista final precisa satisfazer ambos os critérios.",
    "hint": "Comece por um predicado verdadeiro para todos os filtros ativos."
  },
  {
    "id": "M2-03",
    "xp": 5,
    "name": "Ordenação Z-A com IDs íntegros",
    "phase": 2,
    "minutes": 7,
    "focus": "// [04] FILTRO",
    "type": "code",
    "do": "Ordem Z-A deve devolver m-02,m-03,e-01,m-01.",
    "observe": "Ordene a projeção de leitura sem alterar os IDs.",
    "why": "Itens preservam identidade, mesmo quando mudam de posição.",
    "hint": "Diferencie título exibido de identificador opaco."
  },
  {
    "id": "M2-04",
    "xp": 5,
    "name": "A fonte não muda e o resultado preserva os objetos",
    "phase": 2,
    "minutes": 6,
    "focus": "// [04] FILTRO",
    "type": "code",
    "do": "Busque mapa; resultado m-03 deve ser o mesmo objeto da fonte.",
    "observe": "Preserve o array original e as referências de objetos.",
    "why": "Limpar filtros deve revelar a fonte íntegra.",
    "hint": "Trabalhe com cópia rasa do array e teste a identidade."
  },
  {
    "id": "M3-01",
    "xp": 5,
    "name": "Detalhe usa ID opaco exato",
    "phase": 3,
    "minutes": 5,
    "focus": "// [05] NAVEGAÇÃO E FORMULÁRIO",
    "type": "code",
    "do": "Abra detalhe m-03 e confira Mapa da praça.",
    "observe": "Localize o registro pelo ID exato.",
    "why": "O detalhe correto deve aparecer sem colisão.",
    "hint": "Compare strings exatas, não posições da lista."
  },
  {
    "id": "M3-02",
    "xp": 5,
    "name": "ID desconhecido devolve null",
    "phase": 3,
    "minutes": 6,
    "focus": "// [05] NAVEGAÇÃO E FORMULÁRIO",
    "type": "code",
    "do": "Consulte m-999; o resultado obrigatório é null.",
    "observe": "Implemente retorno seguro para ID ausente.",
    "why": "Nenhum registro errado deve abrir.",
    "hint": "Separe ausência de objeto de erro de interface."
  },
  {
    "id": "M3-03",
    "xp": 5,
    "name": "Validação aceita valores corretos após trim",
    "phase": 3,
    "minutes": 6,
    "focus": "export function validarFormulario",
    "type": "code",
    "do": "Título com espaços externos e conteúdo válido deve passar.",
    "observe": "Aceite dados corretos após trim.",
    "why": "A tela só pode gravar quando todos os campos atendem ao contrato.",
    "hint": "Confira os limites do título, descrição e categoria."
  },
  {
    "id": "M3-04",
    "xp": 5,
    "name": "Validação rejeita título/descrição insuficientes",
    "phase": 3,
    "minutes": 6,
    "focus": "export function validarFormulario",
    "type": "code",
    "do": "Título ab e descrição curta devem falhar separadamente.",
    "observe": "Retorne erros localizados sem alterar a fonte.",
    "why": "Usuário precisa saber exatamente qual campo corrigir.",
    "hint": "Verifique campos e mensagens como estrutura, não só booleano."
  },
  {
    "id": "M3-05",
    "xp": 5,
    "name": "Título repetido após normalizar acento/caixa é inválido na mesma trilha",
    "phase": 3,
    "minutes": 6,
    "focus": "export function validarFormulario",
    "type": "code",
    "do": "Fotografia da PRACA duplica Fotografia da praça na mesma trilha.",
    "observe": "Impeça duplicação sem proibir homônimos de trilhas distintas.",
    "why": "Duas descrições não podem ganhar título duplicado por variação de escrita.",
    "hint": "Normalize apenas para comparação, preserve texto da pessoa."
  },
  {
    "id": "M3-06",
    "xp": 5,
    "name": "Inserção cria novo array sem mutar a fonte",
    "phase": 3,
    "minutes": 6,
    "focus": "export function inserirImutavel",
    "type": "code",
    "do": "Insira m-05; origem não deve mudar e novo item deve ficar no fim.",
    "observe": "Implemente inserção sem mutação.",
    "why": "React precisa observar nova referência de estado.",
    "hint": "Teste referência de array e conteúdo antes/depois."
  },
  {
    "id": "M4-01",
    "xp": 5,
    "name": "Idempotência: repetir toque/ID não duplica",
    "phase": 4,
    "minutes": 5,
    "focus": "export function inserirImutavel",
    "type": "code",
    "do": "Envie duas vezes x-2 e confira apenas um registro.",
    "observe": "Garanta idempotência por identificador.",
    "why": "O segundo toque não deve aumentar a lista.",
    "hint": "Faça o segundo retorno sobre a lista já atualizada."
  },
  {
    "id": "M4-02",
    "xp": 5,
    "name": "Resumo conta total e IDs sem perda",
    "phase": 4,
    "minutes": 5,
    "focus": "export function resumir",
    "type": "code",
    "do": "Quatro itens esperados e a ordem dos quatro IDs.",
    "observe": "Implemente total e lista de IDs sem perdas.",
    "why": "Resumo acompanha filtros e ordenação.",
    "hint": "Use os registros recebidos, não uma contagem global."
  },
  {
    "id": "M4-03",
    "xp": 5,
    "name": "Resumo contabiliza categorias corretamente",
    "phase": 4,
    "minutes": 5,
    "focus": "export function resumir",
    "type": "code",
    "do": "Lugar=2, Evento=1, Indicador=1.",
    "observe": "Conte categorias a partir da lista real.",
    "why": "Indicadores do cartão e itens devem concordar.",
    "hint": "Evite incrementar categorias ausentes de forma ambígua."
  },
  {
    "id": "M4-04",
    "xp": 5,
    "name": "Resumo de base vazia é seguro",
    "phase": 4,
    "minutes": 5,
    "focus": "export function resumir",
    "type": "code",
    "do": "Resumo [] deve ser total 0, ids [] e categorias {}.",
    "observe": "Implemente comportamento seguro quando não há registros.",
    "why": "Não deve haver NaN, undefined nem exceção.",
    "hint": "Inicialize explicitamente os acumuladores."
  },
  {
    "id": "M4-05",
    "xp": 5,
    "name": "Resumo não modifica nem reordena a fonte",
    "phase": 4,
    "minutes": 5,
    "focus": "export function resumir",
    "type": "code",
    "do": "Executar resumo não pode alterar ou reordenar a fonte.",
    "observe": "Prove que o resumo é puro e determinístico.",
    "why": "Depois de resumir, a coleção conserva a ordem e os dados.",
    "hint": "Compare snapshots da fonte antes e depois da chamada."
  }
];
  const phases = [
  {
    "name": "Ciclo 1 — Estados sob falhas",
    "objective": "Priorizar erro, carregamento, vazio e sem resultados.",
    "time": "15 min",
    "xp": 25
  },
  {
    "name": "Ciclo 2 — Filtros e imutabilidade",
    "objective": "Combinar filtros, normalizar consultas e preservar IDs e dados.",
    "time": "25 min",
    "xp": 20
  },
  {
    "name": "Ciclo 3 — Fluxo e validação",
    "objective": "Navegar por IDs opacos, validar e inserir sem corrupção.",
    "time": "35 min",
    "xp": 30
  },
  {
    "name": "Ciclo 4 — Regressão e defesa",
    "objective": "Idempotência, agregações, casos vazios e evidências reais.",
    "time": "25 min",
    "xp": 25
  }
];
  const TOTAL_XP = tasks.reduce((sum, task) => sum + task.xp, 0);
  // Tutorial da missão: conceito e teste sem deslocar o estudante da bancada.
  // Os textos são renderizados como texto, sem executar HTML externo.
  const tutorial = {
  "M1-01": {
    "concept": "Prioridade dos estados não é visual: é uma regra observável.",
    "test": "Identifique precedência das condições."
  },
  "M1-02": {
    "concept": "Carregamento só deve aparecer quando não há falha prioritária.",
    "test": "Ajuste o estado da tela."
  },
  "M1-03": {
    "concept": "Uma coleção vazia difere de um filtro que não encontrou correspondências.",
    "test": "Implemente o diagnóstico da fonte sem dados."
  },
  "M1-04": {
    "concept": "O filtro pode resultar em zero mesmo com a coleção cheia.",
    "test": "Separe zero resultados do caso de base vazia."
  },
  "M1-05": {
    "concept": "Estado pronto deve exigir ausência de erro/carregamento.",
    "test": "Finalize as transições da máquina de estados."
  },
  "M2-01": {
    "concept": "Busca robusta exige normalização Unicode e tratamento de acentos.",
    "test": "Normalize e filtre sem perder acentuação na saída."
  },
  "M2-02": {
    "concept": "Filtros simultâneos devem ser combinados por AND.",
    "test": "Aplique categoria e período juntos."
  },
  "M2-03": {
    "concept": "Ordenação determinística facilita testes e navegação estável.",
    "test": "Ordene a projeção de leitura sem alterar os IDs."
  },
  "M2-04": {
    "concept": "Imutabilidade evita bugs invisíveis em React e em filtros subsequentes.",
    "test": "Preserve o array original e as referências de objetos."
  },
  "M3-01": {
    "concept": "ID de rota é opaco: texto não é convertido para número.",
    "test": "Localize o registro pelo ID exato."
  },
  "M3-02": {
    "concept": "Navegação defensiva lida com links inválidos.",
    "test": "Implemente retorno seguro para ID ausente."
  },
  "M3-03": {
    "concept": "Validação deve normalizar antes de julgar comprimento.",
    "test": "Aceite dados corretos após trim."
  },
  "M3-04": {
    "concept": "Validação robusta produz mensagens específicas por campo.",
    "test": "Retorne erros localizados sem alterar a fonte."
  },
  "M3-05": {
    "concept": "Um registro duplicado pode ter caixa e acento diferentes.",
    "test": "Impeça duplicação sem proibir homônimos de trilhas distintas."
  },
  "M3-06": {
    "concept": "Inserir registro exige novo array e fonte intacta.",
    "test": "Implemente inserção sem mutação."
  },
  "M4-01": {
    "concept": "Dois toques rápidos não podem criar duas cópias do mesmo ID.",
    "test": "Garanta idempotência por identificador."
  },
  "M4-02": {
    "concept": "Resumo deve ser consistente com o recorte visível.",
    "test": "Implemente total e lista de IDs sem perdas."
  },
  "M4-03": {
    "concept": "Agrupamentos não podem contar um item em duas categorias.",
    "test": "Conte categorias a partir da lista real."
  },
  "M4-04": {
    "concept": "Entrada vazia é caso normal, não exceção.",
    "test": "Implemente comportamento seguro quando não há registros."
  },
  "M4-05": {
    "concept": "Regressão é quando um conserto estraga um contrato anterior.",
    "test": "Prove que o resumo é puro e determinístico."
  }
};

  const key = 'ifma-mobile-aula08-lab-v1'; // Nunca sobrescreve rascunhos da versão anterior.
  const byId = id => document.getElementById(id);
  const codeEditor = byId('code');
  const frame = byId('preview');
  const compilerStatus = byId('compiler-status');
  const fileContext = byId('editor-context');
  const readOnly = byId('readonly-code');

  // Mapa de arquivos reais: um editável e dois exemplos integrais somente leitura.
  const panels = { shared: '', route: `/** ROTA EXPO: app/aula08.tsx */
import ProjetoUniversal from '../shared/ProjetoUniversal';
export default ProjetoUniversal;
// Integre o motor do domínio em projeto/src/engine.mjs e execute npm run nota.
`, vue: `/** CONTRATOS AVANÇADOS DA AV1 */
// Funções exigidas: estadoTela, filtrarOrdenar, obterPorId,
// validarFormulario, inserirImutavel, resumir.
// Os 20 testes são os mesmos do projeto Expo da Aula 08.
// Todos os dados de treinamento são fictícios.
// Prévia estreita de navegador NÃO substitui teste em Android/iOS real.
` };

  let activeFile = 'shared';
  let activeIndex = 0;
  let ready = false, sourceLoaded = false, lastCompiled = false, pending = null;
  let revealPreviewAfterExplicitRun = false;
  const nonce = 'aula08-' + String(Date.now()) + '-' + Math.random().toString(36).slice(2);
  // XP são conquistas históricas e cumulativas, não a nota de uma fotografia
  // instantânea do código. A validação atual é indicada no feedback separado.
  const passed = Object.fromEntries(tasks.map(task => [task.id, false]));
  const codeTaskIds = tasks.filter(task => task.type === 'code').map(task => task.id);
  let sourceRevision = 0;    // Muda apenas quando o TSX é editado/restaurado.
  let runSequence = 0;       // Evita aceitar respostas de compilações antigas.
  let reviewPending = false; // Conferência coletiva em curso.
  let reviewAfterCompile = false;
  const completedDetail = {};

  // Em vez de quatorze cartões em outra seção, há UMA missão ativa.
  // O aluno sempre lê a instrução, edita e testa na mesma bancada.
  const feedbackState = Object.fromEntries(tasks.map(t => [t.id, { kind: 'pending', text: 'Pendente · execute e confira nesta bancada.' }]));
  const select = byId('mission-select');
  const quizBank = byId('quiz-bank');

  function buildMissionIndex() {
    phases.forEach((phase, phaseIndex) => {
      const group = document.createElement('optgroup');
      group.label = phase.name;
      tasks.forEach((task, index) => {
        if (task.phase !== phaseIndex + 1) return;
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = `${String(index + 1).padStart(2, '0')} · ${task.name}`;
        group.appendChild(option);
      });
      select.appendChild(group);
    });
  }
  buildMissionIndex();

  // Os quizzes fazem parte do próprio enunciado; NÃO é preciso procurá-los embaixo.
  const quizData = {
    map: [
      ['Qual recurso React guarda o texto durante a digitação?', [
        ['a', 'useState e seu par [valor, setValor]'],
        ['b', 'StyleSheet.create'],
        ['c', 'Uma variável global fora do componente'],
      ]],
      ['Qual propriedade chama setTitulo quando o usuário digita?', [
        ['a', 'backgroundColor'], ['b', 'onChangeText'], ['c', 'accessibilityLabel'],
      ]],
    ],
    quiz: [
      ['Por que um único TSX aparece nas duas prévias?', [
        ['a', 'React Native Web renderiza componentes compatíveis no navegador.'],
        ['b', 'O navegador se torna um Android real.'],
        ['c', 'Vue converte automaticamente para React.'],
      ]],
      ['Como executar o mesmo componente em um celular de verdade?', [
        ['a', 'Somente estreitando a janela do navegador.'],
        ['b', 'Integrando o arquivo a um projeto React Native/Expo compatível.'],
        ['c', 'Apagando todas as aulas anteriores.'],
      ]],
    ],
  };
  function buildQuizBank() {
    for (const [id, questions] of Object.entries(quizData)) {
      const group = document.createElement('div');
      group.dataset.quiz = id;
      group.hidden = true;
      questions.forEach(([question, options], i) => {
        const field = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = question;
        field.append(legend);
        for (const [value, label] of options) {
          const choice = document.createElement('label');
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = `${id}-q${i + 1}`;
          input.value = value;
          choice.append(input, document.createTextNode(label));
          field.append(choice);
        }
        group.append(field);
      });
      quizBank.append(group);
    }
  }
  buildQuizBank();

  function setStatus(message, error = false) {
    compilerStatus.textContent = message;
    compilerStatus.classList.toggle('error', error);
  }
  function getScore() { return tasks.reduce((sum, t) => sum + (passed[t.id] ? t.xp : 0), 0); }

  function activeTask() { return tasks[activeIndex]; }
  function updateGuide() {
    const task = activeTask();
    byId('guide-number').textContent = `MISSÃO ${String(activeIndex + 1).padStart(2, '0')} / 20 · CICLO ${task.phase} · ${activeIndex < 10 ? 'NÚCLEO' : 'DESAFIO'}`;
    byId('guide-time').textContent = `${task.minutes} min · +${task.xp} XP`;
    byId('guide-title').textContent = task.name;
    byId('guide-do').textContent = task.do;
    byId('guide-observe').textContent = task.observe;
    byId('guide-why').textContent = task.why;
    byId('guide-concept').textContent = tutorial[task.id].concept;
    const instruction = byId('guide-test');
    const label = document.createElement('strong');
    label.textContent = 'Teste concreto: ';
    instruction.replaceChildren(label, document.createTextNode(tutorial[task.id].test));
    byId('guide-line').textContent = `Localizar em ProjetoUniversal.tsx: ${task.focus}`;
    byId('guide-hint').textContent = task.hint;
    byId('guide-hint-box').open = false;
    byId('guide-prev').disabled = activeIndex === 0;
    byId('guide-next').disabled = activeIndex === tasks.length - 1;
    byId('mission-counter').textContent = `${String(activeIndex + 1).padStart(2, '0')} / 20`;
    select.value = task.id;
    const needsQuiz = task.type === 'quiz';
    quizBank.hidden = !needsQuiz;
    // Questões no topo do enunciado: no celular aparecem antes dos detalhes,
    // enquanto o botão de conferir permanece sempre fixo no rodapé da missão.
    if (needsQuiz) byId('guide-title').after(quizBank);
    else byId('guide-line').after(quizBank);
    quizBank.querySelectorAll('[data-quiz]').forEach(group => { group.hidden = group.dataset.quiz !== task.id; });
    byId('guide-check').textContent = needsQuiz ? 'Conferir respostas' : 'Conferir missão';
    const feedback = feedbackState[task.id];
    const guideFeedback = byId('guide-feedback');
    // O XP já ganho não some quando o aluno segue editando. Mas uma falha
    // na versão atual é mostrada claramente, sem falsa aprovação técnica.
    if (passed[task.id] && feedback.kind === 'failed') {
      guideFeedback.className = 'mission-feedback failed';
      guideFeedback.textContent = `${task.type === 'quiz' ? 'Revisar resposta atual' : 'Revisar código atual'} · +${task.xp} XP conquistados preservados. ${feedback.text}`;
    } else if (passed[task.id] && feedback.kind === 'pending' &&
               feedback.text !== 'Pendente · execute e confira nesta bancada.') {
      guideFeedback.className = 'mission-feedback pending';
      guideFeedback.textContent = `✓ +${task.xp} XP já conquistados · ${feedback.text}`;
    } else {
      guideFeedback.className = 'mission-feedback ' + (passed[task.id] ? 'success' : feedback.kind);
      guideFeedback.textContent = passed[task.id]
        ? `✓ Aprovado · +${task.xp} XP · ${completedDetail[task.id] || 'verificação concluída'}`
        : feedback.text;
    }
  }
  function setActive(target) {
    const index = typeof target === 'number' ? target : tasks.findIndex(t => t.id === target);
    if (index < 0 || index >= tasks.length) return;
    activeIndex = index;
    updateGuide();
    // Só reinicia o scroll do ENUNCIADO, não desloca toda a página.
    byId('mission-copy').scrollTop = 0;
    save();
  }
  function render() {
    const score = getScore();
    byId('xp-top').textContent = String(score);
    byId('xp-evidence').textContent = String(score);
    byId('progress-fill').style.width = score + '%';
    byId('progress').setAttribute('aria-valuenow', String(score));
    const completed = tasks.filter(t => passed[t.id]).length;
    byId('score-summary').textContent = `${completed} de ${tasks.length} exercícios concluídos`;
    byId('evidence-count').textContent = `${completed} concluídos · ${tasks.length - completed} pendentes`;
    select.querySelectorAll('option').forEach((option, index) => {
      const task = tasks.find(t => t.id === option.value);
      const number = tasks.indexOf(task) + 1;
      option.textContent = `${passed[task.id] ? '✓ ' : ''}${String(number).padStart(2, '0')} · ${task.name}`;
    });
    const list = byId('evidence-list'); list.replaceChildren();
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = `${passed[task.id] ? '✓' : '○'} ${task.name}: ${passed[task.id] ? task.xp + ' XP' : 'pendente'}`;
      list.appendChild(li);
    });
    updateGuide();
  }
  function readAnswers() {
    const values = {};
    quizBank.querySelectorAll('input[type="radio"]:checked').forEach(input => { values[input.name] = input.value; });
    return values;
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify({
        code: panels.shared, answers: readAnswers(), activeTask: activeTask().id,
        note: byId('observacao').value, nativeNote: byId('limite-real').value,
        // Matrículas NÃO entram no salvamento AUTOMÁTICO do navegador.
        team: (() => {const data=window.WebTeam?.snapshot?.();return data?
          {...data,members:data.members.map(m=>window.WebTeam?.rosterReadOnly?({}):({name:m.name}))}:null;})(),
        completed: tasks.filter(t => passed[t.id]).map(t => t.id),
        details: Object.fromEntries(tasks.filter(t => passed[t.id]).map(t => [t.id, completedDetail[t.id] || 'Concluído em sessão anterior'])),
      }));
    } catch { /* armazenamento opcional; a bancada funciona sem ele */ }
  }
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(key) || 'null'); } catch { /* dado antigo inválido */ }
  if (saved && typeof saved === 'object') {
    // Retomar pontuação formativa previamente conferida; não equivale a nota.
    if (Array.isArray(saved.completed) && saved.completed.length <= tasks.length) {
      for (const id of saved.completed) {
        if (typeof id !== 'string' || !Object.hasOwn(passed, id)) continue;
        passed[id] = true;
        completedDetail[id] = typeof saved.details?.[id] === 'string'
          ? saved.details[id].slice(0, 250) : 'Concluído em sessão anterior';
      }
    }
    if (typeof saved.note === 'string') byId('observacao').value = saved.note;
    if (typeof saved.nativeNote === 'string') byId('limite-real').value = saved.nativeNote;
    if (saved.answers && typeof saved.answers === 'object') {
      quizBank.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = saved.answers[input.name] === input.value; });
    }
    if (typeof saved.activeTask === 'string') {
      const index = tasks.findIndex(t => t.id === saved.activeTask);
      if (index >= 0) activeIndex = index;
    }
  }
  // O tutorial V4 abre com a fonte atualizada. O código anterior continua
  // disponível para download; não é sobrescrito nem migrado sem consentimento.
  let legacy = null, legacyTag = '';
  for (const [storageKey, tag] of [['ifma-web-aula08-lab-v2', 'v3'], ['ifma-web-aula08-lab-v1', 'v1']]) {
    try {
      const prior = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (typeof prior?.code === 'string' && prior.code.length < 30000) {
        legacy = prior; legacyTag = tag; break;
      }
    } catch { /* ignorar rascunho inválido */ }
  }
  if (legacy) {
    byId('legacy-export').hidden = false;
    byId('legacy-export').textContent = 'Baixar meu código anterior';
    byId('migration-note').hidden = false;
  }
  render();

  async function loadSource() {
    try {
      const response = await fetch('./shared/ProjetoUniversal.tsx', { cache: 'no-store' });
      if (!response.ok) throw Error(`HTTP ${response.status}`);
      const initial = await response.text();
      panels.shared = typeof saved?.code === 'string' && saved.code.length < 30000 ? saved.code : initial;
      window.__IFMA_LAB_INITIAL__ = initial;
      codeEditor.value = panels.shared;
      sourceLoaded = true;
      setStatus('Arquivo completo carregado. Preparando execução nas duas telas…');
      if (ready) run({ initial: true });
    } catch (error) { setStatus(`Não foi possível carregar o arquivo: ${error.message}. Use HTTP/HTTPS, não file://.`, true); }
  }
  function send(type, fields = {}) {
    if (!ready || !sourceLoaded || !frame.contentWindow) { setStatus('Código ou prévia indisponível.', true); return false; }
    frame.contentWindow.postMessage({ from: 'ifma-mobile-a08-host', type, token: nonce, ...fields }, '*');
    return true;
  }
  function setPane(which) {
    const pane = which === 'preview' ? 'preview' : 'code';
    byId('conteudo').dataset.pane = pane;
    document.querySelectorAll('[data-pane]').forEach(button => {
      const chosen = button.dataset.pane === pane;
      button.setAttribute('aria-selected', String(chosen));
      button.tabIndex = chosen ? 0 : -1;
    });
  }
  setPane('code');
  const expandButton = byId('expand-preview');
  expandButton.addEventListener('click', () => {
    const workspace = byId('laboratorio');
    const expanded = workspace.dataset.expandedPreview !== 'true';
    workspace.dataset.expandedPreview = String(expanded);
    expandButton.setAttribute('aria-pressed', String(expanded));
    expandButton.textContent = expanded ? 'Voltar à divisão' : 'Ampliar prévias';
  });
  document.querySelectorAll('[data-pane]').forEach(button => button.addEventListener('click', () => setPane(button.dataset.pane)));
  function locate() {
    const task = activeTask();
    showFile('shared');
    if (!panels.shared) return;
    const pos = panels.shared.indexOf(task.focus);
    if (pos < 0) {
      feedbackState[task.id] = { kind: 'failed', text: 'Trecho não encontrado: reveja o nome da declaração no arquivo completo.' };
      updateGuide(); return;
    }
    const linesBefore = panels.shared.slice(0, pos).split('\n').length;
    const lineHeight = Number.parseFloat(getComputedStyle(codeEditor).lineHeight) || 21;
    setPane('code');
    byId('laboratorio').dataset.expandedPreview = 'false';
    expandButton.setAttribute('aria-pressed', 'false');
    expandButton.textContent = 'Ampliar prévias';
    codeEditor.focus({ preventScroll: true });
    codeEditor.setSelectionRange(pos, pos + task.focus.length);
    codeEditor.scrollTop = Math.max(0, (linesBefore - 6) * lineHeight);
    byId('guide-line').textContent = `↳ ProjetoUniversal.tsx · linha ${linesBefore} destacada no editor ao lado`;
  }
  // Ao editar, a compilação antiga deixa de ser a versão atual,
  // porém as missões JÁ APROVADAS continuam creditadas.
  function markCodeForReview(message) {
    for (const task of tasks) {
      if (task.type === 'quiz') continue;
      feedbackState[task.id] = { kind: 'pending', text: message ||
        'Código atualizado. Execute e confira novamente se desejar; XP conquistados continuam no histórico.' };
    }
    lastCompiled = false;
    render();
  }
  function enableChecks() { byId('guide-check').disabled = false; }
  function setReviewBusy(busy) {
    for (const id of ['review-xp', 'review-xp-dialog']) byId(id).disabled = busy;
  }
  function stopPendingChecks() {
    pending = null;
    reviewPending = false;
    enableChecks();
    setReviewBusy(false);
  }
  function run({ initial = false } = {}) {
    if (!sourceLoaded) return;
    if (activeFile !== 'shared') showFile('shared');
    panels.shared = codeEditor.value;
    stopPendingChecks();
    revealPreviewAfterExplicitRun = !initial;
    lastCompiled = false;
    const thisRun = ++runSequence;
    if (reviewAfterCompile) setReviewBusy(true);
    if (send('RUN', { source: panels.shared, revision: sourceRevision, runId: thisRun }))
      setStatus('Compilando TSX completo para as duas prévias…');
    if (!initial) save();
  }
  function showFile(which) {
    activeFile = which;
    document.querySelectorAll('[data-file]').forEach(button => {
      const chosen = button.dataset.file === which;
      button.setAttribute('aria-selected', String(chosen));
      button.tabIndex = chosen ? 0 : -1;
    });
    byId('editor-source').setAttribute('aria-labelledby', 'tab-' + which);
    codeEditor.hidden = which !== 'shared';
    readOnly.hidden = which === 'shared';
    if (which !== 'shared') readOnly.textContent = panels[which];
    fileContext.textContent = which === 'shared' ? 'Arquivo inteiro: [01] importações → [07] estilos.' :
      which === 'route' ? 'Rota completa Expo Router · importa o componente, não substitui as outras telas.' :
      'Exemplo Vue completo · compare ref/v-model com useState/onChangeText.';
    setPane('code');
  }
  function checkQuiz(id) {
    const names = [id + '-q1', id + '-q2'];
    const answers = names.map(name => quizBank.querySelector(`input[name="${name}"]:checked`)?.value || '');
    if (answers.some(value => !value)) {
      feedbackState[id] = { kind: 'pending', text: 'Responda às duas perguntas aqui mesmo para conferir. Pode deixá-las pendentes.' };
      updateGuide();return;
    }
    const ok = answers[0] === 'a' && answers[1] === 'b';
    if (ok) {
      passed[id] = true; // XP ganho é acumulativo: conferir depois não o remove.
      completedDetail[id] = id === 'map' ? 'useState guarda; onChangeText atualiza.' :
        'React Native Web renderiza no navegador; Expo permite execução em dispositivo real.';
    }
    feedbackState[id] = ok
      ? { kind: 'success', text: '✓ Você identificou a relação entre código e resultado.' }
      : { kind: 'failed', text: id === 'map' ? 'Revise [04] e onChangeText no bloco [06].' : 'Prévia móvel não é execução Android/iOS; consulte Como funciona.' };
    render(); save();
  }
  function checkTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    if (task.type === 'quiz') { checkQuiz(id); return; }
    if (!ready || !lastCompiled) {
      feedbackState[id] = { kind: 'failed', text: 'Primeiro clique Executar. Depois confira esta missão aqui.' };
      updateGuide(); return;
    }
    if (pending !== null || reviewPending) return;
    pending = id;
    byId('guide-check').disabled = true;
    feedbackState[id] = { kind: 'pending', text: 'Testando o código executado nas duas prévias…' };
    updateGuide();
    if (!send('CHECK', { stage: id, revision: sourceRevision, runId: runSequence })) {
      pending = null; enableChecks();
    }
  }
  // Conferência única das doze missões técnicas. Útil para recuperar XP
  // que foram zerados pelo bug anterior, quando o código final ainda atende
  // aos critérios. Somente resultados PASS ganham XP, sem tirar os anteriores.
  function setReviewStatus(message, kind = '') {
    const node = byId('review-status');
    node.textContent = message;
    node.dataset.kind = kind;
  }
  function startReview() {
    if (reviewPending || pending !== null || !lastCompiled) return;
    reviewPending = true;
    setReviewBusy(true);
    byId('guide-check').disabled = true;
    setReviewStatus('Conferindo as 20 missões técnicas no código executado. Os XP já conquistados estão protegidos.');
    if (!send('CHECK_ALL', { stages: codeTaskIds, revision: sourceRevision, runId: runSequence })) {
      stopPendingChecks();
      setReviewStatus('Não foi possível iniciar a conferência. Seus XP foram preservados.', 'failed');
    }
  }
  function reviewProgress() {
    if (reviewPending || pending !== null) return;
    if (!ready || !sourceLoaded) {
      setReviewStatus('Aguarde o carregamento do laboratório para conferir.', 'failed');
      return;
    }
    if (!lastCompiled) {
      reviewAfterCompile = true;
      setReviewStatus('Executando o TSX atual antes de conferir as missões. Os XP anteriores permanecem.');
      run({ initial: true }); // Não troca de aba nem altera os pontos.
      return;
    }
    startReview();
  }
  for (const id of ['review-xp','review-xp-dialog'])
    byId(id).addEventListener('click', reviewProgress);
  select.addEventListener('change', () => setActive(select.value));
  byId('guide-prev').addEventListener('click', () => setActive(activeIndex - 1));
  byId('guide-next').addEventListener('click', () => setActive(activeIndex + 1));
  byId('guide-locate').addEventListener('click', locate);
  byId('guide-check').addEventListener('click', () => checkTask(activeTask().id));
  byId('run').addEventListener('click', () => run());
  byId('reset').addEventListener('click', () => {
    if (!window.__IFMA_LAB_INITIAL__) return;
    if (!confirm('Restaurar o arquivo original? O código que você editou será substituído, mas as observações continuam.')) return;
    panels.shared = window.__IFMA_LAB_INITIAL__;
    codeEditor.value = panels.shared;
    sourceRevision++;
    markCodeForReview('Código original restaurado. XP anteriores preservados como histórico de aprendizagem.');
    run();
  });
  codeEditor.addEventListener('input', () => {
    panels.shared = codeEditor.value;
    sourceRevision++;
    stopPendingChecks();
    reviewAfterCompile = false;
    markCodeForReview('Arquivo editado. Execute para conferir a nova versão; XP acumulados não diminuem.');
    save();
    setStatus('Código modificado. Seus XP foram preservados. Clique Executar para testar o novo arquivo.');
  });
  codeEditor.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();run();
    }
  });
  document.querySelectorAll('[data-file]').forEach(button => button.addEventListener('click', () => showFile(button.dataset.file)));
  quizBank.querySelectorAll('input[type="radio"]').forEach(input => input.addEventListener('change', () => {
    const id = input.name.startsWith('map-') ? 'map' : 'quiz';
    // Alterar a resposta NÃO retira os XP conquistados em conferência anterior.
    // O estado atual fica pendente até uma nova conferência conceitual.
    feedbackState[id] = { kind: 'pending', text: 'Resposta alterada. Confira a resposta atual; XP já conquistados permanecem.' };
    render();save();
  }));
  byId('observacao').addEventListener('input', save);
  byId('limite-real').addEventListener('input', save);

  // O mesmo iframe permanece isolado; a bancada apenas consome resultados verificados.
  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow) return;
    const data = event.data;
    if (!data || data.from !== 'ifma-mobile-a08') return;
    if (data.type === 'READY') {
      // A mensagem READY pode anteceder a instalação do listener no host.
      // Confirmar o handshake e executar somente na primeira READY válida.
      const first=!ready;
      ready=true;
      frame.contentWindow?.postMessage({from:'ifma-mobile-a08-host',type:'READY_ACK',token:nonce},'*');
      if(first && sourceLoaded)run({initial:true});
      return;
    }
    if (data.token !== nonce) return;
    // A resposta assíncrona deve vir da VERSÃO compilada que continua aberta.
    // Editar/reexecutar durante uma conferência descarta resultados antigos.
    if (data.runId !== runSequence || data.revision !== sourceRevision) return;
    if (data.type === 'COMPILED') {
      lastCompiled = data.ok === true;
      setStatus(lastCompiled ? '✓ Executado nas duas prévias React Native Web. Estados independentes.' :
        `Erro no código: ${data.detail || 'revise o arquivo completo.'} · XP anteriores preservados.`, !lastCompiled);
      if (!lastCompiled) {
        markCodeForReview('O código atual não compilou. Corrija-o antes de novas conferências; XP conquistados não desaparecem.');
        if (reviewAfterCompile) {
          reviewAfterCompile = false;
          setReviewBusy(false);
          setReviewStatus('Não foi possível conferir: o código atual não compilou. Seus XP estão preservados.', 'failed');
        }
        save();
      }
      if (lastCompiled && reviewAfterCompile) {
        reviewAfterCompile = false;
        startReview();
      }
      if (lastCompiled && revealPreviewAfterExplicitRun && window.matchMedia('(max-width: 1040px)').matches) setPane('preview');
      revealPreviewAfterExplicitRun = false;
    } else if (data.type === 'CHECKED' && data.stage === pending) {
      const id = pending;
      stopPendingChecks();
      if (data.ok === true) {
        passed[id] = true;
        completedDetail[id] = String(data.detail || 'Critério aprovado.').slice(0, 250);
      }
      // Falha na versão atual não anula o XP acumulado por aprovação anterior.
      feedbackState[id] = data.ok === true
        ? { kind: 'success', text: `✓ Aprovado · ${data.detail}` }
        : { kind: 'failed', text: `A conferência atual falhou: ${data.detail || 'revise o código.'}` };
      render();save();
    } else if (data.type === 'CHECKED_ALL' && reviewPending) {
      stopPendingChecks();
      const results = data.results;
      if (!Array.isArray(results) || results.length !== codeTaskIds.length ||
          new Set(results.map(item => item?.stage)).size !== codeTaskIds.length ||
          results.some(item => !item || !codeTaskIds.includes(item.stage) || typeof item.ok !== 'boolean')) {
        setReviewStatus('Não foi possível validar a conferência coletiva. Os XP já conquistados permanecem.', 'failed');
        return;
      }
      const scoreBefore = getScore();
      let approvedNow = 0, notApprovedNow = 0, newlyApproved = 0;
      for (const item of results) {
        const id = item.stage;
        const current = item.ok === true;
        if (current) {
          approvedNow++;
          if (!passed[id]) newlyApproved++;
          passed[id] = true;
          completedDetail[id] = String(item.detail || 'Critério conferido.').slice(0, 250);
          feedbackState[id] = { kind: 'success', text: '✓ Conferência coletiva: ' + (item.detail || 'aprovado.') };
        } else {
          notApprovedNow++;
          feedbackState[id] = { kind: 'failed',
            text: 'A versão atual não passou: ' + String(item.detail || 'revise o critério.').slice(0, 250) };
        }
      }
      render();save();
      const gained = getScore() - scoreBefore;
      const message = `Conferência concluída: ${approvedNow}/${codeTaskIds.length} missões técnicas aprovadas no código atual; ${newlyApproved} novas conquistas (+${gained} XP). Total acumulado: ${getScore()}/100 XP. ${notApprovedNow} não passaram na versão atual. Nenhuma conquista anterior foi apagada.`;
      setReviewStatus(message, 'success');
      setStatus('✓ '+message);
    }
  });

  // Consultar componentes básicos sem criar arquivos ou exercícios adicionais.
  // O botão localiza o JSX REAL editado pelo estudante, não um fragmento inventado.
  const basicComponents = Object.freeze({
    View: {
      name: 'View · agrupa elementos',
      explanation: 'É um contêiner de interface (semelhante à ideia de uma div em HTML). Organiza título, entrada, botão e resumo.',
      observe: 'Observe que o formulário inteiro e o resumo estão agrupados em regiões nas duas prévias.',
      marker: '<View style={styles.pagina}'
    },
    Text: {
      name: 'Text · apresenta informações',
      explanation: 'Exibe textos, como o título, a regra de validação e a última memória. Não serve como campo para digitar.',
      observe: 'Altere TITULO_APLICACAO em [02], execute e veja o Text do título mudar nas duas prévias.',
      marker: '<Text style={styles.titulo}>'
    },
    TextInput: {
      name: 'TextInput · recebe texto',
      explanation: 'É o campo editável. value={titulo} lê o estado; onChangeText chama setTitulo ao digitar. O placeholder é um exemplo, não a regra.',
      observe: 'Digite algo no campo da Web e note que a prévia móvel mantém seu próprio estado.',
      marker: '<TextInput'
    },
    Pressable: {
      name: 'Pressable · recebe o toque/clique',
      explanation: 'É o elemento acionável. onPress={registrar} chama a função quando a pessoa toca ou clica; não chame registrar() na declaração.',
      observe: 'Teste um título curto e outro válido usando o botão. O mesmo onPress funciona nas duas prévias.',
      marker: '<Pressable'
    }
  });
  let selectedComponent = 'View';
  function drawComponent() {
    const info = basicComponents[selectedComponent];
    byId('component-name').textContent = info.name;
    byId('component-explanation').textContent = info.explanation;
    byId('component-fragment').textContent = info.marker;
    byId('component-observe').textContent = info.observe;
    document.querySelectorAll('[data-component]').forEach(button => {
      const selected = button.dataset.component === selectedComponent;
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  byId('component-open').addEventListener('click', () => {
    drawComponent();
    byId('component-dialog').showModal();
  });
  document.querySelectorAll('[data-component]').forEach(button => button.addEventListener('click', () => {
    selectedComponent = button.dataset.component;
    drawComponent();
  }));
  byId('component-locate').addEventListener('click', () => {
    const marker = basicComponents[selectedComponent].marker;
    showFile('shared');
    const pos = panels.shared.indexOf(marker);
    if (pos < 0) {
      byId('component-explanation').textContent =
        'Este trecho não foi encontrado no seu código atual. Confira se o componente foi alterado ou removido.';
      return;
    }
    byId('component-dialog').close();
    setPane('code');
    codeEditor.focus({ preventScroll: true });
    codeEditor.setSelectionRange(pos, pos + marker.length);
    const line = panels.shared.slice(0, pos).split('\n').length;
    codeEditor.scrollTop = Math.max(0,(line - 6) * (parseFloat(getComputedStyle(codeEditor).lineHeight) || 21));
    setStatus('Componente '+selectedComponent+' localizado no arquivo completo, linha '+line+'.');
  });

  // Ajuda e evidências são janelas auxiliares; a bancada jamais perde seu lugar.
  for (const [buttonId, dialogId] of [['help-open','help-dialog'],['evidence-open','evidence-dialog']]) {
    byId(buttonId).addEventListener('click', () => byId(dialogId).showModal());
  }
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => byId(button.dataset.closeDialog).close()));
  document.querySelectorAll('dialog.resource-dialog').forEach(dialog => {
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  });

  function evidence() {
    return { schema: 'ifma-mobile-aula08-lab-v1', geradoEm: new Date().toISOString(),
      atividade: 'Aula 08 — Laboratório Vivo · Operação Dados sob Pressão',
      tipo: 'formativo-nao-e-nota', xp: getScore(), maximoXp: TOTAL_XP,
      exercicios: tasks.map(task => ({ id: task.id, ciclo: task.phase, titulo: task.name,
        xp: passed[task.id] ? task.xp : 0, maximoXp: task.xp,
        estado: passed[task.id] ? 'APROVADO' : 'PENDENTE', comentario: completedDetail[task.id] || null })),
      observacao: byId('observacao').value, testeNativoPendente: byId('limite-real').value,
      codigoFonteCompleto: panels.shared,
      team: window.WebTeam?.snapshot() || null,
      ressalvas: ['Prévia móvel = React Native Web estreito, NÃO dispositivo Android/iOS.',
        'Compartilhar componente não sincroniza dados.',
        'Os XP não constituem nota oficial.', 'Não existe envio automático ao professor.'] };
  }
  function download(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    byId('evidence-status').textContent = `Arquivo ${name} preparado para salvar.`;
  }
  byId('download-code').addEventListener('click', () => download('ProjetoUniversal.tsx', panels.shared, 'text/plain;charset=utf-8'));
  byId('legacy-export').addEventListener('click', () => {
    if (typeof legacy?.code === 'string') download('Aula08_Rascunho_' + legacyTag + '_Backup.tsx', legacy.code, 'text/plain;charset=utf-8');
  });
  // Arquivo de continuidade é distinto da evidência enviada ao professor:
  // contém código, missão atual, respostas e checkpoints formativos.
  function checkpoint() {
    return {
      schema: 'ifma-mobile-aula08-checkpoint-v1',
      savedAt: new Date().toISOString(),
      code: panels.shared,
      activeTask: activeTask().id,
      answers: readAnswers(),
      completed: tasks.filter(t => passed[t.id]).map(t => t.id),
      details: Object.fromEntries(tasks.filter(t => passed[t.id]).map(t => [t.id, completedDetail[t.id] || 'Concluído'])),
      note: byId('observacao').value,
      nativeNote: byId('limite-real').value,
      xp: getScore(),
      team: window.WebTeam?.snapshot() || null,
      warning: 'XP acumulativos e formativos, não nota oficial. Alterar código não apaga conquistas; Conferir progresso testa a versão atual.'
    };
  }
  function progressMessage(message, error = false) {
    const target = byId('progress-status');
    target.textContent = message;
    target.dataset.kind = error ? 'error' : 'success';
  }
  function exportCheckpoint() {
    save();
    download('Aula08_Continuar_Depois.json', JSON.stringify(checkpoint(), null, 2), 'application/json;charset=utf-8');
    progressMessage('Progresso exportado. Guarde o JSON para retomar neste ou em outro dispositivo.');
  }
  function restoreCheckpoint(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw Error('JSON inválido.');
    const isCheckpoint = data.schema === 'ifma-mobile-aula08-checkpoint-v1';
    const isEvidence = data.schema === 'ifma-mobile-aula08-lab-v1';
    if (!isCheckpoint && !isEvidence) throw Error('Este arquivo não é um progresso da Aula 08.');
    const source = isCheckpoint ? data.code : data.codigoFonteCompleto;
    if (typeof source !== 'string' || !source.trim() || source.length > 30000)
      throw Error('O arquivo não contém código TSX válido.');
    const ids = isCheckpoint ? data.completed : Array.isArray(data.exercicios)
      ? data.exercicios.filter(ex => ex && ex.estado === 'APROVADO').map(ex => ex.id) : [];
    if (!Array.isArray(ids) || ids.length > tasks.length || new Set(ids).size !== ids.length ||
        ids.some(id => !Object.hasOwn(passed, id))) throw Error('Lista de exercícios inválida.');
    const answerMap = isCheckpoint ? data.answers : data.progressoTutorial?.answers;
    if (answerMap != null && (typeof answerMap !== 'object' || Array.isArray(answerMap)))
      throw Error('Respostas inválidas.');
    const answers = answerMap || {};
    // Não reconhecer XP de quiz sem suas respostas; o estudante pode refazê-lo.
    const quizValid = id => (id === 'map' || id === 'quiz') &&
      answers[id + '-q1'] === 'a' && answers[id + '-q2'] === 'b';
    const restored = ids.filter(id => !['map','quiz'].includes(id) || quizValid(id));
    const computed = restored.reduce((n,id)=>n+tasks.find(t=>t.id===id).xp,0);
    if (isCheckpoint && (!Number.isSafeInteger(data.xp) ||
        data.xp !== ids.reduce((n,id)=>n+tasks.find(t=>t.id===id).xp,0)))
      throw Error('Pontuação inconsistente no arquivo.');
    // Conferir antes de substituir a sessão: um grupo inválido não pode
    // fazer o aluno perder o código ou os XP atuais.
    const savedTeam = data.team;
    if (savedTeam != null) window.WebTeam?.validatePartial(savedTeam);
    if (!confirm('Retomar o arquivo selecionado? O código e o progresso desta sessão serão substituídos.')) {
      progressMessage('Retomada cancelada. O código, as respostas e os XP atuais foram preservados.');
      return;
    }
    panels.shared = source;
    codeEditor.value = source;
    if (savedTeam != null) window.WebTeam?.restore(savedTeam);
    for (const task of tasks) {
      passed[task.id] = restored.includes(task.id);
      delete completedDetail[task.id];
      if (passed[task.id]) completedDetail[task.id] = 'Restaurado do JSON · XP formativo';
      feedbackState[task.id] = {kind:'pending',text:'Progresso restaurado. Execute e confira novamente se editar.'};
    }
    quizBank.querySelectorAll('input[type="radio"]').forEach(input => {
      input.checked = answers[input.name] === input.value;
    });
    byId('observacao').value = String((isCheckpoint ? data.note : data.observacao) || '').slice(0,2000);
    byId('limite-real').value = String((isCheckpoint ? data.nativeNote : data.testeNativoPendente) || '').slice(0,1000);
    const selected = isCheckpoint ? data.activeTask : data.progressoTutorial?.activeTask;
    activeIndex = Math.max(0, tasks.findIndex(t=>t.id===selected));
    showFile('shared');
    render();save();
    run({initial:true});
    progressMessage('Progresso retomado: '+computed+'/100 XP formativos. Código e respostas restaurados; quizzes sem respostas verificáveis ficam pendentes.');
  }
  const fileInput = byId('progress-file');
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      if (file.size > 100000) throw Error('Arquivo excede 100 KB.');
      const raw = await file.text();
      let parsed;
      try { parsed = JSON.parse(raw); }
      catch { throw Error('Arquivo JSON malformado: sintaxe inválida.'); }
      restoreCheckpoint(parsed);
    } catch (error) {
      progressMessage('Não foi possível retomar: '+String(error.message || error), true);
    } finally { fileInput.value = ''; }
  });
  for (const id of ['save-progress','dialog-save-progress']) byId(id).addEventListener('click', exportCheckpoint);
  for (const id of ['load-progress','dialog-load-progress']) byId(id).addEventListener('click', () => fileInput.click());

  byId('export-json').addEventListener('click', () => download('Aula08_Laboratorio_Evidencia_v4.json', JSON.stringify(evidence(), null, 2), 'application/json;charset=utf-8'));
  function reportText() {
    const data = evidence();
    const lines = ['# Aula 08 — Laboratório Vivo · Operação Dados sob Pressão', '', `Gerado em: ${data.geradoEm}`,
      `XP formativos: **${data.xp}/${data.maximoXp}** (NÃO são nota).`, '', '## Exercícios'];
    if (data.team) {
      lines.push('', '## Equipe', 'Nome: ' + (data.team.team || '(não informado)'),
        'Integrantes:', ...data.team.members.map(m=>'- '+(m.name||'(não informado)')));
    }
    data.exercicios.forEach(ex => lines.push(`- ${ex.estado}: ${ex.titulo} (${ex.xp}/${ex.maximoXp} XP)${ex.comentario ? ' — ' + ex.comentario : ''}`));
    lines.push('', '## O que modifiquei e observei', data.observacao || '(não respondido)',
      '', '## Teste em dispositivo nativo', data.testeNativoPendente || '(não respondido)',
      '', '## Limitações', ...data.ressalvas.map(text => '- ' + text),
      '', '## Arquivo completo entregue', '```tsx', data.codigoFonteCompleto, '```', '');
    return lines.join('\n');
  }
  byId('export-md').addEventListener('click', () => download('Aula08_Laboratorio_Evidencia_v4.md', reportText(), 'text/markdown;charset=utf-8'));
  // Documento A4 estruturado: a versão anterior imprimia Markdown como
  // texto plano, com bullets e asteriscos literais. Agora o HTML de impressão
  // segue a identidade das fichas do IFMA, mantendo resultados PARCIAIS.
  function printPartial() {
    const identity=window.WebTeam?.requireIdentity?.({requireEnrollment:false});
    if(!identity){
      progressMessage('Para gerar o PDF, identifique a equipe. Integrantes não consultados serão indicados como não conferidos.',true);
      return false;
    }
    try {
      const current=evidence();
      if (!window.WebLabReport?.prepare)
        throw Error('O gerador do relatório institucional não está disponível.');
      const summary=window.WebLabReport.prepare(byId('print-report'),current,identity);
      progressMessage('Relatório A4 preparado: '+summary.xp+'/100 XP e '+
        summary.pending+' missões pendentes. Na janela do navegador, escolha “Salvar como PDF”.');
      window.print();
      return true;
    } catch(error) {
      progressMessage('Não foi possível preparar o PDF: '+
        String(error?.message||'verifique os dados.'),true);
      return false;
    }
  }
  for (const id of ['print','dialog-pdf']) byId(id).addEventListener('click', printPartial);
  // Integração externa só pode obter o mesmo snapshot usado nos exports.
  // O Apps Script recebe evidência relatada; a nota oficial exige verificação docente e servidor homologado.
  window.WebLabEvidence = Object.freeze({ snapshot: evidence, printPartial });
  loadSource();
})();
