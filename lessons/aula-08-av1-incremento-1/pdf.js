import './pdf-engine.js';
import { CONFIG, CRITERIA } from './config.js';
import { sha256 } from './jsonl.js';
const number = value => Number(value).toFixed(1).replace('.', ',');

export function pdfModel(snapshot) {
  const { team, members, pkg, evaluation, generatedAt, state } = snapshot;
  const verified = evaluation && Array.isArray(evaluation.criteria);
  const sections = [
    { title: '1. Os quatro marcos da equipe', items: [
      ['M1 - Preparação e portfólio', '5 critérios de 0,5. Máximo de 2,5 pontos para a equipe.'],
      ['M2 - Funções essenciais', '4 critérios de 0,5. Máximo de 2,0 pontos para a equipe.'],
      ['M3 - Integração do Incremento 1', '6 critérios de 0,5. Máximo de 3,0 pontos para a equipe.'],
      ['M4 - Tarefas técnicas e entrega', '5 critérios de 0,5. Máximo de 2,5 pontos para a equipe. Os quatro arquivos obrigatórios são verificados coletivamente.']
    ] },
    { title: '2. Nota única da equipe', items: verified ? [
      ['Equipe', team],
      ['Nota oficial', number(evaluation.total) + ' / 10,0'],
      ['M1 + M2 + M3 + M4', [evaluation.m1, evaluation.m2, evaluation.m3, evaluation.m4].map(number).join(' + ')],
      ['Aplicação na planilha', 'O mesmo resultado é registrado para todos os participantes listados.'],
      ...evaluation.criteria.map(c => [c.id + ' - ' + CRITERIA[c.id], c.passed ? 'Aprovado: 0,5' : 'Pendente: 0,0'])
    ] : [['Nota oficial', 'Ainda não verificada.'], ['Resultado local (informativo)', pkg ? number(pkg.localResult.grade) + ' / 10,0' : 'Pacote ainda não importado.']] },
    { title: '3. Pacote, fontes e ambiente', items: [
      ['Atividade e avaliador', `${CONFIG.activity}; ${CONFIG.schema}; ${CONFIG.rubric}`],
      ['Hash SHA-256 do pacote', pkg?.packageSha256 || 'Ainda não disponível.'],
      ...(pkg ? Object.entries(pkg.sourceHashes).map(([path, hash]) => [path, hash]) : []),
      ['Ambiente informado pelo projeto', pkg ? `Node.js ${pkg.evidence.environment.nodeMajor}; ${pkg.evidence.environment.platform}. Preflight: ${pkg.evidence.preflight.ok ? 'registrado com sucesso' : 'pendente'}.` : 'Não informado.'],
      ['Resultado local', 'Informativo. O servidor não utiliza a nota nem os testes locais como autoridade.']
    ] },
    { title: '4. Registro reflexivo do processo', items: [
      ['Declaração', pkg?.evidence.aiUsage?.status || 'Não informada'],
      ['Reflexão da equipe', pkg?.evidence.aiUsage?.reflection || 'Ainda não informada'],
      ...(pkg?.evidence.aiLog.length ? pkg.evidence.aiLog.map((entry, i) => [
      `Registro ${i + 1} - ${entry.mission}`, `Pedido: ${entry.request}\nSugestão aproveitada: ${entry.suggestion}\nAlteração humana: ${entry.humanChange}\nTeste executado: ${entry.test}`
    ]) : [['Registro', 'Nenhum uso de IA registrado neste pacote. Não foi inventado um histórico de conversa.']])] },
    { title: '5. Estado da entrega e limites', items: [
      ['Estado deste PDF', state],
      ['Comprovação do recebimento', 'Guarde o PDF e o recibo emitido após a gravação. O recibo vincula o hash dos bytes à nota coletiva calculada no servidor.'],
      ['O que este documento registra', 'Resultados de contratos de comportamento e evidências declaradas. Não comprova autoria, ausência de ajuda nem uso real em aparelho celular. Base64 não é criptografia.'],
      ['Contingência', 'Sem recibo válido, a entrega não está confirmada. Guarde este registro e consulte o professor antes de reenviar após um timeout.']
    ] }
  ];
  return {
    lesson: 'Aula 08', version: '2.0.0', subtitle: 'Laboratório vivo - AV1',
    title: 'Registro do Incremento 1', project: 'Quatro marcos coletivos',
    discipline: 'Programação para Dispositivos Móveis', course: '3º ano do Ensino Médio Técnico - 2026.2',
    professor: 'Thales Levi Azevedo Valente', team: team || 'Não informada',
    date: new Date(generatedAt).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
    members: members.length ? members.map(m => m.name || 'Não informado') : ['Nenhum participante informado'],
    scoreLabel: verified ? 'NOTA COLETIVA VERIFICADA - RECIBO AINDA PENDENTE' : 'REGISTRO LOCAL - SEM NOTA OFICIAL',
    score: verified ? number(evaluation.total) + ' / 10,0' : 'Aguardando verificação',
    progress: 'Uma nota para a equipe. Os mesmos pontos são lançados para todos os participantes.',
    partial: true, sections
  };
}

export function renderPrint(snapshot) {
  const model = pdfModel(snapshot), root = document.getElementById('print-report');
  root.replaceChildren();
  function add(tag, text, parent = root) { const element = document.createElement(tag); element.textContent = text; parent.append(element); return element; }
  add('h1', 'Aula 08 - Registro do Incremento 1');
  add('p', `${model.discipline}\nEquipe: ${model.team}\nData: ${model.date}`);
  add('p', model.members.join('; '));
  add('p', snapshot.state);
  for (const section of model.sections) {
    add('h2', section.title);
    for (const [title, value] of section.items) { add('h3', title); const p = add('p', value); p.style.overflowWrap = 'anywhere'; }
  }
  return root;
}

export async function createPdf(snapshot) {
  renderPrint(snapshot);
  const bytes = globalThis.Aula08PdfEngine.generate(pdfModel(snapshot));
  return { bytes, hash: await sha256(bytes), filename: `mobile-aula08-${(snapshot.team || 'equipe').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}.pdf` };
}

export function download(bytes, filename, type = 'application/pdf') {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const link = document.createElement('a'); link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
