/**
 * Aula 07 — rubrica original espelhada, sem alteração pedagógica.
 * FONTE: lessons/aula-07-estado-filtros/nucleo.js
 * blob SHA GitHub na base: f063d9c7ee36095c39d31c742574724cadfcfc81
 * Marcadores BEGIN/END são conferidos automaticamente no CI.
 */
const MobileRubricAula07 = (() => {
  const window = {};
/* BEGIN RUBRICA ORIGINAL nucleo.js */
/* Aula 07: modelo didático local compartilhado por prévias e verificações.
   As opções representam trechos conhecidos. Não há eval, compilação TSX ou rede. */
(() => {
'use strict';
const VERSION='1.1.0';
const PROJECTS={
 memorias:{nome:'Mapa de Memórias Quilombolas',categorias:['Relato','Lugar','Celebração'],rotulo:'Categoria',unidade:'memórias',dados:[
 {id:'m1',titulo:'Roda de histórias',descricao:'Encontro fictício para compartilhar histórias.',categoria:'Relato'},
 {id:'m2',titulo:'Praça das conversas',descricao:'Lugar inventado para atividades comunitárias.',categoria:'Lugar'},
 {id:'m3',titulo:'Festa da colheita',descricao:'Celebração simulada para a atividade.',categoria:'Celebração'},
 {id:'m4',titulo:'História do caminho',descricao:'Relato inventado sobre um caminho antigo.',categoria:'Relato'},
 {id:'m5',titulo:'Casa de encontros',descricao:'Ponto fictício que poderia ser listado antes do mapa.',categoria:'Lugar'},
 {id:'m6',titulo:'Cantigas da praça',descricao:'Celebração inventada, sem depoimentos reais.',categoria:'Celebração'}]},
 eda:{nome:'Permanência e Evasão Escolar',categorias:['atencao','adequado'],rotulo:'Situação',unidade:'indicadores',dados:[
 {id:'i1',titulo:'Frequência média',descricao:'Média fictícia; não identifica estudantes.',categoria:'atencao',periodo:'Semana 1',valor:88,unidade:'%'},
 {id:'i2',titulo:'Atividades entregues',descricao:'Percentual fictício de atividades entregues.',categoria:'adequado',periodo:'Semana 1',valor:94,unidade:'%'},
 {id:'i3',titulo:'Estudantes em acompanhamento',descricao:'Quantidade inventada, sem nomes.',categoria:'atencao',periodo:'Semana 1',valor:7,unidade:'estudantes'},
 {id:'i4',titulo:'Frequência média',descricao:'Outro período fictício, para praticar filtros.',categoria:'adequado',periodo:'Semana 2',valor:91,unidade:'%'},
 {id:'i5',titulo:'Atividades entregues',descricao:'Outro percentual fictício de entregas.',categoria:'atencao',periodo:'Semana 2',valor:86,unidade:'%'},
 {id:'i6',titulo:'Estudantes em acompanhamento',descricao:'Outra quantidade inventada.',categoria:'adequado',periodo:'Semana 2',valor:5,unidade:'estudantes'}]}
};
const nomeCategoria=c=>({Todas:'Todas',atencao:'Em atenção',adequado:'Adequado'}[c]||c);
const GROUPS=[
 {titulo:'Estado da tela',minutos:5,pontos:2,slides:['s04','s15','s16'],dica:'Carregando não significa vazio. Trate carregamento e erro antes de mostrar a lista. Depois diferencie base sem dados de filtro sem resultado.',campos:[
 ['prioridade','O que verificar primeiro?', [['lista','Verificar a lista vazia antes do status'],['status','Verificar carregamento e erro antes da lista']]],
 ['vazio','Como explicar uma lista vazia?', [['separar','Distinguir base vazia de filtro sem resultado'],['igual','Usar “Nenhum dado” em qualquer situação']]],
 ['retentar','Ao tocar em Tentar novamente', [['recuperar','Carregando → nova resposta simulada'],['parado','Manter o mesmo erro']]]]},
 {titulo:'Busca e filtros',minutos:7,pontos:3,slides:['s07','s08','s09','s10'],dica:'Guarde a busca no estado, compare texto normalizado, combine critérios com E (&&) e preserve a coleção original. Limpar deve restaurar todos os itens.',campos:[
 ['entrada','O campo de busca', [['fixo','value="" sem atualizar estado'],['estado','value={busca} onChangeText={setBusca}']]],
 ['normalizar','Antes de comparar o texto', [['tratar','trim().toLowerCase() nos dois textos'],['literal','Comparar exatamente como foi digitado']]],
 ['combinar','Texto e categoria devem passar', [['ou','textoOk || categoriaOk'],['e','textoOk && categoriaOk']]],
 ['origem','O que fazer com o resultado de filter?', [['apagar','Substituir a coleção original pelo recorte'],['preservar','Calcular visiveis sem substituir a coleção']]]]},
 {titulo:'Lista com identidade',minutos:5,pontos:2,slides:['s11','s12','s13'],dica:'data recebe o recorte; renderItem recebe o item atual. A key deve identificar esse registro mesmo quando sua posição muda. A prévia HTML não executa FlatList.',campos:[
 ['lista','Dados exibidos pela lista', [['todos','data={registros}'],['recorte','data={visiveis}']]],
 ['chave','Chave de cada item', [['indice','keyExtractor={(_, index) => String(index)}'],['id','keyExtractor={item => String(item.id)}']]],
 ['cartao','Qual registro desenhar?', [['primeiro','Sempre desenhar registros[0]'],['atual','Desenhar o item recebido por renderItem']]]]},
 {titulo:'Resumo visual coerente',minutos:8,pontos:3,slides:['s18','s19','s20','s22'],dica:'Lista, cartões e gráfico usam o mesmo recorte. Memórias: contar por categoria. EDA: manter unidades e comparar percentuais na escala 0–100, sem somar % a estudantes.',campos:[
 ['resumo','De onde vêm cartões e barras?', [['recorte','Do mesmo recorte da lista'],['base','Sempre de todos os dados']]],
 ['unidades','No gráfico de EDA', [['misturar','Comparar % e estudantes no mesmo eixo'],['separar','Somente % nas barras; estudantes em texto']]],
 ['escala','Como definir o comprimento da barra?', [['comum','Escala comum: contagem de memórias ou 0–100%'],['cheia','Toda barra com 100% de largura']]],
 ['texto','Além das cores e barras', [['somenteCor','Mostrar só as barras'],['legenda','Mostrar nome, valor e unidade em texto']]]]}
];
const GOOD={prioridade:'status',vazio:'separar',retentar:'recuperar',entrada:'estado',normalizar:'tratar',combinar:'e',origem:'preservar',lista:'recorte',chave:'id',cartao:'atual',resumo:'recorte',unidades:'separar',escala:'comum',texto:'legenda'};
const KEYS=GROUPS.flatMap(g=>g.campos.map(x=>x[0]));
function config(c={}){c=c&&typeof c==='object'&&!Array.isArray(c)?c:{};return Object.fromEntries(GROUPS.flatMap(g=>g.campos.map(([k,,ops])=>[k,ops.some(o=>o[0]===c[k])?c[k]:''])));}
const clone=a=>a.map(x=>({...x}));
class Modelo {
 constructor(c=GOOD,trilha='memorias'){this.c=config(c);this.trilha=Object.hasOwn(PROJECTS,trilha)?trilha:'memorias';this.projeto=PROJECTS[this.trilha];this.base=clone(this.projeto.dados);this.busca='';this.categoria='Todas';this.periodo='Todos';this.status='sucesso';}
 filtrar(){const norm=t=>this.c.normalizar==='tratar'?t.trim().toLowerCase():t;const q=norm(this.busca);return this.base.filter(item=>{const textoOk=norm(item.titulo).includes(q),catOk=this.categoria==='Todas'||item.categoria===this.categoria,periodoOk=this.periodo==='Todos'||item.periodo===this.periodo;return (this.c.combinar==='ou'?textoOk||catOk:textoOk&&catOk)&&periodoOk;});}
 mudar(chave,valor){if(chave==='busca'){if(this.c.entrada==='estado')this.busca=String(valor);}else if(chave==='categoria'&&['Todas',...this.projeto.categorias].includes(valor))this.categoria=valor;else if(chave==='periodo'&&['Todos','Semana 1','Semana 2'].includes(valor))this.periodo=valor;if(this.c.origem==='apagar')this.base=this.filtrar();}
 limpar(){this.busca='';this.categoria='Todas';this.periodo='Todos';}
 cenario(s){this.status=s==='erro'?'erro':s==='carregando'?'carregando':'sucesso';this.base=['vazia','carregando','erro'].includes(s)?[]:clone(this.projeto.dados);}
 retentar(){if(this.c.retentar==='recuperar'){this.status='sucesso';this.base=clone(this.projeto.dados);}}
 tela(){if(this.c.prioridade==='lista'&&this.base.length===0)return 'vazia';if(this.status==='carregando')return 'carregando';if(this.status==='erro')return 'erro';if(!this.base.length)return 'vazia';if(!this.filtrar().length)return this.c.vazio==='separar'?'semResultado':'vazia';return 'conteudo';}
 linhas(){const dados=this.c.lista==='todos'?this.base:this.filtrar();return dados.map((item,i)=>({key:this.c.chave==='indice'?String(i):String(item.id),item:this.c.cartao==='primeiro'?this.base[0]:item}));}
 resumo(){const dados=this.c.resumo==='base'?this.base:this.filtrar();return {total:dados.length,segundo:this.trilha==='memorias'?new Set(dados.map(x=>x.categoria)).size:dados.filter(x=>x.categoria==='atencao').length};}
 barras(){const dados=this.c.resumo==='base'?this.base:this.filtrar();let itens,max;if(this.trilha==='memorias'){itens=this.projeto.categorias.map(c=>({nome:c,valor:dados.filter(x=>x.categoria===c).length,unidade:'memórias'}));max=Math.max(1,...itens.map(x=>x.valor));}else{itens=dados.filter(x=>this.c.unidades==='misturar'||x.unidade==='%').map(x=>({nome:x.titulo+' · '+x.periodo,valor:x.valor,unidade:x.unidade}));max=100;}return itens.map(x=>({...x,largura:this.c.escala==='cheia'?100:100*x.valor/max,legenda:this.c.texto==='legenda'?`${x.nome}: ${x.valor} ${x.unidade}`:''}));}
}
// Critérios isolados: cada verificação usa apenas suas dependências declaradas.
// Trechos necessários em branco permanecem pendentes, sem zerar a etapa inteira.
const TESTS=[
 [0,'Carregando não aparece como lista vazia',m=>{m.base=[];m.status='carregando';return m.tela()==='carregando';}],
 [0,'Uma falha mostra erro e não falta de dados',m=>{m.base=[];m.status='erro';return m.tela()==='erro';}],
 [0,'Base vazia e busca sem resultado são diferentes',m=>{m.cenario('vazia');const a=m.tela()==='vazia';m.cenario('sucesso');m.mudar('busca','zzzz');return a&&m.tela()==='semResultado';}],
 [0,'Tentar novamente permite recuperar a lista',m=>{m.cenario('erro');m.retentar();return m.tela()==='conteudo'&&m.base.length===6;}],
 [1,'Digitar altera o estado da busca',m=>{m.mudar('busca','Teste');return m.busca==='Teste';}],
 [1,'Maiúsculas e espaços nas pontas não impedem a busca',m=>{m.mudar('busca',m.trilha==='memorias'?'  PRAÇA  ':'  FREQUÊNCIA  ');return m.filtrar().length===2;}],
 [1,'Texto E categoria precisam corresponder',m=>{m.mudar('busca',m.trilha==='memorias'?'praça':'Frequência');m.mudar('categoria',m.projeto.categorias[0]);return m.filtrar().length===(m.trilha==='memorias'?0:1);}],
 [1,'Texto inexistente produz zero resultados',m=>{m.mudar('busca','zzzz');return m.filtrar().length===0;}],
 [1,'Trocar categoria não apaga os outros registros',m=>{m.mudar('categoria',m.projeto.categorias[0]);return m.base.length===6;}],
 [1,'Limpar filtros traz de volta os seis registros',m=>{m.mudar('categoria',m.projeto.categorias[1]);m.limpar();return m.filtrar().length===6;}],
 [2,'A lista recebe apenas os itens filtrados',m=>{m.mudar('categoria',m.projeto.categorias[1]);return m.linhas().length===(m.trilha==='memorias'?2:3);}],
 [2,'A chave identifica o registro e não sua posição',m=>{const a=m.linhas();m.base.reverse();const b=m.linhas();return b.every(x=>a.find(y=>y.item.id===x.item.id)?.key===x.key);}],
 [2,'Cada cartão mostra seu próprio título',m=>{const a=m.linhas();return a.every((x,i)=>x.item.titulo===m.base[i].titulo)&&a[1].item.id!==a[0].item.id;}],
 [2,'O ID do registro é preservado após filtrar',m=>{const id=m.base[1].id;m.mudar('busca',m.base[1].titulo);return m.linhas().some(x=>x.key===String(id)&&x.item.id===id);}],
 [3,'O total dos cartões acompanha o filtro',m=>{m.mudar('categoria',m.projeto.categorias[1]);return m.resumo().total===(m.trilha==='memorias'?2:3);}],
 [3,'Resultado vazio tem contadores zerados',m=>{m.mudar('busca','zzzz');return m.resumo().total===0&&m.resumo().segundo===0;}],
 [3,'Barras usam os mesmos registros do recorte',m=>{m.mudar('categoria',m.projeto.categorias[1]);const b=m.barras();return m.trilha==='memorias'?b.map(x=>x.valor).join(',')==='0,2,0':b.length===2&&b.map(x=>x.valor).join(',')==='94,91';}],
 [3,'Percentuais e quantidades não compartilham o eixo',m=>{const e=new Modelo(m.c,'eda');return e.barras().length===4&&e.barras().every(x=>x.unidade==='%');}],
 [3,'Valores menores geram barras proporcionalmente menores',m=>{if(m.trilha==='memorias')m.base=m.base.slice(0,4);const b=m.barras();return m.trilha==='memorias'?b.map(x=>x.largura).join(',')==='100,50,50':b[0].largura===88&&b[1].largura===94;}],
 [3,'O gráfico tem rótulos, valores e unidades em texto',m=>m.barras().every(x=>x.legenda.includes(String(x.valor))&&x.legenda.includes(x.unidade))]
];
const DEPENDENCIES=[
 ['prioridade'],['prioridade'],['vazio'],['retentar'],
 ['entrada'],['entrada','normalizar','combinar'],['entrada','combinar'],['entrada','combinar'],['origem'],['origem'],
 ['lista'],['chave'],['cartao'],['lista','chave','cartao'],
 ['resumo'],['resumo'],['resumo','unidades'],['unidades'],['escala'],['texto']
];
function avaliar(c,p){const escolhido=config(c);return TESTS.map(([grupo,titulo,testar],i)=>{const dependencias=DEPENDENCIES[i];const faltantes=dependencias.filter(k=>!escolhido[k]);const completo=faltantes.length===0;const isolado={...GOOD};dependencias.forEach(k=>isolado[k]=escolhido[k]);let ok=false;try{ok=completo&&!!testar(new Modelo(isolado,p));}catch{ok=false;}return {id:i+1,grupo,titulo,status:completo?(ok?'passou':'ajustar'):'pendente',pontos:ok?.5:0,max:.5,dependencias:[...dependencias],faltantes};});}
window.Aula7=Object.freeze({VERSION,PROJECTS,GROUPS,GOOD,KEYS,Modelo,avaliar,config,nomeCategoria});
})();
/* END RUBRICA ORIGINAL nucleo.js */
  return window.Aula7;
})();
