import { CONFIG, APPROVED_MOBILE_ENDPOINTS, CRITERIA } from './config.js';
import { canonical, sha256 } from './jsonl.js';

const channels = Object.freeze({ challenge: 'mobile-aula08-challenge', verify: 'mobile-aula08-verification',
  verifyAndSubmit: 'mobile-aula08-receipt', validateReceipt: 'mobile-aula08-receipt-validation' });
const hex = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
export const isMobileEndpoint = url => APPROVED_MOBILE_ENDPOINTS.includes(url);
export const isGoogleOrigin = origin => origin === 'https://script.google.com' ||
  /^https:\/\/(?:[a-z0-9-]+\.)?script\.googleusercontent\.com$/.test(origin) ||
  /^https:\/\/n-[a-z0-9-]+-script\.googleusercontent\.com$/.test(origin);

// HtmlService pode acrescentar um iframe intermediário. Aceitar só a árvore da
// requisição atual, nunca outra janela Google que conheça channel/nonce.
function fromFrame(source, frameWindow, depth = 0) {
  if (source === frameWindow) return true;
  if (!frameWindow || depth > 3) return false;
  try {
    for (let i = 0; i < Math.min(frameWindow.frames.length, 8); i++)
      if (fromFrame(source, frameWindow.frames[i], depth + 1)) return true;
  } catch { return false; }
  return false;
}

export function request(action, body, options = {}) {
  const endpoint = options.endpoint || CONFIG.endpoint;
  if (!channels[action] || !isMobileEndpoint(endpoint)) return Promise.reject(Error('Destino Mobile não autorizado. Avise o professor.'));
  const payload = JSON.stringify({ ...body, action, activity: CONFIG.activity, schema: CONFIG.schema });
  if (new TextEncoder().encode(payload).length > 131072) return Promise.reject(Error('A entrega excede o tamanho permitido.'));
  return new Promise((resolve, reject) => {
    const nonce = crypto.randomUUID();
    const frame = document.createElement('iframe');
    frame.name = 'mobile-a08-' + nonce; frame.hidden = true; frame.title = 'Canal de entrega Mobile';
    frame.referrerPolicy = 'no-referrer';
    const form = document.createElement('form');
    form.hidden = true; form.method = 'POST'; form.action = endpoint; form.target = frame.name;
    for (const [name, value] of Object.entries({ nonce, payload })) {
      const input = document.createElement('input'); input.type = 'hidden'; input.name = name; input.value = value; form.append(input);
    }
    let done = false;
    const finish = (error, value) => {
      if (done) return; done = true; clearTimeout(timer);
      removeEventListener('message', receive); frame.remove(); form.remove();
      error ? reject(error) : resolve(value);
    };
    const receive = event => {
      if (!isGoogleOrigin(event.origin) || !fromFrame(event.source, frame.contentWindow)) return;
      const data = event.data;
      if (!data || data.channel !== channels[action] || data.requestNonce !== nonce) return;
      try { if (JSON.stringify(data).length > 131072) throw Error('grande'); }
      catch { return finish(Error('Resposta do servidor inválida.')); }
      if (data.ok !== true) return finish(Error(typeof data.error === 'string' ? data.error.slice(0, 220) : 'O servidor recusou o pedido.'));
      finish(null, data);
    };
    const timer = setTimeout(() => finish(Error('O servidor não respondeu a tempo. A entrega não foi confirmada. Guarde o PDF e consulte o professor antes de reenviar.')),
      Math.min(60000, Math.max(100, options.timeoutMs || CONFIG.timeoutMs)));
    addEventListener('message', receive);
    document.body.append(frame, form);
    try { form.submit(); } catch { finish(Error('O navegador não conseguiu enviar. A entrega não foi confirmada.')); }
  });
}

