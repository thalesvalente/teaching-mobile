import { importFile, canonical, serverEvidence } from './jsonl.js';
import { runChallenge } from './verificador.js';
import { request, validateChallenge, validateEvaluation, validateDelivery } from './entrega-appscript.js';
import { createPdf, download, renderPrint } from './pdf.js';
import { CRITERIA } from './config.js';

const $ = id => document.getElementById(id);
let pkg = null, evaluation = null, receipt = null, savedPdf = null, busy = false, importVersion = 0;
const number = value => Number(value).toFixed(1).replace('.', ',');
const steps = ['Lendo arquivo', 'Pedindo desafio', 'Verificando', 'Calculando nota', 'Gerando PDF', 'Enviando', 'Aguardando recibo', 'Recibo validado'];
function status(text, error = false) { $('delivery-status').textContent = text; $('delivery-status').classList.toggle('error', error); $('delivery-status').classList.remove('success'); }
function add(parent, tag, text, className) { const element = document.createElement(tag); element.textContent = text; if (className) element.className = className; parent.append(element); return element; }
function pair(parent, label, value) { add(parent, 'dt', label); add(parent, 'dd', value, 'hash'); }
function identity(strict = true) {
  const team = $('team').value.trim();
  const slots = pkg?.manifest.slots || [1, 2, 3, 4];
  const members = slots.map(slot => ({ name: $(`member-${slot}`).value.trim(), slot })).filter(m => strict || m.name);
  if (strict) {
    if (!team || members.some(m => !m.name)) throw Error('Preencha a equipe e o nome de cada slot ativo.');
    if ([team, ...members.map(m => m.name)].some(text => text.length > 80 || /^[=+@-]/.test(text) || /[\u0000-\u001f\u007f]/.test(text))) throw Error('Use nomes simples, sem símbolos de fórmula ou quebras de linha.');
    if (new Set(members.map(m => m.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())).size !== members.length) throw Error('Cada slot precisa de um integrante diferente.');
  }
  return { team, members };
}
function snapshot(state = 'REGISTRO LOCAL - ENTREGA NÃO CONFIRMADA', identification = identity(false)) {
  return { ...identification, pkg, evaluation, generatedAt: new Date().toISOString(), state };
}
function enable() {
  let valid = false;
  try { identity(); valid = true; } catch { /* Campos serão preenchidos pelo aluno. */ }
  $('submit-delivery').disabled = !pkg || !valid || busy;
  $('action-hint').textContent = busy ? 'Verificação em andamento. Mantenha esta página aberta.' :
    !pkg ? 'Primeiro importe o arquivo JSONL. Depois informe a equipe e os integrantes.' :
    !valid ? 'Arquivo recebido. Preencha a equipe e os nomes dos slots ativos para liberar o envio.' :
    'Tudo pronto. Ao clicar, a ficha verifica, baixa o PDF e solicita o recibo.';
}
function clearResult() {
  evaluation = null; receipt = null; savedPdf = null;
  $('results').hidden = true; $('receipt-panel').hidden = true; $('local-options').hidden = false;
}
function progress(index, detail = '') {
  $('progress-panel').hidden = false; $('delivery-progress').value = index + 1;
  const text = steps[index] + (detail ? ': ' + detail : '');
  const existing = $('progress-log').querySelector(`[data-step="${index}"]`);
  if (existing) existing.textContent = text;
  else { const li = add($('progress-log'), 'li', text); li.dataset.step = String(index); }
  status(text + '…');
}
function showResults(note) {
  $('results').hidden = false; $('results-note').textContent = note;
  $('member-results').replaceChildren();
  for (const member of evaluation.members) {
    const card = add($('member-results'), 'article', '', 'result-card');
    add(card, 'h3', `${member.name} · slot ${member.slot}`);
    add(card, 'p', `${number(member.total)} / 10,0`, 'score');
    add(card, 'p', `M1 ${number(member.m1)} + M2 ${number(member.m2)} + M3 ${number(member.m3)} + M4 ${number(member.m4)}`);
    const details = add(card, 'details', ''); add(details, 'summary', 'Ver os 20 critérios');
    const list = add(details, 'ul', '', 'mark-list');
    for (const c of member.criteria) add(list, 'li', `${c.passed ? 'Aprovado' : 'Pendente'} · ${c.id}: ${CRITERIA[c.id]} · ${number(c.points)} / 0,5`, c.passed ? 'pass' : 'pending');
  }
}
function showReceipt() {
  $('receipt-panel').hidden = false; $('local-options').hidden = true;
  $('receipt-description').textContent = 'O servidor confirmou o recebimento e validou a assinatura deste recibo.';
  $('receipt-summary').replaceChildren();
  for (const [key, label] of [['receiptId', 'Recibo'], ['receivedAt', 'Recebido em'], ['packageSha256', 'Hash do pacote'], ['pdfSha256', 'Hash do PDF'], ['answersSha256', 'Hash das respostas'], ['signature', 'Assinatura']]) pair($('receipt-summary'), label, receipt[key]);
}
async function importPackage(file) {
  if (busy) return;
  const version = ++importVersion;
  pkg = null; clearResult(); enable(); $('package-summary').hidden = true;
  $('import-status').textContent = 'Lendo arquivo e conferindo os hashes…';
  try {
    const parsed = await importFile(file);
    if (version !== importVersion) return;
    pkg = parsed;
    $('summary-data').replaceChildren();
    pair($('summary-data'), 'Arquivo', file.name); pair($('summary-data'), 'Slots', pkg.manifest.slots.join(', '));
    pair($('summary-data'), 'Fontes', `${pkg.sources.length} arquivos permitidos; ${pkg.byteLength} bytes`);
    pair($('summary-data'), 'Hash do pacote', pkg.packageSha256);
    $('local-score').textContent = `${number(pkg.localResult.grade)} / 10,0. Esse valor não define a nota oficial.`;
    $('package-summary').hidden = false;
    $('import-status').textContent = 'Pacote válido. Agora confira os nomes dos integrantes.';
    for (let slot = 1; slot <= 4; slot++) {
      const input = $(`member-${slot}`); input.disabled = !pkg.manifest.slots.includes(slot);
      input.required = !input.disabled;
      if (input.disabled) input.value = '';
    }
    $('slot-hint').textContent = `Slots ativos no pacote: ${pkg.manifest.slots.join(', ')}. Para mudar, gere novamente usando os slots da equipe, por exemplo npm run entrega -- --slots=1,2.`;
    status('Pacote conferido. Preencha os nomes e use o botão principal.');
  } catch (error) {
    if (version !== importVersion) return;
    $('import-status').textContent = error.message;
    status('Não foi possível importar. Corrija o pacote no projeto e gere novamente.', true);
  }
  enable();
}
$('package-file').addEventListener('change', event => importPackage(event.target.files[0]));
const drop = $('drop-zone');
for (const eventName of ['dragenter', 'dragover']) drop.addEventListener(eventName, event => { event.preventDefault(); if (!busy) drop.classList.add('dragging'); });
for (const eventName of ['dragleave', 'drop']) drop.addEventListener(eventName, event => { event.preventDefault(); drop.classList.remove('dragging'); });
drop.addEventListener('drop', event => { if (!busy) { if (event.dataTransfer.files.length !== 1) { $('import-status').textContent = 'Arraste apenas um arquivo JSONL por vez.'; return; } importPackage(event.dataTransfer.files[0]); } });
for (const input of [$('team'), ...document.querySelectorAll('[data-slot]')]) input.addEventListener('input', () => {
  clearResult(); status('Identificação alterada. Verifique novamente para obter um recibo correspondente.'); enable();
});

