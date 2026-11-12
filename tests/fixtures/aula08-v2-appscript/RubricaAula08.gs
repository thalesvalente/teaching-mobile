/**
 * Aula 08: desafios oficiais, referência pura e nota única por equipe.
 * NUNCA executa fontes de estudantes. Usa comparação de dados JSON somente.
 * HMAC autentica recibos/desafios; hashes não provam autoria ou execução honesta.
 */
const MOBILE_A08 = Object.freeze({
  activity:'MOBILE-AULA08-2026', schema:'mobile-a08-v2',
  rubric:'mobile-a08-lab-vivo-2.0.0', contract:'2.0.0',
  ttlMs:10*60*1000, retentionMs:2*60*60*1000, maxBytes:128*1024,
  maxChallenges:200, maxRequestsPerPackage:5, maxVerify:8,
  challengePrefix:'MOBILE_A08_CHALLENGE_', ratePrefix:'MOBILE_A08_RATE_'
});
const MOBILE_A08_CRITERIA = Object.freeze([
  ['M1-1','Pacote e schema válidos'],['M1-2','Fontes e hashes coerentes'],
  ['M1-3','Preflight registrado'],['M1-4','Registro reflexivo do processo'],
  ['M1-5','Equipe e slots consistentes'],['M2-1','Prioridade de carregamento e erro'],
  ['M2-2','Busca normalizada e filtros combinados'],['M2-3','Coleção original preservada'],
  ['M2-4','Identidade estável'],['M3-1','Vazio e sem resultados'],
  ['M3-2','Tentar novamente'],['M3-3','Lista, detalhe e retorno'],
  ['M3-4','Formulário e mensagens'],['M3-5','Recorte preservado no retorno'],
  ['M3-6','Resumo textual acessível'],['M4-1','Caso principal das funções da equipe'],
  ['M4-2','Casos limite das funções da equipe'],['M4-3','Entradas inválidas das funções da equipe'],
  ['M4-4','Regressão das funções da equipe'],['M4-5','Contratos e limites das funções da equipe']
]);
function mobileA08Channel(action) {
  return ({challenge:'mobile-aula08-challenge',verify:'mobile-aula08-verification',
    verifyAndSubmit:'mobile-aula08-receipt',validateReceipt:'mobile-aula08-receipt-validation'})[action] ||
    'mobile-aula08-error';
}
function mobileA08Object(value, allowed, required, label) {
  if (!value || typeof value!=='object' || Array.isArray(value)) throw Error(label+' inválido.');
  for (const key of Object.keys(value)) if (!allowed.includes(key)) throw Error('Campo não previsto em '+label+'.');
  for (const key of required || []) if (!Object.prototype.hasOwnProperty.call(value,key))
    throw Error('Campo obrigatório ausente em '+label+'.');
  return value;
}
function mobileA08Canonical(value, depth) {
  depth=depth || 0;
  if (depth>16) throw Error('JSON excede o limite de profundidade.');
  if (value===null || typeof value==='boolean' || typeof value==='string') return JSON.stringify(value);
  if (typeof value==='number' && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) {
    if (value.length>150) throw Error('Lista acima do limite.');
    return '['+value.map(v=>mobileA08Canonical(v,depth+1)).join(',')+']';
  }
  if (value && typeof value==='object') {
    const keys=Object.keys(value).sort();
    if (keys.length>100 || keys.some(k=>['__proto__','constructor','prototype'].includes(k)))
      throw Error('Objeto JSON inválido.');
    return '{'+keys.map(k=>JSON.stringify(k)+':'+mobileA08Canonical(value[k],depth+1)).join(',')+'}';
  }
  throw Error('Valor JSON inválido.');
}
function mobileA08Hash(value) { return mobileSha256(mobileA08Canonical(value)); }
function mobileA08Equal(a,b) {
  if (typeof a!=='string' || typeof b!=='string' || a.length!==b.length) return false;
  let diff=0; for(let i=0;i<a.length;i++) diff|=a.charCodeAt(i)^b.charCodeAt(i);
  return diff===0;
}
function mobileA08Sha(value,label) {
  if (typeof value!=='string' || !/^[a-f0-9]{64}$/.test(value)) throw Error('SHA-256 inválido: '+label+'.');
  return value;
}
function mobileA08Evidence(value) {
  mobileA08Object(value,['preflight','aiLog','environment','aiUsage'],['preflight','aiLog','environment','aiUsage'],'evidência');
  const pre=mobileA08Object(value.preflight,['version','ok','nodeMajor','filesReady'],
    ['version','ok','nodeMajor','filesReady'],'preflight');
  if(pre.version!=='1.0.0' || typeof pre.ok!=='boolean' || typeof pre.filesReady!=='boolean' ||
    !Number.isInteger(pre.nodeMajor) || pre.nodeMajor<0 || pre.nodeMajor>99) throw Error('Preflight incompatível.');
  const env=mobileA08Object(value.environment,['runtime','nodeMajor','platform'],['runtime','nodeMajor','platform'],'ambiente');
  if(env.runtime!=='node' || !Number.isInteger(env.nodeMajor) || env.nodeMajor<0 || env.nodeMajor>99 ||
    !['linux','win32','darwin','other'].includes(env.platform)) throw Error('Ambiente inválido.');
  if(!Array.isArray(value.aiLog) || value.aiLog.length>20) throw Error('Registro de IA acima do limite.');
  const aiLog=value.aiLog.map(entry=>{
    mobileA08Object(entry,['mission','request','suggestion','humanChange','test'],
      ['mission','request','suggestion','humanChange','test'],'registro de IA');
    if(!['M1','M2','M3','M4'].includes(entry.mission)) throw Error('Marco do registro de IA inválido.');
    const out={mission:entry.mission};
    for(const key of ['request','suggestion','humanChange','test']) {
      if(!mobileRead(entry[key],400,key)) throw Error('Registro de IA incompleto.');
      out[key]=entry[key]; // O hash vincula os bytes declarados, incluindo espaços.
    }
    return out;
  });
  return {preflight:{version:pre.version,ok:pre.ok,nodeMajor:pre.nodeMajor,filesReady:pre.filesReady},
    aiLog,aiUsage:mobileA08AiUsage(value.aiUsage,aiLog),environment:{runtime:env.runtime,nodeMajor:env.nodeMajor,platform:env.platform}};
}
function mobileA08Binding(input) {
  if(input.activity!==MOBILE_A08.activity || input.schema!==MOBILE_A08.schema) throw Error('Atividade ou schema incompatível.');
  mobileA08Sha(input.packageSha256,'pacote');
  if(!Array.isArray(input.slots) || input.slots.length<1 || input.slots.length>4 ||
    input.slots.some((v,i)=>!Number.isInteger(v)||v<1||v>4||(i>0&&v<=input.slots[i-1]))) throw Error('Slots inválidos.');
  if(mobileA08Canonical(input.slots)!=='[1,2,3,4]') throw Error('As quatro tarefas 1,2,3,4 são obrigatórias nesta candidata; política sujeita a aceite docente.');
  const allowed=['src/equipe.mjs',...input.slots.map(n=>'src/individual/aluno'+n+'.mjs')];
  mobileA08Object(input.sourceHashes,allowed,allowed,'fontes');
  const sourceHashes={};
  for(const path of allowed) sourceHashes[path]=mobileA08Sha(input.sourceHashes[path],'fonte');
  const team=mobileRead(input.team,80,'equipe');
  if(!team) throw Error('Informe a equipe.');
  if(/^[=+@-]/.test(team))throw Error('Nome de equipe não pode começar com fórmula.');
  // Slots identificam tarefas técnicas e não participantes; a nota é coletiva.
  if(!Array.isArray(input.members) || input.members.length<1 || input.members.length>4)
    throw Error('Informe de um a quatro participantes da equipe.');
  const names=new Set();
  const members=input.members.map(m=>{
    mobileA08Object(m,['name'],['name'],'participante');
    const name=mobileRead(m.name,80,'nome');
    if(name.length<3 || !/^[\p{L}][\p{L}\p{M} .'\-]{2,79}$/u.test(name))
      throw Error('Nome de participante inválido.');
    const key=mobileNormal(name);
    if(names.has(key)) throw Error('Integrante duplicado.');
    names.add(key);
    return {name};
  });
  return {activity:MOBILE_A08.activity,schema:MOBILE_A08.schema,packageSha256:input.packageSha256,
    slots:input.slots.slice(),sourceHashes,team,members,evidence:mobileA08Evidence(input.evidence)};
}
function mobileA08State(record) {
  return {challengeId:record.challengeId,nonce:record.nonce,issuedAt:record.issuedAt,
    expiresAt:record.expiresAt,activity:MOBILE_A08.activity,schema:MOBILE_A08.schema,
    packageSha256:record.packageSha256,bindingSha256:record.bindingSha256,casesSha256:record.casesSha256};
}
function mobileA08ChallengeToken(record) {
  return mobileHmac('mobile-a08/challenge/v1:'+mobileA08Canonical(mobileA08State(record)),mobileReceiptSecret());
}
function mobileA08Cleanup(props,now) {
  const all=props.getProperties(); let count=0;
  for(const key of Object.keys(all)) {
    if(!key.startsWith(MOBILE_A08.challengePrefix) && !key.startsWith(MOBILE_A08.ratePrefix)) continue;
    let item; try { item=JSON.parse(all[key]); } catch { throw Error('Estado de desafios requer manutenção docente.'); }
    const limit=key.startsWith(MOBILE_A08.challengePrefix)?Date.parse(item.expiresAt)+MOBILE_A08.retentionMs:item.until;
    if(!Number.isFinite(limit)) throw Error('Estado de desafios inválido.');
    if(limit<now) props.deleteProperty(key); else if(key.startsWith(MOBILE_A08.challengePrefix)) count++;
  }
  if(count>=MOBILE_A08.maxChallenges) throw Error('Limite temporário de desafios; aguarde e tente novamente.');
}
function mobileA08Challenge(input) {
  const binding=mobileA08Binding(input), lock=LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const props=PropertiesService.getScriptProperties(),now=Date.now();
    mobileA08AssertRoster(binding,props); mobileA08Cleanup(props,now);
    mobileA08ConsumeRate(binding,props,now);
    const record={challengeId:Utilities.getUuid(),nonce:Utilities.getUuid()+Utilities.getUuid(),
      issuedAt:new Date(now).toISOString(),expiresAt:new Date(now+MOBILE_A08.ttlMs).toISOString(),
      packageSha256:binding.packageSha256,bindingSha256:mobileA08Hash(binding),slots:binding.slots,
      status:'issued',verifications:0};
    const cases=mobileA08Cases(record.nonce,binding.slots); record.casesSha256=mobileA08Hash(cases);
    const token=mobileA08ChallengeToken(record);
    props.setProperty(MOBILE_A08.challengePrefix+record.challengeId,JSON.stringify(record));
    return {ok:true,...mobileA08State(record),slots:binding.slots,sourceHashes:binding.sourceHashes,cases,token};
  } finally { lock.releaseLock(); }
}
function mobileA08Load(input,binding) {
  if(typeof input.challengeId!=='string' || !/^[a-f0-9-]{36}$/.test(input.challengeId)) throw Error('Desafio inválido.');
  mobileA08Sha(input.challengeToken,'token do desafio');
  const props=PropertiesService.getScriptProperties(),raw=props.getProperty(MOBILE_A08.challengePrefix+input.challengeId);
  if(!raw) throw Error('Desafio ausente ou expirado.');
  const record=JSON.parse(raw);
  if(record.status!=='issued') throw Error('Desafio já utilizado; solicite um novo para reenviar.');
  if(Date.parse(record.expiresAt)<=Date.now()) throw Error('Desafio expirado; solicite um novo.');
  if(record.bindingSha256!==mobileA08Hash(binding) || record.packageSha256!==binding.packageSha256)
    throw Error('Pacote, fontes, equipe ou evidências diferentes do desafio.');
  if(!mobileA08Equal(input.challengeToken,mobileA08ChallengeToken(record))) throw Error('Assinatura do desafio inválida.');
  const cases=mobileA08Cases(record.nonce,binding.slots);
  if(mobileA08Hash(cases)!==record.casesSha256) throw Error('Versão do desafio mudou; solicite um novo.');
  return {record,cases,props};
}
function mobileA08Outputs(input,cases) {
  if(!Array.isArray(input)||input.length!==cases.length) throw Error('Resultados incompletos ou duplicados.');
  const ids=new Set(cases.map(c=>c.id)),result={};
  for(const item of input) {
    mobileA08Object(item,item&&item.ok===true?['id','ok','value','unchanged']:['id','ok','error'],
      item&&item.ok===true?['id','ok','value']:['id','ok','error'],'resultado');
    if(typeof item.id!=='string'||!ids.has(item.id)||Object.prototype.hasOwnProperty.call(result,item.id))
      throw Error('Resultado duplicado ou desconhecido.');
    if(item.ok===true) {
      if(item.unchanged!==undefined&&typeof item.unchanged!=='boolean') throw Error('Observação de mutação inválida.');
      if(mobileA08Canonical(item.value).length>20000) throw Error('Resultado acima do limite.');
      result[item.id]={id:item.id,ok:true,value:item.value};
      if(item.unchanged!==undefined) result[item.id].unchanged=item.unchanged;
    } else {
      if(item.ok!==false||!['EXECUTION_ERROR','TIMEOUT'].includes(item.error)) throw Error('Erro de execução inválido.');
      result[item.id]={id:item.id,ok:false,error:item.error};
    }
  }
  return result;
}
function mobileA08Evaluation(binding,cases,outputs) {
  const checked=mobileA08Outputs(outputs,cases);
  const preparation={
    'M1-1':true,'M1-2':true,
    'M1-3':binding.evidence.preflight.ok&&binding.evidence.preflight.filesReady&&
      binding.evidence.preflight.nodeMajor>=22&&binding.evidence.preflight.nodeMajor===binding.evidence.environment.nodeMajor,
    'M1-4':mobileA08ProcessEvidence(binding.evidence),
    'M1-5':true
  };
  function passedCase(c) {
    const o=checked[c.id];
    return o.ok===true && (c.criterion!=='M2-3'||o.unchanged===true) &&
      mobileA08Canonical(o.value)===mobileA08Canonical(mobileA08Reference(c.input,c.scope==='team'?0:c.slot));
  }
  // Cada critério M4 é COLETIVO: deve passar nos arquivos técnicos incluídos.
  const criteria=MOBILE_A08_CRITERIA.map(([id,label])=>{
    const selected=cases.filter(c=>c.criterion===id);
    const approved=Object.prototype.hasOwnProperty.call(preparation,id)?
      !!preparation[id]:selected.length>0&&selected.every(passedCase);
    return {id,label,passed:approved,points:approved?.5:0,max:.5};
  });
  function sum(prefix){return criteria.filter(c=>c.id.startsWith(prefix)).reduce((a,c)=>a+c.points,0);}
  const m1=sum('M1-'),m2=sum('M2-'),m3=sum('M3-'),m4=sum('M4-');
  return {rubric:MOBILE_A08.rubric,team:binding.team,m1,m2,m3,m4,total:m1+m2+m3+m4,criteria};
}
function mobileA08CheckConflicts(grade,binding) {
  const rows=grade.getLastRow()>1?grade.getRange(2,1,grade.getLastRow()-1,2).getValues():[];
  for(const member of binding.members) {
    const matches=rows.filter(x=>mobileNormal(x[0])===mobileNormal(member.name));
    if(matches.length>1||(matches[0]&&matches[0][1]&&mobileNormal(matches[0][1])!==mobileNormal(binding.team)))
      throw Error('Conflito de estudante/equipe; confira com o professor.');
  }
}
function mobileA08ReceiptSign(unsigned) {
  return mobileHmac('mobile-a08/receipt/v1:'+mobileA08Canonical(unsigned),mobileReceiptSecret());
}
function mobileA08Verify(input,submit) {
  const binding=mobileA08Binding(input),lock=LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const state=mobileA08Load(input,binding),evaluation=mobileA08Evaluation(binding,state.cases,input.outputs);
    if(state.record.verifications>=MOBILE_A08.maxVerify) throw Error('Limite de verificações atingido; gere novo desafio.');
    if(!submit) {
      state.record.verifications++;
      state.props.setProperty(MOBILE_A08.challengePrefix+state.record.challengeId,JSON.stringify(state.record));
      return {ok:true,challengeId:state.record.challengeId,packageSha256:binding.packageSha256,
        bindingSha256:state.record.bindingSha256,evaluation};
    }
    mobileA08Sha(input.pdfSha256,'PDF');
    const activity=mobileActivity(MOBILE_A08.activity), ss=SpreadsheetApp.openById(MOBILE_CFG.spreadsheetId),
      grade=ss.getSheetByName(activity.sheet),audit=ss.getSheetByName('Auditoria');
    if(!grade||!audit) throw Error('Abas da disciplina não encontradas.');
    mobileHeaders(audit,MOBILE_AUDIT_HEADERS);mobileA08CheckConflicts(grade,binding);
    const roster=mobileA08AssertRoster(binding,state.props,audit);
    const checkedOutputs=mobileA08Outputs(input.outputs,state.cases);
    const answerJson=mobileA08Canonical({...binding,challengeId:state.record.challengeId,
      challengeNonce:state.record.nonce,casesSha256:state.record.casesSha256,
      outputs:state.cases.map(c=>checkedOutputs[c.id]),evaluation});
    if(answerJson.length>48000) throw Error('Respostas acima do limite da célula de auditoria.');
    const time=new Date(),unsigned={activity:MOBILE_A08.activity,schema:MOBILE_A08.schema,
      instrument:activity.instrument,rubric:MOBILE_A08.rubric,
      receiptId:Utilities.getUuid(),receivedAt:time.toISOString(),challengeId:state.record.challengeId,
      packageSha256:binding.packageSha256,pdfSha256:input.pdfSha256,answersSha256:mobileSha256(answerJson),
      sourceHashes:binding.sourceHashes,team:binding.team,members:binding.members,evaluation,
      gradeStatus:'laboratorio-equipe'};
    const receipt={...unsigned,signature:mobileA08ReceiptSign(unsigned)};
    // Reserva persistente ANTES de qualquer escrita no Sheets: falha não permite replay.
    mobileA08ReserveRoster(binding,state.props,roster,state.record.challengeId);
    state.record.status='processing';state.record.receiptId=receipt.receiptId;
    state.props.setProperty(MOBILE_A08.challengePrefix+state.record.challengeId,JSON.stringify(state.record));
    try {
      const columns=mobileColumn(grade,activity),local=Utilities.formatDate(time,'America/Fortaleza','dd/MM/yyyy HH:mm:ss');
      // Preserva linhas da planilha para cada participante, com nota única.
      for(const member of binding.members) {
        const key=MOBILE_A08.activity+'|'+mobileNormal(member.name);
        mobileAuditUpsert(audit,[mobileText(member.name),mobileText(binding.team),MOBILE_A08.activity,
          activity.instrument,local,receipt.receivedAt,receipt.receiptId,receipt.pdfSha256,receipt.answersSha256,
          receipt.signature,evaluation.total*10,evaluation.total,'',
          'Nota coletiva da equipe; evidências declaradas; não comprova autoria',
          activity.rubric+' / '+MOBILE_CFG.version,answerJson,key],key);
      }
      for(const member of binding.members)
        mobileGradeUpsert(grade,member.name,binding.team,columns.col,columns.media,evaluation.total);
      if(grade.getLastRow()>1){
        grade.getRange(2,1,grade.getLastRow()-1,columns.media).sort(1);mobileRefreshAverages(grade,columns.media);
      }
      if(audit.getLastRow()>1) audit.getRange(2,1,audit.getLastRow()-1,MOBILE_AUDIT_HEADERS.length)
        .sort([{column:1,ascending:true},{column:3,ascending:true}]);
      SpreadsheetApp.flush();
      mobileA08FinishRoster(binding,state.props,roster,state.record.challengeId,receipt.receiptId,'committed');
      state.record.status='consumed';state.record.completedAt=new Date().toISOString();
      state.props.setProperty(MOBILE_A08.challengePrefix+state.record.challengeId,JSON.stringify(state.record));
    } catch(writeError) {
      // Sheets não oferece transação multirange. Pode haver escrita parcial; nunca confirmar.
      state.record.status='write_failed';
      try {mobileA08FinishRoster(binding,state.props,roster,state.record.challengeId,receipt.receiptId,'write_failed');} catch(ignored) {}
      try {state.props.setProperty(MOBILE_A08.challengePrefix+state.record.challengeId,JSON.stringify(state.record));} catch(ignored) {}
      throw Error('Não foi possível concluir a gravação. Nenhuma entrega confirmada; procure o professor antes de reenviar.');
    }
    return {ok:true,receipt,evaluation};
  } finally {lock.releaseLock();}
}
function mobileA08ValidateReceipt(receipt) {
  const keys=['activity','schema','instrument','rubric','receiptId','receivedAt','challengeId','packageSha256',
    'pdfSha256','answersSha256','sourceHashes','team','members','evaluation','gradeStatus','signature'];
  mobileA08Object(receipt,keys,keys,'recibo');
  if(receipt.activity!==MOBILE_A08.activity||receipt.schema!==MOBILE_A08.schema||receipt.rubric!==MOBILE_A08.rubric||
    receipt.instrument!=='laboratorio-vivo-av1'||receipt.gradeStatus!=='laboratorio-equipe'||
     !receipt.evaluation||receipt.evaluation.rubric!==MOBILE_A08.rubric||receipt.evaluation.team!==receipt.team)
     throw Error('Recibo de outra atividade.');
  const unsigned={}; for(const key of keys) if(key!=='signature') unsigned[key]=receipt[key];
  mobileA08Sha(receipt.signature,'assinatura');
  const secret=PropertiesService.getScriptProperties().getProperty('MOBILE_RECEIPT_HMAC_SECRET');
  if(!secret||!mobileA08Equal(receipt.signature,
    mobileHmac('mobile-a08/receipt/v1:'+mobileA08Canonical(unsigned),secret))) throw Error('Assinatura do recibo inválida.');
  const raw=PropertiesService.getScriptProperties().getProperty(MOBILE_A08.challengePrefix+receipt.challengeId);
  const record=raw?JSON.parse(raw):null;
  // Enquanto o registro existir, recibos não concluídos permanecem inválidos.
  if(record&&(record.status!=='consumed'||record.receiptId!==receipt.receiptId)) throw Error('Recibo sem gravação concluída.');
  return {ok:true,valid:true,receiptSha256:mobileA08Hash(receipt),receiptId:receipt.receiptId,
    packageSha256:receipt.packageSha256,pdfSha256:receipt.pdfSha256,
    answersSha256:receipt.answersSha256,signature:receipt.signature};
}
function processMobileAula08Action(body) {
  if(typeof body!=='string'||!body||body.length>MOBILE_A08.maxBytes||unescape(encodeURIComponent(body)).length>MOBILE_A08.maxBytes)
    throw Error('Envio ausente ou muito grande.');
  let input;try{input=JSON.parse(body);}catch{throw Error('JSON inválido.');}
  const common=['action','activity','schema'],binding=['packageSha256','slots','sourceHashes','team','members','evidence'];
  mobileA08Object(input,[...common,...binding,'challengeId','challengeToken','outputs','pdfSha256','receipt','localResult'],common,'envelope');
  if(input.activity!==MOBILE_A08.activity||input.schema!==MOBILE_A08.schema) throw Error('Atividade ou schema incompatível.');
  const requestFields={
    challenge:[...common,...binding,'localResult'],
    verify:[...common,...binding,'challengeId','challengeToken','outputs','localResult'],
    verifyAndSubmit:[...common,...binding,'challengeId','challengeToken','outputs','pdfSha256','localResult'],
    validateReceipt:[...common,'receipt']
  };
  if(!Object.prototype.hasOwnProperty.call(requestFields,input.action)) throw Error('Ação não habilitada.');
  mobileA08Object(input,requestFields[input.action],requestFields[input.action].filter(k=>k!=='localResult'),'envelope');
  // localResult é aceito por compatibilidade e descartado sem leitura de nota, grade, xp ou passed.
  if(input.action!=='validateReceipt')mobileA08AssertPolicy();
  if(input.action==='challenge')return mobileA08Challenge(input);
  if(input.action==='validateReceipt')return mobileA08ValidateReceipt(input.receipt);
  return mobileA08Verify(input,input.action==='verifyAndSubmit');
}
/* Referência oficial. Não usa eval, Function ou import de conteúdo recebido. */
function mobileA08Id(value) {
  return (typeof value==='string'&&value.trim().length>0&&value.length<=80)||
    (typeof value==='number'&&Number.isFinite(value));
}
function mobileA08Normal(value) {
  return typeof value==='string'&&value.length<=200?value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase():'';
}
function mobileA08Reference(input,slot) {
  input=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
  const op=input.op;
  if(slot===1) return op==='normalizar'?mobileA08Normal(input.value):null;
  if(slot===4) return op==='chave'&&input.item&&mobileA08Id(input.item.id)?String(input.item.id):null;
  if(op==='estado'&&(!slot||slot===2)) {
    if(typeof input.loading!=='boolean'||!(typeof input.error==='string'||input.error===null)||
      !Array.isArray(input.items)||!Array.isArray(input.filtered)||input.items.length>100||input.filtered.length>100)return 'erro';
    return input.loading?'carregando':input.error?'erro':!input.items.length?'vazio':!input.filtered.length?'sem-resultados':'pronto';
  }
  if(op==='validar'&&(!slot||slot===3)) {
    const form=input.form&&typeof input.form==='object'?input.form:{},errors={},
      title=typeof form.title==='string'?form.title.trim():'',category=typeof form.category==='string'?form.category.trim():'';
    if(!title)errors.title='Informe o título.';else if(title.length>80)errors.title='Use até 80 caracteres.';
    if(!category)errors.category='Escolha a categoria.';else if(category.length>40)errors.category='Use até 40 caracteres.';
    return {valid:Object.keys(errors).length===0,errors};
  }
  if(slot) return null;
  if(op==='filtrar') {
    if(!Array.isArray(input.items)||input.items.length>100||typeof input.query!=='string'||input.query.length>200||
      typeof input.category!=='string'||typeof input.period!=='string'||input.items.some(x=>!x||typeof x!=='object'||
      typeof x.title!=='string'||typeof x.category!=='string'||typeof x.period!=='string'||!mobileA08Id(x.id))) return [];
    const query=mobileA08Normal(input.query);
    return input.items.filter(x=>mobileA08Normal(x.title).includes(query)&&
      (input.category==='Todas'||x.category===input.category)&&(input.period==='Todos'||x.period===input.period));
  }
  if(op==='chaves')return Array.isArray(input.items)&&input.items.length<=100&&input.items.every(x=>x&&mobileA08Id(x.id))?
    input.items.map(x=>String(x.id)):[];
  if(op==='tentar')return input.state&&typeof input.state==='object'&&!Array.isArray(input.state)&&typeof input.state.status==='string'?
    (input.state.status==='erro'?{status:'carregando',error:null}:input.state):null;
  if(op==='navegar') {
    const state=input.state;
    if(!state||typeof state!=='object'||Array.isArray(state)||Object.keys(state).sort().join(',')!=='category,period,query,screen,selectedId'||
      !['list','detail'].includes(state.screen)||!(state.selectedId===null||mobileA08Id(state.selectedId))||
      typeof state.query!=='string'||typeof state.category!=='string'||typeof state.period!=='string'||
      !['open','back'].includes(input.action)||(input.action==='open'&&!mobileA08Id(input.id)))return null;
    return {...state,screen:input.action==='open'?'detail':'list',selectedId:input.action==='open'?String(input.id):null};
  }
  if(op==='resumo') {
    const n=Array.isArray(input.items)&&input.items.length<=100?input.items.length:0;
    return {total:n,text:n+' registro(s) no recorte.'};
  }
  return null;
}
function mobileA08Cases(nonce,slots) {
  const seed=mobileSha256(nonce),n=parseInt(seed.slice(0,6),16),a='id-'+seed.slice(6,12),b='id-'+seed.slice(12,18),c='id-'+seed.slice(18,24);
  const category=n%2?'Ciência':'Arte',period=n%3?'Recente':'Antigo';
  const items=[{id:a,title:'  Árvore '+n+' ',category,period,value:n%13},
    {id:b,title:'Árvore diferente',category:category==='Arte'?'Ciência':'Arte',period,value:2},
    {id:c,title:'Outro registro',category,period:period==='Recente'?'Antigo':'Recente',value:3},
    {id:0,title:'Árvore zero',category,period,value:0}];
  const base={screen:'list',selectedId:null,query:'arvore',category,period};
  const cases=[];
  function add(criterion,input,slot) {
    const scope=slot?'individual':'team',id=seed.slice(0,12)+'-'+criterion+(slot?'-S'+slot:'')+'-C'+(cases.length+1);
    cases.push(slot?{id,criterion,scope,slot,input}:{id,criterion,scope,input});
  }
  const state=(loading,error,list=items,filtered=list)=>({op:'estado',loading,error,items:list,filtered});
  add('M2-1',state(true,'falha'));add('M2-1',state(false,'falha'));
  add('M2-2',{op:'filtrar',items,query:'  ARVORE ',category,period});
  add('M2-2',{op:'filtrar',items,query:'  ÁRVORE ',category,period});
  add('M2-2',{op:'filtrar',items,query:'inexistente-'+n,category:'Todas',period:'Todos'});
  add('M2-3',{op:'filtrar',items:items.slice().reverse(),query:'',category:'Todas',period:'Todos'});
  add('M2-4',{op:'chaves',items:items.slice().reverse()});
  add('M3-1',state(false,null,[],[]));add('M3-1',state(false,null,items,[]));
  add('M3-2',{op:'tentar',state:{status:'erro',error:'Sem rede'}});
  add('M3-2',{op:'tentar',state:{status:'pronto',error:null}});
  add('M3-3',{op:'navegar',state:{...base,query:'',category:'Todas',period:'Todos'},action:'open',id:a});
  add('M3-3',{op:'navegar',state:{...base,screen:'detail',selectedId:a,query:'',category:'Todas',period:'Todos'},action:'back'});
  add('M3-4',{op:'validar',form:{title:'Registro '+n,category}});
  add('M3-4',{op:'validar',form:{title:'T'.repeat(80),category:'C'.repeat(40)}});
  add('M3-4',{op:'validar',form:{title:' ',category:''}});
  add('M3-4',{op:'validar',form:{title:'A'.repeat(81),category:'C'.repeat(41)}});
  add('M3-5',{op:'navegar',state:base,action:'open',id:c});
  add('M3-5',{op:'navegar',state:{...base,screen:'detail',selectedId:c},action:'back'});
  add('M3-6',{op:'resumo',items:items.slice(0,n%3+1)});add('M3-6',{op:'resumo',items:[]});
  for(const slot of slots) {
    let individual;
    if(slot===1) individual=[{op:'normalizar',value:'  ÁRVORE '+n+' '},{op:'normalizar',value:''},
      {op:'normalizar',value:null},{op:'normalizar',value:' AçÃO '},{op:'normalizar',value:'a'.repeat(201)}];
    if(slot===2) individual=[state(true,'falha'),state(false,null,[],[]),{...state(false,null),items:null},
      state(false,null,items,[]),{...state(false,null),loading:'false'}];
    if(slot===3) individual=[{op:'validar',form:{title:'Registro '+n,category}},
      {op:'validar',form:{title:' ',category:''}},{op:'validar',form:null},
      {op:'validar',form:{title:'T'.repeat(80),category:'C'.repeat(40)}},
      {op:'validar',form:{title:'T'.repeat(81),category:'C'.repeat(41)}}];
    if(slot===4) individual=[{op:'chave',item:{id:a}},{op:'chave',item:{id:0}},
      {op:'chave',item:{}},{op:'chave',item:{id:'id-'+n}},
      {op:'chave',item:{id:'x'.repeat(81)}}];
    individual.forEach((input,i)=>add('M4-'+(i+1),input,slot));
  }
  return cases;
}

