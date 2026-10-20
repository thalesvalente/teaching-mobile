/* Pontuação formativa das aulas. Sem rede, identificação pessoal ou gabarito exportado para questões em branco. */
(() => {
  'use strict';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const BANKS = {
    6: [
      ['rota', 's06', 'Qual arquivo recebe IDs diferentes na mesma tela de detalhe?', ['app/memorias/[id].tsx', 'app/memorias/m1.tsx', 'app/_layout.tsx'], 0, 'O segmento [id] é variável. A tela consulta o registro identificado pelo parâmetro.'],
      ['nav', 's12', 'Você veio da lista para o detalhe. Qual comando volta à tela anterior?', ["router.push('/')", 'router.back()', "setTitulo('')"], 1, 'back retira o detalhe do topo; push acrescentaria outra tela ao histórico.'],
      ['retorno', 's12', 'O detalhe foi aberto diretamente e não existe tela anterior. Como oferecer uma saída?', ['Chamar back sem verificar', 'Usar replace para abrir a rota da lista', 'Mostrar o primeiro item da coleção'], 1, 'Verifique canGoBack. Sem histórico, replace leva à lista sem inventar outro registro.'],
      ['id', 's10', 'Qual dado deve determinar o conteúdo da tela de detalhe?', ['A posição zero da coleção', 'O título do primeiro cartão', 'O ID recebido na rota'], 2, 'O ID identifica o registro; a posição e o título não substituem essa identidade.'],
      ['campo', 's14', 'Como um campo controlado acompanha a digitação?', ['value ligado ao estado e onChangeText atualizando esse estado', 'value fixo e nenhuma função de mudança', 'Apenas placeholder com o texto inicial'], 0, 'O valor exibido vem do estado. O evento de digitação solicita a atualização.'],
      ['espacos', 's15', 'Qual regra impede que um título de espaços conte como texto válido?', ['Contar espaços antes de tudo', 'Aplicar trim antes de verificar o tamanho', 'Aceitar qualquer valor diferente de null'], 1, 'trim remove espaços das pontas; só depois verificamos o mínimo de caracteres.'],
      ['limite', 's15', 'Na regra didática desta aula, quais textos atingem exatamente os mínimos?', ['Título de 2 e descrição de 9 caracteres', 'Título de 3 e descrição de 10 caracteres', 'Título vazio e descrição de 10 caracteres'], 1, 'O exercício exige título com pelo menos 3 e descrição/resumo com pelo menos 10 caracteres após trim.'],
      ['validacao', 's16', 'Em que momento o formulário deve recusar uma entrada inválida?', ['Depois de criar o registro', 'Depois de navegar ao detalhe', 'Antes de criar o registro e de navegar'], 2, 'Interrompa a ação e explique os erros antes de modificar a coleção.'],
      ['sucesso', 's18', 'O registro foi criado. Como evitar que Voltar reabra o formulário concluído?', ['Substituir o formulário pelo detalhe com replace', 'Acrescentar o detalhe com push', 'Apagar toda a coleção'], 0, 'replace troca a tela do formulário pelo detalhe novo e preserva a lista anterior.'],
      ['duplo', 's18', 'Como evitar dois registros quando há dois toques na mesma submissão?', ['Criar a cada toque', 'Bloquear a mesma submissão antes de criar', 'Desativar todos os campos permanentemente'], 1, 'A verificação e o bloqueio ocorrem antes da criação. O próximo cadastro legítimo continua possível.']
    ],
    7: [
      ['estado', 's04', 'Quais escolhas precisam permanecer entre renderizações para filtrar a lista?', ['Somente a cor do botão', 'Busca e categoria escolhidas', 'Uma cópia de cada resultado anterior'], 1, 'Busca e categoria são estado. A lista visível pode ser derivada da coleção e dessas escolhas.'],
      ['colecao', 's06', 'Há seis registros; o filtro mostra dois. O que deve acontecer ao limpar?', ['Voltar a mostrar os seis registros originais', 'Manter somente os dois últimos', 'Cadastrar os quatro registros novamente'], 0, 'O recorte não substitui a fonte. Limpar apenas remove as condições de seleção.'],
      ['normalizar', 's08', 'Qual tratamento faz “  PRAÇA  ” encontrar um título com “praça”?', ['Comparação literal', 'Remover todos os caracteres do título', 'trim na busca e comparação em minúsculas'], 2, 'A regra trata espaços nas pontas e maiúsculas. Ela preserva acentos.'],
      ['criterios', 's09', 'Busca e categoria devem corresponder ao mesmo tempo. Qual operador combina os testes?', ['|| (OU)', '&& (E)', '= (atribuição)'], 1, 'O operador && exige que os dois critérios sejam verdadeiros para o item entrar.'],
      ['identidade', 's13', 'Qual key continua identificando o mesmo registro depois de filtrar ou reordenar?', ['O índice atual da lista', 'O ID estável do registro', 'Um número aleatório a cada renderização'], 1, 'A posição muda; o ID estável acompanha o mesmo registro.'],
      ['carregando', 's16', 'Os dados ainda estão chegando. Qual mensagem é adequada?', ['Carregando os registros', 'Não existem registros', 'Falha permanente'], 0, 'Verifique o status antes de concluir que uma coleção está vazia.'],
      ['vazio', 's15', 'A base contém seis itens, mas “zzzz” não encontra nenhum. Qual diagnóstico é correto?', ['A base inteira está vazia', 'Todos os registros foram apagados', 'Nenhum resultado para os filtros atuais'], 2, 'Base vazia e recorte vazio têm causas e mensagens diferentes.'],
      ['tentativa', 's17', 'O que o botão Tentar novamente deve fazer após uma falha?', ['Mudar apenas seu próprio texto', 'Iniciar outra tentativa e atualizar o estado com o resultado', 'Declarar sucesso sem obter dados'], 1, 'A nova tentativa passa por carregamento e deve lidar com seu resultado.'],
      ['resumo', 's21', 'A lista está filtrada em Lugar. De quais dados devem vir os cartões e o gráfico?', ['Do mesmo recorte da lista', 'Sempre da coleção completa', 'De números fixos no código'], 0, 'Usar o mesmo recorte mantém contadores, cartões e barras coerentes com os filtros.'],
      ['grafico', 's22', 'Qual apresentação permite comparar e compreender os indicadores de EDA?', ['Somar percentuais e estudantes', 'Mostrar só cores sem valores', 'Percentuais em escala 0–100, quantidades separadas e rótulo/valor/unidade'], 2, 'Unidades diferentes não compartilham a mesma soma. O texto transmite a informação sem depender da cor.']
    ]
  };

  function create({lesson, showSlide}) {
    const questions = BANKS[lesson];
    const answers = Object.fromEntries(questions.map(([id]) => [id, null]));
    const button = document.getElementById('gameBtn');
    const dialog = document.createElement('dialog');
    dialog.id = 'gameDialog';
    dialog.className = 'lecture-game';
    dialog.setAttribute('aria-labelledby', 'gameTitle');
    dialog.innerHTML = `<div class="dialog-top dialog-head"><h2 id="gameTitle">Missões da Aula ${String(lesson).padStart(2, '0')}</h2><button type="button" data-game-close>Fechar</button></div><p>10 missões, 1 ponto e 10 XP por acerto. A resposta atual define a nota; tentativas e consultas não descontam pontos. Questões em branco valem zero e podem continuar em branco no PDF.</p><div class="lecture-score"><strong id="lectureScore">0,0 / 10</strong><span id="lectureXP">0 / 100 XP</span><span id="lectureLevel">Explorador</span><label for="lectureProgress">Missões respondidas</label><progress id="lectureProgress" max="10" value="0"></progress><p id="lectureProgressText">0 de 10 respondidas · 10 pendentes</p></div><p class="game-scope">Pontuação formativa desta aula. A ficha e o projeto têm critérios próprios; esta nota não comprova execução no Expo nem altera o diário.</p><div class="lecture-quests">${questions.map(([id, slide, title, options], i) => `<fieldset class="lecture-quest" data-quest="${id}"><legend>${i + 1}. ${esc(title)} <span>1 ponto · 10 XP</span></legend>${options.map((label, choice) => `<label class="lecture-choice"><input type="radio" name="game-${id}" value="${choice}"><span>${esc(label)}</span></label>`).join('')}<p class="lecture-feedback" data-quest-feedback="${id}">Não respondida · 0 / 1 ponto.</p><div class="lecture-quest-tools"><button type="button" data-game-slide="${slide}">Rever explicação</button><button type="button" data-game-clear="${id}">Deixar em branco</button></div></fieldset>`).join('')}</div><p id="lectureGameStatus" class="sr-only" role="status" aria-live="polite"></p><div class="lecture-quest-tools"><button type="button" data-game-print>PDF / imprimir com a nota atual</button><button type="button" data-game-close>Continuar a aula</button></div><p class="game-scope">As escolhas ficam nesta aba. Imprima o resultado antes de fechar ou recarregar.</p>`;
    document.body.appendChild(dialog);
    const report = document.createElement('section');
    report.id = 'lectureReport';
    report.className = 'lecture-report';
    report.setAttribute('aria-labelledby', 'lectureReportTitle');
    document.getElementById('viewport').before(report);
    const score = () => {
      const correct = questions.filter(([id,,, , answer]) => answers[id] === answer).length;
      const answered = questions.filter(([id]) => answers[id] !== null).length;
      return {correct, answered, pending: questions.length - answered, grade: correct, xp: correct * 10, max: 10};
    };
    const level = correct => correct === 10 ? 'Missão dominada' : correct >= 7 ? 'Conexões consolidadas' : correct >= 4 ? 'Em construção' : 'Explorador';
    function preparePrint() {
      const s = score();
      report.innerHTML = `<p class="lecture-report-kicker">IFMA · Programação para Dispositivos Móveis</p><h1 id="lectureReportTitle">Aula ${String(lesson).padStart(2, '0')} · resultado das missões</h1><p class="lecture-report-score">Nota atual: ${s.grade.toFixed(1).replace('.', ',')} / 10 · ${s.xp} / 100 XP</p><p>${s.answered} de 10 respondidas · ${s.correct} acertos · ${s.pending} não respondidas · ${level(s.correct)}</p><p>Registro ${s.answered === 10 ? 'completo' : 'parcial'}. Todas as questões continuam no denominador 10. A exportação preserva as respostas e não concede pontos extras.</p><ol>${questions.map(([id,,title,options,right]) => `<li><strong>${esc(title)}</strong><p>Resposta: ${answers[id] === null ? 'Não respondida' : esc(options[answers[id]])}</p><p>${answers[id] === null ? 'Pendente' : answers[id] === right ? 'Correta' : 'Rever'} · ${answers[id] === right ? '1' : '0'} / 1 ponto.</p></li>`).join('')}</ol><p class="lecture-report-note">Resultado formativo local, sem autenticação. Não comprova execução no app e não substitui a avaliação da disciplina. Questões não respondidas permanecem sem resposta; explicações ocultas não são reveladas pela impressão.</p>`;
    }
    function update(announce = '') {
      const s = score();
      dialog.querySelector('#lectureScore').textContent = `${s.grade.toFixed(1).replace('.', ',')} / 10`;
      dialog.querySelector('#lectureXP').textContent = `${s.xp} / 100 XP`;
      dialog.querySelector('#lectureLevel').textContent = level(s.correct);
      dialog.querySelector('#lectureProgress').value = s.answered;
      dialog.querySelector('#lectureProgressText').textContent = `${s.answered} de 10 respondidas · ${s.correct} acertos · ${s.pending} pendentes`;
      button.textContent = `Missões · ${s.grade.toFixed(1).replace('.', ',')}/10`;
      button.setAttribute('aria-label', `Missões da aula: nota atual ${s.grade} de 10, ${s.answered} de 10 respondidas`);
      questions.forEach(([id,,,options,right,explanation]) => {
        const q = dialog.querySelector(`[data-quest="${id}"]`);
        const selected = answers[id];
        q.querySelectorAll('input').forEach(input => input.checked = selected === Number(input.value));
        q.querySelector('.lecture-feedback').textContent = selected === null ? 'Não respondida · 0 / 1 ponto.' : `${selected === right ? 'Correta · 1 / 1 ponto.' : 'Rever · 0 / 1 ponto.'} ${explanation}`;
        q.dataset.result = selected === null ? 'pending' : selected === right ? 'correct' : 'review';
      });
      const inline = document.querySelector('[data-quiz="nav"]');
      if (lesson === 6 && inline) {
        const value = answers.nav;
        inline.querySelectorAll('.choice').forEach((b, i) => {
          b.classList.toggle('correct', value === i && i === 1);
          b.classList.toggle('wrong', value === i && i !== 1);
          b.setAttribute('aria-pressed', String(value === i));
        });
        inline.querySelector('.answer-feedback').textContent = value === null ? 'Não respondida · 0 / 1 ponto da aula.' : `${value === 1 ? 'Correto · 1 ponto.' : 'Reveja · 0 ponto.'} ${BANKS[6][1][5]}`;
      }
      if (announce) dialog.querySelector('#lectureGameStatus').textContent = `${announce} Nota atual ${s.grade} de 10; ${s.pending} pendentes.`;
      preparePrint();
    }
    function answer(id, value) {
      const item = questions.find(q => q[0] === id);
      if (!item || (value !== null && (!Number.isInteger(value) || value < 0 || value >= item[3].length))) return;
      answers[id] = value;
      update(value === null ? 'Questão deixada em branco.' : value === item[4] ? 'Resposta correta.' : 'Resposta registrada; consulte a explicação.');
    }
    button.onclick = () => dialog.showModal();
    dialog.addEventListener('change', e => {
      if (e.target.matches('input[type=radio]')) answer(e.target.name.slice(5), Number(e.target.value));
    });
    dialog.addEventListener('click', e => {
      const close = e.target.closest('[data-game-close]');
      const clear = e.target.closest('[data-game-clear]');
      const slide = e.target.closest('[data-game-slide]');
      if (close) dialog.close();
      if (clear) answer(clear.dataset.gameClear, null);
      if (slide) {dialog.close(); showSlide(slide.dataset.gameSlide);}
      if (e.target.closest('[data-game-print]')) {dialog.close(); document.getElementById('printBtn').click();}
    });
    if (lesson === 6) document.querySelectorAll('[data-quiz="nav"] .choice').forEach((b, i) => b.onclick = () => answer('nav', i));
    window.addEventListener('beforeprint', preparePrint);
    update();
    return Object.freeze({score, answer, preparePrint, get answers() {return {...answers};}, questions});
  }
  window.LessonGame = Object.freeze({create});
})();
