/** Avaliação local formativa do MESMO TSX da bancada. Sem segredos ou receptor. */
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {Worker} from 'node:worker_threads';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const lab=resolve(root,'..');
const source=await readFile(resolve(lab,'shared/ProjetoUniversal.tsx'),'utf8');
const result=await new Promise((resolveResult,reject)=>{
 const worker=new Worker(new URL('./avaliar-worker.cjs',import.meta.url),{
  workerData:{lab,source},env:{},resourceLimits:{maxOldGenerationSizeMb:160,maxYoungGenerationSizeMb:32,stackSizeMb:2}
 });
 const timer=setTimeout(()=>{worker.terminate();reject(Error('Tempo de avaliação excedeu 8 segundos. Revise o código.'));},8000);
 worker.once('message',value=>{clearTimeout(timer);worker.terminate();resolveResult(value);});
 worker.once('error',error=>{clearTimeout(timer);reject(error);});
 worker.once('exit',code=>{if(code!==0){clearTimeout(timer);reject(Error('Avaliador interrompido: '+code));}});
});
if(result.error)throw Error(result.error);
const approved=result.criteria.filter(x=>x.status==='PASS').length;
const report={schema:'mobile-a08-technical-local-v4',provenance:'LOCAL_CLI_UNTRUSTED',sourceSha256:createHash('sha256').update(source).digest('hex'),criteria:result.criteria,approved,total:20,formativeXp:approved*5,technicalRubricPoints:approved*0.5,officialGrade:null,status:'PENDENTE_VALIDACAO',nativeExecution:'NOT_RUN',warning:'Relatório local alterável. Não autoriza nota oficial. O worker limita tempo/heap; não é serviço de avaliação de código hostil.'};
await mkdir(resolve(root,'entrega'),{recursive:true});
await writeFile(resolve(root,'entrega/resultado-tecnico.json'),JSON.stringify(report,null,2)+'\n');
for(const item of report.criteria)console.log(item.status+' '+item.id+' '+item.description+(item.detail?' — '+item.detail:''));
console.log(`${approved}/20 critérios; ${report.formativeXp}/100 XP formativos; rubrica técnica local ${report.technicalRubricPoints}/10; NOTA OFICIAL PENDENTE.`);
if(process.argv.includes('--strict')&&approved!==20)process.exitCode=1;
if(process.argv.includes('--expect-starter')&&approved!==0)process.exitCode=1;
