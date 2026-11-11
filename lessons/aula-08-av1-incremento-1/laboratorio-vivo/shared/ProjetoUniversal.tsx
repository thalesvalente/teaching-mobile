/**
 * IFMA · Aula 08 Mobile · Laboratório Vivo · fonte completa da bancada.
 * Desafio avançado: as seis funções do domínio começam incompletas.
 * Edite e teste as regras sem apagar os tipos, os identificadores ou a interface.
 * Os dados são FICTÍCIOS. Não há API, conta institucional ou envio automático.
 *
 * Na trilha Expo, use os mesmos contratos em projeto/src/engine.mjs.
 */
// [01] IMPORTAÇÕES
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

// [02] DADOS E CONTRATOS DO DOMÍNIO
export type Registro = {
  id: string; titulo: string; descricao: string; categoria: string;
  periodo: string; trilha: string;
};
export type Filtros = { busca: string; categoria: string; periodo: string; ordem: string };
export const REGISTROS: Registro[] = [
  { id:'m-01', titulo:'Fotografia da praça', descricao:'Registro fictício suficientemente longo.', categoria:'Lugar', periodo:'Manhã', trilha:'memorias' },
  { id:'m-02', titulo:'Memória da feira', descricao:'Evento fictício para estudo da turma.', categoria:'Evento', periodo:'Tarde', trilha:'memorias' },
  { id:'m-03', titulo:'Mapa da praça', descricao:'Outro lugar de exemplo da lista.', categoria:'Lugar', periodo:'Noite', trilha:'memorias' },
  { id:'e-01', titulo:'Frequência agregada', descricao:'Indicador simulado, sem pessoas reais.', categoria:'Indicador', periodo:'Manhã', trilha:'eda' },
];

// [03] MÁQUINA DE ESTADOS — MISSÕES M1-01 A M1-05
// Erro tem precedência; base vazia difere de filtro sem resultados.
export function estadoTela(info: {
  carregando: boolean; erro: string | null; totalFonte: number; totalVisivel: number;
}): string {
  // TODO M1: corrigir prioridade e os cinco estados esperados.
  return 'pendente';
}

// [04] FILTRO + ORDENAÇÃO SEM MUTAÇÃO — MISSÕES M2-01 A M2-04
// Os IDs são strings opacas. NÃO execute sort() no array de origem.
export function filtrarOrdenar(registros: Registro[], filtros: Filtros): Registro[] {
  // TODO M2: normalizar caixa/acentos, combinar filtros AND e ordenar
  // sem alterar a coleção nem recriar os próprios objetos de Registro.
  return [];
}

// [05] NAVEGAÇÃO E FORMULÁRIO — MISSÕES M3-01 A M3-06
export function obterPorId(registros: Registro[], id: string): Registro | null | undefined {
  // TODO M3-A: correspondência exata; desconhecido precisa ser null.
  return undefined;
}
export function validarFormulario(
  formulario: Partial<Registro>, registros: Registro[]
): { ok: boolean; erros: Record<string,string>; valor?: Registro } {
  // TODO M3-B: título 5–60; descrição 10–180; categoria conhecida;
  // espaços nas pontas; nomes duplicados (acentos/caixa) na mesma trilha.
  return { ok:false, erros:{titulo:'Ainda não implementado.'} };
}
export function inserirImutavel(registros: Registro[], novo: Registro): Registro[] {
  // TODO M3-C/M4-A: criar novo array; nunca duplicar IDs após dois toques.
  return registros;
}

// [06] REGRESSÃO + RESUMO — MISSÕES M4-01 A M4-05
export function resumir(registros: Registro[]): {
  total:number; porCategoria:Record<string,number>; ids:string[];
} {
  // TODO M4: resultado determinístico, seguro no vazio, sem reordenação.
  return { total:-1, porCategoria:{}, ids:[] };
}

