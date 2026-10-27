import {resolver} from '/src/equipe.mjs';
import {REGISTROS} from '/src/dados.mjs';
const $=id=>document.getElementById(id);
let items=structuredClone(REGISTROS), route={screen:'list',selectedId:null,query:'',category:'Todas',period:'Todos'}, status={status:'pronto',error:null}, nextId=1;
function message(text){$('message').textContent=text;}
function call(input,fallback){try{const value=resolver(structuredClone(input));return value==null?fallback:value;}catch{message('Uma função encontrou erro. Confira o terminal com npm run nota e tente uma mudança pequena.');return fallback;}}
function render(){
  for(const name of ['query','category','period']) $(name).value=route[name];
  const filtered=call({op:'filtrar',items,query:route.query,category:route.category,period:route.period},[]);
  const visible=Array.isArray(filtered)?filtered:[];
  const screen=call({op:'estado',loading:status.status==='carregando',error:status.error,items,filtered:visible},'erro');
  const labels={'carregando':'Carregando atividades…','erro':'Algo deu errado. Você pode tentar novamente.','vazio':'A base está vazia. Use Restaurar dados.','sem-resultados':'Nenhuma atividade neste recorte. Experimente outra busca.','pronto':'Lista pronta para explorar.'};
  $('state').textContent=labels[screen]||'Confira o contrato da função estado.';
  $('retry').hidden=screen!=='erro';$('list-screen').hidden=route.screen==='detail';$('detail-screen').hidden=route.screen!=='detail';
  const list=$('list');list.replaceChildren();
  const keys=call({op:'chaves',items:visible},[]);
  if(screen==='pronto')visible.forEach((item,index)=>{
    const li=document.createElement('li'),title=document.createElement('h3'),info=document.createElement('p'),button=document.createElement('button');
    li.dataset.key=String(keys[index]??'pendente');title.textContent=item.title;info.textContent=`${item.category} · ${item.period}`;button.type='button';button.textContent='Abrir detalhes';button.setAttribute('aria-label',`Abrir detalhes de ${item.title}`);
    button.addEventListener('click',()=>{const next=call({op:'navegar',state:route,action:'open',id:item.id},route);route=next;render();$('detail-title').focus();});li.append(title,info,button);list.append(li);
  });
  const summary=call({op:'resumo',items:visible},{total:0,text:'Resumo pendente.'});$('summary').textContent=summary.text;
  $('bars').replaceChildren();visible.forEach(item=>{const row=document.createElement('div'),label=document.createElement('label'),bar=document.createElement('progress');row.className='bar';label.textContent=`${item.title}: ${item.value}% de interesse fictício`;bar.max=100;bar.value=Number.isFinite(item.value)?item.value:0;bar.setAttribute('aria-label',label.textContent);row.append(label,bar);$('bars').append(row);});
  if(route.screen==='detail'){const item=items.find(x=>String(x.id)===route.selectedId);$('detail-title').textContent=item?.title||'Atividade não encontrada';$('detail-info').textContent=item?`${item.category} · ${item.period} · ${item.value}% de interesse fictício`:'';}
}
for(const name of ['query','category','period'])$(name).addEventListener(name==='query'?'input':'change',()=>{route={...route,[name]:$(name).value};render();});
$('back').addEventListener('click',()=>{route=call({op:'navegar',state:route,action:'back'},route);render();$('query').focus();});
$('simulate-error').addEventListener('click',()=>{status={status:'erro',error:'Falha fictícia'};render();});
function loaded(){setTimeout(()=>{status={status:'pronto',error:null};render();},650);}
$('simulate-loading').addEventListener('click',()=>{status={status:'carregando',error:null};render();loaded();});
$('retry').addEventListener('click',()=>{status=call({op:'tentar',state:status},status);render();if(status.status==='carregando')loaded();else message('O TODO de tentar novamente ainda está pendente. Veja src/equipe.mjs.');});
$('clear-base').addEventListener('click',()=>{items=[];status={status:'pronto',error:null};render();});
$('restore-base').addEventListener('click',()=>{items=structuredClone(REGISTROS);status={status:'pronto',error:null};message('Dados fictícios restaurados.');render();});
$('activity-form').addEventListener('submit',event=>{event.preventDefault();const form={title:$('title').value,category:$('new-category').value},check=call({op:'validar',form},{valid:false,errors:{title:'Confira sua função validar.'}});$('title-error').textContent=check.errors?.title||'';$('category-error').textContent=check.errors?.category||'';$('title').setAttribute('aria-invalid',String(Boolean(check.errors?.title)));$('new-category').setAttribute('aria-invalid',String(Boolean(check.errors?.category)));if(!check.valid){(check.errors?.title?$('title'):$('new-category')).focus();return;}items=[...items,{id:`rascunho-${nextId++}`,title:form.title,category:form.category,period:'Manhã',value:0}];event.target.reset();message('Atividade adicionada ao rascunho desta página.');render();});
render();
