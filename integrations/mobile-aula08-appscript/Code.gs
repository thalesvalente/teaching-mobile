/** V3.2.0: only HTTP handlers and authenticated administrative facades are public.
 * Helpers live inside a closure; no secret, store or signature helper is a top-level RPC.
 * Do not reintroduce top-level aliases from test harnesses in this project.
 */
var MOBILE_V4_PRIVATE_ = (function(){
/**
 * MOBILE-A08-LAB-V4 — 4.1.0 — QA e PROD separados; ativação explícita.
 * SOMENTE Programação para Dispositivos Móveis. Nenhum recurso Web/PPI é usado.
 * Identificação declarada sem login; administração autenticada e recepção bloqueada por padrão.
 * Matrícula como texto; conflitos de identidade sem divulgação de terceiros.
 * Lock + UMA chamada Sheets.Spreadsheets.batchUpdate + readback.
 * A equipe não define identidade. O cadastro do aluno é global à disciplina.
 */
var MOBILE_CFG=Object.freeze({
  spreadsheetId:'1pkbf3rJD3R5-lX7TuOyfir0A4ID1m2QfUg8ZIfNOeT0',
  version:'mobile-notas-4.1.0',activity:'MOBILE-A08-2026',
  schema:'ifma-mobile-aula08-lab-v1',channel:'mobile-entrega-aula08',
  origin:'https://thalesvalente.github.io',maxPayloadChars:44000,maxRows:10000
});
var MOBILE_TASKS=Object.freeze([
  ['M1-01',5],
  ['M1-02',5],
  ['M1-03',5],
  ['M1-04',5],
  ['M1-05',5],
  ['M2-01',5],
  ['M2-02',5],
  ['M2-03',5],
  ['M2-04',5],
  ['M3-01',5],
  ['M3-02',5],
  ['M3-03',5],
  ['M3-04',5],
  ['M3-05',5],
  ['M3-06',5],
  ['M4-01',5],
  ['M4-02',5],
  ['M4-03',5],
  ['M4-04',5],
  ['M4-05',5]
]);
var NOTAS_STATUS='PENDENTE_VALIDACAO';
var MOBILE_PROTECTED_IDS=Object.freeze([MOBILE_CFG.spreadsheetId,'1z5VEmScYCtfsEGg0AahY3cHE5eYO79Zj0xLMzx4iT0Y','1cPQD_ie3cEqt11fLXT398DPQIi5bnqkmTqfl9yk8a_Q']);
var A_HEADERS=Object.freeze(['Matrícula','Nome completo','Nome normalizado','Estado de validação','Fonte docente','Atualização UTC','Homônimo liberado','Observação docente']);
var R_HEADERS=Object.freeze(['Matrícula','Atividade','Maior nota /10','Recibo vencedor','Equipe vencedora','Atualização UTC','Estado docente','Nome no registro','SHA-256 vencedor','Último recibo']);
var T_HEADERS=Object.freeze(['Equipe','Integrantes (nomes)','Quantidade','Atividade','Maior nota da equipe /10','Situação','Recibo vencedor','Enviado UTC','Chave da equipe','SHA-256 evidência','Observação docente','Revisado UTC','Recibo último envio','Último envio UTC','Matrículas JSON','Contrato']);
var AU_HEADERS=Object.freeze([
  'Equipe','ID equipe (automático)','Integrantes (nomes)','Atividade','Instrumento',
  'Data/hora BRT','Recebido UTC','ID entrega','SHA-256 evidência','Assinatura HMAC',
  'Nota recebida /10','Nota oficial /10','Situação','Rubrica/versão','JSON evidência sem XP',
  'Chave interna','Código SHA-256','Origem','Observação docente','Revisado UTC',
  'Lista de integrantes da equipe','SHA-256 armazenado','Nonce SHA-256','Requisição SHA-256',
  'Tipo registro','Integrantes JSON','Contrato','Pendência docente'
]);
var ACT_HEADERS=Object.freeze(['ID atividade','Nome','Bimestre','Cabeçalho da nota','Contrato entrada','Habilitada']);
function webFail(message) {
  var error=new Error(message);error.webPublic=true;throw error;
}

function webText(value, max, label) {
  if (typeof value !== 'string' || value.length > max ||
      /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(value))
    webFail('Campo inválido: ' + label);
  return value.trim();
}
/** Não altera bytes de TSX: o SHA-256 do cliente deve bater com o servidor. */
function webCode(value) {
  if (typeof value !== 'string' || value.length > 30000 ||
      /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(value))
    webFail('Campo inválido: arquivo TSX');
  if (!value.trim()) webFail('Código TSX ausente.');
  return value;
}
function webSafe(value) {
  var str = String(value === null || value === undefined ? '' : value).trim();
  return /^[=+\-@]/.test(str) ? "'" + str : str;
}
function webNormalized(value) {
  return String(value || '').trim().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[’‘]/g,"'").replace(/\s+/g,' ').toLowerCase();
}
function webEvidence(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    webFail('Evidência ausente.');
  if (value.schema !== MOBILE_CFG.schema || value.tipo !== 'formativo-nao-e-nota' ||
      value.maximoXp !== 100 || !Number.isSafeInteger(value.xp))
    webFail('Versão ou pontuação de origem incompatível.');
  if (!Array.isArray(value.exercicios) || value.exercicios.length !== MOBILE_TASKS.length)
    webFail('Quantidade de exercícios incompatível.');
  var reported = 0, clean=[];
  MOBILE_TASKS.forEach(function(task,index){
    var ex=value.exercicios[index];
    if (!ex || typeof ex !== 'object' || ex.id !== task[0] ||
        ex.maximoXp !== task[1] ||
        !['APROVADO','PENDENTE'].includes(ex.estado) ||
        ex.xp !== (ex.estado === 'APROVADO' ? task[1] : 0))
      webFail('Resultado declarado inválido na missão '+(index+1)+'.');
    reported += ex.xp;
    clean.push({
      id:task[0],estado:ex.estado,xp:ex.xp,maximoXp:task[1],
      comentario: typeof ex.comentario === 'string' ? webText(ex.comentario,280,'comentário') : ''
    });
  });
  if (reported !== value.xp || reported < 0 || reported > 100)
    webFail('XP declarado inconsistente.');
  // A verificação acima valida apenas a CONSISTÊNCIA do relato; ela NÃO
  // executa o código do estudante nem comprova a autoria/nota.
  var source=webCode(value.codigoFonteCompleto); // Preserva whitespace e hash byte a byte.
  var observation=webText(value.observacao || '',2000,'observação');
  var nativeNote=webText(value.testeNativoPendente || '',1000,'teste nativo');
  return {
    schema:MOBILE_CFG.schema, tipo:'formativo-nao-e-nota',
    xp:reported,maximoXp:100,exercicios:clean,
    observacao:observation,testeNativoPendente:nativeNote,
    codigoFonteCompleto:source
  };
}
function webHex(bytes) {
  return bytes.map(function(b){return ('0'+(b<0?b+256:b).toString(16)).slice(-2);}).join('');
}
function webSha256(text) {
  return webHex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(text),Utilities.Charset.UTF_8));
}

function notasAssert(condition, message) { if(!condition)webFail(message); }
function notasBlank(value) { return value==='' || value===null || value===undefined; }
function notasGrade(value, label) {
  notasAssert(typeof value==='number' && Number.isFinite(value) && value>=0 && value<=10,
    'Nota inválida (0 a 10): '+(label||'atividade')+'.');
  return value;
}
function notasMax(previous, received) {
  notasGrade(received);
  return notasBlank(previous)?received:Math.max(notasGrade(previous,'anterior'),received);
}
function notasMean(values) {
  var nums=values.filter(function(v){return !notasBlank(v);}).map(function(v){return notasGrade(v);});
  if(!nums.length)return '';
  return Math.round((nums.reduce(function(a,b){return a+b;},0)/nums.length+Number.EPSILON)*100)/100;
}

