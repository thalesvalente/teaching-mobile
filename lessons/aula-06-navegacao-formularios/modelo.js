/* Motor didático local. Não executa Expo nem código fornecido pelo estudante.
   Cada opção representa um trecho explícito; laboratório e testes usam este mesmo motor. */
(() => {
'use strict';
const VERSION='3.0.0';
const PROJECTS={
 memorias:{name:'Mapa de Memórias Quilombolas',folder:'memorias',novo:'Nova memória',items:[{id:1,titulo:'História do caminho antigo',resumo:'Relato simulado sobre caminhos usados entre casas e roçados.'},{id:2,titulo:'Praça das conversas',resumo:'Descrição simulada de um espaço de encontro comunitário.'}]},
 acoes:{name:'Permanência e Evasão Escolar',folder:'acoes',novo:'Registrar ação',items:[{id:1,titulo:'Organizar grupo de estudos',resumo:'Ação inventada para combinar uma revisão de conteúdos.'},{id:2,titulo:'Divulgar horário de apoio',resumo:'Ação inventada para consultar os horários de apoio pedagógico.'}]}
};
// Chaves são internas. Na interface aparecem perguntas, trechos e explicações.
const GROUPS=[
 {title:'Transformar telas em rotas',minutes:8,points:2,slide:'s05',hint:'index.tsx abre a lista; [id].tsx recebe um identificador; nova.tsx tem endereço fixo. _layout organiza as telas.',fields:[
 ['list','Arquivo da lista', [['index','app/PASTA/index.tsx'],['list','app/PASTA/lista.tsx'],['layout','app/PASTA/_layout.tsx']]],
 ['detail','Arquivo de detalhe', [['fixed','app/PASTA/detalhe.tsx'],['dynamic','app/PASTA/[id].tsx'],['id','app/PASTA/id.tsx']]],
 ['form','Arquivo do formulário', [['dynamic','app/PASTA/[nova].tsx'],['static','app/PASTA/nova.tsx'],['layout','app/PASTA/_layout.tsx']]],
 ['layout','Navegador do layout', [['text','return <Text>Menu</Text>;'],['stack','return <Stack />;'],['null','return null;']]]
 ]},
 {title:'Abrir, encontrar e voltar',minutes:10,points:2,slide:'s08',hint:'Ao abrir, preserve a lista no histórico. O parâmetro da rota é texto: compare com String(item.id). Trate o ID ausente e a abertura sem tela anterior.',fields:[
 ['open','Ao tocar em um cartão', [['replace','router.replace(destino)'],['push','router.push(destino)'],['none','Não chamar o router']]],
 ['lookup','Como localizar o item', [['strict','itens.find(item => item.id === id)'],['first','itens[0]'],['string','itens.find(item => String(item.id) === id)']]],
 ['missing','Se o item não existir', [['first','Mostrar o primeiro item'],['message','Mostrar "Registro não encontrado" e retorno'],['blank','Deixar a tela vazia']]],
 ['back','Como implementar o retorno', [['push','router.push(lista)'],['safe','canGoBack() ? back() : replace(lista)'],['back','router.back() sem alternativa']]]
 ]},
 {title:'Controlar e validar o formulário',minutes:12,points:3,slide:'s12',hint:'value lê o estado; onChangeText atualiza o estado. Valide os textos depois de trim(): título com 3 ou mais caracteres; resumo com 10 ou mais. São regras didáticas desta oficina.',fields:[
 ['input','Ligação do campo com o estado', [['fixed','value="" sem atualizar o estado'],['controlled','value={titulo} onChangeText={setTitulo}']]],
 ['trim','Tratamento dos espaços nas pontas', [['raw','const t = titulo; const r = resumo;'],['trim','const t = titulo.trim(); const r = resumo.trim();']]],
 ['titleRule','Quando sinalizar erro no título', [['one','if (t.length < 1)'],['five','if (t.length < 5)'],['three','if (t.length < 3)']]],
 ['summaryRule','Quando sinalizar erro no resumo', [['ten','if (r.length < 10)'],['one','if (r.length < 1)'],['twenty','if (r.length < 20)']]]
 ]},
 {title:'Registrar e conferir o resultado',minutes:10,points:3,slide:'s17',hint:'Valide antes de criar; compartilhe a lista entre telas; abra o detalhe substituindo o formulário; impeça dois envios da mesma submissão. Nenhum dado é persistido após recarregar.',fields:[
 ['gate','Ordem da ação Registrar', [['before','Validar → se houver erro, retornar → criar'],['after','Criar → depois verificar os erros']]],
 ['storage','Onde fica o novo item', [['local','Somente no estado do formulário'],['shared','Na coleção compartilhada entre as telas']]],
 ['finish','Após registrar com sucesso', [['push','router.push(detalheCriado)'],['list','router.replace(lista)'],['replace','router.replace(detalheCriado)']]],
 ['guard','Dois toques na mesma submissão', [['none','Criar em cada toque'],['guard','Se enviando.current, retornar; senão bloquear e criar']]]
 ]}
];
const GOOD={list:'index',detail:'dynamic',form:'static',layout:'stack',open:'push',lookup:'string',missing:'message',back:'safe',input:'controlled',trim:'trim',titleRule:'three',summaryRule:'ten',gate:'before',storage:'shared',finish:'replace',guard:'guard'};
const KEYS=GROUPS.flatMap(g=>g.fields.map(f=>f[0]));
function config(c={}){const out={};for(const g of GROUPS)for(const [k,,opts]of g.fields)out[k]=opts.some(o=>o[0]===c[k])?c[k]:'';return out;}
class App {
 constructor(c=GOOD,p='memorias'){this.c=config(c);this.p=PROJECTS[p]||PROJECTS.memorias;this.list='/'+this.p.folder;this.items=this.p.items.map(x=>({...x}));this.stack=[this.list];this.form={titulo:'',resumo:''};this.lock=false;this.pending=null;this.errors={};this.message='Lista inicial. Todos os registros são fictícios.';}
 route(){return this.stack.at(-1);}
 resolve(path){if(this.c.layout!=='stack')return 'layout';if(path===this.list&&this.c.list==='index')return 'list';if(path===this.list+'/nova'&&this.c.form==='static')return 'form';if(path.startsWith(this.list+'/')&&this.c.detail==='dynamic')return 'detail';return 'notfound';}
 move(path,mode){if(mode==='push')this.stack.push(path);else if(mode==='replace')this.stack[this.stack.length-1]=path;}
 open(id){const path=this.list+'/'+id;this.move(path,this.c.open);this.message=this.c.open==='none'||!this.c.open?'O toque não chamou a navegação.':'O cartão pediu a abertura do detalhe.';}
 direct(id){this.stack=[this.list+'/'+id];this.message='Entrada direta: não há tela anterior neste histórico didático.';}
 find(){const id=this.route().split('/').at(-1);if(this.c.lookup==='first')return this.items[0];if(this.c.lookup==='strict')return this.items.find(x=>x.id===id);if(this.c.lookup==='string')return this.items.find(x=>String(x.id)===id);return undefined;}
 detail(){const item=this.find();return item|| (this.c.missing==='first'?this.items[0]:null);}
 missingText(){return this.c.missing==='message'?'Registro não encontrado.':'';}
 back(){if(this.c.back==='push')this.move(this.list,'push');else if(this.c.back==='safe'){if(this.stack.length>1)this.stack.pop();else this.move(this.list,'replace');}else if(this.c.back==='back'&&this.stack.length>1)this.stack.pop();this.message='Confira a tela atual e quantas telas há no histórico.';}
 newForm(){this.move(this.list+'/nova','push');this.form={titulo:'',resumo:''};this.errors={};this.pending=null;this.lock=false;this.message='Escreva apenas textos fictícios. Título ≥ 3 e resumo ≥ 10 após trim().';}
 input(key,value){if(['titulo','resumo'].includes(key)&&this.c.input==='controlled')this.form[key]=String(value);return this.form[key];}
 values(){return Object.fromEntries(Object.entries(this.form).map(([k,v])=>[k,this.c.trim==='trim'?v.trim():v]));}
 validate(){const v=this.values(),e={};const a={one:1,three:3,five:5}[this.c.titleRule],b={one:1,ten:10,twenty:20}[this.c.summaryRule];if(!a||v.titulo.length<a)e.titulo='Título: escreva pelo menos '+(a||3)+' caracteres.';if(!b||v.resumo.length<b)e.resumo='Resumo: escreva pelo menos '+(b||10)+' caracteres.';return e;}
 submit(){if(this.resolve(this.route())!=='form')return false;if(this.c.guard==='guard'&&this.lock)return false;this.errors=this.validate();if(this.c.gate!=='after'&&Object.keys(this.errors).length){this.message='Corrija os campos indicados antes de registrar.';return false;}if(this.c.guard==='guard')this.lock=true;const item={id:Math.max(0,...this.items.map(x=>x.id))+1,...this.values()};if(this.c.storage==='shared')this.items.push(item);this.pending=item;this.message='Registro criado nesta sessão.';return true;}
 finish(){if(!this.pending)return;const to=this.c.finish==='list'?this.list:this.list+'/'+this.pending.id;this.move(to,this.c.finish==='push'?'push':'replace');this.pending=null;}
 cancel(){this.pending=null;this.lock=false;this.back();}
}
const T=[
 [0,'A lista abre em /PASTA',a=>a.resolve(a.list)==='list','A rota da lista deve usar index.tsx.'],
 [0,'O detalhe aceita os IDs 1 e 2',a=>a.resolve(a.list+'/1')==='detail'&&a.resolve(a.list+'/2')==='detail','Use [id].tsx, não um arquivo fixo por item.'],
 [0,'/nova abre formulário, não detalhe',a=>a.resolve(a.list+'/nova')==='form','nova.tsx é uma rota estática.'],
 [0,'O layout organiza telas com Stack',a=>a.resolve(a.list)!=='layout','_layout.tsx retorna o navegador Stack.'],
 [1,'Abrir detalhe preserva a lista',a=>{a.open(2);return a.stack.length===2&&a.stack[0]===a.list&&a.route()===a.list+'/2';},'push acrescenta a tela; replace troca a atual.'],
 [1,'O ID 2 seleciona o segundo item',a=>{a.direct(2);return a.detail()?.id===2;},'Compare String(item.id) com o ID textual da rota.'],
 [1,'ID inexistente recebe mensagem',a=>{a.direct(999);return !a.detail()&&a.missingText()==='Registro não encontrado.';},'Não mostre um item diferente nem uma tela vazia.'],
 [1,'Retorno funciona com e sem histórico',a=>{a.open(2);a.back();const first=a.stack.length===1&&a.route()===a.list;a.direct(2);a.back();return first&&a.stack.length===1&&a.route()===a.list;},'Use back() se houver tela anterior; senão replace(lista).'],
 [2,'Digitar e apagar atualiza o estado',a=>{a.input('titulo','Teste');a.input('resumo','Uma descrição');const ok=a.form.titulo==='Teste'&&a.form.resumo==='Uma descrição';a.input('titulo','');return ok&&a.form.titulo==='';},'Ligue value e onChangeText ao estado.'],
 [2,'Campos vazios produzem erros',a=>Object.keys(a.validate()).length===2,'Valide título e resumo, não só um deles.'],
 [2,'Somente espaços não passam',a=>{a.input('titulo','      ');a.input('resumo','                     ');return Object.keys(a.validate()).length===2;},'trim() vem antes de conferir o tamanho.'],
 [2,'Título de 2 falha; título de 3 passa',a=>{a.input('resumo','abcdefghij');a.input('titulo','ab');const bad=!!a.validate().titulo;a.input('titulo','abc');return bad&&!a.validate().titulo;},'Use menos de 3, não menos de 1 ou 5.'],
 [2,'Resumo de 9 falha; de 10 passa',a=>{a.input('titulo','abc');a.input('resumo','abcdefghi');const bad=!!a.validate().resumo;a.input('resumo','abcdefghij');return bad&&!a.validate().resumo;},'Confira a borda da regra: 9 e 10 caracteres.'],
 [2,'Texto válido com espaços nas pontas passa',a=>{a.input('titulo','  abc  ');a.input('resumo','  abcdefghij  ');return Object.keys(a.validate()).length===0&&a.values().titulo==='abc';},'Não rejeite texto válido por conter espaços nas pontas.'],
 [3,'Envio inválido não cria item',a=>{a.newForm();const n=a.items.length;a.submit();a.finish();return a.items.length===n&&a.route()===a.list+'/nova'&&!!a.errors.titulo;},'Interrompa a função antes de criar quando houver erros.'],
 [3,'Novo registro aparece na coleção',a=>{fill(a);a.submit();a.finish();return a.items.length===3&&a.items[2].id===3;},'Estado somente no formulário não chega à lista e ao detalhe.'],
 [3,'Registro guarda os textos sem espaços nas pontas',a=>{fill(a);a.submit();return a.items[2]?.titulo==='Novo registro'&&a.items[2]?.resumo==='Texto fictício da atividade.';},'Grave os valores normalizados na coleção compartilhada.'],
 [3,'Sucesso abre o detalhe do novo item',a=>{fill(a);a.submit();a.finish();return a.route()===a.list+'/3'&&a.detail()?.titulo==='Novo registro';},'Use o ID devolvido pela criação.'],
 [3,'Voltar após salvar não reabre formulário',a=>{fill(a);a.submit();a.finish();a.back();return a.route()===a.list&&a.stack.length===1;},'replace no sucesso retira o formulário do histórico.'],
 [3,'Dois toques criam só um registro',a=>{fill(a);a.submit();a.submit();a.finish();return a.items.length===3;},'Bloqueie a mesma submissão antes de criar.']
];
function fill(a){a.newForm();a.input('titulo','  Novo registro  ');a.input('resumo','  Texto fictício da atividade.  ');}
function evaluate(c,p,group=null){const chosen=config(c);return T.map(([g,label,test,hint],i)=>{if(group!==null&&g!==group)return null;const keys=GROUPS[g].fields.map(f=>f[0]);const ready=keys.every(k=>chosen[k]);const isolated={...GOOD};keys.forEach(k=>isolated[k]=chosen[k]);let pass=false;try{pass=ready&&test(new App(isolated,p));}catch{pass=false;}return {id:i+1,group:g,label:label.replace('PASTA',(PROJECTS[p]||PROJECTS.memorias).folder),status:ready?(pass?'pass':'fail'):'pending',earned:pass?0.5:0,max:0.5,hint};}).filter(Boolean);}
function draw(mount,a,onAction=()=>{}){
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const b=(text,cmd,id='')=>'<button type="button" data-act="'+cmd+'" data-id="'+esc(id)+'">'+text+'</button>';
 function render(){let html='',kind=a.resolve(a.route());if(kind==='list')html='<h3>'+a.p.name+'</h3>'+a.items.map(x=>b(esc(x.titulo),'open',x.id)).join('')+b(a.p.novo,'new');
 else if(kind==='form')html='<h3>'+a.p.novo+'</h3><form novalidate><label>Título<input data-field="titulo" maxlength="120" value="'+esc(a.form.titulo)+'" aria-label="Título do registro"></label><p class="field-error">'+esc(a.errors.titulo||'')+'</p><label>Resumo<textarea data-field="resumo" maxlength="1200" aria-label="Resumo do registro">'+esc(a.form.resumo)+'</textarea></label><p class="field-error">'+esc(a.errors.resumo||'')+'</p><button type="submit">Registrar</button>'+b('Cancelar','cancel')+b('Testar dois toques','double')+'</form><p class="small">Estado: <output data-state></output></p>';
 else if(kind==='detail'){const x=a.detail();html=x?'<h3>'+esc(x.titulo)+'</h3><p>'+esc(x.resumo)+'</p>':'<h3>'+esc(a.missingText()||'Sem tratamento para item ausente')+'</h3>';html+=b('Voltar','back');}
 else html='<h3>Esta tela não abriu</h3><p>'+(kind==='layout'?'O layout ainda não organizou as telas.':'Confira o arquivo que atende a este endereço.')+'</p>'+b('Retornar à lista','home');
 mount.innerHTML='<div class="device-head">PRÉVIA DIDÁTICA · HTML/JS</div><div class="route">'+esc(a.route())+'</div><div class="screen">'+html+'</div><p class="feedback" role="status">'+esc(a.message)+'</p><div class="trace">Histórico: '+a.stack.map(esc).join(' → ')+'</div><div class="actions">'+b('Abrir ID 2 direto','direct',2)+b('Testar ID ausente','direct',999)+b('Lista','home')+'</div>';state();}
 function state(){const o=mount.querySelector('[data-state]');if(o)o.textContent=JSON.stringify(a.form);}
 mount.onclick=e=>{const t=e.target.closest('[data-act]');if(!t)return;const cmd=t.dataset.act;if(cmd==='open')a.open(t.dataset.id);if(cmd==='new')a.newForm();if(cmd==='back'||cmd==='cancel')a.cancel();if(cmd==='direct')a.direct(t.dataset.id);if(cmd==='home'){a.stack=[a.list];a.message='Lista restaurada. Dados preservados nesta sessão.';}if(cmd==='double'){a.submit();a.submit();a.finish();}onAction(cmd);render();};
 mount.oninput=e=>{if(e.target.dataset.field){e.target.value=a.input(e.target.dataset.field,e.target.value);state();onAction('input');}};
 mount.onsubmit=e=>{e.preventDefault();a.submit();a.finish();onAction('submit');render();};render();return {render};
}
window.Mobile6={VERSION,PROJECTS,GROUPS,KEYS,GOOD,config,App,evaluate,draw};
})();