import React,{useRef,useState} from 'react';
import {router} from 'expo-router';
import {Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View} from 'react-native';
import {useDomain} from '../src/DomainStore';
export default function Novo(){
  const {trilha,cadastrar}=useDomain();
  const [titulo,setTitulo]=useState('');const [descricao,setDescricao]=useState('');
  const [categoria,setCategoria]=useState(trilha==='eda'?'Indicador':'Lugar');
  const [periodo,setPeriodo]=useState('Manhã');
  const [erros,setErros]=useState<Record<string,string>>({});
  const bloqueado=useRef(false);
  function salvar(){
    if(bloqueado.current)return;
    bloqueado.current=true;
    const resultado=cadastrar({titulo,descricao,categoria,periodo});
    if(resultado.ok){router.replace('/');return;}
    setErros(resultado.erros);bloqueado.current=false;
  }
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
    <Text accessibilityRole="header" style={s.titulo}>Novo registro seguro</Text><Text>Os dados são fictícios e ficam apenas nesta execução.</Text>
    <Text style={s.label}>Título (5–60 caracteres)</Text><TextInput accessibilityLabel="Título do registro" accessibilityHint="Informe entre cinco e sessenta caracteres" style={s.campo} value={titulo} onChangeText={setTitulo} maxLength={80} placeholder="Título de exemplo"/>{erros.titulo?<Text accessibilityRole="alert" style={s.erro}>{erros.titulo}</Text>:null}
    <Text style={s.label}>Descrição (10–180 caracteres)</Text><TextInput accessibilityLabel="Descrição do registro" multiline style={[s.campo,s.textarea]} value={descricao} onChangeText={setDescricao} maxLength={200}/>{erros.descricao?<Text accessibilityRole="alert" style={s.erro}>{erros.descricao}</Text>:null}
    <Text style={s.label}>Categoria</Text><View style={s.linha}>{(trilha==='eda'?['Indicador','Ação']:['Lugar','Evento']).map(c=><Pressable key={c} accessibilityRole="button" accessibilityState={{selected:categoria===c}} onPress={()=>setCategoria(c)} style={[s.chip,categoria===c&&s.ativo]}><Text>{c}</Text></Pressable>)}</View>
    <Text style={s.label}>Período</Text><View style={s.linha}>{['Manhã','Tarde','Noite'].map(p=><Pressable key={p} accessibilityRole="button" accessibilityState={{selected:periodo===p}} onPress={()=>setPeriodo(p)} style={[s.chip,periodo===p&&s.ativo]}><Text>{p}</Text></Pressable>)}</View>
    {erros.categoria?<Text accessibilityRole="alert" style={s.erro}>{erros.categoria}</Text>:null}{erros.formulario?<Text accessibilityRole="alert" style={s.erro}>{erros.formulario}</Text>:null}
    <Pressable accessibilityRole="button" style={s.botao} onPress={salvar}><Text style={s.bt}>Validar e salvar uma vez</Text></Pressable>
  </ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#ecf6f2'},conteudo:{padding:18,paddingBottom:60,gap:9},titulo:{fontSize:25,fontWeight:'900',color:'#0a4741'},label:{marginTop:12,fontWeight:'800',color:'#16453f'},campo:{borderWidth:1,borderColor:'#7bada1',padding:12,borderRadius:9,backgroundColor:'#fff',minHeight:48},textarea:{minHeight:110,textAlignVertical:'top'},linha:{flexDirection:'row',gap:8,flexWrap:'wrap'},chip:{backgroundColor:'#d5e7df',minHeight:44,padding:12,borderRadius:10,justifyContent:'center'},ativo:{backgroundColor:'#8ee2cd'},erro:{color:'#a12424',fontWeight:'700'},botao:{marginTop:18,padding:15,minHeight:50,backgroundColor:'#0d6257',borderRadius:10},bt:{textAlign:'center',color:'#fff',fontWeight:'900'}});
