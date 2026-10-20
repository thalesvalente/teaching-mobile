/* Ficha local: a nota sempre deriva das escolhas atuais; exportar não altera estado. */
(() => {
'use strict';
const LESSON='07';
const A=window.Aula7;
const M=LESSON==='06'?window.Mobile6:{
 VERSION:A.VERSION,
 PROJECTS:Object.fromEntries(Object.entries(A.PROJECTS).map(([k,p])=>[k,{...p,name:p.nome,folder:k}])),
 GROUPS:A.GROUPS.map(g=>({...g,title:g.titulo,minutes:g.minutos,points:g.pontos,slide:g.slides[0],hint:g.dica,fields:g.campos})),
 config:A.config,
 evaluate:(c,p,g=null)=>A.avaliar(c,p).filter(r=>g===null||r.grupo===g).map(r=>({
  id:r.id,group:r.grupo,label:r.titulo,status:({passou:'pass',ajustar:'fail',pendente:'pending'})[r.status],
  earned:r.pontos,max:r.max,hint:A.GROUPS[r.grupo].dica,dependencies:r.dependencias,missing:r.faltantes
 }))
};
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n.toFixed(1).replace('.',',');
const title=LESSON==='06'?'Navegação e formulários':'Estado, filtros e visualização de dados';
const fieldLabels=Object.fromEntries(M.GROUPS.flatMap(g=>g.fields.map(([k,label])=>[k,label])));
const EVIDENCE={nativeStatus:50,nativeDevice:180,nativeFiles:1500,nativeCommit:240,nativeTest:2000,nativeRequirement:1000,nativePending:1200,aiLog:1200};
const evidenceLabels={nativeStatus:'Situação declarada pela equipe',nativeDevice:'Ambiente do teste',nativeFiles:'Arquivos modificados',nativeCommit:'Commit ou versão',nativeTest:'Teste e resultado observado',nativeRequirement:'Requisito / caso de uso atendido',nativePending:'Pendências',aiLog:'Uso de IA e validação humana'};
let choice=M.config(),project='memorias',members=Array.from({length:3},()=>({name:'',contribution:''}));
let reflections=['','','',''],hints=[0,0,0,0],attempts=[0,0,0,0],practice={},practiceEvidence=['','','',''];
let results=[],stage=0,dirty=false,app,projectDrafts={};
const date=new Date();$('date').value=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
const mark=()=>{dirty=true;};
const status=t=>{$('status').textContent=t;};
const evidenceSnapshot=()=>Object.fromEntries(Object.keys(EVIDENCE).map(k=>[k,$(k).value]));
function scoreData(rs){
 const earned=rs.reduce((sum,r)=>sum+r.earned,0),passed=rs.filter(r=>r.status==='pass').length;
 return {earned,max:10,xp:earned*10,xpMax:100,passed,total:20,pending:rs.filter(r=>r.status==='pending').length,
  answered:Object.values(choice).filter(Boolean).length,fields:Object.keys(choice).length,
  level:earned===10?'Missão completa':earned>=7?'Consolidando':earned>=4?'Construindo':earned>0?'Explorando':'Ponto de partida'};
}
function memberUI(){
 $('members').innerHTML=members.map((m,i)=>`<div class="member"><label>Nome do componente ${i+1}<input autocomplete="off" data-member="${i}" maxlength="100" value="${esc(m.name)}"></label><button type="button" class="secondary" data-remove="${i}" aria-label="Remover componente ${i+1}" ${members.length===1?'disabled':''}>Remover</button></div>`).join('');
 $('addMember').disabled=members.length>=8;
 $('contributions').innerHTML=members.map((m,i)=>`<label data-contrib-label="${i}">${esc(m.name||'Componente '+(i+1))} · O que você fez?<textarea data-contribution="${i}" maxlength="800" placeholder="Descreva sua participação. Este texto não soma pontos automaticamente.">${esc(m.contribution)}</textarea></label>`).join('');
}
$('members').addEventListener('input',e=>{
 if(e.target.dataset.member===undefined)return;
 const i=Number(e.target.dataset.member);members[i].name=e.target.value;
 document.querySelector(`[data-contrib-label="${i}"]`).firstChild.textContent=(e.target.value||'Componente '+(i+1))+' · O que você fez?';mark();
});
$('members').addEventListener('click',e=>{
 const b=e.target.closest('[data-remove]');if(!b||members.length===1)return;
 const i=Number(b.dataset.remove);if((members[i].name||members[i].contribution)&&!confirm('Remover este componente e sua contribuição?'))return;
 members.splice(i,1);memberUI();$('addMember').focus();mark();
});
$('addMember').onclick=()=>{if(members.length<8){members.push({name:'',contribution:''});memberUI();[...$('members').querySelectorAll('input')].at(-1)?.focus();mark();}};
$('contributions').addEventListener('input',e=>{if(e.target.dataset.contribution!==undefined){members[Number(e.target.dataset.contribution)].contribution=e.target.value;mark();}});
['team','date',...Object.keys(EVIDENCE)].forEach(id=>$(id).addEventListener('input',mark));
function resetLab(){
 if(LESSON==='06'){app=new M.App(choice,project);M.draw($('lab'),app);}
 else{app?.dispose();app=window.Lab7.montar($('lab'),{config:choice,projeto:project});}
}
$('resetLab').onclick=()=>{resetLab();status('Laboratório reiniciado. Respostas, notas e identificação foram preservadas.');};
function cloneDraft(d){return {practice:{...d.practice},practiceEvidence:[...d.practiceEvidence],evidence:{...d.evidence}};}
function currentDraft(){return {practice:{...practice},practiceEvidence:[...practiceEvidence],evidence:evidenceSnapshot()};}
function allProjectDrafts(){return {...Object.fromEntries(Object.entries(projectDrafts).map(([p,d])=>[p,cloneDraft(d)])),[project]:currentDraft()};}
function selectProject(next){
 projectDrafts[project]=currentDraft();project=next;
 const d=projectDrafts[project]||{practice:{},practiceEvidence:['','','',''],evidence:Object.fromEntries(Object.keys(EVIDENCE).map(k=>[k,k==='nativeStatus'?'pendente':'']))};
 practice={...d.practice};practiceEvidence=[...d.practiceEvidence];Object.entries(d.evidence).forEach(([k,v])=>$(k).value=v);
 renderStage();resetLab();recheck();renderPractice();mark();
 status('Trilha alterada. As escolhas conceituais foram preservadas. A prática e as evidências têm registros próprios em cada projeto; ao voltar, você recupera o preenchimento daquela trilha.');
}
$('project').onchange=()=>selectProject($('project').value);
const optionLabel=s=>s.replaceAll('PASTA',M.PROJECTS[project].folder);
function stageNav(){
 $('stage-nav').innerHTML=M.GROUPS.map((g,i)=>`<button type="button" data-stage="${i}" aria-pressed="${stage===i}" aria-controls="stage-panel">${i+1} · ${esc(g.title)}</button>`).join('');
}
function renderStage(){
 const g=M.GROUPS[stage];stageNav();
 $('stage-meta').textContent=`MISSÃO ${stage+1} · ${g.minutes} MINUTOS · ATÉ ${fmt(g.points)} PONTOS`;
 $('stage-title').textContent=g.title;
 $('config-fields').innerHTML=g.fields.map(([k,label,options])=>`<label>${esc(label)}<select data-config="${k}" id="cfg-${k}" aria-describedby="selection-help"><option value="">Não respondido — escolher depois</option>${options.map(([v,t])=>`<option value="${v}" ${choice[k]===v?'selected':''}>${esc(optionLabel(t))}</option>`).join('')}</select><code class="chosen-code" data-chosen="${k}">${esc(optionLabel(options.find(o=>o[0]===choice[k])?.[1]||''))}</code></label>`).join('');
 $('reflection').value=reflections[stage];$('hint').hidden=true;$('hintToggle').setAttribute('aria-expanded','false');
 const slides=LESSON==='06'?[g.slide]:g.slides;
 $('hint').innerHTML=esc(g.hint)+'<div class="actions">'+slides.map(id=>`<a class="button secondary" href="${LESSON==='06'?'../Aula_06_Mobile_Navegacao_Formularios.html':'index.html'}#${id}" target="aula${LESSON}" rel="noopener">Rever slide ${Number(id.slice(1))}</a>`).join('')+'</div>';
 $('previousStage').disabled=stage===0;$('nextStage').disabled=stage===M.GROUPS.length-1;testUI();
}
function go(i){stage=Math.max(0,Math.min(M.GROUPS.length-1,i));renderStage();$('stage-title').focus();$('stage-title').scrollIntoView({block:'start',behavior:'auto'});}
$('stage-nav').onclick=e=>{const b=e.target.closest('[data-stage]');if(b)go(Number(b.dataset.stage));};
$('previousStage').onclick=()=>go(stage-1);$('nextStage').onclick=()=>go(stage+1);
$('config-fields').onchange=e=>{
 const key=e.target.dataset.config;if(!key)return;
 choice[key]=e.target.value;document.querySelector(`[data-chosen="${key}"]`).textContent=e.target.value?e.target.selectedOptions[0].textContent:'';
 recheck();resetLab();mark();
};
$('reflection').oninput=()=>{reflections[stage]=$('reflection').value;mark();};
$('hintToggle').onclick=()=>{const open=$('hint').hidden;$('hint').hidden=!open;$('hintToggle').setAttribute('aria-expanded',String(open));if(open){hints[stage]++;mark();}};
function testUI(){
 $('tests').innerHTML=results.filter(r=>r.group===stage).map(r=>{
  const description=r.status==='pass'?'Comportamento verificado no teste isolado deste critério.':r.status==='pending'?'Ainda falta responder: '+r.missing.map(k=>fieldLabels[k]).join('; ')+'.':r.hint;
  return `<article class="testrow ${r.status}"><strong>${r.status==='pass'?'Passou':r.status==='fail'?'Ajustar':'Pendente'} · ${esc(r.label)} · ${fmt(r.earned)} / ${fmt(r.max)}</strong><span class="small">${esc(description)}</span></article>`;
 }).join('');
}
function scoreUI(){
 const s=scoreData(results);$('score').textContent=fmt(s.earned)+' / 10,0';$('xp').textContent=s.xp+' / 100 XP';$('level').textContent=s.level;
 $('scoreProgress').value=s.passed;$('progressText').textContent=`${s.passed} de 20 critérios conquistados · ${s.answered} de ${s.fields} escolhas respondidas · ${s.pending} critérios pendentes.`;
 $('grade-summary').innerHTML='<table class="score-table"><caption>Nota formativa do simulador por missão</caption><thead><tr><th scope="col">Missão</th><th scope="col">Resultado</th></tr></thead><tbody>'+M.GROUPS.map((g,i)=>`<tr><th scope="row">${esc(g.title)}</th><td>${fmt(results.filter(r=>r.group===i).reduce((sum,r)=>sum+r.earned,0))} / ${fmt(g.points)}</td></tr>`).join('')+'</tbody></table>';
}
function recheck(){results=M.evaluate(choice,project);testUI();scoreUI();return results;}
$('testStage').onclick=()=>{attempts[stage]++;recheck();mark();$('gameStatus').textContent=`Missão ${stage+1} conferida. Nota atual ${fmt(scoreData(results).earned)} de 10. Repetir a conferência não acumula pontos.`;};
function practiceResults(){return M.evaluate({},project).map(r=>({...r,confirmed:practice[r.id]===true,earned:practice[r.id]===true?.5:0}));}
function practiceScore(){return practiceResults().reduce((sum,r)=>sum+r.earned,0);}
function practiceScoreUI(){
 const score=practiceScore();$('practiceScore').textContent=fmt(score)+' / 10,0';$('practiceProgress').value=score;
 const count=practiceResults().filter(r=>r.confirmed).length;
 $('practiceText').textContent=`${count} de 20 cenários confirmados pela equipe. Esta é uma autoavaliação; o site não executou o app nem conferiu as evidências.`;
}
function renderPractice(){
 const criteria=M.evaluate({},project);
 $('practiceMissions').innerHTML=M.GROUPS.map((g,i)=>`<fieldset class="mission-card"><legend>${i+1} · ${esc(g.title)} · até ${fmt(g.points)} pontos</legend><div class="criterion-grid">${criteria.filter(r=>r.group===i).map(r=>`<label class="practice-criterion"><input type="checkbox" data-practice="${r.id}" ${practice[r.id]?'checked':''}><span>${esc(r.label)} <strong>0,5 ponto</strong></span></label>`).join('')}</div><label>Evidência desta missão, resultado observado ou pendência<textarea data-practice-evidence="${i}" maxlength="2000" placeholder="Ex.: cenário executado, resultado, arquivo ou captura privada. Deixe em branco o que ainda não verificou.">${esc(practiceEvidence[i])}</textarea></label></fieldset>`).join('');practiceScoreUI();
}
$('practiceMissions').addEventListener('change',e=>{if(e.target.dataset.practice){practice[e.target.dataset.practice]=e.target.checked;practiceScoreUI();mark();}});
$('practiceMissions').addEventListener('input',e=>{if(e.target.dataset.practiceEvidence!==undefined){practiceEvidence[Number(e.target.dataset.practiceEvidence)]=e.target.value;mark();}});
function validDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===s&&s>='2000-01-01'&&s<='2100-12-31';}
function identity(){return members.map((m,i)=>({name:m.name.trim()||`Componente ${i+1}: nome não informado`,contribution:m.contribution.trim(),present:!!(m.name.trim()||m.contribution.trim())})).filter(m=>m.present);}
function snapshot(){return {schema:`mobile-a${LESSON}-v1`,version:M.VERSION,project,team:$('team').value,date:validDate($('date').value)?$('date').value:'',members:members.map(m=>({...m})),choice:{...choice},reflections:[...reflections],hints:[...hints],attempts:[...attempts],practice:{...practice},practiceEvidence:[...practiceEvidence],evidence:evidenceSnapshot(),projectDrafts:allProjectDrafts(),scores:{simulator:scoreData(M.evaluate(choice,project)),practiceDeclared:{earned:practiceScore(),max:10}}};}
function nativeStatusLabel(ev){
 if(ev.nativeStatus==='executado'&&(!ev.nativeFiles.trim()||!ev.nativeTest.trim()))return 'Implementação declarada como testada, mas os arquivos ou o resultado não foram informados. Evidências pendentes de conferência.';
 return {pendente:'Ainda não implementado/testado.',parcial:'Implementação parcial.',executado:'Implementado e testado segundo a equipe; exige conferência docente.'}[ev.nativeStatus]||'Não informado.';
}
function model(){
 const list=identity(),rs=M.evaluate(choice,project),s=scoreData(rs),ev=evidenceSnapshot(),pr=practiceResults();
 const pending=rs.filter(r=>r.status==='pending').length;
 const observations=[];
 if(!list.length)observations.push('Componentes não informados.');
 if(!$('team').value.trim())observations.push('Equipe não informada.');
 if(!validDate($('date').value))observations.push('Data da atividade não informada.');
 if(pending)observations.push(`${pending} de 20 critérios do simulador pendentes; valem zero nesta versão parcial.`);
 if(pr.some(r=>r.confirmed&&!practiceEvidence[r.group].trim()))observations.push('Há cenários da prática confirmados sem evidência descrita; dependem de conferência.');
 const normalized=members.map(m=>m.name.trim().normalize('NFC').toLowerCase()).filter(Boolean);
 if(new Set(normalized).size!==normalized.length)observations.push('Há nomes repetidos; revisar a identificação.');
 const sections=[
  {title:'1. Controle do documento',items:[['Finalidade','Registrar o estado atual da atividade, inclusive questões em branco.'],['Versão do material',M.VERSION],['Natureza das notas','A nota do simulador é automática e formativa. A nota da prática é autoavaliação declarada, sujeita à conferência das evidências pelo professor. O site não executa Expo nem atribui a nota oficial da disciplina.'],['Nota formativa do simulador',`${fmt(s.earned)} / 10,0. ${s.xp} / 100 XP. ${s.level}.`],['Progresso',`${s.passed} de 20 critérios conquistados. ${s.answered} de ${s.fields} escolhas respondidas. Denominador fixo: 10,0.`],['Pendências desta versão',observations.join('\n')||'Nenhuma pendência de preenchimento identificada. A conferência docente permanece necessária.']]},
  {title:'2. Pontuação e verificações',items:M.GROUPS.flatMap((g,i)=>[[g.title,fmt(rs.filter(r=>r.group===i).reduce((sum,r)=>sum+r.earned,0))+' / '+fmt(g.points)],...rs.filter(r=>r.group===i).map(r=>[r.label,(r.status==='pass'?'Passou':r.status==='fail'?'Ajustar':'Não respondido / pendente')+' — '+fmt(r.earned)+' / '+fmt(r.max)])])},
  {title:'3. Escolhas da equipe',items:M.GROUPS.flatMap(g=>g.fields.map(([k,label,options])=>[label,optionLabel(options.find(o=>o[0]===choice[k])?.[1]||'Não respondido.').replaceAll('→',' / ')]))},
  {title:'4. Reflexões e dicas',items:M.GROUPS.map((g,i)=>[g.title,(reflections[i].trim()||'Não respondido.')+`\nConferências solicitadas: ${attempts[i]}. Dicas abertas: ${hints[i]}. Sem desconto de pontos.`])},
  {title:'5. Participação individual',items:list.length?list.map(m=>[m.name,m.contribution||'Não informado.']):[['Componentes','Não informado.']]},
  {title:'6. Prática no app — autoavaliação declarada',items:[['Nota declarada da prática',fmt(practiceScore())+' / 10,0. Não somar à nota do simulador; são avaliações diferentes.'],['Como esta nota foi calculada','Cada cenário confirmado pela equipe vale 0,5 ponto nesta autoavaliação. Marcar a caixa é uma declaração, não uma comprovação automática. Textos e evidências não concedem pontos por quantidade.'],...M.GROUPS.flatMap((g,i)=>[[g.title,fmt(pr.filter(r=>r.group===i).reduce((sum,r)=>sum+r.earned,0))+' / '+fmt(g.points)],...pr.filter(r=>r.group===i).map(r=>[r.label,r.confirmed?'Confirmado pela equipe — 0,5 / 0,5. Conferência pendente.':'Não confirmado / pendente — 0,0 / 0,5.']),['Evidência da missão '+(i+1),practiceEvidence[i].trim()||'Não informado.']])]},
  {title:'7. Implementação e evidências',items:Object.entries(ev).map(([k,v])=>[evidenceLabels[k],k==='nativeStatus'?nativeStatusLabel(ev):v.trim()||'Não informado / pendente.'])},
  {title:'8. Regras de pontuação e entrega',items:[['Resultados parciais','Questões em branco não recebem pontos. Os critérios já demonstrados preservam seu crédito. Exportar, imprimir, abrir dicas e repetir verificações não acrescentam pontos.'],['Teste isolado e integração','Cada critério usa os trechos necessários declarados; os demais vêm da referência didática. O laboratório combina todas as escolhas. A integração e o uso no aparelho devem ser testados no projeto real.'],['Privacidade','Nomes e respostas são processados neste navegador. Nada é enviado ao professor automaticamente. Guarde JSON e PDF de forma privada; não publique arquivos com identificação dos alunos.']]}
 ];
 return {title,subtitle:'Relatório de progresso da equipe',discipline:'Programação para Dispositivos Móveis',lesson:'Aula '+LESSON,version:M.VERSION,professor:'Prof. Dr. Thales Levi Azevedo Valente',course:'Técnico em Informática Integrado ao Ensino Médio · 3º ano',team:$('team').value.trim()||'Não informado',project:M.PROJECTS[project].name,date:validDate($('date').value)?$('date').value.split('-').reverse().join('/'):'Não informada',members:list.length?list.map(m=>m.name):['Não informado'],score:fmt(s.earned)+' / 10,0',practiceScore:fmt(practiceScore())+' / 10,0',progress:`${s.xp} / 100 XP · ${s.passed} de 20 critérios conquistados`,partial:pending>0,sections};
}
function reportContent(m){return `<header class="report-cover"><p>INSTITUTO FEDERAL DO MARANHÃO · Campus Itapecuru-Mirim</p><h1>${esc(m.title)}</h1><p>${esc(m.lesson)} · ${esc(m.subtitle)} · versão ${esc(m.version)}</p><p>${esc(m.course)}<br>${esc(m.professor)}</p><dl><dt>Equipe</dt><dd>${esc(m.team)}</dd><dt>Projeto</dt><dd>${esc(m.project)}</dd><dt>Data da atividade</dt><dd>${esc(m.date)}</dd><dt>Componentes</dt><dd>${m.members.map(esc).join('; ')}</dd></dl><h2>Nota formativa do simulador: ${esc(m.score)}</h2><p>${esc(m.progress)}</p><h2>Autoavaliação declarada da prática: ${esc(m.practiceScore)}</h2><p>Notas separadas, sujeitas à conferência docente. ${m.partial?'Relatório parcial: contém questões não respondidas.':''}</p></header>${m.sections.map(s=>`<section class="report-section"><h2>${esc(s.title)}</h2><dl>${s.items.map(([label,value])=>`<div class="report-item"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></section>`).join('')}`;}
function reportHTML(m){return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Relatório Mobile Aula ${LESSON}</title><style>@page{size:A4;margin:18mm}*{box-sizing:border-box}body{font:12pt/1.5 Georgia,serif;max-width:180mm;margin:24px auto;padding:0 16px;color:#20362b;background:#fff;overflow-wrap:anywhere}h1,h2{color:#006b3c;line-height:1.25}h1{font-size:24pt}h2{font-size:16pt;break-after:avoid}.report-cover{border-top:7px solid #006b3c;padding-top:20px}.report-section{margin-top:28px}.report-item{margin:0 0 12px}dt{font-weight:bold;break-after:avoid}dd{margin:0;white-space:pre-wrap}button{min-height:44px;padding:10px 16px;background:#006b3c;color:#fff;border:0;border-radius:5px;font:inherit}button:focus-visible{outline:3px solid #1b4ea0;outline-offset:3px}@media print{body{margin:0;padding:0;max-width:none}button{display:none}.report-cover{break-after:page}.report-item{break-inside:avoid}a{color:inherit}}</style></head><body><button type="button" onclick="window.print()">Imprimir / Salvar como PDF</button><main>${reportContent(m)}</main></body></html>`;}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
function filename(ext){const team=($('team').value||'equipe').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,60)||'equipe';return `mobile_aula${LESSON}_${team}_atividade.${ext}`;}
function openPrint(m){
 const url=URL.createObjectURL(new Blob([reportHTML(m)],{type:'text/html;charset=utf-8'})),a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),120000);
 status('Versão de impressão aberta com a nota atual '+m.score+'. Use Imprimir / Salvar como PDF. Questões em branco continuam pendentes.');
}
$('pdf').onclick=()=>{try{const m=model();download(new Blob([window.FormalPdf.generate(m)],{type:'application/pdf'}),filename('pdf'));status('PDF gerado com a nota atual '+m.score+' e a autoavaliação separada. Questões em branco foram preservadas como pendentes. Guarde o JSON para continuar.');}catch(error){if(error.code==='UNSUPPORTED_PDF_CHARACTER'){openPrint(model());status('O texto contém caracteres que exigem a fonte do navegador. A versão de impressão foi aberta preservando o conteúdo e a nota: escolha Salvar como PDF.');}else status('Não foi possível gerar o PDF: '+error.message);}};
$('printReport').onclick=()=>openPrint(model());
$('json').onclick=()=>{download(new Blob([JSON.stringify(snapshot(),null,2)],{type:'application/json'}),filename('json'));dirty=false;status('Cópia JSON baixada com respostas e resultados atuais. Guarde-a em local privado; a importação recalcula as notas e preserva as questões em branco.');};
window.addEventListener('beforeprint',()=>{const target=$('print-snapshot');target.innerHTML=reportContent(model());target.hidden=false;document.body.classList.add('printing-report');});
window.addEventListener('afterprint',()=>{document.body.classList.remove('printing-report');$('print-snapshot').hidden=true;});
function parseSnapshot(data){
 if(!data||data.schema!==`mobile-a${LESSON}-v1`||!Object.hasOwn(M.PROJECTS,data.project))throw Error('Essa cópia não pertence à atividade da Aula '+LESSON+'.');
 const text=(v,n)=>{if(typeof v!=='string'||v.length>n)throw Error('Texto inválido ou longo demais na cópia.');return v;};
 const team=text(data.team,80),date=text(data.date??'',10);if(date&&!validDate(date))throw Error('Data inválida na cópia.');
 if(!Array.isArray(data.members)||data.members.length<1||data.members.length>8)throw Error('A cópia deve conter entre 1 e 8 componentes.');
 const ms=data.members.map(m=>({name:text(m?.name,100),contribution:text(m?.contribution??'',800)}));
 const strings=(v,n)=>{if(!Array.isArray(v)||v.length!==4)throw Error('A cópia deve conter quatro registros de missão.');return v.map(x=>text(x,n));};
 const rr=strings(data.reflections,1500);
 if(!data.choice||typeof data.choice!=='object'||Array.isArray(data.choice))throw Error('Escolhas inválidas.');
 const cc=M.config(data.choice),counts=v=>Array.from({length:4},(_,i)=>Number.isSafeInteger(v?.[i])?Math.min(999,Math.max(0,v[i])):0);
 function parseDraft(raw,p){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Registro de projeto inválido.');
  const pe=strings(raw.practiceEvidence===undefined?['','','','']:raw.practiceEvidence,2000),ev={};
  if(raw.evidence!==undefined&&(!raw.evidence||typeof raw.evidence!=='object'||Array.isArray(raw.evidence)))throw Error('Evidências inválidas na cópia.');
  for(const [k,max] of Object.entries(EVIDENCE))ev[k]=text(raw.evidence?.[k]??(k==='nativeStatus'?'pendente':''),max);
  if(!['pendente','parcial','executado'].includes(ev.nativeStatus))throw Error('Situação do teste nativo inválida.');
  if(raw.practice!==undefined&&(!raw.practice||typeof raw.practice!=='object'||Array.isArray(raw.practice)))throw Error('Autoavaliação inválida.');
  const pp={};for(const r of M.evaluate({},p)){const v=raw.practice?.[r.id];if(v!==undefined&&typeof v!=='boolean')throw Error('Confirmação de cenário inválida.');pp[r.id]=v===true;}
  return {practice:pp,practiceEvidence:pe,evidence:ev};
 }
 const drafts={};
 if(data.projectDrafts!==undefined){
  if(!data.projectDrafts||typeof data.projectDrafts!=='object'||Array.isArray(data.projectDrafts))throw Error('Cópias dos projetos inválidas.');
  for(const [p,d] of Object.entries(data.projectDrafts)){if(!Object.hasOwn(M.PROJECTS,p))throw Error('Trilha desconhecida na cópia.');drafts[p]=parseDraft(d,p);}
 }
 const current=parseDraft(data,data.project);drafts[data.project]=cloneDraft(current);
 return {project:data.project,team,date,members:ms,choice:cc,reflections:rr,hints:counts(data.hints),attempts:counts(data.attempts),...current,projectDrafts:drafts};
}
function restore(data){
 const d=parseSnapshot(data);project=d.project;choice=d.choice;members=d.members;reflections=d.reflections;hints=d.hints;attempts=d.attempts;practice=d.practice;practiceEvidence=d.practiceEvidence;projectDrafts=d.projectDrafts;
 $('team').value=d.team;$('date').value=d.date;$('project').value=project;Object.entries(d.evidence).forEach(([k,v])=>$(k).value=v);
 memberUI();recheck();renderStage();resetLab();renderPractice();dirty=false;
}
$('import').onchange=async e=>{try{
 const file=e.target.files[0];if(!file)return;if(file.size>262144)throw Error('O limite desta cópia é 256 KB.');
 const data=JSON.parse(await file.text());parseSnapshot(data);
 if(!confirm('Substituir o preenchimento desta aba pela cópia escolhida?'))return;
 restore(data);status('Cópia reaberta com questões em branco preservadas. A nota foi recalculada das respostas; valores de pontuação escritos no arquivo foram ignorados. A prática continua sendo declaração da equipe.');
}catch(error){status('Não foi possível importar: '+error.message);}finally{e.target.value='';}};
let remaining=3000,tick=null;
function stop(){clearInterval(tick);tick=null;$('timer').textContent=remaining?'Continuar tempo':'Tempo encerrado';}
function clock(){$('clock').textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');}
$('timer').onclick=()=>{if(tick){stop();return;}if(!remaining)return;let last=Date.now();tick=setInterval(()=>{const now=Date.now(),elapsed=Math.floor((now-last)/1000);if(elapsed){remaining=Math.max(0,remaining-elapsed);last+=elapsed*1000;clock();if(!remaining)stop();}},250);$('timer').textContent='Pausar tempo';};
$('timerReset').onclick=()=>{stop();remaining=3000;clock();$('timer').textContent='Iniciar tempo';};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&tick)stop();});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
memberUI();recheck();renderStage();resetLab();renderPractice();
window.MobileActivity={snapshot,model,recheck,reportHTML,parseSnapshot,restore,get results(){return results;},get app(){return app;}};
})();
