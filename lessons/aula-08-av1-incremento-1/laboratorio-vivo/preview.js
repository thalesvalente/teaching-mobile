/** Aula 08 · Executor React Native Web isolado em iframe sandbox, sem servidor. */
(()=>{
'use strict';
const sender=window.parent;
const {React,ReactDOMClient,RNWeb,Babel}=window.LabVendor||{};
let app=null, token='',generation=0,webRoot=null,mobileRoot=null,readyConfirmed=false;
const post=(type,details={})=>sender.postMessage({from:'ifma-mobile-a08',type,token,...details},'*');
function compile(source){
 if(!Babel||!React||!RNWeb||!ReactDOMClient)throw Error('Bundle React Native Web indisponível.');
 if(typeof source!=='string'||source.length>30000)throw Error('Fonte TSX deve ter até 30 mil caracteres.');
 const transformed=Babel.transform(source,{filename:'ProjetoUniversal.tsx',presets:[['typescript',{isTSX:true,allExtensions:true}],['react',{runtime:'classic'}]],plugins:['transform-modules-commonjs'],comments:false}).code;
 const module={exports:{}};
 function allowed(name){if(name==='react')return React;if(name==='react-native')return RNWeb;throw Error('Importação indisponível nesta bancada: '+String(name));}
 (new Function('module','exports','require',transformed))(module,module.exports,allowed);
 if(typeof module.exports.default!=='function')throw Error('Exporte o componente padrão ProjetoUniversal.');
 const required=['estadoTela','filtrarOrdenar','obterPorId','validarFormulario','inserirImutavel','resumir'];
 for(const name of required)if(typeof module.exports[name]!=='function')throw Error('Contrato ausente: '+name);
 return module.exports;
}
function detach(){if(webRoot){webRoot.unmount();webRoot=null;}if(mobileRoot){mobileRoot.unmount();mobileRoot=null;}}
async function mount(){detach();webRoot=ReactDOMClient.createRoot(document.getElementById('web-root'));mobileRoot=ReactDOMClient.createRoot(document.getElementById('mobile-root'));webRoot.render(React.createElement(app.default));mobileRoot.render(React.createElement(app.default));await new Promise(r=>setTimeout(r,120));}
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
  i('M1-01','M1','Erro tem prioridade sobre carregamento',()=>eq(app.estadoTela({carregando:true,erro:'Falha',totalFonte:4,totalVisivel:4}),'erro')),
  i('M1-02','M1','Carregando sem erro',()=>eq(app.estadoTela({carregando:true,erro:null,totalFonte:4,totalVisivel:4}),'carregando')),
  i('M1-03','M1','Coleção realmente vazia',()=>eq(app.estadoTela({carregando:false,erro:null,totalFonte:0,totalVisivel:0}),'vazio')),
  i('M1-04','M1','Busca sem resultados não é coleção vazia',()=>eq(app.estadoTela({carregando:false,erro:null,totalFonte:4,totalVisivel:0}),'sem-resultados')),
  i('M1-05','M1','Dados prontos em estado estável',()=>eq(app.estadoTela({carregando:false,erro:null,totalFonte:4,totalVisivel:2}),'pronto')),
  i('M2-01','M2','Pesquisa ignora caixa e acentos',()=>eq(app.filtrarOrdenar(clone(seed),{...base,busca:' PRAÇA '}).map(x=>x.id),['m-01','m-03'])),
  i('M2-02','M2','Categoria e período combinados (AND)',()=>eq(app.filtrarOrdenar(clone(seed),{...base,categoria:'Lugar',periodo:'Noite'}).map(x=>x.id),['m-03'])),
  i('M2-03','M2','Ordenação Z-A com IDs íntegros',()=>eq(app.filtrarOrdenar(clone(seed),{...base,ordem:'za'}).map(x=>x.id),['m-02','m-03','e-01','m-01'])),
  i('M2-04','M2','A fonte não muda e o resultado preserva os objetos',()=>{const a=clone(seed),before=JSON.stringify(a);const b=app.filtrarOrdenar(a,{...base,busca:'mapa'});eq(b.map(x=>x.id),['m-03']);eq(JSON.stringify(a),before);assert(b[0]===a[2],'Não recrie IDs/objetos em cada filtro')}),
  i('M3-01','M3','Detalhe usa ID opaco exato',()=>eq(app.obterPorId(clone(seed),'m-03')?.titulo,'Mapa da praça')),
  i('M3-02','M3','ID desconhecido devolve null',()=>eq(app.obterPorId(clone(seed),'m-999'),null)),
  i('M3-03','M3','Validação aceita valores corretos após trim',()=>{const v=app.validarFormulario({...form,titulo:'  Novo memorial  '},clone(seed));assert(v.ok===true);assert(!v.erros?.titulo)}),
  i('M3-04','M3','Validação rejeita título/descrição insuficientes',()=>{const v=app.validarFormulario({...form,titulo:' ab ',descricao:'curta'},clone(seed));assert(v.ok===false&&v.erros?.titulo&&v.erros?.descricao)}),
  i('M3-05','M3','Título repetido após normalizar acento/caixa é inválido na mesma trilha',()=>{const v=app.validarFormulario({...form,titulo:'fotografia da PRACA'},clone(seed));assert(v.ok===false&&/duplicad|repetid|existe/i.test(v.erros?.titulo||''))}),
  i('M3-06','M3','Inserção cria novo array sem mutar a fonte',()=>{const before=clone(seed),extra={...seed[0],id:'m-05',titulo:'Novo registro'};const after=app.inserirImutavel(before,extra);assert(after!==before&&after.length===before.length+1);eq(after.at(-1),extra);eq(before,seed)}),
  i('M4-01','M4','Idempotência: repetir toque/ID não duplica',()=>{const novo={...seed[0],id:'x-2'};const a=app.inserirImutavel(clone(seed),novo);const b=app.inserirImutavel(a,novo);assert(a.length===5&&b.length===5);eq(b.filter(x=>x.id==='x-2').length,1)}),
  i('M4-02','M4','Resumo conta total e IDs sem perda',()=>{const r=app.resumir(clone(seed));eq(r.total,4);eq(r.ids,['m-01','m-02','m-03','e-01'])}),
  i('M4-03','M4','Resumo contabiliza categorias corretamente',()=>{const r=app.resumir(clone(seed));eq(r.porCategoria,{Lugar:2,Evento:1,Indicador:1})}),
  i('M4-04','M4','Resumo de base vazia é seguro',()=>eq(app.resumir([]),{total:0,porCategoria:{},ids:[]})),
  i('M4-05','M4','Resumo não modifica nem reordena a fonte',()=>{const src=clone(seed),before=JSON.stringify(src);const out=app.resumir(src);assert(out.total===4);eq(JSON.stringify(src),before)})
];
const byId=new Map(casos.map(t=>[t.id,t]));
function check(stage){const entry=byId.get(stage);if(!entry)throw Error('Critério inexistente.');entry.run();return {ok:true,detail:entry.descricao};}
window.addEventListener('message',async event=>{
 if(event.source!==sender)return;
 const msg=event.data;
 if(msg?.from==='ifma-mobile-a08-host'&&msg.type==='READY_ACK'&&typeof msg.token==='string'&&msg.token.length<=100){readyConfirmed=true;return;}
 if(!msg||msg.from!=='ifma-mobile-a08-host'||typeof msg.token!=='string'||msg.token.length>100||!Number.isSafeInteger(msg.revision)||msg.revision<0||!Number.isSafeInteger(msg.runId)||msg.runId<1)return;
 token=msg.token;const id=++generation,version={revision:msg.revision,runId:msg.runId};
 try{
   if(msg.type==='RUN'){
     app=null;detach();app=compile(msg.source);await mount();if(id===generation)post('COMPILED',{ok:true,...version});
   } else if(msg.type==='CHECK'){
     if(!app)throw Error('Execute o TSX antes de conferir.');
     const result=check(msg.stage);if(id===generation)post('CHECKED',{stage:msg.stage,...result,...version});
   } else if(msg.type==='CHECK_ALL'){
     if(!app)throw Error('Execute o TSX antes de conferir.');
     if(!Array.isArray(msg.stages)||msg.stages.length!==casos.length||new Set(msg.stages).size!==casos.length||msg.stages.some(stage=>!byId.has(stage)))throw Error('Conjunto de critérios incompatível.');
     const results=[];for(const stage of msg.stages){
       if(id!==generation)return;
       try{const c=check(stage);results.push({stage,ok:c.ok,detail:c.detail});}
       catch(e){results.push({stage,ok:false,detail:String(e?.message||e).slice(0,450)});}
     }if(id===generation)post('CHECKED_ALL',{results,...version});
   }
 }catch(e){if(id!==generation)return;const type=msg.type==='CHECK_ALL'?'CHECKED_ALL':msg.type==='CHECK'?'CHECKED':'COMPILED';post(type,{stage:msg.stage,ok:false,detail:String(e?.message||e).slice(0,450),...version});}
});
function announceReady(attempt=0){if(readyConfirmed||attempt>=20)return;post('READY');setTimeout(()=>announceReady(attempt+1),300);}announceReady();
})();