$('delivery-form').addEventListener('submit', async event => {
  event.preventDefault(); if (busy || !pkg) return;
  let identification;
  try { identification = identity(); } catch (error) { status(error.message, true); return; }
  busy = true; clearResult(); enable(); $('editable-fields').disabled = true;
  $('local-pdf').disabled = true; $('print-local').disabled = true;
  $('progress-log').replaceChildren();
  try {
    progress(0);
    if (!navigator.onLine) {
      savedPdf = await createPdf(snapshot('REGISTRO LOCAL OFFLINE - ENTREGA NÃO CONFIRMADA', identification));
      download(savedPdf.bytes, savedPdf.filename);
      throw Error('Sem conexão. O PDF local foi salvo; faça a entrega quando a rede voltar.');
    }
    const binding = { packageSha256: pkg.packageSha256, slots: pkg.manifest.slots, sourceHashes: pkg.sourceHashes,
      ...identification, evidence: serverEvidence(pkg.evidence) };
    progress(1);
    const challenge = await validateChallenge(await request('challenge', binding), binding);
    progress(2);
    const outputs = await runChallenge(pkg.sources, challenge.cases, { onProgress: (done, total) => progress(2, `${done} de ${total} casos`) });
    const answers = { ...binding, challengeId: challenge.challengeId, challengeToken: challenge.token, outputs };
    progress(3);
    const verification = await request('verify', answers);
    if (verification.challengeId !== challenge.challengeId || verification.packageSha256 !== pkg.packageSha256 || verification.bindingSha256 !== challenge.bindingSha256) throw Error('A verificação não corresponde ao desafio desta entrega.');
    evaluation = validateEvaluation(verification.evaluation, identification.members);
    showResults('Nota calculada pelo servidor. O recibo da entrega ainda está pendente.');
    progress(4);
    savedPdf = await createPdf(snapshot('NOTAS VERIFICADAS - AGUARDANDO ENVIO E RECIBO', identification));
    download(savedPdf.bytes, savedPdf.filename);
    progress(5);
    const response = await request('verifyAndSubmit', { ...answers, pdfSha256: savedPdf.hash });
    progress(6);
    receipt = await validateDelivery(response, { ...binding, challengeId: challenge.challengeId, pdfSha256: savedPdf.hash, evaluation });
    progress(7);
    showResults('Nota calculada pelo servidor e vinculada ao recibo confirmado.'); showReceipt();
    status(`ENTREGA CONFIRMADA\nRecibo: ${receipt.receiptId}\nGuarde o PDF junto com o recibo.`);
    $('delivery-status').classList.add('success');
  } catch (error) {
    receipt = null; $('receipt-panel').hidden = true; $('local-options').hidden = false; $('local-options').open = true;
    if (error.code === 'UNSUPPORTED_PDF_CHARACTER') {
      renderPrint(snapshot('IMPRESSÃO LOCAL - ENTREGA NÃO CONFIRMADA', identification));
      status('ENTREGA NÃO CONFIRMADA. Um caractere precisa da versão de impressão. Use Imprimir registro; nenhum PDF ou envio final foi produzido.', true);
    } else status('ENTREGA NÃO CONFIRMADA\n' + error.message, true);
    if (evaluation) showResults('Resultado da verificação disponível; recebimento ainda não confirmado.');
  } finally {
    busy = false; $('editable-fields').disabled = false;
    $('local-pdf').disabled = false; $('print-local').disabled = false; enable();
  }
});
$('local-pdf').addEventListener('click', async () => {
  try {
    const pdf = await createPdf(snapshot()); download(pdf.bytes, pdf.filename);
    if (!receipt) status('PDF local salvo. Isso não envia nem confirma uma entrega.');
  } catch (error) {
    renderPrint(snapshot());
    status(error.code === 'UNSUPPORTED_PDF_CHARACTER' ? 'Use Imprimir registro para preservar os caracteres. Nenhuma entrega foi enviada.' : error.message, true);
  }
});
$('print-local').addEventListener('click', () => { renderPrint(snapshot()); window.print(); });
$('save-receipt').addEventListener('click', () => { if (receipt) download(new TextEncoder().encode(canonical(receipt) + '\n'), 'recibo-aula08.json', 'application/json'); });
$('save-pdf-again').addEventListener('click', () => { if (savedPdf && receipt) download(savedPdf.bytes, savedPdf.filename); });
function network() {
  $('offline-banner').hidden = navigator.onLine;
  if (!navigator.onLine && !$('local-options').hidden) $('local-options').open = true;
}
addEventListener('online', network); addEventListener('offline', network); network(); enable();
