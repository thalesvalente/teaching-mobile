/* Synthetic in-memory Apps Script/Sheets adapter. NOT connected Google homologation. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const source=fs.readFileSync(path.join(__dirname,'../integrations/mobile-aula08-appscript/Code.gs'),'utf8');
const clone=x=>JSON.parse(JSON.stringify(x));
const QA_ID='MOBILE_QA_SYNTHETIC_ONLY_0000000000001';
const PRODUCTION_ID='1pkbf3rJD3R5-lX7TuOyfir0A4ID1m2QfUg8ZIfNOeT0';
function createFixture(options={}){
 const mode=options.mode||'QA',prefix='MOBILE_NOTAS_'+mode+'_';
 const props={MOBILE_NOTAS_ENVIRONMENT:mode,[prefix+'SPREADSHEET_ID']:mode==='QA'?QA_ID:PRODUCTION_ID,
  [prefix+'DATA_POLICY']:'SYNTHETIC_ONLY',[prefix+'ALLOWED_ORIGIN']:'http://127.0.0.1:8138',
  [prefix+'SUBMISSIONS_ENABLED']:'true',[prefix+'SECURITY_READY']:'true',
  [prefix+'TEACHER_APPROVAL']:mode==='QA'?'A08-V4-QA-SYNTHETIC':'A08-V4-APPROVED',
  [prefix+'HMAC_SECRET']:'TEST-ONLY-'+ '0'.repeat(60),[prefix+'ADMIN_EMAIL']:'teacher@example.invalid',
  [prefix+'TEACHER_RUBRIC_APPROVAL']:'A08-V4-RUBRIC-20X05',
  [prefix+'QA_HOMOLOGATION_REF']:'SYNTHETIC_FIXTURE_ONLY_NOT_CONNECTED_HOMOLOGATION'};
 const tabs={},cache=new Map(),calls={writes:[],reads:[],locked:false};
 let active='teacher@example.invalid',effective=active,fail='',id=0;
 const output=s=>({content:s,getContent:()=>s,setMimeType(){return this;},setXFrameOptionsMode(){return this;}});
 const scope={console:{log(){}},
  Session:{getActiveUser:()=>({getEmail:()=>active}),getEffectiveUser:()=>({getEmail:()=>effective})},
  PropertiesService:{getScriptProperties:()=>({getProperty:k=>Object.prototype.hasOwnProperty.call(props,k)?props[k]:null,
   setProperty:(k,v)=>{props[k]=v;},deleteProperty:k=>{delete props[k];}})},
  CacheService:{getScriptCache:()=>({get:k=>cache.get(k),put:(k,v)=>cache.set(k,v)})},
  LockService:{getScriptLock:()=>({waitLock(){if(calls.locked)throw Error('LOCK_BUSY');calls.locked=true;},releaseLock(){calls.locked=false;}})},
  Utilities:{DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},
   computeDigest:(_a,s)=>Array.from(crypto.createHash('sha256').update(s).digest()),
   computeHmacSha256Signature:(s,k)=>Array.from(crypto.createHmac('sha256',k).update(s).digest()),
   getUuid:()=>crypto.randomUUID(),formatDate:d=>d.toISOString().slice(0,19)},
  ContentService:{createTextOutput:output,MimeType:{TEXT:'text/plain'}},HtmlService:{createHtmlOutput:output,XFrameOptionsMode:{ALLOWALL:'ALLOWALL'}},
  Sheets:{Spreadsheets:{get(bookId,args){calls.reads.push(bookId);if(fail==='permission')throw Error('PERMISSION_DENIED');
   if(bookId!==props[prefix+'SPREADSHEET_ID'])throw Error('Wrong destination');
   const names=args.ranges?args.ranges.map(x=>x.match(/^'([^']+)'/)[1]):Object.keys(tabs);
   return {spreadsheetId:bookId,properties:{locale:'pt_BR',timeZone:'America/Fortaleza'},sheets:names.map(n=>{
    const t=tabs[n],o={properties:{title:n,sheetId:t.id,gridProperties:{rowCount:1000,columnCount:Math.max(28,t.rows[0].length)}}};
    if(args.includeGridData)o.data=[{rowData:t.rows.map((r,ri)=>({values:Array.from({length:Math.max(r.length,(t.formulas[ri]||[]).length)},(_,ci)=>{
     const v=r[ci]??'',f=t.formulas[ri]?.[ci];return f?{userEnteredValue:{formulaValue:f},effectiveValue:{stringValue:''}}:
      v===''?{}:typeof v==='number'?{userEnteredValue:{numberValue:v},effectiveValue:{numberValue:v}}:
      typeof v==='boolean'?{userEnteredValue:{boolValue:v},effectiveValue:{boolValue:v}}:{userEnteredValue:{stringValue:v},effectiveValue:{stringValue:v}};
    })}))}];return o;
   })};},batchUpdate({requests},bookId){calls.writes.push({bookId,requests:clone(requests)});
    if(fail==='before')throw Error('TIMEOUT_BEFORE_COMMIT');
    const list=fail==='partial'?requests.slice(0,1):requests;
    for(const req of list){const x=req.updateCells;if(!x)throw Error('Unsupported fixture mutation');const t=Object.values(tabs).find(t=>t.id===x.start.sheetId);
     for(let i=0;i<x.rows.length;i++){const ri=x.start.rowIndex+i;t.rows[ri]=t.rows[ri]||[];t.formulas[ri]=t.formulas[ri]||[];
      x.rows[i].values.forEach((cell,j)=>{const ci=x.start.columnIndex+j,v=cell.userEnteredValue||{};t.formulas[ri][ci]=v.formulaValue||'';
       t.rows[ri][ci]=v.stringValue??v.numberValue??v.boolValue??'';});}
    }
    if(['after','partial'].includes(fail))throw Error('TIMEOUT_AFTER_COMMIT');return {};
  }}}
 };
 vm.createContext(scope);vm.runInContext(source,scope,{filename:'integrations/mobile-aula08-appscript/Code.gs'});
 const api=scope.MOBILE_V4_PRIVATE_;
 const sheet=(name,headers)=>tabs[name]={id:++id,rows:[Array.from(headers)],formulas:[]};
 sheet('Alunos',api.A_HEADERS);sheet('Equipes',api.T_HEADERS);sheet('Resultados',api.R_HEADERS);sheet('Auditoria',api.AU_HEADERS);sheet('Atividades',api.ACT_HEADERS);
 for(let b=1;b<=4;b++)sheet(b+'º Bimestre',b===4?['Aluno','Matrícula','Equipe','Aula 08 /10','Média /10']:['Aluno','Matrícula','Equipe','Média /10']);
 sheet('Orientações',['Seção','Descrição']);
 tabs.Atividades.rows.push(['MOBILE-A08-2026','Aula 08 — Operação Dados sob Pressão',4,'Aula 08 /10','mobile-a08-lab-v4',true]);
 tabs.Atividades.rows.push(['','','','','',false]);
 const addStudent=(enrollment='00000000.ITA0001',name='Pessoa Sintética Um',status='VALIDADO')=>tabs.Alunos.rows.push([enrollment,name,api.webNormalized(name),status,'QA_SYNTHETIC_ONLY','2026-11-11T00:00:00Z','NÃO','Fixture sem dados reais']);
 addStudent();addStudent('00000000.ITA0002','Pessoa Sintética Dois');
 const teamId='11111111-1111-4111-8111-111111111111';
 function post(payload,nonce='synthetic-request-0001'){
  const out=scope.doPost({parameter:{payload:JSON.stringify(payload),nonce}}).content;
  const m=out.match(/top\.postMessage\(([\s\S]*),"(?:http|https):/);if(!m)throw Error('Missing postMessage: '+out);return JSON.parse(m[1]);
 }
 const lookup=(enrollment='00000000.ITA0001',tid=teamId)=>post({operation:'lookupStudent',environment:mode,activity:api.MOBILE_CFG.activity,teamId:tid,enrollment},'lookup-synthetic-0001');
 function payload(xp=0,enrollments=['00000000.ITA0001'],tid=teamId){
  const members=enrollments.map(enrollment=>{const r=lookup(enrollment,tid);if(!r.ok)throw Error(r.message);return {enrollment,confirmed:true,confirmationToken:r.confirmationToken};});
  return {operation:'submitTeam',environment:mode,schema:'mobile-a08-lab-v4',activity:api.MOBILE_CFG.activity,identity:{team:'Equipe Sintética QA',teamId:tid,members},
   evidence:{schema:api.MOBILE_CFG.schema,tipo:'formativo-nao-e-nota',xp,maximoXp:100,
    exercicios:Array.from(api.MOBILE_TASKS,(t,i)=>({id:t[0],estado:i<xp/5?'APROVADO':'PENDENTE',xp:i<xp/5?5:0,maximoXp:5,comentario:''})),
    observacao:'Evidência fictícia',testeNativoPendente:'Não executado nativo',codigoFonteCompleto:'  export const test = 1;\n'}};
 }
 function review(receiptId,points=20,decision='VALIDADO'){
  return clone(scope.validarEntregaDocenteMobile({receiptId,decision,criteria:Array.from(api.MOBILE_TASKS,(t,i)=>({id:t[0],passed:i<points})),evidenceRef:'QA:conferencia-ficticia-20261111',reason:'Conferência docente exclusivamente sintética'}));
 }
 return {scope,api,props,tabs,calls,post,lookup,payload,review,addStudent,fail:x=>{fail=x;},auth:(a,e=a)=>{active=a;effective=e;},clearLimits:()=>cache.clear(),clone};
}
module.exports={createFixture,QA_ID,PRODUCTION_ID};
