/** QA oracle: generates a temporary reference in memory, never a student artifact.
 * This public test file is not confidential. Exclude tests/ from the Pages package.
 */
'use strict';
module.exports=function reference(starter){
 const from=starter.indexOf('// [03] MÁQUINA DE ESTADOS');
 const to=starter.indexOf('// [07] INTERFACE');
 if(from<0||to<0)throw Error('Starter incompatible with QA oracle');
 return starter.slice(0,from)+String.raw`
// [03] MÁQUINA DE ESTADOS
export function estadoTela(info: {carregando:boolean;erro:string|null;totalFonte:number;totalVisivel:number}):string {
 if(info.erro)return 'erro';
 if(info.carregando)return 'carregando';
 if(info.totalFonte===0)return 'vazio';
 if(info.totalVisivel===0)return 'sem-resultados';
 return 'pronto';
}
const normalize=(value:string)=>String(value||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
// [04] FILTRO
export function filtrarOrdenar(registros:Registro[],filtros:Filtros):Registro[]{
 const q=normalize(filtros.busca);
 const result=registros.filter(r=>(!q||normalize(r.titulo).includes(q))&&
   (filtros.categoria==='Todas'||r.categoria===filtros.categoria)&&
   (filtros.periodo==='Todos'||r.periodo===filtros.periodo));
 const direction=filtros.ordem==='za'?-1:1;
 return result.sort((a,b)=>{const x=normalize(a.titulo),y=normalize(b.titulo);
  const order=x<y?-1:x>y?1:0;return direction*order;});
}
// [05] NAVEGAÇÃO E FORMULÁRIO
export function obterPorId(registros:Registro[],id:string):Registro|null{
 return registros.find(r=>r.id===id)||null;
}
export function validarFormulario(formulario:Partial<Registro>,registros:Registro[]):{ok:boolean;erros:Record<string,string>;valor?:Registro}{
 const titulo=String(formulario.titulo||'').trim(),descricao=String(formulario.descricao||'').trim();
 const erros:Record<string,string>={};
 if(titulo.length<5||titulo.length>60)erros.titulo='Título deve ter 5 a 60 caracteres.';
 if(descricao.length<10||descricao.length>180)erros.descricao='Descrição deve ter 10 a 180 caracteres.';
 if(!['Lugar','Evento','Indicador'].includes(formulario.categoria||''))erros.categoria='Categoria inválida.';
 if(registros.some(r=>r.trilha===formulario.trilha&&normalize(r.titulo)===normalize(titulo)))erros.titulo='Título duplicado nesta trilha.';
 const ok=Object.keys(erros).length===0;
 return {ok,erros,...(ok?{valor:{...formulario,titulo,descricao} as Registro}:{})};
}
export function inserirImutavel(registros:Registro[],novo:Registro):Registro[]{
 return registros.some(r=>r.id===novo.id)?registros:[...registros,novo];
}
// [06] REGRESSÃO + RESUMO
export function resumir(registros:Registro[]):{total:number;porCategoria:Record<string,number>;ids:string[]}{
 const porCategoria:Record<string,number>=Object.create(null);
 for(const r of registros)porCategoria[r.categoria]=(porCategoria[r.categoria]||0)+1;
 return {total:registros.length,porCategoria,ids:registros.map(r=>r.id)};
}
`+starter.slice(to);
};
