import {assertRequiredTasks} from '../src/evidence-policy.mjs';
import {Worker} from 'node:worker_threads';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {TEAM_CASES,individualCases,scorePublic,CRITERIA} from '../src/avaliacao-local.mjs';
import {PROJECT_ROOT,collectEvidence,readAllowed} from './preflight.mjs';
export function parseSlots(argv = []) {
  const option = argv.find(a=>a.startsWith('--slots='));
  if (argv.some(a=>!a.startsWith('--slots=') && a!=='--strict') || argv.filter(a=>a.startsWith('--slots=')).length>1) throw new Error('Use --slots=1,2,3,4 (opcional).');
  const slots = option ? option.slice(8).split(',').map(Number) : [1,2,3,4];
  if (!slots.length || slots.length>4 || slots.some((n,i)=>!Number.isInteger(n)||n<1||n>4||(i>0&&n<=slots[i-1]))) throw new Error('Slots únicos e crescentes, entre 1 e 4.');
  assertRequiredTasks(slots);
  return slots;
}
export async function runSource(root,relative,cases,timeout=1500) {
  try { await readAllowed(root,relative); } catch { return cases.map(c=>({id:c.id,ok:false,error:'EXECUTION_ERROR'})); }
  return new Promise(resolve=>{
    let finished = false;
    const worker = new Worker(new URL('./executar-casos.mjs',import.meta.url),{workerData:{sourceUrl:pathToFileURL(path.join(root,relative)).href,cases},resourceLimits:{maxOldGenerationSizeMb:32}});
    const finish = outputs => {if (finished) return; finished=true;clearTimeout(timer);worker.terminate();resolve(outputs);};
    const failure = type => cases.map(c=>({id:c.id,ok:false,error:type}));
    const timer = setTimeout(()=>finish(failure('TIMEOUT')),timeout);
    worker.once('message',outputs=>finish(Array.isArray(outputs)?outputs:failure('EXECUTION_ERROR')));
    worker.once('error',()=>finish(failure('EXECUTION_ERROR')));
    worker.once('exit',()=>finish(failure('EXECUTION_ERROR')));
  });
}
export async function evaluateProject(root=PROJECT_ROOT,slots=[1,2,3,4]) {
  assertRequiredTasks(slots);
  const evidence=await collectEvidence(root), teamOutputs=await runSource(root,'src/equipe.mjs',TEAM_CASES), individualOutputs={};
  for (const slot of slots) individualOutputs[slot]=await runSource(root,`src/individual/aluno${slot}.mjs`,individualCases(slot));
  return {...scorePublic({teamOutputs,individualOutputs,evidence,slots}),evidence};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const slots=parseSlots(process.argv.slice(2)), result=await evaluateProject(PROJECT_ROOT,slots);
    console.log('\nAula 08 - resultado FORMATIVO; a nota oficial é calculada pelo servidor.\n');
    for (const criterion of result.criteria) console.log(`${criterion.passed?'OK      ':'PENDENTE'} ${criterion.id} - ${CRITERIA[criterion.id.replace(/^S[1-4]-/,'')]}`);
    console.log(`NOTA FORMATIVA DA EQUIPE: ${result.grade.toFixed(1)}/10 (informativa)`);
    console.log('\nCandidata: quatro tarefas e registro reflexivo. Uso oficial aguarda aceite docente.');
    console.log('Você pode editar, testar e tentar novamente sem penalidade.');
    if (process.argv.includes('--strict') && result.criteria.some(c=>!c.passed)) process.exitCode=1;
  } catch (error) {console.error(`Não foi possível avaliar: ${error.message}`);process.exitCode=1;}
}
