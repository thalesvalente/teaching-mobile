/**
 * Mobile 2026 — receptor de entregas da disciplina (GAS V8).
 * A nota da Aula 07 é corrigida no servidor pelo avaliador ORIGINAL em RubricaAula07.gs.
 * MVP por link: nomes informados NÃO equivalem a identidade autenticada.
 * Não colocar segredos, respostas reais ou PDFs neste repositório.
 */
const MOBILE_CFG = Object.freeze({
  spreadsheetId: '1z5VEmScYCtfsEGg0AahY3cHE5eYO79Zj0xLMzx4iT0Y',
  version: 'mobile-entregas-1.0.0',
  maxBytes: 220000,
  activities: Object.freeze({
    'MOBILE-AULA07-2026': Object.freeze({
      sheet: '4º Bimestre', column: 'Aula 07',
      schema: 'mobile-a07-v1', rubric: 'mobile-a07-simulador-1.1.0',
      instrument: 'simulador-html', evaluator: 'aula07'
    })
    // Aula 08+: cadastrar SOMENTE após ler a ficha real e implementar avaliador equivalente.
  })
});
const MOBILE_AUDIT_HEADERS = Object.freeze([
  'Aluno','Equipe','Atividade','Instrumento','Data/hora BRT','Recebido UTC',
  'ID entrega','SHA-256 PDF','SHA-256 respostas','Assinatura HMAC',
  'XP / 100','Nota / 10','Autoavaliação declarada / 10',
  'Situação','Rubrica/versão','Respostas JSON','Chave interna'
]);
const MOBILE_EVIDENCE_LENGTH = Object.freeze({
  nativeStatus: 50, nativeDevice: 180, nativeFiles: 1500,
  nativeCommit: 240, nativeTest: 2000, nativeRequirement: 1000,
  nativePending: 1200, aiLog: 1200
});
function mobileNormal(s) {
  return String(s || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');
}
function mobileText(s) {
  const v = String(s || '').trim();
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function mobileRead(v, max, label) {
  if (v === undefined || v === null) return '';
  if (typeof v !== 'string' || v.length > max ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(v))
    throw Error('Campo inválido: ' + label);
  return v.trim();
}
function mobileArray4(v, max, label) {
  if (v === undefined) return ['', '', '', ''];
  if (!Array.isArray(v) || v.length !== 4) throw Error('Registro inválido: ' + label);
  return v.map((x, i) => mobileRead(x, max, label + ' ' + i));
}
function mobilePractice(v, label) {
  if (v === undefined) return {};
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw Error('Autoavaliação inválida: ' + label);
  const out = {};
  for (const [key, checked] of Object.entries(v)) {
    if (!/^(?:[1-9]|1[0-9]|20)$/.test(key) || typeof checked !== 'boolean')
      throw Error('Critério declarado inválido: ' + label);
    out[key] = checked;
  }
  return out;
}
function mobileEvidence(v, label) {
  if (v === undefined) v = {};
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw Error('Evidências inválidas: ' + label);
  for (const key of Object.keys(v)) if (!(key in MOBILE_EVIDENCE_LENGTH))
    throw Error('Chave de evidência desconhecida: ' + key);
  const out = {};
  for (const [key, max] of Object.entries(MOBILE_EVIDENCE_LENGTH))
    out[key] = mobileRead(v[key], max, label + '.' + key);
  if (out.nativeStatus && !['pendente', 'parcial', 'executado'].includes(out.nativeStatus))
    throw Error('Situação nativa inválida.');
  return out;
}
function mobileDraft(v, label) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw Error('Rascunho inválido: ' + label);
  for (const key of Object.keys(v)) {
    if (!['practice', 'practiceEvidence', 'evidence'].includes(key))
      throw Error('Campo de rascunho desconhecido: ' + label + '.' + key);
  }
  return {
    practice: mobilePractice(v.practice, label),
    practiceEvidence: mobileArray4(v.practiceEvidence, 2000, label + '.practiceEvidence'),
    evidence: mobileEvidence(v.evidence, label + '.evidence')
  };
}
function mobileValidDate(s) {
  if (!s) return true;
  if (!/^\d{4}-\d\d-\d\d$/.test(s) || s < '2000-01-01' || s > '2100-12-31') return false;
  const date = new Date(s + 'T12:00:00Z');
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === s;
}
function mobileActivity(code) {
  if (typeof code !== 'string' || !Object.prototype.hasOwnProperty.call(MOBILE_CFG.activities, code))
    throw Error('Atividade não habilitada.');
  return MOBILE_CFG.activities[code];
}
function mobileSanitizeAula07(snapshot, activity) {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot) ||
      snapshot.schema !== activity.schema)
    throw Error('Ficha ou versão incompatível.');
  const allowed = ['schema','version','project','team','date','members','choice',
    'reflections','hints','attempts','practice','practiceEvidence',
    'evidence','projectDrafts','scores'];
  for (const key of Object.keys(snapshot)) if (!allowed.includes(key))
    throw Error('Campo de entrega desconhecido: ' + key);
  const project = mobileRead(snapshot.project, 20, 'projeto');
  if (!Object.prototype.hasOwnProperty.call(MobileRubricAula07.PROJECTS, project))
    throw Error('Projeto inválido.');
  const team = mobileRead(snapshot.team, 80, 'equipe');
  const date = mobileRead(snapshot.date, 10, 'data');
  if (!mobileValidDate(date)) throw Error('Data da atividade inválida.');
  if (!Array.isArray(snapshot.members) || snapshot.members.length < 1 || snapshot.members.length > 8)
    throw Error('Quantidade de componentes inválida.');
  const members = snapshot.members.map((m, i) => {
    if (!m || typeof m !== 'object' || Array.isArray(m)) throw Error('Componente inválido.');
    for (const key of Object.keys(m)) if (!['name', 'contribution'].includes(key))
      throw Error('Campo de componente desconhecido.');
    return {
      name: mobileRead(m.name, 100, 'nome ' + i),
      contribution: mobileRead(m.contribution, 800, 'participação ' + i)
    };
  });
  if (members.some(m => m.contribution && !m.name))
    throw Error('Informe o nome de quem declarou participação.');
  const names = members.map(m => m.name).filter(Boolean);
  if (!names.length) throw Error('Informe o nome completo de ao menos um estudante.');
  const seen = new Set();
  for (const name of names) {
    if (name.length < 3 || !/^[\p{L}][\p{L}\p{M} .'\-]{2,99}$/u.test(name))
      throw Error('Nome de estudante inválido; informe o nome completo.');
    if (seen.has(mobileNormal(name))) throw Error('Integrante duplicado.');
    seen.add(mobileNormal(name));
  }
  const rawChoice = snapshot.choice;
  if (!rawChoice || typeof rawChoice !== 'object' || Array.isArray(rawChoice))
    throw Error('Escolhas inválidas.');
  const keys = MobileRubricAula07.KEYS;
  for (const key of Object.keys(rawChoice)) if (!keys.includes(key))
    throw Error('Escolha desconhecida: ' + key);
  const choice = {};
  for (const group of MobileRubricAula07.GROUPS) for (const field of group.campos) {
    const key = field[0], value = rawChoice[key] === undefined ? '' : rawChoice[key];
    if (typeof value !== 'string' || (value && !field[2].some(option => option[0] === value)))
      throw Error('Alternativa inválida: ' + key);
    choice[key] = value;
  }
  const reflections = mobileArray4(snapshot.reflections, 1500, 'reflexões');
  const practice = mobilePractice(snapshot.practice, 'prática');
  const practiceEvidence = mobileArray4(snapshot.practiceEvidence, 2000, 'evidências por missão');
  const evidence = mobileEvidence(snapshot.evidence, 'evidências');
  const projectDrafts = {};
  if (snapshot.projectDrafts !== undefined) {
    if (!snapshot.projectDrafts || typeof snapshot.projectDrafts !== 'object' ||
        Array.isArray(snapshot.projectDrafts)) throw Error('Rascunhos inválidos.');
    for (const [key, value] of Object.entries(snapshot.projectDrafts)) {
      if (!Object.prototype.hasOwnProperty.call(MobileRubricAula07.PROJECTS, key))
        throw Error('Trilha de rascunho desconhecida.');
      projectDrafts[key] = mobileDraft(value, key);
    }
  }
  function counters(v, name) {
    if (v === undefined) return [0,0,0,0];
    if (!Array.isArray(v) || v.length !== 4 || v.some(x => !Number.isSafeInteger(x) || x < 0 || x > 999))
      throw Error('Contadores inválidos: ' + name);
    return v.slice();
  }
  const normalized = {
    schema: activity.schema, version: MobileRubricAula07.VERSION,
    project, team, date, members, choice, reflections,
    hints: counters(snapshot.hints, 'dicas'), attempts: counters(snapshot.attempts, 'tentativas'),
    practice, practiceEvidence, evidence, projectDrafts
    // "scores" fornecidos pelo navegador são SEMPRE ignorados.
  };
  const results = MobileRubricAula07.avaliar(choice, project);
  if (results.length !== 20 || results.some(r => r.max !== .5))
    throw Error('Rubrica da Aula 07 incompatível.');
  const grade = results.reduce((sum, r) => sum + r.pontos, 0);
  if (!Number.isFinite(grade) || grade < 0 || grade > 10 || Math.round(grade * 2) !== grade * 2)
    throw Error('Nota calculada inválida.');
  const xp = grade * 10;
  const declaredGrade = Object.values(practice).filter(Boolean).length * .5;
  const answerJson = JSON.stringify({ ...normalized, evaluation: {
    instrument: activity.instrument, rubric: activity.rubric, grade, xp,
    passed: results.filter(r => r.status === 'passou').length,
    pending: results.filter(r => r.status === 'pendente').length,
    criteria: results.map(r => ({id:r.id,status:r.status,pontos:r.pontos}))
  }});
  if (answerJson.length > 48000) throw Error('Respostas acima do limite da célula de auditoria.');
  return { names, team, grade, xp, declaredGrade, answerJson };
}
// Registro explícito de adaptadores: nenhuma futura aula herdará silenciosamente a rubrica da Aula 07.
function mobileSanitize(snapshot, activity) {
  const adapters = {aula07: mobileSanitizeAula07};
  const handler = adapters[activity.evaluator];
  if (!handler) throw Error('Avaliador não implementado para esta atividade.');
  return handler(snapshot, activity);
}
function mobileSha256(str) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,str,Utilities.Charset.UTF_8)
    .map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2,'0')).join('');
}
function mobileHmac(str, key) {
  return Utilities.computeHmacSha256Signature(str, key)
    .map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2,'0')).join('');
}
function mobileReceiptSecret() {
  const props = PropertiesService.getScriptProperties();
  let value = props.getProperty('MOBILE_RECEIPT_HMAC_SECRET');
  if (!value) {
    value = Utilities.getUuid() + Utilities.getUuid() + Utilities.getUuid();
    props.setProperty('MOBILE_RECEIPT_HMAC_SECRET', value);
  }
  return value;
}
function mobileHeaders(sheet, headers) {
  if (!sheet) throw Error('Aba obrigatória ausente.');
  const actual = sheet.getRange(1,1,1,headers.length).getValues()[0];
  if (headers.some((x,i) => x !== actual[i]))
    throw Error('Cabeçalhos incompatíveis: ' + sheet.getName());
}
function mobileColumnLetter(col) {
  let result = '';
  while (col > 0) { result = String.fromCharCode(65 + (col - 1) % 26) + result; col = Math.floor((col - 1)/26); }
  return result;
}
function mobileColumn(sheet, activity) {
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  if (headers[0] !== 'Aluno' || headers[1] !== 'Equipe')
    throw Error('Boletim com cabeçalhos inválidos.');
  let media = headers.indexOf('Média') + 1;
  if (media < 3) throw Error('Coluna Média ausente.');
  let col = headers.indexOf(activity.column) + 1;
  if (!col) {
    sheet.insertColumnBefore(media);
    col = media; media++;
    sheet.getRange(1,col).setValue(activity.column);
    const count = sheet.getLastRow() - 1;
    if (count) sheet.getRange(2,col,count,1).setValues(Array.from({length:count},() => [0]));
  }
  if (col < 3 || col >= media) throw Error('Coluna da atividade fora do intervalo.');
  return {col,media};
}
function mobileGradeUpsert(sheet, name, team, col, media, grade) {
  const last = sheet.getLastRow();
  const people = last > 1 ? sheet.getRange(2,1,last-1,2).getValues() : [];
  let row = 0;
  for (let i = 0; i < people.length; i++) if (mobileNormal(people[i][0]) === mobileNormal(name)) {
    if (row) throw Error('Estudante duplicado no boletim.');
    row = i + 2;
    if (people[i][1] && team && mobileNormal(people[i][1]) !== mobileNormal(team))
      throw Error('Conflito de equipe: confira o estudante.');
  }
  if (!row) {
    row = last + 1;
    sheet.getRange(row,1,1,media).setValues([
      [mobileText(name),mobileText(team),...Array(media-3).fill(0),'']
    ]);
  } else sheet.getRange(row,2).setValue(mobileText(team));
  sheet.getRange(row,col).setValue(grade);
}
function mobileRefreshAverages(sheet, media) {
  const last = sheet.getLastRow();
  if (last < 2) return;
  const count = media - 3, lastAct = mobileColumnLetter(media - 1);
  const formulas = Array.from({length:last-1},(_,i) => {
    const row = i + 2;
    return [count ? '=SUM(C'+row+':'+lastAct+row+')/'+count : '=0'];
  });
  sheet.getRange(2,media,last-1,1).setFormulas(formulas);
  sheet.getRange(2,3,last-1,media-2).setNumberFormat('0.0');
}
function mobileAuditUpsert(sheet, values, key) {
  mobileHeaders(sheet, MOBILE_AUDIT_HEADERS);
  const last = sheet.getLastRow();
  const existing = last > 1 ? sheet.getRange(2,17,last-1,1).getValues() : [];
  let row = 0;
  existing.forEach((x,i) => { if (x[0] === key) { if (row) throw Error('Auditoria duplicada.'); row = i + 2; } });
  sheet.getRange(row || last+1,1,1,MOBILE_AUDIT_HEADERS.length).setValues([values]);
}
function processMobileDelivery(body) {
  if (typeof body !== 'string' || !body || body.length > MOBILE_CFG.maxBytes)
    throw Error('Envio ausente ou muito grande.');
  let delivery;
  try { delivery = JSON.parse(body); } catch { throw Error('JSON inválido.'); }
  if (!delivery || typeof delivery !== 'object' || Array.isArray(delivery))
    throw Error('Envelope inválido.');
  const activity = mobileActivity(delivery.activity);
  if (delivery.schema !== activity.schema) throw Error('Esquema incompatível.');
  const pdfHash = String(delivery.pdfSha256 || '');
  if (!/^[a-f0-9]{64}$/.test(pdfHash)) throw Error('SHA-256 do PDF inválido.');
  const item = mobileSanitize(delivery.snapshot, activity);
  const ss = SpreadsheetApp.openById(MOBILE_CFG.spreadsheetId);
  const grade = ss.getSheetByName(activity.sheet);
  const audit = ss.getSheetByName('Auditoria');
  if (!grade || !audit) throw Error('Abas da disciplina não encontradas.');
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    mobileHeaders(audit,MOBILE_AUDIT_HEADERS);
    // Validar conflitos de todos os integrantes ANTES de iniciar o upsert.
    const rows = grade.getLastRow() > 1 ? grade.getRange(2,1,grade.getLastRow()-1,2).getValues() : [];
    for (const name of item.names) {
      const matches = rows.filter(x => mobileNormal(x[0]) === mobileNormal(name));
      if (matches.length > 1 || (matches[0] && matches[0][1] && item.team &&
          mobileNormal(matches[0][1]) !== mobileNormal(item.team)))
        throw Error('Conflito de estudante/equipe.');
    }
    const {col,media} = mobileColumn(grade,activity);
    const time = new Date(), receivedAt = time.toISOString();
    const local = Utilities.formatDate(time,'America/Fortaleza','dd/MM/yyyy HH:mm:ss');
    const receiptId = Utilities.getUuid();
    const answersHash = mobileSha256(item.answerJson);
    const signature = mobileHmac(JSON.stringify([
      receiptId,receivedAt,delivery.activity,activity.instrument,
      pdfHash,answersHash,item.names.map(mobileNormal),
      item.xp,item.grade,activity.rubric
    ]),mobileReceiptSecret());
    for (const name of item.names) {
      const key = delivery.activity + '|' + mobileNormal(name);
      const values = [mobileText(name),mobileText(item.team),delivery.activity,
        activity.instrument,local,receivedAt,receiptId,pdfHash,answersHash,
        signature,item.xp,item.grade,item.declaredGrade,
        'Nota automática do simulador; prática declarada separada',
        activity.rubric + ' / ' + MOBILE_CFG.version,item.answerJson,key];
      mobileAuditUpsert(audit,values,key);
    }
    for (const name of item.names)
      mobileGradeUpsert(grade,name,item.team,col,media,item.grade);
    if (grade.getLastRow() > 1) {
      grade.getRange(2,1,grade.getLastRow()-1,media).sort(1);
      mobileRefreshAverages(grade,media);
    }
    if (audit.getLastRow() > 1) audit.getRange(2,1,audit.getLastRow()-1,
      MOBILE_AUDIT_HEADERS.length).sort([{column:1,ascending:true},{column:3,ascending:true}]);
    SpreadsheetApp.flush();
    return {ok:true,activity:delivery.activity,instrument:activity.instrument,
      receiptId,receivedAt,pdfSha256:pdfHash,answersSha256:answersHash,
      signature,grade:item.grade,xp:item.xp,gradeStatus:'simulador-automatico',
      message:'Entrega confirmada. Nota do simulador: '+item.grade.toFixed(1)+'/10.'};
  } finally { lock.releaseLock(); }
}
function doGet() {
  return ContentService.createTextOutput(
    'Mobile — endpoint de entrega ativo. Versão: ' + MOBILE_CFG.version);
}
function doPost(e) {
  const nonce = String(e && e.parameter && e.parameter.nonce || '').slice(0,100);
  let response;
  try {
    if (PropertiesService.getScriptProperties().getProperty('MOBILE_WEB_SUBMISSIONS_ENABLED') !== 'true')
      throw Error('Recebimento Mobile ainda não habilitado pelo professor.');
    response = processMobileDelivery(String(e && e.parameter && e.parameter.payload || ''));
  } catch (error) { response = {ok:false,error:String(error.message || 'Entrega recusada.')}; }
  const data = JSON.stringify({channel:'mobile-entrega-aula07',nonce,...response})
    .replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta charset="utf-8"><script>top.postMessage(' +
    data + ', "*");</scr' + 'ipt>'
  ).setTitle('Comprovante de entrega Mobile');
}
function testarConexaoMobile() {
  const ss = SpreadsheetApp.openById(MOBILE_CFG.spreadsheetId);
  const names = ['1º Bimestre','2º Bimestre','3º Bimestre','4º Bimestre','Auditoria'];
  if (ss.getSheets().length !== 5) throw Error('São necessárias exatamente cinco abas.');
  for (const name of names) if (!ss.getSheetByName(name)) throw Error('Aba ausente: '+name);
  mobileHeaders(ss.getSheetByName('Auditoria'),MOBILE_AUDIT_HEADERS);
  const sheet=ss.getSheetByName('4º Bimestre');
  const headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  if (headers[0]!=='Aluno'||headers[1]!=='Equipe'||!headers.includes('Aula 07')||!headers.includes('Média'))
    throw Error('Boletim do 4º Bimestre incompatível.');
  const blank = mobileSanitize({schema:'mobile-a07-v1',project:'memorias',
    team:'',date:'',members:[{name:'QA Ana',contribution:''}],choice:{}},
    mobileActivity('MOBILE-AULA07-2026'));
  if (blank.grade !== 0 || blank.xp !== 0) throw Error('Rubrica de nota zero incorreta.');
  console.log('Planilha: '+ss.getName());
  console.log('Versão: '+MOBILE_CFG.version);
  console.log('Critérios: '+MobileRubricAula07.avaliar({},'eda').length);
  console.log('Diagnóstico Mobile: PASS');
}
