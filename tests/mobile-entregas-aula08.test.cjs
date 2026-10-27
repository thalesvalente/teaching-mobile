/* Apps Script e Sheets simulados. Nenhuma chamada ao Google ou dados de estudantes.
 * node --test tests/mobile-entregas-aula08.test.cjs
 * createFixture é reutilizado pelo teste Chromium para exercitar o MESMO servidor.
 */
'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const appscript=path.join(root,'lessons/aula-07-estado-filtros/appscript');
const source=fs.readFileSync(path.join(appscript,'RubricaAula08.gs'),'utf8');
const server=fs.readFileSync(path.join(appscript,'Code.gs'),'utf8');
const headers=['Aluno','Equipe','Atividade','Instrumento','Data/hora BRT','Recebido UTC',
  'ID entrega','SHA-256 PDF','SHA-256 respostas','Assinatura HMAC','XP / 100','Nota / 10',
  'Autoavaliação declarada / 10','Situação','Rubrica/versão','Respostas JSON','Chave interna'];
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const clone=v=>JSON.parse(JSON.stringify(v));
const canonical=v=>v===null||typeof v!=='object'?JSON.stringify(v):Array.isArray(v)?
  '['+v.map(canonical).join(',')+']':'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';
function makeSheet(name,cols) {
  return {name,rows:[cols.slice()],failOnWrite:false,writeHook:null,
    getName(){return this.name;},getLastRow(){return this.rows.length;},getLastColumn(){return this.rows[0].length;},
    insertColumnBefore(col){if(this.failOnWrite)throw Error('Escrita bloqueada');for(const row of this.rows)row.splice(col-1,0,'');},
    getRange(row,col,n=1,m=1){
      if(row<1||col<1||n<1||m<1)throw Error('Range inválido');const target=this;
      return {
        getValues(){return Array.from({length:n},(_,i)=>Array.from({length:m},(_,j)=>target.rows[row+i-1]?.[col+j-1]??''));},
        setValues(values){
          if(target.failOnWrite)throw Error('Escrita simulada bloqueada');
          if(target.writeHook){const hook=target.writeHook;target.writeHook=null;hook();}
          assert.equal(values.length,n);
          for(let i=0;i<n;i++){assert.equal(values[i].length,m);while(target.rows.length<row+i)target.rows.push([]);
            for(let j=0;j<m;j++)target.rows[row+i-1][col+j-1]=values[i][j];}
        },setValue(value){this.setValues([[value]]);},setFormulas(values){this.setValues(values);},setNumberFormat(){},
        sort(spec){const config=Array.isArray(spec)?spec:[{column:spec,ascending:true}],start=row-1,items=target.rows.slice(start,start+n);
          items.sort((a,b)=>{for(const rule of config){const cmp=String(a[rule.column-1]||'').localeCompare(
            String(b[rule.column-1]||''),'pt-BR',{sensitivity:'base'});if(cmp)return rule.ascending===false?-cmp:cmp;}return 0;});
          target.rows.splice(start,n,...items);}
      };
    }};
}
function createFixture(options={}) {
  const tabs=new Map([
    ['1º Bimestre',makeSheet('1º Bimestre',['Aluno','Equipe','Média'])],
    ['2º Bimestre',makeSheet('2º Bimestre',['Aluno','Equipe','Média'])],
    ['3º Bimestre',makeSheet('3º Bimestre',['Aluno','Equipe','Média'])],
    ['4º Bimestre',makeSheet('4º Bimestre',['Aluno','Equipe','Aula 07','Média'])],
    ['Auditoria',makeSheet('Auditoria',headers)]
  ]);
  let uid=0,flush=0,acquired=0,released=0,held=false,now=options.now||Date.now();
  const props={MOBILE_WEB_SUBMISSIONS_ENABLED:'true'};
  const signed=buffer=>Array.from(buffer,x=>x>127?x-256:x);
  class Clock extends Date {constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}}
  const scope={Date:Clock,Set,Map,JSON,Number,Math,console:{log(){}},
    Utilities:{DigestAlgorithm:{SHA_256:'SHA_256'},Charset:{UTF_8:'UTF_8'},
      computeDigest:(_a,txt)=>signed(crypto.createHash('sha256').update(txt).digest()),
      computeHmacSha256Signature:(txt,key)=>signed(crypto.createHmac('sha256',key).update(txt).digest()),
      getUuid:()=> '00000000-0000-4000-8000-'+String(++uid).padStart(12,'0'),
      formatDate:date=>new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Fortaleza',year:'numeric',month:'2-digit',
        day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(date).replace(', ',' ')},
    SpreadsheetApp:{openById:id=>{
      assert.equal(id,'1z5VEmScYCtfsEGg0AahY3cHE5eYO79Zj0xLMzx4iT0Y');
      return {getSheetByName:name=>tabs.get(name),getName:()=> 'Mobile TESTE',getSheets:()=>Array.from(tabs.values())};
    },flush:()=>{if(options.failFlush)throw Error('Flush falhou');flush++;}},
    PropertiesService:{getScriptProperties:()=>({getProperty:key=>props[key]||null,
      getProperties:()=>({...props}),setProperty:(key,value)=>{if(value.length>9000)throw Error('Quota de propriedade');props[key]=value;},
      deleteProperty:key=>{delete props[key];}})},
    LockService:{getScriptLock:()=>({waitLock:()=>{if(held)throw Error('Lock ocupado');held=true;acquired++;},
      releaseLock:()=>{assert.equal(held,true);held=false;released++;}})},
    ContentService:{createTextOutput:s=>({getContent:()=>s})},
    HtmlService:{createHtmlOutput:s=>({content:s,setTitle(){return this;}})}
  };
  vm.createContext(scope);
  for(const filename of ['RubricaAula07.gs','RubricaAula08.gs','Code.gs'])
    vm.runInContext(fs.readFileSync(path.join(appscript,filename),'utf8'),scope,{filename});
  const dispatch=input=>clone(scope.processMobileAula08Action(typeof input==='string'?input:JSON.stringify(input)));
  function post(input,requestNonce='client-nonce') {
    const html=scope.doPost({parameter:{nonce:requestNonce,payload:typeof input==='string'?input:JSON.stringify(input)}}).content;
    const match=html.match(/top\.postMessage\(([\s\S]*), "\*"\);/);assert.ok(match);
    return JSON.parse(match[1]);
  }
  return {scope,props,tabs,dispatch,post,advance:ms=>{now+=ms;},
    grade:()=>tabs.get('4º Bimestre').rows,audit:()=>tabs.get('Auditoria').rows,
    metrics:()=>({flush,acquired,released,held}),hold:()=>{held=true;},release:()=>{held=false;}};
}
function makeBinding(slots=[1,2,3,4]) {
  return {activity:'MOBILE-AULA08-2026',schema:'mobile-a08-v1',packageSha256:'b'.repeat(64),slots,
    sourceHashes:Object.fromEntries(['src/equipe.mjs',...slots.map(s=>'src/individual/aluno'+s+'.mjs')].map(p=>[p,hash(p)])),
    team:'Equipe QA',members:slots.map(s=>({name:['Ana Teste','Bruno Teste','Carla Teste','Daniel Teste'][s-1]})),
    evidence:{preflight:{version:'1.0.0',ok:true,nodeMajor:24,filesReady:true},
      aiLog:[{mission:'M2',request:'Explique o filtro.',suggestion:'Combinar condições.',humanChange:'Revisei a função.',test:'Executei a busca.'}],
      environment:{runtime:'node',nodeMajor:24,platform:'linux'}}};
}
// Oráculo independente compacto, usado somente com entradas conhecidas do gerador de desafios.
function expectedForCase(c) {
  const i=c.input;
  switch(i.op) {
    case 'normalizar':return typeof i.value==='string'&&i.value.length<=200?i.value.trim().normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'').toLowerCase():'';
    case 'estado':return typeof i.loading!=='boolean'||!Array.isArray(i.items)||!Array.isArray(i.filtered)?'erro':
      i.loading?'carregando':i.error?'erro':i.items.length===0?'vazio':i.filtered.length===0?'sem-resultados':'pronto';
    case 'filtrar':return i.items.filter(x=>(i.category==='Todas'||x.category===i.category)&&
      (i.period==='Todos'||x.period===i.period)&&x.title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
        .includes(i.query.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()));
    case 'chaves':return i.items.map(x=>String(x.id));
    case 'chave':return i.item.id===undefined||typeof i.item.id==='string'&&i.item.id.length>80?null:String(i.item.id);
    case 'tentar':return i.state.status==='erro'?{status:'carregando',error:null}:i.state;
    case 'navegar':return {...i.state,screen:i.action==='open'?'detail':'list',selectedId:i.action==='open'?String(i.id):null};
    case 'resumo':return {total:i.items.length,text:i.items.length+' registro(s) no recorte.'};
    case 'validar':{
      const errors={},form=i.form||{};
      for(const [key,blank,long,max] of [['title','Informe o título.','Use até 80 caracteres.',80],
        ['category','Escolha a categoria.','Use até 40 caracteres.',40]]) {
        if(!form[key]?.trim())errors[key]=blank;else if(form[key].trim().length>max)errors[key]=long;
      }
      return {valid:Object.keys(errors).length===0,errors};
    }
    default:throw Error('Operação inesperada no teste.');
  }
}
function completeOutputs(cases) {return cases.map(c=>({id:c.id,ok:true,value:expectedForCase(c),unchanged:true}));}
function issued(f,options={}) {
  const binding=options.binding||makeBinding(),challenge=f.dispatch({...binding,action:'challenge'}),
    outputs=completeOutputs(challenge.cases),input={...binding,action:'verify',challengeId:challenge.challengeId,
      challengeToken:challenge.token,outputs};
  return {binding,challenge,outputs,input};
}
function finalInput(input){return {...input,action:'verifyAndSubmit',pdfSha256:'a'.repeat(64)};}
module.exports={createFixture,makeBinding,completeOutputs,issued,finalInput,canonical,hash};
if(require.main===module) {
  test('A08 config exclusiva; A07 mantém 17 colunas, versão e destino Mobile',()=>{
    const f=createFixture();assert.match(f.scope.doGet().getContent(),/mobile-entregas-1.0.0/);
    assert.equal(f.tabs.size,5);assert.equal(headers.length,17);
    const config=clone(vm.runInContext('MOBILE_CFG.activities["MOBILE-AULA08-2026"]',f.scope));
    assert.deepEqual(config,{sheet:'4º Bimestre',column:'Aula 08',schema:'mobile-a08-v1',rubric:'mobile-a08-lab-vivo-1.1.0',
      instrument:'laboratorio-vivo-av1',evaluator:'aula08'});
    assert.ok(!source.includes('eval('));assert.ok(!source.includes('new Function'));
    assert.ok(!server.includes('1aziGb9eXl5oR6Wz6dDWI7IH9bsINf9Sp7b6nmlT9XqE'));
  });
  test('desafios variáveis com HMAC, TTL e vínculos de pacote/fontes/slots/equipe',()=>{
    const f=createFixture(),a=issued(f),b=issued(f);
    assert.notEqual(a.challenge.nonce,b.challenge.nonce);assert.notEqual(a.challenge.token,b.challenge.token);
    assert.notDeepEqual(a.challenge.cases,b.challenge.cases);
    assert.equal(Date.parse(a.challenge.expiresAt)-Date.parse(a.challenge.issuedAt),600000);
    assert.equal(a.challenge.bindingSha256,hash(canonical(a.binding)));
    assert.deepEqual(a.challenge.sourceHashes,a.binding.sourceHashes);assert.deepEqual(a.challenge.slots,[1,2,3,4]);
    assert.equal(f.audit().length,1);assert.equal(f.grade().length,1);
    const state=JSON.parse(f.props['MOBILE_A08_CHALLENGE_'+a.challenge.challengeId]);
    const signed={challengeId:state.challengeId,nonce:state.nonce,issuedAt:state.issuedAt,expiresAt:state.expiresAt,
      activity:'MOBILE-AULA08-2026',schema:'mobile-a08-v1',packageSha256:state.packageSha256,
      bindingSha256:state.bindingSha256,casesSha256:state.casesSha256};
    assert.equal(a.challenge.token,crypto.createHmac('sha256',f.props.MOBILE_RECEIPT_HMAC_SECRET)
      .update('mobile-a08/challenge/v1:'+canonical(signed)).digest('hex'));
    assert.ok(!JSON.stringify(a.challenge).includes(f.props.MOBILE_RECEIPT_HMAC_SECRET));
  });
  test('20 critérios de 0,5 e nota ÚNICA da equipe para todos os participantes',()=>{
    const f=createFixture(),d=issued(f),full=f.dispatch(d.input);
    const ev=full.evaluation;
    assert.equal(ev.team,'Equipe QA');assert.equal(ev.criteria.length,20);assert.equal(ev.total,10);
    assert.ok(ev.criteria.every(c=>c.max===.5&&c.points===.5));
    assert.deepEqual([ev.m1,ev.m2,ev.m3,ev.m4],[2.5,2,3,2.5]);
    d.outputs.find(o=>d.challenge.cases.find(c=>c.id===o.id).slot===2).value='resposta incorreta';
    const r=f.dispatch(finalInput(d.input));assert.equal(r.receipt.evaluation.total,9.5);
    assert.equal(r.receipt.members.length,4);assert.ok(r.receipt.members.every(m=>!Object.hasOwn(m,'slot')));
    assert.equal(f.audit().length,5);assert.deepEqual(f.grade().slice(1).map(row=>row[3]),[9.5,9.5,9.5,9.5]);
  });
  test('zero comportamental, parcial e máximo; localResult nota 10/999 nunca muda nota oficial',()=>{
    const f=createFixture(),d=issued(f);d.outputs.forEach(o=>{o.value='incorreto';});
    const a=f.dispatch({...d.input,localResult:{grade:10,xp:100,passed:true}});
    assert.equal(a.evaluation.total,2.5);assert.equal(a.evaluation.m2,0);assert.equal(a.evaluation.m3,0);assert.equal(a.evaluation.m4,0);
    const b=f.dispatch({...d.input,localResult:{grade:999,xp:99999,scores:{grade:10}}});assert.deepEqual(a,b);
    const noEvidence=makeBinding([1]);noEvidence.evidence.aiLog=[];noEvidence.evidence.preflight.ok=false;
    const p=issued(createFixture(),{binding:noEvidence});assert.equal(p.binding.evidence.aiLog.length,0);
  });
  test('M1 preflight e IA vazios ficam pendentes, sem fingir execução',()=>{
    const f=createFixture(),binding=makeBinding([1]);binding.evidence.aiLog=[];binding.evidence.preflight.ok=false;
    const d=issued(f,{binding}),r=f.dispatch(d.input).evaluation;assert.equal(r.m1,1.5);assert.equal(r.total,9);
    assert.deepEqual(r.criteria.filter(c=>!c.passed).map(c=>c.id),['M1-3','M1-4']);
  });
  test('evidência preserva hash do log com espaços e aceita os limites do JSONL',()=>{
    const f=createFixture(),binding=makeBinding([1]);
    binding.evidence.aiLog=Array.from({length:20},()=>({mission:'M2',request:' '+ 'x'.repeat(398)+' ',
      suggestion:'  pista  ',humanChange:'  alteração  ',test:'  teste  '}));
    const d=issued(f,{binding});assert.equal(d.challenge.bindingSha256,hash(canonical(binding)));
    assert.equal(f.dispatch(d.input).evaluation.m1,2.5);
    const old=makeBinding([1]);old.evidence.preflight.nodeMajor=0;old.evidence.environment.nodeMajor=18;
    const other=createFixture(),legacy=issued(other,{binding:old});
    assert.equal(other.dispatch(legacy.input).evaluation.m1,2);
    const extra=makeBinding([1]);extra.evidence.aiLog[0].test='x'.repeat(401);
    assert.throws(()=>f.dispatch({...extra,action:'challenge'}),/Campo inválido/);
  });
  test('preservação da coleção exige observação unchanged=true do executor',()=>{
    const f=createFixture(),d=issued(f),id=d.challenge.cases.find(c=>c.criterion==='M2-3').id;
    delete d.outputs.find(o=>o.id===id).unchanged;
    assert.equal(f.dispatch(d.input).evaluation.m2,1.5);
    d.outputs.find(o=>o.id===id).unchanged=false;assert.equal(f.dispatch(d.input).evaluation.m2,1.5);
  });
  test('M3-4 exige formulário válido e limites inclusivos; sempre rejeitar não pontua',()=>{
    const f=createFixture(),d=issued(f),cases=d.challenge.cases.filter(c=>c.scope==='team'&&c.criterion==='M3-4');
    assert.ok(cases.some(c=>c.input.form.title.length===80&&c.input.form.category.length===40));
    assert.ok(cases.some(c=>c.input.form.title.length===81&&c.input.form.category.length===41));
    assert.ok(cases.some(c=>expectedForCase(c).valid===true));
    assert.ok(cases.some(c=>expectedForCase(c).valid===false));
    // Mutante reproduz corretamente as mensagens de erro, mas impede todo cadastro.
    for(const c of cases){const result=d.outputs.find(o=>o.id===c.id);result.value={...result.value,valid:false};}
    const r=f.dispatch(d.input).evaluation;
    assert.equal(r.criteria.find(c=>c.id==='M3-4').passed,false);assert.equal(r.m3,2.5);assert.equal(r.total,9.5);
  });
  test('M2-2 exige normalizar título e consulta com acento; normalizar só título falha',()=>{
    const f=createFixture(),d=issued(f),cases=d.challenge.cases.filter(c=>c.criterion==='M2-2');
    assert.ok(cases.some(c=>c.input.query.includes('Á')&&expectedForCase(c).length>0));
    for(const c of cases){const i=c.input,result=d.outputs.find(o=>o.id===c.id);
      result.value=i.items.filter(x=>(i.category==='Todas'||x.category===i.category)&&
        (i.period==='Todos'||x.period===i.period)&&x.title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
        .includes(i.query.trim().toLowerCase()));}
    const r=f.dispatch(d.input).evaluation;
    assert.equal(r.criteria.find(c=>c.id==='M2-2').passed,false);assert.equal(r.m2,1.5);assert.equal(r.total,9.5);
  });
  test('verify não grava notas ou auditoria, final recalcula sem confiar na prévia',()=>{
    const f=createFixture(),d=issued(f);f.dispatch(d.input);assert.equal(f.audit().length,1);assert.equal(f.grade().length,1);
    d.outputs.find(o=>d.challenge.cases.find(c=>c.id===o.id).criterion==='M3-6').value={total:999,text:'x'};
    assert.equal(f.dispatch(finalInput(d.input)).receipt.evaluation.total,9.5);
  });
  test('recibo HMAC vincula todos os campos, hash de respostas e PDF',()=>{
    const f=createFixture(),d=issued(f),r=f.dispatch(finalInput(d.input)).receipt,unsigned={...r};delete unsigned.signature;
    assert.equal(r.signature,crypto.createHmac('sha256',f.props.MOBILE_RECEIPT_HMAC_SECRET)
      .update('mobile-a08/receipt/v1:'+canonical(unsigned)).digest('hex'));
    assert.equal(r.answersSha256,hash(f.audit()[1][15]));assert.equal(r.pdfSha256,'a'.repeat(64));
    const proof=f.dispatch({action:'validateReceipt',activity:d.binding.activity,schema:d.binding.schema,receipt:r});
    assert.equal(proof.valid,true);assert.equal(proof.receiptSha256,hash(canonical(r)));assert.equal(proof.receiptId,r.receiptId);
    for(const mutate of [x=>x.evaluation.total=10.5,x=>x.pdfSha256='c'.repeat(64),x=>x.team='Falsa',x=>x.receiptId='outro',
      x=>x.evaluation.criteria[0].passed=false,x=>x.members[0].name='Nome Falso',x=>x.sourceHashes['src/equipe.mjs']='d'.repeat(64)]){
      const forged=clone(r);mutate(forged);assert.throws(()=>f.dispatch({action:'validateReceipt',activity:d.binding.activity,
        schema:d.binding.schema,receipt:forged}),/Assinatura/);}
  });
  test('reenvio com novo desafio substitui sem duplicar; médias e Aula07 preservadas',()=>{
    const f=createFixture(),d=issued(f);f.tabs.get('4º Bimestre').rows.push(['Ana Teste','Equipe QA',8,'=SUM(C2:C2)/1']);
    const old=f.dispatch(finalInput(d.input)),next=issued(f);
    next.outputs.filter(o=>next.challenge.cases.find(c=>c.id===o.id).slot===1).forEach(o=>{o.value=null;});
    const r=f.dispatch(finalInput(next.input));assert.notEqual(r.receipt.receiptId,old.receipt.receiptId);
    assert.equal(f.grade().length,5);assert.equal(f.audit().length,5);assert.equal(f.grade()[1][2],8);
    assert.equal(f.grade()[1][4],'=SUM(C2:D2)/2');assert.equal(f.grade()[1][3],7.5);
    assert.deepEqual(f.grade()[0],['Aluno','Equipe','Aula 07','Aula 08','Média']);
  });
  test('desafio expirado, token adulterado e replay recusados sem novas linhas',()=>{
    const f=createFixture(),d=issued(f);
    assert.throws(()=>f.dispatch({...d.input,challengeToken:'0'.repeat(64)}),/Assinatura/);
    f.advance(600001);assert.throws(()=>f.dispatch(finalInput(d.input)),/expirado/);assert.equal(f.audit().length,1);
    const fresh=issued(f);f.dispatch(finalInput(fresh.input));assert.throws(()=>f.dispatch(finalInput(fresh.input)),/utilizado/);
    assert.equal(f.audit().length,5);
  });
  test('mudanças em pacote/fontes/slots/equipe/membros/evidência invalidam o vínculo',()=>{
    const f=createFixture(),d=issued(f);
    for(const mutate of [x=>x.packageSha256='c'.repeat(64),x=>x.sourceHashes['src/equipe.mjs']='d'.repeat(64),
      x=>x.team='Outra equipe',x=>x.members[0].name='Nome Diferente',x=>x.evidence.aiLog=[],
      x=>{x.slots=[1];x.members=x.members.slice(0,1);for(const k of Object.keys(x.sourceHashes))if(/aluno[234]/.test(k))delete x.sourceHashes[k];}]){
      const altered=clone(d.input);mutate(altered);assert.throws(()=>f.dispatch(altered),/diferentes/);}
    assert.equal(f.audit().length,1);
  });
  test('outputs de outro desafio, faltantes, duplicados e campos extras recusados',()=>{
    const f=createFixture(),d=issued(f),other=issued(f);
    assert.throws(()=>f.dispatch({...d.input,outputs:d.outputs.slice(1)}),/incompletos/);
    assert.throws(()=>f.dispatch({...d.input,outputs:d.outputs.map((x,i)=>i===0?d.outputs[1]:x)}),/duplicado/);
    const extra=clone(d.outputs);extra[0].grade=10;
    assert.throws(()=>f.dispatch({...d.input,outputs:extra}),/não previsto/);
    // IDs de casos incluem prefixo variável do desafio; copiar respostas de outro pacote/desafio é recusado.
    assert.throws(()=>f.dispatch({...d.input,outputs:other.outputs}),/desconhecido/);
    assert.throws(()=>f.dispatch({...d.input,grade:10}),/não previsto/);
  });
  test('schema/atividade, >4 slots, nomes fórmula e paths fora allowlist são recusados',()=>{
    const f=createFixture(),base={...makeBinding(),action:'challenge'};
    for(const change of [{schema:'outro'},{activity:'PPI-AULA08'}, {slots:[1,2,3,4,5]},
      {members:[{name:'=IMPORT(A1)'},...base.members.slice(1)]},
      {sourceHashes:{...base.sourceHashes,'.env':'a'.repeat(64)}}])assert.throws(()=>f.dispatch({...base,...change}));
    assert.equal(f.audit().length,1);
  });
  test('conflito de equipe valida todos antes de iniciar qualquer escrita',()=>{
    const f=createFixture(),d=issued(f);f.tabs.get('4º Bimestre').rows.push(['Daniel Teste','Outra Equipe',8,'=SUM(C2:C2)/1']);
    const before=clone(f.grade());assert.throws(()=>f.dispatch(finalInput(d.input)),/Conflito/);
    assert.deepEqual(f.grade(),before);assert.equal(f.audit().length,1);
  });
  test('falha de escrita nunca confirma; reserva persistente bloqueia replay',()=>{
    const f=createFixture(),d=issued(f);f.tabs.get('Auditoria').failOnWrite=true;
    const r=f.post(finalInput(d.input));assert.equal(r.ok,false);assert.match(r.error,/Nenhuma entrega confirmada/);
    assert.ok(!r.receipt);assert.equal(f.metrics().acquired,f.metrics().released);
    f.tabs.get('Auditoria').failOnWrite=false;assert.throws(()=>f.dispatch(finalInput(d.input)),/utilizado/);
    const key='MOBILE_A08_CHALLENGE_'+d.challenge.challengeId;assert.equal(JSON.parse(f.props[key]).status,'write_failed');
  });
  test('flush falho após escrita parcial não emite recibo nem confirmação',()=>{
    const f=createFixture({failFlush:true}),d=issued(f),r=f.post(finalInput(d.input));
    assert.equal(r.ok,false);assert.ok(!r.receipt);assert.equal(f.grade().length,5);assert.equal(f.audit().length,5);
  });
  test('reenvio concorrente/reentrante bloqueado por LockService; exatamente um recibo',()=>{
    const f=createFixture(),d=issued(f);let competitor;
    f.tabs.get('Auditoria').writeHook=()=>{competitor=f.post(finalInput(d.input),'second-request');};
    const r=f.post(finalInput(d.input),'first-request');assert.equal(r.ok,true);assert.equal(competitor.ok,false);
    assert.match(competitor.error,/Lock ocupado/);assert.equal(f.audit().length,5);assert.equal(f.metrics().flush,1);
  });
  test('rate limits por pacote e por desafio não escrevem planilha',()=>{
    const f=createFixture();for(let i=0;i<5;i++)issued(f);
    assert.throws(()=>issued(f),/Muitas tentativas/);f.advance(600001);const d=issued(f);
    for(let i=0;i<8;i++)f.dispatch(d.input);assert.throws(()=>f.dispatch(d.input),/Limite de verificações/);
    assert.equal(f.audit().length,1);
  });
  test('body bytes/profundidade/resultado grande recebem erro sem segredo',()=>{
    const f=createFixture(),d=issued(f);assert.throws(()=>f.dispatch('x'.repeat(131073)),/muito grande/);
    assert.throws(()=>f.dispatch(JSON.stringify({...d.input,localResult:'á'.repeat(70000)})),/muito grande/);
    const big=clone(d.outputs);big[0].value='x'.repeat(20001);assert.throws(()=>f.dispatch({...d.input,outputs:big}),/limite/);
    const deep=clone(d.outputs);deep[0].value=Array.from({length:20}).reduce(x=>({x}),{});
    assert.throws(()=>f.dispatch({...d.input,outputs:deep}),/profundidade/);
  });
  test('doPost usa canal da ação, requestNonce e flag de recebimento sem afetar A07',()=>{
    const f=createFixture(),input={...makeBinding(),action:'challenge'};f.props.MOBILE_WEB_SUBMISSIONS_ENABLED='false';
    const blocked=f.post(input,'n1');assert.equal(blocked.ok,false);assert.equal(blocked.channel,'mobile-aula08-challenge');
    assert.equal(blocked.requestNonce,'n1');f.props.MOBILE_WEB_SUBMISSIONS_ENABLED='true';
    const challenge=f.post(input,'n2');assert.equal(challenge.ok,true);assert.equal(challenge.requestNonce,'n2');
    assert.notEqual(challenge.nonce,'n2');assert.equal(f.audit().length,1);
    const old={activity:'MOBILE-AULA07-2026',schema:'mobile-a07-v1',pdfSha256:'a'.repeat(64),
      snapshot:{schema:'mobile-a07-v1',project:'memorias',team:'Equipe QA',date:'2026-10-27',members:[{name:'QA Antigo',contribution:''}],choice:{}}};
    assert.equal(f.post(old,'n3').channel,'mobile-entrega-aula07');assert.equal(f.audit().length,2);
  });
  test('equipe pode ter número de participantes diferente dos arquivos de tarefa, sem vincular nomes a slots',()=>{
    const f=createFixture(),binding=makeBinding([1,2,3,4]);
    binding.members=[{name:'Ana Teste'},{name:'Bruno Teste'},{name:'Carla Teste'}];
    const d=issued(f,{binding});assert.equal(d.challenge.slots.length,4);
    const result=f.dispatch(finalInput(d.input));
    assert.equal(result.evaluation.total,10);
    assert.equal(result.receipt.members.length,3);
    assert.deepEqual(f.grade().slice(1).map(row=>row[3]),[10,10,10]);
    assert.equal(f.audit().length,4);
  });
  test('recibo de outra atividade recusado; bytes de dados não viram scripts no HTML',()=>{
    const f=createFixture(),d=issued(f),r=f.dispatch(finalInput(d.input)).receipt;
    assert.throws(()=>f.dispatch({action:'validateReceipt',activity:d.binding.activity,schema:d.binding.schema,
      receipt:{...r,activity:'MOBILE-AULA07-2026'}}),/outra atividade/);
    const html=f.scope.doPost({parameter:{nonce:'</script><script>alert(1)</script>',payload:JSON.stringify({...makeBinding([1]),action:'challenge'})}}).content;
    assert.ok(!html.includes('</script><script>'));assert.match(html,/\\u003c/);
  });
}
