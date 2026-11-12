/** C3 independently selected adversarial scenarios against the exact v4 backend.
 * Uses C2's in-memory Google service adapter only. This is NOT connected QA.
 */
'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createFixture}=require('./mobile-aula08-v4-fixture.cjs');
const clone=x=>JSON.parse(JSON.stringify(x));

test('C3: Google date adapter honors compact receipt pattern and Fortaleza timezone',()=>{
  const f=createFixture(),date=new Date('2026-11-12T01:02:03Z');
  assert.equal(f.scope.Utilities.formatDate(date,'UTC','yyyyMMdd-HHmmss'),'20261112-010203');
  assert.equal(f.scope.Utilities.formatDate(date,'America/Fortaleza','yyyy-MM-dd HH:mm:ss'),'2026-11-11 22:02:03');
  const receipt=f.post(f.payload(),'c3-date-receipt-001');assert.equal(receipt.ok,true);
  assert.match(receipt.receiptId,/^MOB-\d{8}-\d{6}-[a-f0-9]{64}$/);
});

test('C3: reordered members either commit consistently or fail before any new write',()=>{
  const f=createFixture();
  const first=f.post(f.payload(0,['00000000.ITA0001','00000000.ITA0002']),'c3-original-request-001');
  assert.equal(first.ok,true,JSON.stringify(first));
  const writes=f.calls.writes.length;
  const next=f.payload(5,['00000000.ITA0002','00000000.ITA0001']);
  const reply=f.post(next,'c3-reordered-request-002');
  if(reply.ok)assert.equal(f.post({...next,operation:'reconcileTeam'},'c3-reordered-request-002').ok,true);
  else assert.equal(f.calls.writes.length,writes,'Rejected member order must not poison the audit with a partial logical transaction');
});

test('C3: updated roster name cannot create an irreconcilable submission',()=>{
  const f=createFixture();assert.equal(f.post(f.payload(),'c3-name-initial-001').ok,true);
  f.tabs.Alunos.rows[1][1]='Pessoa Sintética Atualizada';
  f.tabs.Alunos.rows[1][2]=f.api.webNormalized(f.tabs.Alunos.rows[1][1]);
  const next=f.payload(5),writes=f.calls.writes.length;
  const reply=f.post(next,'c3-name-updated-002');
  if(reply.ok)assert.equal(f.post({...next,operation:'reconcileTeam'},'c3-name-updated-002').ok,true);
  else assert.equal(f.calls.writes.length,writes,'Identity change must be rejected before writing, not after audit commit');
});

test('C3: incomplete teacher projection cannot replay as successfully validated',()=>{
  const f=createFixture(),r=f.post(f.payload(100),'c3-teacher-partial-001');assert.equal(r.ok,true);
  f.fail('partial');assert.throws(()=>f.review(r.receiptId,20));f.fail('');
  let replay,error;try{replay=f.review(r.receiptId,20);}catch(e){error=e;}
  if(!error){
    assert.equal(replay.status,'VALIDADO');
    assert.equal(f.tabs.Resultados.rows[1]?.[2],10,'Successful review replay requires materialized, verified Resultados');
    assert.equal(f.tabs['4º Bimestre'].rows[1]?.[3],10,'Successful review replay requires materialized, verified bulletin');
  }
});

test('C3: PROD cannot receive with absent homologation reference even if enabled flags are set',()=>{
  const f=createFixture({mode:'PROD'});
  delete f.props.MOBILE_NOTAS_PROD_QA_HOMOLOGATION_REF;
  const lookup=f.lookup();assert.equal(lookup.ok,false,'Production must check all required readiness gates on each request');
  assert.equal(f.calls.writes.length,0);
});

test('C3: each signed audit field detects tampering on reconciliation',()=>{
  const first=createFixture(),p=first.payload(100),r=first.post(p,'c3-all-fields-001');assert.equal(r.ok,true);
  for(let col=0;col<first.api.AU_HEADERS.length;col++){
    const f=createFixture(),payload=f.payload(100);assert.equal(f.post(payload,'c3-all-fields-001').ok,true);
    const old=f.tabs.Auditoria.rows[1][col];
    f.tabs.Auditoria.rows[1][col]=typeof old==='boolean'?!old:typeof old==='number'?old+1:String(old)+'tampered';
    const response=f.post({...payload,operation:'reconcileTeam'},'c3-all-fields-001');
    assert.equal(response.ok,false,'Tampering undetected at audit column '+col);
    assert.equal(f.calls.writes.length,1);
  }
});

test('C3: HTTP never exposes privileged reviewer or configuration actions',()=>{
  for(const operation of ['validarEntregaDocenteMobile','notasCommit_','ativarProducaoMobile','prepararAmbienteQAMobile','notasSecret','notasSign']){
    const f=createFixture(),before=clone(f.props);
    const r=f.post({operation,environment:'QA',spec:{decision:'VALIDADO'}},'c3-privileged-001');
    assert.equal(r.ok,false);assert.deepEqual(f.props,before);assert.equal(f.calls.writes.length,0);
  }
});

test('C3: forged confirmation cannot change authoritative identity',()=>{
  const f=createFixture(),p=f.payload();
  p.identity.members[0].confirmationToken='v2.'+'0'.repeat(64);
  const r=f.post(p,'c3-forged-roster-001');assert.equal(r.ok,false);assert.equal(f.calls.writes.length,0);
  assert.equal(r.name,undefined);assert.equal(r.members,undefined);
});

test('C3: text that resembles a formula is never executed as a spreadsheet formula',()=>{
  const f=createFixture(),p=f.payload(100);p.evidence.observacao='=IMPORTXML("https://example.invalid","x")';
  const r=f.post(p,'c3-formula-string-001');assert.equal(r.ok,true,JSON.stringify(r));
  const cells=f.calls.writes.flatMap(w=>w.requests.flatMap(r=>r.updateCells?.rows.flatMap(row=>row.values)||[]));
  assert.equal(cells.some(c=>c.userEnteredValue?.formulaValue),false,'Submission may not create formulas');
  assert.match(f.tabs.Auditoria.rows[1][14],/IMPORTXML/);
});