/* Candidate v2. Production admission requires explicit teacher approval.
 * No names, grades, secrets or real student data are bundled with this code. */
function mobileA08AssertPolicy() {
  const approval = PropertiesService.getScriptProperties().getProperty('MOBILE_A08_POLICY_APPROVAL');
  if (approval !== 'four-tasks-reflection-v2')
    throw Error('DECISION_REQUIRED_F02_F03: avaliação oficial aguarda aceite docente das quatro tarefas e do registro reflexivo.');
}
function mobileA08ProcessEvidence(evidence) {
  const usage = evidence && evidence.aiUsage;
  return !!usage && typeof usage.reflection === 'string' && usage.reflection.trim().length >= 20 &&
    ((usage.status === 'used' && evidence.aiLog.length > 0) ||
     (usage.status === 'not-used' && evidence.aiLog.length === 0));
}
function mobileA08AiUsage(value, aiLog) {
  mobileA08Object(value, ['status','reflection'], ['status','reflection'], 'registro reflexivo');
  if (!['undeclared','used','not-used'].includes(value.status)) throw Error('Situação de uso da IA inválida.');
  mobileRead(value.reflection, 400, 'reflexão');
  if (typeof value.reflection !== 'string') throw Error('Reflexão inválida.');
  if (value.status === 'used' && !aiLog.length) throw Error('Uso de IA declarado sem registro real.');
  if (value.status !== 'used' && aiLog.length) throw Error('Registro de IA contradiz a declaração de uso.');
  return {status:value.status,reflection:value.reflection};
}
function mobileA08RosterIdentity(binding) {
  const people = binding.members.map(m => mobileNormal(m.name)).sort();
  return {teamKey:mobileA08Hash([binding.activity,mobileNormal(binding.team)]),
    rosterHash:mobileA08Hash(people),people};
}
function mobileA08RosterKey(binding) {
  return 'MOBILE_A08_ROSTER_' + mobileA08RosterIdentity(binding).teamKey;
}
function mobileA08AssertRoster(binding, props, audit) {
  const id = mobileA08RosterIdentity(binding), raw = props.getProperty(mobileA08RosterKey(binding));
  let record = null;
  if (raw) {
    try {record = JSON.parse(raw);} catch {throw Error('ROSTER_RECONCILIATION_REQUIRED: cadastro da equipe inconsistente.');}
    if (record.rosterHash !== id.rosterHash || record.teamKey !== id.teamKey)
      throw Error('ROSTER_CHANGED: mantenha todos os participantes da entrega anterior; mudanças exigem conferência docente.');
    if (record.status !== 'committed')
      throw Error('ROSTER_RECONCILIATION_REQUIRED: há gravação incompleta; consulte o professor antes de reenviar.');
  }
  if (audit && audit.getLastRow() > 1) {
    const rows = audit.getRange(2,1,audit.getLastRow()-1,17).getValues().filter(row =>
      row[2] === binding.activity && mobileNormal(row[1]) === mobileNormal(binding.team));
    if (record && !rows.length) throw Error('ROSTER_RECONCILIATION_REQUIRED: histórico da equipe ausente.');
    if (rows.length) {
      const observed = rows.map(row => mobileNormal(row[0])).sort();
      if (mobileA08Canonical(observed) !== mobileA08Canonical(id.people))
        throw Error('ROSTER_CHANGED: composição da equipe difere da auditoria; procure o professor.');
      // Existing v1 data are admitted only when every historical member row
      // describes the SAME full roster. Inconsistent partial replays fail closed.
      for (const row of rows) {
        let previous;
        try {previous = JSON.parse(row[15]);} catch {throw Error('ROSTER_RECONCILIATION_REQUIRED: auditoria inválida.');}
        if (!Array.isArray(previous.members) || mobileA08Canonical(previous.members.map(m => mobileNormal(m.name)).sort()) !== mobileA08Canonical(id.people))
          throw Error('ROSTER_RECONCILIATION_REQUIRED: composições históricas divergentes.');
      }
    }
  }
  return {version:2,teamKey:id.teamKey,rosterHash:id.rosterHash};
}
function mobileA08ReserveRoster(binding, props, record, challengeId) {
  const key = mobileA08RosterKey(binding);
  if (!props.getProperty(key)) {
    const count = Object.keys(props.getProperties()).filter(k => k.startsWith('MOBILE_A08_ROSTER_')).length;
    if (count >= 200) throw Error('Capacidade de cadastro de equipes atingida; solicite manutenção docente.');
  }
  props.setProperty(key, JSON.stringify({...record,status:'processing',challengeId}));
}
function mobileA08FinishRoster(binding, props, record, challengeId, receiptId, status) {
  props.setProperty(mobileA08RosterKey(binding), JSON.stringify({...record,status,challengeId,receiptId}));
}
function mobileA08ConsumeRate(binding, props, now) {
  const id = mobileA08RosterIdentity(binding), prefix = MOBILE_A08.ratePrefix;
  // Free-text identity is NOT authentication. Shared global and member limits
  // bound rotation abuse; changing package bytes does not reset any quota.
  const buckets = [
    [prefix+'team_'+id.teamKey,5],
    [prefix+'roster_'+mobileA08Hash([binding.activity,id.rosterHash]),5],
    ...id.people.map(p => [prefix+'person_'+mobileA08Hash([binding.activity,p]),10]),
    [prefix+'global_'+binding.activity,100]
  ];
  const states = buckets.map(([key,limit]) => {
    const raw=props.getProperty(key); let r=raw?JSON.parse(raw):{count:0,until:now+MOBILE_A08.ttlMs};
    if (!Number.isFinite(r.until)||!Number.isInteger(r.count)||r.count<0) throw Error('Quota inválida; solicite manutenção docente.');
    if(r.until<=now)r={count:0,until:now+MOBILE_A08.ttlMs};
    if(r.count>=limit)throw Error('Muitas tentativas para a equipe ou limite global; aguarde dez minutos.');
    return [key,{count:r.count+1,until:r.until}];
  });
  // All quota checks precede all quota writes while holding ScriptLock.
  for(const [key,state] of states)props.setProperty(key,JSON.stringify(state));
}
