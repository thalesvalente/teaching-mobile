import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import * as aluno from '../src/engine.mjs';
import criteriaModule from '../../../laboratorio-vivo/criteria.js';
const {create:createCriteria}=criteriaModule;

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const casos=createCriteria(aluno);
function esc(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const resultados=[];
for(const c of casos){try{await c.run();resultados.push({id:c.id,grupo:c.grupo,descricao:c.descricao,ok:true,motivo:''});}catch(e){resultados.push({id:c.id,grupo:c.grupo,descricao:c.descricao,ok:false,motivo:String(e?.message||e).slice(0,240)});}}
const aprovados=resultados.filter(x=>x.ok).length;
const pontos=aprovados*0.5;
const codigo=await readFile(resolve(root,'src/engine.mjs'));
const sha256=createHash('sha256').update(codigo).digest('hex');
const relatorio={schema:'mobile-a08-avancado-formativo-v3',geradoEm:new Date().toISOString(),codigoSha256:sha256,pontuacao:pontos,maximo:10,xp:aprovados*5,criterios:resultados,avisos:['Avaliação local e formativa. Não é nota oficial.','Execução em Android/iOS, acessibilidade humana e identidade da equipe exigem evidências externas.']};
await mkdir(resolve(root,'entrega'),{recursive:true});
await writeFile(resolve(root,'entrega/resultado.json'),JSON.stringify(relatorio,null,2),'utf-8');
const rows=resultados.map(x=>`<tr><td>${esc(x.id)}</td><td>${esc(x.descricao)}</td><td>${x.ok?'0,5':'0,0'}</td><td>${esc(x.ok?'PASS':x.motivo)}</td></tr>`).join('');
const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>A08 · Relatório formativo</title><style>body{font:15px/1.5 system-ui,sans-serif;max-width:960px;margin:auto;padding:30px;color:#174038}h1{color:#064c43}header{border-top:8px solid #04634f;border-bottom:2px solid #a7d8c7;padding:12px}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ceddd6;padding:9px;text-align:left}tr{break-inside:avoid}button{padding:12px;border:0;border-radius:8px;background:#075849;color:#fff}@media print{button{display:none}body{padding:0}}@page{size:A4;margin:15mm}</style></head><body><header><small>IFMA · Programação para Dispositivos Móveis</small><h1>Aula 08 — Desafio avançado</h1><p>Relatório local de aprendizagem · ${esc(relatorio.geradoEm)}</p></header><h2>Resultado: ${pontos.toFixed(1).replace('.',',')} / 10,0 · ${relatorio.xp} XP</h2><p><strong>Não é nota oficial.</strong> SHA-256 do motor: <code>${sha256}</code></p><button onclick="window.print()">Imprimir / Salvar PDF</button><table><thead><tr><th>Critério</th><th>Comportamento</th><th>Pontos</th><th>Evidência</th></tr></thead><tbody>${rows}</tbody></table><p>Registrar separadamente: equipamento/aparelho real, commits, testes de teclado e leitor de tela, limitações e decisões da equipe.</p></body></html>`;
await writeFile(resolve(root,'entrega/resultado.html'),html,'utf-8');
console.log(`Aula 08 · ${aprovados}/20 critérios · ${pontos.toFixed(1)}/10 · ${aprovados*5} XP`);
for(const r of resultados)console.log(`${r.ok?'PASS':'PENDENTE'} ${r.id} ${r.descricao}`);
console.log(`Relatórios: entrega/resultado.json e entrega/resultado.html\nSHA-256: ${sha256}`);
if(process.argv.includes('--strict')&&aprovados!==casos.length)process.exitCode=1;

if(process.argv.includes('--expect-starter')&&aprovados!==0)process.exitCode=1;
