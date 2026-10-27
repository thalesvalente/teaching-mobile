import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,rm,writeFile,readFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {TEAM_CASES,individualCases,scorePublic} from '../lessons/aula-08-av1-incremento-1/projeto/src/avaliacao-local.mjs';
import {evaluateProject,runSource,parseSlots} from '../lessons/aula-08-av1-incremento-1/projeto/scripts/avaliar.mjs';
import {preflight,collectEvidence} from '../lessons/aula-08-av1-incremento-1/projeto/scripts/preflight.mjs';
const project=fileURLToPath(new URL('../lessons/aula-08-av1-incremento-1/projeto/',import.meta.url));
const output=cases=>cases.map(c=>({id:c.id,ok:true,value:c.expected,unchanged:true}));
const fullEvidence={preflight:{ok:true,filesReady:true},aiLog:[{mission:'M2',request:'Fixture sintética',suggestion:'Conferir',humanChange:'Ajustar',test:'Teste'}]};
async function fixture(t){const root=await mkdtemp(path.join(os.tmpdir(),'a08-local-'));await cp(project,root,{recursive:true});t.after(()=>rm(root,{recursive:true,force:true}));return root;}
test('20 critérios por slot, zero e máximo sem arredondamento indevido',()=>{
  const zero=scorePublic({evidence:{},packageValid:false,hashesValid:false,mappingValid:false});
  assert.equal(zero.grade,0);assert.deepEqual(Object.values(zero.perSlot),[0,0,0,0]);
  const individualOutputs=Object.fromEntries([1,2,3,4].map(s=>[s,output(individualCases(s))]));
  const max=scorePublic({teamOutputs:output(TEAM_CASES),individualOutputs,evidence:fullEvidence});
  assert.equal(max.criteria.length,35);assert.equal(max.shared,7.5);assert.equal(max.grade,10);assert.deepEqual(Object.values(max.perSlot),[10,10,10,10]);
});
test('M2 preservação exige entrada inalterada mesmo com saída correta',()=>{
  const rows=output(TEAM_CASES).map(o=>o.id==='t5'?{...o,unchanged:false}:o);
  const result=scorePublic({teamOutputs:rows,evidence:fullEvidence,slots:[1]});
  assert.equal(result.criteria.find(c=>c.id==='M2-3').passed,false);
});
test('starter tem pendências reais, notas por slot e log de IA vazio',async()=>{
  const result=await evaluateProject(project);assert.ok(result.grade>0&&result.grade<10);assert.equal(Object.keys(result.perSlot).length,4);
  assert.equal(result.criteria.find(c=>c.id==='M1-4').passed,false);assert.equal(result.evidence.aiLog.length,0);
});
test('preflight valida Node e presença das cinco fontes',async t=>{
  assert.equal((await preflight(project)).ok,true);const root=await fixture(t);await rm(path.join(root,'src/individual/aluno4.mjs'));assert.equal((await preflight(root)).ok,false);
});
test('evidência não inventa uso de IA e recusa campos pessoais',async t=>{
  const root=await fixture(t);assert.deepEqual((await collectEvidence(root)).aiLog,[]);await writeFile(path.join(root,'src/evidencias.json'),JSON.stringify({aiLog:[],name:'Dado pessoal'}));await assert.rejects(collectEvidence(root),/somente aiLog/);
});
test('worker termina loop infinito de fonte local',async t=>{
  const root=await fixture(t);await writeFile(path.join(root,'src/equipe.mjs'),'export function resolver(){while(true){}}');
  const result=await runSource(root,'src/equipe.mjs',[TEAM_CASES[0]],150);assert.equal(result[0].error,'TIMEOUT');
});
test('worker registra erro de sintaxe e saída fora de JSON',async t=>{
  const root=await fixture(t);await writeFile(path.join(root,'src/equipe.mjs'),'export function resolver( {');assert.equal((await runSource(root,'src/equipe.mjs',[TEAM_CASES[0]]))[0].ok,false);
  await writeFile(path.join(root,'src/equipe.mjs'),'export function resolver(){return undefined}');assert.equal((await runSource(root,'src/equipe.mjs',[TEAM_CASES[0]]))[0].ok,false);
});
test('slots rejeitam zero, extras e duplicatas',()=>{
  assert.deepEqual(parseSlots(['--slots=1,3']),[1,3]);for(const x of ['','0','1,1','1,2,3,4,5','2,1','5'])assert.throws(()=>parseSlots([`--slots=${x}`]));assert.throws(()=>parseSlots(['--name=Aluno']));
});
test('servidor local atende app e não serve arquivos arbitrários',async t=>{
  const child=spawn(process.execPath,['scripts/web.mjs'],{cwd:project,env:{...process.env,PORT:'18988'},stdio:['ignore','pipe','pipe']});t.after(()=>child.kill());
  await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('servidor não iniciou')),5000);child.stdout.once('data',()=>{clearTimeout(timeout);resolve();});child.once('error',reject);});
  const page=await fetch('http://127.0.0.1:18988/');assert.equal(page.status,200);assert.match(await page.text(),/Atividades da escola/);
  assert.equal((await fetch('http://127.0.0.1:18988/src/evidencias.json')).status,404);assert.equal((await fetch('http://127.0.0.1:18988/.env')).status,404);
});
