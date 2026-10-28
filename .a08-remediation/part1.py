# Server admission, durable roster and quotas; references and sandbox unchanged.
s=G+'RubricaAula08.gs'
sub(s,"contract:'1.0.0'","contract:'2.0.0'")
sub(s,"mobileRead(m.name,100,'nome')","mobileRead(m.name,80,'nome')")
sub(s,"{2,99}$/u.test(name)","{2,79}$/u.test(name)")
sub(s,"  if(!team) throw Error('Informe a equipe.');","  if(!team) throw Error('Informe a equipe.');\n  if(/^[=+@-]/.test(team))throw Error('Nome de equipe não pode começar com fórmula.');")
sub(s,"['preflight','aiLog','environment'],['preflight','aiLog','environment'],'evidência'","['preflight','aiLog','environment','aiUsage'],['preflight','aiLog','environment','aiUsage'],'evidência'")
sub(s,"aiLog,environment:{runtime:env.runtime,nodeMajor:env.nodeMajor,platform:env.platform}};","aiLog,aiUsage:mobileA08AiUsage(value.aiUsage,aiLog),environment:{runtime:env.runtime,nodeMajor:env.nodeMajor,platform:env.platform}};")
sub(s,"  const allowed=['src/equipe.mjs',...input.slots.map(n=>'src/individual/aluno'+n+'.mjs')];","  if(mobileA08Canonical(input.slots)!=='[1,2,3,4]') throw Error('As quatro tarefas 1,2,3,4 são obrigatórias nesta candidata; política sujeita a aceite docente.');\n  const allowed=['src/equipe.mjs',...input.slots.map(n=>'src/individual/aluno'+n+'.mjs')];")
sub(s,"    const props=PropertiesService.getScriptProperties(),now=Date.now(); mobileA08Cleanup(props,now);","    const props=PropertiesService.getScriptProperties(),now=Date.now();\n    mobileA08AssertRoster(binding,props); mobileA08Cleanup(props,now);")
between(s,"    const rateKey=MOBILE_A08.ratePrefix+binding.packageSha256;","    const record={challengeId:","    mobileA08ConsumeRate(binding,props,now);\n")
sub(s,"    rate.count++;props.setProperty(rateKey,JSON.stringify(rate));\n","")
sub(s,"'M1-4':binding.evidence.aiLog.length>0&&binding.evidence.aiLog.every(x=>x.request&&x.suggestion&&x.humanChange&&x.test)","'M1-4':mobileA08ProcessEvidence(binding.evidence)")
sub(s,"mobileHeaders(audit,MOBILE_AUDIT_HEADERS);mobileA08CheckConflicts(grade,binding);","mobileHeaders(audit,MOBILE_AUDIT_HEADERS);mobileA08CheckConflicts(grade,binding);\n    const roster=mobileA08AssertRoster(binding,state.props,audit);")
sub(s,"    state.record.status='processing';state.record.receiptId=receipt.receiptId;","    mobileA08ReserveRoster(binding,state.props,roster,state.record.challengeId);\n    state.record.status='processing';state.record.receiptId=receipt.receiptId;")
sub(s,"      SpreadsheetApp.flush();","      SpreadsheetApp.flush();\n      mobileA08FinishRoster(binding,state.props,roster,state.record.challengeId,receipt.receiptId,'committed');")
sub(s,"      state.record.status='write_failed';","      state.record.status='write_failed';\n      try {mobileA08FinishRoster(binding,state.props,roster,state.record.challengeId,receipt.receiptId,'write_failed');} catch(ignored) {}")
sub(s,"  if(input.action==='challenge')return mobileA08Challenge(input);","  if(input.action!=='validateReceipt')mobileA08AssertPolicy();\n  if(input.action==='challenge')return mobileA08Challenge(input);")
put(s,read(s)+'\n'+(T/'server-guards.js').read_text())
for p in [s,G+'Code.gs',L+'config.js']:
 put(p,read(p).replace('mobile-a08-v1','mobile-a08-v2').replace('mobile-a08-lab-vivo-1.1.0','mobile-a08-lab-vivo-2.0.0'))
