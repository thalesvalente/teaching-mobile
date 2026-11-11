import React from 'react';
import {router} from 'expo-router';
import {FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import {useDomain} from '../src/DomainStore';
import {resumir} from '../src/engine.mjs';

const categorias=['Todas','Lugar','Evento','Indicador','Ação'];
const periodos=['Todos','Manhã','Tarde','Noite'];
export default function Inicio(){
  const d=useDomain();
  const resumo=resumir(d.visiveis);
  return <SafeAreaView style={s.safe}>
    <View style={s.cabecalho}><Text style={s.sobretitulo}>AV1 · DESAFIO AVANÇADO</Text><Text style={s.titulo}>Operação: dados sob pressão</Text><Text style={s.subtitulo}>Resolva os seis TODOs do motor e teste os fluxos reais.</Text></View>
    <View style={s.linha}>
      <Pressable accessibilityRole="button" accessibilityState={{selected:d.trilha==='memorias'}} style={[s.chip,d.trilha==='memorias'&&s.ativo]} onPress={()=>d.selecionarTrilha('memorias')}><Text style={s.chipTexto}>Memórias</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityState={{selected:d.trilha==='eda'}} style={[s.chip,d.trilha==='eda'&&s.ativo]} onPress={()=>d.selecionarTrilha('eda')}><Text style={s.chipTexto}>Permanência</Text></Pressable>
    </View>
    <TextInput accessibilityLabel="Buscar registros por título" style={s.campo} value={d.filtros.busca} onChangeText={busca=>d.alterarFiltros({busca})} placeholder="Pesquisar (com ou sem acento)" placeholderTextColor="#5b756f"/>
    <View style={s.linha}>{categorias.filter(c=>c==='Todas'||(d.trilha==='eda'?['Indicador','Ação'].includes(c):['Lugar','Evento'].includes(c))).map(c=><Pressable key={c} accessibilityRole="button" accessibilityState={{selected:d.filtros.categoria===c}} style={[s.chip,d.filtros.categoria===c&&s.ativo]} onPress={()=>d.alterarFiltros({categoria:c})}><Text style={s.chipTexto}>{c}</Text></Pressable>)}</View>
    <View style={s.linha}>{periodos.map(p=><Pressable key={p} accessibilityRole="button" accessibilityState={{selected:d.filtros.periodo===p}} style={[s.chip,d.filtros.periodo===p&&s.ativo]} onPress={()=>d.alterarFiltros({periodo:p})}><Text style={s.chipTexto}>{p}</Text></Pressable>)}</View>
    <View style={s.linha}>
      <Pressable accessibilityRole="button" style={s.controle} onPress={()=>d.alterarFiltros({ordem:d.filtros.ordem==='az'?'za':'az'})}><Text style={s.controleTexto}>Ordenação {d.filtros.ordem.toUpperCase()}</Text></Pressable>
      <Pressable accessibilityRole="button" style={s.controle} onPress={d.carregar}><Text style={s.controleTexto}>Recarregar</Text></Pressable>
      <Pressable accessibilityRole="button" style={s.controle} onPress={d.simularErro}><Text style={s.controleTexto}>Simular erro</Text></Pressable>
    </View>
    <Text accessibilityRole="summary" style={s.resumo}>Estado: {d.estado} · {resumo.total >= 0?resumo.total:'—'} registros no recorte</Text>
    {d.estado==='erro'?<View style={s.aviso}><Text>{d.erro}</Text><Pressable accessibilityRole="button" onPress={d.carregar}><Text style={s.link}>Tentar novamente</Text></Pressable></View>:null}
    {d.estado==='carregando'?<Text style={s.aviso}>Carregando…</Text>:null}
    {d.estado==='vazio'?<Text style={s.aviso}>A coleção não tem registros.</Text>:null}
    {d.estado==='sem-resultados'?<Text style={s.aviso}>Nenhum registro corresponde aos filtros. Limpe a busca.</Text>:null}
    <FlatList data={d.estado==='pronto'?d.visiveis:[]} keyExtractor={item=>item.id} contentContainerStyle={s.lista} renderItem={({item})=><Pressable accessibilityRole="button" accessibilityLabel={`Abrir detalhe de ${item.titulo}`} style={s.cartao} onPress={()=>router.push({pathname:'/detalhe/[id]',params:{id:item.id}})}><Text style={s.itemTitulo}>{item.titulo}</Text><Text style={s.itemMeta}>{item.categoria} · {item.periodo}</Text><Text style={s.itemSub}>{item.descricao}</Text></Pressable>}/>
    <Pressable accessibilityRole="button" accessibilityLabel="Criar registro novo" style={s.acao} onPress={()=>router.push('/novo')}><Text style={s.acaoTexto}>+ Registrar novo item</Text></Pressable>
  </SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#edf6f2'},cabecalho:{backgroundColor:'#093d39',padding:20},sobretitulo:{color:'#a4e3d4',fontSize:11,fontWeight:'800',letterSpacing:1.5},titulo:{color:'#fff',fontSize:23,fontWeight:'900',marginTop:5},subtitulo:{color:'#d7eeea',marginTop:6},linha:{flexDirection:'row',flexWrap:'wrap',gap:7,paddingHorizontal:12,paddingVertical:6},chip:{backgroundColor:'#d5e9e1',paddingHorizontal:12,paddingVertical:9,borderRadius:12,minHeight:44,justifyContent:'center'},ativo:{backgroundColor:'#83ddc6'},chipTexto:{color:'#173b35',fontWeight:'700'},campo:{marginHorizontal:12,marginTop:12,padding:12,borderWidth:1,borderColor:'#7daba0',backgroundColor:'#fff',borderRadius:9,minHeight:48,color:'#102d2a'},controle:{backgroundColor:'#123f48',paddingHorizontal:11,paddingVertical:9,borderRadius:8,minHeight:44,justifyContent:'center'},controleTexto:{color:'#fff',fontWeight:'700'},resumo:{marginHorizontal:12,marginTop:8,fontWeight:'700',color:'#1f5148'},aviso:{backgroundColor:'#fff0d6',padding:15,margin:12,borderRadius:8,color:'#724b16'},link:{textDecorationLine:'underline',color:'#005d56',fontWeight:'800',paddingVertical:10},lista:{padding:12,gap:8,paddingBottom:24},cartao:{backgroundColor:'#fff',borderRadius:12,padding:14,borderWidth:1,borderColor:'#d0e4db',minHeight:88},itemTitulo:{fontSize:17,fontWeight:'800',color:'#113f3a'},itemMeta:{color:'#3f6860',fontWeight:'600',marginVertical:4},itemSub:{color:'#46615b'},acao:{backgroundColor:'#12594f',padding:14,margin:12,borderRadius:10,alignItems:'center',minHeight:50},acaoTexto:{color:'#fff',fontWeight:'900'}});
