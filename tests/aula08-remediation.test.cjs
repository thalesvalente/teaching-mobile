'use strict';
// These tests operate only on VM/Sheets fixtures. No real Google request.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createFixture,makeBinding,issued,finalInput}=require('./mobile-entregas-aula08.test.cjs');
const clone=x=>JSON.parse(JSON.stringify(x));
const state=f=>JSON.stringify({grade:f.grade(),audit:f.audit(),props:f.props});
const rosterKey=f=>Object.keys(f.props).find(k=>k.startsWith('MOBILE_A08_ROSTER_'));
const gradeValues=f=>f.grade().slice(1).map(r=>r[3]);
function members(b,n){return {...b,members:b.members.slice(0,n)};}
function badOne(d){const c=d.challenge.cases.find(c=>c.criterion==='M3-6');d.outputs.find(o=>o.id===c.id).value={total:999,text:'incorreto'};}
function suffix(n){return String.fromCharCode(65+Math.floor(n/26))+String.fromCharCode(65+n%26);}
test('F01 ROSTER-SHRINK, ADD, REPLACE and DISJOINT are refused before any new write',()=>{
 const f=createFixture(),b=members(makeBinding(),2),d=issued(f,{binding:b});f.dispatch(finalInput(d.input));
 assert.deepEqual(gradeValues(f),[10,10]);
 for(const roster of [[b.members[0]],[...b.members,{name:'Carla Teste'}],[b.members[0],{name:'Outra Pessoa'}],[{name:'Caio Teste'},{name:'Dora Teste'}]]) {
  const before=state(f);
  assert.throws(()=>f.dispatch({...b,members:roster,action:'challenge'}),/ROSTER_CHANGED/);
  assert.equal(state(f),before,'No grade, audit or property writes on composition change');
 }
});
test('F01 reordered normalized composition can resend: all members change 10 to 9.5',()=>{
 const f=createFixture(),b=members(makeBinding(),2),first=issued(f,{binding:b});f.dispatch(finalInput(first.input));
 const next={...b,team:'  EQUIPE qa ',members:b.members.slice().reverse().map(m=>({name:' '+m.name.toUpperCase().replace(' ','  ')+' '}))};
 const d=issued(f,{binding:next});badOne(d);const res=f.dispatch(finalInput(d.input));
 assert.equal(res.receipt.evaluation.total,9.5);assert.deepEqual(gradeValues(f),[9.5,9.5]);
 assert.equal(f.grade().length,3);assert.equal(f.audit().length,3);
 assert.equal(new Set(f.audit().slice(1).map(r=>r[6])).size,1);
 assert.equal(JSON.parse(f.props[rosterKey(f)]).status,'committed');
});
test('F01 an existing inconsistent audit requires explicit reconciliation, not guessed membership',()=>{
 const f=createFixture(),b=members(makeBinding(),2),first=issued(f,{binding:b});f.dispatch(finalInput(first.input));
 delete f.props[rosterKey(f)];
 const old=JSON.parse(f.audit()[1][15]);old.members=old.members.slice(0,1);f.audit()[1][15]=JSON.stringify(old);
 const d=issued(f,{binding:b}),before=JSON.stringify([f.grade(),f.audit()]);
 assert.throws(()=>f.dispatch(finalInput(d.input)),/ROSTER_RECONCILIATION_REQUIRED/);
 assert.equal(JSON.stringify([f.grade(),f.audit()]),before);
});
test('F01 partial write/flush failure blocks another challenge and never issues a receipt',()=>{
 const f=createFixture({failFlush:true}),d=issued(f),res=f.post(finalInput(d.input));
 assert.equal(res.ok,false);assert.equal(res.receipt,undefined);
 assert.equal(JSON.parse(f.props[rosterKey(f)]).status,'write_failed');
 assert.throws(()=>f.dispatch({...d.binding,action:'challenge'}),/ROSTER_RECONCILIATION_REQUIRED/);
});
test('F02 four tasks are required independently of 1–4 participant counts',()=>{
 for(let n=1;n<=4;n++) {
  const f=createFixture(),b=members(makeBinding(),n),d=issued(f,{binding:b}),res=f.dispatch(finalInput(d.input));
  assert.equal(res.evaluation.total,10);assert.equal(f.grade().length,n+1);
  assert.ok(gradeValues(f).every(v=>v===10));
 }
 for(const slots of [[1],[1,2],[2,4],[1,2,3]]) {
  const f=createFixture(),b=makeBinding();b.slots=slots;
  assert.throws(()=>f.dispatch({...b,action:'challenge'}),/quatro/);
  assert.equal(f.grade().length,1);assert.equal(f.audit().length,1);
 }
});
test('F02 omission cannot avoid an M4 failure; no grade per person or task',()=>{
 const f=createFixture(),d=issued(f);d.outputs.find(o=>d.challenge.cases.find(c=>c.id===o.id).slot===2).value='falha';
 const r=f.dispatch(finalInput(d.input));assert.equal(r.evaluation.total,9.5);
 assert.ok(gradeValues(f).every(v=>v===9.5));assert.equal(r.evaluation.criteria.length,20);
 assert.equal(Object.hasOwn(r.evaluation,'members'),false);
});
test('F03 honest non-use and real-use reflection can each earn full credit; absent data cannot',()=>{
 for(const status of ['not-used','used','undeclared']) {
  const f=createFixture(),b=makeBinding();b.evidence.aiUsage={status,reflection:status==='undeclared'?'':'O grupo conferiu os testes e explicou as condições implementadas.'};
  if(status!=='used')b.evidence.aiLog=[];
  const d=issued(f,{binding:b}),r=f.dispatch(d.input);
  assert.equal(r.evaluation.total,status==='undeclared'?9.5:10);
 }
 const f=createFixture(),b=makeBinding();b.evidence.aiUsage.status='not-used';
 assert.throws(()=>f.dispatch({...b,action:'challenge'}),/contradiz/);
 b.evidence.aiUsage.status='used';b.evidence.aiLog=[];
 assert.throws(()=>f.dispatch({...b,action:'challenge'}),/sem registro real/);
});
test('F02/F03 proposed policy is fail-closed unless explicit approval is present in the fixture',()=>{
 const f=createFixture({policy:false}),before=state(f);
 assert.throws(()=>f.dispatch({...makeBinding(),action:'challenge'}),/DECISION_REQUIRED_F02_F03/);
 assert.equal(state(f),before);
});
test('F04 six legitimate teams with identical package hash have independent quotas',()=>{
 const f=createFixture();
 for(let i=0;i<6;i++) {
  const b=makeBinding();b.team='Equipe '+suffix(i);b.members=[{name:'Pessoa '+suffix(i)}];
  assert.equal(f.dispatch({...b,action:'challenge'}).ok,true);
 }
});
test('F04 changing package hash or team spelling does not reset the team quota',()=>{
 const f=createFixture(),b=makeBinding();
 for(let i=0;i<5;i++)f.dispatch({...b,packageSha256:String(i).repeat(64),action:'challenge'});
 assert.throws(()=>f.dispatch({...b,team:' equipe  QA ',action:'challenge'}),/Muitas tentativas/);
 f.advance(600001);assert.equal(f.dispatch({...b,action:'challenge'}).ok,true);
});
test('F04 rotating team name cannot reset the same roster quota',()=>{
 const f=createFixture(),b=makeBinding();
 for(let i=0;i<5;i++)f.dispatch({...b,team:'Nome '+suffix(i),action:'challenge'});
 assert.throws(()=>f.dispatch({...b,team:'Outro Nome',action:'challenge'}),/Muitas tentativas/);
});
test('F04 changing both name and roster still reaches a bounded global quota (not authentication)',()=>{
 const f=createFixture();
 for(let i=0;i<100;i++){
  const b=makeBinding();b.team='Equipe '+suffix(i);b.members=[{name:'Pessoa '+suffix(i)}];
  f.dispatch({...b,action:'challenge'});
 }
 const b=makeBinding();b.team='Equipe ZZ';b.members=[{name:'Pessoa ZZ'}];
 assert.throws(()=>f.dispatch({...b,action:'challenge'}),/limite global/);
});