export async function validateChallenge(challenge, binding) {
  if (!challenge || challenge.activity !== CONFIG.activity || challenge.schema !== CONFIG.schema ||
      typeof challenge.challengeId !== 'string' || challenge.challengeId.length > 100 ||
      typeof challenge.nonce !== 'string' || challenge.nonce.length < 16 || !hex(challenge.token) ||
      challenge.packageSha256 !== binding.packageSha256 || canonical(challenge.slots) !== canonical(binding.slots) ||
      canonical(challenge.sourceHashes) !== canonical(binding.sourceHashes) ||
      challenge.bindingSha256 !== await sha256(canonical({ activity: CONFIG.activity, schema: CONFIG.schema, ...binding })) ||
      !Array.isArray(challenge.cases) || challenge.cases.length === 0 || challenge.cases.length > 100 ||
      !hex(challenge.casesSha256) || challenge.casesSha256 !== await sha256(canonical(challenge.cases)) ||
      !Number.isFinite(Date.parse(challenge.issuedAt)) || !Number.isFinite(Date.parse(challenge.expiresAt)) || Date.parse(challenge.expiresAt) <= Date.now() ||
      Date.parse(challenge.issuedAt) > Date.now() + 60000 || Date.parse(challenge.expiresAt) <= Date.parse(challenge.issuedAt) ||
      Date.parse(challenge.expiresAt) - Date.parse(challenge.issuedAt) > 610000) throw Error('O desafio recebido não corresponde a esta entrega.');
  return challenge;
}

export function validateEvaluation(evaluation, team) {
  if (!evaluation || evaluation.rubric !== CONFIG.rubric || evaluation.team !== team ||
      !Array.isArray(evaluation.criteria) || evaluation.criteria.length !== 20 ||
      Object.keys(evaluation).sort().join(',') !== 'criteria,m1,m2,m3,m4,rubric,team,total')
    throw Error('Nota oficial da equipe inválida.');
  const seen = new Set(), sums = { m1: 0, m2: 0, m3: 0, m4: 0 };
  for (const c of evaluation.criteria) {
    if (!c || !Object.hasOwn(CRITERIA, c.id) || seen.has(c.id) ||
        typeof c.passed !== 'boolean' || c.max !== 0.5 ||
        c.points !== (c.passed ? 0.5 : 0) ||
        Object.keys(c).sort().join(',') !== 'id,label,max,passed,points' ||
        c.label !== CRITERIA[c.id] && typeof c.label !== 'string')
      throw Error('Critérios da equipe inconsistentes.');
    seen.add(c.id); sums[c.id.slice(0, 2).toLowerCase()] += c.points;
  }
  for (const key of Object.keys(sums))
    if (evaluation[key] !== sums[key]) throw Error('Subtotal da equipe inconsistente.');
  if (evaluation.total !== Object.values(sums).reduce((a, b) => a + b, 0))
    throw Error('Nota oficial da equipe inconsistente.');
  return evaluation;
}

export async function validateDelivery(response, expected, options = {}) {
  const receipt = response?.receipt;
  if (!receipt || receipt.activity !== CONFIG.activity || receipt.schema !== CONFIG.schema ||
      receipt.rubric !== CONFIG.rubric || receipt.instrument !== CONFIG.instrument ||
      receipt.packageSha256 !== expected.packageSha256 || receipt.pdfSha256 !== expected.pdfSha256 ||
      receipt.challengeId !== expected.challengeId || receipt.team !== expected.team ||
      !hex(receipt.answersSha256) || !hex(receipt.signature) || typeof receipt.receiptId !== 'string' ||
      !Number.isFinite(Date.parse(receipt.receivedAt)) ||
      canonical(receipt.sourceHashes) !== canonical(expected.sourceHashes)) throw Error('Recibo inválido: a entrega não foi confirmada.');
  validateEvaluation(response.evaluation, expected.team);
  if (canonical(receipt.members) !== canonical(expected.members) ||
      canonical(receipt.evaluation) !== canonical(response.evaluation) ||
      canonical(response.evaluation) !== canonical(expected.evaluation))
    throw Error('O recibo não corresponde à equipe e à nota verificada.');
  const confirmation = await request('validateReceipt', { receipt }, options);
  if (confirmation.valid !== true || confirmation.receiptId !== receipt.receiptId ||
      confirmation.receiptSha256 !== await sha256(canonical(receipt)) ||
      confirmation.packageSha256 !== receipt.packageSha256 || confirmation.pdfSha256 !== receipt.pdfSha256 ||
      confirmation.answersSha256 !== receipt.answersSha256 || confirmation.signature !== receipt.signature) throw Error('Não foi possível validar a assinatura do recibo. A entrega não foi confirmada.');
  return receipt;
}
