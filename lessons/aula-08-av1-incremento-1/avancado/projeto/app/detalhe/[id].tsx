import React from 'react';
import {router,useLocalSearchParams} from 'expo-router';
import {Pressable,SafeAreaView,StyleSheet,Text,View} from 'react-native';
import {useDomain} from '../../src/DomainStore';
import {obterPorId} from '../../src/engine.mjs';
export default function Detalhe(){
  const {id}=useLocalSearchParams<{id:string}>();
  const {registros}=useDomain();
  const item=obterPorId(registros,typeof id==='string'?id:'');
  const voltar=()=>router.canGoBack()?router.back():router.replace('/');
  return <SafeAreaView style={s.tela}><View style={s.card}>
    {!item?<><Text accessibilityRole="header" style={s.titulo}>Registro não encontrado</Text><Text>O ID informado não existe. Não use outro registro como substituto.</Text></>:<><Text accessibilityRole="header" style={s.titulo}>{item.titulo}</Text><Text style={s.meta}>{item.categoria} · {item.periodo} · {item.trilha}</Text><Text style={s.texto}>{item.descricao}</Text><Text style={s.id}>Identificador estável: {item.id}</Text></>}
    <Pressable accessibilityRole="button" style={s.botao} onPress={voltar}><Text style={s.bt}>Voltar à lista com filtros</Text></Pressable>
  </View></SafeAreaView>;
}
const s=StyleSheet.create({tela:{flex:1,backgroundColor:'#eff7f4',padding:18},card:{backgroundColor:'#fff',padding:20,borderRadius:12,gap:13},titulo:{fontSize:24,fontWeight:'800',color:'#06463f'},meta:{fontWeight:'700',color:'#52736b'},texto:{fontSize:17},id:{color:'#64736e'},botao:{backgroundColor:'#145c51',padding:14,borderRadius:9,minHeight:48},bt:{textAlign:'center',fontWeight:'800',color:'white'}});
