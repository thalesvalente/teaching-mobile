import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import * as aluno from '../src/engine.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const seed=[
  {id:'m-01',titulo:'Fotografia da praça',descricao:'Registro fictício suficientemente longo.',categoria:'Lugar',periodo:'Manhã',trilha:'memorias'},
  {id:'m-02',titulo:'Memória da feira',descricao:'Evento fictício para estudo da turma.',categoria:'Evento',periodo:'Tarde',trilha:'memorias'},
  {id:'m-03',titulo:'Mapa da praça',descricao:'Outro lugar de exemplo da lista.',categoria:'Lugar',periodo:'Noite',trilha:'memorias'},
  {id:'e-01',titulo:'Frequência agregada',descricao:'Indicador simulado, sem pessoas reais.',categoria:'Indicador',periodo:'Manhã',trilha:'eda'}
];
const clone=o=>structuredClone(o);
const assert=(cond,msg='Comportamento divergente')=>{if(!cond)throw new Error(msg);};
const eq=(actual,expected)=>{assert(JSON.stringify(actual)===JSON.stringify(expected),`Esperado ${JSON.stringify(expected)}; recebido ${JSON.stringify(actual)}`);};
const base={busca:'',categoria:'Todas',periodo:'Todos',ordem:'az'};
const form={titulo:'Novo memorial',descricao:'Descrição demonstrativa com vinte caracteres.',categoria:'Lugar',periodo:'Manhã',trilha:'memorias'};
const i=(id,grupo,descricao,run)=>({id,grupo,descricao,run});
const casos=[
  i('M1-01','M1','Erro tem prioridade sobre carregamento',()=>eq(aluno.estadoTela({carregando:true,erro:'Falha',totalFonte:4,totalVisivel:4}),'erro')),
  i('M1-02','M1','Carregando sem erro',()=>eq(aluno.estadoTela({carregando:true,erro:null,totalFonte:4,totalVisivel:4}),'carregando')),
  i('M1-03','M1','Coleção realmente vazia',()=>eq(aluno.estadoTela({carregando:false,erro:null,totalFonte:0,totalVisivel:0}),'vazio')),
  i('M1-04','M1','Busca sem resultados não é coleção vazia',()=>eq(aluno.estadoTela({carregando:false,erro:null,totalFonte:4,totalVisivel:0}),'sem-resultados')),
  i('M1-05','M1','Dados prontos em estado estável',()=>eq(aluno.estadoTela({carregando:false,erro:null,totalFonte:4,totalVisivel:2}),'pronto')),
  i('M2-01','M2','Pesquisa ignora caixa e acentos',()=>eq(aluno.filtrarOrdenar(clone(seed),{...base,busca:' PRAÇA '}).map(x=>x.id),['m-01','m-03'])),
  i('M2-02','M2','Categoria e período combinados (AND)',()=>eq(aluno.filtrarOrdenar(clone(seed),{...base,categoria:'Lugar',periodo:'Noite'}).map(x=>x.id),['m-03'])),
  i('M2-03','M2','Ordenação Z-A com IDs íntegros',()=>eq(aluno.filtrarOrdenar(clone(seed),{...base,ordem:'za'}).map(x=>x.id),['m-02','m-03','e-01','m-01'])),
  i('M2-04','M2','A fonte não muda e o resultado preserva os objetos',()=>{const a=clone(seed),before=JSON.stringify(a);const b=aluno.filtrarOrdenar(a,{...base,busca:'mapa'});eq(b.map(x=>x.id),['m-03']);eq(JSON.stringify(a),before);assert(b[0]===a[2],'Não recrie IDs/objetos em cada filtro')}),
  i('M3-01','M3','Detalhe usa ID opaco exato',()=>eq(aluno.obterPorId(clone(seed),'m-03')?.titulo,'Mapa da praça')),
  i('M3-02','M3','ID desconhecido devolve null',()=>eq(aluno.obterPorId(clone(seed),'m-999'),null)),
  i('M3-03','M3','Validação aceita valores corretos após trim',()=>{const v=aluno.validarFormulario({...form,titulo:'  Novo memorial  '},clone(seed));assert(v.ok===true);assert(!v.erros?.titulo)}),
  i('M3-04','M3','Validação rejeita título/descrição insuficientes',()=>{const v=aluno.validarFormulario({...form,titulo:' ab ',descricao:'curta'},clone(seed));assert(v.ok===false&&v.erros?.titulo&&v.erros?.descricao)}),
  i('M3-05','M3','Título repetido após normalizar acento/caixa é inválido na mesma trilha',()=>{const v=aluno.validarFormulario({...form,titulo:'fotografia da PRACA'},clone(seed));assert(v.ok===false&&/duplicad|repetid|existe/i.test(v.erros?.titulo||''))}),
  i('M3-06','M3','Inserção cria novo array sem mutar a fonte',()=>{const before=clone(seed),extra={...seed[0],id:'m-05',titulo:'Novo registro'};const after=aluno.inserirImutavel(before,extra);assert(after!==before&&after.length===before.length+1);eq(after.at(-1),extra);eq(before,seed)}),
  i('M4-01','M4','Idempotência: repetir toque/ID não duplica',()=>{const novo={...seed[0],id:'x-2'};const a=aluno.inserirImutavel(clone(seed),novo);const b=aluno.inserirImutavel(a,novo);assert(a.length===5&&b.length===5);eq(b.filter(x=>x.id==='x-2').length,1)}),
  i('M4-02','M4','Resumo conta total e IDs sem perda',()=>{const r=aluno.resumir(clone(seed));eq(r.total,4);eq(r.ids,['m-01','m-02','m-03','e-01'])}),
  i('M4-03','M4','Resumo contabiliza categorias corretamente',()=>{const r=aluno.resumir(clone(seed));eq(r.porCategoria,{Lugar:2,Evento:1,Indicador:1})}),
  i('M4-04','M4','Resumo de base vazia é seguro',()=>eq(aluno.resumir([]),{total:0,porCategoria:{},ids:[]})),
  i('M4-05','M4','Resumo não modifica nem reordena a fonte',()=>{const src=clone(seed),before=JSON.stringify(src);const out=aluno.resumir(src);assert(out.total===4);eq(JSON.stringify(src),before)})
];
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