put(L+'projeto/src/evidence-policy.mjs',(T/'evidence-policy.mjs').read_text())
p=L+'projeto/src/contrato.mjs'
put(p,"import {assertRequiredTasks,validateAiUsage} from './evidence-policy.mjs';\n"+read(p))
put(p,read(p).replace("schema: 'mobile-a08-v1'","schema: 'mobile-a08-v2'").replace("generator: '1.0.0', contract: '1.0.0', evaluator: 'formativo-1.0.0'","generator: '2.0.0', contract: '2.0.0', evaluator: 'formativo-2.0.0'"))
sub(p,"['type', 'preflight', 'aiLog', 'environment'], 'evidence'","['type', 'preflight', 'aiLog', 'environment', 'aiUsage'], 'evidence'")
sub(p,"  noSecrets(evidence);","  validateAiUsage(evidence.aiUsage,evidence.aiLog);\n  noSecrets(evidence);")
sub(p,"  const manifest = rows[0];","  const manifest = rows[0];\n  if(manifest.schema!==CONFIG.schema) fail('pacote de versão antiga; baixe o projeto atualizado e execute npm run entrega novamente');")
sub(p,"  if (rows.length !== manifest.slots.length + 5)","  assertRequiredTasks(manifest.slots);\n  if (rows.length !== manifest.slots.length + 5)")
p=L+'projeto/scripts/preflight.mjs'
sub(p,"Object.keys(raw).length !== 1 || !Object.hasOwn(raw,'aiLog')","Object.keys(raw).sort().join(',') !== 'aiLog,aiUsage'")
sub(p,"deve conter somente aiLog.","deve conter somente aiLog e aiUsage; use o exemplo da versão atual.")
sub(p,"aiLog:raw.aiLog,environment:","aiLog:raw.aiLog,aiUsage:raw.aiUsage,environment:")
put(L+'projeto/src/evidencias.json',json.dumps({'aiLog':[],'aiUsage':{'status':'undeclared','reflection':''}},ensure_ascii=False,indent=2)+'\n')
p=L+'projeto/src/avaliacao-local.mjs'
put(p,"import {assertRequiredTasks,processEvidenceComplete} from './evidence-policy.mjs';\n"+read(p))
sub(p,"  const checks = [","  assertRequiredTasks(slots);\n  const checks = [")
sub(p,"Array.isArray(evidence?.aiLog) && evidence.aiLog.length > 0","processEvidenceComplete(evidence)")
put(p,read(p).replace('Síntese de uso da IA registrada','Registro reflexivo de uso ou não uso da IA'))
p=L+'projeto/scripts/avaliar.mjs'
put(p,"import {assertRequiredTasks} from '../src/evidence-policy.mjs';\n"+read(p))
sub(p,"  return slots;","  assertRequiredTasks(slots);\n  return slots;")
sub(p,"  const evidence=await collectEvidence(root)","  assertRequiredTasks(slots);\n  const evidence=await collectEvidence(root)")
sub(p,"    console.log('\\nVocê pode editar, testar e tentar novamente sem penalidade.');","    console.log('\\nCandidata: quatro tarefas e registro reflexivo. Uso oficial aguarda aceite docente.');\n    console.log('Você pode editar, testar e tentar novamente sem penalidade.');")
put(L+'identity.js',(T/'identity.js').read_text())
p=L+'atividade.js'
put(p,"import {inspectIdentity,showIdentityErrors} from './identity.js';\n"+read(p))
between(p,'function identity(strict = true) {','function snapshot(','''function identity(strict = true) {
  const result=inspectIdentity($('team').value,[1,2,3,4].map(i=>$('member-'+i).value));
  if(strict && Object.keys(result.errors).length) {
    const error=Error(Object.values(result.errors)[0]);
    error.field=Object.keys(result.errors)[0];throw error;
  }
  return {team:result.team,members:result.members};
}
''')
sub(p,"  let valid = false;\n  try { identity(); valid = true; } catch { /* Campos serão preenchidos pelo aluno. */ }","  const check=inspectIdentity($('team').value,[1,2,3,4].map(i=>$('member-'+i).value));\n  const valid=Object.keys(check.errors).length===0;\n  if(pkg)showIdentityErrors(check);")
sub(p,"!valid ? 'Arquivo recebido. Preencha a equipe e os nomes dos participantes para liberar o envio.' :","!valid ? Object.values(check.errors)[0] :")
p=L+'pdf.js'
sub(p,"version: '1.1.0'","version: '2.0.0'")
sub(p,"{ title: '4. Uso declarado de IA', items: pkg?.evidence.aiLog.length ? pkg.evidence.aiLog.map((entry, i) => [","{ title: '4. Registro reflexivo do processo', items: [\n      ['Declaração', pkg?.evidence.aiUsage?.status || 'Não informada'],\n      ['Reflexão da equipe', pkg?.evidence.aiUsage?.reflection || 'Ainda não informada'],\n      ...(pkg?.evidence.aiLog.length ? pkg.evidence.aiLog.map((entry, i) => [")
sub(p,"]) : [['Registro', 'Nenhum uso de IA registrado neste pacote. Não foi inventado um histórico de conversa.']] },","]) : [['Registro', 'Nenhum uso de IA registrado neste pacote. Não foi inventado um histórico de conversa.']])] },")
for p in [s,L+'config.js']:
 put(p,read(p).replace('Registro de uso da IA','Registro reflexivo do processo').replace('Uso da IA documentado','Registro reflexivo do processo'))
p=L+'visual.css';put(p,read(p)+'''\n/* Specific identity errors; visible text, not color alone. */
.field-error{color:#9d1425;font-weight:650;margin:8px 0 16px;max-width:70ch}
input[aria-invalid="true"]{border:2px solid #9d1425}
.candidate-notice{border-left:4px solid var(--green);padding:14px;background:var(--tint);margin:18px 0}
.asset-context{border:1px solid var(--line);padding:16px;border-radius:8px;margin:12px 0}
''')
