import test from 'node:test';
import assert from 'node:assert/strict';
import {assertRequiredTasks,validateAiUsage,processEvidenceComplete} from '../lessons/aula-08-av1-incremento-1/projeto/src/evidence-policy.mjs';
import {TEAM_CASES,individualCases,scorePublic} from '../lessons/aula-08-av1-incremento-1/projeto/src/avaliacao-local.mjs';
const output=cases=>cases.map(c=>({id:c.id,ok:true,value:c.expected,unchanged:true}));
test('F02 all four tasks mandatory in the local contract',()=>{
 assert.doesNotThrow(()=>assertRequiredTasks([1,2,3,4]));
 for(const tasks of [[],[1],[2,4],[1,2,3],[4,3,2,1]])assert.throws(()=>assertRequiredTasks(tasks),/quatro/);
});
test('F03 distinguishes absent, used, declared non-use and contradictory records',()=>{
 assert.equal(processEvidenceComplete({aiLog:[],aiUsage:{status:'undeclared',reflection:''}}),false);
 assert.equal(processEvidenceComplete({aiLog:[],aiUsage:{status:'not-used',reflection:'Explicação verdadeira do trabalho da equipe sem ferramenta de IA.'}}),true);
 assert.equal(processEvidenceComplete({aiLog:[{}],aiUsage:{status:'used',reflection:'Reflexão sintética de teste, não uso real de um estudante.'}}),true);
 assert.throws(()=>validateAiUsage({status:'used',reflection:'teste'},[]),/sem registro/);
 assert.throws(()=>validateAiUsage({status:'not-used',reflection:'teste'},[{}]),/contradiz/);
 assert.throws(()=>validateAiUsage({status:'not-used',reflection:'x'.repeat(401)},[]),/400/);
});
test('F03 honest non-use can receive 10 in local formative scoring',()=>{
 const r=scorePublic({teamOutputs:output(TEAM_CASES),individualOutputs:Object.fromEntries([1,2,3,4].map(s=>[s,output(individualCases(s))])),evidence:{preflight:{ok:true,filesReady:true},aiLog:[],aiUsage:{status:'not-used',reflection:'O grupo trabalhou sem IA, testou as condições e reviu os erros.'}}});
 assert.equal(r.grade,10);assert.equal(r.criteria.length,20);
});
