import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,rm,writeFile,symlink,readFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {canonical,sha256,parsePackage,serializePackage,CONFIG} from '../lessons/aula-08-av1-incremento-1/projeto/src/contrato.mjs';
import {generatePackage,writeDelivery} from '../lessons/aula-08-av1-incremento-1/projeto/scripts/gerar-entrega.mjs';
const project=fileURLToPath(new URL('../lessons/aula-08-av1-incremento-1/projeto/',import.meta.url));
const baseline=await generatePackage(project);
const rows=()=>baseline.trimEnd().split('\n').map(JSON.parse);
async function seal(objects){const body=objects.slice(0,-1).map(canonical).join('\n')+'\n';objects[objects.length-1]={type:'end',lineCount:objects.length,packageSha256:await sha256(body)};return body+canonical(objects.at(-1))+'\n';}
async function fixture(t){const root=await mkdtemp(path.join(os.tmpdir(),'a08-jsonl-'));await cp(project,root,{recursive:true});t.after(()=>rm(root,{recursive:true,force:true}));return root;}
test('geração é determinística byte a byte com quatro slots',async()=>{
  assert.equal(await generatePackage(project),baseline);const p=await parsePackage(baseline);assert.equal(p.sources.length,5);assert.deepEqual(p.manifest.slots,[1,2,3,4]);assert.equal(p.lineCount,9);
});
test('SHA de fonte e pacote coincide com implementação independente Node',async()=>{
  const p=await parsePackage(baseline);for(const s of p.sources)assert.equal(s.sha256,createHash('sha256').update(s.code).digest('hex'));
  const body=baseline.split('\n').slice(0,-2).join('\n')+'\n';assert.equal(p.packageSha256,createHash('sha256').update(body).digest('hex'));
});
test('1 a 4 slots selecionados produzem somente as fontes autorizadas',async()=>{
  const p=await parsePackage(await generatePackage(project,[2,4]));assert.deepEqual(p.sources.map(s=>s.path),['src/equipe.mjs','src/individual/aluno2.mjs','src/individual/aluno4.mjs']);
});
test('Base64 adulterado sem atualizar hash é recusado',async()=>{
  const r=rows();r[1].content=Buffer.from('export function resolver(){return 10}').toString('base64');await assert.rejects(parsePackage(await seal(r)),/hash incoerente/);
});
test('hash de fonte atualizado sem package hash novo é recusado',async()=>{
  const r=rows(),code='export function resolver(){return null}';r[1].content=Buffer.from(code).toString('base64');r[1].sha256=await sha256(code);await assert.rejects(parsePackage(r.map(canonical).join('\n')+'\n'),/hash do pacote/);
});
test('package hash fabricado é recusado',async()=>{const r=rows();r.at(-1).packageSha256='f'.repeat(64);await assert.rejects(parsePackage(r.map(canonical).join('\n')+'\n'),/hash do pacote/);});
test('linha end ausente, fonte duplicada e arquivo fora de allowlist são recusados',async()=>{
  const r=rows();await assert.rejects(parsePackage(r.slice(0,-1).map(canonical).join('\n')+'\n'));
  const duplicate=rows();duplicate[2]=duplicate[1];await assert.rejects(parsePackage(await seal(duplicate)),/source/);
  const extra=rows();extra[1].path='.env';await assert.rejects(parsePackage(await seal(extra)),/allowlist/);
});
test('schema, atividade, tipos desconhecidos e campos extras são recusados',async()=>{
  for(const [index,key,value] of [[0,'activity','PPI'],[0,'schema','other'],[0,'type','unknown'],[1,'token','x']]){const r=rows();r[index][key]=value;await assert.rejects(parsePackage(await seal(r)));}
});
test('mais de quatro slots, duplicação e ordem inválida são recusados',async()=>{
  for(const slots of [[1,2,3,4,5],[1,1],[4,3],[0]]){const r=rows();r[0].slots=slots;await assert.rejects(parsePackage(await seal(r)),/slots/);}
});
test('conteúdo ausente, fonte grande e pacote grande são recusados',async()=>{
  const r=rows();r[1].content='';await assert.rejects(parsePackage(await seal(r)),/Base64/);
  const large=rows();large[1].content=Buffer.from('x'.repeat(CONFIG.maxSourceBytes+1)).toString('base64');await assert.rejects(parsePackage(await seal(large)),/16 KiB|grande/);
  await assert.rejects(parsePackage('x'.repeat(CONFIG.maxBytes+1)),/128 KiB/);
});
test('UTF-8 inválido, Base64 não canônico e chaves JSON duplicadas são recusados',async()=>{
  await assert.rejects(parsePackage(new Uint8Array([0xc0,0xaf])),/UTF-8/);
  await assert.rejects(parsePackage(Buffer.from('\ufeff'+baseline)),/canônico/);
  const r=rows();r[1].content='Zh==';await assert.rejects(parsePackage(await seal(r)),/Base64/);
  const first=baseline.indexOf('\n');await assert.rejects(parsePackage(baseline.slice(0,first-1)+',"type":"manifest"}'+baseline.slice(first)),/canônica/);
});
test('resultado local pode ser editado, mas é declarado informativo e não muda fontes',async()=>{
  const r=rows();r[r.length-3].grade=10;r[r.length-3].criteria=r[r.length-3].criteria.map(c=>({...c,passed:true}));const p=await parsePackage(await seal(r));assert.equal(p.localResult.grade,10);assert.deepEqual(p.sourceHashes,(await parsePackage(baseline)).sourceHashes);
});
test('identidade não é exportada; campos pessoais e padrões de segredo são recusados',async t=>{
  assert.doesNotMatch(baseline,/"(?:name|member|team|email)"\s*:/);const root=await fixture(t);await writeFile(path.join(root,'src/evidencias.json'),JSON.stringify({aiLog:[{mission:'M1',request:'pessoa@example.test',suggestion:'x',humanChange:'x',test:'x'}]}));await assert.rejects(generatePackage(root),/pessoal/);
});
test('arquivos ausentes, symlinks e fontes grandes impedem gerar entrega',async t=>{
  const root=await fixture(t);await rm(path.join(root,'src/equipe.mjs'));await assert.rejects(generatePackage(root),/preflight/);
  await symlink(path.join(project,'src/equipe.mjs'),path.join(root,'src/equipe.mjs'));await assert.rejects(generatePackage(root),/preflight/);
  await rm(path.join(root,'src/equipe.mjs'));await writeFile(path.join(root,'src/equipe.mjs'),'x'.repeat(16385));await assert.rejects(generatePackage(root),/preflight/);
});
test('entrega salva atomicamente e reenvio substitui os mesmos bytes',async t=>{
  const root=await fixture(t);const first=await writeDelivery(root);const before=await readFile(first.output);await writeDelivery(root);assert.deepEqual(await readFile(first.output),before);assert.equal(first.bytes,before.length);
});
test('adulterar avaliador local só muda metadado formativo, não as fontes',async t=>{
  const root=await fixture(t);const evaluator=path.join(root,'src/avaliacao-local.mjs');await writeFile(evaluator,"export const TEAM_CASES=[]; export const CRITERIA={}; export function individualCases(){return []} export function scorePublic(){return {criteria:[],shared:10,perSlot:{1:10,2:10,3:10,4:10},grade:10}}\n");
  // A API importada deste teste continua usando seu módulo original. Uma nova CLI carrega o avaliador adulterado.
  const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');await promisify(execFile)(process.execPath,['scripts/gerar-entrega.mjs'],{cwd:root});
  const parsed=await parsePackage(await readFile(path.join(root,'entrega/entrega-a08.jsonl'),'utf8'));assert.equal(parsed.localResult.grade,10);assert.deepEqual(parsed.sourceHashes,(await parsePackage(baseline)).sourceHashes);
});
