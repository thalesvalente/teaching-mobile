/** Testes públicos formativos. Alterá-los nunca altera a nota oficial. */
import {canonical} from './contrato.mjs';
export const CRITERIA = Object.freeze({
  'M1-1':'Pacote e schema preparados', 'M1-2':'Fontes permitidas e hashes', 'M1-3':'Preflight registrado', 'M1-4':'Síntese de uso da IA registrada', 'M1-5':'Equipe e arquivos de tarefa consistentes',
  'M2-1':'Prioridade de carregamento e erro', 'M2-2':'Busca normalizada e filtros combinados', 'M2-3':'Coleção original preservada', 'M2-4':'Identidade estável',
  'M3-1':'Vazio e sem resultado', 'M3-2':'Tentar novamente', 'M3-3':'Lista, detalhe e retorno', 'M3-4':'Formulário e mensagens', 'M3-5':'Recorte após retorno', 'M3-6':'Resumo textual acessível',
  'M4-1':'Caso principal coletivo', 'M4-2':'Caso limite coletivo', 'M4-3':'Entrada inválida coletiva', 'M4-4':'Regressão coletiva', 'M4-5':'Contrato e limites coletivos'
});
const items = [
  {id:'c9',title:'Praça e ciência',category:'Ciência',period:'Manhã',value:70},
  {id:'a4',title:'Praça da arte',category:'Arte',period:'Tarde',value:40},
  {id:'b2',title:'Robótica',category:'Tecnologia',period:'Manhã',value:90}
];
const state = {screen:'list',selectedId:null,query:'praça',category:'Ciência',period:'Manhã'};
const c = (id, criterion, input, expected) => ({id,criterion,scope:'team',input,expected});
export const TEAM_CASES = Object.freeze([
  c('t1','M2-1',{op:'estado',loading:true,error:'Falha',items:[],filtered:[]},'carregando'),
  c('t2','M2-1',{op:'estado',loading:false,error:'Falha',items,filtered:items},'erro'),
  c('t3','M2-2',{op:'filtrar',items,query:'  PRACA ',category:'Ciência',period:'Manhã'},[items[0]]),
  c('t4','M2-2',{op:'filtrar',items,query:'',category:'Todas',period:'Tarde'},[items[1]]),
  c('t5','M2-3',{op:'filtrar',items,query:'',category:'Todas',period:'Todos'},items),
  c('t6','M2-4',{op:'chaves',items:[items[2],items[0]]},['b2','c9']),
  c('t7','M3-1',{op:'estado',loading:false,error:null,items:[],filtered:[]},'vazio'),
  c('t8','M3-1',{op:'estado',loading:false,error:null,items,filtered:[]},'sem-resultados'),
  c('t9','M3-2',{op:'tentar',state:{status:'erro',error:'Falha'}},{status:'carregando',error:null}),
  c('t10','M3-3',{op:'navegar',state,action:'open',id:'c9'},{...state,screen:'detail',selectedId:'c9'}),
  c('t11','M3-3',{op:'navegar',state:{...state,query:'',screen:'detail',selectedId:'c9'},action:'back'},{...state,query:''}),
  c('t12','M3-4',{op:'validar',form:{title:' ',category:''}},{valid:false,errors:{title:'Informe o título.',category:'Escolha a categoria.'}}),
  c('t13','M3-4',{op:'validar',form:{title:'Oficina',category:'Arte'}},{valid:true,errors:{}}),
  c('t14','M3-5',{op:'navegar',state:{...state,screen:'detail',selectedId:'c9'},action:'back'},state),
  c('t15','M3-6',{op:'resumo',items},{total:3,text:'3 registro(s) no recorte.'}),
  c('t16','M3-6',{op:'resumo',items:[]},{total:0,text:'0 registro(s) no recorte.'})
]);
export function individualCases(slot) {
  const tests = {
    1:[[{op:'normalizar',value:'  PRAÇA  '},'praca'],[{op:'normalizar',value:' '},''],[{op:'normalizar',value:123},''],[{op:'normalizar',value:'Ação e ÁGUA'},'acao e agua'],[{op:'normalizar',value:'a'.repeat(201)},'']],
    2:[[{op:'estado',loading:false,error:null,items,filtered:[]},'sem-resultados'],[{op:'estado',loading:false,error:null,items:[],filtered:[]},'vazio'],[{op:'estado',loading:false,error:null,items:null,filtered:[]},'erro'],[{op:'estado',loading:true,error:'Falha',items:[],filtered:[]},'carregando'],[{op:'estado',loading:false,error:null,items,filtered:items},'pronto']],
    3:[[{op:'validar',form:{title:'Oficina',category:'Arte'}},{valid:true,errors:{}}],[{op:'validar',form:{title:' ',category:''}},{valid:false,errors:{title:'Informe o título.',category:'Escolha a categoria.'}}],[{op:'validar',form:null},{valid:false,errors:{title:'Informe o título.',category:'Escolha a categoria.'}}],[{op:'validar',form:{title:'a'.repeat(80),category:'b'.repeat(40)}},{valid:true,errors:{}}],[{op:'validar',form:{title:'a'.repeat(81),category:'b'.repeat(41)}},{valid:false,errors:{title:'Use até 80 caracteres.',category:'Use até 40 caracteres.'}}]],
    4:[[{op:'chave',item:{id:'x2'}},'x2'],[{op:'chave',item:{id:0}},'0'],[{op:'chave',item:{}},null],[{op:'chave',item:{id:23}},'23'],[{op:'chave',item:{id:'a'.repeat(81)}},null]]
  };
  return tests[slot].map(([input,expected],i)=>({id:`s${slot}c${i+1}`,criterion:`M4-${i+1}`,scope:'individual',slot,input,expected}));
}
function passed(cases, outputs, criterion) {
  const selected = cases.filter(c => c.criterion === criterion);
  return selected.length > 0 && selected.every(c => {
    const out = outputs.find(x => x.id === c.id);
    try { return out?.ok === true && canonical(out.value) === canonical(c.expected) && (criterion !== 'M2-3' || out.unchanged === true); } catch { return false; }
  });
}
export function scorePublic({teamOutputs = [], individualOutputs = {}, evidence, slots = [1,2,3,4], packageValid = true, hashesValid = true, mappingValid = true}) {
  const checks = [packageValid,hashesValid,evidence?.preflight?.ok === true && evidence?.preflight?.filesReady === true,Array.isArray(evidence?.aiLog) && evidence.aiLog.length > 0,mappingValid];
  const criteria = checks.map((p,i)=>({id:`M1-${i+1}`,passed:p === true}));
  for (const m of ['M2','M3']) for (let n=1;n<=(m==='M2'?4:6);n++)
    criteria.push({id:`${m}-${n}`,passed:passed(TEAM_CASES,teamOutputs,`${m}-${n}`)});
  const shared = criteria.filter(c=>c.passed).length * .5;
  for (let n=1;n<=5;n++) {
    // Todos os arquivos selecionados participam do MESMO critério M4.
    const approved = slots.length>0 && slots.every(slot =>
      passed(individualCases(slot),individualOutputs[slot] || [],`M4-${n}`));
    criteria.push({id:`M4-${n}`,passed:approved});
  }
  const grade = criteria.filter(c=>c.passed).length * .5;
  return {criteria,shared,grade};
}
