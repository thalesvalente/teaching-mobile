import React, {createContext, useContext, useMemo, useRef, useState} from 'react';
import {SEED, type Registro} from './dados';
import {filtrarOrdenar, validarFormulario, inserirImutavel, estadoTela, type Filtros} from './engine.mjs';

type Trilha = 'memorias' | 'eda';
type Formulario = {titulo:string;descricao:string;categoria:string;periodo:string};
type ContextValue = {
  registros: Registro[]; visiveis: Registro[]; filtros: Filtros;
  trilha: Trilha; carregando:boolean; erro:string|null;
  estado:string; selecionarTrilha:(v:Trilha)=>void;
  alterarFiltros:(v:Partial<Filtros>)=>void;
  carregar:()=>void; simularErro:()=>void;
  cadastrar:(form:Formulario)=>{ok:boolean;erros:Record<string,string>};
};
const Contexto = createContext<ContextValue | null>(null);
const FILTROS: Filtros = {busca:'',categoria:'Todas',periodo:'Todos',ordem:'az'};

export function DomainProvider({children}:{children:React.ReactNode}) {
  const [registros,setRegistros] = useState<Registro[]>([...SEED]);
  const [trilha,setTrilha] = useState<Trilha>('memorias');
  const [filtros,setFiltros] = useState<Filtros>(FILTROS);
  const [carregando,setCarregando] = useState(false);
  const [erro,setErro] = useState<string|null>(null);
  const pedido = useRef(0);
  const sequenciaId = useRef(0);
  const fonte = useMemo(()=>registros.filter(r=>r.trilha===trilha),[registros,trilha]);
  const visiveis = useMemo(()=>filtrarOrdenar(fonte,filtros),[fonte,filtros]);
  const estado = estadoTela({carregando,erro,totalFonte:fonte.length,totalVisivel:visiveis.length});

  function selecionarTrilha(v:Trilha){setTrilha(v);setFiltros(FILTROS);setErro(null);}
  function alterarFiltros(v:Partial<Filtros>){setFiltros(f=>({...f,...v}));}
  function carregar(){
    const atual=++pedido.current;
    setErro(null);setCarregando(true);
    setTimeout(()=>{if(atual===pedido.current)setCarregando(false);},500);
  }
  function simularErro(){++pedido.current;setCarregando(false);setErro('Falha simulada de leitura. Tente novamente.');}
  function cadastrar(form:Formulario){
    const verificacao=validarFormulario({...form,trilha},registros);
    if(!verificacao.ok)return {ok:false,erros:verificacao.erros};
    const id=`${trilha}-${Date.now()}-${++sequenciaId.current}`;
    const novo:Registro={id,titulo:form.titulo.trim(),descricao:form.descricao.trim(),categoria:form.categoria,periodo:form.periodo,trilha};
    const proximo=inserirImutavel(registros,novo);
    if(proximo.length!==registros.length+1)return {ok:false,erros:{formulario:'Registro duplicado ou não inserido.'}};
    setRegistros(proximo);
    return {ok:true,erros:{}};
  }
  return <Contexto.Provider value={{registros,visiveis,filtros,trilha,carregando,erro,estado,selecionarTrilha,alterarFiltros,carregar,simularErro,cadastrar}}>{children}</Contexto.Provider>;
}
export function useDomain(){const c=useContext(Contexto);if(!c)throw new Error('Provider ausente');return c;}
