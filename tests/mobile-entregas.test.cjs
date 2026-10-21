/* Contrato Mobile 2026: Code.gs + rubrica ORIGINAL em VM com Sheets simulado.
 * Sem chamadas Google reais. node --test tests/mobile-entregas.test.cjs */
'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const dir=path.join(root,'lessons','aula-07-estado-filtros');
const core=fs.readFileSync(path.join(dir,'nucleo.js'),'utf8');
const ruby=fs.readFileSync(path.join(dir,'appscript','RubricaAula07.gs'),'utf8');
const server=fs.readFileSync(path.join(dir,'appscript','Code.gs'),'utf8');
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
const blobSha=content=>crypto.createHash('sha1')
  .update('blob '+Buffer.byteLength(content)+'\0'+content).digest('hex');
const headers=['Aluno','Equipe','Atividade','Instrumento','Data/hora BRT','Recebido UTC',
  'ID entrega','SHA-256 PDF','SHA-256 respostas','Assinatura HMAC','XP / 100',
  'Nota / 10','Autoavaliação declarada / 10','Situação','Rubrica/versão',
  'Respostas JSON','Chave interna'];
function sheet(name,cols) {
  return {name,rows:[cols.slice()],failOnWrite:false,
    getName(){return this.name;},getLastRow(){return this.rows.length;},
    getLastColumn(){return this.rows[0].length;},
    insertColumnBefore(col){for(const row of this.rows)row.splice(col-1,0,'');},
    getRange(row,col,n=1,m=1){
      if(row<1||col<1||n<1||m<1)throw Error('Range inválido');
      const target=this;
      return {
        getValues(){return Array.from({length:n},(_,i)=>
          Array.from({length:m},(_,j)=>target.rows[row+i-1]?.[col+j-1]??''));},
        setValues(values){
          if(target.failOnWrite)throw Error('Escrita simulada bloqueada');
          assert.equal(values.length,n);
          for(let i=0;i<n;i++){
            assert.equal(values[i].length,m);
            while(target.rows.length<row+i)target.rows.push([]);
            for(let j=0;j<m;j++)target.rows[row+i-1][col+j-1]=values[i][j];
          }
        },setValue(v){this.setValues([[v]])},
        setFormulas(v){this.setValues(v)},setNumberFormat(){},
        sort(specs){
          const config=Array.isArray(specs)?specs:[{column:specs,ascending:true}];
          const start=row-1,segment=target.rows.slice(start,start+n);
          segment.sort((a,b)=>{
            for(const rule of config){
              const cmp=String(a[rule.column-1]||'').localeCompare(
                String(b[rule.column-1]||''),'pt-BR',{sensitivity:'base'});
              if(cmp)return rule.ascending===false?-cmp:cmp;
            }
            return 0;
          });
          target.rows.splice(start,n,...segment);
        }
      };
    }
  };
}
function fixture() {
  const tabs=new Map([
    ['1º Bimestre',sheet('1º Bimestre',['Aluno','Equipe','Média'])],
    ['2º Bimestre',sheet('2º Bimestre',['Aluno','Equipe','Média'])],
    ['3º Bimestre',sheet('3º Bimestre',['Aluno','Equipe','Média'])],
    ['4º Bimestre',sheet('4º Bimestre',['Aluno','Equipe','Aula 07','Média'])],
    ['Auditoria',sheet('Auditoria',headers)]
  ]);
  let uid=0,flush=0,acquired=0,released=0;
  const props={};
  const signed=buffer=>Array.from(buffer,x=>x>127?x-256:x);
  const scope={window:{},Date,Set,Map,JSON,Number,Math,console:{log(){}},
    Utilities:{
      DigestAlgorithm:{SHA_256:'SHA_256'},Charset:{UTF_8:'UTF_8'},
      computeDigest:(_a,txt)=>signed(crypto.createHash('sha256').update(txt).digest()),
      computeHmacSha256Signature:(txt,key)=>signed(crypto.createHmac('sha256',key).update(txt).digest()),
      getUuid:()=> '00000000-0000-4000-8000-'+String(++uid).padStart(12,'0'),
      formatDate:date=>new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Fortaleza',
        year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',
        second:'2-digit',hourCycle:'h23'}).format(date).replace(', ',' ')
    },
    SpreadsheetApp:{openById:id=>{
      assert.equal(id,'1z5VEmScYCtfsEGg0AahY3cHE5eYO79Zj0xLMzx4iT0Y');
      return {getSheetByName:name=>tabs.get(name),getName:()=> 'programacao-dispositivos-moveis-2026',
        getSheets:()=>Array.from(tabs.values())};
    },flush:()=>{flush++}},
    PropertiesService:{getScriptProperties:()=>({
      getProperty:key=>props[key]||null,setProperty:(key,value)=>{props[key]=value}
    })},
    LockService:{getScriptLock:()=>({
      waitLock:()=>{acquired++},releaseLock:()=>{released++}
    })},
    ContentService:{createTextOutput:s=>({getContent:()=>s})},
    HtmlService:{createHtmlOutput:s=>({content:s,setTitle(){return this}})}
  };
  vm.createContext(scope);
  vm.runInContext(ruby,scope,{filename:'RubricaAula07.gs'});
  vm.runInContext(server,scope,{filename:'Code.gs'});
  const original={window:{}};vm.runInNewContext(core,original,{filename:'nucleo.js'});
  const api=vm.runInContext('MobileRubricAula07',scope);
  return {scope,api,original:original.window.Aula7,props,tabs,
    submit:(members=['Ana Teste'],choices={},extra={})=>
      scope.processMobileDelivery(JSON.stringify(envelope(members,choices,extra))),
    grade:()=>tabs.get('4º Bimestre').rows,audit:()=>tabs.get('Auditoria').rows,
    find:name=>tabs.get('Auditoria').rows.find(x=>x[0]===name),
    note:name=>tabs.get('4º Bimestre').rows.find(x=>x[0]===name),
    metrics:()=>({flush,acquired,released})
  };
}
function envelope(members=['Ana Teste'],choice={},opt={}) {
  return {schema:'mobile-a07-v1',activity:opt.activity||'MOBILE-AULA07-2026',
    pdfSha256:opt.pdfSha256||'a'.repeat(64),
    snapshot:{schema:opt.snapshotSchema||'mobile-a07-v1',version:'1.1.0',
      project:opt.project||'memorias',team:opt.team===undefined?'Equipe QA':opt.team,
      date:'2026-10-21',
      members:members.map(name=>({name,contribution:''})),
      choice,reflections:['','','',''],practice:opt.practice||{},
      practiceEvidence:['','','',''],
      evidence:{nativeStatus:'pendente'},
      projectDrafts:{},scores:opt.scores||{simulator:{earned:10,xp:100}}}
  };
}
function failure(f,p,re){assert.throws(()=>f.scope.processMobileDelivery(JSON.stringify(p)),re);}
test('G0 — rubrica original espelhada literalmente e arquivos didáticos intocados',()=>{
  const match=ruby.match(/\/\* BEGIN RUBRICA ORIGINAL nucleo\.js \*\/\n([\s\S]*?)\n\/\* END RUBRICA ORIGINAL nucleo\.js \*\//);
  assert.ok(match,'delimitadores de proveniência');
  assert.equal(match[1],core.trimEnd());
  const fixed={
    'nucleo.js':'f063d9c7ee36095c39d31c742574724cadfcfc81',
    'atividade.js':'ed71c16be982fb393e31bed9e53fcb3f47b9248c',
    'pdf.js':'5b804e39f90e78f4be54fe27d77807ad199aab31',
    'projeto/src/missoes.mjs':'cb8b0cc58fb558a377a4eebb9c21baeb425c364d',
    'projeto/src/avaliacao.mjs':'e3cf8e9298750cd02259e21688d822f46d9e8d30'
  };
  for(const [name,sha]of Object.entries(fixed))assert.equal(blobSha(fs.readFileSync(path.join(dir,name))),sha,name);
  const html=fs.readFileSync(path.join(dir,'atividade.html'),'utf8')
    .replace('<button type="button" id="mobile-submit" disabled>Gerar PDF e entregar</button>','')
    .replace('<p id="mobile-delivery-status" class="rule" role="status" aria-live="polite" aria-atomic="true" style="white-space:pre-wrap;overflow-wrap:anywhere">Entrega online ainda não configurada. PDF, impressão e rascunho continuam disponíveis.</p>\n','')
    .replace('<script src="entrega-appscript.js?v=1.0.0"></script>','');
  assert.equal(blobSha(html),'afeb1ed1cd527ad28a742387a7b78654531a8f80',
    'HTML pré-existente deve ser byte-idêntico após remover apenas as adições de entrega');
});
test('G2 — 20 critérios iguais aos originais em ambas as trilhas (0, parcial, 10, erros)',()=>{
  const f=fixture();
  for(const project of ['memorias','eda']){
    const good=JSON.parse(JSON.stringify(f.api.GOOD));
    const cases=[{},good,{prioridade:'status'},
      {prioridade:'lista'},...f.api.KEYS.map(k=>({...good,[k]:''}))];
    for(const group of f.api.GROUPS)for(const [key,,options]of group.campos)
      for(const [value]of options)cases.push({...good,[key]:value});
    for(let i=0;i<cases.length;i++){
      const input=cases[i];
      const expected=JSON.parse(JSON.stringify(f.original.avaliar(input,project)));
      const actual=JSON.parse(JSON.stringify(f.api.avaliar(input,project)));
      assert.deepEqual(actual,expected,project+' case '+i);
      const grade=expected.reduce((s,x)=>s+x.pontos,0);
      const receipt=f.submit(['Ana Teste'],input,{project,scores:{simulator:{earned:999,xp:9999}}});
      assert.equal(receipt.grade,grade,project+' '+i);
      assert.equal(receipt.xp,grade*10,project+' '+i);
      assert.equal(receipt.gradeStatus,'simulador-automatico');
    }
  }
});
test('G2 — nota ausente 0, correta 10, parcial 1, erro 0, rubrica não é completude',()=>{
  const f=fixture();
  assert.equal(f.submit(['Ana Teste'],{}).grade,0);
  assert.equal(f.submit(['Ana Teste'],{prioridade:'status'}).grade,1);
  assert.equal(f.submit(['Ana Teste'],{prioridade:'lista'}).grade,0);
  assert.equal(f.submit(['Ana Teste'],f.api.GOOD).grade,10);
  assert.equal(f.note('Ana Teste')[2],10);
  assert.equal(f.audit().length,2);
});
test('G4 — dois alunos compartilham recibo e têm linhas alfabéticas',()=>{
  const f=fixture();const r=f.submit(['Zoe Teste','Ana Teste','Bruno Teste'],f.api.GOOD);
  assert.deepEqual(f.grade().slice(1).map(x=>x[0]),['Ana Teste','Bruno Teste','Zoe Teste']);
  assert.equal(f.audit().length,4);
  assert.equal(new Set(f.audit().slice(1).map(x=>x[6])).size,1);
  assert.equal(r.grade,10);
  assert.deepEqual(f.grade().slice(1).map(x=>x[2]),[10,10,10]);
});
test('G4 — reenvio substitui nota e recibo, preserva demais atividades',()=>{
  const f=fixture();
  f.tabs.get('4º Bimestre').rows[0]=['Aluno','Equipe','Aula 07','Aula 08 TESTE','Média'];
  f.tabs.get('4º Bimestre').rows.push(['Ana Teste','Equipe QA',8,7,'=SUM(C2:D2)/2']);
  f.tabs.get('4º Bimestre').rows.push(['Bruno Teste','Equipe QA',0,5,'=SUM(C3:D3)/2']);
  const a=f.submit(['Ana Teste','Bruno Teste'],f.api.GOOD);
  const old=f.find('Ana Teste')[6];
  assert.equal(a.grade,10);
  const b=f.submit(['Ana Teste','Bruno Teste'],{prioridade:'status'});
  assert.equal(b.grade,1);
  assert.notEqual(b.receiptId,old);
  assert.equal(f.audit().length,3);
  assert.deepEqual(f.grade().slice(1).map(x=>x[2]),[1,1]);
  assert.deepEqual(f.grade().slice(1).map(x=>x[3]),[7,5]);
  assert.equal(f.grade()[1][4],'=SUM(C2:D2)/2');
  assert.equal(f.grade()[2][4],'=SUM(C3:D3)/2');
});
test('G4 — rubricagem independente da declaração de prática',()=>{
  const f=fixture(),practice=Object.fromEntries(Array.from({length:20},(_,i)=>[i+1,true]));
  const out=f.submit(['Ana Teste'],{}, {practice});
  assert.equal(out.grade,0);
  assert.equal(f.find('Ana Teste')[11],0);
  assert.equal(f.find('Ana Teste')[12],10);
  assert.match(f.find('Ana Teste')[13],/prática declarada separada/);
  assert.equal(f.find('Ana Teste')[3],'simulador-html');
});
test('G4 — HMAC assina nota recalculada, PDF, respostas, instrumento e integrantes',()=>{
  const f=fixture(),r=f.submit(['Ana Teste','Bruno Teste'],{prioridade:'status'});
  const txt=JSON.stringify([r.receiptId,r.receivedAt,'MOBILE-AULA07-2026','simulador-html',
    r.pdfSha256,r.answersSha256,['ana teste','bruno teste'],r.xp,r.grade,
    'mobile-a07-simulador-1.1.0']);
  assert.equal(r.signature,crypto.createHmac('sha256',f.props.MOBILE_RECEIPT_HMAC_SECRET)
    .update(txt).digest('hex'));
  assert.equal(digest(f.find('Ana Teste')[15]),r.answersSha256);
  assert.notEqual(r.signature,crypto.createHmac('sha256',f.props.MOBILE_RECEIPT_HMAC_SECRET)
    .update(txt+'alterado').digest('hex'));
  assert.equal(f.find('Ana Teste')[7],'a'.repeat(64));
  assert.ok(!JSON.stringify(r).includes(f.props.MOBILE_RECEIPT_HMAC_SECRET));
});
test('G4 — novos alunos, média simples, zero nas outras atividades',()=>{
  const f=fixture();const grid=f.tabs.get('4º Bimestre');
  const info=f.scope.mobileColumn(grid,{column:'Aula EXTRA QA'});
  assert.equal(info.col,4);assert.equal(info.media,5);
  f.submit(['Ana Teste'],{prioridade:'status'});
  assert.equal(f.note('Ana Teste')[2],1);
  assert.equal(f.note('Ana Teste')[3],0);
  assert.equal(f.note('Ana Teste')[4],'=SUM(C2:D2)/2');
});
test('G4 — atividade desconhecida, schema e PDF hash adulterados não são aceitos',()=>{
  const f=fixture();
  failure(f,envelope(['Ana Teste'],{}, {activity:'MOBILE-AULA08-2026'}),/não habilitada/);
  failure(f,envelope(['Ana Teste'],{}, {snapshotSchema:'falso'}),/incompatível/);
  failure(f,envelope(['Ana Teste'],{}, {pdfSha256:'abc'}),/SHA-256/);
  assert.equal(f.audit().length,1);
});
test('G4 — alternativas inválidas e campos forjados recusados',()=>{
  const f=fixture();
  failure(f,envelope(['Ana Teste'],{prioridade:'inventado'}),/Alternativa inválida/);
  failure(f,envelope(['Ana Teste'],{evil:'x'}),/Escolha desconhecida/);
  assert.equal(f.audit().length,1);
});
test('G4 — equipes, nomes duplicados e fórmulas protegidos',()=>{
  const f=fixture();
  failure(f,envelope(['Ana Teste','Ána Teste']),/duplicado/);
  failure(f,envelope(['=IMPORT(A1)']),/Nome de estudante inválido/);
  f.submit(['Ana Teste'],{}, {team:'=SUM(A1:B2)'});
  assert.equal(f.note('Ana Teste')[1],"'=SUM(A1:B2)");
  failure(f,envelope(['Ana Teste'],{}, {team:'Outra Equipe'}),/Conflito/);
});
test('G4 — limite de payload e auditoria vazia antes de escrever',()=>{
  const f=fixture();
  assert.throws(()=>f.scope.processMobileDelivery('x'.repeat(220001)),/muito grande/);
  f.tabs.get('Auditoria').rows[0][3]='Instrumento diferente';
  assert.throws(()=>f.submit(),/Cabeçalhos incompatíveis/);
  assert.equal(f.audit().length,1);
});
test('G4 — lock liberado inclusive em falhas de escrita',()=>{
  const f=fixture();
  f.submit();
  f.tabs.get('Auditoria').failOnWrite=true;
  assert.throws(()=>f.submit(),/Escrita simulada bloqueada/);
  assert.equal(f.metrics().acquired,f.metrics().released);
});
test('G6 — GET sanitário e POST bloqueado até autorização explícita',()=>{
  const f=fixture();
  assert.match(f.scope.doGet().getContent(),/mobile-entregas-1.0.0/);
  const req={parameter:{nonce:'abc',payload:JSON.stringify(envelope())}};
  const blocked=f.scope.doPost(req);
  assert.match(blocked.content,/"ok":false/);
  assert.match(blocked.content,/Mobile ainda não habilitado/);
  assert.equal(f.audit().length,1);
  f.props.MOBILE_WEB_SUBMISSIONS_ENABLED='true';
  const allowed=f.scope.doPost(req);
  assert.match(allowed.content,/"ok":true/);
  assert.match(allowed.content,/"grade":0/);
  assert.equal(f.audit().length,2);
});
test('G1 — somente cinco abas e ID independente da PPI I',()=>{
  const f=fixture();f.scope.testarConexaoMobile();
  assert.equal(f.tabs.size,5);
  assert.equal(f.tabs.get('1º Bimestre').rows.length,1);
  assert.equal(f.tabs.get('2º Bimestre').rows.length,1);
  assert.equal(f.tabs.get('3º Bimestre').rows.length,1);
  assert.ok(!server.includes('1aziGb9eXl5oR6Wz6dDWI7IH9bsINf9Sp7b6nmlT9XqE'));
});