function notasErr(code, memberIndex, field, message, action) {
  var e=new Error(message);e.publicCode=code;e.memberIndex=memberIndex;
  e.field=field;e.action=action||'Confira os dados e procure o professor.';e.webPublic=true;throw e;
}
function notasFullName(name) {
  if(typeof name!=='string'||name.length>100)return false;
  var s=name.trim();return s.length>=5 && /^[\p{L}\p{M}'’\-\s]+$/u.test(s) &&
    s.split(/\s+/).length>=2 && s.split(/\s+/).every(function(part){
      // A conjunção portuguesa e é válida em nomes completos cadastrados.
      if(part.toLowerCase()==='e')return true;
      return /^[\p{L}][\p{L}\p{M}'’\-]*$/u.test(part) &&
        part.split(/[-'’]/).every(function(x){return x.length>0;}) &&
        part.split(/[-'’]/).some(function(x){return (x.match(/\p{L}/gu)||[]).length>=2;});
    });
}
function notasEnrollment(value, i) {
  if(typeof value!=='string'||!value.trim())
    notasErr('MATRICULA_OBRIGATORIA',i,'enrollment','Informe a matrícula completa.','Consulte sua matrícula ou procure o professor.');
  // Canonicaliza SOMENTE a entrada de pesquisa. Alunos nunca é regravada.
  var key=value.trim().toUpperCase();
  if(!/^[0-9]{8}\.ITA[0-9]{4}$/.test(key))
    notasErr('MATRICULA_FORMATO_INVALIDO',i,'enrollment','Use a matrícula completa, com ponto, letras ITA e zeros iniciais.','Confira o documento da turma. Não use somente os últimos algarismos.');
  return key;
}

function webIdentity(input) {
  notasExactKeys_(input,['team','teamId','members']);
  var team=webText(input.team,80,'equipe'),teamId=webText(input.teamId,36,'ID técnico');
  notasAssert(team.length>=3,'Nome da equipe incompleto.');
  notasAssert(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(teamId),'Identificador técnico inválido.');
  notasAssert(Array.isArray(input.members)&&input.members.length>=1&&input.members.length<=8,'Informe entre 1 e 8 integrantes.');
  var seen=Object.create(null);
  var members=input.members.map(function(m,i){
    notasExactKeys_(m,['enrollment','confirmationToken','confirmed']);
    var key=notasEnrollment(m.enrollment,i);
    if(seen[key])notasErr('MATRICULA_DUPLICADA_EQUIPE',i,'enrollment','Matrícula repetida na equipe.','Cada integrante deve ser incluído uma única vez.');
    seen[key]=true;
    if(m.confirmed!==true||typeof m.confirmationToken!=='string'||!(/^(?:\d{13}|v2)\.[a-f0-9]{64}$/.test(m.confirmationToken)))
      notasErr('CONFIRMACAO_OBRIGATORIA',i,'enrollment','Consulte a matrícula e confirme o nome exibido.','Reinicie a identificação local e consulte novamente.');
    return {enrollment:key,confirmationToken:m.confirmationToken,confirmed:true};
  });
  return {team:team,teamId:teamId,members:members};
}

function notasAverageFormula(row, count) {
  if(!count)return '=IF($A'+row+'="";"";"")';
  return '=IF($A'+row+'="";"";IF(COUNT($D'+row+':INDEX('+row+':'+row+';1;COLUMN()-1))=0;"";ROUND(AVERAGE($D'+row+':INDEX('+row+':'+row+';1;COLUMN()-1));2)))';
}
function notasConfig() {
  var p=PropertiesService.getScriptProperties(),mode=p.getProperty('MOBILE_NOTAS_ENVIRONMENT')||'PROD';
  notasAssert(mode==='QA'||mode==='PROD','Ambiente Mobile inválido.');
  var prefix='MOBILE_NOTAS_'+mode+'_',id=p.getProperty(prefix+'SPREADSHEET_ID')||(mode==='PROD'?MOBILE_CFG.spreadsheetId:'');
  if(mode==='PROD')notasAssert(id===MOBILE_CFG.spreadsheetId,'Destino de produção não autorizado.');
  else notasAssert(/^[A-Za-z0-9_-]{20,100}$/.test(id)&&MOBILE_PROTECTED_IDS.indexOf(id)<0&&
    p.getProperty(prefix+'DATA_POLICY')==='SYNTHETIC_ONLY','QA exige planilha isolada e dados sintéticos.');
  var origin=mode==='QA'?(p.getProperty(prefix+'ALLOWED_ORIGIN')||MOBILE_CFG.origin):MOBILE_CFG.origin;
  notasAssert(origin===MOBILE_CFG.origin||(mode==='QA'&&/^http:\/\/(?:localhost|127\.0\.0\.1):\d{2,5}$/.test(origin)),'Origem QA inválida.');
  return {id:id,mode:mode,prefix:prefix,origin:origin,enabled:p.getProperty(prefix+'SUBMISSIONS_ENABLED')==='true'&&
    p.getProperty(prefix+'SECURITY_READY')==='true'&&p.getProperty(prefix+'TEACHER_APPROVAL')===
    (mode==='PROD'?'A08-V4-APPROVED':'A08-V4-QA-SYNTHETIC')&&
    (mode==='QA'||(p.getProperty(prefix+'TEACHER_RUBRIC_APPROVAL')==='A08-V4-RUBRIC-20X05'&&
      String(p.getProperty(prefix+'QA_HOMOLOGATION_REF')||'').trim().length>=8))};
}

function notasSecret() {
  var cfg=notasConfig(),s=PropertiesService.getScriptProperties().getProperty(cfg.prefix+'HMAC_SECRET');
  notasAssert(typeof s==='string'&&s.length>=48,'Chave privada Mobile não configurada.');return s;
}

function notasSign(text){return webHex(Utilities.computeHmacSha256Signature(String(text),notasSecret()));}
function notasNoXpKeys(value){return !value||typeof value!=='object'||Object.keys(value).every(function(k){return !/^(xp|maximoXp|xpReported)$/i.test(k)&&notasNoXpKeys(value[k]);});}
function notasIdentityAllowed(identity,config){
  notasAssert(config.mode==='PROD'||config.mode==='QA','Ambiente inválido.');
  notasAssert(identity.members.length>=1&&identity.members.length<=8,'Integrantes inválidos.');
  if(config.mode==='QA')notasAssert(identity.members.every(function(m){return /^00000000\.ITA\d{4}$/.test(m.enrollment);}),
    'QA aceita exclusivamente matrículas sintéticas 00000000.ITA0001–9999.');
}

function notasRateLimit_(identity){
  var cache=CacheService.getScriptCache(),minute=Math.floor(Date.now()/60000),hour=Math.floor(Date.now()/3600000);
  var mode=notasConfig().mode.toLowerCase();var keys=[[mode+':global:'+minute,180,120],[mode+':team:'+hour+':'+webSha256(identity.teamId),40,3600]];
  identity.members.forEach(function(m){keys.push([mode+':member:'+hour+':'+webSha256(m.enrollment),30,3600]);});
  keys.forEach(function(k){var n=Number(cache.get(k[0])||0);
    if(!Number.isFinite(n)||n>=k[1])notasErr('LIMITE_TEMPORARIO',null,null,
      'Limite temporário de tentativas. Aguarde antes de tentar novamente.','Suas respostas foram preservadas. Procure o professor se o problema persistir.');
  });
  keys.forEach(function(k){cache.put(k[0],String(Number(cache.get(k[0])||0)+1),k[2]);});
}
function notasNormalize(payload){
  notasAssert(payload&&typeof payload==='object'&&!Array.isArray(payload),'Payload inválido.');
  notasExactKeys_(payload,['operation','environment','schema','activity','identity','evidence']);
  var identity=webIdentity(payload.identity),contract=payload.schema;
  notasAssert(contract==='mobile-a08-lab-v4'&&payload.activity===MOBILE_CFG.activity,'Contrato exclusivo de MOBILE-A08-2026.');
  var original=webEvidence(payload.evidence),code=original.codigoFonteCompleto,technical=payload.evidence.technicalEvaluation||null;
  if(technical){
    notasExactKeys_(technical,['provenance','sourceRevision','sourceSha256','criteria']);
    notasAssert(technical.provenance==='LOCAL_BROWSER_UNTRUSTED'&&Number.isSafeInteger(technical.sourceRevision)&&technical.sourceRevision>=0&&
      technical.sourceSha256===webSha256(code)&&Array.isArray(technical.criteria)&&technical.criteria.length===20,'Avaliação técnica declarada inválida.');
    technical.criteria.forEach(function(r,i){notasExactKeys_(r,['id','status']);
      notasAssert(r.id===MOBILE_TASKS[i][0]&&['PASS','FAIL','NOT_RUN'].includes(r.status),'Critério técnico inválido.');});
    technical=JSON.parse(JSON.stringify(technical));
    original.technicalEvaluation=technical;
  }
  var evidence={schema:'mobile-notas-evidencia-v4',sourceSchema:original.schema,nota:null,maximoNota:10,
    provenance:'LOCAL_BROWSER_UNTRUSTED',technicalVerification:'NOT_VERIFIED',assessmentStatus:NOTAS_STATUS,
    rubric:'mobile-a08-v4-20x0.5',technicalEvaluation:technical,
    exercicios:original.exercicios.map(function(t){return{id:t.id,estado:t.estado,comentario:t.comentario};}),
    observacao:original.observacao,testeNativoPendente:original.testeNativoPendente,codigoFonteCompleto:code};
  var evidenceJson=JSON.stringify(evidence);
  return {identity:identity,contract:contract,activity:payload.activity,evidence:evidence,evidenceJson:evidenceJson,
    grade:null,claimedXp:original.xp,storedHash:webSha256(evidenceJson),originalHash:webSha256(JSON.stringify(original)),
    codeHash:webSha256(code),requestHash:webSha256(JSON.stringify({contract:contract,identity:identity,activity:payload.activity,evidence:evidence,claimedXp:original.xp})),
    instrument:'laboratorio-vivo-tsx-equipe'};
}

function notasExactKeys_(value,keys){
  notasAssert(value&&typeof value==='object'&&!Array.isArray(value),'Objeto inválido.');
  if(Object.keys(value).some(function(k){return keys.indexOf(k)<0;}))
    notasErr('OPERACAO_NAO_PERMITIDA',null,null,'O cadastro só pode ser editado manualmente pelo professor na planilha.','Atualize a página. Nenhuma alteração cadastral é permitida por este aplicativo.');
}
function notasRosterIndex_(book){
  var alunos=book.sheets.Alunos,unique=Object.create(null);notasHeaders(alunos,A_HEADERS);
  alunos.rows.forEach(function(row,i){
    if(i===0||!row||row.every(notasBlank))return;
    var key=row[0];
    notasAssert(typeof key==='string'&&/^[0-9]{8}\.ITA[0-9]{4}$/.test(key),'Cadastro precisa de conferência manual do professor.');
    notasAssert(typeof row[1]==='string'&&notasFullName(row[1])&&row[2]===webNormalized(row[1]),'Cadastro precisa de conferência manual do professor.');
    notasAssert(!unique[key],'Cadastro contém matrícula duplicada; solicite conferência docente.');
    notasAssert(!(alunos.formulas[i]||[]).some(Boolean),'Cadastro contém fórmula; solicite conferência docente.');
    if(notasConfig().mode==='QA')notasAssert(/^00000000\.ITA\d{4}$/.test(key)&&row[4]==='QA_SYNTHETIC_ONLY','Cadastro QA contém dados não sintéticos.');
    unique[key]={row:row,index:i};
  });
  return unique;
}
function notasStudent_(index,key,i){
  var saved=index[key];
  if(!saved||!['VALIDADO','VALIDADO_DOCENTE'].includes(saved.row[3]))
    notasErr('MATRICULA_NAO_DISPONIVEL',i,'enrollment','Matrícula não encontrada ou indisponível para esta atividade.','Confira a matrícula completa. Somente o professor pode corrigir o cadastro diretamente na planilha.');
  return saved;
}
function notasConfirmation_(saved,teamId,activity,expires){
  // Compatibilidade com confirmações temporárias 3.2.0 ainda válidas.
  var row=[];for(var i=0;i<8;i++)row.push(saved.row[i]===undefined?'':saved.row[i]);
  return String(expires)+'.'+notasSign(JSON.stringify(['roster-v1',teamId,activity,row,String(expires)]));
}
function notasConfirmationStable_(saved,teamId,activity){
  // Comprovante de confirmação pessoal de uso da página: sem relógio,
  // assinado sobre a linha docente completa, equipe e atividade.
  // Mudança de matrícula, nome, estado ou metadado invalida automaticamente.
  var row=[];for(var i=0;i<8;i++)row.push(saved.row[i]===undefined?'':saved.row[i]);
  return 'v2.'+notasSign(JSON.stringify(['roster-v2',teamId,activity,row]));
}
function notasHydrate_(book,n){
  var index=notasRosterIndex_(book);
  n.identity.members=n.identity.members.map(function(m,i){
    var saved=notasStudent_(index,m.enrollment,i),token=m.confirmationToken;
    if(token.indexOf('v2.')===0){
      // Validação por assinatura e cadastro atual, sem expiração cronológica.
      if(notasConfirmationStable_(saved,n.identity.teamId,n.activity)!==token)
        notasErr('CONFIRMACAO_DESATUALIZADA',i,'enrollment','O cadastro foi alterado desde a confirmação.','Consulte a matrícula novamente e confira o nome atualizado.');
    }else{
      var expires=Number(token.split('.')[0]);
      if(expires<Date.now()||expires>Date.now()+20*60000||notasConfirmation_(saved,n.identity.teamId,n.activity,expires)!==token)
        notasErr('CONFIRMACAO_DESATUALIZADA',i,'enrollment','A confirmação anterior expirou ou o cadastro mudou.','Consulte a matrícula novamente e confira o nome.');
    }
    return {name:saved.row[1],enrollment:m.enrollment};
  });
}
function notasLookup_(payload,nonce,config){
  notasExactKeys_(payload,['operation','environment','activity','teamId','enrollment']);
  notasAssert(payload.environment===config.mode&&typeof payload.activity==='string'&&/^[A-Z0-9][A-Z0-9_-]{2,79}$/.test(payload.activity),'Ambiente/atividade incompatível.');
  var key=notasEnrollment(payload.enrollment,0);notasIdentityAllowed({members:[{enrollment:key}]},config);
  var teamId=webText(payload.teamId,36,'ID técnico');
  notasAssert(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(teamId),'Identificador técnico inválido.');
  notasLookupLimit_(teamId,key);
  var book=notasReadBook(config,['Alunos','Atividades']),a=notasCatalog(book.sheets.Atividades)[payload.activity];
  notasAssert(a&&['mobile-a08-lab-v4','mobile-notas-submission-v4'].includes(a.contract),'Atividade indisponível.');
  notasCheckOpenV3(a,payload.activity,a.contract);
  var saved=notasStudent_(notasRosterIndex_(book),key,0);
  return {ok:true,channel:'mobile-roster-lookup-aula08',nonce:nonce,version:MOBILE_CFG.version,
    name:saved.row[1],enrollmentCanonical:key,confirmationToken:notasConfirmationStable_(saved,teamId,payload.activity)};
}
function notasLookupLimit_(teamId,key){
  var cache=CacheService.getScriptCache(),minute=Math.floor(Date.now()/60000);
  var keys=[['roster:global:'+minute,120],['roster:team:'+minute+':'+webSha256(teamId),24],['roster:entry:'+minute+':'+webSha256(key),12]];
  keys.forEach(function(pair){var n=Number(cache.get(pair[0])||0);
    if(!Number.isFinite(n)||n>=pair[1])notasErr('LIMITE_TEMPORARIO',null,'enrollment','Limite temporário de consultas. Aguarde antes de tentar novamente.','Não repita consultas continuamente. Procure o professor se persistir.');});
  keys.forEach(function(pair){cache.put(pair[0],String(Number(cache.get(pair[0])||0)+1),120);});
}
/** The ONLY gateway for Sheets mutations. Unknown operations and destinations fail closed. */
function notasCommit_(book,requests,config,scope){
  var current=notasConfig();notasAssert(book.id===config.id&&config.id===current.id&&config.mode===current.mode,'Destino inválido.');
  notasAssert(['catalog','submission','teacher'].includes(scope),'Escopo de escrita inválido.');
  var names=scope==='catalog'?['Atividades','1º Bimestre','2º Bimestre','3º Bimestre','4º Bimestre']:
    scope==='submission'?['Auditoria','Equipes']:['Auditoria','Equipes','Resultados','1º Bimestre','2º Bimestre','3º Bimestre','4º Bimestre'];
  var allowed=Object.create(null),blocked=book.sheets.Alunos&&book.sheets.Alunos.id;
  names.forEach(function(name){var sheet=book.sheets[name];if(sheet){notasAssert(sheet.title===name&&sheet.id!==blocked,'Destino cadastral proibido.');allowed[sheet.id]=sheet;}});
  notasAssert(Array.isArray(requests)&&requests.length>0,'Lote vazio.');
  requests.forEach(function(req){
    notasAssert(req&&Object.keys(req).length===1,'Requisição de escrita inválida.');
    var kind=Object.keys(req)[0],x=req[kind],loc;
    if(kind==='updateCells'){
      notasAssert(x&&Object.keys(x).every(function(k){return ['start','rows','fields'].includes(k);})&&x.fields==='userEnteredValue','Máscara de escrita proibida.');
      loc=x.start;notasAssert(loc&&Number.isInteger(loc.rowIndex)&&loc.rowIndex>=0&&Number.isInteger(loc.columnIndex)&&loc.columnIndex>=0,'Coordenadas explícitas obrigatórias.');
      notasAssert(Array.isArray(x.rows)&&x.rows.length>0&&x.rows.every(function(r){return Array.isArray(r.values)&&r.values.length>0;}),'Linhas inválidas.');
    }else if(scope==='catalog'&&['insertDimension','setDataValidation','repeatCell'].includes(kind)){
      loc=x.range;notasAssert(loc&&Object.keys(x).every(function(k){return ['range','inheritFromBefore','rule','cell','fields'].includes(k);}), 'Operação de catálogo inválida.');
      if(kind==='repeatCell')notasAssert(x.fields==='userEnteredValue','Máscara de catálogo proibida.');
    }else webFail('Operação de escrita não permitida.');
    notasAssert(loc&&Number.isInteger(loc.sheetId)&&allowed[loc.sheetId]&&loc.sheetId!==blocked,'Escrita cadastral proibida (INV-MAT-01).');
  });
  return Sheets.Spreadsheets.batchUpdate({requests:requests},config.id);
}

function notasColName(index){var text='';for(var n=index+1;n>0;n=Math.floor((n-1)/26))text=String.fromCharCode(65+(n-1)%26)+text;return text;}
function notasReadBook(config,titles){
  var meta=Sheets.Spreadsheets.get(config.id,{fields:'spreadsheetId,properties(locale,timeZone),sheets(properties)'});
  var ranges=titles.map(function(t){var matches=(meta.sheets||[]).filter(function(s){return s.properties.title===t;});
    notasAssert(matches.length===1,'Aba não encontrada ou ambígua: '+t);var p=matches[0].properties;
    notasAssert(p.gridProperties.rowCount<=MOBILE_CFG.maxRows,'Capacidade de linhas excedida.');
    return "'"+t.replace(/'/g,"''")+"'!A1:"+notasColName(p.gridProperties.columnCount-1)+p.gridProperties.rowCount;
  });
  var raw=Sheets.Spreadsheets.get(config.id,{ranges:ranges,includeGridData:true,fields:'spreadsheetId,sheets(properties,data(startRow,startColumn,rowData(values(userEnteredValue,effectiveValue))))'});
  var sheets=Object.create(null);
  (raw.sheets||[]).forEach(function(s){var rows=[],formulas=[];
    (s.data||[]).forEach(function(g){(g.rowData||[]).forEach(function(r,i){var ri=(g.startRow||0)+i;rows[ri]=rows[ri]||[];formulas[ri]=formulas[ri]||[];
      (r.values||[]).forEach(function(c,j){var ci=(g.startColumn||0)+j,u=c.userEnteredValue||{},v=c.effectiveValue||u;
        formulas[ri][ci]=u.formulaValue||'';
        rows[ri][ci]=Object.prototype.hasOwnProperty.call(v,'numberValue')?v.numberValue:
          Object.prototype.hasOwnProperty.call(v,'boolValue')?v.boolValue:
          Object.prototype.hasOwnProperty.call(v,'errorValue')?{error:v.errorValue}:
          Object.prototype.hasOwnProperty.call(v,'stringValue')?v.stringValue:'';
      });
    });});
    sheets[s.properties.title]={title:s.properties.title,id:s.properties.sheetId,rowCount:s.properties.gridProperties.rowCount,
      columnCount:s.properties.gridProperties.columnCount,rows:rows,formulas:formulas};
  });return {id:config.id,sheets:sheets};
}
function notasHeaders(s,expected){notasAssert(s&&expected.every(function(h,i){return s.rows[0]&&s.rows[0][i]===h;}),'Cabeçalhos incompatíveis: '+(s?s.title:'aba ausente'));}
function notasCatalog(s){notasHeaders(s,ACT_HEADERS);var result=Object.create(null),used=Object.create(null);
  s.rows.slice(1).forEach(function(r){if(!r||r.every(notasBlank)||(notasBlank(r[0])&&r.every(function(v,i){return notasBlank(v)||(i===5&&v===false);})))return;
    notasAssert(typeof r[0]==='string'&&/^[A-Z0-9][A-Z0-9_-]{2,79}$/.test(r[0])&&!result[r[0]],'Atividade ambígua.');
    notasAssert(Number.isInteger(r[2])&&r[2]>=1&&r[2]<=4,'Bimestre inválido.');
    notasAssert(typeof r[3]==='string'&&r[3].endsWith(' /10')&&r[3]!=='Média /10','Cabeçalho de nota inválido.');
    notasAssert(!used[r[2]+'|'+r[3]],'Atividade duplicada.');
    notasAssert(['manual','mobile-a08-lab-v4','mobile-notas-submission-v4'].includes(r[4])&&typeof r[5]==='boolean','Contrato/flag de atividade inválidos.');
    used[r[2]+'|'+r[3]]=true;result[r[0]]={id:r[0],bim:r[2],title:r[2]+'º Bimestre',header:r[3],contract:r[4],enabled:r[5]};
  });return result;
}
function notasActivity(book,n,readOnly){var a=notasCatalog(book.sheets.Atividades)[n.activity];
  if(!readOnly)notasCheckOpenV3(a,n.activity,n.contract);else notasAssert(a&&a.contract===n.contract,'Contrato incompatível.');
  var s=book.sheets[a.title];notasHeaders(s,['Aluno','Matrícula','Equipe']);
  var h=s.rows[0],col=h.indexOf(a.header),mean=h.indexOf('Média /10');
  notasAssert(col>=3&&col<mean&&mean>=4&&h.lastIndexOf(a.header)===col&&h.lastIndexOf('Média /10')===mean,'Cabeçalhos bimestrais inválidos.');
  return Object.assign({},a,{col:col,mean:mean});
}
function notasCell(v,f){if(f)return {userEnteredValue:{formulaValue:f}};if(notasBlank(v))return{};
  if(typeof v==='number')return{userEnteredValue:{numberValue:v}};
  if(typeof v==='boolean')return{userEnteredValue:{boolValue:v}};
  notasAssert(typeof v==='string','Tipo de célula inválido.');return{userEnteredValue:{stringValue:v}};
}
function notasWrite(s,r,c,vs){return{updateCells:{start:{sheetId:s.id,rowIndex:r,columnIndex:c},rows:[{values:vs.map(function(v){return notasCell(v);})}],fields:'userEnteredValue'}};}
function notasWriteFormula(s,r,c,f){return{updateCells:{start:{sheetId:s.id,rowIndex:r,columnIndex:c},rows:[{values:[notasCell('',f)]}],fields:'userEnteredValue'}};}
function notasNewRow(s,cols){var last=0;s.rows.forEach(function(r,i){if(i>0&&r&&cols.some(function(c){return !notasBlank(r[c])||Boolean((s.formulas[i]||[])[c]);}))last=i;});
  notasAssert(last+1<s.rowCount,'Capacidade da aba atingida.');return last+1;}
function notasRows(s,c,v){var result=[];s.rows.forEach(function(r,i){if(i>0&&r&&r[c]===v)result.push(i);});return result;}
function notasIndex(a){return a.map(function(i){return i+1;});}
function notasCheckCatalog(book){notasHeaders(book.sheets.Auditoria,AU_HEADERS);notasHeaders(book.sheets.Alunos,A_HEADERS);
  notasHeaders(book.sheets.Resultados,R_HEADERS);notasHeaders(book.sheets.Equipes,T_HEADERS);notasCatalog(book.sheets.Atividades);}

function notasCheckIdentity(book,n,readOnly){
  var unique=notasRosterIndex_(book),roster=book.sheets[notasActivity(book,n,readOnly).title];
  n.identity.members.forEach(function(m,i){
    var saved=notasStudent_(unique,m.enrollment,i);
    if(saved.row[1]!==m.name)notasErr('CONFIRMACAO_DESATUALIZADA',i,'enrollment','Cadastro atualizado pelo professor.','Consulte e confirme novamente.');
    // Equal names with distinct pre-registered enrollments are legitimate.
    roster.rows.forEach(function(row,j){if(j>0&&row&&row[1]===m.enrollment&&row[0]!==m.name)
      notasErr('VINCULO_DOCENTE_PENDENTE',i,'enrollment','O boletim precisa de conferência docente após atualização cadastral.','Procure o professor. Nenhuma correção automática foi feita.');});
  });return unique;
}

function notasAuditSign(row){
  // Todos os campos da linha, inclusive estado/nota docente, são vinculados ao HMAC.
  var copy=[];for(var i=0;i<AU_HEADERS.length;i++)copy.push(i===9?'':(row[i]===undefined?'':row[i]));
  return notasSign(JSON.stringify(copy));
}

function notasVerifyAudit(sheet,i){
  var r=sheet.rows[i],ev;
  notasAssert(r&&['MOBILE_V4_SUBMISSION','MOBILE_V4_TEACHER_REVIEW'].includes(r[24])&&r[13]===MOBILE_CFG.version,
    'Auditoria incompatível; não migrar histórico automaticamente.');
  try{ev=JSON.parse(r[14]);}catch(e){webFail('JSON armazenado inválido.');}
  notasAssert(notasNoXpKeys(ev)&&ev.nota===null&&notasBlank(r[10]),'Nota declarada não pode ser oficial.');
  notasAssert(webSha256(r[14])===r[21]&&webSha256(ev.codigoFonteCompleto||'')===r[16]&&notasAuditSign(r)===r[9],
    'Assinatura/hashes da auditoria inválidos.');
  var members;try{members=JSON.parse(r[25]);}catch(e){webFail('Integrantes da auditoria inválidos.');}
  notasAssert(Array.isArray(members)&&members.length>=1&&members.length<=8&&members.every(function(m){
    return typeof m.enrollment==='string'&&/^[0-9]{8}\.ITA[0-9]{4}$/.test(m.enrollment)&&notasFullName(m.name);}), 'Matrículas da auditoria inválidas.');
  if(r[24]==='MOBILE_V4_SUBMISSION')notasAssert(r[12]===NOTAS_STATUS&&notasBlank(r[11])&&r[27]===true,'Recepção sem validação docente.');
  else notasAssert(['VALIDADO','REJEITADO'].includes(r[12])&&((r[12]==='VALIDADO'&&typeof r[11]==='number')||(r[12]==='REJEITADO'&&notasBlank(r[11])))&&ev.teacherReview,'Revisão docente inválida.');
  if(r[12]==='VALIDADO')notasGrade(r[11]);return r;
}

function notasAuditEntry(n,nonce){
  var date=new Date(),time=date.toISOString(),nh=webSha256(nonce),receipt='MOB-'+
    Utilities.formatDate(date,'UTC','yyyyMMdd-HHmmss')+'-'+webSha256(nh+'|'+n.requestHash);
  var names=n.identity.members.map(function(m){return m.name;}).join('; ');
  var row=[n.identity.team,n.identity.teamId,names,n.activity,n.instrument,
    Utilities.formatDate(date,'America/Fortaleza','yyyy-MM-dd HH:mm:ss'),time,receipt,n.originalHash,'',
    '','',NOTAS_STATUS,MOBILE_CFG.version,n.evidenceJson,n.identity.teamId+'|'+n.activity,n.codeHash,
    'github-pages-mobile-'+notasConfig().mode.toLowerCase(),'','',names,n.storedHash,nh,n.requestHash,'MOBILE_V4_SUBMISSION',
    JSON.stringify(n.identity.members),n.contract,true];
  row[9]=notasAuditSign(row);return row;
}

function notasTeamKey(n){return n.identity.teamId+'|'+n.activity;}
function notasAuditWinner(audit,receipt,enrollment,activity){
  var matches=[];audit.rows.forEach(function(r,i){if(i>0&&r&&r[7]===receipt)matches.push(i);});
  notasAssert(matches.length===1,'Recibo vencedor ausente/duplicado na auditoria.');
  var row=notasVerifyAudit(audit,matches[0]);
  notasAssert(row[3]===activity&&JSON.parse(row[25]).some(function(m){return m.enrollment===enrollment;}),
    'Recibo vencedor não comprova matrícula/atividade.');
  return row;
}
function notasRecordIntegrity(book,n,act){
  var aud=book.sheets.Auditoria,res=book.sheets.Resultados,roster=book.sheets[act.title];
  aud.rows.forEach(function(r,i){if(i>0&&r&&!notasBlank(r[7]))notasVerifyAudit(aud,i);});
  var teams=book.sheets.Equipes,teamIndex=Object.create(null),latest=Object.create(null);
  aud.rows.forEach(function(r,i){if(i>0&&r&&r[24]==='MOBILE_V4_SUBMISSION')latest[r[15]]=r;});
  teams.rows.forEach(function(r,i){if(i>0&&r&&!notasBlank(r[8])){
    notasAssert(!teamIndex[r[8]],'Equipe duplicada.');teamIndex[r[8]]=r;
    var last=latest[r[8]];notasAssert(last&&last[7]===r[12]&&last[25]===r[14]&&last[0]===r[0]&&last[3]===r[3], 'Equipe sem readback completo do último recibo.');
    if(!notasBlank(r[4])){var ms=JSON.parse(r[14]),win=notasAuditWinner(aud,r[6],ms[0].enrollment,r[3]);
      notasAssert(win[24]==='MOBILE_V4_TEACHER_REVIEW'&&win[12]==='VALIDADO'&&win[11]===r[4]&&win[15]===r[8]&&r[5]==='VALIDADO','Nota de equipe sem validação docente.');}
  }});
  Object.keys(latest).forEach(function(key){notasAssert(teamIndex[key],'Auditoria sem equipe conciliada; entrega incerta.');});
  var currentRoster=notasRosterIndex_(book),seenResult=Object.create(null);
  res.rows.forEach(function(r,i){if(i>0&&r&&!notasBlank(r[0])){
    notasAssert(currentRoster[r[0]],'Resultado sem cadastro docente.');
    var k=r[0]+'|'+r[1];notasAssert(!Object.prototype.hasOwnProperty.call(seenResult,k),'Resultado duplicado.');seenResult[k]=i;
    notasGrade(r[2]);var w=notasAuditWinner(aud,r[3],r[0],r[1]);
    notasAssert(w[24]==='MOBILE_V4_TEACHER_REVIEW'&&w[12]==='VALIDADO'&&w[11]===r[2]&&w[0]===r[4]&&w[8]===r[8]&&r[6]==='VALIDADO', 'Resultado não corresponde à validação docente assinada.');
  }});
  var seenRoster=Object.create(null);
  roster.rows.forEach(function(r,i){if(i>0&&r&&!notasBlank(r[0])){
    notasAssert(typeof r[1]==='string'&&currentRoster[r[1]]&&!seenRoster[r[1]],'Cadastro bimestral ambíguo.');seenRoster[r[1]]=true;
    var meanFormula=(roster.formulas[i]||[])[act.mean]||'';
    notasAssert(meanFormula===notasAverageFormula(i+1,act.mean-3),'Fórmula de média incompatível.');
    var ri=seenResult[r[1]+'|'+n.activity];
    if(!notasBlank(r[act.col]))notasAssert(ri!==undefined&&res.rows[ri][2]===r[act.col],'Nota no boletim sem resultado docente assinado.');
  }});
  aud.rows.forEach(function(r,i){if(i>0&&r&&r[3]===n.activity&&r[24]==='MOBILE_V4_TEACHER_REVIEW'&&r[12]==='VALIDADO'){
    var ms=JSON.parse(r[25]);ms.forEach(function(m){
      var ri=seenResult[m.enrollment+'|'+r[3]],rr=notasRows(roster,1,m.enrollment);
      notasAssert(ri!==undefined&&res.rows[ri][2]>=r[11]&&rr.length===1&&roster.rows[rr[0]][act.col]===res.rows[ri][2],
        'Validação docente com projeção incompleta; reconciliação necessária.');
    });
    notasAssert(teamIndex[r[15]]&&!notasBlank(teamIndex[r[15]][4])&&teamIndex[r[15]][4]>=r[11],
      'Validação docente sem nota de equipe conciliada.');
  }});
  return seenResult;
}

function notasPlan(book,n,nonce,readOnly){
  notasCheckCatalog(book);var act=notasActivity(book,n,readOnly),aud=book.sheets.Auditoria,teams=book.sheets.Equipes;
  notasCheckIdentity(book,n,readOnly);notasRecordIntegrity(book,n,act);
  var sameNonce=notasRows(aud,22,webSha256(nonce));
  notasAssert(sameNonce.length<=1,'Nonce duplicado na auditoria.');
  if(sameNonce.length){var old=notasVerifyAudit(aud,sameNonce[0]);
    if(old[23]!==n.requestHash)notasErr('DUPLICIDADE_TECNICA',null,'nonce','Este identificador foi usado para outro conteúdo.','Confira o recibo anterior.');
    return {requests:[],entry:old,replay:true,act:act,teacherHold:true};
  }
  var teamKey=notasTeamKey(n),teamRows=notasRows(teams,8,teamKey);
  notasAssert(teamRows.length<=1,'Equipe duplicada.');
  var oldTeam=teamRows.length?teams.rows[teamRows[0]]:null,composition=n.identity.members.map(function(m){return m.enrollment;}).sort().join('|');
  if(oldTeam){
    var prior;try{prior=JSON.parse(oldTeam[14]);}catch(e){webFail('Composição anterior inválida.');}
    notasAssert(prior.map(function(m){return m.enrollment;}).sort().join('|')===composition&&oldTeam[0]===n.identity.team&&oldTeam[14]===JSON.stringify(n.identity.members),'Composição, ordem ou identidade da equipe alterada; solicite conferência docente.');
    var last=notasRows(aud,7,oldTeam[12]);notasAssert(last.length===1,'Último recibo da equipe ausente.');
    var existing=notasVerifyAudit(aud,last[0]);notasAssert(existing[15]===teamKey&&existing[25]===oldTeam[14],'Equipe sem recibo íntegro.');
  }
  teams.rows.forEach(function(r,i){if(i>0&&r&&r[3]===n.activity&&r[8]!==teamKey){
    var ms;try{ms=JSON.parse(r[14]);}catch(e){webFail('Composição cadastrada inválida.');}
    notasAssert(!ms.some(function(m){return n.identity.members.some(function(x){return m.enrollment===x.enrollment;});}),'Integrante já vinculado a outra equipe nesta atividade.');
  }});
  var row=notasAuditEntry(n,nonce),auditRow=notasNewRow(aud,[0,7,15]),teamRow=teamRows.length?teamRows[0]:notasNewRow(teams,[0,8]);
  var req=[notasWrite(aud,auditRow,0,row)];
  if(!oldTeam)req.push(notasWrite(teams,teamRow,0,[n.identity.team,n.identity.members.map(function(m){return m.name;}).join('; '),
    n.identity.members.length,n.activity,'',NOTAS_STATUS,'','',teamKey,'','','',row[7],row[6],JSON.stringify(n.identity.members),n.contract]));
  else req.push(notasWrite(teams,teamRow,12,[row[7],row[6]]));
  return {requests:req,entry:row,replay:false,act:act,teacherHold:true,auditRow:auditRow};
}

function notasVerifyWrites(book,plan){
  var byId=Object.create(null);Object.keys(book.sheets).forEach(function(k){byId[book.sheets[k].id]=book.sheets[k];});
  plan.requests.forEach(function(req){var u=req.updateCells;if(!u)return;var s=byId[u.start.sheetId],r=u.start.rowIndex,c=u.start.columnIndex;
    u.rows[0].values.forEach(function(cell,i){var v=cell.userEnteredValue,old=(s.rows[r]||[])[c+i];
      if(!v){notasAssert(notasBlank(old),'Escrita incompleta.');return;}
      if(v.formulaValue){notasAssert((s.formulas[r]||[])[c+i]===v.formulaValue,'Média não persistida.');return;}
      var expected=Object.prototype.hasOwnProperty.call(v,'numberValue')?v.numberValue:
        Object.prototype.hasOwnProperty.call(v,'boolValue')?v.boolValue:v.stringValue;
      notasAssert(old===expected,'Escrita incompleta.');
    });
  });
}
function notasReceipt(n,entry,nonce,book,plan){
  var grades=n.identity.members.map(function(m){var rs=notasRows(book.sheets.Resultados,0,m.enrollment).filter(function(i){return book.sheets.Resultados.rows[i][1]===n.activity;});
    notasAssert(rs.length<=1,'Resultado duplicado.');return rs.length?book.sheets.Resultados.rows[rs[0]][2]:null;});
  return {ok:true,channel:MOBILE_CFG.channel,nonce:nonce,requestId:nonce,
    receiptId:entry[7],activity:n.activity,instrument:n.instrument,receivedAt:entry[6],
    teamId:n.identity.teamId,memberCount:n.identity.members.length,answersSha256:entry[8],
    codeSha256:entry[16],storedEvidenceSha256:entry[21],signature:entry[9],signatureVerified:true,grade:null,officialGrade:null,
    gradeReceived:null,claimedXp:n.claimedXp,bestGrades:grades,members:JSON.parse(entry[25]),version:MOBILE_CFG.version,
    status:NOTAS_STATUS,teacherReviewRequired:true,evidenceProvenance:'LOCAL_BROWSER_UNTRUSTED',technicalVerification:'NOT_VERIFIED',
    replay:Boolean(plan.replay),warning:'Evidências recebidas. XP e testes declarados não são nota oficial; aguardam validação docente.'};
}

function notasStore(payload,nonce,config){
  notasAssert(payload&&payload.environment===config.mode,'Ambiente do cliente incompatível.');
  var n=notasNormalize(payload);notasIdentityAllowed(n.identity,config);notasSecret();notasRateLimit_(n.identity);
  var head=notasReadBook(config,['Atividades']),a=notasCatalog(head.sheets.Atividades)[n.activity];
  if(payload.operation!=='reconcileTeam')notasCheckOpenV3(a,n.activity,n.contract);
  else notasAssert(a&&a.contract===n.contract,'Contrato incompatível.');
  var titles=['Atividades','Auditoria','Equipes','Alunos','Resultados',a.title],before=notasReadBook(config,titles);
  var same=notasRows(before.sheets.Auditoria,22,webSha256(nonce));
  notasAssert(same.length<=1,'Nonce duplicado na auditoria.');
  if(same.length){
    var old=notasVerifyAudit(before.sheets.Auditoria,same[0]);
    if(old[23]!==n.requestHash)notasErr('DUPLICIDADE_TECNICA',null,null,'Este identificador já pertence a outro conteúdo.','Confira o recibo anterior.');
    n.identity.members=JSON.parse(old[25]);
    // Replay recupera o recibo mesmo com confirmação expirada, sem autorizar
    // mutação: percorre as mesmas validações de cadastro, vínculo NOMINAL,
    // resultados, boletim e Auditoria assinada de uma submissão comum.
    // notasPlan retorna requests=[] no replay; jamais persistir nesse ramo.
    var replayPlan=notasPlan(before,n,nonce,payload.operation==='reconcileTeam');
    notasAssert(replayPlan.replay===true&&replayPlan.requests.length===0,
      'Replay sem integridade verificável.');
    return notasReceipt(n,replayPlan.entry,nonce,before,replayPlan);
  }
  if(payload.operation==='reconcileTeam')notasErr('ENVIO_NAO_LOCALIZADO',null,null,'Nenhuma entrega íntegra localizada para esta requisição.','Não reenviar automaticamente. Confira com o docente.');
  notasHydrate_(before,n);
  var plan=notasPlan(before,n,nonce),after,rosterBefore=JSON.stringify(before.sheets.Alunos);
  if(plan.requests.length){
    // Reject bad destinations BEFORE the network-uncertainty catch.
    try{notasCommit_(before,plan.requests,config,'submission');}
    catch(e){try{after=notasReadBook(config,titles);notasVerifyWrites(after,plan);}
      catch(unconfirmed){webFail('Envio sem confirmação. Use a mesma requisição para conciliação antes de reenviar.');}}
  }
  after=after||notasReadBook(config,titles);notasVerifyWrites(after,plan);
  notasAssert(JSON.stringify(after.sheets.Alunos)===rosterBefore,'Cadastro mudou durante a entrega. Consulte o professor antes de reenviar.');
  notasCheckCatalog(after);notasCheckIdentity(after,n);notasRecordIntegrity(after,n,plan.act);
  return notasReceipt(n,plan.entry,nonce,after,plan);
}

function webReturn(result){var origin=MOBILE_CFG.origin;try{origin=notasConfig().origin;}catch(e){}var safe=JSON.stringify(result).replace(/</g,'\\u003c').replace(/>/g,'\\u003e')
    .replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  return HtmlService.createHtmlOutput('<!doctype html><html><meta charset="utf-8"><body><script>top.postMessage('
    +safe+',"'+origin+'");</scr'+'ipt></body></html>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function doGet(e){
  var c=notasConfig();
  if(e&&e.parameter&&e.parameter.action==='health'){
    var nonce=String(e.parameter.nonce||'');
    if(!/^[A-Za-z0-9-]{12,90}$/.test(nonce))return ContentService.createTextOutput('Requisição inválida.').setMimeType(ContentService.MimeType.TEXT);
    var active=false;
    try{if(c.enabled){var b=notasReadBook(c,['Atividades']),a=notasCatalog(b.sheets.Atividades)[MOBILE_CFG.activity];
      active=!!(a&&a.contract==='mobile-a08-lab-v4'&&a.enabled&&!PropertiesService.getScriptProperties().getProperty(notasClosedKeyV3(MOBILE_CFG.activity)));}}
    catch(error){active=false;}
    return webReturn({ok:true,channel:'mobile-status-aula08',nonce:nonce,version:MOBILE_CFG.version,
      mode:c.mode,enabled:active,activity:MOBILE_CFG.activity,spreadsheetId:c.mode==='QA'?c.id:null,dataPolicy:c.mode==='QA'?'SYNTHETIC_ONLY':null});
  }
  return ContentService.createTextOutput('Mobile '+MOBILE_CFG.version+' — '+c.mode+' — recebimento '+
    (c.enabled?'habilitado':'bloqueado')+' — matrícula pré-cadastrada; evidência pendente; nota somente após validação docente')
    .setMimeType(ContentService.MimeType.TEXT);
}
function doPost(e){var nonce='',channel=MOBILE_CFG.channel,held=false,lock=null;
  try{
    notasAssert(e&&e.parameter,'Requisição ausente.');nonce=webText(e.parameter.nonce,90,'nonce');
    notasAssert(/^[A-Za-z0-9-]{12,90}$/.test(nonce),'Nonce inválido.');
    var raw=e.parameter.payload;notasAssert(typeof raw==='string'&&raw.length<=MOBILE_CFG.maxPayloadChars,'Payload inválido.');
    var payload;try{payload=JSON.parse(raw);}catch(error){webFail('JSON inválido.');}
    notasAssert(payload&&typeof payload==='object'&&!Array.isArray(payload),'Requisição inválida.');
    if(payload.operation==='lookupStudent')channel='mobile-roster-lookup-aula08';
    else if(!['submitTeam','reconcileTeam'].includes(payload.operation))notasErr('OPERACAO_NAO_PERMITIDA',null,null,'Operação não permitida.','Atualize a página. O cadastro é somente leitura.');

    var cfg=notasConfig();notasAssert(cfg.enabled||payload.operation==='reconcileTeam','Recebimento de atividades bloqueado pelo professor.');
    lock=LockService.getScriptLock();lock.waitLock(20000);held=true;
    cfg=notasConfig();notasAssert(cfg.enabled||payload.operation==='reconcileTeam','Recebimento de atividades bloqueado pelo professor.');
    return webReturn(payload.operation==='lookupStudent'?notasLookup_(payload,nonce,cfg):notasStore(payload,nonce,cfg));
  }catch(err){return webReturn({ok:false,channel:channel,nonce:nonce,
    code:err.publicCode||'ENVIO_SEM_CONFIRMACAO',memberIndex:Number.isInteger(err.memberIndex)?err.memberIndex:null,
    field:err.field||null,message:err.webPublic?String(err.message).slice(0,220):'Falha interna. Consulte o docente.',
    action:err.action||'Confira a situação com o professor antes de reenviar.',retryable:false});
  }finally{if(held)lock.releaseLock();}
}

function prepararIntegracaoNotasV3(){var cfg=notasConfig(),book=notasReadBook(cfg,['Atividades','Auditoria','Equipes','Alunos','Resultados']);
  notasCheckCatalog(book);notasRosterIndex_(book);var p=PropertiesService.getScriptProperties();
  if(p.getProperty(cfg.prefix+'SUBMISSIONS_ENABLED')===null)p.setProperty(cfg.prefix+'SUBMISSIONS_ENABLED','false');
  if(!p.getProperty(cfg.prefix+'HMAC_SECRET')){
    notasAssert(!book.sheets.Auditoria.rows.some(function(r,i){return i>0&&r&&!notasBlank(r[7]);}),'Chave ausente com histórico; restaure a chave original.');
    p.setProperty(cfg.prefix+'HMAC_SECRET',Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,''));
  }
  notasSecret();return {version:MOBILE_CFG.version,mode:cfg.mode,enabled:notasConfig().enabled,homologated:false};
}

function statusIntegracaoNotasV3(){var c=notasConfig(),b=notasReadBook(c,['Atividades','Auditoria','Equipes','Alunos','Resultados']);
  notasCheckCatalog(b);return {version:MOBILE_CFG.version,mode:c.mode,enabled:c.enabled,
    activities:Object.keys(notasCatalog(b.sheets.Atividades)),homologated:false};}
/** Chamada somente no editor pelo professor autenticado. NÃO publicar via doGet/doPost. */
function consultarConflitoDocenteV3(nome,matricula){var c=notasConfig(),b=notasReadBook(c,['Alunos']);
  notasHeaders(b.sheets.Alunos,A_HEADERS);var norm=webNormalized(nome),rows=[];
  b.sheets.Alunos.rows.forEach(function(r,i){if(i>0&&r&&r[0]&&(r[0]===matricula||r[2]===norm))rows.push({
    linha:i+1,nomeCadastrado:r[1],matriculaCadastrada:r[0],estado:r[3],fonte:r[4],homonimoLiberado:r[6]===true||r[6]==='SIM'});
  });return {entrada:{nome:nome,matricula:matricula},comparacaoPrivada:rows,publicar:false};
}

/** Cadastro administrativo de atividade (não acessível por doPost). */
function cadastrarAtividadeNotasV3(spec){
  var c=notasConfig();notasAssert(spec&&typeof spec==='object'&&Number.isInteger(spec.bim)&&spec.bim>=1&&spec.bim<=4,'Bimestre inválido.');
  var lock=LockService.getScriptLock(),held=false;
  try{lock.waitLock(20000);held=true;
    var title=spec.bim+'º Bimestre',book=notasReadBook(c,['Atividades','Alunos',title]);
    var cat=notasCatalog(book.sheets.Atividades),name=webText(spec.name,100,'nome da atividade'),
      header=webText(spec.header,100,'coluna'),contract=spec.contract;
    notasAssert(typeof spec.id==='string'&&/^[A-Z0-9][A-Z0-9_-]{2,79}$/.test(spec.id)&&
      typeof header==='string'&&header.endsWith(' /10')&&header!=='Média /10','ID/cabeçalho inválido.');
    notasAssert(contract==='mobile-notas-submission-v4','Contrato genérico V3 obrigatório.');
    var cfg={id:spec.id,bim:spec.bim,title:title,header:header,contract:contract,enabled:spec.enabled===true};
    if(cat[spec.id]){var old=cat[spec.id];notasAssert(['id','bim','title','header','contract','enabled'].every(function(k){return old[k]===cfg[k];}),
      'Atividade já registrada com parâmetros diferentes.');return {status:'JA_CADASTRADA',id:spec.id};}
    var s=book.sheets[title];notasHeaders(s,['Aluno','Matrícula','Equipe']);
    var h=s.rows[0],mean=h.indexOf('Média /10');
    notasAssert(mean>=3&&h.lastIndexOf('Média /10')===mean&&!h.includes(header),'Posição da coluna inválida.');
    s.rows.forEach(function(row,i){if(i>0&&row&&!notasBlank(row[0]))
      notasAssert((s.formulas[i]||[])[mean]===notasAverageFormula(i+1,mean-3),'Fórmula manual impede alteração automática.');});
    var at=book.sheets.Atividades,ar=notasNewRow(at,[0,1,2,3,4,5]);
    var requests=[
      {insertDimension:{range:{sheetId:s.id,dimension:'COLUMNS',startIndex:mean,endIndex:mean+1},inheritFromBefore:true}},
      notasWrite(s,0,mean,[header]),
      {setDataValidation:{range:{sheetId:s.id,startRowIndex:1,endRowIndex:s.rowCount,startColumnIndex:mean,endColumnIndex:mean+1},
        rule:{condition:{type:'NUMBER_BETWEEN',values:[{userEnteredValue:'0'},{userEnteredValue:'10'}]},strict:true}}},
      {repeatCell:{range:{sheetId:s.id,startRowIndex:1,endRowIndex:s.rowCount,startColumnIndex:mean+1,endColumnIndex:mean+2},
        cell:notasCell('',notasAverageFormula(2,mean-2)),fields:'userEnteredValue'}},
      notasWrite(at,ar,0,[spec.id,name,spec.bim,header,contract,spec.enabled===true])
    ];
    notasCommit_(book,requests,c,'catalog');
    var after=notasReadBook(c,['Atividades','Alunos',title]),k=notasCatalog(after.sheets.Atividades)[spec.id],ss=after.sheets[title];
    notasAssert(k&&ss.rows[0][mean]===header&&ss.rows[0][mean+1]==='Média /10','Cadastro não confirmado; não repita sem verificar.');
    return {status:'CADASTRADA',id:spec.id,bimestre:spec.bim};
  }finally{if(held)lock.releaseLock();}
}


/** Compatibilidade dos recibos 3.0.0 já existentes, sem reescrever assinaturas. */
function notasLegacyHoldV3(book,n){
  return n.identity.members.some(function(m){
    return book.sheets.Resultados.rows.some(function(r,i){return i>0&&r&&r[0]===m.enrollment&&r[1]===n.activity&&r[6]!==NOTAS_STATUS;}) ||
      book.sheets.Auditoria.rows.some(function(r,i){return i>0&&r&&r[3]===n.activity&&
        (!notasBlank(r[11])||r[12]!==NOTAS_STATUS)&&JSON.parse(r[25]).some(function(x){return x.enrollment===m.enrollment;});});
  });
}
function notasClosedKeyV3(id){
  notasAssert(typeof id==='string'&&/^[A-Z0-9][A-Z0-9_-]{2,79}$/.test(id),'ID de atividade inválido.');
  return notasConfig().prefix+'CLOSED_'+id;
}
function notasCheckOpenV3(activity,id,contract){
  var closed=PropertiesService.getScriptProperties().getProperty(notasClosedKeyV3(id));
  if(closed || (activity && !activity.enabled))
    notasErr('ATIVIDADE_ENCERRADA',null,null,'A atividade '+id+' está fechada para envios.',
      'O professor encerrou o recebimento. Nenhuma nova entrega foi registrada.');
  notasAssert(activity&&activity.contract===contract,'Atividade não cadastrada ou contrato incompatível.');
}
/** Administração somente no editor. Aguarda o último escritor antes de liberar correção. */
function bloquearRecebimentoNotasV3(){
  notasConfig();var p=PropertiesService.getScriptProperties(),lock=LockService.getScriptLock(),held=false;
  p.setProperty(notasConfig().prefix+'SUBMISSIONS_ENABLED','false');
  try{lock.waitLock(20000);held=true;
    p.setProperty(notasConfig().prefix+'SUBMISSIONS_ENABLED','false');
    var result={status:'BLOQUEADO_SEM_ENVIOS_EM_ANDAMENTO',enabled:false,version:MOBILE_CFG.version};
    console.log('MOBILE_V4_BLOQUEIO '+JSON.stringify(result));return result;
  }finally{if(held)lock.releaseLock();}
}
/** Fechamento individual permanente; reativar flag global não reabre a atividade. */
function encerrarAtividadeNotasV3(id,motivo){
  var cfg=notasConfig(),key=notasClosedKeyV3(id),reason=webText(motivo,200,'motivo do encerramento');
  notasAssert(reason.length>=3,'Informe o motivo do encerramento.');
  var p=PropertiesService.getScriptProperties(),lock=LockService.getScriptLock(),held=false;
  try{lock.waitLock(20000);held=true;
    var book=notasReadBook(cfg,['Atividades','Alunos']),sheet=book.sheets.Atividades,cat=notasCatalog(sheet);
    notasAssert(cat[id],'Atividade não cadastrada.');
    var rows=notasRows(sheet,0,id);notasAssert(rows.length===1,'Atividade ambígua.');
    notasAssert(sheet.columnCount>=8,'Atividades precisa de colunas G e H livres para encerramento.');
    var existing=p.getProperty(key),stamp=existing?JSON.parse(existing):{at:new Date().toISOString(),reason:reason};
    // Registra bloqueio ANTES da chamada remota: falha de rede não reabre a atividade.
    p.setProperty(key,JSON.stringify(stamp));
    var requests=[notasWrite(sheet,0,6,['Encerrada UTC','Motivo do encerramento']),
      notasWrite(sheet,rows[0],5,[false,stamp.at,stamp.reason])];
    try{notasCommit_(book,requests,cfg,'catalog');}
    catch(e){p.setProperty(notasConfig().prefix+'SUBMISSIONS_ENABLED','false');
      webFail('Bloqueio mantido; gravação de encerramento não confirmada. Execute o fechamento novamente antes de corrigir.');}
    var after=notasReadBook(cfg,['Atividades']);notasVerifyWrites(after,{requests:requests});
    var result={status:'ATIVIDADE_ENCERRADA_CONFIRMADA',activity:id,closedAt:stamp.at,enabled:false,version:MOBILE_CFG.version};
    console.log('MOBILE_V4_ENCERRAMENTO '+JSON.stringify(result));return result;
  }finally{if(held)lock.releaseLock();}
}
function encerrarAula08ParaCorrecaoV3(){
  bloquearRecebimentoNotasV3();
  return encerrarAtividadeNotasV3(MOBILE_CFG.activity,'Encerramento para correção docente');
}
function liberarRecebimentoQAMobileV4(){
  var cfg=notasConfig();notasAssert(cfg.mode==='QA','Esta função nunca ativa PROD.');
  var p=PropertiesService.getScriptProperties();notasAssert(p.getProperty(cfg.prefix+'TEACHER_APPROVAL')==='A08-V4-QA-SYNTHETIC','Aprovação QA ausente.');
  var lock=LockService.getScriptLock(),held=false;
  try{lock.waitLock(20000);held=true;prepararIntegracaoNotasV3();
    var b=notasReadBook(cfg,['Atividades']),a=notasCatalog(b.sheets.Atividades)[MOBILE_CFG.activity];
    notasCheckOpenV3(a,MOBILE_CFG.activity,'mobile-a08-lab-v4');
    p.setProperty(cfg.prefix+'SECURITY_READY','true');p.setProperty(cfg.prefix+'SUBMISSIONS_ENABLED','true');
    return {status:'QA_LIBERADO',mode:'QA',enabled:notasConfig().enabled,production:false,homologated:false};
  }finally{if(held)lock.releaseLock();}
}

function verificarStatusMobileV4(){
  var r=statusIntegracaoNotasV3(),c=notasConfig(),b=notasReadBook(c,['Atividades']),cat=notasCatalog(b.sheets.Atividades);
  var p=PropertiesService.getScriptProperties();r.spreadsheetId=c.id;
  r.activityStatus=Object.keys(cat).map(function(id){return {id:id,bimestre:cat[id].bim,
    enabled:cat[id].enabled&&!p.getProperty(notasClosedKeyV3(id)),closed:!!p.getProperty(notasClosedKeyV3(id))};});
  console.log('MOBILE_V4_STATUS '+JSON.stringify(r));return r;
}

/** Editor autenticado; rubrica de 20 critérios booleanos, nunca XP do navegador. */
function validarEntregaDocenteMobile(spec){
  notasExactKeys_(spec,['receiptId','decision','criteria','evidenceRef','reason']);
  var cfg=notasConfig(),props=PropertiesService.getScriptProperties();
  notasAssert(props.getProperty(cfg.prefix+'TEACHER_RUBRIC_APPROVAL')==='A08-V4-RUBRIC-20X05','Rubrica docente não aprovada.');
  if(cfg.mode==='PROD')notasAssert(props.getProperty(cfg.prefix+'OFFICIAL_GRADES_APPROVED')==='A08-V4-OFFICIAL-GRADES-APPROVED','Lançamento oficial não autorizado.');
  notasAssert(['VALIDADO','REJEITADO'].includes(spec.decision),'Decisão docente inválida.');
  var evidenceRef=webText(spec.evidenceRef,500,'referência de conferência'),reason=webText(spec.reason||'',1000,'parecer');
  notasAssert(evidenceRef.length>=8&&reason.length>=8,'Referência e parecer de conferência obrigatórios.');
  var criteria=spec.criteria,grade=null;
  notasAssert(Array.isArray(criteria)&&criteria.length===20,'Rubrica exige os vinte critérios.');
  criteria.forEach(function(c,i){notasExactKeys_(c,['id','passed']);notasAssert(c.id===MOBILE_TASKS[i][0]&&typeof c.passed==='boolean','Critério docente inválido.');});
  if(spec.decision==='VALIDADO')grade=criteria.filter(function(c){return c.passed;}).length*0.5;
  var lock=LockService.getScriptLock(),held=false;
  try{lock.waitLock(20000);held=true;
    var head=notasReadBook(cfg,['Atividades']),act=notasCatalog(head.sheets.Atividades)[MOBILE_CFG.activity];notasAssert(act,'Atividade ausente.');
    var titles=['Atividades','Auditoria','Equipes','Alunos','Resultados',act.title],book=notasReadBook(cfg,titles);
    notasCheckCatalog(book);var matches=notasRows(book.sheets.Auditoria,7,spec.receiptId);notasAssert(matches.length===1,'Recibo não localizado.');
    var original=notasVerifyAudit(book.sheets.Auditoria,matches[0]);notasAssert(original[24]==='MOBILE_V4_SUBMISSION','Selecione o recibo de recepção original.');
    var n={activity:original[3],contract:original[26],identity:{team:original[0],teamId:original[1],members:JSON.parse(original[25])}};
    // A atividade pode estar fechada para recebimento durante a correção.
    var roster=book.sheets[act.title],col=roster.rows[0].indexOf(act.header),mean=roster.rows[0].indexOf('Média /10');
    notasAssert(col>=3&&mean>col,'Cabeçalhos bimestrais inválidos.');var a=Object.assign({},act,{col:col,mean:mean});
    var idx=notasRecordIntegrity(book,n,a),now=new Date().toISOString(),reviewKey=webSha256(JSON.stringify([spec.receiptId,spec.decision,criteria,evidenceRef,reason]));
    var prior=book.sheets.Auditoria.rows.filter(function(r,i){return i>0&&r&&r[24]==='MOBILE_V4_TEACHER_REVIEW'&&JSON.parse(r[14]).teacherReview.sourceReceipt===spec.receiptId;});
    if(prior.length){notasAssert(prior.length===1&&prior[0][23]===reviewKey,'Recibo já revisado com outra decisão; preservar histórico e conferir manualmente.');
      return {status:prior[0][12],receiptId:prior[0][7],officialGrade:prior[0][11],replay:true};}
    var ev=JSON.parse(original[14]);ev.teacherReview={sourceReceipt:spec.receiptId,sourceCodeSha256:original[16],decision:spec.decision,
      criteria:criteria,rubric:'mobile-a08-v4-20x0.5',evidenceRef:evidenceRef,reason:reason,reviewedAt:now,provenance:'AUTHENTICATED_TEACHER_EDITOR'};
    var row=original.slice();row[7]='MOB-REVIEW-'+reviewKey;row[5]=Utilities.formatDate(new Date(now),'America/Fortaleza','yyyy-MM-dd HH:mm:ss');row[6]=now;row[9]='';row[11]=grade===null?'':grade;row[12]=spec.decision;
    row[14]=JSON.stringify(ev);row[17]='teacher-editor-'+cfg.mode.toLowerCase();row[18]=reason;row[19]=now;row[21]=webSha256(row[14]);
    row[22]=webSha256('review|'+reviewKey);row[23]=reviewKey;row[24]='MOBILE_V4_TEACHER_REVIEW';row[27]=false;row[9]=notasAuditSign(row);
    var req=[notasWrite(book.sheets.Auditoria,notasNewRow(book.sheets.Auditoria,[0,7,15]),0,row)],res=book.sheets.Resultados,teams=book.sheets.Equipes;
    if(spec.decision==='VALIDADO'){
      var nextR=notasNewRow(roster,[0,1,2]),nextResult=notasNewRow(res,[0,1]);
      n.identity.members.forEach(function(m){var saved=notasStudent_(notasRosterIndex_(book),m.enrollment,0);notasAssert(saved.row[1]===m.name,'Cadastro alterado; conferir docente.');
        var oldI=idx[m.enrollment+'|'+n.activity],old=oldI===undefined?null:res.rows[oldI];if(old&&old[2]>=grade)return;
        var rr=notasRows(roster,1,m.enrollment);notasAssert(rr.length<=1,'Boletim duplicado.');var ri=rr.length?rr[0]:nextR++;
        if(!rr.length){req.push(notasWrite(roster,ri,0,[m.name,m.enrollment,n.identity.team]));req.push(notasWriteFormula(roster,ri,mean,notasAverageFormula(ri+1,mean-3)));}
        else req.push(notasWrite(roster,ri,2,[n.identity.team]));
        req.push(notasWrite(roster,ri,col,[grade]));req.push(notasWrite(res,oldI===undefined?nextResult++:oldI,0,[m.enrollment,n.activity,grade,row[7],n.identity.team,now,'VALIDADO',m.name,row[8],row[7]]));
      });
      var tr=notasRows(teams,8,original[15]);notasAssert(tr.length===1,'Equipe sem vínculo.');var team=teams.rows[tr[0]];
      if(notasBlank(team[4])||grade>team[4]){req.push(notasWrite(teams,tr[0],4,[grade,'VALIDADO',row[7],now]));req.push(notasWrite(teams,tr[0],9,[row[8],reason,now]));}
    }
    var plan={requests:req},after;
    try{notasCommit_(book,req,cfg,'teacher');}catch(e){after=notasReadBook(cfg,titles);notasVerifyWrites(after,plan);}
    after=after||notasReadBook(cfg,titles);notasVerifyWrites(after,plan);notasRecordIntegrity(after,n,a);
    return {status:spec.decision,receiptId:row[7],sourceReceipt:spec.receiptId,officialGrade:grade,replay:false};
  }finally{if(held)lock.releaseLock();}
}

return Object.freeze({validarEntregaDocenteMobile:validarEntregaDocenteMobile,notasCommit_:notasCommit_,notasRosterIndex_:notasRosterIndex_,notasLookup_:notasLookup_,notasConfirmation_:notasConfirmation_,notasConfirmationStable_:notasConfirmationStable_,MOBILE_CFG:MOBILE_CFG,MOBILE_TASKS:MOBILE_TASKS,NOTAS_STATUS:NOTAS_STATUS,A_HEADERS:A_HEADERS,R_HEADERS:R_HEADERS,T_HEADERS:T_HEADERS,AU_HEADERS:AU_HEADERS,ACT_HEADERS:ACT_HEADERS,webFail:webFail,webText:webText,webCode:webCode,webSafe:webSafe,webNormalized:webNormalized,webEvidence:webEvidence,webHex:webHex,webSha256:webSha256,notasAssert:notasAssert,notasBlank:notasBlank,notasGrade:notasGrade,notasMax:notasMax,notasMean:notasMean,notasErr:notasErr,notasFullName:notasFullName,notasEnrollment:notasEnrollment,webIdentity:webIdentity,notasAverageFormula:notasAverageFormula,notasConfig:notasConfig,notasSecret:notasSecret,notasSign:notasSign,notasNoXpKeys:notasNoXpKeys,notasIdentityAllowed:notasIdentityAllowed,notasNormalize:notasNormalize,notasColName:notasColName,notasReadBook:notasReadBook,notasHeaders:notasHeaders,notasCatalog:notasCatalog,notasActivity:notasActivity,notasCell:notasCell,notasWrite:notasWrite,notasWriteFormula:notasWriteFormula,notasNewRow:notasNewRow,notasRows:notasRows,notasIndex:notasIndex,notasCheckCatalog:notasCheckCatalog,notasCheckIdentity:notasCheckIdentity,notasAuditSign:notasAuditSign,notasVerifyAudit:notasVerifyAudit,notasAuditEntry:notasAuditEntry,notasTeamKey:notasTeamKey,notasAuditWinner:notasAuditWinner,notasRecordIntegrity:notasRecordIntegrity,notasPlan:notasPlan,notasVerifyWrites:notasVerifyWrites,notasReceipt:notasReceipt,notasStore:notasStore,webReturn:webReturn,doGet:doGet,doPost:doPost,prepararIntegracaoNotasV3:prepararIntegracaoNotasV3,statusIntegracaoNotasV3:statusIntegracaoNotasV3,consultarConflitoDocenteV3:consultarConflitoDocenteV3,cadastrarAtividadeNotasV3:cadastrarAtividadeNotasV3,notasLegacyHoldV3:notasLegacyHoldV3,notasClosedKeyV3:notasClosedKeyV3,notasCheckOpenV3:notasCheckOpenV3,bloquearRecebimentoNotasV3:bloquearRecebimentoNotasV3,encerrarAtividadeNotasV3:encerrarAtividadeNotasV3,encerrarAula08ParaCorrecaoV3:encerrarAula08ParaCorrecaoV3,liberarRecebimentoQAMobileV4:liberarRecebimentoQAMobileV4,verificarStatusMobileV4:verificarStatusMobileV4});
})();

/** Nenhuma identidade efetiva isolada autoriza administração remota. */
function webAdminIdentityV3_(bootstrap){
  var active='',effective='';
  try{active=String(Session.getActiveUser().getEmail()||'').trim().toLowerCase();
      effective=String(Session.getEffectiveUser().getEmail()||'').trim().toLowerCase();}catch(e){}
  if(!active||!effective||active!==effective)throw new Error('ADMIN_NAO_AUTORIZADO');
  var p=PropertiesService.getScriptProperties(),saved=p.getProperty(MOBILE_V4_PRIVATE_.notasConfig().prefix+'ADMIN_EMAIL');
  if(saved?active!==saved:!bootstrap)throw new Error('ADMIN_NAO_AUTORIZADO');
  if(!saved)p.setProperty(MOBILE_V4_PRIVATE_.notasConfig().prefix+'ADMIN_EMAIL',active);
}
function webAdminExecV3_(name,args){webAdminIdentityV3_(false);return MOBILE_V4_PRIVATE_[name].apply(null,Array.prototype.slice.call(args));}
function doGet(e){return MOBILE_V4_PRIVATE_.doGet(e);}
function doPost(e){return MOBILE_V4_PRIVATE_.doPost(e);}
function bloquearRecebimentoProducaoMobile(){return webAdminExecV3_('bloquearRecebimentoNotasV3',arguments);}
function prepararAmbienteQAMobile(){if(MOBILE_V4_PRIVATE_.notasConfig().mode!=='QA')throw new Error('QA_EXIGE_AMBIENTE_ISOLADO');webAdminIdentityV3_(true);return webAdminExecV3_('prepararIntegracaoNotasV3',arguments);}
function liberarRecebimentoQAMobile(){return webAdminExecV3_('liberarRecebimentoQAMobileV4',arguments);}
function validarEntregaDocenteMobile(spec){return webAdminExecV3_('validarEntregaDocenteMobile',arguments);}
function verificarStatusProducaoMobile(){return webAdminExecV3_('verificarStatusMobileV4',arguments);}
function consultarConflitoDocenteV3(){return webAdminExecV3_('consultarConflitoDocenteV3',arguments);}
function cadastrarAtividadeNotasV3(){return webAdminExecV3_('cadastrarAtividadeNotasV3',arguments);}
function encerrarAtividadeNotasV3(){return webAdminExecV3_('encerrarAtividadeNotasV3',arguments);}
function encerrarAula08ParaCorrecaoV3(){return webAdminExecV3_('encerrarAula08ParaCorrecaoV3',arguments);}
function bloquearRecebimentoNotasV3(){return bloquearRecebimentoProducaoMobile();}
/** Executar uma vez no editor do proprietário; repetir é seguro e não apaga notas. */
function ativarProducaoMobile(){
  var api=MOBILE_V4_PRIVATE_,cfg=api.notasConfig(),p=PropertiesService.getScriptProperties();
  if(cfg.mode!=='PROD')throw new Error('AMBIENTE_PROD_OBRIGATORIO');
  if(p.getProperty(cfg.prefix+'TEACHER_APPROVAL')!=='A08-V4-APPROVED'||
    p.getProperty(cfg.prefix+'SECURITY_READY')!=='true'||
    p.getProperty(cfg.prefix+'TEACHER_RUBRIC_APPROVAL')!=='A08-V4-RUBRIC-20X05'||
    !p.getProperty(cfg.prefix+'QA_HOMOLOGATION_REF'))throw new Error('GATES_DE_PRODUCAO_PENDENTES');
  webAdminIdentityV3_(true);
  p.setProperty(cfg.prefix+'SUBMISSIONS_ENABLED','false');
  var lock=LockService.getScriptLock(),held=false;
  try{lock.waitLock(20000);held=true;api.prepararIntegracaoNotasV3();
    var b=api.notasReadBook(cfg,['Atividades','Alunos']),a=api.notasCatalog(b.sheets.Atividades)[api.MOBILE_CFG.activity];
    api.notasRosterIndex_(b);api.notasCheckOpenV3(a,api.MOBILE_CFG.activity,'mobile-a08-lab-v4');
    p.setProperty(cfg.prefix+'SUBMISSIONS_ENABLED','true');
    return {status:'MOBILE_PRODUCAO_ATIVADA',version:api.MOBILE_CFG.version,mode:'PROD',enabled:api.notasConfig().enabled,studentLogin:false};
  }finally{if(held)lock.releaseLock();}
}