// [07] INTERFACE QUE USA AS MESMAS FUNÇÕES EM DUAS PRÉVIAS
const categorias=['Todas','Lugar','Evento','Indicador'];
const periodos=['Todos','Manhã','Tarde','Noite'];
const ordens=['az','za'];
export default function ProjetoUniversal() {
  const [todos,setTodos]=useState<Registro[]>(REGISTROS);
  const [busca,setBusca]=useState('');
  const [categoria,setCategoria]=useState('Todas');
  const [periodo,setPeriodo]=useState('Todos');
  const [ordem,setOrdem]=useState('az');
  const [tela,setTela]=useState<'lista'|'detalhe'|'novo'>('lista');
  const [selecionado,setSelecionado]=useState('');
  const [carregando,setCarregando]=useState(false);
  const [erro,setErro]=useState<string|null>(null);
  const [titulo,setTitulo]=useState('');
  const [descricao,setDescricao]=useState('');
  const [erroForm,setErroForm]=useState('');
  const [aviso,setAviso]=useState('');
  const filtros={busca,categoria,periodo,ordem};
  const filtrados=useMemo(()=>{
    const items=filtrarOrdenar(todos,filtros);
    return Array.isArray(items)?items:[];
  },[todos,busca,categoria,periodo,ordem]);
  const estado=estadoTela({carregando,erro,totalFonte:todos.length,totalVisivel:filtrados.length});
  const detalhe=obterPorId(todos,selecionado);
  const resumo=resumir(filtrados);
  const proxima=(lista:string[],atual:string,set:(x:string)=>void)=>{
    const i=lista.indexOf(atual);set(lista[(i+1)%lista.length]);
  };
  const abrir=(id:string)=>{setSelecionado(id);setTela('detalhe');};
  const voltar=()=>{setTela('lista');setAviso('Retorno: preserve busca, categoria e período.');};
  const salvar=()=>{
    const novo={id:'novo-'+String(todos.length+1),titulo,descricao,categoria:'Lugar',periodo:'Manhã',trilha:'memorias'};
    const valid=validarFormulario(novo,todos);
    if(!valid || !valid.ok){setErroForm(Object.values(valid?.erros||{}).join(' · ')||'Registro inválido.');return;}
    setErroForm('');
    const proximo=inserirImutavel(todos,valid.valor||novo);
    setTodos(Array.isArray(proximo)?proximo:todos);
    setAviso('Confira se não houve duplicação e se os filtros foram preservados.');
    setTela('lista');
  };
  const botao=(rotulo:string,acao:()=>void,extra?:any)=>(
    <Pressable accessibilityRole="button" accessibilityLabel={rotulo}
      onPress={acao} style={extra||styles.botoes}><Text style={styles.botaoTexto}>{rotulo}</Text></Pressable>
  );
  return <View style={styles.pagina} testID="app-a08">
    <Text style={styles.selo}>IFMA · MOBILE · AULA 08 · AV1</Text>
    <Text style={styles.titulo}>Dados sob pressão</Text>
    <Text style={styles.intro}>Os erros são intencionais. Corrija o motor e observe o comportamento.</Text>
    <View style={styles.nav}>
      {botao('Lista',voltar)}
      {botao('Novo registro',()=>setTela('novo'))}
    </View>
    {tela==='lista' ? <>
      <Text style={styles.rotulo}>Pesquisar na coleção</Text>
      <TextInput testID="busca" accessibilityLabel="Pesquisar registros"
        value={busca} onChangeText={setBusca} placeholder="Ex.: PRACA"
        style={styles.campo} />
      <View style={styles.filtros}>
        {botao('Categoria: '+categoria,()=>proxima(categorias,categoria,setCategoria))}
        {botao('Período: '+periodo,()=>proxima(periodos,periodo,setPeriodo))}
        {botao('Ordem: '+ordem.toUpperCase(),()=>proxima(ordens,ordem,setOrdem))}
      </View>
      <View style={styles.nav}>
        {botao('Simular erro',()=>{setErro('Falha de conexão simulada');setCarregando(true);})}
        {botao('Limpar erro',()=>{setErro(null);setCarregando(false);})}
        {botao('Carregando',()=>{setErro(null);setCarregando(true);})}
      </View>
      <Text testID="status" style={styles.status}>Estado: {estado}</Text>
      <Text testID="resumo" style={styles.resumo}>Resumo: {String(resumo?.total??'?')} registros visíveis</Text>
      {filtrados.map((r,idx)=><Pressable key={r.id+'-'+idx} testID={'registro-'+r.id}
          accessibilityRole="button" onPress={()=>abrir(r.id)} style={styles.item}>
        <Text style={styles.itemTitulo}>{r.titulo}</Text><Text style={styles.itemMeta}>{r.id} · {r.categoria} · {r.periodo}</Text>
      </Pressable>)}
      {!filtrados.length && <Text style={styles.ajuda}>Nenhum resultado visível. Descubra se é defeito no filtro ou na fonte.</Text>}
    </> : null}
    {tela==='detalhe' ? <View style={styles.detalhe}>
      <Text style={styles.rotulo}>Detalhe do ID {selecionado}</Text>
      <Text testID="titulo-detalhe" style={styles.itemTitulo}>{detalhe?.titulo||'ID não encontrado'}</Text>
      <Text style={styles.intro}>{detalhe?.descricao||'O contrato deve devolver null sem abrir um registro errado.'}</Text>
      {botao('Voltar sem perder filtros',voltar)}
    </View> : null}
    {tela==='novo' ? <View style={styles.detalhe}>
      <Text style={styles.rotulo}>Novo registro (simulado)</Text>
      <TextInput accessibilityLabel="Título do novo registro" testID="novo-titulo"
        value={titulo} onChangeText={setTitulo} style={styles.campo} placeholder="Título de 5–60 caracteres" />
      <TextInput accessibilityLabel="Descrição do novo registro" testID="nova-descricao"
        value={descricao} onChangeText={setDescricao} style={styles.campo}
        multiline placeholder="Descrição de 10–180 caracteres" />
      <Text style={styles.ajuda}>Valide espaços, duplicatas e limites antes de inserir.</Text>
      {erroForm ? <Text accessibilityRole="alert" style={styles.erro}>{erroForm}</Text> : null}
      {botao('Salvar registro',salvar)}
      {botao('Cancelar',voltar)}
    </View> : null}
    {aviso ? <Text style={styles.ajuda}>{aviso}</Text> : null}
    <Text style={styles.rodape}>Dados sintéticos · XP formativos · prévia Web não equivale a dispositivo nativo.</Text>
  </View>;
}
const styles=StyleSheet.create({
  pagina:{width:'100%',backgroundColor:'#fff',borderRadius:12,padding:16},
  selo:{fontWeight:'900',color:'#086342',fontSize:11},
  titulo:{color:'#123d2b',fontSize:22,fontWeight:'900',marginTop:6},
  intro:{color:'#4c6255',fontSize:12,lineHeight:17,marginBottom:10,marginTop:3},
  nav:{flexDirection:'row',flexWrap:'wrap',gap:5,marginTop:8,marginBottom:7},
  filtros:{flexDirection:'row',flexWrap:'wrap',gap:5,marginTop:7},
  botoes:{backgroundColor:'#0c6844',borderRadius:7,paddingVertical:8,paddingHorizontal:10,marginRight:4,marginBottom:4,minHeight:40,justifyContent:'center'},
  botaoTexto:{color:'#fff',fontSize:11,fontWeight:'700'},
  rotulo:{fontSize:12,fontWeight:'800',color:'#274b35',marginTop:10,marginBottom:5},
  campo:{borderWidth:1,borderColor:'#91aa96',borderRadius:8,padding:10,minHeight:43,fontSize:14,color:'#193c29'},
  status:{color:'#9e4a21',fontWeight:'800',fontSize:13,marginTop:10},
  resumo:{color:'#115b42',fontWeight:'800',fontSize:12,marginTop:6,marginBottom:7},
  item:{padding:10,borderWidth:1,borderColor:'#d5e5da',borderRadius:9,backgroundColor:'#f4faf6',marginVertical:4},
  itemTitulo:{fontSize:13,fontWeight:'800',color:'#19422c'},
  itemMeta:{fontSize:11,color:'#5a7565',marginTop:3},
  detalhe:{backgroundColor:'#f3f9f5',padding:11,borderRadius:10,marginTop:8},
  erro:{color:'#a42421',fontSize:12,fontWeight:'700',marginVertical:5},
  ajuda:{fontSize:12,color:'#56715f',marginTop:9,lineHeight:17},
  rodape:{fontSize:10,color:'#718579',marginTop:16},
});