export type Registro = { id:string; titulo:string; descricao:string; categoria:string; periodo:string; trilha:'memorias'|'eda' };
export type Filtros = { busca:string; categoria:string; periodo:string; ordem:'az'|'za' };
export function estadoTela(input:{carregando:boolean;erro:string|null;totalFonte:number;totalVisivel:number}):'erro'|'carregando'|'vazio'|'sem-resultados'|'pronto';
export function filtrarOrdenar(registros:Registro[], filtros:Filtros):Registro[];
export function obterPorId(registros:Registro[],id:string):Registro|null;
export function validarFormulario(formulario:{titulo:string;descricao:string;categoria:string;trilha:string;periodo:string},registros:Registro[]):{ok:boolean;erros:Record<string,string>;valor?:Registro};
export function inserirImutavel(registros:Registro[],novo:Registro):Registro[];
export function resumir(registros:Registro[]):{total:number;porCategoria:Record<string,number>;ids:string[]};
