import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectIdentity} from '../lessons/aula-08-av1-incremento-1/identity.js';
const inspect=(team,names=[])=>inspectIdentity(team,[...names,...Array(4-names.length).fill('')]);
test('F08 specific feedback for blank team and absent participant',()=>{
 const r=inspect('');assert.match(r.errors.team,/equipe/);assert.match(r.errors['member-1'],/participante/);
});
test('F08 short/invalid/formula/too-long names identify their fields',()=>{
 for(const [name,pattern] of [['A',/três/],['=SUM(A1)',/fórmula/],['QA\nNome',/inválido/],['A'.repeat(81),/80/],['123',/letras/]]){
  assert.match(inspect('Equipe',[name]).errors['member-1'],pattern);
 }
 assert.match(inspect('@Equipe',['Ana Teste']).errors.team,/fórmula/);
 assert.match(inspect('A'.repeat(81),['Ana Teste']).errors.team,/80/);
});
test('F08 duplicate detection matches server normalization incl whitespace and accents',()=>{
 const r=inspect('Equipe',['Ana Sá','  ANA   SA  ']);
 assert.match(r.errors['member-1'],/repetido/);assert.match(r.errors['member-2'],/repetido/);
});
test('F08 normal names produce only team and participant names, never a slot',()=>{
 const r=inspect(' Equipe ',["Ana D'Avila",'João Silva']);
 assert.deepEqual(r.errors,{});assert.equal(r.team,'Equipe');
 assert.ok(r.members.every(x=>Object.keys(x).join()==='name'));
});
