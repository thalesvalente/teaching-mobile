import {mkdir, writeFile, rename, lstat, realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {CONFIG,sha256,serializePackage} from '../src/contrato.mjs';
import {PROJECT_ROOT,readAllowed} from './preflight.mjs';
import {evaluateProject,parseSlots} from './avaliar.mjs';
export async function generatePackage(root=PROJECT_ROOT,slots=[1,2,3,4]) {
  parseSlots([`--slots=${slots.join(',')}`]);
  const result=await evaluateProject(root,slots);
  if (!result.evidence.preflight.ok) throw new Error('Execute npm run preflight e resolva as pendências antes de gerar o pacote.');
  const rows=[{type:'manifest',schema:CONFIG.schema,activity:CONFIG.activity,generator:CONFIG.generator,contract:CONFIG.contract,slots}];
  const paths=['src/equipe.mjs',...slots.map(n=>`src/individual/aluno${n}.mjs`)];
  for (const [i,relative] of paths.entries()) {
    const code=await readAllowed(root,relative);
    rows.push({type:'source',scope:i===0?'team':'individual',path:relative,sha256:await sha256(code),encoding:'base64',content:Buffer.from(code,'utf8').toString('base64'),...(i?{slot:slots[i-1]}:{})});
  }
  rows.push({type:'local-result',evaluator:CONFIG.evaluator,criteria:result.criteria,grade:result.grade},result.evidence);
  return serializePackage(rows);
}
export async function writeDelivery(root=PROJECT_ROOT,slots=[1,2,3,4]) {
  const text=await generatePackage(root,slots), base=await realpath(root), directory=path.join(base,'entrega');
  await mkdir(directory,{recursive:true});
  if ((await lstat(directory)).isSymbolicLink() || await realpath(directory)!==directory) throw new Error('A pasta entrega não pode ser link.');
  const output=path.join(directory,'entrega-a08.jsonl'), temporary=path.join(directory,`.entrega-${process.pid}.tmp`);
  await writeFile(temporary,text,{encoding:'utf8',flag:'wx'});
  await rename(temporary,output);
  return {output,bytes:Buffer.byteLength(text)};
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const result=await writeDelivery(PROJECT_ROOT,parseSlots(process.argv.slice(2)));
    console.log(`Pronto: entrega/entrega-a08.jsonl (${result.bytes} bytes).`);
    console.log('Importe esse arquivo na ficha da Aula 08. Preencha nomes SOMENTE na ficha.');
    console.log('Base64 é codificação; o pacote não está criptografado. Revise antes de enviar.');
  } catch (error) {console.error(`Entrega não gerada: ${error.message}`);process.exitCode=1;}
}
