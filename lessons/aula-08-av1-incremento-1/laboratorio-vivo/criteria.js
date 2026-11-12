/** Os mesmos 20 contratos alimentam bancada e Expo. Sem solução de referência. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MobileA08Criteria=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function create(app){
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
  i('M3-02','M3','ID desconhecido devolve null',()=>{eq(app.obterPorId(clone(seed),'m-999'),null);eq(app.obterPorId(clone(seed),'M-03'),null);eq(app.obterPorId([], 'm-01'),null);}),
  i('M3-03','M3','Validação aceita valores corretos após trim',()=>{const v=app.validarFormulario({...form,titulo:'  Novo memorial  '},clone(seed));assert(v.ok===true);assert(!v.erros?.titulo);const bad=app.validarFormulario({...form,titulo:'x'.repeat(61),descricao:'x'.repeat(181)},clone(seed));assert(bad.ok===false&&bad.erros?.titulo&&bad.erros?.descricao,'Respeite os limites máximos de 60/180 caracteres');const category=app.validarFormulario({...form,categoria:'Desconhecida'},clone(seed));assert(category.ok===false&&category.erros?.categoria,'Categoria deve pertencer ao catálogo')}),
  i('M3-04','M3','Validação rejeita título/descrição insuficientes',()=>{const v=app.validarFormulario({...form,titulo:' ab ',descricao:'curta'},clone(seed));assert(v.ok===false&&v.erros?.titulo&&v.erros?.descricao)}),
  i('M3-05','M3','Título repetido após normalizar acento/caixa é inválido na mesma trilha',()=>{const v=app.validarFormulario({...form,titulo:'fotografia da PRACA'},clone(seed));assert(v.ok===false&&/duplicad|repetid|existe/i.test(v.erros?.titulo||''));const other=app.validarFormulario({...form,titulo:'Fotografia da praça',trilha:'eda'},clone(seed));assert(other.ok===true,'Homônimos de trilhas diferentes são permitidos')}),
  i('M3-06','M3','Inserção cria novo array sem mutar a fonte',()=>{const before=clone(seed),extra={...seed[0],id:'m-05',titulo:'Novo registro'};const after=app.inserirImutavel(before,extra);assert(after!==before&&after.length===before.length+1);eq(after.at(-1),extra);eq(before,seed)}),
  i('M4-01','M4','Idempotência: repetir toque/ID não duplica',()=>{const novo={...seed[0],id:'x-2'};const a=app.inserirImutavel(clone(seed),novo);const b=app.inserirImutavel(a,novo);assert(a.length===5&&b.length===5);eq(b.filter(x=>x.id==='x-2').length,1)}),
  i('M4-02','M4','Resumo conta total e IDs sem perda',()=>{const r=app.resumir(clone(seed));eq(r.total,4);eq(r.ids,['m-01','m-02','m-03','e-01'])}),
  i('M4-03','M4','Resumo contabiliza categorias corretamente',()=>{const r=app.resumir(clone(seed));eq(r.porCategoria,{Lugar:2,Evento:1,Indicador:1})}),
  i('M4-04','M4','Resumo de base vazia é seguro',()=>eq(app.resumir([]),{total:0,porCategoria:{},ids:[]})),
  i('M4-05','M4','Resumo não modifica nem reordena a fonte',()=>{const src=clone(seed),before=JSON.stringify(src);const out=app.resumir(src);assert(out.total===4);eq(JSON.stringify(src),before);eq(app.resumir(clone(seed)),out);const custom=[{...seed[0],categoria:'constructor'},{...seed[1],categoria:'__proto__'}];const c=app.resumir(custom);assert(Object.hasOwn(c.porCategoria,'constructor')&&c.porCategoria.constructor===1,'Contador deve tratar nomes como dados');assert(Object.hasOwn(c.porCategoria,'__proto__')&&c.porCategoria.__proto__===1,'Categoria não pode alterar protótipos')})
];

return casos;
}
return Object.freeze({create});
});
